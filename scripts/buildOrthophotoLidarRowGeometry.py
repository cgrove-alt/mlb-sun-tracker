#!/usr/bin/env python3
"""Build current row-geometry candidates from orthophoto seat bands and LiDAR."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

import numpy as np


ONE_FOOT_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalized_key(section: object, row: object) -> str:
    return f"{str(section).strip()}:{str(row).strip().upper()}"


def percentile(values: np.ndarray, amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values.size else None


def stable_holdout(row_key: str, ring_index: int, sample_index: int) -> bool:
    value = f"{row_key}:{ring_index}:{sample_index}"
    digest = hashlib.sha256(value.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def polygon_area_centroid(raw_ring: list[list[float]]) -> tuple[float, np.ndarray]:
    ring = np.asarray(raw_ring, dtype=np.float64)
    origin = ring[0]
    shifted = ring - origin
    x_values = shifted[:, 0]
    y_values = shifted[:, 1]
    next_x = np.roll(x_values, -1)
    next_y = np.roll(y_values, -1)
    cross = x_values * next_y - next_x * y_values
    signed_double_area = float(cross.sum())
    if abs(signed_double_area) < 1e-10:
        return 0.0, ring.mean(axis=0)
    area = abs(signed_double_area) / 2.0
    centroid = origin + np.asarray([
        float(((x_values + next_x) * cross).sum() / (3.0 * signed_double_area)),
        float(((y_values + next_y) * cross).sum() / (3.0 * signed_double_area)),
    ])
    return area, centroid


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("seat_band_validation", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--sample-spacing-metres", type=float, default=0.15)
    parser.add_argument("--minimum-lidar-samples", type=int, default=12)
    parser.add_argument("--minimum-finite-percent", type=float, default=90.0)
    parser.add_argument("--maximum-p90-p10-span-metres", type=float, default=0.60)
    arguments = parser.parse_args()

    venue = json.loads(arguments.venue_rows.read_text(encoding="utf-8"))
    bands = json.loads(arguments.seat_band_validation.read_text(encoding="utf-8"))
    raster = json.loads(arguments.raster_metadata.read_text(encoding="utf-8"))
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Invalid current venue-row artifact")
    if bands.get("artifactKind") != "orthophoto-row-seat-band-validation":
        raise ValueError("Invalid seat-band validation artifact")
    if raster.get("artifactKind") != "lidar-registration-control-raster":
        raise ValueError("Invalid raster metadata artifact")
    if venue["stadiumId"] != bands["stadiumId"] or venue["stadiumId"] != raster.get("stadiumId", venue["stadiumId"]):
        raise ValueError("Stadium identifiers do not match")

    dsm_hash = sha256_file(arguments.dsm_npy)
    expected_hash = raster.get("rasterOutputs", {}).get("dsmMaximumZMetres", {}).get("sha256")
    if expected_hash and expected_hash != dsm_hash:
        raise ValueError("DSM fingerprint does not match metadata")
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    grid = raster["grid"]
    if list(dsm.shape) != [grid["rows"], grid["columns"]]:
        raise ValueError("DSM shape does not match metadata")
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    cell_metres = float(grid["cellMetres"])

    rings_by_key: dict[str, list[dict]] = defaultdict(list)
    for ring in bands["rings"]:
        rings_by_key[ring["rowKey"]].append(ring)
    current_by_key = {}
    for row in venue["rows"]:
        key = normalized_key(row["sectionId"], row["rowId"])
        current_by_key[key] = row

    def sample_ring(row_key: str, ring: dict) -> dict:
        start, end = np.asarray(ring["correctedSeatBandLineMetres"], dtype=np.float64)
        length = float(np.linalg.norm(end - start))
        count = max(2, int(math.ceil(length / arguments.sample_spacing_metres)) + 1)
        points = start[None, :] + np.linspace(0.0, 1.0, count)[:, None] * (end - start)[None, :]
        columns = np.floor((points[:, 0] - minimum_x) / cell_metres).astype(np.int32)
        rows = np.floor((points[:, 1] - minimum_y) / cell_metres).astype(np.int32)
        inside = (
            (rows >= 0)
            & (rows < dsm.shape[0])
            & (columns >= 0)
            & (columns < dsm.shape[1])
        )
        unique_cells = []
        seen = set()
        for index, (row_index, column_index, is_inside) in enumerate(zip(rows, columns, inside)):
            if not is_inside:
                continue
            cell_key = (int(row_index), int(column_index))
            if cell_key in seen:
                continue
            seen.add(cell_key)
            unique_cells.append((index, cell_key))
        values = []
        control_values = []
        holdout_values = []
        for sample_index, (_, (row_index, column_index)) in enumerate(unique_cells):
            value = float(dsm[row_index, column_index])
            if not math.isfinite(value):
                continue
            values.append(value)
            if stable_holdout(row_key, int(ring["ringIndex"]), sample_index):
                holdout_values.append(value)
            else:
                control_values.append(value)
        all_values = np.asarray(values, dtype=np.float64)
        control_array = np.asarray(control_values, dtype=np.float64)
        holdout_array = np.asarray(holdout_values, dtype=np.float64)
        finite_percent = len(values) / max(len(unique_cells), 1) * 100.0
        p10 = percentile(all_values, 10)
        p90 = percentile(all_values, 90)
        span = p90 - p10 if p10 is not None and p90 is not None else None
        control_median = percentile(control_array, 50)
        holdout_median = percentile(holdout_array, 50)
        holdout_residual = (
            abs(control_median - holdout_median)
            if control_median is not None and holdout_median is not None
            else None
        )
        eligible = bool(
            ring["measurementEligible"]
            and len(values) >= arguments.minimum_lidar_samples
            and finite_percent >= arguments.minimum_finite_percent
            and control_array.size >= 8
            and holdout_array.size >= 3
            and span is not None
            and span <= arguments.maximum_p90_p10_span_metres
            and holdout_residual is not None
            and holdout_residual <= ONE_FOOT_METRES
        )
        return {
            "ringIndex": ring["ringIndex"],
            "correctedRowRingMetres": ring["correctedRowRingMetres"],
            "correctedSeatBandLineMetres": ring["correctedSeatBandLineMetres"],
            "orthophotoWithinRowHoldoutResidualMetres": ring["withinRowHoldoutResidualMetres"],
            "orthophotoSourcePolygonCorrectionMetres": ring["absoluteSourcePolygonCorrectionMetres"],
            "uniqueRasterCellCount": len(unique_cells),
            "finiteLidarSampleCount": len(values),
            "finiteLidarPercent": finite_percent,
            "lidarElevationMetresNavd88": {
                "p10": p10,
                "median": percentile(all_values, 50),
                "p90": p90,
            },
            "lidarP90P10SpanMetres": span,
            "lidarControlMedianMetresNavd88": control_median,
            "lidarHoldoutMedianMetresNavd88": holdout_median,
            "lidarHoldoutResidualMetres": holdout_residual,
            "measurementEligible": eligible,
            "blockers": [
                *([] if ring["measurementEligible"] else ["ORTHOPHOTO_RING_HOLDOUT_FAILED"]),
                *([] if len(values) >= arguments.minimum_lidar_samples else ["INSUFFICIENT_LIDAR_SAMPLES"]),
                *([] if finite_percent >= arguments.minimum_finite_percent else ["INSUFFICIENT_LIDAR_COVERAGE"]),
                *([] if control_array.size >= 8 and holdout_array.size >= 3 else ["INSUFFICIENT_LIDAR_HOLDOUT"]),
                *([] if span is not None and span <= arguments.maximum_p90_p10_span_metres else ["LIDAR_ROW_SURFACE_NOT_STABLE"]),
                *([] if holdout_residual is not None and holdout_residual <= ONE_FOOT_METRES else ["LIDAR_VERTICAL_HOLDOUT_FAILED"]),
            ],
        }

    candidates = []
    unresolved = []
    for row_key, current in sorted(current_by_key.items()):
        source_rings = sorted(rings_by_key.get(row_key, []), key=lambda item: item["ringIndex"])
        if not source_rings:
            unresolved.append({
                "rowKey": row_key,
                "sectionId": current["sectionId"],
                "rowId": current["rowId"],
                "blockers": ["NO_IDENTITY_MATCHED_ORTHOPHOTO_RING"],
            })
            continue
        measured_rings = [sample_ring(row_key, ring) for ring in source_rings]
        eligible = bool(measured_rings and all(ring["measurementEligible"] for ring in measured_rings))
        areas = []
        weighted_centroids = []
        medians = []
        for ring in measured_rings:
            area, centroid = polygon_area_centroid(ring["correctedRowRingMetres"])
            if area > 0:
                areas.append(area)
                weighted_centroids.append(area * centroid)
            elevation = ring["lidarElevationMetresNavd88"]["median"]
            if elevation is not None:
                medians.append(elevation)
        centroid = (
            np.sum(weighted_centroids, axis=0) / sum(areas)
            if areas else np.asarray([np.nan, np.nan])
        )
        candidates.append({
            "rowKey": row_key,
            "sectionId": current["sectionId"],
            "rowId": current["rowId"],
            "publishedSeatCount": current["publishedSeatCount"],
            "coordinateReferenceSystem": "EPSG:6347",
            "horizontalCentroidMetres": [float(value) for value in centroid],
            "rowSurfaceElevationMetresNavd88": float(np.median(medians)) if medians else None,
            "elevationReference": "lidar-dsm-top-of-visible-row-band",
            "rings": measured_rings,
            "measurementEligible": eligible,
            "publicationEligible": False,
            "blockers": [
                *([] if eligible else ["ONE_OR_MORE_ROW_RINGS_FAILED"]),
                "DSM_RETURN_SEMANTICS_NOT_SEAT_PAN",
            ],
        })

    eligible_candidates = [row for row in candidates if row["measurementEligible"]]
    ring_holdout_residuals = [
        ring["lidarHoldoutResidualMetres"]
        for row in eligible_candidates
        for ring in row["rings"]
        if ring["lidarHoldoutResidualMetres"] is not None
    ]
    stable = {
        "venueArtifactVersion": venue["artifactVersion"],
        "seatBandArtifactVersion": bands["artifactVersion"],
        "rasterArtifactVersion": raster["artifactVersion"],
        "dsmSha256": dsm_hash,
        "candidates": candidates,
        "unresolved": unresolved,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "orthophoto-lidar-current-row-geometry-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "venueArtifactVersion": venue["artifactVersion"],
            "seatBandArtifactVersion": bands["artifactVersion"],
            "orthophotoSourceYear": bands["sources"]["orthophotoSourceYear"],
            "orthophotoSha256": bands["sources"]["orthophotoSha256"],
            "rasterArtifactVersion": raster["artifactVersion"],
            "dsmSha256": dsm_hash,
        },
        "method": {
            "description": "Current row identity matched to orthophoto-resolved seat bands and LiDAR DSM elevation",
            "sampleSpacingMetres": arguments.sample_spacing_metres,
            "minimumLidarSamples": arguments.minimum_lidar_samples,
            "minimumFinitePercent": arguments.minimum_finite_percent,
            "maximumP90P10SpanMetres": arguments.maximum_p90_p10_span_metres,
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "lidarSplit": "sha256(rowKey:ringIndex:sampleIndex) modulo 5",
        },
        "counts": {
            "currentRows": len(current_by_key),
            "identityMatchedRows": len(candidates),
            "unresolvedIdentityRows": len(unresolved),
            "eligibleMetricCandidateRows": len(eligible_candidates),
        },
        "verticalHoldout": {
            "eligibleRingMedianResidualMetres": percentile(np.asarray(ring_holdout_residuals), 50),
            "eligibleRingP95ResidualMetres": percentile(np.asarray(ring_holdout_residuals), 95),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "CURRENT_ROW_SET_NOT_FULLY_GEOREFERENCED",
                "DSM_RETURN_SEMANTICS_NOT_SEAT_PAN",
                "OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": candidates,
        "unresolvedRows": unresolved,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "counts": artifact["counts"],
        "verticalHoldout": artifact["verticalHoldout"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

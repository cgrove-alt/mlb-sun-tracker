#!/usr/bin/env python3
"""Merge current club-linked row identities with independent georeferenced controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path

import numpy as np


ONE_FOOT_METRES = 0.3048


def normalized_key(section: object, row: object) -> str:
    return f"{str(section).strip()}:{str(row).strip().upper()}"


def stable_holdout(row_key: str) -> bool:
    digest = hashlib.sha256(row_key.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def polygon_area_centroid(raw_ring: list[list[float]]) -> tuple[float, np.ndarray]:
    ring = np.asarray(raw_ring, dtype=np.float64)
    if np.allclose(ring[0], ring[-1]):
        ring = ring[:-1]
    origin = ring[0]
    shifted = ring - origin
    x_values = shifted[:, 0]
    y_values = shifted[:, 1]
    next_x = np.roll(x_values, -1)
    next_y = np.roll(y_values, -1)
    cross = x_values * next_y - next_x * y_values
    signed_double_area = cross.sum()
    area = abs(signed_double_area) / 2.0
    centroid = origin + np.asarray([
        ((x_values + next_x) * cross).sum() / (3.0 * signed_double_area),
        ((y_values + next_y) * cross).sum() / (3.0 * signed_double_area),
    ])
    return area, centroid


def best_constant_cluster(values: np.ndarray, tolerance: float) -> np.ndarray:
    best = np.asarray([], dtype=np.int64)
    for value in values:
        candidate = np.flatnonzero(np.abs(values - value) <= tolerance)
        if candidate.size > best.size:
            best = candidate
    return best


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("lidar_analysis", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--cluster-tolerance-metres", type=float, default=0.15)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    venue = json.loads(arguments.venue_rows.read_text(encoding="utf-8"))
    lidar = json.loads(arguments.lidar_analysis.read_text(encoding="utf-8"))
    if control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Invalid venue-row artifact")
    if lidar.get("artifactKind") != "row-polygon-lidar-return-analysis":
        raise ValueError("Invalid LiDAR row analysis")

    control_by_key: dict[str, list[dict]] = defaultdict(list)
    for feature in control["features"]:
        attributes = feature["attributes"]
        key = normalized_key(attributes.get("section"), attributes.get("row"))
        control_by_key[key].append(feature)
    lidar_by_key = {row["rowKey"]: row for row in lidar["rows"]}

    current_rows = []
    unresolved_rows = []
    current_by_section: dict[str, list[dict]] = defaultdict(list)
    for row in venue["rows"]:
        row_key = normalized_key(row["sectionId"], row["rowId"])
        positions = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=np.float64)
        current = {
            "rowKey": row_key,
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "venueLocalPosition": [float(value) for value in np.median(positions, axis=0)],
            "sourceAnchorIds": row["anchorSeatIds"],
        }
        current_by_section[str(row["sectionId"])].append(current)
        if row_key not in control_by_key:
            unresolved_rows.append({
                **current,
                "blockers": ["NO_IDENTITY_MATCHED_GEOREFERENCED_ROW_CONTROL"],
            })
            continue
        features = control_by_key[row_key]
        weighted_centroids = []
        total_area = 0.0
        rings = []
        for feature in features:
            for raw_ring in feature.get("geometry", {}).get("rings", []):
                area, centroid = polygon_area_centroid(raw_ring)
                weighted_centroids.append(area * centroid)
                total_area += area
                rings.append(raw_ring)
        if not rings or total_area <= 0:
            unresolved_rows.append({
                **current,
                "blockers": ["MATCHED_CONTROL_HAS_NO_VALID_POLYGON"],
            })
            continue
        centroid = np.sum(weighted_centroids, axis=0) / total_area
        current_rows.append({
            **current,
            "horizontalGeometry": {
                "coordinateReferenceSystem": "EPSG:6347",
                "source": "identity-matched-2019-independent-row-polygon",
                "centroidMetres": [float(value) for value in centroid],
                "rings": rings,
            },
            "lidarMeasurement": lidar_by_key.get(row_key),
        })

    vertical_fits = {}
    matched_by_section: dict[str, list[dict]] = defaultdict(list)
    for row in current_rows:
        if row["lidarMeasurement"]:
            matched_by_section[str(row["sectionId"])].append(row)
    for section_id, rows in matched_by_section.items():
        control_rows = [row for row in rows if not stable_holdout(row["rowKey"])]
        offsets = np.asarray([
            row["lidarMeasurement"]["candidateVerticalOffsetsMetres"]["median"]
            for row in control_rows
        ], dtype=np.float64)
        if offsets.size < 4:
            continue
        cluster = best_constant_cluster(offsets, arguments.cluster_tolerance_metres)
        if cluster.size < 4:
            continue
        cluster_offsets = offsets[cluster]
        fitted_offset = float(np.median(cluster_offsets))
        holdout_rows = [row for row in rows if stable_holdout(row["rowKey"])]
        holdout_residuals = [
            abs(
                row["lidarMeasurement"]["lidarElevationMetres"]["median"]
                - (row["venueLocalPosition"][1] + fitted_offset)
            )
            for row in holdout_rows
        ]
        vertical_fits[section_id] = {
            "offsetMetres": fitted_offset,
            "controlRowCount": len(control_rows),
            "inlierControlRowCount": int(cluster.size),
            "controlClusterSpanMetres": float(cluster_offsets.max() - cluster_offsets.min()),
            "holdoutRowCount": len(holdout_rows),
            "holdoutResidualMedianMetres": percentile(holdout_residuals, 50),
            "holdoutResidualP95Metres": percentile(holdout_residuals, 95),
            "holdoutWithinOneFootPercent": (
                float(np.mean(np.asarray(holdout_residuals) <= ONE_FOOT_METRES) * 100.0)
                if holdout_residuals else None
            ),
            "publicationEligible": bool(
                holdout_residuals
                and np.median(holdout_residuals) <= ONE_FOOT_METRES
                and np.percentile(holdout_residuals, 95) <= ONE_FOOT_METRES
            ),
        }

    direct_lidar_rows = 0
    indirect_vertical_rows = 0
    for row in current_rows:
        fit = vertical_fits.get(str(row["sectionId"]))
        measurement = row["lidarMeasurement"]
        if not fit or not measurement:
            row["verticalGeometry"] = {
                "method": "unresolved",
                "blockers": ["NO_SECTION_VERTICAL_FIT"],
            }
            continue
        modeled_elevation = row["venueLocalPosition"][1] + fit["offsetMetres"]
        measured_elevation = measurement["lidarElevationMetres"]["median"]
        residual = abs(measured_elevation - modeled_elevation)
        interquartile_span = (
            measurement["lidarElevationMetres"]["p75"]
            - measurement["lidarElevationMetres"]["p25"]
        )
        direct = residual <= ONE_FOOT_METRES and interquartile_span <= 0.60
        if direct:
            direct_lidar_rows += 1
        else:
            indirect_vertical_rows += 1
        row["verticalGeometry"] = {
            "method": "direct-lidar-agreement" if direct else "venue-relative-with-section-lidar-fit",
            "elevationMetresNavd88": measured_elevation if direct else modeled_elevation,
            "modeledElevationMetresNavd88": modeled_elevation,
            "measuredMedianElevationMetresNavd88": measured_elevation,
            "modelToMeasurementResidualMetres": residual,
            "lidarInterquartileSpanMetres": interquartile_span,
            "sectionFit": fit,
            "publicationEligible": bool(direct and fit["publicationEligible"]),
            "blockers": [
                *([] if direct else ["ROW_NOT_DIRECTLY_CONFIRMED_BY_LIDAR"]),
                *([] if fit["publicationEligible"] else ["SECTION_VERTICAL_HOLDOUT_FAILED"]),
            ],
        }

    heldout_residuals = [
        fit["holdoutResidualP95Metres"]
        for fit in vertical_fits.values()
        if fit["holdoutResidualP95Metres"] is not None
    ]
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueArtifactVersion": venue["artifactVersion"],
        "lidarArtifactVersion": lidar["artifactVersion"],
        "verticalFits": vertical_fits,
        "currentRows": current_rows,
        "unresolvedRows": unresolved_rows,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    eligible_rows = sum(
        row["verticalGeometry"].get("publicationEligible", False) for row in current_rows
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "current-georeferenced-row-geometry-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueArtifactVersion": venue["artifactVersion"],
            "lidarArtifactVersion": lidar["artifactVersion"],
        },
        "counts": {
            "currentVenueRows": len(venue["rows"]),
            "identityMatchedRows": len(current_rows),
            "unresolvedRows": len(unresolved_rows),
            "sectionsWithVerticalFits": len(vertical_fits),
            "directLidarAgreementRows": direct_lidar_rows,
            "indirectVerticalRows": indirect_vertical_rows,
            "fullyEligibleRows": eligible_rows,
        },
        "verticalValidation": {
            "sectionSplit": "sha256(rowKey) modulo 5 within each section",
            "clusterToleranceMetres": arguments.cluster_tolerance_metres,
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "sectionHoldoutP95MedianMetres": percentile(heldout_residuals, 50),
            "sectionHoldoutP95P95Metres": percentile(heldout_residuals, 95),
            "fits": vertical_fits,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "CURRENT_ROW_SET_NOT_FULLY_GEOREFERENCED",
                "STALE_INDEPENDENT_ROW_POLYGONS_REQUIRE_CURRENT_GEOMETRY_CONFIRMATION",
                "OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": current_rows,
        "unresolvedRows": unresolved_rows,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "counts": artifact["counts"],
        "verticalValidation": {
            key: value for key, value in artifact["verticalValidation"].items() if key != "fits"
        },
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

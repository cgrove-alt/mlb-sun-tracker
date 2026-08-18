#!/usr/bin/env python3
"""Audit registered 3D Digital Venue rows against open-roof airborne LiDAR.

The provider rows describe candidate seated-camera positions. Airborne LiDAR
does not label seating treads, seat hardware, rails, decks, or roof members.
This audit therefore preserves every repeatable vertical surface candidate and
uses a section-level holdout only to test whether one global camera-to-surface
offset transfers. It never promotes a candidate surface to measured row
geometry and never treats overlapping flightlines as independent truth.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS, Transformer
from scipy.spatial import cKDTree


ANALYSIS_VERSION = "3ddv-open-roof-lidar-row-surface-audit-v1"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def percentile(values: list[float] | np.ndarray, probability: float) -> float | None:
    array = np.asarray(values, dtype=np.float64)
    return float(np.percentile(array, probability)) if array.size else None


def section_is_holdout(section_id: str, modulus: int) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % modulus == 0


def linear_unit_to_metres(crs: CRS, label: str) -> float:
    if not crs.axis_info:
        raise ValueError(f"{label} CRS does not expose a linear unit")
    factor = float(crs.axis_info[0].unit_conversion_factor or math.nan)
    if not math.isfinite(factor) or factor <= 0:
        raise ValueError(f"{label} CRS has an invalid linear-unit conversion")
    return factor


def vertical_clusters(values_feet: np.ndarray, maximum_gap_feet: float) -> list[dict[str, Any]]:
    if values_feet.size == 0:
        return []
    ordered = np.sort(values_feet.astype(np.float64))
    boundaries = np.flatnonzero(np.diff(ordered) > maximum_gap_feet) + 1
    result = []
    for part in np.split(ordered, boundaries):
        if part.size < 2:
            continue
        result.append({
            "medianElevationFeet": float(np.median(part)),
            "pointCount": int(part.size),
            "spanFeet": float(part[-1] - part[0]),
        })
    return result


def repeatable_candidates(
    by_source: dict[int, list[dict[str, Any]]],
    maximum_disagreement_feet: float,
) -> list[dict[str, Any]]:
    source_ids = sorted(by_source)
    seeds = [
        cluster["medianElevationFeet"]
        for source_id in source_ids
        for cluster in by_source[source_id]
    ]
    candidates: list[dict[str, Any]] = []
    seen: set[tuple[int, ...]] = set()
    for seed in seeds:
        selected = []
        for source_id in source_ids:
            clusters = by_source[source_id]
            if not clusters:
                continue
            closest = min(
                clusters,
                key=lambda item: abs(item["medianElevationFeet"] - seed),
            )
            if abs(closest["medianElevationFeet"] - seed) <= maximum_disagreement_feet:
                selected.append((source_id, closest))
        if len(selected) < 2:
            continue
        elevations = [item[1]["medianElevationFeet"] for item in selected]
        if max(elevations) - min(elevations) > maximum_disagreement_feet:
            continue
        key = tuple(
            value
            for source_id, cluster in selected
            for value in (
                source_id,
                round(cluster["medianElevationFeet"] * 1000),
            )
        )
        if key in seen:
            continue
        seen.add(key)
        candidates.append({
            "elevationFeet": float(np.median(elevations)),
            "sourceIds": [source_id for source_id, _ in selected],
            "sourceCount": len(selected),
            "crossFlightlineDisagreementFeet": float(max(elevations) - min(elevations)),
            "pointCount": int(sum(cluster["pointCount"] for _, cluster in selected)),
        })
    return sorted(candidates, key=lambda item: item["elevationFeet"])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--metadata-url", required=True)
    parser.add_argument("--acquisition-evidence-url", required=True)
    parser.add_argument("--acquired-on", required=True)
    parser.add_argument("--accepted-classification", type=int, action="append")
    parser.add_argument("--horizontal-radius-feet", type=float, default=2.5)
    parser.add_argument("--cluster-gap-feet", type=float, default=0.5)
    parser.add_argument("--maximum-flightline-disagreement-feet", type=float, default=0.75)
    parser.add_argument("--minimum-camera-offset-feet", type=float, default=2.0)
    parser.add_argument("--maximum-camera-offset-feet", type=float, default=8.0)
    parser.add_argument("--offset-grid-step-feet", type=float, default=0.02)
    parser.add_argument("--offset-match-tolerance-feet", type=float, default=0.5)
    parser.add_argument("--holdout-modulus", type=int, default=5)
    arguments = parser.parse_args()

    if arguments.horizontal_radius_feet <= 0:
        raise ValueError("Horizontal radius must be positive")
    if arguments.cluster_gap_feet <= 0:
        raise ValueError("Cluster gap must be positive")
    if arguments.maximum_flightline_disagreement_feet <= 0:
        raise ValueError("Flightline disagreement must be positive")
    if not arguments.minimum_camera_offset_feet < arguments.maximum_camera_offset_feet:
        raise ValueError("Camera offset bounds are invalid")
    if arguments.offset_grid_step_feet <= 0 or arguments.offset_match_tolerance_feet <= 0:
        raise ValueError("Offset grid and tolerance must be positive")
    if arguments.holdout_modulus < 2:
        raise ValueError("Holdout modulus must be at least two")

    world = json.loads(arguments.world_rows.read_text())
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World rows have the wrong artifact kind")
    if world.get("stadiumId") != "marlins":
        raise ValueError("This audit currently supports only the Marlins source package")
    if not arguments.lidar.is_file():
        raise FileNotFoundError(arguments.lidar)

    expected_row_count = world.get("coverage", {}).get("rowCount")
    expected_anchor_count = world.get("coverage", {}).get("seatCount")
    rows = world.get("rows", [])
    if expected_row_count != len(rows):
        raise ValueError("World-row count does not reproduce")
    anchor_count = sum(len(row.get("anchors", [])) for row in rows)
    if expected_anchor_count != anchor_count:
        raise ValueError("World-row anchor count does not reproduce")
    coordinate_text = world.get("coordinateReference", {}).get("horizontal", "")
    if "EPSG:6438" not in coordinate_text:
        raise ValueError("World rows are not in the expected EPSG:6438 frame")

    anchors = []
    for row_index, row in enumerate(rows):
        for anchor_index, anchor in enumerate(row.get("anchors", [])):
            position = anchor.get("projectedCoordinateUsSurveyFeet")
            elevation = anchor.get("candidateCameraElevationNavd88Feet")
            if not isinstance(position, list) or len(position) != 2 or elevation is None:
                raise ValueError("A world-row anchor lacks projected plan or camera elevation")
            anchors.append({
                "rowIndex": row_index,
                "anchorIndex": anchor_index,
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "seatId": anchor["seatId"],
                "planFeet": position,
                "cameraElevationFeet": float(elevation),
            })

    classifications = sorted(set(arguments.accepted_classification or [1, 6]))
    with laspy.open(arguments.lidar) as reader:
        embedded = reader.header.parse_crs()
        if embedded is None:
            raise ValueError("LiDAR source has no embedded CRS")
        source_crs = CRS.from_user_input(embedded)
        horizontal_crs = CRS.from_user_input(
            source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
        )
        horizontal_to_metres = linear_unit_to_metres(horizontal_crs, "Horizontal")
        if source_crs.is_compound and len(source_crs.sub_crs_list) > 1:
            vertical_to_metres = linear_unit_to_metres(
                CRS.from_user_input(source_crs.sub_crs_list[1]), "Vertical"
            )
        elif len(source_crs.axis_info) >= 3:
            vertical_to_metres = float(source_crs.axis_info[2].unit_conversion_factor)
        else:
            vertical_to_metres = horizontal_to_metres

        plan = np.asarray([anchor["planFeet"] for anchor in anchors], dtype=np.float64)
        transformer = Transformer.from_crs(6438, horizontal_crs, always_xy=True)
        query_x_native, query_y_native = transformer.transform(plan[:, 0], plan[:, 1])
        query_xy_metres = np.column_stack((query_x_native, query_y_native)) * horizontal_to_metres
        radius_metres = arguments.horizontal_radius_feet / METRES_TO_FEET
        minimum = np.min(query_xy_metres, axis=0) - radius_metres
        maximum = np.max(query_xy_metres, axis=0) + radius_metres

        point_parts: dict[int, list[np.ndarray]] = {}
        source_counts: dict[int, int] = {}
        source_class_counts: dict[int, dict[int, int]] = {}
        for points in reader.chunk_iterator(2_000_000):
            x_metres = np.asarray(points.x) * horizontal_to_metres
            y_metres = np.asarray(points.y) * horizontal_to_metres
            z_feet = np.asarray(points.z) * vertical_to_metres * METRES_TO_FEET
            point_sources = np.asarray(points.point_source_id)
            point_classes = np.asarray(points.classification)
            inside = (
                (x_metres >= minimum[0])
                & (x_metres <= maximum[0])
                & (y_metres >= minimum[1])
                & (y_metres <= maximum[1])
                & np.isin(point_classes, classifications)
            )
            if not inside.any():
                continue
            for source_id in np.unique(point_sources[inside]):
                source_id_int = int(source_id)
                selected = inside & (point_sources == source_id)
                values = np.column_stack((x_metres[selected], y_metres[selected], z_feet[selected]))
                point_parts.setdefault(source_id_int, []).append(values)
                source_counts[source_id_int] = source_counts.get(source_id_int, 0) + len(values)
                class_counts = source_class_counts.setdefault(source_id_int, {})
                unique_classes, counts = np.unique(point_classes[selected], return_counts=True)
                for class_id, count in zip(unique_classes, counts):
                    class_counts[int(class_id)] = class_counts.get(int(class_id), 0) + int(count)

    points_by_source = {
        source_id: np.vstack(parts)
        for source_id, parts in point_parts.items()
        if parts
    }
    if len(points_by_source) < 2:
        raise ValueError("At least two overlapping LiDAR point sources are required")
    trees = {
        source_id: cKDTree(points[:, :2])
        for source_id, points in points_by_source.items()
    }

    evidence_by_anchor = []
    training_offsets_by_anchor: list[list[float]] = []
    for anchor, query_xy in zip(anchors, query_xy_metres):
        clusters_by_source = {}
        for source_id, tree in trees.items():
            indexes = tree.query_ball_point(query_xy, radius_metres)
            clusters_by_source[source_id] = vertical_clusters(
                points_by_source[source_id][indexes, 2],
                arguments.cluster_gap_feet,
            )
        candidates = repeatable_candidates(
            clusters_by_source,
            arguments.maximum_flightline_disagreement_feet,
        )
        offset_candidates = []
        for candidate in candidates:
            camera_offset = anchor["cameraElevationFeet"] - candidate["elevationFeet"]
            if (
                arguments.minimum_camera_offset_feet
                <= camera_offset
                <= arguments.maximum_camera_offset_feet
            ):
                offset_candidates.append({**candidate, "cameraOffsetFeet": camera_offset})
        holdout = section_is_holdout(anchor["sectionId"], arguments.holdout_modulus)
        if not holdout:
            training_offsets_by_anchor.append([
                candidate["cameraOffsetFeet"] for candidate in offset_candidates
            ])
        evidence_by_anchor.append({
            **anchor,
            "holdout": holdout,
            "sourceClusterCounts": {
                str(source_id): len(clusters)
                for source_id, clusters in clusters_by_source.items()
            },
            "repeatableCandidateCount": len(candidates),
            "offsetWindowCandidates": offset_candidates,
        })

    grid = np.arange(
        arguments.minimum_camera_offset_feet,
        arguments.maximum_camera_offset_feet + arguments.offset_grid_step_feet / 2,
        arguments.offset_grid_step_feet,
    )
    grid_scores = []
    soft_scale = arguments.offset_match_tolerance_feet / 2
    for offset in grid:
        residuals = [
            min(abs(candidate - offset) for candidate in candidates)
            for candidates in training_offsets_by_anchor
            if candidates
        ]
        matched = [
            residual for residual in residuals
            if residual <= arguments.offset_match_tolerance_feet
        ]
        grid_scores.append((
            float(sum(math.exp(-0.5 * (residual / soft_scale) ** 2) for residual in residuals)),
            len(matched),
            -float(np.median(matched)) if matched else -math.inf,
            -float(np.percentile(matched, 95)) if matched else -math.inf,
            -abs(float(offset) - 5.0),
            float(offset),
        ))
    best = max(grid_scores)
    selected_offset = best[-1]

    rows_by_index: dict[int, list[dict[str, Any]]] = {}
    split_anchor_metrics = {"training": [], "holdout": []}
    for anchor_evidence in evidence_by_anchor:
        candidates = anchor_evidence["offsetWindowCandidates"]
        selected = None
        if candidates:
            nearest = min(
                candidates,
                key=lambda item: abs(item["cameraOffsetFeet"] - selected_offset),
            )
            residual = nearest["cameraOffsetFeet"] - selected_offset
            if abs(residual) <= arguments.offset_match_tolerance_feet:
                selected = {
                    **nearest,
                    "offsetResidualFeet": residual,
                }
                split = "holdout" if anchor_evidence["holdout"] else "training"
                split_anchor_metrics[split].append(selected)
        compact = {
            "seatId": anchor_evidence["seatId"],
            "anchorIndex": anchor_evidence["anchorIndex"],
            "holdout": anchor_evidence["holdout"],
            "repeatableCandidateCount": anchor_evidence["repeatableCandidateCount"],
            "offsetWindowCandidateCount": len(candidates),
            "selectedSurface": selected,
        }
        rows_by_index.setdefault(anchor_evidence["rowIndex"], []).append(compact)

    row_records = []
    for row_index, row in enumerate(rows):
        anchor_records = rows_by_index.get(row_index, [])
        selected = [record["selectedSurface"] for record in anchor_records if record["selectedSurface"]]
        row_records.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "holdout": section_is_holdout(row["sectionId"], arguments.holdout_modulus),
            "anchorCount": len(anchor_records),
            "matchedAnchorCount": len(selected),
            "matchedAnchorCoveragePercent": 100 * len(selected) / len(anchor_records) if anchor_records else 0,
            "candidateMeasuredSurfaceElevationFeet": (
                float(np.median([item["elevationFeet"] for item in selected]))
                if selected else None
            ),
            "candidateSurfaceElevationSpanFeet": (
                float(max(item["elevationFeet"] for item in selected) - min(item["elevationFeet"] for item in selected))
                if selected else None
            ),
            "offsetResidualMedianFeet": percentile(
                [item["offsetResidualFeet"] for item in selected], 50
            ),
            "offsetResidualP95AbsoluteFeet": percentile(
                [abs(item["offsetResidualFeet"]) for item in selected], 95
            ),
            "crossFlightlineDisagreementP95Feet": percentile(
                [item["crossFlightlineDisagreementFeet"] for item in selected], 95
            ),
            "anchors": anchor_records,
        })

    def summarize_split(name: str) -> dict[str, Any]:
        selected = split_anchor_metrics[name]
        split_rows = [row for row in row_records if ("holdout" if row["holdout"] else "training") == name]
        anchor_total = sum(row["anchorCount"] for row in split_rows)
        matched_rows = [row for row in split_rows if row["matchedAnchorCount"] > 0]
        return {
            "rowCount": len(split_rows),
            "matchedRowCount": len(matched_rows),
            "matchedRowCoveragePercent": 100 * len(matched_rows) / len(split_rows) if split_rows else 0,
            "anchorCount": anchor_total,
            "matchedAnchorCount": len(selected),
            "matchedAnchorCoveragePercent": 100 * len(selected) / anchor_total if anchor_total else 0,
            "offsetResidualMedianFeet": percentile(
                [item["offsetResidualFeet"] for item in selected], 50
            ),
            "offsetResidualP95AbsoluteFeet": percentile(
                [abs(item["offsetResidualFeet"]) for item in selected], 95
            ),
            "crossFlightlineDisagreementP95Feet": percentile(
                [item["crossFlightlineDisagreementFeet"] for item in selected], 95
            ),
        }

    result = {
        "schemaVersion": 1,
        "artifactKind": "3ddv-open-roof-lidar-row-surface-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": world["stadiumId"],
        "inputs": {
            "worldRowsPath": str(arguments.world_rows.resolve()),
            "worldRowsSha256": sha256_file(arguments.world_rows),
            "worldRowsArtifactVersion": world.get("artifactVersion"),
            "lidarPath": str(arguments.lidar.resolve()),
            "lidarSha256": sha256_file(arguments.lidar),
            "sourceUrl": arguments.source_url,
            "metadataUrl": arguments.metadata_url,
            "acquisitionEvidenceUrl": arguments.acquisition_evidence_url,
            "acquiredOn": arguments.acquired_on,
        },
        "coordinateReference": {
            "worldRows": world["coordinateReference"],
            "lidar": source_crs.to_wkt(),
            "lidarHorizontal": horizontal_crs.to_wkt(),
        },
        "parameters": {
            "acceptedClassifications": classifications,
            "horizontalRadiusFeet": arguments.horizontal_radius_feet,
            "verticalClusterMaximumGapFeet": arguments.cluster_gap_feet,
            "maximumCrossFlightlineDisagreementFeet": arguments.maximum_flightline_disagreement_feet,
            "cameraOffsetSearchFeet": [
                arguments.minimum_camera_offset_feet,
                arguments.maximum_camera_offset_feet,
            ],
            "cameraOffsetGridStepFeet": arguments.offset_grid_step_feet,
            "offsetMatchToleranceFeet": arguments.offset_match_tolerance_feet,
            "sectionHoldoutModulus": arguments.holdout_modulus,
        },
        "lidarCoverage": {
            "pointSourceCount": len(points_by_source),
            "pointSources": [
                {
                    "pointSourceId": source_id,
                    "acceptedPointCount": source_counts[source_id],
                    "classificationCounts": {
                        str(class_id): count
                        for class_id, count in sorted(source_class_counts[source_id].items())
                    },
                }
                for source_id in sorted(points_by_source)
            ],
        },
        "cameraToSurfaceOffsetFit": {
            "fitOn": "training sections only",
            "selectedOffsetFeet": selected_offset,
            "selectionObjective": "maximum per-anchor Gaussian nearest-candidate support",
            "softSupportAtSelectedOffset": best[0],
            "trainingMatchedAnchorCountAtSelectedOffset": best[1],
            "topGridCandidates": [
                {
                    "offsetFeet": score[-1],
                    "softSupport": score[0],
                    "matchedAnchorCount": score[1],
                    "matchedResidualMedianFeet": -score[2],
                    "matchedResidualP95Feet": -score[3],
                }
                for score in sorted(grid_scores, reverse=True)[:10]
            ],
            "semanticRole": "unreviewed repeatable LiDAR surface below provider camera",
        },
        "validation": {
            "training": summarize_split("training"),
            "holdout": summarize_split("holdout"),
        },
        "rows": row_records,
        "geometryBoundary": {
            "establishesCrossFlightlineSurfaceRepeatability": True,
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesMeasuredRowElevation": False,
            "establishesCurrentGeometry": False,
            "establishesSubFootHorizontalRegistration": False,
            "establishesIndependentShadowValidation": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "LIDAR_SURFACE_SEMANTIC_IDENTITY_NOT_REVIEWED",
                "LIDAR_EPOCH_IS_2018_NOT_CURRENT",
                "WORLD_ROW_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
                "LIDAR_PROJECT_ACCURACY_NOT_YET_CHECKSUM_LOCKED",
                "CAMERA_TO_SURFACE_OFFSET_FIT_FROM_SAME_LIDAR",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    result["artifactVersion"] = stable_version({
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": result["stadiumId"],
        "inputs": result["inputs"],
        "parameters": result["parameters"],
        "cameraToSurfaceOffsetFit": result["cameraToSurfaceOffsetFit"],
        "validation": result["validation"],
        "rows": result["rows"],
        "geometryBoundary": result["geometryBoundary"],
        "publication": result["publication"],
    })
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": result["artifactVersion"],
        "selectedCameraToSurfaceOffsetFeet": selected_offset,
        "training": result["validation"]["training"],
        "holdout": result["validation"]["holdout"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

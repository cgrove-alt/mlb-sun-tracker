#!/usr/bin/env python3
"""Cross-check repeatable row-surface candidates against another LiDAR epoch."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS, Transformer
from scipy.spatial import cKDTree

from audit3dVenueRowsAgainstOpenRoofLidar import (
    linear_unit_to_metres,
    percentile,
    stable_version,
    vertical_clusters,
)


ANALYSIS_VERSION = "3ddv-row-surface-cross-epoch-lidar-audit-v2"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("reference_audit", type=Path)
    parser.add_argument("comparison_lidar", type=Path)
    parser.add_argument("comparison_vertical_datum_audit", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--comparison-source-url", required=True)
    parser.add_argument("--comparison-metadata-url", required=True)
    parser.add_argument("--comparison-acquired-on", required=True)
    parser.add_argument("--accepted-classification", type=int, action="append")
    parser.add_argument("--horizontal-radius-feet", type=float, default=2.5)
    parser.add_argument("--cluster-gap-feet", type=float, default=0.5)
    parser.add_argument("--shift-match-tolerance-feet", type=float, default=0.5)
    arguments = parser.parse_args()

    if arguments.horizontal_radius_feet <= 0 or arguments.cluster_gap_feet <= 0:
        raise ValueError("Horizontal radius and cluster gap must be positive")
    if arguments.shift_match_tolerance_feet <= 0:
        raise ValueError("Shift tolerance must be positive")

    world: dict[str, Any] = json.loads(arguments.world_rows.read_text())
    reference: dict[str, Any] = json.loads(arguments.reference_audit.read_text())
    vertical_datum: dict[str, Any] = json.loads(
        arguments.comparison_vertical_datum_audit.read_text()
    )
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if reference.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Reference audit has the wrong artifact kind")
    if reference.get("inputs", {}).get("worldRowsSha256") != sha256_file(arguments.world_rows):
        raise ValueError("Reference audit does not use the supplied world rows")
    if vertical_datum.get("artifactKind") != "noaa-copc-local-vertical-datum-correction-audit":
        raise ValueError("Comparison vertical-datum audit has the wrong artifact kind")
    if not vertical_datum.get("assessment", {}).get(
        "localVerticalCorrectionMeasurementEligible"
    ):
        raise ValueError("Comparison vertical-datum correction is not measurement eligible")
    if vertical_datum.get("stadiumId") != world.get("stadiumId"):
        raise ValueError("Comparison vertical-datum audit targets the wrong stadium")
    if not arguments.comparison_lidar.is_file():
        raise FileNotFoundError(arguments.comparison_lidar)

    reference_lookup = {
        (row["rowKey"], anchor["anchorIndex"]): anchor
        for row in reference["rows"]
        for anchor in row["anchors"]
    }
    anchors = []
    for row_index, row in enumerate(world["rows"]):
        for anchor_index, anchor in enumerate(row["anchors"]):
            evidence = reference_lookup.get((row["rowKey"], anchor_index))
            if evidence is None:
                raise ValueError("Reference audit is missing a world-row anchor")
            selected = evidence.get("selectedSurface")
            if not selected:
                continue
            anchors.append({
                "rowIndex": row_index,
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "anchorIndex": anchor_index,
                "seatId": anchor["seatId"],
                "planFeet": anchor["projectedCoordinateUsSurveyFeet"],
                "holdout": evidence["holdout"],
                "referenceElevationFeet": selected["elevationFeet"],
                "referenceCrossFlightlineDisagreementFeet": selected[
                    "crossFlightlineDisagreementFeet"
                ],
            })
    if not anchors:
        raise ValueError("Reference audit contains no selected surface anchors")

    classifications = sorted(set(arguments.accepted_classification or [1, 6]))
    comparison_vertical_correction_feet = float(
        vertical_datum["verticalCorrection"]["correctionFeet"]
    )
    with laspy.open(arguments.comparison_lidar) as reader:
        embedded = reader.header.parse_crs()
        if embedded is None:
            raise ValueError("Comparison LiDAR has no embedded CRS")
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
        query_x, query_y = transformer.transform(plan[:, 0], plan[:, 1])
        query_xy_metres = np.column_stack((query_x, query_y)) * horizontal_to_metres
        radius_metres = arguments.horizontal_radius_feet / METRES_TO_FEET
        minimum = np.min(query_xy_metres, axis=0) - radius_metres
        maximum = np.max(query_xy_metres, axis=0) + radius_metres

        parts: dict[int, list[np.ndarray]] = {}
        point_counts: dict[int, int] = {}
        for points in reader.chunk_iterator(2_000_000):
            x_metres = np.asarray(points.x) * horizontal_to_metres
            y_metres = np.asarray(points.y) * horizontal_to_metres
            classes = np.asarray(points.classification)
            point_sources = np.asarray(points.point_source_id)
            inside = (
                (x_metres >= minimum[0])
                & (x_metres <= maximum[0])
                & (y_metres >= minimum[1])
                & (y_metres <= maximum[1])
                & np.isin(classes, classifications)
            )
            if not inside.any():
                continue
            z_feet = (
                np.asarray(points.z) * vertical_to_metres * METRES_TO_FEET
                + comparison_vertical_correction_feet
            )
            for source_id in np.unique(point_sources[inside]):
                source_id_int = int(source_id)
                selected = inside & (point_sources == source_id)
                values = np.column_stack((x_metres[selected], y_metres[selected], z_feet[selected]))
                parts.setdefault(source_id_int, []).append(values)
                point_counts[source_id_int] = point_counts.get(source_id_int, 0) + len(values)

    points_by_source = {
        source_id: np.vstack(source_parts)
        for source_id, source_parts in parts.items()
        if source_parts
    }
    if not points_by_source:
        raise ValueError("Comparison LiDAR contains no accepted stadium points")
    trees = {
        source_id: cKDTree(points[:, :2])
        for source_id, points in points_by_source.items()
    }

    records = []
    for anchor, query_xy in zip(anchors, query_xy_metres):
        candidates = []
        for source_id, tree in trees.items():
            indexes = tree.query_ball_point(query_xy, radius_metres)
            for cluster in vertical_clusters(
                points_by_source[source_id][indexes, 2],
                arguments.cluster_gap_feet,
            ):
                candidates.append({
                    "comparisonPointSourceId": source_id,
                    "comparisonElevationFeet": cluster["medianElevationFeet"],
                    "comparisonPointCount": cluster["pointCount"],
                    "comparisonClusterSpanFeet": cluster["spanFeet"],
                    "comparisonMinusReferenceFeet": (
                        cluster["medianElevationFeet"] - anchor["referenceElevationFeet"]
                    ),
                })
        records.append({**anchor, "comparisonCandidates": candidates})
    selected_shift = 0.0

    split_matches: dict[str, list[dict[str, Any]]] = {"training": [], "holdout": []}
    rows_by_index: dict[int, list[dict[str, Any]]] = {}
    for record in records:
        candidates = record["comparisonCandidates"]
        selected = None
        if candidates:
            nearest = min(
                candidates,
                key=lambda item: abs(item["comparisonMinusReferenceFeet"] - selected_shift),
            )
            residual = nearest["comparisonMinusReferenceFeet"] - selected_shift
            if abs(residual) <= arguments.shift_match_tolerance_feet:
                selected = {**nearest, "shiftResidualFeet": residual}
                split = "holdout" if record["holdout"] else "training"
                split_matches[split].append(selected)
        rows_by_index.setdefault(record["rowIndex"], []).append({
            "seatId": record["seatId"],
            "anchorIndex": record["anchorIndex"],
            "referenceElevationFeet": record["referenceElevationFeet"],
            "referenceCrossFlightlineDisagreementFeet": record[
                "referenceCrossFlightlineDisagreementFeet"
            ],
            "comparisonCandidateCount": len(candidates),
            "selectedComparison": selected,
        })

    row_records = []
    for row_index, row in enumerate(world["rows"]):
        anchor_records = rows_by_index.get(row_index, [])
        if not anchor_records:
            continue
        selected = [
            anchor["selectedComparison"]
            for anchor in anchor_records
            if anchor["selectedComparison"]
        ]
        row_records.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "holdout": records[next(
                index for index, record in enumerate(records)
                if record["rowIndex"] == row_index
            )]["holdout"],
            "referenceAnchorCount": len(anchor_records),
            "crossEpochMatchedAnchorCount": len(selected),
            "crossEpochMatchedAnchorCoveragePercent": (
                100 * len(selected) / len(anchor_records) if anchor_records else 0
            ),
            "shiftResidualP95AbsoluteFeet": percentile(
                [abs(item["shiftResidualFeet"]) for item in selected], 95
            ),
            "anchors": anchor_records,
        })

    def summarize(split: str) -> dict[str, Any]:
        anchors_in_split = [record for record in records if ("holdout" if record["holdout"] else "training") == split]
        matches = split_matches[split]
        split_rows = [row for row in row_records if ("holdout" if row["holdout"] else "training") == split]
        matched_rows = [row for row in split_rows if row["crossEpochMatchedAnchorCount"] > 0]
        return {
            "referenceAnchorCount": len(anchors_in_split),
            "crossEpochMatchedAnchorCount": len(matches),
            "crossEpochMatchedAnchorCoveragePercent": (
                100 * len(matches) / len(anchors_in_split) if anchors_in_split else 0
            ),
            "referenceRowCount": len(split_rows),
            "crossEpochMatchedRowCount": len(matched_rows),
            "crossEpochMatchedRowCoveragePercent": (
                100 * len(matched_rows) / len(split_rows) if split_rows else 0
            ),
            "shiftResidualMedianFeet": percentile(
                [item["shiftResidualFeet"] for item in matches], 50
            ),
            "shiftResidualP95AbsoluteFeet": percentile(
                [abs(item["shiftResidualFeet"]) for item in matches], 95
            ),
        }

    result = {
        "schemaVersion": 1,
        "artifactKind": "3ddv-row-surface-cross-epoch-lidar-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": world["stadiumId"],
        "inputs": {
            "worldRowsPath": str(arguments.world_rows.resolve()),
            "worldRowsSha256": sha256_file(arguments.world_rows),
            "referenceAuditPath": str(arguments.reference_audit.resolve()),
            "referenceAuditSha256": sha256_file(arguments.reference_audit),
            "referenceAuditArtifactVersion": reference.get("artifactVersion"),
            "comparisonLidarPath": str(arguments.comparison_lidar.resolve()),
            "comparisonLidarSha256": sha256_file(arguments.comparison_lidar),
            "comparisonSourceUrl": arguments.comparison_source_url,
            "comparisonMetadataUrl": arguments.comparison_metadata_url,
            "comparisonAcquiredOn": arguments.comparison_acquired_on,
            "comparisonVerticalDatumAuditPath": str(
                arguments.comparison_vertical_datum_audit.resolve()
            ),
            "comparisonVerticalDatumAuditSha256": sha256_file(
                arguments.comparison_vertical_datum_audit
            ),
            "comparisonVerticalDatumAuditArtifactVersion": vertical_datum.get(
                "artifactVersion"
            ),
        },
        "parameters": {
            "acceptedClassifications": classifications,
            "horizontalRadiusFeet": arguments.horizontal_radius_feet,
            "verticalClusterMaximumGapFeet": arguments.cluster_gap_feet,
            "shiftMatchToleranceFeet": arguments.shift_match_tolerance_feet,
        },
        "comparisonCoverage": {
            "pointSourceCount": len(points_by_source),
            "pointSources": [
                {"pointSourceId": source_id, "acceptedPointCount": point_counts[source_id]}
                for source_id in sorted(points_by_source)
            ],
        },
        "verticalEpochShiftFit": {
            "fitOn": "not fitted to stadium rows",
            "selectedComparisonMinusReferenceFeet": selected_shift,
            "comparisonCopcCorrectionFeet": comparison_vertical_correction_feet,
            "selectionObjective": (
                "fixed zero epoch shift after applying the independently held-out "
                "survey-control COPC correction"
            ),
            "verticalDatumCorrectionEnvelope95Feet": vertical_datum[
                "verticalCorrection"
            ]["correctionEnvelope95Feet"],
        },
        "validation": {
            "training": summarize("training"),
            "holdout": summarize("holdout"),
        },
        "rows": row_records,
        "geometryBoundary": {
            "establishesCrossEpochSurfaceRepeatability": True,
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesCurrentGeometry": False,
            "establishesCompleteMeasuredRows": False,
            "establishesIndependentShadowValidation": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "CROSS_EPOCH_SURFACE_SEMANTIC_IDENTITY_NOT_REVIEWED",
                "COMPARISON_SOURCE_HORIZONTAL_ACCURACY_95_IS_3_8_FEET",
                "COMPARISON_LIDAR_EPOCH_IS_2015_NOT_CURRENT",
                "MEASURED_ROW_COVERAGE_NOT_COMPLETE",
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
        "verticalEpochShiftFit": result["verticalEpochShiftFit"],
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
        "selectedComparisonMinusReferenceFeet": selected_shift,
        "training": result["validation"]["training"],
        "holdout": result["validation"]["holdout"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

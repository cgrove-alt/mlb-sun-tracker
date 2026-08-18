#!/usr/bin/env python3
"""Recover row-surface candidates only where two LiDAR epochs agree."""

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


ANALYSIS_VERSION = "3ddv-two-epoch-lidar-row-surface-audit-v2"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_epoch(
    path: Path,
    plan_feet: np.ndarray,
    classifications: list[int],
    radius_feet: float,
    vertical_correction_feet: float = 0.0,
) -> dict[str, Any]:
    with laspy.open(path) as reader:
        embedded = reader.header.parse_crs()
        if embedded is None:
            raise ValueError(f"LiDAR source has no embedded CRS: {path}")
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
        transformer = Transformer.from_crs(6438, horizontal_crs, always_xy=True)
        query_x, query_y = transformer.transform(plan_feet[:, 0], plan_feet[:, 1])
        query_xy_metres = np.column_stack((query_x, query_y)) * horizontal_to_metres
        radius_metres = radius_feet / METRES_TO_FEET
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
                + vertical_correction_feet
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
        raise ValueError(f"LiDAR source contains no accepted stadium points: {path}")
    return {
        "sourceCrs": source_crs,
        "horizontalCrs": horizontal_crs,
        "queryXyMetres": query_xy_metres,
        "radiusMetres": radius_metres,
        "pointsBySource": points_by_source,
        "trees": {
            source_id: cKDTree(points[:, :2])
            for source_id, points in points_by_source.items()
        },
        "pointCounts": point_counts,
    }


def epoch_candidates(
    epoch: dict[str, Any],
    query_index: int,
    cluster_gap_feet: float,
) -> list[dict[str, Any]]:
    query_xy = epoch["queryXyMetres"][query_index]
    candidates = []
    for source_id, tree in epoch["trees"].items():
        indexes = tree.query_ball_point(query_xy, epoch["radiusMetres"])
        for cluster in vertical_clusters(
            epoch["pointsBySource"][source_id][indexes, 2],
            cluster_gap_feet,
        ):
            candidates.append({
                "pointSourceId": source_id,
                "elevationFeet": cluster["medianElevationFeet"],
                "pointCount": cluster["pointCount"],
                "clusterSpanFeet": cluster["spanFeet"],
            })
    return candidates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("reference_audit", type=Path)
    parser.add_argument("cross_epoch_audit", type=Path)
    parser.add_argument("comparison_vertical_datum_audit", type=Path)
    parser.add_argument("reference_lidar", type=Path)
    parser.add_argument("comparison_lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--reference-source-url", required=True)
    parser.add_argument("--comparison-source-url", required=True)
    parser.add_argument("--accepted-classification", type=int, action="append")
    parser.add_argument("--horizontal-radius-feet", type=float, default=2.5)
    parser.add_argument("--cluster-gap-feet", type=float, default=0.5)
    parser.add_argument("--provider-elevation-tolerance-feet", type=float, default=0.5)
    parser.add_argument("--cross-epoch-disagreement-feet", type=float, default=0.75)
    arguments = parser.parse_args()

    if arguments.horizontal_radius_feet <= 0 or arguments.cluster_gap_feet <= 0:
        raise ValueError("Horizontal radius and cluster gap must be positive")
    if arguments.provider_elevation_tolerance_feet <= 0:
        raise ValueError("Provider elevation tolerance must be positive")
    if arguments.cross_epoch_disagreement_feet <= 0:
        raise ValueError("Cross-epoch disagreement must be positive")

    world: dict[str, Any] = json.loads(arguments.world_rows.read_text())
    reference: dict[str, Any] = json.loads(arguments.reference_audit.read_text())
    cross_epoch: dict[str, Any] = json.loads(arguments.cross_epoch_audit.read_text())
    vertical_datum: dict[str, Any] = json.loads(
        arguments.comparison_vertical_datum_audit.read_text()
    )
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if reference.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Reference audit has the wrong artifact kind")
    if cross_epoch.get("artifactKind") != "3ddv-row-surface-cross-epoch-lidar-audit":
        raise ValueError("Cross-epoch audit has the wrong artifact kind")
    if vertical_datum.get("artifactKind") != "noaa-copc-local-vertical-datum-correction-audit":
        raise ValueError("Comparison vertical-datum audit has the wrong artifact kind")
    if not vertical_datum.get("assessment", {}).get(
        "localVerticalCorrectionMeasurementEligible"
    ):
        raise ValueError("Comparison vertical-datum correction is not measurement eligible")
    world_hash = sha256_file(arguments.world_rows)
    reference_hash = sha256_file(arguments.reference_audit)
    if reference.get("inputs", {}).get("worldRowsSha256") != world_hash:
        raise ValueError("Reference audit does not use the supplied world rows")
    if cross_epoch.get("inputs", {}).get("worldRowsSha256") != world_hash:
        raise ValueError("Cross-epoch audit does not use the supplied world rows")
    if cross_epoch.get("inputs", {}).get("referenceAuditSha256") != reference_hash:
        raise ValueError("Cross-epoch audit does not use the supplied reference audit")
    vertical_datum_hash = sha256_file(arguments.comparison_vertical_datum_audit)
    if cross_epoch.get("inputs", {}).get(
        "comparisonVerticalDatumAuditSha256"
    ) != vertical_datum_hash:
        raise ValueError("Cross-epoch audit does not use the supplied vertical-datum audit")
    if sha256_file(arguments.reference_lidar) != reference["inputs"]["lidarSha256"]:
        raise ValueError("Reference LiDAR checksum does not reproduce")
    if sha256_file(arguments.comparison_lidar) != cross_epoch["inputs"]["comparisonLidarSha256"]:
        raise ValueError("Comparison LiDAR checksum does not reproduce")

    classifications = sorted(set(arguments.accepted_classification or [1, 6]))
    comparison_vertical_correction_feet = float(
        vertical_datum["verticalCorrection"]["correctionFeet"]
    )
    holdout_lookup = {
        (row["rowKey"], anchor["anchorIndex"]): bool(anchor["holdout"])
        for row in reference["rows"]
        for anchor in row["anchors"]
    }
    anchors = []
    for row_index, row in enumerate(world["rows"]):
        for anchor_index, anchor in enumerate(row["anchors"]):
            holdout = holdout_lookup.get((row["rowKey"], anchor_index))
            if holdout is None:
                raise ValueError("Reference audit is missing a world-row anchor")
            anchors.append({
                "rowIndex": row_index,
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "anchorIndex": anchor_index,
                "seatId": anchor["seatId"],
                "planFeet": anchor["projectedCoordinateUsSurveyFeet"],
                "cameraElevationFeet": anchor["candidateCameraElevationNavd88Feet"],
                "holdout": holdout,
            })
    plan_feet = np.asarray([anchor["planFeet"] for anchor in anchors], dtype=np.float64)
    reference_epoch = load_epoch(
        arguments.reference_lidar,
        plan_feet,
        classifications,
        arguments.horizontal_radius_feet,
    )
    comparison_epoch = load_epoch(
        arguments.comparison_lidar,
        plan_feet,
        classifications,
        arguments.horizontal_radius_feet,
        comparison_vertical_correction_feet,
    )
    camera_to_reference = float(
        reference["cameraToSurfaceOffsetFit"]["selectedOffsetFeet"]
    )
    comparison_minus_reference = float(
        cross_epoch["verticalEpochShiftFit"]["selectedComparisonMinusReferenceFeet"]
    )

    records = []
    split_matches: dict[str, list[dict[str, Any]]] = {"training": [], "holdout": []}
    for query_index, anchor in enumerate(anchors):
        expected_reference = anchor["cameraElevationFeet"] - camera_to_reference
        expected_comparison = expected_reference + comparison_minus_reference
        reference_candidates = epoch_candidates(
            reference_epoch, query_index, arguments.cluster_gap_feet
        )
        comparison_candidates = epoch_candidates(
            comparison_epoch, query_index, arguments.cluster_gap_feet
        )
        reference_near = [
            {**candidate, "providerResidualFeet": candidate["elevationFeet"] - expected_reference}
            for candidate in reference_candidates
            if abs(candidate["elevationFeet"] - expected_reference)
            <= arguments.provider_elevation_tolerance_feet
        ]
        comparison_near = [
            {**candidate, "providerResidualFeet": candidate["elevationFeet"] - expected_comparison}
            for candidate in comparison_candidates
            if abs(candidate["elevationFeet"] - expected_comparison)
            <= arguments.provider_elevation_tolerance_feet
        ]
        pairs = []
        for reference_candidate in reference_near:
            for comparison_candidate in comparison_near:
                disagreement = abs(
                    (comparison_candidate["elevationFeet"] - reference_candidate["elevationFeet"])
                    - comparison_minus_reference
                )
                if disagreement <= arguments.cross_epoch_disagreement_feet:
                    pairs.append({
                        "reference": reference_candidate,
                        "comparison": comparison_candidate,
                        "correctedCrossEpochDisagreementFeet": disagreement,
                        "combinedProviderResidualAbsoluteFeet": (
                            abs(reference_candidate["providerResidualFeet"])
                            + abs(comparison_candidate["providerResidualFeet"])
                        ),
                    })
        selected = None
        if pairs:
            selected = min(
                pairs,
                key=lambda pair: (
                    pair["correctedCrossEpochDisagreementFeet"],
                    pair["combinedProviderResidualAbsoluteFeet"],
                    -pair["reference"]["pointCount"] - pair["comparison"]["pointCount"],
                ),
            )
            split = "holdout" if anchor["holdout"] else "training"
            split_matches[split].append(selected)
        records.append({
            **anchor,
            "expectedReferenceSurfaceElevationFeet": expected_reference,
            "expectedComparisonSurfaceElevationFeet": expected_comparison,
            "referenceCandidateCount": len(reference_candidates),
            "comparisonCandidateCount": len(comparison_candidates),
            "referenceProviderWindowCandidateCount": len(reference_near),
            "comparisonProviderWindowCandidateCount": len(comparison_near),
            "selectedCrossEpochPair": selected,
        })

    rows_by_index: dict[int, list[dict[str, Any]]] = {}
    for record in records:
        rows_by_index.setdefault(record["rowIndex"], []).append({
            "seatId": record["seatId"],
            "anchorIndex": record["anchorIndex"],
            "expectedReferenceSurfaceElevationFeet": record[
                "expectedReferenceSurfaceElevationFeet"
            ],
            "referenceCandidateCount": record["referenceCandidateCount"],
            "comparisonCandidateCount": record["comparisonCandidateCount"],
            "selectedCrossEpochPair": record["selectedCrossEpochPair"],
        })
    row_records = []
    for row_index, row in enumerate(world["rows"]):
        anchor_records = rows_by_index[row_index]
        selected = [
            anchor["selectedCrossEpochPair"]
            for anchor in anchor_records
            if anchor["selectedCrossEpochPair"]
        ]
        holdout = records[next(
            index for index, record in enumerate(records)
            if record["rowIndex"] == row_index
        )]["holdout"]
        row_records.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "holdout": holdout,
            "anchorCount": len(anchor_records),
            "matchedAnchorCount": len(selected),
            "matchedAnchorCoveragePercent": 100 * len(selected) / len(anchor_records),
            "candidateReferenceSurfaceElevationFeet": (
                float(np.median([
                    pair["reference"]["elevationFeet"] for pair in selected
                ])) if selected else None
            ),
            "correctedCrossEpochDisagreementP95Feet": percentile(
                [pair["correctedCrossEpochDisagreementFeet"] for pair in selected], 95
            ),
            "referenceProviderResidualP95AbsoluteFeet": percentile(
                [abs(pair["reference"]["providerResidualFeet"]) for pair in selected], 95
            ),
            "comparisonProviderResidualP95AbsoluteFeet": percentile(
                [abs(pair["comparison"]["providerResidualFeet"]) for pair in selected], 95
            ),
            "anchors": anchor_records,
        })

    def summarize(split: str) -> dict[str, Any]:
        split_rows = [row for row in row_records if ("holdout" if row["holdout"] else "training") == split]
        matched_rows = [row for row in split_rows if row["matchedAnchorCount"] > 0]
        anchor_count = sum(row["anchorCount"] for row in split_rows)
        matches = split_matches[split]
        return {
            "rowCount": len(split_rows),
            "matchedRowCount": len(matched_rows),
            "matchedRowCoveragePercent": 100 * len(matched_rows) / len(split_rows),
            "anchorCount": anchor_count,
            "matchedAnchorCount": len(matches),
            "matchedAnchorCoveragePercent": 100 * len(matches) / anchor_count,
            "correctedCrossEpochDisagreementP95Feet": percentile(
                [pair["correctedCrossEpochDisagreementFeet"] for pair in matches], 95
            ),
            "referenceProviderResidualP95AbsoluteFeet": percentile(
                [abs(pair["reference"]["providerResidualFeet"]) for pair in matches], 95
            ),
            "comparisonProviderResidualP95AbsoluteFeet": percentile(
                [abs(pair["comparison"]["providerResidualFeet"]) for pair in matches], 95
            ),
        }

    result = {
        "schemaVersion": 1,
        "artifactKind": "3ddv-two-epoch-lidar-row-surface-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": world["stadiumId"],
        "inputs": {
            "worldRowsPath": str(arguments.world_rows.resolve()),
            "worldRowsSha256": world_hash,
            "referenceAuditPath": str(arguments.reference_audit.resolve()),
            "referenceAuditSha256": reference_hash,
            "referenceAuditArtifactVersion": reference.get("artifactVersion"),
            "crossEpochAuditPath": str(arguments.cross_epoch_audit.resolve()),
            "crossEpochAuditSha256": sha256_file(arguments.cross_epoch_audit),
            "crossEpochAuditArtifactVersion": cross_epoch.get("artifactVersion"),
            "comparisonVerticalDatumAuditPath": str(
                arguments.comparison_vertical_datum_audit.resolve()
            ),
            "comparisonVerticalDatumAuditSha256": vertical_datum_hash,
            "comparisonVerticalDatumAuditArtifactVersion": vertical_datum.get(
                "artifactVersion"
            ),
            "referenceLidarPath": str(arguments.reference_lidar.resolve()),
            "referenceLidarSha256": sha256_file(arguments.reference_lidar),
            "referenceSourceUrl": arguments.reference_source_url,
            "comparisonLidarPath": str(arguments.comparison_lidar.resolve()),
            "comparisonLidarSha256": sha256_file(arguments.comparison_lidar),
            "comparisonSourceUrl": arguments.comparison_source_url,
        },
        "lockedTrainingParameters": {
            "cameraToReferenceSurfaceOffsetFeet": camera_to_reference,
            "comparisonMinusReferenceEpochShiftFeet": comparison_minus_reference,
            "comparisonCopcVerticalCorrectionFeet": comparison_vertical_correction_feet,
            "source": (
                "training-only 2018 camera offset plus independently held-out 2015 "
                "survey-control datum correction; no stadium-row epoch shift fit"
            ),
        },
        "parameters": {
            "acceptedClassifications": classifications,
            "horizontalRadiusFeet": arguments.horizontal_radius_feet,
            "verticalClusterMaximumGapFeet": arguments.cluster_gap_feet,
            "providerElevationToleranceFeet": arguments.provider_elevation_tolerance_feet,
            "maximumCorrectedCrossEpochDisagreementFeet": arguments.cross_epoch_disagreement_feet,
        },
        "epochCoverage": {
            "reference": {
                "pointSourceCount": len(reference_epoch["pointsBySource"]),
                "pointSources": [
                    {"pointSourceId": source_id, "acceptedPointCount": reference_epoch["pointCounts"][source_id]}
                    for source_id in sorted(reference_epoch["pointsBySource"])
                ],
            },
            "comparison": {
                "pointSourceCount": len(comparison_epoch["pointsBySource"]),
                "pointSources": [
                    {"pointSourceId": source_id, "acceptedPointCount": comparison_epoch["pointCounts"][source_id]}
                    for source_id in sorted(comparison_epoch["pointsBySource"])
                ],
            },
        },
        "validation": {
            "training": summarize("training"),
            "holdout": summarize("holdout"),
        },
        "rows": row_records,
        "geometryBoundary": {
            "establishesTwoEpochSurfaceRepeatability": True,
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesCurrentGeometry": False,
            "establishesCompleteMeasuredRows": False,
            "establishesIndependentShadowValidation": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "TWO_EPOCH_SURFACE_SEMANTIC_IDENTITY_NOT_REVIEWED",
                "COMPARISON_SOURCE_HORIZONTAL_ACCURACY_95_IS_3_8_FEET",
                "LIDAR_EPOCHS_ARE_2015_AND_2018_NOT_CURRENT",
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
        "lockedTrainingParameters": result["lockedTrainingParameters"],
        "parameters": result["parameters"],
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
        "training": result["validation"]["training"],
        "holdout": result["validation"]["holdout"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

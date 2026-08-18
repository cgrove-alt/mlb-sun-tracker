#!/usr/bin/env python3
"""Test current Section 4 provider vertical spacing on 2018 LiDAR holdout rows."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
import laspy
from pyproj import CRS, Transformer
from scipy.spatial import cKDTree

from auditMarlinsRowsAcross2018And2021Lidar import (
    FEET_PER_METRE,
    corrected_row_anchor_path,
    horizontal_crs,
    linear_unit_to_metres,
    load_points_by_source,
    repeatable_reference_candidates,
    sha256_file,
    vertical_clusters,
)


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--world-rows", type=Path, required=True)
    parser.add_argument("--current-provider-audit", type=Path, required=True)
    parser.add_argument("--semantic-row-audit", type=Path, required=True)
    parser.add_argument("--hard-registration", type=Path, required=True)
    parser.add_argument("--reference-survey-review", type=Path, required=True)
    parser.add_argument("--reference-lidar", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--horizontal-radius-feet", type=float, default=0.75)
    parser.add_argument("--cluster-gap-feet", type=float, default=0.5)
    parser.add_argument("--surface-window-feet", type=float, default=0.5)
    parser.add_argument("--maximum-cross-source-disagreement-feet", type=float, default=0.75)
    args = parser.parse_args()

    world_bytes = args.world_rows.read_bytes()
    provider_bytes = args.current_provider_audit.read_bytes()
    semantic_bytes = args.semantic_row_audit.read_bytes()
    registration_bytes = args.hard_registration.read_bytes()
    review_bytes = args.reference_survey_review.read_bytes()
    world = json.loads(world_bytes)
    provider = json.loads(provider_bytes)
    semantic = json.loads(semantic_bytes)
    registration = json.loads(registration_bytes)
    review = json.loads(review_bytes)

    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World rows have the wrong artifact kind")
    if semantic.get("artifactKind") != "orthophoto-identified-2018-lidar-row-surface-audit":
        raise ValueError("Semantic row audit has the wrong artifact kind")
    if registration.get("artifactKind") != "hard-structure-registered-2021-lidar-local-frame":
        raise ValueError("Hard registration has the wrong artifact kind")
    if review.get("artifactKind") != "lidar-survey-report-review":
        raise ValueError("Reference survey review has the wrong artifact kind")
    if sha256_file(args.reference_lidar) != review["source"]["tileSha256"]:
        raise ValueError("Reference LiDAR checksum mismatch")

    sampled = provider.get("sampledPanoPositions", {})
    if sampled.get("successful") != sampled.get("requested") or sampled.get("requested") != 126:
        raise ValueError("Current provider sample is incomplete")
    current_positions = {item["id"]: item for item in sampled["positions"]}
    world_rows = {row["rowKey"]: row for row in world["rows"]}
    required_holdout_keys = ("SEC4:H", "SEC4:K")
    required_keys = (*required_holdout_keys, "SEC4:J")
    for row_key in required_keys:
        if row_key not in world_rows:
            raise ValueError(f"Missing world row {row_key}")
        for anchor in world_rows[row_key]["anchors"]:
            current = current_positions.get(anchor["seatId"])
            if current is None:
                raise ValueError(f"Current provider sample lacks {anchor['seatId']}")
            if np.linalg.norm(
                np.asarray(current["position"], dtype=float)
                - np.asarray(anchor["providerPositionMetres"], dtype=float)
            ) > 1e-8:
                raise ValueError(f"Current provider position changed for {anchor['seatId']}")

    semantic_j = next(row for row in semantic["rows"] if row["rowKey"] == "SEC4:J")
    if not semantic_j["metricSurfaceCandidate"]:
        raise ValueError("Training row J is not a metric surface candidate")
    training = []
    for anchor, measured in zip(world_rows["SEC4:J"]["anchors"], semantic_j["anchors"]):
        if anchor["seatId"] != measured["seatId"] or measured["surfaceElevationFeetNavd88"] is None:
            raise ValueError("Training row J anchors do not match")
        offset = float(anchor["candidateCameraElevationNavd88Feet"]) - float(
            measured["surfaceElevationFeetNavd88"]
        )
        training.append({
            "seatId": anchor["seatId"],
            "cameraElevationFeetNavd88": anchor["candidateCameraElevationNavd88Feet"],
            "treadElevationFeetNavd88": measured["surfaceElevationFeetNavd88"],
            "cameraToTreadOffsetFeet": offset,
        })
    selected_offset = float(np.median([item["cameraToTreadOffsetFeet"] for item in training]))
    training_spread = float(
        max(item["cameraToTreadOffsetFeet"] for item in training)
        - min(item["cameraToTreadOffsetFeet"] for item in training)
    )

    normal_offset = float(semantic_j["orthophotoControlOffsetFeet"])
    section_row_keys = [
        row["rowKey"]
        for row in world["rows"]
        if row["sectionId"] == "SEC4"
        and row["rowKey"] != "SEC4:J"
        and all(anchor["seatId"] in current_positions for anchor in row["anchors"])
    ]
    anchors = []
    for row_key in section_row_keys:
        row = world_rows[row_key]
        corrected = corrected_row_anchor_path(row, normal_offset)
        for anchor_index, (anchor, point) in enumerate(zip(row["anchors"], corrected)):
            anchors.append({
                "rowKey": row_key,
                "rowId": row["rowId"],
                "seatId": anchor["seatId"],
                "anchorIndex": anchor_index,
                "correctedPlanFeet": point,
                "cameraElevationFeetNavd88": float(anchor["candidateCameraElevationNavd88Feet"]),
            })

    with laspy.open(args.reference_lidar) as reader:
        embedded_reference_crs = reader.header.parse_crs()
    if embedded_reference_crs is None:
        raise ValueError("Reference LiDAR lacks an embedded CRS")
    reference_crs = CRS.from_user_input(embedded_reference_crs)
    reference_horizontal = horizontal_crs(reference_crs)
    transformer = Transformer.from_crs(6438, reference_horizontal, always_xy=True)
    plan = np.asarray([anchor["correctedPlanFeet"] for anchor in anchors], dtype=float)
    query_x, query_y = transformer.transform(plan[:, 0], plan[:, 1])
    comparison_queries = np.column_stack((query_x, query_y)) * linear_unit_to_metres(
        reference_horizontal
    )
    rotation = np.asarray(registration["lockedTransform"]["rotationMatrix"], dtype=float)
    translation = np.asarray(registration["lockedTransform"]["translationMetres"], dtype=float)
    reference_queries = comparison_queries @ rotation.T + translation
    radius_metres = args.horizontal_radius_feet / FEET_PER_METRE
    minimum_xy = reference_queries.min(axis=0) - radius_metres
    maximum_xy = reference_queries.max(axis=0) + radius_metres
    _crs, points_by_source = load_points_by_source(
        args.reference_lidar, [1, 6], minimum_xy, maximum_xy
    )
    if len(points_by_source) < 2:
        raise ValueError("Reference LiDAR lacks two overlapping point sources")
    trees = {source_id: cKDTree(points[:, :2]) for source_id, points in points_by_source.items()}

    results = []
    for anchor, query in zip(anchors, reference_queries):
        clusters_by_source = {}
        for source_id, tree in trees.items():
            indexes = tree.query_ball_point(query, radius_metres)
            clusters_by_source[source_id] = vertical_clusters(
                points_by_source[source_id][indexes, 2],
                args.cluster_gap_feet,
                minimum_points=2,
            )
        candidates = repeatable_reference_candidates(
            clusters_by_source, args.maximum_cross_source_disagreement_feet
        )
        expected = anchor["cameraElevationFeetNavd88"] - selected_offset
        near = [
            candidate for candidate in candidates
            if abs(float(candidate["medianElevationFeet"]) - expected) <= args.surface_window_feet
        ]
        selected = min(
            near,
            key=lambda item: (
                abs(float(item["medianElevationFeet"]) - expected),
                float(item["crossSourceDisagreementFeet"]),
                -int(item["pointCount"]),
            ),
        ) if near else None
        closest = min(
            candidates,
            key=lambda item: abs(float(item["medianElevationFeet"]) - expected),
        ) if candidates else None
        results.append({
            **anchor,
            "expectedTreadElevationFeetNavd88": expected,
            "repeatableCandidateCount": len(candidates),
            "repeatableCandidates": candidates,
            "providerWindowCandidateCount": len(near),
            "closestCandidate": closest,
            "closestCandidateResidualFeet": (
                float(closest["medianElevationFeet"]) - expected if closest else None
            ),
            "selectedSurface": selected,
            "offsetResidualFeet": (
                float(selected["medianElevationFeet"]) - expected if selected else None
            ),
        })

    rows = []
    for row_key in section_row_keys:
        row_anchors = [item for item in results if item["rowKey"] == row_key]
        covered = all(item["selectedSurface"] is not None for item in row_anchors)
        residuals = [abs(item["offsetResidualFeet"]) for item in row_anchors if item["offsetResidualFeet"] is not None]
        rows.append({
            "rowKey": row_key,
            "evaluationRole": (
                "predeclared-holdout" if row_key in required_holdout_keys
                else "exploratory-diagnostic"
            ),
            "anchorCount": len(row_anchors),
            "matchedAnchorCount": sum(item["selectedSurface"] is not None for item in row_anchors),
            "fullAnchorCoverage": covered,
            "maximumAbsoluteOffsetResidualFeet": max(residuals) if residuals else None,
            "verticalConsistencyPassed": bool(
                covered and max(residuals) <= args.surface_window_feet
            ),
            "anchors": row_anchors,
        })

    reference_vertical95 = float(review["conservativeInterpretation"]["verticalAccuracy95Feet"])
    stable = {
        "inputs": {
            "worldRowsSha256": hashlib.sha256(world_bytes).hexdigest(),
            "currentProviderAuditSha256": hashlib.sha256(provider_bytes).hexdigest(),
            "semanticRowAuditSha256": hashlib.sha256(semantic_bytes).hexdigest(),
            "hardRegistrationSha256": hashlib.sha256(registration_bytes).hexdigest(),
            "referenceSurveyReviewSha256": hashlib.sha256(review_bytes).hexdigest(),
            "referenceLidarSha256": sha256_file(args.reference_lidar),
        },
        "parameters": {
            "normalOffsetFeetTransferredFromRowJ": normal_offset,
            "horizontalRadiusFeet": args.horizontal_radius_feet,
            "clusterGapFeet": args.cluster_gap_feet,
            "surfaceWindowFeet": args.surface_window_feet,
            "maximumCrossSourceDisagreementFeet": args.maximum_cross_source_disagreement_feet,
        },
        "training": training,
        "selectedCameraToTreadOffsetFeet": selected_offset,
        "rows": rows,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "current-provider-section-vertical-lidar-holdout-audit",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "sectionId": "SEC4",
        "inputs": stable["inputs"],
        "method": {
            **stable["parameters"],
            "trainingRow": "SEC4:J",
            "untouchedHoldoutRows": ["SEC4:H", "SEC4:K"],
            "fitRule": "median current-provider camera elevation minus independently selected 2018 tread elevation",
        },
        "training": {
            "anchors": training,
            "selectedCameraToTreadOffsetFeet": selected_offset,
            "cameraToTreadOffsetSpreadFeet": training_spread,
        },
        "holdoutRows": [
            row for row in rows if row["evaluationRole"] == "predeclared-holdout"
        ],
        "exploratoryRows": [
            row for row in rows if row["evaluationRole"] == "exploratory-diagnostic"
        ],
        "summary": {
            "holdoutRowCount": len(required_holdout_keys),
            "passingHoldoutRows": sum(
                row["verticalConsistencyPassed"]
                for row in rows
                if row["evaluationRole"] == "predeclared-holdout"
            ),
            "exploratoryRowCount": sum(
                row["evaluationRole"] == "exploratory-diagnostic" for row in rows
            ),
            "passingExploratoryRows": sum(
                row["verticalConsistencyPassed"]
                for row in rows
                if row["evaluationRole"] == "exploratory-diagnostic"
            ),
            "referenceVerticalAccuracy95Feet": reference_vertical95,
        },
        "geometryBoundary": {
            "establishesCurrentProviderRelativeVerticalConsistency": all(
                row["verticalConsistencyPassed"]
                for row in rows
                if row["evaluationRole"] == "predeclared-holdout"
            ),
            "establishesCurrentPhysicalRowPersistence": False,
            "establishesSubFootHorizontalTransferToHoldoutRows": False,
            "establishesMeasuredHoldoutRows": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "LOCAL_HORIZONTAL_TRANSFER_UNCERTAINTY_NOT_QUANTIFIED",
                "CURRENT_PROVIDER_MODEL_IS_NOT_CURRENT_AS_BUILT_SURVEY",
                "CURRENT_PHYSICAL_ROW_PERSISTENCE_NOT_INDEPENDENTLY_OBSERVED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "trainingOffsetFeet": selected_offset,
        "trainingSpreadFeet": training_spread,
        "holdoutRows": [
            {
                "rowKey": row["rowKey"],
                "matchedAnchorCount": row["matchedAnchorCount"],
                "anchorCount": row["anchorCount"],
                "maximumAbsoluteOffsetResidualFeet": row["maximumAbsoluteOffsetResidualFeet"],
                "passed": row["verticalConsistencyPassed"],
            }
            for row in rows
            if row["evaluationRole"] == "predeclared-holdout"
        ],
        "exploratoryRows": {
            "count": sum(
                row["evaluationRole"] == "exploratory-diagnostic" for row in rows
            ),
            "passing": sum(
                row["verticalConsistencyPassed"]
                for row in rows
                if row["evaluationRole"] == "exploratory-diagnostic"
            ),
        },
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

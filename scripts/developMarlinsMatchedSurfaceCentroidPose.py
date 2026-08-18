#!/usr/bin/env python3
"""Fit provider plan pose to reconstructed 2018 LiDAR surface centroids.

The selected surfaces, LiDAR epoch, and section split were consumed by prior
research. Reconstructing their horizontal centroids is development evidence
only. It does not prove seat or row semantics and is never publication input.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from pyproj import Transformer
from scipy import optimize
from scipy.spatial import cKDTree

from audit3dVenueRowsAgainstOpenRoofLidar import stable_version
from developMarlinsMatchedProviderPoseAgainst2018Lidar import (
    MINIMUM_ANCHORS_PER_ROLE,
    load_matched_anchors,
)
from developMarlinsProviderPoseAgainst2018Lidar import (
    ANCHOR_STATE_PLANE_FEET,
    ROTATION_BOUND_DEGREES,
    TRANSLATION_BOUND_FEET,
    corrected_state_plane,
    load_lidar_trees,
    sha256_file,
)


ANALYSIS_VERSION = "marlins-matched-surface-centroid-pose-development-v1"
METRES_TO_FEET = 3.280839895013123
ORIGINAL_HORIZONTAL_RADIUS_FEET = 2.5
ORIGINAL_VERTICAL_CLUSTER_GAP_FEET = 0.5
ORIGINAL_MAXIMUM_FLIGHTLINE_DISAGREEMENT_FEET = 0.75
ROBUST_SCALE_FEET = 0.5


def horizontal_cluster(
    source_points: np.ndarray,
    source_tree: cKDTree,
    query_xy: np.ndarray,
    selected_elevation_feet: float,
) -> dict[str, Any] | None:
    indexes = np.asarray(
        source_tree.query_ball_point(query_xy, ORIGINAL_HORIZONTAL_RADIUS_FEET),
        dtype=int,
    )
    if indexes.size < 2:
        return None
    values = source_points[indexes]
    order = np.argsort(values[:, 2])
    ordered = values[order]
    boundaries = np.flatnonzero(
        np.diff(ordered[:, 2]) > ORIGINAL_VERTICAL_CLUSTER_GAP_FEET
    ) + 1
    candidates = []
    for part in np.split(ordered, boundaries):
        if len(part) < 2:
            continue
        median_elevation = float(np.median(part[:, 2]))
        candidates.append((abs(median_elevation - selected_elevation_feet), part))
    if not candidates:
        return None
    vertical_difference, selected = min(candidates, key=lambda item: item[0])
    if vertical_difference > ORIGINAL_MAXIMUM_FLIGHTLINE_DISAGREEMENT_FEET + 1e-9:
        return None
    horizontal_median = np.median(selected[:, :2], axis=0)
    radial = np.linalg.norm(selected[:, :2] - horizontal_median, axis=1)
    return {
        "horizontalMedianLocalFeet": horizontal_median,
        "medianElevationFeet": float(np.median(selected[:, 2])),
        "pointCount": int(len(selected)),
        "horizontalRadiusP95Feet": float(np.percentile(radial, 95)),
        "horizontalRadiusMaximumFeet": float(np.max(radial)),
        "verticalDifferenceFromSelectedMedianFeet": float(vertical_difference),
    }


def reconstruct_controls(
    records: list[dict[str, Any]],
    lidar: dict[str, Any],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    plan = np.asarray([record["planFeet"] for record in records])
    query_x, query_y = lidar["transformer"].transform(plan[:, 0], plan[:, 1])
    scale = lidar["horizontalToMetres"] * METRES_TO_FEET
    query_local = np.column_stack((query_x, query_y)) * scale - lidar["xyOriginFeet"]
    horizontal_trees = {
        source_id: cKDTree(points[:, :2])
        for source_id, points in lidar["pointsBySource"].items()
    }
    inverse = Transformer.from_crs(lidar["horizontalCrs"], 6438, always_xy=True)
    controls = []
    rejected = []
    for record, query_xy in zip(records, query_local):
        clusters = []
        for source_id in record["selectedSurfaceSourceIds"]:
            if source_id not in horizontal_trees:
                continue
            cluster = horizontal_cluster(
                lidar["pointsBySource"][source_id],
                horizontal_trees[source_id],
                query_xy,
                record["selectedSurfaceElevationFeet"],
            )
            if cluster is not None:
                clusters.append({"pointSourceId": source_id, **cluster})
        if len(clusters) < 2:
            rejected.append({
                "seatId": record["seatId"],
                "rowKey": record["rowKey"],
                "reason": "FEWER_THAN_TWO_SELECTED_FLIGHTLINE_CLUSTERS_REPRODUCED",
                "reproducedSourceCount": len(clusters),
            })
            continue
        source_xy = np.asarray([
            cluster["horizontalMedianLocalFeet"] for cluster in clusters
        ])
        target_local = np.median(source_xy, axis=0)
        target_native_feet = target_local + lidar["xyOriginFeet"]
        target_native = target_native_feet / scale
        target_state_x, target_state_y = inverse.transform(
            target_native[0], target_native[1]
        )
        source_disagreement = np.linalg.norm(source_xy - target_local, axis=1)
        controls.append({
            **record,
            "targetStatePlaneFeet": [float(target_state_x), float(target_state_y)],
            "reproducedSourceCount": len(clusters),
            "sourceCentroidDisagreementFeet": {
                "median": float(np.median(source_disagreement)),
                "maximum": float(np.max(source_disagreement)),
            },
            "clusters": [{
                **{
                    key: value
                    for key, value in cluster.items()
                    if key != "horizontalMedianLocalFeet"
                },
                "horizontalMedianLocalFeet": cluster[
                    "horizontalMedianLocalFeet"
                ].tolist(),
            } for cluster in clusters],
        })
    return controls, rejected


class PoseResiduals:
    def __init__(self, controls: list[dict[str, Any]]) -> None:
        self.source = np.asarray([control["planFeet"] for control in controls])
        self.target = np.asarray([
            control["targetStatePlaneFeet"] for control in controls
        ])

    def vectors(self, parameters: np.ndarray) -> np.ndarray:
        corrected = corrected_state_plane(
            self.source,
            np.asarray([parameters[0], parameters[1], parameters[2], 0.0]),
        )
        return corrected - self.target

    def flattened(self, parameters: np.ndarray) -> np.ndarray:
        return self.vectors(parameters).ravel()


def summarize(values: np.ndarray) -> dict[str, float]:
    return {
        "median": float(np.median(values)),
        "p75": float(np.percentile(values, 75)),
        "p95": float(np.percentile(values, 95)),
        "maximum": float(np.max(values)),
        "within0_5FeetPercent": float(np.mean(values <= 0.5) * 100.0),
        "within0_75FeetPercent": float(np.mean(values <= 0.75) * 100.0),
        "within1FootPercent": float(np.mean(values <= 1.0) * 100.0),
    }


def fit(controls: list[dict[str, Any]]) -> dict[str, Any]:
    residuals = PoseResiduals(controls)
    fit_result = optimize.least_squares(
        residuals.flattened,
        x0=np.zeros(3),
        bounds=(
            np.asarray([
                -TRANSLATION_BOUND_FEET,
                -TRANSLATION_BOUND_FEET,
                -ROTATION_BOUND_DEGREES,
            ]),
            np.asarray([
                TRANSLATION_BOUND_FEET,
                TRANSLATION_BOUND_FEET,
                ROTATION_BOUND_DEGREES,
            ]),
        ),
        loss="soft_l1",
        f_scale=ROBUST_SCALE_FEET,
        xtol=1e-13,
        ftol=1e-13,
        gtol=1e-13,
        max_nfev=10_000,
    )
    parameters = np.asarray(fit_result.x, dtype=float)
    vectors = residuals.vectors(parameters)
    distances = np.linalg.norm(vectors, axis=1)
    section_residuals = []
    for section_id in sorted({control["sectionId"] for control in controls}):
        indices = [
            index
            for index, control in enumerate(controls)
            if control["sectionId"] == section_id
        ]
        section_residuals.append({
            "sectionId": section_id,
            "anchorCount": len(indices),
            **summarize(distances[indices]),
        })
    return {
        "parameters": {
            "anchorTranslationFeet": parameters[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(parameters[2]),
            "trueBearingCorrectionDegrees": float(-parameters[2]),
        },
        "anchorCount": len(controls),
        "rowCount": len({control["rowKey"] for control in controls}),
        "sectionCount": len({control["sectionId"] for control in controls}),
        "horizontalResidualFeet": summarize(distances),
        "sectionResiduals": section_residuals,
        "optimization": {
            "success": bool(fit_result.success),
            "status": int(fit_result.status),
            "message": str(fit_result.message),
            "functionEvaluations": int(fit_result.nfev),
            "cost": float(fit_result.cost),
            "optimality": float(fit_result.optimality),
        },
    }


def parameter_vector(record: dict[str, Any]) -> np.ndarray:
    parameters = record["parameters"]
    return np.asarray([
        *parameters["anchorTranslationFeet"],
        parameters["cartesianCounterclockwiseDegrees"],
    ])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("row_surface_audit", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    world = json.loads(arguments.world_rows.read_text())
    row_audit = json.loads(arguments.row_surface_audit.read_text())
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World rows have the wrong artifact kind")
    if row_audit.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Row-surface audit has the wrong artifact kind")
    if world.get("stadiumId") != "marlins" or row_audit.get("stadiumId") != "marlins":
        raise ValueError("An input targets another stadium")
    world_sha256 = sha256_file(arguments.world_rows)
    audit_sha256 = sha256_file(arguments.row_surface_audit)
    lidar_sha256 = sha256_file(arguments.lidar)
    if row_audit["inputs"]["worldRowsSha256"] != world_sha256:
        raise ValueError("Row-surface audit does not consume these world rows")
    if row_audit["inputs"]["lidarSha256"] != lidar_sha256:
        raise ValueError("Row-surface audit does not consume this LiDAR")
    expected_parameters = row_audit["parameters"]
    if expected_parameters["horizontalRadiusFeet"] != ORIGINAL_HORIZONTAL_RADIUS_FEET:
        raise ValueError("Original horizontal radius changed")
    if expected_parameters["verticalClusterMaximumGapFeet"] != ORIGINAL_VERTICAL_CLUSTER_GAP_FEET:
        raise ValueError("Original cluster gap changed")
    if expected_parameters["maximumCrossFlightlineDisagreementFeet"] != ORIGINAL_MAXIMUM_FLIGHTLINE_DISAGREEMENT_FEET:
        raise ValueError("Original flightline gate changed")

    records = load_matched_anchors(world, row_audit)
    lidar = load_lidar_trees(
        arguments.lidar,
        np.asarray([record["planFeet"] for record in records]),
    )
    controls, rejected = reconstruct_controls(records, lidar)
    training = [control for control in controls if control["role"] == "training"]
    holdout = [
        control for control in controls if control["role"] == "consumed-holdout"
    ]
    if len(training) < MINIMUM_ANCHORS_PER_ROLE:
        raise ValueError("Too few reproduced training controls")
    if len(holdout) < MINIMUM_ANCHORS_PER_ROLE:
        raise ValueError("Too few reproduced consumed-holdout controls")

    training_fit = fit(training)
    holdout_fit = fit(holdout)
    training_parameters = parameter_vector(training_fit)
    holdout_parameters = parameter_vector(holdout_fit)
    comparison = {
        "anchorTranslationDisagreementFeet": float(np.linalg.norm(
            training_parameters[:2] - holdout_parameters[:2]
        )),
        "rotationDisagreementDegrees": abs(float(
            training_parameters[2] - holdout_parameters[2]
        )),
    }
    source_disagreement = np.asarray([
        control["sourceCentroidDisagreementFeet"]["maximum"]
        for control in controls
    ])
    stable = {
        "worldRowsSha256": world_sha256,
        "rowSurfaceAuditSha256": audit_sha256,
        "lidarSha256": lidar_sha256,
        "parameters": {
            "horizontalRadiusFeet": ORIGINAL_HORIZONTAL_RADIUS_FEET,
            "verticalClusterMaximumGapFeet": ORIGINAL_VERTICAL_CLUSTER_GAP_FEET,
            "maximumCrossFlightlineDisagreementFeet": (
                ORIGINAL_MAXIMUM_FLIGHTLINE_DISAGREEMENT_FEET
            ),
            "translationBoundFeet": TRANSLATION_BOUND_FEET,
            "rotationBoundDegrees": ROTATION_BOUND_DEGREES,
            "robustLeastSquaresLoss": "soft_l1",
            "robustScaleFeet": ROBUST_SCALE_FEET,
        },
        "controlReconstruction": {
            "selectedAnchorCount": len(records),
            "reproducedControlCount": len(controls),
            "rejectedCount": len(rejected),
            "maximumSourceCentroidDisagreementFeet": summarize(
                source_disagreement
            ),
        },
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "comparison": comparison,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-matched-surface-centroid-pose-development",
        "artifactVersion": stable_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "worldRows": {
                "path": str(arguments.world_rows),
                "sha256": world_sha256,
                "artifactVersion": world["artifactVersion"],
            },
            "rowSurfaceAudit": {
                "path": str(arguments.row_surface_audit),
                "sha256": audit_sha256,
                "artifactVersion": row_audit["artifactVersion"],
            },
            "lidar": {
                "path": str(arguments.lidar),
                "sha256": lidar_sha256,
                "acquiredOn": row_audit["inputs"]["acquiredOn"],
            },
        },
        **stable,
        "assessment": {
            "developmentOnly": True,
            "surfaceSelectionAndCentroidUseSameLidar": True,
            "centroidsBiasedByOriginalProviderCenteredCrop": True,
            "existingSectionHoldoutsConsumedAndIneligibleForPublicationReuse": True,
            "establishesProviderPose": False,
            "establishesSeatingTreadSemantics": False,
            "establishesCurrentRows": False,
            "publicationEligible": False,
            "blockers": [
                "DEVELOPMENT_SECTION_SPLIT_ALREADY_CONSUMED",
                "SURFACE_SELECTION_AND_CENTROID_USE_SAME_LIDAR",
                "CENTROIDS_BIASED_BY_ORIGINAL_PROVIDER_CENTERED_CROP",
                "LIDAR_SURFACES_NOT_SEMANTICALLY_PROVEN_AS_ROW_TREADS",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "FRESH_INDEPENDENT_POSE_HOLDOUT_NOT_PASSED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "controlReconstruction": stable["controlReconstruction"],
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "comparison": comparison,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

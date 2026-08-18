#!/usr/bin/env python3
"""Develop provider-row pose from previously selected repeatable LiDAR surfaces.

The 2018 LiDAR, candidate selection, camera-offset fit, and section split were
already consumed by prior research. This diagnostic can expose whether the
provider plan geometry is internally consistent with those selected surfaces,
but it cannot create fresh publication evidence or prove row-tread semantics.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from scipy import optimize

from audit3dVenueRowsAgainstOpenRoofLidar import stable_version
from developMarlinsProviderPoseAgainst2018Lidar import (
    ANCHOR_STATE_PLANE_FEET,
    LOWER_BOWL_SECTION_MAXIMUM,
    LOWER_BOWL_SECTION_MINIMUM,
    MINIMUM_ROWS_PER_ROLE,
    ROTATION_BOUND_DEGREES,
    TRANSLATION_BOUND_FEET,
    corrected_state_plane,
    load_lidar_trees,
    section_is_holdout,
    section_number,
    sha256_file,
)


ANALYSIS_VERSION = "marlins-matched-provider-pose-2018-lidar-development-v1"
OBJECTIVE_KEEP_FRACTION = 0.90
MINIMUM_ANCHORS_PER_ROLE = 500


def load_matched_anchors(
    world: dict[str, Any],
    row_audit: dict[str, Any],
) -> list[dict[str, Any]]:
    world_rows = {row["rowKey"]: row for row in world["rows"]}
    records: list[dict[str, Any]] = []
    for audited_row in row_audit["rows"]:
        number = section_number(str(audited_row["sectionId"]))
        if (
            number is None
            or number < LOWER_BOWL_SECTION_MINIMUM
            or number > LOWER_BOWL_SECTION_MAXIMUM
        ):
            continue
        world_row = world_rows.get(audited_row["rowKey"])
        if world_row is None:
            raise ValueError(f"Audited row is absent from world rows: {audited_row['rowKey']}")
        role = (
            "consumed-holdout"
            if section_is_holdout(str(audited_row["sectionId"]))
            else "training"
        )
        if bool(audited_row["holdout"]) != (role == "consumed-holdout"):
            raise ValueError(f"Section role changed for {audited_row['rowKey']}")
        for audited_anchor in audited_row["anchors"]:
            surface = audited_anchor.get("selectedSurface")
            if surface is None:
                continue
            index = int(audited_anchor["anchorIndex"])
            world_anchor = world_row["anchors"][index]
            if world_anchor["seatId"] != audited_anchor["seatId"]:
                raise ValueError(f"Anchor join changed for {audited_anchor['seatId']}")
            point = world_anchor["projectedCoordinateUsSurveyFeet"]
            if not isinstance(point, list) or len(point) != 2:
                raise ValueError(f"Anchor lacks a projected point: {audited_anchor['seatId']}")
            camera_elevation = float(
                world_anchor["candidateCameraElevationNavd88Feet"]
            )
            surface_elevation = float(surface["elevationFeet"])
            records.append({
                "seatId": audited_anchor["seatId"],
                "rowKey": audited_row["rowKey"],
                "sectionId": audited_row["sectionId"],
                "role": role,
                "planFeet": [float(point[0]), float(point[1])],
                "cameraElevationFeet": camera_elevation,
                "selectedSurfaceElevationFeet": surface_elevation,
                "cameraToSelectedSurfaceOffsetFeet": (
                    camera_elevation - surface_elevation
                ),
                "selectedSurfaceSourceIds": [
                    int(value) for value in surface["sourceIds"]
                ],
                "selectedSurfaceCrossFlightlineDisagreementFeet": float(
                    surface["crossFlightlineDisagreementFeet"]
                ),
            })
    return records


class MatchedSurfaceObjective:
    def __init__(
        self,
        records: list[dict[str, Any]],
        lidar: dict[str, Any],
    ) -> None:
        self.records = records
        self.plan = np.asarray([record["planFeet"] for record in records])
        self.surface_z = np.asarray([
            record["selectedSurfaceElevationFeet"] for record in records
        ])
        self.lidar = lidar

    def distances(self, parameters: np.ndarray) -> np.ndarray:
        corrected = corrected_state_plane(
            self.plan,
            np.asarray([parameters[0], parameters[1], parameters[2], 0.0]),
        )
        query_x, query_y = self.lidar["transformer"].transform(
            corrected[:, 0],
            corrected[:, 1],
        )
        scale = self.lidar["horizontalToMetres"] * 3.280839895013123
        query_xy_feet = np.column_stack((query_x, query_y)) * scale
        queries = np.column_stack((
            query_xy_feet[:, 0] - self.lidar["xyOriginFeet"][0],
            query_xy_feet[:, 1] - self.lidar["xyOriginFeet"][1],
            self.surface_z,
        ))
        by_source = np.column_stack([
            tree.query(queries, k=1, workers=1)[0]
            for tree in self.lidar["trees"].values()
        ])
        by_source.sort(axis=1)
        return by_source[:, 1]

    def __call__(self, parameters: np.ndarray) -> float:
        distances = self.distances(parameters)
        keep = max(100, int(math.ceil(len(distances) * OBJECTIVE_KEEP_FRACTION)))
        retained = np.sort(distances)[:keep]
        return float(
            np.median(retained)
            + 0.45 * np.percentile(retained, 75)
            + 0.20 * np.percentile(retained, 95)
        )


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


def fit(records: list[dict[str, Any]], lidar: dict[str, Any]) -> dict[str, Any]:
    objective = MatchedSurfaceObjective(records, lidar)
    bounds = [
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-ROTATION_BOUND_DEGREES, ROTATION_BOUND_DEGREES),
    ]
    global_fit = optimize.differential_evolution(
        objective,
        bounds,
        seed=20260812,
        popsize=12,
        maxiter=70,
        tol=1e-8,
        polish=False,
        workers=1,
        updating="immediate",
    )
    local_fit = optimize.minimize(
        objective,
        global_fit.x,
        method="Powell",
        bounds=bounds,
        options={"maxiter": 3_000, "xtol": 1e-8, "ftol": 1e-8},
    )
    parameters = np.asarray(local_fit.x, dtype=float)
    for value, (minimum, maximum) in zip(parameters, bounds):
        if value < minimum - 1e-8 or value > maximum + 1e-8:
            raise ValueError("Local optimization escaped a declared parameter bound")
    distances = objective.distances(parameters)
    offsets = np.asarray([
        record["cameraToSelectedSurfaceOffsetFeet"] for record in records
    ])
    section_residuals = []
    for section_id in sorted({record["sectionId"] for record in records}):
        indices = [
            index
            for index, record in enumerate(records)
            if record["sectionId"] == section_id
        ]
        section_distances = distances[indices]
        section_residuals.append({
            "sectionId": section_id,
            "anchorCount": len(indices),
            **summarize(section_distances),
        })
    return {
        "parameters": {
            "anchorTranslationFeet": parameters[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(parameters[2]),
            "trueBearingCorrectionDegrees": float(-parameters[2]),
        },
        "objective": float(objective(parameters)),
        "anchorCount": len(records),
        "rowCount": len({record["rowKey"] for record in records}),
        "sectionCount": len({record["sectionId"] for record in records}),
        "secondFlightlineNearestSelectedSurface3dDistanceFeet": summarize(
            distances
        ),
        "cameraToSelectedSurfaceOffsetFeet": summarize(offsets),
        "sectionResiduals": section_residuals,
        "globalOptimization": {
            "success": bool(global_fit.success),
            "message": str(global_fit.message),
            "functionEvaluations": int(global_fit.nfev),
        },
        "localOptimization": {
            "success": bool(local_fit.success),
            "message": str(local_fit.message),
            "functionEvaluations": int(local_fit.nfev),
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
    if row_audit["inputs"]["worldRowsSha256"] != sha256_file(arguments.world_rows):
        raise ValueError("Row-surface audit does not consume these world rows")
    if row_audit["inputs"]["lidarSha256"] != sha256_file(arguments.lidar):
        raise ValueError("Row-surface audit does not consume this LiDAR")

    records = load_matched_anchors(world, row_audit)
    training = [record for record in records if record["role"] == "training"]
    holdout = [
        record for record in records if record["role"] == "consumed-holdout"
    ]
    if len(training) < MINIMUM_ANCHORS_PER_ROLE:
        raise ValueError("Too few selected training anchors")
    if len(holdout) < MINIMUM_ANCHORS_PER_ROLE:
        raise ValueError("Too few selected consumed-holdout anchors")
    if len({record["rowKey"] for record in training}) < MINIMUM_ROWS_PER_ROLE:
        raise ValueError("Too few selected training rows")

    lidar = load_lidar_trees(
        arguments.lidar,
        np.asarray([record["planFeet"] for record in records]),
    )
    training_fit = fit(training, lidar)
    holdout_fit = fit(holdout, lidar)
    training_parameters = parameter_vector(training_fit)
    holdout_parameters = parameter_vector(holdout_fit)
    anchor_disagreement = float(np.linalg.norm(
        training_parameters[:2] - holdout_parameters[:2]
    ))
    rotation_disagreement = abs(float(
        training_parameters[2] - holdout_parameters[2]
    ))
    training_offset = training_fit["cameraToSelectedSurfaceOffsetFeet"]["median"]
    holdout_offset = holdout_fit["cameraToSelectedSurfaceOffsetFeet"]["median"]

    stable = {
        "worldRowsSha256": sha256_file(arguments.world_rows),
        "rowSurfaceAuditSha256": sha256_file(arguments.row_surface_audit),
        "lidarSha256": sha256_file(arguments.lidar),
        "parameters": {
            "lowerBowlSectionRange": [
                LOWER_BOWL_SECTION_MINIMUM,
                LOWER_BOWL_SECTION_MAXIMUM,
            ],
            "selection": "all anchors with selectedSurface in consumed row audit",
            "sectionSplit": "sha256(sectionId)-first-four-bytes-modulo-five",
            "translationBoundFeet": TRANSLATION_BOUND_FEET,
            "rotationBoundDegrees": ROTATION_BOUND_DEGREES,
            "objectiveKeepFraction": OBJECTIVE_KEEP_FRACTION,
            "surfaceSupport": (
                "second-smallest-nearest-3d-distance-across-flightlines-at-"
                "the-previously-selected-surface-elevation"
            ),
        },
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "comparison": {
            "anchorTranslationDisagreementFeet": anchor_disagreement,
            "rotationDisagreementDegrees": rotation_disagreement,
            "cameraToSelectedSurfaceMedianOffsetDisagreementFeet": abs(
                float(training_offset - holdout_offset)
            ),
        },
        "lidarPointSources": [{
            "pointSourceId": source_id,
            "acceptedPointCount": int(len(lidar["pointsBySource"][source_id])),
            "classificationCounts": lidar["classCounts"][source_id],
        } for source_id in sorted(lidar["pointsBySource"])],
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-matched-provider-pose-lidar-development",
        "artifactVersion": stable_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "worldRows": {
                "path": str(arguments.world_rows),
                "sha256": stable["worldRowsSha256"],
                "artifactVersion": world["artifactVersion"],
            },
            "rowSurfaceAudit": {
                "path": str(arguments.row_surface_audit),
                "sha256": stable["rowSurfaceAuditSha256"],
                "artifactVersion": row_audit["artifactVersion"],
            },
            "lidar": {
                "path": str(arguments.lidar),
                "sha256": stable["lidarSha256"],
                "acquiredOn": "2018-06-05",
            },
        },
        **stable,
        "assessment": {
            "developmentOnly": True,
            "surfaceSelectionAndPoseUseSameLidar": True,
            "existingSectionHoldoutsConsumedAndIneligibleForPublicationReuse": True,
            "establishesProviderPose": False,
            "establishesSeatingTreadSemantics": False,
            "establishesCurrentRows": False,
            "publicationEligible": False,
            "blockers": [
                "DEVELOPMENT_SECTION_SPLIT_ALREADY_CONSUMED",
                "SURFACE_SELECTION_AND_POSE_USE_SAME_LIDAR",
                "LIDAR_NEAREST_SURFACES_NOT_SEMANTICALLY_PROVEN_AS_ROW_TREADS",
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
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "comparison": stable["comparison"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

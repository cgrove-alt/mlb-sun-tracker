#!/usr/bin/env python3
"""Develop a provider-row pose correction against 2018 open-roof LiDAR.

The section split and LiDAR epoch have already been used by earlier research.
This script is therefore diagnostic only and cannot create publication evidence.
It compares independently optimized training and consumed-holdout section fits.
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
from scipy import optimize
from scipy.spatial import cKDTree

from audit3dVenueRowsAgainstOpenRoofLidar import (
    linear_unit_to_metres,
    stable_version,
)


ANALYSIS_VERSION = "marlins-provider-pose-against-2018-lidar-development-v1"
METRES_TO_FEET = 3.280839895013123
ANCHOR_STATE_PLANE_FEET = np.asarray([913125.0, 525625.0])
ACCEPTED_CLASSIFICATIONS = (1, 6)
LOWER_BOWL_SECTION_MINIMUM = 1
LOWER_BOWL_SECTION_MAXIMUM = 28
TRANSLATION_BOUND_FEET = 3.0
ROTATION_BOUND_DEGREES = 0.05
CAMERA_TO_SURFACE_OFFSET_BOUNDS_FEET = (4.5, 7.5)
TRIMMED_KEEP_FRACTION = 0.75
MINIMUM_ROWS_PER_ROLE = 200


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def section_number(section_id: str) -> int | None:
    if not section_id.startswith("SEC"):
        return None
    suffix = section_id[3:]
    return int(suffix) if suffix.isdigit() else None


def section_is_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def load_rows(world: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for row in world["rows"]:
        number = section_number(str(row["sectionId"]))
        if (
            number is None
            or number < LOWER_BOWL_SECTION_MINIMUM
            or number > LOWER_BOWL_SECTION_MAXIMUM
        ):
            continue
        anchors = row.get("anchors", [])
        if len(anchors) < 2:
            continue
        middle = anchors[len(anchors) // 2]
        point = middle.get("projectedCoordinateUsSurveyFeet")
        elevation = middle.get("candidateCameraElevationNavd88Feet")
        if not isinstance(point, list) or len(point) != 2 or elevation is None:
            raise ValueError(f"World row lacks a midpoint coordinate: {row['rowKey']}")
        rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "planFeet": [float(point[0]), float(point[1])],
            "cameraElevationFeet": float(elevation),
            "role": "consumed-holdout" if section_is_holdout(
                str(row["sectionId"])
            ) else "training",
        })
    return rows


def load_lidar_trees(
    path: Path,
    state_plane_points: np.ndarray,
) -> dict[str, Any]:
    with laspy.open(path) as reader:
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
                CRS.from_user_input(source_crs.sub_crs_list[1]),
                "Vertical",
            )
        elif len(source_crs.axis_info) >= 3:
            vertical_to_metres = float(source_crs.axis_info[2].unit_conversion_factor)
        else:
            vertical_to_metres = horizontal_to_metres
        transformer = Transformer.from_crs(6438, horizontal_crs, always_xy=True)
        query_x, query_y = transformer.transform(
            state_plane_points[:, 0],
            state_plane_points[:, 1],
        )
        query_xy_feet = np.column_stack((query_x, query_y)) * (
            horizontal_to_metres * METRES_TO_FEET
        )
        xy_origin_feet = np.median(query_xy_feet, axis=0)
        minimum = np.min(query_xy_feet, axis=0) - 8.0
        maximum = np.max(query_xy_feet, axis=0) + 8.0
        parts: dict[int, list[np.ndarray]] = {}
        class_counts: dict[int, dict[int, int]] = {}
        for points in reader.chunk_iterator(2_000_000):
            x_feet = np.asarray(points.x) * horizontal_to_metres * METRES_TO_FEET
            y_feet = np.asarray(points.y) * horizontal_to_metres * METRES_TO_FEET
            classifications = np.asarray(points.classification)
            point_sources = np.asarray(points.point_source_id)
            inside = (
                (x_feet >= minimum[0])
                & (x_feet <= maximum[0])
                & (y_feet >= minimum[1])
                & (y_feet <= maximum[1])
                & np.isin(classifications, ACCEPTED_CLASSIFICATIONS)
            )
            if not np.any(inside):
                continue
            z_feet = np.asarray(points.z) * vertical_to_metres * METRES_TO_FEET
            for source_id in np.unique(point_sources[inside]):
                source_id_int = int(source_id)
                selected = inside & (point_sources == source_id)
                values = np.column_stack((
                    x_feet[selected] - xy_origin_feet[0],
                    y_feet[selected] - xy_origin_feet[1],
                    z_feet[selected],
                ))
                parts.setdefault(source_id_int, []).append(values)
                counts = class_counts.setdefault(source_id_int, {})
                classes, numbers = np.unique(
                    classifications[selected],
                    return_counts=True,
                )
                for class_id, number in zip(classes, numbers):
                    counts[int(class_id)] = counts.get(int(class_id), 0) + int(number)
    points_by_source = {
        source_id: np.vstack(source_parts)
        for source_id, source_parts in parts.items()
        if source_parts
    }
    if len(points_by_source) < 2:
        raise ValueError("At least two overlapping flightlines are required")
    return {
        "sourceCrs": source_crs,
        "horizontalCrs": horizontal_crs,
        "transformer": transformer,
        "horizontalToMetres": horizontal_to_metres,
        "xyOriginFeet": xy_origin_feet,
        "pointsBySource": points_by_source,
        "trees": {
            source_id: cKDTree(points)
            for source_id, points in points_by_source.items()
        },
        "classCounts": class_counts,
    }


def corrected_state_plane(points: np.ndarray, parameters: np.ndarray) -> np.ndarray:
    theta = math.radians(float(parameters[2]))
    cosine = math.cos(theta)
    sine = math.sin(theta)
    rotation = np.asarray([[cosine, -sine], [sine, cosine]])
    return (
        (points - ANCHOR_STATE_PLANE_FEET) @ rotation.T
        + ANCHOR_STATE_PLANE_FEET
        + parameters[:2]
    )


class Objective:
    def __init__(
        self,
        records: list[dict[str, Any]],
        lidar: dict[str, Any],
    ) -> None:
        self.records = records
        self.plan = np.asarray([record["planFeet"] for record in records])
        self.camera_z = np.asarray([
            record["cameraElevationFeet"] for record in records
        ])
        self.lidar = lidar

    def distances(self, parameters: np.ndarray) -> np.ndarray:
        corrected = corrected_state_plane(self.plan, parameters)
        query_x, query_y = self.lidar["transformer"].transform(
            corrected[:, 0],
            corrected[:, 1],
        )
        query_xy_feet = np.column_stack((query_x, query_y)) * (
            self.lidar["horizontalToMetres"] * METRES_TO_FEET
        )
        queries = np.column_stack((
            query_xy_feet[:, 0] - self.lidar["xyOriginFeet"][0],
            query_xy_feet[:, 1] - self.lidar["xyOriginFeet"][1],
            self.camera_z - float(parameters[3]),
        ))
        by_source = np.column_stack([
            tree.query(queries, k=1, workers=1)[0]
            for tree in self.lidar["trees"].values()
        ])
        by_source.sort(axis=1)
        return by_source[:, 1]

    def __call__(self, parameters: np.ndarray) -> float:
        values = self.distances(parameters)
        keep = max(50, int(math.ceil(len(values) * TRIMMED_KEEP_FRACTION)))
        retained = np.sort(values)[:keep]
        return float(
            np.median(retained)
            + 0.45 * np.percentile(retained, 75)
            + 0.20 * np.percentile(retained, 95)
        )


def fit(records: list[dict[str, Any]], lidar: dict[str, Any]) -> dict[str, Any]:
    objective = Objective(records, lidar)
    bounds = [
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-ROTATION_BOUND_DEGREES, ROTATION_BOUND_DEGREES),
        CAMERA_TO_SURFACE_OFFSET_BOUNDS_FEET,
    ]
    global_fit = optimize.differential_evolution(
        objective,
        bounds,
        seed=20260812,
        popsize=12,
        maxiter=55,
        tol=1e-7,
        polish=False,
        workers=1,
        updating="immediate",
    )
    local_fit = optimize.minimize(
        objective,
        global_fit.x,
        method="Powell",
        bounds=bounds,
        options={"maxiter": 3_000, "xtol": 1e-7, "ftol": 1e-7},
    )
    parameters = np.asarray(local_fit.x, dtype=float)
    for value, (minimum, maximum) in zip(parameters, bounds):
        if value < minimum - 1e-8 or value > maximum + 1e-8:
            raise ValueError("Local optimization escaped a declared parameter bound")
    distances = objective.distances(parameters)
    section_summaries = []
    for section_id in sorted({record["sectionId"] for record in records}):
        indices = [
            index
            for index, record in enumerate(records)
            if record["sectionId"] == section_id
        ]
        section_distances = distances[indices]
        section_summaries.append({
            "sectionId": section_id,
            "rowCount": len(indices),
            "medianFeet": float(np.median(section_distances)),
            "p75Feet": float(np.percentile(section_distances, 75)),
            "p95Feet": float(np.percentile(section_distances, 95)),
            "within0_75FeetPercent": float(
                np.mean(section_distances <= 0.75) * 100.0
            ),
            "within1FootPercent": float(
                np.mean(section_distances <= 1.0) * 100.0
            ),
        })
    return {
        "parameters": {
            "anchorTranslationFeet": parameters[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(parameters[2]),
            "trueBearingCorrectionDegrees": float(-parameters[2]),
            "cameraToSurfaceOffsetFeet": float(parameters[3]),
        },
        "objective": float(objective(parameters)),
        "rowCount": len(records),
        "secondFlightlineNearest3dDistanceFeet": {
            "median": float(np.median(distances)),
            "p75": float(np.percentile(distances, 75)),
            "p95": float(np.percentile(distances, 95)),
            "maximum": float(np.max(distances)),
            "within0_75FeetPercent": float(np.mean(distances <= 0.75) * 100.0),
            "within1FootPercent": float(np.mean(distances <= 1.0) * 100.0),
        },
        "sectionResiduals": section_summaries,
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
        parameters["cameraToSurfaceOffsetFeet"],
    ])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    world = json.loads(arguments.world_rows.read_text())
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World rows have the wrong artifact kind")
    if world.get("stadiumId") != "marlins":
        raise ValueError("World rows target another stadium")
    if "EPSG:6438" not in world["coordinateReference"]["horizontal"]:
        raise ValueError("World rows are not in EPSG:6438")
    if not arguments.lidar.is_file():
        raise FileNotFoundError(arguments.lidar)

    rows = load_rows(world)
    training = [record for record in rows if record["role"] == "training"]
    holdout = [record for record in rows if record["role"] == "consumed-holdout"]
    if len(training) < MINIMUM_ROWS_PER_ROLE or len(holdout) < MINIMUM_ROWS_PER_ROLE:
        raise ValueError("Too few lower-bowl rows in one development role")
    lidar = load_lidar_trees(
        arguments.lidar,
        np.asarray([record["planFeet"] for record in rows]),
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
    vertical_offset_disagreement = abs(float(
        training_parameters[3] - holdout_parameters[3]
    ))

    stable = {
        "worldRowsSha256": sha256_file(arguments.world_rows),
        "lidarSha256": sha256_file(arguments.lidar),
        "parameters": {
            "acceptedClassifications": list(ACCEPTED_CLASSIFICATIONS),
            "lowerBowlSectionRange": [
                LOWER_BOWL_SECTION_MINIMUM,
                LOWER_BOWL_SECTION_MAXIMUM,
            ],
            "representativeAnchor": "middle-provider-anchor-per-row",
            "sectionSplit": "sha256(sectionId)-first-four-bytes-modulo-five",
            "translationBoundFeet": TRANSLATION_BOUND_FEET,
            "rotationBoundDegrees": ROTATION_BOUND_DEGREES,
            "cameraToSurfaceOffsetBoundsFeet": list(
                CAMERA_TO_SURFACE_OFFSET_BOUNDS_FEET
            ),
            "trimmedKeepFraction": TRIMMED_KEEP_FRACTION,
            "minimumRowsPerRole": MINIMUM_ROWS_PER_ROLE,
            "surfaceSupport": "second-smallest-nearest-3d-distance-across-flightlines",
        },
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "comparison": {
            "anchorTranslationDisagreementFeet": anchor_disagreement,
            "rotationDisagreementDegrees": rotation_disagreement,
            "cameraToSurfaceOffsetDisagreementFeet": vertical_offset_disagreement,
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
        "artifactKind": "marlins-provider-pose-lidar-development",
        "artifactVersion": stable_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "worldRows": {
                "path": str(arguments.world_rows),
                "sha256": stable["worldRowsSha256"],
                "artifactVersion": world["artifactVersion"],
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
            "existingSectionHoldoutsConsumedAndIneligibleForPublicationReuse": True,
            "establishesProviderPose": False,
            "establishesSeatingTreadSemantics": False,
            "establishesCurrentRows": False,
            "publicationEligible": False,
            "blockers": [
                "DEVELOPMENT_SECTION_SPLIT_ALREADY_CONSUMED",
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
        "trainingRowCount": len(training),
        "consumedHoldoutRowCount": len(holdout),
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "comparison": stable["comparison"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

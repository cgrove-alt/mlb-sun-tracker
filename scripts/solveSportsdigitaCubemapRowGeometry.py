#!/usr/bin/env python3
"""Solve provider-local row heights from reviewed cubemap seat badges.

The known horizontal seat coordinates constrain camera position and yaw. Badge
centres on one physical row share a height because the seats use the same
mounting geometry. Their cubemap rays therefore constrain the row's height
relative to the camera. Training controls fit the pose and row heights; disjoint
holdout controls evaluate metric cross-track and vertical residuals.

This solver never establishes georeferencing, current obstruction geometry, or
shadow accuracy. It remains fail-closed unless every row has both training and
holdout controls and all local metric thresholds pass.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image
from scipy.optimize import least_squares


ANALYSIS_VERSION = "sportsdigita-cubemap-provider-row-bundle-v1"
FEET_TO_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def cubemap_ray(face: str, pixel: np.ndarray, size: int) -> np.ndarray:
    """Return a krpano cube-face ray in right, front, up coordinates."""
    u = (float(pixel[0]) - size / 2.0) / (size / 2.0)
    v = (float(pixel[1]) - size / 2.0) / (size / 2.0)
    by_face = {
        "f": np.asarray([u, 1.0, -v]),
        "r": np.asarray([1.0, -u, -v]),
        "b": np.asarray([-u, -1.0, -v]),
        "l": np.asarray([-1.0, u, -v]),
        "u": np.asarray([u, v, 1.0]),
        "d": np.asarray([u, -v, -1.0]),
    }
    if face not in by_face:
        raise ValueError(f"Unsupported cube face: {face}")
    ray = by_face[face]
    return ray / np.linalg.norm(ray)


def rotation(yaw_radians: float) -> np.ndarray:
    cosine = math.cos(yaw_radians)
    sine = math.sin(yaw_radians)
    return np.asarray([[cosine, -sine], [sine, cosine]])


def metric_summary(values: list[float]) -> dict[str, float | int | None]:
    array = np.asarray(values, dtype=float)
    return {
        "count": int(array.size),
        "minimum": None if array.size == 0 else round(float(np.min(array)), 9),
        "median": None if array.size == 0 else round(float(np.median(array)), 9),
        "p95": None if array.size == 0 else round(float(np.percentile(array, 95)), 9),
        "maximum": None if array.size == 0 else round(float(np.max(array)), 9),
    }


def circular_difference_degrees(first: float, second: float) -> float:
    return abs((first - second + 180.0) % 360.0 - 180.0)


def pose_values(
    parameters: np.ndarray,
    controls: list[dict[str, Any]],
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    camera = parameters[:2]
    yaw = float(parameters[2])
    rotate = rotation(yaw)
    cross_track: list[float] = []
    depths: list[float] = []
    relative_heights: list[float] = []
    for control in controls:
        ray = control["ray"]
        horizontal = rotate @ ray[:2]
        horizontal_squared = float(np.dot(horizontal, horizontal))
        delta = control["position"] - camera
        depth = float(np.dot(delta, horizontal) / horizontal_squared)
        predicted = camera + depth * horizontal
        cross_track.append(float(np.linalg.norm(control["position"] - predicted)))
        depths.append(depth)
        relative_heights.append(depth * float(ray[2]))
    return (
        np.asarray(cross_track, dtype=float),
        np.asarray(depths, dtype=float),
        np.asarray(relative_heights, dtype=float),
    )


def fit_residuals(parameters: np.ndarray, controls: list[dict[str, Any]]) -> np.ndarray:
    camera = parameters[:2]
    yaw = float(parameters[2])
    rotate = rotation(yaw)
    cross_track_signed: list[float] = []
    depths: list[float] = []
    heights: list[float] = []
    row_keys: list[str] = []
    for control in controls:
        ray = control["ray"]
        horizontal = rotate @ ray[:2]
        horizontal_squared = float(np.dot(horizontal, horizontal))
        delta = control["position"] - camera
        depth = float(np.dot(delta, horizontal) / horizontal_squared)
        cross_track_signed.append(
            float((delta[0] * horizontal[1] - delta[1] * horizontal[0]) / math.sqrt(horizontal_squared))
        )
        depths.append(depth)
        heights.append(depth * float(ray[2]))
        row_keys.append(control["rowKey"])
    height_array = np.asarray(heights, dtype=float)
    relative_height_residuals = np.zeros(len(controls), dtype=float)
    for row_key in sorted(set(row_keys)):
        indices = [index for index, value in enumerate(row_keys) if value == row_key]
        median = float(np.median(height_array[indices]))
        relative_height_residuals[indices] = height_array[indices] - median
    negative_depth_penalties = np.minimum(np.asarray(depths, dtype=float), 0.0) * 10.0
    return np.concatenate(
        [
            np.asarray(cross_track_signed, dtype=float),
            relative_height_residuals,
            negative_depth_penalties,
        ]
    )


def deduplicate_solutions(solutions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    unique: list[dict[str, Any]] = []
    for solution in sorted(solutions, key=lambda item: item["cost"]):
        camera = solution["parameters"][:2]
        yaw = math.degrees(float(solution["parameters"][2])) % 360.0
        if any(
            np.linalg.norm(camera - prior["parameters"][:2]) < 0.05
            and circular_difference_degrees(
                yaw,
                math.degrees(float(prior["parameters"][2])) % 360.0,
            ) < 0.1
            for prior in unique
        ):
            continue
        unique.append(solution)
    return unique


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--maximum-horizontal-p95-feet", type=float, default=1.0)
    parser.add_argument("--maximum-vertical-p95-feet", type=float, default=1.0)
    parser.add_argument("--maximum-pose-ambiguity-feet", type=float, default=1.0)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    controls_bytes = arguments.controls.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    reviewed = json.loads(controls_bytes)
    if reviewed.get("analysisVersion") != "reviewed-sportsdigita-cubemap-seat-controls-v1":
        raise ValueError("Controls use an unsupported analysis version")
    expected_inputs = reviewed["inputs"]
    if expected_inputs["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Row artifact SHA-256 does not match reviewed controls")
    if expected_inputs["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama manifest SHA-256 does not match reviewed controls")

    section_id = str(reviewed["sectionId"])
    source_section = next(
        record for record in panorama["sections"] if str(record["sectionId"]) == section_id
    )
    images = {entry["face"]: entry for entry in source_section["images"]}
    section_rows = {
        row["rowKey"]: row
        for row in rows_artifact["geometryRows"]
        if str(row["sectionId"]) == section_id
    }
    if not section_rows:
        raise ValueError(f"No provider rows found for section {section_id}")
    seat_positions: dict[tuple[str, str], np.ndarray] = {}
    for row_key, row in section_rows.items():
        for seat in row["seats"]:
            seat_positions[(row_key, str(seat["seatLabel"]))] = np.asarray(
                seat["eastNorthFeetFromInputCenter"], dtype=float
            )

    controls: list[dict[str, Any]] = []
    for control in reviewed["controls"]:
        face = str(control["face"])
        image = images.get(face)
        if image is None:
            raise ValueError(f"Panorama has no {face} face")
        source_path = Path(image["localPath"])
        if sha256_file(source_path) != image["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {source_path}")
        if control["sourceImageSha256"] != image["sha256"]:
            raise ValueError(f"Control source checksum mismatch: {control['controlId']}")
        row_key = str(control["rowKey"])
        seat_label = str(control["seatLabel"])
        position = seat_positions.get((row_key, seat_label))
        if position is None:
            raise ValueError(f"Control seat is absent from provider rows: {row_key} seat {seat_label}")
        with Image.open(source_path) as source_image:
            width, height = source_image.size
        if width != height:
            raise ValueError("Cube face must be square")
        pixel = np.asarray(control["pixel"], dtype=float)
        if pixel.shape != (2,) or np.any(pixel < 0) or np.any(pixel > width):
            raise ValueError(f"Invalid control pixel: {control['controlId']}")
        controls.append(
            {
                **control,
                "face": face,
                "rowKey": row_key,
                "seatLabel": seat_label,
                "position": position,
                "ray": cubemap_ray(face, pixel, int(width)),
            }
        )
    training = [control for control in controls if control["partition"] == "training"]
    holdout = [control for control in controls if control["partition"] == "holdout"]
    if len(training) < 2:
        raise ValueError("At least two training controls are required")
    camera_anchor = reviewed["cameraRowHypothesis"]
    camera_row_identity_accepted = camera_anchor.get("status") == "accepted"
    anchor_position = seat_positions[
        (str(camera_anchor["rowKey"]), str(camera_anchor["seatLabel"]))
    ]

    solutions: list[dict[str, Any]] = []
    for yaw_degrees in range(0, 360, 30):
        for offset_east in (-3.0, 0.0, 3.0):
            for offset_north in (-3.0, 0.0, 3.0):
                initial = np.asarray(
                    [
                        anchor_position[0] + offset_east,
                        anchor_position[1] + offset_north,
                        math.radians(yaw_degrees),
                    ],
                    dtype=float,
                )
                fitted = least_squares(
                    fit_residuals,
                    initial,
                    args=(training,),
                    max_nfev=20_000,
                    xtol=1e-13,
                    ftol=1e-13,
                    gtol=1e-13,
                )
                cross_track, depths, heights = pose_values(fitted.x, training)
                if np.any(depths <= 0):
                    continue
                solutions.append(
                    {
                        "parameters": fitted.x,
                        "cost": float(np.sum(fit_residuals(fitted.x, training) ** 2)),
                        "success": bool(fitted.success),
                        "crossTrack": cross_track,
                        "heights": heights,
                    }
                )
    unique_solutions = deduplicate_solutions(solutions)
    if not unique_solutions:
        raise ValueError("No positive-depth camera solution was found")
    best = unique_solutions[0]
    parameters = best["parameters"]
    camera = parameters[:2]
    yaw_degrees = math.degrees(float(parameters[2])) % 360.0

    training_cross, training_depths, training_heights = pose_values(parameters, training)
    training_by_row: dict[str, list[float]] = {}
    for control, relative_height in zip(training, training_heights):
        training_by_row.setdefault(control["rowKey"], []).append(float(relative_height))
    row_badge_heights = {
        row_key: float(np.median(values))
        for row_key, values in training_by_row.items()
    }
    reference_row_key = str(reviewed["relativeElevationReferenceRowKey"])
    reference_height = row_badge_heights.get(reference_row_key)
    if reference_height is None:
        raise ValueError("Relative elevation reference row has no training controls")

    holdout_cross, holdout_depths, holdout_heights = pose_values(parameters, holdout)
    holdout_vertical: list[float] = []
    holdout_records: list[dict[str, Any]] = []
    for index, control in enumerate(holdout):
        expected_height = row_badge_heights.get(control["rowKey"])
        vertical_residual = (
            None
            if expected_height is None
            else abs(float(holdout_heights[index]) - expected_height)
        )
        if vertical_residual is not None:
            holdout_vertical.append(vertical_residual)
        holdout_records.append(
            {
                "controlId": control["controlId"],
                "rowKey": control["rowKey"],
                "seatLabel": control["seatLabel"],
                "face": control["face"],
                "pixel": control["pixel"],
                "depthFeet": round(float(holdout_depths[index]), 9),
                "crossTrackResidualFeet": round(float(holdout_cross[index]), 9),
                "relativeBadgeHeightFeet": round(float(holdout_heights[index]), 9),
                "verticalResidualFeet": (
                    None if vertical_residual is None else round(vertical_residual, 9)
                ),
            }
        )
    training_horizontal_summary = metric_summary(training_cross.tolist())
    holdout_horizontal_summary = metric_summary(holdout_cross.tolist())
    holdout_vertical_summary = metric_summary(holdout_vertical)
    fitted_rows = sorted(row_badge_heights)
    all_rows = sorted(section_rows, key=lambda row_key: int(row_key.split(":", 1)[1]))
    holdout_rows = sorted({control["rowKey"] for control in holdout})
    row_coverage_percent = 100.0 * len(fitted_rows) / len(all_rows)
    validated_row_coverage_percent = 100.0 * len(set(fitted_rows) & set(holdout_rows)) / len(all_rows)
    second_solution = unique_solutions[1] if len(unique_solutions) > 1 else None
    ambiguity_distance = (
        None
        if second_solution is None
        else float(np.linalg.norm(camera - second_solution["parameters"][:2]))
    )
    ambiguity_near_equal = bool(
        second_solution is not None
        and second_solution["cost"] <= best["cost"] + 1e-8
        and ambiguity_distance is not None
        and ambiguity_distance > arguments.maximum_pose_ambiguity_feet
    )
    local_measurement_eligible = bool(
        row_coverage_percent == 100.0
        and validated_row_coverage_percent == 100.0
        and holdout_horizontal_summary["p95"] is not None
        and holdout_horizontal_summary["p95"] <= arguments.maximum_horizontal_p95_feet
        and holdout_vertical_summary["p95"] is not None
        and holdout_vertical_summary["p95"] <= arguments.maximum_vertical_p95_feet
        and not ambiguity_near_equal
        and camera_row_identity_accepted
    )

    blockers: list[str] = []
    if row_coverage_percent < 100.0:
        blockers.append("TRAINING_ROW_COVERAGE_INCOMPLETE")
    if validated_row_coverage_percent < 100.0:
        blockers.append("HOLDOUT_ROW_COVERAGE_INCOMPLETE")
    if holdout_horizontal_summary["p95"] is None:
        blockers.append("HORIZONTAL_HOLDOUT_MISSING")
    elif holdout_horizontal_summary["p95"] > arguments.maximum_horizontal_p95_feet:
        blockers.append("HORIZONTAL_HOLDOUT_EXCEEDS_ONE_FOOT")
    if holdout_vertical_summary["p95"] is None:
        blockers.append("VERTICAL_HOLDOUT_MISSING")
    elif holdout_vertical_summary["p95"] > arguments.maximum_vertical_p95_feet:
        blockers.append("VERTICAL_HOLDOUT_EXCEEDS_ONE_FOOT")
    if ambiguity_near_equal:
        blockers.append("CAMERA_POSE_AMBIGUOUS")
    if not camera_row_identity_accepted:
        blockers.append("CAMERA_ROW_IDENTITY_NOT_INDEPENDENTLY_VALIDATED")
    blockers.extend(
        [
            "PROVIDER_LOCAL_FRAME_RELEASE_REGISTRATION_NOT_PASSED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ]
    )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "rowsArtifactVersion": rows_artifact.get("artifactVersion"),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama.get("artifactVersion"),
            "controlsPath": str(arguments.controls),
            "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        },
        "sectionId": section_id,
        "cameraPoseProviderLocal": {
            "eastNorthFeetFromInputCenter": [
                round(float(camera[0]), 9),
                round(float(camera[1]), 9),
            ],
            "yawDegrees": round(yaw_degrees, 9),
            "distanceFromHypothesizedSeatAnchorFeet": round(
                float(np.linalg.norm(camera - anchor_position)), 9
            ),
            "hypothesizedAnchor": camera_anchor,
            "referenceRowBadgeHeightRelativeToCameraFeet": round(reference_height, 9),
        },
        "poseSolutions": {
            "uniquePositiveDepthCount": len(unique_solutions),
            "bestCost": round(float(best["cost"]), 12),
            "secondBestCost": (
                None if second_solution is None else round(float(second_solution["cost"]), 12)
            ),
            "bestToSecondCameraDistanceFeet": (
                None if ambiguity_distance is None else round(ambiguity_distance, 9)
            ),
            "nearEqualMaterialAmbiguity": ambiguity_near_equal,
        },
        "training": {
            "controlCount": len(training),
            "rowCount": len(fitted_rows),
            "horizontalCrossTrackResidualFeet": training_horizontal_summary,
        },
        "holdout": {
            "controlCount": len(holdout),
            "rowCount": len(holdout_rows),
            "horizontalCrossTrackResidualFeet": holdout_horizontal_summary,
            "verticalResidualFeet": holdout_vertical_summary,
            "controls": holdout_records,
        },
        "rows": [
            {
                "rowKey": row_key,
                "trainingControlCount": len(training_by_row.get(row_key, [])),
                "holdoutControlCount": sum(control["rowKey"] == row_key for control in holdout),
                "relativeBadgeHeightFeet": (
                    None
                    if row_key not in row_badge_heights
                    else round(row_badge_heights[row_key] - reference_height, 9)
                ),
                "relativeTreadElevationFeet": (
                    None
                    if row_key not in row_badge_heights
                    else round(row_badge_heights[row_key] - reference_height, 9)
                ),
                "treadElevationBasis": (
                    "same-model badge height cancels in row-to-row differences"
                    if row_key in row_badge_heights
                    else None
                ),
            }
            for row_key in all_rows
        ],
        "validation": {
            "trainingRowCoveragePercent": round(row_coverage_percent, 6),
            "holdoutValidatedRowCoveragePercent": round(validated_row_coverage_percent, 6),
            "maximumHorizontalP95Feet": arguments.maximum_horizontal_p95_feet,
            "maximumVerticalP95Feet": arguments.maximum_vertical_p95_feet,
            "providerLocalRowMeasurementEligible": local_measurement_eligible,
        },
        "scope": {
            "establishes": [
                "provider-local camera horizontal pose candidate",
                "provider-local relative row elevations for rows with reviewed training controls",
                "disjoint local metric residuals for reviewed holdout controls",
            ],
            "doesNotEstablish": [
                "absolute vertical datum",
                "release-grade georeferencing",
                "current obstruction geometry",
                "shadow boundary accuracy",
            ],
        },
        "publication": {
            "eligible": False,
            "blockers": blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "provider-local-cubemap-row-geometry",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "cameraEastNorthFeet": artifact["cameraPoseProviderLocal"]["eastNorthFeetFromInputCenter"],
                "cameraYawDegrees": artifact["cameraPoseProviderLocal"]["yawDegrees"],
                "distanceFromHypothesizedSeatAnchorFeet": artifact["cameraPoseProviderLocal"]["distanceFromHypothesizedSeatAnchorFeet"],
                "trainingRowCoveragePercent": artifact["validation"]["trainingRowCoveragePercent"],
                "holdoutValidatedRowCoveragePercent": artifact["validation"]["holdoutValidatedRowCoveragePercent"],
                "providerLocalRowMeasurementEligible": local_measurement_eligible,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

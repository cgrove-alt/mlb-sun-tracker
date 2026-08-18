#!/usr/bin/env python3
"""Fit a full-orientation Section 207 cubemap pose from four ground controls."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-full-orientation-field-pose-v1"


def cubemap_ray(face: str, pixel: tuple[float, float], size: int) -> np.ndarray:
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
    ray = by_face[face]
    return ray / np.linalg.norm(ray)


def provider_ray_to_pixel(ray: np.ndarray, size: int) -> tuple[str, float, float]:
    x, y, z = [float(value) for value in ray]
    maximum = max(abs(x), abs(y), abs(z))
    if maximum <= 0:
        raise ValueError("Cannot project a zero ray")
    if abs(x) == maximum:
        if x >= 0:
            face, scale, u, v = "r", x, -y / x, -z / x
        else:
            face, scale, u, v = "l", -x, y / -x, -z / -x
    elif abs(y) == maximum:
        if y >= 0:
            face, scale, u, v = "f", y, x / y, -z / y
        else:
            face, scale, u, v = "b", -y, -x / -y, -z / -y
    elif z >= 0:
        face, scale, u, v = "u", z, x / z, y / z
    else:
        face, scale, u, v = "d", -z, x / -z, -y / -z
    if scale <= 0:
        raise ValueError("Cubemap projection scale is non-positive")
    return face, (u + 1.0) * size / 2.0, (v + 1.0) * size / 2.0


def pose_residuals(
    parameters: np.ndarray,
    world_points: np.ndarray,
    provider_rays: np.ndarray,
    angular_sigmas: np.ndarray,
) -> np.ndarray:
    camera = parameters[:3]
    rotate = Rotation.from_rotvec(parameters[3:]).as_matrix()
    predicted = world_points - camera[None, :]
    lengths = np.linalg.norm(predicted, axis=1)
    if np.any(lengths <= 1e-6):
        return np.full(len(world_points) * 3, 1e6)
    predicted /= lengths[:, None]
    observed_world = provider_rays @ rotate.T
    cross = np.cross(observed_world, predicted)
    return (cross / angular_sigmas[:, None]).ravel()


def rotation_diagnostics(matrix: np.ndarray) -> dict[str, float]:
    provider_x = matrix @ np.asarray([1.0, 0.0, 0.0])
    provider_y = matrix @ np.asarray([0.0, 1.0, 0.0])
    provider_z = matrix @ np.asarray([0.0, 0.0, 1.0])
    yaw = math.degrees(math.atan2(provider_x[1], provider_x[0])) % 360.0
    up_tilt = math.degrees(math.acos(float(np.clip(provider_z[2], -1.0, 1.0))))
    return {
        "providerXProjectedYawDegrees": yaw,
        "providerXVerticalComponent": float(provider_x[2]),
        "providerYVerticalComponent": float(provider_y[2]),
        "providerUpTiltFromWorldUpDegrees": up_tilt,
    }


def unique_solutions(solutions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    ordered = sorted(solutions, key=lambda item: item["weightedSquaredError"])
    unique: list[dict[str, Any]] = []
    for item in ordered:
        position = np.asarray(item["cameraProjectedFeet"])
        rotation = np.asarray(item["rotationMatrixProviderToWorld"])
        if any(
            np.linalg.norm(position - np.asarray(prior["cameraProjectedFeet"])) < 0.05
            and np.linalg.norm(rotation - np.asarray(prior["rotationMatrixProviderToWorld"])) < 1e-4
            for prior in unique
        ):
            continue
        unique.append(item)
    return unique


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("cross_face_pose", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    cross_bytes = args.cross_face_pose.read_bytes()
    cross = json.loads(cross_bytes)
    if cross.get("analysisVersion") != "rockies-panorama-cross-face-regulation-field-pose-v1":
        raise ValueError("Unsupported cross-face pose")
    bearing_path = Path(cross["inputs"]["bearingPosePath"])
    bearing_bytes = bearing_path.read_bytes()
    if hashlib.sha256(bearing_bytes).hexdigest() != cross["inputs"]["bearingPoseSha256"]:
        raise ValueError("Bearing pose checksum differs")
    bearing = json.loads(bearing_bytes)
    adjacent_path = Path(cross["inputs"]["adjacentControlsPath"])
    adjacent_bytes = adjacent_path.read_bytes()
    if hashlib.sha256(adjacent_bytes).hexdigest() != cross["inputs"]["adjacentControlsSha256"]:
        raise ValueError("Adjacent controls checksum differs")
    adjacent = json.loads(adjacent_bytes)
    left_path = Path(adjacent["inputs"]["leftFaceExtraction"]["path"])
    left_bytes = left_path.read_bytes()
    if hashlib.sha256(left_bytes).hexdigest() != adjacent["inputs"]["leftFaceExtraction"]["sha256"]:
        raise ValueError("Left-face extraction checksum differs")
    left = json.loads(left_bytes)
    registration_path = Path(left["inputs"]["ngsCorrectedFieldRegistration"]["path"])
    registration_bytes = registration_path.read_bytes()
    if hashlib.sha256(registration_bytes).hexdigest() != left["inputs"]["ngsCorrectedFieldRegistration"]["sha256"]:
        raise ValueError("Registration checksum differs")
    registration = json.loads(registration_bytes)

    size = 2048
    base_a = left["baseCandidates"][0]["selected"]
    base_b = left["baseCandidates"][1]["selected"]
    home = adjacent["homePlate"]["selected"]
    first = adjacent["firstBaseCandidate"]["selected"]
    control_pixels = [
        ("l", tuple(base_a["centroidPixel"]), float(base_a["centroidUncertaintyPixels95"]), "thirdBase"),
        ("l", tuple(base_b["centroidPixel"]), float(base_b["centroidUncertaintyPixels95"]), "secondBase"),
        ("b", tuple(home["intersectionPixel"]), float(home["intersectionUncertaintyPixels95"]), "homePlate"),
        ("b", tuple(first["centerPixel"]), float(first["centerUncertaintyPixels95"]), "firstBase"),
    ]
    world_lookup = {
        key: np.asarray(value, dtype=np.float64)
        for key, value in bearing["worldControlsProjectedFeet"].items()
    }
    world_lookup["homePlate"] = np.asarray(
        registration["transform"]["homePlateProjectedFeet"], dtype=np.float64
    )
    world_points = np.asarray(
        [[*world_lookup[identifier], 0.0] for _, _, _, identifier in control_pixels],
        dtype=np.float64,
    )
    provider_rays = np.asarray(
        [cubemap_ray(face, pixel, size) for face, pixel, _, _ in control_pixels],
        dtype=np.float64,
    )
    angular_sigmas = np.asarray(
        [uncertainty / 1.96 / (size / 2.0) for _, _, uncertainty, _ in control_pixels],
        dtype=np.float64,
    )

    initial_camera_xy = np.asarray(cross["selectedPose"]["cameraProjectedFeet"])
    initial_height = float(cross["selectedPose"]["cameraHeightAbovePlayingSurfaceFeetCandidate"])
    initial_yaw = math.radians(float(cross["selectedPose"]["providerToProjectedYawDegrees"]))
    solutions = []
    for height_offset in (-10.0, 0.0, 10.0):
        for roll_degrees in (-5.0, 0.0, 5.0):
            for pitch_degrees in (-5.0, 0.0, 5.0):
                initial_rotation = Rotation.from_euler(
                    "zyx", [initial_yaw, math.radians(pitch_degrees), math.radians(roll_degrees)]
                )
                initial = np.concatenate(
                    (
                        [initial_camera_xy[0], initial_camera_xy[1], initial_height + height_offset],
                        initial_rotation.as_rotvec(),
                    )
                )
                fitted = least_squares(
                    pose_residuals,
                    initial,
                    args=(world_points, provider_rays, angular_sigmas),
                    max_nfev=50_000,
                    xtol=1e-13,
                    ftol=1e-13,
                    gtol=1e-13,
                )
                rotation = Rotation.from_rotvec(fitted.x[3:]).as_matrix()
                residual = pose_residuals(
                    fitted.x, world_points, provider_rays, angular_sigmas
                )
                control_records = []
                for (face, pixel, uncertainty, identifier), world in zip(
                    control_pixels, world_points
                ):
                    provider_prediction = rotation.T @ (
                        (world - fitted.x[:3]) / np.linalg.norm(world - fitted.x[:3])
                    )
                    predicted_face, predicted_x, predicted_y = provider_ray_to_pixel(
                        provider_prediction, size
                    )
                    radial = (
                        math.hypot(predicted_x - pixel[0], predicted_y - pixel[1])
                        if predicted_face == face
                        else None
                    )
                    control_records.append({
                        "controlId": identifier,
                        "observedFace": face,
                        "observedPixel": list(pixel),
                        "uncertaintyPixels95": uncertainty,
                        "predictedFace": predicted_face,
                        "predictedPixel": [predicted_x, predicted_y],
                        "radialResidualPixels": radial,
                    })
                solutions.append({
                    "cameraProjectedFeet": fitted.x[:3].tolist(),
                    "rotationMatrixProviderToWorld": rotation.tolist(),
                    "rotationDiagnostics": rotation_diagnostics(rotation),
                    "weightedSquaredError": float(np.sum(residual**2)),
                    "controls": control_records,
                })
    solutions = unique_solutions(solutions)
    best = solutions[0]
    camera = np.asarray(best["cameraProjectedFeet"], dtype=np.float64)
    rotation = np.asarray(
        best["rotationMatrixProviderToWorld"], dtype=np.float64
    )
    if not np.all(np.isfinite(camera)) or not np.all(np.isfinite(rotation)):
        raise ValueError("Selected full-orientation solution is non-finite")

    mound_center = world_lookup["moundCenter"]
    mound_radius = float(left["regulationGeometryFeet"]["moundDiameter"]) / 2.0
    angles = np.linspace(0.0, 2.0 * math.pi, 8192, endpoint=False)
    circle_world = np.column_stack(
        (
            mound_center[0] + mound_radius * np.cos(angles),
            mound_center[1] + mound_radius * np.sin(angles),
            np.zeros_like(angles),
        )
    )
    world_directions = circle_world - camera[None, :]
    world_directions /= np.linalg.norm(world_directions, axis=1)[:, None]
    provider_directions = world_directions @ rotation
    projected = [provider_ray_to_pixel(ray, size) for ray in provider_directions]
    left_pixels = np.asarray(
        [[x, y] for face, x, y in projected if face == "l"], dtype=np.float64
    )
    if len(left_pixels) == 0:
        raise ValueError("Fitted pose does not project the mound circle onto the left face")
    predicted_left = float(np.min(left_pixels[:, 0]))
    predicted_right = float(np.max(left_pixels[:, 0]))
    mound = left["mound"]["selected"]
    tangent_holdout = {
        "circleUsedByOptimizer": False,
        "observedLeftTangentPixelX": float(mound["leftTangentPixelX"]),
        "observedRightTangentPixelX": float(mound["rightTangentPixelX"]),
        "leftUncertaintyPixels95": float(mound["leftTangentUncertaintyPixels95"]),
        "rightUncertaintyPixels95": float(mound["rightTangentUncertaintyPixels95"]),
        "predictedLeftTangentPixelX": predicted_left,
        "predictedRightTangentPixelX": predicted_right,
        "leftResidualPixels": abs(predicted_left - float(mound["leftTangentPixelX"])),
        "rightResidualPixels": abs(predicted_right - float(mound["rightTangentPixelX"])),
    }
    tangent_holdout["passes"] = (
        tangent_holdout["leftResidualPixels"] <= tangent_holdout["leftUncertaintyPixels95"]
        and tangent_holdout["rightResidualPixels"] <= tangent_holdout["rightUncertaintyPixels95"]
    )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "crossFacePosePath": str(args.cross_face_pose),
            "crossFacePoseSha256": hashlib.sha256(cross_bytes).hexdigest(),
            "crossFacePoseArtifactVersion": cross["artifactVersion"],
            "leftFaceExtractionArtifactVersion": left["artifactVersion"],
            "adjacentControlsArtifactVersion": adjacent["artifactVersion"],
            "fieldRegistrationArtifactVersion": registration["artifactVersion"],
        },
        "fitPartition": {
            "trainingControls": ["firstBase", "secondBase", "thirdBase", "homePlate"],
            "moundCircleUsedByOptimizer": False,
        },
        "candidateSolutions": solutions,
        "selectedSolution": best,
        "moundCirclePrefitHoldout": tangent_holdout,
    }
    training_pass = all(
        item["radialResidualPixels"] is not None
        and item["radialResidualPixels"] <= item["uncertaintyPixels95"]
        for item in best["controls"]
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-full-orientation-field-pose-audit",
        "artifactStage": "full-orientation-fit-mound-circle-prefit-holdout",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesCandidateFullOrientationPose": training_pass and tangent_holdout["passes"],
            "establishesReleaseCameraPose": False,
            "trainingControlsWithinLockedPixelUncertainty": training_pass,
            "moundCirclePrefitHoldoutPassed": tangent_holdout["passes"],
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if training_pass else ["FULL_ORIENTATION_TRAINING_RESIDUAL_EXCEEDS_PIXEL_UNCERTAINTY"]),
                *([] if tangent_holdout["passes"] else ["MOUND_CIRCLE_PREFIT_HOLDOUT_FAILED"]),
                "FULL_ORIENTATION_POSE_UNCERTAINTY_NOT_PROPAGATED",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "selectedSolution": best,
        "moundCirclePrefitHoldout": tangent_holdout,
        "geometryBoundary": artifact["geometryBoundary"],
    }, indent=2))


if __name__ == "__main__":
    main()

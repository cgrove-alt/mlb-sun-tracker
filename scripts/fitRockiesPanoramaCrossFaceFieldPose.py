#!/usr/bin/env python3
"""Fit and cross-validate a multi-face regulation-field camera pose."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from scipy.optimize import least_squares

from fitRockiesPanoramaRegulationFieldPose import (
    angle_delta,
    artifact_version,
    face_pixel_to_provider_angle,
    pixel_angle_uncertainty,
    point_bearing_residuals,
    provider_angle_to_face_pixel,
)


ANALYSIS_VERSION = "rockies-panorama-cross-face-regulation-field-pose-v1"


def fit_pose(
    initial: np.ndarray,
    observations: np.ndarray,
    sigmas: np.ndarray,
    worlds: np.ndarray,
) -> np.ndarray:
    fitted = least_squares(
        point_bearing_residuals,
        initial,
        args=(observations, sigmas, worlds),
        max_nfev=20_000,
        xtol=1e-13,
        ftol=1e-13,
        gtol=1e-13,
    )
    if not fitted.success and np.max(np.abs(fitted.fun)) > 1e-5:
        raise ValueError("Cross-face pose fit did not converge")
    return fitted.x


def predicted_provider_angle(parameters: np.ndarray, point: np.ndarray) -> float:
    delta = point - parameters[:2]
    return math.atan2(float(delta[1]), float(delta[0])) - float(parameters[2])


def implied_camera_height(
    camera: np.ndarray,
    world_point: np.ndarray,
    face: str,
    pixel: tuple[float, float],
    face_size: int,
) -> float:
    horizontal_distance = float(np.linalg.norm(world_point - camera))
    u = (float(pixel[0]) - face_size / 2.0) / (face_size / 2.0)
    v = (float(pixel[1]) - face_size / 2.0) / (face_size / 2.0)
    return horizontal_distance * v / math.sqrt(1.0 + u * u)


def predicted_vertical_pixel(
    camera_height: float,
    camera: np.ndarray,
    world_point: np.ndarray,
    provider_angle: float,
    face: str,
    face_size: int,
) -> float:
    horizontal_distance = float(np.linalg.norm(world_point - camera))
    x = math.cos(provider_angle)
    y = math.sin(provider_angle)
    dominant = {
        "l": -x,
        "r": x,
        "f": y,
        "b": -y,
    }[face]
    if dominant <= 0:
        raise ValueError("Predicted point does not lie on requested cubemap face")
    horizontal_ray_norm = math.sqrt(x * x + y * y) / dominant
    scale = horizontal_distance / horizontal_ray_norm
    v = camera_height / scale
    return (v + 1.0) * face_size / 2.0


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bearing_pose", type=Path)
    parser.add_argument("adjacent_controls", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    bearing_bytes = args.bearing_pose.read_bytes()
    bearing = json.loads(bearing_bytes)
    if bearing.get("analysisVersion") != "rockies-panorama-regulation-field-bearing-pose-v2":
        raise ValueError("Unsupported bearing-pose audit")
    selected = bearing["complementaryPartition"]["adjudication"]
    if not selected.get("identitySelected"):
        raise ValueError("Bearing audit did not select field identities")
    selected_pose = selected["bestPlausibleCandidate"]

    adjacent_bytes = args.adjacent_controls.read_bytes()
    adjacent = json.loads(adjacent_bytes)
    if adjacent.get("analysisVersion") != "rockies-panorama-adjacent-infield-control-extraction-v1":
        raise ValueError("Unsupported adjacent-face control extraction")
    left_path = Path(adjacent["inputs"]["leftFaceExtraction"]["path"])
    left_bytes = left_path.read_bytes()
    if hashlib.sha256(left_bytes).hexdigest() != adjacent["inputs"]["leftFaceExtraction"]["sha256"]:
        raise ValueError("Left-face extraction checksum differs")
    left = json.loads(left_bytes)
    registration_path = Path(left["inputs"]["ngsCorrectedFieldRegistration"]["path"])
    registration_bytes = registration_path.read_bytes()
    if hashlib.sha256(registration_bytes).hexdigest() != left["inputs"]["ngsCorrectedFieldRegistration"]["sha256"]:
        raise ValueError("Field registration checksum differs")
    registration = json.loads(registration_bytes)

    face_size = 2048
    mound = left["mound"]["selected"]
    base_a = left["baseCandidates"][0]["selected"]
    base_b = left["baseCandidates"][1]["selected"]
    home = adjacent["homePlate"]["selected"]
    first = adjacent["firstBaseCandidate"]["selected"]
    mound_left = face_pixel_to_provider_angle("l", mound["leftTangentPixelX"], face_size)
    mound_right = face_pixel_to_provider_angle("l", mound["rightTangentPixelX"], face_size)
    mound_center_angle = math.atan2(
        math.sin(mound_left) + math.sin(mound_right),
        math.cos(mound_left) + math.cos(mound_right),
    )
    observations = np.asarray(
        [
            mound_center_angle,
            face_pixel_to_provider_angle("l", base_a["centroidPixel"][0], face_size),
            face_pixel_to_provider_angle("l", base_b["centroidPixel"][0], face_size),
            face_pixel_to_provider_angle("b", home["intersectionPixel"][0], face_size),
        ],
        dtype=np.float64,
    )
    mound_sigma = math.sqrt(
        pixel_angle_uncertainty("l", mound["leftTangentPixelX"], mound["leftTangentUncertaintyPixels95"], face_size) ** 2
        + pixel_angle_uncertainty("l", mound["rightTangentPixelX"], mound["rightTangentUncertaintyPixels95"], face_size) ** 2
    ) / (2.0 * 1.96)
    sigmas = np.asarray(
        [
            mound_sigma,
            pixel_angle_uncertainty("l", base_a["centroidPixel"][0], base_a["centroidUncertaintyPixels95"], face_size) / 1.96,
            pixel_angle_uncertainty("l", base_b["centroidPixel"][0], base_b["centroidUncertaintyPixels95"], face_size) / 1.96,
            pixel_angle_uncertainty("b", home["intersectionPixel"][0], home["intersectionUncertaintyPixels95"], face_size) / 1.96,
        ],
        dtype=np.float64,
    )
    world_lookup = {
        key: np.asarray(value, dtype=np.float64)
        for key, value in bearing["worldControlsProjectedFeet"].items()
    }
    home_world = np.asarray(
        registration["transform"]["homePlateProjectedFeet"], dtype=np.float64
    )
    worlds = np.vstack(
        (
            world_lookup["moundCenter"],
            world_lookup["thirdBase"],
            world_lookup["secondBase"],
            home_world,
        )
    )
    initial = np.asarray(
        [
            selected_pose["cameraProjectedFeet"][0],
            selected_pose["cameraProjectedFeet"][1],
            math.radians(selected_pose["providerToProjectedYawDegrees"]),
        ],
        dtype=np.float64,
    )
    fitted = fit_pose(initial, observations, sigmas, worlds)

    fit_records = []
    for identifier, face, observed_pixel, world, observation, sigma in zip(
        ("moundCenter", "thirdBase", "secondBase", "homePlate"),
        ("l", "l", "l", "b"),
        (
            (mound["leftTangentPixelX"] + mound["rightTangentPixelX"]) / 2.0,
            base_a["centroidPixel"][0],
            base_b["centroidPixel"][0],
            home["intersectionPixel"][0],
        ),
        worlds,
        observations,
        sigmas,
    ):
        predicted_angle = predicted_provider_angle(fitted, world)
        predicted_face, predicted_pixel = provider_angle_to_face_pixel(predicted_angle, face_size)
        fit_records.append({
            "controlId": identifier,
            "observedFace": face,
            "observedPixelX": float(observed_pixel),
            "predictedFace": predicted_face,
            "predictedPixelX": predicted_pixel,
            "angularResidualDegrees": math.degrees(abs(angle_delta(predicted_angle, observation))),
            "normalizedResidualSigma": abs(angle_delta(predicted_angle, observation)) / float(sigma),
            "pixelResidual": abs(predicted_pixel - observed_pixel) if predicted_face == face else None,
        })

    leave_one_out = []
    for held_out in range(len(observations)):
        training_mask = np.arange(len(observations)) != held_out
        held_fit = fit_pose(
            fitted,
            observations[training_mask],
            sigmas[training_mask],
            worlds[training_mask],
        )
        predicted_angle = predicted_provider_angle(held_fit, worlds[held_out])
        predicted_face, predicted_pixel = provider_angle_to_face_pixel(predicted_angle, face_size)
        observed_face = ("l", "l", "l", "b")[held_out]
        observed_pixel = (
            (mound["leftTangentPixelX"] + mound["rightTangentPixelX"]) / 2.0,
            base_a["centroidPixel"][0],
            base_b["centroidPixel"][0],
            home["intersectionPixel"][0],
        )[held_out]
        leave_one_out.append({
            "heldOutControlId": ("moundCenter", "thirdBase", "secondBase", "homePlate")[held_out],
            "predictedFace": predicted_face,
            "predictedPixelX": predicted_pixel,
            "observedFace": observed_face,
            "observedPixelX": float(observed_pixel),
            "pixelResidual": abs(predicted_pixel - observed_pixel) if predicted_face == observed_face else None,
        })

    first_world = world_lookup["firstBase"]
    first_angle = predicted_provider_angle(fitted, first_world)
    first_face, first_pixel_x = provider_angle_to_face_pixel(first_angle, face_size)
    ground_height_controls = [
        implied_camera_height(
            fitted[:2],
            world_lookup["thirdBase"],
            "l",
            tuple(base_a["centroidPixel"]),
            face_size,
        ),
        implied_camera_height(
            fitted[:2],
            world_lookup["secondBase"],
            "l",
            tuple(base_b["centroidPixel"]),
            face_size,
        ),
        implied_camera_height(
            fitted[:2],
            home_world,
            "b",
            tuple(home["intersectionPixel"]),
            face_size,
        ),
    ]
    camera_height = float(np.median(ground_height_controls))
    first_pixel_y = predicted_vertical_pixel(
        camera_height, fitted[:2], first_world, first_angle, first_face, face_size
    )
    first_observed_x, first_observed_y = [float(value) for value in first["centerPixel"]]
    first_radial_residual = math.hypot(
        first_pixel_x - first_observed_x,
        first_pixel_y - first_observed_y,
    ) if first_face == "b" else None

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "bearingPosePath": str(args.bearing_pose),
            "bearingPoseSha256": hashlib.sha256(bearing_bytes).hexdigest(),
            "bearingPoseArtifactVersion": bearing["artifactVersion"],
            "adjacentControlsPath": str(args.adjacent_controls),
            "adjacentControlsSha256": hashlib.sha256(adjacent_bytes).hexdigest(),
            "adjacentControlsArtifactVersion": adjacent["artifactVersion"],
        },
        "fitPartition": {
            "trainingControls": ["moundCenter", "thirdBase", "secondBase", "homePlate"],
            "firstBaseUsedByOptimizer": False,
            "verticalPixelsUsedByOptimizer": False,
        },
        "selectedPose": {
            "cameraProjectedFeet": fitted[:2].tolist(),
            "providerToProjectedYawDegrees": math.degrees(float(fitted[2])) % 360.0,
            "cameraHeightAbovePlayingSurfaceFeetCandidate": camera_height,
        },
        "trainingFit": fit_records,
        "leaveOneOutBearingHoldouts": leave_one_out,
        "groundPlaneDiagnostic": {
            "impliedCameraHeightsFeet": ground_height_controls,
            "spreadFeet": max(ground_height_controls) - min(ground_height_controls),
        },
        "firstBasePrefitHoldout": {
            "observedFace": "b",
            "observedPixel": [first_observed_x, first_observed_y],
            "uncertaintyPixels95": first["centerUncertaintyPixels95"],
            "predictedFace": first_face,
            "predictedPixel": [first_pixel_x, first_pixel_y],
            "radialResidualPixels": first_radial_residual,
            "passes": (
                first_radial_residual is not None
                and first_radial_residual <= float(first["centerUncertaintyPixels95"])
            ),
        },
    }
    first_pass = stable["firstBasePrefitHoldout"]["passes"]
    loo_complete = all(item["pixelResidual"] is not None for item in leave_one_out)
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-cross-face-regulation-field-pose-audit",
        "artifactStage": "cross-face-pose-fitted-first-base-prefit-holdout",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesCandidateCrossFacePose": True,
            "establishesReleaseCameraPose": False,
            "firstBasePrefitHoldoutPassed": first_pass,
            "leaveOneOutPredictionsAllOnObservedFaces": loo_complete,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if first_pass else ["FIRST_BASE_PREFIT_HOLDOUT_FAILED"]),
                "CAMERA_HORIZONTAL_UNCERTAINTY_NOT_YET_PROPAGATED",
                "CUBEMAP_LEVELING_UNCERTAINTY_NOT_ESTABLISHED",
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
        "selectedPose": artifact["selectedPose"],
        "trainingFit": fit_records,
        "leaveOneOut": leave_one_out,
        "firstBasePrefitHoldout": artifact["firstBasePrefitHoldout"],
    }, indent=2))


if __name__ == "__main__":
    main()

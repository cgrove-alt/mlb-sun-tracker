#!/usr/bin/env python3
"""Propagate field-control and pixel uncertainty into the Section 207 pose."""

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
    point_bearing_residuals,
)


ANALYSIS_VERSION = "rockies-panorama-regulation-field-pose-uncertainty-v1"
RADIAL_NORMAL_95_TO_SIGMA = 2.4477468306808166


def percentile_95(values: np.ndarray) -> float:
    return float(np.percentile(values, 95.0, method="linear"))


def sampled_pose(
    initial: np.ndarray,
    observations: np.ndarray,
    sigmas: np.ndarray,
    world_points: np.ndarray,
) -> np.ndarray:
    fitted = least_squares(
        point_bearing_residuals,
        initial,
        args=(observations, sigmas, world_points),
        max_nfev=500,
        xtol=1e-11,
        ftol=1e-11,
        gtol=1e-11,
    )
    if not fitted.success and np.max(np.abs(fitted.fun)) > 1e-4:
        raise ValueError("Monte Carlo pose fit did not converge")
    return fitted.x


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pose_audit", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--samples", type=int, default=2000)
    parser.add_argument("--seed", type=int, default=20260811)
    args = parser.parse_args()
    if args.samples < 1000:
        raise ValueError("At least 1000 Monte Carlo samples are required")

    pose_bytes = args.pose_audit.read_bytes()
    pose = json.loads(pose_bytes)
    if pose.get("analysisVersion") != "rockies-panorama-regulation-field-bearing-pose-v2":
        raise ValueError("Unsupported bearing-pose audit")
    adjudication = pose["complementaryPartition"]["adjudication"]
    if not adjudication.get("identitySelected"):
        raise ValueError("Bearing-pose audit did not select a unique base identity")
    selected = adjudication["bestPlausibleCandidate"]
    if (
        selected["candidateAWorldIdentity"] != "thirdBase"
        or selected["candidateBWorldIdentity"] != "secondBase"
    ):
        raise ValueError("Selected base identity is not the reviewed third/second ordering")

    extraction_path = Path(pose["inputs"]["extractionPath"])
    extraction_bytes = extraction_path.read_bytes()
    if hashlib.sha256(extraction_bytes).hexdigest() != pose["inputs"]["extractionSha256"]:
        raise ValueError("Extraction checksum differs from pose audit")
    extraction = json.loads(extraction_bytes)
    registration_path = Path(
        extraction["inputs"]["ngsCorrectedFieldRegistration"]["path"]
    )
    registration_bytes = registration_path.read_bytes()
    if (
        hashlib.sha256(registration_bytes).hexdigest()
        != extraction["inputs"]["ngsCorrectedFieldRegistration"]["sha256"]
    ):
        raise ValueError("Field registration checksum differs")
    registration = json.loads(registration_bytes)
    world_uncertainty_95 = float(
        registration["diagnostics"][
            "orthophotoGroundFrameHorizontalUncertainty95Feet"
        ]
    )

    face = extraction["face"]
    face_size = 2048
    mound = extraction["mound"]["selected"]
    base_a = extraction["baseCandidates"][0]["selected"]
    base_b = extraction["baseCandidates"][1]["selected"]
    nominal_pixels = np.asarray(
        [
            mound["leftTangentPixelX"],
            mound["rightTangentPixelX"],
            base_a["centroidPixel"][0],
            base_b["centroidPixel"][0],
        ],
        dtype=np.float64,
    )
    pixel_uncertainties_95 = np.asarray(
        [
            mound["leftTangentUncertaintyPixels95"],
            mound["rightTangentUncertaintyPixels95"],
            base_a["centroidUncertaintyPixels95"],
            base_b["centroidUncertaintyPixels95"],
        ],
        dtype=np.float64,
    )
    pixel_sigmas = pixel_uncertainties_95 / 1.96

    world_lookup = {
        key: np.asarray(value, dtype=np.float64)
        for key, value in pose["worldControlsProjectedFeet"].items()
    }
    nominal_worlds = np.vstack(
        (world_lookup["moundCenter"], world_lookup["thirdBase"], world_lookup["secondBase"])
    )
    nominal_camera = np.asarray(selected["cameraProjectedFeet"], dtype=np.float64)
    nominal_yaw = math.radians(float(selected["providerToProjectedYawDegrees"]))
    nominal_parameters = np.asarray(
        [nominal_camera[0], nominal_camera[1], nominal_yaw], dtype=np.float64
    )

    rng = np.random.default_rng(args.seed)
    world_sigma = world_uncertainty_95 / RADIAL_NORMAL_95_TO_SIGMA
    horizontal_errors = np.empty(args.samples, dtype=np.float64)
    orientation_errors = np.empty(args.samples, dtype=np.float64)
    fitted_parameters = np.empty((args.samples, 3), dtype=np.float64)
    unit_sigmas = np.ones(3, dtype=np.float64)
    for index in range(args.samples):
        pixels = nominal_pixels + rng.normal(0.0, pixel_sigmas)
        mound_left = face_pixel_to_provider_angle(face, float(pixels[0]), face_size)
        mound_right = face_pixel_to_provider_angle(face, float(pixels[1]), face_size)
        mound_center = math.atan2(
            math.sin(mound_left) + math.sin(mound_right),
            math.cos(mound_left) + math.cos(mound_right),
        )
        observations = np.asarray(
            [
                mound_center,
                face_pixel_to_provider_angle(face, float(pixels[2]), face_size),
                face_pixel_to_provider_angle(face, float(pixels[3]), face_size),
            ],
            dtype=np.float64,
        )
        worlds = nominal_worlds + rng.normal(
            0.0, world_sigma, size=nominal_worlds.shape
        )
        fitted = sampled_pose(nominal_parameters, observations, unit_sigmas, worlds)
        fitted_parameters[index] = fitted
        horizontal_errors[index] = float(np.linalg.norm(fitted[:2] - nominal_camera))
        orientation_errors[index] = math.degrees(abs(angle_delta(float(fitted[2]), nominal_yaw)))

    horizontal_95 = percentile_95(horizontal_errors)
    orientation_95 = percentile_95(orientation_errors)
    horizontal_gate = horizontal_95 <= 1.0
    orientation_gate = orientation_95 <= 1.0
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "poseAuditPath": str(args.pose_audit),
            "poseAuditSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "poseAuditArtifactVersion": pose["artifactVersion"],
            "extractionPath": str(extraction_path),
            "extractionSha256": hashlib.sha256(extraction_bytes).hexdigest(),
            "extractionArtifactVersion": extraction["artifactVersion"],
            "fieldRegistrationPath": str(registration_path),
            "fieldRegistrationSha256": hashlib.sha256(registration_bytes).hexdigest(),
            "fieldRegistrationArtifactVersion": registration["artifactVersion"],
        },
        "selectedPose": {
            "cameraProjectedFeet": nominal_camera.tolist(),
            "providerToProjectedYawDegrees": math.degrees(nominal_yaw) % 360.0,
            "candidateAWorldIdentity": "thirdBase",
            "candidateBWorldIdentity": "secondBase",
        },
        "uncertaintyInputs": {
            "pixelUncertainty95": {
                "moundLeftTangent": float(pixel_uncertainties_95[0]),
                "moundRightTangent": float(pixel_uncertainties_95[1]),
                "thirdBaseCandidate": float(pixel_uncertainties_95[2]),
                "secondBaseCandidate": float(pixel_uncertainties_95[3]),
            },
            "independentWorldPointRadialUncertainty95Feet": world_uncertainty_95,
            "worldPointTreatment": "The full accepted ground-frame 95-percent uncertainty is applied independently to all three points. This is more conservative than the partly common NGS frame error.",
            "cubemapLevelingUncertaintyIncluded": False,
        },
        "monteCarlo": {
            "sampleCount": args.samples,
            "seed": args.seed,
            "radialNormal95ToSigma": RADIAL_NORMAL_95_TO_SIGMA,
            "horizontalPositionUncertainty95Feet": horizontal_95,
            "orientationUncertainty95Degrees": orientation_95,
            "maximumHorizontalPositionErrorFeet": float(np.max(horizontal_errors)),
            "maximumOrientationErrorDegrees": float(np.max(orientation_errors)),
            "fittedCameraCoordinatePercentilesFeet": {
                "x025": float(np.percentile(fitted_parameters[:, 0], 2.5)),
                "x975": float(np.percentile(fitted_parameters[:, 0], 97.5)),
                "y025": float(np.percentile(fitted_parameters[:, 1], 2.5)),
                "y975": float(np.percentile(fitted_parameters[:, 1], 97.5)),
            },
        },
        "releaseGates": {
            "maximumHorizontalUncertaintyFeet": 1.0,
            "maximumOrientationUncertaintyDegrees": 1.0,
            "horizontalGatePassedBeforeCubemapLeveling": horizontal_gate,
            "orientationGatePassedBeforeCubemapLeveling": orientation_gate,
            "cubemapLevelingGatePassed": False,
        },
    }
    blockers = []
    if not horizontal_gate:
        blockers.append("CAMERA_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if not orientation_gate:
        blockers.append("CAMERA_ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")
    blockers.extend(
        [
            "CUBEMAP_LEVELING_UNCERTAINTY_NOT_ESTABLISHED",
            "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ]
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-regulation-field-pose-uncertainty-audit",
        "artifactStage": "input-uncertainty-propagated-cubemap-leveling-pending",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesReleaseCameraPose": False,
            "note": "This audit propagates locked pixel and accepted ground-frame uncertainty. A separate checksum-locked cubemap leveling bound is still required before pose release.",
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "horizontalPositionUncertainty95Feet": horizontal_95,
        "orientationUncertainty95Degrees": orientation_95,
        "blockers": blockers,
    }, indent=2))


if __name__ == "__main__":
    main()

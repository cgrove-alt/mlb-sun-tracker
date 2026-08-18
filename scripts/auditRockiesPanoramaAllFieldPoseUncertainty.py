#!/usr/bin/env python3
"""Propagate locked input uncertainty through the all-field Section 207 pose."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from fitRockiesPanoramaAllFieldPose import all_field_residuals
from fitRockiesPanoramaFullOrientationFieldPose import (
    cubemap_ray,
    rotation_diagnostics,
)
from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-all-regulation-field-pose-uncertainty-v1"
RADIAL_NORMAL_95_TO_SIGMA = 2.4477468306808166
SCALAR_NORMAL_95_TO_SIGMA = 1.959963984540054


def percentile_95(values: np.ndarray) -> float:
    return float(np.percentile(values, 95.0, method="linear"))


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
    if pose.get("analysisVersion") != "rockies-panorama-all-regulation-field-pose-v1":
        raise ValueError("Unsupported all-field pose")
    if not pose["geometryBoundary"].get("establishesCandidateAllFieldPose"):
        raise ValueError("All-field pose did not pass its candidate gates")

    full_path = Path(pose["inputs"]["fullOrientationPosePath"])
    full_bytes = full_path.read_bytes()
    if hashlib.sha256(full_bytes).hexdigest() != pose["inputs"]["fullOrientationPoseSha256"]:
        raise ValueError("Full-orientation pose checksum differs")
    full = json.loads(full_bytes)
    cross_path = Path(full["inputs"]["crossFacePosePath"])
    cross_bytes = cross_path.read_bytes()
    if hashlib.sha256(cross_bytes).hexdigest() != full["inputs"]["crossFacePoseSha256"]:
        raise ValueError("Cross-face pose checksum differs")
    cross = json.loads(cross_bytes)
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
        raise ValueError("Left controls checksum differs")
    left = json.loads(left_bytes)
    registration_path = Path(left["inputs"]["ngsCorrectedFieldRegistration"]["path"])
    registration_bytes = registration_path.read_bytes()
    if hashlib.sha256(registration_bytes).hexdigest() != left["inputs"]["ngsCorrectedFieldRegistration"]["sha256"]:
        raise ValueError("Field registration checksum differs")
    registration = json.loads(registration_bytes)

    size = 2048
    base_a = left["baseCandidates"][0]["selected"]
    base_b = left["baseCandidates"][1]["selected"]
    home = adjacent["homePlate"]["selected"]
    first = adjacent["firstBaseCandidate"]["selected"]
    controls = [
        ("l", np.asarray(base_a["centroidPixel"], dtype=np.float64), float(base_a["centroidUncertaintyPixels95"]), "thirdBase"),
        ("l", np.asarray(base_b["centroidPixel"], dtype=np.float64), float(base_b["centroidUncertaintyPixels95"]), "secondBase"),
        ("b", np.asarray(home["intersectionPixel"], dtype=np.float64), float(home["intersectionUncertaintyPixels95"]), "homePlate"),
        ("b", np.asarray(first["centerPixel"], dtype=np.float64), float(first["centerUncertaintyPixels95"]), "firstBase"),
    ]
    world_lookup = {
        key: np.asarray(value, dtype=np.float64)
        for key, value in bearing["worldControlsProjectedFeet"].items()
    }
    world_lookup["homePlate"] = np.asarray(
        registration["transform"]["homePlateProjectedFeet"], dtype=np.float64
    )
    nominal_worlds = np.asarray(
        [[*world_lookup[identifier], 0.0] for _, _, _, identifier in controls],
        dtype=np.float64,
    )
    nominal_pixels = np.vstack([pixel for _, pixel, _, _ in controls])
    pixel_uncertainties_95 = np.asarray(
        [uncertainty for _, _, uncertainty, _ in controls], dtype=np.float64
    )
    pixel_sigmas = pixel_uncertainties_95 / RADIAL_NORMAL_95_TO_SIGMA
    angular_sigmas = pixel_sigmas / (size / 2.0)

    mound = left["mound"]["selected"]
    nominal_tangents = np.asarray(
        [mound["leftTangentPixelX"], mound["rightTangentPixelX"]],
        dtype=np.float64,
    )
    tangent_uncertainties_95 = np.asarray(
        [
            mound["leftTangentUncertaintyPixels95"],
            mound["rightTangentUncertaintyPixels95"],
        ],
        dtype=np.float64,
    )
    tangent_sigmas = tangent_uncertainties_95 / SCALAR_NORMAL_95_TO_SIGMA
    nominal_mound_center = np.asarray(world_lookup["moundCenter"], dtype=np.float64)
    nominal_mound_radius = float(left["regulationGeometryFeet"]["moundDiameter"]) / 2.0

    world_uncertainty_95 = float(
        registration["diagnostics"]["orthophotoGroundFrameHorizontalUncertainty95Feet"]
    )
    world_sigma = world_uncertainty_95 / RADIAL_NORMAL_95_TO_SIGMA

    selected = pose["selectedPose"]
    nominal_camera = np.asarray(selected["cameraProjectedFeet"], dtype=np.float64)
    nominal_rotation = Rotation.from_matrix(
        np.asarray(selected["rotationMatrixProviderToWorld"], dtype=np.float64)
    )
    nominal_parameters = np.concatenate((nominal_camera, nominal_rotation.as_rotvec()))
    nominal_yaw = float(
        rotation_diagnostics(nominal_rotation.as_matrix())["providerXProjectedYawDegrees"]
    )

    rng = np.random.default_rng(args.seed)
    horizontal_errors = np.empty(args.samples, dtype=np.float64)
    vertical_errors = np.empty(args.samples, dtype=np.float64)
    orientation_errors = np.empty(args.samples, dtype=np.float64)
    yaw_errors = np.empty(args.samples, dtype=np.float64)
    fitted_cameras = np.empty((args.samples, 3), dtype=np.float64)
    for index in range(args.samples):
        sampled_pixels = nominal_pixels + rng.normal(
            0.0, pixel_sigmas[:, None], size=nominal_pixels.shape
        )
        sampled_rays = np.asarray(
            [
                cubemap_ray(face, tuple(pixel), size)
                for (face, _, _, _), pixel in zip(controls, sampled_pixels)
            ],
            dtype=np.float64,
        )
        sampled_worlds = nominal_worlds.copy()
        sampled_worlds[:, :2] += rng.normal(
            0.0, world_sigma, size=(len(sampled_worlds), 2)
        )
        sampled_mound_center = nominal_mound_center + rng.normal(
            0.0, world_sigma, size=2
        )
        sampled_tangents = nominal_tangents + rng.normal(0.0, tangent_sigmas)
        fitted = least_squares(
            all_field_residuals,
            nominal_parameters,
            args=(
                sampled_worlds,
                sampled_rays,
                angular_sigmas,
                sampled_mound_center,
                nominal_mound_radius,
                sampled_tangents,
                tangent_sigmas,
                "l",
                size,
            ),
            max_nfev=2000,
            xtol=1e-10,
            ftol=1e-10,
            gtol=1e-10,
        )
        if not np.all(np.isfinite(fitted.x)) or not np.all(np.isfinite(fitted.fun)):
            raise ValueError("Monte Carlo all-field fit produced non-finite values")
        if not fitted.success and np.max(np.abs(fitted.fun)) > 10.0:
            raise ValueError("Monte Carlo all-field fit did not converge")
        camera = fitted.x[:3]
        rotation = Rotation.from_rotvec(fitted.x[3:])
        fitted_cameras[index] = camera
        horizontal_errors[index] = float(np.linalg.norm(camera[:2] - nominal_camera[:2]))
        vertical_errors[index] = abs(float(camera[2] - nominal_camera[2]))
        orientation_errors[index] = math.degrees(
            (rotation * nominal_rotation.inv()).magnitude()
        )
        sample_yaw = float(
            rotation_diagnostics(rotation.as_matrix())["providerXProjectedYawDegrees"]
        )
        yaw_errors[index] = abs((sample_yaw - nominal_yaw + 180.0) % 360.0 - 180.0)

    horizontal_95 = percentile_95(horizontal_errors)
    vertical_95 = percentile_95(vertical_errors)
    orientation_95 = percentile_95(orientation_errors)
    yaw_95 = percentile_95(yaw_errors)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "poseAuditPath": str(args.pose_audit),
            "poseAuditSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "poseAuditArtifactVersion": pose["artifactVersion"],
            "fieldRegistrationArtifactVersion": registration["artifactVersion"],
        },
        "selectedPose": {
            "cameraProjectedFeet": nominal_camera.tolist(),
            "rotationMatrixProviderToWorld": nominal_rotation.as_matrix().tolist(),
            "rotationDiagnostics": rotation_diagnostics(nominal_rotation.as_matrix()),
        },
        "uncertaintyInputs": {
            "pointPixelRadialUncertainties95": {
                identifier: float(uncertainty)
                for _, _, uncertainty, identifier in controls
            },
            "moundTangentScalarUncertaintiesPixels95": tangent_uncertainties_95.tolist(),
            "independentWorldPointRadialUncertainty95Feet": world_uncertainty_95,
            "moundCenterRadialUncertainty95Feet": world_uncertainty_95,
            "nominalMoundDiameterFeet": nominal_mound_radius * 2.0,
            "actualMoundDiameterUncertaintyIncluded": False,
            "fieldControlVerticalUncertaintyIncluded": False,
            "worldPointTreatment": "The full accepted horizontal ground-frame uncertainty is independently applied to each point and the mound center, which is more conservative than its partly common NGS component.",
        },
        "monteCarlo": {
            "sampleCount": args.samples,
            "seed": args.seed,
            "radialNormal95ToSigma": RADIAL_NORMAL_95_TO_SIGMA,
            "scalarNormal95ToSigma": SCALAR_NORMAL_95_TO_SIGMA,
            "horizontalPositionUncertainty95FeetBeforeMoundSurvey": horizontal_95,
            "verticalPositionUncertainty95FeetBeforeFieldGradeAndMoundSurvey": vertical_95,
            "fullOrientationUncertainty95DegreesBeforeFieldGradeAndMoundSurvey": orientation_95,
            "providerXProjectedYawUncertainty95DegreesBeforeMoundSurvey": yaw_95,
            "maximumHorizontalPositionErrorFeet": float(np.max(horizontal_errors)),
            "maximumVerticalPositionErrorFeet": float(np.max(vertical_errors)),
            "maximumFullOrientationErrorDegrees": float(np.max(orientation_errors)),
            "cameraCoordinatePercentilesFeet": {
                "x025": float(np.percentile(fitted_cameras[:, 0], 2.5)),
                "x975": float(np.percentile(fitted_cameras[:, 0], 97.5)),
                "y025": float(np.percentile(fitted_cameras[:, 1], 2.5)),
                "y975": float(np.percentile(fitted_cameras[:, 1], 97.5)),
                "z025": float(np.percentile(fitted_cameras[:, 2], 2.5)),
                "z975": float(np.percentile(fitted_cameras[:, 2], 97.5)),
            },
        },
        "releaseGates": {
            "maximumHorizontalUncertaintyFeet": 1.0,
            "maximumVerticalUncertaintyFeet": 1.0,
            "maximumOrientationUncertaintyDegrees": 1.0,
            "horizontalGatePassedBeforeMoundSurvey": horizontal_95 <= 1.0,
            "verticalGatePassedBeforeFieldGradeAndMoundSurvey": vertical_95 <= 1.0,
            "orientationGatePassedBeforeFieldGradeAndMoundSurvey": orientation_95 <= 1.0,
            "actualMoundDiameterGatePassed": False,
            "fieldGradeVerticalGatePassed": False,
        },
    }
    blockers = []
    if horizontal_95 > 1.0:
        blockers.append("CAMERA_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if vertical_95 > 1.0:
        blockers.append("CAMERA_VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if orientation_95 > 1.0:
        blockers.append("CAMERA_ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")
    blockers.extend(
        [
            "ACTUAL_MOUND_DIAMETER_NOT_SURVEYED",
            "FIELD_CONTROL_VERTICAL_GRADE_NOT_MEASURED",
            "INDEPENDENT_OUTFIELD_WALL_HOLDOUT_NOT_PASSED",
            "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ]
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-all-regulation-field-pose-uncertainty-audit",
        "artifactStage": "all-field-input-uncertainty-propagated-survey-and-holdout-pending",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesReleaseCameraPose": False,
            "note": "Quantified image and horizontal ground-frame uncertainties are propagated. The actual mound diameter, vertical field grade, and untouched wall validation remain unresolved.",
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "horizontalPositionUncertainty95FeetBeforeMoundSurvey": horizontal_95,
                "verticalPositionUncertainty95FeetBeforeFieldGradeAndMoundSurvey": vertical_95,
                "fullOrientationUncertainty95DegreesBeforeFieldGradeAndMoundSurvey": orientation_95,
                "providerXProjectedYawUncertainty95DegreesBeforeMoundSurvey": yaw_95,
                "blockers": blockers,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

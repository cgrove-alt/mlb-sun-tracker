#!/usr/bin/env python3
"""Propagate quantified uncertainty through the graded Section 207 field pose."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from fitRockiesPanoramaAllFieldGradePose import graded_residuals
from fitRockiesPanoramaFullOrientationFieldPose import cubemap_ray, rotation_diagnostics
from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-all-regulation-field-grade-pose-uncertainty-v1"
RADIAL_NORMAL_95_TO_SIGMA = 2.4477468306808166
SCALAR_NORMAL_95_TO_SIGMA = 1.959963984540054


def fit_plane(xy: np.ndarray, z_values: np.ndarray) -> np.ndarray:
    centre = np.mean(xy, axis=0)
    matrix = np.column_stack((xy - centre, np.ones(len(xy))))
    local, _, _, _ = np.linalg.lstsq(matrix, z_values, rcond=None)
    return np.asarray(
        [local[0], local[1], local[2] - local[0] * centre[0] - local[1] * centre[1]],
        dtype=np.float64,
    )


def p95(values: np.ndarray) -> float:
    return float(np.percentile(values, 95.0, method="linear"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("grade_pose", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--samples", type=int, default=2000)
    parser.add_argument("--seed", type=int, default=20260811)
    args = parser.parse_args()
    if args.samples < 1000:
        raise ValueError("At least 1000 Monte Carlo samples are required")

    pose_bytes = args.grade_pose.read_bytes()
    pose = json.loads(pose_bytes)
    if pose.get("analysisVersion") != "rockies-panorama-all-regulation-field-grade-pose-v1":
        raise ValueError("Unsupported field-grade pose")
    if not pose["geometryBoundary"].get("establishesCandidateHistoricalFieldGradePose"):
        raise ValueError("Field-grade pose did not pass candidate gates")
    elevation_path = Path(pose["inputs"]["groundElevationsPath"])
    elevation_bytes = elevation_path.read_bytes()
    if hashlib.sha256(elevation_bytes).hexdigest() != pose["inputs"]["groundElevationsSha256"]:
        raise ValueError("Ground elevation checksum differs")
    elevations = json.loads(elevation_bytes)

    size = 2048
    controls = pose["pointControlFit"]
    nominal_worlds = np.asarray(
        [
            [
                *elevations["elevations"][item["controlId"]]["projectedStatePlaneFeet"],
                item["relativeElevationFeet"],
            ]
            for item in controls
        ],
        dtype=np.float64,
    )
    nominal_pixels = np.asarray([item["observedPixel"] for item in controls], dtype=np.float64)
    point_pixel_uncertainties_95 = np.asarray(
        [item["uncertaintyPixels95"] for item in controls], dtype=np.float64
    )
    point_pixel_sigmas = point_pixel_uncertainties_95 / RADIAL_NORMAL_95_TO_SIGMA
    angular_sigmas = point_pixel_sigmas / (size / 2.0)
    vertical_uncertainties_95 = np.asarray(
        [item["relativeElevationUncertainty95Feet"] for item in controls], dtype=np.float64
    )
    vertical_sigmas = vertical_uncertainties_95 / SCALAR_NORMAL_95_TO_SIGMA
    world_horizontal_uncertainty_95 = float(
        elevations["sourceQualification"]["orthophotoGroundFrameHorizontalUncertainty95Feet"]
    )
    world_horizontal_sigma = world_horizontal_uncertainty_95 / RADIAL_NORMAL_95_TO_SIGMA

    mound = pose["metricMoundCircle"]
    nominal_mound_center = np.asarray(mound["centerProjectedFeet"], dtype=np.float64)
    mound_radius = float(mound["nominalRadiusFeet"])
    tangent_fit = pose["moundTangentFit"]
    nominal_tangents = np.asarray(tangent_fit["observedPixelX"], dtype=np.float64)
    tangent_uncertainties_95 = np.asarray(
        tangent_fit["uncertaintyPixels95"], dtype=np.float64
    )
    tangent_sigmas = tangent_uncertainties_95 / SCALAR_NORMAL_95_TO_SIGMA

    selected = pose["selectedPose"]
    nominal_camera = np.asarray(selected["cameraProjectedFeet"], dtype=np.float64)
    nominal_rotation = Rotation.from_matrix(
        np.asarray(selected["rotationMatrixProviderToWorld"], dtype=np.float64)
    )
    nominal_parameters = np.concatenate((nominal_camera, nominal_rotation.as_rotvec()))
    nominal_yaw = float(
        rotation_diagnostics(nominal_rotation.as_matrix())["providerXProjectedYawDegrees"]
    )
    faces = [item["observedFace"] for item in controls]

    rng = np.random.default_rng(args.seed)
    horizontal_errors = np.empty(args.samples, dtype=np.float64)
    vertical_errors = np.empty(args.samples, dtype=np.float64)
    orientation_errors = np.empty(args.samples, dtype=np.float64)
    yaw_errors = np.empty(args.samples, dtype=np.float64)
    fitted_cameras = np.empty((args.samples, 3), dtype=np.float64)
    for index in range(args.samples):
        sampled_pixels = nominal_pixels + rng.normal(
            0.0, point_pixel_sigmas[:, None], size=nominal_pixels.shape
        )
        sampled_rays = np.asarray(
            [
                cubemap_ray(face, tuple(pixel), size)
                for face, pixel in zip(faces, sampled_pixels)
            ],
            dtype=np.float64,
        )
        sampled_worlds = nominal_worlds.copy()
        sampled_worlds[:, :2] += rng.normal(
            0.0, world_horizontal_sigma, size=(len(sampled_worlds), 2)
        )
        sampled_worlds[:, 2] += rng.normal(0.0, vertical_sigmas)
        sampled_plane = fit_plane(sampled_worlds[:, :2], sampled_worlds[:, 2])
        sampled_mound_center = nominal_mound_center + rng.normal(
            0.0, world_horizontal_sigma, size=2
        )
        sampled_tangents = nominal_tangents + rng.normal(0.0, tangent_sigmas)
        fitted = least_squares(
            graded_residuals,
            nominal_parameters,
            args=(
                sampled_worlds,
                sampled_rays,
                angular_sigmas,
                sampled_mound_center,
                mound_radius,
                sampled_plane,
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
            raise ValueError("Monte Carlo field-grade fit produced non-finite values")
        if not fitted.success and np.max(np.abs(fitted.fun)) > 10.0:
            raise ValueError("Monte Carlo field-grade fit did not converge")
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

    horizontal_95 = p95(horizontal_errors)
    vertical_95 = p95(vertical_errors)
    orientation_95 = p95(orientation_errors)
    yaw_95 = p95(yaw_errors)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "gradePosePath": str(args.grade_pose),
            "gradePoseSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "gradePoseArtifactVersion": pose["artifactVersion"],
            "groundElevationsArtifactVersion": elevations["artifactVersion"],
        },
        "selectedPose": selected,
        "uncertaintyInputs": {
            "pointPixelRadialUncertainties95": {
                item["controlId"]: item["uncertaintyPixels95"] for item in controls
            },
            "relativeElevationScalarUncertainties95Feet": {
                item["controlId"]: item["relativeElevationUncertainty95Feet"]
                for item in controls
            },
            "moundTangentScalarUncertaintiesPixels95": tangent_uncertainties_95.tolist(),
            "independentWorldPointRadialUncertainty95Feet": world_horizontal_uncertainty_95,
            "actualMoundDiameterUncertaintyIncluded": False,
            "currentFieldGradeUncertaintyIncluded": False,
        },
        "monteCarlo": {
            "sampleCount": args.samples,
            "seed": args.seed,
            "horizontalPositionUncertainty95FeetBeforeMoundSurveyAndCurrentness": horizontal_95,
            "verticalPositionUncertainty95FeetBeforeMoundSurveyAndCurrentness": vertical_95,
            "fullOrientationUncertainty95DegreesBeforeMoundSurveyAndCurrentness": orientation_95,
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
            "horizontalGatePassedBeforeMoundSurveyAndCurrentness": horizontal_95 <= 1.0,
            "verticalGatePassedBeforeMoundSurveyAndCurrentness": vertical_95 <= 1.0,
            "orientationGatePassedBeforeMoundSurveyAndCurrentness": orientation_95 <= 1.0,
            "actualMoundDiameterGatePassed": False,
            "currentFieldGradeGatePassed": False,
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
            "CURRENT_FIELD_GRADE_NOT_CONFIRMED",
            "INDEPENDENT_OUTFIELD_GROUND_HOLDOUT_NOT_PASSED",
            "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ]
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-all-regulation-field-grade-pose-uncertainty-audit",
        "artifactStage": "historical-grade-input-uncertainty-propagated-currentness-and-holdout-pending",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesReleaseCameraPose": False,
            "note": "Quantified image, horizontal ground-frame, and 2020 relative-elevation uncertainties are propagated. Mound survey, currentness, and a valid disjoint holdout remain unresolved.",
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "horizontalPositionUncertainty95Feet": horizontal_95,
                "verticalPositionUncertainty95Feet": vertical_95,
                "fullOrientationUncertainty95Degrees": orientation_95,
                "providerXProjectedYawUncertainty95Degrees": yaw_95,
                "blockers": blockers,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

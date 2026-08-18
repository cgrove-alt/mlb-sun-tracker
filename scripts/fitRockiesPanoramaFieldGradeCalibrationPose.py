#!/usr/bin/env python3
"""Add the calibration-only left-field ground control to the graded pose."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from fitRockiesPanoramaAllFieldGradePose import (
    graded_residuals,
    predicted_graded_circle_tangent_pixels,
)
from fitRockiesPanoramaFullOrientationFieldPose import (
    cubemap_ray,
    provider_ray_to_pixel,
    rotation_diagnostics,
)
from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-field-grade-left-field-calibration-pose-v1"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("grade_pose", type=Path)
    parser.add_argument("calibration_elevation", type=Path, nargs="+")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    pose_bytes = args.grade_pose.read_bytes()
    pose = json.loads(pose_bytes)
    if pose.get("analysisVersion") != "rockies-panorama-all-regulation-field-grade-pose-v1":
        raise ValueError("Unsupported field-grade pose")
    if not pose["geometryBoundary"].get("establishesCandidateHistoricalFieldGradePose"):
        raise ValueError("Field-grade pose did not pass candidate gates")
    elevation_path = Path(pose["inputs"]["groundElevationsPath"])
    elevation_bytes = elevation_path.read_bytes()
    if hashlib.sha256(elevation_bytes).hexdigest() != pose["inputs"]["groundElevationsSha256"]:
        raise ValueError("Field elevation checksum differs")
    elevations = json.loads(elevation_bytes)
    calibration_inputs = []
    for calibration_path in args.calibration_elevation:
        calibration_bytes = calibration_path.read_bytes()
        calibration = json.loads(calibration_bytes)
        if calibration.get("analysisVersion") != "rockies-ground-calibration-elevation-v1":
            raise ValueError("Unsupported calibration elevation")
        calibration_boundary = calibration["geometryBoundary"]
        if not calibration_boundary.get("establishesHistoricalCalibrationElevation"):
            raise ValueError("Calibration elevation did not pass")
        if calibration_boundary.get("establishesIndependentHoldout"):
            raise ValueError("Calibration feature must not be a holdout")
        extraction_path = Path(calibration["inputs"]["calibrationExtractionPath"])
        extraction_bytes = extraction_path.read_bytes()
        if hashlib.sha256(extraction_bytes).hexdigest() != calibration["inputs"]["calibrationExtractionSha256"]:
            raise ValueError("Calibration extraction checksum differs")
        extraction = json.loads(extraction_bytes)
        if not extraction["geometryBoundary"].get("establishesCalibrationObservation"):
            raise ValueError("Calibration extraction is not restricted to calibration")
        calibration_inputs.append(
            (calibration_path, calibration_bytes, calibration, extraction)
        )

    size = 2048
    original_controls = pose["pointControlFit"]
    controls = []
    worlds = []
    for item in original_controls:
        identifier = item["controlId"]
        controls.append(
            {
                "controlId": identifier,
                "role": "regulation-field-calibration",
                "observedFace": item["observedFace"],
                "observedPixel": item["observedPixel"],
                "pixelUncertainty95": item["uncertaintyPixels95"],
                "horizontalWorldUncertainty95Feet": float(
                    elevations["sourceQualification"]["orthophotoGroundFrameHorizontalUncertainty95Feet"]
                ),
                "relativeElevationUncertainty95Feet": item["relativeElevationUncertainty95Feet"],
            }
        )
        worlds.append(
            [
                *elevations["elevations"][identifier]["projectedStatePlaneFeet"],
                item["relativeElevationFeet"],
            ]
        )
    for _, _, calibration, extraction in calibration_inputs:
        calibration_observation = extraction["panoramaObservation"]
        calibration_ground = calibration["groundControl"]
        controls.append(
            {
                "controlId": calibration["feature"]["featureId"],
                "role": "calibration-only-semantic-recovery-never-holdout",
                "observedFace": calibration_observation["face"],
                "observedPixel": calibration_observation["selectedVertexPixel"],
                "pixelUncertainty95": calibration_observation["uncertainty"]["combinedRadialUncertaintyPixels95"],
                "horizontalWorldUncertainty95Feet": extraction["orthophotoObservation"]["absoluteGroundRadialUncertainty95Feet"],
                "relativeElevationUncertainty95Feet": calibration_ground["relativeToHomePlateUncertainty95Feet"],
            }
        )
        worlds.append(
            [
                *calibration_ground["projectedStatePlaneFeet"],
                calibration_ground["relativeToHomePlateFeet"],
            ]
        )
    world_points = np.asarray(worlds, dtype=np.float64)
    provider_rays = np.asarray(
        [
            cubemap_ray(item["observedFace"], tuple(item["observedPixel"]), size)
            for item in controls
        ],
        dtype=np.float64,
    )
    angular_sigmas = np.asarray(
        [item["pixelUncertainty95"] / 1.96 / (size / 2.0) for item in controls],
        dtype=np.float64,
    )
    mound = pose["metricMoundCircle"]
    mound_center = np.asarray(mound["centerProjectedFeet"], dtype=np.float64)
    mound_radius = float(mound["nominalRadiusFeet"])
    field_plane = np.asarray(pose["fieldGrade"]["planeRelativeToHomeFeet"], dtype=np.float64)
    tangent_fit = pose["moundTangentFit"]
    observed_tangents = np.asarray(tangent_fit["observedPixelX"], dtype=np.float64)
    tangent_uncertainties = np.asarray(tangent_fit["uncertaintyPixels95"], dtype=np.float64)
    tangent_sigmas = tangent_uncertainties / 1.96
    selected = pose["selectedPose"]
    initial = np.concatenate(
        (
            np.asarray(selected["cameraProjectedFeet"], dtype=np.float64),
            Rotation.from_matrix(
                np.asarray(selected["rotationMatrixProviderToWorld"], dtype=np.float64)
            ).as_rotvec(),
        )
    )
    fitted = least_squares(
        graded_residuals,
        initial,
        args=(
            world_points,
            provider_rays,
            angular_sigmas,
            mound_center,
            mound_radius,
            field_plane,
            observed_tangents,
            tangent_sigmas,
            "l",
            size,
        ),
        max_nfev=50_000,
        xtol=1e-13,
        ftol=1e-13,
        gtol=1e-13,
    )
    if not np.all(np.isfinite(fitted.x)) or not np.all(np.isfinite(fitted.fun)):
        raise ValueError("Calibration pose produced non-finite values")
    rotation = Rotation.from_rotvec(fitted.x[3:]).as_matrix()
    fit_records = []
    for item, world in zip(controls, world_points):
        direction = world - fitted.x[:3]
        direction /= np.linalg.norm(direction)
        predicted_face, predicted_x, predicted_y = provider_ray_to_pixel(
            rotation.T @ direction, size
        )
        residual = (
            math.hypot(
                predicted_x - item["observedPixel"][0],
                predicted_y - item["observedPixel"][1],
            )
            if predicted_face == item["observedFace"]
            else None
        )
        range_feet = float(np.linalg.norm(world - fitted.x[:3]))
        projected_world_uncertainty_pixels95 = math.atan2(
            item["horizontalWorldUncertainty95Feet"]
            + item["relativeElevationUncertainty95Feet"],
            range_feet,
        ) * (size / 2.0)
        combined_uncertainty_pixels95 = (
            item["pixelUncertainty95"] + projected_world_uncertainty_pixels95
        )
        fit_records.append(
            {
                **item,
                "worldProjectedFeet": world.tolist(),
                "predictedFace": predicted_face,
                "predictedPixel": [predicted_x, predicted_y],
                "radialResidualPixels": residual,
                "projectedWorldAndElevationUncertaintyPixels95": projected_world_uncertainty_pixels95,
                "combinedConservativeRadialUncertaintyPixels95": combined_uncertainty_pixels95,
                "withinImageOnlyPixelUncertainty": (
                    residual is not None and residual <= item["pixelUncertainty95"]
                ),
                "withinCombinedInputUncertainty": (
                    residual is not None and residual <= combined_uncertainty_pixels95
                ),
            }
        )
    fitted_tangents = predicted_graded_circle_tangent_pixels(
        fitted.x, mound_center, mound_radius, field_plane, "l", size
    )
    if fitted_tangents is None:
        raise ValueError("Calibration pose does not project mound tangencies")
    tangent_residuals = np.abs(np.asarray(fitted_tangents) - observed_tangents)
    point_image_only_pass = all(
        item["withinImageOnlyPixelUncertainty"] for item in fit_records
    )
    point_combined_pass = all(
        item["withinCombinedInputUncertainty"] for item in fit_records
    )
    tangent_pass = bool(np.all(tangent_residuals <= tangent_uncertainties))
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "gradePosePath": str(args.grade_pose),
            "gradePoseSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "gradePoseArtifactVersion": pose["artifactVersion"],
            "calibrationElevations": [
                {
                    "path": str(path),
                    "sha256": hashlib.sha256(data).hexdigest(),
                    "artifactVersion": calibration["artifactVersion"],
                }
                for path, data, calibration, _ in calibration_inputs
            ],
        },
        "partitionIntegrity": {
            "leftFieldFeatureCalibrationOnly": True,
            "leftFieldFeatureEligibleForFutureHoldout": False,
            "newIndependentHoldoutStillRequired": True,
        },
        "fieldGrade": pose["fieldGrade"],
        "metricMoundCircle": pose["metricMoundCircle"],
        "selectedPose": {
            "cameraProjectedFeet": fitted.x[:3].tolist(),
            "rotationMatrixProviderToWorld": rotation.tolist(),
            "rotationDiagnostics": rotation_diagnostics(rotation),
            "weightedSquaredError": float(np.sum(fitted.fun**2)),
        },
        "pointControlFit": fit_records,
        "moundTangentFit": {
            "observedPixelX": observed_tangents.tolist(),
            "uncertaintyPixels95": tangent_uncertainties.tolist(),
            "predictedPixelX": list(fitted_tangents),
            "residualPixels": tangent_residuals.tolist(),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-field-grade-left-field-calibration-pose-audit",
        "artifactStage": "far-field-calibration-added-new-independent-holdout-pending",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesCandidateHistoricalFieldGradeCalibrationPose": point_combined_pass and tangent_pass,
            "establishesReleaseCameraPose": False,
            "allPointControlsWithinImageOnlyUncertainty": point_image_only_pass,
            "allPointControlsWithinCombinedInputUncertainty": point_combined_pass,
            "moundTangenciesWithinLockedUncertainty": tangent_pass,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if point_combined_pass else ["POINT_CONTROL_FIT_EXCEEDS_COMBINED_INPUT_UNCERTAINTY"]),
                *([] if point_image_only_pass else ["POINT_CONTROL_FIT_EXCEEDS_IMAGE_ONLY_UNCERTAINTY"]),
                *([] if tangent_pass else ["MOUND_TANGENT_FIT_EXCEEDS_PIXEL_UNCERTAINTY"]),
                "POSE_UNCERTAINTY_NOT_PROPAGATED_AFTER_FAR_FIELD_CALIBRATION",
                "ACTUAL_MOUND_DIAMETER_NOT_SURVEYED",
                "CURRENT_FIELD_GRADE_NOT_CONFIRMED",
                "INDEPENDENT_OUTFIELD_GROUND_HOLDOUT_NOT_PASSED",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "selectedPose": artifact["selectedPose"],
                "pointControlFit": artifact["pointControlFit"],
                "moundTangentFit": artifact["moundTangentFit"],
                "geometryBoundary": artifact["geometryBoundary"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

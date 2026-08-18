#!/usr/bin/env python3
"""Refit the Section 207 all-field pose with measured relative field grade."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from fitRockiesPanoramaAllFieldPose import circle_tangent_world_points
from fitRockiesPanoramaFullOrientationFieldPose import (
    cubemap_ray,
    pose_residuals,
    provider_ray_to_pixel,
    rotation_diagnostics,
)
from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-all-regulation-field-grade-pose-v1"


def plane_z(plane: np.ndarray, xy: np.ndarray) -> float:
    return float(plane[0] * xy[0] + plane[1] * xy[1] + plane[2])


def predicted_graded_circle_tangent_pixels(
    parameters: np.ndarray,
    center_xy: np.ndarray,
    radius: float,
    plane: np.ndarray,
    face: str,
    size: int,
) -> tuple[float, float] | None:
    tangents = circle_tangent_world_points(parameters[:2], center_xy, radius)
    if tangents is None:
        return None
    camera = parameters[:3]
    rotation = Rotation.from_rotvec(parameters[3:]).as_matrix()
    pixels = []
    for tangent in tangents:
        world = np.asarray([tangent[0], tangent[1], plane_z(plane, tangent)])
        direction = world - camera
        direction /= np.linalg.norm(direction)
        provider = rotation.T @ direction
        projected_face, pixel_x, _ = provider_ray_to_pixel(provider, size)
        if projected_face != face:
            return None
        pixels.append(pixel_x)
    return min(pixels), max(pixels)


def graded_residuals(
    parameters: np.ndarray,
    world_points: np.ndarray,
    provider_rays: np.ndarray,
    angular_sigmas: np.ndarray,
    mound_center: np.ndarray,
    mound_radius: float,
    field_plane: np.ndarray,
    observed_tangents: np.ndarray,
    tangent_sigmas_pixels: np.ndarray,
    face: str,
    size: int,
) -> np.ndarray:
    point_values = pose_residuals(
        parameters, world_points, provider_rays, angular_sigmas
    )
    tangents = predicted_graded_circle_tangent_pixels(
        parameters, mound_center, mound_radius, field_plane, face, size
    )
    if tangents is None:
        tangent_values = np.full(2, 1e6)
    else:
        tangent_values = (
            np.asarray(tangents, dtype=np.float64) - observed_tangents
        ) / tangent_sigmas_pixels
    return np.concatenate((point_values, tangent_values))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("all_field_pose", type=Path)
    parser.add_argument("ground_elevations", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    pose_bytes = args.all_field_pose.read_bytes()
    pose = json.loads(pose_bytes)
    if pose.get("analysisVersion") != "rockies-panorama-all-regulation-field-pose-v1":
        raise ValueError("Unsupported all-field pose")
    if not pose["geometryBoundary"].get("establishesCandidateAllFieldPose"):
        raise ValueError("All-field pose did not pass candidate gates")
    elevation_bytes = args.ground_elevations.read_bytes()
    elevations = json.loads(elevation_bytes)
    if elevations.get("analysisVersion") != "rockies-regulation-field-ground-elevations-v1":
        raise ValueError("Unsupported ground elevations")
    if not elevations["geometryBoundary"].get("establishesHistoricalRelativeFieldElevations"):
        raise ValueError("Historical relative field elevations did not pass")
    if elevations["inputs"]["allFieldPoseSha256"] != hashlib.sha256(pose_bytes).hexdigest():
        raise ValueError("Ground elevation artifact binds a different all-field pose")

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
        [
            [
                *world_lookup[identifier],
                float(elevations["elevations"][identifier]["relativeToHomePlateFeet"]),
            ]
            for _, _, _, identifier in controls
        ],
        dtype=np.float64,
    )
    provider_rays = np.asarray(
        [cubemap_ray(face, pixel, size) for face, pixel, _, _ in controls],
        dtype=np.float64,
    )
    angular_sigmas = np.asarray(
        [uncertainty / 1.96 / (size / 2.0) for _, _, uncertainty, _ in controls],
        dtype=np.float64,
    )
    mound = left["mound"]["selected"]
    observed_tangents = np.asarray(
        [mound["leftTangentPixelX"], mound["rightTangentPixelX"]],
        dtype=np.float64,
    )
    tangent_sigmas = np.asarray(
        [
            mound["leftTangentUncertaintyPixels95"] / 1.96,
            mound["rightTangentUncertaintyPixels95"] / 1.96,
        ],
        dtype=np.float64,
    )
    mound_center = world_lookup["moundCenter"]
    mound_radius = float(left["regulationGeometryFeet"]["moundDiameter"]) / 2.0
    field_plane = np.asarray(
        elevations["fieldPlaneRelativeToHomeFeet"]["zEqualsAxPlusByPlusC"],
        dtype=np.float64,
    )
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
        raise ValueError("Field-grade pose produced non-finite values")
    rotation = Rotation.from_rotvec(fitted.x[3:]).as_matrix()
    control_records = []
    for (face, pixel, uncertainty, identifier), world in zip(controls, world_points):
        direction = world - fitted.x[:3]
        direction /= np.linalg.norm(direction)
        predicted_face, predicted_x, predicted_y = provider_ray_to_pixel(
            rotation.T @ direction, size
        )
        control_records.append(
            {
                "controlId": identifier,
                "relativeElevationFeet": float(world[2]),
                "relativeElevationUncertainty95Feet": float(
                    elevations["elevations"][identifier]["relativeToHomePlateUncertainty95Feet"]
                ),
                "observedFace": face,
                "observedPixel": list(pixel),
                "uncertaintyPixels95": uncertainty,
                "predictedFace": predicted_face,
                "predictedPixel": [predicted_x, predicted_y],
                "radialResidualPixels": (
                    math.hypot(predicted_x - pixel[0], predicted_y - pixel[1])
                    if predicted_face == face
                    else None
                ),
            }
        )
    fitted_tangents = predicted_graded_circle_tangent_pixels(
        fitted.x, mound_center, mound_radius, field_plane, "l", size
    )
    if fitted_tangents is None:
        raise ValueError("Field-grade pose does not project mound tangencies on the left face")
    tangent_residuals = np.abs(np.asarray(fitted_tangents) - observed_tangents)
    point_pass = all(
        item["radialResidualPixels"] is not None
        and item["radialResidualPixels"] <= item["uncertaintyPixels95"]
        for item in control_records
    )
    tangent_uncertainties = np.asarray(
        [mound["leftTangentUncertaintyPixels95"], mound["rightTangentUncertaintyPixels95"]],
        dtype=np.float64,
    )
    tangent_pass = bool(np.all(tangent_residuals <= tangent_uncertainties))
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "allFieldPosePath": str(args.all_field_pose),
            "allFieldPoseSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "allFieldPoseArtifactVersion": pose["artifactVersion"],
            "groundElevationsPath": str(args.ground_elevations),
            "groundElevationsSha256": hashlib.sha256(elevation_bytes).hexdigest(),
            "groundElevationsArtifactVersion": elevations["artifactVersion"],
        },
        "fitPartition": pose["fitPartition"],
        "fieldGrade": {
            "planeRelativeToHomeFeet": field_plane.tolist(),
            "sourceAcquisitionUtcRange": elevations["sourceQualification"]["stadiumUtcRangeAfter18SecondGpsOffset"],
            "currentFieldGradeConfirmed": False,
        },
        "metricMoundCircle": {
            "centerProjectedFeet": mound_center.tolist(),
            "nominalRadiusFeet": mound_radius,
            "actualDiameterSurveyed": False,
        },
        "selectedPose": {
            "cameraProjectedFeet": fitted.x[:3].tolist(),
            "rotationMatrixProviderToWorld": rotation.tolist(),
            "rotationDiagnostics": rotation_diagnostics(rotation),
            "weightedSquaredError": float(np.sum(fitted.fun**2)),
        },
        "pointControlFit": control_records,
        "moundTangentFit": {
            "observedPixelX": observed_tangents.tolist(),
            "uncertaintyPixels95": tangent_uncertainties.tolist(),
            "predictedPixelX": list(fitted_tangents),
            "residualPixels": tangent_residuals.tolist(),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-all-regulation-field-grade-pose-audit",
        "artifactStage": "historically-graded-field-pose-disjoint-holdout-pending",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesCandidateHistoricalFieldGradePose": point_pass and tangent_pass,
            "establishesReleaseCameraPose": False,
            "allPointControlsWithinLockedUncertainty": point_pass,
            "moundTangenciesWithinLockedUncertainty": tangent_pass,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if point_pass else ["POINT_CONTROL_FIT_EXCEEDS_PIXEL_UNCERTAINTY"]),
                *([] if tangent_pass else ["MOUND_TANGENT_FIT_EXCEEDS_PIXEL_UNCERTAINTY"]),
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

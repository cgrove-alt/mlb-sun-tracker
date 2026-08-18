#!/usr/bin/env python3
"""Fit Section 207 bearing-only camera poses from regulation field controls.

All ordered assignments of the two visible base candidates to first, second,
and third base are evaluated. Mound tangencies and candidate A form the
prefit training set. Candidate B is never used by the optimizer and is scored
as a prefit semantic and geometric holdout.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.optimize import least_squares


ANALYSIS_VERSION = "rockies-panorama-regulation-field-bearing-pose-v2"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def angle_delta(first: float, second: float) -> float:
    return (first - second + math.pi) % (2.0 * math.pi) - math.pi


def face_pixel_to_provider_angle(face: str, pixel_x: float, face_size: int) -> float:
    u = (float(pixel_x) - face_size / 2.0) / (face_size / 2.0)
    by_face = {
        "f": np.asarray([u, 1.0]),
        "r": np.asarray([1.0, -u]),
        "b": np.asarray([-u, -1.0]),
        "l": np.asarray([-1.0, u]),
    }
    if face not in by_face:
        raise ValueError("Bearing pose requires a horizontal cubemap face")
    ray = by_face[face]
    return math.atan2(float(ray[1]), float(ray[0]))


def provider_angle_to_face_pixel(angle: float, face_size: int) -> tuple[str, float]:
    x = math.cos(angle)
    y = math.sin(angle)
    if abs(x) >= abs(y):
        if x < 0:
            face = "l"
            u = y / -x
        else:
            face = "r"
            u = -y / x
    elif y >= 0:
        face = "f"
        u = x / y
    else:
        face = "b"
        u = -x / -y
    return face, (u + 1.0) * face_size / 2.0


def corrected_point(point: np.ndarray, registration: dict[str, Any]) -> np.ndarray:
    correction = registration["diagnostics"]["orthophotoGroundFrameCorrection"]
    rotation = np.asarray(correction["rotationMatrix"], dtype=np.float64)
    translation = np.asarray(correction["translationFeet"], dtype=np.float64)
    return point @ rotation.T + translation


def world_controls(
    field: dict[str, Any],
    registration: dict[str, Any],
    home_to_mound_feet: float,
) -> dict[str, np.ndarray]:
    transform = registration["transform"]
    home = np.asarray(transform["homePlateProjectedFeet"], dtype=np.float64)
    forward = np.asarray(transform["fieldAxisProjectedUnitVector"], dtype=np.float64)
    forward /= np.linalg.norm(forward)
    mound = home + home_to_mound_feet * forward
    first = corrected_point(
        np.asarray(field["controls"]["rightBaseCentroidProjectedFeet"], dtype=np.float64),
        registration,
    )
    third = corrected_point(
        np.asarray(field["controls"]["leftBaseCentroidProjectedFeet"], dtype=np.float64),
        registration,
    )
    second = np.asarray(transform["secondBaseProjectedFeet"], dtype=np.float64)
    return {
        "moundCenter": mound,
        "firstBase": first,
        "secondBase": second,
        "thirdBase": third,
    }


def predicted_angles(
    parameters: np.ndarray,
    mound_center: np.ndarray,
    mound_radius: float,
    training_base: np.ndarray,
) -> tuple[float, float, float] | None:
    camera = parameters[:2]
    yaw = float(parameters[2])
    mound_delta = mound_center - camera
    mound_distance = float(np.linalg.norm(mound_delta))
    if mound_distance <= mound_radius:
        return None
    center_angle = math.atan2(float(mound_delta[1]), float(mound_delta[0]))
    half_angle = math.asin(mound_radius / mound_distance)
    base_delta = training_base - camera
    if float(np.linalg.norm(base_delta)) <= 1e-9:
        return None
    base_angle = math.atan2(float(base_delta[1]), float(base_delta[0]))
    return center_angle + half_angle - yaw, center_angle - half_angle - yaw, base_angle - yaw


def residuals(
    parameters: np.ndarray,
    observations: np.ndarray,
    sigmas: np.ndarray,
    mound_center: np.ndarray,
    mound_radius: float,
    training_base: np.ndarray,
) -> np.ndarray:
    predicted = predicted_angles(parameters, mound_center, mound_radius, training_base)
    if predicted is None:
        return np.full(3, 1e6)
    return np.asarray(
        [angle_delta(value, observed) / sigma for value, observed, sigma in zip(predicted, observations, sigmas)],
        dtype=np.float64,
    )


def pixel_angle_uncertainty(face: str, pixel: float, uncertainty: float, size: int) -> float:
    low = face_pixel_to_provider_angle(face, pixel - uncertainty, size)
    high = face_pixel_to_provider_angle(face, pixel + uncertainty, size)
    return max(abs(angle_delta(low, face_pixel_to_provider_angle(face, pixel, size))), abs(angle_delta(high, face_pixel_to_provider_angle(face, pixel, size))))


def unique_solutions(solutions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    ordered = sorted(solutions, key=lambda item: item["trainingWeightedSquaredError"])
    unique: list[dict[str, Any]] = []
    for candidate in ordered:
        position = np.asarray(candidate["cameraProjectedFeet"])
        yaw = math.radians(candidate["providerToProjectedYawDegrees"])
        if any(
            np.linalg.norm(position - np.asarray(prior["cameraProjectedFeet"])) < 0.05
            and abs(angle_delta(yaw, math.radians(prior["providerToProjectedYawDegrees"]))) < math.radians(0.01)
            for prior in unique
        ):
            continue
        unique.append(candidate)
    return unique


def fit_assignment(
    observations: np.ndarray,
    sigmas: np.ndarray,
    mound_center: np.ndarray,
    mound_radius: float,
    training_base: np.ndarray,
    holdout_base: np.ndarray,
    holdout_observed_angle: float,
    holdout_pixel: float,
    face: str,
    face_size: int,
    section_envelope: dict[str, float],
) -> list[dict[str, Any]]:
    observed_half_angle = abs(angle_delta(observations[0], observations[1])) / 2.0
    estimated_distance = mound_radius / max(math.sin(observed_half_angle), 1e-9)
    solutions: list[dict[str, Any]] = []
    for bearing_degrees in np.linspace(0.0, 355.0, 72):
        bearing = math.radians(float(bearing_degrees))
        initial_camera = mound_center - estimated_distance * np.asarray(
            [math.cos(bearing), math.sin(bearing)], dtype=np.float64
        )
        center_world_angle = math.atan2(
            float(mound_center[1] - initial_camera[1]),
            float(mound_center[0] - initial_camera[0]),
        )
        observed_center_angle = observations[0] + angle_delta(observations[1], observations[0]) / 2.0
        initial_yaw = center_world_angle - observed_center_angle
        fitted = least_squares(
            residuals,
            np.asarray([initial_camera[0], initial_camera[1], initial_yaw]),
            args=(observations, sigmas, mound_center, mound_radius, training_base),
            max_nfev=10_000,
            xtol=1e-13,
            ftol=1e-13,
            gtol=1e-13,
        )
        values = predicted_angles(fitted.x, mound_center, mound_radius, training_base)
        if values is None:
            continue
        training_angle_residuals = [abs(angle_delta(value, observed)) for value, observed in zip(values, observations)]
        training_pixel_residuals = []
        for predicted, observed in zip(values, observations):
            predicted_face, predicted_pixel = provider_angle_to_face_pixel(predicted, face_size)
            observed_face, observed_pixel = provider_angle_to_face_pixel(observed, face_size)
            if predicted_face != face or observed_face != face:
                training_pixel_residuals.append(float("inf"))
            else:
                training_pixel_residuals.append(abs(predicted_pixel - observed_pixel))
        if not np.all(np.isfinite(training_pixel_residuals)):
            continue
        holdout_delta = holdout_base - fitted.x[:2]
        holdout_world_angle = math.atan2(float(holdout_delta[1]), float(holdout_delta[0]))
        predicted_holdout_angle = holdout_world_angle - float(fitted.x[2])
        predicted_face, predicted_holdout_pixel = provider_angle_to_face_pixel(
            predicted_holdout_angle, face_size
        )
        holdout_angle_residual = abs(angle_delta(predicted_holdout_angle, holdout_observed_angle))
        inside = (
            section_envelope["minimumX"] <= fitted.x[0] <= section_envelope["maximumX"]
            and section_envelope["minimumY"] <= fitted.x[1] <= section_envelope["maximumY"]
        )
        solutions.append({
            "cameraProjectedFeet": [float(fitted.x[0]), float(fitted.x[1])],
            "providerToProjectedYawDegrees": math.degrees(float(fitted.x[2])) % 360.0,
            "moundCenterDistanceFeet": float(np.linalg.norm(mound_center - fitted.x[:2])),
            "trainingWeightedSquaredError": float(np.sum(residuals(fitted.x, observations, sigmas, mound_center, mound_radius, training_base) ** 2)),
            "trainingAngularResidualDegrees": [math.degrees(value) for value in training_angle_residuals],
            "trainingPixelResiduals": training_pixel_residuals,
            "holdout": {
                "observedFace": face,
                "observedPixelX": holdout_pixel,
                "predictedFace": predicted_face,
                "predictedPixelX": predicted_holdout_pixel,
                "angularResidualDegrees": math.degrees(holdout_angle_residual),
                "pixelResidual": abs(predicted_holdout_pixel - holdout_pixel) if predicted_face == face else None,
            },
            "insidePaddedSection207PlanEnvelope": bool(inside),
        })
    return unique_solutions(solutions)


def point_bearing_residuals(
    parameters: np.ndarray,
    observations: np.ndarray,
    sigmas: np.ndarray,
    world_points: np.ndarray,
) -> np.ndarray:
    camera = parameters[:2]
    yaw = float(parameters[2])
    predicted = [
        math.atan2(float(point[1] - camera[1]), float(point[0] - camera[0])) - yaw
        for point in world_points
    ]
    return np.asarray(
        [angle_delta(value, observed) / sigma for value, observed, sigma in zip(predicted, observations, sigmas)],
        dtype=np.float64,
    )


def fit_point_bearing_assignment(
    observations: np.ndarray,
    sigmas: np.ndarray,
    world_points: np.ndarray,
    mound_center: np.ndarray,
    mound_radius: float,
    observed_mound_tangents: tuple[float, float],
    observed_mound_pixels: tuple[float, float],
    base_candidate_pixels: tuple[tuple[float, float], tuple[float, float]],
    face: str,
    face_size: int,
    section_envelope: dict[str, float],
) -> list[dict[str, Any]]:
    solutions: list[dict[str, Any]] = []
    center = np.mean(world_points, axis=0)
    for radius in (150.0, 250.0, 350.0, 450.0, 600.0):
        for bearing_degrees in np.linspace(0.0, 350.0, 36):
            bearing = math.radians(float(bearing_degrees))
            initial_camera = center + radius * np.asarray(
                [math.cos(bearing), math.sin(bearing)], dtype=np.float64
            )
            first_delta = world_points[0] - initial_camera
            initial_yaw = math.atan2(float(first_delta[1]), float(first_delta[0])) - observations[0]
            fitted = least_squares(
                point_bearing_residuals,
                np.asarray([initial_camera[0], initial_camera[1], initial_yaw]),
                args=(observations, sigmas, world_points),
                max_nfev=20_000,
                xtol=1e-13,
                ftol=1e-13,
                gtol=1e-13,
            )
            training = point_bearing_residuals(fitted.x, observations, sigmas, world_points)
            camera = fitted.x[:2]
            distance = float(np.linalg.norm(mound_center - camera))
            if distance <= mound_radius:
                continue
            mound_world_angle = math.atan2(
                float(mound_center[1] - camera[1]),
                float(mound_center[0] - camera[0]),
            )
            half_angle = math.asin(mound_radius / distance)
            predicted_tangents = (
                mound_world_angle + half_angle - float(fitted.x[2]),
                mound_world_angle - half_angle - float(fitted.x[2]),
            )
            tangent_records = []
            for predicted_angle, observed_angle, observed_pixel in zip(
                predicted_tangents, observed_mound_tangents, observed_mound_pixels
            ):
                predicted_face, predicted_pixel = provider_angle_to_face_pixel(
                    predicted_angle, face_size
                )
                tangent_records.append({
                    "observedFace": face,
                    "observedPixelX": observed_pixel,
                    "predictedFace": predicted_face,
                    "predictedPixelX": predicted_pixel,
                    "angularResidualDegrees": math.degrees(
                        abs(angle_delta(predicted_angle, observed_angle))
                    ),
                    "pixelResidual": (
                        abs(predicted_pixel - observed_pixel)
                        if predicted_face == face
                        else None
                    ),
                })
            if any(item["pixelResidual"] is None for item in tangent_records):
                diameter_holdout_maximum = None
            else:
                diameter_holdout_maximum = max(
                    float(item["pixelResidual"]) for item in tangent_records
                )
            implied_camera_heights = []
            for point, pixel in zip(world_points[1:], base_candidate_pixels):
                horizontal_distance = float(np.linalg.norm(point - camera))
                u = (float(pixel[0]) - face_size / 2.0) / (face_size / 2.0)
                v = (float(pixel[1]) - face_size / 2.0) / (face_size / 2.0)
                implied_camera_heights.append(
                    horizontal_distance * v / math.sqrt(1.0 + u * u)
                )
            base_height_difference = abs(
                implied_camera_heights[0] - implied_camera_heights[1]
            )
            inside = (
                section_envelope["minimumX"] <= camera[0] <= section_envelope["maximumX"]
                and section_envelope["minimumY"] <= camera[1] <= section_envelope["maximumY"]
            )
            solutions.append({
                "cameraProjectedFeet": [float(camera[0]), float(camera[1])],
                "providerToProjectedYawDegrees": math.degrees(float(fitted.x[2])) % 360.0,
                "trainingWeightedSquaredError": float(np.sum(training**2)),
                "trainingAngularResidualDegrees": [
                    math.degrees(abs(float(value) * float(sigma)))
                    for value, sigma in zip(training, sigmas)
                ],
                "moundCenterDistanceFeet": distance,
                "moundDiameterPrefitHoldout": {
                    "tangencies": tangent_records,
                    "maximumPixelResidual": diameter_holdout_maximum,
                },
                "baseGroundPlanePrefitHoldout": {
                    "verticalPixelsWereUsedByOptimizer": False,
                    "candidateAImpliedCameraHeightAboveBaseFeet": implied_camera_heights[0],
                    "candidateBImpliedCameraHeightAboveBaseFeet": implied_camera_heights[1],
                    "impliedBaseElevationDifferenceFeet": base_height_difference,
                    "maximumAllowedBaseElevationDifferenceFeet": 1.0,
                    "passes": base_height_difference <= 1.0,
                    "note": "Both base bags lie on the playing surface. The one-foot limit is conservative relative to normal field drainage grade and is used only to reject an impossible semantic assignment.",
                },
                "insidePaddedSection207PlanEnvelope": bool(inside),
            })
    return unique_solutions(solutions)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("extraction", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section-envelope-padding-feet", type=float, default=100.0)
    args = parser.parse_args()

    extraction_bytes = args.extraction.read_bytes()
    extraction = json.loads(extraction_bytes)
    if extraction.get("analysisVersion") != "rockies-panorama-regulation-field-control-extraction-v1":
        raise ValueError("Unsupported extraction artifact")
    input_paths = extraction["inputs"]
    field_bytes = Path(input_paths["fieldControls"]["path"]).read_bytes()
    registration_bytes = Path(input_paths["ngsCorrectedFieldRegistration"]["path"]).read_bytes()
    if hashlib.sha256(field_bytes).hexdigest() != input_paths["fieldControls"]["sha256"]:
        raise ValueError("Field-control checksum differs")
    if hashlib.sha256(registration_bytes).hexdigest() != input_paths["ngsCorrectedFieldRegistration"]["sha256"]:
        raise ValueError("NGS field-registration checksum differs")
    field = json.loads(field_bytes)
    registration = json.loads(registration_bytes)
    worlds = world_controls(
        field,
        registration,
        float(extraction["regulationGeometryFeet"]["homeToMoundCenter"]),
    )

    image_path = Path(input_paths["panoramaImage"]["path"])
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None or image.shape[0] != image.shape[1]:
        raise ValueError("Panorama face is missing or non-square")
    face_size = int(image.shape[1])
    face = extraction["face"]
    mound = extraction["mound"]["selected"]
    candidates = extraction["baseCandidates"]
    if len(candidates) != 2:
        raise ValueError("Exactly two visible base candidates are required")

    mound_left_angle = face_pixel_to_provider_angle(face, mound["leftTangentPixelX"], face_size)
    mound_right_angle = face_pixel_to_provider_angle(face, mound["rightTangentPixelX"], face_size)
    candidate_angles = [
        face_pixel_to_provider_angle(face, item["selected"]["centroidPixel"][0], face_size)
        for item in candidates
    ]
    observations = np.asarray([mound_left_angle, mound_right_angle, candidate_angles[0]])
    sigmas = np.asarray([
        pixel_angle_uncertainty(face, mound["leftTangentPixelX"], mound["leftTangentUncertaintyPixels95"], face_size),
        pixel_angle_uncertainty(face, mound["rightTangentPixelX"], mound["rightTangentUncertaintyPixels95"], face_size),
        pixel_angle_uncertainty(face, candidates[0]["selected"]["centroidPixel"][0], candidates[0]["selected"]["centroidUncertaintyPixels95"], face_size),
    ]) / 1.96

    section_points = np.asarray([
        seat["positionProjectedFeet"]
        for row in registration["rows"]
        if str(row.get("sectionName")) == "207"
        for seat in row["seats"]
    ], dtype=np.float64)
    padding = float(args.section_envelope_padding_feet)
    envelope = {
        "minimumX": float(np.min(section_points[:, 0]) - padding),
        "maximumX": float(np.max(section_points[:, 0]) + padding),
        "minimumY": float(np.min(section_points[:, 1]) - padding),
        "maximumY": float(np.max(section_points[:, 1]) + padding),
        "role": "broad semantic plausibility diagnostic only, not a fitted metric control",
    }

    assignment_results: list[dict[str, Any]] = []
    for training_identity, holdout_identity in itertools.permutations(
        ("firstBase", "secondBase", "thirdBase"), 2
    ):
        solutions = fit_assignment(
            observations,
            sigmas,
            worlds["moundCenter"],
            float(extraction["regulationGeometryFeet"]["moundDiameter"]) / 2.0,
            worlds[training_identity],
            worlds[holdout_identity],
            candidate_angles[1],
            float(candidates[1]["selected"]["centroidPixel"][0]),
            face,
            face_size,
            envelope,
        )
        assignment_results.append({
            "candidateAWorldIdentity": training_identity,
            "candidateBWorldIdentity": holdout_identity,
            "solutionCount": len(solutions),
            "solutions": solutions,
        })

    mound_center_observed_angle = math.atan2(
        math.sin(mound_left_angle) + math.sin(mound_right_angle),
        math.cos(mound_left_angle) + math.cos(mound_right_angle),
    )
    mound_center_sigma = math.sqrt(sigmas[0] ** 2 + sigmas[1] ** 2) / 2.0
    complementary_observations = np.asarray(
        [mound_center_observed_angle, candidate_angles[0], candidate_angles[1]],
        dtype=np.float64,
    )
    complementary_sigmas = np.asarray([
        mound_center_sigma,
        sigmas[2],
        pixel_angle_uncertainty(
            face,
            candidates[1]["selected"]["centroidPixel"][0],
            candidates[1]["selected"]["centroidUncertaintyPixels95"],
            face_size,
        ) / 1.96,
    ])
    complementary_results: list[dict[str, Any]] = []
    for first_identity, second_identity in itertools.permutations(
        ("firstBase", "secondBase", "thirdBase"), 2
    ):
        point_worlds = np.vstack(
            (worlds["moundCenter"], worlds[first_identity], worlds[second_identity])
        )
        solutions = fit_point_bearing_assignment(
            complementary_observations,
            complementary_sigmas,
            point_worlds,
            worlds["moundCenter"],
            float(extraction["regulationGeometryFeet"]["moundDiameter"]) / 2.0,
            (mound_left_angle, mound_right_angle),
            (float(mound["leftTangentPixelX"]), float(mound["rightTangentPixelX"])),
            (
                tuple(float(value) for value in candidates[0]["selected"]["centroidPixel"]),
                tuple(float(value) for value in candidates[1]["selected"]["centroidPixel"]),
            ),
            face,
            face_size,
            envelope,
        )
        complementary_results.append({
            "candidateAWorldIdentity": first_identity,
            "candidateBWorldIdentity": second_identity,
            "solutionCount": len(solutions),
            "solutions": solutions,
        })

    flat = [
        {
            "candidateAWorldIdentity": item["candidateAWorldIdentity"],
            "candidateBWorldIdentity": item["candidateBWorldIdentity"],
            **solution,
        }
        for item in assignment_results
        for solution in item["solutions"]
        if solution["insidePaddedSection207PlanEnvelope"]
        and solution["holdout"]["pixelResidual"] is not None
    ]
    flat.sort(key=lambda item: item["holdout"]["pixelResidual"])
    best = flat[0] if flat else None
    second_best = flat[1] if len(flat) > 1 else None
    identity_selected = bool(
        best is not None
        and best["holdout"]["pixelResidual"] <= candidates[1]["selected"]["centroidUncertaintyPixels95"]
        and (
            second_best is None
            or second_best["holdout"]["pixelResidual"]
            > best["holdout"]["pixelResidual"] + candidates[1]["selected"]["centroidUncertaintyPixels95"]
        )
    )

    complementary_flat = [
        {
            "candidateAWorldIdentity": item["candidateAWorldIdentity"],
            "candidateBWorldIdentity": item["candidateBWorldIdentity"],
            **solution,
        }
        for item in complementary_results
        for solution in item["solutions"]
        if solution["insidePaddedSection207PlanEnvelope"]
        and solution["moundDiameterPrefitHoldout"]["maximumPixelResidual"] is not None
    ]
    complementary_flat.sort(
        key=lambda item: item["moundDiameterPrefitHoldout"]["maximumPixelResidual"]
    )
    complementary_ground_plane_passing = [
        item for item in complementary_flat
        if item["baseGroundPlanePrefitHoldout"]["passes"]
    ]
    complementary_best = (
        complementary_ground_plane_passing[0]
        if complementary_ground_plane_passing
        else None
    )
    complementary_second = (
        complementary_ground_plane_passing[1]
        if len(complementary_ground_plane_passing) > 1
        else None
    )
    mound_holdout_limit = max(
        float(mound["leftTangentUncertaintyPixels95"]),
        float(mound["rightTangentUncertaintyPixels95"]),
    )
    complementary_identity_selected = bool(
        complementary_best is not None
        and complementary_best["moundDiameterPrefitHoldout"]["maximumPixelResidual"]
        <= mound_holdout_limit
        and (
            complementary_second is None
            or complementary_second["moundDiameterPrefitHoldout"]["maximumPixelResidual"]
            > complementary_best["moundDiameterPrefitHoldout"]["maximumPixelResidual"]
            + mound_holdout_limit
        )
    )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "extractionPath": str(args.extraction),
            "extractionSha256": hashlib.sha256(extraction_bytes).hexdigest(),
            "extractionArtifactVersion": extraction["artifactVersion"],
            "fieldControlsArtifactVersion": field["artifactVersion"],
            "ngsCorrectedFieldRegistrationArtifactVersion": registration["artifactVersion"],
        },
        "worldControlsProjectedFeet": {key: value.tolist() for key, value in worlds.items()},
        "trainingPartition": {
            "controls": ["mound-left-horizontal-tangent", "mound-right-horizontal-tangent", "visible-base-candidate-a"],
            "note": "Candidate B is excluded from every optimizer call.",
        },
        "prefitHoldoutPartition": {
            "controls": ["visible-base-candidate-b"],
        },
        "paddedSection207PlanEnvelope": envelope,
        "assignmentResults": assignment_results,
        "adjudication": {
            "identitySelected": identity_selected,
            "bestPlausibleCandidate": best,
            "secondBestPlausibleCandidate": second_best,
            "selectionRule": "Best candidate must be within the broad padded Section 207 plan envelope, predict the withheld candidate within its locked pixel uncertainty, and beat the second candidate by more than that uncertainty.",
        },
        "complementaryPartition": {
            "trainingControls": [
                "mound-center-bearing-from-two-silhouette-tangencies",
                "visible-base-candidate-a",
                "visible-base-candidate-b",
            ],
            "prefitHoldout": "mound angular diameter from the current 2026 regulation 18-foot circle",
            "diameterWasUsedByOptimizer": False,
            "secondPrefitHoldout": "relative base-ground elevation from the two unused cubemap vertical coordinates",
            "verticalPixelsWereUsedByOptimizer": False,
            "assignmentResults": complementary_results,
            "adjudication": {
                "identitySelected": complementary_identity_selected,
                "bestPlausibleCandidate": complementary_best,
                "secondBestPlausibleCandidate": complementary_second,
                "allPlausibleCandidatesRankedByMoundDiameter": complementary_flat,
                "groundPlanePassingCandidateCount": len(complementary_ground_plane_passing),
                "moundHoldoutMaximumPixelResidualLimit": mound_holdout_limit,
                "selectionRule": "A candidate must be inside the broad padded Section 207 plan envelope, reproduce both withheld mound tangencies within the locked maximum uncertainty, and imply no more than one foot of elevation difference between the two base bags from vertical pixels excluded from fitting. The surviving best candidate must beat any second survivor by more than the mound-pixel limit.",
            },
        },
    }
    any_identity_selected = identity_selected or complementary_identity_selected
    blockers = [
        "BASE_BAG_WORLD_IDENTITY_REMAINS_AMBIGUOUS" if not any_identity_selected else "CAMERA_POSE_UNCERTAINTY_NOT_YET_PROPAGATED",
        "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
        "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
        "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
    ]
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-regulation-field-bearing-pose-audit",
        "artifactStage": "prefit-holdout-pose-identity-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesCandidateBaseIdentity": any_identity_selected,
            "establishesCandidateCameraPose": any_identity_selected,
            "establishesReleaseCameraPose": False,
            "usesSection207PlanAsFitControl": False,
            "note": "The padded plan envelope is only a broad plausibility diagnostic. It contributes no residual to any pose fit.",
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "identitySelected": identity_selected,
        "bestPlausibleCandidate": best,
        "secondBestPlausibleCandidate": second_best,
        "complementaryIdentitySelected": complementary_identity_selected,
        "complementaryBestPlausibleCandidate": complementary_best,
        "complementarySecondBestPlausibleCandidate": complementary_second,
    }, indent=2))


if __name__ == "__main__":
    main()

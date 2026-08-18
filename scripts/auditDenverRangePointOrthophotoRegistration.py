#!/usr/bin/env python3
"""Audit a DRCOG orthophoto against reviewed Denver GPS range points.

This audit accepts only visually reviewed monument correspondences. It fits a
unit-scale rigid correction for release use and a similarity transform as a
scale-drift diagnostic. Unknown survey-source accuracy remains a hard blocker.
The result is a registration artifact only, never row-shade validation.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "denver-range-point-orthophoto-registration-audit-v1"
MINIMUM_ACCEPTED_CONTROLS = 3
MINIMUM_BASELINE_FEET = 100.0
MINIMUM_TRIANGLE_AREA_SQUARE_FEET = 100.0
MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET = 1.0
MAXIMUM_RESIDUAL_95_FEET = 1.0
MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET = 1.0
MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES = 1.0
MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET = 1.0
RADIAL_NORMAL_95_TO_SIGMA = math.sqrt(-2.0 * math.log(0.05))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def finite_point(value: Any, name: str) -> np.ndarray:
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f"{name} must contain two coordinates")
    point = np.asarray(value, dtype=float)
    if not np.all(np.isfinite(point)):
        raise ValueError(f"{name} must contain finite coordinates")
    return point


def world_from_source_pixel(
    column: float,
    row: float,
    world_values: list[float],
) -> np.ndarray:
    if len(world_values) != 6:
        raise ValueError("World file must contain six values")
    pixel_width, row_rotation, column_rotation, pixel_height, origin_x, origin_y = (
        float(value) for value in world_values
    )
    return np.asarray([
        pixel_width * column + column_rotation * row + origin_x,
        row_rotation * column + pixel_height * row + origin_y,
    ])


def transform_points(
    points: np.ndarray,
    rotation: np.ndarray,
    translation: np.ndarray,
    scale: float = 1.0,
) -> np.ndarray:
    return scale * (points @ rotation.T) + translation


def fit_rigid(
    image_world_points: np.ndarray,
    survey_points: np.ndarray,
) -> dict[str, Any]:
    image = np.asarray(image_world_points, dtype=float)
    survey = np.asarray(survey_points, dtype=float)
    if image.shape != survey.shape or image.ndim != 2 or image.shape[1] != 2:
        raise ValueError("Rigid-fit inputs must be matching N by 2 arrays")
    if len(image) < 2 or not np.all(np.isfinite(image)) or not np.all(np.isfinite(survey)):
        raise ValueError("Rigid fit requires at least two finite point pairs")
    image_center = np.mean(image, axis=0)
    survey_center = np.mean(survey, axis=0)
    image_centered = image - image_center
    survey_centered = survey - survey_center
    if float(np.max(np.linalg.norm(image_centered, axis=1))) <= 1e-9:
        raise ValueError("Rigid fit requires distinct image points")
    covariance = image_centered.T @ survey_centered
    left, _, right_transposed = np.linalg.svd(covariance)
    rotation = right_transposed.T @ left.T
    if np.linalg.det(rotation) < 0:
        right_transposed[-1, :] *= -1
        rotation = right_transposed.T @ left.T
    translation = survey_center - image_center @ rotation.T
    predicted = transform_points(image, rotation, translation)
    residuals = np.linalg.norm(predicted - survey, axis=1)
    angle_degrees = math.degrees(math.atan2(rotation[1, 0], rotation[0, 0]))
    return {
        "rotation": rotation,
        "translation": translation,
        "predicted": predicted,
        "residuals": residuals,
        "cartesianCounterclockwiseCorrectionDegrees": angle_degrees,
        "trueBearingCorrectionDegrees": -angle_degrees,
    }


def fit_similarity(
    image_world_points: np.ndarray,
    survey_points: np.ndarray,
) -> dict[str, Any]:
    image = np.asarray(image_world_points, dtype=float)
    survey = np.asarray(survey_points, dtype=float)
    if image.shape != survey.shape or image.ndim != 2 or image.shape[1] != 2:
        raise ValueError("Similarity-fit inputs must be matching N by 2 arrays")
    if len(image) < 2 or not np.all(np.isfinite(image)) or not np.all(np.isfinite(survey)):
        raise ValueError("Similarity fit requires at least two finite point pairs")
    image_center = np.mean(image, axis=0)
    survey_center = np.mean(survey, axis=0)
    image_centered = image - image_center
    survey_centered = survey - survey_center
    design = np.zeros((len(image) * 2, 2), dtype=float)
    target = survey_centered.reshape(-1)
    design[0::2, 0] = image_centered[:, 0]
    design[0::2, 1] = -image_centered[:, 1]
    design[1::2, 0] = image_centered[:, 1]
    design[1::2, 1] = image_centered[:, 0]
    parameters, _, rank, _ = np.linalg.lstsq(design, target, rcond=None)
    if rank != 2:
        raise ValueError("Similarity fit is rank deficient")
    a, b = (float(value) for value in parameters)
    scale = math.hypot(a, b)
    if scale <= 0:
        raise ValueError("Similarity fit has a nonpositive scale")
    rotation = np.asarray([[a, -b], [b, a]], dtype=float) / scale
    translation = survey_center - scale * (image_center @ rotation.T)
    predicted = transform_points(image, rotation, translation, scale)
    residuals = np.linalg.norm(predicted - survey, axis=1)
    angle_degrees = math.degrees(math.atan2(rotation[1, 0], rotation[0, 0]))
    return {
        "rotation": rotation,
        "translation": translation,
        "scale": scale,
        "predicted": predicted,
        "residuals": residuals,
        "cartesianCounterclockwiseCorrectionDegrees": angle_degrees,
        "trueBearingCorrectionDegrees": -angle_degrees,
    }


def spatial_geometry(points: np.ndarray) -> dict[str, float]:
    values = np.asarray(points, dtype=float)
    if values.ndim != 2 or values.shape[1] != 2:
        raise ValueError("Spatial geometry requires an N by 2 array")
    baselines = [
        float(np.linalg.norm(values[first] - values[second]))
        for first, second in itertools.combinations(range(len(values)), 2)
    ]
    triangle_areas = [
        abs(float(
            (values[second, 0] - values[first, 0])
            * (values[third, 1] - values[first, 1])
            - (values[second, 1] - values[first, 1])
            * (values[third, 0] - values[first, 0])
        )) / 2.0
        for first, second, third in itertools.combinations(range(len(values)), 3)
    ]
    return {
        "maximumPairwiseBaselineFeet": max(baselines, default=0.0),
        "maximumTriangleAreaSquareFeet": max(triangle_areas, default=0.0),
    }


def leave_one_out_errors(
    image_world_points: np.ndarray,
    survey_points: np.ndarray,
) -> np.ndarray:
    image = np.asarray(image_world_points, dtype=float)
    survey = np.asarray(survey_points, dtype=float)
    if len(image) < 3:
        return np.asarray([], dtype=float)
    errors: list[float] = []
    for held_out in range(len(image)):
        keep = np.arange(len(image)) != held_out
        fit = fit_rigid(image[keep], survey[keep])
        predicted = transform_points(
            image[held_out:held_out + 1],
            fit["rotation"],
            fit["translation"],
        )[0]
        errors.append(float(np.linalg.norm(predicted - survey[held_out])))
    return np.asarray(errors)


def percentile_95(values: np.ndarray) -> float:
    array = np.asarray(values, dtype=float)
    if len(array) == 0:
        raise ValueError("Cannot compute a percentile from no values")
    return float(np.percentile(array, 95, method="linear"))


def wrapped_angle_delta_degrees(values: np.ndarray, center: float) -> np.ndarray:
    return (np.asarray(values, dtype=float) - center + 180.0) % 360.0 - 180.0


def monte_carlo_rigid_uncertainty(
    observed_pixels: np.ndarray,
    survey_points: np.ndarray,
    pixel_uncertainty_95: np.ndarray,
    world_values: list[float],
    survey_horizontal_accuracy_95_feet: float | None,
    anchor_world: np.ndarray,
    sample_count: int,
    seed: int,
) -> dict[str, Any]:
    if sample_count < 1_000:
        raise ValueError("Monte Carlo audit requires at least 1000 samples")
    pixels = np.asarray(observed_pixels, dtype=float)
    survey = np.asarray(survey_points, dtype=float)
    uncertainties = np.asarray(pixel_uncertainty_95, dtype=float)
    if pixels.shape != survey.shape or pixels.ndim != 2 or pixels.shape[1] != 2:
        raise ValueError("Monte Carlo point arrays must be matching N by 2 arrays")
    if uncertainties.shape != (len(pixels),) or np.any(uncertainties <= 0):
        raise ValueError("Each control requires positive radial pixel uncertainty")
    nominal_world = np.asarray([
        world_from_source_pixel(point[0], point[1], world_values)
        for point in pixels
    ])
    nominal_fit = fit_rigid(nominal_world, survey)
    nominal_angle = nominal_fit["cartesianCounterclockwiseCorrectionDegrees"]
    nominal_anchor = transform_points(
        np.asarray([anchor_world]),
        nominal_fit["rotation"],
        nominal_fit["translation"],
    )[0]
    rng = np.random.default_rng(seed)
    pixel_sigmas = uncertainties / RADIAL_NORMAL_95_TO_SIGMA
    survey_sigma = (
        survey_horizontal_accuracy_95_feet / RADIAL_NORMAL_95_TO_SIGMA
        if survey_horizontal_accuracy_95_feet is not None
        else 0.0
    )
    angles = np.empty(sample_count, dtype=float)
    anchors = np.empty((sample_count, 2), dtype=float)
    for index in range(sample_count):
        sampled_pixels = pixels + rng.normal(
            0.0,
            pixel_sigmas[:, np.newaxis],
            size=pixels.shape,
        )
        sampled_world = np.asarray([
            world_from_source_pixel(point[0], point[1], world_values)
            for point in sampled_pixels
        ])
        sampled_survey = survey + rng.normal(
            0.0,
            survey_sigma,
            size=survey.shape,
        )
        fit = fit_rigid(sampled_world, sampled_survey)
        angles[index] = fit["cartesianCounterclockwiseCorrectionDegrees"]
        anchors[index] = transform_points(
            np.asarray([anchor_world]),
            fit["rotation"],
            fit["translation"],
        )[0]
    angle_errors = np.abs(wrapped_angle_delta_degrees(angles, nominal_angle))
    anchor_errors = np.linalg.norm(anchors - nominal_anchor, axis=1)
    return {
        "sampleCount": sample_count,
        "seed": seed,
        "radialNormal95ToSigma": RADIAL_NORMAL_95_TO_SIGMA,
        "includesSurveySourceAccuracy": survey_horizontal_accuracy_95_feet is not None,
        "orientationUncertainty95Degrees": percentile_95(angle_errors),
        "anchorHorizontalUncertainty95Feet": percentile_95(anchor_errors),
    }


def load_source_accuracy(
    correspondence_review: dict[str, Any],
) -> tuple[float | None, dict[str, Any] | None]:
    evidence = correspondence_review.get("surveySourceAccuracyEvidence")
    if evidence is None:
        return None, None
    if not isinstance(evidence, dict):
        raise ValueError("Survey source accuracy evidence must be an object or null")
    horizontal = evidence.get("horizontalAccuracy95Feet")
    if not isinstance(horizontal, (int, float)) or not math.isfinite(horizontal) or horizontal <= 0:
        raise ValueError("Survey source accuracy must be a positive 95-percent value")
    evidence_path = Path(str(evidence.get("localEvidencePath", "")))
    expected_hash = str(evidence.get("localEvidenceSha256", ""))
    source_url = str(evidence.get("sourceUrl", ""))
    if not evidence_path.is_file() or len(expected_hash) != 64 or not source_url.startswith("https://"):
        raise ValueError("Survey accuracy requires a local checksum-locked official source")
    actual_hash = sha256_file(evidence_path)
    if actual_hash != expected_hash:
        raise ValueError("Survey source accuracy evidence hash mismatch")
    return float(horizontal), {
        "horizontalAccuracy95Feet": float(horizontal),
        "localEvidencePath": str(evidence_path.resolve()),
        "localEvidenceSha256": actual_hash,
        "sourceUrl": source_url,
        "evidenceNote": str(evidence.get("evidenceNote", "")),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-queue", type=Path, required=True)
    parser.add_argument("--correspondence-review", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--monte-carlo-samples", type=int, default=50_000)
    parser.add_argument("--seed", type=int, default=20260810)
    args = parser.parse_args()

    queue_bytes = args.review_queue.read_bytes()
    queue = json.loads(queue_bytes)
    if queue.get("artifactKind") != "denver-range-point-orthophoto-review-queue":
        raise ValueError("Review queue has the wrong artifact kind")
    review_bytes = args.correspondence_review.read_bytes()
    review = json.loads(review_bytes)
    if review.get("artifactKind") != "denver-range-point-orthophoto-correspondence-review":
        raise ValueError("Correspondence review has the wrong artifact kind")
    if review.get("reviewState") != "completed":
        raise ValueError("Correspondence review is not explicitly completed")
    review_protocol = review.get("reviewProtocol", {})
    reviewer_id = str(review_protocol.get("reviewerId", "")).strip()
    completed_at_utc = str(review_protocol.get("completedAtUtc", "")).strip()
    review_method = str(review_protocol.get("method", "")).strip()
    if not reviewer_id or not completed_at_utc.endswith("Z") or not review_method:
        raise ValueError("Completed review lacks reviewer, UTC completion time, or method")
    queue_hash = hashlib.sha256(queue_bytes).hexdigest()
    source_lock = review.get("sourceReviewQueue", {})
    if source_lock.get("artifactVersion") != queue.get("artifactVersion"):
        raise ValueError("Correspondence review locks the wrong queue version")
    if source_lock.get("sha256") != queue_hash:
        raise ValueError("Correspondence review locks the wrong queue hash")

    world_values = queue.get("reviewParameters", {}).get("worldFileValues")
    if not isinstance(world_values, list) or len(world_values) != 6:
        raise ValueError("Review queue lacks its six-value world file")
    queue_points = {str(point["objectId"]): point for point in queue.get("points", [])}
    accepted: list[dict[str, Any]] = []
    reviewed_ids: set[str] = set()
    for point in review.get("points", []):
        object_id = str(point.get("objectId"))
        if object_id in reviewed_ids:
            raise ValueError(f"Duplicate reviewed object ID: {object_id}")
        reviewed_ids.add(object_id)
        if object_id not in queue_points:
            raise ValueError(f"Reviewed object ID is absent from queue: {object_id}")
        decision = point.get("acceptedForRegistration")
        if not isinstance(decision, bool):
            raise ValueError(f"Object {object_id} lacks an explicit review decision")
        if decision is not True:
            if not str(point.get("rejectionReason", "")).strip():
                raise ValueError(f"Rejected object {object_id} lacks a rejection reason")
            continue
        queue_point = queue_points[object_id]
        if queue_point.get("insideOrthophoto") is not True:
            raise ValueError(f"Accepted object ID is outside the orthophoto: {object_id}")
        observed_pixel = finite_point(
            point.get("observedSourcePixelCoordinate"),
            f"Observed pixel for object {object_id}",
        )
        uncertainty = point.get("pixelCenterUncertainty95Pixels")
        if not isinstance(uncertainty, (int, float)) or not math.isfinite(uncertainty) or uncertainty <= 0:
            raise ValueError(f"Object {object_id} lacks positive 95-percent pixel uncertainty")
        crop = queue_point.get("cropPixelWindow", {})
        if not (
            float(crop.get("left")) <= observed_pixel[0] < float(crop.get("right"))
            and float(crop.get("top")) <= observed_pixel[1] < float(crop.get("bottom"))
        ):
            raise ValueError(f"Observed object {object_id} is outside its review crop")
        feature_kind = str(point.get("visibleFeatureKind", "")).strip()
        evidence_note = str(point.get("evidenceNote", "")).strip()
        if not feature_kind or not evidence_note:
            raise ValueError(f"Accepted object {object_id} lacks visual evidence metadata")
        accepted.append({
            "objectId": queue_point["objectId"],
            "survey": finite_point(
                queue_point.get("surveyCoordinateProjectedFeet"),
                f"Survey coordinate for object {object_id}",
            ),
            "observedPixel": observed_pixel,
            "pixelUncertainty95": float(uncertainty),
            "visibleFeatureKind": feature_kind,
            "evidenceNote": evidence_note,
        })

    survey_accuracy, survey_accuracy_evidence = load_source_accuracy(review)
    accepted_count = len(accepted)
    survey_points = np.asarray([point["survey"] for point in accepted], dtype=float)
    observed_pixels = np.asarray([point["observedPixel"] for point in accepted], dtype=float)
    image_world_points = np.asarray([
        world_from_source_pixel(point[0], point[1], world_values)
        for point in observed_pixels
    ]) if accepted_count else np.empty((0, 2), dtype=float)
    pixel_uncertainties = np.asarray([
        point["pixelUncertainty95"] for point in accepted
    ], dtype=float)

    geometry = spatial_geometry(survey_points) if accepted_count else {
        "maximumPairwiseBaselineFeet": 0.0,
        "maximumTriangleAreaSquareFeet": 0.0,
    }
    rigid: dict[str, Any] | None = None
    similarity: dict[str, Any] | None = None
    leave_out = np.asarray([], dtype=float)
    monte_carlo: dict[str, Any] | None = None
    if accepted_count >= 2:
        rigid = fit_rigid(image_world_points, survey_points)
        similarity = fit_similarity(image_world_points, survey_points)
        leave_out = leave_one_out_errors(image_world_points, survey_points)
        anchor_world = np.mean(image_world_points, axis=0)
        monte_carlo = monte_carlo_rigid_uncertainty(
            observed_pixels,
            survey_points,
            pixel_uncertainties,
            world_values,
            survey_accuracy,
            anchor_world,
            args.monte_carlo_samples,
            args.seed,
        )

    pixel_step_x = math.hypot(float(world_values[0]), float(world_values[1]))
    pixel_step_y = math.hypot(float(world_values[2]), float(world_values[3]))
    maximum_pixel_step = max(pixel_step_x, pixel_step_y)
    visual_uncertainty_95 = (
        float(np.max(pixel_uncertainties)) * maximum_pixel_step
        if accepted_count else None
    )
    residual_95 = percentile_95(rigid["residuals"]) if rigid is not None else None
    leave_out_95 = percentile_95(leave_out) if len(leave_out) else None
    leave_out_maximum = float(np.max(leave_out)) if len(leave_out) else None
    scale_drift = (
        abs(float(similarity["scale"]) - 1.0) * geometry["maximumPairwiseBaselineFeet"]
        if similarity is not None else None
    )
    combined_horizontal_95 = None
    if (
        survey_accuracy is not None
        and visual_uncertainty_95 is not None
        and residual_95 is not None
        and leave_out_maximum is not None
        and monte_carlo is not None
    ):
        combined_horizontal_95 = (
            survey_accuracy
            + visual_uncertainty_95
            + max(
                residual_95,
                leave_out_maximum,
                float(monte_carlo["anchorHorizontalUncertainty95Feet"]),
            )
        )

    blockers: list[str] = []
    if accepted_count < MINIMUM_ACCEPTED_CONTROLS:
        blockers.append("FEWER_THAN_THREE_ACCEPTED_RANGE_POINT_CONTROLS")
    if geometry["maximumPairwiseBaselineFeet"] < MINIMUM_BASELINE_FEET:
        blockers.append("RANGE_POINT_CONTROL_BASELINE_BELOW_100_FEET")
    if geometry["maximumTriangleAreaSquareFeet"] < MINIMUM_TRIANGLE_AREA_SQUARE_FEET:
        blockers.append("RANGE_POINT_CONTROLS_NOT_SPATIALLY_NONCOLLINEAR")
    if survey_accuracy is None:
        blockers.append("RANGE_POINT_NUMERIC_HORIZONTAL_ACCURACY_95_UNVERIFIED")
    if residual_95 is None or residual_95 > MAXIMUM_RESIDUAL_95_FEET:
        blockers.append("ORTHOPHOTO_RIGID_FIT_RESIDUAL_95_EXCEEDS_ONE_FOOT")
    if leave_out_maximum is None or leave_out_maximum > MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET:
        blockers.append("ORTHOPHOTO_LEAVE_ONE_OUT_ERROR_EXCEEDS_ONE_FOOT")
    if scale_drift is None or scale_drift > MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET:
        blockers.append("ORTHOPHOTO_SCALE_DRIFT_ACROSS_BASELINE_EXCEEDS_ONE_FOOT")
    orientation_uncertainty = (
        float(monte_carlo["orientationUncertainty95Degrees"])
        if monte_carlo is not None else None
    )
    if (
        orientation_uncertainty is None
        or orientation_uncertainty > MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES
    ):
        blockers.append("ORTHOPHOTO_ORIENTATION_UNCERTAINTY_95_EXCEEDS_ONE_DEGREE")
    if (
        combined_horizontal_95 is None
        or combined_horizontal_95 > MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET
    ):
        blockers.append("ORTHOPHOTO_COMBINED_HORIZONTAL_UNCERTAINTY_95_EXCEEDS_ONE_FOOT")
    registration_accepted = len(blockers) == 0

    point_results: list[dict[str, Any]] = []
    for index, point in enumerate(accepted):
        point_results.append({
            "objectId": point["objectId"],
            "surveyCoordinateProjectedFeet": point["survey"].tolist(),
            "observedSourcePixelCoordinate": point["observedPixel"].tolist(),
            "observedNominalWorldCoordinateFeet": image_world_points[index].tolist(),
            "pixelCenterUncertainty95Pixels": point["pixelUncertainty95"],
            "visibleFeatureKind": point["visibleFeatureKind"],
            "evidenceNote": point["evidenceNote"],
            "rigidFitResidualFeet": (
                float(rigid["residuals"][index]) if rigid is not None else None
            ),
            "leaveOneOutErrorFeet": (
                float(leave_out[index]) if len(leave_out) else None
            ),
        })

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": queue.get("stadiumId"),
        "inputs": {
            "reviewQueuePath": str(args.review_queue.resolve()),
            "reviewQueueSha256": queue_hash,
            "reviewQueueArtifactVersion": queue.get("artifactVersion"),
            "correspondenceReviewPath": str(args.correspondence_review.resolve()),
            "correspondenceReviewSha256": hashlib.sha256(review_bytes).hexdigest(),
            "surveySourceAccuracyEvidence": survey_accuracy_evidence,
            "reviewProtocol": {
                "reviewerId": reviewer_id,
                "completedAtUtc": completed_at_utc,
                "method": review_method,
            },
        },
        "controlGeometry": {
            "acceptedControlCount": accepted_count,
            **geometry,
        },
        "points": point_results,
        "rigidCorrection": None if rigid is None else {
            "unitScaleEnforced": True,
            "rotationMatrix": rigid["rotation"].tolist(),
            "translationFeet": rigid["translation"].tolist(),
            "cartesianCounterclockwiseCorrectionDegrees": rigid[
                "cartesianCounterclockwiseCorrectionDegrees"
            ],
            "trueBearingCorrectionDegrees": rigid["trueBearingCorrectionDegrees"],
            "residual95Feet": residual_95,
        },
        "similarityScaleDiagnostic": None if similarity is None else {
            "scale": similarity["scale"],
            "scalePartsPerMillion": (float(similarity["scale"]) - 1.0) * 1_000_000.0,
            "scaleDriftAcrossMaximumBaselineFeet": scale_drift,
            "residual95Feet": percentile_95(similarity["residuals"]),
        },
        "leaveOneOut": {
            "error95Feet": leave_out_95,
            "maximumErrorFeet": leave_out_maximum,
        },
        "uncertainty": {
            "surveySourceHorizontalAccuracy95Feet": survey_accuracy,
            "maximumVisualCorrespondenceUncertainty95Feet": visual_uncertainty_95,
            "monteCarlo": monte_carlo,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal_95,
            "combinationMethod": (
                "conservative linear sum of survey-source accuracy, maximum visual "
                "correspondence uncertainty, and the largest registration error term"
            ),
        },
        "gates": {
            "minimumAcceptedControls": MINIMUM_ACCEPTED_CONTROLS,
            "minimumPairwiseBaselineFeet": MINIMUM_BASELINE_FEET,
            "minimumTriangleAreaSquareFeet": MINIMUM_TRIANGLE_AREA_SQUARE_FEET,
            "maximumHorizontalUncertainty95Feet": MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET,
            "maximumResidual95Feet": MAXIMUM_RESIDUAL_95_FEET,
            "maximumLeaveOneOutErrorFeet": MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET,
            "maximumOrientationUncertainty95Degrees": (
                MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES
            ),
            "maximumScaleDriftAcrossBaselineFeet": (
                MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET
            ),
        },
        "registrationAcceptance": {
            "accepted": registration_accepted,
            "blockers": blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "denver-range-point-orthophoto-registration-audit",
        "artifactVersion": f"sha256:{stable_sha256(stable)}",
        **stable,
        "geometryBoundary": {
            "establishesCorrectedOrthophotoTranslationAndRotation": registration_accepted,
            "establishesRowGeometryOrObstructionGeometry": False,
            "establishesIndependentShadowValidation": False,
            "note": (
                "This artifact audits a local orthophoto frame only. It cannot establish "
                "seat rows, overhangs, roof state, or row-level shade accuracy."
            ),
        },
        "publication": {
            "eligibleForExactRowShade": False,
            "blockers": [
                "REGISTRATION_ARTIFACT_ONLY",
                "ROW_GEOMETRY_NOT_EVALUATED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_EVALUATED",
                "INDEPENDENT_SHADOW_VALIDATION_NOT_EVALUATED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputPath": str(args.output.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "acceptedControlCount": accepted_count,
        "registrationAcceptance": artifact["registrationAcceptance"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

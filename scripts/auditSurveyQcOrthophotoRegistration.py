#!/usr/bin/env python3
"""Audit an official orthophoto against reviewed producer survey QC points.

The numeric fit and the control-independence provenance gate are intentionally
reported separately. A precise fit cannot establish publication eligibility
when the source does not explicitly say that the QC points were excluded from
the orthophoto adjustment.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np

from auditDenverRangePointOrthophotoRegistration import (
    RADIAL_NORMAL_95_TO_SIGMA,
    finite_point,
    fit_rigid,
    fit_similarity,
    leave_one_out_errors,
    percentile_95,
    spatial_geometry,
    transform_points,
    world_from_source_pixel,
    wrapped_angle_delta_degrees,
)
from auditNgsOrthophotoRegistration import point_inside_control_hull


ANALYSIS_VERSION = "survey-qc-orthophoto-registration-audit-v1"
MINIMUM_ACCEPTED_CONTROLS = 3
MINIMUM_BASELINE_FEET = 100.0
MINIMUM_TRIANGLE_AREA_SQUARE_FEET = 100.0
MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET = 1.0
MAXIMUM_RESIDUAL_95_FEET = 1.0
MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET = 1.0
MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES = 1.0
MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET = 1.0
EXPECTED_SERVICE_URL = (
    "https://imageserverintra.miamidade.gov/arcgis/rest/services/"
    "WGS1984_WebMercator/2021_Woolpert_WGS1984_WebMercator/ImageServer"
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def resolve_existing_file(value: Any, description: str) -> Path:
    path = Path(str(value))
    if not path.is_file():
        raise ValueError(f"{description} is missing: {path}")
    return path.resolve()


def verify_file_hash(path: Path, expected_hash: Any, description: str) -> str:
    expected = str(expected_hash)
    if len(expected) != 64:
        raise ValueError(f"{description} lacks a valid SHA-256")
    actual = sha256_file(path)
    if actual != expected:
        raise ValueError(f"{description} hash mismatch: {path}")
    return actual


def verify_crop_manifest(lock: dict[str, Any]) -> dict[str, Any]:
    path = resolve_existing_file(lock.get("manifestPath"), "Orthophoto manifest")
    manifest_hash = verify_file_hash(
        path,
        lock.get("manifestSha256"),
        "Orthophoto manifest",
    )
    manifest = json.loads(path.read_bytes())
    if manifest.get("artifactKind") != "official-arcgis-orthophoto-export":
        raise ValueError(f"Wrong orthophoto artifact kind: {path}")
    if manifest.get("artifactVersion") != lock.get("artifactVersion"):
        raise ValueError(f"Orthophoto artifact version mismatch: {path}")
    if manifest.get("stadiumId") != "marlins":
        raise ValueError(f"Orthophoto crop is not for the Marlins: {path}")
    source = manifest.get("source", {})
    if (
        source.get("serviceUrl") != EXPECTED_SERVICE_URL
        or source.get("sourceYear") != 2021
    ):
        raise ValueError(f"Orthophoto crop is not the official 2021 service: {path}")
    export = manifest.get("export", {})
    if export.get("coordinateReferenceSystem") != "EPSG:6438":
        raise ValueError(f"Orthophoto crop is not in EPSG:6438: {path}")
    if not (
        math.isclose(float(export.get("pixelSizeX", 0)), 0.25, abs_tol=1e-12)
        and math.isclose(float(export.get("pixelSizeY", 0)), 0.25, abs_tol=1e-12)
    ):
        raise ValueError(f"Orthophoto crop is not at 0.25-foot resolution: {path}")
    image_path = resolve_existing_file(
        manifest.get("localImagePath"),
        "Orthophoto crop image",
    )
    image_hash = verify_file_hash(
        image_path,
        export.get("sha256"),
        "Orthophoto crop image",
    )
    if image_hash != lock.get("imageSha256"):
        raise ValueError(f"Review queue image hash mismatch: {path}")
    return {
        "manifestPath": str(path),
        "manifestSha256": manifest_hash,
        "artifactVersion": manifest.get("artifactVersion"),
        "serviceUrl": source.get("serviceUrl"),
        "sourceYear": source.get("sourceYear"),
        "coordinateReferenceSystem": export.get("coordinateReferenceSystem"),
        "extent": export.get("extent"),
        "pixelSizeFeet": float(export["pixelSizeX"]),
        "imagePath": str(image_path),
        "imageSha256": image_hash,
    }


def verify_native_orthophoto(path: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = path.read_bytes()
    manifest = json.loads(raw)
    if manifest.get("artifactKind") != "official-native-orthophoto-mosaic":
        raise ValueError("Target orthophoto has the wrong artifact kind")
    if manifest.get("stadiumId") != "marlins":
        raise ValueError("Target orthophoto is not for the Marlins")
    source = manifest.get("source", {})
    if source.get("serviceUrl") != EXPECTED_SERVICE_URL:
        raise ValueError("Target orthophoto is not from the expected official service")
    raster = manifest.get("raster", {})
    if raster.get("coordinateReferenceSystem") != "EPSG:6438":
        raise ValueError("Target orthophoto is not in EPSG:6438")
    if not (
        math.isclose(float(raster.get("pixelSizeX", 0)), 0.25, abs_tol=1e-12)
        and math.isclose(float(raster.get("pixelSizeY", 0)), 0.25, abs_tol=1e-12)
    ):
        raise ValueError("Target orthophoto is not at 0.25-foot resolution")
    raster_path = resolve_existing_file(raster.get("path"), "Target orthophoto raster")
    raster_hash = verify_file_hash(
        raster_path,
        raster.get("sha256"),
        "Target orthophoto raster",
    )
    for quadrant in source.get("quadrants", []):
        quadrant_path = resolve_existing_file(
            quadrant.get("path"),
            f"Target orthophoto {quadrant.get('quadrant')} quadrant",
        )
        verify_file_hash(
            quadrant_path,
            quadrant.get("sha256"),
            f"Target orthophoto {quadrant.get('quadrant')} quadrant",
        )
    return manifest, {
        "path": str(path.resolve()),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "artifactVersion": manifest.get("artifactVersion"),
        "serviceUrl": source.get("serviceUrl"),
        "groundConditionDate": source.get("groundConditionDate"),
        "coordinateReferenceSystem": raster.get("coordinateReferenceSystem"),
        "extent": raster.get("extent"),
        "pixelSizeFeet": float(raster["pixelSizeX"]),
        "rasterPath": str(raster_path),
        "rasterSha256": raster_hash,
    }


def monte_carlo_rigid_uncertainty(
    observed_pixels: np.ndarray,
    survey_points: np.ndarray,
    pixel_uncertainty_95: np.ndarray,
    survey_accuracy_95_feet: np.ndarray,
    world_values_by_control: list[list[float]],
    anchor_world: np.ndarray,
    sample_count: int,
    seed: int,
) -> dict[str, Any]:
    if sample_count < 1_000:
        raise ValueError("Monte Carlo audit requires at least 1000 samples")
    pixels = np.asarray(observed_pixels, dtype=float)
    survey = np.asarray(survey_points, dtype=float)
    pixel_uncertainties = np.asarray(pixel_uncertainty_95, dtype=float)
    survey_accuracies = np.asarray(survey_accuracy_95_feet, dtype=float)
    if pixels.shape != survey.shape or pixels.ndim != 2 or pixels.shape[1] != 2:
        raise ValueError("Monte Carlo point arrays must be matching N by 2 arrays")
    if len(world_values_by_control) != len(pixels):
        raise ValueError("Each control requires its own world-file transform")
    if (
        pixel_uncertainties.shape != (len(pixels),)
        or survey_accuracies.shape != (len(pixels),)
        or np.any(pixel_uncertainties <= 0)
        or np.any(survey_accuracies <= 0)
    ):
        raise ValueError("Each control requires positive pixel and survey uncertainty")
    nominal_world = np.asarray([
        world_from_source_pixel(point[0], point[1], values)
        for point, values in zip(pixels, world_values_by_control)
    ])
    nominal_fit = fit_rigid(nominal_world, survey)
    nominal_angle = nominal_fit["cartesianCounterclockwiseCorrectionDegrees"]
    nominal_anchor = transform_points(
        np.asarray([anchor_world]),
        nominal_fit["rotation"],
        nominal_fit["translation"],
    )[0]
    pixel_sigmas = pixel_uncertainties / RADIAL_NORMAL_95_TO_SIGMA
    survey_sigmas = survey_accuracies / RADIAL_NORMAL_95_TO_SIGMA
    rng = np.random.default_rng(seed)
    angles = np.empty(sample_count, dtype=float)
    anchors = np.empty((sample_count, 2), dtype=float)
    for index in range(sample_count):
        sampled_pixels = pixels + rng.normal(
            0.0,
            pixel_sigmas[:, np.newaxis],
            size=pixels.shape,
        )
        sampled_world = np.asarray([
            world_from_source_pixel(point[0], point[1], values)
            for point, values in zip(sampled_pixels, world_values_by_control)
        ])
        sampled_survey = survey + rng.normal(
            0.0,
            survey_sigmas[:, np.newaxis],
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
        "includesIndividualSurveyAccuracy": True,
        "includesIndividualVisualPixelUncertainty": True,
        "orientationUncertainty95Degrees": percentile_95(angle_errors),
        "anchorHorizontalUncertainty95Feet": percentile_95(anchor_errors),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-queue", type=Path, required=True)
    parser.add_argument("--correspondence-review", type=Path, required=True)
    parser.add_argument("--qc-control-report", type=Path, required=True)
    parser.add_argument("--target-orthophoto-manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--monte-carlo-samples", type=int, default=50_000)
    parser.add_argument("--seed", type=int, default=20260810)
    args = parser.parse_args()

    queue_bytes = args.review_queue.read_bytes()
    queue = json.loads(queue_bytes)
    if queue.get("artifactKind") != "survey-qc-orthophoto-control-review-queue":
        raise ValueError("Review queue has the wrong artifact kind")
    if queue.get("stadiumId") != "marlins":
        raise ValueError("Review queue is not for the Marlins")
    review_bytes = args.correspondence_review.read_bytes()
    review = json.loads(review_bytes)
    if review.get("artifactKind") != "survey-qc-orthophoto-correspondence-review":
        raise ValueError("Correspondence review has the wrong artifact kind")
    if review.get("reviewState") != "completed":
        raise ValueError("Correspondence review is not explicitly completed")
    protocol = review.get("reviewProtocol", {})
    reviewer_id = str(protocol.get("reviewerId", "")).strip()
    completed_at_utc = str(protocol.get("completedAtUtc", "")).strip()
    method = str(protocol.get("method", "")).strip()
    if not reviewer_id or not completed_at_utc.endswith("Z") or not method:
        raise ValueError("Completed review lacks reviewer, UTC time, or method")
    queue_hash = hashlib.sha256(queue_bytes).hexdigest()
    source_lock = review.get("sourceReviewQueue", {})
    if (
        source_lock.get("sha256") != queue_hash
        or source_lock.get("artifactVersion") != queue.get("artifactVersion")
    ):
        raise ValueError("Correspondence review does not lock the supplied queue")

    qc_bytes = args.qc_control_report.read_bytes()
    qc_report = json.loads(qc_bytes)
    if qc_report.get("artifactKind") != "woolpert-orthophoto-qc-control-report":
        raise ValueError("QC control report has the wrong artifact kind")
    if qc_report.get("stadiumId") != "marlins":
        raise ValueError("QC control report is not for the Marlins")
    qc_hash = hashlib.sha256(qc_bytes).hexdigest()
    queue_qc_lock = queue.get("inputs", {}).get("datasheets", {})
    if (
        queue_qc_lock.get("sha256") != qc_hash
        or queue_qc_lock.get("artifactVersion") != qc_report.get("artifactVersion")
    ):
        raise ValueError("Review queue does not lock the supplied QC control report")
    report_source = qc_report.get("source", {})
    report_path = resolve_existing_file(
        report_source.get("reportPath"),
        "Signed survey report",
    )
    report_hash = verify_file_hash(
        report_path,
        report_source.get("reportSha256"),
        "Signed survey report",
    )
    role_semantics = qc_report.get("roleSemantics", {})
    role_separated = role_semantics.get(
        "reportSeparatesQcPointsFromTemporaryAndPermanentControlPoints"
    ) is True
    independence_explicit = role_semantics.get(
        "explicitStatementQcPointsWereExcludedFromOrthophotoAdjustment"
    ) is True

    _, target_lock = verify_native_orthophoto(args.target_orthophoto_manifest)
    target_anchor = finite_point(
        qc_report.get("stadiumCenterProjectedFeet"),
        "Stadium evaluation anchor",
    )
    extent = target_lock["extent"]
    if not (
        float(extent["xmin"]) <= target_anchor[0] <= float(extent["xmax"])
        and float(extent["ymin"]) <= target_anchor[1] <= float(extent["ymax"])
    ):
        raise ValueError("Stadium evaluation anchor is outside the target mosaic")

    queue_controls = {
        str(control["pid"]): control
        for control in queue.get("controls", [])
        if control.get("insideSuppliedOrthophoto") is True
    }
    qc_controls = {
        str(control["pointId"]): control
        for control in qc_report.get("eligibleVisualReviewControls", [])
    }
    if set(queue_controls) != set(qc_controls):
        raise ValueError("Review queue does not contain exactly the eligible QC controls")
    reviewed_controls = review.get("controls", [])
    reviewed_ids = [str(control.get("pid", "")) for control in reviewed_controls]
    if len(reviewed_ids) != len(set(reviewed_ids)):
        raise ValueError("Correspondence review contains duplicate point IDs")
    if set(reviewed_ids) != set(queue_controls):
        raise ValueError("Correspondence review must decide every covered queue control")

    accepted: list[dict[str, Any]] = []
    manifest_locks: dict[str, dict[str, Any]] = {}
    for decision in reviewed_controls:
        point_id = str(decision["pid"])
        queue_control = queue_controls[point_id]
        qc_control = qc_controls[point_id]
        accepted_value = decision.get("acceptedForRegistration")
        if not isinstance(accepted_value, bool):
            raise ValueError(f"Control {point_id} lacks an explicit decision")
        if accepted_value is False:
            if not str(decision.get("rejectionReason", "")).strip():
                raise ValueError(f"Rejected control {point_id} lacks a reason")
            continue
        observed = finite_point(
            decision.get("observedSourcePixelCoordinate"),
            f"Observed source pixel for {point_id}",
        )
        uncertainty = decision.get("pixelCenterUncertainty95Pixels")
        if (
            not isinstance(uncertainty, (int, float))
            or not math.isfinite(float(uncertainty))
            or float(uncertainty) <= 0
        ):
            raise ValueError(f"Accepted control {point_id} lacks positive uncertainty")
        crop = queue_control.get("cropPixelWindow", {})
        if not (
            float(crop["left"]) <= observed[0] < float(crop["right"])
            and float(crop["top"]) <= observed[1] < float(crop["bottom"])
        ):
            raise ValueError(f"Accepted control {point_id} is outside its review crop")
        feature_kind = str(decision.get("visibleFeatureKind", "")).strip()
        evidence_note = str(decision.get("evidenceNote", "")).strip()
        if not feature_kind or not evidence_note:
            raise ValueError(f"Accepted control {point_id} lacks visual evidence metadata")
        if queue_control.get("controlSourceEvidence", {}).get("reportRole") != (
            "SURVEYED IMAGERY PERMANENT QC POINT"
        ):
            raise ValueError(f"Accepted control {point_id} lacks the required QC role")
        survey = finite_point(
            queue_control.get("surveyCoordinateProjectedFeet"),
            f"Survey coordinate for {point_id}",
        )
        qc_coordinate = qc_control.get("projectedCoordinateUsSurveyFeet", {})
        expected_survey = np.asarray([
            float(qc_coordinate["easting"]),
            float(qc_coordinate["northing"]),
        ])
        if not np.array_equal(survey, expected_survey):
            raise ValueError(f"Review queue changed the survey coordinate for {point_id}")
        survey_accuracy = float(queue_control.get("horizontalAccuracy95Feet"))
        if not math.isclose(
            survey_accuracy,
            float(qc_control.get("horizontalAccuracy95Feet")),
            rel_tol=0,
            abs_tol=1e-12,
        ):
            raise ValueError(f"Review queue changed the survey accuracy for {point_id}")
        orthophoto = queue_control.get("orthophoto", {})
        lock_key = str(orthophoto.get("manifestPath", ""))
        if lock_key not in manifest_locks:
            manifest_locks[lock_key] = verify_crop_manifest(orthophoto)
        world_values = orthophoto.get("worldFileValues")
        if not isinstance(world_values, list) or len(world_values) != 6:
            raise ValueError(f"Accepted control {point_id} lacks a six-value world file")
        accepted.append({
            "pointId": point_id,
            "survey": survey,
            "observedPixel": observed,
            "pixelUncertainty95": float(uncertainty),
            "surveyAccuracy95Feet": survey_accuracy,
            "worldValues": [float(value) for value in world_values],
            "orthophoto": manifest_locks[lock_key],
            "visibleFeatureKind": feature_kind,
            "evidenceNote": evidence_note,
            "sourcePages": qc_control.get("sourcePages"),
        })

    accepted_count = len(accepted)
    survey_points = np.asarray([point["survey"] for point in accepted], dtype=float)
    observed_pixels = np.asarray(
        [point["observedPixel"] for point in accepted],
        dtype=float,
    )
    image_world_points = np.asarray([
        world_from_source_pixel(
            point["observedPixel"][0],
            point["observedPixel"][1],
            point["worldValues"],
        )
        for point in accepted
    ]) if accepted_count else np.empty((0, 2), dtype=float)
    pixel_uncertainties = np.asarray(
        [point["pixelUncertainty95"] for point in accepted],
        dtype=float,
    )
    survey_accuracies = np.asarray(
        [point["surveyAccuracy95Feet"] for point in accepted],
        dtype=float,
    )
    geometry = spatial_geometry(survey_points) if accepted_count else {
        "maximumPairwiseBaselineFeet": 0.0,
        "maximumTriangleAreaSquareFeet": 0.0,
    }
    inside_hull, hull_weights, hull_indices = point_inside_control_hull(
        target_anchor,
        survey_points,
    )

    rigid: dict[str, Any] | None = None
    similarity: dict[str, Any] | None = None
    leave_out = np.asarray([], dtype=float)
    monte_carlo: dict[str, Any] | None = None
    corrected_anchor: np.ndarray | None = None
    if accepted_count >= 2:
        rigid = fit_rigid(image_world_points, survey_points)
        similarity = fit_similarity(image_world_points, survey_points)
        leave_out = leave_one_out_errors(image_world_points, survey_points)
        corrected_anchor = transform_points(
            np.asarray([target_anchor]),
            rigid["rotation"],
            rigid["translation"],
        )[0]
        monte_carlo = monte_carlo_rigid_uncertainty(
            observed_pixels,
            survey_points,
            pixel_uncertainties,
            survey_accuracies,
            [point["worldValues"] for point in accepted],
            target_anchor,
            args.monte_carlo_samples,
            args.seed,
        )

    maximum_pixel_size = max(
        (
            max(
                math.hypot(point["worldValues"][0], point["worldValues"][1]),
                math.hypot(point["worldValues"][2], point["worldValues"][3]),
            )
            for point in accepted
        ),
        default=0.0,
    )
    visual_uncertainty_95 = (
        float(np.max(pixel_uncertainties)) * maximum_pixel_size
        if accepted_count else None
    )
    maximum_survey_accuracy_95 = (
        float(np.max(survey_accuracies)) if accepted_count else None
    )
    residual_95 = percentile_95(rigid["residuals"]) if rigid is not None else None
    residual_maximum = float(np.max(rigid["residuals"])) if rigid is not None else None
    leave_out_95 = percentile_95(leave_out) if len(leave_out) else None
    leave_out_maximum = float(np.max(leave_out)) if len(leave_out) else None
    scale_drift = (
        abs(float(similarity["scale"]) - 1.0)
        * geometry["maximumPairwiseBaselineFeet"]
        if similarity is not None else None
    )
    orientation_uncertainty = (
        float(monte_carlo["orientationUncertainty95Degrees"])
        if monte_carlo is not None else None
    )
    anchor_uncertainty = (
        float(monte_carlo["anchorHorizontalUncertainty95Feet"])
        if monte_carlo is not None else None
    )
    combined_horizontal_95 = None
    if (
        maximum_survey_accuracy_95 is not None
        and visual_uncertainty_95 is not None
        and residual_95 is not None
        and leave_out_maximum is not None
        and anchor_uncertainty is not None
    ):
        combined_horizontal_95 = (
            maximum_survey_accuracy_95
            + visual_uncertainty_95
            + max(residual_95, leave_out_maximum, anchor_uncertainty)
        )

    numeric_blockers: list[str] = []
    if accepted_count < MINIMUM_ACCEPTED_CONTROLS:
        numeric_blockers.append("FEWER_THAN_THREE_ACCEPTED_SURVEY_QC_CONTROLS")
    if geometry["maximumPairwiseBaselineFeet"] < MINIMUM_BASELINE_FEET:
        numeric_blockers.append("SURVEY_QC_CONTROL_BASELINE_BELOW_100_FEET")
    if geometry["maximumTriangleAreaSquareFeet"] < MINIMUM_TRIANGLE_AREA_SQUARE_FEET:
        numeric_blockers.append("SURVEY_QC_CONTROLS_NOT_SPATIALLY_NONCOLLINEAR")
    if not inside_hull:
        numeric_blockers.append("STADIUM_TARGET_OUTSIDE_ACCEPTED_CONTROL_HULL")
    if residual_95 is None or residual_95 > MAXIMUM_RESIDUAL_95_FEET:
        numeric_blockers.append("ORTHOPHOTO_RIGID_FIT_RESIDUAL_95_EXCEEDS_ONE_FOOT")
    if leave_out_maximum is None or leave_out_maximum > MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET:
        numeric_blockers.append("ORTHOPHOTO_LEAVE_ONE_OUT_ERROR_EXCEEDS_ONE_FOOT")
    if scale_drift is None or scale_drift > MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET:
        numeric_blockers.append("ORTHOPHOTO_SCALE_DRIFT_ACROSS_BASELINE_EXCEEDS_ONE_FOOT")
    if (
        orientation_uncertainty is None
        or orientation_uncertainty > MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES
    ):
        numeric_blockers.append(
            "ORTHOPHOTO_ORIENTATION_UNCERTAINTY_95_EXCEEDS_ONE_DEGREE"
        )
    if (
        combined_horizontal_95 is None
        or combined_horizontal_95 > MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET
    ):
        numeric_blockers.append(
            "ORTHOPHOTO_COMBINED_HORIZONTAL_UNCERTAINTY_95_EXCEEDS_ONE_FOOT"
        )
    numeric_accepted = len(numeric_blockers) == 0
    provenance_blockers: list[str] = []
    if not role_separated:
        provenance_blockers.append("QC_ROLE_NOT_SEPARATED_FROM_ADJUSTMENT_CONTROL")
    if not independence_explicit:
        provenance_blockers.append(
            "QC_POINT_EXCLUSION_FROM_ORTHOPHOTO_ADJUSTMENT_NOT_EXPLICIT"
        )
    registration_blockers = [*numeric_blockers, *provenance_blockers]
    registration_accepted = len(registration_blockers) == 0

    point_results: list[dict[str, Any]] = []
    for index, point in enumerate(accepted):
        point_results.append({
            "pointId": point["pointId"],
            "surveyCoordinateProjectedFeet": point["survey"].tolist(),
            "observedSourcePixelCoordinate": point["observedPixel"].tolist(),
            "observedNominalWorldCoordinateFeet": image_world_points[index].tolist(),
            "pixelCenterUncertainty95Pixels": point["pixelUncertainty95"],
            "surveyHorizontalAccuracy95Feet": point["surveyAccuracy95Feet"],
            "sourcePages": point["sourcePages"],
            "orthophoto": point["orthophoto"],
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
        "stadiumId": "marlins",
        "inputs": {
            "reviewQueuePath": str(args.review_queue.resolve()),
            "reviewQueueSha256": queue_hash,
            "reviewQueueArtifactVersion": queue.get("artifactVersion"),
            "correspondenceReviewPath": str(args.correspondence_review.resolve()),
            "correspondenceReviewSha256": hashlib.sha256(review_bytes).hexdigest(),
            "qcControlReportPath": str(args.qc_control_report.resolve()),
            "qcControlReportSha256": qc_hash,
            "qcControlReportArtifactVersion": qc_report.get("artifactVersion"),
            "signedSurveyReport": {
                "path": str(report_path),
                "sha256": report_hash,
                "title": report_source.get("reportTitle"),
                "reportDate": report_source.get("reportDate"),
            },
            "targetOrthophoto": target_lock,
            "reviewProtocol": {
                "reviewerId": reviewer_id,
                "completedAtUtc": completed_at_utc,
                "method": method,
            },
        },
        "controlProvenance": {
            "reportRole": role_semantics.get("qcHeading"),
            "reportSeparatesQcPointsFromTemporaryAndPermanentControlPoints": (
                role_separated
            ),
            "explicitStatementQcPointsWereExcludedFromOrthophotoAdjustment": (
                independence_explicit
            ),
            "producerIndependentCheckpointRoleEstablished": independence_explicit,
            "blockers": provenance_blockers,
        },
        "controlGeometry": {
            "acceptedControlCount": accepted_count,
            **geometry,
            "stadiumTargetInsideAcceptedControlHull": inside_hull,
            "containingTrianglePointIndices": hull_indices,
            "containingTrianglePointIds": (
                [accepted[index]["pointId"] for index in hull_indices]
                if hull_indices is not None else None
            ),
            "containingTriangleBarycentricWeights": hull_weights,
            "maximumControlDistanceFromStadiumFeet": (
                float(np.max(np.linalg.norm(survey_points - target_anchor, axis=1)))
                if accepted_count else None
            ),
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
            "maximumResidualFeet": residual_maximum,
            "stadiumAnchorBeforeCorrectionFeet": target_anchor.tolist(),
            "stadiumAnchorAfterCorrectionFeet": (
                corrected_anchor.tolist() if corrected_anchor is not None else None
            ),
            "stadiumAnchorCorrectionVectorFeet": (
                (corrected_anchor - target_anchor).tolist()
                if corrected_anchor is not None else None
            ),
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
            "maximumSurveySourceHorizontalAccuracy95Feet": (
                maximum_survey_accuracy_95
            ),
            "maximumVisualCorrespondenceUncertainty95Feet": visual_uncertainty_95,
            "monteCarlo": monte_carlo,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal_95,
            "combinationMethod": (
                "conservative linear sum of maximum survey accuracy, maximum visual "
                "centering uncertainty, and the largest fit, leave-one-out, or "
                "stadium-anchor Monte Carlo term"
            ),
        },
        "gates": {
            "minimumAcceptedControls": MINIMUM_ACCEPTED_CONTROLS,
            "minimumPairwiseBaselineFeet": MINIMUM_BASELINE_FEET,
            "minimumTriangleAreaSquareFeet": MINIMUM_TRIANGLE_AREA_SQUARE_FEET,
            "stadiumMustBeInsideAcceptedControlHull": True,
            "maximumHorizontalUncertainty95Feet": MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET,
            "maximumResidual95Feet": MAXIMUM_RESIDUAL_95_FEET,
            "maximumLeaveOneOutErrorFeet": MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET,
            "maximumOrientationUncertainty95Degrees": (
                MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES
            ),
            "maximumScaleDriftAcrossBaselineFeet": (
                MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET
            ),
            "requiresExplicitExclusionOfQcPointsFromOrthophotoAdjustment": True,
        },
        "numericRegistrationAcceptance": {
            "accepted": numeric_accepted,
            "blockers": numeric_blockers,
        },
        "registrationAcceptance": {
            "accepted": registration_accepted,
            "blockers": registration_blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "survey-qc-orthophoto-registration-audit",
        "artifactVersion": stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesConditionalHorizontalFit": numeric_accepted,
            "establishesPublicationEligibleHorizontalRegistration": (
                registration_accepted
            ),
            "establishesMeasuredRowElevations": False,
            "establishesCurrentObstructionGeometry": False,
            "establishesIndependentShadowValidation": False,
            "note": (
                "The numeric fit is conditional on the surveyed QC points being "
                "independent of the orthophoto adjustment. The supplied report does "
                "not explicitly establish that independence."
            ),
        },
        "publication": {
            "eligibleForExactRowShade": False,
            "blockers": [
                *registration_blockers,
                "REGISTRATION_ARTIFACT_ONLY",
                "MEASURED_ROW_ELEVATIONS_NOT_EVALUATED",
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
        "numericRegistrationAcceptance": artifact["numericRegistrationAcceptance"],
        "registrationAcceptance": artifact["registrationAcceptance"],
        "uncertainty": artifact["uncertainty"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

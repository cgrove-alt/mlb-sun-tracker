#!/usr/bin/env python3
"""Audit a DRCOG orthophoto mosaic against reviewed NOAA NGS controls.

The audit uses only visually accepted monument centers and checksum-locked
official inputs. It fits a unit-scale rigid correction, keeps scale as a
diagnostic only, and evaluates uncertainty at the stadium target point. This
is a horizontal registration artifact, not row or shade validation.
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


ANALYSIS_VERSION = "ngs-drcog-orthophoto-registration-audit-v1"
MINIMUM_ACCEPTED_CONTROLS = 3
MINIMUM_BASELINE_FEET = 100.0
MINIMUM_TRIANGLE_AREA_SQUARE_FEET = 100.0
MAXIMUM_HORIZONTAL_UNCERTAINTY_95_FEET = 1.0
MAXIMUM_RESIDUAL_95_FEET = 1.0
MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET = 1.0
MAXIMUM_ORIENTATION_UNCERTAINTY_95_DEGREES = 1.0
MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET = 1.0


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
    return f"sha256:{hashlib.sha256(serialized.encode('utf-8')).hexdigest()}"


def point_inside_control_hull(
    point: np.ndarray,
    controls: np.ndarray,
) -> tuple[bool, list[float] | None, list[int] | None]:
    if len(controls) < 3:
        return False, None, None
    target = np.asarray(point, dtype=float)
    for indices in itertools.combinations(range(len(controls)), 3):
        triangle = controls[list(indices)]
        matrix = np.vstack((triangle.T, np.ones(3, dtype=float)))
        if abs(float(np.linalg.det(matrix))) <= 1e-9:
            continue
        weights = np.linalg.solve(matrix, np.append(target, 1.0))
        if np.all(weights >= -1e-12) and np.all(weights <= 1.0 + 1e-12):
            return True, [float(value) for value in weights], list(indices)
    return False, None, None


def verify_orthophoto_manifest(
    lock: dict[str, Any],
    expected_project: str,
) -> dict[str, Any]:
    path = Path(str(lock.get("manifestPath", "")))
    expected_hash = str(lock.get("manifestSha256", ""))
    if not path.is_file() or len(expected_hash) != 64:
        raise ValueError("Control orthophoto lock lacks a valid manifest file or hash")
    raw = path.read_bytes()
    actual_hash = hashlib.sha256(raw).hexdigest()
    if actual_hash != expected_hash:
        raise ValueError(f"Control orthophoto manifest hash mismatch: {path}")
    manifest = json.loads(raw)
    if manifest.get("artifactKind") != "drcog-orthophoto-tile-acquisition":
        raise ValueError(f"Control orthophoto has the wrong artifact kind: {path}")
    if manifest.get("artifactVersion") != lock.get("artifactVersion"):
        raise ValueError(f"Control orthophoto artifact version mismatch: {path}")
    project = str(manifest.get("record", {}).get("attributes", {}).get("project", ""))
    if project != expected_project:
        raise ValueError(f"Control orthophoto is not from project {expected_project}: {path}")
    image_path = Path(str(manifest.get("localFiles", {}).get("orthophoto", "")))
    expected_image_hash = str(manifest.get("orthophoto", {}).get("sha256", ""))
    if not image_path.is_file() or sha256_file(image_path) != expected_image_hash:
        raise ValueError(f"Control orthophoto image hash mismatch: {image_path}")
    return {
        "manifestPath": str(path.resolve()),
        "manifestSha256": actual_hash,
        "artifactVersion": manifest.get("artifactVersion"),
        "project": project,
        "tile": manifest.get("record", {}).get("attributes", {}).get("tile"),
        "imagePath": str(image_path.resolve()),
        "imageSha256": expected_image_hash,
    }


def verify_target_orthophoto(path: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = path.read_bytes()
    manifest = json.loads(raw)
    if manifest.get("artifactKind") != "drcog-orthophoto-tile-acquisition":
        raise ValueError("Target orthophoto manifest has the wrong artifact kind")
    if manifest.get("stadiumId") != "rockies":
        raise ValueError("Target orthophoto is not the Rockies stadium tile")
    image_path = Path(str(manifest.get("localFiles", {}).get("orthophoto", "")))
    expected_image_hash = str(manifest.get("orthophoto", {}).get("sha256", ""))
    if not image_path.is_file() or sha256_file(image_path) != expected_image_hash:
        raise ValueError("Target orthophoto image hash mismatch")
    anchor = finite_point(
        manifest.get("projectedStadiumPoint"),
        "Target stadium projected point",
    )
    return manifest, {
        "path": str(path.resolve()),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "artifactVersion": manifest.get("artifactVersion"),
        "project": manifest.get("record", {}).get("attributes", {}).get("project"),
        "tile": manifest.get("record", {}).get("attributes", {}).get("tile"),
        "imagePath": str(image_path.resolve()),
        "imageSha256": expected_image_hash,
        "stadiumAnchorProjectedFeet": anchor.tolist(),
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
        world_from_source_pixel(point[0], point[1], world_values)
        for point, world_values in zip(pixels, world_values_by_control)
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
            world_from_source_pixel(point[0], point[1], world_values)
            for point, world_values in zip(sampled_pixels, world_values_by_control)
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
        "includesIndividualNgsSurveyAccuracy": True,
        "includesIndividualVisualPixelUncertainty": True,
        "orientationUncertainty95Degrees": percentile_95(angle_errors),
        "anchorHorizontalUncertainty95Feet": percentile_95(anchor_errors),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-queue", type=Path, required=True)
    parser.add_argument("--correspondence-review", type=Path, required=True)
    parser.add_argument("--target-orthophoto-manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--monte-carlo-samples", type=int, default=50_000)
    parser.add_argument("--seed", type=int, default=20260810)
    args = parser.parse_args()

    queue_bytes = args.review_queue.read_bytes()
    queue = json.loads(queue_bytes)
    if queue.get("artifactKind") != "ngs-orthophoto-control-review-queue":
        raise ValueError("Review queue has the wrong artifact kind")
    review_bytes = args.correspondence_review.read_bytes()
    review = json.loads(review_bytes)
    if review.get("artifactKind") != "ngs-orthophoto-correspondence-review":
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

    target_manifest, target_lock = verify_target_orthophoto(
        args.target_orthophoto_manifest
    )
    expected_project = str(target_lock.get("project", ""))
    if expected_project != "2022":
        raise ValueError("Target orthophoto is not from the 2022 DRCOG project")
    target_anchor = np.asarray(target_lock["stadiumAnchorProjectedFeet"], dtype=float)

    queue_controls = {
        str(control["pid"]): control
        for control in queue.get("controls", [])
        if control.get("insideSuppliedOrthophoto") is True
    }
    reviewed_controls = review.get("controls", [])
    reviewed_pids = [str(control.get("pid", "")) for control in reviewed_controls]
    if len(reviewed_pids) != len(set(reviewed_pids)):
        raise ValueError("Correspondence review contains duplicate PIDs")
    if set(reviewed_pids) != set(queue_controls):
        raise ValueError("Correspondence review must decide every covered queue control")

    accepted: list[dict[str, Any]] = []
    orthophoto_locks: dict[str, dict[str, Any]] = {}
    for decision in reviewed_controls:
        pid = str(decision["pid"])
        queue_control = queue_controls[pid]
        accepted_value = decision.get("acceptedForRegistration")
        if not isinstance(accepted_value, bool):
            raise ValueError(f"Control {pid} lacks an explicit decision")
        if accepted_value is False:
            if not str(decision.get("rejectionReason", "")).strip():
                raise ValueError(f"Rejected control {pid} lacks a reason")
            continue
        observed = finite_point(
            decision.get("observedSourcePixelCoordinate"),
            f"Observed source pixel for {pid}",
        )
        uncertainty = decision.get("pixelCenterUncertainty95Pixels")
        if (
            not isinstance(uncertainty, (int, float))
            or not math.isfinite(float(uncertainty))
            or float(uncertainty) <= 0
        ):
            raise ValueError(f"Accepted control {pid} lacks positive pixel uncertainty")
        crop = queue_control.get("cropPixelWindow", {})
        if not (
            float(crop["left"]) <= observed[0] < float(crop["right"])
            and float(crop["top"]) <= observed[1] < float(crop["bottom"])
        ):
            raise ValueError(f"Accepted control {pid} is outside its review crop")
        feature_kind = str(decision.get("visibleFeatureKind", "")).strip()
        evidence_note = str(decision.get("evidenceNote", "")).strip()
        if not feature_kind or not evidence_note:
            raise ValueError(f"Accepted control {pid} lacks visual evidence metadata")
        survey_accuracy = queue_control.get("horizontalAccuracy95Feet")
        if (
            not isinstance(survey_accuracy, (int, float))
            or not math.isfinite(float(survey_accuracy))
            or float(survey_accuracy) <= 0
        ):
            raise ValueError(f"Accepted control {pid} lacks NGS 95-percent accuracy")
        datasheet = queue_control.get("datasheet", {})
        datasheet_path = Path(str(datasheet.get("localPath", "")))
        if (
            not datasheet_path.is_file()
            or sha256_file(datasheet_path) != datasheet.get("sha256")
            or not str(datasheet.get("url", "")).startswith("https://www.ngs.noaa.gov/")
        ):
            raise ValueError(f"Accepted control {pid} lacks valid official NGS evidence")
        orthophoto = queue_control.get("orthophoto", {})
        lock_key = str(orthophoto.get("manifestPath", ""))
        if lock_key not in orthophoto_locks:
            orthophoto_locks[lock_key] = verify_orthophoto_manifest(
                orthophoto,
                expected_project,
            )
        world_values = orthophoto.get("worldFileValues")
        if not isinstance(world_values, list) or len(world_values) != 6:
            raise ValueError(f"Accepted control {pid} lacks a six-value world file")
        accepted.append({
            "pid": pid,
            "survey": finite_point(
                queue_control.get("surveyCoordinateProjectedFeet"),
                f"Survey coordinate for {pid}",
            ),
            "observedPixel": observed,
            "pixelUncertainty95": float(uncertainty),
            "surveyAccuracy95Feet": float(survey_accuracy),
            "worldValues": [float(value) for value in world_values],
            "orthophoto": orthophoto_locks[lock_key],
            "datasheet": {
                "url": datasheet["url"],
                "localPath": str(datasheet_path.resolve()),
                "sha256": datasheet["sha256"],
            },
            "lastRecovered": queue_control.get("lastRecovered"),
            "visibleFeatureKind": feature_kind,
            "evidenceNote": evidence_note,
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
    residual_maximum = (
        float(np.max(rigid["residuals"])) if rigid is not None else None
    )
    leave_out_95 = percentile_95(leave_out) if len(leave_out) else None
    leave_out_maximum = float(np.max(leave_out)) if len(leave_out) else None
    scale_drift = (
        abs(float(similarity["scale"]) - 1.0) * geometry["maximumPairwiseBaselineFeet"]
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

    blockers: list[str] = []
    if accepted_count < MINIMUM_ACCEPTED_CONTROLS:
        blockers.append("FEWER_THAN_THREE_ACCEPTED_NGS_CONTROLS")
    if geometry["maximumPairwiseBaselineFeet"] < MINIMUM_BASELINE_FEET:
        blockers.append("NGS_CONTROL_BASELINE_BELOW_100_FEET")
    if geometry["maximumTriangleAreaSquareFeet"] < MINIMUM_TRIANGLE_AREA_SQUARE_FEET:
        blockers.append("NGS_CONTROLS_NOT_SPATIALLY_NONCOLLINEAR")
    if not inside_hull:
        blockers.append("STADIUM_TARGET_OUTSIDE_ACCEPTED_CONTROL_HULL")
    if residual_95 is None or residual_95 > MAXIMUM_RESIDUAL_95_FEET:
        blockers.append("ORTHOPHOTO_RIGID_FIT_RESIDUAL_95_EXCEEDS_ONE_FOOT")
    if leave_out_maximum is None or leave_out_maximum > MAXIMUM_LEAVE_ONE_OUT_ERROR_FEET:
        blockers.append("ORTHOPHOTO_LEAVE_ONE_OUT_ERROR_EXCEEDS_ONE_FOOT")
    if scale_drift is None or scale_drift > MAXIMUM_SCALE_DRIFT_ACROSS_BASELINE_FEET:
        blockers.append("ORTHOPHOTO_SCALE_DRIFT_ACROSS_BASELINE_EXCEEDS_ONE_FOOT")
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
            "pid": point["pid"],
            "surveyCoordinateProjectedFeet": point["survey"].tolist(),
            "observedSourcePixelCoordinate": point["observedPixel"].tolist(),
            "observedNominalWorldCoordinateFeet": image_world_points[index].tolist(),
            "pixelCenterUncertainty95Pixels": point["pixelUncertainty95"],
            "ngsHorizontalAccuracy95Feet": point["surveyAccuracy95Feet"],
            "lastRecovered": point["lastRecovered"],
            "orthophoto": point["orthophoto"],
            "datasheet": point["datasheet"],
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
        "stadiumId": "rockies",
        "inputs": {
            "reviewQueuePath": str(args.review_queue.resolve()),
            "reviewQueueSha256": queue_hash,
            "reviewQueueArtifactVersion": queue.get("artifactVersion"),
            "correspondenceReviewPath": str(args.correspondence_review.resolve()),
            "correspondenceReviewSha256": hashlib.sha256(review_bytes).hexdigest(),
            "targetOrthophoto": target_lock,
            "reviewProtocol": {
                "reviewerId": reviewer_id,
                "completedAtUtc": completed_at_utc,
                "method": method,
            },
        },
        "controlGeometry": {
            "acceptedControlCount": accepted_count,
            **geometry,
            "stadiumTargetInsideAcceptedControlHull": inside_hull,
            "containingTrianglePointIndices": hull_indices,
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
            "maximumNgsSourceHorizontalAccuracy95Feet": maximum_survey_accuracy_95,
            "maximumVisualCorrespondenceUncertainty95Feet": visual_uncertainty_95,
            "monteCarlo": monte_carlo,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal_95,
            "combinationMethod": (
                "conservative linear sum of maximum NGS accuracy, maximum visual "
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
        },
        "registrationAcceptance": {
            "accepted": registration_accepted,
            "blockers": blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ngs-drcog-orthophoto-registration-audit",
        "artifactVersion": stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesCorrectedOrthophotoTranslationAndRotation": registration_accepted,
            "establishesMeasuredRowElevations": False,
            "establishesCurrentObstructionGeometry": False,
            "establishesIndependentShadowValidation": False,
            "note": (
                "This artifact establishes only the corrected horizontal DRCOG "
                "orthophoto frame at Coors Field. It cannot establish row elevations, "
                "overhang undersides, current roof state, or shade accuracy."
            ),
        },
        "publication": {
            "eligibleForExactRowShade": False,
            "blockers": [
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
        "registrationAcceptance": artifact["registrationAcceptance"],
        "uncertainty": artifact["uncertainty"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

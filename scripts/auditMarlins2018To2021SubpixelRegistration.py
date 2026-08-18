#!/usr/bin/env python3
"""Audit a fresh subpixel 2018 to 2021 Marlins LiDAR registration."""

from __future__ import annotations

import copy
import hashlib
import json
import math
from pathlib import Path
from typing import Any
import argparse

import numpy as np

from auditNoaa2021HardStructureRegistration import (
    FEET_PER_METRE,
    LOCAL_PIVOT_UTM_METRES,
    artifact_version,
    fit_rigid,
    rotation_degrees,
    summary,
    transform_points,
    validate_input_record,
)


ANALYSIS_VERSION = "marlins-2018-to-2021-subpixel-independent-registration-v1"
MINIMUM_TRAINING_CONTROL_COUNT = 6
MINIMUM_HOLDOUT_CONTROL_COUNT = 6
MINIMUM_FRESH_DISTANCE_METRES = 12.0
MINIMUM_HOLDOUT_SEPARATION_METRES = 5.0


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def minimum_pair_separation(records: list[dict[str, Any]]) -> float:
    distances = [
        float(np.linalg.norm(
            np.asarray(first["referenceUtmMetres"])
            - np.asarray(second["referenceUtmMetres"])
        ))
        for first_index, first in enumerate(records)
        for second in records[first_index + 1:]
    ]
    if not distances:
        raise ValueError("Cannot compute separation for fewer than two controls")
    return min(distances)


def minimum_distance_to_prior_queue(
    selected: list[dict[str, Any]],
    prior_candidates: list[dict[str, Any]],
) -> float:
    distances = [
        float(np.linalg.norm(
            np.asarray(candidate["referenceUtmMetres"])
            - np.asarray(prior["reference"]["utmMetres"])
        ))
        for candidate in selected
        for prior in prior_candidates
    ]
    if not distances:
        raise ValueError("Freshness comparison has no controls")
    return min(distances)


def validate_consensus(
    consensus: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], dict[str, Any]]:
    if consensus.get("artifactKind") != (
        "marlins-2018-2021-subpixel-control-consensus-audit"
    ):
        raise ValueError("Input has the wrong consensus kind")
    if consensus.get("reviewStatus") != (
        "locked-2018-2021-subpixel-hard-structure-controls"
    ):
        raise ValueError("Subpixel consensus is not locked")
    base = validate_input_record(consensus["inputs"]["baseControls"])
    queue = validate_input_record(consensus["inputs"]["reviewQueue"])
    validate_input_record(consensus["inputs"]["reviewSheet"])
    reference_review = validate_input_record(
        consensus["inputs"]["referenceSurveyReview"]
    )
    comparison_review = validate_input_record(
        consensus["inputs"]["comparisonSurveyReview"]
    )
    for refinement in consensus["inputs"]["refinements"]:
        validate_input_record(refinement)
    if any(value is None for value in (
        base,
        queue,
        reference_review,
        comparison_review,
    )):
        raise ValueError("Consensus lineage JSON is unavailable")
    if base.get("reviewStatus") != (
        "reviewed-2018-2021-subpixel-hard-structure-lidar-controls"
    ):
        raise ValueError("Consensus base controls have the wrong review status")
    assessment = base["assessment"]
    if assessment["localizationInspectedBeforeLock"]:
        raise ValueError("Control selection inspected localization before lock")
    if assessment["residualAgainstAnyFittedTransformInspected"]:
        raise ValueError("Control selection inspected fitted-transform residuals")
    if not assessment["everyQueueCandidateReviewedExactlyOnce"]:
        raise ValueError("Manual review did not cover every queue candidate")
    if not assessment["everyAcceptedControlFreshAgainstPriorQueue"]:
        raise ValueError("Manual review does not assert fresh evidence")
    return base, queue, reference_review, comparison_review


def build_audit(consensus_path: Path) -> dict[str, Any]:
    consensus, consensus_sha256 = locked_json(consensus_path)
    base, queue, reference_review, comparison_review = validate_consensus(consensus)
    if queue["inputs"]["referenceLidar"]["acquiredOn"] != "2018-06-05":
        raise ValueError("Review queue has the wrong reference epoch")
    if queue["inputs"]["comparisonLidar"]["acquiredOn"] != "2021-04-10":
        raise ValueError("Review queue has the wrong comparison epoch")
    parameters = queue["parameters"]
    if not (
        parameters["referenceHorizontalEpsg"] == 6346
        and parameters["comparisonHorizontalEpsg"] == 6346
        and parameters["targetHorizontalEpsg"] == 6346
        and parameters["referenceVerticalUnitMetres"] == 1.0
        and parameters["comparisonVerticalUnitMetres"] == 1.0
        and parameters["referenceFeatureSupportMode"] == "classification-6"
        and parameters["comparisonFeatureSupportMode"] == "classification-6"
    ):
        raise ValueError("Review queue coordinate, unit, or support settings are wrong")
    validate_input_record(queue["inputs"]["referenceLidar"])
    validate_input_record(queue["inputs"]["comparisonLidar"])
    prior_queue = validate_input_record(base["inputs"]["priorReviewQueue"])
    if prior_queue is None:
        raise ValueError("Prior review queue JSON is unavailable")
    if not reference_review["conservativeInterpretation"][
        "passesOneFootHorizontalThreshold"
    ]:
        raise ValueError("Reference survey does not pass the horizontal gate")
    if not comparison_review["conservativeInterpretation"][
        "passesOneFootVerticalThreshold"
    ]:
        raise ValueError("Comparison survey does not pass the vertical gate")

    queue_by_id = {
        candidate["candidateId"]: candidate for candidate in queue["candidates"]
    }
    base_by_id = {
        control["candidateId"]: control
        for control in base["controls"]
        if control.get("accepted")
    }
    all_base_controls = [
        {
            "candidateId": candidate_id,
            "referenceUtmMetres": queue_by_id[candidate_id]["reference"]["utmMetres"],
        }
        for candidate_id in base_by_id
    ]
    fresh_distance = minimum_distance_to_prior_queue(
        all_base_controls,
        prior_queue["candidates"],
    )
    if fresh_distance <= MINIMUM_FRESH_DISTANCE_METRES:
        raise ValueError("A locked control is not spatially fresh against the prior queue")

    records: list[dict[str, Any]] = []
    for control in consensus["controls"]:
        record = copy.deepcopy(control)
        candidate_id = record["candidateId"]
        if candidate_id not in base_by_id:
            raise ValueError("Consensus contains a control absent from the locked review")
        if record["role"] != base_by_id[candidate_id]["role"]:
            raise ValueError("Consensus changed a locked control role")
        if any(key.startswith("holdoutResidual") for key in record):
            raise ValueError("Consensus control already contains a scored residual")
        records.append(record)
    if len({record["candidateId"] for record in records}) != len(records):
        raise ValueError("Consensus contains duplicate control identifiers")
    training = [record for record in records if record["role"] == "training"]
    holdouts = [record for record in records if record["role"] == "holdout"]
    if len(training) < MINIMUM_TRAINING_CONTROL_COUNT:
        raise ValueError("Fewer than six training controls passed localization")
    if len(holdouts) < MINIMUM_HOLDOUT_CONTROL_COUNT:
        raise ValueError("Fewer than six holdout controls passed localization")
    holdout_separation = minimum_pair_separation(holdouts)
    if holdout_separation < MINIMUM_HOLDOUT_SEPARATION_METRES:
        raise ValueError("Final holdouts are not spatially independent")

    training_source = np.asarray([
        record["comparisonUtmMetres"] for record in training
    ])
    training_target = np.asarray([
        record["referenceUtmMetres"] for record in training
    ])
    rotation, translation = fit_rigid(training_source, training_target)
    training_predicted = transform_points(training_source, rotation, translation)
    training_residuals = np.linalg.norm(training_predicted - training_target, axis=1)
    holdout_source = np.asarray([
        record["comparisonUtmMetres"] for record in holdouts
    ])
    holdout_target = np.asarray([
        record["referenceUtmMetres"] for record in holdouts
    ])
    holdout_predicted = transform_points(holdout_source, rotation, translation)
    holdout_vectors = holdout_predicted - holdout_target
    holdout_residuals = np.linalg.norm(holdout_vectors, axis=1)
    for record, predicted, vector, residual in zip(
        holdouts,
        holdout_predicted,
        holdout_vectors,
        holdout_residuals,
    ):
        record["predictedReferenceUtmMetres"] = predicted.tolist()
        record["holdoutResidualVectorMetres"] = vector.tolist()
        record["holdoutResidualMetres"] = float(residual)
        record["holdoutResidualFeet"] = float(residual * FEET_PER_METRE)

    leave_one_out_rotations: list[float] = []
    for excluded in range(len(training)):
        keep = np.arange(len(training)) != excluded
        candidate_rotation, _ = fit_rigid(
            training_source[keep],
            training_target[keep],
        )
        leave_one_out_rotations.append(rotation_degrees(candidate_rotation))
    locked_rotation_degrees = rotation_degrees(rotation)
    rotation_parameter_envelope = max(
        abs(value - locked_rotation_degrees) for value in leave_one_out_rotations
    )
    training_differences = (
        training_target[:, None, :] - training_target[None, :, :]
    )
    training_span_metres = float(
        np.max(np.linalg.norm(training_differences, axis=2))
    )
    local_translation = (
        rotation @ LOCAL_PIVOT_UTM_METRES
        + translation
        - LOCAL_PIVOT_UTM_METRES
    )

    reference_horizontal95_feet = float(
        reference_review["conservativeInterpretation"]["horizontalAccuracy95Feet"]
    )
    comparison_vertical95_feet = float(
        comparison_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    observed_holdout_envelope95_feet = float(
        np.max(holdout_residuals) * FEET_PER_METRE
    )
    localization_envelope95_feet = float(
        max(record["localizationEnvelopeMetres"] for record in records)
        * FEET_PER_METRE
    )
    registration_envelope95_feet = max(
        observed_holdout_envelope95_feet,
        localization_envelope95_feet,
    )
    combined_horizontal95_feet = math.hypot(
        reference_horizontal95_feet,
        registration_envelope95_feet,
    )
    holdout_orientation_envelope = math.degrees(
        math.atan2(float(np.max(holdout_residuals)), training_span_metres)
    )
    reference_orientation_envelope = math.degrees(
        math.atan2(
            reference_horizontal95_feet / FEET_PER_METRE,
            training_span_metres,
        )
    )
    combined_orientation95_degrees = math.sqrt(
        rotation_parameter_envelope ** 2
        + holdout_orientation_envelope ** 2
        + reference_orientation_envelope ** 2
    )
    accepted = bool(
        combined_horizontal95_feet <= 1.0
        and comparison_vertical95_feet <= 1.0
        and combined_orientation95_degrees <= 1.0
    )
    blockers: list[str] = []
    if combined_horizontal95_feet > 1.0:
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if comparison_vertical95_feet > 1.0:
        blockers.append("VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if combined_orientation95_degrees > 1.0:
        blockers.append("ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")

    stable = {
        "consensusSha256": consensus_sha256,
        "rotation": rotation.tolist(),
        "translationMetres": translation.tolist(),
        "trainingResidualsMetres": training_residuals.tolist(),
        "holdoutRecords": holdouts,
        "combinedHorizontal95Feet": combined_horizontal95_feet,
        "combinedOrientation95Degrees": combined_orientation95_degrees,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "hard-structure-registered-2021-lidar-subpixel-local-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "consensus": {
                "path": str(consensus_path),
                "sha256": consensus_sha256,
                "artifactVersion": consensus["artifactVersion"],
            },
            "reviewQueue": consensus["inputs"]["reviewQueue"],
            "referenceSurveyReview": consensus["inputs"]["referenceSurveyReview"],
            "comparisonSurveyReview": consensus["inputs"]["comparisonSurveyReview"],
            "priorReviewQueue": base["inputs"]["priorReviewQueue"],
        },
        "controlDesign": {
            "baseReviewedControlCount": len(base_by_id),
            "localizedControlCount": len(records),
            "trainingControlCount": len(training),
            "holdoutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "minimumHoldoutSeparationMetres": holdout_separation,
            "minimumDistanceFromEveryPriorQueueCandidateMetres": fresh_distance,
            "fitUsesHoldouts": False,
            "holdoutsSelectedBeforeTheirLocalization": True,
            "holdoutResidualsInspectedBeforeSelection": False,
        },
        "lockedTransform": {
            "operation": "map 2021 comparison coordinates into the 2018 absolute UTM frame",
            "rotationMatrix": rotation.tolist(),
            "rotationDegrees": locked_rotation_degrees,
            "translationMetres": translation.tolist(),
            "localPivotUtmMetres": LOCAL_PIVOT_UTM_METRES.tolist(),
            "localTranslationAtPivotMetres": local_translation.tolist(),
            "determinant": float(np.linalg.det(rotation)),
        },
        "trainingValidation": {
            "residualMetres": summary(training_residuals),
            "residualFeet": summary(training_residuals * FEET_PER_METRE),
            "records": training,
        },
        "holdoutValidation": {
            "residualMetres": summary(holdout_residuals),
            "residualFeet": summary(holdout_residuals * FEET_PER_METRE),
            "observedMaximumHoldoutResidualFeet": observed_holdout_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": localization_envelope95_feet,
            "registrationEnvelope95Feet": registration_envelope95_feet,
            "records": holdouts,
        },
        "uncertainty": {
            "referenceHorizontalAccuracy95Feet": reference_horizontal95_feet,
            "registrationEnvelope95Feet": registration_envelope95_feet,
            "observedMaximumHoldoutResidualFeet": observed_holdout_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": localization_envelope95_feet,
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal95_feet,
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope,
            "holdoutOrientationEnvelopeDegrees": holdout_orientation_envelope,
            "referenceOrientationEnvelopeDegrees": reference_orientation_envelope,
            "combinedOrientationAccuracy95Degrees": combined_orientation95_degrees,
            "horizontalCombinationRule": "root sum of squares",
        },
        "numericRegistrationAcceptance": {
            "accepted": accepted,
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
            "orientationThresholdDegrees": 1.0,
            "blockers": blockers,
        },
        "registrationAcceptance": {
            "accepted": accepted,
            "scope": "2021 local stadium frame registered to the 2018 absolute survey frame",
            "blockers": blockers,
        },
        "geometryBoundary": {
            "establishesMetricStadiumFrame": accepted,
            "establishesCompleteDeclaredFootprintFrame": accepted,
            "establishesMeasuredRowGeometry": False,
            "establishesMeasuredRoofUndersides": False,
            "establishesCurrentMovableRoofPositions": False,
            "establishesCompleteCurrentObstructionGeometry": False,
        },
        "assessment": {
            "localHorizontalRegistrationMeasurementEligible": accepted,
            "closedRoofTopSurfaceFrameEligible": accepted,
            "closedRoofObstructionVolumeEligible": False,
            "publicationEligible": False,
            "blockers": [
                *blockers,
                "ROOF_UNDERSIDE_NOT_MEASURED",
                "CURRENT_OPEN_ROOF_PANEL_POSITION_NOT_ESTABLISHED",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "ROW_FRAME_HORIZONTAL_ACCURACY_NOT_YET_SUBFOOT",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ROW_GEOMETRY_NOT_MEASURED",
                "ROOF_UNDERSIDE_NOT_MEASURED",
                "CURRENT_OPEN_ROOF_PANEL_POSITION_NOT_ESTABLISHED",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("consensus", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(arguments.consensus)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "controlDesign": artifact["controlDesign"],
        "holdoutValidation": artifact["holdoutValidation"],
        "uncertainty": artifact["uncertainty"],
        "registrationAcceptance": artifact["registrationAcceptance"],
    }, indent=2))


if __name__ == "__main__":
    main()

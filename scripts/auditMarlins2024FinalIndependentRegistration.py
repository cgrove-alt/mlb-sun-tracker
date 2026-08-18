#!/usr/bin/env python3
"""Score the final independent 2018 to 2024 Marlins registration holdouts."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import math
from pathlib import Path
from typing import Any

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


ANALYSIS_VERSION = "marlins-2024-final-independent-registration-v1"
MINIMUM_TRAINING_CONTROL_COUNT = 6
MINIMUM_FINAL_HOLDOUT_COUNT = 6
MINIMUM_CONTROL_SEPARATION_METRES = 15.0


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def validate_consensus_inputs(consensus: dict[str, Any]) -> dict[str, Any]:
    if consensus.get("artifactKind") != "marlins-2024-subpixel-control-consensus-audit":
        raise ValueError("Input is not a Marlins 2024 subpixel consensus audit")
    validate_input_record(consensus["inputs"]["baseControls"])
    queue = validate_input_record(consensus["inputs"]["reviewQueue"])
    validate_input_record(consensus["inputs"]["reviewSheet"])
    validate_input_record(consensus["inputs"]["referenceSurveyReview"])
    validate_input_record(consensus["inputs"]["comparisonSurveyReview"])
    for refinement in consensus["inputs"]["refinements"]:
        validate_input_record(refinement)
    if queue is None:
        raise ValueError("Consensus review queue is not JSON")
    return queue


def validate_queue(queue: dict[str, Any]) -> None:
    validate_input_record(queue["inputs"]["referenceLidar"])
    validate_input_record(queue["inputs"]["comparisonLidar"])
    if queue["inputs"]["referenceLidar"]["acquiredOn"] != "2018-06-05":
        raise ValueError("Review queue has the wrong reference epoch")
    if queue["inputs"]["comparisonLidar"]["acquiredOn"] != "2024-02-22":
        raise ValueError("Review queue has the wrong comparison epoch")
    parameters = queue["parameters"]
    if not (
        parameters.get("referenceHorizontalEpsg") == 6346
        and parameters.get("comparisonHorizontalEpsg") == 6438
        and parameters.get("targetHorizontalEpsg") == 6346
        and parameters.get("referenceFeatureSupportMode") == "classification-6"
        and parameters.get("comparisonFeatureSupportMode") == "all-selected"
    ):
        raise ValueError("Review queue coordinate or feature-support settings are wrong")


def require_false(value: dict[str, Any], key: str) -> None:
    if value.get(key) is not False:
        raise ValueError(f"Locked review does not prove {key} is false")


def named_controls(
    consensus: dict[str, Any],
    role: str,
    namespace: str,
) -> list[dict[str, Any]]:
    selected: list[dict[str, Any]] = []
    for control in consensus["controls"]:
        if control["role"] != role:
            continue
        record = copy.deepcopy(control)
        record["controlNamespace"] = namespace
        record["qualifiedControlId"] = f"{namespace}:{control['candidateId']}"
        if any(key.startswith("holdoutResidual") for key in record):
            raise ValueError("Consensus control already contains a scored holdout residual")
        selected.append(record)
    return selected


def minimum_separation(
    first: list[dict[str, Any]],
    second: list[dict[str, Any]],
    same_collection: bool = False,
) -> float:
    distances: list[float] = []
    for first_index, first_record in enumerate(first):
        for second_index, second_record in enumerate(second):
            if same_collection and second_index <= first_index:
                continue
            distance = float(np.linalg.norm(
                np.asarray(first_record["referenceUtmMetres"])
                - np.asarray(second_record["referenceUtmMetres"])
            ))
            distances.append(distance)
    if not distances:
        raise ValueError("Cannot compute control separation")
    return min(distances)


def build_audit(
    training_consensus_path: Path,
    first_final_consensus_path: Path,
    supplemental_consensus_path: Path,
) -> dict[str, Any]:
    training_consensus, training_sha256 = locked_json(training_consensus_path)
    first_final_consensus, first_final_sha256 = locked_json(first_final_consensus_path)
    supplemental_consensus, supplemental_sha256 = locked_json(
        supplemental_consensus_path
    )

    if training_consensus.get("reviewStatus") != (
        "locked-2018-2024-subpixel-hard-structure-controls"
    ):
        raise ValueError("Training consensus is not locked")
    if first_final_consensus.get("reviewStatus") != (
        "failed-2018-2024-subpixel-hard-structure-consensus"
    ):
        raise ValueError("First final consensus status is unexpected")
    if supplemental_consensus.get("reviewStatus") != (
        "locked-2018-2024-subpixel-final-holdout-controls"
    ):
        raise ValueError("Supplemental final consensus is not locked")

    consensuses = [training_consensus, first_final_consensus, supplemental_consensus]
    queues = [validate_consensus_inputs(consensus) for consensus in consensuses]
    for queue in queues:
        validate_queue(queue)
    reference_lidar_sha256 = {
        queue["inputs"]["referenceLidar"]["sha256"] for queue in queues
    }
    comparison_lidar_sha256 = {
        queue["inputs"]["comparisonLidar"]["sha256"] for queue in queues
    }
    if len(reference_lidar_sha256) != 1 or len(comparison_lidar_sha256) != 1:
        raise ValueError("Consensus queues do not use identical LiDAR epochs")
    reference_reviews = [
        consensus["inputs"]["referenceSurveyReview"] for consensus in consensuses
    ]
    comparison_reviews = [
        consensus["inputs"]["comparisonSurveyReview"] for consensus in consensuses
    ]
    if any(record != reference_reviews[0] for record in reference_reviews[1:]):
        raise ValueError("Consensus inputs use different reference survey reviews")
    if any(record != comparison_reviews[0] for record in comparison_reviews[1:]):
        raise ValueError("Consensus inputs use different comparison survey reviews")
    reference_review = validate_input_record(reference_reviews[0])
    comparison_review = validate_input_record(comparison_reviews[0])
    if reference_review is None or comparison_review is None:
        raise ValueError("Survey reviews are not JSON")
    if not reference_review["conservativeInterpretation"][
        "passesOneFootHorizontalThreshold"
    ]:
        raise ValueError("The 2018 reference does not clear the horizontal gate")
    if not comparison_review["gates"]["sourceVerticalAccuracy"]["pass"]:
        raise ValueError("The 2024 comparison does not clear the vertical gate")

    first_base = validate_input_record(first_final_consensus["inputs"]["baseControls"])
    supplemental_base = validate_input_record(
        supplemental_consensus["inputs"]["baseControls"]
    )
    if first_base is None or supplemental_base is None:
        raise ValueError("Final holdout base controls are not JSON")
    require_false(
        first_base["assessment"],
        "residualAgainstExploratoryTransformInspected",
    )
    require_false(
        supplemental_base["assessment"],
        "v4LocalizationInspectedBeforeLock",
    )
    require_false(
        supplemental_base["assessment"],
        "residualAgainstAnyFittedTransformInspected",
    )

    training = named_controls(training_consensus, "training", "v2-training")
    first_final = named_controls(first_final_consensus, "holdout", "v3-final")
    supplemental = named_controls(
        supplemental_consensus,
        "holdout",
        "v4-second-supplemental-final",
    )
    holdouts = first_final + supplemental
    if len(training) != MINIMUM_TRAINING_CONTROL_COUNT:
        raise ValueError("Exactly six locked training controls are required")
    if len(first_final) != 5:
        raise ValueError("The first final localization must contribute five controls")
    if len(supplemental) < 1:
        raise ValueError("At least one supplemental final holdout is required")
    if len(holdouts) < MINIMUM_FINAL_HOLDOUT_COUNT:
        raise ValueError("At least six final independent holdouts are required")
    if len({record["qualifiedControlId"] for record in training + holdouts}) != (
        len(training) + len(holdouts)
    ):
        raise ValueError("Qualified control identifiers are not unique")

    holdout_separation = minimum_separation(holdouts, holdouts, same_collection=True)
    training_to_holdout_separation = minimum_separation(training, holdouts)
    if min(holdout_separation, training_to_holdout_separation) < (
        MINIMUM_CONTROL_SEPARATION_METRES
    ):
        raise ValueError("Final controls are not spatially independent")

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
    comparison_source_horizontal95_feet = float(
        comparison_review["metrics"]["horizontalAccuracy95ComputedFt"]
    )
    comparison_vertical95_feet = float(
        comparison_review["metrics"]["verticalRawNva95ComputedFt"]
    )
    observed_holdout_envelope95_feet = float(
        np.max(holdout_residuals) * FEET_PER_METRE
    )
    control_localization_envelope95_feet = float(
        max(
            record["localizationEnvelopeMetres"]
            for record in training + holdouts
        ) * FEET_PER_METRE
    )
    registration_envelope95_feet = max(
        observed_holdout_envelope95_feet,
        control_localization_envelope95_feet,
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
    measurement_eligible = bool(
        combined_horizontal95_feet <= 1.0
        and combined_orientation95_degrees <= 1.0
        and comparison_vertical95_feet <= 1.0
    )
    blockers: list[str] = []
    if combined_horizontal95_feet > 1.0:
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if comparison_vertical95_feet > 1.0:
        blockers.append("VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if combined_orientation95_degrees > 1.0:
        blockers.append("ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")

    stable = {
        "trainingConsensusSha256": training_sha256,
        "firstFinalConsensusSha256": first_final_sha256,
        "supplementalConsensusSha256": supplemental_sha256,
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
        "artifactKind": "final-independent-hard-structure-registered-2024-lidar-local-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "trainingConsensus": {
                "path": str(training_consensus_path),
                "sha256": training_sha256,
                "artifactVersion": training_consensus["artifactVersion"],
            },
            "firstFinalHoldoutConsensus": {
                "path": str(first_final_consensus_path),
                "sha256": first_final_sha256,
                "artifactVersion": first_final_consensus["artifactVersion"],
            },
            "supplementalFinalHoldoutConsensus": {
                "path": str(supplemental_consensus_path),
                "sha256": supplemental_sha256,
                "artifactVersion": supplemental_consensus["artifactVersion"],
            },
            "referenceSurveyReview": reference_reviews[0],
            "comparisonSurveyReview": comparison_reviews[0],
        },
        "controlDesign": {
            "trainingControlCount": len(training),
            "firstFinalHoldoutCount": len(first_final),
            "supplementalFinalHoldoutCount": len(supplemental),
            "finalHoldoutCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "minimumTrainingToHoldoutSeparationMetres": (
                training_to_holdout_separation
            ),
            "minimumFinalHoldoutSeparationMetres": holdout_separation,
            "fitUsesFinalHoldouts": False,
            "finalHoldoutsSelectedBeforeTheirLocalization": True,
            "finalHoldoutResidualsInspectedBeforeSelection": False,
        },
        "lockedTransform": {
            "operation": "map 2024 comparison UTM coordinates into the 2018 reference UTM frame",
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
            "observedMaximumHoldoutResidualFeet": (
                observed_holdout_envelope95_feet
            ),
            "maximumControlLocalizationEnvelopeFeet": (
                control_localization_envelope95_feet
            ),
            "maximumResidualUsedAsRegistrationEnvelope95Feet": (
                registration_envelope95_feet
            ),
            "records": holdouts,
        },
        "uncertainty": {
            "referenceHorizontalAccuracy95Feet": reference_horizontal95_feet,
            "comparisonSourceHorizontalAccuracy95Feet": (
                comparison_source_horizontal95_feet
            ),
            "registrationEnvelope95Feet": registration_envelope95_feet,
            "observedMaximumHoldoutResidualFeet": (
                observed_holdout_envelope95_feet
            ),
            "maximumControlLocalizationEnvelopeFeet": (
                control_localization_envelope95_feet
            ),
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": (
                combined_horizontal95_feet
            ),
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope,
            "holdoutOrientationEnvelopeDegrees": holdout_orientation_envelope,
            "referenceOrientationEnvelopeDegrees": reference_orientation_envelope,
            "combinedOrientationAccuracy95Degrees": (
                combined_orientation95_degrees
            ),
            "horizontalCombinationRule": "root sum of squares",
            "registrationEnvelopeInterpretation": (
                "The maximum independent final holdout residual includes paired "
                "raster localization, feature stability, source-frame transformation, "
                "classification differences, and transform fit error."
            ),
        },
        "registrationAcceptance": {
            "accepted": measurement_eligible,
            "scope": "2024 local stadium frame registered to the 2018 absolute survey frame",
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
            "orientationThresholdDegrees": 1.0,
            "blockers": blockers,
        },
        "geometryBoundary": {
            "establishesMetricStadiumFrameThrough2024": measurement_eligible,
            "establishesClosedRoofTopSurfaceFrameThrough2024": measurement_eligible,
            "establishesMeasuredRowGeometry": False,
            "establishesMeasuredRoofUndersides": False,
            "establishesCurrent2026MovableRoofPositions": False,
            "establishesCompleteCurrentObstructionGeometry": False,
        },
        "assessment": {
            "localHorizontalRegistrationMeasurementEligible": measurement_eligible,
            "closedRoofTopSurfaceFrameEligible": measurement_eligible,
            "closedRoofObstructionVolumeEligible": False,
            "publicationEligible": False,
            "blockers": [
                *blockers,
                "ROOF_UNDERSIDE_NOT_MEASURED",
                "CURRENT_2026_OPEN_ROOF_PANEL_POSITION_NOT_ESTABLISHED",
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
                "CURRENT_2026_OPEN_ROOF_PANEL_POSITION_NOT_ESTABLISHED",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("training_consensus", type=Path)
    parser.add_argument("first_final_consensus", type=Path)
    parser.add_argument("supplemental_consensus", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(
        arguments.training_consensus,
        arguments.first_final_consensus,
        arguments.supplemental_consensus,
    )
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

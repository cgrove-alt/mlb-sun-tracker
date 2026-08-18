#!/usr/bin/env python3
"""Audit a joint 2018 to 2021 fit on fresh adjacent-tile holdouts."""

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


ANALYSIS_VERSION = "marlins-2018-to-2021-adjacent-final-holdout-registration-v1"
MINIMUM_TRAINING_CONTROL_COUNT = 12
MINIMUM_HOLDOUT_CONTROL_COUNT = 6
MINIMUM_HOLDOUT_SEPARATION_METRES = 20.0
MINIMUM_TRAINING_TO_HOLDOUT_DISTANCE_METRES = 50.0


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


def minimum_cross_set_distance(
    first_records: list[dict[str, Any]],
    second_records: list[dict[str, Any]],
) -> float:
    distances = [
        float(np.linalg.norm(
            np.asarray(first["referenceUtmMetres"])
            - np.asarray(second["referenceUtmMetres"])
        ))
        for first in first_records
        for second in second_records
    ]
    if not distances:
        raise ValueError("Cannot compute distance for an empty control set")
    return min(distances)


def validate_lineage_consensus(
    consensus: dict[str, Any],
    expected_status: str,
) -> tuple[dict[str, Any], dict[str, Any]]:
    if consensus.get("artifactKind") != (
        "marlins-2018-2021-subpixel-control-consensus-audit"
    ):
        raise ValueError("Consensus has the wrong artifact kind")
    if consensus.get("reviewStatus") != expected_status:
        raise ValueError("Consensus has the wrong locked status")
    base = validate_input_record(consensus["inputs"]["baseControls"])
    queue = validate_input_record(consensus["inputs"]["reviewQueue"])
    validate_input_record(consensus["inputs"]["reviewSheet"])
    validate_input_record(consensus["inputs"]["referenceSurveyReview"])
    validate_input_record(consensus["inputs"]["comparisonSurveyReview"])
    for refinement in consensus["inputs"]["refinements"]:
        validate_input_record(refinement)
    if base is None or queue is None:
        raise ValueError("Consensus lineage JSON is unavailable")
    if base.get("reviewStatus") != (
        "reviewed-2018-2021-subpixel-hard-structure-lidar-controls"
    ):
        raise ValueError("Consensus base controls have the wrong review status")
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
    return base, queue


def named_controls(
    consensus: dict[str, Any],
    namespace: str,
    fit_role: str,
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for control in consensus["controls"]:
        record = copy.deepcopy(control)
        if any(key.startswith("holdoutResidual") for key in record):
            raise ValueError("Consensus control already contains a scored residual")
        record["originalRole"] = record.pop("role")
        record["role"] = fit_role
        record["controlNamespace"] = namespace
        record["qualifiedControlId"] = f"{namespace}:{record['candidateId']}"
        records.append(record)
    return records


def build_audit(
    training_consensus_path: Path,
    prior_registration_path: Path,
    holdout_consensus_paths: list[Path],
) -> dict[str, Any]:
    training_consensus, training_sha256 = locked_json(training_consensus_path)
    training_base, _ = validate_lineage_consensus(
        training_consensus,
        "locked-2018-2021-subpixel-hard-structure-controls",
    )
    prior_registration, prior_registration_sha256 = locked_json(
        prior_registration_path
    )
    if not prior_registration["registrationAcceptance"]["accepted"]:
        raise ValueError("Prior stadium registration is not accepted")
    if prior_registration["inputs"]["consensus"] != {
        "path": str(training_consensus_path),
        "sha256": training_sha256,
        "artifactVersion": training_consensus["artifactVersion"],
    }:
        raise ValueError("Prior registration does not score the training consensus")
    reference_review = validate_input_record(
        training_consensus["inputs"]["referenceSurveyReview"]
    )
    comparison_review = validate_input_record(
        training_consensus["inputs"]["comparisonSurveyReview"]
    )
    if reference_review is None or comparison_review is None:
        raise ValueError("Survey review JSON is unavailable")
    if not reference_review["conservativeInterpretation"][
        "passesOneFootHorizontalThreshold"
    ]:
        raise ValueError("Reference survey does not pass the horizontal gate")
    if not comparison_review["conservativeInterpretation"][
        "passesOneFootVerticalThreshold"
    ]:
        raise ValueError("Comparison survey does not pass the vertical gate")

    training = named_controls(training_consensus, "stadium-scored-set", "training")
    if len(training) < MINIMUM_TRAINING_CONTROL_COUNT:
        raise ValueError("Too few scored stadium controls are available for fitting")
    holdouts: list[dict[str, Any]] = []
    holdout_inputs: list[dict[str, Any]] = []
    expected_prior_consensus = {
        "path": str(training_consensus_path),
        "sha256": training_sha256,
        "artifactVersion": training_consensus["artifactVersion"],
    }
    expected_prior_registration = {
        "path": str(prior_registration_path),
        "sha256": prior_registration_sha256,
        "artifactVersion": prior_registration["artifactVersion"],
    }
    for path in holdout_consensus_paths:
        consensus, digest = locked_json(path)
        base, queue = validate_lineage_consensus(
            consensus,
            "locked-2018-2021-subpixel-final-holdout-controls",
        )
        if base["inputs"]["priorScoredConsensus"] != expected_prior_consensus:
            raise ValueError("Final holdouts were not locked against this training set")
        if base["inputs"]["priorScoredRegistration"] != expected_prior_registration:
            raise ValueError("Final holdouts were not locked after this prior audit")
        assessment = base["assessment"]
        if assessment["localizationInspectedBeforeLock"]:
            raise ValueError("Final holdout selection inspected localization")
        if assessment["residualAgainstAnyFittedTransformInspected"]:
            raise ValueError("Final holdout selection inspected fitted residuals")
        namespace = f"adjacent-{base['tileId']}"
        tile_records = named_controls(consensus, namespace, "holdout")
        if any(record["originalRole"] != "holdout" for record in tile_records):
            raise ValueError("A final holdout consensus contains a fit control")
        holdouts.extend(tile_records)
        holdout_inputs.append({
            "path": str(path),
            "sha256": digest,
            "artifactVersion": consensus["artifactVersion"],
            "tileId": base["tileId"],
            "reviewQueue": consensus["inputs"]["reviewQueue"],
            "localizedControlCount": len(tile_records),
            "queueCenterUtmMetres": queue["parameters"]["centerUtmMetres"],
        })
    if len(holdouts) < MINIMUM_HOLDOUT_CONTROL_COUNT:
        raise ValueError("Fewer than six fresh adjacent-tile holdouts passed localization")
    qualified_ids = [record["qualifiedControlId"] for record in training + holdouts]
    if len(qualified_ids) != len(set(qualified_ids)):
        raise ValueError("Qualified control identifiers are not unique")
    holdout_separation = minimum_pair_separation(holdouts)
    if holdout_separation < MINIMUM_HOLDOUT_SEPARATION_METRES:
        raise ValueError("Final holdouts are not sufficiently separated")
    training_to_holdout_distance = minimum_cross_set_distance(training, holdouts)
    if training_to_holdout_distance < MINIMUM_TRAINING_TO_HOLDOUT_DISTANCE_METRES:
        raise ValueError("Final holdouts are not fresh against the training controls")

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

    locked_rotation_degrees = rotation_degrees(rotation)
    leave_one_out_rotations: list[float] = []
    for excluded in range(len(training)):
        keep = np.arange(len(training)) != excluded
        candidate_rotation, _ = fit_rigid(
            training_source[keep],
            training_target[keep],
        )
        leave_one_out_rotations.append(rotation_degrees(candidate_rotation))
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
        max(record["localizationEnvelopeMetres"] for record in training + holdouts)
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
        "trainingConsensusSha256": training_sha256,
        "priorRegistrationSha256": prior_registration_sha256,
        "holdoutInputs": holdout_inputs,
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
        "artifactKind": "hard-structure-registered-2021-lidar-adjacent-holdout-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "trainingConsensus": {
                "path": str(training_consensus_path),
                "sha256": training_sha256,
                "artifactVersion": training_consensus["artifactVersion"],
            },
            "priorScoredRegistration": {
                "path": str(prior_registration_path),
                "sha256": prior_registration_sha256,
                "artifactVersion": prior_registration["artifactVersion"],
            },
            "finalHoldoutConsensuses": holdout_inputs,
            "referenceSurveyReview": training_consensus["inputs"]["referenceSurveyReview"],
            "comparisonSurveyReview": training_consensus["inputs"]["comparisonSurveyReview"],
        },
        "controlDesign": {
            "trainingControlCount": len(training),
            "holdoutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "minimumHoldoutSeparationMetres": holdout_separation,
            "minimumTrainingToHoldoutDistanceMetres": training_to_holdout_distance,
            "fitUsesHoldouts": False,
            "trainingControlsPreviouslyScored": True,
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
            "scope": "2021 local stadium frame tied to 2018 with fresh adjacent-tile holdouts",
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
    parser.add_argument("training_consensus", type=Path)
    parser.add_argument("prior_registration", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("holdout_consensuses", type=Path, nargs="+")
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(
        arguments.training_consensus,
        arguments.prior_registration,
        arguments.holdout_consensuses,
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

#!/usr/bin/env python3
"""Audit the 2021 to 2024 Marlins tie on fresh adjacent-tile holdouts."""

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


ANALYSIS_VERSION = "marlins-2021-to-2024-adjacent-final-holdout-registration-v1"
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


def validate_consensus(
    consensus: dict[str, Any],
    expected_status: str,
) -> tuple[dict[str, Any], dict[str, Any]]:
    if consensus.get("artifactKind") != "marlins-2024-subpixel-control-consensus-audit":
        raise ValueError("Consensus has the wrong artifact kind")
    if consensus.get("reviewStatus") != expected_status:
        raise ValueError("Consensus has the wrong locked status")
    base = validate_input_record(consensus["inputs"]["baseControls"])
    queue = validate_input_record(consensus["inputs"]["reviewQueue"])
    validate_input_record(consensus["inputs"]["reviewSheet"])
    if "referenceSurveyReview" in consensus["inputs"]:
        validate_input_record(consensus["inputs"]["referenceSurveyReview"])
    validate_input_record(consensus["inputs"]["accepted2021Frame"])
    validate_input_record(consensus["inputs"]["comparisonSurveyReview"])
    for refinement in consensus["inputs"]["refinements"]:
        validate_input_record(refinement)
    if base is None or queue is None:
        raise ValueError("Consensus lineage JSON is unavailable")
    if base.get("reviewStatus") != "reviewed-2021-2024-hard-structure-lidar-controls":
        raise ValueError("Consensus base controls have the wrong review status")
    if queue["inputs"]["referenceLidar"]["acquiredOn"] != "2021-04-10":
        raise ValueError("Review queue has the wrong reference epoch")
    if queue["inputs"]["comparisonLidar"]["acquiredOn"] != "2024-02-22":
        raise ValueError("Review queue has the wrong comparison epoch")
    parameters = queue["parameters"]
    if not (
        parameters["referenceHorizontalEpsg"] == 6346
        and parameters["comparisonHorizontalEpsg"] == 6438
        and parameters["targetHorizontalEpsg"] == 6346
        and parameters["referenceVerticalUnitMetres"] == 1.0
        and math.isclose(
            parameters["comparisonVerticalUnitMetres"],
            0.3048006096012192,
            rel_tol=0.0,
            abs_tol=1e-15,
        )
        and parameters["referenceFeatureSupportMode"] == "classification-6"
        and parameters["comparisonFeatureSupportMode"] == "all-selected"
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


def consensus_input(path: Path, consensus: dict[str, Any], digest: str) -> dict[str, Any]:
    return {
        "path": str(path),
        "sha256": digest,
        "artifactVersion": consensus["artifactVersion"],
    }


def build_audit(
    first_training_consensus_path: Path,
    supplemental_training_consensus_path: Path,
    prior_registration_path: Path,
    holdout_consensus_paths: list[Path],
) -> dict[str, Any]:
    first, first_sha256 = locked_json(first_training_consensus_path)
    supplemental, supplemental_sha256 = locked_json(
        supplemental_training_consensus_path
    )
    first_base, first_queue = validate_consensus(
        first,
        "failed-2018-2024-subpixel-hard-structure-consensus",
    )
    supplemental_base, supplemental_queue = validate_consensus(
        supplemental,
        "locked-2021-2024-subpixel-hard-structure-controls",
    )
    if first["inputs"]["accepted2021Frame"] != supplemental["inputs"][
        "accepted2021Frame"
    ]:
        raise ValueError("Training consensuses use different accepted 2021 frames")
    if first["inputs"]["comparisonSurveyReview"] != supplemental["inputs"][
        "comparisonSurveyReview"
    ]:
        raise ValueError("Training consensuses use different 2024 survey reviews")
    if first_queue != supplemental_queue:
        raise ValueError("Training consensuses use different review queues")
    if first_base["assessment"]["residualAgainstAnyFittedTransformInspected"]:
        raise ValueError("First training selection inspected a fitted residual")
    if supplemental_base["assessment"]["residualAgainstAnyFittedTransformInspected"]:
        raise ValueError("Supplemental training selection inspected a fitted residual")

    first_input = consensus_input(
        first_training_consensus_path,
        first,
        first_sha256,
    )
    supplemental_input = consensus_input(
        supplemental_training_consensus_path,
        supplemental,
        supplemental_sha256,
    )
    prior_registration, prior_sha256 = locked_json(prior_registration_path)
    if prior_registration.get("artifactKind") != (
        "marlins-2021-to-2024-final-independent-registration"
    ):
        raise ValueError("Prior registration has the wrong artifact kind")
    if prior_registration["inputs"]["firstConsensus"] != first_input:
        raise ValueError("Prior registration does not score the first training set")
    if prior_registration["inputs"]["supplementalConsensus"] != supplemental_input:
        raise ValueError("Prior registration does not score the supplemental training set")
    prior_input = {
        "path": str(prior_registration_path),
        "sha256": prior_sha256,
        "artifactVersion": prior_registration["artifactVersion"],
    }

    accepted_2021_frame = validate_input_record(first["inputs"]["accepted2021Frame"])
    comparison_review = validate_input_record(
        first["inputs"]["comparisonSurveyReview"]
    )
    if accepted_2021_frame is None or comparison_review is None:
        raise ValueError("Accuracy lineage JSON is unavailable")
    if not accepted_2021_frame["registrationAcceptance"]["accepted"]:
        raise ValueError("The 2021 frame is not accepted")
    if not comparison_review["gates"]["sourceVerticalAccuracy"]["pass"]:
        raise ValueError("The 2024 vertical source gate is not passed")

    training = named_controls(first, "first-scored-set", "training")
    training.extend(named_controls(
        supplemental,
        "supplemental-scored-set",
        "training",
    ))
    if len(training) < MINIMUM_TRAINING_CONTROL_COUNT:
        raise ValueError("Too few previously scored stadium controls are available")

    holdouts: list[dict[str, Any]] = []
    holdout_inputs: list[dict[str, Any]] = []
    for path in holdout_consensus_paths:
        consensus, digest = locked_json(path)
        base, queue = validate_consensus(
            consensus,
            "locked-2021-2024-subpixel-final-holdout-controls",
        )
        if base["inputs"]["accepted2021Frame"] != first["inputs"][
            "accepted2021Frame"
        ]:
            raise ValueError("Final holdout uses a different accepted 2021 frame")
        if base["inputs"]["priorScoredFirstConsensus"] != first_input:
            raise ValueError("Final holdout was not locked against the first scored set")
        if base["inputs"]["priorScoredSupplementalConsensus"] != supplemental_input:
            raise ValueError(
                "Final holdout was not locked against the supplemental scored set"
            )
        if base["inputs"]["priorScoredRegistration"] != prior_input:
            raise ValueError("Final holdout was not locked after the prior audit")
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
            **consensus_input(path, consensus, digest),
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

    accepted_2021_horizontal95_feet = float(
        accepted_2021_frame["uncertainty"]["combinedHorizontalAccuracy95Feet"]
    )
    accepted_2021_orientation95_degrees = float(
        accepted_2021_frame["uncertainty"]["combinedOrientationAccuracy95Degrees"]
    )
    comparison_vertical95_feet = float(
        comparison_review["metrics"]["verticalRawNva95ComputedFt"]
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
        accepted_2021_horizontal95_feet,
        registration_envelope95_feet,
    )
    holdout_orientation_envelope = math.degrees(
        math.atan2(float(np.max(holdout_residuals)), training_span_metres)
    )
    combined_orientation95_degrees = math.sqrt(
        accepted_2021_orientation95_degrees ** 2
        + rotation_parameter_envelope ** 2
        + holdout_orientation_envelope ** 2
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
        "firstTrainingConsensusSha256": first_sha256,
        "supplementalTrainingConsensusSha256": supplemental_sha256,
        "priorRegistrationSha256": prior_sha256,
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
        "artifactKind": (
            "marlins-2021-to-2024-adjacent-final-independent-registration"
        ),
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "firstTrainingConsensus": first_input,
            "supplementalTrainingConsensus": supplemental_input,
            "priorScoredRegistration": prior_input,
            "finalHoldoutConsensuses": holdout_inputs,
            "accepted2021Frame": first["inputs"]["accepted2021Frame"],
            "comparisonSurveyReview": first["inputs"]["comparisonSurveyReview"],
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
            "operation": (
                "map 2024 comparison coordinates into the accepted 2021 UTM frame"
            ),
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
            "accepted2021FrameHorizontalAccuracy95Feet": (
                accepted_2021_horizontal95_feet
            ),
            "registrationEnvelope95Feet": registration_envelope95_feet,
            "observedMaximumHoldoutResidualFeet": observed_holdout_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": localization_envelope95_feet,
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": (
                combined_horizontal95_feet
            ),
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "accepted2021FrameOrientationAccuracy95Degrees": (
                accepted_2021_orientation95_degrees
            ),
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope,
            "holdoutOrientationEnvelopeDegrees": holdout_orientation_envelope,
            "combinedOrientationAccuracy95Degrees": combined_orientation95_degrees,
            "horizontalCombinationRule": "root sum of squares",
        },
        "registrationAcceptance": {
            "accepted": accepted,
            "scope": (
                "2024 closed-roof LiDAR frame chained through the accepted 2021 "
                "absolute frame with fresh adjacent-tile holdouts"
            ),
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
            "orientationThresholdDegrees": 1.0,
            "blockers": blockers,
        },
        "geometryBoundary": {
            "establishesMetricStadiumFrameThrough2024": accepted,
            "establishesClosedRoofTopSurfaceFrameThrough2024": accepted,
            "establishesMeasuredRowGeometry": False,
            "establishesMeasuredRoofUndersides": False,
            "establishesCurrent2026MovableRoofPositions": False,
            "establishesCompleteCurrentObstructionGeometry": False,
        },
        "assessment": {
            "closedRoofTopSurfaceFrameEligible": accepted,
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
    parser.add_argument("first_training_consensus", type=Path)
    parser.add_argument("supplemental_training_consensus", type=Path)
    parser.add_argument("prior_registration", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("holdout_consensuses", type=Path, nargs="+")
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(
        arguments.first_training_consensus,
        arguments.supplemental_training_consensus,
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

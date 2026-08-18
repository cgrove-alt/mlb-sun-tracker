#!/usr/bin/env python3
"""Audit the final 2024 LiDAR tie to the accepted Marlins 2021 frame."""

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


ANALYSIS_VERSION = "marlins-2021-to-2024-final-independent-registration-v1"
MINIMUM_TRAINING_CONTROL_COUNT = 6
MINIMUM_HOLDOUT_CONTROL_COUNT = 6
MINIMUM_HOLDOUT_SEPARATION_METRES = 5.0


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def validate_consensus(consensus: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    if consensus.get("artifactKind") != "marlins-2024-subpixel-control-consensus-audit":
        raise ValueError("Input has the wrong consensus kind")
    base = validate_input_record(consensus["inputs"]["baseControls"])
    queue = validate_input_record(consensus["inputs"]["reviewQueue"])
    validate_input_record(consensus["inputs"]["reviewSheet"])
    validate_input_record(consensus["inputs"]["accepted2021Frame"])
    validate_input_record(consensus["inputs"]["comparisonSurveyReview"])
    for refinement in consensus["inputs"]["refinements"]:
        validate_input_record(refinement)
    if base is None or queue is None:
        raise ValueError("Consensus lineage JSON is unavailable")
    if base.get("reviewStatus") != "reviewed-2021-2024-hard-structure-lidar-controls":
        raise ValueError("Consensus base controls are not the 2021 to 2024 review")
    if base["assessment"]["residualAgainstAnyFittedTransformInspected"]:
        raise ValueError("Control selection inspected fitted-transform residuals")
    return base, queue


def named_controls(
    consensus: dict[str, Any],
    namespace: str,
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for control in consensus["controls"]:
        record = copy.deepcopy(control)
        record["controlNamespace"] = namespace
        record["qualifiedControlId"] = f"{namespace}:{control['candidateId']}"
        if any(key.startswith("holdoutResidual") for key in record):
            raise ValueError("A consensus control already contains a scored residual")
        records.append(record)
    return records


def minimum_separation(records: list[dict[str, Any]]) -> float:
    distances: list[float] = []
    for first_index, first in enumerate(records):
        for second in records[first_index + 1:]:
            distances.append(float(np.linalg.norm(
                np.asarray(first["referenceUtmMetres"])
                - np.asarray(second["referenceUtmMetres"])
            )))
    if not distances:
        raise ValueError("Cannot compute holdout separation")
    return min(distances)


def build_audit(
    first_consensus_path: Path,
    supplemental_consensus_path: Path,
) -> dict[str, Any]:
    first, first_sha256 = locked_json(first_consensus_path)
    supplemental, supplemental_sha256 = locked_json(supplemental_consensus_path)
    if first.get("reviewStatus") != "failed-2018-2024-subpixel-hard-structure-consensus":
        raise ValueError("First consensus status is unexpected")
    if supplemental.get("reviewStatus") != (
        "locked-2021-2024-subpixel-hard-structure-controls"
    ):
        raise ValueError("Supplemental consensus is not locked")
    first_base, first_queue = validate_consensus(first)
    supplemental_base, supplemental_queue = validate_consensus(supplemental)
    if first["inputs"]["reviewQueue"] != supplemental["inputs"]["reviewQueue"]:
        raise ValueError("Consensus artifacts use different review queues")
    if first["inputs"]["accepted2021Frame"] != supplemental["inputs"]["accepted2021Frame"]:
        raise ValueError("Consensus artifacts use different accepted 2021 frames")
    if first["inputs"]["comparisonSurveyReview"] != supplemental[
        "inputs"
    ]["comparisonSurveyReview"]:
        raise ValueError("Consensus artifacts use different 2024 survey reviews")
    if first_queue != supplemental_queue:
        raise ValueError("Consensus review queues differ")
    queue = first_queue
    if queue["inputs"]["referenceLidar"]["acquiredOn"] != "2021-04-10":
        raise ValueError("Review queue has the wrong reference epoch")
    if queue["inputs"]["comparisonLidar"]["acquiredOn"] != "2024-02-22":
        raise ValueError("Review queue has the wrong comparison epoch")
    parameters = queue["parameters"]
    if not (
        parameters["referenceHorizontalEpsg"] == 6346
        and parameters["comparisonHorizontalEpsg"] == 6438
        and parameters["targetHorizontalEpsg"] == 6346
        and parameters["referenceFeatureSupportMode"] == "classification-6"
        and parameters["comparisonFeatureSupportMode"] == "all-selected"
    ):
        raise ValueError("Review queue coordinate or feature-support settings are wrong")
    validate_input_record(queue["inputs"]["referenceLidar"])
    validate_input_record(queue["inputs"]["comparisonLidar"])

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

    first_records = named_controls(first, "first-locked-set")
    supplemental_records = named_controls(
        supplemental,
        "supplemental-locked-set",
    )
    records = first_records + supplemental_records
    training = [record for record in records if record["role"] == "training"]
    holdouts = [record for record in records if record["role"] == "holdout"]
    if len(training) < MINIMUM_TRAINING_CONTROL_COUNT:
        raise ValueError("Fewer than six training controls passed localization")
    if len(holdouts) < MINIMUM_HOLDOUT_CONTROL_COUNT:
        raise ValueError("Fewer than six holdout controls passed localization")
    qualified_ids = [record["qualifiedControlId"] for record in records]
    if len(set(qualified_ids)) != len(qualified_ids):
        raise ValueError("Qualified control identifiers are not unique")
    holdout_separation = minimum_separation(holdouts)
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
        max(record["localizationEnvelopeMetres"] for record in records)
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
        "firstConsensusSha256": first_sha256,
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
        "artifactKind": "marlins-2021-to-2024-final-independent-registration",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "firstConsensus": {
                "path": str(first_consensus_path),
                "sha256": first_sha256,
                "artifactVersion": first["artifactVersion"],
            },
            "supplementalConsensus": {
                "path": str(supplemental_consensus_path),
                "sha256": supplemental_sha256,
                "artifactVersion": supplemental["artifactVersion"],
            },
            "accepted2021Frame": first["inputs"]["accepted2021Frame"],
            "comparisonSurveyReview": first["inputs"]["comparisonSurveyReview"],
            "reviewQueue": first["inputs"]["reviewQueue"],
        },
        "controlDesign": {
            "firstLocalizedControlCount": len(first_records),
            "supplementalLocalizedControlCount": len(supplemental_records),
            "trainingControlCount": len(training),
            "holdoutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "minimumHoldoutSeparationMetres": holdout_separation,
            "fitUsesHoldouts": False,
            "holdoutsSelectedBeforeTheirLocalization": True,
            "holdoutResidualsInspectedBeforeSelection": False,
        },
        "lockedTransform": {
            "operation": "map 2024 comparison coordinates into the accepted 2021 UTM frame",
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
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal95_feet,
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
            "scope": "2024 closed-roof LiDAR frame chained through the accepted 2021 absolute frame",
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
    parser.add_argument("first_consensus", type=Path)
    parser.add_argument("supplemental_consensus", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(
        arguments.first_consensus,
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

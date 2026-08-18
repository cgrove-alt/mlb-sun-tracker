#!/usr/bin/env python3
"""Audit the Marlins 2021 to 2024 similarity tie on fresh holdouts."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np

from auditMarlins2021To2024AdjacentHoldouts import (
    locked_json,
    minimum_cross_set_distance,
    minimum_pair_separation,
    named_controls,
    validate_consensus,
)
from auditNoaa2021HardStructureRegistration import (
    FEET_PER_METRE,
    LOCAL_PIVOT_UTM_METRES,
    artifact_version,
    rotation_degrees,
    summary,
    validate_input_record,
)
from diagnoseMarlins2021To2024TransformFamilies import (
    fit_similarity,
    transform_similarity,
)


ANALYSIS_VERSION = "marlins-2021-to-2024-similarity-final-holdout-registration-v1"
MINIMUM_TRAINING_CONTROL_COUNT = 24
MINIMUM_FINAL_HOLDOUT_COUNT = 6
MINIMUM_HOLDOUT_SEPARATION_METRES = 20.0
MINIMUM_TRAINING_TO_HOLDOUT_DISTANCE_METRES = 50.0
MAXIMUM_ABSOLUTE_SCALE_DEVIATION_PARTS_PER_MILLION = 1_000.0


def input_record(path: Path, value: dict[str, Any], digest: str) -> dict[str, Any]:
    return {
        "path": str(path),
        "sha256": digest,
        "artifactVersion": value["artifactVersion"],
    }


def consumed_controls(
    audit: dict[str, Any],
    namespace: str,
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for source in audit["holdoutValidation"]["records"]:
        record = copy.deepcopy(source)
        for key in list(record):
            if key.startswith("holdoutResidual") or key == "predictedReferenceUtmMetres":
                del record[key]
        record["originalRole"] = record.get("originalRole", record.get("role"))
        record["role"] = "training"
        record["controlNamespace"] = namespace
        record["qualifiedControlId"] = (
            f"{namespace}:{source['controlNamespace']}:{source['candidateId']}"
        )
        records.append(record)
    return records


def build_audit(
    first_consensus_path: Path,
    supplemental_consensus_path: Path,
    consumed_holdout_audit_path: Path,
    transform_diagnostic_path: Path,
    holdout_consensus_paths: list[Path],
) -> dict[str, Any]:
    first, first_sha256 = locked_json(first_consensus_path)
    supplemental, supplemental_sha256 = locked_json(supplemental_consensus_path)
    first_base, first_queue = validate_consensus(
        first,
        "failed-2018-2024-subpixel-hard-structure-consensus",
    )
    supplemental_base, supplemental_queue = validate_consensus(
        supplemental,
        "locked-2021-2024-subpixel-hard-structure-controls",
    )
    if first_queue != supplemental_queue:
        raise ValueError("Original training consensuses use different review queues")
    if first_base["assessment"]["residualAgainstAnyFittedTransformInspected"]:
        raise ValueError("First training selection inspected a fitted residual")
    if supplemental_base["assessment"]["residualAgainstAnyFittedTransformInspected"]:
        raise ValueError("Supplemental training selection inspected a fitted residual")

    first_input = input_record(first_consensus_path, first, first_sha256)
    supplemental_input = input_record(
        supplemental_consensus_path,
        supplemental,
        supplemental_sha256,
    )
    consumed, consumed_sha256 = locked_json(consumed_holdout_audit_path)
    consumed_input = input_record(
        consumed_holdout_audit_path,
        consumed,
        consumed_sha256,
    )
    if consumed.get("artifactKind") != (
        "marlins-2021-to-2024-adjacent-final-independent-registration"
    ):
        raise ValueError("Consumed holdout audit has the wrong kind")
    if consumed["inputs"]["firstTrainingConsensus"] != first_input:
        raise ValueError("Consumed holdout audit has the wrong first training input")
    if consumed["inputs"]["supplementalTrainingConsensus"] != supplemental_input:
        raise ValueError("Consumed holdout audit has the wrong supplemental input")
    if consumed["controlDesign"]["holdoutResidualsInspectedBeforeSelection"]:
        raise ValueError("Consumed holdouts were not independently selected")

    diagnostic, diagnostic_sha256 = locked_json(transform_diagnostic_path)
    diagnostic_input = input_record(
        transform_diagnostic_path,
        diagnostic,
        diagnostic_sha256,
    )
    if diagnostic.get("artifactKind") != (
        "marlins-2021-to-2024-transform-family-diagnostic"
    ):
        raise ValueError("Transform diagnostic has the wrong kind")
    if diagnostic["inputs"]["scoredExploratoryHoldoutAudit"] != consumed_input:
        raise ValueError("Transform diagnostic did not consume the scored holdout audit")
    models = {record["model"]: record for record in diagnostic["models"]}
    similarity_maximum = models["similarity"]["exploratoryHoldoutResidualMetres"][
        "maximum"
    ]
    if not (
        similarity_maximum
        < models["rigid"]["exploratoryHoldoutResidualMetres"]["maximum"]
        and similarity_maximum
        < models["affine"]["exploratoryHoldoutResidualMetres"]["maximum"]
    ):
        raise ValueError("Similarity was not the best exploratory transform family")
    if not diagnostic["controlDesign"][
        "newIndependentHoldoutsRequiredForAnyChosenModel"
    ]:
        raise ValueError("Transform diagnostic did not require fresh holdouts")

    accepted_frame = validate_input_record(first["inputs"]["accepted2021Frame"])
    comparison_review = validate_input_record(
        first["inputs"]["comparisonSurveyReview"]
    )
    if accepted_frame is None or comparison_review is None:
        raise ValueError("Accuracy lineage JSON is unavailable")
    if not accepted_frame["registrationAcceptance"]["accepted"]:
        raise ValueError("The 2021 frame is not accepted")
    if not comparison_review["gates"]["sourceVerticalAccuracy"]["pass"]:
        raise ValueError("The 2024 vertical source gate is not passed")

    training = named_controls(first, "first-scored-set", "training")
    training.extend(named_controls(
        supplemental,
        "supplemental-scored-set",
        "training",
    ))
    training.extend(consumed_controls(consumed, "consumed-model-selection-set"))
    if len(training) < MINIMUM_TRAINING_CONTROL_COUNT:
        raise ValueError("Too few consumed controls are available for similarity fitting")

    holdouts: list[dict[str, Any]] = []
    holdout_inputs: list[dict[str, Any]] = []
    for path in holdout_consensus_paths:
        consensus, digest = locked_json(path)
        status = consensus.get("reviewStatus")
        if status not in {
            "locked-2021-2024-subpixel-final-holdout-controls",
            "failed-2021-2024-subpixel-hard-structure-consensus",
        }:
            raise ValueError("Fresh consensus has an unexpected status")
        base, queue = validate_consensus(consensus, status)
        if base["inputs"]["firstConsumedTrainingConsensus"] != first_input:
            raise ValueError("Fresh holdout has the wrong first consumed input")
        if base["inputs"]["supplementalConsumedTrainingConsensus"] != (
            supplemental_input
        ):
            raise ValueError("Fresh holdout has the wrong supplemental consumed input")
        if base["inputs"]["consumedAdjacentHoldoutAudit"] != consumed_input:
            raise ValueError("Fresh holdout has the wrong consumed holdout audit")
        if base["inputs"]["transformFamilyDiagnostic"] != diagnostic_input:
            raise ValueError("Fresh holdout was not locked after model selection")
        if base["reviewProtocol"]["chosenModelFamily"] != (
            "four-parameter similarity transform"
        ):
            raise ValueError("Fresh holdout was locked for a different model family")
        assessment = base["assessment"]
        if assessment["localizationInspectedBeforeLock"]:
            raise ValueError("Fresh holdout selection inspected localization")
        if assessment["residualAgainstAnyFittedTransformInspected"]:
            raise ValueError("Fresh holdout selection inspected a fitted residual")
        if assessment["residualAgainstChosenSimilarityTransformInspected"]:
            raise ValueError("Fresh holdout selection inspected similarity residuals")
        namespace = f"fresh-adjacent-{base['tileId']}"
        tile_records = named_controls(consensus, namespace, "holdout")
        if any(record["originalRole"] != "holdout" for record in tile_records):
            raise ValueError("Fresh consensus contains a fit control")
        holdouts.extend(tile_records)
        holdout_inputs.append({
            **input_record(path, consensus, digest),
            "tileId": base["tileId"],
            "reviewStatus": status,
            "localizedControlCount": len(tile_records),
            "reviewQueue": consensus["inputs"]["reviewQueue"],
            "queueCenterUtmMetres": queue["parameters"]["centerUtmMetres"],
        })
    if len(holdouts) < MINIMUM_FINAL_HOLDOUT_COUNT:
        raise ValueError("Fewer than six fresh similarity holdouts passed localization")
    qualified_ids = [record["qualifiedControlId"] for record in training + holdouts]
    if len(qualified_ids) != len(set(qualified_ids)):
        raise ValueError("Qualified control identifiers are not unique")
    holdout_separation = minimum_pair_separation(holdouts)
    if holdout_separation < MINIMUM_HOLDOUT_SEPARATION_METRES:
        raise ValueError("Fresh holdouts are not sufficiently separated")
    training_to_holdout_distance = minimum_cross_set_distance(training, holdouts)
    if training_to_holdout_distance < MINIMUM_TRAINING_TO_HOLDOUT_DISTANCE_METRES:
        raise ValueError("Fresh holdouts are too close to consumed model data")

    training_source = np.asarray([
        record["comparisonUtmMetres"] for record in training
    ])
    training_target = np.asarray([
        record["referenceUtmMetres"] for record in training
    ])
    scale, rotation, translation = fit_similarity(
        training_source,
        training_target,
    )
    training_predicted = transform_similarity(
        training_source,
        scale,
        rotation,
        translation,
    )
    training_residuals = np.linalg.norm(training_predicted - training_target, axis=1)
    holdout_source = np.asarray([
        record["comparisonUtmMetres"] for record in holdouts
    ])
    holdout_target = np.asarray([
        record["referenceUtmMetres"] for record in holdouts
    ])
    holdout_predicted = transform_similarity(
        holdout_source,
        scale,
        rotation,
        translation,
    )
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
    leave_one_out_scales: list[float] = []
    for excluded in range(len(training)):
        keep = np.arange(len(training)) != excluded
        candidate_scale, candidate_rotation, _ = fit_similarity(
            training_source[keep],
            training_target[keep],
        )
        leave_one_out_scales.append(candidate_scale)
        leave_one_out_rotations.append(rotation_degrees(candidate_rotation))
    rotation_parameter_envelope = max(
        abs(value - locked_rotation_degrees) for value in leave_one_out_rotations
    )
    scale_parameter_envelope_ppm = max(
        abs(value - scale) * 1_000_000.0 for value in leave_one_out_scales
    )
    scale_deviation_ppm = (scale - 1.0) * 1_000_000.0
    training_differences = (
        training_target[:, None, :] - training_target[None, :, :]
    )
    training_span_metres = float(
        np.max(np.linalg.norm(training_differences, axis=2))
    )
    local_translation = (
        scale * (rotation @ LOCAL_PIVOT_UTM_METRES)
        + translation
        - LOCAL_PIVOT_UTM_METRES
    )

    accepted_2021_horizontal95_feet = float(
        accepted_frame["uncertainty"]["combinedHorizontalAccuracy95Feet"]
    )
    accepted_2021_orientation95_degrees = float(
        accepted_frame["uncertainty"]["combinedOrientationAccuracy95Degrees"]
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
        and abs(scale_deviation_ppm)
        <= MAXIMUM_ABSOLUTE_SCALE_DEVIATION_PARTS_PER_MILLION
    )
    blockers: list[str] = []
    if combined_horizontal95_feet > 1.0:
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if comparison_vertical95_feet > 1.0:
        blockers.append("VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if combined_orientation95_degrees > 1.0:
        blockers.append("ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")
    if abs(scale_deviation_ppm) > (
        MAXIMUM_ABSOLUTE_SCALE_DEVIATION_PARTS_PER_MILLION
    ):
        blockers.append("SIMILARITY_SCALE_DEVIATION_EXCEEDS_ONE_THOUSAND_PPM")

    stable = {
        "firstConsensusSha256": first_sha256,
        "supplementalConsensusSha256": supplemental_sha256,
        "consumedHoldoutAuditSha256": consumed_sha256,
        "transformDiagnosticSha256": diagnostic_sha256,
        "holdoutInputs": holdout_inputs,
        "scale": scale,
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
            "marlins-2021-to-2024-similarity-final-independent-registration"
        ),
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "firstTrainingConsensus": first_input,
            "supplementalTrainingConsensus": supplemental_input,
            "consumedModelSelectionHoldoutAudit": consumed_input,
            "transformFamilyDiagnostic": diagnostic_input,
            "finalHoldoutConsensuses": holdout_inputs,
            "accepted2021Frame": first["inputs"]["accepted2021Frame"],
            "comparisonSurveyReview": first["inputs"]["comparisonSurveyReview"],
        },
        "controlDesign": {
            "trainingControlCount": len(training),
            "finalHoldoutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "minimumFinalHoldoutSeparationMetres": holdout_separation,
            "minimumTrainingToFinalHoldoutDistanceMetres": (
                training_to_holdout_distance
            ),
            "fitUsesFinalHoldouts": False,
            "trainingControlsConsumedDuringModelSelection": True,
            "finalHoldoutsSelectedBeforeTheirLocalization": True,
            "finalHoldoutResidualsInspectedBeforeSelection": False,
        },
        "lockedTransform": {
            "operation": (
                "map 2024 comparison coordinates into the accepted 2021 UTM frame"
            ),
            "family": "four-parameter similarity transform",
            "scale": scale,
            "scaleDeviationPartsPerMillion": scale_deviation_ppm,
            "rotationMatrix": rotation.tolist(),
            "rotationDegrees": locked_rotation_degrees,
            "translationMetres": translation.tolist(),
            "localPivotUtmMetres": LOCAL_PIVOT_UTM_METRES.tolist(),
            "localTranslationAtPivotMetres": local_translation.tolist(),
            "determinantOfScaledLinearPart": float(scale * scale),
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
            "scaleDeviationPartsPerMillion": scale_deviation_ppm,
            "leaveOneOutScaleParameterEnvelopePartsPerMillion": (
                scale_parameter_envelope_ppm
            ),
            "horizontalCombinationRule": "root sum of squares",
        },
        "registrationAcceptance": {
            "accepted": accepted,
            "scope": (
                "2024 closed-roof LiDAR frame chained through the accepted 2021 "
                "absolute frame with a fresh-holdout-validated similarity transform"
            ),
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
            "orientationThresholdDegrees": 1.0,
            "maximumAbsoluteScaleDeviationPartsPerMillion": (
                MAXIMUM_ABSOLUTE_SCALE_DEVIATION_PARTS_PER_MILLION
            ),
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
    parser.add_argument("consumed_holdout_audit", type=Path)
    parser.add_argument("transform_diagnostic", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("holdout_consensuses", type=Path, nargs="+")
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(
        arguments.first_consensus,
        arguments.supplemental_consensus,
        arguments.consumed_holdout_audit,
        arguments.transform_diagnostic,
        arguments.holdout_consensuses,
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "controlDesign": artifact["controlDesign"],
        "lockedTransform": artifact["lockedTransform"],
        "holdoutValidation": artifact["holdoutValidation"],
        "uncertainty": artifact["uncertainty"],
        "registrationAcceptance": artifact["registrationAcceptance"],
    }, indent=2))


if __name__ == "__main__":
    main()

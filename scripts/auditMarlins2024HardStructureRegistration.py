#!/usr/bin/env python3
"""Audit a locked 2024 LiDAR registration to the 2018 Marlins survey frame."""

from __future__ import annotations

import argparse
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


ANALYSIS_VERSION = "marlins-2024-hard-structure-local-registration-v1"


def validate_partition_rule(records: list[dict[str, Any]]) -> None:
    for record in records:
        suffix = int(record["candidateId"].rsplit("-", 1)[1])
        expected_role = "holdout" if suffix % 4 in {1, 2} else "training"
        if record["role"] != expected_role:
            raise ValueError(
                f"Partition rule mismatch for {record['candidateId']}: "
                f"expected {expected_role}, received {record['role']}"
            )


def build_audit(controls_path: Path) -> dict[str, Any]:
    controls_bytes = controls_path.read_bytes()
    controls = json.loads(controls_bytes)
    supported_review_statuses = {
        "reviewed-2018-2024-hard-structure-lidar-controls",
        "locked-2018-2024-subpixel-hard-structure-controls",
    }
    if controls.get("reviewStatus") not in supported_review_statuses:
        raise ValueError("Hard-structure controls have not passed the 2018 to 2024 review")
    if controls.get("stadiumId") != "marlins":
        raise ValueError("Controls target the wrong stadium")
    queue = validate_input_record(controls["inputs"]["reviewQueue"])
    validate_input_record(controls["inputs"]["reviewSheet"])
    reference_review = validate_input_record(controls["inputs"]["referenceSurveyReview"])
    comparison_review = validate_input_record(controls["inputs"]["comparisonSurveyReview"])
    if not reference_review["conservativeInterpretation"][
        "passesOneFootHorizontalThreshold"
    ]:
        raise ValueError("The 2018 reference does not clear the horizontal gate")
    if comparison_review["gates"]["sourceHorizontalAccuracy"]["pass"]:
        raise ValueError("The raw 2024 source unexpectedly clears the horizontal gate")
    if not comparison_review["gates"]["sourceVerticalAccuracy"]["pass"]:
        raise ValueError("The raw 2024 source does not clear the vertical gate")
    if queue["inputs"]["referenceLidar"]["acquiredOn"] != "2018-06-05":
        raise ValueError("Review queue has the wrong reference epoch")
    if queue["inputs"]["comparisonLidar"]["acquiredOn"] != "2024-02-22":
        raise ValueError("Review queue has the wrong comparison epoch")
    parameters = queue["parameters"]
    if not (
        parameters.get("referenceHorizontalEpsg") == 6346
        and parameters.get("comparisonHorizontalEpsg") == 6438
        and parameters.get("targetHorizontalEpsg") == 6346
        and parameters.get("comparisonFeatureSupportMode") == "all-selected"
    ):
        raise ValueError("Review queue coordinate or feature-support settings are wrong")

    by_id = {candidate["candidateId"]: candidate for candidate in queue["candidates"]}
    subpixel_controls = controls.get("reviewStatus") == (
        "locked-2018-2024-subpixel-hard-structure-controls"
    )
    if not subpixel_controls:
        reviewed_ids = {
            record["candidateId"] for record in controls["controls"]
        } | set(controls["rejectedCandidateIds"])
        if reviewed_ids != set(by_id):
            raise ValueError(
                "Every review-queue candidate must be accepted or rejected exactly once"
            )
    records: list[dict[str, Any]] = []
    for reviewed in controls["controls"]:
        if not subpixel_controls and not reviewed.get("accepted"):
            continue
        candidate_id = reviewed["candidateId"]
        candidate = by_id[candidate_id]
        reference_utm = (
            reviewed["referenceUtmMetres"]
            if subpixel_controls
            else candidate["reference"]["utmMetres"]
        )
        comparison_utm = (
            reviewed["comparisonUtmMetres"]
            if subpixel_controls
            else candidate["comparison"]["utmMetres"]
        )
        records.append({
            "candidateId": candidate_id,
            "role": reviewed["role"],
            "semanticIdentity": reviewed["semanticIdentity"],
            "referenceUtmMetres": reference_utm,
            "comparisonUtmMetres": comparison_utm,
            "referenceLocalMetres": candidate["reference"]["localMetres"],
            "comparisonLocalMetres": (
                (np.asarray(comparison_utm) - LOCAL_PIVOT_UTM_METRES).tolist()
            ),
            "localizationEnvelopeMetres": float(
                reviewed.get("localizationEnvelopeMetres", 0.0)
            ),
            "descriptorDistance": candidate["descriptorDistance"],
            "descriptorRatio": candidate["descriptorRatio"],
        })
    if len({record["candidateId"] for record in records}) != len(records):
        raise ValueError("Duplicate reviewed control identifiers")
    validate_partition_rule(records)
    training = [record for record in records if record["role"] == "training"]
    holdouts = [record for record in records if record["role"] == "holdout"]
    if len(training) < 6 or len(holdouts) < 6:
        raise ValueError("At least six training and six holdout controls are required")

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
    local_translation = (
        rotation @ LOCAL_PIVOT_UTM_METRES
        + translation
        - LOCAL_PIVOT_UTM_METRES
    )
    rotation_parameter_envelope = max(
        abs(value - locked_rotation_degrees)
        for value in leave_one_out_rotations
    )
    differences = training_target[:, None, :] - training_target[None, :, :]
    training_span_metres = float(np.max(np.linalg.norm(differences, axis=2)))
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
        max(record["localizationEnvelopeMetres"] for record in records)
        * FEET_PER_METRE
    )
    holdout_envelope95_feet = max(
        observed_holdout_envelope95_feet,
        control_localization_envelope95_feet,
    )
    combined_horizontal95_feet = math.hypot(
        reference_horizontal95_feet,
        holdout_envelope95_feet,
    )
    holdout_orientation_envelope = math.degrees(
        math.atan2(float(np.max(holdout_residuals)), training_span_metres)
    )
    reference_orientation_envelope = math.degrees(
        math.atan2(reference_horizontal95_feet / FEET_PER_METRE, training_span_metres)
    )
    combined_orientation95_degrees = math.sqrt(
        rotation_parameter_envelope ** 2
        + holdout_orientation_envelope ** 2
        + reference_orientation_envelope ** 2
    )
    measurement_eligible = (
        combined_horizontal95_feet <= 1.0
        and combined_orientation95_degrees <= 1.0
        and comparison_vertical95_feet <= 1.0
        and controls["assessment"]["semanticHardStructureIdentityReviewed"]
        and controls["assessment"]["movableRoofControlsExcluded"]
        and controls["assessment"]["vegetationControlsExcluded"]
    )
    registration_blockers: list[str] = []
    if combined_horizontal95_feet > 1.0:
        registration_blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if comparison_vertical95_feet > 1.0:
        registration_blockers.append("VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if combined_orientation95_degrees > 1.0:
        registration_blockers.append("ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")

    stable = {
        "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
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
        "artifactKind": "hard-structure-registered-2024-lidar-local-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(controls_path),
                "sha256": stable["controlsSha256"],
                "artifactVersion": controls["artifactVersion"],
            },
            "reviewQueue": controls["inputs"]["reviewQueue"],
            "referenceSurveyReview": controls["inputs"]["referenceSurveyReview"],
            "comparisonSurveyReview": controls["inputs"]["comparisonSurveyReview"],
        },
        "controlDesign": {
            "acceptedControlCount": len(records),
            "trainingControlCount": len(training),
            "holdoutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "fitUsesHoldouts": False,
            "partitionRule": (
                controls.get("reviewProtocol", controls.get("selectionProtocol"))[
                    "partitionRule"
                ]
            ),
            "featureSemantics": (
                "manually reviewed fixed engineered roof edges, corners, and fixtures"
            ),
            "movableRoofControlsExcluded": True,
            "vegetationControlsExcluded": True,
        },
        "controlProvenance": {
            "referenceRole": "2018 official sub-foot LiDAR survey frame",
            "comparisonRole": "2024 official closed-roof LiDAR surface",
            "fixedEngineeredFeatureIdentitiesManuallyReviewed": True,
            "fitUsesHeldOutControls": False,
            "spatiallyDisjointHeldOutControls": True,
            "blockers": [],
        },
        "lockedTransform": {
            "operation": (
                "map 2024 comparison UTM coordinates into the 2018 reference UTM frame"
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
            "maximumResidualUsedAsRegistrationEnvelope95Feet": holdout_envelope95_feet,
            "observedMaximumHoldoutResidualFeet": observed_holdout_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": (
                control_localization_envelope95_feet
            ),
            "records": holdouts,
        },
        "uncertainty": {
            "referenceHorizontalAccuracy95Feet": reference_horizontal95_feet,
            "comparisonSourceHorizontalAccuracy95Feet": (
                comparison_source_horizontal95_feet
            ),
            "registrationEnvelope95Feet": holdout_envelope95_feet,
            "observedMaximumHoldoutResidualFeet": observed_holdout_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": (
                control_localization_envelope95_feet
            ),
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal95_feet,
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope,
            "holdoutOrientationEnvelopeDegrees": holdout_orientation_envelope,
            "referenceOrientationEnvelopeDegrees": reference_orientation_envelope,
            "combinedOrientationAccuracy95Degrees": combined_orientation95_degrees,
            "horizontalCombinationRule": "root sum of squares",
            "registrationEnvelopeInterpretation": (
                "The maximum independent held-out feature residual includes paired "
                "raster localization, feature stability, source-frame transformation, "
                "classification differences, and transform fit error."
            ),
        },
        "numericRegistrationAcceptance": {
            "accepted": measurement_eligible,
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
            "orientationThresholdDegrees": 1.0,
            "blockers": registration_blockers,
        },
        "registrationAcceptance": {
            "accepted": measurement_eligible,
            "scope": "2024 local stadium frame registered to the 2018 absolute survey frame",
            "blockers": registration_blockers,
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
    parser.add_argument(
        "controls",
        type=Path,
        nargs="?",
        default=Path(
            "tmp/lidar/marlins-usgs-fl-miamidade-d23/hard-structure-controls-v1.json"
        ),
    )
    parser.add_argument(
        "output",
        type=Path,
        nargs="?",
        default=Path(
            "tmp/lidar/marlins-usgs-fl-miamidade-d23/"
            "hard-structure-local-registration-v1.json"
        ),
    )
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(arguments.controls)
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

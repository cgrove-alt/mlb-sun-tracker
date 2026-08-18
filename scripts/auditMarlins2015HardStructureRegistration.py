#!/usr/bin/env python3
"""Audit a locked 2015 to 2018 Marlins LiDAR local registration."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import (
    artifact_version,
    fit_rigid,
    rotation_degrees,
    sha256_file,
    summary,
    transform_points,
    validate_input_record,
)


ANALYSIS_VERSION = "marlins-2015-hard-structure-local-registration-v1"
FEET_PER_METRE = 3.280839895013123
LOCAL_PIVOT_UTM_METRES = np.asarray([578294.34, 2851288.13])


def read_checksum_locked_json(path: Path, expected_sha256: str) -> dict[str, Any]:
    if sha256_file(path) != expected_sha256:
        raise ValueError(f"Input checksum mismatch: {path}")
    return json.loads(path.read_text())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    controls_bytes = args.controls.read_bytes()
    controls = json.loads(controls_bytes)
    supported_review_statuses = {
        "reviewed-2018-2015-hard-structure-lidar-controls",
        "locked-2018-2015-subpixel-hard-structure-controls",
    }
    if controls.get("reviewStatus") not in supported_review_statuses:
        raise ValueError("Hard-structure controls have not passed the 2015 review")
    if controls.get("stadiumId") != "marlins":
        raise ValueError("Controls target the wrong stadium")
    queue = validate_input_record(controls["inputs"]["reviewQueue"])
    validate_input_record(controls["inputs"]["reviewSheet"])
    reference_review = validate_input_record(
        controls["inputs"]["referenceSurveyReview"]
    )
    comparison_vertical_audit = validate_input_record(
        controls["inputs"]["comparisonVerticalDatumAudit"]
    )
    if queue.get("artifactKind") != "cross-epoch-hard-structure-control-review-queue":
        raise ValueError("Review queue has the wrong artifact kind")
    if queue["inputs"]["referenceLidar"]["acquiredOn"] != "2018-06-05":
        raise ValueError("Review queue reference epoch is wrong")
    if queue["inputs"]["comparisonLidar"]["acquiredOn"] != "2015-02-17":
        raise ValueError("Review queue comparison epoch is wrong")
    if not reference_review["conservativeInterpretation"][
        "passesOneFootHorizontalThreshold"
    ]:
        raise ValueError("Reference survey review does not clear the horizontal gate")
    if comparison_vertical_audit.get("artifactKind") != (
        "noaa-copc-local-vertical-datum-correction-audit"
    ):
        raise ValueError("Comparison vertical datum audit has the wrong kind")
    if not comparison_vertical_audit["assessment"].get(
        "localVerticalCorrectionMeasurementEligible"
    ):
        raise ValueError("Comparison vertical correction is not measurement eligible")

    comparison_controls_path = Path(
        comparison_vertical_audit["inputs"]["controlsPath"]
    )
    comparison_controls = read_checksum_locked_json(
        comparison_controls_path,
        comparison_vertical_audit["inputs"]["controlsSha256"],
    )
    project_horizontal95_feet = float(
        comparison_controls["sourceAccuracy"]["horizontalAccuracy95Feet"]
    )
    if project_horizontal95_feet <= 1.0:
        raise ValueError("Comparison project unexpectedly clears the absolute gate")

    subpixel_controls = controls.get("artifactKind") == (
        "locked-subpixel-hard-structure-controls"
    )
    by_id = {candidate["candidateId"]: candidate for candidate in queue["candidates"]}
    records: list[dict[str, Any]] = []
    for reviewed in controls["controls"]:
        if not subpixel_controls and not reviewed.get("accepted"):
            continue
        candidate_id = reviewed["candidateId"]
        if candidate_id not in by_id:
            raise ValueError(f"Reviewed candidate is absent from queue: {candidate_id}")
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
    training = [record for record in records if record["role"] == "training"]
    holdouts = [record for record in records if record["role"] == "holdout"]
    if len(training) < 6 or len(holdouts) < 6:
        raise ValueError("At least six training and six holdout controls are required")

    training_source = np.asarray(
        [record["comparisonUtmMetres"] for record in training]
    )
    training_target = np.asarray(
        [record["referenceUtmMetres"] for record in training]
    )
    rotation, translation = fit_rigid(training_source, training_target)
    training_predicted = transform_points(training_source, rotation, translation)
    training_residuals = np.linalg.norm(training_predicted - training_target, axis=1)

    holdout_source = np.asarray(
        [record["comparisonUtmMetres"] for record in holdouts]
    )
    holdout_target = np.asarray(
        [record["referenceUtmMetres"] for record in holdouts]
    )
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

    leave_one_out_rotations = []
    for excluded in range(len(training)):
        keep = np.arange(len(training)) != excluded
        candidate_rotation, _ = fit_rigid(
            training_source[keep], training_target[keep]
        )
        leave_one_out_rotations.append(rotation_degrees(candidate_rotation))
    locked_rotation_degrees = rotation_degrees(rotation)
    local_translation = (
        rotation @ LOCAL_PIVOT_UTM_METRES
        + translation
        - LOCAL_PIVOT_UTM_METRES
    )
    rotation_parameter_envelope = max(
        abs(value - locked_rotation_degrees) for value in leave_one_out_rotations
    )
    target_differences = training_target[:, None, :] - training_target[None, :, :]
    training_span_metres = float(
        np.max(np.linalg.norm(target_differences, axis=2))
    )

    reference_horizontal95_feet = float(
        reference_review["conservativeInterpretation"]["horizontalAccuracy95Feet"]
    )
    holdout_residual_envelope95_feet = float(
        np.max(holdout_residuals) * FEET_PER_METRE
    )
    control_localization_envelope95_feet = float(
        max(record["localizationEnvelopeMetres"] for record in records)
        * FEET_PER_METRE
    )
    holdout_envelope95_feet = max(
        holdout_residual_envelope95_feet,
        control_localization_envelope95_feet,
    )
    combined_horizontal95_feet = math.hypot(
        reference_horizontal95_feet, holdout_envelope95_feet
    )
    holdout_orientation_envelope = math.degrees(
        math.atan2(float(np.max(holdout_residuals)), training_span_metres)
    )
    reference_orientation_envelope = math.degrees(
        math.atan2(
            reference_horizontal95_feet / FEET_PER_METRE, training_span_metres
        )
    )
    combined_orientation95_degrees = math.sqrt(
        rotation_parameter_envelope ** 2
        + holdout_orientation_envelope ** 2
        + reference_orientation_envelope ** 2
    )
    comparison_vertical95_feet = float(
        comparison_vertical_audit["verticalCorrection"][
            "combinedVerticalAccuracy95Feet"
        ]
    )
    measurement_eligible = bool(
        combined_horizontal95_feet <= 1.0
        and combined_orientation95_degrees <= 1.0
        and comparison_vertical95_feet <= 1.0
        and controls["assessment"]["semanticHardStructureIdentityReviewed"]
        and controls["assessment"]["movableRoofControlsExcluded"]
        and controls["assessment"]["vegetationControlsExcluded"]
    )
    registration_blockers = []
    if combined_horizontal95_feet > 1.0:
        registration_blockers.append(
            "COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"
        )
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
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "hard-structure-registered-2015-lidar-local-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(args.controls),
                "sha256": stable["controlsSha256"],
                "artifactVersion": controls["artifactVersion"],
            },
            "reviewQueue": controls["inputs"]["reviewQueue"],
            "referenceSurveyReview": controls["inputs"][
                "referenceSurveyReview"
            ],
            "comparisonVerticalDatumAudit": controls["inputs"][
                "comparisonVerticalDatumAudit"
            ],
            "comparisonSourceAccuracyControls": {
                "path": str(comparison_controls_path),
                "sha256": comparison_vertical_audit["inputs"]["controlsSha256"],
            },
        },
        "controlDesign": {
            "acceptedControlCount": len(records),
            "trainingControlCount": len(training),
            "holdoutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
            "fitUsesHoldouts": False,
            "featureSemantics": "manually reviewed fixed adjacent-building roof edges and corners",
            "movableRoofControlsExcluded": True,
            "vegetationControlsExcluded": True,
        },
        "lockedTransform": {
            "operation": "map 2015 comparison UTM coordinates into the 2018 reference UTM frame",
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
            "observedMaximumHoldoutResidualFeet": holdout_residual_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": control_localization_envelope95_feet,
            "records": holdouts,
        },
        "uncertainty": {
            "comparisonProjectReportedHorizontal95Feet": project_horizontal95_feet,
            "referenceHorizontalAccuracy95Feet": reference_horizontal95_feet,
            "registrationEnvelope95Feet": holdout_envelope95_feet,
            "observedMaximumHoldoutResidualFeet": holdout_residual_envelope95_feet,
            "maximumControlLocalizationEnvelopeFeet": control_localization_envelope95_feet,
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal95_feet,
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope,
            "holdoutOrientationEnvelopeDegrees": holdout_orientation_envelope,
            "referenceOrientationEnvelopeDegrees": reference_orientation_envelope,
            "combinedOrientationAccuracy95Degrees": combined_orientation95_degrees,
            "horizontalCombinationRule": "root sum of squares",
            "registrationEnvelopeInterpretation": "The maximum independent held-out feature residual includes raster localization, feature stability, classification differences, and transform fit error.",
        },
        "numericRegistrationAcceptance": {
            "accepted": measurement_eligible,
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
            "orientationThresholdDegrees": 1.0,
            "blockers": registration_blockers,
        },
        "geometryBoundary": {
            "establishesLocalMetricFrame": measurement_eligible,
            "establishesMeasuredRowGeometry": False,
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesCurrentGeometry": False,
            "establishesCompleteCurrentObstructionGeometry": False,
        },
        "assessment": {
            "localHorizontalRegistrationMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                *registration_blockers,
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "2015_GEOMETRY_CURRENCY_IS_STALE",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": "Independent held-out permanent-building controls test whether the 2015 stadium-local frame can supersede its project-wide horizontal limit. This does not establish row identity, current geometry, or shadow accuracy.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ROW_GEOMETRY_NOT_COMPLETE",
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_GEOMETRY_NOT_ESTABLISHED",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "lockedTransform": artifact["lockedTransform"],
        "trainingValidation": artifact["trainingValidation"],
        "holdoutValidation": artifact["holdoutValidation"],
        "uncertainty": artifact["uncertainty"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

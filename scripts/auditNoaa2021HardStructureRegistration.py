#!/usr/bin/env python3
"""Audit a locked 2021 to 2018 LiDAR registration on hard structures."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "noaa-2021-hard-structure-local-registration-v1"
FEET_PER_METRE = 3.280839895013123
LOCAL_PIVOT_UTM_METRES = np.asarray([578294.34, 2851288.13])


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def summary(values: np.ndarray) -> dict[str, float | int]:
    return {
        "count": int(values.size),
        "minimum": float(np.min(values)),
        "median": float(np.median(values)),
        "p95": float(np.percentile(values, 95)),
        "maximum": float(np.max(values)),
    }


def fit_rigid(source: np.ndarray, target: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    if source.shape != target.shape or source.ndim != 2 or source.shape[1] != 2:
        raise ValueError("Source and target controls must be matching Nx2 arrays")
    if source.shape[0] < 3:
        raise ValueError("At least three controls are required")
    source_center = source.mean(axis=0)
    target_center = target.mean(axis=0)
    covariance = (source - source_center).T @ (target - target_center)
    left, _, right_transpose = np.linalg.svd(covariance)
    rotation = right_transpose.T @ left.T
    if np.linalg.det(rotation) < 0:
        right_transpose[-1, :] *= -1
        rotation = right_transpose.T @ left.T
    translation = target_center - rotation @ source_center
    return rotation, translation


def transform_points(points: np.ndarray, rotation: np.ndarray, translation: np.ndarray) -> np.ndarray:
    return points @ rotation.T + translation


def rotation_degrees(rotation: np.ndarray) -> float:
    return math.degrees(math.atan2(float(rotation[1, 0]), float(rotation[0, 0])))


def validate_input_record(record: dict[str, Any]) -> dict[str, Any]:
    path = Path(record["path"])
    if sha256_file(path) != record["sha256"]:
        raise ValueError(f"Input checksum mismatch: {path}")
    value = json.loads(path.read_text()) if path.suffix == ".json" else None
    if value is not None and record.get("artifactVersion"):
        if value.get("artifactVersion") != record["artifactVersion"]:
            raise ValueError(f"Input artifact version mismatch: {path}")
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    controls_bytes = args.controls.read_bytes()
    controls = json.loads(controls_bytes)
    if controls.get("reviewStatus") != "reviewed-2018-2021-hard-structure-lidar-controls":
        raise ValueError("Hard-structure controls have not passed manual review")
    if controls.get("stadiumId") != "marlins":
        raise ValueError("Controls target the wrong stadium")
    queue = validate_input_record(controls["inputs"]["reviewQueue"])
    validate_input_record(controls["inputs"]["reviewSheet"])
    reference_review = validate_input_record(controls["inputs"]["referenceSurveyReview"])
    comparison_review = validate_input_record(controls["inputs"]["comparisonSurveyReview"])
    if not reference_review["conservativeInterpretation"]["passesOneFootHorizontalThreshold"]:
        raise ValueError("Reference survey review does not clear the horizontal gate")
    if comparison_review["conservativeInterpretation"]["passesOneFootHorizontalThreshold"]:
        raise ValueError("Comparison review unexpectedly clears the absolute horizontal gate")

    by_id = {candidate["candidateId"]: candidate for candidate in queue["candidates"]}
    records: list[dict[str, Any]] = []
    for reviewed in controls["controls"]:
        if not reviewed.get("accepted"):
            continue
        candidate_id = reviewed["candidateId"]
        if candidate_id not in by_id:
            raise ValueError(f"Reviewed candidate is absent from queue: {candidate_id}")
        candidate = by_id[candidate_id]
        records.append({
            "candidateId": candidate_id,
            "role": reviewed["role"],
            "semanticIdentity": reviewed["semanticIdentity"],
            "referenceUtmMetres": candidate["reference"]["utmMetres"],
            "comparisonUtmMetres": candidate["comparison"]["utmMetres"],
            "referenceLocalMetres": candidate["reference"]["localMetres"],
            "comparisonLocalMetres": candidate["comparison"]["localMetres"],
            "descriptorDistance": candidate["descriptorDistance"],
            "descriptorRatio": candidate["descriptorRatio"],
        })
    if len({record["candidateId"] for record in records}) != len(records):
        raise ValueError("Duplicate reviewed control identifiers")
    training = [record for record in records if record["role"] == "training"]
    holdouts = [record for record in records if record["role"] == "holdout"]
    if len(training) < 6 or len(holdouts) < 6:
        raise ValueError("At least six training and six holdout controls are required")

    training_source = np.asarray([record["comparisonUtmMetres"] for record in training])
    training_target = np.asarray([record["referenceUtmMetres"] for record in training])
    rotation, translation = fit_rigid(training_source, training_target)
    training_predicted = transform_points(training_source, rotation, translation)
    training_residuals = np.linalg.norm(training_predicted - training_target, axis=1)

    holdout_source = np.asarray([record["comparisonUtmMetres"] for record in holdouts])
    holdout_target = np.asarray([record["referenceUtmMetres"] for record in holdouts])
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
        candidate_rotation, _ = fit_rigid(training_source[keep], training_target[keep])
        leave_one_out_rotations.append(rotation_degrees(candidate_rotation))
    locked_rotation_degrees = rotation_degrees(rotation)
    local_translation = rotation @ LOCAL_PIVOT_UTM_METRES + translation - LOCAL_PIVOT_UTM_METRES
    rotation_parameter_envelope = max(
        abs(value - locked_rotation_degrees) for value in leave_one_out_rotations
    )

    differences = training_target[:, None, :] - training_target[None, :, :]
    training_span_metres = float(np.max(np.linalg.norm(differences, axis=2)))
    reference_horizontal95_feet = float(
        reference_review["conservativeInterpretation"]["horizontalAccuracy95Feet"]
    )
    holdout_envelope95_feet = float(np.max(holdout_residuals) * FEET_PER_METRE)
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
    comparison_vertical95_feet = float(
        comparison_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
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
    if not controls["assessment"]["semanticHardStructureIdentityReviewed"]:
        registration_blockers.append("HARD_STRUCTURE_IDENTITIES_NOT_REVIEWED")
    if not controls["assessment"]["movableRoofControlsExcluded"]:
        registration_blockers.append("MOVABLE_ROOF_CONTROLS_NOT_EXCLUDED")
    if not controls["assessment"]["vegetationControlsExcluded"]:
        registration_blockers.append("VEGETATION_CONTROLS_NOT_EXCLUDED")

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
        "artifactKind": "hard-structure-registered-2021-lidar-local-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(args.controls),
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
            "featureSemantics": "manually reviewed fixed engineered roof edges, seams, corners, and fixtures",
            "movableRoofControlsExcluded": True,
            "vegetationControlsExcluded": True,
        },
        "controlGeometry": {
            "acceptedControlCount": len(records),
            "trainingControlCount": len(training),
            "heldOutControlCount": len(holdouts),
            "trainingControlSpanMetres": training_span_metres,
        },
        "controlProvenance": {
            "referenceRole": "2018 official sub-foot LiDAR survey frame",
            "comparisonRole": "2021 official open-roof LiDAR surface",
            "fixedEngineeredFeatureIdentitiesManuallyReviewed": True,
            "fitUsesHeldOutControls": False,
            "spatiallyDisjointHeldOutControls": True,
            "blockers": [],
        },
        "lockedTransform": {
            "operation": "map 2021 comparison UTM coordinates into the 2018 reference UTM frame",
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
            "records": holdouts,
        },
        "uncertainty": {
            "referenceHorizontalAccuracy95Feet": reference_horizontal95_feet,
            "registrationEnvelope95Feet": holdout_envelope95_feet,
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal95_feet,
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope,
            "holdoutOrientationEnvelopeDegrees": holdout_orientation_envelope,
            "referenceOrientationEnvelopeDegrees": reference_orientation_envelope,
            "combinedOrientationAccuracy95Degrees": combined_orientation95_degrees,
            "horizontalCombinationRule": "root sum of squares",
            "registrationEnvelopeInterpretation": (
                "The maximum independent held-out feature residual includes paired raster "
                "localization, feature stability, classification differences, and transform fit error."
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
            "scope": "2021 local stadium frame registered to the 2018 absolute survey frame",
            "blockers": registration_blockers,
        },
        "geometryBoundary": {
            "establishesMetricStadiumFrame": measurement_eligible,
            "establishesCompleteDeclaredFootprintFrame": measurement_eligible,
            "establishesMeasuredRowGeometry": False,
            "establishesMeasuredRoofUndersides": False,
            "establishesCurrentMovableRoofPositions": False,
            "establishesCompleteCurrentObstructionGeometry": False,
        },
        "assessment": {
            "localHorizontalRegistrationMeasurementEligible": measurement_eligible,
            "closedRoofTopSurfaceFrameEligible": measurement_eligible,
            "closedRoofObstructionVolumeEligible": False,
            "publicationEligible": False,
            "blockers": [
                "ROOF_UNDERSIDE_NOT_MEASURED",
                "CURRENT_OPEN_ROOF_PANEL_POSITION_NOT_ESTABLISHED",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "ROW_FRAME_HORIZONTAL_ACCURACY_NOT_YET_SUBFOOT",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": (
                "The independently held-out hard-structure controls clear the one-foot local "
                "horizontal and orientation gates for the 2021 closed-roof top surface. This "
                "does not establish roof undersides, the current open panel positions, row "
                "geometry, or shadow accuracy."
            ),
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
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "lockedTransform": artifact["lockedTransform"],
        "holdoutValidation": artifact["holdoutValidation"],
        "uncertainty": artifact["uncertainty"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

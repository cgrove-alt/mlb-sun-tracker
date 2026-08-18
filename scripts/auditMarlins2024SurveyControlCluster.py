#!/usr/bin/env python3
"""Audit the modern Marlins survey-control cluster without overstating it.

The official GS0071 ground control can train a local vertical correction and
GS0072 can test that correction as an independent urban checkpoint. A reviewed
sidewalk edge also provides a one-axis horizontal diagnostic. The public points
do not identify a second horizontal component, so this artifact must fail the
full horizontal and orientation gates.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS

from renderLidarControlRaster import axis_metres_per_unit


ANALYSIS_VERSION = "marlins-2024-survey-control-cluster-audit-v1"
US_SURVEY_FOOT_METRES = 1200.0 / 3937.0
INTERNATIONAL_FOOT_METRES = 0.3048
MAXIMUM_POSITION_ERROR_FEET = 1.0
MAXIMUM_ORIENTATION_ERROR_DEGREES = 1.0
MINIMUM_INDEPENDENT_NONVEGETATED_HOLDOUTS = 3


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def validate_file_lock(lock: dict[str, Any], label: str) -> Path:
    path = Path(str(lock.get("path", "")))
    expected = str(lock.get("sha256", ""))
    if not path.is_file() or len(expected) != 64:
        raise ValueError(f"{label} lacks a valid file lock")
    actual = file_sha256(path)
    if actual != expected:
        raise ValueError(f"{label} checksum mismatch: {path}")
    return path


def validate_review(review: dict[str, Any]) -> None:
    if review.get("artifactKind") != "marlins-2024-survey-control-cluster-review":
        raise ValueError("Review has the wrong artifact kind")
    if review.get("reviewStatus") != "locked-exploratory-one-axis-control-review":
        raise ValueError("Review is not locked")
    declared = review.get("artifactVersion")
    stable = {key: value for key, value in review.items() if key != "artifactVersion"}
    if declared != artifact_version(stable):
        raise ValueError("Review artifactVersion does not match its stable contents")
    controls = review.get("surveyControls", [])
    if [control.get("pointId") for control in controls] != ["GS0071", "GS0072"]:
        raise ValueError("Review must lock GS0071 and GS0072 in that order")
    if [control.get("analysisRole") for control in controls] != ["training", "holdout"]:
        raise ValueError("Review must reserve GS0072 as the holdout")
    cross_track = review.get("crossTrackReview", {})
    if cross_track.get("axis") != "easting":
        raise ValueError("The reviewed horizontal component must be easting")
    if cross_track.get("northingCorrespondenceIdentifiable") is not False:
        raise ValueError("Review must not claim an identifiable northing correspondence")
    if cross_track.get("orientationIdentifiable") is not False:
        raise ValueError("Review must not claim an identifiable orientation")
    if cross_track.get("holdoutBlindLockedBeforeInspection") is not False:
        raise ValueError("Review must preserve the honest horizontal holdout limitation")


def median_ground_height(samples: np.ndarray) -> float:
    values = np.asarray(samples, dtype=float)
    if values.ndim != 1 or len(values) < 3 or not np.all(np.isfinite(values)):
        raise ValueError("At least three finite ground samples are required")
    return float(np.median(values))


def vertical_training_holdout(
    training_lidar_height: float,
    training_survey_height: float,
    holdout_lidar_height: float,
    holdout_survey_height: float,
) -> dict[str, float]:
    correction = float(training_survey_height - training_lidar_height)
    corrected_holdout = float(holdout_lidar_height + correction)
    residual = float(corrected_holdout - holdout_survey_height)
    return {
        "trainingCorrectionUsSurveyFeet": correction,
        "correctedHoldoutHeightUsSurveyFeet": corrected_holdout,
        "holdoutResidualUsSurveyFeet": residual,
        "holdoutAbsoluteResidualUsSurveyFeet": abs(residual),
    }


def read_control_ground_samples(
    lidar_path: Path,
    controls: list[dict[str, Any]],
) -> tuple[dict[str, np.ndarray], dict[str, Any]]:
    collected: dict[str, list[np.ndarray]] = {
        str(control["pointId"]): [] for control in controls
    }
    with laspy.open(lidar_path) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None:
            raise ValueError("LiDAR source has no embedded CRS")
        horizontal_crs = CRS.from_user_input(
            source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
        )
        vertical_crs = CRS.from_user_input(
            source_crs.sub_crs_list[1] if source_crs.is_compound else source_crs
        )
        horizontal_factor, horizontal_unit = axis_metres_per_unit(horizontal_crs)
        vertical_factor, vertical_unit = axis_metres_per_unit(vertical_crs)
        if horizontal_crs.to_epsg() != 6438:
            raise ValueError("LiDAR horizontal CRS is not EPSG:6438")
        if not math.isclose(horizontal_factor, US_SURVEY_FOOT_METRES, abs_tol=1e-15):
            raise ValueError("LiDAR horizontal units are not US survey feet")
        if not math.isclose(vertical_factor, US_SURVEY_FOOT_METRES, abs_tol=1e-15):
            raise ValueError("LiDAR vertical units are not US survey feet")
        for points in source.chunk_iterator(2_000_000):
            x_values = np.asarray(points.x)
            y_values = np.asarray(points.y)
            z_values = np.asarray(points.z)
            classifications = np.asarray(points.classification)
            for control in controls:
                radius = float(control["sampleRadiusUsSurveyFeet"])
                squared_distance = (
                    (x_values - float(control["eastingUsSurveyFeet"])) ** 2
                    + (y_values - float(control["northingUsSurveyFeet"])) ** 2
                )
                selected = (classifications == 2) & (squared_distance <= radius * radius)
                if selected.any():
                    collected[str(control["pointId"])].append(z_values[selected])
    output: dict[str, np.ndarray] = {}
    for point_id, chunks in collected.items():
        if not chunks:
            raise ValueError(f"No class-2 ground samples found for {point_id}")
        output[point_id] = np.concatenate(chunks)
    return output, {
        "embeddedCoordinateReferenceSystem": source_crs.to_wkt(),
        "horizontalEpsg": horizontal_crs.to_epsg(),
        "horizontalUnit": horizontal_unit,
        "horizontalMetresPerUnit": horizontal_factor,
        "verticalUnit": vertical_unit,
        "verticalMetresPerUnit": vertical_factor,
    }


def build_audit(review_path: Path) -> dict[str, Any]:
    review_bytes = review_path.read_bytes()
    review = json.loads(review_bytes)
    validate_review(review)
    locked_paths = {
        label: validate_file_lock(lock, label)
        for label, lock in review["inputs"].items()
    }
    plan_frame = json.loads(locked_paths["orthophotoPlanFrameAudit"].read_bytes())
    expected_plan_version = review["inputs"]["orthophotoPlanFrameAudit"][
        "artifactVersion"
    ]
    if plan_frame.get("artifactVersion") != expected_plan_version:
        raise ValueError("Orthophoto plan-frame artifactVersion mismatch")
    if plan_frame.get("accuracyAssessment", {}).get(
        "officialDatasetPlanFrameAccepted"
    ) is not True:
        raise ValueError("Orthophoto plan frame is not accepted")
    plan_frame_accuracy = float(
        plan_frame["accuracyAssessment"]["officialDatasetHorizontalAccuracy95Feet"]
    )

    controls = review["surveyControls"]
    samples, lidar_crs = read_control_ground_samples(locked_paths["lidar"], controls)
    vertical_records: list[dict[str, Any]] = []
    medians: dict[str, float] = {}
    for control in controls:
        point_id = str(control["pointId"])
        values = samples[point_id]
        median = median_ground_height(values)
        medians[point_id] = median
        survey_height = float(control["orthometricHeightUsSurveyFeet"])
        vertical_records.append({
            "pointId": point_id,
            "sourceRole": control["sourceRole"],
            "analysisRole": control["analysisRole"],
            "sampleRadiusUsSurveyFeet": float(control["sampleRadiusUsSurveyFeet"]),
            "class2SampleCount": int(len(values)),
            "lidarMedianHeightUsSurveyFeet": median,
            "surveyHeightUsSurveyFeet": survey_height,
            "rawResidualUsSurveyFeet": float(median - survey_height),
        })
    vertical_fit = vertical_training_holdout(
        medians["GS0071"],
        float(controls[0]["orthometricHeightUsSurveyFeet"]),
        medians["GS0072"],
        float(controls[1]["orthometricHeightUsSurveyFeet"]),
    )
    international_feet_per_us_survey_foot = (
        US_SURVEY_FOOT_METRES / INTERNATIONAL_FOOT_METRES
    )
    vertical_holdout_abs_feet = (
        vertical_fit["holdoutAbsoluteResidualUsSurveyFeet"]
        * international_feet_per_us_survey_foot
    )

    cross_track = review["crossTrackReview"]
    training = cross_track["training"]
    holdout = cross_track["diagnosticHoldout"]
    easting_correction = float(
        training["orthophotoEdgeEastingUsSurveyFeet"]
        - training["lidarEdgeEastingUsSurveyFeet"]
    )
    corrected_holdout = float(
        holdout["lidarEdgeEastingUsSurveyFeet"] + easting_correction
    )
    holdout_residual_us_survey_feet = float(
        corrected_holdout - holdout["orthophotoEdgeEastingUsSurveyFeet"]
    )
    cross_track_residual_feet = (
        abs(holdout_residual_us_survey_feet)
        * international_feet_per_us_survey_foot
    )
    sum_of_quantified_terms_feet = cross_track_residual_feet + plan_frame_accuracy

    stable = {
        "artifactKind": "marlins-2024-survey-control-cluster-audit",
        "stadiumId": "marlins",
        "inputs": {
            "review": {
                "path": str(review_path),
                "sha256": hashlib.sha256(review_bytes).hexdigest(),
                "artifactVersion": review["artifactVersion"],
            },
            **{
                label: {
                    "path": str(path),
                    "sha256": review["inputs"][label]["sha256"],
                }
                for label, path in locked_paths.items()
            },
        },
        "coordinateReferenceSystem": lidar_crs,
        "verticalAudit": {
            "estimator": "median class-2 LiDAR height inside the locked radius",
            "controls": vertical_records,
            **vertical_fit,
            "holdoutAbsoluteResidualInternationalFeet": vertical_holdout_abs_feet,
            "trainingControlCount": 1,
            "independentNonVegetatedHoldoutCount": 1,
            "holdoutWasExcludedFromFit": True,
        },
        "horizontalAudit": {
            "status": "one-axis-diagnostic-only",
            "axis": "easting",
            "feature": cross_track["feature"],
            "trainingCorrectionUsSurveyFeet": easting_correction,
            "diagnosticHoldoutCorrectedEastingUsSurveyFeet": corrected_holdout,
            "diagnosticHoldoutResidualUsSurveyFeet": holdout_residual_us_survey_feet,
            "diagnosticHoldoutAbsoluteResidualInternationalFeet": cross_track_residual_feet,
            "orthophotoPlanFrameAccuracy95Feet": plan_frame_accuracy,
            "sumOfQuantifiedCrossTrackTermsFeet": sum_of_quantified_terms_feet,
            "completeCrossTrackUncertainty95Feet": None,
            "edgeSelectionUncertainty95Feet": cross_track[
                "edgeSelectionUncertainty95Feet"
            ],
            "northingCorrectionUsSurveyFeet": None,
            "orientationCorrectionDegrees": None,
            "northingCorrespondenceIdentifiable": False,
            "orientationIdentifiable": False,
            "horizontalHoldoutBlindLockedBeforeInspection": False,
        },
        "thresholds": {
            "maximumHorizontalErrorFeet": MAXIMUM_POSITION_ERROR_FEET,
            "maximumVerticalErrorFeet": MAXIMUM_POSITION_ERROR_FEET,
            "maximumOrientationErrorDegrees": MAXIMUM_ORIENTATION_ERROR_DEGREES,
            "minimumIndependentNonVegetatedHoldouts": (
                MINIMUM_INDEPENDENT_NONVEGETATED_HOLDOUTS
            ),
        },
        "gates": {
            "singleVerticalHoldoutResidualWithinOneFoot": (
                vertical_holdout_abs_feet <= MAXIMUM_POSITION_ERROR_FEET
            ),
            "minimumIndependentNonVegetatedHoldoutCountPassed": False,
            "crossTrackUncertaintyFullyQuantified": False,
            "twoDimensionalHorizontalRegistrationPassed": False,
            "orientationWithinOneDegreeEstablished": False,
        },
        "interpretation": {
            "usableEvidence": [
                "A training-only vertical correction transfers to the independent GS0072 checkpoint with a residual below one foot.",
                "The reviewed sidewalk edge shows similar easting correction at the training and diagnostic locations.",
            ],
            "prohibitedInferences": [
                "Do not treat the easting result as a two-dimensional horizontal registration.",
                "Do not infer orientation from this nearly straight sidewalk edge.",
                "Do not use this artifact by itself for row or shade publication.",
            ],
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ALONG_STREET_HORIZONTAL_COMPONENT_NOT_IDENTIFIABLE",
                "ONLY_ONE_INDEPENDENT_NONVEGETATED_HOLDOUT",
                "HORIZONTAL_2D_REGISTRATION_NOT_PASSED",
                "ORIENTATION_NOT_ESTABLISHED",
                "CROSS_TRACK_EDGE_LOCALIZATION_UNCERTAINTY_NOT_QUANTIFIED",
                "HORIZONTAL_DIAGNOSTIC_HOLDOUT_NOT_BLIND_LOCKED",
                "ROW_GEOMETRY_NOT_VALIDATED_BY_THIS_ARTIFACT",
                "SHADOW_VALIDATION_NOT_IN_SCOPE",
            ],
        },
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactVersion": artifact_version(stable),
        **stable,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    artifact = build_audit(arguments.review)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "verticalHoldoutResidualFeet": artifact["verticalAudit"][
            "holdoutAbsoluteResidualInternationalFeet"
        ],
        "horizontalStatus": artifact["horizontalAudit"]["status"],
        "publicationEligible": artifact["publication"]["eligible"],
        "blockers": artifact["publication"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()

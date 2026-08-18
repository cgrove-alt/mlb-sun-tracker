#!/usr/bin/env python3
"""Calibrate a panorama provider frame to true north from mapped row axes.

The position registration may contain scale and shear, so its affine matrix is
used only to disambiguate the 180 degree row-axis direction. The orientation is
estimated from independent mapped row major axes. Provider x and z remain an
orthogonal metric pair, as established by the panorama-frame calibration.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any

import numpy as np

from registerCurrentRowsBySection import (
    control_row_geometry,
    normalized_key,
    venue_row_geometry,
)


ANALYSIS_VERSION = "provider-horizontal-true-north-orientation-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("section_registration", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section-id", default="123")
    parser.add_argument("--minimum-row-number", type=int, default=24)
    parser.add_argument("--maximum-row-number", type=int, default=34)
    parser.add_argument("--maximum-holdout-p95-degrees", type=float, default=1.0)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def compass_bearing(vector_east_north: np.ndarray) -> float:
    return float(
        math.degrees(math.atan2(vector_east_north[0], vector_east_north[1])) % 360.0
    )


def angular_difference(first: float, second: float) -> float:
    return float((first - second + 180.0) % 360.0 - 180.0)


def circular_mean_degrees(values: list[float]) -> float:
    radians = np.radians(np.asarray(values, dtype=float))
    return float(
        math.degrees(math.atan2(float(np.mean(np.sin(radians))), float(np.mean(np.cos(radians)))))
        % 360.0
    )


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def main() -> None:
    args = parse_args()
    control = json.loads(args.row_control.read_text())
    venue = json.loads(args.venue_rows.read_text())
    registration = json.loads(args.section_registration.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama-frame calibration is not measurement eligible")
    section_fit = registration["sectionFits"].get(args.section_id)
    if not section_fit or not section_fit.get("measurementEligible"):
        raise ValueError("Section registration is not measurement eligible")

    control_by_key: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for feature in control["features"]:
        attributes = feature["attributes"]
        control_by_key[
            normalized_key(attributes.get("section"), attributes.get("row"))
        ].append(feature)

    affine = np.asarray(section_fit["affineParameters"], dtype=float)
    affine_x_bearing = compass_bearing(affine[0])
    records = []
    for row in venue["rows"]:
        if str(row["sectionId"]) != args.section_id:
            continue
        try:
            row_number = int(row["rowId"])
        except ValueError:
            continue
        if not args.minimum_row_number <= row_number <= args.maximum_row_number:
            continue
        row_key = normalized_key(row["sectionId"], row["rowId"])
        features = control_by_key.get(row_key)
        if not features:
            continue
        source = venue_row_geometry(row)
        target = control_row_geometry(features)
        if target is None:
            continue
        source_vector = source["endpoints"][1] - source["endpoints"][0]
        if abs(source_vector[0]) < 1e-9:
            raise ValueError(f"Provider row axis is degenerate for {row_key}")
        target_axis = target["endpoints"][1] - target["endpoints"][0]
        target_bearing = compass_bearing(target_axis)
        candidates = [target_bearing, (target_bearing + 180.0) % 360.0]
        provider_positive_x_target_bearing = min(
            candidates,
            key=lambda bearing: abs(angular_difference(bearing, affine_x_bearing)),
        )
        holdout = row_number % 3 == 0
        records.append({
            "rowKey": row_key,
            "partition": "holdout" if holdout else "training",
            "providerPositiveXTrueBearingDegrees": provider_positive_x_target_bearing,
            "mappedRowLengthMetres": float(np.linalg.norm(target_axis)),
        })
    training = [
        record["providerPositiveXTrueBearingDegrees"]
        for record in records
        if record["partition"] == "training"
    ]
    holdout = [
        record["providerPositiveXTrueBearingDegrees"]
        for record in records
        if record["partition"] == "holdout"
    ]
    if len(training) < 5 or len(holdout) < 3:
        raise ValueError("Orientation calibration needs at least five training and three holdout rows")
    provider_x_bearing = circular_mean_degrees(training)
    provider_z_candidates = [
        (provider_x_bearing + 90.0) % 360.0,
        (provider_x_bearing - 90.0) % 360.0,
    ]
    affine_z_bearing = compass_bearing(affine[1])
    provider_z_bearing = min(
        provider_z_candidates,
        key=lambda bearing: abs(angular_difference(bearing, affine_z_bearing)),
    )
    training_residual = np.asarray([
        abs(angular_difference(value, provider_x_bearing))
        for value in training
    ])
    holdout_residual = np.asarray([
        abs(angular_difference(value, provider_x_bearing))
        for value in holdout
    ])
    holdout_p95 = float(np.percentile(holdout_residual, 95))
    panorama_angle_p95 = float(
        calibration["holdoutSummary"]["angularErrorDegrees"]["p95"]
    )
    combined_angle_p95 = math.hypot(holdout_p95, panorama_angle_p95)
    measurement_eligible = bool(
        holdout_p95 <= args.maximum_holdout_p95_degrees
        and combined_angle_p95 <= 1.0
    )
    for record in records:
        record["absoluteResidualFromTrainingBearingDegrees"] = round(
            abs(angular_difference(
                record["providerPositiveXTrueBearingDegrees"],
                provider_x_bearing,
            )),
            9,
        )

    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "section-local-provider-horizontal-orientation-to-true-north",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "rowControl": {"path": str(args.row_control), "sha256": file_sha256(args.row_control), "artifactVersion": control["artifactVersion"]},
            "venueRows": {"path": str(args.venue_rows), "sha256": file_sha256(args.venue_rows), "artifactVersion": venue["artifactVersion"]},
            "sectionRegistration": {"path": str(args.section_registration), "sha256": file_sha256(args.section_registration), "artifactVersion": registration["artifactVersion"]},
            "panoramaCalibration": {"path": str(args.panorama_calibration), "sha256": file_sha256(args.panorama_calibration), "artifactVersion": calibration["artifactVersion"]},
        },
        "parameters": {
            "sectionId": args.section_id,
            "minimumRowNumber": args.minimum_row_number,
            "maximumRowNumber": args.maximum_row_number,
            "holdoutRule": "integer row number modulo 3 equals zero",
            "maximumHoldoutP95Degrees": args.maximum_holdout_p95_degrees,
            "affineUseRestriction": "used only to choose the 180 degree row-axis direction, never as a physical direction transform",
        },
        "orientation": {
            "providerPositiveXTrueBearingDegrees": round(provider_x_bearing, 9),
            "providerPositiveZTrueBearingDegrees": round(provider_z_bearing, 9),
            "providerPositiveYDirection": "up",
            "horizontalBasisRule": "provider x and z are held orthogonal in the independently calibrated metric panorama frame",
            "affinePositiveXBearingForSignOnlyDegrees": round(affine_x_bearing, 9),
            "affinePositiveZBearingForSignOnlyDegrees": round(affine_z_bearing, 9),
        },
        "crossValidation": {
            "trainingRowCount": len(training),
            "holdoutRowCount": len(holdout),
            "trainingAbsoluteAngularResidualDegrees": values_summary(training_residual),
            "holdoutAbsoluteAngularResidualDegrees": values_summary(holdout_residual),
            "panoramaFrameHoldoutAngleP95Degrees": round(panorama_angle_p95, 9),
            "combinedOrientationP95Degrees": round(combined_angle_p95, 9),
            "rows": records,
        },
        "assessment": {
            "sectionLocalTrueNorthOrientationMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "ORIENTATION_SCOPE_IS_SECTION_LOCAL",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    stable = dict(artifact)
    stable.pop("artifactVersion")
    artifact["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "providerPositiveXTrueBearingDegrees": round(provider_x_bearing, 9),
        "providerPositiveZTrueBearingDegrees": round(provider_z_bearing, 9),
        "trainingAngularP95Degrees": values_summary(training_residual)["p95"],
        "holdoutAngularP95Degrees": values_summary(holdout_residual)["p95"],
        "combinedOrientationP95Degrees": round(combined_angle_p95, 9),
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

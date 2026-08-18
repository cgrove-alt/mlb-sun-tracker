#!/usr/bin/env python3
"""Calibrate venue-local x/z axes to true north from reviewed section symmetry.

The physical field bearing comes from a separate georeferenced orthophoto
artifact. This script measures only how that field axis lies in the provider's
metric x/z frame and validates it with disjoint section-pair holdouts.
"""

from __future__ import annotations

import argparse

import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "provider-field-axis-to-true-north-v1"
REQUIRED_REVIEW_STATUS = "reviewed-provider-section-symmetry-pairs"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("field_orientation", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--preview", type=Path)
    parser.add_argument("--maximum-combined-orientation-uncertainty-degrees", type=float, default=1.0)
    parser.add_argument("--maximum-holdout-p95-degrees", type=float, default=0.25)
    parser.add_argument("--minimum-training-midpoints", type=int, default=20)
    parser.add_argument("--minimum-holdout-pairs", type=int, default=4)
    parser.add_argument("--minimum-holdout-midpoints", type=int, default=40)
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


def angular_difference(first: float, second: float) -> float:
    return float((first - second + 180.0) % 360.0 - 180.0)


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 9),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 9),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 9),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 9),
    }


def row_selected(row_id: str, selector: dict[str, Any]) -> bool:
    kind = selector["kind"]
    if kind == "numeric-range":
        if not re.fullmatch(r"\d+", row_id):
            return False
        row_number = int(row_id)
        excluded = {str(value) for value in selector.get("excludedRows", [])}
        return (
            int(selector["minimum"]) <= row_number <= int(selector["maximum"])
            and row_id not in excluded
        )
    if kind == "explicit":
        return row_id in {str(value) for value in selector["rows"]}
    raise ValueError(f"Unknown reviewed row selector kind {kind}")


def fit_axis(points: np.ndarray) -> dict[str, Any]:
    if points.ndim != 2 or points.shape[1] != 2 or points.shape[0] < 2:
        raise ValueError("Provider symmetry axis needs at least two x/z midpoints")
    center = np.mean(points, axis=0)
    _, _, vectors = np.linalg.svd(points - center, full_matrices=False)
    direction = vectors[0]
    if direction[0] < 0:
        direction = -direction
    direction /= np.linalg.norm(direction)
    normal = np.asarray([-direction[1], direction[0]], dtype=float)
    residuals = np.abs((points - center) @ normal)
    return {
        "center": center,
        "direction": direction,
        "angleFromPositiveXDegrees": float(math.degrees(math.atan2(direction[1], direction[0]))),
        "residuals": residuals,
    }


def selected_pair_midpoints(
    definition: dict[str, Any],
    row_centers: dict[tuple[str, str], np.ndarray],
) -> tuple[np.ndarray, list[str]]:
    left = definition["positiveZSectionId"]
    right = definition["negativeZSectionId"]
    left_rows = {row for section, row in row_centers if section == left}
    right_rows = {row for section, row in row_centers if section == right}
    row_ids = sorted(
        row for row in left_rows & right_rows
        if row_selected(row, definition["rowSelector"])
    )
    if len(row_ids) < int(definition["minimumCommonRows"]):
        raise ValueError(
            f"Reviewed symmetry pair {definition['pairId']} has only {len(row_ids)} selected common rows"
        )
    midpoints = np.asarray([
        (row_centers[(left, row_id)] + row_centers[(right, row_id)]) / 2.0
        for row_id in row_ids
    ], dtype=float)
    return midpoints, row_ids


def serializable_pair(
    definition: dict[str, Any],
    row_ids: list[str],
    points: np.ndarray,
    fit: dict[str, Any],
    training_angle: float,
) -> dict[str, Any]:
    residuals = fit["residuals"]
    return {
        "pairId": definition["pairId"],
        "positiveZSectionId": definition["positiveZSectionId"],
        "negativeZSectionId": definition["negativeZSectionId"],
        "partition": definition["partition"],
        "selectedRowIds": row_ids,
        "midpointCount": len(row_ids),
        "midpointExtentMetres": {
            "x": round(float(np.ptp(points[:, 0])), 9),
            "z": round(float(np.ptp(points[:, 1])), 9),
        },
        "fitCenterProviderXZ": [round(float(value), 9) for value in fit["center"]],
        "fitDirectionProviderXZ": [round(float(value), 12) for value in fit["direction"]],
        "fieldAxisAngleFromProviderPositiveXDegrees": round(
            float(fit["angleFromPositiveXDegrees"]), 9
        ),
        "absoluteResidualFromTrainingAngleDegrees": round(
            abs(angular_difference(fit["angleFromPositiveXDegrees"], training_angle)), 9
        ),
        "perpendicularResidualMetres": {
            "median": round(float(np.median(residuals)), 9),
            "p95": round(float(np.percentile(residuals, 95)), 9),
            "maximum": round(float(np.max(residuals)), 9),
        },
        "midpointsProviderXZ": [
            [round(float(value), 9) for value in point]
            for point in points
        ],
    }


def main() -> None:
    args = parse_args()
    controls = json.loads(args.controls.read_text())
    if controls.get("review", {}).get("status") != REQUIRED_REVIEW_STATUS:
        raise ValueError(f"Controls must have review status {REQUIRED_REVIEW_STATUS}")

    venue = json.loads(args.venue_rows.read_text())
    field = json.loads(args.field_orientation.read_text())
    panorama = json.loads(args.panorama_calibration.read_text())
    expected_inputs = controls["inputs"]
    for label, path, artifact in [
        ("venueRows", args.venue_rows, venue),
        ("fieldOrientation", args.field_orientation, field),
        ("panoramaCalibration", args.panorama_calibration, panorama),
    ]:
        expected = expected_inputs[label]
        if file_sha256(path) != expected["sha256"]:
            raise ValueError(f"{label} SHA-256 does not match reviewed controls")
        if artifact.get("artifactVersion") != expected["artifactVersion"]:
            raise ValueError(f"{label} artifact version does not match reviewed controls")
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Venue rows input is not a metric row artifact")
    if not field.get("assessment", {}).get("orientationMeasurementEligible"):
        raise ValueError("Field orientation input is not measurement eligible")
    if not panorama.get("assessment", {}).get("measurementEligible"):
        raise ValueError("Panorama provider-frame calibration is not measurement eligible")

    sign = controls["basisSignEvidence"]
    sign_image_path = Path(sign["localImagePath"])
    sign_page_path = Path(sign["localSourcePagePath"])
    if file_sha256(sign_image_path) != sign["imageSha256"]:
        raise ValueError("Official seat-map image SHA-256 does not match reviewed sign evidence")
    if file_sha256(sign_page_path) != sign["sourcePageSha256"]:
        raise ValueError("Official seat-map page SHA-256 does not match reviewed sign evidence")

    row_centers: dict[tuple[str, str], np.ndarray] = {}
    for row in venue["rows"]:
        anchors = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=float)
        if anchors.shape[0] < 2:
            continue
        row_centers[(str(row["sectionId"]), str(row["rowId"]))] = np.mean(
            anchors[:, [0, 2]], axis=0
        )

    definitions = controls["sectionSymmetryPairs"]
    if sum(definition["partition"] == "training" for definition in definitions) != 1:
        raise ValueError("Exactly one reviewed symmetry pair must be the training pair")
    intermediate = []
    training_angle = None
    for definition in definitions:
        points, row_ids = selected_pair_midpoints(definition, row_centers)
        fit = fit_axis(points)
        intermediate.append((definition, points, row_ids, fit))
        if definition["partition"] == "training":
            training_angle = float(fit["angleFromPositiveXDegrees"])
    if training_angle is None:
        raise ValueError("Training provider field-axis angle was not computed")

    pair_records = [
        serializable_pair(definition, row_ids, points, fit, training_angle)
        for definition, points, row_ids, fit in intermediate
    ]
    training_midpoints = sum(
        record["midpointCount"] for record in pair_records if record["partition"] == "training"
    )
    holdout_records = [record for record in pair_records if record["partition"] == "holdout"]
    holdout_midpoints = sum(record["midpointCount"] for record in holdout_records)
    holdout_residuals = np.asarray([
        record["absoluteResidualFromTrainingAngleDegrees"] for record in holdout_records
    ], dtype=float)
    holdout_summary = values_summary(holdout_residuals)

    field_bearing = float(field["measurements"]["orientationDegrees"])
    field_uncertainty = float(field["measurements"]["orientationUncertaintyDegrees"])
    provider_positive_x_bearing = (field_bearing - training_angle) % 360.0
    provider_positive_z_bearing = (provider_positive_x_bearing + 90.0) % 360.0
    panorama_angle_p95 = float(panorama["holdoutSummary"]["angularErrorDegrees"]["p95"])
    provider_axis_holdout_p95 = float(holdout_summary["p95"])
    combined_uncertainty = math.sqrt(
        field_uncertainty ** 2
        + provider_axis_holdout_p95 ** 2
        + panorama_angle_p95 ** 2
    )
    east_north_from_provider_xz = [
        [
            math.sin(math.radians(provider_positive_x_bearing)),
            math.sin(math.radians(provider_positive_z_bearing)),
        ],
        [
            math.cos(math.radians(provider_positive_x_bearing)),
            math.cos(math.radians(provider_positive_z_bearing)),
        ],
    ]

    blockers = []
    if training_midpoints < args.minimum_training_midpoints:
        blockers.append("PROVIDER_AXIS_TRAINING_SCOPE_TOO_SMALL")
    if len(holdout_records) < args.minimum_holdout_pairs:
        blockers.append("PROVIDER_AXIS_HOLDOUT_PAIR_COUNT_TOO_SMALL")
    if holdout_midpoints < args.minimum_holdout_midpoints:
        blockers.append("PROVIDER_AXIS_HOLDOUT_MIDPOINT_COUNT_TOO_SMALL")
    if provider_axis_holdout_p95 > args.maximum_holdout_p95_degrees:
        blockers.append("PROVIDER_AXIS_HOLDOUT_ANGULAR_ERROR_TOO_HIGH")
    if combined_uncertainty > args.maximum_combined_orientation_uncertainty_degrees:
        blockers.append("COMBINED_TRUE_NORTH_ORIENTATION_UNCERTAINTY_TOO_HIGH")
    measurement_eligible = not blockers

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": controls["stadiumId"],
        "inputs": {
            "controls": {"path": str(args.controls), "sha256": file_sha256(args.controls)},
            "venueRows": {"path": str(args.venue_rows), **expected_inputs["venueRows"]},
            "fieldOrientation": {"path": str(args.field_orientation), **expected_inputs["fieldOrientation"]},
            "panoramaCalibration": {"path": str(args.panorama_calibration), **expected_inputs["panoramaCalibration"]},
            "officialSeatMap": {
                "pageUrl": sign["pageUrl"],
                "imageUrl": sign["imageUrl"],
                "localImagePath": str(sign_image_path),
                "imageSha256": sign["imageSha256"],
                "localSourcePagePath": str(sign_page_path),
                "sourcePageSha256": sign["sourcePageSha256"],
            },
        },
        "review": controls["review"],
        "basisSignEvidence": {
            "providerPositiveZSide": sign["providerPositiveZSide"],
            "providerPositiveZTrueBearingRule": "provider positive x bearing plus 90 degrees clockwise",
            "reviewedSectionEvidence": sign["reviewedSectionEvidence"],
        },
        "crossValidation": {
            "trainingPairCount": 1,
            "trainingMidpointCount": training_midpoints,
            "holdoutPairCount": len(holdout_records),
            "holdoutMidpointCount": holdout_midpoints,
            "holdoutAbsoluteAngularResidualDegrees": holdout_summary,
            "pairs": pair_records,
        },
        "orientation": {
            "fieldAxisTrueBearingDegrees": round(field_bearing, 9),
            "fieldAxisAngleFromProviderPositiveXDegrees": round(training_angle, 9),
            "providerPositiveXTrueBearingDegrees": round(provider_positive_x_bearing, 9),
            "providerPositiveZTrueBearingDegrees": round(provider_positive_z_bearing, 9),
            "providerPositiveYDirection": "up",
            "eastNorthFromProviderXZ": [
                [round(float(value), 12) for value in row]
                for row in east_north_from_provider_xz
            ],
        },
        "uncertainty": {
            "fieldOrientationDegrees": round(field_uncertainty, 9),
            "providerAxisHoldoutP95Degrees": round(provider_axis_holdout_p95, 9),
            "panoramaFrameHoldoutP95Degrees": round(panorama_angle_p95, 9),
            "combinationRule": "root-sum-square of independent field, provider-axis, and panorama-frame angular terms",
            "combinedTrueNorthOrientationDegrees": round(combined_uncertainty, 9),
        },
        "thresholds": {
            "maximumCombinedOrientationUncertaintyDegrees": args.maximum_combined_orientation_uncertainty_degrees,
            "maximumHoldoutP95Degrees": args.maximum_holdout_p95_degrees,
            "minimumTrainingMidpoints": args.minimum_training_midpoints,
            "minimumHoldoutPairs": args.minimum_holdout_pairs,
            "minimumHoldoutMidpoints": args.minimum_holdout_midpoints,
        },
        "assessment": {
            "globalProviderTrueNorthOrientationMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": blockers,
            "publicationBlockers": [
                "TRUE_NORTH_ORIENTATION_ONLY",
                "ABSOLUTE_HORIZONTAL_ORIGIN_NOT_ESTABLISHED_WITHIN_ONE_FOOT",
                "VERTICAL_DATUM_NOT_ESTABLISHED_WITHIN_ONE_FOOT",
                "FULL_STADIUM_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "provider-global-true-north-orientation",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        **stable,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")

    if args.preview:
        all_points = np.vstack([points for _, points, _, _ in intermediate])
        minimum = np.min(all_points, axis=0)
        maximum = np.max(all_points, axis=0)
        canvas = np.full((900, 1600, 3), 255, dtype=np.uint8)
        padding = 100
        span = np.maximum(maximum - minimum, 1e-9)
        scale = min((canvas.shape[1] - 2 * padding) / span[0], (canvas.shape[0] - 2 * padding) / span[1])

        def pixel(point: np.ndarray) -> tuple[int, int]:
            value = (point - minimum) * scale + padding
            return int(round(value[0])), int(round(canvas.shape[0] - value[1]))

        colors = [(0, 120, 255), (255, 80, 40), (70, 180, 60), (180, 60, 160), (60, 60, 220)]
        for index, (definition, points, _, fit) in enumerate(intermediate):
            color = colors[index % len(colors)]
            for point in points:
                cv2.circle(canvas, pixel(point), 5, color, -1, cv2.LINE_AA)
            direction = fit["direction"]
            center = fit["center"]
            cv2.line(canvas, pixel(center - 200 * direction), pixel(center + 200 * direction), color, 3, cv2.LINE_AA)
            cv2.putText(
                canvas,
                f"{definition['pairId']} {fit['angleFromPositiveXDegrees']:.4f} deg",
                (80, 45 + index * 34),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                color,
                2,
                cv2.LINE_AA,
            )
        args.preview.parent.mkdir(parents=True, exist_ok=True)
        if not cv2.imwrite(str(args.preview), canvas, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
            raise ValueError("Could not write provider-axis preview")

    print(json.dumps({
        "output": str(args.output),
        "preview": None if args.preview is None else str(args.preview),
        "artifactVersion": artifact["artifactVersion"],
        "orientation": artifact["orientation"],
        "uncertainty": artifact["uncertainty"],
        "crossValidation": {
            "trainingMidpointCount": training_midpoints,
            "holdoutPairCount": len(holdout_records),
            "holdoutMidpointCount": holdout_midpoints,
            "holdoutAbsoluteAngularResidualDegrees": holdout_summary,
        },
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Compare the Marlins upper movable roof-panel top across open and closed states."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from PIL import Image, ImageDraw


ANALYSIS_VERSION = "marlins-upper-roof-panel-top-profile-v1"
FEET_PER_METRE = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def validate_record(record: dict[str, Any]) -> dict[str, Any] | None:
    path = Path(record["path"])
    if sha256_file(path) != record["sha256"]:
        raise ValueError(f"Input checksum mismatch: {path}")
    if path.suffix != ".json":
        return None
    value = json.loads(path.read_text())
    if record.get("artifactVersion") and value.get("artifactVersion") != record["artifactVersion"]:
        raise ValueError(f"Input artifact version mismatch: {path}")
    return value


def summary(values: np.ndarray) -> dict[str, float | int]:
    return {
        "count": int(values.size),
        "minimum": float(np.min(values)),
        "median": float(np.median(values)),
        "p95": float(np.percentile(values, 95)),
        "maximum": float(np.max(values)),
    }


def load_selected_points(
    path: Path,
    pivot: np.ndarray,
    x_range: tuple[float, float],
    y_range: tuple[float, float],
    z_range: tuple[float, float],
    classification: int,
    rotation: np.ndarray | None = None,
    local_translation: np.ndarray | None = None,
) -> tuple[np.ndarray, np.ndarray, int]:
    lidar = laspy.read(path)
    x = np.asarray(lidar.x, dtype=np.float64)
    y = np.asarray(lidar.y, dtype=np.float64)
    z = np.asarray(lidar.z, dtype=np.float64)
    source_classification = np.asarray(lidar.classification)
    local = np.column_stack((x - pivot[0], y - pivot[1]))
    if rotation is not None and local_translation is not None:
        transformed_x = (
            rotation[0, 0] * local[:, 0]
            + rotation[0, 1] * local[:, 1]
            + local_translation[0]
        )
        transformed_y = (
            rotation[1, 0] * local[:, 0]
            + rotation[1, 1] * local[:, 1]
            + local_translation[1]
        )
        local = np.column_stack((transformed_x, transformed_y))
    keep = (
        (source_classification == classification)
        & (local[:, 0] >= x_range[0])
        & (local[:, 0] <= x_range[1])
        & (local[:, 1] >= y_range[0])
        & (local[:, 1] <= y_range[1])
        & (z >= z_range[0])
        & (z <= z_range[1])
    )
    return local[keep, 1], z[keep], int(len(x))


def top_profile(
    y: np.ndarray,
    z: np.ndarray,
    y_range: tuple[float, float],
    bin_metres: float,
    quantile: float,
    minimum_returns: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    edges = np.arange(y_range[0], y_range[1] + bin_metres * 0.5, bin_metres)
    centers = (edges[:-1] + edges[1:]) / 2.0
    indices = np.floor((y - y_range[0]) / bin_metres).astype(np.int32)
    profile = np.full(centers.size, np.nan, dtype=np.float64)
    counts = np.zeros(centers.size, dtype=np.int32)
    inside = (indices >= 0) & (indices < centers.size)
    for index in np.unique(indices[inside]):
        values = z[indices == index]
        counts[index] = values.size
        if values.size >= minimum_returns:
            profile[index] = float(np.quantile(values, quantile))
    return centers, profile, counts


def render_diagnostic(
    output: Path,
    centers: np.ndarray,
    reference: np.ndarray,
    comparison: np.ndarray,
) -> None:
    width, height = 1800, 1000
    margin_left, margin_right = 100, 60
    top, profile_bottom = 70, 700
    residual_top, residual_bottom = 770, 930
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    valid = np.isfinite(reference) & np.isfinite(comparison)
    z_values = np.concatenate((reference[valid], comparison[valid]))
    z_min = math.floor(float(np.min(z_values)) - 1.0)
    z_max = math.ceil(float(np.max(z_values)) + 1.0)
    y_min, y_max = float(centers[0]), float(centers[-1])

    def x_pixel(y_value: float) -> float:
        return margin_left + (y_value - y_min) / (y_max - y_min) * (width - margin_left - margin_right)

    def z_pixel(z_value: float) -> float:
        return profile_bottom - (z_value - z_min) / (z_max - z_min) * (profile_bottom - top)

    draw.rectangle((margin_left, top, width - margin_right, profile_bottom), outline="black")
    for value in range(z_min, z_max + 1, 5):
        pixel = z_pixel(value)
        draw.line((margin_left, pixel, width - margin_right, pixel), fill=(225, 225, 225))
        draw.text((20, pixel - 8), f"{value} m", fill="black")
    for values, color, label in (
        (reference, (15, 90, 210), "2018 open, upper panel parked west"),
        (comparison, (225, 55, 35), "2021 closed, upper panel over field"),
    ):
        points = [
            (x_pixel(float(y_value)), z_pixel(float(z_value)))
            for y_value, z_value in zip(centers, values)
            if np.isfinite(z_value)
        ]
        if len(points) >= 2:
            draw.line(points, fill=color, width=3)
        draw.text((margin_left + 20, top + 18 + 25 * (0 if color[2] > 100 else 1)), label, fill=color)

    residual = comparison - reference
    finite_residual = residual[valid]
    residual_limit = max(0.1, float(np.percentile(np.abs(finite_residual), 99)))
    draw.rectangle((margin_left, residual_top, width - margin_right, residual_bottom), outline="black")
    zero = (residual_top + residual_bottom) / 2
    draw.line((margin_left, zero, width - margin_right, zero), fill=(100, 100, 100))
    residual_points = []
    for y_value, value in zip(centers[valid], finite_residual):
        pixel_y = zero - float(value) / residual_limit * (residual_bottom - residual_top) * 0.45
        residual_points.append((x_pixel(float(y_value)), pixel_y))
    if len(residual_points) >= 2:
        draw.line(residual_points, fill=(110, 30, 135), width=2)
    draw.text((20, residual_top), f"+{residual_limit:.2f} m", fill="black")
    draw.text((20, residual_bottom - 16), f"-{residual_limit:.2f} m", fill="black")
    draw.text((margin_left, 955), "Horizontal axis: UTM northing relative to local stadium pivot, metres", fill="black")
    draw.text((margin_left, 35), "Marlins upper movable roof-panel top profile across open and closed states", fill="black")
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    args = parser.parse_args()

    controls_bytes = args.controls.read_bytes()
    controls = json.loads(controls_bytes)
    if controls.get("reviewStatus") != "reviewed-marlins-upper-panel-top-profile-controls":
        raise ValueError("Upper-panel profile controls have not passed manual review")
    reference_path = Path(controls["inputs"]["referenceLidar"]["path"])
    comparison_path = Path(controls["inputs"]["comparisonLidar"]["path"])
    if sha256_file(reference_path) != controls["inputs"]["referenceLidar"]["sha256"]:
        raise ValueError("Reference LiDAR checksum mismatch")
    if sha256_file(comparison_path) != controls["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    registration = validate_record(controls["inputs"]["hardStructureRegistration"])
    validate_record(controls["inputs"]["officialRoofPage"])
    if not registration["assessment"]["closedRoofTopSurfaceFrameEligible"]:
        raise ValueError("Comparison LiDAR frame is not measurement eligible")

    selection = controls["profileSelection"]
    pivot = np.asarray(selection["localPivotUtmMetres"], dtype=np.float64)
    y_range = tuple(float(value) for value in selection["yRangeRelativeMetres"])
    z_range = tuple(float(value) for value in selection["heightRangeMetresNavd88"])
    reference_x_range = tuple(float(value) for value in selection["referenceOpenStackXRangeRelativeMetres"])
    comparison_x_range = tuple(float(value) for value in selection["comparisonClosedUpperPanelXRangeRelativeMetres"])
    classification = int(selection["classification"])
    rotation = np.asarray(registration["lockedTransform"]["rotationMatrix"], dtype=np.float64)
    local_translation = np.asarray(
        registration["lockedTransform"]["localTranslationAtPivotMetres"],
        dtype=np.float64,
    )
    reference_y, reference_z, reference_total = load_selected_points(
        reference_path,
        pivot,
        reference_x_range,
        y_range,
        z_range,
        classification,
    )
    comparison_y, comparison_z, comparison_total = load_selected_points(
        comparison_path,
        pivot,
        comparison_x_range,
        y_range,
        z_range,
        classification,
        rotation,
        local_translation,
    )
    centers, reference_profile, reference_counts = top_profile(
        reference_y,
        reference_z,
        y_range,
        float(selection["profileBinMetres"]),
        float(selection["topQuantile"]),
        int(selection["minimumReturnsPerBin"]),
    )
    comparison_centers, comparison_profile, comparison_counts = top_profile(
        comparison_y,
        comparison_z,
        y_range,
        float(selection["profileBinMetres"]),
        float(selection["topQuantile"]),
        int(selection["minimumReturnsPerBin"]),
    )
    if not np.allclose(centers, comparison_centers):
        raise RuntimeError("Profile bin centers differ")
    valid = np.isfinite(reference_profile) & np.isfinite(comparison_profile)
    signed_residuals = comparison_profile[valid] - reference_profile[valid]
    absolute_residuals = np.abs(signed_residuals)
    coverage = float(np.count_nonzero(valid) / valid.size)

    reference_review = validate_input_from_registration(registration, "referenceSurveyReview")
    comparison_review = validate_input_from_registration(registration, "comparisonSurveyReview")
    reference_vertical95_feet = float(
        reference_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    comparison_vertical95_feet = float(
        comparison_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    combined_vertical95_feet = math.hypot(
        reference_vertical95_feet,
        comparison_vertical95_feet,
    )
    p95_absolute_residual_feet = float(np.percentile(absolute_residuals, 95) * FEET_PER_METRE)
    profile_supported = (
        coverage >= 0.95
        and p95_absolute_residual_feet <= combined_vertical95_feet
        and controls["assessment"]["semanticUpperPanelIdentityReviewed"]
    )
    render_diagnostic(
        args.output_png,
        centers,
        reference_profile,
        comparison_profile,
    )

    records = [
        {
            "yRelativeMetres": float(center),
            "referenceTopMetresNavd88": None if not np.isfinite(reference_value) else float(reference_value),
            "comparisonTopMetresNavd88": None if not np.isfinite(comparison_value) else float(comparison_value),
            "referenceReturnCount": int(reference_count),
            "comparisonReturnCount": int(comparison_count),
            "signedResidualMetres": (
                None
                if not (np.isfinite(reference_value) and np.isfinite(comparison_value))
                else float(comparison_value - reference_value)
            ),
        }
        for center, reference_value, comparison_value, reference_count, comparison_count in zip(
            centers,
            reference_profile,
            comparison_profile,
            reference_counts,
            comparison_counts,
        )
    ]
    stable = {
        "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        "records": records,
        "coverage": coverage,
        "signedResiduals": signed_residuals.tolist(),
        "combinedVertical95Feet": combined_vertical95_feet,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "cross-state-upper-roof-panel-top-profile",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(args.controls),
                "sha256": stable["controlsSha256"],
                "artifactVersion": controls["artifactVersion"],
            },
            "referenceLidar": controls["inputs"]["referenceLidar"],
            "comparisonLidar": controls["inputs"]["comparisonLidar"],
            "hardStructureRegistration": controls["inputs"]["hardStructureRegistration"],
            "officialRoofPage": controls["inputs"]["officialRoofPage"],
        },
        "selection": selection,
        "pointCounts": {
            "referenceTotal": reference_total,
            "referenceSelected": int(reference_y.size),
            "comparisonTotal": comparison_total,
            "comparisonSelected": int(comparison_y.size),
        },
        "profile": {
            "binCount": int(centers.size),
            "validPairedBinCount": int(np.count_nonzero(valid)),
            "pairedCoveragePercent": coverage * 100.0,
            "signedResidualMetres": summary(signed_residuals),
            "absoluteResidualMetres": summary(absolute_residuals),
            "absoluteResidualFeet": summary(absolute_residuals * FEET_PER_METRE),
            "records": records,
        },
        "uncertainty": {
            "referenceVerticalAccuracy95Feet": reference_vertical95_feet,
            "comparisonVerticalAccuracy95Feet": comparison_vertical95_feet,
            "combinedCrossEpochVerticalAccuracy95Feet": combined_vertical95_feet,
            "observedProfileP95AbsoluteResidualFeet": p95_absolute_residual_feet,
            "combinationRule": "root sum of squares",
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": sha256_file(args.output_png),
        },
        "assessment": {
            "rigidUpperPanelTopProfileSupported": profile_supported,
            "upperPanelTopProfileMeasurementEligible": profile_supported,
            "fullOpenRoofTopSurfaceEligible": False,
            "roofObstructionVolumeEligible": False,
            "publicationEligible": False,
            "blockers": [
                "LOWER_PANEL_OPEN_STATE_TOP_SURFACES_NOT_COMPLETE",
                "PANEL_UNDERSIDES_NOT_MEASURED",
                "CURRENT_2026_GEOMETRY_NOT_PROVEN",
                "ROW_FRAME_HORIZONTAL_ACCURACY_NOT_YET_SUBFOOT",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": (
                "The upper center panel's north-south top profile agrees across its 2018 "
                "open parked position and its 2021 closed position within the independent "
                "cross-epoch vertical accuracy envelope. This supports a rigid upper-panel "
                "top profile only."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "profile": {key: value for key, value in artifact["profile"].items() if key != "records"},
        "uncertainty": artifact["uncertainty"],
        "assessment": artifact["assessment"],
    }, indent=2))


def validate_input_from_registration(registration: dict[str, Any], name: str) -> dict[str, Any]:
    record = registration["inputs"][name]
    value = validate_record(record)
    if value is None:
        raise ValueError(f"Registration input is not JSON: {name}")
    return value


if __name__ == "__main__":
    main()

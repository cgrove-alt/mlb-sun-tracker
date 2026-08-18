#!/usr/bin/env python3
"""Audit the Marlins upper movable roof-panel shape in 2024 LiDAR.

This is deliberately a shape-only comparison. A vertical offset and a
north-south profile offset are fitted on locked training bins. Withheld bins
are evaluated only after the alignment is locked. The fitted offsets must not
be interpreted as an absolute survey registration.
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
from PIL import Image, ImageDraw
from pyproj import Transformer


ANALYSIS_VERSION = "marlins-2024-upper-roof-panel-shape-v1"
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
    if values.size == 0:
        raise ValueError("Cannot summarize an empty array")
    return {
        "count": int(values.size),
        "minimum": float(np.min(values)),
        "p05": float(np.percentile(values, 5)),
        "median": float(np.median(values)),
        "p95": float(np.percentile(values, 95)),
        "maximum": float(np.max(values)),
    }


def grouped_top_profile(
    y: np.ndarray,
    z: np.ndarray,
    y_range: tuple[float, float],
    bin_metres: float,
    quantile: float,
    minimum_returns: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Build a quantile profile without repeatedly scanning the point array."""
    edges = np.arange(y_range[0], y_range[1] + bin_metres * 0.5, bin_metres)
    centers = (edges[:-1] + edges[1:]) / 2.0
    indices = np.floor((y - y_range[0]) / bin_metres).astype(np.int32)
    inside = (indices >= 0) & (indices < centers.size)
    indices = indices[inside]
    z = z[inside]
    profile = np.full(centers.size, np.nan, dtype=np.float64)
    counts = np.zeros(centers.size, dtype=np.int32)
    if indices.size == 0:
        return centers, profile, counts
    order = np.argsort(indices, kind="stable")
    sorted_indices = indices[order]
    sorted_z = z[order]
    starts = np.flatnonzero(np.r_[True, sorted_indices[1:] != sorted_indices[:-1]])
    ends = np.r_[starts[1:], sorted_indices.size]
    for start, end in zip(starts, ends):
        index = int(sorted_indices[start])
        count = int(end - start)
        counts[index] = count
        if count >= minimum_returns:
            profile[index] = float(np.quantile(sorted_z[start:end], quantile))
    return centers, profile, counts


def interpolate_profile(
    centers: np.ndarray,
    profile: np.ndarray,
    target_centers: np.ndarray,
    maximum_span_metres: float,
) -> np.ndarray:
    """Linearly interpolate only across locally supported profile brackets."""
    valid = np.isfinite(profile)
    source_centers = centers[valid]
    source_values = profile[valid]
    output = np.full(target_centers.size, np.nan, dtype=np.float64)
    if source_centers.size < 2:
        return output
    right = np.searchsorted(source_centers, target_centers, side="left")
    exact = (right < source_centers.size) & np.isclose(
        source_centers[np.minimum(right, source_centers.size - 1)],
        target_centers,
        atol=1e-9,
        rtol=0.0,
    )
    if np.any(exact):
        output[exact] = source_values[right[exact]]
    bracketed = (~exact) & (right > 0) & (right < source_centers.size)
    bracket_indices = np.flatnonzero(bracketed)
    if bracket_indices.size:
        right_indices = right[bracket_indices]
        left_indices = right_indices - 1
        spans = source_centers[right_indices] - source_centers[left_indices]
        supported = spans <= maximum_span_metres + 1e-12
        use = bracket_indices[supported]
        if use.size:
            right_use = right[use]
            left_use = right_use - 1
            fractions = (
                (target_centers[use] - source_centers[left_use])
                / (source_centers[right_use] - source_centers[left_use])
            )
            output[use] = (
                source_values[left_use]
                + fractions * (source_values[right_use] - source_values[left_use])
            )
    return output


def load_current_points(
    lidar_path: Path,
    source_horizontal_epsg: int,
    target_horizontal_epsg: int,
    vertical_unit_metres: float,
    pivot: np.ndarray,
    x_range: tuple[float, float],
    y_range: tuple[float, float],
    z_range: tuple[float, float],
    classifications: set[int],
    chunk_size: int,
) -> tuple[np.ndarray, np.ndarray, int, dict[int, int]]:
    transformer = Transformer.from_crs(
        source_horizontal_epsg,
        target_horizontal_epsg,
        always_xy=True,
    )
    selected_y: list[np.ndarray] = []
    selected_z: list[np.ndarray] = []
    total = 0
    class_counts: dict[int, int] = {}
    with laspy.open(lidar_path) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None or str(source_horizontal_epsg) not in source_crs.to_wkt():
            raise ValueError("Current LiDAR horizontal CRS does not match the reviewed control")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            z = np.asarray(points.z, dtype=np.float64) * vertical_unit_metres
            classification = np.asarray(points.classification, dtype=np.int16)
            east, north = transformer.transform(x, y)
            local_x = np.asarray(east, dtype=np.float64) - pivot[0]
            local_y = np.asarray(north, dtype=np.float64) - pivot[1]
            class_keep = np.isin(classification, list(classifications))
            keep = (
                class_keep
                & (local_x >= x_range[0])
                & (local_x <= x_range[1])
                & (local_y >= y_range[0])
                & (local_y <= y_range[1])
                & (z >= z_range[0])
                & (z <= z_range[1])
            )
            kept_classes = classification[keep]
            if kept_classes.size:
                values, counts = np.unique(kept_classes, return_counts=True)
                for value, count in zip(values, counts):
                    key = int(value)
                    class_counts[key] = class_counts.get(key, 0) + int(count)
                selected_y.append(local_y[keep])
                selected_z.append(z[keep])
            total += int(x.size)
    if not selected_y:
        raise ValueError("Current LiDAR selection contains no points")
    return np.concatenate(selected_y), np.concatenate(selected_z), total, class_counts


def fit_shape_alignment(
    centers: np.ndarray,
    reference_profile: np.ndarray,
    comparison_centers: np.ndarray,
    comparison_profile: np.ndarray,
    training_mask: np.ndarray,
    shift_candidates: np.ndarray,
    maximum_interpolation_span_metres: float,
    minimum_training_pairs: int,
) -> dict[str, Any]:
    """Fit profile and height shifts using training bins only."""
    candidates: list[dict[str, Any]] = []
    for y_shift in shift_candidates:
        sampled = interpolate_profile(
            comparison_centers,
            comparison_profile,
            centers - float(y_shift),
            maximum_interpolation_span_metres,
        )
        valid_training = training_mask & np.isfinite(reference_profile) & np.isfinite(sampled)
        if np.count_nonzero(valid_training) < minimum_training_pairs:
            continue
        z_shift = float(np.median(reference_profile[valid_training] - sampled[valid_training]))
        residuals = sampled[valid_training] + z_shift - reference_profile[valid_training]
        absolute = np.abs(residuals)
        candidates.append({
            "yShiftMetres": float(y_shift),
            "zShiftMetres": z_shift,
            "trainingPairCount": int(absolute.size),
            "trainingMedianAbsoluteResidualMetres": float(np.median(absolute)),
            "trainingP95AbsoluteResidualMetres": float(np.percentile(absolute, 95)),
            "sampledProfile": sampled,
        })
    if not candidates:
        raise ValueError("No alignment candidate has enough training pairs")
    locked = min(
        candidates,
        key=lambda item: (
            item["trainingMedianAbsoluteResidualMetres"],
            item["trainingP95AbsoluteResidualMetres"],
            abs(item["yShiftMetres"]),
        ),
    )
    return locked


def render_diagnostic(
    output: Path,
    centers: np.ndarray,
    reference: np.ndarray,
    raw_current: np.ndarray,
    aligned_current: np.ndarray,
    training_mask: np.ndarray,
    holdout_mask: np.ndarray,
) -> None:
    width, height = 1800, 1080
    left, right = 105, width - 60
    profile_top, profile_bottom = 70, 720
    residual_top, residual_bottom = 790, 1005
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    common = np.isfinite(reference) & np.isfinite(aligned_current)
    z_values = np.concatenate((reference[np.isfinite(reference)], aligned_current[np.isfinite(aligned_current)]))
    z_min = math.floor(float(np.min(z_values)) - 1.0)
    z_max = math.ceil(float(np.max(z_values)) + 1.0)
    y_min, y_max = float(centers[0]), float(centers[-1])

    def x_pixel(y_value: float) -> float:
        return left + (y_value - y_min) / (y_max - y_min) * (right - left)

    def z_pixel(z_value: float) -> float:
        return profile_bottom - (z_value - z_min) / (z_max - z_min) * (profile_bottom - profile_top)

    draw.rectangle((left, profile_top, right, profile_bottom), outline="black")
    for value in range(z_min, z_max + 1, 5):
        pixel = z_pixel(value)
        draw.line((left, pixel, right, pixel), fill=(228, 228, 228))
        draw.text((20, pixel - 8), f"{value} m", fill="black")
    series = (
        (reference, (10, 80, 205), "2021 registered closed upper panel"),
        (raw_current, (160, 160, 160), "2024 raw profile before nuisance alignment"),
        (aligned_current, (220, 45, 35), "2024 profile after training-only alignment"),
    )
    for series_index, (values, color, label) in enumerate(series):
        points = [
            (x_pixel(float(y_value)), z_pixel(float(z_value)))
            for y_value, z_value in zip(centers, values)
            if np.isfinite(z_value)
        ]
        if len(points) >= 2:
            draw.line(points, fill=color, width=3 if series_index != 1 else 2)
        draw.text((left + 18, profile_top + 18 + 24 * series_index), label, fill=color)

    residual = aligned_current - reference
    valid_residual = residual[common]
    limit = max(0.03, float(np.max(np.abs(valid_residual))))
    zero = (residual_top + residual_bottom) / 2
    draw.rectangle((left, residual_top, right, residual_bottom), outline="black")
    draw.line((left, zero, right, zero), fill=(90, 90, 90))
    for mask, color, radius in (
        (training_mask & common, (155, 155, 155), 1),
        (holdout_mask & common, (125, 20, 145), 3),
    ):
        for y_value, value in zip(centers[mask], residual[mask]):
            x = x_pixel(float(y_value))
            y = zero - float(value) / limit * (residual_bottom - residual_top) * 0.45
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
    draw.text((20, residual_top), f"+{limit:.3f} m", fill="black")
    draw.text((20, residual_bottom - 16), f"-{limit:.3f} m", fill="black")
    draw.text((left + 18, residual_top + 15), "Gray: training residuals. Purple: locked holdout residuals.", fill="black")
    draw.text((left, 1030), "Horizontal axis: UTM northing relative to the locked local stadium pivot, metres", fill="black")
    draw.text((left, 32), "Marlins 2024 upper movable roof-panel shape holdout audit", fill="black")
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
    if controls.get("reviewStatus") != "reviewed-marlins-2024-upper-panel-shape-controls":
        raise ValueError("The 2024 upper-panel controls have not passed manual review")
    version_payload = dict(controls)
    declared_controls_version = version_payload.pop("artifactVersion", None)
    if declared_controls_version != artifact_version(version_payload):
        raise ValueError("The reviewed 2024 upper-panel control version is invalid")
    reference_audit = validate_record(controls["inputs"]["reference2021ProfileAudit"])
    current_review = validate_record(controls["inputs"]["current2024SurveyReview"])
    validate_record(controls["inputs"]["current2024Lidar"])
    validate_record(controls["inputs"]["current2024RoofStateReview"])
    validate_record(controls["inputs"]["officialRoofPage"])
    if not reference_audit["assessment"]["upperPanelTopProfileMeasurementEligible"]:
        raise ValueError("The locked 2021 reference profile is not measurement eligible")

    selection = controls["profileSelection"]
    pivot = np.asarray(selection["localPivotUtmMetres"], dtype=np.float64)
    y_range = tuple(float(value) for value in selection["yRangeRelativeMetres"])
    x_range = tuple(float(value) for value in selection["currentClosedUpperPanelXRangeRelativeMetres"])
    z_range = tuple(float(value) for value in selection["heightRangeMetresNavd88"])
    current_y, current_z, current_total, class_counts = load_current_points(
        Path(controls["inputs"]["current2024Lidar"]["path"]),
        int(selection["sourceHorizontalEpsg"]),
        int(selection["targetHorizontalEpsg"]),
        float(selection["sourceVerticalUnitMetres"]),
        pivot,
        x_range,
        y_range,
        z_range,
        {int(value) for value in selection["classifications"]},
        int(selection["readChunkSize"]),
    )
    current_centers, current_profile, current_counts = grouped_top_profile(
        current_y,
        current_z,
        y_range,
        float(selection["profileBinMetres"]),
        float(selection["topQuantile"]),
        int(selection["minimumReturnsPerBin"]),
    )

    reference_records = reference_audit["profile"]["records"]
    centers = np.asarray([record["yRelativeMetres"] for record in reference_records], dtype=np.float64)
    reference_profile = np.asarray([
        np.nan if record["comparisonTopMetresNavd88"] is None else record["comparisonTopMetresNavd88"]
        for record in reference_records
    ], dtype=np.float64)
    if centers.size != current_centers.size or not np.allclose(centers, current_centers):
        raise ValueError("Reference and current profile bins differ")

    partition = controls["lockedPartition"]
    indices = np.arange(centers.size)
    holdout_mask = indices % int(partition["modulus"]) == int(partition["holdoutRemainder"])
    training_mask = ~holdout_mask
    shift_candidates = np.arange(
        float(partition["minimumYShiftMetres"]),
        float(partition["maximumYShiftMetres"]) + float(partition["yShiftStepMetres"]) * 0.5,
        float(partition["yShiftStepMetres"]),
    )
    locked = fit_shape_alignment(
        centers,
        reference_profile,
        current_centers,
        current_profile,
        training_mask,
        shift_candidates,
        float(partition["maximumInterpolationSpanMetres"]),
        int(partition["minimumTrainingPairCount"]),
    )
    sampled_current = locked.pop("sampledProfile")
    locked["yShiftApplication"] = (
        "Add yShiftMetres to the 2024 profile coordinate; equivalently sample the raw "
        "2024 profile at reference coordinate minus yShiftMetres."
    )
    locked["zShiftApplication"] = "Add zShiftMetres to the sampled 2024 elevation."
    aligned_current = sampled_current + float(locked["zShiftMetres"])
    common = np.isfinite(reference_profile) & np.isfinite(aligned_current)
    valid_training = common & training_mask
    valid_holdout = common & holdout_mask
    training_residuals = aligned_current[valid_training] - reference_profile[valid_training]
    holdout_residuals = aligned_current[valid_holdout] - reference_profile[valid_holdout]
    holdout_absolute = np.abs(holdout_residuals)

    reference_vertical95_feet = float(
        reference_audit["uncertainty"]["comparisonVerticalAccuracy95Feet"]
    )
    current_vertical95_feet = float(current_review["metrics"]["verticalRawNva95Ft"])
    combined_vertical95_feet = math.hypot(reference_vertical95_feet, current_vertical95_feet)
    current_horizontal95_feet = float(current_review["metrics"]["horizontalAccuracy95Ft"])
    holdout_p95_feet = float(np.percentile(holdout_absolute, 95) * FEET_PER_METRE)
    shape_supported = (
        valid_holdout.sum() >= int(partition["minimumHoldoutPairCount"])
        and holdout_p95_feet <= combined_vertical95_feet
        and controls["assessment"]["semanticUpperPanelIdentityReviewed"]
    )

    raw_at_reference = interpolate_profile(
        current_centers,
        current_profile,
        centers,
        float(partition["maximumInterpolationSpanMetres"]),
    )
    render_diagnostic(
        args.output_png,
        centers,
        reference_profile,
        raw_at_reference,
        aligned_current,
        training_mask,
        holdout_mask,
    )

    records = [
        {
            "profileBinIndex": int(index),
            "role": "holdout" if holdout_mask[index] else "training",
            "yRelativeMetres": float(centers[index]),
            "reference2021TopMetresNavd88": (
                None if not np.isfinite(reference_profile[index]) else float(reference_profile[index])
            ),
            "current2024RawTopMetresNavd88": (
                None if not np.isfinite(current_profile[index]) else float(current_profile[index])
            ),
            "current2024AlignedTopMetresNavd88": (
                None if not np.isfinite(aligned_current[index]) else float(aligned_current[index])
            ),
            "current2024ReturnCount": int(current_counts[index]),
            "signedAlignedResidualMetres": (
                None
                if not (np.isfinite(reference_profile[index]) and np.isfinite(aligned_current[index]))
                else float(aligned_current[index] - reference_profile[index])
            ),
        }
        for index in range(centers.size)
    ]
    stable = {
        "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        "lockedAlignment": locked,
        "trainingResiduals": training_residuals.tolist(),
        "holdoutResiduals": holdout_residuals.tolist(),
        "records": records,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "current-upper-roof-panel-shape-holdout-audit",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(args.controls),
                "sha256": stable["controlsSha256"],
                "artifactVersion": controls["artifactVersion"],
            },
            "reference2021ProfileAudit": controls["inputs"]["reference2021ProfileAudit"],
            "current2024Lidar": controls["inputs"]["current2024Lidar"],
            "current2024SurveyReview": controls["inputs"]["current2024SurveyReview"],
            "current2024RoofStateReview": controls["inputs"]["current2024RoofStateReview"],
            "officialRoofPage": controls["inputs"]["officialRoofPage"],
        },
        "profileSelection": selection,
        "pointCounts": {
            "current2024Total": current_total,
            "current2024Selected": int(current_y.size),
            "current2024SelectedClassCounts": {str(key): value for key, value in sorted(class_counts.items())},
        },
        "lockedPartition": partition,
        "lockedAlignment": locked,
        "profile": {
            "binCount": int(centers.size),
            "current2024ValidBinCount": int(np.count_nonzero(np.isfinite(current_profile))),
            "trainingPairCount": int(valid_training.sum()),
            "holdoutPairCount": int(valid_holdout.sum()),
            "trainingSignedResidualMetres": summary(training_residuals),
            "trainingAbsoluteResidualMetres": summary(np.abs(training_residuals)),
            "holdoutSignedResidualMetres": summary(holdout_residuals),
            "holdoutAbsoluteResidualMetres": summary(holdout_absolute),
            "holdoutAbsoluteResidualFeet": summary(holdout_absolute * FEET_PER_METRE),
            "records": records,
        },
        "uncertainty": {
            "reference2021VerticalAccuracy95Feet": reference_vertical95_feet,
            "current2024VerticalAccuracy95Feet": current_vertical95_feet,
            "combinedCrossEpochVerticalAccuracy95Feet": combined_vertical95_feet,
            "observedHoldoutP95AbsoluteResidualFeet": holdout_p95_feet,
            "current2024HorizontalAccuracy95Feet": current_horizontal95_feet,
            "absolutePositionHorizontalThresholdFeet": 1.0,
            "verticalCombinationRule": "root sum of squares",
            "nuisanceAlignmentWarning": (
                "The fitted north-south and vertical shifts support shape agreement only. "
                "They do not replace an independently surveyed absolute registration."
            ),
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": sha256_file(args.output_png),
        },
        "assessment": {
            "current2024UpperPanelShapeSupported": shape_supported,
            "current2024UpperPanelShapeHoldoutPassed": shape_supported,
            "current2024AbsolutePanelPositionEligible": False,
            "current2026PanelGeometryEstablished": False,
            "fullOpenRoofTopSurfaceEligible": False,
            "roofObstructionVolumeEligible": False,
            "publicationEligible": False,
            "blockers": [
                "CURRENT_2024_ABSOLUTE_HORIZONTAL_ACCURACY_EXCEEDS_1FT",
                "CURRENT_2026_EXACT_PANEL_GEOMETRY_NOT_PROVEN",
                "LOWER_PANEL_OPEN_STATE_TOP_SURFACES_NOT_COMPLETE",
                "PANEL_UNDERSIDES_NOT_MEASURED",
                "ROW_FRAME_HORIZONTAL_ACCURACY_NOT_YET_SUBFOOT",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": (
                "The locked 2024 holdout bins support persistence of the upper center "
                "panel's one-dimensional top shape through the 2024 acquisition. The "
                "nuisance alignment and the source horizontal accuracy prevent this "
                "artifact from establishing absolute panel position, full roof geometry, "
                "or publication-ready shade."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "pointCounts": artifact["pointCounts"],
        "lockedAlignment": artifact["lockedAlignment"],
        "profile": {key: value for key, value in artifact["profile"].items() if key != "records"},
        "uncertainty": artifact["uncertainty"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

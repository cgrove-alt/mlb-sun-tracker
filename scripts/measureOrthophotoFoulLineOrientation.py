#!/usr/bin/env python3
"""Measure a baseball field bearing from reviewed painted foul-line blocks."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from pyproj import CRS, Geod, Transformer
from scipy.ndimage import gaussian_filter1d, map_coordinates


ANALYSIS_VERSION = "reviewed-orthophoto-foul-line-orientation-v1"
REQUIRED_REVIEW_STATUS = "reviewed-direct-orthophoto-foul-line-blocks"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--preview", type=Path)
    parser.add_argument("--maximum-orientation-uncertainty-degrees", type=float, default=0.1)
    parser.add_argument("--maximum-training-holdout-disagreement-degrees", type=float, default=0.1)
    parser.add_argument("--maximum-included-angle-error-degrees", type=float, default=0.15)
    parser.add_argument("--maximum-ridge-residual-p95-pixels", type=float, default=1.0)
    parser.add_argument("--minimum-accepted-points-per-partition-line", type=int, default=180)
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


def decoded_pixels_sha256(image: np.ndarray) -> str:
    return hashlib.sha256(image.tobytes()).hexdigest()


def angular_difference(first: float, second: float) -> float:
    return float((first - second + 180.0) % 360.0 - 180.0)


def clockwise_span(first: float, second: float) -> float:
    return float((second - first + 360.0) % 360.0)


def raster_metadata(manifest: dict[str, Any]) -> dict[str, Any]:
    raster = manifest.get("raster", manifest.get("export"))
    if not isinstance(raster, dict):
        raise ValueError("Orthophoto manifest lacks raster metadata")
    return raster


def fit_true_bearing(
    fit: dict[str, Any],
    scan_axis: str,
    raster: dict[str, Any],
    to_lonlat: Transformer,
    geod: Geod,
) -> float:
    points = np.asarray(fit["points"], dtype=float)
    independent_index = 0 if scan_axis == "x" else 1
    start = float(np.min(points[:, independent_index]))
    end = float(np.max(points[:, independent_index]))
    coefficients = fit["coefficients"]
    if scan_axis == "x":
        first_pixel = (start, float(np.polyval(coefficients, start)))
        second_pixel = (end, float(np.polyval(coefficients, end)))
    else:
        first_pixel = (float(np.polyval(coefficients, start)), start)
        second_pixel = (float(np.polyval(coefficients, end)), end)
    extent = raster["extent"]
    projected = []
    for column, row in [first_pixel, second_pixel]:
        projected.append((
            float(extent["xmin"]) + column * float(raster["pixelSizeX"]),
            float(extent["ymax"]) - row * float(raster["pixelSizeY"]),
        ))
    first_lonlat = to_lonlat.transform(*projected[0])
    second_lonlat = to_lonlat.transform(*projected[1])
    forward, _, _ = geod.inv(*first_lonlat, *second_lonlat)
    return float(forward % 360.0)


def fit_line(points: np.ndarray, scan_axis: str) -> dict[str, Any]:
    if points.shape[0] < 2:
        raise ValueError("Foul-line fit needs at least two points")
    independent_index, dependent_index = (0, 1) if scan_axis == "x" else (1, 0)
    retained = np.arange(points.shape[0])
    fit_points = points.copy()
    for _ in range(6):
        coefficients = np.polyfit(
            fit_points[:, independent_index], fit_points[:, dependent_index], 1
        )
        residuals = fit_points[:, dependent_index] - np.polyval(
            coefficients, fit_points[:, independent_index]
        )
        residual_center = float(np.median(residuals))
        residual_mad = float(np.median(np.abs(residuals - residual_center))) * 1.4826
        threshold = 3.0 * max(residual_mad, 0.2)
        keep = np.abs(residuals - residual_center) < threshold
        if keep.all():
            break
        fit_points = fit_points[keep]
        retained = retained[keep]
    coefficients = np.polyfit(
        fit_points[:, independent_index], fit_points[:, dependent_index], 1
    )
    residuals = fit_points[:, dependent_index] - np.polyval(
        coefficients, fit_points[:, independent_index]
    )
    if scan_axis == "x":
        image_angle = math.degrees(math.atan2(float(coefficients[0]), 1.0))
    else:
        image_angle = math.degrees(math.atan2(1.0, float(coefficients[0])))
    bearing = (90.0 + image_angle) % 360.0
    return {
        "coefficients": coefficients,
        "bearingDegrees": bearing,
        "retainedIndices": retained,
        "points": fit_points,
        "residuals": residuals,
    }


def pixel_line_equation(fit: dict[str, Any], scan_axis: str) -> np.ndarray:
    slope, intercept = map(float, fit["coefficients"])
    if scan_axis == "x":
        return np.asarray([slope, -1.0, intercept], dtype=float)
    if scan_axis == "y":
        return np.asarray([1.0, -slope, -intercept], dtype=float)
    raise ValueError(f"Unsupported scan axis {scan_axis}")


def pixel_line_intersection(
    fits: list[dict[str, Any]],
    definitions: list[dict[str, Any]],
) -> np.ndarray:
    if len(fits) != 2 or len(definitions) != 2:
        raise ValueError("Foul-line intersection requires exactly two lines")
    equations = [
        pixel_line_equation(fit, definition["scanAxis"])
        for fit, definition in zip(fits, definitions)
    ]
    matrix = np.asarray([equation[:2] for equation in equations], dtype=float)
    right = -np.asarray([equation[2] for equation in equations], dtype=float)
    if abs(float(np.linalg.det(matrix))) < 1e-9:
        raise ValueError("Foul-line fits do not have a stable intersection")
    return np.linalg.solve(matrix, right)


def line_normal(definition: dict[str, Any]) -> np.ndarray:
    slope = float(definition["approximateLine"]["dependentSlope"])
    if definition["scanAxis"] == "x":
        normal = np.asarray([-slope, 1.0], dtype=float)
    else:
        normal = np.asarray([1.0, -slope], dtype=float)
    return normal / np.linalg.norm(normal)


def extract_line_points(
    whiteness: np.ndarray,
    definition: dict[str, Any],
    extraction: dict[str, Any],
) -> list[dict[str, Any]]:
    scan_axis = definition["scanAxis"]
    slope = float(definition["approximateLine"]["dependentSlope"])
    intercept = float(definition["approximateLine"]["dependentIntercept"])
    radius = float(extraction["normalSearchRadiusPixels"])
    step = float(extraction["normalSearchStepPixels"])
    sigma = float(extraction["profileGaussianSigmaSamples"])
    minimum_prominence = float(extraction["minimumProminence"])
    offsets = np.arange(-radius, radius + step * 0.5, step, dtype=float)
    normal = line_normal(definition)
    records: list[dict[str, Any]] = []
    for block_index, block in enumerate(definition["blocks"]):
        for scan_value in np.arange(float(block["start"]), float(block["end"]) + 0.1, 1.0):
            if scan_axis == "x":
                base = np.asarray([scan_value, slope * scan_value + intercept], dtype=float)
            elif scan_axis == "y":
                base = np.asarray([slope * scan_value + intercept, scan_value], dtype=float)
            else:
                raise ValueError(f"Unsupported scan axis {scan_axis}")
            candidates = base[None, :] + offsets[:, None] * normal[None, :]
            profile = map_coordinates(
                whiteness,
                np.vstack((candidates[:, 1], candidates[:, 0])),
                order=1,
                mode="nearest",
                prefilter=False,
            )
            profile = gaussian_filter1d(profile, sigma=sigma, mode="nearest")
            peak_index = int(np.argmax(profile))
            peak_offset = float(offsets[peak_index])
            prominence = float(profile[peak_index] - np.percentile(profile, 30))
            if abs(peak_offset) >= radius * 0.8 or prominence < minimum_prominence:
                continue
            point = candidates[peak_index]
            records.append({
                "point": point,
                "blockIndex": block_index,
                "partition": block["partition"],
                "prominence": prominence,
                "normal": normal,
            })
    return records


def fit_partition(
    records: list[dict[str, Any]],
    scan_axis: str,
    partition: str | None,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    selected = [
        record for record in records
        if partition is None or record["partition"] == partition
    ]
    points = np.asarray([record["point"] for record in selected], dtype=float)
    fit = fit_line(points, scan_axis)
    retained = [selected[int(index)] for index in fit["retainedIndices"]]
    return fit, retained


def orientation_from_fits(first: dict[str, Any], third: dict[str, Any]) -> dict[str, float]:
    first_bearing = float(first["bearingDegrees"])
    third_bearing = float(third["bearingDegrees"])
    included_angle = clockwise_span(first_bearing, third_bearing)
    if not 80.0 < included_angle < 100.0:
        raise ValueError(f"Reviewed foul lines do not form the expected quadrant: {included_angle:.6f}")
    return {
        "firstBaseFoulLineBearingDegrees": first_bearing,
        "thirdBaseFoulLineBearingDegrees": third_bearing,
        "includedAngleDegrees": included_angle,
        "includedAngleErrorDegrees": abs(included_angle - 90.0),
        "orientationDegrees": (first_bearing + included_angle / 2.0) % 360.0,
    }


def perturbed_fit(
    records: list[dict[str, Any]],
    scan_axis: str,
    block_offsets: np.ndarray,
    raster: dict[str, Any],
    to_lonlat: Transformer,
    geod: Geod,
) -> dict[str, Any]:
    points = np.asarray([
        record["point"] + block_offsets[int(record["blockIndex"])] * record["normal"]
        for record in records
    ])
    independent_index, dependent_index = (0, 1) if scan_axis == "x" else (1, 0)
    coefficients = np.polyfit(points[:, independent_index], points[:, dependent_index], 1)
    fit = {"coefficients": coefficients, "points": points}
    fit["bearingDegrees"] = fit_true_bearing(
        fit,
        scan_axis,
        raster,
        to_lonlat,
        geod,
    )
    return fit


def fit_summary(
    definition: dict[str, Any],
    fit: dict[str, Any],
    retained: list[dict[str, Any]],
) -> dict[str, Any]:
    residuals = np.abs(np.asarray(fit["residuals"], dtype=float))
    points = np.asarray(fit["points"], dtype=float)
    independent_index = 0 if definition["scanAxis"] == "x" else 1
    return {
        "lineId": definition["lineId"],
        "scanAxis": definition["scanAxis"],
        "acceptedPointCount": len(retained),
        "acceptedBlockCount": len({int(record["blockIndex"]) for record in retained}),
        "bearingDegrees": round(float(fit["bearingDegrees"]), 9),
        "pixelLine": {
            "dependentCoordinate": "row" if definition["scanAxis"] == "x" else "column",
            "independentCoordinate": "column" if definition["scanAxis"] == "x" else "row",
            "slope": round(float(fit["coefficients"][0]), 12),
            "intercept": round(float(fit["coefficients"][1]), 9),
            "independentMinimum": round(float(np.min(points[:, independent_index])), 6),
            "independentMaximum": round(float(np.max(points[:, independent_index])), 6),
        },
        "ridgeResidualPixels": {
            "median": round(float(np.median(residuals)), 6),
            "p95": round(float(np.percentile(residuals, 95)), 6),
            "maximum": round(float(np.max(residuals)), 6),
        },
    }


def render_preview(
    image: np.ndarray,
    controls: dict[str, Any],
    per_line_records: list[list[dict[str, Any]]],
    final_fits: list[dict[str, Any]],
    output: Path,
) -> None:
    preview = image.copy()
    colors = {"training": (0, 255, 0), "holdout": (0, 165, 255)}
    for definition, records, fit in zip(controls["lines"], per_line_records, final_fits):
        for record in records:
            point = tuple(np.rint(record["point"]).astype(int))
            cv2.circle(preview, point, 1, colors[record["partition"]], -1, cv2.LINE_AA)
        coefficients = fit["coefficients"]
        if definition["scanAxis"] == "x":
            start = min(float(block["start"]) for block in definition["blocks"])
            end = max(float(block["end"]) for block in definition["blocks"])
            first = (int(round(start)), int(round(np.polyval(coefficients, start))))
            second = (int(round(end)), int(round(np.polyval(coefficients, end))))
        else:
            start = min(float(block["start"]) for block in definition["blocks"])
            end = max(float(block["end"]) for block in definition["blocks"])
            first = (int(round(np.polyval(coefficients, start))), int(round(start)))
            second = (int(round(np.polyval(coefficients, end))), int(round(end)))
        cv2.line(preview, first, second, (255, 0, 255), 2, cv2.LINE_AA)
    crop = controls["previewCrop"]
    preview = preview[int(crop["top"]):int(crop["bottom"]), int(crop["left"]):int(crop["right"])]
    cv2.rectangle(preview, (0, 0), (preview.shape[1], 28), (0, 0, 0), -1)
    cv2.putText(
        preview,
        "foul-line orientation | green=training | orange=holdout | magenta=accepted all-block fit",
        (8, 19),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.48,
        (255, 255, 255),
        1,
        cv2.LINE_AA,
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output), preview):
        raise ValueError(f"Could not write preview {output}")


def main() -> None:
    args = parse_args()
    controls = json.loads(args.controls.read_text())
    if controls.get("review", {}).get("status") != REQUIRED_REVIEW_STATUS:
        raise ValueError(f"Controls must have review status {REQUIRED_REVIEW_STATUS}")
    if len(controls.get("lines", [])) != 2:
        raise ValueError("Exactly two reviewed foul-line definitions are required")

    source = controls["source"]
    manifest_path = Path(source["manifestPath"])
    image_path = Path(source["imagePath"])
    if file_sha256(manifest_path) != source["manifestSha256"]:
        raise ValueError("Source manifest SHA-256 does not match reviewed controls")
    manifest = json.loads(manifest_path.read_text())
    if manifest.get("artifactVersion") != source["manifestArtifactVersion"]:
        raise ValueError("Source manifest artifact version does not match reviewed controls")
    if file_sha256(image_path) != source["imageSha256"]:
        raise ValueError("Source image SHA-256 does not match reviewed controls")
    decoded_image = cv2.imread(str(image_path), cv2.IMREAD_UNCHANGED)
    if decoded_image is None:
        raise ValueError("Could not decode source orthophoto")
    if decoded_pixels_sha256(decoded_image) != source["decodedPixelsSha256"]:
        raise ValueError("Decoded source pixels SHA-256 does not match reviewed controls")
    if decoded_image.ndim != 3 or decoded_image.shape[2] not in {3, 4}:
        raise ValueError("Source orthophoto must decode to BGR or BGRA pixels")
    image = (
        cv2.cvtColor(decoded_image, cv2.COLOR_BGRA2BGR)
        if decoded_image.shape[2] == 4
        else decoded_image
    )
    raster = raster_metadata(manifest)
    dimensions = raster.get("dimensionsPixels")
    expected_width = raster.get("width", dimensions[0] if dimensions else None)
    expected_height = raster.get("height", dimensions[1] if dimensions else None)
    if expected_width != image.shape[1] or expected_height != image.shape[0]:
        raise ValueError("Source manifest dimensions do not match decoded image")
    coordinate_reference_system = raster.get("coordinateReferenceSystem")
    if not coordinate_reference_system:
        raise ValueError("Source manifest lacks a coordinate reference system")
    to_lonlat = Transformer.from_crs(
        CRS.from_user_input(coordinate_reference_system), 4326, always_xy=True
    )
    geod = Geod(ellps="GRS80")

    extraction = controls["ridgeExtraction"]
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB).astype(float)
    whiteness = lab[:, :, 0] - float(extraction["whitenessChrominancePenalty"]) * np.hypot(
        lab[:, :, 1] - 128.0, lab[:, :, 2] - 128.0
    )
    per_line_records = [
        extract_line_points(whiteness, definition, extraction)
        for definition in controls["lines"]
    ]
    partition_fits: dict[str, list[dict[str, Any]]] = {"training": [], "holdout": []}
    partition_retained: dict[str, list[list[dict[str, Any]]]] = {"training": [], "holdout": []}
    final_fits = []
    final_retained = []
    for definition, records in zip(controls["lines"], per_line_records):
        for partition in ["training", "holdout"]:
            fit, retained = fit_partition(records, definition["scanAxis"], partition)
            fit["bearingDegrees"] = fit_true_bearing(
                fit, definition["scanAxis"], raster, to_lonlat, geod
            )
            partition_fits[partition].append(fit)
            partition_retained[partition].append(retained)
        fit, retained = fit_partition(records, definition["scanAxis"], None)
        fit["bearingDegrees"] = fit_true_bearing(
            fit, definition["scanAxis"], raster, to_lonlat, geod
        )
        final_fits.append(fit)
        final_retained.append(retained)

    training_orientation = orientation_from_fits(*partition_fits["training"])
    holdout_orientation = orientation_from_fits(*partition_fits["holdout"])
    final_orientation = orientation_from_fits(*final_fits)
    training_intersection = pixel_line_intersection(
        partition_fits["training"], controls["lines"]
    )
    holdout_intersection = pixel_line_intersection(
        partition_fits["holdout"], controls["lines"]
    )
    final_intersection = pixel_line_intersection(final_fits, controls["lines"])
    training_holdout_intersection_disagreement = float(
        np.linalg.norm(training_intersection - holdout_intersection)
    )
    training_holdout_disagreement = abs(angular_difference(
        training_orientation["orientationDegrees"],
        holdout_orientation["orientationDegrees"],
    ))

    rng = np.random.default_rng(int(extraction["monteCarloSeed"]))
    point_uncertainty = float(extraction["pointUncertaintyPixels"])
    sample_count = int(extraction["monteCarloSamples"])
    sample_orientations = np.empty(sample_count, dtype=float)
    sample_intersections = np.empty((sample_count, 2), dtype=float)
    for index in range(sample_count):
        sampled_bearings = []
        sampled_fits = []
        for definition, retained in zip(controls["lines"], final_retained):
            block_count = len(definition["blocks"])
            block_offsets = rng.uniform(-point_uncertainty, point_uncertainty, block_count)
            sampled_fit = perturbed_fit(
                retained,
                definition["scanAxis"],
                block_offsets,
                raster,
                to_lonlat,
                geod,
            )
            sampled_fits.append(sampled_fit)
            sampled_bearings.append(float(sampled_fit["bearingDegrees"]))
        span = clockwise_span(sampled_bearings[0], sampled_bearings[1])
        sample_orientations[index] = (sampled_bearings[0] + span / 2.0) % 360.0
        sample_intersections[index] = pixel_line_intersection(
            sampled_fits, controls["lines"]
        )
    sample_errors = np.abs(np.asarray([
        angular_difference(value, final_orientation["orientationDegrees"])
        for value in sample_orientations
    ]))
    monte_carlo_p95 = float(np.percentile(sample_errors, 95))
    intersection_errors = np.linalg.norm(
        sample_intersections - final_intersection[None, :], axis=1
    )
    intersection_monte_carlo_p95 = float(np.percentile(intersection_errors, 95))
    combined_intersection_uncertainty = math.sqrt(
        intersection_monte_carlo_p95 ** 2
        + training_holdout_intersection_disagreement ** 2
    )
    half_included_angle_error = final_orientation["includedAngleErrorDegrees"] / 2.0
    combined_uncertainty = math.sqrt(
        monte_carlo_p95 ** 2
        + training_holdout_disagreement ** 2
        + half_included_angle_error ** 2
    )

    training_summaries = [
        fit_summary(definition, fit, retained)
        for definition, fit, retained in zip(
            controls["lines"], partition_fits["training"], partition_retained["training"]
        )
    ]
    holdout_summaries = [
        fit_summary(definition, fit, retained)
        for definition, fit, retained in zip(
            controls["lines"], partition_fits["holdout"], partition_retained["holdout"]
        )
    ]
    final_summaries = [
        fit_summary(definition, fit, retained)
        for definition, fit, retained in zip(controls["lines"], final_fits, final_retained)
    ]
    blockers = []
    all_partition_summaries = training_summaries + holdout_summaries
    if any(
        summary["acceptedPointCount"] < args.minimum_accepted_points_per_partition_line
        for summary in all_partition_summaries
    ):
        blockers.append("FOUL_LINE_ACCEPTED_POINT_COUNT_TOO_SMALL")
    if any(
        summary["ridgeResidualPixels"]["p95"] > args.maximum_ridge_residual_p95_pixels
        for summary in all_partition_summaries
    ):
        blockers.append("FOUL_LINE_RIDGE_RESIDUAL_TOO_HIGH")
    if training_holdout_disagreement > args.maximum_training_holdout_disagreement_degrees:
        blockers.append("FOUL_LINE_TRAINING_HOLDOUT_ORIENTATION_DISAGREEMENT_TOO_HIGH")
    if max(
        training_orientation["includedAngleErrorDegrees"],
        holdout_orientation["includedAngleErrorDegrees"],
        final_orientation["includedAngleErrorDegrees"],
    ) > args.maximum_included_angle_error_degrees:
        blockers.append("FOUL_LINE_INCLUDED_ANGLE_ERROR_TOO_HIGH")
    if combined_uncertainty > args.maximum_orientation_uncertainty_degrees:
        blockers.append("FOUL_LINE_ORIENTATION_UNCERTAINTY_TOO_HIGH")
    measurement_eligible = not blockers

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": controls["stadiumId"],
        "inputs": {
            "controls": {"path": str(args.controls), "sha256": file_sha256(args.controls)},
            "manifest": {
                "path": str(manifest_path),
                "sha256": source["manifestSha256"],
                "artifactVersion": source["manifestArtifactVersion"],
            },
            "orthophoto": {"path": str(image_path), "sha256": source["imageSha256"]},
        },
        "review": controls["review"],
        "rulesBasis": controls["rulesBasis"],
        "source": {
            "serviceUrl": manifest["source"]["serviceUrl"],
            "sourceYear": manifest["source"].get("sourceYear", 2021),
            "groundConditionDate": manifest["source"].get("groundConditionDate")
            or manifest["source"].get("catalogItem", {}).get("groundConditionDate"),
            "coordinateReferenceSystem": coordinate_reference_system,
            "pixelSize": {
                "x": raster["pixelSizeX"],
                "y": raster["pixelSizeY"],
            },
            "pixelLinearUnit": (
                "US survey foot" if "6438" in str(coordinate_reference_system) else "metre"
            ),
        },
        "method": {
            "description": "Locally whiteness-maximized painted foul-line center ridges with alternating spatial-block holdouts",
            "finalRefitRule": "use all accepted blocks only after the disjoint holdout gates pass",
            "uncertainty": "block-correlated uniform normal offsets plus holdout disagreement plus half included-angle error by root-sum-square",
            "ridgeExtraction": extraction,
        },
        "thresholds": {
            "maximumOrientationUncertaintyDegrees": args.maximum_orientation_uncertainty_degrees,
            "maximumTrainingHoldoutDisagreementDegrees": args.maximum_training_holdout_disagreement_degrees,
            "maximumIncludedAngleErrorDegrees": args.maximum_included_angle_error_degrees,
            "maximumRidgeResidualP95Pixels": args.maximum_ridge_residual_p95_pixels,
            "minimumAcceptedPointsPerPartitionLine": args.minimum_accepted_points_per_partition_line,
        },
        "crossValidation": {
            "training": {
                **training_orientation,
                "homePlateFoulLineIntersectionPixel": [
                    round(float(value), 9) for value in training_intersection
                ],
                "lines": training_summaries,
            },
            "holdout": {
                **holdout_orientation,
                "homePlateFoulLineIntersectionPixel": [
                    round(float(value), 9) for value in holdout_intersection
                ],
                "lines": holdout_summaries,
            },
            "trainingHoldoutDisagreementDegrees": round(training_holdout_disagreement, 9),
            "trainingHoldoutIntersectionDisagreementPixels": round(
                training_holdout_intersection_disagreement, 9
            ),
        },
        "measurements": {
            **final_orientation,
            "orientationDegrees": round(final_orientation["orientationDegrees"], 9),
            "orientationUncertaintyDegrees": round(combined_uncertainty, 9),
            "homePlateFoulLineIntersectionPixel": [
                round(float(value), 9) for value in final_intersection
            ],
            "homePlateIntersectionUncertaintyPixels": round(
                combined_intersection_uncertainty, 9
            ),
            "allBlockLines": final_summaries,
            "uncertaintyComponentsDegrees": {
                "blockCorrelatedMonteCarloP95": round(monte_carlo_p95, 9),
                "trainingHoldoutDisagreement": round(training_holdout_disagreement, 9),
                "halfIncludedAngleError": round(half_included_angle_error, 9),
            },
            "monteCarloAbsoluteAngularErrorDegrees": {
                "median": round(float(np.percentile(sample_errors, 50)), 9),
                "p95": round(monte_carlo_p95, 9),
                "p99": round(float(np.percentile(sample_errors, 99)), 9),
                "maximum": round(float(np.max(sample_errors)), 9),
            },
            "monteCarloIntersectionErrorPixels": {
                "median": round(float(np.percentile(intersection_errors, 50)), 9),
                "p95": round(intersection_monte_carlo_p95, 9),
                "p99": round(float(np.percentile(intersection_errors, 99)), 9),
                "maximum": round(float(np.max(intersection_errors)), 9),
            },
        },
        "assessment": {
            "orientationMeasurementEligible": measurement_eligible,
            "absoluteHorizontalMeasurementEligible": False,
            "blockers": blockers,
            "absoluteHorizontalBlockers": [
                "SOURCE_ABSOLUTE_HORIZONTAL_ACCURACY_REQUIRES_SEPARATE_GROUND_FRAME_AUDIT"
            ],
        },
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                "ORIENTATION_ONLY",
                "ROW_GEOMETRY_NOT_ESTABLISHED",
                "ROW_ELEVATIONS_NOT_ESTABLISHED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED"
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "reviewed-orthophoto-foul-line-orientation",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        **stable,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    if args.preview:
        render_preview(image, controls, per_line_records, final_fits, args.preview)
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "orientationDegrees": artifact["measurements"]["orientationDegrees"],
        "orientationUncertaintyDegrees": artifact["measurements"]["orientationUncertaintyDegrees"],
        "trainingHoldoutDisagreementDegrees": artifact["crossValidation"]["trainingHoldoutDisagreementDegrees"],
        "orientationMeasurementEligible": measurement_eligible,
        "blockers": blockers,
    }, indent=2))


if __name__ == "__main__":
    main()

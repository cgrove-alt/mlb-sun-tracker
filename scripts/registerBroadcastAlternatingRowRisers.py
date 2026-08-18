#!/usr/bin/env python3
"""Register current row identities from alternating broadcast riser edges.

The method is intentionally narrow. It requires exactly eight strong riser
edges in a 15-row bank whose current identities run from row 5 through row 19.
The primary strip controls the fit. Separate left and right strips are used as
image holdouts and are never included in the primary edge detection.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from scipy.interpolate import PchipInterpolator
from scipy.signal import find_peaks


CONTROL_ROWS_DESCENDING = np.asarray([19, 17, 15, 13, 11, 9, 7, 5], dtype=np.float64)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_version(value: dict) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def detect_risers(
    grayscale: np.ndarray,
    x_minimum: int,
    x_maximum: int,
    y_minimum: int,
    y_maximum: int,
    minimum_height: float,
    minimum_prominence: float,
    minimum_distance: int,
) -> tuple[np.ndarray, list[dict]]:
    signal = np.median(grayscale[y_minimum:y_maximum, x_minimum:x_maximum], axis=1)
    smoothed = np.convolve(signal, np.ones(3, dtype=np.float64) / 3.0, mode="same")
    negative_gradient = -np.gradient(smoothed)
    peaks, properties = find_peaks(
        negative_gradient,
        height=minimum_height,
        prominence=minimum_prominence,
        distance=minimum_distance,
    )
    absolute = peaks + y_minimum
    diagnostics = [
        {
            "yPixel": int(y_value),
            "negativeGradient": float(properties["peak_heights"][index]),
            "prominence": float(properties["prominences"][index]),
        }
        for index, y_value in enumerate(absolute)
    ]
    return absolute.astype(np.float64), diagnostics


def match_holdout(primary: np.ndarray, candidates: np.ndarray, maximum_distance: float) -> np.ndarray:
    available = list(range(candidates.size))
    matched = []
    for expected in primary:
        if not available:
            matched.append(np.nan)
            continue
        choice = min(available, key=lambda index: abs(float(candidates[index] - expected)))
        if abs(float(candidates[choice] - expected)) > maximum_distance:
            matched.append(np.nan)
            continue
        matched.append(float(candidates[choice]))
        available.remove(choice)
    return np.asarray(matched, dtype=np.float64)


def row_interpolator(row_controls_descending: np.ndarray, pixels_ascending_y: np.ndarray) -> PchipInterpolator:
    finite = np.isfinite(pixels_ascending_y)
    if np.count_nonzero(finite) < 3:
        raise ValueError("At least three finite riser controls are required for interpolation")
    rows = row_controls_descending[finite]
    pixels = pixels_ascending_y[finite]
    order = np.argsort(rows)
    return PchipInterpolator(rows[order], pixels[order], extrapolate=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("aisle_profile", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--section-a", required=True)
    parser.add_argument("--section-b", required=True)
    parser.add_argument("--y-minimum", type=int, default=10)
    parser.add_argument("--y-maximum", type=int, default=220)
    parser.add_argument("--primary-x-minimum", type=int, default=280)
    parser.add_argument("--primary-x-maximum", type=int, default=320)
    parser.add_argument("--left-x-minimum", type=int, default=240)
    parser.add_argument("--left-x-maximum", type=int, default=270)
    parser.add_argument("--right-x-minimum", type=int, default=320)
    parser.add_argument("--right-x-maximum", type=int, default=350)
    parser.add_argument("--minimum-gradient", type=float, default=3.0)
    parser.add_argument("--minimum-prominence", type=float, default=3.0)
    parser.add_argument("--minimum-distance-pixels", type=int, default=20)
    parser.add_argument("--maximum-holdout-match-pixels", type=float, default=6.0)
    parser.add_argument("--render-x-minimum", type=int, default=220)
    parser.add_argument("--render-x-maximum", type=int, default=360)
    arguments = parser.parse_args()

    frame = cv2.imread(str(arguments.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode broadcast frame")
    grayscale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float64)
    height, width = grayscale.shape
    if not (
        0 <= arguments.y_minimum < arguments.y_maximum <= height
        and 0 <= arguments.left_x_minimum < arguments.left_x_maximum <= width
        and 0 <= arguments.primary_x_minimum < arguments.primary_x_maximum <= width
        and 0 <= arguments.right_x_minimum < arguments.right_x_maximum <= width
    ):
        raise ValueError("Detection strip is outside the frame")

    metric_bytes = arguments.metric_rows.read_bytes()
    metric = json.loads(metric_bytes)
    profile_bytes = arguments.aisle_profile.read_bytes()
    profile = json.loads(profile_bytes)
    represented = {
        (str(row["sectionId"]), str(row["rowId"]))
        for row in metric["rows"]
    }
    expected = {
        (section, str(row_number))
        for section in (arguments.section_a, arguments.section_b)
        for row_number in range(5, 20)
    }
    missing = sorted(expected - represented)
    if missing:
        raise ValueError(f"Current metric product is missing row identities: {missing}")
    if profile.get("artifactKind") != "identity-matched-lidar-aisle-profile-diagnostic":
        raise ValueError("Aisle profile is not the expected measured diagnostic")
    if profile["method"]["sectionA"] != arguments.section_a or profile["method"]["sectionB"] != arguments.section_b:
        raise ValueError("Aisle profile sections do not match the requested boundary")
    profile_rows = [int(control["rowId"]) for control in profile["controls"]]
    if profile_rows != list(range(5, 20)):
        raise ValueError("Aisle profile does not contain the complete ordered 5 through 19 row sequence")

    strips = {
        "primary": (arguments.primary_x_minimum, arguments.primary_x_maximum),
        "leftHoldout": (arguments.left_x_minimum, arguments.left_x_maximum),
        "rightHoldout": (arguments.right_x_minimum, arguments.right_x_maximum),
    }
    detected: dict[str, np.ndarray] = {}
    detection_diagnostics: dict[str, list[dict]] = {}
    for name, (x_minimum, x_maximum) in strips.items():
        peaks, diagnostics = detect_risers(
            grayscale,
            x_minimum,
            x_maximum,
            arguments.y_minimum,
            arguments.y_maximum,
            arguments.minimum_gradient,
            arguments.minimum_prominence,
            arguments.minimum_distance_pixels,
        )
        detected[name] = peaks
        detection_diagnostics[name] = diagnostics
    primary = detected["primary"]
    if primary.size != CONTROL_ROWS_DESCENDING.size:
        raise ValueError(
            f"Primary strip must contain exactly eight strong risers, found {primary.size}: {primary.tolist()}"
        )
    left = match_holdout(primary, detected["leftHoldout"], arguments.maximum_holdout_match_pixels)
    right = match_holdout(primary, detected["rightHoldout"], arguments.maximum_holdout_match_pixels)

    strip_centers = np.asarray([
        (arguments.left_x_minimum + arguments.left_x_maximum - 1) / 2.0,
        (arguments.primary_x_minimum + arguments.primary_x_maximum - 1) / 2.0,
        (arguments.right_x_minimum + arguments.right_x_maximum - 1) / 2.0,
    ])
    control_pixels_by_strip = np.column_stack((left, primary, right))
    row_numbers = np.arange(5, 20, dtype=np.float64)
    primary_interpolator = row_interpolator(CONTROL_ROWS_DESCENDING, primary)
    primary_all_rows = primary_interpolator(row_numbers)
    row_spacing = np.abs(np.diff(primary_all_rows))

    left_residuals = np.abs(left - primary)
    right_residuals = np.abs(right - primary)
    residuals = np.concatenate((
        left_residuals[np.isfinite(left_residuals)],
        right_residuals[np.isfinite(right_residuals)],
    ))
    if np.count_nonzero(np.isfinite(left)) < 6 or np.count_nonzero(np.isfinite(right)) < 6:
        raise ValueError("Each holdout strip must independently match at least six primary risers")
    residual_p95 = float(np.percentile(residuals, 95))
    median_spacing = float(np.median(row_spacing))
    residual_row_fraction = residual_p95 / median_spacing
    registration_eligible = bool(
        residual_row_fraction <= 0.5
        and float(row_spacing.min()) >= 5.0
        and float(row_spacing.max()) <= 25.0
    )

    render_x = np.arange(arguments.render_x_minimum, arguments.render_x_maximum + 1, dtype=np.float64)
    curves: dict[int, np.ndarray] = {}
    for row_number in range(5, 20):
        strip_y = []
        for strip_index in range(3):
            interpolation = row_interpolator(
                CONTROL_ROWS_DESCENDING,
                control_pixels_by_strip[:, strip_index],
            )
            strip_y.append(float(interpolation(row_number)))
        valid = np.isfinite(strip_y)
        degree = min(2, int(np.count_nonzero(valid)) - 1)
        coefficients = np.polyfit(strip_centers[valid], np.asarray(strip_y)[valid], degree)
        curves[row_number] = np.polyval(coefficients, render_x)

    rendered = frame.copy()
    colors = {"control": (0, 220, 255), "interpolated": (255, 180, 0)}
    for row_number, y_values in curves.items():
        points = np.rint(np.column_stack((render_x, y_values))).astype(np.int32)
        kind = "control" if row_number % 2 == 1 else "interpolated"
        cv2.polylines(rendered, [points], False, colors[kind], 1, cv2.LINE_AA)
        label_index = min(8, len(points) - 1)
        label = str(row_number)
        cv2.putText(
            rendered,
            label,
            tuple(int(value) for value in points[label_index]),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.40,
            colors[kind],
            1,
            cv2.LINE_AA,
        )
    for name, (x_minimum, x_maximum) in strips.items():
        color = (60, 220, 60) if name != "primary" else (255, 70, 255)
        cv2.rectangle(rendered, (x_minimum, arguments.y_minimum), (x_maximum - 1, arguments.y_maximum - 1), color, 1)

    output_png = arguments.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_png), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write registration preview")

    stable = {
        "frameSha256": sha256_file(arguments.frame),
        "metricRowsSha256": hashlib.sha256(metric_bytes).hexdigest(),
        "aisleProfileSha256": hashlib.sha256(profile_bytes).hexdigest(),
        "parameters": {
            "sectionA": arguments.section_a,
            "sectionB": arguments.section_b,
            "yMinimum": arguments.y_minimum,
            "yMaximum": arguments.y_maximum,
            "strips": {name: {"xMinimum": value[0], "xMaximum": value[1]} for name, value in strips.items()},
            "minimumGradient": arguments.minimum_gradient,
            "minimumProminence": arguments.minimum_prominence,
            "minimumDistancePixels": arguments.minimum_distance_pixels,
            "maximumHoldoutMatchPixels": arguments.maximum_holdout_match_pixels,
        },
        "primaryControlRowsDescending": CONTROL_ROWS_DESCENDING.astype(int).tolist(),
        "primaryControlPixelsAscendingY": primary.astype(int).tolist(),
        "leftHoldoutMatchedPixels": [None if not np.isfinite(value) else float(value) for value in left],
        "rightHoldoutMatchedPixels": [None if not np.isfinite(value) else float(value) for value in right],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "official-broadcast-alternating-riser-row-registration",
        "artifactVersion": stable_version(stable),
        "stadiumId": metric["stadiumId"],
        "inputs": {
            "frame": {"path": str(arguments.frame), "sha256": stable["frameSha256"]},
            "metricRows": {
                "path": str(arguments.metric_rows),
                "sha256": stable["metricRowsSha256"],
                "artifactVersion": metric["artifactVersion"],
            },
            "aisleProfile": {
                "path": str(arguments.aisle_profile),
                "sha256": stable["aisleProfileSha256"],
                "artifactVersion": profile["artifactVersion"],
            },
        },
        "identityBasis": {
            "boundarySections": [arguments.section_a, arguments.section_b],
            "currentRows": list(range(5, 20)),
            "observedStrongRisers": CONTROL_ROWS_DESCENDING.astype(int).tolist(),
            "assignment": "eight alternating strong risers spanning the front and back of the complete current 15-row bank",
        },
        "parameters": stable["parameters"],
        "detectionDiagnostics": detection_diagnostics,
        "registration": {
            "primaryControlRowsDescending": stable["primaryControlRowsDescending"],
            "primaryControlPixelsAscendingY": stable["primaryControlPixelsAscendingY"],
            "leftHoldoutMatchedPixels": stable["leftHoldoutMatchedPixels"],
            "rightHoldoutMatchedPixels": stable["rightHoldoutMatchedPixels"],
            "rows": [
                {
                    "rowId": str(row_number),
                    "primaryYPixel": float(primary_all_rows[row_number - 5]),
                    "registrationKind": "detected-control" if row_number % 2 == 1 else "shape-preserving-interpolation",
                    "renderedCurvePixels": [
                        [float(x_value), float(y_value)]
                        for x_value, y_value in zip(render_x, curves[row_number])
                    ],
                }
                for row_number in range(5, 20)
            ],
        },
        "holdoutValidation": {
            "sampleCount": int(residuals.size),
            "residualMedianPixels": float(np.median(residuals)),
            "residualP95Pixels": residual_p95,
            "residualMaximumPixels": float(residuals.max()),
            "medianAllRowSpacingPixels": median_spacing,
            "minimumAllRowSpacingPixels": float(row_spacing.min()),
            "maximumAllRowSpacingPixels": float(row_spacing.max()),
            "residualP95Rows": residual_row_fraction,
            "thresholdRows": 0.5,
        },
        "previewPng": str(output_png),
        "previewPngSha256": sha256_file(output_png),
        "registrationEligibleForManualShadeReview": registration_eligible,
        "publication": {
            "eligible": False,
            "blockers": [
                "REGISTRATION_APPLIES_ONLY_TO_VISIBLE_LOCAL_ROW_BANK",
                "SHADE_BOUNDARIES_NOT_YET_LABELED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "outputPng": str(output_png),
        "artifactVersion": artifact["artifactVersion"],
        "primaryRisers": stable["primaryControlPixelsAscendingY"],
        "holdoutValidation": artifact["holdoutValidation"],
        "registrationEligibleForManualShadeReview": registration_eligible,
    }, indent=2))


if __name__ == "__main__":
    main()

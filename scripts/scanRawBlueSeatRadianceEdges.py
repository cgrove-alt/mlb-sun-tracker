#!/usr/bin/env python3
"""Scan raw broadcast pixels for repeated blue-seat luminance edges.

This is a discovery tool only. It does not label, validate, or approve a shade
boundary, and it deliberately has no row-geometry input.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def local_maxima(values: np.ndarray, margin: int) -> list[int]:
    maxima = []
    for index in range(max(1, margin), min(len(values) - 1, len(values) - margin)):
        if values[index] >= values[index - 1] and values[index] > values[index + 1]:
            maxima.append(index)
    return maxima


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--minimum-x", type=int, required=True)
    parser.add_argument("--maximum-x", type=int, required=True)
    parser.add_argument("--x-step", type=int, default=20)
    parser.add_argument("--minimum-y", type=int, required=True)
    parser.add_argument("--maximum-y", type=int, required=True)
    parser.add_argument("--horizontal-radius", type=int, default=8)
    parser.add_argument("--vertical-bin-radius", type=int, default=2)
    parser.add_argument("--smoothing-width", type=int, default=5)
    parser.add_argument("--peaks-per-column", type=int, default=3)
    parser.add_argument("--preview-png", type=Path)
    args = parser.parse_args()

    if args.minimum_x >= args.maximum_x or args.minimum_y >= args.maximum_y:
        raise ValueError("Invalid scan bounds")
    if args.x_step < 1 or args.horizontal_radius < 1 or args.vertical_bin_radius < 0:
        raise ValueError("Invalid scan neighborhood")
    if args.smoothing_width < 3 or args.smoothing_width % 2 == 0:
        raise ValueError("Smoothing width must be odd and at least three")
    if args.peaks_per_column < 1:
        raise ValueError("At least one peak per column is required")

    frame = cv2.imread(str(args.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode the raw official frame")
    height, width = frame.shape[:2]
    if not (
        0 <= args.minimum_x < args.maximum_x < width
        and 0 <= args.minimum_y < args.maximum_y < height
    ):
        raise ValueError("Scan bounds are outside the frame")

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    y_values = np.arange(args.minimum_y, args.maximum_y + 1)
    kernel = np.ones(args.smoothing_width, dtype=np.float64) / args.smoothing_width
    records: list[dict[str, Any]] = []

    for x_value in range(args.minimum_x, args.maximum_x + 1, args.x_step):
        medians: list[float] = []
        counts: list[int] = []
        for y_value in y_values:
            patch = hsv[
                max(0, y_value - args.vertical_bin_radius) : min(
                    height, y_value + args.vertical_bin_radius + 1
                ),
                max(0, x_value - args.horizontal_radius) : min(
                    width, x_value + args.horizontal_radius + 1
                ),
            ]
            blue = (
                (patch[:, :, 0] >= 95)
                & (patch[:, :, 0] <= 135)
                & (patch[:, :, 1] >= 55)
            )
            counts.append(int(np.sum(blue)))
            medians.append(float(np.median(patch[:, :, 2][blue])) if np.any(blue) else math.nan)

        signal = np.asarray(medians, dtype=np.float64)
        finite = np.isfinite(signal)
        if int(np.sum(finite)) < args.smoothing_width:
            records.append({"x": x_value, "status": "insufficient-blue-pixels", "peaks": []})
            continue
        indices = np.arange(len(signal))
        signal = np.interp(indices, indices[finite], signal[finite])
        smoothed = np.convolve(signal, kernel, mode="same")
        gradient = np.gradient(smoothed)
        peak_indices = local_maxima(gradient, args.smoothing_width)
        peak_indices.sort(key=lambda index: float(gradient[index]), reverse=True)
        peaks = [
            {
                "y": int(y_values[index]),
                "positiveGradient": float(gradient[index]),
                "smoothedBlueValue": float(smoothed[index]),
                "bluePixelCount": counts[index],
            }
            for index in peak_indices[: args.peaks_per_column]
        ]
        records.append({"x": x_value, "status": "scanned", "peaks": peaks})

    stable: dict[str, Any] = {
        "inputs": {
            "framePath": str(args.frame),
            "frameSha256": sha256_file(args.frame),
            "frameDecodedPixelsSha256": hashlib.sha256(frame.tobytes(order="C")).hexdigest(),
        },
        "parameters": {
            "blueHueInclusive": [95, 135],
            "minimumSaturation": 55,
            "xInclusive": [args.minimum_x, args.maximum_x],
            "xStepPixels": args.x_step,
            "yInclusive": [args.minimum_y, args.maximum_y],
            "horizontalRadiusPixels": args.horizontal_radius,
            "verticalBinRadiusPixels": args.vertical_bin_radius,
            "smoothingWidthPixels": args.smoothing_width,
            "peaksPerColumn": args.peaks_per_column,
        },
        "columns": records,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "raw-blue-seat-radiance-edge-discovery-v1",
        "artifactStage": "raw-pixel-discovery-only",
        "artifactVersion": artifact_version(stable),
        **stable,
        "eligibleForShadeBoundaryMeasurement": False,
        "publicationEligible": False,
        "note": "Discovery peaks must not be treated as reviewed shade-boundary labels.",
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")

    if args.preview_png:
        rendered = frame.copy()
        colors = [(30, 30, 255), (30, 220, 255), (255, 180, 30)]
        for record in records:
            for rank, peak in enumerate(record["peaks"]):
                cv2.drawMarker(
                    rendered,
                    (int(record["x"]), int(peak["y"])),
                    colors[min(rank, len(colors) - 1)],
                    cv2.MARKER_CROSS,
                    9,
                    1,
                    cv2.LINE_AA,
                )
        args.preview_png.parent.mkdir(parents=True, exist_ok=True)
        if not cv2.imwrite(str(args.preview_png), rendered):
            raise ValueError("Could not write preview image")

    print(json.dumps({"output": str(args.output_json), "columns": records}, indent=2))


if __name__ == "__main__":
    main()

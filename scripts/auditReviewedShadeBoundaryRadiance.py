#!/usr/bin/env python3
"""Audit reviewed shade pixels against raw blue-seat luminance gradients."""

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
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("reviewed_boundary_controls", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--horizontal-radius", type=int, default=8)
    parser.add_argument("--vertical-search-radius", type=int, default=18)
    parser.add_argument("--vertical-bin-radius", type=int, default=2)
    parser.add_argument("--smoothing-width", type=int, default=5)
    parser.add_argument("--maximum-peak-offset-pixels", type=float, default=6.0)
    arguments = parser.parse_args()
    if arguments.horizontal_radius < 1 or arguments.vertical_search_radius < 5:
        raise ValueError("Radiance audit neighborhoods are too small")
    if arguments.vertical_bin_radius < 0:
        raise ValueError("Vertical bin radius must be nonnegative")
    if arguments.smoothing_width < 3 or arguments.smoothing_width % 2 == 0:
        raise ValueError("Smoothing width must be odd and at least three")

    frame = cv2.imread(str(arguments.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode the raw official frame")
    frame_sha = sha256_file(arguments.frame)
    decoded_sha = hashlib.sha256(frame.tobytes(order="C")).hexdigest()
    controls_bytes = arguments.reviewed_boundary_controls.read_bytes()
    controls = json.loads(controls_bytes)
    expected = controls.get("inputs", {})
    if expected.get("broadcastFrameSha256") != frame_sha:
        raise ValueError("Reviewed controls reference a different frame checksum")
    if expected.get("broadcastFrameDecodedPixelsSha256") != decoded_sha:
        raise ValueError("Reviewed controls reference different decoded pixels")
    if controls.get("reviewStatus") != "independently-reviewed-shade-boundary-pixels":
        raise ValueError("Input is not independently reviewed boundary controls")

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    height, width = frame.shape[:2]
    records: list[dict[str, Any]] = []
    offsets: list[float] = []
    for sample in controls.get("samples", []):
        x_float, y_float = (float(value) for value in sample["broadcastPixel"])
        x_center = int(round(x_float))
        y_min = max(0, int(math.floor(y_float)) - arguments.vertical_search_radius)
        y_max = min(height - 1, int(math.ceil(y_float)) + arguments.vertical_search_radius)
        values: list[float] = []
        blue_counts: list[int] = []
        for y_value in range(y_min, y_max + 1):
            patch = hsv[
                max(0, y_value - arguments.vertical_bin_radius) : min(
                    height, y_value + arguments.vertical_bin_radius + 1
                ),
                max(0, x_center - arguments.horizontal_radius) : min(
                    width, x_center + arguments.horizontal_radius + 1
                ),
            ]
            blue = (
                (patch[:, :, 0] >= 95)
                & (patch[:, :, 0] <= 135)
                & (patch[:, :, 1] >= 55)
            )
            blue_counts.append(int(np.sum(blue)))
            values.append(float(np.median(patch[:, :, 2][blue])) if np.any(blue) else math.nan)
        signal = np.asarray(values, dtype=np.float64)
        finite = np.isfinite(signal)
        if np.sum(finite) < 3:
            raise ValueError(f"Sample {sample['id']} has too few blue-seat pixels")
        indices = np.arange(len(signal))
        signal = np.interp(indices, indices[finite], signal[finite])
        kernel = np.ones(arguments.smoothing_width, dtype=np.float64) / arguments.smoothing_width
        smoothed = np.convolve(signal, kernel, mode="same")
        gradient = np.gradient(smoothed)
        margin = arguments.smoothing_width
        valid = np.arange(margin, len(gradient) - margin)
        if not len(valid):
            raise ValueError("Radiance search interval is too short after smoothing")
        peak_index = int(valid[np.argmax(gradient[valid])])
        peak_y = float(y_min + peak_index)
        offset = abs(peak_y - y_float)
        offsets.append(offset)
        records.append(
            {
                "sampleId": sample["id"],
                "reviewedPixel": [x_float, y_float],
                "peakPositiveBlueSeatGradientY": peak_y,
                "reviewedToPeakOffsetPixels": offset,
                "peakGradientValue": float(gradient[peak_index]),
                "bluePixelCountAtPeakBin": blue_counts[peak_index],
                "searchYInclusive": [y_min, y_max],
            }
        )

    blockers = []
    if not records:
        blockers.append("NO_REVIEWED_BOUNDARY_SAMPLES")
    if offsets and max(offsets) > arguments.maximum_peak_offset_pixels:
        blockers.append("REVIEWED_PIXEL_DIFFERS_FROM_LOCAL_BLUE_SEAT_GRADIENT")
    stable = {
        "inputs": {
            "framePath": str(arguments.frame),
            "frameSha256": frame_sha,
            "frameDecodedPixelsSha256": decoded_sha,
            "reviewedBoundaryControlsPath": str(arguments.reviewed_boundary_controls),
            "reviewedBoundaryControlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        },
        "parameters": {
            "blueHueInclusive": [95, 135],
            "minimumSaturation": 55,
            "horizontalRadiusPixels": arguments.horizontal_radius,
            "verticalSearchRadiusPixels": arguments.vertical_search_radius,
            "verticalBinRadiusPixels": arguments.vertical_bin_radius,
            "smoothingWidthPixels": arguments.smoothing_width,
            "maximumPeakOffsetPixels": arguments.maximum_peak_offset_pixels,
        },
        "samples": records,
        "validation": {
            "sampleCount": len(records),
            "medianPeakOffsetPixels": float(np.median(offsets)) if offsets else None,
            "maximumPeakOffsetPixels": max(offsets) if offsets else None,
            "eligibleAsRawRadianceCrossCheck": not blockers,
            "blockers": blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "raw-blue-seat-radiance-boundary-audit-v1",
        "artifactStage": "reviewed-shade-boundary-raw-radiance-cross-check",
        "artifactVersion": artifact_version(stable),
        **stable,
        "publicationEligible": False,
        "note": "This raw-image audit cross-checks reviewed pixels only. It does not predict a shadow boundary.",
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(arguments.output_json), **artifact["validation"]}, indent=2))


if __name__ == "__main__":
    main()

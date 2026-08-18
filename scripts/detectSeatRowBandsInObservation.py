#!/usr/bin/env python3
"""Detect green-seat row bands inside a reviewed observation strip.

This is a review aid. It uses the provider row count but does not establish
section identity or an accepted shadow-boundary label.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.signal import find_peaks


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--strip", type=int, nargs=4, required=True, metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"))
    parser.add_argument("--expected-rows", type=int, required=True)
    parser.add_argument("--minimum-peak-distance", type=int, default=4)
    parser.add_argument("--minimum-prominence", type=float, default=0.002)
    arguments = parser.parse_args()

    image = cv2.imread(str(arguments.image), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode the observation image")
    height, width = image.shape[:2]
    left, top, right, bottom = arguments.strip
    if not (0 <= left < right <= width and 0 <= top < bottom <= height):
        raise ValueError("Review strip is outside the image")
    if arguments.expected_rows < 2:
        raise ValueError("Expected row count must be at least two")

    strip = image[top:bottom, left:right]
    hsv = cv2.cvtColor(strip, cv2.COLOR_BGR2HSV)
    green_mask = (
        (hsv[:, :, 0] >= 25)
        & (hsv[:, :, 0] <= 105)
        & (hsv[:, :, 1] >= 35)
        & (hsv[:, :, 2] >= 20)
        & (hsv[:, :, 2] <= 245)
    )
    b, g, r = [channel.astype(np.float32) for channel in cv2.split(strip)]
    green_excess = np.maximum(0.0, g - np.maximum(r, b)) / 255.0
    raw_score = np.mean(green_mask.astype(np.float32), axis=1) + np.mean(green_excess, axis=1)
    smoothed = gaussian_filter1d(raw_score, sigma=1.0)
    peaks, properties = find_peaks(
        smoothed,
        distance=arguments.minimum_peak_distance,
        prominence=arguments.minimum_prominence,
    )
    candidates = sorted(
        [
            {
                "pixelY": int(top + peak),
                "stripPixelY": int(peak),
                "score": float(smoothed[peak]),
                "prominence": float(properties["prominences"][index]),
            }
            for index, peak in enumerate(peaks)
        ],
        key=lambda item: item["pixelY"],
    )

    output_png = arguments.output_json.with_suffix(".png")
    render = image.copy()
    cv2.rectangle(render, (left, top), (right - 1, bottom - 1), (255, 255, 255), 2)
    for index, candidate in enumerate(candidates, start=1):
        y_value = candidate["pixelY"]
        cv2.line(render, (left, y_value), (right - 1, y_value), (0, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(
            render,
            str(index),
            (right + 4 if right + 40 < width else left + 4, y_value + 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.4,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
    if not cv2.imwrite(str(output_png), render, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write the row-band review image")

    stable = {
        "analysisVersion": "green-seat-row-band-discovery-v1",
        "input": {
            "path": str(arguments.image.resolve()),
            "sha256": sha256_file(arguments.image),
        },
        "reviewStripPixels": list(arguments.strip),
        "expectedProviderRowCount": arguments.expected_rows,
        "parameters": {
            "minimumPeakDistancePixels": arguments.minimum_peak_distance,
            "minimumProminence": arguments.minimum_prominence,
            "gaussianSigmaPixels": 1.0,
            "greenHueRangeOpenCv": [25, 105],
            "minimumSaturation": 35,
        },
        "candidateBands": candidates,
        "output": {
            "path": str(output_png.resolve()),
            "sha256": sha256_file(output_png),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "observation-seat-row-band-review",
        "artifactVersion": artifact_version(stable),
        **stable,
        "summary": {
            "candidateBandCount": len(candidates),
            "expectedProviderRowCount": arguments.expected_rows,
            "candidateCountMatchesExpected": len(candidates) == arguments.expected_rows,
        },
        "publicationEligible": False,
        "blockers": [
            "COLOR_BAND_DETECTION_IS_NOT_ROW_IDENTITY",
            "SECTION_REGISTRATION_NOT_ESTABLISHED",
            "MANUAL_FULL_RESOLUTION_REVIEW_REQUIRED",
        ],
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "outputImage": str(output_png),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
    }, indent=2))


if __name__ == "__main__":
    main()

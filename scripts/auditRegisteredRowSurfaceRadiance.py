#!/usr/bin/env python3
"""Measure raw blue-seat radiance along registered broadcast row curves.

This audit is descriptive. It does not infer or approve a shadow boundary.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("registration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--minimum-x", type=int, required=True)
    parser.add_argument("--maximum-x", type=int, required=True)
    parser.add_argument("--vertical-radius", type=int, default=3)
    args = parser.parse_args()
    if args.minimum_x >= args.maximum_x or args.vertical_radius < 1:
        raise ValueError("Invalid sampling bounds")

    frame = cv2.imread(str(args.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode the official broadcast frame")
    frame_sha = sha256_file(args.frame)
    decoded_sha = hashlib.sha256(frame.tobytes(order="C")).hexdigest()
    registration_bytes = args.registration.read_bytes()
    registration = json.loads(registration_bytes)
    expected_frame = registration.get("inputs", {}).get("frame", {})
    if expected_frame.get("sha256") != frame_sha:
        raise ValueError("Registration references a different frame checksum")
    if not registration.get("registrationEligibleForManualShadeReview"):
        raise ValueError("Registration is not eligible for shade review")

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    height, width = frame.shape[:2]
    if args.minimum_x < 0 or args.maximum_x >= width:
        raise ValueError("Sampling bounds are outside the frame")

    records: list[dict[str, Any]] = []
    for row in reversed(registration["rows"]):
        points = np.asarray(row["projectedAnchorPixels"], dtype=np.float64)
        points = points[np.argsort(points[:, 0])]
        minimum_x = max(args.minimum_x, int(np.ceil(points[:, 0].min())))
        maximum_x = min(args.maximum_x, int(np.floor(points[:, 0].max())))
        if minimum_x > maximum_x:
            continue
        x_values = np.arange(minimum_x, maximum_x + 1)
        y_values = np.interp(x_values, points[:, 0], points[:, 1])
        values: list[int] = []
        for x_value, y_value in zip(x_values, y_values):
            y_center = int(round(float(y_value)))
            patch = hsv[
                max(0, y_center - args.vertical_radius) : min(
                    height, y_center + args.vertical_radius + 1
                ),
                int(x_value) : int(x_value) + 1,
            ]
            blue = (
                (patch[:, :, 0] >= 95)
                & (patch[:, :, 0] <= 135)
                & (patch[:, :, 1] >= 55)
            )
            values.extend(int(value) for value in patch[:, :, 2][blue])
        if not values:
            continue
        value_array = np.asarray(values, dtype=np.float64)
        records.append(
            {
                "rowId": row["rowId"],
                "sampleXInclusive": [minimum_x, maximum_x],
                "bluePixelCount": len(values),
                "blueValueMedian": float(np.median(value_array)),
                "blueValueP25": float(np.percentile(value_array, 25)),
                "blueValueP75": float(np.percentile(value_array, 75)),
            }
        )

    adjacent: list[dict[str, Any]] = []
    for earlier, later in zip(records[:-1], records[1:]):
        adjacent.append(
            {
                "fromRowId": earlier["rowId"],
                "toRowId": later["rowId"],
                "medianBlueValueChange": later["blueValueMedian"]
                - earlier["blueValueMedian"],
            }
        )

    stable: dict[str, Any] = {
        "inputs": {
            "framePath": str(args.frame),
            "frameSha256": frame_sha,
            "frameDecodedPixelsSha256": decoded_sha,
            "registrationPath": str(args.registration),
            "registrationSha256": hashlib.sha256(registration_bytes).hexdigest(),
            "registrationArtifactVersion": registration["artifactVersion"],
        },
        "parameters": {
            "blueHueInclusive": [95, 135],
            "minimumSaturation": 55,
            "sampleXInclusive": [args.minimum_x, args.maximum_x],
            "verticalRadiusPixels": args.vertical_radius,
        },
        "rowsBackToFront": records,
        "adjacentRowChangesBackToFront": adjacent,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "registered-blue-seat-row-surface-radiance-v1",
        "artifactStage": "raw-broadcast-row-surface-radiance-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "eligibleForShadeBoundaryMeasurement": False,
        "publicationEligible": False,
        "note": "Descriptive raw-pixel audit only. A reviewer must separately establish a localized, spatially continuous direct-sun boundary.",
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({"output": str(args.output_json), "rows": records, "adjacent": adjacent}, indent=2))


if __name__ == "__main__":
    main()

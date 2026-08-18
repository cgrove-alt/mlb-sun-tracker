#!/usr/bin/env python3
"""Compare smooth and discrete-step models of registered row radiance.

This audit is supporting evidence only. It does not create a reviewed boundary
label or make an artifact publication eligible.
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


def interpolate_y(points: np.ndarray, x_values: np.ndarray) -> np.ndarray:
    order = np.argsort(points[:, 0])
    return np.interp(x_values, points[order, 0], points[order, 1])


def fit_model(design: np.ndarray, values: np.ndarray) -> dict[str, Any]:
    coefficients, _, _, _ = np.linalg.lstsq(design, values, rcond=None)
    residuals = values - design @ coefficients
    rss = float(np.sum(residuals**2))
    n = len(values)
    k = design.shape[1]
    bic = n * math.log(max(rss / n, 1e-12)) + k * math.log(n)
    return {
        "coefficients": [float(value) for value in coefficients],
        "rss": rss,
        "rmse": float(math.sqrt(rss / n)),
        "bic": float(bic),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("registration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument(
        "--x-band", action="append", required=True,
        help="Inclusive horizontal range as minimum:maximum",
    )
    parser.add_argument("--vertical-radius", type=int, default=2)
    args = parser.parse_args()
    if args.vertical_radius < 1:
        raise ValueError("Vertical radius must be positive")

    frame = cv2.imread(str(args.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode the raw official frame")
    registration_bytes = args.registration.read_bytes()
    registration = json.loads(registration_bytes)
    if not registration.get("registrationEligibleForManualShadeReview"):
        raise ValueError("Registration is not eligible for shade review")
    if registration.get("inputs", {}).get("frame", {}).get("sha256") != sha256_file(args.frame):
        raise ValueError("Registration references a different frame checksum")

    width = frame.shape[1]
    bands: list[tuple[int, int]] = []
    for raw_band in args.x_band:
        parts = raw_band.split(":")
        if len(parts) != 2:
            raise ValueError("Each x band must be minimum:maximum")
        minimum, maximum = (int(value) for value in parts)
        if not 0 <= minimum < maximum < width:
            raise ValueError("An x band is outside the frame")
        bands.append((minimum, maximum))

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    height = frame.shape[0]
    rows = list(reversed(registration["rows"]))
    records: list[dict[str, Any]] = []
    for minimum, maximum in bands:
        row_values: list[float] = []
        row_ids: list[str] = []
        row_counts: list[int] = []
        for row in rows:
            points = np.asarray(row["projectedAnchorPixels"], dtype=np.float64)
            lower = max(minimum, int(math.ceil(float(np.min(points[:, 0])))))
            upper = min(maximum, int(math.floor(float(np.max(points[:, 0])))))
            if lower > upper:
                continue
            x_values = np.arange(lower, upper + 1)
            y_values = interpolate_y(points, x_values)
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
            if values:
                row_ids.append(str(row["rowId"]))
                row_counts.append(len(values))
                row_values.append(float(np.median(np.asarray(values, dtype=np.float64))))

        if len(row_values) < 6:
            raise ValueError("An x band has too few row radiance samples")
        values = np.log(np.asarray(row_values, dtype=np.float64))
        indices = np.arange(len(values), dtype=np.float64)
        baseline = fit_model(np.column_stack([np.ones(len(values)), indices]), values)
        alternatives: list[dict[str, Any]] = []
        for break_after in range(1, len(values) - 2):
            step = (indices > break_after).astype(np.float64)
            fitted = fit_model(
                np.column_stack([np.ones(len(values)), indices, step]), values
            )
            alternatives.append({
                "breakAfterRowId": row_ids[break_after],
                "breakBeforeRowId": row_ids[break_after + 1],
                "stepLogRadiance": fitted["coefficients"][2],
                "stepRadianceRatio": float(math.exp(fitted["coefficients"][2])),
                "bicImprovementOverSmoothTrend": baseline["bic"] - fitted["bic"],
                **fitted,
            })
        alternatives.sort(key=lambda item: item["bic"])
        records.append({
            "xInclusive": [minimum, maximum],
            "rowsBackToFront": [
                {"rowId": row_id, "blueValueMedian": value, "bluePixelCount": count}
                for row_id, value, count in zip(row_ids, row_values, row_counts)
            ],
            "smoothLogRadianceTrend": baseline,
            "bestStepModel": alternatives[0],
            "allStepModelsRankedByBic": alternatives,
        })

    stable: dict[str, Any] = {
        "inputs": {
            "framePath": str(args.frame),
            "frameSha256": sha256_file(args.frame),
            "frameDecodedPixelsSha256": hashlib.sha256(frame.tobytes(order="C")).hexdigest(),
            "registrationPath": str(args.registration),
            "registrationSha256": hashlib.sha256(registration_bytes).hexdigest(),
            "registrationArtifactVersion": registration["artifactVersion"],
        },
        "parameters": {
            "blueHueInclusive": [95, 135],
            "minimumSaturation": 55,
            "verticalRadiusPixels": args.vertical_radius,
            "radianceTransform": "natural-log",
            "smoothModel": "intercept plus linear row-index trend",
            "stepModel": "smooth model plus one fitted intercept step",
            "modelSelection": "lowest Bayesian information criterion",
        },
        "bands": records,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "registered-row-radiance-breakpoint-audit-v1",
        "artifactStage": "supporting-photometric-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "eligibleForShadeBoundaryMeasurement": False,
        "publicationEligible": False,
        "note": "Model comparison supports review but cannot establish direct sunlight or replace raw-pixel labels.",
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output_json),
        "bestStepModels": [record["bestStepModel"] for record in records],
    }, indent=2))


if __name__ == "__main__":
    main()

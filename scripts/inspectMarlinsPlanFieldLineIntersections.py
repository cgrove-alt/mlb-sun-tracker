#!/usr/bin/env python3
"""Build a review queue for convergent field and architectural plan lines."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "marlins-city-plan-line-intersection-review-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def line_intersection(first: np.ndarray, second: np.ndarray) -> np.ndarray | None:
    first_start = first[:2]
    first_direction = first[2:] - first[:2]
    second_start = second[:2]
    second_direction = second[2:] - second[:2]
    denominator = float(
        first_direction[0] * second_direction[1]
        - first_direction[1] * second_direction[0]
    )
    if abs(denominator) < 1e-8:
        return None
    offset = second_start - first_start
    numerator = float(
        offset[0] * second_direction[1]
        - offset[1] * second_direction[0]
    )
    parameter = numerator / denominator
    return first_start + parameter * first_direction


def segment_angle_degrees(line: np.ndarray) -> float:
    direction = line[2:] - line[:2]
    return math.degrees(math.atan2(float(direction[1]), float(direction[0]))) % 180.0


def angular_difference_degrees(first: float, second: float) -> float:
    difference = abs(first - second) % 180.0
    return min(difference, 180.0 - difference)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("plan", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_image", type=Path)
    parser.add_argument("--left", type=int, default=1350)
    parser.add_argument("--top", type=int, default=750)
    parser.add_argument("--right", type=int, default=2450)
    parser.add_argument("--bottom", type=int, default=1850)
    parser.add_argument("--bin-size", type=float, default=5.0)
    parser.add_argument("--minimum-angle-separation", type=float, default=8.0)
    arguments = parser.parse_args()
    if arguments.bin_size <= 0:
        raise ValueError("Bin size must be positive")

    source = cv2.imread(str(arguments.plan), cv2.IMREAD_COLOR)
    if source is None:
        raise ValueError("Could not read plan image")
    rotated = cv2.rotate(source, cv2.ROTATE_90_CLOCKWISE)
    height, width = rotated.shape[:2]
    if not (
        0 <= arguments.left < arguments.right <= width
        and 0 <= arguments.top < arguments.bottom <= height
    ):
        raise ValueError("Review crop is outside the rotated plan")
    crop = rotated[
        arguments.top : arguments.bottom,
        arguments.left : arguments.right,
    ]
    grayscale = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(grayscale, 80, 180, apertureSize=3, L2gradient=True)
    raw_lines = cv2.HoughLinesP(
        edges,
        1.0,
        math.pi / 1800.0,
        threshold=120,
        minLineLength=180,
        maxLineGap=30,
    )
    if raw_lines is None:
        raise ValueError("No plan lines were detected")

    lines = []
    for raw_line in raw_lines[:, 0, :]:
        line = raw_line.astype(float)
        line[[0, 2]] += arguments.left
        line[[1, 3]] += arguments.top
        length = float(np.linalg.norm(line[2:] - line[:2]))
        angle = segment_angle_degrees(line)
        lines.append({
            "line": line,
            "lengthPixels": length,
            "angleDegrees": angle,
        })
    lines.sort(key=lambda item: item["lengthPixels"], reverse=True)

    intersections = []
    bins: dict[tuple[int, int], list[dict[str, Any]]] = defaultdict(list)
    for first_index, first in enumerate(lines):
        for second_index in range(first_index + 1, len(lines)):
            second = lines[second_index]
            angle_separation = angular_difference_degrees(
                first["angleDegrees"],
                second["angleDegrees"],
            )
            if angle_separation < arguments.minimum_angle_separation:
                continue
            point = line_intersection(first["line"], second["line"])
            if point is None:
                continue
            if not (
                arguments.left <= point[0] <= arguments.right
                and arguments.top <= point[1] <= arguments.bottom
            ):
                continue
            record = {
                "point": [float(point[0]), float(point[1])],
                "firstLineIndex": first_index,
                "secondLineIndex": second_index,
                "angleSeparationDegrees": angle_separation,
                "minimumSegmentLengthPixels": min(
                    first["lengthPixels"],
                    second["lengthPixels"],
                ),
            }
            intersections.append(record)
            bin_key = (
                int(round(point[0] / arguments.bin_size)),
                int(round(point[1] / arguments.bin_size)),
            )
            bins[bin_key].append(record)

    ranked_bins = []
    for bin_key, records in bins.items():
        points = np.asarray([record["point"] for record in records])
        weights = np.asarray([
            record["minimumSegmentLengthPixels"]
            * math.sin(math.radians(record["angleSeparationDegrees"]))
            for record in records
        ])
        ranked_bins.append({
            "bin": list(bin_key),
            "intersectionCount": len(records),
            "weightedScore": float(weights.sum()),
            "meanPoint": [float(value) for value in np.average(points, axis=0, weights=weights)],
            "coordinateSpreadPixels": {
                "median": float(np.median(np.linalg.norm(points - np.mean(points, axis=0), axis=1))),
                "p95": float(np.percentile(np.linalg.norm(points - np.mean(points, axis=0), axis=1), 95)),
            },
        })
    ranked_bins.sort(
        key=lambda item: (item["weightedScore"], item["intersectionCount"]),
        reverse=True,
    )
    ranked_bins = ranked_bins[:50]

    review = rotated.copy()
    for line_record in lines[:120]:
        line = line_record["line"]
        cv2.line(
            review,
            (int(round(line[0])), int(round(line[1]))),
            (int(round(line[2])), int(round(line[3]))),
            (255, 180, 0),
            1,
            cv2.LINE_AA,
        )
    for rank, candidate in enumerate(ranked_bins[:15], start=1):
        point = candidate["meanPoint"]
        location = (int(round(point[0])), int(round(point[1])))
        cv2.drawMarker(
            review,
            location,
            (0, 0, 255),
            cv2.MARKER_CROSS,
            24,
            2,
            cv2.LINE_AA,
        )
        cv2.putText(
            review,
            str(rank),
            (location[0] + 8, location[1] - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 255),
            2,
            cv2.LINE_AA,
        )
    cv2.rectangle(
        review,
        (arguments.left, arguments.top),
        (arguments.right - 1, arguments.bottom - 1),
        (0, 180, 255),
        2,
    )
    arguments.output_image.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(arguments.output_image), review, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write review image")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "source": {
            "path": str(arguments.plan),
            "sha256": sha256_file(arguments.plan),
            "rotation": "90-degrees-clockwise",
        },
        "parameters": {
            "reviewCrop": [
                arguments.left,
                arguments.top,
                arguments.right,
                arguments.bottom,
            ],
            "cannyThresholds": [80, 180],
            "houghThetaDegrees": 0.1,
            "houghThreshold": 120,
            "minimumLineLengthPixels": 180,
            "maximumLineGapPixels": 30,
            "minimumAngleSeparationDegrees": arguments.minimum_angle_separation,
            "intersectionBinSizePixels": arguments.bin_size,
        },
        "counts": {
            "detectedLineCount": len(lines),
            "intersectionCount": len(intersections),
            "occupiedIntersectionBinCount": len(bins),
        },
        "rankedIntersectionCandidates": ranked_bins,
        "reviewImage": {
            "path": str(arguments.output_image),
            "sha256": sha256_file(arguments.output_image),
        },
        "geometryBoundary": {
            "automaticLineDiscoveryOnly": True,
            "semanticIdentityReviewed": False,
            "establishesHomePlateControl": False,
            "establishesMetricScale": False,
            "establishesMeasuredRowGeometry": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "LINE_INTERSECTION_SEMANTICS_NOT_REVIEWED",
                "PLAN_IS_HISTORICAL_DESIGN_DEVELOPMENT",
                "NO_METRIC_REGISTRATION_HOLDOUT",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-city-plan-line-intersection-review-queue",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "outputImage": str(arguments.output_image),
        "artifactVersion": artifact["artifactVersion"],
        "counts": artifact["counts"],
        "topCandidates": ranked_bins[:15],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

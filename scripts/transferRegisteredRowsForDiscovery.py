#!/usr/bin/env python3
"""Transfer registered row anchors between frames for review discovery only.

The output is deliberately ineligible for measurement or publication. Its only
purpose is to help a reviewer find the corresponding physical seating bank in a
new broadcast frame before creating independent row controls and holdouts.
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


def stable_artifact_hash(payload: dict[str, Any]) -> str:
    stable = dict(payload)
    stable.pop("artifactVersion", None)
    encoded = json.dumps(stable, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_rectangle(value: str) -> tuple[int, int, int, int]:
    parts = [int(part) for part in value.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("Rectangle must be left,top,right,bottom")
    left, top, right, bottom = parts
    if left < 0 or top < 0 or right <= left or bottom <= top:
        raise argparse.ArgumentTypeError("Rectangle bounds are invalid")
    return left, top, right, bottom


def rectangle_mask(
    shape: tuple[int, ...], rectangle: tuple[int, int, int, int]
) -> np.ndarray:
    height, width = shape[:2]
    left, top, right, bottom = rectangle
    if right > width or bottom > height:
        raise ValueError(f"Rectangle {rectangle} is outside {width}x{height} image")
    mask = np.zeros((height, width), dtype=np.uint8)
    mask[top:bottom, left:right] = 255
    return mask


def hull_fraction(points: np.ndarray, image: np.ndarray) -> float:
    if len(points) < 3:
        return 0.0
    area = float(cv2.contourArea(cv2.convexHull(points.astype(np.float32))))
    return area / float(image.shape[0] * image.shape[1])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-registration", type=Path, required=True)
    parser.add_argument("--target-frame", type=Path, required=True)
    parser.add_argument("--source-rectangle", type=parse_rectangle, required=True)
    parser.add_argument("--target-rectangle", type=parse_rectangle, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-preview", type=Path, required=True)
    parser.add_argument("--ratio-threshold", type=float, default=0.72)
    args = parser.parse_args()

    registration = json.loads(args.source_registration.read_text())
    source_path = Path(registration["inputs"]["frame"]["path"])
    source_expected_sha = registration["inputs"]["frame"]["sha256"]
    if sha256_file(source_path) != source_expected_sha:
        raise ValueError("Source frame checksum does not match the registration")

    source = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
    target = cv2.imread(str(args.target_frame), cv2.IMREAD_COLOR)
    if source is None or target is None:
        raise ValueError("Could not decode a source or target frame")

    source_gray = cv2.cvtColor(source, cv2.COLOR_BGR2GRAY)
    target_gray = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    detector = cv2.SIFT_create(
        nfeatures=12_000, contrastThreshold=0.005, edgeThreshold=20
    )
    source_keypoints, source_descriptors = detector.detectAndCompute(
        source_gray, rectangle_mask(source.shape, args.source_rectangle)
    )
    target_keypoints, target_descriptors = detector.detectAndCompute(
        target_gray, rectangle_mask(target.shape, args.target_rectangle)
    )
    if source_descriptors is None or target_descriptors is None:
        raise ValueError("Insufficient features in a review rectangle")

    pairs = cv2.BFMatcher(cv2.NORM_L2).knnMatch(
        source_descriptors, target_descriptors, k=2
    )
    matches = [
        first
        for first, second in pairs
        if first.distance < args.ratio_threshold * second.distance
    ]
    if len(matches) < 6:
        raise ValueError(f"Only {len(matches)} ratio-test feature matches")

    source_points = np.float32(
        [source_keypoints[match.queryIdx].pt for match in matches]
    )
    target_points = np.float32(
        [target_keypoints[match.trainIdx].pt for match in matches]
    )
    homography, inlier_mask = cv2.findHomography(
        source_points,
        target_points,
        cv2.USAC_MAGSAC,
        3.0,
        maxIters=20_000,
        confidence=0.999,
    )
    if homography is None or inlier_mask is None:
        raise ValueError("Could not estimate a geometric review homography")
    inlier_mask = inlier_mask.ravel().astype(bool)
    inlier_source = source_points[inlier_mask]
    inlier_target = target_points[inlier_mask]
    if len(inlier_source) < 6:
        raise ValueError(f"Only {len(inlier_source)} geometric inliers")

    reprojected = cv2.perspectiveTransform(
        inlier_source.reshape(-1, 1, 2), homography
    ).reshape(-1, 2)
    residuals = np.linalg.norm(reprojected - inlier_target, axis=1)

    transferred_rows: list[dict[str, Any]] = []
    preview = target.copy()
    palette = [(0, 255, 255), (0, 180, 255), (255, 255, 0), (0, 255, 0)]
    for index, row in enumerate(registration["rows"]):
        anchors = np.float32(row["projectedAnchorPixels"]).reshape(-1, 1, 2)
        transferred = cv2.perspectiveTransform(anchors, homography).reshape(-1, 2)
        points = [[float(point[0]), float(point[1])] for point in transferred]
        transferred_rows.append({"rowId": row["rowId"], "discoveryPixels": points})
        colour = palette[index % len(palette)]
        rounded = np.round(transferred).astype(np.int32)
        for first, second in zip(rounded[:-1], rounded[1:]):
            cv2.line(preview, tuple(first), tuple(second), colour, 1, cv2.LINE_AA)
        if len(rounded):
            cv2.putText(
                preview,
                str(row["rowId"]),
                tuple(rounded[len(rounded) // 2]),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.42,
                colour,
                1,
                cv2.LINE_AA,
            )

    cv2.rectangle(preview, (0, 0), (preview.shape[1], 28), (0, 0, 0), -1)
    cv2.putText(
        preview,
        "DISCOVERY ONLY: transferred rows require independent controls and holdouts",
        (8, 19),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.48,
        (255, 255, 255),
        1,
        cv2.LINE_AA,
    )
    args.output_preview.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_preview), preview):
        raise ValueError("Could not write discovery preview")

    payload: dict[str, Any] = {
        "schemaVersion": 1,
        "artifactKind": "broadcast-row-registration-discovery-transfer",
        "source": {
            "registrationPath": str(args.source_registration),
            "registrationSha256": sha256_file(args.source_registration),
            "framePath": str(source_path),
            "frameSha256": source_expected_sha,
            "reviewRectanglePixels": list(args.source_rectangle),
        },
        "target": {
            "framePath": str(args.target_frame),
            "frameSha256": sha256_file(args.target_frame),
            "reviewRectanglePixels": list(args.target_rectangle),
        },
        "featureMatching": {
            "detector": "SIFT",
            "ratioThreshold": args.ratio_threshold,
            "ratioTestMatchCount": len(matches),
            "geometricEstimator": "USAC_MAGSAC homography",
            "inlierThresholdPixels": 3.0,
            "inlierCount": int(inlier_mask.sum()),
            "sourceInlierHullFraction": hull_fraction(inlier_source, source),
            "targetInlierHullFraction": hull_fraction(inlier_target, target),
            "reprojectionErrorP95Pixels": float(np.percentile(residuals, 95)),
            "reprojectionErrorMaxPixels": float(residuals.max()),
            "reviewHomographySourceToTarget": homography.tolist(),
        },
        "rows": transferred_rows,
        "previewPng": str(args.output_preview),
        "previewPngSha256": sha256_file(args.output_preview),
        "eligibleForRowRegistration": False,
        "eligibleForShadeMeasurement": False,
        "publication": {
            "eligible": False,
            "blockers": [
                "Transferred pixels are feature-matching discovery aids, not reviewed row controls.",
                "The target frame requires independent training controls and disjoint row-identity holdouts.",
            ],
        },
    }
    payload["artifactVersion"] = stable_artifact_hash(payload)
    args.output_json.write_text(json.dumps(payload, indent=2) + "\n")
    print(json.dumps(payload["featureMatching"], indent=2))
    print(payload["artifactVersion"])


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Register current provider row anchors into one official broadcast frame.

The automated homography is a candidate registration only. It is accepted for
row-label review only when fixed-scene feature inliers span the seating bank and
the p95 reprojection residual is less than one half of the median projected row
spacing. It never labels shade by itself.
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
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def percentile(values: np.ndarray, fraction: float) -> float:
    return float(np.percentile(values, fraction * 100.0))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_identity", type=Path)
    parser.add_argument("broadcast_frame", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--ratio-test", type=float, default=0.72)
    parser.add_argument("--ransac-threshold-pixels", type=float, default=3.0)
    parser.add_argument("--minimum-inliers", type=int, default=18)
    arguments = parser.parse_args()

    identity_bytes = arguments.row_identity.read_bytes()
    identity = json.loads(identity_bytes)
    panorama_path = Path(identity["inputs"]["panoramaPath"])
    if sha256_file(panorama_path) != identity["inputs"]["panoramaSha256"]:
        raise ValueError("Panorama checksum changed")
    panorama = cv2.imread(str(panorama_path), cv2.IMREAD_COLOR)
    target = cv2.imread(str(arguments.broadcast_frame), cv2.IMREAD_COLOR)
    if panorama is None or target is None:
        raise ValueError("Could not decode an input image")

    crop = identity["projection"]["cropSourcePixels"]
    left = int(crop["left"])
    top = int(crop["top"])
    right = int(crop["right"])
    bottom = int(crop["bottom"])
    source = panorama[top:bottom, left:right]
    source_gray = cv2.cvtColor(source, cv2.COLOR_BGR2GRAY)
    target_gray = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    source_gray = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(source_gray)
    target_gray = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(target_gray)

    source_mask = np.zeros(source_gray.shape, dtype=np.uint8)
    source_mask[
        max(0, round(source.shape[0] * 0.20)) : min(source.shape[0], round(source.shape[0] * 0.67)),
        round(source.shape[1] * 0.04) : round(source.shape[1] * 0.96),
    ] = 255
    target_mask = np.zeros(target_gray.shape, dtype=np.uint8)
    target_mask[0 : min(target.shape[0], round(target.shape[0] * 0.37)), :] = 255
    target_mask[0 : round(target.shape[0] * 0.17), 0 : round(target.shape[1] * 0.29)] = 0
    target_mask[0 : round(target.shape[0] * 0.15), round(target.shape[1] * 0.89) :] = 0

    sift = cv2.SIFT_create(nfeatures=5000, contrastThreshold=0.01)
    source_keypoints, source_descriptors = sift.detectAndCompute(source_gray, source_mask)
    target_keypoints, target_descriptors = sift.detectAndCompute(target_gray, target_mask)
    if source_descriptors is None or target_descriptors is None:
        raise ValueError("Insufficient fixed-scene features")
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    pairs = matcher.knnMatch(source_descriptors, target_descriptors, k=2)
    good = [
        pair[0]
        for pair in pairs
        if len(pair) == 2 and pair[0].distance < arguments.ratio_test * pair[1].distance
    ]
    if len(good) < 8:
        raise ValueError("Too few cross-image feature correspondences")
    source_points = np.float32([source_keypoints[item.queryIdx].pt for item in good])
    target_points = np.float32([target_keypoints[item.trainIdx].pt for item in good])
    homography, status = cv2.findHomography(
        source_points,
        target_points,
        cv2.RANSAC,
        arguments.ransac_threshold_pixels,
    )
    if homography is None or status is None:
        raise ValueError("Homography estimation failed")
    inliers = status.ravel().astype(bool)
    projected_inliers = cv2.perspectiveTransform(
        source_points[inliers].reshape(-1, 1, 2), homography
    ).reshape(-1, 2)
    residuals = np.linalg.norm(projected_inliers - target_points[inliers], axis=1)
    target_hull = cv2.convexHull(target_points[inliers].reshape(-1, 1, 2))
    target_hull_fraction = float(cv2.contourArea(target_hull)) / float(
        target.shape[0] * target.shape[1]
    )

    projected_rows: list[dict[str, Any]] = []
    for row in identity["rows"]:
        local_points = np.float32(
            [
                [float(point[0]) - left, float(point[1]) - top]
                for point in row["panoramaPixels"]
            ]
        )
        broadcast_pixels = cv2.perspectiveTransform(
            local_points.reshape(-1, 1, 2), homography
        ).reshape(-1, 2)
        projected_rows.append(
            {
                "rowKey": row["rowKey"],
                "anchorSeatIds": row["anchorSeatIds"],
                "broadcastPixels": broadcast_pixels.tolist(),
            }
        )

    spacing_samples: list[float] = []
    by_key = {item["rowKey"]: item for item in projected_rows}
    numeric_rows_by_section: dict[str, list[int]] = {}
    for row_key in by_key:
        section, row_id = row_key.split(":", 1)
        try:
            row_number = int(row_id)
        except ValueError:
            continue
        numeric_rows_by_section.setdefault(section, []).append(row_number)
    for section, row_numbers in numeric_rows_by_section.items():
        represented = set(row_numbers)
        for row_number in sorted(represented):
            if row_number + 1 not in represented:
                continue
            current = np.asarray(by_key[f"{section}:{row_number}"]["broadcastPixels"])
            following = np.asarray(by_key[f"{section}:{row_number + 1}"]["broadcastPixels"])
            if current.shape != following.shape:
                continue
            spacing_samples.append(
                float(np.median(np.linalg.norm(following - current, axis=1)))
            )
    if not spacing_samples:
        raise ValueError("No adjacent numeric rows are available for spacing validation")
    median_row_spacing = float(np.median(spacing_samples))
    residual_p95 = percentile(residuals, 0.95) if residuals.size else math.inf
    registration_eligible = (
        int(np.sum(inliers)) >= arguments.minimum_inliers
        and target_hull_fraction >= 0.015
        and residual_p95 <= 0.5 * median_row_spacing
    )

    rendered = target.copy()
    palette = [
        (255, 255, 0),
        (255, 0, 255),
        (0, 255, 255),
        (0, 180, 255),
        (255, 120, 0),
    ]
    section_colors = {
        section: palette[index % len(palette)]
        for index, section in enumerate(sorted(numeric_rows_by_section))
    }
    for row in projected_rows:
        section, row_id = row["rowKey"].split(":", 1)
        points = np.rint(np.asarray(row["broadcastPixels"])).astype(np.int32)
        color = section_colors.get(section, (255, 255, 255))
        cv2.polylines(rendered, [points], False, color, 1, cv2.LINE_AA)
        represented_rows = numeric_rows_by_section.get(section, [])
        label_rows: set[str] = set()
        if represented_rows:
            minimum_row = min(represented_rows)
            maximum_row = max(represented_rows)
            label_rows = {
                str(value)
                for value in represented_rows
                if value == minimum_row
                or value == maximum_row
                or (value - minimum_row) % 4 == 0
            }
        if row_id in label_rows:
            label_point = tuple(int(value) for value in points[-1])
            cv2.putText(
                rendered,
                row["rowKey"],
                label_point,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.45,
                color,
                1,
                cv2.LINE_AA,
            )
    output_png = arguments.output_json.with_suffix(".png")
    if not cv2.imwrite(str(output_png), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write registration preview")

    stable = {
        "rowIdentitySha256": hashlib.sha256(identity_bytes).hexdigest(),
        "broadcastFrameSha256": sha256_file(arguments.broadcast_frame),
        "parameters": {
            "ratioTest": arguments.ratio_test,
            "ransacThresholdPixels": arguments.ransac_threshold_pixels,
            "minimumInliers": arguments.minimum_inliers,
        },
        "homographyPanoramaCropToBroadcast": homography.tolist(),
        "projectedRows": projected_rows,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "panorama-to-broadcast-fixed-scene-homography-v1",
        "artifactStage": "current-provider-row-to-official-broadcast-registration",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "rowIdentity": {
                "path": str(arguments.row_identity),
                "sha256": stable["rowIdentitySha256"],
            },
            "broadcastFrame": {
                "path": str(arguments.broadcast_frame),
                "sha256": stable["broadcastFrameSha256"],
            },
        },
        "parameters": stable["parameters"],
        "homographyPanoramaCropToBroadcast": stable[
            "homographyPanoramaCropToBroadcast"
        ],
        "validation": {
            "ratioMatchCount": len(good),
            "inlierCount": int(np.sum(inliers)),
            "inlierRatio": float(np.mean(inliers)),
            "targetInlierHullFraction": target_hull_fraction,
            "reprojectionResidualMedianPixels": float(np.median(residuals)),
            "reprojectionResidualP95Pixels": residual_p95,
            "medianProjectedRowSpacingPixels": median_row_spacing,
            "residualP95AsRowFraction": residual_p95 / median_row_spacing,
        },
        "projectedRows": projected_rows,
        "previewPng": str(output_png),
        "previewPngSha256": sha256_file(output_png),
        "registrationEligibleForManualRowReview": registration_eligible,
        "publicationEligible": False,
        "blockers": [
            "SHADE_BOUNDARIES_NOT_MANUALLY_LABELED",
            "HOMOGRAPHY_ASSUMES_LOCALLY_PLANAR_SEATING_BANK",
            "INDEPENDENT_CONTROL_POINTS_NOT_YET_HELD_OUT",
        ],
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "validation": artifact["validation"],
                "registrationEligibleForManualRowReview": registration_eligible,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

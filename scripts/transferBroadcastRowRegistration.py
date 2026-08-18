#!/usr/bin/env python3
"""Transfer a validated broadcast row registration to another broadcast frame.

Feature matching excludes the registered aisle. The target frame is warped back
to the source camera, and aisle risers are then measured as an independent image
holdout before transferred row curves can be used for manual shade review.
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
from scipy.signal import find_peaks


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def transform_points(points: np.ndarray, homography: np.ndarray) -> np.ndarray:
    return cv2.perspectiveTransform(
        points.reshape(-1, 1, 2).astype(np.float32), homography
    ).reshape(-1, 2)


def feature_mask(height: int, width: int, excluded_x: tuple[int, int]) -> np.ndarray:
    mask = np.zeros((height, width), dtype=np.uint8)
    mask[0:round(height * 0.42), round(width * 0.02):round(width * 0.98)] = 255
    mask[0:round(height * 0.22), 0:round(width * 0.32)] = 0
    mask[0:round(height * 0.18), round(width * 0.88):width] = 0
    left, right = excluded_x
    mask[0:round(height * 0.42), max(0, left):min(width, right)] = 0
    return mask


def detect_risers(
    grayscale: np.ndarray,
    x_minimum: int,
    x_maximum: int,
    y_minimum: int,
    y_maximum: int,
    minimum_gradient: float,
    minimum_prominence: float,
    minimum_distance: int,
) -> tuple[np.ndarray, list[dict[str, float]]]:
    signal = np.median(grayscale[y_minimum:y_maximum, x_minimum:x_maximum], axis=1)
    smoothed = np.convolve(signal, np.ones(3, dtype=np.float64) / 3.0, mode="same")
    negative_gradient = -np.gradient(smoothed)
    peaks, properties = find_peaks(
        negative_gradient,
        height=minimum_gradient,
        prominence=minimum_prominence,
        distance=minimum_distance,
    )
    absolute = peaks + y_minimum
    diagnostics = [{
        "yPixel": int(value),
        "negativeGradient": float(properties["peak_heights"][index]),
        "prominence": float(properties["prominences"][index]),
    } for index, value in enumerate(absolute)]
    return absolute.astype(np.float64), diagnostics


def match_expected(
    expected: np.ndarray, candidates: np.ndarray, maximum_distance: float
) -> np.ndarray:
    available = list(range(candidates.size))
    matched = []
    for value in expected:
        eligible = [
            index for index in available
            if abs(float(candidates[index] - value)) <= maximum_distance
        ]
        if not eligible:
            matched.append(np.nan)
            continue
        choice = min(eligible, key=lambda index: abs(float(candidates[index] - value)))
        matched.append(float(candidates[choice]))
        available.remove(choice)
    return np.asarray(matched, dtype=np.float64)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_registration", type=Path)
    parser.add_argument("target_frame", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--ratio-test", type=float, default=0.70)
    parser.add_argument("--minimum-inliers", type=int, default=25)
    parser.add_argument("--minimum-inlier-ratio", type=float, default=0.35)
    parser.add_argument("--minimum-inlier-hull-fraction", type=float, default=0.025)
    parser.add_argument("--maximum-reprojection-p95-pixels", type=float, default=3.0)
    parser.add_argument("--minimum-gradient", type=float, default=2.5)
    parser.add_argument("--minimum-prominence", type=float, default=2.5)
    parser.add_argument("--minimum-distance-pixels", type=int, default=12)
    parser.add_argument("--maximum-riser-match-pixels", type=float, default=7.0)
    arguments = parser.parse_args()
    if arguments.minimum_inliers < 8:
        raise ValueError("Minimum inliers must be at least eight")
    if not 0 < arguments.ratio_test < 1:
        raise ValueError("Invalid feature ratio test")

    registration_bytes = arguments.source_registration.read_bytes()
    source_registration = json.loads(registration_bytes)
    if source_registration.get("artifactKind") != "official-broadcast-alternating-riser-row-registration":
        raise ValueError("Source is not an alternating-riser broadcast registration")
    if not source_registration.get("registrationEligibleForManualShadeReview"):
        raise ValueError("Source registration did not pass its image holdout")
    source_frame_path = Path(source_registration["inputs"]["frame"]["path"])
    if sha256_file(source_frame_path) != source_registration["inputs"]["frame"]["sha256"]:
        raise ValueError("Source broadcast frame checksum changed")
    source = cv2.imread(str(source_frame_path), cv2.IMREAD_COLOR)
    target = cv2.imread(str(arguments.target_frame), cv2.IMREAD_COLOR)
    if source is None or target is None:
        raise ValueError("Could not decode a broadcast frame")
    if source.shape != target.shape:
        raise ValueError("Source and target broadcast dimensions differ")
    height, width = source.shape[:2]

    strips = source_registration["parameters"]["strips"]
    excluded_left = min(value["xMinimum"] for value in strips.values()) - 45
    excluded_right = max(value["xMaximum"] for value in strips.values()) + 45
    mask = feature_mask(height, width, (excluded_left, excluded_right))
    sift = cv2.SIFT_create(nfeatures=2400, contrastThreshold=0.018)
    source_gray = cv2.cvtColor(source, cv2.COLOR_BGR2GRAY)
    target_gray = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    source_keypoints, source_descriptors = sift.detectAndCompute(source_gray, mask)
    target_keypoints, target_descriptors = sift.detectAndCompute(target_gray, mask)
    if source_descriptors is None or target_descriptors is None:
        raise ValueError("A broadcast frame has no usable fixed-background features")
    pairs = cv2.BFMatcher(cv2.NORM_L2).knnMatch(
        source_descriptors, target_descriptors, k=2
    )
    good = [
        pair[0]
        for pair in pairs
        if len(pair) == 2 and pair[0].distance < arguments.ratio_test * pair[1].distance
    ]
    if len(good) < 8:
        raise ValueError("Broadcast frames have fewer than eight ratio matches")
    source_points = np.float32([source_keypoints[item.queryIdx].pt for item in good])
    target_points = np.float32([target_keypoints[item.trainIdx].pt for item in good])
    homography, status = cv2.findHomography(source_points, target_points, cv2.RANSAC, 2.5)
    if homography is None or status is None:
        raise ValueError("Could not solve the broadcast-to-broadcast homography")
    inliers = status.ravel().astype(bool)
    inlier_count = int(np.sum(inliers))
    inlier_ratio = inlier_count / len(good)
    source_hull = hull_fraction(source_points[inliers], width, height)
    target_hull = hull_fraction(target_points[inliers], width, height)
    inlier_hull = min(source_hull, target_hull)
    projected_inliers = transform_points(source_points[inliers], homography)
    reprojection = np.linalg.norm(projected_inliers - target_points[inliers], axis=1)
    reprojection_p95 = float(np.percentile(reprojection, 95))
    corner_source = np.asarray([
        [0.0, 0.0], [width - 1.0, 0.0],
        [width - 1.0, height - 1.0], [0.0, height - 1.0],
    ])
    corner_target = transform_points(corner_source, homography)
    corner_area = float(abs(cv2.contourArea(corner_target.astype(np.float32))))
    frame_area_ratio = corner_area / float(width * height)
    homography_eligible = bool(
        inlier_count >= arguments.minimum_inliers
        and inlier_ratio >= arguments.minimum_inlier_ratio
        and inlier_hull >= arguments.minimum_inlier_hull_fraction
        and reprojection_p95 <= arguments.maximum_reprojection_p95_pixels
        and 0.55 <= frame_area_ratio <= 1.75
    )

    inverse = np.linalg.inv(homography)
    warped_target = cv2.warpPerspective(
        target, inverse, (width, height), flags=cv2.INTER_LINEAR
    )
    warped_gray = cv2.cvtColor(warped_target, cv2.COLOR_BGR2GRAY).astype(np.float64)
    y_minimum = int(source_registration["parameters"]["yMinimum"])
    y_maximum = int(source_registration["parameters"]["yMaximum"])
    expected = np.asarray(
        source_registration["registration"]["primaryControlPixelsAscendingY"],
        dtype=np.float64,
    )
    detected_by_strip: dict[str, list[dict[str, float]]] = {}
    matched_by_strip: dict[str, np.ndarray] = {}
    for name, strip in strips.items():
        candidates, diagnostics = detect_risers(
            warped_gray,
            int(strip["xMinimum"]),
            int(strip["xMaximum"]),
            y_minimum,
            y_maximum,
            arguments.minimum_gradient,
            arguments.minimum_prominence,
            arguments.minimum_distance_pixels,
        )
        detected_by_strip[name] = diagnostics
        matched_by_strip[name] = match_expected(
            expected, candidates, arguments.maximum_riser_match_pixels
        )
    finite_counts = {
        name: int(np.count_nonzero(np.isfinite(values)))
        for name, values in matched_by_strip.items()
    }
    residuals = np.concatenate([
        np.abs(values[np.isfinite(values)] - expected[np.isfinite(values)])
        for values in matched_by_strip.values()
    ])
    spacing = np.abs(np.diff(np.asarray([
        row["primaryYPixel"] for row in source_registration["registration"]["rows"]
    ], dtype=np.float64)))
    median_spacing = float(np.median(spacing))
    residual_p95 = float(np.percentile(residuals, 95)) if residuals.size else math.inf
    residual_rows = residual_p95 / median_spacing
    riser_holdout_eligible = bool(
        finite_counts.get("primary", 0) == len(expected)
        and finite_counts.get("leftHoldout", 0) >= 6
        and finite_counts.get("rightHoldout", 0) >= 6
        and residual_rows <= 0.5
    )

    transferred_rows = []
    rendered = target.copy()
    colors = {"detected-control": (0, 220, 255), "shape-preserving-interpolation": (255, 180, 0)}
    for row in source_registration["registration"]["rows"]:
        source_curve = np.asarray(row["renderedCurvePixels"], dtype=np.float64)
        target_curve = transform_points(source_curve, homography)
        transferred_rows.append({
            "rowId": row["rowId"],
            "registrationKind": row["registrationKind"],
            "sourceCurvePixels": source_curve.tolist(),
            "targetCurvePixels": target_curve.astype(float).tolist(),
        })
        points = np.rint(target_curve).astype(np.int32)
        color = colors[row["registrationKind"]]
        cv2.polylines(rendered, [points], False, color, 1, cv2.LINE_AA)
        label_index = min(8, len(points) - 1)
        cv2.putText(
            rendered,
            str(row["rowId"]),
            tuple(int(value) for value in points[label_index]),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.40,
            color,
            1,
            cv2.LINE_AA,
        )
    preview_path = arguments.output_json.with_suffix(".png")
    warped_path = arguments.output_json.with_name(
        f"{arguments.output_json.stem}-warped-target.png"
    )
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(preview_path), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write transferred-row preview")
    if not cv2.imwrite(str(warped_path), warped_target, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write warped-target diagnostic")

    target_sha256 = sha256_file(arguments.target_frame)
    artifact_without_version = {
        "schemaVersion": 1,
        "artifactKind": "official-broadcast-row-registration-transfer",
        "stadiumId": source_registration["stadiumId"],
        "inputs": {
            "sourceRegistration": {
                "path": str(arguments.source_registration),
                "sha256": hashlib.sha256(registration_bytes).hexdigest(),
                "artifactVersion": source_registration["artifactVersion"],
            },
            "sourceFrame": {
                "path": str(source_frame_path),
                "sha256": source_registration["inputs"]["frame"]["sha256"],
            },
            "targetFrame": {"path": str(arguments.target_frame), "sha256": target_sha256},
        },
        "featureIndependence": {
            "sourceAisleExcludedFromHomography": True,
            "excludedSourceXRange": [excluded_left, excluded_right],
            "targetRisersMeasuredOnlyAfterHomographyFit": True,
            "interpretation": "Fixed-background feature controls and target-aisle image holdouts are disjoint.",
        },
        "homography": {
            "sourceToTarget": homography.tolist(),
            "ratioMatchCount": len(good),
            "inlierCount": inlier_count,
            "inlierRatio": inlier_ratio,
            "sourceInlierHullFraction": source_hull,
            "targetInlierHullFraction": target_hull,
            "minimumInlierHullFraction": inlier_hull,
            "reprojectionMedianPixels": float(np.median(reprojection)),
            "reprojectionP95Pixels": reprojection_p95,
            "projectedFrameAreaRatio": frame_area_ratio,
            "eligible": homography_eligible,
        },
        "targetRiserHoldout": {
            "expectedControlPixelsInSourceCamera": expected.astype(float).tolist(),
            "detectedCandidatesByStrip": detected_by_strip,
            "matchedPixelsByStrip": {
                name: [None if not np.isfinite(value) else float(value) for value in values]
                for name, values in matched_by_strip.items()
            },
            "finiteMatchCounts": finite_counts,
            "residualMedianPixels": float(np.median(residuals)) if residuals.size else None,
            "residualP95Pixels": residual_p95 if math.isfinite(residual_p95) else None,
            "medianAllRowSpacingPixels": median_spacing,
            "residualP95Rows": residual_rows if math.isfinite(residual_rows) else None,
            "thresholdRows": 0.5,
            "eligible": riser_holdout_eligible,
        },
        "registration": {
            "boundarySections": source_registration["identityBasis"]["boundarySections"],
            "rows": transferred_rows,
        },
        "previewPng": str(preview_path),
        "previewPngSha256": sha256_file(preview_path),
        "warpedTargetDiagnosticPng": str(warped_path),
        "warpedTargetDiagnosticPngSha256": sha256_file(warped_path),
        "registrationEligibleForManualShadeReview": bool(
            homography_eligible and riser_holdout_eligible
        ),
        "publication": {
            "eligible": False,
            "blockers": [
                "REGISTRATION_APPLIES_ONLY_TO_VISIBLE_LOCAL_ROW_BANK",
                "SHADE_BOUNDARY_NOT_YET_LABELED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "homography": artifact["homography"],
        "targetRiserHoldout": artifact["targetRiserHoldout"],
        "registrationEligibleForManualShadeReview": artifact["registrationEligibleForManualShadeReview"],
    }, indent=2))


if __name__ == "__main__":
    main()

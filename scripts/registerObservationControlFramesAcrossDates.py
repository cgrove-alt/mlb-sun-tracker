#!/usr/bin/env python3
"""Register reviewed static stadium-control frames across observation dates."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "cross-date-static-stadium-control-registration-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def target_argument(value: str) -> tuple[str, Path]:
    label, separator, path = value.partition(":")
    if not separator or not label or not path:
        raise argparse.ArgumentTypeError("Targets must use LABEL:PATH")
    return label, Path(path)


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("reference", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--target", type=target_argument, action="append", required=True)
    parser.add_argument("--reference-roi", type=int, nargs=4, required=True)
    parser.add_argument("--maximum-features", type=int, default=12000)
    parser.add_argument("--ratio-threshold", type=float, default=0.75)
    parser.add_argument("--ransac-threshold-pixels", type=float, default=2.0)
    parser.add_argument("--minimum-inliers", type=int, default=30)
    parser.add_argument("--minimum-inlier-hull-fraction", type=float, default=0.04)
    parser.add_argument("--maximum-reprojection-p95-pixels", type=float, default=2.0)
    arguments = parser.parse_args()

    cv2.setNumThreads(1)
    cv2.setRNGSeed(0)
    reference_color = cv2.imread(str(arguments.reference), cv2.IMREAD_COLOR)
    if reference_color is None:
        raise ValueError("Could not decode the reference frame")
    reference_gray = cv2.cvtColor(reference_color, cv2.COLOR_BGR2GRAY)
    height, width = reference_gray.shape
    left, top, right, bottom = arguments.reference_roi
    if not (0 <= left < right <= width and 0 <= top < bottom <= height):
        raise ValueError("Reference ROI is outside the frame")
    mask = np.zeros_like(reference_gray)
    mask[top:bottom, left:right] = 255
    sift = cv2.SIFT_create(
        nfeatures=arguments.maximum_features,
        contrastThreshold=0.015,
    )
    reference_keypoints, reference_descriptors = sift.detectAndCompute(reference_gray, mask)
    if reference_descriptors is None or len(reference_keypoints) < arguments.minimum_inliers:
        raise ValueError("Reference ROI has too few features")
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    arguments.output_directory.mkdir(parents=True, exist_ok=True)

    records = []
    for label, target_path in arguments.target:
        target_color = cv2.imread(str(target_path), cv2.IMREAD_COLOR)
        if target_color is None:
            raise ValueError(f"Could not decode target: {target_path}")
        target_gray = cv2.cvtColor(target_color, cv2.COLOR_BGR2GRAY)
        target_keypoints, target_descriptors = sift.detectAndCompute(target_gray, None)
        if target_descriptors is None:
            raise ValueError(f"Target has no features: {target_path}")
        pairs = matcher.knnMatch(target_descriptors, reference_descriptors, k=2)
        good = [
            first for first, second in pairs
            if first.distance < arguments.ratio_threshold * second.distance
        ]
        if len(good) < 4:
            raise ValueError(f"Target has fewer than four ratio-test matches: {label}")
        target_points = np.asarray(
            [target_keypoints[match.queryIdx].pt for match in good], dtype=np.float32
        )
        reference_points = np.asarray(
            [reference_keypoints[match.trainIdx].pt for match in good], dtype=np.float32
        )
        homography, inlier_mask = cv2.findHomography(
            target_points,
            reference_points,
            cv2.USAC_MAGSAC,
            arguments.ransac_threshold_pixels,
            maxIters=20000,
            confidence=0.999,
        )
        if homography is None or inlier_mask is None:
            raise ValueError(f"Homography was not solved: {label}")
        inliers = inlier_mask.ravel().astype(bool)
        inlier_count = int(np.count_nonzero(inliers))
        projected = cv2.perspectiveTransform(
            target_points.reshape(-1, 1, 2), homography
        ).reshape(-1, 2)
        residuals = np.linalg.norm(projected - reference_points, axis=1)
        reprojection_p95 = float(np.percentile(residuals[inliers], 95))
        reference_hull = hull_fraction(reference_points[inliers], width, height)
        target_hull = hull_fraction(
            target_points[inliers], target_gray.shape[1], target_gray.shape[0]
        )
        accepted = bool(
            inlier_count >= arguments.minimum_inliers
            and min(reference_hull, target_hull) >= arguments.minimum_inlier_hull_fraction
            and reprojection_p95 <= arguments.maximum_reprojection_p95_pixels
        )
        warped = cv2.warpPerspective(
            target_color,
            homography,
            (width, height),
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_CONSTANT,
        )
        output_path = arguments.output_directory / f"{label}-to-reference.png"
        if not cv2.imwrite(str(output_path), warped, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
            raise ValueError(f"Could not write target warp: {output_path}")
        records.append(
            {
                "label": label,
                "targetPath": str(target_path.resolve()),
                "targetSha256": sha256_file(target_path),
                "detectedFeatureCount": len(target_keypoints),
                "goodMatchCount": len(good),
                "geometricInlierCount": inlier_count,
                "referenceInlierHullFraction": reference_hull,
                "targetInlierHullFraction": target_hull,
                "reprojectionP95Pixels": reprojection_p95,
                "acceptedStaticControlRegistration": accepted,
                "homographyTargetToReference": homography.tolist(),
                "outputPath": str(output_path.resolve()),
                "outputSha256": sha256_file(output_path),
            }
        )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "reference": {
            "path": str(arguments.reference.resolve()),
            "sha256": sha256_file(arguments.reference),
            "width": width,
            "height": height,
            "featureRoi": list(arguments.reference_roi),
            "detectedFeatureCount": len(reference_keypoints),
        },
        "parameters": {
            "maximumFeatures": arguments.maximum_features,
            "contrastThreshold": 0.015,
            "ratioThreshold": arguments.ratio_threshold,
            "ransacThresholdPixels": arguments.ransac_threshold_pixels,
            "minimumInliers": arguments.minimum_inliers,
            "minimumInlierHullFraction": arguments.minimum_inlier_hull_fraction,
            "maximumReprojectionP95Pixels": arguments.maximum_reprojection_p95_pixels,
        },
        "registrations": records,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "cross-date-static-stadium-control-registration",
        "artifactVersion": artifact_version(stable),
        **stable,
        "summary": {
            "targetCount": len(records),
            "acceptedStaticControlRegistrationCount": sum(
                record["acceptedStaticControlRegistration"] for record in records
            ),
        },
        "publicationEligible": False,
        "blockers": [
            "STATIC_IMAGE_REGISTRATION_IS_NOT_ROW_IDENTITY",
            "REGISTERED_MEDIANS_MUST_NOT_LABEL_SHADE_BOUNDARIES",
            "RAW_LIVE_FRAMES_REMAIN_REQUIRED_FOR_EACH_OBSERVATION",
        ],
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "registrations": [
            {
                "label": record["label"],
                "goodMatchCount": record["goodMatchCount"],
                "geometricInlierCount": record["geometricInlierCount"],
                "minimumHullFraction": min(
                    record["referenceInlierHullFraction"], record["targetInlierHullFraction"]
                ),
                "reprojectionP95Pixels": record["reprojectionP95Pixels"],
                "accepted": record["acceptedStaticControlRegistration"],
            }
            for record in records
        ],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

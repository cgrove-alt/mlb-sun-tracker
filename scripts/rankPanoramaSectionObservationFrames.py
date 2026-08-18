#!/usr/bin/env python3
"""Rank observation thumbnails against a reviewed stadium-section reference crop."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "review-only-sift-section-frame-ranking-v2"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("reference_frame", type=Path)
    parser.add_argument("frame_index_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--left", type=int, required=True)
    parser.add_argument("--top", type=int, required=True)
    parser.add_argument("--right", type=int, required=True)
    parser.add_argument("--bottom", type=int, required=True)
    parser.add_argument("--maximum-features", type=int, default=1200)
    parser.add_argument("--ratio-threshold", type=float, default=0.72)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.maximum_features < 100:
        raise ValueError("Maximum features must be at least 100")
    if not 0.5 <= args.ratio_threshold < 1.0:
        raise ValueError("Ratio threshold must be in [0.5, 1.0)")
    cv2.setNumThreads(1)
    cv2.setRNGSeed(0)

    reference = cv2.imread(str(args.reference_frame), cv2.IMREAD_GRAYSCALE)
    if reference is None:
        raise ValueError("Could not decode the reference frame")
    height, width = reference.shape[:2]
    if not (
        0 <= args.left < args.right <= width
        and 0 <= args.top < args.bottom <= height
    ):
        raise ValueError("Reference crop is outside the frame")
    reference = reference[args.top:args.bottom, args.left:args.right]

    index = json.loads(args.frame_index_manifest.read_text())
    input_stage = index.get("artifactStage")
    if input_stage == "official-mlb-observation-frame-review-index":
        source_candidates = index["candidates"]
    elif input_stage == "official-mlb-condensed-game-frame-review-index":
        source_candidates = [
            {
                "candidateIndex": frame["sampleIndex"],
                "candidateId": f"condensed-sample-{frame['sampleIndex']:04d}",
                "eventMidpointTime": None,
                "eventWindowSeconds": None,
                "solarPosition": {
                    "altitudeDegrees": None,
                    "azimuthDegrees": None,
                },
                "frames": [
                    {
                        **frame,
                        "seconds": frame["condensedTimelineSeconds"],
                    }
                ],
            }
            for frame in index["frames"]
        ]
    else:
        raise ValueError("Input is not a supported official MLB frame index")
    sift = cv2.SIFT_create(
        nfeatures=args.maximum_features,
        contrastThreshold=0.02,
    )
    reference_keypoints, reference_descriptors = sift.detectAndCompute(reference, None)
    if reference_descriptors is None or len(reference_keypoints) < 20:
        raise ValueError("Reference crop has too few SIFT features")
    matcher = cv2.BFMatcher()

    candidates = []
    for candidate in source_candidates:
        best = None
        for frame in candidate["frames"]:
            thumbnail_path = Path(frame["thumbnailPath"])
            if sha256_file(thumbnail_path) != frame["thumbnailSha256"]:
                raise ValueError(f"Thumbnail hash mismatch: {thumbnail_path}")
            thumbnail = cv2.imread(str(thumbnail_path), cv2.IMREAD_GRAYSCALE)
            if thumbnail is None:
                raise ValueError(f"Could not decode thumbnail: {thumbnail_path}")
            keypoints, descriptors = sift.detectAndCompute(thumbnail, None)
            good_matches = []
            if descriptors is not None and len(descriptors) >= 2:
                for first, second in matcher.knnMatch(reference_descriptors, descriptors, k=2):
                    if first.distance < args.ratio_threshold * second.distance:
                        good_matches.append(first)
            geometric_inliers = 0
            source_inlier_hull_fraction = 0.0
            target_inlier_hull_fraction = 0.0
            reprojection_p95_pixels = None
            homography = None
            if len(good_matches) >= 4:
                source_points = np.float32(
                    [reference_keypoints[item.queryIdx].pt for item in good_matches]
                )
                target_points = np.float32(
                    [keypoints[item.trainIdx].pt for item in good_matches]
                )
                homography_array, inlier_mask = cv2.findHomography(
                    source_points,
                    target_points,
                    cv2.USAC_MAGSAC,
                    3.0,
                    maxIters=10000,
                    confidence=0.999,
                )
                if homography_array is not None and inlier_mask is not None:
                    selected = inlier_mask.reshape(-1).astype(bool)
                    geometric_inliers = int(np.sum(selected))
                    if geometric_inliers >= 4:
                        projected = cv2.perspectiveTransform(
                            source_points.reshape(-1, 1, 2), homography_array
                        ).reshape(-1, 2)
                        residuals = np.linalg.norm(projected - target_points, axis=1)
                        reprojection_p95_pixels = float(
                            np.percentile(residuals[selected], 95)
                        )
                        source_inlier_hull_fraction = hull_fraction(
                            source_points[selected],
                            reference.shape[1],
                            reference.shape[0],
                        )
                        target_inlier_hull_fraction = hull_fraction(
                            target_points[selected],
                            thumbnail.shape[1],
                            thumbnail.shape[0],
                        )
                        homography = homography_array.tolist()
            record = {
                "sampleIndex": frame["sampleIndex"],
                "frameIndex": frame["frameIndex"],
                "seconds": frame["seconds"],
                "thumbnailPath": str(thumbnail_path),
                "thumbnailSha256": frame["thumbnailSha256"],
                "goodMatchCount": len(good_matches),
                "detectedFeatureCount": len(keypoints),
                "geometricInlierCount": geometric_inliers,
                "sourceInlierHullFraction": source_inlier_hull_fraction,
                "targetInlierHullFraction": target_inlier_hull_fraction,
                "reprojectionP95Pixels": reprojection_p95_pixels,
                "reviewHomography": homography,
            }
            if best is None or (
                record["geometricInlierCount"],
                min(
                    record["sourceInlierHullFraction"],
                    record["targetInlierHullFraction"],
                ),
                record["goodMatchCount"],
                record["detectedFeatureCount"],
                -record["frameIndex"],
            ) > (
                best["geometricInlierCount"],
                min(
                    best["sourceInlierHullFraction"],
                    best["targetInlierHullFraction"],
                ),
                best["goodMatchCount"],
                best["detectedFeatureCount"],
                -best["frameIndex"],
            ):
                best = record
        if best is None:
            raise ValueError(f"Candidate {candidate['candidateIndex']} has no frames")
        candidates.append({
            "candidateIndex": candidate["candidateIndex"],
            "candidateId": candidate["candidateId"],
            "eventMidpointTime": candidate["eventMidpointTime"],
            "eventWindowSeconds": candidate["eventWindowSeconds"],
            "solarPosition": candidate["solarPosition"],
            "bestFrame": best,
        })

    candidates.sort(key=lambda item: (
        -item["bestFrame"]["geometricInlierCount"],
        -min(
            item["bestFrame"]["sourceInlierHullFraction"],
            item["bestFrame"]["targetInlierHullFraction"],
        ),
        -item["bestFrame"]["goodMatchCount"],
        item["candidateIndex"],
    ))
    stable = {
        "inputs": {
            "referenceFrame": {
                "path": str(args.reference_frame),
                "sha256": sha256_file(args.reference_frame),
            },
            "frameIndexManifest": {
                "path": str(args.frame_index_manifest),
                "sha256": sha256_file(args.frame_index_manifest),
                "artifactVersion": index.get("artifactVersion"),
                "artifactStage": input_stage,
            },
        },
        "referenceCropPixels": [args.left, args.top, args.right, args.bottom],
        "parameters": {
            "maximumFeatures": args.maximum_features,
            "contrastThreshold": 0.02,
            "ratioThreshold": args.ratio_threshold,
            "matcher": "SIFT descriptors with brute-force two-nearest-neighbor ratio test",
            "geometricVerification": "USAC MAGSAC homography with a 3 pixel threshold",
        },
        "rankedCandidates": candidates,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "review-only-stadium-section-frame-ranking",
        "artifactVersion": fingerprint(stable),
        **stable,
        "assessment": {
            "publicationEligible": False,
            "blockers": [
                "SIMILARITY_RANKING_IS_NOT_SECTION_IDENTIFICATION",
                "FULL_RESOLUTION_FRAME_REVIEW_REQUIRED",
                "GEOMETRIC_MATCHES_ARE_DISCOVERY_SIGNALS_ONLY",
                "SHADE_BOUNDARY_NOT_LABELED",
                *(
                    ["CONDENSED_TIMELINE_IS_NOT_AN_EVENT_TIMESTAMP"]
                    if input_stage == "official-mlb-condensed-game-frame-review-index"
                    else []
                ),
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(candidates),
        "topCandidates": [
            {
                "candidateIndex": item["candidateIndex"],
                "goodMatchCount": item["bestFrame"]["goodMatchCount"],
                "geometricInlierCount": item["bestFrame"]["geometricInlierCount"],
                "eventMidpointTime": item["eventMidpointTime"],
                "solarAltitudeDegrees": item["solarPosition"]["altitudeDegrees"],
            }
            for item in candidates[:15]
        ],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

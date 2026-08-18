#!/usr/bin/env python3
"""Build a checksum-tracked frame stack for registration-control review.

The registered median is a discovery aid for static venue structure. It must
not be used to label a shade boundary. Shade labels must come from a raw,
confirmed-live frame whose checksum is recorded independently.
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


def percentile_summary(values: np.ndarray) -> dict[str, float | int | None]:
    if not len(values):
        return {"count": 0, "median": None, "p95": None, "maximum": None}
    return {
        "count": int(len(values)),
        "median": float(np.median(values)),
        "p95": float(np.percentile(values, 95)),
        "maximum": float(np.max(values)),
    }


def hull_fraction(points: np.ndarray, roi: tuple[int, int, int, int]) -> float:
    if len(points) < 3:
        return 0.0
    x1, y1, x2, y2 = roi
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float((x2 - x1) * (y2 - y1))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_video", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--target-seconds", type=float, required=True)
    parser.add_argument("--start-seconds", type=float, required=True)
    parser.add_argument("--end-seconds", type=float, required=True)
    parser.add_argument("--step-seconds", type=float, default=0.05)
    parser.add_argument("--feature-roi", type=int, nargs=4, metavar=("X1", "Y1", "X2", "Y2"))
    parser.add_argument("--ratio-test", type=float, default=0.72)
    parser.add_argument("--ransac-threshold-pixels", type=float, default=1.5)
    parser.add_argument("--minimum-inliers", type=int, default=80)
    parser.add_argument("--minimum-inlier-ratio", type=float, default=0.5)
    parser.add_argument("--minimum-target-hull-fraction", type=float, default=0.08)
    parser.add_argument("--maximum-reprojection-p95-pixels", type=float, default=1.5)
    arguments = parser.parse_args()

    if arguments.step_seconds <= 0:
        raise ValueError("Step seconds must be positive")
    if arguments.start_seconds > arguments.end_seconds:
        raise ValueError("Start seconds must not exceed end seconds")

    capture = cv2.VideoCapture(str(arguments.input_video))
    if not capture.isOpened():
        raise ValueError(f"Could not open {arguments.input_video}")
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    frame_count = int(round(capture.get(cv2.CAP_PROP_FRAME_COUNT)))
    width = int(round(capture.get(cv2.CAP_PROP_FRAME_WIDTH)))
    height = int(round(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    if not math.isfinite(fps) or fps <= 0 or frame_count <= 0:
        raise ValueError("Video metadata is invalid")
    duration = frame_count / fps
    requested_seconds = np.arange(
        arguments.start_seconds,
        arguments.end_seconds + arguments.step_seconds * 0.25,
        arguments.step_seconds,
    )
    requested_seconds = np.append(requested_seconds, arguments.target_seconds)
    requested_indices = sorted(
        {
            max(0, min(frame_count - 1, int(round(float(value) * fps))))
            for value in requested_seconds
            if 0 <= value < duration
        }
    )
    target_index = max(
        0,
        min(frame_count - 1, int(round(arguments.target_seconds * fps))),
    )
    if target_index not in requested_indices:
        raise ValueError("Target frame is outside the requested video interval")

    selected_frames: dict[int, np.ndarray] = {}
    requested_set = set(requested_indices)
    index = 0
    while index <= requested_indices[-1]:
        ok, frame = capture.read()
        if not ok or frame is None:
            raise ValueError(f"Could not decode video frame {index}")
        if index in requested_set:
            selected_frames[index] = frame
        index += 1
    capture.release()
    if len(selected_frames) != len(requested_indices):
        raise ValueError("Not all requested frames were decoded")

    roi = tuple(arguments.feature_roi or (0, 0, width, height))
    x1, y1, x2, y2 = roi
    if not (0 <= x1 < x2 <= width and 0 <= y1 < y2 <= height):
        raise ValueError("Feature ROI is outside the video frame")
    feature_mask = np.zeros((height, width), dtype=np.uint8)
    feature_mask[y1:y2, x1:x2] = 255

    target = selected_frames[target_index]
    target_gray = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    sift = cv2.SIFT_create(nfeatures=20000)
    target_keypoints, target_descriptors = sift.detectAndCompute(target_gray, feature_mask)
    if target_descriptors is None or len(target_keypoints) < arguments.minimum_inliers:
        raise ValueError("Target frame has too few registration features")
    matcher = cv2.BFMatcher(cv2.NORM_L2)

    accepted_warps: list[np.ndarray] = []
    accepted_masks: list[np.ndarray] = []
    frame_records: list[dict[str, Any]] = []
    for frame_index in requested_indices:
        frame = selected_frames[frame_index]
        actual_seconds = frame_index / fps
        if frame_index == target_index:
            homography = np.eye(3, dtype=np.float64)
            inlier_count = len(target_keypoints)
            inlier_ratio = 1.0
            target_hull = hull_fraction(
                np.asarray([point.pt for point in target_keypoints], dtype=np.float32),
                roi,
            )
            reprojection = np.zeros(len(target_keypoints), dtype=np.float64)
            good_match_count = len(target_keypoints)
        else:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            keypoints, descriptors = sift.detectAndCompute(gray, feature_mask)
            if descriptors is None:
                frame_records.append(
                    {
                        "frameIndex": frame_index,
                        "actualSeconds": actual_seconds,
                        "accepted": False,
                        "rejectionReason": "NO_DESCRIPTORS",
                    }
                )
                continue
            pairs = matcher.knnMatch(descriptors, target_descriptors, k=2)
            good = [
                first
                for first, second in pairs
                if first.distance < arguments.ratio_test * second.distance
            ]
            good_match_count = len(good)
            if good_match_count < 4:
                frame_records.append(
                    {
                        "frameIndex": frame_index,
                        "actualSeconds": actual_seconds,
                        "accepted": False,
                        "goodMatchCount": good_match_count,
                        "rejectionReason": "TOO_FEW_MATCHES",
                    }
                )
                continue
            source_points = np.asarray(
                [keypoints[item.queryIdx].pt for item in good], dtype=np.float32
            )
            target_points = np.asarray(
                [target_keypoints[item.trainIdx].pt for item in good], dtype=np.float32
            )
            homography, inlier_mask = cv2.findHomography(
                source_points,
                target_points,
                cv2.RANSAC,
                arguments.ransac_threshold_pixels,
            )
            if homography is None or inlier_mask is None or not np.all(np.isfinite(homography)):
                frame_records.append(
                    {
                        "frameIndex": frame_index,
                        "actualSeconds": actual_seconds,
                        "accepted": False,
                        "goodMatchCount": good_match_count,
                        "rejectionReason": "HOMOGRAPHY_NOT_SOLVED",
                    }
                )
                continue
            inliers = inlier_mask.ravel().astype(bool)
            inlier_count = int(np.sum(inliers))
            inlier_ratio = inlier_count / good_match_count
            projected = cv2.perspectiveTransform(
                source_points[inliers].reshape(-1, 1, 2), homography
            ).reshape(-1, 2)
            reprojection = np.linalg.norm(projected - target_points[inliers], axis=1)
            target_hull = hull_fraction(target_points[inliers], roi)

        reprojection_summary = percentile_summary(reprojection)
        accepted = bool(
            inlier_count >= arguments.minimum_inliers
            and inlier_ratio >= arguments.minimum_inlier_ratio
            and target_hull >= arguments.minimum_target_hull_fraction
            and float(reprojection_summary["p95"])
            <= arguments.maximum_reprojection_p95_pixels
        )
        rejection_reasons = [
            *(["TOO_FEW_INLIERS"] if inlier_count < arguments.minimum_inliers else []),
            *(
                ["INLIER_RATIO_TOO_LOW"]
                if inlier_ratio < arguments.minimum_inlier_ratio
                else []
            ),
            *(
                ["TARGET_HULL_TOO_SMALL"]
                if target_hull < arguments.minimum_target_hull_fraction
                else []
            ),
            *(
                ["REPROJECTION_P95_TOO_HIGH"]
                if float(reprojection_summary["p95"])
                > arguments.maximum_reprojection_p95_pixels
                else []
            ),
        ]
        frame_records.append(
            {
                "frameIndex": frame_index,
                "actualSeconds": actual_seconds,
                "accepted": accepted,
                "goodMatchCount": good_match_count,
                "inlierCount": inlier_count,
                "inlierRatio": inlier_ratio,
                "targetInlierHullFractionOfFeatureRoi": target_hull,
                "reprojectionResidualPixels": reprojection_summary,
                "homographySourceToTarget": homography.tolist(),
                **({"rejectionReasons": rejection_reasons} if rejection_reasons else {}),
            }
        )
        if not accepted:
            continue
        warped = cv2.warpPerspective(
            frame,
            homography,
            (width, height),
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(0, 0, 0),
        )
        source_mask = np.full((height, width), 255, dtype=np.uint8)
        warped_mask = cv2.warpPerspective(
            source_mask,
            homography,
            (width, height),
            flags=cv2.INTER_NEAREST,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=0,
        )
        accepted_warps.append(warped)
        accepted_masks.append(warped_mask)

    if len(accepted_warps) < 3:
        raise ValueError("Fewer than three frames passed registration gates")
    stack = np.stack(accepted_warps).astype(np.float32)
    masks = np.stack(accepted_masks).astype(bool)
    stack[~masks[..., None].repeat(3, axis=3)] = np.nan
    with np.errstate(invalid="ignore"):
        registered_median = np.nanmedian(stack, axis=0)
    invalid = ~np.all(np.isfinite(registered_median), axis=2)
    registered_median[invalid] = target[invalid]
    registered_median = np.clip(np.rint(registered_median), 0, 255).astype(np.uint8)
    coverage_count = np.sum(masks, axis=0)

    output_png = arguments.output_json.with_suffix(".png")
    target_png = arguments.output_json.with_name(arguments.output_json.stem + "-raw-target.png")
    coverage_png = arguments.output_json.with_name(arguments.output_json.stem + "-coverage.png")
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    coverage_render = np.rint(
        coverage_count / len(accepted_warps) * 255.0
    ).astype(np.uint8)
    if not cv2.imwrite(str(output_png), registered_median, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write registered median")
    if not cv2.imwrite(str(target_png), target, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write raw target frame")
    if not cv2.imwrite(str(coverage_png), coverage_render, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write stack coverage")

    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "checksum-tracked-local-homography-median-v1",
        "artifactStage": "registered-video-evidence-stack-for-control-review",
        "inputs": {
            "videoPath": str(arguments.input_video.resolve()),
            "videoSha256": sha256_file(arguments.input_video),
            "sourceUrl": arguments.source_url,
        },
        "videoMetadata": {
            "fps": fps,
            "frameCount": frame_count,
            "durationSeconds": duration,
            "width": width,
            "height": height,
        },
        "parameters": {
            "targetSeconds": arguments.target_seconds,
            "targetFrameIndex": target_index,
            "startSeconds": arguments.start_seconds,
            "endSeconds": arguments.end_seconds,
            "stepSeconds": arguments.step_seconds,
            "featureRoi": list(roi),
            "ratioTest": arguments.ratio_test,
            "ransacThresholdPixels": arguments.ransac_threshold_pixels,
            "minimumInliers": arguments.minimum_inliers,
            "minimumInlierRatio": arguments.minimum_inlier_ratio,
            "minimumTargetHullFraction": arguments.minimum_target_hull_fraction,
            "maximumReprojectionP95Pixels": arguments.maximum_reprojection_p95_pixels,
        },
        "frames": frame_records,
        "summary": {
            "requestedFrameCount": len(requested_indices),
            "acceptedFrameCount": len(accepted_warps),
            "targetActualSeconds": target_index / fps,
            "minimumPerPixelAcceptedFrameCount": int(np.min(coverage_count)),
            "medianPerPixelAcceptedFrameCount": float(np.median(coverage_count)),
            "maximumPerPixelAcceptedFrameCount": int(np.max(coverage_count)),
        },
        "outputs": {
            "registeredMedianPath": str(output_png.resolve()),
            "registeredMedianSha256": sha256_file(output_png),
            "rawTargetPath": str(target_png.resolve()),
            "rawTargetSha256": sha256_file(target_png),
            "rawTargetDecodedPixelsSha256": hashlib.sha256(
                target.tobytes(order="C")
            ).hexdigest(),
            "coveragePath": str(coverage_png.resolve()),
            "coverageSha256": sha256_file(coverage_png),
        },
        "useRestriction": {
            "allowed": "static venue registration-control discovery and review only",
            "prohibited": [
                "shade-boundary labeling",
                "live-frame confirmation",
                "timestamp substitution",
                "publication evidence without the raw target frame",
            ],
        },
        "publicationEligible": False,
        "blockers": [
            "DERIVED_REGISTERED_MEDIAN_CANNOT_LABEL_SHADE",
            "ROW_CONTROLS_NOT_REVIEWED",
            "SHADOW_GEOMETRY_NOT_VALIDATED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "outputs": artifact["outputs"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

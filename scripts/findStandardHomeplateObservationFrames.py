#!/usr/bin/env python3
"""Find standard center-field camera frames in an indexed MLB clip corpus.

The output is a review queue, not accepted shadow evidence. Every match retains
its template, feature, homography, timestamp, and image hashes so a reviewer can
reproduce the selection before labeling any shade boundary.
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
from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    serialized = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(serialized).hexdigest()}"


def feature_mask(height: int, width: int) -> np.ndarray:
    """Keep the fixed seating bank and ad rail, excluding broadcast overlays."""
    mask = np.zeros((height, width), dtype=np.uint8)
    mask[round(height * 0.04) : round(height * 0.56), round(width * 0.02) : round(width * 0.98)] = 255
    mask[0 : round(height * 0.22), 0 : round(width * 0.29)] = 0
    mask[0 : round(height * 0.22), round(width * 0.86) : width] = 0
    return mask


def convex_hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def render_review_sheet(records: list[dict[str, Any]], output: Path) -> None:
    if not records:
        return
    columns = 4
    thumb_width = 480
    thumb_height = 270
    label_height = 66
    title_height = 50
    rows = math.ceil(len(records) / columns)
    sheet = Image.new(
        "RGB",
        (columns * thumb_width, title_height + rows * (thumb_height + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((10, 15), "Standard homeplate camera review queue", fill="black")
    for index, record in enumerate(records):
        image = Image.open(record["thumbnailPath"]).convert("RGB")
        image.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        column = index % columns
        row = index // columns
        x_value = column * thumb_width
        y_value = title_height + row * (thumb_height + label_height)
        label = (
            f"{record['candidateIndex']:03d}/{record['sampleIndex']:03d}  "
            f"{record['eventMidpointTime']}\n"
            f"inliers {record['inlierCount']}  hull {record['inlierHullFraction']:.3f}  "
            f"template {record['templateLabel']}"
        )
        draw.text((x_value + 5, y_value + 5), label, fill="black")
        sheet.paste(image, (x_value, y_value + label_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="JPEG", quality=94, optimize=True, progressive=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("templates", nargs="+", type=Path)
    parser.add_argument("--minimum-inliers", type=int, default=18)
    parser.add_argument("--minimum-inlier-ratio", type=float, default=0.55)
    parser.add_argument("--minimum-hull-fraction", type=float, default=0.018)
    parser.add_argument("--ratio-test", type=float, default=0.70)
    arguments = parser.parse_args()
    if arguments.minimum_inliers < 8:
        raise ValueError("Minimum inliers must be at least eight")
    if not 0 < arguments.minimum_inlier_ratio <= 1:
        raise ValueError("Invalid minimum inlier ratio")
    if not 0 < arguments.ratio_test < 1:
        raise ValueError("Invalid feature ratio test")

    manifest_bytes = arguments.frame_manifest.read_bytes()
    frame_manifest = json.loads(manifest_bytes)
    sift = cv2.SIFT_create(nfeatures=1400, contrastThreshold=0.02)
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    template_records: list[dict[str, Any]] = []
    for template_path in arguments.templates:
        image = cv2.imread(str(template_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode template {template_path}")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        keypoints, descriptors = sift.detectAndCompute(
            gray, feature_mask(gray.shape[0], gray.shape[1])
        )
        if descriptors is None or len(keypoints) < 20:
            raise ValueError(f"Template has insufficient fixed-background features: {template_path}")
        template_records.append(
            {
                "path": template_path,
                "label": f"{template_path.parent.name}/{template_path.name}",
                "sha256": sha256_file(template_path),
                "width": gray.shape[1],
                "height": gray.shape[0],
                "keypoints": keypoints,
                "descriptors": descriptors,
            }
        )

    candidate_best: list[dict[str, Any]] = []
    all_accepted: list[dict[str, Any]] = []
    for candidate in frame_manifest["candidates"]:
        best: dict[str, Any] | None = None
        for frame in candidate["frames"]:
            thumbnail_path = Path(frame["thumbnailPath"])
            image = cv2.imread(str(thumbnail_path), cv2.IMREAD_COLOR)
            if image is None:
                raise ValueError(f"Could not decode indexed thumbnail {thumbnail_path}")
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            target_mask = feature_mask(gray.shape[0], gray.shape[1])
            target_keypoints, target_descriptors = sift.detectAndCompute(gray, target_mask)
            if target_descriptors is None:
                continue
            for template in template_records:
                pairs = matcher.knnMatch(template["descriptors"], target_descriptors, k=2)
                good = [
                    pair[0]
                    for pair in pairs
                    if len(pair) == 2 and pair[0].distance < arguments.ratio_test * pair[1].distance
                ]
                if len(good) < 8:
                    continue
                source_points = np.float32(
                    [template["keypoints"][match.queryIdx].pt for match in good]
                )
                target_points = np.float32(
                    [target_keypoints[match.trainIdx].pt for match in good]
                )
                homography, status = cv2.findHomography(
                    source_points, target_points, cv2.RANSAC, 3.0
                )
                if homography is None or status is None:
                    continue
                inlier_mask = status.ravel().astype(bool)
                inlier_count = int(np.sum(inlier_mask))
                inlier_ratio = inlier_count / len(good)
                source_hull_fraction = convex_hull_fraction(
                    source_points[inlier_mask], template["width"], template["height"]
                )
                target_hull_fraction = convex_hull_fraction(
                    target_points[inlier_mask], gray.shape[1], gray.shape[0]
                )
                hull_fraction = min(source_hull_fraction, target_hull_fraction)
                accepted = (
                    inlier_count >= arguments.minimum_inliers
                    and inlier_ratio >= arguments.minimum_inlier_ratio
                    and hull_fraction >= arguments.minimum_hull_fraction
                )
                record = {
                    "candidateIndex": candidate["candidateIndex"],
                    "candidateId": candidate["candidateId"],
                    "eventMidpointTime": candidate["eventMidpointTime"],
                    "solarPosition": candidate["solarPosition"],
                    "sampleIndex": frame["sampleIndex"],
                    "frameIndex": frame["frameIndex"],
                    "seconds": frame["seconds"],
                    "thumbnailPath": str(thumbnail_path),
                    "thumbnailSha256": frame["thumbnailSha256"],
                    "decodedPixelsSha256": frame["decodedPixelsSha256"],
                    "templateLabel": template["label"],
                    "templateSha256": template["sha256"],
                    "ratioMatchCount": len(good),
                    "inlierCount": inlier_count,
                    "inlierRatio": inlier_ratio,
                    "inlierHullFraction": hull_fraction,
                    "homographyTemplateToFrame": homography.tolist(),
                    "acceptedForManualReview": accepted,
                }
                score = (accepted, inlier_count, hull_fraction, inlier_ratio)
                if best is None or score > best["_score"]:
                    best = {**record, "_score": score}
        if best is not None:
            best.pop("_score")
            candidate_best.append(best)
            if best["acceptedForManualReview"]:
                all_accepted.append(best)

    all_accepted.sort(key=lambda item: (item["eventMidpointTime"], item["candidateIndex"]))
    review_sheet = arguments.output_json.with_suffix(".jpg")
    render_review_sheet(all_accepted, review_sheet)
    dates = sorted({item["eventMidpointTime"][:10] for item in all_accepted})
    altitudes = [item["solarPosition"]["altitudeDegrees"] for item in all_accepted]
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "sift-fixed-background-homography-v1",
        "artifactStage": "official-mlb-standard-homeplate-camera-review-queue",
        "inputs": {
            "frameManifestPath": str(arguments.frame_manifest),
            "frameManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "templates": [
                {"path": str(item["path"]), "sha256": item["sha256"]}
                for item in template_records
            ],
        },
        "parameters": {
            "feature": "SIFT on fixed upper-background mask",
            "maximumFeatures": 1400,
            "ratioTest": arguments.ratio_test,
            "ransacReprojectionThresholdPixels": 3.0,
            "minimumInliers": arguments.minimum_inliers,
            "minimumInlierRatio": arguments.minimum_inlier_ratio,
            "minimumInlierHullFraction": arguments.minimum_hull_fraction,
        },
        "candidateCount": len(frame_manifest["candidates"]),
        "candidateBestMatches": candidate_best,
        "manualReviewQueue": all_accepted,
        "manualReviewQueueCount": len(all_accepted),
        "uniqueDates": dates,
        "solarAltitudeSpanDegrees": max(altitudes) - min(altitudes) if altitudes else 0.0,
        "reviewSheetPath": str(review_sheet),
        "reviewSheetSha256": sha256_file(review_sheet) if review_sheet.exists() else None,
        "publicationEligible": False,
        "blockers": [
            "MATCHES_REQUIRE_FULL_RESOLUTION_VISUAL_REVIEW",
            "SECTION_AND_ROW_BANK_IDENTITY_NOT_YET_REVIEWED",
            "SHADOW_BOUNDARY_NOT_YET_LABELED",
            "ATMOSPHERIC_VISIBILITY_NOT_YET_REVIEWED",
        ],
        "interpretation": (
            "A match only locates a likely standard center-field view. It is not a shade label "
            "and cannot clear any publication gate without independent manual review."
        ),
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "manualReviewQueueCount": len(all_accepted),
                "uniqueDates": dates,
                "solarAltitudeSpanDegrees": artifact["solarAltitudeSpanDegrees"],
                "reviewSheet": str(review_sheet),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

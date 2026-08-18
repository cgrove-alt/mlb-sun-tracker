#!/usr/bin/env python3
"""Locate standard center-field shots in a condensed-game timeline."""

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
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def feature_mask(height: int, width: int) -> np.ndarray:
    mask = np.zeros((height, width), dtype=np.uint8)
    mask[round(height * 0.04):round(height * 0.56), round(width * 0.02):round(width * 0.98)] = 255
    mask[0:round(height * 0.22), 0:round(width * 0.29)] = 0
    mask[0:round(height * 0.22), round(width * 0.86):width] = 0
    return mask


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def render_sheet(records: list[dict[str, Any]], output: Path) -> None:
    if not records:
        return
    columns = 4
    thumb_width = 480
    thumb_height = 270
    label_height = 58
    title_height = 48
    rows = math.ceil(len(records) / columns)
    sheet = Image.new(
        "RGB",
        (columns * thumb_width, title_height + rows * (thumb_height + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((10, 15), "Condensed-game standard-camera shot review", fill="black")
    for index, record in enumerate(records):
        source = Image.open(record["thumbnailPath"]).convert("RGB")
        source.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        column = index % columns
        row = index // columns
        x_value = column * thumb_width
        y_value = title_height + row * (thumb_height + label_height)
        label = (
            f"shot {record['shotIndex']:03d}  {record['condensedTimelineSeconds']:.2f}s\n"
            f"inliers {record['inlierCount']}  hull {record['inlierHullFraction']:.3f}  "
            f"pixels {record['decodedPixelsSha256'][:10]}"
        )
        draw.text((x_value + 6, y_value + 5), label, fill="black")
        sheet.paste(source, (x_value, y_value + label_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="JPEG", quality=94, optimize=True, progressive=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("templates", nargs="+", type=Path)
    parser.add_argument("--minimum-inliers", type=int, default=15)
    parser.add_argument("--minimum-inlier-ratio", type=float, default=0.45)
    parser.add_argument("--minimum-hull-fraction", type=float, default=0.01)
    parser.add_argument("--ratio-test", type=float, default=0.70)
    parser.add_argument("--maximum-shot-gap-seconds", type=float, default=2.0)
    arguments = parser.parse_args()
    if arguments.minimum_inliers < 8:
        raise ValueError("Minimum inliers must be at least eight")
    if not 0 < arguments.minimum_inlier_ratio <= 1:
        raise ValueError("Invalid minimum inlier ratio")
    if not 0 < arguments.ratio_test < 1:
        raise ValueError("Invalid ratio test")
    if arguments.maximum_shot_gap_seconds <= 0:
        raise ValueError("Maximum shot gap must be positive")

    manifest_bytes = arguments.frame_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactStage") != "official-mlb-condensed-game-frame-review-index":
        raise ValueError("Input is not a condensed-game frame index")
    sift = cv2.SIFT_create(nfeatures=1400, contrastThreshold=0.02)
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    templates = []
    for path in arguments.templates:
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode template {path}")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        keypoints, descriptors = sift.detectAndCompute(
            gray, feature_mask(gray.shape[0], gray.shape[1])
        )
        if descriptors is None or len(keypoints) < 20:
            raise ValueError(f"Template has insufficient fixed features: {path}")
        templates.append({
            "path": path,
            "sha256": sha256_file(path),
            "width": gray.shape[1],
            "height": gray.shape[0],
            "keypoints": keypoints,
            "descriptors": descriptors,
        })

    accepted = []
    for frame in manifest["frames"]:
        thumbnail_path = Path(frame["thumbnailPath"])
        if sha256_file(thumbnail_path) != frame["thumbnailSha256"]:
            raise ValueError(f"Thumbnail checksum changed: {thumbnail_path}")
        image = cv2.imread(str(thumbnail_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {thumbnail_path}")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        keypoints, descriptors = sift.detectAndCompute(
            gray, feature_mask(gray.shape[0], gray.shape[1])
        )
        if descriptors is None:
            continue
        best = None
        for template_index, template in enumerate(templates):
            pairs = matcher.knnMatch(template["descriptors"], descriptors, k=2)
            good = [
                pair[0]
                for pair in pairs
                if len(pair) == 2 and pair[0].distance < arguments.ratio_test * pair[1].distance
            ]
            if len(good) < 8:
                continue
            source_points = np.float32([
                template["keypoints"][match.queryIdx].pt for match in good
            ])
            target_points = np.float32([keypoints[match.trainIdx].pt for match in good])
            homography, status = cv2.findHomography(
                source_points, target_points, cv2.RANSAC, 3.0
            )
            if homography is None or status is None:
                continue
            inliers = status.ravel().astype(bool)
            inlier_count = int(np.sum(inliers))
            inlier_ratio = inlier_count / len(good)
            spread = min(
                hull_fraction(
                    source_points[inliers], template["width"], template["height"]
                ),
                hull_fraction(target_points[inliers], gray.shape[1], gray.shape[0]),
            )
            if (
                inlier_count < arguments.minimum_inliers
                or inlier_ratio < arguments.minimum_inlier_ratio
                or spread < arguments.minimum_hull_fraction
            ):
                continue
            record = {
                **frame,
                "templateIndex": template_index + 1,
                "templatePath": str(template["path"]),
                "templateSha256": template["sha256"],
                "ratioMatchCount": len(good),
                "inlierCount": inlier_count,
                "inlierRatio": inlier_ratio,
                "inlierHullFraction": spread,
                "homographyTemplateToFrame": homography.tolist(),
            }
            score = (inlier_count, spread, inlier_ratio)
            if best is None or score > best["_score"]:
                best = {**record, "_score": score}
        if best is not None:
            best.pop("_score")
            accepted.append(best)

    groups: list[list[dict[str, Any]]] = []
    for record in accepted:
        if (
            not groups
            or record["condensedTimelineSeconds"]
            - groups[-1][-1]["condensedTimelineSeconds"]
            > arguments.maximum_shot_gap_seconds
        ):
            groups.append([])
        groups[-1].append(record)
    representatives = []
    for shot_index, group in enumerate(groups, start=1):
        best = max(
            group,
            key=lambda item: (
                item["inlierCount"], item["inlierHullFraction"], item["inlierRatio"]
            ),
        )
        representatives.append({
            **best,
            "shotIndex": shot_index,
            "shotStartSeconds": group[0]["condensedTimelineSeconds"],
            "shotEndSeconds": group[-1]["condensedTimelineSeconds"],
            "acceptedSampleCount": len(group),
        })

    review_sheet = arguments.output_json.with_suffix(".jpg")
    render_sheet(representatives, review_sheet)
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "sift-fixed-background-condensed-shot-v1",
        "artifactStage": "official-mlb-condensed-standard-camera-review-queue",
        "inputs": {
            "frameManifestPath": str(arguments.frame_manifest.resolve()),
            "frameManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "frameManifestArtifactVersion": manifest["artifactVersion"],
            "templates": [
                {"path": str(item["path"]), "sha256": item["sha256"]}
                for item in templates
            ],
        },
        "parameters": {
            "minimumInliers": arguments.minimum_inliers,
            "minimumInlierRatio": arguments.minimum_inlier_ratio,
            "minimumInlierHullFraction": arguments.minimum_hull_fraction,
            "ratioTest": arguments.ratio_test,
            "maximumShotGapSeconds": arguments.maximum_shot_gap_seconds,
        },
        "acceptedSampleCount": len(accepted),
        "shotCount": len(representatives),
        "acceptedSamples": accepted,
        "shotRepresentatives": representatives,
        "reviewSheetPath": str(review_sheet),
        "reviewSheetSha256": sha256_file(review_sheet) if review_sheet.exists() else None,
        "publicationEligible": False,
        "blockers": [
            "CONDENSED_TIMELINE_IS_NOT_THE_ORIGINAL_BROADCAST_TIMELINE",
            "EACH_SHOT_REQUIRES_EXACT_PLAY_BY_PLAY_IDENTITY",
            "FULL_RESOLUTION_VISUAL_REVIEW_REQUIRED",
            "SECTION_AND_ROW_REGISTRATION_REQUIRED",
            "SHADOW_BOUNDARY_LABEL_REQUIRED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "acceptedSampleCount": len(accepted),
        "shotCount": len(representatives),
        "reviewSheet": str(review_sheet),
    }, indent=2))


if __name__ == "__main__":
    main()

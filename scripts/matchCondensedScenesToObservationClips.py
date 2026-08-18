#!/usr/bin/env python3
"""Match condensed-game discovery frames to timestamped official MLB clips.

The condensed timeline is useful for finding broadcast views, but it is not an
event clock. This tool only creates a candidate identity link when the same
fixed image content is recovered in a checksum-locked official play clip.
Every geometric acceptance threshold is recorded in the output artifact.
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
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def feature_mask(height: int, width: int) -> np.ndarray:
    """Exclude the changing scorebug, network logo, and lower-third area."""
    mask = np.zeros((height, width), dtype=np.uint8)
    mask[round(height * 0.04) : round(height * 0.84), round(width * 0.03) : round(width * 0.97)] = 255
    mask[0 : round(height * 0.25), 0 : round(width * 0.31)] = 0
    mask[0 : round(height * 0.22), round(width * 0.84) : width] = 0
    return mask


def color_histogram(image: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    histogram = cv2.calcHist([hsv], [0, 1], None, [24, 12], [0, 180, 0, 256])
    return cv2.normalize(histogram, None).reshape(-1).astype(np.float32)


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def load_verified_image(record: dict[str, Any]) -> tuple[Path, np.ndarray]:
    path = Path(record["thumbnailPath"])
    if sha256_file(path) != record["thumbnailSha256"]:
        raise ValueError(f"Thumbnail checksum changed: {path}")
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Could not decode {path}")
    return path, image


def render_identity_sheet(records: list[dict[str, Any]], output: Path) -> None:
    if not records:
        return
    columns = 2
    panel_width = 720
    image_width = panel_width // 2
    image_height = round(image_width * 9 / 16)
    label_height = 66
    title_height = 44
    rows = math.ceil(len(records) / columns)
    sheet = Image.new(
        "RGB",
        (columns * panel_width, title_height + rows * (image_height + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((10, 14), "Condensed discovery frame and timestamped official clip match", fill="black")
    for index, record in enumerate(records):
        match = record["match"]
        condensed_image = Image.open(record["condensedThumbnailPath"]).convert("RGB")
        observation_image = Image.open(match["observationThumbnailPath"]).convert("RGB")
        condensed_image = condensed_image.resize(
            (image_width, image_height), Image.Resampling.LANCZOS
        )
        observation_image = observation_image.resize(
            (image_width, image_height), Image.Resampling.LANCZOS
        )
        column = index % columns
        row = index // columns
        left = column * panel_width
        top = title_height + row * (image_height + label_height)
        label = (
            f"event {match['eventMidpointTime']}  clip {match['candidateIndex']:03d} "
            f"sample {match['observationSampleIndex']:03d}\n"
            f"inliers {match['inlierCount']}  ratio {match['inlierRatio']:.3f}  "
            f"hull {match['inlierHullFraction']:.3f}  p95 {match['reprojectionP95Pixels']:.2f}px\n"
            f"condensed {record['condensedTimelineSeconds']:.1f}s  "
            f"pixels {record['condensedDecodedPixelsSha256'][:10]}"
        )
        draw.text((left + 6, top + 5), label, fill="black")
        sheet.paste(condensed_image, (left, top + label_height))
        sheet.paste(observation_image, (left + image_width, top + label_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="JPEG", quality=94, optimize=True, progressive=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("condensed_review", type=Path)
    parser.add_argument("condensed_frame_manifest", type=Path)
    parser.add_argument("observation_frame_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--histogram-candidates", type=int, default=30)
    parser.add_argument("--ratio-test", type=float, default=0.72)
    parser.add_argument("--minimum-inliers", type=int, default=25)
    parser.add_argument("--minimum-inlier-ratio", type=float, default=0.35)
    parser.add_argument("--minimum-inlier-hull-fraction", type=float, default=0.025)
    parser.add_argument("--maximum-reprojection-p95-pixels", type=float, default=3.0)
    arguments = parser.parse_args()
    if arguments.histogram_candidates < 1:
        raise ValueError("Histogram candidate count must be positive")
    if arguments.minimum_inliers < 8:
        raise ValueError("Minimum inliers must be at least eight")
    if not 0 < arguments.ratio_test < 1:
        raise ValueError("Ratio test must be between zero and one")
    if not 0 < arguments.minimum_inlier_ratio <= 1:
        raise ValueError("Minimum inlier ratio must be between zero and one")
    if not 0 < arguments.minimum_inlier_hull_fraction <= 1:
        raise ValueError("Minimum inlier hull fraction must be between zero and one")
    if arguments.maximum_reprojection_p95_pixels <= 0:
        raise ValueError("Maximum reprojection error must be positive")

    review_bytes = arguments.condensed_review.read_bytes()
    condensed_bytes = arguments.condensed_frame_manifest.read_bytes()
    observation_bytes = arguments.observation_frame_manifest.read_bytes()
    review = json.loads(review_bytes)
    condensed = json.loads(condensed_bytes)
    observations = json.loads(observation_bytes)
    if review.get("artifactStage") != "official-mlb-condensed-scene-review-queue":
        raise ValueError("Input is not a condensed-game scene review queue")
    if condensed.get("artifactStage") != "official-mlb-condensed-game-frame-review-index":
        raise ValueError("Input is not a condensed-game frame index")
    if observations.get("artifactStage") != "official-mlb-observation-frame-review-index":
        raise ValueError("Input is not an official MLB observation frame index")
    if review["inputs"]["frameManifestSha256"] != hashlib.sha256(condensed_bytes).hexdigest():
        raise ValueError("Condensed frame manifest differs from the review input")
    if review["inputs"]["frameManifestArtifactVersion"] != condensed["artifactVersion"]:
        raise ValueError("Condensed frame artifact version differs from the review input")

    game_pk = int(condensed["gamePk"])
    observation_candidates = [
        item
        for item in observations["candidates"]
        if item["candidateId"].startswith(f"mlb-{game_pk}-")
    ]
    if not observation_candidates:
        raise ValueError(f"Observation corpus contains no clips for game {game_pk}")

    corpus_path = Path(observations["inputs"]["corpusManifestPath"])
    if sha256_file(corpus_path) != observations["inputs"]["corpusManifestSha256"]:
        raise ValueError("Observation video corpus checksum changed")
    corpus = json.loads(corpus_path.read_bytes())
    source_by_candidate = {
        item["candidateId"]: item
        for item in corpus["acquired"]
        if item.get("status") == "acquired"
    }

    observation_frames: list[dict[str, Any]] = []
    for candidate in observation_candidates:
        source = source_by_candidate.get(candidate["candidateId"])
        if source is None:
            raise ValueError(f"Missing acquisition record for {candidate['candidateId']}")
        if source["sha256"] != candidate["videoSha256"]:
            raise ValueError(f"Video checksum differs for {candidate['candidateId']}")
        for frame in candidate["frames"]:
            path, image = load_verified_image(frame)
            observation_frames.append(
                {
                    "candidate": candidate,
                    "source": source,
                    "frame": frame,
                    "path": path,
                    "image": image,
                    "histogram": color_histogram(image),
                }
            )

    sift = cv2.SIFT_create(nfeatures=2200, contrastThreshold=0.018, edgeThreshold=12)
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    observation_feature_cache: dict[tuple[int, int], tuple[list[Any], np.ndarray | None]] = {}

    def observation_features(record: dict[str, Any]) -> tuple[list[Any], np.ndarray | None]:
        key = (record["candidate"]["candidateIndex"], record["frame"]["sampleIndex"])
        if key not in observation_feature_cache:
            gray = cv2.cvtColor(record["image"], cv2.COLOR_BGR2GRAY)
            observation_feature_cache[key] = sift.detectAndCompute(
                gray, feature_mask(gray.shape[0], gray.shape[1])
            )
        return observation_feature_cache[key]

    results: list[dict[str, Any]] = []
    for scene in review["reviewQueue"]:
        scene_path, scene_image = load_verified_image(scene)
        scene_gray = cv2.cvtColor(scene_image, cv2.COLOR_BGR2GRAY)
        scene_keypoints, scene_descriptors = sift.detectAndCompute(
            scene_gray, feature_mask(scene_gray.shape[0], scene_gray.shape[1])
        )
        scene_histogram = color_histogram(scene_image)
        ranked = sorted(
            observation_frames,
            key=lambda item: cv2.compareHist(
                scene_histogram, item["histogram"], cv2.HISTCMP_BHATTACHARYYA
            ),
        )[: arguments.histogram_candidates]
        best: dict[str, Any] | None = None
        for candidate_record in ranked:
            target_keypoints, target_descriptors = observation_features(candidate_record)
            if scene_descriptors is None or target_descriptors is None:
                continue
            pairs = matcher.knnMatch(scene_descriptors, target_descriptors, k=2)
            good = [
                pair[0]
                for pair in pairs
                if len(pair) == 2
                and pair[0].distance < arguments.ratio_test * pair[1].distance
            ]
            if len(good) < 8:
                continue
            source_points = np.float32(
                [scene_keypoints[match.queryIdx].pt for match in good]
            )
            target_points = np.float32(
                [target_keypoints[match.trainIdx].pt for match in good]
            )
            homography, status = cv2.findHomography(
                source_points, target_points, cv2.RANSAC, 2.5
            )
            if homography is None or status is None:
                continue
            inliers = status.ravel().astype(bool)
            inlier_count = int(np.sum(inliers))
            inlier_ratio = inlier_count / len(good)
            inlier_hull = min(
                hull_fraction(
                    source_points[inliers], scene_gray.shape[1], scene_gray.shape[0]
                ),
                hull_fraction(
                    target_points[inliers],
                    candidate_record["image"].shape[1],
                    candidate_record["image"].shape[0],
                ),
            )
            projected = cv2.perspectiveTransform(
                source_points[inliers].reshape(-1, 1, 2), homography
            ).reshape(-1, 2)
            residuals = np.linalg.norm(projected - target_points[inliers], axis=1)
            reprojection_p95 = float(np.percentile(residuals, 95)) if len(residuals) else float("inf")
            accepted = bool(
                inlier_count >= arguments.minimum_inliers
                and inlier_ratio >= arguments.minimum_inlier_ratio
                and inlier_hull >= arguments.minimum_inlier_hull_fraction
                and reprojection_p95 <= arguments.maximum_reprojection_p95_pixels
            )
            candidate = candidate_record["candidate"]
            frame = candidate_record["frame"]
            source = candidate_record["source"]
            record = {
                "accepted": accepted,
                "candidateId": candidate["candidateId"],
                "candidateIndex": candidate["candidateIndex"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                "eventWindowSeconds": candidate["eventWindowSeconds"],
                "sourceUrl": source["sourceUrl"],
                "resolvedSourceUrl": source["resolvedUrl"],
                "observationSampleIndex": frame["sampleIndex"],
                "observationFrameIndex": frame["frameIndex"],
                "observationSeconds": frame["seconds"],
                "observationThumbnailPath": str(candidate_record["path"]),
                "observationThumbnailSha256": frame["thumbnailSha256"],
                "ratioMatchCount": len(good),
                "inlierCount": inlier_count,
                "inlierRatio": inlier_ratio,
                "inlierHullFraction": inlier_hull,
                "reprojectionP95Pixels": reprojection_p95,
                "homographyCondensedToObservation": homography.tolist(),
            }
            score = (
                int(accepted),
                inlier_count,
                inlier_hull,
                inlier_ratio,
                -reprojection_p95,
            )
            if best is None or score > best["_score"]:
                best = {**record, "_score": score}
        result = {
            "condensedSampleIndex": scene["sampleIndex"],
            "condensedFrameIndex": scene["frameIndex"],
            "condensedTimelineSeconds": scene["condensedTimelineSeconds"],
            "condensedThumbnailPath": str(scene_path),
            "condensedThumbnailSha256": scene["thumbnailSha256"],
            "condensedDecodedPixelsSha256": scene["decodedPixelsSha256"],
            "match": None,
        }
        if best is not None:
            best.pop("_score")
            result["match"] = best
        results.append(result)

    accepted = [item for item in results if item["match"] and item["match"]["accepted"]]
    review_sheet = arguments.output_json.with_suffix(".jpg")
    render_identity_sheet(accepted, review_sheet)
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "same-broadcast-sift-identity-v1",
        "artifactStage": "official-mlb-condensed-to-event-frame-identity",
        "inputs": {
            "condensedReviewPath": str(arguments.condensed_review.resolve()),
            "condensedReviewSha256": hashlib.sha256(review_bytes).hexdigest(),
            "condensedReviewArtifactVersion": review["artifactVersion"],
            "condensedFrameManifestPath": str(arguments.condensed_frame_manifest.resolve()),
            "condensedFrameManifestSha256": hashlib.sha256(condensed_bytes).hexdigest(),
            "condensedFrameArtifactVersion": condensed["artifactVersion"],
            "observationFrameManifestPath": str(arguments.observation_frame_manifest.resolve()),
            "observationFrameManifestSha256": hashlib.sha256(observation_bytes).hexdigest(),
            "observationFrameArtifactVersion": observations["artifactVersion"],
            "observationCorpusPath": str(corpus_path.resolve()),
            "observationCorpusSha256": sha256_file(corpus_path),
            "observationCorpusArtifactVersion": corpus["artifactVersion"],
        },
        "gamePk": game_pk,
        "parameters": {
            "histogramCandidates": arguments.histogram_candidates,
            "ratioTest": arguments.ratio_test,
            "minimumInliers": arguments.minimum_inliers,
            "minimumInlierRatio": arguments.minimum_inlier_ratio,
            "minimumInlierHullFraction": arguments.minimum_inlier_hull_fraction,
            "maximumReprojectionP95Pixels": arguments.maximum_reprojection_p95_pixels,
        },
        "condensedSceneCount": len(results),
        "observationClipCount": len(observation_candidates),
        "observationFrameCount": len(observation_frames),
        "acceptedIdentityCount": len(accepted),
        "acceptedDistinctCandidateCount": len(
            {item["match"]["candidateId"] for item in accepted}
        ),
        "reviewSheetPath": str(review_sheet.resolve()) if review_sheet.exists() else None,
        "reviewSheetSha256": sha256_file(review_sheet) if review_sheet.exists() else None,
        "results": results,
        "publicationEligible": False,
        "blockers": [
            "MATCHES_ESTABLISH_FRAME_IDENTITY_ONLY",
            "SECTION_AND_ROW_REGISTRATION_REQUIRED",
            "SHADOW_BOUNDARY_LABEL_REQUIRED",
            "INDEPENDENCE_KEY_REQUIRED",
        ],
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
                "gamePk": game_pk,
                "condensedSceneCount": len(results),
                "observationClipCount": len(observation_candidates),
                "observationFrameCount": len(observation_frames),
                "acceptedIdentityCount": len(accepted),
                "acceptedDistinctCandidateCount": artifact_without_version[
                    "acceptedDistinctCandidateCount"
                ],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

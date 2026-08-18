#!/usr/bin/env python3
"""Triangulate a current panorama scene from independently known camera poses."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw

from reconstructPanoramaDenseOverhang import panorama_rays, triangulate, values_summary


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def deterministic_holdout(pixels: np.ndarray) -> np.ndarray:
    return np.asarray([
        int.from_bytes(
            hashlib.sha256(
                f"panorama-scene-holdout-v1:{pixel[0]:.3f}:{pixel[1]:.3f}".encode("utf-8")
            ).digest()[:4],
            "big",
        ) % 5 == 0
        for pixel in pixels
    ], dtype=bool)


def render_points(path: Path, points: np.ndarray, width: int = 1800, height: int = 1000) -> None:
    if points.shape[0] == 0:
        raise ValueError("Cannot render an empty point cloud")
    x_values = points[:, 0]
    z_values = points[:, 2]
    y_values = points[:, 1]
    x_low, x_high = np.percentile(x_values, [1, 99])
    z_low, z_high = np.percentile(z_values, [1, 99])
    y_low, y_high = np.percentile(y_values, [2, 98])
    selected = (
        (x_values >= x_low) & (x_values <= x_high)
        & (z_values >= z_low) & (z_values <= z_high)
    )
    canvas = Image.new("RGB", (width, height), (12, 16, 24))
    draw = ImageDraw.Draw(canvas)
    for point in points[selected]:
        px = int((point[0] - x_low) / max(x_high - x_low, 1e-9) * (width - 1))
        py = int((1.0 - (point[2] - z_low) / max(z_high - z_low, 1e-9)) * (height - 1))
        normalized = max(0.0, min(1.0, (point[1] - y_low) / max(y_high - y_low, 1e-9)))
        color = (
            int(40 + 215 * normalized),
            int(190 - 120 * normalized),
            int(255 - 180 * normalized),
        )
        draw.ellipse((px - 1, py - 1, px + 1, py + 1), fill=color)
    path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(path, format="PNG", optimize=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--left-seat-id", required=True)
    parser.add_argument("--right-seat-id", required=True)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--nfeatures", type=int, default=120_000)
    parser.add_argument("--contrast-threshold", type=float, default=0.004)
    parser.add_argument("--ratio-threshold", type=float, default=0.88)
    parser.add_argument("--epipolar-threshold", type=float, default=0.0007)
    parser.add_argument("--maximum-depth-metres", type=float, default=180.0)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.05)
    parser.add_argument("--maximum-image-y-fraction", type=float, default=0.68)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama-frame calibration is not measurement eligible")
    images = {item["seatId"]: item for item in manifest["images"]}
    if args.left_seat_id not in images or args.right_seat_id not in images:
        raise ValueError("Stereo seat is missing from the manifest")
    left_entry = images[args.left_seat_id]
    right_entry = images[args.right_seat_id]
    left_path = Path(left_entry["localPath"])
    right_path = Path(right_entry["localPath"])
    left_source = cv2.imread(str(left_path), cv2.IMREAD_COLOR)
    right_source = cv2.imread(str(right_path), cv2.IMREAD_COLOR)
    if left_source is None or right_source is None or left_source.shape != right_source.shape:
        raise ValueError("Could not read matching panorama images")
    source_height, source_width = left_source.shape[:2]
    scale = min(1.0, args.maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    left = cv2.resize(left_source, (width, height), interpolation=cv2.INTER_AREA)
    right = cv2.resize(right_source, (width, height), interpolation=cv2.INTER_AREA)
    clahe = cv2.createCLAHE(3.0, (16, 8))
    left_gray = clahe.apply(cv2.cvtColor(left, cv2.COLOR_BGR2GRAY))
    right_gray = clahe.apply(cv2.cvtColor(right, cv2.COLOR_BGR2GRAY))
    sift = cv2.SIFT_create(
        nfeatures=args.nfeatures,
        contrastThreshold=args.contrast_threshold,
        edgeThreshold=20,
    )
    left_keypoints, left_descriptors = sift.detectAndCompute(left_gray, None)
    right_keypoints, right_descriptors = sift.detectAndCompute(right_gray, None)
    if left_descriptors is None or right_descriptors is None:
        raise ValueError("SIFT did not produce descriptors")
    cv2.setRNGSeed(20260808)
    matcher = cv2.FlannBasedMatcher(
        {"algorithm": 1, "trees": 8}, {"checks": 256}
    )
    left_neighbors = matcher.knnMatch(left_descriptors, right_descriptors, k=2)
    right_neighbors = matcher.knnMatch(right_descriptors, left_descriptors, k=2)
    forward = {
        match.queryIdx: match
        for match, alternative in left_neighbors
        if match.distance < args.ratio_threshold * alternative.distance
    }
    reverse = {
        match.queryIdx: match
        for match, alternative in right_neighbors
        if match.distance < args.ratio_threshold * alternative.distance
    }
    mutual = [
        match for match in forward.values()
        if match.trainIdx in reverse and reverse[match.trainIdx].trainIdx == match.queryIdx
    ]
    if len(mutual) < 200:
        raise ValueError("Too few mutual panorama feature candidates")
    left_pixels = np.asarray([left_keypoints[match.queryIdx].pt for match in mutual])
    right_pixels = np.asarray([right_keypoints[match.trainIdx].pt for match in mutual])
    overhead = (
        ((left_pixels[:, 1] + right_pixels[:, 1]) / 2.0)
        <= height * args.maximum_image_y_fraction
    )
    left_pixels = left_pixels[overhead]
    right_pixels = right_pixels[overhead]
    matches = [match for match, keep in zip(mutual, overhead) if keep]

    left_rays = panorama_rays(
        left_pixels, width, height, float(left_entry["config"]["rp"][1])
    )
    right_rays = panorama_rays(
        right_pixels, width, height, float(right_entry["config"]["rp"][1])
    )
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"], dtype=float
    )
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    provider_baseline = right_position - left_position
    translation = provider_to_panorama @ provider_baseline
    translation_unit = translation / np.linalg.norm(translation)
    epipolar = np.abs(np.sum(np.cross(left_rays, right_rays) * translation_unit, axis=1))
    left_depth, right_depth, separation, panorama_points = triangulate(
        left_rays, right_rays, translation
    )
    accepted = (
        np.isfinite(left_depth) & np.isfinite(right_depth)
        & np.all(np.isfinite(panorama_points), axis=1)
        & (epipolar <= args.epipolar_threshold)
        & (left_depth > 0.0) & (right_depth > 0.0)
        & (left_depth <= args.maximum_depth_metres)
        & (right_depth <= args.maximum_depth_metres)
        & (separation <= args.maximum_ray_separation_metres)
    )
    accepted_left = left_pixels[accepted]
    accepted_right = right_pixels[accepted]
    accepted_epipolar = epipolar[accepted]
    accepted_separation = separation[accepted]
    accepted_left_depth = left_depth[accepted]
    accepted_right_depth = right_depth[accepted]
    accepted_matches = [match for match, keep in zip(matches, accepted) if keep]
    accepted_panorama_points = panorama_points[accepted]
    provider_points = left_position + np.einsum(
        "ij,nj->ni", panorama_to_provider, accepted_panorama_points
    )
    if provider_points.shape[0] < 500:
        raise ValueError("Known-pose filters retained too few scene points")
    holdout = deterministic_holdout(accepted_left)
    holdout_pass = bool(
        np.count_nonzero(holdout) >= 100
        and float(np.percentile(accepted_epipolar[holdout], 95)) <= args.epipolar_threshold
        and float(np.percentile(accepted_separation[holdout], 95))
        <= args.maximum_ray_separation_metres
    )

    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_points_metres=provider_points,
        left_pixels=accepted_left,
        right_pixels=accepted_right,
        left_depth_metres=accepted_left_depth,
        right_depth_metres=accepted_right_depth,
        epipolar_residual=accepted_epipolar,
        ray_separation_metres=accepted_separation,
        descriptor_distance=np.asarray([match.distance for match in accepted_matches]),
        holdout=holdout,
    )
    render_points(args.output_png, provider_points)
    stable = {
        "inputs": {
            "manifestSha256": sha256_file(args.manifest),
            "calibrationSha256": sha256_file(args.calibration),
            "leftImageSha256": sha256_file(left_path),
            "rightImageSha256": sha256_file(right_path),
        },
        "seatIds": [args.left_seat_id, args.right_seat_id],
        "parameters": {
            "maximumWidth": args.maximum_width,
            "nfeatures": args.nfeatures,
            "contrastThreshold": args.contrast_threshold,
            "ratioThreshold": args.ratio_threshold,
            "epipolarThreshold": args.epipolar_threshold,
            "maximumDepthMetres": args.maximum_depth_metres,
            "maximumRaySeparationMetres": args.maximum_ray_separation_metres,
            "maximumImageYFraction": args.maximum_image_y_fraction,
        },
        "outputNpzSha256": sha256_file(args.output_npz),
        "outputPngSha256": sha256_file(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "known-pose-current-panorama-scene-v1",
        "artifactStage": "provider-metric-current-panorama-point-cloud",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "manifest": {"path": str(args.manifest), "sha256": stable["inputs"]["manifestSha256"]},
            "calibration": {"path": str(args.calibration), "sha256": stable["inputs"]["calibrationSha256"]},
            "leftImage": {"path": str(left_path), "sha256": stable["inputs"]["leftImageSha256"]},
            "rightImage": {"path": str(right_path), "sha256": stable["inputs"]["rightImageSha256"]},
        },
        "cameraPair": {
            "leftSeatId": args.left_seat_id,
            "rightSeatId": args.right_seat_id,
            "leftProviderPositionMetres": left_position.tolist(),
            "rightProviderPositionMetres": right_position.tolist(),
            "baselineMetres": float(np.linalg.norm(provider_baseline)),
        },
        "parameters": stable["parameters"],
        "features": {
            "leftKeypointCount": len(left_keypoints),
            "rightKeypointCount": len(right_keypoints),
            "mutualRatioMatchCount": len(mutual),
            "overheadCandidateCount": int(left_pixels.shape[0]),
            "acceptedKnownPosePointCount": int(provider_points.shape[0]),
        },
        "knownPoseValidation": {
            "trainingPointCount": int(np.count_nonzero(~holdout)),
            "holdoutPointCount": int(np.count_nonzero(holdout)),
            "trainingEpipolarResidual": values_summary(accepted_epipolar[~holdout]),
            "holdoutEpipolarResidual": values_summary(accepted_epipolar[holdout]),
            "trainingRaySeparationMetres": values_summary(accepted_separation[~holdout]),
            "holdoutRaySeparationMetres": values_summary(accepted_separation[holdout]),
            "passed": holdout_pass,
        },
        "geometry": {
            "providerPointCount": int(provider_points.shape[0]),
            "providerXMetres": values_summary(provider_points[:, 0]),
            "providerYMetres": values_summary(provider_points[:, 1]),
            "providerZMetres": values_summary(provider_points[:, 2]),
            "npzPath": str(args.output_npz),
            "npzSha256": stable["outputNpzSha256"],
        },
        "diagnosticPng": {"path": str(args.output_png), "sha256": stable["outputPngSha256"]},
        "assessment": {
            "knownPoseProviderMetricMeasurementEligible": holdout_pass,
            "publicationEligible": False,
            "blockers": [
                "POINTS_NOT_YET_SEGMENTED_INTO_CLOSED_FASCIA_SURFACES",
                "PROVIDER_FRAME_NOT_YET_REGISTERED_TO_LIDAR_FOR_THIS_TIER",
                "INDEPENDENT_CAMERA_PAIR_HOLDOUT_NOT_YET_COMPARED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_YET_PASSED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "outputNpz": str(args.output_npz),
        "artifactVersion": artifact["artifactVersion"],
        "cameraPair": artifact["cameraPair"],
        "features": artifact["features"],
        "knownPoseValidation": artifact["knownPoseValidation"],
        "measurementEligible": holdout_pass,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

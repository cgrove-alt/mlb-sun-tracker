#!/usr/bin/env python3
"""Extract dense sparse features using independently calibrated camera poses.

The provider camera baseline and cross-validated frame rotation are fixed before
feature matching. A permissive descriptor ratio can therefore be followed by
strict known-pose epipolar, positive-depth, and ray-separation checks without
estimating geometry from the same feature set.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from reconstructPanoramaDenseOverhang import (
    panorama_rays,
    render_plan,
    triangulate,
    values_summary,
)


ANALYSIS_VERSION = "known-pose-overhang-features-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("stereo", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--nfeatures", type=int, default=100_000)
    parser.add_argument("--contrast-threshold", type=float, default=0.004)
    parser.add_argument("--ratio-threshold", type=float, default=0.90)
    parser.add_argument("--matcher", choices=("flann", "brute-force"), default="flann")
    parser.add_argument("--flann-trees", type=int, default=8)
    parser.add_argument("--flann-checks", type=int, default=256)
    parser.add_argument("--epipolar-threshold", type=float, default=0.0005)
    parser.add_argument("--maximum-depth-metres", type=float, default=25.0)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.02)
    parser.add_argument("--maximum-embedded-points", type=int, default=30_000)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def deterministic_holdout(points: np.ndarray) -> np.ndarray:
    return np.asarray([
        int.from_bytes(
            hashlib.sha256(
                f"known-pose-holdout-v1:{point[0]:.3f}:{point[1]:.3f}".encode("utf-8")
            ).digest()[:4],
            "big",
        ) % 5 == 0
        for point in points
    ], dtype=bool)


def main() -> None:
    args = parse_args()
    stereo = json.loads(args.stereo.read_text())
    calibration = json.loads(args.calibration.read_text())
    surface = json.loads(args.surface.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Provider-frame calibration is not measurement eligible")
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside is not measurement eligible")
    manifest_path = Path(stereo["inputs"]["manifest"])
    manifest = json.loads(manifest_path.read_text())
    images = {entry["seatId"]: entry for entry in manifest["images"]}
    left_entry = images[stereo["inputs"]["leftSeatId"]]
    right_entry = images[stereo["inputs"]["rightSeatId"]]
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
    if args.matcher == "flann":
        matcher = cv2.FlannBasedMatcher(
            {"algorithm": 1, "trees": args.flann_trees},
            {"checks": args.flann_checks},
        )
    else:
        matcher = cv2.BFMatcher(cv2.NORM_L2)
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
        match
        for match in forward.values()
        if match.trainIdx in reverse
        and reverse[match.trainIdx].trainIdx == match.queryIdx
    ]
    if len(mutual) < 100:
        raise ValueError("Too few mutual known-pose feature candidates")
    left_pixels = np.asarray([left_keypoints[match.queryIdx].pt for match in mutual])
    right_pixels = np.asarray([right_keypoints[match.trainIdx].pt for match in mutual])
    overhead = (
        ((left_pixels[:, 1] + right_pixels[:, 1]) / 2.0) <= height * 0.55
    )
    left_pixels = left_pixels[overhead]
    right_pixels = right_pixels[overhead]
    selected_matches = [match for match, keep in zip(mutual, overhead) if keep]
    left_yaw = float(left_entry["config"]["rp"][1])
    right_yaw = float(right_entry["config"]["rp"][1])
    left_rays = panorama_rays(left_pixels, width, height, left_yaw)
    right_rays = panorama_rays(right_pixels, width, height, right_yaw)
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"],
        dtype=float,
    )
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    provider_baseline = right_position - left_position
    translation = provider_to_panorama @ provider_baseline
    translation_unit = translation / np.linalg.norm(translation)
    epipolar = np.abs(
        np.sum(np.cross(left_rays, right_rays) * translation_unit, axis=1)
    )
    left_depth, right_depth, separation, panorama_points = triangulate(
        left_rays,
        right_rays,
        translation,
    )
    geometry = (
        np.isfinite(left_depth)
        & np.isfinite(right_depth)
        & np.all(np.isfinite(panorama_points), axis=1)
        & (epipolar <= args.epipolar_threshold)
        & (left_depth > 0)
        & (right_depth > 0)
        & (left_depth <= args.maximum_depth_metres)
        & (right_depth <= args.maximum_depth_metres)
        & (separation <= args.maximum_ray_separation_metres)
    )
    accepted_left = left_pixels[geometry]
    accepted_right = right_pixels[geometry]
    accepted_epipolar = epipolar[geometry]
    accepted_separation = separation[geometry]
    accepted_points = panorama_points[geometry]
    accepted_matches = [match for match, keep in zip(selected_matches, geometry) if keep]
    provider_points = left_position + np.einsum(
        "ij,nj->ni",
        panorama_to_provider,
        accepted_points,
    )
    plane_normal = np.asarray(
        surface["training"]["plane"]["normalProviderLocal"],
        dtype=float,
    )
    plane_offset = float(surface["training"]["plane"]["offsetMetres"])
    plane_residual = np.abs(
        np.einsum("ij,j->i", provider_points, plane_normal) + plane_offset
    )
    underside_plane = plane_residual <= 0.05
    lower_obstruction = (
        (provider_points[:, 1] >= 5.0)
        & (provider_points[:, 1] < 9.2)
        & (provider_points[:, 2] >= 35.0)
        & (provider_points[:, 2] <= 45.0)
    )
    holdout = deterministic_holdout(accepted_left)
    render_plan(args.output_png, provider_points, plane_residual)

    if provider_points.shape[0] > args.maximum_embedded_points:
        keys = np.asarray([
            int.from_bytes(
                hashlib.sha256(
                    f"known-pose-point-v1:{point[0]:.4f}:{point[1]:.4f}:{point[2]:.4f}".encode("utf-8")
                ).digest()[:8],
                "big",
            )
            for point in provider_points
        ], dtype=np.uint64)
        embedded = np.argsort(keys)[:args.maximum_embedded_points]
    else:
        embedded = np.arange(provider_points.shape[0])
    holdout_pass = bool(
        np.count_nonzero(holdout) >= 200
        and float(np.percentile(accepted_epipolar[holdout], 95))
        <= args.epipolar_threshold
        and float(np.percentile(accepted_separation[holdout], 95))
        <= args.maximum_ray_separation_metres
    )
    measurement_eligible = bool(
        holdout_pass
        and provider_points.shape[0] >= 1_000
        and np.count_nonzero(underside_plane) >= 100
    )
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "known-pose-provider-local-overhead-features",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "stereo": {
                "path": str(args.stereo),
                "sha256": file_sha256(args.stereo),
                "artifactVersion": stereo["artifactVersion"],
            },
            "calibration": {
                "path": str(args.calibration),
                "sha256": file_sha256(args.calibration),
                "artifactVersion": calibration["artifactVersion"],
            },
            "surface": {
                "path": str(args.surface),
                "sha256": file_sha256(args.surface),
                "artifactVersion": surface["artifactVersion"],
            },
            "manifest": {
                "path": str(manifest_path),
                "sha256": file_sha256(manifest_path),
            },
            "leftImageSha256": file_sha256(left_path),
            "rightImageSha256": file_sha256(right_path),
        },
        "parameters": {
            "maximumWidth": args.maximum_width,
            "nfeatures": args.nfeatures,
            "contrastThreshold": args.contrast_threshold,
            "ratioThreshold": args.ratio_threshold,
            "matcher": args.matcher,
            "flannTrees": args.flann_trees if args.matcher == "flann" else None,
            "flannChecks": args.flann_checks if args.matcher == "flann" else None,
            "epipolarThreshold": args.epipolar_threshold,
            "maximumDepthMetres": args.maximum_depth_metres,
            "maximumRaySeparationMetres": args.maximum_ray_separation_metres,
            "translationSource": "provider camera baseline transformed by independently held-out frame calibration",
            "holdoutRule": "sha256(known-pose-holdout-v1:left-x:left-y) modulo 5 equals zero",
        },
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
            "providerLocalPointCount": int(provider_points.shape[0]),
            "undersidePlanePointCount": int(np.count_nonzero(underside_plane)),
            "lowerCandidateObstructionPointCount": int(np.count_nonzero(lower_obstruction)),
            "providerXMetres": values_summary(provider_points[:, 0]),
            "providerYMetres": values_summary(provider_points[:, 1]),
            "providerZMetres": values_summary(provider_points[:, 2]),
            "embeddedPoints": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in provider_points[index]],
                    "leftPixel": [round(float(value), 3) for value in accepted_left[index]],
                    "rightPixel": [round(float(value), 3) for value in accepted_right[index]],
                    "descriptorDistance": round(float(accepted_matches[index].distance), 6),
                    "epipolarResidual": round(float(accepted_epipolar[index]), 9),
                    "closestRaySeparationMetres": round(float(accepted_separation[index]), 6),
                    "planeAbsoluteResidualMetres": round(float(plane_residual[index]), 6),
                    "undersidePlaneCandidate": bool(underside_plane[index]),
                    "lowerObstructionCandidate": bool(lower_obstruction[index]),
                }
                for index in embedded
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
        },
        "assessment": {
            "knownPoseProviderLocalMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "KNOWN_POSE_POINTS_NOT_CROSS_VALIDATED_ACROSS_DISJOINT_PANORAMAS",
                "POINTS_NOT_SEGMENTED_INTO_CLOSED_SOLID_VOLUMES",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    stable = dict(artifact)
    stable.pop("artifactVersion")
    artifact["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "acceptedKnownPosePoints": int(provider_points.shape[0]),
        "holdoutPoints": int(np.count_nonzero(holdout)),
        "undersidePlanePoints": int(np.count_nonzero(underside_plane)),
        "lowerObstructionCandidates": int(np.count_nonzero(lower_obstruction)),
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

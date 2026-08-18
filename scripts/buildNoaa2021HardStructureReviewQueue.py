#!/usr/bin/env python3
"""Build reviewable cross-epoch LiDAR hard-structure feature matches."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import laspy
import numpy as np
from PIL import Image, ImageDraw
from pyproj import Transformer
from scipy import ndimage


ANALYSIS_VERSION = "noaa-cross-epoch-hard-structure-review-queue-v3"
CENTER_UTM_METRES = (578294.34, 2851288.13)
HALF_WIDTH_METRES = 175.0
CELL_METRES = 0.25
MINIMUM_Z_METRES = 5.0
MAXIMUM_Z_METRES = 90.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def build_surface(
    path: Path,
    horizontal_epsg: int,
    vertical_unit_metres: float,
    feature_support_mode: str,
    chunk_size: int,
) -> dict[str, Any]:
    if feature_support_mode not in {"classification-6", "all-selected"}:
        raise ValueError(f"Unsupported feature-support mode: {feature_support_mode}")
    if vertical_unit_metres <= 0:
        raise ValueError("Vertical-unit conversion must be positive")
    center_x, center_y = CENTER_UTM_METRES
    size = int(round(2.0 * HALF_WIDTH_METRES / CELL_METRES))
    height = np.full((size, size), -np.inf, dtype=np.float32)
    building_mask = np.zeros((size, size), dtype=bool)
    transformer = (
        None
        if horizontal_epsg == 6346
        else Transformer.from_crs(horizontal_epsg, 6346, always_xy=True)
    )
    total_point_count = 0
    cropped_point_count = 0
    feature_support_point_count = 0
    with laspy.open(path) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None or str(horizontal_epsg) not in source_crs.to_wkt():
            raise ValueError(f"LiDAR CRS does not match EPSG:{horizontal_epsg}: {path}")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            if transformer is not None:
                x, y = transformer.transform(x, y)
                x = np.asarray(x, dtype=np.float64)
                y = np.asarray(y, dtype=np.float64)
            z = np.asarray(points.z, dtype=np.float64) * vertical_unit_metres
            classification = np.asarray(points.classification)
            keep = (
                (np.abs(x - center_x) < HALF_WIDTH_METRES)
                & (np.abs(y - center_y) < HALF_WIDTH_METRES)
                & (z > MINIMUM_Z_METRES)
                & (z < MAXIMUM_Z_METRES)
                & ~np.isin(classification, [7, 18])
            )
            ix = np.floor(
                (x[keep] - center_x + HALF_WIDTH_METRES) / CELL_METRES
            ).astype(np.int32)
            iy = np.floor(
                (y[keep] - center_y + HALF_WIDTH_METRES) / CELL_METRES
            ).astype(np.int32)
            np.maximum.at(height, (iy, ix), z[keep].astype(np.float32))
            feature_support = keep & (
                classification == 6
                if feature_support_mode == "classification-6"
                else True
            )
            feature_x = np.floor(
                (x[feature_support] - center_x + HALF_WIDTH_METRES) / CELL_METRES
            ).astype(np.int32)
            feature_y = np.floor(
                (y[feature_support] - center_y + HALF_WIDTH_METRES) / CELL_METRES
            ).astype(np.int32)
            building_mask[feature_y, feature_x] = True
            total_point_count += int(len(x))
            cropped_point_count += int(np.count_nonzero(keep))
            feature_support_point_count += int(np.count_nonzero(feature_support))
    if not np.any(np.isfinite(height)):
        raise ValueError(f"LiDAR surface selection is empty: {path}")
    height[~np.isfinite(height)] = np.nan
    fill_indices = ndimage.distance_transform_edt(
        ~np.isfinite(height),
        return_distances=False,
        return_indices=True,
    )
    filled = ndimage.gaussian_filter(height[tuple(fill_indices)], 1.0)
    high_pass = filled - ndimage.gaussian_filter(filled, 8.0)
    low, high = np.percentile(high_pass, [2, 98])
    feature_image = np.clip((high_pass - low) / max(high - low, 1e-6) * 255, 0, 255).astype(np.uint8)
    low_z, high_z = np.percentile(filled, [2, 98])
    height_image = np.clip((filled - low_z) / max(high_z - low_z, 1e-6) * 255, 0, 255).astype(np.uint8)

    building_mask = ndimage.binary_dilation(building_mask, iterations=2)
    feature_image[~building_mask] = 0
    return {
        "featureImage": feature_image,
        "heightImage": height_image,
        "buildingMask": (building_mask.astype(np.uint8) * 255),
        "totalPointCount": total_point_count,
        "croppedPointCount": cropped_point_count,
        "buildingPointCount": feature_support_point_count,
    }


def point_record(pixel: np.ndarray) -> dict[str, list[float]]:
    local = [
        float(pixel[0] * CELL_METRES - HALF_WIDTH_METRES),
        float(pixel[1] * CELL_METRES - HALF_WIDTH_METRES),
    ]
    return {
        "pixel": [float(pixel[0]), float(pixel[1])],
        "localMetres": local,
        "utmMetres": [
            CENTER_UTM_METRES[0] + local[0],
            CENTER_UTM_METRES[1] + local[1],
        ],
    }


def render_patch(image: np.ndarray, pixel: np.ndarray, label: str, patch_size: int) -> Image.Image:
    x0 = int(round(float(pixel[0]) - patch_size / 2))
    y0 = int(round(float(pixel[1]) - patch_size / 2))
    crop = np.zeros((patch_size, patch_size), dtype=np.uint8)
    source_x0 = max(0, x0)
    source_y0 = max(0, y0)
    source_x1 = min(image.shape[1], x0 + patch_size)
    source_y1 = min(image.shape[0], y0 + patch_size)
    crop[
        source_y0 - y0:source_y1 - y0,
        source_x0 - x0:source_x1 - x0,
    ] = image[source_y0:source_y1, source_x0:source_x1]
    output = Image.fromarray(np.flipud(crop)).convert("RGB")
    draw = ImageDraw.Draw(output)
    center = patch_size // 2
    draw.line((center - 8, center, center + 8, center), fill="red", width=2)
    draw.line((center, center - 8, center, center + 8), fill="red", width=2)
    draw.text((4, 4), label, fill="yellow")
    return output


def render_review_sheet(
    output: Path,
    candidates: list[dict[str, Any]],
    reference: dict[str, Any],
    comparison: dict[str, Any],
    reference_label: str,
    comparison_label: str,
) -> None:
    patch_size = 180
    label_height = 45
    columns = 4
    sheet = Image.new(
        "RGB",
        (columns * patch_size, len(candidates) * (patch_size + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    for row, candidate in enumerate(candidates):
        reference_pixel = np.asarray(candidate["reference"]["pixel"])
        comparison_pixel = np.asarray(candidate["comparison"]["pixel"])
        patches = (
            (reference["heightImage"], reference_pixel, f"{reference_label} height"),
            (reference["featureImage"], reference_pixel, f"{reference_label} hard structure"),
            (comparison["heightImage"], comparison_pixel, f"{comparison_label} height"),
            (comparison["featureImage"], comparison_pixel, f"{comparison_label} hard structure"),
        )
        for column, (source, pixel, label) in enumerate(patches):
            patch = render_patch(source, pixel, label, patch_size)
            sheet.paste(patch, (column * patch_size, row * (patch_size + label_height)))
        local = candidate["reference"]["localMetres"]
        displacement = candidate["referenceToComparisonDisplacementMetres"]
        draw.text(
            (4, row * (patch_size + label_height) + patch_size + 2),
            (
                f"{candidate['candidateId']} local {local[0]:.1f},{local[1]:.1f} m  "
                f"reference-to-comparison {displacement[0]:.3f},{displacement[1]:.3f} m  "
                f"SIFT {candidate['descriptorDistance']:.1f}"
            ),
            fill="black",
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output)


def main() -> None:
    global CENTER_UTM_METRES, HALF_WIDTH_METRES
    parser = argparse.ArgumentParser()
    parser.add_argument("reference_lidar", type=Path)
    parser.add_argument("comparison_lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--reference-label", default="2018")
    parser.add_argument("--comparison-label", default="2021")
    parser.add_argument("--reference-acquired-on", default="2018-06-05")
    parser.add_argument("--comparison-acquired-on", default="2021-04-10")
    parser.add_argument("--reference-horizontal-epsg", type=int, default=6346)
    parser.add_argument("--comparison-horizontal-epsg", type=int, default=6346)
    parser.add_argument("--reference-vertical-unit-metres", type=float, default=1.0)
    parser.add_argument("--comparison-vertical-unit-metres", type=float, default=1.0)
    parser.add_argument("--center-utm-x", type=float, default=CENTER_UTM_METRES[0])
    parser.add_argument("--center-utm-y", type=float, default=CENTER_UTM_METRES[1])
    parser.add_argument("--half-width-metres", type=float, default=HALF_WIDTH_METRES)
    parser.add_argument("--disable-movable-roof-exclusion", action="store_true")
    parser.add_argument(
        "--reference-feature-support-mode",
        choices=("classification-6", "all-selected"),
        default="classification-6",
    )
    parser.add_argument(
        "--comparison-feature-support-mode",
        choices=("classification-6", "all-selected"),
        default="classification-6",
    )
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    parser.add_argument("--minimum-candidate-count", type=int, default=20)
    parser.add_argument("--maximum-descriptor-ratio", type=float, default=0.70)
    parser.add_argument("--maximum-displacement-metres", type=float, default=1.0)
    parser.add_argument("--minimum-candidate-separation-metres", type=float, default=18.0)
    parser.add_argument("--exclude-queue", type=Path, action="append", default=[])
    parser.add_argument("--minimum-exclusion-distance-metres", type=float, default=0.0)
    parser.add_argument("--candidate-limit", type=int, default=24)
    args = parser.parse_args()
    if args.minimum_candidate_count < 12:
        raise ValueError("At least 12 queue candidates are required for six training and six holdouts")
    if not 0 < args.maximum_descriptor_ratio < 1:
        raise ValueError("Descriptor ratio must be between zero and one")
    if args.maximum_displacement_metres <= 0:
        raise ValueError("Maximum displacement must be positive")
    if args.minimum_candidate_separation_metres <= 0:
        raise ValueError("Minimum candidate separation must be positive")
    if args.exclude_queue and args.minimum_exclusion_distance_metres <= 0:
        raise ValueError("An exclusion distance is required with excluded queues")
    if not args.exclude_queue and args.minimum_exclusion_distance_metres != 0:
        raise ValueError("An exclusion distance requires at least one excluded queue")
    if args.candidate_limit < args.minimum_candidate_count:
        raise ValueError("Candidate limit must be at least the minimum candidate count")
    if args.half_width_metres <= 0:
        raise ValueError("Half width must be positive")

    CENTER_UTM_METRES = (args.center_utm_x, args.center_utm_y)
    HALF_WIDTH_METRES = args.half_width_metres

    excluded_queue_inputs: list[dict[str, Any]] = []
    excluded_reference_points: list[np.ndarray] = []
    for excluded_path in args.exclude_queue:
        excluded_bytes = excluded_path.read_bytes()
        excluded = json.loads(excluded_bytes)
        if excluded.get("artifactKind") != "cross-epoch-hard-structure-control-review-queue":
            raise ValueError(f"Excluded input is not a review queue: {excluded_path}")
        if excluded.get("stadiumId") != "marlins":
            raise ValueError(f"Excluded review queue targets another stadium: {excluded_path}")
        excluded_queue_inputs.append({
            "path": str(excluded_path),
            "sha256": hashlib.sha256(excluded_bytes).hexdigest(),
            "artifactVersion": excluded["artifactVersion"],
            "candidateCount": len(excluded["candidates"]),
        })
        excluded_reference_points.extend(
            np.asarray(candidate["reference"]["utmMetres"], dtype=float)
            for candidate in excluded["candidates"]
        )

    reference = build_surface(
        args.reference_lidar,
        args.reference_horizontal_epsg,
        args.reference_vertical_unit_metres,
        args.reference_feature_support_mode,
        args.chunk_size,
    )
    comparison = build_surface(
        args.comparison_lidar,
        args.comparison_horizontal_epsg,
        args.comparison_vertical_unit_metres,
        args.comparison_feature_support_mode,
        args.chunk_size,
    )
    sift = cv2.SIFT_create(
        nfeatures=20_000,
        contrastThreshold=0.01,
        edgeThreshold=12,
    )
    reference_keypoints, reference_descriptors = sift.detectAndCompute(
        reference["featureImage"],
        reference["buildingMask"],
    )
    comparison_keypoints, comparison_descriptors = sift.detectAndCompute(
        comparison["featureImage"],
        comparison["buildingMask"],
    )
    if reference_descriptors is None or comparison_descriptors is None:
        raise ValueError("No SIFT descriptors were produced")
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    raw_matches = matcher.knnMatch(reference_descriptors, comparison_descriptors, k=2)
    candidates: list[dict[str, Any]] = []
    for best, second in raw_matches:
        ratio = float(best.distance / second.distance)
        if ratio >= args.maximum_descriptor_ratio:
            continue
        reference_pixel = np.asarray(reference_keypoints[best.queryIdx].pt)
        comparison_pixel = np.asarray(comparison_keypoints[best.trainIdx].pt)
        displacement = (comparison_pixel - reference_pixel) * CELL_METRES
        if float(np.linalg.norm(displacement)) > args.maximum_displacement_metres:
            continue
        reference_record = point_record(reference_pixel)
        reference_local = reference_record["localMetres"]
        if (
            not args.disable_movable_roof_exclusion
            and -175.0 < reference_local[0] < 65.0
            and -55.0 < reference_local[1] < 150.0
        ):
            continue
        reference_utm = np.asarray(reference_record["utmMetres"], dtype=float)
        if any(
            np.linalg.norm(reference_utm - excluded_point)
            < args.minimum_exclusion_distance_metres
            for excluded_point in excluded_reference_points
        ):
            continue
        candidates.append({
            "descriptorDistance": float(best.distance),
            "descriptorRatio": ratio,
            "reference": reference_record,
            "comparison": point_record(comparison_pixel),
            "referenceToComparisonDisplacementMetres": displacement.tolist(),
            "referenceKeypointResponse": float(reference_keypoints[best.queryIdx].response),
            "comparisonKeypointResponse": float(comparison_keypoints[best.trainIdx].response),
        })

    distinct: list[dict[str, Any]] = []
    for candidate in sorted(candidates, key=lambda item: item["descriptorDistance"]):
        local = np.asarray(candidate["reference"]["localMetres"])
        if any(
            np.linalg.norm(local - np.asarray(existing["reference"]["localMetres"]))
            < args.minimum_candidate_separation_metres
            for existing in distinct
        ):
            continue
        candidate["candidateId"] = f"hard-structure-{len(distinct):02d}"
        distinct.append(candidate)
        if len(distinct) == args.candidate_limit:
            break
    if len(distinct) < args.minimum_candidate_count:
        raise ValueError(
            f"Fewer than {args.minimum_candidate_count} spatially distinct hard-structure "
            f"candidates survived: {len(candidates)} descriptor matches and "
            f"{len(distinct)} distinct candidates"
        )

    render_review_sheet(
        args.output_png,
        distinct,
        reference,
        comparison,
        args.reference_label,
        args.comparison_label,
    )
    stable = {
        "referenceLidarSha256": sha256_file(args.reference_lidar),
        "comparisonLidarSha256": sha256_file(args.comparison_lidar),
        "referenceLabel": args.reference_label,
        "comparisonLabel": args.comparison_label,
        "referenceAcquiredOn": args.reference_acquired_on,
        "comparisonAcquiredOn": args.comparison_acquired_on,
        "excludedReviewQueues": excluded_queue_inputs,
        "parameters": {
            "centerUtmMetres": list(CENTER_UTM_METRES),
            "halfWidthMetres": HALF_WIDTH_METRES,
            "cellMetres": CELL_METRES,
            "minimumZMetres": MINIMUM_Z_METRES,
            "maximumZMetres": MAXIMUM_Z_METRES,
            "targetHorizontalEpsg": 6346,
            "referenceHorizontalEpsg": args.reference_horizontal_epsg,
            "comparisonHorizontalEpsg": args.comparison_horizontal_epsg,
            "referenceVerticalUnitMetres": args.reference_vertical_unit_metres,
            "comparisonVerticalUnitMetres": args.comparison_vertical_unit_metres,
            "referenceFeatureSupportMode": args.reference_feature_support_mode,
            "comparisonFeatureSupportMode": args.comparison_feature_support_mode,
            "chunkSize": args.chunk_size,
            "minimumCandidateCount": args.minimum_candidate_count,
            "minimumExclusionDistanceMetres": (
                args.minimum_exclusion_distance_metres
            ),
        },
        "candidates": distinct,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "cross-epoch-hard-structure-control-review-queue",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "referenceLidar": {
                "path": str(args.reference_lidar),
                "sha256": stable["referenceLidarSha256"],
                "acquiredOn": args.reference_acquired_on,
            },
            "comparisonLidar": {
                "path": str(args.comparison_lidar),
                "sha256": stable["comparisonLidarSha256"],
                "acquiredOn": args.comparison_acquired_on,
            },
            "excludedReviewQueues": excluded_queue_inputs,
        },
        "parameters": {
            **stable["parameters"],
            "excludedClassificationCodes": [7, 18],
            "featureSupportClassification": (
                6
                if args.reference_feature_support_mode == "classification-6"
                and args.comparison_feature_support_mode == "classification-6"
                else None
            ),
            "maximumDescriptorRatio": args.maximum_descriptor_ratio,
            "maximumNominalDisplacementMetres": args.maximum_displacement_metres,
            "minimumCandidateSeparationMetres": args.minimum_candidate_separation_metres,
            "minimumExclusionDistanceMetres": args.minimum_exclusion_distance_metres,
            "excludedMovableRoofLocalBoundsMetres": (
                None
                if args.disable_movable_roof_exclusion
                else [-175.0, 65.0, -55.0, 150.0]
            ),
            "candidateLimit": args.candidate_limit,
        },
        "keypointCounts": {
            "reference": len(reference_keypoints),
            "comparison": len(comparison_keypoints),
        },
        "pointCounts": {
            "referenceTotal": reference["totalPointCount"],
            "referenceCropped": reference["croppedPointCount"],
            "referenceBuilding": reference["buildingPointCount"],
            "comparisonTotal": comparison["totalPointCount"],
            "comparisonCropped": comparison["croppedPointCount"],
            "comparisonBuilding": comparison["buildingPointCount"],
        },
        "candidates": distinct,
        "reviewSheet": {
            "path": str(args.output_png),
            "sha256": sha256_file(args.output_png),
        },
        "assessment": {
            "manualSemanticReviewRequired": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "HARD_STRUCTURE_FEATURES_NOT_YET_MANUALLY_ACCEPTED",
                "TRAINING_AND_HOLDOUT_PARTITIONS_NOT_YET_LOCKED",
                "LOCAL_REGISTRATION_NOT_YET_AUDITED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(distinct),
        "reviewSheet": artifact["reviewSheet"],
    }, indent=2))


if __name__ == "__main__":
    main()

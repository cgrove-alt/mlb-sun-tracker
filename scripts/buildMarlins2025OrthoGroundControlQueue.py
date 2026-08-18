#!/usr/bin/env python3
"""Build nominal ground controls from 2024 LiDAR intensity and 2025 imagery."""

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
from scipy import ndimage

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2025-orthophoto-2024-lidar-ground-control-queue-v4"
TARGET_EPSG = 6438
CELL_FEET = 1.0
GROUND_CLASSIFICATION = 2
GROUND_COVERAGE_WINDOW_FEET = 21.0
MINIMUM_LOCAL_DIRECT_GROUND_COVERAGE = 0.45


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def horizontal_epsg(crs: Any) -> int | None:
    if crs is None:
        return None
    if crs.is_compound and crs.sub_crs_list:
        return crs.sub_crs_list[0].to_epsg()
    return crs.to_epsg()


def build_ground_intensity(
    path: Path,
    extent: dict[str, float],
    chunk_size: int,
) -> dict[str, Any]:
    width = int(round((extent["xmax"] - extent["xmin"]) / CELL_FEET))
    height = int(round((extent["ymax"] - extent["ymin"]) / CELL_FEET))
    intensity_sum = np.zeros((height, width), dtype=np.float64)
    point_count = np.zeros((height, width), dtype=np.uint32)
    total = 0
    ground = 0
    cropped = 0
    with laspy.open(path) as source:
        if horizontal_epsg(source.header.parse_crs()) != TARGET_EPSG:
            raise ValueError("LiDAR is not in EPSG:6438")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            classification = np.asarray(points.classification)
            intensity = np.asarray(points.intensity, dtype=np.float64)
            is_ground = classification == GROUND_CLASSIFICATION
            keep = (
                is_ground
                & (x >= extent["xmin"])
                & (x < extent["xmax"])
                & (y >= extent["ymin"])
                & (y < extent["ymax"])
            )
            ix = np.floor((x[keep] - extent["xmin"]) / CELL_FEET).astype(np.int32)
            iy = np.floor((y[keep] - extent["ymin"]) / CELL_FEET).astype(np.int32)
            np.add.at(intensity_sum, (iy, ix), intensity[keep])
            np.add.at(point_count, (iy, ix), 1)
            total += len(x)
            ground += int(np.count_nonzero(is_ground))
            cropped += int(np.count_nonzero(keep))
    finite = point_count > 0
    if not np.any(finite):
        raise ValueError("Ground-intensity crop is empty")
    mean = np.zeros_like(intensity_sum, dtype=np.float32)
    mean[finite] = (intensity_sum[finite] / point_count[finite]).astype(np.float32)
    indices = ndimage.distance_transform_edt(
        ~finite,
        return_distances=False,
        return_indices=True,
    )
    filled = ndimage.gaussian_filter(mean[tuple(indices)], 0.8)
    low, high = np.percentile(filled, [1, 99])
    scaled = np.clip((filled - low) / max(high - low, 1e-6), 0, 1)
    image = (scaled * 255).astype(np.uint8)
    high_pass = filled - ndimage.gaussian_filter(filled, 10.0)
    high_limit = float(np.percentile(np.abs(high_pass), 99))
    feature = np.clip(
        high_pass / max(high_limit, 1e-6) * 96 + 128,
        0,
        255,
    ).astype(np.uint8)
    coverage_fraction = ndimage.uniform_filter(
        finite.astype(np.float32),
        size=int(round(GROUND_COVERAGE_WINDOW_FEET / CELL_FEET)),
        mode="constant",
    )
    coverage = (
        coverage_fraction >= MINIMUM_LOCAL_DIRECT_GROUND_COVERAGE
    ).astype(np.uint8) * 255
    return {
        "intensityImage": image,
        "featureImage": feature,
        "coverageMask": coverage,
        "directGroundCoverageFractionImage": coverage_fraction,
        "totalPointCount": total,
        "groundPointCount": ground,
        "groundPointCountInExtent": cropped,
        "finiteCellFractionBeforeFill": float(np.mean(finite)),
        "eligibleGroundControlCellFraction": float(np.mean(coverage > 0)),
    }


def build_orthophoto(
    path: Path,
    native_pixel_feet: float,
    expected_size: list[int],
    coverage_mask: np.ndarray,
) -> dict[str, Any]:
    with Image.open(path) as source:
        if list(source.size) != expected_size:
            raise ValueError("Orthophoto dimensions do not match the manifest")
        scale = native_pixel_feet / CELL_FEET
        target_size = (
            int(round(source.size[0] * scale)),
            int(round(source.size[1] * scale)),
        )
        rgb = source.convert("RGB").resize(target_size, Image.Resampling.BOX)
    rgb_array = np.flipud(np.asarray(rgb))
    gray = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2GRAY)
    gray = cv2.GaussianBlur(gray, (0, 0), 0.8)
    high_pass = gray.astype(np.float32) - ndimage.gaussian_filter(
        gray.astype(np.float32),
        10.0,
    )
    high_limit = float(np.percentile(np.abs(high_pass), 99))
    feature = np.clip(
        high_pass / max(high_limit, 1e-6) * 96 + 128,
        0,
        255,
    ).astype(np.uint8)
    feature[coverage_mask == 0] = 128
    return {
        "rgbImage": rgb_array,
        "grayImage": gray,
        "featureImage": feature,
        "coverageMask": coverage_mask,
    }


def point_record(pixel: np.ndarray, extent: dict[str, float]) -> dict[str, Any]:
    state_plane = [
        float(extent["xmin"] + (pixel[0] + 0.5) * CELL_FEET),
        float(extent["ymin"] + (pixel[1] + 0.5) * CELL_FEET),
    ]
    center = [
        (extent["xmin"] + extent["xmax"]) / 2.0,
        (extent["ymin"] + extent["ymax"]) / 2.0,
    ]
    return {
        "pixel": [float(pixel[0]), float(pixel[1])],
        "localFeet": [state_plane[0] - center[0], state_plane[1] - center[1]],
        "statePlaneFeet": state_plane,
    }


def render_patch(
    image: np.ndarray,
    pixel: np.ndarray,
    label: str,
    patch_size: int,
) -> Image.Image:
    x0 = int(round(float(pixel[0]) - patch_size / 2))
    y0 = int(round(float(pixel[1]) - patch_size / 2))
    shape = (patch_size, patch_size) if image.ndim == 2 else (
        patch_size,
        patch_size,
        image.shape[2],
    )
    crop = np.zeros(shape, dtype=np.uint8)
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
    path: Path,
    candidates: list[dict[str, Any]],
    orthophoto: dict[str, Any],
    lidar: dict[str, Any],
) -> None:
    patch_size = 180
    label_height = 45
    sheet = Image.new(
        "RGB",
        (patch_size * 4, len(candidates) * (patch_size + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    for row, candidate in enumerate(candidates):
        pixel = np.asarray(candidate["orthophoto"]["pixel"])
        panels = (
            (orthophoto["rgbImage"], "2025 orthophoto"),
            (orthophoto["featureImage"], "2025 ortho high-pass"),
            (lidar["intensityImage"], "2024 ground intensity"),
            (lidar["featureImage"], "2024 intensity high-pass"),
        )
        for column, (image, label) in enumerate(panels):
            sheet.paste(
                render_patch(image, pixel, label, patch_size),
                (column * patch_size, row * (patch_size + label_height)),
            )
        local = candidate["orthophoto"]["localFeet"]
        draw.text(
            (4, row * (patch_size + label_height) + patch_size + 2),
            (
                f"{candidate['candidateId']} local {local[0]:.1f},{local[1]:.1f} ft  "
                "same-frame nominal center, offset not yet measured  "
                f"response {candidate['lidarKeypointResponse']:.5f}"
            ),
            fill="black",
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path)


def build_queue(
    orthophoto_audit_path: Path,
    mosaic_manifest_path: Path,
    lidar_path: Path,
    output_png: Path,
    chunk_size: int,
    minimum_candidate_count: int,
    candidate_limit: int,
    minimum_candidate_separation_feet: float,
    sector_grid_size: int,
    maximum_candidates_per_sector: int,
    detector: str,
    minimum_candidate_direct_ground_coverage: float,
    excluded_queue_paths: list[Path],
    minimum_exclusion_distance_feet: float,
) -> dict[str, Any]:
    orthophoto_audit, orthophoto_audit_sha256 = locked_json(orthophoto_audit_path)
    mosaic, mosaic_sha256 = locked_json(mosaic_manifest_path)
    if not orthophoto_audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official orthophoto plan frame is not accepted")
    raster = mosaic["raster"]
    if raster["coordinateReferenceSystem"] != "EPSG:6438":
        raise ValueError("Orthophoto is not in EPSG:6438")
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Orthophoto raster checksum mismatch")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar = build_ground_intensity(lidar_path, extent, chunk_size)
    orthophoto = build_orthophoto(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        lidar["coverageMask"],
    )
    if detector == "sift":
        sift = cv2.SIFT_create(
            nfeatures=40_000,
            contrastThreshold=0.005,
            edgeThreshold=12,
        )
        keypoints, descriptors = sift.detectAndCompute(
            lidar["featureImage"],
            lidar["coverageMask"],
        )
        if descriptors is None:
            raise ValueError("Ground intensity produced no SIFT descriptors")
    elif detector == "harris":
        response_image = cv2.cornerHarris(
            lidar["featureImage"].astype(np.float32),
            blockSize=7,
            ksize=3,
            k=0.04,
        )
        corner_mask = (
            (lidar["coverageMask"] > 0)
            & (
                lidar["directGroundCoverageFractionImage"]
                >= minimum_candidate_direct_ground_coverage
            )
        ).astype(np.uint8) * 255
        corners = cv2.goodFeaturesToTrack(
            lidar["featureImage"],
            maxCorners=40_000,
            qualityLevel=0.001,
            minDistance=5.0,
            mask=corner_mask,
            blockSize=7,
            useHarrisDetector=True,
            k=0.04,
        )
        if corners is None:
            raise ValueError("Ground intensity produced no Harris corners")
        keypoints = []
        for corner in corners[:, 0, :]:
            pixel_x = int(np.clip(round(float(corner[0])), 0, response_image.shape[1] - 1))
            pixel_y = int(np.clip(round(float(corner[1])), 0, response_image.shape[0] - 1))
            keypoint = cv2.KeyPoint(float(corner[0]), float(corner[1]), 7.0)
            keypoint.response = float(response_image[pixel_y, pixel_x])
            keypoints.append(keypoint)
    else:
        raise ValueError(f"Unsupported ground-control detector: {detector}")
    excluded_coordinates: list[np.ndarray] = []
    excluded_inputs = []
    for excluded_path in excluded_queue_paths:
        excluded, excluded_sha256 = locked_json(excluded_path)
        if excluded.get("artifactKind") != (
            "marlins-2025-orthophoto-2024-lidar-ground-control-queue"
        ):
            raise ValueError(f"Excluded input is not a ground-control queue: {excluded_path}")
        if excluded.get("stadiumId") != "marlins":
            raise ValueError(f"Excluded ground-control queue targets another stadium: {excluded_path}")
        excluded_coordinates.extend(
            np.asarray(record["orthophoto"]["statePlaneFeet"], dtype=float)
            for record in excluded["candidates"]
        )
        excluded_inputs.append({
            "path": str(excluded_path),
            "sha256": excluded_sha256,
            "artifactVersion": excluded["artifactVersion"],
            "candidateCount": len(excluded["candidates"]),
        })
    candidates = [{
        "orthophoto": point_record(np.asarray(keypoint.pt), extent),
        "lidar": point_record(np.asarray(keypoint.pt), extent),
        "sameFrameNominalCenter": True,
        "crossSensorOffsetMeasured": False,
        "lidarKeypointResponse": float(keypoint.response),
        "lidarKeypointSizePixels": float(keypoint.size),
        "directGroundCoverageFraction": float(
            lidar["directGroundCoverageFractionImage"][
                int(np.clip(round(keypoint.pt[1]), 0, lidar["featureImage"].shape[0] - 1)),
                int(np.clip(round(keypoint.pt[0]), 0, lidar["featureImage"].shape[1] - 1)),
            ]
        ),
    } for keypoint in keypoints]
    distinct: list[dict[str, Any]] = []
    sector_counts: dict[tuple[int, int], int] = {}
    for candidate in sorted(
        candidates,
        key=lambda item: -item["lidarKeypointResponse"],
    ):
        location = np.asarray(candidate["orthophoto"]["statePlaneFeet"])
        if excluded_coordinates and min(
            float(np.linalg.norm(location - excluded))
            for excluded in excluded_coordinates
        ) < minimum_exclusion_distance_feet:
            continue
        pixel = candidate["orthophoto"]["pixel"]
        sector = (
            min(sector_grid_size - 1, int(pixel[0] / lidar["intensityImage"].shape[1] * sector_grid_size)),
            min(sector_grid_size - 1, int(pixel[1] / lidar["intensityImage"].shape[0] * sector_grid_size)),
        )
        if sector_counts.get(sector, 0) >= maximum_candidates_per_sector:
            continue
        if any(
            np.linalg.norm(
                location - np.asarray(existing["orthophoto"]["statePlaneFeet"])
            ) < minimum_candidate_separation_feet
            for existing in distinct
        ):
            continue
        candidate["candidateId"] = f"ground-control-{len(distinct):02d}"
        candidate["proposalSector"] = [sector[0], sector[1]]
        distinct.append(candidate)
        sector_counts[sector] = sector_counts.get(sector, 0) + 1
        if len(distinct) == candidate_limit:
            break
    if len(distinct) < minimum_candidate_count:
        raise ValueError("Too few spatially distinct ground-control candidates")
    render_review_sheet(output_png, distinct, orthophoto, lidar)
    stable = {
        "orthophotoAuditSha256": orthophoto_audit_sha256,
        "mosaicManifestSha256": mosaic_sha256,
        "lidarSha256": sha256_file(lidar_path),
        "parameters": {
            "targetHorizontalEpsg": TARGET_EPSG,
            "cellFeet": CELL_FEET,
            "groundClassification": GROUND_CLASSIFICATION,
            "groundCoverageWindowFeet": GROUND_COVERAGE_WINDOW_FEET,
            "minimumLocalDirectGroundCoverage": (
                MINIMUM_LOCAL_DIRECT_GROUND_COVERAGE
            ),
            "proposalMode": "same-frame-2024-ground-intensity-keypoints",
            "detector": detector,
            "crossSensorOffsetMeasuredDuringProposal": False,
            "minimumCandidateSeparationFeet": minimum_candidate_separation_feet,
            "sectorGridSize": sector_grid_size,
            "maximumCandidatesPerSector": maximum_candidates_per_sector,
            "minimumCandidateDirectGroundCoverage": (
                minimum_candidate_direct_ground_coverage
            ),
            "minimumExclusionDistanceFeet": minimum_exclusion_distance_feet,
            "minimumCandidateCount": minimum_candidate_count,
            "candidateLimit": candidate_limit,
            "chunkSize": chunk_size,
        },
        "candidates": distinct,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-orthophoto-2024-lidar-ground-control-queue",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "orthophotoAudit": {
                "path": str(orthophoto_audit_path),
                "sha256": orthophoto_audit_sha256,
                "artifactVersion": orthophoto_audit["artifactVersion"],
            },
            "mosaicManifest": {
                "path": str(mosaic_manifest_path),
                "sha256": mosaic_sha256,
                "artifactVersion": mosaic["artifactVersion"],
            },
            "orthophotoRaster": {
                "path": str(raster_path),
                "sha256": raster["sha256"],
            },
            "comparisonLidar": {
                "path": str(lidar_path),
                "sha256": stable["lidarSha256"],
                "acquiredOn": "2024-02-22",
                "coordinateReferenceSystem": "EPSG:6438",
            },
        },
        "parameters": stable["parameters"],
        "extentStatePlaneFeet": extent,
        "sourceAccuracy": {
            "orthophotoHorizontalAccuracy95Feet": orthophoto_audit[
                "accuracyAssessment"
            ]["officialDatasetHorizontalAccuracy95Feet"],
            "independentSurveyedCheckpointCount": orthophoto_audit[
                "sourceMetadata"
            ]["horizontalAccuracy"]["independentSurveyedCheckpointCount"],
            "elevatedFeatureAccuracyUsed": False,
        },
        "keypointCounts": {"lidarGroundIntensity": len(keypoints)},
        "excludedQueues": excluded_inputs,
        "pointCounts": {
            "lidarTotal": lidar["totalPointCount"],
            "lidarGround": lidar["groundPointCount"],
            "lidarGroundInOrthophotoExtent": lidar["groundPointCountInExtent"],
            "finiteOneFootCellFractionBeforeFill": lidar[
                "finiteCellFractionBeforeFill"
            ],
            "eligibleGroundControlCellFraction": lidar[
                "eligibleGroundControlCellFraction"
            ],
        },
        "candidates": distinct,
        "reviewSheet": {
            "path": str(output_png),
            "sha256": sha256_file(output_png),
        },
        "assessment": {
            "manualSemanticReviewRequired": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "STABLE_GROUND_FEATURES_NOT_YET_MANUALLY_ACCEPTED",
                "TRAINING_AND_FINAL_HOLDOUT_PARTITIONS_NOT_YET_LOCKED",
                "SUBPIXEL_GROUND_REGISTRATION_NOT_YET_AUDITED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("orthophoto_audit", type=Path)
    parser.add_argument("mosaic_manifest", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    parser.add_argument("--minimum-candidate-count", type=int, default=24)
    parser.add_argument("--candidate-limit", type=int, default=48)
    parser.add_argument("--minimum-candidate-separation-feet", type=float, default=35.0)
    parser.add_argument("--sector-grid-size", type=int, default=1)
    parser.add_argument("--maximum-candidates-per-sector", type=int, default=10_000)
    parser.add_argument("--detector", choices=("sift", "harris"), default="sift")
    parser.add_argument(
        "--minimum-candidate-direct-ground-coverage",
        type=float,
        default=0.45,
    )
    parser.add_argument("--exclude-queue", action="append", type=Path, default=[])
    parser.add_argument("--minimum-exclusion-distance-feet", type=float, default=0.0)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_queue(
        arguments.orthophoto_audit,
        arguments.mosaic_manifest,
        arguments.lidar,
        arguments.output_png,
        arguments.chunk_size,
        arguments.minimum_candidate_count,
        arguments.candidate_limit,
        arguments.minimum_candidate_separation_feet,
        arguments.sector_grid_size,
        arguments.maximum_candidates_per_sector,
        arguments.detector,
        arguments.minimum_candidate_direct_ground_coverage,
        arguments.exclude_queue,
        arguments.minimum_exclusion_distance_feet,
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(artifact["candidates"]),
        "pointCounts": artifact["pointCounts"],
        "reviewSheet": artifact["reviewSheet"],
    }, indent=2))


if __name__ == "__main__":
    main()

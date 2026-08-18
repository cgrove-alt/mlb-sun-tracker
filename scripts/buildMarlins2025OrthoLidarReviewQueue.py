#!/usr/bin/env python3
"""Build a review queue tying 2024 LiDAR to the official 2025 orthophoto."""

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


ANALYSIS_VERSION = "marlins-2025-orthophoto-2024-lidar-review-queue-v2"
TARGET_EPSG = 6438
CELL_FEET = 1.0
MINIMUM_Z_FEET = 5.0
MAXIMUM_Z_FEET = 250.0
MINIMUM_STRUCTURE_SURFACE_FEET = 18.0
EXCLUDED_ROOF_LOCAL_BOUNDS_FEET = [-574.0, 213.0, -180.0, 492.0]
MINIMUM_CANDIDATE_SEPARATION_FEET = 20.0


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def build_lidar_surface(
    path: Path,
    extent: dict[str, float],
    chunk_size: int,
) -> dict[str, Any]:
    width = int(round((extent["xmax"] - extent["xmin"]) / CELL_FEET))
    height_pixels = int(round((extent["ymax"] - extent["ymin"]) / CELL_FEET))
    height = np.full((height_pixels, width), -np.inf, dtype=np.float32)
    total = 0
    cropped = 0
    with laspy.open(path) as source:
        crs = source.header.parse_crs()
        horizontal_epsg = (
            crs.sub_crs_list[0].to_epsg()
            if crs is not None and crs.is_compound and crs.sub_crs_list
            else crs.to_epsg() if crs is not None else None
        )
        if horizontal_epsg != TARGET_EPSG:
            raise ValueError("LiDAR is not in the locked EPSG:6438 plan frame")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            z = np.asarray(points.z, dtype=np.float64)
            classification = np.asarray(points.classification)
            keep = (
                (x >= extent["xmin"])
                & (x < extent["xmax"])
                & (y >= extent["ymin"])
                & (y < extent["ymax"])
                & (z > MINIMUM_Z_FEET)
                & (z < MAXIMUM_Z_FEET)
                & ~np.isin(classification, [7, 18])
            )
            ix = np.floor((x[keep] - extent["xmin"]) / CELL_FEET).astype(np.int32)
            iy = np.floor((y[keep] - extent["ymin"]) / CELL_FEET).astype(np.int32)
            np.maximum.at(height, (iy, ix), z[keep].astype(np.float32))
            total += len(x)
            cropped += int(np.count_nonzero(keep))
    finite = np.isfinite(height)
    if not np.any(finite):
        raise ValueError("LiDAR crop is empty")
    indices = ndimage.distance_transform_edt(
        ~finite,
        return_distances=False,
        return_indices=True,
    )
    filled = ndimage.gaussian_filter(height[tuple(indices)], 1.0)
    gradient_x = ndimage.sobel(filled, axis=1)
    gradient_y = ndimage.sobel(filled, axis=0)
    gradient = np.hypot(gradient_x, gradient_y)
    gradient_high = float(np.percentile(gradient, 99.5))
    edge = np.clip(gradient / max(gradient_high, 1e-6) * 255, 0, 255).astype(np.uint8)
    structure_mask = filled >= MINIMUM_STRUCTURE_SURFACE_FEET
    structure_mask = ndimage.binary_dilation(structure_mask, iterations=3)
    edge[~structure_mask] = 0
    low_z, high_z = np.percentile(filled, [2, 99])
    height_image = np.clip(
        (filled - low_z) / max(high_z - low_z, 1e-6) * 255,
        0,
        255,
    ).astype(np.uint8)
    return {
        "heightFeet": filled,
        "heightImage": height_image,
        "edgeImage": edge,
        "structureMask": structure_mask.astype(np.uint8) * 255,
        "totalPointCount": total,
        "croppedPointCount": cropped,
        "finiteCellFractionBeforeFill": float(np.mean(finite)),
    }


def build_orthophoto_surface(
    path: Path,
    native_pixel_feet: float,
    expected_size: list[int],
    structure_mask: np.ndarray,
) -> dict[str, Any]:
    with Image.open(path) as source:
        if list(source.size) != expected_size:
            raise ValueError("Orthophoto dimensions do not match the manifest")
        rgb = source.convert("RGB")
        scale = native_pixel_feet / CELL_FEET
        target_size = (
            int(round(source.size[0] * scale)),
            int(round(source.size[1] * scale)),
        )
        rgb = rgb.resize(target_size, Image.Resampling.BOX)
    rgb_array = np.flipud(np.asarray(rgb))
    gray = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2GRAY)
    gray = cv2.GaussianBlur(gray, (0, 0), 1.0)
    edge = cv2.Canny(gray, 20, 70)
    edge = cv2.dilate(edge, np.ones((3, 3), dtype=np.uint8), iterations=1)
    edge[structure_mask == 0] = 0
    return {
        "rgbImage": rgb_array,
        "grayImage": gray,
        "edgeImage": edge,
        "structureMask": structure_mask,
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
    if image.ndim == 2:
        crop = np.zeros((patch_size, patch_size), dtype=np.uint8)
    else:
        crop = np.zeros((patch_size, patch_size, image.shape[2]), dtype=np.uint8)
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
        reference_pixel = np.asarray(candidate["orthophoto"]["pixel"])
        comparison_pixel = np.asarray(candidate["lidar"]["pixel"])
        panels = (
            (orthophoto["rgbImage"], reference_pixel, "2025 orthophoto"),
            (orthophoto["edgeImage"], reference_pixel, "2025 ortho edge"),
            (lidar["heightImage"], comparison_pixel, "2024 LiDAR height"),
            (lidar["edgeImage"], comparison_pixel, "2024 LiDAR edge"),
        )
        for column, (image, pixel, label) in enumerate(panels):
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
                f"LiDAR response {candidate['lidarKeypointResponse']:.5f}"
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
) -> dict[str, Any]:
    orthophoto_audit, orthophoto_audit_sha256 = locked_json(orthophoto_audit_path)
    mosaic, mosaic_sha256 = locked_json(mosaic_manifest_path)
    if not orthophoto_audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official orthophoto plan frame is not accepted")
    if orthophoto_audit["accuracyAssessment"]["roofTopEdgeMetricMeasurementAccepted"]:
        raise ValueError("Queue must not inherit a roof-edge accuracy claim")
    if mosaic.get("artifactKind") != "official-native-orthophoto-mosaic":
        raise ValueError("Mosaic manifest has the wrong kind")
    raster = mosaic["raster"]
    if raster["coordinateReferenceSystem"] != "EPSG:6438":
        raise ValueError("Orthophoto is not in EPSG:6438")
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Orthophoto raster checksum mismatch")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar = build_lidar_surface(lidar_path, extent, chunk_size)
    orthophoto = build_orthophoto_surface(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        lidar["structureMask"],
    )

    sift = cv2.SIFT_create(nfeatures=40_000, contrastThreshold=0.005, edgeThreshold=12)
    reference_keypoints, reference_descriptors = sift.detectAndCompute(
        orthophoto["edgeImage"],
        orthophoto["structureMask"],
    )
    comparison_keypoints, comparison_descriptors = sift.detectAndCompute(
        lidar["edgeImage"],
        lidar["structureMask"],
    )
    if reference_descriptors is None or comparison_descriptors is None:
        raise ValueError("No cross-sensor SIFT descriptors were produced")
    candidates: list[dict[str, Any]] = []
    for keypoint in comparison_keypoints:
        reference_pixel = np.asarray(keypoint.pt)
        comparison_pixel = reference_pixel.copy()
        pixel_x = int(round(float(reference_pixel[0])))
        pixel_y = int(round(float(reference_pixel[1])))
        if not (
            0 <= pixel_x < lidar["heightFeet"].shape[1]
            and 0 <= pixel_y < lidar["heightFeet"].shape[0]
        ):
            continue
        candidate_height_feet = float(lidar["heightFeet"][pixel_y, pixel_x])
        if candidate_height_feet < MINIMUM_STRUCTURE_SURFACE_FEET:
            continue
        reference_record = point_record(reference_pixel, extent)
        local = reference_record["localFeet"]
        if (
            EXCLUDED_ROOF_LOCAL_BOUNDS_FEET[0] < local[0] < EXCLUDED_ROOF_LOCAL_BOUNDS_FEET[1]
            and EXCLUDED_ROOF_LOCAL_BOUNDS_FEET[2] < local[1] < EXCLUDED_ROOF_LOCAL_BOUNDS_FEET[3]
        ):
            continue
        candidates.append({
            "orthophoto": reference_record,
            "lidar": point_record(comparison_pixel, extent),
            "sameFrameNominalCenter": True,
            "crossSensorOffsetMeasured": False,
            "lidarKeypointResponse": float(keypoint.response),
            "lidarKeypointSizePixels": float(keypoint.size),
            "lidarSurfaceHeightFeet": candidate_height_feet,
        })
    distinct: list[dict[str, Any]] = []
    for candidate in sorted(
        candidates,
        key=lambda item: -item["lidarKeypointResponse"],
    ):
        location = np.asarray(candidate["orthophoto"]["statePlaneFeet"])
        if any(
            np.linalg.norm(
                location - np.asarray(existing["orthophoto"]["statePlaneFeet"])
            ) < MINIMUM_CANDIDATE_SEPARATION_FEET
            for existing in distinct
        ):
            continue
        candidate["candidateId"] = f"ortho-lidar-{len(distinct):02d}"
        distinct.append(candidate)
        if len(distinct) == candidate_limit:
            break
    if len(distinct) < minimum_candidate_count:
        raise ValueError(
            f"Only {len(distinct)} distinct candidates survived from "
            f"{len(candidates)} cross-sensor matches"
        )
    render_review_sheet(output_png, distinct, orthophoto, lidar)
    stable = {
        "orthophotoAuditSha256": orthophoto_audit_sha256,
        "mosaicManifestSha256": mosaic_sha256,
        "lidarSha256": sha256_file(lidar_path),
        "parameters": {
            "targetHorizontalEpsg": TARGET_EPSG,
            "cellFeet": CELL_FEET,
            "minimumZFeet": MINIMUM_Z_FEET,
            "maximumZFeet": MAXIMUM_Z_FEET,
            "minimumStructureSurfaceFeet": MINIMUM_STRUCTURE_SURFACE_FEET,
            "excludedRoofLocalBoundsFeet": EXCLUDED_ROOF_LOCAL_BOUNDS_FEET,
            "proposalMode": "same-frame-2024-lidar-structure-keypoints",
            "crossSensorOffsetMeasuredDuringProposal": False,
            "minimumCandidateSeparationFeet": MINIMUM_CANDIDATE_SEPARATION_FEET,
            "minimumCandidateCount": minimum_candidate_count,
            "candidateLimit": candidate_limit,
            "chunkSize": chunk_size,
        },
        "candidates": distinct,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-orthophoto-2024-lidar-review-queue",
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
            "roofEdgeAccuracyInheritedFromDataset": False,
        },
        "keypointCounts": {
            "orthophoto": len(reference_keypoints),
            "lidar": len(comparison_keypoints),
        },
        "pointCounts": {
            "lidarTotal": lidar["totalPointCount"],
            "lidarInOrthophotoExtent": lidar["croppedPointCount"],
            "finiteOneFootCellFractionBeforeFill": lidar[
                "finiteCellFractionBeforeFill"
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
                "CROSS_SENSOR_CONTROLS_NOT_YET_MANUALLY_ACCEPTED",
                "TRAINING_AND_FINAL_HOLDOUT_PARTITIONS_NOT_YET_LOCKED",
                "SUBPIXEL_CROSS_SENSOR_REGISTRATION_NOT_YET_AUDITED",
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
    parser.add_argument("--minimum-candidate-count", type=int, default=12)
    parser.add_argument("--candidate-limit", type=int, default=32)
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
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(artifact["candidates"]),
        "keypointCounts": artifact["keypointCounts"],
        "reviewSheet": artifact["reviewSheet"],
    }, indent=2))


if __name__ == "__main__":
    main()

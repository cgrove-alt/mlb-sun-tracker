#!/usr/bin/env python3
"""Render a georeferenced LiDAR top surface over an orthophoto for review."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import laspy
import numpy as np
from PIL import Image
from pyproj import CRS, Transformer
from scipy import ndimage


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lidar", type=Path, required=True)
    parser.add_argument("--orthophoto", type=Path, required=True)
    parser.add_argument("--orthophoto-manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-lidar", type=Path)
    parser.add_argument("--output-edge-overlay", type=Path)
    parser.add_argument("--output-dsm-npy", type=Path)
    parser.add_argument("--minimum-height-feet", type=float, default=20.0)
    parser.add_argument("--maximum-height-feet", type=float, default=280.0)
    parser.add_argument("--ground-elevation-metres", type=float, required=True)
    parser.add_argument("--alpha", type=float, default=0.58)
    parser.add_argument("--dilation-pixels", type=int, default=1)
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def height_colours(value: np.ndarray) -> np.ndarray:
    stops = np.asarray([
        [13, 32, 66],
        [22, 126, 166],
        [72, 194, 142],
        [246, 213, 75],
        [190, 43, 44],
    ], dtype=np.float64)
    scaled = np.clip(value, 0.0, 1.0) * (len(stops) - 1)
    left = np.floor(scaled).astype(np.int16)
    right = np.minimum(left + 1, len(stops) - 1)
    ratio = scaled - left
    return np.rint(
        stops[left] * (1.0 - ratio[..., None])
        + stops[right] * ratio[..., None]
    ).astype(np.uint8)


def main() -> None:
    arguments = parse_args()
    if not 0.0 < arguments.alpha <= 1.0:
        raise ValueError("alpha must be in the interval (0, 1]")
    if arguments.dilation_pixels < 0:
        raise ValueError("dilation pixels must be nonnegative")

    manifest = json.loads(arguments.orthophoto_manifest.read_text(encoding="utf-8"))
    raster = manifest.get("raster", manifest.get("export"))
    if raster is None:
        raise ValueError("orthophoto manifest has no raster or export record")
    extent = raster["extent"]
    target_crs = CRS.from_user_input(raster["coordinateReferenceSystem"])
    pixel_size_x = float(raster["pixelSizeX"])
    pixel_size_y = float(raster["pixelSizeY"])
    xmin = float(extent["xmin"])
    xmax = float(extent["xmax"])
    ymin = float(extent["ymin"])
    ymax = float(extent["ymax"])

    with Image.open(arguments.orthophoto) as source_image:
        orthophoto = np.asarray(source_image.convert("RGB"))
    height, width = orthophoto.shape[:2]
    expected_width = int(round((xmax - xmin) / pixel_size_x))
    expected_height = int(round((ymax - ymin) / pixel_size_y))
    if (width, height) != (expected_width, expected_height):
        raise ValueError("orthophoto dimensions do not match manifest extent")

    maximum_z = np.full((height, width), -np.inf, dtype=np.float32)
    retained = 0
    with laspy.open(arguments.lidar) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None:
            raise ValueError("LiDAR source has no embedded CRS")
        horizontal_crs = CRS.from_user_input(
            source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
        )
        transformer = Transformer.from_crs(horizontal_crs, target_crs, always_xy=True)
        for points in source.chunk_iterator(1_000_000):
            source_x = np.asarray(points.x)
            source_y = np.asarray(points.y)
            z = np.asarray(points.z)
            target_x, target_y = transformer.transform(source_x, source_y)
            columns = np.floor((target_x - xmin) / pixel_size_x).astype(np.int32)
            rows = np.floor((ymax - target_y) / pixel_size_y).astype(np.int32)
            valid = (
                (columns >= 0)
                & (columns < width)
                & (rows >= 0)
                & (rows < height)
                & np.isfinite(z)
            )
            if not np.any(valid):
                continue
            retained += int(np.count_nonzero(valid))
            flat = rows[valid] * width + columns[valid]
            np.maximum.at(maximum_z.ravel(), flat, z[valid].astype(np.float32))

    relative_height_feet = (maximum_z - arguments.ground_elevation_metres) / 0.3048
    populated = (
        np.isfinite(relative_height_feet)
        & (relative_height_feet >= arguments.minimum_height_feet)
        & (relative_height_feet <= arguments.maximum_height_feet)
    )
    if not np.any(populated):
        raise ValueError("no LiDAR points meet overlay height limits")
    normalized = (
        relative_height_feet - arguments.minimum_height_feet
    ) / (arguments.maximum_height_feet - arguments.minimum_height_feet)
    lidar_rgb = height_colours(normalized)
    mask = populated
    if arguments.dilation_pixels:
        size = arguments.dilation_pixels * 2 + 1
        dilated = ndimage.maximum_filter(mask.astype(np.uint8), size=size).astype(bool)
        nearest_indices = ndimage.distance_transform_edt(
            ~mask, return_distances=False, return_indices=True
        )
        lidar_rgb = lidar_rgb[tuple(nearest_indices)]
        mask = dilated

    result = orthophoto.astype(np.float64)
    result[mask] = (
        result[mask] * (1.0 - arguments.alpha)
        + lidar_rgb[mask].astype(np.float64) * arguments.alpha
    )
    result = np.rint(result).astype(np.uint8)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(result).save(arguments.output, format="PNG", optimize=True)

    additional_outputs = {}
    if arguments.output_dsm_npy:
        arguments.output_dsm_npy.parent.mkdir(parents=True, exist_ok=True)
        np.save(arguments.output_dsm_npy, maximum_z, allow_pickle=False)
        additional_outputs["maximumZMetres"] = {
            "path": str(arguments.output_dsm_npy),
            "sha256": sha256(arguments.output_dsm_npy),
            "shape": [height, width],
            "dtype": str(maximum_z.dtype),
            "missingValue": "negative-infinity",
        }
    if arguments.output_lidar:
        lidar_only = np.full_like(orthophoto, 255)
        lidar_only[mask] = lidar_rgb[mask]
        arguments.output_lidar.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(lidar_only).save(
            arguments.output_lidar, format="PNG", optimize=True
        )
        additional_outputs["lidarOnly"] = {
            "path": str(arguments.output_lidar),
            "sha256": sha256(arguments.output_lidar),
        }
    if arguments.output_edge_overlay:
        edge = mask & ~ndimage.binary_erosion(mask, iterations=2)
        edge_overlay = orthophoto.copy()
        edge_overlay[edge] = (255, 0, 200)
        arguments.output_edge_overlay.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(edge_overlay).save(
            arguments.output_edge_overlay, format="PNG", optimize=True
        )
        additional_outputs["edgeOverlay"] = {
            "path": str(arguments.output_edge_overlay),
            "sha256": sha256(arguments.output_edge_overlay),
            "edgePixelCount": int(np.count_nonzero(edge)),
        }

    diagnostic = {
        "schemaVersion": 1,
        "artifactKind": "lidar-orthophoto-registration-review",
        "source": {
            "lidarPath": str(arguments.lidar),
            "lidarSha256": sha256(arguments.lidar),
            "orthophotoPath": str(arguments.orthophoto),
            "orthophotoSha256": sha256(arguments.orthophoto),
            "orthophotoManifestPath": str(arguments.orthophoto_manifest),
            "orthophotoManifestSha256": sha256(arguments.orthophoto_manifest),
        },
        "parameters": {
            "groundElevationMetres": arguments.ground_elevation_metres,
            "minimumHeightFeet": arguments.minimum_height_feet,
            "maximumHeightFeet": arguments.maximum_height_feet,
            "alpha": arguments.alpha,
            "dilationPixels": arguments.dilation_pixels,
        },
        "diagnostics": {
            "transformedPointCount": retained,
            "populatedSourcePixelCount": int(np.count_nonzero(populated)),
            "renderedPixelCount": int(np.count_nonzero(mask)),
            "coordinateReferenceSystem": target_crs.to_string(),
            "pixelSize": [pixel_size_x, pixel_size_y],
        },
        "output": {
            "path": str(arguments.output),
            "sha256": sha256(arguments.output),
            "dimensionsPixels": [width, height],
        },
        "additionalOutputs": additional_outputs,
        "publication": {
            "eligible": False,
            "reason": "Diagnostic overlay only. Reviewed controls and independent holdouts are required.",
        },
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(
        json.dumps(diagnostic, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "output": str(arguments.output),
        "outputSha256": diagnostic["output"]["sha256"],
        "transformedPointCount": retained,
        "populatedSourcePixelCount": diagnostic["diagnostics"]["populatedSourcePixelCount"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Register a LiDAR ray diagnostic and its retained support on an orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw
from pyproj import Transformer

from castTopSurfaceRowShadows import build_surface_support


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    serialized = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(serialized).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("diagnostic", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("orthophoto_metadata", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--row-crs", default="EPSG:6347")
    parser.add_argument("--local-radius-metres", type=float, default=70.0)
    parser.add_argument("--crop-padding-pixels", type=int, default=180)
    arguments = parser.parse_args()

    diagnostic = json.loads(arguments.diagnostic.read_text(encoding="utf-8"))
    photo_metadata = json.loads(arguments.orthophoto_metadata.read_text(encoding="utf-8"))
    raster_metadata = json.loads(arguments.raster_metadata.read_text(encoding="utf-8"))
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    crossings = [item for item in diagnostic["crossings"] if item["supported"]]
    if not crossings:
        raise ValueError("Diagnostic has no supported crossing")
    crossing = crossings[0]
    component_ids = {int(value) for value in crossing["componentIds"] if int(value) != 0}
    if len(component_ids) != 1:
        raise ValueError("Crossing does not resolve to one retained component")
    component_id = next(iter(component_ids))

    parameters = diagnostic["parameters"]
    cell_metres = float(raster_metadata["grid"]["cellMetres"])
    support, labels, support_summary = build_surface_support(
        dsm,
        cell_metres,
        float(parameters["maximumLocalReliefMetres"]),
        float(parameters["minimumComponentAreaSquareMetres"]),
        float(parameters["erosionMetres"]),
        str(parameters["supportMethod"]),
        float(parameters["maximumLocalMadMetres"]),
        int(parameters["minimumFiniteNeighbors"]),
    )
    grid = raster_metadata["grid"]
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    origin = diagnostic["originEastingNorthingElevationMetres"]
    solar = diagnostic["solarPosition"]
    azimuth = math.radians(float(solar["azimuthDegrees"]))
    hit_distance = float(crossing["distanceMetres"])
    hit = [
        float(origin[0]) + hit_distance * math.sin(azimuth),
        float(origin[1]) + hit_distance * math.cos(azimuth),
    ]

    extent = photo_metadata["imageExtent"]
    image_crs = extent["coordinateReferenceSystem"]
    transformer = Transformer.from_crs(arguments.row_crs, image_crs, always_xy=True)
    image = Image.open(arguments.orthophoto).convert("RGBA")
    if [image.width, image.height] != photo_metadata["imageDimensions"]:
        raise ValueError("Orthophoto dimensions do not match metadata")

    def pixel(easting: float, northing: float) -> tuple[float, float]:
        x_value, y_value = transformer.transform(easting, northing)
        return (
            (x_value - float(extent["xmin"]))
            / (float(extent["xmax"]) - float(extent["xmin"]))
            * image.width,
            (float(extent["ymax"]) - y_value)
            / (float(extent["ymax"]) - float(extent["ymin"]))
            * image.height,
        )

    hit_row = int(math.floor((hit[1] - minimum_y) / cell_metres))
    hit_column = int(math.floor((hit[0] - minimum_x) / cell_metres))
    cell_radius = int(math.ceil(arguments.local_radius_metres / cell_metres))
    row_start = max(0, hit_row - cell_radius)
    row_stop = min(labels.shape[0], hit_row + cell_radius + 1)
    column_start = max(0, hit_column - cell_radius)
    column_stop = min(labels.shape[1], hit_column + cell_radius + 1)
    local_labels = labels[row_start:row_stop, column_start:column_stop]
    component_cells = np.argwhere(local_labels == component_id)
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay, mode="RGBA")
    rendered_cells = 0
    support_pixels: list[tuple[float, float]] = []
    for local_row, local_column in component_cells:
        row = row_start + int(local_row)
        column = column_start + int(local_column)
        easting = minimum_x + (column + 0.5) * cell_metres
        northing = minimum_y + (row + 0.5) * cell_metres
        if math.hypot(easting - hit[0], northing - hit[1]) > arguments.local_radius_metres:
            continue
        pixel_value = pixel(easting, northing)
        support_pixels.append(pixel_value)
        overlay_draw.ellipse(
            (pixel_value[0] - 1.5, pixel_value[1] - 1.5, pixel_value[0] + 1.5, pixel_value[1] + 1.5),
            fill=(0, 210, 120, 95),
        )
        rendered_cells += 1
    annotated = Image.alpha_composite(image, overlay)
    draw = ImageDraw.Draw(annotated, mode="RGBA")
    origin_pixel = pixel(float(origin[0]), float(origin[1]))
    hit_pixel = pixel(hit[0], hit[1])
    beyond = [
        hit[0] + 12.0 * math.sin(azimuth),
        hit[1] + 12.0 * math.cos(azimuth),
    ]
    beyond_pixel = pixel(beyond[0], beyond[1])
    draw.line([origin_pixel, beyond_pixel], fill=(245, 35, 35, 245), width=6)
    draw.ellipse(
        (origin_pixel[0] - 10, origin_pixel[1] - 10, origin_pixel[0] + 10, origin_pixel[1] + 10),
        fill=(245, 35, 35, 255),
        outline=(255, 255, 255, 255),
        width=3,
    )
    draw.ellipse(
        (hit_pixel[0] - 13, hit_pixel[1] - 13, hit_pixel[0] + 13, hit_pixel[1] + 13),
        fill=(255, 210, 0, 255),
        outline=(20, 20, 20, 255),
        width=4,
    )

    relevant_pixels = [origin_pixel, hit_pixel, beyond_pixel] + support_pixels
    crop_left = max(0, int(min(item[0] for item in relevant_pixels)) - arguments.crop_padding_pixels)
    crop_top = max(0, int(min(item[1] for item in relevant_pixels)) - arguments.crop_padding_pixels)
    crop_right = min(image.width, int(max(item[0] for item in relevant_pixels)) + arguments.crop_padding_pixels)
    crop_bottom = min(image.height, int(max(item[1] for item in relevant_pixels)) + arguments.crop_padding_pixels)
    output = annotated.crop((crop_left, crop_top, crop_right, crop_bottom)).convert("RGB")
    arguments.output_png.parent.mkdir(parents=True, exist_ok=True)
    output.save(arguments.output_png, format="PNG", optimize=True)

    stable = {
        "diagnosticSha256": sha256_file(arguments.diagnostic),
        "orthophotoSha256": sha256_file(arguments.orthophoto),
        "orthophotoMetadataSha256": sha256_file(arguments.orthophoto_metadata),
        "rasterMetadataSha256": sha256_file(arguments.raster_metadata),
        "dsmSha256": sha256_file(arguments.dsm_npy),
        "componentId": component_id,
        "originEastingNorthingMetres": origin[:2],
        "hitEastingNorthingMetres": hit,
        "originPixelFullImage": origin_pixel,
        "hitPixelFullImage": hit_pixel,
        "cropBoxPixels": [crop_left, crop_top, crop_right, crop_bottom],
        "renderedSupportCellCount": rendered_cells,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "lidar-ray-orthophoto-registration-diagnostic",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "diagnostic": {"path": str(arguments.diagnostic), "sha256": stable["diagnosticSha256"]},
            "orthophoto": {"path": str(arguments.orthophoto), "sha256": stable["orthophotoSha256"]},
            "orthophotoMetadata": {"path": str(arguments.orthophoto_metadata), "sha256": stable["orthophotoMetadataSha256"]},
            "rasterMetadata": {"path": str(arguments.raster_metadata), "sha256": stable["rasterMetadataSha256"]},
            "dsm": {"path": str(arguments.dsm_npy), "sha256": stable["dsmSha256"]},
        },
        "rowKey": diagnostic["rowKey"],
        "candidateId": diagnostic["candidateId"],
        "componentId": component_id,
        "originEastingNorthingMetres": origin[:2],
        "hitEastingNorthingMetres": hit,
        "hitElevationMetresNavd88": float(crossing["surfaceElevationMetres"]),
        "originPixelFullImage": origin_pixel,
        "hitPixelFullImage": hit_pixel,
        "cropBoxPixels": stable["cropBoxPixels"],
        "renderedSupportCellCount": rendered_cells,
        "surfaceSupport": support_summary,
        "outputPng": str(arguments.output_png),
        "assessment": {
            "publicationEligibleByItself": False,
            "interpretation": "Registration diagnostic only. The intersected surface still requires explicit semantic classification and current-structure verification.",
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputPng": str(arguments.output_png),
        "outputJson": str(arguments.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "componentId": component_id,
        "hitEastingNorthingMetres": hit,
        "renderedSupportCellCount": rendered_cells,
        "cropBoxPixels": stable["cropBoxPixels"],
    }, indent=2))


if __name__ == "__main__":
    main()

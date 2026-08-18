#!/usr/bin/env python3
"""Render georeferenced LiDAR control rasters for stadium registration review."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import laspy
import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Transformer
from scipy.ndimage import distance_transform_edt, gaussian_filter


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fill_nearest(values: np.ndarray) -> np.ndarray:
    missing = ~np.isfinite(values)
    if missing.all():
        raise ValueError("Raster contains no finite values")
    indices = distance_transform_edt(missing, return_distances=False, return_indices=True)
    return values[tuple(indices)]


def axis_metres_per_unit(crs: CRS) -> tuple[float, str]:
    if not crs.axis_info:
        raise ValueError("CRS does not declare a linear axis unit")
    axis = crs.axis_info[0]
    factor = axis.unit_conversion_factor
    if factor is None or not np.isfinite(factor) or factor <= 0:
        raise ValueError("CRS axis lacks a valid conversion to metres")
    return float(factor), str(axis.unit_name or "unknown")


def interpolate_colours(values: np.ndarray, stops: list[tuple[float, tuple[int, int, int]]]) -> np.ndarray:
    clipped = np.clip(values, 0.0, 1.0)
    output = np.empty((*clipped.shape, 3), dtype=np.uint8)
    for channel in range(3):
        output[..., channel] = np.interp(
            clipped,
            [stop[0] for stop in stops],
            [stop[1][channel] for stop in stops],
        ).astype(np.uint8)
    return output


def panel_image(rgb: np.ndarray, title: str, subtitle: str, cross_x: int, cross_y: int) -> Image.Image:
    raster = Image.fromarray(np.flipud(rgb), mode="RGB")
    header = 64
    panel = Image.new("RGB", (raster.width, raster.height + header), "white")
    panel.paste(raster, (0, header))
    draw = ImageDraw.Draw(panel)
    draw.text((12, 10), title, fill="black")
    draw.text((12, 32), subtitle, fill=(70, 70, 70))
    image_y = header + (raster.height - cross_y - 1)
    radius = 8
    draw.line((cross_x - radius, image_y, cross_x + radius, image_y), fill=(255, 0, 200), width=2)
    draw.line((cross_x, image_y - radius, cross_x, image_y + radius), fill=(255, 0, 200), width=2)
    return panel


def overlay_row_polygons(
    panel: Image.Image,
    row_control_path: Path,
    minimum_x: float,
    minimum_y: float,
    rows: int,
    cell_metres: float,
) -> int:
    artifact = json.loads(row_control_path.read_text(encoding="utf-8"))
    if artifact.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Row control is not a georeferenced row-polygon artifact")
    draw = ImageDraw.Draw(panel, mode="RGB")
    rendered = 0
    for feature in artifact["features"]:
        rings = feature.get("geometry", {}).get("rings", [])
        for ring in rings:
            pixels = [
                (
                    (float(point[0]) - minimum_x) / cell_metres,
                    64 + rows - 1 - (float(point[1]) - minimum_y) / cell_metres,
                )
                for point in ring
            ]
            if len(pixels) >= 2:
                draw.line(pixels, fill=(255, 35, 35), width=1, joint="curve")
                rendered += 1
    return rendered


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--latitude", type=float, required=True)
    parser.add_argument("--longitude", type=float, required=True)
    parser.add_argument("--half-width-metres", type=float, default=190.0)
    parser.add_argument("--cell-metres", type=float, default=0.30)
    parser.add_argument("--row-control", type=Path)
    parser.add_argument("--output-dsm-npy", type=Path)
    parser.add_argument("--output-intensity-npy", type=Path)
    parser.add_argument("--allow-nonground-display-reference", action="store_true")
    arguments = parser.parse_args()

    with laspy.open(arguments.lidar) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None:
            raise ValueError("LiDAR source has no embedded CRS")
        horizontal_crs = CRS.from_user_input(
            source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
        )
        vertical_crs = CRS.from_user_input(
            source_crs.sub_crs_list[1] if source_crs.is_compound else source_crs
        )
        horizontal_metres_per_unit, horizontal_unit_name = axis_metres_per_unit(horizontal_crs)
        vertical_metres_per_unit, vertical_unit_name = axis_metres_per_unit(vertical_crs)
        transformer = Transformer.from_crs(CRS.from_epsg(4326), horizontal_crs, always_xy=True)
        center_x_native, center_y_native = transformer.transform(arguments.longitude, arguments.latitude)
        center_x = center_x_native * horizontal_metres_per_unit
        center_y = center_y_native * horizontal_metres_per_unit
        columns = int(np.ceil((2.0 * arguments.half_width_metres) / arguments.cell_metres))
        rows = columns
        maximum_z = np.full((rows, columns), -np.inf, dtype=np.float32)
        intensity_sum = np.zeros((rows, columns), dtype=np.float64)
        intensity_count = np.zeros((rows, columns), dtype=np.uint32)
        point_count = np.zeros((rows, columns), dtype=np.uint32)
        ground_samples = []
        retained_points = 0

        minimum_x = center_x - arguments.half_width_metres
        minimum_y = center_y - arguments.half_width_metres
        for points in source.chunk_iterator(2_000_000):
            x_values = np.asarray(points.x) * horizontal_metres_per_unit
            y_values = np.asarray(points.y) * horizontal_metres_per_unit
            z_values = np.asarray(points.z) * vertical_metres_per_unit
            classifications = np.asarray(points.classification)
            inside = (
                (x_values >= minimum_x)
                & (x_values < minimum_x + columns * arguments.cell_metres)
                & (y_values >= minimum_y)
                & (y_values < minimum_y + rows * arguments.cell_metres)
                & (classifications != 7)
            )
            if not inside.any():
                continue
            cropped_x = x_values[inside]
            cropped_y = y_values[inside]
            cropped_z = z_values[inside]
            cropped_intensity = np.asarray(points.intensity)[inside].astype(np.float64)
            column_indices = ((cropped_x - minimum_x) / arguments.cell_metres).astype(np.int32)
            row_indices = ((cropped_y - minimum_y) / arguments.cell_metres).astype(np.int32)
            flat_indices = row_indices * columns + column_indices
            np.maximum.at(maximum_z.ravel(), flat_indices, cropped_z)
            np.add.at(intensity_sum.ravel(), flat_indices, cropped_intensity)
            np.add.at(intensity_count.ravel(), flat_indices, 1)
            np.add.at(point_count.ravel(), flat_indices, 1)
            retained_points += cropped_z.size
            ground = inside & (classifications == 2)
            if ground.any():
                ground_samples.append(z_values[ground])

    if ground_samples:
        ground_elevation = float(np.median(np.concatenate(ground_samples)))
        elevation_reference_method = "median class 2 ground elevation"
    elif arguments.allow_nonground_display_reference:
        finite_maximum_z = maximum_z[np.isfinite(maximum_z)]
        if finite_maximum_z.size == 0:
            raise ValueError("No finite elevation returns in crop")
        ground_elevation = float(np.percentile(finite_maximum_z, 2))
        elevation_reference_method = (
            "2nd percentile of retained non-noise returns for display only; "
            "not a ground elevation or measurement control"
        )
    else:
        raise ValueError("No class 2 ground points in crop")
    mean_intensity = np.full_like(intensity_sum, np.nan, dtype=np.float64)
    populated = intensity_count > 0
    mean_intensity[populated] = intensity_sum[populated] / intensity_count[populated]
    filled_z = fill_nearest(maximum_z.astype(np.float64))
    filled_intensity = fill_nearest(mean_intensity)
    local_relief = filled_z - gaussian_filter(filled_z, sigma=max(1.0, 4.0 / arguments.cell_metres))

    raster_outputs = {}
    for output_path, values, label in [
        (arguments.output_dsm_npy, maximum_z.astype(np.float32), "dsmMaximumZMetres"),
        (arguments.output_intensity_npy, mean_intensity.astype(np.float32), "meanIntensity"),
    ]:
        if output_path:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            np.save(output_path, values, allow_pickle=False)
            raster_outputs[label] = {
                "path": str(output_path),
                "sha256": file_sha256(output_path),
                "dtype": str(values.dtype),
                "shape": list(values.shape),
            }

    height_normalized = np.clip((filled_z - ground_elevation) / 42.0, 0.0, 1.0)
    height_rgb = interpolate_colours(height_normalized, [
        (0.0, (13, 32, 66)),
        (0.25, (22, 126, 166)),
        (0.5, (72, 194, 142)),
        (0.75, (246, 213, 75)),
        (1.0, (190, 43, 44)),
    ])
    finite_intensity = mean_intensity[np.isfinite(mean_intensity)]
    intensity_limits = np.percentile(finite_intensity, [2, 98])
    intensity_span = max(float(intensity_limits[1] - intensity_limits[0]), 1e-9)
    intensity_normalized = np.clip((filled_intensity - intensity_limits[0]) / intensity_span, 0.0, 1.0)
    intensity_values = (intensity_normalized * 255).astype(np.uint8)
    intensity_rgb = np.repeat(intensity_values[..., None], 3, axis=2)
    relief_limit = float(np.percentile(np.abs(local_relief), 98))
    relief_normalized = (np.clip(local_relief / max(relief_limit, 1e-9), -1.0, 1.0) + 1.0) / 2.0
    relief_rgb = interpolate_colours(relief_normalized, [
        (0.0, (45, 88, 170)),
        (0.5, (245, 245, 245)),
        (1.0, (190, 45, 45)),
    ])
    cross_x = int((center_x - minimum_x) / arguments.cell_metres)
    cross_y = int((center_y - minimum_y) / arguments.cell_metres)
    bounds_subtitle = (
        f"E {minimum_x:.1f} to {minimum_x + columns * arguments.cell_metres:.1f}; "
        f"N {minimum_y:.1f} to {minimum_y + rows * arguments.cell_metres:.1f}; north up"
    )
    panels = [
        panel_image(height_rgb, "DSM height above local ground", "Scale 0 to 42 metres; " + bounds_subtitle, cross_x, cross_y),
        panel_image(intensity_rgb, "Mean return intensity", "Clipped to 2nd and 98th percentiles; " + bounds_subtitle, cross_x, cross_y),
        panel_image(relief_rgb, "Local elevation relief", f"Symmetric limit {relief_limit:.2f} metres; " + bounds_subtitle, cross_x, cross_y),
    ]
    rendered_row_rings = 0
    if arguments.row_control:
        rendered_row_rings = overlay_row_polygons(
            panels[1],
            arguments.row_control,
            minimum_x,
            minimum_y,
            rows,
            arguments.cell_metres,
        )
        overlay_draw = ImageDraw.Draw(panels[1])
        overlay_draw.text((12, 50), "Red: independent 2019 row polygons", fill=(190, 0, 0))
    combined = Image.new("RGB", (sum(panel.width for panel in panels), max(panel.height for panel in panels)), "white")
    x_offset = 0
    for panel in panels:
        combined.paste(panel, (x_offset, 0))
        x_offset += panel.width
    arguments.output_png.parent.mkdir(parents=True, exist_ok=True)
    combined.save(arguments.output_png, format="PNG", optimize=True)

    metadata = {
        "schemaVersion": 1,
        "artifactKind": "lidar-registration-control-raster",
        "source": {
            "path": str(arguments.lidar),
            "sha256": file_sha256(arguments.lidar),
            "coordinateReferenceSystem": source_crs.to_wkt(),
            "horizontalLinearUnit": {
                "name": horizontal_unit_name,
                "metresPerUnit": horizontal_metres_per_unit,
            },
            "verticalLinearUnit": {
                "name": vertical_unit_name,
                "metresPerUnit": vertical_metres_per_unit,
            },
        },
        "grid": {
            "centerLongitude": arguments.longitude,
            "centerLatitude": arguments.latitude,
            "centerProjectedXMetres": center_x,
            "centerProjectedYMetres": center_y,
            "minimumXMetres": minimum_x,
            "minimumYMetres": minimum_y,
            "columns": columns,
            "rows": rows,
            "cellMetres": arguments.cell_metres,
            "groundElevationMetres": ground_elevation,
            "elevationReferenceMethod": elevation_reference_method,
            "retainedPointCount": retained_points,
            "populatedCellCount": int(populated.sum()),
        },
        "rowControl": {
            "path": str(arguments.row_control) if arguments.row_control else None,
            "renderedRingCount": rendered_row_rings,
        },
        "rasterOutputs": raster_outputs,
        "outputPng": str(arguments.output_png),
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                "CONTROL_RASTER_REQUIRES_SEMANTIC_REGISTRATION",
                "AERIAL_LIDAR_HAS_OCCLUDED_SURFACES",
            ],
        },
    }
    stable = json.dumps(metadata, sort_keys=True, separators=(",", ":"))
    metadata["artifactVersion"] = "sha256:" + hashlib.sha256(stable.encode()).hexdigest()
    arguments.output_json.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()

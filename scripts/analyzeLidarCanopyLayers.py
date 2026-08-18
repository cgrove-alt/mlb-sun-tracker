#!/usr/bin/env python3
"""Test whether aerial LiDAR contains defensible canopy underside returns.

The analysis keeps the point cloud three dimensional. It groups returns into
metric grid cells, separates vertically distinct clusters, and tests whether
lower layers persist beneath broad, locally smooth top surfaces. Mixed returns
at roof edges are reported separately because they do not establish an
underside surface or a watertight obstruction volume.

This script produces a measurement artifact and a diagnostic PNG. It never
promotes geometry for publication.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Transformer
from scipy import ndimage


ANALYSIS_VERSION = "lidar-canopy-layer-evidence-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Source LAS or LAZ file")
    parser.add_argument("row_control", type=Path, help="Georeferenced row polygon artifact")
    parser.add_argument("output", type=Path, help="Output measurement JSON")
    parser.add_argument("output_png", type=Path, help="Output diagnostic PNG")
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--cell-metres", type=float, default=1.0)
    parser.add_argument("--margin-metres", type=float, default=35.0)
    parser.add_argument("--minimum-layer-gap-metres", type=float, default=0.75)
    parser.add_argument("--minimum-top-height-metres", type=float, default=8.0)
    parser.add_argument("--smooth-top-range-metres", type=float, default=0.45)
    parser.add_argument("--interior-distance-metres", type=float, default=2.0)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--metadata-url", required=True)
    parser.add_argument("--provider", default="U.S. Geological Survey 3D Elevation Program")
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


def percentile(values: np.ndarray, q: float) -> float | None:
    if values.size == 0:
        return None
    return round(float(np.percentile(values, q)), 4)


def summarize(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 4),
        "median": percentile(finite, 50),
        "p95": percentile(finite, 95),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 4),
    }


def row_control_bounds(row_control: dict[str, Any]) -> tuple[float, float, float, float]:
    coordinates: list[tuple[float, float]] = []
    for feature in row_control.get("features", []):
        for ring in feature.get("geometry", {}).get("rings", []):
            for coordinate in ring:
                if len(coordinate) >= 2:
                    coordinates.append((float(coordinate[0]), float(coordinate[1])))
    if not coordinates:
        raise ValueError("Row control has no polygon coordinates")
    xs = np.asarray([coordinate[0] for coordinate in coordinates])
    ys = np.asarray([coordinate[1] for coordinate in coordinates])
    return float(xs.min()), float(ys.min()), float(xs.max()), float(ys.max())


def rasterize_row_control(
    row_control: dict[str, Any],
    minimum_x: float,
    minimum_y: float,
    columns: int,
    rows: int,
    cell_metres: float,
) -> np.ndarray:
    image = Image.new("1", (columns, rows), 0)
    draw = ImageDraw.Draw(image)
    for feature in row_control.get("features", []):
        for ring in feature.get("geometry", {}).get("rings", []):
            pixels = [
                (
                    (float(coordinate[0]) - minimum_x) / cell_metres,
                    (float(coordinate[1]) - minimum_y) / cell_metres,
                )
                for coordinate in ring
                if len(coordinate) >= 2
            ]
            if len(pixels) >= 3:
                draw.polygon(pixels, fill=1)
    return np.asarray(image, dtype=bool)


def dense_grid_values(
    sorted_cells: np.ndarray,
    sorted_values: np.ndarray,
    unique_cells: np.ndarray,
    starts: np.ndarray,
    counts: np.ndarray,
    total_cells: int,
    minimum_layer_gap_metres: float,
) -> dict[str, np.ndarray]:
    maximum = np.full(total_cells, np.nan, dtype=np.float32)
    minimum = np.full(total_cells, np.nan, dtype=np.float32)
    vertical_span = np.full(total_cells, np.nan, dtype=np.float32)
    largest_gap = np.full(total_cells, np.nan, dtype=np.float32)
    lower_count = np.zeros(total_cells, dtype=np.int32)
    upper_count = np.zeros(total_cells, dtype=np.int32)
    split_height = np.full(total_cells, np.nan, dtype=np.float32)
    return_count = np.zeros(total_cells, dtype=np.int32)

    for cell, start, count in zip(unique_cells, starts, counts):
        cell_values = np.sort(sorted_values[start:start + count])
        cell_index = int(cell)
        return_count[cell_index] = int(count)
        minimum[cell_index] = float(cell_values[0])
        maximum[cell_index] = float(cell_values[-1])
        vertical_span[cell_index] = float(cell_values[-1] - cell_values[0])
        if count < 2:
            continue
        gaps = np.diff(cell_values)
        split_index = int(np.argmax(gaps))
        gap = float(gaps[split_index])
        largest_gap[cell_index] = gap
        if gap < minimum_layer_gap_metres:
            continue
        lower_count[cell_index] = split_index + 1
        upper_count[cell_index] = int(count - split_index - 1)
        split_height[cell_index] = float(
            (cell_values[split_index] + cell_values[split_index + 1]) / 2.0
        )

    return {
        "maximum": maximum,
        "minimum": minimum,
        "verticalSpan": vertical_span,
        "largestGap": largest_gap,
        "lowerCount": lower_count,
        "upperCount": upper_count,
        "splitHeight": split_height,
        "returnCount": return_count,
    }


def source_support(
    cell_indices: np.ndarray,
    z_values: np.ndarray,
    source_ids: np.ndarray,
    return_numbers: np.ndarray,
    gps_times: np.ndarray,
    split_height: np.ndarray,
    strong_cells: np.ndarray,
) -> dict[str, np.ndarray]:
    total_cells = split_height.size
    lower_sources = np.zeros(total_cells, dtype=np.uint8)
    upper_sources = np.zeros(total_cells, dtype=np.uint8)
    same_source_support = np.zeros(total_cells, dtype=bool)
    lower_nonfirst = np.zeros(total_cells, dtype=bool)
    same_pulse_cross_layer = np.zeros(total_cells, dtype=bool)

    selected = strong_cells[cell_indices]
    if not np.any(selected):
        return {
            "lowerSourceCount": lower_sources,
            "upperSourceCount": upper_sources,
            "sameSourceSupport": same_source_support,
            "lowerNonfirstReturn": lower_nonfirst,
            "samePulseCrossLayer": same_pulse_cross_layer,
        }

    chosen_cells = cell_indices[selected]
    chosen_z = z_values[selected]
    chosen_sources = source_ids[selected]
    chosen_returns = return_numbers[selected]
    chosen_times = gps_times[selected]
    lower = chosen_z < split_height[chosen_cells]

    for cell in np.unique(chosen_cells):
        cell_mask = chosen_cells == cell
        lower_mask = cell_mask & lower
        upper_mask = cell_mask & ~lower
        low_sources = np.unique(chosen_sources[lower_mask])
        high_sources = np.unique(chosen_sources[upper_mask])
        lower_sources[cell] = min(255, low_sources.size)
        upper_sources[cell] = min(255, high_sources.size)
        same_source_support[cell] = np.intersect1d(low_sources, high_sources).size > 0
        lower_nonfirst[cell] = np.any(chosen_returns[lower_mask] > 1)
        cell_times = chosen_times[cell_mask]
        cell_z = chosen_z[cell_mask]
        cell_split = split_height[cell]
        for pulse_time in np.unique(cell_times):
            pulse_z = cell_z[cell_times == pulse_time]
            if np.any(pulse_z < cell_split) and np.any(pulse_z >= cell_split):
                same_pulse_cross_layer[cell] = True
                break

    return {
        "lowerSourceCount": lower_sources,
        "upperSourceCount": upper_sources,
        "sameSourceSupport": same_source_support,
        "lowerNonfirstReturn": lower_nonfirst,
        "samePulseCrossLayer": same_pulse_cross_layer,
    }


def render_diagnostic(
    output: Path,
    top_height: np.ndarray,
    row_mask: np.ndarray,
    smooth_high_top: np.ndarray,
    strong_layers: np.ndarray,
    interior_strong_layers: np.ndarray,
) -> None:
    finite = top_height[np.isfinite(top_height)]
    low = float(np.percentile(finite, 2)) if finite.size else 0.0
    high = float(np.percentile(finite, 98)) if finite.size else 1.0
    normalized = np.clip((top_height - low) / max(high - low, 1e-6), 0, 1)
    gray = np.nan_to_num(normalized, nan=0.0)
    image = np.stack([gray, gray, gray], axis=-1)
    image[row_mask] = image[row_mask] * 0.62 + np.array([0.05, 0.2, 0.65])
    image[smooth_high_top] = image[smooth_high_top] * 0.45 + np.array([0.0, 0.55, 0.15])
    image[strong_layers] = np.array([1.0, 0.72, 0.0])
    image[interior_strong_layers] = np.array([1.0, 0.0, 0.18])
    pixels = np.flipud(np.clip(image * 255, 0, 255).astype(np.uint8))
    output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(pixels).save(output)


def main() -> None:
    args = parse_args()
    if args.cell_metres <= 0 or args.margin_metres < 0:
        raise ValueError("Cell size must be positive and margin cannot be negative")
    if args.minimum_layer_gap_metres <= 0:
        raise ValueError("Minimum layer gap must be positive")
    row_control = json.loads(args.row_control.read_text())
    source_bounds = row_control_bounds(row_control)
    minimum_x = source_bounds[0] - args.margin_metres
    minimum_y = source_bounds[1] - args.margin_metres
    maximum_x = source_bounds[2] + args.margin_metres
    maximum_y = source_bounds[3] + args.margin_metres
    columns = int(math.ceil((maximum_x - minimum_x) / args.cell_metres))
    rows = int(math.ceil((maximum_y - minimum_y) / args.cell_metres))
    total_cells = columns * rows
    row_mask = rasterize_row_control(
        row_control,
        minimum_x,
        minimum_y,
        columns,
        rows,
        args.cell_metres,
    )
    distance_to_rows = ndimage.distance_transform_edt(~row_mask) * args.cell_metres
    near_rows = distance_to_rows <= 5.0

    input_hash = file_sha256(args.input)
    row_control_hash = file_sha256(args.row_control)
    x_offset_parts: list[np.ndarray] = []
    y_offset_parts: list[np.ndarray] = []
    z_parts: list[np.ndarray] = []
    ground_parts: list[np.ndarray] = []
    source_parts: list[np.ndarray] = []
    return_number_parts: list[np.ndarray] = []
    number_of_returns_parts: list[np.ndarray] = []
    gps_time_parts: list[np.ndarray] = []

    with laspy.open(args.input) as reader:
        crs_value = reader.header.parse_crs()
        if crs_value is None:
            raise ValueError("Point cloud has no coordinate reference system")
        crs = CRS.from_user_input(crs_value)
        for points in reader.chunk_iterator(1_000_000):
            x = np.asarray(points.x)
            y = np.asarray(points.y)
            classification = np.asarray(points.classification, dtype=np.uint8)
            inside = (
                (x >= minimum_x)
                & (x < maximum_x)
                & (y >= minimum_y)
                & (y < maximum_y)
                & (classification != 7)
            )
            if not np.any(inside):
                continue
            selected_z = np.asarray(points.z)[inside]
            x_offset_parts.append((x[inside] - minimum_x).astype(np.float32))
            y_offset_parts.append((y[inside] - minimum_y).astype(np.float32))
            z_parts.append(selected_z.astype(np.float32))
            selected_classification = classification[inside]
            ground_values = selected_z[selected_classification == 2]
            if ground_values.size:
                ground_parts.append(ground_values.astype(np.float32))
            source_parts.append(
                np.asarray(points.point_source_id, dtype=np.uint16)[inside]
            )
            return_number_parts.append(
                np.asarray(points.return_number, dtype=np.uint8)[inside]
            )
            number_of_returns_parts.append(
                np.asarray(points.number_of_returns, dtype=np.uint8)[inside]
            )
            gps_time_parts.append(np.asarray(points.gps_time)[inside])

    if not x_offset_parts:
        raise ValueError("No non-noise returns intersect the analysis bounds")
    x_offset = np.concatenate(x_offset_parts)
    y_offset = np.concatenate(y_offset_parts)
    z = np.concatenate(z_parts)
    source_ids = np.concatenate(source_parts)
    return_numbers = np.concatenate(return_number_parts)
    number_of_returns = np.concatenate(number_of_returns_parts)
    gps_times = np.concatenate(gps_time_parts)
    if not ground_parts:
        raise ValueError("No class-2 ground returns intersect the analysis bounds")
    ground = np.concatenate(ground_parts)
    del (
        x_offset_parts,
        y_offset_parts,
        z_parts,
        ground_parts,
        source_parts,
        return_number_parts,
        number_of_returns_parts,
        gps_time_parts,
    )
    ground_elevation = float(np.median(ground))
    z_relative = z - ground_elevation

    cell_x = (x_offset / args.cell_metres).astype(np.int64)
    cell_y = (y_offset / args.cell_metres).astype(np.int64)
    cell_indices = cell_y * columns + cell_x
    del x_offset, y_offset, cell_x, cell_y, ground
    order = np.argsort(cell_indices, kind="stable")
    sorted_cells = cell_indices[order]
    sorted_z = z_relative[order]
    unique_cells, starts, counts = np.unique(
        sorted_cells, return_index=True, return_counts=True
    )
    grid_values = dense_grid_values(
        sorted_cells,
        sorted_z,
        unique_cells,
        starts,
        counts,
        total_cells,
        args.minimum_layer_gap_metres,
    )

    top = grid_values["maximum"].reshape(rows, columns)
    populated = np.isfinite(top)
    filled_top = np.where(populated, top, -9999.0)
    local_maximum = ndimage.maximum_filter(filled_top, size=3, mode="nearest")
    local_minimum_source = np.where(populated, top, 9999.0)
    local_minimum = ndimage.minimum_filter(local_minimum_source, size=3, mode="nearest")
    full_neighborhood = ndimage.minimum_filter(populated.astype(np.uint8), size=3) == 1
    smooth_high_top = (
        populated
        & full_neighborhood
        & (top >= args.minimum_top_height_metres)
        & ((local_maximum - local_minimum) <= args.smooth_top_range_metres)
    )

    strong_layer_flat = (
        (grid_values["lowerCount"] >= 2)
        & (grid_values["upperCount"] >= 2)
        & (grid_values["largestGap"] >= args.minimum_layer_gap_metres)
    )
    support = source_support(
        cell_indices,
        z_relative,
        source_ids,
        return_numbers,
        gps_times,
        grid_values["splitHeight"],
        strong_layer_flat,
    )
    repeated_layer_flat = (
        strong_layer_flat
        & support["sameSourceSupport"]
        & support["lowerNonfirstReturn"]
    )
    same_pulse_layer_flat = repeated_layer_flat & support["samePulseCrossLayer"]
    strong_layers = repeated_layer_flat.reshape(rows, columns)

    distance_inside_smooth = ndimage.distance_transform_edt(smooth_high_top) * args.cell_metres
    interior_smooth = distance_inside_smooth >= args.interior_distance_metres
    interior_strong_layers = strong_layers & interior_smooth
    edge_strong_layers = strong_layers & smooth_high_top & ~interior_smooth

    labeled_smooth, component_count = ndimage.label(smooth_high_top)
    component_sizes = np.bincount(labeled_smooth.ravel())
    component_sizes[0] = 0
    broad_component_labels = np.flatnonzero(
        component_sizes * args.cell_metres * args.cell_metres >= 25.0
    )
    broad_smooth_top = np.isin(labeled_smooth, broad_component_labels)
    broad_interior = broad_smooth_top & interior_smooth
    broad_interior_layers = broad_interior & strong_layers
    broad_interior_same_pulse_layers = broad_interior & same_pulse_layer_flat.reshape(rows, columns)
    same_pulse_layers = same_pulse_layer_flat.reshape(rows, columns)
    row_same_pulse_layers = row_mask & same_pulse_layers
    near_row_same_pulse_layers = near_rows & same_pulse_layers
    row_repeated_layers = row_mask & strong_layers
    row_broad_interior_layers = row_mask & broad_interior_layers

    labeled_interior_layers, interior_layer_component_count = ndimage.label(
        broad_interior_layers
    )
    interior_layer_component_sizes = np.bincount(labeled_interior_layers.ravel())
    if interior_layer_component_sizes.size:
        interior_layer_component_sizes[0] = 0
    largest_interior_components = sorted(
        [int(size) for size in interior_layer_component_sizes if size > 0],
        reverse=True,
    )[:20]

    candidate_cells: list[dict[str, Any]] = []
    geographic_transformer = Transformer.from_crs(crs, "EPSG:4326", always_xy=True)
    for row_index, column_index in np.argwhere(broad_interior_layers):
        cell = int(row_index * columns + column_index)
        component_id = int(labeled_interior_layers[row_index, column_index])
        center_x = minimum_x + (float(column_index) + 0.5) * args.cell_metres
        center_y = minimum_y + (float(row_index) + 0.5) * args.cell_metres
        longitude, latitude = geographic_transformer.transform(center_x, center_y)
        candidate_cells.append({
            "componentId": component_id,
            "centerXMetres": round(center_x, 4),
            "centerYMetres": round(center_y, 4),
            "longitude": round(float(longitude), 8),
            "latitude": round(float(latitude), 8),
            "topHeightAboveGroundMetres": round(float(grid_values["maximum"][cell]), 4),
            "bottomHeightAboveGroundMetres": round(float(grid_values["minimum"][cell]), 4),
            "largestGapMetres": round(float(grid_values["largestGap"][cell]), 4),
            "returnCount": int(grid_values["returnCount"][cell]),
            "lowerClusterReturnCount": int(grid_values["lowerCount"][cell]),
            "upperClusterReturnCount": int(grid_values["upperCount"][cell]),
            "lowerPointSourceCount": int(support["lowerSourceCount"][cell]),
            "upperPointSourceCount": int(support["upperSourceCount"][cell]),
            "samePulseCrossLayer": bool(support["samePulseCrossLayer"][cell]),
            "insideRowFootprint": bool(row_mask[row_index, column_index]),
            "distanceToRowFootprintMetres": round(
                float(distance_to_rows[row_index, column_index]), 4
            ),
            "distanceInsideSmoothTopMetres": round(
                float(distance_inside_smooth[row_index, column_index]), 4
            ),
        })

    candidate_components: list[dict[str, Any]] = []
    for component_id in range(1, interior_layer_component_count + 1):
        locations = np.argwhere(labeled_interior_layers == component_id)
        if locations.size == 0:
            continue
        component_rows = locations[:, 0]
        component_columns = locations[:, 1]
        component_cells = component_rows * columns + component_columns
        center_x_values = minimum_x + (component_columns.astype(float) + 0.5) * args.cell_metres
        center_y_values = minimum_y + (component_rows.astype(float) + 0.5) * args.cell_metres
        centroid_x = float(np.mean(center_x_values))
        centroid_y = float(np.mean(center_y_values))
        longitude, latitude = geographic_transformer.transform(centroid_x, centroid_y)
        component_row_mask = row_mask[component_rows, component_columns]
        component_near_row_mask = near_rows[component_rows, component_columns]
        component_same_pulse = same_pulse_layer_flat[component_cells]
        candidate_components.append({
            "componentId": component_id,
            "cellCount": int(locations.shape[0]),
            "areaSquareMetres": round(float(locations.shape[0]) * args.cell_metres ** 2, 4),
            "centroidXMetres": round(centroid_x, 4),
            "centroidYMetres": round(centroid_y, 4),
            "longitude": round(float(longitude), 8),
            "latitude": round(float(latitude), 8),
            "boundsMetres": {
                "minimumX": round(float(np.min(center_x_values) - args.cell_metres / 2.0), 4),
                "minimumY": round(float(np.min(center_y_values) - args.cell_metres / 2.0), 4),
                "maximumX": round(float(np.max(center_x_values) + args.cell_metres / 2.0), 4),
                "maximumY": round(float(np.max(center_y_values) + args.cell_metres / 2.0), 4),
            },
            "topHeightAboveGroundMetres": summarize(grid_values["maximum"][component_cells]),
            "bottomHeightAboveGroundMetres": summarize(grid_values["minimum"][component_cells]),
            "largestGapMetres": summarize(grid_values["largestGap"][component_cells]),
            "insideRowFootprintCellCount": int(np.count_nonzero(component_row_mask)),
            "withinFiveMetresOfRowsCellCount": int(np.count_nonzero(component_near_row_mask)),
            "samePulseCrossLayerCellCount": int(np.count_nonzero(component_same_pulse)),
            "minimumDistanceInsideSmoothTopMetres": round(
                float(np.min(distance_inside_smooth[component_rows, component_columns])),
                4,
            ),
            "maximumDistanceInsideSmoothTopMetres": round(
                float(np.max(distance_inside_smooth[component_rows, component_columns])),
                4,
            ),
        })
    candidate_components.sort(key=lambda component: (-component["cellCount"], component["componentId"]))

    multi_return = number_of_returns > 1
    later_return = return_numbers > 1
    unique_return_pairs, return_pair_counts = np.unique(
        np.stack([return_numbers, number_of_returns], axis=1),
        axis=0,
        return_counts=True,
    )
    return_pair_summary = [
        {
            "returnNumber": int(pair[0]),
            "numberOfReturns": int(pair[1]),
            "count": int(count),
        }
        for pair, count in zip(unique_return_pairs, return_pair_counts)
    ]

    render_diagnostic(
        args.output_png,
        top,
        row_mask,
        broad_smooth_top,
        strong_layers,
        broad_interior_layers,
    )

    parameters = {
        "cellMetres": args.cell_metres,
        "marginMetres": args.margin_metres,
        "minimumLayerGapMetres": args.minimum_layer_gap_metres,
        "minimumTopHeightMetres": args.minimum_top_height_metres,
        "smoothTopRangeMetres": args.smooth_top_range_metres,
        "interiorDistanceMetres": args.interior_distance_metres,
        "minimumClusterReturns": 2,
        "minimumBroadSmoothComponentAreaSquareMetres": 25.0,
    }
    strong_layer_gaps = grid_values["largestGap"][repeated_layer_flat]
    broad_layer_gaps = grid_values["largestGap"][broad_interior_layers.ravel()]
    stable_interior_count = int(np.count_nonzero(broad_interior))
    broad_interior_layer_count = int(np.count_nonzero(broad_interior_layers))
    result: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "canopy-underside-measurement-only",
        "artifactVersion": "sha256:pending",
        "stadiumId": args.stadium_id,
        "analysisInputFingerprintSha256": value_fingerprint({
            "analysisVersion": ANALYSIS_VERSION,
            "inputSha256": input_hash,
            "rowControlSha256": row_control_hash,
            "parameters": parameters,
        }),
        "source": {
            "provider": args.provider,
            "sourceUrl": args.source_url,
            "metadataUrl": args.metadata_url,
            "localFile": str(args.input),
            "localFileSha256": input_hash,
            "coordinateReferenceSystem": crs.to_wkt(),
            "rowControlArtifact": str(args.row_control),
            "rowControlSha256": row_control_hash,
        },
        "parameters": parameters,
        "grid": {
            "minimumXMetres": round(minimum_x, 4),
            "minimumYMetres": round(minimum_y, 4),
            "maximumXMetres": round(maximum_x, 4),
            "maximumYMetres": round(maximum_y, 4),
            "columns": columns,
            "rows": rows,
            "groundElevationMetres": round(ground_elevation, 4),
        },
        "returns": {
            "nonNoiseCount": int(z.size),
            "populatedCellCount": int(np.count_nonzero(populated)),
            "multiReturnPulsePointCount": int(np.count_nonzero(multi_return)),
            "laterReturnPointCount": int(np.count_nonzero(later_return)),
            "pointSourceCounts": {
                str(int(source_id)): int(count)
                for source_id, count in zip(*np.unique(source_ids, return_counts=True))
            },
            "returnNumberByPulseReturnCount": return_pair_summary,
        },
        "layerEvidence": {
            "strongRepeatedLayerCellCount": int(np.count_nonzero(strong_layers)),
            "strongRepeatedLayerGapMetres": summarize(strong_layer_gaps),
            "smoothHighTopCellCount": int(np.count_nonzero(smooth_high_top)),
            "smoothHighTopComponentCount": int(component_count),
            "broadSmoothTopCellCount": int(np.count_nonzero(broad_smooth_top)),
            "broadSmoothTopInteriorCellCount": stable_interior_count,
            "edgeStrongLayerCellCount": int(np.count_nonzero(edge_strong_layers)),
            "broadSmoothTopInteriorStrongLayerCellCount": broad_interior_layer_count,
            "broadSmoothTopInteriorSamePulseLayerCellCount": int(
                np.count_nonzero(broad_interior_same_pulse_layers)
            ),
            "rowFootprintCellCount": int(np.count_nonzero(row_mask)),
            "strongRepeatedLayerCellCountWithinRowFootprints": int(
                np.count_nonzero(row_repeated_layers)
            ),
            "samePulseCrossLayerCellCountWithinRowFootprints": int(
                np.count_nonzero(row_same_pulse_layers)
            ),
            "samePulseCrossLayerCellCountWithinFiveMetresOfRows": int(
                np.count_nonzero(near_row_same_pulse_layers)
            ),
            "broadSmoothTopInteriorStrongLayerCellCountWithinRowFootprints": int(
                np.count_nonzero(row_broad_interior_layers)
            ),
            "broadSmoothTopInteriorStrongLayerPercent": round(
                100.0 * broad_interior_layer_count / max(stable_interior_count, 1), 6
            ),
            "broadInteriorLayerGapMetres": summarize(broad_layer_gaps),
            "broadInteriorLayerConnectedComponentCount": int(interior_layer_component_count),
            "largestBroadInteriorLayerComponentCellCounts": largest_interior_components,
            "broadInteriorCandidateComponents": candidate_components,
            "broadInteriorCandidateCells": candidate_cells,
        },
        "interpretation": {
            "undersideSurfaceEstablished": False,
            "watertightObstructionVolumeEstablished": False,
            "measurementEligible": True,
            "publicationEligible": False,
            "notes": [
                "Repeated vertical layers can indicate roof edges, deck edges, vegetation, or overlapping structures.",
                "A lower return beneath a top return is not by itself an underside surface measurement.",
                "Aerial returns do not prove opaque volume between sparse samples.",
                "Publication requires current semantic roof and underside geometry plus independent shadow holdout validation.",
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
            "legend": {
                "green": "broad locally smooth high top surface",
                "blue": "row control footprint",
                "orange": "repeated vertical layer cell",
                "red": "repeated layer inside broad smooth high top interior",
            },
        },
        "blockers": [
            "CANOPY_UNDERSIDE_SURFACE_NOT_ESTABLISHED",
            "WATERTIGHT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
            "CURRENT_SEMANTIC_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    stable = dict(result)
    stable.pop("artifactVersion")
    result["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n")

    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": result["artifactVersion"],
        "nonNoiseReturns": int(z.size),
        "strongRepeatedLayerCells": int(np.count_nonzero(strong_layers)),
        "broadSmoothTopInteriorCells": stable_interior_count,
        "broadSmoothTopInteriorStrongLayerCells": broad_interior_layer_count,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

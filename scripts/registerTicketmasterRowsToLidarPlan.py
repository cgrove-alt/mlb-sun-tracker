#!/usr/bin/env python3
"""Fit Ticketmaster provider-plan rows to a georeferenced LiDAR surface.

This is a candidate registration diagnostic. It uses regulation field controls
to establish provider-map scale, then fits translation and a small bearing
correction against elevated LiDAR returns. Sections withheld from optimization
measure only cross-section repeatability against the same LiDAR source. They are
not independent surveyed controls and cannot establish publication eligibility.
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
from scipy.ndimage import distance_transform_edt
from scipy.optimize import differential_evolution, minimize


ANALYSIS_VERSION = "ticketmaster-lidar-plan-registration-v3"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def ordered_json_sha256(value: Any) -> str:
    serialized = json.dumps(value, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def linear_unit_to_metres(crs: CRS, label: str) -> float:
    if not crs.axis_info:
        raise ValueError(f"{label} CRS does not expose a linear unit")
    factor = float(crs.axis_info[0].unit_conversion_factor or math.nan)
    if not math.isfinite(factor) or factor <= 0:
        raise ValueError(f"{label} CRS has an invalid linear-unit conversion")
    return factor


def projected_metres_to_native_coordinates(
    x_metres: float,
    y_metres: float,
    native_unit_to_metres: float,
) -> tuple[float, float]:
    if (
        not math.isfinite(x_metres)
        or not math.isfinite(y_metres)
        or not math.isfinite(native_unit_to_metres)
        or native_unit_to_metres <= 0
    ):
        raise ValueError("Projected coordinates and unit conversion must be finite and positive")
    return x_metres / native_unit_to_metres, y_metres / native_unit_to_metres


def stable_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def percentile(values: np.ndarray, quantile: float) -> float | None:
    if values.size == 0:
        return None
    return float(np.percentile(values, quantile))


def provider_to_local_feet(
    provider_positions: np.ndarray,
    home_plate: np.ndarray,
    field_axis: np.ndarray,
    pixels_per_foot: float,
) -> np.ndarray:
    """Return local coordinates ordered as right-field feet, forward feet."""
    delta = provider_positions - home_plate
    right_axis = np.asarray([-field_axis[1], field_axis[0]], dtype=np.float64)
    right_feet = (
        delta[:, 0] * right_axis[0] + delta[:, 1] * right_axis[1]
    ) / pixels_per_foot
    forward_feet = (
        delta[:, 0] * field_axis[0] + delta[:, 1] * field_axis[1]
    ) / pixels_per_foot
    return np.column_stack(
        (
            right_feet,
            forward_feet,
        )
    )


def local_to_world_feet(
    local_positions: np.ndarray,
    bearing_degrees: float,
    home_east_feet: float,
    home_north_feet: float,
) -> np.ndarray:
    bearing = math.radians(bearing_degrees)
    sine = math.sin(bearing)
    cosine = math.cos(bearing)
    right = local_positions[:, 0]
    forward = local_positions[:, 1]
    return np.column_stack(
        (
            home_east_feet + right * cosine + forward * sine,
            home_north_feet - right * sine + forward * cosine,
        )
    )


def validate_inputs(
    rows: dict[str, Any],
    controls: dict[str, Any],
    manifest: dict[str, Any],
    surface_audit: dict[str, Any],
) -> str:
    if rows.get("artifactKind") != "ticketmaster-assigned-row-map-geometry":
        raise ValueError("Rows input is not Ticketmaster assigned-row map geometry")
    if controls.get("artifactKind") != "ticketmaster-regulation-field-control-candidate":
        raise ValueError("Field-control input has the wrong artifact kind")
    if manifest.get("artifactKind") not in {
        "usgs-lidar-project-acquisition",
        "lidar-project-acquisition",
    }:
        raise ValueError("LiDAR manifest has the wrong artifact kind")
    if surface_audit.get("analysisVersion") not in {
        "usgs-stadium-surface-audit-v2",
        "lidar-stadium-surface-audit-v3",
        "lidar-stadium-surface-audit-v4",
    }:
        raise ValueError("Surface audit is not a supported USGS stadium audit")
    row_fingerprint = {
        "acquisitionArtifactVersion": rows.get("acquisition", {}).get("artifactVersion"),
        "rawSha256": rows.get("acquisition", {}).get("rawSha256"),
        "pageFrames": rows.get("pageFrames"),
        "rows": rows.get("rows"),
    }
    if rows.get("artifactVersion") != "sha256:" + ordered_json_sha256(row_fingerprint):
        raise ValueError("Ticketmaster row artifact fingerprint does not reproduce")
    control_fingerprint = {
        "analysisVersion": controls.get("analysisVersion"),
        "stadiumId": controls.get("stadiumId"),
        "svgAcquisitionArtifactVersion": controls.get("source", {}).get(
            "svgAcquisitionArtifactVersion"
        ),
        "svgSha256": controls.get("source", {}).get("svgSha256"),
        "controls": controls.get("controls"),
        "selectedSubpaths": controls.get("selectedSubpaths"),
        "controlSelection": controls.get("controlSelection"),
    }
    if controls.get("artifactVersion") != "sha256:" + ordered_json_sha256(
        control_fingerprint
    ):
        raise ValueError("Field-control artifact fingerprint does not reproduce")
    stadium_ids = {
        rows.get("stadiumId"),
        controls.get("stadiumId"),
        manifest.get("stadiumId"),
        surface_audit.get("stadiumId"),
    }
    if len(stadium_ids) != 1 or None in stadium_ids:
        raise ValueError("Input stadium identifiers do not agree")
    completeness = rows.get("completeness", {})
    if not completeness.get("providerMapInternalCompletenessPassed"):
        raise ValueError("Ticketmaster provider-map coordinates are incomplete")
    if completeness.get("providerMapCoordinateCoveragePercent") != 100:
        raise ValueError("Ticketmaster provider-map coordinate coverage is not 100 percent")
    boundary = controls.get("geometryBoundary", {})
    if not boundary.get("establishesProviderMapScale"):
        raise ValueError("Field controls do not establish provider-map scale")
    if not boundary.get("establishesProviderFieldAxis"):
        raise ValueError("Field controls do not establish a provider field axis")
    if boundary.get("establishesSurveyedWorldCoordinates"):
        raise ValueError("Unexpected claim that provider controls establish world coordinates")
    if not controls.get("validation", {}).get("regulationMoundCheckWithinOneFoot"):
        raise ValueError("Field controls fail the one-foot regulation mound check")
    if manifest.get("projectCoverage", {}).get("coveragePercent") != 100:
        raise ValueError("LiDAR manifest does not cover the complete audit footprint")
    return str(next(iter(stadium_ids)))


def load_lidar_grid(
    manifest: dict[str, Any],
    longitude: float,
    latitude: float,
    half_width_feet: float,
    cell_size_feet: float,
    minimum_surface_height_feet: float,
    maximum_surface_height_feet: float,
    point_source_id: int | None,
) -> dict[str, Any]:
    lidar_paths: list[Path] = []
    lidar_sources: list[dict[str, Any]] = []
    source_crs: CRS | None = None
    horizontal_crs: CRS | None = None
    horizontal_unit_to_metres: float | None = None
    vertical_unit_to_metres: float | None = None
    center_x_metres: float | None = None
    center_y_metres: float | None = None
    columns = int(math.ceil(2 * half_width_feet / cell_size_feet))
    rows = columns
    maximum_z_feet = np.full((rows, columns), -np.inf, dtype=np.float32)
    point_count = np.zeros((rows, columns), dtype=np.uint32)
    ground_parts: list[np.ndarray] = []
    retained_point_count = 0

    for tile in manifest.get("tiles", []):
        lidar_path = Path(tile["path"])
        if not lidar_path.is_file():
            raise FileNotFoundError(lidar_path)
        lidar_sha256 = sha256_file(lidar_path)
        if lidar_sha256 != tile.get("sha256"):
            raise ValueError(f"LiDAR tile hash mismatch: {lidar_path}")
        lidar_paths.append(lidar_path)
        lidar_sources.append({"path": str(lidar_path), "sha256": lidar_sha256})
        with laspy.open(lidar_path) as reader:
            tile_crs = reader.header.parse_crs()
            if tile_crs is None:
                raise ValueError(f"LiDAR tile has no embedded CRS: {lidar_path}")
            tile_crs = CRS.from_user_input(tile_crs)
            if source_crs is None:
                source_crs = tile_crs
                horizontal_crs = CRS.from_user_input(
                    tile_crs.sub_crs_list[0] if tile_crs.is_compound else tile_crs
                )
                horizontal_unit_to_metres = linear_unit_to_metres(
                    horizontal_crs, "Horizontal"
                )
                if tile_crs.is_compound and len(tile_crs.sub_crs_list) > 1:
                    vertical_crs = CRS.from_user_input(tile_crs.sub_crs_list[1])
                    vertical_unit_to_metres = linear_unit_to_metres(vertical_crs, "Vertical")
                elif len(tile_crs.axis_info) >= 3:
                    vertical_unit_to_metres = float(
                        tile_crs.axis_info[2].unit_conversion_factor
                    )
                else:
                    vertical_unit_to_metres = horizontal_unit_to_metres
                transformer = Transformer.from_crs(
                    CRS.from_epsg(4326), horizontal_crs, always_xy=True
                )
                center_x_native, center_y_native = transformer.transform(longitude, latitude)
                center_x_metres = center_x_native * horizontal_unit_to_metres
                center_y_metres = center_y_native * horizontal_unit_to_metres
            elif not tile_crs.equals(source_crs):
                raise ValueError("LiDAR tiles do not share one embedded CRS")

            assert horizontal_unit_to_metres is not None
            assert vertical_unit_to_metres is not None
            assert center_x_metres is not None
            assert center_y_metres is not None
            for points in reader.chunk_iterator(2_000_000):
                x_metres = np.asarray(points.x) * horizontal_unit_to_metres
                y_metres = np.asarray(points.y) * horizontal_unit_to_metres
                classifications = np.asarray(points.classification)
                point_source_ids = np.asarray(points.point_source_id)
                east_feet = (x_metres - center_x_metres) * METRES_TO_FEET
                north_feet = (y_metres - center_y_metres) * METRES_TO_FEET
                inside = (
                    (east_feet >= -half_width_feet)
                    & (east_feet < half_width_feet)
                    & (north_feet >= -half_width_feet)
                    & (north_feet < half_width_feet)
                    & ~np.isin(classifications, [7, 18])
                )
                if point_source_id is not None:
                    inside &= point_source_ids == point_source_id
                if not inside.any():
                    continue
                local_east = east_feet[inside]
                local_north = north_feet[inside]
                local_z_feet = (
                    np.asarray(points.z)[inside]
                    * vertical_unit_to_metres
                    * METRES_TO_FEET
                )
                column_indices = (
                    (local_east + half_width_feet) / cell_size_feet
                ).astype(np.int32)
                row_indices = (
                    (local_north + half_width_feet) / cell_size_feet
                ).astype(np.int32)
                flat_indices = row_indices * columns + column_indices
                np.maximum.at(maximum_z_feet.ravel(), flat_indices, local_z_feet)
                np.add.at(point_count.ravel(), flat_indices, 1)
                retained_point_count += int(local_z_feet.size)
                ground = inside & (classifications == 2)
                if ground.any():
                    ground_parts.append(
                        np.asarray(points.z)[ground]
                        * vertical_unit_to_metres
                        * METRES_TO_FEET
                    )

    if source_crs is None or horizontal_crs is None or not lidar_sources:
        raise ValueError("LiDAR manifest contains no readable tiles")
    if not ground_parts:
        raise ValueError("LiDAR crop contains no class 2 ground points")
    ground_elevation_feet = float(np.median(np.concatenate(ground_parts)))
    relative_height_feet = maximum_z_feet.astype(np.float64) - ground_elevation_feet
    surface_mask = (
        np.isfinite(maximum_z_feet)
        & (relative_height_feet >= minimum_surface_height_feet)
        & (relative_height_feet <= maximum_surface_height_feet)
    )
    if int(surface_mask.sum()) < 50_000:
        raise ValueError("Too few elevated LiDAR cells for provider-plan registration")
    distances_feet, nearest_indices = distance_transform_edt(
        ~surface_mask,
        sampling=cell_size_feet,
        return_indices=True,
    )
    nearest_z_feet = maximum_z_feet[
        nearest_indices[0], nearest_indices[1]
    ].astype(np.float64)
    return {
        "lidarPaths": lidar_paths,
        "lidarSources": lidar_sources,
        "sourceCrs": source_crs,
        "horizontalCrs": horizontal_crs,
        "horizontalUnitToMetres": horizontal_unit_to_metres,
        "verticalUnitToMetres": vertical_unit_to_metres,
        "centerXMetres": center_x_metres,
        "centerYMetres": center_y_metres,
        "columns": columns,
        "rows": rows,
        "halfWidthFeet": half_width_feet,
        "cellSizeFeet": cell_size_feet,
        "maximumZFeet": maximum_z_feet,
        "relativeHeightFeet": relative_height_feet,
        "pointCount": point_count,
        "surfaceMask": surface_mask,
        "distancesFeet": distances_feet,
        "nearestZFeet": nearest_z_feet,
        "groundElevationFeet": ground_elevation_feet,
        "retainedPointCount": retained_point_count,
    }


def sample_grid(
    world_positions: np.ndarray,
    grid: dict[str, Any],
    outside_distance_feet: float,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    columns = np.floor(
        (world_positions[:, 0] + grid["halfWidthFeet"]) / grid["cellSizeFeet"]
    ).astype(np.int64)
    rows = np.floor(
        (world_positions[:, 1] + grid["halfWidthFeet"]) / grid["cellSizeFeet"]
    ).astype(np.int64)
    inside = (
        (columns >= 0)
        & (columns < grid["columns"])
        & (rows >= 0)
        & (rows < grid["rows"])
    )
    distances = np.full(world_positions.shape[0], outside_distance_feet, dtype=np.float64)
    heights = np.full(world_positions.shape[0], np.nan, dtype=np.float64)
    if inside.any():
        distances[inside] = grid["distancesFeet"][rows[inside], columns[inside]]
        heights[inside] = grid["nearestZFeet"][rows[inside], columns[inside]]
    return distances, heights, inside


def sample_source_cell_values(
    world_positions: np.ndarray,
    grid: dict[str, Any],
    values: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    columns = np.floor(
        (world_positions[:, 0] + grid["halfWidthFeet"]) / grid["cellSizeFeet"]
    ).astype(np.int64)
    rows = np.floor(
        (world_positions[:, 1] + grid["halfWidthFeet"]) / grid["cellSizeFeet"]
    ).astype(np.int64)
    inside = (
        (columns >= 0)
        & (columns < grid["columns"])
        & (rows >= 0)
        & (rows < grid["rows"])
    )
    sampled = np.full(world_positions.shape[0], np.nan, dtype=np.float64)
    if inside.any():
        sampled[inside] = values[rows[inside], columns[inside]]
    return sampled, inside


def summarize_fit(
    local_anchors: np.ndarray,
    row_indices: np.ndarray,
    parameters: np.ndarray,
    grid: dict[str, Any],
) -> dict[str, Any]:
    bearing_degrees, home_east, home_north = parameters
    world = local_to_world_feet(
        local_anchors,
        float(bearing_degrees),
        float(home_east),
        float(home_north),
    )
    distances, heights, inside = sample_grid(world, grid, outside_distance_feet=50.0)
    heights[distances > 3.0] = np.nan
    unique_rows, inverse = np.unique(row_indices, return_inverse=True)
    row_spreads: list[float] = []
    for index in range(unique_rows.size):
        row_heights = heights[inverse == index]
        row_heights = row_heights[np.isfinite(row_heights)]
        if row_heights.size >= 2:
            row_spreads.append(float(np.max(row_heights) - np.min(row_heights)))
    spreads = np.asarray(row_spreads, dtype=np.float64)
    return {
        "anchorCount": int(local_anchors.shape[0]),
        "rowCount": int(unique_rows.size),
        "insideRasterPercent": float(np.mean(inside) * 100),
        "surfaceDistanceFeet": {
            "median": percentile(distances, 50),
            "p90": percentile(distances, 90),
            "p95": percentile(distances, 95),
            "maximum": float(np.max(distances)),
            "withinOneFootPercent": float(np.mean(distances <= 1.0) * 100),
            "withinTwoFeetPercent": float(np.mean(distances <= 2.0) * 100),
        },
        "nearestSurfaceHeightSpreadWithinRowFeet": {
            "evaluatedRows": int(spreads.size),
            "median": percentile(spreads, 50),
            "p95": percentile(spreads, 95),
        },
    }


def render_diagnostic(
    output_path: Path,
    grid: dict[str, Any],
    all_world_anchors: np.ndarray,
    all_holdout_flags: np.ndarray,
    all_registration_flags: np.ndarray,
    home_position: np.ndarray,
) -> None:
    target_size = 1200
    finite = np.isfinite(grid["relativeHeightFeet"])
    values = np.zeros_like(grid["relativeHeightFeet"], dtype=np.float64)
    values[finite] = np.clip(grid["relativeHeightFeet"][finite] / 160.0, 0.0, 1.0)
    rgb = np.zeros((*values.shape, 3), dtype=np.uint8)
    rgb[..., 0] = (18 + values * 220).astype(np.uint8)
    rgb[..., 1] = (28 + values * 190).astype(np.uint8)
    rgb[..., 2] = (52 + values * 80).astype(np.uint8)
    rgb[~finite] = [246, 247, 249]
    base = Image.fromarray(np.flipud(rgb))
    base.thumbnail((target_size, target_size), Image.Resampling.LANCZOS)
    scale_x = base.width / grid["columns"]
    scale_y = base.height / grid["rows"]
    draw = ImageDraw.Draw(base)

    def pixel(position: np.ndarray) -> tuple[float, float]:
        column = (position[0] + grid["halfWidthFeet"]) / grid["cellSizeFeet"]
        row = (position[1] + grid["halfWidthFeet"]) / grid["cellSizeFeet"]
        return column * scale_x, base.height - row * scale_y

    for position, holdout, registered in zip(
        all_world_anchors,
        all_holdout_flags,
        all_registration_flags,
    ):
        x_value, y_value = pixel(position)
        colour = (125, 125, 125) if not registered else (
            (255, 170, 0) if holdout else (255, 30, 190)
        )
        draw.ellipse(
            (x_value - 0.7, y_value - 0.7, x_value + 0.7, y_value + 0.7),
            fill=colour,
        )
    home_x, home_y = pixel(home_position)
    draw.line((home_x - 7, home_y, home_x + 7, home_y), fill=(0, 255, 255), width=2)
    draw.line((home_x, home_y - 7, home_x, home_y + 7), fill=(0, 255, 255), width=2)
    draw.rectangle((8, 8, 390, 62), fill=(255, 255, 255), outline=(0, 0, 0))
    draw.text((16, 15), "Magenta: fit sections; orange: held-out sections", fill=(0, 0, 0))
    draw.text((16, 37), "Cyan cross: fitted home plate; north is up", fill=(0, 0, 0))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    base.save(output_path, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=Path, required=True)
    parser.add_argument("--field-controls", type=Path, required=True)
    parser.add_argument("--lidar-manifest", type=Path, required=True)
    parser.add_argument("--surface-audit", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--output-png", type=Path)
    parser.add_argument("--latitude", type=float, required=True)
    parser.add_argument("--longitude", type=float, required=True)
    parser.add_argument("--expected-center-field-bearing", type=float, required=True)
    parser.add_argument("--maximum-bearing-adjustment", type=float, default=5.0)
    parser.add_argument("--translation-bound-feet", type=float, default=380.0)
    parser.add_argument("--half-width-feet", type=float, default=760.0)
    parser.add_argument("--cell-size-feet", type=float, default=1.0)
    parser.add_argument("--minimum-surface-height-feet", type=float, default=1.5)
    parser.add_argument("--maximum-surface-height-feet", type=float, default=220.0)
    parser.add_argument("--point-source-id", type=int)
    parser.add_argument("--initial-registration", type=Path)
    parser.add_argument("--maximum-observable-top-height-feet", type=float)
    parser.add_argument("--local-bearing-window-degrees", type=float, default=1.0)
    parser.add_argument("--local-translation-window-feet", type=float, default=25.0)
    arguments = parser.parse_args()
    if arguments.maximum_bearing_adjustment <= 0:
        raise ValueError("Maximum bearing adjustment must be positive")
    if arguments.translation_bound_feet <= 0 or arguments.half_width_feet <= 0:
        raise ValueError("Translation and raster bounds must be positive")
    if arguments.cell_size_feet <= 0:
        raise ValueError("Cell size must be positive")
    if arguments.local_bearing_window_degrees <= 0:
        raise ValueError("Local bearing window must be positive")
    if arguments.local_translation_window_feet <= 0:
        raise ValueError("Local translation window must be positive")
    if (
        arguments.maximum_observable_top_height_feet is not None
        and arguments.maximum_observable_top_height_feet <= 0
    ):
        raise ValueError("Maximum observable top height must be positive")
    if (
        arguments.maximum_observable_top_height_feet is not None
        and arguments.initial_registration is None
    ):
        raise ValueError("Observable-top masking requires an initial registration")

    rows_bytes = arguments.rows.read_bytes()
    controls_bytes = arguments.field_controls.read_bytes()
    manifest_bytes = arguments.lidar_manifest.read_bytes()
    surface_audit_bytes = arguments.surface_audit.read_bytes()
    rows = json.loads(rows_bytes)
    controls = json.loads(controls_bytes)
    manifest = json.loads(manifest_bytes)
    surface_audit = json.loads(surface_audit_bytes)
    stadium_id = validate_inputs(rows, controls, manifest, surface_audit)
    initial_registration = None
    initial_registration_bytes = None
    if arguments.initial_registration:
        initial_registration_bytes = arguments.initial_registration.read_bytes()
        initial_registration = json.loads(initial_registration_bytes)
        if initial_registration.get("artifactKind") != (
            "ticketmaster-row-to-lidar-plan-registration-candidate"
        ):
            raise ValueError("Initial registration has the wrong artifact kind")
        if initial_registration.get("stadiumId") != stadium_id:
            raise ValueError("Initial registration stadium does not match")
        initial_inputs = initial_registration.get("inputs", {})
        if initial_inputs.get("rowArtifactVersion") != rows.get("artifactVersion"):
            raise ValueError("Initial registration uses different provider rows")
        if initial_inputs.get("fieldControlArtifactVersion") != controls.get(
            "artifactVersion"
        ):
            raise ValueError("Initial registration uses different field controls")
        if initial_inputs.get("lidarManifestArtifactVersion") != manifest.get(
            "artifactVersion"
        ):
            raise ValueError("Initial registration uses a different LiDAR manifest")
        if initial_registration.get("settings", {}).get("pointSourceId") is not None:
            raise ValueError("Initial registration must use the combined LiDAR source")

    controls_value = controls["controls"]
    home_plate = np.asarray(controls_value["homePlateProviderPixels"], dtype=np.float64)
    field_axis = np.asarray(controls_value["providerFieldAxisUnitVector"], dtype=np.float64)
    field_axis /= np.linalg.norm(field_axis)
    pixels_per_foot = float(controls_value["providerPixelsPerFoot"])
    if not math.isfinite(pixels_per_foot) or pixels_per_foot <= 0:
        raise ValueError("Provider pixels per foot is invalid")

    row_records = rows.get("rows", [])
    if not row_records:
        raise ValueError("Ticketmaster row artifact contains no rows")
    section_ids: list[str] = []
    row_keys: list[str] = []
    anchor_provider_parts: list[np.ndarray] = []
    anchor_row_indices: list[int] = []
    seat_local_parts: list[np.ndarray] = []
    for row_index, row in enumerate(row_records):
        seats = row.get("seats", [])
        if not seats:
            raise ValueError(f"Row contains no seats: {row.get('rowKey')}")
        provider_positions = np.asarray(
            [seat["positionProviderPixels"] for seat in seats], dtype=np.float64
        )
        seat_local = provider_to_local_feet(
            provider_positions,
            home_plate,
            field_axis,
            pixels_per_foot,
        )
        seat_local_parts.append(seat_local)
        anchor_indices = sorted(set([0, len(seats) // 2, len(seats) - 1]))
        anchor_provider_parts.append(provider_positions[anchor_indices])
        anchor_row_indices.extend([row_index] * len(anchor_indices))
        section_ids.append(str(row.get("sectionName") or row.get("sectionNodeId")))
        row_keys.append(str(row["rowKey"]))
    all_anchor_provider = np.concatenate(anchor_provider_parts)
    all_anchor_local = provider_to_local_feet(
        all_anchor_provider,
        home_plate,
        field_axis,
        pixels_per_foot,
    )
    anchor_row_indices_array = np.asarray(anchor_row_indices, dtype=np.int32)
    row_holdout = np.asarray([stable_holdout(section) for section in section_ids])
    if not row_holdout.any() or row_holdout.all():
        raise ValueError("Deterministic section split lacks fit or held-out rows")
    anchor_holdout = row_holdout[anchor_row_indices_array]

    grid = load_lidar_grid(
        manifest,
        arguments.longitude,
        arguments.latitude,
        arguments.half_width_feet,
        arguments.cell_size_feet,
        arguments.minimum_surface_height_feet,
        arguments.maximum_surface_height_feet,
        arguments.point_source_id,
    )
    registration_row_mask = np.ones(len(row_records), dtype=bool)
    anchor_registration_mask = np.ones(all_anchor_local.shape[0], dtype=bool)
    if arguments.maximum_observable_top_height_feet is not None:
        assert initial_registration is not None
        initial_transform = initial_registration["transform"]
        initial_world_anchors = local_to_world_feet(
            all_anchor_local,
            float(initial_transform["fittedCenterFieldBearingDegrees"]),
            float(initial_transform["homePlateEastFeetFromInputCenter"]),
            float(initial_transform["homePlateNorthFeetFromInputCenter"]),
        )
        initial_top_heights, initial_inside = sample_source_cell_values(
            initial_world_anchors,
            grid,
            grid["relativeHeightFeet"],
        )
        initially_observable = (
            initial_inside
            & np.isfinite(initial_top_heights)
            & (
                initial_top_heights
                <= arguments.maximum_observable_top_height_feet
            )
        )
        total_anchor_counts = np.bincount(
            anchor_row_indices_array,
            minlength=len(row_records),
        )
        observable_anchor_counts = np.bincount(
            anchor_row_indices_array,
            weights=initially_observable.astype(np.int8),
            minlength=len(row_records),
        )
        registration_row_mask = observable_anchor_counts == total_anchor_counts
        anchor_registration_mask = registration_row_mask[anchor_row_indices_array]
    if not np.any(registration_row_mask & ~row_holdout):
        raise ValueError("No fit rows remain after the observability mask")
    if not np.any(registration_row_mask & row_holdout):
        raise ValueError("No held-out rows remain after the observability mask")
    control_row_indices = np.flatnonzero((~row_holdout) & registration_row_mask)
    if control_row_indices.size > 1_500:
        selection = np.linspace(0, control_row_indices.size - 1, 1_500, dtype=np.int64)
        optimization_rows = control_row_indices[selection]
    else:
        optimization_rows = control_row_indices
    optimization_row_mask = np.isin(anchor_row_indices_array, optimization_rows)
    optimization_anchors = all_anchor_local[optimization_row_mask]
    optimization_anchor_rows = anchor_row_indices_array[optimization_row_mask]
    _, normalized_optimization_rows = np.unique(
        optimization_anchor_rows, return_inverse=True
    )

    def objective(parameters: np.ndarray) -> float:
        bearing_delta, home_east, home_north = parameters
        world = local_to_world_feet(
            optimization_anchors,
            arguments.expected_center_field_bearing + float(bearing_delta),
            float(home_east),
            float(home_north),
        )
        distances, heights, inside = sample_grid(world, grid, outside_distance_feet=50.0)
        heights[distances > 3.0] = np.nan
        clipped = np.minimum(distances, 15.0)
        median_distance = float(np.median(clipped))
        p90_distance = float(np.percentile(clipped, 90))
        outside_fraction = 1.0 - float(np.mean(inside))
        reshaped_heights = np.full(
            (int(normalized_optimization_rows.max()) + 1, 3),
            np.nan,
            dtype=np.float64,
        )
        per_row_counts = np.zeros(reshaped_heights.shape[0], dtype=np.int8)
        for value, row_index in zip(heights, normalized_optimization_rows):
            slot = per_row_counts[row_index]
            if slot < 3:
                reshaped_heights[row_index, slot] = value
                per_row_counts[row_index] += 1
        valid_height_count = np.sum(np.isfinite(reshaped_heights), axis=1)
        valid_heights = reshaped_heights[valid_height_count >= 2]
        if valid_heights.size:
            row_spreads = np.nanmax(valid_heights, axis=1) - np.nanmin(
                valid_heights, axis=1
            )
            row_spread_penalty = float(
                np.nanmedian(np.minimum(row_spreads, 20.0))
            )
        else:
            row_spread_penalty = 20.0
        return (
            median_distance
            + 0.55 * p90_distance
            + 0.04 * row_spread_penalty
            + 25.0 * outside_fraction
        )

    if initial_registration:
        initial_transform = initial_registration["transform"]
        initial_bearing_delta = float(initial_transform["bearingAdjustmentDegrees"])
        initial_home_east = float(initial_transform["homePlateEastFeetFromInputCenter"])
        initial_home_north = float(initial_transform["homePlateNorthFeetFromInputCenter"])
        bounds = [
            (
                max(
                    -arguments.maximum_bearing_adjustment,
                    initial_bearing_delta - arguments.local_bearing_window_degrees,
                ),
                min(
                    arguments.maximum_bearing_adjustment,
                    initial_bearing_delta + arguments.local_bearing_window_degrees,
                ),
            ),
            (
                initial_home_east - arguments.local_translation_window_feet,
                initial_home_east + arguments.local_translation_window_feet,
            ),
            (
                initial_home_north - arguments.local_translation_window_feet,
                initial_home_north + arguments.local_translation_window_feet,
            ),
        ]
    else:
        bounds = [
            (-arguments.maximum_bearing_adjustment, arguments.maximum_bearing_adjustment),
            (-arguments.translation_bound_feet, arguments.translation_bound_feet),
            (-arguments.translation_bound_feet, arguments.translation_bound_feet),
        ]
    global_result = differential_evolution(
        objective,
        bounds,
        seed=20260810,
        maxiter=65,
        popsize=12,
        polish=False,
        updating="immediate",
        workers=1,
    )
    local_result = minimize(
        objective,
        global_result.x,
        method="Powell",
        bounds=bounds,
        options={"maxiter": 300, "xtol": 1e-5, "ftol": 1e-7},
    )
    global_parameters = np.asarray(global_result.x, dtype=np.float64)
    local_parameters = np.asarray(local_result.x, dtype=np.float64)
    parameters = (
        local_parameters
        if objective(local_parameters) <= objective(global_parameters)
        else global_parameters
    )
    bearing_delta, home_east, home_north = parameters
    fitted_bearing = (
        arguments.expected_center_field_bearing + float(bearing_delta)
    ) % 360.0
    all_world_anchors = local_to_world_feet(
        all_anchor_local,
        fitted_bearing,
        float(home_east),
        float(home_north),
    )
    control_anchor_mask = (~anchor_holdout) & anchor_registration_mask
    holdout_anchor_mask = anchor_holdout & anchor_registration_mask
    control_summary = summarize_fit(
        all_anchor_local[control_anchor_mask],
        anchor_row_indices_array[control_anchor_mask],
        np.asarray([fitted_bearing, home_east, home_north]),
        grid,
    )
    holdout_summary = summarize_fit(
        all_anchor_local[holdout_anchor_mask],
        anchor_row_indices_array[holdout_anchor_mask],
        np.asarray([fitted_bearing, home_east, home_north]),
        grid,
    )

    assert grid["horizontalCrs"] is not None
    assert grid["centerXMetres"] is not None
    assert grid["centerYMetres"] is not None
    home_x_metres = grid["centerXMetres"] + home_east / METRES_TO_FEET
    home_y_metres = grid["centerYMetres"] + home_north / METRES_TO_FEET
    horizontal_unit_to_metres = float(grid["horizontalUnitToMetres"])
    home_x_native, home_y_native = projected_metres_to_native_coordinates(
        home_x_metres,
        home_y_metres,
        horizontal_unit_to_metres,
    )
    inverse = Transformer.from_crs(
        grid["horizontalCrs"], CRS.from_epsg(4326), always_xy=True
    )
    home_longitude, home_latitude = inverse.transform(home_x_native, home_y_native)

    geometry_rows: list[dict[str, Any]] = []
    for row_index, (row, seat_local) in enumerate(zip(row_records, seat_local_parts)):
        seat_world = local_to_world_feet(
            seat_local,
            fitted_bearing,
            float(home_east),
            float(home_north),
        )
        geometry_rows.append({
            "rowKey": row_keys[row_index],
            "sectionId": section_ids[row_index],
            "heldOutFromFit": bool(row_holdout[row_index]),
            "includedInRegistrationDiagnostic": bool(registration_row_mask[row_index]),
            "rowElevationFeet": None,
            "seats": [
                {
                    "providerPlaceId": seat["providerPlaceId"],
                    "seatLabel": seat.get("seatLabel"),
                    "eastNorthFeetFromInputCenter": [
                        round(float(world_position[0]), 4),
                        round(float(world_position[1]), 4),
                    ],
                }
                for seat, world_position in zip(row["seats"], seat_world)
            ],
        })

    source_horizontal_accuracy = surface_audit.get("source", {}).get(
        "reportedHorizontalAccuracy95Ft"
    )
    source_currency = surface_audit.get("currency", {}).get("status")
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": stadium_id,
        "inputs": {
            "rowArtifactVersion": rows["artifactVersion"],
            "fieldControlArtifactVersion": controls["artifactVersion"],
            "lidarManifestArtifactVersion": manifest["artifactVersion"],
            "surfaceAuditSha256": hashlib.sha256(surface_audit_bytes).hexdigest(),
            "rows": {
                "path": str(arguments.rows.resolve()),
                "sha256": hashlib.sha256(rows_bytes).hexdigest(),
                "artifactVersion": rows["artifactVersion"],
            },
            "fieldControls": {
                "path": str(arguments.field_controls.resolve()),
                "sha256": hashlib.sha256(controls_bytes).hexdigest(),
                "artifactVersion": controls["artifactVersion"],
            },
            "lidarManifest": {
                "path": str(arguments.lidar_manifest.resolve()),
                "sha256": hashlib.sha256(manifest_bytes).hexdigest(),
                "artifactVersion": manifest["artifactVersion"],
            },
            "surfaceAudit": {
                "path": str(arguments.surface_audit.resolve()),
                "sha256": hashlib.sha256(surface_audit_bytes).hexdigest(),
                "artifactVersion": surface_audit.get("artifactVersion"),
            },
            "lidarSources": grid["lidarSources"],
            "initialRegistration": (
                {
                    "path": str(arguments.initial_registration),
                    "sha256": hashlib.sha256(initial_registration_bytes).hexdigest(),
                    "artifactVersion": initial_registration["artifactVersion"],
                }
                if initial_registration and initial_registration_bytes
                else None
            ),
        },
        "settings": {
            "inputCenter": {
                "longitude": arguments.longitude,
                "latitude": arguments.latitude,
            },
            "expectedCenterFieldBearingDegrees": arguments.expected_center_field_bearing,
            "maximumBearingAdjustmentDegrees": arguments.maximum_bearing_adjustment,
            "translationBoundFeet": arguments.translation_bound_feet,
            "halfWidthFeet": arguments.half_width_feet,
            "cellSizeFeet": arguments.cell_size_feet,
            "minimumSurfaceHeightFeet": arguments.minimum_surface_height_feet,
            "maximumSurfaceHeightFeet": arguments.maximum_surface_height_feet,
            "excludedNoiseClassifications": [7, 18],
            "pointSourceId": arguments.point_source_id,
            "fitBounds": [[float(value) for value in bound] for bound in bounds],
            "localBearingWindowDegrees": arguments.local_bearing_window_degrees,
            "localTranslationWindowFeet": arguments.local_translation_window_feet,
            "maximumObservableTopHeightFeet": (
                arguments.maximum_observable_top_height_feet
            ),
        },
        "transform": {
            "providerPixelsPerFoot": pixels_per_foot,
            "fittedCenterFieldBearingDegrees": fitted_bearing,
            "bearingAdjustmentDegrees": float(bearing_delta),
            "homePlateEastFeetFromInputCenter": float(home_east),
            "homePlateNorthFeetFromInputCenter": float(home_north),
            "homePlateProjectedMetres": [home_x_metres, home_y_metres],
            "homePlateProjectedNativeUnits": [home_x_native, home_y_native],
            "homePlateProjectedNativeUnit": grid["horizontalCrs"].axis_info[0].unit_name,
            "homePlateLongitudeLatitude": [home_longitude, home_latitude],
        },
        "split": {
            "method": "sha256(sectionId) modulo 5",
            "fitRows": int((~row_holdout).sum()),
            "heldOutRows": int(row_holdout.sum()),
            "registeredFitRows": int((registration_row_mask & ~row_holdout).sum()),
            "registeredHeldOutRows": int((registration_row_mask & row_holdout).sum()),
            "roofOrHighSurfaceExcludedRows": int((~registration_row_mask).sum()),
            "optimizationRows": int(optimization_rows.size),
        },
        "diagnostics": {
            "objective": float(objective(parameters)),
            "control": control_summary,
            "heldOut": holdout_summary,
        },
        "coverage": {
            "rowCount": len(geometry_rows),
            "seatCount": sum(len(row["seats"]) for row in geometry_rows),
            "rowsWithProjectedCoordinates": len(geometry_rows),
            "seatsWithProjectedCoordinates": sum(
                len(row["seats"]) for row in geometry_rows
            ),
            "rowsWithMeasuredElevation": 0,
            "allProviderRowsMappedToCandidatePlanCoordinates": True,
            "establishesPhysicalRowMeasurement": False,
        },
        "geometryRows": geometry_rows,
    }
    artifact_version = "sha256:" + stable_sha256(stable)
    blockers = [
        "PROVIDER_PLAN_REGISTRATION_LACKS_INDEPENDENT_SURVEY_CONTROL",
        "ALGORITHMIC_SECTION_HOLDOUT_IS_NOT_AN_INDEPENDENT_SURVEY_HOLDOUT",
        "ROW_ELEVATIONS_NOT_MEASURED",
        "SEMANTIC_ROW_IDENTITY_NOT_INDEPENDENTLY_VALIDATED",
        "OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
        "ORIENTATION_UNCERTAINTY_NOT_ESTABLISHED",
        "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
    ]
    if arguments.maximum_observable_top_height_feet is not None:
        blockers.extend([
            "ROOF_OR_HIGH_SURFACE_OCCLUDED_ROWS_EXCLUDED_FROM_REGISTRATION_DIAGNOSTIC",
            "COMPLETE_ROW_PLAN_REGISTRATION_NOT_ESTABLISHED",
        ])
    if source_horizontal_accuracy is None:
        blockers.append("LIDAR_HORIZONTAL_ACCURACY_NOT_REPORTED_AT_95_PERCENT")
    elif float(source_horizontal_accuracy) > 1.0:
        blockers.append("LIDAR_HORIZONTAL_ACCURACY_EXCEEDS_ONE_FOOT")
    if source_currency != "passed":
        blockers.append("SOURCE_CURRENCY_NOT_VERIFIED")
    if initial_registration:
        blockers.append("FIT_BOUNDS_CONSTRAINED_BY_NONINDEPENDENT_INITIAL_REGISTRATION")
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-row-to-lidar-plan-registration-candidate",
        "artifactVersion": artifact_version,
        "generatedOn": __import__("datetime").datetime.now(
            __import__("datetime").timezone.utc
        ).isoformat().replace("+00:00", "Z"),
        **stable,
        "lidar": {
            "coordinateReferenceSystem": grid["sourceCrs"].to_wkt(),
            "horizontalUnitToMetres": grid["horizontalUnitToMetres"],
            "verticalUnitToMetres": grid["verticalUnitToMetres"],
            "groundElevationFeet": grid["groundElevationFeet"],
            "retainedNonNoisePointCount": grid["retainedPointCount"],
            "excludedNoiseClassifications": [7, 18],
            "elevatedSurfaceCellCount": int(grid["surfaceMask"].sum()),
            "rasterCellSizeFeet": grid["cellSizeFeet"],
            "reportedHorizontalAccuracy95Feet": source_horizontal_accuracy,
            "pointSourceIdFilter": arguments.point_source_id,
        },
        "geometryBoundary": {
            "coordinateFrame": "CANDIDATE_PROJECTED_PLAN_FEET_FROM_INPUT_CENTER",
            "planCoordinatesMetric": True,
            "establishesCandidateProjectedPlanCoordinates": True,
            "surveyedWorldRegistrationEstablished": False,
            "rowElevationsEstablished": False,
            "obstructionGeometryEstablished": False,
            "note": (
                "Plan coordinates are a repeatable optimization result against elevated "
                "LiDAR returns. They are not independent surveyed row coordinates."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": blockers,
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(
        json.dumps(artifact, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    if arguments.output_png:
        render_diagnostic(
            arguments.output_png,
            grid,
            all_world_anchors,
            anchor_holdout,
            anchor_registration_mask,
            np.asarray([home_east, home_north], dtype=np.float64),
        )
    print(json.dumps({
        "output": str(arguments.output),
        "outputPng": str(arguments.output_png) if arguments.output_png else None,
        "artifactVersion": artifact_version,
        "transform": stable["transform"],
        "split": stable["split"],
        "diagnostics": stable["diagnostics"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

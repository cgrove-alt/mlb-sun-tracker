#!/usr/bin/env python3
"""Quantify stadium-surface coverage and repeatability in a LAS/LAZ tile.

The output is an evidence artifact, not a publishable stadium model. It keeps
source accuracy, sampling coverage, cross-flight-line repeatability, geometry
currency, and row/obstruction validation as separate questions so that a good
number in one category cannot silently unlock exact seat-shade results.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import deque
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable

import laspy
import numpy as np
from pyproj import CRS, Transformer

from lidar_units import lidar_unit_conversion


ANALYSIS_VERSION = "lidar-stadium-surface-audit-v4"
GPS_EPOCH_UTC = datetime(1980, 1, 6, tzinfo=timezone.utc)
GPS_LEAP_SECOND_EFFECTIVE_DATES_UTC = tuple(
    datetime.fromisoformat(value).replace(tzinfo=timezone.utc)
    for value in (
        "1981-07-01",
        "1982-07-01",
        "1983-07-01",
        "1985-07-01",
        "1988-01-01",
        "1990-01-01",
        "1991-01-01",
        "1992-07-01",
        "1993-07-01",
        "1994-07-01",
        "1996-01-01",
        "1997-07-01",
        "1999-01-01",
        "2006-01-01",
        "2009-01-01",
        "2012-07-01",
        "2015-07-01",
        "2017-01-01",
    )
)


def parse_vertex(value: str) -> tuple[float, float]:
    try:
        east, north = value.split(",", 1)
        return float(east), float(north)
    except ValueError as error:
        raise argparse.ArgumentTypeError("vertices must use EAST_FT,NORTH_FT") from error


def parse_cell_sizes(value: str) -> list[float]:
    try:
        sizes = sorted({float(item) for item in value.split(",")})
    except ValueError as error:
        raise argparse.ArgumentTypeError("cell sizes must be comma-separated numbers") from error
    if not sizes or any(size <= 0 for size in sizes):
        raise argparse.ArgumentTypeError("cell sizes must be positive")
    return sizes


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Authoritative LAS/LAZ source tile")
    parser.add_argument("output", type=Path, help="Candidate analysis JSON")
    parser.add_argument(
        "--additional-input",
        action="append",
        type=Path,
        default=[],
        help="Repeat for every additional same-project tile intersecting the footprint",
    )
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--longitude", type=float, required=True)
    parser.add_argument("--latitude", type=float, required=True)
    parser.add_argument("--center-field-bearing-deg", type=float, required=True)
    parser.add_argument("--source-url", required=True)
    parser.add_argument(
        "--source-provider",
        default="U.S. Geological Survey 3D Elevation Program",
    )
    parser.add_argument("--source-dataset")
    parser.add_argument(
        "--additional-source-url",
        action="append",
        default=[],
        help="Repeat in the same order as --additional-input",
    )
    parser.add_argument("--metadata-url", required=True)
    parser.add_argument("--acquisition-report-url")
    parser.add_argument("--acquisition-evidence-url")
    parser.add_argument("--acquired-on")
    parser.add_argument(
        "--source-crs",
        help="Explicit CRS used only when the LAS header has no parseable CRS",
    )
    parser.add_argument(
        "--source-crs-evidence",
        type=Path,
        help="Checksum-locked primary metadata supporting --source-crs",
    )
    parser.add_argument(
        "--footprint-vertex",
        action="append",
        type=parse_vertex,
        required=True,
        help="Repeat at least three times; offsets are EAST_FT,NORTH_FT from the supplied centre",
    )
    parser.add_argument("--cell-sizes-ft", type=parse_cell_sizes, default=[1.0, 2.0, 3.0, 6.0])
    parser.add_argument("--segmentation-cell-size-ft", type=float, default=6.0)
    parser.add_argument("--minimum-structure-height-ft", type=float, default=4.0)
    parser.add_argument("--release-horizontal-threshold-ft", type=float, default=1.0)
    parser.add_argument("--release-vertical-threshold-ft", type=float, default=1.0)
    parser.add_argument("--reported-horizontal-accuracy-95-ft", type=float)
    parser.add_argument("--reported-raw-fva95-ft", type=float)
    parser.add_argument("--nominal-point-spacing-ft", type=float)
    parser.add_argument("--known-current-change-url", action="append", default=[])
    parser.add_argument(
        "--excluded-classification",
        action="append",
        type=int,
        default=None,
        help=(
            "Repeat for every LAS classification excluded as noise. Defaults to "
            "classes 7 (low noise) and 18 (high noise)."
        ),
    )
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def round_number(value: float, digits: int = 3) -> float:
    return round(float(value), digits)


def adjusted_standard_gps_seconds_to_utc(value: float) -> str:
    """Convert LAS adjusted GPS standard time to an ISO-8601 UTC timestamp.

    LAS point formats store GPS standard time minus 1,000,000,000 seconds when
    the global-encoding time bit is set. GPS time has no leap seconds, while UTC
    does. The first estimate uses the current 18-second difference and the
    second pass selects the historically correct difference for older surveys.
    """

    gps_seconds = value + 1_000_000_000
    estimate = GPS_EPOCH_UTC + timedelta(seconds=gps_seconds - 18)
    leap_seconds = sum(
        estimate >= effective for effective in GPS_LEAP_SECOND_EFFECTIVE_DATES_UTC
    )
    timestamp = GPS_EPOCH_UTC + timedelta(seconds=gps_seconds - leap_seconds)
    return timestamp.isoformat(timespec="microseconds").replace("+00:00", "Z")


def quantiles(values: np.ndarray) -> dict[str, float | None]:
    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return {"median": None, "p95": None, "maximum": None}
    return {
        "median": round_number(np.quantile(finite, 0.5)),
        "p95": round_number(np.quantile(finite, 0.95)),
        "maximum": round_number(np.max(finite)),
    }


def polygon_area(vertices: np.ndarray) -> float:
    x = vertices[:, 0]
    y = vertices[:, 1]
    return abs(float(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))) / 2


def points_in_polygon(x: np.ndarray, y: np.ndarray, vertices: np.ndarray) -> np.ndarray:
    inside = np.zeros(x.shape, dtype=bool)
    previous = len(vertices) - 1
    for current in range(len(vertices)):
        current_x, current_y = vertices[current]
        previous_x, previous_y = vertices[previous]
        crosses = ((current_y > y) != (previous_y > y)) & (
            x
            < (previous_x - current_x)
            * (y - current_y)
            / (previous_y - current_y + np.finfo(float).eps)
            + current_x
        )
        inside ^= crosses
        previous = current
    return inside


def grid_definition(vertices: np.ndarray, cell_size_ft: float) -> tuple[float, float, int, int]:
    minimum_x = math.floor(float(np.min(vertices[:, 0])) / cell_size_ft) * cell_size_ft
    minimum_y = math.floor(float(np.min(vertices[:, 1])) / cell_size_ft) * cell_size_ft
    maximum_x = math.ceil(float(np.max(vertices[:, 0])) / cell_size_ft) * cell_size_ft
    maximum_y = math.ceil(float(np.max(vertices[:, 1])) / cell_size_ft) * cell_size_ft
    columns = max(1, int(round((maximum_x - minimum_x) / cell_size_ft)))
    rows = max(1, int(round((maximum_y - minimum_y) / cell_size_ft)))
    return minimum_x, minimum_y, columns, rows


def footprint_cell_mask(
    vertices: np.ndarray,
    minimum_x: float,
    minimum_y: float,
    columns: int,
    rows: int,
    cell_size_ft: float,
) -> np.ndarray:
    x = minimum_x + (np.arange(columns) + 0.5) * cell_size_ft
    y = minimum_y + (np.arange(rows) + 0.5) * cell_size_ft
    grid_x, grid_y = np.meshgrid(x, y)
    return points_in_polygon(grid_x.ravel(), grid_y.ravel(), vertices)


def grid_indices(
    x: np.ndarray,
    y: np.ndarray,
    minimum_x: float,
    minimum_y: float,
    columns: int,
    rows: int,
    cell_size_ft: float,
) -> tuple[np.ndarray, np.ndarray]:
    column = np.floor((x - minimum_x) / cell_size_ft).astype(np.int64)
    row = np.floor((y - minimum_y) / cell_size_ft).astype(np.int64)
    valid = (column >= 0) & (column < columns) & (row >= 0) & (row < rows)
    return row[valid] * columns + column[valid], valid


def source_mean_range(
    indices: np.ndarray,
    z: np.ndarray,
    source_ids: np.ndarray,
    unique_source_ids: np.ndarray,
    cell_count: int,
) -> tuple[np.ndarray, np.ndarray]:
    minimum = np.full(cell_count, np.inf, dtype=np.float64)
    maximum = np.full(cell_count, -np.inf, dtype=np.float64)
    source_count = np.zeros(cell_count, dtype=np.int16)
    for source_id in unique_source_ids:
        selected = source_ids == source_id
        counts = np.bincount(indices[selected], minlength=cell_count)
        sums = np.bincount(indices[selected], weights=z[selected], minlength=cell_count)
        present = counts > 0
        means = np.divide(sums, counts, out=np.zeros(cell_count), where=present)
        minimum[present] = np.minimum(minimum[present], means[present])
        maximum[present] = np.maximum(maximum[present], means[present])
        source_count[present] += 1
    multiple = source_count >= 2
    ranges = np.full(cell_count, np.nan, dtype=np.float64)
    ranges[multiple] = maximum[multiple] - minimum[multiple]
    return ranges, source_count


def analyze_grid(
    x: np.ndarray,
    y: np.ndarray,
    z: np.ndarray,
    source_ids: np.ndarray,
    vertices: np.ndarray,
    cell_size_ft: float,
    vertical_threshold_ft: float,
) -> tuple[dict[str, Any], dict[str, Any]]:
    minimum_x, minimum_y, columns, rows = grid_definition(vertices, cell_size_ft)
    cell_count = columns * rows
    footprint = footprint_cell_mask(
        vertices, minimum_x, minimum_y, columns, rows, cell_size_ft
    )
    indices, valid = grid_indices(
        x, y, minimum_x, minimum_y, columns, rows, cell_size_ft
    )
    local_z = z[valid]
    local_sources = source_ids[valid]
    counts = np.bincount(indices, minlength=cell_count)
    occupied = (counts > 0) & footprint

    minimum_z = np.full(cell_count, np.inf, dtype=np.float64)
    maximum_z = np.full(cell_count, -np.inf, dtype=np.float64)
    np.minimum.at(minimum_z, indices, local_z)
    np.maximum.at(maximum_z, indices, local_z)
    within_cell_range = maximum_z - minimum_z

    unique_sources = np.unique(local_sources)
    mean_range, source_count = source_mean_range(
        indices, local_z, local_sources, unique_sources, cell_count
    )
    multiple_sources = (source_count >= 2) & footprint
    stable_cells = multiple_sources & (within_cell_range <= vertical_threshold_ft)
    edge_or_mixed_cells = multiple_sources & (within_cell_range > vertical_threshold_ft)
    footprint_cells = int(np.count_nonzero(footprint))
    occupied_cells = int(np.count_nonzero(occupied))

    summary = {
        "cellSizeFt": cell_size_ft,
        "footprintCells": footprint_cells,
        "occupiedCells": occupied_cells,
        "samplingCoveragePercent": round_number(100 * occupied_cells / footprint_cells, 2),
        "meanReturnsPerOccupiedCell": round_number(np.mean(counts[occupied])),
        "cellsWithMultipleFlightLines": int(np.count_nonzero(multiple_sources)),
        "multipleFlightLineCoveragePercent": round_number(
            100 * np.count_nonzero(multiple_sources) / footprint_cells, 2
        ),
        "stableMultipleFlightLineCells": int(np.count_nonzero(stable_cells)),
        "edgeOrMixedSurfaceMultipleFlightLineCells": int(np.count_nonzero(edge_or_mixed_cells)),
        "flightLineMeanElevationRangeFt": quantiles(mean_range[multiple_sources]),
        "stableSurfaceFlightLineMeanElevationRangeFt": quantiles(mean_range[stable_cells]),
        "withinCellElevationRangeFt": quantiles(within_cell_range[occupied]),
    }
    raw = {
        "minimumX": minimum_x,
        "minimumY": minimum_y,
        "columns": columns,
        "rows": rows,
        "footprint": footprint,
        "occupied": occupied,
        "maximumZ": maximum_z,
        "sourceCount": source_count,
    }
    return summary, raw


def connected_components(mask: np.ndarray, rows: int, columns: int) -> Iterable[np.ndarray]:
    unvisited = mask.reshape(rows, columns).copy()
    for start_row, start_column in np.argwhere(unvisited):
        if not unvisited[start_row, start_column]:
            continue
        queue: deque[tuple[int, int]] = deque([(int(start_row), int(start_column))])
        unvisited[start_row, start_column] = False
        cells: list[int] = []
        while queue:
            row, column = queue.popleft()
            cells.append(row * columns + column)
            for row_offset in (-1, 0, 1):
                for column_offset in (-1, 0, 1):
                    if row_offset == 0 and column_offset == 0:
                        continue
                    neighbor_row = row + row_offset
                    neighbor_column = column + column_offset
                    if (
                        0 <= neighbor_row < rows
                        and 0 <= neighbor_column < columns
                        and unvisited[neighbor_row, neighbor_column]
                    ):
                        unvisited[neighbor_row, neighbor_column] = False
                        queue.append((neighbor_row, neighbor_column))
        yield np.asarray(cells, dtype=np.int64)


def segment_candidate_surfaces(
    raw_grid: dict[str, Any],
    ground_elevation_ft: float,
    cell_size_ft: float,
    minimum_structure_height_ft: float,
) -> dict[str, Any]:
    relative_maximum = raw_grid["maximumZ"] - ground_elevation_ft
    structure = (
        raw_grid["footprint"]
        & raw_grid["occupied"]
        & np.isfinite(relative_maximum)
        & (relative_maximum >= minimum_structure_height_ft)
        & (relative_maximum <= 400)
    )
    components: list[dict[str, Any]] = []
    for cells in connected_components(structure, raw_grid["rows"], raw_grid["columns"]):
        if cells.size < 4:
            continue
        rows = cells // raw_grid["columns"]
        columns = cells % raw_grid["columns"]
        heights = relative_maximum[cells]
        components.append({
            "cellCount": int(cells.size),
            "approximatePlanAreaSqFt": round_number(cells.size * cell_size_ft**2, 1),
            "boundsFtFromStadiumCenter": {
                "minimumEast": round_number(raw_grid["minimumX"] + np.min(columns) * cell_size_ft, 1),
                "maximumEast": round_number(raw_grid["minimumX"] + (np.max(columns) + 1) * cell_size_ft, 1),
                "minimumNorth": round_number(raw_grid["minimumY"] + np.min(rows) * cell_size_ft, 1),
                "maximumNorth": round_number(raw_grid["minimumY"] + (np.max(rows) + 1) * cell_size_ft, 1),
            },
            "maximumReturnHeightFt": quantiles(heights),
            "multipleFlightLineCellPercent": round_number(
                100 * np.count_nonzero(raw_grid["sourceCount"][cells] >= 2) / cells.size,
                2,
            ),
        })
    components.sort(key=lambda component: component["cellCount"], reverse=True)

    height_bands = []
    for minimum, maximum in [(0, 4), (4, 25), (25, 60), (60, 100), (100, 200), (200, 400)]:
        selected = (
            raw_grid["footprint"]
            & raw_grid["occupied"]
            & (relative_maximum >= minimum)
            & (relative_maximum < maximum)
        )
        height_bands.append({
            "minimumHeightFt": minimum,
            "maximumHeightFtExclusive": maximum,
            "cellCount": int(np.count_nonzero(selected)),
        })

    return {
        "method": "eight-neighbor components of maximum-return cells clipped to the declared footprint",
        "cellSizeFt": cell_size_ft,
        "minimumStructureHeightFt": minimum_structure_height_ft,
        "heightBands": height_bands,
        "componentCount": len(components),
        "largestComponents": components[:20],
        "limitations": [
            "Height bands and connected components are candidate surfaces, not semantic row/deck labels.",
            "Maximum returns preserve possible shadow casters but also preserve temporary objects and edge mixing.",
            "A footprint drawn from the source under review is not an independent horizontal control.",
        ],
    }


def main() -> None:
    args = parse_args()
    input_paths = [args.input, *args.additional_input]
    source_urls = [args.source_url, *args.additional_source_url]
    if len(input_paths) != len(source_urls):
        raise ValueError("Every --additional-input requires one --additional-source-url")
    for input_path in input_paths:
        if not input_path.is_file():
            raise FileNotFoundError(input_path)
    vertices = np.asarray(args.footprint_vertex, dtype=np.float64)
    if len(vertices) < 3 or polygon_area(vertices) <= 0:
        raise ValueError("footprint needs at least three non-collinear vertices")
    if args.segmentation_cell_size_ft <= 0:
        raise ValueError("segmentation cell size must be positive")
    if args.release_horizontal_threshold_ft <= 0 or args.release_vertical_threshold_ft <= 0:
        raise ValueError("release thresholds must be positive")
    if (
        args.reported_horizontal_accuracy_95_ft is not None
        and args.reported_horizontal_accuracy_95_ft <= 0
    ):
        raise ValueError("reported horizontal accuracy must be positive")
    excluded_classifications = sorted(set(args.excluded_classification or [7, 18]))
    if any(value < 0 or value > 255 for value in excluded_classifications):
        raise ValueError("excluded classifications must be within zero and 255")

    requested_cell_sizes = sorted(set(args.cell_sizes_ft + [args.segmentation_cell_size_ft]))
    source_hashes = [sha256(input_path) for input_path in input_paths]
    if bool(args.source_crs) != bool(args.source_crs_evidence):
        raise ValueError("--source-crs and --source-crs-evidence must be supplied together")
    source_crs_evidence_sha256 = None
    if args.source_crs_evidence:
        if not args.source_crs_evidence.is_file():
            raise FileNotFoundError(args.source_crs_evidence)
        source_crs_evidence_sha256 = sha256(args.source_crs_evidence)
    source_hash = source_hashes[0]
    with laspy.open(args.input) as reader:
        embedded_crs = reader.header.parse_crs()
        if embedded_crs is None:
            if not args.source_crs:
                raise ValueError(
                    "Point cloud has no coordinate reference system; a checksum-locked "
                    "--source-crs and --source-crs-evidence are required"
                )
            crs = CRS.from_user_input(args.source_crs)
            crs_provenance = "explicit-primary-metadata-override"
        else:
            crs = CRS.from_user_input(embedded_crs)
            crs_provenance = "las-header"
            if args.source_crs and not crs.equals(CRS.from_user_input(args.source_crs)):
                raise ValueError("Explicit source CRS disagrees with the LAS header CRS")
        units = lidar_unit_conversion(crs)
        transformer = Transformer.from_crs("EPSG:4326", crs, always_xy=True)
        center_x, center_y = transformer.transform(args.longitude, args.latitude)
        minimum_east = float(np.min(vertices[:, 0]))
        maximum_east = float(np.max(vertices[:, 0]))
        minimum_north = float(np.min(vertices[:, 1]))
        maximum_north = float(np.max(vertices[:, 1]))

        x_parts: list[np.ndarray] = []
        y_parts: list[np.ndarray] = []
        z_parts: list[np.ndarray] = []
        classification_parts: list[np.ndarray] = []
        source_parts: list[np.ndarray] = []
        source_files: list[dict[str, Any]] = []
        gps_time_types: set[str] = set()
        gps_time_minimum = math.inf
        gps_time_maximum = -math.inf
        excluded_classification_counts = {
            value: 0 for value in excluded_classifications
        }
        point_source_summaries: dict[int, dict[str, float | int]] = {}

        def append_reader_points(
            source_reader: laspy.LasReader,
            input_path: Path,
            source_url: str,
            source_file_hash: str,
        ) -> None:
            nonlocal gps_time_minimum, gps_time_maximum
            source_crs_value = source_reader.header.parse_crs()
            if source_crs_value is None:
                if not args.source_crs:
                    raise ValueError(
                        f"Point cloud has no coordinate reference system: {input_path}"
                    )
                source_crs = CRS.from_user_input(args.source_crs)
            else:
                source_crs = CRS.from_user_input(source_crs_value)
            source_units = lidar_unit_conversion(source_crs)
            if not source_crs.equals(crs):
                raise ValueError(f"Point-cloud CRS mismatch: {input_path}")
            if (
                not math.isclose(
                    source_units.horizontal_native_units_to_feet,
                    units.horizontal_native_units_to_feet,
                    rel_tol=0,
                    abs_tol=1e-12,
                )
                or not math.isclose(
                    source_units.vertical_native_units_to_feet,
                    units.vertical_native_units_to_feet,
                    rel_tol=0,
                    abs_tol=1e-12,
                )
            ):
                raise ValueError(f"Point-cloud unit mismatch: {input_path}")
            gps_time_type = source_reader.header.global_encoding.gps_time_type.name
            gps_time_types.add(gps_time_type)
            source_files.append({
                "sourceUrl": source_url,
                "localFileSha256": source_file_hash,
                "pointCount": int(source_reader.header.point_count),
                "headerCreationDate": (
                    source_reader.header.creation_date.isoformat()
                    if source_reader.header.creation_date is not None
                    else None
                ),
                "pointFormat": str(source_reader.header.point_format),
                "gpsTimeType": gps_time_type,
            })

            for points in source_reader.chunk_iterator(1_000_000):
                east = (
                    np.asarray(points.x) - center_x
                ) * units.horizontal_native_units_to_feet
                north = (
                    np.asarray(points.y) - center_y
                ) * units.horizontal_native_units_to_feet
                preliminary = (
                    (east >= minimum_east)
                    & (east <= maximum_east)
                    & (north >= minimum_north)
                    & (north <= maximum_north)
                )
                if not np.any(preliminary):
                    continue
                selected_indices = np.flatnonzero(preliminary)
                inside = points_in_polygon(east[preliminary], north[preliminary], vertices)
                selected_indices = selected_indices[inside]
                if selected_indices.size == 0:
                    continue
                local_z = (
                    np.asarray(points.z)[selected_indices]
                    * units.vertical_native_units_to_feet
                )
                local_classification = np.asarray(points.classification)[selected_indices]
                for excluded_value in excluded_classifications:
                    excluded_classification_counts[excluded_value] += int(
                        np.count_nonzero(local_classification == excluded_value)
                    )
                valid = np.isfinite(local_z) & ~np.isin(
                    local_classification, excluded_classifications
                )
                if not np.any(valid):
                    continue
                selected_indices = selected_indices[valid]
                local_east = east[selected_indices]
                local_north = north[selected_indices]
                local_z = local_z[valid]
                local_source_ids = np.asarray(points.point_source_id)[selected_indices]
                local_gps_times = np.asarray(points.gps_time)[selected_indices]
                for source_id in np.unique(local_source_ids):
                    source_mask = local_source_ids == source_id
                    summary = point_source_summaries.setdefault(
                        int(source_id),
                        {
                            "pointCount": 0,
                            "minimumEastFt": math.inf,
                            "maximumEastFt": -math.inf,
                            "minimumNorthFt": math.inf,
                            "maximumNorthFt": -math.inf,
                            "minimumElevationFt": math.inf,
                            "maximumElevationFt": -math.inf,
                            "minimumGpsTime": math.inf,
                            "maximumGpsTime": -math.inf,
                        },
                    )
                    summary["pointCount"] += int(np.count_nonzero(source_mask))
                    summary["minimumEastFt"] = min(
                        summary["minimumEastFt"], float(np.min(local_east[source_mask]))
                    )
                    summary["maximumEastFt"] = max(
                        summary["maximumEastFt"], float(np.max(local_east[source_mask]))
                    )
                    summary["minimumNorthFt"] = min(
                        summary["minimumNorthFt"], float(np.min(local_north[source_mask]))
                    )
                    summary["maximumNorthFt"] = max(
                        summary["maximumNorthFt"], float(np.max(local_north[source_mask]))
                    )
                    summary["minimumElevationFt"] = min(
                        summary["minimumElevationFt"], float(np.min(local_z[source_mask]))
                    )
                    summary["maximumElevationFt"] = max(
                        summary["maximumElevationFt"], float(np.max(local_z[source_mask]))
                    )
                    summary["minimumGpsTime"] = min(
                        summary["minimumGpsTime"], float(np.min(local_gps_times[source_mask]))
                    )
                    summary["maximumGpsTime"] = max(
                        summary["maximumGpsTime"], float(np.max(local_gps_times[source_mask]))
                    )
                x_parts.append(local_east)
                y_parts.append(local_north)
                z_parts.append(local_z)
                classification_parts.append(local_classification[valid])
                source_parts.append(local_source_ids)
                gps_time_minimum = min(gps_time_minimum, float(np.min(local_gps_times)))
                gps_time_maximum = max(gps_time_maximum, float(np.max(local_gps_times)))

        append_reader_points(reader, args.input, args.source_url, source_hashes[0])
        for input_path, source_url, source_file_hash in zip(
            args.additional_input,
            args.additional_source_url,
            source_hashes[1:],
        ):
            with laspy.open(input_path) as additional_reader:
                append_reader_points(
                    additional_reader,
                    input_path,
                    source_url,
                    source_file_hash,
                )

        if not x_parts:
            raise ValueError("No non-noise returns exist inside the declared footprint")
        x = np.concatenate(x_parts)
        y = np.concatenate(y_parts)
        z = np.concatenate(z_parts)
        classification = np.concatenate(classification_parts)
        source_ids = np.concatenate(source_parts)
        ground = z[classification == 2]
        if ground.size == 0:
            raise ValueError("No class-2 ground returns exist inside the declared footprint")
        ground_elevation_ft = float(np.median(ground))

        grid_summaries: list[dict[str, Any]] = []
        raw_segmentation_grid: dict[str, Any] | None = None
        for cell_size in requested_cell_sizes:
            summary, raw = analyze_grid(
                x,
                y,
                z,
                source_ids,
                vertices,
                cell_size,
                args.release_vertical_threshold_ft,
            )
            grid_summaries.append(summary)
            if math.isclose(cell_size, args.segmentation_cell_size_ft):
                raw_segmentation_grid = raw
        assert raw_segmentation_grid is not None

        precision_candidates = [
            summary
            for summary in grid_summaries
            if summary["cellSizeFt"] <= args.release_horizontal_threshold_ft
        ]
        best_precision_coverage = max(
            (summary["samplingCoveragePercent"] for summary in precision_candidates),
            default=0,
        )
        best_precision_multisource = max(
            (summary["multipleFlightLineCoveragePercent"] for summary in precision_candidates),
            default=0,
        )
        reasons = [
            "ROW_SCALE_COVERAGE_INCOMPLETE",
            "TWO_FLIGHT_LINE_COVERAGE_INCOMPLETE",
            "HORIZONTAL_ACCURACY_NOT_ESTABLISHED_FOR_STADIUM_SURFACES",
            "ORIENTATION_UNCERTAINTY_NOT_ESTABLISHED",
            "ROW_SEGMENTATION_NOT_INDEPENDENTLY_VALIDATED",
            "OBSTRUCTION_COMPLETENESS_NOT_ESTABLISHED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ]
        if args.known_current_change_url:
            reasons.insert(0, "SOURCE_PREDATES_KNOWN_CURRENT_GEOMETRY_CHANGES")
        if (
            args.reported_horizontal_accuracy_95_ft is not None
            and args.reported_horizontal_accuracy_95_ft
            > args.release_horizontal_threshold_ft
        ):
            reasons.insert(0, "REPORTED_HORIZONTAL_ACCURACY_EXCEEDS_RELEASE_THRESHOLD")

        gps_time_range_utc = None
        if gps_time_types == {"STANDARD"}:
            gps_time_range_utc = [
                adjusted_standard_gps_seconds_to_utc(gps_time_minimum),
                adjusted_standard_gps_seconds_to_utc(gps_time_maximum),
            ]

        parameters = {
            "stadiumId": args.stadium_id,
            "longitude": args.longitude,
            "latitude": args.latitude,
            "centerFieldBearingDeg": args.center_field_bearing_deg % 360,
            "footprintVerticesFtFromStadiumCenter": vertices.tolist(),
            "cellSizesFt": requested_cell_sizes,
            "segmentationCellSizeFt": args.segmentation_cell_size_ft,
            "minimumStructureHeightFt": args.minimum_structure_height_ft,
            "releaseHorizontalThresholdFt": args.release_horizontal_threshold_ft,
            "releaseVerticalThresholdFt": args.release_vertical_threshold_ft,
            "excludedClassifications": excluded_classifications,
        }
        result: dict[str, Any] = {
            "schemaVersion": 2,
            "analysisVersion": ANALYSIS_VERSION,
            "artifactStage": "candidate-metric-analysis",
            "stadiumId": args.stadium_id,
            "analysisInputFingerprintSha256": fingerprint({
                "analysisVersion": ANALYSIS_VERSION,
                "sourceFiles": sorted(
                    [
                        {"sourceUrl": source_url, "sha256": source_file_hash}
                        for source_url, source_file_hash in zip(source_urls, source_hashes)
                    ],
                    key=lambda item: item["sourceUrl"],
                ),
                "sourceMetadata": {
                    "provider": args.source_provider,
                    "dataset": args.source_dataset,
                    "metadataUrl": args.metadata_url,
                    "acquisitionReportUrl": args.acquisition_report_url,
                    "acquisitionEvidenceUrl": args.acquisition_evidence_url,
                    "acquiredOn": args.acquired_on,
                    "reportedHorizontalAccuracy95Ft": args.reported_horizontal_accuracy_95_ft,
                    "reportedRawFundamentalVerticalAccuracy95Ft": args.reported_raw_fva95_ft,
                    "nominalPointSpacingFt": args.nominal_point_spacing_ft,
                    "knownCurrentGeometryChangeUrls": sorted(
                        set(args.known_current_change_url)
                    ),
                    "sourceCrs": args.source_crs,
                    "sourceCrsEvidenceSha256": source_crs_evidence_sha256,
                },
                "parameters": parameters,
            }),
            "source": {
                "provider": args.source_provider,
                "dataset": args.source_dataset,
                "sourceUrl": args.source_url,
                "metadataUrl": args.metadata_url,
                "acquisitionReportUrl": args.acquisition_report_url,
                "acquisitionEvidenceUrl": args.acquisition_evidence_url,
                "acquiredOn": args.acquired_on,
                "localFileSha256": source_hash,
                "pointCount": sum(file["pointCount"] for file in source_files),
                "files": source_files,
                "coordinateReferenceSystem": crs.to_string(),
                "coordinateReferenceSystemProvenance": crs_provenance,
                "coordinateReferenceSystemEvidence": (
                    {
                        "path": str(args.source_crs_evidence),
                        "sha256": source_crs_evidence_sha256,
                    }
                    if args.source_crs_evidence
                    else None
                ),
                "horizontalSourceUnit": units.horizontal_unit_name,
                "verticalSourceUnit": units.vertical_unit_name,
                "horizontalNativeUnitsToFeet": round_number(
                    units.horizontal_native_units_to_feet, 12
                ),
                "verticalNativeUnitsToFeet": round_number(
                    units.vertical_native_units_to_feet, 12
                ),
                "headerCreationDate": (
                    reader.header.creation_date.isoformat()
                    if reader.header.creation_date is not None
                    else None
                ),
                "headerCreationDates": sorted({
                    file["headerCreationDate"]
                    for file in source_files
                    if file["headerCreationDate"] is not None
                }),
                "pointFormat": str(reader.header.point_format),
                "pointFormats": sorted({file["pointFormat"] for file in source_files}),
                "gpsTimeRangeRawAdjustedStandard": [
                    round_number(gps_time_minimum, 6),
                    round_number(gps_time_maximum, 6),
                ],
                "gpsTimeTypes": sorted(gps_time_types),
                "gpsTimeRangeUtc": gps_time_range_utc,
                "reportedHorizontalAccuracy95Ft": args.reported_horizontal_accuracy_95_ft,
                "reportedRawFundamentalVerticalAccuracy95Ft": args.reported_raw_fva95_ft,
                "reportedAccuracyScope": "Project-level final calibrated/controlled swath accuracy against checkpoints; not stadium-row extraction uncertainty.",
                "nominalPointSpacingFt": args.nominal_point_spacing_ft,
            },
            "coordinateFrame": {
                "centerLongitude": args.longitude,
                "centerLatitude": args.latitude,
                "centerProjectedXFt": round_number(
                    center_x * units.horizontal_native_units_to_feet
                ),
                "centerProjectedYFt": round_number(
                    center_y * units.horizontal_native_units_to_feet
                ),
                "centerFieldBearingDeg": args.center_field_bearing_deg % 360,
                "footprintVerticesFtFromStadiumCenter": vertices.tolist(),
                "footprintPlanAreaSqFt": round_number(polygon_area(vertices), 1),
                "status": "candidate-only",
                "limitation": "The supplied stadium centre, orientation, and footprint have not yet passed independent metric control.",
            },
            "returns": {
                "includedNonNoisePointCount": int(z.size),
                "pointDensityPerSqFt": round_number(z.size / polygon_area(vertices)),
                "groundElevationFt": round_number(ground_elevation_ft),
                "classificationCounts": {
                    str(int(value)): int(count)
                    for value, count in zip(*np.unique(classification, return_counts=True))
                },
                "pointSourceCounts": {
                    str(int(value)): int(count)
                    for value, count in zip(*np.unique(source_ids, return_counts=True))
                },
                "pointSourceSummaries": {
                    str(source_id): {
                        "pointCount": summary["pointCount"],
                        "boundsFtFromStadiumCenter": {
                            "minimumEast": round_number(summary["minimumEastFt"]),
                            "maximumEast": round_number(summary["maximumEastFt"]),
                            "minimumNorth": round_number(summary["minimumNorthFt"]),
                            "maximumNorth": round_number(summary["maximumNorthFt"]),
                        },
                        "elevationRangeFt": [
                            round_number(summary["minimumElevationFt"]),
                            round_number(summary["maximumElevationFt"]),
                        ],
                        "gpsTimeRangeRawAdjustedStandard": [
                            round_number(summary["minimumGpsTime"], 6),
                            round_number(summary["maximumGpsTime"], 6),
                        ],
                        "gpsTimeRangeUtc": (
                            [
                                adjusted_standard_gps_seconds_to_utc(
                                    summary["minimumGpsTime"]
                                ),
                                adjusted_standard_gps_seconds_to_utc(
                                    summary["maximumGpsTime"]
                                ),
                            ]
                            if gps_time_types == {"STANDARD"}
                            else None
                        ),
                    }
                    for source_id, summary in sorted(point_source_summaries.items())
                },
                "excludedClassificationCounts": {
                    str(value): excluded_classification_counts[value]
                    for value in excluded_classifications
                },
                "classificationCaution": "LAS classes 7 (low noise) and 18 (high noise) are excluded by default. Other returns are retained because stadium roofs, decks, seats, people, vehicles, and vegetation are not semantically separated by this source.",
            },
            "samplingAndRepeatability": grid_summaries,
            "candidateSurfaceSegmentation": segment_candidate_surfaces(
                raw_segmentation_grid,
                ground_elevation_ft,
                args.segmentation_cell_size_ft,
                args.minimum_structure_height_ft,
            ),
            "currency": {
                "knownCurrentGeometryChangeUrls": sorted(set(args.known_current_change_url)),
                "status": "stale" if args.known_current_change_url else "not-reviewed",
            },
            "releaseAssessment": {
                "publicationEligible": False,
                "samplingCoverageAtOrBelowHorizontalThresholdPercent": best_precision_coverage,
                "multipleFlightLineCoverageAtOrBelowHorizontalThresholdPercent": best_precision_multisource,
                "reportedHorizontalAccuracyWithinThreshold": (
                    args.reported_horizontal_accuracy_95_ft
                    <= args.release_horizontal_threshold_ft
                    if args.reported_horizontal_accuracy_95_ft is not None
                    else None
                ),
                "blockers": reasons,
                "note": "This script never promotes a candidate. Promotion requires a reviewed semantic mesh, quantified frame/row/obstruction uncertainty, current whole-scope geometry, and a passing independent shadow holdout.",
            },
        }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "includedNonNoisePointCount": result["returns"]["includedNonNoisePointCount"],
        "samplingCoverageAtOrBelowHorizontalThresholdPercent": best_precision_coverage,
        "multipleFlightLineCoverageAtOrBelowHorizontalThresholdPercent": best_precision_multisource,
        "currency": result["currency"]["status"],
        "publicationEligible": False,
        "blockerCount": len(reasons),
    }, indent=2))


if __name__ == "__main__":
    main()

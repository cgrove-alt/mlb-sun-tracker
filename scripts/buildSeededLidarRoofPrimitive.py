#!/usr/bin/env python3
"""Build a conservative planar roof primitive from a supported LiDAR ray seed."""

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
from scipy import ndimage


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    serialized = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(serialized).hexdigest()}"


def fit_vertical_plane(points: np.ndarray) -> np.ndarray:
    centre_x = float(np.mean(points[:, 0]))
    centre_y = float(np.mean(points[:, 1]))
    design = np.column_stack(
        [
            points[:, 0] - centre_x,
            points[:, 1] - centre_y,
            np.ones(points.shape[0]),
        ]
    )
    centred_coefficients, _, rank, _ = np.linalg.lstsq(design, points[:, 2], rcond=None)
    if rank != 3:
        raise ValueError("Plane fit is rank deficient")
    a_value, b_value, centred_intercept = centred_coefficients
    intercept = centred_intercept - a_value * centre_x - b_value * centre_y
    return np.asarray([a_value, b_value, intercept], dtype=np.float64)


def vertical_residual(points: np.ndarray, coefficients: np.ndarray) -> np.ndarray:
    return points[:, 2] - (
        coefficients[0] * points[:, 0]
        + coefficients[1] * points[:, 1]
        + coefficients[2]
    )


def fit_plane_ransac(
    points: np.ndarray,
    threshold_metres: float,
    iterations: int,
    seed: int,
) -> tuple[np.ndarray, np.ndarray]:
    if points.shape[0] < 30:
        raise ValueError("At least 30 points are required for the roof plane")
    random = np.random.default_rng(seed)
    best_inliers = np.zeros(points.shape[0], dtype=bool)
    best_median = math.inf
    for _ in range(iterations):
        selection = random.choice(points.shape[0], 3, replace=False)
        try:
            coefficients = fit_vertical_plane(points[selection])
        except ValueError:
            continue
        residual = np.abs(vertical_residual(points, coefficients))
        inliers = residual <= threshold_metres
        count = int(np.count_nonzero(inliers))
        median = float(np.median(residual[inliers])) if count else math.inf
        if count > int(np.count_nonzero(best_inliers)) or (
            count == int(np.count_nonzero(best_inliers)) and median < best_median
        ):
            best_inliers = inliers
            best_median = median
    if np.count_nonzero(best_inliers) < 30:
        raise ValueError("RANSAC did not find a stable roof plane")
    coefficients = fit_vertical_plane(points[best_inliers])
    for _ in range(3):
        residual = np.abs(vertical_residual(points, coefficients))
        refined = residual <= threshold_metres
        if np.count_nonzero(refined) < 30:
            break
        coefficients = fit_vertical_plane(points[refined])
        best_inliers = refined
    return coefficients, best_inliers


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "median": None if finite.size == 0 else float(np.median(finite)),
        "p95": None if finite.size == 0 else float(np.percentile(finite, 95)),
        "maximum": None if finite.size == 0 else float(np.max(finite)),
    }


def select_seed_component(
    candidate: np.ndarray,
    seed_row: int,
    seed_column: int,
    cell_metres: float,
    maximum_seed_distance_metres: float,
) -> tuple[np.ndarray, int, float]:
    labels, component_count = ndimage.label(candidate, structure=np.ones((3, 3), dtype=np.uint8))
    if component_count == 0:
        raise ValueError("No candidate roof component remains")
    component_id = int(labels[seed_row, seed_column])
    seed_distance = 0.0
    if component_id == 0:
        locations = np.argwhere(labels > 0)
        distance_cells = np.hypot(locations[:, 0] - seed_row, locations[:, 1] - seed_column)
        nearest_index = int(np.argmin(distance_cells))
        seed_distance = float(distance_cells[nearest_index] * cell_metres)
        if seed_distance > maximum_seed_distance_metres:
            raise ValueError("The nearest retained roof component is too far from the supported seed")
        component_id = int(labels[tuple(locations[nearest_index])])
    return labels == component_id, component_id, seed_distance


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("diagnostic", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--crossing-index", type=int, default=1)
    parser.add_argument("--search-radius-metres", type=float, default=70.0)
    parser.add_argument("--bootstrap-radius-metres", type=float, default=14.0)
    parser.add_argument("--bootstrap-height-band-metres", type=float, default=0.45)
    parser.add_argument("--plane-residual-metres", type=float, default=0.12)
    parser.add_argument("--maximum-local-relief-metres", type=float, default=0.30)
    parser.add_argument("--minimum-finite-neighbors", type=int, default=8)
    parser.add_argument("--footprint-erosion-metres", type=float, default=0.30)
    parser.add_argument("--maximum-seed-distance-metres", type=float, default=5.0)
    parser.add_argument("--minimum-primitive-area-square-metres", type=float, default=20.0)
    parser.add_argument("--point-inlier-threshold-metres", type=float, default=0.12)
    parser.add_argument("--reported-horizontal-accuracy-95-metres", type=float, default=0.18)
    parser.add_argument("--reported-vertical-accuracy-95-metres", type=float, default=0.196)
    arguments = parser.parse_args()

    diagnostic = json.loads(arguments.diagnostic.read_text(encoding="utf-8"))
    raster = json.loads(arguments.raster_metadata.read_text(encoding="utf-8"))
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    crossings = [item for item in diagnostic["crossings"] if item["supported"]]
    if not crossings:
        raise ValueError("Diagnostic has no supported crossing seed")
    if arguments.crossing_index < 1 or arguments.crossing_index > len(crossings):
        raise ValueError("Crossing index is outside the supported crossing list")
    crossing = crossings[arguments.crossing_index - 1]
    origin = diagnostic["originEastingNorthingElevationMetres"]
    azimuth = math.radians(float(diagnostic["solarPosition"]["azimuthDegrees"]))
    hit_distance = float(crossing["distanceMetres"])
    seed_x = float(origin[0]) + hit_distance * math.sin(azimuth)
    seed_y = float(origin[1]) + hit_distance * math.cos(azimuth)
    seed_z = float(crossing["surfaceElevationMetres"])

    grid = raster["grid"]
    cell_metres = float(grid["cellMetres"])
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    if list(dsm.shape) != [int(grid["rows"]), int(grid["columns"])]:
        raise ValueError("DSM shape does not match raster metadata")
    seed_column = int(math.floor((seed_x - minimum_x) / cell_metres))
    seed_row = int(math.floor((seed_y - minimum_y) / cell_metres))
    if not (0 <= seed_row < dsm.shape[0] and 0 <= seed_column < dsm.shape[1]):
        raise ValueError("Seed is outside the DSM")

    row_indices, column_indices = np.indices(dsm.shape)
    x_centres = minimum_x + (column_indices + 0.5) * cell_metres
    y_centres = minimum_y + (row_indices + 0.5) * cell_metres
    radial_distance = np.hypot(x_centres - seed_x, y_centres - seed_y)
    finite = np.isfinite(dsm)
    bootstrap = (
        finite
        & (radial_distance <= arguments.bootstrap_radius_metres)
        & (np.abs(dsm - seed_z) <= arguments.bootstrap_height_band_metres)
    )
    bootstrap_points = np.column_stack(
        [x_centres[bootstrap], y_centres[bootstrap], dsm[bootstrap]]
    )
    bootstrap_coefficients, bootstrap_inliers = fit_plane_ransac(
        bootstrap_points,
        arguments.plane_residual_metres,
        1200,
        20260808,
    )

    finite_neighbors = ndimage.convolve(
        finite.astype(np.uint8), np.ones((3, 3), dtype=np.uint8), mode="constant"
    )
    filled = np.where(finite, dsm, seed_z)
    local_max = ndimage.maximum_filter(filled, size=3, mode="nearest")
    local_min = ndimage.minimum_filter(filled, size=3, mode="nearest")
    predicted = (
        bootstrap_coefficients[0] * x_centres
        + bootstrap_coefficients[1] * y_centres
        + bootstrap_coefficients[2]
    )
    candidate = (
        finite
        & (radial_distance <= arguments.search_radius_metres)
        & (np.abs(dsm - predicted) <= arguments.plane_residual_metres)
        & (finite_neighbors >= arguments.minimum_finite_neighbors)
        & ((local_max - local_min) <= arguments.maximum_local_relief_metres)
    )
    distance_inside = ndimage.distance_transform_edt(candidate) * cell_metres
    conservative = candidate & (
        (distance_inside - cell_metres / 2.0) >= arguments.footprint_erosion_metres
    )
    primitive_mask, _, seed_distance = select_seed_component(
        conservative,
        seed_row,
        seed_column,
        cell_metres,
        arguments.maximum_seed_distance_metres,
    )
    primitive_area = float(np.count_nonzero(primitive_mask) * cell_metres**2)
    if primitive_area < arguments.minimum_primitive_area_square_metres:
        raise ValueError("Retained roof primitive is too small")

    lidar_points: list[np.ndarray] = []
    lidar_sources: list[np.ndarray] = []
    minimum_roof_x = minimum_x + float(np.min(np.argwhere(primitive_mask)[:, 1])) * cell_metres
    maximum_roof_x = minimum_x + (float(np.max(np.argwhere(primitive_mask)[:, 1])) + 1.0) * cell_metres
    minimum_roof_y = minimum_y + float(np.min(np.argwhere(primitive_mask)[:, 0])) * cell_metres
    maximum_roof_y = minimum_y + (float(np.max(np.argwhere(primitive_mask)[:, 0])) + 1.0) * cell_metres
    with laspy.open(arguments.lidar) as reader:
        crs = reader.header.parse_crs()
        if crs is None:
            raise ValueError("LiDAR source has no coordinate reference system")
        for chunk in reader.chunk_iterator(1_000_000):
            x_values = np.asarray(chunk.x)
            y_values = np.asarray(chunk.y)
            z_values = np.asarray(chunk.z)
            bounds = (
                (x_values >= minimum_roof_x)
                & (x_values <= maximum_roof_x)
                & (y_values >= minimum_roof_y)
                & (y_values <= maximum_roof_y)
            )
            if not np.any(bounds):
                continue
            selected_x = x_values[bounds]
            selected_y = y_values[bounds]
            selected_z = z_values[bounds]
            columns = np.floor((selected_x - minimum_x) / cell_metres).astype(np.int32)
            rows = np.floor((selected_y - minimum_y) / cell_metres).astype(np.int32)
            inside = (
                (rows >= 0)
                & (rows < dsm.shape[0])
                & (columns >= 0)
                & (columns < dsm.shape[1])
            )
            retained = np.zeros(rows.shape, dtype=bool)
            retained[inside] = primitive_mask[rows[inside], columns[inside]]
            selected_points = np.column_stack([selected_x, selected_y, selected_z])
            bootstrap_residual = np.abs(vertical_residual(selected_points, bootstrap_coefficients))
            retained &= bootstrap_residual <= max(0.25, arguments.plane_residual_metres * 2.0)
            if not np.any(retained):
                continue
            lidar_points.append(selected_points[retained])
            lidar_sources.append(np.asarray(chunk.point_source_id)[bounds][retained].astype(np.int32))
    if not lidar_points:
        raise ValueError("No LiDAR returns fall inside the retained primitive")
    points = np.concatenate(lidar_points)
    source_ids = np.concatenate(lidar_sources)
    unique_sources, source_counts = np.unique(source_ids, return_counts=True)
    source_count_map = {
        int(source): int(count) for source, count in zip(unique_sources, source_counts)
    }
    usable_sources = [
        int(source) for source, count in zip(unique_sources, source_counts) if count >= 30
    ]
    if len(usable_sources) >= 2:
        training_source = max(usable_sources, key=lambda source: source_count_map[source])
        training = source_ids == training_source
        holdout = np.isin(source_ids, [source for source in usable_sources if source != training_source])
        holdout_method = "disjoint point-source identifiers"
        holdout_sources = [source for source in usable_sources if source != training_source]
        training_sources = [training_source]
    else:
        spatial_key = (
            np.floor((points[:, 0] - minimum_x) / cell_metres).astype(np.int64)
            + np.floor((points[:, 1] - minimum_y) / cell_metres).astype(np.int64)
        )
        training = spatial_key % 2 == 0
        holdout = ~training
        holdout_method = "disjoint checkerboard raster cells"
        training_sources = usable_sources
        holdout_sources = usable_sources
    if np.count_nonzero(training) < 30 or np.count_nonzero(holdout) < 30:
        raise ValueError("The primitive lacks enough disjoint training and holdout returns")

    coefficients, training_inliers = fit_plane_ransac(
        points[training],
        arguments.point_inlier_threshold_metres,
        2000,
        20260809,
    )
    training_residual = np.abs(vertical_residual(points[training][training_inliers], coefficients))
    holdout_residual = np.abs(vertical_residual(points[holdout], coefficients))
    holdout_p95 = float(np.percentile(holdout_residual, 95))
    combined_vertical_95 = math.hypot(
        arguments.reported_vertical_accuracy_95_metres, holdout_p95
    )

    final_prediction = (
        coefficients[0] * x_centres + coefficients[1] * y_centres + coefficients[2]
    )
    final_candidate = (
        finite
        & (radial_distance <= arguments.search_radius_metres)
        & (np.abs(dsm - final_prediction) <= arguments.plane_residual_metres)
        & (finite_neighbors >= arguments.minimum_finite_neighbors)
        & ((local_max - local_min) <= arguments.maximum_local_relief_metres)
    )
    final_distance_inside = ndimage.distance_transform_edt(final_candidate) * cell_metres
    final_conservative = final_candidate & (
        (final_distance_inside - cell_metres / 2.0) >= arguments.footprint_erosion_metres
    )
    final_mask, _, final_seed_distance = select_seed_component(
        final_conservative,
        seed_row,
        seed_column,
        cell_metres,
        arguments.maximum_seed_distance_metres,
    )
    final_area = float(np.count_nonzero(final_mask) * cell_metres**2)
    final_footprint_surface_residual = np.abs(
        dsm[final_mask] - final_prediction[final_mask]
    )
    final_footprint_surface_residual_summary = values_summary(
        final_footprint_surface_residual
    )
    final_footprint_surface_residual_maximum = float(
        np.max(final_footprint_surface_residual)
    )
    combined_vertical_envelope = math.sqrt(
        arguments.reported_vertical_accuracy_95_metres**2
        + holdout_p95**2
        + final_footprint_surface_residual_maximum**2
    )

    rows, columns = np.argwhere(final_mask).T
    local_row_start = max(0, int(rows.min()) - 20)
    local_row_stop = min(dsm.shape[0], int(rows.max()) + 21)
    local_column_start = max(0, int(columns.min()) - 20)
    local_column_stop = min(dsm.shape[1], int(columns.max()) + 21)
    local_dsm = dsm[local_row_start:local_row_stop, local_column_start:local_column_stop]
    finite_local = local_dsm[np.isfinite(local_dsm)]
    lower = float(np.percentile(finite_local, 5))
    upper = float(np.percentile(finite_local, 95))
    normalized = np.nan_to_num(
        (local_dsm - lower) / max(1e-9, upper - lower),
        nan=0.0,
        posinf=1.0,
        neginf=0.0,
    )
    grayscale = (np.clip(normalized, 0.0, 1.0) * 255.0).astype(np.uint8)
    base = Image.fromarray(np.flipud(grayscale)).convert("RGBA")
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    overlay_array = np.zeros((base.height, base.width, 4), dtype=np.uint8)
    local_mask = final_mask[local_row_start:local_row_stop, local_column_start:local_column_stop]
    overlay_array[np.flipud(local_mask)] = (0, 220, 120, 125)
    overlay = Image.fromarray(overlay_array)
    rendered = Image.alpha_composite(base, overlay)
    draw = ImageDraw.Draw(rendered, mode="RGBA")
    seed_pixel = (
        seed_column - local_column_start,
        local_row_stop - 1 - seed_row,
    )
    draw.ellipse(
        (seed_pixel[0] - 5, seed_pixel[1] - 5, seed_pixel[0] + 5, seed_pixel[1] + 5),
        fill=(255, 210, 0, 255),
        outline=(20, 20, 20, 255),
        width=2,
    )
    rendered = rendered.resize((rendered.width * 3, rendered.height * 3), Image.Resampling.NEAREST)

    arguments.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        arguments.output_npz,
        mask=final_mask,
        plane_coefficients=coefficients,
        minimum_x_metres=np.asarray([minimum_x]),
        minimum_y_metres=np.asarray([minimum_y]),
        cell_metres=np.asarray([cell_metres]),
    )
    rendered.convert("RGB").save(arguments.output_png, format="PNG", optimize=True)
    stable = {
        "diagnosticSha256": sha256_file(arguments.diagnostic),
        "rasterMetadataSha256": sha256_file(arguments.raster_metadata),
        "dsmSha256": sha256_file(arguments.dsm_npy),
        "lidarSha256": sha256_file(arguments.lidar),
        "npzSha256": sha256_file(arguments.output_npz),
        "seedEastingNorthingElevationMetres": [seed_x, seed_y, seed_z],
        "planeCoefficientsZFromEastingNorthing": coefficients.tolist(),
        "finalAreaSquareMetres": final_area,
        "finalFootprintAbsoluteDsmToPlaneResidualMetres": (
            final_footprint_surface_residual_summary
        ),
        "combinedVerticalEnvelopeMetres": combined_vertical_envelope,
        "parameters": {
            "searchRadiusMetres": arguments.search_radius_metres,
            "bootstrapRadiusMetres": arguments.bootstrap_radius_metres,
            "bootstrapHeightBandMetres": arguments.bootstrap_height_band_metres,
            "planeResidualMetres": arguments.plane_residual_metres,
            "maximumLocalReliefMetres": arguments.maximum_local_relief_metres,
            "minimumFiniteNeighbors": arguments.minimum_finite_neighbors,
            "footprintErosionMetres": arguments.footprint_erosion_metres,
            "minimumPrimitiveAreaSquareMetres": arguments.minimum_primitive_area_square_metres,
            "pointInlierThresholdMetres": arguments.point_inlier_threshold_metres,
            "reportedHorizontalAccuracy95Metres": arguments.reported_horizontal_accuracy_95_metres,
            "reportedVerticalAccuracy95Metres": arguments.reported_vertical_accuracy_95_metres,
        },
    }
    eligible_geometry = (
        final_area >= arguments.minimum_primitive_area_square_metres
        and combined_vertical_envelope <= 0.3048
        and arguments.reported_horizontal_accuracy_95_metres <= 0.3048
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "seeded-lidar-planar-roof-primitive",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "diagnostic": {"path": str(arguments.diagnostic), "sha256": stable["diagnosticSha256"]},
            "rasterMetadata": {"path": str(arguments.raster_metadata), "sha256": stable["rasterMetadataSha256"]},
            "dsm": {"path": str(arguments.dsm_npy), "sha256": stable["dsmSha256"]},
            "lidar": {"path": str(arguments.lidar), "sha256": stable["lidarSha256"]},
        },
        "seed": {
            "rowKey": diagnostic["rowKey"],
            "candidateId": diagnostic["candidateId"],
            "supportedCrossingIndex": arguments.crossing_index,
            "eastingNorthingElevationMetres": [seed_x, seed_y, seed_z],
            "distanceToBootstrapPrimitiveMetres": seed_distance,
            "distanceToFinalPrimitiveMetres": final_seed_distance,
        },
        "coordinateReferenceSystem": raster["source"]["coordinateReferenceSystem"],
        "plane": {
            "equation": "z = a * easting + b * northing + c",
            "coefficients": {"a": float(coefficients[0]), "b": float(coefficients[1]), "c": float(coefficients[2])},
            "trainingMethod": "deterministic RANSAC followed by least-squares refinement",
            "trainingObservationCount": int(np.count_nonzero(training)),
            "trainingInlierCount": int(np.count_nonzero(training_inliers)),
            "trainingSources": training_sources,
            "trainingAbsoluteVerticalResidualMetres": values_summary(training_residual),
            "holdoutMethod": holdout_method,
            "holdoutObservationCount": int(np.count_nonzero(holdout)),
            "holdoutSources": holdout_sources,
            "holdoutAbsoluteVerticalResidualMetres": values_summary(holdout_residual),
            "reportedSourceVerticalAccuracy95Metres": arguments.reported_vertical_accuracy_95_metres,
            "combinedVerticalAccuracy95Metres": combined_vertical_95,
            "combinedVerticalEnvelopeMetres": combined_vertical_envelope,
        },
        "footprint": {
            "representation": "eroded 0.3 metre raster cells",
            "npzPath": str(arguments.output_npz),
            "npzSha256": stable["npzSha256"],
            "cellMetres": cell_metres,
            "cellCount": int(np.count_nonzero(final_mask)),
            "areaSquareMetres": final_area,
            "erosionMetres": arguments.footprint_erosion_metres,
            "reportedSourceHorizontalAccuracy95Metres": arguments.reported_horizontal_accuracy_95_metres,
            "absoluteDsmToPlaneResidualMetres": (
                final_footprint_surface_residual_summary
            ),
        },
        "lidarPointSources": source_count_map,
        "parameters": stable["parameters"],
        "diagnosticPng": str(arguments.output_png),
        "assessment": {
            "metricGeometryEligible": eligible_geometry,
            "publicationEligible": False,
            "blockers": [
                "ROOF_FOOTPRINT_SEMANTICS_REQUIRE_INDEPENDENT_ORTHOPHOTO_CLASSIFICATION",
                "CURRENT_2026_STRUCTURE_EXISTENCE_REQUIRES_VERIFICATION",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": "The primitive is a conservative interior of one measured planar top surface. It is not considered opaque or current until independent evidence clears the remaining gates.",
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "outputNpz": str(arguments.output_npz),
        "outputPng": str(arguments.output_png),
        "artifactVersion": artifact["artifactVersion"],
        "areaSquareMetres": final_area,
        "plane": artifact["plane"],
        "lidarPointSources": source_count_map,
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

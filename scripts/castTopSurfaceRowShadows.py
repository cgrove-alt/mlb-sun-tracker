#!/usr/bin/env python3
"""Confirm row shade only where rays cross measured smooth LiDAR top surfaces."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
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


def percentile(values: list[float], probability: float) -> float | None:
    if not values:
        return None
    return float(np.percentile(np.asarray(values, dtype=np.float64), probability))


def ring_seat_samples(rings: list[list[list[float]]], seat_count: int) -> list[list[float]]:
    parts: list[tuple[np.ndarray, float]] = []
    for raw_ring in rings:
        ring = np.asarray(raw_ring, dtype=np.float64)
        if np.allclose(ring[0], ring[-1]):
            ring = ring[:-1]
        center = ring.mean(axis=0)
        _, _, right_vectors = np.linalg.svd(ring - center, full_matrices=False)
        axis = right_vectors[0]
        projection = (ring - center) @ axis
        minimum = float(projection.min())
        maximum = float(projection.max())
        parts.append((np.stack([center + minimum * axis, center + maximum * axis]), maximum - minimum))
    if not parts:
        return []
    allocations = [max(1, round(seat_count * length / sum(item[1] for item in parts))) for _, length in parts]
    while sum(allocations) > seat_count and max(allocations) > 1:
        allocations[int(np.argmax(allocations))] -= 1
    while sum(allocations) < seat_count:
        allocations[int(np.argmax([length / count for (_, length), count in zip(parts, allocations)]))] += 1
    samples: list[list[float]] = []
    for (ends, _), count in zip(parts, allocations):
        fractions = np.asarray([0.5]) if count == 1 else np.linspace(0.05, 0.95, count)
        for fraction in fractions:
            point = ends[0] * (1.0 - fraction) + ends[1] * fraction
            samples.append([float(point[0]), float(point[1])])
    return samples


def build_surface_support(
    dsm: np.ndarray,
    cell_metres: float,
    maximum_local_relief_metres: float,
    minimum_component_area_square_metres: float,
    erosion_metres: float,
    support_method: str = "robust-median",
    maximum_local_mad_metres: float = 0.12,
    minimum_finite_neighbors: int = 7,
) -> tuple[np.ndarray, np.ndarray, dict[str, Any]]:
    finite = np.isfinite(dsm)
    if support_method == "strict-range":
        filled_max = np.where(finite, dsm, -np.inf)
        filled_min = np.where(finite, dsm, np.inf)
        local_max = ndimage.maximum_filter(filled_max, size=3, mode="constant", cval=-np.inf)
        local_min = ndimage.minimum_filter(filled_min, size=3, mode="constant", cval=np.inf)
        complete_neighborhood = ndimage.minimum_filter(
            finite.astype(np.uint8), size=3, mode="constant"
        ) > 0
        smooth = complete_neighborhood & ((local_max - local_min) <= maximum_local_relief_metres)
    elif support_method == "robust-median":
        nearest_indices = ndimage.distance_transform_edt(
            ~finite, return_distances=False, return_indices=True
        )
        filled = dsm[tuple(nearest_indices)]
        local_median = ndimage.median_filter(filled, size=3, mode="nearest")
        local_absolute_deviation = np.abs(filled - local_median)
        local_mad = ndimage.median_filter(local_absolute_deviation, size=3, mode="nearest")
        finite_neighbors = ndimage.convolve(
            finite.astype(np.uint8), np.ones((3, 3), dtype=np.uint8), mode="constant"
        )
        smooth = (
            finite
            & (finite_neighbors >= minimum_finite_neighbors)
            & (np.abs(dsm - local_median) <= maximum_local_relief_metres)
            & (local_mad <= maximum_local_mad_metres)
        )
    else:
        raise ValueError(f"Unsupported surface support method: {support_method}")
    labels, raw_component_count = ndimage.label(smooth, structure=np.ones((3, 3), dtype=np.uint8))
    counts = np.bincount(labels.ravel())
    minimum_cells = max(1, math.ceil(minimum_component_area_square_metres / cell_metres**2))
    retained_ids = np.flatnonzero(counts >= minimum_cells)
    retained_ids = retained_ids[retained_ids != 0]
    retained = np.isin(labels, retained_ids)
    distance_inside = ndimage.distance_transform_edt(retained) * cell_metres
    # The transform measures between cell centres. Subtracting half a cell
    # makes the clearance conservative relative to the measured cell edge.
    eroded = retained & ((distance_inside - cell_metres / 2.0) >= erosion_metres)
    fragment_labels, fragment_component_count = ndimage.label(
        eroded, structure=np.ones((3, 3), dtype=np.uint8)
    )
    fragment_counts = np.bincount(fragment_labels.ravel())
    retained_fragment_ids = np.flatnonzero(fragment_counts >= minimum_cells)
    retained_fragment_ids = retained_fragment_ids[retained_fragment_ids != 0]
    eroded = np.isin(fragment_labels, retained_fragment_ids)
    retained_labels, retained_component_count = ndimage.label(
        eroded, structure=np.ones((3, 3), dtype=np.uint8)
    )
    retained_counts = np.bincount(retained_labels.ravel())
    component_areas = (retained_counts[1:] * cell_metres**2).tolist()
    return eroded, retained_labels, {
        "supportMethod": support_method,
        "maximumLocalMadMetres": maximum_local_mad_metres,
        "minimumFiniteNeighbors": minimum_finite_neighbors,
        "finiteCellCount": int(finite.sum()),
        "smoothCellCount": int(smooth.sum()),
        "rawSmoothComponentCount": int(raw_component_count),
        "minimumComponentCellCount": minimum_cells,
        "preErosionRetainedCellCount": int(retained.sum()),
        "postErosionFragmentCountBeforeAreaFilter": int(fragment_component_count),
        "postErosionRetainedCellCount": int(eroded.sum()),
        "postErosionComponentCount": int(retained_component_count),
        "componentAreaSquareMetres": {
            "minimum": min(component_areas) if component_areas else None,
            "median": percentile(component_areas, 50),
            "p95": percentile(component_areas, 95),
            "maximum": max(component_areas) if component_areas else None,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--maximum-local-relief-metres", type=float, default=0.45)
    parser.add_argument("--support-method", choices=("strict-range", "robust-median"), default="robust-median")
    parser.add_argument("--maximum-local-mad-metres", type=float, default=0.12)
    parser.add_argument("--minimum-finite-neighbors", type=int, default=7)
    parser.add_argument("--minimum-component-area-square-metres", type=float, default=20.0)
    parser.add_argument("--horizontal-uncertainty-95-metres", type=float, default=0.25)
    parser.add_argument("--vertical-uncertainty-95-metres", type=float, default=0.22)
    parser.add_argument("--orientation-uncertainty-95-degrees", type=float, default=0.07)
    parser.add_argument("--maximum-distance-metres", type=float, default=300.0)
    arguments = parser.parse_args()
    if arguments.maximum_local_relief_metres <= 0:
        raise ValueError("Maximum local relief must be positive")
    if arguments.minimum_component_area_square_metres <= 0:
        raise ValueError("Minimum component area must be positive")

    row_bytes = arguments.rows.read_bytes()
    raster_bytes = arguments.raster_metadata.read_bytes()
    observation_bytes = arguments.observations.read_bytes()
    datum_bytes = arguments.vertical_datum.read_bytes()
    row_artifact = json.loads(row_bytes)
    raster_artifact = json.loads(raster_bytes)
    observation_artifact = json.loads(observation_bytes)
    datum_artifact = json.loads(datum_bytes)
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    grid = raster_artifact["grid"]
    if list(dsm.shape) != [grid["rows"], grid["columns"]]:
        raise ValueError("DSM shape does not match metadata")
    expected_dsm_sha = raster_artifact["rasterOutputs"]["dsmMaximumZMetres"]["sha256"]
    actual_dsm_sha = sha256_file(arguments.dsm_npy)
    if expected_dsm_sha != actual_dsm_sha:
        raise ValueError("DSM checksum mismatch")
    datum_offset = float(datum_artifact["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"])
    selected_sections = set(arguments.section)
    rows = [row for row in row_artifact["rows"] if row["sectionId"] in selected_sections]
    if not rows:
        raise ValueError("No selected rows are present")
    incomplete_rows = [row["rowKey"] for row in rows if not row.get("horizontalGeometry")]
    if incomplete_rows:
        raise ValueError(f"Selected rows lack horizontal geometry: {incomplete_rows[:5]}")

    cell_metres = float(grid["cellMetres"])
    support, component_labels, support_summary = build_surface_support(
        dsm,
        cell_metres,
        arguments.maximum_local_relief_metres,
        arguments.minimum_component_area_square_metres,
        arguments.horizontal_uncertainty_95_metres,
        arguments.support_method,
        arguments.maximum_local_mad_metres,
        arguments.minimum_finite_neighbors,
    )
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    row_count, column_count = dsm.shape
    step_metres = cell_metres / 4.0
    distances = np.arange(step_metres, arguments.maximum_distance_metres + step_metres, step_metres)

    def sample_surface(easting: float, northing: float) -> tuple[float, int] | None:
        column_value = (easting - minimum_x) / cell_metres - 0.5
        row_value = (northing - minimum_y) / cell_metres - 0.5
        column = math.floor(column_value)
        row = math.floor(row_value)
        if row < 0 or column < 0 or row + 1 >= row_count or column + 1 >= column_count:
            return None
        cells = [(row, column), (row, column + 1), (row + 1, column), (row + 1, column + 1)]
        labels = [int(component_labels[item]) for item in cells]
        if labels[0] == 0 or any(label != labels[0] for label in labels[1:]):
            return None
        if not all(bool(support[item]) for item in cells):
            return None
        values = [float(dsm[item]) for item in cells]
        if not all(math.isfinite(value) for value in values):
            return None
        x_fraction = column_value - column
        y_fraction = row_value - row
        top = (
            values[0] * (1 - x_fraction) * (1 - y_fraction)
            + values[1] * x_fraction * (1 - y_fraction)
            + values[2] * (1 - x_fraction) * y_fraction
            + values[3] * x_fraction * y_fraction
        )
        return top, labels[0]

    def cast(origin: list[float], azimuth_degrees: float, altitude_degrees: float) -> dict[str, Any]:
        azimuth = math.radians(azimuth_degrees % 360.0)
        tangent = math.tan(math.radians(altitude_degrees))
        east = origin[0] + distances * math.sin(azimuth)
        north = origin[1] + distances * math.cos(azimuth)
        ray_z = origin[2] + distances * tangent
        active_component = 0
        negative_margin: tuple[int, float, float] | None = None
        for index, (x_value, y_value, z_value) in enumerate(zip(east, north, ray_z)):
            sampled = sample_surface(float(x_value), float(y_value))
            if sampled is None:
                active_component = 0
                negative_margin = None
                continue
            surface_z, component = sampled
            if component != active_component:
                active_component = component
                negative_margin = None
            difference = float(z_value - surface_z)
            if difference <= -arguments.vertical_uncertainty_95_metres:
                negative_margin = (index, float(z_value), surface_z)
            elif difference >= arguments.vertical_uncertainty_95_metres and negative_margin is not None:
                low_index, low_ray_z, low_surface_z = negative_margin
                low_difference = low_ray_z - low_surface_z
                fraction = -low_difference / max(1e-12, difference - low_difference)
                hit_distance = float(distances[low_index] + fraction * (distances[index] - distances[low_index]))
                return {
                    "classification": "confirmed-top-surface-crossing",
                    "componentId": component,
                    "distanceMetres": hit_distance,
                    "eastingMetres": float(origin[0] + hit_distance * math.sin(azimuth)),
                    "northingMetres": float(origin[1] + hit_distance * math.cos(azimuth)),
                    "elevationMetresNavd88": float(origin[2] + hit_distance * tangent),
                    "negativeBracketMarginMetres": float(-low_difference),
                    "positiveBracketMarginMetres": difference,
                }
        return {"classification": "no-confirmed-top-surface-crossing"}

    candidates = observation_artifact["candidates"]
    results: list[dict[str, Any]] = []
    for candidate in candidates:
        altitude = float(candidate["solarPositionAtMidpoint"]["altitudeDegrees"])
        azimuth = float(candidate["solarPositionAtMidpoint"]["azimuthDegrees"])
        row_results: list[dict[str, Any]] = []
        for row in rows:
            positions = ring_seat_samples(
                row["horizontalGeometry"]["rings"], int(row["publishedSeatCount"])
            )
            eye_elevation = float(row["venueLocalPosition"][1]) + datum_offset
            seats: list[dict[str, Any]] = []
            for seat_index, position in enumerate(positions, start=1):
                origin = [position[0], position[1], eye_elevation]
                rays = [
                    cast(origin, azimuth + delta, altitude)
                    for delta in (
                        -arguments.orientation_uncertainty_95_degrees,
                        0.0,
                        arguments.orientation_uncertainty_95_degrees,
                    )
                ]
                confirmed = all(ray["classification"] == "confirmed-top-surface-crossing" for ray in rays)
                seats.append(
                    {
                        "seatSampleIndex": seat_index,
                        "originEastingNorthingElevationMetres": origin,
                        "classification": "confirmed-shade" if confirmed else "no-confirmed-top-surface-hit",
                        "orientationBoundRays": rays,
                    }
                )
            confirmed_count = sum(seat["classification"] == "confirmed-shade" for seat in seats)
            row_results.append(
                {
                    "rowKey": row["rowKey"],
                    "sectionId": row["sectionId"],
                    "rowId": row["rowId"],
                    "seatSampleCount": len(seats),
                    "confirmedShadeCount": confirmed_count,
                    "classification": (
                        "confirmed-shade"
                        if confirmed_count == len(seats)
                        else "no-confirmed-top-surface-hit"
                        if confirmed_count == 0
                        else "mixed"
                    ),
                    "seats": seats,
                }
            )
        results.append(
            {
                "candidateId": candidate["candidateId"],
                "midpointTime": candidate["event"]["midpointTime"],
                "solarPosition": candidate["solarPositionAtMidpoint"],
                "rows": row_results,
            }
        )

    stable = {
        "rowArtifactSha256": hashlib.sha256(row_bytes).hexdigest(),
        "rasterArtifactSha256": hashlib.sha256(raster_bytes).hexdigest(),
        "dsmSha256": actual_dsm_sha,
        "observationArtifactSha256": hashlib.sha256(observation_bytes).hexdigest(),
        "datumArtifactSha256": hashlib.sha256(datum_bytes).hexdigest(),
        "sections": sorted(selected_sections),
        "parameters": {
            "maximumLocalReliefMetres": arguments.maximum_local_relief_metres,
            "supportMethod": arguments.support_method,
            "maximumLocalMadMetres": arguments.maximum_local_mad_metres,
            "minimumFiniteNeighbors": arguments.minimum_finite_neighbors,
            "minimumComponentAreaSquareMetres": arguments.minimum_component_area_square_metres,
            "horizontalUncertainty95Metres": arguments.horizontal_uncertainty_95_metres,
            "verticalUncertainty95Metres": arguments.vertical_uncertainty_95_metres,
            "orientationUncertainty95Degrees": arguments.orientation_uncertainty_95_degrees,
            "maximumDistanceMetres": arguments.maximum_distance_metres,
            "stepMetres": step_metres,
        },
        "surfaceSupport": support_summary,
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "eroded-robust-lidar-top-surface-crossing-v2",
        "artifactStage": "measured-top-surface-row-shadow-candidates",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "rows": {"path": str(arguments.rows), "sha256": hashlib.sha256(row_bytes).hexdigest()},
            "rasterMetadata": {"path": str(arguments.raster_metadata), "sha256": hashlib.sha256(raster_bytes).hexdigest()},
            "dsm": {"path": str(arguments.dsm_npy), "sha256": actual_dsm_sha},
            "observations": {"path": str(arguments.observations), "sha256": hashlib.sha256(observation_bytes).hexdigest()},
            "verticalDatum": {"path": str(arguments.vertical_datum), "sha256": hashlib.sha256(datum_bytes).hexdigest()},
        },
        "sections": sorted(selected_sections),
        "parameters": stable["parameters"],
        "surfaceSupport": support_summary,
        "results": results,
        "assessment": {
            "measurementEligibleDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "SMOOTH_TOP_COMPONENTS_NOT_YET_SEMANTICALLY_CLASSIFIED_AS_OPAQUE_CURRENT_STRUCTURES",
                "CURRENT_ROW_HORIZONTAL_CONTROL_NOT_FULLY_RELEASE_ELIGIBLE",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": "A confirmed result requires a ray to cross an eroded continuous measured top surface with vertical uncertainty margins on both sides. A miss does not establish sun.",
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    row_classifications = [
        row["classification"] for result in results for row in result["rows"]
    ]
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "sections": artifact["sections"],
                "surfaceSupport": support_summary,
                "candidateCount": len(results),
                "rowClassificationCounts": {
                    value: row_classifications.count(value)
                    for value in sorted(set(row_classifications))
                },
                "assessment": artifact["assessment"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

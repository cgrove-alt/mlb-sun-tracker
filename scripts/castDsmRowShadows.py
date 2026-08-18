#!/usr/bin/env python3
"""Cast row-sample rays through a georeferenced LiDAR DSM."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ring_samples(raw_ring: list[list[float]], requested: int) -> list[list[float]]:
    ring = np.asarray(raw_ring, dtype=np.float64)
    if np.allclose(ring[0], ring[-1]):
        ring = ring[:-1]
    center = ring.mean(axis=0)
    centered = ring - center
    _, _, right_vectors = np.linalg.svd(centered, full_matrices=False)
    major_axis = right_vectors[0]
    projections = centered @ major_axis
    minimum = float(projections.min())
    maximum = float(projections.max())
    if requested <= 1 or maximum - minimum < 0.25:
        return [[float(value) for value in center]]
    inset = min(0.25, (maximum - minimum) * 0.1)
    positions = np.linspace(minimum + inset, maximum - inset, requested)
    return [
        [float(value) for value in center + position * major_axis]
        for position in positions
    ]


def row_samples(row: dict, maximum_samples: int) -> list[list[float]]:
    rings = row["horizontalGeometry"]["rings"]
    lengths = []
    for raw_ring in rings:
        ring = np.asarray(raw_ring, dtype=np.float64)
        if np.allclose(ring[0], ring[-1]):
            ring = ring[:-1]
        centered = ring - ring.mean(axis=0)
        _, singular, _ = np.linalg.svd(centered, full_matrices=False)
        lengths.append(float(singular[0]))
    target = min(maximum_samples, max(1, int(row["publishedSeatCount"])))
    total_length = sum(lengths)
    allocations = [max(1, round(target * length / total_length)) for length in lengths]
    while sum(allocations) > target and max(allocations) > 1:
        index = max(range(len(allocations)), key=lambda item: allocations[item])
        allocations[index] -= 1
    while sum(allocations) < target:
        index = max(range(len(allocations)), key=lambda item: lengths[item] / allocations[item])
        allocations[index] += 1
    samples = []
    for ring, count in zip(rings, allocations):
        samples.extend(ring_samples(ring, count))
    return samples


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--sun-azimuth-degrees", type=float, required=True)
    parser.add_argument("--sun-elevation-degrees", type=float, required=True)
    parser.add_argument("--vertical-margin-metres", type=float, default=0.15)
    parser.add_argument("--maximum-row-samples", type=int, default=9)
    parser.add_argument("--maximum-distance-metres", type=float, default=400.0)
    parser.add_argument("--start-distance-metres", type=float, default=0.60)
    parser.add_argument("--include-ineligible-diagnostics", action="store_true")
    arguments = parser.parse_args()
    if arguments.sun_elevation_degrees <= 0 or arguments.sun_elevation_degrees >= 90:
        raise ValueError("Sun elevation must be between 0 and 90 degrees")
    if arguments.maximum_row_samples < 1:
        raise ValueError("Maximum row samples must be positive")

    rows_artifact = json.loads(arguments.rows.read_text(encoding="utf-8"))
    raster_artifact = json.loads(arguments.raster_metadata.read_text(encoding="utf-8"))
    if rows_artifact.get("artifactKind") != "current-georeferenced-row-geometry-candidate":
        raise ValueError("Invalid georeferenced row artifact")
    if raster_artifact.get("artifactKind") != "lidar-registration-control-raster":
        raise ValueError("Invalid raster metadata artifact")
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    grid = raster_artifact["grid"]
    if list(dsm.shape) != [grid["rows"], grid["columns"]]:
        raise ValueError("DSM shape does not match raster metadata")
    expected_hash = raster_artifact.get("rasterOutputs", {}).get("dsmMaximumZMetres", {}).get("sha256")
    actual_hash = sha256_file(arguments.dsm_npy)
    if expected_hash and expected_hash != actual_hash:
        raise ValueError("DSM fingerprint does not match raster metadata")

    cell_metres = float(grid["cellMetres"])
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    row_count, column_count = dsm.shape
    azimuth = math.radians(arguments.sun_azimuth_degrees % 360.0)
    elevation = math.radians(arguments.sun_elevation_degrees)
    east_direction = math.sin(azimuth)
    north_direction = math.cos(azimuth)
    vertical_per_horizontal = math.tan(elevation)
    step_metres = cell_metres * 0.5
    distances = np.arange(
        arguments.start_distance_metres,
        arguments.maximum_distance_metres + step_metres,
        step_metres,
        dtype=np.float64,
    )

    def grid_cell(easting: float, northing: float) -> tuple[int, int]:
        return (
            int(math.floor((northing - minimum_y) / cell_metres)),
            int(math.floor((easting - minimum_x) / cell_metres)),
        )

    def cast(sample: list[float], elevation_metres: float) -> dict:
        origin_row, origin_column = grid_cell(sample[0], sample[1])
        if not (0 <= origin_row < row_count and 0 <= origin_column < column_count):
            return {"classification": "outside-raster"}

        eastings = sample[0] + distances * east_direction
        northings = sample[1] + distances * north_direction
        columns = np.floor((eastings - minimum_x) / cell_metres).astype(np.int32)
        rows = np.floor((northings - minimum_y) / cell_metres).astype(np.int32)
        inside = (rows >= 0) & (rows < row_count) & (columns >= 0) & (columns < column_count)
        if not inside.any():
            return {"classification": "outside-raster"}
        first_outside = np.flatnonzero(~inside)
        stop = int(first_outside[0]) if first_outside.size else len(distances)
        rows = rows[:stop]
        columns = columns[:stop]
        ray_distances = distances[:stop]
        if not len(rows):
            return {"classification": "outside-raster"}
        unique = np.r_[True, (rows[1:] != rows[:-1]) | (columns[1:] != columns[:-1])]
        rows = rows[unique]
        columns = columns[unique]
        ray_distances = ray_distances[unique]
        surface = dsm[rows, columns]
        ray_elevation = elevation_metres + ray_distances * vertical_per_horizontal
        finite = np.isfinite(surface)
        definite = finite & (surface >= ray_elevation + arguments.vertical_margin_metres)
        possible = finite & (surface >= ray_elevation - arguments.vertical_margin_metres)
        matched = np.flatnonzero(definite)
        if matched.size:
            index = int(matched[0])
            return {
                "classification": "definitely-shaded",
                "reason": "ray-intersection",
                "obstructionDistanceMetres": float(ray_distances[index]),
                "obstructionElevationMetres": float(surface[index]),
                "rayElevationMetres": float(ray_elevation[index]),
            }
        matched = np.flatnonzero(possible)
        if matched.size:
            index = int(matched[0])
            return {
                "classification": "uncertain",
                "reason": "within-vertical-margin",
                "obstructionDistanceMetres": float(ray_distances[index]),
                "obstructionElevationMetres": float(surface[index]),
                "rayElevationMetres": float(ray_elevation[index]),
            }
        return {
            "classification": "definitely-sun",
            "reason": "clear-ray-within-raster",
            "testedDistanceMetres": float(ray_distances[-1]),
        }

    results = []
    skipped = []
    for row in rows_artifact["rows"]:
        vertical = row.get("verticalGeometry", {})
        elevation_metres = vertical.get("elevationMetresNavd88")
        if elevation_metres is None:
            skipped.append({
                "rowKey": row["rowKey"],
                "reason": "NO_VERTICAL_GEOMETRY",
            })
            continue
        geometry_eligible = bool(vertical.get("publicationEligible", False))
        if not geometry_eligible and not arguments.include_ineligible_diagnostics:
            skipped.append({
                "rowKey": row["rowKey"],
                "reason": "VERTICAL_GEOMETRY_NOT_ELIGIBLE",
                "blockers": vertical.get("blockers", []),
            })
            continue
        samples = row_samples(row, arguments.maximum_row_samples)
        sample_results = [cast(sample, float(elevation_metres)) for sample in samples]
        counts = {
            classification: sum(
                result["classification"] == classification for result in sample_results
            )
            for classification in ["definitely-shaded", "uncertain", "definitely-sun", "outside-raster"]
        }
        usable = len(sample_results) - counts["outside-raster"]
        results.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "geometryEligible": geometry_eligible,
            "originElevationMetresNavd88": float(elevation_metres),
            "verticalGeometryMethod": vertical.get("method"),
            "sampleCount": len(sample_results),
            "shadeFractionLowerBound": counts["definitely-shaded"] / usable if usable else None,
            "shadeFractionUpperBound": (
                (counts["definitely-shaded"] + counts["uncertain"]) / usable if usable else None
            ),
            "classificationCounts": counts,
            "samples": [
                {"positionMetres": sample, **result}
                for sample, result in zip(samples, sample_results)
            ],
        })

    stable_payload = {
        "rowArtifactVersion": rows_artifact["artifactVersion"],
        "rasterArtifactVersion": raster_artifact["artifactVersion"],
        "dsmSha256": actual_hash,
        "sunAzimuthDegrees": arguments.sun_azimuth_degrees % 360.0,
        "sunElevationDegrees": arguments.sun_elevation_degrees,
        "verticalMarginMetres": arguments.vertical_margin_metres,
        "includeIneligibleDiagnostics": arguments.include_ineligible_diagnostics,
        "results": results,
        "skipped": skipped,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 2,
        "artifactKind": "lidar-dsm-row-shadow-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": rows_artifact["stadiumId"],
        "sources": {
            "rowArtifactVersion": rows_artifact["artifactVersion"],
            "rasterArtifactVersion": raster_artifact["artifactVersion"],
            "dsmSha256": actual_hash,
        },
        "sun": {
            "azimuthDegrees": arguments.sun_azimuth_degrees % 360.0,
            "elevationDegrees": arguments.sun_elevation_degrees,
            "directionFrame": "georeferenced compass bearing",
        },
        "rayParameters": {
            "cellMetres": cell_metres,
            "stepMetres": step_metres,
            "verticalMarginMetres": arguments.vertical_margin_metres,
            "maximumDistanceMetres": arguments.maximum_distance_metres,
            "startDistanceMetres": arguments.start_distance_metres,
            "includeIneligibleDiagnostics": arguments.include_ineligible_diagnostics,
        },
        "counts": {
            "rowsCast": len(results),
            "rowsSkipped": len(skipped),
            "samplesCast": sum(result["sampleCount"] for result in results),
            "definitelyShadedSamples": sum(result["classificationCounts"]["definitely-shaded"] for result in results),
            "uncertainSamples": sum(result["classificationCounts"]["uncertain"] for result in results),
            "definitelySunSamples": sum(result["classificationCounts"]["definitely-sun"] for result in results),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ROW_GEOMETRY_NOT_FULLY_ELIGIBLE",
                "DSM_SOURCE_CURRENCY_NOT_VERIFIED",
                "DSM_OCCLUDED_SURFACES_NOT_RECONSTRUCTED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": results,
        "skippedRows": skipped,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "sun": artifact["sun"],
        "counts": artifact["counts"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

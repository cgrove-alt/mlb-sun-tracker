#!/usr/bin/env python3
"""Render a georeferenced seat-to-sun ray against a measured LiDAR DSM profile."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from castTopSurfaceRowShadows import build_surface_support, ring_seat_samples


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--section", required=True)
    parser.add_argument("--row", required=True)
    parser.add_argument("--seat-sample-index", type=int, required=True)
    parser.add_argument("--candidate-index", type=int, required=True)
    parser.add_argument("--maximum-distance-metres", type=float, default=120.0)
    parser.add_argument("--step-metres", type=float, default=0.05)
    parser.add_argument("--maximum-local-relief-metres", type=float, default=0.45)
    parser.add_argument("--support-method", choices=("strict-range", "robust-median"), default="robust-median")
    parser.add_argument("--maximum-local-mad-metres", type=float, default=0.12)
    parser.add_argument("--minimum-finite-neighbors", type=int, default=7)
    parser.add_argument("--minimum-component-area-square-metres", type=float, default=20.0)
    parser.add_argument("--erosion-metres", type=float, default=0.25)
    arguments = parser.parse_args()

    row_artifact = json.loads(arguments.rows.read_text(encoding="utf-8"))
    raster = json.loads(arguments.raster_metadata.read_text(encoding="utf-8"))
    observations = json.loads(arguments.observations.read_text(encoding="utf-8"))
    datum = json.loads(arguments.vertical_datum.read_text(encoding="utf-8"))
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    row = next(
        item
        for item in row_artifact["rows"]
        if item["sectionId"] == arguments.section and item["rowId"] == arguments.row
    )
    positions = ring_seat_samples(row["horizontalGeometry"]["rings"], row["publishedSeatCount"])
    if arguments.seat_sample_index < 1 or arguments.seat_sample_index > len(positions):
        raise ValueError("Seat sample index is outside the row")
    horizontal = positions[arguments.seat_sample_index - 1]
    datum_offset = datum["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"]
    origin = [horizontal[0], horizontal[1], row["venueLocalPosition"][1] + datum_offset]
    if arguments.candidate_index < 1 or arguments.candidate_index > len(observations["candidates"]):
        raise ValueError("Candidate index is outside the observation artifact")
    candidate = observations["candidates"][arguments.candidate_index - 1]
    solar = candidate["solarPositionAtMidpoint"]
    azimuth = math.radians(solar["azimuthDegrees"])
    tangent = math.tan(math.radians(solar["altitudeDegrees"]))

    cell_metres = float(raster["grid"]["cellMetres"])
    support, labels, support_summary = build_surface_support(
        dsm,
        cell_metres,
        arguments.maximum_local_relief_metres,
        arguments.minimum_component_area_square_metres,
        arguments.erosion_metres,
        arguments.support_method,
        arguments.maximum_local_mad_metres,
        arguments.minimum_finite_neighbors,
    )
    distances = np.arange(0, arguments.maximum_distance_metres + arguments.step_metres, arguments.step_metres)
    eastings = origin[0] + distances * math.sin(azimuth)
    northings = origin[1] + distances * math.cos(azimuth)
    ray_z = origin[2] + distances * tangent
    minimum_x = raster["grid"]["minimumXMetres"]
    minimum_y = raster["grid"]["minimumYMetres"]
    rows = np.floor((northings - minimum_y) / cell_metres).astype(np.int32)
    columns = np.floor((eastings - minimum_x) / cell_metres).astype(np.int32)
    inside = (rows >= 0) & (rows < dsm.shape[0]) & (columns >= 0) & (columns < dsm.shape[1])
    surface = np.full(distances.shape, np.nan, dtype=np.float64)
    supported = np.zeros(distances.shape, dtype=bool)
    component_ids = np.zeros(distances.shape, dtype=np.int32)
    surface[inside] = dsm[rows[inside], columns[inside]]
    supported[inside] = support[rows[inside], columns[inside]]
    component_ids[inside] = labels[rows[inside], columns[inside]]
    difference = ray_z - surface
    near_indices = np.flatnonzero(np.isfinite(surface) & (difference >= -2.0) & (difference <= 2.0))
    above_indices = np.flatnonzero(np.isfinite(surface) & (surface >= ray_z))
    crossings = []
    finite_pair = np.isfinite(difference[:-1]) & np.isfinite(difference[1:])
    for index in np.flatnonzero(finite_pair & (difference[:-1] <= 0) & (difference[1:] >= 0)):
        crossings.append(
            {
                "distanceMetres": float(distances[index]),
                "surfaceElevationMetres": float(surface[index]),
                "rayElevationMetres": float(ray_z[index]),
                "supported": bool(supported[index] and supported[index + 1]),
                "componentIds": [int(component_ids[index]), int(component_ids[index + 1])],
            }
        )

    output_png = arguments.output_json.with_suffix(".png")
    figure, axis = plt.subplots(figsize=(14, 6))
    axis.scatter(distances[np.isfinite(surface)], surface[np.isfinite(surface)], s=3, color="#9ca3af", label="DSM maximum")
    axis.scatter(distances[supported], surface[supported], s=6, color="#2563eb", label="retained smooth support")
    axis.plot(distances, ray_z, color="#dc2626", linewidth=2, label="seat-to-sun ray")
    axis.set_xlabel("Horizontal distance toward sun, metres")
    axis.set_ylabel("NAVD88 elevation, metres")
    axis.set_title(
        f"Section {arguments.section} row {arguments.row} sample {arguments.seat_sample_index}, "
        f"{candidate['event']['midpointTime']}, alt {solar['altitudeDegrees']:.2f}, az {solar['azimuthDegrees']:.2f}"
    )
    axis.grid(alpha=0.2)
    axis.legend()
    figure.tight_layout()
    figure.savefig(output_png, dpi=180)
    plt.close(figure)

    selected_indices = sorted(set(near_indices.tolist() + above_indices[:: max(1, len(above_indices) // 100)].tolist()))
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "lidar-seat-sun-ray-profile-v2",
        "inputs": {
            "rowsSha256": sha256_file(arguments.rows),
            "rasterMetadataSha256": sha256_file(arguments.raster_metadata),
            "dsmSha256": sha256_file(arguments.dsm_npy),
            "observationsSha256": sha256_file(arguments.observations),
            "verticalDatumSha256": sha256_file(arguments.vertical_datum),
        },
        "rowKey": row["rowKey"],
        "seatSampleIndex": arguments.seat_sample_index,
        "originEastingNorthingElevationMetres": origin,
        "candidateId": candidate["candidateId"],
        "midpointTime": candidate["event"]["midpointTime"],
        "solarPosition": solar,
        "parameters": {
            "stepMetres": arguments.step_metres,
            "maximumDistanceMetres": arguments.maximum_distance_metres,
            "maximumLocalReliefMetres": arguments.maximum_local_relief_metres,
            "supportMethod": arguments.support_method,
            "maximumLocalMadMetres": arguments.maximum_local_mad_metres,
            "minimumFiniteNeighbors": arguments.minimum_finite_neighbors,
            "minimumComponentAreaSquareMetres": arguments.minimum_component_area_square_metres,
            "erosionMetres": arguments.erosion_metres,
        },
        "surfaceSupport": support_summary,
        "crossings": crossings,
        "nearestProfileSamples": [
            {
                "distanceMetres": float(distances[index]),
                "eastingMetres": float(eastings[index]),
                "northingMetres": float(northings[index]),
                "rayElevationMetres": float(ray_z[index]),
                "surfaceElevationMetres": float(surface[index]),
                "rayMinusSurfaceMetres": float(difference[index]),
                "supported": bool(supported[index]),
                "componentId": int(component_ids[index]),
            }
            for index in selected_indices
        ],
        "diagnosticPng": str(output_png),
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "outputPng": str(output_png),
                "rowKey": artifact["rowKey"],
                "origin": origin,
                "solarPosition": solar,
                "crossings": crossings,
                "profileSampleCount": len(selected_indices),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

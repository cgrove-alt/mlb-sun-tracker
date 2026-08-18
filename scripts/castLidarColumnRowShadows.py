#!/usr/bin/env python3
"""Diagnose seat shade against opaque columns beneath a measured LiDAR DSM.

This deliberately remains a diagnostic until every hit component is classified
as a current opaque stadium structure. Unlike a zero-thickness surface test, a
column test correctly recognizes a ray that passes underneath a roof or deck.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np

from castTopSurfaceRowShadows import ring_seat_samples


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--vertical-clearance-metres", type=float, default=0.22)
    parser.add_argument("--minimum-plan-run-metres", type=float, default=0.60)
    parser.add_argument("--maximum-distance-metres", type=float, default=300.0)
    parser.add_argument("--step-metres", type=float, default=0.10)
    parser.add_argument("--minimum-distance-metres", type=float, default=1.0)
    arguments = parser.parse_args()
    if arguments.vertical_clearance_metres <= 0:
        raise ValueError("Vertical clearance must be positive")
    if arguments.minimum_plan_run_metres < arguments.step_metres:
        raise ValueError("Minimum plan run must be at least one ray step")
    if arguments.step_metres <= 0 or arguments.maximum_distance_metres <= 0:
        raise ValueError("Invalid ray distance parameters")

    row_bytes = arguments.rows.read_bytes()
    raster_bytes = arguments.raster_metadata.read_bytes()
    observation_bytes = arguments.observations.read_bytes()
    datum_bytes = arguments.vertical_datum.read_bytes()
    review_bytes = arguments.review_queue.read_bytes()
    row_artifact = json.loads(row_bytes)
    raster = json.loads(raster_bytes)
    observations = json.loads(observation_bytes)
    datum = json.loads(datum_bytes)
    review = json.loads(review_bytes)
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    grid = raster["grid"]
    if list(dsm.shape) != [grid["rows"], grid["columns"]]:
        raise ValueError("DSM shape differs from raster metadata")
    actual_dsm_sha256 = sha256_file(arguments.dsm_npy)
    if actual_dsm_sha256 != raster["rasterOutputs"]["dsmMaximumZMetres"]["sha256"]:
        raise ValueError("DSM checksum differs from raster metadata")

    selected_ids = {item["candidateId"] for item in review["manualReviewQueue"]}
    candidates = [item for item in observations["candidates"] if item["candidateId"] in selected_ids]
    if len(candidates) != len(selected_ids):
        raise ValueError("Review queue candidates are not unique members of the observation artifact")
    selected_sections = set(arguments.section)
    rows = [item for item in row_artifact["rows"] if item["sectionId"] in selected_sections]
    if not rows:
        raise ValueError("No rows matched the requested sections")
    datum_offset = float(datum["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"])
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    cell_metres = float(grid["cellMetres"])
    row_count, column_count = dsm.shape
    distances = np.arange(
        max(arguments.step_metres, arguments.minimum_distance_metres),
        arguments.maximum_distance_metres + arguments.step_metres,
        arguments.step_metres,
        dtype=np.float64,
    )
    required_run_samples = math.ceil(
        arguments.minimum_plan_run_metres / arguments.step_metres - 1e-12
    )

    def cast(origin: list[float], azimuth_degrees: float, altitude_degrees: float) -> dict[str, Any]:
        azimuth = math.radians(azimuth_degrees % 360.0)
        tangent = math.tan(math.radians(altitude_degrees))
        east = origin[0] + distances * math.sin(azimuth)
        north = origin[1] + distances * math.cos(azimuth)
        ray_z = origin[2] + distances * tangent
        raster_rows = np.floor((north - minimum_y) / cell_metres).astype(np.int32)
        raster_columns = np.floor((east - minimum_x) / cell_metres).astype(np.int32)
        inside = (
            (raster_rows >= 0)
            & (raster_rows < row_count)
            & (raster_columns >= 0)
            & (raster_columns < column_count)
        )
        top = np.full(distances.shape, np.nan, dtype=np.float64)
        top[inside] = dsm[raster_rows[inside], raster_columns[inside]]
        margin = top - ray_z
        blocked = np.isfinite(margin) & (margin >= arguments.vertical_clearance_metres)
        padded = np.concatenate(([False], blocked, [False]))
        transitions = np.flatnonzero(padded[1:] != padded[:-1])
        starts = transitions[0::2]
        ends = transitions[1::2]
        lengths = ends - starts
        eligible = np.flatnonzero(lengths >= required_run_samples)
        if eligible.size == 0:
            return {
                "classification": "no-diagnostic-column-hit",
                "maximumTopAboveRayMetres": (
                    None if not np.any(np.isfinite(margin)) else float(np.nanmax(margin))
                ),
            }
        run_index = int(eligible[0])
        start = int(starts[run_index])
        end = int(ends[run_index])
        run_margin = margin[start:end]
        maximum_index = start + int(np.nanargmax(run_margin))
        return {
            "classification": "diagnostic-column-hit",
            "entryDistanceMetres": float(distances[start]),
            "exitDistanceMetres": float(distances[end - 1]),
            "planRunMetres": float(lengths[run_index] * arguments.step_metres),
            "entryEastingMetres": float(east[start]),
            "entryNorthingMetres": float(north[start]),
            "entryRayElevationMetresNavd88": float(ray_z[start]),
            "entryDsmTopElevationMetresNavd88": float(top[start]),
            "minimumTopAboveRayMetres": float(np.nanmin(run_margin)),
            "maximumTopAboveRayMetres": float(np.nanmax(run_margin)),
            "maximumMarginLocation": {
                "distanceMetres": float(distances[maximum_index]),
                "eastingMetres": float(east[maximum_index]),
                "northingMetres": float(north[maximum_index]),
                "rayElevationMetresNavd88": float(ray_z[maximum_index]),
                "dsmTopElevationMetresNavd88": float(top[maximum_index]),
            },
        }

    results: list[dict[str, Any]] = []
    for candidate in candidates:
        solar = candidate["solarPositionAtMidpoint"]
        row_results: list[dict[str, Any]] = []
        for row in rows:
            positions = ring_seat_samples(
                row["horizontalGeometry"]["rings"], int(row["publishedSeatCount"])
            )
            elevation = float(row["venueLocalPosition"][1]) + datum_offset
            seats: list[dict[str, Any]] = []
            for seat_index, position in enumerate(positions, start=1):
                origin = [float(position[0]), float(position[1]), elevation]
                hit = cast(
                    origin,
                    float(solar["azimuthDegrees"]),
                    float(solar["altitudeDegrees"]),
                )
                seats.append(
                    {
                        "seatSampleIndex": seat_index,
                        "originEastingNorthingElevationMetres": origin,
                        **hit,
                    }
                )
            hit_count = sum(item["classification"] == "diagnostic-column-hit" for item in seats)
            row_results.append(
                {
                    "rowKey": row["rowKey"],
                    "sectionId": row["sectionId"],
                    "rowId": row["rowId"],
                    "seatSampleCount": len(seats),
                    "diagnosticShadeCount": hit_count,
                    "classification": (
                        "all-center-rays-hit"
                        if hit_count == len(seats)
                        else "no-center-rays-hit"
                        if hit_count == 0
                        else "mixed-center-rays"
                    ),
                    "seats": seats,
                }
            )
        results.append(
            {
                "candidateId": candidate["candidateId"],
                "midpointTime": candidate["event"]["midpointTime"],
                "solarPosition": solar,
                "rows": row_results,
            }
        )

    classifications = [
        row["classification"] for result in results for row in result["rows"]
    ]
    stable = {
        "inputs": {
            "rowsSha256": hashlib.sha256(row_bytes).hexdigest(),
            "rasterMetadataSha256": hashlib.sha256(raster_bytes).hexdigest(),
            "dsmSha256": actual_dsm_sha256,
            "observationsSha256": hashlib.sha256(observation_bytes).hexdigest(),
            "verticalDatumSha256": hashlib.sha256(datum_bytes).hexdigest(),
            "reviewQueueSha256": hashlib.sha256(review_bytes).hexdigest(),
        },
        "sections": sorted(selected_sections),
        "parameters": {
            "verticalClearanceMetres": arguments.vertical_clearance_metres,
            "minimumPlanRunMetres": arguments.minimum_plan_run_metres,
            "maximumDistanceMetres": arguments.maximum_distance_metres,
            "minimumDistanceMetres": arguments.minimum_distance_metres,
            "stepMetres": arguments.step_metres,
            "requiredRunSamples": required_run_samples,
        },
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "lidar-opaque-column-center-ray-diagnostic-v1",
        "artifactStage": "measured-dsm-column-row-shadow-diagnostic",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "rows": {"path": str(arguments.rows), "sha256": stable["inputs"]["rowsSha256"]},
            "rasterMetadata": {
                "path": str(arguments.raster_metadata),
                "sha256": stable["inputs"]["rasterMetadataSha256"],
            },
            "dsm": {"path": str(arguments.dsm_npy), "sha256": actual_dsm_sha256},
            "observations": {
                "path": str(arguments.observations),
                "sha256": stable["inputs"]["observationsSha256"],
            },
            "verticalDatum": {
                "path": str(arguments.vertical_datum),
                "sha256": stable["inputs"]["verticalDatumSha256"],
            },
            "reviewQueue": {
                "path": str(arguments.review_queue),
                "sha256": stable["inputs"]["reviewQueueSha256"],
            },
        },
        "sections": stable["sections"],
        "parameters": stable["parameters"],
        "results": results,
        "summary": {
            "candidateCount": len(results),
            "rowClassificationCounts": {
                value: classifications.count(value) for value in sorted(set(classifications))
            },
        },
        "assessment": {
            "measurementEligibleDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "HIT_COMPONENTS_NOT_YET_CLASSIFIED_AS_CURRENT_OPAQUE_STRUCTURES",
                "FULL_HORIZONTAL_VERTICAL_AND_ORIENTATION_UNCERTAINTY_NOT_YET_CAST",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_YET_SCORED",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_YET_PROVEN_COMPLETE",
            ],
            "interpretation": (
                "A center-ray hit locates a measured DSM column that can explain shade. "
                "It is not publishable until the hit footprint is semantically classified, "
                "current, and stable under the full uncertainty envelope."
            ),
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "assessment": artifact["assessment"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

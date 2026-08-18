#!/usr/bin/env python3
"""Refine locked Marlins cross-epoch hard-structure controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import Transformer
from scipy import ndimage

from auditNoaa2021LocalLidarRegistration import phase_shift
from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-cross-epoch-hard-structure-control-subpixel-refinement-v3"
MINIMUM_Z_METRES = 5.0
MAXIMUM_Z_METRES = 90.0
CELLS_METRES = (0.15, 0.20, 0.25)
HIGH_PASS_METRES = (1.0, 2.0, 4.0, 6.0)


def validate_record(record: dict[str, Any]) -> dict[str, Any] | None:
    path = Path(record["path"])
    if sha256_file(path) != record["sha256"]:
        raise ValueError(f"Checksum mismatch: {path}")
    if path.suffix != ".json":
        return None
    value = json.loads(path.read_text())
    if record.get("artifactVersion") != value.get("artifactVersion"):
        raise ValueError(f"Artifact version mismatch: {path}")
    return value


def build_height_grids(
    path: Path,
    horizontal_epsg: int,
    vertical_unit_metres: float,
    chunk_size: int,
    center_utm_metres: np.ndarray,
    half_width_metres: float,
) -> tuple[dict[float, np.ndarray], dict[float, float], int, int]:
    if vertical_unit_metres <= 0:
        raise ValueError("Vertical-unit conversion must be positive")
    grids = {
        cell: np.full(
            (
                int(round(2.0 * half_width_metres / cell)),
                int(round(2.0 * half_width_metres / cell)),
            ),
            -np.inf,
            dtype=np.float32,
        )
        for cell in CELLS_METRES
    }
    transformer = (
        None
        if horizontal_epsg == 6346
        else Transformer.from_crs(horizontal_epsg, 6346, always_xy=True)
    )
    total = 0
    cropped = 0
    with laspy.open(path) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None or str(horizontal_epsg) not in source_crs.to_wkt():
            raise ValueError(f"LiDAR CRS does not match EPSG:{horizontal_epsg}: {path}")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            if transformer is not None:
                x, y = transformer.transform(x, y)
                x = np.asarray(x, dtype=np.float64)
                y = np.asarray(y, dtype=np.float64)
            z = np.asarray(points.z, dtype=np.float64) * vertical_unit_metres
            classification = np.asarray(points.classification)
            keep = (
                (np.abs(x - center_utm_metres[0]) < half_width_metres)
                & (np.abs(y - center_utm_metres[1]) < half_width_metres)
                & (z > MINIMUM_Z_METRES)
                & (z < MAXIMUM_Z_METRES)
                & ~np.isin(classification, [7, 18])
            )
            selected_x = x[keep]
            selected_y = y[keep]
            selected_z = z[keep].astype(np.float32)
            for cell, grid in grids.items():
                ix = np.floor(
                    (selected_x - center_utm_metres[0] + half_width_metres) / cell
                ).astype(np.int32)
                iy = np.floor(
                    (selected_y - center_utm_metres[1] + half_width_metres) / cell
                ).astype(np.int32)
                inside = (
                    (ix >= 0)
                    & (ix < grid.shape[1])
                    & (iy >= 0)
                    & (iy < grid.shape[0])
                )
                np.maximum.at(grid, (iy[inside], ix[inside]), selected_z[inside])
            total += len(x)
            cropped += int(np.count_nonzero(keep))
    filled_grids: dict[float, np.ndarray] = {}
    coverages: dict[float, float] = {}
    for cell, grid in grids.items():
        finite = np.isfinite(grid)
        if not np.any(finite):
            raise ValueError(f"Empty local grid for {path} at {cell} metres")
        coverages[cell] = float(finite.mean())
        indices = ndimage.distance_transform_edt(
            ~finite,
            return_distances=False,
            return_indices=True,
        )
        filled_grids[cell] = ndimage.gaussian_filter(
            grid[tuple(indices)],
            1.0,
        ).astype(np.float32)
    return filled_grids, coverages, total, cropped


def patch_at(
    grid: np.ndarray,
    center_local_metres: list[float],
    patch_half_width_metres: float,
    cell_metres: float,
    grid_half_width_metres: float,
) -> np.ndarray:
    center_x = int(round(
        (center_local_metres[0] + grid_half_width_metres) / cell_metres
    ))
    center_y = int(round(
        (center_local_metres[1] + grid_half_width_metres) / cell_metres
    ))
    half_cells = int(round(patch_half_width_metres / cell_metres))
    patch = grid[
        center_y - half_cells:center_y + half_cells,
        center_x - half_cells:center_x + half_cells,
    ]
    expected = 2 * half_cells
    if patch.shape != (expected, expected):
        raise ValueError("Control patch falls outside the local grid")
    return patch


def build_refinement(
    controls_path: Path,
    patch_half_width_metres: float,
    chunk_size: int,
) -> dict[str, Any]:
    controls_bytes = controls_path.read_bytes()
    controls = json.loads(controls_bytes)
    supported_review_statuses = {
        "reviewed-2018-2021-subpixel-hard-structure-lidar-controls",
        "reviewed-2018-2024-hard-structure-lidar-controls",
        "reviewed-2021-2024-hard-structure-lidar-controls",
    }
    if controls.get("reviewStatus") not in supported_review_statuses:
        raise ValueError("Controls are not a supported locked cross-epoch review")
    queue = validate_record(controls["inputs"]["reviewQueue"])
    validate_record(controls["inputs"]["reviewSheet"])
    if queue is None:
        raise ValueError("Review queue is not JSON")
    reference_path = Path(queue["inputs"]["referenceLidar"]["path"])
    comparison_path = Path(queue["inputs"]["comparisonLidar"]["path"])
    if sha256_file(reference_path) != queue["inputs"]["referenceLidar"]["sha256"]:
        raise ValueError("Reference LiDAR checksum mismatch")
    if sha256_file(comparison_path) != queue["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    parameters = queue["parameters"]
    target_horizontal_epsg = int(parameters["targetHorizontalEpsg"])
    reference_horizontal_epsg = int(parameters["referenceHorizontalEpsg"])
    comparison_horizontal_epsg = int(parameters["comparisonHorizontalEpsg"])
    reference_vertical_unit_metres = float(parameters["referenceVerticalUnitMetres"])
    comparison_vertical_unit_metres = float(parameters["comparisonVerticalUnitMetres"])
    center_utm_metres = np.asarray(parameters["centerUtmMetres"], dtype=float)
    queue_half_width_metres = float(parameters["halfWidthMetres"])
    grid_half_width_metres = (
        queue_half_width_metres + patch_half_width_metres + max(CELLS_METRES)
    )
    if not (
        target_horizontal_epsg == 6346
        and reference_horizontal_epsg == 6346
        and comparison_horizontal_epsg in {6346, 6438}
    ):
        raise ValueError("Review queue coordinate frames are not supported locked frames")

    reference_grids, reference_coverage, reference_total, reference_cropped = (
        build_height_grids(
            reference_path,
            reference_horizontal_epsg,
            reference_vertical_unit_metres,
            chunk_size,
            center_utm_metres,
            grid_half_width_metres,
        )
    )
    comparison_grids, comparison_coverage, comparison_total, comparison_cropped = (
        build_height_grids(
            comparison_path,
            comparison_horizontal_epsg,
            comparison_vertical_unit_metres,
            chunk_size,
            center_utm_metres,
            grid_half_width_metres,
        )
    )
    candidates = {item["candidateId"]: item for item in queue["candidates"]}
    accepted = [item for item in controls["controls"] if item.get("accepted")]
    records: dict[str, dict[str, Any]] = {}
    for item in accepted:
        candidate = candidates[item["candidateId"]]
        records[item["candidateId"]] = {
            "candidateId": item["candidateId"],
            "role": item["role"],
            "semanticIdentity": item["semanticIdentity"],
            "referenceUtmMetres": candidate["reference"]["utmMetres"],
            "referenceLocalMetres": candidate["reference"]["localMetres"],
            "coarseComparisonUtmMetres": candidate["comparison"]["utmMetres"],
            "coarseReferenceToComparisonDisplacementMetres": candidate[
                "referenceToComparisonDisplacementMetres"
            ],
            "phaseRuns": [],
        }
    for cell in CELLS_METRES:
        for record in records.values():
            reference_patch = patch_at(
                reference_grids[cell],
                record["referenceLocalMetres"],
                patch_half_width_metres,
                cell,
                grid_half_width_metres,
            )
            comparison_patch = patch_at(
                comparison_grids[cell],
                record["referenceLocalMetres"],
                patch_half_width_metres,
                cell,
                grid_half_width_metres,
            )
            for high_pass in HIGH_PASS_METRES:
                shift_x, shift_y, response = phase_shift(
                    reference_patch,
                    comparison_patch,
                    cell,
                    high_pass,
                )
                record["phaseRuns"].append({
                    "cellMetres": cell,
                    "highPassMetres": high_pass,
                    "referenceToComparisonShiftMetres": [shift_x, shift_y],
                    "response": response,
                    "referenceGridCoverage": reference_coverage[cell],
                    "comparisonGridCoverage": comparison_coverage[cell],
                })
    for record in records.values():
        bounded = [
            run
            for run in record["phaseRuns"]
            if np.linalg.norm(run["referenceToComparisonShiftMetres"]) <= 1.5
            and run["response"] > 0.0
        ]
        shifts = np.asarray([
            run["referenceToComparisonShiftMetres"] for run in bounded
        ])
        if len(shifts) < 6:
            record["refined"] = None
            continue
        median_shift = np.median(shifts, axis=0)
        distances = np.linalg.norm(shifts - median_shift, axis=1)
        refined_comparison = np.asarray(record["referenceUtmMetres"]) + median_shift
        record["refined"] = {
            "acceptedRunCount": len(bounded),
            "totalRunCount": len(record["phaseRuns"]),
            "referenceToComparisonShiftMetres": median_shift.tolist(),
            "comparisonUtmMetres": refined_comparison.tolist(),
            "crossRunShiftDispersionMetres": {
                "median": float(np.median(distances)),
                "p95": float(np.percentile(distances, 95)),
                "maximum": float(np.max(distances)),
            },
            "response": {
                "median": float(np.median([run["response"] for run in bounded])),
                "minimum": float(min(run["response"] for run in bounded)),
            },
        }

    stable = {
        "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        "referenceLidarSha256": queue["inputs"]["referenceLidar"]["sha256"],
        "comparisonLidarSha256": queue["inputs"]["comparisonLidar"]["sha256"],
        "cellMetres": list(CELLS_METRES),
        "highPassMetres": list(HIGH_PASS_METRES),
        "patchHalfWidthMetres": patch_half_width_metres,
        "records": list(records.values()),
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "hard-structure-control-subpixel-refinement",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controlsPath": str(controls_path),
            "controlsSha256": stable["controlsSha256"],
            "controlsArtifactVersion": controls["artifactVersion"],
            "reviewQueueArtifactVersion": queue["artifactVersion"],
            "referenceLidarPath": str(reference_path),
            "referenceLidarSha256": stable["referenceLidarSha256"],
            "comparisonLidarPath": str(comparison_path),
            "comparisonLidarSha256": stable["comparisonLidarSha256"],
        },
        "parameters": {
            "cellMetres": list(CELLS_METRES),
            "highPassMetres": list(HIGH_PASS_METRES),
            "patchHalfWidthMetres": patch_half_width_metres,
            "queueCenterUtmMetres": center_utm_metres.tolist(),
            "queueHalfWidthMetres": queue_half_width_metres,
            "gridHalfWidthMetres": grid_half_width_metres,
            "maximumAcceptedShiftMetres": 1.5,
            "minimumPositiveResponseRuns": 6,
            "aggregate": "component-wise median across all bounded positive-response runs",
            "sourceCoordinateReferenceSystems": {
                "reference": f"EPSG:{reference_horizontal_epsg}",
                "comparison": f"EPSG:{comparison_horizontal_epsg}",
                "comparisonProjectedTo": f"EPSG:{target_horizontal_epsg}",
            },
            "sourceVerticalUnitMetres": {
                "reference": reference_vertical_unit_metres,
                "comparison": comparison_vertical_unit_metres,
            },
        },
        "pointCounts": {
            "referenceTotal": reference_total,
            "referenceLocalCrop": reference_cropped,
            "comparisonTotal": comparison_total,
            "comparisonLocalCrop": comparison_cropped,
        },
        "records": list(records.values()),
        "assessment": {
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "MULTISCALE_REFINED_CONTROLS_NOT_YET_CONSOLIDATED",
                "REFINED_CONTROLS_NOT_YET_TESTED_IN_LOCKED_REGISTRATION",
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_2026_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--patch-half-width-metres", type=float, required=True)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_refinement(
        arguments.controls,
        arguments.patch_half_width_metres,
        arguments.chunk_size,
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "patchHalfWidthMetres": artifact["parameters"]["patchHalfWidthMetres"],
        "refinedCount": sum(record["refined"] is not None for record in artifact["records"]),
        "recordCount": len(artifact["records"]),
    }, indent=2))


if __name__ == "__main__":
    main()

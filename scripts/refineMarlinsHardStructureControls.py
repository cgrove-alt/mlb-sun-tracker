#!/usr/bin/env python3
"""Refine locked Marlins hard-structure controls with local phase correlation."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

import auditNoaa2021LocalLidarRegistration as local_registration
from auditNoaa2021LocalLidarRegistration import (
    artifact_version,
    load_crop,
    maximum_height_grid,
    phase_shift,
    sha256_file,
)


ANALYSIS_VERSION = "marlins-hard-structure-control-subpixel-refinement-v1"
HALF_WIDTH_METRES = 210.0
local_registration.HALF_WIDTH_METRES = HALF_WIDTH_METRES


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


def patch_at(
    grid: np.ndarray,
    center_local_metres: list[float],
    half_width_metres: float,
    cell_metres: float,
) -> np.ndarray:
    center_x = int(round((center_local_metres[0] + HALF_WIDTH_METRES) / cell_metres))
    center_y = int(round((center_local_metres[1] + HALF_WIDTH_METRES) / cell_metres))
    half_cells = int(round(half_width_metres / cell_metres))
    patch = grid[
        center_y - half_cells:center_y + half_cells,
        center_x - half_cells:center_x + half_cells,
    ]
    expected = 2 * half_cells
    if patch.shape != (expected, expected):
        raise ValueError("Control patch falls outside the local grid")
    return patch


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--cell-metres", type=float, action="append")
    parser.add_argument("--high-pass-metres", type=float, action="append")
    parser.add_argument("--patch-half-width-metres", type=float, default=18.0)
    parser.add_argument("--all-candidates", action="store_true")
    args = parser.parse_args()

    controls_bytes = args.controls.read_bytes()
    controls = json.loads(controls_bytes)
    if controls.get("reviewStatus") != "reviewed-2018-2015-hard-structure-lidar-controls":
        raise ValueError("Controls are not the locked 2015 review")
    queue = validate_record(controls["inputs"]["reviewQueue"])
    validate_record(controls["inputs"]["reviewSheet"])
    if queue is None:
        raise ValueError("Review queue was not JSON")
    reference_path = Path(queue["inputs"]["referenceLidar"]["path"])
    comparison_path = Path(queue["inputs"]["comparisonLidar"]["path"])
    if sha256_file(reference_path) != queue["inputs"]["referenceLidar"]["sha256"]:
        raise ValueError("Reference LiDAR checksum mismatch")
    if sha256_file(comparison_path) != queue["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")

    candidates = {item["candidateId"]: item for item in queue["candidates"]}
    accepted = [item for item in controls["controls"] if item.get("accepted")]
    if args.all_candidates:
        reviewed_by_id = {item["candidateId"]: item for item in controls["controls"]}
        accepted = [
            reviewed_by_id.get(candidate["candidateId"], {
                "candidateId": candidate["candidateId"],
                "role": "unassigned",
                "semanticIdentity": "not accepted in the first manual review",
                "accepted": False,
            })
            for candidate in queue["candidates"]
        ]
    cells = sorted(set(args.cell_metres or [0.15, 0.20, 0.25]))
    high_passes = sorted(set(args.high_pass_metres or [1.0, 2.0, 4.0, 6.0]))
    records = {
        item["candidateId"]: {
            "candidateId": item["candidateId"],
            "role": item["role"],
            "semanticIdentity": item["semanticIdentity"],
            "referenceUtmMetres": candidates[item["candidateId"]]["reference"][
                "utmMetres"
            ],
            "referenceLocalMetres": candidates[item["candidateId"]]["reference"][
                "localMetres"
            ],
            "coarseComparisonUtmMetres": candidates[item["candidateId"]][
                "comparison"
            ]["utmMetres"],
            "coarseReferenceToComparisonDisplacementMetres": candidates[
                item["candidateId"]
            ]["referenceToComparisonDisplacementMetres"],
            "phaseRuns": [],
        }
        for item in accepted
    }

    reference_x, reference_y, reference_z, reference_total = load_crop(reference_path)
    comparison_x, comparison_y, comparison_z, comparison_total = load_crop(
        comparison_path
    )
    for cell in cells:
        reference_grid, reference_coverage = maximum_height_grid(
            (reference_x, reference_y, reference_z), cell
        )
        comparison_grid, comparison_coverage = maximum_height_grid(
            (comparison_x, comparison_y, comparison_z), cell
        )
        for record in records.values():
            reference_patch = patch_at(
                reference_grid,
                record["referenceLocalMetres"],
                args.patch_half_width_metres,
                cell,
            )
            comparison_patch = patch_at(
                comparison_grid,
                record["referenceLocalMetres"],
                args.patch_half_width_metres,
                cell,
            )
            for high_pass in high_passes:
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
                    "referenceGridCoverage": reference_coverage,
                    "comparisonGridCoverage": comparison_coverage,
                })
        del reference_grid
        del comparison_grid

    for record in records.values():
        bounded = [
            run
            for run in record["phaseRuns"]
            if np.linalg.norm(run["referenceToComparisonShiftMetres"]) <= 1.5
            and run["response"] > 0.0
        ]
        shifts = np.asarray(
            [run["referenceToComparisonShiftMetres"] for run in bounded],
            dtype=float,
        )
        if len(shifts) < 6:
            record["refined"] = None
            continue
        median_shift = np.median(shifts, axis=0)
        distances = np.linalg.norm(shifts - median_shift, axis=1)
        refined_comparison = (
            np.asarray(record["referenceUtmMetres"], dtype=float) + median_shift
        )
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
        "cellMetres": cells,
        "highPassMetres": high_passes,
        "patchHalfWidthMetres": args.patch_half_width_metres,
        "allCandidates": args.all_candidates,
        "records": list(records.values()),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "hard-structure-control-subpixel-refinement",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controlsPath": str(args.controls),
            "controlsSha256": stable["controlsSha256"],
            "controlsArtifactVersion": controls["artifactVersion"],
            "reviewQueueArtifactVersion": queue["artifactVersion"],
            "referenceLidarPath": str(reference_path),
            "referenceLidarSha256": stable["referenceLidarSha256"],
            "comparisonLidarPath": str(comparison_path),
            "comparisonLidarSha256": stable["comparisonLidarSha256"],
        },
        "parameters": {
            "cellMetres": cells,
            "highPassMetres": high_passes,
            "patchHalfWidthMetres": args.patch_half_width_metres,
            "allCandidates": args.all_candidates,
            "maximumAcceptedShiftMetres": 1.5,
            "minimumPositiveResponseRuns": 6,
            "aggregate": "component-wise median across all bounded positive-response runs",
        },
        "pointCounts": {
            "referenceTotal": reference_total,
            "referenceLocalCrop": len(reference_x),
            "comparisonTotal": comparison_total,
            "comparisonLocalCrop": len(comparison_x),
        },
        "records": list(records.values()),
        "assessment": {
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "REFINED_CONTROLS_NOT_YET_TESTED_IN_LOCKED_REGISTRATION",
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "refined": [
            {
                "candidateId": record["candidateId"],
                "role": record["role"],
                "coarseShift": record[
                    "coarseReferenceToComparisonDisplacementMetres"
                ],
                "refined": record["refined"],
            }
            for record in records.values()
        ],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build a measured roof union while filling only topologically enclosed gaps."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from PIL import Image
from scipy import ndimage

from buildSeededLidarRoofPrimitive import (
    artifact_version,
    fit_plane_ransac,
    sha256_file,
    values_summary,
    vertical_residual,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--primitive-json", action="append", type=Path, required=True)
    parser.add_argument("--primitive-npz", action="append", type=Path, required=True)
    parser.add_argument("--point-inlier-threshold-metres", type=float, default=0.12)
    parser.add_argument("--maximum-point-to-input-plane-metres", type=float, default=0.25)
    parser.add_argument("--reported-vertical-accuracy-95-metres", type=float, default=0.196)
    parser.add_argument("--maximum-horizontal-accuracy-95-metres", type=float, default=0.3048)
    parser.add_argument("--maximum-vertical-envelope-metres", type=float, default=0.3048)
    arguments = parser.parse_args()
    if len(arguments.primitive_json) != len(arguments.primitive_npz):
        raise ValueError("Every primitive JSON requires one primitive NPZ")
    if len(arguments.primitive_json) < 2:
        raise ValueError("At least two independently seeded primitives are required")

    primitives: list[dict[str, Any]] = []
    reference_grid: tuple[tuple[int, int], float, float, float] | None = None
    for index, (json_path, npz_path) in enumerate(
        zip(arguments.primitive_json, arguments.primitive_npz), start=1
    ):
        artifact_bytes = json_path.read_bytes()
        artifact = json.loads(artifact_bytes)
        actual_npz_sha = sha256_file(npz_path)
        if artifact["footprint"]["npzSha256"] != actual_npz_sha:
            raise ValueError(f"Primitive {index} NPZ checksum mismatch")
        if not artifact["assessment"]["metricGeometryEligible"]:
            raise ValueError(f"Primitive {index} is not metric-geometry eligible")
        with np.load(npz_path, allow_pickle=False) as arrays:
            mask = arrays["mask"].astype(bool)
            coefficients = arrays["plane_coefficients"].astype(np.float64)
            minimum_x = float(arrays["minimum_x_metres"][0])
            minimum_y = float(arrays["minimum_y_metres"][0])
            cell_metres = float(arrays["cell_metres"][0])
        grid = (mask.shape, minimum_x, minimum_y, cell_metres)
        if reference_grid is None:
            reference_grid = grid
        elif grid != reference_grid:
            raise ValueError("Primitive grids differ")
        primitives.append(
            {
                "artifact": artifact,
                "jsonPath": json_path,
                "npzPath": npz_path,
                "jsonSha256": hashlib.sha256(artifact_bytes).hexdigest(),
                "npzSha256": actual_npz_sha,
                "mask": mask,
                "coefficients": coefficients,
            }
        )

    assert reference_grid is not None
    shape, minimum_x, minimum_y, cell_metres = reference_grid
    measured_union = np.logical_or.reduce([item["mask"] for item in primitives])
    filled_union = ndimage.binary_fill_holes(measured_union)
    filled_gaps = filled_union & ~measured_union
    if not np.any(filled_gaps):
        raise ValueError("The primitive union has no enclosed gaps")

    row_indices, column_indices = np.indices(shape)
    x_centres = minimum_x + (column_indices + 0.5) * cell_metres
    y_centres = minimum_y + (row_indices + 0.5) * cell_metres
    locations = np.argwhere(filled_union)
    minimum_roof_x = minimum_x + float(locations[:, 1].min()) * cell_metres
    maximum_roof_x = minimum_x + (float(locations[:, 1].max()) + 1.0) * cell_metres
    minimum_roof_y = minimum_y + float(locations[:, 0].min()) * cell_metres
    maximum_roof_y = minimum_y + (float(locations[:, 0].max()) + 1.0) * cell_metres

    point_batches: list[np.ndarray] = []
    source_batches: list[np.ndarray] = []
    with laspy.open(arguments.lidar) as reader:
        if reader.header.parse_crs() is None:
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
            selected = np.column_stack(
                [x_values[bounds], y_values[bounds], z_values[bounds]]
            )
            columns = np.floor((selected[:, 0] - minimum_x) / cell_metres).astype(np.int32)
            rows = np.floor((selected[:, 1] - minimum_y) / cell_metres).astype(np.int32)
            inside = (
                (rows >= 0)
                & (rows < shape[0])
                & (columns >= 0)
                & (columns < shape[1])
            )
            retained = np.zeros(rows.shape, dtype=bool)
            retained[inside] = filled_union[rows[inside], columns[inside]]
            predictions = np.column_stack(
                [
                    coefficients[0] * selected[:, 0]
                    + coefficients[1] * selected[:, 1]
                    + coefficients[2]
                    for coefficients in [item["coefficients"] for item in primitives]
                ]
            )
            median_prediction = np.median(predictions, axis=1)
            retained &= (
                np.abs(selected[:, 2] - median_prediction)
                <= arguments.maximum_point_to_input_plane_metres
            )
            if np.any(retained):
                point_batches.append(selected[retained])
                source_batches.append(
                    np.asarray(chunk.point_source_id)[bounds][retained].astype(np.int32)
                )
    if not point_batches:
        raise ValueError("No roof-plane LiDAR returns fall inside the filled union")
    points = np.concatenate(point_batches)
    source_ids = np.concatenate(source_batches)
    unique_sources, source_counts = np.unique(source_ids, return_counts=True)
    source_count_map = {
        int(source): int(count) for source, count in zip(unique_sources, source_counts)
    }
    usable_sources = [
        int(source) for source, count in zip(unique_sources, source_counts) if count >= 30
    ]
    if len(usable_sources) < 2:
        raise ValueError("At least two LiDAR point-source identifiers are required")
    training_source = max(usable_sources, key=lambda source: source_count_map[source])
    training = source_ids == training_source
    holdout_sources = [source for source in usable_sources if source != training_source]
    holdout = np.isin(source_ids, holdout_sources)
    coefficients, training_inliers = fit_plane_ransac(
        points[training], arguments.point_inlier_threshold_metres, 2000, 20260810
    )
    training_residual = np.abs(
        vertical_residual(points[training][training_inliers], coefficients)
    )
    holdout_residual = np.abs(vertical_residual(points[holdout], coefficients))
    holdout_p95 = float(np.percentile(holdout_residual, 95))

    filled_x = x_centres[filled_union]
    filled_y = y_centres[filled_union]
    final_prediction = (
        coefficients[0] * filled_x + coefficients[1] * filled_y + coefficients[2]
    )
    source_plane_summaries: list[dict[str, Any]] = []
    prediction_disagreements: list[np.ndarray] = []
    for source in usable_sources:
        source_points = points[source_ids == source]
        source_coefficients, source_inliers = fit_plane_ransac(
            source_points,
            arguments.point_inlier_threshold_metres,
            1200,
            20260810 + source,
        )
        source_prediction = (
            source_coefficients[0] * filled_x
            + source_coefficients[1] * filled_y
            + source_coefficients[2]
        )
        disagreement = np.abs(source_prediction - final_prediction)
        prediction_disagreements.append(disagreement)
        source_plane_summaries.append(
            {
                "pointSourceId": source,
                "observationCount": int(source_points.shape[0]),
                "inlierCount": int(np.count_nonzero(source_inliers)),
                "coefficientsZFromEastingNorthing": source_coefficients.tolist(),
                "absolutePredictionDifferenceFromFinalPlaneMetres": values_summary(
                    disagreement
                ),
            }
        )
    prediction_disagreement = np.concatenate(prediction_disagreements)
    prediction_disagreement_maximum = float(np.max(prediction_disagreement))
    supported_surface_residual_maximum = max(
        float(
            item["artifact"]["footprint"]["absoluteDsmToPlaneResidualMetres"][
                "maximum"
            ]
        )
        for item in primitives
    )
    surface_model_envelope = (
        supported_surface_residual_maximum + prediction_disagreement_maximum
    )
    combined_vertical_envelope = math.sqrt(
        arguments.reported_vertical_accuracy_95_metres**2
        + holdout_p95**2
        + surface_model_envelope**2
    )
    horizontal_accuracy = max(
        float(item["artifact"]["footprint"]["reportedSourceHorizontalAccuracy95Metres"])
        for item in primitives
    )
    minimum_erosion = min(
        float(item["artifact"]["footprint"]["erosionMetres"])
        for item in primitives
    )

    arguments.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        arguments.output_npz,
        mask=filled_union,
        measured_union_mask=measured_union,
        enclosed_gap_mask=filled_gaps,
        plane_coefficients=coefficients,
        minimum_x_metres=np.asarray([minimum_x]),
        minimum_y_metres=np.asarray([minimum_y]),
        cell_metres=np.asarray([cell_metres]),
    )
    diagnostic = np.zeros((*shape, 3), dtype=np.uint8)
    diagnostic[measured_union] = (0, 180, 110)
    diagnostic[filled_gaps] = (255, 170, 0)
    rows, columns = locations.T
    row_start = max(0, int(rows.min()) - 12)
    row_stop = min(shape[0], int(rows.max()) + 13)
    column_start = max(0, int(columns.min()) - 12)
    column_stop = min(shape[1], int(columns.max()) + 13)
    Image.fromarray(np.flipud(diagnostic[row_start:row_stop, column_start:column_stop])).resize(
        ((column_stop - column_start) * 4, (row_stop - row_start) * 4),
        Image.Resampling.NEAREST,
    ).save(arguments.output_png, format="PNG", optimize=True)

    stable = {
        "inputs": [
            {
                "jsonSha256": item["jsonSha256"],
                "npzSha256": item["npzSha256"],
                "artifactVersion": item["artifact"]["artifactVersion"],
            }
            for item in primitives
        ],
        "lidarSha256": sha256_file(arguments.lidar),
        "outputNpzSha256": sha256_file(arguments.output_npz),
        "measuredCellCount": int(np.count_nonzero(measured_union)),
        "enclosedGapCellCount": int(np.count_nonzero(filled_gaps)),
        "finalCellCount": int(np.count_nonzero(filled_union)),
        "planeCoefficients": coefficients.tolist(),
        "surfaceModelEnvelopeMaximumMetres": surface_model_envelope,
        "combinedVerticalEnvelopeMetres": combined_vertical_envelope,
    }
    metric_eligible = (
        combined_vertical_envelope <= arguments.maximum_vertical_envelope_metres
        and horizontal_accuracy <= arguments.maximum_horizontal_accuracy_95_metres
        and minimum_erosion >= horizontal_accuracy
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "enclosed-gap-lidar-planar-roof-union-primitive",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "lidar": {"path": str(arguments.lidar), "sha256": stable["lidarSha256"]},
            "primitives": [
                {
                    "jsonPath": str(item["jsonPath"]),
                    "jsonSha256": item["jsonSha256"],
                    "npzPath": str(item["npzPath"]),
                    "npzSha256": item["npzSha256"],
                    "artifactVersion": item["artifact"]["artifactVersion"],
                }
                for item in primitives
            ],
        },
        "coordinateReferenceSystem": primitives[0]["artifact"]["coordinateReferenceSystem"],
        "plane": {
            "equation": "z = a * easting + b * northing + c",
            "coefficients": {
                "a": float(coefficients[0]),
                "b": float(coefficients[1]),
                "c": float(coefficients[2]),
            },
            "trainingMethod": "deterministic RANSAC on the largest point-source identifier",
            "trainingSource": training_source,
            "trainingObservationCount": int(np.count_nonzero(training)),
            "trainingInlierCount": int(np.count_nonzero(training_inliers)),
            "trainingAbsoluteVerticalResidualMetres": values_summary(training_residual),
            "holdoutMethod": "disjoint point-source identifiers",
            "holdoutSources": holdout_sources,
            "holdoutObservationCount": int(np.count_nonzero(holdout)),
            "holdoutAbsoluteVerticalResidualMetres": values_summary(holdout_residual),
            "sourceSpecificPlaneFits": source_plane_summaries,
            "reportedSourceVerticalAccuracy95Metres": arguments.reported_vertical_accuracy_95_metres,
            "combinedVerticalEnvelopeMetres": combined_vertical_envelope,
        },
        "footprint": {
            "representation": "union of eroded measured interiors with enclosed gaps filled",
            "npzPath": str(arguments.output_npz),
            "npzSha256": stable["outputNpzSha256"],
            "cellMetres": cell_metres,
            "measuredCellCount": stable["measuredCellCount"],
            "enclosedGapCellCount": stable["enclosedGapCellCount"],
            "cellCount": stable["finalCellCount"],
            "areaSquareMetres": float(stable["finalCellCount"] * cell_metres**2),
            "erosionMetres": minimum_erosion,
            "reportedSourceHorizontalAccuracy95Metres": horizontal_accuracy,
            "supportedSurfaceResidualMaximumMetres": supported_surface_residual_maximum,
            "filledGapFlightlinePredictionDisagreementMetres": values_summary(
                prediction_disagreement
            ),
            "surfaceModelEnvelopeMaximumMetres": surface_model_envelope,
            "absoluteDsmToPlaneResidualMetres": {
                "count": stable["measuredCellCount"],
                "median": None,
                "p95": None,
                "maximum": surface_model_envelope,
                "interpretation": "Conservative envelope used by the ray caster, not a direct residual summary for filled cells.",
            },
        },
        "lidarPointSources": source_count_map,
        "diagnosticPng": str(arguments.output_png),
        "assessment": {
            "metricGeometryEligible": metric_eligible,
            "publicationEligible": False,
            "blockers": [
                "EVERY_FILLED_GAP_REQUIRES_INDEPENDENT_ORTHOPHOTO_ROOF_CLASSIFICATION",
                "CURRENT_2026_STRUCTURE_EXISTENCE_REQUIRES_VERIFICATION",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": "Only gaps enclosed by independently seeded, already eroded measured roof interiors are filled. The filled cells remain blocked until two-year orthophoto review confirms continuous opaque roof.",
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "footprint": artifact["footprint"],
                "plane": artifact["plane"],
                "assessment": artifact["assessment"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

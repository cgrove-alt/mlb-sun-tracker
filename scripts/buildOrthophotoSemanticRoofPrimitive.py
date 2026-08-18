#!/usr/bin/env python3
"""Clip and extend a measured roof plane using two-year orthophoto semantics."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image
from pyproj import Transformer
from scipy import ndimage

from buildSeededLidarRoofPrimitive import artifact_version, sha256_file


def disk(radius_cells: int) -> np.ndarray:
    coordinates = np.arange(-radius_cells, radius_cells + 1)
    yy, xx = np.meshgrid(coordinates, coordinates, indexing="ij")
    return (xx * xx + yy * yy) <= radius_cells * radius_cells


def select_overlap_component(candidate: np.ndarray, reference: np.ndarray) -> np.ndarray:
    labels, count = ndimage.label(candidate, structure=np.ones((3, 3), dtype=np.uint8))
    if count == 0:
        raise ValueError("Semantic candidate has no connected components")
    overlap = np.bincount(labels[reference].ravel(), minlength=count + 1)
    overlap[0] = 0
    selected = int(np.argmax(overlap))
    if selected == 0 or overlap[selected] == 0:
        raise ValueError("Semantic candidate does not overlap the measured roof")
    return labels == selected


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("union_json", type=Path)
    parser.add_argument("union_npz", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("orthophoto_2024", type=Path)
    parser.add_argument("metadata_2024", type=Path)
    parser.add_argument("orthophoto_2025", type=Path)
    parser.add_argument("metadata_2025", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--cell-metres", type=float, default=0.10)
    parser.add_argument("--padding-metres", type=float, default=20.0)
    parser.add_argument("--support-plane-residual-metres", type=float, default=0.20)
    parser.add_argument("--brightness-threshold", action="append", type=int, default=[])
    parser.add_argument("--maximum-support-distance-metres", action="append", type=float, default=[])
    parser.add_argument("--closing-radius-metres", action="append", type=float, default=[])
    parser.add_argument("--semantic-boundary-erosion-metres", type=float, default=0.30)
    arguments = parser.parse_args()

    thresholds = sorted(set(arguments.brightness_threshold or [150, 170]))
    support_distances = sorted(
        set(arguments.maximum_support_distance_metres or [0.8, 1.0])
    )
    closing_radii = sorted(set(arguments.closing_radius_metres or [0.3, 0.5]))
    if not all(0 <= value <= 255 for value in thresholds):
        raise ValueError("Brightness thresholds must be in the 0 to 255 range")

    union_bytes = arguments.union_json.read_bytes()
    union_artifact = json.loads(union_bytes)
    actual_union_npz_sha = sha256_file(arguments.union_npz)
    if union_artifact["footprint"]["npzSha256"] != actual_union_npz_sha:
        raise ValueError("Union NPZ checksum mismatch")
    if not union_artifact["assessment"]["metricGeometryEligible"]:
        raise ValueError("The union roof plane is not metric-geometry eligible")
    with np.load(arguments.union_npz, allow_pickle=False) as arrays:
        union_mask = arrays["mask"].astype(bool)
        coefficients = arrays["plane_coefficients"].astype(np.float64)
        source_minimum_x = float(arrays["minimum_x_metres"][0])
        source_minimum_y = float(arrays["minimum_y_metres"][0])
        source_cell = float(arrays["cell_metres"][0])
    dsm = np.load(arguments.dsm_npy, allow_pickle=False)
    if dsm.shape != union_mask.shape:
        raise ValueError("DSM and union mask shapes differ")

    source_rows, source_columns = np.indices(union_mask.shape)
    source_x = source_minimum_x + (source_columns + 0.5) * source_cell
    source_y = source_minimum_y + (source_rows + 0.5) * source_cell
    source_prediction = (
        coefficients[0] * source_x
        + coefficients[1] * source_y
        + coefficients[2]
    )
    planar_support = (
        np.isfinite(dsm)
        & (np.abs(dsm - source_prediction) <= arguments.support_plane_residual_metres)
    )
    source_support_distance = ndimage.distance_transform_edt(~planar_support) * source_cell

    union_locations = np.argwhere(union_mask)
    union_row_minimum, union_column_minimum = union_locations.min(axis=0)
    union_row_maximum, union_column_maximum = union_locations.max(axis=0)
    bounding_minimum_x = (
        source_minimum_x
        + union_column_minimum * source_cell
        - arguments.padding_metres
    )
    bounding_maximum_x = (
        source_minimum_x
        + (union_column_maximum + 1) * source_cell
        + arguments.padding_metres
    )
    bounding_minimum_y = (
        source_minimum_y + union_row_minimum * source_cell - arguments.padding_metres
    )
    bounding_maximum_y = (
        source_minimum_y
        + (union_row_maximum + 1) * source_cell
        + arguments.padding_metres
    )
    column_count = int(math.ceil((bounding_maximum_x - bounding_minimum_x) / arguments.cell_metres))
    row_count = int(math.ceil((bounding_maximum_y - bounding_minimum_y) / arguments.cell_metres))
    rows, columns = np.indices((row_count, column_count))
    x_centres = bounding_minimum_x + (columns + 0.5) * arguments.cell_metres
    y_centres = bounding_minimum_y + (rows + 0.5) * arguments.cell_metres

    source_column_coordinates = (
        (x_centres - source_minimum_x) / source_cell - 0.5
    )
    source_row_coordinates = (
        (y_centres - source_minimum_y) / source_cell - 0.5
    )
    support_distance = ndimage.map_coordinates(
        source_support_distance,
        [source_row_coordinates, source_column_coordinates],
        order=1,
        mode="constant",
        cval=float(np.max(source_support_distance)),
    )
    reference = ndimage.map_coordinates(
        union_mask.astype(np.uint8),
        [source_row_coordinates, source_column_coordinates],
        order=0,
        mode="constant",
        cval=0,
    ).astype(bool)

    transformer = Transformer.from_crs("EPSG:6347", "EPSG:4269", always_xy=True)
    longitude, latitude = transformer.transform(x_centres, y_centres)
    orthophoto_minimum_channels: list[np.ndarray] = []
    orthophoto_records: list[dict[str, Any]] = []
    for year, image_path, metadata_path in [
        (2024, arguments.orthophoto_2024, arguments.metadata_2024),
        (2025, arguments.orthophoto_2025, arguments.metadata_2025),
    ]:
        metadata_bytes = metadata_path.read_bytes()
        metadata = json.loads(metadata_bytes)
        image = np.asarray(Image.open(image_path).convert("RGB"))
        if [image.shape[1], image.shape[0]] != metadata["imageDimensions"]:
            raise ValueError(f"{year} image dimensions do not match metadata")
        minimum_channel = ndimage.median_filter(image.min(axis=2), size=3)
        extent = metadata["imageExtent"]
        pixel_x = (
            (longitude - float(extent["xmin"]))
            / (float(extent["xmax"]) - float(extent["xmin"]))
            * image.shape[1]
        )
        pixel_y = (
            (float(extent["ymax"]) - latitude)
            / (float(extent["ymax"]) - float(extent["ymin"]))
            * image.shape[0]
        )
        sampled = ndimage.map_coordinates(
            minimum_channel.astype(np.float64),
            [pixel_y, pixel_x],
            order=1,
            mode="constant",
            cval=0.0,
        )
        orthophoto_minimum_channels.append(sampled)
        orthophoto_records.append(
            {
                "year": year,
                "imagePath": str(image_path),
                "imageSha256": sha256_file(image_path),
                "metadataPath": str(metadata_path),
                "metadataSha256": hashlib.sha256(metadata_bytes).hexdigest(),
                "serviceUrl": metadata["source"]["serviceUrl"],
            }
        )

    variants: list[np.ndarray] = []
    variant_summaries: list[dict[str, Any]] = []
    for threshold in thresholds:
        for maximum_support_distance in support_distances:
            for closing_radius in closing_radii:
                candidate = (
                    (orthophoto_minimum_channels[0] >= threshold)
                    & (orthophoto_minimum_channels[1] >= threshold)
                    & (support_distance <= maximum_support_distance)
                )
                closing_cells = max(1, int(math.ceil(closing_radius / arguments.cell_metres)))
                candidate = ndimage.binary_closing(candidate, structure=disk(closing_cells))
                candidate = ndimage.binary_fill_holes(candidate)
                component = select_overlap_component(candidate, reference)
                distance_inside = ndimage.distance_transform_edt(component) * arguments.cell_metres
                conservative = component & (
                    (distance_inside - arguments.cell_metres / 2.0)
                    >= arguments.semantic_boundary_erosion_metres
                )
                variants.append(conservative)
                variant_summaries.append(
                    {
                        "minimumChannelThreshold": threshold,
                        "maximumPlanarSupportDistanceMetres": maximum_support_distance,
                        "closingRadiusMetres": closing_radius,
                        "cellCount": int(np.count_nonzero(conservative)),
                        "areaSquareMetres": float(
                            np.count_nonzero(conservative) * arguments.cell_metres**2
                        ),
                    }
                )
    final_mask = np.logical_and.reduce(variants)
    final_mask = select_overlap_component(final_mask, reference)
    if not np.any(final_mask):
        raise ValueError("Sensitivity intersection is empty")
    sensitivity_count = np.sum(np.stack(variants, axis=0), axis=0).astype(np.uint8)
    final_count = int(np.count_nonzero(final_mask))
    final_area = float(final_count * arguments.cell_metres**2)
    input_areas = [item["areaSquareMetres"] for item in variant_summaries]
    sensitivity_area_span = max(input_areas) - min(input_areas)

    arguments.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        arguments.output_npz,
        mask=final_mask,
        sensitivity_count=sensitivity_count,
        plane_coefficients=coefficients,
        minimum_x_metres=np.asarray([bounding_minimum_x]),
        minimum_y_metres=np.asarray([bounding_minimum_y]),
        cell_metres=np.asarray([arguments.cell_metres]),
    )
    image = np.zeros((*final_mask.shape, 3), dtype=np.uint8)
    image[sensitivity_count > 0] = (80, 80, 80)
    image[reference] = (0, 130, 230)
    image[final_mask] = (0, 220, 120)
    locations = np.argwhere(sensitivity_count > 0)
    row_minimum, column_minimum = locations.min(axis=0)
    row_maximum, column_maximum = locations.max(axis=0)
    crop = np.flipud(
        image[
            max(0, row_minimum - 30) : min(row_count, row_maximum + 31),
            max(0, column_minimum - 30) : min(column_count, column_maximum + 31),
        ]
    )
    Image.fromarray(crop).save(arguments.output_png, format="PNG", optimize=True)

    stable = {
        "unionJsonSha256": hashlib.sha256(union_bytes).hexdigest(),
        "unionNpzSha256": actual_union_npz_sha,
        "dsmSha256": sha256_file(arguments.dsm_npy),
        "orthophotos": orthophoto_records,
        "parameters": {
            "cellMetres": arguments.cell_metres,
            "supportPlaneResidualMetres": arguments.support_plane_residual_metres,
            "brightnessThresholds": thresholds,
            "maximumSupportDistancesMetres": support_distances,
            "closingRadiiMetres": closing_radii,
            "semanticBoundaryErosionMetres": arguments.semantic_boundary_erosion_metres,
        },
        "variants": variant_summaries,
        "finalCellCount": final_count,
        "finalAreaSquareMetres": final_area,
        "outputNpzSha256": sha256_file(arguments.output_npz),
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "two-year-orthophoto-semantic-lidar-roof-primitive",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "measuredUnionJson": {
                "path": str(arguments.union_json),
                "sha256": stable["unionJsonSha256"],
                "artifactVersion": union_artifact["artifactVersion"],
            },
            "measuredUnionNpz": {
                "path": str(arguments.union_npz),
                "sha256": actual_union_npz_sha,
            },
            "dsm": {"path": str(arguments.dsm_npy), "sha256": stable["dsmSha256"]},
            "orthophotos": orthophoto_records,
        },
        "coordinateReferenceSystem": union_artifact["coordinateReferenceSystem"],
        "plane": union_artifact["plane"],
        "footprint": {
            "representation": "intersection across all two-year brightness, support-distance, and closing-radius sensitivity variants",
            "npzPath": str(arguments.output_npz),
            "npzSha256": stable["outputNpzSha256"],
            "cellMetres": arguments.cell_metres,
            "cellCount": final_count,
            "areaSquareMetres": final_area,
            "erosionMetres": arguments.semantic_boundary_erosion_metres,
            "reportedSourceHorizontalAccuracy95Metres": union_artifact["footprint"][
                "reportedSourceHorizontalAccuracy95Metres"
            ],
            "absoluteDsmToPlaneResidualMetres": union_artifact["footprint"][
                "absoluteDsmToPlaneResidualMetres"
            ],
            "surfaceModelEnvelopeMaximumMetres": union_artifact["footprint"][
                "surfaceModelEnvelopeMaximumMetres"
            ],
            "sensitivityVariantCount": len(variants),
            "sensitivityAreaSpanSquareMetres": sensitivity_area_span,
            "sensitivityVariants": variant_summaries,
        },
        "parameters": stable["parameters"],
        "diagnosticPng": str(arguments.output_png),
        "assessment": {
            "metricGeometryEligible": union_artifact["assessment"]["metricGeometryEligible"],
            "orthophotoSemanticEligible": True,
            "publicationEligible": False,
            "blockers": [
                "CURRENT_2026_STRUCTURE_EXISTENCE_REQUIRES_VERIFICATION",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": "Every retained cell is inside the intersection of eight conservative sensitivity variants, is classified as the same bright roof surface in both 2024 and 2025 orthophotos, and is no farther than the strictest support distance from a LiDAR plane return before boundary erosion.",
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "footprint": artifact["footprint"],
                "assessment": artifact["assessment"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Extract a provenance-preserving candidate obstruction heightfield from LAS/LAZ.

This script does not certify row-level geometry. It converts a georeferenced
point cloud into a sparse, stadium-centred surface that can be reviewed and
compared with independent imagery before it is eligible for calculations.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS, Transformer

from lidar_units import lidar_unit_conversion


ANALYSIS_VERSION = "lidar-heightfield-v3"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Authoritative LAS/LAZ source tile")
    parser.add_argument("output", type=Path, help="Candidate heightfield JSON")
    parser.add_argument("--additional-input", action="append", type=Path, default=[])
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--longitude", type=float, required=True)
    parser.add_argument("--latitude", type=float, required=True)
    parser.add_argument("--source-url", required=True)
    parser.add_argument(
        "--source-provider",
        default="U.S. Geological Survey 3D Elevation Program",
    )
    parser.add_argument("--source-dataset")
    parser.add_argument("--additional-source-url", action="append", default=[])
    parser.add_argument("--metadata-url")
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
    parser.add_argument("--half-width-ft", type=float, default=900.0)
    parser.add_argument("--cell-size-ft", type=float, default=6.0)
    parser.add_argument("--minimum-height-ft", type=float, default=4.0)
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


def round_or_none(value: float | None, digits: int = 3) -> float | None:
    return None if value is None or not math.isfinite(value) else round(value, digits)


def main() -> None:
    args = parse_args()
    if args.cell_size_ft <= 0 or args.half_width_ft <= 0:
        raise ValueError("cell size and half width must be positive")
    input_paths = [args.input, *args.additional_input]
    source_urls = [args.source_url, *args.additional_source_url]
    if len(input_paths) != len(source_urls):
        raise ValueError("Every --additional-input requires one --additional-source-url")
    for input_path in input_paths:
        if not input_path.is_file():
            raise FileNotFoundError(input_path)
    source_hashes = [sha256(input_path) for input_path in input_paths]
    if bool(args.source_crs) != bool(args.source_crs_evidence):
        raise ValueError("--source-crs and --source-crs-evidence must be supplied together")
    source_crs_evidence_sha256 = None
    if args.source_crs_evidence:
        if not args.source_crs_evidence.is_file():
            raise FileNotFoundError(args.source_crs_evidence)
        source_crs_evidence_sha256 = sha256(args.source_crs_evidence)

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
        grid_size = math.ceil((args.half_width_ft * 2) / args.cell_size_ft)
        maximum_z = np.full(grid_size * grid_size, -np.inf, dtype=np.float64)
        ground_samples: list[np.ndarray] = []
        cropped_points = 0
        source_files: list[dict[str, Any]] = []

        def append_reader_points(
            source_reader: laspy.LasReader,
            input_path: Path,
            source_url: str,
            source_file_hash: str,
        ) -> None:
            nonlocal cropped_points
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
            source_files.append({
                "sourceUrl": source_url,
                "localFileSha256": source_file_hash,
                "pointCount": int(source_reader.header.point_count),
            })

            for points in source_reader.chunk_iterator(1_000_000):
                east_ft = (
                    np.asarray(points.x) - center_x
                ) * units.horizontal_native_units_to_feet
                north_ft = (
                    np.asarray(points.y) - center_y
                ) * units.horizontal_native_units_to_feet
                z_ft = np.asarray(points.z) * units.vertical_native_units_to_feet
                inside = (
                    (east_ft >= -args.half_width_ft)
                    & (east_ft < args.half_width_ft)
                    & (north_ft >= -args.half_width_ft)
                    & (north_ft < args.half_width_ft)
                    & np.isfinite(z_ft)
                )
                if not np.any(inside):
                    continue
                cropped_points += int(np.count_nonzero(inside))
                local_east_ft = east_ft[inside]
                local_north_ft = north_ft[inside]
                local_z_ft = z_ft[inside]
                classification = np.asarray(points.classification)[inside]
                ground = local_z_ft[classification == 2]
                if ground.size:
                    ground_samples.append(ground)

                column = ((local_east_ft + args.half_width_ft) / args.cell_size_ft).astype(np.int64)
                row = ((local_north_ft + args.half_width_ft) / args.cell_size_ft).astype(np.int64)
                valid = (column >= 0) & (column < grid_size) & (row >= 0) & (row < grid_size)
                np.maximum.at(maximum_z, row[valid] * grid_size + column[valid], local_z_ft[valid])

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

        if not ground_samples:
            raise ValueError("No class-2 ground returns exist in the stadium crop")
        ground_elevation_ft = float(np.median(np.concatenate(ground_samples)))
        relative_height = maximum_z - ground_elevation_ft
        plausible = (
            np.isfinite(relative_height)
            & (relative_height >= args.minimum_height_ft)
            & (relative_height <= 400)
        )
        cell_indices = np.flatnonzero(plausible)
        cells = [
            [
                int(index % grid_size),
                int(index // grid_size),
                round(float(relative_height[index]), 2),
            ]
            for index in cell_indices
        ]

        parameters = {
            "stadiumId": args.stadium_id,
            "longitude": args.longitude,
            "latitude": args.latitude,
            "halfWidthFt": args.half_width_ft,
            "cellSizeFt": args.cell_size_ft,
            "minimumHeightFt": args.minimum_height_ft,
        }
        result: dict[str, Any] = {
            "schemaVersion": 2,
            "analysisVersion": ANALYSIS_VERSION,
            "artifactStage": "candidate-heightfield",
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
                    "acquiredOn": args.acquired_on,
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
                "acquiredOn": args.acquired_on,
                "localFileSha256": source_hashes[0],
                "pointCount": sum(file["pointCount"] for file in source_files),
                "files": source_files,
                "croppedPointCount": cropped_points,
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
                "horizontalNativeUnitsToFeet": round_or_none(
                    units.horizontal_native_units_to_feet, 12
                ),
                "verticalNativeUnitsToFeet": round_or_none(
                    units.vertical_native_units_to_feet, 12
                ),
            },
            "grid": {
                "centerLongitude": args.longitude,
                "centerLatitude": args.latitude,
                "centerProjectedXFt": round_or_none(
                    center_x * units.horizontal_native_units_to_feet
                ),
                "centerProjectedYFt": round_or_none(
                    center_y * units.horizontal_native_units_to_feet
                ),
                "halfWidthFt": args.half_width_ft,
                "cellSizeFt": args.cell_size_ft,
                "columns": grid_size,
                "rows": grid_size,
                "groundElevationFt": round(ground_elevation_ft, 3),
                "minimumIncludedHeightFt": args.minimum_height_ft,
                "cells": cells,
            },
            "publication": {
                "eligible": False,
                "reason": "Candidate surface only: row segmentation, obstruction completeness, uncertainty, currency, and independent shadow observations have not passed.",
            },
        }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "croppedPointCount": cropped_points,
        "includedCells": len(cells),
        "groundElevationFt": round(ground_elevation_ft, 3),
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

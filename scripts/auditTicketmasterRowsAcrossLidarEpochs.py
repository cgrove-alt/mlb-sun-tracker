#!/usr/bin/env python3
"""Audit provider-plan row locations against independent LiDAR epochs.

This analysis searches for repeatable elevation clusters near the same
orthophoto-registered provider seats in multiple acquisitions. It normalizes
each epoch to several class-2 playing-field patches before comparing heights.
An agreeing cluster remains a structural-surface candidate. Airborne LiDAR
does not prove that a return is a row tread, seat pan, seat back, or railing.
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
from scipy.spatial import cKDTree


ANALYSIS_VERSION = "ticketmaster-cross-epoch-lidar-row-cluster-audit-v1"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_version(value: Any) -> str:
    payload = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def percentile(values: np.ndarray, probability: float) -> float | None:
    if values.size == 0:
        return None
    return float(np.percentile(values, probability))


def parse_named_path(value: str) -> tuple[str, Path]:
    if "=" not in value:
        raise argparse.ArgumentTypeError("epoch must use LABEL=MANIFEST_PATH")
    label, raw_path = value.split("=", 1)
    if not label or not raw_path:
        raise argparse.ArgumentTypeError("epoch must use LABEL=MANIFEST_PATH")
    return label, Path(raw_path)


def parse_named_classes(value: str) -> tuple[str, list[int]]:
    if "=" not in value:
        raise argparse.ArgumentTypeError("accepted classes must use LABEL=1,17")
    label, raw_values = value.split("=", 1)
    try:
        classes = [int(item) for item in raw_values.split(",")]
    except ValueError as error:
        raise argparse.ArgumentTypeError("classification values must be integers") from error
    if not label or not classes or len(set(classes)) != len(classes):
        raise argparse.ArgumentTypeError("accepted classes must be unique and nonempty")
    if any(value < 0 or value > 255 for value in classes):
        raise argparse.ArgumentTypeError("classification values must be within 0 and 255")
    return label, classes


def row_number(value: str) -> int | None:
    try:
        number = int(value)
    except ValueError:
        return None
    return number if str(number) == value else None


def elevation_clusters(
    elevations_feet: np.ndarray,
    point_sources: np.ndarray,
    maximum_gap_feet: float,
    minimum_points: int,
) -> list[dict[str, Any]]:
    if elevations_feet.size == 0:
        return []
    order = np.argsort(elevations_feet)
    values = elevations_feet[order]
    sources = point_sources[order]
    boundaries = np.flatnonzero(np.diff(values) > maximum_gap_feet) + 1
    groups = np.split(np.arange(values.size), boundaries)
    result = []
    for group in groups:
        if group.size < minimum_points:
            continue
        selected = values[group]
        result.append(
            {
                "pointCount": int(group.size),
                "pointSourceCount": int(np.unique(sources[group]).size),
                "elevationFeet": {
                    "median": float(np.median(selected)),
                    "p05": percentile(selected, 5),
                    "p95": percentile(selected, 95),
                    "span": float(np.max(selected) - np.min(selected)),
                },
            }
        )
    return result


def select_cross_epoch_match(
    candidates_by_epoch: dict[str, list[dict[str, Any]]],
    epoch_labels: list[str],
    maximum_disagreement_feet: float,
) -> dict[str, Any] | None:
    if any(not candidates_by_epoch.get(label) for label in epoch_labels):
        return None
    combinations: list[tuple[tuple[float, float, float], list[dict[str, Any]]]] = []

    def visit(offset: int, chosen: list[dict[str, Any]]) -> None:
        if offset == len(epoch_labels):
            heights = np.asarray(
                [item["relativeToFieldFeet"] for item in chosen], dtype=np.float64
            )
            span = float(np.max(heights) - np.min(heights))
            if span <= maximum_disagreement_feet:
                total_points = sum(item["pointCount"] for item in chosen)
                total_sources = sum(item["pointSourceCount"] for item in chosen)
                combinations.append(((span, -total_sources, -total_points), list(chosen)))
            return
        for candidate in candidates_by_epoch[epoch_labels[offset]]:
            chosen.append(candidate)
            visit(offset + 1, chosen)
            chosen.pop()

    visit(0, [])
    if not combinations:
        return None
    _, selected = min(combinations, key=lambda item: item[0])
    heights = np.asarray(
        [item["relativeToFieldFeet"] for item in selected], dtype=np.float64
    )
    return {
        "relativeHeightFeet": {
            "medianAcrossEpochs": float(np.median(heights)),
            "minimum": float(np.min(heights)),
            "maximum": float(np.max(heights)),
            "span": float(np.max(heights) - np.min(heights)),
        },
        "epochs": {
            label: candidate for label, candidate in zip(epoch_labels, selected)
        },
    }


def load_epoch(
    label: str,
    manifest_path: Path,
    accepted_classes: list[int],
    world_crs: CRS,
    seat_world_feet: np.ndarray,
    seat_row_indices: np.ndarray,
    row_count: int,
    field_patch_world_feet: np.ndarray,
    maximum_seat_distance_feet: float,
    field_patch_radius_feet: float,
    cluster_gap_feet: float,
    minimum_cluster_points: int,
) -> dict[str, Any]:
    manifest_bytes = manifest_path.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactKind") not in {
        "usgs-lidar-project-acquisition",
        "lidar-project-acquisition",
    }:
        raise ValueError(f"{label} manifest has the wrong artifact kind")
    first_path = Path(manifest["tiles"][0]["path"])
    with laspy.open(first_path) as reader:
        embedded = reader.header.parse_crs()
    if embedded is None:
        raise ValueError(f"{label} LiDAR has no embedded horizontal CRS")
    embedded_crs = CRS.from_user_input(embedded)
    horizontal_crs = CRS.from_user_input(
        embedded_crs.sub_crs_list[0] if embedded_crs.is_compound else embedded_crs
    )
    transformer = Transformer.from_crs(world_crs, horizontal_crs, always_xy=True)
    seat_x, seat_y = transformer.transform(seat_world_feet[:, 0], seat_world_feet[:, 1])
    seats_xy = np.column_stack((seat_x, seat_y))
    patch_x, patch_y = transformer.transform(
        field_patch_world_feet[:, 0], field_patch_world_feet[:, 1]
    )
    patch_xy = np.column_stack((patch_x, patch_y))
    unit_to_metres = float(horizontal_crs.axis_info[0].unit_conversion_factor)
    native_to_feet = unit_to_metres * METRES_TO_FEET
    maximum_seat_distance_native = maximum_seat_distance_feet / native_to_feet
    field_patch_radius_native = field_patch_radius_feet / native_to_feet
    all_controls = np.vstack((seats_xy, patch_xy))
    padding_native = max(maximum_seat_distance_native, field_patch_radius_native) + 2.0
    minimum = np.min(all_controls, axis=0) - padding_native
    maximum = np.max(all_controls, axis=0) + padding_native

    structure_parts: list[np.ndarray] = []
    structure_source_parts: list[np.ndarray] = []
    ground_parts: list[np.ndarray] = []
    lidar_inputs: list[dict[str, Any]] = []
    gps_time_types: set[str] = set()
    gps_minimum = math.inf
    gps_maximum = -math.inf
    for tile in manifest.get("tiles", []):
        path = Path(tile["path"])
        actual_sha = sha256_file(path)
        if actual_sha != tile.get("sha256"):
            raise ValueError(f"{label} LiDAR tile checksum mismatch: {path}")
        lidar_inputs.append(
            {
                "path": str(path),
                "sha256": actual_sha,
                "byteLength": path.stat().st_size,
            }
        )
        with laspy.open(path) as reader:
            tile_crs_value = reader.header.parse_crs()
            if tile_crs_value is None:
                raise ValueError(f"{label} LiDAR tile lacks a CRS: {path}")
            tile_crs = CRS.from_user_input(tile_crs_value)
            tile_horizontal = CRS.from_user_input(
                tile_crs.sub_crs_list[0] if tile_crs.is_compound else tile_crs
            )
            if not tile_horizontal.equals(horizontal_crs):
                raise ValueError(f"{label} LiDAR tiles do not share one CRS")
            gps_time_types.add(reader.header.global_encoding.gps_time_type.name)
            for points in reader.chunk_iterator(2_000_000):
                x = np.asarray(points.x)
                y = np.asarray(points.y)
                inside = (
                    (x >= minimum[0])
                    & (x <= maximum[0])
                    & (y >= minimum[1])
                    & (y <= maximum[1])
                )
                if not np.any(inside):
                    continue
                classification = np.asarray(points.classification)
                z_feet = np.asarray(points.z) * METRES_TO_FEET
                source_id = np.asarray(points.point_source_id)
                structure = inside & np.isin(classification, accepted_classes)
                if np.any(structure):
                    structure_parts.append(
                        np.column_stack((x[structure], y[structure], z_feet[structure]))
                    )
                    structure_source_parts.append(source_id[structure])
                ground = inside & (classification == 2)
                if np.any(ground):
                    ground_parts.append(
                        np.column_stack((x[ground], y[ground], z_feet[ground]))
                    )
                if hasattr(points, "gps_time"):
                    selected_time = np.asarray(points.gps_time)[inside]
                    if selected_time.size:
                        gps_minimum = min(gps_minimum, float(np.min(selected_time)))
                        gps_maximum = max(gps_maximum, float(np.max(selected_time)))
    if not structure_parts or not ground_parts:
        raise ValueError(f"{label} has insufficient structure or ground returns")
    structure_points = np.vstack(structure_parts)
    structure_sources = np.concatenate(structure_source_parts)
    ground_points = np.vstack(ground_parts)

    seat_distances_native, seat_indexes = cKDTree(seats_xy).query(
        structure_points[:, :2], k=1
    )
    assigned = seat_distances_native <= maximum_seat_distance_native
    assigned_rows = seat_row_indices[seat_indexes[assigned]]
    assigned_z = structure_points[assigned, 2]
    assigned_sources = structure_sources[assigned]

    field_patches = []
    patch_medians = []
    for patch_index, point in enumerate(patch_xy):
        distances_native = np.linalg.norm(ground_points[:, :2] - point, axis=1)
        selected = ground_points[distances_native <= field_patch_radius_native, 2]
        median = float(np.median(selected)) if selected.size else None
        if median is not None:
            patch_medians.append(median)
        field_patches.append(
            {
                "patchIndex": patch_index,
                "pointCount": int(selected.size),
                "elevationFeet": {
                    "median": median,
                    "p05": percentile(selected, 5),
                    "p95": percentile(selected, 95),
                },
            }
        )
    if len(patch_medians) != len(field_patch_world_feet):
        raise ValueError(f"{label} lacks complete class-2 field patch coverage")
    field_datum = float(np.median(np.asarray(patch_medians, dtype=np.float64)))

    rows = []
    for index in range(row_count):
        selected = assigned_rows == index
        clusters = elevation_clusters(
            assigned_z[selected],
            assigned_sources[selected],
            cluster_gap_feet,
            minimum_cluster_points,
        )
        normalized = []
        for candidate in clusters:
            normalized.append(
                {
                    **candidate,
                    "relativeToFieldFeet": (
                        candidate["elevationFeet"]["median"] - field_datum
                    ),
                }
            )
        rows.append(
            {
                "assignedPointCount": int(np.count_nonzero(selected)),
                "candidateCount": len(normalized),
                "candidates": normalized,
            }
        )

    return {
        "label": label,
        "projectName": manifest.get("projectName"),
        "manifest": {
            "path": str(manifest_path),
            "sha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "artifactVersion": manifest.get("artifactVersion"),
        },
        "lidarInputs": lidar_inputs,
        "horizontalCrs": horizontal_crs.to_string(),
        "horizontalNativeUnitToFeet": native_to_feet,
        "acceptedStructureClassifications": accepted_classes,
        "gpsTimeTypes": sorted(gps_time_types),
        "gpsTimeRangeRaw": (
            [gps_minimum, gps_maximum]
            if math.isfinite(gps_minimum) and math.isfinite(gps_maximum)
            else None
        ),
        "fieldDatumFeet": field_datum,
        "fieldPatches": field_patches,
        "structurePointCountInsideExtent": int(structure_points.shape[0]),
        "groundPointCountInsideExtent": int(ground_points.shape[0]),
        "structurePointCountAssignedToSeats": int(np.count_nonzero(assigned)),
        "rows": rows,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--epoch", type=parse_named_path, action="append", required=True)
    parser.add_argument(
        "--accepted-classes", type=parse_named_classes, action="append", required=True
    )
    parser.add_argument("--maximum-seat-distance-feet", type=float, default=1.25)
    parser.add_argument("--field-patch-radius-feet", type=float, default=15.0)
    parser.add_argument("--cluster-gap-feet", type=float, default=0.45)
    parser.add_argument("--minimum-cluster-points", type=int, default=2)
    parser.add_argument("--maximum-cross-epoch-disagreement-feet", type=float, default=1.0)
    parser.add_argument("--minimum-profile-run-rows", type=int, default=5)
    parser.add_argument("--minimum-riser-feet", type=float, default=0.15)
    parser.add_argument("--maximum-riser-feet", type=float, default=1.5)
    arguments = parser.parse_args()
    if len(arguments.epoch) < 2:
        raise ValueError("At least two independent epochs are required")
    epoch_labels = [label for label, _ in arguments.epoch]
    if len(set(epoch_labels)) != len(epoch_labels):
        raise ValueError("Epoch labels must be unique")
    accepted_by_label = dict(arguments.accepted_classes)
    if set(accepted_by_label) != set(epoch_labels):
        raise ValueError("Every epoch requires exactly one accepted-class list")
    if 2 in {value for values in accepted_by_label.values() for value in values}:
        raise ValueError("Class 2 ground cannot be used as a structural row candidate")
    if arguments.maximum_seat_distance_feet <= 0:
        raise ValueError("Maximum seat distance must be positive")
    if arguments.field_patch_radius_feet <= 0 or arguments.cluster_gap_feet <= 0:
        raise ValueError("Field radius and cluster gap must be positive")
    if arguments.minimum_cluster_points < 2:
        raise ValueError("Minimum cluster points must be at least two")
    if arguments.maximum_cross_epoch_disagreement_feet <= 0:
        raise ValueError("Cross-epoch disagreement threshold must be positive")

    world_bytes = arguments.world_rows.read_bytes()
    world = json.loads(world_bytes)
    if world.get("artifactKind") != "ticketmaster-drcog-row-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if world.get("geometryBoundary", {}).get("establishesMeasuredRowElevations"):
        raise ValueError("Expected an unelevated provider-plan candidate")
    coordinate_reference = world.get("projectedCoordinateReference", {})
    world_wkid = coordinate_reference.get("latestWkid") or coordinate_reference.get("wkid")
    if not world_wkid:
        raise ValueError("World-row input lacks a projected CRS")
    world_crs = CRS.from_epsg(int(world_wkid))
    selected_sections = list(dict.fromkeys(arguments.section))
    rows = [
        row for row in world.get("rows", []) if row.get("sectionName") in selected_sections
    ]
    rows.sort(
        key=lambda row: (
            selected_sections.index(row["sectionName"]),
            row_number(row["rowName"]) if row_number(row["rowName"]) is not None else 10**9,
            row["rowName"],
        )
    )
    if not rows:
        raise ValueError("No requested rows exist in the world-row input")
    found_sections = {row["sectionName"] for row in rows}
    if found_sections != set(selected_sections):
        raise ValueError("At least one requested section is absent")

    seat_parts = []
    seat_row_indices = []
    for index, row in enumerate(rows):
        positions = np.asarray(
            [seat["positionProjectedFeet"] for seat in row["seats"]], dtype=np.float64
        )
        if positions.shape != (len(row["seats"]), 2) or not np.all(np.isfinite(positions)):
            raise ValueError(f"Invalid row coordinates: {row.get('rowKey')}")
        seat_parts.append(positions)
        seat_row_indices.extend([index] * len(positions))
    seat_world_feet = np.vstack(seat_parts)
    seat_row_indices_array = np.asarray(seat_row_indices, dtype=np.int32)

    transform = world.get("transform", {})
    home = np.asarray(transform.get("homePlateProjectedFeet"), dtype=np.float64)
    axis = np.asarray(transform.get("fieldAxisProjectedUnitVector"), dtype=np.float64)
    if home.shape != (2,) or axis.shape != (2,) or not np.all(np.isfinite(home)):
        raise ValueError("World-row transform lacks valid field controls")
    axis /= np.linalg.norm(axis)
    field_patch_world_feet = np.asarray(
        [home + axis * distance for distance in (160.0, 220.0, 280.0)],
        dtype=np.float64,
    )

    epochs = []
    for label, manifest_path in arguments.epoch:
        epochs.append(
            load_epoch(
                label,
                manifest_path,
                accepted_by_label[label],
                world_crs,
                seat_world_feet,
                seat_row_indices_array,
                len(rows),
                field_patch_world_feet,
                arguments.maximum_seat_distance_feet,
                arguments.field_patch_radius_feet,
                arguments.cluster_gap_feet,
                arguments.minimum_cluster_points,
            )
        )

    row_results = []
    for index, source_row in enumerate(rows):
        candidates = {
            epoch["label"]: epoch["rows"][index]["candidates"] for epoch in epochs
        }
        match = select_cross_epoch_match(
            candidates,
            epoch_labels,
            arguments.maximum_cross_epoch_disagreement_feet,
        )
        row_results.append(
            {
                "rowKey": source_row["rowKey"],
                "sectionName": source_row["sectionName"],
                "rowName": source_row["rowName"],
                "seatCount": len(source_row["seats"]),
                "epochs": {
                    epoch["label"]: epoch["rows"][index] for epoch in epochs
                },
                "crossEpochMatch": match,
                "measuredRowElevationFeet": None,
                "geometryBoundary": {
                    "repeatableStructuralSurfaceCandidate": match is not None,
                    "seatingRowWalkingSurfaceEstablished": False,
                    "measuredRowElevationEstablished": False,
                },
            }
        )

    profile_run_count = 0
    profile_row_count = 0
    for section in selected_sections:
        indexes = [
            index
            for index, row in enumerate(row_results)
            if row["sectionName"] == section and row_number(row["rowName"]) is not None
        ]
        indexes.sort(key=lambda index: int(row_results[index]["rowName"]))
        runs: list[list[int]] = []
        current: list[int] = []
        for index in indexes:
            if not current:
                current = [index]
                continue
            previous = current[-1]
            previous_match = row_results[previous]["crossEpochMatch"]
            current_match = row_results[index]["crossEpochMatch"]
            riser = None
            if previous_match is not None and current_match is not None:
                riser = (
                    current_match["relativeHeightFeet"]["medianAcrossEpochs"]
                    - previous_match["relativeHeightFeet"]["medianAcrossEpochs"]
                )
            connected = bool(
                int(row_results[index]["rowName"])
                == int(row_results[previous]["rowName"]) + 1
                and riser is not None
                and arguments.minimum_riser_feet <= riser <= arguments.maximum_riser_feet
            )
            if connected:
                current.append(index)
            else:
                runs.append(current)
                current = [index]
        if current:
            runs.append(current)
        for run in runs:
            if len(run) < arguments.minimum_profile_run_rows:
                continue
            profile_run_count += 1
            profile_row_count += len(run)
            profile = {
                "id": f"{section}-cross-epoch-profile-{profile_run_count:03d}",
                "rowCount": len(run),
                "firstRowName": row_results[run[0]]["rowName"],
                "lastRowName": row_results[run[-1]]["rowName"],
            }
            for index in run:
                row_results[index]["crossEpochMonotonicProfile"] = profile

    matched_count = sum(row["crossEpochMatch"] is not None for row in row_results)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "worldRowsSha256": hashlib.sha256(world_bytes).hexdigest(),
        "selectedSections": selected_sections,
        "thresholds": {
            "maximumSeatDistanceFeet": arguments.maximum_seat_distance_feet,
            "fieldPatchRadiusFeet": arguments.field_patch_radius_feet,
            "clusterGapFeet": arguments.cluster_gap_feet,
            "minimumClusterPoints": arguments.minimum_cluster_points,
            "maximumCrossEpochDisagreementFeet": arguments.maximum_cross_epoch_disagreement_feet,
            "minimumProfileRunRows": arguments.minimum_profile_run_rows,
            "minimumRiserFeet": arguments.minimum_riser_feet,
            "maximumRiserFeet": arguments.maximum_riser_feet,
        },
        "fieldPatchProjectedFeet": field_patch_world_feet.tolist(),
        "epochs": [
            {key: value for key, value in epoch.items() if key != "rows"}
            for epoch in epochs
        ],
        "rowResults": row_results,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-cross-epoch-lidar-row-cluster-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "artifactVersion": stable_version(stable),
        "stadiumId": world["stadiumId"],
        "inputs": {
            "worldRows": {
                "path": str(arguments.world_rows),
                "sha256": stable["worldRowsSha256"],
                "artifactVersion": world.get("artifactVersion"),
            },
            "epochs": [
                {
                    "label": epoch["label"],
                    "manifest": epoch["manifest"],
                    "lidarInputs": epoch["lidarInputs"],
                    "acceptedStructureClassifications": epoch[
                        "acceptedStructureClassifications"
                    ],
                }
                for epoch in epochs
            ],
        },
        "selectedSections": selected_sections,
        "thresholds": stable["thresholds"],
        "fieldDatumControls": {
            "projectedCoordinateReference": world.get("projectedCoordinateReference"),
            "patchCentersProjectedFeet": field_patch_world_feet.tolist(),
            "patchRadiusFeet": arguments.field_patch_radius_feet,
            "epochs": {
                epoch["label"]: {
                    "fieldDatumFeet": epoch["fieldDatumFeet"],
                    "fieldPatches": epoch["fieldPatches"],
                }
                for epoch in epochs
            },
        },
        "summary": {
            "rowCount": len(row_results),
            "crossEpochMatchedStructuralSurfaceCandidateCount": matched_count,
            "crossEpochMatchedStructuralSurfaceCandidatePercent": (
                100.0 * matched_count / len(row_results)
            ),
            "monotonicProfileRunCount": profile_run_count,
            "monotonicProfileRowCount": profile_row_count,
            "measuredRowElevationCount": 0,
            "publicationEligibleRowElevationCount": 0,
        },
        "rows": row_results,
        "geometryBoundary": {
            "establishesIndependentCrossEpochStructuralSurfaceRepeatability": matched_count > 0,
            "establishesPlayingFieldNormalizedRelativeHeights": True,
            "establishesLocalPlanRegistrationWithinOneFoot": False,
            "establishesThatMatchedReturnsAreRowWalkingSurfaces": False,
            "establishesMeasuredRowElevations": False,
            "establishesCurrentGeometry": False,
            "note": (
                "Cross-epoch agreement is necessary evidence for a permanent surface, but "
                "does not identify the surface or establish current row and obstruction geometry."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "LOCAL_PLAN_REGISTRATION_UNCERTAINTY_EXCEEDS_OR_LACKS_ONE_FOOT_PROOF",
                "AIRBORNE_RETURN_SEMANTICS_NOT_PROVEN_AS_ROW_WALKING_SURFACE",
                "HISTORICAL_EPOCHS_DO_NOT_ESTABLISH_CURRENT_GEOMETRY",
                "FIELD_SURFACE_NORMALIZATION_IS_NOT_A_SURVEYED_VERTICAL_DATUM_TRANSFER",
                "CURRENT_OVERHANG_UNDERSIDES_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(
        json.dumps(artifact, indent=2) + "\n", encoding="utf-8"
    )
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "publication": artifact["publication"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

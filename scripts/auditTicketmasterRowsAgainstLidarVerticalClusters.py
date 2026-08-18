#!/usr/bin/env python3
"""Search independent LiDAR flightlines for repeatable row-height profiles.

The existing nearest-return audit can select an overhead deck when multiple
vertical surfaces share one provider-plan coordinate. This audit retains all
nearby vertical return clusters, matches clusters between flightlines, and then
searches consecutive numeric rows for a plausible monotonic riser profile.
Matched profiles remain candidates because airborne LiDAR alone does not prove
that a repeatable stepped surface is the seating tread.
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


METRES_TO_FEET = 3.280839895013123
ANALYSIS_VERSION = "ticketmaster-lidar-vertical-cluster-profile-audit-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def clusters(values: np.ndarray, maximum_gap_feet: float) -> list[np.ndarray]:
    if values.size == 0:
        return []
    ordered = np.sort(values.astype(np.float64))
    boundaries = np.flatnonzero(np.diff(ordered) > maximum_gap_feet) + 1
    return [part for part in np.split(ordered, boundaries) if part.size > 0]


def percentile(values: list[float] | np.ndarray, probability: float) -> float | None:
    array = np.asarray(values, dtype=np.float64)
    return float(np.percentile(array, probability)) if array.size else None


def numeric_row(value: str) -> int | None:
    try:
        parsed = int(value)
    except ValueError:
        return None
    return parsed if str(parsed) == value else None


def load_points(
    manifest: dict[str, Any],
    bounds: tuple[np.ndarray, np.ndarray],
    point_source_ids: list[int],
    classifications: list[int],
) -> tuple[CRS, dict[int, np.ndarray], list[dict[str, Any]]]:
    minimum, maximum = bounds
    parts: dict[int, list[np.ndarray]] = {source_id: [] for source_id in point_source_ids}
    source_crs: CRS | None = None
    inputs: list[dict[str, Any]] = []
    for tile in manifest["tiles"]:
        path = Path(tile["path"])
        actual_sha = sha256_file(path)
        if actual_sha != tile["sha256"]:
            raise ValueError(f"LiDAR checksum mismatch: {path}")
        inputs.append({"path": str(path.resolve()), "sha256": actual_sha})
        with laspy.open(path) as reader:
            embedded = reader.header.parse_crs()
            if embedded is None:
                raise ValueError(f"LiDAR tile lacks an embedded CRS: {path}")
            embedded_crs = CRS.from_user_input(embedded)
            horizontal = CRS.from_user_input(
                embedded_crs.sub_crs_list[0] if embedded_crs.is_compound else embedded_crs
            )
            if source_crs is None:
                source_crs = horizontal
            elif not horizontal.equals(source_crs):
                raise ValueError("LiDAR tiles do not share one horizontal CRS")
            for points in reader.chunk_iterator(2_000_000):
                x = np.asarray(points.x)
                y = np.asarray(points.y)
                z = np.asarray(points.z)
                source_id = np.asarray(points.point_source_id)
                classification = np.asarray(points.classification)
                inside = (
                    (x >= minimum[0])
                    & (x <= maximum[0])
                    & (y >= minimum[1])
                    & (y <= maximum[1])
                    & np.isin(classification, classifications)
                )
                for requested in point_source_ids:
                    selected = inside & (source_id == requested)
                    if np.any(selected):
                        parts[requested].append(
                            np.column_stack((x[selected], y[selected], z[selected]))
                        )
    if source_crs is None:
        raise ValueError("No LiDAR tiles were loaded")
    combined = {}
    for source_id, source_parts in parts.items():
        if not source_parts:
            raise ValueError(f"No accepted points for point source {source_id}")
        combined[source_id] = np.vstack(source_parts)
    return source_crs, combined, inputs


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("lidar_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--point-source-id", type=int, action="append", required=True)
    parser.add_argument("--composite-name", action="append", required=True)
    parser.add_argument("--accepted-classification", type=int, action="append")
    parser.add_argument("--horizontal-radius-feet", type=float, default=1.5)
    parser.add_argument("--within-flightline-cluster-gap-feet", type=float, default=0.45)
    parser.add_argument("--maximum-flightline-disagreement-feet", type=float, default=1.0)
    parser.add_argument("--row-mode-gap-feet", type=float, default=0.75)
    parser.add_argument("--minimum-row-seat-coverage", type=float, default=0.5)
    parser.add_argument("--maximum-row-mode-span-feet", type=float, default=2.0)
    parser.add_argument("--minimum-profile-rows", type=int, default=5)
    parser.add_argument("--minimum-riser-feet", type=float, default=0.15)
    parser.add_argument("--maximum-riser-feet", type=float, default=1.5)
    arguments = parser.parse_args()

    point_source_ids = list(dict.fromkeys(arguments.point_source_id))
    composite_names = list(dict.fromkeys(arguments.composite_name))
    classifications = arguments.accepted_classification or [1, 2, 17, 20]
    if len(point_source_ids) != 2:
        raise ValueError("Exactly two point-source IDs are required")
    if not 0 < arguments.minimum_row_seat_coverage <= 1:
        raise ValueError("Minimum row seat coverage must be within zero and one")
    if arguments.minimum_profile_rows < 3:
        raise ValueError("Minimum profile length must be at least three rows")

    world_bytes = arguments.world_rows.read_bytes()
    lidar_bytes = arguments.lidar_manifest.read_bytes()
    world = json.loads(world_bytes)
    lidar_manifest = json.loads(lidar_bytes)
    if world.get("artifactKind") != "ticketmaster-drcog-row-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if lidar_manifest.get("artifactKind") not in {
        "usgs-lidar-project-acquisition",
        "lidar-project-acquisition",
    }:
        raise ValueError("LiDAR input has the wrong artifact kind")
    if world.get("stadiumId") != lidar_manifest.get("stadiumId"):
        raise ValueError("Stadium identifiers do not agree")

    selected_rows = [
        row for row in world["rows"] if row.get("compositeName") in composite_names
    ]
    found_names = {row.get("compositeName") for row in selected_rows}
    missing_names = sorted(set(composite_names) - found_names)
    if missing_names:
        raise ValueError(f"Unknown composite names: {missing_names}")
    seat_positions_feet = np.vstack([
        np.asarray([seat["positionProjectedFeet"] for seat in row["seats"]], dtype=np.float64)
        for row in selected_rows
    ])

    coordinate_reference = world["projectedCoordinateReference"]
    source_wkid = coordinate_reference.get("latestWkid") or coordinate_reference.get("wkid")
    first_tile = Path(lidar_manifest["tiles"][0]["path"])
    with laspy.open(first_tile) as reader:
        embedded = reader.header.parse_crs()
    if embedded is None:
        raise ValueError("First LiDAR tile has no embedded CRS")
    embedded_crs = CRS.from_user_input(embedded)
    lidar_horizontal = CRS.from_user_input(
        embedded_crs.sub_crs_list[0] if embedded_crs.is_compound else embedded_crs
    )
    transformer = Transformer.from_crs(
        CRS.from_epsg(int(source_wkid)), lidar_horizontal, always_xy=True
    )
    query_x, query_y = transformer.transform(
        seat_positions_feet[:, 0], seat_positions_feet[:, 1]
    )
    query_xy = np.column_stack((query_x, query_y))
    radius_metres = arguments.horizontal_radius_feet / METRES_TO_FEET
    padding = radius_metres + 2.0
    bounds = (np.min(query_xy, axis=0) - padding, np.max(query_xy, axis=0) + padding)
    lidar_crs, points_by_source, lidar_inputs = load_points(
        lidar_manifest, bounds, point_source_ids, classifications
    )
    if not lidar_crs.equals(lidar_horizontal):
        raise ValueError("LiDAR CRS changed while loading points")
    trees = {
        source_id: cKDTree(points[:, :2])
        for source_id, points in points_by_source.items()
    }

    row_records: list[dict[str, Any]] = []
    seat_cursor = 0
    for row in selected_rows:
        seat_count = len(row["seats"])
        row_xy = query_xy[seat_cursor:seat_cursor + seat_count]
        seat_cursor += seat_count
        matches: list[dict[str, Any]] = []
        for seat_index, seat_xy in enumerate(row_xy):
            source_clusters: dict[int, list[dict[str, Any]]] = {}
            for source_id in point_source_ids:
                indexes = trees[source_id].query_ball_point(seat_xy, radius_metres)
                elevations = points_by_source[source_id][indexes, 2] * METRES_TO_FEET
                source_clusters[source_id] = [
                    {
                        "median": float(np.median(part)),
                        "pointCount": int(part.size),
                        "spanFeet": float(np.max(part) - np.min(part)),
                    }
                    for part in clusters(
                        elevations, arguments.within_flightline_cluster_gap_feet
                    )
                ]
            first_source, second_source = point_source_ids
            candidate_pairs = []
            for first in source_clusters[first_source]:
                for second in source_clusters[second_source]:
                    disagreement = abs(first["median"] - second["median"])
                    if disagreement <= arguments.maximum_flightline_disagreement_feet:
                        candidate_pairs.append((disagreement, first, second))
            used_first: set[float] = set()
            used_second: set[float] = set()
            for disagreement, first, second in sorted(candidate_pairs, key=lambda item: item[0]):
                if first["median"] in used_first or second["median"] in used_second:
                    continue
                used_first.add(first["median"])
                used_second.add(second["median"])
                matches.append(
                    {
                        "seatIndex": seat_index,
                        "elevationFeet": (first["median"] + second["median"]) / 2,
                        "flightlineDisagreementFeet": disagreement,
                        "pointCounts": {
                            str(first_source): first["pointCount"],
                            str(second_source): second["pointCount"],
                        },
                    }
                )

        if matches:
            ordered_matches = sorted(matches, key=lambda match: match["elevationFeet"])
            groups: list[list[dict[str, Any]]] = [[ordered_matches[0]]]
            for match in ordered_matches[1:]:
                if (
                    match["elevationFeet"] - groups[-1][-1]["elevationFeet"]
                    <= arguments.row_mode_gap_feet
                ):
                    groups[-1].append(match)
                else:
                    groups.append([match])
        else:
            groups = []
        modes = []
        for group_index, group in enumerate(groups, start=1):
            best_by_seat: dict[int, dict[str, Any]] = {}
            for match in group:
                current = best_by_seat.get(match["seatIndex"])
                if current is None or match["flightlineDisagreementFeet"] < current["flightlineDisagreementFeet"]:
                    best_by_seat[match["seatIndex"]] = match
            unique = list(best_by_seat.values())
            elevations = [match["elevationFeet"] for match in unique]
            disagreements = [match["flightlineDisagreementFeet"] for match in unique]
            coverage = len(unique) / seat_count
            span = max(elevations) - min(elevations)
            eligible = (
                coverage >= arguments.minimum_row_seat_coverage
                and span <= arguments.maximum_row_mode_span_feet
            )
            modes.append(
                {
                    "modeId": f"{row['rowKey']}:mode-{group_index}",
                    "matchedSeatCount": len(unique),
                    "coveragePercent": coverage * 100,
                    "medianElevationFeet": float(np.median(elevations)),
                    "elevationP05Feet": percentile(elevations, 5),
                    "elevationP95Feet": percentile(elevations, 95),
                    "elevationSpanFeet": span,
                    "flightlineDisagreementP95Feet": percentile(disagreements, 95),
                    "profileEligible": eligible,
                }
            )
        row_records.append(
            {
                "rowKey": row["rowKey"],
                "compositeName": row.get("compositeName"),
                "sectionName": row["sectionName"],
                "rowName": row["rowName"],
                "seatCount": seat_count,
                "repeatableVerticalModeCount": len(modes),
                "verticalModes": modes,
                "selectedProfileModeId": None,
                "profileCandidate": False,
                "measuredRowElevationFeet": None,
                "geometryBoundary": {
                    "directlyMeasuresRepeatableVerticalClusters": bool(modes),
                    "directlyMeasuresSeatingRowElevation": False,
                },
            }
        )

    best_profiles: list[dict[str, Any]] = []
    rows_by_section: dict[str, list[dict[str, Any]]] = {}
    for row in row_records:
        if numeric_row(row["rowName"]) is not None:
            rows_by_section.setdefault(row["sectionName"], []).append(row)
    for section_name, section_rows in rows_by_section.items():
        ordered_rows = sorted(section_rows, key=lambda row: int(row["rowName"]))
        states: list[dict[str, Any]] = []
        best_state: dict[str, Any] | None = None
        previous_row_number: int | None = None
        previous_states: list[dict[str, Any]] = []
        for row in ordered_rows:
            row_number = int(row["rowName"])
            current_states = []
            eligible_modes = [mode for mode in row["verticalModes"] if mode["profileEligible"]]
            for mode in eligible_modes:
                state = {
                    "length": 1,
                    "coverageSum": mode["coveragePercent"],
                    "path": [(row, mode)],
                }
                if previous_row_number is not None and row_number == previous_row_number + 1:
                    for previous in previous_states:
                        previous_elevation = previous["path"][-1][1]["medianElevationFeet"]
                        riser = mode["medianElevationFeet"] - previous_elevation
                        if arguments.minimum_riser_feet <= riser <= arguments.maximum_riser_feet:
                            candidate_state = {
                                "length": previous["length"] + 1,
                                "coverageSum": previous["coverageSum"] + mode["coveragePercent"],
                                "path": previous["path"] + [(row, mode)],
                            }
                            if (candidate_state["length"], candidate_state["coverageSum"]) > (
                                state["length"], state["coverageSum"]
                            ):
                                state = candidate_state
                current_states.append(state)
                if best_state is None or (state["length"], state["coverageSum"]) > (
                    best_state["length"], best_state["coverageSum"]
                ):
                    best_state = state
            previous_states = current_states
            previous_row_number = row_number
            states.extend(current_states)
        if best_state is None or best_state["length"] < arguments.minimum_profile_rows:
            continue
        path = best_state["path"]
        elevations = [mode["medianElevationFeet"] for _, mode in path]
        risers = np.diff(np.asarray(elevations, dtype=np.float64))
        profile = {
            "profileId": f"{section_name}:best-profile",
            "sectionName": section_name,
            "rowCount": len(path),
            "firstRowName": path[0][0]["rowName"],
            "lastRowName": path[-1][0]["rowName"],
            "meanCoveragePercent": best_state["coverageSum"] / len(path),
            "minimumRiserFeet": float(np.min(risers)),
            "medianRiserFeet": float(np.median(risers)),
            "maximumRiserFeet": float(np.max(risers)),
            "rows": [
                {
                    "rowKey": row["rowKey"],
                    "modeId": mode["modeId"],
                    "candidateElevationFeet": mode["medianElevationFeet"],
                }
                for row, mode in path
            ],
        }
        best_profiles.append(profile)
        for row, mode in path:
            row["selectedProfileModeId"] = mode["modeId"]
            row["profileCandidate"] = True

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "worldRowsPath": str(arguments.world_rows.resolve()),
            "worldRowsSha256": hashlib.sha256(world_bytes).hexdigest(),
            "lidarManifestPath": str(arguments.lidar_manifest.resolve()),
            "lidarManifestSha256": hashlib.sha256(lidar_bytes).hexdigest(),
            "lidarTiles": lidar_inputs,
        },
        "pointSourceIds": point_source_ids,
        "compositeNames": composite_names,
        "acceptedClassifications": classifications,
        "thresholds": {
            "horizontalRadiusFeet": arguments.horizontal_radius_feet,
            "withinFlightlineClusterGapFeet": arguments.within_flightline_cluster_gap_feet,
            "maximumFlightlineDisagreementFeet": arguments.maximum_flightline_disagreement_feet,
            "rowModeGapFeet": arguments.row_mode_gap_feet,
            "minimumRowSeatCoverage": arguments.minimum_row_seat_coverage,
            "maximumRowModeSpanFeet": arguments.maximum_row_mode_span_feet,
            "minimumProfileRows": arguments.minimum_profile_rows,
            "minimumRiserFeet": arguments.minimum_riser_feet,
            "maximumRiserFeet": arguments.maximum_riser_feet,
        },
        "rows": row_records,
        "bestProfiles": best_profiles,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-lidar-vertical-cluster-profile-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "artifactVersion": stable_version(stable),
        **stable,
        "summary": {
            "rowCount": len(row_records),
            "rowWithRepeatableModeCount": sum(bool(row["verticalModes"]) for row in row_records),
            "profileCandidateRowCount": sum(bool(row["profileCandidate"]) for row in row_records),
            "profileCount": len(best_profiles),
        },
        "publicationEligible": False,
        "blockers": [
            "VERTICAL_CLUSTER_PROFILE_DOES_NOT_PROVE_SEATING_TREAD_IDENTITY",
            "AIRBORNE_LIDAR_CAN_SAMPLE_SEATS_RAILINGS_ROOFS_AND_DECKS",
            "NO_ROW_ELEVATION_IS_PROMOTED_BY_THIS_AUDIT",
        ],
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

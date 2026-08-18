#!/usr/bin/env python3
"""Audit provider-plan row coordinates against independent LiDAR flightlines.

The audit deliberately separates a repeatable topmost LiDAR surface from a
measured seating-row elevation. Airborne returns can land on roofs, railings,
seat backs, field surfaces, and upper decks. Agreement between flightlines is
therefore necessary evidence, but it is not sufficient to label a row height.
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


ANALYSIS_VERSION = "ticketmaster-lidar-flightline-row-surface-audit-v1"
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


def numeric_row_name(value: str) -> int | None:
    try:
        number = int(value)
    except ValueError:
        return None
    return number if str(number) == value else None


def load_lidar_points(
    manifest: dict[str, Any],
    query_bounds_metres: tuple[np.ndarray, np.ndarray],
    point_source_ids: list[int],
    accepted_classifications: list[int],
) -> tuple[CRS, dict[int, np.ndarray], list[dict[str, Any]]]:
    minimum, maximum = query_bounds_metres
    sources: dict[int, list[np.ndarray]] = {value: [] for value in point_source_ids}
    source_crs: CRS | None = None
    lidar_inputs: list[dict[str, Any]] = []
    for tile in manifest.get("tiles", []):
        path = Path(tile["path"])
        if not path.is_file():
            raise FileNotFoundError(path)
        actual_sha = sha256_file(path)
        if actual_sha != tile.get("sha256"):
            raise ValueError(f"LiDAR tile checksum mismatch: {path}")
        lidar_inputs.append(
            {
                "path": str(path),
                "sha256": actual_sha,
                "byteLength": path.stat().st_size,
            }
        )
        with laspy.open(path) as reader:
            tile_crs = reader.header.parse_crs()
            if tile_crs is None:
                raise ValueError(f"LiDAR tile has no embedded CRS: {path}")
            tile_crs = CRS.from_user_input(tile_crs)
            tile_horizontal = CRS.from_user_input(
                tile_crs.sub_crs_list[0] if tile_crs.is_compound else tile_crs
            )
            if source_crs is None:
                source_crs = tile_horizontal
            elif not tile_horizontal.equals(source_crs):
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
                    & np.isin(classification, accepted_classifications)
                )
                for requested_id in point_source_ids:
                    selected = inside & (source_id == requested_id)
                    if np.any(selected):
                        sources[requested_id].append(
                            np.column_stack((x[selected], y[selected], z[selected]))
                        )
    if source_crs is None:
        raise ValueError("LiDAR manifest contains no readable tiles")
    combined: dict[int, np.ndarray] = {}
    for source_id, parts in sources.items():
        if not parts:
            raise ValueError(
                f"Point source {source_id} has no accepted points inside the row extent"
            )
        combined[source_id] = np.vstack(parts)
    return source_crs, combined, lidar_inputs


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("lidar_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--point-source-id", type=int, action="append", required=True)
    parser.add_argument("--maximum-nearest-distance-feet", type=float, default=1.5)
    parser.add_argument("--maximum-flightline-disagreement-feet", type=float, default=1.0)
    parser.add_argument("--minimum-row-agreement-coverage", type=float, default=0.5)
    parser.add_argument("--minimum-row-samples", type=int, default=3)
    parser.add_argument("--minimum-profile-run-rows", type=int, default=5)
    parser.add_argument("--minimum-riser-feet", type=float, default=0.15)
    parser.add_argument("--maximum-riser-feet", type=float, default=1.5)
    parser.add_argument(
        "--accepted-classification",
        type=int,
        action="append",
        default=None,
    )
    arguments = parser.parse_args()

    point_source_ids = list(dict.fromkeys(arguments.point_source_id))
    if len(point_source_ids) != 2:
        raise ValueError("Exactly two distinct point-source IDs are required")
    accepted_classifications = arguments.accepted_classification or [1, 2, 17, 20]
    if not 0 < arguments.minimum_row_agreement_coverage <= 1:
        raise ValueError("Minimum row agreement coverage must be within zero and one")
    if arguments.minimum_profile_run_rows < 3:
        raise ValueError("A seating profile run must contain at least three rows")

    world_bytes = arguments.world_rows.read_bytes()
    manifest_bytes = arguments.lidar_manifest.read_bytes()
    world = json.loads(world_bytes)
    manifest = json.loads(manifest_bytes)
    if world.get("artifactKind") != "ticketmaster-drcog-row-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if manifest.get("artifactKind") not in {
        "usgs-lidar-project-acquisition",
        "lidar-project-acquisition",
    }:
        raise ValueError("LiDAR input has the wrong artifact kind")
    if world.get("stadiumId") != manifest.get("stadiumId"):
        raise ValueError("World-row and LiDAR stadium identifiers do not agree")
    geometry_boundary = world.get("geometryBoundary", {})
    if geometry_boundary.get("establishesMeasuredRowElevations"):
        raise ValueError("Expected an unelevated provider-plan registration candidate")

    coordinate_reference = world.get("projectedCoordinateReference", {})
    source_wkid = coordinate_reference.get("latestWkid") or coordinate_reference.get("wkid")
    if not source_wkid:
        raise ValueError("World-row input lacks a projected CRS identifier")

    row_slices: list[slice] = []
    projected_feet_parts: list[np.ndarray] = []
    cursor = 0
    for row in world.get("rows", []):
        seats = row.get("seats", [])
        if not seats:
            raise ValueError(f"Row {row.get('rowKey')} contains no seats")
        positions = np.asarray(
            [seat.get("positionProjectedFeet") for seat in seats], dtype=np.float64
        )
        if positions.shape != (len(seats), 2) or not np.all(np.isfinite(positions)):
            raise ValueError(f"Row {row.get('rowKey')} has invalid projected coordinates")
        projected_feet_parts.append(positions)
        row_slices.append(slice(cursor, cursor + len(seats)))
        cursor += len(seats)
    if not projected_feet_parts:
        raise ValueError("World-row input contains no rows")
    projected_feet = np.vstack(projected_feet_parts)

    # First use a representative LiDAR tile to discover its horizontal CRS.
    first_tile = Path(manifest["tiles"][0]["path"])
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
        projected_feet[:, 0], projected_feet[:, 1]
    )
    query_xy = np.column_stack((query_x, query_y))
    padding_metres = arguments.maximum_nearest_distance_feet / METRES_TO_FEET + 2.0
    bounds = (
        np.min(query_xy, axis=0) - padding_metres,
        np.max(query_xy, axis=0) + padding_metres,
    )

    lidar_crs, lidar_points, lidar_inputs = load_lidar_points(
        manifest,
        bounds,
        point_source_ids,
        accepted_classifications,
    )
    if not lidar_crs.equals(lidar_horizontal):
        raise ValueError("LiDAR CRS changed while loading tiles")

    nearest: dict[int, dict[str, np.ndarray]] = {}
    for source_id in point_source_ids:
        points = lidar_points[source_id]
        distance_metres, indexes = cKDTree(points[:, :2]).query(query_xy, k=1)
        nearest[source_id] = {
            "distanceFeet": distance_metres * METRES_TO_FEET,
            "elevationFeet": points[indexes, 2] * METRES_TO_FEET,
        }

    first_source, second_source = point_source_ids
    first_distances = nearest[first_source]["distanceFeet"]
    second_distances = nearest[second_source]["distanceFeet"]
    first_elevations = nearest[first_source]["elevationFeet"]
    second_elevations = nearest[second_source]["elevationFeet"]
    paired_distance_eligible = (
        (first_distances <= arguments.maximum_nearest_distance_feet)
        & (second_distances <= arguments.maximum_nearest_distance_feet)
    )
    flightline_difference = np.abs(first_elevations - second_elevations)
    paired_agreement = paired_distance_eligible & (
        flightline_difference <= arguments.maximum_flightline_disagreement_feet
    )

    rows: list[dict[str, Any]] = []
    for source_row, row_slice in zip(world["rows"], row_slices):
        seat_count = row_slice.stop - row_slice.start
        paired = paired_distance_eligible[row_slice]
        agreement = paired_agreement[row_slice]
        required_samples = max(
            arguments.minimum_row_samples,
            int(math.ceil(seat_count * arguments.minimum_row_agreement_coverage)),
        )
        agreement_count = int(np.count_nonzero(agreement))
        repeatable = agreement_count >= required_samples
        agreeing_elevations = np.concatenate(
            (
                first_elevations[row_slice][agreement],
                second_elevations[row_slice][agreement],
            )
        )
        candidate_elevation = (
            float(np.median(agreeing_elevations)) if repeatable else None
        )
        rows.append(
            {
                "rowKey": source_row["rowKey"],
                "compositeName": source_row.get("compositeName"),
                "sectionName": source_row["sectionName"],
                "rowName": source_row["rowName"],
                "seatCount": seat_count,
                "pointSourceSamples": {
                    str(source_id): {
                        "pointCountInsideAuditExtent": int(
                            lidar_points[source_id].shape[0]
                        ),
                        "seatCountWithinMaximumDistance": int(
                            np.count_nonzero(
                                nearest[source_id]["distanceFeet"][row_slice]
                                <= arguments.maximum_nearest_distance_feet
                            )
                        ),
                        "nearestDistanceFeet": {
                            "median": percentile(
                                nearest[source_id]["distanceFeet"][row_slice], 50
                            ),
                            "p95": percentile(
                                nearest[source_id]["distanceFeet"][row_slice], 95
                            ),
                        },
                    }
                    for source_id in point_source_ids
                },
                "pairedSeatCount": int(np.count_nonzero(paired)),
                "pairedCoveragePercent": float(np.mean(paired) * 100),
                "agreeingSeatCount": agreement_count,
                "agreementCoveragePercent": float(np.mean(agreement) * 100),
                "requiredAgreementSamples": required_samples,
                "flightlineElevationDifferenceFeet": {
                    "median": percentile(
                        flightline_difference[row_slice][paired], 50
                    ),
                    "p95": percentile(
                        flightline_difference[row_slice][paired], 95
                    ),
                    "maximum": (
                        float(np.max(flightline_difference[row_slice][paired]))
                        if np.any(paired)
                        else None
                    ),
                },
                "repeatableTopmostSurfaceAtProviderCoordinate": repeatable,
                "candidateMedianTopmostSurfaceElevationFeet": candidate_elevation,
                "candidateTopmostSurfaceElevationP05Feet": (
                    percentile(agreeing_elevations, 5) if repeatable else None
                ),
                "candidateTopmostSurfaceElevationP95Feet": (
                    percentile(agreeing_elevations, 95) if repeatable else None
                ),
                "seatingProfileRun": None,
                "seatingProfileCandidate": False,
                "measuredRowElevationFeet": None,
                "geometryBoundary": {
                    "directlyMeasuresRepeatableTopmostSurface": repeatable,
                    "directlyMeasuresSeatingRowElevation": False,
                },
            }
        )

    row_by_section: dict[str, list[int]] = {}
    for index, row in enumerate(rows):
        if numeric_row_name(row["rowName"]) is not None:
            row_by_section.setdefault(row["sectionName"], []).append(index)
    profile_run_count = 0
    for section_name, indexes in row_by_section.items():
        ordered = sorted(indexes, key=lambda value: int(rows[value]["rowName"]))
        current: list[int] = []
        runs: list[list[int]] = []
        for index in ordered:
            if not current:
                current = [index]
                continue
            previous = current[-1]
            previous_number = int(rows[previous]["rowName"])
            current_number = int(rows[index]["rowName"])
            previous_elevation = rows[previous][
                "candidateMedianTopmostSurfaceElevationFeet"
            ]
            current_elevation = rows[index][
                "candidateMedianTopmostSurfaceElevationFeet"
            ]
            riser = (
                current_elevation - previous_elevation
                if previous_elevation is not None and current_elevation is not None
                else None
            )
            connected = bool(
                current_number == previous_number + 1
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
            elevations = [
                float(rows[index]["candidateMedianTopmostSurfaceElevationFeet"])
                for index in run
            ]
            risers = np.diff(np.asarray(elevations, dtype=np.float64))
            run_record = {
                "id": f"{section_name}-profile-{profile_run_count:04d}",
                "rowCount": len(run),
                "firstRowName": rows[run[0]]["rowName"],
                "lastRowName": rows[run[-1]]["rowName"],
                "medianRiserFeet": float(np.median(risers)),
                "minimumRiserFeet": float(np.min(risers)),
                "maximumRiserFeet": float(np.max(risers)),
            }
            for index in run:
                rows[index]["seatingProfileRun"] = run_record
                rows[index]["seatingProfileCandidate"] = True

    repeatable_count = sum(
        bool(row["repeatableTopmostSurfaceAtProviderCoordinate"]) for row in rows
    )
    profile_count = sum(bool(row["seatingProfileCandidate"]) for row in rows)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "worldRowsSha256": hashlib.sha256(world_bytes).hexdigest(),
        "lidarManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
        "lidarInputs": lidar_inputs,
        "pointSourceIds": point_source_ids,
        "acceptedClassifications": accepted_classifications,
        "thresholds": {
            "maximumNearestDistanceFeet": arguments.maximum_nearest_distance_feet,
            "maximumFlightlineDisagreementFeet": arguments.maximum_flightline_disagreement_feet,
            "minimumRowAgreementCoverage": arguments.minimum_row_agreement_coverage,
            "minimumRowSamples": arguments.minimum_row_samples,
            "minimumProfileRunRows": arguments.minimum_profile_run_rows,
            "minimumRiserFeet": arguments.minimum_riser_feet,
            "maximumRiserFeet": arguments.maximum_riser_feet,
        },
        "rowResults": rows,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-lidar-flightline-row-surface-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "artifactVersion": stable_version(stable),
        "stadiumId": world["stadiumId"],
        "inputs": {
            "worldRows": {
                "path": str(arguments.world_rows),
                "sha256": stable["worldRowsSha256"],
                "artifactVersion": world["artifactVersion"],
            },
            "lidarManifest": {
                "path": str(arguments.lidar_manifest),
                "sha256": stable["lidarManifestSha256"],
                "artifactVersion": manifest["artifactVersion"],
            },
            "lidarTiles": lidar_inputs,
        },
        "coordinateReference": {
            "providerWorldRowsWkid": int(source_wkid),
            "lidarHorizontalCrs": lidar_crs.to_string(),
            "lidarVerticalReference": "NAVD88 height - Geoid18 as embedded in source tiles",
        },
        "pointSources": {
            str(source_id): {
                "acceptedPointCountInsideAuditExtent": int(
                    lidar_points[source_id].shape[0]
                )
            }
            for source_id in point_source_ids
        },
        "acceptedClassifications": accepted_classifications,
        "thresholds": stable["thresholds"],
        "summary": {
            "rowCount": len(rows),
            "seatCount": int(projected_feet.shape[0]),
            "repeatableTopmostSurfaceRowCount": repeatable_count,
            "repeatableTopmostSurfaceCoveragePercent": repeatable_count / len(rows) * 100,
            "seatingProfileCandidateRowCount": profile_count,
            "seatingProfileCandidateCoveragePercent": profile_count / len(rows) * 100,
            "seatingProfileRunCount": profile_run_count,
            "measuredRowElevationCount": 0,
            "publicationEligibleRowElevationCount": 0,
        },
        "rows": rows,
        "geometryBoundary": {
            "establishesIndependentFlightlineRepeatabilityAtFixedPlanCoordinates": True,
            "establishesCandidateMonotonicSeatingProfiles": profile_count > 0,
            "establishesLocalRegistrationOfProviderCoordinatesToVisibleRows": False,
            "establishesThatTopmostReturnsAreSeatingSurfaces": False,
            "establishesMeasuredRowElevations": False,
            "establishesSubFootAbsoluteHorizontalAccuracy": False,
            "note": (
                "Flightline agreement proves only that a repeatable topmost surface exists near "
                "the candidate plan coordinate. Roofs, railings, seat backs, field surfaces, and "
                "upper decks remain possible. Monotonic profile candidates require local image "
                "registration and independent semantic validation before they can become row elevations."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "PROVIDER_PLAN_NOT_LOCALLY_REGISTERED_TO_VISIBLE_ROW_SURFACES",
                "TOPMOST_LIDAR_RETURN_NOT_PROVEN_TO_BE_ROW_WALKING_SURFACE",
                "AIRBORNE_LIDAR_CANNOT_MEASURE_OCCLUDED_LOWER_DECK_ROWS",
                "ROW_ELEVATION_UNCERTAINTY_NOT_ESTABLISHED_AT_ONE_FOOT_OR_LESS",
                "ABSOLUTE_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT",
                "SOURCE_PREDATES_CURRENT_2024_ROOFPRINTS",
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

#!/usr/bin/env python3
"""Cast exact grid rays from current row seats through a measured obstruction.

The nominal result uses measured voxel and analytic underside obstructions.
Confirmed shade is more conservative: all orientation-bound rays must hit an
eroded measured obstruction. A miss is labeled only as no measured hit because
the section obstruction scope is incomplete. It is never promoted to confirmed
sun until every relevant obstruction volume has been measured.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.ndimage import distance_transform_edt


ANALYSIS_VERSION = "measured-obstruction-row-shadow-rays-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("obstruction", type=Path)
    parser.add_argument("obstruction_npz", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("orientation", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("underside_patch", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section-id", default="123")
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def seat_number(seat_id: str) -> int:
    try:
        return int(seat_id.rsplit("-", 1)[1])
    except (IndexError, ValueError) as error:
        raise ValueError(f"Could not parse seat number from {seat_id}") from error


def interpolate_row_seats(row: dict[str, Any]) -> list[dict[str, Any]]:
    anchors = sorted(row["anchors"], key=lambda anchor: seat_number(anchor["seatId"]))
    anchor_numbers = np.asarray([seat_number(anchor["seatId"]) for anchor in anchors], dtype=float)
    anchor_positions = np.asarray([anchor["position"] for anchor in anchors], dtype=float)
    expected_count = int(row["publishedSeatCount"])
    if anchor_numbers[0] != 1 or anchor_numbers[-1] != expected_count:
        raise ValueError(f"Row {row['rowKey']} does not have end-seat anchors")
    numbers = np.arange(1, expected_count + 1, dtype=float)
    positions = np.column_stack([
        np.interp(numbers, anchor_numbers, anchor_positions[:, axis])
        for axis in range(3)
    ])
    return [
        {
            "seatId": f"S_{row['sectionId']}-{row['rowId']}-{int(number)}",
            "providerLocalEyePointMetres": position,
            "directAnchor": bool(number in set(anchor_numbers.tolist())),
        }
        for number, position in zip(numbers, positions)
    ]


def sun_direction_provider(
    altitude_degrees: float,
    azimuth_degrees: float,
    provider_x_bearing_degrees: float,
    provider_z_bearing_degrees: float,
) -> np.ndarray:
    altitude = math.radians(altitude_degrees)
    azimuth = math.radians(azimuth_degrees)
    east = math.cos(altitude) * math.sin(azimuth)
    north = math.cos(altitude) * math.cos(azimuth)
    up = math.sin(altitude)

    def basis(bearing_degrees: float) -> np.ndarray:
        bearing = math.radians(bearing_degrees)
        return np.asarray([math.sin(bearing), math.cos(bearing)], dtype=float)

    horizontal = np.asarray([east, north], dtype=float)
    direction = np.asarray([
        float(horizontal @ basis(provider_x_bearing_degrees)),
        up,
        float(horizontal @ basis(provider_z_bearing_degrees)),
    ])
    direction /= np.linalg.norm(direction)
    return direction


def ray_grid_hit(
    origin: np.ndarray,
    direction: np.ndarray,
    occupancy: np.ndarray,
    grid_minimum: np.ndarray,
    voxel_size: float,
) -> dict[str, Any] | None:
    grid_maximum = grid_minimum + voxel_size * np.asarray(occupancy.shape, dtype=float)
    t_minimum = 0.0
    t_maximum = math.inf
    for axis in range(3):
        if abs(float(direction[axis])) < 1e-12:
            if origin[axis] < grid_minimum[axis] or origin[axis] > grid_maximum[axis]:
                return None
            continue
        first = (grid_minimum[axis] - origin[axis]) / direction[axis]
        second = (grid_maximum[axis] - origin[axis]) / direction[axis]
        if first > second:
            first, second = second, first
        t_minimum = max(t_minimum, float(first))
        t_maximum = min(t_maximum, float(second))
        if t_maximum < t_minimum:
            return None
    if not math.isfinite(t_maximum) or t_maximum < 0:
        return None
    start_t = max(t_minimum, 0.0) + voxel_size * 1e-8
    point = origin + start_t * direction
    index = np.floor((point - grid_minimum) / voxel_size).astype(int)
    index = np.clip(index, 0, np.asarray(occupancy.shape) - 1)
    step = np.sign(direction).astype(int)
    next_boundary = grid_minimum + (
        index + (step > 0).astype(int)
    ) * voxel_size
    with np.errstate(divide="ignore", invalid="ignore"):
        t_next = np.where(
            step != 0,
            (next_boundary - origin) / direction,
            math.inf,
        )
        t_delta = np.where(step != 0, voxel_size / np.abs(direction), math.inf)
    current_t = start_t
    maximum_steps = int(sum(occupancy.shape) + 3)
    for _ in range(maximum_steps):
        if np.any(index < 0) or np.any(index >= np.asarray(occupancy.shape)):
            return None
        if occupancy[tuple(index)]:
            hit_point = origin + current_t * direction
            return {
                "distanceMetres": round(float(current_t), 6),
                "providerLocalHitPointMetres": [round(float(value), 6) for value in hit_point],
                "voxelIndexXyz": [int(value) for value in index],
            }
        axis = int(np.argmin(t_next))
        current_t = float(t_next[axis])
        if current_t > t_maximum:
            return None
        index[axis] += step[axis]
        t_next[axis] += t_delta[axis]
    raise RuntimeError("Voxel traversal exceeded its deterministic step bound")


def ray_patch_hit(
    origin: np.ndarray,
    direction: np.ndarray,
    plane_normal: np.ndarray,
    plane_offset: float,
    contour_xz: np.ndarray,
    signed_distance_minimum_metres: float,
) -> dict[str, Any] | None:
    denominator = float(plane_normal @ direction)
    if abs(denominator) < 1e-12:
        return None
    distance = -float(plane_normal @ origin + plane_offset) / denominator
    if distance <= 0:
        return None
    point = origin + distance * direction
    signed_plan_distance = float(cv2.pointPolygonTest(
        contour_xz,
        (float(point[0]), float(point[2])),
        True,
    ))
    if signed_plan_distance < signed_distance_minimum_metres:
        return None
    return {
        "distanceMetres": round(distance, 6),
        "providerLocalHitPointMetres": [round(float(value), 6) for value in point],
        "signedDistanceInsideObservedPatchMetres": round(signed_plan_distance, 6),
    }


def main() -> None:
    args = parse_args()
    obstruction = json.loads(args.obstruction.read_text())
    venue = json.loads(args.venue_rows.read_text())
    orientation = json.loads(args.orientation.read_text())
    observations = json.loads(args.observations.read_text())
    underside_patch = json.loads(args.underside_patch.read_text())
    if not obstruction["assessment"].get("closedSectionLocalObstructionMeasurementEligible"):
        raise ValueError("Closed obstruction is not measurement eligible")
    if not orientation["assessment"].get("sectionLocalTrueNorthOrientationMeasurementEligible"):
        raise ValueError("True-north orientation is not measurement eligible")
    if not underside_patch["assessment"].get("analyticUndersidePatchMeasurementEligible"):
        raise ValueError("Analytic underside patch is not measurement eligible")

    arrays = np.load(args.obstruction_npz)
    x_values = np.asarray(arrays["provider_x_metres"], dtype=float)
    y_values = np.asarray(arrays["provider_y_metres"], dtype=float)
    z_values = np.asarray(arrays["provider_z_metres"], dtype=float)
    shape = tuple(int(value) for value in arrays["occupancy_shape"])
    bit_count = int(np.prod(shape))
    occupancy = np.unpackbits(
        arrays["occupancy_packbits_little"],
        count=bit_count,
        bitorder="little",
    ).astype(bool).reshape(shape, order="C")
    voxel_size = float(obstruction["construction"]["voxelSizeMetres"])
    grid_minimum = np.asarray([
        x_values[0] - voxel_size / 2.0,
        y_values[0] - voxel_size / 2.0,
        z_values[0] - voxel_size / 2.0,
    ])
    local_uncertainty = float(
        obstruction["providerLocalAccuracy"]["geometry95Metres"]
    )
    occupied_distance = distance_transform_edt(occupancy) * voxel_size
    empty_distance = distance_transform_edt(~occupancy) * voxel_size
    eroded = occupancy & (occupied_distance > local_uncertainty)
    dilated = occupancy | (empty_distance <= local_uncertainty)
    if not np.any(eroded):
        raise ValueError("Geometry uncertainty erodes the entire obstruction")

    rows = [
        row
        for row in venue["rows"]
        if str(row["sectionId"]) == args.section_id
    ]
    if not rows:
        raise ValueError("Requested section has no current metric rows")
    row_seats = {
        row["rowId"]: interpolate_row_seats(row)
        for row in rows
    }
    x_bearing = float(
        orientation["orientation"]["providerPositiveXTrueBearingDegrees"]
    )
    z_bearing = float(
        orientation["orientation"]["providerPositiveZTrueBearingDegrees"]
    )
    angular_uncertainty = float(
        orientation["crossValidation"]["combinedOrientationP95Degrees"]
    )
    plane_normal = np.asarray(
        underside_patch["plane"]["normalProviderLocal"],
        dtype=float,
    )
    plane_offset = float(underside_patch["plane"]["offsetMetres"])
    patch_contour = np.asarray(
        underside_patch["observedSupportPatch"]["providerLocalXzMetres"],
        dtype=np.float32,
    ).reshape(-1, 1, 2)
    patch_plan_margin = float(
        underside_patch["providerLocalAccuracy"]["conservativePlanErosionMetresForConfirmedShade"]
    )

    results = []
    direct_sun_candidates = [
        candidate
        for candidate in observations["candidates"]
        if float(candidate["solarPositionAtMidpoint"]["altitudeDegrees"]) > 0.0
    ]
    for candidate in direct_sun_candidates:
        altitude = float(candidate["solarPositionAtMidpoint"]["altitudeDegrees"])
        azimuth = float(candidate["solarPositionAtMidpoint"]["azimuthDegrees"])
        directions = [
            sun_direction_provider(
                altitude,
                azimuth + delta,
                x_bearing,
                z_bearing,
            )
            for delta in (-angular_uncertainty, 0.0, angular_uncertainty)
        ]
        row_results = []
        for row in rows:
            seat_results = []
            for seat in row_seats[row["rowId"]]:
                origin = np.asarray(seat["providerLocalEyePointMetres"], dtype=float)
                nominal_hit = ray_grid_hit(
                    origin,
                    directions[1],
                    occupancy,
                    grid_minimum,
                    voxel_size,
                )
                nominal_patch_hit = ray_patch_hit(
                    origin,
                    directions[1],
                    plane_normal,
                    plane_offset,
                    patch_contour,
                    0.0,
                )
                eroded_hits = [
                    ray_grid_hit(origin, direction, eroded, grid_minimum, voxel_size)
                    for direction in directions
                ]
                dilated_hits = [
                    ray_grid_hit(origin, direction, dilated, grid_minimum, voxel_size)
                    for direction in directions
                ]
                eroded_patch_hits = [
                    ray_patch_hit(
                        origin,
                        direction,
                        plane_normal,
                        plane_offset,
                        patch_contour,
                        patch_plan_margin,
                    )
                    for direction in directions
                ]
                expanded_patch_hits = [
                    ray_patch_hit(
                        origin,
                        direction,
                        plane_normal,
                        plane_offset,
                        patch_contour,
                        -patch_plan_margin,
                    )
                    for direction in directions
                ]
                confirmed_shade = all(
                    voxel_hit is not None or patch_hit is not None
                    for voxel_hit, patch_hit in zip(eroded_hits, eroded_patch_hits)
                )
                no_measured_hit = all(
                    voxel_hit is None and patch_hit is None
                    for voxel_hit, patch_hit in zip(dilated_hits, expanded_patch_hits)
                )
                if confirmed_shade and no_measured_hit:
                    raise AssertionError("A seat cannot have both a confirmed obstruction and no measured hit")
                classification = (
                    "confirmed-shade"
                    if confirmed_shade
                    else "no-measured-hit"
                    if no_measured_hit
                    else "uncertain-boundary"
                )
                nominal_candidates = [
                    ("closed-voxel-volume", nominal_hit),
                    ("analytic-underside-patch", nominal_patch_hit),
                ]
                nominal_candidates = [
                    (source, hit)
                    for source, hit in nominal_candidates
                    if hit is not None
                ]
                nominal_obstruction_hit = None
                if nominal_candidates:
                    source, hit = min(
                        nominal_candidates,
                        key=lambda item: item[1]["distanceMetres"],
                    )
                    nominal_obstruction_hit = {"source": source, **hit}
                seat_results.append({
                    "seatId": seat["seatId"],
                    "providerLocalEyePointMetres": [
                        round(float(value), 6)
                        for value in seat["providerLocalEyePointMetres"]
                    ],
                    "directAnchor": seat["directAnchor"],
                    "classification": classification,
                    "nominalObstructionHit": nominal_obstruction_hit,
                })
            counts = {
                classification: sum(
                    seat["classification"] == classification
                    for seat in seat_results
                )
                for classification in (
                    "confirmed-shade",
                    "no-measured-hit",
                    "uncertain-boundary",
                )
            }
            row_classification = (
                "confirmed-shade"
                if counts["confirmed-shade"] == len(seat_results)
                else "no-measured-hit"
                if counts["no-measured-hit"] == len(seat_results)
                else "mixed-or-uncertain"
            )
            row_results.append({
                "rowId": row["rowId"],
                "publishedSeatCount": row["publishedSeatCount"],
                "classification": row_classification,
                "seatCounts": counts,
                "seats": seat_results,
            })
        results.append({
            "candidateId": candidate["candidateId"],
            "gamePk": candidate["gamePk"],
            "midpointTime": candidate["event"]["midpointTime"],
            "stadiumLocalDate": candidate["event"]["stadiumLocalDate"],
            "solarPosition": {
                "altitudeDegrees": altitude,
                "azimuthDegrees": azimuth,
            },
            "providerSunDirectionNominal": [round(float(value), 9) for value in directions[1]],
            "rows": row_results,
        })

    classification_counts = {
        classification: sum(
            row["classification"] == classification
            for result in results
            for row in result["rows"]
        )
        for classification in (
            "confirmed-shade",
            "no-measured-hit",
            "mixed-or-uncertain",
        )
    }
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "section-local-measured-obstruction-row-shadow-candidates",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "obstruction": {"path": str(args.obstruction), "sha256": file_sha256(args.obstruction), "artifactVersion": obstruction["artifactVersion"]},
            "obstructionVoxels": {"path": str(args.obstruction_npz), "sha256": file_sha256(args.obstruction_npz)},
            "venueRows": {"path": str(args.venue_rows), "sha256": file_sha256(args.venue_rows), "artifactVersion": venue["artifactVersion"]},
            "orientation": {"path": str(args.orientation), "sha256": file_sha256(args.orientation), "artifactVersion": orientation["artifactVersion"]},
            "observations": {"path": str(args.observations), "sha256": file_sha256(args.observations), "artifactVersion": observations.get("artifactVersion")},
            "undersidePatch": {"path": str(args.underside_patch), "sha256": file_sha256(args.underside_patch), "artifactVersion": underside_patch["artifactVersion"]},
        },
        "parameters": {
            "sectionId": args.section_id,
            "voxelSizeMetres": voxel_size,
            "providerLocalGeometryUncertainty95Metres": local_uncertainty,
            "orientationUncertainty95Degrees": angular_uncertainty,
            "seatInterpolation": "piecewise linear through current exact first, middle, and last seat camera anchors",
            "confirmedShadeRule": "all three orientation-bound rays hit an eroded measured obstruction",
            "noMeasuredHitRule": "all three orientation-bound rays miss the expanded measured obstructions; this is not a confirmed-sun classification",
            "analyticPatchPlanMarginMetres": patch_plan_margin,
        },
        "uncertaintyVolumes": {
            "nominalOccupiedVoxelCount": int(np.count_nonzero(occupancy)),
            "erodedOccupiedVoxelCount": int(np.count_nonzero(eroded)),
            "dilatedOccupiedVoxelCount": int(np.count_nonzero(dilated)),
        },
        "summary": {
            "directSunCandidateCount": len(results),
            "distinctDates": sorted({result["stadiumLocalDate"] for result in results}),
            "solarAltitudeDegrees": values_summary(np.asarray([
                result["solarPosition"]["altitudeDegrees"] for result in results
            ])),
            "solarAzimuthDegrees": values_summary(np.asarray([
                result["solarPosition"]["azimuthDegrees"] for result in results
            ])),
            "rowCandidateClassificationCounts": classification_counts,
        },
        "results": results,
        "assessment": {
            "sectionLocalMeasuredRayCalculationEligible": True,
            "publicationEligible": False,
            "blockers": [
                "RESULTS_HAVE_NOT_PASSED_INDEPENDENT_SHADOW_OBSERVATION_HOLDOUT",
                "SECTION_123_SCOPE_OUTSIDE_FORWARD_VOLUME_NOT_COMPLETE",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
            ],
        },
    }
    stable = dict(artifact)
    stable.pop("artifactVersion")
    artifact["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "directSunCandidates": len(results),
        "rowCandidateClassificationCounts": classification_counts,
        "nominalOccupiedVoxels": int(np.count_nonzero(occupancy)),
        "erodedOccupiedVoxels": int(np.count_nonzero(eroded)),
        "dilatedOccupiedVoxels": int(np.count_nonzero(dilated)),
        "calculationEligible": True,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

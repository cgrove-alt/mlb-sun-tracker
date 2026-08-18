#!/usr/bin/env python3
"""Prove row shade inside a measured planar roof's continuous uncertainty envelope.

A ray miss is never interpreted as sun because the input footprint is a
conservative roof interior, not a complete inventory of all obstructions.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from pyproj import CRS, Proj
from scipy.ndimage import distance_transform_edt

from castTopSurfaceRowShadows import ring_seat_samples


ONE_FOOT_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def angular_difference(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def dot_gradient_direction(a_value: float, b_value: float, azimuth_degrees: float) -> float:
    angle = math.radians(azimuth_degrees)
    return a_value * math.sin(angle) + b_value * math.cos(angle)


def dot_range(
    a_value: float,
    b_value: float,
    centre_azimuth: float,
    bound_degrees: float,
) -> tuple[float, float]:
    candidates = [centre_azimuth - bound_degrees, centre_azimuth + bound_degrees]
    phase = math.degrees(math.atan2(a_value, b_value))
    for critical in (phase, phase + 180.0):
        if abs(angular_difference(critical, centre_azimuth)) <= bound_degrees + 1e-12:
            candidates.append(critical)
    values = [dot_gradient_direction(a_value, b_value, value) for value in candidates]
    return min(values), max(values)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("primitive_json", type=Path)
    parser.add_argument("primitive_npz", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("orientation", type=Path)
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--maximum-event-window-seconds", type=float, default=30.0)
    parser.add_argument("--maximum-horizontal95-metres", type=float, default=ONE_FOOT_METRES)
    parser.add_argument("--maximum-vertical95-metres", type=float, default=ONE_FOOT_METRES)
    parser.add_argument("--maximum-orientation95-degrees", type=float, default=1.0)
    parser.add_argument("--minimum-eye-height-metres", type=float, default=0.80)
    parser.add_argument("--maximum-eye-height-metres", type=float, default=1.70)
    parser.add_argument("--minimum-observed-row", type=int, default=6)
    parser.add_argument("--maximum-observed-row", type=int, default=19)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    paths = {
        "rows": args.rows,
        "rasterMetadata": args.raster_metadata,
        "primitiveJson": args.primitive_json,
        "primitiveNpz": args.primitive_npz,
        "observations": args.observations,
        "solarWindows": args.solar_windows,
        "verticalDatum": args.vertical_datum,
        "orientation": args.orientation,
        "reviewQueue": args.review_queue,
    }
    hashes = {name: sha256_file(path) for name, path in paths.items()}
    rows_artifact = json.loads(args.rows.read_text())
    raster = json.loads(args.raster_metadata.read_text())
    primitive = json.loads(args.primitive_json.read_text())
    observations = json.loads(args.observations.read_text())
    solar_windows = json.loads(args.solar_windows.read_text())
    datum = json.loads(args.vertical_datum.read_text())
    orientation = json.loads(args.orientation.read_text())
    review = json.loads(args.review_queue.read_text())
    if primitive["footprint"]["npzSha256"] != hashes["primitiveNpz"]:
        raise ValueError("Primitive NPZ checksum mismatch")
    if not primitive["assessment"].get("metricGeometryEligible"):
        raise ValueError("Roof primitive is not metric-geometry eligible")
    if not primitive["assessment"].get("orthophotoSemanticEligible"):
        raise ValueError("Roof primitive is not orthophoto-semantic eligible")
    if solar_windows["inputs"]["candidateSha256"] != hashes["observations"]:
        raise ValueError("Solar-window artifact does not bind the observation artifact")
    with np.load(args.primitive_npz, allow_pickle=False) as arrays:
        mask = arrays["mask"].astype(bool)
        coefficients = arrays["plane_coefficients"].astype(np.float64)
        minimum_x = float(arrays["minimum_x_metres"][0])
        minimum_y = float(arrays["minimum_y_metres"][0])
        cell_metres = float(arrays["cell_metres"][0])
    distance_inside = distance_transform_edt(mask) * cell_metres

    queue = review["manualReviewQueue"]
    if any(not item.get("acceptedForManualReview") for item in queue):
        raise ValueError("Every selected review item must be manually accepted")
    selected_ids = [item["candidateId"] for item in queue]
    if len(selected_ids) != len(set(selected_ids)):
        raise ValueError("Review candidate IDs must be unique")
    candidate_by_id = {item["candidateId"]: item for item in observations["candidates"]}
    window_by_id = {item["candidateId"]: item for item in solar_windows["candidates"]}
    if any(value not in candidate_by_id or value not in window_by_id for value in selected_ids):
        raise ValueError("A review candidate is missing from a bound input")

    sections = set(args.section)
    rows = [row for row in rows_artifact["rows"] if row["sectionId"] in sections]
    if not rows:
        raise ValueError("No rows matched the selected sections")
    horizontal_residuals = [
        math.hypot(
            float(row["horizontalGeometry"]["centroidMetres"][0])
            - float(row["lidarMeasurement"]["horizontalCentroidMetres"][0]),
            float(row["horizontalGeometry"]["centroidMetres"][1])
            - float(row["lidarMeasurement"]["horizontalCentroidMetres"][1]),
        )
        for row in rows
    ]
    row_horizontal95 = float(np.percentile(np.asarray(horizontal_residuals), 95))
    roof_horizontal95 = float(primitive["footprint"]["reportedSourceHorizontalAccuracy95Metres"])
    relative_horizontal95 = math.hypot(row_horizontal95, roof_horizontal95)
    datum_vertical95 = float(
        datum["verticalDatum"]["holdoutAbsoluteOffsetDifferenceMetres"]["p95"]
    )
    roof_vertical95 = float(primitive["plane"]["combinedVerticalEnvelopeMetres"])
    relative_vertical95 = math.hypot(datum_vertical95, roof_vertical95)
    orientation95 = float(orientation["crossValidation"]["combinedOrientationP95Degrees"])
    if relative_horizontal95 > args.maximum_horizontal95_metres:
        raise ValueError("Relative horizontal 95 percent error exceeds one foot")
    if relative_vertical95 > args.maximum_vertical95_metres:
        raise ValueError("Relative vertical 95 percent error exceeds one foot")
    if orientation95 > args.maximum_orientation95_degrees:
        raise ValueError("Orientation 95 percent error exceeds one degree")

    grid = raster["grid"]
    compound_crs = CRS.from_wkt(raster["source"]["coordinateReferenceSystem"])
    horizontal_crs = compound_crs.sub_crs_list[0]
    convergence = float(
        Proj(horizontal_crs).get_factors(
            float(grid["centerLongitude"]), float(grid["centerLatitude"])
        ).meridian_convergence
    )
    datum_offset = float(datum["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"])
    a_value, b_value, c_value = [float(value) for value in coefficients]
    gradient_norm = math.hypot(a_value, b_value)
    cell_half_diagonal = cell_metres / math.sqrt(2.0)

    def intersect(origin: list[float], window: dict[str, Any]) -> dict[str, Any]:
        solar_samples = [
            window["solarPositionAtStart"],
            window["solarPositionAtMidpoint"],
            window["solarPositionAtEnd"],
        ]
        centre_true_azimuth = float(solar_samples[1]["azimuthDegrees"])
        centre_grid_azimuth = (centre_true_azimuth - convergence) % 360.0
        time_azimuth_bound = max(
            abs(angular_difference(float(value["azimuthDegrees"]), centre_true_azimuth))
            for value in solar_samples
        )
        total_azimuth_bound = time_azimuth_bound + orientation95
        altitudes = [float(value["altitudeDegrees"]) for value in solar_samples]
        minimum_altitude = min(altitudes)
        maximum_altitude = max(altitudes)
        centre_altitude = float(solar_samples[1]["altitudeDegrees"])

        centre_dot = dot_gradient_direction(a_value, b_value, centre_grid_azimuth)
        centre_numerator = a_value * origin[0] + b_value * origin[1] + c_value - origin[2]
        centre_denominator = math.tan(math.radians(centre_altitude)) - centre_dot
        if centre_numerator <= 0.0 or centre_denominator <= 0.0:
            return {"classification": "unresolved-no-forward-plane-crossing"}
        centre_distance = centre_numerator / centre_denominator
        azimuth_radians = math.radians(centre_grid_azimuth)
        intersection_x = origin[0] + centre_distance * math.sin(azimuth_radians)
        intersection_y = origin[1] + centre_distance * math.cos(azimuth_radians)

        numerator_radius = gradient_norm * relative_horizontal95 + relative_vertical95
        numerator_minimum = centre_numerator - numerator_radius
        numerator_maximum = centre_numerator + numerator_radius
        dot_minimum, dot_maximum = dot_range(
            a_value, b_value, centre_grid_azimuth, total_azimuth_bound
        )
        denominator_minimum = math.tan(math.radians(minimum_altitude)) - dot_maximum
        denominator_maximum = math.tan(math.radians(maximum_altitude)) - dot_minimum
        if numerator_minimum <= 0.0 or denominator_minimum <= 0.0:
            return {"classification": "unresolved-interval-crosses-no-forward-plane"}
        distance_minimum = numerator_minimum / denominator_maximum
        distance_maximum = numerator_maximum / denominator_minimum
        distance_variation = max(
            abs(distance_minimum - centre_distance),
            abs(distance_maximum - centre_distance),
        )
        direction_variation = distance_maximum * 2.0 * math.sin(
            math.radians(total_azimuth_bound) / 2.0
        )
        intersection_radius = relative_horizontal95 + distance_variation + direction_variation

        column = int(math.floor((intersection_x - minimum_x) / cell_metres))
        row_index = int(math.floor((intersection_y - minimum_y) / cell_metres))
        if not (0 <= row_index < mask.shape[0] and 0 <= column < mask.shape[1]):
            clearance = 0.0
        elif not mask[row_index, column]:
            clearance = 0.0
        else:
            clearance = max(0.0, float(distance_inside[row_index, column]) - cell_half_diagonal)
        confirmed = clearance >= intersection_radius
        return {
            "classification": (
                "confirmed-shade-by-measured-roof-interior"
                if confirmed
                else "unresolved-roof-boundary-or-miss"
            ),
            "midpointTrueAzimuthDegrees": round(centre_true_azimuth, 6),
            "midpointGridAzimuthDegrees": round(centre_grid_azimuth, 6),
            "eventTimeAzimuthBoundDegrees": round(time_azimuth_bound, 6),
            "totalAzimuthBoundDegrees": round(total_azimuth_bound, 6),
            "centreIntersection": {
                "distanceMetres": round(centre_distance, 6),
                "eastingMetres": round(intersection_x, 6),
                "northingMetres": round(intersection_y, 6),
            },
            "continuousIntersectionEnvelope": {
                "distanceMinimumMetres": round(distance_minimum, 6),
                "distanceMaximumMetres": round(distance_maximum, 6),
                "horizontalRadiusMetres": round(intersection_radius, 6),
                "measuredInteriorClearanceMetres": round(clearance, 6),
            },
        }

    results: list[dict[str, Any]] = []
    eye_heights: list[float] = []
    for reviewed in queue:
        candidate_id = reviewed["candidateId"]
        candidate = candidate_by_id[candidate_id]
        window = window_by_id[candidate_id]
        if float(window["eventWindowSeconds"]) > args.maximum_event_window_seconds:
            raise ValueError(f"Selected event exceeds 30 second gate: {candidate_id}")
        row_results = []
        for row in rows:
            vertical = row.get("verticalGeometry")
            if not vertical or not vertical.get("publicationEligible"):
                raise ValueError(f"Row has no eligible measured surface: {row['rowKey']}")
            eye_elevation = float(row["venueLocalPosition"][1]) + datum_offset
            surface_elevation = float(vertical["elevationMetresNavd88"])
            eye_height = eye_elevation - surface_elevation
            if not args.minimum_eye_height_metres <= eye_height <= args.maximum_eye_height_metres:
                raise ValueError(f"Implausible seated eye height for {row['rowKey']}: {eye_height}")
            eye_heights.append(eye_height)
            positions = ring_seat_samples(
                row["horizontalGeometry"]["rings"], int(row["publishedSeatCount"])
            )
            seats = []
            for seat_index, position in enumerate(positions, start=1):
                origin = [float(position[0]), float(position[1]), eye_elevation]
                seats.append({
                    "seatSampleIndex": seat_index,
                    "originEastingNorthingEyeElevationMetres": [round(value, 6) for value in origin],
                    **intersect(origin, window),
                })
            confirmed_count = sum(
                item["classification"] == "confirmed-shade-by-measured-roof-interior"
                for item in seats
            )
            row_results.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "originSemantic": "provider seated-view camera eye point",
                "eyeHeightAboveMeasuredRowSurfaceMetres": round(eye_height, 6),
                "seatSampleCount": len(seats),
                "confirmedShadeSeatCount": confirmed_count,
                "classification": (
                    "confirmed-shade-by-measured-roof-interior"
                    if confirmed_count == len(seats)
                    else "unresolved"
                ),
                "seats": seats,
            })
        visible_rows = [
            row for row in row_results
            if row["rowId"].isdigit()
            and args.minimum_observed_row <= int(row["rowId"]) <= args.maximum_observed_row
        ]
        observed = reviewed["manualDecision"]["rowBankState"]
        if observed == "shade":
            comparison = (
                "agree"
                if all(
                    row["classification"] == "confirmed-shade-by-measured-roof-interior"
                    for row in visible_rows
                )
                else "indeterminate"
            )
        elif observed == "sun":
            comparison = (
                "contradiction"
                if any(
                    row["classification"] == "confirmed-shade-by-measured-roof-interior"
                    for row in visible_rows
                )
                else "compatible-but-sun-not-proven"
            )
        else:
            comparison = "indeterminate"
        results.append({
            "candidateId": candidate_id,
            "midpointTime": candidate["event"]["midpointTime"],
            "eventWindowSeconds": float(window["eventWindowSeconds"]),
            "manualObservedRowBankState": observed,
            "manualVisibleRowScope": reviewed["manualDecision"]["visibleRowScope"],
            "visibleRowComparison": comparison,
            "rows": row_results,
        })

    row_classes = [row["classification"] for result in results for row in result["rows"]]
    comparisons = [result["visibleRowComparison"] for result in results]
    stable = {
        "inputs": hashes,
        "sections": sorted(sections),
        "uncertainty": {
            "rowHorizontalResidualP95Metres": row_horizontal95,
            "roofHorizontal95Metres": roof_horizontal95,
            "combinedRelativeHorizontal95Metres": relative_horizontal95,
            "datumVerticalP95Metres": datum_vertical95,
            "roofVerticalEnvelopeMetres": roof_vertical95,
            "combinedRelativeVertical95Metres": relative_vertical95,
            "orientation95Degrees": orientation95,
            "meridianConvergenceDegrees": convergence,
        },
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "measured-planar-roof-continuous-uncertainty-shade-proof-v1",
        "artifactStage": "measured-planar-roof-row-shade-proof-diagnostic",
        "artifactVersion": fingerprint(stable),
        "inputs": {
            name: {"path": str(path), "sha256": hashes[name]}
            for name, path in paths.items()
        },
        "sections": stable["sections"],
        "uncertainty": stable["uncertainty"],
        "originValidation": {
            "semantic": "provider seated-view camera eye point, not concrete row surface",
            "minimumEyeHeightAboveMeasuredSurfaceMetres": round(min(eye_heights), 6),
            "maximumEyeHeightAboveMeasuredSurfaceMetres": round(max(eye_heights), 6),
            "passed": True,
        },
        "results": results,
        "summary": {
            "candidateCount": len(results),
            "rowClassificationCounts": {
                value: row_classes.count(value) for value in sorted(set(row_classes))
            },
            "visibleRowComparisonCounts": {
                value: comparisons.count(value) for value in sorted(set(comparisons))
            },
        },
        "assessment": {
            "measurementEligibleShadeProofDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "CURRENT_2026_ROOF_IDENTITY_NOT_YET_CRYPTOGRAPHICALLY_LINKED",
                "CONSERVATIVE_INTERIOR_MISS_CANNOT_PROVE_SUN",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_ROW_BOUNDARY_HOLDOUT_NOT_YET_SCORED",
            ],
            "interpretation": (
                "A confirmed result proves the complete continuous 95 percent ray-intersection "
                "envelope lies inside the measured, eroded roof interior. A miss is unresolved."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "uncertainty": artifact["uncertainty"],
        "originValidation": artifact["originValidation"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

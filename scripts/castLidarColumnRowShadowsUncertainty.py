#!/usr/bin/env python3
"""Cast conservative LiDAR column shadows over a continuous uncertainty envelope.

The result is diagnostic. A DSM records top elevations, not opaque solids. This
script therefore proves outcomes only inside an explicit opaque-column model
and keeps the semantic obstruction and independent observation gates closed.
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
from scipy.ndimage import maximum_filter, minimum_filter

from castTopSurfaceRowShadows import ring_seat_samples


ONE_FOOT_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def angular_difference(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def eligible_runs(mask: np.ndarray, minimum_samples: int) -> list[tuple[int, int]]:
    padded = np.concatenate(([False], mask, [False]))
    transitions = np.flatnonzero(padded[1:] != padded[:-1])
    return [
        (int(start), int(end))
        for start, end in zip(transitions[0::2], transitions[1::2])
        if int(end - start) >= minimum_samples
    ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("orientation", type=Path)
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--minimum-plan-run-metres", type=float, default=0.60)
    parser.add_argument("--maximum-distance-metres", type=float, default=300.0)
    parser.add_argument("--step-metres", type=float, default=0.10)
    parser.add_argument("--minimum-distance-metres", type=float, default=1.0)
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
    if args.step_metres <= 0 or args.maximum_distance_metres <= 0:
        raise ValueError("Ray distance parameters must be positive")
    if args.minimum_plan_run_metres < args.step_metres:
        raise ValueError("Minimum plan run must be at least one ray step")
    if args.minimum_eye_height_metres <= 0:
        raise ValueError("Minimum eye height must be positive")
    if args.maximum_eye_height_metres <= args.minimum_eye_height_metres:
        raise ValueError("Maximum eye height must exceed minimum eye height")

    input_paths = {
        "rows": args.rows,
        "rasterMetadata": args.raster_metadata,
        "dsm": args.dsm_npy,
        "observations": args.observations,
        "solarWindows": args.solar_windows,
        "verticalDatum": args.vertical_datum,
        "orientation": args.orientation,
        "reviewQueue": args.review_queue,
    }
    input_hashes = {name: sha256_file(path) for name, path in input_paths.items()}
    rows_artifact = json.loads(args.rows.read_text())
    raster = json.loads(args.raster_metadata.read_text())
    observations = json.loads(args.observations.read_text())
    solar_windows = json.loads(args.solar_windows.read_text())
    datum = json.loads(args.vertical_datum.read_text())
    orientation = json.loads(args.orientation.read_text())
    review = json.loads(args.review_queue.read_text())
    dsm = np.load(args.dsm_npy, allow_pickle=False)

    grid = raster["grid"]
    if list(dsm.shape) != [grid["rows"], grid["columns"]]:
        raise ValueError("DSM shape differs from raster metadata")
    expected_dsm_hash = raster["rasterOutputs"]["dsmMaximumZMetres"]["sha256"]
    if input_hashes["dsm"] != expected_dsm_hash:
        raise ValueError("DSM checksum differs from raster metadata")
    if solar_windows["inputs"]["candidateSha256"] != input_hashes["observations"]:
        raise ValueError("Solar-window artifact does not bind the observation artifact")

    queue = review["manualReviewQueue"]
    if any(not item.get("acceptedForManualReview") for item in queue):
        raise ValueError("Every selected review item must be manually accepted")
    selected_ids = [item["candidateId"] for item in queue]
    if len(selected_ids) != len(set(selected_ids)):
        raise ValueError("Review queue candidate IDs must be unique")
    candidates_by_id = {item["candidateId"]: item for item in observations["candidates"]}
    windows_by_id = {item["candidateId"]: item for item in solar_windows["candidates"]}
    if any(candidate_id not in candidates_by_id for candidate_id in selected_ids):
        raise ValueError("Review queue contains an unknown observation candidate")
    if any(candidate_id not in windows_by_id for candidate_id in selected_ids):
        raise ValueError("Review queue contains a candidate without a solar window")

    horizontal95 = float(datum["combinedAccuracy"]["horizontal95Metres"])
    vertical95 = float(datum["combinedAccuracy"]["vertical95Metres"])
    orientation95 = float(orientation["crossValidation"]["combinedOrientationP95Degrees"])
    if horizontal95 > args.maximum_horizontal95_metres:
        raise ValueError("Horizontal 95 percent error exceeds the publication gate")
    if vertical95 > args.maximum_vertical95_metres:
        raise ValueError("Vertical 95 percent error exceeds the publication gate")
    if orientation95 > args.maximum_orientation95_degrees:
        raise ValueError("Orientation 95 percent error exceeds the publication gate")
    if not orientation["assessment"].get(
        "sectionLocalTrueNorthOrientationMeasurementEligible"
    ):
        raise ValueError("Orientation artifact is not measurement eligible")

    selected_sections = set(args.section)
    rows = [row for row in rows_artifact["rows"] if row["sectionId"] in selected_sections]
    if not rows:
        raise ValueError("No rows matched the requested sections")
    datum_offset = float(datum["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"])

    compound_crs = CRS.from_wkt(raster["source"]["coordinateReferenceSystem"])
    horizontal_crs = compound_crs.sub_crs_list[0]
    convergence = float(
        Proj(horizontal_crs).get_factors(
            float(grid["centerLongitude"]), float(grid["centerLatitude"])
        ).meridian_convergence
    )
    true_north_grid_bearing = -convergence

    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    cell_metres = float(grid["cellMetres"])
    row_count, column_count = dsm.shape
    distances = np.arange(
        max(args.step_metres, args.minimum_distance_metres),
        args.maximum_distance_metres + args.step_metres,
        args.step_metres,
        dtype=np.float64,
    )
    required_run_samples = math.ceil(args.minimum_plan_run_metres / args.step_metres - 1e-12)

    finite = np.isfinite(dsm)
    minimum_input = np.where(finite, dsm, np.inf)
    maximum_input = np.where(finite, dsm, -np.inf)
    surface_cache: dict[int, tuple[np.ndarray, np.ndarray, np.ndarray]] = {}

    def surface_envelope(radius_cells: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        cached = surface_cache.get(radius_cells)
        if cached is not None:
            return cached
        size = radius_cells * 2 + 1
        minimum_top = minimum_filter(minimum_input, size=size, mode="constant", cval=np.inf)
        maximum_top = maximum_filter(maximum_input, size=size, mode="constant", cval=-np.inf)
        complete = minimum_filter(
            finite.astype(np.uint8), size=size, mode="constant", cval=0
        ).astype(bool)
        surface_cache[radius_cells] = (minimum_top, maximum_top, complete)
        return surface_cache[radius_cells]

    def run_record(
        run: tuple[int, int],
        lower_margin: np.ndarray,
        upper_margin: np.ndarray,
    ) -> dict[str, Any]:
        start, end = run
        return {
            "entryDistanceMetres": round(float(distances[start]), 3),
            "exitDistanceMetres": round(float(distances[end - 1]), 3),
            "planRunMetres": round(float((end - start) * args.step_metres), 3),
            "minimumLowerMarginMetres": round(float(np.min(lower_margin[start:end])), 6),
            "maximumUpperMarginMetres": round(float(np.max(upper_margin[start:end])), 6),
        }

    def cast(origin: list[float], window: dict[str, Any]) -> dict[str, Any]:
        solar_samples = [
            window["solarPositionAtStart"],
            window["solarPositionAtMidpoint"],
            window["solarPositionAtEnd"],
        ]
        midpoint_true_azimuth = float(solar_samples[1]["azimuthDegrees"])
        time_azimuth_bound = max(
            abs(angular_difference(float(sample["azimuthDegrees"]), midpoint_true_azimuth))
            for sample in solar_samples
        )
        total_azimuth_bound = time_azimuth_bound + orientation95
        midpoint_grid_azimuth = (midpoint_true_azimuth - convergence) % 360.0
        azimuth = math.radians(midpoint_grid_azimuth)
        east = origin[0] + distances * math.sin(azimuth)
        north = origin[1] + distances * math.cos(azimuth)
        raster_rows = np.floor((north - minimum_y) / cell_metres).astype(np.int32)
        raster_columns = np.floor((east - minimum_x) / cell_metres).astype(np.int32)

        footprint_radius = horizontal95 + distances * math.sin(math.radians(total_azimuth_bound))
        radius_cells = np.ceil(footprint_radius / cell_metres).astype(np.int32) + 1
        minimum_top = np.full(distances.shape, np.nan, dtype=np.float64)
        maximum_top = np.full(distances.shape, np.nan, dtype=np.float64)
        complete = np.zeros(distances.shape, dtype=bool)
        for radius in np.unique(radius_cells):
            mask = radius_cells == radius
            inside = (
                mask
                & (raster_rows >= 0)
                & (raster_rows < row_count)
                & (raster_columns >= 0)
                & (raster_columns < column_count)
            )
            if not np.any(inside):
                continue
            low_surface, high_surface, coverage = surface_envelope(int(radius))
            rr = raster_rows[inside]
            cc = raster_columns[inside]
            minimum_top[inside] = low_surface[rr, cc]
            maximum_top[inside] = high_surface[rr, cc]
            complete[inside] = coverage[rr, cc]

        altitudes = [float(sample["altitudeDegrees"]) for sample in solar_samples]
        ray_lower = origin[2] - vertical95 + distances * math.tan(math.radians(min(altitudes)))
        ray_upper = origin[2] + vertical95 + distances * math.tan(math.radians(max(altitudes)))
        lower_margin = minimum_top - ray_upper
        upper_margin = maximum_top - ray_lower
        guaranteed_block = complete & np.isfinite(lower_margin) & (lower_margin >= 0.0)
        possible_block = (~complete) | (~np.isfinite(upper_margin)) | (upper_margin >= 0.0)
        guaranteed_runs = eligible_runs(guaranteed_block, required_run_samples)
        possible_runs = eligible_runs(possible_block, required_run_samples)

        if guaranteed_runs:
            classification = "confirmed-shade-in-column-model"
        elif possible_runs:
            classification = "uncertain-in-column-model"
        else:
            classification = "confirmed-sun-in-column-model"
        return {
            "classification": classification,
            "midpointTrueAzimuthDegrees": round(midpoint_true_azimuth, 6),
            "midpointGridAzimuthDegrees": round(midpoint_grid_azimuth, 6),
            "eventTimeAzimuthBoundDegrees": round(time_azimuth_bound, 6),
            "totalAzimuthBoundDegrees": round(total_azimuth_bound, 6),
            "maximumHorizontalFootprintRadiusMetres": round(float(np.max(footprint_radius)), 6),
            "completeRasterEnvelopePercent": round(float(np.mean(complete) * 100.0), 3),
            "firstGuaranteedBlockRun": (
                None
                if not guaranteed_runs
                else run_record(guaranteed_runs[0], lower_margin, upper_margin)
            ),
            "firstPossibleBlockRun": (
                None
                if not possible_runs
                else run_record(possible_runs[0], lower_margin, upper_margin)
            ),
        }

    results: list[dict[str, Any]] = []
    eye_heights: list[float] = []
    for selected in queue:
        candidate_id = selected["candidateId"]
        candidate = candidates_by_id[candidate_id]
        window = windows_by_id[candidate_id]
        event_window_seconds = float(window["eventWindowSeconds"])
        if event_window_seconds > args.maximum_event_window_seconds:
            raise ValueError(f"Selected event exceeds 30 second gate: {candidate_id}")
        row_results: list[dict[str, Any]] = []
        for row in rows:
            vertical = row.get("verticalGeometry")
            if not vertical or not vertical.get("publicationEligible"):
                raise ValueError(f"Row has no eligible measured surface: {row['rowKey']}")
            eye_elevation = float(row["venueLocalPosition"][1]) + datum_offset
            surface_elevation = float(vertical["elevationMetresNavd88"])
            eye_height = eye_elevation - surface_elevation
            if not args.minimum_eye_height_metres <= eye_height <= args.maximum_eye_height_metres:
                raise ValueError(
                    f"Provider origin is not a plausible seated eye point for {row['rowKey']}: {eye_height}"
                )
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
                    **cast(origin, window),
                })
            classifications = [seat["classification"] for seat in seats]
            if all(value == "confirmed-shade-in-column-model" for value in classifications):
                row_classification = "confirmed-shade-in-column-model"
            elif all(value == "confirmed-sun-in-column-model" for value in classifications):
                row_classification = "confirmed-sun-in-column-model"
            else:
                row_classification = "uncertain-in-column-model"
            row_results.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "originSemantic": "provider seated-view camera eye point",
                "measuredRowSurfaceElevationMetresNavd88": round(surface_elevation, 6),
                "eyeElevationMetresNavd88": round(eye_elevation, 6),
                "eyeHeightAboveMeasuredRowSurfaceMetres": round(eye_height, 6),
                "seatSampleCount": len(seats),
                "classification": row_classification,
                "seatClassificationCounts": {
                    value: classifications.count(value) for value in sorted(set(classifications))
                },
                "seats": seats,
            })

        expected = selected["manualDecision"]["rowBankState"]
        visible_rows = [
            row for row in row_results
            if row["rowId"].isdigit()
            and args.minimum_observed_row <= int(row["rowId"]) <= args.maximum_observed_row
        ]
        expected_classification = {
            "shade": "confirmed-shade-in-column-model",
            "sun": "confirmed-sun-in-column-model",
        }.get(expected)
        agreement = (
            "indeterminate"
            if expected_classification is None
            or any(row["classification"] == "uncertain-in-column-model" for row in visible_rows)
            else "agree"
            if all(row["classification"] == expected_classification for row in visible_rows)
            else "disagree"
        )
        results.append({
            "candidateId": candidate_id,
            "midpointTime": candidate["event"]["midpointTime"],
            "eventWindowSeconds": event_window_seconds,
            "manualObservedRowBankState": expected,
            "manualVisibleRowScope": selected["manualDecision"]["visibleRowScope"],
            "visibleRowModelAgreement": agreement,
            "rows": row_results,
        })

    row_classifications = [
        row["classification"] for result in results for row in result["rows"]
    ]
    agreements = [result["visibleRowModelAgreement"] for result in results]
    stable = {
        "inputs": input_hashes,
        "sections": sorted(selected_sections),
        "parameters": {
            "horizontal95Metres": horizontal95,
            "vertical95Metres": vertical95,
            "orientation95Degrees": orientation95,
            "meridianConvergenceDegrees": convergence,
            "trueNorthGridBearingDegrees": true_north_grid_bearing,
            "minimumPlanRunMetres": args.minimum_plan_run_metres,
            "maximumDistanceMetres": args.maximum_distance_metres,
            "minimumDistanceMetres": args.minimum_distance_metres,
            "stepMetres": args.step_metres,
            "requiredRunSamples": required_run_samples,
            "horizontalEnvelopeRule": "square superset of position plus continuous azimuth interval at every distance",
            "verticalEnvelopeRule": "highest ray proves shade and lowest ray tests possible shade",
        },
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "lidar-opaque-column-continuous-uncertainty-envelope-v1",
        "artifactStage": "measured-dsm-column-row-shadow-uncertainty-diagnostic",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            name: {"path": str(input_paths[name]), "sha256": input_hashes[name]}
            for name in input_paths
        },
        "sections": stable["sections"],
        "parameters": stable["parameters"],
        "originValidation": {
            "semantic": "provider seated-view camera eye point, not concrete row surface",
            "minimumEyeHeightAboveMeasuredSurfaceMetres": round(min(eye_heights), 6),
            "maximumEyeHeightAboveMeasuredSurfaceMetres": round(max(eye_heights), 6),
            "plausibilityRangeMetres": [args.minimum_eye_height_metres, args.maximum_eye_height_metres],
            "passed": True,
        },
        "results": results,
        "summary": {
            "candidateCount": len(results),
            "rowClassificationCounts": {
                value: row_classifications.count(value) for value in sorted(set(row_classifications))
            },
            "visibleRowAgreementCounts": {
                value: agreements.count(value) for value in sorted(set(agreements))
            },
        },
        "assessment": {
            "measurementEligibleDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "DSM_TOPS_NOT_YET_CLASSIFIED_AS_CURRENT_OPAQUE_SOLID_COLUMNS",
                "ORIENTATION_EVIDENCE_SCOPE_IS_SECTION_LOCAL",
                "RASTER_DOES_NOT_PROVE_FULL_STADIUM_OBSTRUCTION_SCOPE",
                "INDEPENDENT_ROW_BOUNDARY_HOLDOUT_NOT_YET_SCORED",
            ],
            "interpretation": (
                "Confirmed means confirmed only inside the conservative opaque-column model. "
                "Uncertain means the continuous 95 percent geometry and event-time envelope "
                "cannot prove either shade or sun. No result is publishable from this artifact."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "parameters": artifact["parameters"],
        "originValidation": artifact["originValidation"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

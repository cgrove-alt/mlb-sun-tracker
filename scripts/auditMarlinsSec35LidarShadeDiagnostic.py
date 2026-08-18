#!/usr/bin/env python3
"""Retrospectively compare Marlins Section 35 shade labels with 2018 LiDAR.

This is deliberately a diagnostic, not a shadow holdout. The reviewed shade
boundaries were discovered before this model was locked. Two physical models
are reported separately:

* an opaque-column model that can over-predict shade below a DSM top; and
* a measured top-surface crossing model that can miss vertical edges and
  occluded undersides.

No parameter is fitted to the shade-boundary labels.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any

import numpy as np
from pyproj import CRS, Proj, Transformer

from castTopSurfaceRowShadows import build_surface_support


US_SURVEY_FOOT_METRES = 1200.0 / 3937.0
SEAT_NUMBER = re.compile(r"-(\d+)$")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def percentile(values: list[float], probability: float) -> float | None:
    if not values:
        return None
    return float(np.percentile(np.asarray(values, dtype=np.float64), probability))


def seat_fraction(seat_id: str, published_count: int) -> float:
    match = SEAT_NUMBER.search(seat_id)
    if match is None:
        raise ValueError(f"Seat ID has no numeric suffix: {seat_id}")
    number = int(match.group(1))
    if not 1 <= number <= published_count:
        raise ValueError(f"Seat number is outside its published row: {seat_id}")
    return 0.5 if published_count == 1 else (number - 1) / (published_count - 1)


def interpolate_components(fractions: np.ndarray, values: np.ndarray, target: float) -> np.ndarray:
    if fractions.ndim != 1 or values.shape[0] != fractions.size:
        raise ValueError("Interpolation arrays differ in length")
    order = np.argsort(fractions)
    sorted_fractions = fractions[order]
    sorted_values = values[order]
    if np.any(np.diff(sorted_fractions) <= 0):
        raise ValueError("Seat fractions must be strictly increasing")
    return np.asarray(
        [np.interp(target, sorted_fractions, sorted_values[:, index]) for index in range(values.shape[1])],
        dtype=np.float64,
    )


def infer_section_fraction(
    sample: dict[str, Any],
    registration_rows: dict[str, dict[str, Any]],
    world_rows: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    observed_x = float(sample["observedBoundaryPixel"][0])
    estimates: list[dict[str, Any]] = []
    for row_id in (sample["frontBracketRowId"], sample["backBracketRowId"]):
        registration = registration_rows[row_id]
        world = world_rows[row_id]
        projected = registration["projectedAnchorPixels"]
        seat_ids = registration["anchorSeatIds"]
        if len(projected) != len(seat_ids):
            raise ValueError(f"Projected anchor count differs for SEC35:{row_id}")
        fractions = np.asarray(
            [seat_fraction(seat_id, int(world["publishedSeatCount"])) for seat_id in seat_ids],
            dtype=np.float64,
        )
        x_values = np.asarray([float(point[0]) for point in projected], dtype=np.float64)
        order = np.argsort(x_values)
        sorted_x = x_values[order]
        sorted_fractions = fractions[order]
        monotonic = bool(
            np.all(np.diff(sorted_fractions) > 0) or np.all(np.diff(sorted_fractions) < 0)
        )
        within = bool(sorted_x[0] - 1e-9 <= observed_x <= sorted_x[-1] + 1e-9)
        if monotonic and within:
            estimate = float(np.interp(observed_x, sorted_x, sorted_fractions))
            estimates.append(
                {
                    "rowId": row_id,
                    "sectionFraction": estimate,
                    "projectedXRangePixels": [float(sorted_x[0]), float(sorted_x[-1])],
                }
            )
    if not estimates:
        return {
            "eligible": False,
            "observedXPixel": observed_x,
            "estimates": [],
            "reason": "OBSERVED_X_OUTSIDE_BOTH_BRACKET_ROW_ANCHOR_RANGES",
        }
    values = [item["sectionFraction"] for item in estimates]
    return {
        "eligible": True,
        "observedXPixel": observed_x,
        "sectionFraction": float(np.median(values)),
        "bracketEstimateSpread": max(values) - min(values),
        "estimates": estimates,
        "method": "inverse linear interpolation of checksum-bound projected seat anchors",
    }


def shade_suffix_boundary(coordinates: np.ndarray, shaded: np.ndarray) -> float | None:
    """Return the onset of the final all-shaded suffix in row-coordinate units."""
    if coordinates.ndim != 1 or shaded.ndim != 1 or coordinates.size != shaded.size:
        raise ValueError("Shade coordinates and labels must be equal-length vectors")
    if coordinates.size == 0:
        raise ValueError("Shade coordinates cannot be empty")
    if np.any(np.diff(coordinates) <= 0):
        raise ValueError("Shade coordinates must be strictly increasing")
    if not bool(shaded[-1]):
        return None
    false_indices = np.flatnonzero(~shaded)
    if false_indices.size == 0:
        return float(coordinates[0])
    first_shaded = int(false_indices[-1] + 1)
    if first_shaded >= shaded.size:
        return None
    return float((coordinates[first_shaded - 1] + coordinates[first_shaded]) / 2.0)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    controls_bytes = args.controls.read_bytes()
    controls = json.loads(controls_bytes)
    expected_version = controls.get("artifactVersion")
    version_payload = {key: value for key, value in controls.items() if key != "artifactVersion"}
    if expected_version != artifact_version(version_payload):
        raise ValueError("Control artifactVersion does not match its stable contents")
    if controls.get("artifactKind") != "marlins-sec35-lidar-shade-diagnostic-controls":
        raise ValueError("Unexpected diagnostic control kind")
    if controls.get("parameterSelection", {}).get("fitParametersFromShadeLabels") is not False:
        raise ValueError("Controls must explicitly prohibit fitting to shade labels")

    base = Path.cwd()
    paths = {
        name: (base / value).resolve()
        for name, value in controls["inputs"].items()
        if name != "observations"
    }
    observations = []
    for item in controls["inputs"]["observations"]:
        resolved = {
            key: (base / value).resolve()
            for key, value in item.items()
            if key != "id"
        }
        observations.append({"id": item["id"], **resolved})

    input_hashes = {name: sha256_file(path) for name, path in paths.items()}
    observation_hashes = [
        {
            "id": item["id"],
            **{key: sha256_file(path) for key, path in item.items() if key != "id"},
        }
        for item in observations
    ]
    world_artifact = json.loads(paths["worldRows"].read_text())
    raster_artifact = json.loads(paths["rasterMetadata"].read_text())
    row_surface_audit = json.loads(paths["rowSurfaceAudit"].read_text())
    two_epoch_audit = json.loads(paths["twoEpochRowSurfaceAudit"].read_text())
    survey_review = json.loads(paths["surveyReportReview"].read_text())
    dsm = np.load(paths["dsm"], allow_pickle=False)

    expected_dsm = raster_artifact["rasterOutputs"]["dsmMaximumZMetres"]["sha256"]
    if input_hashes["dsm"] != expected_dsm:
        raise ValueError("DSM hash differs from raster metadata")
    grid = raster_artifact["grid"]
    if list(dsm.shape) != [int(grid["rows"]), int(grid["columns"])]:
        raise ValueError("DSM shape differs from raster metadata")
    camera_offset_feet = float(
        two_epoch_audit["lockedTrainingParameters"]["cameraToReferenceSurfaceOffsetFeet"]
    )
    requested_offset = float(controls["parameters"]["cameraToReferenceSurfaceOffsetFeet"])
    if not math.isclose(camera_offset_feet, requested_offset, abs_tol=1e-12):
        raise ValueError("Locked camera-to-surface offset differs from the source audit")
    vertical95_feet = float(
        survey_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    horizontal95_feet = float(
        survey_review["conservativeInterpretation"]["horizontalAccuracy95Feet"]
    )
    vertical95_metres = vertical95_feet * US_SURVEY_FOOT_METRES
    horizontal95_metres = horizontal95_feet * US_SURVEY_FOOT_METRES
    if not math.isclose(
        vertical95_metres,
        float(controls["parameters"]["verticalClearanceMetres"]),
        abs_tol=1e-9,
    ):
        raise ValueError("Vertical clearance is not locked to source vertical accuracy")

    section_id = controls["sectionId"]
    row_order = controls["rowOrder"]
    all_world_rows = [row for row in world_artifact["rows"] if row["sectionId"] == section_id]
    world_rows = {row["rowId"]: row for row in all_world_rows}
    if any(row_id not in world_rows for row_id in row_order):
        raise ValueError("A locked Section 35 row is absent from the world-row artifact")
    row_surface_rows = {
        row["rowId"]: row
        for row in row_surface_audit["rows"]
        if row["sectionId"] == section_id
    }

    raster_crs = CRS.from_wkt(raster_artifact["source"]["coordinateReferenceSystem"])
    horizontal_crs = raster_crs.sub_crs_list[0] if raster_crs.is_compound else raster_crs
    state_plane = CRS.from_epsg(6438)
    state_plane_to_raster = Transformer.from_crs(state_plane, horizontal_crs, always_xy=True)
    convergence = float(
        Proj(horizontal_crs).get_factors(
            float(grid["centerLongitude"]), float(grid["centerLatitude"])
        ).meridian_convergence
    )

    parameters = controls["parameters"]
    cell_metres = float(grid["cellMetres"])
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    row_count, column_count = dsm.shape
    maximum_distance = float(parameters["maximumDistanceMetres"])
    minimum_distance = float(parameters["minimumDistanceMetres"])
    ray_step = float(parameters["rayStepMetres"])
    distances = np.arange(
        minimum_distance,
        maximum_distance + ray_step * 0.5,
        ray_step,
        dtype=np.float64,
    )
    required_run_samples = math.ceil(
        float(parameters["minimumPlanRunMetres"]) / ray_step - 1e-12
    )
    surface_support, surface_labels, support_summary = build_surface_support(
        dsm,
        cell_metres,
        float(parameters["topSurfaceMaximumLocalReliefMetres"]),
        float(parameters["topSurfaceMinimumComponentAreaSquareMetres"]),
        float(parameters["topSurfaceErosionMetres"]),
        "robust-median",
        float(parameters["topSurfaceMaximumLocalMadMetres"]),
        int(parameters["topSurfaceMinimumFiniteNeighbors"]),
    )

    def row_position(row_id: str, fraction: float) -> dict[str, Any]:
        row = world_rows[row_id]
        anchors = row["anchors"]
        fractions = np.asarray(
            [seat_fraction(anchor["seatId"], int(row["publishedSeatCount"])) for anchor in anchors],
            dtype=np.float64,
        )
        horizontal_feet = np.asarray(
            [anchor["projectedCoordinateUsSurveyFeet"] for anchor in anchors],
            dtype=np.float64,
        )
        camera_elevation_feet = np.asarray(
            [[float(anchor["candidateCameraElevationNavd88Feet"])] for anchor in anchors],
            dtype=np.float64,
        )
        state_xy = interpolate_components(fractions, horizontal_feet, fraction)
        camera_z_feet = float(interpolate_components(fractions, camera_elevation_feet, fraction)[0])
        x_value, y_value = state_plane_to_raster.transform(float(state_xy[0]), float(state_xy[1]))
        maximum_horizontal_uncertainty = max(
            float(anchor["candidateHorizontalUncertainty95Feet"]) for anchor in anchors
        )
        return {
            "position": np.asarray(
                [
                    x_value,
                    y_value,
                    (camera_z_feet - camera_offset_feet) * US_SURVEY_FOOT_METRES,
                ],
                dtype=np.float64,
            ),
            "cameraElevationNavd88Feet": camera_z_feet,
            "surfaceElevationNavd88Feet": camera_z_feet - camera_offset_feet,
            "candidateHorizontalUncertainty95Feet": maximum_horizontal_uncertainty,
            "rowSurfaceSemanticAccepted": bool(
                row_surface_rows.get(row_id, {})
                .get("geometryBoundary", {})
                .get("establishesMeasuredRowElevation", False)
            ),
        }

    def grid_samples(origin: np.ndarray, true_azimuth: float, altitude: float) -> tuple[np.ndarray, ...]:
        grid_azimuth = (true_azimuth - convergence) % 360.0
        angle = math.radians(grid_azimuth)
        east = origin[0] + distances * math.sin(angle)
        north = origin[1] + distances * math.cos(angle)
        ray_z = origin[2] + distances * math.tan(math.radians(altitude))
        raster_rows = np.floor((north - minimum_y) / cell_metres).astype(np.int32)
        raster_columns = np.floor((east - minimum_x) / cell_metres).astype(np.int32)
        inside = (
            (raster_rows >= 0)
            & (raster_rows < row_count)
            & (raster_columns >= 0)
            & (raster_columns < column_count)
        )
        return grid_azimuth, east, north, ray_z, raster_rows, raster_columns, inside

    def cast_column(origin: np.ndarray, true_azimuth: float, altitude: float) -> dict[str, Any]:
        grid_azimuth, east, north, ray_z, rr, cc, inside = grid_samples(
            origin, true_azimuth, altitude
        )
        top = np.full(distances.shape, np.nan, dtype=np.float64)
        top[inside] = dsm[rr[inside], cc[inside]]
        margin = top - ray_z
        blocked = np.isfinite(margin) & (
            margin >= float(parameters["verticalClearanceMetres"])
        )
        padded = np.concatenate(([False], blocked, [False]))
        transitions = np.flatnonzero(padded[1:] != padded[:-1])
        for start, end in zip(transitions[0::2], transitions[1::2]):
            if int(end - start) < required_run_samples:
                continue
            index = int(start + np.nanargmax(margin[start:end]))
            return {
                "shaded": True,
                "classification": "opaque-column-hit",
                "gridAzimuthDegrees": grid_azimuth,
                "entryDistanceMetres": float(distances[start]),
                "exitDistanceMetres": float(distances[end - 1]),
                "maximumMarginMetres": float(margin[index]),
                "maximumMarginCoordinate": [
                    float(east[index]),
                    float(north[index]),
                    float(ray_z[index]),
                ],
            }
        return {
            "shaded": False,
            "classification": "no-opaque-column-hit",
            "gridAzimuthDegrees": grid_azimuth,
        }

    def cast_top_surface(origin: np.ndarray, true_azimuth: float, altitude: float) -> dict[str, Any]:
        grid_azimuth, east, north, ray_z, rr, cc, inside = grid_samples(
            origin, true_azimuth, altitude
        )
        valid = np.zeros(distances.shape, dtype=bool)
        valid[inside] = surface_support[rr[inside], cc[inside]]
        labels = np.zeros(distances.shape, dtype=np.int32)
        labels[inside] = surface_labels[rr[inside], cc[inside]]
        top = np.full(distances.shape, np.nan, dtype=np.float64)
        top[inside] = dsm[rr[inside], cc[inside]]
        margin = ray_z - top
        vertical_margin = float(parameters["verticalClearanceMetres"])
        index = 0
        while index < distances.size:
            if not valid[index] or labels[index] == 0:
                index += 1
                continue
            component = int(labels[index])
            end = index + 1
            while end < distances.size and valid[end] and int(labels[end]) == component:
                end += 1
            negative = np.flatnonzero(margin[index:end] <= -vertical_margin)
            if negative.size:
                low = index + int(negative[0])
                positive = np.flatnonzero(margin[low:end] >= vertical_margin)
                if positive.size:
                    high = low + int(positive[0])
                    return {
                        "shaded": True,
                        "classification": "measured-top-surface-crossing",
                        "gridAzimuthDegrees": grid_azimuth,
                        "componentId": component,
                        "negativeBracketDistanceMetres": float(distances[low]),
                        "positiveBracketDistanceMetres": float(distances[high]),
                        "crossingCoordinateMidpoint": [
                            float((east[low] + east[high]) / 2.0),
                            float((north[low] + north[high]) / 2.0),
                            float((ray_z[low] + ray_z[high]) / 2.0),
                        ],
                    }
            index = end
        return {
            "shaded": False,
            "classification": "no-measured-top-surface-crossing",
            "gridAzimuthDegrees": grid_azimuth,
        }

    coordinate_step = float(parameters["rowCoordinateStep"])
    row_coordinates = np.arange(
        0.0,
        len(row_order) - 1 + coordinate_step * 0.5,
        coordinate_step,
        dtype=np.float64,
    )

    def dense_origins(fraction: float) -> tuple[np.ndarray, list[dict[str, Any]]]:
        row_records = [row_position(row_id, fraction) for row_id in row_order]
        row_positions = np.stack([item["position"] for item in row_records])
        origins = np.empty((row_coordinates.size, 3), dtype=np.float64)
        integer_positions = np.arange(len(row_order), dtype=np.float64)
        for axis in range(3):
            origins[:, axis] = np.interp(row_coordinates, integer_positions, row_positions[:, axis])
        return origins, row_records

    diagnostic_results: list[dict[str, Any]] = []
    model_errors = {"opaqueColumn": [], "topSurface": []}
    bracket_widths: list[float] = []
    eligible_label_count = 0
    for observation, hash_record in zip(observations, observation_hashes):
        boundary = json.loads(observation["boundary"].read_text())
        registration = json.loads(observation["registration"].read_text())
        solar_windows = json.loads(observation["solarWindows"].read_text())
        if not boundary["measurementValidation"]["eligibleAsObservedBoundaryMeasurement"]:
            raise ValueError(f"Boundary is not measurement eligible: {observation['id']}")
        if boundary["inputs"]["rowRegistration"]["sha256"] != hash_record["registration"]:
            raise ValueError(f"Boundary does not bind the supplied registration: {observation['id']}")
        if not registration["registrationEligibleForManualShadeReview"]:
            raise ValueError(f"Registration is not manual-review eligible: {observation['id']}")
        registration_rows = {item["rowId"]: item for item in registration["rows"]}
        candidate_id = json.loads(
            Path(boundary["inputs"]["reviewedBoundaryControls"]["path"]).read_text()
        )["officialEventIdentity"]["candidateId"]
        window = next(
            (item for item in solar_windows["candidates"] if item["candidateId"] == candidate_id),
            None,
        )
        if window is None:
            raise ValueError(f"Solar window lacks candidate {candidate_id}")
        solar = window["solarPositionAtMidpoint"]
        sample_results: list[dict[str, Any]] = []
        for sample in boundary["samples"]:
            fraction = infer_section_fraction(sample, registration_rows, world_rows)
            if not fraction["eligible"]:
                sample_results.append(
                    {
                        "sampleId": sample["id"],
                        "sectionFraction": fraction,
                        "diagnosticEligible": False,
                    }
                )
                continue
            eligible_label_count += 1
            origins, row_records = dense_origins(float(fraction["sectionFraction"]))
            column_results = [
                cast_column(origin, float(solar["azimuthDegrees"]), float(solar["altitudeDegrees"]))
                for origin in origins
            ]
            top_results = [
                cast_top_surface(origin, float(solar["azimuthDegrees"]), float(solar["altitudeDegrees"]))
                for origin in origins
            ]
            column_shaded = np.asarray([item["shaded"] for item in column_results], dtype=bool)
            top_shaded = np.asarray([item["shaded"] for item in top_results], dtype=bool)
            column_boundary = shade_suffix_boundary(row_coordinates, column_shaded)
            top_boundary = shade_suffix_boundary(row_coordinates, top_shaded)
            observed_coordinate = float(sample["boundaryRowCoordinateFromFront"])
            label_uncertainty = float(sample["combinedLabelUncertaintyRows"])
            column_error = None if column_boundary is None else abs(column_boundary - observed_coordinate)
            top_error = None if top_boundary is None else abs(top_boundary - observed_coordinate)
            if column_error is not None:
                model_errors["opaqueColumn"].append(column_error)
            if top_error is not None:
                model_errors["topSurface"].append(top_error)
            bracket = None
            if column_boundary is not None and top_boundary is not None:
                lower = min(column_boundary, top_boundary)
                upper = max(column_boundary, top_boundary)
                bracket_widths.append(upper - lower)
                bracket = {
                    "minimumRowCoordinate": lower,
                    "maximumRowCoordinate": upper,
                    "widthRows": upper - lower,
                    "observedWithinBracketAfterLabelUncertainty": bool(
                        lower - label_uncertainty
                        <= observed_coordinate
                        <= upper + label_uncertainty
                    ),
                }
            column_onset_index = (
                None
                if column_boundary is None
                else int(np.argmin(np.abs(row_coordinates - column_boundary)))
            )
            top_onset_index = (
                None
                if top_boundary is None
                else int(np.argmin(np.abs(row_coordinates - top_boundary)))
            )
            sample_results.append(
                {
                    "sampleId": sample["id"],
                    "diagnosticEligible": True,
                    "sectionFraction": fraction,
                    "observedBoundaryRowCoordinateFromFront": observed_coordinate,
                    "combinedObservedLabelUncertaintyRows": label_uncertainty,
                    "predictions": {
                        "opaqueColumn": {
                            "rearShadeSuffixOnsetRowCoordinate": column_boundary,
                            "absoluteErrorRows": column_error,
                            "onsetRay": (
                                None
                                if column_onset_index is None
                                else column_results[column_onset_index]
                            ),
                        },
                        "measuredTopSurface": {
                            "rearShadeSuffixOnsetRowCoordinate": top_boundary,
                            "absoluteErrorRows": top_error,
                            "onsetRay": (
                                None if top_onset_index is None else top_results[top_onset_index]
                            ),
                        },
                        "physicalModelBracket": bracket,
                    },
                    "rowOrigins": [
                        {
                            "rowId": row_id,
                            "surfaceOriginEastingNorthingElevationMetres": [
                                float(value) for value in record["position"]
                            ],
                            "candidateHorizontalUncertainty95Feet": record[
                                "candidateHorizontalUncertainty95Feet"
                            ],
                            "rowSurfaceSemanticAccepted": record[
                                "rowSurfaceSemanticAccepted"
                            ],
                        }
                        for row_id, record in zip(row_order, row_records)
                    ],
                }
            )
        diagnostic_results.append(
            {
                "observationId": observation["id"],
                "candidateId": candidate_id,
                "eventMidpointTime": window["midpointTime"],
                "eventWindowSeconds": float(window["eventWindowSeconds"]),
                "solarPositionAtMidpoint": solar,
                "sampleCount": len(sample_results),
                "diagnosticEligibleSampleCount": sum(
                    bool(item["diagnosticEligible"]) for item in sample_results
                ),
                "samples": sample_results,
            }
        )

    all_row_uncertainties = [
        float(anchor["candidateHorizontalUncertainty95Feet"])
        for row_id in row_order
        for anchor in world_rows[row_id]["anchors"]
    ]
    stable = {
        "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        "inputs": input_hashes,
        "observationInputs": observation_hashes,
        "sectionId": section_id,
        "rowOrder": row_order,
        "coordinateReference": {
            "dsmHorizontalCrs": horizontal_crs.to_wkt(),
            "sourceRowsHorizontalCrs": state_plane.to_wkt(),
            "meridianConvergenceDegrees": convergence,
            "trueToGridAzimuthRule": "grid azimuth = true azimuth - meridian convergence",
        },
        "parameters": parameters,
        "surfaceSupport": support_summary,
        "results": diagnostic_results,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-sec35-retrospective-lidar-shade-diagnostic",
        "analysisVersion": "marlins-sec35-two-bound-lidar-shade-diagnostic-v1",
        "artifactStage": "retrospective-geometry-shadow-diagnostic-not-holdout",
        "artifactVersion": artifact_version(stable),
        "controls": {
            "path": str(args.controls),
            "sha256": stable["controlsSha256"],
            "artifactVersion": controls["artifactVersion"],
        },
        "inputs": {
            name: {"path": str(paths[name]), "sha256": input_hashes[name]}
            for name in paths
        },
        "observationInputs": [
            {
                "id": item["id"],
                **{
                    key: {"path": str(observation[key]), "sha256": item[key]}
                    for key in item
                    if key != "id"
                },
            }
            for item, observation in zip(observation_hashes, observations)
        ],
        "sectionId": section_id,
        "rowOrder": row_order,
        "coordinateReference": stable["coordinateReference"],
        "parameters": parameters,
        "sourceAccuracy": {
            "lidarHorizontal95Feet": horizontal95_feet,
            "lidarHorizontal95Metres": horizontal95_metres,
            "lidarVertical95Feet": vertical95_feet,
            "lidarVertical95Metres": vertical95_metres,
            "worldRowCandidateHorizontal95Feet": {
                "minimum": min(all_row_uncertainties),
                "median": percentile(all_row_uncertainties, 50),
                "p95": percentile(all_row_uncertainties, 95),
                "maximum": max(all_row_uncertainties),
            },
        },
        "surfaceSupport": support_summary,
        "results": diagnostic_results,
        "summary": {
            "observationCount": len(diagnostic_results),
            "uniqueDateCount": len(
                {item["eventMidpointTime"][:10] for item in diagnostic_results}
            ),
            "diagnosticEligibleLabelCount": eligible_label_count,
            "opaqueColumnAbsoluteErrorRows": {
                "count": len(model_errors["opaqueColumn"]),
                "median": percentile(model_errors["opaqueColumn"], 50),
                "p95": percentile(model_errors["opaqueColumn"], 95),
                "maximum": max(model_errors["opaqueColumn"]) if model_errors["opaqueColumn"] else None,
            },
            "topSurfaceAbsoluteErrorRows": {
                "count": len(model_errors["topSurface"]),
                "median": percentile(model_errors["topSurface"], 50),
                "p95": percentile(model_errors["topSurface"], 95),
                "maximum": max(model_errors["topSurface"]) if model_errors["topSurface"] else None,
            },
            "twoModelBracketWidthRows": {
                "count": len(bracket_widths),
                "median": percentile(bracket_widths, 50),
                "p95": percentile(bracket_widths, 95),
                "maximum": max(bracket_widths) if bracket_widths else None,
            },
        },
        "assessment": {
            "retrospectiveDiagnosticEligible": True,
            "independentShadowHoldoutEligible": False,
            "publicationEligible": False,
            "blockers": [
                "SHADE_LABELS_PREDATE_MODEL_LOCK_AND_ARE_DIAGNOSTIC_NOT_HOLDOUT",
                "CURRENT_WORLD_ROW_HORIZONTAL_P95_EXCEEDS_ONE_FOOT",
                "ROW_SURFACE_SEMANTIC_IDENTITY_IS_NOT_ESTABLISHED_FOR_ALL_ROWS",
                "OPAQUE_COLUMN_MODEL_CAN_OVERPREDICT_SHADE_BELOW_TOP_SURFACES",
                "TOP_SURFACE_MODEL_CAN_MISS_VERTICAL_EDGES_AND_OCCLUDED_UNDERSIDES",
                "2018_OPEN_ROOF_GEOMETRY_IS_NOT_A_COMPLETE_CURRENT_2026_OBSTRUCTION_VOLUME",
                "ONLY_SECTION_35_IS_TESTED",
                "THIRTY_INDEPENDENT_HOLDOUT_OBSERVATIONS_NOT_PASSED",
            ],
            "interpretation": (
                "The opaque-column and top-surface results are fixed physical bounds. "
                "Agreement with reviewed labels can diagnose geometry, but cannot be counted "
                "toward the publication holdout because the labels were already known."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(args.output),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "assessment": artifact["assessment"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Cast uncertainty-bounded row rays against one validated planar roof primitive."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from scipy import ndimage

from castTopSurfaceRowShadows import ring_seat_samples


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    serialized = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(serialized).hexdigest()}"


def percentile(values: list[float], probability: float) -> float | None:
    if not values:
        return None
    return float(np.percentile(np.asarray(values, dtype=np.float64), probability))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("primitive_json", type=Path)
    parser.add_argument("primitive_npz", type=Path)
    parser.add_argument("observations", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--additional-primitive-json", action="append", type=Path, default=[])
    parser.add_argument("--additional-primitive-npz", action="append", type=Path, default=[])
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--orientation-uncertainty-95-degrees", type=float, default=0.07)
    parser.add_argument("--relative-lidar-vertical-95-metres", type=float, default=0.10)
    parser.add_argument("--minimum-row-horizontal-uncertainty-95-metres", type=float, default=0.05)
    arguments = parser.parse_args()
    if len(arguments.additional_primitive_json) != len(arguments.additional_primitive_npz):
        raise ValueError("Every additional primitive JSON requires one additional primitive NPZ")

    row_bytes = arguments.rows.read_bytes()
    observation_bytes = arguments.observations.read_bytes()
    datum_bytes = arguments.vertical_datum.read_bytes()
    row_artifact = json.loads(row_bytes)
    observations = json.loads(observation_bytes)
    datum = json.loads(datum_bytes)
    primitive_paths = [arguments.primitive_json, *arguments.additional_primitive_json]
    npz_paths = [arguments.primitive_npz, *arguments.additional_primitive_npz]
    roof_primitives: list[dict[str, Any]] = []
    for primitive_index, (json_path, npz_path) in enumerate(zip(primitive_paths, npz_paths), start=1):
        primitive_bytes = json_path.read_bytes()
        primitive = json.loads(primitive_bytes)
        actual_npz_sha = sha256_file(npz_path)
        if primitive["footprint"]["npzSha256"] != actual_npz_sha:
            raise ValueError(f"Primitive {primitive_index} NPZ checksum mismatch")
        if not primitive["assessment"]["metricGeometryEligible"]:
            raise ValueError(f"Roof primitive {primitive_index} is not metric-geometry eligible")
        with np.load(npz_path, allow_pickle=False) as arrays:
            mask = arrays["mask"].astype(bool)
            coefficients = arrays["plane_coefficients"].astype(np.float64)
            minimum_x = float(arrays["minimum_x_metres"][0])
            minimum_y = float(arrays["minimum_y_metres"][0])
            cell_metres = float(arrays["cell_metres"][0])
        roof_primitives.append({
            "primitiveIndex": primitive_index,
            "jsonPath": json_path,
            "npzPath": npz_path,
            "jsonSha256": hashlib.sha256(primitive_bytes).hexdigest(),
            "npzSha256": actual_npz_sha,
            "artifact": primitive,
            "mask": mask,
            "coefficients": coefficients,
            "minimumXMetres": minimum_x,
            "minimumYMetres": minimum_y,
            "cellMetres": cell_metres,
            "distanceInside": ndimage.distance_transform_edt(mask) * cell_metres,
        })

    selected_sections = set(arguments.section)
    selected_rows = [
        row for row in row_artifact["rows"] if row["sectionId"] in selected_sections
    ]
    if not selected_rows:
        raise ValueError("No selected rows are present")
    horizontal_residuals: list[float] = []
    for row in selected_rows:
        polygon_centroid = row["horizontalGeometry"]["centroidMetres"]
        lidar_centroid = row["lidarMeasurement"]["horizontalCentroidMetres"]
        horizontal_residuals.append(
            math.hypot(
                float(polygon_centroid[0]) - float(lidar_centroid[0]),
                float(polygon_centroid[1]) - float(lidar_centroid[1]),
            )
        )
    row_horizontal_95 = max(
        arguments.minimum_row_horizontal_uncertainty_95_metres,
        float(np.percentile(horizontal_residuals, 95)),
    )
    datum_holdout_95 = float(
        datum["verticalDatum"]["holdoutAbsoluteOffsetDifferenceMetres"]["p95"]
    )
    roof_holdout_95 = max(
        float(item["artifact"]["plane"]["holdoutAbsoluteVerticalResidualMetres"]["p95"])
        for item in roof_primitives
    )
    roof_footprint_surface_maximum = max(
        float(
            item["artifact"]["footprint"]["absoluteDsmToPlaneResidualMetres"][
                "maximum"
            ]
        )
        for item in roof_primitives
    )
    relative_vertical_95 = math.sqrt(
        datum_holdout_95**2
        + roof_holdout_95**2
        + arguments.relative_lidar_vertical_95_metres**2
        + roof_footprint_surface_maximum**2
    )
    datum_offset = float(datum["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"])

    horizontal_directions = [
        (0.0, 0.0),
        *[
            (
                row_horizontal_95 * math.sin(math.radians(angle)),
                row_horizontal_95 * math.cos(math.radians(angle)),
            )
            for angle in range(0, 360, 45)
        ],
    ]
    vertical_offsets = [-relative_vertical_95, 0.0, relative_vertical_95]
    orientation_offsets = [
        -arguments.orientation_uncertainty_95_degrees,
        0.0,
        arguments.orientation_uncertainty_95_degrees,
    ]
    variant_count = (
        len(horizontal_directions) * len(vertical_offsets) * len(orientation_offsets)
    )

    def intersect(
        origin: list[float],
        azimuth_degrees: float,
        altitude_degrees: float,
    ) -> dict[str, Any]:
        azimuth = math.radians(azimuth_degrees % 360.0)
        altitude = math.radians(altitude_degrees)
        east_direction = math.sin(azimuth)
        north_direction = math.cos(azimuth)
        vertical_direction = math.tan(altitude)
        valid_intersections: list[dict[str, Any]] = []
        forward_plane_count = 0
        for primitive in roof_primitives:
            a_value, b_value, c_value = primitive["coefficients"]
            denominator = vertical_direction - a_value * east_direction - b_value * north_direction
            if denominator <= 1e-9:
                continue
            distance = (
                a_value * origin[0] + b_value * origin[1] + c_value - origin[2]
            ) / denominator
            if distance <= 0:
                continue
            forward_plane_count += 1
            easting = origin[0] + distance * east_direction
            northing = origin[1] + distance * north_direction
            elevation = origin[2] + distance * vertical_direction
            cell_metres = primitive["cellMetres"]
            column = int(math.floor((easting - primitive["minimumXMetres"]) / cell_metres))
            row = int(math.floor((northing - primitive["minimumYMetres"]) / cell_metres))
            mask = primitive["mask"]
            inside_grid = 0 <= row < mask.shape[0] and 0 <= column < mask.shape[1]
            if not inside_grid or not mask[row, column]:
                continue
            valid_intersections.append({
                "classification": "planar-roof-intersection",
                "primitiveIndex": primitive["primitiveIndex"],
                "primitiveArtifactVersion": primitive["artifact"]["artifactVersion"],
                "distanceMetres": float(distance),
                "eastingMetres": float(easting),
                "northingMetres": float(northing),
                "elevationMetresNavd88": float(elevation),
                "measuredInteriorClearanceMetres": float(primitive["distanceInside"][row, column]),
            })
        if valid_intersections:
            return min(valid_intersections, key=lambda item: item["distanceMetres"])
        return {
            "classification": (
                "plane-outside-measured-roof-interior"
                if forward_plane_count > 0
                else "no-forward-plane-intersection"
            )
        }

    results: list[dict[str, Any]] = []
    for candidate in observations["candidates"]:
        solar = candidate["solarPositionAtMidpoint"]
        altitude = float(solar["altitudeDegrees"])
        azimuth = float(solar["azimuthDegrees"])
        row_results: list[dict[str, Any]] = []
        for row in selected_rows:
            positions = ring_seat_samples(
                row["horizontalGeometry"]["rings"], int(row["publishedSeatCount"])
            )
            eye_elevation = float(row["venueLocalPosition"][1]) + datum_offset
            seat_results: list[dict[str, Any]] = []
            for seat_index, position in enumerate(positions, start=1):
                centre_origin = [float(position[0]), float(position[1]), eye_elevation]
                centre_intersection = intersect(centre_origin, azimuth, altitude)
                confirmed_variants = 0
                clearances: list[float] = []
                intersection_distances: list[float] = []
                for east_offset, north_offset in horizontal_directions:
                    for vertical_offset in vertical_offsets:
                        origin = [
                            centre_origin[0] + east_offset,
                            centre_origin[1] + north_offset,
                            centre_origin[2] + vertical_offset,
                        ]
                        for orientation_offset in orientation_offsets:
                            result = intersect(
                                origin,
                                azimuth + orientation_offset,
                                altitude,
                            )
                            if result["classification"] == "planar-roof-intersection":
                                confirmed_variants += 1
                                clearances.append(result["measuredInteriorClearanceMetres"])
                                intersection_distances.append(result["distanceMetres"])
                if confirmed_variants == variant_count:
                    classification = "confirmed-shade-by-planar-roof"
                elif centre_intersection["classification"] == "planar-roof-intersection":
                    classification = "uncertainty-boundary"
                else:
                    classification = "no-measured-roof-hit"
                seat_results.append({
                    "seatSampleIndex": seat_index,
                    "originEastingNorthingElevationMetres": centre_origin,
                    "classification": classification,
                    "centreIntersection": centre_intersection,
                    "uncertaintyVariantCount": variant_count,
                    "confirmedVariantCount": confirmed_variants,
                    "confirmedVariantInteriorClearanceMetres": {
                        "minimum": min(clearances) if clearances else None,
                        "median": percentile(clearances, 50),
                    },
                    "confirmedVariantIntersectionDistanceMetres": {
                        "minimum": min(intersection_distances) if intersection_distances else None,
                        "maximum": max(intersection_distances) if intersection_distances else None,
                    },
                })
            confirmed_count = sum(
                seat["classification"] == "confirmed-shade-by-planar-roof"
                for seat in seat_results
            )
            boundary_count = sum(
                seat["classification"] == "uncertainty-boundary" for seat in seat_results
            )
            if confirmed_count == len(seat_results):
                classification = "confirmed-shade"
            elif confirmed_count == 0 and boundary_count == 0:
                classification = "no-measured-roof-hit"
            else:
                classification = "mixed-or-uncertain"
            row_results.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "seatSampleCount": len(seat_results),
                "confirmedShadeCount": confirmed_count,
                "uncertaintyBoundaryCount": boundary_count,
                "classification": classification,
                "seats": seat_results,
            })
        results.append({
            "candidateId": candidate["candidateId"],
            "midpointTime": candidate["event"]["midpointTime"],
            "solarPosition": solar,
            "rows": row_results,
        })

    row_classifications = [
        row["classification"] for result in results for row in result["rows"]
    ]
    stable = {
        "rowsSha256": hashlib.sha256(row_bytes).hexdigest(),
        "primitives": [
            {
                "jsonSha256": item["jsonSha256"],
                "npzSha256": item["npzSha256"],
                "artifactVersion": item["artifact"]["artifactVersion"],
            }
            for item in roof_primitives
        ],
        "observationsSha256": hashlib.sha256(observation_bytes).hexdigest(),
        "verticalDatumSha256": hashlib.sha256(datum_bytes).hexdigest(),
        "sections": sorted(selected_sections),
        "uncertainty": {
            "rowHorizontal95Metres": row_horizontal_95,
            "rowHorizontalResidualP95Metres": float(np.percentile(horizontal_residuals, 95)),
            "datumHoldoutVerticalP95Metres": datum_holdout_95,
            "roofHoldoutVerticalP95Metres": roof_holdout_95,
            "roofFootprintSurfaceMaximumMetres": roof_footprint_surface_maximum,
            "relativeLidarVertical95Metres": arguments.relative_lidar_vertical_95_metres,
            "combinedRelativeVertical95Metres": relative_vertical_95,
            "orientation95Degrees": arguments.orientation_uncertainty_95_degrees,
            "variantCountPerSeat": variant_count,
        },
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "uncertainty-bounded-planar-roof-ray-cast-v2",
        "artifactStage": "measured-planar-roof-row-shadow-candidates",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "rows": {"path": str(arguments.rows), "sha256": stable["rowsSha256"]},
            "primitives": [
                {
                    "primitiveIndex": item["primitiveIndex"],
                    "jsonPath": str(item["jsonPath"]),
                    "jsonSha256": item["jsonSha256"],
                    "npzPath": str(item["npzPath"]),
                    "npzSha256": item["npzSha256"],
                    "artifactVersion": item["artifact"]["artifactVersion"],
                }
                for item in roof_primitives
            ],
            "observations": {"path": str(arguments.observations), "sha256": stable["observationsSha256"]},
            "verticalDatum": {"path": str(arguments.vertical_datum), "sha256": stable["verticalDatumSha256"]},
        },
        "sections": sorted(selected_sections),
        "uncertainty": stable["uncertainty"],
        "results": results,
        "summary": {
            "candidateCount": len(results),
            "rowClassificationCounts": {
                value: row_classifications.count(value)
                for value in sorted(set(row_classifications))
            },
        },
        "assessment": {
            "measurementEligibleDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "ROOF_SEMANTIC_AND_CURRENTNESS_EVIDENCE_NOT_YET_LINKED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
                "FULL_STADIUM_ROOF_PRIMITIVE_SCOPE_NOT_COMPLETE",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
            ],
            "interpretation": "Confirmed shade requires every horizontal, vertical, and orientation uncertainty variant to intersect the conservative measured roof interior. A miss remains unresolved.",
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "uncertainty": artifact["uncertainty"],
        "summary": artifact["summary"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

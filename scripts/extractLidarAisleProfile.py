#!/usr/bin/env python3
"""Extract a measured LiDAR profile through an identity-matched seating aisle.

The aisle center is derived independently for every row from the closest ends
of two adjacent georeferenced row polygons. Raw LiDAR returns are then assigned
to the closest segment of that centerline. This is a diagnostic measurement,
not a semantic claim that any return is a tread, seat, railing, or floor.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import cv2
import laspy
import numpy as np


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def row_number(value: object) -> int | None:
    text = str(value).strip()
    return int(text) if text.isdigit() else None


def polygon_endpoints(rings: list[list[list[float]]]) -> np.ndarray:
    vertices = []
    for raw_ring in rings:
        ring = np.asarray(raw_ring, dtype=np.float64)
        if ring.shape[0] > 1 and np.allclose(ring[0], ring[-1]):
            ring = ring[:-1]
        if ring.shape[0] >= 3:
            vertices.append(ring)
    if not vertices:
        raise ValueError("Row polygon has no valid ring")
    points = np.concatenate(vertices)
    centroid = points.mean(axis=0)
    centered = points - centroid
    covariance = centered.T @ centered
    _, eigenvectors = np.linalg.eigh(covariance)
    major = eigenvectors[:, -1]
    projections = centered @ major
    return np.asarray([
        centroid + projections.min() * major,
        centroid + projections.max() * major,
    ])


def closest_endpoint_pair(first: np.ndarray, second: np.ndarray) -> tuple[np.ndarray, np.ndarray, float]:
    distances = np.linalg.norm(first[:, None, :] - second[None, :, :], axis=2)
    first_index, second_index = np.unravel_index(int(np.argmin(distances)), distances.shape)
    return first[first_index], second[second_index], float(distances[first_index, second_index])


def assign_to_centerline(points: np.ndarray, centers: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    starts = centers[:-1]
    vectors = centers[1:] - starts
    lengths = np.linalg.norm(vectors, axis=1)
    if np.any(lengths <= 0):
        raise ValueError("Aisle centerline contains a zero-length segment")
    length_squared = lengths * lengths
    cumulative = np.concatenate(([0.0], np.cumsum(lengths)))
    best_distance = np.full(points.shape[0], np.inf, dtype=np.float64)
    best_station = np.zeros(points.shape[0], dtype=np.float64)
    for index, (start, vector, squared, length) in enumerate(
        zip(starts, vectors, length_squared, lengths)
    ):
        delta = points - start
        dot = delta[:, 0] * vector[0] + delta[:, 1] * vector[1]
        fraction = np.clip(dot / squared, 0.0, 1.0)
        projected = start + fraction[:, None] * vector
        distance = np.linalg.norm(points - projected, axis=1)
        better = distance < best_distance
        best_distance[better] = distance[better]
        best_station[better] = cumulative[index] + fraction[better] * length
    return best_station, best_distance


def percentile(values: np.ndarray, amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values.size else None


def scale_value(value: float, minimum: float, maximum: float, low: int, high: int) -> int:
    if maximum <= minimum:
        return (low + high) // 2
    fraction = (value - minimum) / (maximum - minimum)
    return int(round(low + fraction * (high - low)))


def draw_diagnostic(
    output: Path,
    points: np.ndarray,
    centers: np.ndarray,
    controls: list[dict],
    bins: list[dict],
    corridor_half_width: float,
) -> None:
    width = 1800
    height = 1200
    image = np.full((height, width, 3), 247, dtype=np.uint8)
    left = 120
    right = width - 70
    top = 90
    bottom = height - 110
    cv2.rectangle(image, (left, top), (right, bottom), (35, 35, 35), 2)

    station_values = points[:, 0]
    elevation_values = points[:, 3]
    minimum_station = 0.0
    maximum_station = float(controls[-1]["stationMetres"])
    finite_elevation = elevation_values[np.isfinite(elevation_values)]
    control_elevation = np.asarray([control["floorElevationMetresNavd88"] for control in controls])
    robust_low = min(float(np.percentile(finite_elevation, 1)), float(control_elevation.min())) - 0.35
    robust_high = max(float(np.percentile(finite_elevation, 99)), float(control_elevation.max())) + 0.35
    if robust_high - robust_low < 2.0:
        robust_high = robust_low + 2.0

    for amount in np.arange(math.floor(robust_low), math.ceil(robust_high) + 1):
        y = scale_value(float(amount), robust_low, robust_high, bottom, top)
        cv2.line(image, (left, y), (right, y), (215, 215, 215), 1)
        cv2.putText(image, f"{amount:.0f} m", (25, y + 6), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (55, 55, 55), 1, cv2.LINE_AA)

    for index in np.linspace(0, maximum_station, 9):
        x = scale_value(float(index), minimum_station, maximum_station, left, right)
        cv2.line(image, (x, top), (x, bottom), (225, 225, 225), 1)
        cv2.putText(image, f"{index:.1f}", (x - 18, bottom + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (55, 55, 55), 1, cv2.LINE_AA)

    visible = (
        np.isfinite(station_values)
        & np.isfinite(elevation_values)
        & (elevation_values >= robust_low)
        & (elevation_values <= robust_high)
    )
    for station, _, distance, elevation, classification, intensity in points[visible]:
        x = scale_value(float(station), minimum_station, maximum_station, left, right)
        y = scale_value(float(elevation), robust_low, robust_high, bottom, top)
        shade = int(np.clip(75 + float(intensity) / 65535.0 * 90, 75, 165))
        color = (shade, shade, shade) if int(classification) == 1 else (170, 115, 55)
        radius = 1 if distance > corridor_half_width * 0.5 else 2
        cv2.circle(image, (x, y), radius, color, -1, cv2.LINE_AA)

    for name, color in (("p10", (185, 80, 200)), ("p25", (35, 145, 215)), ("median", (30, 80, 210))):
        previous = None
        for item in bins:
            value = item.get(name)
            if value is None or value < robust_low or value > robust_high:
                previous = None
                continue
            x = scale_value(float(item["stationMidpointMetres"]), minimum_station, maximum_station, left, right)
            y = scale_value(float(value), robust_low, robust_high, bottom, top)
            if previous is not None:
                cv2.line(image, previous, (x, y), color, 2, cv2.LINE_AA)
            previous = (x, y)

    for control in controls:
        x = scale_value(float(control["stationMetres"]), minimum_station, maximum_station, left, right)
        y = scale_value(float(control["floorElevationMetresNavd88"]), robust_low, robust_high, bottom, top)
        cv2.circle(image, (x, y), 6, (35, 165, 35), -1, cv2.LINE_AA)
        cv2.putText(image, str(control["rowId"]), (x - 8, y - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (10, 95, 10), 1, cv2.LINE_AA)

    cv2.putText(image, "USGS LiDAR returns in identity-matched row-boundary aisle corridor", (left, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (20, 20, 20), 2, cv2.LINE_AA)
    cv2.putText(image, "Gray/orange: raw returns; magenta: p10; orange: p25; red: median; green: row floor controls", (left, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (45, 45, 45), 1, cv2.LINE_AA)
    cv2.putText(image, "Centerline station (metres)", ((left + right) // 2 - 100, height - 35), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (35, 35, 35), 1, cv2.LINE_AA)
    output.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output), image):
        raise RuntimeError(f"Could not write diagnostic image: {output}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("georeferenced_rows", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--section-a", required=True)
    parser.add_argument("--section-b", required=True)
    parser.add_argument("--row-min", type=int, required=True)
    parser.add_argument("--row-max", type=int, required=True)
    parser.add_argument("--corridor-half-width-metres", type=float, default=0.8)
    parser.add_argument("--bin-size-metres", type=float, default=0.10)
    parser.add_argument("--crop-padding-metres", type=float, default=1.5)
    arguments = parser.parse_args()
    if arguments.corridor_half_width_metres <= 0 or arguments.bin_size_metres <= 0:
        raise ValueError("Corridor half width and bin size must be positive")

    rows_artifact = json.loads(arguments.georeferenced_rows.read_text(encoding="utf-8"))
    rows_by_section: dict[str, dict[int, dict]] = {arguments.section_a: {}, arguments.section_b: {}}
    for row in rows_artifact["rows"]:
        section = str(row["sectionId"])
        number = row_number(row["rowId"])
        if section in rows_by_section and number is not None and arguments.row_min <= number <= arguments.row_max:
            rows_by_section[section][number] = row
    expected_numbers = list(range(arguments.row_min, arguments.row_max + 1))
    missing = [
        f"{section}:{number}"
        for section in rows_by_section
        for number in expected_numbers
        if number not in rows_by_section[section]
    ]
    if missing:
        raise ValueError(f"Missing georeferenced row controls: {', '.join(missing)}")

    controls = []
    center_points = []
    for number in expected_numbers:
        first_row = rows_by_section[arguments.section_a][number]
        second_row = rows_by_section[arguments.section_b][number]
        first_endpoints = polygon_endpoints(first_row["horizontalGeometry"]["rings"])
        second_endpoints = polygon_endpoints(second_row["horizontalGeometry"]["rings"])
        first_end, second_end, gap = closest_endpoint_pair(first_endpoints, second_endpoints)
        center = (first_end + second_end) / 2.0
        center_points.append(center)
        first_floor = float(first_row["verticalGeometry"]["elevationMetresNavd88"])
        second_floor = float(second_row["verticalGeometry"]["elevationMetresNavd88"])
        controls.append({
            "rowId": str(number),
            "sectionARowKey": first_row["rowKey"],
            "sectionBRowKey": second_row["rowKey"],
            "sectionAEndpointMetres": [float(value) for value in first_end],
            "sectionBEndpointMetres": [float(value) for value in second_end],
            "aisleCenterMetres": [float(value) for value in center],
            "mappedGapWidthMetres": gap,
            "sectionAFloorElevationMetresNavd88": first_floor,
            "sectionBFloorElevationMetresNavd88": second_floor,
            "floorElevationMetresNavd88": (first_floor + second_floor) / 2.0,
        })
    centers = np.asarray(center_points)
    segment_lengths = np.linalg.norm(np.diff(centers, axis=0), axis=1)
    stations = np.concatenate(([0.0], np.cumsum(segment_lengths)))
    for control, station in zip(controls, stations):
        control["stationMetres"] = float(station)

    minimum = centers.min(axis=0) - arguments.crop_padding_metres
    maximum = centers.max(axis=0) + arguments.crop_padding_metres
    retained = []
    with laspy.open(arguments.lidar) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None:
            raise ValueError("LiDAR source has no embedded CRS")
        for raw in source.chunk_iterator(2_000_000):
            x_values = np.asarray(raw.x)
            y_values = np.asarray(raw.y)
            inside = (
                (x_values >= minimum[0])
                & (x_values <= maximum[0])
                & (y_values >= minimum[1])
                & (y_values <= maximum[1])
                & (np.asarray(raw.classification) != 7)
            )
            if not inside.any():
                continue
            retained.append(np.column_stack((
                x_values[inside],
                y_values[inside],
                np.asarray(raw.z)[inside],
                np.asarray(raw.classification)[inside],
                np.asarray(raw.intensity)[inside],
            )))
    if not retained:
        raise ValueError("LiDAR crop contains no retained returns")
    cropped = np.concatenate(retained)
    assigned_station, distance = assign_to_centerline(cropped[:, :2], centers)
    corridor = distance <= arguments.corridor_half_width_metres
    selected = cropped[corridor]
    selected_station = assigned_station[corridor]
    selected_distance = distance[corridor]
    if selected.shape[0] == 0:
        raise ValueError("LiDAR aisle corridor contains no returns")
    points = np.column_stack((
        selected_station,
        selected[:, 0],
        selected_distance,
        selected[:, 2],
        selected[:, 3],
        selected[:, 4],
    ))

    bin_count = int(math.ceil(stations[-1] / arguments.bin_size_metres))
    bin_index = np.minimum(
        (selected_station / arguments.bin_size_metres).astype(np.int64),
        max(bin_count - 1, 0),
    )
    bins = []
    for index in range(bin_count):
        values = selected[bin_index == index, 2]
        bins.append({
            "stationStartMetres": index * arguments.bin_size_metres,
            "stationEndMetres": min((index + 1) * arguments.bin_size_metres, float(stations[-1])),
            "stationMidpointMetres": min((index + 0.5) * arguments.bin_size_metres, float(stations[-1])),
            "pointCount": int(values.size),
            "minimum": float(values.min()) if values.size else None,
            "p05": percentile(values, 5),
            "p10": percentile(values, 10),
            "p25": percentile(values, 25),
            "median": percentile(values, 50),
            "p75": percentile(values, 75),
            "p90": percentile(values, 90),
            "p95": percentile(values, 95),
            "maximum": float(values.max()) if values.size else None,
        })

    draw_diagnostic(
        arguments.output_png,
        points,
        centers,
        controls,
        bins,
        arguments.corridor_half_width_metres,
    )
    stable_payload = {
        "rowsArtifactVersion": rows_artifact["artifactVersion"],
        "lidarSha256": sha256_file(arguments.lidar),
        "parameters": {
            "sectionA": arguments.section_a,
            "sectionB": arguments.section_b,
            "rowMinimum": arguments.row_min,
            "rowMaximum": arguments.row_max,
            "corridorHalfWidthMetres": arguments.corridor_half_width_metres,
            "binSizeMetres": arguments.bin_size_metres,
        },
        "controls": controls,
        "bins": bins,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "identity-matched-lidar-aisle-profile-diagnostic",
        "artifactVersion": artifact_version,
        "stadiumId": rows_artifact["stadiumId"],
        "sources": {
            "georeferencedRowsPath": str(arguments.georeferenced_rows),
            "georeferencedRowsArtifactVersion": rows_artifact["artifactVersion"],
            "lidarPath": str(arguments.lidar),
            "lidarSha256": stable_payload["lidarSha256"],
            "lidarCoordinateReferenceSystem": source_crs.to_wkt(),
        },
        "method": {
            "aisleCenter": "midpoint-of-closest-PCA-endpoints-of-adjacent-identity-matched-row-polygons",
            "pointAssignment": "nearest-piecewise-linear-aisle-centerline-segment",
            **stable_payload["parameters"],
        },
        "summary": {
            "rowControlCount": len(controls),
            "aisleLengthMetres": float(stations[-1]),
            "mappedGapWidthMedianMetres": float(np.median([item["mappedGapWidthMetres"] for item in controls])),
            "mappedGapWidthMinimumMetres": float(min(item["mappedGapWidthMetres"] for item in controls)),
            "mappedGapWidthMaximumMetres": float(max(item["mappedGapWidthMetres"] for item in controls)),
            "boundingBoxCropReturnCount": int(cropped.shape[0]),
            "corridorReturnCount": int(selected.shape[0]),
            "occupiedBinCount": sum(item["pointCount"] > 0 for item in bins),
            "binCount": len(bins),
        },
        "controls": controls,
        "bins": bins,
        "diagnosticPng": str(arguments.output_png),
        "diagnosticPngSha256": sha256_file(arguments.output_png),
        "publication": {
            "eligible": False,
            "blockers": [
                "RAW_AERIAL_LIDAR_RETURNS_NOT_SEMANTICALLY_CLASSIFIED",
                "AISLE_TREAD_SEQUENCE_NOT_YET_IMAGE_REGISTERED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "outputPng": str(arguments.output_png),
        "artifactVersion": artifact_version,
        "summary": artifact["summary"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

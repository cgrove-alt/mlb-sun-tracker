#!/usr/bin/env python3
"""Measure LiDAR returns inside independent georeferenced seating-row polygons."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

import laspy
import numpy as np
from scipy.spatial import cKDTree


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalized_key(section: object, row: object) -> str:
    return f"{str(section).strip()}:{str(row).strip().upper()}"


def points_in_ring(points: np.ndarray, ring: np.ndarray) -> np.ndarray:
    x_values = points[:, 0]
    y_values = points[:, 1]
    inside = np.zeros(points.shape[0], dtype=bool)
    x_left = ring[-1, 0]
    y_left = ring[-1, 1]
    for x_right, y_right in ring:
        crosses = (y_right > y_values) != (y_left > y_values)
        denominator = y_left - y_right
        denominator = denominator if abs(denominator) > 1e-12 else math.copysign(1e-12, denominator or 1.0)
        crossing_x = (x_left - x_right) * (y_values - y_right) / denominator + x_right
        inside ^= crosses & (x_values < crossing_x)
        x_left = x_right
        y_left = y_right
    return inside


def percentile(values: np.ndarray, amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values.size else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--padding-metres", type=float, default=3.0)
    arguments = parser.parse_args()

    row_control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    venue = json.loads(arguments.venue_rows.read_text(encoding="utf-8"))
    if row_control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Invalid venue-row artifact")

    polygons = []
    all_coordinates = []
    for feature in row_control["features"]:
        attributes = feature["attributes"]
        row_key = normalized_key(attributes.get("section"), attributes.get("row"))
        for raw_ring in feature.get("geometry", {}).get("rings", []):
            ring = np.asarray(raw_ring, dtype=np.float64)
            if ring.shape[0] < 4:
                continue
            if np.allclose(ring[0], ring[-1]):
                ring = ring[:-1]
            polygons.append((row_key, ring))
            all_coordinates.append(ring)
    if not polygons:
        raise ValueError("Row-control artifact contains no polygon rings")
    coordinates = np.concatenate(all_coordinates)
    minimum_x, minimum_y = coordinates.min(axis=0) - arguments.padding_metres
    maximum_x, maximum_y = coordinates.max(axis=0) + arguments.padding_metres

    retained = []
    with laspy.open(arguments.lidar) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None:
            raise ValueError("LiDAR source has no embedded CRS")
        for points in source.chunk_iterator(2_000_000):
            x_values = np.asarray(points.x)
            y_values = np.asarray(points.y)
            classification = np.asarray(points.classification)
            inside = (
                (x_values >= minimum_x)
                & (x_values <= maximum_x)
                & (y_values >= minimum_y)
                & (y_values <= maximum_y)
                & (classification != 7)
            )
            if inside.any():
                retained.append(np.column_stack((
                    x_values[inside],
                    y_values[inside],
                    np.asarray(points.z)[inside],
                    np.asarray(points.intensity)[inside],
                    classification[inside],
                )))
    if not retained:
        raise ValueError("LiDAR crop contains no retained points")
    lidar_points = np.concatenate(retained)
    tree = cKDTree(lidar_points[:, :2])
    row_indices: dict[str, list[np.ndarray]] = defaultdict(list)
    for row_key, ring in polygons:
        center = ring.mean(axis=0)
        radius = float(np.linalg.norm(ring - center, axis=1).max()) + 0.1
        candidates = np.asarray(tree.query_ball_point(center, radius), dtype=np.int64)
        if candidates.size == 0:
            continue
        candidate_points = lidar_points[candidates, :2]
        within_bounds = (
            (candidate_points[:, 0] >= ring[:, 0].min())
            & (candidate_points[:, 0] <= ring[:, 0].max())
            & (candidate_points[:, 1] >= ring[:, 1].min())
            & (candidate_points[:, 1] <= ring[:, 1].max())
        )
        candidates = candidates[within_bounds]
        if candidates.size:
            inside = points_in_ring(lidar_points[candidates, :2], ring)
            if inside.any():
                row_indices[row_key].append(candidates[inside])

    venue_by_key = {}
    for row in venue["rows"]:
        key = normalized_key(row["sectionId"], row["rowId"])
        positions = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=np.float64)
        venue_by_key[key] = {
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "localPosition": np.median(positions, axis=0),
            "publishedSeatCount": row["publishedSeatCount"],
        }

    rows = []
    for row_key in sorted(set(row_indices) & set(venue_by_key)):
        indices = np.unique(np.concatenate(row_indices[row_key]))
        values = lidar_points[indices]
        local = venue_by_key[row_key]
        z_values = values[:, 2]
        intensity_values = values[:, 3]
        rows.append({
            "rowKey": row_key,
            "sectionId": local["sectionId"],
            "rowId": local["rowId"],
            "publishedSeatCount": local["publishedSeatCount"],
            "lidarPointCount": int(indices.size),
            "horizontalCentroidMetres": [
                float(np.median(values[:, 0])),
                float(np.median(values[:, 1])),
            ],
            "lidarElevationMetres": {
                "p10": percentile(z_values, 10),
                "p25": percentile(z_values, 25),
                "median": percentile(z_values, 50),
                "p75": percentile(z_values, 75),
                "p90": percentile(z_values, 90),
            },
            "lidarIntensity": {
                "p10": percentile(intensity_values, 10),
                "median": percentile(intensity_values, 50),
                "p90": percentile(intensity_values, 90),
            },
            "venueLocalPosition": [float(value) for value in local["localPosition"]],
            "candidateVerticalOffsetsMetres": {
                name: float(value - local["localPosition"][1])
                for name, value in {
                    "p10": percentile(z_values, 10),
                    "p25": percentile(z_values, 25),
                    "median": percentile(z_values, 50),
                    "p75": percentile(z_values, 75),
                    "p90": percentile(z_values, 90),
                }.items()
                if value is not None
            },
        })

    point_counts = np.asarray([row["lidarPointCount"] for row in rows], dtype=np.float64)
    median_offsets = np.asarray([
        row["candidateVerticalOffsetsMetres"]["median"] for row in rows
    ], dtype=np.float64)
    stable_payload = {
        "rowControlArtifactVersion": row_control["artifactVersion"],
        "venueArtifactVersion": venue["artifactVersion"],
        "lidarSha256": sha256_file(arguments.lidar),
        "rows": rows,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "row-polygon-lidar-return-analysis",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": row_control["artifactVersion"],
            "venueArtifactVersion": venue["artifactVersion"],
            "lidarPath": str(arguments.lidar),
            "lidarSha256": stable_payload["lidarSha256"],
            "lidarCoordinateReferenceSystem": source_crs.to_wkt(),
        },
        "counts": {
            "rowControlRings": len(polygons),
            "venueRows": len(venue_by_key),
            "matchedRowsWithLidar": len(rows),
            "lidarCropPoints": int(lidar_points.shape[0]),
            "medianPointsPerRow": percentile(point_counts, 50),
            "p10PointsPerRow": percentile(point_counts, 10),
        },
        "diagnostics": {
            "candidateMedianVerticalOffsetMetres": percentile(median_offsets, 50),
            "candidateVerticalOffsetP05Metres": percentile(median_offsets, 5),
            "candidateVerticalOffsetP95Metres": percentile(median_offsets, 95),
            "warning": "Aerial returns can be seats, people, railings, roofs, or deck surfaces. Per-row semantics require classification and holdout validation.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "LIDAR_RETURNS_NOT_YET_SEMANTICALLY_CLASSIFIED",
                "AERIAL_OCCLUSION_NOT_RESOLVED",
                "STALE_ROW_CONTROL_NOT_CURRENT_SEATING_TRUTH",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": rows,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "counts": artifact["counts"],
        "diagnostics": artifact["diagnostics"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

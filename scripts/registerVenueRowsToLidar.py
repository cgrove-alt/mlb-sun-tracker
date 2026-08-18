#!/usr/bin/env python3
"""Register venue-local metric row anchors to a georeferenced LiDAR cloud.

The output is always candidate-only. Nearest-surface agreement is a necessary
registration diagnostic, not proof of semantic row identity or obstruction
completeness.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Iterable

import laspy
import numpy as np
from pyproj import CRS, Transformer
from scipy.optimize import differential_evolution, minimize
from scipy.spatial import cKDTree


METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def iter_row_centres(artifact: dict) -> Iterable[tuple[str, str, np.ndarray]]:
    for row in artifact["rows"]:
        anchors = row["anchors"]
        positions = np.asarray([anchor["position"] for anchor in anchors], dtype=np.float64)
        yield row["rowKey"], row["sectionId"], np.median(positions, axis=0)


def stable_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def transform_rows(rows: np.ndarray, parameters: np.ndarray) -> np.ndarray:
    yaw, east_translation, north_translation, vertical_translation = parameters
    yaw_radians = math.radians(yaw)
    cosine = math.cos(yaw_radians)
    sine = math.sin(yaw_radians)
    local_east = rows[:, 0]
    local_north = rows[:, 2]
    transformed = np.empty_like(rows)
    transformed[:, 0] = (
        cosine * local_east - sine * local_north + east_translation
    )
    transformed[:, 1] = (
        sine * local_east + cosine * local_north + north_translation
    )
    transformed[:, 2] = rows[:, 1] + vertical_translation
    return transformed


def percentile(values: np.ndarray, quantile: float) -> float:
    return float(np.percentile(values, quantile)) if values.size else math.nan


def linear_unit_to_metres(crs: CRS, label: str) -> float:
    if not crs.axis_info:
        raise ValueError(f"{label} CRS does not expose a linear unit")
    factor = float(crs.axis_info[0].unit_conversion_factor or math.nan)
    if not math.isfinite(factor) or factor <= 0:
        raise ValueError(f"{label} CRS has an invalid linear-unit conversion")
    return factor


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("venue_rows")
    parser.add_argument("lidar")
    parser.add_argument("output")
    parser.add_argument("--latitude", type=float, required=True)
    parser.add_argument("--longitude", type=float, required=True)
    parser.add_argument("--expected-center-field-bearing", type=float, required=True)
    parser.add_argument("--crop-radius-metres", type=float, default=230.0)
    parser.add_argument("--voxel-metres", type=float, default=0.45)
    arguments = parser.parse_args()

    venue_path = Path(arguments.venue_rows)
    lidar_input_path = Path(arguments.lidar)
    venue = json.loads(venue_path.read_text(encoding="utf-8"))
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Input is not a venue-local metric row artifact")
    if venue.get("completeness", {}).get("percent") != 100:
        raise ValueError("Venue row artifact is incomplete")
    lidar_manifest = None
    if lidar_input_path.suffix.lower() == ".json":
        lidar_manifest = json.loads(lidar_input_path.read_text(encoding="utf-8"))
        if lidar_manifest.get("artifactKind") not in {
            "usgs-lidar-project-acquisition",
            "lidar-project-acquisition",
        }:
            raise ValueError("LiDAR JSON input is not a supported project acquisition manifest")
        if lidar_manifest.get("stadiumId") != venue.get("stadiumId"):
            raise ValueError("LiDAR acquisition manifest stadium does not match venue rows")
        if lidar_manifest.get("projectCoverage", {}).get("coveragePercent") != 100:
            raise ValueError("LiDAR acquisition manifest does not cover the full audit footprint")
        lidar_paths = [Path(tile["path"]) for tile in lidar_manifest.get("tiles", [])]
        if not lidar_paths:
            raise ValueError("LiDAR acquisition manifest contains no tiles")
        for tile, path in zip(lidar_manifest["tiles"], lidar_paths):
            if not path.is_file():
                raise ValueError(f"LiDAR tile is missing: {path}")
            if sha256_file(path) != tile.get("sha256"):
                raise ValueError(f"LiDAR tile hash mismatch: {path}")
    else:
        lidar_paths = [lidar_input_path]
    row_records = list(iter_row_centres(venue))
    row_keys = [record[0] for record in row_records]
    section_ids = [record[1] for record in row_records]
    rows = np.asarray([record[2] for record in row_records], dtype=np.float64)
    holdout_mask = np.asarray([stable_holdout(section_id) for section_id in section_ids])
    if not holdout_mask.any() or holdout_mask.all():
        raise ValueError("Deterministic section split did not produce control and holdout rows")

    source_crs = None
    horizontal_unit_to_metres = None
    vertical_unit_to_metres = None
    center_x = None
    center_y = None
    retained = []
    ground_samples = []
    for lidar_path in lidar_paths:
        with laspy.open(lidar_path) as source:
            tile_crs = source.header.parse_crs()
            if tile_crs is None:
                raise ValueError(f"LiDAR source has no embedded CRS: {lidar_path}")
            if source_crs is None:
                source_crs = tile_crs
                horizontal_crs = CRS.from_user_input(
                    source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
                )
                horizontal_unit_to_metres = linear_unit_to_metres(
                    horizontal_crs, "Horizontal"
                )
                if source_crs.is_compound and len(source_crs.sub_crs_list) > 1:
                    vertical_crs = CRS.from_user_input(source_crs.sub_crs_list[1])
                    vertical_unit_to_metres = linear_unit_to_metres(
                        vertical_crs, "Vertical"
                    )
                elif len(source_crs.axis_info) >= 3:
                    vertical_unit_to_metres = float(
                        source_crs.axis_info[2].unit_conversion_factor
                    )
                else:
                    vertical_unit_to_metres = horizontal_unit_to_metres
                if not math.isfinite(vertical_unit_to_metres) or vertical_unit_to_metres <= 0:
                    raise ValueError("Vertical CRS has an invalid linear-unit conversion")
                transformer = Transformer.from_crs(
                    CRS.from_epsg(4326), horizontal_crs, always_xy=True
                )
                center_x, center_y = transformer.transform(
                    arguments.longitude, arguments.latitude
                )
                center_x *= horizontal_unit_to_metres
                center_y *= horizontal_unit_to_metres
            elif not tile_crs.equals(source_crs):
                raise ValueError("LiDAR tiles do not share one embedded CRS")
            for points in source.chunk_iterator(2_000_000):
                x_values = np.asarray(points.x) * horizontal_unit_to_metres
                y_values = np.asarray(points.y) * horizontal_unit_to_metres
                z_values = np.asarray(points.z) * vertical_unit_to_metres
                classifications = np.asarray(points.classification)
                inside = (
                    (np.abs(x_values - center_x) <= arguments.crop_radius_metres)
                    & (np.abs(y_values - center_y) <= arguments.crop_radius_metres)
                    & (classifications != 7)
                )
                if not inside.any():
                    continue
                cropped = np.column_stack((x_values[inside], y_values[inside], z_values[inside]))
                retained.append(cropped)
                ground = inside & (classifications == 2)
                if ground.any():
                    ground_samples.append(z_values[ground])
    if not retained:
        raise ValueError("LiDAR crop contains no non-noise points")
    lidar_points = np.concatenate(retained)
    if not ground_samples:
        raise ValueError("LiDAR crop contains no class 2 ground points")
    ground_elevation = float(np.percentile(np.concatenate(ground_samples), 10))
    relative_height = lidar_points[:, 2] - ground_elevation
    radial_distance = np.hypot(lidar_points[:, 0] - center_x, lidar_points[:, 1] - center_y)
    surface_mask = (
        (relative_height >= 0.4)
        & (relative_height <= 42.0)
        & (radial_distance >= 20.0)
        & (radial_distance <= 205.0)
    )
    lidar_surfaces = lidar_points[surface_mask]
    if lidar_surfaces.shape[0] < 100_000:
        raise ValueError("Too few candidate stadium surface returns for registration")
    voxel_origin = np.asarray([center_x, center_y, ground_elevation])
    voxel_ids = np.floor((lidar_surfaces - voxel_origin) / arguments.voxel_metres).astype(np.int32)
    _, unique_indices = np.unique(voxel_ids, axis=0, return_index=True)
    lidar_voxels = lidar_surfaces[np.sort(unique_indices)]
    tree = cKDTree(lidar_voxels)

    control_rows = rows[~holdout_mask]
    if control_rows.shape[0] > 1_500:
        control_indices = np.linspace(0, control_rows.shape[0] - 1, 1_500, dtype=int)
        optimization_rows = control_rows[control_indices]
    else:
        optimization_rows = control_rows

    # Venue-local +Z points from home plate toward center field. A geographic
    # bearing is clockwise from north, while the 2D rotation used here is
    # counterclockwise from easting. The correct yaw is therefore -bearing.
    expected_yaw = -arguments.expected_center_field_bearing

    def objective(parameters: np.ndarray) -> float:
        transformed = transform_rows(optimization_rows, parameters)
        distances, _ = tree.query(transformed, k=1, workers=-1)
        clipped = np.minimum(distances, 4.0)
        return float(np.mean(np.sort(clipped)[: int(clipped.size * 0.9)]))

    bounds = [
        (expected_yaw - 18.0, expected_yaw + 18.0),
        (center_x - 120.0, center_x + 120.0),
        (center_y - 120.0, center_y + 120.0),
        (ground_elevation - 3.0, ground_elevation + 9.0),
    ]
    global_result = differential_evolution(
        objective,
        bounds,
        seed=20260808,
        maxiter=45,
        popsize=10,
        polish=False,
        updating="immediate",
        workers=1,
    )
    local_result = minimize(
        objective,
        global_result.x,
        method="Powell",
        bounds=bounds,
        options={"maxiter": 250, "xtol": 1e-5, "ftol": 1e-6},
    )
    parameters = local_result.x

    all_transformed = transform_rows(rows, parameters)
    all_distances, all_indices = tree.query(all_transformed, k=1, workers=-1)
    control_distances = all_distances[~holdout_mask]
    holdout_distances = all_distances[holdout_mask]
    matched_points = lidar_voxels[all_indices]
    residual_vectors = matched_points - all_transformed

    yaw, east_translation, north_translation, vertical_translation = parameters
    centre_field_bearing = (-yaw) % 360.0
    fingerprint_input = {
        "venueArtifactVersion": venue["artifactVersion"],
        "lidarSources": [
            {"path": str(path), "sha256": sha256_file(path)} for path in lidar_paths
        ],
        "lidarAcquisitionManifestArtifactVersion": (
            lidar_manifest.get("artifactVersion") if lidar_manifest else None
        ),
        "parameters": [float(value) for value in parameters],
        "sourceUnitToMetres": {
            "horizontal": horizontal_unit_to_metres,
            "vertical": vertical_unit_to_metres,
        },
        "rowKeys": row_keys,
        "distances": [round(float(value), 6) for value in all_distances],
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(fingerprint_input, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    threshold_metres = 1.0 / METRES_TO_FEET
    holdout_pass = bool(
        np.median(holdout_distances) <= threshold_metres
        and np.percentile(holdout_distances, 95) <= threshold_metres
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "venue-row-to-lidar-registration-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "venueArtifactVersion": venue["artifactVersion"],
        "lidar": {
            "inputPath": str(lidar_input_path),
            "acquisitionManifestArtifactVersion": (
                lidar_manifest.get("artifactVersion") if lidar_manifest else None
            ),
            "sources": fingerprint_input["lidarSources"],
            "coordinateReferenceSystem": source_crs.to_wkt(),
            "sourceUnitToMetres": fingerprint_input["sourceUnitToMetres"],
            "croppedNonNoisePointCount": int(lidar_points.shape[0]),
            "candidateSurfacePointCount": int(lidar_surfaces.shape[0]),
            "voxelPointCount": int(lidar_voxels.shape[0]),
            "voxelMetres": arguments.voxel_metres,
            "groundElevationMetres": ground_elevation,
        },
        "split": {
            "method": "sha256(sectionId) modulo 5",
            "controlRows": int((~holdout_mask).sum()),
            "heldOutRows": int(holdout_mask.sum()),
        },
        "transform": {
            "scale": 1.0,
            "yawDegrees": float(yaw),
            "centreFieldBearingDegrees": float(centre_field_bearing),
            "eastTranslationMetres": float(east_translation),
            "northTranslationMetres": float(north_translation),
            "verticalTranslationMetres": float(vertical_translation),
        },
        "residuals": {
            "control": {
                "medianMetres": percentile(control_distances, 50),
                "p95Metres": percentile(control_distances, 95),
                "maximumMetres": float(control_distances.max()),
            },
            "holdout": {
                "medianMetres": percentile(holdout_distances, 50),
                "p95Metres": percentile(holdout_distances, 95),
                "maximumMetres": float(holdout_distances.max()),
                "withinOneFootPercent": float(np.mean(holdout_distances <= threshold_metres) * 100),
            },
            "allAxisBiasMetres": {
                "east": float(np.median(residual_vectors[:, 0])),
                "north": float(np.median(residual_vectors[:, 1])),
                "vertical": float(np.median(residual_vectors[:, 2])),
            },
        },
        "releaseAssessment": {
            "registrationWithinOneFoot": holdout_pass,
            "publicationEligible": False,
            "blockers": [
                *([] if holdout_pass else ["HELD_OUT_REGISTRATION_ERROR_EXCEEDS_ONE_FOOT"]),
                "NEAREST_SURFACE_MATCHES_NOT_SEMANTIC_ROW_CONTROL",
                "OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
                "SOURCE_CURRENCY_NOT_VERIFIED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    Path(arguments.output).write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": arguments.output,
        "artifactVersion": artifact_version,
        "transform": artifact["transform"],
        "split": artifact["split"],
        "residuals": artifact["residuals"],
        "releaseAssessment": artifact["releaseAssessment"],
    }, indent=2))


if __name__ == "__main__":
    main()

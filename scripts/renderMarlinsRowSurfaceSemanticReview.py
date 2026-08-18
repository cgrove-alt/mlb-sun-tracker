#!/usr/bin/env python3
"""Render orthophoto and LiDAR profiles for Marlins row-surface semantic review."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Transformer


FEET_PER_METRE = 3.280839895013123
ORTHOPHOTO_EXTENT_FEET = (912500.0, 525000.0, 913750.0, 526250.0)
SOURCE_COLORS = (
    (0, 122, 255),
    (255, 99, 71),
    (140, 80, 210),
    (0, 160, 90),
    (230, 150, 0),
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def transform_path(path_feet: list[list[float]], transformer: Transformer) -> np.ndarray:
    points = np.asarray(path_feet, dtype=float)
    x, y = transformer.transform(points[:, 0], points[:, 1])
    return np.column_stack((x, y))


def tangent_at(points: np.ndarray, index: int) -> np.ndarray:
    if index == 0:
        vector = points[1] - points[0]
    elif index == len(points) - 1:
        vector = points[-1] - points[-2]
    else:
        vector = points[index + 1] - points[index - 1]
    return vector / np.linalg.norm(vector)


def crop_orthophoto(
    image: Image.Image,
    path_feet: np.ndarray,
    size: int = 620,
) -> tuple[Image.Image, dict[str, float]]:
    padding = 16.0
    minimum = path_feet.min(axis=0) - padding
    maximum = path_feet.max(axis=0) + padding
    span = max(float(maximum[0] - minimum[0]), float(maximum[1] - minimum[1]))
    center = (minimum + maximum) / 2.0
    minimum = center - span / 2.0
    maximum = center + span / 2.0
    xmin, ymin, xmax, ymax = ORTHOPHOTO_EXTENT_FEET
    left = (minimum[0] - xmin) / (xmax - xmin) * image.width
    right = (maximum[0] - xmin) / (xmax - xmin) * image.width
    top = (ymax - maximum[1]) / (ymax - ymin) * image.height
    bottom = (ymax - minimum[1]) / (ymax - ymin) * image.height
    crop = image.crop((left, top, right, bottom)).resize(
        (size, size), Image.Resampling.LANCZOS
    )
    draw = ImageDraw.Draw(crop)
    for first, second in zip(path_feet[:-1], path_feet[1:]):
        x1 = (first[0] - minimum[0]) / span * size
        y1 = (maximum[1] - first[1]) / span * size
        x2 = (second[0] - minimum[0]) / span * size
        y2 = (maximum[1] - second[1]) / span * size
        draw.line((x1, y1, x2, y2), fill=(255, 235, 0), width=5)
    for index, point in enumerate(path_feet):
        x = (point[0] - minimum[0]) / span * size
        y = (maximum[1] - point[1]) / span * size
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=(255, 235, 0))
        draw.text((x + 8, y - 8), str(index), fill=(255, 255, 255))
    return crop, {
        "xmin": float(minimum[0]),
        "ymin": float(minimum[1]),
        "xmax": float(maximum[0]),
        "ymax": float(maximum[1]),
    }


def render_profile(
    points: np.ndarray,
    sources: np.ndarray,
    query: np.ndarray,
    tangent: np.ndarray,
    selected_elevation_feet: float,
    expected_elevation_feet: float,
    source_color: dict[int, tuple[int, int, int]],
    width: int = 1100,
    height: int = 270,
) -> tuple[Image.Image, dict[str, Any]]:
    finite = np.isfinite(points).all(axis=1) & np.isfinite(sources)
    points = np.asarray(points[finite], dtype=np.float64)
    sources = np.asarray(sources[finite])
    query = np.asarray(query, dtype=np.float64)
    tangent = np.asarray(tangent, dtype=np.float64)
    if not np.isfinite(query).all() or not np.isfinite(tangent).all():
        raise ValueError("Profile query and tangent must be finite")
    delta = points[:, :2] - query
    normal = np.asarray([-tangent[1], tangent[0]])
    # Avoid a BLAS-backed matmul here. Some mixed NumPy/LAS runtimes emitted
    # spurious overflow warnings for these small, finite two-column arrays.
    along_metres = delta[:, 0] * tangent[0] + delta[:, 1] * tangent[1]
    normal_metres = delta[:, 0] * normal[0] + delta[:, 1] * normal[1]
    normal_feet = normal_metres * FEET_PER_METRE
    z_feet = points[:, 2] * FEET_PER_METRE
    keep = (
        (np.abs(along_metres) <= 0.75)
        & (np.abs(normal_feet) <= 8.0)
        & (z_feet >= selected_elevation_feet - 4.0)
        & (z_feet <= selected_elevation_feet + 4.0)
    )
    normal_feet = normal_feet[keep]
    z_feet = z_feet[keep]
    selected_sources = sources[keep]
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    margin_left, margin_right, margin_top, margin_bottom = 70, 25, 20, 42
    plot_width = width - margin_left - margin_right
    plot_height = height - margin_top - margin_bottom
    x_min, x_max = -8.0, 8.0
    y_min = selected_elevation_feet - 4.0
    y_max = selected_elevation_feet + 4.0

    def pixel_x(value: float) -> float:
        return margin_left + (value - x_min) / (x_max - x_min) * plot_width

    def pixel_y(value: float) -> float:
        return margin_top + (y_max - value) / (y_max - y_min) * plot_height

    for value in range(-8, 9, 2):
        x = pixel_x(value)
        draw.line((x, margin_top, x, margin_top + plot_height), fill=(230, 230, 230))
        draw.text((x - 8, height - 32), str(value), fill=(50, 50, 50))
    for value in np.arange(np.floor(y_min), np.ceil(y_max) + 0.1, 1.0):
        y = pixel_y(float(value))
        draw.line((margin_left, y, margin_left + plot_width, y), fill=(235, 235, 235))
        draw.text((4, y - 7), f"{value:.0f}", fill=(50, 50, 50))
    order = np.argsort(selected_sources)
    for index in order:
        x = pixel_x(float(normal_feet[index]))
        y = pixel_y(float(z_feet[index]))
        color = source_color[int(selected_sources[index])]
        draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=color)
    draw.line(
        (pixel_x(0.0), margin_top, pixel_x(0.0), margin_top + plot_height),
        fill=(20, 70, 210),
        width=3,
    )
    draw.line(
        (
            margin_left,
            pixel_y(selected_elevation_feet),
            margin_left + plot_width,
            pixel_y(selected_elevation_feet),
        ),
        fill=(0, 145, 70),
        width=3,
    )
    draw.line(
        (
            margin_left,
            pixel_y(expected_elevation_feet),
            margin_left + plot_width,
            pixel_y(expected_elevation_feet),
        ),
        fill=(225, 125, 0),
        width=2,
    )
    draw.text((margin_left, height - 18), "row-normal distance (ft)", fill=(20, 20, 20))
    draw.text((4, 2), "NAVD88 ft", fill=(20, 20, 20))
    return image, {
        "profilePointCount": int(keep.sum()),
        "pointSourceIds": sorted(int(value) for value in np.unique(selected_sources)),
        "alongHalfWidthMetres": 0.75,
        "normalHalfWidthFeet": 8.0,
        "verticalHalfWindowFeet": 4.0,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_audit", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()

    audit_bytes = args.row_audit.read_bytes()
    audit = json.loads(audit_bytes)
    if audit.get("artifactKind") != (
        "orthophoto-identified-2018-lidar-row-surface-audit"
    ):
        raise ValueError("Row audit has the wrong kind")
    if sha256_file(args.lidar) != audit["inputs"]["referenceLidarSha256"]:
        raise ValueError("LiDAR checksum mismatch")
    orthophoto_sha256 = sha256_file(args.orthophoto)
    rows = [row for row in audit["rows"] if row["metricSurfaceCandidate"]]
    with laspy.open(args.lidar) as reader:
        embedded = reader.header.parse_crs()
    if embedded is None:
        raise ValueError("LiDAR lacks a CRS")
    horizontal = embedded.sub_crs_list[0] if embedded.is_compound else embedded
    transformer = Transformer.from_crs(6438, CRS.from_user_input(horizontal), always_xy=True)
    transformed_paths = {
        row["rowKey"]: transform_path(
            row["correctedPlanAnchorPathEpsg6438UsSurveyFeet"], transformer
        )
        for row in rows
    }
    all_points = np.vstack(list(transformed_paths.values()))
    minimum = all_points.min(axis=0) - 5.0
    maximum = all_points.max(axis=0) + 5.0
    parts = []
    source_parts = []
    with laspy.open(args.lidar) as reader:
        for lidar in reader.chunk_iterator(2_000_000):
            x = np.asarray(lidar.x, dtype=np.float64)
            y = np.asarray(lidar.y, dtype=np.float64)
            z = np.asarray(lidar.z, dtype=np.float64)
            classification = np.asarray(lidar.classification)
            keep = (
                np.isfinite(x)
                & np.isfinite(y)
                & np.isfinite(z)
                &
                (x >= minimum[0])
                & (x <= maximum[0])
                & (y >= minimum[1])
                & (y <= maximum[1])
                & np.isin(classification, [1, 6])
            )
            if not keep.any():
                continue
            parts.append(np.column_stack((x[keep], y[keep], z[keep])).astype(np.float64))
            source_parts.append(np.asarray(lidar.point_source_id)[keep])
    if not parts:
        raise ValueError("No finite LiDAR points found around candidate row paths")
    points = np.vstack(parts).astype(np.float64)
    sources = np.concatenate(source_parts)
    unique_sources = sorted(int(value) for value in np.unique(sources))
    source_color = {
        source_id: SOURCE_COLORS[index % len(SOURCE_COLORS)]
        for index, source_id in enumerate(unique_sources)
    }
    orthophoto = Image.open(args.orthophoto).convert("RGB")
    args.output_directory.mkdir(parents=True, exist_ok=True)
    outputs = []
    for row in rows:
        path_feet = np.asarray(
            row["correctedPlanAnchorPathEpsg6438UsSurveyFeet"], dtype=float
        )
        plan, plan_extent = crop_orthophoto(orthophoto, path_feet)
        page = Image.new("RGB", (1120, 1170), "white")
        page.paste(plan, (10, 45))
        draw = ImageDraw.Draw(page)
        draw.text((10, 10), f"{row['rowKey']} semantic surface review", fill=(0, 0, 0))
        draw.text(
            (650, 55),
            "Yellow: corrected provider row path\nBlue: row normal at anchor\nGreen: selected LiDAR surface\nOrange: provider-offset expectation",
            fill=(20, 20, 20),
        )
        transformed = transformed_paths[row["rowKey"]]
        profile_records = []
        for anchor_index, anchor in enumerate(row["anchors"]):
            tangent = tangent_at(transformed, anchor_index)
            profile, record = render_profile(
                points,
                sources,
                transformed[anchor_index],
                tangent,
                float(anchor["surfaceElevationFeetNavd88"]),
                float(anchor["expectedSurfaceElevationFeetNavd88"]),
                source_color,
            )
            y = 660 + anchor_index * 165
            profile = profile.resize((1100, 160), Image.Resampling.LANCZOS)
            page.paste(profile, (10, y))
            draw.text((15, y + 3), f"anchor {anchor_index}", fill=(0, 0, 0))
            profile_records.append({
                "anchorIndex": anchor_index,
                "selectedSurfaceElevationFeetNavd88": anchor[
                    "surfaceElevationFeetNavd88"
                ],
                "expectedSurfaceElevationFeetNavd88": anchor[
                    "expectedSurfaceElevationFeetNavd88"
                ],
                **record,
            })
        output = args.output_directory / f"{row['rowKey'].replace(':', '-')}.png"
        page.save(output)
        outputs.append({
            "rowKey": row["rowKey"],
            "path": str(output),
            "sha256": sha256_file(output),
            "orthophotoCropExtentEpsg6438Feet": plan_extent,
            "profiles": profile_records,
        })

    stable = {
        "rowAuditSha256": hashlib.sha256(audit_bytes).hexdigest(),
        "lidarSha256": sha256_file(args.lidar),
        "orthophotoSha256": orthophoto_sha256,
        "outputs": outputs,
    }
    manifest = {
        "schemaVersion": 1,
        "artifactKind": "row-surface-semantic-review-atlas",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "rowAuditPath": str(args.row_audit),
            "rowAuditSha256": stable["rowAuditSha256"],
            "rowAuditArtifactVersion": audit["artifactVersion"],
            "lidarPath": str(args.lidar),
            "lidarSha256": stable["lidarSha256"],
            "orthophotoPath": str(args.orthophoto),
            "orthophotoSha256": stable["orthophotoSha256"],
            "orthophotoExtentEpsg6438Feet": list(ORTHOPHOTO_EXTENT_FEET),
        },
        "pointSourceColors": {
            str(source_id): list(color) for source_id, color in source_color.items()
        },
        "outputs": outputs,
        "assessment": {
            "semanticReviewComplete": False,
            "measuredRows": 0,
            "publicationEligible": False,
            "blockers": [
                "RENDERED_SURFACES_NOT_YET_SEMANTICALLY_REVIEWED",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({
        "manifest": str(args.manifest),
        "artifactVersion": manifest["artifactVersion"],
        "outputs": outputs,
    }, indent=2))


if __name__ == "__main__":
    main()

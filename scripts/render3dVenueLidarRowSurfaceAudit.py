#!/usr/bin/env python3
"""Render registered provider anchors over an open-roof LiDAR heightfield."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw
from pyproj import CRS, Transformer


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def linear_unit_to_feet(crs: CRS) -> float:
    if not crs.axis_info:
        raise ValueError("LiDAR horizontal CRS does not expose a linear unit")
    factor_metres = float(crs.axis_info[0].unit_conversion_factor or math.nan)
    if not math.isfinite(factor_metres) or factor_metres <= 0:
        raise ValueError("LiDAR horizontal CRS has an invalid linear unit")
    return factor_metres * 3.280839895013123


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("heightfield", type=Path)
    parser.add_argument("heightfield_png", type=Path)
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("audit", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--marker-radius", type=int, default=2)
    arguments = parser.parse_args()
    if arguments.marker_radius < 1:
        raise ValueError("Marker radius must be positive")

    heightfield: dict[str, Any] = json.loads(arguments.heightfield.read_text())
    world: dict[str, Any] = json.loads(arguments.world_rows.read_text())
    audit: dict[str, Any] = json.loads(arguments.audit.read_text())
    if heightfield.get("artifactStage") != "candidate-heightfield":
        raise ValueError("Heightfield input has the wrong artifact stage")
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if audit.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Audit input has the wrong artifact kind")
    if audit.get("inputs", {}).get("worldRowsSha256") != sha256_file(arguments.world_rows):
        raise ValueError("Audit does not reference the supplied world-row artifact")
    stadium_ids = {
        heightfield.get("stadiumId"),
        world.get("stadiumId"),
        audit.get("stadiumId"),
    }
    if len(stadium_ids) != 1 or None in stadium_ids:
        raise ValueError("Input stadium identifiers do not agree")

    image = Image.open(arguments.heightfield_png).convert("RGB")
    grid = heightfield["grid"]
    columns = int(grid["columns"])
    rows = int(grid["rows"])
    if image.width % columns or image.height % rows:
        raise ValueError("Heightfield PNG does not reproduce the JSON grid dimensions")
    scale_x = image.width / columns
    scale_y = image.height / rows
    if not math.isclose(scale_x, scale_y, rel_tol=0, abs_tol=1e-9):
        raise ValueError("Heightfield PNG uses unequal x and y scale")
    scale = scale_x

    lidar_horizontal = CRS.from_wkt(audit["coordinateReference"]["lidarHorizontal"])
    transformer = Transformer.from_crs(6438, lidar_horizontal, always_xy=True)
    native_to_feet = linear_unit_to_feet(lidar_horizontal)
    center_x_feet = float(grid["centerProjectedXFt"])
    center_y_feet = float(grid["centerProjectedYFt"])
    half_width_feet = float(grid["halfWidthFt"])
    cell_size_feet = float(grid["cellSizeFt"])

    evidence_lookup = {
        (row["rowKey"], anchor["anchorIndex"]): anchor
        for row in audit["rows"]
        for anchor in row["anchors"]
    }
    draw = ImageDraw.Draw(image)
    colors = {
        "training-match": (31, 255, 104),
        "holdout-match": (0, 244, 255),
        "repeatable-unselected": (255, 166, 0),
        "no-repeatable": (255, 45, 77),
    }
    counts = {name: 0 for name in colors}
    radius = arguments.marker_radius
    for row in world["rows"]:
        for anchor_index, anchor in enumerate(row["anchors"]):
            evidence = evidence_lookup.get((row["rowKey"], anchor_index))
            if evidence is None:
                raise ValueError("Audit is missing a world-row anchor")
            east_native, north_native = transformer.transform(
                *anchor["projectedCoordinateUsSurveyFeet"]
            )
            east_offset = east_native * native_to_feet - center_x_feet
            north_offset = north_native * native_to_feet - center_y_feet
            column = (east_offset + half_width_feet) / cell_size_feet
            grid_row = (north_offset + half_width_feet) / cell_size_feet
            x = round(column * scale)
            y = round((rows - grid_row - 1) * scale)
            if not (0 <= x < image.width and 0 <= y < image.height):
                continue
            if evidence.get("selectedSurface"):
                category = "holdout-match" if evidence.get("holdout") else "training-match"
            elif evidence.get("repeatableCandidateCount", 0) > 0:
                category = "repeatable-unselected"
            else:
                category = "no-repeatable"
            counts[category] += 1
            draw.ellipse(
                (x - radius, y - radius, x + radius, y + radius),
                fill=colors[category],
                outline=(8, 8, 8),
                width=1,
            )

    legend_x = 24
    legend_y = 24
    line_height = 28
    legend_width = 460
    legend_height = line_height * (len(colors) + 2)
    base_acquired_on = str(heightfield.get("source", {}).get("acquiredOn", "unknown"))
    audit_acquired_on = str(audit.get("inputs", {}).get("acquiredOn", "unknown"))
    base_year = base_acquired_on[:4]
    audit_year = audit_acquired_on[:4]
    if base_year == audit_year:
        title = f"{base_year} open-roof LiDAR row-surface candidate audit"
    else:
        title = f"{base_year} LiDAR base with {audit_year} audit overlay"
    draw.rectangle(
        (legend_x, legend_y, legend_x + legend_width, legend_y + legend_height),
        fill=(255, 255, 255),
        outline=(20, 20, 20),
        width=2,
    )
    draw.text(
        (legend_x + 12, legend_y + 8),
        title,
        fill=(0, 0, 0),
    )
    for index, (category, color) in enumerate(colors.items(), start=1):
        y = legend_y + 8 + index * line_height
        draw.ellipse((legend_x + 12, y, legend_x + 24, y + 12), fill=color, outline=(0, 0, 0))
        draw.text(
            (legend_x + 34, y - 1),
            f"{category}: {counts[category]} anchors",
            fill=(0, 0, 0),
        )
    draw.text(
        (legend_x + 12, legend_y + 8 + (len(colors) + 1) * line_height),
        "Candidate surfaces only. No semantic row promotion.",
        fill=(0, 0, 0),
    )

    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(arguments.output, format="PNG", optimize=True)
    print(json.dumps({
        "output": str(arguments.output),
        "inputHashes": {
            "heightfield": sha256_file(arguments.heightfield),
            "heightfieldPng": sha256_file(arguments.heightfield_png),
            "worldRows": sha256_file(arguments.world_rows),
            "audit": sha256_file(arguments.audit),
        },
        "anchorCounts": counts,
        "baseLidarAcquiredOn": base_acquired_on,
        "auditLidarAcquiredOn": audit_acquired_on,
        "northIsUp": True,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

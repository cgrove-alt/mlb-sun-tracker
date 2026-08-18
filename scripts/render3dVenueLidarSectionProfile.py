#!/usr/bin/env python3
"""Render provider and repeatable LiDAR elevations along seating sections."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("audit", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section-id", action="append", required=True)
    arguments = parser.parse_args()

    world: dict[str, Any] = json.loads(arguments.world_rows.read_text())
    audit: dict[str, Any] = json.loads(arguments.audit.read_text())
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if audit.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Audit input has the wrong artifact kind")
    if audit.get("inputs", {}).get("worldRowsSha256") != sha256_file(arguments.world_rows):
        raise ValueError("Audit does not reference the supplied world rows")
    requested = list(dict.fromkeys(arguments.section_id))
    audit_rows = {row["rowKey"]: row for row in audit["rows"]}
    home = world["origin"]["projectedCoordinateAfterGroundFrameCorrectionFeet"]
    offset = float(audit["cameraToSurfaceOffsetFit"]["selectedOffsetFeet"])

    profiles: dict[str, list[dict[str, Any]]] = {section_id: [] for section_id in requested}
    for row in world["rows"]:
        section_id = row["sectionId"]
        if section_id not in profiles:
            continue
        evidence = audit_rows.get(row["rowKey"])
        if evidence is None:
            raise ValueError(f"Audit is missing row {row['rowKey']}")
        coordinates = [
            anchor["projectedCoordinateUsSurveyFeet"]
            for anchor in row["anchors"]
        ]
        camera_elevations = [
            anchor["candidateCameraElevationNavd88Feet"]
            for anchor in row["anchors"]
        ]
        east = sum(position[0] for position in coordinates) / len(coordinates)
        north = sum(position[1] for position in coordinates) / len(coordinates)
        radial_distance = math.hypot(east - home[0], north - home[1])
        profiles[section_id].append({
            "rowId": row["rowId"],
            "radialDistanceFeet": radial_distance,
            "providerSurfaceElevationFeet": sum(camera_elevations) / len(camera_elevations) - offset,
            "lidarSurfaceElevationFeet": evidence["candidateMeasuredSurfaceElevationFeet"],
            "lidarSurfaceSpanFeet": evidence["candidateSurfaceElevationSpanFeet"],
            "matchedAnchorCount": evidence["matchedAnchorCount"],
            "anchorCount": evidence["anchorCount"],
            "holdout": evidence["holdout"],
        })
    missing = [section_id for section_id, rows in profiles.items() if not rows]
    if missing:
        raise ValueError(f"Unknown or empty sections: {missing}")
    for rows in profiles.values():
        rows.sort(key=lambda row: row["radialDistanceFeet"])

    width = 1800
    panel_height = 620
    header_height = 120
    footer_height = 70
    image = Image.new(
        "RGB",
        (width, header_height + panel_height * len(requested) + footer_height),
        (248, 250, 252),
    )
    draw = ImageDraw.Draw(image)
    draw.text((40, 28), "Marlins 2018 open-roof LiDAR section profiles", fill=(0, 0, 0))
    draw.text(
        (40, 56),
        f"Provider camera minus training-only global offset: {offset:.2f} ft",
        fill=(0, 0, 0),
    )
    draw.text(
        (40, 82),
        "LiDAR points are repeatable surface candidates, not promoted seating treads.",
        fill=(0, 0, 0),
    )

    left = 110
    right = width - 70
    for panel_index, section_id in enumerate(requested):
        rows = profiles[section_id]
        top = header_height + panel_index * panel_height + 55
        bottom = header_height + (panel_index + 1) * panel_height - 75
        distances = [row["radialDistanceFeet"] for row in rows]
        elevations = [row["providerSurfaceElevationFeet"] for row in rows]
        elevations.extend(
            row["lidarSurfaceElevationFeet"]
            for row in rows
            if row["lidarSurfaceElevationFeet"] is not None
        )
        minimum_x = math.floor(min(distances) / 5) * 5 - 5
        maximum_x = math.ceil(max(distances) / 5) * 5 + 5
        minimum_y = math.floor(min(elevations) / 5) * 5 - 2
        maximum_y = math.ceil(max(elevations) / 5) * 5 + 2

        def point(x_value: float, y_value: float) -> tuple[int, int]:
            x = left + (x_value - minimum_x) / (maximum_x - minimum_x) * (right - left)
            y = bottom - (y_value - minimum_y) / (maximum_y - minimum_y) * (bottom - top)
            return round(x), round(y)

        for elevation in range(math.ceil(minimum_y / 5) * 5, math.floor(maximum_y / 5) * 5 + 1, 5):
            _, y = point(minimum_x, elevation)
            draw.line((left, y, right, y), fill=(214, 220, 228), width=1)
            draw.text((48, y - 7), f"{elevation} ft", fill=(55, 62, 72))
        for distance in range(math.ceil(minimum_x / 10) * 10, math.floor(maximum_x / 10) * 10 + 1, 10):
            x, _ = point(distance, minimum_y)
            draw.line((x, top, x, bottom), fill=(232, 236, 241), width=1)
            draw.text((x - 14, bottom + 12), str(distance), fill=(55, 62, 72))
        draw.rectangle((left, top, right, bottom), outline=(32, 38, 45), width=2)
        holdout = rows[0]["holdout"]
        split_label = "held-out section" if holdout else "training section"
        matched = sum(row["lidarSurfaceElevationFeet"] is not None for row in rows)
        draw.text(
            (left, top - 34),
            f"{section_id}: {split_label}, {matched}/{len(rows)} rows with selected repeatable surfaces",
            fill=(0, 0, 0),
        )
        provider_points = [
            point(row["radialDistanceFeet"], row["providerSurfaceElevationFeet"])
            for row in rows
        ]
        if len(provider_points) > 1:
            draw.line(provider_points, fill=(52, 106, 219), width=3)
        for row, provider_point in zip(rows, provider_points):
            draw.ellipse(
                (
                    provider_point[0] - 3,
                    provider_point[1] - 3,
                    provider_point[0] + 3,
                    provider_point[1] + 3,
                ),
                fill=(52, 106, 219),
            )
            measured = row["lidarSurfaceElevationFeet"]
            if measured is None:
                continue
            x, y = point(row["radialDistanceFeet"], measured)
            color = (0, 178, 196) if holdout else (28, 171, 79)
            span = float(row["lidarSurfaceSpanFeet"] or 0)
            _, y_low = point(row["radialDistanceFeet"], measured - span / 2)
            _, y_high = point(row["radialDistanceFeet"], measured + span / 2)
            draw.line((x, y_low, x, y_high), fill=color, width=3)
            draw.ellipse((x - 5, y - 5, x + 5, y + 5), fill=color, outline=(0, 0, 0))
            label_y = y - 22 if rows.index(row) % 2 == 0 else y + 10
            draw.text((x - 8, label_y), row["rowId"], fill=(0, 0, 0))

    legend_y = image.height - footer_height + 18
    draw.line((40, legend_y + 7, 90, legend_y + 7), fill=(52, 106, 219), width=3)
    draw.text((100, legend_y), "provider camera elevation minus fitted offset", fill=(0, 0, 0))
    draw.ellipse((620, legend_y + 2, 630, legend_y + 12), fill=(28, 171, 79), outline=(0, 0, 0))
    draw.text((640, legend_y), "training LiDAR candidate", fill=(0, 0, 0))
    draw.ellipse((940, legend_y + 2, 950, legend_y + 12), fill=(0, 178, 196), outline=(0, 0, 0))
    draw.text((960, legend_y), "holdout LiDAR candidate", fill=(0, 0, 0))

    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(arguments.output, format="PNG", optimize=True)
    print(json.dumps({
        "output": str(arguments.output),
        "sections": requested,
        "worldRowsSha256": sha256_file(arguments.world_rows),
        "auditSha256": sha256_file(arguments.audit),
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

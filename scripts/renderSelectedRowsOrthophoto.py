#!/usr/bin/env python3
"""Render selected metric row polygons and labels over an orthophoto."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw
from pyproj import Transformer


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("orthophoto_metadata", type=Path)
    parser.add_argument("rows", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--padding-pixels", type=int, default=300)
    arguments = parser.parse_args()

    metadata = json.loads(arguments.orthophoto_metadata.read_text(encoding="utf-8"))
    row_artifact = json.loads(arguments.rows.read_text(encoding="utf-8"))
    selected_sections = set(arguments.section)
    selected_rows = [
        row for row in row_artifact["rows"] if row["sectionId"] in selected_sections
    ]
    if not selected_rows:
        raise ValueError("No selected rows are present")
    image = Image.open(arguments.orthophoto).convert("RGBA")
    extent = metadata["imageExtent"]
    transformer = Transformer.from_crs(
        "EPSG:6347", extent["coordinateReferenceSystem"], always_xy=True
    )

    def pixel(easting: float, northing: float) -> tuple[float, float]:
        x_value, y_value = transformer.transform(easting, northing)
        return (
            (x_value - float(extent["xmin"]))
            / (float(extent["xmax"]) - float(extent["xmin"]))
            * image.width,
            (float(extent["ymax"]) - y_value)
            / (float(extent["ymax"]) - float(extent["ymin"]))
            * image.height,
        )

    draw = ImageDraw.Draw(image, mode="RGBA")
    all_pixels: list[tuple[float, float]] = []
    palette = [(255, 30, 30, 245), (35, 120, 255, 245), (255, 180, 0, 245)]
    colors = {
        section: palette[index % len(palette)]
        for index, section in enumerate(sorted(selected_sections))
    }
    for row in selected_rows:
        color = colors[row["sectionId"]]
        for ring in row["horizontalGeometry"]["rings"]:
            pixels = [pixel(float(point[0]), float(point[1])) for point in ring]
            all_pixels.extend(pixels)
            draw.line(pixels, fill=color, width=4, joint="curve")
        centroid = pixel(*row["horizontalGeometry"]["centroidMetres"])
        label = row["rowKey"]
        draw.rectangle(
            (centroid[0] - 22, centroid[1] - 10, centroid[0] + 22, centroid[1] + 10),
            fill=(255, 255, 255, 220),
        )
        draw.text((centroid[0] - 19, centroid[1] - 8), label, fill=(0, 0, 0, 255))
    left = max(0, int(min(value[0] for value in all_pixels)) - arguments.padding_pixels)
    top = max(0, int(min(value[1] for value in all_pixels)) - arguments.padding_pixels)
    right = min(image.width, int(max(value[0] for value in all_pixels)) + arguments.padding_pixels)
    bottom = min(image.height, int(max(value[1] for value in all_pixels)) + arguments.padding_pixels)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    image.crop((left, top, right, bottom)).convert("RGB").save(
        arguments.output, format="PNG", optimize=True
    )
    print(json.dumps({
        "output": str(arguments.output),
        "sections": sorted(selected_sections),
        "rowCount": len(selected_rows),
        "cropBoxPixels": [left, top, right, bottom],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render a candidate lidar heightfield for human footprint review."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Candidate heightfield JSON")
    parser.add_argument("output", type=Path, help="PNG review image")
    parser.add_argument("--pixels-per-cell", type=int, default=3)
    parser.add_argument("--maximum-height-ft", type=float, default=200)
    return parser.parse_args()


def height_color(height_ft: float, maximum_height_ft: float) -> tuple[int, int, int]:
    value = max(0.0, min(1.0, height_ft / maximum_height_ft))
    # Dark blue -> cyan -> yellow -> red. This keeps low seating/deck surfaces
    # visible while distinguishing towers and roof structures.
    stops = [
        (0.0, (13, 32, 66)),
        (0.25, (22, 126, 166)),
        (0.5, (72, 194, 142)),
        (0.75, (246, 213, 75)),
        (1.0, (190, 43, 44)),
    ]
    for index in range(1, len(stops)):
        left_value, left_color = stops[index - 1]
        right_value, right_color = stops[index]
        if value <= right_value:
            ratio = (value - left_value) / (right_value - left_value)
            return tuple(
                round(left + (right - left) * ratio)
                for left, right in zip(left_color, right_color)
            )
    return stops[-1][1]


def main() -> None:
    args = parse_args()
    if args.pixels_per_cell <= 0 or args.maximum_height_ft <= 0:
        raise ValueError("pixels per cell and maximum height must be positive")
    artifact: dict[str, Any] = json.loads(args.input.read_text(encoding="utf-8"))
    if artifact.get("artifactStage") != "candidate-heightfield":
        raise ValueError("Input is not a candidate-heightfield artifact")

    grid = artifact["grid"]
    columns = int(grid["columns"])
    rows = int(grid["rows"])
    scale = args.pixels_per_cell
    image = Image.new("RGB", (columns * scale, rows * scale), (248, 250, 252))
    draw = ImageDraw.Draw(image)

    for column, row, height_ft in grid["cells"]:
        x0 = int(column) * scale
        # Grid rows increase northward; image rows increase downward.
        y0 = (rows - int(row) - 1) * scale
        draw.rectangle(
            (x0, y0, x0 + scale - 1, y0 + scale - 1),
            fill=height_color(float(height_ft), args.maximum_height_ft),
        )

    center_x = columns * scale // 2
    center_y = rows * scale // 2
    cross_radius = max(5, scale * 3)
    draw.line((center_x - cross_radius, center_y, center_x + cross_radius, center_y), fill=(255, 0, 200), width=2)
    draw.line((center_x, center_y - cross_radius, center_x, center_y + cross_radius), fill=(255, 0, 200), width=2)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.output, format="PNG", optimize=True)
    print(json.dumps({
        "output": str(args.output),
        "stadiumId": artifact.get("stadiumId"),
        "dimensionsPixels": [columns * scale, rows * scale],
        "renderedCellCount": len(grid["cells"]),
        "northIsUp": True,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

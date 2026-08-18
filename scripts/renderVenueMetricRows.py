#!/usr/bin/env python3
"""Render a top-down diagnostic of venue-local metric row anchors."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("--size", type=int, default=1600)
    arguments = parser.parse_args()

    artifact = json.loads(Path(arguments.input).read_text(encoding="utf-8"))
    if artifact.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Input is not a venue-local metric row artifact")
    anchors = [anchor for row in artifact["rows"] for anchor in row["anchors"]]
    points = np.asarray([anchor["position"] for anchor in anchors], dtype=np.float64)
    horizontal = points[:, [0, 2]]
    elevation = points[:, 1]
    low = horizontal.min(axis=0)
    high = horizontal.max(axis=0)
    span = np.maximum(high - low, 1e-9)
    padding = 60
    usable = arguments.size - 2 * padding
    scale = min(usable / span[0], usable / span[1])
    offset = np.asarray([padding, padding]) + (usable - span * scale) / 2
    pixels = (horizontal - low) * scale + offset
    pixels[:, 1] = arguments.size - pixels[:, 1]

    minimum_elevation = float(elevation.min())
    elevation_span = max(float(elevation.max() - minimum_elevation), 1e-9)
    image = Image.new("RGB", (arguments.size, arguments.size), "white")
    draw = ImageDraw.Draw(image)
    for (x_pixel, y_pixel), height in zip(pixels, elevation):
        normalized = (float(height) - minimum_elevation) / elevation_span
        color = (
            int(25 + 220 * normalized),
            int(70 + 130 * (1 - abs(normalized - 0.5) * 2)),
            int(190 - 150 * normalized),
        )
        radius = 2
        draw.ellipse(
            (x_pixel - radius, y_pixel - radius, x_pixel + radius, y_pixel + radius),
            fill=color,
        )
    draw.text(
        (20, 20),
        f"{artifact['stadiumId']} venue-local row anchors, x/z plan view, colour = local y",
        fill="black",
    )
    image.save(arguments.output)


if __name__ == "__main__":
    main()

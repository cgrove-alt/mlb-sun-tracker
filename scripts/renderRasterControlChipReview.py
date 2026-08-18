#!/usr/bin/env python3
"""Render a native raster control chip with an unobscured center reticle."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Native-resolution source chip")
    parser.add_argument("output", type=Path, help="Rendered review PNG")
    parser.add_argument("--scale", type=int, default=4)
    parser.add_argument("--gap-source-pixels", type=int, default=6)
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    arguments = parse_args()
    if arguments.scale <= 0:
        raise ValueError("scale must be positive")
    if arguments.gap_source_pixels < 0:
        raise ValueError("gap must be nonnegative")

    with Image.open(arguments.input) as source:
        image = source.convert("RGB")
    width, height = image.size
    if width % 2 != 0 or height % 2 != 0:
        raise ValueError("control chips must have even dimensions")

    scale = arguments.scale
    review = image.resize((width * scale, height * scale), Image.Resampling.NEAREST)
    draw = ImageDraw.Draw(review)
    center_x = width * scale // 2
    center_y = height * scale // 2
    gap = arguments.gap_source_pixels * scale
    color = (255, 0, 200)
    line_width = max(2, scale)

    draw.line((center_x, 0, center_x, center_y - gap), fill=color, width=line_width)
    draw.line(
        (center_x, center_y + gap, center_x, review.height - 1),
        fill=color,
        width=line_width,
    )
    draw.line((0, center_y, center_x - gap, center_y), fill=color, width=line_width)
    draw.line(
        (center_x + gap, center_y, review.width - 1, center_y),
        fill=color,
        width=line_width,
    )

    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    review.save(arguments.output, format="PNG", optimize=True)
    print(json.dumps({
        "input": str(arguments.input),
        "inputSha256": sha256(arguments.input),
        "output": str(arguments.output),
        "outputSha256": sha256(arguments.output),
        "sourceDimensionsPixels": [width, height],
        "reviewDimensionsPixels": [review.width, review.height],
        "surveyCoordinateAtSourcePixelBoundary": [width / 2, height / 2],
        "reticleGapSourcePixels": arguments.gap_source_pixels,
    }, indent=2))


if __name__ == "__main__":
    main()

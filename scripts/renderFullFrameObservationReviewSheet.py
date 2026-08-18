#!/usr/bin/env python3
"""Render labeled upper-frame crops for row-level shadow review."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--thumbnail-width", type=int, default=640)
    parser.add_argument("--crop-height-fraction", type=float, default=0.46)
    arguments = parser.parse_args()
    if arguments.columns < 1 or arguments.thumbnail_width < 320:
        raise ValueError("Invalid sheet dimensions")
    if not 0.2 <= arguments.crop_height_fraction <= 1:
        raise ValueError("Invalid crop height fraction")

    manifest = json.loads(arguments.manifest.read_text(encoding="utf-8"))
    frames = manifest["frames"]
    if not frames:
        raise ValueError("Manifest contains no frames")
    first = Image.open(frames[0]["outputPath"])
    crop_height = round(first.height * arguments.crop_height_fraction)
    thumbnail_height = round(crop_height / first.width * arguments.thumbnail_width)
    label_height = 62
    title_height = 50
    rows = math.ceil(len(frames) / arguments.columns)
    sheet = Image.new(
        "RGB",
        (
            arguments.columns * arguments.thumbnail_width,
            title_height + rows * (label_height + thumbnail_height),
        ),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((10, 15), "Full-resolution official MLB seating-bank shadow review", fill="black")
    for index, frame in enumerate(frames):
        source = Image.open(frame["outputPath"]).convert("RGB")
        if source.size != first.size:
            raise ValueError("Full-resolution observation dimensions differ")
        crop = source.crop((0, 0, source.width, crop_height))
        crop = crop.resize(
            (arguments.thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS
        )
        column = index % arguments.columns
        row = index // arguments.columns
        x_value = column * arguments.thumbnail_width
        y_value = title_height + row * (label_height + thumbnail_height)
        label = (
            f"{frame['candidateIndex']:03d}/{frame['sampleIndex']:03d}  "
            f"{frame['eventMidpointTime']}\n"
            f"alt {frame['solarPosition']['altitudeDegrees']:.2f}  "
            f"az {frame['solarPosition']['azimuthDegrees']:.2f}  "
            f"pixels {frame['decodedPixelsSha256'][:12]}"
        )
        draw.text((x_value + 6, y_value + 5), label, fill="black")
        sheet.paste(crop, (x_value, y_value + label_height))
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(arguments.output, format="JPEG", quality=95, optimize=True, progressive=True)
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "sha256": sha256_file(arguments.output),
                "frameCount": len(frames),
                "sheetDimensions": list(sheet.size),
                "sourceCropHeightPixels": crop_height,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

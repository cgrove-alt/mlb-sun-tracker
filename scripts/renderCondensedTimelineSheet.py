#!/usr/bin/env python3
"""Render a bounded review sheet from a condensed-game frame index."""

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
    parser.add_argument("--start-seconds", type=float, default=0.0)
    parser.add_argument("--end-seconds", type=float)
    parser.add_argument("--stride-seconds", type=float, default=2.0)
    parser.add_argument("--columns", type=int, default=5)
    parser.add_argument("--thumbnail-width", type=int, default=384)
    arguments = parser.parse_args()
    if arguments.start_seconds < 0 or arguments.stride_seconds <= 0:
        raise ValueError("Timeline bounds and stride are invalid")
    if arguments.columns < 1 or arguments.thumbnail_width < 240:
        raise ValueError("Sheet dimensions are invalid")

    manifest = json.loads(arguments.manifest.read_text(encoding="utf-8"))
    if manifest.get("artifactStage") != "official-mlb-condensed-game-frame-review-index":
        raise ValueError("Input is not a condensed-game frame index")
    end_seconds = (
        arguments.end_seconds
        if arguments.end_seconds is not None
        else float(manifest["videoMetadata"]["durationSeconds"])
    )
    if end_seconds <= arguments.start_seconds:
        raise ValueError("End time must follow start time")
    eligible = [
        frame for frame in manifest["frames"]
        if arguments.start_seconds <= frame["condensedTimelineSeconds"] < end_seconds
    ]
    selected = []
    next_time = arguments.start_seconds
    for frame in eligible:
        if frame["condensedTimelineSeconds"] + 1e-9 < next_time:
            continue
        selected.append(frame)
        next_time = frame["condensedTimelineSeconds"] + arguments.stride_seconds
    if not selected:
        raise ValueError("No indexed frames fall inside the requested timeline range")

    first = Image.open(selected[0]["thumbnailPath"])
    thumb_height = round(first.height / first.width * arguments.thumbnail_width)
    label_height = 36
    title_height = 48
    rows = math.ceil(len(selected) / arguments.columns)
    sheet = Image.new(
        "RGB",
        (
            arguments.columns * arguments.thumbnail_width,
            title_height + rows * (thumb_height + label_height),
        ),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text(
        (10, 15),
        f"Condensed timeline {arguments.start_seconds:.0f}s to {end_seconds:.0f}s, "
        f"stride {arguments.stride_seconds:.1f}s",
        fill="black",
    )
    for index, frame in enumerate(selected):
        source_path = Path(frame["thumbnailPath"])
        if sha256_file(source_path) != frame["thumbnailSha256"]:
            raise ValueError(f"Thumbnail checksum changed: {source_path}")
        image = Image.open(source_path).convert("RGB")
        image.thumbnail((arguments.thumbnail_width, thumb_height), Image.Resampling.LANCZOS)
        column = index % arguments.columns
        row = index // arguments.columns
        x_value = column * arguments.thumbnail_width
        y_value = title_height + row * (thumb_height + label_height)
        label = (
            f"{frame['condensedTimelineSeconds']:.2f}s  sample {frame['sampleIndex']:04d}  "
            f"{frame['decodedPixelsSha256'][:10]}"
        )
        draw.text((x_value + 6, y_value + 8), label, fill="black")
        sheet.paste(image, (x_value, y_value + label_height))
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(arguments.output, format="JPEG", quality=94, optimize=True, progressive=True)
    print(json.dumps({
        "output": str(arguments.output),
        "sha256": sha256_file(arguments.output),
        "selectedFrameCount": len(selected),
        "rangeSeconds": [arguments.start_seconds, end_seconds],
        "strideSeconds": arguments.stride_seconds,
        "sheetDimensions": list(sheet.size),
    }, indent=2))


if __name__ == "__main__":
    main()

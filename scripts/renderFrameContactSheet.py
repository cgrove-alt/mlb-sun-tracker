#!/usr/bin/env python3
"""Render a labeled contact sheet from extracted video-frame manifests."""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--columns", type=int, default=2)
    parser.add_argument("--thumbnail-width", type=int, default=640)
    parser.add_argument("--left", type=int, default=0)
    parser.add_argument("--top", type=int, default=0)
    parser.add_argument("--right", type=int)
    parser.add_argument("--bottom", type=int)
    parser.add_argument("--candidate-index", type=int, action="append", default=[])
    parser.add_argument("--start-frame", type=int, default=1)
    parser.add_argument("--end-frame", type=int)
    arguments = parser.parse_args()
    if arguments.columns < 1 or arguments.thumbnail_width < 160:
        raise ValueError("Invalid contact-sheet dimensions")

    manifest = json.loads(arguments.manifest.read_text(encoding="utf-8"))
    frames = manifest.get("frames") or manifest.get("manualReviewQueue", [])
    if arguments.candidate_index:
        requested = set(arguments.candidate_index)
        frames = [frame for frame in frames if frame.get("candidateIndex") in requested]
    if arguments.start_frame < 1:
        raise ValueError("Start frame must be at least one")
    end_frame = arguments.end_frame if arguments.end_frame is not None else len(frames)
    if end_frame < arguments.start_frame:
        raise ValueError("End frame must be at or after start frame")
    frames = frames[arguments.start_frame - 1 : end_frame]
    if not frames:
        raise ValueError("Frame manifest contains no frames")
    if "frameSizePixels" in manifest:
        source_width, source_height = manifest["frameSizePixels"]
    elif "width" in frames[0] and "height" in frames[0]:
        source_width, source_height = frames[0]["width"], frames[0]["height"]
    elif "videoMetadata" in manifest:
        metadata = manifest["videoMetadata"]
        source_width, source_height = metadata["width"], metadata["height"]
    else:
        first_image_path = (
            frames[0].get("file")
            or frames[0].get("outputPath")
            or frames[0].get("thumbnailPath")
        )
        if not first_image_path:
            raise ValueError("First frame has no image path")
        with Image.open(first_image_path) as first_image:
            source_width, source_height = first_image.size
    right = arguments.right if arguments.right is not None else source_width
    bottom = arguments.bottom if arguments.bottom is not None else source_height
    if not (
        0 <= arguments.left < right <= source_width
        and 0 <= arguments.top < bottom <= source_height
    ):
        raise ValueError("Crop is outside the source frame")
    crop_width = right - arguments.left
    crop_height = bottom - arguments.top
    thumbnail_height = round(crop_height / crop_width * arguments.thumbnail_width)
    label_height = 34
    rows = math.ceil(len(frames) / arguments.columns)
    sheet = Image.new(
        "RGB",
        (
            arguments.columns * arguments.thumbnail_width,
            rows * (thumbnail_height + label_height),
        ),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    for index, frame in enumerate(frames):
        image_path = (
            frame.get("file")
            or frame.get("outputPath")
            or frame.get("thumbnailPath")
        )
        if not image_path:
            raise ValueError(f"Frame {index + 1} has no image path")
        image = Image.open(image_path).convert("RGB")
        if image.size != (source_width, source_height):
            raise ValueError(
                f"Frame {index + 1} dimensions {image.size} differ from "
                f"{(source_width, source_height)}"
            )
        image = image.crop((arguments.left, arguments.top, right, bottom))
        image = image.resize(
            (arguments.thumbnail_width, thumbnail_height),
            Image.Resampling.LANCZOS,
        )
        column = index % arguments.columns
        row = index // arguments.columns
        x_value = column * arguments.thumbnail_width
        y_value = row * (thumbnail_height + label_height)
        sheet.paste(image, (x_value, y_value + label_height))
        checksum = (
            frame.get("sha256")
            or frame.get("fileSha256")
            or frame.get("outputPngSha256")
            or "unknown"
        )
        if "candidateIndex" in frame:
            altitude = frame.get("solarPosition", {}).get("altitudeDegrees")
            altitude_label = f"  alt {altitude:.2f}" if altitude is not None else ""
            captured = frame.get("eventMidpointTime", "")
            captured_label = f"  {captured[:16]}Z" if captured else ""
            label = (
                f"candidate {frame['candidateIndex']:03d} / sample {frame.get('sampleIndex', 0):03d}"
                f"{captured_label}{altitude_label}  {checksum[:12]}"
            )
        else:
            seconds = frame.get("actualSeconds", frame.get("seconds"))
            if seconds is None:
                raise ValueError(f"Frame {index + 1} has no timestamp")
            label = f"{index + 1}: {seconds:.2f}s  {checksum[:12]}"
        draw.text((x_value + 8, y_value + 9), label, fill="black")
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(arguments.output, format="PNG", optimize=True)
    print(json.dumps({
        "output": str(arguments.output),
        "frameCount": len(frames),
        "dimensions": [sheet.width, sheet.height],
        "crop": [arguments.left, arguments.top, right, bottom],
    }, indent=2))


if __name__ == "__main__":
    main()

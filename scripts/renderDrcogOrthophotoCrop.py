#!/usr/bin/env python3
"""Render a georeferenced crop from a checksum-locked DRCOG orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image


ANALYSIS_VERSION = "drcog-orthophoto-crop-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--center-x", type=float, required=True)
    parser.add_argument("--center-y", type=float, required=True)
    parser.add_argument("--half-width-feet", type=float, required=True)
    parser.add_argument("--half-height-feet", type=float, required=True)
    parser.add_argument("--output-image", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args()

    manifest_bytes = args.manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactKind") != "drcog-orthophoto-tile-acquisition":
        raise ValueError("Input manifest is not a DRCOG orthophoto acquisition")
    world = manifest.get("worldFile", {}).get("values")
    if not isinstance(world, list) or len(world) != 6:
        raise ValueError("Acquisition manifest lacks a six-value world file")
    pixel_width, row_rotation, column_rotation, pixel_height, upper_left_x, upper_left_y = (
        float(value) for value in world
    )
    if row_rotation != 0 or column_rotation != 0 or pixel_width <= 0 or pixel_height >= 0:
        raise ValueError("Only north-up orthophotos are supported")

    tif_path = Path(manifest["localFiles"]["orthophoto"])
    source_hash = sha256_file(tif_path)
    if source_hash != manifest.get("orthophoto", {}).get("sha256"):
        raise ValueError("Orthophoto hash does not match the acquisition manifest")

    minimum_x = args.center_x - args.half_width_feet
    maximum_x = args.center_x + args.half_width_feet
    minimum_y = args.center_y - args.half_height_feet
    maximum_y = args.center_y + args.half_height_feet
    left = math.floor((minimum_x - upper_left_x) / pixel_width)
    right = math.ceil((maximum_x - upper_left_x) / pixel_width)
    top = math.floor((maximum_y - upper_left_y) / pixel_height)
    bottom = math.ceil((minimum_y - upper_left_y) / pixel_height)

    Image.MAX_IMAGE_PIXELS = None
    with Image.open(tif_path) as source:
        if left < 0 or top < 0 or right > source.width or bottom > source.height:
            raise ValueError("Requested crop extends outside the source orthophoto")
        crop = source.crop((left, top, right, bottom)).convert("RGB")
        args.output_image.parent.mkdir(parents=True, exist_ok=True)
        crop.save(args.output_image, format="PNG", optimize=True)

    actual_bounds = {
        "minimumX": upper_left_x + left * pixel_width,
        "maximumX": upper_left_x + right * pixel_width,
        "minimumY": upper_left_y + bottom * pixel_height,
        "maximumY": upper_left_y + top * pixel_height,
    }
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": manifest.get("stadiumId"),
        "source": {
            "manifestPath": str(args.manifest.resolve()),
            "manifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "artifactVersion": manifest.get("artifactVersion"),
            "orthophotoPath": str(tif_path.resolve()),
            "orthophotoSha256": source_hash,
        },
        "requestedCenter": [args.center_x, args.center_y],
        "requestedHalfWidthFeet": args.half_width_feet,
        "requestedHalfHeightFeet": args.half_height_feet,
        "pixelWindow": {"left": left, "top": top, "right": right, "bottom": bottom},
        "pixelDimensions": {"width": right - left, "height": bottom - top},
        "projectedBoundsFeet": actual_bounds,
        "pixelSizeFeet": [pixel_width, pixel_height],
        "outputImage": {
            "path": str(args.output_image.resolve()),
            "sha256": sha256_file(args.output_image),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "drcog-orthophoto-crop",
        "artifactVersion": "sha256:" + stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesGeoreferencedPixelGrid": True,
            "establishesSubFootHorizontalAccuracy": False,
            "establishesElevatedRowCoordinates": False,
            "note": "This crop preserves source georeferencing but adds no accuracy claim.",
        },
        "publication": {
            "eligible": False,
            "blockers": manifest.get("publication", {}).get("blockers", []),
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(artifact, indent=2))


if __name__ == "__main__":
    main()

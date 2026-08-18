#!/usr/bin/env python3
"""Render a conservative LiDAR roof primitive over a georeferenced orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw
from pyproj import Transformer


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    serialized = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(serialized).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("primitive_json", type=Path)
    parser.add_argument("primitive_npz", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("orthophoto_metadata", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--row-crs", default="EPSG:6347")
    parser.add_argument("--padding-pixels", type=int, default=180)
    arguments = parser.parse_args()

    primitive = json.loads(arguments.primitive_json.read_text(encoding="utf-8"))
    metadata = json.loads(arguments.orthophoto_metadata.read_text(encoding="utf-8"))
    with np.load(arguments.primitive_npz, allow_pickle=False) as arrays:
        mask = arrays["mask"].astype(bool)
        enclosed_gap_mask = (
            arrays["enclosed_gap_mask"].astype(bool)
            if "enclosed_gap_mask" in arrays.files
            else np.zeros_like(mask, dtype=bool)
        )
        minimum_x = float(arrays["minimum_x_metres"][0])
        minimum_y = float(arrays["minimum_y_metres"][0])
        cell_metres = float(arrays["cell_metres"][0])
    expected_npz_sha = primitive["footprint"]["npzSha256"]
    actual_npz_sha = sha256_file(arguments.primitive_npz)
    if expected_npz_sha != actual_npz_sha:
        raise ValueError("Primitive NPZ checksum mismatch")
    image = Image.open(arguments.orthophoto).convert("RGBA")
    if [image.width, image.height] != metadata["imageDimensions"]:
        raise ValueError("Orthophoto dimensions do not match metadata")
    extent = metadata["imageExtent"]
    transformer = Transformer.from_crs(
        arguments.row_crs,
        extent["coordinateReferenceSystem"],
        always_xy=True,
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

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, mode="RGBA")
    rendered_pixels: list[tuple[float, float]] = []
    for row, column in np.argwhere(mask):
        easting = minimum_x + (float(column) + 0.5) * cell_metres
        northing = minimum_y + (float(row) + 0.5) * cell_metres
        pixel_value = pixel(easting, northing)
        rendered_pixels.append(pixel_value)
        is_enclosed_gap = bool(enclosed_gap_mask[row, column])
        draw.rectangle(
            (
                pixel_value[0] - 1.8,
                pixel_value[1] - 1.8,
                pixel_value[0] + 1.8,
                pixel_value[1] + 1.8,
            ),
            fill=(255, 150, 0, 175) if is_enclosed_gap else (0, 220, 120, 125),
        )
    annotated = Image.alpha_composite(image, overlay)
    if "seed" in primitive:
        seed = primitive["seed"]["eastingNorthingElevationMetres"]
        seed_pixel = pixel(float(seed[0]), float(seed[1]))
        annotated_draw = ImageDraw.Draw(annotated, mode="RGBA")
        annotated_draw.ellipse(
            (
                seed_pixel[0] - 11,
                seed_pixel[1] - 11,
                seed_pixel[0] + 11,
                seed_pixel[1] + 11,
            ),
            fill=(255, 210, 0, 255),
            outline=(20, 20, 20, 255),
            width=3,
        )
    crop_left = max(0, int(min(value[0] for value in rendered_pixels)) - arguments.padding_pixels)
    crop_top = max(0, int(min(value[1] for value in rendered_pixels)) - arguments.padding_pixels)
    crop_right = min(image.width, int(max(value[0] for value in rendered_pixels)) + arguments.padding_pixels)
    crop_bottom = min(image.height, int(max(value[1] for value in rendered_pixels)) + arguments.padding_pixels)
    arguments.output_png.parent.mkdir(parents=True, exist_ok=True)
    annotated.crop((crop_left, crop_top, crop_right, crop_bottom)).convert("RGB").save(
        arguments.output_png, format="PNG", optimize=True
    )

    stable = {
        "primitiveJsonSha256": sha256_file(arguments.primitive_json),
        "primitiveNpzSha256": actual_npz_sha,
        "orthophotoSha256": sha256_file(arguments.orthophoto),
        "orthophotoMetadataSha256": sha256_file(arguments.orthophoto_metadata),
        "renderedCellCount": len(rendered_pixels),
        "renderedEnclosedGapCellCount": int(np.count_nonzero(enclosed_gap_mask)),
        "cropBoxPixels": [crop_left, crop_top, crop_right, crop_bottom],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "roof-primitive-orthophoto-registration",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "primitiveJson": {"path": str(arguments.primitive_json), "sha256": stable["primitiveJsonSha256"]},
            "primitiveNpz": {"path": str(arguments.primitive_npz), "sha256": stable["primitiveNpzSha256"]},
            "orthophoto": {"path": str(arguments.orthophoto), "sha256": stable["orthophotoSha256"]},
            "orthophotoMetadata": {"path": str(arguments.orthophoto_metadata), "sha256": stable["orthophotoMetadataSha256"]},
        },
        "sourceYear": metadata["source"]["sourceYear"],
        "sourceServiceUrl": metadata["source"]["serviceUrl"],
        "renderedCellCount": len(rendered_pixels),
        "renderedEnclosedGapCellCount": stable["renderedEnclosedGapCellCount"],
        "cropBoxPixels": stable["cropBoxPixels"],
        "outputPng": str(arguments.output_png),
        "assessment": {
            "publicationEligibleByItself": False,
            "interpretation": "Registration evidence only. Semantic opacity and currentness require explicit classification across independent sources.",
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputPng": str(arguments.output_png),
        "outputJson": str(arguments.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "sourceYear": artifact["sourceYear"],
        "renderedCellCount": artifact["renderedCellCount"],
        "cropBoxPixels": artifact["cropBoxPixels"],
    }, indent=2))


if __name__ == "__main__":
    main()

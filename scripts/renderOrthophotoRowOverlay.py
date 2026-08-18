#!/usr/bin/env python3
"""Render georeferenced row polygons over an authoritative orthophoto export."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw
from pyproj import Transformer


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("row_control", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--xmin", type=float, required=True)
    parser.add_argument("--ymin", type=float, required=True)
    parser.add_argument("--xmax", type=float, required=True)
    parser.add_argument("--ymax", type=float, required=True)
    parser.add_argument("--image-crs", default="EPSG:4269")
    parser.add_argument("--row-crs", default="EPSG:6347")
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--source-year", type=int, required=True)
    arguments = parser.parse_args()

    if arguments.xmax <= arguments.xmin or arguments.ymax <= arguments.ymin:
        raise ValueError("Invalid image extent")
    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    if control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")

    image = Image.open(arguments.orthophoto).convert("RGBA")
    draw = ImageDraw.Draw(image, mode="RGBA")
    transformer = Transformer.from_crs(
        arguments.row_crs, arguments.image_crs, always_xy=True
    )
    rendered_rings = 0
    coordinates_rendered = 0
    for feature in control["features"]:
        for ring in feature.get("geometry", {}).get("rings", []):
            pixels = []
            for easting, northing in ring:
                longitude, latitude = transformer.transform(easting, northing)
                pixel_x = (
                    (longitude - arguments.xmin)
                    / (arguments.xmax - arguments.xmin)
                    * image.width
                )
                pixel_y = (
                    (arguments.ymax - latitude)
                    / (arguments.ymax - arguments.ymin)
                    * image.height
                )
                pixels.append((pixel_x, pixel_y))
            if len(pixels) >= 2:
                draw.line(pixels, fill=(255, 25, 25, 210), width=2, joint="curve")
                rendered_rings += 1
                coordinates_rendered += len(pixels)

    arguments.output_png.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(arguments.output_png, format="PNG", optimize=True)
    stable = {
        "orthophotoSha256": sha256_file(arguments.orthophoto),
        "rowControlArtifactVersion": control["artifactVersion"],
        "imageExtent": {
            "xmin": arguments.xmin,
            "ymin": arguments.ymin,
            "xmax": arguments.xmax,
            "ymax": arguments.ymax,
            "coordinateReferenceSystem": arguments.image_crs,
        },
        "rowCoordinateReferenceSystem": arguments.row_crs,
        "imageDimensions": [image.width, image.height],
        "renderedRings": rendered_rings,
        "coordinatesRendered": coordinates_rendered,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "orthophoto-row-registration-overlay",
        "artifactVersion": artifact_version,
        "stadiumId": control["stadiumId"],
        "source": {
            "serviceUrl": arguments.source_url,
            "sourceYear": arguments.source_year,
            "orthophotoPath": str(arguments.orthophoto),
            "orthophotoSha256": stable["orthophotoSha256"],
            "rowControlArtifactVersion": control["artifactVersion"],
        },
        "imageExtent": stable["imageExtent"],
        "rowCoordinateReferenceSystem": arguments.row_crs,
        "imageDimensions": stable["imageDimensions"],
        "renderedRings": rendered_rings,
        "coordinatesRendered": coordinates_rendered,
        "outputPng": str(arguments.output_png),
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                "OVERLAY_REQUIRES_QUANTITATIVE_REGISTRATION_HOLDOUT",
                "ORTHOPHOTO_OCCLUDED_BY_SHADOWS_AND_ROOFS",
                "ROW_CONTROL_CURRENCY_NOT_VERIFIED",
            ],
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputPng": str(arguments.output_png),
        "outputJson": str(arguments.output_json),
        "artifactVersion": artifact_version,
        "renderedRings": rendered_rings,
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Stitch four native ArcGIS orthophoto exports with a verified manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


ANALYSIS_VERSION = "arcgis-native-orthophoto-quadrants-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    for name in ("nw", "ne", "sw", "se"):
        parser.add_argument(f"--{name}", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--service-url", required=True)
    parser.add_argument("--object-id", type=int, required=True)
    parser.add_argument("--item-name", required=True)
    parser.add_argument("--item-metadata", type=Path, required=True)
    parser.add_argument("--ground-condition-date", required=True)
    parser.add_argument("--xmin", type=float, required=True)
    parser.add_argument("--ymin", type=float, required=True)
    parser.add_argument("--xmax", type=float, required=True)
    parser.add_argument("--ymax", type=float, required=True)
    parser.add_argument("--crs", type=int, required=True)
    return parser.parse_args()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    arguments = parse_args()
    if not (arguments.xmax > arguments.xmin and arguments.ymax > arguments.ymin):
        raise ValueError("extent is invalid")
    if not arguments.item_metadata.is_file():
        raise FileNotFoundError(arguments.item_metadata)

    paths = {
        name: getattr(arguments, name)
        for name in ("nw", "ne", "sw", "se")
    }
    images: dict[str, Image.Image] = {}
    try:
        for name, path in paths.items():
            if not path.is_file():
                raise FileNotFoundError(path)
            images[name] = Image.open(path).convert("RGB")
        dimensions = {image.size for image in images.values()}
        if len(dimensions) != 1:
            raise ValueError(f"quadrant dimension mismatch: {sorted(dimensions)}")
        quadrant_width, quadrant_height = next(iter(dimensions))
        if quadrant_width <= 0 or quadrant_height <= 0:
            raise ValueError("quadrants must be nonempty")

        combined = Image.new("RGB", (quadrant_width * 2, quadrant_height * 2))
        combined.paste(images["nw"], (0, 0))
        combined.paste(images["ne"], (quadrant_width, 0))
        combined.paste(images["sw"], (0, quadrant_height))
        combined.paste(images["se"], (quadrant_width, quadrant_height))
        arguments.output.parent.mkdir(parents=True, exist_ok=True)
        combined.save(arguments.output, format="PNG", optimize=True)

        width, height = combined.size
        pixel_size_x = (arguments.xmax - arguments.xmin) / width
        pixel_size_y = (arguments.ymax - arguments.ymin) / height
        quadrant_records = []
        midpoint_x = (arguments.xmin + arguments.xmax) / 2.0
        midpoint_y = (arguments.ymin + arguments.ymax) / 2.0
        quadrant_extents = {
            "nw": [arguments.xmin, midpoint_y, midpoint_x, arguments.ymax],
            "ne": [midpoint_x, midpoint_y, arguments.xmax, arguments.ymax],
            "sw": [arguments.xmin, arguments.ymin, midpoint_x, midpoint_y],
            "se": [midpoint_x, arguments.ymin, arguments.xmax, midpoint_y],
        }
        for name in ("nw", "ne", "sw", "se"):
            quadrant_records.append({
                "quadrant": name,
                "path": str(paths[name]),
                "sha256": sha256_file(paths[name]),
                "dimensionsPixels": [quadrant_width, quadrant_height],
                "extent": quadrant_extents[name],
            })

        stable_payload = {
            "analysisVersion": ANALYSIS_VERSION,
            "stadiumId": arguments.stadium_id,
            "source": {
                "provider": "Miami-Dade County ArcGIS ImageServer",
                "serviceUrl": arguments.service_url.rstrip("/"),
                "objectId": arguments.object_id,
                "itemName": arguments.item_name,
                "itemMetadataPath": str(arguments.item_metadata),
                "itemMetadataSha256": sha256_file(arguments.item_metadata),
                "groundConditionDate": arguments.ground_condition_date,
                "resampling": "nearest-neighbor",
                "quadrants": quadrant_records,
            },
            "raster": {
                "path": str(arguments.output),
                "sha256": sha256_file(arguments.output),
                "decodedRgbPixelsSha256": sha256_bytes(combined.tobytes()),
                "dimensionsPixels": [width, height],
                "extent": {
                    "xmin": arguments.xmin,
                    "ymin": arguments.ymin,
                    "xmax": arguments.xmax,
                    "ymax": arguments.ymax,
                },
                "coordinateReferenceSystem": f"EPSG:{arguments.crs}",
                "pixelSizeX": pixel_size_x,
                "pixelSizeY": pixel_size_y,
            },
        }
        artifact_version = "sha256:" + sha256_bytes(
            json.dumps(stable_payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
        )
        artifact = {
            "schemaVersion": 1,
            "artifactKind": "official-native-orthophoto-mosaic",
            "artifactVersion": artifact_version,
            **stable_payload,
            "publication": {
                "eligibleByItself": False,
                "blockers": [
                    "SOURCE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT",
                    "ORTHOPHOTO_IS_TWO_DIMENSIONAL",
                    "SEMANTIC_ROW_AND_OBSTRUCTION_GEOMETRY_NOT_EXTRACTED",
                    "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
                ],
            },
        }
        arguments.manifest.parent.mkdir(parents=True, exist_ok=True)
        arguments.manifest.write_text(
            json.dumps(artifact, indent=2) + "\n", encoding="utf-8"
        )
        print(json.dumps({
            "output": str(arguments.output),
            "manifest": str(arguments.manifest),
            "artifactVersion": artifact_version,
            "rasterSha256": stable_payload["raster"]["sha256"],
            "decodedRgbPixelsSha256": stable_payload["raster"]["decodedRgbPixelsSha256"],
            "dimensionsPixels": [width, height],
            "pixelSize": [pixel_size_x, pixel_size_y],
            "publicationEligible": False,
        }, indent=2))
    finally:
        for image in images.values():
            image.close()


if __name__ == "__main__":
    main()

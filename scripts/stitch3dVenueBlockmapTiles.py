#!/usr/bin/env python3
"""Stitch a captured 3D Digital Venue block-map tile level.

The output is a lossless crop covering every captured tile at the selected
level. The companion artifact records the crop's exact relationship to the
block-map SVG coordinate system so later registration is reproducible.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from PIL import Image


TILE_PATTERN = re.compile(
    r"/tilemap/(?P<size>\d+)/(?P<level>\d+)/(?P<x>\d+)_(?P<y>\d+)\."
    r"(?P<extension>jpe?g|png)(?:[?#]|$)",
    re.IGNORECASE,
)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def artifact_version(stable: dict[str, Any]) -> str:
    payload = json.dumps(stable, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{sha256_bytes(payload)}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--acquisition", type=Path, required=True)
    parser.add_argument("--map-manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--artifact", type=Path, required=True)
    parser.add_argument("--level", type=int)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    acquisition_bytes = args.acquisition.read_bytes()
    acquisition = json.loads(acquisition_bytes)
    if acquisition.get("artifactKind") != "venue-blockmap-tile-acquisition":
        raise ValueError("Acquisition is not a venue-blockmap-tile-acquisition")
    map_manifest_bytes = args.map_manifest.read_bytes()
    map_manifest = json.loads(map_manifest_bytes)
    tile_layer = next(
        layer
        for layer in map_manifest["layers"]["static"]
        if layer.get("t") == "tilemap"
    )
    view_width = float(tile_layer["bb"][2])
    view_height = float(tile_layer["bb"][3])

    parsed_tiles: list[dict[str, Any]] = []
    for tile in acquisition["tiles"]:
        match = TILE_PATTERN.search(tile["url"])
        if not match:
            continue
        parsed_tiles.append({
            **tile,
            "tileSize": int(match.group("size")),
            "level": int(match.group("level")),
            "x": int(match.group("x")),
            "y": int(match.group("y")),
        })
    if not parsed_tiles:
        raise ValueError("No parseable tile URLs are present")
    level = args.level if args.level is not None else max(tile["level"] for tile in parsed_tiles)
    level_tiles = [tile for tile in parsed_tiles if tile["level"] == level]
    if not level_tiles:
        raise ValueError(f"No captured tiles are present at level {level}")
    by_coordinate = {(tile["x"], tile["y"]): tile for tile in level_tiles}
    remaining = set(by_coordinate)
    components: list[set[tuple[int, int]]] = []
    while remaining:
        seed = remaining.pop()
        component = {seed}
        pending = [seed]
        while pending:
            x, y = pending.pop()
            for neighbour in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if neighbour in remaining:
                    remaining.remove(neighbour)
                    component.add(neighbour)
                    pending.append(neighbour)
        components.append(component)
    components.sort(key=lambda value: (-len(value), min(value)))
    selected_coordinates = components[0]
    selected = [by_coordinate[coordinate] for coordinate in selected_coordinates]
    excluded = [
        by_coordinate[coordinate]
        for component in components[1:]
        for coordinate in component
    ]
    tile_sizes = {tile["tileSize"] for tile in selected}
    if len(tile_sizes) != 1:
        raise ValueError("Selected tiles do not share one pixel size")
    tile_size = tile_sizes.pop()
    maximum_depth = int(tile_layer["d"])
    if not 0 <= level < maximum_depth:
        raise ValueError(f"Level {level} is outside declared depth {maximum_depth}")

    minimum_x = min(tile["x"] for tile in selected)
    maximum_x = max(tile["x"] for tile in selected)
    minimum_y = min(tile["y"] for tile in selected)
    maximum_y = max(tile["y"] for tile in selected)
    output_width = (maximum_x - minimum_x + 1) * tile_size
    output_height = (maximum_y - minimum_y + 1) * tile_size
    stitched = Image.new("RGB", (output_width, output_height), (242, 242, 242))
    acquisition_root = args.acquisition.parent
    placed = []
    for tile in selected:
        tile_path = acquisition_root / tile["file"]
        tile_bytes = tile_path.read_bytes()
        actual_hash = sha256_bytes(tile_bytes)
        if actual_hash != tile["sha256"]:
            raise ValueError(f"Tile hash mismatch: {tile_path}")
        with Image.open(tile_path) as source:
            image = source.convert("RGB")
            if image.size != (tile_size, tile_size):
                raise ValueError(f"Unexpected tile dimensions: {tile_path} {image.size}")
            pixel_x = (tile["x"] - minimum_x) * tile_size
            pixel_y = (tile["y"] - minimum_y) * tile_size
            stitched.paste(image, (pixel_x, pixel_y))
        placed.append({
            "x": tile["x"],
            "y": tile["y"],
            "sha256": tile["sha256"],
            "sourceFile": tile["file"],
        })

    logical_units_per_pixel_x = view_width / (tile_size * (2 ** level))
    logical_units_per_pixel_y = view_height / (tile_size * (2 ** level))
    if abs(logical_units_per_pixel_x - logical_units_per_pixel_y) > 1e-12:
        raise ValueError("Block-map pixels are not square in logical coordinates")
    logical_units_per_pixel = logical_units_per_pixel_x
    args.output.parent.mkdir(parents=True, exist_ok=True)
    stitched.save(args.output, format="PNG", optimize=True)
    output_bytes = args.output.read_bytes()

    stable = {
        "inputs": {
            "acquisition": {
                "path": str(args.acquisition),
                "sha256": sha256_bytes(acquisition_bytes),
                "artifactVersion": acquisition["artifactVersion"],
            },
            "mapManifest": {
                "path": str(args.map_manifest),
                "sha256": sha256_bytes(map_manifest_bytes),
            },
        },
        "acquisition": {
            "path": str(args.acquisition),
            "sha256": sha256_bytes(acquisition_bytes),
            "artifactVersion": acquisition["artifactVersion"],
        },
        "mapManifest": {
            "path": str(args.map_manifest),
            "sha256": sha256_bytes(map_manifest_bytes),
        },
        "stadiumId": acquisition["stadiumId"],
        "venueId": acquisition["venueId"],
        "level": level,
        "declaredMaximumDepth": maximum_depth,
        "tileSizePixels": tile_size,
        "capturedTileBounds": {
            "minimumX": minimum_x,
            "maximumX": maximum_x,
            "minimumY": minimum_y,
            "maximumY": maximum_y,
        },
        "logicalCoordinateTransform": {
            "viewWidth": view_width,
            "viewHeight": view_height,
            "cropOriginX": minimum_x * tile_size * logical_units_per_pixel,
            "cropOriginY": minimum_y * tile_size * logical_units_per_pixel,
            "logicalUnitsPerPixel": logical_units_per_pixel,
            "pixelCenterConvention": "logical = cropOrigin + (pixel + 0.5) * scale",
        },
        "output": {
            "path": str(args.output),
            "widthPixels": output_width,
            "heightPixels": output_height,
            "byteLength": len(output_bytes),
            "sha256": sha256_bytes(output_bytes),
        },
        "tiles": sorted(placed, key=lambda item: (item["y"], item["x"])),
        "excludedDisconnectedTiles": sorted(
            [
                {"x": tile["x"], "y": tile["y"], "sha256": tile["sha256"]}
                for tile in excluded
            ],
            key=lambda item: (item["y"], item["x"]),
        ),
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "venue-blockmap-tile-stitch",
        "artifactVersion": artifact_version(stable),
        **stable,
        "publication": {
            "eligible": False,
            "blockers": [
                "PROVIDER_BLOCKMAP_IS_NOT_SURVEY_CONTROL",
                "PROVIDER_ORIGIN_NOT_INDEPENDENTLY_VALIDATED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.artifact.parent.mkdir(parents=True, exist_ok=True)
    args.artifact.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifact": str(args.artifact),
        "artifactVersion": artifact["artifactVersion"],
        "level": level,
        "tileCount": len(placed),
        "excludedDisconnectedTileCount": len(excluded),
        "dimensions": [output_width, output_height],
        "logicalUnitsPerPixel": logical_units_per_pixel,
        "logicalCropOrigin": [
            stable["logicalCoordinateTransform"]["cropOriginX"],
            stable["logicalCoordinateTransform"]["cropOriginY"],
        ],
    }, indent=2))


if __name__ == "__main__":
    main()

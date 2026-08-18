#!/usr/bin/env python3
"""Acquire and stitch one checksum-locked krpano cube-map level."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib
import json
import math
from pathlib import Path
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from PIL import Image


FACE_CODES = ("f", "r", "b", "l", "u", "d")


def sha256_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def validate_jpeg(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        if image.format != "JPEG":
            raise ValueError(f"Expected JPEG tile at {path}, got {image.format}")
        image.load()
        return image.size


def download_tile(url: str, path: Path, retries: int) -> dict[str, object]:
    if path.exists():
        width, height = validate_jpeg(path)
        return {
            "path": str(path),
            "sha256": sha256_file(path),
            "width": width,
            "height": height,
            "reused": True,
        }

    request = Request(url, headers={"User-Agent": "mlb-sun-tracker-research/1.0"})
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            with urlopen(request, timeout=45) as response:
                content = response.read()
                if response.status != 200:
                    raise ValueError(f"Unexpected HTTP {response.status} for {url}")
            if not content:
                raise ValueError(f"Empty response for {url}")
            path.parent.mkdir(parents=True, exist_ok=True)
            partial = path.with_suffix(path.suffix + ".part")
            partial.write_bytes(content)
            width, height = validate_jpeg(partial)
            partial.replace(path)
            return {
                "path": str(path),
                "sha256": sha256_bytes(content),
                "width": width,
                "height": height,
                "reused": False,
            }
        except (HTTPError, URLError, OSError, ValueError) as error:
            last_error = error
            if attempt < retries:
                time.sleep(min(2**attempt, 8))
    raise RuntimeError(f"Failed to acquire {url}: {last_error}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tileset", required=True)
    parser.add_argument("--level", type=int, required=True)
    parser.add_argument("--dimension", type=int, required=True)
    parser.add_argument("--output-directory", type=Path, required=True)
    parser.add_argument("--faces", nargs="+", choices=FACE_CODES, default=list(FACE_CODES))
    parser.add_argument("--tile-size", type=int, default=512)
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument("--source-page-url", required=True)
    parser.add_argument("--source-manifest-url", required=True)
    parser.add_argument("--project-id", required=True)
    parser.add_argument("--scene-id", required=True)
    parser.add_argument("--capture-window-label", required=True)
    arguments = parser.parse_args()

    if arguments.level < 1 or arguments.dimension < 1 or arguments.tile_size < 1:
        raise ValueError("Level, dimension, and tile size must be positive")
    if arguments.workers < 1 or arguments.retries < 1:
        raise ValueError("Workers and retries must be positive")

    output_directory = arguments.output_directory.resolve()
    tile_count_axis = math.ceil(arguments.dimension / arguments.tile_size)
    tasks: list[tuple[str, int, int, str, Path]] = []
    base_url = f"https://s3.amazonaws.com/tile-sets/{arguments.tileset}"
    for face in arguments.faces:
        for vertical in range(1, tile_count_axis + 1):
            for horizontal in range(1, tile_count_axis + 1):
                filename = f"l{arguments.level}_{face}_{vertical}_{horizontal}.jpg"
                tasks.append((
                    face,
                    vertical,
                    horizontal,
                    f"{base_url}/{filename}",
                    output_directory / "tiles" / face / f"{vertical}_{horizontal}.jpg",
                ))

    results: list[dict[str, object]] = []
    with ThreadPoolExecutor(max_workers=arguments.workers) as executor:
        futures = {
            executor.submit(download_tile, url, path, arguments.retries): (
                face,
                vertical,
                horizontal,
                url,
            )
            for face, vertical, horizontal, url, path in tasks
        }
        for future in as_completed(futures):
            face, vertical, horizontal, url = futures[future]
            result = future.result()
            results.append({
                "face": face,
                "vertical": vertical,
                "horizontal": horizontal,
                "url": url,
                **result,
            })

    results.sort(key=lambda item: (
        FACE_CODES.index(str(item["face"])),
        int(item["vertical"]),
        int(item["horizontal"]),
    ))
    faces: list[dict[str, object]] = []
    for face in arguments.faces:
        face_tiles = [tile for tile in results if tile["face"] == face]
        mosaic = Image.new(
            "RGB",
            (tile_count_axis * arguments.tile_size, tile_count_axis * arguments.tile_size),
            "black",
        )
        for tile in face_tiles:
            with Image.open(str(tile["path"])) as image:
                mosaic.paste(
                    image.convert("RGB"),
                    (
                        (int(tile["horizontal"]) - 1) * arguments.tile_size,
                        (int(tile["vertical"]) - 1) * arguments.tile_size,
                    ),
                )
        mosaic = mosaic.crop((0, 0, arguments.dimension, arguments.dimension))
        face_path = output_directory / f"level-{arguments.level}-{face}.jpg"
        face_path.parent.mkdir(parents=True, exist_ok=True)
        mosaic.save(face_path, format="JPEG", quality=95, subsampling=0)
        faces.append({
            "face": face,
            "path": str(face_path),
            "sha256": sha256_file(face_path),
            "width": mosaic.width,
            "height": mosaic.height,
            "tileCount": len(face_tiles),
        })

    manifest = {
        "artifactVersion": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": {
            "pageUrl": arguments.source_page_url,
            "manifestUrl": arguments.source_manifest_url,
            "projectId": arguments.project_id,
            "sceneId": arguments.scene_id,
            "tileset": arguments.tileset,
            "captureWindowLabel": arguments.capture_window_label,
            "captureWindowBasis": "tileset identifier",
            "captureTimezoneVerified": False,
            "perTileCaptureTimeVerified": False,
        },
        "eligibility": {
            "timestampUncertaintyMaximumSeconds": 30,
            "eligibleAsStrictTimestampHoldout": False,
            "reason": (
                "The tileset identifier spans ten minutes and neither its timezone nor "
                "per-tile capture time is independently verified."
            ),
            "permittedUse": "structural row-label and panorama registration evidence only",
        },
        "cube": {
            "level": arguments.level,
            "dimensionPixelsPerFace": arguments.dimension,
            "tileSizePixels": arguments.tile_size,
            "tileCountPerAxis": tile_count_axis,
            "faceCodes": arguments.faces,
        },
        "faces": faces,
        "tiles": results,
    }
    manifest_path = output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifest": str(manifest_path),
        "faces": faces,
        "tileCount": len(results),
        "reusedTileCount": sum(bool(tile["reused"]) for tile in results),
    }, indent=2))


if __name__ == "__main__":
    main()

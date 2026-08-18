#!/usr/bin/env python3
"""Render registered venue-local metric rows over a georeferenced orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("registration", type=Path)
    parser.add_argument("orthophoto_manifest", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    venue = json.loads(arguments.venue_rows.read_text(encoding="utf-8"))
    registration = json.loads(arguments.registration.read_text(encoding="utf-8"))
    imagery = json.loads(arguments.orthophoto_manifest.read_text(encoding="utf-8"))
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Invalid venue-row artifact")
    if registration.get("artifactKind") != "venue-row-to-lidar-registration-candidate":
        raise ValueError("Invalid venue registration artifact")
    if registration.get("venueArtifactVersion") != venue.get("artifactVersion"):
        raise ValueError("Registration does not match venue rows")
    if imagery.get("artifactKind") != "official-arcgis-orthophoto-export":
        raise ValueError("Invalid orthophoto manifest")
    image_path = Path(imagery["localImagePath"])
    if sha256_file(image_path) != imagery["export"]["sha256"]:
        raise ValueError("Orthophoto hash mismatch")
    if imagery["export"]["coordinateReferenceSystem"] != "EPSG:6347":
        raise ValueError("Renderer currently requires EPSG:6347 imagery")

    image = Image.open(image_path).convert("RGBA")
    draw = ImageDraw.Draw(image, "RGBA")
    extent = imagery["export"]["extent"]
    transform = registration["transform"]
    yaw = math.radians(transform["yawDegrees"])
    cosine = math.cos(yaw)
    sine = math.sin(yaw)

    def pixel(position: list[float]) -> tuple[float, float]:
        local_east, _, local_north = position
        easting = (
            cosine * local_east
            - sine * local_north
            + transform["eastTranslationMetres"]
        )
        northing = (
            sine * local_east
            + cosine * local_north
            + transform["northTranslationMetres"]
        )
        x = (easting - extent["xmin"]) / (extent["xmax"] - extent["xmin"]) * image.width
        y = (extent["ymax"] - northing) / (extent["ymax"] - extent["ymin"]) * image.height
        return x, y

    rendered_rows = 0
    rendered_anchors = 0
    for row in venue["rows"]:
        points = [pixel(anchor["position"]) for anchor in row["anchors"]]
        if len(points) < 2:
            continue
        color = (30, 144, 255, 225) if stable_holdout(str(row["sectionId"])) else (255, 45, 45, 210)
        draw.line(points, fill=color, width=2, joint="curve")
        for point in points:
            draw.ellipse(
                (point[0] - 1.5, point[1] - 1.5, point[0] + 1.5, point[1] + 1.5),
                fill=color,
            )
        rendered_rows += 1
        rendered_anchors += len(points)

    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(arguments.output, format="PNG", optimize=True)
    print(json.dumps({
        "output": str(arguments.output),
        "renderedRows": rendered_rows,
        "renderedAnchors": rendered_anchors,
        "transform": transform,
        "colors": {"control": "red", "holdout": "blue"},
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render candidate predicted rows over a georeferenced orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from pyproj import Transformer


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("registration", type=Path)
    parser.add_argument("overlay_metadata", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    registration = json.loads(arguments.registration.read_text(encoding="utf-8"))
    overlay = json.loads(arguments.overlay_metadata.read_text(encoding="utf-8"))
    image = Image.open(arguments.orthophoto).convert("RGB")
    extent = overlay["imageExtent"]
    transformer = Transformer.from_crs(
        "EPSG:6347",
        extent["coordinateReferenceSystem"],
        always_xy=True,
    )

    def to_pixel(point: list[float]) -> tuple[float, float]:
        longitude, latitude = transformer.transform(point[0], point[1])
        x = (longitude - extent["xmin"]) / (extent["xmax"] - extent["xmin"]) * image.width
        y = (extent["ymax"] - latitude) / (extent["ymax"] - extent["ymin"]) * image.height
        return x, y

    draw = ImageDraw.Draw(image, "RGBA")
    font = ImageFont.load_default()
    rows = registration["currentOnly"]["rows"]
    by_section: dict[str, list[dict]] = {}
    for row in rows:
        by_section.setdefault(row["sectionId"], []).append(row)
        ring = row["predictedHorizontalGeometry"]["rings"][0]
        pixels = [to_pixel(point) for point in ring]
        color = (0, 255, 255, 230) if row["insideDevelopmentControlHull"] else (255, 70, 70, 230)
        draw.line(pixels, fill=color, width=3, joint="curve")
    for section_id, section_rows in by_section.items():
        centers = [to_pixel(row["predictedHorizontalGeometry"]["centroidMetres"]) for row in section_rows]
        x = sum(point[0] for point in centers) / len(centers)
        y = sum(point[1] for point in centers) / len(centers)
        draw.text((x + 3, y + 3), section_id, font=font, fill=(0, 0, 0, 230), stroke_width=2, stroke_fill=(255, 255, 255, 230))
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(arguments.output)
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "predicted-row-orthophoto-overlay",
        "registrationArtifactVersion": registration["artifactVersion"],
        "orthophotoSha256": sha256_file(arguments.orthophoto),
        "outputSha256": sha256_file(arguments.output),
        "rowCount": len(rows),
        "sectionCount": len(by_section),
        "legend": {
            "cyan": "prediction inside development-control 3D hull",
            "red": "prediction outside development-control 3D hull",
        },
        "publicationEligible": False,
    }
    metadata_path = arguments.output.with_suffix(".json")
    metadata_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "metadata": str(metadata_path),
        **artifact,
    }, indent=2))


if __name__ == "__main__":
    main()

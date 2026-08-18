#!/usr/bin/env python3
"""Render diagnostic LiDAR column-hit locations over an orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw
from pyproj import Transformer


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("diagnostic", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("orthophoto_metadata", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--row-crs", default="EPSG:6347")
    parser.add_argument("--padding-pixels", type=int, default=220)
    arguments = parser.parse_args()

    diagnostic_bytes = arguments.diagnostic.read_bytes()
    metadata_bytes = arguments.orthophoto_metadata.read_bytes()
    diagnostic = json.loads(diagnostic_bytes)
    metadata = json.loads(metadata_bytes)
    image = Image.open(arguments.orthophoto).convert("RGBA")
    if [image.width, image.height] != metadata["imageDimensions"]:
        raise ValueError("Orthophoto dimensions differ from metadata")
    extent = metadata["imageExtent"]
    transformer = Transformer.from_crs(
        arguments.row_crs, extent["coordinateReferenceSystem"], always_xy=True
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

    colors = {
        "2025-03-31": (255, 130, 0, 170),
        "2025-04-03": (160, 80, 255, 170),
        "2025-07-04": (255, 40, 70, 170),
        "2025-08-06": (30, 180, 255, 170),
        "2025-09-28": (0, 220, 120, 170),
    }
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, mode="RGBA")
    rendered_pixels: list[tuple[float, float]] = []
    hit_count_by_date: dict[str, int] = defaultdict(int)
    clusters: dict[tuple[int, int], dict[str, Any]] = {}
    for result in diagnostic["results"]:
        date = result["midpointTime"][:10]
        color = colors.get(date, (255, 230, 0, 170))
        for row in result["rows"]:
            for seat in row["seats"]:
                if seat["classification"] != "diagnostic-column-hit":
                    continue
                easting = float(seat["entryEastingMetres"])
                northing = float(seat["entryNorthingMetres"])
                pixel_value = pixel(easting, northing)
                rendered_pixels.append(pixel_value)
                hit_count_by_date[date] += 1
                draw.ellipse(
                    (
                        pixel_value[0] - 3,
                        pixel_value[1] - 3,
                        pixel_value[0] + 3,
                        pixel_value[1] + 3,
                    ),
                    fill=color,
                    outline=(15, 15, 15, 120),
                    width=1,
                )
                key = (math.floor(easting), math.floor(northing))
                if key not in clusters:
                    clusters[key] = {
                        "oneMetreCellMinimumEastingNorthing": [key[0], key[1]],
                        "hitCount": 0,
                        "dates": set(),
                        "candidateIds": set(),
                        "rowKeys": set(),
                        "minimumDsmTopElevationMetresNavd88": float("inf"),
                        "maximumDsmTopElevationMetresNavd88": float("-inf"),
                    }
                cluster = clusters[key]
                cluster["hitCount"] += 1
                cluster["dates"].add(date)
                cluster["candidateIds"].add(result["candidateId"])
                cluster["rowKeys"].add(row["rowKey"])
                elevation = float(seat["entryDsmTopElevationMetresNavd88"])
                cluster["minimumDsmTopElevationMetresNavd88"] = min(
                    cluster["minimumDsmTopElevationMetresNavd88"], elevation
                )
                cluster["maximumDsmTopElevationMetresNavd88"] = max(
                    cluster["maximumDsmTopElevationMetresNavd88"], elevation
                )
    if not rendered_pixels:
        raise ValueError("Diagnostic contains no column hits")
    annotated = Image.alpha_composite(image, overlay)
    crop_left = max(0, int(min(value[0] for value in rendered_pixels)) - arguments.padding_pixels)
    crop_top = max(0, int(min(value[1] for value in rendered_pixels)) - arguments.padding_pixels)
    crop_right = min(
        image.width, int(max(value[0] for value in rendered_pixels)) + arguments.padding_pixels
    )
    crop_bottom = min(
        image.height, int(max(value[1] for value in rendered_pixels)) + arguments.padding_pixels
    )
    output_png = arguments.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    annotated.crop((crop_left, crop_top, crop_right, crop_bottom)).convert("RGB").save(
        output_png, format="PNG", optimize=True
    )
    serialized_clusters = []
    for cluster in sorted(clusters.values(), key=lambda item: (-item["hitCount"], item["oneMetreCellMinimumEastingNorthing"])):
        serialized_clusters.append(
            {
                **cluster,
                "dates": sorted(cluster["dates"]),
                "candidateIds": sorted(cluster["candidateIds"]),
                "rowKeys": sorted(cluster["rowKeys"]),
            }
        )
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "lidar-column-hit-orthophoto-registration-v1",
        "artifactStage": "diagnostic-obstruction-semantic-review",
        "inputs": {
            "diagnosticPath": str(arguments.diagnostic),
            "diagnosticSha256": hashlib.sha256(diagnostic_bytes).hexdigest(),
            "orthophotoPath": str(arguments.orthophoto),
            "orthophotoSha256": sha256_file(arguments.orthophoto),
            "orthophotoMetadataPath": str(arguments.orthophoto_metadata),
            "orthophotoMetadataSha256": hashlib.sha256(metadata_bytes).hexdigest(),
        },
        "sourceYear": metadata["source"]["sourceYear"],
        "sourceServiceUrl": metadata["source"]["serviceUrl"],
        "renderedHitCount": len(rendered_pixels),
        "hitCountByObservationDate": dict(sorted(hit_count_by_date.items())),
        "oneMetreHitClusters": serialized_clusters,
        "cropBoxPixels": [crop_left, crop_top, crop_right, crop_bottom],
        "outputPng": str(output_png),
        "outputPngSha256": sha256_file(output_png),
        "publicationEligible": False,
        "blockers": [
            "HIT_CLUSTERS_REQUIRE_SEMANTIC_OPACITY_REVIEW",
            "CURRENT_STRUCTURE_CONTINUITY_NOT_YET_ESTABLISHED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "outputPng": str(output_png),
                "artifactVersion": artifact["artifactVersion"],
                "renderedHitCount": len(rendered_pixels),
                "oneMetreClusterCount": len(serialized_clusters),
                "hitCountByObservationDate": artifact["hitCountByObservationDate"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

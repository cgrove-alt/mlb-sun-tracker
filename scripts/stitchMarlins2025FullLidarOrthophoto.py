#!/usr/bin/env python3
"""Stitch two verified official 2025 orthophoto exports over the 2024 LiDAR tile."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from PIL import Image


ANALYSIS_VERSION = "marlins-2025-full-lidar-orthophoto-mosaic-v1"
EXPECTED_SERVICE_URL = (
    "https://imageserverintra.miamidade.gov/arcgis/rest/services/"
    "WGS1984_WebMercator/2025_Woolpert_WGS1984_WebMercator/ImageServer"
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def load_export(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    manifest = json.loads(raw)
    if manifest.get("artifactKind") != "official-arcgis-orthophoto-export":
        raise ValueError(f"Not an official orthophoto export: {path}")
    if manifest.get("stadiumId") != "marlins":
        raise ValueError(f"Orthophoto export targets another stadium: {path}")
    if manifest["source"]["serviceUrl"].lower() != EXPECTED_SERVICE_URL.lower():
        raise ValueError(f"Orthophoto export uses the wrong service: {path}")
    export = manifest["export"]
    if export["coordinateReferenceSystem"] != "EPSG:6438":
        raise ValueError(f"Orthophoto export is not in EPSG:6438: {path}")
    image_path = Path(manifest["localImagePath"])
    if sha256_file(image_path) != export["sha256"]:
        raise ValueError(f"Orthophoto export image checksum mismatch: {path}")
    return manifest, hashlib.sha256(raw).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--south", type=Path, required=True)
    parser.add_argument("--north", type=Path, required=True)
    parser.add_argument("--orthophoto-audit", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    arguments = parser.parse_args()
    south, south_sha256 = load_export(arguments.south)
    north, north_sha256 = load_export(arguments.north)
    audit_raw = arguments.orthophoto_audit.read_bytes()
    audit = json.loads(audit_raw)
    if not audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official 2025 orthophoto ground frame is not accepted")
    if audit["accuracyAssessment"]["officialDatasetHorizontalAccuracy95Feet"] > 1.0:
        raise ValueError("Official 2025 orthophoto ground frame exceeds one foot")
    south_extent = south["export"]["extent"]
    north_extent = north["export"]["extent"]
    if not (
        south_extent["xmin"] == north_extent["xmin"] == 910000
        and south_extent["xmax"] == north_extent["xmax"] == 915000
        and south_extent["ymin"] == 525000
        and south_extent["ymax"] == north_extent["ymin"] == 527500
        and north_extent["ymax"] == 530000
    ):
        raise ValueError("Official export strips do not form the full LiDAR tile")
    if not all(
        record["export"]["pixelSizeX"] == record["export"]["pixelSizeY"] == 1
        for record in (south, north)
    ):
        raise ValueError("Official export strips are not at one-foot sampling")
    south_path = Path(south["localImagePath"])
    north_path = Path(north["localImagePath"])
    with Image.open(south_path) as south_image, Image.open(north_path) as north_image:
        south_rgb = south_image.convert("RGB")
        north_rgb = north_image.convert("RGB")
        if south_rgb.size != (5000, 2500) or north_rgb.size != (5000, 2500):
            raise ValueError("Official export strip dimensions are unexpected")
        combined = Image.new("RGB", (5000, 5000))
        combined.paste(north_rgb, (0, 0))
        combined.paste(south_rgb, (0, 2500))
        arguments.output.parent.mkdir(parents=True, exist_ok=True)
        combined.save(arguments.output, format="PNG", optimize=True)
        decoded_sha256 = hashlib.sha256(combined.tobytes()).hexdigest()
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "source": {
            "provider": "Miami-Dade County ArcGIS ImageServer",
            "serviceUrl": EXPECTED_SERVICE_URL,
            "sourceYear": 2025,
            "strips": [
                {
                    "position": "south",
                    "manifestPath": str(arguments.south),
                    "manifestSha256": south_sha256,
                    "artifactVersion": south["artifactVersion"],
                    "imagePath": str(south_path),
                    "imageSha256": south["export"]["sha256"],
                    "extent": south_extent,
                },
                {
                    "position": "north",
                    "manifestPath": str(arguments.north),
                    "manifestSha256": north_sha256,
                    "artifactVersion": north["artifactVersion"],
                    "imagePath": str(north_path),
                    "imageSha256": north["export"]["sha256"],
                    "extent": north_extent,
                },
            ],
            "orthophotoAccuracyAudit": {
                "path": str(arguments.orthophoto_audit),
                "sha256": hashlib.sha256(audit_raw).hexdigest(),
                "artifactVersion": audit["artifactVersion"],
                "horizontalAccuracy95Feet": audit["accuracyAssessment"][
                    "officialDatasetHorizontalAccuracy95Feet"
                ],
                "elevatedFeatureAccuracyUsed": False,
            },
        },
        "raster": {
            "path": str(arguments.output),
            "sha256": sha256_file(arguments.output),
            "decodedRgbPixelsSha256": decoded_sha256,
            "dimensionsPixels": [5000, 5000],
            "extent": {
                "xmin": 910000,
                "ymin": 525000,
                "xmax": 915000,
                "ymax": 530000,
            },
            "coordinateReferenceSystem": "EPSG:6438",
            "pixelSizeX": 1.0,
            "pixelSizeY": 1.0,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "official-native-orthophoto-mosaic",
        "artifactVersion": artifact_version(stable),
        **stable,
        "accuracyBoundary": {
            "officialDatasetGroundPlanFrameAccepted": True,
            "horizontalAccuracy95Feet": audit["accuracyAssessment"][
                "officialDatasetHorizontalAccuracy95Feet"
            ],
            "elevatedFeatureMetricAccuracyAccepted": False,
        },
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                "GROUND_CONTROLS_NOT_YET_REVIEWED",
                "DIRECT_2024_LIDAR_REGISTRATION_NOT_YET_AUDITED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.manifest.parent.mkdir(parents=True, exist_ok=True)
    arguments.manifest.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "manifest": str(arguments.manifest),
        "artifactVersion": artifact["artifactVersion"],
        "rasterSha256": artifact["raster"]["sha256"],
        "dimensionsPixels": artifact["raster"]["dimensionsPixels"],
        "extent": artifact["raster"]["extent"],
        "horizontalAccuracy95Feet": artifact["accuracyBoundary"][
            "horizontalAccuracy95Feet"
        ],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Hash-lock and validate a native ArcGIS ImageServer DEM crop."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from PIL import Image


ANALYSIS_VERSION = "arcgis-native-dem-crop-v1"
EXPECTED_SERVICE_NAME = "DEMs/2021_5ft_DEM"
EXPECTED_SERVICE_URL = (
    "https://imageserverintra.miamidade.gov/ArcGIS/rest/services/"
    "DEMs/2021_5ft_DEM/ImageServer"
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def header_value(text: str, name: str) -> str | None:
    prefix = f"{name.lower()}:"
    for line in text.splitlines():
        if line.lower().startswith(prefix):
            return line.split(":", 1)[1].strip()
    return None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--headers", type=Path, required=True)
    parser.add_argument("--service", type=Path, required=True)
    parser.add_argument("--metadata", type=Path, required=True)
    parser.add_argument("--request-url", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    image_path = args.image.resolve()
    headers_path = args.headers.resolve()
    service_path = args.service.resolve()
    metadata_path = args.metadata.resolve()
    for path in [image_path, headers_path, service_path, metadata_path]:
        if not path.is_file():
            raise ValueError(f"Input is missing: {path}")
    if not args.request_url.startswith(f"{EXPECTED_SERVICE_URL}/exportImage?"):
        raise ValueError("DEM request URL is not from the expected official service")
    service = json.loads(service_path.read_bytes())
    if service.get("name") != EXPECTED_SERVICE_NAME:
        raise ValueError("ArcGIS service metadata has the wrong service name")
    if float(service.get("pixelSizeX", 0)) != 5.0 or float(
        service.get("pixelSizeY", 0)
    ) != 5.0:
        raise ValueError("ArcGIS service is not the native 5-foot DEM")
    spatial_text = json.dumps(service.get("spatialReference", {}))
    if "NAVD88" not in spatial_text or "Florida_East" not in spatial_text:
        raise ValueError("ArcGIS service lacks the expected horizontal or vertical datum")
    headers_text = headers_path.read_text(encoding="utf-8", errors="replace")
    if "set-cookie:" in headers_text.lower():
        raise ValueError("Stored response headers must not contain cookies")
    if header_value(headers_text, "Content-Type") != "image/tiff":
        raise ValueError("DEM response is not an image/tiff")
    if int(header_value(headers_text, "Content-Length") or -1) != image_path.stat().st_size:
        raise ValueError("DEM response byte length does not match its headers")

    image = Image.open(image_path)
    tags = image.tag_v2
    tiepoint = tags.get(33922)
    pixel_scale = tags.get(33550)
    geokey_text = str(tags.get(34737, ""))
    if image.mode != "F" or not tiepoint or not pixel_scale:
        raise ValueError("DEM is not a georeferenced floating-point TIFF")
    if float(pixel_scale[0]) != 5.0 or float(pixel_scale[1]) != 5.0:
        raise ValueError("DEM crop is not at native 5-foot resolution")
    if "NAD_1983_2011_StatePlane_Florida_East" not in geokey_text:
        raise ValueError("DEM GeoTIFF lacks the expected horizontal CRS")
    width, height = image.size
    xmin = float(tiepoint[3])
    ymax = float(tiepoint[4])
    extent = {
        "xmin": xmin,
        "ymin": ymax - height * float(pixel_scale[1]),
        "xmax": xmin + width * float(pixel_scale[0]),
        "ymax": ymax,
    }
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "requestUrl": args.request_url,
        "imageSha256": sha256_file(image_path),
        "headersSha256": sha256_file(headers_path),
        "serviceSha256": sha256_file(service_path),
        "metadataSha256": sha256_file(metadata_path),
        "extent": extent,
        "dimensions": [width, height],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "official-arcgis-dem-export",
        "artifactVersion": stable_sha256(stable),
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "source": {
            "provider": "Miami-Dade County and GPI Geospatial, Inc.",
            "serviceUrl": EXPECTED_SERVICE_URL,
            "serviceName": EXPECTED_SERVICE_NAME,
            "requestUrl": args.request_url,
            "serviceMetadataPath": str(service_path),
            "serviceMetadataSha256": sha256_file(service_path),
            "officialMetadataPath": str(metadata_path),
            "officialMetadataSha256": sha256_file(metadata_path),
            "responseHeadersPath": str(headers_path),
            "responseHeadersSha256": sha256_file(headers_path),
            "responseDate": header_value(headers_text, "Date"),
            "responseEtag": header_value(headers_text, "ETag"),
        },
        "export": {
            "path": str(image_path),
            "sha256": sha256_file(image_path),
            "byteLength": image_path.stat().st_size,
            "contentType": "image/tiff",
            "dimensionsPixels": [width, height],
            "coordinateReferenceSystem": "EPSG:6438",
            "verticalDatum": "NAVD88 Geoid18",
            "linearUnit": "US survey foot",
            "pixelSizeFeet": [float(pixel_scale[0]), float(pixel_scale[1])],
            "extent": extent,
            "pixelType": "F32",
        },
        "accuracy": {
            "reportedVerticalAccuracy95Feet": 0.204,
            "horizontalAccuracyTestRequiredBySource": False,
        },
        "geometryBoundary": {
            "establishesBareEarthElevationSurface": True,
            "establishesRowOrSeatElevations": False,
            "establishesBuildingOrRoofSurfaces": False,
            "establishesOverhangUndersides": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "BARE_EARTH_DEM_ONLY",
                "ROW_AND_SEAT_ELEVATIONS_NOT_ESTABLISHED",
                "OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "export": artifact["export"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

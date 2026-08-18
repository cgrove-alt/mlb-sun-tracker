#!/usr/bin/env python3
"""Render checksum-bound panorama crops centered on measured seat-to-sun rays."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Proj


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def project_direction(
    provider_direction: np.ndarray,
    provider_to_panorama: np.ndarray,
    provider_yaw_degrees: float,
    width: int,
    height: int,
) -> tuple[float, float]:
    corrected = provider_to_panorama @ provider_direction
    corrected = corrected / np.linalg.norm(corrected)
    yaw = math.radians(provider_yaw_degrees)
    cosine = math.cos(yaw)
    sine = math.sin(yaw)
    base_x = cosine * corrected[0] - sine * corrected[2]
    base_y = corrected[1]
    base_z = sine * corrected[0] + cosine * corrected[2]
    longitude = math.atan2(base_z, base_x)
    latitude = math.asin(max(-1.0, min(1.0, base_y)))
    return (
        (longitude / (2.0 * math.pi) + 0.5) * width,
        (0.5 - latitude / math.pi) * height,
    )


def wrapped_crop(image: Image.Image, center_x: float, center_y: float, width: int, height: int) -> Image.Image:
    doubled = Image.new("RGB", (image.width * 3, image.height))
    doubled.paste(image, (0, 0))
    doubled.paste(image, (image.width, 0))
    doubled.paste(image, (image.width * 2, 0))
    shifted_x = center_x + image.width
    left = round(shifted_x - width / 2)
    top = max(0, min(image.height - height, round(center_y - height / 2)))
    return doubled.crop((left, top, left + width, top + height))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("true_north_orientation", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--seat-id", action="append", required=True)
    parser.add_argument("--crop-width", type=int, default=1200)
    parser.add_argument("--crop-height", type=int, default=800)
    args = parser.parse_args()

    input_paths = {
        "panoramaManifest": args.panorama_manifest,
        "panoramaCalibration": args.panorama_calibration,
        "trueNorthOrientation": args.true_north_orientation,
        "rasterMetadata": args.raster_metadata,
        "solarWindows": args.solar_windows,
        "reviewQueue": args.review_queue,
    }
    input_hashes = {name: sha256_file(path) for name, path in input_paths.items()}
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    raster = json.loads(args.raster_metadata.read_text())
    solar = json.loads(args.solar_windows.read_text())
    review = json.loads(args.review_queue.read_text())
    images_by_id = {item["seatId"]: item for item in manifest["images"]}
    if any(seat_id not in images_by_id for seat_id in args.seat_id):
        raise ValueError("A requested seat ID is missing from the panorama manifest")
    windows_by_id = {item["candidateId"]: item for item in solar["candidates"]}
    reviewed = [
        item for item in review["manualReviewQueue"]
        if item["manualDecision"]["rowBankState"] in {"shade", "sun"}
    ]
    if not reviewed:
        raise ValueError("Review queue has no shade or sun observations")

    compound_crs = CRS.from_wkt(raster["source"]["coordinateReferenceSystem"])
    horizontal_crs = compound_crs.sub_crs_list[0]
    grid = raster["grid"]
    convergence = float(
        Proj(horizontal_crs).get_factors(
            float(grid["centerLongitude"]), float(grid["centerLatitude"])
        ).meridian_convergence
    )
    provider_x_grid_bearing = float(
        orientation["orientation"]["providerPositiveXTrueBearingDegrees"]
    )
    provider_z_grid_bearing = float(
        orientation["orientation"]["providerPositiveZTrueBearingDegrees"]
    )
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )

    columns = len(reviewed)
    rows = len(args.seat_id)
    header_height = 70
    canvas = Image.new(
        "RGB",
        (columns * args.crop_width, rows * (args.crop_height + header_height)),
        (245, 245, 245),
    )
    draw = ImageDraw.Draw(canvas)
    records: list[dict[str, Any]] = []
    for row_index, seat_id in enumerate(args.seat_id):
        entry = images_by_id[seat_id]
        panorama_path = Path(entry["localPath"])
        panorama = Image.open(panorama_path).convert("RGB")
        if panorama.size != (entry["width"], entry["height"]):
            raise ValueError("Panorama dimensions differ from manifest")
        for column_index, item in enumerate(reviewed):
            window = windows_by_id[item["candidateId"]]
            position = window["solarPositionAtMidpoint"]
            true_azimuth = float(position["azimuthDegrees"])
            grid_azimuth = (true_azimuth - convergence) % 360.0
            altitude = float(position["altitudeDegrees"])
            horizontal_x = math.cos(math.radians(grid_azimuth - provider_x_grid_bearing))
            horizontal_z = math.cos(math.radians(grid_azimuth - provider_z_grid_bearing))
            provider_direction = np.asarray(
                [horizontal_x, math.tan(math.radians(altitude)), horizontal_z],
                dtype=float,
            )
            pixel = project_direction(
                provider_direction,
                rotation,
                float(entry["config"]["rp"][1]),
                panorama.width,
                panorama.height,
            )
            crop = wrapped_crop(
                panorama, pixel[0], pixel[1], args.crop_width, args.crop_height
            )
            crop_draw = ImageDraw.Draw(crop)
            centre = (args.crop_width // 2, args.crop_height // 2)
            crop_draw.ellipse(
                (centre[0] - 18, centre[1] - 18, centre[0] + 18, centre[1] + 18),
                outline=(255, 40, 20),
                width=5,
            )
            crop_draw.line(
                (centre[0] - 30, centre[1], centre[0] + 30, centre[1]),
                fill=(255, 40, 20),
                width=3,
            )
            crop_draw.line(
                (centre[0], centre[1] - 30, centre[0], centre[1] + 30),
                fill=(255, 40, 20),
                width=3,
            )
            left = column_index * args.crop_width
            top = row_index * (args.crop_height + header_height)
            canvas.paste(crop, (left, top + header_height))
            label = (
                f"{seat_id}  {item['manualDecision']['rowBankState']}  "
                f"alt {altitude:.2f}  true az {true_azimuth:.2f}  grid az {grid_azimuth:.2f}"
            )
            draw.text((left + 12, top + 20), label, fill=(20, 20, 20))
            records.append({
                "seatId": seat_id,
                "candidateId": item["candidateId"],
                "manualRowBankState": item["manualDecision"]["rowBankState"],
                "altitudeDegrees": altitude,
                "trueAzimuthDegrees": true_azimuth,
                "gridAzimuthDegrees": grid_azimuth,
                "panoramaPixel": [round(pixel[0], 6), round(pixel[1], 6)],
                "panoramaPath": str(panorama_path),
                "panoramaSha256": sha256_file(panorama_path),
            })

    output_png = args.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_png, format="PNG", optimize=True)
    stable: dict[str, Any] = {
        "inputs": input_hashes,
        "seatIds": args.seat_id,
        "meridianConvergenceDegrees": convergence,
        "providerAxisBearingsAreGridReferenced": True,
        "records": records,
        "outputPngSha256": sha256_file(output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "current-panorama-seat-to-sun-ray-review-v1",
        "artifactStage": "current-obstruction-ray-semantic-review",
        "artifactVersion": fingerprint(stable),
        "inputs": {
            name: {"path": str(path), "sha256": input_hashes[name]}
            for name, path in input_paths.items()
        },
        "projection": {
            "meridianConvergenceDegrees": convergence,
            "providerPositiveXGridBearingDegrees": provider_x_grid_bearing,
            "providerPositiveZGridBearingDegrees": provider_z_grid_bearing,
            "providerAxisBearingLabelCorrection": (
                "The orientation source labels projected row-axis bearings as true bearings. "
                "They are grid bearings because they were computed directly from EPSG:6347 coordinates."
            ),
        },
        "records": records,
        "outputPng": str(output_png),
        "outputPngSha256": stable["outputPngSha256"],
        "assessment": {
            "currentSemanticReviewEligible": True,
            "publicationEligible": False,
            "blockers": [
                "RAY_ALIGNED_STRUCTURE_REQUIRES_EXPLICIT_MANUAL_CLASSIFICATION",
                "PANORAMA_DEPTH_NOT_DIRECTLY_PROVIDED",
                "IMAGE_REUSE_TERMS_NOT_ESTABLISHED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "outputPng": str(output_png),
        "artifactVersion": artifact["artifactVersion"],
        "recordCount": len(records),
        "meridianConvergenceDegrees": convergence,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

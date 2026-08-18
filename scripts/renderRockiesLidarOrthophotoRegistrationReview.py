#!/usr/bin/env python3
"""Render Coors Field LiDAR against the accepted DRCOG orthophoto frame.

The orthophoto is sampled in its NGS-corrected survey frame. The LiDAR grid is
left in its delivered UTM coordinates so visible displacement is not hidden.
This review image is only a control-selection aid and never a registration.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Transformer
from scipy.ndimage import distance_transform_edt, gaussian_filter


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def fill_nearest(values: np.ndarray) -> np.ndarray:
    missing = ~np.isfinite(values)
    if missing.all():
        raise ValueError("LiDAR raster contains no finite cells")
    indices = distance_transform_edt(missing, return_distances=False, return_indices=True)
    return values[tuple(indices)]


def inverse_rigid(points: np.ndarray, rotation: np.ndarray, translation: np.ndarray) -> np.ndarray:
    """Map corrected survey coordinates back to nominal orthophoto coordinates."""
    centered_x = points[:, 0] - translation[0]
    centered_y = points[:, 1] - translation[1]
    return np.column_stack((
        centered_x * rotation[0, 0] + centered_y * rotation[1, 0],
        centered_x * rotation[0, 1] + centered_y * rotation[1, 1],
    ))


def panel(image: np.ndarray, title: str, subtitle: str) -> Image.Image:
    raster = Image.fromarray(image)
    header = 62
    output = Image.new("RGB", (raster.width, raster.height + header), "white")
    output.paste(raster, (0, header))
    draw = ImageDraw.Draw(output)
    draw.text((12, 9), title, fill="black")
    draw.text((12, 31), subtitle, fill=(65, 65, 65))
    return output


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lidar-raster", type=Path, required=True)
    parser.add_argument("--dsm", type=Path, required=True)
    parser.add_argument("--intensity", type=Path, required=True)
    parser.add_argument("--orthophoto-manifest", type=Path, required=True, action="append")
    parser.add_argument("--orthophoto-audit", type=Path, required=True)
    parser.add_argument("--output-png", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    lidar_bytes = args.lidar_raster.read_bytes()
    lidar = json.loads(lidar_bytes)
    if lidar.get("artifactKind") != "lidar-registration-control-raster":
        raise ValueError("Unexpected LiDAR raster artifact kind")
    dsm = np.load(args.dsm, allow_pickle=False)
    expected_dsm = lidar["rasterOutputs"]["dsmMaximumZMetres"]
    if sha256_file(args.dsm) != expected_dsm["sha256"]:
        raise ValueError("DSM hash differs from its LiDAR raster artifact")
    if list(dsm.shape) != expected_dsm["shape"]:
        raise ValueError("DSM shape differs from its LiDAR raster artifact")
    intensity = np.load(args.intensity, allow_pickle=False)
    expected_intensity = lidar["rasterOutputs"]["meanIntensity"]
    if sha256_file(args.intensity) != expected_intensity["sha256"]:
        raise ValueError("Intensity hash differs from its LiDAR raster artifact")
    if list(intensity.shape) != expected_intensity["shape"]:
        raise ValueError("Intensity shape differs from its LiDAR raster artifact")

    orthophotos = []
    for manifest_path in args.orthophoto_manifest:
        manifest_bytes = manifest_path.read_bytes()
        manifest = json.loads(manifest_bytes)
        if manifest.get("artifactKind") != "drcog-orthophoto-tile-acquisition":
            raise ValueError("Unexpected orthophoto manifest kind")
        orthophotos.append((manifest_path, manifest_bytes, manifest))
    audit_bytes = args.orthophoto_audit.read_bytes()
    audit = json.loads(audit_bytes)
    if audit.get("artifactKind") != "ngs-drcog-orthophoto-registration-audit":
        raise ValueError("Unexpected orthophoto registration audit kind")
    if not audit.get("registrationAcceptance", {}).get("accepted"):
        raise ValueError("Orthophoto registration audit is not accepted")
    target = audit["inputs"]["targetOrthophoto"]
    supplied_hashes = {
        hashlib.sha256(manifest_bytes).hexdigest()
        for _, manifest_bytes, _ in orthophotos
    }
    if target["sha256"] not in supplied_hashes:
        raise ValueError("Audit does not bind the supplied orthophoto manifest")
    target_project = next(
        manifest["record"]["attributes"]["project"]
        for _, manifest_bytes, manifest in orthophotos
        if hashlib.sha256(manifest_bytes).hexdigest() == target["sha256"]
    )
    for _, _, manifest in orthophotos:
        if manifest["record"]["attributes"]["project"] != target_project:
            raise ValueError("All supplied orthophotos must belong to the audited project")

    grid = lidar["grid"]
    rows = int(grid["rows"])
    columns = int(grid["columns"])
    cell = float(grid["cellMetres"])
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    x_values = minimum_x + (np.arange(columns, dtype=np.float64) + 0.5) * cell
    y_values = minimum_y + (np.arange(rows, dtype=np.float64) + 0.5) * cell
    east, north = np.meshgrid(x_values, y_values)

    source_crs = CRS.from_wkt(lidar["source"]["coordinateReferenceSystem"])
    horizontal_crs = source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
    to_state_plane = Transformer.from_crs(horizontal_crs, CRS.from_epsg(6428), always_xy=True)
    state_x, state_y = to_state_plane.transform(east, north)
    corrected = np.column_stack((state_x.ravel(), state_y.ravel()))
    if not np.isfinite(corrected).all():
        raise ValueError("UTM to State Plane transformation produced non-finite coordinates")
    correction = audit["rigidCorrection"]
    rotation = np.asarray(correction["rotationMatrix"], dtype=np.float64)
    translation = np.asarray(correction["translationFeet"], dtype=np.float64)
    nominal = inverse_rigid(corrected, rotation, translation)
    orthophoto = np.zeros((rows, columns, 3), dtype=np.uint8)
    orthophoto_coverage = np.zeros((rows, columns), dtype=bool)
    crop_records = []
    for manifest_path, _, manifest in orthophotos:
        orthophoto_path = Path(manifest["localFiles"]["orthophoto"])
        if sha256_file(orthophoto_path) != manifest["orthophoto"]["sha256"]:
            raise ValueError("Orthophoto image hash differs from its manifest")
        world = [float(value) for value in manifest["worldFile"]["values"]]
        if world[1] != 0 or world[2] != 0 or world[0] <= 0 or world[3] >= 0:
            raise ValueError("This review requires unrotated north-up orthophotos")
        pixel_columns = (nominal[:, 0] - world[4]) / world[0]
        pixel_rows = (nominal[:, 1] - world[5]) / world[3]
        with Image.open(orthophoto_path) as image:
            valid = (
                (pixel_columns >= -0.5)
                & (pixel_columns <= image.width - 0.5)
                & (pixel_rows >= -0.5)
                & (pixel_rows <= image.height - 0.5)
            ).reshape(rows, columns)
            if not valid.any():
                continue
            flat_valid = valid.ravel()
            left = max(0, int(np.floor(pixel_columns[flat_valid].min())) - 2)
            top = max(0, int(np.floor(pixel_rows[flat_valid].min())) - 2)
            right = min(image.width, int(np.ceil(pixel_columns[flat_valid].max())) + 3)
            bottom = min(image.height, int(np.ceil(pixel_rows[flat_valid].max())) + 3)
            crop = np.asarray(image.crop((left, top, right, bottom)).convert("RGB"))
        map_x = np.clip(
            pixel_columns.reshape(rows, columns), 0.0, image.width - 1.0
        ).astype(np.float32) - left
        map_y = np.clip(
            pixel_rows.reshape(rows, columns), 0.0, image.height - 1.0
        ).astype(np.float32) - top
        sampled = cv2.remap(
            crop,
            map_x,
            map_y,
            interpolation=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(0, 0, 0),
        )
        new_coverage = valid & ~orthophoto_coverage
        orthophoto[new_coverage] = sampled[new_coverage]
        orthophoto_coverage |= valid
        crop_records.append({
            "manifestPath": str(manifest_path),
            "tile": manifest["record"]["attributes"]["tile"],
            "cropPixels": [left, top, right, bottom],
            "outputCoveredCellCount": int(valid.sum()),
        })
    if not orthophoto_coverage.all():
        raise ValueError("Supplied orthophotos do not cover the full LiDAR review grid")
    orthophoto = np.flipud(orthophoto)

    filled = fill_nearest(dsm.astype(np.float64))
    relief = filled - gaussian_filter(filled, sigma=max(1.0, 3.0 / cell))
    relief_limit = max(float(np.percentile(np.abs(relief), 98.5)), 1e-6)
    relief_gray = (
        (np.clip(relief / relief_limit, -1.0, 1.0) + 1.0) * 127.5
    ).astype(np.uint8)
    relief_gray = np.flipud(relief_gray)
    relief_rgb = cv2.cvtColor(relief_gray, cv2.COLOR_GRAY2RGB)
    lidar_edges = cv2.Canny(relief_gray, 45, 110)
    filled_intensity = fill_nearest(intensity.astype(np.float64))
    finite_intensity = intensity[np.isfinite(intensity)]
    intensity_low, intensity_high = np.percentile(finite_intensity, [2.0, 98.0])
    intensity_gray = (
        np.clip(
            (filled_intensity - intensity_low) / max(float(intensity_high - intensity_low), 1e-9),
            0.0,
            1.0,
        )
        * 255.0
    ).astype(np.uint8)
    intensity_gray = np.flipud(intensity_gray)
    intensity_rgb = cv2.cvtColor(intensity_gray, cv2.COLOR_GRAY2RGB)
    intensity_edges = cv2.Canny(intensity_gray, 50, 125)
    ortho_gray = cv2.cvtColor(orthophoto, cv2.COLOR_RGB2GRAY)
    ortho_edges = cv2.Canny(ortho_gray, 55, 130)
    overlay = orthophoto.copy()
    overlay[lidar_edges > 0] = np.asarray([255, 35, 35], dtype=np.uint8)
    overlap = np.zeros_like(orthophoto)
    overlap[..., 0] = lidar_edges
    overlap[..., 1] = ortho_edges
    overlap[..., 2] = np.minimum(lidar_edges, ortho_edges)
    intensity_overlay = orthophoto.copy()
    intensity_overlay[intensity_edges > 0] = np.asarray([255, 35, 255], dtype=np.uint8)

    subtitle = (
        f"0.15 m cells; NGS-corrected orthophoto; LiDAR delivered coordinates; "
        f"E {minimum_x:.1f} to {minimum_x + columns * cell:.1f} m"
    )
    panels = [
        panel(relief_rgb, "LiDAR local relief", subtitle),
        panel(intensity_rgb, "LiDAR mean intensity", subtitle),
        panel(orthophoto, "2022 DRCOG orthophoto", subtitle),
        panel(overlay, "LiDAR edges over orthophoto", "Red is LiDAR; displacement remains visible"),
        panel(intensity_overlay, "LiDAR intensity edges over orthophoto", "Magenta is LiDAR intensity; prefer stable at-grade controls"),
        panel(overlap, "Registration edge diagnostic", "Red LiDAR; green orthophoto; white agreement"),
    ]
    combined = Image.new(
        "RGB",
        (sum(item.width for item in panels), max(item.height for item in panels)),
        "white",
    )
    offset = 0
    for item in panels:
        combined.paste(item, (offset, 0))
        offset += item.width
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    combined.save(args.output_png, format="PNG", optimize=True)

    stable = {
        "inputs": {
            "lidarRaster": {
                "path": str(args.lidar_raster),
                "sha256": hashlib.sha256(lidar_bytes).hexdigest(),
                "artifactVersion": lidar["artifactVersion"],
            },
            "dsm": {"path": str(args.dsm), "sha256": expected_dsm["sha256"]},
            "intensity": {
                "path": str(args.intensity),
                "sha256": expected_intensity["sha256"],
            },
            "orthophotoManifests": [
                {
                    "path": str(manifest_path),
                    "sha256": hashlib.sha256(manifest_bytes).hexdigest(),
                    "artifactVersion": manifest["artifactVersion"],
                    "tile": manifest["record"]["attributes"]["tile"],
                }
                for manifest_path, manifest_bytes, manifest in orthophotos
            ],
            "orthophotoAudit": {
                "path": str(args.orthophoto_audit),
                "sha256": hashlib.sha256(audit_bytes).hexdigest(),
                "artifactVersion": audit["artifactVersion"],
            },
        },
        "grid": grid,
        "orthophotoCrops": crop_records,
        "outputPngSha256": sha256_file(args.output_png),
    }
    output = {
        "schemaVersion": 1,
        "artifactKind": "rockies-lidar-orthophoto-registration-review",
        "artifactStage": "control-selection-review-not-registration",
        "artifactVersion": artifact_version(stable),
        **stable,
        "outputPng": str(args.output_png),
        "geometryBoundary": {
            "establishesRegistration": False,
            "establishesRowElevation": False,
            "note": "The render preserves delivered LiDAR coordinates and is only a review aid for selecting disjoint hard-structure controls.",
        },
    }
    args.output_json.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()

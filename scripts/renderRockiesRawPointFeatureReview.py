#!/usr/bin/env python3
"""Render native LiDAR points beside the NGS-corrected Coors orthophoto.

The output is a feature-selection aid. It does not establish correspondence,
registration, or positional accuracy.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import laspy
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


def inverse_rigid(points: np.ndarray, rotation: np.ndarray, translation: np.ndarray) -> np.ndarray:
    centered = points - translation
    return centered @ rotation


def fill_nearest(values: np.ndarray) -> np.ndarray:
    missing = ~np.isfinite(values)
    if missing.all():
        raise ValueError("Feature raster has no finite LiDAR cells")
    indices = distance_transform_edt(missing, return_distances=False, return_indices=True)
    return values[tuple(indices)]


def panel(image: np.ndarray, title: str, subtitle: str) -> Image.Image:
    raster = Image.fromarray(image)
    header = 58
    output = Image.new("RGB", (raster.width, raster.height + header), "white")
    output.paste(raster, (0, header))
    draw = ImageDraw.Draw(output)
    draw.text((10, 8), title, fill="black")
    draw.text((10, 29), subtitle, fill=(65, 65, 65))
    return output


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--controls", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("artifactKind") != "rockies-raw-point-feature-review-controls":
        raise ValueError("Unexpected controls artifact kind")

    lidar_path = Path(controls["inputs"]["lidarPath"])
    if sha256_file(lidar_path) != controls["inputs"]["lidarSha256"]:
        raise ValueError("LiDAR hash differs from controls")
    audit_path = Path(controls["inputs"]["orthophotoAuditPath"])
    audit_bytes = audit_path.read_bytes()
    if hashlib.sha256(audit_bytes).hexdigest() != controls["inputs"]["orthophotoAuditSha256"]:
        raise ValueError("Orthophoto audit hash differs from controls")
    audit = json.loads(audit_bytes)
    if not audit.get("registrationAcceptance", {}).get("accepted"):
        raise ValueError("Orthophoto registration audit is not accepted")

    manifests = []
    for input_manifest in controls["inputs"]["orthophotoManifests"]:
        manifest_path = Path(input_manifest["path"])
        manifest_bytes = manifest_path.read_bytes()
        if hashlib.sha256(manifest_bytes).hexdigest() != input_manifest["sha256"]:
            raise ValueError("Orthophoto manifest hash differs from controls")
        manifest = json.loads(manifest_bytes)
        image_path = Path(manifest["localFiles"]["orthophoto"])
        if sha256_file(image_path) != manifest["orthophoto"]["sha256"]:
            raise ValueError("Orthophoto image hash differs from manifest")
        manifests.append((manifest_path, manifest, image_path))

    with laspy.open(lidar_path) as source:
        lidar = source.read()
        source_crs = source.header.parse_crs()
    if source_crs is None:
        raise ValueError("LiDAR has no coordinate reference system")
    horizontal_crs = source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
    to_state_plane = Transformer.from_crs(horizontal_crs, CRS.from_epsg(6428), always_xy=True)
    x_points = np.asarray(lidar.x)
    y_points = np.asarray(lidar.y)
    z_points = np.asarray(lidar.z)

    correction = audit["rigidCorrection"]
    rotation = np.asarray(correction["rotationMatrix"], dtype=np.float64)
    translation = np.asarray(correction["translationFeet"], dtype=np.float64)
    output_records = []
    args.output_dir.mkdir(parents=True, exist_ok=True)

    for feature in controls["features"]:
        feature_id = feature["featureId"]
        center_x, center_y = [float(value) for value in feature["centerDeliveredUtmMetres"]]
        radius = float(feature["radiusMetres"])
        cell = float(feature["reviewCellMetres"])
        size = int(np.ceil(radius * 2.0 / cell))
        minimum_x = center_x - size * cell / 2.0
        minimum_y = center_y - size * cell / 2.0
        x_values = minimum_x + (np.arange(size, dtype=np.float64) + 0.5) * cell
        y_values = minimum_y + (np.arange(size, dtype=np.float64) + 0.5) * cell
        east, north = np.meshgrid(x_values, y_values)

        local = (
            (x_points >= minimum_x)
            & (x_points < minimum_x + size * cell)
            & (y_points >= minimum_y)
            & (y_points < minimum_y + size * cell)
        )
        local_x = x_points[local]
        local_y = y_points[local]
        local_z = z_points[local]
        if len(local_z) == 0:
            raise ValueError(f"No LiDAR points in feature {feature_id}")
        columns = np.floor((local_x - minimum_x) / cell).astype(np.int64)
        rows = np.floor((local_y - minimum_y) / cell).astype(np.int64)
        flat = rows * size + columns
        dsm_flat = np.full(size * size, -np.inf, dtype=np.float64)
        np.maximum.at(dsm_flat, flat, local_z)
        dsm = dsm_flat.reshape(size, size)
        dsm[dsm == -np.inf] = np.nan
        filled = fill_nearest(dsm)
        low, high = np.percentile(local_z, [2.0, 98.0])
        normalized = np.clip((filled - low) / max(float(high - low), 1e-9), 0.0, 1.0)
        dsm_colour = cv2.applyColorMap((normalized * 255).astype(np.uint8), cv2.COLORMAP_TURBO)
        dsm_colour = cv2.cvtColor(dsm_colour, cv2.COLOR_BGR2RGB)
        relief = filled - gaussian_filter(filled, sigma=max(1.0, 1.0 / cell))
        relief_limit = max(float(np.percentile(np.abs(relief), 98.0)), 1e-6)
        relief_gray = ((np.clip(relief / relief_limit, -1.0, 1.0) + 1.0) * 127.5).astype(np.uint8)
        relief_rgb = cv2.cvtColor(relief_gray, cv2.COLOR_GRAY2RGB)

        z_low, z_high = [float(value) for value in feature["plateauZBoundsMetres"]]
        plateau = (local_z >= z_low) & (local_z <= z_high)
        plateau_mask = np.zeros((size, size), dtype=np.uint8)
        plateau_mask[rows[plateau], columns[plateau]] = 255
        plateau_mask = cv2.dilate(plateau_mask, np.ones((3, 3), np.uint8), iterations=1)
        plateau_rgb = cv2.cvtColor(plateau_mask, cv2.COLOR_GRAY2RGB)

        state_x, state_y = to_state_plane.transform(east, north)
        corrected = np.column_stack((state_x.ravel(), state_y.ravel()))
        nominal = inverse_rigid(corrected, rotation, translation)
        orthophoto = np.zeros((size, size, 3), dtype=np.uint8)
        coverage = np.zeros((size, size), dtype=bool)
        for _, manifest, image_path in manifests:
            world = [float(value) for value in manifest["worldFile"]["values"]]
            pixel_columns = (nominal[:, 0] - world[4]) / world[0]
            pixel_rows = (nominal[:, 1] - world[5]) / world[3]
            with Image.open(image_path) as ortho_image:
                valid = (
                    (pixel_columns >= -0.5)
                    & (pixel_columns <= ortho_image.width - 0.5)
                    & (pixel_rows >= -0.5)
                    & (pixel_rows <= ortho_image.height - 0.5)
                ).reshape(size, size)
                if not valid.any():
                    continue
                flat_valid = valid.ravel()
                left = max(0, int(np.floor(pixel_columns[flat_valid].min())) - 2)
                top = max(0, int(np.floor(pixel_rows[flat_valid].min())) - 2)
                right = min(ortho_image.width, int(np.ceil(pixel_columns[flat_valid].max())) + 3)
                bottom = min(ortho_image.height, int(np.ceil(pixel_rows[flat_valid].max())) + 3)
                crop = np.asarray(ortho_image.crop((left, top, right, bottom)).convert("RGB"))
            map_x = pixel_columns.reshape(size, size).astype(np.float32) - left
            map_y = pixel_rows.reshape(size, size).astype(np.float32) - top
            sampled = cv2.remap(
                crop,
                map_x,
                map_y,
                interpolation=cv2.INTER_LANCZOS4,
                borderMode=cv2.BORDER_CONSTANT,
                borderValue=(0, 0, 0),
            )
            new_coverage = valid & ~coverage
            orthophoto[new_coverage] = sampled[new_coverage]
            coverage |= valid
        if not coverage.all():
            raise ValueError(f"Orthophotos do not cover feature {feature_id}")

        dsm_colour = np.flipud(dsm_colour)
        relief_rgb = np.flipud(relief_rgb)
        plateau_rgb = np.flipud(plateau_rgb)
        orthophoto = np.flipud(orthophoto)
        ortho_edges = cv2.Canny(cv2.cvtColor(orthophoto, cv2.COLOR_RGB2GRAY), 60, 130)
        plateau_overlay = orthophoto.copy()
        plateau_overlay[plateau_mask[::-1] > 0] = (
            0.45 * plateau_overlay[plateau_mask[::-1] > 0] + np.array([255, 25, 25]) * 0.55
        ).astype(np.uint8)
        plateau_overlay[ortho_edges > 0] = np.array([0, 255, 255], dtype=np.uint8)

        subtitle = f"center {center_x:.3f}, {center_y:.3f} UTM; {cell:.2f} m cells"
        panels = [
            panel(dsm_colour, f"{feature_id}: raw LiDAR top surface", f"z colour range p02 {low:.2f} to p98 {high:.2f} m"),
            panel(relief_rgb, f"{feature_id}: LiDAR local relief", subtitle),
            panel(plateau_rgb, f"{feature_id}: selected LiDAR plateau", f"{z_low:.2f} to {z_high:.2f} m; selection only"),
            panel(orthophoto, f"{feature_id}: corrected 2022 orthophoto", subtitle),
            panel(plateau_overlay, f"{feature_id}: unfitted overlay", "red LiDAR plateau occupancy; cyan image edges"),
        ]
        page = Image.new("RGB", (size * len(panels), size + 58), "white")
        for panel_index, panel_image in enumerate(panels):
            page.paste(panel_image, (panel_index * size, 0))
        output_path = args.output_dir / f"{feature_id}.png"
        page.save(output_path, format="PNG", optimize=True)
        output_records.append({
            "featureId": feature_id,
            "localPointCount": int(len(local_z)),
            "plateauPointCount": int(plateau.sum()),
            "outputPath": str(output_path),
            "outputSha256": sha256_file(output_path),
        })

    stable = {
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "orthophotoAuditArtifactVersion": audit["artifactVersion"],
        "featureOutputs": output_records,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-raw-point-feature-review",
        "artifactStage": "review-only-no-correspondence-accepted",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesRegistration": False,
            "acceptedControlCount": 0,
            "note": "The images expose raw returns and corrected imagery for semantic selection only. No line or corner has been accepted or fitted.",
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"artifactVersion": artifact["artifactVersion"], "featureCount": len(output_records)}, indent=2))


if __name__ == "__main__":
    main()

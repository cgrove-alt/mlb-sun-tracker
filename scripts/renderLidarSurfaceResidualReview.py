#!/usr/bin/env python3
"""Render local LiDAR micro-relief beside an orthophoto for manual review."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("dsm", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--left", type=int, required=True)
    parser.add_argument("--top", type=int, required=True)
    parser.add_argument("--right", type=int, required=True)
    parser.add_argument("--bottom", type=int, required=True)
    parser.add_argument("--minimum-z-metres", type=float, required=True)
    parser.add_argument("--maximum-z-metres", type=float, required=True)
    parser.add_argument("--smooth-sigma-pixels", type=float, default=20.0)
    parser.add_argument("--maximum-fill-distance-pixels", type=float, default=5.0)
    parser.add_argument("--grid-spacing-pixels", type=int, default=100)
    arguments = parser.parse_args()
    if not (
        arguments.left >= 0
        and arguments.top >= 0
        and arguments.right > arguments.left
        and arguments.bottom > arguments.top
    ):
        raise ValueError("Invalid crop")
    if arguments.minimum_z_metres >= arguments.maximum_z_metres:
        raise ValueError("Invalid elevation bounds")
    if arguments.smooth_sigma_pixels <= 0 or arguments.maximum_fill_distance_pixels < 0:
        raise ValueError("Invalid smoothing or fill parameters")

    dsm = np.load(arguments.dsm, mmap_mode="r")
    with Image.open(arguments.orthophoto) as source:
        source_image = source.convert("RGB")
        if dsm.shape != (source_image.height, source_image.width):
            raise ValueError("DSM and orthophoto dimensions differ")
        if arguments.right > source_image.width or arguments.bottom > source_image.height:
            raise ValueError("Crop lies outside the source images")
        orthophoto = np.asarray(source_image)[
            arguments.top:arguments.bottom,
            arguments.left:arguments.right,
        ].copy()
    values = np.asarray(
        dsm[arguments.top:arguments.bottom, arguments.left:arguments.right],
        dtype=np.float64,
    )
    valid = (
        np.isfinite(values)
        & (values >= arguments.minimum_z_metres)
        & (values <= arguments.maximum_z_metres)
    )
    if np.count_nonzero(valid) < 1000:
        raise ValueError("Too few LiDAR cells remain in the selected surface range")
    distance, nearest = ndimage.distance_transform_edt(
        ~valid,
        return_distances=True,
        return_indices=True,
    )
    filled = values[tuple(nearest)]
    supported = distance <= arguments.maximum_fill_distance_pixels
    smooth = ndimage.gaussian_filter(filled, arguments.smooth_sigma_pixels, mode="nearest")
    residual = filled - smooth
    residual_values = residual[supported]
    lower = float(np.percentile(residual_values, 1))
    upper = float(np.percentile(residual_values, 99))
    magnitude = max(abs(lower), abs(upper), 0.01)
    normalized = np.clip((residual + magnitude) / (2.0 * magnitude), 0.0, 1.0)
    low_colour = np.asarray([26.0, 80.0, 170.0])
    middle_colour = np.asarray([245.0, 245.0, 242.0])
    high_colour = np.asarray([190.0, 35.0, 45.0])
    residual_rgb = np.empty((*residual.shape, 3), dtype=np.float64)
    lower_half = normalized <= 0.5
    lower_fraction = np.clip(normalized * 2.0, 0.0, 1.0)
    upper_fraction = np.clip((normalized - 0.5) * 2.0, 0.0, 1.0)
    residual_rgb[lower_half] = (
        low_colour * (1.0 - lower_fraction[lower_half, None])
        + middle_colour * lower_fraction[lower_half, None]
    )
    residual_rgb[~lower_half] = (
        middle_colour * (1.0 - upper_fraction[~lower_half, None])
        + high_colour * upper_fraction[~lower_half, None]
    )
    residual_rgb[~supported] = 255.0
    residual_rgb = np.rint(residual_rgb).astype(np.uint8)

    gradient_x = ndimage.sobel(residual, axis=1)
    gradient_y = ndimage.sobel(residual, axis=0)
    gradient = np.hypot(gradient_x, gradient_y)
    threshold = float(np.percentile(gradient[supported], 97.5))
    topographic_edge = supported & (gradient >= threshold)
    overlay = orthophoto.copy()
    overlay[topographic_edge] = np.asarray([255, 0, 200], dtype=np.uint8)

    panel_width = orthophoto.shape[1]
    panel_height = orthophoto.shape[0]
    label_height = 38
    sheet = Image.new("RGB", (panel_width * 3, panel_height + label_height), "white")
    sheet.paste(Image.fromarray(orthophoto), (0, label_height))
    sheet.paste(Image.fromarray(residual_rgb), (panel_width, label_height))
    sheet.paste(Image.fromarray(overlay), (panel_width * 2, label_height))
    draw = ImageDraw.Draw(sheet)
    draw.text((8, 12), "2021 orthophoto", fill="black")
    draw.text((panel_width + 8, 12), "2018 LiDAR local surface residual", fill="black")
    draw.text((panel_width * 2 + 8, 12), "97.5th percentile LiDAR residual-gradient overlay", fill="black")
    if arguments.grid_spacing_pixels:
        for local_x in range(0, panel_width, arguments.grid_spacing_pixels):
            source_x = local_x + arguments.left
            for panel in range(3):
                x_value = panel * panel_width + local_x
                draw.line((x_value, label_height, x_value, label_height + panel_height - 1), fill=(255, 210, 0), width=1)
                draw.text((x_value + 3, label_height + 3), str(source_x), fill=(255, 210, 0))
        for local_y in range(0, panel_height, arguments.grid_spacing_pixels):
            source_y = local_y + arguments.top
            y_value = label_height + local_y
            for panel in range(3):
                left = panel * panel_width
                draw.line((left, y_value, left + panel_width - 1, y_value), fill=(255, 210, 0), width=1)
                draw.text((left + 3, y_value + 3), str(source_y), fill=(255, 210, 0))
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(arguments.output, format="PNG", optimize=True)
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "lidar-surface-residual-orthophoto-review",
        "inputs": {
            "dsm": {"path": str(arguments.dsm), "sha256": sha256_file(arguments.dsm)},
            "orthophoto": {"path": str(arguments.orthophoto), "sha256": sha256_file(arguments.orthophoto)},
        },
        "parameters": {
            "cropPixels": [arguments.left, arguments.top, arguments.right, arguments.bottom],
            "minimumZMetres": arguments.minimum_z_metres,
            "maximumZMetres": arguments.maximum_z_metres,
            "smoothSigmaPixels": arguments.smooth_sigma_pixels,
            "maximumFillDistancePixels": arguments.maximum_fill_distance_pixels,
            "gridSpacingPixels": arguments.grid_spacing_pixels,
        },
        "diagnostics": {
            "validCellCount": int(np.count_nonzero(valid)),
            "supportedCellCount": int(np.count_nonzero(supported)),
            "residualClipMetres": [-magnitude, magnitude],
            "gradientThreshold": threshold,
            "topographicEdgePixelCount": int(np.count_nonzero(topographic_edge)),
        },
        "output": {"path": str(arguments.output), "sha256": sha256_file(arguments.output)},
        "assessment": {
            "reviewOnly": True,
            "publicationEligible": False,
            "reason": "Candidate surface features require semantic review and locked holdout validation.",
        },
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "diagnostics": artifact["diagnostics"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

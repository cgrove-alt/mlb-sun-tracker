#!/usr/bin/env python3
"""Render triangulated provider-local scene points over their source panorama."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama", type=Path)
    parser.add_argument("scene_npz", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--left", type=int, required=True)
    parser.add_argument("--top", type=int, required=True)
    parser.add_argument("--right", type=int, required=True)
    parser.add_argument("--bottom", type=int, required=True)
    parser.add_argument("--maximum-labels", type=int, default=300)
    parser.add_argument("--pixel-scale", type=float, default=1.0)
    parser.add_argument("--minimum-provider-y", type=float)
    parser.add_argument("--maximum-provider-y", type=float)
    parser.add_argument("--output-scale", type=float, default=1.0)
    arguments = parser.parse_args()

    image = cv2.imread(str(arguments.panorama), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not read panorama")
    height, width = image.shape[:2]
    if not (
        0 <= arguments.left < arguments.right <= width
        and 0 <= arguments.top < arguments.bottom <= height
    ):
        raise ValueError("Crop is outside the panorama")
    scene = np.load(arguments.scene_npz)
    if arguments.pixel_scale <= 0:
        raise ValueError("Pixel scale must be positive")
    pixels = scene["left_pixels"] * arguments.pixel_scale
    points = scene["provider_points_metres"]
    selected = (
        (pixels[:, 0] >= arguments.left)
        & (pixels[:, 0] < arguments.right)
        & (pixels[:, 1] >= arguments.top)
        & (pixels[:, 1] < arguments.bottom)
    )
    if arguments.minimum_provider_y is not None:
        selected &= points[:, 1] >= arguments.minimum_provider_y
    if arguments.maximum_provider_y is not None:
        selected &= points[:, 1] <= arguments.maximum_provider_y
    pixels = pixels[selected]
    points = points[selected]
    if pixels.shape[0] > arguments.maximum_labels:
        indices = np.linspace(0, pixels.shape[0] - 1, arguments.maximum_labels, dtype=int)
        pixels = pixels[indices]
        points = points[indices]
    crop = image[arguments.top:arguments.bottom, arguments.left:arguments.right].copy()
    for pixel, point in zip(pixels, points):
        x = int(round(pixel[0] - arguments.left))
        y = int(round(pixel[1] - arguments.top))
        cv2.circle(crop, (x, y), 5, (0, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(
            crop,
            f"{point[0]:.1f},{point[1]:.1f},{point[2]:.1f}",
            (x + 7, y - 5),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.38,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
    if arguments.output_scale <= 0:
        raise ValueError("Output scale must be positive")
    if arguments.output_scale != 1.0:
        crop = cv2.resize(
            crop,
            None,
            fx=arguments.output_scale,
            fy=arguments.output_scale,
            interpolation=cv2.INTER_CUBIC,
        )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(arguments.output), crop, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write diagnostic image")
    print({"output": str(arguments.output), "renderedPoints": int(pixels.shape[0])})


if __name__ == "__main__":
    main()

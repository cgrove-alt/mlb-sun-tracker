#!/usr/bin/env python3
"""Render a diagnostic coordinate grid over an image without altering the source."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2


def draw_grid(
    image,
    spacing: int,
    x_offset: int = 0,
    y_offset: int = 0,
    labels: bool = True,
) -> None:
    if spacing == 0:
        return
    height, width = image.shape[:2]
    for x_value in range(0, width, spacing):
        cv2.line(image, (x_value, 0), (x_value, height - 1), (0, 220, 255), 1)
        if labels:
            cv2.putText(
                image,
                str(x_value + x_offset),
                (x_value + 3, 18),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.45,
                (0, 220, 255),
                1,
                cv2.LINE_AA,
            )
    for y_value in range(0, height, spacing):
        cv2.line(image, (0, y_value), (width - 1, y_value), (0, 220, 255), 1)
        if labels:
            cv2.putText(
                image,
                str(y_value + y_offset),
                (3, min(height - 3, y_value + 18)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.45,
                (0, 220, 255),
                1,
                cv2.LINE_AA,
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_image", type=Path)
    parser.add_argument("output_image", type=Path)
    parser.add_argument("--spacing", type=int, default=100)
    parser.add_argument("--left", type=int)
    parser.add_argument("--top", type=int)
    parser.add_argument("--right", type=int)
    parser.add_argument("--bottom", type=int)
    parser.add_argument("--scale", type=float, default=1.0)
    parser.add_argument("--input-coordinate-grid", action="store_true")
    parser.add_argument("--no-labels", action="store_true")
    args = parser.parse_args()
    if args.spacing < 0:
        raise ValueError("Spacing cannot be negative")
    image = cv2.imread(str(args.input_image), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not load input image")
    crop_values = (args.left, args.top, args.right, args.bottom)
    crop_left = 0
    crop_top = 0
    if any(value is not None for value in crop_values):
        if not all(value is not None for value in crop_values):
            raise ValueError("Crop requires left, top, right, and bottom")
        height, width = image.shape[:2]
        if not (
            0 <= args.left < args.right <= width
            and 0 <= args.top < args.bottom <= height
        ):
            raise ValueError("Crop is outside the input image")
        crop_left = args.left
        crop_top = args.top
        image = image[args.top : args.bottom, args.left : args.right]
    if args.scale <= 0:
        raise ValueError("Scale must be positive")
    if args.input_coordinate_grid:
        draw_grid(image, args.spacing, crop_left, crop_top, not args.no_labels)
    if args.scale != 1.0:
        image = cv2.resize(
            image,
            None,
            fx=args.scale,
            fy=args.scale,
            interpolation=cv2.INTER_CUBIC,
        )
    if not args.input_coordinate_grid:
        draw_grid(image, args.spacing, labels=not args.no_labels)
    args.output_image.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_image), image, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write output image")


if __name__ == "__main__":
    main()

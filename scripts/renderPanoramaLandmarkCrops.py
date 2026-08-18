#!/usr/bin/env python3
"""Render paired native-pixel crops for reviewing panorama landmark centers."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np


def parse_candidate(value: str) -> tuple[str, float, float, float, float]:
    parts = value.split(",")
    if len(parts) != 5 or not parts[0].strip():
        raise argparse.ArgumentTypeError(
            "candidate must be LABEL,LEFT_X,LEFT_Y,RIGHT_X,RIGHT_Y"
        )
    try:
        return parts[0].strip(), *(float(item) for item in parts[1:])
    except ValueError as error:
        raise argparse.ArgumentTypeError("candidate pixels must be numeric") from error


def crop_with_grid(
    image: np.ndarray,
    center_x: float,
    center_y: float,
    radius: int,
    scale: int,
) -> np.ndarray:
    height, width = image.shape[:2]
    integer_x = int(round(center_x))
    integer_y = int(round(center_y))
    x0 = max(0, integer_x - radius)
    y0 = max(0, integer_y - radius)
    x1 = min(width, integer_x + radius + 1)
    y1 = min(height, integer_y + radius + 1)
    crop = image[y0:y1, x0:x1].copy()
    rendered = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_NEAREST)
    for source_x in range(x0, x1):
        if source_x % 5 != 0:
            continue
        rendered_x = (source_x - x0) * scale
        cv2.line(
            rendered,
            (rendered_x, 0),
            (rendered_x, rendered.shape[0] - 1),
            (0, 220, 255),
            1,
        )
    for source_y in range(y0, y1):
        if source_y % 5 != 0:
            continue
        rendered_y = (source_y - y0) * scale
        cv2.line(
            rendered,
            (0, rendered_y),
            (rendered.shape[1] - 1, rendered_y),
            (0, 220, 255),
            1,
        )
    marker_x = int(round((center_x - x0 + 0.5) * scale))
    marker_y = int(round((center_y - y0 + 0.5) * scale))
    cv2.drawMarker(
        rendered,
        (marker_x, marker_y),
        (40, 40, 255),
        markerType=cv2.MARKER_CROSS,
        markerSize=max(16, scale * 2),
        thickness=2,
    )
    cv2.putText(
        rendered,
        f"({center_x:.1f}, {center_y:.1f})",
        (8, 24),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 255, 255),
        3,
        cv2.LINE_AA,
    )
    cv2.putText(
        rendered,
        f"({center_x:.1f}, {center_y:.1f})",
        (8, 24),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (0, 0, 0),
        1,
        cv2.LINE_AA,
    )
    return rendered


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--left", type=Path, required=True)
    parser.add_argument("--right", type=Path, required=True)
    parser.add_argument("--candidate", action="append", type=parse_candidate, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--radius", type=int, default=20)
    parser.add_argument("--scale", type=int, default=10)
    args = parser.parse_args()
    if args.radius < 2 or args.scale < 1:
        raise ValueError("radius must be at least 2 and scale must be positive")
    left = cv2.imread(str(args.left), cv2.IMREAD_COLOR)
    right = cv2.imread(str(args.right), cv2.IMREAD_COLOR)
    if left is None or right is None:
        raise ValueError("Both panorama images must be readable")
    if left.shape != right.shape:
        raise ValueError("Panorama dimensions must match")

    rows: list[np.ndarray] = []
    for label, left_x, left_y, right_x, right_y in args.candidate:
        left_crop = crop_with_grid(left, left_x, left_y, args.radius, args.scale)
        right_crop = crop_with_grid(right, right_x, right_y, args.radius, args.scale)
        separator = np.full((left_crop.shape[0], 12, 3), 255, dtype=np.uint8)
        row = np.hstack((left_crop, separator, right_crop))
        cv2.putText(
            row,
            label,
            (8, row.shape[0] - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            3,
            cv2.LINE_AA,
        )
        cv2.putText(
            row,
            label,
            (8, row.shape[0] - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 0),
            1,
            cv2.LINE_AA,
        )
        rows.append(row)
    separator = np.full((12, rows[0].shape[1], 3), 255, dtype=np.uint8)
    sheet_parts: list[np.ndarray] = []
    for index, row in enumerate(rows):
        if index:
            sheet_parts.append(separator)
        sheet_parts.append(row)
    output = np.vstack(sheet_parts)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output), output):
        raise RuntimeError(f"Could not write {args.output}")
    print(args.output)


if __name__ == "__main__":
    main()

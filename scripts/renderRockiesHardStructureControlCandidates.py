#!/usr/bin/env python3
"""Render spatially distributed corner candidates for Coors registration review.

Automatic corner proximity only creates a review queue. A candidate becomes a
control only after its feature identity and temporal stability are reviewed.
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
from scipy.spatial import cKDTree


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-json", type=Path, required=True)
    parser.add_argument("--output-png", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-atlas-dir", type=Path)
    parser.add_argument(
        "--atlas-candidate-ids",
        help="Optional comma-separated subset of candidate IDs to render in the atlas",
    )
    parser.add_argument("--maximum-pixel-separation", type=float, default=5.0)
    parser.add_argument("--grid-size", type=int, default=5)
    parser.add_argument("--per-grid-cell", type=int, default=3)
    return parser.parse_args()


def render_candidate_atlas(
    output_dir: Path,
    records: list[dict[str, Any]],
    relief_rgb: np.ndarray,
    orthophoto_rgb: np.ndarray,
    candidate_ids: set[str] | None,
) -> list[dict[str, Any]]:
    """Render review-only pages with matched locations at a legible scale."""
    selected = [
        record
        for record in records
        if candidate_ids is None or record["candidateId"] in candidate_ids
    ]
    if candidate_ids is not None:
        missing = candidate_ids - {record["candidateId"] for record in selected}
        if missing:
            raise ValueError(f"Unknown atlas candidate IDs: {sorted(missing)}")
    output_dir.mkdir(parents=True, exist_ok=True)
    page_records: list[dict[str, Any]] = []
    crop_radius = 72
    display_size = crop_radius * 2 * 2
    tile_width = display_size * 2
    tile_height = display_size + 58
    columns = 2
    rows_per_page = 3
    page_capacity = columns * rows_per_page

    def crop_and_mark(raster: np.ndarray, pixel: list[float], colour: tuple[int, int, int]) -> Image.Image:
        x_value, y_value = pixel
        center_x = int(round(x_value))
        center_y = int(round(y_value))
        padded = cv2.copyMakeBorder(
            raster,
            crop_radius,
            crop_radius,
            crop_radius,
            crop_radius,
            cv2.BORDER_CONSTANT,
            value=(0, 0, 0),
        )
        crop = padded[
            center_y:center_y + crop_radius * 2,
            center_x:center_x + crop_radius * 2,
        ]
        image = Image.fromarray(crop).resize(
            (display_size, display_size),
            resample=Image.Resampling.LANCZOS,
        )
        draw = ImageDraw.Draw(image)
        center = display_size // 2
        draw.line((center - 13, center, center + 13, center), fill=colour, width=2)
        draw.line((center, center - 13, center, center + 13), fill=colour, width=2)
        draw.ellipse((center - 7, center - 7, center + 7, center + 7), outline=colour, width=2)
        return image

    for page_index in range(0, len(selected), page_capacity):
        page_items = selected[page_index:page_index + page_capacity]
        page_number = page_index // page_capacity + 1
        page = Image.new(
            "RGB",
            (tile_width * columns, tile_height * rows_per_page),
            "white",
        )
        draw = ImageDraw.Draw(page)
        for item_index, record in enumerate(page_items):
            tile_column = item_index % columns
            tile_row = item_index // columns
            left = tile_column * tile_width
            top = tile_row * tile_height
            source = crop_and_mark(relief_rgb, record["sourcePixel"], (255, 35, 35))
            target = crop_and_mark(orthophoto_rgb, record["targetPixel"], (0, 220, 255))
            page.paste(source, (left, top + 58))
            page.paste(target, (left + display_size, top + 58))
            delta_x, delta_y = record["rawCoordinateDeltaMetres"]
            draw.text(
                (left + 9, top + 7),
                f'{record["candidateId"]}   LiDAR relief | 2022 orthophoto',
                fill="black",
            )
            draw.text(
                (left + 9, top + 29),
                f"automatic delta x={delta_x:+.3f} m, y={delta_y:+.3f} m; semantic identity unreviewed",
                fill=(70, 70, 70),
            )
        path = output_dir / f"candidate-atlas-page-{page_number:02d}.png"
        page.save(path, format="PNG", optimize=True)
        page_records.append({"path": str(path), "sha256": sha256_file(path)})
    return page_records


def main() -> None:
    args = parse_args()
    review_bytes = args.review_json.read_bytes()
    review = json.loads(review_bytes)
    if review.get("artifactKind") != "rockies-lidar-orthophoto-registration-review":
        raise ValueError("Unexpected registration review kind")
    review_png = Path(review["outputPng"])
    if sha256_file(review_png) != review["outputPngSha256"]:
        raise ValueError("Registration review PNG hash differs from its artifact")

    grid = review["grid"]
    rows = int(grid["rows"])
    columns = int(grid["columns"])
    cell_metres = float(grid["cellMetres"])
    header = 62
    image = cv2.imread(str(review_png), cv2.IMREAD_COLOR)
    if image is None or image.shape[0] < header + rows or image.shape[1] < columns * 3:
        raise ValueError("Registration review image has unexpected dimensions")
    relief = cv2.cvtColor(image[header:header + rows, 0:columns], cv2.COLOR_BGR2GRAY)
    orthophoto_bgr = image[
        header:header + rows,
        2 * columns:3 * columns,
    ]
    orthophoto = cv2.cvtColor(orthophoto_bgr, cv2.COLOR_BGR2GRAY)

    source_corners = cv2.goodFeaturesToTrack(
        relief,
        maxCorners=5000,
        qualityLevel=0.01,
        minDistance=8,
        blockSize=7,
        useHarrisDetector=False,
    )
    target_corners = cv2.goodFeaturesToTrack(
        orthophoto,
        maxCorners=8000,
        qualityLevel=0.01,
        minDistance=8,
        blockSize=7,
        useHarrisDetector=False,
    )
    if source_corners is None or target_corners is None:
        raise ValueError("Corner detection produced no controls")
    source_points = source_corners[:, 0, :]
    target_points = target_corners[:, 0, :]
    target_tree = cKDTree(target_points)
    source_tree = cKDTree(source_points)
    source_to_target_distance, source_to_target_index = target_tree.query(source_points)
    _, target_to_source_index = source_tree.query(target_points)

    raw = []
    for source_index, distance in enumerate(source_to_target_distance):
        target_index = int(source_to_target_index[source_index])
        if target_to_source_index[target_index] != source_index:
            continue
        if distance > args.maximum_pixel_separation:
            continue
        source_pixel = source_points[source_index]
        target_pixel = target_points[target_index]
        raw.append({
            "sourcePixel": [float(source_pixel[0]), float(source_pixel[1])],
            "targetPixel": [float(target_pixel[0]), float(target_pixel[1])],
            "pixelSeparation": float(distance),
        })

    cell_width = columns / args.grid_size
    cell_height = rows / args.grid_size
    selected = []
    for grid_row in range(args.grid_size):
        for grid_column in range(args.grid_size):
            candidates = [
                item
                for item in raw
                if grid_column * cell_width <= item["sourcePixel"][0] < (grid_column + 1) * cell_width
                and grid_row * cell_height <= item["sourcePixel"][1] < (grid_row + 1) * cell_height
            ]
            candidates.sort(key=lambda item: item["pixelSeparation"])
            accepted_in_cell = []
            for candidate in candidates:
                point = np.asarray(candidate["sourcePixel"], dtype=np.float64)
                if any(
                    np.linalg.norm(point - np.asarray(existing["sourcePixel"])) < 40.0
                    for existing in accepted_in_cell
                ):
                    continue
                accepted_in_cell.append(candidate)
                if len(accepted_in_cell) == args.per_grid_cell:
                    break
            selected.extend(accepted_in_cell)

    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])

    def pixel_to_utm(pixel: list[float]) -> list[float]:
        x_value, y_value = pixel
        return [
            minimum_x + (x_value + 0.5) * cell_metres,
            minimum_y + (rows - y_value - 0.5) * cell_metres,
        ]

    records = []
    for index, candidate in enumerate(selected, start=1):
        source_utm = pixel_to_utm(candidate["sourcePixel"])
        target_utm = pixel_to_utm(candidate["targetPixel"])
        records.append({
            "candidateId": f"C{index:02d}",
            **candidate,
            "sourceDeliveredUtmMetres": source_utm,
            "targetNgsCorrectedUtmMetres": target_utm,
            "rawCoordinateDeltaMetres": [
                target_utm[0] - source_utm[0],
                target_utm[1] - source_utm[1],
            ],
            "reviewState": "unreviewed",
        })

    relief_rgb = cv2.cvtColor(relief, cv2.COLOR_GRAY2RGB)
    orthophoto_rgb = cv2.cvtColor(orthophoto_bgr, cv2.COLOR_BGR2RGB)
    panels = []
    for raster, title in [
        (relief_rgb, "LiDAR relief candidates"),
        (orthophoto_rgb, "Orthophoto correspondences"),
    ]:
        panel_image = Image.fromarray(raster)
        output = Image.new("RGB", (columns, rows + header), "white")
        output.paste(panel_image, (0, header))
        draw = ImageDraw.Draw(output)
        draw.text((12, 9), title, fill="black")
        draw.text(
            (12, 31),
            "Automatic queue only. Review feature identity before acceptance.",
            fill=(65, 65, 65),
        )
        for record in records:
            source_x, source_y = record["sourcePixel"]
            target_x, target_y = record["targetPixel"]
            if title.startswith("LiDAR"):
                x_value, y_value, colour = source_x, source_y, (255, 30, 30)
            else:
                x_value, y_value, colour = target_x, target_y, (0, 220, 255)
            y_value += header
            draw.ellipse(
                (x_value - 7, y_value - 7, x_value + 7, y_value + 7),
                outline=colour,
                width=2,
            )
            draw.text((x_value + 9, y_value - 8), record["candidateId"], fill=colour)
        panels.append(output)
    combined = Image.new("RGB", (columns * 2, rows + header), "white")
    combined.paste(panels[0], (0, 0))
    combined.paste(panels[1], (columns, 0))
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    combined.save(args.output_png, format="PNG", optimize=True)

    atlas_outputs: list[dict[str, Any]] = []
    if args.output_atlas_dir is not None:
        requested_ids = None
        if args.atlas_candidate_ids:
            requested_ids = {
                value.strip()
                for value in args.atlas_candidate_ids.split(",")
                if value.strip()
            }
        atlas_outputs = render_candidate_atlas(
            args.output_atlas_dir,
            records,
            relief_rgb,
            orthophoto_rgb,
            requested_ids,
        )

    stable = {
        "reviewInput": {
            "path": str(args.review_json),
            "sha256": hashlib.sha256(review_bytes).hexdigest(),
            "artifactVersion": review["artifactVersion"],
        },
        "parameters": {
            "maximumPixelSeparation": args.maximum_pixel_separation,
            "gridSize": args.grid_size,
            "perGridCell": args.per_grid_cell,
            "minimumWithinCellSpacingPixels": 40.0,
            "cornerDetector": "Shi-Tomasi",
        },
        "candidateCount": len(records),
        "candidates": records,
        "outputPngSha256": sha256_file(args.output_png),
        "atlasOutputs": atlas_outputs,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-hard-structure-control-review-queue",
        "artifactStage": "automatic-candidates-require-semantic-review",
        "artifactVersion": artifact_version(stable),
        **stable,
        "outputPng": str(args.output_png),
        "geometryBoundary": {
            "establishesRegistration": False,
            "acceptedControlCount": 0,
            "note": "Pixel proximity is not proof of common feature identity, temporal stability, or registration accuracy.",
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(records),
        "outputPng": str(args.output_png),
    }, indent=2))


if __name__ == "__main__":
    main()

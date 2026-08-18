#!/usr/bin/env python3
"""Render a world-registration candidate over its source orthophoto.

The renderer consumes projected coordinates from the sealed registration
artifact. It does not duplicate or silently alter the registration transform.
The image is diagnostic only and makes no publication claim.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import cv2
import numpy as np
from pyproj import CRS


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--registration", required=True)
    parser.add_argument("--orthophoto", required=True)
    parser.add_argument("--orthophoto-manifest", required=True)
    parser.add_argument("--sections", nargs="+", required=True)
    parser.add_argument("--row-ids", nargs="+")
    parser.add_argument("--output", required=True)
    parser.add_argument("--padding", type=int, default=20)
    parser.add_argument("--scale", type=int, default=4)
    parser.add_argument("--shift-x-pixels", type=float, default=0.0)
    parser.add_argument("--shift-y-pixels", type=float, default=0.0)
    parser.add_argument("--marker-radius", type=int, default=3)
    parser.add_argument("--label-all", action="store_true")
    return parser.parse_args()


def read_json(path: str) -> dict:
    return json.loads(Path(path).read_text())


def raster_metadata(manifest: dict) -> tuple[dict, str, float, float]:
    if "raster" in manifest:
        raster = manifest["raster"]
        return (
            raster["extent"],
            raster["coordinateReferenceSystem"],
            float(raster["pixelSizeX"]),
            float(raster["pixelSizeY"]),
        )
    export = manifest["export"]
    return (
        export["extent"],
        export["coordinateReferenceSystem"],
        float(export["pixelSizeX"]),
        float(export["pixelSizeY"]),
    )


def main() -> None:
    args = parse_args()
    registration = read_json(args.registration)
    if registration.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("Registration input has the wrong artifact kind")
    manifest = read_json(args.orthophoto_manifest)
    image = cv2.imread(args.orthophoto, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Cannot decode orthophoto: {args.orthophoto}")

    extent, target_crs_text, pixel_size_x, pixel_size_y = raster_metadata(manifest)
    target_crs = CRS.from_user_input(target_crs_text)
    xmin = float(extent["xmin"])
    ymax = float(extent["ymax"])
    provider_x_bearing = float(
        registration["transform"]["providerPositiveXTrueBearingDegrees"]
    )

    selected_rows = [
        row
        for row in registration["rows"]
        if row["sectionId"] in args.sections
        and (args.row_ids is None or row["rowId"] in args.row_ids)
    ]
    if not selected_rows:
        raise ValueError("No selected rows found")

    projected: list[dict] = []
    for row in selected_rows:
        for anchor in row["anchors"]:
            map_x, map_y = map(float, anchor["projectedCoordinateUsSurveyFeet"])
            projected.append(
                {
                    "sectionId": row["sectionId"],
                    "rowId": row["rowId"],
                    "seatId": anchor["seatId"],
                    "pixel": np.asarray(
                        [
                            (map_x - xmin) / pixel_size_x + args.shift_x_pixels,
                            (ymax - map_y) / pixel_size_y + args.shift_y_pixels,
                        ],
                        dtype=float,
                    ),
                }
            )

    points = np.asarray([item["pixel"] for item in projected])
    x0 = max(0, int(math.floor(float(points[:, 0].min()))) - args.padding)
    y0 = max(0, int(math.floor(float(points[:, 1].min()))) - args.padding)
    x1 = min(image.shape[1], int(math.ceil(float(points[:, 0].max()))) + args.padding)
    y1 = min(image.shape[0], int(math.ceil(float(points[:, 1].max()))) + args.padding)
    crop = image[y0:y1, x0:x1].copy()
    crop = cv2.resize(
        crop,
        None,
        fx=args.scale,
        fy=args.scale,
        interpolation=cv2.INTER_NEAREST,
    )

    section_colours: dict[str, tuple[int, int, int]] = {}
    palette = [
        (0, 0, 255),
        (0, 255, 255),
        (255, 0, 255),
        (0, 255, 0),
        (255, 255, 0),
        (255, 128, 0),
    ]
    for index, section_id in enumerate(args.sections):
        section_colours[section_id] = palette[index % len(palette)]

    for item in projected:
        x = int(round((item["pixel"][0] - x0) * args.scale))
        y = int(round((item["pixel"][1] - y0) * args.scale))
        colour = section_colours[item["sectionId"]]
        cv2.circle(
            crop,
            (x, y),
            args.marker_radius,
            colour,
            -1,
            lineType=cv2.LINE_AA,
        )
        seat_number = item["seatId"].rsplit("-", 1)[-1]
        if args.label_all or seat_number in {"1", "12", "13", "22", "24"}:
            label = f'{item["rowId"]}:{seat_number}'
            cv2.putText(
                crop,
                label,
                (x + 4, y - 4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.33,
                colour,
                1,
                cv2.LINE_AA,
            )

    title = (
        f'geodesic provider projection | reference=home candidate | '
        f'x bearing={provider_x_bearing:.6f} deg | {target_crs.to_string()} | '
        f'pixel shift=({args.shift_x_pixels:.2f},{args.shift_y_pixels:.2f}) | '
        f'crop origin=({x0},{y0})'
    )
    cv2.rectangle(crop, (0, 0), (crop.shape[1], 22), (0, 0, 0), -1)
    cv2.putText(
        crop,
        title,
        (6, 15),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.38,
        (255, 255, 255),
        1,
        cv2.LINE_AA,
    )
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output), crop):
        raise ValueError(f"Cannot write review image: {output}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render current provider row anchors on a rotated City design plan.

This is a registration diagnostic only. It does not promote the historical
design-development scan or provider coordinates to measured geometry.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "marlins-provider-city-plan-overlay-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("plan", type=Path)
    parser.add_argument("output_image", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--maximum-elevation-metres", type=float, default=12.0)
    parser.add_argument("--minimum-elevation-metres", type=float, default=0.0)
    parser.add_argument("--pixels-per-metre", type=float, default=8.2)
    parser.add_argument("--rotation-degrees", type=float, default=0.0)
    parser.add_argument("--home-pixel-x", type=float, default=1602.0)
    parser.add_argument("--home-pixel-y", type=float, default=996.0)
    parser.add_argument("--provider-home-x", type=float, default=-9.03707746)
    parser.add_argument("--provider-home-z", type=float, default=-0.011273827)
    parser.add_argument("--point-radius", type=int, default=2)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.maximum_elevation_metres < args.minimum_elevation_metres:
        raise ValueError("Elevation range is inverted")
    if args.pixels_per_metre <= 0:
        raise ValueError("Pixels per metre must be positive")
    if args.point_radius < 1:
        raise ValueError("Point radius must be positive")

    rows = json.loads(args.rows.read_text())
    if rows.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Rows input has the wrong artifact kind")
    if rows.get("stadiumId") != "marlins":
        raise ValueError("Rows input targets the wrong stadium")
    plan = cv2.imread(str(args.plan), cv2.IMREAD_COLOR)
    if plan is None:
        raise ValueError("Could not read plan image")
    rotated = cv2.rotate(plan, cv2.ROTATE_90_CLOCKWISE)

    theta = math.radians(args.rotation_degrees)
    rotation = np.asarray([
        [math.cos(theta), -math.sin(theta)],
        [math.sin(theta), math.cos(theta)],
    ])
    provider_home = np.asarray([args.provider_home_x, args.provider_home_z])
    plan_home = np.asarray([args.home_pixel_x, args.home_pixel_y])

    selected: list[dict[str, Any]] = []
    points: list[np.ndarray] = []
    for row in rows.get("rows", []):
        row_points = []
        for anchor in row.get("anchors", []):
            x_value, elevation, z_value = map(float, anchor["position"])
            if not (
                args.minimum_elevation_metres
                <= elevation
                <= args.maximum_elevation_metres
            ):
                continue
            provider_offset = np.asarray([x_value, -z_value]) - np.asarray([
                provider_home[0],
                -provider_home[1],
            ])
            plan_pixel = plan_home + args.pixels_per_metre * (rotation @ provider_offset)
            row_points.append(plan_pixel)
            points.append(plan_pixel)
        if row_points:
            selected.append({
                "rowKey": row.get("rowKey"),
                "sectionId": row.get("sectionId"),
                "rowId": row.get("rowId"),
                "anchorCount": len(row_points),
                "pixels": [point.tolist() for point in row_points],
            })

    overlay = rotated.copy()
    tint = np.full_like(overlay, (255, 255, 255))
    overlay = cv2.addWeighted(overlay, 0.72, tint, 0.28, 0.0)
    height, width = overlay.shape[:2]
    in_bounds = 0
    for point in points:
        x_pixel, y_pixel = int(round(point[0])), int(round(point[1]))
        if 0 <= x_pixel < width and 0 <= y_pixel < height:
            in_bounds += 1
            cv2.circle(
                overlay,
                (x_pixel, y_pixel),
                args.point_radius,
                (0, 0, 255),
                -1,
                cv2.LINE_AA,
            )
    cv2.drawMarker(
        overlay,
        (int(round(plan_home[0])), int(round(plan_home[1]))),
        (255, 0, 0),
        cv2.MARKER_CROSS,
        24,
        2,
        cv2.LINE_AA,
    )
    args.output_image.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_image), overlay, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write overlay image")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": {
            "rows": {
                "path": str(args.rows),
                "sha256": sha256_file(args.rows),
                "artifactVersion": rows.get("artifactVersion"),
            },
            "plan": {
                "path": str(args.plan),
                "sha256": sha256_file(args.plan),
                "rotation": "90-degrees-clockwise",
            },
        },
        "transform": {
            "operation": "provider x and negative z offsets mapped to rotated plan pixels",
            "providerHomePositionMetres": [args.provider_home_x, args.provider_home_z],
            "planHomePixel": [args.home_pixel_x, args.home_pixel_y],
            "pixelsPerMetre": args.pixels_per_metre,
            "rotationDegrees": args.rotation_degrees,
            "rotationMatrix": rotation.tolist(),
        },
        "selection": {
            "minimumElevationMetres": args.minimum_elevation_metres,
            "maximumElevationMetres": args.maximum_elevation_metres,
            "rowCount": len(selected),
            "anchorCount": len(points),
            "inBoundsAnchorCount": in_bounds,
        },
        "rows": selected,
        "outputImage": {
            "path": str(args.output_image),
            "sha256": sha256_file(args.output_image),
            "dimensionsPixels": [width, height],
        },
        "geometryBoundary": {
            "diagnosticOverlayOnly": True,
            "establishesMetricRegistration": False,
            "establishesMeasuredRowGeometry": False,
            "establishesCurrentAsBuiltGeometry": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "TRANSFORM_PARAMETERS_NOT_INDEPENDENTLY_FIT",
                "PLAN_IS_HISTORICAL_DESIGN_DEVELOPMENT",
                "PLAN_SCAN_UNCERTAINTY_NOT_QUANTIFIED",
                "CURRENT_AS_BUILT_ROW_GEOMETRY_NOT_ESTABLISHED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-provider-city-plan-overlay-diagnostic",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputImage": str(args.output_image),
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "transform": artifact["transform"],
        "selection": artifact["selection"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

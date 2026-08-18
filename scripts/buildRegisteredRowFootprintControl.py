#!/usr/bin/env python3
"""Build narrow metric row-footprint polygons from a registered seat-row artifact.

The polygons are analysis masks around provider seat centers. They do not add
row elevation, row-boundary truth, or publication eligibility to the source.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from pyproj import CRS, Transformer


ANALYSIS_VERSION = "registered-seat-row-footprint-control-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--source-crs", default="EPSG:6428")
    parser.add_argument("--target-crs", required=True)
    parser.add_argument("--half-width-metres", type=float, default=0.55)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def unit_normal(
    previous: tuple[float, float],
    following: tuple[float, float],
) -> tuple[float, float]:
    delta_x = following[0] - previous[0]
    delta_y = following[1] - previous[1]
    length = math.hypot(delta_x, delta_y)
    if length <= 1e-9:
        return 0.0, 1.0
    return -delta_y / length, delta_x / length


def buffered_row_ring(
    points: list[tuple[float, float]],
    half_width_metres: float,
) -> list[list[float]]:
    if len(points) == 1:
        x, y = points[0]
        return [
            [x - half_width_metres, y - half_width_metres],
            [x + half_width_metres, y - half_width_metres],
            [x + half_width_metres, y + half_width_metres],
            [x - half_width_metres, y + half_width_metres],
            [x - half_width_metres, y - half_width_metres],
        ]
    positive: list[list[float]] = []
    negative: list[list[float]] = []
    for index, (x, y) in enumerate(points):
        previous = points[max(0, index - 1)]
        following = points[min(len(points) - 1, index + 1)]
        normal_x, normal_y = unit_normal(previous, following)
        positive.append([
            x + normal_x * half_width_metres,
            y + normal_y * half_width_metres,
        ])
        negative.append([
            x - normal_x * half_width_metres,
            y - normal_y * half_width_metres,
        ])
    ring = positive + list(reversed(negative))
    ring.append(list(ring[0]))
    return ring


def main() -> None:
    args = parse_args()
    if args.half_width_metres <= 0:
        raise ValueError("Row footprint half-width must be positive")
    source = json.loads(args.input.read_text())
    source_crs = CRS.from_user_input(args.source_crs)
    target_crs = CRS.from_user_input(args.target_crs)
    transformer = Transformer.from_crs(source_crs, target_crs, always_xy=True)

    features: list[dict[str, Any]] = []
    seat_count = 0
    for row in source.get("rows", []):
        seats = sorted(row.get("seats", []), key=lambda seat: int(seat["providerOrder"]))
        source_points = [
            (
                float(seat["positionProjectedFeet"][0]),
                float(seat["positionProjectedFeet"][1]),
            )
            for seat in seats
        ]
        if not source_points:
            continue
        xs, ys = transformer.transform(
            [point[0] for point in source_points],
            [point[1] for point in source_points],
        )
        target_points = [(float(x), float(y)) for x, y in zip(xs, ys)]
        ring = buffered_row_ring(target_points, args.half_width_metres)
        features.append({
            "attributes": {
                "rowKey": row.get("rowKey"),
                "sectionName": row.get("sectionName"),
                "rowName": row.get("rowName"),
                "seatCount": len(seats),
            },
            "geometry": {"rings": [ring]},
        })
        seat_count += len(seats)

    parameters = {
        "sourceCrs": source_crs.to_string(),
        "targetCrs": target_crs.to_string(),
        "halfWidthMetres": args.half_width_metres,
    }
    stable = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "registered-row-analysis-mask",
        "source": {
            "path": str(args.input),
            "sha256": file_sha256(args.input),
            "artifactVersion": source.get("artifactVersion"),
        },
        "parameters": parameters,
        "targetCoordinateReferenceSystemWkt": target_crs.to_wkt(),
        "rowCount": len(features),
        "seatCount": seat_count,
        "features": features,
        "publicationEligible": False,
        "blockers": [
            "MASK_WIDTH_IS_ANALYTICAL_NOT_SURVEYED",
            "ROW_BOUNDARIES_NOT_INDEPENDENTLY_VERIFIED",
            "ROW_ELEVATIONS_NOT_MEASURED",
        ],
    }
    result = {
        **stable,
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": result["artifactVersion"],
        "rowCount": len(features),
        "seatCount": seat_count,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

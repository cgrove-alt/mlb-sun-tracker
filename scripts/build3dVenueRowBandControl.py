#!/usr/bin/env python3
"""Build analysis-only metric row bands from registered provider row anchors."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
from pyproj import CRS, Transformer

from audit3dVenueRowsAgainstOpenRoofLidar import stable_version


ANALYSIS_VERSION = "3ddv-registered-row-band-control-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def segment_rectangle(
    first: tuple[float, float],
    second: tuple[float, float],
    half_width: float,
) -> list[list[float]]:
    delta_x = second[0] - first[0]
    delta_y = second[1] - first[1]
    length = math.hypot(delta_x, delta_y)
    if length <= 1e-9:
        raise ValueError("Row anchor segment has zero plan length")
    normal_x = -delta_y / length * half_width
    normal_y = delta_x / length * half_width
    return [
        [first[0] + normal_x, first[1] + normal_y],
        [second[0] + normal_x, second[1] + normal_y],
        [second[0] - normal_x, second[1] - normal_y],
        [first[0] - normal_x, first[1] - normal_y],
        [first[0] + normal_x, first[1] + normal_y],
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--half-width-metres", type=float, default=0.4)
    arguments = parser.parse_args()
    if arguments.half_width_metres <= 0:
        raise ValueError("Row-band half width must be positive")

    world: dict[str, Any] = json.loads(arguments.world_rows.read_text())
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    with laspy.open(arguments.lidar) as reader:
        embedded = reader.header.parse_crs()
    if embedded is None:
        raise ValueError("LiDAR input has no embedded CRS")
    source_crs = CRS.from_user_input(embedded)
    horizontal_crs = CRS.from_user_input(
        source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
    )
    transformer = Transformer.from_crs(6438, horizontal_crs, always_xy=True)

    features: list[dict[str, Any]] = []
    row_segment_counts: dict[str, int] = {}
    for row in world["rows"]:
        anchors = [
            transformer.transform(*anchor["projectedCoordinateUsSurveyFeet"])
            for anchor in row["anchors"]
        ]
        segment_count = 0
        for index, (first, second) in enumerate(zip(anchors, anchors[1:])):
            ring = segment_rectangle(first, second, arguments.half_width_metres)
            features.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "segmentIndex": index,
                "geometry": {"rings": [ring]},
            })
            segment_count += 1
        row_segment_counts[row["rowKey"]] = segment_count

    inputs = {
        "worldRowsPath": str(arguments.world_rows.resolve()),
        "worldRowsSha256": sha256_file(arguments.world_rows),
        "worldRowsArtifactVersion": world.get("artifactVersion"),
        "lidarPath": str(arguments.lidar.resolve()),
        "lidarSha256": sha256_file(arguments.lidar),
    }
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": world["stadiumId"],
        "inputs": inputs,
        "halfWidthMetres": arguments.half_width_metres,
        "features": features,
    }
    result = {
        "schemaVersion": 1,
        "artifactKind": "3ddv-registered-row-band-analysis-control",
        "artifactVersion": stable_version(stable),
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": world["stadiumId"],
        "inputs": inputs,
        "coordinateReferenceSystem": horizontal_crs.to_wkt(),
        "parameters": {
            "halfWidthMetres": arguments.half_width_metres,
            "construction": "closed rectangle around every consecutive provider anchor segment",
        },
        "rowCount": len(world["rows"]),
        "segmentCount": len(features),
        "rowSegmentCounts": row_segment_counts,
        "features": features,
        "assessment": {
            "analysisBoundsEligible": True,
            "measuredRowGeometryEligible": False,
            "publicationEligible": False,
            "blockers": [
                "PROVIDER_ROW_REGISTRATION_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
                "ROW_BAND_WIDTH_IS_ANALYSIS_ONLY",
                "SEATING_TREAD_SEMANTIC_IDENTITY_NOT_ESTABLISHED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": result["artifactVersion"],
        "rowCount": result["rowCount"],
        "segmentCount": result["segmentCount"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

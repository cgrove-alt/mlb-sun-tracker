#!/usr/bin/env python3
"""Extract a stadium candidate from Miami-Dade's public 3D building archive.

The source is explicitly approximate and not suitable for surveying or
engineering. This script therefore preserves it as a dated comparison prior
and never promotes it to publication geometry.
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import math
import struct
from pathlib import Path
from typing import Any

import numpy as np
from pyogrio import raw
from pyproj import Transformer


ANALYSIS_VERSION = "miami-dade-building-model-candidate-v1"
SOURCE_ITEM_ID = "ab4d3a61e60c441bbfc1098d701fc991"
SCENE_ITEM_ID = "ce420278a45a4bf4a349c37c197263b3"
EXPECTED_LAYER = "BuildingModel3D"
EXPECTED_SOURCE_CRS = "EPSG:3857"
TARGET_CRS = "EPSG:6438"
US_SURVEY_FEET_PER_METRE = 3937.0 / 1200.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_bytes())


def read_gzip_json(path: Path) -> dict[str, Any]:
    with gzip.open(path, "rt", encoding="utf-8") as source:
        return json.load(source)


def read_uint32(data: bytes, offset: int, endian: str) -> tuple[int, int]:
    return struct.unpack_from(f"{endian}I", data, offset)[0], offset + 4


def read_float64(data: bytes, offset: int, endian: str) -> tuple[float, int]:
    return struct.unpack_from(f"{endian}d", data, offset)[0], offset + 8


def read_header(data: bytes, offset: int) -> tuple[str, int, bool, int]:
    endian = "<" if data[offset] == 1 else ">"
    raw_type, offset = read_uint32(data, offset + 1, endian)
    has_z = bool(raw_type & 0x80000000) or (raw_type // 1000) % 10 in (1, 3)
    return endian, raw_type & 0xFF, has_z, offset


def parse_polygon(
    data: bytes,
    offset: int,
) -> tuple[list[list[tuple[float, float, float | None]]], int]:
    endian, geometry_type, has_z, offset = read_header(data, offset)
    if geometry_type != 3:
        raise ValueError(f"Expected polygon WKB, found type {geometry_type}")
    ring_count, offset = read_uint32(data, offset, endian)
    rings: list[list[tuple[float, float, float | None]]] = []
    for _ in range(ring_count):
        point_count, offset = read_uint32(data, offset, endian)
        ring: list[tuple[float, float, float | None]] = []
        for _ in range(point_count):
            x, offset = read_float64(data, offset, endian)
            y, offset = read_float64(data, offset, endian)
            z = None
            if has_z:
                z, offset = read_float64(data, offset, endian)
            ring.append((x, y, z))
        rings.append(ring)
    return rings, offset


def parse_multipolygon(
    data: bytes,
) -> list[list[list[tuple[float, float, float | None]]]]:
    endian, geometry_type, _, offset = read_header(data, 0)
    if geometry_type != 6:
        raise ValueError(f"Expected multipolygon WKB, found type {geometry_type}")
    polygon_count, offset = read_uint32(data, offset, endian)
    polygons: list[list[list[tuple[float, float, float | None]]]] = []
    for _ in range(polygon_count):
        polygon, offset = parse_polygon(data, offset)
        polygons.append(polygon)
    if offset != len(data):
        raise ValueError("WKB parser did not consume the complete geometry")
    return polygons


def summarize_feature(
    fid: int,
    attributes: dict[str, Any],
    geometry: bytes,
    transformer: Transformer,
    anchor_x_feet: float,
    anchor_y_feet: float,
) -> tuple[dict[str, Any], list[list[list[tuple[float, float, float | None]]]]]:
    polygons = parse_multipolygon(geometry)
    points = [point for polygon in polygons for ring in polygon for point in ring]
    if not points:
        raise ValueError(f"Feature {fid} has no vertices")
    projected_x, projected_y = transformer.transform(
        [point[0] for point in points],
        [point[1] for point in points],
    )
    z_values = [point[2] for point in points if point[2] is not None]
    if len(z_values) != len(points):
        raise ValueError(f"Feature {fid} is not consistently three-dimensional")
    bounds = [
        float(min(projected_x)),
        float(min(projected_y)),
        float(max(projected_x)),
        float(max(projected_y)),
    ]
    center = [(bounds[0] + bounds[2]) / 2.0, (bounds[1] + bounds[3]) / 2.0]
    z_min = float(min(z_values))
    z_max = float(max(z_values))
    z_span = z_max - z_min
    attribute_height = float(attributes["HEIGHT"])
    return ({
        "featureId": fid,
        "attributes": attributes,
        "polygonCount": len(polygons),
        "ringCount": sum(len(polygon) for polygon in polygons),
        "vertexCount": len(points),
        "wkbByteLength": len(geometry),
        "projectedBoundsFeet": bounds,
        "projectedWidthFeet": bounds[2] - bounds[0],
        "projectedHeightFeet": bounds[3] - bounds[1],
        "boundsCenterProjectedFeet": center,
        "anchorToBoundsCenterFeet": math.hypot(
            center[0] - anchor_x_feet,
            center[1] - anchor_y_feet,
        ),
        "rawZ": {
            "minimum": z_min,
            "maximum": z_max,
            "span": z_span,
            "attributeHeight": attribute_height,
            "absoluteSpanMinusAttributeHeight": abs(z_span - attribute_height),
        },
    }, polygons)


def render_candidate(
    path: Path,
    polygons: list[list[list[tuple[float, float, float | None]]]],
    transformer: Transformer,
    anchor_x_feet: float,
    anchor_y_feet: float,
) -> None:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.collections import PolyCollection

    shapes: list[list[tuple[float, float]]] = []
    colours: list[float] = []
    for polygon in polygons:
        for ring in polygon:
            if len(ring) < 4:
                continue
            x, y = transformer.transform(
                [point[0] for point in ring],
                [point[1] for point in ring],
            )
            shapes.append([
                (float(px - anchor_x_feet), float(py - anchor_y_feet))
                for px, py in zip(x, y)
            ])
            colours.append(float(np.mean([point[2] for point in ring])))
    figure, axis = plt.subplots(figsize=(9, 9), constrained_layout=True)
    collection = PolyCollection(
        shapes,
        array=np.asarray(colours),
        cmap="viridis",
        edgecolors="none",
    )
    axis.add_collection(collection)
    axis.scatter([0], [0], c="red", marker="+", s=100, label="stadium anchor")
    axis.autoscale_view()
    axis.set_aspect("equal", adjustable="box")
    axis.set_xlabel("east feet from stadium anchor")
    axis.set_ylabel("north feet from stadium anchor")
    axis.set_title("Miami-Dade 2015 stadium multipatch candidate, top view")
    axis.legend(loc="upper right")
    colour_bar = figure.colorbar(collection, ax=axis, shrink=0.75)
    colour_bar.set_label("raw source Z, inferred feet")
    path.parent.mkdir(parents=True, exist_ok=True)
    figure.savefig(path, dpi=180)
    plt.close(figure)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive", type=Path, required=True)
    parser.add_argument("--source-item", type=Path, required=True)
    parser.add_argument("--scene-item", type=Path, required=True)
    parser.add_argument("--scene-layer", type=Path, required=True)
    parser.add_argument("--anchor-x-feet", type=float, required=True)
    parser.add_argument("--anchor-y-feet", type=float, required=True)
    parser.add_argument("--search-radius-metres", type=float, default=350.0)
    parser.add_argument("--minimum-height", type=float, default=80.0)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--render", type=Path)
    args = parser.parse_args()

    if args.search_radius_metres <= 0 or args.minimum_height <= 0:
        raise ValueError("Search radius and minimum height must be positive")
    archive = args.archive.resolve()
    source_item_path = args.source_item.resolve()
    scene_item_path = args.scene_item.resolve()
    scene_layer_path = args.scene_layer.resolve()
    source_item = read_json(source_item_path)
    scene_item = read_json(scene_item_path)
    scene_layer = read_gzip_json(scene_layer_path)
    if source_item.get("id") != SOURCE_ITEM_ID:
        raise ValueError("Unexpected source ArcGIS item")
    if scene_item.get("id") != SCENE_ITEM_ID:
        raise ValueError("Unexpected scene ArcGIS item")
    if source_item.get("type") != "File Geodatabase" or source_item.get("access") != "public":
        raise ValueError("Source ArcGIS item is not the expected public geodatabase")
    if int(source_item.get("size", -1)) != archive.stat().st_size:
        raise ValueError("Downloaded archive byte length does not match the ArcGIS item")
    if scene_layer.get("heightModelInfo", {}).get("ellipsoid") != "NAVD_1988":
        raise ValueError("Scene layer does not declare the expected NAVD88 height model")

    to_web_mercator = Transformer.from_crs(TARGET_CRS, EXPECTED_SOURCE_CRS, always_xy=True)
    to_target = Transformer.from_crs(EXPECTED_SOURCE_CRS, TARGET_CRS, always_xy=True)
    anchor_web_x, anchor_web_y = to_web_mercator.transform(
        args.anchor_x_feet,
        args.anchor_y_feet,
    )
    virtual_path = f"/vsizip/{archive}"
    metadata, fids, geometries, fields = raw.read(
        virtual_path,
        layer=EXPECTED_LAYER,
        bbox=(
            anchor_web_x - args.search_radius_metres,
            anchor_web_y - args.search_radius_metres,
            anchor_web_x + args.search_radius_metres,
            anchor_web_y + args.search_radius_metres,
        ),
        where=f"HEIGHT >= {args.minimum_height:g}",
        return_fids=True,
    )
    if metadata.get("crs") != EXPECTED_SOURCE_CRS:
        raise ValueError(f"Unexpected source layer CRS: {metadata.get('crs')}")
    field_names = [str(value) for value in metadata["fields"]]
    candidates: list[dict[str, Any]] = []
    candidate_polygons: list[list[list[list[tuple[float, float, float | None]]]]] = []
    for index, fid in enumerate(fids):
        attributes = {}
        for field_name, values in zip(field_names, fields):
            value = values[index]
            attributes[field_name] = value.item() if hasattr(value, "item") else value
        summary, polygons = summarize_feature(
            int(fid),
            attributes,
            geometries[index],
            to_target,
            args.anchor_x_feet,
            args.anchor_y_feet,
        )
        candidates.append(summary)
        candidate_polygons.append(polygons)
    if not candidates:
        raise ValueError("No candidate building features were found")
    selected_index = max(
        range(len(candidates)),
        key=lambda index: (
            candidates[index]["projectedWidthFeet"]
            * candidates[index]["projectedHeightFeet"],
            -candidates[index]["anchorToBoundsCenterFeet"],
        ),
    )
    selected = candidates[selected_index]
    if int(selected["attributes"]["YEARUPDATE"]) != 2015:
        raise ValueError("Selected stadium feature does not have the expected 2015 update year")
    if selected["rawZ"]["absoluteSpanMinusAttributeHeight"] > 5.0:
        raise ValueError("Raw source Z span is inconsistent with the height attribute")

    archive_sha256 = sha256_file(archive)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": {
            "archiveSha256": archive_sha256,
            "sourceItemSha256": sha256_file(source_item_path),
            "sceneItemSha256": sha256_file(scene_item_path),
            "sceneLayerSha256": sha256_file(scene_layer_path),
        },
        "anchorProjectedFeet": [args.anchor_x_feet, args.anchor_y_feet],
        "candidates": candidates,
        "selectedFeatureId": selected["featureId"],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "miami-dade-3d-building-stadium-candidate",
        "artifactVersion": stable_sha256(stable),
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": {
            "archivePath": str(archive),
            "archiveSha256": archive_sha256,
            "archiveByteLength": archive.stat().st_size,
            "sourceItemPath": str(source_item_path),
            "sourceItemSha256": sha256_file(source_item_path),
            "sceneItemPath": str(scene_item_path),
            "sceneItemSha256": sha256_file(scene_item_path),
            "sceneLayerPath": str(scene_layer_path),
            "sceneLayerSha256": sha256_file(scene_layer_path),
        },
        "source": {
            "provider": "Miami-Dade County GIS Technical Support Group",
            "sourceItemId": SOURCE_ITEM_ID,
            "sourceItemCreatedUnixMilliseconds": source_item.get("created"),
            "sourceItemModifiedUnixMilliseconds": source_item.get("modified"),
            "sourceItemTitle": source_item.get("title"),
            "sourceItemAccess": source_item.get("access"),
            "sourceCoordinateReferenceSystem": EXPECTED_SOURCE_CRS,
            "targetCoordinateReferenceSystem": TARGET_CRS,
            "sceneItemId": SCENE_ITEM_ID,
            "sceneServiceUrl": scene_item.get("url"),
            "licenseAndAccuracyDisclaimer": source_item.get("licenseInfo"),
        },
        "search": {
            "anchorProjectedFeet": [args.anchor_x_feet, args.anchor_y_feet],
            "anchorWebMercatorMetres": [anchor_web_x, anchor_web_y],
            "radiusMetres": args.search_radius_metres,
            "minimumHeightAttribute": args.minimum_height,
            "candidateCount": len(candidates),
        },
        "candidates": candidates,
        "selectedStadiumCandidate": selected,
        "verticalUnitAssessment": {
            "rawSourceZUnitExplicitlyDeclared": False,
            "inferredRawSourceZUnit": "foot",
            "inferenceEvidence": [
                "The selected feature raw Z span is within five units of its HEIGHT attribute.",
                "The selected feature minimum raw Z is consistent with local NAVD88 ground elevations.",
                "Treating the raw values as metres would imply an implausible stadium height above 800 feet.",
            ],
            "sceneServiceHeightModel": scene_layer.get("heightModelInfo"),
            "unitInferencePublicationEligible": False,
        },
        "currency": {
            "featureYearUpdate": int(selected["attributes"]["YEARUPDATE"]),
            "establishesCurrent2026Geometry": False,
        },
        "geometryBoundary": {
            "establishesStadiumFeatureCandidate": True,
            "establishesDatedExteriorSurfacePrior": True,
            "establishesCurrentObstructionGeometry": False,
            "establishesRowOrSeatGeometry": False,
            "establishesOverhangUndersides": False,
            "establishesSubFootHorizontalAccuracy": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "SOURCE_FEATURE_DATED_2015",
                "SOURCE_EXPLICITLY_NOT_TO_SURVEY_OR_ENGINEERING_STANDARDS",
                "RAW_VERTICAL_UNIT_INFERRED_NOT_EXPLICIT",
                "CURRENT_GEOMETRY_NOT_ESTABLISHED",
                "ROW_AND_SEAT_GEOMETRY_NOT_ESTABLISHED",
                "OVERHANG_UNDERSIDES_NOT_SEMANTICALLY_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    if args.render:
        render_candidate(
            args.render,
            candidate_polygons[selected_index],
            to_target,
            args.anchor_x_feet,
            args.anchor_y_feet,
        )
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "selectedStadiumCandidate": selected,
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build a checksum-locked local LiDAR acquisition manifest.

The manifest verifies that every LAS file matches its range-acquisition record,
that all files share one coordinate reference system, and that their combined
header bounds cover the full bounding box of the audited stadium footprint.
It does not assert semantic rows, current obstructions, or publication fitness.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import laspy
from pyproj import CRS

from lidar_units import lidar_unit_conversion


ANALYSIS_VERSION = "lidar-project-manifest-v1"
HEADER_EDGE_TOLERANCE_FEET = 0.01


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--project-name", required=True)
    parser.add_argument("--surface-audit", type=Path, required=True)
    parser.add_argument(
        "--acquisition-manifest", type=Path, action="append", required=True
    )
    parser.add_argument("--metadata-evidence", type=Path, action="append", default=[])
    parser.add_argument("--project-source-url", required=True)
    parser.add_argument("--publication-date")
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_version(value: Any) -> str:
    payload = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def merged_intervals_cover(
    intervals: list[tuple[float, float]], minimum: float, maximum: float
) -> bool:
    cursor = minimum
    for start, end in sorted(intervals):
        if end < cursor:
            continue
        if start > cursor + HEADER_EDGE_TOLERANCE_FEET:
            return False
        cursor = max(cursor, end)
        if cursor >= maximum - HEADER_EDGE_TOLERANCE_FEET:
            return True
    return cursor >= maximum - HEADER_EDGE_TOLERANCE_FEET


def rectangles_cover_bbox(
    rectangles: list[tuple[float, float, float, float]],
    footprint: tuple[float, float, float, float],
) -> bool:
    minimum_x, maximum_x, minimum_y, maximum_y = footprint
    boundaries = {minimum_x, maximum_x}
    for tile_minimum_x, tile_maximum_x, _, _ in rectangles:
        if minimum_x < tile_minimum_x < maximum_x:
            boundaries.add(tile_minimum_x)
        if minimum_x < tile_maximum_x < maximum_x:
            boundaries.add(tile_maximum_x)
    ordered = sorted(boundaries)
    for start, end in zip(ordered, ordered[1:]):
        midpoint = (start + end) / 2
        y_intervals = [
            (tile_minimum_y, tile_maximum_y)
            for tile_minimum_x, tile_maximum_x, tile_minimum_y, tile_maximum_y in rectangles
            if tile_minimum_x <= midpoint <= tile_maximum_x
        ]
        if not y_intervals and end - start <= HEADER_EDGE_TOLERANCE_FEET:
            continue
        if not merged_intervals_cover(y_intervals, minimum_y, maximum_y):
            return False
    return True


def main() -> None:
    arguments = parse_args()
    surface_bytes = arguments.surface_audit.read_bytes()
    surface_audit = json.loads(surface_bytes)
    if surface_audit.get("stadiumId") != arguments.stadium_id:
        raise ValueError("Surface audit stadium identifier does not agree")
    if surface_audit.get("analysisVersion") != "lidar-stadium-surface-audit-v4":
        raise ValueError("Surface audit must use the current v4 noise exclusions")

    audited_files = {
        item["localFileSha256"]: item
        for item in surface_audit.get("source", {}).get("files", [])
    }
    tiles: list[dict[str, Any]] = []
    tile_rectangles: list[tuple[float, float, float, float]] = []
    common_crs: CRS | None = None
    acquisition_versions: list[str] = []
    for acquisition_path in arguments.acquisition_manifest:
        acquisition_bytes = acquisition_path.read_bytes()
        acquisition = json.loads(acquisition_bytes)
        if acquisition.get("artifactKind") != "remote-zip-entry-acquisition":
            raise ValueError(f"Wrong acquisition artifact kind: {acquisition_path}")
        output = acquisition.get("output", {})
        lidar_path = Path(output.get("path", ""))
        if not lidar_path.is_file():
            raise FileNotFoundError(lidar_path)
        actual_sha = sha256_file(lidar_path)
        actual_size = lidar_path.stat().st_size
        if actual_sha != output.get("sha256") or actual_size != output.get("byteLength"):
            raise ValueError(f"Acquired LiDAR checksum or size mismatch: {lidar_path}")
        if actual_sha not in audited_files:
            raise ValueError(f"LiDAR tile is absent from the surface audit: {lidar_path}")
        acquisition_versions.append(acquisition["artifactVersion"])

        with laspy.open(lidar_path) as reader:
            tile_crs_value = reader.header.parse_crs()
            if tile_crs_value is None:
                raise ValueError(f"LiDAR tile has no embedded CRS: {lidar_path}")
            tile_crs = CRS.from_user_input(tile_crs_value)
            if common_crs is None:
                common_crs = tile_crs
            elif not tile_crs.equals(common_crs):
                raise ValueError("LiDAR tiles do not share one coordinate reference system")
            units = lidar_unit_conversion(tile_crs)
            minimum_x, minimum_y, minimum_z = (
                float(value) for value in reader.header.mins
            )
            maximum_x, maximum_y, maximum_z = (
                float(value) for value in reader.header.maxs
            )
            bounds_feet = {
                "minimumEast": minimum_x * units.horizontal_native_units_to_feet,
                "maximumEast": maximum_x * units.horizontal_native_units_to_feet,
                "minimumNorth": minimum_y * units.horizontal_native_units_to_feet,
                "maximumNorth": maximum_y * units.horizontal_native_units_to_feet,
                "minimumElevation": minimum_z * units.vertical_native_units_to_feet,
                "maximumElevation": maximum_z * units.vertical_native_units_to_feet,
            }
            tile_rectangles.append(
                (
                    bounds_feet["minimumEast"],
                    bounds_feet["maximumEast"],
                    bounds_feet["minimumNorth"],
                    bounds_feet["maximumNorth"],
                )
            )
            tiles.append(
                {
                    "path": str(lidar_path),
                    "fileName": lidar_path.name,
                    "byteLength": actual_size,
                    "sha256": actual_sha,
                    "pointCount": int(reader.header.point_count),
                    "pointFormat": str(reader.header.point_format),
                    "headerCreationDate": (
                        reader.header.creation_date.isoformat()
                        if reader.header.creation_date is not None
                        else None
                    ),
                    "boundsFeet": {
                        key: round(value, 6) for key, value in bounds_feet.items()
                    },
                    "acquisitionManifestPath": str(acquisition_path),
                    "acquisitionManifestSha256": hashlib.sha256(
                        acquisition_bytes
                    ).hexdigest(),
                    "acquisitionArtifactVersion": acquisition["artifactVersion"],
                    "archiveUrl": acquisition.get("archive", {}).get("resolvedUrl"),
                    "archiveEntry": acquisition.get("entry"),
                }
            )

    if common_crs is None:
        raise ValueError("No LiDAR tiles were supplied")
    if set(audited_files) != {tile["sha256"] for tile in tiles}:
        raise ValueError("Manifest tiles do not exactly match the surface-audit sources")

    coordinate_frame = surface_audit["coordinateFrame"]
    center_x = float(coordinate_frame["centerProjectedXFt"])
    center_y = float(coordinate_frame["centerProjectedYFt"])
    vertices = coordinate_frame["footprintVerticesFtFromStadiumCenter"]
    footprint_bbox = (
        center_x + min(float(vertex[0]) for vertex in vertices),
        center_x + max(float(vertex[0]) for vertex in vertices),
        center_y + min(float(vertex[1]) for vertex in vertices),
        center_y + max(float(vertex[1]) for vertex in vertices),
    )
    if not rectangles_cover_bbox(tile_rectangles, footprint_bbox):
        raise ValueError("LiDAR header bounds do not cover the audited footprint bbox")

    evidence: list[dict[str, Any]] = []
    for evidence_path in arguments.metadata_evidence:
        if not evidence_path.is_file():
            raise FileNotFoundError(evidence_path)
        evidence.append(
            {
                "path": str(evidence_path),
                "byteLength": evidence_path.stat().st_size,
                "sha256": sha256_file(evidence_path),
            }
        )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "lidar-project-acquisition",
        "stadiumId": arguments.stadium_id,
        "projectName": arguments.project_name,
        "projectSourceUrl": arguments.project_source_url,
        "publicationDate": arguments.publication_date,
        "surfaceAudit": {
            "path": str(arguments.surface_audit),
            "sha256": hashlib.sha256(surface_bytes).hexdigest(),
            "analysisInputFingerprintSha256": surface_audit.get(
                "analysisInputFingerprintSha256"
            ),
        },
        "coordinateReferenceSystem": common_crs.to_string(),
        "projectCoverage": {
            "coveragePercent": 100,
            "tileCount": len(tiles),
            "coversStadiumCenter": True,
            "coversDeclaredAuditFootprintBoundingBox": True,
            "declaredAuditFootprintBoundingBoxFeet": {
                "minimumEast": round(footprint_bbox[0], 6),
                "maximumEast": round(footprint_bbox[1], 6),
                "minimumNorth": round(footprint_bbox[2], 6),
                "maximumNorth": round(footprint_bbox[3], 6),
            },
            "coverageMethod": (
                "Exact x-interval sweep over LAS-header rectangles against the "
                "full axis-aligned bounding box of the audited footprint, with a "
                "0.01-foot tolerance for quantized point extents at tile seams."
            ),
            "headerEdgeToleranceFt": HEADER_EDGE_TOLERANCE_FEET,
        },
        "tiles": sorted(tiles, key=lambda item: item["fileName"]),
        "metadataEvidence": sorted(evidence, key=lambda item: item["path"]),
        "geometryBoundary": {
            "establishesChecksumLockedSourceAcquisition": True,
            "establishesDeclaredFootprintFileCoverage": True,
            "establishesSemanticRows": False,
            "establishesCurrentObstructionCompleteness": False,
            "establishesPublicationEligibility": False,
        },
        "publication": {
            "eligible": False,
            "blockers": list(
                dict.fromkeys(
                    [
                        *surface_audit.get("releaseAssessment", {}).get(
                            "blockers", []
                        ),
                        "SEMANTIC_ROWS_NOT_ESTABLISHED",
                        "CURRENT_OBSTRUCTION_COMPLETENESS_NOT_ESTABLISHED",
                        "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
                    ]
                )
            ),
        },
    }
    result = {
        "schemaVersion": 1,
        "artifactVersion": stable_version(stable),
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        **stable,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(
        json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": result["artifactVersion"],
                "tileCount": len(tiles),
                "totalPointCount": sum(tile["pointCount"] for tile in tiles),
                "footprintCoveragePercent": 100,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

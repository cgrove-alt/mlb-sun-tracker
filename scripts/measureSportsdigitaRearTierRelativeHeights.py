#!/usr/bin/env python3
"""Measure rear-tier rail heights by intersecting reviewed image lines with row curves."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image


ANALYSIS_VERSION = "sportsdigita-rear-tier-relative-heights-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def row_number(row_key: str) -> int:
    return int(row_key.split(":", 1)[1])


def rotation(yaw_degrees: float) -> np.ndarray:
    yaw = math.radians(yaw_degrees)
    cosine = math.cos(yaw)
    sine = math.sin(yaw)
    return np.asarray([[cosine, -sine], [sine, cosine]])


def intersect_ray_with_polyline(
    camera: np.ndarray,
    direction: np.ndarray,
    points: np.ndarray,
) -> tuple[float, int, float] | None:
    intersections: list[tuple[float, int, float]] = []
    for segment_index, (first, second) in enumerate(zip(points, points[1:])):
        segment = second - first
        system = np.column_stack((direction, -segment))
        determinant = float(np.linalg.det(system))
        if abs(determinant) < 1e-10:
            continue
        depth, fraction = np.linalg.solve(system, first - camera)
        if depth > 0 and -1e-8 <= fraction <= 1.0 + 1e-8:
            intersections.append((float(depth), segment_index, float(fraction)))
    if not intersections:
        return None
    return min(intersections, key=lambda record: record[0])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("selected_pose", type=Path)
    parser.add_argument("rear_tier_audit", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--samples-per-line", type=int, default=101)
    parser.add_argument("--pixel-uncertainty", type=float, default=2.0)
    arguments = parser.parse_args()
    if arguments.samples_per_line < 3:
        raise ValueError("At least three line samples are required")
    if arguments.pixel_uncertainty <= 0:
        raise ValueError("Pixel uncertainty must be positive")

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    pose_bytes = arguments.selected_pose.read_bytes()
    audit_bytes = arguments.rear_tier_audit.read_bytes()
    rows = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    pose = json.loads(pose_bytes)
    audit = json.loads(audit_bytes)
    if pose.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Selected pose uses an unsupported analysis version")
    if audit.get("analysisVersion") != "sportsdigita-rear-tier-sequence-audit-v1":
        raise ValueError("Rear-tier audit uses an unsupported analysis version")
    if pose["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Provider-row checksum mismatch")
    if pose["inputs"]["rearTierAuditSha256"] != hashlib.sha256(audit_bytes).hexdigest():
        raise ValueError("Selected pose and rear-tier audit checksum mismatch")
    if audit["inputs"]["panoramaManifestSha256"] != hashlib.sha256(
        panorama_bytes
    ).hexdigest():
        raise ValueError("Panorama manifest checksum mismatch")

    section_id = str(pose["sectionId"])
    face = str(audit["face"])
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == section_id
    )
    source = next(record for record in section["images"] if str(record["face"]) == face)
    source_path = Path(source["localPath"])
    if sha256_file(source_path) != source["sha256"]:
        raise ValueError("Cube-face checksum mismatch")
    with Image.open(source_path) as image:
        if image.width != image.height:
            raise ValueError("Cube face must be square")
        face_size = image.width

    section_rows = {
        row_number(row["rowKey"]): np.asarray(
            [seat["eastNorthFeetFromInputCenter"] for seat in row["seats"]],
            dtype=float,
        )
        for row in rows["geometryRows"]
        if str(row["sectionId"]) == section_id
    }
    reference_tier_id = str(audit["referenceVisualTierId"])
    reference_row = row_number(
        pose["selectedTierAssignments"][reference_tier_id]["rowKey"]
    )
    tier_lines = [
        line for line in audit["reviewedLines"] if line["role"] != "rear-guard-rail"
    ]
    if len(tier_lines) != int(audit["rearTierCount"]) + 1:
        raise ValueError("Tier-line count is inconsistent with the rear-tier audit")

    camera_record = pose["selectedPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    rotate = rotation(float(camera_record["yawDegrees"]))
    measured_rows: list[dict[str, Any]] = []
    for sequence_index, line in enumerate(tier_lines):
        provider_row = reference_row + sequence_index
        if provider_row not in section_rows:
            raise ValueError(f"Provider row is absent: {provider_row}")
        x1, y1, x2, y2 = (float(value) for value in line["sourceEndpointsPixels"])
        nominal_heights: list[float] = []
        perturbed_heights: list[float] = []
        intersections: list[dict[str, Any]] = []
        for fraction in np.linspace(0.0, 1.0, arguments.samples_per_line):
            pixel_x = x1 + fraction * (x2 - x1)
            nominal_y = y1 + fraction * (y2 - y1)
            sample_record: dict[str, Any] | None = None
            for offset_y in (-arguments.pixel_uncertainty, 0.0, arguments.pixel_uncertainty):
                pixel_y = nominal_y + offset_y
                u = (pixel_x - face_size / 2.0) / (face_size / 2.0)
                v = (pixel_y - face_size / 2.0) / (face_size / 2.0)
                horizontal = rotate @ np.asarray([u, 1.0])
                intersection = intersect_ray_with_polyline(
                    camera,
                    horizontal,
                    section_rows[provider_row],
                )
                if intersection is None:
                    continue
                depth, segment_index, segment_fraction = intersection
                relative_height = depth * (-v)
                perturbed_heights.append(relative_height)
                if offset_y == 0.0:
                    nominal_heights.append(relative_height)
                    sample_record = {
                        "pixel": [round(pixel_x, 6), round(pixel_y, 6)],
                        "depthFeet": round(depth, 6),
                        "relativeRailHeightFeet": round(relative_height, 6),
                        "providerRowSegmentIndex": segment_index,
                        "providerRowSegmentFraction": round(segment_fraction, 6),
                    }
            if sample_record is not None:
                intersections.append(sample_record)
        if len(nominal_heights) < arguments.samples_per_line // 2:
            raise ValueError(
                f"Too few reviewed-line samples intersect provider row {provider_row}"
            )
        nominal = np.asarray(nominal_heights)
        perturbations = np.asarray(perturbed_heights)
        median_height = float(np.median(nominal))
        p95_internal = float(np.percentile(np.abs(nominal - median_height), 95))
        p95_with_pixel = float(
            np.percentile(np.abs(perturbations - median_height), 95)
        )
        measured_rows.append(
            {
                "rowKey": f"{section_id}:{provider_row}",
                "sourceSequenceId": line["sequenceId"],
                "relativeRailHeightFeet": round(median_height, 6),
                "nominalIntersectionCount": len(nominal_heights),
                "requestedSampleCount": arguments.samples_per_line,
                "withinLineP95Feet": round(p95_internal, 6),
                "lineAndPixelP95Feet": round(p95_with_pixel, 6),
                "nominalMinimumFeet": round(float(np.min(nominal)), 6),
                "nominalMaximumFeet": round(float(np.max(nominal)), 6),
                "sampleIntersections": intersections,
            }
        )
    for index, record in enumerate(measured_rows):
        if index == 0:
            record["riseFromPreviousMeasuredTierFeet"] = None
        else:
            record["riseFromPreviousMeasuredTierFeet"] = round(
                record["relativeRailHeightFeet"]
                - measured_rows[index - 1]["relativeRailHeightFeet"],
                6,
            )
    if any(
        record["riseFromPreviousMeasuredTierFeet"] is not None
        and record["riseFromPreviousMeasuredTierFeet"] <= 0
        for record in measured_rows
    ):
        raise ValueError("Measured rear-tier rail heights are not strictly increasing")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "rowsArtifactVersion": rows.get("artifactVersion"),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
            "selectedPosePath": str(arguments.selected_pose),
            "selectedPoseSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "selectedPoseArtifactVersion": pose["artifactVersion"],
            "rearTierAuditPath": str(arguments.rear_tier_audit),
            "rearTierAuditSha256": hashlib.sha256(audit_bytes).hexdigest(),
            "rearTierAuditArtifactVersion": audit["artifactVersion"],
            "sourcePath": str(source_path.resolve()),
            "sourceSha256": source["sha256"],
        },
        "sectionId": section_id,
        "coordinateFrame": "PROVIDER_LOCAL_FEET_RELATIVE_TO_PANORAMA_CAMERA",
        "featureMeasured": "reviewed continuous seat-tier rail edge",
        "measurementPolicy": {
            "providerRowIntersection": "nearest positive ray intersection with piecewise seat-anchor polyline",
            "samplesPerLine": arguments.samples_per_line,
            "pixelUncertainty": arguments.pixel_uncertainty,
            "automaticTierOrRowSelection": False,
            "absoluteVerticalDatumEstablished": False,
            "railToSeatOrTreadOffsetEstablished": False,
        },
        "measuredRows": measured_rows,
        "summary": {
            "firstMeasuredRow": measured_rows[0]["rowKey"],
            "lastMeasuredRow": measured_rows[-1]["rowKey"],
            "measuredRowCount": len(measured_rows),
            "maximumWithinLineP95Feet": round(
                max(record["withinLineP95Feet"] for record in measured_rows), 6
            ),
            "maximumLineAndPixelP95Feet": round(
                max(record["lineAndPixelP95Feet"] for record in measured_rows), 6
            ),
            "strictlyIncreasingRelativeRailHeights": True,
        },
        "publicationEligible": False,
        "blockers": [
            "ROWS_1_THROUGH_8_RAIL_HEIGHTS_NOT_MEASURED",
            "RAIL_TO_SEAT_OR_TREAD_VERTICAL_OFFSET_NOT_ESTABLISHED",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "rear-tier-relative-height-measurement",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "rowHeights": [
                    {
                        "rowKey": record["rowKey"],
                        "relativeRailHeightFeet": record["relativeRailHeightFeet"],
                        "lineAndPixelP95Feet": record["lineAndPixelP95Feet"],
                    }
                    for record in measured_rows
                ],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

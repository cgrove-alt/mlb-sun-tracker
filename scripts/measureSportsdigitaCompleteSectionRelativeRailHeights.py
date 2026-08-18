#!/usr/bin/env python3
"""Measure reviewed fieldward rails and combine them with reviewed rear rails."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image


ANALYSIS_VERSION = "sportsdigita-complete-section-relative-rail-heights-v1"


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


def cubemap_ray(face: str, pixel_x: float, pixel_y: float, size: int) -> np.ndarray:
    u = (pixel_x - size / 2.0) / (size / 2.0)
    v = (pixel_y - size / 2.0) / (size / 2.0)
    return {
        "f": np.asarray([u, 1.0, -v]),
        "r": np.asarray([1.0, -u, -v]),
        "b": np.asarray([-u, -1.0, -v]),
        "l": np.asarray([-1.0, u, -v]),
        "u": np.asarray([u, v, 1.0]),
        "d": np.asarray([u, -v, -1.0]),
    }[face]


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
    parser.add_argument("candidate_manifest", type=Path)
    parser.add_argument("reviewed_lines", type=Path)
    parser.add_argument("rear_heights", type=Path)
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
    candidate_bytes = arguments.candidate_manifest.read_bytes()
    review_bytes = arguments.reviewed_lines.read_bytes()
    rear_bytes = arguments.rear_heights.read_bytes()
    rows = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    pose = json.loads(pose_bytes)
    candidates = json.loads(candidate_bytes)
    review = json.loads(review_bytes)
    rear = json.loads(rear_bytes)
    if pose.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Selected pose uses an unsupported analysis version")
    if candidates.get("analysisVersion") != "sportsdigita-fieldward-rail-line-candidates-v2":
        raise ValueError("Candidate manifest uses an unsupported analysis version")
    if review.get("analysisVersion") != "reviewed-sportsdigita-fieldward-rail-lines-v1":
        raise ValueError("Reviewed lines use an unsupported analysis version")
    if rear.get("analysisVersion") != "sportsdigita-rear-tier-relative-heights-v1":
        raise ValueError("Rear heights use an unsupported analysis version")
    if pose["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Provider-row checksum mismatch")
    if candidates["inputs"]["panoramaManifestSha256"] != hashlib.sha256(
        panorama_bytes
    ).hexdigest():
        raise ValueError("Candidate panorama checksum mismatch")
    if review["inputs"]["candidateManifestSha256"] != hashlib.sha256(
        candidate_bytes
    ).hexdigest():
        raise ValueError("Reviewed-line candidate checksum mismatch")
    if rear["inputs"]["selectedPoseSha256"] != hashlib.sha256(pose_bytes).hexdigest():
        raise ValueError("Rear-height selected-pose checksum mismatch")

    section_id = str(pose["sectionId"])
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == section_id
    )
    face_sizes: dict[str, int] = {}
    source_sha: dict[str, str] = {}
    for source in section["images"]:
        path = Path(source["localPath"])
        if sha256_file(path) != source["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        with Image.open(path) as image:
            if image.width != image.height:
                raise ValueError("Cube face must be square")
            face_sizes[str(source["face"])] = image.width
        source_sha[str(source["face"])] = source["sha256"]

    candidate_lookup: set[tuple[str, str, tuple[int, int, int, int]]] = set()
    for row_record in candidates["rows"]:
        for candidate in row_record["candidates"]:
            candidate_lookup.add(
                (
                    row_record["rowKey"],
                    candidate["face"],
                    tuple(candidate["sourceEndpointsPixels"]),
                )
            )
    section_rows = {
        row_number(row["rowKey"]): np.asarray(
            [seat["eastNorthFeetFromInputCenter"] for seat in row["seats"]],
            dtype=float,
        )
        for row in rows["geometryRows"]
        if str(row["sectionId"]) == section_id
    }
    camera_record = pose["selectedPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    rotate = rotation(float(camera_record["yawDegrees"]))
    measured_fieldward: list[dict[str, Any]] = []
    for row_review in review["rows"]:
        row_key = str(row_review["rowKey"])
        provider_row = row_number(row_key)
        line_records: list[dict[str, Any]] = []
        line_medians: list[float] = []
        all_perturbed: list[float] = []
        for line_index, line in enumerate(row_review["selectedLines"], start=1):
            face = str(line["face"])
            endpoints = tuple(int(value) for value in line["sourceEndpointsPixels"])
            if (row_key, face, endpoints) not in candidate_lookup:
                raise ValueError(f"Reviewed line is absent from candidate manifest: {row_key}")
            x1, y1, x2, y2 = (float(value) for value in endpoints)
            nominal_heights: list[float] = []
            nominal_samples: list[dict[str, Any]] = []
            for fraction in np.linspace(0.0, 1.0, arguments.samples_per_line):
                pixel_x = x1 + fraction * (x2 - x1)
                pixel_y = y1 + fraction * (y2 - y1)
                nominal_record: dict[str, Any] | None = None
                for offset_x, offset_y in (
                    (0.0, 0.0),
                    (-arguments.pixel_uncertainty, 0.0),
                    (arguments.pixel_uncertainty, 0.0),
                    (0.0, -arguments.pixel_uncertainty),
                    (0.0, arguments.pixel_uncertainty),
                ):
                    ray = cubemap_ray(
                        face,
                        pixel_x + offset_x,
                        pixel_y + offset_y,
                        face_sizes[face],
                    )
                    horizontal = rotate @ ray[:2]
                    intersection = intersect_ray_with_polyline(
                        camera,
                        horizontal,
                        section_rows[provider_row],
                    )
                    if intersection is None:
                        continue
                    depth, segment_index, segment_fraction = intersection
                    relative_height = depth * float(ray[2])
                    all_perturbed.append(relative_height)
                    if offset_x == 0.0 and offset_y == 0.0:
                        nominal_heights.append(relative_height)
                        nominal_record = {
                            "pixel": [round(pixel_x, 6), round(pixel_y, 6)],
                            "depthFeet": round(depth, 6),
                            "relativeRailHeightFeet": round(relative_height, 6),
                            "providerRowSegmentIndex": segment_index,
                            "providerRowSegmentFraction": round(segment_fraction, 6),
                        }
                if nominal_record is not None:
                    nominal_samples.append(nominal_record)
            if len(nominal_heights) < arguments.samples_per_line // 2:
                raise ValueError(f"Too few samples intersect {row_key} line {line_index}")
            nominal = np.asarray(nominal_heights)
            line_median = float(np.median(nominal))
            line_medians.append(line_median)
            line_records.append(
                {
                    "lineIndex": line_index,
                    "face": face,
                    "sourceSha256": source_sha[face],
                    "sourceEndpointsPixels": list(endpoints),
                    "relativeRailHeightFeet": round(line_median, 6),
                    "nominalIntersectionCount": len(nominal_heights),
                    "withinLineP95Feet": round(
                        float(np.percentile(np.abs(nominal - line_median), 95)),
                        6,
                    ),
                    "sampleIntersections": nominal_samples,
                }
            )
        combined_height = float(np.median(np.asarray(line_medians)))
        perturbed = np.asarray(all_perturbed)
        measured_fieldward.append(
            {
                "rowKey": row_key,
                "relativeRailHeightFeet": round(combined_height, 6),
                "reviewedLineCount": len(line_records),
                "betweenLineRangeFeet": round(
                    max(line_medians) - min(line_medians), 6
                ),
                "lineAndPixelP95Feet": round(
                    float(np.percentile(np.abs(perturbed - combined_height), 95)),
                    6,
                ),
                "reviewedLines": line_records,
            }
        )

    rear_rows = [
        {
            "rowKey": record["rowKey"],
            "relativeRailHeightFeet": record["relativeRailHeightFeet"],
            "reviewedLineCount": 1,
            "betweenLineRangeFeet": 0.0,
            "lineAndPixelP95Feet": record["lineAndPixelP95Feet"],
            "sourceArtifact": "reviewed-rear-tier-sequence",
        }
        for record in rear["measuredRows"]
    ]
    complete_rows = sorted(
        measured_fieldward + rear_rows,
        key=lambda record: row_number(record["rowKey"]),
    )
    expected_rows = list(range(1, 18))
    actual_rows = [row_number(record["rowKey"]) for record in complete_rows]
    if actual_rows != expected_rows:
        raise ValueError(f"Complete row coverage failed: {actual_rows}")
    for index, record in enumerate(complete_rows):
        if index == 0:
            record["riseFromPreviousRowFeet"] = None
        else:
            record["riseFromPreviousRowFeet"] = round(
                record["relativeRailHeightFeet"]
                - complete_rows[index - 1]["relativeRailHeightFeet"],
                6,
            )
    if any(
        record["riseFromPreviousRowFeet"] is not None
        and record["riseFromPreviousRowFeet"] <= 0
        for record in complete_rows
    ):
        raise ValueError("Complete rail-height sequence is not strictly increasing")

    badge_offsets: list[dict[str, Any]] = []
    complete_by_row = {
        row_number(record["rowKey"]): record for record in complete_rows
    }
    for tier_id, assignment in pose["selectedTierAssignments"].items():
        provider_row = row_number(assignment["rowKey"])
        badge_height = float(assignment["relativeBadgeHeightFeet"])
        rail_height = float(complete_by_row[provider_row]["relativeRailHeightFeet"])
        badge_offsets.append(
            {
                "tierId": tier_id,
                "rowKey": assignment["rowKey"],
                "partition": assignment["partition"],
                "relativeBadgeHeightFeet": badge_height,
                "relativeRailHeightFeet": rail_height,
                "railToBadgeOffsetFeet": round(rail_height - badge_height, 6),
            }
        )
    offset_values = np.asarray(
        [record["railToBadgeOffsetFeet"] for record in badge_offsets], dtype=float
    )

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
            "candidateManifestPath": str(arguments.candidate_manifest),
            "candidateManifestSha256": hashlib.sha256(candidate_bytes).hexdigest(),
            "candidateArtifactVersion": candidates["artifactVersion"],
            "reviewedLinesPath": str(arguments.reviewed_lines),
            "reviewedLinesSha256": hashlib.sha256(review_bytes).hexdigest(),
            "rearHeightsPath": str(arguments.rear_heights),
            "rearHeightsSha256": hashlib.sha256(rear_bytes).hexdigest(),
            "rearHeightsArtifactVersion": rear["artifactVersion"],
        },
        "sectionId": section_id,
        "coordinateFrame": "PROVIDER_LOCAL_FEET_RELATIVE_TO_PANORAMA_CAMERA",
        "featureMeasured": "reviewed continuous seat-tier rail edge",
        "measurementPolicy": {
            "providerRowIntersection": "nearest positive ray intersection with piecewise seat-anchor polyline",
            "samplesPerLine": arguments.samples_per_line,
            "pixelUncertainty": arguments.pixel_uncertainty,
            "pixelPerturbationDirections": ["left", "right", "up", "down"],
            "automaticLineSelection": False,
            "absoluteVerticalDatumEstablished": False,
            "railToSeatOrTreadOffsetEstablished": False,
        },
        "rows": complete_rows,
        "badgeOffsetDiagnostics": {
            "controls": badge_offsets,
            "medianRailToBadgeOffsetFeet": round(float(np.median(offset_values)), 6),
            "rangeFeet": round(float(np.max(offset_values) - np.min(offset_values)), 6),
            "useRestriction": "Internal consistency only. Rows 7 and 8 search projections used a rail-to-badge offset estimate.",
        },
        "summary": {
            "measuredRowCount": len(complete_rows),
            "providerRowsCovered": actual_rows,
            "providerLocalRelativeRailCoveragePercent": 100.0,
            "strictlyIncreasingRelativeRailHeights": True,
            "maximumLineAndPixelP95Feet": round(
                max(record["lineAndPixelP95Feet"] for record in complete_rows), 6
            ),
            "maximumBetweenLineRangeFeet": round(
                max(record["betweenLineRangeFeet"] for record in complete_rows), 6
            ),
        },
        "publicationEligible": False,
        "blockers": [
            "RAIL_TO_SEAT_OR_TREAD_VERTICAL_OFFSET_NOT_ESTABLISHED",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "complete-section-relative-rail-height-measurement",
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
                "fieldwardRows": [
                    {
                        "rowKey": record["rowKey"],
                        "relativeRailHeightFeet": record["relativeRailHeightFeet"],
                        "lineAndPixelP95Feet": record["lineAndPixelP95Feet"],
                        "betweenLineRangeFeet": record["betweenLineRangeFeet"],
                    }
                    for record in measured_fieldward
                ],
                "badgeOffsetDiagnostics": artifact["badgeOffsetDiagnostics"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

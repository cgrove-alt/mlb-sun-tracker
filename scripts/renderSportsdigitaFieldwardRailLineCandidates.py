#!/usr/bin/env python3
"""Rank image-only Hough segments near search-only fieldward row projections."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-fieldward-rail-line-candidates-v2"


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


def point_to_polyline_distance(point: np.ndarray, polyline: np.ndarray) -> float:
    distances: list[float] = []
    for first, second in zip(polyline, polyline[1:]):
        segment = second - first
        squared_length = float(np.dot(segment, segment))
        if squared_length <= 0:
            distances.append(float(np.linalg.norm(point - first)))
            continue
        fraction = float(np.dot(point - first, segment) / squared_length)
        fraction = max(0.0, min(1.0, fraction))
        nearest = first + fraction * segment
        distances.append(float(np.linalg.norm(point - nearest)))
    return min(distances)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("search_projection", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--top-per-row", type=int, default=8)
    parser.add_argument("--canny-lower", type=int, default=30)
    parser.add_argument("--canny-upper", type=int, default=90)
    parser.add_argument("--hough-threshold", type=int, default=45)
    parser.add_argument("--minimum-line-length", type=int, default=60)
    parser.add_argument("--maximum-line-gap", type=int, default=12)
    parser.add_argument("--minimum-reviewed-length", type=float, default=80.0)
    parser.add_argument("--minimum-horizontal-span", type=float, default=10.0)
    arguments = parser.parse_args()

    search_bytes = arguments.search_projection.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    search = json.loads(search_bytes)
    panorama = json.loads(panorama_bytes)
    if search.get("analysisVersion") != "sportsdigita-fieldward-row-search-projection-v1":
        raise ValueError("Search projection uses an unsupported analysis version")
    if search["inputs"]["panoramaManifestSha256"] != hashlib.sha256(
        panorama_bytes
    ).hexdigest():
        raise ValueError("Panorama manifest checksum mismatch")
    section_id = str(search["sectionId"])
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == section_id
    )
    images: dict[str, np.ndarray] = {}
    source_records: dict[str, dict[str, Any]] = {}
    detections: list[dict[str, Any]] = []
    for source in section["images"]:
        face = str(source["face"])
        path = Path(source["localPath"])
        if sha256_file(path) != source["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {path}")
        images[face] = image
        source_records[face] = source
        edges = cv2.Canny(
            cv2.cvtColor(image, cv2.COLOR_BGR2GRAY),
            arguments.canny_lower,
            arguments.canny_upper,
            L2gradient=True,
        )
        lines = cv2.HoughLinesP(
            edges,
            1,
            np.pi / 720,
            arguments.hough_threshold,
            minLineLength=arguments.minimum_line_length,
            maxLineGap=arguments.maximum_line_gap,
        )
        if lines is None:
            continue
        for raw in lines[:, 0]:
            x1, y1, x2, y2 = (float(value) for value in raw)
            length = math.hypot(x2 - x1, y2 - y1)
            horizontal_span = abs(x2 - x1)
            if length < arguments.minimum_reviewed_length:
                continue
            if horizontal_span < arguments.minimum_horizontal_span:
                continue
            detections.append(
                {
                    "face": face,
                    "sourceEndpointsPixels": [int(x1), int(y1), int(x2), int(y2)],
                    "lengthPixels": length,
                    "angleDegrees": math.degrees(math.atan2(y2 - y1, x2 - x1)),
                }
            )

    ranked_by_row: list[dict[str, Any]] = []
    for provider_row in range(1, 9):
        candidates: list[dict[str, Any]] = []
        for face in images:
            projected = [
                record["pixel"]
                for record in search["projectedSeats"]
                if row_number(record["rowKey"]) == provider_row
                and record["face"] == face
            ]
            if len(projected) < 3:
                continue
            projected_polyline = np.asarray(projected, dtype=float)
            for detection in detections:
                if detection["face"] != face:
                    continue
                x1, y1, x2, y2 = detection["sourceEndpointsPixels"]
                samples = np.asarray(
                    [[x1, y1], [(x1 + x2) / 2.0, (y1 + y2) / 2.0], [x2, y2]],
                    dtype=float,
                )
                distance = float(
                    np.mean(
                        [
                            point_to_polyline_distance(sample, projected_polyline)
                            for sample in samples
                        ]
                    )
                )
                candidates.append(
                    {
                        **detection,
                        "meanEuclideanDistanceFromSearchProjectionPixels": distance,
                    }
                )
        candidates.sort(
            key=lambda record: (
                record["meanEuclideanDistanceFromSearchProjectionPixels"],
                -record["lengthPixels"],
                record["face"],
                record["sourceEndpointsPixels"],
            )
        )
        ranked_by_row.append(
            {
                "rowKey": f"{section_id}:{provider_row}",
                "candidates": [
                    {
                        **record,
                        "lengthPixels": round(record["lengthPixels"], 6),
                        "angleDegrees": round(record["angleDegrees"], 6),
                        "meanEuclideanDistanceFromSearchProjectionPixels": round(
                            record["meanEuclideanDistanceFromSearchProjectionPixels"],
                            6,
                        ),
                    }
                    for record in candidates[: arguments.top_per_row]
                ],
            }
        )

    overlays = {face: image.copy() for face, image in images.items()}
    colors = [
        (0, 0, 255),
        (0, 128, 255),
        (0, 255, 255),
        (0, 255, 0),
        (255, 255, 0),
        (255, 0, 0),
        (255, 0, 255),
        (255, 255, 255),
    ]
    for row_record in ranked_by_row:
        provider_row = row_number(row_record["rowKey"])
        color = colors[provider_row - 1]
        for rank, candidate in enumerate(row_record["candidates"], start=1):
            face = candidate["face"]
            x1, y1, x2, y2 = candidate["sourceEndpointsPixels"]
            thickness = 4 if rank == 1 else 2
            cv2.line(overlays[face], (x1, y1), (x2, y2), color, thickness, cv2.LINE_AA)
            cv2.putText(
                overlays[face],
                f"R{provider_row}.{rank}",
                (x1 + 4, max(16, y1 - 5)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.46,
                color,
                1,
                cv2.LINE_AA,
            )
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    outputs: list[dict[str, Any]] = []
    for face, overlay in overlays.items():
        path = arguments.output_directory / f"section-{section_id}-{face}-rail-line-candidates.png"
        if not cv2.imwrite(str(path), overlay, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
            raise ValueError(f"Could not write {path}")
        outputs.append(
            {
                "face": face,
                "sourcePath": str(Path(source_records[face]["localPath"]).resolve()),
                "sourceSha256": source_records[face]["sha256"],
                "path": str(path.resolve()),
                "sha256": sha256_file(path),
            }
        )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "searchProjectionPath": str(arguments.search_projection),
            "searchProjectionSha256": hashlib.sha256(search_bytes).hexdigest(),
            "searchProjectionArtifactVersion": search["artifactVersion"],
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
        },
        "sectionId": section_id,
        "parameters": {
            "cannyLowerThreshold": arguments.canny_lower,
            "cannyUpperThreshold": arguments.canny_upper,
            "cannyL2Gradient": True,
            "houghRhoPixels": 1,
            "houghThetaRadians": float(np.pi / 720),
            "houghThreshold": arguments.hough_threshold,
            "minimumLineLengthPixels": arguments.minimum_line_length,
            "maximumLineGapPixels": arguments.maximum_line_gap,
            "minimumReviewedLengthPixels": arguments.minimum_reviewed_length,
            "minimumHorizontalSpanPixels": arguments.minimum_horizontal_span,
            "topCandidatesPerRow": arguments.top_per_row,
        },
        "selectionPolicy": {
            "searchProjectionUse": "finite candidate ranking only",
            "houghDetectionUsesSourcePixelsOnly": True,
            "automaticRailSelection": False,
            "manualPhysicalFeatureReviewRequired": True,
        },
        "rows": ranked_by_row,
        "outputs": outputs,
        "publicationEligible": False,
        "blockers": [
            "CANDIDATE_LINES_REQUIRE_MANUAL_PHYSICAL_FEATURE_REVIEW",
            "ROWS_1_THROUGH_8_RAIL_HEIGHTS_NOT_MEASURED",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "fieldward-rail-line-candidates",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(manifest_path),
                "artifactVersion": artifact["artifactVersion"],
                "candidateCounts": {
                    record["rowKey"]: len(record["candidates"])
                    for record in ranked_by_row
                },
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

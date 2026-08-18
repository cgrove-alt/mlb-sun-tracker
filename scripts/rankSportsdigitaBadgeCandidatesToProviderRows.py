#!/usr/bin/env python3
"""Rank image-only badge candidates against fixed provider-local seat rays.

The camera pose is held fixed. Candidate pixels are not used to refit it. A
horizontal ray can rank provider seat anchors without assuming a row height,
but ranking alone cannot assign a printed seat number or establish row identity.
Those decisions require native-image review and disjoint validation.
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


ANALYSIS_VERSION = "sportsdigita-badge-to-provider-ray-ranking-v4"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def cubemap_ray(face: str, pixel: np.ndarray, size: int) -> np.ndarray:
    u = (float(pixel[0]) - size / 2.0) / (size / 2.0)
    v = (float(pixel[1]) - size / 2.0) / (size / 2.0)
    by_face = {
        "f": np.asarray([u, 1.0, -v]),
        "r": np.asarray([1.0, -u, -v]),
        "b": np.asarray([-u, -1.0, -v]),
        "l": np.asarray([-1.0, u, -v]),
        "u": np.asarray([u, v, 1.0]),
        "d": np.asarray([u, -v, -1.0]),
    }
    ray = by_face[face]
    return ray / np.linalg.norm(ray)


def rotation(yaw_radians: float) -> np.ndarray:
    cosine = math.cos(yaw_radians)
    sine = math.sin(yaw_radians)
    return np.asarray([[cosine, -sine], [sine, cosine]])


def parse_csv(value: str) -> set[str]:
    return {part.strip() for part in value.split(",") if part.strip()}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("solution", type=Path)
    parser.add_argument("candidate_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--top-matches", type=int, default=8)
    parser.add_argument("--review-residual-feet", type=float, default=0.6)
    parser.add_argument("--minimum-review-area", type=float, default=250.0)
    parser.add_argument("--maximum-review-candidates", type=int, default=300)
    parser.add_argument("--exclude-best-row-keys", default="")
    parser.add_argument("--minimum-distinct-row-gap-feet", type=float, default=0.0)
    parser.add_argument("--provider-sections", default="")
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    solution_bytes = arguments.solution.read_bytes()
    candidate_bytes = arguments.candidate_manifest.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    solution = json.loads(solution_bytes)
    candidate_artifact = json.loads(candidate_bytes)
    if solution.get("analysisVersion") != "sportsdigita-cubemap-provider-row-bundle-v1":
        raise ValueError("Solution uses an unsupported analysis version")
    if candidate_artifact.get("analysisVersion") != "sportsdigita-seat-badge-candidates-v1":
        raise ValueError("Candidate manifest uses an unsupported analysis version")
    if solution["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Row SHA-256 does not match the solution")
    if solution["inputs"]["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the solution")
    if candidate_artifact["sourceManifest"]["sha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the candidate manifest")

    section_id = str(solution["sectionId"])
    camera_record = solution["cameraPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    rotate = rotation(math.radians(float(camera_record["yawDegrees"])))
    requested_provider_sections = parse_csv(arguments.provider_sections)
    if not requested_provider_sections:
        requested_provider_sections = {section_id}
    provider_seats: list[dict[str, Any]] = []
    for row in rows_artifact["geometryRows"]:
        if str(row["sectionId"]) not in requested_provider_sections:
            continue
        for seat in row["seats"]:
            provider_seats.append(
                {
                    "rowKey": row["rowKey"],
                    "seatLabel": str(seat["seatLabel"]),
                    "position": np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float),
                }
            )

    source_section = next(
        record for record in panorama["sections"] if str(record["sectionId"]) == section_id
    )
    source_images = {record["face"]: record for record in source_section["images"]}
    candidates_by_face = {
        record["face"]: record
        for record in candidate_artifact["images"]
        if str(record["sectionId"]) == section_id
    }
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    ranked: list[dict[str, Any]] = []
    decoded_images: dict[str, np.ndarray] = {}
    for face, candidate_image in candidates_by_face.items():
        source = source_images[face]
        source_path = Path(source["localPath"])
        if sha256_file(source_path) != source["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {source_path}")
        if candidate_image["sourceSha256"] != source["sha256"]:
            raise ValueError(f"Candidate source checksum mismatch on face {face}")
        image = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {source_path}")
        if image.shape[0] != image.shape[1]:
            raise ValueError("Cube face must be square")
        decoded_images[face] = image
        for candidate in candidate_image["candidates"]:
            pixel = np.asarray(candidate["centerPixel"], dtype=float)
            ray = cubemap_ray(face, pixel, image.shape[0])
            horizontal = rotate @ ray[:2]
            horizontal_norm = float(np.linalg.norm(horizontal))
            matches: list[dict[str, Any]] = []
            for seat in provider_seats:
                delta = seat["position"] - camera
                depth = float(np.dot(delta, horizontal) / np.dot(horizontal, horizontal))
                if depth <= 0:
                    continue
                signed_cross_track = float(
                    (delta[0] * horizontal[1] - delta[1] * horizontal[0]) / horizontal_norm
                )
                matches.append(
                    {
                        "rowKey": seat["rowKey"],
                        "seatLabel": seat["seatLabel"],
                        "depthFeet": round(depth, 6),
                        "horizontalCrossTrackResidualFeet": round(abs(signed_cross_track), 6),
                        "horizontalCrossTrackSignedFeet": round(signed_cross_track, 6),
                        "impliedBadgeHeightRelativeToCameraFeet": round(depth * float(ray[2]), 6),
                    }
                )
            matches.sort(
                key=lambda match: (
                    match["horizontalCrossTrackResidualFeet"],
                    int(match["rowKey"].split(":", 1)[1]),
                    int(match["seatLabel"]),
                )
            )
            top = matches[: arguments.top_matches]
            best_by_row: dict[str, dict[str, Any]] = {}
            for match in matches:
                best_by_row.setdefault(match["rowKey"], match)
            row_matches = sorted(
                best_by_row.values(),
                key=lambda match: match["horizontalCrossTrackResidualFeet"],
            )[: arguments.top_matches]
            ranked.append(
                {
                    "candidateId": candidate["candidateId"],
                    "face": face,
                    "pixel": candidate["centerPixel"],
                    "boundsPixels": candidate["boundsPixels"],
                    "contourAreaPixels": candidate["contourAreaPixels"],
                    "topSeatMatches": top,
                    "topDistinctRowMatches": row_matches,
                    "withinOneFootSeatMatchCount": sum(
                        match["horizontalCrossTrackResidualFeet"] <= 1.0 for match in matches
                    ),
                }
            )

    excluded_best_rows = parse_csv(arguments.exclude_best_row_keys)
    review_queue = [
        candidate
        for candidate in ranked
        if candidate["contourAreaPixels"] >= arguments.minimum_review_area
        and candidate["topSeatMatches"]
        and candidate["topSeatMatches"][0]["rowKey"] not in excluded_best_rows
        and candidate["topSeatMatches"][0]["horizontalCrossTrackResidualFeet"]
        <= arguments.review_residual_feet
        and (
            len(candidate["topDistinctRowMatches"]) < 2
            or candidate["topDistinctRowMatches"][1]["horizontalCrossTrackResidualFeet"]
            - candidate["topDistinctRowMatches"][0]["horizontalCrossTrackResidualFeet"]
            >= arguments.minimum_distinct_row_gap_feet
        )
    ]
    review_queue.sort(
        key=lambda candidate: (
            candidate["topSeatMatches"][0]["horizontalCrossTrackResidualFeet"],
            -candidate["contourAreaPixels"],
        )
    )
    review_queue = review_queue[: arguments.maximum_review_candidates]
    tile_width = 330
    tile_height = 260
    columns = 5
    row_count = max(1, math.ceil(len(review_queue) / columns))
    sheet = np.zeros((row_count * tile_height, columns * tile_width, 3), dtype=np.uint8)
    for index, candidate in enumerate(review_queue):
        image = decoded_images[candidate["face"]]
        center_x, center_y = (float(value) for value in candidate["pixel"])
        radius = 82
        left = max(0, int(round(center_x)) - radius)
        top = max(0, int(round(center_y)) - radius)
        right = min(image.shape[1], int(round(center_x)) + radius)
        bottom = min(image.shape[0], int(round(center_y)) + radius)
        crop = image[top:bottom, left:right]
        scale = min((tile_width - 8) / crop.shape[1], (tile_height - 82) / crop.shape[0])
        resized = cv2.resize(
            crop,
            (int(round(crop.shape[1] * scale)), int(round(crop.shape[0] * scale))),
            interpolation=cv2.INTER_LANCZOS4,
        )
        marker_x = int(round((center_x - left) * scale))
        marker_y = int(round((center_y - top) * scale))
        cv2.drawMarker(
            resized,
            (marker_x, marker_y),
            (0, 0, 255),
            cv2.MARKER_CROSS,
            15,
            2,
        )
        row = index // columns
        column = index % columns
        origin_x = column * tile_width
        origin_y = row * tile_height
        sheet[origin_y + 78 : origin_y + 78 + resized.shape[0], origin_x : origin_x + resized.shape[1]] = resized
        best = candidate["topSeatMatches"][0]
        second_row = candidate["topDistinctRowMatches"][1] if len(candidate["topDistinctRowMatches"]) > 1 else None
        lines = [
            f"{candidate['candidateId']} face {candidate['face']}",
            f"best {best['rowKey']} seat {best['seatLabel']} err {best['horizontalCrossTrackResidualFeet']:.3f}ft",
            (
                "second row none"
                if second_row is None
                else f"row2 {second_row['rowKey']} seat {second_row['seatLabel']} err {second_row['horizontalCrossTrackResidualFeet']:.3f}ft"
            ),
        ]
        for line_index, line in enumerate(lines):
            cv2.putText(
                sheet,
                line,
                (origin_x + 3, origin_y + 20 + line_index * 21),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.39,
                (0, 255, 255),
                1,
                cv2.LINE_AA,
            )
    sheet_path = arguments.output_directory / f"section-{section_id}-provider-ray-ranked-review.png"
    if not cv2.imwrite(str(sheet_path), sheet, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {sheet_path}")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "rowsArtifactVersion": rows_artifact.get("artifactVersion"),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama.get("artifactVersion"),
            "fixedSolutionPath": str(arguments.solution),
            "fixedSolutionSha256": hashlib.sha256(solution_bytes).hexdigest(),
            "fixedSolutionArtifactVersion": solution["artifactVersion"],
            "candidateManifestPath": str(arguments.candidate_manifest),
            "candidateManifestSha256": hashlib.sha256(candidate_bytes).hexdigest(),
            "candidateArtifactVersion": candidate_artifact["artifactVersion"],
        },
        "sectionId": section_id,
        "providerSections": sorted(requested_provider_sections, key=int),
        "fixedCameraPose": camera_record,
        "rankingPolicy": {
            "candidatePixelsRefitCameraPose": False,
            "usesVerticalRowModel": False,
            "printedNumberAssignedAutomatically": False,
            "rowAssignedAutomatically": False,
            "reviewResidualFeet": arguments.review_residual_feet,
            "minimumReviewContourAreaPixels": arguments.minimum_review_area,
            "excludedBestRowKeys": sorted(excluded_best_rows),
            "minimumDistinctRowGapFeet": arguments.minimum_distinct_row_gap_feet,
            "candidatePointColor": "red",
        },
        "candidateCount": len(ranked),
        "candidates": ranked,
        "reviewQueue": {
            "count": len(review_queue),
            "path": str(sheet_path.resolve()),
            "sha256": sha256_file(sheet_path),
            "resampling": "Lanczos diagnostic only",
        },
        "publicationEligible": False,
        "blockers": [
            "RANKED_CANDIDATES_REQUIRE_MANUAL_NUMBER_REVIEW",
            "ROW_IDENTITY_NOT_ASSIGNED",
            "PROVIDER_ANCHOR_SEMANTICS_NOT_ESTABLISHED",
            "ROW_COVERAGE_INCOMPLETE",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "badge-to-provider-ray-ranking",
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
                "candidateCount": len(ranked),
                "reviewQueueCount": len(review_queue),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

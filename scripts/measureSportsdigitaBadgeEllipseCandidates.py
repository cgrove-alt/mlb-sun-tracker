#!/usr/bin/env python3
"""Measure image-only badge ellipse candidates near projected seat review queues.

The provider projection is used only to define finite review neighborhoods. The
detector returns every plausible low-saturation bright component in each
neighborhood and does not select the nearest component or assign a seat number.
Any control used by a geometry solver must be chosen in a separate reviewed
artifact before fitting or scoring.
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


ANALYSIS_VERSION = "sportsdigita-badge-ellipse-candidates-v2"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def contour_records(
    contours: list[np.ndarray],
    crop_shape: tuple[int, ...],
    bounds: list[int],
    arguments: argparse.Namespace,
    method: str,
) -> list[dict[str, Any]]:
    left, top, _, _ = bounds
    records: list[dict[str, Any]] = []
    for contour in contours:
        area = float(cv2.contourArea(contour))
        if not arguments.minimum_area <= area <= arguments.maximum_area:
            continue
        local_left, local_top, width, height = cv2.boundingRect(contour)
        if width < 4 or height < 4 or width > arguments.maximum_width or height > arguments.maximum_height:
            continue
        if len(contour) < 5:
            continue
        ellipse = cv2.fitEllipse(contour)
        (center_x, center_y), (axis_a, axis_b), angle = ellipse
        major = max(float(axis_a), float(axis_b))
        minor = min(float(axis_a), float(axis_b))
        if minor <= 0:
            continue
        aspect = major / minor
        if aspect > arguments.maximum_aspect:
            continue
        touches_edge = bool(
            local_left == 0
            or local_top == 0
            or local_left + width >= crop_shape[1]
            or local_top + height >= crop_shape[0]
        )
        records.append(
            {
                "candidateId": "",
                "detectionMethod": method,
                "centerPixel": [round(left + float(center_x), 3), round(top + float(center_y), 3)],
                "localCenterPixel": [round(float(center_x), 3), round(float(center_y), 3)],
                "boundsPixels": [
                    left + local_left,
                    top + local_top,
                    left + local_left + width,
                    top + local_top + height,
                ],
                "contourAreaPixels": round(area, 3),
                "ellipseMajorAxisPixels": round(major, 3),
                "ellipseMinorAxisPixels": round(minor, 3),
                "ellipseAspectRatio": round(aspect, 6),
                "ellipseAngleDegrees": round(float(angle), 3),
                "touchesReviewBoundary": touches_edge,
            }
        )
    return records


def candidate_components(
    image: np.ndarray,
    bounds: list[int],
    arguments: argparse.Namespace,
) -> tuple[list[dict[str, Any]], np.ndarray]:
    left, top, right, bottom = bounds
    crop = image[top:bottom, left:right]
    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
    mask = (
        (hsv[:, :, 1] <= arguments.maximum_saturation)
        & (hsv[:, :, 2] >= arguments.minimum_value)
    ).astype(np.uint8) * 255
    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)),
    )
    hsv_contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    records = contour_records(hsv_contours, crop.shape, bounds, arguments, "hsv-low-saturation-bright")

    grayscale = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    edge_mask = cv2.Canny(
        grayscale,
        arguments.canny_lower_threshold,
        arguments.canny_upper_threshold,
        L2gradient=True,
    )
    edge_mask = cv2.morphologyEx(
        edge_mask,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)),
    )
    edge_contours, _ = cv2.findContours(
        edge_mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_NONE,
    )
    records.extend(contour_records(edge_contours, crop.shape, bounds, arguments, "grayscale-edge"))
    records.sort(
        key=lambda item: (
            item["centerPixel"][1],
            item["centerPixel"][0],
            item["detectionMethod"],
        )
    )
    return records, crop


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("projection_manifest", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--review-radius", type=int, default=80)
    parser.add_argument("--maximum-saturation", type=int, default=105)
    parser.add_argument("--minimum-value", type=int, default=75)
    parser.add_argument("--minimum-area", type=float, default=20.0)
    parser.add_argument("--maximum-area", type=float, default=2600.0)
    parser.add_argument("--maximum-width", type=int, default=100)
    parser.add_argument("--maximum-height", type=int, default=100)
    parser.add_argument("--maximum-aspect", type=float, default=4.5)
    parser.add_argument("--canny-lower-threshold", type=int, default=25)
    parser.add_argument("--canny-upper-threshold", type=int, default=75)
    arguments = parser.parse_args()

    projection_bytes = arguments.projection_manifest.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    projection = json.loads(projection_bytes)
    panorama = json.loads(panorama_bytes)
    if projection.get("analysisVersion") != "sportsdigita-cubemap-row-projection-review-v1":
        raise ValueError("Projection manifest uses an unsupported analysis version")
    if projection["inputs"]["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama manifest SHA-256 does not match the projection")
    section_id = str(projection["sectionId"])
    source_section = next(
        section for section in panorama["sections"] if str(section["sectionId"]) == section_id
    )
    images: dict[str, tuple[np.ndarray, dict[str, Any]]] = {}
    for record in source_section["images"]:
        source_path = Path(record["localPath"])
        if sha256_file(source_path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {source_path}")
        decoded = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
        if decoded is None:
            raise ValueError(f"Could not decode {source_path}")
        images[record["face"]] = (decoded, record)

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    observations: list[dict[str, Any]] = []
    rendered_tiles: list[np.ndarray] = []
    for seat_index, seat in enumerate(projection["projectedSeats"], start=1):
        face = str(seat["face"])
        image, source_record = images[face]
        center_x, center_y = (float(value) for value in seat["pixel"])
        radius = arguments.review_radius
        bounds = [
            max(0, int(math.floor(center_x)) - radius),
            max(0, int(math.floor(center_y)) - radius),
            min(image.shape[1], int(math.floor(center_x)) + radius),
            min(image.shape[0], int(math.floor(center_y)) + radius),
        ]
        candidates, crop = candidate_components(image, bounds, arguments)
        prefix = f"{section_id}-{seat['rowKey'].replace(':', '-')}-seat-{seat['seatLabel']}-{face}"
        for candidate_index, candidate in enumerate(candidates, start=1):
            candidate["candidateId"] = f"{prefix}-ellipse-{candidate_index:02d}"
            candidate["distanceFromProjectedPixel"] = round(
                math.hypot(
                    candidate["centerPixel"][0] - center_x,
                    candidate["centerPixel"][1] - center_y,
                ),
                3,
            )
        rendered = crop.copy()
        crop_left, crop_top, _, _ = bounds
        for candidate in candidates:
            left, top, right, bottom = candidate["boundsPixels"]
            cv2.rectangle(
                rendered,
                (left - crop_left, top - crop_top),
                (right - crop_left, bottom - crop_top),
                (0, 255, 255),
                1,
            )
            cv2.putText(
                rendered,
                candidate["candidateId"].rsplit("-", 1)[-1],
                (left - crop_left, max(12, top - crop_top - 3)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.36,
                (0, 255, 255),
                1,
                cv2.LINE_AA,
            )
        predicted_local = (
            int(round(center_x - crop_left)),
            int(round(center_y - crop_top)),
        )
        cv2.drawMarker(rendered, predicted_local, (0, 0, 255), cv2.MARKER_CROSS, 13, 1)
        output_path = arguments.output_directory / f"{prefix}-ellipse-candidates.png"
        if not cv2.imwrite(str(output_path), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
            raise ValueError(f"Could not write {output_path}")
        title_height = 30
        tile = np.zeros((rendered.shape[0] + title_height, rendered.shape[1], 3), dtype=np.uint8)
        tile[title_height:, :] = rendered
        cv2.putText(
            tile,
            f"{seat['rowKey']} seat {seat['seatLabel']} {face} candidates {len(candidates)}",
            (3, 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.38,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
        rendered_tiles.append(tile)
        observations.append(
            {
                "queueIndex": seat_index,
                "rowKey": seat["rowKey"],
                "seatLabel": str(seat["seatLabel"]),
                "face": face,
                "projectedPixel": seat["pixel"],
                "sourcePath": str(Path(source_record["localPath"]).resolve()),
                "sourceSha256": source_record["sha256"],
                "reviewBoundsPixels": bounds,
                "candidateCount": len(candidates),
                "candidates": candidates,
                "diagnosticPath": str(output_path.resolve()),
                "diagnosticSha256": sha256_file(output_path),
            }
        )

    tile_height = max(tile.shape[0] for tile in rendered_tiles)
    tile_width = max(tile.shape[1] for tile in rendered_tiles)
    columns = 6
    row_count = max(1, math.ceil(len(rendered_tiles) / columns))
    sheet = np.zeros((row_count * tile_height, columns * tile_width, 3), dtype=np.uint8)
    for index, tile in enumerate(rendered_tiles):
        row = index // columns
        column = index % columns
        sheet[row * tile_height : row * tile_height + tile.shape[0], column * tile_width : column * tile_width + tile.shape[1]] = tile
    sheet_path = arguments.output_directory / f"section-{section_id}-badge-ellipse-candidate-review.png"
    if not cv2.imwrite(str(sheet_path), sheet, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {sheet_path}")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "projectionManifestPath": str(arguments.projection_manifest),
            "projectionManifestSha256": hashlib.sha256(projection_bytes).hexdigest(),
            "projectionArtifactVersion": projection["artifactVersion"],
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
        },
        "parameters": {
            "reviewRadiusPixels": arguments.review_radius,
            "maximumSaturation": arguments.maximum_saturation,
            "minimumValue": arguments.minimum_value,
            "minimumAreaPixels": arguments.minimum_area,
            "maximumAreaPixels": arguments.maximum_area,
            "maximumWidthPixels": arguments.maximum_width,
            "maximumHeightPixels": arguments.maximum_height,
            "maximumAspectRatio": arguments.maximum_aspect,
            "cannyLowerThreshold": arguments.canny_lower_threshold,
            "cannyUpperThreshold": arguments.canny_upper_threshold,
        },
        "sectionId": section_id,
        "selectionPolicy": {
            "projectionUse": "defines review queues and finite neighborhoods only",
            "detectorUse": "returns every component passing fixed image-only thresholds",
            "automaticSeatAssignment": False,
            "automaticNearestCandidateSelection": False,
            "reviewRequiredBeforeFitOrScore": True,
        },
        "observations": observations,
        "reviewSheet": {
            "path": str(sheet_path.resolve()),
            "sha256": sha256_file(sheet_path),
            "resampling": "none",
        },
        "publicationEligible": False,
        "blockers": [
            "IMAGE_CANDIDATES_REQUIRE_MANUAL_NUMBER_REVIEW",
            "CONTROL_PARTITIONS_NOT_DECLARED",
            "PROVIDER_ANCHOR_SEMANTICS_NOT_ESTABLISHED",
            "ROW_COVERAGE_INCOMPLETE",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "image-only-badge-ellipse-candidates",
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
                "reviewQueueCount": len(observations),
                "candidateCount": sum(item["candidateCount"] for item in observations),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

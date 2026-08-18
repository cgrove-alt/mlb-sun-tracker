#!/usr/bin/env python3
"""Render solved provider seat anchors onto checksum-locked cube faces."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def world_to_local(delta_xy: np.ndarray, yaw_degrees: float) -> np.ndarray:
    yaw = math.radians(yaw_degrees)
    cosine = math.cos(yaw)
    sine = math.sin(yaw)
    inverse = np.asarray([[cosine, sine], [-sine, cosine]])
    return inverse @ delta_xy


def project_cube(local: np.ndarray, size: int) -> tuple[str, np.ndarray]:
    x, front, up = (float(value) for value in local)
    absolute = np.abs(local)
    dominant = int(np.argmax(absolute))
    if dominant == 0 and x > 0:
        face = "r"
        u, v = -front / x, -up / x
    elif dominant == 0:
        face = "l"
        u, v = -front / x, up / x
    elif dominant == 1 and front > 0:
        face = "f"
        u, v = x / front, -up / front
    elif dominant == 1:
        face = "b"
        u, v = x / front, up / front
    elif up > 0:
        face = "u"
        u, v = x / up, front / up
    else:
        face = "d"
        u, v = -x / up, front / up
    pixel = np.asarray([(u + 1.0) * size / 2.0, (v + 1.0) * size / 2.0])
    return face, pixel


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("solution", type=Path)
    parser.add_argument("output_directory", type=Path)
    arguments = parser.parse_args()
    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    solution_bytes = arguments.solution.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    solution = json.loads(solution_bytes)
    if solution.get("analysisVersion") != "sportsdigita-cubemap-provider-row-bundle-v1":
        raise ValueError("Solution uses an unsupported analysis version")
    if solution["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Row SHA-256 does not match the solution")
    if solution["inputs"]["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the solution")
    section_id = str(solution["sectionId"])
    source_section = next(
        section for section in panorama["sections"] if str(section["sectionId"]) == section_id
    )
    source_images = {image["face"]: image for image in source_section["images"]}
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    opened: dict[str, Image.Image] = {}
    originals: dict[str, Image.Image] = {}
    drawn: dict[str, ImageDraw.ImageDraw] = {}
    for face, record in source_images.items():
        path = Path(record["localPath"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = Image.open(path).convert("RGB")
        if image.width != image.height:
            raise ValueError("Cube face must be square")
        originals[face] = image.copy()
        opened[face] = image
        drawn[face] = ImageDraw.Draw(image)
    sizes = {image.width for image in opened.values()}
    if len(sizes) != 1:
        raise ValueError("Cube faces use different dimensions")
    size = sizes.pop()

    camera_record = solution["cameraPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    yaw_degrees = float(camera_record["yawDegrees"])
    reference_height = float(camera_record["referenceRowBadgeHeightRelativeToCameraFeet"])
    solved_elevations = {
        row["rowKey"]: row["relativeBadgeHeightFeet"]
        for row in solution["rows"]
        if row["relativeBadgeHeightFeet"] is not None
    }
    projected: list[dict[str, Any]] = []
    for row in rows_artifact["geometryRows"]:
        if str(row["sectionId"]) != section_id or row["rowKey"] not in solved_elevations:
            continue
        badge_height = reference_height + float(solved_elevations[row["rowKey"]])
        row_number = int(row["rowKey"].split(":", 1)[1])
        color = (255, 225, 0) if row_number % 2 else (0, 255, 255)
        for seat in row["seats"]:
            position = np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float)
            local_xy = world_to_local(position - camera, yaw_degrees)
            face, pixel = project_cube(
                np.asarray([local_xy[0], local_xy[1], badge_height]), size
            )
            x, y = (float(value) for value in pixel)
            if not (-1 <= x <= size + 1 and -1 <= y <= size + 1):
                raise ValueError("Projected seat fell outside its dominant cube face")
            draw = drawn[face]
            radius = 7
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=color, width=3)
            draw.text((x + 9, y - 8), f"{row_number}:{seat['seatLabel']}", fill=color)
            projected.append(
                {
                    "rowKey": row["rowKey"],
                    "seatLabel": str(seat["seatLabel"]),
                    "face": face,
                    "pixel": [round(x, 6), round(y, 6)],
                }
            )
    outputs: list[dict[str, Any]] = []
    for face, image in opened.items():
        path = arguments.output_directory / f"section-{section_id}-{face}-row-projection.png"
        image.save(path, format="PNG", compress_level=5)
        outputs.append(
            {
                "face": face,
                "path": str(path.resolve()),
                "sha256": sha256_file(path),
                "width": image.width,
                "height": image.height,
            }
        )
    tile_width = 220
    tile_height = 220
    columns = 6
    rows = max(1, math.ceil(len(projected) / columns))
    review = Image.new("RGB", (columns * tile_width, rows * tile_height), (0, 0, 0))
    review_draw = ImageDraw.Draw(review)
    crop_outputs: list[dict[str, Any]] = []
    for index, seat in enumerate(projected):
        source = originals[seat["face"]]
        center_x, center_y = seat["pixel"]
        radius = 80
        left = max(0, int(round(center_x)) - radius)
        top = max(0, int(round(center_y)) - radius)
        right = min(source.width, int(round(center_x)) + radius)
        bottom = min(source.height, int(round(center_y)) + radius)
        crop = source.crop((left, top, right, bottom))
        crop_path = arguments.output_directory / (
            f"section-{section_id}-{seat['rowKey'].replace(':', '-')}-seat-"
            f"{seat['seatLabel']}-{seat['face']}-review.png"
        )
        crop.save(crop_path, format="PNG", compress_level=5)
        crop_outputs.append(
            {
                "rowKey": seat["rowKey"],
                "seatLabel": seat["seatLabel"],
                "face": seat["face"],
                "predictedPixel": seat["pixel"],
                "sourceBoundsPixels": [left, top, right, bottom],
                "path": str(crop_path.resolve()),
                "sha256": sha256_file(crop_path),
            }
        )
        origin_x = (index % columns) * tile_width
        origin_y = (index // columns) * tile_height
        paste_x = origin_x + (tile_width - crop.width) // 2
        paste_y = origin_y + 36 + (tile_height - 36 - crop.height) // 2
        review.paste(crop, (paste_x, paste_y))
        review_draw.text(
            (origin_x + 5, origin_y + 8),
            f"{seat['rowKey']} seat {seat['seatLabel']} face {seat['face']}",
            fill=(255, 225, 0),
        )
    review_path = arguments.output_directory / f"section-{section_id}-projected-seat-review.png"
    review.save(review_path, format="PNG", compress_level=5)
    stable = {
        "analysisVersion": "sportsdigita-cubemap-row-projection-review-v1",
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "solutionPath": str(arguments.solution),
            "solutionSha256": hashlib.sha256(solution_bytes).hexdigest(),
            "solutionArtifactVersion": solution["artifactVersion"],
        },
        "sectionId": section_id,
        "projectedSeats": projected,
        "outputs": outputs,
        "projectedSeatReview": {
            "path": str(review_path.resolve()),
            "sha256": sha256_file(review_path),
            "cropRadiusPixels": 80,
            "resampling": "none",
            "seatCrops": crop_outputs,
        },
        "reviewStatus": "pending",
        "publicationEligible": False,
        "blockers": [
            "PROJECTION_REQUIRES_INDEPENDENT_REVIEW",
            "ROW_COVERAGE_INCOMPLETE",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "cubemap-row-projection-review",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    output_manifest = arguments.output_directory / "manifest.json"
    output_manifest.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(output_manifest),
                "artifactVersion": artifact["artifactVersion"],
                "projectedSeatCount": len(projected),
                "solvedRowCount": len(solved_elevations),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

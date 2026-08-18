#!/usr/bin/env python3
"""Render search-only projections for fieldward row rail review."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw


ANALYSIS_VERSION = "sportsdigita-fieldward-row-search-projection-v1"


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
    return face, np.asarray([(u + 1.0) * size / 2.0, (v + 1.0) * size / 2.0])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("selected_pose", type=Path)
    parser.add_argument("relative_heights", type=Path)
    parser.add_argument("offset_validation", type=Path)
    parser.add_argument("output_directory", type=Path)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    pose_bytes = arguments.selected_pose.read_bytes()
    heights_bytes = arguments.relative_heights.read_bytes()
    validation_bytes = arguments.offset_validation.read_bytes()
    rows = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    pose = json.loads(pose_bytes)
    heights = json.loads(heights_bytes)
    validation = json.loads(validation_bytes)
    if pose.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Selected pose uses an unsupported analysis version")
    if heights.get("analysisVersion") != "sportsdigita-rear-tier-relative-heights-v1":
        raise ValueError("Relative heights use an unsupported analysis version")
    if validation.get("analysisVersion") != "sportsdigita-rail-to-badge-offset-validation-v1":
        raise ValueError("Offset validation uses an unsupported analysis version")
    if pose["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Provider-row checksum mismatch")
    if heights["inputs"]["selectedPoseSha256"] != hashlib.sha256(pose_bytes).hexdigest():
        raise ValueError("Relative-height selected-pose checksum mismatch")
    if validation["inputs"]["relativeHeightsSha256"] != hashlib.sha256(
        heights_bytes
    ).hexdigest():
        raise ValueError("Offset-validation relative-height checksum mismatch")

    section_id = str(pose["sectionId"])
    source_section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == section_id
    )
    source_images: dict[str, Image.Image] = {}
    output_images: dict[str, Image.Image] = {}
    draws: dict[str, ImageDraw.ImageDraw] = {}
    for source in source_section["images"]:
        path = Path(source["localPath"])
        if sha256_file(path) != source["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = Image.open(path).convert("RGB")
        if image.width != image.height:
            raise ValueError("Cube face must be square")
        face = str(source["face"])
        source_images[face] = image.copy()
        output_images[face] = image
        draws[face] = ImageDraw.Draw(image)
    face_sizes = {image.width for image in source_images.values()}
    if len(face_sizes) != 1:
        raise ValueError("Cube faces use different dimensions")
    face_size = face_sizes.pop()

    measured_rail = {
        row_number(record["rowKey"]): float(record["relativeRailHeightFeet"])
        for record in heights["measuredRows"]
    }
    early_rises = [
        measured_rail[row] - measured_rail[row - 1]
        for row in sorted(measured_rail)
        if 10 <= row <= 13
    ]
    backward_rise = float(np.median(np.asarray(early_rises)))
    rail_to_badge_offsets = [
        float(validation["prefitReference"]["railToBadgeOffsetFeet"]),
        float(
            validation["postfitCandidateRowsByOffsetConsistency"][0][
                "railToBadgeOffsetFeet"
            ]
        ),
    ]
    search_offset = float(np.mean(np.asarray(rail_to_badge_offsets)))
    assigned = pose["selectedTierAssignments"]
    estimated_rail: dict[int, float] = dict(measured_rail)
    for tier_id in (
        "section-207-front-face-lower-tier",
        "section-207-front-face-middle-tier",
    ):
        assignment = assigned[tier_id]
        estimated_rail[row_number(assignment["rowKey"])] = (
            float(assignment["relativeBadgeHeightFeet"]) + search_offset
        )
    first_direct_row = min(estimated_rail)
    for row in range(first_direct_row - 1, 0, -1):
        estimated_rail[row] = estimated_rail[row + 1] - backward_rise

    camera_record = pose["selectedPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    yaw_degrees = float(camera_record["yawDegrees"])
    colors = {
        1: (255, 80, 80),
        2: (255, 180, 0),
        3: (255, 255, 0),
        4: (80, 255, 80),
        5: (0, 255, 255),
        6: (80, 150, 255),
        7: (220, 80, 255),
        8: (255, 255, 255),
    }
    projected: list[dict[str, Any]] = []
    for row in rows["geometryRows"]:
        if str(row["sectionId"]) != section_id:
            continue
        number = row_number(row["rowKey"])
        if not 1 <= number <= 8:
            continue
        height = estimated_rail[number]
        color = colors[number]
        for seat_index, seat in enumerate(row["seats"]):
            position = np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float)
            local_xy = world_to_local(position - camera, yaw_degrees)
            face, pixel = project_cube(
                np.asarray([local_xy[0], local_xy[1], height]),
                face_size,
            )
            x, y = (float(value) for value in pixel)
            draw = draws[face]
            radius = 5
            draw.ellipse(
                (x - radius, y - radius, x + radius, y + radius),
                outline=color,
                width=2,
            )
            if seat_index % 3 == 0:
                draw.text((x + 7, y - 7), f"{number}:{seat['seatLabel']}", fill=color)
            projected.append(
                {
                    "rowKey": row["rowKey"],
                    "seatLabel": str(seat["seatLabel"]),
                    "estimatedRailHeightRelativeToCameraFeet": round(height, 6),
                    "face": face,
                    "pixel": [round(x, 6), round(y, 6)],
                }
            )

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    outputs: list[dict[str, Any]] = []
    for face, image in output_images.items():
        path = arguments.output_directory / f"section-{section_id}-{face}-fieldward-search.png"
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
            "relativeHeightsPath": str(arguments.relative_heights),
            "relativeHeightsSha256": hashlib.sha256(heights_bytes).hexdigest(),
            "relativeHeightsArtifactVersion": heights["artifactVersion"],
            "offsetValidationPath": str(arguments.offset_validation),
            "offsetValidationSha256": hashlib.sha256(validation_bytes).hexdigest(),
            "offsetValidationArtifactVersion": validation["artifactVersion"],
        },
        "sectionId": section_id,
        "searchEstimatePolicy": {
            "rows7And8": "numbered badge height plus mean reviewed rail-to-badge offset",
            "rows1Through6": "constant backward rise from median measured rises for rows 9 through 13",
            "backwardRiseFeet": round(backward_rise, 6),
            "railToBadgeSearchOffsetFeet": round(search_offset, 6),
            "automaticMeasurement": False,
            "allowedUse": "finite visual search neighborhoods only",
        },
        "estimatedRailHeightsRelativeToCameraFeet": {
            str(row): round(estimated_rail[row], 6) for row in range(1, 9)
        },
        "projectedSeats": projected,
        "outputs": outputs,
        "reviewStatus": "pending",
        "publicationEligible": False,
        "blockers": [
            "SEARCH_PROJECTIONS_ARE_NOT_MEASUREMENTS",
            "ROWS_1_THROUGH_8_REQUIRE_REVIEWED_RAIL_CONTROLS",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "fieldward-row-search-projection",
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
                "estimatedRailHeights": artifact[
                    "estimatedRailHeightsRelativeToCameraFeet"
                ],
                "projectedSeatCount": len(projected),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

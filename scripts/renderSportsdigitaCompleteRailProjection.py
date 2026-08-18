#!/usr/bin/env python3
"""Render all measured section rail anchors onto checksum-locked cube faces."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw


ANALYSIS_VERSION = "sportsdigita-complete-rail-projection-review-v1"


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
    dominant = int(np.argmax(np.abs(local)))
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
    parser.add_argument("complete_heights", type=Path)
    parser.add_argument("output_directory", type=Path)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    pose_bytes = arguments.selected_pose.read_bytes()
    heights_bytes = arguments.complete_heights.read_bytes()
    rows = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    pose = json.loads(pose_bytes)
    heights = json.loads(heights_bytes)
    if pose.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Selected pose uses an unsupported analysis version")
    if heights.get("analysisVersion") != "sportsdigita-complete-section-relative-rail-heights-v1":
        raise ValueError("Complete heights use an unsupported analysis version")
    if pose["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Provider-row checksum mismatch")
    if heights["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Complete-height provider-row checksum mismatch")
    if heights["inputs"]["selectedPoseSha256"] != hashlib.sha256(pose_bytes).hexdigest():
        raise ValueError("Complete-height selected-pose checksum mismatch")
    if heights["inputs"]["panoramaManifestSha256"] != hashlib.sha256(
        panorama_bytes
    ).hexdigest():
        raise ValueError("Complete-height panorama checksum mismatch")

    section_id = str(pose["sectionId"])
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == section_id
    )
    opened: dict[str, Image.Image] = {}
    draws: dict[str, ImageDraw.ImageDraw] = {}
    sources: dict[str, dict[str, Any]] = {}
    for source in section["images"]:
        path = Path(source["localPath"])
        if sha256_file(path) != source["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = Image.open(path).convert("RGB")
        if image.width != image.height:
            raise ValueError("Cube face must be square")
        face = str(source["face"])
        opened[face] = image
        draws[face] = ImageDraw.Draw(image)
        sources[face] = source
    sizes = {image.width for image in opened.values()}
    if len(sizes) != 1:
        raise ValueError("Cube faces use different dimensions")
    size = sizes.pop()

    height_by_row = {
        record["rowKey"]: float(record["relativeRailHeightFeet"])
        for record in heights["rows"]
    }
    camera_record = pose["selectedPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    yaw_degrees = float(camera_record["yawDegrees"])
    colors = [
        (255, 70, 70),
        (255, 170, 0),
        (255, 255, 0),
        (50, 255, 80),
        (0, 255, 255),
        (80, 150, 255),
        (220, 80, 255),
        (255, 255, 255),
    ]
    projected: list[dict[str, Any]] = []
    for row in rows["geometryRows"]:
        row_key = str(row["rowKey"])
        if str(row["sectionId"]) != section_id or row_key not in height_by_row:
            continue
        number = row_number(row_key)
        color = colors[(number - 1) % len(colors)]
        rail_height = height_by_row[row_key]
        for seat_index, seat in enumerate(row["seats"]):
            position = np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float)
            local_xy = world_to_local(position - camera, yaw_degrees)
            face, pixel = project_cube(
                np.asarray([local_xy[0], local_xy[1], rail_height]),
                size,
            )
            x, y = (float(value) for value in pixel)
            draw = draws[face]
            radius = 5
            draw.ellipse(
                (x - radius, y - radius, x + radius, y + radius),
                outline=color,
                width=2,
            )
            if seat_index % 4 == 0:
                draw.text((x + 7, y - 7), f"{number}:{seat['seatLabel']}", fill=color)
            projected.append(
                {
                    "rowKey": row_key,
                    "seatLabel": str(seat["seatLabel"]),
                    "relativeRailHeightFeet": rail_height,
                    "face": face,
                    "pixel": [round(x, 6), round(y, 6)],
                }
            )

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    outputs: list[dict[str, Any]] = []
    for face, image in opened.items():
        path = arguments.output_directory / f"section-{section_id}-{face}-complete-rail-projection.png"
        image.save(path, format="PNG", compress_level=5)
        outputs.append(
            {
                "face": face,
                "sourcePath": str(Path(sources[face]["localPath"]).resolve()),
                "sourceSha256": sources[face]["sha256"],
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
            "completeHeightsPath": str(arguments.complete_heights),
            "completeHeightsSha256": hashlib.sha256(heights_bytes).hexdigest(),
            "completeHeightsArtifactVersion": heights["artifactVersion"],
        },
        "sectionId": section_id,
        "projectedSeats": projected,
        "outputs": outputs,
        "reviewPolicy": {
            "selectedRailControlsExcludedFromIndependentSpatialReview": True,
            "unsampledSeatsAndFaceSeamsRequireReview": True,
            "automaticAcceptance": False,
        },
        "reviewStatus": "pending",
        "publicationEligible": False,
        "blockers": [
            "COMPLETE_PROJECTION_REQUIRES_UNSAMPLED_SEAT_AND_FACE_SEAM_REVIEW",
            "RAIL_TO_SEAT_OR_TREAD_VERTICAL_OFFSET_NOT_ESTABLISHED",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "complete-rail-projection-review",
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
                "projectedSeatCount": len(projected),
                "projectedRowCount": len(height_by_row),
                "reviewStatus": artifact["reviewStatus"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

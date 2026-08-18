#!/usr/bin/env python3
"""Render an auditable perspective view from checksum-locked cube faces."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-cubemap-perspective-view-v1"
REQUIRED_FACES = {"f", "r", "b", "l", "u", "d"}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def perspective_rays(
    width: int,
    height: int,
    yaw_degrees: float,
    pitch_degrees: float,
    horizontal_fov_degrees: float,
) -> tuple[np.ndarray, float]:
    """Return unit rays in the repository's right, front, up convention."""
    yaw = math.radians(yaw_degrees)
    pitch = math.radians(pitch_degrees)
    horizontal_tangent = math.tan(math.radians(horizontal_fov_degrees) / 2.0)
    vertical_tangent = horizontal_tangent * height / width
    vertical_fov_degrees = math.degrees(2.0 * math.atan(vertical_tangent))

    forward = np.asarray(
        [
            math.sin(yaw) * math.cos(pitch),
            math.cos(yaw) * math.cos(pitch),
            math.sin(pitch),
        ],
        dtype=np.float64,
    )
    right = np.asarray([math.cos(yaw), -math.sin(yaw), 0.0], dtype=np.float64)
    up = np.cross(right, forward)

    output_x = (
        ((np.arange(width, dtype=np.float64) + 0.5) / width) * 2.0 - 1.0
    ) * horizontal_tangent
    output_y = (
        ((np.arange(height, dtype=np.float64) + 0.5) / height) * 2.0 - 1.0
    ) * vertical_tangent
    grid_x, grid_y = np.meshgrid(output_x, output_y)
    rays = (
        forward[None, None, :]
        + grid_x[:, :, None] * right[None, None, :]
        - grid_y[:, :, None] * up[None, None, :]
    )
    rays /= np.linalg.norm(rays, axis=2, keepdims=True)
    return rays, vertical_fov_degrees


def face_coordinates(
    rays: np.ndarray,
    face_size: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Map rays to faces and native cube pixels using the established model."""
    x = rays[:, :, 0]
    front = rays[:, :, 1]
    up = rays[:, :, 2]
    dominant = np.argmax(np.abs(rays), axis=2)
    face_index = np.full(dominant.shape, -1, dtype=np.int8)
    map_x = np.zeros(dominant.shape, dtype=np.float32)
    map_y = np.zeros(dominant.shape, dtype=np.float32)
    face_order = ["f", "r", "b", "l", "u", "d"]

    conditions = {
        "r": (dominant == 0) & (x > 0),
        "l": (dominant == 0) & (x <= 0),
        "f": (dominant == 1) & (front > 0),
        "b": (dominant == 1) & (front <= 0),
        "u": (dominant == 2) & (up > 0),
        "d": (dominant == 2) & (up <= 0),
    }
    for index, face in enumerate(face_order):
        mask = conditions[face]
        face_index[mask] = index
        if face == "r":
            u = -front[mask] / x[mask]
            v = -up[mask] / x[mask]
        elif face == "l":
            u = -front[mask] / x[mask]
            v = up[mask] / x[mask]
        elif face == "f":
            u = x[mask] / front[mask]
            v = -up[mask] / front[mask]
        elif face == "b":
            u = x[mask] / front[mask]
            v = up[mask] / front[mask]
        elif face == "u":
            u = x[mask] / up[mask]
            v = front[mask] / up[mask]
        else:
            u = -x[mask] / up[mask]
            v = front[mask] / up[mask]
        map_x[mask] = np.clip((u + 1.0) * face_size / 2.0, 0.0, face_size - 1.0)
        map_y[mask] = np.clip((v + 1.0) * face_size / 2.0, 0.0, face_size - 1.0)
    if np.any(face_index < 0):
        raise ValueError("At least one output ray was not assigned to a cube face")
    return face_index, map_x, map_y


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--section", required=True)
    parser.add_argument("--yaw-degrees", type=float, required=True)
    parser.add_argument("--pitch-degrees", type=float, default=0.0)
    parser.add_argument("--horizontal-fov-degrees", type=float, default=75.0)
    parser.add_argument("--width", type=int, default=2048)
    parser.add_argument("--height", type=int, default=1536)
    arguments = parser.parse_args()
    if not (0.0 < arguments.horizontal_fov_degrees < 179.0):
        raise ValueError("Horizontal field of view must be between 0 and 179 degrees")
    if not (-89.0 < arguments.pitch_degrees < 89.0):
        raise ValueError("Pitch must be between -89 and 89 degrees")
    if arguments.width <= 0 or arguments.height <= 0:
        raise ValueError("Output dimensions must be positive")

    manifest_bytes = arguments.panorama_manifest.read_bytes()
    panorama = json.loads(manifest_bytes)
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == str(arguments.section)
    )
    source_records = {str(record["face"]): record for record in section["images"]}
    if set(source_records) != REQUIRED_FACES:
        raise ValueError("All six named cube faces are required")

    images: dict[str, np.ndarray] = {}
    source_details: dict[str, dict[str, Any]] = {}
    for face, record in source_records.items():
        path = Path(record["localPath"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode cube face: {path}")
        if image.shape[0] != image.shape[1]:
            raise ValueError("Cube face must be square")
        images[face] = image
        source_details[face] = {
            "path": str(path.resolve()),
            "sha256": record["sha256"],
            "width": image.shape[1],
            "height": image.shape[0],
            "url": record.get("url"),
            "lastModified": record.get("lastModified"),
            "etag": record.get("etag"),
        }
    sizes = {image.shape[:2] for image in images.values()}
    if len(sizes) != 1:
        raise ValueError("Cube faces use different dimensions")
    face_size = next(iter(sizes))[0]

    rays, vertical_fov_degrees = perspective_rays(
        arguments.width,
        arguments.height,
        arguments.yaw_degrees,
        arguments.pitch_degrees,
        arguments.horizontal_fov_degrees,
    )
    face_index, map_x, map_y = face_coordinates(rays, face_size)
    face_order = ["f", "r", "b", "l", "u", "d"]
    output = np.zeros((arguments.height, arguments.width, 3), dtype=np.uint8)
    usage: dict[str, int] = {}
    for index, face in enumerate(face_order):
        mask = face_index == index
        count = int(np.count_nonzero(mask))
        usage[face] = count
        if count == 0:
            continue
        resampled = cv2.remap(
            images[face],
            map_x,
            map_y,
            interpolation=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_REPLICATE,
        )
        output[mask] = resampled[mask]

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    output_path = arguments.output_directory / (
        f"section-{arguments.section}-yaw-{arguments.yaw_degrees:g}-"
        f"pitch-{arguments.pitch_degrees:g}-perspective.png"
    )
    if not cv2.imwrite(str(output_path), output, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write perspective image: {output_path}")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
            "sectionId": str(arguments.section),
            "sources": source_details,
        },
        "projection": {
            "type": "rectilinear-perspective",
            "coordinateConvention": "right-front-up; yaw 0 is front and yaw 90 is right",
            "outputPixelConvention": "zero-based pixel centers",
            "yawDegrees": arguments.yaw_degrees,
            "pitchDegrees": arguments.pitch_degrees,
            "horizontalFieldOfViewDegrees": arguments.horizontal_fov_degrees,
            "verticalFieldOfViewDegrees": round(vertical_fov_degrees, 9),
            "width": arguments.width,
            "height": arguments.height,
            "cubeFaceSize": face_size,
            "resampling": "OpenCV Lanczos4 with replicated face-edge border",
            "cubeEdgeSampling": "repository size-over-two ray convention, clamped to native pixel extent",
            "facePixelCounts": usage,
        },
        "output": {
            "path": str(output_path.resolve()),
            "sha256": sha256_file(output_path),
            "width": arguments.width,
            "height": arguments.height,
        },
        "reviewStatus": "pending",
        "publicationEligible": False,
        "blockers": [
            "PERSPECTIVE_VIEW_REQUIRES_NATIVE_IMAGE_REVIEW",
            "PANORAMA_PIXELS_DO_NOT_ESTABLISH_METRIC_GEOMETRY",
            "ROW_IDENTITIES_NOT_INDEPENDENTLY_VALIDATED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "cubemap-perspective-view",
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
                "outputPath": str(output_path),
                "facePixelCounts": usage,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

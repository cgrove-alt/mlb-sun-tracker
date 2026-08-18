#!/usr/bin/env python3
"""Project current provider row anchors onto a source panorama for review."""

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
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def project_provider_points(
    points: np.ndarray,
    camera_position: np.ndarray,
    provider_to_panorama: np.ndarray,
    provider_yaw_degrees: float,
    width: int,
    height: int,
) -> np.ndarray:
    deltas = points - camera_position
    distances = np.linalg.norm(deltas, axis=1, keepdims=True)
    corrected = (provider_to_panorama @ deltas.T).T / distances
    yaw = math.radians(provider_yaw_degrees)
    cosine = math.cos(yaw)
    sine = math.sin(yaw)
    base = np.empty_like(corrected)
    base[:, 0] = cosine * corrected[:, 0] - sine * corrected[:, 2]
    base[:, 1] = corrected[:, 1]
    base[:, 2] = sine * corrected[:, 0] + cosine * corrected[:, 2]
    longitude = np.arctan2(base[:, 2], base[:, 0])
    latitude = np.arcsin(np.clip(base[:, 1], -1.0, 1.0))
    return np.column_stack(
        [
            (longitude / (2.0 * math.pi) + 0.5) * width,
            (0.5 - latitude / math.pi) * height,
        ]
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--seat-id", required=True)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--padding-x", type=int, default=250)
    parser.add_argument("--padding-y", type=int, default=180)
    parser.add_argument("--scale", type=float, default=3.0)
    arguments = parser.parse_args()
    if arguments.padding_x < 0 or arguments.padding_y < 0 or arguments.scale <= 0:
        raise ValueError("Invalid crop parameters")

    rows_bytes = arguments.rows.read_bytes()
    manifest_bytes = arguments.panorama_manifest.read_bytes()
    calibration_bytes = arguments.calibration.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    manifest = json.loads(manifest_bytes)
    calibration = json.loads(calibration_bytes)
    entry = next(item for item in manifest["images"] if item["seatId"] == arguments.seat_id)
    image_path = Path(entry["localPath"])
    source = Image.open(image_path).convert("RGB")
    if source.size != (entry["width"], entry["height"]):
        raise ValueError("Panorama dimensions differ from the source manifest")

    selected = [row for row in rows_artifact["rows"] if row["sectionId"] in arguments.section]
    if not selected:
        raise ValueError("No rows matched the requested sections")
    if "rotation" in calibration:
        rotation = np.asarray(
            calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
        )
        calibration_basis = "venue-specific-measured-rotation"
    elif "canonicalProviderVectorToPanoramaVector" in calibration:
        eligible = calibration.get("validation", {}).get(
            "conventionEligibleForViewerProjection"
        )
        if not eligible:
            raise ValueError("Cross-venue panorama axis convention did not pass")
        rotation = np.asarray(
            calibration["canonicalProviderVectorToPanoramaVector"], dtype=float
        )
        calibration_basis = "cross-venue-validated-runtime-axis-convention"
    else:
        raise ValueError("Calibration artifact has no supported panorama rotation")
    if rotation.shape != (3, 3):
        raise ValueError("Panorama rotation must be a 3 by 3 matrix")
    camera = np.asarray(entry["config"]["p"], dtype=float)
    yaw = float(entry["config"]["rp"][1])
    projected: list[dict[str, Any]] = []
    all_pixels: list[np.ndarray] = []
    for row in selected:
        points = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=float)
        pixels = project_provider_points(
            points, camera, rotation, yaw, entry["width"], entry["height"]
        )
        all_pixels.append(pixels)
        projected.append(
            {
                "rowKey": row["rowKey"],
                "anchorSeatIds": row["anchorSeatIds"],
                "providerPositionsMetres": points.tolist(),
                "panoramaPixels": pixels.tolist(),
            }
        )
    combined = np.vstack(all_pixels)
    left = max(0, int(math.floor(float(np.min(combined[:, 0])))) - arguments.padding_x)
    right = min(source.width, int(math.ceil(float(np.max(combined[:, 0])))) + arguments.padding_x)
    top = max(0, int(math.floor(float(np.min(combined[:, 1])))) - arguments.padding_y)
    bottom = min(source.height, int(math.ceil(float(np.max(combined[:, 1])))) + arguments.padding_y)
    crop = source.crop((left, top, right, bottom)).convert("RGBA")
    overlay = Image.new("RGBA", crop.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    colors = {
        "A": (255, 144, 0, 125),
        "B": (92, 255, 92, 125),
        "C": (255, 231, 76, 125),
        "D": (0, 255, 255, 125),
        "E": (255, 79, 216, 125),
    }
    for row in projected:
        points = [(x - left, y - top) for x, y in row["panoramaPixels"]]
        color = colors.get(row["rowKey"].split(":", 1)[0], (255, 255, 0, 125))
        draw.line(points, fill=color, width=1)
        for point in points:
            radius = 1
            draw.ellipse(
                (point[0] - radius, point[1] - radius, point[0] + radius, point[1] + radius),
                fill=color,
            )
        if row["rowKey"].split(":", 1)[1] in {"5", "9", "13", "19"}:
            label_point = points[-1]
            draw.text(
                (label_point[0] + 3, label_point[1] - 6),
                row["rowKey"],
                fill=(*color[:3], 255),
            )
    crop = Image.alpha_composite(crop, overlay).convert("RGB")
    output_png = arguments.output_json.with_suffix(".png")
    if arguments.scale != 1:
        crop = crop.resize(
            (round(crop.width * arguments.scale), round(crop.height * arguments.scale)),
            Image.Resampling.LANCZOS,
        )
    output_png.parent.mkdir(parents=True, exist_ok=True)
    crop.save(output_png)
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "provider-row-anchor-panorama-projection-v1",
        "artifactStage": "current-provider-row-identity-review",
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "calibrationPath": str(arguments.calibration),
            "calibrationSha256": hashlib.sha256(calibration_bytes).hexdigest(),
            "calibrationArtifactVersion": calibration.get("artifactVersion"),
            "calibrationBasis": calibration_basis,
            "panoramaPath": str(image_path),
            "panoramaSha256": sha256_file(image_path),
            "panoramaSeatId": arguments.seat_id,
        },
        "projection": {
            "cameraProviderPositionMetres": entry["config"]["p"],
            "providerYawDegrees": yaw,
            "providerVectorToPanoramaVector": rotation.tolist(),
            "cropSourcePixels": {"left": left, "top": top, "right": right, "bottom": bottom},
            "renderScale": arguments.scale,
        },
        "rows": projected,
        "outputPng": str(output_png),
        "outputPngSha256": sha256_file(output_png),
        "publicationEligible": False,
        "blockers": [
            "PANORAMA_IS_A_SECTION_IDENTITY_REVIEW_SOURCE_ONLY",
            "BROADCAST_CAMERA_REGISTRATION_NOT_ESTABLISHED",
            "IMAGE_REUSE_TERMS_NOT_ESTABLISHED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "outputPng": str(output_png),
                "rowCount": len(projected),
                "cropSourcePixels": artifact["projection"]["cropSourcePixels"],
                "artifactVersion": artifact["artifactVersion"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

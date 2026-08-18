#!/usr/bin/env python3
"""Render checksum-locked provider section labels on a metric orthophoto crop."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def color_for_name(name: str) -> tuple[int, int, int]:
    digest = hashlib.sha256(name.encode("utf-8")).digest()
    return (
        80 + digest[0] % 176,
        80 + digest[1] % 176,
        80 + digest[2] % 176,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("registration", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--composite-name", action="append", required=True)
    parser.add_argument("--padding-pixels", type=int, default=240)
    parser.add_argument("--line-width", type=int, default=3)
    arguments = parser.parse_args()
    if arguments.padding_pixels < 0 or arguments.line_width < 1:
        raise ValueError("Padding must be nonnegative and line width must be positive")

    registration_bytes = arguments.registration.read_bytes()
    registration = json.loads(registration_bytes)
    if registration.get("artifactKind") != "ticketmaster-drcog-row-registration-candidate":
        raise ValueError("Input is not a Ticketmaster DRCOG row registration candidate")
    requested = list(dict.fromkeys(arguments.composite_name))
    selected_rows = [
        row for row in registration["rows"] if row.get("compositeName") in requested
    ]
    found = {row["compositeName"] for row in selected_rows}
    missing = sorted(set(requested) - found)
    if missing:
        raise ValueError(f"Unknown composite names: {missing}")

    crop_path = Path(registration["inputs"]["overlayCropPath"])
    if sha256_file(crop_path) != registration["inputs"]["overlayCropSha256"]:
        raise ValueError("Orthophoto crop artifact checksum changed")
    crop_bytes = crop_path.read_bytes()
    crop = json.loads(crop_bytes)
    if crop.get("artifactKind") != "drcog-orthophoto-crop":
        raise ValueError("Registration overlay input is not a DRCOG orthophoto crop")
    image_path = Path(crop["outputImage"]["path"])
    if sha256_file(image_path) != crop["outputImage"]["sha256"]:
        raise ValueError("Orthophoto image checksum changed")
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode the orthophoto image")

    pixel_width, pixel_height = (float(value) for value in crop["pixelSizeFeet"])
    bounds = crop["projectedBoundsFeet"]
    minimum_x = float(bounds["minimumX"])
    maximum_y = float(bounds["maximumY"])

    def projected_to_pixel(projected: np.ndarray) -> np.ndarray:
        return np.column_stack(
            (
                (projected[:, 0] - minimum_x) / pixel_width,
                (projected[:, 1] - maximum_y) / pixel_height,
            )
        )

    section_pixels: dict[str, list[np.ndarray]] = {name: [] for name in requested}
    row_pixels: list[tuple[str, str, np.ndarray]] = []
    for row in selected_rows:
        projected = np.asarray(
            [
                seat.get(
                    "positionOrthophotoNominalProjectedFeet",
                    seat["positionProjectedFeet"],
                )
                for seat in row["seats"]
            ],
            dtype=np.float64,
        )
        pixels = projected_to_pixel(projected)
        section_pixels[row["compositeName"]].append(pixels)
        row_pixels.append((row["compositeName"], row["rowName"], pixels))

    all_pixels = np.vstack([pixels for _, _, pixels in row_pixels])
    left = max(0, int(np.floor(np.min(all_pixels[:, 0]))) - arguments.padding_pixels)
    top = max(0, int(np.floor(np.min(all_pixels[:, 1]))) - arguments.padding_pixels)
    right = min(
        image.shape[1],
        int(np.ceil(np.max(all_pixels[:, 0]))) + arguments.padding_pixels + 1,
    )
    bottom = min(
        image.shape[0],
        int(np.ceil(np.max(all_pixels[:, 1]))) + arguments.padding_pixels + 1,
    )
    if right <= left or bottom <= top:
        raise ValueError("Selected provider geometry is outside the orthophoto crop")
    output = image[top:bottom, left:right].copy()

    for composite_name, _, pixels in row_pixels:
        integer = np.rint(pixels - np.asarray([left, top])).astype(np.int32)
        inside = (
            (integer[:, 0] >= 0)
            & (integer[:, 0] < output.shape[1])
            & (integer[:, 1] >= 0)
            & (integer[:, 1] < output.shape[0])
        )
        integer = integer[inside]
        if len(integer) < 2:
            continue
        color = color_for_name(composite_name)
        cv2.polylines(
            output,
            [integer.reshape((-1, 1, 2))],
            False,
            color,
            arguments.line_width,
            cv2.LINE_AA,
        )
        cv2.circle(output, tuple(integer[0]), arguments.line_width + 1, color, -1)
        cv2.circle(output, tuple(integer[-1]), arguments.line_width + 1, color, -1)

    section_records: list[dict[str, Any]] = []
    for composite_name in requested:
        pixels = np.vstack(section_pixels[composite_name])
        centroid = np.median(pixels, axis=0) - np.asarray([left, top])
        label_point = tuple(np.rint(centroid).astype(int))
        font_scale = max(0.9, min(2.4, output.shape[1] / 1600.0))
        thickness = max(2, round(font_scale * 2))
        text_size, baseline = cv2.getTextSize(
            composite_name,
            cv2.FONT_HERSHEY_SIMPLEX,
            font_scale,
            thickness,
        )
        text_origin = (
            label_point[0] - text_size[0] // 2,
            label_point[1] + text_size[1] // 2,
        )
        cv2.putText(
            output,
            composite_name,
            text_origin,
            cv2.FONT_HERSHEY_SIMPLEX,
            font_scale,
            (0, 0, 0),
            thickness + 4,
            cv2.LINE_AA,
        )
        cv2.putText(
            output,
            composite_name,
            text_origin,
            cv2.FONT_HERSHEY_SIMPLEX,
            font_scale,
            (255, 255, 255),
            thickness,
            cv2.LINE_AA,
        )
        section_records.append(
            {
                "compositeName": composite_name,
                "rowCount": sum(
                    1 for row in selected_rows if row["compositeName"] == composite_name
                ),
                "seatCount": sum(
                    len(row["seats"])
                    for row in selected_rows
                    if row["compositeName"] == composite_name
                ),
                "labelPixelInOutput": [int(value) for value in label_point],
                "colorBgr": list(color_for_name(composite_name)),
            }
        )

    arguments.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(arguments.output_png), output, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write the labeled section overlay")
    stable = {
        "inputs": {
            "registrationPath": str(arguments.registration.resolve()),
            "registrationSha256": hashlib.sha256(registration_bytes).hexdigest(),
            "registrationArtifactVersion": registration.get("artifactVersion"),
            "orthophotoCropPath": str(crop_path.resolve()),
            "orthophotoCropSha256": hashlib.sha256(crop_bytes).hexdigest(),
            "orthophotoImagePath": str(image_path.resolve()),
            "orthophotoImageSha256": crop["outputImage"]["sha256"],
        },
        "compositeNames": requested,
        "cropPixelsInOrthophoto": [left, top, right, bottom],
        "sections": section_records,
        "outputImage": {
            "path": str(arguments.output_png.resolve()),
            "sha256": sha256_file(arguments.output_png),
            "widthPixels": int(output.shape[1]),
            "heightPixels": int(output.shape[0]),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "ticketmaster-section-label-orthophoto-review-v1",
        "artifactStage": "provider-section-identity-review-overlay",
        "artifactVersion": artifact_version(stable),
        **stable,
        "publicationEligible": False,
        "blockers": [
            "LABEL_OVERLAY_IS_A_REVIEW_AID_ONLY",
            "BROADCAST_TO_SECTION_REGISTRATION_NOT_ESTABLISHED",
            "SUB_FOOT_ABSOLUTE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED",
            "ROW_ELEVATIONS_NOT_MEASURED",
        ],
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputImage": str(arguments.output_png),
                "outputManifest": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "sectionCount": len(section_records),
                "rowCount": len(selected_rows),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

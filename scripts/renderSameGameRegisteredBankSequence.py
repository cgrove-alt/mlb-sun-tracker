#!/usr/bin/env python3
"""Render checksum-locked same-game home-plate bank frames in one pixel frame."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("camera_review", type=Path)
    parser.add_argument("full_frame_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--bank-bottom-pixels", type=int, default=265)
    parser.add_argument("--scale", type=float, default=2.0)
    arguments = parser.parse_args()

    review_bytes = arguments.camera_review.read_bytes()
    frames_bytes = arguments.full_frame_manifest.read_bytes()
    review = json.loads(review_bytes)
    frame_manifest = json.loads(frames_bytes)
    review_records = {
        (item["candidateIndex"], item["sampleIndex"]): item
        for item in review["manualReviewQueue"]
    }
    frames = frame_manifest["frames"]
    if not frames:
        raise ValueError("No exact frames in manifest")
    first_key = (frames[0]["candidateIndex"], frames[0]["sampleIndex"])
    first_review = review_records[first_key]
    first_homography = np.asarray(
        first_review["homographyTemplateToFrame"], dtype=np.float64
    )
    registered: list[dict[str, Any]] = []
    images: list[np.ndarray] = []
    for frame in frames:
        key = (frame["candidateIndex"], frame["sampleIndex"])
        record = review_records[key]
        path = Path(frame["outputPath"])
        if sha256_file(path) != frame["outputPngSha256"]:
            raise ValueError(f"Full frame checksum changed: {path}")
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {path}")
        target_homography = np.asarray(
            record["homographyTemplateToFrame"], dtype=np.float64
        )
        target_to_first = first_homography @ np.linalg.inv(target_homography)
        warped = cv2.warpPerspective(
            image,
            target_to_first,
            (image.shape[1], image.shape[0]),
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(0, 0, 0),
        )
        crop = warped[: arguments.bank_bottom_pixels]
        images.append(crop)
        registered.append(
            {
                "candidateIndex": frame["candidateIndex"],
                "candidateId": frame["candidateId"],
                "sampleIndex": frame["sampleIndex"],
                "eventMidpointTime": frame["eventMidpointTime"],
                "solarPosition": frame["solarPosition"],
                "inputPath": str(path),
                "inputPngSha256": frame["outputPngSha256"],
                "targetToReferenceHomography": target_to_first.tolist(),
            }
        )

    reference_lab = cv2.cvtColor(images[0], cv2.COLOR_BGR2LAB).astype(np.float32)
    reference_luminance = reference_lab[:, :, 0]
    visualization_rows: list[np.ndarray] = []
    for index, (crop, record) in enumerate(zip(images, registered)):
        panel = crop.copy()
        label = (
            f"{record['candidateIndex']:03d} {record['eventMidpointTime']} "
            f"alt {record['solarPosition']['altitudeDegrees']:.2f}"
        )
        cv2.rectangle(panel, (0, 0), (panel.shape[1], 27), (255, 255, 255), -1)
        cv2.putText(
            panel,
            label,
            (8, 19),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.52,
            (0, 0, 0),
            1,
            cv2.LINE_AA,
        )
        current_luminance = cv2.cvtColor(crop, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32)
        difference = current_luminance - reference_luminance
        difference = np.clip((difference + 45.0) / 90.0 * 255.0, 0, 255).astype(np.uint8)
        heat = cv2.applyColorMap(difference, cv2.COLORMAP_JET)
        cv2.rectangle(heat, (0, 0), (heat.shape[1], 27), (255, 255, 255), -1)
        cv2.putText(
            heat,
            "Lab luminance change versus first frame; blue is darker",
            (8, 19),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.52,
            (0, 0, 0),
            1,
            cv2.LINE_AA,
        )
        visualization_rows.append(np.hstack((panel, heat)))

    sheet = np.vstack(visualization_rows)
    if arguments.scale != 1.0:
        sheet = cv2.resize(
            sheet,
            None,
            fx=arguments.scale,
            fy=arguments.scale,
            interpolation=cv2.INTER_LANCZOS4,
        )
    output_png = arguments.output_json.with_suffix(".png")
    if not cv2.imwrite(str(output_png), sheet, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write registered sequence")

    stable = {
        "reviewSha256": hashlib.sha256(review_bytes).hexdigest(),
        "fullFrameManifestSha256": hashlib.sha256(frames_bytes).hexdigest(),
        "bankBottomPixels": arguments.bank_bottom_pixels,
        "registeredFrames": registered,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "same-game-broadcast-bank-registration-v1",
        "artifactStage": "official-mlb-same-game-shadow-boundary-review",
        "artifactVersion": artifact_version(stable),
        "inputs": {
            "cameraReview": {
                "path": str(arguments.camera_review),
                "sha256": stable["reviewSha256"],
            },
            "fullFrameManifest": {
                "path": str(arguments.full_frame_manifest),
                "sha256": stable["fullFrameManifestSha256"],
            },
        },
        "referenceFrame": {
            "candidateIndex": frames[0]["candidateIndex"],
            "sampleIndex": frames[0]["sampleIndex"],
        },
        "bankBottomPixels": arguments.bank_bottom_pixels,
        "registeredFrames": registered,
        "reviewSheetPng": str(output_png),
        "reviewSheetPngSha256": sha256_file(output_png),
        "publicationEligible": False,
        "blockers": [
            "ROW_BANDS_NOT_REGISTERED",
            "LUMINANCE_DIFFERENCE_IS_VISUAL_REVIEW_AID_ONLY",
            "SHADE_BOUNDARIES_NOT_MANUALLY_LABELED",
        ],
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "frameCount": len(registered),
                "reviewSheet": str(output_png),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

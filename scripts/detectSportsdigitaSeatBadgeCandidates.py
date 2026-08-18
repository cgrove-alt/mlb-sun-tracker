#!/usr/bin/env python3
"""Detect numbered-seat badge candidates on Sportsdigita cube faces.

This produces checksum-locked review diagnostics. It never assigns a number,
row, or metric position to a candidate. Reviewed controls must be recorded in a
separate artifact and validated against unused badge observations.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-seat-badge-candidates-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_csv(value: str) -> list[str]:
    return [part.strip() for part in value.split(",") if part.strip()]


def detect_candidates(
    image: np.ndarray,
    section: str,
    face: str,
    arguments: argparse.Namespace,
) -> list[dict[str, Any]]:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    low_saturation_bright = (
        (hsv[:, :, 1] <= arguments.maximum_badge_saturation)
        & (hsv[:, :, 2] >= arguments.minimum_badge_value)
    ).astype(np.uint8) * 255
    saturated_seat = (
        (hsv[:, :, 1] >= arguments.minimum_nearby_seat_saturation)
        & (hsv[:, :, 2] >= arguments.minimum_nearby_seat_value)
    ).astype(np.uint8) * 255
    nearby_seat = cv2.dilate(
        saturated_seat,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)),
    )
    mask = cv2.bitwise_and(low_saturation_bright, nearby_seat)
    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)),
    )
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidates: list[dict[str, Any]] = []
    for contour in contours:
        area = float(cv2.contourArea(contour))
        if not arguments.minimum_area_pixels <= area <= arguments.maximum_area_pixels:
            continue
        left, top, width, height = cv2.boundingRect(contour)
        if width < 7 or height < 5 or width > 180 or height > 130:
            continue
        aspect = width / max(height, 1)
        if not 0.45 <= aspect <= 4.5:
            continue
        contour_mask = np.zeros(mask.shape, dtype=np.uint8)
        cv2.drawContours(contour_mask, [contour], -1, 255, -1)
        mean_hsv = cv2.mean(hsv, mask=contour_mask)[:3]
        candidates.append(
            {
                "candidateId": "",
                "boundsPixels": [left, top, left + width, top + height],
                "centerPixel": [round(left + width / 2.0, 3), round(top + height / 2.0, 3)],
                "contourAreaPixels": round(area, 3),
                "boundingAspectRatio": round(aspect, 6),
                "meanHsv": [round(float(component), 3) for component in mean_hsv],
            }
        )
    candidates.sort(key=lambda candidate: (candidate["centerPixel"][1], candidate["centerPixel"][0]))
    for index, candidate in enumerate(candidates, start=1):
        candidate["candidateId"] = f"{section}-{face}-badge-candidate-{index:03d}"
    return candidates


def render_diagnostics(
    image: np.ndarray,
    section: str,
    face: str,
    candidates: list[dict[str, Any]],
    output_directory: Path,
    minimum_review_area: float,
) -> tuple[Path, Path, int]:
    rendered = image.copy()
    for candidate in candidates:
        left, top, right, bottom = candidate["boundsPixels"]
        cv2.rectangle(rendered, (left, top), (right, bottom), (0, 255, 255), 2)
        cv2.putText(
            rendered,
            candidate["candidateId"].rsplit("-", 1)[-1],
            (left, max(18, top - 5)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
    diagnostic_path = output_directory / f"section-{section}-{face}-candidates.png"
    if not cv2.imwrite(str(diagnostic_path), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {diagnostic_path}")

    review_candidates = [
        candidate
        for candidate in candidates
        if candidate["contourAreaPixels"] >= minimum_review_area
    ]
    tile_width = 320
    tile_height = 300
    columns = 5
    rows = max(1, (len(review_candidates) + columns - 1) // columns)
    review = np.zeros((rows * tile_height, columns * tile_width, 3), dtype=np.uint8)
    for tile_index, candidate in enumerate(review_candidates):
        center_x, center_y = candidate["centerPixel"]
        radius = 90
        left = max(0, int(round(center_x)) - radius)
        top = max(0, int(round(center_y)) - radius)
        right = min(image.shape[1], int(round(center_x)) + radius)
        bottom = min(image.shape[0], int(round(center_y)) + radius)
        crop = image[top:bottom, left:right]
        scale = min((tile_width - 8) / crop.shape[1], (tile_height - 42) / crop.shape[0])
        resized = cv2.resize(
            crop,
            (int(round(crop.shape[1] * scale)), int(round(crop.shape[0] * scale))),
            interpolation=cv2.INTER_LANCZOS4,
        )
        tile_row = tile_index // columns
        tile_column = tile_index % columns
        origin_x = tile_column * tile_width
        origin_y = tile_row * tile_height
        review[
            origin_y + 36 : origin_y + 36 + resized.shape[0],
            origin_x : origin_x + resized.shape[1],
        ] = resized
        cv2.putText(
            review,
            candidate["candidateId"],
            (origin_x + 4, origin_y + 24),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.47,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
    review_path = output_directory / f"section-{section}-{face}-candidate-review.png"
    if not cv2.imwrite(str(review_path), review, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {review_path}")
    return diagnostic_path, review_path, len(review_candidates)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--sections", default="205,206,207,208,209")
    parser.add_argument("--faces", default="f,b,l,r,d")
    parser.add_argument("--maximum-badge-saturation", type=int, default=105)
    parser.add_argument("--minimum-badge-value", type=int, default=75)
    parser.add_argument("--minimum-nearby-seat-saturation", type=int, default=75)
    parser.add_argument("--minimum-nearby-seat-value", type=int, default=30)
    parser.add_argument("--minimum-area-pixels", type=float, default=35.0)
    parser.add_argument("--maximum-area-pixels", type=float, default=4000.0)
    parser.add_argument("--minimum-review-area-pixels", type=float, default=150.0)
    arguments = parser.parse_args()
    source_bytes = arguments.manifest.read_bytes()
    source = json.loads(source_bytes)
    if source.get("artifactKind") != "club-linked-section-panorama-research-input":
        raise ValueError("Input is not a club-linked panorama research artifact")
    sections = parse_csv(arguments.sections)
    faces = parse_csv(arguments.faces)
    if any(face not in {"f", "b", "l", "r", "u", "d"} for face in faces):
        raise ValueError("Faces must use f,b,l,r,u,d")
    by_section = {str(record["sectionId"]): record for record in source["sections"]}
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, Any]] = []
    for section in sections:
        panorama = by_section.get(section)
        if panorama is None:
            raise ValueError(f"Section {section} is absent from the source manifest")
        images = {entry["face"]: entry for entry in panorama["images"]}
        for face in faces:
            image_entry = images.get(face)
            if image_entry is None:
                raise ValueError(f"Section {section} has no {face} cube face")
            image_path = Path(image_entry["localPath"])
            image_sha256 = sha256_file(image_path)
            if image_sha256 != image_entry["sha256"]:
                raise ValueError(f"Checksum mismatch for {image_path}")
            image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
            if image is None:
                raise ValueError(f"Could not decode {image_path}")
            candidates = detect_candidates(image, section, face, arguments)
            diagnostic_path, review_path, review_count = render_diagnostics(
                image,
                section,
                face,
                candidates,
                arguments.output_directory,
                arguments.minimum_review_area_pixels,
            )
            records.append(
                {
                    "sectionId": section,
                    "panoramaId": panorama["panoramaId"],
                    "face": face,
                    "sourcePath": str(image_path.resolve()),
                    "sourceSha256": image_sha256,
                    "width": image.shape[1],
                    "height": image.shape[0],
                    "candidateCount": len(candidates),
                    "candidates": candidates,
                    "diagnosticPath": str(diagnostic_path.resolve()),
                    "diagnosticSha256": sha256_file(diagnostic_path),
                    "reviewCandidateCount": review_count,
                    "reviewPath": str(review_path.resolve()),
                    "reviewSha256": sha256_file(review_path),
                    "reviewResampling": "Lanczos diagnostic only",
                }
            )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "sourceManifest": {
            "path": str(arguments.manifest.resolve()),
            "sha256": hashlib.sha256(source_bytes).hexdigest(),
            "artifactVersion": source["artifactVersion"],
        },
        "parameters": {
            "sections": sections,
            "faces": faces,
            "maximumBadgeSaturation": arguments.maximum_badge_saturation,
            "minimumBadgeValue": arguments.minimum_badge_value,
            "minimumNearbySeatSaturation": arguments.minimum_nearby_seat_saturation,
            "minimumNearbySeatValue": arguments.minimum_nearby_seat_value,
            "minimumAreaPixels": arguments.minimum_area_pixels,
            "maximumAreaPixels": arguments.maximum_area_pixels,
            "minimumReviewAreaPixels": arguments.minimum_review_area_pixels,
        },
        "images": records,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "seat-badge-review-candidates",
        "artifactVersion": artifact_version(stable),
        **stable,
        "conclusion": {
            "badgeCandidatesDetected": True,
            "badgeNumbersReviewed": False,
            "rowIdentitySupported": False,
            "metricGeometrySupported": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "AUTOMATED_BADGE_CANDIDATES_REQUIRE_REVIEW",
                "BADGE_NUMBERS_NOT_ASSIGNED",
                "EXACT_ROW_IDENTITY_NOT_ESTABLISHED",
                "METRIC_REGISTRATION_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    output_manifest = arguments.output_directory / "manifest.json"
    output_manifest.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(output_manifest.resolve()),
                "artifactVersion": artifact["artifactVersion"],
                "imageCount": len(records),
                "candidateCount": sum(record["candidateCount"] for record in records),
                "reviewCandidateCount": sum(record["reviewCandidateCount"] for record in records),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render native-resolution orthophoto review sheets for candidate seating rows."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "ticketmaster-orthophoto-row-review-queue-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_version(value: Any) -> str:
    payload = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def safe_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")
    return cleaned or "section"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("orthophoto_crop", type=Path)
    parser.add_argument("surface_audit", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--section", action="append")
    parser.add_argument("--padding-pixels", type=int, default=50)
    parser.add_argument("--header-pixels", type=int, default=70)
    arguments = parser.parse_args()
    if arguments.padding_pixels < 0 or arguments.header_pixels < 40:
        raise ValueError("Review-sheet padding and header dimensions are invalid")

    world_bytes = arguments.world_rows.read_bytes()
    crop_bytes = arguments.orthophoto_crop.read_bytes()
    audit_bytes = arguments.surface_audit.read_bytes()
    world = json.loads(world_bytes)
    crop = json.loads(crop_bytes)
    audit = json.loads(audit_bytes)
    if world.get("artifactKind") != "ticketmaster-drcog-row-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if crop.get("artifactKind") != "drcog-orthophoto-crop":
        raise ValueError("Orthophoto input has the wrong artifact kind")
    if audit.get("artifactKind") != "ticketmaster-lidar-flightline-row-surface-audit":
        raise ValueError("Surface-audit input has the wrong artifact kind")
    stadium_ids = {world.get("stadiumId"), crop.get("stadiumId"), audit.get("stadiumId")}
    if len(stadium_ids) != 1 or None in stadium_ids:
        raise ValueError("Review inputs do not share one stadium identifier")
    expected_world_sha = (
        audit.get("inputs", {}).get("worldRows", {}).get("sha256")
    )
    if expected_world_sha != hashlib.sha256(world_bytes).hexdigest():
        raise ValueError("Surface audit does not reference the supplied world rows")
    image_path = Path(crop["outputImage"]["path"])
    if sha256_file(image_path) != crop["outputImage"]["sha256"]:
        raise ValueError("Orthophoto crop image checksum does not reproduce")
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("OpenCV could not decode the orthophoto crop")

    audit_by_row = {row["rowKey"]: row for row in audit["rows"]}
    if len(audit_by_row) != len(audit["rows"]):
        raise ValueError("Surface audit contains duplicate row keys")
    world_keys = {row["rowKey"] for row in world["rows"]}
    if world_keys != set(audit_by_row):
        raise ValueError("World rows and surface-audit row identities do not match")

    requested_sections = set(arguments.section or [])
    grouped: dict[str, list[dict[str, Any]]] = {}
    for row in world["rows"]:
        audit_row = audit_by_row[row["rowKey"]]
        section_name = row["sectionName"]
        if requested_sections and section_name not in requested_sections:
            continue
        if not requested_sections and not audit_row["seatingProfileCandidate"]:
            continue
        grouped.setdefault(section_name, []).append(row)
    if requested_sections - set(grouped):
        missing = sorted(requested_sections - set(grouped))
        raise ValueError(f"Requested sections are absent: {missing}")
    if not grouped:
        raise ValueError("No sections qualify for review")

    bounds = crop["projectedBoundsFeet"]
    pixel_width, pixel_height = (float(value) for value in crop["pixelSizeFeet"])
    minimum_x = float(bounds["minimumX"])
    maximum_y = float(bounds["maximumY"])

    arguments.output_dir.mkdir(parents=True, exist_ok=True)
    queue: list[dict[str, Any]] = []
    for section_name in sorted(grouped, key=lambda value: (len(value), value)):
        rows = grouped[section_name]
        row_pixels: list[tuple[dict[str, Any], np.ndarray]] = []
        for row in rows:
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
            pixels = np.column_stack(
                (
                    (projected[:, 0] - minimum_x) / pixel_width,
                    (projected[:, 1] - maximum_y) / pixel_height,
                )
            )
            row_pixels.append((row, pixels))
        all_pixels = np.vstack([pixels for _, pixels in row_pixels])
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
        if right - left < 40 or bottom - top < 40:
            continue
        original = image[top:bottom, left:right].copy()
        overlay = original.copy()
        visible_profile_rows = 0
        repeatable_rows = 0
        for row, pixels in row_pixels:
            audit_row = audit_by_row[row["rowKey"]]
            shifted = pixels - np.asarray([left, top], dtype=np.float64)
            integer = np.rint(shifted).astype(np.int32)
            inside = (
                (integer[:, 0] >= 0)
                & (integer[:, 0] < overlay.shape[1])
                & (integer[:, 1] >= 0)
                & (integer[:, 1] < overlay.shape[0])
            )
            if np.count_nonzero(inside) < 2:
                continue
            if audit_row["seatingProfileCandidate"]:
                color = (40, 220, 40)
                visible_profile_rows += 1
            elif audit_row["repeatableTopmostSurfaceAtProviderCoordinate"]:
                color = (0, 190, 255)
                repeatable_rows += 1
            else:
                color = (40, 40, 230)
            points = integer[inside]
            cv2.polylines(
                overlay,
                [points.reshape((-1, 1, 2))],
                False,
                color,
                1,
                cv2.LINE_AA,
            )
            for point in points:
                cv2.circle(overlay, tuple(point), 1, color, -1, cv2.LINE_AA)
            midpoint = tuple(int(value) for value in points[len(points) // 2])
            cv2.putText(
                overlay,
                str(row["rowName"]),
                midpoint,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.32,
                color,
                1,
                cv2.LINE_AA,
            )
        body = np.hstack((original, overlay))
        canvas = np.full(
            (body.shape[0] + arguments.header_pixels, body.shape[1], 3),
            255,
            dtype=np.uint8,
        )
        canvas[arguments.header_pixels :, :] = body
        composite_names = sorted(
            {str(row.get("compositeName")) for row in rows if row.get("compositeName")}
        )
        cv2.putText(
            canvas,
            f"Section {section_name} | composite {', '.join(composite_names) or 'unknown'}",
            (12, 24),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.58,
            (20, 20, 20),
            1,
            cv2.LINE_AA,
        )
        cv2.putText(
            canvas,
            "Left: raw 2022 DRCOG orthophoto | Right: provider rows | green profile | amber repeatable surface | red unresolved",
            (12, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.42,
            (20, 20, 20),
            1,
            cv2.LINE_AA,
        )
        output_path = arguments.output_dir / f"section-{safe_name(section_name)}.png"
        if not cv2.imwrite(str(output_path), canvas, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
            raise ValueError(f"Could not write review sheet {output_path}")
        queue.append(
            {
                "sectionName": section_name,
                "compositeNames": composite_names,
                "rowCount": len(rows),
                "seatingProfileCandidateRowCount": visible_profile_rows,
                "otherRepeatableTopmostSurfaceRowCount": repeatable_rows,
                "pixelBounds": {
                    "left": left,
                    "top": top,
                    "right": right,
                    "bottom": bottom,
                },
                "reviewSheet": {
                    "path": str(output_path.resolve()),
                    "sha256": sha256_file(output_path),
                    "widthPixels": int(canvas.shape[1]),
                    "heightPixels": int(canvas.shape[0]),
                },
                "reviewStatus": "pending-independent-row-identity-and-relief-review",
                "requiredReview": {
                    "frontAndBackRowIdentitiesAnchored": False,
                    "minimumTrainingControls": 6,
                    "minimumTrainingRows": 3,
                    "minimumHoldoutControls": 4,
                    "minimumHoldoutRows": 2,
                    "maximumAcceptedP95HorizontalResidualFeet": 1.0,
                    "maximumAcceptedHorizontalResidualFeet": 1.0,
                    "aboveGroundReliefResolved": False,
                },
            }
        )

    ground_frame_verified = bool(
        world.get("geometryBoundary", {}).get(
            "establishesSubFootGroundOrthophotoFrame"
        )
        and world.get("diagnostics", {}).get(
            "orthophotoGroundFrameHorizontalAccuracyVerifiedAt95Percent"
        )
    )
    ground_frame_uncertainty = world.get("diagnostics", {}).get(
        "orthophotoGroundFrameHorizontalUncertainty95Feet"
    )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "worldRowsSha256": hashlib.sha256(world_bytes).hexdigest(),
            "orthophotoCropSha256": hashlib.sha256(crop_bytes).hexdigest(),
            "surfaceAuditSha256": hashlib.sha256(audit_bytes).hexdigest(),
        },
        "groundFrameEvidence": {
            "verifiedAt95Percent": ground_frame_verified,
            "horizontalUncertainty95Feet": ground_frame_uncertainty,
        },
        "manualReviewQueue": queue,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-orthophoto-row-review-queue",
        "analysisVersion": ANALYSIS_VERSION,
        "artifactVersion": stable_version(stable),
        "stadiumId": world["stadiumId"],
        "inputs": {
            "worldRows": {
                "path": str(arguments.world_rows.resolve()),
                "sha256": stable["inputs"]["worldRowsSha256"],
                "artifactVersion": world["artifactVersion"],
            },
            "orthophotoCrop": {
                "path": str(arguments.orthophoto_crop.resolve()),
                "sha256": stable["inputs"]["orthophotoCropSha256"],
                "artifactVersion": crop["artifactVersion"],
                "imageryYear": 2022,
            },
            "surfaceAudit": {
                "path": str(arguments.surface_audit.resolve()),
                "sha256": stable["inputs"]["surfaceAuditSha256"],
                "artifactVersion": audit["artifactVersion"],
            },
        },
        "summary": {
            "queuedSectionCount": len(queue),
            "queuedRowCount": sum(record["rowCount"] for record in queue),
            "queuedSeatingProfileCandidateRowCount": sum(
                record["seatingProfileCandidateRowCount"] for record in queue
            ),
            "acceptedSectionCount": 0,
            "acceptedRowCount": 0,
        },
        "manualReviewQueue": queue,
        "geometryBoundary": {
            "establishesNativeResolutionVisualRowReview": True,
            "usesNgsControlledSubFootGroundOrthophotoFrame": ground_frame_verified,
            "groundOrthophotoFrameHorizontalUncertainty95Feet": (
                ground_frame_uncertainty
            ),
            "establishesIndependentReviewedControls": False,
            "establishesExactRowRegistration": False,
            "establishesCurrent2026RowGeometry": False,
            "note": (
                "The sheets expose direct provider-to-image alignment at native resolution. "
                "They do not replace independently marked training and holdout controls, "
                "above-ground relief correction, or a current-image change check."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "INDEPENDENT_ROW_IDENTITY_CONTROLS_PENDING",
                "FRONT_AND_BACK_ROW_ANCHORS_PENDING",
                "ABOVE_GROUND_RELIEF_NOT_RESOLVED",
                *(
                    []
                    if ground_frame_verified
                    else ["ORTHOPHOTO_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT"]
                ),
                "CURRENT_2024_ORTHOPHOTO_NOT_PUBLICLY_DOWNLOADABLE",
                "CURRENT_OVERHANG_UNDERSIDES_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    manifest_path = arguments.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifest": str(manifest_path),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "publication": artifact["publication"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

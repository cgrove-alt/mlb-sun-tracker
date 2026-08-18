#!/usr/bin/env python3
"""Render current provider Section 4 paths over the historical A21 plan.

This is a diagnostic atlas only. The coarse field-seed transform and the design
development plan are both excluded from publication geometry.
"""

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
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def inverse_affine(affine: np.ndarray) -> np.ndarray:
    matrix = affine[:, :2]
    translation = affine[:, 2]
    inverse = np.linalg.inv(matrix)
    return np.column_stack((inverse, -inverse @ translation))


def row_sort_key(row_id: str) -> tuple[int, int | str]:
    letter_order = {"D": 0, "E": 1, "F": 2, "G": 3, "H": 4, "J": 5, "K": 6}
    if row_id in letter_order:
        return (0, letter_order[row_id])
    if row_id.isdigit():
        return (1, int(row_id))
    return (2, row_id)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("plan", type=Path)
    parser.add_argument("seed_manifest", type=Path)
    parser.add_argument("provider_world_rows", type=Path)
    parser.add_argument("output_image", type=Path)
    parser.add_argument("output_manifest", type=Path)
    args = parser.parse_args()

    plan = cv2.imread(str(args.plan), cv2.IMREAD_COLOR)
    if plan is None:
        raise ValueError("A21 plan image could not be decoded")
    seed_manifest = json.loads(args.seed_manifest.read_text())
    provider_artifact = json.loads(args.provider_world_rows.read_text())
    plan_to_world = np.asarray(
        seed_manifest["transform"]["planPixelToEpsg6438FeetAffine"],
        dtype=np.float64,
    )
    world_to_plan = inverse_affine(plan_to_world)

    section_rows = sorted(
        (row for row in provider_artifact["rows"] if row["sectionId"] == "SEC4"),
        key=lambda row: row_sort_key(str(row["rowId"])),
    )
    projected_rows: list[dict[str, Any]] = []
    all_points: list[np.ndarray] = []
    for row in section_rows:
        world = np.asarray(
            [anchor["projectedCoordinateUsSurveyFeet"] for anchor in row["anchors"]],
            dtype=np.float64,
        )
        pixels = cv2.transform(world[None], world_to_plan)[0]
        all_points.append(pixels)
        projected_rows.append(
            {
                "rowKey": row["rowKey"],
                "rowId": str(row["rowId"]),
                "publishedSeatCount": row["publishedSeatCount"],
                "planPixels": pixels.tolist(),
            }
        )

    stacked = np.vstack(all_points)
    padding = 260
    x0 = max(0, int(np.floor(stacked[:, 0].min())) - padding)
    y0 = max(0, int(np.floor(stacked[:, 1].min())) - padding)
    x1 = min(plan.shape[1], int(np.ceil(stacked[:, 0].max())) + padding)
    y1 = min(plan.shape[0], int(np.ceil(stacked[:, 1].max())) + padding)
    raw_crop = plan[y0:y1, x0:x1].copy()
    overlay = raw_crop.copy()

    for index, row in enumerate(projected_rows):
        pixels = np.asarray(row["planPixels"], dtype=np.float64)
        crop_pixels = np.rint(pixels - [x0, y0]).astype(np.int32)
        is_letter_row = not row["rowId"].isdigit()
        color = (245, 45, 220) if is_letter_row else (30, 80, 245)
        thickness = 3 if row["rowId"] in {"H", "J", "K"} else 2
        cv2.polylines(overlay, [crop_pixels], False, color, thickness, cv2.LINE_AA)
        for point in crop_pixels:
            cv2.circle(overlay, tuple(point), 3, color, -1, cv2.LINE_AA)
        if is_letter_row or index % 3 == 0:
            label_point = tuple(crop_pixels[len(crop_pixels) // 2])
            cv2.putText(
                overlay,
                row["rowId"],
                (label_point[0] + 8, label_point[1] - 7),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                color,
                2,
                cv2.LINE_AA,
            )

    divider = np.full((14, raw_crop.shape[1], 3), 225, dtype=np.uint8)
    output = np.vstack((raw_crop, divider, overlay))
    cv2.putText(
        output,
        "RAW A21 DESIGN PLAN",
        (18, 34),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (20, 20, 20),
        2,
        cv2.LINE_AA,
    )
    cv2.putText(
        output,
        "CURRENT PROVIDER PATHS: LETTER ROWS MAGENTA, NUMBERED ROWS RED",
        (18, raw_crop.shape[0] + divider.shape[0] + 34),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (20, 20, 20),
        2,
        cv2.LINE_AA,
    )

    args.output_image.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_image), output):
        raise ValueError("Review image write failed")

    stable = {
        "planSha256": sha256_file(args.plan),
        "seedManifestSha256": sha256_file(args.seed_manifest),
        "providerWorldRowsSha256": sha256_file(args.provider_world_rows),
        "sectionRows": projected_rows,
        "cropBoundsPlanPixels": [x0, y0, x1, y1],
        "outputImageSha256": sha256_file(args.output_image),
    }
    manifest = {
        "schemaVersion": 1,
        "artifactKind": "design-plan-current-provider-section-review",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "sectionId": "SEC4",
        "inputs": {
            "planPath": str(args.plan),
            "planSha256": stable["planSha256"],
            "seedManifestPath": str(args.seed_manifest),
            "seedManifestSha256": stable["seedManifestSha256"],
            "providerWorldRowsPath": str(args.provider_world_rows),
            "providerWorldRowsSha256": stable["providerWorldRowsSha256"],
        },
        "transform": {
            "worldEpsg6438FeetToPlanPixelAffine": world_to_plan.tolist(),
            "source": "excluded coarse field-seed similarity",
        },
        "cropBoundsPlanPixels": stable["cropBoundsPlanPixels"],
        "rowCount": len(projected_rows),
        "rows": projected_rows,
        "output": {
            "imagePath": str(args.output_image),
            "imageSha256": stable["outputImageSha256"],
        },
        "geometryBoundary": {
            "establishesMetricRegistration": False,
            "establishesAsBuiltRowGeometry": False,
            "establishesCurrentPhysicalPersistence": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "SEED_CONTROLS_EXCLUDED_FROM_FINAL_REGISTRATION",
                "DESIGN_DEVELOPMENT_IS_NOT_AS_BUILT",
                "PLAN_SCAN_WARP_NOT_QUANTIFIED",
                "CURRENT_PHYSICAL_PERSISTENCE_NOT_ESTABLISHED",
            ],
        },
    }
    args.output_manifest.parent.mkdir(parents=True, exist_ok=True)
    args.output_manifest.write_text(json.dumps(manifest, indent=2) + "\n")
    print(
        json.dumps(
            {
                "manifest": str(args.output_manifest),
                "artifactVersion": manifest["artifactVersion"],
                "image": str(args.output_image),
                "rowCount": len(projected_rows),
                "cropBoundsPlanPixels": stable["cropBoundsPlanPixels"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

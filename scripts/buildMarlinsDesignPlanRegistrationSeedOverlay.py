#!/usr/bin/env python3
"""Build a coarse, non-publishable A21 plan-to-orthophoto review overlay.

The three infield controls are intentionally seed-only. They locate structural
features for independent training and holdout selection, but they are never
eligible for the final metric registration fit.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ORTHO_EXTENT_FEET = (912500.0, 525000.0, 913750.0, 526250.0)
ORTHO_PIXEL_FEET = 0.25
SEEDS = (
    {
        "id": "home-infield-inner-corner",
        "planPixel": [1588.5, 999.5],
        "worldEpsg6438Feet": [912893.5467413014, 525882.7960286718],
    },
    {
        "id": "mound-cover-center",
        "planPixel": [1689.5, 1079.5],
        "worldEpsg6438Feet": [912937.2628470144, 525847.218290064],
    },
    {
        "id": "second-infield-inner-corner",
        "planPixel": [1802.5, 1186.5],
        "worldEpsg6438Feet": [912988.8328375687, 525806.4401377593],
    },
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def fit_similarity(plan: np.ndarray, world: np.ndarray) -> np.ndarray:
    matrix = np.zeros((plan.shape[0] * 2, 4), dtype=np.float64)
    target = np.zeros(plan.shape[0] * 2, dtype=np.float64)
    for index, ((x, y), (east, north)) in enumerate(zip(plan, world)):
        matrix[2 * index] = [x, -y, 1.0, 0.0]
        matrix[2 * index + 1] = [y, x, 0.0, 1.0]
        target[2 * index] = east
        target[2 * index + 1] = north
    a, b, tx, ty = np.linalg.lstsq(matrix, target, rcond=None)[0]
    return np.asarray([[a, -b, tx], [b, a, ty]], dtype=np.float64)


def world_to_ortho_affine() -> np.ndarray:
    xmin, _ymin, _xmax, ymax = ORTHO_EXTENT_FEET
    return np.asarray(
        [
            [1.0 / ORTHO_PIXEL_FEET, 0.0, -xmin / ORTHO_PIXEL_FEET],
            [0.0, -1.0 / ORTHO_PIXEL_FEET, ymax / ORTHO_PIXEL_FEET],
        ],
        dtype=np.float64,
    )


def compose_affine(first: np.ndarray, second: np.ndarray) -> np.ndarray:
    first3 = np.vstack((first, [0.0, 0.0, 1.0]))
    second3 = np.vstack((second, [0.0, 0.0, 1.0]))
    return (second3 @ first3)[:2]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("plan", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("output_overlay", type=Path)
    parser.add_argument("output_manifest", type=Path)
    args = parser.parse_args()

    plan_image = cv2.imread(str(args.plan), cv2.IMREAD_GRAYSCALE)
    orthophoto = cv2.imread(str(args.orthophoto), cv2.IMREAD_COLOR)
    if plan_image is None or orthophoto is None:
        raise ValueError("Plan or orthophoto image could not be decoded")
    if plan_image.shape != (2550, 3300):
        raise ValueError(f"Unexpected plan dimensions: {plan_image.shape}")
    if orthophoto.shape[:2] != (5000, 5000):
        raise ValueError(f"Unexpected orthophoto dimensions: {orthophoto.shape[:2]}")

    plan_points = np.asarray([item["planPixel"] for item in SEEDS], dtype=np.float64)
    world_points = np.asarray(
        [item["worldEpsg6438Feet"] for item in SEEDS], dtype=np.float64
    )
    plan_to_world = fit_similarity(plan_points, world_points)
    predicted_world = cv2.transform(plan_points[None], plan_to_world)[0]
    residuals = np.linalg.norm(predicted_world - world_points, axis=1)
    plan_to_ortho = compose_affine(plan_to_world, world_to_ortho_affine())

    ink = np.where(plan_image < 170, 255, 0).astype(np.uint8)
    stadium_mask = np.zeros_like(ink)
    stadium_mask[150:2200, 400:3000] = 255
    ink = cv2.bitwise_and(ink, stadium_mask)
    warped = cv2.warpAffine(
        ink,
        plan_to_ortho,
        (orthophoto.shape[1], orthophoto.shape[0]),
        flags=cv2.INTER_NEAREST,
        borderValue=0,
    )
    overlay = orthophoto.copy()
    overlay[warped > 0] = (20, 20, 245)
    blended = cv2.addWeighted(orthophoto, 0.58, overlay, 0.42, 0.0)

    for item, point in zip(SEEDS, plan_points):
        pixel = cv2.transform(point.reshape(1, 1, 2), plan_to_ortho)[0, 0]
        center = tuple(int(round(value)) for value in pixel)
        cv2.circle(blended, center, 14, (0, 230, 255), 4, cv2.LINE_AA)
        cv2.putText(
            blended,
            item["id"],
            (center[0] + 18, center[1] - 12),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 230, 255),
            2,
            cv2.LINE_AA,
        )

    args.output_overlay.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_overlay), blended):
        raise ValueError("Overlay write failed")

    scale_feet_per_pixel = float(
        np.hypot(plan_to_world[0, 0], plan_to_world[1, 0])
    )
    stable = {
        "planSha256": sha256_file(args.plan),
        "orthophotoSha256": sha256_file(args.orthophoto),
        "seeds": SEEDS,
        "planToWorldAffine": plan_to_world.tolist(),
        "residualFeet": residuals.tolist(),
        "outputOverlaySha256": sha256_file(args.output_overlay),
    }
    manifest = {
        "schemaVersion": 1,
        "artifactKind": "design-plan-registration-seed-overlay",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "planPath": str(args.plan),
            "planSha256": stable["planSha256"],
            "orthophotoPath": str(args.orthophoto),
            "orthophotoSha256": stable["orthophotoSha256"],
        },
        "seedControls": [
            {
                **item,
                "fitResidualFeet": float(residual),
                "eligibleForFinalRegistration": False,
                "reason": "FIELD_FEATURE_IS_NOT_A_CONSTRUCTION_STABLE_HARD_STRUCTURE",
            }
            for item, residual in zip(SEEDS, residuals)
        ],
        "transform": {
            "planPixelToEpsg6438FeetAffine": plan_to_world.tolist(),
            "planPixelToOrthophotoPixelAffine": plan_to_ortho.tolist(),
            "scaleFeetPerPlanPixel": scale_feet_per_pixel,
            "maximumSeedResidualFeet": float(residuals.max()),
        },
        "output": {
            "overlayPath": str(args.output_overlay),
            "overlaySha256": stable["outputOverlaySha256"],
            "redLineMeaning": "historical A21 design-plan ink",
            "yellowCircleMeaning": "excluded coarse field seed",
        },
        "assessment": {
            "eligibleForMetricGeometry": False,
            "blockers": [
                "SEED_CONTROLS_EXCLUDED_FROM_FINAL_REGISTRATION",
                "CONSTRUCTION_STABLE_TRAINING_CONTROLS_NOT_SELECTED",
                "DISJOINT_HARD_STRUCTURE_HOLDOUT_NOT_SCORED",
                "PLAN_SCAN_WARP_NOT_QUANTIFIED",
                "DESIGN_DEVELOPMENT_IS_NOT_AS_BUILT",
                "CURRENT_PERSISTENCE_NOT_ESTABLISHED",
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
                "overlay": str(args.output_overlay),
                "scaleFeetPerPlanPixel": scale_feet_per_pixel,
                "seedResidualFeet": residuals.tolist(),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

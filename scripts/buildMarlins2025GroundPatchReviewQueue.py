#!/usr/bin/env python3
"""Build a manual review queue for direct 2025-ortho to 2024-LiDAR ground patches.

The proposal coordinates are fixed from a complete visual review of the two
source rasters at their nominal EPSG:6438 positions. No cross-sensor offset,
registration transform, or residual is computed here. The queue is intended
only to identify durable at-grade features before training and final-holdout
roles are locked.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file
from buildMarlins2025OrthoGroundControlQueue import (
    CELL_FEET,
    build_ground_intensity,
    build_orthophoto,
)


ANALYSIS_VERSION = "marlins-2025-orthophoto-2024-lidar-ground-patch-queue-v1"
PATCH_HALF_WIDTH_FEET = 55.0

# Display coordinates refer to the one-foot, north-up review rasters. They were
# selected for perimeter roads and plazas before any cross-sensor localization.
PROPOSALS = [
    ("north-west-road-a", 60.0, 55.0),
    ("north-west-road-b", 160.0, 55.0),
    ("north-west-road-c", 285.0, 55.0),
    ("north-central-road-a", 480.0, 55.0),
    ("north-central-road-b", 675.0, 55.0),
    ("north-east-intersection", 965.0, 55.0),
    ("north-far-east-road", 1150.0, 55.0),
    ("west-upper-plaza-a", 50.0, 220.0),
    ("west-upper-plaza-b", 120.0, 300.0),
    ("west-middle-plaza-a", 55.0, 420.0),
    ("west-middle-plaza-b", 55.0, 630.0),
    ("west-lower-plaza-a", 70.0, 800.0),
    ("west-lower-plaza-b", 200.0, 950.0),
    ("south-west-road-a", 250.0, 1120.0),
    ("south-west-road-b", 390.0, 1120.0),
    ("south-central-road-a", 580.0, 1120.0),
    ("south-central-road-b", 780.0, 1120.0),
    ("south-east-intersection", 965.0, 1120.0),
    ("south-far-east-road", 1150.0, 1120.0),
    ("east-upper-road-a", 965.0, 160.0),
    ("east-upper-intersection", 965.0, 333.0),
    ("east-upper-road-b", 965.0, 480.0),
    ("east-middle-intersection", 965.0, 650.0),
    ("east-lower-road-a", 965.0, 820.0),
    ("east-lower-road-b", 965.0, 1000.0),
    ("far-east-upper-intersection", 1120.0, 333.0),
    ("far-east-middle-intersection", 1120.0, 650.0),
    ("far-east-lower-intersection", 1120.0, 820.0),
    ("far-east-lower-road", 1120.0, 1000.0),
    ("north-east-plaza", 780.0, 130.0),
    ("east-upper-plaza", 820.0, 250.0),
    ("south-east-plaza", 780.0, 900.0),
    ("south-west-plaza", 300.0, 900.0),
]


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def crop_display(image: np.ndarray, x: float, y: float, half: int) -> np.ndarray:
    display = np.flipud(image)
    center_x = int(round(x))
    center_y = int(round(y))
    x0 = center_x - half
    y0 = center_y - half
    x1 = center_x + half
    y1 = center_y + half
    shape = (half * 2, half * 2) if display.ndim == 2 else (
        half * 2,
        half * 2,
        display.shape[2],
    )
    output = np.zeros(shape, dtype=np.uint8)
    source_x0 = max(0, x0)
    source_y0 = max(0, y0)
    source_x1 = min(display.shape[1], x1)
    source_y1 = min(display.shape[0], y1)
    output[
        source_y0 - y0:source_y1 - y0,
        source_x0 - x0:source_x1 - x0,
    ] = display[source_y0:source_y1, source_x0:source_x1]
    return output


def panel(image: np.ndarray, x: float, y: float, label: str, half: int) -> Image.Image:
    output = Image.fromarray(crop_display(image, x, y, half)).convert("RGB")
    draw = ImageDraw.Draw(output)
    center = half
    draw.line((center - 8, center, center + 8, center), fill="red", width=2)
    draw.line((center, center - 8, center, center + 8), fill="red", width=2)
    draw.text((4, 4), label, fill="yellow")
    return output


def render_sheet(
    path: Path,
    candidates: list[dict[str, Any]],
    orthophoto: dict[str, Any],
    lidar: dict[str, Any],
) -> None:
    half = int(round(PATCH_HALF_WIDTH_FEET / CELL_FEET))
    size = half * 2
    label_height = 36
    sheet = Image.new("RGB", (size * 4, len(candidates) * (size + label_height)), "white")
    draw = ImageDraw.Draw(sheet)
    for row, candidate in enumerate(candidates):
        x, y = candidate["displayPixelOneFoot"]
        panels = (
            (orthophoto["rgbImage"], "2025 orthophoto"),
            (orthophoto["featureImage"], "2025 ortho high-pass"),
            (lidar["intensityImage"], "2024 ground intensity"),
            (lidar["featureImage"], "2024 intensity high-pass"),
        )
        for column, (image, label) in enumerate(panels):
            sheet.paste(
                panel(image, x, y, label, half),
                (column * size, row * (size + label_height)),
            )
        draw.text(
            (4, row * (size + label_height) + size + 2),
            (
                f"{candidate['candidateId']} {candidate['proposalLabel']}  "
                f"local {candidate['localFeet'][0]:.1f},{candidate['localFeet'][1]:.1f} ft  "
                f"direct ground coverage {candidate['directGroundCoverageFraction']:.3f}  "
                "offset not measured"
            ),
            fill="black",
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path)


def build_queue(
    orthophoto_audit_path: Path,
    mosaic_path: Path,
    lidar_path: Path,
    output_png: Path,
    chunk_size: int,
) -> dict[str, Any]:
    audit, audit_sha256 = locked_json(orthophoto_audit_path)
    mosaic, mosaic_sha256 = locked_json(mosaic_path)
    if not audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official 2025 orthophoto ground frame is not accepted")
    raster = mosaic["raster"]
    if raster["coordinateReferenceSystem"] != "EPSG:6438":
        raise ValueError("Orthophoto is not in EPSG:6438")
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Orthophoto raster checksum mismatch")
    if sha256_file(lidar_path) != sha256_file(lidar_path):
        raise ValueError("LiDAR checksum could not be established")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar = build_ground_intensity(lidar_path, extent, chunk_size)
    orthophoto = build_orthophoto(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        lidar["coverageMask"],
    )
    height, width = lidar["coverageMask"].shape
    if not (width == 1250 and height == 1250):
        raise ValueError("Unexpected one-foot review raster dimensions")
    half = int(round(PATCH_HALF_WIDTH_FEET / CELL_FEET))
    candidates: list[dict[str, Any]] = []
    for index, (label, display_x, display_y) in enumerate(PROPOSALS):
        low_y = height - display_y
        local_x = display_x - width / 2.0
        local_y = low_y - height / 2.0
        coverage_crop = crop_display(
            lidar["coverageMask"],
            display_x,
            display_y,
            half,
        )
        candidates.append({
            "candidateId": f"ground-patch-{index:02d}",
            "proposalLabel": label,
            "displayPixelOneFoot": [display_x, display_y],
            "localFeet": [local_x, local_y],
            "statePlaneFeet": [
                extent["xmin"] + display_x,
                extent["ymin"] + low_y,
            ],
            "patchHalfWidthFeet": PATCH_HALF_WIDTH_FEET,
            "directGroundCoverageFraction": float(np.mean(coverage_crop > 0)),
            "crossSensorOffsetMeasured": False,
        })
    render_sheet(output_png, candidates, orthophoto, lidar)
    stable = {
        "auditSha256": audit_sha256,
        "mosaicSha256": mosaic_sha256,
        "lidarSha256": sha256_file(lidar_path),
        "patchHalfWidthFeet": PATCH_HALF_WIDTH_FEET,
        "proposals": candidates,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-orthophoto-2024-lidar-ground-patch-review-queue",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "orthophotoAudit": {
                "path": str(orthophoto_audit_path),
                "sha256": audit_sha256,
                "artifactVersion": audit["artifactVersion"],
            },
            "mosaicManifest": {
                "path": str(mosaic_path),
                "sha256": mosaic_sha256,
                "artifactVersion": mosaic["artifactVersion"],
            },
            "orthophotoRaster": {"path": str(raster_path), "sha256": raster["sha256"]},
            "comparisonLidar": {
                "path": str(lidar_path),
                "sha256": stable["lidarSha256"],
                "acquiredOn": "2024-02-22",
                "coordinateReferenceSystem": "EPSG:6438",
            },
        },
        "sourceAccuracy": {
            "orthophotoHorizontalAccuracy95Feet": audit["accuracyAssessment"][
                "officialDatasetHorizontalAccuracy95Feet"
            ],
            "elevatedFeatureAccuracyUsed": False,
        },
        "proposalProtocol": {
            "completeNominalSourceRastersReviewed": True,
            "proposalMode": "predeclared-at-grade-perimeter-patches",
            "crossSensorOffsetsComputedDuringProposal": False,
            "registrationResidualsComputedDuringProposal": False,
            "elevatedFeaturesExcluded": True,
            "vegetationAndVehiclesNotEligibleAsControlSemantics": True,
        },
        "extentStatePlaneFeet": extent,
        "candidates": candidates,
        "reviewSheet": {"path": str(output_png), "sha256": sha256_file(output_png)},
        "assessment": {
            "manualSemanticReviewRequired": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "GROUND_PATCH_SEMANTICS_NOT_YET_REVIEWED",
                "TRAINING_AND_FINAL_HOLDOUT_PARTITIONS_NOT_YET_LOCKED",
                "SUBPIXEL_GROUND_REGISTRATION_NOT_YET_AUDITED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("orthophoto_audit", type=Path)
    parser.add_argument("mosaic_manifest", type=Path)
    parser.add_argument("lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()
    artifact = build_queue(
        arguments.orthophoto_audit,
        arguments.mosaic_manifest,
        arguments.lidar,
        arguments.output_png,
        arguments.chunk_size,
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(artifact["candidates"]),
        "reviewSheet": artifact["reviewSheet"],
    }, indent=2))


if __name__ == "__main__":
    main()

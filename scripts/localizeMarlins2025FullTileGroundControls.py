#!/usr/bin/env python3
"""Localize locked full-tile ground controls without fitting a transform."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file
from buildMarlins2025OrthoGroundControlQueue import (
    CELL_FEET,
    build_ground_intensity,
    build_orthophoto,
)


ANALYSIS_VERSION = "marlins-2025-full-tile-ground-localization-v1-training-development"
PATCH_HALF_WIDTHS_FEET = [35.0, 55.0, 75.0]
SEARCH_HALF_WIDTH_FEET = 3.0
MINIMUM_VALID_PIXEL_FRACTION = 0.20
MINIMUM_MATCH_RESPONSE = 0.08
MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT = 2
MAXIMUM_LOCALIZATION_ENVELOPE_FEET = 0.75


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def crop_centered(
    image: np.ndarray,
    center: np.ndarray,
    half_width: int,
) -> np.ndarray | None:
    center_x = int(round(float(center[0])))
    center_y = int(round(float(center[1])))
    x0 = center_x - half_width
    x1 = center_x + half_width
    y0 = center_y - half_width
    y1 = center_y + half_width
    if x0 < 0 or y0 < 0 or x1 > image.shape[1] or y1 > image.shape[0]:
        return None
    return image[y0:y1, x0:x1]


def quadratic_subpixel(values: np.ndarray, index: int) -> float:
    if index <= 0 or index >= len(values) - 1:
        return 0.0
    left = float(values[index - 1])
    center = float(values[index])
    right = float(values[index + 1])
    denominator = left - 2.0 * center + right
    if abs(denominator) < 1e-12:
        return 0.0
    return float(np.clip(0.5 * (left - right) / denominator, -0.5, 0.5))


def match_patch(
    orthophoto_gradient: np.ndarray,
    lidar_gradient: np.ndarray,
    coverage_mask: np.ndarray,
    center: np.ndarray,
    half_width_feet: float,
) -> dict[str, Any] | None:
    half = int(round(half_width_feet / CELL_FEET))
    search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    template = crop_centered(lidar_gradient, center, half)
    mask = crop_centered(coverage_mask, center, half)
    search = crop_centered(orthophoto_gradient, center, half + search_half)
    if template is None or mask is None or search is None:
        return None
    valid = mask > 0
    valid_fraction = float(np.mean(valid))
    if valid_fraction < MINIMUM_VALID_PIXEL_FRACTION:
        return None
    template = template.astype(np.float32)
    template[~valid] = 0.0
    if float(np.std(template[valid])) < 1e-6:
        return None
    response_surface = cv2.matchTemplate(
        search.astype(np.float32),
        template,
        cv2.TM_CCORR_NORMED,
        mask=valid.astype(np.uint8) * 255,
    )
    response_surface = np.nan_to_num(
        response_surface,
        nan=-1.0,
        posinf=-1.0,
        neginf=-1.0,
    )
    _, response, _, location = cv2.minMaxLoc(response_surface)
    location_x, location_y = location
    inside = bool(
        0 < location_x < response_surface.shape[1] - 1
        and 0 < location_y < response_surface.shape[0] - 1
    )
    subpixel_x = quadratic_subpixel(response_surface[location_y, :], location_x)
    subpixel_y = quadratic_subpixel(response_surface[:, location_x], location_y)
    shift = np.asarray([
        location_x + subpixel_x - search_half,
        location_y + subpixel_y - search_half,
    ]) * CELL_FEET
    return {
        "patchHalfWidthFeet": half_width_feet,
        "validPixelFraction": valid_fraction,
        "lidarToOrthophotoShiftFeet": shift.tolist(),
        "shiftNormFeet": float(np.linalg.norm(shift)),
        "matchResponse": float(response),
        "peakInsideSearchWindow": inside,
        "integerPeakLocation": [int(location_x), int(location_y)],
        "subpixelPeakOffsetCells": [subpixel_x, subpixel_y],
    }


def consistent_component(estimates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    eligible = [
        record
        for record in estimates
        if record["matchResponse"] >= MINIMUM_MATCH_RESPONSE
        and record["peakInsideSearchWindow"]
    ]
    best: list[dict[str, Any]] = []
    for size in range(len(eligible), MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT - 1, -1):
        for subset in itertools.combinations(eligible, size):
            shifts = np.asarray([
                record["lidarToOrthophotoShiftFeet"] for record in subset
            ])
            median = np.median(shifts, axis=0)
            envelope = float(max(CELL_FEET / 2.0, np.max(np.linalg.norm(
                shifts - median,
                axis=1,
            ))))
            if envelope > MAXIMUM_LOCALIZATION_ENVELOPE_FEET:
                continue
            component = list(subset)
            if not best or np.median([
                record["matchResponse"] for record in component
            ]) > np.median([record["matchResponse"] for record in best]):
                best = component
        if best:
            break
    return best


def build_localization(controls_path: Path, role: str, chunk_size: int) -> dict[str, Any]:
    controls, controls_sha256 = locked_json(controls_path)
    accepted_lock_states = {
        (
            "reviewed-marlins-2025-full-tile-ground-controls",
            "locked-before-full-tile-ground-localization",
        ),
        (
            "reviewed-marlins-2025-fresh-full-tile-ground-controls",
            "locked-before-fresh-full-tile-ground-localization",
        ),
    }
    lock_state = (
        controls.get("artifactKind"),
        controls.get("reviewStatus"),
    )
    if lock_state not in accepted_lock_states:
        raise ValueError("Input is not the full-tile locked ground controls")
    if controls["reviewProtocol"]["crossSensorOffsetsInspectedBeforeLock"]:
        raise ValueError("Controls were selected after offsets were inspected")
    queue_path = Path(controls["inputs"]["reviewQueue"]["path"])
    queue, queue_sha256 = locked_json(queue_path)
    if queue_sha256 != controls["inputs"]["reviewQueue"]["sha256"]:
        raise ValueError("Ground-control review queue checksum mismatch")
    mosaic_path = Path(controls["inputs"]["mosaicManifest"]["path"])
    mosaic, mosaic_sha256 = locked_json(mosaic_path)
    if mosaic_sha256 != controls["inputs"]["mosaicManifest"]["sha256"]:
        raise ValueError("Full-tile orthophoto manifest checksum mismatch")
    audit_path = Path(controls["inputs"]["orthophotoAudit"]["path"])
    audit, audit_sha256 = locked_json(audit_path)
    if audit_sha256 != controls["inputs"]["orthophotoAudit"]["sha256"]:
        raise ValueError("Orthophoto accuracy audit checksum mismatch")
    if not audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official 2025 orthophoto ground frame is not accepted")
    lidar_path = Path(controls["inputs"]["comparisonLidar"]["path"])
    if sha256_file(lidar_path) != controls["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    raster = mosaic["raster"]
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Full-tile orthophoto raster checksum mismatch")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar = build_ground_intensity(lidar_path, extent, chunk_size)
    orthophoto = build_orthophoto(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        lidar["coverageMask"],
    )
    signed_orthophoto = orthophoto["featureImage"].astype(np.float32) - 128.0
    signed_lidar = lidar["featureImage"].astype(np.float32) - 128.0
    orthophoto_gradient = np.hypot(
        cv2.Sobel(signed_orthophoto, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(signed_orthophoto, cv2.CV_32F, 0, 1, ksize=3),
    )
    lidar_gradient = np.hypot(
        cv2.Sobel(signed_lidar, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(signed_lidar, cv2.CV_32F, 0, 1, ksize=3),
    )
    selected = [record for record in controls["controls"] if record["role"] == role]
    if len(selected) < 6:
        raise ValueError(f"Role {role} has fewer than six locked controls")
    evaluations = []
    localized = []
    for control in selected:
        nominal = np.asarray(control["statePlaneFeet"], dtype=float)
        center = np.asarray([
            (nominal[0] - extent["xmin"]) / CELL_FEET,
            (nominal[1] - extent["ymin"]) / CELL_FEET,
        ])
        estimates = [
            estimate
            for half_width in PATCH_HALF_WIDTHS_FEET
            if (
                estimate := match_patch(
                    orthophoto_gradient,
                    lidar_gradient,
                    lidar["coverageMask"],
                    center,
                    half_width,
                )
            ) is not None
        ]
        component = consistent_component(estimates)
        consensus = None
        if len(component) >= MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT:
            shifts = np.asarray([
                record["lidarToOrthophotoShiftFeet"] for record in component
            ])
            median = np.median(shifts, axis=0)
            distances = np.linalg.norm(shifts - median, axis=1)
            envelope = float(max(CELL_FEET / 2.0, float(np.max(distances))))
            consensus = {
                "passes": envelope <= MAXIMUM_LOCALIZATION_ENVELOPE_FEET,
                "consistentPatchWidthCount": len(component),
                "medianLidarToOrthophotoShiftFeet": median.tolist(),
                "maximumCrossWidthDistanceFeet": float(np.max(distances)),
                "medianMatchResponse": float(np.median([
                    record["matchResponse"] for record in component
                ])),
                "localizationEnvelopeFeet": envelope,
                "lidarStatePlaneFeet": nominal.tolist(),
                "orthophotoStatePlaneFeet": (nominal + median).tolist(),
            }
            if consensus["passes"]:
                localized.append({
                    "candidateId": control["candidateId"],
                    "role": role,
                    "semanticIdentity": control["semanticIdentity"],
                    **consensus,
                })
        evaluations.append({
            "candidateId": control["candidateId"],
            "role": role,
            "semanticIdentity": control["semanticIdentity"],
            "nominalStatePlaneFeet": nominal.tolist(),
            "patchEstimates": estimates,
            "consensus": consensus,
        })
    blockers = []
    if len(localized) < 6:
        blockers.append("FEWER_THAN_SIX_CONTROLS_PASS_LOCALIZATION_GATE")
    if role == "training":
        blockers.append("REGISTRATION_MODEL_NOT_YET_SELECTED_FROM_TRAINING_ONLY")
        blockers.append("FINAL_HOLDOUTS_NOT_YET_LOCALIZED_OR_SCORED")
    else:
        blockers.append("FINAL_HOLDOUT_RESIDUALS_NOT_YET_SCORED")
    blockers.append("INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED")
    stable = {
        "controlsSha256": controls_sha256,
        "role": role,
        "method": "one-foot-masked-gradient-magnitude-normalized-correlation",
        "parameters": {
            "cellFeet": CELL_FEET,
            "patchHalfWidthsFeet": PATCH_HALF_WIDTHS_FEET,
            "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
            "minimumValidPixelFraction": MINIMUM_VALID_PIXEL_FRACTION,
            "minimumMatchResponse": MINIMUM_MATCH_RESPONSE,
            "minimumConsistentPatchWidthCount": (
                MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT
            ),
            "maximumLocalizationEnvelopeFeet": MAXIMUM_LOCALIZATION_ENVELOPE_FEET,
        },
        "localizedControls": localized,
        "evaluations": evaluations,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-full-tile-ground-localization",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "role": role,
        "inputs": {
            "controls": {
                "path": str(controls_path),
                "sha256": controls_sha256,
                "artifactVersion": controls["artifactVersion"],
            },
            "reviewQueue": controls["inputs"]["reviewQueue"],
            "orthophotoAudit": controls["inputs"]["orthophotoAudit"],
            "mosaicManifest": controls["inputs"]["mosaicManifest"],
            "comparisonLidar": controls["inputs"]["comparisonLidar"],
        },
        "predeclaredLocalizationMethod": {
            "correlation": "one-foot-masked-gradient-magnitude-normalized-correlation",
            "registrationModelSelected": False,
            "finalHoldoutOffsetsMayNotInfluenceModelSelection": True,
        },
        "parameters": stable["parameters"],
        "evaluations": evaluations,
        "localizedControls": localized,
        "assessment": {
            "lockedControlCount": len(selected),
            "localizedControlCount": len(localized),
            "localizationGatePassed": len(localized) >= 6,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": blockers,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--role", choices=("training", "final-holdout"), required=True)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()
    artifact = build_localization(arguments.controls, arguments.role, arguments.chunk_size)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "role": artifact["role"],
        "lockedControlCount": artifact["assessment"]["lockedControlCount"],
        "localizedControlCount": artifact["assessment"]["localizedControlCount"],
        "blockers": artifact["assessment"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()

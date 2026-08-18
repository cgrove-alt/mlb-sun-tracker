#!/usr/bin/env python3
"""Triangulate manually reviewed landmark pixels from a known-pose panorama pair."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any

import numpy as np

from reconstructPanoramaDenseOverhang import panorama_rays, triangulate


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def finite_pixel(value: Any) -> bool:
    return (
        isinstance(value, list)
        and len(value) == 2
        and all(isinstance(item, (int, float)) and np.isfinite(item) for item in value)
    )


def uncertainty_offsets(radius: float) -> np.ndarray:
    return np.asarray([
        [x_offset, y_offset]
        for x_offset, y_offset in itertools.product((-radius, radius), repeat=2)
    ], dtype=float)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("annotations", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--maximum-epipolar-residual", type=float, default=0.0007)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.05)
    parser.add_argument("--maximum-position-uncertainty-metres", type=float, default=0.3048)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    annotations = json.loads(args.annotations.read_text())
    if not calibration.get("assessment", {}).get("measurementEligible"):
        raise ValueError("Panorama-frame calibration is not measurement eligible")
    if annotations.get("artifactKind") != "reviewed-panorama-landmark-pixels":
        raise ValueError("Annotations are not reviewed panorama landmark pixels")
    scene_wide_stereo_passed = (
        annotations.get("review", {}).get("automatedSceneWideStereoPassed") is True
    )
    left_id = annotations.get("leftSeatId")
    right_id = annotations.get("rightSeatId")
    images = {item["seatId"]: item for item in manifest.get("images", [])}
    if left_id not in images or right_id not in images:
        raise ValueError("Annotated panorama pair is missing from the manifest")
    left_entry = images[left_id]
    right_entry = images[right_id]
    width = annotations.get("pixelCoordinateSpace", {}).get("width")
    height = annotations.get("pixelCoordinateSpace", {}).get("height")
    if not isinstance(width, int) or not isinstance(height, int) or width <= 0 or height <= 0:
        raise ValueError("Annotations must define a positive integer pixel coordinate space")
    for entry in (left_entry, right_entry):
        if entry.get("width") != width or entry.get("height") != height:
            raise ValueError("Annotation dimensions do not match both source panoramas")
        if sha256_file(Path(entry["localPath"])) != entry.get("imageSha256"):
            raise ValueError(f"Panorama hash mismatch for {entry['seatId']}")
    expected_images = annotations.get("sourceImages", {})
    if expected_images.get("leftSha256") != left_entry.get("imageSha256"):
        raise ValueError("Left annotation source hash does not match the manifest")
    if expected_images.get("rightSha256") != right_entry.get("imageSha256"):
        raise ValueError("Right annotation source hash does not match the manifest")

    landmarks = annotations.get("landmarks")
    if not isinstance(landmarks, list) or len(landmarks) < 2:
        raise ValueError("At least two reviewed landmarks are required")
    ids = [item.get("id") for item in landmarks]
    if any(not isinstance(item, str) or not item for item in ids) or len(set(ids)) != len(ids):
        raise ValueError("Landmark IDs must be nonempty and unique")
    if any(not finite_pixel(item.get("leftPixel")) or not finite_pixel(item.get("rightPixel")) for item in landmarks):
        raise ValueError("Every landmark requires finite left and right pixels")
    pixel_uncertainties = np.asarray([
        float(item.get("pixelUncertainty95", annotations.get("pixelUncertainty95", 2.0)))
        for item in landmarks
    ])
    if np.any(~np.isfinite(pixel_uncertainties)) or np.any(pixel_uncertainties <= 0):
        raise ValueError("Pixel uncertainties must be finite and positive")
    left_pixels = np.asarray([item["leftPixel"] for item in landmarks], dtype=float)
    right_pixels = np.asarray([item["rightPixel"] for item in landmarks], dtype=float)
    if (
        np.any(left_pixels[:, 0] < 0) or np.any(left_pixels[:, 0] >= width)
        or np.any(right_pixels[:, 0] < 0) or np.any(right_pixels[:, 0] >= width)
        or np.any(left_pixels[:, 1] < 0) or np.any(left_pixels[:, 1] >= height)
        or np.any(right_pixels[:, 1] < 0) or np.any(right_pixels[:, 1] >= height)
    ):
        raise ValueError("A reviewed landmark pixel is outside the panorama")

    left_rays = panorama_rays(
        left_pixels, width, height, float(left_entry["config"]["rp"][1])
    )
    right_rays = panorama_rays(
        right_pixels, width, height, float(right_entry["config"]["rp"][1])
    )
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"], dtype=float
    )
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    translation = provider_to_panorama @ (right_position - left_position)
    translation_unit = translation / np.linalg.norm(translation)
    epipolar = np.abs(np.sum(np.cross(left_rays, right_rays) * translation_unit, axis=1))
    left_depth, right_depth, separation, panorama_points = triangulate(
        left_rays, right_rays, translation
    )
    provider_points = left_position + np.einsum(
        "ij,nj->ni", panorama_to_provider, panorama_points
    )

    outputs = []
    for index, item in enumerate(landmarks):
        offsets = uncertainty_offsets(float(pixel_uncertainties[index]))
        combinations = np.asarray(list(itertools.product(offsets, offsets)), dtype=float)
        uncertain_left = left_pixels[index] + combinations[:, 0, :]
        uncertain_right = right_pixels[index] + combinations[:, 1, :]
        uncertain_left_rays = panorama_rays(
            uncertain_left, width, height, float(left_entry["config"]["rp"][1])
        )
        uncertain_right_rays = panorama_rays(
            uncertain_right, width, height, float(right_entry["config"]["rp"][1])
        )
        uncertain_left_depth, uncertain_right_depth, uncertain_separation, uncertain_points = triangulate(
            uncertain_left_rays, uncertain_right_rays, translation
        )
        uncertain_provider = left_position + np.einsum(
            "ij,nj->ni", panorama_to_provider, uncertain_points
        )
        finite = (
            np.all(np.isfinite(uncertain_provider), axis=1)
            & np.isfinite(uncertain_left_depth)
            & np.isfinite(uncertain_right_depth)
            & (uncertain_left_depth > 0)
            & (uncertain_right_depth > 0)
        )
        position_uncertainty = None
        if np.count_nonzero(finite) == combinations.shape[0]:
            position_uncertainty = float(np.max(np.linalg.norm(
                uncertain_provider - provider_points[index], axis=1
            )))
        valid = bool(
            np.all(np.isfinite(provider_points[index]))
            and left_depth[index] > 0
            and right_depth[index] > 0
            and epipolar[index] <= args.maximum_epipolar_residual
            and separation[index] <= args.maximum_ray_separation_metres
            and position_uncertainty is not None
            and position_uncertainty <= args.maximum_position_uncertainty_metres
            and np.max(uncertain_separation) <= args.maximum_ray_separation_metres
        )
        outputs.append({
            "id": item["id"],
            "semantic": item.get("semantic"),
            "split": item.get("split"),
            "leftPixel": left_pixels[index].tolist(),
            "rightPixel": right_pixels[index].tolist(),
            "pixelUncertainty95": float(pixel_uncertainties[index]),
            "providerPositionMetres": provider_points[index].tolist(),
            "leftDepthMetres": float(left_depth[index]),
            "rightDepthMetres": float(right_depth[index]),
            "epipolarResidual": float(epipolar[index]),
            "raySeparationMetres": float(separation[index]),
            "pixelBoxPositionUncertaintyMetres": position_uncertainty,
            "maximumPixelBoxRaySeparationMetres": float(np.max(uncertain_separation)),
            "measurementValid": valid,
        })

    stable = {
        "manifestSha256": sha256_file(args.manifest),
        "calibrationSha256": sha256_file(args.calibration),
        "annotationsSha256": sha256_file(args.annotations),
        "parameters": {
            "maximumEpipolarResidual": args.maximum_epipolar_residual,
            "maximumRaySeparationMetres": args.maximum_ray_separation_metres,
            "maximumPositionUncertaintyMetres": args.maximum_position_uncertainty_metres,
        },
        "landmarks": outputs,
    }
    landmark_measurements_passed = all(item["measurementValid"] for item in outputs)
    measurement_eligible = landmark_measurements_passed and scene_wide_stereo_passed
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "reviewed-known-pose-panorama-landmarks-v1",
        "artifactKind": "provider-local-reviewed-landmark-triangulation",
        "artifactVersion": f"sha256:{fingerprint(stable)}",
        "inputs": {
            "manifest": {"path": str(args.manifest), "sha256": stable["manifestSha256"]},
            "calibration": {"path": str(args.calibration), "sha256": stable["calibrationSha256"]},
            "annotations": {"path": str(args.annotations), "sha256": stable["annotationsSha256"]},
        },
        "cameraPair": {
            "leftSeatId": left_id,
            "rightSeatId": right_id,
            "baselineMetres": float(np.linalg.norm(right_position - left_position)),
        },
        "reviewEvidence": {
            "automatedSceneWideStereoPassed": scene_wide_stereo_passed,
        },
        "parameters": stable["parameters"],
        "landmarks": outputs,
        "assessment": {
            "landmarkMeasurementsPassed": landmark_measurements_passed,
            "sceneWideStereoPassed": scene_wide_stereo_passed,
            "measurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                *([] if landmark_measurements_passed else [
                    "LANDMARK_UNCERTAINTY_OR_STEREO_CONSISTENCY_THRESHOLD_NOT_PASSED"
                ]),
                *([] if scene_wide_stereo_passed else [
                    "SCENE_WIDE_STEREO_HOLDOUT_NOT_PASSED"
                ]),
                "REVIEWED_LANDMARKS_NOT_YET_REGISTERED_TO_SURVEY_CONTROL",
                "GLOBAL_SOURCE_HORIZONTAL_ACCURACY_NOT_YET_WITHIN_ONE_FOOT",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "landmarkCount": len(outputs),
        "validLandmarkCount": sum(item["measurementValid"] for item in outputs),
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

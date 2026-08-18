#!/usr/bin/env python3
"""Audit every camera-row hypothesis against fixed, predeclared visual tiers."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image
from scipy.optimize import least_squares


ANALYSIS_VERSION = "sportsdigita-camera-row-hypothesis-audit-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def cubemap_ray(face: str, pixel: np.ndarray, size: int) -> np.ndarray:
    u = (float(pixel[0]) - size / 2.0) / (size / 2.0)
    v = (float(pixel[1]) - size / 2.0) / (size / 2.0)
    by_face = {
        "f": np.asarray([u, 1.0, -v]),
        "r": np.asarray([1.0, -u, -v]),
        "b": np.asarray([-u, -1.0, -v]),
        "l": np.asarray([-1.0, u, -v]),
        "u": np.asarray([u, v, 1.0]),
        "d": np.asarray([u, -v, -1.0]),
    }
    ray = by_face[face]
    return ray / np.linalg.norm(ray)


def rotation(yaw_radians: float) -> np.ndarray:
    cosine = math.cos(yaw_radians)
    sine = math.sin(yaw_radians)
    return np.asarray([[cosine, -sine], [sine, cosine]])


def pose_values(
    parameters: np.ndarray,
    controls: list[dict[str, Any]],
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    camera = parameters[:2]
    rotate = rotation(float(parameters[2]))
    cross_track: list[float] = []
    depths: list[float] = []
    heights: list[float] = []
    for control in controls:
        horizontal = rotate @ control["ray"][:2]
        horizontal_squared = float(np.dot(horizontal, horizontal))
        delta = control["position"] - camera
        depth = float(np.dot(delta, horizontal) / horizontal_squared)
        predicted = camera + depth * horizontal
        cross_track.append(float(np.linalg.norm(control["position"] - predicted)))
        depths.append(depth)
        heights.append(depth * float(control["ray"][2]))
    return np.asarray(cross_track), np.asarray(depths), np.asarray(heights)


def fit_residuals(parameters: np.ndarray, controls: list[dict[str, Any]]) -> np.ndarray:
    camera = parameters[:2]
    rotate = rotation(float(parameters[2]))
    signed_cross_track: list[float] = []
    depths: list[float] = []
    heights: list[float] = []
    for control in controls:
        horizontal = rotate @ control["ray"][:2]
        horizontal_norm = float(np.linalg.norm(horizontal))
        delta = control["position"] - camera
        depth = float(np.dot(delta, horizontal) / np.dot(horizontal, horizontal))
        signed_cross_track.append(
            float((delta[0] * horizontal[1] - delta[1] * horizontal[0]) / horizontal_norm)
        )
        depths.append(depth)
        heights.append(depth * float(control["ray"][2]))
    height_array = np.asarray(heights)
    height_residual = height_array - float(np.median(height_array))
    negative_depth_penalty = np.minimum(np.asarray(depths), 0.0) * 10.0
    return np.concatenate(
        [np.asarray(signed_cross_track), height_residual, negative_depth_penalty]
    )


def fit_pose(
    training: list[dict[str, Any]],
    anchor_position: np.ndarray,
) -> dict[str, Any] | None:
    solutions: list[dict[str, Any]] = []
    for yaw_degrees in range(0, 360, 30):
        for offset_east in (-3.0, 0.0, 3.0):
            for offset_north in (-3.0, 0.0, 3.0):
                initial = np.asarray(
                    [
                        anchor_position[0] + offset_east,
                        anchor_position[1] + offset_north,
                        math.radians(yaw_degrees),
                    ]
                )
                fitted = least_squares(
                    fit_residuals,
                    initial,
                    args=(training,),
                    max_nfev=20_000,
                    xtol=1e-13,
                    ftol=1e-13,
                    gtol=1e-13,
                )
                cross, depths, heights = pose_values(fitted.x, training)
                if np.any(depths <= 0):
                    continue
                solutions.append(
                    {
                        "parameters": fitted.x,
                        "cost": float(np.sum(fit_residuals(fitted.x, training) ** 2)),
                        "cross": cross,
                        "heights": heights,
                    }
                )
    if not solutions:
        return None
    solutions.sort(key=lambda solution: solution["cost"])
    unique: list[dict[str, Any]] = []
    for solution in solutions:
        camera = solution["parameters"][:2]
        yaw = math.degrees(float(solution["parameters"][2])) % 360.0
        duplicate = False
        for prior in unique:
            prior_camera = prior["parameters"][:2]
            prior_yaw = math.degrees(float(prior["parameters"][2])) % 360.0
            yaw_difference = abs((yaw - prior_yaw + 180.0) % 360.0 - 180.0)
            if np.linalg.norm(camera - prior_camera) < 0.05 and yaw_difference < 0.1:
                duplicate = True
                break
        if not duplicate:
            unique.append(solution)
    return {"best": unique[0], "unique": unique}


def score_tier_row(
    tier: dict[str, Any],
    row_positions: dict[str, np.ndarray],
    camera: np.ndarray,
    rotate: np.ndarray,
) -> dict[str, Any] | None:
    if any(control["seatLabel"] not in row_positions for control in tier["controls"]):
        return None
    residuals: list[float] = []
    heights: list[float] = []
    depths: list[float] = []
    records: list[dict[str, Any]] = []
    for control in tier["controls"]:
        ray = control["ray"]
        horizontal = rotate @ ray[:2]
        horizontal_norm = float(np.linalg.norm(horizontal))
        delta = row_positions[control["seatLabel"]] - camera
        depth = float(np.dot(delta, horizontal) / np.dot(horizontal, horizontal))
        if depth <= 0:
            return None
        signed = float(
            (delta[0] * horizontal[1] - delta[1] * horizontal[0]) / horizontal_norm
        )
        height = depth * float(ray[2])
        residuals.append(abs(signed))
        heights.append(height)
        depths.append(depth)
        records.append(
            {
                "candidateId": control["candidateId"],
                "seatLabel": control["seatLabel"],
                "depthFeet": round(depth, 6),
                "horizontalCrossTrackResidualFeet": round(abs(signed), 6),
                "impliedBadgeHeightRelativeToCameraFeet": round(height, 6),
            }
        )
    residual_array = np.asarray(residuals)
    height_array = np.asarray(heights)
    median_height = float(np.median(height_array))
    vertical_residual = np.abs(height_array - median_height)
    score = float(np.sum(residual_array**2) + np.sum(vertical_residual**2))
    return {
        "jointSquaredErrorFeet2": score,
        "horizontalP95Feet": float(np.percentile(residual_array, 95)),
        "horizontalMaximumFeet": float(np.max(residual_array)),
        "impliedBadgeHeightRelativeToCameraFeet": median_height,
        "withinTierHeightSpreadFeet": float(np.max(height_array) - np.min(height_array)),
        "controls": records,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("camera_controls", type=Path)
    parser.add_argument("visual_tiers", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", default="207")
    parser.add_argument("--anchor-seat", default="14")
    parser.add_argument("--top-hypotheses", type=int, default=17)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    controls_bytes = arguments.camera_controls.read_bytes()
    tiers_bytes = arguments.visual_tiers.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    camera_review = json.loads(controls_bytes)
    tier_review = json.loads(tiers_bytes)
    if camera_review.get("analysisVersion") != "reviewed-sportsdigita-cubemap-seat-controls-v1":
        raise ValueError("Camera controls use an unsupported analysis version")
    if tier_review.get("analysisVersion") != "reviewed-sportsdigita-visual-seat-tiers-v1":
        raise ValueError("Visual tiers use an unsupported analysis version")
    if camera_review["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Row SHA-256 does not match the camera controls")
    if camera_review["inputs"]["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the camera controls")
    candidate_path = Path(tier_review["inputs"]["candidateManifestPath"])
    if sha256_file(candidate_path) != tier_review["inputs"]["candidateManifestSha256"]:
        raise ValueError("Visual-tier candidate manifest checksum mismatch")

    source_section = next(
        record for record in panorama["sections"] if str(record["sectionId"]) == arguments.section
    )
    images = {record["face"]: record for record in source_section["images"]}
    sizes: dict[str, int] = {}
    for face, record in images.items():
        path = Path(record["localPath"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        with Image.open(path) as image:
            if image.width != image.height:
                raise ValueError("Cube face must be square")
            sizes[face] = image.width

    section_rows: dict[str, dict[str, np.ndarray]] = {}
    for row in rows_artifact["geometryRows"]:
        if str(row["sectionId"]) != arguments.section:
            continue
        section_rows[row["rowKey"]] = {
            str(seat["seatLabel"]): np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float)
            for seat in row["seats"]
        }
    raw_training = [control for control in camera_review["controls"] if control["partition"] == "training"]
    raw_holdout = [control for control in camera_review["controls"] if control["partition"] == "holdout"]
    visual_tiers: list[dict[str, Any]] = []
    for tier in tier_review["tiers"]:
        face = str(tier["face"])
        visual_tiers.append(
            {
                "tierId": tier["tierId"],
                "controls": [
                    {
                        **control,
                        "seatLabel": str(control["seatLabel"]),
                        "ray": cubemap_ray(face, np.asarray(control["pixel"]), sizes[face]),
                    }
                    for control in tier["controls"]
                ],
            }
        )

    hypotheses: list[dict[str, Any]] = []
    for camera_row_key, camera_row_positions in section_rows.items():
        required_labels = {
            str(control["seatLabel"]) for control in raw_training + raw_holdout
        } | {str(arguments.anchor_seat)}
        if not required_labels.issubset(camera_row_positions):
            continue
        training = [
            {
                **control,
                "position": camera_row_positions[str(control["seatLabel"])],
                "ray": cubemap_ray(
                    str(control["face"]),
                    np.asarray(control["pixel"]),
                    sizes[str(control["face"])],
                ),
            }
            for control in raw_training
        ]
        fitted = fit_pose(training, camera_row_positions[str(arguments.anchor_seat)])
        if fitted is None:
            continue
        best = fitted["best"]
        parameters = best["parameters"]
        camera = parameters[:2]
        yaw_degrees = math.degrees(float(parameters[2])) % 360.0
        rotate = rotation(float(parameters[2]))
        _, _, training_heights = pose_values(parameters, training)
        camera_row_badge_height = float(np.median(training_heights))

        holdout = [
            {
                **control,
                "position": camera_row_positions[str(control["seatLabel"])],
                "ray": cubemap_ray(
                    str(control["face"]),
                    np.asarray(control["pixel"]),
                    sizes[str(control["face"])],
                ),
            }
            for control in raw_holdout
        ]
        holdout_cross, holdout_depths, holdout_heights = pose_values(parameters, holdout)
        if np.any(holdout_depths <= 0):
            continue
        holdout_vertical = np.abs(holdout_heights - camera_row_badge_height)
        holdout_score = float(np.sum(holdout_cross**2) + np.sum(holdout_vertical**2))

        tier_matches: list[list[dict[str, Any]]] = []
        for tier in visual_tiers:
            matches: list[dict[str, Any]] = []
            for row_key, row_positions in section_rows.items():
                scored = score_tier_row(tier, row_positions, camera, rotate)
                if scored is None:
                    continue
                matches.append({"rowKey": row_key, **scored})
            matches.sort(key=lambda match: match["jointSquaredErrorFeet2"])
            tier_matches.append(matches)

        combinations: list[dict[str, Any]] = []
        for selected in itertools.product(*tier_matches):
            row_keys = [match["rowKey"] for match in selected]
            if len(set(row_keys)) != len(row_keys):
                continue
            row_height_pairs = [
                (
                    int(camera_row_key.split(":", 1)[1]),
                    camera_row_badge_height,
                )
            ] + [
                (
                    int(match["rowKey"].split(":", 1)[1]),
                    float(match["impliedBadgeHeightRelativeToCameraFeet"]),
                )
                for match in selected
            ]
            monotonic = True
            ordered = sorted(row_height_pairs)
            for (first_row, first_height), (second_row, second_height) in zip(ordered, ordered[1:]):
                if second_row == first_row:
                    if abs(second_height - first_height) > 1.0:
                        monotonic = False
                        break
                elif second_height <= first_height:
                    monotonic = False
                    break
            if not monotonic:
                continue
            tier_score = float(sum(match["jointSquaredErrorFeet2"] for match in selected))
            combinations.append(
                {
                    "scoreFeet2": tier_score + holdout_score,
                    "tierScoreFeet2": tier_score,
                    "holdoutScoreFeet2": holdout_score,
                    "assignments": [
                        {
                            "tierId": tier["tierId"],
                            **match,
                        }
                        for tier, match in zip(visual_tiers, selected)
                    ],
                }
            )
        combinations.sort(key=lambda combination: combination["scoreFeet2"])
        if not combinations:
            continue
        hypotheses.append(
            {
                "cameraRowKey": camera_row_key,
                "cameraPoseProviderLocal": {
                    "eastNorthFeetFromInputCenter": [
                        round(float(camera[0]), 9),
                        round(float(camera[1]), 9),
                    ],
                    "yawDegrees": round(yaw_degrees, 9),
                    "cameraRowBadgeHeightRelativeToCameraFeet": round(camera_row_badge_height, 9),
                    "distanceFromSeatAnchorFeet": round(
                        float(np.linalg.norm(camera - camera_row_positions[str(arguments.anchor_seat)])),
                        9,
                    ),
                },
                "trainingCostFeet2": round(float(best["cost"]), 12),
                "holdout": {
                    "controlCount": len(holdout),
                    "horizontalP95Feet": round(float(np.percentile(holdout_cross, 95)), 9),
                    "verticalP95Feet": round(float(np.percentile(holdout_vertical, 95)), 9),
                    "scoreFeet2": round(holdout_score, 9),
                },
                "bestOrderedTierCombination": {
                    **combinations[0],
                    "scoreFeet2": round(combinations[0]["scoreFeet2"], 9),
                    "tierScoreFeet2": round(combinations[0]["tierScoreFeet2"], 9),
                    "holdoutScoreFeet2": round(combinations[0]["holdoutScoreFeet2"], 9),
                },
                "secondOrderedTierCombinationScoreFeet2": (
                    None if len(combinations) < 2 else round(combinations[1]["scoreFeet2"], 9)
                ),
            }
        )
    hypotheses.sort(
        key=lambda hypothesis: hypothesis["bestOrderedTierCombination"]["scoreFeet2"]
    )
    best_score = (
        None
        if not hypotheses
        else float(hypotheses[0]["bestOrderedTierCombination"]["scoreFeet2"])
    )
    for hypothesis in hypotheses:
        score = float(hypothesis["bestOrderedTierCombination"]["scoreFeet2"])
        hypothesis["scoreAboveBestFeet2"] = (
            None if best_score is None else round(score - best_score, 9)
        )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "rowsArtifactVersion": rows_artifact.get("artifactVersion"),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama.get("artifactVersion"),
            "cameraControlsPath": str(arguments.camera_controls),
            "cameraControlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
            "visualTiersPath": str(arguments.visual_tiers),
            "visualTiersSha256": hashlib.sha256(tiers_bytes).hexdigest(),
        },
        "sectionId": str(arguments.section),
        "hypothesisPolicy": {
            "cameraRowsEnumerated": True,
            "poseFitInputs": "two down-face training controls only",
            "holdoutRefitsPose": False,
            "visualTiersRefitPose": False,
            "visualTierAssignmentsRequireUniqueRows": True,
            "rowBadgeHeightsMustIncreaseWithProviderRowNumber": True,
            "automaticCameraRowAcceptance": False,
        },
        "hypothesisCount": len(hypotheses),
        "hypotheses": hypotheses[: arguments.top_hypotheses],
        "cameraRowIdentityStatus": "unresolved",
        "publicationEligible": False,
        "blockers": [
            "CAMERA_ROW_HYPOTHESES_REQUIRE_SEPARATION_REVIEW",
            "VISUAL_TIER_ROW_ASSIGNMENTS_NOT_ACCEPTED",
            "DISJOINT_GROUPED_ROW_HOLDOUTS_NOT_PASSED",
            "ROW_COVERAGE_INCOMPLETE",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "camera-row-hypothesis-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "hypothesisCount": len(hypotheses),
                "topHypotheses": [
                    {
                        "cameraRowKey": hypothesis["cameraRowKey"],
                        "scoreFeet2": hypothesis["bestOrderedTierCombination"]["scoreFeet2"],
                        "scoreAboveBestFeet2": hypothesis["scoreAboveBestFeet2"],
                        "tierRows": [
                            assignment["rowKey"]
                            for assignment in hypothesis["bestOrderedTierCombination"]["assignments"]
                        ],
                    }
                    for hypothesis in hypotheses[:5]
                ],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

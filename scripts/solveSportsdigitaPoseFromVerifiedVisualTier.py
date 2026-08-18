#!/usr/bin/env python3
"""Solve camera pose from one verified visual tier and score unused tiers."""

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


ANALYSIS_VERSION = "sportsdigita-verified-tier-camera-pose-v3"


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


def values(
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


def residuals(parameters: np.ndarray, controls: list[dict[str, Any]]) -> np.ndarray:
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


def circular_difference_degrees(first: float, second: float) -> float:
    return abs((first - second + 180.0) % 360.0 - 180.0)


def unique_solutions(solutions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    unique: list[dict[str, Any]] = []
    for solution in sorted(solutions, key=lambda item: item["trainingCostFeet2"]):
        camera = solution["parameters"][:2]
        yaw = math.degrees(float(solution["parameters"][2])) % 360.0
        if any(
            np.linalg.norm(camera - prior["parameters"][:2]) < 0.05
            and circular_difference_degrees(
                yaw,
                math.degrees(float(prior["parameters"][2])) % 360.0,
            ) < 0.1
            for prior in unique
        ):
            continue
        unique.append(solution)
    return unique


def score_tier(
    tier: dict[str, Any],
    row_key: str,
    row_positions: dict[str, np.ndarray],
    camera: np.ndarray,
    rotate: np.ndarray,
) -> dict[str, Any] | None:
    if any(control["seatLabel"] not in row_positions for control in tier["controls"]):
        return None
    horizontal_residuals: list[float] = []
    heights: list[float] = []
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
        horizontal_residuals.append(abs(signed))
        heights.append(height)
        records.append(
            {
                "candidateId": control["candidateId"],
                "seatLabel": control["seatLabel"],
                "depthFeet": round(depth, 6),
                "horizontalCrossTrackResidualFeet": round(abs(signed), 6),
                "impliedBadgeHeightRelativeToCameraFeet": round(height, 6),
            }
        )
    horizontal = np.asarray(horizontal_residuals)
    height_array = np.asarray(heights)
    median_height = float(np.median(height_array))
    vertical = np.abs(height_array - median_height)
    return {
        "tierId": tier["tierId"],
        "rowKey": row_key,
        "jointSquaredErrorFeet2": float(np.sum(horizontal**2) + np.sum(vertical**2)),
        "horizontalP95Feet": float(np.percentile(horizontal, 95)),
        "horizontalMaximumFeet": float(np.max(horizontal)),
        "relativeBadgeHeightFeet": median_height,
        "verticalP95Feet": float(np.percentile(vertical, 95)),
        "heightSpreadFeet": float(np.max(height_array) - np.min(height_array)),
        "controls": records,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("visual_tiers", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", default="207")
    parser.add_argument("--training-tier-id", required=True)
    parser.add_argument("--maximum-camera-to-seat-feet", type=float, default=25.0)
    parser.add_argument("--maximum-unique-poses-per-row", type=int, default=20)
    parser.add_argument("--top-solutions", type=int, default=30)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    tiers_bytes = arguments.visual_tiers.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    reviewed = json.loads(tiers_bytes)
    if reviewed.get("analysisVersion") != "reviewed-sportsdigita-visual-seat-tiers-v1":
        raise ValueError("Visual tiers use an unsupported analysis version")
    if reviewed["inputs"].get("panoramaManifestSha256") != hashlib.sha256(
        panorama_bytes
    ).hexdigest():
        raise ValueError("Visual-tier panorama manifest checksum mismatch")
    reviewed_source_path = Path(reviewed["inputs"]["sourcePath"])
    if sha256_file(reviewed_source_path) != reviewed["inputs"]["sourceSha256"]:
        raise ValueError("Visual-tier source image checksum mismatch")
    candidate_path = Path(reviewed["inputs"]["candidateManifestPath"])
    if sha256_file(candidate_path) != reviewed["inputs"]["candidateManifestSha256"]:
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
    all_seats: list[tuple[str, str, np.ndarray]] = []
    for row in rows_artifact["geometryRows"]:
        if str(row["sectionId"]) != arguments.section:
            continue
        row_positions = {
            str(seat["seatLabel"]): np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float)
            for seat in row["seats"]
        }
        section_rows[row["rowKey"]] = row_positions
        all_seats.extend(
            (row["rowKey"], seat_label, position)
            for seat_label, position in row_positions.items()
        )
    prepared_tiers: list[dict[str, Any]] = []
    for tier in reviewed["tiers"]:
        face = str(tier["face"])
        if face not in images:
            raise ValueError(f"Panorama has no {face} face")
        if tier["sourceImageSha256"] != images[face]["sha256"]:
            raise ValueError(f"Visual-tier source checksum mismatch: {tier['tierId']}")
        prepared_tiers.append(
            {
                "tierId": tier["tierId"],
                "partition": tier.get("partition", "unspecified"),
                "face": face,
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
    training_tier = next(
        tier for tier in prepared_tiers if tier["tierId"] == arguments.training_tier_id
    )
    if training_tier["partition"] != "training":
        raise ValueError("The selected training tier is not partitioned as training")
    holdout_tiers = [
        tier for tier in prepared_tiers if tier["partition"] == "prefit-holdout"
    ]
    postfit_validation_tiers = [
        tier for tier in prepared_tiers if tier["partition"] == "postfit-validation"
    ]
    if len(holdout_tiers) < 2:
        raise ValueError("At least two prefit holdout tiers are required")
    initial_anchors = [
        np.median(np.stack(list(row.values())), axis=0)
        for row in section_rows.values()
    ]
    home = np.asarray(
        [
            rows_artifact["transform"]["homePlateEastFeetFromInputCenter"],
            rows_artifact["transform"]["homePlateNorthFeetFromInputCenter"],
        ],
        dtype=float,
    )

    candidate_solutions: list[dict[str, Any]] = []
    for training_row_key, training_row_positions in section_rows.items():
        if any(
            control["seatLabel"] not in training_row_positions
            for control in training_tier["controls"]
        ):
            continue
        training_controls = [
            {
                **control,
                "position": training_row_positions[control["seatLabel"]],
            }
            for control in training_tier["controls"]
        ]
        fitted_solutions: list[dict[str, Any]] = []
        for anchor in initial_anchors:
            for yaw_degrees in range(0, 360, 30):
                initial = np.asarray([anchor[0], anchor[1], math.radians(yaw_degrees)])
                fitted = least_squares(
                    residuals,
                    initial,
                    args=(training_controls,),
                    max_nfev=20_000,
                    xtol=1e-12,
                    ftol=1e-12,
                    gtol=1e-12,
                )
                cross, depths, heights = values(fitted.x, training_controls)
                if np.any(depths <= 0):
                    continue
                camera = fitted.x[:2]
                nearest_distance = min(
                    float(np.linalg.norm(camera - position))
                    for _, _, position in all_seats
                )
                if nearest_distance > arguments.maximum_camera_to_seat_feet:
                    continue
                fitted_solutions.append(
                    {
                        "parameters": fitted.x,
                        "trainingCostFeet2": float(
                            np.sum(residuals(fitted.x, training_controls) ** 2)
                        ),
                        "trainingCross": cross,
                        "trainingHeights": heights,
                        "nearestSeatDistanceFeet": nearest_distance,
                    }
                )
        for pose in unique_solutions(fitted_solutions)[: arguments.maximum_unique_poses_per_row]:
            camera = pose["parameters"][:2]
            yaw_radians = float(pose["parameters"][2])
            rotate = rotation(yaw_radians)
            training_height = float(np.median(pose["trainingHeights"]))
            holdout_matches: list[list[dict[str, Any]]] = []
            for tier in holdout_tiers:
                tier_options: list[dict[str, Any]] = []
                for row_key, row_positions in section_rows.items():
                    scored = score_tier(tier, row_key, row_positions, camera, rotate)
                    if scored is not None:
                        tier_options.append(scored)
                tier_options.sort(key=lambda score: score["jointSquaredErrorFeet2"])
                holdout_matches.append(tier_options)
            for assignments in itertools.product(*holdout_matches):
                assigned_rows = [training_row_key] + [assignment["rowKey"] for assignment in assignments]
                if len(set(assigned_rows)) != len(assigned_rows):
                    continue
                row_height_pairs = [
                    (int(training_row_key.split(":", 1)[1]), training_height)
                ] + [
                    (
                        int(assignment["rowKey"].split(":", 1)[1]),
                        float(assignment["relativeBadgeHeightFeet"]),
                    )
                    for assignment in assignments
                ]
                ordered = sorted(row_height_pairs)
                if any(
                    second_height <= first_height
                    for (_, first_height), (_, second_height) in zip(ordered, ordered[1:])
                ):
                    continue
                holdout_score = float(
                    sum(assignment["jointSquaredErrorFeet2"] for assignment in assignments)
                )
                total_score = float(pose["trainingCostFeet2"] + holdout_score)
                nearest_row, nearest_label, nearest_position = min(
                    all_seats,
                    key=lambda item: float(np.linalg.norm(camera - item[2])),
                )
                local_left_world = rotate @ np.asarray([-1.0, 0.0])
                vector_to_home = home - camera
                home_angle = math.degrees(math.atan2(vector_to_home[1], vector_to_home[0]))
                left_angle = math.degrees(math.atan2(local_left_world[1], local_left_world[0]))
                candidate_solutions.append(
                    {
                        "totalScoreFeet2": total_score,
                        "trainingCostFeet2": pose["trainingCostFeet2"],
                        "holdoutScoreFeet2": holdout_score,
                        "trainingTierId": training_tier["tierId"],
                        "trainingRowKey": training_row_key,
                        "trainingBadgeHeightRelativeToCameraFeet": training_height,
                        "camera": camera,
                        "yawDegrees": math.degrees(yaw_radians) % 360.0,
                        "nearestProviderSeat": {
                            "rowKey": nearest_row,
                            "seatLabel": nearest_label,
                            "distanceFeet": float(np.linalg.norm(camera - nearest_position)),
                        },
                        "leftFaceToHomeDirectionDifferenceDegrees": circular_difference_degrees(
                            left_angle,
                            home_angle,
                        ),
                        "trainingHorizontalP95Feet": float(
                            np.percentile(pose["trainingCross"], 95)
                        ),
                        "trainingHeightSpreadFeet": float(
                            np.max(pose["trainingHeights"]) - np.min(pose["trainingHeights"])
                        ),
                        "holdoutAssignments": assignments,
                    }
                )
    candidate_solutions.sort(
        key=lambda solution: (
            solution["totalScoreFeet2"],
            solution["leftFaceToHomeDirectionDifferenceDegrees"],
            solution["nearestProviderSeat"]["distanceFeet"],
        )
    )
    output_solutions: list[dict[str, Any]] = []
    for solution in candidate_solutions[: arguments.top_solutions]:
        camera = solution["camera"]
        rotate = rotation(math.radians(float(solution["yawDegrees"])))
        postfit_diagnostics: list[dict[str, Any]] = []
        for tier in postfit_validation_tiers:
            candidate_rows = [
                scored
                for row_key, row_positions in section_rows.items()
                if (
                    scored := score_tier(
                        tier,
                        row_key,
                        row_positions,
                        camera,
                        rotate,
                    )
                )
                is not None
            ]
            candidate_rows.sort(key=lambda score: score["jointSquaredErrorFeet2"])
            postfit_diagnostics.append(
                {
                    "tierId": tier["tierId"],
                    "useRestriction": (
                        "Selected after the initial fit. Diagnostic only and excluded "
                        "from pose fit, pose ranking, and independent holdout claims."
                    ),
                    "candidateRowsByGeometricError": [
                        {
                            **score,
                            "jointSquaredErrorFeet2": round(
                                float(score["jointSquaredErrorFeet2"]), 9
                            ),
                            "horizontalP95Feet": round(
                                float(score["horizontalP95Feet"]), 9
                            ),
                            "horizontalMaximumFeet": round(
                                float(score["horizontalMaximumFeet"]), 9
                            ),
                            "relativeBadgeHeightFeet": round(
                                float(score["relativeBadgeHeightFeet"]), 9
                            ),
                            "verticalP95Feet": round(
                                float(score["verticalP95Feet"]), 9
                            ),
                            "heightSpreadFeet": round(
                                float(score["heightSpreadFeet"]), 9
                            ),
                        }
                        for score in candidate_rows
                    ],
                }
            )
        output_solutions.append(
            {
                "totalScoreFeet2": round(float(solution["totalScoreFeet2"]), 9),
                "trainingCostFeet2": round(float(solution["trainingCostFeet2"]), 9),
                "holdoutScoreFeet2": round(float(solution["holdoutScoreFeet2"]), 9),
                "trainingTierId": solution["trainingTierId"],
                "trainingRowKey": solution["trainingRowKey"],
                "trainingBadgeHeightRelativeToCameraFeet": round(
                    float(solution["trainingBadgeHeightRelativeToCameraFeet"]), 9
                ),
                "cameraPoseProviderLocal": {
                    "eastNorthFeetFromInputCenter": [
                        round(float(solution["camera"][0]), 9),
                        round(float(solution["camera"][1]), 9),
                    ],
                    "yawDegrees": round(float(solution["yawDegrees"]), 9),
                    "nearestProviderSeat": {
                        **solution["nearestProviderSeat"],
                        "distanceFeet": round(
                            float(solution["nearestProviderSeat"]["distanceFeet"]),
                            9,
                        ),
                    },
                    "leftFaceToHomeDirectionDifferenceDegrees": round(
                        float(solution["leftFaceToHomeDirectionDifferenceDegrees"]),
                        9,
                    ),
                },
                "trainingHorizontalP95Feet": round(
                    float(solution["trainingHorizontalP95Feet"]), 9
                ),
                "trainingHeightSpreadFeet": round(
                    float(solution["trainingHeightSpreadFeet"]), 9
                ),
                "holdoutAssignments": [
                    {
                        **assignment,
                        "jointSquaredErrorFeet2": round(
                            float(assignment["jointSquaredErrorFeet2"]),
                            9,
                        ),
                        "horizontalP95Feet": round(float(assignment["horizontalP95Feet"]), 9),
                        "horizontalMaximumFeet": round(
                            float(assignment["horizontalMaximumFeet"]),
                            9,
                        ),
                        "relativeBadgeHeightFeet": round(
                            float(assignment["relativeBadgeHeightFeet"]),
                            9,
                        ),
                        "verticalP95Feet": round(float(assignment["verticalP95Feet"]), 9),
                        "heightSpreadFeet": round(float(assignment["heightSpreadFeet"]), 9),
                    }
                    for assignment in solution["holdoutAssignments"]
                ],
                "postfitValidationDiagnostics": postfit_diagnostics,
            }
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
            "reviewedTiersPath": str(arguments.visual_tiers),
            "reviewedTiersSha256": hashlib.sha256(tiers_bytes).hexdigest(),
        },
        "sectionId": str(arguments.section),
        "fitPolicy": {
            "trainingTierId": arguments.training_tier_id,
            "trainingTierProviderRowEnumerated": True,
            "holdoutTiersRefitPose": False,
            "holdoutRowsEnumerated": True,
            "distinctProviderRowsRequired": True,
            "rowBadgeHeightsMustIncreaseWithProviderRowNumber": True,
            "maximumCameraToAnyProviderSeatFeet": arguments.maximum_camera_to_seat_feet,
            "leftFaceFieldDirectionUsedForRankingOnly": True,
            "automaticPoseAcceptance": False,
            "postfitValidationTiersExcludedFromFitAndRanking": True,
        },
        "candidateSolutionCount": len(candidate_solutions),
        "solutions": output_solutions,
        "publicationEligible": False,
        "blockers": [
            "POSE_SOLUTIONS_REQUIRE_SEPARATION_AND_IMAGE-ORIENTATION_REVIEW",
            "ONLY_TWO_PREFIT_UNUSED_VISUAL_TIERS",
            "POSTFIT_VALIDATION_TIER_NOT_INDEPENDENT",
            "ROW_COVERAGE_INCOMPLETE",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "verified-tier-camera-pose",
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
                "candidateSolutionCount": len(candidate_solutions),
                "topSolutions": [
                    {
                        "trainingRowKey": solution["trainingRowKey"],
                        "totalScoreFeet2": solution["totalScoreFeet2"],
                        "yawDegrees": solution["cameraPoseProviderLocal"]["yawDegrees"],
                        "nearestProviderSeat": solution["cameraPoseProviderLocal"]["nearestProviderSeat"],
                        "holdoutRows": [
                            assignment["rowKey"]
                            for assignment in solution["holdoutAssignments"]
                        ],
                    }
                    for solution in output_solutions[:5]
                ],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

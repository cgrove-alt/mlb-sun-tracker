#!/usr/bin/env python3
"""Match reviewed same-tier seat badges to provider rows with a fixed pose."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image


ANALYSIS_VERSION = "sportsdigita-visual-tier-provider-row-matching-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_csv(value: str) -> set[str]:
    return {part.strip() for part in value.split(",") if part.strip()}


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


def percentile(values: np.ndarray, quantile: float) -> float:
    return float(np.percentile(values, quantile))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("solution", type=Path)
    parser.add_argument("tiers", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--provider-sections", default="207")
    parser.add_argument("--top-row-matches", type=int, default=10)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    solution_bytes = arguments.solution.read_bytes()
    tiers_bytes = arguments.tiers.read_bytes()
    rows_artifact = json.loads(rows_bytes)
    panorama = json.loads(panorama_bytes)
    solution = json.loads(solution_bytes)
    reviewed = json.loads(tiers_bytes)
    if solution.get("analysisVersion") != "sportsdigita-cubemap-provider-row-bundle-v1":
        raise ValueError("Solution uses an unsupported analysis version")
    if reviewed.get("analysisVersion") != "reviewed-sportsdigita-visual-seat-tiers-v1":
        raise ValueError("Tier controls use an unsupported analysis version")
    if solution["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Row SHA-256 does not match the fixed solution")
    if solution["inputs"]["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the fixed solution")
    if reviewed["inputs"].get("panoramaManifestSha256") != hashlib.sha256(
        panorama_bytes
    ).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the reviewed tiers")
    reviewed_source_path = Path(reviewed["inputs"]["sourcePath"])
    if sha256_file(reviewed_source_path) != reviewed["inputs"]["sourceSha256"]:
        raise ValueError("Reviewed-tier source image checksum mismatch")
    candidate_path = Path(reviewed["inputs"]["candidateManifestPath"])
    if sha256_file(candidate_path) != reviewed["inputs"]["candidateManifestSha256"]:
        raise ValueError("Candidate manifest SHA-256 does not match the reviewed tiers")

    camera_section = str(reviewed["cameraSectionId"])
    source_section = next(
        record for record in panorama["sections"] if str(record["sectionId"]) == camera_section
    )
    images = {record["face"]: record for record in source_section["images"]}
    image_sizes: dict[str, int] = {}
    for face, record in images.items():
        path = Path(record["localPath"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        with Image.open(path) as image:
            if image.width != image.height:
                raise ValueError("Cube face must be square")
            image_sizes[face] = image.width

    provider_sections = parse_csv(arguments.provider_sections)
    provider_rows: dict[str, dict[str, np.ndarray]] = {}
    for row in rows_artifact["geometryRows"]:
        if str(row["sectionId"]) not in provider_sections:
            continue
        provider_rows[row["rowKey"]] = {
            str(seat["seatLabel"]): np.asarray(seat["eastNorthFeetFromInputCenter"], dtype=float)
            for seat in row["seats"]
        }
    if not provider_rows:
        raise ValueError("No provider rows were selected")

    camera_record = solution["cameraPoseProviderLocal"]
    camera = np.asarray(camera_record["eastNorthFeetFromInputCenter"], dtype=float)
    rotate = rotation(math.radians(float(camera_record["yawDegrees"])))
    tier_results: list[dict[str, Any]] = []
    for tier in reviewed["tiers"]:
        face = str(tier["face"])
        source = images.get(face)
        if source is None:
            raise ValueError(f"Panorama has no {face} face")
        if tier["sourceImageSha256"] != source["sha256"]:
            raise ValueError(f"Tier source checksum mismatch: {tier['tierId']}")
        controls: list[dict[str, Any]] = []
        for control in tier["controls"]:
            pixel = np.asarray(control["pixel"], dtype=float)
            controls.append(
                {
                    **control,
                    "seatLabel": str(control["seatLabel"]),
                    "ray": cubemap_ray(face, pixel, image_sizes[face]),
                }
            )
        matches: list[dict[str, Any]] = []
        for row_key, seats in provider_rows.items():
            if any(control["seatLabel"] not in seats for control in controls):
                continue
            residuals: list[float] = []
            signed_residuals: list[float] = []
            depths: list[float] = []
            heights: list[float] = []
            control_scores: list[dict[str, Any]] = []
            for control in controls:
                ray = control["ray"]
                horizontal = rotate @ ray[:2]
                horizontal_norm = float(np.linalg.norm(horizontal))
                position = seats[control["seatLabel"]]
                delta = position - camera
                depth = float(np.dot(delta, horizontal) / np.dot(horizontal, horizontal))
                signed = float(
                    (delta[0] * horizontal[1] - delta[1] * horizontal[0]) / horizontal_norm
                )
                height = depth * float(ray[2])
                residuals.append(abs(signed))
                signed_residuals.append(signed)
                depths.append(depth)
                heights.append(height)
                control_scores.append(
                    {
                        "candidateId": control["candidateId"],
                        "seatLabel": control["seatLabel"],
                        "pixel": control["pixel"],
                        "depthFeet": round(depth, 6),
                        "horizontalCrossTrackSignedFeet": round(signed, 6),
                        "horizontalCrossTrackResidualFeet": round(abs(signed), 6),
                        "impliedBadgeHeightRelativeToCameraFeet": round(height, 6),
                    }
                )
            if any(depth <= 0 for depth in depths):
                continue
            residual_array = np.asarray(residuals, dtype=float)
            height_array = np.asarray(heights, dtype=float)
            median_height = float(np.median(height_array))
            height_residuals = np.abs(height_array - median_height)
            joint_squared_error = float(
                np.sum(residual_array**2) + np.sum(height_residuals**2)
            )
            matches.append(
                {
                    "rowKey": row_key,
                    "controlCount": len(controls),
                    "jointSquaredErrorFeet2": round(joint_squared_error, 9),
                    "horizontalCrossTrackResidualFeet": {
                        "median": round(percentile(residual_array, 50), 6),
                        "p95": round(percentile(residual_array, 95), 6),
                        "maximum": round(float(np.max(residual_array)), 6),
                    },
                    "impliedBadgeHeightRelativeToCameraFeet": round(median_height, 6),
                    "withinTierHeightSpreadFeet": round(float(np.max(height_array) - np.min(height_array)), 6),
                    "withinTierVerticalResidualP95Feet": round(percentile(height_residuals, 95), 6),
                    "controls": control_scores,
                }
            )
        matches.sort(
            key=lambda match: (
                match["jointSquaredErrorFeet2"],
                match["horizontalCrossTrackResidualFeet"]["p95"],
                match["withinTierHeightSpreadFeet"],
            )
        )
        tier_results.append(
            {
                "tierId": tier["tierId"],
                "face": face,
                "controlCount": len(controls),
                "candidateProviderRowCount": len(matches),
                "topProviderRowMatches": matches[: arguments.top_row_matches],
                "assignmentStatus": "unassigned",
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
            "fixedSolutionPath": str(arguments.solution),
            "fixedSolutionSha256": hashlib.sha256(solution_bytes).hexdigest(),
            "fixedSolutionArtifactVersion": solution["artifactVersion"],
            "reviewedTiersPath": str(arguments.tiers),
            "reviewedTiersSha256": hashlib.sha256(tiers_bytes).hexdigest(),
        },
        "cameraSectionId": camera_section,
        "providerSections": sorted(provider_sections),
        "fixedCameraPose": camera_record,
        "matchingPolicy": {
            "cameraPoseRefit": False,
            "rowIdentityAssignedAutomatically": False,
            "scoreComponents": [
                "horizontal cross-track residual for every printed seat label",
                "within-tier implied badge-height residual",
            ],
            "requiresPositiveDepth": True,
        },
        "tiers": tier_results,
        "publicationEligible": False,
        "blockers": [
            "TOP_ROW_MATCHES_REQUIRE_ORDERED_MULTI-TIER_REVIEW",
            "ROW_IDENTITIES_NOT_ASSIGNED",
            "DISJOINT_GROUPED_ROW_HOLDOUTS_NOT_PASSED",
            "ROW_COVERAGE_INCOMPLETE",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "visual-tier-provider-row-matching",
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
                "tierCount": len(tier_results),
                "topRowMatches": [
                    {
                        "tierId": tier["tierId"],
                        "rowKey": (
                            None
                            if not tier["topProviderRowMatches"]
                            else tier["topProviderRowMatches"][0]["rowKey"]
                        ),
                        "jointSquaredErrorFeet2": (
                            None
                            if not tier["topProviderRowMatches"]
                            else tier["topProviderRowMatches"][0]["jointSquaredErrorFeet2"]
                        ),
                    }
                    for tier in tier_results
                ],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Derive cubemap edge adjacency and direction from checksum-locked pixels."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-cubemap-pixel-seam-topology-v1"
EDGE_NAMES = ("top", "right", "bottom", "left")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def edge_pixels(image: np.ndarray, edge: str, inset: int) -> np.ndarray:
    if edge == "top":
        return image[inset, :, :].astype(np.float64)
    if edge == "right":
        return image[:, image.shape[1] - 1 - inset, :].astype(np.float64)
    if edge == "bottom":
        return image[image.shape[0] - 1 - inset, :, :].astype(np.float64)
    if edge == "left":
        return image[:, inset, :].astype(np.float64)
    raise ValueError(f"Unsupported edge: {edge}")


def normalized_edge_score(first: np.ndarray, second: np.ndarray) -> dict[str, float]:
    difference = first - second
    first_gradient = np.diff(first, axis=0)
    second_gradient = np.diff(second, axis=0)
    return {
        "meanAbsoluteRgbDifference": round(float(np.mean(np.abs(difference))), 6),
        "rootMeanSquareRgbDifference": round(float(np.sqrt(np.mean(difference**2))), 6),
        "meanAbsoluteGradientDifference": round(
            float(np.mean(np.abs(first_gradient - second_gradient))),
            6,
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", default="207")
    parser.add_argument("--inset", type=int, default=0)
    parser.add_argument("--top-matches-per-edge", type=int, default=6)
    arguments = parser.parse_args()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    panorama = json.loads(panorama_bytes)
    source_section = next(
        record for record in panorama["sections"] if str(record["sectionId"]) == arguments.section
    )
    images: dict[str, np.ndarray] = {}
    sources: dict[str, dict[str, Any]] = {}
    for record in source_section["images"]:
        path = Path(record["localPath"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {path}")
        if image.shape[0] != image.shape[1]:
            raise ValueError("Cube face must be square")
        images[record["face"]] = image
        sources[record["face"]] = {
            "path": str(path.resolve()),
            "sha256": record["sha256"],
            "width": image.shape[1],
            "height": image.shape[0],
        }
    if set(images) != {"f", "r", "b", "l", "u", "d"}:
        raise ValueError("All six named cube faces are required")

    rankings: list[dict[str, Any]] = []
    all_pairs: list[dict[str, Any]] = []
    for first_face, first_image in images.items():
        for first_edge in EDGE_NAMES:
            first_pixels = edge_pixels(first_image, first_edge, arguments.inset)
            candidates: list[dict[str, Any]] = []
            for second_face, second_image in images.items():
                if second_face == first_face:
                    continue
                for second_edge in EDGE_NAMES:
                    second_pixels = edge_pixels(second_image, second_edge, arguments.inset)
                    for reversed_order in (False, True):
                        comparison = second_pixels[::-1] if reversed_order else second_pixels
                        scores = normalized_edge_score(first_pixels, comparison)
                        record = {
                            "firstFace": first_face,
                            "firstEdge": first_edge,
                            "secondFace": second_face,
                            "secondEdge": second_edge,
                            "secondEdgeReversed": reversed_order,
                            **scores,
                        }
                        candidates.append(record)
                        all_pairs.append(record)
            candidates.sort(
                key=lambda record: (
                    record["meanAbsoluteGradientDifference"],
                    record["meanAbsoluteRgbDifference"],
                )
            )
            rankings.append(
                {
                    "face": first_face,
                    "edge": first_edge,
                    "topMatches": candidates[: arguments.top_matches_per_edge],
                }
            )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "sourceManifest": {
            "path": str(arguments.panorama_manifest),
            "sha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "artifactVersion": panorama["artifactVersion"],
        },
        "sectionId": str(arguments.section),
        "sources": sources,
        "parameters": {
            "edgeInsetPixels": arguments.inset,
            "topMatchesPerEdge": arguments.top_matches_per_edge,
            "rankingMetric": [
                "mean absolute first-difference gradient mismatch",
                "mean absolute RGB mismatch",
            ],
        },
        "edgeRankings": rankings,
        "interpretation": {
            "automaticTopologyAssignment": False,
            "why": "Repeated structures and JPEG seams can create false low scores; reciprocal edge rankings require review.",
        },
        "publicationEligible": False,
        "blockers": [
            "PIXEL_SEAM_TOPOLOGY_REQUIRES_RECIPROCAL_REVIEW",
            "CUBEMAP_RAY_MODEL_NOT_REVALIDATED",
            "ROW_COVERAGE_INCOMPLETE",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "cubemap-pixel-seam-topology-audit",
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
                "edgeCount": len(rankings),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

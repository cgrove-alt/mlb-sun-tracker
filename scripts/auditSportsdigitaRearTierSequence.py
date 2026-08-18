#!/usr/bin/env python3
"""Audit reviewed rear-tier line selections against a checksum-locked cube face."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-rear-tier-sequence-audit-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def normalized_segment(endpoints: list[int]) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = endpoints
    if (x2, y2) < (x1, y1):
        return x2, y2, x1, y1
    return x1, y1, x2, y2


def y_at_x(endpoints: list[int], reference_x: float) -> float:
    x1, y1, x2, y2 = (float(value) for value in endpoints)
    if x1 == x2:
        raise ValueError("Selected tier line is vertical")
    return y1 + (y2 - y1) * (reference_x - x1) / (x2 - x1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("reviewed_lines", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    arguments = parser.parse_args()

    review_bytes = arguments.reviewed_lines.read_bytes()
    manifest_bytes = arguments.panorama_manifest.read_bytes()
    review = json.loads(review_bytes)
    panorama = json.loads(manifest_bytes)
    if review.get("analysisVersion") != "reviewed-sportsdigita-rear-tier-lines-v1":
        raise ValueError("Reviewed lines use an unsupported analysis version")
    inputs = review["inputs"]
    if inputs["panoramaManifestSha256"] != hashlib.sha256(manifest_bytes).hexdigest():
        raise ValueError("Panorama manifest checksum mismatch")
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == str(review["sectionId"])
    )
    source = next(
        record for record in section["images"] if str(record["face"]) == review["face"]
    )
    source_path = Path(source["localPath"])
    if source["sha256"] != inputs["sourceSha256"]:
        raise ValueError("Reviewed source checksum differs from the panorama manifest")
    if sha256_file(source_path) != source["sha256"]:
        raise ValueError("Cube-face checksum mismatch")
    image = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Could not decode {source_path}")

    left, top, right, bottom = review["reviewRegionPixels"]
    crop = image[top:bottom, left:right]
    parameters = review["candidateLineDetection"]
    edges = cv2.Canny(
        cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY),
        parameters["cannyLowerThreshold"],
        parameters["cannyUpperThreshold"],
        L2gradient=bool(parameters["cannyL2Gradient"]),
    )
    lines = cv2.HoughLinesP(
        edges,
        parameters["houghRhoPixels"],
        parameters["houghThetaRadians"],
        parameters["houghThreshold"],
        minLineLength=parameters["minimumLineLengthPixels"],
        maxLineGap=parameters["maximumLineGapPixels"],
    )
    if lines is None:
        raise ValueError("Hough line detector returned no candidates")
    detected: set[tuple[int, int, int, int]] = set()
    for raw in lines[:, 0]:
        x1, y1, x2, y2 = (int(value) for value in raw)
        detected.add(normalized_segment([x1 + left, y1 + top, x2 + left, y2 + top]))

    reference_x = float(review["referenceXPixel"])
    audited_lines: list[dict[str, Any]] = []
    for selected in review["selectedLines"]:
        endpoints = [int(value) for value in selected["sourceEndpointsPixels"]]
        x1, y1, x2, y2 = endpoints
        segment_length = math.hypot(x2 - x1, y2 - y1)
        angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
        exact_candidate = normalized_segment(endpoints) in detected
        if not exact_candidate:
            raise ValueError(f"Reviewed segment is absent from detector output: {selected['sequenceId']}")
        if segment_length < parameters["minimumReviewedSegmentLengthPixels"]:
            raise ValueError(f"Reviewed segment is too short: {selected['sequenceId']}")
        minimum_angle, maximum_angle = parameters["acceptedAngleRangeDegrees"]
        if not minimum_angle <= angle <= maximum_angle:
            raise ValueError(f"Reviewed segment angle is outside policy: {selected['sequenceId']}")
        audited_lines.append(
            {
                **selected,
                "sourceEndpointsPixels": endpoints,
                "lengthPixels": round(segment_length, 6),
                "angleDegrees": round(angle, 6),
                "yAtReferenceXPixel": round(y_at_x(endpoints, reference_x), 6),
                "exactHoughCandidate": True,
            }
        )

    tier_lines = [line for line in audited_lines if line["role"] != "rear-guard-rail"]
    if tier_lines[0]["role"] != "reference-visual-tier":
        raise ValueError("First selected line must be the reference visual tier")
    if tier_lines[-1]["role"] != "last-seating-tier":
        raise ValueError("Last tier line must identify the final seating tier")
    tier_y = [line["yAtReferenceXPixel"] for line in tier_lines]
    if any(second >= first for first, second in zip(tier_y, tier_y[1:])):
        raise ValueError("Reviewed tier sequence is not strictly rearward at reference x")
    rear_boundary = next(line for line in audited_lines if line["role"] == "rear-guard-rail")
    if rear_boundary["yAtReferenceXPixel"] >= tier_y[-1]:
        raise ValueError("Rear boundary is not behind the last seating tier")
    rear_tier_count = len(tier_lines) - 1
    decision = review["reviewDecision"]
    if rear_tier_count != int(decision["seatingTiersAfterReferenceTier"]):
        raise ValueError("Reviewed count does not match selected tier lines")

    overlay = image.copy()
    colors = [
        (0, 255, 255),
        (0, 255, 0),
        (255, 160, 0),
        (255, 0, 255),
    ]
    for index, line in enumerate(audited_lines):
        x1, y1, x2, y2 = line["sourceEndpointsPixels"]
        color = (0, 0, 255) if line["role"] == "rear-guard-rail" else colors[index % len(colors)]
        cv2.line(overlay, (x1, y1), (x2, y2), color, 4, cv2.LINE_AA)
        cv2.putText(
            overlay,
            line["sequenceId"],
            (x1 + 6, y1 - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            color,
            2,
            cv2.LINE_AA,
        )
    cv2.rectangle(overlay, (left, top), (right, bottom), (255, 255, 255), 2)
    scale = 2
    review_crop = overlay[top:bottom, left:right]
    enlarged = cv2.resize(
        review_crop,
        (review_crop.shape[1] * scale, review_crop.shape[0] * scale),
        interpolation=cv2.INTER_LANCZOS4,
    )
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    full_path = arguments.output_directory / "section-207-f-reviewed-rear-tier-lines.png"
    crop_path = arguments.output_directory / "section-207-f-reviewed-rear-tier-lines-crop-2x.png"
    if not cv2.imwrite(str(full_path), overlay, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {full_path}")
    if not cv2.imwrite(str(crop_path), enlarged, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {crop_path}")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "reviewedLinesPath": str(arguments.reviewed_lines),
            "reviewedLinesSha256": hashlib.sha256(review_bytes).hexdigest(),
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
            "sourcePath": str(source_path.resolve()),
            "sourceSha256": source["sha256"],
        },
        "sectionId": str(review["sectionId"]),
        "face": review["face"],
        "referenceVisualTierId": "section-207-front-face-upper-tier",
        "referenceXPixel": reference_x,
        "reviewedLines": audited_lines,
        "rearTierCount": rear_tier_count,
        "rearBoundaryImmediatelyAfterLastTier": bool(
            decision["rearBoundaryImmediatelyAfterLastTier"]
        ),
        "auditChecks": {
            "allSelectedLinesAreExactDetectorCandidates": True,
            "allSelectedLinesMeetLengthAndAnglePolicy": True,
            "tierSequenceStrictlyRearwardAtReferenceX": True,
            "rearBoundaryBehindLastSeatingTier": True,
            "reviewedCountMatchesSelectedLines": True,
        },
        "outputs": [
            {
                "purpose": "full-face reviewed line overlay",
                "path": str(full_path.resolve()),
                "sha256": sha256_file(full_path),
            },
            {
                "purpose": "2x reviewed region overlay",
                "path": str(crop_path.resolve()),
                "sha256": sha256_file(crop_path),
            },
        ],
        "allowedUse": review["reviewMethod"]["allowedUse"],
        "publicationEligible": False,
        "blockers": review["publication"]["blockers"],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "rear-tier-sequence-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(manifest_path),
                "artifactVersion": artifact["artifactVersion"],
                "rearTierCount": rear_tier_count,
                "rearBoundaryImmediatelyAfterLastTier": artifact[
                    "rearBoundaryImmediatelyAfterLastTier"
                ],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

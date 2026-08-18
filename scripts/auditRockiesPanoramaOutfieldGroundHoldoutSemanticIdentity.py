#!/usr/bin/env python3
"""Fail closed when the paired outfield observations are different vertices."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-outfield-ground-holdout-semantic-identity-v1"


def read_bound(record: dict[str, Any]) -> tuple[bytes, Any]:
    path = Path(record["path"])
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != record["sha256"]:
        raise ValueError(f"Input checksum differs: {path}")
    return data, json.loads(data) if path.suffix.lower() == ".json" else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("controlVersion") != "rockies-section-207-outfield-ground-holdout-semantic-review-controls-v1":
        raise ValueError("Unsupported semantic review controls")
    extraction_bytes, extraction = read_bound(controls["inputs"]["holdoutExtraction"])
    read_bound(controls["inputs"]["pairedReviewImage"])
    read_bound(controls["inputs"]["independentOppositeView"])
    if extraction.get("analysisVersion") != "rockies-panorama-outfield-ground-holdout-extraction-v1":
        raise ValueError("Unsupported holdout extraction")
    if extraction["panoramaObservation"]["selectedVertexPixel"] != controls["observations"]["section207Panorama"]["pixel"]:
        raise ValueError("Reviewed panorama pixel differs from extraction")
    if extraction["orthophotoObservation"]["selectedVertexPixel"] != controls["observations"]["orthophoto"]["pixel"]:
        raise ValueError("Reviewed orthophoto pixel differs from extraction")
    adjudication = controls["adjudication"]
    if adjudication["samePhysicalFeature"] or adjudication["holdoutEligible"]:
        raise ValueError("This audit only represents a failed semantic match")
    if not adjudication["activeQuarantine"]:
        raise ValueError("Failed semantic match must remain quarantined")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "controlsPath": str(args.controls),
            "controlsSha256": hashlib.sha256(control_bytes).hexdigest(),
            "holdoutExtractionPath": controls["inputs"]["holdoutExtraction"]["path"],
            "holdoutExtractionSha256": hashlib.sha256(extraction_bytes).hexdigest(),
            "holdoutExtractionArtifactVersion": extraction["artifactVersion"],
            "pairedReviewImage": controls["inputs"]["pairedReviewImage"],
            "independentOppositeView": controls["inputs"]["independentOppositeView"],
        },
        "observations": controls["observations"],
        "adjudication": adjudication,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-outfield-ground-holdout-semantic-identity-audit",
        "artifactStage": "semantic-mismatch-quarantined",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesIndependentHoldoutObservation": False,
            "establishesHoldoutPass": False,
            "establishesCameraPose": False,
            "activeQuarantine": True,
            "note": "The image measurements are real, but they refer to different physical corners. No pose residual or pass claim is permitted.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "OUTFIELD_GROUND_HOLDOUT_SEMANTIC_IDENTITY_MISMATCH",
                "INDEPENDENT_OUTFIELD_GROUND_HOLDOUT_NOT_PASSED",
                "CAMERA_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
                "CAMERA_VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "samePhysicalFeature": artifact["adjudication"]["samePhysicalFeature"],
                "activeQuarantine": artifact["geometryBoundary"]["activeQuarantine"],
                "blockers": artifact["publication"]["blockers"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

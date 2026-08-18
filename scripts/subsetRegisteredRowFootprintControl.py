#!/usr/bin/env python3
"""Subset a checksum-locked registered row footprint artifact by section."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "registered-row-footprint-section-subset-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--sections", required=True)
    arguments = parser.parse_args()
    sections = [value.strip() for value in arguments.sections.split(",") if value.strip()]
    if not sections or len(sections) != len(set(sections)):
        raise ValueError("Sections must be a nonempty unique list")

    source_bytes = arguments.input.read_bytes()
    source = json.loads(source_bytes)
    if source.get("analysisVersion") != "registered-seat-row-footprint-control-v1":
        raise ValueError("Input uses an unsupported analysis version")
    features = [
        feature
        for feature in source.get("features", [])
        if str(feature.get("attributes", {}).get("sectionName")) in sections
    ]
    found = {
        str(feature.get("attributes", {}).get("sectionName")) for feature in features
    }
    if found != set(sections):
        raise ValueError(f"Requested sections are missing: {sorted(set(sections) - found)}")
    row_keys = [str(feature["attributes"]["rowKey"]) for feature in features]
    if len(row_keys) != len(set(row_keys)):
        raise ValueError("Subset contains duplicate row keys")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "sourcePath": str(arguments.input),
            "sourceSha256": hashlib.sha256(source_bytes).hexdigest(),
            "sourceArtifactVersion": source.get("artifactVersion"),
        },
        "sections": sections,
        "featureCount": len(features),
        "rowKeys": row_keys,
        "features": features,
        "interpretation": {
            "geometryChanged": False,
            "coordinateReferenceInheritedFromSource": True,
            "publicationEligible": False,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "registered-row-analysis-mask-subset",
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
                "sections": sections,
                "featureCount": len(features),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Audit whether independent venues share one provider panorama axis convention.

The public viewer uses venue-local Cartesian seat coordinates and spherical
panorama rays. This audit compares independently measured rotations from at
least two venues with the canonical viewer-axis permutation. It does not
georeference any venue and cannot make a shade result publication eligible.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np


CANONICAL_PROVIDER_TO_PANORAMA = np.asarray(
    [[0.0, 0.0, 1.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 0.0]],
    dtype=float,
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def rotation_difference_degrees(first: np.ndarray, second: np.ndarray) -> float:
    relative = first.T @ second
    cosine = float(np.clip((np.trace(relative) - 1.0) / 2.0, -1.0, 1.0))
    return math.degrees(math.acos(cosine))


def parse_labeled_path(value: str) -> tuple[str, Path]:
    label, separator, raw_path = value.partition("=")
    if not separator or not label.strip() or not raw_path.strip():
        raise argparse.ArgumentTypeError("Calibration must use LABEL=PATH")
    return label.strip(), Path(raw_path.strip())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument(
        "--calibration", type=parse_labeled_path, action="append", default=[]
    )
    parser.add_argument("--maximum-angular-error-degrees", type=float, default=1.0)
    arguments = parser.parse_args()
    if len(arguments.calibration) < 2:
        raise ValueError("At least two independent venue calibrations are required")
    if arguments.maximum_angular_error_degrees <= 0:
        raise ValueError("Maximum angular error must be positive")
    labels = [label for label, _ in arguments.calibration]
    if len(set(labels)) != len(labels):
        raise ValueError("Calibration labels must be unique")

    records: list[dict[str, Any]] = []
    rotations: dict[str, np.ndarray] = {}
    for label, path in arguments.calibration:
        source_bytes = path.read_bytes()
        source = json.loads(source_bytes)
        rotation = np.asarray(
            source["rotation"]["providerVectorToPanoramaVector"], dtype=float
        )
        if rotation.shape != (3, 3):
            raise ValueError(f"Calibration has an invalid rotation: {path}")
        rotations[label] = rotation
        records.append(
            {
                "venueLabel": label,
                "path": str(path),
                "sha256": hashlib.sha256(source_bytes).hexdigest(),
                "artifactVersion": source["artifactVersion"],
                "measurementEligible": bool(
                    source.get("assessment", {}).get("measurementEligible")
                ),
                "holdoutSummary": source.get("holdoutSummary"),
                "rotation": rotation.tolist(),
                "angularDifferenceFromCanonicalDegrees": rotation_difference_degrees(
                    CANONICAL_PROVIDER_TO_PANORAMA, rotation
                ),
            }
        )

    pairwise: list[dict[str, Any]] = []
    for first_index, first_label in enumerate(labels):
        for second_label in labels[first_index + 1 :]:
            pairwise.append(
                {
                    "firstVenueLabel": first_label,
                    "secondVenueLabel": second_label,
                    "angularDifferenceDegrees": rotation_difference_degrees(
                        rotations[first_label], rotations[second_label]
                    ),
                }
            )
    maximum_canonical_error = max(
        record["angularDifferenceFromCanonicalDegrees"] for record in records
    )
    maximum_pairwise_error = max(
        record["angularDifferenceDegrees"] for record in pairwise
    )
    convention_eligible = bool(
        all(record["measurementEligible"] for record in records)
        and maximum_canonical_error <= arguments.maximum_angular_error_degrees
        and maximum_pairwise_error <= arguments.maximum_angular_error_degrees
    )

    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "cross-venue-provider-panorama-axis-convention-v1",
        "artifactStage": "provider-runtime-axis-convention-audit",
        "inputs": records,
        "canonicalProviderVectorToPanoramaVector": (
            CANONICAL_PROVIDER_TO_PANORAMA.tolist()
        ),
        "pairwiseComparisons": pairwise,
        "validation": {
            "venueCount": len(records),
            "maximumCanonicalAngularErrorDegrees": maximum_canonical_error,
            "maximumPairwiseAngularErrorDegrees": maximum_pairwise_error,
            "maximumAllowedAngularErrorDegrees": (
                arguments.maximum_angular_error_degrees
            ),
            "conventionEligibleForViewerProjection": convention_eligible,
        },
        "scope": {
            "allowedUse": (
                "project provider-local metric anchors into current public viewer "
                "panoramas that use the same runtime convention"
            ),
            "doesNotEstablish": [
                "venue georeferencing",
                "survey accuracy",
                "shade labels",
                "publication eligibility",
            ],
        },
        "publicationEligible": False,
        "blockers": [
            "VENUE_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "SHADOW_BOUNDARY_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                **artifact["validation"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

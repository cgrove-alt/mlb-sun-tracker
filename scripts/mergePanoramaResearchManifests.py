#!/usr/bin/env python3
"""Merge compatible panorama research manifests against an expected seat inventory."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("expected_seat_inventory", type=Path)
    parser.add_argument("output_manifest", type=Path)
    parser.add_argument("input_manifest", type=Path, nargs="+")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    inventory = json.loads(args.expected_seat_inventory.read_text())
    expected = (
        inventory.get("completeSeatIds")
        or inventory.get("seatIds")
        or inventory.get("outputSeatIds")
    )
    if not expected:
        raise ValueError("Expected seat inventory has no seat ID list")
    manifests = [json.loads(path.read_text()) for path in args.input_manifest]
    identity_keys = ["mapUrl", "venueResourceRoot", "viewerVersion"]
    identity = {key: manifests[0][key] for key in identity_keys}
    for path, manifest in zip(args.input_manifest, manifests):
        for key, value in identity.items():
            if manifest.get(key) != value:
                raise ValueError(f"Manifest {path} has incompatible {key}")
    by_seat: dict[str, dict[str, Any]] = {}
    provenance: dict[str, str] = {}
    duplicates = []
    for path, manifest in zip(args.input_manifest, manifests):
        for image in manifest["images"]:
            seat_id = image["seatId"]
            if seat_id in by_seat:
                if image["imageSha256"] != by_seat[seat_id]["imageSha256"]:
                    raise ValueError(f"Conflicting image hashes for duplicate {seat_id}")
                duplicates.append(seat_id)
                continue
            local_path = Path(image["localPath"])
            actual_hash = sha256_file(local_path)
            if actual_hash != image["imageSha256"]:
                raise ValueError(f"Local image hash mismatch for {seat_id}")
            by_seat[seat_id] = image
            provenance[seat_id] = str(path)
    expected_set = set(expected)
    missing = [seat_id for seat_id in expected if seat_id not in by_seat]
    unexpected = sorted(set(by_seat) - expected_set)
    if missing or unexpected:
        raise ValueError(f"Coverage mismatch: {len(missing)} missing, {len(unexpected)} unexpected")
    images = [
        {
            **by_seat[seat_id],
            "sourceManifestPath": provenance[seat_id],
        }
        for seat_id in expected
    ]
    source_manifests = [
        {
            "path": str(path),
            "sha256": sha256_file(path),
            "imageCount": len(manifest["images"]),
            "extractedOn": manifest.get("extractedOn"),
        }
        for path, manifest in zip(args.input_manifest, manifests)
    ]
    stable = {
        "expectedSeatInventory": {
            "path": str(args.expected_seat_inventory),
            "sha256": sha256_file(args.expected_seat_inventory),
            "artifactVersion": inventory.get("artifactVersion"),
        },
        "sourceManifests": source_manifests,
        "identity": identity,
        "images": images,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "merged-public-venue-panorama-geometry-research-input",
        "artifactVersion": fingerprint(stable),
        **identity,
        "expectedSeatInventory": stable["expectedSeatInventory"],
        "sourceManifests": source_manifests,
        "images": images,
        "baselines": [],
        "coverage": {
            "expectedSeatCount": len(expected),
            "imageCount": len(images),
            "coverageFraction": 1.0,
            "missingSeatIds": missing,
            "unexpectedSeatIds": unexpected,
            "duplicateSeatIdsWithIdenticalHashes": sorted(set(duplicates)),
            "allLocalImageHashesVerified": True,
        },
        "licenseAssessment": manifests[0].get("licenseAssessment"),
        "publication": {
            "eligible": False,
            "blockers": [
                "PANORAMA_DEPTH_NOT_PROVIDED",
                "IMAGE_REUSE_TERMS_NOT_ESTABLISHED",
                "DERIVED_OCCLUSION_MODEL_NOT_YET_CROSS_VALIDATED",
            ],
        },
    }
    args.output_manifest.parent.mkdir(parents=True, exist_ok=True)
    args.output_manifest.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputManifest": str(args.output_manifest),
        "artifactVersion": artifact["artifactVersion"],
        "coverage": artifact["coverage"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Lock semantic row decisions and recent closed-roof persistence blockers."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


DECISIONS = {
    "SEC22:H": {
        "decision": "rejected",
        "reason": "PROVIDER_PATH_OVER_ADVERTISING_BOARD_NOT_SEATING",
        "reviewNote": "The corrected provider path crosses the Humana Cabana advertising-board surface rather than a seating tread.",
    },
    "SEC23:H": {
        "decision": "rejected",
        "reason": "PROVIDER_PATH_OVER_ADVERTISING_BOARD_NOT_SEATING",
        "reviewNote": "The corrected provider path crosses the Humana Cabana advertising-board surface rather than a seating tread.",
    },
    "SEC25:1": {
        "decision": "rejected",
        "reason": "PROVIDER_PATH_ON_RAIL_DIVIDER_TREAD_IDENTITY_NOT_PROVEN",
        "reviewNote": "The path follows a tunnel or section-divider railing; the selected return is not independently proven to be a row tread.",
    },
    "SEC4:J": {
        "decision": "semantic-tread-supported-not-measured",
        "reason": "CURRENT_PHYSICAL_ROW_PERSISTENCE_NOT_INDEPENDENTLY_OBSERVED",
        "reviewNote": "The 2018 profile follows a tread below seat hardware, and 2026 club-linked Section 4 panoramas render the labeled row as physical seats on a tread. The rendered provider model is not independent current as-built evidence.",
    },
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("atlas", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("provider_audit", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("recent_manifests", nargs=4, type=Path)
    args = parser.parse_args()

    atlas_bytes = args.atlas.read_bytes()
    atlas = json.loads(atlas_bytes)
    if atlas.get("artifactKind") != "row-surface-semantic-review-atlas":
        raise ValueError("Semantic atlas has the wrong artifact kind")
    atlas_rows = {item["rowKey"]: item for item in atlas["outputs"]}
    if set(atlas_rows) != set(DECISIONS):
        raise ValueError("Semantic atlas row set does not match locked decisions")
    for item in atlas_rows.values():
        image = Path(item["path"])
        if sha256_file(image) != item["sha256"]:
            raise ValueError(f"Semantic review image checksum mismatch: {image}")

    provider_audit_bytes = args.provider_audit.read_bytes()
    provider_audit = json.loads(provider_audit_bytes)
    sampled = provider_audit.get("sampledPanoPositions", {})
    if sampled.get("requested") != 126 or sampled.get("successful") != 126:
        raise ValueError("Section 4 provider audit is not the complete locked sample")
    row_j_positions = [
        item for item in sampled.get("positions", []) if item["id"].startswith("S_SEC4-J-")
    ]
    if len(row_j_positions) != 15:
        raise ValueError("Section 4 provider audit does not contain all 15 row J seats")
    if max(item["position"][1] for item in row_j_positions) - min(
        item["position"][1] for item in row_j_positions
    ) > 0.0011:
        raise ValueError("Section 4 row J provider camera anchors are not coplanar")

    panorama_bytes = args.panorama_manifest.read_bytes()
    panorama = json.loads(panorama_bytes)
    if panorama.get("artifactKind") != "public-venue-panorama-geometry-research-input":
        raise ValueError("Section 4 panorama manifest has the wrong artifact kind")
    required_panorama_seats = {
        "S_SEC4-H-8", "S_SEC4-J-1", "S_SEC4-J-8", "S_SEC4-J-15", "S_SEC4-K-8"
    }
    panorama_images = {item["seatId"]: item for item in panorama.get("images", [])}
    if set(panorama_images) != required_panorama_seats:
        raise ValueError("Section 4 panorama set does not match the locked review set")
    for item in panorama_images.values():
        if sha256_file(Path(item["localPath"])) != item["imageSha256"]:
            raise ValueError(f"Section 4 panorama checksum mismatch: {item['localPath']}")

    roof_epochs = []
    for expected_year, path in zip(range(2022, 2026), args.recent_manifests):
        manifest_bytes = path.read_bytes()
        manifest = json.loads(manifest_bytes)
        if manifest.get("artifactKind") != "official-arcgis-orthophoto-export":
            raise ValueError(f"Recent manifest has wrong artifact kind: {path}")
        if manifest.get("stadiumId") != "marlins":
            raise ValueError(f"Recent manifest is for the wrong stadium: {path}")
        if manifest["source"]["sourceYear"] != expected_year:
            raise ValueError(f"Expected the {expected_year} manifest at {path}")
        image = Path(manifest["localImagePath"])
        if sha256_file(image) != manifest["export"]["sha256"]:
            raise ValueError(f"Recent orthophoto checksum mismatch: {image}")
        roof_epochs.append(
            {
                "sourceYear": expected_year,
                "manifestPath": str(path),
                "manifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
                "manifestArtifactVersion": manifest["artifactVersion"],
                "imagePath": str(image),
                "imageSha256": manifest["export"]["sha256"],
                "pixelSizeFeet": manifest["export"]["pixelSizeX"],
                "manualVisualRoofState": "closed",
                "seatingBowlObservable": False,
                "eligibleForRowPersistence": False,
                "reason": "RETRACTABLE_ROOF_OCCLUDES_SEATING_BOWL",
            }
        )

    rows = []
    for row_key, decision in DECISIONS.items():
        atlas_item = atlas_rows[row_key]
        rows.append(
            {
                "rowKey": row_key,
                "semanticReviewImagePath": atlas_item["path"],
                "semanticReviewImageSha256": atlas_item["sha256"],
                **decision,
                "measuredRow": False,
                "publicationEligible": False,
            }
        )

    stable = {
        "atlasSha256": hashlib.sha256(atlas_bytes).hexdigest(),
        "providerAuditSha256": hashlib.sha256(provider_audit_bytes).hexdigest(),
        "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
        "rows": rows,
        "recentRoofEpochs": roof_epochs,
    }
    output = {
        "schemaVersion": 1,
        "artifactKind": "row-surface-semantic-adjudication",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "semanticAtlasPath": str(args.atlas),
            "semanticAtlasSha256": stable["atlasSha256"],
            "semanticAtlasArtifactVersion": atlas["artifactVersion"],
            "currentProviderAuditPath": str(args.provider_audit),
            "currentProviderAuditSha256": stable["providerAuditSha256"],
            "currentPanoramaManifestPath": str(args.panorama_manifest),
            "currentPanoramaManifestSha256": stable["panoramaManifestSha256"],
        },
        "reviewMethod": {
            "kind": "manual-visual-semantic-review",
            "reviewedEvidence": [
                "corrected provider path over official 2018 orthophoto",
                "2018 LiDAR row-normal profiles at every accepted numeric anchor",
                "2026 club-linked provider anchors for all 15 Section 4 row J seats",
                "2026 club-linked rendered panoramas at five disjoint Section 4 seats",
                "official Miami-Dade 2022-2025 0.25-foot orthophoto exports",
            ],
            "limitation": "Recent annual orthophotos cannot establish row persistence when the retractable roof is closed.",
        },
        "rows": rows,
        "recentRoofEpochs": roof_epochs,
        "summary": {
            "rowsReviewed": len(rows),
            "rowsRejected": sum(row["decision"] == "rejected" for row in rows),
            "rowsSemanticTreadSupportedNotMeasured": sum(
                row["decision"] == "semantic-tread-supported-not-measured" for row in rows
            ),
            "measuredRows": 0,
            "recentEpochsReviewed": len(roof_epochs),
            "recentOpenRoofEpochs": 0,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ZERO_SEMANTICALLY_AND_CURRENTLY_VERIFIED_MEASURED_ROWS",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, indent=2) + "\n")
    print(
        json.dumps(
            {
                "output": str(args.output),
                "artifactVersion": output["artifactVersion"],
                "summary": output["summary"],
                "publication": output["publication"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

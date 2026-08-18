#!/usr/bin/env python3
"""Fail closed on the semantic identity of the Section 207 LiDAR match.

The cross-epoch profile audit found a repeatable raked surface with a close
vertical fit to the panorama-derived repeated-rail profile. That numerical fit
does not identify which physical surface produced the airborne returns. This
audit checksum-locks the reviewed imagery and prior artifacts, preserves the
valid numerical result, and quarantines the rail-datum interpretation until an
independent Section 207 structural control identifies the matched surface.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "rockies-section-207-rail-lidar-semantic-identity-audit-v1"
CONTROLS_VERSION = "rockies-section-207-rail-lidar-semantic-review-controls-v1"


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def load(path: Path) -> tuple[bytes, dict[str, Any]]:
    data = path.read_bytes()
    return data, json.loads(data)


def input_record(path: Path, data: bytes, artifact: dict[str, Any]) -> dict[str, Any]:
    return {
        "path": str(path),
        "sha256": sha256_bytes(data),
        "artifactVersion": artifact.get("artifactVersion"),
    }


def resolve_recorded_path(path_text: str, manifest_path: Path) -> Path:
    path = Path(path_text)
    if path.is_absolute():
        return path
    workspace_candidate = Path.cwd() / path
    if workspace_candidate.exists():
        return workspace_candidate
    return manifest_path.parent / path


def assert_file_hash(path: Path, expected: str, label: str) -> None:
    actual = sha256_bytes(path.read_bytes())
    if actual != expected:
        raise ValueError(f"{label} checksum mismatch: expected {expected}, found {actual}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("profile_audit", type=Path)
    parser.add_argument("cross_epoch_lidar", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("orthophoto_review_manifest", type=Path)
    parser.add_argument("profile_surface_review", type=Path)
    parser.add_argument("official_map_tier_review", type=Path)
    parser.add_argument("review_controls", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    profile_bytes, profile = load(arguments.profile_audit)
    cross_epoch_bytes, cross_epoch = load(arguments.cross_epoch_lidar)
    panorama_bytes, panorama = load(arguments.panorama_manifest)
    orthophoto_bytes, orthophoto = load(arguments.orthophoto_review_manifest)
    surface_review_bytes, surface_review = load(arguments.profile_surface_review)
    map_review_bytes, map_review = load(arguments.official_map_tier_review)
    controls_bytes, controls = load(arguments.review_controls)

    if profile.get("artifactKind") != "rockies-section-rail-profile-independent-lidar-audit":
        raise ValueError("Profile input has the wrong artifact kind")
    if cross_epoch.get("artifactKind") != "ticketmaster-cross-epoch-lidar-row-cluster-audit":
        raise ValueError("Cross-epoch input has the wrong artifact kind")
    if panorama.get("artifactKind") != "club-linked-section-panorama-research-input":
        raise ValueError("Panorama input has the wrong artifact kind")
    if orthophoto.get("artifactKind") != "ticketmaster-orthophoto-row-review-queue":
        raise ValueError("Orthophoto input has the wrong artifact kind")
    if surface_review.get("artifactKind") != "rockies-raw-point-feature-review":
        raise ValueError("Profile-surface review has the wrong artifact kind")
    if map_review.get("artifactKind") != "rockies-official-map-tier-identity-review":
        raise ValueError("Official map tier review has the wrong artifact kind")
    if controls.get("analysisVersion") != CONTROLS_VERSION:
        raise ValueError("Review controls have the wrong analysis version")
    if str(profile.get("sectionId")) != "207" or str(controls.get("sectionId")) != "207":
        raise ValueError("This audit is restricted to Section 207")

    profile_cross_epoch = profile.get("inputs", {}).get("crossEpochLidar", {})
    if profile_cross_epoch.get("sha256") != sha256_bytes(cross_epoch_bytes):
        raise ValueError("Profile audit is not locked to the supplied cross-epoch artifact")
    if cross_epoch.get("geometryBoundary", {}).get(
        "establishesThatMatchedReturnsAreRowWalkingSurfaces"
    ) is not False:
        raise ValueError("Cross-epoch artifact does not explicitly preserve unresolved surface semantics")
    if cross_epoch.get("geometryBoundary", {}).get("establishesMeasuredRowElevations") is not False:
        raise ValueError("Cross-epoch artifact unexpectedly claims measured row elevations")

    sections = [
        section for section in panorama.get("sections", [])
        if str(section.get("sectionId")) == "207"
    ]
    if len(sections) != 1:
        raise ValueError("Panorama manifest must contain exactly one Section 207 record")
    section = sections[0]
    if section.get("mapMetadata", {}).get("sectionTitle") != "Rightfield Mezzanine":
        raise ValueError("Section 207 panorama title changed")
    image_by_face = {image["face"]: image for image in section.get("images", [])}

    reviewed_images = []
    for control in controls.get("reviewedImages", []):
        source = control.get("source")
        expected = control.get("sha256")
        if source == "officialSection207Panorama":
            face = control.get("face")
            record = image_by_face.get(face)
            if record is None:
                raise ValueError(f"Panorama manifest lacks reviewed face {face}")
            if record.get("sha256") != expected:
                raise ValueError(f"Reviewed panorama face {face} no longer matches the controls")
            path = resolve_recorded_path(record["localPath"], arguments.panorama_manifest)
        elif source == "orthophotoRowReviewSheet":
            queue = orthophoto.get("manualReviewQueue", [])
            if len(queue) != 1 or str(queue[0].get("sectionName")) != "207":
                raise ValueError("Orthophoto queue must contain only Section 207")
            record = queue[0]["reviewSheet"]
            if record.get("sha256") != expected:
                raise ValueError("Reviewed orthophoto sheet no longer matches the controls")
            path = resolve_recorded_path(record["path"], arguments.orthophoto_review_manifest)
        elif source == "rawLidarProfileMatchReview":
            outputs = surface_review.get("featureOutputs", [])
            if len(outputs) != 1 or outputs[0].get("featureId") != (
                "SECTION_207_PROFILE_MATCH_SURFACE"
            ):
                raise ValueError("Profile-surface review has the wrong feature output")
            record = outputs[0]
            if record.get("outputSha256") != expected:
                raise ValueError("Reviewed profile-surface sheet no longer matches the controls")
            path = resolve_recorded_path(record["outputPath"], arguments.profile_surface_review)
        elif source == "officialMapTierIdentityReview":
            finding = map_review.get("semanticFinding", {})
            if finding.get("section207And307AreDistinctMappedTiers") is not True:
                raise ValueError("Official map review does not preserve distinct 207 and 307 tiers")
            record = map_review.get("output", {})
            if record.get("sha256") != expected:
                raise ValueError("Reviewed official map tier sheet no longer matches the controls")
            path = resolve_recorded_path(record["path"], arguments.official_map_tier_review)
        else:
            raise ValueError(f"Unsupported reviewed image source: {source}")
        assert_file_hash(path, expected, f"reviewed image {source}")
        reviewed_images.append(
            {
                "source": source,
                "face": control.get("face"),
                "path": str(path),
                "sha256": expected,
                "observation": control["observation"],
                "semanticLimit": control["semanticLimit"],
            }
        )

    if len(reviewed_images) < 5:
        raise ValueError("At least five checksum-locked image reviews are required")
    adjudication = controls.get("adjudication", {})
    if adjudication.get("matchedSurfaceFeatureIdentity") != "unresolved":
        raise ValueError("Controls must not identify the matched surface without metric proof")
    if adjudication.get("measuredSection207RailElevation") is not False:
        raise ValueError("Controls must explicitly reject a measured Section 207 rail elevation")
    if adjudication.get("allowRailDatumTransfer") is not False:
        raise ValueError("Controls must explicitly forbid rail-datum transfer")

    quarantined_versions = [
        profile.get("artifactVersion"),
        "sha256:1d60d774a9c22c8bbef49c470269180cc27bcbdb4539e3e4ef509022d1a8e79d",
        "sha256:71ccd95965b59bb9346a164f9ea5f33c1f160e775797ce08226f7786b13afb9d",
    ]
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "profileAudit": input_record(arguments.profile_audit, profile_bytes, profile),
            "crossEpochLidar": input_record(arguments.cross_epoch_lidar, cross_epoch_bytes, cross_epoch),
            "panoramaManifest": input_record(arguments.panorama_manifest, panorama_bytes, panorama),
            "orthophotoReviewManifest": input_record(
                arguments.orthophoto_review_manifest, orthophoto_bytes, orthophoto
            ),
            "profileSurfaceReview": input_record(
                arguments.profile_surface_review, surface_review_bytes, surface_review
            ),
            "officialMapTierReview": input_record(
                arguments.official_map_tier_review, map_review_bytes, map_review
            ),
            "reviewControls": {
                "path": str(arguments.review_controls),
                "sha256": sha256_bytes(controls_bytes),
                "analysisVersion": controls.get("analysisVersion"),
            },
        },
        "stadiumId": "rockies",
        "sectionId": "207",
        "reviewedImages": reviewed_images,
        "numericalResultPreserved": {
            "repeatableRakedSurfaceFound": True,
            "selectedRowBand": [
                profile["selection"]["selected"]["firstRowNumber"],
                profile["selection"]["selected"]["lastRowNumber"],
            ],
            "crossEpochOneFootResidualGatePassed": profile["validation"][
                "passedOneFootResidualGate"
            ],
            "candidateOffsetFeet": profile["selection"]["selected"][
                "fittedRailToAbsoluteOffsetFeet"
            ],
            "interpretation": "numerical profile match only",
        },
        "semanticIdentity": {
            **adjudication,
            "candidatePhysicalSurfaces": controls.get("candidatePhysicalSurfaces", []),
            "requiredResolutionEvidence": controls.get("requiredResolutionEvidence", []),
        },
        "quarantine": {
            "active": True,
            "artifactVersions": quarantined_versions,
            "forbiddenUses": [
                "Section 207 rail elevation",
                "Section 207 tread elevation",
                "Section 207 seated-eye elevation",
                "row-level shadow origin",
                "obstruction-volume registration",
            ],
            "releaseCondition": (
                "An independent current Section 207 structural control must identify the matched "
                "LiDAR surface and establish the rail-to-surface relationship within one foot."
            ),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-section-rail-lidar-semantic-identity-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishes": [
                "a checksum-locked visual and artifact review of the matched raked surface",
                "the numerical cross-epoch profile match remains reproducible",
                "the matched surface identity is unresolved",
            ],
            "doesNotEstablish": [
                "that airborne returns are the repeated Section 207 rail",
                "a Section 207 absolute rail, tread, or seated-eye elevation",
                "above-ground orthophoto relief correction",
                "current 2026 seating or obstruction geometry",
                "independent shadow-boundary accuracy",
            ],
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "MATCHED_LIDAR_MODES_DO_NOT_IDENTIFY_SECTION_OR_TIER",
                "AIRBORNE_RETURNS_DO_NOT_IDENTIFY_RAIL_VS_TREAD_SEAT_OR_RAKER",
                "ORTHOPHOTO_ELEVATED_STRUCTURE_PARALLAX_UNRESOLVED",
                "RAIL_TO_TREAD_OFFSET_NOT_ESTABLISHED",
                "CURRENT_GEOMETRY_NOT_CONFIRMED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "matchedSurfaceFeatureIdentity": adjudication["matchedSurfaceFeatureIdentity"],
                "measuredSection207RailElevation": adjudication[
                    "measuredSection207RailElevation"
                ],
                "quarantineActive": True,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

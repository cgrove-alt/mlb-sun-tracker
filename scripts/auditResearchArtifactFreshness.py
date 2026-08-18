#!/usr/bin/env python3
"""Audit checksum-locked JSON research artifact inputs.

Research artifacts in this repository record source paths beside SHA-256
digests. A derived artifact becomes stale as soon as one of those source files
changes. This audit makes that condition explicit and machine-readable so an
older result cannot be treated as current evidence after a review decision is
revised.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "research-artifact-input-freshness-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def input_stem(path_key: str) -> str:
    if not path_key.endswith("Path"):
        raise ValueError(f"Input key does not end in Path: {path_key}")
    return path_key[:-4]


def has_checksum_locked_input(inputs: dict[str, Any]) -> bool:
    if any(
        key.endswith("Path") and f"{input_stem(key)}Sha256" in inputs
        for key in inputs
    ):
        return True

    def contains_nested(value: Any) -> bool:
        if isinstance(value, dict):
            if "path" in value and "sha256" in value:
                return True
            return any(contains_nested(item) for item in value.values())
        if isinstance(value, list):
            return any(contains_nested(item) for item in value)
        return False

    return contains_nested(inputs)


def audit_nested_input_records(
    value: Any,
    *,
    artifact_path: Path,
    trail: tuple[str, ...] = (),
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            recorded_path = value["path"]
            recorded_checksum = value["sha256"]
            stem = ".".join(trail) if trail else "input"
            if not isinstance(recorded_path, str) or not recorded_path:
                raise ValueError(f"{stem}.path must contain a non-empty string")
            if (
                not isinstance(recorded_checksum, str)
                or len(recorded_checksum) != 64
                or any(
                    character not in "0123456789abcdef"
                    for character in recorded_checksum
                )
            ):
                raise ValueError(
                    f"{stem}.sha256 must contain a lowercase SHA-256 digest"
                )
            source_path = Path(recorded_path)
            if not source_path.is_absolute():
                workspace_candidate = Path.cwd() / source_path
                artifact_candidate = artifact_path.parent / source_path
                source_path = (
                    workspace_candidate
                    if workspace_candidate.exists() or not artifact_candidate.exists()
                    else artifact_candidate
                )
            source_exists = source_path.is_file()
            actual_checksum = sha256_file(source_path) if source_exists else None
            checksum_matches = actual_checksum == recorded_checksum
            source_artifact_version = None
            recorded_artifact_version = value.get("artifactVersion")
            artifact_version_matches = None
            if source_exists and recorded_artifact_version is not None:
                try:
                    source_value = json.loads(source_path.read_text(encoding="utf-8"))
                except (UnicodeDecodeError, json.JSONDecodeError):
                    artifact_version_matches = False
                else:
                    source_artifact_version = source_value.get("artifactVersion")
                    artifact_version_matches = (
                        source_artifact_version == recorded_artifact_version
                    )
            return [
                {
                    "inputStem": stem,
                    "recordedPath": recorded_path,
                    "resolvedPath": str(source_path.resolve()),
                    "sourceExists": source_exists,
                    "recordedSha256": recorded_checksum,
                    "actualSha256": actual_checksum,
                    "checksumMatches": checksum_matches,
                    "recordedArtifactVersion": recorded_artifact_version,
                    "sourceArtifactVersion": source_artifact_version,
                    "artifactVersionMatches": artifact_version_matches,
                    "fresh": bool(
                        source_exists
                        and checksum_matches
                        and artifact_version_matches is not False
                    ),
                }
            ]
        for key, item in sorted(value.items()):
            records.extend(
                audit_nested_input_records(
                    item,
                    artifact_path=artifact_path,
                    trail=(*trail, key),
                )
            )
    elif isinstance(value, list):
        for index, item in enumerate(value):
            records.extend(
                audit_nested_input_records(
                    item,
                    artifact_path=artifact_path,
                    trail=(*trail, str(index)),
                )
            )
    return records


def audit_input_record(
    inputs: dict[str, Any],
    *,
    artifact_path: Path,
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for path_key in sorted(key for key in inputs if key.endswith("Path")):
        stem = input_stem(path_key)
        checksum_key = f"{stem}Sha256"
        if checksum_key not in inputs:
            continue
        recorded_path = inputs[path_key]
        recorded_checksum = inputs[checksum_key]
        if not isinstance(recorded_path, str) or not recorded_path:
            raise ValueError(f"{path_key} must contain a non-empty string")
        if (
            not isinstance(recorded_checksum, str)
            or len(recorded_checksum) != 64
            or any(character not in "0123456789abcdef" for character in recorded_checksum)
        ):
            raise ValueError(f"{checksum_key} must contain a lowercase SHA-256 digest")
        source_path = Path(recorded_path)
        if not source_path.is_absolute():
            workspace_candidate = Path.cwd() / source_path
            artifact_candidate = artifact_path.parent / source_path
            source_path = (
                workspace_candidate
                if workspace_candidate.exists() or not artifact_candidate.exists()
                else artifact_candidate
            )
        source_exists = source_path.is_file()
        actual_checksum = sha256_file(source_path) if source_exists else None
        checksum_matches = actual_checksum == recorded_checksum
        source_artifact_version = None
        recorded_artifact_version = inputs.get(f"{stem}ArtifactVersion")
        artifact_version_matches = None
        if source_exists and recorded_artifact_version is not None:
            try:
                source_value = json.loads(source_path.read_text(encoding="utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                artifact_version_matches = False
            else:
                source_artifact_version = source_value.get("artifactVersion")
                artifact_version_matches = source_artifact_version == recorded_artifact_version
        records.append(
            {
                "inputStem": stem,
                "recordedPath": recorded_path,
                "resolvedPath": str(source_path.resolve()),
                "sourceExists": source_exists,
                "recordedSha256": recorded_checksum,
                "actualSha256": actual_checksum,
                "checksumMatches": checksum_matches,
                "recordedArtifactVersion": recorded_artifact_version,
                "sourceArtifactVersion": source_artifact_version,
                "artifactVersionMatches": artifact_version_matches,
                "fresh": bool(
                    source_exists
                    and checksum_matches
                    and artifact_version_matches is not False
                ),
            }
        )
    records.extend(
        audit_nested_input_records(inputs, artifact_path=artifact_path)
    )
    return records


def audit_artifact(
    path: Path,
    *,
    ancestry: tuple[Path, ...] = (),
) -> dict[str, Any]:
    resolved_path = path.resolve()
    if resolved_path in ancestry:
        return {
            "path": str(path),
            "resolvedPath": str(resolved_path),
            "allInputsFresh": False,
            "blockers": ["ARTIFACT_INPUT_DEPENDENCY_CYCLE"],
        }
    raw = path.read_bytes()
    artifact = json.loads(raw)
    inputs = artifact.get("inputs")
    if not isinstance(inputs, dict):
        return {
            "path": str(path),
            "resolvedPath": str(resolved_path),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "artifactVersion": artifact.get("artifactVersion"),
            "inputCount": 0,
            "freshInputCount": 0,
            "allInputsFresh": False,
            "inputs": [],
            "blockers": ["ARTIFACT_INPUT_PROVENANCE_NOT_CHECKSUM_LOCKED"],
        }
    records = audit_input_record(inputs, artifact_path=path)
    if not records:
        return {
            "path": str(path),
            "resolvedPath": str(resolved_path),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "artifactVersion": artifact.get("artifactVersion"),
            "inputCount": 0,
            "freshInputCount": 0,
            "allInputsFresh": False,
            "inputs": [],
            "blockers": ["ARTIFACT_INPUT_PROVENANCE_NOT_CHECKSUM_LOCKED"],
        }
    for record in records:
        record["directFresh"] = record["fresh"]
        record["transitiveAudit"] = None
        if not record["directFresh"]:
            continue
        source_path = Path(record["resolvedPath"])
        try:
            source_value = json.loads(source_path.read_text(encoding="utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            continue
        if not isinstance(source_value, dict) or not isinstance(
            source_value.get("inputs"), dict
        ):
            continue
        if not has_checksum_locked_input(source_value["inputs"]):
            continue
        nested = audit_artifact(
            source_path,
            ancestry=(*ancestry, resolved_path),
        )
        record["transitiveAudit"] = nested
        record["fresh"] = bool(nested["allInputsFresh"])
    blockers: list[str] = []
    if any(not record["sourceExists"] for record in records):
        blockers.append("ARTIFACT_INPUT_MISSING")
    if any(
        record["sourceExists"] and not record["checksumMatches"] for record in records
    ):
        blockers.append("ARTIFACT_INPUT_CHECKSUM_MISMATCH")
    if any(record["artifactVersionMatches"] is False for record in records):
        blockers.append("ARTIFACT_INPUT_VERSION_MISMATCH")
    if any(
        record["directFresh"] and not record["fresh"]
        for record in records
    ):
        blockers.append("ARTIFACT_TRANSITIVE_INPUT_STALE")
    return {
        "path": str(path),
        "resolvedPath": str(resolved_path),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "artifactVersion": artifact.get("artifactVersion"),
        "inputCount": len(records),
        "freshInputCount": sum(record["fresh"] for record in records),
        "allInputsFresh": not blockers and all(record["fresh"] for record in records),
        "inputs": records,
        "blockers": blockers,
    }


def build_audit(paths: list[Path]) -> dict[str, Any]:
    artifact_records = [audit_artifact(path) for path in paths]
    blockers = sorted(
        {
            blocker
            for artifact in artifact_records
            for blocker in artifact["blockers"]
        }
    )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "artifacts": artifact_records,
        "summary": {
            "artifactCount": len(artifact_records),
            "freshArtifactCount": sum(
                artifact["allInputsFresh"] for artifact in artifact_records
            ),
            "allArtifactsFresh": not blockers
            and all(artifact["allInputsFresh"] for artifact in artifact_records),
        },
        "publicationEligible": False,
        "blockers": blockers,
    }
    return {
        "schemaVersion": 1,
        "artifactStage": "research-artifact-input-freshness-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifacts", nargs="+", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    arguments = parser.parse_args()

    audit = build_audit(arguments.artifacts)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(audit, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": audit["artifactVersion"],
                "summary": audit["summary"],
                "blockers": audit["blockers"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

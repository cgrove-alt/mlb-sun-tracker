#!/usr/bin/env python3
"""Merge independently reviewed row-control artifacts without changing labels."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("components", type=Path, nargs="+")
    args = parser.parse_args()
    if len(args.components) < 2:
        raise ValueError("At least two reviewed control artifacts are required")
    artifacts = [json.loads(path.read_text()) for path in args.components]
    first = artifacts[0]
    required_equal = (
        "reviewStatus",
        "coordinateConvention",
        "sectionId",
        "sectionFractionReference",
    )
    for path, artifact in zip(args.components, artifacts):
        if artifact.get("reviewStatus") != "independently-reviewed-broadcast-row-fraction-controls":
            raise ValueError(f"Controls are not independently reviewed: {path}")
        for key in required_equal:
            if artifact.get(key) != first.get(key):
                raise ValueError(f"Control artifact disagrees on {key}: {path}")
        if artifact.get("inputs") != first.get("inputs"):
            raise ValueError(f"Control artifact input fingerprint differs: {path}")

    scope: list[str] = []
    controls: list[dict[str, Any]] = []
    control_ids: set[str] = set()
    row_partitions: dict[str, set[str]] = {}
    for path, artifact in zip(args.components, artifacts):
        for row_id in artifact.get("registrationScopeRowIds", []):
            value = str(row_id)
            if value not in scope:
                scope.append(value)
        for control in artifact.get("controls", []):
            control_id = str(control.get("id"))
            if not control_id or control_id in control_ids:
                raise ValueError(f"Duplicate or missing control id {control_id!r} in {path}")
            control_ids.add(control_id)
            row_id = str(control.get("rowId"))
            partition = str(control.get("partition"))
            row_partitions.setdefault(row_id, set()).add(partition)
            controls.append(control)
    mixed_rows = sorted(row_id for row_id, values in row_partitions.items() if len(values) > 1)
    if mixed_rows:
        raise ValueError(f"Rows cannot cross training and holdout partitions: {mixed_rows}")

    merged: dict[str, Any] = {
        "schemaVersion": 1,
        "artifactStage": "merged-reviewed-official-broadcast-row-registration-controls",
        "artifactVersion": "sha256:pending",
        "reviewStatus": first["reviewStatus"],
        "coordinateConvention": first["coordinateConvention"],
        "inputs": first["inputs"],
        "sectionId": first["sectionId"],
        "registrationScopeRowIds": scope,
        "sectionFractionReference": first["sectionFractionReference"],
        "mergeProvenance": {
            "method": "concatenate labels without coordinate or partition changes",
            "components": [
                {
                    "path": str(path),
                    "sha256": sha256_file(path),
                    "controlCount": len(artifact.get("controls", [])),
                    "scopeRowIds": [str(value) for value in artifact.get("registrationScopeRowIds", [])],
                    "reviewMethod": artifact.get("reviewMethod"),
                }
                for path, artifact in zip(args.components, artifacts)
            ],
        },
        "controls": controls,
    }
    stable = dict(merged)
    stable.pop("artifactVersion")
    merged["artifactVersion"] = stable_version(stable)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(merged, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": merged["artifactVersion"],
        "scopeRowIds": scope,
        "trainingControlCount": sum(control.get("partition") == "training" for control in controls),
        "holdoutControlCount": sum(control.get("partition") == "holdout" for control in controls),
    }, indent=2))


if __name__ == "__main__":
    main()

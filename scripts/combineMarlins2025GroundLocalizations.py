#!/usr/bin/env python3
"""Combine independent Marlins localization batches without fitting a model."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2025-combined-ground-localization-v1"
ACCEPTED_KINDS = {
    "marlins-2025-full-tile-ground-localization",
    "marlins-2025-native-ground-localization",
}


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def namespaced_record(record: dict[str, Any], namespace: str) -> dict[str, Any]:
    return {
        **record,
        "sourceCandidateId": record["candidateId"],
        "candidateId": f"{namespace}:{record['candidateId']}",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("localizations", type=Path, nargs="+")
    arguments = parser.parse_args()
    if len(arguments.localizations) < 2:
        raise ValueError("At least two independent localization batches are required")

    inputs = []
    batches = []
    for index, path in enumerate(arguments.localizations, start=1):
        localization, localization_sha256 = locked_json(path)
        if localization.get("artifactKind") not in ACCEPTED_KINDS:
            raise ValueError(f"Unsupported localization artifact: {path}")
        if localization.get("stadiumId") != "marlins":
            raise ValueError(f"Localization targets another stadium: {path}")
        inputs.append({
            "path": str(path),
            "sha256": localization_sha256,
            "artifactVersion": localization["artifactVersion"],
            "analysisVersion": localization["analysisVersion"],
            "role": localization["role"],
            "namespace": f"batch-{index}",
        })
        batches.append(localization)

    roles = {batch["role"] for batch in batches}
    if len(roles) != 1:
        raise ValueError("Localization batch roles differ")
    role = roles.pop()
    methods = [batch["predeclaredLocalizationMethod"] for batch in batches]
    parameters = [batch["parameters"] for batch in batches]
    if any(method != methods[0] for method in methods[1:]):
        raise ValueError("Localization methods differ across batches")
    if any(parameter != parameters[0] for parameter in parameters[1:]):
        raise ValueError("Localization parameters differ across batches")
    if any(method["registrationModelSelected"] for method in methods):
        raise ValueError("A source localization selected a registration model")
    if not all(
        method["finalHoldoutOffsetsMayNotInfluenceModelSelection"]
        for method in methods
    ):
        raise ValueError("A source localization lacks final-holdout isolation")

    localized = []
    evaluations = []
    locked_count = 0
    for input_record, batch in zip(inputs, batches):
        namespace = input_record["namespace"]
        localized.extend(
            namespaced_record(record, namespace)
            for record in batch["localizedControls"]
        )
        evaluations.extend(
            namespaced_record(record, namespace)
            for record in batch["evaluations"]
        )
        locked_count += int(batch["assessment"]["lockedControlCount"])

    minimum_localized_count = 9 if role == "training" else 6
    blockers = []
    if len(localized) < minimum_localized_count:
        blockers.append("TOO_FEW_COMBINED_CONTROLS_PASS_LOCALIZATION_GATE")
    if role == "training":
        blockers.extend([
            "REGISTRATION_MODEL_NOT_YET_SELECTED_FROM_TRAINING_ONLY",
            "FINAL_HOLDOUTS_NOT_YET_LOCALIZED_OR_SCORED",
        ])
    else:
        blockers.append("FINAL_HOLDOUT_RESIDUALS_NOT_YET_SCORED")
    blockers.append("INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED")

    stable = {
        "inputs": inputs,
        "role": role,
        "method": methods[0],
        "parameters": parameters[0],
        "localizedControls": localized,
        "evaluations": evaluations,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": batches[0]["analysisVersion"],
        "combinationAnalysisVersion": ANALYSIS_VERSION,
        "artifactKind": batches[0]["artifactKind"],
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "role": role,
        "inputs": {
            "trainingLocalizations" if role == "training" else "finalLocalizations": inputs,
        },
        "predeclaredLocalizationMethod": methods[0],
        "parameters": parameters[0],
        "evaluations": evaluations,
        "localizedControls": localized,
        "assessment": {
            "sourceBatchCount": len(batches),
            "lockedControlCount": locked_count,
            "localizedControlCount": len(localized),
            "localizationGatePassed": len(localized) >= minimum_localized_count,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": blockers,
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "role": role,
        "sourceBatchCount": len(batches),
        "lockedControlCount": locked_count,
        "localizedControlCount": len(localized),
        "outputSha256": sha256_file(arguments.output),
        "blockers": blockers,
    }, indent=2))


if __name__ == "__main__":
    main()

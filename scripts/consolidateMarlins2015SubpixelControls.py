#!/usr/bin/env python3
"""Lock multiscale-localized 2015 Marlins registration controls before fitting."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2015-locked-subpixel-controls-v1"
BASELINE_LOCKED_ROLES = {
    "hard-structure-04": "training",
    "hard-structure-05": "holdout",
    "hard-structure-06": "training",
    "hard-structure-07": "training",
    "hard-structure-11": "holdout",
    "hard-structure-12": "training",
    "hard-structure-14": "holdout",
    "hard-structure-16": "holdout",
    "hard-structure-18": "training",
    "hard-structure-19": "training",
    "hard-structure-20": "holdout",
    "hard-structure-23": "holdout",
}
COMBINED_ROW_BUDGET_LOCKED_ROLES = {
    "hard-structure-00": "training",
    "hard-structure-04": "training",
    "hard-structure-05": "holdout",
    "hard-structure-06": "training",
    "hard-structure-07": "training",
    "hard-structure-14": "holdout",
    "hard-structure-15": "training",
    "hard-structure-16": "holdout",
    "hard-structure-18": "holdout",
    "hard-structure-19": "training",
    "hard-structure-20": "holdout",
    "hard-structure-23": "holdout",
}
FULL_FRAME_TRAINING_LOCKED_ROLES = {
    "hard-structure-00": "training",
    "hard-structure-04": "training",
    "hard-structure-05": "holdout",
    "hard-structure-06": "training",
    "hard-structure-07": "holdout",
    "hard-structure-14": "holdout",
    "hard-structure-15": "training",
    "hard-structure-16": "holdout",
    "hard-structure-18": "training",
    "hard-structure-19": "training",
    "hard-structure-20": "holdout",
    "hard-structure-23": "holdout",
}
SEMANTIC_IDENTITIES = {
    "hard-structure-00": "south adjacent building roof-edge patch",
    "hard-structure-04": "south adjacent flat-roof fixture cluster",
    "hard-structure-05": "south adjacent flat-roof corner",
    "hard-structure-06": "southwest adjacent flat-roof edge",
    "hard-structure-07": "southeast adjacent rectangular roof perimeter",
    "hard-structure-11": "fixed east stadium-perimeter curved edge",
    "hard-structure-12": "fixed north stadium-perimeter curved edge",
    "hard-structure-14": "southwest adjacent flat-roof corner",
    "hard-structure-15": "southeast adjacent L-shaped roof corner",
    "hard-structure-16": "southeast adjacent building west roof edge",
    "hard-structure-18": "northeast adjacent building west roof edge",
    "hard-structure-19": "southwest adjacent rectangular roof corner",
    "hard-structure-20": "south adjacent flat-roof edge feature",
    "hard-structure-23": "far southwest adjacent flat-roof seam",
}
MAXIMUM_CROSS_PATCH_DISTANCE_METRES = 0.20
BASELINE_MAXIMUM_LOCALIZATION_ENVELOPE_METRES = 0.30
COMBINED_ROW_BUDGET_MAXIMUM_LOCALIZATION_ENVELOPE_METRES = 0.19
MINIMUM_MEDIAN_RESPONSE = 0.12
MAXIMUM_SHIFT_NORM_METRES = 0.80


def checksum_locked(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("base_controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("refinements", type=Path, nargs="+")
    parser.add_argument(
        "--profile",
        choices=("baseline", "combined-row-budget", "full-frame-training"),
        default="baseline",
    )
    args = parser.parse_args()

    base, base_sha256 = checksum_locked(args.base_controls)
    if base.get("reviewStatus") != "reviewed-2018-2015-hard-structure-lidar-controls":
        raise ValueError("Base controls have the wrong review status")
    refinements = []
    refinement_inputs = []
    for path in args.refinements:
        artifact, digest = checksum_locked(path)
        if artifact.get("artifactKind") != "hard-structure-control-subpixel-refinement":
            raise ValueError(f"Refinement has the wrong kind: {path}")
        if artifact["inputs"]["controlsSha256"] != base_sha256:
            raise ValueError(f"Refinement uses different base controls: {path}")
        if not artifact["parameters"].get("allCandidates"):
            raise ValueError(f"Refinement did not evaluate all candidates: {path}")
        refinements.append(artifact)
        refinement_inputs.append({
            "path": str(path),
            "sha256": digest,
            "artifactVersion": artifact["artifactVersion"],
            "patchHalfWidthMetres": artifact["parameters"][
                "patchHalfWidthMetres"
            ],
        })
    widths = sorted(
        item["patchHalfWidthMetres"] for item in refinement_inputs
    )
    if args.profile == "baseline":
        expected_widths = [8.0, 12.0, 18.0]
        locked_roles = BASELINE_LOCKED_ROLES
        maximum_localization_envelope = (
            BASELINE_MAXIMUM_LOCALIZATION_ENVELOPE_METRES
        )
    else:
        expected_widths = [8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0]
        locked_roles = (
            COMBINED_ROW_BUDGET_LOCKED_ROLES
            if args.profile == "combined-row-budget"
            else FULL_FRAME_TRAINING_LOCKED_ROLES
        )
        maximum_localization_envelope = (
            COMBINED_ROW_BUDGET_MAXIMUM_LOCALIZATION_ENVELOPE_METRES
        )
    if widths != expected_widths:
        raise ValueError(
            f"Refinements do not match the locked {args.profile} width set"
        )

    queue = json.loads(Path(base["inputs"]["reviewQueue"]["path"]).read_text())
    if sha256_file(Path(base["inputs"]["reviewQueue"]["path"])) != (
        base["inputs"]["reviewQueue"]["sha256"]
    ):
        raise ValueError("Review queue checksum mismatch")
    queue_by_id = {record["candidateId"]: record for record in queue["candidates"]}
    refinement_by_width = {
        float(artifact["parameters"]["patchHalfWidthMetres"]): {
            record["candidateId"]: record for record in artifact["records"]
        }
        for artifact in refinements
    }

    evaluations = []
    selected_controls = []
    for candidate_id, candidate in queue_by_id.items():
        estimates = []
        for width, records in sorted(refinement_by_width.items()):
            refined = records[candidate_id].get("refined")
            if refined is None:
                continue
            shift = np.asarray(
                refined["referenceToComparisonShiftMetres"], dtype=float
            )
            if float(np.linalg.norm(shift)) > MAXIMUM_SHIFT_NORM_METRES:
                continue
            estimates.append({
                "patchHalfWidthMetres": width,
                "shift": shift,
                "refined": refined,
            })
        consensus = None
        if len(estimates) >= 2:
            unvisited = set(range(len(estimates)))
            components = []
            while unvisited:
                pending = [unvisited.pop()]
                component = []
                while pending:
                    current = pending.pop()
                    component.append(current)
                    neighbours = {
                        other
                        for other in unvisited
                        if float(
                            np.linalg.norm(
                                estimates[current]["shift"]
                                - estimates[other]["shift"]
                            )
                        )
                        <= MAXIMUM_CROSS_PATCH_DISTANCE_METRES
                    }
                    unvisited -= neighbours
                    pending.extend(neighbours)
                components.append([estimates[index] for index in component])
            eligible_components = [
                component for component in components if len(component) >= 2
            ]
            inliers = []
            if eligible_components:
                inliers = min(
                    eligible_components,
                    key=lambda component: (
                        -len(component),
                        min(
                            item["refined"][
                                "crossRunShiftDispersionMetres"
                            ]["p95"]
                            for item in component
                        ),
                        -max(
                            item["refined"]["response"]["median"]
                            for item in component
                        ),
                    ),
                )
            if len(inliers) >= 2:
                median_shift = np.median(
                    np.asarray([item["shift"] for item in inliers]), axis=0
                )
                selected = min(
                    inliers,
                    key=lambda item: (
                        item["refined"]["crossRunShiftDispersionMetres"]["p95"],
                        -item["refined"]["response"]["median"],
                        item["patchHalfWidthMetres"],
                    ),
                )
                cross_patch_distances = [
                    float(np.linalg.norm(item["shift"] - median_shift))
                    for item in inliers
                ]
                localization_envelope = max(
                    float(
                        selected["refined"]["crossRunShiftDispersionMetres"][
                            "p95"
                        ]
                    ),
                    max(cross_patch_distances),
                )
                passes = bool(
                    localization_envelope <= maximum_localization_envelope
                    and selected["refined"]["response"]["median"]
                    >= MINIMUM_MEDIAN_RESPONSE
                )
                consensus = {
                    "passes": passes,
                    "availablePatchEstimateCount": len(estimates),
                    "consistentPatchEstimateCount": len(inliers),
                    "medianShiftMetres": median_shift.tolist(),
                    "selectedPatchHalfWidthMetres": selected[
                        "patchHalfWidthMetres"
                    ],
                    "selectedReferenceToComparisonShiftMetres": selected[
                        "shift"
                    ].tolist(),
                    "selectedComparisonUtmMetres": selected["refined"][
                        "comparisonUtmMetres"
                    ],
                    "selectedResponseMedian": selected["refined"]["response"][
                        "median"
                    ],
                    "selectedCrossRunP95Metres": selected["refined"][
                        "crossRunShiftDispersionMetres"
                    ]["p95"],
                    "maximumCrossPatchDistanceFromMedianMetres": max(
                        cross_patch_distances
                    ),
                    "localizationEnvelopeMetres": localization_envelope,
                }
        evaluation = {
            "candidateId": candidate_id,
            "lockedRole": locked_roles.get(candidate_id),
            "referenceLocalMetres": candidate["reference"]["localMetres"],
            "referenceUtmMetres": candidate["reference"]["utmMetres"],
            "consensus": consensus,
        }
        evaluations.append(evaluation)
        if candidate_id not in locked_roles:
            continue
        if consensus is None or not consensus["passes"]:
            raise ValueError(f"Locked control failed the pre-fit gate: {candidate_id}")
        selected_controls.append({
            "candidateId": candidate_id,
            "role": locked_roles[candidate_id],
            "semanticIdentity": SEMANTIC_IDENTITIES[candidate_id],
            "referenceUtmMetres": candidate["reference"]["utmMetres"],
            "comparisonUtmMetres": consensus[
                "selectedComparisonUtmMetres"
            ],
            "localizationEnvelopeMetres": consensus[
                "localizationEnvelopeMetres"
            ],
            "selectedPatchHalfWidthMetres": consensus[
                "selectedPatchHalfWidthMetres"
            ],
        })

    training_count = sum(item["role"] == "training" for item in selected_controls)
    holdout_count = sum(item["role"] == "holdout" for item in selected_controls)
    if training_count != 6 or holdout_count != 6:
        raise ValueError("Locked controls are not a six-training, six-holdout split")

    stable = {
        "baseControlsSha256": base_sha256,
        "refinementInputs": refinement_inputs,
        "selectionParameters": {
            "maximumCrossPatchDistanceMetres": MAXIMUM_CROSS_PATCH_DISTANCE_METRES,
            "maximumLocalizationEnvelopeMetres": maximum_localization_envelope,
            "minimumMedianResponse": MINIMUM_MEDIAN_RESPONSE,
            "maximumShiftNormMetres": MAXIMUM_SHIFT_NORM_METRES,
        },
        "profile": args.profile,
        "lockedRoles": locked_roles,
        "controls": selected_controls,
        "evaluations": evaluations,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "locked-subpixel-hard-structure-controls",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewStatus": "locked-2018-2015-subpixel-hard-structure-controls",
        "inputs": {
            "baseControls": {
                "path": str(args.base_controls),
                "sha256": base_sha256,
                "artifactVersion": base["artifactVersion"],
            },
            "reviewQueue": base["inputs"]["reviewQueue"],
            "reviewSheet": base["inputs"]["reviewSheet"],
            "referenceSurveyReview": base["inputs"]["referenceSurveyReview"],
            "comparisonVerticalDatumAudit": base["inputs"][
                "comparisonVerticalDatumAudit"
            ],
            "refinements": refinement_inputs,
        },
        "selectionProtocol": {
            **stable["selectionParameters"],
            "requiredPatchHalfWidthsMetres": widths,
            "minimumConsistentPatchEstimateCount": 2,
            "selectedEstimateRule": "lowest cross-run p95 among cross-patch-consistent estimates, then highest response, then smallest patch",
            "partitionRule": "The six training and six holdout identifiers are locked here before the second rigid fit. Holdouts are never fit inputs.",
        },
        "controls": selected_controls,
        "evaluations": evaluations,
        "assessment": {
            "acceptedControlCount": len(selected_controls),
            "trainingControlCount": training_count,
            "holdoutControlCount": holdout_count,
            "semanticHardStructureIdentityReviewed": True,
            "movableRoofControlsExcluded": True,
            "vegetationControlsExcluded": True,
            "subpixelLocalizationGatePassed": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "LOCKED_RIGID_REGISTRATION_NOT_YET_AUDITED",
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "assessment": artifact["assessment"],
        "controls": selected_controls,
    }, indent=2))


if __name__ == "__main__":
    main()

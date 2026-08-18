#!/usr/bin/env python3
"""Extract and gate one NRCan CanElevation project-metadata record.

The source File Geodatabase is checksum locked by the project acquisition
manifest. Horizontal RMSEr is converted to 95 percent confidence only with the
1.7308 factor published in NRCan's Federal Airborne LiDAR Data Acquisition
Guideline. The result remains a source-level candidate and never promotes a
stadium model.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from pyogrio.raw import read


ANALYSIS_VERSION = "nrcan-canelevation-project-metadata-v1"
METRES_TO_FEET = 3.280839895013123
HORIZONTAL_RMSER_TO_95 = 1.7308
EXPECTED_MANIFEST_KIND = "nrcan-canelevation-lidar-project-acquisition"
METADATA_ARCHIVE_NAME = "Metadata_PointCloud_NRCAN.gdb.zip"
PRODUCT_SPECIFICATION_NAME = "CanElevation-LiDARPointClouds_products_specs_EN.pdf"
GDB_NAME = "Metadata_PointCloud_NRCAN.gdb"
LAYER_NAME = "metadata_2"
STANDARD_URL = (
    "https://natural-resources.canada.ca/science-data/science-research/"
    "natural-hazards/flood-mapping/federal-airborne-lidar-data-acquisition-guideline"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--project-id", required=True)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--horizontal-threshold-ft", type=float, default=1.0)
    parser.add_argument("--vertical-threshold-ft", type=float, default=1.0)
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def scalar(value: Any) -> Any:
    return value.item() if hasattr(value, "item") else value


def required_float(record: dict[str, Any], key: str) -> float:
    try:
        value = float(record[key])
    except (KeyError, TypeError, ValueError) as error:
        raise ValueError(f"Metadata field {key} is not numeric") from error
    if not math.isfinite(value) or value < 0:
        raise ValueError(f"Metadata field {key} must be finite and nonnegative")
    return value


def supporting_document(manifest: dict[str, Any], filename: str) -> dict[str, Any]:
    matches = [
        item
        for item in manifest.get("supportingDocuments", [])
        if Path(item.get("path", "")).name == filename
    ]
    if len(matches) != 1:
        raise ValueError(f"Manifest must contain exactly one {filename}")
    item = matches[0]
    path = Path(item["path"])
    if not path.is_file():
        raise FileNotFoundError(path)
    current_hash = sha256(path)
    if current_hash != item.get("sha256"):
        raise ValueError(f"Supporting document bytes have drifted: {path}")
    return {**item, "path": path, "verifiedSha256": current_hash}


def main() -> None:
    args = parse_args()
    if args.horizontal_threshold_ft <= 0 or args.vertical_threshold_ft <= 0:
        raise ValueError("Accuracy thresholds must be positive")
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    if manifest.get("artifactKind") != EXPECTED_MANIFEST_KIND:
        raise ValueError(f"Manifest is not a {EXPECTED_MANIFEST_KIND} artifact")

    metadata_archive = supporting_document(manifest, METADATA_ARCHIVE_NAME)
    product_specification = supporting_document(manifest, PRODUCT_SPECIFICATION_NAME)
    virtual_gdb_path = f"/vsizip/{metadata_archive['path'].resolve()}/{GDB_NAME}"
    metadata, _fids, _geometry, columns = read(
        virtual_gdb_path,
        layer=LAYER_NAME,
        read_geometry=False,
        where=f"ID = '{args.project_id}'",
        datetime_as_string=True,
    )
    fields = metadata["fields"].tolist()
    if not columns or len(columns[0]) != 1:
        raise ValueError(
            f"Expected exactly one metadata record for {args.project_id}, found "
            f"{0 if not columns else len(columns[0])}"
        )
    record = {name: scalar(columns[index][0]) for index, name in enumerate(fields)}

    horizontal_min_m = required_float(record, "VALUE_PLANI_MIN")
    horizontal_max_m = required_float(record, "VALUE_PLANI_MAX")
    vertical_min_m = required_float(record, "VALUE_ALTI_MIN")
    vertical_max_m = required_float(record, "VALUE_ALTI_MAX")
    if not math.isclose(horizontal_min_m, horizontal_max_m, abs_tol=1e-12):
        raise ValueError("Horizontal metadata range is not a single project accuracy value")
    if not math.isclose(vertical_min_m, vertical_max_m, abs_tol=1e-12):
        raise ValueError("Vertical metadata range is not a single project accuracy value")

    horizontal_description = str(record.get("MEASURE_DESCRIPTION_PLANI_EN") or "")
    vertical_description = str(record.get("MEASURE_DESCRIPTION_ALTI_EN") or "")
    if "Root Mean Square Error" not in horizontal_description or "radial" not in horizontal_description:
        raise ValueError("Horizontal metric is not explicitly described as radial RMSE")
    if "95% confidence level" not in vertical_description:
        raise ValueError("Vertical metric is not explicitly described at 95 percent confidence")

    horizontal_95_m = horizontal_max_m * HORIZONTAL_RMSER_TO_95
    horizontal_95_ft = horizontal_95_m * METRES_TO_FEET
    vertical_95_ft = vertical_max_m * METRES_TO_FEET
    gates = {
        "sourceHorizontalAccuracy": {
            "metricKind": "radial-rmse",
            "reportedMetres": horizontal_max_m,
            "normalDistributionConversionTo95": HORIZONTAL_RMSER_TO_95,
            "computed95Metres": horizontal_95_m,
            "computed95Ft": horizontal_95_ft,
            "thresholdFt": args.horizontal_threshold_ft,
            "pass": horizontal_95_ft <= args.horizontal_threshold_ft,
            "standardUrl": STANDARD_URL,
        },
        "sourceVerticalAccuracy": {
            "metricKind": "non-vegetated-95-percent-confidence",
            "reportedMetres": vertical_max_m,
            "computed95Ft": vertical_95_ft,
            "thresholdFt": args.vertical_threshold_ft,
            "pass": vertical_95_ft <= args.vertical_threshold_ft,
        },
    }
    fingerprint_input = {
        "analysisVersion": ANALYSIS_VERSION,
        "sourceManifestArtifactVersion": manifest["artifactVersion"],
        "projectId": args.project_id,
        "metadataArchiveSha256": metadata_archive["verifiedSha256"],
        "productSpecificationSha256": product_specification["verifiedSha256"],
        "record": record,
        "gates": gates,
    }
    blockers = [
        "STADIUM_LOCAL_REGISTRATION_NOT_PASSED",
        "ORIENTATION_ACCURACY_NOT_PASSED",
        "ROW_AND_OBSTRUCTION_GEOMETRY_NOT_VALIDATED",
        "SOURCE_CURRENCY_NOT_VERIFIED",
        "SHADOW_HOLDOUT_NOT_PASSED",
    ]
    if not gates["sourceHorizontalAccuracy"]["pass"]:
        blockers.insert(0, "SOURCE_HORIZONTAL_ACCURACY_EXCEEDS_1FT")
    if not gates["sourceVerticalAccuracy"]["pass"]:
        blockers.insert(0, "SOURCE_VERTICAL_ACCURACY_EXCEEDS_1FT")
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "nrcan-canelevation-project-metadata-extract",
        "analysisVersion": ANALYSIS_VERSION,
        "artifactVersion": f"sha256:{fingerprint(fingerprint_input)}",
        "sourceManifestArtifactVersion": manifest["artifactVersion"],
        "stadiumId": manifest["stadiumId"],
        "projectName": manifest["projectName"],
        "projectId": args.project_id,
        "inputs": {
            "manifest": str(args.manifest),
            "metadataArchive": {
                "path": str(metadata_archive["path"]),
                "sha256": metadata_archive["verifiedSha256"],
            },
            "productSpecification": {
                "path": str(product_specification["path"]),
                "sha256": product_specification["verifiedSha256"],
            },
            "federalGuidelineUrl": STANDARD_URL,
        },
        "record": record,
        "gates": gates,
        "limitations": [
            "Accuracy values are project-level, not stadium-local registration control.",
            "The horizontal 95 percent value assumes the normal error distribution required by the federal guideline.",
            "A source-accuracy pass cannot establish current rows, roof state, obstruction completeness, or shadow accuracy.",
        ],
        "publication": {"eligible": False, "blockers": blockers},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "projectId": args.project_id,
        "gates": gates,
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

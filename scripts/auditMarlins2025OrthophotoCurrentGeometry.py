#!/usr/bin/env python3
"""Audit the official 2025 Miami-Dade orthophoto for Marlins geometry claims.

The producer metadata, source raster, and a checksum-locked visual review are
kept separate. Dataset-wide plan accuracy is not promoted to roof-edge or row
accuracy because the producer documents manual correction of elevated features
and the closed roof hides the seating bowl.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from datetime import datetime
from pathlib import Path
from typing import Any
import xml.etree.ElementTree as ET

from PIL import Image


ANALYSIS_VERSION = "marlins-2025-orthophoto-current-geometry-audit-v1"
EXPECTED_SERVICE_URL = (
    "https://imageserverintra.miamidade.gov/arcgis/rest/services/"
    "WGS1984_WebMercator/2025_Woolpert_WGS1984_WebMercator/ImageServer"
)
EXPECTED_ACQUISITION_DATES = [
    "2024-12-21",
    "2024-12-22",
    "2025-01-04",
    "2025-01-07",
    "2025-01-08",
]
MAXIMUM_HORIZONTAL_ACCURACY_95_FEET = 1.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_artifact_version(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def require_equal(actual: Any, expected: Any, label: str) -> None:
    if actual != expected:
        raise ValueError(f"{label}: expected {expected!r}, received {actual!r}")


def element_texts(root: ET.Element, tag: str) -> list[str]:
    return [
        (element.text or "").strip()
        for element in root.iter(tag)
        if (element.text or "").strip()
    ]


def parse_acquisition_dates(abstract: str) -> list[str]:
    match = re.search(
        r"imagery was acquired on the following dates:\s*(.+?)\.\s*This data",
        abstract,
        flags=re.IGNORECASE,
    )
    if not match:
        raise ValueError("Metadata lacks the explicit imagery acquisition-date list")
    date_text = match.group(1)
    values = re.findall(
        r"(?:January|February|March|April|May|June|July|August|September|"
        r"October|November|December)\s+[0-9]{1,2},\s+[0-9]{4}",
        date_text,
    )
    if not values:
        raise ValueError("Metadata acquisition-date list contains no complete dates")
    parsed = [
        datetime.strptime(value, "%B %d, %Y").date().isoformat()
        for value in values
    ]
    return parsed


def parse_horizontal_accuracy(statement: str) -> dict[str, float | int | bool]:
    target = re.search(
        r"meet a horizontal accuracy of\s+([0-9.]+)\s+feet\s+at the\s+"
        r"([0-9.]+)%\s+confidence interval",
        statement,
        flags=re.IGNORECASE,
    )
    actual = re.search(
        r"actual horizontal accuracy was\s+([0-9.]+)\s+feet,\s+tested over\s+"
        r"([0-9]+)\s+independent surveyed check points",
        statement,
        flags=re.IGNORECASE,
    )
    if not target or not actual:
        raise ValueError("Metadata lacks the explicit independent horizontal-accuracy statement")
    target_feet = float(target.group(1))
    confidence_percent = float(target.group(2))
    actual_feet = float(actual.group(1))
    checkpoint_count = int(actual.group(2))
    if not (
        target_feet > 0
        and actual_feet > 0
        and checkpoint_count >= 3
        and math.isclose(confidence_percent, 95.0, abs_tol=1e-12)
    ):
        raise ValueError("Metadata horizontal-accuracy values are invalid")
    return {
        "targetHorizontalAccuracy95Feet": target_feet,
        "actualHorizontalAccuracy95Feet": actual_feet,
        "confidencePercent": confidence_percent,
        "independentSurveyedCheckpointCount": checkpoint_count,
        "independenceExplicitlyStated": True,
    }


def parse_metadata(path: Path) -> dict[str, Any]:
    root = ET.parse(path).getroot()
    abstracts = element_texts(root, "idAbs")
    accuracy_statements = element_texts(root, "conExpl")
    processing_statements = element_texts(root, "measDesc")
    process_steps = element_texts(root, "stepDesc")
    production_dates = element_texts(root, "stepDateTm")
    if len(abstracts) != 1 or len(accuracy_statements) != 1:
        raise ValueError("Metadata does not contain one unambiguous abstract and accuracy statement")
    acquisition_dates = parse_acquisition_dates(abstracts[0])
    accuracy = parse_horizontal_accuracy(accuracy_statements[0])
    processing = " ".join(processing_statements)
    manual_fixes = " ".join(process_steps)
    if "Leica" not in processing or "HxMap" not in processing:
        raise ValueError("Metadata lacks the expected camera and processing lineage")
    elevated_fix_documented = all(
        token in manual_fixes
        for token in (
            "Manual Mosaic Fixes",
            "elevated features fixes",
            "smoothed) DEM surface",
            "anchored into place",
            "MiamiDade2025_3in_Edit_Regions_Areas.shp",
        )
    )
    if not elevated_fix_documented:
        raise ValueError("Metadata lacks the expected elevated-feature correction warning")
    return {
        "projectDescription": abstracts[0],
        "acquisitionDates": acquisition_dates,
        "cameraAndProcessingStatement": processing,
        "accuracyStatement": accuracy_statements[0],
        "horizontalAccuracy": accuracy,
        "manualMosaicFixStatement": manual_fixes,
        "elevatedFeatureManualFixesDocumented": elevated_fix_documented,
        "productionDates": production_dates,
        "embeddedCheckpointCoordinatesAvailable": element_texts(root, "chkPtAv") == ["1"],
        "transformParametersAvailable": element_texts(root, "tranParaAv") == ["1"],
    }


def verify_mosaic(manifest_path: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = manifest_path.read_bytes()
    manifest = json.loads(raw)
    require_equal(
        manifest.get("artifactKind"),
        "official-native-orthophoto-mosaic",
        "mosaic artifact kind",
    )
    require_equal(manifest.get("stadiumId"), "marlins", "mosaic stadium")
    source = manifest.get("source", {})
    raster = manifest.get("raster", {})
    require_equal(source.get("serviceUrl"), EXPECTED_SERVICE_URL, "mosaic service")
    require_equal(source.get("objectId"), 7219, "mosaic object ID")
    require_equal(source.get("itemName"), "2025_318449O_RGBN", "mosaic item name")
    require_equal(raster.get("coordinateReferenceSystem"), "EPSG:6438", "mosaic CRS")
    if not (
        math.isclose(float(raster.get("pixelSizeX", 0)), 0.25, abs_tol=1e-12)
        and math.isclose(float(raster.get("pixelSizeY", 0)), 0.25, abs_tol=1e-12)
    ):
        raise ValueError("Mosaic is not at the documented 0.25-foot pixel size")
    raster_path = Path(raster["path"])
    metadata_path = Path(source["itemMetadataPath"])
    require_equal(sha256_file(raster_path), raster.get("sha256"), "mosaic raster SHA-256")
    require_equal(
        sha256_file(metadata_path),
        source.get("itemMetadataSha256"),
        "mosaic metadata SHA-256",
    )
    with Image.open(raster_path) as image:
        dimensions = list(image.size)
    require_equal(dimensions, raster.get("dimensionsPixels"), "mosaic dimensions")
    return manifest, {
        "path": str(manifest_path),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "artifactVersion": manifest.get("artifactVersion"),
        "rasterPath": str(raster_path),
        "rasterSha256": raster.get("sha256"),
        "itemMetadataPath": str(metadata_path),
        "itemMetadataSha256": source.get("itemMetadataSha256"),
        "serviceUrl": source.get("serviceUrl"),
        "objectId": source.get("objectId"),
        "itemName": source.get("itemName"),
        "coordinateReferenceSystem": raster.get("coordinateReferenceSystem"),
        "pixelSizeFeet": raster.get("pixelSizeX"),
        "dimensionsPixels": dimensions,
        "extent": raster.get("extent"),
    }


def verify_controls(
    controls_path: Path,
    mosaic: dict[str, Any],
    mosaic_lock: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    raw = controls_path.read_bytes()
    controls = json.loads(raw)
    require_equal(
        controls.get("artifactKind"),
        "marlins-2025-orthophoto-manual-geometry-review-controls",
        "review controls kind",
    )
    require_equal(controls.get("stadiumId"), "marlins", "review controls stadium")
    lock = controls.get("sourceLock", {})
    require_equal(lock.get("mosaicManifestPath"), mosaic_lock["path"], "review mosaic path")
    require_equal(lock.get("mosaicManifestSha256"), mosaic_lock["sha256"], "review mosaic hash")
    require_equal(
        lock.get("mosaicArtifactVersion"),
        mosaic.get("artifactVersion"),
        "review mosaic artifact version",
    )
    require_equal(lock.get("rasterPath"), mosaic_lock["rasterPath"], "review raster path")
    require_equal(lock.get("rasterSha256"), mosaic_lock["rasterSha256"], "review raster hash")
    require_equal(
        lock.get("itemMetadataPath"),
        mosaic_lock["itemMetadataPath"],
        "review metadata path",
    )
    require_equal(
        lock.get("itemMetadataSha256"),
        mosaic_lock["itemMetadataSha256"],
        "review metadata hash",
    )
    require_equal(
        controls.get("reviewProcedure", {}).get("completeRasterReviewed"),
        True,
        "complete raster review",
    )
    require_equal(
        controls.get("reviewProcedure", {}).get("nativeRasterDimensionsPixels"),
        mosaic_lock["dimensionsPixels"],
        "review raster dimensions",
    )
    return controls, {
        "path": str(controls_path),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "controlVersion": controls.get("controlVersion"),
    }


def build_audit(manifest_path: Path, controls_path: Path) -> dict[str, Any]:
    mosaic, mosaic_lock = verify_mosaic(manifest_path)
    controls, controls_lock = verify_controls(controls_path, mosaic, mosaic_lock)
    metadata_path = Path(mosaic_lock["itemMetadataPath"])
    metadata = parse_metadata(metadata_path)
    require_equal(
        metadata["acquisitionDates"],
        EXPECTED_ACQUISITION_DATES,
        "published acquisition dates",
    )
    accuracy = metadata["horizontalAccuracy"]
    dataset_plan_frame_accepted = (
        accuracy["independenceExplicitlyStated"]
        and accuracy["actualHorizontalAccuracy95Feet"]
        <= MAXIMUM_HORIZONTAL_ACCURACY_95_FEET
    )
    observations = controls["observations"]
    claims = controls["claimBoundary"]
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "assessedOn": "2026-08-11",
        "inputs": {
            "mosaic": mosaic_lock,
            "manualReviewControls": controls_lock,
        },
        "sourceMetadata": {
            "acquisitionDates": metadata["acquisitionDates"],
            "tileSpecificAcquisitionDateEstablished": False,
            "tileSpecificAcquisitionTimeEstablished": False,
            "productionDates": metadata["productionDates"],
            "cameraSystem": "Leica DMC-4H",
            "processingSystem": "Leica HxMap and OrthoVista",
            "horizontalAccuracy": accuracy,
            "embeddedCheckpointCoordinatesAvailable": metadata[
                "embeddedCheckpointCoordinatesAvailable"
            ],
            "transformParametersAvailable": metadata["transformParametersAvailable"],
            "elevatedFeatureManualFixesDocumented": metadata[
                "elevatedFeatureManualFixesDocumented"
            ],
            "elevatedFeatureCorrectionPolygonFilename": (
                "MiamiDade2025_3in_Edit_Regions_Areas.shp"
            ),
            "elevatedFeatureCorrectionPolygonsAcquired": False,
        },
        "visualReview": {
            "completeRasterReviewed": controls["reviewProcedure"]["completeRasterReviewed"],
            "fullStadiumEnvelopeReviewed": controls["reviewProcedure"][
                "fullStadiumEnvelopeReviewed"
            ],
            "observations": observations,
        },
        "accuracyAssessment": {
            "maximumHorizontalAccuracy95Feet": MAXIMUM_HORIZONTAL_ACCURACY_95_FEET,
            "officialDatasetPlanFrameAccepted": dataset_plan_frame_accepted,
            "officialDatasetHorizontalAccuracy95Feet": accuracy[
                "actualHorizontalAccuracy95Feet"
            ],
            "roofTopEdgeMetricMeasurementAccepted": False,
            "roofTopEdgeAccuracy95Feet": None,
            "reason": (
                "The dataset-wide plan frame passes the one-foot gate using 61 "
                "explicitly independent surveyed checkpoints. Roof-edge accuracy is "
                "not promoted because the producer documents separate manual fixes "
                "for elevated features and the correction polygons were not acquired."
            ),
        },
        "geometryBoundary": {
            "establishesOfficialDatasetPlanFrameWithinOneFootAt95Percent": (
                dataset_plan_frame_accepted
            ),
            "establishesClosedRoofVisualStateWithinPublishedAcquisitionDateSet": (
                claims["establishesClosedRoofVisualStateWithinPublishedAcquisitionDateSet"]
            ),
            "establishesCurrentRowPersistence": claims[
                "establishesCurrentRowPersistence"
            ],
            "establishesMetricSeatOrRowGeometry": claims[
                "establishesMetricSeatOrRowGeometry"
            ],
            "establishesMetricRoofHeight": claims["establishesMetricRoofHeight"],
            "establishesRoofUndersideGeometry": claims[
                "establishesRoofUndersideGeometry"
            ],
            "establishesCompletePanelShape": claims[
                "establishesCompletePanelShape"
            ],
            "establishesExactShadowTimestamp": claims[
                "establishesExactShadowTimestamp"
            ],
            "eligibleAsIndependentShadeHoldout": claims[
                "eligibleAsIndependentShadeHoldout"
            ],
        },
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                "ELEVATED_FEATURE_CORRECTION_POLYGONS_NOT_ACQUIRED",
                "ROOF_TOP_EDGE_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT",
                "ORTHOPHOTO_IS_TWO_DIMENSIONAL",
                "SEATING_BOWL_HIDDEN_BY_CLOSED_ROOF",
                "ROOF_UNDERSIDES_NOT_VISIBLE",
                "TILE_SPECIFIC_ACQUISITION_DATE_NOT_ESTABLISHED",
                "SOURCE_ACQUISITION_TIME_NOT_ESTABLISHED_WITHIN_THIRTY_SECONDS",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    return {
        "schemaVersion": 1,
        "artifactKind": "marlins-2025-orthophoto-current-geometry-audit",
        "artifactVersion": stable_artifact_version(stable),
        **stable,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--manifest",
        type=Path,
        default=Path("tmp/lidar/marlins-2025-woolpert-orthophoto-native.json"),
    )
    parser.add_argument(
        "--controls",
        type=Path,
        default=Path("scripts/marlins_2025_orthophoto_review_controls.json"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(
            "tmp/lidar/marlins-2025-orthophoto-current-geometry-audit-v1-2026.json"
        ),
    )
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_audit(arguments.manifest, arguments.controls)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "accuracyAssessment": artifact["accuracyAssessment"],
        "geometryBoundary": artifact["geometryBoundary"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

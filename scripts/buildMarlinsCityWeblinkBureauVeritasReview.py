#!/usr/bin/env python3
"""Lock and review the official 2010 Marlins Bureau Veritas record set."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from pypdf import PdfReader


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: object) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def require_contains(value: str, expected: str, label: str) -> None:
    if expected.lower() not in value.lower():
        raise ValueError(f"{label} is missing required text: {expected}")


def read_json(path: Path) -> tuple[dict[str, Any], bytes]:
    bytes_value = path.read_bytes()
    return json.loads(bytes_value), bytes_value


def relative(path: Path) -> str:
    return str(path.resolve().relative_to(Path.cwd().resolve()))


def extract_pdf_text(pdf_path: Path) -> list[dict[str, object]]:
    reader = PdfReader(pdf_path)
    pages: list[dict[str, object]] = []
    for page_number, page in enumerate(reader.pages, 1):
        text = normalize_text(page.extract_text() or "")
        pages.append({
            "pageNumber": page_number,
            "characterCount": len(text),
            "normalizedTextSha256": sha256_bytes(text.encode("utf-8")),
            "text": text,
        })
    return pages


def lock_render_manifest(
    manifest_path: Path,
    expected_pdf_path: Path,
    expected_pdf_sha256: str,
) -> dict[str, object]:
    manifest, manifest_bytes = read_json(manifest_path)
    if manifest.get("analysisVersion") != "pdf-review-render-v1":
        raise ValueError(f"Unexpected render manifest kind: {manifest_path}")
    if manifest.get("source", {}).get("sha256") != expected_pdf_sha256:
        raise ValueError(f"Render source checksum mismatch: {manifest_path}")
    if Path(manifest["source"]["path"]).resolve() != expected_pdf_path.resolve():
        raise ValueError(f"Render source path mismatch: {manifest_path}")
    if manifest.get("pageCount") != manifest.get("sourcePageCount"):
        raise ValueError(f"Render is not complete: {manifest_path}")
    if manifest.get("renderedPageRange") != [1, manifest.get("sourcePageCount")]:
        raise ValueError(f"Render page range is not complete: {manifest_path}")

    locked_pages: list[dict[str, object]] = []
    for page_record in manifest.get("pages", []):
        page_path = Path(page_record["path"]).resolve()
        if sha256_file(page_path) != page_record["sha256"]:
            raise ValueError(f"Rendered page checksum mismatch: {page_path}")
        locked_pages.append({
            "pageNumber": page_record["pageNumber"],
            "path": relative(page_path),
            "sha256": page_record["sha256"],
            "width": page_record["width"],
            "height": page_record["height"],
        })

    locked_contact_sheets: list[dict[str, object]] = []
    for sheet_record in manifest.get("contactSheets", []):
        sheet_path = Path(sheet_record["path"]).resolve()
        if sha256_file(sheet_path) != sheet_record["sha256"]:
            raise ValueError(f"Contact-sheet checksum mismatch: {sheet_path}")
        locked_contact_sheets.append({
            "firstPage": sheet_record["firstPage"],
            "lastPage": sheet_record["lastPage"],
            "path": relative(sheet_path),
            "sha256": sheet_record["sha256"],
        })

    return {
        "manifest": {
            "path": relative(manifest_path),
            "sha256": sha256_bytes(manifest_bytes),
            "artifactVersion": manifest["artifactVersion"],
        },
        "lockedPages": locked_pages,
        "lockedContactSheets": locked_contact_sheets,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--index",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-bureau-veritas-2010/manifest.json"),
    )
    parser.add_argument(
        "--acquisition",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-bureau-veritas-documents-2010/manifest.json"),
    )
    parser.add_argument(
        "--render-directory",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-bureau-veritas-review-2026"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-bureau-veritas-review-2026.json"),
    )
    arguments = parser.parse_args()

    index_path = arguments.index.resolve()
    acquisition_path = arguments.acquisition.resolve()
    render_directory = arguments.render_directory.resolve()
    output_path = arguments.output.resolve()
    index, index_bytes = read_json(index_path)
    acquisition, acquisition_bytes = read_json(acquisition_path)
    if index.get("artifactKind") != "marlins-city-weblink-bureau-veritas-index":
        raise ValueError("Unexpected City Bureau Veritas index")
    if acquisition.get("artifactKind") != "marlins-city-weblink-bureau-veritas-document-acquisition":
        raise ValueError("Unexpected City Bureau Veritas document acquisition")
    if index.get("source", {}).get("fileId") != "10-00847":
        raise ValueError("Unexpected City file ID")
    if index.get("source", {}).get("expectedResolution") != "R-10-0335":
        raise ValueError("Unexpected City resolution")
    if index.get("search", {}).get("exactDocumentCount") != 8:
        raise ValueError("Expected 8 exact City documents")
    if index.get("recordSummary", {}).get("totalDocumentPages") != 46:
        raise ValueError("Expected 46 exact City document pages")

    reviewed_documents: list[dict[str, object]] = []
    for document in acquisition["acquiredDocuments"]:
        pdf_record = document["inputs"]["pdf"]
        pdf_path = Path(pdf_record["path"]).resolve()
        if sha256_file(pdf_path) != pdf_record["sha256"]:
            raise ValueError(f"Document PDF checksum mismatch: {pdf_path}")
        page_text = extract_pdf_text(pdf_path)
        if len(page_text) != document["pageCount"]:
            raise ValueError(f"Document PDF page-count mismatch: {pdf_path}")
        render_manifest_path = render_directory / pdf_path.stem / "manifest.json"
        render_lock = lock_render_manifest(
            render_manifest_path,
            pdf_path,
            pdf_record["sha256"],
        )
        reviewed_documents.append({
            "entryId": document["entryId"],
            "name": document["name"],
            "pdf": pdf_record,
            "pageText": page_text,
            "renderReview": render_lock,
        })

    reviewed_by_entry_id = {
        record["entryId"]: record for record in reviewed_documents
    }
    exhibit_pages = reviewed_by_entry_id[1208381]["pageText"]
    legislation_pages = reviewed_by_entry_id[1208382]["pageText"]
    resolution_pages = reviewed_by_entry_id[1208386]["pageText"]
    require_contains(
        exhibit_pages[2]["text"],
        "Health and Human Risk Assessment and Soil Management Plan Preparation Services",
        "exhibit page 3",
    )
    require_contains(
        exhibit_pages[7]["text"],
        "All tracings, plans, drawings, specifications, maps, computer files",
        "exhibit page 8",
    )
    require_contains(
        exhibit_pages[7]["text"],
        "prepared or obtained under this Agreement",
        "exhibit page 8",
    )
    require_contains(
        exhibit_pages[16]["text"],
        "surface parking lots and the parking garages",
        "exhibit page 17",
    )
    require_contains(
        exhibit_pages[26]["text"],
        "Construction Worker Risk Assessment",
        "exhibit page 27",
    )
    require_contains(
        exhibit_pages[26]["text"],
        "surface parking lots and Parking Garages",
        "exhibit page 27",
    )
    require_contains(
        exhibit_pages[30]["text"],
        "A scaled site plan depicting the location and depth of soil",
        "exhibit page 31",
    )
    require_contains(
        exhibit_pages[31]["text"],
        "field notes and photographs describing soil management activities",
        "exhibit page 32",
    )
    require_contains(
        exhibit_pages[31]["text"],
        "will not be responsible for any excavation",
        "exhibit page 32",
    )
    require_contains(
        exhibit_pages[31]["text"],
        "or site surveying",
        "exhibit page 32",
    )
    require_contains(
        legislation_pages[0]["text"],
        "surface parking lots and parking garages",
        "legislation page 1",
    )
    require_contains(
        resolution_pages[0]["text"],
        "surface parking lots and parking garages",
        "resolution page 1",
    )

    stable = {
        "analysisVersion": "marlins-city-weblink-bureau-veritas-review-v1",
        "stadiumId": "marlins",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "index": {
                "path": relative(index_path),
                "sha256": sha256_bytes(index_bytes),
                "artifactVersion": index["artifactVersion"],
            },
            "acquisition": {
                "path": relative(acquisition_path),
                "sha256": sha256_bytes(acquisition_bytes),
                "artifactVersion": acquisition["artifactVersion"],
            },
            "reviewedDocuments": reviewed_documents,
        },
        "reviewScope": {
            "officialFileId": "10-00847",
            "officialResolution": "R-10-0335",
            "recordStatus": "Final",
            "exactCityRecordCount": index["search"]["exactRecordCount"],
            "exactCityDocumentCount": index["search"]["exactDocumentCount"],
            "exactCityDocumentPageCount": index["recordSummary"]["totalDocumentPages"],
            "documentsReviewed": len(reviewed_documents),
            "pagesReviewed": sum(len(record["pageText"]) for record in reviewed_documents),
            "contactSheetsReviewed": sum(
                len(record["renderReview"]["lockedContactSheets"])
                for record in reviewed_documents
            ),
            "reviewStatus": "complete-for-geometry-and-records-custody-scope",
        },
        "consultantScope": {
            "projectName": "Marlins Stadium Site Parking",
            "capitalImprovementProject": "B-30648",
            "serviceCategory": "Health and Human Risk Assessment and Soil Management Plan Preparation and Implementation Services",
            "physicalProjectScope": [
                "Surface parking lots",
                "Parking garages",
                "Soil locations W1, W3, and P1 through P4",
            ],
            "services": [
                "Construction-worker health and human risk assessment for contaminated soil exposure",
                "Hazard-communication update and site-specific safety training",
                "Air monitoring during initial earthwork activities",
                "Soil-management-plan preparation",
                "Environmental oversight of soil-management-plan implementation",
                "Soil-management report preparation",
            ],
            "deliverables": [
                "Health and human risk assessment report",
                "Hazard-communication training module and written supplement",
                "Air-monitoring report with field observations",
                "Soil management plan using scaled site-plan inputs",
                "Weekly electronic progress reports",
                "Field notes and photographs of soil-management activities",
                "Soil management report with figures, tables, field notes, photographs, and supporting documents",
            ],
            "siteSurveyingExplicitlyExcludedFromConsultantScope": True,
            "constructionActivitiesExplicitlyPerformedByOthers": True,
            "containsStadiumBowlDesignServices": False,
            "containsSeatingRowDesignServices": False,
            "containsRetractableRoofDesignServices": False,
            "containsArchitecturalRecordDrawingServices": False,
        },
        "recordsCustodyFindings": {
            "agreementMakesConsultantPreparedOrObtainedScopeDocumentsCityProperty": True,
            "agreementIncludesHardCopyAndElectronicDigitalCopies": True,
            "agreementRequiresDeliveryWithinTenDaysOfCityRequestOrCancellation": True,
            "agreementRecordsClauseIsLimitedToDocumentsPreparedOrObtainedUnderThisAgreement": True,
            "establishesCityCustodyOfEnvironmentalAndSoilManagementDeliverables": True,
            "establishesCityCustodyOfStadiumArchitecturalRecordDrawings": False,
            "establishesCityCustodyOfSeatingBowlAsBuiltDrawings": False,
            "establishesCityCustodyOfRetractableRoofAsBuiltDrawings": False,
            "note": "The generic ownership language cannot be expanded beyond the parking-lot and parking-garage environmental scope stated in Attachment A and the incorporated proposals.",
        },
        "geometryFindings": {
            "referencesScaledSitePlansForSoilExcavationStockpilingAndFinalPlacement": True,
            "scaledSitePlansAreInputsOrEnvironmentalDeliverables": True,
            "containsScaledSitePlansInThisOfficialFile": False,
            "containsStadiumBowlFloorPlan": False,
            "containsStadiumSeatingRowPlan": False,
            "containsStadiumBuildingSection": False,
            "containsStadiumRowElevationSchedule": False,
            "containsStadiumRetractableRoofPlan": False,
            "containsStadiumRoofUndersideGeometry": False,
            "containsConstructionAsBuiltStadiumGeometry": False,
            "containsCurrentStadiumGeometry": False,
        },
        "geometryBoundary": {
            "establishesOfficialConsultantScope": True,
            "establishesConsultantRecordsOwnershipTerms": True,
            "establishesParkingEnvironmentalRecordRoute": True,
            "establishesStadiumArchitecturalRecordRoute": False,
            "establishesConstructionAsBuiltStadiumGeometry": False,
            "establishesCurrentStadiumGeometry": False,
            "establishesCurrentMeasuredRowGeometry": False,
            "establishesCurrentRoofUndersideGeometry": False,
            "establishesCompletePostConstructionChangeInventory": False,
            "establishesIndependentShadowValidation": False,
        },
        "recordsRequestImpact": {
            "excludeBureauVeritasEnvironmentalFileAsStadiumBowlGeometrySource": True,
            "doNotInferArchitecturalCustodyFromGenericDocumentOwnershipClause": True,
            "requestProjectB30648OnlyIfParkingSoilOrSiteEnvironmentalRecordsBecomeNecessary": True,
            "continueRequestForStadiumSpecificPermittedIfcFieldRevisedRecordAndAsBuiltSets": True,
            "note": "This complete official file closes a false architectural-record lead. It does not replace the missing constructed or current stadium geometry records.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "BUREAU_VERITAS_SCOPE_ONLY_ADDRESSES_PARKING_ENVIRONMENTAL_WORK",
                "CONSTRUCTION_AS_BUILT_STADIUM_GEOMETRY_NOT_ESTABLISHED",
                "CURRENT_STADIUM_CHANGE_INVENTORY_NOT_ESTABLISHED",
                "CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED",
                "CURRENT_ROOF_UNDERSIDE_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-city-weblink-bureau-veritas-review",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": relative(output_path),
        "artifactVersion": artifact["artifactVersion"],
        "reviewScope": artifact["reviewScope"],
        "consultantScope": artifact["consultantScope"],
        "recordsCustodyFindings": artifact["recordsCustodyFindings"],
        "geometryFindings": artifact["geometryFindings"],
        "geometryBoundary": artifact["geometryBoundary"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

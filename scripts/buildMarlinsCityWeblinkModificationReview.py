#!/usr/bin/env python3
"""Lock and review the official 2010 Marlins substantial-modification record set."""

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


def require_contains_compact(value: str, expected: str, label: str) -> None:
    compact_value = re.sub(r"[^a-z0-9]+", "", value.lower())
    compact_expected = re.sub(r"[^a-z0-9]+", "", expected.lower())
    if compact_expected not in compact_value:
        raise ValueError(f"{label} is missing required compact text: {expected}")


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
        default=Path("tmp/lidar/marlins-city-weblink-substantial-modification-2010/manifest.json"),
    )
    parser.add_argument(
        "--plans-acquisition",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-substantial-modification-plans-2010/manifest.json"),
    )
    parser.add_argument(
        "--plans-render",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-substantial-modification-plan-review-render-2026/manifest.json"),
    )
    parser.add_argument(
        "--support-acquisition",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-substantial-modification-support-2010/manifest.json"),
    )
    parser.add_argument(
        "--support-render-directory",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-substantial-modification-support-review-2026"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("tmp/lidar/marlins-city-weblink-substantial-modification-review-2026.json"),
    )
    arguments = parser.parse_args()

    index_path = arguments.index.resolve()
    plans_acquisition_path = arguments.plans_acquisition.resolve()
    plans_render_path = arguments.plans_render.resolve()
    support_acquisition_path = arguments.support_acquisition.resolve()
    support_render_directory = arguments.support_render_directory.resolve()
    output_path = arguments.output.resolve()

    index, index_bytes = read_json(index_path)
    plans_acquisition, plans_acquisition_bytes = read_json(plans_acquisition_path)
    support_acquisition, support_acquisition_bytes = read_json(support_acquisition_path)
    if index.get("artifactKind") != "marlins-city-weblink-substantial-modification-index":
        raise ValueError("Unexpected City substantial-modification index")
    if plans_acquisition.get("artifactKind") != "marlins-city-weblink-substantial-modification-plan-acquisition":
        raise ValueError("Unexpected City substantial-modification plan acquisition")
    if support_acquisition.get("artifactKind") != "marlins-city-weblink-substantial-modification-support-acquisition":
        raise ValueError("Unexpected City substantial-modification support acquisition")
    if index.get("source", {}).get("fileId") != "09-00141mm":
        raise ValueError("Unexpected City substantial-modification file ID")
    if index.get("source", {}).get("expectedResolution") != "R-10-0058":
        raise ValueError("Unexpected City substantial-modification resolution")
    if index.get("search", {}).get("exactDocumentCount") != 29:
        raise ValueError("Expected 29 exact City documents")
    if index.get("recordSummary", {}).get("totalDocumentPages") != 299:
        raise ValueError("Expected 299 exact City document pages")

    plan_pdf_record = plans_acquisition["inputs"]["designDevelopmentPlans"]
    plan_pdf_path = Path(plan_pdf_record["path"]).resolve()
    if sha256_file(plan_pdf_path) != plan_pdf_record["sha256"]:
        raise ValueError("Substantial-modification plan PDF checksum mismatch")
    plan_pages = extract_pdf_text(plan_pdf_path)
    if len(plan_pages) != 25:
        raise ValueError("Expected 25 substantial-modification plan pages")
    plan_render_lock = lock_render_manifest(
        plans_render_path,
        plan_pdf_path,
        plan_pdf_record["sha256"],
    )

    support_documents: list[dict[str, object]] = []
    for document in support_acquisition["acquiredDocuments"]:
        pdf_record = document["inputs"]["pdf"]
        pdf_path = Path(pdf_record["path"]).resolve()
        if sha256_file(pdf_path) != pdf_record["sha256"]:
            raise ValueError(f"Support PDF checksum mismatch: {pdf_path}")
        page_text = extract_pdf_text(pdf_path)
        if len(page_text) != document["pageCount"]:
            raise ValueError(f"Support PDF page-count mismatch: {pdf_path}")
        render_manifest_path = support_render_directory / pdf_path.stem / "manifest.json"
        render_lock = lock_render_manifest(
            render_manifest_path,
            pdf_path,
            pdf_record["sha256"],
        )
        support_documents.append({
            "entryId": document["entryId"],
            "name": document["name"],
            "pdf": pdf_record,
            "pageText": page_text,
            "renderReview": render_lock,
        })

    support_by_entry_id = {record["entryId"]: record for record in support_documents}
    analysis_pages = support_by_entry_id[1204724]["pageText"]
    letter_pages = support_by_entry_id[1204736]["pageText"]
    table_pages = support_by_entry_id[1204750]["pageText"]
    zoning_pages = support_by_entry_id[1204740]["pageText"]

    analysis_page_1 = analysis_pages[0]["text"]
    analysis_page_3 = analysis_pages[2]["text"]
    analysis_page_5 = analysis_pages[4]["text"]
    analysis_page_7 = analysis_pages[6]["text"]
    require_contains(analysis_page_1, "Reducing the Accessory Retail Space", "analysis page 1")
    require_contains(analysis_page_1, "To provide 5,735 off-street parking spaces", "analysis page 1")
    require_contains(analysis_page_1, "increase in height of the parking garage structure", "analysis page 1")
    require_contains(analysis_page_1, "photovoltaic array systems", "analysis page 1")
    require_contains(analysis_page_1, "communication antenna tower", "analysis page 1")
    require_contains(analysis_page_1, "possible uses for the liners", "analysis page 1")
    require_contains(
        analysis_page_3,
        "do not affect the approved maximum height of the proposed complex",
        "analysis page 3",
    )
    require_contains(
        analysis_page_5,
        "referred exclusively to Substantial Modification",
        "analysis page 5",
    )
    require_contains(analysis_page_5, "project in the parking garages", "analysis page 5")
    require_contains(analysis_page_7, "project in the parking garages", "analysis page 7")
    require_contains(letter_pages[0]["text"], "Marlins Stadium Site Parking Project", "letter page 1")
    require_contains_compact(
        zoning_pages[0]["text"],
        "increase in height of the parking garage",
        "zoning analysis",
    )
    require_contains(table_pages[1]["text"], "P1 Floor Plans", "table of contents page 2")
    require_contains(table_pages[1]["text"], "P4 Comprehensive Elevations", "table of contents page 2")
    require_contains(plan_pages[0]["text"], "STADIUM SITE PARKING", "plan cover")
    if any(page["characterCount"] == 0 for page in plan_pages):
        raise ValueError("Every visually reviewed plan page must contain extracted text")

    stable = {
        "analysisVersion": "marlins-city-weblink-substantial-modification-review-v1",
        "stadiumId": "marlins",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "index": {
                "path": relative(index_path),
                "sha256": sha256_bytes(index_bytes),
                "artifactVersion": index["artifactVersion"],
            },
            "planAcquisition": {
                "path": relative(plans_acquisition_path),
                "sha256": sha256_bytes(plans_acquisition_bytes),
                "artifactVersion": plans_acquisition["artifactVersion"],
            },
            "planPdf": plan_pdf_record,
            "planRenderReview": plan_render_lock,
            "supportAcquisition": {
                "path": relative(support_acquisition_path),
                "sha256": sha256_bytes(support_acquisition_bytes),
                "artifactVersion": support_acquisition["artifactVersion"],
            },
            "supportDocuments": support_documents,
        },
        "reviewScope": {
            "exactCityRecordCount": index["search"]["exactRecordCount"],
            "exactCityDocumentCount": index["search"]["exactDocumentCount"],
            "exactCityDocumentPageCount": index["recordSummary"]["totalDocumentPages"],
            "detailedSupportDocumentsReviewed": len(support_documents),
            "detailedSupportPagesReviewed": sum(
                len(record["pageText"]) for record in support_documents
            ),
            "planPagesReviewed": len(plan_pages),
            "planContactSheetsReviewed": len(plan_render_lock["lockedContactSheets"]),
            "supportContactSheetsReviewed": sum(
                len(record["renderReview"]["lockedContactSheets"])
                for record in support_documents
            ),
            "reviewStatus": "complete-for-geometry-relevant-modification-scope",
        },
        "modificationScope": {
            "officialApprovalFileId": "09-00141mm",
            "officialResolution": "R-10-0058",
            "recordStatus": "Final",
            "approvedScopeItems": [
                "Reduce accessory retail area from approximately 61,678 to 53,629 square feet.",
                "Change provided parking to 5,735 spaces, including 4,831 structured and 904 interim surface spaces.",
                "Increase the heights of parking-garage structures on Tracts A and D.",
                "Allow photovoltaic arrays covering up to 60 percent of the four garage roofs.",
                "Allow a 30-to-45-foot City communication antenna on one garage roof.",
                "Allow residential or educational uses in the garage liners with corresponding floor-plan and exterior-elevation flexibility.",
            ],
            "analysisExplicitlyLimitsConditionsToParkingGarages": True,
            "analysisStatesOtherOriginalMuspConditionsRemainInForce": True,
            "analysisStatesGarageHeightChangesDoNotAffectApprovedRetractableRoofMaximumHeight": True,
            "modifiesStadiumSeatingBowlGeometry": False,
            "modifiesStadiumRetractableRoofGeometry": False,
            "modifiesStadiumRowElevations": False,
            "modifiesStadiumRoofUnderside": False,
        },
        "planSetFindings": {
            "entryId": 1204749,
            "entryName": "Section B. Design Development Plans",
            "coverProjectName": "Stadium Site Parking",
            "pageCount": 25,
            "sheetGroups": [
                {
                    "pdfPages": [1],
                    "content": "City Stadium Site Parking cover and project index.",
                },
                {
                    "pdfPages": [2, 5],
                    "content": "Parking-boundary and topographic survey sheets.",
                },
                {
                    "pdfPages": [6, 7],
                    "content": "Site key plan and zoning-information summary with the baseball stadium as contextual Tract C.",
                },
                {
                    "pdfPages": [8, 19],
                    "content": "Parking garages P1 through P4 floor and roof plans.",
                },
                {
                    "pdfPages": [20, 21],
                    "content": "Pre-game and post-game site circulation plans.",
                },
                {
                    "pdfPages": [22, 25],
                    "content": "Parking garages P1 through P4 comprehensive elevations.",
                },
            ],
            "containsStadiumBowlFloorPlan": False,
            "containsStadiumSeatingRowPlan": False,
            "containsStadiumBuildingSection": False,
            "containsStadiumRowElevationSchedule": False,
            "containsStadiumRetractableRoofPlan": False,
            "containsStadiumRoofUndersideGeometry": False,
            "stadiumFootprintShownOnlyAsSiteContext": True,
        },
        "geometryBoundary": {
            "establishesOfficial2010ApprovalScope": True,
            "establishes2010ApprovalDidNotModifyStadiumBowlOrRetractableRoofGeometry": True,
            "establishesConstructionAsBuiltGeometry": False,
            "establishesCurrentGeometry": False,
            "establishesCurrentMeasuredRowGeometry": False,
            "establishesCurrentRoofUndersideGeometry": False,
            "establishesCompletePostConstructionChangeInventory": False,
            "establishesIndependentShadowValidation": False,
        },
        "recordsRequestImpact": {
            "exclude2010ParkingGarageMuspPlansFromStadiumBowlGeometryRequest": True,
            "requestOriginalMuspOmittedSurveySheetS6": True,
            "requestSupersedingStadiumPermittedIfcFieldRevisedRecordAndAsBuiltSets": True,
            "requestStadiumSpecificChangeLogsAndTransmittalsAfterOriginalMusp": True,
            "note": "The 2010 substantial-modification set narrows one official approval branch to parking garages. It does not replace the missing constructed or current stadium geometry records.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "2010_MODIFICATION_SET_ONLY_ADDRESSES_STADIUM_SITE_PARKING",
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
        "artifactKind": "marlins-city-weblink-substantial-modification-review",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": relative(output_path),
        "artifactVersion": artifact["artifactVersion"],
        "reviewScope": artifact["reviewScope"],
        "modificationScope": artifact["modificationScope"],
        "planSetFindings": artifact["planSetFindings"],
        "geometryBoundary": artifact["geometryBoundary"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

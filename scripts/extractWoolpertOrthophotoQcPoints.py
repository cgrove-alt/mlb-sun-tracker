#!/usr/bin/env python3
"""Extract Woolpert's surveyed imagery QC points from its signed report."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any

from pypdf import PdfReader


ANALYSIS_VERSION = "woolpert-orthophoto-qc-control-report-v1"
QC_ROW = re.compile(
    r"^(?P<star>\*)?(?P<point>8\d{3}_2019_FL)\s+"
    r"N(?P<lat_degrees>\d+)°(?P<lat_minutes>\d+)'(?P<lat_seconds>[\d.]+)\"\s+"
    r"W(?P<lon_degrees>\d+)°(?P<lon_minutes>\d+)'(?P<lon_seconds>[\d.]+)\"\s+"
    r"(?P<values>.+)$"
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def decimal_degrees(degrees: str, minutes: str, seconds: str, sign: int) -> float:
    return sign * (
        int(degrees) + int(minutes) / 60.0 + float(seconds) / 3600.0
    )


def parse_fixed_three_decimal_values(value: str) -> list[float]:
    tokens = value.split()
    normalized: list[str] = []
    index = 0
    while index < len(tokens):
        token = tokens[index]
        if "." not in token:
            if index + 1 < len(tokens) and tokens[index + 1].startswith("."):
                index += 1
                token += tokens[index]
            else:
                raise ValueError(f"Coordinate value lacks a decimal point: {token}")
        fractional_digits = len(token.split(".", 1)[1])
        while fractional_digits < 3:
            index += 1
            if index >= len(tokens) or not tokens[index].isdigit():
                raise ValueError(f"Could not restore split decimal value: {token}")
            needed = 3 - fractional_digits
            fragment = tokens[index]
            if len(fragment) != needed:
                raise ValueError(f"Unexpected split decimal fragment: {fragment}")
            token += fragment
            fractional_digits = 3
        if fractional_digits != 3:
            raise ValueError(f"Coordinate value does not have three decimals: {token}")
        normalized.append(token)
        index += 1
    return [float(token) for token in normalized]


def parse_qc_rows(text: str, pdf_page: int) -> list[dict[str, Any]]:
    controls: list[dict[str, Any]] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        match = QC_ROW.match(line)
        if not match:
            continue
        numbers = parse_fixed_three_decimal_values(match.group("values"))
        if len(numbers) != 7:
            raise ValueError(
                f"Expected seven coordinate values for {match.group('point')}, "
                f"found {len(numbers)}"
            )
        point_number = int(match.group("point")[:4])
        recovery_page = 113 + 2 * (point_number - 8001)
        controls.append({
            "pointId": match.group("point"),
            "reportRole": "SURVEYED IMAGERY PERMANENT QC POINT",
            "outsideSurveyTolerance": bool(match.group("star")),
            "latitudeLongitude": [
                decimal_degrees(
                    match.group("lat_degrees"),
                    match.group("lat_minutes"),
                    match.group("lat_seconds"),
                    1,
                ),
                decimal_degrees(
                    match.group("lon_degrees"),
                    match.group("lon_minutes"),
                    match.group("lon_seconds"),
                    -1,
                ),
            ],
            "ellipsoidHeightMetres": numbers[0],
            "projectedCoordinateUsSurveyFeet": {
                "northing": numbers[1],
                "easting": numbers[2],
                "orthometricHeight": numbers[3],
            },
            "projectedCoordinateMetres": {
                "northing": numbers[4],
                "easting": numbers[5],
                "orthometricHeight": numbers[6],
            },
            "sourcePages": {
                "coordinateTablePdfPage": pdf_page,
                "recoveryPhotoPdfPage": recovery_page,
                "observationLogPdfPage": recovery_page + 1,
            },
        })
    return controls


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--stadium-id", default="marlins")
    parser.add_argument("--center-easting-feet", type=float, required=True)
    parser.add_argument("--center-northing-feet", type=float, required=True)
    parser.add_argument("--review-radius-feet", type=float, default=30_500.0)
    args = parser.parse_args()
    if args.review_radius_feet <= 0:
        raise ValueError("Review radius must be positive")

    report_path = args.report.resolve()
    reader = PdfReader(report_path)
    if len(reader.pages) < 242:
        raise ValueError("Survey report is missing expected recovery-log pages")
    project_text = reader.pages[40].extract_text() or ""
    qc_page_texts = {
        51: reader.pages[50].extract_text() or "",
        52: reader.pages[51].extract_text() or "",
    }
    if "SURVEYED IMAGERY PERMANENT QC POINTS" not in qc_page_texts[51]:
        raise ValueError("QC role heading is missing from PDF page 51")
    required_project_phrases = [
        "93 photo identifiable control points and vertical check",
        "horizontal limit of 0.04 feet",
        "NAD 83 (2011) Epoch 2010.000",
        "Florida East (0901)",
    ]
    missing = [phrase for phrase in required_project_phrases if phrase not in project_text]
    if missing:
        raise ValueError(f"Survey methodology text is missing: {missing}")

    controls = [
        control
        for pdf_page, text in qc_page_texts.items()
        for control in parse_qc_rows(text, pdf_page)
    ]
    expected_ids = [f"{point}_2019_FL" for point in range(8001, 8066)]
    actual_ids = [control["pointId"] for control in controls]
    if actual_ids != expected_ids:
        raise ValueError("Did not extract the complete ordered 8001 through 8065 QC set")

    rmseh_limit_feet = 0.04
    radial_95_multiplier = 1.7308
    conservative_horizontal_95_feet = rmseh_limit_feet * radial_95_multiplier
    for control in controls:
        coordinate = control["projectedCoordinateUsSurveyFeet"]
        distance = math.hypot(
            coordinate["easting"] - args.center_easting_feet,
            coordinate["northing"] - args.center_northing_feet,
        )
        control["distanceFromStadiumCenterFeet"] = distance
        control["horizontalAccuracy95Feet"] = (
            None if control["outsideSurveyTolerance"]
            else conservative_horizontal_95_feet
        )
        control["insideReviewRadius"] = distance <= args.review_radius_feet
        control["controlEligibility"] = {
            "eligibleForVisualReview": (
                not control["outsideSurveyTolerance"]
                and distance <= args.review_radius_feet
            ),
            "blockers": [
                *(
                    ["SURVEY_POINT_OUTSIDE_REPORTED_RMSE_LIMIT"]
                    if control["outsideSurveyTolerance"] else []
                ),
                *(
                    ["SURVEY_POINT_OUTSIDE_REVIEW_RADIUS"]
                    if distance > args.review_radius_feet else []
                ),
            ],
        }

    report_sha256 = sha256_file(report_path)
    selected = [
        control for control in controls
        if control["controlEligibility"]["eligibleForVisualReview"]
    ]
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": args.stadium_id,
        "source": {
            "provider": "Woolpert, Inc.",
            "reportPath": str(report_path.relative_to(Path.cwd())),
            "reportSha256": report_sha256,
            "reportTitle": "Surveyors Report, Miami-Dade County, Florida, Ortho Photo Control",
            "reportDate": "2021-01-04",
            "signedCertificationDate": "2020-02-11",
            "methodologyPdfPage": 41,
            "qcCoordinateTablePdfPages": [51, 52],
            "coordinateReferenceSystem": "NAD83(2011) epoch 2010.000, Florida East 0901, US survey feet",
        },
        "surveyAccuracy": {
            "reportedHorizontalLimitRmsehFeet": rmseh_limit_feet,
            "radial95Multiplier": radial_95_multiplier,
            "conservativeHorizontalAccuracy95Feet": conservative_horizontal_95_feet,
            "reportedVerticalLimitRmsezFeet": 0.05,
            "observationProtocol": "dual observations at different times and satellite constellations, ten epochs per occupation",
        },
        "roleSemantics": {
            "reportSeparatesQcPointsFromTemporaryAndPermanentControlPoints": True,
            "qcHeading": "SURVEYED IMAGERY PERMANENT QC POINTS",
            "explicitStatementQcPointsWereExcludedFromOrthophotoAdjustment": False,
        },
        "stadiumCenterProjectedFeet": [
            args.center_easting_feet,
            args.center_northing_feet,
        ],
        "reviewRadiusFeet": args.review_radius_feet,
        "controlCount": len(controls),
        "eligibleVisualReviewCount": len(selected),
        "controls": controls,
        "eligibleVisualReviewControls": selected,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "woolpert-orthophoto-qc-control-report",
        "artifactVersion": stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesSurveyedQcCoordinates": True,
            "establishesReleasedOrthophotoPixelCorrespondences": False,
            "establishesProducerIndependentCheckpointRole": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "QC_POINT_PIXEL_CORRESPONDENCES_NOT_REVIEWED",
                "ORTHOPHOTO_CONTROL_RESIDUALS_NOT_COMPUTED",
                "QC_POINT_EXCLUSION_FROM_ORTHOPHOTO_ADJUSTMENT_NOT_EXPLICIT",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "controlCount": artifact["controlCount"],
        "eligibleVisualReviewCount": artifact["eligibleVisualReviewCount"],
        "eligiblePointIds": [control["pointId"] for control in selected],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Acquire NOAA NGS survey-mark candidates near a stadium.

The NGS Data Explorer API supplies survey-mark positions and two-dimensional
network-accuracy values. Its API metadata does not declare the accuracy unit,
so this acquisition artifact preserves the raw value but cannot use it as a
numeric release uncertainty until the authoritative datasheet confirms units.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import hashlib
import json
import math
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from pyproj import CRS, Transformer
from pyproj.exceptions import ProjError


ANALYSIS_VERSION = "ngs-orthophoto-control-acquisition-v1"
NDE_RADIAL_URL = "https://geodesy.noaa.gov/api/nde/radial"
NDE_META_URL = "https://geodesy.noaa.gov/api/nde/meta"
NDE_DOCUMENTATION_URL = "https://www.ngs.noaa.gov/web_services/data-explorer.shtml"
NGS_POSITION_ACCURACY_URL = "https://www.ngs.noaa.gov/marks/descriptors.shtml"
NGS_PASSIVE_MARK_URL = "https://geodesy.noaa.gov/datasheets/passive-marks/index.html"
TARGET_CRS = 6428
INTERNATIONAL_FEET_PER_METRE = 3.280839895013123


@dataclass(frozen=True)
class DatumMapping:
    source_epsg: int
    normalized_name: str


DATUM_MAPPINGS = {
    "NAD 83(2011)": DatumMapping(6318, "NAD83(2011)"),
    "NAD_83(2011)": DatumMapping(6318, "NAD83(2011)"),
    "NAD83(2011)": DatumMapping(6318, "NAD83(2011)"),
    "NAD 83(NSRS2007)": DatumMapping(4759, "NAD83(NSRS2007)"),
    "NAD_83(NSRS2007)": DatumMapping(4759, "NAD83(NSRS2007)"),
    "NAD83(NSRS2007)": DatumMapping(4759, "NAD83(NSRS2007)"),
    "NAD 83(CORS96)": DatumMapping(6783, "NAD83(CORS96)"),
    "NAD_83(CORS96)": DatumMapping(6783, "NAD83(CORS96)"),
    "NAD83(CORS96)": DatumMapping(6783, "NAD83(CORS96)"),
    "NAD 83(1986)": DatumMapping(4269, "NAD83(1986)"),
    "NAD_83(1986)": DatumMapping(4269, "NAD83(1986)"),
    "NAD83(1986)": DatumMapping(4269, "NAD83(1986)"),
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def build_url(base: str, parameters: dict[str, str]) -> str:
    return f"{base}?{urlencode(parameters)}"


def fetch_bytes(url: str) -> tuple[bytes, dict[str, str | int | None]]:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "mlb-sun-tracker-ngs-control-audit/1.0",
        },
    )
    with urlopen(request, timeout=60) as response:
        value = response.read()
        metadata: dict[str, str | int | None] = {
            "requestedUrl": url,
            "resolvedUrl": response.geturl(),
            "status": response.status,
            "contentType": response.headers.get("Content-Type"),
            "contentLength": response.headers.get("Content-Length"),
            "etag": response.headers.get("ETag"),
            "lastModified": response.headers.get("Last-Modified"),
        }
    return value, metadata


def parse_json(value: bytes, source_name: str) -> Any:
    try:
        return json.loads(value)
    except json.JSONDecodeError as error:
        raise ValueError(f"{source_name} did not return JSON") from error


def validate_metadata(metadata: dict[str, Any]) -> None:
    expected = {
        "lat": "Latitude, in decimal degrees, positive north of the equator",
        "lon": "Longitude in decimal degrees; negative west of the prime meridian",
        "netAccHz": "Network accuracy for horizontal, 2-sigma in 2-dimensions",
        "posDatum": "A synonym for Reference Frame",
        "posSource": "Source of Horizontal Position ",
    }
    for field, description in expected.items():
        if metadata.get(field) != description:
            raise ValueError(f"NGS metadata changed for {field}")


def parse_optional_float(value: Any) -> float | None:
    if value is None or str(value).strip() == "":
        return None
    parsed = float(value)
    if not math.isfinite(parsed):
        raise ValueError("Numeric NGS field is not finite")
    return parsed


def haversine_distance_feet(
    first_latitude: float,
    first_longitude: float,
    second_latitude: float,
    second_longitude: float,
) -> float:
    radius_metres = 6_371_008.8
    first_latitude_radians = math.radians(first_latitude)
    second_latitude_radians = math.radians(second_latitude)
    latitude_delta = math.radians(second_latitude - first_latitude)
    longitude_delta = math.radians(second_longitude - first_longitude)
    a = (
        math.sin(latitude_delta / 2.0) ** 2
        + math.cos(first_latitude_radians)
        * math.cos(second_latitude_radians)
        * math.sin(longitude_delta / 2.0) ** 2
    )
    metres = 2.0 * radius_metres * math.asin(min(1.0, math.sqrt(a)))
    return metres * INTERNATIONAL_FEET_PER_METRE


def datum_mapping(value: Any) -> DatumMapping | None:
    return DATUM_MAPPINGS.get(str(value).strip())


def project_candidate(
    latitude: float,
    longitude: float,
    mapping: DatumMapping,
    target_crs: int = TARGET_CRS,
) -> dict[str, Any]:
    target = CRS.from_epsg(target_crs)
    if not target.axis_info:
        raise ValueError("Target CRS does not declare a horizontal unit")
    target_unit_name = str(target.axis_info[0].unit_name)
    target_unit_to_metres = float(target.axis_info[0].unit_conversion_factor)
    if not math.isfinite(target_unit_to_metres) or target_unit_to_metres <= 0:
        raise ValueError("Target CRS horizontal unit conversion is unavailable")
    transformer = Transformer.from_crs(
        CRS.from_epsg(mapping.source_epsg),
        target,
        always_xy=True,
        allow_ballpark=False,
    )
    x, y = transformer.transform(longitude, latitude)
    if not math.isfinite(x) or not math.isfinite(y):
        raise ValueError("NGS coordinate transformation did not produce finite coordinates")
    accuracy_metres = transformer.accuracy
    accuracy_feet = (
        float(accuracy_metres) * INTERNATIONAL_FEET_PER_METRE
        if accuracy_metres is not None and accuracy_metres >= 0
        else None
    )
    result = {
        "sourceCoordinateReferenceSystem": f"EPSG:{mapping.source_epsg}",
        "sourceDatumRealization": mapping.normalized_name,
        "targetCoordinateReferenceSystem": f"EPSG:{target_crs}",
        "targetProjectedCoordinate": [float(x), float(y)],
        "targetHorizontalUnit": target_unit_name,
        "targetHorizontalUnitToMetres": target_unit_to_metres,
        "transformDescription": transformer.description,
        "transformAccuracyMetres": (
            float(accuracy_metres)
            if accuracy_metres is not None and accuracy_metres >= 0
            else None
        ),
        "transformAccuracyFeet": accuracy_feet,
        "transformAccuracyNumericallyReported": accuracy_feet is not None,
    }
    if "foot" in target_unit_name.lower():
        result["targetProjectedCoordinateFeet"] = [float(x), float(y)]
    return result


def candidate_from_mark(
    mark: dict[str, Any],
    center_latitude: float,
    center_longitude: float,
    radius_feet: float,
    target_crs: int = TARGET_CRS,
) -> dict[str, Any]:
    pid = str(mark.get("pid", "")).strip()
    if len(pid) != 6 or not pid.isalnum():
        raise ValueError(f"Invalid NGS PID: {pid}")
    latitude = parse_optional_float(mark.get("lat"))
    longitude = parse_optional_float(mark.get("lon"))
    if latitude is None or longitude is None:
        raise ValueError(f"NGS mark {pid} lacks numeric latitude or longitude")
    distance_feet = haversine_distance_feet(
        center_latitude,
        center_longitude,
        latitude,
        longitude,
    )
    if distance_feet > radius_feet + 0.01:
        raise ValueError(f"NGS mark {pid} falls outside the requested radius")
    mapping = datum_mapping(mark.get("posDatum"))
    projection = None
    projection_error = None
    if mapping is not None:
        try:
            projection = project_candidate(latitude, longitude, mapping, target_crs)
        except (ProjError, ValueError) as error:
            projection_error = str(error)
    network_accuracy_raw = parse_optional_float(mark.get("netAccHz"))
    position_source = str(mark.get("posSource", "")).strip()
    condition = str(mark.get("condition", "")).strip().upper()
    blockers: list[str] = []
    if position_source != "ADJUSTED":
        blockers.append("NGS_POSITION_SOURCE_NOT_ADJUSTED")
    if network_accuracy_raw is None or network_accuracy_raw <= 0:
        blockers.append("NGS_HORIZONTAL_NETWORK_ACCURACY_MISSING")
    else:
        blockers.append("NGS_HORIZONTAL_NETWORK_ACCURACY_UNIT_REQUIRES_DATASHEET")
    if mapping is None:
        blockers.append("NGS_POSITION_DATUM_REALIZATION_UNSUPPORTED")
    elif projection is None:
        blockers.append("NGS_TO_ORTHOPHOTO_TRANSFORM_UNAVAILABLE")
    elif not projection["transformAccuracyNumericallyReported"]:
        blockers.append("NGS_TO_ORTHOPHOTO_TRANSFORM_ACCURACY_UNREPORTED")
    elif (
        projection is not None
        and projection["transformAccuracyFeet"] is not None
        and projection["transformAccuracyFeet"] > 1.0
    ):
        blockers.append("NGS_TO_ORTHOPHOTO_TRANSFORM_ACCURACY_EXCEEDS_ONE_FOOT")
    if condition != "GOOD":
        blockers.append("NGS_MARK_CONDITION_NOT_GOOD")
    if not str(mark.get("lastRecovered", "")).strip():
        blockers.append("NGS_MARK_RECOVERY_DATE_MISSING")
    return {
        "pid": pid,
        "name": mark.get("name"),
        "latitudeLongitude": [latitude, longitude],
        "distanceFromStadiumCenterFeet": distance_feet,
        "positionDatum": mark.get("posDatum"),
        "positionSource": position_source,
        "networkHorizontalAccuracyRaw": network_accuracy_raw,
        "networkHorizontalAccuracyReportedAsTwoSigma2d": network_accuracy_raw is not None,
        "networkHorizontalAccuracyUnitEstablished": False,
        "lastRecovered": mark.get("lastRecovered"),
        "lastRecoveredBy": mark.get("lastRecoveredBy"),
        "condition": mark.get("condition"),
        "monumentType": mark.get("monumentType"),
        "setting": mark.get("setting"),
        "stamping": mark.get("stamping"),
        "projection": projection,
        "projectionError": projection_error,
        "officialRecordUrls": {
            "passiveMark": build_url(NGS_PASSIVE_MARK_URL, {"PID": pid}),
            "ndePid": build_url("https://geodesy.noaa.gov/api/nde/pid", {"pid": pid}),
        },
        "controlEligibility": {
            "eligible": len(blockers) == 0,
            "blockers": blockers,
        },
    }


def validate_marks_response(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        raise ValueError("NGS radial response is not a JSON array")
    seen: set[str] = set()
    for mark in value:
        if not isinstance(mark, dict):
            raise ValueError("NGS radial response contains a non-object mark")
        pid = str(mark.get("pid", "")).strip()
        if pid in seen:
            raise ValueError(f"NGS radial response contains duplicate PID {pid}")
        seen.add(pid)
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--latitude", type=float, required=True)
    parser.add_argument("--longitude", type=float, required=True)
    parser.add_argument("--radius-feet", type=float, required=True)
    parser.add_argument("--target-crs", type=int, default=TARGET_CRS)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    if not all(math.isfinite(value) for value in (
        args.latitude,
        args.longitude,
        args.radius_feet,
    )):
        raise ValueError("Search coordinates and radius must be finite")
    if not -90 <= args.latitude <= 90 or not -180 <= args.longitude <= 180:
        raise ValueError("Search latitude or longitude is out of range")
    if args.radius_feet <= 0:
        raise ValueError("Search radius must be positive")
    try:
        target_crs = CRS.from_epsg(args.target_crs)
    except ProjError as error:
        raise ValueError(f"Target CRS EPSG:{args.target_crs} is unavailable") from error
    if not target_crs.is_projected:
        raise ValueError("Target CRS must be projected")

    radial_url = build_url(NDE_RADIAL_URL, {
        "lat": f"{args.latitude:.10f}",
        "lon": f"{args.longitude:.10f}",
        "radius": f"{args.radius_feet:.3f}",
        "units": "FOOT",
    })
    meta_bytes, meta_request = fetch_bytes(NDE_META_URL)
    radial_bytes, radial_request = fetch_bytes(radial_url)
    metadata = parse_json(meta_bytes, "NGS metadata")
    if not isinstance(metadata, dict):
        raise ValueError("NGS metadata is not a JSON object")
    validate_metadata(metadata)
    marks = validate_marks_response(parse_json(radial_bytes, "NGS radial query"))
    candidates = [
        candidate_from_mark(
            mark,
            args.latitude,
            args.longitude,
            args.radius_feet,
            args.target_crs,
        )
        for mark in marks
    ]

    args.output_dir.mkdir(parents=True, exist_ok=True)
    meta_path = args.output_dir / "nde-meta.json"
    radial_path = args.output_dir / "nde-radial.json"
    meta_path.write_bytes(meta_bytes)
    radial_path.write_bytes(radial_bytes)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": args.stadium_id,
        "source": {
            "agency": "NOAA National Geodetic Survey",
            "apiDocumentationUrl": NDE_DOCUMENTATION_URL,
            "positionAccuracyExplanationUrl": NGS_POSITION_ACCURACY_URL,
            "apiMetadataUrl": NDE_META_URL,
            "radialQueryUrl": radial_url,
        },
        "query": {
            "centerLatitudeLongitude": [args.latitude, args.longitude],
            "radiusFeet": args.radius_feet,
            "targetCoordinateReferenceSystem": f"EPSG:{args.target_crs}",
            "targetHorizontalUnit": target_crs.axis_info[0].unit_name,
            "targetHorizontalUnitToMetres": target_crs.axis_info[0].unit_conversion_factor,
        },
        "requests": {
            "metadata": {
                **meta_request,
                "sha256": sha256_bytes(meta_bytes),
                "localPath": str(meta_path.resolve()),
            },
            "radial": {
                **radial_request,
                "sha256": sha256_bytes(radial_bytes),
                "localPath": str(radial_path.resolve()),
            },
        },
        "markCount": len(marks),
        "candidates": candidates,
    }
    eligible = [
        candidate for candidate in candidates
        if candidate["controlEligibility"]["eligible"]
    ]
    blockers = [
        "NGS_MARK_DATASHEETS_NOT_CHECKSUM_LOCKED",
        "NGS_MARKS_NOT_VISUALLY_MATCHED_TO_ORTHOPHOTO",
        "NGS_ORTHOPHOTO_CONTROL_RESIDUALS_NOT_COMPUTED",
    ]
    if not candidates:
        blockers.append("NO_NGS_MARKS_INSIDE_SEARCH_RADIUS")
    if not eligible:
        blockers.append("NO_NGS_MARK_PASSES_ACQUISITION_CONTROL_GATES")
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ngs-orthophoto-control-acquisition",
        "artifactVersion": f"sha256:{stable_sha256(stable)}",
        **stable,
        "geometryBoundary": {
            "establishesOfficialSurveyMarkCandidates": bool(candidates),
            "establishesNumeric95PercentHorizontalAccuracy": False,
            "establishesVisibleOrthophotoCorrespondences": False,
            "establishesOrthophotoTranslationOrRotation": False,
            "note": (
                "The NGS API metadata calls netAccHz a two-dimensional 2-sigma value "
                "but does not declare its unit. Each authoritative datasheet must be "
                "checksum locked before the raw value can become a numeric uncertainty."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": blockers,
        },
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "markCount": len(marks),
        "acquisitionEligibleCandidateCount": len(eligible),
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

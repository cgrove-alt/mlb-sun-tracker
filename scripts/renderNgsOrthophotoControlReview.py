#!/usr/bin/env python3
"""Render NOAA NGS survey controls on checksum-locked orthophoto tiles.

The reticle is only the predicted survey coordinate. A reviewer must identify
the physical monument in the source pixels before the point can be accepted as
an orthophoto registration control.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw


ANALYSIS_VERSION = "ngs-orthophoto-control-review-queue-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def source_pixel_from_world(
    x: float,
    y: float,
    world_values: list[float],
) -> tuple[float, float]:
    pixel_width, row_rotation, column_rotation, pixel_height, origin_x, origin_y = (
        float(value) for value in world_values
    )
    if row_rotation != 0 or column_rotation != 0:
        raise ValueError("Rotated world files are not supported")
    if pixel_width <= 0 or pixel_height >= 0:
        raise ValueError("Orthophoto must be north-up")
    return (x - origin_x) / pixel_width, (y - origin_y) / pixel_height


def scaled_pixel_center(coordinate: float, scale: int) -> float:
    """Map a source pixel-center coordinate into a nearest-scaled image."""
    if scale <= 0:
        raise ValueError("Scale must be positive")
    return (coordinate + 0.5) * scale - 0.5


def draw_reticle(
    image: Image.Image,
    center_x: float,
    center_y: float,
    scale: int,
    gap_source_pixels: int,
) -> Image.Image:
    review = image.resize(
        (image.width * scale, image.height * scale),
        Image.Resampling.NEAREST,
    )
    draw = ImageDraw.Draw(review)
    # World-file coordinates locate pixel centers. After nearest-neighbour
    # enlargement, source pixel center 0 is at (scale / 2) - 0.5, not 0.
    x = scaled_pixel_center(center_x, scale)
    y = scaled_pixel_center(center_y, scale)
    gap = gap_source_pixels * scale
    colour = (255, 0, 200)
    width = max(2, scale // 2)
    draw.line((x, 0, x, max(0, y - gap)), fill=colour, width=width)
    draw.line(
        (x, min(review.height - 1, y + gap), x, review.height - 1),
        fill=colour,
        width=width,
    )
    draw.line((0, y, max(0, x - gap), y), fill=colour, width=width)
    draw.line(
        (min(review.width - 1, x + gap), y, review.width - 1, y),
        fill=colour,
        width=width,
    )
    return review


def draw_pixel_grid_detail(
    image: Image.Image,
    center_x: float,
    center_y: float,
    half_size_pixels: int,
    scale: int,
    gap_source_pixels: int,
) -> tuple[Image.Image, dict[str, int]]:
    nearest_x = int(round(center_x))
    nearest_y = int(round(center_y))
    left = nearest_x - half_size_pixels
    top = nearest_y - half_size_pixels
    right = nearest_x + half_size_pixels + 1
    bottom = nearest_y + half_size_pixels + 1
    if left < 0 or top < 0 or right > image.width or bottom > image.height:
        raise ValueError("Pixel-grid detail window falls outside the review chip")
    detail_chip = image.crop((left, top, right, bottom))
    detail = detail_chip.resize(
        (detail_chip.width * scale, detail_chip.height * scale),
        Image.Resampling.NEAREST,
    )
    draw = ImageDraw.Draw(detail)
    grid_colour = (70, 70, 70)
    for column in range(1, detail_chip.width):
        x = column * scale - 1
        draw.line((x, 0, x, detail.height - 1), fill=grid_colour, width=1)
    for row in range(1, detail_chip.height):
        y = row * scale - 1
        draw.line((0, y, detail.width - 1, y), fill=grid_colour, width=1)
    local_x = center_x - left
    local_y = center_y - top
    x = scaled_pixel_center(local_x, scale)
    y = scaled_pixel_center(local_y, scale)
    gap = gap_source_pixels * scale
    reticle_colour = (255, 0, 200)
    width = max(2, scale // 8)
    draw.line((x, 0, x, max(0, y - gap)), fill=reticle_colour, width=width)
    draw.line(
        (x, min(detail.height - 1, y + gap), x, detail.height - 1),
        fill=reticle_colour,
        width=width,
    )
    draw.line((0, y, max(0, x - gap), y), fill=reticle_colour, width=width)
    draw.line(
        (min(detail.width - 1, x + gap), y, detail.width - 1, y),
        fill=reticle_colour,
        width=width,
    )
    return detail, {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom,
    }


def load_orthophoto(path: Path) -> dict[str, Any]:
    raw = path.read_bytes()
    value = json.loads(raw)
    artifact_kind = value.get("artifactKind")
    if artifact_kind == "drcog-orthophoto-tile-acquisition":
        world_values = value.get("worldFile", {}).get("values")
        image_path = Path(value["localFiles"]["orthophoto"])
        expected_image_sha256 = value["orthophoto"]["sha256"]
        width = int(value["tiff"]["widthPixels"])
        height = int(value["tiff"]["heightPixels"])
        tile = value.get("record", {}).get("attributes", {}).get("tile")
        coordinate_reference_system = None
    elif artifact_kind == "official-arcgis-orthophoto-export":
        export = value.get("export", {})
        extent = export.get("extent", {})
        width = int(export["width"])
        height = int(export["height"])
        pixel_width = float(export["pixelSizeX"])
        pixel_height = float(export["pixelSizeY"])
        if not math.isclose(pixel_width, pixel_height, rel_tol=0, abs_tol=1e-12):
            raise ValueError("ArcGIS orthophoto pixels must be square")
        # ArcGIS export extents describe the outer raster boundary. World-file
        # origins describe the centre of the upper-left pixel.
        world_values = [
            pixel_width,
            0.0,
            0.0,
            -pixel_height,
            float(extent["xmin"]) + pixel_width / 2.0,
            float(extent["ymax"]) - pixel_height / 2.0,
        ]
        image_path = Path(value["localImagePath"])
        expected_image_sha256 = export["sha256"]
        tile = None
        coordinate_reference_system = export.get("coordinateReferenceSystem")
    else:
        raise ValueError(f"Orthophoto manifest has the wrong artifact kind: {path}")
    if not isinstance(world_values, list) or len(world_values) != 6:
        raise ValueError(f"Orthophoto manifest lacks a six-value world file: {path}")
    pixel_width = float(world_values[0])
    pixel_height = float(world_values[3])
    if not math.isclose(pixel_width, -pixel_height, rel_tol=0, abs_tol=1e-12):
        raise ValueError("Orthophoto pixels must be square")
    image_sha256 = sha256_file(image_path)
    if image_sha256 != expected_image_sha256:
        raise ValueError(f"Orthophoto hash mismatch: {image_path}")
    with Image.open(image_path) as image:
        if image.size != (width, height):
            raise ValueError(
                f"Orthophoto dimensions do not match the manifest: {image_path}"
            )
    return {
        "manifestPath": str(path.resolve()),
        "manifestSha256": hashlib.sha256(raw).hexdigest(),
        "artifactVersion": value.get("artifactVersion"),
        "artifactKind": artifact_kind,
        "tile": tile,
        "coordinateReferenceSystem": coordinate_reference_system,
        "worldFileValues": [float(item) for item in world_values],
        "pixelSizeNativeUnits": pixel_width,
        "pixelSizeFeet": pixel_width if artifact_kind == "drcog-orthophoto-tile-acquisition" else None,
        "imagePath": str(image_path.resolve()),
        "imageSha256": image_sha256,
        "widthPixels": width,
        "heightPixels": height,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--datasheet-manifest", type=Path, required=True)
    parser.add_argument(
        "--orthophoto-manifest",
        type=Path,
        action="append",
        required=True,
    )
    parser.add_argument("--output-dir", type=Path, required=True)
    review_extent = parser.add_mutually_exclusive_group()
    review_extent.add_argument("--half-size-feet", type=float)
    review_extent.add_argument("--half-size-native-units", type=float)
    parser.add_argument("--scale", type=int, default=6)
    parser.add_argument("--reticle-gap-pixels", type=int, default=5)
    parser.add_argument("--detail-half-size-pixels", type=int, default=12)
    parser.add_argument("--detail-scale", type=int, default=24)
    args = parser.parse_args()
    if (
        (args.half_size_feet is not None and args.half_size_feet <= 0)
        or (
            args.half_size_native_units is not None
            and args.half_size_native_units <= 0
        )
        or args.scale <= 0
        or args.reticle_gap_pixels < 0
        or args.detail_half_size_pixels <= 0
        or args.detail_scale <= 0
    ):
        raise ValueError("Review dimensions and scale must be valid")

    datasheet_bytes = args.datasheet_manifest.read_bytes()
    datasheets = json.loads(datasheet_bytes)
    control_manifest_kind = datasheets.get("artifactKind")
    if control_manifest_kind not in {
        "ngs-datasheet-horizontal-accuracy-evidence",
        "woolpert-orthophoto-qc-control-report",
    }:
        raise ValueError("Control manifest has the wrong artifact kind")
    orthophotos = [load_orthophoto(path) for path in args.orthophoto_manifest]
    pixel_sizes = {record["pixelSizeNativeUnits"] for record in orthophotos}
    if len(pixel_sizes) != 1:
        raise ValueError("Orthophoto tiles do not share one pixel size")
    pixel_size = float(next(iter(pixel_sizes)))
    if args.half_size_native_units is not None:
        half_size_native_units = args.half_size_native_units
        review_extent_semantics = "caller-declared orthophoto native horizontal units"
    else:
        half_size_native_units = args.half_size_feet or 15.0
        review_extent_semantics = "feet for legacy DRCOG and survey-QC inputs"
    half_pixels = math.ceil(half_size_native_units / pixel_size)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    if control_manifest_kind == "ngs-datasheet-horizontal-accuracy-evidence":
        eligible_records = [
            record
            for record in datasheets.get("records", [])
            if record.get("controlEligibilityAfterDatasheet", {}).get("eligible") is True
        ]
    else:
        eligible_records = [
            {
                "pid": control["pointId"],
                "candidate": {
                    "name": control["pointId"],
                    "projection": {
                        "targetProjectedCoordinateFeet": [
                            control["projectedCoordinateUsSurveyFeet"]["easting"],
                            control["projectedCoordinateUsSurveyFeet"]["northing"],
                        ],
                        "targetHorizontalUnit": "US survey foot",
                    },
                    "lastRecovered": None,
                    "condition": "REPORT_TOLERANCE_PASSED",
                    "monumentType": None,
                    "setting": None,
                    "stamping": None,
                },
                "parsedAccuracy": {
                    "horizontalAccuracy95Feet": control["horizontalAccuracy95Feet"],
                },
                "sourceEvidence": {
                    "reportRole": control["reportRole"],
                    "sourcePages": control["sourcePages"],
                    "report": datasheets["source"],
                },
            }
            for control in datasheets.get("eligibleVisualReviewControls", [])
        ]
    review_records: list[dict[str, Any]] = []
    Image.MAX_IMAGE_PIXELS = None
    for source_record in eligible_records:
        candidate = source_record["candidate"]
        pid = str(source_record["pid"])
        projection = candidate.get("projection", {})
        survey_point = projection.get("targetProjectedCoordinate")
        if survey_point is None:
            survey_point = projection.get("targetProjectedCoordinateFeet")
        if not isinstance(survey_point, list) or len(survey_point) != 2:
            raise ValueError(f"NGS control {pid} lacks a projected coordinate")
        x, y = (float(value) for value in survey_point)
        matching_tiles: list[tuple[dict[str, Any], float, float]] = []
        for orthophoto in orthophotos:
            orthophoto_crs = orthophoto.get("coordinateReferenceSystem")
            projection_crs = projection.get("targetCoordinateReferenceSystem")
            if (
                orthophoto_crs is not None
                and projection_crs is not None
                and orthophoto_crs != projection_crs
            ):
                continue
            column, row = source_pixel_from_world(
                x,
                y,
                orthophoto["worldFileValues"],
            )
            if 0 <= column < orthophoto["widthPixels"] and 0 <= row < orthophoto["heightPixels"]:
                matching_tiles.append((orthophoto, column, row))
        if len(matching_tiles) > 1:
            raise ValueError(f"NGS control {pid} falls inside multiple supplied tiles")
        base = {
            "pid": pid,
            "name": candidate.get("name"),
            "surveyCoordinateProjected": [x, y],
            "surveyCoordinateReferenceSystem": projection.get(
                "targetCoordinateReferenceSystem"
            ),
            "surveyCoordinateHorizontalUnit": projection.get(
                "targetHorizontalUnit"
            ),
            "horizontalAccuracy95Feet": source_record["parsedAccuracy"][
                "horizontalAccuracy95Feet"
            ],
            "lastRecovered": candidate.get("lastRecovered"),
            "condition": candidate.get("condition"),
            "monumentType": candidate.get("monumentType"),
            "setting": candidate.get("setting"),
            "stamping": candidate.get("stamping"),
            "controlSourceEvidence": (
                source_record.get("datasheet")
                or source_record.get("sourceEvidence")
            ),
            "insideSuppliedOrthophoto": bool(matching_tiles),
        }
        if projection.get("targetProjectedCoordinateFeet") is not None:
            base["surveyCoordinateProjectedFeet"] = [x, y]
        if not matching_tiles:
            review_records.append(base)
            continue
        orthophoto, source_x, source_y = matching_tiles[0]
        nearest_x = int(round(source_x))
        nearest_y = int(round(source_y))
        left = nearest_x - half_pixels
        top = nearest_y - half_pixels
        right = nearest_x + half_pixels + 1
        bottom = nearest_y + half_pixels + 1
        if not (
            left >= 0
            and top >= 0
            and right <= orthophoto["widthPixels"]
            and bottom <= orthophoto["heightPixels"]
        ):
            raise ValueError(f"NGS control {pid} is too close to a supplied tile edge")
        with Image.open(orthophoto["imagePath"]) as source_image:
            chip = source_image.crop((left, top, right, bottom)).convert("RGB")
        local_x = source_x - left
        local_y = source_y - top
        review = draw_reticle(
            chip,
            local_x,
            local_y,
            args.scale,
            args.reticle_gap_pixels,
        )
        detail, detail_window = draw_pixel_grid_detail(
            chip,
            local_x,
            local_y,
            args.detail_half_size_pixels,
            args.detail_scale,
            args.reticle_gap_pixels,
        )
        native_path = args.output_dir / f"ngs-{pid}-native.png"
        review_path = args.output_dir / f"ngs-{pid}-review.png"
        detail_path = args.output_dir / f"ngs-{pid}-pixel-grid.png"
        chip.save(native_path, format="PNG", optimize=True)
        review.save(review_path, format="PNG", optimize=True)
        detail.save(detail_path, format="PNG", optimize=True)
        review_records.append({
            **base,
            "orthophoto": orthophoto,
            "predictedSourcePixelCoordinate": [source_x, source_y],
            "cropPixelWindow": {
                "left": left,
                "top": top,
                "right": right,
                "bottom": bottom,
            },
            "predictedChipPixelCoordinate": [local_x, local_y],
            "nativeImage": {
                "path": str(native_path.resolve()),
                "sha256": sha256_file(native_path),
            },
            "reviewImage": {
                "path": str(review_path.resolve()),
                "sha256": sha256_file(review_path),
            },
            "pixelGridImage": {
                "path": str(detail_path.resolve()),
                "sha256": sha256_file(detail_path),
                "chipPixelWindow": detail_window,
                "scale": args.detail_scale,
                "gridSemantics": "one cell per source pixel; lines mark pixel edges",
            },
        })

    covered = [
        record for record in review_records if record["insideSuppliedOrthophoto"]
    ]
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": datasheets.get("stadiumId"),
        "inputs": {
            "datasheets": {
                "path": str(args.datasheet_manifest.resolve()),
                "sha256": hashlib.sha256(datasheet_bytes).hexdigest(),
                "artifactVersion": datasheets.get("artifactVersion"),
            },
            "orthophotos": [
                {
                    "path": record["manifestPath"],
                    "sha256": record["manifestSha256"],
                    "artifactVersion": record["artifactVersion"],
                }
                for record in orthophotos
            ],
        },
        "reviewParameters": {
            "halfSizeNativeUnits": half_size_native_units,
            "reviewExtentSemantics": review_extent_semantics,
            "scale": args.scale,
            "reticleGapSourcePixels": args.reticle_gap_pixels,
            "detailHalfSizeSourcePixels": args.detail_half_size_pixels,
            "detailScale": args.detail_scale,
            "pixelSizeNativeUnits": pixel_size,
            "worldFileOriginConvention": "center of upper-left pixel",
        },
        "eligibleDatasheetControlCount": len(eligible_records),
        "controlsInsideSuppliedOrthophotos": len(covered),
        "controls": review_records,
    }
    if args.half_size_native_units is None:
        stable["reviewParameters"]["halfSizeFeet"] = half_size_native_units
        stable["reviewParameters"]["pixelSizeFeet"] = pixel_size
    is_ngs = control_manifest_kind == "ngs-datasheet-horizontal-accuracy-evidence"
    artifact = {
        "schemaVersion": 1,
        "artifactKind": (
            "ngs-orthophoto-control-review-queue"
            if is_ngs else "survey-qc-orthophoto-control-review-queue"
        ),
        "artifactVersion": stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesSurveyCoordinateReticles": True,
            "establishesVisibleMonumentCenters": False,
            "establishesOrthophotoTranslationOrRotation": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                (
                    "NGS_MONUMENT_VISIBILITY_NOT_REVIEWED"
                    if is_ngs else "SURVEY_QC_FEATURE_VISIBILITY_NOT_REVIEWED"
                ),
                (
                    "NGS_PIXEL_CORRESPONDENCES_NOT_ACCEPTED"
                    if is_ngs else "SURVEY_QC_PIXEL_CORRESPONDENCES_NOT_ACCEPTED"
                ),
                "ORTHOPHOTO_CONTROL_RESIDUALS_NOT_COMPUTED",
            ],
        },
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_bytes = (json.dumps(artifact, indent=2) + "\n").encode("utf-8")
    manifest_path.write_bytes(manifest_bytes)
    template = {
        "schemaVersion": 1,
        "artifactKind": (
            "ngs-orthophoto-correspondence-review"
            if is_ngs else "survey-qc-orthophoto-correspondence-review"
        ),
        "reviewState": "template-pending",
        "sourceReviewQueue": {
            "path": str(manifest_path.resolve()),
            "sha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "artifactVersion": artifact["artifactVersion"],
        },
        "reviewProtocol": {
            "reviewerId": None,
            "completedAtUtc": None,
            "method": None,
        },
        "controls": [
            {
                "pid": record["pid"],
                "acceptedForRegistration": None,
                "rejectionReason": "PENDING_VISUAL_REVIEW",
                "observedSourcePixelCoordinate": None,
                "pixelCenterUncertainty95Pixels": None,
                "visibleFeatureKind": None,
                "evidenceNote": None,
            }
            for record in covered
        ],
    }
    template_path = args.output_dir / "correspondence-review-template.json"
    template_path.write_text(json.dumps(template, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path.resolve()),
        "templatePath": str(template_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "eligibleDatasheetControlCount": len(eligible_records),
        "controlsInsideSuppliedOrthophotos": len(covered),
        "coveredPids": [record["pid"] for record in covered],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()

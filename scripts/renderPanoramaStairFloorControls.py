#!/usr/bin/env python3
"""Project row-floor stair controls into a checksum-locked provider panorama."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from renderProviderRowsOnPanorama import project_provider_points


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("georeferenced_rows", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--seat-id", required=True)
    parser.add_argument("--section-a", default="E")
    parser.add_argument("--section-b", default="D")
    parser.add_argument("--floor-section")
    parser.add_argument("--row-minimum", type=int, default=5)
    parser.add_argument("--row-maximum", type=int, default=19)
    parser.add_argument("--padding-x", type=int, default=80)
    parser.add_argument("--padding-y", type=int, default=50)
    parser.add_argument("--scale", type=float, default=10.0)
    args = parser.parse_args()
    if args.section_a == args.section_b:
        raise ValueError("Boundary sections must differ")
    floor_section = args.floor_section or args.section_b
    if floor_section not in {args.section_a, args.section_b}:
        raise ValueError("Floor section must be one of the boundary sections")

    input_paths = {
        "metricRows": args.metric_rows,
        "georeferencedRows": args.georeferenced_rows,
        "verticalDatum": args.vertical_datum,
        "panoramaManifest": args.panorama_manifest,
        "panoramaCalibration": args.panorama_calibration,
    }
    metric = json.loads(args.metric_rows.read_text())
    georeferenced = json.loads(args.georeferenced_rows.read_text())
    vertical = json.loads(args.vertical_datum.read_text())
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    entry = next(item for item in manifest["images"] if item["seatId"] == args.seat_id)
    panorama_path = Path(entry["localPath"])
    panorama = cv2.imread(str(panorama_path), cv2.IMREAD_COLOR)
    if panorama is None:
        raise ValueError("Could not decode panorama")
    if panorama.shape[1] != entry["width"] or panorama.shape[0] != entry["height"]:
        raise ValueError("Panorama dimensions changed")

    metric_by_key = {item["rowKey"]: item for item in metric["rows"]}
    georef_by_key = {item["rowKey"]: item for item in georeferenced["rows"]}
    navd_offset = float(
        vertical["verticalDatum"]["providerLocalToNavd88"]["offsetMetres"]
    )
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )
    camera = np.asarray(entry["config"]["p"], dtype=float)
    yaw = float(entry["config"]["rp"][1])

    controls = []
    for row_number in range(args.row_minimum, args.row_maximum + 1):
        a_row = metric_by_key[f"{args.section_a}:{row_number}"]
        b_row = metric_by_key[f"{args.section_b}:{row_number}"]
        floor_navd = float(
            georef_by_key[f"{floor_section}:{row_number}"]["verticalGeometry"][
                "elevationMetresNavd88"
            ]
        )
        floor_provider_y = floor_navd - navd_offset
        pairs = [
            (
                np.asarray(a_anchor["position"], dtype=float),
                np.asarray(b_anchor["position"], dtype=float),
            )
            for a_anchor in a_row["anchors"]
            for b_anchor in b_row["anchors"]
        ]
        a_eye, b_eye = min(
            pairs,
            key=lambda pair: float(
                np.linalg.norm(pair[0][[0, 2]] - pair[1][[0, 2]])
            ),
        )
        a_floor = a_eye.copy()
        b_floor = b_eye.copy()
        a_floor[1] = floor_provider_y
        b_floor[1] = floor_provider_y
        points = np.vstack((a_floor, b_floor, a_eye, b_eye))
        pixels = project_provider_points(
            points,
            camera,
            rotation,
            yaw,
            entry["width"],
            entry["height"],
        )
        controls.append(
            {
                "rowKey": f"{args.section_a}/{args.section_b}:{row_number}",
                "floorElevationMetresNavd88": floor_navd,
                "floorProviderYMetres": floor_provider_y,
                "eyeHeightAboveFloorMetres": {
                    args.section_a: float(a_eye[1] - floor_provider_y),
                    args.section_b: float(b_eye[1] - floor_provider_y),
                },
                "providerPoints": {
                    "aFloor": a_floor.tolist(),
                    "bFloor": b_floor.tolist(),
                    "aEye": a_eye.tolist(),
                    "bEye": b_eye.tolist(),
                },
                "panoramaPixels": {
                    "aFloor": pixels[0].tolist(),
                    "bFloor": pixels[1].tolist(),
                    "aEye": pixels[2].tolist(),
                    "bEye": pixels[3].tolist(),
                },
            }
        )

    all_pixels = np.asarray(
        [
            pixel
            for item in controls
            for pixel in item["panoramaPixels"].values()
        ],
        dtype=float,
    )
    left = max(0, int(math.floor(np.min(all_pixels[:, 0]))) - args.padding_x)
    right = min(
        panorama.shape[1], int(math.ceil(np.max(all_pixels[:, 0]))) + args.padding_x
    )
    top = max(0, int(math.floor(np.min(all_pixels[:, 1]))) - args.padding_y)
    bottom = min(
        panorama.shape[0], int(math.ceil(np.max(all_pixels[:, 1]))) + args.padding_y
    )
    rendered = panorama[top:bottom, left:right].copy()
    for item in controls:
        row_number = int(item["rowKey"].split(":", 1)[1])
        a_floor = np.rint(
            np.asarray(item["panoramaPixels"]["aFloor"]) - [left, top]
        ).astype(int)
        b_floor = np.rint(
            np.asarray(item["panoramaPixels"]["bFloor"]) - [left, top]
        ).astype(int)
        a_eye = np.rint(
            np.asarray(item["panoramaPixels"]["aEye"]) - [left, top]
        ).astype(int)
        b_eye = np.rint(
            np.asarray(item["panoramaPixels"]["bEye"]) - [left, top]
        ).astype(int)
        cv2.line(rendered, tuple(a_floor), tuple(b_floor), (0, 180, 255), 1, cv2.LINE_AA)
        cv2.line(rendered, tuple(a_eye), tuple(b_eye), (255, 255, 0), 1, cv2.LINE_AA)
        if row_number in {5, 9, 13, 17, 19}:
            cv2.putText(
                rendered,
                f"floor {row_number}",
                (int(b_floor[0] + 2), int(b_floor[1] + 2)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.32,
                (0, 180, 255),
                1,
                cv2.LINE_AA,
            )
            cv2.putText(
                rendered,
                f"eye {row_number}",
                (int(b_eye[0] + 2), int(b_eye[1] + 2)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.32,
                (255, 255, 0),
                1,
                cv2.LINE_AA,
            )
    if args.scale != 1.0:
        rendered = cv2.resize(
            rendered,
            None,
            fx=args.scale,
            fy=args.scale,
            interpolation=cv2.INTER_CUBIC,
        )
    output_png = args.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_png), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write preview")

    stable = {
        "inputHashes": {name: sha256_file(path) for name, path in input_paths.items()},
        "panoramaSha256": sha256_file(panorama_path),
        "panoramaSeatId": args.seat_id,
        "boundarySections": [args.section_a, args.section_b],
        "floorSection": floor_section,
        "rowRange": [args.row_minimum, args.row_maximum],
        "cropSourcePixels": [left, top, right, bottom],
        "controls": controls,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "panorama-stair-floor-controls-v1",
        "artifactStage": "provider-panorama-row-floor-control-review",
        "artifactVersion": fingerprint(stable),
        "inputs": {
            name: {"path": str(path), "sha256": stable["inputHashes"][name]}
            for name, path in input_paths.items()
        },
        "panorama": {
            "seatId": args.seat_id,
            "path": str(panorama_path),
            "sha256": stable["panoramaSha256"],
        },
        "rowRange": stable["rowRange"],
        "boundarySections": stable["boundarySections"],
        "floorSection": stable["floorSection"],
        "cropSourcePixels": {
            "left": left,
            "top": top,
            "right": right,
            "bottom": bottom,
        },
        "controls": controls,
        "previewPng": str(output_png),
        "previewPngSha256": sha256_file(output_png),
        "publicationEligible": False,
        "blockers": [
            "BROADCAST_TARGET_CONTROLS_NOT_YET_LABELED",
            "PANORAMA_VERTICAL_DATUM_SCOPE_REMAINS_LIMITED",
        ],
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(args.output_json),
                "preview": str(output_png),
                "controlRowCount": len(controls),
                "artifactVersion": artifact["artifactVersion"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

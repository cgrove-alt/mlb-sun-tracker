#!/usr/bin/env python3
"""Build a deterministic list of every published seat ID in selected row banks."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("output_txt", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--section", action="append", required=True)
    parser.add_argument("--minimum-row", type=int)
    parser.add_argument("--maximum-row", type=int)
    parser.add_argument(
        "--include-nonnumeric-rows",
        action="store_true",
        help="include lettered and accessibility row IDs when no numeric row bounds are supplied",
    )
    parser.add_argument("--exclude-manifest", type=Path, action="append", default=[])
    parser.add_argument(
        "--anchors-only",
        action="store_true",
        help=(
            "emit only the metric anchor seat IDs already verified for each row; "
            "when no numeric row bounds are supplied, include nonnumeric rows"
        ),
    )
    parser.add_argument(
        "--maximum-seats-per-row",
        type=int,
        help=(
            "deterministically retain evenly spaced seats from each row; intended "
            "for training and holdout sampling, not a claim of complete seat coverage"
        ),
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.maximum_seats_per_row is not None and args.maximum_seats_per_row < 1:
        raise ValueError("Maximum seats per row must be positive")
    source = json.loads(args.metric_rows.read_text())
    selected_rows = []
    seat_ids = []
    for row in source["rows"]:
        if row["sectionId"] not in args.section:
            continue
        row_number = None
        try:
            row_number = int(row["rowId"])
        except ValueError:
            if (
                not args.include_nonnumeric_rows
                and not args.anchors_only
                or args.minimum_row is not None
                or args.maximum_row is not None
            ):
                continue
        if args.minimum_row is not None and row_number < args.minimum_row:
            continue
        if args.maximum_row is not None and row_number > args.maximum_row:
            continue
        published_count = int(row["publishedSeatCount"])
        generated = (
            list(row["anchorSeatIds"])
            if args.anchors_only
            else [
                f"S_{row['sectionId']}-{row['rowId']}-{seat_number}"
                for seat_number in range(1, published_count + 1)
            ]
        )
        complete_generated = list(generated)
        if (
            args.maximum_seats_per_row is not None
            and len(generated) > args.maximum_seats_per_row
        ):
            sample_count = args.maximum_seats_per_row
            if sample_count == 1:
                selected_indices = [(len(generated) - 1) // 2]
            else:
                selected_indices = [
                    round(index * (len(generated) - 1) / (sample_count - 1))
                    for index in range(sample_count)
                ]
            generated = [generated[index] for index in selected_indices]
        missing_anchors = sorted(set(row["anchorSeatIds"]) - set(complete_generated))
        if missing_anchors:
            raise ValueError(
                f"Generated range does not contain anchors for {row['rowKey']}: {missing_anchors}"
            )
        selected_rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": published_count,
            "anchorSeatIds": row["anchorSeatIds"],
            "completeGeneratedSeatIds": complete_generated,
            "generatedSeatIds": generated,
        })
        seat_ids.extend(generated)
    if not selected_rows:
        raise ValueError("No metric rows matched the requested scope")
    if len(seat_ids) != len(set(seat_ids)):
        raise ValueError("Generated seat IDs are not unique")
    excluded_seat_ids: list[str] = []
    if args.exclude_manifest:
        excluded_set: set[str] = set()
        for manifest_path in args.exclude_manifest:
            excluded_manifest = json.loads(manifest_path.read_text())
            excluded_set.update(item["seatId"] for item in excluded_manifest["images"])
        excluded_seat_ids = [seat_id for seat_id in seat_ids if seat_id in excluded_set]
    output_seat_ids = [seat_id for seat_id in seat_ids if seat_id not in set(excluded_seat_ids)]
    stable = {
        "input": {
            "path": str(args.metric_rows),
            "sha256": sha256_file(args.metric_rows),
            "artifactVersion": source.get("artifactVersion"),
        },
        "scope": {
            "sections": args.section,
            "minimumRow": args.minimum_row,
            "maximumRow": args.maximum_row,
            "includeNonnumericRows": args.include_nonnumeric_rows,
            "anchorsOnly": args.anchors_only,
            "maximumSeatsPerRow": args.maximum_seats_per_row,
            "excludeManifests": [
                {
                    "path": str(path),
                    "sha256": sha256_file(path),
                }
                for path in args.exclude_manifest
            ],
        },
        "rows": selected_rows,
        "completeSeatIds": seat_ids,
        "excludedSeatIds": excluded_seat_ids,
        "outputSeatIds": output_seat_ids,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "deterministic-published-panorama-seat-id-list",
        "artifactVersion": fingerprint(stable),
        **stable,
        "summary": {
            "rowCount": len(selected_rows),
            "completeSeatCount": len(seat_ids),
            "excludedSeatCount": len(excluded_seat_ids),
            "outputSeatCount": len(output_seat_ids),
            "countsBySection": {
                section: sum(
                    len(row["generatedSeatIds"])
                    for row in selected_rows
                    if row["sectionId"] == section
                )
                for section in args.section
            },
        },
        "publicationEligible": False,
        "blockers": [
            "SEAT_RESOURCE_EXISTENCE_NOT_YET_VERIFIED",
            "PANORAMA_RESEARCH_INPUT_LICENSE_LIMITS_APPLY",
        ],
    }
    args.output_txt.parent.mkdir(parents=True, exist_ok=True)
    args.output_txt.write_text("\n".join(output_seat_ids) + "\n")
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputTxt": str(args.output_txt),
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()

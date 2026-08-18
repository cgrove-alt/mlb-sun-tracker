"""Coordinate-unit helpers shared by the stadium lidar research scripts."""

from __future__ import annotations

import math
from dataclasses import dataclass

from pyproj import CRS


METERS_PER_INTERNATIONAL_FOOT = 0.3048


@dataclass(frozen=True)
class LidarUnitConversion:
    horizontal_unit_name: str
    vertical_unit_name: str
    horizontal_native_units_to_feet: float
    vertical_native_units_to_feet: float


def _axis_to_feet(axis: object, label: str) -> tuple[str, float]:
    unit_name = getattr(axis, "unit_name", None)
    conversion_to_meters = getattr(axis, "unit_conversion_factor", None)
    if (
        not unit_name
        or conversion_to_meters is None
        or not math.isfinite(float(conversion_to_meters))
        or float(conversion_to_meters) <= 0
    ):
        raise ValueError(f"CRS {label} axis has no usable linear-unit conversion")
    return str(unit_name), float(conversion_to_meters) / METERS_PER_INTERNATIONAL_FOOT


def lidar_unit_conversion(crs: CRS) -> LidarUnitConversion:
    """Return explicit native-to-foot scales for a projected lidar CRS.

    USGS products are not uniform: older state-plane files commonly use U.S.
    survey feet while newer UTM products commonly use metres. Stadium analysis
    accepts user-facing footprints and thresholds in feet, so every source must
    be normalized before cropping, gridding, density, or height calculations.
    """

    axes = crs.axis_info
    if len(axes) < 2 or not crs.is_projected:
        raise ValueError("Expected a projected CRS with horizontal X/Y axes")

    horizontal_name, horizontal_scale = _axis_to_feet(axes[0], "horizontal")
    second_name, second_scale = _axis_to_feet(axes[1], "horizontal")
    if not math.isclose(horizontal_scale, second_scale, rel_tol=0, abs_tol=1e-12):
        raise ValueError(
            f"CRS horizontal axes use inconsistent units: {horizontal_name} and {second_name}"
        )

    if len(axes) >= 3:
        vertical_name, vertical_scale = _axis_to_feet(axes[2], "vertical")
    else:
        # LAS files with a purely horizontal projected CRS conventionally use
        # the same linear unit for Z. Preserve that explicit inference in the
        # returned metadata rather than treating the raw number as feet.
        vertical_name, vertical_scale = horizontal_name, horizontal_scale

    return LidarUnitConversion(
        horizontal_unit_name=horizontal_name,
        vertical_unit_name=vertical_name,
        horizontal_native_units_to_feet=horizontal_scale,
        vertical_native_units_to_feet=vertical_scale,
    )

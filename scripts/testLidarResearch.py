#!/usr/bin/env python3
"""Focused regression tests for lidar unit and time normalization."""

from __future__ import annotations

import contextlib
import hashlib
import io
import json
import math
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
from pyproj import CRS

from analyzeUsgsLidarStadium import adjusted_standard_gps_seconds_to_utc
from analyzeRockies2019ShadeStructureChange import (
    fit_ground_plane as fit_shade_structure_ground_plane,
    minimum_area_dimensions as shade_structure_minimum_area_dimensions,
    plane_height as shade_structure_plane_height,
    point_in_polygon_mask as shade_structure_point_in_polygon_mask,
)
from acquireDenverRangePointControls import (
    OUTPUT_CRS,
    build_url,
    spatial_query_parameters,
    validate_features,
    validate_layer,
    validate_service,
)
from acquireNgsOrthophotoControls import (
    candidate_from_mark,
    datum_mapping,
    haversine_distance_feet,
    project_candidate,
    validate_metadata as validate_ngs_metadata,
)
from acquireNgsDatasheetEvidence import parse_datasheet_horizontal_accuracy
from auditDenverRangePointOrthophotoRegistration import (
    fit_rigid,
    fit_similarity,
    leave_one_out_errors,
    main as registration_audit_main,
    monte_carlo_rigid_uncertainty,
    spatial_geometry,
    transform_points,
    world_from_source_pixel,
)
from auditNgsOrthophotoRegistration import (
    monte_carlo_rigid_uncertainty as ngs_monte_carlo_rigid_uncertainty,
    point_inside_control_hull,
)
from auditNoaa2021HardStructureRegistration import (
    fit_rigid as fit_hard_structure_rigid,
    transform_points as transform_hard_structure_points,
)
from auditMarlinsUpperRoofPanelTopProfile import top_profile as marlins_top_profile
from auditMarlins2024UpperRoofPanelShape import (
    fit_shape_alignment,
    grouped_top_profile,
    interpolate_profile,
)
from auditMarlins2025OrthophotoCurrentGeometry import (
    parse_acquisition_dates as parse_marlins_2025_orthophoto_acquisition_dates,
    parse_horizontal_accuracy as parse_marlins_2025_orthophoto_horizontal_accuracy,
)
from auditMarlinsSec35LidarShadeDiagnostic import (
    artifact_version as marlins_shade_artifact_version,
    infer_section_fraction,
    seat_fraction,
    shade_suffix_boundary,
)
from auditMarlins2024SurveyControlCluster import (
    median_ground_height as marlins_survey_median_ground_height,
    vertical_training_holdout as marlins_survey_vertical_training_holdout,
)
from auditSurveyQcOrthophotoRegistration import (
    monte_carlo_rigid_uncertainty as survey_qc_monte_carlo_rigid_uncertainty,
)
from auditResearchArtifactFreshness import audit_artifact, build_audit
from auditRockiesSemanticRoofEdgeRegistration import (
    fit_rigid as fit_semantic_roof_rigid,
    line_intersection as semantic_line_intersection,
    pixel_to_utm as semantic_pixel_to_utm,
    source_boundary_line,
    utm_to_pixel as semantic_utm_to_pixel,
)
from auditLockedBroadcastCameraTransfer import (
    convex_hull_area_fraction,
    spatial_cell_ids,
    transformation_diagnostics,
    transform_points as transform_camera_points,
)
from extractDrcogFieldControls import grid_bearing_to_true_bearing
from auditRockiesPanoramaAllFieldGradePoseUncertainty import fit_plane
from auditRockiesPanoramaProviderPlanCameraControl import rotate_bearing_frame
from fitRockiesPanoramaAllFieldGradePose import plane_z
from fitRockiesPanoramaAllFieldPose import circle_tangent_world_points
from fitRockiesPanoramaFullOrientationFieldPose import (
    cubemap_ray,
    provider_ray_to_pixel,
)
from lidar_units import lidar_unit_conversion
from measure3dVenueHomePlateFromSeatingArcs import fit_circle
from measureOrthophotoFoulLineOrientation import pixel_line_intersection
from renderDenverRangePointOrthophotoReview import source_pixel_from_world
from renderNgsOrthophotoControlReview import scaled_pixel_center
from renderLidarControlRaster import axis_metres_per_unit
from register3dVenueRowsToSurveyOrthophoto import raster_pixel_uncertainty_feet
from registerTicketmasterRowsToDrcogField import apply_rigid_correction
from registerTicketmasterRowsToLidarPlan import projected_metres_to_native_coordinates


class LidarUnitConversionTests(unittest.TestCase):
    def test_control_raster_normalizes_us_survey_feet_to_metres(self) -> None:
        factor, name = axis_metres_per_unit(CRS.from_epsg(6438))

        self.assertEqual(name, "US survey foot")
        self.assertTrue(math.isclose(
            factor,
            0.3048006096012192,
            rel_tol=0,
            abs_tol=1e-15,
        ))

    def test_control_raster_preserves_metre_crs_values(self) -> None:
        factor, name = axis_metres_per_unit(CRS.from_epsg(6347))

        self.assertEqual(name, "metre")
        self.assertEqual(factor, 1.0)

    def test_converts_utm_metres_to_international_feet(self) -> None:
        units = lidar_unit_conversion(CRS.from_epsg(6340))

        self.assertEqual(units.horizontal_unit_name, "metre")
        self.assertTrue(math.isclose(
            units.horizontal_native_units_to_feet,
            3.280839895013123,
            rel_tol=0,
            abs_tol=1e-12,
        ))
        self.assertEqual(
            units.vertical_native_units_to_feet,
            units.horizontal_native_units_to_feet,
        )

    def test_preserves_us_survey_feet_without_treating_them_as_exact_feet(self) -> None:
        units = lidar_unit_conversion(CRS.from_epsg(6426))

        self.assertEqual(units.horizontal_unit_name, "US survey foot")
        self.assertTrue(math.isclose(
            units.horizontal_native_units_to_feet,
            1.000002000004,
            rel_tol=0,
            abs_tol=1e-12,
        ))

    def test_converts_normalized_metres_back_to_us_survey_foot_crs_units(self) -> None:
        native_x, native_y = projected_metres_to_native_coordinates(
            387_213.9473106312,
            66_807.88116285432,
            0.3048006096012192,
        )

        self.assertTrue(math.isclose(native_x, 1_270_384.425, abs_tol=0.01))
        self.assertTrue(math.isclose(native_y, 219_185.522, abs_tol=0.01))


class Marlins2024SurveyControlClusterTests(unittest.TestCase):
    def test_ground_height_uses_median_for_sparse_outlier_resistance(self) -> None:
        height = marlins_survey_median_ground_height(np.asarray([
            8.00,
            8.01,
            8.02,
            18.00,
            7.99,
        ]))

        self.assertEqual(height, 8.01)

    def test_vertical_holdout_is_not_used_to_fit_training_correction(self) -> None:
        result = marlins_survey_vertical_training_holdout(
            training_lidar_height=8.015,
            training_survey_height=8.325,
            holdout_lidar_height=8.150,
            holdout_survey_height=8.458,
        )

        self.assertTrue(math.isclose(
            result["trainingCorrectionUsSurveyFeet"],
            0.310,
            abs_tol=1e-12,
        ))
        self.assertTrue(math.isclose(
            result["holdoutResidualUsSurveyFeet"],
            0.002,
            abs_tol=1e-12,
        ))


class AdjustedGpsTimeTests(unittest.TestCase):
    def test_uses_historical_leap_second_count_for_2014_data(self) -> None:
        self.assertEqual(
            adjusted_standard_gps_seconds_to_utc(100_832_764.333001),
            "2014-11-24T02:52:28.333001Z",
        )

    def test_uses_current_leap_second_count_for_2023_data(self) -> None:
        self.assertEqual(
            adjusted_standard_gps_seconds_to_utc(384_671_439.366592),
            "2023-11-22T06:57:01.366592Z",
        )


class Marlins2025OrthophotoMetadataTests(unittest.TestCase):
    def test_parses_complete_comma_separated_acquisition_dates(self) -> None:
        abstract = (
            "The new imagery was acquired on the following dates: December 21, 2024, "
            "December 22, 2024, January 4, 2025, January 7, 2025, and January 8, 2025. "
            "This data was collected using a mapping camera."
        )

        dates = parse_marlins_2025_orthophoto_acquisition_dates(abstract)

        self.assertEqual(dates, [
            "2024-12-21",
            "2024-12-22",
            "2025-01-04",
            "2025-01-07",
            "2025-01-08",
        ])

    def test_requires_explicit_independent_accuracy_semantics(self) -> None:
        statement = (
            "The project was produced to meet a horizontal accuracy of 1.23 feet at "
            "the 95% confidence interval. The actual horizontal accuracy was 0.384 "
            "feet, tested over 61 independent surveyed check points."
        )

        parsed = parse_marlins_2025_orthophoto_horizontal_accuracy(statement)

        self.assertEqual(parsed["actualHorizontalAccuracy95Feet"], 0.384)
        self.assertEqual(parsed["independentSurveyedCheckpointCount"], 61)
        self.assertTrue(parsed["independenceExplicitlyStated"])
        with self.assertRaisesRegex(ValueError, "independent horizontal-accuracy"):
            parse_marlins_2025_orthophoto_horizontal_accuracy(
                statement.replace("independent surveyed", "surveyed")
            )


class ProjectedBearingTests(unittest.TestCase):
    def test_applies_state_plane_meridian_convergence_with_correct_sign(self) -> None:
        true_bearing, convergence = grid_bearing_to_true_bearing(
            4.6220942347190626,
            CRS.from_epsg(6428),
            -104.9941885460558,
            39.75570925843117,
        )

        self.assertTrue(math.isclose(
            convergence,
            0.31901000091659015,
            rel_tol=0,
            abs_tol=1e-9,
        ))
        self.assertTrue(math.isclose(
            true_bearing,
            4.9411042356356525,
            rel_tol=0,
            abs_tol=1e-9,
        ))


class RockiesShadeStructureChangeTests(unittest.TestCase):
    def test_minimum_area_dimensions_recover_rotated_rectangle(self) -> None:
        angle = math.radians(31.0)
        rotation = np.asarray([
            [math.cos(angle), -math.sin(angle)],
            [math.sin(angle), math.cos(angle)],
        ])
        rectangle = np.asarray([
            [-22.5, -7.5],
            [22.5, -7.5],
            [22.5, 7.5],
            [-22.5, 7.5],
            [-22.5, -7.5],
        ]) @ rotation.T

        length, width = shade_structure_minimum_area_dimensions(rectangle)

        self.assertTrue(math.isclose(length, 45.0, abs_tol=1e-5))
        self.assertTrue(math.isclose(width, 15.0, abs_tol=1e-5))

    def test_point_in_polygon_includes_boundary_and_rejects_exterior(self) -> None:
        polygon = np.asarray([
            [0.0, 0.0],
            [10.0, 0.0],
            [10.0, 10.0],
            [0.0, 10.0],
            [0.0, 0.0],
        ])
        points = np.asarray([[5.0, 5.0], [10.0, 5.0], [10.01, 5.0]])

        inside = shade_structure_point_in_polygon_mask(points, polygon)

        self.assertEqual(inside.tolist(), [True, True, False])

    def test_local_ground_plane_reproduces_synthetic_surface(self) -> None:
        x, y = np.meshgrid(np.linspace(-20.0, 20.0, 11), np.linspace(-10.0, 10.0, 11))
        z = 0.02 * x - 0.03 * y + 1_580.0
        points = np.column_stack((x.ravel(), y.ravel(), z.ravel()))

        origin, coefficients = fit_shade_structure_ground_plane(points)
        predicted = shade_structure_plane_height(
            points[:, 0],
            points[:, 1],
            origin,
            coefficients,
        )

        self.assertTrue(np.allclose(predicted, points[:, 2], rtol=0, atol=1e-10))


class RockiesPanoramaFieldGeometryTests(unittest.TestCase):
    def test_provider_camera_offset_rotates_with_field_bearing_frame(self) -> None:
        north = rotate_bearing_frame(np.asarray([0.0, 1.0]), 10.0)
        east = rotate_bearing_frame(np.asarray([1.0, 0.0]), 10.0)

        self.assertTrue(np.allclose(
            north,
            [math.sin(math.radians(10.0)), math.cos(math.radians(10.0))],
            rtol=0,
            atol=1e-12,
        ))
        self.assertTrue(np.allclose(
            east,
            [math.cos(math.radians(10.0)), -math.sin(math.radians(10.0))],
            rtol=0,
            atol=1e-12,
        ))
        self.assertTrue(math.isclose(np.linalg.norm(north), 1.0, abs_tol=1e-12))

    def test_cubemap_pixels_round_trip_on_all_horizontal_faces(self) -> None:
        for face in ("f", "r", "b", "l"):
            for pixel in ((1023.5, 1023.5), (412.25, 733.75), (1610.5, 1390.25)):
                recovered_face, recovered_x, recovered_y = provider_ray_to_pixel(
                    cubemap_ray(face, pixel, 2048),
                    2048,
                )

                self.assertEqual(recovered_face, face)
                self.assertTrue(math.isclose(recovered_x, pixel[0], abs_tol=1e-9))
                self.assertTrue(math.isclose(recovered_y, pixel[1], abs_tol=1e-9))

    def test_circle_tangencies_are_metric_and_perpendicular(self) -> None:
        camera = np.asarray([0.0, 0.0])
        centre = np.asarray([10.0, 0.0])
        tangencies = circle_tangent_world_points(camera, centre, 2.0)

        self.assertIsNotNone(tangencies)
        for tangent in tangencies:
            radius = tangent - centre
            sightline = tangent - camera
            self.assertTrue(math.isclose(np.linalg.norm(radius), 2.0, abs_tol=1e-12))
            self.assertTrue(math.isclose(float(np.dot(radius, sightline)), 0.0, abs_tol=1e-12))

    def test_relative_field_plane_is_stable_at_state_plane_coordinates(self) -> None:
        xy = np.asarray(
            [
                [3_142_212.5, 1_700_543.1],
                [3_142_280.2, 1_700_601.4],
                [3_142_222.8, 1_700_669.9],
                [3_142_155.2, 1_700_611.5],
            ]
        )
        expected = 0.0012 * (xy[:, 0] - xy[0, 0]) - 0.0007 * (xy[:, 1] - xy[0, 1])

        plane = fit_plane(xy, expected)
        recovered = np.asarray([plane_z(plane, point) for point in xy])

        self.assertTrue(np.allclose(recovered, expected, rtol=0, atol=1e-9))


class RockiesSemanticRoofEdgeTests(unittest.TestCase):
    def test_review_pixel_and_utm_coordinates_round_trip(self) -> None:
        feature = {
            "centerDeliveredUtmMetres": [500_600.0, 4_400_700.0],
            "reviewCellMetres": 0.1,
        }
        pixels = np.asarray([[0.0, 0.0], [249.5, 300.25], [499.0, 499.0]])

        utm = semantic_pixel_to_utm(pixels, feature, 500)
        recovered = semantic_utm_to_pixel(utm, feature, 500)

        self.assertTrue(np.allclose(recovered, pixels, rtol=0, atol=3e-9))

    def test_quantile_boundary_fit_uses_synthetic_bin_coordinates(self) -> None:
        points = []
        for x_value in np.linspace(20.0, 80.0, 121):
            for offset in [0.0, 2.0, 5.0, 9.0]:
                points.append([x_value, 50.0 + offset])
        corridor = {
            "startPixels": [20.0, 50.0],
            "endPixels": [80.0, 50.0],
            "halfWidthPixels": 12.0,
            "boundaryQuantile": 0.0,
        }
        parameters = {
            "minimumSourceCorridorPoints": 40,
            "sourceBoundaryBinWidthPixels": 6.0,
            "minimumSourcePointsPerBin": 4,
            "sourceLineInlierTolerancePixels": 0.1,
            "minimumSourceBoundaryBins": 8,
        }

        center, direction, _, summary = source_boundary_line(
            np.asarray(points), corridor, parameters
        )

        self.assertTrue(math.isclose(center[1], 50.0, rel_tol=0, abs_tol=1e-9))
        self.assertGreater(abs(direction[0]), 0.999999)
        self.assertGreaterEqual(summary["boundaryBinCount"], 10)
        self.assertLess(summary["fitResidualP95Pixels"], 1e-9)

    def test_corner_intersection_and_rigid_fit_recover_known_geometry(self) -> None:
        corner = semantic_line_intersection(
            (np.asarray([1.0, 2.0]), np.asarray([1.0, 0.0])),
            (np.asarray([4.0, -3.0]), np.asarray([0.0, 1.0])),
        )
        self.assertTrue(np.allclose(corner, [4.0, 2.0], rtol=0, atol=1e-12))

        source = np.asarray([[0.0, 0.0], [10.0, 0.0], [2.0, 8.0]])
        angle = math.radians(0.35)
        expected_rotation = np.asarray([
            [math.cos(angle), -math.sin(angle)],
            [math.sin(angle), math.cos(angle)],
        ])
        expected_translation = np.asarray([1.25, -0.75])
        target = source @ expected_rotation.T + expected_translation

        rotation, translation, recovered_angle = fit_semantic_roof_rigid(source, target)

        self.assertTrue(np.allclose(rotation, expected_rotation, rtol=0, atol=1e-12))
        self.assertTrue(np.allclose(translation, expected_translation, rtol=0, atol=1e-12))
        self.assertTrue(math.isclose(recovered_angle, angle, rel_tol=0, abs_tol=1e-12))


class MarlinsProviderRegistrationTests(unittest.TestCase):
    def test_intersects_mixed_scan_axis_foul_line_equations(self) -> None:
        fits = [
            {"coefficients": np.asarray([0.5, 10.0])},
            {"coefficients": np.asarray([-0.25, 40.0])},
        ]
        definitions = [{"scanAxis": "x"}, {"scanAxis": "y"}]

        intersection = pixel_line_intersection(fits, definitions)

        self.assertTrue(np.allclose(intersection, [33.333333333333, 26.666666666667]))

    def test_robust_circle_fit_recovers_seating_arc_center(self) -> None:
        angles = np.linspace(-0.7, 0.7, 80)
        center = np.asarray([-9.04, -0.01])
        points = center + 20.0 * np.column_stack((np.cos(angles), np.sin(angles)))
        points[20] += np.asarray([0.0, 0.4])

        fit = fit_circle(points, 0.05)

        self.assertTrue(fit["optimizationSucceeded"])
        self.assertTrue(np.allclose(fit["center"], center, atol=0.03))
        self.assertTrue(math.isclose(fit["radius"], 20.0, rel_tol=0, abs_tol=0.03))

    def test_native_us_survey_foot_pixel_uncertainty_is_not_scaled_as_metres(self) -> None:
        raster = {"pixelSizeX": 0.25, "pixelSizeY": 0.25}

        uncertainty = raster_pixel_uncertainty_feet(
            2.0,
            raster,
            CRS.from_epsg(6438),
        )

        self.assertTrue(math.isclose(uncertainty, 0.5, rel_tol=0, abs_tol=1e-9))


class MarlinsRoofPanelAuditTests(unittest.TestCase):
    def test_hard_structure_rigid_fit_maps_comparison_to_reference(self) -> None:
        comparison = np.asarray([
            [578100.0, 2851100.0],
            [578420.0, 2851120.0],
            [578390.0, 2851450.0],
            [578080.0, 2851420.0],
        ])
        angle = math.radians(-0.37)
        expected_rotation = np.asarray([
            [math.cos(angle), -math.sin(angle)],
            [math.sin(angle), math.cos(angle)],
        ])
        expected_translation = np.asarray([18420.5, -3721.25])
        reference = comparison @ expected_rotation.T + expected_translation

        rotation, translation = fit_hard_structure_rigid(comparison, reference)
        predicted = transform_hard_structure_points(comparison, rotation, translation)

        self.assertTrue(np.allclose(predicted, reference, atol=1e-9))
        self.assertTrue(np.allclose(rotation, expected_rotation, atol=1e-12))

    def test_panel_profile_binning_agrees_between_implementations(self) -> None:
        y = np.repeat(np.asarray([0.05, 0.35, 0.65, 0.95]), 30)
        z = np.concatenate([
            np.linspace(10.0 + index, 10.29 + index, 30)
            for index in range(4)
        ])
        arguments = ((0.0, 1.2), 0.3, 0.9, 20)

        old_centers, old_profile, old_counts = marlins_top_profile(y, z, *arguments)
        new_centers, new_profile, new_counts = grouped_top_profile(y, z, *arguments)

        self.assertTrue(np.allclose(old_centers, new_centers))
        self.assertTrue(np.allclose(old_profile, new_profile, equal_nan=True))
        self.assertTrue(np.array_equal(old_counts, new_counts))

    def test_profile_interpolation_does_not_bridge_an_unsupported_gap(self) -> None:
        centers = np.asarray([0.0, 0.25, 0.5, 0.75, 1.0])
        profile = np.asarray([10.0, 11.0, np.nan, 13.0, 14.0])

        sampled = interpolate_profile(
            centers,
            profile,
            np.asarray([0.25, 0.5, 0.875]),
            maximum_span_metres=0.3,
        )

        self.assertEqual(sampled[0], 11.0)
        self.assertTrue(np.isnan(sampled[1]))
        self.assertTrue(math.isclose(sampled[2], 13.5, rel_tol=0, abs_tol=1e-12))

    def test_shape_alignment_uses_training_bins_to_recover_locked_shifts(self) -> None:
        centers = np.arange(0.125, 10.0, 0.25)
        base = 50.0 + np.sin(centers * 1.7) + 0.03 * centers ** 2
        comparison = np.empty_like(base)
        comparison[:-1] = base[1:] - 0.4
        comparison[-1] = np.nan
        holdout = np.arange(centers.size) % 5 == 0

        locked = fit_shape_alignment(
            centers,
            base,
            centers,
            comparison,
            ~holdout,
            np.arange(-0.5, 0.51, 0.25),
            maximum_interpolation_span_metres=0.5,
            minimum_training_pairs=20,
        )

        self.assertTrue(math.isclose(locked["yShiftMetres"], 0.25, abs_tol=1e-12))
        self.assertTrue(math.isclose(locked["zShiftMetres"], 0.4, abs_tol=1e-12))
        sampled = locked["sampledProfile"] + locked["zShiftMetres"]
        valid_holdout = holdout & np.isfinite(sampled)
        self.assertGreaterEqual(int(valid_holdout.sum()), 7)
        self.assertTrue(np.allclose(sampled[valid_holdout], base[valid_holdout], atol=1e-12))


class MarlinsShadeDiagnosticTests(unittest.TestCase):
    def test_seat_fraction_uses_published_row_endpoints(self) -> None:
        self.assertEqual(seat_fraction("SEC35-A-1", 5), 0.0)
        self.assertEqual(seat_fraction("SEC35-A-3", 5), 0.5)
        self.assertEqual(seat_fraction("SEC35-A-5", 5), 1.0)
        self.assertEqual(seat_fraction("SEC35-A-1", 1), 0.5)

        with self.assertRaisesRegex(ValueError, "outside its published row"):
            seat_fraction("SEC35-A-6", 5)

    def test_boundary_pixel_is_interpolated_from_checksum_bound_seat_anchors(self) -> None:
        sample = {
            "observedBoundaryPixel": [150.0, 220.0],
            "frontBracketRowId": "A",
            "backBracketRowId": "B",
        }
        registration_rows = {
            "A": {
                "projectedAnchorPixels": [[100.0, 200.0], [200.0, 200.0]],
                "anchorSeatIds": ["SEC35-A-1", "SEC35-A-5"],
            },
            "B": {
                "projectedAnchorPixels": [[110.0, 240.0], [190.0, 240.0]],
                "anchorSeatIds": ["SEC35-B-1", "SEC35-B-5"],
            },
        }
        world_rows = {
            "A": {"publishedSeatCount": 5},
            "B": {"publishedSeatCount": 5},
        }

        result = infer_section_fraction(sample, registration_rows, world_rows)

        self.assertTrue(result["eligible"])
        self.assertTrue(math.isclose(result["sectionFraction"], 0.5, abs_tol=1e-12))
        self.assertTrue(math.isclose(result["bracketEstimateSpread"], 0.0, abs_tol=1e-12))

    def test_shade_boundary_returns_final_all_shaded_suffix_only(self) -> None:
        coordinates = np.arange(0.0, 6.0, 1.0)

        boundary = shade_suffix_boundary(
            coordinates,
            np.asarray([False, True, False, True, True, True]),
        )

        self.assertEqual(boundary, 2.5)
        self.assertIsNone(
            shade_suffix_boundary(
                coordinates,
                np.asarray([False, True, True, True, True, False]),
            )
        )

    def test_artifact_version_is_stable_across_key_order(self) -> None:
        first = marlins_shade_artifact_version({"alpha": 1, "beta": [2, 3]})
        second = marlins_shade_artifact_version({"beta": [2, 3], "alpha": 1})

        self.assertEqual(first, second)
        self.assertTrue(first.startswith("sha256:"))


class ResearchArtifactFreshnessTests(unittest.TestCase):
    def test_accepts_nested_checksum_locked_input_records(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "nested.json"
            source.write_text(
                json.dumps({"artifactVersion": "sha256:nested-v1"}),
                encoding="utf-8",
            )
            artifact = root / "derived.json"
            artifact.write_text(
                json.dumps({
                    "inputs": {
                        "worldRows": {
                            "path": str(source),
                            "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                            "artifactVersion": "sha256:nested-v1",
                        },
                    },
                }),
                encoding="utf-8",
            )

            result = audit_artifact(artifact)

            self.assertTrue(result["allInputsFresh"])
            self.assertEqual(result["inputCount"], 1)
            self.assertEqual(result["inputs"][0]["inputStem"], "worldRows")

    def test_fails_closed_when_artifact_has_no_checksum_locked_provenance(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / "unlocked.json"
            artifact.write_text(
                json.dumps({"artifactVersion": "sha256:unlocked"}),
                encoding="utf-8",
            )

            result = audit_artifact(artifact)

            self.assertFalse(result["allInputsFresh"])
            self.assertEqual(result["inputCount"], 0)
            self.assertEqual(
                result["blockers"],
                ["ARTIFACT_INPUT_PROVENANCE_NOT_CHECKSUM_LOCKED"],
            )

    def test_accepts_checksum_locked_current_input(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.json"
            source.write_text(
                json.dumps({"artifactVersion": "sha256:source-v1"}),
                encoding="utf-8",
            )
            artifact = root / "derived.json"
            artifact.write_text(
                json.dumps({
                    "artifactVersion": "sha256:derived-v1",
                    "inputs": {
                        "sourcePath": str(source),
                        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                        "sourceArtifactVersion": "sha256:source-v1",
                    },
                }),
                encoding="utf-8",
            )

            result = audit_artifact(artifact)

            self.assertTrue(result["allInputsFresh"])
            self.assertEqual(result["freshInputCount"], 1)
            self.assertEqual(result["blockers"], [])

    def test_fails_closed_after_review_source_changes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "review.json"
            source.write_text(
                json.dumps({"artifactVersion": "sha256:accepted"}),
                encoding="utf-8",
            )
            original_checksum = hashlib.sha256(source.read_bytes()).hexdigest()
            artifact = root / "derived.json"
            artifact.write_text(
                json.dumps({
                    "artifactVersion": "sha256:derived-v1",
                    "inputs": {
                        "reviewPath": str(source),
                        "reviewSha256": original_checksum,
                        "reviewArtifactVersion": "sha256:accepted",
                    },
                }),
                encoding="utf-8",
            )
            source.write_text(
                json.dumps({"artifactVersion": "sha256:rejected"}),
                encoding="utf-8",
            )

            result = build_audit([artifact])

            self.assertFalse(result["summary"]["allArtifactsFresh"])
            self.assertIn("ARTIFACT_INPUT_CHECKSUM_MISMATCH", result["blockers"])
            self.assertIn("ARTIFACT_INPUT_VERSION_MISMATCH", result["blockers"])
            self.assertFalse(result["artifacts"][0]["inputs"][0]["fresh"])

    def test_fails_closed_for_transitively_stale_input(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.json"
            source.write_text(json.dumps({"value": 1}), encoding="utf-8")
            source_checksum = hashlib.sha256(source.read_bytes()).hexdigest()
            middle = root / "middle.json"
            middle.write_text(
                json.dumps({
                    "inputs": {
                        "sourcePath": str(source),
                        "sourceSha256": source_checksum,
                    },
                }),
                encoding="utf-8",
            )
            middle_checksum = hashlib.sha256(middle.read_bytes()).hexdigest()
            derived = root / "derived.json"
            derived.write_text(
                json.dumps({
                    "inputs": {
                        "middlePath": str(middle),
                        "middleSha256": middle_checksum,
                    },
                }),
                encoding="utf-8",
            )
            source.write_text(json.dumps({"value": 2}), encoding="utf-8")

            result = audit_artifact(derived)

            self.assertFalse(result["allInputsFresh"])
            self.assertIn("ARTIFACT_TRANSITIVE_INPUT_STALE", result["blockers"])
            nested = result["inputs"][0]["transitiveAudit"]
            self.assertIn("ARTIFACT_INPUT_CHECKSUM_MISMATCH", nested["blockers"])


class LockedBroadcastCameraTransferTests(unittest.TestCase):
    def test_reports_identity_camera_without_artificial_change(self) -> None:
        homography = np.eye(3, dtype=np.float64)

        diagnostics = transformation_diagnostics(homography, 1280, 720)

        self.assertTrue(math.isclose(
            diagnostics["maximumSampleDisplacementPixels"],
            0.0,
            rel_tol=0,
            abs_tol=1e-12,
        ))
        self.assertTrue(math.isclose(
            diagnostics["maximumScaleDeltaFraction"],
            0.0,
            rel_tol=0,
            abs_tol=1e-12,
        ))
        self.assertTrue(math.isclose(
            diagnostics["rotationDegrees"],
            0.0,
            rel_tol=0,
            abs_tol=1e-12,
        ))

    def test_preserves_declared_translation_in_transfer_model(self) -> None:
        homography = np.asarray(
            [[1.0, 0.0, 0.75], [0.0, 1.0, -0.5], [0.0, 0.0, 1.0]],
            dtype=np.float64,
        )
        points = np.asarray([[10.0, 20.0], [100.0, 200.0]], dtype=np.float64)

        transformed = transform_camera_points(points, homography)
        diagnostics = transformation_diagnostics(homography, 1280, 720)

        self.assertTrue(np.allclose(
            transformed,
            [[10.75, 19.5], [100.75, 199.5]],
            rtol=0,
            atol=1e-12,
        ))
        self.assertTrue(math.isclose(
            diagnostics["maximumSampleDisplacementPixels"],
            math.hypot(0.75, 0.5),
            rel_tol=0,
            abs_tol=1e-9,
        ))

    def test_counts_spatial_support_and_hull_area(self) -> None:
        points = np.asarray(
            [[10.0, 10.0], [90.0, 10.0], [90.0, 90.0], [10.0, 90.0]],
            dtype=np.float64,
        )

        cells = spatial_cell_ids(points, 100, 100, 2, 2)
        hull_fraction = convex_hull_area_fraction(points, 10_000)

        self.assertEqual(sorted(set(cells.tolist())), [0, 1, 2, 3])
        self.assertTrue(math.isclose(
            hull_fraction,
            0.64,
            rel_tol=0,
            abs_tol=1e-12,
        ))


class DenverRangePointControlTests(unittest.TestCase):
    def test_builds_bounded_arcgis_query_in_orthophoto_crs(self) -> None:
        parameters = spatial_query_parameters(
            3_142_212.75,
            1_700_543.0,
            1_000.0,
            750.0,
        )

        self.assertEqual(parameters["inSR"], str(OUTPUT_CRS))
        self.assertEqual(parameters["geometryType"], "esriGeometryEnvelope")
        self.assertEqual(
            parameters["geometry"],
            "3141212.750000,1699793.000000,3143212.750000,1701293.000000",
        )
        url = build_url("https://example.invalid/query", parameters)
        self.assertIn("inSR=6428", url)
        self.assertIn("geometryType=esriGeometryEnvelope", url)

    def test_requires_official_gps_service_identity_and_point_layer(self) -> None:
        service = {
            "serviceDescription": "Coordinate data is established by GPS observation.",
            "spatialReference": {"wkid": 2877},
            "layers": [{"id": 51, "geometryType": "esriGeometryPoint"}],
        }
        layer = {
            "id": 51,
            "geometryType": "esriGeometryPoint",
            "fields": [{"name": "OBJECTID", "type": "esriFieldTypeOID"}],
        }

        validate_service(service)
        self.assertEqual(validate_layer(layer), "OBJECTID")

    def test_rejects_duplicate_or_unprojected_range_points(self) -> None:
        valid = {
            "spatialReference": {"latestWkid": 6428},
            "features": [
                {
                    "attributes": {"OBJECTID": 7},
                    "geometry": {"x": 3_142_000.25, "y": 1_700_000.5},
                }
            ],
        }
        self.assertEqual(
            validate_features(valid, "OBJECTID", 1),
            valid["features"],
        )
        duplicate = {
            **valid,
            "features": [valid["features"][0], valid["features"][0]],
        }
        with self.assertRaisesRegex(ValueError, "duplicate"):
            validate_features(duplicate, "OBJECTID", 2)

    def test_world_file_uses_upper_left_pixel_center(self) -> None:
        values = [0.25, 0.0, 0.0, -0.25, 3_141_392.1248, 1_702_951.8747]

        self.assertEqual(
            source_pixel_from_world(3_141_392.1248, 1_702_951.8747, values),
            (0.0, -0.0),
        )
        self.assertEqual(
            source_pixel_from_world(3_141_392.3748, 1_702_951.6247, values),
            (1.0, 1.0),
        )

    def test_registration_world_file_mapping_matches_review_mapping(self) -> None:
        values = [0.25, 0.0, 0.0, -0.25, 3_141_392.1248, 1_702_951.8747]
        world = world_from_source_pixel(124.25, 78.5, values)

        self.assertTrue(np.allclose(
            world,
            [3_141_423.1873, 1_702_932.2497],
            rtol=0,
            atol=1e-9,
        ))
        self.assertTrue(np.allclose(
            source_pixel_from_world(world[0], world[1], values),
            (124.25, 78.5),
            rtol=0,
            atol=1e-9,
        ))

    def test_rigid_fit_recovers_unit_scale_rotation_and_translation(self) -> None:
        image = np.asarray([
            [0.0, 0.0],
            [200.0, 0.0],
            [0.0, 150.0],
            [200.0, 150.0],
        ])
        angle = math.radians(0.45)
        rotation = np.asarray([
            [math.cos(angle), -math.sin(angle)],
            [math.sin(angle), math.cos(angle)],
        ])
        survey = transform_points(image, rotation, np.asarray([3.25, -1.75]))

        fit = fit_rigid(image, survey)

        self.assertTrue(np.allclose(fit["rotation"], rotation, rtol=0, atol=1e-12))
        self.assertTrue(np.allclose(
            fit["translation"],
            [3.25, -1.75],
            rtol=0,
            atol=1e-12,
        ))
        self.assertLess(float(np.max(fit["residuals"])), 1e-10)
        self.assertTrue(math.isclose(
            fit["cartesianCounterclockwiseCorrectionDegrees"],
            0.45,
            rel_tol=0,
            abs_tol=1e-10,
        ))

    def test_similarity_fit_exposes_scale_drift_without_hiding_it(self) -> None:
        image = np.asarray([
            [0.0, 0.0],
            [500.0, 0.0],
            [0.0, 300.0],
            [500.0, 300.0],
        ])
        angle = math.radians(-0.25)
        rotation = np.asarray([
            [math.cos(angle), -math.sin(angle)],
            [math.sin(angle), math.cos(angle)],
        ])
        survey = transform_points(
            image,
            rotation,
            np.asarray([-2.0, 4.0]),
            scale=1.0005,
        )

        fit = fit_similarity(image, survey)

        self.assertTrue(math.isclose(fit["scale"], 1.0005, rel_tol=0, abs_tol=1e-12))
        self.assertLess(float(np.max(fit["residuals"])), 1e-9)

    def test_control_geometry_and_leave_one_out_are_independent_gates(self) -> None:
        image = np.asarray([
            [0.0, 0.0],
            [200.0, 0.0],
            [0.0, 200.0],
            [200.0, 200.0],
        ])
        survey = image + np.asarray([2.0, -3.0])

        geometry = spatial_geometry(survey)
        errors = leave_one_out_errors(image, survey)

        self.assertGreaterEqual(geometry["maximumPairwiseBaselineFeet"], 200.0)
        self.assertGreaterEqual(geometry["maximumTriangleAreaSquareFeet"], 20_000.0)
        self.assertLess(float(np.max(errors)), 1e-9)
        self.assertEqual(
            spatial_geometry(np.asarray([[0.0, 0.0], [100.0, 0.0], [250.0, 0.0]]))[
                "maximumTriangleAreaSquareFeet"
            ],
            0.0,
        )

    def test_seeded_monte_carlo_quantifies_pixel_and_survey_uncertainty(self) -> None:
        values = [0.25, 0.0, 0.0, -0.25, 1_000.0, 2_000.0]
        pixels = np.asarray([
            [0.0, 0.0],
            [800.0, 0.0],
            [0.0, 800.0],
            [800.0, 800.0],
        ])
        image_world = np.asarray([
            world_from_source_pixel(point[0], point[1], values)
            for point in pixels
        ])
        survey = image_world + np.asarray([1.0, -2.0])

        result = monte_carlo_rigid_uncertainty(
            pixels,
            survey,
            np.full(4, 0.5),
            values,
            0.2,
            np.mean(image_world, axis=0),
            1_000,
            17,
        )

        self.assertTrue(result["includesSurveySourceAccuracy"])
        self.assertLess(result["orientationUncertainty95Degrees"], 1.0)
        self.assertLess(result["anchorHorizontalUncertainty95Feet"], 1.0)

    def test_complete_registration_audit_keeps_unknown_source_accuracy_blocked(self) -> None:
        world_values = [0.25, 0.0, 0.0, -0.25, 1_000.0, 2_000.0]
        source_pixels = [
            [100.0, 100.0],
            [900.0, 100.0],
            [100.0, 900.0],
            [900.0, 900.0],
        ]
        survey_points = [
            (world_from_source_pixel(point[0], point[1], world_values) + [1.0, -2.0]).tolist()
            for point in source_pixels
        ]
        queue = {
            "artifactKind": "denver-range-point-orthophoto-review-queue",
            "artifactVersion": "sha256:synthetic-queue",
            "stadiumId": "rockies",
            "reviewParameters": {"worldFileValues": world_values},
            "points": [
                {
                    "objectId": index + 1,
                    "insideOrthophoto": True,
                    "surveyCoordinateProjectedFeet": survey_points[index],
                    "cropPixelWindow": {
                        "left": point[0] - 10,
                        "top": point[1] - 10,
                        "right": point[0] + 11,
                        "bottom": point[1] + 11,
                    },
                }
                for index, point in enumerate(source_pixels)
            ],
        }
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            queue_path = directory / "queue.json"
            queue_bytes = (json.dumps(queue, indent=2) + "\n").encode("utf-8")
            queue_path.write_bytes(queue_bytes)
            review = {
                "artifactKind": "denver-range-point-orthophoto-correspondence-review",
                "reviewState": "completed",
                "sourceReviewQueue": {
                    "artifactVersion": queue["artifactVersion"],
                    "sha256": hashlib.sha256(queue_bytes).hexdigest(),
                },
                "reviewProtocol": {
                    "reviewerId": "synthetic-regression-test",
                    "completedAtUtc": "2026-08-10T12:00:00Z",
                    "method": "Synthetic exact controls for end-to-end validation.",
                },
                "surveySourceAccuracyEvidence": None,
                "points": [
                    {
                        "objectId": index + 1,
                        "acceptedForRegistration": True,
                        "observedSourcePixelCoordinate": point,
                        "pixelCenterUncertainty95Pixels": 0.25,
                        "visibleFeatureKind": "synthetic-test-monument-center",
                        "evidenceNote": "Synthetic end-to-end regression fixture.",
                    }
                    for index, point in enumerate(source_pixels)
                ],
            }
            review_path = directory / "review.json"
            review_path.write_text(json.dumps(review, indent=2) + "\n", encoding="utf-8")
            output_path = directory / "audit.json"
            arguments = [
                "auditDenverRangePointOrthophotoRegistration.py",
                "--review-queue",
                str(queue_path),
                "--correspondence-review",
                str(review_path),
                "--output",
                str(output_path),
                "--monte-carlo-samples",
                "1000",
                "--seed",
                "19",
            ]

            with patch.object(sys, "argv", arguments), contextlib.redirect_stdout(io.StringIO()):
                registration_audit_main()

            artifact = json.loads(output_path.read_text(encoding="utf-8"))
            self.assertFalse(artifact["registrationAcceptance"]["accepted"])
            self.assertIn(
                "RANGE_POINT_NUMERIC_HORIZONTAL_ACCURACY_95_UNVERIFIED",
                artifact["registrationAcceptance"]["blockers"],
            )
            self.assertIn(
                "ORTHOPHOTO_COMBINED_HORIZONTAL_UNCERTAINTY_95_EXCEEDS_ONE_FOOT",
                artifact["registrationAcceptance"]["blockers"],
            )
            self.assertFalse(artifact["publication"]["eligibleForExactRowShade"])


class NgsOrthophotoControlTests(unittest.TestCase):
    def test_scaled_reticle_uses_source_pixel_center_semantics(self) -> None:
        self.assertEqual(scaled_pixel_center(0.0, 6), 2.5)
        self.assertEqual(scaled_pixel_center(1.0, 6), 8.5)
        self.assertEqual(scaled_pixel_center(0.25, 24), 17.5)
        with self.assertRaisesRegex(ValueError, "positive"):
            scaled_pixel_center(0.0, 0)

    def test_stadium_target_must_be_inside_control_hull(self) -> None:
        controls = np.asarray([
            [0.0, 0.0],
            [1_000.0, 0.0],
            [0.0, 1_000.0],
        ])

        inside, weights, indices = point_inside_control_hull(
            np.asarray([250.0, 300.0]),
            controls,
        )
        outside, _, _ = point_inside_control_hull(
            np.asarray([800.0, 800.0]),
            controls,
        )

        self.assertTrue(inside)
        self.assertFalse(outside)
        self.assertEqual(indices, [0, 1, 2])
        self.assertTrue(math.isclose(sum(weights or []), 1.0, abs_tol=1e-12))

    def test_ngs_monte_carlo_uses_each_tile_world_file_and_accuracy(self) -> None:
        world_values = [
            [0.25, 0.0, 0.0, -0.25, 1_000.0, 2_000.0],
            [0.25, 0.0, 0.0, -0.25, 1_200.0, 2_000.0],
            [0.25, 0.0, 0.0, -0.25, 1_000.0, 2_200.0],
        ]
        pixels = np.zeros((3, 2), dtype=float)
        image_world = np.asarray([
            world_from_source_pixel(0.0, 0.0, values)
            for values in world_values
        ])
        survey = image_world + np.asarray([-0.25, 0.15])

        result = ngs_monte_carlo_rigid_uncertainty(
            pixels,
            survey,
            np.full(3, 0.5),
            np.asarray([0.02, 0.03, 0.04]),
            world_values,
            np.asarray([1_050.0, 2_050.0]),
            1_000,
            23,
        )

        self.assertTrue(result["includesIndividualNgsSurveyAccuracy"])
        self.assertTrue(result["includesIndividualVisualPixelUncertainty"])
        self.assertLess(result["orientationUncertainty95Degrees"], 1.0)
        self.assertLess(result["anchorHorizontalUncertainty95Feet"], 1.0)

    def test_survey_qc_monte_carlo_keeps_generic_provenance_labels(self) -> None:
        world_values = [
            [0.25, 0.0, 0.0, -0.25, 1_000.0, 2_000.0],
            [0.25, 0.0, 0.0, -0.25, 1_200.0, 2_000.0],
            [0.25, 0.0, 0.0, -0.25, 1_000.0, 2_200.0],
        ]
        pixels = np.zeros((3, 2), dtype=float)
        image_world = np.asarray([
            world_from_source_pixel(0.0, 0.0, values)
            for values in world_values
        ])
        survey = image_world + np.asarray([-0.25, 0.15])

        result = survey_qc_monte_carlo_rigid_uncertainty(
            pixels,
            survey,
            np.full(3, 0.5),
            np.asarray([0.02, 0.03, 0.04]),
            world_values,
            np.asarray([1_050.0, 2_050.0]),
            1_000,
            29,
        )

        self.assertTrue(result["includesIndividualSurveyAccuracy"])
        self.assertTrue(result["includesIndividualVisualPixelUncertainty"])
        self.assertNotIn("includesIndividualNgsSurveyAccuracy", result)
        self.assertLess(result["orientationUncertainty95Degrees"], 1.0)
        self.assertLess(result["anchorHorizontalUncertainty95Feet"], 1.0)

    def test_rigid_ground_frame_correction_preserves_unit_scale(self) -> None:
        points = np.asarray([[10.0, 20.0], [30.0, 40.0]])
        angle = math.radians(0.1)
        rotation = np.asarray([
            [math.cos(angle), -math.sin(angle)],
            [math.sin(angle), math.cos(angle)],
        ])

        corrected = apply_rigid_correction(
            points,
            rotation,
            np.asarray([2.0, -3.0]),
        )

        self.assertTrue(np.allclose(
            corrected,
            transform_points(points, rotation, np.asarray([2.0, -3.0])),
            rtol=0,
            atol=1e-12,
        ))

    def test_requires_exact_ngs_accuracy_metadata_semantics(self) -> None:
        metadata = {
            "lat": "Latitude, in decimal degrees, positive north of the equator",
            "lon": "Longitude in decimal degrees; negative west of the prime meridian",
            "netAccHz": "Network accuracy for horizontal, 2-sigma in 2-dimensions",
            "posDatum": "A synonym for Reference Frame",
            "posSource": "Source of Horizontal Position ",
        }

        validate_ngs_metadata(metadata)
        changed = {**metadata, "netAccHz": "Unknown accuracy"}
        with self.assertRaisesRegex(ValueError, "netAccHz"):
            validate_ngs_metadata(changed)

    def test_projects_nad83_2011_mark_into_orthophoto_frame(self) -> None:
        mapping = datum_mapping("NAD 83(2011)")
        self.assertIsNotNone(mapping)

        projection = project_candidate(
            39.7557092584,
            -104.9941885461,
            mapping,
        )

        self.assertEqual(projection["sourceCoordinateReferenceSystem"], "EPSG:6318")
        self.assertEqual(projection["targetCoordinateReferenceSystem"], "EPSG:6428")
        self.assertEqual(projection["targetHorizontalUnit"], "US survey foot")
        self.assertTrue(np.allclose(
            projection["targetProjectedCoordinateFeet"],
            [3_142_212.782472083, 1_700_543.082521678],
            rtol=0,
            atol=1e-6,
        ))
        self.assertEqual(projection["transformAccuracyFeet"], 0.0)

    def test_does_not_label_projected_metres_as_feet(self) -> None:
        mapping = datum_mapping("NAD 83(2011)")
        self.assertIsNotNone(mapping)

        projection = project_candidate(
            39.2838,
            -76.6218,
            mapping,
            target_crs=6347,
        )

        self.assertEqual(projection["targetCoordinateReferenceSystem"], "EPSG:6347")
        self.assertEqual(projection["targetHorizontalUnit"], "metre")
        self.assertIn("targetProjectedCoordinate", projection)
        self.assertNotIn("targetProjectedCoordinateFeet", projection)

    def test_candidate_keeps_unconfirmed_network_accuracy_unit_blocked(self) -> None:
        center_latitude = 39.7557092584
        center_longitude = -104.9941885461
        mark = {
            "pid": "AB1234",
            "name": "SYNTHETIC NGS CONTROL",
            "lat": str(center_latitude),
            "lon": str(center_longitude),
            "posDatum": "NAD 83(2011)",
            "posSource": "ADJUSTED",
            "netAccHz": "0.72",
            "lastRecovered": "20250801",
            "lastRecoveredBy": "TEST",
            "condition": "GOOD",
            "monumentType": "DD = SURVEY DISK",
            "setting": "Synthetic regression setting",
            "stamping": "AB1234",
        }

        candidate = candidate_from_mark(
            mark,
            center_latitude,
            center_longitude,
            100.0,
        )

        self.assertTrue(math.isclose(
            haversine_distance_feet(
                center_latitude,
                center_longitude,
                center_latitude,
                center_longitude,
            ),
            0.0,
            rel_tol=0,
            abs_tol=1e-12,
        ))
        self.assertFalse(candidate["controlEligibility"]["eligible"])
        self.assertEqual(
            candidate["controlEligibility"]["blockers"],
            ["NGS_HORIZONTAL_NETWORK_ACCURACY_UNIT_REQUIRES_DATASHEET"],
        )
        self.assertFalse(candidate["networkHorizontalAccuracyUnitEstablished"])

    def test_candidate_rejects_scaled_position_and_unknown_condition(self) -> None:
        mark = {
            "pid": "CD5678",
            "lat": "39.7557",
            "lon": "-104.9942",
            "posDatum": "NAD 83(1986)",
            "posSource": "SCALED",
            "netAccHz": "",
            "lastRecovered": "19900101",
            "condition": "",
        }

        candidate = candidate_from_mark(mark, 39.7557, -104.9942, 100.0)

        self.assertIn(
            "NGS_POSITION_SOURCE_NOT_ADJUSTED",
            candidate["controlEligibility"]["blockers"],
        )
        self.assertIn(
            "NGS_HORIZONTAL_NETWORK_ACCURACY_MISSING",
            candidate["controlEligibility"]["blockers"],
        )
        self.assertIn(
            "NGS_MARK_CONDITION_NOT_GOOD",
            candidate["controlEligibility"]["blockers"],
        )

    def test_parses_only_explicit_datasheet_95_percent_centimetre_accuracy(self) -> None:
        datasheet = b"""<html><body><pre>
 AC6803  PID         -  AC6803
 AC6803  Network accuracy estimates per FGDC Geospatial Positioning Accuracy
 AC6803  Standards:
 AC6803      FGDC (95% conf, cm)    Standard deviation (cm)    CorrNE
 AC6803      Horiz  Ellip           SD_N   SD_E   SD_h      (unitless)
 AC6803  -------------------------------------------------------------------
 AC6803  NETWORK    0.56   1.10     0.25   0.20   0.56   -0.05687389
 AC6803  -------------------------------------------------------------------
 </pre></body></html>"""

        parsed = parse_datasheet_horizontal_accuracy(datasheet, "AC6803", 0.56)

        self.assertEqual(parsed["horizontalAccuracy95Centimetres"], 0.56)
        self.assertTrue(math.isclose(
            parsed["horizontalAccuracy95Feet"],
            0.56 / 30.48,
            rel_tol=0,
            abs_tol=1e-15,
        ))
        self.assertEqual(
            parsed["confidenceDefinition"],
            "FGDC circular horizontal 95 percent confidence",
        )

    def test_rejects_datasheet_api_mismatch_or_missing_unit_header(self) -> None:
        valid = b"""AA1234  PID - AA1234
AA1234  FGDC (95% conf, cm) Standard deviation (cm) CorrNE
AA1234  NETWORK 0.50 1.00 0.10 0.20 0.30 0.00000000
"""
        with self.assertRaisesRegex(ValueError, "disagree"):
            parse_datasheet_horizontal_accuracy(valid, "AA1234", 0.51)
        without_header = valid.replace(b"FGDC (95% conf, cm)", b"FGDC accuracy")
        with self.assertRaisesRegex(ValueError, "centimetre units"):
            parse_datasheet_horizontal_accuracy(without_header, "AA1234", 0.50)

if __name__ == "__main__":
    unittest.main()

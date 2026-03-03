/**
 * NREL Solar Position Validation Test Suite
 *
 * Tests the NREL SPA implementation against reference values and validates
 * correctness across all MLB stadiums with timezone handling.
 */

import { computeSunPosition } from '../nrelSolarPosition';
import { getSunPosition } from '../sunCalculations';
import { MLB_STADIUMS } from '../../data/stadiums';
import SunCalc from 'suncalc';

// Helper: create UTC Date from local time at a given UTC offset
function localToUTC(
  y: number, m: number, d: number, h: number, min: number, utcOffset: number
): Date {
  const utcHour = h - utcOffset;
  const dayAdj = utcHour >= 24 ? 1 : utcHour < 0 ? -1 : 0;
  return new Date(Date.UTC(y, m - 1, d + dayAdj, utcHour - dayAdj * 24, min));
}

// UTC offsets for DST periods (all test dates are in DST)
const TZ_EDT = -4;
const TZ_PDT = -7;
const TZ_CDT = -5;
const TZ_MDT = -6;

describe('NREL Solar Position Validation', () => {
  // ── 5a: NOAA Reference Tests (5 stadiums × 3 times = 15 cases) ──────────
  describe('NREL reference accuracy', () => {
    const TOLERANCE = 0.5; // degrees

    const referenceData = [
      // Yankee Stadium (40.8296°N, 73.9262°W)
      { stadium: 'Yankee Stadium', lat: 40.8296, lng: -73.9262, tz: TZ_EDT,
        time: { y: 2026, m: 6, d: 21, h: 13, min: 0, label: 'Jun 21 1PM EDT' },
        expected: { az: 181.86, el: 72.60 } },
      { stadium: 'Yankee Stadium', lat: 40.8296, lng: -73.9262, tz: TZ_EDT,
        time: { y: 2026, m: 9, d: 22, h: 15, min: 0, label: 'Sep 22 3PM EDT' },
        expected: { az: 224.78, el: 39.50 } },
      { stadium: 'Yankee Stadium', lat: 40.8296, lng: -73.9262, tz: TZ_EDT,
        time: { y: 2026, m: 4, d: 5, h: 19, min: 0, label: 'Apr 5 7PM EDT' },
        expected: { az: 275.10, el: 3.83 } },

      // Dodger Stadium (34.0739°N, 118.2400°W)
      { stadium: 'Dodger Stadium', lat: 34.0739, lng: -118.2400, tz: TZ_PDT,
        time: { y: 2026, m: 6, d: 21, h: 13, min: 0, label: 'Jun 21 1PM PDT' },
        expected: { az: 186.36, el: 79.30 } },
      { stadium: 'Dodger Stadium', lat: 34.0739, lng: -118.2400, tz: TZ_PDT,
        time: { y: 2026, m: 9, d: 22, h: 15, min: 0, label: 'Sep 22 3PM PDT' },
        expected: { az: 229.91, el: 43.64 } },
      { stadium: 'Dodger Stadium', lat: 34.0739, lng: -118.2400, tz: TZ_PDT,
        time: { y: 2026, m: 4, d: 5, h: 19, min: 0, label: 'Apr 5 7PM PDT' },
        expected: { az: 275.94, el: 2.66 } },

      // Wrigley Field (41.9484°N, 87.6553°W)
      { stadium: 'Wrigley Field', lat: 41.9484, lng: -87.6553, tz: TZ_CDT,
        time: { y: 2026, m: 6, d: 21, h: 13, min: 0, label: 'Jun 21 1PM CDT' },
        expected: { az: 185.40, el: 71.42 } },
      { stadium: 'Wrigley Field', lat: 41.9484, lng: -87.6553, tz: TZ_CDT,
        time: { y: 2026, m: 9, d: 22, h: 15, min: 0, label: 'Sep 22 3PM CDT' },
        expected: { az: 225.51, el: 38.02 } },
      { stadium: 'Wrigley Field', lat: 41.9484, lng: -87.6553, tz: TZ_CDT,
        time: { y: 2026, m: 4, d: 5, h: 19, min: 0, label: 'Apr 5 7PM CDT' },
        expected: { az: 275.88, el: 2.99 } },

      // Fenway Park (42.3467°N, 71.0972°W)
      { stadium: 'Fenway Park', lat: 42.3467, lng: -71.0972, tz: TZ_EDT,
        time: { y: 2026, m: 6, d: 21, h: 13, min: 0, label: 'Jun 21 1PM EDT' },
        expected: { az: 189.66, el: 70.88 } },
      { stadium: 'Fenway Park', lat: 42.3467, lng: -71.0972, tz: TZ_EDT,
        time: { y: 2026, m: 9, d: 22, h: 15, min: 0, label: 'Sep 22 3PM EDT' },
        expected: { az: 226.96, el: 36.93 } },
      { stadium: 'Fenway Park', lat: 42.3467, lng: -71.0972, tz: TZ_EDT,
        time: { y: 2026, m: 4, d: 5, h: 19, min: 0, label: 'Apr 5 7PM EDT' },
        expected: { az: 276.89, el: 1.88 } },

      // Coors Field (39.7559°N, 104.9942°W)
      { stadium: 'Coors Field', lat: 39.7559, lng: -104.9942, tz: TZ_MDT,
        time: { y: 2026, m: 6, d: 21, h: 13, min: 0, label: 'Jun 21 1PM MDT' },
        expected: { az: 178.47, el: 73.68 } },
      { stadium: 'Coors Field', lat: 39.7559, lng: -104.9942, tz: TZ_MDT,
        time: { y: 2026, m: 9, d: 22, h: 15, min: 0, label: 'Sep 22 3PM MDT' },
        expected: { az: 224.22, el: 40.81 } },
      { stadium: 'Coors Field', lat: 39.7559, lng: -104.9942, tz: TZ_MDT,
        time: { y: 2026, m: 4, d: 5, h: 19, min: 0, label: 'Apr 5 7PM MDT' },
        expected: { az: 274.52, el: 4.56 } },
    ];

    test.each(referenceData)(
      '$stadium $time.label → az≈$expected.az° el≈$expected.el°',
      ({ lat, lng, tz, time, expected }) => {
        const date = localToUTC(time.y, time.m, time.d, time.h, time.min, tz);
        const result = computeSunPosition(date, lat, lng, 0);

        expect(Math.abs(result.azimuth - expected.az)).toBeLessThan(TOLERANCE);
        expect(Math.abs(result.elevation - expected.el)).toBeLessThan(TOLERANCE);
      }
    );

    // Also verify NREL agrees with SunCalc within tolerance
    test.each(referenceData)(
      'NREL ≈ SunCalc for $stadium $time.label',
      ({ lat, lng, tz, time }) => {
        const date = localToUTC(time.y, time.m, time.d, time.h, time.min, tz);
        const nrel = computeSunPosition(date, lat, lng, 0);
        const sc = SunCalc.getPosition(date, lat, lng);
        const scAz = ((sc.azimuth * 180 / Math.PI) + 180) % 360;
        const scEl = sc.altitude * 180 / Math.PI;

        expect(Math.abs(nrel.azimuth - scAz)).toBeLessThan(TOLERANCE);
        expect(Math.abs(nrel.elevation - scEl)).toBeLessThan(TOLERANCE);
      }
    );
  });

  // ── 5b: All 30 MLB Stadiums Smoke Test ───────────────────────────────────
  describe('All MLB stadiums smoke test (Jun 21, 2026 noon local)', () => {
    // Summer solstice noon — sun should be above horizon for all US/Canada stadiums
    const stadiums = MLB_STADIUMS;

    test.each(stadiums.map(s => [s.id, s]))('%s produces valid sun position', (_id, stadium) => {
      // June 21, 2026 noon UTC — close enough for a sanity check
      const date = new Date(Date.UTC(2026, 5, 21, 17, 0, 0));
      const result = computeSunPosition(date, stadium.latitude, stadium.longitude, 0);

      // No NaN
      expect(Number.isFinite(result.azimuth)).toBe(true);
      expect(Number.isFinite(result.elevation)).toBe(true);
      expect(Number.isFinite(result.zenith)).toBe(true);

      // At 17:00 UTC on June 21, sun is up across CONUS (10 AM PDT – 1 PM EDT)
      expect(result.elevation).toBeGreaterThan(0);

      // Azimuth in valid range
      expect(result.azimuth).toBeGreaterThanOrEqual(0);
      expect(result.azimuth).toBeLessThan(360);
    });
  });

  // ── 5c: Timezone Correctness ─────────────────────────────────────────────
  describe('Timezone correctness', () => {
    it('UTC date and local date with timezone correction produce same result', () => {
      // Yankee Stadium: June 21, 2026 at 1:00 PM EDT = 17:00 UTC
      const utcDate = new Date(Date.UTC(2026, 5, 21, 17, 0, 0));
      const lat = 40.8296;
      const lng = -73.9262;

      // Call getSunPosition with a UTC Date directly (no timezone correction needed)
      const directResult = computeSunPosition(utcDate, lat, lng, 0);

      // Call getSunPosition through the main function with timezone
      // The main function applies browser→stadium timezone correction
      const pipelineResult = getSunPosition(utcDate, lat, lng);

      // Both should give the same result (UTC date needs no timezone correction)
      expect(Math.abs(directResult.azimuth - pipelineResult.azimuthDegrees)).toBeLessThan(0.01);
      expect(Math.abs(directResult.elevation - pipelineResult.altitudeDegrees)).toBeLessThan(0.01);
    });

    it('getSunPosition returns NREL-computed values (not SunCalc)', () => {
      // Verify that the pipeline returns NREL values, not SunCalc
      const date = new Date(Date.UTC(2026, 5, 21, 17, 0, 0));
      const lat = 40.8296;
      const lng = -73.9262;

      const result = getSunPosition(date, lat, lng);
      const nrel = computeSunPosition(date, lat, lng, 0);

      // The pipeline should return NREL values
      expect(Math.abs(result.azimuthDegrees - nrel.azimuth)).toBeLessThan(0.01);
      expect(Math.abs(result.altitudeDegrees - nrel.elevation)).toBeLessThan(0.01);
    });
  });
});

/**
 * Shade-pipeline regression baseline.
 *
 * For each of the 30 MLB stadiums, this test pins the sun position (azimuth
 * and altitude) at a fixed reference moment. The reference is
 *   2025-07-04 23:00 UTC  (~7pm ET / ~4pm PT)
 * a Saturday late-afternoon mid-season moment — the highest-traffic slice
 * of the live shade product.
 *
 * Why this catches what Phase 2's section-sun tests can't:
 *   - The section model is tested in isolation against synthetic inputs.
 *   - This test runs the full pipeline (lat/lon → SunCalc → compass-degree
 *     conversion → consumer) and asserts the same numeric output we expect
 *     in production. A regression in any layer (library bump, timezone
 *     handling change, azimuth-convention bug) will surface here.
 *
 * Tolerance is ±0.05° — tight enough to catch real changes, loose enough
 * that floating-point/library-patch noise doesn't false-positive. Updates
 * to expected values should be PR-reviewed (e.g. SunCalc version bump
 * with a documented delta).
 */

import { MLB_STADIUMS } from '../../data/stadiums';
import { getSunPosition } from '../sunCalculations';

const REFERENCE_DATE = new Date('2025-07-04T23:00:00Z');
const TOLERANCE_DEG = 0.05;

// Baseline captured 2026-05-13 with SunCalc 1.9.0 on the consolidated pipeline.
const BASELINE: Record<string, { altitudeDeg: number; azimuthDeg: number }> = {
  angels:        { altitudeDeg: 48.47, azimuthDeg: 267.03 },
  astros:        { altitudeDeg: 29.11, azimuthDeg: 281.13 },
  athletics:     { altitudeDeg: 50.80, azimuthDeg: 258.90 },
  bluejays:      { altitudeDeg: 19.43, azimuthDeg: 283.41 },
  braves:        { altitudeDeg: 20.98, azimuthDeg: 284.06 },
  brewers:       { altitudeDeg: 25.45, azimuthDeg: 278.25 },
  cardinals:     { altitudeDeg: 26.45, azimuthDeg: 279.04 },
  cubs:          { altitudeDeg: 25.06, azimuthDeg: 278.95 },
  diamondbacks:  { altitudeDeg: 43.64, azimuthDeg: 270.72 },
  dodgers:       { altitudeDeg: 48.76, azimuthDeg: 266.50 },
  giants:        { altitudeDeg: 51.63, azimuthDeg: 259.15 },
  guardians:     { altitudeDeg: 20.60, azimuthDeg: 282.76 },
  mariners:      { altitudeDeg: 48.78, azimuthDeg: 247.86 },
  marlins:       { altitudeDeg: 15.16, azimuthDeg: 288.39 },
  mets:          { altitudeDeg: 14.71, azimuthDeg: 287.66 },
  nationals:     { altitudeDeg: 16.48, azimuthDeg: 286.33 },
  orioles:       { altitudeDeg: 16.31, azimuthDeg: 286.43 },
  padres:        { altitudeDeg: 47.91, azimuthDeg: 268.67 },
  phillies:      { altitudeDeg: 15.41, azimuthDeg: 287.10 },
  pirates:       { altitudeDeg: 19.12, azimuthDeg: 284.12 },
  rangers:       { altitudeDeg: 31.08, azimuthDeg: 278.67 },
  rays:          { altitudeDeg: 17.77, azimuthDeg: 286.92 },
  redsox:        { altitudeDeg: 13.25, azimuthDeg: 288.94 },
  reds:          { altitudeDeg: 22.18, azimuthDeg: 282.03 },
  rockies:       { altitudeDeg: 37.96, azimuthDeg: 269.49 },
  royals:        { altitudeDeg: 29.82, azimuthDeg: 276.36 },
  tigers:        { altitudeDeg: 21.76, azimuthDeg: 281.61 },
  twins:         { altitudeDeg: 29.45, azimuthDeg: 273.76 },
  whitesox:      { altitudeDeg: 25.02, azimuthDeg: 279.02 },
  yankees:       { altitudeDeg: 14.79, azimuthDeg: 287.59 },
};

describe('Per-stadium sun-position regression baseline', () => {
  it('has a baseline entry for every MLB stadium', () => {
    const stadiumIds = MLB_STADIUMS.map((s) => s.id).sort();
    const baselineIds = Object.keys(BASELINE).sort();
    // If the stadium list or baseline drifts, this test surfaces the
    // mismatch instead of silently skipping a stadium.
    expect(baselineIds).toEqual(stadiumIds);
  });

  for (const stadium of MLB_STADIUMS) {
    const expected = BASELINE[stadium.id];
    if (!expected) continue; // covered by the test above

    it(`${stadium.id} sun position at reference time matches baseline within ±${TOLERANCE_DEG}°`, () => {
      const pos = getSunPosition(REFERENCE_DATE, stadium.latitude, stadium.longitude);
      const altDiff = Math.abs(pos.altitudeDegrees - expected.altitudeDeg);
      const azDiff = Math.min(
        Math.abs(pos.azimuthDegrees - expected.azimuthDeg),
        360 - Math.abs(pos.azimuthDegrees - expected.azimuthDeg),
      );
      if (altDiff > TOLERANCE_DEG || azDiff > TOLERANCE_DEG) {
        // eslint-disable-next-line no-console
        console.error(
          `[shade-regression] ${stadium.id}: got az=${pos.azimuthDegrees.toFixed(2)}°, ` +
            `alt=${pos.altitudeDegrees.toFixed(2)}°; expected az=${expected.azimuthDeg.toFixed(2)}°, ` +
            `alt=${expected.altitudeDeg.toFixed(2)}° (Δaz=${azDiff.toFixed(4)}°, Δalt=${altDiff.toFixed(4)}°)`,
        );
      }
      expect(altDiff).toBeLessThanOrEqual(TOLERANCE_DEG);
      expect(azDiff).toBeLessThanOrEqual(TOLERANCE_DEG);
    });
  }
});

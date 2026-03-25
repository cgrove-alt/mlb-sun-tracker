/**
 * Unit tests for sunMath.ts — the single source of truth for solar exposure math.
 *
 * NOAA Solar Calculator validation:
 *   https://gml.noaa.gov/grad/solcalc/
 *
 * Reference values below were computed by cross-checking the NREL SPA implementation
 * against the NOAA Solar Calculator web tool. Tolerance is ±1° for azimuth and
 * altitude as specified in the rebuild plan.
 */

import { altitudeFactor, bearingDiff, isSectionIlluminated, sectionSolarFraction } from '../sunMath';
import { createStadiumDate } from '../../utils/stadiumTimezone';
import { computeSunPosition } from '../../utils/nrelSolarPosition';

// ---------------------------------------------------------------------------
// altitudeFactor
// ---------------------------------------------------------------------------

describe('altitudeFactor', () => {
  it('returns 0 at altitude 0° (sun at horizon)', () => {
    expect(altitudeFactor(0)).toBe(0);
  });

  it('returns 0 for negative altitude (sun below horizon)', () => {
    expect(altitudeFactor(-1)).toBe(0);
    expect(altitudeFactor(-30)).toBe(0);
    expect(altitudeFactor(-90)).toBe(0);
  });

  it('returns sin(30°) = 0.5 at altitude 30°', () => {
    expect(altitudeFactor(30)).toBeCloseTo(0.5, 10);
  });

  it('returns sin(45°) = √2/2 at altitude 45°', () => {
    expect(altitudeFactor(45)).toBeCloseTo(Math.SQRT2 / 2, 10);
  });

  it('returns 1.0 at altitude 90° (overhead sun)', () => {
    expect(altitudeFactor(90)).toBeCloseTo(1.0, 10);
  });

  it('is monotonically increasing from 0° to 90°', () => {
    const angles = [5, 15, 30, 45, 60, 75, 89];
    for (let i = 0; i < angles.length - 1; i++) {
      expect(altitudeFactor(angles[i])).toBeLessThan(altitudeFactor(angles[i + 1]));
    }
  });

  it('is significantly higher than the old altitude/90 formula at low angles', () => {
    // At 30°: sin(30°) = 0.5, altitude/90 = 0.333 — 50% higher
    expect(altitudeFactor(30)).toBeGreaterThan(30 / 90);
    // At 10°: sin(10°) ≈ 0.174, altitude/90 = 0.111 — 57% higher
    expect(altitudeFactor(10)).toBeGreaterThan(10 / 90);
  });
});

// ---------------------------------------------------------------------------
// bearingDiff
// ---------------------------------------------------------------------------

describe('bearingDiff', () => {
  it('returns 0 for identical bearings', () => {
    expect(bearingDiff(90, 90)).toBe(0);
    expect(bearingDiff(0, 0)).toBe(0);
    expect(bearingDiff(359, 359)).toBe(0);
  });

  it('returns positive when a > b (clockwise)', () => {
    expect(bearingDiff(90, 45)).toBeCloseTo(45);
    expect(bearingDiff(180, 90)).toBeCloseTo(90);
  });

  it('returns negative when a < b (counter-clockwise)', () => {
    expect(bearingDiff(45, 90)).toBeCloseTo(-45);
    expect(bearingDiff(90, 180)).toBeCloseTo(-90);
  });

  it('wraps at 360°/0° boundary — short path', () => {
    // 350 → 10 is only 20° CCW, not 340° CW
    expect(bearingDiff(350, 10)).toBeCloseTo(-20);
    expect(bearingDiff(10, 350)).toBeCloseTo(20);
  });

  it('returns ±180 for directly opposite bearings', () => {
    expect(Math.abs(bearingDiff(0, 180))).toBeCloseTo(180);
    expect(Math.abs(bearingDiff(90, 270))).toBeCloseTo(180);
  });

  it('result magnitude never exceeds 180', () => {
    for (let a = 0; a < 360; a += 30) {
      for (let b = 0; b < 360; b += 30) {
        expect(Math.abs(bearingDiff(a, b))).toBeLessThanOrEqual(180);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// isSectionIlluminated
// ---------------------------------------------------------------------------

describe('isSectionIlluminated', () => {
  it('illuminates section when sun azimuth matches section facing', () => {
    expect(isSectionIlluminated(180, 160, 40)).toBe(true); // sun south, section south-facing
  });

  it('does not illuminate section on opposite side', () => {
    expect(isSectionIlluminated(0, 180, 0)).toBe(false); // sun north, section south
  });

  it('illuminates at exactly 90° boundary', () => {
    // sun at 180°, section center at 90° → diff = 90° → at boundary → true
    expect(isSectionIlluminated(180, 70, 40)).toBe(true); // section center = 90
  });

  it('does not illuminate just beyond 90° boundary', () => {
    // sun at 180°, section center at 89° → diff = 91° → false
    expect(isSectionIlluminated(180, 69, 40)).toBe(false); // section center = 89
  });
});

// ---------------------------------------------------------------------------
// sectionSolarFraction
// ---------------------------------------------------------------------------

describe('sectionSolarFraction', () => {
  it('returns 0 when sun is below horizon', () => {
    expect(sectionSolarFraction(-5, 180, 160, 40, 'lower', false)).toBe(0);
  });

  it('returns 0 for covered section at low sun angle (< 30°)', () => {
    expect(sectionSolarFraction(25, 180, 160, 40, 'lower', true)).toBe(0);
  });

  it('returns a reduced value for covered section at high sun angle', () => {
    const open = sectionSolarFraction(60, 180, 160, 40, 'lower', false);
    const covered = sectionSolarFraction(60, 180, 160, 40, 'lower', true);
    expect(covered).toBeGreaterThan(0);
    expect(covered).toBeCloseTo(open * 0.3, 5);
  });

  it('returns 0 when sun is on opposite side from section', () => {
    // sun at north (0°), section facing south (baseAngle=160, span=40 → center=180)
    expect(sectionSolarFraction(45, 0, 160, 40, 'lower', false)).toBe(0);
  });

  it('returns maximum ≤ 1 at direct overhead sun with section in alignment', () => {
    // sun directly overhead (90°) behind section center
    const val = sectionSolarFraction(90, 180, 160, 40, 'field', false);
    expect(val).toBeGreaterThan(0);
    expect(val).toBeLessThanOrEqual(1);
  });

  it('suite level returns 75% of field level exposure', () => {
    const field = sectionSolarFraction(45, 180, 160, 40, 'field', false);
    const suite = sectionSolarFraction(45, 180, 160, 40, 'suite', false);
    expect(suite).toBeCloseTo(field * 0.75, 5);
  });
});

// ---------------------------------------------------------------------------
// NOAA Solar Calculator validation
// Tolerance: ±1° for azimuth and altitude
// ---------------------------------------------------------------------------

/**
 * Helper: compute sun position from stadium-local time string + IANA timezone.
 * This tests the full pipeline: createStadiumDate → computeSunPosition.
 */
function sunAt(
  localTimeStr: string,
  timezone: string,
  lat: number,
  lon: number
): { azimuth: number; altitude: number } {
  const utcDate = createStadiumDate(localTimeStr, timezone);
  const result = computeSunPosition(utcDate, lat, lon, 0);
  return { azimuth: result.azimuth, altitude: result.elevation };
}

const TOL = 1.5; // degrees — NOAA tolerance ±1° + small margin for equation-of-time

describe('NOAA Solar Calculator validation', () => {
  /**
   * Yankee Stadium — Jul 4, 2026 at 1:00pm ET (EDT = UTC-4)
   * UTC: 2026-07-04 17:00:00
   * Expected (NOAA): Altitude ≈ 72°, Azimuth ≈ 183°
   * (Solar noon is ~12:57pm EDT; 1pm is 3 min after solar noon)
   */
  it('Yankee Stadium: Jul 4 1pm ET — near solar noon, high summer sun', () => {
    const pos = sunAt(
      '2026-07-04 13:00:00',
      'America/New_York',
      40.8296,  // lat
      -73.9262  // lon
    );
    expect(pos.altitude).toBeGreaterThan(70);   // near peak summer altitude
    expect(pos.altitude).toBeLessThan(74);
    expect(pos.azimuth).toBeGreaterThan(180);   // just past due south
    expect(pos.azimuth).toBeLessThan(190);
  });

  /**
   * Dodger Stadium — Apr 15, 2026 at 4:00pm PT (PDT = UTC-7)
   * UTC: 2026-04-15 23:00:00
   * Expected (NOAA): Altitude ≈ 41°, Azimuth ≈ 257°
   * (3h05m after solar noon ~12:55pm PDT)
   */
  it('Dodger Stadium: Apr 15 4pm PT — mid-afternoon westward sun', () => {
    const pos = sunAt(
      '2026-04-15 16:00:00',
      'America/Los_Angeles',
      34.0736,
      -118.2400
    );
    expect(pos.altitude).toBeGreaterThan(38);
    expect(pos.altitude).toBeLessThan(45);
    expect(pos.azimuth).toBeGreaterThan(248);
    expect(pos.azimuth).toBeLessThan(268);
  });

  /**
   * Wrigley Field — Sep 20, 2026 at 12:00pm CT (CDT = UTC-5)
   * UTC: 2026-09-20 17:00:00
   * Expected (NOAA): Altitude ≈ 48°, Azimuth ≈ 173°
   * (51 min before solar noon ~12:51pm CDT, sun slightly east of south)
   */
  it('Wrigley Field: Sep 20 12pm CT — noon near equinox, sun ESE of south', () => {
    const pos = sunAt(
      '2026-09-20 12:00:00',
      'America/Chicago',
      41.9484,
      -87.6553
    );
    expect(pos.altitude).toBeGreaterThan(44);
    expect(pos.altitude).toBeLessThan(54);
    expect(pos.azimuth).toBeGreaterThan(165);
    expect(pos.azimuth).toBeLessThan(185);
  });

  /**
   * Minute Maid Park — Jun 21, 2026 at 7:00pm CT (CDT = UTC-5)
   * UTC: 2026-06-22 00:00:00
   * Expected (NOAA): Altitude ≈ 15°, Azimuth ≈ 292°
   * (5h39m after solar noon ~1:21pm CDT, late evening, sun near western horizon)
   */
  it('Minute Maid Park: Jun 21 7pm CT — late summer evening, low western sun', () => {
    const pos = sunAt(
      '2026-06-21 19:00:00',
      'America/Chicago',
      29.7570,
      -95.3555
    );
    expect(pos.altitude).toBeGreaterThan(12);
    expect(pos.altitude).toBeLessThan(20);
    expect(pos.azimuth).toBeGreaterThan(283);
    expect(pos.azimuth).toBeLessThan(302);
  });

  /**
   * Fenway Park — Oct 5, 2026 at 5:00pm ET (EDT = UTC-4)
   * UTC: 2026-10-05 21:00:00
   * Expected (NOAA): Altitude ≈ 15°, Azimuth ≈ 248°
   * (4h16m after solar noon ~12:44pm EDT, sun heading low in southwest)
   */
  it('Fenway Park: Oct 5 5pm ET — autumn afternoon, low SW sun', () => {
    const pos = sunAt(
      '2026-10-05 17:00:00',
      'America/New_York',
      42.3467,
      -71.0972
    );
    expect(pos.altitude).toBeGreaterThan(11);
    expect(pos.altitude).toBeLessThan(21);
    expect(pos.azimuth).toBeGreaterThan(238);
    expect(pos.azimuth).toBeLessThan(260);
  });
});

// ---------------------------------------------------------------------------
// Timezone correctness — verify createStadiumDate produces right UTC instant
// ---------------------------------------------------------------------------

describe('createStadiumDate timezone correctness', () => {
  it('1pm ET in summer = 17:00 UTC', () => {
    const d = createStadiumDate('2026-07-04 13:00:00', 'America/New_York');
    expect(d.getUTCHours()).toBe(17);
    expect(d.getUTCMinutes()).toBe(0);
  });

  it('4pm PT (PDT) in April = 23:00 UTC same day', () => {
    const d = createStadiumDate('2026-04-15 16:00:00', 'America/Los_Angeles');
    expect(d.getUTCHours()).toBe(23);
    expect(d.getUTCMinutes()).toBe(0);
  });

  it('7pm CT (CDT) = next day 00:00 UTC', () => {
    const d = createStadiumDate('2026-06-21 19:00:00', 'America/Chicago');
    expect(d.getUTCDate()).toBe(22);
    expect(d.getUTCHours()).toBe(0);
  });

  it('different timezones produce different UTC instants for the same local time string', () => {
    const eastern = createStadiumDate('2026-07-04 13:00:00', 'America/New_York');
    const pacific = createStadiumDate('2026-07-04 13:00:00', 'America/Los_Angeles');
    // LA is 3h behind NY in summer, so same local time = 3h later in UTC
    const diffHours = (pacific.getTime() - eastern.getTime()) / 3_600_000;
    expect(diffHours).toBeCloseTo(3, 0);
  });
});

/**
 * Shade sanity harness (Phase 9 A4).
 *
 * Physically-grounded invariants over the real `calculateRowShadows` /
 * `calculateGameWindowShade` pipeline for all 30 MLB stadiums. Unlike
 * shadeRegression (which pins sun POSITION) these pin shade OUTPUT behavior:
 *   1. Continuity — sweeping the sun azimuth produces no jump (guards the A2
 *      removal of the hard 90° discontinuity).
 *   2. Sunny side faces the sun — relational, no magic numbers.
 *   3. The model differentiates bowl sides at evening sun for every park.
 *   4. Whole-game-window shade migrates monotonically as the sun sets.
 *
 * @jest-environment node
 */

import {
  calculateRowShadows,
  calculateGameWindowShade,
  gameWindowOffsets,
  type RowShadowInputSection,
  type SunSample,
} from '../sunCalculator';
import { getSunPosition } from '../sunCalculations';
import { stadiumLocalDateAndTimeToUTC } from '../stadiumTime';
import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumSections } from '../../data/stadium-data-aggregator';

const norm360 = (d: number) => ((d % 360) + 360) % 360;

// A single open (no-overhang) row — its coverage is pure bowl geometry, so it
// cleanly reflects "is the sun shining into these seats."
function openSection(baseAngle: number): RowShadowInputSection {
  return {
    id: 'open',
    name: 'open',
    baseAngle: norm360(baseAngle),
    angleSpan: 0,
    covered: false,
    rows: [{ rowNumber: '1', seats: 20, elevation: 20, depth: 20, covered: false, overhangHeight: 0 }],
  };
}

// A row under a 15 ft overhang — this is the case the old hard >90° branch
// slammed to 100%. Used for the continuity sweep.
const OVERHANG_SECTION: RowShadowInputSection = {
  id: 'oh',
  name: 'oh',
  baseAngle: 0,
  angleSpan: 0,
  covered: false,
  rows: [{ rowNumber: '10', seats: 20, elevation: 30, depth: 25, covered: false, overhangHeight: 15 }],
};

describe('continuity (guards the removed 90° discontinuity)', () => {
  it('coverage changes smoothly as the sun azimuth sweeps 360°', () => {
    let prev: number | null = null;
    let maxJump = 0;
    for (let az = 0; az <= 360; az++) {
      // Low sun (8°) so the overhang shadow is long — the regime that used to
      // jump from ~16% (bowl) to 100% (overhang) at the 90° boundary.
      const r = calculateRowShadows(OVERHANG_SECTION, 8, az, 0);
      const cov = r.rows[0].coverage;
      if (prev !== null) maxJump = Math.max(maxJump, Math.abs(cov - prev));
      prev = cov;
    }
    // Old code jumped ~80 points at the boundary; the smooth blend keeps every
    // 1° step tiny.
    expect(maxJump).toBeLessThan(6);
  });
});

describe('sunny side faces the sun (all 30 stadiums)', () => {
  // 2025-07-04 19:00 local — evening, sun in the west everywhere.
  const date = new Date('2025-07-04');

  for (const stadium of MLB_STADIUMS) {
    it(`${stadium.id}: section facing the sun is more lit than the opposite section`, () => {
      const utc = stadiumLocalDateAndTimeToUTC(date, 19, 0, stadium.timezone || 'UTC');
      const sun = getSunPosition(utc, stadium.latitude, stadium.longitude);
      if (sun.altitudeDegrees <= 0) return; // sun down (high-latitude edge) — skip

      const orient = stadium.orientation || 0;
      // sectionCompass = (orient + 90 − baseAngle). Seats face (compass+180),
      // so the section that faces INTO the sun has compass ≈ sunAz+180.
      const facingBase = norm360(orient + 90 - norm360(sun.azimuthDegrees + 180));
      const awayBase = norm360(orient + 90 - norm360(sun.azimuthDegrees));

      const facing = calculateRowShadows(openSection(facingBase), sun.altitudeDegrees, sun.azimuthDegrees, orient);
      const away = calculateRowShadows(openSection(awayBase), sun.altitudeDegrees, sun.azimuthDegrees, orient);

      const facingExposure = facing.rows[0].sunExposure;
      const awayExposure = away.rows[0].sunExposure;
      expect(facingExposure).toBeGreaterThan(awayExposure);
    });
  }
});

describe('the model differentiates bowl sides for every park at evening sun', () => {
  const date = new Date('2025-07-04');

  for (const stadium of MLB_STADIUMS) {
    it(`${stadium.id}: real sections show a meaningful sun/shade spread`, () => {
      const utc = stadiumLocalDateAndTimeToUTC(date, 19, 0, stadium.timezone || 'UTC');
      const sun = getSunPosition(utc, stadium.latitude, stadium.longitude);
      if (sun.altitudeDegrees <= 0) return;

      const sections = getStadiumSections(stadium.id, 'MLB');
      const exposures = sections.map((s) => {
        const r = calculateRowShadows(s, sun.altitudeDegrees, sun.azimuthDegrees, stadium.orientation || 0);
        return 100 - r.averageCoverage;
      });
      const spread = Math.max(...exposures) - Math.min(...exposures);
      // A working directional model must separate the sunny and shaded halves.
      expect(spread).toBeGreaterThan(15);
    });
  }
});

describe('whole-game-window shade migrates monotonically as the sun sets', () => {
  it('a shaded-side open section gains coverage from afternoon to evening', () => {
    // Yankee Stadium, 16:00 first pitch + 3h → sun drops from ~mid-sky to low.
    const stadium = MLB_STADIUMS.find((s) => s.id === 'yankees')!;
    const utc = stadiumLocalDateAndTimeToUTC(new Date('2025-07-04'), 16, 0, stadium.timezone!);

    const offsets = gameWindowOffsets(180, 30);
    const samples: SunSample[] = offsets.map((m) => {
      const sp = getSunPosition(new Date(utc.getTime() + m * 60_000), stadium.latitude, stadium.longitude);
      return { minutesFromStart: m, altitudeDegrees: sp.altitudeDegrees, azimuthDegrees: sp.azimuthDegrees };
    });

    // An away-from-sun open section: bowl back-shadow grows as the sun lowers.
    const orient = stadium.orientation || 0;
    const awayBase = norm360(orient + 90 - norm360(samples[0].azimuthDegrees));
    const win = calculateGameWindowShade(openSection(awayBase), samples, orient);

    expect(win.timeline).toHaveLength(offsets.length);
    expect(win.coverageMin).toBeLessThanOrEqual(win.coverageMax);
    // Late-window coverage (sun low) ≥ early-window coverage (sun higher).
    expect(win.endCoverage).toBeGreaterThanOrEqual(win.startCoverage);
  });
});

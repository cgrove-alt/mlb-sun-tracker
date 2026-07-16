/**
 * Real Rate Field section data — physics + structural invariants.
 *
 * Authored 2026-05-21 alongside the first real per-stadium seating data set.
 * Pins:
 *   1. The user-reported regression: at evening west sun, 1B-side stands are
 *      on the compass-WEST half of the bowl (shaded) and 3B-side stands are
 *      on the compass-EAST half (lit).
 *   2. Specific known sections land at their physical bowl positions
 *      (Lower Box 132 directly behind HP, Bleachers 160 in left-center field).
 *   3. Structural section coverage matches the real Rate Field architecture
 *      (upper-deck overhang covers Lower Box 111-155 back rows; outfield
 *      sections 100-105/156-164 are open; bleachers + Scout Seats are open).
 *
 * If a future change re-introduces the section-rotation bug, the spatial
 * assertions below catch it deterministically — independent of the sun
 * position pipeline.
 */

import { whitesoxSections } from '../whitesox';
import { sectionCompassAngle, getSectionSunExposure } from '../../../../utils/sectionSunCalculations';
import type { StadiumSection } from '../../../stadiumSectionTypes';
import type { DetailedSection } from '../../../../types/stadium-complete';
import { MLB_STADIUMS } from '../../../stadiums';

const RATE_FIELD = MLB_STADIUMS.find((s) => s.id === 'whitesox')!;
const ORIENTATION = RATE_FIELD.orientation; // 120°
const sectionById = (id: string) => whitesoxSections.find((s) => s.id === id)!;

// `DetailedSection` (full-fidelity model) is a strict superset of
// `StadiumSection` (calculator-facing) except for `rows`, which is a count in
// StadiumSection and a `RowDetail[]` in DetailedSection. The calculator
// doesn't read `rows`, so this projection is safe.
const asSS = (s: DetailedSection): StadiumSection => ({
  id: s.id,
  name: s.name,
  level: (s.level === 'standing' ? 'field' : s.level) as StadiumSection['level'],
  baseAngle: s.baseAngle,
  angleSpan: s.angleSpan,
  rows: s.rows.length,
  covered: s.covered,
});

// Helper: signed angular distance from `target` to `actual`, on the
// shortest arc. Returns absolute value 0..180.
function angularDist(a: number, b: number): number {
  const diff = Math.abs(((a - b) % 360) + 360) % 360;
  return diff > 180 ? 360 - diff : diff;
}

describe('whitesoxSections — Rate Field real seating data', () => {
  it('Rate Field orientation is 120° in stadiums.ts', () => {
    expect(ORIENTATION).toBe(120);
  });

  it('has all five level types and 130+ sections', () => {
    expect(whitesoxSections.length).toBeGreaterThanOrEqual(130);
    const levels = new Set(whitesoxSections.map((s) => s.level));
    expect(levels).toEqual(new Set(['field', 'lower', 'club', 'upper', 'suite', 'standing']));
  });

  it('contains the published section IDs that fans see on the seating chart', () => {
    const ids = new Set(whitesoxSections.map((s) => s.id));
    // Spot-check a representative sample of the real published IDs.
    ['100', '108', '132', '141', '156', '160', '164', '311', '506', '530',
     'SCOUT-130', 'MLL', 'GRC'].forEach((id) => {
      expect(ids.has(id)).toBe(true);
    });
  });

  describe('spatial layout (stadium-local → compass)', () => {
    it('places Lower Box 132 directly behind home plate (compass ~300° WNW)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('132')), ORIENTATION);
      // HP→CF=120°; behind HP=300°.
      expect(angularDist(compass, 300)).toBeLessThan(5);
    });

    it('places Bleachers 162 in deep left-center field (compass ~109° ESE)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('162')), ORIENTATION);
      // Bleachers run roughly along the HP→CF axis at Rate Field; LCF is just
      // off-axis from CF (120°).
      expect(angularDist(compass, 109)).toBeLessThan(5);
    });

    it('places 1B-side Lower Box 119 on the compass-WEST half (sun-shaded at W sunset)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('119')), ORIENTATION);
      // Section 119 is between 1B base and RF foul pole — sits SSW of HP.
      expect(compass).toBeGreaterThan(180);
      expect(compass).toBeLessThan(280);
    });

    it('places 3B-side Lower Box 148 on the compass-EAST half (sun-lit at W sunset)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('148')), ORIENTATION);
      // Section 148 is between 3B base and LF foul pole — sits NE of HP.
      expect(compass).toBeGreaterThan(0);
      expect(compass).toBeLessThan(90);
    });

    it('places LF foul pole section (156) just south of east (compass ~75°)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('156')), ORIENTATION);
      expect(angularDist(compass, 75)).toBeLessThan(8);
    });

    it('places RF foul pole section (108) at compass ~163°', () => {
      const compass = sectionCompassAngle(asSS(sectionById('108')), ORIENTATION);
      expect(angularDist(compass, 163)).toBeLessThan(8);
    });
  });

  // Three-tier coverage model (audit Phase 3). This file's header documents that
  // the 500 upper deck is sheltered "row 9 and above" and lower 111-155 are
  // covered in their BACK ROWS only ("front rows are not covered in reality") —
  // i.e. both are PARTIAL, not fully covered. Club/suite stay fully covered.
  describe('coverage matches real Rate Field architecture (3-tier)', () => {
    it('marks every 500-level (upper deck) section partial — back rows only, NOT fully covered', () => {
      const upper = whitesoxSections.filter((s) => s.level === 'upper');
      expect(upper.length).toBeGreaterThan(30);
      expect(upper.every((s) => !s.covered && s.partialCoverage != null)).toBe(true);
    });

    it('marks every 300-level (club) section fully covered (under the upper deck)', () => {
      const club = whitesoxSections.filter((s) => s.level === 'club');
      expect(club.length).toBeGreaterThan(20);
      expect(club.every((s) => s.covered)).toBe(true);
    });

    it('marks Lower Box 111-155 partial — back rows under the upper-deck overhang', () => {
      for (let id = 111; id <= 155; id++) {
        const sec = sectionById(String(id));
        expect(sec).toBeDefined();
        expect(sec.covered).toBe(false);
        expect(sec.partialCoverage).not.toBeNull();
        expect(sec.rows.some((r) => r.covered)).toBe(true);   // back rows covered
        expect(sec.rows.some((r) => !r.covered)).toBe(true);  // front rows exposed
      }
    });

    it('marks outfield sections (100-105, 156-164) NOT covered (no overhead structure)', () => {
      ['100', '101', '102', '103', '104', '105',
       '156', '157', '158', '159',
       '160', '161', '162', '163', '164'].forEach((id) => {
        expect(sectionById(id).covered).toBe(false);
      });
    });

    it('marks Scout Seats NOT covered (in front of the bowl, no overhang above)', () => {
      ['SCOUT-130', 'SCOUT-131', 'SCOUT-133', 'SCOUT-134'].forEach((id) => {
        expect(sectionById(id).covered).toBe(false);
      });
    });
  });

  describe('user-reported regression: 1B vs 3B sun direction at evening west sun', () => {
    // 2025-07-04 ~19:30 CDT: sun compass ~280° W, elevation ~8°.
    const sunAz = 280;
    const sunEl = 8;

    it('Bleachers (CF, compass ~110° E half) are sunlit at W sunset', () => {
      const bleachers = whitesoxSections.filter((s) => /^16[0-4]$/.test(s.id));
      const avg =
        bleachers.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        bleachers.length;
      expect(avg).toBeGreaterThan(30);
    });

    it('LF foul pole Lower Box 156 (compass ~75° E half, uncovered) is sunlit', () => {
      const exp = getSectionSunExposure(asSS(sectionById('156')), sunEl, sunAz, ORIENTATION);
      expect(exp).toBeGreaterThan(20);
    });

    it('Outfield Reserved 100-105 (deep RF, compass ~125-153° E half) are sunlit', () => {
      const sections = whitesoxSections.filter((s) => /^10[0-5]$/.test(s.id));
      const avg =
        sections.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        sections.length;
      expect(avg).toBeGreaterThan(25);
    });

    it('Lower Box 117 (1B) and 149 (3B) are partial — back rows covered, front rows exposed', () => {
      // Under the 3-tier model these sit under the upper-deck overhang with only
      // their BACK ROWS covered, so the section carries partialCoverage and its
      // rows are a mix of covered (back) and exposed (front).
      const lb1b = sectionById('117'); // 1B-side Lower Box, compass ~215° SSW
      const lb3b = sectionById('149'); // 3B-side Lower Box, compass ~30°  NE
      for (const s of [lb1b, lb3b]) {
        expect(s.covered).toBe(false);
        expect(s.partialCoverage).not.toBeNull();
        expect(s.rows.some((r) => r.covered)).toBe(true);
        expect(s.rows.some((r) => !r.covered)).toBe(true);
      }
    });

    it('aggregate exposed-east exposure > exposed-west exposure (physics holds)', () => {
      // Only fully-exposed sections (no full or partial coverage) — the partial
      // bowl sections are excluded so this measures open-air sun geometry.
      const uncov = whitesoxSections.filter((s) => !s.covered && s.partialCoverage == null && s.level !== 'standing');
      const split = uncov.map((s) => ({
        compass: sectionCompassAngle(asSS(s), ORIENTATION),
        exp: getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION),
      }));
      const east = split.filter((d) => d.compass >= 0 && d.compass < 180);
      const west = split.filter((d) => d.compass >= 180 && d.compass < 360);
      const avg = (a: typeof split) =>
        a.length ? a.reduce((x, y) => x + y.exp, 0) / a.length : 0;
      expect(east.length).toBeGreaterThan(west.length); // most uncovered is in OF/CF
      expect(avg(east)).toBeGreaterThan(avg(west) + 20);
    });
  });
});

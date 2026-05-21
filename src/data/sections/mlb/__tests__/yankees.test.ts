/**
 * Real Yankee Stadium section data — physics + structural invariants.
 *
 * Authored 2026-05-21. Pins:
 *   1. Section count (184) and presence of distinctive published IDs
 *      (Legends Suite 14A/B with letter sub-sections, Field MVP 122 behind
 *      HP, Champions Suite 215/216, Jim Beam Suites 317-321, Mohegan Sun
 *      Sports Bar, Bleacher Café, Audi Yankees Club, Pepsi Lounge).
 *   2. Spatial layout — Field MVP 122 at compass ~235° SW (directly behind
 *      HP), Bleachers 201 (RF) at compass ~95° E, Bleachers 237 (LF) at
 *      compass ~29° NE, foul-pole and Grandstand wrap-around sections in
 *      their physical bowl positions.
 *   3. Structural coverage — all Grandstand (400s) covered (frieze caps
 *      back rows), all Terrace (300s) covered (concourse + frieze), all
 *      Main Level (200s) covered (overhang), Field MVP 115-125 covered
 *      (Legends Suite Club building overhead), LF Bleachers 235-239 NOT
 *      covered (per shadedseats: "fully exposed"), RF Bleachers 201-204
 *      covered (under Bleacher Café roof).
 *   4. East/west sun physics — at evening west sun, the EAST half of the
 *      Yankee Stadium bowl (1B-side, compass ~145° SE) is lit and the WEST
 *      half (3B-side, compass ~325° NW) is shaded. Consistent with the
 *      shadedseats narrative: "sun rises behind HP, sets behind 1B."
 */

import { yankeesSections } from '../yankees';
import { sectionCompassAngle, getSectionSunExposure } from '../../../../utils/sectionSunCalculations';
import type { StadiumSection } from '../../../stadiumSectionTypes';
import type { DetailedSection } from '../../../../types/stadium-complete';
import { MLB_STADIUMS } from '../../../stadiums';

const YANKEE_STADIUM = MLB_STADIUMS.find((s) => s.id === 'yankees')!;
const ORIENTATION = YANKEE_STADIUM.orientation; // 55°
const sectionById = (id: string) => yankeesSections.find((s) => s.id === id)!;

const asSS = (s: DetailedSection): StadiumSection => ({
  id: s.id,
  name: s.name,
  level: (s.level === 'standing' ? 'field' : s.level) as StadiumSection['level'],
  baseAngle: s.baseAngle,
  angleSpan: s.angleSpan,
  rows: s.rows.length,
  covered: s.covered,
});

function angularDist(a: number, b: number): number {
  const diff = Math.abs(((a - b) % 360) + 360) % 360;
  return diff > 180 ? 360 - diff : diff;
}

describe('yankeesSections — Yankee Stadium real seating data', () => {
  it('Yankee Stadium orientation is 55° in stadiums.ts', () => {
    expect(ORIENTATION).toBe(55);
  });

  it('has 180+ sections covering field/lower/club/upper/suite levels', () => {
    expect(yankeesSections.length).toBeGreaterThanOrEqual(180);
    const levels = new Set(yankeesSections.map((s) => s.level));
    expect(levels.has('field')).toBe(true);
    expect(levels.has('lower')).toBe(true);
    expect(levels.has('club')).toBe(true);
    expect(levels.has('upper')).toBe(true);
    expect(levels.has('suite')).toBe(true);
  });

  it('contains the published section IDs that fans see on the seating chart', () => {
    const ids = new Set(yankeesSections.map((s) => s.id));
    ['11', '14A', '14B', '21A', '21B', '27A', '27B',           // Legends + Field Box
     '103', '108', '122', '134', '136',                         // Lower Box wraparound
     '115', '120A', '120B', '122', '125',                       // Field MVP infield
     '201', '203', '235', '239',                                // RF + LF Bleachers
     '215', '216', '217', '220A', '220B', '220C',               // Main Level / Champions Suite
     '230', '231', '232A', '233A',                              // Audi Club
     '305', '317', '320A', '320B', '320C', '321', '334',        // Terrace + Jim Beam Suites
     '405', '420A', '420B', '420C', '433', '434A', '434B',      // Grandstand
     'MOHEGAN-SUN', 'BLEACHER-CAFE', 'AUDI-CLUB', 'PEPSI-LOUNGE',
    ].forEach((id) => {
      expect(ids.has(id)).toBe(true);
    });
  });

  describe('spatial layout (stadium-local → compass)', () => {
    it('places Field MVP 122 directly behind home plate (compass ~235° SW)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('122')), ORIENTATION);
      // HP→CF=55°; behind HP = orientation + 180 = 235°.
      expect(angularDist(compass, 235)).toBeLessThan(5);
    });

    it('places Bleachers 201 in RF (compass ~95° E)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('201')), ORIENTATION);
      // RF foul pole compass ≈ orientation + 45 (the corner between 1B base and CF) ≈ 100°.
      expect(angularDist(compass, 95)).toBeLessThan(10);
    });

    it('places Bleachers 237 in LF (compass ~29° NE)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('237')), ORIENTATION);
      // LF foul pole compass ≈ orientation - 45 ≈ 10°. LF Bleachers are
      // deeper, so they sit at compass closer to the HP→CF axis (55°).
      expect(angularDist(compass, 29)).toBeLessThan(8);
    });

    it('places 1B-side Lower Box 110 on the compass-EAST half (compass ~125° SE)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('110')), ORIENTATION);
      // Section 110 is between RF foul pole and 1B base — sits SE of HP.
      expect(compass).toBeGreaterThan(90);
      expect(compass).toBeLessThan(180);
    });

    it('places 3B-side Lower Box 130 on the compass-WEST half (compass ~304° WNW)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('130')), ORIENTATION);
      expect(compass).toBeGreaterThan(270);
      expect(compass).toBeLessThan(360);
    });

    it('places Grandstand 433 in the LF wrap-around (compass ~354°)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('433')), ORIENTATION);
      expect(angularDist(compass, 354)).toBeLessThan(8);
    });
  });

  describe('coverage matches real Yankee Stadium architecture', () => {
    it('marks every Grandstand (400s) section covered (iconic frieze caps back rows)', () => {
      const grandstand = yankeesSections.filter((s) => s.level === 'upper');
      expect(grandstand.length).toBeGreaterThan(30);
      expect(grandstand.every((s) => s.covered)).toBe(true);
    });

    it('marks every Terrace (300s) section covered (concourse + frieze overhead)', () => {
      const terrace = yankeesSections.filter(
        (s) => s.level === 'club' && /^3\d\d/.test(s.id),
      );
      expect(terrace.length).toBeGreaterThan(20);
      expect(terrace.every((s) => s.covered)).toBe(true);
    });

    it('marks Field MVP 115-125 covered (back rows under Legends Suite Club + Main overhang)', () => {
      for (const id of ['115', '116', '117A', '117B', '118', '119',
                        '120A', '120B', '121A', '121B', '122', '123', '124', '125']) {
        const sec = sectionById(id);
        expect(sec).toBeDefined();
        expect(sec.covered).toBe(true);
      }
    });

    it('marks LF Bleachers 235-239 NOT covered ("fully exposed" per shadedseats)', () => {
      ['235', '236', '237', '238', '239'].forEach((id) => {
        expect(sectionById(id).covered).toBe(false);
      });
    });

    it('marks RF Bleachers 201-204 covered (under Bleacher Café roof)', () => {
      ['201', '202', '203', '204'].forEach((id) => {
        expect(sectionById(id).covered).toBe(true);
      });
    });

    it('marks Field/Legends Suite 11-29 NOT covered (Legends Club provides only marginal back-row shade)', () => {
      ['11', '12', '13', '14A', '14B', '20', '21A', '21B', '27A', '27B', '28', '29'].forEach((id) => {
        expect(sectionById(id).covered).toBe(false);
      });
    });

    it('marks Champions Suite 215/216 covered (premium indoor club)', () => {
      ['215', '216'].forEach((id) => {
        const sec = sectionById(id);
        expect(sec.covered).toBe(true);
        expect(sec.level).toBe('suite');
      });
    });

    it('marks Jim Beam Suites 317-321 as covered suite-level', () => {
      ['317', '318', '319', '320A', '320B', '320C', '321'].forEach((id) => {
        const sec = sectionById(id);
        expect(sec.covered).toBe(true);
        expect(sec.level).toBe('suite');
      });
    });

    it('marks Mohegan Sun, Bleacher Café, Audi Yankees Club, Pepsi Lounge all covered', () => {
      ['MOHEGAN-SUN', 'BLEACHER-CAFE', 'AUDI-CLUB', 'PEPSI-LOUNGE'].forEach((id) => {
        expect(sectionById(id).covered).toBe(true);
      });
    });
  });

  describe('east/west sun physics at evening west sun (az 280° el 8°)', () => {
    const sunAz = 280;
    const sunEl = 8;

    it('LF Bleachers 235-239 (compass ~13-45° E half, uncovered) are sunlit at sunset', () => {
      const lfBleachers = ['235', '236', '237', '238', '239'].map(sectionById);
      const avg =
        lfBleachers.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        lfBleachers.length;
      expect(avg).toBeGreaterThan(20);
    });

    it('Lower Field Outfield 103-105 (deep RF, compass ~75-89° E half, uncovered) are sunlit', () => {
      const rf = ['103', '104', '105'].map(sectionById);
      const avg =
        rf.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        rf.length;
      expect(avg).toBeGreaterThan(25);
    });

    it('Lower Field Outfield 134-136 (deep LF, compass ~335-355° W half, uncovered) are shaded', () => {
      const lf = ['134', '135', '136'].map(sectionById);
      const avg =
        lf.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        lf.length;
      // West-half uncovered should be shaded (lower exposure than east-half).
      expect(avg).toBeLessThan(15);
    });

    it('aggregate uncovered-east exposure > uncovered-west exposure (physics holds)', () => {
      const uncov = yankeesSections.filter((s) => !s.covered && s.level !== 'standing');
      const split = uncov.map((s) => ({
        compass: sectionCompassAngle(asSS(s), ORIENTATION),
        exp: getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION),
      }));
      const east = split.filter((d) => d.compass >= 0 && d.compass < 180);
      const west = split.filter((d) => d.compass >= 180 && d.compass < 360);
      const avg = (a: typeof split) =>
        a.length ? a.reduce((x, y) => x + y.exp, 0) / a.length : 0;
      expect(east.length).toBeGreaterThan(0);
      expect(west.length).toBeGreaterThan(0);
      expect(avg(east)).toBeGreaterThan(avg(west) + 15);
    });
  });
});

/**
 * Real Fenway Park section data — physics + structural invariants.
 *
 * Authored 2026-05-21. Pins:
 *   1. Section count (275) and presence of distinctive Fenway IDs
 *      (Green Monster seats M-1..M-10, Pesky's Pole-area RB-97, Field Box
 *      40 / 44 behind HP, Grandstand GS-33 LF wrap, EMC/Dell Tech Club,
 *      Pavilion Box, Royal Rooters Club, Hornitos Cantina).
 *   2. Spatial layout — Field Box 40 directly behind HP (compass ~232°
 *      SW), Green Monster seats in LF (compass ~7-27° N/NNE), Pesky's
 *      Pole-area Field Box 1 at compass ~97° E, Bleachers in deep CF
 *      (compass ~47-70°).
 *   3. Structural coverage — all Grandstand covered EXCEPT GS-33; all
 *      Monster Seats uncovered; all Bleachers uncovered; all Pavilion
 *      Box covered; all EMC Club covered; State Street Pavilion Club
 *      uncovered (outdoor club despite lounge access).
 *   4. East/west sun physics — at evening west sun, the EAST half of
 *      the Fenway bowl (CF and 1B/RF side, compass 0-180°) is lit; the
 *      WEST half (3B/LF foul-line wrap, compass 180-360°) is shaded.
 */

import { redsoxSections } from '../redsox';
import { sectionCompassAngle, getSectionSunExposure } from '../../../../utils/sectionSunCalculations';
import type { StadiumSection } from '../../../stadiumSectionTypes';
import type { DetailedSection } from '../../../../types/stadium-complete';
import { MLB_STADIUMS } from '../../../stadiums';

const FENWAY = MLB_STADIUMS.find((s) => s.id === 'redsox')!;
const ORIENTATION = FENWAY.orientation; // 52°
const sectionById = (id: string) => redsoxSections.find((s) => s.id === id)!;

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

describe('redsoxSections — Fenway Park real seating data', () => {
  it('Fenway orientation is 52° in stadiums.ts', () => {
    expect(ORIENTATION).toBe(52);
  });

  it('has 270+ sections covering field/lower/club/upper/suite/standing', () => {
    expect(redsoxSections.length).toBeGreaterThanOrEqual(270);
    const levels = new Set(redsoxSections.map((s) => s.level));
    expect(levels.has('field')).toBe(true);
    expect(levels.has('lower')).toBe(true);
    expect(levels.has('club')).toBe(true);
    expect(levels.has('upper')).toBe(true);
    expect(levels.has('suite')).toBe(true);
    expect(levels.has('standing')).toBe(true);
  });

  it('contains the distinctive Fenway section IDs', () => {
    const ids = new Set(redsoxSections.map((s) => s.id));
    ['FB-1', 'FB-40', 'FB-44', 'FB-82',                          // Field Box: Pesky's Pole, behind HP, LF wrap
     'LB-98', 'LB-132', 'LB-165',                                 // Loge Box: RF, behind HP, LF wrap
     'GS-1', 'GS-17', 'GS-33',                                    // Grandstand: RF, behind HP, LF (uncovered)
     'BL-34', 'BL-43',                                            // Bleachers: CF/RCF and LCF
     'M-1', 'M-5', 'M-10',                                        // Monster Seats: Green Monster
     'RB-87', 'RB-97',                                            // Right Field Box
     'RR-23', 'RR-43',                                            // Right Field Roof Box
     'EMCC-1', 'EMCC-6',                                          // EMC / Dell Tech Club
     'HPPC-1', 'HPPC-5',                                          // Home Plate Pavilion Club
     'SSPC-1', 'SSPC-14',                                         // State Street Pavilion Club
     'PB-1', 'PB-14',                                             // Pavilion Box
     'PR-15', 'PR-18',                                            // Pavilion Reserved
     'ROYAL-ROOTERS', 'HORNITOS-CANTINA', 'GREEN-MONSTER-SRO',    // Specialty
    ].forEach((id) => {
      expect(ids.has(id)).toBe(true);
    });
  });

  describe('spatial layout (stadium-local → compass)', () => {
    it('places Field Box 40 directly behind home plate (compass ~232° SW)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('FB-40')), ORIENTATION);
      // HP→CF = 52°; behind HP = 232°.
      expect(angularDist(compass, 232)).toBeLessThan(5);
    });

    it('places Field Box 1 near Pesky\'s Pole (RF foul, compass ~97° E)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('FB-1')), ORIENTATION);
      // RF foul pole = orientation + 45 = 97°.
      expect(angularDist(compass, 97)).toBeLessThan(8);
    });

    it('places Green Monster seats M-5 in LF on top of the wall (compass ~15° N/NNE)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('M-5')), ORIENTATION);
      expect(angularDist(compass, 15)).toBeLessThan(8);
    });

    it('places Bleachers 37 in deep CF (compass ~53° E of N)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('BL-37')), ORIENTATION);
      // BL-37 sits in the middle of the CF bleachers, near the HP→CF axis.
      expect(angularDist(compass, 53)).toBeLessThan(8);
    });

    it('places Grandstand 17 directly behind HP (compass ~232° SW)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('GS-17')), ORIENTATION);
      expect(angularDist(compass, 232)).toBeLessThan(8);
    });

    it('places Grandstand 33 in the LF wrap-around (compass ~6° N)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('GS-33')), ORIENTATION);
      expect(angularDist(compass, 6)).toBeLessThan(8);
    });

    it('places Royal Rooters Club behind HP (compass ~232° SW)', () => {
      const compass = sectionCompassAngle(asSS(sectionById('ROYAL-ROOTERS')), ORIENTATION);
      expect(angularDist(compass, 232)).toBeLessThan(5);
    });
  });

  describe('coverage matches real Fenway architecture', () => {
    it('marks every Grandstand covered EXCEPT GS-33 (per RateYourSeats)', () => {
      const grandstand = redsoxSections.filter((s) => /^GS-\d+$/.test(s.id));
      expect(grandstand.length).toBe(33);
      const covered = grandstand.filter((s) => s.covered);
      const uncovered = grandstand.filter((s) => !s.covered);
      expect(covered.length).toBe(32);
      expect(uncovered.length).toBe(1);
      expect(uncovered[0].id).toBe('GS-33');
    });

    it('marks all Green Monster Seats uncovered (open atop the wall)', () => {
      const monster = redsoxSections.filter((s) => /^M-\d+$/.test(s.id));
      expect(monster.length).toBe(10);
      expect(monster.every((s) => !s.covered)).toBe(true);
    });

    it('marks all Bleachers uncovered ("bake all afternoon" per shadedseats)', () => {
      const bleachers = redsoxSections.filter((s) => /^BL-\d+$/.test(s.id));
      expect(bleachers.length).toBe(10);
      expect(bleachers.every((s) => !s.covered)).toBe(true);
    });

    it('marks all Pavilion Box covered (under Pavilion roof)', () => {
      const pavilionBox = redsoxSections.filter((s) => /^PB-\d+$/.test(s.id));
      expect(pavilionBox.length).toBe(14);
      expect(pavilionBox.every((s) => s.covered)).toBe(true);
      expect(pavilionBox.every((s) => s.level === 'suite')).toBe(true);
    });

    it('marks all EMC Club covered (indoor club behind HP)', () => {
      const emc = redsoxSections.filter((s) => /^EMCC-\d+$/.test(s.id));
      expect(emc.length).toBe(6);
      expect(emc.every((s) => s.covered)).toBe(true);
    });

    it('marks all Right Field Box uncovered (no overhang above)', () => {
      const rb = redsoxSections.filter((s) => /^RB-\d+$/.test(s.id));
      expect(rb.length).toBe(11);
      expect(rb.every((s) => !s.covered)).toBe(true);
    });

    it('marks all Right Field Roof Box uncovered (open atop the RF grandstand roof)', () => {
      const rr = redsoxSections.filter((s) => /^RR-\d+$/.test(s.id));
      expect(rr.length).toBe(11);
      expect(rr.every((s) => !s.covered)).toBe(true);
    });

    it('marks State Street Pavilion Club all uncovered (open-air despite lounge access)', () => {
      const sspc = redsoxSections.filter((s) => /^SSPC-\d+$/.test(s.id));
      expect(sspc.length).toBe(14);
      expect(sspc.every((s) => !s.covered)).toBe(true);
    });

    it('marks Field Box 39-50 covered (only inner FB sections under press box)', () => {
      for (let n = 39; n <= 50; n++) {
        expect(sectionById(`FB-${n}`).covered).toBe(true);
      }
      // Sections outside that range NOT covered.
      ['FB-38', 'FB-51', 'FB-1', 'FB-82'].forEach((id) => {
        expect(sectionById(id).covered).toBe(false);
      });
    });

    it('marks Loge Box 123-136 covered (consistently shaded behind HP)', () => {
      for (let n = 123; n <= 136; n++) {
        expect(sectionById(`LB-${n}`).covered).toBe(true);
      }
      ['LB-122', 'LB-137', 'LB-98', 'LB-165'].forEach((id) => {
        expect(sectionById(id).covered).toBe(false);
      });
    });
  });

  describe('east/west sun physics at evening west sun (az 280° el 8°)', () => {
    const sunAz = 280;
    const sunEl = 8;

    it('Green Monster Seats (compass ~7-27° E half, uncovered) are sunlit at sunset', () => {
      const monster = redsoxSections.filter((s) => /^M-\d+$/.test(s.id));
      const avg =
        monster.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        monster.length;
      expect(avg).toBeGreaterThan(20);
    });

    it('Bleachers in CF (compass ~23-70° E half, uncovered) are sunlit at sunset', () => {
      const bleachers = redsoxSections.filter((s) => /^BL-\d+$/.test(s.id));
      const avg =
        bleachers.reduce((acc, s) => acc + getSectionSunExposure(asSS(s), sunEl, sunAz, ORIENTATION), 0) /
        bleachers.length;
      expect(avg).toBeGreaterThan(25);
    });

    it('aggregate uncovered-east exposure > uncovered-west exposure (physics holds)', () => {
      const uncov = redsoxSections.filter((s) => !s.covered && s.level !== 'standing');
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

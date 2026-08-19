/**
 * Pins the stadium-local → compass conversion used across the shade engines.
 *
 * `section.baseAngle` is stadium-local (0 = 1B, 90 = CF, 180 = 3B, 270 = behind
 * home). `sunAzimuth` is an absolute compass bearing. Comparing the two
 * directly is only correct if the section angle is converted first:
 *
 *     sectionCompass = (orientation + 90 − baseAngle) mod 360
 *
 * `calculateGameSunExposure`'s helper skipped that conversion and returned the
 * raw local angle, so a park's orientation had no effect on which side of the
 * bowl the main app reported as shaded. These tests assert the conversion holds
 * and, crucially, that orientation actually moves the result.
 *
 * @jest-environment node
 */

import { sectionCompassAngle } from '../sectionSunCalculations';
import {
  venueSectionCompassAngle,
  sectionAngleConventionFor,
} from '../bowlGeometry';

const sec = (baseAngle: number, angleSpan = 0) => ({ baseAngle, angleSpan });

describe('sectionCompassAngle — documented landmark mapping', () => {
  // With home plate → center field pointing due north (orientation 0):
  //   1B is to the catcher's right (east, 90), CF straight ahead (north, 0),
  //   3B to the catcher's left (west, 270), home plate behind (south, 180).
  it.each([
    ['1B', 0, 90],
    ['CF', 90, 0],
    ['3B', 180, 270],
    ['behind home', 270, 180],
  ])('orientation 0: %s (baseAngle %i) → compass %i', (_label, baseAngle, expected) => {
    expect(sectionCompassAngle(sec(baseAngle), 0)).toBe(expected);
  });

  // Rotating the whole park rotates every section with it.
  it.each([
    [0, 90],
    [45, 135],
    [90, 180],
    [270, 0],
  ])('orientation %i rotates the 1B section to compass %i', (orientation, expected) => {
    expect(sectionCompassAngle(sec(0), orientation)).toBe(expected);
  });

  it('accounts for angleSpan by using the section centre', () => {
    // centre = baseAngle + span/2 = 10, so compass = 0 + 90 − 10 = 80
    expect(sectionCompassAngle(sec(0, 20), 0)).toBe(80);
  });

  it('always returns a normalised bearing in [0, 360)', () => {
    for (let orientation = 0; orientation < 360; orientation += 15) {
      for (let base = 0; base < 360; base += 15) {
        const a = sectionCompassAngle(sec(base), orientation);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThan(360);
      }
    }
  });

  // The regression that mattered: the old helper ignored orientation entirely,
  // so these would all have been equal.
  it('produces a DIFFERENT bearing for parks with different orientations', () => {
    const bearings = [0, 45, 90, 180, 270].map(o => sectionCompassAngle(sec(30), o));
    expect(new Set(bearings).size).toBe(bearings.length);
  });
});

describe('NFL compass-from-north convention', () => {
  it('treats NFL / football venues as compass-from-north', () => {
    expect(sectionAngleConventionFor({ league: 'NFL' })).toBe('compass-from-north');
    expect(sectionAngleConventionFor({ venueType: 'football' })).toBe('compass-from-north');
    expect(sectionAngleConventionFor({ sport: 'football' })).toBe('compass-from-north');
    expect(sectionAngleConventionFor({ league: 'MLB' })).toBe('baseball-local');
    expect(sectionAngleConventionFor({ league: 'MiLB' })).toBe('baseball-local');
  });

  it('does not apply the baseball +90/−local rotation to NFL sections', () => {
    // Hard Rock §101 is documented as baseAngle 0 = north endzone.
    // The baseball formula would map that to orientation+90 = east.
    expect(venueSectionCompassAngle(sec(0), 0, 'compass-from-north')).toBe(0);
    expect(venueSectionCompassAngle(sec(90), 0, 'compass-from-north')).toBe(90);
    expect(venueSectionCompassAngle(sec(180, 20), 45, 'compass-from-north')).toBe(190);
    expect(venueSectionCompassAngle(sec(0), 0, 'baseball-local')).toBe(90);
  });
});

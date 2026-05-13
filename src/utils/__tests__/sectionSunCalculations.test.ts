/**
 * Section-level sun-exposure regression tests.
 *
 * Headline case: pre-Phase 2, `isSectionInSun` reported east-facing stands
 * as shaded at sunset because the same-side-only heuristic missed the
 * dominant "rays cross the bowl directly into the seats" geometry. These
 * tests pin the corrected model.
 */

import {
  isSectionInSun,
  getSectionSunExposure,
} from '../sectionSunCalculations';
import type { StadiumSection } from '../../data/stadiumSectionTypes';

const eastSection: StadiumSection = {
  id: 'east',
  name: 'East lower bowl (3B line)',
  level: 'lower',
  baseAngle: 80,
  angleSpan: 20,
  covered: false,
};

const westSection: StadiumSection = {
  id: 'west',
  name: 'West lower bowl (1B line)',
  level: 'lower',
  baseAngle: 260,
  angleSpan: 20,
  covered: false,
};

const homePlateSection: StadiumSection = {
  id: 'home',
  name: 'Behind home plate',
  level: 'lower',
  baseAngle: 170,
  angleSpan: 20,
  covered: false,
};

const coveredUpper: StadiumSection = {
  id: 'covered',
  name: 'Covered upper deck',
  level: 'upper',
  baseAngle: 80,
  angleSpan: 20,
  covered: true,
};

describe('isSectionInSun', () => {
  it('reports false below the horizon', () => {
    expect(isSectionInSun(eastSection, 290, -5)).toBe(false);
    expect(isSectionInSun(eastSection, 290, 0)).toBe(false);
  });

  it('reports false for covered sections except at very high sun', () => {
    expect(isSectionInSun(coveredUpper, 180, 45)).toBe(false);
    expect(isSectionInSun(coveredUpper, 180, 60)).toBe(false);
    expect(isSectionInSun(coveredUpper, 180, 70)).toBe(true);
  });

  // PRIMARY REGRESSION: this case used to return `false`.
  it('reports the opposite-side stands as lit at low sun', () => {
    // 2025-07-04 ~19:30 ET at Yankee Stadium: sun at ~290° azimuth, ~7° elevation.
    // East stands (baseAngle 80°) are opposite the sun (angleDiff ≈ 150°)
    // and receive direct light across the bowl.
    expect(isSectionInSun(eastSection, 290, 7)).toBe(true);
  });

  it('reports same-side stands as lit at low sun', () => {
    // West stands at the same low sun receive back-lighting; they are still
    // physically illuminated even if dimmer than the opposite side.
    expect(isSectionInSun(westSection, 290, 7)).toBe(true);
  });

  it('reports all uncovered sections lit at high sun', () => {
    for (const section of [eastSection, westSection, homePlateSection]) {
      expect(isSectionInSun(section, 180, 70)).toBe(true);
    }
  });
});

describe('getSectionSunExposure', () => {
  it('returns 0 below the horizon', () => {
    expect(getSectionSunExposure(eastSection, -5, 290)).toBe(0);
  });

  it('returns 0 for covered sections at moderate sun', () => {
    expect(getSectionSunExposure(coveredUpper, 45, 180)).toBe(0);
  });

  it('returns higher exposure for opposite-side stands than same-side at low sun', () => {
    // Sun in west at 7° elevation.
    const opposite = getSectionSunExposure(eastSection, 7, 290);
    const same = getSectionSunExposure(westSection, 7, 290);
    expect(opposite).toBeGreaterThan(same);
    // Opposite side must report meaningful exposure (not zero) — this is the
    // physical-realism bar that the prior heuristic failed.
    expect(opposite).toBeGreaterThan(15);
  });

  it('saturates near 100 for high sun on an uncovered section', () => {
    const highExposure = getSectionSunExposure(homePlateSection, 75, 180);
    expect(highExposure).toBeGreaterThan(85);
  });

  it('falls off as elevation drops, holding azimuth constant', () => {
    const high = getSectionSunExposure(eastSection, 60, 290);
    const mid = getSectionSunExposure(eastSection, 30, 290);
    const low = getSectionSunExposure(eastSection, 5, 290);
    expect(high).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(low);
  });

  it('is bounded to [0, 100]', () => {
    // Sweep a chunk of the parameter space and assert range.
    for (let az = 0; az < 360; az += 30) {
      for (let el = -10; el <= 90; el += 10) {
        for (const section of [eastSection, westSection, homePlateSection, coveredUpper]) {
          const exp = getSectionSunExposure(section, el, az);
          expect(exp).toBeGreaterThanOrEqual(0);
          expect(exp).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});

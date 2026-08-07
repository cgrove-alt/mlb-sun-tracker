/**
 * Seasonal shade copy must be derived from real solar geometry, not a fixed
 * table. Every venue page previously printed the same sentence per month, which
 * conveyed nothing about the park.
 *
 * @jest-environment node
 */

import {
  peakSunAltitude,
  seasonalSunFacts,
  buildSeasonalShadeCopy,
  overhangShadowReachFt,
  REFERENCE_OVERHANG_FT,
} from '../seasonalShade';
import { MLB_STADIUMS } from '../../data/stadiums';

const SEASON = [3, 4, 5, 6, 7, 8, 9];
const stadium = (id: string) => MLB_STADIUMS.find(s => s.id === id)!;

describe('peakSunAltitude', () => {
  it('peaks in June for northern-hemisphere parks', () => {
    const s = stadium('mariners');
    const june = peakSunAltitude(s.latitude, s.longitude, 5);
    for (const m of [3, 4, 6, 7, 8, 9]) {
      expect(june).toBeGreaterThan(peakSunAltitude(s.latitude, s.longitude, m));
    }
  });

  it('gives a lower sun to higher-latitude parks in the same month', () => {
    const seattle = stadium('mariners');   // ~47.6°N
    const miami = stadium('marlins');      // ~25.8°N
    expect(peakSunAltitude(seattle.latitude, seattle.longitude, 5))
      .toBeLessThan(peakSunAltitude(miami.latitude, miami.longitude, 5));
  });

  // Solar geometry sanity: noon altitude ≈ 90 − |lat − declination|.
  it.each([
    ['mariners', 5, 66],  // Seattle, June
    ['marlins', 5, 88],   // Miami, June
    ['marlins', 9, 56],   // Miami, October
  ])('%s month %i is near %i°', (id, month, expected) => {
    const s = stadium(id);
    expect(peakSunAltitude(s.latitude, s.longitude, month)).toBeCloseTo(expected, -0.5);
  });
});

describe('overhangShadowReachFt', () => {
  it('throws a longer shadow as the sun gets lower', () => {
    expect(overhangShadowReachFt(30)).toBeGreaterThan(overhangShadowReachFt(60));
    expect(overhangShadowReachFt(60)).toBeGreaterThan(overhangShadowReachFt(85));
  });

  it('matches height / tan(altitude) at 45°', () => {
    expect(overhangShadowReachFt(45)).toBeCloseTo(REFERENCE_OVERHANG_FT, 5);
  });
});

describe('seasonalSunFacts', () => {
  it('reports zero degrees below peak for the season high month', () => {
    const s = stadium('yankees');
    const facts = seasonalSunFacts(s.latitude, s.longitude, SEASON);
    const top = facts.find(f => f.degreesBelowPeakMonth === 0);
    expect(top).toBeDefined();
    expect(top!.month).toBe(5); // June
  });

  it('covers exactly the requested months', () => {
    const s = stadium('cubs');
    expect(seasonalSunFacts(s.latitude, s.longitude, SEASON).map(f => f.month)).toEqual(SEASON);
  });
});

describe('buildSeasonalShadeCopy', () => {
  it('produces different copy for parks at different latitudes', () => {
    const seattle = stadium('mariners');
    const miami = stadium('marlins');
    const a = buildSeasonalShadeCopy(seattle.latitude, seattle.longitude, seattle.name, SEASON);
    const b = buildSeasonalShadeCopy(miami.latitude, miami.longitude, miami.name, SEASON);

    // Same month, materially different geometry -> different sentence.
    expect(a[0].note).not.toBe(b[0].note);
    expect(a[0].peakAltitudeDeg).toBeLessThan(b[0].peakAltitudeDeg);
  });

  // The original bug: April, May and June all read the same.
  it('produces different copy for each month within one park', () => {
    const s = stadium('dodgers');
    const copy = buildSeasonalShadeCopy(s.latitude, s.longitude, s.name, SEASON);
    const notes = new Set(copy.map(c => c.note));
    expect(notes.size).toBe(copy.length);
  });

  it('names the park and the month in every entry', () => {
    const s = stadium('redsox');
    for (const c of buildSeasonalShadeCopy(s.latitude, s.longitude, s.name, SEASON)) {
      expect(c.note).toContain(c.name);
      expect(c.note).toMatch(/\d+°/);
    }
  });

  it('never emits a nonsensical shadow figure for a near-overhead sun', () => {
    // Miami's June sun is ~87.5°; a ratio-based metric produced "556% further".
    const s = stadium('marlins');
    for (const c of buildSeasonalShadeCopy(s.latitude, s.longitude, s.name, SEASON)) {
      const m = c.note.match(/(\d+) ft of seating|~(\d+) ft/);
      if (m) {
        const ft = Number(m[1] ?? m[2]);
        expect(ft).toBeGreaterThanOrEqual(0);
        expect(ft).toBeLessThan(200);
      }
    }
  });

  it('works for every MLB stadium without throwing', () => {
    for (const s of MLB_STADIUMS) {
      const copy = buildSeasonalShadeCopy(s.latitude, s.longitude, s.name, SEASON);
      expect(copy).toHaveLength(SEASON.length);
      copy.forEach(c => expect(c.note.length).toBeGreaterThan(40));
    }
  });
});

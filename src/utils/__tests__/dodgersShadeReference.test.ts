/**
 * Dodger Stadium reference checks: the shade engine against published
 * observations. Games are real 2025 Dodgers home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 27° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (dodgersSeatMap.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/uniqlo-field-at-dodger-stadium/seating/shaded-covered-seats
 *         and its section pages (1, 15, 46, 52, 124, 139, 166, 229, 1IR, 11IR, 30R, 1TD, 301, 302)
 *
 * Partly reproduced, with heights and covered rows measured on USGS lidar:
 *   - Field 52FD is not in the sun at first pitch: the Loge's edge is over
 *     its 16th row (the sources say T, the 20th), so 10 of its 25 rows are
 *     covered and it reads partly shaded. The other Field sections are.
 *   - Infield Reserve rows N and up are shaded through the 9th inning; three
 *     hours in, a sun almost side-on reaches 10RS's row N just under the Top
 *     Deck's edge.
 *   - The pavilion roof's edge is 39 ft up, about 15 ft above the first row
 *     under it, so the afternoon sun in front reaches the first two rows
 *     under it from the 4th inning; the last row (X) stays shaded.
 */
import { dodgersSections } from '../../data/sections/mlb/dodgers';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'dodgers')!;
const structure = getStadiumStructure('dodgers')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: dodgersSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_20_110PM = game('2025-07-20', '13:10'); // vs Brewers
const JUNE_15_410PM = game('2025-06-15', '16:10'); // vs Giants

const section = (result: GameShadeResult, id: string) => {
  const found = result.sections.find((s) => s.sectionId === id);
  if (!found) throw new Error(`No result for section ${id}`);
  return found;
};
const meanShade = (result: GameShadeResult, ids: string[], samples?: number[]) => {
  const picks = samples ?? result.sun.map((_, i) => i);
  return ids.flatMap((id) => picks.map((i) => section(result, id).samples[i].shadedFraction))
    .reduce((a, b) => a + b, 0) / (ids.length * picks.length);
};
const ids = (from: number, to: number, step: number, suffix: string) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => `${from + i * step}${suffix}`);
/** Shaded share of a section's rows from `fromRow` (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = dodgersSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const sunInFront = (result: GameShadeResult, id: string, sample = 0) => {
  const facing = dodgersSections.find((x) => x.id === id)!.standCompass!;
  const d = Math.abs(result.sun[sample].azimuthDeg - facing) % 360;
  return (d > 180 ? 360 - d : d) > 90;
};

const thirdBaseLoge = ids(123, 165, 2, 'LG');
const firstBaseLoge = ids(124, 166, 2, 'LG');

describe('Dodger Stadium: a 1:10 PM game in July', () => {
  it.each(ids(1, 53, 1, 'FD').filter((id) => id !== '52FD'))('[RYS] Field level %s is in the sun at first pitch (shade is scarce at midday)', (id) => {
    expect(section(JULY_20_110PM, id).samples[0].status).toBe('sun');
  });

  it('[RYS] the third-base Loge gets more shade than the first-base Loge', () => {
    expect(meanShade(JULY_20_110PM, thirdBaseLoge)).toBeGreaterThan(meanShade(JULY_20_110PM, firstBaseLoge));
  });

  it('[RYS] the first-base Loge sees more sun as the game goes on', () => {
    const last = JULY_20_110PM.sun.length - 1;
    expect(meanShade(JULY_20_110PM, firstBaseLoge, [last])).toBeLessThan(meanShade(JULY_20_110PM, firstBaseLoge, [0]));
  });

  it('[RYS] the third-base Field level gets more shade than the first-base side', () => {
    expect(meanShade(JULY_20_110PM, ids(1, 53, 2, 'FD'))).toBeGreaterThan(meanShade(JULY_20_110PM, ids(2, 52, 2, 'FD')));
  });

  it.each(ids(229, 261, 2, 'CL'))('[RYS] Club level %s is shaded all game (under the Reserve deck)', (id) => {
    expect(section(JULY_20_110PM, id).samples.every((s) => s.status === 'shaded')).toBe(true);
  });

  it.each(ids(1, 11, 1, 'RS'))('[RYS] Infield Reserve %s: rows N and higher are shaded through the 9th inning (under the Top Deck)', (id) => {
    expect(backRowsShaded(JULY_20_110PM, id, 13).slice(0, 6).every((share) => share === 1)).toBe(true);
  });

  it.each(['301PL', '309PL', '315PL', '302PR', '310PR', '316PR'])(
    '[RYS] Pavilion %s: the last row under the roof is shaded and the front rows are in the sun',
    (id) => {
      // Rows T (19th) and up are under the roof, whose edge is 39 ft up; the
      // pavilions face home plate, so the afternoon sun in front reaches the
      // first rows under it (see the header). The last row stays shaded.
      expect(backRowsShaded(JULY_20_110PM, id, 22).every((share) => share === 1)).toBe(true);
      expect(backRowsShaded(JULY_20_110PM, id, 1).every((share) => share < 0.5)).toBe(true);
    },
  );
});

describe('Dodger Stadium: a 4:10 PM game in June', () => {
  it.each(ids(15, 27, 2, 'FD'))('[RYS] Field %s (behind the Dodgers dugout): rows N and higher are mostly shaded from 30 minutes in, fully within two hours', (id) => {
    const shares = backRowsShaded(JUNE_15_410PM, id, 13);
    expect(shares.slice(1).every((share) => share >= 0.5)).toBe(true);
    expect(shares[4]).toBe(1);
  });

  it.each(['46FD', '48FD', '50FD'])('[RYS] Field %s (first-base side) faces the sun and is in it at first pitch', (id) => {
    expect(sunInFront(JUNE_15_410PM, id)).toBe(true);
    expect(section(JUNE_15_410PM, id).samples[0].status).toBe('sun');
  });

  it.each(ids(24, 60, 4, 'RS'))('[RYS] first-base Lower Reserve %s faces the sun and is in it at first pitch', (id) => {
    expect(sunInFront(JUNE_15_410PM, id)).toBe(true);
    expect(section(JUNE_15_410PM, id).samples[0].status).toBe('sun');
  });

  it('[RYS] the third-base Loge is in complete shade from an hour in', () => {
    for (const id of thirdBaseLoge) {
      expect(section(JUNE_15_410PM, id).samples.slice(2).every((s) => s.status === 'shaded')).toBe(true);
    }
  });
});

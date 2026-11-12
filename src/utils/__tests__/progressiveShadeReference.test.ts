/**
 * Progressive Field reference checks: the shade engine against published
 * observations. Games are real 2025 Guardians home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 0° ±1.5°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/progressive-field/seating/shaded-covered-seats
 *         and its section pages (103–185, 303–348, 403–478, 519–567)
 *
 * Its noon-game advice (sections 257–267 under the suites) names sections
 * that are not on the current seat map, so it is not checked.
 */
import { guardiansSections } from '../../data/sections/mlb/guardians';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'guardians')!;
const structure = getStadiumStructure('guardians')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: guardiansSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1.5,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_20_140PM = game('2025-07-20', '13:40'); // vs Athletics
const JUNE_28_410PM = game('2025-06-28', '16:10'); // vs Cardinals
const JULY_22_640PM = game('2025-07-22', '18:40'); // vs Orioles

const section = (result: GameShadeResult, id: string) => {
  const found = result.sections.find((s) => s.sectionId === id);
  if (!found) throw new Error(`No result for section ${id}`);
  return found;
};
const meanShade = (result: GameShadeResult, ids: readonly string[], samples?: number[]) => {
  const picks = samples ?? result.sun.map((_, i) => i);
  return ids.flatMap((id) => picks.map((i) => section(result, id).samples[i].shadedFraction))
    .reduce((a, b) => a + b, 0) / (ids.length * picks.length);
};
const onMap = (ids: string[]) => ids.filter((id) => guardiansSections.some((s) => s.id === id));
const range = (from: number, to: number) => onMap(Array.from({ length: to - from + 1 }, (_, i) => String(from + i)));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = guardiansSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};

const firstBase = range(128, 148);
const thirdBaseLine = range(162, 172);

describe('Progressive Field: a 4:10 PM game in June', () => {
  it('[RYS] the third-base side sees shade first in late afternoon, especially 162–172', () => {
    const at640 = 5;
    expect(meanShade(JUNE_28_410PM, thirdBaseLine, [at640])).toBeGreaterThan(0.5);
    expect(meanShade(JUNE_28_410PM, thirdBaseLine, [at640])).toBeGreaterThan(meanShade(JUNE_28_410PM, firstBase, [at640]) + 0.2);
    expect(meanShade(JUNE_28_410PM, thirdBaseLine, [0])).toBeLessThan(0.05);
  });
});

describe('Progressive Field: a 6:40 PM game in July', () => {
  it('[RYS] right field (103–113, 303–316) stays in the sun until the sun sets', () => {
    for (const ids of [range(103, 113), range(303, 316)]) {
      for (const i of [0, 1, 2]) expect(meanShade(JULY_22_640PM, ids, [i])).toBeLessThan(0.35);
    }
  });

  it('[RYS] the third-base side is in the shade through the evening', () => {
    expect(meanShade(JULY_22_640PM, range(158, 175))).toBeGreaterThan(0.95);
  });
});

describe('Progressive Field: a 1:40 PM game in July', () => {
  // Covered-row checks start one row behind the deck's edge, which the sun
  // reaches under the edge as it drops (as at the other parks).
  it.each(firstBase)('[RYS] %s: rows X and up are under the club overhang, shaded all game', (id) => {
    const s = guardiansSections.find((x) => x.id === id)!;
    const coveredFrom = s.rows.length === 34 ? 24 : 19;
    expect(rowsShaded(JULY_20_140PM, id, coveredFrom + 1).every((share) => share === 1)).toBe(true);
  });

  it.each(firstBase)('[RYS] %s: the first-base side sees abundant sunshine below the overhang', (id) => {
    const s = guardiansSections.find((x) => x.id === id)!;
    const coveredFrom = s.rows.length === 34 ? 24 : 19;
    expect(rowsShaded(JULY_20_140PM, id, 1, coveredFrom - 1).every((share) => share === 0)).toBe(true);
  });

  it.each(['109', '111', '113'])('[RYS] %s: only the last few rows (V and up) are covered and shaded', (id) => {
    expect(rowsShaded(JULY_20_140PM, id, 23).every((share) => share === 1)).toBe(true);
    expect(rowsShaded(JULY_20_140PM, id, 1, 21).every((share) => share === 0)).toBe(true);
  });

  it('[RYS] 117 sees perhaps the most sunshine: no overhead protection', () => {
    expect(meanShade(JULY_20_140PM, ['117'])).toBeLessThan(0.05);
    expect(meanShade(JUNE_28_410PM, ['117'])).toBeLessThan(0.05);
  });

  // Row M's position: rows A–U or A–T (13), D–T in 326 (10), C–T in 348 (11).
  const rowM = (id: string) => (id === '326' ? 10 : id === '348' ? 11 : 13);
  it.each(range(326, 348))('[RYS] club %s: rows M and up are covered, shaded all game', (id) => {
    expect(rowsShaded(JULY_20_140PM, id, rowM(id) + 1).every((share) => share === 1)).toBe(true);
  });

  it.each(range(303, 316))('[RYS] %s: covered from row M, yet as sunny as the seats below', (id) => {
    // Facing the afternoon sun, rows M–N catch it under the deck's edge late
    // in the game; the rows behind stay shaded.
    expect(rowsShaded(JULY_20_140PM, id, rowM(id) + 2).every((share) => share === 1)).toBe(true);
    expect(meanShade(JULY_20_140PM, [id])).toBeLessThan(0.45);
  });

  it('[RYS] the upper level overhang is little match in afternoon games but helps in late afternoon', () => {
    const upperThird = range(546, 567);
    expect(meanShade(JULY_20_140PM, upperThird)).toBeLessThan(0.5);
    expect(meanShade(JUNE_28_410PM, upperThird, [6])).toBeGreaterThan(meanShade(JULY_20_140PM, upperThird, [0]));
  });
});

/**
 * Citi Field reference checks: the shade engine against published
 * observations. Games are real 2025 Mets home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 14° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/citi-field/seating/shaded-covered-seats
 *         and its section pages (102, 108, 114, 121–133, 134–143, 306–336, 405–435, 505–535)
 */
import { metsSections } from '../../data/sections/mlb/mets';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'mets')!;
const structure = getStadiumStructure('mets')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: metsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_23_110PM = game('2025-07-23', '13:10'); // vs Angels
const JULY_19_410PM = game('2025-07-19', '16:10'); // vs Reds

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
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
const inMap = (ids: string[]) => ids.filter((id) => metsSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = metsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};

const firstBase100s = inMap(range(102, 117));
const thirdBase100s = inMap(range(122, 132));

describe('Citi Field: a 1:10 PM game in July', () => {
  it('[RYS] the third-base side is the shaded side: its 100s out-shade the first-base 100s', () => {
    expect(meanShade(JULY_23_110PM, thirdBase100s)).toBeGreaterThan(meanShade(JULY_23_110PM, firstBase100s));
  });

  it.each(thirdBase100s)('[RYS] third-base 100 level %s: the last ten rows are mostly shaded', (id) => {
    const shares = backRowsShaded(JULY_23_110PM, id, 23);
    expect(shares.filter((share) => share >= 0.5).length).toBeGreaterThanOrEqual(shares.length - 1);
  });

  it.each(inMap(range(320, 333)))('[RYS] Excelsior %s: rows 3 and higher are shaded through the afternoon', (id) => {
    const shares = backRowsShaded(JULY_23_110PM, id, 3);
    expect(shares.every((share) => share >= 0.75)).toBe(true);
  });

  it('[RYS] first-base Excelsior 306–312 are shaded at first pitch but sunnier by the end', () => {
    const ids = inMap(range(306, 312));
    const last = JULY_23_110PM.sun.length - 1;
    expect(meanShade(JULY_23_110PM, ids, [0])).toBeGreaterThan(0.5);
    expect(meanShade(JULY_23_110PM, ids, [last])).toBeLessThan(meanShade(JULY_23_110PM, ids, [0]));
  });

  it.each(inMap(range(109, 114)))('[RYS] the top rows of %s stay shaded all nine innings', (id) => {
    expect(backRowsShaded(JULY_23_110PM, id, 30).every((share) => share === 1)).toBe(true);
  });

  it.each(inMap(range(520, 538)))('[RYS] third-base Promenade %s: rows 10 and higher are out of the sun', (id) => {
    expect(backRowsShaded(JULY_23_110PM, id, 10).every((share) => share >= 0.75)).toBe(true);
  });

  it.each(inMap(range(134, 139)))('[RYS] left-field section %s: the upper rows are shaded all afternoon', (id) => {
    expect(backRowsShaded(JULY_23_110PM, id, 8).every((share) => share === 1)).toBe(true);
  });

  it.each(inMap(range(140, 143)))('[RYS] right-field section %s is in the sun all game', (id) => {
    expect(section(JULY_23_110PM, id).samples.every((s) => s.status === 'sun')).toBe(true);
  });
});

describe('Citi Field: a 4:10 PM game in July', () => {
  it('[RYS] the sun sets behind the third-base side: its 100s get much more shade than the first base side', () => {
    expect(meanShade(JULY_19_410PM, thirdBase100s)).toBeGreaterThan(meanShade(JULY_19_410PM, firstBase100s) + 0.3);
  });

  it('[RYS] the first-base 100s stay mostly in the sun into the late innings', () => {
    expect(meanShade(JULY_19_410PM, firstBase100s, [0, 1, 2, 3, 4, 5])).toBeLessThan(0.3);
  });
});

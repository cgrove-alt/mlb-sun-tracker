/**
 * Citizens Bank Park reference checks: the shade engine against published
 * observations. Games are real 2025 Phillies home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 9° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/citizens-bank-park/seating/shaded-covered-seats
 *         and its section pages (101–148, 201–245, 301–333, 412–434)
 *
 * Not reproduced: [RYS] says Hall of Fame Club 225–232 are out of the sun by
 * the third inning of a 1 PM game. The model gets there in September for
 * 226 and 229–232 (tested below), but in July and August it takes until
 * about the fifth inning. In 225, 227 and 228 it doesn't get there at all:
 * the heights are now measured (USGS lidar, 2024–25), and the 300 level's
 * front reaches out over row 3, 70 ft up, while the sources count the
 * covered rows from row 7 (none in 227). The model keeps the sourced rows,
 * so the rows behind that edge get no shade from the deck over them; on the
 * ground they sit under it, which is what would put them out of the sun.
 * Which rows to count as covered is open, so the 200 level's cover is
 * marked unsettled and these answers are not labelled High.
 * [RYS] also says about half of the right-field seats are shaded at first
 * pitch; the model has 10–40%, and agrees that they end up in the sun.
 */
import { philliesSections } from '../../data/sections/mlb/phillies';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'phillies')!;
const structure = getStadiumStructure('phillies')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: philliesSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_4_105PM = game('2025-07-04', '13:05'); // vs Reds
const JULY_5_405PM = game('2025-07-05', '16:05'); // vs Reds
const SEPT_14_135PM = game('2025-09-14', '13:35'); // vs Royals

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
/** Shaded share of a section's rows from its `fromRow`-th row (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = philliesSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const firstBase100s = range(108, 118);
const thirdBase100s = range(129, 139);

describe('Citizens Bank Park: a 1:05 PM game in July', () => {
  it('[RYS] the sun sets over the third-base side: its 100s out-shade the first-base 100s', () => {
    expect(meanShade(JULY_4_105PM, thirdBase100s)).toBeGreaterThan(meanShade(JULY_4_105PM, firstBase100s));
  });

  it('[RYS] sections 108–110 are directly in the sun', () => {
    expect(meanShade(JULY_4_105PM, range(108, 110))).toBeLessThan(0.1);
  });

  // Physical row 30 as a position in each section's rows: 132 starts with
  // rows A and B, 139 starts at row 11.
  it.each([
    ['129', 30], ['130', 30], ['131', 30], ['132', 32], ['133', 30], ['137', 30], ['138', 30], ['139', 20],
  ] as const)('[RYS] third-base section %s: rows 30 and up are mostly shaded within the first couple of innings', (id, row30) => {
    expect(backRowsShaded(JULY_4_105PM, id, row30)[2]).toBeGreaterThanOrEqual(0.5);
  });

  it('[RYS] 134–136 are the exception: their back rows get much less shade', () => {
    const backShade = (ids: string[]) =>
      ids.flatMap((id) => backRowsShaded(JULY_4_105PM, id, 30)).reduce((a, b) => a + b, 0) / (ids.length * JULY_4_105PM.sun.length);
    expect(backShade(range(134, 136))).toBeLessThan(backShade(['129', '130', '131', '133', '137', '138']) - 0.3);
  });

  it.each(range(423, 434))('[RYS] Terrace Deck %s: rows 6 and up are shaded, and rows 1–5 by mid-afternoon', (id) => {
    const rows6Up = backRowsShaded(JULY_4_105PM, id, 6);
    expect(rows6Up[0]).toBeGreaterThanOrEqual(0.6);
    expect(rows6Up.slice(3).every((share) => share === 1)).toBe(true);
    expect(section(JULY_4_105PM, id).samples[last(JULY_4_105PM)].shadedFraction).toBe(1);
  });

  it.each([...range(212, 217).map((id) => [id, 8] as const), ...range(412, 417).map((id) => [id, 13] as const)])(
    '[RYS] first-base side: the top rows of %s stay shaded all nine innings',
    (id, fromRow) => {
      expect(backRowsShaded(JULY_4_105PM, id, fromRow).every((share) => share === 1)).toBe(true);
    },
  );
});

describe('Citizens Bank Park: a 4:05 PM game in July', () => {
  it.each([
    ['101–114', range(101, 114)],
    ['201–211', range(201, 211)],
    ['301–310', range(301, 310)],
    ['412–418', range(412, 418)],
  ] as const)('[RYS] right field and first base %s: in the sun by the final out', (_label, ids) => {
    expect(meanShade(JULY_5_405PM, [...ids], [last(JULY_5_405PM)])).toBeLessThan(meanShade(JULY_5_405PM, [...ids], [0]));
    expect(meanShade(JULY_5_405PM, [...ids], [last(JULY_5_405PM)])).toBeLessThan(0.15);
  });

  it('[RYS] the third-base 100s fill with shade long before the first-base side', () => {
    expect(meanShade(JULY_5_405PM, thirdBase100s, [last(JULY_5_405PM)])).toBeGreaterThan(0.8);
    expect(meanShade(JULY_5_405PM, firstBase100s, [last(JULY_5_405PM)])).toBeLessThan(0.1);
  });
});

describe('Citizens Bank Park: a 1:35 PM game in September', () => {
  it.each(['226', '229', '230', '231', '232'])('[RYS] Hall of Fame Club %s is out of the sun by the third inning', (id) => {
    const samples = section(SEPT_14_135PM, id).samples;
    expect(samples[2].shadedFraction).toBeGreaterThanOrEqual(0.9);
    expect(samples.slice(3).every((s) => s.shadedFraction === 1)).toBe(true);
  });
});

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
 * The covered rows come from the lidar (USGS, 2024–25) where it puts a
 * deck's edge more than two rows from the source's. That reproduces [RYS]'s
 * Hall of Fame Club 225–232, out of the sun by the third inning of a 1 PM
 * game, in July as well as September (tested below): the 300 level's front
 * reaches out over row 3, where the sources count from row 7 (none in 227).
 *
 * Partly reproduced, since the lidar's covered rows (recorded, not tuned):
 *   - [RYS] calls 108–110 directly in the sun, counting the 200 level's
 *     cover from row 37 (beyond 108's last row). The scan puts that deck's
 *     edge over 108's 21st row, 109's 23rd and 110's 28th, so their back
 *     rows are under it: on average a quarter of their rows are shaded
 *     through a 1 PM July game (4% before). Tested: the front 20 rows, in
 *     front of the deck in all three, are in the sun all game.
 *   - [RYS] says 134–136's back rows get much less shade than their
 *     neighbours' (in 135 only the wheelchair row behind row 37 is
 *     covered). The scan puts the 200 level's edge over rows 34, 34 and 30
 *     there, against 21–31 in the neighbours, so their rows 30 and up are
 *     88% shaded through that game against 100% (47% before). Tested: less.
 * [RYS] also says about half of the right-field seats are shaded at first
 * pitch; the model has 15–35% (none in 101), and agrees that they end up in
 * the sun.
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

  // The front 20 rows only: the 200 level reaches over the rows behind (header).
  it.each(range(108, 110))('[RYS] section %s is directly in the sun: its front 20 rows all game', (id) => {
    const s = philliesSections.find((x) => x.id === id)!;
    const { stand } = standFor(structure, id, s.rows.length)!;
    const front20 = JULY_4_105PM.sun.map((sun) => rowLight(stand, s.standCompass!, structure.park, sun).slice(0, 20));
    expect(front20.every((rows) => rows.every((l) => l === 'sun'))).toBe(true);
  });

  // Physical row 30 as a position in each section's rows: 132 starts with
  // rows A and B, 139 starts at row 11.
  it.each([
    ['129', 30], ['130', 30], ['131', 30], ['132', 32], ['133', 30], ['137', 30], ['138', 30], ['139', 20],
  ] as const)('[RYS] third-base section %s: rows 30 and up are mostly shaded within the first couple of innings', (id, row30) => {
    expect(backRowsShaded(JULY_4_105PM, id, row30)[2]).toBeGreaterThanOrEqual(0.5);
  });

  // "Much less" is not reproduced: the 200 level reaches over their back rows too (header).
  it('[RYS] 134–136 are the exception: their back rows get less shade', () => {
    const backShade = (ids: string[]) =>
      ids.flatMap((id) => backRowsShaded(JULY_4_105PM, id, 30)).reduce((a, b) => a + b, 0) / (ids.length * JULY_4_105PM.sun.length);
    expect(backShade(range(134, 136))).toBeLessThan(backShade(['129', '130', '131', '133', '137', '138']));
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

describe('Citizens Bank Park: Hall of Fame Club at a 1 PM game, July and September', () => {
  it.each(range(225, 232))('[RYS] Hall of Fame Club %s is out of the sun by the third inning', (id) => {
    for (const result of [JULY_4_105PM, SEPT_14_135PM]) {
      const samples = section(result, id).samples;
      expect(samples[2].shadedFraction).toBeGreaterThanOrEqual(0.9);
      expect(samples.slice(3).every((s) => s.shadedFraction === 1)).toBe(true);
    }
  });
});

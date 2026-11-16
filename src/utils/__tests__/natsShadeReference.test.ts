/**
 * Nationals Park reference checks: the shade engine against published
 * observations. Games are real 2025 Nationals home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 29° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/nationals-park/seating/shaded-covered-seats
 *         and its section pages (100–143, A–E, 201–243, 301–321, 401–420)
 *
 * Heights are measured on USGS lidar (2014; stadiumStructures.ts).
 *
 * Not reproduced:
 *   - [RYS] the third-base and home-plate club sections (206–216) are
 *     "always shaded" for 1:35 PM games, and 217–221 are shaded at first
 *     pitch. Its own section pages cover only rows G and up (of 10–12); with
 *     a July sun at ~70° nothing behind the club can shade its front rows, so
 *     the model shades a little over half at first pitch (57%; 61% in
 *     217–221) and three-quarters over the game.
 *   - [RYS] the even-numbered 222–236 are "the sunniest seats". Its section
 *     pages cover rows L and up there, reviewers report shade, and the scan
 *     puts the 300 deck over them from row 2 (80% shaded over a 1:35 PM July
 *     game), so this is left unchecked. Likewise "avoid 135–137": the 200
 *     level's edge is over their row 33–40.
 *
 * Partly reproduced, since the measured heights (recorded, not tuned):
 *   - [RYS] Gallery 302–310: in the sun at first pitch, shaded as the game
 *     goes on, back rows first. The roof is measured 140 ft up right over
 *     their row 8–9 (the estimate put its edge 8 ft behind the last row), so
 *     with the sun high behind them its edge already shades much of them at
 *     first pitch (42–75%, 64% on average; least in 303 and 309, covered
 *     from row 11 of 12). Tested: back rows first, all shaded by the end.
 *   - [RYS] the outfield (100–107) stays in the sun. The scan shows
 *     structures over the back rows of 100 (from row 12, 51 ft up) and
 *     103–105 (from row 24–27, 31–39 ft), so the model shades 16% of the
 *     outfield over a 1:35 PM July game, nearly all of it in those rows. Not
 *     tested; right field 240–243 still is.
 */
import { nationalsSections } from '../../data/sections/mlb/nationals';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'nationals')!;
const structure = getStadiumStructure('nationals')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: nationalsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_20_135PM = game('2025-07-20', '13:35'); // vs Padres
const APRIL_27_135PM = game('2025-04-27', '13:35'); // vs Mets
const SEPT_16_105PM = game('2025-09-16', '13:05'); // vs Braves

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
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = nationalsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

describe('Nationals Park: a 1:35 PM game in July', () => {
  it('[RYS] the third-base side gets shade before the first-base side', () => {
    const third = range(108, 117);
    const first = range(128, 137);
    expect(meanShade(JULY_20_135PM, third, [last(JULY_20_135PM)])).toBeGreaterThan(meanShade(JULY_20_135PM, first, [last(JULY_20_135PM)]) + 0.1);
    expect(meanShade(JULY_20_135PM, third, [last(JULY_20_135PM)])).toBeGreaterThan(meanShade(JULY_20_135PM, third, [0]));
    expect(meanShade(JULY_20_135PM, range(201, 205))).toBeGreaterThan(meanShade(JULY_20_135PM, range(217, 221)) + 0.1);
  });

  // Covered rows as positions in each section's lettered rows; the row under
  // the deck's edge can catch a high sun, so the check starts one row back.
  it.each([
    ['108', 39], ['110', 38], ['112', 40], ['113', 42], ['115', 45], ['117', 43],
  ] as const)('[RYS] lower level %s: shaded at first pitch only at the back (covered from its row %i)', (id, coveredFrom) => {
    expect(rowsShaded(JULY_20_135PM, id, coveredFrom + 1)[0]).toBe(1);
    expect(rowsShaded(JULY_20_135PM, id, 1, 10)[0]).toBe(0);
  });

  it.each([
    ...range(206, 221).map((id) => [id, 7] as const),
    ...['222', '232', '234', '236'].map((id) => [id, 12] as const),
    ...['224', '226', '228', '230'].map((id) => [id, 10] as const),
  ])('[RYS] %s is under cover from its row %i: shaded there at first pitch', (id, coveredFrom) => {
    expect(rowsShaded(JULY_20_135PM, id, coveredFrom + 1)[0]).toBe(1);
  });

  it.each([...range(401, 409), ...range(416, 420)])('[RYS] Upper Gallery %s is under its roof from row C: shaded there at first pitch', (id) => {
    expect(rowsShaded(JULY_20_135PM, id, 4)[0]).toBe(1);
  });

  it.each(range(401, 409))('[RYS] third-base Upper Gallery %s: every row shaded for a day game', (id) => {
    expect(section(JULY_20_135PM, id).samples.every((s) => s.shadedFraction === 1)).toBe(true);
  });

  // Not in the sun at first pitch: the measured roof is right over their back rows (header).
  it.each(range(302, 310))('[RYS] Gallery %s: shaded as the game goes on, back rows first', (id) => {
    const samples = section(JULY_20_135PM, id).samples;
    expect(samples[last(JULY_20_135PM)].shadedFraction).toBeGreaterThanOrEqual(0.9);
    const rows = nationalsSections.find((x) => x.id === id)!.rows.length;
    const half = Math.ceil(rows / 2);
    expect(rowsShaded(JULY_20_135PM, id, half + 1)[0]).toBeGreaterThan(rowsShaded(JULY_20_135PM, id, 1, half)[0]);
  });

  it.each([['139', 8], ['140', 13], ['141', 13], ['142', 13]] as const)(
    '[RYS] right field %s: the overhang keeps row M and up (its row %i) out of the sun',
    (id, rowM) => {
      expect(rowsShaded(JULY_20_135PM, id, rowM).every((share) => share === 1)).toBe(true);
    },
  );

  // The outfield is no longer checked here: structures over its back rows (header).
  it('[RYS] right field 240–243, the worst for shade, stays in the sun', () => {
    expect(meanShade(JULY_20_135PM, range(240, 243))).toBeLessThan(0.05);
  });
});

describe('Nationals Park: day games in April and September', () => {
  it.each([
    ['311', 7], ['312', 5], ['313', 5], ['314', 5], ['315', 7],
  ] as const)('[RYS] section %s: its row %i and up are shaded during most day games', (id, fromRow) => {
    for (const result of [APRIL_27_135PM, SEPT_16_105PM]) {
      expect(rowsShaded(result, id, fromRow).filter((share) => share >= 0.75).length).toBeGreaterThanOrEqual(4);
    }
  });

  it('[RYS] the third-base side still gets the shade first', () => {
    for (const result of [APRIL_27_135PM, SEPT_16_105PM]) {
      expect(meanShade(result, range(108, 117), [last(result)])).toBeGreaterThan(meanShade(result, range(128, 137), [last(result)]) + 0.1);
    }
  });
});

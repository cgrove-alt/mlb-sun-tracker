/**
 * Petco Park reference checks: the shade engine against published
 * observations. Games are real 2025 Padres home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 0° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/petco-park/seating/shaded-covered-seats
 *         and its section pages (101–137, A–L, 201–235, 300–329)
 *
 * The heights are measured on USGS lidar (November 2024;
 * stadiumStructures.ts). On them two claims the estimated heights missed now
 * hold (tested below): most Lexus Club (Premier Club) seats are shaded by
 * first pitch (the Terrace level's front is over their row 4, where its
 * section pages count from 9), and in 300–305 the rows above 20 are
 * "guaranteed shade", all game.
 *
 * Not reproduced:
 *   - [RYS] all of the Lexus Club by the middle innings: its first rows, in
 *     front of the Terrace level's edge, stay in the sun (85–89% shaded all
 *     game).
 *   - [RYS] in 300–305, row 10 "will see shade in a few innings". The model
 *     shades from about row 9–12 back, under and just in front of the
 *     roof's edge, steady through a July game.
 */
import { padresSections } from '../../data/sections/mlb/padres';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'padres')!;
const structure = getStadiumStructure('padres')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: padresSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_110PM = game('2025-07-13', '13:10'); // vs Phillies
const SEPT_14_110PM = game('2025-09-14', '13:10'); // vs Rockies

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
const range = (from: number, to: number, step = 1) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => String(from + i * step));
/** Only the ids that are sections on the seat map. */
const onMap = (ids: string[]) => ids.filter((id) => padresSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = padresSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;
const rowCount = (id: string) => padresSections.find((x) => x.id === id)!.rows.length;

describe('Petco Park: a 1:10 PM game in July', () => {
  it('[RYS] most Lexus Club seats are shaded by first pitch', () => {
    expect(meanShade(JULY_13_110PM, onMap('ABCDEFGHIJKL'.split('')), [0])).toBeGreaterThan(0.5);
  });

  it.each(onMap(range(300, 305)).filter((id) => rowCount(id) > 20))('[RYS] section %s: the rows above 20 are guaranteed shade', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 21).every((share) => share === 1)).toBe(true);
  });

  it.each([
    ['100 level', range(108, 124, 2), range(107, 123, 2)],
    ['Upper level', onMap(range(306, 328, 2)), onMap(range(313, 327, 2))],
  ] as const)('[RYS] the third-base side (even numbers) is shaded long before the first-base side: %s', (_label, third, first) => {
    const end = last(JULY_13_110PM);
    expect(meanShade(JULY_13_110PM, [...third], [end])).toBeGreaterThan(meanShade(JULY_13_110PM, [...first], [end]) + 0.2);
    expect(meanShade(JULY_13_110PM, [...third], [end])).toBeGreaterThan(meanShade(JULY_13_110PM, [...third], [0]));
    expect(meanShade(JULY_13_110PM, [...first], [end])).toBeLessThan(meanShade(JULY_13_110PM, [...first], [0]));
  });

  // Rows 37+ (positions per section) are under the second deck; the row
  // under the deck's edge can catch a high sun, so checks start one back.
  it.each([['110', 25], ['112', 25], ['114', 31], ['116', 31], ['118', 30]] as const)(
    '[RYS] 110–118: the covered back of %s (its row %i on) is shaded from first pitch',
    (id, coveredFrom) => {
      expect(rowsShaded(JULY_13_110PM, id, coveredFrom + 1).every((share) => share === 1)).toBe(true);
    },
  );

  it.each(['114', '116', '118', '120'])('[RYS] rows 36 and up of %s have very good shade all day', (id) => {
    // Row 36 is the 30th labelled row in 114/116, the 29th in 118, the 28th in 120.
    const pos = { '114': 30, '116': 30, '118': 29, '120': 28 }[id]!;
    expect(rowsShaded(JULY_13_110PM, id, pos).every((share) => share >= 0.85)).toBe(true);
  });

  it('[RYS] the first-base 200 level: the sun plays nice early, then reaches more seats as the game goes on', () => {
    const firstTerrace = range(211, 215, 2);
    expect(meanShade(JULY_13_110PM, firstTerrace, [last(JULY_13_110PM)])).toBeLessThan(meanShade(JULY_13_110PM, firstTerrace, [0]));
  });

  it('[RYS] right field, especially the 200 level, is not good for shade', () => {
    expect(meanShade(JULY_13_110PM, onMap(range(227, 235, 2)))).toBeLessThan(0.15);
  });

  it.each(['A', 'C', 'F', 'J', 'L'])('[RYS] Lexus Club %s is covered from row 9', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 10)[0]).toBe(1);
  });
});

describe('Petco Park: a 1:10 PM game in September', () => {
  it.each([['117', 21], ['119', 15], ['121', 13]] as const)(
    '[RYS] section %s: rows 27 and up (its row %i on) have shade at first pitch that shrinks as the day goes on',
    (id, row27) => {
      const shares = rowsShaded(SEPT_14_110PM, id, row27);
      expect(shares[0]).toBeGreaterThanOrEqual(0.5);
      expect(shares[last(SEPT_14_110PM)]).toBeLessThan(shares[0]);
    },
  );

  it.each(['117', '119', '121'])('[RYS] the last two rows of %s stay shaded for most of the game', (id) => {
    const rows = rowCount(id);
    expect(rowsShaded(SEPT_14_110PM, id, rows - 1).filter((share) => share === 1).length).toBeGreaterThanOrEqual(5);
  });

  it('[RYS] the third-base side is still the shade side', () => {
    const end = last(SEPT_14_110PM);
    expect(meanShade(SEPT_14_110PM, range(108, 124, 2), [end])).toBeGreaterThan(meanShade(SEPT_14_110PM, range(107, 123, 2), [end]) + 0.2);
  });
});

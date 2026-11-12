/**
 * Rate Field reference checks: the shade engine against published
 * observations. Games are real 2025 White Sox home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 129° ±2°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/rate-field/seating/shaded-covered-seats
 *         and its section pages (100–164, 311–357, 506–558)
 *
 * Not reproduced (the deck heights are estimates):
 *   - [RYS] a photo "taken at 2:30pm in late July" with all but the first 15
 *     rows of the first-base 100s shaded: with the sun ~60° up behind them,
 *     the model shades rows 28 and up at 2:40 PM and reaches row 17 by
 *     3:40 PM.
 *   - [RYS] for 3:05 starts, "most lower-level rows" on the first-base side
 *     shaded at first pitch: about a third at 3:10 PM, then fully shaded by
 *     4:40 PM (RYS: "by 4:00–4:30").
 */
import { whitesoxSections } from '../../data/sections/mlb/whitesox';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'whitesox')!;
const structure = getStadiumStructure('whitesox')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: whitesoxSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 2,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_110PM = game('2025-07-13', '13:10'); // vs Guardians
const JULY_12_310PM = game('2025-07-12', '15:10'); // vs Guardians
const JULY_25_640PM = game('2025-07-25', '18:40'); // vs Cubs

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
const onMap = (ids: string[]) => ids.filter((id) => whitesoxSections.some((s) => s.id === id));
const range = (from: number, to: number) => onMap(Array.from({ length: to - from + 1 }, (_, i) => String(from + i)));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = whitesoxSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;
/** Position of a section's row 30 (or 33) — where Rate Your Seats says its cover starts. */
const coveredFrom = (id: string) => (structure.tiers.lowerBox.sections?.[id]?.overhang?.coveredFromRow ?? 0);

describe('Rate Field: a 1:10 PM game in July', () => {
  it.each(range(117, 129))('[RYS] %s: rows 30 and up are shaded when the game starts', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, coveredFrom(id) + 1)[0]).toBe(1);
  });

  it.each(range(506, 529))('[RYS] upper deck %s, first-base side: its back rows are shaded', (id) => {
    const s = whitesoxSections.find((x) => x.id === id)!;
    expect(rowsShaded(JULY_13_110PM, id, s.rows.length - 9).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] the first-base lower rows wait until the later innings for shade', () => {
    const lower = range(117, 129);
    expect(meanShade(JULY_13_110PM, lower, [last(JULY_13_110PM)])).toBeGreaterThan(meanShade(JULY_13_110PM, lower, [0]) + 0.4);
  });

  it('[RYS] the worst seats are on the third-base side and in the outfield', () => {
    const firstBase = meanShade(JULY_13_110PM, range(108, 131));
    expect(meanShade(JULY_13_110PM, range(133, 156))).toBeLessThan(firstBase);
    expect(meanShade(JULY_13_110PM, [...range(100, 105), ...range(157, 164)])).toBeLessThan(0.05);
  });

  it('[RYS] 155–161 are among the sunniest seats in baseball', () => {
    expect(meanShade(JULY_13_110PM, range(155, 161))).toBeLessThan(0.05);
  });

  it('[RYS] the club and upper deck down the left-field line (342–357, 542–558) are exposed early', () => {
    expect(meanShade(JULY_13_110PM, range(542, 558), [0])).toBeLessThan(meanShade(JULY_13_110PM, range(509, 529), [0]));
  });
});

describe('Rate Field: a 3:10 PM game in July', () => {
  it('[RYS] on the first-base side, the club (300s) and the 500 level are shaded', () => {
    expect(meanShade(JULY_12_310PM, range(311, 330))).toBeGreaterThan(0.95);
    expect(meanShade(JULY_12_310PM, range(506, 529))).toBeGreaterThan(0.9);
  });

  it('[RYS] the first-base lower rows are fully shaded by mid-game', () => {
    expect(meanShade(JULY_12_310PM, range(117, 129), [3])).toBeGreaterThan(0.95);
  });
});

describe('Rate Field: a 6:40 PM game in July', () => {
  it('[RYS] the left-field seats stay in the sun after the rest of the park is shaded', () => {
    expect(meanShade(JULY_25_640PM, range(108, 131), [0])).toBeGreaterThan(0.9);
    expect(meanShade(JULY_25_640PM, range(155, 164), [0])).toBeLessThan(0.1);
  });

  it('[RYS] 509–529 have the sun set behind them', () => {
    expect(meanShade(JULY_25_640PM, range(509, 529))).toBe(1);
  });
});

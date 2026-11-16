/**
 * Truist Park reference checks: the shade engine against published
 * observations. Games are real 2025 Braves home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 159° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/truist-park/seating/shaded-covered-seats
 *         and its section pages (1–42, 107–160, 210–246, 312–347, 410–444)
 *
 * The heights are measured on USGS lidar (2019; stadiumStructures.ts). On
 * them, two claims the estimated heights missed now hold: 220's rows 5 and
 * up are shaded through a late-afternoon game (tested below), and 215–218's
 * rows 3 and up, which have "good shade" for an afternoon start, are all
 * shaded from about the 5th inning of a 1:35 PM start (a third at first
 * pitch) as well as all through a 4:10 PM one (tested below).
 *
 * Not reproduced: [RYS] 212 is "in the shade for a day game". No source
 * says what covers 210–212 (the scan sees only the canopy over their last
 * rows), so they are rated with lower confidence; the model shades 211
 * from about the 6th inning of a 1:35 PM game and 212, the canopy measured
 * 4 ft behind its last row, from about the 4th (17% at first pitch).
 *
 * Partly reproduced, since the measured heights (recorded, not tuned):
 *   - [RYS] 110–122: rows 7 and up get relief from the sun all game. The 200
 *     level's underside is ~26 ft (its measured 35-ft front row less 9 ft;
 *     the estimate was 44), so row 7, in front of its edge, catches a
 *     near-overhead sun for the first hour. Rows 8 and up are shaded all
 *     game. Tested from the 4th half-hour on.
 *   - [RYS] 1–42 are among the most exposed seats, and 220–231 and 324–328
 *     stay in the sun. The roof canopy is measured 150 ft up, right over the
 *     300 level's front row (the estimates put lower decks behind these
 *     seats), and shades them as the sun moves behind it late in the game.
 *     Tested through about the 7th inning for 1–42 (no shade until then;
 *     9% over the game, against 62% in the 100s) and the 5th for 220–231
 *     and 324–328.
 */
import { bravesSections } from '../../data/sections/mlb/braves';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'braves')!;
const structure = getStadiumStructure('braves')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: bravesSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_20_135PM = game('2025-07-20', '13:35'); // vs Yankees
const JULY_5_410PM = game('2025-07-05', '16:10'); // vs Orioles
const SEPT_14_135PM = game('2025-09-14', '13:35'); // vs Astros

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
/** Only the ids that are sections on the seat map (110–122 skips 115, 117, …). */
const onMap = (ids: string[]) => ids.filter((id) => bravesSections.some((s) => s.id === id));
/** Shaded share of a section's rows from its `fromRow`-th row (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = bravesSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const firstBase100s = onMap(range(110, 118));
const thirdBase100s = onMap(range(133, 143));

describe('Truist Park: a 1:35 PM game in July', () => {
  it('[RYS] the first-base side is where to stay in the shade', () => {
    expect(meanShade(JULY_20_135PM, firstBase100s)).toBeGreaterThan(meanShade(JULY_20_135PM, thirdBase100s) + 0.1);
  });

  it.each(onMap(range(110, 122)))('[RYS] section %s: rows 7 and up get relief from the sun all game', (id) => {
    const rows7Up = backRowsShaded(JULY_20_135PM, id, 7);
    expect(Math.min(...rows7Up)).toBeGreaterThanOrEqual(0.85);
    // Row 7 catches a near-overhead sun in front of the deck's edge for the first hour (header).
    expect(rows7Up.slice(3).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] the third-base side faces the afternoon sun: its exposure grows through the game', () => {
    expect(meanShade(JULY_20_135PM, thirdBase100s, [last(JULY_20_135PM)]))
      .toBeLessThan(meanShade(JULY_20_135PM, thirdBase100s, [0]));
  });

  it.each([
    ...onMap([...range(110, 118), '122', '130', ...range(133, 143)]).map((id) => [id, 8] as const),
    ...onMap([...range(213, 218), ...range(233, 243)]).map((id) => [id, 14] as const),
    ...onMap([...range(312, 323), ...range(329, 343)]).map((id) => [id, 10] as const),
  ])('[RYS] section %s is under cover from row %i: shaded behind the deck edge at first pitch', (id, fromRow) => {
    // The row right under the deck's edge can catch a high sun from the side
    // (315 has only rows 1–10, so its one covered row is that edge row).
    const rows = bravesSections.find((x) => x.id === id)!.rows.length;
    expect(backRowsShaded(JULY_20_135PM, id, Math.min(fromRow + 1, rows))[0]).toBe(1);
  });

  // [RYS]: the upper deck between the bases is "almost entirely covered".
  // The lidar puts the canopy's edge over the 300 level's front row, ~25 ft
  // past the 400s' front row, and the model shades all of them all game.
  it.each(onMap(range(413, 444)))('[RYS] 400 level %s is under the roof canopy: at least three-quarters of it shaded all game', (id) => {
    expect(section(JULY_20_135PM, id).samples.every((s) => s.shadedFraction >= 0.75)).toBe(true);
  });

  it.each(onMap([...range(130, 143), '145']))('[RYS] third-base side %s: the last rows stay shaded', (id) => {
    const s = bravesSections.find((x) => x.id === id)!;
    expect(backRowsShaded(JULY_20_135PM, id, s.rows.length - 2).every((share) => share === 1)).toBe(true);
  });

  // Through about the 7th inning: then the canopy's shadow reaches some of them (header).
  it('[RYS] the premium seats closest to the field are among the most exposed', () => {
    expect(meanShade(JULY_20_135PM, onMap(range(1, 42)), [0, 1, 2, 3, 4])).toBeLessThan(0.05);
  });

  it('[RYS] areas to avoid: the outfield (146–155, 252) stays in the sun', () => {
    expect(meanShade(JULY_20_135PM, onMap([...range(146, 155), '252']))).toBeLessThan(0.1);
  });

  // Through about the 5th inning: then the canopy's shadow reaches them (header).
  it.each([
    ['the 300 level behind home (324–328)', range(324, 328)],
    ['the 200 level behind home (220–231)', onMap(range(220, 231))],
  ] as const)('[RYS] areas to avoid: %s stays in the sun', (_label, ids) => {
    expect(meanShade(JULY_20_135PM, [...ids], [0, 1, 2, 3])).toBeLessThan(0.1);
  });
});

describe('Truist Park: a 4:10 PM game in July', () => {
  it.each(range(215, 218))('[RYS] section %s rows 3 and up: good shade, all of it by the middle innings', (id) => {
    const rows3Up = backRowsShaded(JULY_5_410PM, id, 3);
    expect(rows3Up[0]).toBeGreaterThanOrEqual(0.5);
    expect(rows3Up.slice(3).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] section 220 rows 5 and up are shaded during late-afternoon games', () => {
    expect(backRowsShaded(JULY_5_410PM, '220', 5).every((share) => share === 1)).toBe(true);
  });

  it.each([['123', 8], ['124', 8], ['125', 9], ['126', 9], ['127', 11], ['128', 11]] as const)(
    '[RYS] behind home, section %s rows %i and up are shaded during late-afternoon games',
    (id, fromRow) => {
      expect(backRowsShaded(JULY_5_410PM, id, fromRow).every((share) => share === 1)).toBe(true);
    },
  );

  it('[RYS] the shade starts on the first-base side and moves toward home late in the day', () => {
    const firstBaseField = onMap(range(10, 21));
    const behindHome = onMap([...range(1, 5), ...range(22, 26)]);
    expect(meanShade(JULY_5_410PM, firstBaseField, [last(JULY_5_410PM)])).toBeGreaterThan(0.9);
    expect(meanShade(JULY_5_410PM, behindHome, [last(JULY_5_410PM)]))
      .toBeGreaterThan(meanShade(JULY_5_410PM, behindHome, [0]) + 0.3);
    expect(meanShade(JULY_5_410PM, onMap(range(27, 42)))).toBeLessThan(0.05);
  });
});

describe('Truist Park: a 1:35 PM game in September', () => {
  it('[RYS] the first-base side still out-shades the third-base side, whose shade shrinks', () => {
    expect(meanShade(SEPT_14_135PM, firstBase100s)).toBeGreaterThan(meanShade(SEPT_14_135PM, thirdBase100s) + 0.1);
    expect(meanShade(SEPT_14_135PM, thirdBase100s, [last(SEPT_14_135PM)]))
      .toBeLessThan(meanShade(SEPT_14_135PM, thirdBase100s, [0]));
  });
});

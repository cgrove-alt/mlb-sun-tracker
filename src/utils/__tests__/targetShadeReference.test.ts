/**
 * Target Field reference checks: the shade engine against published
 * observations. Games are real 2025 Twins home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 91° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/target-field/seating/shaded-covered-seats
 *         and its section pages (1–17, 101–140, 201–240, 301–334, A–V)
 *
 * Its advice for "1:00 p.m. games" holds in September, when the sun is
 * ~20° lower at 1 PM than in July, so the first-base side and the club are
 * checked on the September 14 game.
 *
 * The heights are measured on USGS lidar (May 2022; stadiumStructures.ts),
 * and so are the decks' edges where the scan sees them: the upper deck's
 * front (72 ft) over the club's row 6 (the source's 9), the club deck's
 * front (37 ft) over the 100s' row 14–17, and the canopy, 148 ft up, its
 * front edge over the 100s' last row. On them, now reproduced and tested:
 * club A–D shaded at a July 1 PM game; third-base rows 15–16 shaded by the
 * end of the game; bleacher rows 3–5 in the sun by the middle innings (the
 * porch over them measured 41 ft up); club E "shaded during most day
 * games" (its section page).
 *
 * Not reproduced (recorded, not tuned):
 *   - [RYS] 316–327 shaded at first pitch "but might eventually wind up in
 *     the sun": as the sun swings west it moves behind these seats, so the
 *     model shades them more as the game goes on (40% to 93%).
 *   - [RYS] club F–J "start in the sun" (the shade page, with E): the upper
 *     deck's front, 72 ft up over their row 6, shades all their rows from a
 *     3:10 PM first pitch, the sun (58° up) behind them. Tested: they end
 *     the game shaded.
 *
 * Partly reproduced:
 *   - [RYS] in July, rows 10 and up of the first-base 100s shaded at a 1 PM
 *     game: from the second hour on (the club deck's edge is over row 14).
 *   - [RYS] the boxes are "rarely shaded": unshaded for the first two hours
 *     of a July 1:10 PM game; then the canopy, measured 148 ft up and 84 ft
 *     behind them (estimated 110 and 110), shades the third-base boxes (13%
 *     over the game; 40% in September, against 25% checked before). Tested:
 *     the first two hours.
 *   - [RYS] third-base lower rows stay sunny: rows 1–10 all game; rows
 *     11–12 fall in the canopy's shadow in the last half-hour.
 *   - [RYS] the bleachers' rows 6 and up shaded: from row 7; row 6 gets the
 *     late sun under the porch.
 */
import { twinsSections } from '../../data/sections/mlb/twins';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'twins')!;
const structure = getStadiumStructure('twins')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: twinsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_110PM = game('2025-07-13', '13:10'); // vs Pirates
const SEPT_14_110PM = game('2025-09-14', '13:10'); // vs Diamondbacks
const JULY_4_310PM = game('2025-07-04', '15:10'); // vs Rays
const JULY_8_640PM = game('2025-07-08', '18:40'); // vs Cubs

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
  const s = twinsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

describe('Target Field: 1:10 PM games', () => {
  it('[RYS] the boxes (1–17) are rarely shaded: none for the first two hours', () => {
    expect(meanShade(JULY_13_110PM, range(1, 17), [0, 1, 2, 3])).toBeLessThan(0.05);
  });

  it.each(range(107, 122))('[RYS] %s: the last twelve rows (17 and up) are under the club level, shaded all game', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 18).every((share) => share === 1)).toBe(true);
  });

  it.each(range(107, 110))('[RYS] September: first-base %s is shaded from row 10 up, and the lower rows by the end', (id) => {
    expect(rowsShaded(SEPT_14_110PM, id, 10)[3]).toBe(1);
    expect(rowsShaded(SEPT_14_110PM, id, 1)[last(SEPT_14_110PM)]).toBe(1);
  });

  it.each(range(118, 122))('[RYS] third-base %s: rows 20 and up shaded at first pitch, 15–16 by the end, the lower rows stay sunny', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 20)[0]).toBe(1);
    expect(rowsShaded(JULY_13_110PM, id, 15, 16)[last(JULY_13_110PM)]).toBe(1);
    expect(rowsShaded(JULY_13_110PM, id, 1, 10).every((share) => share === 0)).toBe(true);
  });

  it.each(['A', 'B', 'C', 'D'])('[RYS] July: club %s is shaded at a 1 PM game', (id) => {
    expect(section(JULY_13_110PM, id).samples.every((s) => s.status === 'shaded')).toBe(true);
  });

  it('[RYS] club E is shaded during most day games', () => {
    expect(meanShade(JULY_13_110PM, ['E'])).toBeGreaterThan(0.75);
    expect(meanShade(JULY_4_310PM, ['E'])).toBeGreaterThan(0.75);
  });

  it.each(['A', 'B', 'C', 'D'])('[RYS] September: club %s is shaded after the first hour', (id) => {
    expect(rowsShaded(SEPT_14_110PM, id, 1).slice(3).every((share) => share === 1)).toBe(true);
  });

  it.each(['K', 'L', 'M', 'N', 'P', 'Q', 'R'])('[RYS] club %s: the upper rows begin in the shade', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 10)[0]).toBe(1);
  });

  it('[RYS] the 300s on the first-base side (301–316) stay shaded through a 1 PM game', () => {
    for (const i of JULY_13_110PM.sun.map((_, k) => k)) expect(meanShade(JULY_13_110PM, range(301, 315), [i])).toBeGreaterThan(0.75);
  });

  it('[RYS] 308–322 are among the best shade in the park', () => {
    const best = meanShade(JULY_13_110PM, range(308, 322));
    for (const ids of [range(1, 17), range(101, 127), ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R'], range(128, 131)]) {
      expect(best).toBeGreaterThan(meanShade(JULY_13_110PM, ids));
    }
  });

  it.each(['128', '129', '130', '131'])('[RYS] bleachers %s: the first two rows always in the sun, 3–5 by the middle innings; the rows behind shaded', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 1, 2).every((share) => share === 0)).toBe(true);
    expect(rowsShaded(JULY_13_110PM, id, 3, 5)[3]).toBe(0);
    expect(rowsShaded(JULY_13_110PM, id, 7).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] Treasure Island Cove (132–135) is covered: the best shade in the outfield', () => {
    const cove = meanShade(JULY_13_110PM, range(132, 135));
    expect(cove).toBeGreaterThan(0.75);
    for (const ids of [range(128, 131), range(136, 140), range(229, 234), range(237, 240), range(329, 334)]) {
      expect(cove).toBeGreaterThan(meanShade(JULY_13_110PM, ids));
    }
  });

  it.each([
    ['the Home Run Porch (229–234, 329–334)', [...range(229, 234), ...range(329, 334)]],
    ['the right-field 200s (237–240)', range(237, 240)],
  ] as const)('[RYS] %s: no shade for day games', (_label, ids) => {
    expect(meanShade(JULY_13_110PM, [...ids])).toBeLessThan(0.05);
    expect(meanShade(JULY_4_310PM, [...ids])).toBeLessThan(0.05);
  });
});

describe('Target Field: a 3:10 PM game in July', () => {
  it.each(['F', 'G', 'H', 'J'])('[RYS] club %s becomes shaded', (id) => {
    expect(section(JULY_4_310PM, id).samples[last(JULY_4_310PM)].shadedFraction).toBe(1);
  });
});

describe('Target Field: a 6:40 PM game in July', () => {
  it('[RYS] the sun sets behind home: the infield shades first, left and center field last', () => {
    expect(meanShade(JULY_8_640PM, range(107, 122), [0])).toBeGreaterThan(0.95);
    expect(meanShade(JULY_8_640PM, [...range(229, 234), ...range(329, 334), ...range(132, 140)], [0])).toBeLessThan(0.1);
  });

  it('[RYS] 333–334 are among the last seats to get shade', () => {
    const firstShaded = (id: string) => section(JULY_8_640PM, id).samples.findIndex((s) => s.shadedFraction >= 0.75);
    const lastToShade = Math.max(...twinsSections.filter((s) => /^\d{3}$/.test(s.id)).map((s) => firstShaded(s.id)));
    expect(firstShaded('333')).toBe(lastToShade);
    expect(firstShaded('334')).toBe(lastToShade);
  });
});

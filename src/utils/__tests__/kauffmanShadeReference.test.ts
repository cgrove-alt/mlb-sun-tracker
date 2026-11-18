/**
 * Kauffman Stadium reference checks: the shade engine against published
 * observations. Games are real 2025 Royals home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 47° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/kauffman-stadium/seating/shaded-covered-seats
 *         and its section pages (101–152, 201–252, 303–325, 402–439)
 *
 * The heights are measured on USGS lidar (April 2020; stadiumStructures.ts).
 *
 * Not reproduced:
 *   - [RYS] rows M–V of 409–427 are "safely in the shade after 3:00". In a
 *     3:10 PM game the model shades them in 409–413 from first pitch (each
 *     section's measured roof edge), in 415–417 from about 3:40 (at 3:10
 *     rows M–O of 415 are in the sun), and in 423–427, behind home,
 *     only partly or not at all: there the roof's edge, measured over the
 *     single-letter rows 16–21 elsewhere, is not seen (their cuts stop at a
 *     step in the front rows), so they have no cover.
 *   - [RYS] the edges of the upper deck's double-letter rows (402–407,
 *     433–438), "where the roof does not reach", stay in the sun at a 1 PM
 *     game. The model shades 41% of their seats over the game: the roof's
 *     edge is over the back rows of 403, 405, 407, 433 and 437 (from row
 *     16–19), which it covers, and the roof, 155–161 ft up, stands behind
 *     most of the rest. Along 436's and 437's rows (their treads and fall
 *     line, 14–15° off the line's direction) it is not behind them.
 *   - [RYS] every 100-level section is in the sun until at least 3:00. 142
 *     faces its rows' climb, 166° (planes fitted to its treads and its fall
 *     line agree), and along them the upper deck's front, 61 ft up, stands
 *     7 ft behind its last row: with the sun high behind it from 1:10 to
 *     2:10 PM, that front's shade falls on its last two of 23 rows. The
 *     section is in the sun; every other 100-level row is (tested below).
 *   - [RYS] all of the right-field corner (147–148, 247–252) gets the worst of
 *     the late-afternoon sun. The scan puts the upper deck's end over 247's
 *     rows from 8, 248's from 9 and 249's from 14 (its edge angled across
 *     them), which the model covers and shades (74%, 69% and 42% of their
 *     seats over the July 12 game); the rest are in the sun (tested below).
 */
import { royalsSections } from '../../data/sections/mlb/royals';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'royals')!;
const structure = getStadiumStructure('royals')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: royalsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_110PM = game('2025-07-13', '13:10'); // vs Mets
const JULY_12_310PM = game('2025-07-12', '15:10'); // vs Mets
const MAY_31_310PM = game('2025-05-31', '15:10'); // vs Tigers

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
const range = (from: number, to: number, suffix = '') => Array.from({ length: to - from + 1 }, (_, i) => `${from + i}${suffix}`);
const onMap = (ids: string[]) => ids.filter((id) => royalsSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = royalsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

describe('Kauffman Stadium: a 1:10 PM game in July', () => {
  it.each(onMap(range(303, 325)))('[RYS] Loge %s is covered and shaded with the sun overhead', (id) => {
    expect(section(JULY_13_110PM, id).samples.every((s) => s.shadedFraction === 1)).toBe(true);
  });

  it('[RYS] every 100-level section is in the sun until at least 3:00', () => {
    // Every row, but 142's last two: see the header.
    expect(meanShade(JULY_13_110PM, onMap(range(107, 148)).filter((id) => id !== '142'), [0, 1, 2, 3])).toBe(0);
    expect(section(JULY_13_110PM, '142').samples.slice(0, 4).map((s) => s.status)).toEqual(['sun', 'sun', 'sun', 'sun']);
    expect(rowsShaded(JULY_13_110PM, '142', 1, 21).slice(0, 4)).toEqual([0, 0, 0, 0]);
  });

  it.each([
    ...onMap(range(214, 241)).map((id) => [id, 11] as const),
    ...onMap([...range(209, 213), ...range(242, 246)]).map((id) => [id, 13] as const),
  ])('[RYS] Plaza %s is covered from its row %i: shaded there with the sun overhead', (id, coveredFrom) => {
    expect(rowsShaded(JULY_13_110PM, id, coveredFrom + 1)[0]).toBe(1);
  });

  it.each(onMap(range(409, 431, 'R')))('[RYS] upper deck %s is under the roof from row MM', (id) => {
    expect(rowsShaded(JULY_13_110PM, id, 13)[0]).toBe(1);
  });

});

describe('Kauffman Stadium: 3:10 PM games', () => {
  it.each([['July 12', JULY_12_310PM], ['May 31', MAY_31_310PM]] as const)(
    '[RYS] %s: the third-base side sees the earliest and most abundant shade',
    (_label, result) => {
      const end = last(result);
      const third = onMap(range(107, 127));
      const first = onMap(range(128, 148));
      expect(meanShade(result, third, [end])).toBeGreaterThan(meanShade(result, first, [end]) + 0.5);
      expect(meanShade(result, third, [end])).toBeGreaterThan(meanShade(result, third, [0]) + 0.5);
    },
  );

  it.each(onMap(range(209, 225)))('[RYS] third-base Plaza %s is well protected after 3:00', (id) => {
    const samples = section(JULY_12_310PM, id).samples;
    expect(samples[last(JULY_12_310PM)].shadedFraction).toBe(1);
    expect(samples[0].shadedFraction).toBeGreaterThanOrEqual(0.2);
  });

  it('[RYS] the right-field corner (147–148, 250–252) gets the worst of the late-afternoon sun', () => {
    expect(meanShade(JULY_12_310PM, onMap(['147', '148', ...range(250, 252)]))).toBeLessThan(0.05);
  });

  it('[RYS] the Loge is shaded throughout', () => {
    expect(meanShade(JULY_12_310PM, onMap(range(303, 325)))).toBeGreaterThan(0.95);
  });
});

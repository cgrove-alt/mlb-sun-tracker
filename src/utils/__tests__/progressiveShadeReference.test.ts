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
 *
 * The heights are measured on USGS lidar (November 2019; stadiumStructures.ts),
 * and so are the decks' edges where the scan sees them. Recorded, not tuned:
 *
 * Not reproduced:
 *   - [RYS] the right-field 300s (303–316), "covered from row M", are as
 *     sunny as the seats below and stay in the sun until sunset. The scan
 *     puts the upper deck's front (70 ft up) over their row 2, its
 *     underside ~58 ft: covered almost from the front, they are 57–67%
 *     shaded over a 6:40 PM game.
 *   - [RYS] the upper level's overhang is "little match in afternoon games".
 *     The roof canopy's edge is measured over the 500s' row 4 (D; the source
 *     covers from P), 138 ft up: on the third-base side, whose backs face
 *     the afternoon sun, it shades nearly all their rows (97% over a
 *     1:40 PM game).
 *
 * Partly reproduced:
 *   - [RYS] first base: rows X and up under the club overhang, shaded, with
 *     abundant sunshine below it. The scan puts the club deck's edge over
 *     row 19 in 129 and over row 13 in 142–148 (6 rows ahead of the
 *     source's), and its front row, 28 ft up, shades the row just in front
 *     of its edge while the sun is behind; its underside is 9 ft above the
 *     covered row's floor, so the late sun reaches the second covered row.
 *     Tested on the profile's edge: sun to two rows in front of it, shade
 *     from two rows behind it.
 *   - [RYS] 109–113: only the last few rows are covered. The 300s' front is
 *     measured over row 27 in 103–111 (V, row 22, in 113, where the scan
 *     sees no edge). Tested on the profile's edge, as above.
 *   - [RYS] club: rows M and up covered, shaded all game. The club's front
 *     row is measured 28 ft up (estimated 36) and the upper deck's lowest
 *     structure at its edge 58 ft, ~14 ft over row M's heads: the late sun
 *     reaches two rows in. Tested from three rows behind M.
 *   - [RYS] the third-base side sees shade first in late afternoon. It does
 *     (84% at 6:40 PM against 33% on the first-base side), but not from a
 *     sunny start: the upper deck's front, measured 72 ft up and 13 ft in
 *     front of the last row, and the suite level over row 24 shade the back
 *     rows from first pitch (30% at 4:10 PM). Tested: the shade grows.
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
    expect(meanShade(JUNE_28_410PM, thirdBaseLine, [0])).toBeLessThan(meanShade(JUNE_28_410PM, thirdBaseLine, [at640]) - 0.3);
  });
});

describe('Progressive Field: a 6:40 PM game in July', () => {
  it('[RYS] right field (103–113) stays in the sun until the sun sets', () => {
    for (const i of [0, 1, 2]) expect(meanShade(JULY_22_640PM, range(103, 113), [i])).toBeLessThan(0.35);
  });

  it('[RYS] the third-base side is in the shade through the evening', () => {
    expect(meanShade(JULY_22_640PM, range(158, 175))).toBeGreaterThan(0.95);
  });
});

describe('Progressive Field: a 1:40 PM game in July', () => {
  /** The first covered row in the profile: the scan's deck edge, or the source's row. */
  const edgeRow = (id: string) => {
    const s = guardiansSections.find((x) => x.id === id)!;
    return standFor(structure, id, s.rows.length)!.stand.overhang!.coveredFromRow;
  };
  it.each(firstBase)('[RYS] %s: the rows under the club overhang are shaded all game', (id) => {
    expect(rowsShaded(JULY_20_140PM, id, edgeRow(id) + 2).every((share) => share === 1)).toBe(true);
  });

  it.each(firstBase)('[RYS] %s: the first-base side sees abundant sunshine below the overhang', (id) => {
    expect(rowsShaded(JULY_20_140PM, id, 1, edgeRow(id) - 2).every((share) => share === 0)).toBe(true);
  });

  it.each(['109', '111', '113'])('[RYS] %s: only the last few rows are covered and shaded', (id) => {
    expect(rowsShaded(JULY_20_140PM, id, edgeRow(id) + 2).every((share) => share === 1)).toBe(true);
    expect(rowsShaded(JULY_20_140PM, id, 1, edgeRow(id) - 2).every((share) => share === 0)).toBe(true);
  });

  it('[RYS] 117 sees perhaps the most sunshine: no overhead protection', () => {
    expect(meanShade(JULY_20_140PM, ['117'])).toBeLessThan(0.05);
    expect(meanShade(JUNE_28_410PM, ['117'])).toBeLessThan(0.05);
  });

  // Row M's position: rows A–U or A–T (13), D–T in 326 (10), C–T in 348 (11).
  const rowM = (id: string) => (id === '326' ? 10 : id === '348' ? 11 : 13);
  it.each(range(326, 348))('[RYS] club %s: rows M and up are covered, shaded all game from three rows behind M', (id) => {
    expect(rowsShaded(JULY_20_140PM, id, rowM(id) + 3).every((share) => share === 1)).toBe(true);
  });
});

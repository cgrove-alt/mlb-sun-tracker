/**
 * loanDepot park reference checks: the shade engine against published
 * observations, with the roof open. Games are real 2025 Marlins home games
 * in March, April and September (shadedseats.com: the roof "is typically
 * only open on ideal weather days").
 *
 * Also counted as reference checks for this park:
 *   - orientation 129° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [SS]  https://www.shadedseats.com/loandepot-park-shaded-seats/
 *   [RYS] https://www.rateyourseats.com/loandepot-park/seating/shaded-covered-seats
 *
 * Not reproduced:
 *   - [SS] right field 34–40 "a decent spot for day games ... the sun at
 *     their backs as the game progresses": they face south-southeast, so
 *     the afternoon sun comes round in front of them; their covered back
 *     rows go from ~75% of the seats shaded at a 1:40 PM start to ~20% by
 *     the late innings.
 *   - Late in a 4:10 PM game the sun runs along the third-base rows from
 *     the west, past the parked roof panels beside them; a cross-section
 *     through each section does not see a structure off to the side, so the
 *     model shades that side only once the sun is below the far side.
 *   - [SS] at a 6:40 PM start "the further down the 3rd base line you sit,
 *     the longer you'll be in the sun": the same limit. The panels west of
 *     home should shade 17–20 before 21–25; the model has 17–20 ~71%
 *     shaded at first pitch and 21–25 ~83% (all shaded by the 2nd sample).
 */
import { marlinsSections } from '../../data/sections/mlb/marlins';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'marlins')!;
const structure = getStadiumStructure('marlins')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: marlinsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const APRIL_13_140PM = game('2025-04-13', '13:40'); // vs Nationals
const SEPT_14_140PM = game('2025-09-14', '13:40'); // vs Tigers
const MARCH_27_410PM = game('2025-03-27', '16:10'); // vs Pirates
const APRIL_15_640PM = game('2025-04-15', '18:40'); // vs Diamondbacks

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
const sec = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `SEC${from + i}`)
  .filter((id) => marlinsSections.some((s) => s.id === id));
/** Shaded share of a section's last `n` rows, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, n: number) => {
  const s = marlinsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(-n);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};

const firstBase = sec(1, 13);
const thirdBase = sec(17, 27);
const leftField = sec(28, 32);

describe.each([
  ['April 13', APRIL_13_140PM],
  ['September 14', SEPT_14_140PM],
])('loanDepot park (roof open): a 1:40 PM game on %s', (_, result) => {
  it('[SS] the first-base side is the shade side; the third-base side and left field are sunny', () => {
    for (let i = 0; i < result.sun.length; i++) {
      expect(meanShade(result, firstBase, [i])).toBeGreaterThan(meanShade(result, [...thirdBase, ...leftField], [i]) + 0.5);
    }
  });

  it('[SS] 304–309 are under cover, thanks to the retractable roof', () => {
    expect(meanShade(result, sec(304, 309))).toBe(1);
  });

  it('[RYS] the higher rows of 6–11 and 206–211 are the best combination of shade and view', () => {
    for (const id of sec(6, 11)) expect(backRowsShaded(result, id, 20).every((share) => share === 1)).toBe(true);
    expect(meanShade(result, sec(206, 211))).toBe(1);
  });

  it('[RYS] [SS] avoid left field and 26–28 down the third-base line', () => {
    expect(meanShade(result, [...sec(26, 28), ...leftField], [1, 2, 3, 4, 5])).toBeLessThan(0.05);
  });

  it('[SS] the back of 28–32 is under a permanent roof section; the sun reaches more rows over the game', () => {
    expect(meanShade(result, leftField, [0])).toBeGreaterThanOrEqual(meanShade(result, leftField, [result.sun.length - 1]));
    expect(backRowsShaded(result, 'SEC31', 3)[0]).toBe(1);
  });

  it('[SS] by the late innings most of the first-base line is shaded, especially further back', () => {
    expect(meanShade(result, firstBase, [result.sun.length - 1])).toBeGreaterThan(0.95);
  });
});

describe('loanDepot park (roof open): a 4:10 PM game in March', () => {
  it('[SS] the first-base line is the shade side; the third-base line and left field are exposed', () => {
    expect(meanShade(MARCH_27_410PM, firstBase, [0, 1, 2, 3])).toBe(1);
    expect(meanShade(MARCH_27_410PM, [...thirdBase, ...leftField], [0, 1, 2, 3])).toBeLessThan(0.05);
  });

  it('[RYS] the first-base side is well covered by part of the roof, especially in the upper deck', () => {
    expect(meanShade(MARCH_27_410PM, sec(302, 312))).toBe(1);
  });
});

describe('loanDepot park (roof open): a 6:40 PM game in April', () => {
  it('[SS] at first pitch the 1st base line and home plate are in shadow, with the 200 and 300 levels there', () => {
    expect(meanShade(APRIL_15_640PM, [...sec(1, 16), ...sec(201, 211), ...sec(302, 316)], [0])).toBe(1);
  });

  it('[SS] only the third-base side is still in some sun at first pitch', () => {
    expect(meanShade(APRIL_15_640PM, sec(17, 27), [0])).toBeLessThan(1);
  });

});

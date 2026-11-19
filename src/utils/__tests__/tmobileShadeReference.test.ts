/**
 * T-Mobile Park reference checks: the shade engine against published
 * observations, with the roof open (Rate Your Seats: "the roof does not
 * close on hot summer days"). Games are real 2025 Mariners home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 48° ±1.5°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photos (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/t-mobile-park/seating/shaded-covered-seats
 *         and its section pages ("rows 35 and higher" on the main level,
 *         club "Rows 10 and above" and 219–223 "Fully covered" set which
 *         rows are covered, so they are not checked here).
 *
 * Not reproduced:
 *   - [RYS] "By 4:00 p.m., most seats on the 100 level will be shaded": the
 *     third-base side and behind home are (90% and 88% at 4:10 PM in
 *     July), the first-base side is not (28%). The sun is then in the
 *     west-southwest, beyond the home-plate end of the first-base stands;
 *     a cross-section through each section does not see the structure
 *     there, off to the side.
 *   - [RYS] outfield seats "may be shaded at first pitch": at a 1:10 PM
 *     start only the right-center bleachers are (191–195, 18–65%, under
 *     the parked roof's edge, measured on the lidar); 180–190 are in the
 *     sun.
 *   - [RYS] 306–310 "the last place you want to be" by 3:00 p.m.: the model
 *     still has them 64% shaded then, the parked roof's edge over row 1
 *     of 306–308 (lidar); the low sun reaches most of them
 *     from ~4 PM (36% shaded at 4:10, 17% at 5:10).
 */
import { marinersSections } from '../../data/sections/mlb/mariners';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, type GameShadeResult } from '../gameShade';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'mariners')!;
const structure = getStadiumStructure('mariners')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: marinersSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1.5,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_6_110PM = game('2025-07-06', '13:10'); // vs Pirates
const AUG_10_110PM = game('2025-08-10', '13:10'); // vs Rays
const JULY_5_710PM = game('2025-07-05', '19:10'); // vs Pirates

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
const onMap = (ids: string[]) => ids.filter((id) => marinersSections.some((s) => s.id === id));
const range = (from: number, to: number) => onMap(Array.from({ length: to - from + 1 }, (_, i) => String(from + i)));
/** First sample at which an area is mostly shaded (≥75%), or the sample count. */
const firstShaded = (result: GameShadeResult, ids: string[]) => {
  const i = result.sun.findIndex((_, k) => meanShade(result, ids, [k]) >= 0.75);
  return i < 0 ? result.sun.length : i;
};

const thirdBaseMain = range(134, 146);
const firstBaseMain = range(114, 126);
const viewThird = range(333, 344);
const rightField = [...range(102, 110), ...range(306, 312)];

describe.each([
  ['July 6', JULY_6_110PM],
  ['August 10', AUG_10_110PM],
])('T-Mobile Park (roof open): a 1:10 PM game on %s', (_, result) => {
  it('[RYS] at noon the best shade is in 306–310', () => {
    const first = meanShade(result, range(306, 310), [0]);
    expect(first).toBeGreaterThan(0.9);
    for (const ids of [thirdBaseMain, firstBaseMain, viewThird, range(320, 330)]) expect(first).toBeGreaterThan(meanShade(result, ids, [0]));
  });

  it('[RYS] 333–344 are among the first to get shade', () => {
    expect(firstShaded(result, viewThird)).toBeLessThan(firstShaded(result, thirdBaseMain));
    expect(firstShaded(result, viewThird)).toBeLessThan(firstShaded(result, firstBaseMain));
  });

  it('[RYS] the third-base side has the sun behind it later in the day: shadier than the first-base side by the late innings', () => {
    const last = result.sun.length - 1;
    expect(meanShade(result, thirdBaseMain, [last])).toBeGreaterThan(meanShade(result, firstBaseMain, [last]) + 0.3);
  });

  it('[RYS] 233–241 get some of the best shade in the stadium', () => {
    expect(meanShade(result, range(233, 241))).toBeGreaterThan(meanShade(result, [...thirdBaseMain, ...firstBaseMain]) + 0.3);
  });

  it('[RYS] 180–195 have little to no shade, especially in center field', () => {
    expect(meanShade(result, range(180, 195))).toBeLessThan(0.1);
    expect(meanShade(result, range(183, 190))).toBe(0);
  });
});

describe('T-Mobile Park (roof open): a 7:10 PM game in July', () => {
  it('[RYS] the third-base side has the sun behind it for evening games', () => {
    expect(meanShade(JULY_5_710PM, [...thirdBaseMain, ...range(233, 241), ...viewThird], [0])).toBe(1);
  });

  it('[RYS] right field (especially the upper deck) is in the sun the longest; the sun shines directly into 306–310', () => {
    expect(meanShade(JULY_5_710PM, range(306, 310), [0])).toBe(0);
    expect(firstShaded(JULY_5_710PM, rightField)).toBeGreaterThanOrEqual(firstShaded(JULY_5_710PM, firstBaseMain));
    expect(firstShaded(JULY_5_710PM, range(306, 312))).toBeGreaterThanOrEqual(firstShaded(JULY_5_710PM, range(102, 110)));
  });
});

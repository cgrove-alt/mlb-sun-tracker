/**
 * American Family Field reference checks: the shade engine against
 * published observations, with the roof open. Games are real 2025 Brewers
 * home games (Rate Your Seats: the roof closes "when the weather is wet or
 * cold, but not when it is hot").
 *
 * Also counted as reference checks for this park:
 *   - orientation 130° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/american-family-field/seating/shaded-covered-seats
 *         ("rows 17 and higher in Sections 212-215" and the bleachers'
 *         uncovered first five rows set which rows are covered, so they are
 *         not checked here).
 *
 * Not reproduced (the panels' height is an estimate):
 *   - [RYS] "The roof keeps upper deck sections on the third base side under
 *     cover and shaded": the folded panel is over 422–438, but ~110 ft
 *     above their back rows (estimated), and the midday sun in front of them
 *     reaches under it; at a 1:10 PM start 422–423 are shaded by mid-game,
 *     424–425 by the late innings, and 426–438 stay ~30–60% shaded.
 *   - [RYS] 420 "fully shaded": its front rows are in front of the
 *     panel's edge; ~30% shaded at first pitch, fully by the 4th sample.
 */
import { brewersSections } from '../../data/sections/mlb/brewers';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, type GameShadeResult } from '../gameShade';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'brewers')!;
const structure = getStadiumStructure('brewers')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: brewersSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JUNE_15_110PM = game('2025-06-15', '13:10'); // vs Cardinals
const JULY_13_110PM = game('2025-07-13', '13:10'); // vs Nationals
const JULY_27_110PM = game('2025-07-27', '13:10'); // vs Marlins

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
const onMap = (ids: string[]) => ids.filter((id) => brewersSections.some((s) => s.id === id));
const range = (from: number, to: number) => onMap(Array.from({ length: to - from + 1 }, (_, i) => String(from + i)));
/** First sample at which an area is mostly shaded (≥75%), or the sample count. */
const firstShaded = (result: GameShadeResult, ids: string[]) => {
  const i = result.sun.findIndex((_, k) => meanShade(result, ids, [k]) >= 0.75);
  return i < 0 ? result.sun.length : i;
};

const firstBaseSide = [...range(106, 116), ...range(205, 215), ...range(407, 419)];
const thirdBaseField = range(119, 131);

describe.each([
  ['June 15', JUNE_15_110PM],
  ['July 13', JULY_13_110PM],
  ['July 27', JULY_27_110PM],
])('American Family Field (roof open): a 1:10 PM game on %s', (_, result) => {
  it('[RYS] the first-base side is the shaded side: mostly shaded for a 1 PM summer game', () => {
    expect(meanShade(result, firstBaseSide)).toBeGreaterThan(0.85);
  });

  it('[RYS] the first-base side receives shade long before the third-base side', () => {
    expect(firstShaded(result, range(106, 116))).toBeLessThan(firstShaded(result, thirdBaseField));
  });

  it('[RYS] upper deck sections on the first-base side are fully shaded; 412-420 are very good options', () => {
    expect(meanShade(result, range(407, 419))).toBe(1);
  });

  it('[RYS] 228-236 and 438-442 remain in the sun the longest', () => {
    const sunniest = meanShade(result, [...range(228, 236), ...range(439, 442)]);
    expect(sunniest).toBeLessThan(0.2);
    expect(sunniest).toBeLessThan(meanShade(result, range(422, 437)));
  });

  it('[RYS] the lower level on the third-base side is among the worst for staying out of the sun', () => {
    expect(meanShade(result, thirdBaseField)).toBeLessThan(0.1);
  });
});

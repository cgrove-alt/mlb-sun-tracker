/**
 * Chase Field reference checks: the shade engine against published
 * observations, with the roof open. Games are real 2025 Diamondbacks home
 * games in April and September, when the roof is open for some games
 * (shadedseats.com: "typically open only during the spring and fall").
 *
 * Also counted as reference checks for this park:
 *   - orientation 0° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [SS]  https://www.shadedseats.com/chase-field-shaded-seats/
 *   [RYS] https://www.rateyourseats.com/chase-field/seating/shaded-covered-seats
 *
 * Not reproduced (the deck and roof heights are estimates):
 *   - [SS] the first-base 300s "exposed to the sun, except for the back
 *     rows": the parked panel stack reaches over all of 300–307, so at a
 *     1:10 PM start they are shaded; they open up as the sun moves round in
 *     front of them (300–313 from ~90% shaded at first pitch to ~40%).
 *   - [SS] 101–110 "particularly exposed" and [RYS] 106–109 "well-covered"
 *     disagree; the model has 106–109 under the parked panels, so shaded at
 *     a 1:10 PM start and in the sun by the late innings, and 101–105 in
 *     the sun all game.
 */
import { diamondbacksSections } from '../../data/sections/mlb/diamondbacks';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'diamondbacks')!;
const structure = getStadiumStructure('diamondbacks')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: diamondbacksSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const APRIL_13_110PM = game('2025-04-13', '13:10'); // vs Brewers
const APRIL_12_510PM = game('2025-04-12', '17:10'); // vs Brewers
const SEPT_20_510PM = game('2025-09-20', '17:10'); // vs Phillies

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
const onMap = (ids: string[]) => ids.filter((id) => diamondbacksSections.some((s) => s.id === id));
const range = (from: number, to: number) => onMap(Array.from({ length: to - from + 1 }, (_, i) => String(from + i)));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = diamondbacksSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
/** First sample at which an area is mostly shaded (≥75%), or the sample count. */
const firstShaded = (result: GameShadeResult, ids: string[]) => {
  const i = result.sun.findIndex((_, k) => meanShade(result, ids, [k]) >= 0.75);
  return i < 0 ? result.sun.length : i;
};

const thirdBase = {
  upper: range(319, 332),
  club: range(211, 223),
  lower: range(127, 140),
  boxes: ['L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'],
};
const firstBaseBoxes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

describe('Chase Field (roof open): a 1:10 PM game in April', () => {
  it('[SS] the seats directly behind home are under cover from first pitch', () => {
    expect(meanShade(APRIL_13_110PM, range(118, 126), [0])).toBeGreaterThan(0.9);
  });

  it('[SS] 314–318 and 328–332 are the safest options: shaded all game', () => {
    expect(meanShade(APRIL_13_110PM, [...range(314, 318), ...range(328, 332)])).toBeGreaterThan(0.95);
  });

  it.each(range(319, 327))('[SS] the back rows of %s get roof protection', (id) => {
    const s = diamondbacksSections.find((x) => x.id === id)!;
    expect(rowsShaded(APRIL_13_110PM, id, s.rows.length - 7)[0]).toBe(1);
  });

  it('[SS] on the third-base side the upper level shades first, then the mezzanine, then field level', () => {
    const order = [thirdBase.upper, thirdBase.club, thirdBase.lower, thirdBase.boxes].map((ids) => firstShaded(APRIL_13_110PM, ids));
    for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThanOrEqual(order[i - 1]);
    expect(order[3]).toBeGreaterThan(order[0]);
  });

  it('[SS] the third-base line is the shade side', () => {
    for (let i = 0; i < APRIL_13_110PM.sun.length; i++) {
      expect(meanShade(APRIL_13_110PM, range(127, 140), [i])).toBeGreaterThan(meanShade(APRIL_13_110PM, range(106, 117), [i]));
    }
  });

  it('[RYS] down the first-base line and behind the dugout stay in the sun', () => {
    expect(meanShade(APRIL_13_110PM, firstBaseBoxes)).toBeLessThan(0.05);
    expect(meanShade(APRIL_13_110PM, range(113, 117))).toBeLessThan(0.05);
  });

  it('[SS] [RYS] the right-field seats are the worst for shade', () => {
    expect(meanShade(APRIL_13_110PM, range(101, 105))).toBeLessThan(0.05);
  });

  it('[RYS] the corner sections 135–138 and 220–223 are well covered', () => {
    expect(meanShade(APRIL_13_110PM, [...range(135, 138), ...range(220, 223)])).toBeGreaterThan(0.95);
  });
});

describe.each([
  ['April 12', APRIL_12_510PM],
  ['September 20', SEPT_20_510PM],
])('Chase Field (roof open): a 5:10 PM game on %s', (_, result) => {
  it('[SS] any section on the third-base side, from home plate to the left-field pole, is shaded', () => {
    expect(meanShade(result, [...range(118, 140), ...thirdBase.boxes, 'I', 'J', 'K'], [0])).toBeGreaterThan(0.9);
    expect(meanShade(result, [...thirdBase.upper, ...thirdBase.club], [0])).toBe(1);
  });

  it('[SS] the seats behind the left-field wall are shaded by this hour', () => {
    expect(meanShade(result, range(141, 144), [0])).toBe(1);
  });

  it('[SS] the sunniest seats are on the first-base side of the park', () => {
    // Every level: in September the sun is ~15° up at first pitch and the
    // far side's parked panels already shade the whole lower bowl.
    const firstSide = [...range(101, 117), ...firstBaseBoxes, ...range(200, 209), ...range(300, 313)];
    const thirdSide = [...range(127, 144), ...thirdBase.boxes, ...range(211, 223), ...range(319, 332)];
    expect(meanShade(result, firstSide, [0])).toBeLessThan(meanShade(result, thirdSide, [0]));
  });
});

describe('Chase Field (roof open): the first-base side at a 5:10 PM game in April', () => {
  it('[SS] sections closer to home plate get shade relatively early; the right-field corner stays sunny the longest', () => {
    expect(meanShade(APRIL_12_510PM, range(118, 121), [0])).toBeGreaterThan(meanShade(APRIL_12_510PM, range(101, 110), [0]) + 0.3);
    expect(meanShade(APRIL_12_510PM, range(101, 110), [0])).toBeLessThan(0.1);
  });
});

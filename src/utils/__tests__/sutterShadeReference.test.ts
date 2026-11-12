/**
 * Sutter Health Park reference checks: the shade engine against published
 * observations. Games are real 2025 Athletics home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 47° ±1.5°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [SS] https://www.shadedseats.com/sutter-health-park-shaded-seats/ (Rate
 *        Your Seats has no section pages for this park)
 *
 * Not reproduced (the structure heights are estimates):
 *   - [SS] 109–113 "the first to receive consistent shade" between 2 and
 *     3 PM, in their back quarter: at a 1:05 PM July start the model shades
 *     only 110's last two or three rows by then; the back rows of 114–116
 *     and the third-base side follow from about 3 PM.
 *   - [SS] 109–111 shaded in the evening: their seats face south and the
 *     low evening sun comes in from the side, past the press box behind
 *     113–115, which a single cross-section per section does not see. They
 *     shade at sunset with the first-base side.
 */
import { athleticsSections } from '../../data/sections/mlb/athletics';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'athletics')!;
const structure = getStadiumStructure('athletics')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: athleticsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1.5,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_105PM = game('2025-07-13', '13:05'); // vs Blue Jays
const JULY_10_605PM = game('2025-07-10', '18:05'); // vs Braves
const JULY_11_705PM = game('2025-07-11', '19:05'); // vs Blue Jays

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
  const s = athleticsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
/** First sample at which a section is mostly shaded (≥75% of rows), or the sample count. */
const firstShaded = (result: GameShadeResult, id: string) => {
  const i = section(result, id).samples.findIndex((s) => s.shadedFraction >= 0.75);
  return i < 0 ? result.sun.length : i;
};

const thirdBase = range(117, 122);
const firstBase = range(101, 107);
const club = range(201, 206);

describe('Sutter Health Park: a 1:05 PM game in July', () => {
  it('[SS] field level battles the sun for the first few innings', () => {
    const others = [...range(101, 102), ...range(106, 123)];
    expect(meanShade(JULY_13_105PM, others, [0, 1, 2])).toBeLessThan(0.05);
  });

  it.each(['103', '104', '105'])('[SS] only the very back of %s is under the club level\'s overhang', (id) => {
    // Its last rows are shaded in the early innings, the rest are not.
    expect(rowsShaded(JULY_13_105PM, id, 28).slice(0, 3).every((share) => share === 1)).toBe(true);
    expect(rowsShaded(JULY_13_105PM, id, 1, 24).slice(0, 3).every((share) => share === 0)).toBe(true);
  });

  it('[SS] behind home gets shade before the sides: the first back rows to shade are there', () => {
    const firstBackRowShade = (id: string) => {
      const s = athleticsSections.find((x) => x.id === id)!;
      const i = rowsShaded(JULY_13_105PM, id, s.rows.length).findIndex((share) => share === 1);
      return i < 0 ? JULY_13_105PM.sun.length : i;
    };
    const behindHome = Math.min(...range(108, 116).map(firstBackRowShade));
    expect(behindHome).toBeLessThan(Math.min(...[...thirdBase, ...firstBase.filter((id) => !['103', '104', '105'].includes(id))].map(firstBackRowShade)));
  });
});

describe('Sutter Health Park: a 6:05 PM game in July', () => {
  it('[SS] late afternoon: the third-base side is entirely shaded; the first-base side is in the sun', () => {
    expect(meanShade(JULY_10_605PM, thirdBase, [0])).toBe(1);
    expect(meanShade(JULY_10_605PM, [...firstBase, ...club], [0])).toBeLessThan(0.05);
  });

  it('[SS] 123 extends past the structure that shades the rest of the third-base side', () => {
    expect(section(JULY_10_605PM, '123').samples[0].shadedFraction).toBeLessThan(0.25);
    expect(firstShaded(JULY_10_605PM, '123')).toBeGreaterThan(Math.max(...thirdBase.map((id) => firstShaded(JULY_10_605PM, id))));
  });

  it('[SS] 101–107 and the club (201–206) stay sunny the longest', () => {
    const lastShaded = Math.max(...[...firstBase, ...club].map((id) => firstShaded(JULY_10_605PM, id)));
    const others = athleticsSections.map((s) => s.id).filter((id) => /^\d{3}$/.test(id) && ![...firstBase, ...club].includes(id));
    for (const id of others) expect(firstShaded(JULY_10_605PM, id)).toBeLessThanOrEqual(lastShaded);
    for (const id of club) expect(firstShaded(JULY_10_605PM, id)).toBe(lastShaded);
  });
});

describe('Sutter Health Park: a 7:05 PM game in July', () => {
  it.each(range(112, 122))('[SS] evening: %s, behind home or down the third-base line, is shaded', (id) => {
    expect(section(JULY_11_705PM, id).samples[0].shadedFraction).toBe(1);
  });

  it('[SS] the first-base side and the club are in the path of the setting sun', () => {
    expect(meanShade(JULY_11_705PM, [...firstBase, ...club], [0, 1])).toBeLessThan(0.05);
  });
});

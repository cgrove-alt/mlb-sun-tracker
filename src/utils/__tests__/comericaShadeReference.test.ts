/**
 * Comerica Park reference checks: the shade engine against published
 * observations. Games are real 2025 Tigers home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 151° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/comerica-park/seating/shaded-covered-seats
 *         and its section pages (101–151, 210–219, 321–346, the Tiger Den
 *         and the terraces)
 *
 * Its advice for "afternoon games" (rows 27 and up on the first-base side,
 * the mezzanine from about row 12) is about later starts, so it is checked
 * on the only 2025 day game that started after 5 PM; at a 1:40 PM start the
 * model agrees that "finding the shade during a midday game … is no easy
 * task".
 *
 * The heights are measured on USGS lidar (April 2017; stadiumStructures.ts).
 * On them the left-field pavilion now sees "the most sun of any location"
 * (6% shaded over a 5:10 PM game, against 8% on the third-base side; tested
 * below).
 *
 * Not reproduced:
 *   - [RYS] all covered Tiger Den seats shaded "after about 1pm": behind
 *     home (TD126–TD127) row C is in the sun for the first half hour of a
 *     1:40 PM game (the sun almost overhead slips under the deck's edge),
 *     shaded from 2:40 PM on. (The Tiger Den is hidden from the air: its
 *     heights are estimated from the measured tiers around it.)
 *   - [RYS] at midday it is hard to find shade on the lower level, and the
 *     upper deck has some relief. The scan puts the upper deck's front over
 *     the lower bowl's last 3–4 rows, which the model shades: 14% of the
 *     lower level over a 1:40 PM game, against 19% of the upper deck.
 *
 * Partly reproduced, since the heights are measured (recorded, not tuned):
 *   - [RYS] the mezzanine's covered rows (17 and up) are shaded all game.
 *     Its roof is measured 103 ft up (its top), about 25 ft over row 17, so
 *     a near-overhead sun reaches that first covered row for the first half
 *     hour of a 1:40 PM game. Tested from the second half-hour on.
 *   - [RYS] decent shade in the upper deck's last rows "of most sections".
 *     The roof is measured 118 ft up (its top; the estimate was 100), so the
 *     high sun in front reaches under it to the third-to-last row in the
 *     third-base sections (333–344) from mid-game, and in 343, where the
 *     scan puts the roof's edge over row 16, two rows from the back, to all
 *     of its covered rows. Tested: the last two rows shaded all game in all
 *     but one section.
 *   - [RYS] at a late-afternoon start the third-base side is "your enemy".
 *     Still far sunnier than the first-base side (8% against 93% over a
 *     5:10 PM game; tested), but no longer under 5%: the upper deck's front
 *     over its last rows shades them late in the game.
 */
import { tigersSections } from '../../data/sections/mlb/tigers';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'tigers')!;
const structure = getStadiumStructure('tigers')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: tigersSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_140PM = game('2025-07-13', '13:40'); // vs Mariners
const JULY_9_510PM = game('2025-07-09', '17:10'); // vs Rays
const JUNE_28_110PM = game('2025-06-28', '13:10'); // vs Twins

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
  const s = tigersSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const firstBase = range(116, 124);
const thirdBase = range(131, 139);
const tigerDen = ['TD120', 'TD121', 'TD122', 'TD123', 'TD124', 'TD125A', 'TD125B', 'TD126', 'TD127A', 'TD127B'];

describe('Comerica Park: a 1:40 PM game in July', () => {
  it.each(tigerDen)('[RYS] Tiger Den %s: its covered rows (C–H) are shaded after about 1 PM', (id) => {
    // Row C itself only from 2:40 PM behind home (see the header).
    expect(rowsShaded(JULY_13_140PM, id, 4).every((share) => share === 1)).toBe(true);
    expect(rowsShaded(JULY_13_140PM, id, 3).slice(2).every((share) => share === 1)).toBe(true);
  });

  it.each([['112', 21], ['113', 33], ['114', 35], ['115', 11]] as const)(
    '[RYS] %s: rows 37 and up (its row %i) are under the mezzanine, shaded all game',
    (id, from) => {
      expect(rowsShaded(JULY_13_140PM, id, from).every((share) => share === 1)).toBe(true);
    },
  );

  it.each(range(211, 218))('[RYS] mezzanine %s: its covered rows (17 and up) are shaded from the second half-hour', (id) => {
    expect(rowsShaded(JULY_13_140PM, id, 23).slice(1).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] the upper deck: decent shade in the last rows of most sections', () => {
    const ids = range(321, 345).filter((n) => n !== '335');
    const shaded = ids.filter((id) => {
      const s = tigersSections.find((x) => x.id === id)!;
      return rowsShaded(JULY_13_140PM, id, s.rows.length - 1).every((share) => share === 1);
    });
    expect(shaded.length).toBeGreaterThanOrEqual(ids.length - 1);
  });

  it.each([
    ["Kaline's Corner (107–111)", range(107, 111)],
    ['the left-field pavilion (145–151)', range(145, 151)],
    ['field level down the third-base line (136–142)', range(136, 142)],
  ] as const)('[RYS] avoid %s at midday', (_label, ids) => {
    expect(meanShade(JUNE_28_110PM, [...ids], [0, 1, 2])).toBeLessThan(0.1);
  });

});

describe('Comerica Park: a 5:10 PM game in July', () => {
  it('[RYS] afternoon games: the first-base side has the shade; the third-base side is "your enemy"', () => {
    expect(meanShade(JULY_9_510PM, firstBase)).toBeGreaterThan(meanShade(JULY_9_510PM, thirdBase) + 0.3);
    expect(meanShade(JULY_9_510PM, thirdBase)).toBeLessThan(0.1);
  });

  it('[RYS] the left-field pavilion sees the most sun of any seats', () => {
    const pavilion = meanShade(JULY_9_510PM, range(145, 151));
    expect(pavilion).toBeLessThan(0.1);
    for (const ids of [firstBase, thirdBase, range(125, 130), range(101, 106), range(211, 218), range(321, 345).filter((n) => n !== '335')]) {
      expect(pavilion).toBeLessThan(meanShade(JULY_9_510PM, ids));
    }
  });

  it.each(range(211, 218))('[RYS] mezzanine %s: good shade from about row 12 (row 13 at first pitch) to the top', (id) => {
    expect(rowsShaded(JULY_9_510PM, id, 19).every((share) => share === 1)).toBe(true);
  });

  it.each([
    ...range(116, 119).map((id) => [id, 27] as const),
    ...range(120, 124).map((id) => [id, 21] as const),
  ])('[RYS] %s: rows 27 and up (its row %i) are shaded in a late afternoon game', (id, from) => {
    expect(rowsShaded(JULY_9_510PM, id, from).filter((share) => share === 1).length).toBeGreaterThanOrEqual(3);
  });

  it.each([['125', 21], ['126', 22], ['127', 23], ['128', 24]] as const)(
    '[RYS] %s: its back rows (from its row %i) are shaded in a late afternoon game',
    (id, from) => {
      expect(rowsShaded(JULY_9_510PM, id, from).filter((share) => share === 1).length).toBeGreaterThanOrEqual(3);
    },
  );

  it('[RYS] the shadows grow along the first-base side, toward the field', () => {
    expect(meanShade(JULY_9_510PM, firstBase, [last(JULY_9_510PM)])).toBeGreaterThan(meanShade(JULY_9_510PM, firstBase, [0]));
  });
});

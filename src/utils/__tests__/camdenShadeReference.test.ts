/**
 * Camden Yards reference checks: the shade engine against published
 * observations. Games are real 2025 Orioles home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 31° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/oriole-park/seating/shaded-covered-seats
 *         and its section pages (1–98, 204–288, 306–388)
 *
 * The heights are measured on USGS lidar (December 2024; stadiumStructures.ts).
 * On them, [RYS]'s third-base club sections 242–264, "entirely shaded by the
 * middle innings" with their last five rows "shaded for the entirety of a
 * 1 p.m. game", hold in July and September (tested below): the upper deck's
 * front is over the club level's row 5, where its section pages count the
 * cover from row 8. On the estimated heights the model shaded the last five
 * rows only from the middle innings in September, and the whole sections
 * only late in the game.
 */
import { oriolesSections } from '../../data/sections/mlb/orioles';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'orioles')!;
const structure = getStadiumStructure('orioles')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: oriolesSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_135PM = game('2025-07-13', '13:35'); // vs Marlins
const SEPT_21_135PM = game('2025-09-21', '13:35'); // vs Yankees
const APRIL_13_135PM = game('2025-04-13', '13:35'); // vs Blue Jays

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
const range = (from: number, to: number, step = 1) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => String(from + i * step));
/** Only the ids that are sections on the seat map. */
const onMap = (ids: string[]) => ids.filter((id) => oriolesSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = oriolesSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const terrace = onMap([...range(9, 31, 2), ...range(45, 87, 2), 'C31', 'C33', 'C35', 'C37', 'C39', 'C43']);
const firstBaseField = onMap(range(10, 32, 2));
const thirdBaseField = onMap(range(40, 68, 2));

describe('Camden Yards: a 1:35 PM game in July', () => {
  it.each(terrace)('[RYS] Terrace section %s is shaded for an afternoon game', (id) => {
    expect(section(JULY_13_135PM, id).samples.every((s) => s.shadedFraction >= 0.75)).toBe(true);
  });

  it('[RYS] the third-base side gets shade first', () => {
    expect(meanShade(JULY_13_135PM, thirdBaseField, [last(JULY_13_135PM)])).toBeGreaterThan(meanShade(JULY_13_135PM, firstBaseField, [last(JULY_13_135PM)]) + 0.1);
    const thirdUpper = onMap(range(335, 388));
    const firstUpper = onMap(range(306, 334));
    expect(meanShade(JULY_13_135PM, thirdUpper, [last(JULY_13_135PM)])).toBeGreaterThan(meanShade(JULY_13_135PM, firstUpper, [last(JULY_13_135PM)]) + 0.2);
  });

  it('[RYS] the right-field corner (1–8) is in the sun', () => {
    expect(meanShade(JULY_13_135PM, onMap(range(1, 8)))).toBeLessThan(0.05);
  });

  it('[RYS] no seat in 56 is under the overhang; 53, 55 and 59 behind it are', () => {
    expect(rowsShaded(JULY_13_135PM, '56', 1)[0]).toBe(0);
    for (const id of ['53', '55', '59']) expect(rowsShaded(JULY_13_135PM, id, 3)[0]).toBe(1);
  });

  // Covered rows (Rate Your Seats) as positions in each section's rows; the
  // row under the deck's edge can catch a high sun, so checks start one back.
  it.each(onMap(range(212, 264, 2)))('[RYS] club level %s is covered from row 8', (id) => {
    expect(rowsShaded(JULY_13_135PM, id, 9)[0]).toBe(1);
  });

  it.each([
    ...['308', '310', '316', '324', '330', '332', '342', '344', '352', '360', '368', '376', '380', '382', '384', '386', '388'].map((id) => [id, 15] as const),
    ...['306', '312', '318', '322', '334', '340', '346', '354', '362', '370', '378'].map((id) => [id, 12] as const),
  ])('[RYS] upper deck %s is under the roof from its row %i', (id, coveredFrom) => {
    expect(rowsShaded(JULY_13_135PM, id, coveredFrom + 1)[0]).toBe(1);
  });

  it.each(['92', '94'])('[RYS] right-field bleachers %s are covered from row 19', (id) => {
    expect(rowsShaded(JULY_13_135PM, id, 20)[0]).toBe(1);
  });
});

describe('Camden Yards: 1:35 PM games in April and September', () => {
  it('[RYS] the Terrace stays shaded and the third-base side still gets shade first', () => {
    for (const result of [APRIL_13_135PM, SEPT_21_135PM]) {
      expect(meanShade(result, terrace)).toBeGreaterThan(0.85);
      expect(meanShade(result, thirdBaseField, [last(result)])).toBeGreaterThan(meanShade(result, firstBaseField, [last(result)]) + 0.2);
    }
  });

  it.each(onMap(range(242, 264, 2)))('[RYS] third-base club %s: its last five rows shaded all game, all of it by the middle innings', (id) => {
    const rows = oriolesSections.find((x) => x.id === id)!.rows.length;
    for (const result of [JULY_13_135PM, SEPT_21_135PM]) {
      expect(rowsShaded(result, id, rows - 4).every((share) => share === 1)).toBe(true);
      // By two hours in (about the 6th inning).
      expect(section(result, id).samples.slice(4).every((s) => s.shadedFraction === 1)).toBe(true);
    }
  });
});

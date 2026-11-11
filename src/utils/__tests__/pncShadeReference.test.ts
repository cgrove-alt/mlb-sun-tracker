/**
 * PNC Park reference checks: the shade engine against published
 * observations. Games are real 2025 Pirates home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 116° ±1.5°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/pnc-park/seating/shaded-covered-seats
 *         and its section pages (1–32, 101–147, 201–238, 301–339)
 *
 * Not reproduced (the deck heights are estimates):
 *   - [RYS] the upper half of 301–312 is "always shaded" for afternoon
 *     games. Its section pages cover rows R and up (the back quarter); the
 *     model shades those and, at a 1:35 PM start, about half of each
 *     section, filling in through the game.
 */
import { piratesSections } from '../../data/sections/mlb/pirates';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'pirates')!;
const structure = getStadiumStructure('pirates')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: piratesSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1.5,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_20_135PM = game('2025-07-20', '13:35'); // vs White Sox
const JUNE_21_405PM = game('2025-06-21', '16:05'); // vs Rangers
const JUNE_8_135PM = game('2025-06-08', '13:35'); // vs Phillies

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
const onMap = (ids: string[]) => ids.filter((id) => piratesSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = piratesSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const firstBase100s = onMap(range(101, 114));
const thirdBase100s = onMap(range(119, 132));

describe('PNC Park: a 1:35 PM game in July', () => {
  it('[RYS] the first-base side is the shaded side', () => {
    const end = last(JULY_20_135PM);
    expect(meanShade(JULY_20_135PM, firstBase100s, [end])).toBeGreaterThan(meanShade(JULY_20_135PM, thirdBase100s, [end]) + 0.1);
    expect(meanShade(JULY_20_135PM, onMap(range(301, 312)), [end])).toBeGreaterThan(meanShade(JULY_20_135PM, onMap(range(320, 333)), [end]) + 0.2);
  });

  it('[RYS] the field level (1–32) and the Baseball Club (201–228) are rarely in the shade', () => {
    expect(meanShade(JULY_20_135PM, onMap(range(1, 32)))).toBeLessThan(0.05);
    expect(meanShade(JULY_20_135PM, onMap(range(201, 228)))).toBeLessThan(0.15);
  });

  it('[RYS] first-base club sections shade in the later innings; third-base ones stay in the sun', () => {
    const end = last(JULY_20_135PM);
    expect(meanShade(JULY_20_135PM, onMap(range(201, 214)), [end])).toBeGreaterThan(meanShade(JULY_20_135PM, onMap(range(201, 214)), [0]) + 0.3);
    expect(meanShade(JULY_20_135PM, onMap(range(216, 228)), [end])).toBeLessThan(0.2);
  });

  it.each(onMap(['109', '110', '112', '113']))('[RYS] section %s: rows CC–HH are well covered by the deck above', (id) => {
    const rows = piratesSections.find((x) => x.id === id)!.rows.length;
    expect(rowsShaded(JULY_20_135PM, id, rows - 5).every((share) => share === 1)).toBe(true);
  });

  it.each(onMap(range(301, 312)))('[RYS] Grandstand %s: its covered back rows are shaded, and more rows fill in as the game goes on', (id) => {
    const rows = piratesSections.find((x) => x.id === id)!.rows.length;
    expect(rowsShaded(JULY_20_135PM, id, rows - 3)[0]).toBe(1);
    expect(section(JULY_20_135PM, id).samples[last(JULY_20_135PM)].shadedFraction)
      .toBeGreaterThanOrEqual(section(JULY_20_135PM, id).samples[0].shadedFraction);
  });

  it.each([
    ['the left-field bleachers (235–238)', range(235, 238)],
    ['the rooftop (335–339)', range(335, 339)],
    ['the left-field corner (135–138)', range(135, 138)],
  ] as const)('[RYS] avoid %s: always a heavy dose of sun', (_label, ids) => {
    expect(meanShade(JULY_20_135PM, [...ids])).toBeLessThan(0.05);
  });
});

describe('PNC Park: a 4:05 PM game in June', () => {
  it('[RYS] the sun fades behind the first-base side first', () => {
    expect(meanShade(JUNE_21_405PM, onMap(range(1, 16)), [4])).toBeGreaterThan(0.8);
    expect(meanShade(JUNE_21_405PM, onMap(range(17, 32)), [4])).toBeLessThan(0.2);
  });

  it('[RYS] first-base upper deck (301–312) is mostly shaded through the game', () => {
    expect(meanShade(JUNE_21_405PM, onMap(range(301, 312)))).toBeGreaterThan(0.85);
  });
});

describe('PNC Park: a 1:35 PM game in June', () => {
  it('[RYS] the first-base side is still the shaded side', () => {
    expect(meanShade(JUNE_8_135PM, firstBase100s)).toBeGreaterThan(meanShade(JUNE_8_135PM, thirdBase100s) + 0.05);
  });
});

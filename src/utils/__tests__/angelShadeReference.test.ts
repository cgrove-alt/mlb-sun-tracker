/**
 * Angel Stadium reference checks: the shade engine against published
 * observations. Games are real 2025 Angels home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 44° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/angel-stadium/seating/shaded-covered-seats
 *         and its section pages (101–135, 201–260, 301–351, 401–436, 501–540)
 *
 * Not reproduced (the deck heights are estimates):
 *   - [RYS] the front of the Terrace's 229–233 is in the sun by the end of a
 *     1 PM game, and 230–233's front rows between 4 and 7 PM. The model
 *     reproduces it for 233, in the right-field corner (tested below); 229–232
 *     face south along the line, so a low western sun runs along their rows
 *     and the deck above keeps them shaded at 1 PM, with only the first
 *     sample of a 6:38 PM game reaching their front third.
 */
import { angelsSections } from '../../data/sections/mlb/angels';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'angels')!;
const structure = getStadiumStructure('angels')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: angelsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_107PM = game('2025-07-13', '13:07'); // vs Diamondbacks
const JULY_11_638PM = game('2025-07-11', '18:38'); // vs Dodgers
const AUG_3_107PM = game('2025-08-03', '13:07'); // vs White Sox

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
const onMap = (ids: string[]) => ids.filter((id) => angelsSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = angelsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

describe('Angel Stadium: a 1:07 PM game in July', () => {
  it.each(onMap([...range(201, 213), ...range(221, 228)]))('[RYS] Terrace section %s is fully covered: shaded all game', (id) => {
    expect(section(JULY_13_107PM, id).samples.every((s) => s.shadedFraction === 1)).toBe(true);
  });

  it('[RYS] the front of 233 is shaded at first pitch but in the sun by the end of the game', () => {
    expect(rowsShaded(JULY_13_107PM, '233', 1, 3)[0]).toBe(1);
    expect(rowsShaded(JULY_13_107PM, '233', 1, 3)[last(JULY_13_107PM)]).toBeLessThan(1);
  });

  it.each(range(104, 113))('[RYS] third-base section %s: in the sun at first pitch, in the shade by the end of the game', (id) => {
    const samples = section(JULY_13_107PM, id).samples;
    expect(samples[0].shadedFraction).toBeLessThan(0.1);
    expect(samples[last(JULY_13_107PM)].shadedFraction).toBeGreaterThanOrEqual(0.85);
  });

  it('[RYS] seek out the third-base side', () => {
    const end = last(JULY_13_107PM);
    expect(meanShade(JULY_13_107PM, range(104, 113), [end])).toBeGreaterThan(meanShade(JULY_13_107PM, range(123, 132), [end]) + 0.5);
    expect(meanShade(JULY_13_107PM, range(402, 418), [end])).toBeGreaterThan(meanShade(JULY_13_107PM, range(419, 436), [end]) + 0.5);
  });

  it('[RYS] the right-field seats (236–249) are among the most exposed in baseball', () => {
    expect(meanShade(JULY_13_107PM, onMap(range(236, 249)))).toBeLessThan(0.05);
  });

  it.each(range(501, 540))('[RYS] View level %s is under the roof from row D', (id) => {
    expect(rowsShaded(JULY_13_107PM, id, 5)[0]).toBe(1);
  });
});

describe('Angel Stadium: a 6:38 PM game in July', () => {
  it('[RYS] even for night games the right-field corner (132–135, 431–436) is in direct sunlight at first pitch', () => {
    expect(meanShade(JULY_11_638PM, range(132, 135), [0])).toBeLessThan(0.1);
    expect(meanShade(JULY_11_638PM, range(431, 436), [0])).toBeLessThan(0.1);
  });

  it('[RYS] the right-field seats (236–249) are the last to be shaded', () => {
    expect(meanShade(JULY_11_638PM, onMap(range(236, 249)), [0, 1])).toBeLessThan(0.15);
    expect(meanShade(JULY_11_638PM, range(104, 113), [0])).toBe(1);
  });

  it.each([['419', 3], ['420', 5], ['421', 7]] as const)('[RYS] section %s: its row %i and up are shaded during late-afternoon games', (id, fromRow) => {
    expect(rowsShaded(JULY_11_638PM, id, fromRow).filter((share) => share === 1).length).toBeGreaterThanOrEqual(5);
  });
});

describe('Angel Stadium: a 1:07 PM game in August', () => {
  it('[RYS] with the deck above, section 209 is almost entirely in the shade', () => {
    expect(meanShade(AUG_3_107PM, ['209'])).toBeGreaterThan(0.95);
  });

  it.each(range(402, 418))('[RYS] 400 level %s: shaded by the end of the game', (id) => {
    expect(section(AUG_3_107PM, id).samples[last(AUG_3_107PM)].shadedFraction).toBeGreaterThanOrEqual(0.75);
  });
});

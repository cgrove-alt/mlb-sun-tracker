/**
 * Great American Ball Park reference checks: the shade engine against
 * published observations. Games are real 2025 Reds home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 122° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/great-american-ball-park/seating/shaded-covered-seats
 *         and its section pages (1–146, 220–228, 301–307, 401–437, 509–537)
 *
 * Note: its shade page places 108–112 in right field; its section pages and
 * the club's map put them on the third-base side toward left field, which is
 * what the model uses.
 *
 * The heights are measured on USGS lidar (January 2022; stadiumStructures.ts).
 *
 * Not reproduced:
 *   - [RYS] the third-base 400s (411–419) are among the most exposed seats.
 *     The scan puts the View level's front over their row 14 (the source
 *     covers from Q, 17), and the model shades the five rows under it at a
 *     1:40 PM game: 25% of their seats (11% with the source's row).
 */
import { redsSections } from '../../data/sections/mlb/reds';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'reds')!;
const structure = getStadiumStructure('reds')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: redsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_140PM = game('2025-07-13', '13:40'); // vs Rockies
const JULY_12_410PM = game('2025-07-12', '16:10'); // vs Rockies
const JUNE_8_140PM = game('2025-06-08', '13:40'); // vs Diamondbacks

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
const onMap = (ids: string[]) => ids.filter((id) => redsSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = redsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const firstBase100s = range(127, 137);
const thirdBase100s = range(107, 121);

describe('Great American Ball Park: a 1:40 PM game in July', () => {
  it('[RYS] the first-base side offers the best protection; the third-base side and outfield struggle', () => {
    expect(meanShade(JULY_13_140PM, firstBase100s)).toBeGreaterThan(meanShade(JULY_13_140PM, thirdBase100s) + 0.1);
    const end = last(JULY_13_140PM);
    expect(meanShade(JULY_13_140PM, firstBase100s, [end])).toBeGreaterThan(meanShade(JULY_13_140PM, firstBase100s, [0]));
  });

  it('[RYS] the Club on the first-base side (301–305) has more shade than any other area', () => {
    const club = meanShade(JULY_13_140PM, range(301, 305));
    for (const ids of [firstBase100s, thirdBase100s, range(411, 419), onMap(range(420, 437)), range(509, 519), range(520, 537)]) {
      expect(club).toBeGreaterThan(meanShade(JULY_13_140PM, ids));
    }
  });

  it.each(range(301, 305))('[RYS] Club %s is covered from row G: shaded behind the deck edge at first pitch', (id) => {
    expect(rowsShaded(JULY_13_140PM, id, 8)[0]).toBe(1);
  });

  it.each([
    ...range(127, 131).map((id) => [id, 26] as const),
    ...range(132, 135).map((id) => [id, 31] as const),
  ])('[RYS] first-base section %s is covered from its row %i (EE): shaded there all game', (id, coveredFrom) => {
    expect(rowsShaded(JULY_13_140PM, id, coveredFrom + 1).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] the seats beyond the right-field wall are among the most exposed', () => {
    expect(meanShade(JULY_13_140PM, onMap(range(138, 146)))).toBeLessThan(0.05);
  });

  it.each([...range(509, 519).map((id) => [id, 12] as const), ...range(520, 537).map((id) => [id, 15] as const)])(
    '[RYS] View level %s is under the roof from its row %i',
    (id, coveredFrom) => {
      expect(rowsShaded(JULY_13_140PM, id, coveredFrom + 1)[0]).toBe(1);
    },
  );
});

describe('Great American Ball Park: a 4:10 PM game in July', () => {
  it('[RYS] the first-base side gets the sun at its back first', () => {
    expect(meanShade(JULY_12_410PM, firstBase100s, [2])).toBeGreaterThan(0.9);
    expect(meanShade(JULY_12_410PM, thirdBase100s, [2])).toBeLessThan(0.3);
  });

  it.each(['428', ...range(429, 437)])('[RYS] 400 level %s: its back rows are shaded during most late-afternoon games', (id) => {
    const from = id === '428' ? 6 : 4;
    expect(rowsShaded(JULY_12_410PM, id, from).filter((share) => share === 1).length).toBeGreaterThanOrEqual(4);
  });

  it('[RYS] Club 306–307 are shaded during late-afternoon games', () => {
    expect(meanShade(JULY_12_410PM, ['306', '307'])).toBeGreaterThan(0.9);
  });
});

describe('Great American Ball Park: a 1:40 PM game in June', () => {
  it('[RYS] the first-base side is still the shade side', () => {
    expect(meanShade(JUNE_8_140PM, firstBase100s)).toBeGreaterThan(meanShade(JUNE_8_140PM, thirdBase100s) + 0.1);
  });
});

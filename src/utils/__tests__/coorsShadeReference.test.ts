/**
 * Coors Field reference checks: the shade engine against published
 * observations. Games are real 2025 Rockies home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 5° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/coors-field/seating/shaded-covered-seats
 *         and its section pages (105–160, 201–247, 301–347, 401–403)
 *
 * The heights are measured on USGS lidar (May 2020; stadiumStructures.ts).
 * On them one claim the estimated heights missed now holds (tested below):
 * the third-base club (234–247) is entirely out of the sun by 3 PM (the
 * upper level's front reaches out over its row 5, where its section pages
 * count from 8).
 *
 * Not reproduced:
 *   - [RYS] the front of the right-field seats (105–109) is shaded at first
 *     pitch for a 1 PM game, then in the sun by the 3rd or 4th inning. The
 *     model shades only their covered rows (11 and up; 8 in 105).
 *   - [RYS] behind home, 133's rows 28 and up (position 25) are shaded
 *     during most day games. The scan puts the club level's end over its
 *     position 28; the model shades the two rows in front of it only after
 *     about 3 PM. With the sun behind the stand, the engine stops it at a
 *     deck's underside (27 ft here), not at the top of its front (~39 ft),
 *     which would shade them all game.
 */
import { rockiesSections } from '../../data/sections/mlb/rockies';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'rockies')!;
const structure = getStadiumStructure('rockies')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: rockiesSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_20_110PM = game('2025-07-20', '13:10'); // vs Twins
const JUNE_10_640PM = game('2025-06-10', '18:40'); // vs Giants
const SEPT_7_110PM = game('2025-09-07', '13:10'); // vs Padres

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
const range = (from: number, to: number, prefix = '') => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);
const onMap = (ids: string[]) => ids.filter((id) => rockiesSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` to `toRow` (1-based, inclusive), per sample. */
const rowsShaded = (result: GameShadeResult, id: string, fromRow: number, toRow?: number) => {
  const s = rockiesSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1, toRow);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

const firstBase100s = onMap(range(115, 127));
const thirdBase100s = onMap(range(134, 147));

describe('Coors Field: a 1:10 PM game in July', () => {
  it('[RYS] the third-base side gets shade first; the first-base side stares at the sun', () => {
    const end = last(JULY_20_110PM);
    expect(meanShade(JULY_20_110PM, thirdBase100s, [end])).toBeGreaterThan(meanShade(JULY_20_110PM, firstBase100s, [end]) + 0.1);
    expect(meanShade(JULY_20_110PM, thirdBase100s, [end])).toBeGreaterThan(meanShade(JULY_20_110PM, thirdBase100s, [0]));
    expect(meanShade(JULY_20_110PM, firstBase100s, [end])).toBeLessThan(meanShade(JULY_20_110PM, firstBase100s, [0]));
  });

  it('[RYS] the first-base club (214–227) is shaded early, then only its back rows by the 6th inning', () => {
    const club = onMap(range(214, 227));
    expect(meanShade(JULY_20_110PM, club, [4])).toBeLessThan(meanShade(JULY_20_110PM, club, [0]));
    for (const id of club) expect(rowsShaded(JULY_20_110PM, id, 9)[4]).toBe(1);
  });

  it('[RYS] the third-base club (234–247) gains shade through the afternoon', () => {
    const club = onMap(range(234, 247));
    expect(meanShade(JULY_20_110PM, club, [last(JULY_20_110PM)])).toBeGreaterThan(meanShade(JULY_20_110PM, club, [0]));
  });

  it('[RYS] the third-base club (234–247) is entirely out of the sun by 3 PM', () => {
    const from3pm = JULY_20_110PM.sun.flatMap((sun, i) => (sun.minutesFromStart >= 110 ? [i] : []));
    for (const id of onMap(range(234, 247))) {
      expect(from3pm.every((i) => section(JULY_20_110PM, id).samples[i].shadedFraction === 1)).toBe(true);
    }
  });

  it.each(onMap([...range(331, 347, 'U'), 'L343', 'L345']))('[RYS] upper deck %s: rows 19 and up are guaranteed shade', (id) => {
    const from = id.startsWith('U') ? 10 : 19;
    expect(rowsShaded(JULY_20_110PM, id, from).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] the upper deck on the third-base side gains shade as the game goes on', () => {
    const lower = onMap(range(331, 346, 'L'));
    expect(meanShade(JULY_20_110PM, lower, [last(JULY_20_110PM)])).toBeGreaterThan(meanShade(JULY_20_110PM, lower, [0]) + 0.3);
  });

  it.each([
    ['the left-field stands (151–160), the sunniest in June and July', range(151, 160)],
    ['the right-field corner (110–115)', onMap(range(110, 115))],
  ] as const)('[RYS] avoid %s', (_label, ids) => {
    expect(meanShade(JULY_20_110PM, [...ids])).toBeLessThan(0.05);
  });

  it.each([['128', 33], ['129', 33], ['130', 32], ['131', 31], ['132', 30]] as const)(
    '[RYS] behind home, section %s: its rows from position %i are shaded during most day games',
    (id, fromRow) => {
      expect(rowsShaded(JULY_20_110PM, id, fromRow + 1).filter((share) => share === 1).length).toBeGreaterThanOrEqual(5);
    },
  );
});

describe('Coors Field: a 6:40 PM game in June', () => {
  it.each([
    ['105–120', onMap(range(105, 120))],
    ['301–319', onMap([...range(301, 319), ...range(311, 319, 'L'), ...range(312, 319, 'U')])],
  ] as const)('[RYS] sections %s stare into the sun at first pitch of a night game', (_label, ids) => {
    expect(meanShade(JUNE_10_640PM, [...ids], [0])).toBeLessThan(0.2);
  });

  it('[RYS] the third-base side is in the shade', () => {
    expect(meanShade(JUNE_10_640PM, thirdBase100s, [0])).toBeGreaterThan(0.9);
  });
});

describe('Coors Field: a 1:10 PM game in September', () => {
  it('[RYS] the third-base side is still the shade side', () => {
    const end = last(SEPT_7_110PM);
    expect(meanShade(SEPT_7_110PM, thirdBase100s, [end])).toBeGreaterThan(meanShade(SEPT_7_110PM, firstBase100s, [end]) + 0.1);
  });
});

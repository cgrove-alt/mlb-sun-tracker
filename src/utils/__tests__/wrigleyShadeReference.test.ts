/**
 * Wrigley Field reference checks: the shade engine against published
 * observations. Games are real 2025 Cubs home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 38° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/wrigley-field/seating/shaded-covered-seats
 *         and its section pages (110, 118, 126, 206–230, 305–331, 405–431, 501–537)
 */
import { cubsSections } from '../../data/sections/mlb/cubs';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'cubs')!;
const structure = getStadiumStructure('cubs')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: cubsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_18_120PM = game('2025-07-18', '13:20'); // vs Red Sox
const SEPT_1_305PM = game('2025-09-01', '15:05'); // vs Braves
const JULY_6_510PM = game('2025-07-06', '17:10'); // vs Cardinals

const section = (result: GameShadeResult, id: string) => {
  const found = result.sections.find((s) => s.sectionId === id);
  if (!found) throw new Error(`No result for section ${id}`);
  return found;
};
const meanShade = (result: GameShadeResult, ids: string[], samples?: number[]) => {
  const picks = samples ?? result.sun.map((_, i) => i);
  return ids.flatMap((id) => picks.map((i) => section(result, id).samples[i].shadedFraction))
    .reduce((a, b) => a + b, 0) / (ids.length * picks.length);
};
const range = (from: number, to: number, suffix = '') =>
  Array.from({ length: to - from + 1 }, (_, i) => `${from + i}${suffix}`);
const inMap = (ids: string[]) => ids.filter((id) => cubsSections.some((s) => s.id === id));
/** Shaded share of a section's rows from `fromRow` (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = cubsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};

const thirdBase100s = range(101, 117);
const firstBase100s = range(118, 134);
const bleachers = inMap([...range(501, 507), ...range(511, 515), ...range(536, 538)]);

describe('Wrigley Field: a 1:20 PM game in July', () => {
  it.each(inMap(range(204, 230)))('[RYS] Terrace %s (under the upper deck) is shaded all game', (id) => {
    expect(section(JULY_18_120PM, id).samples.every((s) => s.status === 'shaded')).toBe(true);
  });

  it.each(inMap([...range(403, 416, 'L'), ...range(419, 431, 'R')]))('[RYS] 400 level %s (under the roof) is shaded all game', (id) => {
    expect(section(JULY_18_120PM, id).samples.every((s) => s.status === 'shaded')).toBe(true);
  });

  it.each(inMap([...range(303, 314, 'L'), ...range(319, 331, 'R')]))(
    '[RYS] 300 level %s: the rows under the roof are shaded all game',
    (id) => {
      // Rows 7 and up are under the roof; row 7 sits right under its front
      // edge, where a low sun in front can still reach, so check from row 8.
      expect(backRowsShaded(JULY_18_120PM, id, 8).every((share) => share === 1)).toBe(true);
    },
  );

  it.each(inMap(range(106, 115)))('[RYS] third-base 100 level %s: the back rows are out of the sun at first pitch', (id) => {
    // [RYS]: rows 10 and higher across 106–115. The upper deck's edge on the
    // photo sits over about row 11, so the model shades rows 11 and up.
    expect(backRowsShaded(JULY_18_120PM, id, 11)[0]).toBe(1);
  });

  it('[RYS] the shade down the first-base line recedes as the game goes on', () => {
    const last = JULY_18_120PM.sun.length - 1;
    expect(meanShade(JULY_18_120PM, firstBase100s, [last])).toBeLessThan(meanShade(JULY_18_120PM, firstBase100s, [0]));
  });

  it.each(bleachers)('[RYS] bleacher section %s is in the sun all game', (id) => {
    expect(section(JULY_18_120PM, id).samples.every((s) => s.status === 'sun')).toBe(true);
  });
});

describe('Wrigley Field: games starting after 3 PM', () => {
  it.each([
    ['3:05 PM, Sept 1', SEPT_1_305PM],
    ['5:10 PM, July 6', JULY_6_510PM],
  ] as const)('[RYS] %s: the third-base 100s get more shade than the first-base 100s', (_label, result) => {
    expect(meanShade(result, thirdBase100s)).toBeGreaterThan(meanShade(result, firstBase100s));
    expect(meanShade(result, thirdBase100s, [0])).toBeGreaterThan(meanShade(result, firstBase100s, [0]));
  });

  it('[RYS] 5:10 PM: most third-base 100s are in the shade within the first half hour', () => {
    const shaded = thirdBase100s.filter((id) => section(JULY_6_510PM, id).samples[1].status === 'shaded');
    expect(shaded.length / thirdBase100s.length).toBeGreaterThan(0.5);
  });

  it.each(inMap(range(21, 32)))('[RYS] 5:10 PM: first-base box %s is in the sun at first pitch', (id) => {
    expect(section(JULY_6_510PM, id).samples[0].status).toBe('sun');
  });

  it('[RYS] 5:10 PM: 130–134 are among the sunniest lower seats', () => {
    expect(meanShade(JULY_6_510PM, range(130, 134))).toBeLessThan(meanShade(JULY_6_510PM, thirdBase100s));
    // Their back rows are under the upper deck (as at 126); every row in
    // front of the deck's edge is in the sun at first pitch.
    for (const id of range(130, 133)) {
      const s = cubsSections.find((x) => x.id === id)!;
      const { stand } = standFor(structure, id, s.rows.length)!;
      const open = rowLight(stand, s.standCompass!, structure.park, JULY_6_510PM.sun[0]).slice(0, stand.overhang!.coveredFromRow - 1);
      expect(open.every((l) => l === 'sun')).toBe(true);
    }
  });

  it.each(bleachers)('[RYS] 3:05 PM: bleacher section %s is in the sun at first pitch', (id) => {
    expect(section(SEPT_1_305PM, id).samples[0].status).toBe('sun');
  });
});

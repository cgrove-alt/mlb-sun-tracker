/**
 * Oracle Park reference checks: the shade engine against published
 * observations. Games are real 2025 Giants home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 86° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - stand directions pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/oracle-park/seating/shaded-covered-seats
 *         and its section pages (103, 108, 121, 127, 133, 135, 202–234, 302–336)
 *
 * Not reproduced: [RYS] says sections 127–135 are shaded early and become
 * the sunniest seats later. In the model their covered rows (29 and up) stay
 * shaded and the rest stay in the sun: home plate faces east, so as the sun
 * swings west it moves behind the third-base stands, and a deck above and
 * behind a fan cannot shade them from the front. Not asserted either way.
 */
import { giantsSections } from '../../data/sections/mlb/giants';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'giants')!;
const structure = getStadiumStructure('giants')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: giantsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JUNE_21_105PM = game('2025-06-21', '13:05'); // vs Red Sox
const SEPT_14_105PM = game('2025-09-14', '13:05'); // vs Dodgers

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
const range = (from: number, to: number, skip: number[] = []) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i).filter((n) => !skip.includes(n)).map(String);
/** Shaded share of a section's rows from `fromRow` (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = giantsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};

const firstBase100s = range(103, 112, [111]);
const thirdBase100s = range(119, 132, [120]);

describe('Oracle Park: a 1:05 PM game in September', () => {
  it('[RYS] the first-base 100s get shade before the third-base 100s', () => {
    expect(meanShade(SEPT_14_105PM, firstBase100s)).toBeGreaterThan(meanShade(SEPT_14_105PM, thirdBase100s));
  });

  it('[RYS] waiting it out works on the first-base side: its shade grows through the game', () => {
    const last = SEPT_14_105PM.sun.length - 1;
    expect(meanShade(SEPT_14_105PM, firstBase100s, [last])).toBeGreaterThan(meanShade(SEPT_14_105PM, firstBase100s, [0]));
  });

  it('[RYS] Club 202–211 get much more shade than the third-base Club 224–232', () => {
    expect(meanShade(SEPT_14_105PM, range(202, 211, [206]))).toBeGreaterThan(meanShade(SEPT_14_105PM, range(224, 232)) + 0.15);
  });

  it('[RYS] View 302–315 get more shade than the third-base View 326–336', () => {
    expect(meanShade(SEPT_14_105PM, range(302, 315, [303, 306, 309]))).toBeGreaterThan(
      meanShade(SEPT_14_105PM, range(326, 336, [329])) + 0.15,
    );
  });
});

describe('Oracle Park: a 1:05 PM game in June', () => {
  it.each([...firstBase100s, ...thirdBase100s])('[RYS] 100 level %s: rows 30 and higher are shaded at first pitch', (id) => {
    expect(backRowsShaded(JUNE_21_105PM, id, 30)[0]).toBe(1);
  });

  it.each(range(136, 152))('[RYS] outfield section %s is in the sun all game', (id) => {
    expect(section(JUNE_21_105PM, id).samples.every((s) => s.status === 'sun')).toBe(true);
  });

  it.each(['302', '308', '312', '320', '333', '336'])('[RYS] View %s: the rows under the roof are shaded all game', (id) => {
    // Rows 12–18 (the 16th to 22nd) are under the roof; the 16th sits right
    // under its front edge, where a lower sun in front can reach, so check
    // from the next row back.
    expect(backRowsShaded(JUNE_21_105PM, id, 17).every((share) => share === 1)).toBe(true);
  });
});

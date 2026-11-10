/**
 * Fenway Park reference checks: the shade engine against published
 * observations. Games are real 2025 Red Sox home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 44° ±1°, measured from imagery (orientationConsistency.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/fenway-park/seating/shaded-covered-seats
 *         and its section pages (GS3, GS14, PB10, loge-boxes, right-field-boxes)
 *   [TP]  https://www.tickpick.com/blog/boston-red-sox-seating-chart-with-seat-views
 *   [WIKI] https://en.wikipedia.org/wiki/Fenway_Park (Green Monster, Lansdowne St)
 */
import { redsoxSections } from '../../data/sections/mlb/redsox';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const fenway = MLB_STADIUMS.find((s) => s.id === 'redsox')!;
const structure = getStadiumStructure('redsox')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: redsoxSections,
    structure,
    orientationDeg: fenway.orientation,
    orientationPrecisionDeg: 1,
    latitude: fenway.latitude,
    longitude: fenway.longitude,
    firstPitch: stadiumLocalToUTC(date, time, fenway.timezone),
  });

const JULY_13_135PM = game('2025-07-13', '13:35'); // vs Rays
const JULY_12_410PM = game('2025-07-12', '16:10'); // vs Rays

const section = (result: GameShadeResult, id: string) => {
  const found = result.sections.find((s) => s.sectionId === id);
  if (!found) throw new Error(`No result for section ${id}`);
  return found;
};
const meanShade = (result: GameShadeResult, ids: string[]) =>
  ids.flatMap((id) => section(result, id).samples.map((s) => s.shadedFraction))
    .reduce((a, b) => a + b, 0) / (ids.length * result.sun.length);
const range = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

describe('Fenway Park: published shade observations', () => {
  it.each(range('G', 7, 33))('[RYS] covered Grandstand section %s is shaded all of a 1:35 PM game', (id) => {
    expect(section(JULY_13_135PM, id).samples.every((s) => s.status === 'shaded')).toBe(true);
  });

  it.each(['G3', 'G6'])('[RYS] Grandstand %s is covered but gets late-afternoon sun (4:10 PM game)', (id) => {
    const samples = section(JULY_12_410PM, id).samples;
    expect(samples[0].status).toBe('shaded');
    expect(samples[samples.length - 1].shadedFraction).toBeLessThan(samples[0].shadedFraction);
  });

  it.each([
    ['1:35 PM', JULY_13_135PM],
    ['4:10 PM', JULY_12_410PM],
  ] as const)('[RYS][TP] %s: the third-base Loge gets more shade than the first-base Loge', (_label, result) => {
    expect(meanShade(result, ['B135', 'B140', 'B145', 'B150', 'B155']))
      .toBeGreaterThan(meanShade(result, ['B95', 'B100', 'B105', 'B110', 'B115']));
  });

  it('[RYS][TP] 4:10 PM: the third-base Field Boxes get more shade than the first-base ones', () => {
    expect(meanShade(JULY_12_410PM, ['F56', 'F58', 'F60', 'F62', 'F64', 'F66']))
      .toBeGreaterThan(meanShade(JULY_12_410PM, ['F16', 'F18', 'F20', 'F22', 'F24', 'F26', 'F28']));
  });

  it.each(range('L', 34, 43))('[RYS][TP] 1:35 PM: bleacher section %s is in the sun all game', (id) => {
    expect(section(JULY_13_135PM, id).samples.every((s) => s.status === 'sun')).toBe(true);
  });

  it('[RYS] 1:35 PM: the Right Field Boxes are among the last seats to get shade', () => {
    const rightFieldBoxes = range('B', 1, 8);
    expect(meanShade(JULY_13_135PM, rightFieldBoxes)).toBeLessThan(0.2);
    expect(meanShade(JULY_13_135PM, rightFieldBoxes))
      .toBeLessThan(meanShade(JULY_13_135PM, ['B135', 'B140', 'B145', 'B150', 'B155']));
  });

  it.each(range('M', 1, 10))('[RYS][WIKI] 1:35 PM: Green Monster seats %s are in the sun all game', (id) => {
    // Nothing stands behind them but Lansdowne Street, and the wall shades
    // no seats: its shadow falls outside the park in the afternoon.
    expect(section(JULY_13_135PM, id).samples.every((s) => s.status === 'sun')).toBe(true);
  });

  it.each(['PB01', 'PB03', 'PB05', 'PB07', 'PB09'])(
    '[RYS] 1:35 PM: the covered rows of Pavilion Box %s stay shaded',
    (id) => {
      const s = redsoxSections.find((x) => x.id === id)!;
      const { stand } = standFor(structure, id, s.rows.length)!;
      for (const sun of JULY_13_135PM.sun) {
        const light = rowLight(stand, s.standCompass!, structure.park, sun);
        expect(light.slice(stand.overhang!.coveredFromRow).every((l) => l === 'shade')).toBe(true);
      }
    },
  );
});

describe('Fenway Park: where sources and the model disagree, confidence must say so', () => {
  // [RYS] says the upper rows of the Loge behind home plate are already
  // shaded at a 1 PM start. With the current estimated pavilion heights the
  // model only shades them from mid-game. Until those heights are measured
  // the answer must not be presented as High confidence.
  it.each(['B125', 'B130', 'B135'])('1:35 PM: Loge %s is not labelled High', (id) => {
    expect(section(JULY_13_135PM, id).confidence).not.toBe('high');
  });
});

/**
 * Yankee Stadium reference checks: the shade engine against published,
 * time-stamped observations. Games are real 2025 Yankees home games.
 *
 * Also counted as reference checks for this park:
 *   - sun position, July 1:05 PM ≈ 182° / 70° (spa.test.ts);
 *   - orientation 75° ±1°, measured from imagery (orientationConsistency.test.ts).
 *
 * Sources:
 *   [SS]  https://www.shadedseats.com/shaded-seats-yankee-stadium/
 *   [RYS] https://www.rateyourseats.com/yankee-stadium/seating/shaded-covered-seats
 *   [AUD] the outside audit of theshadium.com (first-base side shades first
 *         for a July 1:05 PM game).
 */
import { yankeesSections } from '../../data/sections/mlb/yankees';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const structure = getStadiumStructure('yankees')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: yankeesSections,
    structure,
    orientationDeg: 75,
    orientationPrecisionDeg: 1,
    latitude: 40.8296,
    longitude: -73.9262,
    firstPitch: stadiumLocalToUTC(date, time, 'America/New_York'),
  });

const JULY_10_705PM = game('2025-07-10', '19:05'); // vs Mariners
const JULY_12_105PM = game('2025-07-12', '13:05'); // vs Cubs
const JULY_13_135PM = game('2025-07-13', '13:35'); // vs Cubs

const section = (result: GameShadeResult, id: string) => {
  const found = result.sections.find((s) => s.sectionId === id);
  if (!found) throw new Error(`No result for section ${id}`);
  return found;
};

describe('Yankee Stadium: published shade observations', () => {
  it.each(['123', '126', '130', '224', '229', '324', '330', '424', '430'])(
    '[SS] 7:05 PM: third-base line section %s is out of the sun the whole game',
    (id) => {
      expect(section(JULY_10_705PM, id).samples.every((s) => s.status === 'shaded')).toBe(true);
    },
  );

  it.each(['235', '236', '237', '238'])(
    '[SS] 1:35 PM: left-field bleacher section %s is in the sun the whole game',
    (id) => {
      expect(section(JULY_13_135PM, id).samples.every((s) => s.status === 'sun')).toBe(true);
    },
  );

  it.each(['410', '411', '412', '413', '414', '415', '416', '417', '418', '419'])(
    '[SS][RYS] 1:35 PM: the covered back rows of section %s stay shaded all game',
    (id) => {
      const s = yankeesSections.find((x) => x.id === id)!;
      const { stand } = standFor(structure, id)!;
      for (const sun of JULY_13_135PM.sun) {
        const light = rowLight(stand, s.standCompass!, structure.park, sun);
        expect(light.slice(stand.overhang!.coveredFromRow - 1).every((l) => l === 'shade')).toBe(true);
      }
    },
  );

  it('[AUD] July 1:05 PM: the first-base side of the upper deck shades first', () => {
    const mean = (ids: string[], step: number) =>
      ids.map((id) => section(JULY_12_105PM, id).samples[step].shadedFraction).reduce((a, b) => a + b, 0) / ids.length;
    const firstBase = ['410', '412', '414', '416', '418'];
    const thirdBase = ['424', '426', '428', '430'];
    // First pitch and the next two half-hours: more shade on the first-base side.
    for (const step of [0, 1, 2]) expect(mean(firstBase, step)).toBeGreaterThan(mean(thirdBase, step));
  });

  it.each(['110', '114A', '209', '213'])(
    '[RYS] 1 PM games: covered rows of first-base-side section %s stay shaded through the 6th inning',
    (id) => {
      const s = yankeesSections.find((x) => x.id === id)!;
      const { stand } = standFor(structure, id)!;
      // Samples 0–3 run from first pitch to 90 minutes in: about the 6th inning.
      for (const sun of JULY_12_105PM.sun.slice(0, 4)) {
        const light = rowLight(stand, s.standCompass!, structure.park, sun);
        expect(light.slice(stand.overhang!.coveredFromRow - 1).every((l) => l === 'shade')).toBe(true);
      }
    },
  );
});

describe('Yankee Stadium: where sources and the model disagree, confidence must say so', () => {
  // [SS] says Terrace 310–319 "start sunny and shade gradually" at a 1:35 PM
  // start. With the current estimated Terrace geometry the model keeps them
  // sunny. Until the structure heights are measured, the answer must not be
  // presented as High confidence.
  it.each(['310', '312', '315', '317', '319'])('1:35 PM: section %s is not labelled High', (id) => {
    expect(section(JULY_13_135PM, id).confidence).not.toBe('high');
  });
});

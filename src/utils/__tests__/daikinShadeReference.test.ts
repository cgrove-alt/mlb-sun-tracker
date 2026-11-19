/**
 * Daikin Park reference checks: the shade engine against published
 * observations, with the roof open. Games are real 2025 Astros home games in
 * March and April (Rate Your Seats: in the heat of summer the roof is
 * usually closed).
 *
 * Also counted as reference checks for this park:
 *   - orientation 345° ±2°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photos (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/daikin-park/seating/shaded-covered-seats
 *         and its section pages. Their "Rows N and above are shaded during
 *         most day games" lines set which rows are covered only where the
 *         lidar does not measure it (118–120, 150–153, 156, 232, 235, 251 and
 *         252, and the mezzanine's row 3, which the scan agrees with), so
 *         those are not checked here; the others are.
 *
 * Narrowed, with the measured reason (lidar, March 2018, the roof open):
 *   - [RYS] left field (100–104) and 129–134 "among the worst for sun" at a
 *     1:10 PM start: 102's rows 8–10 are under the edge of the deck behind
 *     the Crawford Boxes, and the back rows of 129–134
 *     under the club deck's edge (row 22–27) and, with the midday sun
 *     behind them, in the shade of the roof's edge and the parked panels
 *     above them. They stay sunnier than most of the park.
 *   - [RYS] "the sun shines on the first-base side" at a 3:10 PM start: the
 *     club deck's edge is over row 22–27, not row 35, so its back rows are
 *     in shade at first pitch (16–48% of each section); every row in front
 *     of it is in the sun.
 *   - [RYS] "all the shade along the third-base line" at a 3:10 PM start:
 *     108–116 are wholly shaded; 105–107, in the left-field corner, have
 *     their front 5–15 rows in the sun. Their rows climb toward 254–257°
 *     (the lidar's fall line and treads), not the line's 214°, so the sun
 *     is behind them, and along that way only the club deck's front (69 ft)
 *     stands behind 105 and 106, not the fixed roof behind 107–116.
 *
 * Not reproduced:
 *   - [RYS] 152–153 "Rows 12 and above are shaded during most day games":
 *     they keep the source's covered row 18 (the scan doesn't see the 250s'
 *     front over them, under the parked roof's panels), so rows 12–17 face
 *     the midday sun. 154 and 155, where it is measured over row 8–9, are
 *     checked.
 *   - [RYS] 131–134 "will see more sun than other section ... during an
 *     afternoon game": at a 3:10 PM start they tie with the rest of the
 *     first-base field level (both ~32% shaded at first pitch, the club
 *     deck's back rows); 134 has the least shade (16%), 131 the most (48%),
 *     its edge over row 22.
 */
import { astrosSections } from '../../data/sections/mlb/astros';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'astros')!;
const structure = getStadiumStructure('astros')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: astrosSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 2,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const APRIL_13_110PM = game('2025-04-13', '13:10'); // vs Angels
const APRIL_2_310PM = game('2025-04-02', '15:10'); // vs Giants
const MARCH_27_310PM = game('2025-03-27', '15:10'); // vs Mets
const APRIL_12_610PM = game('2025-04-12', '18:10'); // vs Angels

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
const onMap = (ids: string[]) => ids.filter((id) => astrosSections.some((s) => s.id === id));
const range = (from: number, to: number) => onMap(Array.from({ length: to - from + 1 }, (_, i) => String(from + i)));
/** Rate Your Seats' first row label for each section whose rows do not start at 1. */
const FIRST_LABEL: Record<string, number> = { '105': 12, '108': 27, '112': 5, '113': 5, '114': 5, '116': 5, '122': 5, '124': 5, '125': 5, '126': 5 };
/** Shaded share of a section's rows from row label `fromLabel` up, per sample. */
const rowsShadedFrom = (result: GameShadeResult, id: string, fromLabel: number) => {
  const s = astrosSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  const from = Math.max(1, fromLabel - (FIRST_LABEL[id] ?? 1) + 1);
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(from - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
/** Each row's light at one sample, front row first. */
const rowsAt = (result: GameShadeResult, id: string, sample: number) => {
  const s = astrosSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return { stand, light: rowLight(stand, s.standCompass!, structure.park, result.sun[sample]) };
};
/** Every row in front of each section's first covered row is in the sun. */
const inSunBeforeCover = (result: GameShadeResult, ids: readonly string[], sample: number) =>
  ids.every((id) => {
    const { stand, light } = rowsAt(result, id, sample);
    return light.slice(0, (stand.overhang?.coveredFromRow ?? light.length + 1) - 1).every((l) => l === 'sun');
  });
const gameShade = (result: GameShadeResult, id: string) => meanShade(result, [id]);
/** The park's median section, by its shaded share over the game. */
const parkMedian = (result: GameShadeResult) => {
  const all = result.sections.map((s) => gameShade(result, s.sectionId)).sort((a, b) => a - b);
  return all[Math.floor(all.length / 2)];
};

const thirdBaseField = range(105, 116);
const firstBaseField = range(122, 134);

describe('Daikin Park (roof open): a 1:10 PM game in April', () => {
  it.each(['112', '113', '114', '116'])('[RYS] %s: rows 32 and above are shaded through the game', (id) => {
    expect(rowsShadedFrom(APRIL_13_110PM, id, 32).every((share) => share === 1)).toBe(true);
  });

  it('[RYS] the third-base side gets shade earlier and more consistently', () => {
    for (let i = 0; i < APRIL_13_110PM.sun.length; i++) {
      expect(meanShade(APRIL_13_110PM, thirdBaseField, [i])).toBeGreaterThan(meanShade(APRIL_13_110PM, firstBaseField, [i]));
    }
  });

  it('[RYS] left field (100–104) and 129–134 are among the worst for sun', () => {
    expect(meanShade(APRIL_13_110PM, ['100', '101', '103', '104'], [0, 1, 2])).toBeLessThan(0.05);
    for (const i of [0, 1, 2]) expect(inSunBeforeCover(APRIL_13_110PM, ['102'], i)).toBe(true);
    const median = parkMedian(APRIL_13_110PM);
    for (const id of [...range(100, 104), ...range(129, 134)]) expect(gameShade(APRIL_13_110PM, id)).toBeLessThan(median);
  });

  it.each(['122', '124', '125', '126'])('[RYS] %s: rows 35 and above are shaded during most day games', (id) => {
    expect(rowsShadedFrom(APRIL_13_110PM, id, 35).every((share) => share === 1)).toBe(true);
  });

  it.each(['154', '155'])('[RYS] %s: rows 12 and above are shaded during most day games', (id) => {
    expect(rowsShadedFrom(APRIL_13_110PM, id, 12).every((share) => share === 1)).toBe(true);
  });
});

describe.each([
  ['March 27', MARCH_27_310PM],
  ['April 2', APRIL_2_310PM],
])('Daikin Park (roof open): a 3:10 PM game on %s', (_, result) => {
  it('[RYS] shade on all levels near the third-base dugout; the sun shines on the first-base side', () => {
    expect(meanShade(result, [...range(112, 116), ...range(212, 217), ...range(313, 318), ...range(413, 417)], [0])).toBeGreaterThan(0.95);
    expect(inSunBeforeCover(result, firstBaseField, 0)).toBe(true);
  });

  it('[RYS] club level along the third-base line almost entirely shaded at first pitch, and upper deck 408–417', () => {
    expect(meanShade(result, range(205, 217), [0])).toBeGreaterThan(0.95);
    expect(meanShade(result, range(408, 417), [0])).toBe(1);
  });

  it.each(['109', '110', '111', '112', '113', '114', '116'])('[RYS] %s: rows 12 and higher are shaded', (id) => {
    expect(rowsShadedFrom(result, id, 12)[0]).toBe(1);
  });

  it('[RYS] fans near the right-field corner look across at all the shade along the third-base line', () => {
    expect(inSunBeforeCover(result, range(131, 134), 0)).toBe(true);
    expect(meanShade(result, range(108, 116), [0])).toBe(1);
  });
});

describe('Daikin Park (roof open): a 6:10 PM game in April', () => {
  it.each(['100', '101', '102'])('[RYS] %s: rows 8 and above are shaded during most late afternoon games', (id) => {
    expect(rowsShadedFrom(APRIL_12_610PM, id, 8)[0]).toBe(1);
  });

  it('[RYS] 317 is wholly shaded, and 307 and 318 from row 1, during most late afternoon games', () => {
    expect(meanShade(APRIL_12_610PM, ['307', '317', '318'], [0])).toBe(1);
  });

  it('[RYS] for evening games the sun still sneaks through to seats on the first-base side', () => {
    expect(meanShade(APRIL_12_610PM, [...firstBaseField, ...range(222, 236)], [0])).toBeLessThan(0.6);
    expect(meanShade(APRIL_12_610PM, [...thirdBaseField, ...range(205, 217)], [0])).toBe(1);
  });
});

/**
 * Busch Stadium reference checks: the shade engine against published
 * observations. Games are real 2025 Cardinals home games.
 *
 * Also counted as reference checks for this park:
 *   - orientation 62° ±1.5°, measured from imagery (orientationConsistency.test.ts);
 *   - the seat map pinned to the same aerial photo (standCompass.test.ts);
 *   - sun position agrees with NOAA at every MLB park (spa.test.ts).
 *
 * Sources:
 *   [RYS] https://www.rateyourseats.com/busch-stadium/seating/shaded-covered-seats
 *         and its section pages (101–197, 228–272, 331–372, 431–454)
 *
 * On the measured heights (USGS lidar, 2017; stadiumStructures.ts), [RYS]'s
 * 341–347 (the first-base end of the Pavilion), "shaded during most late
 * afternoon games", now holds (tested below): the roof over the 400s,
 * measured right behind them, shades them. On the estimated heights they
 * were shaded only near sunset.
 *
 * Not reproduced: [RYS] the third-base side is the best bet for a 3:05 PM
 * start. In the only such 2025 game (March 27, 3:15 PM) the first-base side
 * is the more shaded (all of 141–154 against 75% of 155–172; about equal on
 * the estimated heights): with the sun 42° up and nearly behind it, it is
 * under the line of the measured roof over the 400s (see 152–154 below).
 * The third-base side's lead shows in the later starts tested below.
 *
 * Partly reproduced, since the heights are measured, recorded rather than
 * tuned:
 *   - [RYS] the backs of 135 and 162–167 are covered from row 19–21. The
 *     scan puts the 200 level's edge over row 28 (135) and 24–27 (162–167),
 *     the seats in front of it showing in the open, so the covered rows are
 *     the scan's. Tested from those rows.
 *   - [RYS] about half of the club level is shaded for an early-afternoon
 *     game. Its rows 9 and up are (tested), but the scan puts the
 *     Pavilion's front over row 4–5, so 85% of the club is shaded at first
 *     pitch. Tested: at least about half.
 *   - [RYS] the Pavilion gets little to no shade. True at its ends (331–333,
 *     357–360; tested). Behind home (334–356) the roof over the 400s,
 *     measured 133 ft up right behind them (the estimate had the Terrace,
 *     95 ft), shades them as the sun moves behind it: 30–80% over a 1:15 PM
 *     July game.
 *   - [RYS] the third-base side is the shade side, and shades first late in
 *     the day. Still true, by less: the measured roof line behind the
 *     first-base side shades it too (100s 30% against 29% over a 1:15 PM
 *     July game, was 28% against 17%; the upper deck 60% against 31%, was
 *     61% against 0%; at a 5:15 PM May start 90% against 79% at first
 *     pitch, was 79% against 48%). Tested: more.
 *   - [RYS] 152–154: only a few rows shaded at first pitch of a 3:15 PM
 *     March game, most by the middle innings. The second part holds
 *     (tested); at first pitch they are already 72–100% shaded: the sun,
 *     42° up and nearly behind them, is under the line of the measured roof
 *     over the 400s. The model treats that roof as the top of a wall; on
 *     the ground light may come in under its open back, which the
 *     cross-section cannot see.
 */
import { cardinalsSections } from '../../data/sections/mlb/cardinals';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { MLB_STADIUMS } from '../../data/stadiums';
import { computeGameShade, standFor, type GameShadeResult } from '../gameShade';
import { rowLight } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

const park = MLB_STADIUMS.find((s) => s.id === 'cardinals')!;
const structure = getStadiumStructure('cardinals')!;
const game = (date: string, time: string): GameShadeResult =>
  computeGameShade({
    sections: cardinalsSections,
    structure,
    orientationDeg: park.orientation,
    orientationPrecisionDeg: 1.5,
    latitude: park.latitude,
    longitude: park.longitude,
    firstPitch: stadiumLocalToUTC(date, time, park.timezone),
  });

const JULY_13_115PM = game('2025-07-13', '13:15'); // vs Braves
const MARCH_27_315PM = game('2025-03-27', '15:15'); // vs Twins
const MAY_4_515PM = game('2025-05-04', '17:15'); // vs Mets

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
/** Only the ids that are sections on the seat map (101–111 skips the even numbers). */
const onMap = (ids: string[]) => ids.filter((id) => cardinalsSections.some((s) => s.id === id));
/** Shaded share of a section's rows from its `fromRow`-th row (1-based) back, per sample. */
const backRowsShaded = (result: GameShadeResult, id: string, fromRow: number) => {
  const s = cardinalsSections.find((x) => x.id === id)!;
  const { stand } = standFor(structure, id, s.rows.length)!;
  return result.sun.map((sun) => {
    const rows = rowLight(stand, s.standCompass!, structure.park, sun).slice(fromRow - 1);
    return rows.filter((l) => l === 'shade').length / rows.length;
  });
};
const last = (result: GameShadeResult) => result.sun.length - 1;

describe('Busch Stadium: a 1:15 PM game in July', () => {
  it('[RYS] the lower bowl sees no shade before late afternoon: the field boxes and the Cardinals Club stay in the sun', () => {
    expect(meanShade(JULY_13_115PM, onMap([...range(1, 8), ...range(127, 172).map((n) => `${n}D`)]))).toBeLessThan(0.02);
  });

  // Covered rows as positions in each section's numbered rows; the row under
  // the deck's edge can catch a high sun, so the check starts one row back.
  // 135 and 163–167 from the scan's covered row (header).
  it.each([
    ['128', 14], ['130', 17], ['132', 20], ['135', 28], ['137', 20], ['140', 21],
    ['160', 19], ['161', 19], ['163', 25], ['165', 27], ['167', 26],
  ] as const)('[RYS] the back of %s (covered from its row %i) is shaded with the sun overhead', (id, coveredFrom) => {
    expect(backRowsShaded(JULY_13_115PM, id, coveredFrom + 1)[0]).toBe(1);
  });

  // 162–167 from the scan's covered row (header).
  it.each([['160', 19], ['161', 19], ['162', 24], ['163', 25], ['165', 27], ['167', 26]] as const)(
    '[RYS] the covered back of %s (from its row %i) stays shaded all game',
    (id, coveredFrom) => {
      expect(backRowsShaded(JULY_13_115PM, id, coveredFrom).every((share) => share === 1)).toBe(true);
    },
  );

  // 249–251 have rows 1–8 only (250 a drink rail behind them).
  it.each(onMap(range(241, 257)).filter((id) => !['249', '250', '251'].includes(id)))('[RYS] club level %s is covered from row 9', (id) => {
    expect(backRowsShaded(JULY_13_115PM, id, 10)[0]).toBe(1);
  });

  // At least: the scan covers the club from row 4–5, so 85% is shaded (header).
  it('[RYS] about half of the club level is shaded for an early-afternoon game', () => {
    expect(meanShade(JULY_13_115PM, onMap(range(241, 257)), [0])).toBeGreaterThan(0.3);
  });

  // The Pavilion at its ends only: behind home the roof over the 400s shades it (header).
  it.each([
    ['the outfield bleachers (101–111, 189–197)', onMap([...range(101, 111), ...range(189, 197)])],
    ['the Pavilion\'s ends (331–333, 357–360)', [...range(331, 333), ...range(357, 360)]],
  ] as const)('[RYS] %s get little to no shade', (_label, ids) => {
    expect(meanShade(JULY_13_115PM, [...ids])).toBeLessThan(0.05);
  });

  // More shade, by less than before the heights were measured (header).
  it('[RYS] the third-base side is the shade side', () => {
    expect(meanShade(JULY_13_115PM, onMap(range(155, 172)))).toBeGreaterThan(meanShade(JULY_13_115PM, onMap(range(141, 154))));
    // In the upper deck too: the covered left-field Pavilion against the open
    // first-base Pavilion.
    expect(meanShade(JULY_13_115PM, onMap(range(361, 372)))).toBeGreaterThan(meanShade(JULY_13_115PM, onMap(range(331, 345))));
  });

  it('[RYS] first-base loge (228–240): shaded at first, in the sun as the game goes on', () => {
    const loge = onMap(range(228, 240));
    expect(meanShade(JULY_13_115PM, loge, [last(JULY_13_115PM)])).toBeLessThan(meanShade(JULY_13_115PM, loge, [0]));
  });
});

describe('Busch Stadium: a 3:15 PM game in March', () => {
  it.each(range(152, 158))('[RYS] section %s: only a few rows shaded at first pitch, most of it by the middle innings', (id) => {
    const samples = section(MARCH_27_315PM, id).samples;
    // 152–154 are already mostly shaded at first pitch (header).
    if (!['152', '153', '154'].includes(id)) expect(samples[0].shadedFraction).toBeLessThan(0.5);
    expect(samples[4].shadedFraction).toBeGreaterThanOrEqual(0.8);
  });
});

describe('Busch Stadium: a 5:15 PM game in May', () => {
  it.each([['128', 14], ['129', 14], ['130', 17]] as const)(
    '[RYS] the covered back of %s (row %i on) is "heavily exposed" by 5–6 PM',
    (id, coveredFrom) => {
      expect(Math.max(...backRowsShaded(MAY_4_515PM, id, coveredFrom).slice(0, 4))).toBeLessThan(0.6);
    },
  );

  it('[RYS] avoid the sections numbered 133 and lower late in the day', () => {
    expect(meanShade(MAY_4_515PM, onMap(range(127, 133)), [0, 1, 2, 3])).toBeLessThan(0.15);
  });

  // More shade at first pitch, by less than before the heights were measured (header).
  it('[RYS] the third-base side shades first as the late afternoon gives way to evening', () => {
    expect(meanShade(MAY_4_515PM, onMap(range(155, 172)), [0])).toBeGreaterThan(meanShade(MAY_4_515PM, onMap(range(141, 154)), [0]));
  });

  it.each(onMap(range(341, 347)))('[RYS] the first-base end of the Pavilion, %s, is shaded for most of a late-afternoon game', (id) => {
    expect(meanShade(MAY_4_515PM, [id])).toBeGreaterThanOrEqual(0.5);
  });

  it.each([...range(348, 355), '250'])('[RYS] section %s rows 3 and up are shaded for most of a late-afternoon game', (id) => {
    expect(backRowsShaded(MAY_4_515PM, id, 3).filter((share) => share === 1).length).toBeGreaterThanOrEqual(5);
  });
});

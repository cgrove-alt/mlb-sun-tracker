/**
 * Ballpark structure profiles for the shade engine (src/utils/shadeEngine.ts).
 *
 * Each park is split into seating tiers. A tier gives the shape of its stand
 * (rows, heights, rake), the deck or roof over its back rows, and what stands
 * behind it. Sections can override any value where a source says so (for
 * example the first covered row of one section).
 *
 * Every value is either SOURCED (a cited document says so) or ESTIMATED
 * (worked out from sourced values and typical stadium dimensions; the
 * reasoning is written next to it). `heightsSourced` / `coverSourced` record
 * which, and the confidence label uses them: the engine re-runs every answer
 * with the structure's rise above the front row moved ±50% and its setbacks
 * (and how far a deck reaches out past its first covered row) ±50% where the
 * tier's heights are estimated (±10% and ±20% where they are sourced;
 * src/utils/gameShade.ts), and a section whose answer changes is labelled
 * lower confidence.
 */
import type { ParkEnvelope, StandProfile } from '../utils/shadeEngine';
import type { DetailedSection } from '../types/stadium-complete';

export interface TierStructure {
  label: string;
  stand: StandProfile;
  /** Per-section changes, keyed by section id. */
  sections?: Record<string, Partial<StandProfile> & { noCover?: boolean }>;
  /** True when the tier's heights come from a cited measurement, not an estimate. */
  heightsSourced: boolean;
  /** True when which rows are covered comes from a cited source. */
  coverSourced: boolean;
  /** Use each section's own row count from the club's seat map. */
  rowsFromMap?: boolean;
  sources: string[];
  notes?: string;
}

export interface StadiumStructure {
  stadiumId: string;
  park: ParkEnvelope;
  /** Tier key for a section id, or null for ids that are not seats (skipped). */
  tierOf: (sectionId: string) => string | null;
  tiers: Record<string, TierStructure>;
  reviewedOn: string;
}

/**
 * How far the deck above a level of suites reaches out past the suite seats,
 * feet, where a park's own tiers don't show it. At ten parks they do (the
 * suites sit behind the last row of a level that the same deck covers, and it
 * reaches 11–33 ft past them; each says so at its suites): this is their
 * median. Estimated.
 */
const SUITE_DECK_REACH_FT = 17;

/**
 * A tier's section overrides with each listed section's own measured back
 * (lidar: [height ft, setback ft behind the last row]) merged in, keeping
 * the section's other values (its cover, its front row).
 */
function withBacks(
  sections: NonNullable<TierStructure['sections']>,
  backs: Record<string, readonly [number, number]>,
): NonNullable<TierStructure['sections']> {
  const out = { ...sections };
  for (const [id, [backHeightFt, backSetbackFt]] of Object.entries(backs)) {
    out[id] = { ...out[id], backHeightFt, backSetbackFt };
  }
  return out;
}

const RYS_YANKEES = 'https://www.rateyourseats.com/yankee-stadium/seating/shaded-covered-seats';
const rysSection = (n: string) => `https://www.rateyourseats.com/yankee-stadium/seating/sections/${n}`;

const YANKEES_LIDAR = 'USGS 3DEP lidar NY_NewYorkCity, flown 2014-03-27 (scripts/measureStandHeights.py)';

/**
 * Yankee Stadium (2009). Field level is 12 ft below street level
 * (baseballpilgrimages.com). The NYC building-footprint record for the
 * stadium (BIN 2114490, photogrammetric) gives a roof height of 120 ft above
 * ground, so the canopy top is about 132 ft above the field.
 *
 * Heights are measured on USGS airborne lidar (YANKEES_LIDAR; a sparse 2014
 * scan, about 5 points per square metre), as at Dodger Stadium: for each
 * section a cut straight back through its rows gives the front row's height,
 * the rake and the structure that rises highest behind as seen from the
 * middle uncovered row; tier values are medians, sections more than 10% (at
 * least 3 ft) off get their own. The lidar confirms the canopy top (133 ft)
 * and puts its underside at its front edge at 128 ft. Covered rows: where
 * the scan puts a deck's edge more than two rows from the source's row, the
 * scan's edge is used. Undersides the scan cannot see are estimated as the
 * deck above's measured front row less 9 ft, never under 9 ft above the
 * first covered row's floor.
 */
const YANKEES: StadiumStructure = {
  stadiumId: 'yankees',
  // Far rim (lidar): the stands' roof line, median over sections 134 ft (the
  // canopy); crossing: the median distance from a section to what rises
  // highest across the field, 569 ft.
  park: { roof: 'open', farRimHeightFt: 134, fieldCrossingFt: 569 },
  tierOf: (id) => {
    const n = id.replace(/^S/, '');
    if (/^0/.test(n)) return 'legends';
    if (/^1/.test(n)) return 'field';
    if (/^20[1-4]|^23[5-9]/.test(n)) return 'bleachers';
    if (/^2/.test(n)) return 'main';
    if (/^3/.test(n)) return 'terrace';
    if (/^4/.test(n)) return 'grandstand';
    return null;
  },
  tiers: {
    legends: {
      label: 'Legends seats',
      // Up to 9 rows, completely uncovered (sourced). Lidar (16 of 29; the
      // rest are not separated from the dugouts or the 100s in the cut):
      // front row at field level (-1 to 3 ft), 10° rake (6–12). What rises
      // highest behind is the canopy, 134 ft up and 107 ft back (94–117 ft
      // behind 020–027A, measured).
      stand: { rows: 9, frontRowHeightFt: 0, rakeDeg: 10, backHeightFt: 134, backSetbackFt: 107 },
      sections: {
        '020': { backHeightFt: 132, backSetbackFt: 117 }, '021A': { backHeightFt: 140, backSetbackFt: 96 },
        '022': { backHeightFt: 132, backSetbackFt: 117 }, '027A': { backHeightFt: 141, backSetbackFt: 94 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: ['https://baseballpilgrimages.com/american/newyork.html', RYS_YANKEES, YANKEES_LIDAR],
    },
    field: {
      label: 'Field level (100s)',
      // Rows 17–26 depending on section (sourced, Rate Your Seats). Covered
      // from about row 14 by the Main Level deck (sourced; the lidar puts
      // the deck's edge at row 14 too, 4–17). Sections where the lidar puts
      // it more than two rows off take the lidar's row (below). In the
      // corner sections the sources call open (103, 104, 135, 136) the scan
      // shows the Main deck starting about five rows back (row 4–5 in 104 and
      // 135, 14 in 136); their row counts are not published (the tier's 20 is
      // a default), and short sections that end there would be open, so they
      // stay as sourced. Lidar
      // (45 of 50): front row 6 ft (4–11; 11 in the left-field corner), 12°
      // rake (8–15). What rises highest behind is the canopy, 133 ft up and
      // 46 ft behind the last row; behind 121BW and 122 the Terrace's front
      // edge, at the corners (104, 135) the Main deck's edge, 32 ft up.
      // Estimated: the Main deck's underside ~23 ft (its 28-ft front row less
      // 9 ft is under the covered rows' heads, so 9 ft above row 14's floor;
      // 24 ft over 133 and 134, whose first covered rows sit higher).
      // Sections whose measured back stands more than 10 ft nearer or
      // farther take their own (the canopy 29–94 ft behind them).
      stand: {
        deckFrontFt: 28,
        rows: 20,
        frontRowHeightFt: 6,
        rakeDeg: 12,
        backHeightFt: 133,
        backSetbackFt: 46,
        overhang: { coveredFromRow: 14, soffitHeightFt: 23 },
      },
      sections: withBacks({
        '103': { noCover: true },
        '104': { noCover: true, backHeightFt: 32, backSetbackFt: -26 },
        '107': { rows: 21, overhang: { coveredFromRow: 6, soffitHeightFt: 18 } },
        '109': { rows: 24, overhang: { coveredFromRow: 15, soffitHeightFt: 23 } },
        '120B': { rows: 17 },
        '121BW': { backHeightFt: 72, backSetbackFt: 2 },
        '122': { backHeightFt: 72, backSetbackFt: 2, overhang: { coveredFromRow: 11, soffitHeightFt: 23 } },
        ...Object.fromEntries(['123', 'S122A', 'S122B'].map((id) => [id, { overhang: { coveredFromRow: 11, soffitHeightFt: 23 } }])),
        '125': { rows: 19 },
        '127B': { rows: 19 },
        '130': { rows: 26, overhang: { coveredFromRow: 15, soffitHeightFt: 23 } },
        '133': { overhang: { coveredFromRow: 17, soffitHeightFt: 24 } },
        '134': { frontRowHeightFt: 11, overhang: { coveredFromRow: 8, soffitHeightFt: 24 } },
        '135': { noCover: true, frontRowHeightFt: 11, backHeightFt: 32, backSetbackFt: -26 },
        '136': { noCover: true },
      }, {
        '112': [132, 62], '115': [132, 57], '120B': [132, 57], 'S122B': [140, 34],
        '130': [141, 29], '132': [133, 94], '133': [140, 70], '134': [133, 59],
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_YANKEES, rysSection('107'), rysSection('109'), rysSection('120B'), rysSection('125'), rysSection('127B'), rysSection('130'), 'https://ballparkeguides.com/yankee-stadium-seating/', YANKEES_LIDAR],
    },
    main: {
      label: 'Main level (200s)',
      // 19–23 rows (sourced). Rate Your Seats counts 205–217 and 223–234 as
      // covered from row 14; behind home (218–222) the suites sit above, but
      // no source gives a covered row there and the lidar shows none. Lidar
      // (44 of 44): front row 29 ft (27–32), 19° rake. The Terrace deck's
      // front edge reaches out over row 8 (5–12; the sections below differ),
      // so the rows from 8 back are covered; that edge, 73 ft up, is what
      // rises highest behind; behind home (220B, 222) the canopy. Estimated:
      // the Terrace deck's underside ~62 ft, its 71-ft front row less 9 ft.
      // Sections whose measured back stands more than 10 ft nearer or
      // farther take their own: the 7–8 row sections behind home end where
      // the Terrace's front stands, 2–7 ft behind their last row; in 207,
      // 215 and 234W it is 12–22 ft in front of it. 215's rows stop at 13,
      // before the source's row 14, but the scan sees that front over its
      // row 8, as over the rest, so it is covered from there too.
      stand: {
        deckFrontFt: 71,
        rows: 22,
        frontRowHeightFt: 29,
        rakeDeg: 19,
        backHeightFt: 73,
        backSetbackFt: -33,
        overhang: { coveredFromRow: 8, soffitHeightFt: 62 },
      },
      sections: withBacks(Object.fromEntries([
        ['218A', { rows: 8, noCover: true }], ['218B', { rows: 8, noCover: true }],
        ['219', { rows: 8, noCover: true }], ['220A', { rows: 7, noCover: true }],
        ['220B', { rows: 7, noCover: true, backHeightFt: 140, backSetbackFt: 39 }], ['220C', { rows: 7, noCover: true }],
        ['221A', { rows: 8, noCover: true }], ['221B', { rows: 8, noCover: true }],
        ['222', { rows: 8, noCover: true, backHeightFt: 140, backSetbackFt: 39 }],
        ['215', { rows: 13 }],
        ['229', { rows: 19 }], ['205', { rows: 22 }], ['217', { rows: 23 }], ['233A', { rows: 23 }],
        ['207', { overhang: { coveredFromRow: 12, soffitHeightFt: 62 } }],
        ['216', { overhang: { coveredFromRow: 11, soffitHeightFt: 62 } }],
        ['234', { overhang: { coveredFromRow: 5, soffitHeightFt: 62 } }],
        ['234W', { overhang: { coveredFromRow: 12, soffitHeightFt: 62 } }],
      ]), {
        '218A': [72, 7], '218B': [72, 4], '219': [73, 2], '220A': [73, 4], '220C': [72, 4], '221A': [74, 7], '221B': [73, 2],
        '207': [72, -17], '215': [73, -12], '234W': [73, -22],
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_YANKEES, rysSection('217'), rysSection('220A'), rysSection('229'), rysSection('205'), rysSection('215'), rysSection('233A'), YANKEES_LIDAR],
    },
    terrace: {
      label: 'Terrace level (300s)',
      // 7–10 rows, not covered (sourced). Lidar (49 of 55): front row 72 ft
      // (71–73), 31° rake; what rises highest behind is the canopy, 133 ft
      // up and 12 ft behind the last row (22–30 ft behind 305W and 320AW,
      // measured).
      stand: { rows: 9, frontRowHeightFt: 72, rakeDeg: 31, backHeightFt: 133, backSetbackFt: 12 },
      sections: {
        '320B': { rows: 10 }, '314': { rows: 8 },
        '305W': { backHeightFt: 132, backSetbackFt: 30 }, '320AW': { backHeightFt: 132, backSetbackFt: 22 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysSection('314'), rysSection('320B'), YANKEES_LIDAR],
    },
    grandstand: {
      label: 'Grandstand (400s)',
      // 14 rows (sourced). The canopy along the whole upper-deck roofline;
      // sources say it covers from row 5, 6 or 7. Lidar: the scan is sparse
      // up here and only two sections' first rows come out cleanly (408,
      // 420C): front row 95 ft (94–95), 23° rake (22–24); the canopy's front
      // edge is over row 2, 133 ft up, its underside there 128 ft (126–129,
      // the bottom of its face), so the rows from 2 back are covered.
      stand: {
        rows: 14,
        frontRowHeightFt: 95,
        rakeDeg: 23,
        backHeightFt: 133,
        backSetbackFt: -25,
        overhang: { coveredFromRow: 2, soffitHeightFt: 128 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysSection('420B'), 'https://ballparkeguides.com/yankee-stadium-seating/', 'https://baseballpilgrimages.com/american/newyork.html', 'NYC Building Footprints, BIN 2114490 (height_roof 120 ft)', YANKEES_LIDAR],
    },
    bleachers: {
      label: 'Bleachers',
      // 202–204 (right field) and 235–238 (left field), about 20 rows,
      // uncovered (sourced). Estimated: front row ~10 ft (above the
      // outfield wall), 25° rake, a ~40 ft back wall. Not measured: the
      // club's chart draws these sections toward the foul lines, so the
      // lidar cuts along their bearings land on other stands.
      stand: { rows: 20, frontRowHeightFt: 10, rakeDeg: 25, backHeightFt: 40 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysSection('203'), RYS_YANKEES],
    },
  },
  reviewedOn: '2026-11-12',
};

const RYS_FENWAY = 'https://www.rateyourseats.com/fenway-park/seating/shaded-covered-seats';
const rysFenway = (path: string) => `https://www.rateyourseats.com/fenway-park/seating/${path}`;

/**
 * Seating tier of a Fenway Park ticket product, by the club map's id codes.
 * Standing room, tables, booths and terraces return null (not rated).
 */
export function fenwayTier(id: string): string | null {
  if (/^(?:F|D|H|FBC)\d/.test(id) || id === 'JBDBX') return 'fieldBox';
  const box = /^B(\d+)$/.exec(id);
  if (box) return Number(box[1]) <= 8 ? 'rightFieldBox' : 'logeBox';
  if (/^G\d/.test(id)) return 'grandstand';
  if (/^L\d/.test(id)) return 'bleachers';
  if (/^M\d/.test(id)) return 'monster';
  if (/^R\d/.test(id)) return 'roofBox';
  if (/^PB\d/.test(id)) return 'pavilionBox';
  if (/^(?:AC|DTC)\d/.test(id) || id === 'DTCB') return 'pavilionClub';
  if (/^AP\d/.test(id)) return 'auraPavilion';
  if (/^PR\d/.test(id)) return 'pavilionReserved';
  if (/^(?:SB|SK|SL|SR)\d/.test(id)) return 'suite';
  return null;
}

const FENWAY_LIDAR = 'USGS 3DEP lidar MA_CentralEastern_2021, flown 2021-03-20 (scripts/measureStandHeights.py)';

/**
 * Fenway Park (1912). The lower bowl is one continuous slope: Field Boxes,
 * then Loge Boxes, then the Grandstand under a roof held up by posts, with
 * the pavilion level (clubs, Aura Pavilion, press box) on top of that roof.
 * Row counts come from the club's seat map.
 *
 * Heights are measured on USGS airborne lidar (FENWAY_LIDAR), as at Dodger
 * Stadium: for each section a cut straight back through its rows gives the
 * front row's height, the rake and the structure that rises highest behind
 * as seen from the middle uncovered row; tier values are medians, sections
 * more than 10% (at least 3 ft) off get their own. The eight lattice light
 * towers on the roof are not counted as walls. Covered rows: where the scan
 * puts a roof's or deck's edge more than two rows from the source's row
 * (most of the Loge Boxes, which the sources call open), the scan's edge is
 * used, with the lowest structure seen at it as the underside. The
 * Grandstand, the pavilion clubs and the suites are hidden from the air and
 * stay estimated, now from the measured structure around them. The lidar
 * puts the Green Monster seats' front row at 36.6 ft, matching the sourced
 * 37 ft (the light towers among them are not a roof).
 */
const FENWAY: StadiumStructure = {
  stadiumId: 'redsox',
  // Far rim (lidar): the stands' roof line, median over sections 82 ft (the
  // pavilion roof); crossing: the median distance from a section to what
  // rises highest across the field, 520 ft.
  park: { roof: 'open', farRimHeightFt: 82, fieldCrossingFt: 520 },
  tierOf: fenwayTier,
  tiers: {
    fieldBox: {
      label: 'Field Box',
      // Uncovered (sourced). Lidar (154 of 157): front row 1 ft below the
      // field (-2 to 1), 9° rake (7–10). What rises highest behind is the
      // pavilion roof, 82 ft up and 47 ft behind the last row; behind home
      // the press box block (96–100 ft), in the right-field corner the
      // Grandstand roof (54 ft). Sections whose measured back stands more
      // than 10 ft nearer or farther take their own (the roof's front 34–35
      // ft back behind 13–20, 58–61 and 69).
      stand: { rows: 12, frontRowHeightFt: -1, rakeDeg: 9, backHeightFt: 82, backSetbackFt: 47 },
      sections: withBacks({
        ...Object.fromEntries(['F39', 'F40', 'F41', 'F42', 'F43', 'F46', 'F47', 'F48', 'F49', 'H39', 'H40', 'H41', 'H42', 'H43', 'H46', 'H47', 'H48', 'H49'].map((id) => [id, { backHeightFt: 96, backSetbackFt: 25 }])),
        ...Object.fromEntries(['F44', 'F45', 'H44', 'H45'].map((id) => [id, { backHeightFt: 100, backSetbackFt: 25 }])),
        ...Object.fromEntries(['D78', 'D79', 'F78', 'F79', 'F80', 'F81', 'FBC78', 'FBC79', 'FBC80'].map((id) => [id, { backHeightFt: 54, backSetbackFt: 29 }])),
      }, {
        ...Object.fromEntries(['F13', 'F14', 'F15', 'F17', 'F18', 'F19', 'D13', 'D14', 'D15', 'D17', 'D18', 'D19', 'F58', 'F60', 'F61', 'D58', 'D60', 'D61', 'FBC58', 'FBC60', 'FBC61'].map((id) => [id, [82, 35] as const])),
        ...Object.fromEntries(['F20', 'D20', 'F69', 'FBC69'].map((id) => [id, [82, 34] as const])),
        'F42': [96, 39], 'H42': [96, 39],
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_FENWAY, rysFenway('sections/FB38'), FENWAY_LIDAR],
    },
    logeBox: {
      label: 'Loge Box',
      // Rows AA–NN; Rate Your Seats calls them uncovered. Lidar (72 of 78):
      // front row 4 ft (3–9), 16° rake (12–34). The front edge of the
      // Grandstand roof reaches out over row 9 (3–14 by section, below), its
      // lowest structure 41 ft up and its front (the Pavilion's front row on
      // it) 52 ft, so the rows behind it are covered; behind
      // home the press box block reaches out over row 6, 57–87 ft up. The
      // roof's top over row 9, 54 ft up, is what rises highest behind (36–96
      // ft from section to section). Sections whose measured back stands
      // more than 10 ft nearer or farther take their own: in the 21-row
      // sections (B94–B97) the roof's edge is 26 ft in front of the last
      // row; behind the short ones (B96, B103, B116, B146, B165: 6–11 rows)
      // it starts at or just past the last row.
      stand: { rows: 13, frontRowHeightFt: 4, rakeDeg: 16, backHeightFt: 54, backSetbackFt: -13, deckFrontFt: 52, overhang: { coveredFromRow: 9, soffitHeightFt: 41 } },
      sections: withBacks({
        'B88': { backHeightFt: 41, backSetbackFt: -14, deckFrontFt: 39, overhang: { coveredFromRow: 13, soffitHeightFt: 28 } },
        'B89': { backHeightFt: 41, backSetbackFt: -14, deckFrontFt: 39, overhang: { coveredFromRow: 14, soffitHeightFt: 28 } },
        // At the ends and behind home another structure covers them, its
        // front not measured.
        'B102': { backHeightFt: 41, backSetbackFt: -14 },
        ...Object.fromEntries(['B105', 'B150'].map((id) => [id, { deckFrontFt: undefined, overhang: { coveredFromRow: 8, soffitHeightFt: 36 } }])),
        ...Object.fromEntries(['B106', 'B107', 'B108', 'B147', 'B148'].map((id) => [id, { backHeightFt: 36, backSetbackFt: -15, deckFrontFt: undefined, overhang: { coveredFromRow: 7, soffitHeightFt: 36 } }])),
        'B110': { deckFrontFt: undefined, overhang: { coveredFromRow: 7, soffitHeightFt: 36 } },
        ...Object.fromEntries(['B109', 'B149'].map((id) => [id, { backHeightFt: 36, backSetbackFt: -15, deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 36 } }])),
        'B111': { deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 36 } },
        'B115': { frontRowHeightFt: 9, backHeightFt: 61, backSetbackFt: -15, overhang: { coveredFromRow: 3, soffitHeightFt: 41 } },
        'B118': { overhang: { coveredFromRow: 9, soffitHeightFt: 46 } },
        ...Object.fromEntries(['B125', 'B128', 'B132', 'B133'].map((id) => [id, { backHeightFt: 87, backSetbackFt: -15, deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 66 } }])),
        'B127': { backHeightFt: 87, backSetbackFt: -15, deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 57 } },
        'B129': { backHeightFt: 87, backSetbackFt: -15, deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 36 } },
        'B130': { backHeightFt: 96, backSetbackFt: -9, deckFrontFt: undefined, overhang: { coveredFromRow: 10, soffitHeightFt: 87 } },
        'B131': { backHeightFt: 87, backSetbackFt: -15, deckFrontFt: undefined, overhang: { coveredFromRow: 5, soffitHeightFt: 33 } },
        'B134': { backHeightFt: 87, backSetbackFt: -15, overhang: { coveredFromRow: 6, soffitHeightFt: 41 } },
        'B135': { overhang: { coveredFromRow: 6, soffitHeightFt: 41 } },
      }, {
        'B94': [55, -26], 'B95': [53, -26], 'B97': [53, -26],
        'B96': [54, 0], 'B103': [53, -2], 'B116': [54, 1], 'B146': [54, 1], 'B165': [54, 6],
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, rysFenway('loge-boxes'), rysFenway('sections/LB122'), FENWAY_LIDAR],
    },
    grandstand: {
      label: 'Grandstand',
      // Every row covered by the roof the pavilion level sits on (sourced).
      // Hidden from the air. At the roof's front edge over the Loge Boxes
      // the scan shows structure down to 41 ft (33–87; the face itself is
      // not seen), used as the underside. Estimated: front row ~15 ft (just
      // above the Loge's measured last row), 20° rake, back wall ~48 ft.
      stand: {
        rows: 17,
        frontRowHeightFt: 15,
        rakeDeg: 20,
        backHeightFt: 48,
        overhang: { coveredFromRow: 1, soffitHeightFt: 41 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, rysFenway('sections/GS3'), rysFenway('sections/GS14'), 'https://ballparkeguides.com/fenway-park-seating-guide/', FENWAY_LIDAR],
    },
    rightFieldBox: {
      label: 'Right Field Box',
      // Uncovered; among the last seats to get shade (sourced). Lidar (5 of
      // 8; the others are not separated from the Grandstand in the cut):
      // front row 1 ft below the field (-1 to 2), 9° rake (6–15); behind,
      // the pavilion roof 82 ft up and 52 ft back (63 ft behind B5).
      stand: { rows: 12, frontRowHeightFt: -1, rakeDeg: 9, backHeightFt: 82, backSetbackFt: 52 },
      sections: { 'B2': { backHeightFt: 41, backSetbackFt: 21 }, 'B5': { backHeightFt: 82, backSetbackFt: 63 }, 'B6': { frontRowHeightFt: 2 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [rysFenway('right-field-boxes'), RYS_FENWAY, FENWAY_LIDAR],
    },
    bleachers: {
      label: 'Bleachers',
      // Uncovered; no bleacher seat is shaded on day games (sourced).
      // Estimated: front row ~8 ft, 22° rake, a ~45 ft back wall. Not
      // measured: the club's chart puts these sections off their stand, so
      // the lidar cuts along their bearings land behind it.
      stand: { rows: 20, frontRowHeightFt: 8, rakeDeg: 22, backHeightFt: 45 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, 'https://www.tickpick.com/blog/boston-red-sox-seating-chart-with-seat-views'],
    },
    monster: {
      label: 'Green Monster seats',
      // On top of the 37 ft wall, 3 rows, uncovered, nothing behind but
      // Lansdowne Street (sourced: Wikipedia, Rate Your Seats; the lidar
      // gives 36.6 ft). Lidar (3 of 10): behind M10 the buildings across
      // the street, 55 ft up and 150 ft back; over M1 and M8 it sees only
      // the light towers' lattice standing among the seats (44–45 ft), not
      // a wall, so they keep the sourced back.
      stand: { rows: 3, frontRowHeightFt: 37, rakeDeg: 10, backHeightFt: 41 },
      sections: { 'M10': { backHeightFt: 55, backSetbackFt: 150 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: ['https://en.wikipedia.org/wiki/Fenway_Park', rysFenway('monster-seats'), FENWAY_LIDAR],
    },
    roofBox: {
      label: 'Roof Box',
      // Rows A–G, uncovered (sourced). Lidar (10 of 11): front row 53 ft
      // (52–53), 33° rake (31–35). A structure 82 ft up reaches out over
      // row 6 (against the source) and is what rises highest behind; behind
      // R39 and R41 a lower one, 66 ft, right behind the last row. R43 (one
      // row on the club's map, at the front) cuts the same as R41, a 7-row
      // run with nothing at 82 ft; the tool will not measure one row on
      // it. Behind its row the run rises to R41's 66 ft, 18 ft back.
      stand: { rows: 7, frontRowHeightFt: 53, rakeDeg: 33, backHeightFt: 82, backSetbackFt: -4 },
      sections: {
        ...Object.fromEntries(['R39', 'R41'].map((id) => [id, { backHeightFt: 66, backSetbackFt: 1 }])),
        'R43': { backHeightFt: 66, backSetbackFt: 18 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [rysFenway('right-field-roof-boxes'), 'https://en.wikipedia.org/wiki/Fenway_Park', FENWAY_LIDAR],
    },
    pavilionBox: {
      label: 'Aura Pavilion Box',
      // Covered (sourced; sources differ on whether from row A, B or C, so
      // from row B). Lidar (2 of 14; in the rest the pavilion's first rows
      // join the next stand in the cut): front row 53 ft, 32° rake; behind,
      // the pavilion roof 82 ft up. Estimated: underside ~66 ft (the press
      // box's, measured where the scan sees its face).
      stand: {
        rows: 5,
        frontRowHeightFt: 53,
        rakeDeg: 32,
        backHeightFt: 82,
        backSetbackFt: 1,
        overhang: { coveredFromRow: 2, soffitHeightFt: 66 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysFenway('sections/PB10'), RYS_FENWAY, 'https://ballparkeguides.com/fenway-park-seating-guide/', FENWAY_LIDAR],
    },
    pavilionClub: {
      label: 'Pavilion club (Aura Club, Dell Technologies Club)',
      // Covered: the press box sits overhead (sourced). Hidden from the air;
      // estimated from the measured pavilion level around it: floor 53 ft,
      // the press box's underside 66 ft and top 82 ft.
      stand: {
        rows: 5,
        frontRowHeightFt: 53,
        rakeDeg: 12,
        backHeightFt: 82,
        overhang: { coveredFromRow: 1, soffitHeightFt: 66 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, 'https://www.mlb.com/redsox/ballpark/information/guide', FENWAY_LIDAR],
    },
    auraPavilion: {
      label: 'Aura Pavilion',
      // Level 4 seating down both lines (sourced: Red Sox ballpark guide).
      // The sources don't say whether it is covered; the lidar shows nothing
      // over 12 of the 14 sections, while AP01 and AP02 sit under the press
      // box from their first row (its face's bottom 66 ft up). Lidar (14 of
      // 14): front row 53 ft (52–53), 32° rake (28–34); behind, the pavilion
      // roof 82 ft up.
      stand: { rows: 5, frontRowHeightFt: 53, rakeDeg: 32, backHeightFt: 82, backSetbackFt: 2 },
      sections: Object.fromEntries(['AP01', 'AP02'].map((id) => [id, { overhang: { coveredFromRow: 1, soffitHeightFt: 66 } }])),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: ['https://www.mlb.com/redsox/ballpark/information/guide', RYS_FENWAY, FENWAY_LIDAR],
    },
    pavilionReserved: {
      label: 'Pavilion Reserved',
      // Rows A–J; Rate Your Seats calls them uncovered. Lidar (4 of 4): front
      // row 52 ft (52–53), 35° rake (32–36); a structure 82 ft up reaches
      // out over row 6 of PR15 and PR16 (covering them from there; over the
      // last rows only in PR18 and PR20) and is what rises highest behind.
      stand: { rows: 10, frontRowHeightFt: 52, rakeDeg: 35, backHeightFt: 82, backSetbackFt: -7 },
      sections: {
        ...Object.fromEntries(['PR15', 'PR16'].map((id) => [id, { overhang: { coveredFromRow: 6, soffitHeightFt: 82 } }])),
        'PR18': { backHeightFt: 69, backSetbackFt: 1 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [rysFenway('pavilion-reserved'), FENWAY_LIDAR],
    },
    suite: {
      label: 'Suites',
      // Enclosed suites: one row of seats under the suite ceiling, 9 ft above
      // the floor. Hidden from the air; estimated as before. They sit behind the
      // Pavilion Boxes' last row (60 ft), under the deck that covers those boxes
      // from row 2, so it reaches 11 ft past the suite seats.
      stand: { rows: 1, frontRowHeightFt: 60, rakeDeg: 0, backHeightFt: 72, overhang: { coveredFromRow: 1, soffitHeightFt: 69, reachFt: 11 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/redsox/ballpark/information/guide'],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysDodgers = (path: string) => `https://www.rateyourseats.com/uniqlo-field-at-dodger-stadium/seating/${path}`;
const RYS_DODGERS = rysDodgers('shaded-covered-seats');

/**
 * Seating ring of a Dodger Stadium chart section. The club map numbers the
 * whole upper deck "RS", but the tickets (and Rate Your Seats) split it:
 * Infield Reserve 1–11 (rows A–V, under the Top Deck from row N), Infield
 * Reserve 15/16/19/20 (A–V, open), Lower Reserve 23, 24, 27, 28 … 59, 60
 * (A–V, open) and Reserve 12–14, 17, 18, 21, 22, 25, 26 … 61 (rows AA–JJ
 * behind them, covered from CC).
 */
export function dodgersTier(id: string): string | null {
  const m = /^(\d+)(FD|DG|BL|LG|CL|RS|TD|PL|PR)$/.exec(id);
  if (m) {
    const n = Number(m[1]);
    switch (m[2]) {
      case 'FD': return 'field';
      case 'DG': return 'dugoutClub';
      case 'BL': return 'baselineClub';
      case 'LG': return 'loge';
      case 'CL': return 'club';
      case 'TD': return 'topDeck';
      case 'PL':
      case 'PR': return 'pavilion';
      default:
        if (n <= 11) return 'infieldReserve';
        if ([15, 16, 19, 20].includes(n)) return 'infieldReserveOpen';
        if (n >= 23 && (n % 4 === 3 || n % 4 === 0)) return 'lowerReserve';
        return 'reserve';
    }
  }
  if (/^(?:STE|SCB)\d+$|^CL\d$|^OWNERS$/.test(id)) return 'suite';
  return null;
}

const DODGERS_LIDAR = 'USGS 3DEP lidar CA_LosAngeles_B23, flown 2023-11-22 to 2023-12-04 (scripts/measureStandHeights.py)';

/**
 * Dodger Stadium (1962), five decks stacked into the hillside: Field, Loge,
 * Club, Reserve and the Top Deck behind home. Row letters skip I (the Reserve
 * goes H, J), so "row N" is the 13th row. Rows and covered rows are from Rate
 * Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (DODGERS_LIDAR): for each
 * section, a cut straight back through its rows gives the front row's height
 * (the treads' line at the middle of the first row), the rake, and of the
 * structure behind, the point that rises highest as seen from the middle
 * uncovered row. Values are medians over a tier's sections, with the spread
 * given; sections more than 10% (at least 3 ft) off get their own values.
 * Covered rows: where the scan puts a deck's or roof's edge more than two
 * rows from the source's covered row, the scan's edge is used. The underside
 * at an edge is the bottom of its face where the scan sees one, otherwise
 * the lowest structure seen there (when that is a deck of seats, its front
 * row less the 9 ft this park's decks measure from front row to lowest
 * edge), never under 9 ft above the first covered row's floor. The Club
 * level and the suites cannot be seen from the air and stay estimated.
 */
const DODGERS: StadiumStructure = {
  stadiumId: 'dodgers',
  // Far rim (lidar): the stands' roof line, median over sections 120 ft
  // (the Reserve roofs; the Top Deck's is 139); crossing: the median
  // distance from a section to what rises highest across the field, 603 ft.
  park: { roof: 'open', farRimHeightFt: 120, fieldCrossingFt: 603 },
  tierOf: dodgersTier,
  tiers: {
    dugoutClub: {
      label: 'Dugout Club',
      // Rows AA–JJ, at most nine (sourced). Lidar (8 of 13 sections; the
      // rest are not separated from the Field level in the cut): front row
      // 2 ft below the field (-2 to 0), 7° rake (6–14). What rises highest
      // behind is the Top Deck's roof, 139 ft up and 148 ft behind; behind
      // home (1DG) the box on that roof, beside the Field level's end (10DG)
      // the Reserve roof.
      stand: { rows: 8, frontRowHeightFt: -2, rakeDeg: 7, backHeightFt: 139, backSetbackFt: 148 },
      sections: {
        '9DG': { rows: 4 },
        '1DG': { backHeightFt: 155, backSetbackFt: 160 },
        '10DG': { backHeightFt: 120, backSetbackFt: 157 },
        '11DG': { backHeightFt: 139, backSetbackFt: 127 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysDodgers('dugout-club'), rysDodgers('sections/1DC'), rysDodgers('sections/9DC'), DODGERS_LIDAR],
    },
    baselineClub: {
      label: 'Baseline Club',
      // Rows 1–6 in front of Field sections 26–43, uncovered (sourced).
      // Lidar (14 of 18): front row 1 ft below the field (-2 to -1), 7°
      // rake; behind, the Reserve roof 120 ft up and 142 ft back.
      stand: { rows: 6, frontRowHeightFt: -1, rakeDeg: 7, backHeightFt: 120, backSetbackFt: 142 },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysDodgers('field-level'), rysDodgers('sections/27'), DODGERS_LIDAR],
    },
    field: {
      label: 'Field level',
      // Rows A–X (22 rows, no I), covered from row T (19th) by the Loge
      // (sourced; the lidar puts the Loge's front edge at row 19, 16–22; at
      // row 22 in 15FD and row 16 in 52FD, which take the lidar's row).
      // Sections 52 and 53 have rows AA, A–Z (25), so T is their 20th.
      // Lidar (53 of 53): front row 1 ft (-1 to 4), 12° rake (9–13). What
      // rises highest behind depends on where the section is: down the
      // lines the Reserve deck's front edge (58 ft, 11 ft behind the last
      // row), behind home the Top Deck's roof (139 ft) or the box on it
      // (155 ft), in the corners the Reserve roof (120 ft, the median).
      // Estimated: the Loge's underside ~21 ft (9 ft above row T's floor,
      // a foot under the Loge's measured 22-ft front row; 22 ft over 15FD's
      // row 22). Sections whose measured back stands more than 10 ft nearer
      // or farther take their own (86–91 ft behind 15FD, 23FD, 48FD, 50FD).
      stand: {
        deckFrontFt: 23,
        rows: 22,
        frontRowHeightFt: 1,
        rakeDeg: 12,
        backHeightFt: 120,
        backSetbackFt: 75,
        overhang: { coveredFromRow: 19, soffitHeightFt: 21 },
      },
      sections: withBacks({
        ...Object.fromEntries(['10FD', '11FD', '12FD', '13FD', '14FD', '16FD', '17FD', '18FD', '19FD', '2FD', '4FD', '5FD', '6FD', '7FD', '8FD', '9FD'].map((id) => [id, { backHeightFt: 139, backSetbackFt: 75 }])),
        ...Object.fromEntries(['20FD', '21FD', '22FD', '24FD', '25FD', '26FD', '27FD', '28FD', '29FD', '30FD', '31FD', '32FD', '33FD', '34FD', '35FD', '36FD', '37FD', '38FD', '39FD', '40FD', '41FD', '42FD', '47FD'].map((id) => [id, { backHeightFt: 58, backSetbackFt: 11 }])),
        ...Object.fromEntries(['1FD', '3FD'].map((id) => [id, { backHeightFt: 155, backSetbackFt: 97 }])),
        '15FD': { backHeightFt: 139, backSetbackFt: 75, overhang: { coveredFromRow: 22, soffitHeightFt: 22 } },
        '52FD': { rows: 25, overhang: { coveredFromRow: 16, soffitHeightFt: 21 }, backHeightFt: 58, backSetbackFt: 11 },
        '53FD': { rows: 25, overhang: { coveredFromRow: 20, soffitHeightFt: 21 } },
      }, { '15FD': [139, 86], '23FD': [120, 89], '48FD': [120, 88], '50FD': [120, 91] }),
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1'), rysDodgers('sections/15'), rysDodgers('sections/46'), rysDodgers('sections/52'), RYS_DODGERS, DODGERS_LIDAR],
    },
    loge: {
      label: 'Loge level',
      // Rows A–W (22). Rate Your Seats counts them covered from row N
      // (13th), under the Club level. Lidar (68 of 68): front row 22 ft
      // (21–24), 19° rake (16–20). The Reserve deck's front edge reaches out
      // over row 8 (6–9), its underside there 48 ft up (47–52; 51 ft where
      // the scan sees its face), so the rows from 8 back are covered; the
      // Club deck under it, from row N, cannot be seen from the air. What
      // rises highest behind is that edge, 58 ft up.
      stand: {
        deckFrontFt: 57,
        rows: 22,
        frontRowHeightFt: 22,
        rakeDeg: 19,
        backHeightFt: 58,
        backSetbackFt: -40,
        overhang: { coveredFromRow: 8, soffitHeightFt: 48 },
      },
      sections: { '145LG': { backHeightFt: 48, backSetbackFt: -43 } },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysDodgers('sections/124'), rysDodgers('sections/139'), rysDodgers('sections/166'), RYS_DODGERS, DODGERS_LIDAR],
    },
    club: {
      label: 'Club level',
      // Rows A–H, all under the Reserve deck (sourced). Hidden from the air,
      // so estimated from the measured decks around it: its floor sits over
      // the Loge's covered rows (Club deck underside ~42 ft plus its
      // structure), front row ~46 ft, 25° rake; the Reserve deck's underside
      // ~55 ft over it (9 ft above the Club's floor; at its front edge,
      // further out, its lowest structure is 47–58 ft, and it rises with
      // its 30° rake).
      stand: {
        rows: 8,
        frontRowHeightFt: 46,
        rakeDeg: 25,
        backHeightFt: 63,
        overhang: { coveredFromRow: 1, soffitHeightFt: 55 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/229'), DODGERS_LIDAR],
    },
    infieldReserve: {
      label: 'Infield Reserve (1–11)',
      // Rows A–V (21), covered from row N (13th) by the Top Deck (sourced;
      // the lidar puts its front edge at row 12, 11–12). Lidar (11 of 11):
      // front row 56 ft (56–58), 30° rake (29–30); what rises highest behind
      // is the Top Deck's front edge, 97 ft up over row 12. Estimated: the
      // Top Deck's underside ~87 ft: its front row less this park's measured
      // deck depth (9 ft from a deck's front row to its lowest edge).
      stand: {
        deckFrontFt: 96,
        rows: 21,
        frontRowHeightFt: 56,
        rakeDeg: 30,
        backHeightFt: 97,
        backSetbackFt: -26,
        overhang: { coveredFromRow: 13, soffitHeightFt: 87 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1IR'), rysDodgers('sections/6IR'), rysDodgers('sections/11IR'), rysDodgers('reserve-level'), DODGERS_LIDAR],
    },
    infieldReserveOpen: {
      label: 'Infield Reserve',
      // Rows A–V. Rate Your Seats gives them no cover, but the lidar shows
      // the Top Deck over their rows from 12 (11–12) back. Lidar (4 of 4):
      // front row 57 ft (56–57), 27° rake (26–30); what rises highest behind
      // is the Top Deck's front edge, 97 ft up. Estimated: its underside
      // ~86 ft, its front row less the park's measured deck depth (9 ft).
      stand: { rows: 21, frontRowHeightFt: 57, rakeDeg: 27, backHeightFt: 97, backSetbackFt: -23, deckFrontFt: 94, overhang: { coveredFromRow: 12, soffitHeightFt: 86 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/15IR'), rysDodgers('reserve-level'), DODGERS_LIDAR],
    },
    lowerReserve: {
      label: 'Lower Reserve',
      // Rows A–V, no cover (sourced). Lidar (20 of 20): front row 57 ft
      // (55–58), 29° rake (25–31); behind, the Reserve roof's front edge
      // 120 ft up, 7 ft behind the last row (17–22 ft behind 44RS, 48RS and
      // 56RS, measured).
      stand: { rows: 21, frontRowHeightFt: 57, rakeDeg: 29, backHeightFt: 120, backSetbackFt: 7 },
      sections: {
        '44RS': { backHeightFt: 120, backSetbackFt: 21 }, '48RS': { backHeightFt: 120, backSetbackFt: 22 }, '56RS': { backHeightFt: 120, backSetbackFt: 17 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysDodgers('sections/23LR'), rysDodgers('sections/24LR'), rysDodgers('sections/60LR'), DODGERS_LIDAR],
    },
    reserve: {
      label: 'Reserve',
      // Rows AA–JJ (9; Reserve 12 runs to KK), covered from row CC (sourced).
      // Lidar: only the first two rows show in front of the roof, carrying
      // on the Lower Reserve's slope with their front row ~90 ft; the roof's
      // front edge is 120 ft up over row CC. Estimated: 30° rake, roof
      // underside ~102 ft (9 ft above row CC's floor).
      stand: {
        rows: 9,
        frontRowHeightFt: 90,
        rakeDeg: 30,
        backHeightFt: 120,
        backSetbackFt: -19,
        overhang: { coveredFromRow: 3, soffitHeightFt: 102 },
      },
      sections: { '12RS': { rows: 10 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/12R'), rysDodgers('sections/29R'), rysDodgers('sections/30R'), rysDodgers('sections/61R'), DODGERS_LIDAR],
    },
    topDeck: {
      label: 'Top Deck',
      // Rows A–W (22), covered from row O (14th) by a small roof; Top Deck
      // 13 has rows A–R (17), covered from P (sourced; the lidar puts the
      // roof's front edge at row 12, also in 13TD, which takes it). Lidar
      // (13 of 13): front row 97 ft (96–97), 34° rake (33–34); the roof's
      // front edge is 139 ft up and the scan sees nothing below it there: a
      // thin roof, underside taken as 139 ft. Behind home (1TD, 3TD) the box
      // on the roof, 155 ft, starts over row 17–18, its face's bottom
      // 136–137 ft (138 over 1TD, 9 ft above row 18's floor); measured, the
      // box's top is 12 ft in front of 1TD's last row and 9 ft behind 3TD's,
      // and in the shorter 13TD the roof's edge is 13 ft in front of it.
      stand: {
        rows: 22,
        frontRowHeightFt: 97,
        rakeDeg: 34,
        backHeightFt: 139,
        backSetbackFt: -27,
        overhang: { coveredFromRow: 14, soffitHeightFt: 139 },
      },
      sections: {
        '13TD': { rows: 17, backHeightFt: 139, backSetbackFt: -13, overhang: { coveredFromRow: 12, soffitHeightFt: 139 } },
        '1TD': { backHeightFt: 154, backSetbackFt: -12, overhang: { coveredFromRow: 18, soffitHeightFt: 138 } },
        '3TD': { backHeightFt: 155, backSetbackFt: 9, overhang: { coveredFromRow: 17, soffitHeightFt: 136 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1TD'), rysDodgers('sections/13TD'), rysDodgers('top-deck'), DODGERS_LIDAR],
    },
    pavilion: {
      label: 'Pavilion',
      // Rows A–X (22), covered from row T (19th) by the pavilion roof
      // (sourced; the lidar puts its front edge at row 18). Lidar (15 of
      // 16): front row 8 ft over the outfield wall (8–9), 17° rake; the
      // roof's front edge is 42 ft up, and behind 307–311 the video boards
      // rise to 85–109 ft. The scan sees nothing below 39 ft at the roof's
      // edge (39–41): a thin roof, underside taken as 39 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 8,
        rakeDeg: 17,
        backHeightFt: 42,
        backSetbackFt: -10,
        overhang: { coveredFromRow: 19, soffitHeightFt: 39 },
      },
      sections: {
        ...Object.fromEntries(['308PR', '310PR'].map((id) => [id, { backHeightFt: 89, backSetbackFt: 11 }])),
        ...Object.fromEntries(['307PL', '311PL'].map((id) => [id, { backHeightFt: 85, backSetbackFt: 11 }])),
        '309PL': { backHeightFt: 109, backSetbackFt: 12 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/301'), rysDodgers('sections/302'), rysDodgers('sections/315'), rysDodgers('pavilion-seats'), DODGERS_LIDAR],
    },
    suite: {
      label: 'Suites and clubs',
      // Enclosed suites and club boxes: one row under the suite ceiling, 9 ft
      // above the floor, the deck above reaching past them as is typical (no
      // tier here shows how far). Hidden from the air; estimated as before.
      stand: { rows: 1, frontRowHeightFt: 60, rakeDeg: 0, backHeightFt: 72, overhang: { coveredFromRow: 1, soffitHeightFt: 69, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_DODGERS],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysWrigley = (path: string) => `https://www.rateyourseats.com/wrigley-field/seating/${path}`;
const RYS_WRIGLEY = rysWrigley('shaded-covered-seats');

/**
 * Seating ring of a Wrigley Field chart section: the front boxes (1–34 and
 * the A boxes), the 100s behind them, the 200s (Terrace) under the upper
 * deck, the upper deck's 300s and 400s (L/R by side), and the bleachers.
 */
export function wrigleyTier(id: string): string | null {
  if (/^A\d+$/.test(id)) return 'clubBox';
  if (/^\d{1,2}$/.test(id)) return 'box';
  if (/^1\d\d$/.test(id)) return 'field';
  if (/^2\d\d$/.test(id)) return 'terrace';
  if (/^3\d\d[LR]$/.test(id)) return 'upperBox';
  if (/^4\d\d[LR]$/.test(id)) return 'upperReserved';
  if (/^5\d\d$/.test(id)) return 'bleachers';
  return null;
}

const WRIGLEY_LIDAR = 'USGS 3DEP lidar IL_4County_Cook_2017, flown 2017-04-17 to 2017-04-18 (scripts/measureStandHeights.py)';

/**
 * Wrigley Field (1914). One lower bowl (front boxes, the 100s, then the 200s
 * under the upper deck) and one upper deck (the 300s in front, the 400s
 * behind, both under the roof), plus the open bleachers. Rows and covered
 * rows are from Rate Your Seats' section pages.
 *
 * The upper deck and the bleachers are measured on USGS airborne lidar
 * (WRIGLEY_LIDAR), as at Dodger Stadium, with covered rows from the scan
 * where it puts a roof's edge more than two rows from the source's row. The
 * lower bowl is not: the club
 * boxes and field boxes were rebuilt in the 2017–18 offseason (with the
 * American Airlines 1914 Club under them), after the scan, so its heights
 * stay estimated: a shallow bowl rising to the upper deck's underside
 * (~32 ft). The Terrace and the 400s are hidden under the upper deck and its
 * roof.
 */
const WRIGLEY: StadiumStructure = {
  stadiumId: 'cubs',
  // Far rim (lidar): the stands' roof line, median over sections 95 ft (the
  // upper-deck roof); crossing: the median distance from a section to what
  // rises highest across the field, 619 ft.
  park: { roof: 'open', farRimHeightFt: 95, fieldCrossingFt: 619 },
  tierOf: wrigleyTier,
  tiers: {
    clubBox: {
      label: 'Club boxes',
      // The front rows behind home, uncovered. Row count not published:
      // estimated at 4. Behind them the bowl rises to the upper deck's
      // underside (~32 ft) about 85 ft back.
      stand: { rows: 4, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 32, backSetbackFt: 85 },
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_WRIGLEY],
    },
    box: {
      label: 'Front boxes (1–34)',
      // Rows 1–15 (sourced; the end sections start further back: 3 has rows
      // 10–15, 9 has 5–14, 32 has 8–15), uncovered. Estimated: front row
      // ~3 ft, 14° rake; behind, the upper deck's front edge (~31 ft) over
      // row 11 of the 100s, about 28 ft back.
      stand: { rows: 15, frontRowHeightFt: 3, rakeDeg: 14, backHeightFt: 31, backSetbackFt: 28 },
      sections: { '3': { rows: 6 }, '9': { rows: 10 }, '27': { rows: 14 }, '32': { rows: 8 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysWrigley('sections/3'), rysWrigley('sections/9'), rysWrigley('sections/18'), rysWrigley('sections/27'), rysWrigley('sections/32')],
    },
    field: {
      label: 'Field level (100s)',
      // Rows 1–15 (101 has 7–13, 134 has 10–13) (sourced). The upper deck
      // reaches over the back rows: on the 2019 aerial photo the crowd on
      // the first-base side is visible for about 21 m (69 ft) from the field
      // before the deck hides it, which leaves the front boxes (~41 ft) and
      // about ten rows of the 100s, so the deck covers from about row 11.
      // That agrees with Rate Your Seats (rows 10–13 and up shaded on day
      // games). Estimated: front row ~14 ft, 16° rake, deck underside ~31 ft.
      stand: {
        rows: 15,
        frontRowHeightFt: 14,
        rakeDeg: 16,
        backHeightFt: 40,
        overhang: { coveredFromRow: 11, soffitHeightFt: 31 },
      },
      sections: {
        '101': { rows: 7, overhang: { coveredFromRow: 5, soffitHeightFt: 31 } },
        '134': { rows: 4, overhang: { coveredFromRow: 2, soffitHeightFt: 31 } },
      },
      heightsSourced: false,
      coverSourced: false,
      sources: [rysWrigley('sections/101'), rysWrigley('sections/110'), rysWrigley('sections/118'), rysWrigley('sections/126'), rysWrigley('sections/134'), RYS_WRIGLEY],
    },
    terrace: {
      label: 'Terrace (200s)',
      // Every row of 204–230 is under the upper deck (sourced); the corner
      // sections 202, 203 and 231–233 are not. Rows 1–22 (225: 23, 230: 30,
      // 202: 9, 233: 12). Estimated: front row ~27 ft, 18° rake, upper deck
      // underside ~36 ft at its front edge (9 ft above row 1's floor).
      stand: {
        rows: 22,
        frontRowHeightFt: 27,
        rakeDeg: 18,
        backHeightFt: 50,
        overhang: { coveredFromRow: 1, soffitHeightFt: 36 },
      },
      sections: {
        '202': { rows: 9, noCover: true },
        '203': { noCover: true },
        '225': { rows: 23 },
        '230': { rows: 30 },
        '231': { noCover: true },
        '232': { noCover: true },
        '233': { rows: 12, noCover: true },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysWrigley('sections/202'), rysWrigley('sections/206'), rysWrigley('sections/212'), rysWrigley('sections/225'), rysWrigley('sections/230'), rysWrigley('sections/233'), RYS_WRIGLEY],
    },
    upperBox: {
      label: 'Upper deck (300s)',
      // Rows 1–10 (331: 12). Rate Your Seats counts them covered by the roof
      // from row 7 (315 and 316 from row 5). Lidar (21 of 28): front row
      // 48 ft (47–48), 26° rake (20–30). The roof, on its posts, reaches out
      // over row 1–2: its underside there is 87 ft up (the bottom of its
      // face, 86–87), its top 89 ft, so every row is under it; that edge is
      // what rises highest behind.
      stand: {
        rows: 10,
        frontRowHeightFt: 48,
        rakeDeg: 26,
        backHeightFt: 89,
        backSetbackFt: -18,
        overhang: { coveredFromRow: 1, soffitHeightFt: 87 },
      },
      sections: { '331R': { rows: 12 } },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysWrigley('sections/305'), rysWrigley('sections/310'), rysWrigley('sections/315'), rysWrigley('sections/320'), rysWrigley('sections/331'), WRIGLEY_LIDAR],
    },
    upperReserved: {
      label: 'Upper deck (400s)',
      // Rows 1–9, all under the roof (sourced; 419 has rows 5–9). Hidden
      // from the air; estimated from the measured 300s and roof: front row
      // ~62 ft (just above the 300s' last row), 28° rake; the roof's
      // underside, 87 ft at its front edge and rising toward its 95-ft
      // ridge, ~93 ft over these rows.
      stand: {
        rows: 9,
        frontRowHeightFt: 62,
        rakeDeg: 28,
        backHeightFt: 95,
        overhang: { coveredFromRow: 1, soffitHeightFt: 93 },
      },
      sections: { '419R': { rows: 5 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysWrigley('sections/405'), rysWrigley('sections/410'), rysWrigley('sections/419'), rysWrigley('sections/425'), RYS_WRIGLEY, WRIGLEY_LIDAR],
    },
    bleachers: {
      label: 'Bleachers',
      // Rows 1–21 (501: 7–14, 511: 14 rows), uncovered (sourced). Lidar (12
      // of 15; the cuts through 515 and 536 cross the stand's end platforms):
      // front row 9 ft over the ivy wall (8–16; 16 in center field), 30°
      // rake (21–30). What rises highest behind differs: mostly the rooftop
      // buildings across the street (57 ft median, up to 65 ft), the
      // scoreboard (511), the back wall (507, 512). The left-field video
      // board's underside is 85 ft up over rows 15–17 of 505 and 506, which
      // the lidar shows covered from there (the source calls them open).
      // Each section takes its own measured back where it stands more than
      // 10 ft nearer or farther: the buildings 60–150 ft behind 501–504 and
      // 514, the scoreboard 25 ft behind 511's last row (its 14 rows), the
      // video board's top 13 ft in front of 506's.
      stand: { rows: 21, frontRowHeightFt: 9, rakeDeg: 30, backHeightFt: 57, backSetbackFt: 11 },
      sections: {
        '501': { rows: 8, frontRowHeightFt: 16, backHeightFt: 65, backSetbackFt: 150 },
        '502': { frontRowHeightFt: 16, backHeightFt: 64, backSetbackFt: 60 },
        '503': { frontRowHeightFt: 16, backHeightFt: 60, backSetbackFt: 116 },
        '504': { backHeightFt: 54, backSetbackFt: 88 },
        '514': { backHeightFt: 54, backSetbackFt: 76 },
        '505': { backHeightFt: 94, backSetbackFt: -16, overhang: { coveredFromRow: 15, soffitHeightFt: 85 } },
        '506': { backHeightFt: 85, backSetbackFt: -13, overhang: { coveredFromRow: 17, soffitHeightFt: 85 } },
        '511': { rows: 14, backHeightFt: 88, backSetbackFt: 25 },
        ...Object.fromEntries(['507', '512'].map((id) => [id, { backHeightFt: 36, backSetbackFt: 10 }])),
        '513': { backHeightFt: 48, backSetbackFt: -18 },
        '537': { rows: 15 },
        '538': { backHeightFt: 51, backSetbackFt: 4 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysWrigley('sections/501'), rysWrigley('sections/505'), rysWrigley('sections/511'), rysWrigley('sections/515'), RYS_WRIGLEY, WRIGLEY_LIDAR],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysOracle = (path: string) => `https://www.rateyourseats.com/oracle-park/seating/${path}`;
const RYS_ORACLE = rysOracle('shaded-covered-seats');

/** Seating ring of an Oracle Park section, by the club's numbering. */
export function oracleTier(id: string): string | null {
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  if (n >= 1 && n <= 61) return 'suite';
  if (n >= 101 && n <= 135) return 'lower';
  if (n >= 136 && n <= 144) return 'bleachers';
  if (n >= 145 && n <= 152) return 'arcade';
  if (n >= 202 && n <= 234) return 'club';
  if (n >= 302 && n <= 336) return 'view';
  return null;
}

const ORACLE_LIDAR = 'USGS 3DEP lidar CA_SanFrancisco_B23, flown 2023-04-20 (scripts/measureStandHeights.py)';

/**
 * Oracle Park (2000). A deep lower bowl (rows to 41) whose back rows sit
 * under the club level, the club level under the View level, and a roof
 * over the View level's last seven rows. Rows and covered rows are from Rate
 * Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (ORACLE_LIDAR), as at Dodger
 * Stadium: for each section a cut straight back through its rows gives the
 * front row's height, the rake and the structure that rises highest behind
 * as seen from the middle uncovered row; tier values are medians, sections
 * more than 10% (at least 3 ft) off get their own. Covered rows: where the
 * scan puts a deck's edge more than two rows from the source's row, the
 * scan's edge is used. Deck undersides the scan cannot see are estimated as
 * the deck above's measured front row less 9 ft, never under 9 ft above the
 * first covered row's floor; the suites are hidden.
 */
const ORACLE: StadiumStructure = {
  stadiumId: 'giants',
  // Far rim (lidar): the stands' roof line, median over sections 125 ft (the
  // View level's roof); crossing: the median distance from a section to what
  // rises highest across the field, 582 ft.
  park: { roof: 'open', farRimHeightFt: 125, fieldCrossingFt: 582 },
  tierOf: oracleTier,
  tiers: {
    lower: {
      label: 'Lower level (100s)',
      // Rows 1–41 (sourced), covered from row 29 by the club level ("row
      // 30 and above in most sections"; section pages say 29; the lidar puts
      // the club deck's edge at row 27, and sections where it is more than
      // two rows off take the lidar's row, below). The corner sections are
      // shorter: 101 has rows 1–21 (none covered), 133 rows 28–39, 135 rows
      // 4–39. Lidar (32 of 33): front row at field level (-3 to 5 ft), 12°
      // rake (6–25). What rises highest behind is the View level's front,
      // 68 ft up over the Club level; nearer the corners the View roof
      // (125 ft). Estimated: the club deck's underside ~25 ft (9 ft above row
      // 29's floor, under the Club level's measured 32-ft front row; 26–28 ft
      // over 102, 133 and 135, 9 ft above their first covered row's floor).
      // Sections whose measured back stands more than 10 ft nearer or
      // farther take their own: the View level's front 33–35 ft in front of
      // the last row where the club deck covers from row 21–23 (107, 108,
      // 123, 124), 5–10 ft where it covers from 23–34 (102, 135); the View
      // roof 91 ft behind 112.
      stand: {
        deckFrontFt: 31,
        rows: 41,
        frontRowHeightFt: 0,
        rakeDeg: 12,
        backHeightFt: 68,
        backSetbackFt: -23,
        overhang: { coveredFromRow: 29, soffitHeightFt: 25 },
      },
      sections: withBacks({
        '101': { rows: 22, noCover: true, backHeightFt: 33, backSetbackFt: 42 },
        ...Object.fromEntries(['103', '104', '105', '112', '128', '129', '130', '131', '132', '134'].map((id) => [id, { backHeightFt: 125, backSetbackFt: 37 }])),
        '102': { overhang: { coveredFromRow: 34, soffitHeightFt: 28 } },
        ...Object.fromEntries(['107', '124'].map((id) => [id, { overhang: { coveredFromRow: 21, soffitHeightFt: 25 } }])),
        '108': { overhang: { coveredFromRow: 23, soffitHeightFt: 25 } },
        '109': { overhang: { coveredFromRow: 24, soffitHeightFt: 25 } },
        ...Object.fromEntries(['114', '116', '118', '121'].map((id) => [id, { overhang: { coveredFromRow: 25, soffitHeightFt: 25 } }])),
        '123': { overhang: { coveredFromRow: 22, soffitHeightFt: 25 } },
        // Row 28 on the measured slope.
        '133': { rows: 11, frontRowHeightFt: 16, overhang: { coveredFromRow: 2, soffitHeightFt: 26 } },
        '135': { rows: 32, frontRowHeightFt: 5, overhang: { coveredFromRow: 23, soffitHeightFt: 27 } },
      }, {
        '102': [68, -5], '107': [67, -33], '108': [68, -35], '123': [68, -33], '124': [68, -35], '135': [68, -10], '112': [125, 91],
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/101'), rysOracle('sections/103'), rysOracle('sections/108'), rysOracle('sections/121'), rysOracle('sections/127'), rysOracle('sections/133'), rysOracle('sections/135'), RYS_ORACLE, ORACLE_LIDAR],
    },
    bleachers: {
      label: 'Bleachers',
      // Rows 1–26, uncovered (sourced). Lidar (7 of 9): front row 6 ft over
      // the left-field wall (6–13), 13° rake (11–14). What rises highest
      // behind differs from section to section (37–71 ft); behind 143 the
      // scoreboard, 113 ft up, whose structure reaches out over 143's row 22
      // (its face's bottom 33 ft up; taken as 35 ft, 9 ft above row 22's
      // floor), covering the rows behind. Behind 136 what rises highest is
      // 61 ft up, 132 ft back.
      stand: { rows: 26, frontRowHeightFt: 6, rakeDeg: 13, backHeightFt: 60, backSetbackFt: 37 },
      sections: {
        '136': { backHeightFt: 61, backSetbackFt: 132 },
        '137': { backHeightFt: 43, backSetbackFt: 60 },
        '138': { backHeightFt: 37, backSetbackFt: 11 },
        '140': { backHeightFt: 71, backSetbackFt: 52 },
        '143': { frontRowHeightFt: 13, backHeightFt: 113, backSetbackFt: -7, overhang: { coveredFromRow: 22, soffitHeightFt: 35 } },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysOracle('sections/136'), rysOracle('sections/140'), rysOracle('sections/143'), RYS_ORACLE, ORACLE_LIDAR],
    },
    arcade: {
      label: 'Arcade',
      // One to seven rows along the right-field wall, uncovered (sourced; 145
      // has rows 1–7, 150 and 152 rows 1–3). Lidar (145 and 146): front row
      // 20 ft (18–21), 12° rake; behind, a 26 ft wall 21 ft back.
      stand: { rows: 3, frontRowHeightFt: 20, rakeDeg: 12, backHeightFt: 26, backSetbackFt: 21 },
      sections: { '145': { rows: 7 }, '146': { rows: 7 }, '147': { rows: 7 } },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysOracle('sections/145'), rysOracle('sections/150'), rysOracle('sections/152'), 'https://en.wikipedia.org/wiki/Oracle_Park', ORACLE_LIDAR],
    },
    club: {
      label: 'Club level',
      // Rows A–M (12, no I). Rate Your Seats counts them covered from row K
      // (10th) by the View level; 234 (rows A–H) is covered throughout.
      // Lidar (31 of 32): front row 32 ft (28–32), 19° rake (18–23). The
      // View level's front rows reach out over row 5 (4–8; 225 at 8), their
      // floor 66 ft up, so the rows from 5 back are covered; they are what
      // rises highest behind. Estimated: their underside ~57 ft, that floor
      // less 9 ft (the deck that covers row K under them is hidden). 215's
      // rows A–H stop before the source's row K, but the scan sees the View
      // level's front over its row 6, as over the rest, so it is covered
      // from row 5 with them (its back measured 8 ft in front of its last
      // row).
      stand: {
        deckFrontFt: 66,
        rows: 12,
        frontRowHeightFt: 32,
        rakeDeg: 19,
        backHeightFt: 68,
        backSetbackFt: -19,
        overhang: { coveredFromRow: 5, soffitHeightFt: 57 },
      },
      sections: {
        '204': { frontRowHeightFt: 28 },
        '205': { rows: 10 },
        '215': { rows: 8, backHeightFt: 68, backSetbackFt: -8 },
        '225': { frontRowHeightFt: 28, overhang: { coveredFromRow: 8, soffitHeightFt: 57 } },
        '234': { rows: 8, overhang: { coveredFromRow: 1, soffitHeightFt: 57 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/202'), rysOracle('sections/205'), rysOracle('sections/210'), rysOracle('sections/215'), rysOracle('sections/225'), rysOracle('sections/234'), RYS_ORACLE, ORACLE_LIDAR],
    },
    view: {
      label: 'View level (300s)',
      // Rows A–D then 1–18 (22; 315 and 326 have A–G, 0–18: 26), the roof
      // covering rows 12–18, the last seven (sourced; the lidar puts its
      // edge at row 12 too, and at row 7 in 333). Lidar (23 of 29): rows
      // 1–18 start 81 ft up
      // (79–82) at 31° (19–32); rows A–D sit in front of a cross-aisle about
      // 8 ft lower, so the front row here is row 1's height carried down
      // that slope. The roof's underside at its edge is 124 ft (where the
      // scan sees its face), its top 125 ft, and that edge is what rises
      // highest behind, 18 ft in front of the last row: the scan's rows are
      // counted from row 1, with A–D (A–G and 0 in 315 and 326) in front of
      // them (once placed 11 ft nearer, from row 1 plus 22 rows). 334's cut
      // slants across its rows (a 19° rake, its run too deep for its open
      // rows) and is not used.
      stand: {
        rows: 22,
        frontRowHeightFt: 74,
        rakeDeg: 31,
        backHeightFt: 125,
        backSetbackFt: -18,
        overhang: { coveredFromRow: 16, soffitHeightFt: 124 },
      },
      sections: {
        '315': { rows: 26, frontRowHeightFt: 68, overhang: { coveredFromRow: 20, soffitHeightFt: 124 } },
        '326': { rows: 26, frontRowHeightFt: 68, overhang: { coveredFromRow: 20, soffitHeightFt: 124 } },
        '333': { overhang: { coveredFromRow: 11, soffitHeightFt: 124 } },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysOracle('sections/302'), rysOracle('sections/308'), rysOracle('sections/315'), rysOracle('sections/326'), rysOracle('sections/336'), RYS_ORACLE, ORACLE_LIDAR],
    },
    suite: {
      label: 'Suites',
      // Enclosed suites between the Club and View levels: hidden from the
      // air. Estimated under the View level's measured 66-ft front: ceiling
      // ~60 ft, floor ~50 ft, the View level reaching past them as is typical.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 66, overhang: { coveredFromRow: 1, soffitHeightFt: 60, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/giants/ballpark/seat-map', ORACLE_LIDAR],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysCiti = (path: string) => `https://www.rateyourseats.com/citi-field/seating/${path}`;
const RYS_CITI = rysCiti('shaded-covered-seats');

/** Seating ring of a Citi Field chart section. */
export function citiTier(id: string): string | null {
  if (/^(?:[A-H]|AA|HH|\d{1,2}|\dA)$/.test(id)) return 'fieldBox';
  if (/^(?:CADI|ECLUB|STBX\d)$/.test(id)) return 'suite';
  const n = Number(id.replace(/\D+$/, ''));
  if (!Number.isInteger(n) || n < 100) return null;
  if (n >= 134 && n <= 139) return 'leftOutfield';
  if (n >= 140 && n <= 143) return 'rightOutfield';
  if (n < 200) return 'field';
  if (n < 300) return 'sterling';
  if (n < 400) return 'excelsior';
  if (n < 500) return 'fourHundred';
  return 'promenade';
}

const CITI_LIDAR = 'USGS 3DEP lidar NY_NewYorkCity, flown 2014-03-23 to 2014-04-06 (scripts/measureStandHeights.py)';

/**
 * Citi Field (2009). Field boxes, the 100 level (covered from row 27), the
 * Sterling (200) level, the Excelsior (300) level under the 400s, the 400s
 * in the open and the Promenade (500) level under the roof from row 11.
 * Rows and covered rows are from Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (CITI_LIDAR; a sparse 2014
 * scan, about 6 points per square metre), as at Dodger Stadium: for each
 * section a cut straight back through its rows gives the front row's height,
 * the rake and the structure that rises highest behind as seen from the
 * middle uncovered row; tier values are medians, sections more than 10% (at
 * least 3 ft) off get their own. The decks step back in a staircase, each
 * upper deck's front over the rows of the one below; the light towers above
 * the roof are not counted as walls. Covered rows: where the scan puts a
 * deck's edge more than two rows from the source's row, the scan's edge is
 * used. Deck undersides the scan cannot see are estimated as the deck
 * above's measured front row less 9 ft, never under 9 ft above the first
 * covered row's floor.
 */
const CITI: StadiumStructure = {
  stadiumId: 'mets',
  // Far rim (lidar): the stands' roof line, median over sections 129 ft (the
  // Promenade roof); crossing: the median distance from a section to what
  // rises highest across the field, 600 ft.
  park: { roof: 'open', farRimHeightFt: 129, fieldCrossingFt: 600 },
  tierOf: citiTier,
  tiers: {
    fieldBox: {
      label: 'Field boxes',
      // Rows 1–12, uncovered (sourced). Lidar (27 of 31): front row at field
      // level (0–2 ft), 12° rake (6–23); what rises highest behind is the
      // Promenade roof, 129 ft up and 107 ft back (119 ft behind A, measured).
      stand: { rows: 12, frontRowHeightFt: 0, rakeDeg: 12, backHeightFt: 129, backSetbackFt: 107 },
      sections: { 'A': { backHeightFt: 129, backSetbackFt: 119 } },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysCiti('sections/15'), CITI_LIDAR],
    },
    field: {
      label: 'Field level (100s)',
      // Rows 1–32. Rate Your Seats counts them covered from row 27 (102 has
      // rows 4–13 covered from 11, 108 rows 24–34 from 30, 118 rows 1–8 and
      // 133 rows A–E uncovered). Lidar (11 of 35; the sparse scan loses the
      // rest): front row 4 ft (4–7), 10° rake (10–15). Two decks cover the
      // back rows. Down both lines the first deck above is the Excelsior:
      // its edge is over row 21 (15–24; 106, 128, 130, 132), 46 ft up, so the
      // rows from there back are covered, under an underside of ~37 ft (its
      // front row less 9 ft). Behind home (114–121) the Sterling suites deck
      // reaches out over row 13–15 (measured in 114–120; 121 is taken as its
      // neighbours), its front row 25 ft up, its underside ~20 ft (9 ft above
      // row 15's floor, since 25 less 9 would be under the heads). What
      // rises highest behind is the nearer deck's edge: behind home the
      // suites deck (25 ft, over row 13–15; 117 sees the 69-ft structure);
      // down the lines (128, 130, 132) a structure 69 ft up, 15–28 ft in
      // front of the last row (median 18), 1–5 rows behind the Excelsior's
      // edge; in 106 the Excelsior's own edge (47 ft, over row 15).
      // 102 and 108 were not measured and keep their sourced rows, their
      // undersides 9 ft above the first covered row's floor. Their backs:
      // a cut through 108's front row puts the 69-ft structure over its row
      // 5, 17 ft in front of its last row (the default); 102 (no cut) has
      // only its last three rows covered, so it takes the 69-ft structure
      // at its last row. 133's five open rows are the front of a stand that
      // runs on behind them; its cut puts the 69-ft structure 49 ft behind
      // its last row.
      stand: {
        rows: 32,
        frontRowHeightFt: 4,
        rakeDeg: 10,
        backHeightFt: 69,
        backSetbackFt: -18,
        overhang: { coveredFromRow: 21, soffitHeightFt: 37 },
      },
      sections: {
        '106': { backHeightFt: 47, backSetbackFt: -48, overhang: { coveredFromRow: 15, soffitHeightFt: 37 } },
        ...Object.fromEntries(['114', '115', '119', '121'].map((id) => [id, { backHeightFt: 25, backSetbackFt: -51, overhang: { coveredFromRow: 14, soffitHeightFt: 20 } }])),
        '116': { backHeightFt: 25, backSetbackFt: -51, overhang: { coveredFromRow: 13, soffitHeightFt: 20 } },
        '117': { backHeightFt: 69, backSetbackFt: -17, overhang: { coveredFromRow: 15, soffitHeightFt: 20 } },
        '120': { backHeightFt: 25, backSetbackFt: -51, overhang: { coveredFromRow: 15, soffitHeightFt: 20 } },
        '128': { backHeightFt: 69, backSetbackFt: -17 },
        '132': { backHeightFt: 69, backSetbackFt: -28 },
        '130': { backHeightFt: 69, backSetbackFt: -17, overhang: { coveredFromRow: 24, soffitHeightFt: 37 } },
        '102': { rows: 10, frontRowHeightFt: 6, backSetbackFt: 0, overhang: { coveredFromRow: 8, soffitHeightFt: 18 } },
        '108': { rows: 11, frontRowHeightFt: 15, overhang: { coveredFromRow: 7, soffitHeightFt: 27 } },
        '118': { rows: 8, noCover: true, backHeightFt: 129, backSetbackFt: 99 },
        '133': { rows: 5, noCover: true, backSetbackFt: 49 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/102'), rysCiti('sections/108'), rysCiti('sections/114'), rysCiti('sections/121'), rysCiti('sections/128'), RYS_CITI, CITI_LIDAR],
    },
    leftOutfield: {
      label: 'Left-field seats (134–139)',
      // Rows 1–19, the upper half covered from row 7 (sourced). Estimated:
      // front row ~10 ft, 22° rake, deck underside ~26 ft. Not measured: the
      // sparse scan gives only one of these six sections (135: front row
      // 9 ft, 18° rake). Behind 135 what rises highest is measured: a
      // structure 69 ft up, 4 ft in front of its last row, over its covered
      // rows. (Its cut shows its treads open to the sky up to row 14, where
      // a deck 42 ft up begins; the source counts the cover from row 7. Not
      // changed on one section of a sparse scan.)
      stand: {
        rows: 19,
        frontRowHeightFt: 10,
        rakeDeg: 22,
        backHeightFt: 34,
        overhang: { coveredFromRow: 7, soffitHeightFt: 26 },
      },
      sections: { '135': { backHeightFt: 69, backSetbackFt: -4 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/134'), rysCiti('sections/137'), RYS_CITI],
    },
    rightOutfield: {
      label: 'Right-field seats (140–143)',
      // 140 has rows 1–20, 143 rows 1–3, uncovered (sourced). Lidar (3 of
      // 4): front row 9 ft (7–25; 141 sits 25 ft up), 18° rake (16–21).
      stand: { rows: 20, frontRowHeightFt: 9, rakeDeg: 18, backHeightFt: 45, backSetbackFt: 12 },
      sections: {
        '140': { backHeightFt: 27, backSetbackFt: 21 },
        '141': { frontRowHeightFt: 25, backHeightFt: 64, backSetbackFt: 7 },
        '143': { rows: 3 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysCiti('sections/140'), rysCiti('sections/143'), CITI_LIDAR],
    },
    sterling: {
      label: 'Sterling level (200s)',
      // No source gives rows or cover. The lidar shows nothing over 20 of
      // its 21 measured sections; over 222 a structure reaches out over row
      // 3, 34 ft up (taken as 36 ft, 9 ft above row 3's floor). Lidar (21 of
      // 39): front row 25 ft (24–35), 18° rake (7–24); what rises highest
      // behind is the 400 level's front, 69 ft up.
      stand: { rows: 6, frontRowHeightFt: 25, rakeDeg: 18, backHeightFt: 69, backSetbackFt: 11 },
      sections: {
        ...Object.fromEntries(['212', '225', '226'].map((id) => [id, { frontRowHeightFt: 29 }])),
        ...Object.fromEntries(['219', '220', '221'].map((id) => [id, { frontRowHeightFt: 34 }])),
        '222': { backHeightFt: 35, backSetbackFt: -7, overhang: { coveredFromRow: 3, soffitHeightFt: 36 } },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_CITI, CITI_LIDAR],
    },
    excelsior: {
      label: 'Excelsior level (300s)',
      // Rows 1–12 (behind home 1–6), covered from row 5 by the 400 level
      // (sourced; 336 from row 6). Lidar: the 400s' front hangs over row
      // 2–3, so only a few rows show, in 4 of 42 sections: front row 46 ft
      // (41–46); in 312 and 314 that edge is over row 2, which they take.
      // Estimated: 25° rake (as before), the 400 deck's underside ~58 ft at
      // its edge (its measured 67-ft front row less 9 ft); over row 5, 60 ft
      // (61 over 336's row 6), 9 ft above the floor. What rises highest
      // behind is that front (69 ft, measured 19–26 ft in front of the last
      // row of 302, 312, 314 and 338: over their row 2–5); the shorter 316,
      // 320 (6 rows) and 326 (10) take it over the same row as the tier.
      stand: {
        deckFrontFt: 67,
        rows: 12,
        frontRowHeightFt: 46,
        rakeDeg: 25,
        backHeightFt: 69,
        backSetbackFt: -23,
        overhang: { coveredFromRow: 5, soffitHeightFt: 60 },
      },
      sections: {
        '312': { rows: 10, overhang: { coveredFromRow: 2, soffitHeightFt: 58 } },
        '314': { overhang: { coveredFromRow: 2, soffitHeightFt: 58 } },
        '316': { rows: 6, backSetbackFt: -7 },
        '320': { rows: 6, backSetbackFt: -7 },
        '326': { rows: 10, backSetbackFt: -18 },
        '336': { overhang: { coveredFromRow: 6, soffitHeightFt: 61 } },
        '338': { frontRowHeightFt: 41 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/306'), rysCiti('sections/312'), rysCiti('sections/316'), rysCiti('sections/326'), rysCiti('sections/333'), rysCiti('sections/336'), RYS_CITI, CITI_LIDAR],
    },
    fourHundred: {
      label: '400 level',
      // Rows 1–8 (behind home 1–5), open to the sky (sourced). Lidar (29 of
      // 37): front row 69 ft (68–69), 26° rake (17–32); what rises highest
      // behind is the Promenade roof, 129 ft up and 30 ft back (43–45 ft
      // behind 425, 434 and 436, measured).
      stand: { rows: 8, frontRowHeightFt: 69, rakeDeg: 26, backHeightFt: 129, backSetbackFt: 30 },
      sections: {
        '415': { rows: 5 }, '425': { rows: 5, backHeightFt: 129, backSetbackFt: 45 }, '437': { backHeightFt: 116, backSetbackFt: 43 },
        '434': { backHeightFt: 129, backSetbackFt: 43 }, '436': { backHeightFt: 127, backSetbackFt: 43 },
      },
      heightsSourced: true,
      coverSourced: true,
      sources: [rysCiti('sections/405'), rysCiti('sections/415'), rysCiti('sections/425'), rysCiti('sections/435'), RYS_CITI, CITI_LIDAR],
    },
    promenade: {
      label: 'Promenade level (500s)',
      // Rows 1–17, covered by the roof from row 11 (sourced; the lidar puts
      // its edge at row 10, and at row 8 in 503). Lidar (34 of 38): front
      // row 85 ft (79–87), 30° rake; the roof's front edge is 129 ft up and
      // the scan shows nothing below 128 ft there: a thin roof, underside
      // taken as 128 ft. Behind 534, 535 and 537, where the scan sees no
      // edge over the rows, what rises highest stands 12–37 ft behind the
      // last row (measured).
      stand: {
        rows: 17,
        frontRowHeightFt: 85,
        rakeDeg: 30,
        backHeightFt: 129,
        backSetbackFt: -16,
        overhang: { coveredFromRow: 11, soffitHeightFt: 128 },
      },
      sections: {
        '503': { overhang: { coveredFromRow: 8, soffitHeightFt: 128 } },
        '534': { backHeightFt: 129, backSetbackFt: 12 }, '535': { backHeightFt: 129, backSetbackFt: 37 }, '537': { backHeightFt: 127, backSetbackFt: 22 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/505'), rysCiti('sections/515'), rysCiti('sections/525'), rysCiti('sections/535'), RYS_CITI, CITI_LIDAR],
    },
    suite: {
      label: 'Clubs and suites',
      // Hidden from the air; estimated as before, with the ceiling 9 ft above
      // the floor and the deck above reaching past them as is typical.
      stand: { rows: 1, frontRowHeightFt: 55, rakeDeg: 0, backHeightFt: 66, overhang: { coveredFromRow: 1, soffitHeightFt: 64, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_CITI],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysCbp = (path: string) => `https://www.rateyourseats.com/citizens-bank-park/seating/${path}`;
const RYS_CBP = rysCbp('shaded-covered-seats');
/** The club's 3D seat map data: every section's rows and seats. */
const CBP_CLUB_MAP = 'https://vw-sitesbuilder.eu-west-1.staticresources.3ddvfactory.com/sitesbuilder/philadelphia-phillies/latest/master.json';
const cbpRange = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Seating ring of a Citizens Bank Park chart section. */
export function cbpTier(id: string): string | null {
  if (/^DUG[A-G]$/.test(id)) return 'dugoutBox';
  if (/^[A-G]$/.test(id)) return 'diamond';
  if (id === 'RB' || id === 'RBW') return 'bleachers';
  // Standing room, and a left-field box the club's data lists no seats for.
  if (/^\d+V$/.test(id)) return 'wheelchair';
  if (!/^\d+$/.test(id)) return null;
  const n = Number(id);
  if (n < 100) return 'suite';
  if (n <= 107) return 'rightField';
  if (n >= 112 && n <= 114) return 'fieldCoverUnsourced';
  if (n >= 119 && n <= 128) return 'homePlate';
  if (n <= 139) return 'field';
  if (n <= 148) return 'leftField';
  if (n <= 205) return 'rightField200';
  if (n <= 237) return 'twoHundred';
  if (n <= 245) return 'leftField200';
  if (n <= 310) return 'rightField300';
  if (n <= 399) return 'threeHundred';
  return 'terrace';
}

const CBP_LIDAR = 'USGS 3DEP lidar PA_17County_D24, flown 2024-12-17 to 2025-04-02 (scripts/measureStandHeights.py)';

// The 100 level, shared by its two tiers: rows 1–40, Rate Your Seats
// counting the deck above from row 36 (per section below). Lidar (21 of 22):
// front row at field level (-1 to 4 ft), 12° rake (11–12); what rises
// highest behind is the 200 level's front, 70 ft up over the back rows. The
// 200 deck's edge reaches out over row 28 (21–34), so the rows from there
// back are covered; the lowest structure at that edge is 35 ft up (26–44),
// taken as its underside.
const CBP_FIELD: StandProfile = {
  rows: 40,
  frontRowHeightFt: 0,
  rakeDeg: 12,
  backHeightFt: 70,
  backSetbackFt: -8,
  overhang: { coveredFromRow: 28, soffitHeightFt: 35 },
};

/**
 * Citizens Bank Park (2004). A lower bowl (dugout boxes, the Diamond Club and
 * the 100s), the 200 level with the Hall of Fame Club, suites, the 300s and
 * the Terrace Deck (400s) under the roof from row 9. Right field stacks
 * three decks (100s, 200s, 300s); left field has the 100s and 200s under the
 * main scoreboard. Rows are the club's own seat-map data; which rows are
 * covered is from Rate Your Seats' section pages (row numbers converted to
 * each section's row count, so a section that starts at row 21 counts row 21
 * as its first).
 *
 * Heights are measured on USGS airborne lidar (CBP_LIDAR), as at Dodger
 * Stadium: for each section a cut straight back through its rows gives the
 * front row's height, the rake and the structure that rises highest behind
 * as seen from the middle uncovered row; tier values are medians, sections
 * more than 10% (at least 3 ft) off get their own. The light towers above
 * the roof and the left-field scoreboard (a board up on one pylon, which
 * light passes under) are not counted as walls. Deck undersides the scan
 * cannot see are estimated as 9 ft above the floor of the first covered row;
 * the Terrace and right-field roofs show nothing below their top edge, so
 * they are taken as thin roofs. Covered rows: where the scan puts a deck's
 * edge more than two rows from the source's row, the scan's edge is used,
 * with the lowest structure seen at it (or the deck above's front row less
 * the 9 ft this park's decks measure) as the underside.
 */
const CBP: StadiumStructure = {
  stadiumId: 'phillies',
  // Far rim (lidar): the stands' roof line, median over sections 133 ft (the
  // Terrace Deck roof); crossing: the median distance from a section to what
  // rises highest across the field, 590 ft.
  park: { roof: 'open', farRimHeightFt: 133, fieldCrossingFt: 590 },
  tierOf: cbpTier,
  tiers: {
    dugoutBox: {
      label: 'Dugout boxes',
      // Rows 1–3 at the front of the bowl behind home, uncovered. Lidar: in
      // the cut they and the Diamond Club are one slope (measured through
      // the Diamond Club's sections): front row 1 ft below the field, 11°
      // rake; what rises highest behind is the Terrace Deck roof, 133 ft up.
      stand: { rows: 3, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 133, backSetbackFt: 143 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, CBP_LIDAR],
    },
    diamond: {
      label: 'Diamond Club (A–G)',
      // Rows 5–19, uncovered (sourced). Lidar (6 of 6): the slope from the
      // dugout boxes' front row (1 ft below the field) at 11° (10–13) puts
      // row 5 at ~1 ft; behind, the Terrace Deck roof, 133 ft up and 99 ft
      // back (84–88 ft behind A and G, measured).
      stand: { rows: 15, frontRowHeightFt: 1, rakeDeg: 11, backHeightFt: 133, backSetbackFt: 99 },
      sections: { 'A': { backHeightFt: 133, backSetbackFt: 88 }, 'G': { backHeightFt: 132, backSetbackFt: 84 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/A'), rysCbp('sections/C'), rysCbp('sections/E'), rysCbp('sections/G'), CBP_LIDAR],
    },
    homePlate: {
      label: 'Field level behind home (119–128)',
      // Rows 21–34 behind the Diamond Club, covered from row 29 or 30
      // (sourced; the lidar puts the 200 level's edge at the 7th–9th row
      // too, and at the 3rd in 121, which takes it). Lidar (9 of 10): row 21
      // at 13 ft (11–19; 122 and 125 start at row 24), 13° rake; what rises
      // highest behind is the 200 level's front (45 ft; 30–70). The lowest
      // structure at that deck's edge is 35 ft up (29 ft over 121), taken as
      // its underside.
      stand: { rows: 14, frontRowHeightFt: 13, rakeDeg: 13, backHeightFt: 45, backSetbackFt: -11, deckFrontFt: 44, overhang: { coveredFromRow: 9, soffitHeightFt: 35 } },
      sections: {
        '119': { overhang: { coveredFromRow: 11, soffitHeightFt: 35 } }, // rows 21–31, covered from 31
        '120': { backHeightFt: 70, backSetbackFt: -11 },
        '121': { backHeightFt: 30, backSetbackFt: -26, overhang: { coveredFromRow: 3, soffitHeightFt: 29 } },
        '122': { overhang: { coveredFromRow: 7, soffitHeightFt: 35 } }, // rows 24–34, from 30
        '123': { overhang: { coveredFromRow: 10, soffitHeightFt: 35 } },
        '124': { overhang: { coveredFromRow: 10, soffitHeightFt: 35 } },
        '125': { frontRowHeightFt: 19, backHeightFt: 40, backSetbackFt: 25, overhang: { coveredFromRow: 7, soffitHeightFt: 35 } }, // rows 24–34, from 30
        '126': { backHeightFt: 70, backSetbackFt: 7 },
        '127': { backHeightFt: 70, backSetbackFt: -11 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['119', '120', '122', '124', '126', '128'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    field: {
      label: 'Field level (100s)',
      stand: { ...CBP_FIELD, deckFrontFt: 44 },
      // Sections whose measured back stands more than 10 ft nearer or
      // farther take their own: the 200 level's front 21–44 ft in front of
      // the last row of 115, 132, 137 and 138, 12 and 39 ft in front of
      // 108's and 109's.
      sections: withBacks({
        '108': { frontRowHeightFt: 4, backHeightFt: 45, backSetbackFt: -25, overhang: { coveredFromRow: 21, soffitHeightFt: 35 } }, // rows 11–35
        '109': { backHeightFt: 45, backSetbackFt: -25, overhang: { coveredFromRow: 23, soffitHeightFt: 35 } },
        ...Object.fromEntries(['110', '111'].map((id) => [id, { backHeightFt: 117, backSetbackFt: 32 }])),
        '115': { overhang: { coveredFromRow: 28, soffitHeightFt: 30 } },
        '116': { backHeightFt: 133, backSetbackFt: 47 },
        '118': { overhang: { coveredFromRow: 25, soffitHeightFt: 35 } },
        '129': { overhang: { coveredFromRow: 23, soffitHeightFt: 30 } },
        '133': { backHeightFt: 133, backSetbackFt: 47, overhang: { coveredFromRow: 31, soffitHeightFt: 30 } },
        '134': { backHeightFt: 133, backSetbackFt: 47, deckFrontFt: undefined, overhang: { coveredFromRow: 34, soffitHeightFt: 28 } }, // 9 ft above row 34's floor; something lower than the deck at its edge
        // RYS covers only the wheelchair row behind row 37; the lidar puts
        // the deck's edge over row 34.
        '135': { backHeightFt: 133, backSetbackFt: 47, overhang: { coveredFromRow: 34, soffitHeightFt: 35 } },
        '136': { overhang: { coveredFromRow: 30, soffitHeightFt: 35 } },
        '138': { frontRowHeightFt: 4, overhang: { coveredFromRow: 21, soffitHeightFt: 35 } },
        // Rows 11–37, covered from 33; not found in the scan, so row 11 is
        // put on the measured slope and the source's covered row kept.
        '139': { frontRowHeightFt: 6, overhang: { coveredFromRow: 23, soffitHeightFt: 35 } },
      }, {
        '108': [45, -12], '109': [45, -39], '115': [70, -21], '132': [70, -21], '137': [70, -21], '138': [70, -44],
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['108', '110', '115', '117', '118', '129', '131', '132', '134', '135', '137', '139'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    fieldCoverUnsourced: {
      label: 'Field level (100s)',
      // 112–114: Rate Your Seats gives no covered rows for these three; the
      // lidar puts the 200 level's edge over row 34 (112, 113) and 30 (114).
      // Rows from the club's data; stand as the rest of the 100s (the lidar
      // agrees: front row 1 ft below the field, 12°). Behind 112's 37 rows
      // the 200 level's front stands 24 ft back, in 114 19 ft in front of
      // the last row (measured).
      stand: { ...CBP_FIELD, deckFrontFt: 44 },
      sections: {
        '112': { backHeightFt: 69, backSetbackFt: 24, overhang: { coveredFromRow: 34, soffitHeightFt: 35 } },
        '113': { overhang: { coveredFromRow: 34, soffitHeightFt: 35 } },
        '114': { backHeightFt: 70, backSetbackFt: -19 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/112'), rysCbp('sections/113'), rysCbp('sections/114'), CBP_LIDAR],
    },
    rightField: {
      label: 'Right-field seats (101–107)',
      // Rows 1–17, covered by the 200 level from row 11 (sourced; the lidar
      // puts its edge at row 9–11; 101 has 7 open rows, 107 rows 4–16
      // covered from 14). Lidar (6 of 7): front row 10 ft above the wall
      // (9–10), 13° rake; what rises highest behind is the 200 level's
      // front, 45 ft up. Its underside: that front row less this park's
      // measured deck depth (9 ft), ~35 ft. The 200 level ends at 101: its
      // front stands 6 ft behind 101's last row at the side next to 102,
      // and nothing near behind the rest; through its middle, what rises
      // highest is 72 ft up, 121 ft behind (its cut, on a point the tool's
      // line from home misses).
      stand: { rows: 16, frontRowHeightFt: 10, rakeDeg: 13, backHeightFt: 45, backSetbackFt: -19, deckFrontFt: 44, overhang: { coveredFromRow: 11, soffitHeightFt: 35 } },
      sections: {
        '101': { noCover: true, backHeightFt: 72, backSetbackFt: 121 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['101', '102', '104', '106', '107'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    leftField: {
      label: 'Left-field seats (140–148)',
      // Rows 1–24; Rate Your Seats covers 142–145 from row 20 and calls the
      // rest open. Lidar (9 of 9): front row 8 ft above the wall (8–12), 13°
      // rake; the 200 level's edge reaches out over row 16 (13 in 145; also
      // over 141, and over row 8 of 148), so the rows from there back are
      // covered; that edge is what rises highest behind (39 ft). Its
      // underside: the 200 level's 37-ft front row less 9 ft, ~28 ft.
      stand: { rows: 23, frontRowHeightFt: 8, rakeDeg: 13, backHeightFt: 39, backSetbackFt: -16, deckFrontFt: 37, overhang: { coveredFromRow: 16, soffitHeightFt: 28 } },
      sections: {
        '140': { noCover: true, backHeightFt: 49, backSetbackFt: 30 }, // rows 7–21
        '145': { overhang: { coveredFromRow: 13, soffitHeightFt: 33 } },
        '146': { noCover: true, backHeightFt: 43, backSetbackFt: 43 },
        '147': { noCover: true, backHeightFt: 25, backSetbackFt: -5 }, // rows 4–18
        '148': { frontRowHeightFt: 12, backHeightFt: 25, backSetbackFt: -5, overhang: { coveredFromRow: 8, soffitHeightFt: 25 } }, // rows 5–16
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['140', '141', '142', '143', '145', '146', '147', '148'].map((n) => rysCbp(`sections/${n}`)), CBP_LIDAR],
    },
    rightField200: {
      label: '200 level, right field (201–205)',
      // Rows 1–13, covered by the 300 level from row 10 (sourced; the lidar
      // puts its edge at row 8). Lidar (5 of 5): front row 45 ft (44–45), 25°
      // rake; what rises highest behind is the 300 level's front, 70 ft up.
      // Its underside: that front row less 9 ft (~62 ft) would be under row
      // 10's heads, so 9 ft above row 10's floor, ~66 ft.
      stand: { rows: 12, frontRowHeightFt: 45, rakeDeg: 25, backHeightFt: 70, backSetbackFt: -14, deckFrontFt: 69, overhang: { coveredFromRow: 10, soffitHeightFt: 66 } },
      sections: { '201': { backHeightFt: 96, backSetbackFt: 111 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/201'), rysCbp('sections/203'), rysCbp('sections/205'), CBP_LIDAR],
    },
    twoHundred: {
      label: '200 level and Hall of Fame Club',
      // Rows 1–12. Rate Your Seats counts them covered by the suite level
      // from row 7 (206–209 from row 9, behind home 220 from row 6 and
      // 221–224 from row 5; 210, 211 and 227 none). Lidar (24 of 32): front
      // row 44 ft (42–45), 24° rake (19–25); the 300 level's front reaches
      // out over row 3 (1–8; below by section), so the rows from there back
      // are covered, and it is what rises highest behind (70 ft). Its
      // underside: the 300 level's 69-ft front row less 9 ft, ~60 ft (63 ft
      // behind home, where that front row is 72 ft; over 216 the scan sees a
      // face, 54 ft up; 62 ft over 206 and 208, 9 ft above row 8's floor).
      stand: { rows: 10, frontRowHeightFt: 44, rakeDeg: 24, backHeightFt: 70, backSetbackFt: -14, deckFrontFt: 69, overhang: { coveredFromRow: 3, soffitHeightFt: 60 } },
      sections: {
        ...Object.fromEntries(['206', '208'].map((n) => [n, { overhang: { coveredFromRow: 8, soffitHeightFt: 62 } }])),
        ...Object.fromEntries(['207', '209'].map((n) => [n, { overhang: { coveredFromRow: 7, soffitHeightFt: 60 } }])),
        '210': { noCover: true, backHeightFt: 69, backSetbackFt: 2 }, // its 12 rows open: the 300 level's front 2 ft behind them
        '211': { noCover: true },
        '216': { overhang: { coveredFromRow: 1, soffitHeightFt: 54 } },
        '219': { overhang: { coveredFromRow: 5, soffitHeightFt: 60 } },
        ...Object.fromEntries(cbpRange(220, 224).map((n) => [n, { overhang: { coveredFromRow: 5, soffitHeightFt: 63 } }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['207', '209', '211', '212', '216', '220', '222', '226', '228', '232', '233', '237'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    leftField200: {
      label: '200 level, left field (241–245)',
      // Rows 1–11, open (sourced). Lidar (5 of 5): front row 38 ft (35–38),
      // 22° rake; what rises highest behind is the building behind them,
      // 56 ft up (49–67). The main scoreboard above them is a board on one
      // pylon, 166–195 ft up, which light passes under.
      stand: { rows: 11, frontRowHeightFt: 38, rakeDeg: 22, backHeightFt: 56, backSetbackFt: 16 },
      sections: { '241': { backHeightFt: 67, backSetbackFt: 52 }, '244': { backHeightFt: 49, backSetbackFt: 1 }, '245': { backHeightFt: 53, backSetbackFt: 135 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/241'), rysCbp('sections/243'), rysCbp('sections/245'), CBP_LIDAR],
    },
    suite: {
      label: 'Suites',
      // Hidden from the air; estimated between the measured 200 level (its
      // back ~55 ft) and the 300 level's 69-ft front, the underside 9 ft
      // above the suite seats. They sit behind the 200 level's last row, under
      // the 300 level, whose front reaches out over the 200 level's row 3:
      // 22 ft past them.
      stand: { rows: 2, frontRowHeightFt: 55, rakeDeg: 5, backHeightFt: 69, overhang: { coveredFromRow: 1, soffitHeightFt: 64, reachFt: 22 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('luxury-suites'), CBP_LIDAR],
    },
    rightField300: {
      label: '300 level, right field (301–310)',
      // Rows 1–21. Rate Your Seats counts them under the roof from row 14.
      // Lidar (9 of 10): front row 69 ft (66–70), 29° rake; the roof's edge
      // reaches out over row 11 (14–15 in 305 and 306), so the rows from
      // there back are covered; its top, 117 ft up, is what rises highest
      // behind, and the scan sees nothing below it there: a thin roof,
      // underside taken as 117 ft.
      stand: { rows: 21, frontRowHeightFt: 69, rakeDeg: 29, backHeightFt: 117, backSetbackFt: -26, overhang: { coveredFromRow: 11, soffitHeightFt: 117 } },
      sections: {
        '301': { backHeightFt: 19, backSetbackFt: 196 },
        '302': { backHeightFt: 87, backSetbackFt: -26 },
        '305': { backHeightFt: 117, backSetbackFt: -16, overhang: { coveredFromRow: 14, soffitHeightFt: 117 } },
        '306': { backHeightFt: 117, backSetbackFt: -8, overhang: { coveredFromRow: 15, soffitHeightFt: 117 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['301', '303', '305', '307', '310'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    threeHundred: {
      label: '300 level (312–333)',
      // Rows 1–8, open (sourced). Lidar (21 of 22): front row 69 ft (68–75),
      // 31° rake; what rises highest behind is the Terrace Deck roof, 133 ft
      // up and 25 ft back (40 ft behind 330; 90 ft behind 314, 315 and 333).
      stand: { rows: 8, frontRowHeightFt: 69, rakeDeg: 31, backHeightFt: 133, backSetbackFt: 25 },
      sections: {
        ...Object.fromEntries(['314', '315', '333'].map((id) => [id, { backHeightFt: 90, backSetbackFt: 2 }])),
        '330': { backHeightFt: 133, backSetbackFt: 40 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['313', '315', '318', '320', '324', '328', '331', '333'].map((n) => rysCbp(`sections/${n}`)), CBP_LIDAR],
    },
    terrace: {
      label: 'Terrace Deck (400s)',
      // Rows 1–16 (434: 13). Rate Your Seats counts them under the roof from
      // row 9. Lidar (23 of 23): front row 90 ft (87–91), 33° rake; the
      // roof's edge reaches out over row 6 (9 in 430), so the rows from there
      // back are covered; its top is 133 ft up and the scan sees nothing
      // below 132 ft there: a thin roof, underside taken as 132 ft.
      stand: { rows: 16, frontRowHeightFt: 90, rakeDeg: 33, backHeightFt: 133, backSetbackFt: -25, overhang: { coveredFromRow: 6, soffitHeightFt: 132 } },
      sections: { '414': { backHeightFt: 92, backSetbackFt: 50 }, '430': { overhang: { coveredFromRow: 9, soffitHeightFt: 132 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['412', '415', '418', '420', '424', '428', '432', '434'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    wheelchair: {
      label: 'Wheelchair platforms',
      // One row each (the club's data): 412V–432V are row 9 of the Terrace
      // Deck, 302V–309V row 11 of the right-field 300s; both are under their
      // roofs (the lidar puts the roofs' edges over rows 6 and 11). Heights
      // are those rows' on the measured stands.
      stand: { rows: 1, frontRowHeightFt: 104, rakeDeg: 33, backHeightFt: 133, backSetbackFt: 19, overhang: { coveredFromRow: 1, soffitHeightFt: 132 } },
      sections: Object.fromEntries(cbpRange(302, 309).map((n) => [
        `${n}V`,
        { frontRowHeightFt: 84, rakeDeg: 29, backHeightFt: 117, backSetbackFt: 27, overhang: { coveredFromRow: 1, soffitHeightFt: 117 } },
      ])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/305'), rysCbp('sections/415'), CBP_LIDAR],
    },
    bleachers: {
      label: 'Rooftop bleachers',
      // Open rooftop rows beyond center field (the club's 3D map; RB 7 rows,
      // RBW 1). Lidar (RB): front row 39 ft, 20° rake; behind, a 46-ft wall
      // just behind the last row.
      stand: { rows: 7, frontRowHeightFt: 39, rakeDeg: 20, backHeightFt: 46, backSetbackFt: 1 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, CBP_LIDAR],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysTruist = (path: string) => `https://www.rateyourseats.com/truist-park/seating/${path}`;
const RYS_TRUIST = rysTruist('shaded-covered-seats');
const truistSections = (...ids: string[]) => ids.map((n) => rysTruist(`sections/${n}`));

/** Seating ring of a Truist Park chart section. */
export function truistTier(id: string): string | null {
  // Club tables (T) and Lexus Premium Boxes (B): no source says what covers them.
  if (!/^\d+$/.test(id)) return null;
  const n = Number(id);
  if (n <= 9) return 'clubBoxes';
  if (n >= 17 && n <= 34) return 'fieldInfield';
  if (n <= 42) return 'fieldBoxes';
  if (n <= 109) return 'rightCorner';
  if (n === 120 || n === 131) return 'hundredCoverUnsourced';
  if (n >= 123 && n <= 128) return 'executive';
  if (n <= 143) return 'hundred';
  if (n <= 145) return 'leftCorner';
  if (n <= 151) return 'homeRunPorch';
  if (n <= 155 || n === 252) return 'pen';
  if (n <= 160) return 'chopHouse';
  if (n <= 212) return 'twoHundredCorner';
  if (n >= 220 && n <= 231) return 'xfinityClub';
  if (n >= 244 && n <= 246) return 'terrace';
  if (n <= 243) return 'twoHundred';
  if (n >= 324 && n <= 328) return 'vistaHome';
  if (n >= 344 && n <= 347) return 'threeCorner';
  if (n <= 343) return 'threeHundred';
  if (n <= 412) return 'fourHundredOpen';
  return 'fourHundred';
}

const TRUIST_LIDAR = 'USGS 3DEP lidar GA_Statewide_B2_2018, flown 2019-04-18 (scripts/measureStandHeights.py)';

// The 100s along the lines: rows 1–20, under the 200 level from row 8
// (sourced). Lidar (10 of 17): front row 10 ft (6–10), 13° rake (13–22). The
// 200 level's front, 35 ft up, reaches out over row 6–8 (agreeing with the
// source); its underside is taken as that front row less 9 ft, 26 ft. What
// rises highest behind is the roof canopy, 153 ft up over the back row.
const TRUIST_100: StandProfile = {
  rows: 20,
  frontRowHeightFt: 10,
  rakeDeg: 13,
  backHeightFt: 153,
  backSetbackFt: 1,
  overhang: { coveredFromRow: 8, soffitHeightFt: 26 },
};

/**
 * Truist Park (2017). Field rows and the 100s form the lower bowl, then the
 * 200 level (club), the 300s (Vista) and the 400s (Grandstand) stacked under
 * a roof canopy that covers the 400s from the first row. The site is tight,
 * so the decks stack high. Rows and covered rows are Rate Your Seats'
 * section pages (row labels converted to counts on the seat map).
 *
 * Heights are measured on USGS airborne lidar (TRUIST_LIDAR), as at Citizens
 * Bank Park: for each section a cut straight back through its rows gives the
 * front row's height, the rake and the structure that rises highest behind
 * as seen from the middle uncovered row; tier values are medians, sections
 * more than 10% (at least 3 ft) off get their own. Every deck is lower than
 * the stacking estimates: the 200 level's front is 36 ft (was 48), the
 * 300s' 68 ft (82). The canopy, about 150 ft up, hides the 400s and the
 * 300s' back rows from the air, and reaches out over the 200 and 300
 * levels' back rows; its edge is not the deck over those rows (that deck is
 * under it, unseen), so their sourced covered rows stay and the canopy
 * counts as what rises behind them. Deck undersides the scan cannot see are
 * taken as the deck above's measured front row less 9 ft, and never less
 * than 9 ft above the first covered row's floor. Covered rows: where the
 * scan puts an edge more than two rows from the source's, the scan's edge is
 * used, with the lowest structure seen at it as the underside. Sections the
 * scan does not find (the chart puts several corner sections' cuts under the
 * canopy or on other stands) keep estimates, re-taken from the decks
 * measured around them.
 */
const TRUIST: StadiumStructure = {
  stadiumId: 'braves',
  // Far rim (lidar): the stands' roof line, median over sections 150 ft (the
  // canopy); crossing: the median distance from a section to what rises
  // highest across the field, 591 ft.
  park: { roof: 'open', farRimHeightFt: 150, fieldCrossingFt: 591 },
  tierOf: truistTier,
  tiers: {
    clubBoxes: {
      label: 'Truist Club boxes (1–9)',
      // Rows 1–4 or 1–5 at the backstop, uncovered. Lidar (8 of 9): front
      // row 2 ft (-1 to 2; 8 at -1), 11° rake (8–15); what rises highest
      // behind is the canopy, 150 ft up and 83 ft behind the last row (98 ft
      // behind 8 and 9; over 8 a lamp bank on it, 160 ft).
      stand: { rows: 4, frontRowHeightFt: 2, rakeDeg: 11, backHeightFt: 150, backSetbackFt: 83 },
      sections: { '8': { frontRowHeightFt: -1, backHeightFt: 160, backSetbackFt: 98 }, '9': { backHeightFt: 150, backSetbackFt: 98 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('1', '5', '9'), TRUIST_LIDAR],
    },
    fieldInfield: {
      label: 'Field level (17–34)',
      // Rows 6–13 behind the dugouts and the club boxes, uncovered. Lidar (17
      // of 18): row 6 at 2 ft (0–3), 11° rake (10–15); behind, the canopy,
      // 151 ft up and 65 ft back.
      stand: { rows: 8, frontRowHeightFt: 2, rakeDeg: 11, backHeightFt: 151, backSetbackFt: 65 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('17', '22', '25', '30', '34'), TRUIST_LIDAR],
    },
    fieldBoxes: {
      label: 'Field level (10–16, 35–42)',
      // Rows 1–13 (1–15 in 10 and 42), uncovered. Lidar (9 of 15): front row
      // at field level (-1 to 3; 10 at 3), 11° rake (8–15); behind, the
      // canopy, 149 ft up and 68 ft back (in 10 and 11, by the right-field
      // corner, the 300 level's corner, 92–103 ft).
      stand: { rows: 13, frontRowHeightFt: 0, rakeDeg: 11, backHeightFt: 149, backSetbackFt: 68 },
      sections: {
        '10': { frontRowHeightFt: 3, backHeightFt: 92, backSetbackFt: 58 },
        '11': { backHeightFt: 103, backSetbackFt: 88 },
        '39': { backHeightFt: 149, backSetbackFt: 80 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('10', '12', '16', '35', '42'), TRUIST_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      // Rows 1–20; 110–118, 122, 130 and 133–143 are under cover from row 8.
      // The canopy stands 15–21 ft behind the last row of 122 and 141
      // (measured).
      stand: { ...TRUIST_100, deckFrontFt: 35 },
      sections: {
        ...Object.fromEntries(['135', '137'].map((id) => [id, { frontRowHeightFt: 6 }])),
        '122': { frontRowHeightFt: 6, backHeightFt: 150, backSetbackFt: 15 },
        '140': { backHeightFt: 35, backSetbackFt: -39 },
        '141': { backHeightFt: 149, backSetbackFt: 21 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('110', '114', '118', '122', '130', '133', '138', '143'), TRUIST_LIDAR],
    },
    hundredCoverUnsourced: {
      label: 'Field level (100s)',
      // 120 and 131: Rate Your Seats says only that their back rows (7+,
      // 16+) are shaded late in the afternoon, not which rows are covered;
      // the lidar puts the 200 level's edge over row 7–8 (both measured), as
      // in the rest of the 100s.
      stand: { ...TRUIST_100, deckFrontFt: 35 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...truistSections('120', '131'), TRUIST_LIDAR],
    },
    executive: {
      label: 'Executive seats (123–128)',
      // Rows 1–11 behind home under the club level; no source gives the
      // covered rows (only "rows 8+ shaded late afternoon"). Lidar (6 of 6):
      // front row 8 ft (6–10), 17° rake (13–21); the 200 level's front, 35 ft
      // up, reaches out over row 6–8, so the rows from 8 back are covered,
      // under an underside of ~26 ft (that front row less 9 ft). Behind, the
      // canopy, 151 ft up and 26 ft back (43 ft behind 124).
      stand: { rows: 11, frontRowHeightFt: 8, rakeDeg: 17, backHeightFt: 151, backSetbackFt: 26, deckFrontFt: 34, overhang: { coveredFromRow: 8, soffitHeightFt: 26 } },
      sections: { '124': { backHeightFt: 149, backSetbackFt: 43 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...truistSections('123', '125', '127', '128'), TRUIST_LIDAR],
    },
    rightCorner: {
      label: 'Right-field corner (107–109)',
      // 107 rows 1–8 and 109 rows 1–6 open; 108 (rows 1–10) all under
      // cover. Not found on the lidar (the chart's bearings miss them).
      // Estimated: front ~15 ft, 22° rake, the 200-level corner (~44 ft)
      // behind.
      stand: { rows: 8, frontRowHeightFt: 15, rakeDeg: 22, backHeightFt: 44 },
      sections: { '108': { overhang: { coveredFromRow: 1, soffitHeightFt: 30 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('107', '108', '109'),
    },
    leftCorner: {
      label: 'Left-field corner (144–145)',
      // Rows 9–27; Rate Your Seats says row 12 sits under the 200 level's
      // overhang but its two statements disagree on how many rows, so the
      // check tries both. Not found on the lidar. Estimated: front ~12 ft,
      // 22° rake.
      stand: { rows: 19, frontRowHeightFt: 12, rakeDeg: 22, backHeightFt: 44, overhang: { coveredFromRow: 4, soffitHeightFt: 40 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('144', '145'),
    },
    homeRunPorch: {
      label: 'Home Run Porch (146–151)',
      // Rows 1–27 or 1–29, uncovered ("significant sun exposure"). Lidar (5
      // of 6): front row 7 ft (6–9), 13° rake; behind, the porch's back
      // structure, 41 ft up (38–100; 25–27 ft behind 149 and 150). Over
      // 151's rows 25 and up a building
      // reaches out, its lowest point at the edge 43 ft up, so those rows
      // are covered. (Over 147's front rows a bridge; its seats show
      // uncovered past it.)
      stand: { rows: 29, frontRowHeightFt: 7, rakeDeg: 13, backHeightFt: 41, backSetbackFt: 14 },
      sections: {
        '148': { backHeightFt: 100, backSetbackFt: 9 },
        '149': { backHeightFt: 41, backSetbackFt: 25 },
        '150': { backHeightFt: 40, backSetbackFt: 27 },
        '151': { backHeightFt: 80, backSetbackFt: 0, overhang: { coveredFromRow: 25, soffitHeightFt: 43 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...truistSections('146', '148', '151'), RYS_TRUIST, TRUIST_LIDAR],
    },
    pen: {
      label: 'The Pen (152–155)',
      // Rows 7–24 or 1–24, uncovered. Lidar (4 of 5): front row 21 ft (15 in
      // 155), 20° rake; behind, 60 ft up and 35 ft back (44–175). Over the
      // back rows of 152–153 a frame ~43 ft up, which the scan sees the seats
      // through (not a deck); over 153 its top, 56 ft, is what the scan
      // finds rising highest, so 153 keeps the tier's back (the frame is not
      // a wall either). 154 sees 63 ft, 70 ft back (measured).
      stand: { rows: 24, frontRowHeightFt: 21, rakeDeg: 20, backHeightFt: 60, backSetbackFt: 35 },
      sections: {
        '152': { backHeightFt: 175, backSetbackFt: 81 },
        '154': { backHeightFt: 63, backSetbackFt: 70 },
        '155': { frontRowHeightFt: 15, backHeightFt: 44, backSetbackFt: 1 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...truistSections('152', '154', '155'), TRUIST_LIDAR],
    },
    chopHouse: {
      label: 'Chop House (156–160)',
      // Rows 1–5 past the right-field wall, uncovered. Lidar (4 of 5): front
      // row 15 ft (15–17), 20° rake (18–21); the Chop House behind, 55 ft up
      // (44–92).
      stand: { rows: 5, frontRowHeightFt: 15, rakeDeg: 20, backHeightFt: 55, backSetbackFt: 16 },
      sections: {
        '159': { backHeightFt: 44, backSetbackFt: 2 },
        '160': { backHeightFt: 92, backSetbackFt: 62 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...truistSections('156', '158', '160'), TRUIST_LIDAR],
    },
    twoHundredCorner: {
      label: '200 level, right-field corner (210–212)',
      // Rows 1–12. Left out of Rate Your Seats' covered list, yet its 212
      // page calls them shaded seats for a day game, so the check tries
      // them with and without a deck overhead (the scan sees only the canopy
      // over their last row or two). Lidar (3 of 3): front row 35 ft
      // (34–38), 23° rake; behind, the canopy, 150 ft up (in 210 the 300
      // level's corner, 92 ft; 4 ft behind 212's last row).
      stand: { rows: 12, frontRowHeightFt: 35, rakeDeg: 23, backHeightFt: 150, backSetbackFt: 20 },
      sections: { '210': { backHeightFt: 92, backSetbackFt: 20 }, '212': { backHeightFt: 150, backSetbackFt: 4 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: false,
      sources: [...truistSections('210', '211', '212'), TRUIST_LIDAR],
    },
    twoHundred: {
      label: '200 level',
      // Rows 1–19; 213–218 and 233–243 under cover from row 14 (sourced; the
      // lidar sees the 300 level's front over row 12–15 where the canopy
      // does not hide it). Lidar (10 of 15): front row 36 ft (35–36), 24°
      // rake; behind, the canopy, 150 ft up. The 300 level's underside: its
      // measured 68-ft front row less 9 ft is under row 14's heads, so 9 ft
      // above row 14's floor, 61 ft. (In 243 the canopy's edge stands 4 ft in
      // front of the last row, in 238 24 ft, 157 ft up, over its rows 11–13
      // where the scan also sees the 300 level's front from row 11; measured.)
      stand: { rows: 19, frontRowHeightFt: 36, rakeDeg: 24, backHeightFt: 150, backSetbackFt: -16, deckFrontFt: 67, overhang: { coveredFromRow: 14, soffitHeightFt: 61 } },
      sections: { '243': { backHeightFt: 153, backSetbackFt: -4 }, '238': { backHeightFt: 157, backSetbackFt: -24 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('213', '214', '215', '239', '243'), TRUIST_LIDAR],
    },
    xfinityClub: {
      label: 'Xfinity Club (220–231)',
      // Rows 1–7 (220: 1–12, 231: 1–11) in front of the club's tables; no
      // source gives covered rows, so the check tries both (the scan sees
      // only the canopy over 220's and 231's last rows). Lidar (9 of 11):
      // front row 36 ft (35–36), 24° rake; behind, the canopy, 151 ft up
      // (2 ft behind 220's last row). Its edge is over 231's last row, just
      // in front of that row's head: so that row is covered (as at Nationals
      // Park's Gallery), under its lowest structure there, 154 ft.
      stand: { rows: 7, frontRowHeightFt: 36, rakeDeg: 24, backHeightFt: 151, backSetbackFt: 14 },
      sections: {
        '220': { backHeightFt: 150, backSetbackFt: 2 },
        '231': { backHeightFt: 157, backSetbackFt: -2, overhang: { coveredFromRow: 11, soffitHeightFt: 154 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: false,
      sources: [...truistSections('220', '222', '225', '231'), TRUIST_LIDAR],
    },
    terrace: {
      label: 'Hank Aaron Terrace (244–246)',
      // Rows 1–3 or 1–5, uncovered. Not found on the lidar. Estimated as the
      // 200 level's measured front (36 ft), the 300 level's (68 ft) behind.
      stand: { rows: 5, frontRowHeightFt: 36, rakeDeg: 10, backHeightFt: 68, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('244', '245', '246'),
    },
    threeHundred: {
      label: '300 level (Vista)',
      // Rows 1–13; 312–323 and 329–343 under cover from row 10 (sourced; the
      // 400 level over them is hidden under the canopy). Lidar (8 of 21):
      // front row 68 ft, 28° rake; behind, the canopy, 149 ft up. The 400
      // level's underside, unseen: 9 ft above row 10's floor, 90 ft.
      stand: { rows: 13, frontRowHeightFt: 68, rakeDeg: 28, backHeightFt: 149, backSetbackFt: -22, overhang: { coveredFromRow: 10, soffitHeightFt: 90 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('312', '318', '323', '329', '337', '343'), TRUIST_LIDAR],
    },
    vistaHome: {
      label: 'Vista home plate (324–328)',
      // Rows 1–7 behind home; no source gives covered rows (the scan sees
      // only the canopy over them). Lidar (5 of 5): front row 68 ft, 27°
      // rake; behind, the canopy, 150 ft up.
      stand: { rows: 7, frontRowHeightFt: 68, rakeDeg: 27, backHeightFt: 150, backSetbackFt: -7 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: false,
      sources: [...truistSections('324', '325', '326'), TRUIST_LIDAR],
    },
    threeCorner: {
      label: '300 level, left-field corner (344–347)',
      // Rows 1–13; left out of Rate Your Seats' covered list, which stops
      // at 343, but no source says they are open, so the check tries both.
      // Not measured (one cut runs along the steps, the others miss).
      // Estimated as the 300 level's measured front and rake, the canopy
      // behind.
      stand: { rows: 13, frontRowHeightFt: 68, rakeDeg: 28, backHeightFt: 149, backSetbackFt: -22 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [RYS_TRUIST, ...truistSections('344', '345', '347'), TRUIST_LIDAR],
    },
    fourHundredOpen: {
      label: '400 level, right-field corner (410–412)',
      // Rows 1–12, outside the canopy (sourced: not covered; a reviewer
      // in 411: "no shade at all"). Not found on the lidar (the chart puts
      // their cuts under the canopy). Estimated as the 400 level: front
      // ~99 ft, 32° rake.
      stand: { rows: 12, frontRowHeightFt: 99, rakeDeg: 32, backHeightFt: 132 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('410', '411', '412'),
    },
    fourHundred: {
      label: '400 level (Grandstand)',
      // Rows 1–12, all under the roof canopy (sourced, 413–444). Hidden from
      // the air. Estimated: its front row ~99 ft (its deck's underside over
      // the 300s, 90 ft, plus 9 ft), 32° rake. The canopy (lidar): its edge
      // 150 ft up, and nothing seen below it there, so a thin roof; that
      // edge is over the 300s' front row, so it reaches ~25 ft past the 400s'
      // front row (over the 300s' row 10, where the 400 deck starts).
      stand: { rows: 12, frontRowHeightFt: 99, rakeDeg: 32, backHeightFt: 150, overhang: { coveredFromRow: 1, soffitHeightFt: 150, reachFt: 25 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('413', '420', '426', '433', '437', '444'), TRUIST_LIDAR],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysBusch = (path: string) => `https://www.rateyourseats.com/busch-stadium/seating/${path}`;
const RYS_BUSCH = rysBusch('shaded-covered-seats');
const buschSections = (...ids: string[]) => ids.map((n) => rysBusch(`sections/${n}`));
const BUSCH_CLUB_MAP = 'https://vw-sitesbuilder.eu-west-1.staticresources.3ddvfactory.com/sitesbuilder/stlouis-cardinals/latest/master.json';

/** Seating ring of a Busch Stadium chart section. */
export function buschTier(id: string): string | null {
  if (/^[1-8]$/.test(id)) return 'cardinalsClub';
  if (/^\d{3}D$/.test(id)) return 'fieldBoxes';
  if (/^S\d+$|^703[A-F]$/.test(id)) return 'suite';
  // Party-suite patios (O), boxes (B) and the named clubs: no source says
  // what covers them.
  if (!/^\d+$/.test(id)) return null;
  const n = Number(id);
  if (n <= 111 || (n >= 189 && n <= 197)) return 'bleachers';
  if (n <= 172) return 'hundred';
  if (n <= 240 || (n >= 261 && n <= 272)) return 'loge';
  if (n <= 260) return 'clubLevel';
  if (n <= 360) return 'pavilion';
  if (n <= 372) return 'pavilionLeft';
  if (n <= 440) return 'terrace';
  return 'terraceInfield';
}

// The 100s' covered rows as positions in each section's numbered rows
// (Rate Your Seats; a wheelchair row between 18 and 20 is not counted, so
// "row 21" in a section with rows 1–18 and 20–29 is its 20th row).
const BUSCH_100_COVER: Record<string, number> = {
  '128': 14, '129': 14, '130': 17, '132': 20, '133': 20, '134': 20, '135': 21, '137': 20, '139': 20, '140': 21,
  '141': 24, '142': 24, '143': 24, '144': 24, '145': 24, '148': 24, '149': 24, '150': 24, '152': 24, '153': 24,
  '155': 24, '156': 24, '157': 24, '158': 24,
  '160': 19, '161': 19, '162': 19, '163': 19, '165': 20, '167': 19, '170': 8, '171': 8,
};
// The 200 level's covered rows where the lidar puts its edge more than two
// rows from Rate Your Seats' (131: none given; its rows end before row 21).
const BUSCH_100_SCAN_COVER: Record<string, number> = {
  '129': 17, '131': 8, '132': 15, '134': 24, '135': 28, '162': 24, '163': 25, '165': 27, '167': 26,
};
const BUSCH_100_ROWS = { ...BUSCH_100_COVER, ...BUSCH_100_SCAN_COVER };
// The 200 level's underside over the 100s (lidar): the bottom of its face,
// ~40 ft (39–41; its front row is 47 ft up).
const BUSCH_100_SOFFIT_FT = 40;
const BUSCH_LIDAR = 'USGS 3DEP lidar MO_StLouis_2017, flown 2017-02-20 (scripts/measureStandHeights.py)';

/**
 * Busch Stadium (2006). Lettered field boxes and the Cardinals Club in front
 * of the 100s, the 200 level (loge, and the club level behind home), the 300s
 * (Pavilion) and the 400s (Terrace) under a small roof. Rows are Rate Your
 * Seats' section pages (lettered rows on the "D" boxes, numbered rows on the
 * main sections) and the club's own data for the Cardinals Club; covered
 * rows are Rate Your Seats'.
 *
 * Heights are measured on USGS airborne lidar (BUSCH_LIDAR), as at Citizens
 * Bank Park: for each section a cut straight back through its rows gives the
 * front row's height, the rake and the structure that rises highest behind
 * as seen from the middle uncovered row; tier values are medians, sections
 * more than 10% (at least 3 ft) off get their own. The stacking estimates
 * were close above the field (the 200 level's front 48 ft, the Pavilion's
 * 75, the Terrace's 97); the field rows and the 100s start lower and rake
 * less. The six light towers above the roof are not counted as walls.
 * Covered rows: where the scan puts a deck's edge more than two rows from
 * the source's, the scan's edge is used, with the lowest structure seen at
 * it (or the deck above's front row less this park's measured deck depth)
 * as the underside, never less than 9 ft above the first covered row's
 * floor. Sections the scan does not find keep estimates, re-taken from the
 * decks measured around them.
 */
const BUSCH: StadiumStructure = {
  stadiumId: 'cardinals',
  // Far rim (lidar): the stands' roof line, median over sections 133 ft (the
  // roof over the 400s); crossing: the median distance from a section to
  // what rises highest across the field, 611 ft.
  park: { roof: 'open', farRimHeightFt: 133, fieldCrossingFt: 611 },
  tierOf: buschTier,
  tiers: {
    cardinalsClub: {
      label: 'Cardinals Club (1–8)',
      // Rows A–C at the backstop (club data); open (seen from directly above
      // on the photo). Lidar (2 of 8; the rest join the boxes behind): front
      // row at field level, 10° rake (6–14); what rises highest behind is the
      // roof over the 400s, 133 ft up and 117 ft back.
      stand: { rows: 3, frontRowHeightFt: 0, rakeDeg: 10, backHeightFt: 133, backSetbackFt: 117 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [BUSCH_CLUB_MAP, BUSCH_LIDAR],
    },
    fieldBoxes: {
      label: 'Field boxes (lettered rows)',
      // Rows A–L (fewer in some) in front of the 100s, open. Lidar (13 of
      // 26): front row at field level (-1 to 2), 7° rake (6–23); behind, the
      // roof over the 400s, 133 ft up and 112 ft back (down the first-base
      // line the Pavilion's corners, 76–115 ft). Sections whose measured back
      // stands more than 10 ft nearer or farther take their own.
      stand: { rows: 12, frontRowHeightFt: 0, rakeDeg: 7, backHeightFt: 133, backSetbackFt: 112 },
      sections: withBacks({
        '703D': { backHeightFt: 115, backSetbackFt: 124 },
        ...Object.fromEntries(['163D', '164D', '166D'].map((id) => [id, { backHeightFt: 76, backSetbackFt: 94 }])),
        '165D': { backHeightFt: 87, backSetbackFt: 121 },
      }, { '138D': [133, 93], '140D': [133, 89], '163D': [76, 83], '166D': [76, 116] }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('132', '135', '140', '142', '155', '158', '161', '167'), BUSCH_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      // Numbered rows; covered by the 200 level from row 21 (128–140), row 24
      // (141–158) or row 20 (160–167), and from row 8 in 170–171 (Rate Your
      // Seats); in nine sections the lidar puts its edge more than two rows
      // off and its row is used (BUSCH_100_SCAN_COVER; 131 covered from row
      // 8). Sections whose rows stop before the deck (tunnel sections such
      // as 136, 146, 151, 154) are open. Lidar (32 of 46): front row 4 ft (3–14; 14 in
      // the left-field corner, 127–131), 12° rake (7–17); what rises
      // highest behind is the roof over the 400s, 133 ft up and 35 ft
      // behind the last row (down the lines the Pavilion, 76–116 ft).
      // Sections whose measured back stands more than 10 ft nearer or
      // farther take their own (the same roof 6–24 ft behind the 28–29 row
      // sections behind home, 45–70 ft behind the tunnel sections, which end
      // sooner). 131's is seen from its open rows (1–7), the scan covering it
      // from row 8: a structure 74 ft up, 18 ft in front of its last row.
      stand: { rows: 26, frontRowHeightFt: 4, rakeDeg: 12, backHeightFt: 133, backSetbackFt: 35, deckFrontFt: 47 },
      sections: withBacks({
        ...Object.fromEntries(Object.entries(BUSCH_100_ROWS).map(([id, row]) => [id, { overhang: { coveredFromRow: row, soffitHeightFt: BUSCH_100_SOFFIT_FT } }])),
        '127': { frontRowHeightFt: 14, backHeightFt: 116, backSetbackFt: 63 },
        '128': { frontRowHeightFt: 14, backHeightFt: 88, backSetbackFt: 58, overhang: { coveredFromRow: BUSCH_100_ROWS['128'], soffitHeightFt: BUSCH_100_SOFFIT_FT } },
        ...Object.fromEntries(['129', '132'].map((id) => [id, { frontRowHeightFt: 8, overhang: { coveredFromRow: BUSCH_100_ROWS[id], soffitHeightFt: BUSCH_100_SOFFIT_FT } }])),
        '131': { frontRowHeightFt: 14, backHeightFt: 49, backSetbackFt: -24, overhang: { coveredFromRow: BUSCH_100_ROWS['131'], soffitHeightFt: BUSCH_100_SOFFIT_FT } },
        ...Object.fromEntries(['162', '163'].map((id) => [id, { backHeightFt: 76, backSetbackFt: 11, overhang: { coveredFromRow: BUSCH_100_ROWS[id], soffitHeightFt: BUSCH_100_SOFFIT_FT } }])),
        '164': { backHeightFt: 88, backSetbackFt: 58 },
        ...Object.fromEntries(['165', '167'].map((id) => [id, { backHeightFt: 116, backSetbackFt: 63, overhang: { coveredFromRow: BUSCH_100_ROWS[id], soffitHeightFt: BUSCH_100_SOFFIT_FT } }])),
        ...Object.fromEntries(['166', '168'].map((id) => [id, { backHeightFt: 116, backSetbackFt: 63 }])),
      }, {
        '127': [117, 84], '131': [74, -18], '165': [116, 39], '167': [116, 40],
        '132': [133, 6], '133': [133, 22], '134': [133, 50], '135': [133, 51], '136': [133, 70], '137': [133, 21],
        '138': [133, 50], '139': [133, 24], '140': [133, 21], '146': [133, 45], '147': [133, 53], '151': [133, 53], '154': [133, 48],
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('128', '130', '132', '135', '141', '144', '148', '150', '153', '158', '160', '165', '170'), BUSCH_LIDAR],
    },
    bleachers: {
      label: 'Outfield bleachers (101–111, 189–197)',
      // "One of the least shaded areas", open. Lidar (8 of 10): front row
      // 7 ft above the field (13 in 109), 18° rake (16–24); what rises
      // highest behind differs from section to section (43–104 ft; 80 ft,
      // 52 ft back, the median). Over 189's first three rows a deck of seats
      // 47 ft up; its other rows show uncovered behind it. Behind 189, 195
      // and 197 what rises highest is 75–80 ft up and 134–188 ft back.
      stand: { rows: 20, frontRowHeightFt: 7, rakeDeg: 18, backHeightFt: 80, backSetbackFt: 52 },
      sections: {
        '101': { backHeightFt: 56, backSetbackFt: 30 },
        ...Object.fromEntries(['103', '105'].map((id) => [id, { backHeightFt: 97, backSetbackFt: 52 }])),
        '107': { backHeightFt: 104, backSetbackFt: 34 },
        '109': { frontRowHeightFt: 13, backHeightFt: 43, backSetbackFt: 17 },
        '189': { backHeightFt: 80, backSetbackFt: 187 },
        '195': { backHeightFt: 75, backSetbackFt: 134 },
        '197': { backHeightFt: 79, backSetbackFt: 188 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('101', '107', '111', '189', '193', '197'), BUSCH_LIDAR],
    },
    loge: {
      label: 'Loge (228–240, 261–272)',
      // Rows 1–10 to 1–16. "The last few rows ... are among the best shaded
      // seats on the 200 level, thanks to the overhang above"; no source
      // gives the row. Lidar (13 of 20): front row 48 ft (47–52), 21° rake
      // (19–25); the Pavilion's front, 74–75 ft up, reaches out over row 5
      // (3–6; row 11–12 in 265–272), so the rows from there back are
      // covered, under an underside of ~67 ft (that front row less this
      // park's measured 7-ft deck depth; 68–69 ft over row 11–12). What
      // rises highest behind is that front edge (in 267–272 the roof over
      // the 400s, 116 ft). Sections whose measured back stands more than 10
      // ft nearer or farther take their own (231 and 261, whose deck edge is
      // over row 3–4, 25 ft in front; that roof 5–7 ft in front of the last
      // row of 271 and 272).
      stand: { rows: 10, frontRowHeightFt: 48, rakeDeg: 21, backHeightFt: 76, backSetbackFt: -15, deckFrontFt: 74, overhang: { coveredFromRow: 5, soffitHeightFt: 67 } },
      sections: withBacks({
        '265': { overhang: { coveredFromRow: 11, soffitHeightFt: 68 } },
        ...Object.fromEntries(['267', '272'].map((id) => [id, { backHeightFt: 116, backSetbackFt: 6, overhang: { coveredFromRow: 11, soffitHeightFt: 68 } }])),
        ...Object.fromEntries(['268', '269'].map((id) => [id, { backHeightFt: 116, backSetbackFt: 6, overhang: { coveredFromRow: 12, soffitHeightFt: 69 } }])),
        '271': { backHeightFt: 116, backSetbackFt: 6 },
      }, { '231': [75, -25], '261': [76, -25], '271': [115, -7], '272': [116, -5] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...buschSections('228', '235', '240', '261', '267', '272'), BUSCH_LIDAR],
    },
    clubLevel: {
      label: 'Club level (241–260)',
      // Rows 1–8 to 1–15, covered from row 9 (sourced); 249–251 have rows
      // 1–8 only, 250 and 258 a drink rail behind row 8 (covered), 260 is
      // all covered. Lidar (16 of 19): front row 48 ft, 24° rake (23–26);
      // the Pavilion's front, 75 ft up, reaches out over row 4–5 in all of
      // them, so the rows from 4 back are covered (Rate Your Seats counts
      // from 9), under an underside of ~67 ft (that front row less this
      // park's measured 7-ft deck depth). What rises highest behind is that
      // front edge (11 ft in front of the last row in the 8-row 249 and 251,
      // 16 ft in the 9-row 250 and 258, measured).
      stand: { rows: 15, frontRowHeightFt: 48, rakeDeg: 24, backHeightFt: 76, backSetbackFt: -25, deckFrontFt: 75, overhang: { coveredFromRow: 4, soffitHeightFt: 67 } },
      sections: {
        '260': { overhang: { coveredFromRow: 1, soffitHeightFt: 67 } },
        ...Object.fromEntries(['249', '251'].map((id) => [id, { backHeightFt: 76, backSetbackFt: -11 }])),
        ...Object.fromEntries(['250', '258'].map((id) => [id, { backHeightFt: 76, backSetbackFt: -16 }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('241', '249', '250', '257', '258', '259', '260'), BUSCH_LIDAR],
    },
    pavilion: {
      label: 'Pavilion (331–360)',
      // Rows 1–6 or 1–9, open ("among the most exposed"). Lidar (27 of 27):
      // front row 75 ft (74–76), 31° rake (28–33); what rises highest behind
      // is the roof over the 400s, 133 ft up and 9 ft back (97–116 ft at
      // the ends). The Terrace's front, 97 ft up, is over the last row of
      // the 9-row sections.
      stand: { rows: 9, frontRowHeightFt: 75, rakeDeg: 31, backHeightFt: 133, backSetbackFt: 9 },
      sections: {
        '357': { backHeightFt: 97, backSetbackFt: 7 },
        ...Object.fromEntries(['358', '359'].map((id) => [id, { backHeightFt: 116, backSetbackFt: 52 }])),
        '360': { backHeightFt: 106, backSetbackFt: 27 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('331', '341', '345', '350', '355', '360'), BUSCH_LIDAR],
    },
    pavilionLeft: {
      label: 'Pavilion, left field (361–372)',
      // Rows 1–14, covered from row 8 (sourced; the scan sees no edge over
      // the rows of 363 and 365). Lidar (2 of 9): front row 75 ft, 31° rake;
      // what rises highest behind is 115 ft up, 32 ft back (98 in 363).
      // Estimated: roof underside ~96 ft (9 ft above row 8's floor).
      stand: { rows: 14, frontRowHeightFt: 75, rakeDeg: 31, backHeightFt: 115, backSetbackFt: 32, overhang: { coveredFromRow: 8, soffitHeightFt: 96 } },
      sections: { '363': { backHeightFt: 98, backSetbackFt: 35 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('361', '365', '369', '372'), BUSCH_LIDAR],
    },
    terrace: {
      label: 'Terrace (431–440)',
      // Rows 1–11, covered from row 6 by the roof (sourced). Not found on
      // the lidar (the roof hides all but their first rows). Estimated as the
      // Terrace behind home, measured: front 97 ft, 29° rake, under the same
      // roof, 133 ft up.
      stand: { rows: 11, frontRowHeightFt: 97, rakeDeg: 29, backHeightFt: 133, overhang: { coveredFromRow: 6, soffitHeightFt: 133 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...buschSections('431', '433', '435', '437', '440'), BUSCH_LIDAR],
    },
    terraceInfield: {
      label: 'Terrace (441–454)',
      // Rows 1–11, covered from row 4 (sourced); 449–451 (rows 1–8) all
      // covered. Lidar (4 of 12): front row 97 ft, 29° rake (26–29); the
      // roof's edge, 133 ft up with nothing seen below it (a thin roof), is
      // over row 1–2 (row 1 in 454, which takes it).
      stand: { rows: 11, frontRowHeightFt: 97, rakeDeg: 29, backHeightFt: 133, backSetbackFt: -25, overhang: { coveredFromRow: 4, soffitHeightFt: 133 } },
      sections: Object.fromEntries(['449', '450', '451', '454'].map((id) => [id, { overhang: { coveredFromRow: 1, soffitHeightFt: 133 } }])),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('441', '445', '449', '451', '454'), BUSCH_LIDAR],
    },
    suite: {
      label: 'Suites',
      // The club's map lists S1–S63 and 703A–F as suites: as at the other
      // parks, one row of seats under the suite level's ceiling, 9 ft above the
      // floor. Estimated: ~66 ft up, between the club level and the Pavilion,
      // behind the club level's last row (65 ft) and under the deck that covers
      // it from row 4, so it reaches 33 ft past them.
      stand: { rows: 1, frontRowHeightFt: 66, rakeDeg: 0, backHeightFt: 78, overhang: { coveredFromRow: 1, soffitHeightFt: 75, reachFt: 33 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [BUSCH_CLUB_MAP, 'https://www.mlb.com/cardinals/tickets/premium/suites'],
    },
  },
  reviewedOn: '2026-11-11',
};

const rysNats = (path: string) => `https://www.rateyourseats.com/nationals-park/seating/${path}`;
const RYS_NATS = rysNats('shaded-covered-seats');
const natsSections = (...ids: string[]) => ids.map((n) => rysNats(`sections/${n}`));

/** Seating ring of a Nationals Park chart section. */
export function natsTier(id: string): string | null {
  if (/^[A-E]$/.test(id)) return 'terraClub';
  if (/^(DC|HP)\d+$/.test(id)) return 'diamondClub';
  if (/^SUITE\d+$/.test(id)) return 'suite';
  // Party suites, the named clubs and center field's lettered blocks: no
  // source says what covers them.
  if (!/^\d+$/.test(id)) return null;
  const n = Number(id);
  if (n <= 107) return 'outfield';
  if (n <= 137) return 'hundred';
  if (n <= 143) return 'rightField';
  if (n <= 205 || (n >= 223 && n <= 235 && n % 2 === 1)) return 'mezzanine';
  if (n <= 221) return 'clubLevel';
  if (n <= 236) return 'terrace';
  if (n === 237) return 'pavilionCoverUnsourced';
  if (n <= 243) return 'pavilion';
  if (n <= 321) return 'gallery';
  return 'upperGallery';
}

// The 100s' covered rows as positions in each section's lettered rows (A–Z
// then AA–ZZ; Rate Your Seats: "a typical lower level section is covered at
// row RR"). 118, 127 and the outfield stop before the deck.
const NATS_100_COVER: Record<string, number> = {
  '108': 39, '109': 25, '110': 38, '111': 39, '112': 40, '113': 42, '114': 42, '115': 45, '116': 43, '117': 43,
  '128': 43, '129': 43, '130': 46, '131': 44, '132': 47, '133': 42, '134': 37, '135': 33, '136': 33, '137': 22,
};
const NATS_LIDAR = 'USGS 3DEP lidar MD_VA_Sandy_NCR_2014, flown 2014-04-24 (scripts/measureStandHeights.py)';

/**
 * Nationals Park (2008). The Terra Club and Diamond Club behind home, a deep
 * 100 level, the 200s (Mezzanine, the club level and the right-field
 * Terrace), the scoreboard pavilion in right-center, the 300s (Gallery,
 * uncovered) and the 400s (Upper Gallery) under a roof from row C. Rows and
 * covered rows are Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (NATS_LIDAR), as at Citizens
 * Bank Park: for each section a cut straight back through its rows gives the
 * front row's height, the rake and the structure that rises highest behind
 * as seen from the middle uncovered row; tier values are medians, sections
 * more than 10% (at least 3 ft) off get their own. The scan (2014) is
 * sparse: the lower bowl and the 300s are well covered, the 200 level shows
 * only its first rows under the 300 deck (5 sections measured), and the
 * 400s are hidden under their roof. The decks are lower than the stacking
 * estimates: the 200 level's front is 37 ft (58), the 300s' 73 ft (84).
 * Covered rows: where the scan puts a deck's edge more than two rows from
 * the source's, the scan's edge is used, with the lowest structure seen at
 * it (or the deck above's front row less 9 ft) as the underside, never less
 * than 9 ft above the first covered row's floor. Sections the scan does not
 * find keep estimates, re-taken from the decks measured around them.
 */
const NATS: StadiumStructure = {
  stadiumId: 'nationals',
  // Far rim (lidar): the stands' roof line, median over sections 134 ft (the
  // Upper Gallery roof); crossing: the median distance from a section to
  // what rises highest across the field, 578 ft.
  park: { roof: 'open', farRimHeightFt: 134, fieldCrossingFt: 578 },
  tierOf: natsTier,
  tiers: {
    terraClub: {
      label: 'Terra Club (A–E)',
      // Rows A–L at the backstop (C: A–H), open (seen from directly above on
      // the photo). Lidar (5 of 5): front row at field level, 10° rake
      // (9–13); what rises highest behind is the Upper Gallery's roof, 135 ft
      // up and 103 ft back (116 ft behind C, measured).
      stand: { rows: 12, frontRowHeightFt: 0, rakeDeg: 10, backHeightFt: 135, backSetbackFt: 103 },
      sections: { 'C': { backHeightFt: 135, backSetbackFt: 116 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...natsSections('A', 'C', 'E'), NATS_LIDAR],
    },
    diamondClub: {
      label: 'Diamond Club (119–126)',
      // Rows A–U, "elevated about 12 rows off the field" behind the Terra
      // Club; no source gives covered rows, so the check tries both. Lidar (7
      // of 11): front row 10 ft (9–15), 14° rake (13–14); what rises highest
      // behind is the Upper Gallery's roof, 134 ft up and 39 ft back (57–62
      // ft behind HP119 and HP120, measured).
      // In DC122 the club level's front (37 ft) reaches out over row 15
      // (underside ~34 ft, 9 ft above that row's floor).
      stand: { rows: 21, frontRowHeightFt: 10, rakeDeg: 14, backHeightFt: 134, backSetbackFt: 39, deckFrontFt: 37 },
      sections: {
        'DC122': { frontRowHeightFt: 15, backHeightFt: 73, backSetbackFt: -11, overhang: { coveredFromRow: 15, soffitHeightFt: 34 } },
        'HP119': { backHeightFt: 134, backSetbackFt: 62 }, 'HP120': { backHeightFt: 134, backSetbackFt: 57 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: false,
      sources: [...natsSections('119', '122', '126'), NATS_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      // Rows A–WW and the like (up to 49 rows); Rate Your Seats counts them
      // covered by the 200 level from about row RR (NATS_100_COVER). Lidar (21
      // of 22): front row 1 ft (-2 to 1), 13° rake (12–13); the 200 level's
      // front, 37 ft up, reaches out over row 36 (33–41; the 300 level's over
      // 108), so the rows from there back are covered, under an underside of
      // ~28 ft (that front row less 9 ft), never under 9 ft above the first
      // covered row's floor (32 ft over row 36). Where the scan sees no edge
      // (109) or did not measure the section (137) the source's row stays.
      // What rises highest behind is the Upper Gallery's roof, 140 ft up over
      // the back row. Sections whose measured back stands more than 10 ft
      // nearer or farther take their own (the same roof 27–42 ft behind the
      // shorter sections 108, 109, 118 and 127, 9–16 ft in front of the last
      // row of the 49-row 111 and 135).
      stand: { rows: 44, frontRowHeightFt: 1, rakeDeg: 13, backHeightFt: 140, backSetbackFt: 1, deckFrontFt: 37, overhang: { coveredFromRow: 36, soffitHeightFt: 32 } },
      sections: withBacks({
        ...Object.fromEntries(['109', '137'].map((id) => [id, { overhang: { coveredFromRow: NATS_100_COVER[id], soffitHeightFt: 28 } }])),
        '108': { deckFrontFt: 71, overhang: { coveredFromRow: 41, soffitHeightFt: 62 } },
        '113': { overhang: { coveredFromRow: 39, soffitHeightFt: 34 } },
        ...Object.fromEntries(['134', '135'].map((id) => [id, { overhang: { coveredFromRow: 33, soffitHeightFt: 30 } }])),
        '136': { overhang: { coveredFromRow: 40, soffitHeightFt: 35 } },
      }, {
        '108': [133, 24], '109': [134, 42], '118': [141, 29], '127': [141, 27], '111': [142, -9], '135': [142, -16],
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('108', '112', '113', '117', '118', '127', '128', '132', '135', '137'), NATS_LIDAR],
    },
    outfield: {
      label: 'Outfield (100–107)',
      // Rows up to 30, open ("very few outfield seats are in the shade").
      // Lidar (6 of 8): front row 9 ft above the field (14 in 100 and 101),
      // 13° rake (10–19); behind, 46 ft up (41–78). Over the back rows of
      // 100 and 103–105 a structure reaches out (from row 24, 12 in 100, 27
      // in 103; the bottom of its face 39 ft up, 33–48), so those rows are
      // covered; over 101 and 102 the scan sees none. Each takes its own
      // measured back where it differs (over 100 that structure's top, 51
      // ft up and 41 ft in front of its last row).
      stand: { rows: 26, frontRowHeightFt: 9, rakeDeg: 13, backHeightFt: 46, backSetbackFt: -6 },
      sections: {
        '100': { frontRowHeightFt: 14, backHeightFt: 51, backSetbackFt: -41, overhang: { coveredFromRow: 12, soffitHeightFt: 48 } },
        '101': { frontRowHeightFt: 14, backHeightFt: 78, backSetbackFt: 125 },
        '102': { backHeightFt: 77, backSetbackFt: 173 },
        '103': { backHeightFt: 41, backSetbackFt: -6, overhang: { coveredFromRow: 27, soffitHeightFt: 38 } },
        '104': { backHeightFt: 41, backSetbackFt: -6, overhang: { coveredFromRow: 24, soffitHeightFt: 33 } },
        '105': { overhang: { coveredFromRow: 24, soffitHeightFt: 39 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('100', '101', '104', '107'), NATS_LIDAR],
    },
    rightField: {
      label: 'Right field (138–143)',
      // Under the scoreboard pavilion: 138 all covered, 139 from row H (its
      // 3rd row), 140–143 from row H (sourced). Lidar (4 of 6): front row
      // 12 ft (12–14), 14° rake; the pavilion's front, 36 ft up, reaches out
      // over row 6 (row 2 in 140), so the rows from there back are covered,
      // under an underside of ~27 ft (that front row less 9 ft); over 143
      // from row 19, under the scoreboard (its bottom 70 ft up). What rises
      // highest behind is that front edge (154 ft in 143), 12 ft behind the
      // front row of 140; 139 (19 rows, hidden under it but its first rows)
      // takes it there too, 40 ft in front of its last row.
      stand: { rows: 24, frontRowHeightFt: 12, rakeDeg: 14, backHeightFt: 37, backSetbackFt: -53, deckFrontFt: 36, overhang: { coveredFromRow: 6, soffitHeightFt: 27 } },
      sections: {
        '138': { overhang: { coveredFromRow: 1, soffitHeightFt: 27 } },
        '139': { backSetbackFt: -40, overhang: { coveredFromRow: 3, soffitHeightFt: 27 } },
        '140': { overhang: { coveredFromRow: 2, soffitHeightFt: 27 } },
        '143': { backHeightFt: 154, backSetbackFt: -14, deckFrontFt: undefined, overhang: { coveredFromRow: 19, soffitHeightFt: 70 } }, // another deck, its front not measured
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('138', '139', '140', '142'), NATS_LIDAR],
    },
    mezzanine: {
      label: 'Mezzanine (201–205, 223–235)',
      // Rows A–P under the Gallery deck from row H (201–205) or G (odd
      // 223–235). Lidar (2 of 12; the 300 deck hides the rest): front row
      // 37 ft, 18° rake (16–20); the 300 deck reaches out over row 1–2, so
      // the rows from 2 back are covered (201–205, not measured, keep row
      // H), its lowest point there 63 ft up, taken as its underside. Behind
      // the two measured, 229 and 235, that deck is 35 ft in front of the
      // last row.
      stand: { rows: 16, frontRowHeightFt: 37, rakeDeg: 18, backHeightFt: 63, overhang: { coveredFromRow: 2, soffitHeightFt: 63 } },
      sections: {
        ...Object.fromEntries(['201', '202', '203', '204', '205'].map((id) => [id, { overhang: { coveredFromRow: 8, soffitHeightFt: 63 } }])),
        ...Object.fromEntries(['229', '235'].map((id) => [id, { backHeightFt: 63, backSetbackFt: -35 }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...natsSections('201', '203', '205', '223', '229', '235'), NATS_LIDAR],
    },
    clubLevel: {
      label: 'Club level (206–221)',
      // Rows A–J or A–L, covered from row G (sourced). Hidden under the 300
      // deck: the scan finds none of its 16 sections (215's cut lands on a
      // roof outside the park, 86 m from home plate, beyond the stands).
      // Estimated from the 200 level measured around it: front 37 ft (the
      // Mezzanine's and the Terrace's), the Mezzanine's 18° rake, and the 300
      // deck's underside as measured over them, 63 ft.
      stand: { rows: 10, frontRowHeightFt: 37, rakeDeg: 18, backHeightFt: 63, overhang: { coveredFromRow: 7, soffitHeightFt: 63 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('206', '209', '214', '217', '221'), NATS_LIDAR],
    },
    terrace: {
      label: 'Right Field Terrace (222–236)',
      // Rows A–X (A, D–X in 224–230), covered from row L (sourced). Lidar (2
      // of 8; the 300 deck hides the rest): front row 37 ft, 15° rake; the
      // 300 deck reaches out over row 1–4, so the rows from 2 back are
      // covered (224–230, not measured, keep their row), its lowest point
      // there 62 ft up, taken as its underside. Behind the two measured, 232
      // and 236, that deck is 49 ft in front of the last row (63 ft up).
      stand: { rows: 24, frontRowHeightFt: 37, rakeDeg: 15, backHeightFt: 62, overhang: { coveredFromRow: 2, soffitHeightFt: 62 } },
      sections: {
        ...Object.fromEntries(['224', '226', '228', '230'].map((id) => [id, { overhang: { coveredFromRow: 10, soffitHeightFt: 62 } }])),
        ...Object.fromEntries(['232', '236'].map((id) => [id, { backHeightFt: 63, backSetbackFt: -49 }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...natsSections('222', '224', '232', '236'), NATS_LIDAR],
    },
    pavilion: {
      label: 'Scoreboard Pavilion (238–243)',
      // Rows A–P, "no overhang above them". Lidar (6 of 6): front row 36 ft
      // (35–37), 20° rake (10–23; 238 is shallow); what rises highest behind
      // is the scoreboard structure, 95 ft up (64–135). The scoreboard
      // reaches out over row 12 of 241–243, the bottom of its face 75 ft up
      // (69–82; 100 over 243), and the upper deck over row 2–3 of 238 and
      // 239 (its front row 62 ft up, its underside ~53 ft), so those rows
      // are covered; over 240 the scan sees nothing.
      stand: { rows: 16, frontRowHeightFt: 36, rakeDeg: 20, backHeightFt: 95, backSetbackFt: -12, overhang: { coveredFromRow: 12, soffitHeightFt: 75 } },
      sections: {
        '238': { backHeightFt: 65, backSetbackFt: -22, deckFrontFt: 62, overhang: { coveredFromRow: 3, soffitHeightFt: 53 } },
        '239': { backHeightFt: 67, backSetbackFt: -22, deckFrontFt: 62, overhang: { coveredFromRow: 2, soffitHeightFt: 53 } },
        '240': { backHeightFt: 63, backSetbackFt: 12, noCover: true },
        ...Object.fromEntries(['241', '242'].map((id) => [id, { backHeightFt: 123, backSetbackFt: -12 }])),
        '243': { backHeightFt: 135, backSetbackFt: -12, overhang: { coveredFromRow: 12, soffitHeightFt: 100 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...natsSections('238', '240', '243'), NATS_LIDAR],
    },
    pavilionCoverUnsourced: {
      label: 'Scoreboard Pavilion (237)',
      // Its page says both "rows G and above are under cover" and "no
      // overhang above them". Lidar: front row 36 ft, a shallow 8°; the upper
      // deck reaches out over row 1, as over 238 and 239 (its front row 62 ft
      // up, its underside ~53 ft), which settles it; behind, 63 ft up.
      stand: { rows: 16, frontRowHeightFt: 36, rakeDeg: 8, backHeightFt: 63, backSetbackFt: -32, overhang: { coveredFromRow: 1, soffitHeightFt: 53 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...natsSections('237'), NATS_LIDAR],
    },
    gallery: {
      label: 'Gallery (300s)',
      // Rows A–J or A–L; "nothing in the 300 level is covered". On the photo
      // the 300s' rows end where the Upper Gallery's roof begins (the 400s,
      // ~12.5 m deep, sit under it, covered from row C), so the roof's front
      // edge stands just behind the 300s' last row. Lidar (20 of 21): front
      // row 73 ft (71–74), 31° rake (28–34); the roof, 135 ft up, is what
      // rises highest behind. Its edge reaches out over row 9 (8–12) in 18
      // of the 19 sections measured, 140 ft up with nothing seen below it (a
      // thin roof), so the rows from there back are covered. Where it covers
      // only the last row or two that is under option A's three-row mark,
      // but its edge is then what rises behind them, just in front of the
      // last row, which would leave the rows under it with nothing behind:
      // so they are covered too. Over 315 the scan sees no edge. In the
      // 12-row 307, 318 and 320 the edge is 12–14 ft in front of the last
      // row, 141–142 ft up (measured).
      stand: { rows: 10, frontRowHeightFt: 73, rakeDeg: 31, backHeightFt: 135, backSetbackFt: -2, overhang: { coveredFromRow: 9, soffitHeightFt: 140 } },
      sections: withBacks({
        ...Object.fromEntries(['305', '306', '307', '308', '318', '319', '320', '321'].map((id) => [id, { overhang: { coveredFromRow: 8, soffitHeightFt: 140 } }])),
        '316': { overhang: { coveredFromRow: 10, soffitHeightFt: 140 } },
        ...Object.fromEntries(['303', '309'].map((id) => [id, { overhang: { coveredFromRow: 11, soffitHeightFt: 140 } }])),
        '317': { overhang: { coveredFromRow: 12, soffitHeightFt: 140 } },
        '315': { noCover: true },
      }, { '307': [141, -14], '318': [142, -12], '320': [141, -12] }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('301', '305', '311', '315', '321'), NATS_LIDAR],
    },
    upperGallery: {
      label: 'Upper Gallery (400s)',
      // Rows A–N, covered from row C (sourced). Hidden under the roof from
      // the air. Estimated: front ~93 ft, just above the 300s' measured last
      // row (91 ft), 32° rake. The roof (lidar): its edge 140 ft up with
      // nothing seen below it, so a thin roof.
      stand: { rows: 14, frontRowHeightFt: 93, rakeDeg: 32, backHeightFt: 140, overhang: { coveredFromRow: 3, soffitHeightFt: 140 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('401', '405', '409', '416', '420'), NATS_LIDAR],
    },
    suite: {
      label: 'Suites',
      // The club's map lists them as suites: as at the other parks, one row
      // of seats under the suite level's ceiling, 9 ft above the floor.
      // Estimated ~45 ft up, behind the club level's last row (45 ft,
      // estimated from the 200 level around it) and under the deck that
      // covers it from row G, so it reaches 11 ft past them.
      stand: { rows: 1, frontRowHeightFt: 45, rakeDeg: 0, backHeightFt: 59, overhang: { coveredFromRow: 1, soffitHeightFt: 54, reachFt: 11 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/nationals/ballpark/seating-map/3d'],
    },
  },
  reviewedOn: '2026-11-11',
};

const rysOpacy = (path: string) => `https://www.rateyourseats.com/oriole-park/seating/${path}`;
const RYS_OPACY = rysOpacy('shaded-covered-seats');
const opacySections = (...ids: string[]) => ids.map((n) => rysOpacy(`sections/${n}`));
// The 300s with rows 1–5 then 9–25: row 15 is their 12th row.
const OPACY_300_SKIPPING = ['306', '312', '318', '322', '326', '328', '334', '336', '340', '346', '348', '354', '356', '362', '364', '370', '372', '374', '378'];

/** Seating ring of a Camden Yards chart section. */
export function opacyTier(id: string): string | null {
  if (/^STE\d+$|^S\d{4}$/.test(id)) return 'suite';
  // The Terrace behind home is drawn as C31–C43 on the club's map; Rate Your
  // Seats numbers it 31–43 (41 has no page, so it stays unrated).
  if (id === 'C41') return null;
  if (/^C\d+$/.test(id)) return opacyTier(id.slice(1));
  // The center-field deck and standing room: no source says what covers them.
  if (!/^\d+$/.test(id)) return null;
  const n = Number(id);
  if (n <= 8) return 'rightCorner';
  if (n >= 33 && n <= 43 && n % 2 === 1) return 'terraceHome';
  if (n <= 87) return n % 2 === 0 ? 'field' : 'terrace';
  if (n <= 98) return 'bleachers';
  if (n <= 210 || n >= 268) return n < 300 ? 'clubOpen' : ['320', '338', '350', '358', '366'].includes(id) ? 'upperShort' : 'upper';
  return 'clubLevel';
}

const OPACY_LIDAR = 'USGS 3DEP lidar MD_4County_D24, flown 2024-12-23 (scripts/measureStandHeights.py)';
// The Terrace: rows 1–13 under the club level from row 2 (sourced). Hidden
// from the air down the lines. Estimated: front ~22 ft, just behind the
// field rows' back aisle (~20 ft on the lidar; 23 ft measured behind home),
// 18° rake (as behind home); the club level's underside ~32 ft (its
// measured 40-ft front row less 9 ft, raised to 9 ft above row 2's floor).
const OPACY_TERRACE: StandProfile = {
  rows: 13,
  frontRowHeightFt: 22,
  rakeDeg: 18,
  backHeightFt: 32,
  overhang: { coveredFromRow: 2, soffitHeightFt: 32 },
};

/**
 * Oriole Park at Camden Yards (1992). Field-level sections (even numbers)
 * with the Terrace (odd numbers) behind them almost entirely under the club
 * level, the club level (200s) and the upper deck (300s) under a roof from
 * row 15. Rows and covered rows are Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (OPACY_LIDAR, December 2024:
 * after the 2022 left-field rebuild), as at Citizens Bank Park: for each
 * section a cut straight back through its rows gives the front row's
 * height, the rake and the structure that rises highest behind as seen from
 * the middle uncovered row; tier values are medians, sections more than 10%
 * (at least 3 ft) off get their own. The decks are lower than the stacking
 * estimates: the club level's front is 40 ft (52), the upper deck's 63 ft
 * (70), its roof's edge 119 ft (110). The light towers are not counted as
 * walls; four corner sections whose cuts run along the steps are skipped.
 * Covered rows: where the scan puts a deck's edge more than two rows from
 * the source's, the scan's edge is used, with the lowest structure seen at
 * it (or the deck above's front row less 9 ft) as the underside, never less
 * than 9 ft above the first covered row's floor. Sections the scan does not
 * find keep estimates, re-taken from the decks measured around them.
 */
const OPACY: StadiumStructure = {
  stadiumId: 'orioles',
  // Far rim (lidar): the stands' roof line, median over sections 122 ft (the
  // upper deck's roof); crossing: the median distance from a section to
  // what rises highest across the field, 604 ft.
  park: { roof: 'open', farRimHeightFt: 122, fieldCrossingFt: 604 },
  tierOf: opacyTier,
  tiers: {
    field: {
      label: 'Field level (even numbers)',
      // Rows 1–24 to 1–29, open. Lidar (38 of 39): front row 1 ft (-1 to 10;
      // 7–10 ft in left field, 72–82), 14° rake (11–20); what rises highest
      // behind is the upper deck's roof, 122 ft up and 51 ft back. In left
      // field (70–76) the club level's front, 40 ft up, reaches out over
      // their back rows (from row 14–25), so those rows are covered, under
      // an underside of ~30 ft (that front row less 9 ft). Sections whose
      // measured back stands more than 10 ft nearer or farther take their
      // own (the roof 33–40 ft behind 36, 38, 72 and 74, 65–75 ft behind 14
      // and 68).
      stand: { rows: 29, frontRowHeightFt: 1, rakeDeg: 14, backHeightFt: 122, backSetbackFt: 51, deckFrontFt: 39 },
      sections: withBacks({
        '70': { overhang: { coveredFromRow: 25, soffitHeightFt: 31 } },
        '74': { frontRowHeightFt: 10, overhang: { coveredFromRow: 16, soffitHeightFt: 30 } },
        '80': { frontRowHeightFt: 10 },
        '72': { frontRowHeightFt: 7, overhang: { coveredFromRow: 18, soffitHeightFt: 30 } },
        '76': { frontRowHeightFt: 10, backHeightFt: 41, backSetbackFt: -25, overhang: { coveredFromRow: 14, soffitHeightFt: 31 } },
        '78': { frontRowHeightFt: 10, backHeightFt: 65, backSetbackFt: 12 },
        '82': { frontRowHeightFt: 7, backHeightFt: 57, backSetbackFt: 35 },
        '86': { backHeightFt: 18, backSetbackFt: 1 },
      }, { '14': [122, 65], '36': [122, 40], '38': [121, 40], '68': [122, 75], '72': [122, 33], '74': [122, 38] }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('22', '36', '48', '56', '70', '86'), OPACY_LIDAR],
    },
    terrace: {
      label: 'Terrace (odd numbers)',
      stand: OPACY_TERRACE,
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('9', '23', '45', '53', '55', '59', '87')],
    },
    terraceHome: {
      label: 'Terrace behind home (33–43)',
      // 33–39 rows 1–6 and 43 rows 1–13, "shaded during most day games";
      // no source gives the covered rows. Lidar (4 of 5): front row 23 ft
      // (23–25), 18° rake (10–20); the upper deck's front, 63 ft up, reaches
      // out over row 1–5 (5 in 37), which settles the cover from row 2,
      // under an underside of ~54 ft (that front row less 9 ft); that edge
      // is what rises highest behind (over the 13-row C43 the upper deck's
      // rows behind it, 71 ft up and 15 ft in front of its last row).
      stand: { rows: 6, frontRowHeightFt: 23, rakeDeg: 18, backHeightFt: 64, backSetbackFt: -7, deckFrontFt: 63, overhang: { coveredFromRow: 2, soffitHeightFt: 54 } },
      sections: { 'C37': { overhang: { coveredFromRow: 5, soffitHeightFt: 54 } }, 'C43': { backHeightFt: 71, backSetbackFt: -15 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...opacySections('33', '35', '37', '39', '43'), OPACY_LIDAR],
    },
    rightCorner: {
      label: 'Right-field corner (1–8)',
      // Rows up to 21 (6: 10–27, 8: 4–27), open ("completely avoid
      // sections 1–8 ... if you want to stay out of the sun"). Lidar (5 of
      // 6): front row 3 ft (0–5), 12° rake; what rises highest behind is the
      // upper deck's roof, 122 ft up and 75 ft back.
      stand: { rows: 21, frontRowHeightFt: 3, rakeDeg: 12, backHeightFt: 122, backSetbackFt: 75 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('1', '3', '5', '6', '7', '8'), OPACY_LIDAR],
    },
    bleachers: {
      label: 'Right-field bleachers (90–98)',
      // Rows 1–15 to 1–23; 92 and 94 covered from row 19 (sourced). Lidar
      // (4 of 5): front row 6 ft above the field (5–8), 18° rake; what rises
      // highest behind is 112 ft up and 50 ft back (40–118). Estimated: over
      // 92 and 94 the structure's underside ~35 ft (9 ft above row 19's
      // floor). Over 90's rows 17 and up a structure reaches out, its lowest
      // point at the edge 38 ft up, so those rows are covered; its top, 118
      // ft, 4 ft in front of 90's last row. Behind 92 what rises highest is
      // 110 ft up, 72 ft back.
      stand: { rows: 23, frontRowHeightFt: 6, rakeDeg: 18, backHeightFt: 112, backSetbackFt: 50 },
      sections: {
        '90': { backHeightFt: 118, backSetbackFt: -4, overhang: { coveredFromRow: 17, soffitHeightFt: 38 } },
        '92': { backHeightFt: 110, backSetbackFt: 72, overhang: { coveredFromRow: 19, soffitHeightFt: 35 } },
        '94': { overhang: { coveredFromRow: 19, soffitHeightFt: 35 } },
        '96': { backHeightFt: 40, backSetbackFt: 45 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...opacySections('90', '92', '94', '96', '98'), OPACY_LIDAR],
    },
    clubLevel: {
      label: 'Club level (212–264)',
      // Rows 1–9; Rate Your Seats counts them covered from row 8. Lidar (19
      // of 21): front row 40 ft, 23° rake (21–26); the upper deck's front,
      // 63 ft up, reaches out over row 5 in all of them, so the rows from 5
      // back are covered, under an underside of ~54 ft (that front row less
      // 9 ft). That edge is what rises highest behind.
      stand: { rows: 9, frontRowHeightFt: 40, rakeDeg: 23, backHeightFt: 64, backSetbackFt: -12, deckFrontFt: 63, overhang: { coveredFromRow: 5, soffitHeightFt: 54 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('212', '230', '242', '256', '264'), OPACY_LIDAR],
    },
    clubOpen: {
      label: 'Club level, outfield ends (204–210, 268–288)',
      // Rows 1–5 or 1–6, open. Lidar (2 of 15; the corner cuts run along the
      // steps): front row 40 ft, 22° rake; what rises highest behind is the
      // upper deck's front edge, 64 ft up, which reaches out over 270's row
      // 5 (its underside ~53 ft).
      stand: { rows: 6, frontRowHeightFt: 40, rakeDeg: 22, backHeightFt: 64, backSetbackFt: -3, deckFrontFt: 62 },
      sections: { '270': { overhang: { coveredFromRow: 5, soffitHeightFt: 53 } } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...opacySections('204', '210', '268', '278', '288'), OPACY_LIDAR],
    },
    upper: {
      label: 'Upper deck (300s)',
      // Rows 1–25 (or 1–5 then 9–25), covered from row 15 by the roof
      // (sourced; the lidar puts the roof's edge over row 14). Lidar (29 of
      // 37): front row 63 ft (63–64), 30° rake (27–31); the roof's edge is
      // 119 ft up with nothing seen below it (a thin roof), and is what rises
      // highest behind.
      stand: { rows: 25, frontRowHeightFt: 63, rakeDeg: 30, backHeightFt: 122, backSetbackFt: -24, overhang: { coveredFromRow: 15, soffitHeightFt: 119 } },
      sections: {
        ...Object.fromEntries(OPACY_300_SKIPPING.map((id) => [id, { overhang: { coveredFromRow: 12, soffitHeightFt: 119 } }])),
        '381': { overhang: { coveredFromRow: 8, soffitHeightFt: 119 } }, // rows 8–25
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('308', '312', '330', '342', '360', '381', '388'), OPACY_LIDAR],
    },
    upperShort: {
      label: 'Upper deck (300s)',
      // 320, 338, 350, 358, 366: rows 1–8 only, in front of the covered
      // rows, so open. Lidar (338; the others join the rows behind them):
      // front row 64 ft, 30° rake; behind, the roof, 122 ft up.
      stand: { rows: 8, frontRowHeightFt: 64, rakeDeg: 30, backHeightFt: 122, backSetbackFt: 16 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...opacySections('320', '338', '350', '358', '366'), OPACY_LIDAR],
    },
    suite: {
      label: 'Suites',
      // The club's map lists them as suites: as at the other parks, one row
      // of seats under the suite level's ceiling, 9 ft above the floor.
      // Estimated ~50 ft up, behind the club level's last row (49 ft,
      // measured front and rake) and under the upper deck, which covers it
      // from row 5: 14 ft past them.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 64, overhang: { coveredFromRow: 1, soffitHeightFt: 59, reachFt: 14 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/orioles/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-11',
};

const rysPetco = (path: string) => `https://www.rateyourseats.com/petco-park/seating/${path}`;
const RYS_PETCO = rysPetco('shaded-covered-seats');
const petcoSections = (...ids: string[]) => ids.map((n) => rysPetco(`sections/${n}`));
/**
 * Covered rows at Petco Park as positions in each section's labelled rows
 * (Rate Your Seats' "Rows N and above are under cover"; most 100s have a
 * front block and a back block, so "row 32" is, say, 107's 22nd row).
 */
const PETCO_COVER: Record<string, number> = {
  '107': 22, '108': 22, '109': 25, '110': 25, '112': 25, '113': 32, '114': 31, '115': 31, '116': 31, '117': 31,
  '118': 30, '119': 25, '120': 29, '121': 23, '122': 30, '123': 14, '124': 18,
  '126': 8, '128': 8, '130': 8, '132': 8, '134': 6, '129': 21, '131': 20, '133': 20, '135': 20, '137': 21,
  '205': 11, '207': 11, '209': 9,
  '226': 15, '228': 15, '230': 17, '227': 23, '229': 21, '231': 21,
  '300': 15, '301': 13, '302': 13, '303': 17, '304': 17, '305': 13, '306': 13, '307': 19, '308': 19, '309': 15,
  '310': 15, '311': 15, '312': 15, '315': 15, '316': 15, '317': 19, '318': 19, '319': 15, '320': 15, '321': 13,
  '322': 11, '323': 17, '324': 15, '325': 15, '326': 19, '327': 17, '328': 15,
};
const petcoCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => PETCO_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: PETCO_COVER[id], soffitHeightFt } }]));

/** Seating ring of a Petco Park section. */
export function petcoTier(id: string): string | null {
  if (/^[A-L]$/.test(id)) return 'lexusClub';
  if (/^(PCS|TI|TR|TP|TL|GLS|WMS-)/.test(id)) return 'suite';
  // Group areas, named suites, the wheelchair platform 225 and 222 (not on
  // the club's 2026 drawing): no source places them or gives what covers them.
  if (!/^\d+$/.test(id) || id === '225' || id === '222') return null;
  const n = Number(id);
  if (n <= 106) return 'fieldVip';
  if (n === 111 || n === 125 || n === 127) return 'hundredCoverUnsourced';
  if (n <= 124) return 'hundred';
  if (n <= 137) return n % 2 === 0 ? 'leftLower' : 'rightLower';
  if (n <= 204) return 'terraceVip';
  if (n === 206 || n === 208 || n === 210) return 'terraceInfieldOpen';
  if (n <= 223) return 'terrace';
  if (n <= 235) return n % 2 === 0 ? 'leftReserved' : 'rightUpper';
  return 'upper';
}

// The 100s: a front block and a back block (up to 44 rows), the back of it
// under the Terrace level. Estimated: front row ~3 ft, 18° rake (last row
// ~41 ft), deck underside ~50 ft.
const PETCO_LIDAR = 'USGS 3DEP lidar CA_SanDiegoCo_D24, flown 2024-11-17 (scripts/measureStandHeights.py)';
// The 100s (lidar, 16 of 17): front row at field level (-2 to 2), 10° rake
// (5–30); what rises highest behind is 68 ft up (36–134).
const PETCO_100: StandProfile = { rows: 43, frontRowHeightFt: -1, rakeDeg: 10, backHeightFt: 68, backSetbackFt: 2 };

/**
 * Petco Park (2004). Field VIP and the Lexus Club behind home, the 100s, the
 * outfield stands, the Terrace level (200s) and the Upper level (300s)
 * covered from row 19. Sections come from the club's seat map, rows and
 * covered rows from Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (PETCO_LIDAR, November 2024),
 * as at Citizens Bank Park: for each section a cut straight back through its
 * rows gives the front row's height, the rake and the structure that rises
 * highest behind as seen from the middle uncovered row; tier values are
 * medians, sections more than 10% (at least 3 ft) off get their own. The
 * Terrace level's front is 36 ft (38), the Upper Box's 67 ft (75; the
 * Upper Deck's rows behind an aisle start ~80 ft), the roof 133 ft (118).
 * The light towers are not counted as walls; the downtown towers beyond the
 * outfield are. Covered rows: where the scan puts a deck's edge more than
 * two rows from the source's, the scan's edge is used, with the lowest
 * structure seen at it (or the deck above's front row less 9 ft) as the
 * underside, never less than 9 ft above the first covered row's floor.
 * Sections the scan does not find keep estimates, re-taken from the decks
 * measured around them.
 */
const PETCO: StadiumStructure = {
  stadiumId: 'padres',
  // Far rim (lidar): the stands' roof line, median over sections 134 ft (the
  // Upper level's roof); crossing: the median distance from a section to
  // what rises highest across the field, 824 ft (often the downtown towers).
  park: { roof: 'open', farRimHeightFt: 134, fieldCrossingFt: 824 },
  tierOf: petcoTier,
  tiers: {
    fieldVip: {
      label: 'Field VIP (101–106)',
      // Rows 8–20 or 8–22, open (seen from directly above on the photo,
      // 18–31 m behind home). Lidar (6 of 6): front row at field level (-2
      // to 2), 12° rake (9–14); what rises highest behind is the Upper
      // level's roof, 133 ft up and 88 ft back (66–103 ft behind 101–103,
      // measured).
      stand: { rows: 15, frontRowHeightFt: -1, rakeDeg: 12, backHeightFt: 133, backSetbackFt: 88 },
      sections: {
        '101': { backHeightFt: 134, backSetbackFt: 75 }, '102': { backHeightFt: 133, backSetbackFt: 66 }, '103': { backHeightFt: 133, backSetbackFt: 103 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...petcoSections('101', '102', '104', '106'), PETCO_LIDAR],
    },
    lexusClub: {
      label: 'Lexus Club (A–L)',
      // Rows 1–10 to 1–20, covered from row 9 (sourced). Lidar (8 of 12):
      // front row 10 ft (10–13), 19° rake (10–25); what rises highest
      // behind is the Terrace level's front edge, 36 ft up (71 in J). That
      // front reaches out over row 4 (1 in A), so the rows from there back
      // are covered (Rate Your Seats counts from 9), under an underside of
      // ~27 ft (that front row less 9 ft; in J the bottom of its face is
      // seen, 34 ft). In the 10-row A and B that front is 15 ft in front of
      // the last row (measured; B on a cut the tool's line from home misses).
      stand: { rows: 15, frontRowHeightFt: 10, rakeDeg: 19, backHeightFt: 36, backSetbackFt: -26, deckFrontFt: 36, overhang: { coveredFromRow: 4, soffitHeightFt: 27 } },
      sections: {
        'A': { backHeightFt: 38, backSetbackFt: -15, overhang: { coveredFromRow: 1, soffitHeightFt: 27 } },
        'B': { backHeightFt: 36, backSetbackFt: -15 },
        'J': { backHeightFt: 71, backSetbackFt: -11, overhang: { coveredFromRow: 4, soffitHeightFt: 34 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('A', 'C', 'F', 'J', 'L'), PETCO_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      stand: { ...PETCO_100, deckFrontFt: 36 },
      // Covered rows (Rate Your Seats) per section; the Terrace level's
      // front, 36 ft up, reaches out over row 17–26 in seven of them, more
      // than two rows ahead of the source's, and those take the scan's row
      // (the cross-aisle between the front and back blocks counts as rows
      // in that distance, as it does in the engine). Its underside: that
      // front row less 9 ft, ~27 ft (the lidar sees nothing lower). Sections
      // whose measured back stands more than 10 ft nearer or farther take
      // their own: that front 15–45 ft in front of the last row of the deep
      // sections (107, 112–116, 122), 19 ft behind the 23-row 124; the roof
      // 57 ft behind 108.
      sections: withBacks({
        ...petcoCover([...Array.from({ length: 18 }, (_, i) => String(107 + i))], 27),
        ...Object.fromEntries(['108', '110', '117', '118', '119', '120', '121'].map((id) => [id, { backHeightFt: 133, backSetbackFt: 32, ...petcoCover([id], 27)[id] }])),
        '109': { backHeightFt: 36, backSetbackFt: -62, overhang: { coveredFromRow: 17, soffitHeightFt: 27 } },
        '107': { overhang: { coveredFromRow: 17, soffitHeightFt: 27 } },
        '113': { overhang: { coveredFromRow: 21, soffitHeightFt: 26 } },
        ...Object.fromEntries(['114', '122'].map((id) => [id, { overhang: { coveredFromRow: 26, soffitHeightFt: id === '122' ? 28 : 27 } }])),
        '115': { overhang: { coveredFromRow: 24, soffitHeightFt: 28 } },
        '116': { overhang: { coveredFromRow: 24, soffitHeightFt: 27 } },
      }, {
        '107': [68, -18], '112': [68, -15], '113': [67, -45], '114': [67, -35], '115': [68, -40], '116': [68, -40], '122': [67, -33],
        '124': [68, 19], '108': [132, 57],
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('107', '110', '113', '116', '118', '119', '121', '124'), PETCO_LIDAR],
    },
    hundredCoverUnsourced: {
      label: 'Field level (100s)',
      // 111, 125 and 127: Rate Your Seats gives no covered rows. Lidar (3 of
      // 3): front row 7 ft (2 in 111), 15° rake (11–15); the deck above
      // reaches out over row 21 (17 in 111), which settles the cover, under
      // an underside of ~31 ft (9 ft above row 21's floor; 27 ft over 111,
      // the Terrace level's front less 9 ft). Behind, 76 ft up.
      stand: { rows: 43, frontRowHeightFt: 7, rakeDeg: 15, backHeightFt: 76, backSetbackFt: -15, deckFrontFt: 36, overhang: { coveredFromRow: 21, soffitHeightFt: 31 } },
      sections: { '111': { frontRowHeightFt: 2, backHeightFt: 36, backSetbackFt: -49, overhang: { coveredFromRow: 17, soffitHeightFt: 27 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('111', '125', '127'), PETCO_LIDAR],
    },
    leftLower: {
      label: 'Left Field Lower Box (126–134)',
      // Rows A–B and 1–11 (fewer in 130, 134), under the 226–230 deck from
      // row 6 (sourced). Lidar (5 of 5): front row 3 ft (3–4), 10° rake
      // (8–11); behind, 26 ft up (57–74 in 126 and 128). Estimated:
      // underside ~22 ft (23 over 126–132, covered from row 8).
      stand: { rows: 13, frontRowHeightFt: 3, rakeDeg: 10, backHeightFt: 26, backSetbackFt: -12 },
      // The scan puts the deck's edge over 126's row 1 (its lowest point
      // 20 ft up) and 132's row 5.
      sections: {
        ...petcoCover(['130', '134'], 23),
        '126': { backHeightFt: 74, backSetbackFt: -23, overhang: { coveredFromRow: 1, soffitHeightFt: 20 } },
        '128': { backHeightFt: 57, backSetbackFt: 0, ...petcoCover(['128'], 23)['128'] },
        '132': { overhang: { coveredFromRow: 5, soffitHeightFt: 23 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('126', '128', '130', '134'), PETCO_LIDAR],
    },
    rightLower: {
      label: 'Right Field Lower (129–137)',
      // Rows 1–25 (two blocks), covered from row 21 (sourced). Lidar (3 of
      // 5): front row 9 ft (7–10), 12° rake; behind, 49 ft up (135 in 129).
      // The deck's underside: the bottom of its face, seen once, 39 ft
      // (38 over 129, where the deck's edge is over row 25: its front row,
      // 47 ft, less 9 ft).
      stand: { rows: 25, frontRowHeightFt: 9, rakeDeg: 12, backHeightFt: 49, backSetbackFt: -16, deckFrontFt: 46 },
      sections: {
        ...petcoCover(['131', '133', '135', '137'], 39),
        '129': { backHeightFt: 135, backSetbackFt: 73, overhang: { coveredFromRow: 25, soffitHeightFt: 38 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('129', '131', '133', '137'), PETCO_LIDAR],
    },
    terraceVip: {
      label: 'Terrace VIP (201–204)',
      // Rows 1–8 or 1–9, open (202 and 204: "rows 5 and above are shaded
      // during most day games"). Lidar (4 of 4): front row 35 ft (33–36),
      // 22° rake (19–24); what rises highest behind is the deck above, 71 ft
      // up, just behind the last row. Its edge reaches out over 202's row 7
      // and 201's row 6 (underside ~60 ft, 50 over 201, where something
      // lower shows), so those rows are covered.
      stand: { rows: 9, frontRowHeightFt: 35, rakeDeg: 22, backHeightFt: 71, backSetbackFt: -5 },
      sections: {
        '201': { overhang: { coveredFromRow: 6, soffitHeightFt: 50 } },
        '202': { deckFrontFt: 69, overhang: { coveredFromRow: 7, soffitHeightFt: 60 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...petcoSections('201', '202', '203', '204'), PETCO_LIDAR],
    },
    terraceInfieldOpen: {
      label: 'Terrace Infield (206–210)',
      // Rows 1–10; no covered rows given (only "rows 5+ shaded during most
      // day games"). Lidar (3 of 3): front row 35 ft, 23° rake; the Upper
      // Box's front, 66 ft up, reaches out over row 6–8 (5 in 208), which
      // settles the cover, under an underside of ~57 ft (that front row less
      // 9 ft); behind, 68 ft up.
      stand: { rows: 10, frontRowHeightFt: 35, rakeDeg: 23, backHeightFt: 68, backSetbackFt: -14, deckFrontFt: 66, overhang: { coveredFromRow: 8, soffitHeightFt: 57 } },
      sections: { '208': { overhang: { coveredFromRow: 5, soffitHeightFt: 57 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('206', '208', '210'), PETCO_LIDAR],
    },
    terrace: {
      label: 'Terrace level (205–223)',
      // Rows 1–13 (205/207: 1–15, 209: 3–15), covered from row 7 (205–209:
      // row 11). Lidar (12 of 15): front row 36 ft (35–38), 22° rake
      // (19–23); the Upper Box's front, 67 ft up, reaches out over row 4
      // (3–6) in 9 of the 12, so the rows from 4 back are covered, under an
      // underside of ~57 ft (that front row less 9 ft). That edge is what
      // rises highest behind.
      stand: { rows: 13, frontRowHeightFt: 36, rakeDeg: 22, backHeightFt: 68, backSetbackFt: -25, deckFrontFt: 66, overhang: { coveredFromRow: 4, soffitHeightFt: 57 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('205', '209', '211', '216', '219', '223'), PETCO_LIDAR],
    },
    leftReserved: {
      label: 'Left Field Reserved (226–230)',
      // Rows up to 21; Rate Your Seats counts them covered from row 15–17.
      // Lidar (2 of 3): front row 26 ft, 21° rake (18–23); a structure
      // reaches out over row 9 (8–10), its lowest point 43 ft up, so the rows
      // from there back are covered (226, not measured, keeps its row, with
      // an underside 9 ft above that row's floor). Behind, 126 ft up.
      stand: { rows: 21, frontRowHeightFt: 26, rakeDeg: 21, backHeightFt: 126, backSetbackFt: -12, overhang: { coveredFromRow: 9, soffitHeightFt: 44 } },
      sections: petcoCover(['226'], 50),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('226', '228', '230'), PETCO_LIDAR],
    },
    rightUpper: {
      label: 'Right Field Upper (227–235)',
      // Rows 1–25; 227–231 covered from row 23, 233 and 235 open ("all right
      // field seats, especially on the 200 level, are not good for shade").
      // Lidar (4 of 5): front row 47 ft (36 in 227), 27° rake (17–29);
      // behind, 73 ft up (62–129; 78 ft right behind 227's last row, 67 ft
      // and 162 ft back behind 231). Estimated: underside 9 ft above the first
      // covered row's floor. Over 233's rows 19 and up a structure reaches
      // out, its lowest point 94 ft up, so those rows are covered.
      stand: { rows: 25, frontRowHeightFt: 47, rakeDeg: 27, backHeightFt: 73, backSetbackFt: 81 },
      sections: {
        ...petcoCover(['229'], 84),
        '231': { backHeightFt: 67, backSetbackFt: 162, ...petcoCover(['231'], 84)['231'] },
        '227': { frontRowHeightFt: 36, backHeightFt: 78, backSetbackFt: 1, ...petcoCover(['227'], 76)['227'] },
        '233': { backHeightFt: 129, backSetbackFt: -15, overhang: { coveredFromRow: 19, soffitHeightFt: 94 } },
        '235': { backHeightFt: 62, backSetbackFt: 191 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('227', '229', '233', '235'), PETCO_LIDAR],
    },
    upper: {
      label: 'Upper level (300s)',
      // Rows up to 27 (Upper Box rows in front, Upper Deck behind), covered
      // from row 19 (sourced); 313 and 314 (rows 1–3) and 329 (one row)
      // sit in front of it. Lidar (17 of 29): the Upper Box's front row
      // 67 ft (65–75), 29° rake (19–33; the Upper Deck's rows behind an aisle
      // start ~80 ft); the roof's edge is 133 ft up with nothing seen below
      // it (a thin roof), and is what rises highest behind (80–105 ft at the
      // ends). Its edge agrees with the source's row but in 304, 307, 322
      // and 326, which take the scan's (14–16). Lower "edges" over 311 and
      // 320–325 are the Upper Deck's rows behind the aisle, not a deck.
      // Sections whose measured back stands more than 10 ft nearer or
      // farther take their own (the roof's edge 32–39 ft in front of the
      // last row of 304, 307 and 326; the Upper Deck's rows behind the
      // aisle, ~80 ft up, start 20 ft behind 321's last row and 47 ft in
      // front of 323's). The short rows in front, 313 and 329, have the
      // step up to that aisle right behind them, 75 ft up (313's cut, on a
      // point the tool's line from home misses; 329's shows the same step).
      stand: { rows: 23, frontRowHeightFt: 67, rakeDeg: 29, backHeightFt: 133, backSetbackFt: -21 },
      sections: withBacks({
        ...petcoCover(Array.from({ length: 30 }, (_, i) => String(300 + i)), 133),
        ...Object.fromEntries(['304', '307'].map((id) => [id, { overhang: { coveredFromRow: 14, soffitHeightFt: 133 } }])),
        '322': { overhang: { coveredFromRow: 15, soffitHeightFt: 132 } },
        '326': { overhang: { coveredFromRow: 16, soffitHeightFt: 133 } },
        ...Object.fromEntries(['315', '328'].map((id) => [id, { backHeightFt: 98, backSetbackFt: -21, ...petcoCover([id], 133)[id] }])),
        '319': { backHeightFt: 105, backSetbackFt: 66, ...petcoCover(['319'], 133)['319'] },
        ...Object.fromEntries(['321', '323'].map((id) => [id, { backHeightFt: 80, backSetbackFt: -13, ...petcoCover([id], 133)[id] }])),
      }, { '304': [134, -33], '307': [133, -39], '326': [133, -32], '321': [79, 20], '323': [81, -47], '313': [75, 1], '329': [75, 1] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('300', '303', '307', '313', '317', '322', '328', '329'), PETCO_LIDAR],
    },
    suite: {
      label: 'Suites',
      // The club's suite map: as at the other parks, one row of seats under
      // the suite level's ceiling, 9 ft above the floor, the deck above
      // reaching past them as is typical. Estimated ~50 ft up, behind the
      // Terrace level's last row (49 ft, measured front and rake), under the
      // Upper Box (its front row 67 ft).
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 67, overhang: { coveredFromRow: 1, soffitHeightFt: 59, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://mktg.mlbstatic.com/padres/documents/y2026/suites_map.pdf'],
    },
  },
  reviewedOn: '2026-11-11',
};

const rysAngel = (path: string) => `https://www.rateyourseats.com/angel-stadium/seating/${path}`;
const RYS_ANGEL = rysAngel('shaded-covered-seats');
const angelSections = (...ids: string[]) => ids.map((n) => rysAngel(`sections/${n}`));

/** Seating ring of an Angel Stadium chart section. */
export function angelTier(id: string): string | null {
  if (/^STE\d+$/.test(id)) return 'suite';
  // The Legends boxes: no source gives their seats or what covers them.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 135) return 'field';
  if (n <= 233) return 'terrace';
  if (n <= 240) return 'rightPavilion';
  if (n <= 249) return 'rightPavilionUpper';
  if (n <= 260) return 'leftPavilion';
  if (n <= 351) return 'club';
  if (n <= 436) return 'loge';
  return 'view';
}

const ANGEL_LIDAR = 'USGS 3DEP lidar CA_CaliforniaGaps_B23, flown 2023-11-10, and CA_SoCal_Wildfires_B1_2018, flown 2018-08-12 (scripts/measureStandHeights.py)';

/**
 * Angel Stadium (1966, rebuilt 1998). The Field level (100s), the Terrace
 * (200s) entirely under the Club level, the Club (300s), the 400s and the
 * View level (500s) under a roof; pavilions in both outfields. Rows and
 * covered rows are Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (ANGEL_LIDAR: the 2023 tile
 * covers home plate's side of the park, which the 2018 scan leaves out; they
 * agree to 2 cm where both have ground), as at Citizens Bank Park: for each
 * section a cut straight back through its stand gives the front row's
 * height and the rake, the edge of any deck over it, and what rises highest
 * behind. Where a deck's edge is more than two rows from the source's
 * covered row (or covers three or more it leaves open), the scan's row is
 * used. The scan sees decks from above: a deck's underside is the bottom of
 * its face where seen; where only its front row of seats shows, that row
 * less 9 ft; never under 9 ft above the floor of the first covered row.
 * Not measured (tier values): the Terrace (hidden), 101, 105, 106, 110–112,
 * 120, 125, 128, 129, 133–135, 236, 241, 242, 245–249, 260, 322, 330, 347,
 * 348, 406, 434, 436 and 36 of the 40 500s.
 */
const ANGEL: StadiumStructure = {
  stadiumId: 'angels',
  // Far rim (lidar): the roof line, median over sections 123 ft; crossing:
  // the median distance from a section to it across the field, 614 ft.
  park: { roof: 'open', farRimHeightFt: 123, fieldCrossingFt: 614 },
  tierOf: angelTier,
  tiers: {
    field: {
      label: 'Field level (100s)',
      // Rows A–Z (C–Z or C–W behind the dugouts and home, AA–BB in front
      // in the corners), open; "only the last row of sections 104–113 is
      // shaded in the middle of the summer". Lidar (22 of 35): front row
      // 2 ft (0–3), 14° rake (10–17; an aisle part way back steps up ~1 ft);
      // what rises highest behind is the roof's edge, 123 ft up and 41 ft
      // back (in five, a lamp bank on it, 140 ft). Where a section runs past
      // 21 rows (the corners), the club level's front, 34–35 ft up, reaches
      // out over its row 22 (25 in 103), so those rows are covered, under an
      // underside of ~25 ft (that front row less 9 ft). Behind 119 the
      // roof's edge is 52 ft back (measured).
      stand: { rows: 26, frontRowHeightFt: 2, rakeDeg: 14, backHeightFt: 123, backSetbackFt: 41, deckFrontFt: 34, overhang: { coveredFromRow: 22, soffitHeightFt: 25 } },
      sections: {
        ...Object.fromEntries(['102', '113', '124', '131', '132'].map((id) => [id, { backHeightFt: 140, backSetbackFt: 38 }])),
        '103': { overhang: { coveredFromRow: 25, soffitHeightFt: 27 } },
        '119': { backHeightFt: 123, backSetbackFt: 52 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('101', '104', '110', '114', '118', '122', '126', '130', '135'), ANGEL_LIDAR],
    },
    terrace: {
      label: 'Terrace level (200s)',
      // Rows A–L, every row under the Club level (sourced). Hidden from the
      // air; estimated from the measured tiers around it: front ~16 ft (the
      // field level's last row behind home), 22° rake, the Club level's
      // underside ~26 ft (its front row, 35 ft, less 9 ft).
      stand: { rows: 12, frontRowHeightFt: 16, rakeDeg: 22, backHeightFt: 35, overhang: { coveredFromRow: 1, soffitHeightFt: 26 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('201', '209', '213', '221', '229', '233')],
    },
    rightPavilion: {
      label: 'Right-field pavilion (236–240)',
      // Rows A–Z and VV–YY, "zero protection from the sun". Lidar (4 of 5):
      // front row 13 ft above the field, 17° rake (15–18); behind, 111 ft
      // up and 44 ft back (68 in 238; 104–117 ft and 34–55 ft back behind
      // 237, 239 and 240, measured).
      stand: { rows: 30, frontRowHeightFt: 13, rakeDeg: 17, backHeightFt: 111, backSetbackFt: 44 },
      sections: {
        '238': { backHeightFt: 68, backSetbackFt: 57 },
        '239': { backHeightFt: 104, backSetbackFt: 55 },
        ...Object.fromEntries(['237', '240'].map((id) => [id, { backHeightFt: 117, backSetbackFt: 34 }])),
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('236', '238', '240'), ANGEL_LIDAR],
    },
    rightPavilionUpper: {
      label: 'Right-field pavilion (241–249)',
      // Rows A–M, open (as above). Lidar (2 of 9; further out its rows go on
      // from the lower pavilion's, ~37 ft up there too): front row 37 ft
      // (36–39), 23° rake; behind, a canopy 64 ft up and 16 ft back (30 ft
      // behind 244, right behind 243's last row).
      stand: { rows: 13, frontRowHeightFt: 37, rakeDeg: 23, backHeightFt: 64, backSetbackFt: 16 },
      sections: { '243': { backHeightFt: 64, backSetbackFt: 1 }, '244': { backHeightFt: 64, backSetbackFt: 30 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('241', '245', '249'), ANGEL_LIDAR],
    },
    leftPavilion: {
      label: 'Left-field pavilion (256–260)',
      // Rows A–Z or G–Z; no source says whether they are covered. Lidar (4
      // of 5; 260's place on the seat map cuts the field level's end): front
      // row 9 ft (3 in 256), 16° rake; no deck over any of them, which
      // settles the cover; behind, 32 ft up and 11 ft back (26–38).
      stand: { rows: 22, frontRowHeightFt: 9, rakeDeg: 16, backHeightFt: 32, backSetbackFt: 11 },
      sections: {
        '259': { backHeightFt: 26, backSetbackFt: 1 },
        ...Object.fromEntries(['257', '258'].map((id) => [id, { backHeightFt: 38, backSetbackFt: 21 }])),
        '256': { frontRowHeightFt: 3, backHeightFt: 26, backSetbackFt: 1 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...angelSections('257', '258', '259', '260'), ANGEL_LIDAR],
    },
    club: {
      label: 'Club level (300s)',
      // Rows A–H (330–351 behind the dugouts and toward right field); "rows E
      // and above are shaded during most day games". Lidar (40 of 44): front
      // row 35 ft (34–35), 23° rake (17–24); the 400s' front, 59–60 ft up,
      // reaches out over row 4–5 (2 in 331), which settles the cover: from
      // row E, under an underside of ~50 ft (that front row less 9 ft). It is
      // also what rises highest behind: 10 ft in front of the last row, 2–6
      // ft behind it in the 3-row 349–351 (measured), which end before it.
      stand: { rows: 8, frontRowHeightFt: 35, rakeDeg: 23, backHeightFt: 60, backSetbackFt: -10, deckFrontFt: 59, overhang: { coveredFromRow: 5, soffitHeightFt: 50 } },
      sections: {
        '331': { overhang: { coveredFromRow: 2, soffitHeightFt: 50 } },
        '349': { backHeightFt: 60, backSetbackFt: 2 }, '350': { backHeightFt: 61, backSetbackFt: 6 }, '351': { backHeightFt: 61, backSetbackFt: 2 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('301', '310', '321', '330', '340', '351'), ANGEL_LIDAR],
    },
    loge: {
      label: '400 level',
      // Rows A–J, open ("all seats shaded during most late afternoon games"
      // on the third-base side). Lidar (33 of 36): front row 60 ft (58–62),
      // 32° rake (30–33); behind, the View level rises to its roof, whose
      // edge is 123 ft up, 4 ft behind the last row (in seven, a lamp bank
      // on it, 137–141 ft).
      stand: { rows: 10, frontRowHeightFt: 60, rakeDeg: 32, backHeightFt: 123, backSetbackFt: 4 },
      sections: {
        ...Object.fromEntries(['404', '411'].map((id) => [id, { backHeightFt: 137, backSetbackFt: 2 }])),
        ...Object.fromEntries(['402', '410', '426', '427', '433'].map((id) => [id, { backHeightFt: 141, backSetbackFt: 4 }])),
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...angelSections('401', '410', '418', '421', '430', '436'), ANGEL_LIDAR],
    },
    view: {
      label: 'View level (500s)',
      // Rows A–R, under the roof from row D (sourced). Lidar (4 of 40; the
      // others' rows go on from the 400s' with no step to find): front row
      // 80 ft, 32° rake (30–33). The roof's edge, 123 ft up (its top; at 511
      // and 512 a lamp bank on it comes first), is over row A in all four,
      // three rows ahead of the source's, so the rows from A are covered.
      stand: { rows: 18, frontRowHeightFt: 80, rakeDeg: 32, backHeightFt: 122, backSetbackFt: -44, overhang: { coveredFromRow: 1, soffitHeightFt: 123 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('501', '510', '520', '530', '540'), ANGEL_LIDAR],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor. Estimated ~43 ft up, behind the Club
      // level's last row (43 ft, measured front and rake) and under the
      // 400s (their front row 60 ft), which cover it from row 5, so they
      // reach 11 ft past them.
      stand: { rows: 1, frontRowHeightFt: 43, rakeDeg: 0, backHeightFt: 60, overhang: { coveredFromRow: 1, soffitHeightFt: 52, reachFt: 11 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/angels/tickets/seating-map/3d'],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysCoors = (path: string) => `https://www.rateyourseats.com/coors-field/seating/${path}`;
const RYS_COORS = rysCoors('shaded-covered-seats');
const coorsSections = (...ids: string[]) => ids.map((n) => rysCoors(`sections/${n}`));
/**
 * Coors Field's covered rows as positions in each section's numbered rows
 * (Rate Your Seats), where the profile keeps them: the right-field seats and
 * the full-height upper-level sections. (The 100s, the club level and the U
 * rows take the scan's; their sourced rows are in the comments.)
 */
const COORS_COVER: Record<string, number> = {
  '105': 10, '106': 10, '107': 10, '108': 10, '109': 11,
  L311: 19, L313: 19, L319: 19, L343: 19, L345: 19,
};
const coorsCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => COORS_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: COORS_COVER[id], soffitHeightFt } }]));
const cover = (coveredFromRow: number, soffitHeightFt: number) => ({ overhang: { coveredFromRow, soffitHeightFt } });

/** Seating ring of a Coors Field chart section. */
export function coorsTier(id: string): string | null {
  if (/^\d{1,2}$/.test(id)) return 'suite';
  if (/^L\d{3}$/.test(id)) return 'upperFront';
  if (/^U\d{3}$/.test(id)) return 'upperBack';
  // Clubs, decks and picnic areas: no source gives their seats or cover.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 109) return 'rightBleachers';
  if (n <= 114) return 'rightCorner';
  if (n >= 128 && n <= 133) return 'fieldHome';
  if (n <= 147) return 'field';
  if (n <= 150) return 'leftCorner';
  if (n <= 160) return 'leftStands';
  if (n <= 299) return 'club';
  if (n <= 309) return 'rightReserve';
  return 'rockpile';
}

const COORS_LIDAR = 'USGS 3DEP lidar CO_DRCOG_2020, flown 2020-05-27 (scripts/measureStandHeights.py)';

/**
 * Coors Field (1995). A deep 100 level (rows to 38, the back under the club
 * level), the club level (200s), suites, the 300s split by a walkway (L in
 * front, U behind, under a roof), bleachers in right field and the Reserve
 * Level Outfield above them, the left-field stands and the Rockpile in
 * center. Rows and covered rows are Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (COORS_LIDAR, May 2020; no
 * later scan covers Denver), as at Citizens Bank Park: for each section a
 * cut straight back through its stand gives the front row's height and the
 * rake, the edge of any deck over it, and what rises highest behind. Where
 * a deck's edge is more than two rows from the source's covered row, the
 * scan's row is used. The scan sees decks from above: a deck's underside is
 * the bottom of its face where seen; where only its front row of seats shows,
 * that row less 9 ft; never under 9 ft above the floor of the first covered
 * row. Not measured (tier values): 109, 151, 201, 203, 208, 209, 214, 215,
 * 217, 247, L311–L313, L316–L318, L325, L336, U312 and U329.
 */
const COORS: StadiumStructure = {
  stadiumId: 'rockies',
  // Far rim (lidar): the roof line, median over sections 128 ft; crossing:
  // the median distance from a section to it across the field, 591 ft.
  park: { roof: 'open', farRimHeightFt: 128, fieldCrossingFt: 591 },
  tierOf: coorsTier,
  tiers: {
    field: {
      label: 'Field level (100s)',
      // Rows 1–38 (fewer in some), the back under the club level (Rate Your
      // Seats: covered from row 32; 37 in 115–117, 28 in 122–125 and
      // 136–139, 29 in 126, 127, 134 and 135). Lidar (24 of 24): front row
      // at field level (-1 to 3 ft), 12° rake (11–13); what rises highest
      // behind is the roof's edge, 128 ft up and 30 ft behind the last row
      // (in eight, the upper level's front, 68–73 ft, over the last rows).
      // The club level's front, 34 ft up, reaches out over row 26 (22 in
      // 123–125 and 135–138, 29–33 in 116–119, 121, 144 and 145): more
      // than two rows ahead of the source's in 19 of 24, so the tier takes
      // the scan's rows. In 116 and 117 the field level's front runs at an
      // angle to the deck's, so the row varies across the section (27–29
      // on a cut nearer the foul line). The underside ~25 ft (that front
      // row less 9 ft; 26–28 over row 29–33, 9 ft above the floor). The
      // roof's edge stands 42–48 ft behind 116, 117, 122 and 144 (measured).
      stand: { rows: 38, frontRowHeightFt: 0, rakeDeg: 12, backHeightFt: 128, backSetbackFt: 30, deckFrontFt: 34, overhang: { coveredFromRow: 26, soffitHeightFt: 25 } },
      sections: withBacks({
        '116': cover(31, 27),
        '117': cover(33, 28),
        ...Object.fromEntries(['118', '119'].map((id) => [id, { backHeightFt: 68, backSetbackFt: -9, ...cover(29, 25) }])),
        ...Object.fromEntries(['121', '144'].map((id) => [id, cover(30, 26)])),
        '145': { backHeightFt: 68, backSetbackFt: -9, ...cover(30, 26) },
        ...Object.fromEntries(['123', '124', '125', '135', '138'].map((id) => [id, cover(22, 25)])),
        ...Object.fromEntries(['136', '137'].map((id) => [id, { backHeightFt: 68, backSetbackFt: -9, ...cover(22, 25) }])),
        ...Object.fromEntries(['139', '140'].map((id) => [id, { backHeightFt: 68, backSetbackFt: -9 }])),
        '141': { backHeightFt: 73, backSetbackFt: -2 },
      }, { '116': [129, 44], '117': [129, 46], '122': [127, 48], '144': [128, 42] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('116', '118', '122', '126', '134', '136', '140', '147'), COORS_LIDAR],
    },
    fieldHome: {
      label: 'Field level behind home (128–133)',
      // Rows 4–38. Rate Your Seats calls rows 36, 36, 35, 34, 33 and 28 and
      // up "shaded during most day games" rather than covered; on the photo
      // a shadow band runs over the last rows (41–45 m out). Lidar (6 of 6):
      // front row 1 ft, 13° rake; what rises highest behind is the roof's
      // edge, 129 ft up and 34 ft back. A deck's edge is over row 30–32 in
      // all six, which settles the cover: over 129–132 the upper level's
      // front (67 ft; the club level does not run behind home), under an
      // underside of ~58 ft (that front row less 9 ft); over 128 and 133
      // the club level's end (36–38 ft), from row 30 and 28 (the photo gave
      // 25 in 133), under ~27–29 ft (9 ft above the floor).
      stand: { rows: 35, frontRowHeightFt: 1, rakeDeg: 13, backHeightFt: 129, backSetbackFt: 34, deckFrontFt: 67, overhang: { coveredFromRow: 32, soffitHeightFt: 58 } },
      sections: {
        '128': { deckFrontFt: 38, ...cover(30, 29) },
        '129': cover(33, 58),
        '130': cover(32, 58),
        '131': cover(31, 58),
        '132': cover(30, 58),
        '133': { deckFrontFt: 36, ...cover(28, 27) },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...coorsSections('128', '130', '131', '133'), COORS_LIDAR],
    },
    rightBleachers: {
      label: 'Right-field seats (105–109)',
      // Rows 2–14, covered from row 11 (position 10) by the club level
      // (sourced). Lidar (4 of 5): front row 15 ft above the field, 13°
      // rake; behind, the upper level's front, 68 ft up, 14 ft in front of
      // the last row. The club level's edge is over row 8 (7 in 105, which
      // takes it). Its underside ~30 ft: its front row (34 ft) less 9 ft
      // would leave under 9 ft above the floor, so 9 ft above it.
      stand: { rows: 13, frontRowHeightFt: 15, rakeDeg: 13, backHeightFt: 68, backSetbackFt: -14, deckFrontFt: 33 },
      sections: { ...coorsCover(['106', '107', '108', '109'], 30), '105': cover(7, 28) },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('105', '107', '109'), COORS_LIDAR],
    },
    rightCorner: {
      label: 'Right-field corner (110–114)',
      // Partial sections (rows 3–38 to 22–38), not covered. Lidar (1 of 1):
      // front row at field level, 13° rake; what rises highest behind is
      // the roof's edge, 128 ft up and 53 ft back.
      stand: { rows: 20, frontRowHeightFt: 0, rakeDeg: 13, backHeightFt: 128, backSetbackFt: 53 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('110', '112', '114'), COORS_LIDAR],
    },
    leftCorner: {
      label: 'Left-field corner (148–150)',
      // Rows 5–38 or 14–38, not covered. Lidar (1 of 1): front row at field
      // level (-2 ft), 12° rake; behind, 25 ft up and 43 ft back.
      stand: { rows: 25, frontRowHeightFt: -2, rakeDeg: 12, backHeightFt: 25, backSetbackFt: 43 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...coorsSections('148', '149', '150'), COORS_LIDAR],
    },
    leftStands: {
      label: 'Left-field stands (151–160)',
      // Rows 2–23 or 2–20, not covered ("in June and July the sunniest
      // seats"). Lidar (9 of 10; 151's place on the seat map cuts a ramp):
      // front row 5 ft (5–8), 18° rake (16–18); behind, 39 ft up and 43 ft
      // back (the scoreboard in 154, 107 ft).
      stand: { rows: 22, frontRowHeightFt: 5, rakeDeg: 18, backHeightFt: 39, backSetbackFt: 43 },
      sections: {
        '154': { backHeightFt: 107, backSetbackFt: 43 },
        ...Object.fromEntries(['155', '159'].map((id) => [id, { backHeightFt: 25, backSetbackFt: 7 }])),
        '157': { backHeightFt: 32, backSetbackFt: 21 },
        '158': { backHeightFt: 76, backSetbackFt: 45 },
        '160': { backHeightFt: 48, backSetbackFt: 21 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('151', '155', '160'), COORS_LIDAR],
    },
    club: {
      label: 'Club level (200s)',
      // Rows 1–13 covered from row 8; 201–209 in right field covered from
      // row 4 (sourced). Lidar (25 of 33): front row 34 ft (33–35), 21° rake
      // (20–28); behind, the upper level's front, 68 ft up, over the last
      // rows. That front reaches out over row 5 (1–2 in 202 and 204–207):
      // more than two rows ahead of the source's in 23 of 25, so the tier
      // takes the scan's rows (201, 203, 208 and 209, not measured, keep
      // row 4). Its underside ~58 ft (that front row, 67 ft, less 9 ft).
      // In the 17-row 205 and 206 that front is 43 ft in front of the last
      // row, in the 6-row 201–203 11–12 ft (measured; 201 and 203 on cuts
      // through points the tool's line from home misses, their edge over
      // row 2, within two rows of the source's 4).
      stand: { rows: 13, frontRowHeightFt: 34, rakeDeg: 21, backHeightFt: 68, backSetbackFt: -23, deckFrontFt: 67, overhang: { coveredFromRow: 5, soffitHeightFt: 58 } },
      sections: {
        ...Object.fromEntries(['208', '209'].map((id) => [id, cover(4, 58)])),
        ...Object.fromEntries(['201', '203'].map((id) => [id, { backHeightFt: 68, backSetbackFt: -11, ...cover(4, 58) }])),
        '202': { backHeightFt: 68, backSetbackFt: -12, ...cover(2, 58) },
        '204': cover(1, 58),
        '206': { backHeightFt: 69, backSetbackFt: -43, ...cover(1, 58) },
        '205': { backHeightFt: 68, backSetbackFt: -43, ...cover(1, 57) },
        '207': cover(2, 57),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('201', '205', '214', '221', '227', '234', '241', '247'), COORS_LIDAR],
    },
    rightReserve: {
      label: 'Reserve Level Outfield (301–309)',
      // Rows 1–5 in the right-field upper deck, open: "sun exposure will be
      // some of the heaviest in these seats". Lidar (9 of 9): front row
      // 68 ft (67–68), 27° rake (18–30); what rises highest behind is the
      // roof line, 128 ft up and 29 ft back (lower in 301–303 and 305, the
      // Rooftop's deck; 43 ft back behind 309).
      stand: { rows: 5, frontRowHeightFt: 68, rakeDeg: 27, backHeightFt: 128, backSetbackFt: 29 },
      sections: {
        '309': { backHeightFt: 129, backSetbackFt: 43 },
        '301': { backHeightFt: 97, backSetbackFt: 17 },
        ...Object.fromEntries(['302', '303'].map((id) => [id, { backHeightFt: 93, backSetbackFt: 0 }])),
        '305': { backHeightFt: 103, backSetbackFt: 12 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...coorsSections('305'), COORS_LIDAR],
    },
    upperFront: {
      label: 'Upper level (300s, in front of the walkway)',
      // Rows 1–5 or 1–9 in front of the walkway, open; full-height sections
      // (rows 1–25) covered from row 19 by the roof (sourced). Lidar (21 of
      // 29; L311's cut crosses its rows at an angle): front row 67 ft
      // (67–68), 27° rake (25–30); what rises highest behind is the roof's
      // edge, 128 ft up and 30 ft back. In L319 and L343 that edge is over
      // row 16, which they take. Its underside: 128 ft (the roof's top; the
      // scan sees nothing under it). In L345 the edge is over row 17, two
      // rows ahead of the source's 19, under option A's mark, but it is then
      // what rises behind rows 17 and 18, which would leave them with
      // nothing behind: so they are covered too (as at Nationals Park's
      // Gallery). In the 25-row sections the edge stands 25 ft in front of
      // the last row, 19 ft behind the 9-row L329 and L332 (measured).
      stand: { rows: 9, frontRowHeightFt: 67, rakeDeg: 27, backHeightFt: 128, backSetbackFt: 30 },
      sections: {
        ...coorsCover(['L311', 'L313'], 128),
        L342: { backHeightFt: 106, backSetbackFt: 29 },
        L321: { backHeightFt: 83, backSetbackFt: 9 },
        L319: { backHeightFt: 100, backSetbackFt: -17, ...cover(16, 128) },
        L343: { backHeightFt: 128, backSetbackFt: -25, ...cover(16, 128) },
        L345: { backHeightFt: 128, backSetbackFt: -25, ...cover(17, 128) },
        L329: { backHeightFt: 128, backSetbackFt: 19 },
        L332: { backHeightFt: 129, backSetbackFt: 19 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('311', '315', '319', '331', '343', '345'), COORS_LIDAR],
    },
    upperBack: {
      label: 'Upper level (300s, behind the walkway)',
      // Rows 10–25, covered from row 19 (position 10; sourced). Lidar (7 of
      // 9): front row 85 ft (83–85), 31° rake (28–31). The roof's edge, 128
      // ft up (its top), is over position 6 (row 15; 7–8 in two): more than
      // two rows ahead of the source's in 6 of 7, so the tier takes it.
      stand: { rows: 16, frontRowHeightFt: 85, rakeDeg: 31, backHeightFt: 128, backSetbackFt: -27, overhang: { coveredFromRow: 6, soffitHeightFt: 128 } },
      sections: {
        U340: { backHeightFt: 106, backSetbackFt: -27 },
        U336: { backHeightFt: 103, backSetbackFt: -27 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('312', '317', '325', '332', '340'), COORS_LIDAR],
    },
    rockpile: {
      label: 'The Rockpile (401–403)',
      // Rows 1–30 in center field, not covered. Lidar (1 of 1): front row
      // 51 ft, 23° rake; nothing rises behind it (its own top, 85 ft).
      stand: { rows: 30, frontRowHeightFt: 51, rakeDeg: 23, backHeightFt: 85 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...coorsSections('401', '402', '403'), COORS_LIDAR],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor. Estimated ~47 ft up, behind the club
      // level's last row (47 ft, measured front and rake) and under the
      // upper level (its front row 67 ft), which covers the club level from
      // row 5, so it reaches 25 ft past them.
      stand: { rows: 1, frontRowHeightFt: 47, rakeDeg: 0, backHeightFt: 67, overhang: { coveredFromRow: 1, soffitHeightFt: 56, reachFt: 25 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/rockies/ballpark/seat-viewer'],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysKauffman = (path: string) => `https://www.rateyourseats.com/kauffman-stadium/seating/${path}`;
const RYS_KAUFFMAN = rysKauffman('shaded-covered-seats');
const kauffmanSections = (...ids: string[]) => ids.map((n) => rysKauffman(`sections/${n}`));

/** Seating ring of a Kauffman Stadium chart section. */
export function kauffmanTier(id: string): string | null {
  if (/^STE\d+[A-D]?$/.test(id)) return 'suite';
  // Clubs, crown seats, dugout suites, tables and standing areas: no source
  // gives their seats or cover.
  if (!/^\d{3}R?$/.test(id)) return null;
  const n = Number(id.slice(0, 3));
  if (n <= 106 || (n >= 150 && n < 200)) return 'outfield';
  if (n <= 148) return 'field';
  if (n <= 203) return 'outfield';
  if (n <= 252) {
    if (n === 206 || n === 207 || n === 208 || n >= 247) return 'plazaOpen';
    return n <= 213 || n >= 242 ? 'plazaCorner' : 'plaza';
  }
  if (n <= 325) return 'loge';
  if (id.endsWith('R')) return 'upperTop';
  return 'upper';
}

const KAUFFMAN_LIDAR = 'USGS 3DEP lidar MO_FEMANRCS_2020, flown 2020-04-18 (scripts/measureStandHeights.py)';

/**
 * Kauffman Stadium (1973, renovated 2009). The 100s and the 200s (Plaza)
 * form the lower bowl, the Plaza's back rows under the Loge (300s), the
 * Loge under the upper deck, and the 400s (single-letter rows A–V in front,
 * double-letter rows AA–ZZ behind) under a roof. Rows and covered rows are
 * Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (KAUFFMAN_LIDAR, April 2020;
 * no later scan covers the park; the 2025 outfield walls moved in, not the
 * stands), as at Citizens Bank Park: for each section a cut straight back
 * through its stand gives the front row's height and the rake, the edge of
 * any deck over it, and what rises highest behind. Where a deck's edge is
 * more than two rows from the source's covered row (or covers three or more
 * it leaves open), the scan's row is used. The scan sees decks from above: a
 * deck's underside is the bottom of its face where seen; where only its
 * front row of seats shows, that row less 9 ft; never under 9 ft above the
 * floor of the first covered row. The Loge and the double-letter rows are
 * hidden (estimated from the measured tiers around them). Not measured
 * (tier values): 103–107, 109, 111, 148, 150–152, 201–203, 206–208, 210,
 * 214–217, 234, 236, 238–240, 242, 245–247, 249, 251, 252, 404, 408, 414,
 * 417–426, 438, 439 and the double-letter rows.
 */
const KAUFFMAN: StadiumStructure = {
  stadiumId: 'royals',
  // Far rim (lidar): the roof line, median over sections 151 ft; crossing:
  // the median distance from a section to it across the field, 587 ft.
  park: { roof: 'open', farRimHeightFt: 151, fieldCrossingFt: 587 },
  tierOf: kauffmanTier,
  tiers: {
    field: {
      label: 'Field level (100s)',
      // Rows A–X (fewer in the corners), no cover ("all 100 level sections
      // are exposed to the sun until at least 3:00"). Lidar (38 of 42): front
      // row 3 ft (-1 to 4), 14° rake (12–28); what rises highest behind is
      // the roof's edge, 157 ft up and 66 ft back (in nine, the upper deck's
      // front, 60 ft, 25 ft back). No deck over them. Sections whose measured
      // back stands more than 10 ft nearer or farther take their own: behind
      // home (113, 122–134) the roof's edge is 86–101 ft back, behind 112,
      // 142 and 143 the upper deck's front 11–14 ft back.
      stand: { rows: 24, frontRowHeightFt: 3, rakeDeg: 14, backHeightFt: 157, backSetbackFt: 66 },
      sections: withBacks({
        ...Object.fromEntries(['108', '110', '112', '142', '143', '145', '146', '147'].map((id) => [id, { backHeightFt: 60, backSetbackFt: 25 }])),
        ...Object.fromEntries(['126', '129', '131', '132'].map((id) => [id, { frontRowHeightFt: -1 }])),
        '144': { frontRowHeightFt: -1, backHeightFt: 60, backSetbackFt: 25 },
      }, {
        '113': [141, 91], '122': [161, 88], '123': [160, 91], '124': [161, 94], '125': [150, 89], '126': [150, 89],
        '127': [150, 93], '129': [150, 99], '130': [151, 101], '131': [157, 99], '132': [161, 89], '133': [161, 88], '134': [161, 86],
        '112': [60, 14], '142': [60, 11], '143': [60, 14],
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('107', '112', '118', '127', '132', '140', '147'), KAUFFMAN_LIDAR],
    },
    outfield: {
      label: 'Outfield seats (101–106, 150–152, 201–203)',
      // A few rows each, no cover ("no cover in the outfield"). Lidar (2 of
      // 12; the others' cuts run on into the terraces around them): front
      // row 7 ft, 29° rake (25–32); behind, 44 ft up and 28 ft back.
      stand: { rows: 4, frontRowHeightFt: 7, rakeDeg: 29, backHeightFt: 44, backSetbackFt: 28 },
      sections: { '101': { backHeightFt: 65, backSetbackFt: 45 }, '102': { backHeightFt: 24, backSetbackFt: 11 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('101', '104', '150', '201'), KAUFFMAN_LIDAR],
    },
    plaza: {
      label: 'Plaza (214–241)',
      // Rows AA–TT, covered from row LL (sourced; by the Loge). Lidar (11 of
      // 20): front row 16 ft, 22° rake (20–24). The upper deck's front, 60 ft
      // up, reaches out over row 6 (FF), more than two rows ahead of the
      // source's in all 11, so the rows from there back are covered, under
      // an underside of ~50 ft (that front row less 9 ft; the Loge's lower
      // deck, from LL, is hidden under it). What rises highest behind is that
      // front, 39 ft in front of the last row.
      stand: { rows: 20, frontRowHeightFt: 16, rakeDeg: 22, backHeightFt: 60, backSetbackFt: -39, deckFrontFt: 59, overhang: { coveredFromRow: 6, soffitHeightFt: 50 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('214', '219', '225', '232', '241'), KAUFFMAN_LIDAR],
    },
    plazaCorner: {
      label: 'Plaza corners (209–213, 242–246)',
      // Rows AA–TT, covered from row NN (sourced). Lidar (6 of 10): front
      // row 16 ft, 21° rake; the upper deck's front reaches out over row 6
      // in all six (5–7), so the rows from there back are covered, under
      // ~50 ft (as in the Plaza). In 211, whose 14 rows end sooner, that
      // front is 21 ft in front of the last row (measured).
      stand: { rows: 20, frontRowHeightFt: 16, rakeDeg: 21, backHeightFt: 60, backSetbackFt: -37, deckFrontFt: 59, overhang: { coveredFromRow: 6, soffitHeightFt: 50 } },
      sections: { '211': { backHeightFt: 60, backSetbackFt: -21 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('209', '213', '242', '246'), KAUFFMAN_LIDAR],
    },
    plazaOpen: {
      label: 'Plaza ends (206–208, 247–252)',
      // Rows AA–TT, past the end of the Loge deck: no cover given ("247–252
      // get the worst of it" late in the day). Lidar (all 9; seven on cuts
      // through a point the tool's line from home plate misses): front row
      // 16–21 ft, 11–19° rake (taken as 17 ft, 16°). The upper deck's end
      // reaches over the six nearest the foul lines, its edge angled across
      // them: over row 8 of 208 and 247, 9 of 207 and 248, 11 of 206 and 14
      // of 249, three or more rows, which they take (option A; underside
      // ~51 ft, its front less 9 ft); behind, its rows rise 60–63 ft, 18–26
      // ft in front of the last row (each section's own). 250–252 are open, under nothing: behind
      // them a roof 33 ft up, right behind the last row.
      stand: { rows: 20, frontRowHeightFt: 17, rakeDeg: 16, backHeightFt: 33, backSetbackFt: 1, deckFrontFt: 60 },
      sections: {
        '206': { backHeightFt: 60, backSetbackFt: -23, overhang: { coveredFromRow: 11, soffitHeightFt: 51 } },
        '207': { backHeightFt: 61, backSetbackFt: -26, overhang: { coveredFromRow: 9, soffitHeightFt: 51 } },
        '208': { backHeightFt: 62, backSetbackFt: -26, overhang: { coveredFromRow: 8, soffitHeightFt: 51 } },
        '247': { backHeightFt: 63, backSetbackFt: -26, overhang: { coveredFromRow: 8, soffitHeightFt: 51 } },
        '248': { backHeightFt: 61, backSetbackFt: -26, overhang: { coveredFromRow: 9, soffitHeightFt: 51 } },
        '249': { backHeightFt: 60, backSetbackFt: -18, overhang: { coveredFromRow: 14, soffitHeightFt: 51 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('206', '208', '247', '252'), KAUFFMAN_LIDAR],
    },
    loge: {
      label: 'Loge (301–325)',
      // Rows A–G or A–J, all covered by the upper deck (sourced). Hidden from
      // the air; estimated between the measured tiers: front ~40 ft (over
      // the Plaza's row LL, 27 ft), 20° rake, the upper deck's underside
      // ~51 ft (its front row, 60 ft, less 9 ft).
      stand: { rows: 10, frontRowHeightFt: 40, rakeDeg: 20, backHeightFt: 60, overhang: { coveredFromRow: 1, soffitHeightFt: 51 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('303', '310', '316', '325')],
    },
    upper: {
      label: 'Upper deck (400s, rows A–V)',
      // Single-letter rows, no cover given. Lidar (22 of 37; behind home the
      // front rows sit below a step): front row 60 ft (59–61), 32° rake
      // (31–33); what rises highest behind is the roof's edge, 156 ft up and
      // 12 ft back. That edge is over their last rows; in five over row
      // 16–20, three or more rows, which they take, under its face's
      // bottom, 152–154 ft (153 in 409, where none is seen). Sections whose
      // measured back stands more than 10 ft nearer or farther take their
      // own: the edge is 1–6 ft in front of the last row of the full 19–22
      // row sections (405–413, 429–435) and 22–32 ft behind the 10–12 row
      // ones (410, 412, 416, 428, 430, 434, 436). Where it is over only the
      // last row or two (405, 407, 411, 413, 433), under option A's
      // three-row mark, its edge is what rises behind them, just in front of
      // the last row, which would leave the rows under it with nothing
      // behind: so they are covered too (as at Nationals Park's Gallery),
      // under its face's bottom or lowest structure there, 149–154 ft (153
      // in 405, where none is seen).
      stand: { rows: 22, frontRowHeightFt: 60, rakeDeg: 32, backHeightFt: 156, backSetbackFt: 12 },
      sections: withBacks({
        '403': { backHeightFt: 135, backSetbackFt: 33, overhang: { coveredFromRow: 16, soffitHeightFt: 154 } },
        '437': { backHeightFt: 135, backSetbackFt: 33, overhang: { coveredFromRow: 16, soffitHeightFt: 152 } },
        '429': { overhang: { coveredFromRow: 20, soffitHeightFt: 153 } },
        '431': { overhang: { coveredFromRow: 20, soffitHeightFt: 154 } },
        '409': { overhang: { coveredFromRow: 19, soffitHeightFt: 153 } },
        '405': { overhang: { coveredFromRow: 18, soffitHeightFt: 153 } },
        '407': { overhang: { coveredFromRow: 19, soffitHeightFt: 151 } },
        '411': { overhang: { coveredFromRow: 21, soffitHeightFt: 150 } },
        '413': { overhang: { coveredFromRow: 21, soffitHeightFt: 149 } },
        '433': { overhang: { coveredFromRow: 19, soffitHeightFt: 154 } },
      }, {
        '405': [157, -2], '407': [156, -2], '409': [157, -6], '411': [154, -6], '413': [158, -4],
        '429': [161, -4], '431': [161, -2], '433': [155, -2], '435': [157, -1],
        '410': [157, 22], '412': [161, 24], '416': [150, 32], '428': [161, 25], '430': [161, 24], '434': [154, 22], '436': [149, 29],
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('404', '409', '417', '427', '439'), KAUFFMAN_LIDAR],
    },
    upperTop: {
      label: 'Upper deck (400s, rows AA–ZZ)',
      // Double-letter rows; 409–431 covered from row MM by the roof
      // (sourced); 402–407 and 433–438 open ("the roof does not reach").
      // Mostly hidden from the air under the roof; their rows carry on from
      // the single-letter rows' (seen at the ends, 92–98 ft at AA): front
      // ~98 ft, 32° rake. The roof's back end, 130–136 ft (measured), is what
      // rises behind; it is ~140 ft over row MM (its top there). Its edge is
      // over the single-letter rows, and at 437 it is over these rows too,
      // so the scan suggests it covers them from AA.
      stand: { rows: 26, frontRowHeightFt: 98, rakeDeg: 32, backHeightFt: 132 },
      sections: Object.fromEntries(['409R', '411R', '412R', '413R', '415R', '417R', '419R', '420R', '421R', '423R', '425R', '427R', '428R', '429R', '431R']
        .map((id) => [id, { overhang: { coveredFromRow: 12, soffitHeightFt: 140 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('403', '409', '413', '421', '431', '437')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor. Estimated ~49 ft up, behind the Loge's
      // last row (49 ft, estimated) and under the upper deck (its front row
      // 60 ft, measured), which covers all of the Loge: 28 ft past them.
      stand: { rows: 1, frontRowHeightFt: 49, rakeDeg: 0, backHeightFt: 60, overhang: { coveredFromRow: 1, soffitHeightFt: 58, reachFt: 28 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/royals/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysGabp = (path: string) => `https://www.rateyourseats.com/great-american-ball-park/seating/${path}`;
const RYS_GABP = rysGabp('shaded-covered-seats');
const gabpSections = (...ids: string[]) => ids.map((n) => rysGabp(`sections/${n}`));
/** Great American's covered rows as positions in each section's lettered rows (Rate Your Seats). */
const GABP_COVER: Record<string, number> = {
  '101': 10, '102': 10, '103': 10, '104': 10, '105': 10,
  '108': 18, '109': 25, '110': 32, '111': 37, '112': 37, '121': 20,
  '122': 8, '123': 8, '124': 8, '125': 8, '126': 8,
  '127': 26, '128': 26, '129': 26, '130': 26, '131': 26, '132': 31, '133': 31, '134': 31, '135': 31, '136': 27, '137': 19,
  '301': 7, '302': 7, '303': 7, '304': 7, '305': 7,
  '401': 20, '402': 20, '403': 22, '404': 22, '405': 20, '406': 20,
  '411': 17, '412': 17, '413': 17, '414': 17, '415': 17, '416': 17, '417': 17, '418': 17, '419': 17,
};
const gabpCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => GABP_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: GABP_COVER[id], soffitHeightFt } }]));
const gabpIds = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Seating ring of a Great American Ball Park chart section. */
export function gabpTier(id: string): string | null {
  if (/^\d{1,2}$/.test(id)) return 'diamond';
  if (/^STE\d+$/.test(id)) return 'suite';
  // Party areas, clubs, decks and the boxes: no source gives their seats or cover.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 106) return 'leftField';
  if (n <= 121) return n >= 113 && n <= 120 ? 'thirdCoverUnsourced' : 'third';
  if (n <= 126) return 'home';
  if (n <= 137) return 'first';
  if (n <= 146) return 'rightField';
  if (n <= 299) return 'twoHundred';
  if (n <= 399) return n >= 306 ? 'clubCoverUnsourced' : 'club';
  if (n <= 419) return 'fourHundred';
  if (n <= 499) return 'fourHundredFront';
  return n <= 519 ? 'upperThird' : 'upperFirst';
}

const GABP_LIDAR = 'USGS 3DEP lidar OH_StatewideP3_B21, flown 2022-01-26 (scripts/measureStandHeights.py)';

/**
 * Great American Ball Park (2003). The Diamond Seats in front of a deep 100
 * level (to row PP), the Club (300s) on the first-base side, the 400s on the
 * third-base side and behind home, and the View level (500s) under a roof.
 * Rows and covered rows are Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (GABP_LIDAR, January 2022; no
 * later scan covers the park), as at Citizens Bank Park: for each section a
 * cut straight back through its stand gives the front row's height and the
 * rake, the edge of any deck over it, and what rises highest behind. Where
 * a deck's edge is more than two rows from the source's covered row (or
 * covers three or more it leaves open), the scan's row is used. The scan
 * sees decks from above: a deck's underside is the bottom of its face where
 * seen; where only its front row of seats shows, that row less 9 ft; never
 * under 9 ft above the floor of the first covered row. Not measured (tier
 * values): 1, 2, 5, 107, 122, 138–140, 220, 221, 401–405 (their front row
 * from the cut from home plate), 420 and 520.
 */
const GABP: StadiumStructure = {
  stadiumId: 'reds',
  // Far rim (lidar): the roof line, median over sections 138 ft; crossing:
  // the median distance from a section to it across the field, 573 ft.
  park: { roof: 'open', farRimHeightFt: 138, fieldCrossingFt: 573 },
  tierOf: gabpTier,
  tiers: {
    diamond: {
      label: 'Diamond Seats (1–5, 22–25)',
      // Rows A–H (D–H in 1) at the backstop, open. Lidar (6 of 9): front
      // row at field level (-1 ft), 11° rake (10–15); what rises highest
      // behind is the roof's edge, 138 ft up and 122 ft back.
      stand: { rows: 8, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 138, backSetbackFt: 122 },
      sections: { '3': { backHeightFt: 69, backSetbackFt: 86 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...gabpSections('1', '3', '22', '25'), GABP_LIDAR],
    },
    home: {
      label: 'Field level behind home (122–126)',
      // Rows A–I or A–O behind the Diamond Seats, covered from row H
      // (sourced). Lidar (4 of 5): front row 4 ft, 13° rake; behind, the
      // roof's edge, 138 ft up and 73 ft back. The scan sees no deck over
      // their first rows; estimated: the cover's underside ~24 ft. Behind
      // the 9-row 123 the roof's edge is 89 ft back (measured).
      stand: { rows: 15, frontRowHeightFt: 4, rakeDeg: 13, backHeightFt: 138, backSetbackFt: 73, overhang: { coveredFromRow: 8, soffitHeightFt: 24 } },
      sections: withBacks(gabpCover(gabpIds(122, 126), 24), { '123': [138, 89] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('122', '124', '126'), GABP_LIDAR],
    },
    first: {
      label: 'Field level, first-base side (127–137)',
      // Up to 42 rows, covered from row EE (sourced: 26 in 127–131, 31 in
      // 132–135, 27 in 136, 19 in 137). Lidar (11 of 11): front row at field
      // level (-1 ft; 4 in 136), 11° rake (11–12); what rises highest behind
      // is the roof's edge, 138 ft up and 33 ft back (in five, the club's
      // front over the last rows). The club's front, 35 ft up, is over the
      // source's row in six; in 127, 128 and 136 it reaches out over row
      // 20–22 and in 133 over 28, which they take; in 137 the scan puts it
      // over row 30 (source: 19). Its underside ~25 ft (that front row less
      // 9 ft; 30 ft in 127, where something lower shows). The roof's edge
      // stands 45 ft behind 131 and 68 ft behind 137 (measured).
      stand: { rows: 37, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 138, backSetbackFt: 33, deckFrontFt: 34 },
      sections: withBacks({
        ...gabpCover(['131', '132', '134', '135'], 25),
        '127': { backHeightFt: 62, backSetbackFt: -29, overhang: { coveredFromRow: 22, soffitHeightFt: 30 } },
        '128': { backHeightFt: 69, backSetbackFt: -25, overhang: { coveredFromRow: 22, soffitHeightFt: 24 } },
        ...Object.fromEntries(['129', '130'].map((id) => [id, { backHeightFt: 69, backSetbackFt: -25, ...gabpCover([id], 25)[id] }])),
        '133': { overhang: { coveredFromRow: 28, soffitHeightFt: 25 } },
        '136': { frontRowHeightFt: 4, backHeightFt: 69, backSetbackFt: -25, overhang: { coveredFromRow: 20, soffitHeightFt: 25 } },
        '137': { overhang: { coveredFromRow: 30, soffitHeightFt: 25 } },
      }, { '131': [138, 45], '137': [138, 68] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('127', '130', '132', '136', '137'), GABP_LIDAR],
    },
    third: {
      label: 'Field level, third-base side (107–112, 121)',
      // 108–112 covered from row KK, 121 from FF (sourced: 18, 25, 32, 37,
      // 37, 20); 107 open. Lidar (6 of 7): front row 1 ft (-1 to 4), 11° rake
      // (10–12); behind, the roof's edge, 134 ft up and 47 ft back. The 400s'
      // front, 52 ft up, is over the source's row in 109 and 110; in 111 and
      // 112 it reaches out over row 33, which they take. Its underside ~43 ft
      // (that front row less 9 ft). The roof's edge stands 71 ft behind 108
      // (measured).
      stand: { rows: 30, frontRowHeightFt: 1, rakeDeg: 11, backHeightFt: 134, backSetbackFt: 47, deckFrontFt: 52 },
      sections: {
        ...gabpCover(['109', '110'], 43),
        '108': { backHeightFt: 134, backSetbackFt: 71, ...gabpCover(['108'], 43)['108'] },
        '121': { backHeightFt: 53, backSetbackFt: 19, ...gabpCover(['121'], 43)['121'] },
        ...Object.fromEntries(['111', '112'].map((id) => [id, { overhang: { coveredFromRow: 33, soffitHeightFt: 43 } }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('107', '108', '110', '112', '121'), GABP_LIDAR],
    },
    thirdCoverUnsourced: {
      label: 'Field level, third-base side (113–120)',
      // Rows to GG; Rate Your Seats gives no covered rows (120: "GG and up
      // shaded late afternoon"). Lidar (8 of 8): front row at field level
      // (-1 ft), 11° rake (10–12); behind, the roof's edge, 134 ft up and
      // 68 ft back. The 400s' front, 52 ft up, is over 113's and 114's row
      // 33, 118's 27 and 119's 26; over 115–117 and 120 the scan sees every
      // row open. That settles the cover; the underside ~43 ft (that front
      // row less 9 ft). The roof's edge stands 55–57 ft behind 118 and 119,
      // 80 ft behind 115 (measured).
      stand: { rows: 28, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 134, backSetbackFt: 68, deckFrontFt: 52 },
      sections: {
        '113': { overhang: { coveredFromRow: 33, soffitHeightFt: 43 } },
        '114': { overhang: { coveredFromRow: 33, soffitHeightFt: 42 } },
        '115': { backHeightFt: 134, backSetbackFt: 80 },
        '118': { backHeightFt: 134, backSetbackFt: 57, overhang: { coveredFromRow: 27, soffitHeightFt: 43 } },
        '119': { backHeightFt: 134, backSetbackFt: 55, overhang: { coveredFromRow: 26, soffitHeightFt: 43 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...gabpSections('113', '116', '120'), GABP_LIDAR],
    },
    leftField: {
      label: 'Left field (101–106)',
      // Rows A–Q; 101–105 covered from row J by the deck above (sourced).
      // Lidar (6 of 6): front row 10 ft (8–10), 16° rake; that deck's front,
      // 33 ft up, is over row 9–10 (106 too, which takes it), under an
      // underside of ~26 ft (9 ft above row J's floor; its front less 9 ft
      // would leave less). It is also what rises highest behind (in 104 and
      // 105, a light tower).
      stand: { rows: 17, frontRowHeightFt: 10, rakeDeg: 16, backHeightFt: 34, backSetbackFt: -23, deckFrontFt: 32, overhang: { coveredFromRow: 10, soffitHeightFt: 26 } },
      sections: { '105': { backHeightFt: 147, backSetbackFt: 36 }, '104': { backHeightFt: 142, backSetbackFt: 39 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('101', '104', '106'), GABP_LIDAR],
    },
    rightField: {
      label: 'Right field (138–146)',
      // The Sun/Moon Deck, open ("avoid the seats beyond the right field
      // wall at all costs"). Lidar (6 of 9): front row 6 ft, 26° rake
      // (16–28); behind, 45 ft up and 8 ft back (41 ft, 3 ft in front of
      // 142's last row, at the height of its own back rows).
      stand: { rows: 26, frontRowHeightFt: 6, rakeDeg: 26, backHeightFt: 45, backSetbackFt: 8 },
      sections: {
        '141': { backHeightFt: 20, backSetbackFt: 43 }, '142': { backHeightFt: 41, backSetbackFt: -3 }, '143': { backHeightFt: 91, backSetbackFt: -4 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('138', '140', '143', '146'), GABP_LIDAR],
    },
    twoHundred: {
      label: '200 level (220–228)',
      // Rows A–C behind home; no covered rows given ("shaded during most late
      // afternoon games"). Lidar (7 of 9): front row 35 ft, 22° rake; the
      // 400s' front rows rise 2 ft behind the last row (69 ft). In 222 and
      // 225 something 62 ft up is over row 2; over the rest, nothing. That
      // settles the cover.
      stand: { rows: 3, frontRowHeightFt: 35, rakeDeg: 22, backHeightFt: 69, backSetbackFt: 2 },
      sections: Object.fromEntries(['222', '225'].map((id) => [id, { overhang: { coveredFromRow: 2, soffitHeightFt: 62 } }])),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...gabpSections('220', '224', '228'), GABP_LIDAR],
    },
    club: {
      label: 'Club (301–307)',
      // 301–305 covered from row G (sourced). Lidar (5 of 5): front row
      // 35 ft (34–35), 25° rake (16–26); the 400s' front, 67–68 ft up,
      // reaches out over row 4 (3–5), more than two rows ahead of the
      // source's in three of five, so the tier takes it, under an underside
      // of ~58 ft (that front row less 9 ft). It is also what rises highest
      // behind (62 ft over 301, the end section, measured).
      stand: { rows: 14, frontRowHeightFt: 35, rakeDeg: 25, backHeightFt: 69, backSetbackFt: -29, deckFrontFt: 67, overhang: { coveredFromRow: 4, soffitHeightFt: 58 } },
      sections: { '301': { backHeightFt: 62, backSetbackFt: -29 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('301', '303', '305'), GABP_LIDAR],
    },
    clubCoverUnsourced: {
      label: 'Club (306–307)',
      // No covered rows given. Lidar (2 of 2): front row 35 ft, 24° rake;
      // the 400s' front is over row 4, which settles the cover, under ~57 ft
      // (that front row less 9 ft).
      stand: { rows: 13, frontRowHeightFt: 35, rakeDeg: 24, backHeightFt: 72, backSetbackFt: -15, deckFrontFt: 66, overhang: { coveredFromRow: 4, soffitHeightFt: 57 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...gabpSections('306', '307'), GABP_LIDAR],
    },
    fourHundred: {
      label: '400 level (401–419)',
      // 401–406 covered from row V, 411–419 from row Q (sourced). Lidar (10
      // of 15): on the third-base side front row 52 ft (52–53), 25° rake
      // (24–27); the View level's front, 87–88 ft up, reaches out over row
      // 14, three rows ahead of the source's, so the tier takes it, under an
      // underside of ~78 ft (9 ft above row 14's floor). Behind, the roof's
      // edge, 134 ft up. In left field (401–405) the cuts cross the rows at
      // an angle; the cut from home plate gives their front row 32–33 ft
      // (and ~25°); their covered rows are the source's, under an estimated
      // underside 9 ft above that row's floor (405's cut shows an arched
      // canopy over its back rows that the cuts cannot place).
      stand: { rows: 18, frontRowHeightFt: 52, rakeDeg: 25, backHeightFt: 134, backSetbackFt: 11, deckFrontFt: 87, overhang: { coveredFromRow: 14, soffitHeightFt: 78 } },
      sections: {
        '406': { backHeightFt: 88, backSetbackFt: -26 },
        ...Object.fromEntries(['401', '402', '405'].map((id) => [id, { frontRowHeightFt: 33, deckFrontFt: undefined, ...gabpCover([id], 66)[id] }])),
        ...Object.fromEntries(['403', '404'].map((id) => [id, { frontRowHeightFt: 33, deckFrontFt: undefined, ...gabpCover([id], 69)[id] }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('401', '405', '411', '419'), GABP_LIDAR],
    },
    fourHundredFront: {
      label: '400 level (420–437)',
      // Rows A–F, open; rows D and up "shaded during most late afternoon
      // games" on the first-base side. Lidar (17 of 18): front row 68 ft
      // (67–68), 30° rake (28–32); what rises highest behind is the roof's
      // edge, 138 ft up and 35 ft back.
      stand: { rows: 6, frontRowHeightFt: 68, rakeDeg: 30, backHeightFt: 138, backSetbackFt: 35 },
      sections: { '421': { backHeightFt: 83, backSetbackFt: 30 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...gabpSections('420', '428', '430', '437'), GABP_LIDAR],
    },
    upperThird: {
      label: 'View level, third-base side (509–519)',
      // Rows A–R, covered from row L (sourced). Lidar (11 of 11): front row
      // 88 ft (87–89), 29° rake (26–31); the roof's edge, 134 ft up (its
      // top), is over row 7 (6–8), five rows ahead of the source's, so the
      // rows from G are covered.
      stand: { rows: 18, frontRowHeightFt: 88, rakeDeg: 29, backHeightFt: 134, backSetbackFt: -29, overhang: { coveredFromRow: 7, soffitHeightFt: 134 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('509', '514', '519'), GABP_LIDAR],
    },
    upperFirst: {
      label: 'View level, home and first-base side (520–537)',
      // Rows A–V, covered from row O (sourced). Lidar (17 of 18): front row
      // 84 ft (84–89), 32° rake (30–32); the roof's edge, 137 ft up (its
      // top), is over row 11 (9–12), four rows ahead of the source's, so the
      // rows from K are covered. Nothing rises behind 521 (its own top,
      // 106 ft).
      stand: { rows: 22, frontRowHeightFt: 84, rakeDeg: 32, backHeightFt: 138, backSetbackFt: -30, overhang: { coveredFromRow: 11, soffitHeightFt: 137 } },
      sections: { '521': { backHeightFt: 106, backSetbackFt: 0 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('520', '528', '537'), GABP_LIDAR],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor. Estimated ~52 ft up, behind the club
      // level's last row (52 ft, measured front and rake) and under the 400s
      // (their front row 68 ft), which cover it from row 4, so they reach
      // 30 ft past them.
      stand: { rows: 1, frontRowHeightFt: 52, rakeDeg: 0, backHeightFt: 68, overhang: { coveredFromRow: 1, soffitHeightFt: 61, reachFt: 30 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/reds/ballpark/netting'],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysPnc = (path: string) => `https://www.rateyourseats.com/pnc-park/seating/${path}`;
const RYS_PNC = rysPnc('shaded-covered-seats');
const pncSections = (...ids: string[]) => ids.map((n) => rysPnc(`sections/${n}`));
/** PNC Park's covered rows as positions in each section's lettered rows (Rate Your Seats). */
const PNC_COVER: Record<string, number> = {
  '129': 18, '132': 22,
  '301': 12, '302': 15, '303': 12, '305': 12, '307': 18, '308': 12, '309': 12, '310': 15, '311': 12, '312': 15,
  '320': 15, '321': 12, '322': 13, '323': 12, '325': 15, '327': 15, '328': 15, '329': 15, '330': 9, '331': 18, '332': 18, '333': 18,
};
const pncCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => PNC_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: PNC_COVER[id], soffitHeightFt } }]));

/** Seating ring of a PNC Park chart section. */
export function pncTier(id: string): string | null {
  if (/^\d{1,2}$/.test(id)) return 'field';
  if (/^(LUX|PS19)/.test(id)) return 'suite';
  // Wheelchair platforms (WC), the VIP club, skull bar, porch and boxes: no
  // source gives their seats or cover.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 132) return 'hundred';
  if (n <= 138) return 'leftCorner';
  if (n <= 147) return 'rightField';
  if (n <= 228) return 'club';
  if (n <= 238) return 'bleachers';
  if (n >= 313 && n <= 319) return 'upperHome';
  if (n <= 333) return 'upper';
  return 'rooftop';
}

const PNC_LIDAR = 'USGS 3DEP lidar PA_17County_D24, flown 2024-04-29 to 2024-05-01 (scripts/measureStandHeights.py)';

/**
 * PNC Park (2001). A lower bowl of field-level sections (1–32, rows A–M) and
 * the 100s behind them (rows to HH or KK, the back under the club deck),
 * the club level (200s) with suites, and the upper deck (300s) under a roof;
 * bleachers and a rooftop in left field. Rows and covered rows are Rate
 * Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (PNC_LIDAR, April–May 2024),
 * as at Citizens Bank Park: for each section a cut straight back through its
 * stand gives the front row's height and the rake, the edge of any deck
 * over it, and what rises highest behind. Where a deck's edge is more than
 * two rows from the source's covered row (or covers three or more it leaves
 * open), the scan's row is used. The scan sees decks from above: a deck's
 * underside is the bottom of its face where seen; where only its front row
 * of seats shows, that row less 9 ft; never under 9 ft above the floor of
 * the first covered row. Not measured (tier values): 6, 7, 13, 16, 23,
 * 25–29, 127, 129, 140, 141, 147, 202, 207, 216, 228, 235, 315, 316, 329,
 * 331–333 and 335.
 */
const PNC: StadiumStructure = {
  stadiumId: 'pirates',
  // Far rim (lidar): the roof line, median over sections 120 ft; crossing:
  // the median distance from a section to it across the field, 583 ft.
  park: { roof: 'open', farRimHeightFt: 120, fieldCrossingFt: 583 },
  tierOf: pncTier,
  tiers: {
    field: {
      label: 'Field level (1–32)',
      // Rows A–M (D–M or F–M in some), open ("rarely in the shade"). Lidar
      // (21 of 31): front row at field level (-1 ft), 10° rake (7–12); what
      // rises highest behind is the roof's edge, 121 ft up and 107 ft back
      // (91–132 ft behind 20 and 30–32, measured).
      stand: { rows: 13, frontRowHeightFt: -1, rakeDeg: 10, backHeightFt: 121, backSetbackFt: 107 },
      sections: {
        '20': { backHeightFt: 121, backSetbackFt: 91 },
        ...Object.fromEntries(['30', '31'].map((id) => [id, { backHeightFt: 120, backSetbackFt: 117 }])),
        '32': { backHeightFt: 120, backSetbackFt: 132 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('1', '10', '16', '17', '25', '32'), PNC_LIDAR],
    },
    hundred: {
      label: 'Infield and baseline boxes (101–132)',
      // Rows A–HH (to KK behind home), covered from row W by the club deck
      // (sourced; 129 from W of F–HH, 132 from AA). Lidar (23 of 25): front
      // row 5 ft (4–7), 13° rake (8–14). The club deck's front, 53 ft up,
      // reaches out over row 17 (15–19; 25 in 132, 26 in 131), more than
      // two rows ahead of the source's in all 23, so the tier takes the
      // scan's row, under an underside of ~43 ft (that front row less 9 ft).
      // It is also what rises highest behind (58 ft in front of the last row
      // of the 37-row 114 and 115, 2 ft in front of 132's, measured).
      stand: { rows: 34, frontRowHeightFt: 5, rakeDeg: 13, backHeightFt: 53, backSetbackFt: -47, deckFrontFt: 52, overhang: { coveredFromRow: 17, soffitHeightFt: 43 } },
      sections: {
        ...pncCover(['129'], 43),
        '131': { backHeightFt: 120, backSetbackFt: 60, overhang: { coveredFromRow: 26, soffitHeightFt: 44 } },
        '132': { backHeightFt: 54, backSetbackFt: -2, overhang: { coveredFromRow: 25, soffitHeightFt: 43 } },
        ...Object.fromEntries(['114', '115'].map((id) => [id, { backHeightFt: 53, backSetbackFt: -58 }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('101', '109', '113', '116', '120', '128', '129', '132'), PNC_LIDAR],
    },
    leftCorner: {
      label: 'Left-field corner (133–138)',
      // Rows A–F to A–P, open ("among the worst seats for shade"). Lidar (6
      // of 6): front row 1 ft (-1 to 3), 11° rake; behind, 63 ft up and 73 ft
      // back (each section's own where it differs: 57–64 ft up and 6–134 ft
      // back behind 135–138).
      stand: { rows: 12, frontRowHeightFt: 1, rakeDeg: 11, backHeightFt: 63, backSetbackFt: 73 },
      sections: {
        '133': { backHeightFt: 121, backSetbackFt: 124 }, '134': { backHeightFt: 72, backSetbackFt: 58 },
        '135': { backHeightFt: 60, backSetbackFt: 6 }, '136': { backHeightFt: 62, backSetbackFt: 57 },
        '137': { backHeightFt: 64, backSetbackFt: 134 }, '138': { backHeightFt: 57, backSetbackFt: 88 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('133', '135', '138'), PNC_LIDAR],
    },
    rightField: {
      label: 'Right field (139–147)',
      // Rows A–G to A–M along the river, open ("all outfield seating is
      // exposed"). Lidar (6 of 9): front row 19 ft (on the wall; 9 in 139),
      // 31° rake; behind, 33 ft up and 60 ft back (nothing over 142's and
      // 144's own top). Something 36 ft up is over 139's row 10, its top 3
      // ft in front of 139's last row.
      stand: { rows: 13, frontRowHeightFt: 19, rakeDeg: 31, backHeightFt: 33, backSetbackFt: 60 },
      sections: {
        ...Object.fromEntries(['142', '144'].map((id) => [id, { backHeightFt: 39, backSetbackFt: 0 }])),
        '146': { backHeightFt: 39, backSetbackFt: 65 },
        '139': { frontRowHeightFt: 9, backHeightFt: 36, backSetbackFt: -3, overhang: { coveredFromRow: 10, soffitHeightFt: 36 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('139', '142', '147'), PNC_LIDAR],
    },
    club: {
      label: 'Baseball Club (201–228)',
      // Rows A–K (A–B, A–C at the ends), "rarely in the shade". Lidar (19 of
      // 23): front row 53 ft (52–53), 27° rake (22–29), open; what rises
      // highest behind is the roof's edge, 121 ft up and 25 ft back (the
      // 300s rise between, a walkway behind the last row).
      stand: { rows: 11, frontRowHeightFt: 53, rakeDeg: 27, backHeightFt: 121, backSetbackFt: 25 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('201', '209', '214', '220', '228'), PNC_LIDAR],
    },
    bleachers: {
      label: 'Left-field bleachers (235–238)',
      // Rows A–R, open ("always a heavy dose of sun"). Lidar (3 of 4): front
      // row 16 ft, 14° rake; behind, the rooftop deck, 73 ft up over the last
      // row (110 in 238, 43 in 236; 32 ft behind 237's).
      stand: { rows: 18, frontRowHeightFt: 16, rakeDeg: 14, backHeightFt: 73, backSetbackFt: -1 },
      sections: { '238': { backHeightFt: 110, backSetbackFt: -4 }, '236': { backHeightFt: 43, backSetbackFt: -1 }, '237': { backHeightFt: 73, backSetbackFt: 32 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('235', '238'), PNC_LIDAR],
    },
    rooftop: {
      label: 'Left-field rooftop (335–339)',
      // Rows A–C, open. Lidar (4 of 5): front row 39 ft (39–43), 18° rake;
      // behind, 82 ft up and 128 ft back (76 ft and 114 ft behind 336).
      stand: { rows: 3, frontRowHeightFt: 39, rakeDeg: 18, backHeightFt: 82, backSetbackFt: 128 },
      sections: { '336': { backHeightFt: 76, backSetbackFt: 114 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('335', '337', '339'), PNC_LIDAR],
    },
    upper: {
      label: 'Grandstand (300s)',
      // Rows D–Y (and A–Y in a few), covered from row R (sourced; position
      // 12–18). Lidar (18 of 22): front row 76 ft (70–78), 28° rake (23–30),
      // a step above the club's walkway. The roof's edge, 120 ft up (its
      // top), is over position 6 (5–10), more than two rows ahead of the
      // source's in 17 of 18, so the tier takes the scan's row (9–10 in six,
      // which take theirs; 329 and 331–333, not measured, keep theirs).
      stand: { rows: 20, frontRowHeightFt: 76, rakeDeg: 28, backHeightFt: 120, backSetbackFt: -35, overhang: { coveredFromRow: 6, soffitHeightFt: 120 } },
      sections: {
        ...pncCover(['329', '331', '332', '333'], 120),
        ...Object.fromEntries(['308', '323', '327', '328'].map((id) => [id, { overhang: { coveredFromRow: 9, soffitHeightFt: 120 } }])),
        ...Object.fromEntries(['311', '320'].map((id) => [id, { overhang: { coveredFromRow: 10, soffitHeightFt: 120 } }])),
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('301', '307', '312', '320', '325', '333'), PNC_LIDAR],
    },
    upperHome: {
      label: 'Grandstand behind home (313–319)',
      // Rows D–R; "rows M (to Q) and up are shaded during most day games",
      // no covered rows given. Lidar (5 of 7): front row 77 ft (71–78), 28°
      // rake; the roof's edge, 120 ft up, is over position 6 (9–10 in 313
      // and 318), which settles the cover (in 313 6 ft in front of the last
      // row, measured).
      stand: { rows: 15, frontRowHeightFt: 77, rakeDeg: 28, backHeightFt: 120, backSetbackFt: -16, overhang: { coveredFromRow: 6, soffitHeightFt: 120 } },
      sections: {
        '313': { backHeightFt: 121, backSetbackFt: -6, overhang: { coveredFromRow: 10, soffitHeightFt: 120 } },
        '318': { overhang: { coveredFromRow: 9, soffitHeightFt: 120 } },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...pncSections('313', '316', '319'), PNC_LIDAR],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor, the deck above reaching past them as is
      // typical. Estimated ~56 ft up.
      stand: { rows: 1, frontRowHeightFt: 56, rakeDeg: 0, backHeightFt: 68, overhang: { coveredFromRow: 1, soffitHeightFt: 65, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/pirates/ballpark/seating-map/3d'],
    },
  },
  reviewedOn: '2026-11-12',
};

const rysComerica = (path: string) => `https://www.rateyourseats.com/comerica-park/seating/${path}`;
const RYS_COMERICA = rysComerica('shaded-covered-seats');
const comericaSections = (...ids: string[]) => ids.map((n) => rysComerica(`sections/${n}`));
/** Comerica Park's covered rows as positions in each section's labelled rows (Rate Your Seats). */
const COMERICA_COVER: Record<string, number> = {
  '104': 29, '105': 29, '106': 29, '107': 7,
  '112': 21, '113': 33, '114': 35, '115': 11, '143': 30, '144': 30,
  '211': 23, '212': 23, '213': 23, '214': 23, '215': 23, '216': 23, '217': 23, '218': 23,
  '321': 21, '322': 21, '323': 21, '324': 21, '325': 21, '326': 21, '327': 19, '328': 21, '329': 21, '330': 21,
  '331': 21, '332': 21, '333': 19, '334': 21, '336': 21, '337': 19, '338': 21, '339': 21, '340': 21, '341': 21,
  '342': 21, '343': 19, '344': 21, '345': 21,
};
const comericaCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => COMERICA_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: COMERICA_COVER[id], soffitHeightFt } }]));
const comericaIds = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Seating ring of a Comerica Park chart section. */
export function comericaTier(id: string): string | null {
  if (/^ST\d/.test(id)) return 'suite';
  if (/^TD\d/.test(id)) return 'tigerDen';
  if (/^1(1[67]|3[6-9]|4[01])[A-C]$/.test(id)) return 'terrace';
  // The boxes in front of home (P, HPC), the lounges (L), the tables behind
  // 112–114 (T), the right-field balconies and standing room: no source
  // gives their seats or cover.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 106) return 'rightField';
  if (n <= 111) return 'kaline';
  if (n <= 115) return 'firstCorner';
  if (n <= 124) return 'first';
  if (n <= 130) return 'home';
  if (n <= 139) return 'third';
  if (n <= 143) return 'leftCorner';
  if (n <= 151) return 'leftField';
  if (n <= 219) return 'mezzanine';
  return n === 346 ? 'upperCorner' : 'upper';
}

// The lower bowl's rake and row depth (rows 1–35 from ~12 m to the walkway
// ~44 m back on the photo: a ~3 ft tread); each tier's front row measured.
const COMERICA_LOWER = { rakeDeg: 10, treadFt: 3 };
const COMERICA_LIDAR = 'USGS 3DEP lidar MI_WayneCo_2017, flown 2017-04-22 to 2017-04-23 (scripts/measureStandHeights.py)';

/**
 * Comerica Park (2000). A lower bowl to row 35 with the Tiger Den (rows A–H)
 * behind it from dugout to dugout and terraces (rows A–H) behind the
 * baselines; the mezzanine (210–219) over the first-base side and the right-
 * field corner, under a roof; the upper deck (321–346) from the first-base
 * dugout round to the left-field corner, under a roof. Rows and covered rows
 * are Rate Your Seats' section pages.
 *
 * Heights are measured on USGS airborne lidar (COMERICA_LIDAR, April 2017;
 * no later scan covers the park), as at Citizens Bank Park: for each
 * section a cut straight back through its stand gives the front row's
 * height and the rake, the edge of any deck over it, and what rises highest
 * behind. Where a deck's edge is more than two rows from the source's
 * covered row (or covers three or more it leaves open), the scan's row is
 * used. The scan sees decks from above: a deck's underside is the bottom of
 * its face where seen; where only its front row of seats shows, that row
 * less 9 ft; never under 9 ft above the floor of the first covered row. The
 * Tiger Den, the terraces and the suites are hidden (estimated from the
 * measured tiers around them). Not measured (tier values): 101, 107–111,
 * 115, 211, 212, 217–219, 327, 337, 344, 346.
 */
const COMERICA: StadiumStructure = {
  stadiumId: 'tigers',
  // Far rim (lidar): the roof line, median over sections 118 ft; crossing:
  // the median distance from a section to it across the field, 637 ft.
  park: { roof: 'open', farRimHeightFt: 118, fieldCrossingFt: 637 },
  tierOf: comericaTier,
  tiers: {
    first: {
      label: 'Lower bowl, first-base side (116–124)',
      // Open in the source; rows 27 and up "shaded during most late
      // afternoon games". Lidar (9 of 9): front row 1 ft (-2 to 5), 10° rake
      // (7–11). The upper deck's front, 61 ft up, reaches out over their row
      // 26 (32–33 of the full 35-row sections), so the rows from there back
      // are covered, under an underside of ~52 ft (that front row less 9 ft);
      // nearer right field (116–119) the mezzanine's front, 49–50 ft, under
      // ~40 ft. Over 120 and 124 the scan sees every row open.
      stand: { rows: 35, frontRowHeightFt: 1, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: -7, deckFrontFt: 61, overhang: { coveredFromRow: 26, soffitHeightFt: 52 } },
      sections: {
        '116': { frontRowHeightFt: 5, backHeightFt: 51, backSetbackFt: -25, deckFrontFt: 49, overhang: { coveredFromRow: 26, soffitHeightFt: 40 } },
        '117': { backHeightFt: 50, backSetbackFt: -7, deckFrontFt: 49, overhang: { coveredFromRow: 33, soffitHeightFt: 40 } }, // its own back: the mezzanine's front over row 33
        '118': { backHeightFt: 118, backSetbackFt: 48, deckFrontFt: 60, overhang: { coveredFromRow: 33, soffitHeightFt: 51 } },
        '119': { backHeightFt: 51, backSetbackFt: -25, deckFrontFt: 50, overhang: { coveredFromRow: 26, soffitHeightFt: 41 } },
        '120': { noCover: true, backHeightFt: 63, backSetbackFt: 9 },
        '124': { noCover: true, backHeightFt: 63, backSetbackFt: 4 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('116', '119', '120', '121', '124'), COMERICA_LIDAR],
    },
    firstCorner: {
      label: 'Right-field corner (112–115)',
      // Two blocks (rows to 33/34, then 37–45), the back one under the
      // mezzanine from row 37 (sourced). Lidar (3 of 4): front row at field
      // level (-1 ft; 8 in 112), 10° rake; behind, 51–103 ft up by section.
      // The mezzanine's front, 49 ft up, reaches out over
      // 114's position 31 (source: 35), under an underside of ~40 ft (that
      // front row less 9 ft; 45 over 115, 9 ft above its floor).
      stand: { rows: 43, frontRowHeightFt: -1, ...COMERICA_LOWER, backHeightFt: 84, backSetbackFt: 24, deckFrontFt: 49 },
      sections: {
        '113': { backHeightFt: 51, backSetbackFt: -26, ...comericaCover(['113'], 40)['113'] },
        '112': { frontRowHeightFt: 8, backHeightFt: 84, backSetbackFt: 62, overhang: { coveredFromRow: COMERICA_COVER['112'], soffitHeightFt: 40 } },
        '114': { backHeightFt: 103, backSetbackFt: 24, overhang: { coveredFromRow: 31, soffitHeightFt: 40 } },
        '115': { frontRowHeightFt: 31, overhang: { coveredFromRow: COMERICA_COVER['115'], soffitHeightFt: 45 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('112', '113', '114', '115'), COMERICA_LIDAR],
    },
    home: {
      label: 'Lower bowl behind home (125–130)',
      // Rows HHH–KKK and 15–35 behind the boxes; rows 31–34 and up "shaded
      // during most late afternoon games". Lidar (6 of 6): front row at field
      // level (-1 ft), 10° rake; no deck over them: what rises highest behind
      // is the upper deck's front, 62 ft up and 15 ft behind the last row.
      stand: { rows: 25, frontRowHeightFt: -1, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: 15 },
      sections: { '127': { backHeightFt: 61, backSetbackFt: 1 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('125', '127', '128', '130'), COMERICA_LIDAR],
    },
    third: {
      label: 'Lower bowl, third-base side (131–139)',
      // Open in the source ("the third base side will be your enemy"). Lidar
      // (9 of 9): front row 2 ft (-1 in 137 and 139), 10° rake. The upper
      // deck's front, 61 ft up, reaches out over their row 26 (32–33 of the
      // full 35-row sections), so the rows from there back are covered, under
      // an underside of ~52 ft (that front row less 9 ft). It is also what
      // rises highest behind.
      stand: { rows: 35, frontRowHeightFt: 2, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: -9, deckFrontFt: 61, overhang: { coveredFromRow: 26, soffitHeightFt: 52 } },
      sections: {
        ...Object.fromEntries(['137', '139'].map((id) => [id, { frontRowHeightFt: -1, overhang: { coveredFromRow: 33, soffitHeightFt: id === '137' ? 53 : 52 } }])),
        ...Object.fromEntries(['136', '138'].map((id) => [id, { overhang: { coveredFromRow: 32, soffitHeightFt: 53 } }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('131', '135', '136', '139'), COMERICA_LIDAR],
    },
    leftCorner: {
      label: 'Left-field corner (140–143)',
      // Open but for 143 from row 41 (rows 12–44; sourced). Lidar (4 of 4):
      // front row at field level (-1 ft; 3 in 143), 10° rake. The upper
      // deck's front, 61 ft up, is over 142's row 29 and 143's position 23,
      // under ~52 ft (that front row less 9 ft); over 140 and 141 nothing.
      stand: { rows: 35, frontRowHeightFt: -1, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: -5, deckFrontFt: 61 },
      sections: {
        '140': { backHeightFt: 62, backSetbackFt: 9 },
        '141': { backHeightFt: 62, backSetbackFt: 11 },
        '142': { backHeightFt: 62, backSetbackFt: -19, overhang: { coveredFromRow: 29, soffitHeightFt: 52 } },
        '143': { frontRowHeightFt: 3, backHeightFt: 63, backSetbackFt: -31, overhang: { coveredFromRow: 23, soffitHeightFt: 52 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('140', '142', '143'), COMERICA_LIDAR],
    },
    leftField: {
      label: 'Left-field pavilion (144–151)',
      // Behind the bullpens, open but for 144 from row DD (sourced): "the
      // most sun of any location". Lidar (8 of 8): front row 6 ft (5–6), 11°
      // rake; behind, 44 ft up (the scoreboard over 149, 173 ft). Canopies
      // at the top of the pavilion are over 144's position 21 and the last
      // three rows of 147 and 149, ~34 ft up (42 over 149).
      stand: { rows: 33, frontRowHeightFt: 6, rakeDeg: 11, treadFt: 3, backHeightFt: 44, backSetbackFt: 2 },
      sections: {
        '144': { backHeightFt: 62, backSetbackFt: -34, overhang: { coveredFromRow: 21, soffitHeightFt: 34 } },
        '147': { overhang: { coveredFromRow: 27, soffitHeightFt: 34 } },
        '148': { backHeightFt: 123, backSetbackFt: 0 },
        '149': { backHeightFt: 173, backSetbackFt: -9, overhang: { coveredFromRow: 29, soffitHeightFt: 42 } },
        ...Object.fromEntries(['150', '151'].map((id) => [id, { backHeightFt: 26, backSetbackFt: 5 }])),
        '145': { backHeightFt: 43, backSetbackFt: 42 },
        '146': { backHeightFt: 43, backSetbackFt: 63 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('144', '146', '148', '151'), COMERICA_LIDAR],
    },
    rightField: {
      label: 'Right-field bleachers (101–106)',
      // Rows E–T to A–GG; 104–106 covered from row CC (sourced). Lidar (5 of
      // 6): front row 10 ft (8–11), 12° rake. The balcony deck above, 38 ft up
      // (its top; the scan sees nothing under it), reaches out over row 23
      // (20 in 104), more than two rows ahead of the source's; over 103's
      // last rows something 70 ft up; over 102 nothing. Behind, 26–70 ft up
      // by section.
      stand: { rows: 33, frontRowHeightFt: 10, rakeDeg: 12, treadFt: 3, backHeightFt: 40, backSetbackFt: -5, overhang: { coveredFromRow: 23, soffitHeightFt: 38 } },
      sections: {
        '101': { noCover: true },
        '102': { noCover: true, backHeightFt: 26, backSetbackFt: 1 },
        '103': { backHeightFt: 70, backSetbackFt: -5, overhang: { coveredFromRow: 31, soffitHeightFt: 70 } },
        '104': { backHeightFt: 56, backSetbackFt: 7, overhang: { coveredFromRow: 20, soffitHeightFt: 38 } },
        '105': { backHeightFt: 39, backSetbackFt: -31 },
        '106': { backHeightFt: 40, backSetbackFt: -29 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('101', '102', '104', '106'), COMERICA_LIDAR],
    },
    kaline: {
      label: "Kaline's Corner (107–111)",
      // The corner's upper rows past the pole: 110–111 rows 21–36, 107–109
      // rows 37–47; 107 covered from row 43 (sourced). Not measured: the cuts
      // from home find the corner stand's lower rows. Estimated: the deck's
      // underside ~57 ft (9 ft above row 43's floor).
      stand: { rows: 16, frontRowHeightFt: 24, rakeDeg: 20, treadFt: 3, backHeightFt: 95, backSetbackFt: 30 },
      sections: {
        ...Object.fromEntries(['107', '108', '109'].map((id) => [id, { frontRowHeightFt: 41 }])),
        '107': { frontRowHeightFt: 41, overhang: { coveredFromRow: COMERICA_COVER['107'], soffitHeightFt: 57 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('107', '109', '110', '111')],
    },
    tigerDen: {
      label: 'Tiger Den (TD120–TD135)',
      // Rows A–H at the top of the lower bowl, under the deck above from row
      // C (sourced). Hidden from the air; estimated from the measured tiers
      // around it: front ~18 ft (the lower bowl's last row, 17 ft), the deck
      // over it ~29 ft (9 ft above row C's floor); the upper deck's front,
      // 61 ft, rises behind.
      stand: { rows: 8, frontRowHeightFt: 18, rakeDeg: 15, backHeightFt: 61, overhang: { coveredFromRow: 3, soffitHeightFt: 29 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysComerica('sections/TD121'), rysComerica('sections/TD126'), rysComerica('sections/TD129')],
    },
    terrace: {
      label: 'Terraces (116–117, 136–141)',
      // Rows A–H behind the baseline bowls, covered from row C (sourced).
      // Hidden from the air; estimated as the Tiger Den.
      stand: { rows: 8, frontRowHeightFt: 18, rakeDeg: 15, backHeightFt: 61, overhang: { coveredFromRow: 3, soffitHeightFt: 29 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysComerica('sections/116T'), rysComerica('sections/136T'), rysComerica('sections/141T')],
    },
    mezzanine: {
      label: 'Mezzanine (210–219)',
      // Rows A–F then 1–22 (1–11 in 210 and 219), covered from row 17
      // (sourced; 210 and 219 not). Lidar (5 of 10; in 211 and 212 the cut
      // takes the shallow front block): front row 50 ft, 24° rake (23–27).
      // The roof is seen 103 ft up (its top) past the last rows, so the
      // source's covered rows stay, under it. Behind, 72 ft up far back
      // (86–103 in 210 and 216).
      stand: { rows: 28, frontRowHeightFt: 50, rakeDeg: 24, treadFt: 2.8, backHeightFt: 72, backSetbackFt: 129 },
      sections: {
        ...comericaCover(comericaIds(210, 219), 103),
        '216': { backHeightFt: 86, backSetbackFt: 16, ...comericaCover(['216'], 103)['216'] },
        ...Object.fromEntries(['214', '215'].map((id) => [id, { backHeightFt: 65, backSetbackFt: 157, ...comericaCover([id], 103)[id] }])),
        '210': { backHeightFt: 103, backSetbackFt: 12 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('210', '211', '215', '218', '219'), COMERICA_LIDAR],
    },
    upper: {
      label: 'Upper deck (321–345)',
      // Rows A–F then 1–20, covered from row 15 (sourced). Lidar (21 of 24):
      // front row 62 ft (61–62), 27° rake (21–35); the roof's edge, 118 ft up
      // (its top), is over the source's row in 18 of 21 (row 9 in 341 and 345,
      // 16 in 343, which take theirs). It is also what rises highest behind.
      // The scan sees nothing under the roof, so its top stands in for its
      // underside and the tier's heights stay estimated.
      stand: { rows: 26, frontRowHeightFt: 62, rakeDeg: 27, treadFt: 2.65, backHeightFt: 118, backSetbackFt: -12, overhang: { coveredFromRow: 21, soffitHeightFt: 118 } },
      sections: {
        ...comericaCover(comericaIds(321, 345), 118),
        ...Object.fromEntries(['341', '345'].map((id) => [id, { overhang: { coveredFromRow: 15, soffitHeightFt: 118 } }])),
        '343': { overhang: { coveredFromRow: 22, soffitHeightFt: 118 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('321', '327', '330', '338', '345'), COMERICA_LIDAR],
    },
    upperCorner: {
      label: 'Upper deck corner (346)',
      // Rows A–F, open ("avoid the corners"). Not measured; as the upper
      // deck's front rows.
      stand: { rows: 6, frontRowHeightFt: 62, rakeDeg: 27, treadFt: 2.65, backHeightFt: 72 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('346')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor. Estimated ~32 ft up, on the deck over
      // the Tiger Den and the terraces (its underside ~29 ft, estimated from
      // the measured lower bowl), under the upper deck (its front row 61 ft,
      // measured) reaching past them as is typical.
      stand: { rows: 1, frontRowHeightFt: 32, rakeDeg: 0, backHeightFt: 61, overhang: { coveredFromRow: 1, soffitHeightFt: 41, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/tigers/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-13',
};


const rysProgressive = (path: string) => `https://www.rateyourseats.com/progressive-field/seating/${path}`;
const RYS_PROGRESSIVE = rysProgressive('shaded-covered-seats');
const progressiveSections = (...ids: string[]) => ids.map((n) => rysProgressive(`sections/${n}`));
/** Progressive Field's covered rows as positions in each section's lettered rows (Rate Your Seats). */
const PROGRESSIVE_COVER: Record<string, number> = {
  '108': 22, '109': 22, '111': 22, '113': 22,
  '128': 24, '129': 24, '130': 24, '131': 24, '134': 24, '136': 24, '138': 24, '140': 19, '142': 19, '144': 19, '146': 19, '148': 19,
  '303': 13, '304': 13, '307': 13, '309': 13, '311': 13, '316': 13,
  '326': 10, '328': 13, '330': 13, '332': 13, '334': 13, '336': 13, '338': 13, '340': 13, '342': 13, '344': 13, '346': 13, '348': 11,
};
const progressiveCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => PROGRESSIVE_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: PROGRESSIVE_COVER[id], soffitHeightFt } }]));

/** Seating ring of a Progressive Field chart section. */
export function progressiveTier(id: string): string | null {
  if (/^STE\d/.test(id)) return 'suite';
  // The boxes and clubs behind home (HPBOX, CC, CLNG, PC), the center-field
  // boxes (1011–1014), the named suites and the standing areas: no source
  // gives their seats or cover.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 113) return 'rightField';
  if (n <= 125) return 'rightCorner';
  if (n <= 148) return 'first';
  if (n <= 157) return 'home';
  if (n <= 175) return 'third';
  if (n <= 179) return 'leftCorner';
  if (n <= 185) return 'leftField';
  if (n <= 316) return 'rightFieldClub';
  if (n <= 348) return 'club';
  if (n <= 478) return 'upperBox';
  return 'upper';
}

const PROGRESSIVE_LIDAR = 'USGS 3DEP lidar OH_Statewide_Phase1_2019, flown 2019-11-09 (scripts/measureStandHeights.py)';
// The lower bowl along each line, square to its rows on the photo: rows A–HH
// from the wall (from F behind the dugouts). Lidar: front row at field level
// (3–4 ft at row F), 11–13° rake, a ~2.8 ft tread.
const PROGRESSIVE_TREAD = { treadFt: 2.8 };

/**
 * Progressive Field (1994; 2015–16 renovation; 2023–25 "Reimagined"). A
 * lower bowl to row HH whose rows run ~6° inside the foul lines, the club
 * deck (326–348) over the first-base side from row X, suites over the
 * third-base side, the 300s in right field above 103–113, and an upper deck
 * of boxes (400s, rows A–F) and reserved seats (500s, rows A–X) under a roof
 * canopy. Rows and covered rows are Rate Your Seats' section pages.
 *
 * Heights: USGS lidar (Ohio, November 2019), the newest scan of the park. It
 * predates the 2023–25 renovation, which took out upper-deck seats in both
 * corners (those sections are no longer on the chart), added lounges behind
 * home at field level and rebuilt the Terrace Club down the left-field line
 * (the North Coast Social Club, 2025). The seats on the chart stand as they
 * were; what is over and behind the third-base sections next to the Terrace
 * (167–175) and the left-field corner (176–179) is not measured.
 */
const PROGRESSIVE: StadiumStructure = {
  stadiumId: 'guardians',
  // Far rim: the roof canopy, 139 ft up (lidar), ~590 ft across the field.
  park: { roof: 'open', farRimHeightFt: 139, fieldCrossingFt: 588 },
  tierOf: progressiveTier,
  tiers: {
    first: {
      label: 'Lower level, first-base side (128–148)',
      // Covered from row X by the club deck (sourced). Lidar (12 of 12):
      // front row at field level (-1–0 ft; 4 ft at row F in 142–148), 11°
      // rake; behind, the roof canopy 139 ft up and 30 ft back. The club
      // deck's front row, 28 ft up, reaches out over row 22 (sourced X, row
      // 24, kept), over row 19 in 129 and over 142–148's row 13 (sourced 19),
      // which take it. Its underside is not seen: 9 ft above the covered
      // row's floor (its front row less the park's 12 ft deck depth would be
      // lower).
      stand: { rows: 34, frontRowHeightFt: 0, rakeDeg: 11, ...PROGRESSIVE_TREAD, backHeightFt: 139, backSetbackFt: 30, deckFrontFt: 28, overhang: { coveredFromRow: 24, soffitHeightFt: 22 } },
      sections: {
        '129': { overhang: { coveredFromRow: 19, soffitHeightFt: 19 } },
        '140': { backSetbackFt: 43, overhang: { coveredFromRow: PROGRESSIVE_COVER['140'], soffitHeightFt: 21 } },
        ...Object.fromEntries(['142', '144', '146', '148'].map((id) => [id, { frontRowHeightFt: 4, overhang: { coveredFromRow: 13, soffitHeightFt: 20 } }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('128', '134', '138', '140', '148'), PROGRESSIVE_LIDAR],
    },
    home: {
      label: 'Lower level behind home (149–157)',
      // Rows L–HH behind the boxes (149: F–HH), open. Lidar (9 of 9): front
      // row 3 ft (3–4), 13° rake; behind, the roof canopy 139 ft up and
      // 39 ft back (22 behind 149).
      stand: { rows: 23, frontRowHeightFt: 3, rakeDeg: 13, ...PROGRESSIVE_TREAD, backHeightFt: 139, backSetbackFt: 39 },
      sections: { '149': { backSetbackFt: 22 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('149', '150', '153', '154', '157'), PROGRESSIVE_LIDAR],
    },
    third: {
      label: 'Lower level, third-base side (158–175)',
      // Open in the source ("the third base side will see shade first during
      // late afternoon and evening games"). Lidar (7 of 14; 167–175 skipped,
      // the Terrace over and behind them rebuilt since): front row 3 ft at
      // row F (165, from row A: -1), 13° rake. The suite level reaches out
      // over row 24 (33 in 165), the bottom of its structure 33 ft up (34),
      // with the upper deck's front, 72 ft up, above it and 13 ft in front
      // of the last row; nothing over 164's (the roof canopy, 139 ft, behind
      // it and 165). 167–175, from row A like 165, keep the estimate behind
      // them and the source's open rows.
      stand: { rows: 29, frontRowHeightFt: 3, rakeDeg: 13, ...PROGRESSIVE_TREAD, backHeightFt: 72, backSetbackFt: -13, overhang: { coveredFromRow: 24, soffitHeightFt: 33 } },
      sections: {
        '165': { frontRowHeightFt: -1, backHeightFt: 139, backSetbackFt: 34, overhang: { coveredFromRow: 33, soffitHeightFt: 34 } },
        '164': { noCover: true, backHeightFt: 139, backSetbackFt: 34 },
        ...Object.fromEntries(['167', '169', '170', '171', '172', '174', '175'].map((id) => [id, { noCover: true, frontRowHeightFt: -1, backHeightFt: 125, backSetbackFt: 100 }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('158', '162', '165', '172', '175'), PROGRESSIVE_LIDAR],
    },
    leftCorner: {
      label: 'Left-field corner (176–179)',
      // Rows Y–HH (176–177), F–HH (178), N–EE (179), open. Not measured: the
      // Terrace beside them was rebuilt after the scan.
      stand: { rows: 29, frontRowHeightFt: 7.5, rakeDeg: 18, treadFt: 2.8, backHeightFt: 60 },
      sections: { '176': { frontRowHeightFt: 25 }, '177': { frontRowHeightFt: 25 }, '179': { frontRowHeightFt: 15 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: progressiveSections('176', '178', '179'),
    },
    leftField: {
      label: 'Left field (180–185)',
      // Rows A–Y (E–Y in 180), open in the source. Lidar (6 of 6): front row
      // 24 ft (20–32) over the wall, 29° rake. The left-field scoreboard
      // reaches out over row 16 (12 in 180, 19–20 in 181 and 184), the
      // bottom of its face 67 ft up (77 over 180), its top 124 ft; nothing
      // over 182 and 183 (behind them, 71–74 ft up and 30 ft back).
      stand: { rows: 25, frontRowHeightFt: 24, rakeDeg: 29, ...PROGRESSIVE_TREAD, backHeightFt: 73, backSetbackFt: 30, overhang: { coveredFromRow: 16, soffitHeightFt: 67 } },
      sections: {
        '185': { frontRowHeightFt: 31, backHeightFt: 67, backSetbackFt: 16 },
        '181': { frontRowHeightFt: 20, backHeightFt: 124, backSetbackFt: -17, overhang: { coveredFromRow: 20, soffitHeightFt: 67 } },
        '184': { frontRowHeightFt: 20, backHeightFt: 124, backSetbackFt: -17, overhang: { coveredFromRow: 19, soffitHeightFt: 67 } },
        '180': { frontRowHeightFt: 31, backHeightFt: 124, backSetbackFt: -17, overhang: { coveredFromRow: 12, soffitHeightFt: 77 } },
        ...Object.fromEntries(['182', '183'].map((id) => [id, { noCover: true }])),
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...progressiveSections('180', '182', '185'), PROGRESSIVE_LIDAR],
    },
    rightCorner: {
      label: 'Right-field corner (117, 125)',
      // Open in the source: 117 has "no overhead protection". Lidar (125;
      // 117's cut runs over the corner's flat platform, so it keeps the
      // estimate): front row at field level (-1 ft), 11° rake; behind, the
      // roof canopy 139 ft up and 30 ft back. Over 125's row 22 the club
      // deck's front row, 28 ft up (its underside 9 ft above that row's
      // floor).
      stand: { rows: 34, frontRowHeightFt: -1, rakeDeg: 11, ...PROGRESSIVE_TREAD, backHeightFt: 139, backSetbackFt: 30, deckFrontFt: 28, overhang: { coveredFromRow: 22, soffitHeightFt: 19 } },
      sections: { '117': { noCover: true, frontRowHeightFt: 3, rakeDeg: 18, backHeightFt: 60, backSetbackFt: 0 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('117', '125'), PROGRESSIVE_LIDAR],
    },
    rightField: {
      label: 'Right field (103–113)',
      // Rows A–CC; 108–113 covered from row V by the 300s above (sourced).
      // Lidar (6 of 6): front row 6 ft (5–7), 11° rake; behind, the roof
      // canopy 139 ft up and 34 ft back. The 300s' front row, 38 ft up,
      // reaches out over row 27 (V: 22) in 103–111 (none seen over 113,
      // which keeps V); its underside is not seen: 9 ft above row 27's
      // floor.
      stand: { rows: 29, frontRowHeightFt: 6, rakeDeg: 11, ...PROGRESSIVE_TREAD, backHeightFt: 139, backSetbackFt: 34, deckFrontFt: 38, overhang: { coveredFromRow: 27, soffitHeightFt: 29 } },
      sections: { '113': { overhang: { coveredFromRow: PROGRESSIVE_COVER['113'], soffitHeightFt: 29 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('103', '107', '109', '113'), PROGRESSIVE_LIDAR],
    },
    rightFieldClub: {
      label: 'Right field 300s (303–316)',
      // Rows A–U, covered from row M (sourced). Lidar (5 of 6): front row
      // 38 ft, 22° rake; the upper deck's front row, 70 ft up, reaches out
      // over their row 2, so the rows from there back are covered. Its
      // underside is not seen: that row less the park's deck depth (12 ft,
      // over the club).
      stand: { rows: 21, frontRowHeightFt: 38, rakeDeg: 22, ...PROGRESSIVE_TREAD, backHeightFt: 78, backSetbackFt: -42, deckFrontFt: 70, overhang: { coveredFromRow: 2, soffitHeightFt: 58 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('303', '309', '316'), PROGRESSIVE_LIDAR],
    },
    club: {
      label: 'Club (326–348)',
      // Rows A–T, covered from row M by the upper deck (sourced; the lidar
      // puts its edge over row 11). Lidar (11 of 12): front row 28 ft, 21°
      // rake; the upper deck's front row is 70 ft up, the lowest structure
      // at its edge 58 ft (its underside; what rises behind, 71 ft, 27 ft in
      // front of the last row).
      stand: { rows: 20, frontRowHeightFt: 28, rakeDeg: 21, ...PROGRESSIVE_TREAD, backHeightFt: 71, backSetbackFt: -27, deckFrontFt: 70, overhang: { coveredFromRow: 13, soffitHeightFt: 58 } },
      // 326 starts at row D, its first row as high as the others' row A.
      sections: progressiveCover(Array.from({ length: 23 }, (_, i) => String(326 + i)), 58),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('326', '336', '348'), PROGRESSIVE_LIDAR],
    },
    upperBox: {
      label: 'Upper boxes (403–478)',
      // Rows A–F at the front of the upper deck, open. Lidar (35 of 68; the
      // others' rows go on into the 500s' with no step to find): front row
      // 71 ft (70–75), 30° rake; behind, the roof canopy 139 ft up and 19 ft
      // back (48 behind 414).
      stand: { rows: 6, frontRowHeightFt: 71, rakeDeg: 30, treadFt: 2.6, backHeightFt: 139, backSetbackFt: 19 },
      sections: { '414': { backSetbackFt: 48 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...progressiveSections('403', '440', '478'), PROGRESSIVE_LIDAR],
    },
    upper: {
      label: 'Upper reserved (519–567)',
      // Rows A–X, covered from row P by the canopy (sourced). Lidar (11 of
      // 24, where a step up from the boxes shows): front row 87 ft (83–87),
      // 32° rake. The canopy's edge, 138 ft up (its top; the scan sees
      // nothing under it), is over row 4 (6 in two), twelve rows ahead of
      // the source's, so the rows from D are covered; the canopy is also what
      // rises highest behind. Its top stands in for its underside, so the
      // tier's heights stay estimated.
      stand: { rows: 24, frontRowHeightFt: 87, rakeDeg: 32, treadFt: 2.6, backHeightFt: 136, backSetbackFt: -40, overhang: { coveredFromRow: 4, soffitHeightFt: 138 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('519', '541', '554', '567'), PROGRESSIVE_LIDAR],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor, the deck above reaching past them as is
      // typical. Estimated ~50 ft up.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 59, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/guardians/ballpark/suites'],
    },
  },
  reviewedOn: '2026-11-13',
};

const rysTarget = (path: string) => `https://www.rateyourseats.com/target-field/seating/${path}`;
const RYS_TARGET = rysTarget('shaded-covered-seats');
const targetSections = (...ids: string[]) => ids.map((n) => rysTarget(`sections/${n}`));
/** Target Field's covered rows as positions in each section's numbered rows (Rate Your Seats). */
const TARGET_COVER: Record<string, number> = {
  '101': 32, '102': 39, '103': 41, '104': 41, '105': 25,
  '124': 37, '125': 37, '126': 37,
  '301': 8, '302': 7, '303': 7, '304': 4, '326': 6, '327': 8,
};
const targetCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => TARGET_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: TARGET_COVER[id], soffitHeightFt } }]));
const targetIds = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
const TARGET_LIDAR = 'USGS 3DEP lidar MN_CentralMissRiver_B22, flown 2022-05-16 to 2022-05-24 (scripts/measureStandHeights.py)';

/** Seating ring of a Target Field chart section. */
export function targetTier(id: string): string | null {
  if (/^ES[A-H]$/.test(id)) return 'suite';
  if (/^\d{1,2}$/.test(id)) return 'box';
  if (/^[A-V]$/.test(id)) return id === 'E' ? 'clubCoverUnsourced' : /^[F-J]$/.test(id) ? 'clubOpen' : 'club';
  // The Delta suite, the party deck, the dock and standing room: no source
  // gives their seats or cover.
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 106 || (n >= 123 && n <= 127)) return 'corner';
  if (n <= 122) return 'infield';
  if (n <= 131) return 'bleachers';
  if (n <= 135) return 'cove';
  if (n <= 140) return 'rightField';
  if (n <= 228) return 'terrace';
  if (n <= 234) return 'porch';
  if (n <= 240) return 'rightFieldDeck';
  if (n <= 327) return 'view';
  return 'porchUpper';
}

/**
 * Target Field (2010). Boxes (1–17, rows to 13) in front of the 100s (rows
 * 1–28, to 44 in the corners), which the club deck covers from row 17; the
 * Delta club (A–V, rows 1–12) on that deck, and the upper deck over its back
 * rows: the 200s its front rows, the 300s behind them under the canopy from
 * row 3. In left field, bleachers (128–131) under the 200-level porch and the
 * 300-level porch above; in right field, Treasure Island Cove (132–135,
 * covered) under the right-field 200s, and open seats. Rows and covered rows
 * are Rate Your Seats' section pages.
 *
 * Heights: USGS lidar (Minnesota, May 2022); no structural change since. The
 * 300s, the bleachers and the cove are hidden from the air under the decks
 * above them.
 */
const TARGET: StadiumStructure = {
  stadiumId: 'twins',
  // Far rim: the canopy, 148 ft up (lidar), ~560 ft across the field.
  park: { roof: 'open', farRimHeightFt: 148, fieldCrossingFt: 563 },
  tierOf: targetTier,
  tiers: {
    box: {
      label: 'Boxes (1–17)',
      // Rows 1–13 (5–13 behind the dugouts), open ("rarely shaded"). Lidar
      // (16 of 17): front row 1 ft (-1–2; row 5 behind the dugouts as high),
      // 11° rake; behind, the canopy 148 ft up and 84 ft back.
      stand: { rows: 13, frontRowHeightFt: 1, rakeDeg: 11, treadFt: 2.8, backHeightFt: 148, backSetbackFt: 84 },
      sections: { '3': { backSetbackFt: 73 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('1', '4', '11', '14', '16'), TARGET_LIDAR],
    },
    infield: {
      label: 'Infield 100s (107–122)',
      // Rows 1–28, covered from row 17 by the club level (sourced; "the
      // last twelve rows"). Lidar (16 of 16): front row 9 ft (8–10), 14°
      // rake; behind, the canopy 148 ft up over the last row. The club
      // deck's front row, 37 ft up, reaches out over row 14–17 (14 in six,
      // which take it); its underside is not seen: 9 ft above the covered
      // row's floor.
      stand: { rows: 28, frontRowHeightFt: 9, rakeDeg: 14, treadFt: 2.8, backHeightFt: 148, backSetbackFt: -2, deckFrontFt: 37, overhang: { coveredFromRow: 17, soffitHeightFt: 29 } },
      sections: Object.fromEntries(['107', '111', '113', '118', '119', '121'].map((id) => [id, { overhang: { coveredFromRow: 14, soffitHeightFt: 28 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('107', '110', '114', '118', '122'), TARGET_LIDAR],
    },
    corner: {
      label: 'Corners (101–106, 123–127)',
      // Rows 1–28 to 1–44; 101–104 covered from row 41 (here 32–41), 105
      // from 25, 124–126 from 37 (sourced); 106, 123 and 127 not. Lidar (11
      // of 11): front row at field level (-2–2 ft), 13° rake; behind, the
      // canopy 148 ft up, 17 ft back (by section, below). The club deck's
      // front row, 37 ft up, reaches out over row 26 of 105, 106 and 123
      // (which take it; 105's source says 25), its underside 9 ft above
      // that row's floor. Over 101–104 and 124–126 the scan's "edge" is a
      // thin cable line, not a deck: their sourced rows stand, under an
      // estimated ~54 ft.
      stand: { rows: 44, frontRowHeightFt: 0, rakeDeg: 13, treadFt: 2.8, backHeightFt: 148, backSetbackFt: 17 },
      sections: {
        ...targetCover([...targetIds(101, 104), '124', '125', '126'], 54),
        '101': { backHeightFt: 147, backSetbackFt: 32, overhang: { coveredFromRow: TARGET_COVER['101'], soffitHeightFt: 54 } },
        '103': { backSetbackFt: -8, overhang: { coveredFromRow: TARGET_COVER['103'], soffitHeightFt: 54 } },
        '104': { backSetbackFt: 6, overhang: { coveredFromRow: TARGET_COVER['104'], soffitHeightFt: 54 } },
        '105': { backSetbackFt: 31, deckFrontFt: 37, overhang: { coveredFromRow: TARGET_COVER['105'], soffitHeightFt: 28 } },
        ...Object.fromEntries(['106', '123'].map((id) => [id, { backSetbackFt: 31, deckFrontFt: 37, overhang: { coveredFromRow: 26, soffitHeightFt: 28 } }])),
        '125': { backSetbackFt: 1, overhang: { coveredFromRow: TARGET_COVER['125'], soffitHeightFt: 54 } },
        '127': { backHeightFt: 145, backSetbackFt: 50 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('101', '104', '105', '106', '123', '124', '127'), TARGET_LIDAR],
    },
    club: {
      label: 'Delta SKY360 Club (A–D, K–V)',
      // Rows 1–12 (to 14), covered from row 9 (sourced). Lidar (14 of 15):
      // front row 38 ft, 21° rake; the upper deck's front row, 72–73 ft up,
      // reaches out over row 6, three rows ahead of the source's, so the
      // rows from 6 are covered; its underside is not seen: that row less
      // 9 ft. Behind, its front rises to 76 ft, 18 ft in front of the last
      // row.
      stand: { rows: 12, frontRowHeightFt: 38, rakeDeg: 21, treadFt: 2.8, backHeightFt: 76, backSetbackFt: -18, deckFrontFt: 72, overhang: { coveredFromRow: 6, soffitHeightFt: 63 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('A', 'D', 'K', 'R', 'V'), TARGET_LIDAR],
    },
    clubOpen: {
      label: 'Delta SKY360 Club (F–J)',
      // Rows 1–12 behind home with no covered rows given; "E–J start in the
      // sun and eventually become shaded". Lidar (4 of 4): front row 38 ft,
      // 22° rake; the upper deck's front row, 72 ft up, reaches out over row
      // 6 (its underside that less 9 ft), rising to 75 ft 16 ft in front of
      // the last row.
      stand: { rows: 12, frontRowHeightFt: 38, rakeDeg: 22, treadFt: 2.8, backHeightFt: 75, backSetbackFt: -16, deckFrontFt: 72, overhang: { coveredFromRow: 6, soffitHeightFt: 63 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('F', 'H', 'J'), TARGET_LIDAR],
    },
    clubCoverUnsourced: {
      label: 'Delta SKY360 Club (E)',
      // "All seats … shaded during most day games"; no covered rows given.
      // Lidar: front row 38 ft, 21° rake; the upper deck's front row, 72 ft
      // up, reaches out over row 6 (its underside that less 9 ft), rising to
      // 76 ft 16 ft in front of the last row.
      stand: { rows: 12, frontRowHeightFt: 38, rakeDeg: 21, treadFt: 2.8, backHeightFt: 76, backSetbackFt: -16, deckFrontFt: 72, overhang: { coveredFromRow: 6, soffitHeightFt: 63 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...targetSections('E'), TARGET_LIDAR],
    },
    terrace: {
      label: 'Terrace (201–228)',
      // Rows 1–4 to 1–8, open (no covered rows given): the upper deck's
      // front rows. Lidar (26 of 28): front row 73 ft, 31° rake; behind, the
      // canopy 148 ft up over the last row (over 225 and 226 the scan's
      // "edge" is the walkway at the top of their rows).
      stand: { rows: 6, frontRowHeightFt: 73, rakeDeg: 31, treadFt: 2.8, backHeightFt: 148, backSetbackFt: -1 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...targetSections('201', '211', '220', '228'), TARGET_LIDAR],
    },
    view: {
      label: 'View level (301–327)',
      // Rows 1–14, covered from row 3 by the canopy (7–8 at the ends;
      // sourced). Hidden from the air behind the 200s, under the canopy: the
      // 200s' measured slope (73 ft, 31°) carried back over their six rows
      // (83 ft); the canopy, 148 ft up where the scan sees its edge (its top).
      stand: { rows: 14, frontRowHeightFt: 83, rakeDeg: 31, treadFt: 2.7, backHeightFt: 148, overhang: { coveredFromRow: 3, soffitHeightFt: 148 } },
      sections: targetCover(['301', '302', '303', '304', '326', '327'], 148),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('301', '303', '310', '320', '327')],
    },
    bleachers: {
      label: 'Left-field bleachers (128–131)',
      // Rows 1–15/16 under the 200 level from row 3 (sourced: "all rows …
      // covered by the overhang" but "the first couple rows … always in the
      // sun"). Hidden from the air under the porch. Estimated: front ~10 ft,
      // 20° rake; deck underside ~32 ft (the porch's front row, 41 ft by
      // lidar, less 9 ft).
      stand: { rows: 15, frontRowHeightFt: 10, rakeDeg: 20, treadFt: 2.8, backHeightFt: 50, overhang: { coveredFromRow: 3, soffitHeightFt: 32 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('128', '131')],
    },
    porch: {
      label: 'Home Run Porch, 200 level (229–234)',
      // Rows 1–4 to 1–7, open ("the only shade comes from the clouds").
      // Lidar (5 of 6): front row 41 ft, 32° rake; behind, the upper porch's
      // front 62 ft up and 6 ft back.
      stand: { rows: 6, frontRowHeightFt: 41, rakeDeg: 32, treadFt: 2.8, backHeightFt: 62, backSetbackFt: 6 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('229', '234'), TARGET_LIDAR],
    },
    porchUpper: {
      label: 'Home Run Porch, 300 level (329–334)',
      // Rows 1–16, open. Lidar (4 of 8): front row 61 ft, 36° rake; behind,
      // 87–109 ft up right behind the last row (the scoreboard, the bottom
      // of its face 99 ft, reaches over 331's and 332's last two rows,
      // too few to change the source's open rows; nothing behind 333).
      stand: { rows: 16, frontRowHeightFt: 61, rakeDeg: 36, treadFt: 2.8, backHeightFt: 97, backSetbackFt: 1 },
      sections: { '331': { backHeightFt: 109, backSetbackFt: 2 }, '333': { backHeightFt: 32, backSetbackFt: 129 }, '334': { backHeightFt: 87, backSetbackFt: 1 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('329', '334'), TARGET_LIDAR],
    },
    cove: {
      label: 'Treasure Island Cove (132–135)',
      // Rows 1–4, all under the overhang (sourced). Hidden from the air under
      // the right-field 200s. Estimated: front ~14 ft over the wall; deck
      // underside ~33 ft (the 200s' front row, 42 ft by lidar, less 9 ft).
      stand: { rows: 4, frontRowHeightFt: 14, rakeDeg: 15, treadFt: 2.8, backHeightFt: 40, overhang: { coveredFromRow: 1, soffitHeightFt: 33 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('132', '135')],
    },
    rightField: {
      label: 'Right field (136–140)',
      // Rows 1–7, open. Lidar (5 of 5): front row 21 ft (20–22) over the
      // wall, 16° rake; behind, 32 ft up right behind the last row (44 ft
      // and 68 ft back behind 139, 82 ft and 50 ft back behind 140).
      stand: { rows: 7, frontRowHeightFt: 21, rakeDeg: 16, treadFt: 2.8, backHeightFt: 32, backSetbackFt: 4 },
      sections: { '139': { backHeightFt: 44, backSetbackFt: 68 }, '140': { backHeightFt: 82, backSetbackFt: 50 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...targetSections('136', '138'), TARGET_LIDAR],
    },
    rightFieldDeck: {
      label: 'Right-field 200s (237–240)',
      // Rows 1–12 to 1–22, open ("no shade for day games"). Lidar (3 of 4):
      // front row 42 ft (52 in 240), 35° rake; behind, a roof 78 ft up over
      // the last two rows. Over 239's and 240's last rows stands an open
      // frame (a lamp bank, 75–128 ft), neither a deck nor a wall: left out,
      // as the light towers are.
      stand: { rows: 16, frontRowHeightFt: 42, rakeDeg: 35, treadFt: 2.8, backHeightFt: 78, backSetbackFt: -6 },
      sections: { '240': { frontRowHeightFt: 52 } },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...targetSections('237', '240'), TARGET_LIDAR],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling, 9 ft above the floor, the deck above reaching past them as is
      // typical. Estimated ~50 ft up.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 59, reachFt: SUITE_DECK_REACH_FT } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/twins/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-13',
};

const rysRate = (path: string) => `https://www.rateyourseats.com/rate-field/seating/${path}`;
const RYS_RATE = rysRate('shaded-covered-seats');
const rateSections = (...ids: string[]) => ids.map((n) => rysRate(`sections/${n}`));
/** Rate Field's covered rows as positions in each section's numbered rows (Rate Your Seats). */
const RATE_COVER: Record<string, number> = {
  '109': 27, '110': 30, '111': 30, '112': 31, '113': 31, '114': 31, '115': 31, '116': 31, '117': 31, '118': 31,
  '119': 31, '120': 30, '121': 29, '122': 26, '123': 26, '124': 26, '125': 26, '126': 26, '127': 26, '128': 30,
  '129': 30, '130': 21, '131': 18, '132': 18, '133': 18, '134': 21, '135': 30, '136': 30, '137': 26, '138': 26,
  '139': 26, '140': 26, '141': 26, '142': 26, '143': 29, '144': 30, '145': 31, '146': 31, '147': 31, '148': 31,
  '149': 31, '150': 31, '151': 31, '152': 31, '153': 30, '154': 27, '155': 27,
  '514': 6, '516': 4, '518': 6, '524': 6, '540': 6, '546': 6, '548': 4, '550': 6,
};
/** The row each lower-box section starts at, where it is not 1 (Rate Your Seats). */
const RATE_FIRST_ROW: Record<string, number> = {
  '108': 9, '109': 7, '110': 4, '121': 2, '122': 5, '123': 5, '124': 5, '125': 5, '126': 5, '127': 5,
  '130': 13, '131': 16, '132': 16, '133': 16, '134': 13, '137': 5, '138': 5, '139': 5, '140': 5, '141': 5,
  '142': 5, '143': 2, '154': 4, '155': 4, '156': 8,
};
const RATE_LIDAR = 'USGS 3DEP lidar IL_4County_Cook_2017, flown 2017-04-18 to 2017-05-08 (scripts/measureStandHeights.py)';
const RATE_LOWER = { frontRowHeightFt: 0, rakeDeg: 14 };
const rateRise = 2.75 * Math.tan((RATE_LOWER.rakeDeg * Math.PI) / 180);
/** The lower box's first covered row (position) where the scan's club-deck edge is not the tier's row 26. */
const RATE_EDGE_ROW: Record<string, number> = {
  ...Object.fromEntries(['121', '122', '123', '124', '125', '126', '138', '139', '140', '141', '142', '143'].map((id) => [id, 21])),
  '155': 22, '109': 29, '129': 29,
};
/** The lower box's back where it differs: the roof, 130 ft up, this far behind the last row (lidar). */
const RATE_LOWER_BACK: Record<string, number> = {
  '108': 50, '109': 18, '111': 18, '110': 29, '130': 32, '134': 32, '131': 45, '132': 39, '133': 43, '156': 43, '154': 27,
};

/** Seating ring of a Rate Field chart section. */
export function rateTier(id: string): string | null {
  // The named clubs, decks and standing areas: no source gives their seats
  // or cover.
  if (!/^\d{3}A?$/.test(id)) return null;
  const n = Number(id.slice(0, 3));
  if (n <= 105) return 'rightField';
  if (n <= 156) return 'lowerBox';
  if (n <= 164) return 'leftField';
  if (n <= 399) return 'club';
  return 'upper';
}

/**
 * Rate Field (1991; roof over the upper deck since 2004). A lower box (108–
 * 156, rows to 35–37) covered from row 30 or 33 by the club level; the club
 * boxes (311–357, rows 1–5) under the upper deck; the upper deck (506–558,
 * rows 1–21) under a roof from row 9; open outfield stands. Rows and covered
 * rows are Rate Your Seats' section pages.
 *
 * Heights: USGS lidar (Cook County, April–May 2017). Since then the 500
 * level gained two view bars (2023); the upper-deck sections the chart now
 * gives fewer rows start that many rows up the measured deck.
 */
const RATE: StadiumStructure = {
  stadiumId: 'whitesox',
  // Far rim: the roof, 130 ft up (lidar), ~580 ft across the field.
  park: { roof: 'open', farRimHeightFt: 130, fieldCrossingFt: 581 },
  tierOf: rateTier,
  tiers: {
    lowerBox: {
      label: 'Lower box (108–156)',
      // Covered from row 30 or 33 (here 18–31; sourced); 108 and 156 not.
      // Lidar (49 of 49): front row at field level (-1–3 ft), 14° rake
      // (higher where a section starts behind a dugout or the scout seats:
      // that row on the slope); behind, the roof 130 ft up and 6 ft back (by
      // section, below). The club deck's front row, 48 ft up, reaches out
      // over position 26 (21–22 where a section starts at row 2–5, 29 in 109
      // and 129; sourced 26–31), which the tier takes; its underside is not
      // seen: that row less 9 ft (36 over 109, the lowest structure there).
      // Over 130–134 the scan sees no edge, so their sourced rows stand.
      stand: { rows: 37, ...RATE_LOWER, backHeightFt: 130, backSetbackFt: 6, deckFrontFt: 48, overhang: { coveredFromRow: 26, soffitHeightFt: 39 } },
      sections: Object.fromEntries(Array.from({ length: 49 }, (_, i) => String(108 + i)).map((id) => [id, {
        ...(RATE_FIRST_ROW[id] ? { frontRowHeightFt: RATE_LOWER.frontRowHeightFt + (RATE_FIRST_ROW[id] - 1) * rateRise } : {}),
        ...(RATE_LOWER_BACK[id] ? { backSetbackFt: RATE_LOWER_BACK[id] } : {}),
        ...(RATE_EDGE_ROW[id] ? { overhang: { coveredFromRow: RATE_EDGE_ROW[id], soffitHeightFt: id === '109' ? 36 : 39 } } : {}),
        ...(['130', '131', '132', '133', '134'].includes(id) ? { overhang: { coveredFromRow: RATE_COVER[id], soffitHeightFt: 39 } } : {}),
        ...(RATE_COVER[id] ? {} : { noCover: true }),
      }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('108', '112', '122', '127', '132', '137', '145', '152', '156'), RATE_LIDAR],
    },
    rightField: {
      label: 'Right-field outfield reserved (100–105)',
      // Rows 1–28 (104–105 from row 9), open ("none of the outfield seats
      // are covered"). Lidar (6 of 6): front row 5 ft (9 in 104–105), 15°
      // rake; behind, 27–89 ft up by section.
      stand: { rows: 28, frontRowHeightFt: 5, rakeDeg: 15, backHeightFt: 35, backSetbackFt: 25 },
      sections: {
        '100': { backHeightFt: 27, backSetbackFt: 7 },
        '101': { backHeightFt: 33, backSetbackFt: 6 },
        '102': { backHeightFt: 38, backSetbackFt: 43 },
        '103': { backHeightFt: 89, backSetbackFt: 45 },
        '104': { frontRowHeightFt: 9, backHeightFt: 27, backSetbackFt: 7 },
        '105': { frontRowHeightFt: 9, backHeightFt: 36, backSetbackFt: 40 },
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('100', '102', '105'), RATE_LIDAR],
    },
    leftField: {
      label: 'Left-field outfield reserved and bleachers (157–164)',
      // Rows 1–28 (157–158 from row 8), open in the source. Lidar (8 of 8):
      // front row 5 ft (9 in 157–158), 15° rake; behind, 37–89 ft up by
      // section. Over 158's row 19 and 159's row 25 a structure reaches out,
      // the bottom of its face 45–46 ft up, so those rows are covered.
      stand: { rows: 28, frontRowHeightFt: 5, rakeDeg: 15, backHeightFt: 37, backSetbackFt: 48 },
      sections: {
        '157': { frontRowHeightFt: 9, backHeightFt: 73, backSetbackFt: 4 },
        '158': { frontRowHeightFt: 9, backHeightFt: 52, backSetbackFt: -6, overhang: { coveredFromRow: 19, soffitHeightFt: 46 } },
        '159': { backHeightFt: 48, backSetbackFt: -4, overhang: { coveredFromRow: 25, soffitHeightFt: 45 } },
        ...Object.fromEntries(['161', '163'].map((id) => [id, { backHeightFt: 89 }])),
      },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('157', '160', '164'), RATE_LIDAR],
    },
    club: {
      label: 'Club (311–357)',
      // Rows 1–5 under the upper deck; no source gives covered rows. Lidar
      // (17 of 26): front row 48 ft, 28° rake; the upper deck's front row,
      // 71 ft up (70–72), reaches out over row 4, so rows 4–5 are covered;
      // its underside is not seen: that row less 9 ft (69 over 312, the
      // lowest structure there). Behind, its front 73 ft up and 3 ft in
      // front of the last row (the roof, 130 ft and 26 ft back, behind 356).
      stand: { rows: 5, frontRowHeightFt: 48, rakeDeg: 28, backHeightFt: 73, backSetbackFt: -3, deckFrontFt: 71, overhang: { coveredFromRow: 4, soffitHeightFt: 62 } },
      sections: { '356': { backHeightFt: 130, backSetbackFt: 26 }, '312': { overhang: { coveredFromRow: 4, soffitHeightFt: 69 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...rateSections('311', '320', '330', '342', '357'), RATE_LIDAR],
    },
    upper: {
      label: 'Upper deck (506–558)',
      // Rows 1–21, covered from row 9 by the roof (sourced). Lidar (34 of
      // 36): front row 72 ft (70–80), 33° rake; the roof's edge is over row 7
      // (2 rows ahead of the source's, which stands; in 507, 509, 522, 526,
      // 538, 542 and 554 the cut starts a few rows up, past an aisle, and
      // counted from row 1 their edge is there too), the bottom of its face
      // 123 ft up (121–124); its top, 130 ft, is what rises behind. Sections
      // the chart gives 18 or 16 rows (covered from 6 or 4) start 3 or 5
      // rows up the deck (77 and 80 ft; 514 and 550 measure 78).
      stand: { rows: 21, frontRowHeightFt: 72, rakeDeg: 33, treadFt: 2.6, backHeightFt: 130, backSetbackFt: -37, overhang: { coveredFromRow: 9, soffitHeightFt: 123 } },
      sections: Object.fromEntries(['514', '516', '518', '524', '540', '546', '548', '550'].map((id) => [id, {
        frontRowHeightFt: RATE_COVER[id] === 4 ? 80 : 77,
        overhang: { coveredFromRow: RATE_COVER[id], soffitHeightFt: 123 },
      }])),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('506', '516', '530', '548', '558'), RATE_LIDAR],
    },
  },
  reviewedOn: '2026-11-13',
};

const SUTTER_MAP = 'https://www.mlb.com/athletics/ballpark/seating-map';
const SUTTER_SHADE = 'https://www.shadedseats.com/sutter-health-park-shaded-seats/';
const SUTTER_PHOTO = 'USGS NAIP m_3812128_ne_10_060_20220621';
const SUTTER_LIDAR = 'USGS 3DEP lidar CA_NoCAL_Wildfires_B5a_2018, flown 2019-02-10 to 2019-02-12 (scripts/measureStandHeights.py)';
const SUTTER_LOWER = { frontRowHeightFt: 0, rakeDeg: 13, treadFt: 2.8 };
const sutterRise = 2.8 * Math.tan((SUTTER_LOWER.rakeDeg * Math.PI) / 180);
/** Front-row height of a section whose rows start this many rows up (behind a dugout). */
const sutterFront = (rowsUp: number) => ({ frontRowHeightFt: SUTTER_LOWER.frontRowHeightFt + rowsUp * sutterRise });

/** Seating ring of a Sutter Health Park chart section. */
export function sutterTier(id: string): string | null {
  if (!/^\d{3}$/.test(id)) return null;
  const n = Number(id);
  if (n <= 107) return 'first';
  if (n <= 116) return 'home';
  if (n <= 123) return 'third';
  return 'club';
}

/**
 * Sutter Health Park (2000, as Raley Field; the Athletics' home from 2025).
 * One seating bowl (101–123) with the suites and press box behind it from
 * the first-base curve round the third-base side, and a five-row club
 * (201–206) raised behind 101–106. Rows are the club's own drawing (see
 * chart-points/athletics.ts); no source lists covered rows.
 *
 * Heights: USGS lidar (February 2019). The 2025 work for the Athletics
 * (clubhouses, field, dugouts, refitted clubs) left the stands as they were.
 */
const SUTTER: StadiumStructure = {
  stadiumId: 'athletics',
  // Far rim: the suite and press-box structure, 56 ft up (lidar), ~520 ft
  // across the field.
  park: { roof: 'open', farRimHeightFt: 56, fieldCrossingFt: 523 },
  tierOf: sutterTier,
  tiers: {
    home: {
      label: 'Behind home (108–116)',
      // 29 rows (22 in 111–113, in front of the tables). Lidar (9 of 9):
      // front row at field level, 13° rake; behind, the suites and press
      // box, 56 ft up right behind the last row (19 ft back behind 111–113,
      // past the tables; 61 ft behind 112). A balcony, its underside 33 ft
      // up, reaches over 116's last three rows.
      stand: { rows: 29, ...SUTTER_LOWER, backHeightFt: 56, backSetbackFt: 2 },
      sections: {
        ...Object.fromEntries(['111', '113'].map((id) => [id, { backSetbackFt: 19 }])),
        '112': { backHeightFt: 61, backSetbackFt: 19 },
        '116': { overhang: { coveredFromRow: 27, soffitHeightFt: 33 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO, SUTTER_LIDAR],
    },
    third: {
      label: 'Third-base side (117–123)',
      // Open in the source; the suite building ending before 123 ("extends
      // past the structure that blocks the sun"). 117–118 start behind the
      // home dugout (~4 rows up). Lidar (6 of 7): front row at field level
      // (3–4 ft at 117–118's first row), 13° rake; behind, the suite
      // building 55 ft up, 4 ft in front of the last row (23 ft in front of
      // 119's; 53 ft and 16 ft back behind 122). The suite building and a
      // balcony in front of it reach out over row 24 (21 in 118, 30 in 120,
      // 29 in 121), so the rows from there back are covered: under the
      // balcony, the lowest structure 33–38 ft up (the bottom of its face
      // 33 ft over 117); over 119 the building's own roof, 54 ft (its top).
      // Nothing over 122 and 123.
      stand: { rows: 32, ...SUTTER_LOWER, backHeightFt: 55, backSetbackFt: -4, overhang: { coveredFromRow: 24, soffitHeightFt: 35 } },
      sections: {
        '117': sutterFront(4),
        '118': { ...sutterFront(4), overhang: { coveredFromRow: 21, soffitHeightFt: 33 } },
        '119': { backSetbackFt: -23, overhang: { coveredFromRow: 24, soffitHeightFt: 54 } },
        '120': { overhang: { coveredFromRow: 30, soffitHeightFt: 35 } },
        '121': { overhang: { coveredFromRow: 29, soffitHeightFt: 38 } },
        '122': { noCover: true, backHeightFt: 53, backSetbackFt: 16 },
        // 12 rows; only its own back stands behind it.
        '123': { noCover: true, backHeightFt: SUTTER_LOWER.frontRowHeightFt + 11 * sutterRise + 4, backSetbackFt: 0 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO, SUTTER_LIDAR],
    },
    first: {
      label: 'First-base side (101–107)',
      // The club deck behind; its canopy reaches over "the very back of
      // sections 103–105" (no rows given; the last four on the photo, row
      // 27). 106–107 start behind the visitors' dugout. Lidar (6 of 7):
      // front row at field level (3 ft at 105–107), 13° rake; behind, 52 ft
      // up and 5 ft back (49 ft and 39 ft back behind 102; 56 ft, 16 ft in
      // front of 105's last row). The club's front row, 29 ft up, is over
      // row 26–27 of 103 and 104, so row 27 stands, its underside 9 ft above
      // that row's floor; over 105's row 24 the bottom of a face, 35 ft up,
      // which it takes.
      stand: { rows: 30, ...SUTTER_LOWER, backHeightFt: 52, backSetbackFt: 5 },
      sections: {
        ...Object.fromEntries(['103', '104'].map((id) => [id, { deckFrontFt: 29, overhang: { coveredFromRow: 27, soffitHeightFt: 26 } }])),
        '102': { backHeightFt: 49, backSetbackFt: 39 },
        '105': { backHeightFt: 56, backSetbackFt: -16, overhang: { coveredFromRow: 24, soffitHeightFt: 35 } },
        '106': sutterFront(6),
        '107': sutterFront(6),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO, SUTTER_LIDAR],
    },
    club: {
      label: 'Club (201–206)',
      // Five rows raised behind 101–106, open ("remain sunny the longest").
      // Lidar (5 of 6): front row 31 ft, 22° rake; behind, the club building
      // 49 ft up right behind the last row.
      stand: { rows: 5, frontRowHeightFt: 31, rakeDeg: 22, treadFt: 2.8, backHeightFt: 49, backSetbackFt: 0 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_LIDAR],
    },
  },
  reviewedOn: '2026-11-13',
};

const CHASE_SHADE = 'https://www.shadedseats.com/chase-field-shaded-seats/';
const CHASE_RYS = 'https://www.rateyourseats.com/chase-field/seating/shaded-covered-seats';
const CHASE_PHOTO = 'USGS NAIP m_3311240_nw_12_.6_20170602 (roof open; also the 2010, 2013 and 2015 flights)';
const CHASE_HEIGHT = 'https://www.mlb.com/news/chase-field-guide-capacity-seating-chart-parking-and-more';
const chaseSection = (n: string) => `https://www.rateyourseats.com/chase-field/seating/sections/${n}`;
/**
 * Per section, from the 2017 photo with the roof open: the first covered row
 * (0 = none) and what covers it ('d' the suite deck behind home, 'r' the
 * roof: a parked panel stack or the fixed roof behind home), then how far
 * behind the last row (m) the roof's edge stands. Worked out from each
 * section's place on the pinned seat map, its rows (0.85 m apart) running
 * back along its stand direction, and three measured edges: the suite deck
 * 21.3 m behind home on the axis widening to 34.5 m at ±50° (the same in
 * the 2010, 2013, 2015 and 2017 flights); the parked panels, whose inner
 * edges are 142–145 m apart in all four flights (their apparent place moves
 * up to 35 m with the camera's lean), so 72 m either side of home; and the
 * fixed roof behind home, 35–43 m behind the plate (37 m used).
 */
const CHASE_ROOF: Record<string, [number, '' | 'd' | 'r', number]> = {
  '101': [0, '', 17.5], '102': [26, 'r', 0], '103': [18, 'r', 0], '104': [4, 'r', 0], '105': [1, 'r', 0],
  '106': [1, 'r', 0], '107': [1, 'r', 0], '108': [1, 'r', 0], '109': [5, 'r', 0], '110': [14, 'r', 0],
  '111': [24, 'r', 0], '112': [35, 'r', 0], '113': [0, '', 3.5], '114': [0, '', 11], '115': [0, '', 21.5],
  '116': [0, '', 31.5], '117': [0, '', 24], '118': [7, 'd', 13.5], '119': [1, 'd', 2.5], '120': [1, 'd', 0],
  '121': [1, 'd', 0], '122': [1, 'd', 0], '123': [1, 'd', 0], '124': [1, 'd', 0], '125': [1, 'd', 2.5],
  '126': [7, 'd', 13.5], '127': [0, '', 24], '128': [0, '', 32], '129': [0, '', 21.5], '130': [0, '', 11],
  '131': [0, '', 3], '132': [34, 'r', 0], '133': [23, 'r', 0], '134': [14, 'r', 0], '135': [9, 'r', 0],
  '136': [1, 'r', 0], '137': [1, 'r', 0], '138': [1, 'r', 0], '139': [2, 'r', 0], '140': [11, 'r', 0],
  '141': [24, 'r', 0], '142': [0, '', 0.5], '143': [0, '', 15], '144': [0, '', 35], '200': [1, 'r', 0],
  '201': [1, 'r', 0], '202': [1, 'r', 0], '203': [1, 'r', 0], '204': [4, 'r', 0], '205': [0, '', 2.5],
  '206': [0, '', 10], '207': [0, '', 19], '208': [0, '', 26], '209': [0, '', 14], '211': [0, '', 14],
  '212': [0, '', 26], '213': [0, '', 19], '214': [0, '', 10.5], '215': [0, '', 2.5], '216': [3, 'r', 0],
  '217': [1, 'r', 0], '218': [1, 'r', 0], '219': [1, 'r', 0], '220': [1, 'r', 0], '221': [1, 'r', 0],
  '222': [1, 'r', 0], '223': [1, 'r', 0], '300': [1, 'r', 0], '301': [1, 'r', 0], '302': [1, 'r', 0],
  '303': [1, 'r', 0], '304': [1, 'r', 0], '305': [1, 'r', 0], '306': [1, 'r', 0], '307': [4, 'r', 0],
  '308': [16, 'r', 0], '309': [27, 'r', 0], '310': [14, 'r', 0], '311': [4, 'r', 0], '312': [1, 'r', 0],
  '313': [1, 'r', 0], '314': [1, 'r', 0], '315': [1, 'r', 0], '316': [1, 'r', 0], '317': [1, 'r', 0],
  '318': [1, 'r', 0], '319': [1, 'r', 0], '320': [1, 'r', 0], '321': [4, 'r', 0], '322': [14, 'r', 0],
  '323': [22, 'r', 0], '324': [15, 'r', 0], '325': [3, 'r', 0], '326': [1, 'r', 0], '327': [1, 'r', 0],
  '328': [1, 'r', 0], '329': [1, 'r', 0], '330': [1, 'r', 0], '331': [1, 'r', 0], '332': [1, 'r', 0],
  '210F': [1, 'r', 0], '210G': [1, 'r', 0], '210H': [1, 'r', 0], '210I': [0, '', 2], A: [0, '', 26.5],
  B: [0, '', 33], C: [0, '', 33.5], D: [0, '', 40], E: [0, '', 47], F: [0, '', 41], G: [0, '', 34],
  H: [0, '', 23], I: [9, 'd', 13.5], J: [6, 'd', 9], K: [10, 'd', 13.5], L: [0, '', 24.5],
  M: [0, '', 34.5], N: [0, '', 40], O: [0, '', 47], P: [0, '', 40.5], Q: [0, '', 33], R: [0, '', 34.5],
  S: [0, '', 27.5],
};
/** The first labelled row where it is not 1 (Rate Your Seats): rows 1–20 behind home are the boxes in front. */
const CHASE_FIRST_ROW: Record<string, number> = {
  '101': 22, '102': 14, '103': 14, '104': 14, '105': 17, '106': 22, '107': 25, '108': 11, '109': 5, '110': 3,
  '113': 11, '114': 11, '115': 21, '116': 21, '117': 21, '118': 21, '119': 21, '120': 21, '121': 21, '122': 21,
  '123': 21, '124': 21, '125': 21, '126': 21, '127': 21, '128': 21, '129': 21, '130': 11, '131': 11, '134': 3,
  '135': 5, '136': 11, '137': 25, '138': 22, '139': 12, '140': 11, '141': 11, '142': 11, '143': 11, '144': 11,
  C: 6, D: 6, E: 6, F: 6, N: 6, O: 6, P: 6, Q: 6,
};
const CHASE_LOWER = { frontRowHeightFt: 3, rakeDeg: 20 };
const chaseRise = 2.75 * Math.tan((CHASE_LOWER.rakeDeg * Math.PI) / 180);
/** Roof (parked panels and fixed section) top and underside, ft (estimated). */
const CHASE_ROOF_TOP = 200;
const CHASE_ROOF_UNDERSIDE = 170;
/** Underside of the suite deck behind home, ft (estimated). */
const CHASE_DECK = 50;
const chaseSections = (ids: string[]) => Object.fromEntries(ids.map((id) => {
  const [from, kind, setbackM] = CHASE_ROOF[id] ?? [0, '', 30];
  return [id, {
    ...(CHASE_FIRST_ROW[id] ? { frontRowHeightFt: CHASE_LOWER.frontRowHeightFt + (CHASE_FIRST_ROW[id] - 1) * chaseRise } : {}),
    ...(from ? { overhang: { coveredFromRow: from, soffitHeightFt: kind === 'd' ? CHASE_DECK : CHASE_ROOF_UNDERSIDE } } : {}),
    backSetbackFt: Math.round(setbackM * 3.28),
  }];
}));
const chaseIds = (re: RegExp) => Object.keys(CHASE_ROOF).filter((id) => re.test(id));

/** Seating ring of a Chase Field chart section. */
export function chaseTier(id: string): string | null {
  if (/^[A-S]$/.test(id)) return 'box';
  if (/^1\d\d$/.test(id)) return 'lower';
  if (/^2\d\d$|^210[A-I]$/.test(id)) return 'club';
  if (/^3\d\d$/.test(id)) return 'upper';
  // Wheelchair platforms (…W): no rows or cover listed.
  return null;
}

/**
 * Chase Field (1998), with the roof open. Field boxes (A–S) in front of the
 * lower bowl (101–145, rows to 39), a club and suite level (200–223, 210A–I)
 * and the upper deck (300–332). The roof opens by sliding its panels apart:
 * they stack over the stands east and west of the field from about the foul
 * poles outward, and a fixed section stays over the upper deck behind home.
 * Rate Your Seats: "Even with the roof open, the Upper Deck is well-covered,
 * as are corner sections on the infield, including 135-138, 220-223 and
 * 106-109"; shadedseats.com: 314–318 and 328–332 are "the safest options",
 * the back of 319–327 and of the first-base 300s are under the roof, and
 * the seats directly behind home are under the structures attached to it.
 * The geometry above reproduces each of those (CHASE_ROOF). MLB gives the
 * roof as 255 ft at its highest and 185 ft at its lowest; no source gives
 * the decks' heights, so they are estimated.
 */
const CHASE: StadiumStructure = {
  stadiumId: 'diamondbacks',
  // Far rim: the parked panels (~200 ft), ~145 m apart across the field.
  park: { roof: 'retractable', farRimHeightFt: CHASE_ROOF_TOP, fieldCrossingFt: 475 },
  tierOf: chaseTier,
  tiers: {
    box: {
      label: 'Field boxes (A–S)',
      // Rows A–M or 6–18 (7–14 rows; sourced). Estimated: front ~3 ft (~8 ft
      // behind the dugouts, where rows start at 6), 20° rake, suite deck
      // underside ~50 ft; the roof's edge (~200 ft) behind.
      stand: { rows: 13, ...CHASE_LOWER, backHeightFt: CHASE_ROOF_TOP },
      sections: chaseSections(chaseIds(/^[A-S]$/)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CHASE_SHADE, CHASE_PHOTO, ...['J', 'N', 'S'].map(chaseSection)],
    },
    lower: {
      label: 'Lower bowl (101–144)',
      // Rows to 39, starting at row 21 behind the boxes (sourced). Covered:
      // behind home by the suite deck, toward each corner by the parked
      // panels (CHASE_ROOF). Estimated: front ~3 ft plus ~1 ft a row where
      // the rows start further up, 20° rake.
      stand: { rows: 39, ...CHASE_LOWER, backHeightFt: CHASE_ROOF_TOP },
      sections: chaseSections(chaseIds(/^1\d\d$/)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CHASE_RYS, CHASE_SHADE, CHASE_PHOTO, ...['101', '109', '111', '122', '135', '144'].map(chaseSection)],
    },
    club: {
      label: 'Club and suite level (200–223, 210A–I)',
      // Rows 1–11 or 1–13 (210A–I: 2) (sourced); under the parked panels
      // toward the corners (CHASE_ROOF; 220–223 sourced). Whether the upper
      // deck also covers their back rows is not published. Estimated: front
      // ~45 ft, 25° rake.
      stand: { rows: 11, frontRowHeightFt: 45, rakeDeg: 25, backHeightFt: CHASE_ROOF_TOP },
      sections: chaseSections(chaseIds(/^2\d\d$|^210[A-I]$/)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [CHASE_RYS, CHASE_PHOTO, ...['200', '210F', '214', '221'].map(chaseSection)],
    },
    upper: {
      label: 'Upper deck (300–332)',
      // Rows 1–32 to 1–40 (sourced). Under the fixed roof behind home or the
      // parked panels (CHASE_ROOF), matching the published 314–318, 328–332
      // and the backs of 319–327 and the first-base 300s. Estimated: front
      // ~85 ft, 30° rake, roof underside ~170 ft.
      stand: { rows: 32, frontRowHeightFt: 85, rakeDeg: 30, treadFt: 2.6, backHeightFt: CHASE_ROOF_TOP },
      sections: chaseSections(chaseIds(/^3\d\d$/)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CHASE_RYS, CHASE_SHADE, CHASE_HEIGHT, CHASE_PHOTO, ...['300', '316', '323', '330'].map(chaseSection)],
    },
  },
  reviewedOn: '2026-11-12',
};

const DAIKIN_RYS = 'https://www.rateyourseats.com/daikin-park/seating/shaded-covered-seats';
const DAIKIN_PHOTO = 'USGS NAIP 2012-06-23, 2014-10-16, 2016-10-10, 2020-11-30 and 2024-10-13 flights, roof open (Planetary Computer NAIP archive)';
const DAIKIN_HEIGHT = 'https://www.walterpmoore.com/projects/daikin-park';
const daikinSection = (n: string) => `https://www.rateyourseats.com/daikin-park/seating/sections/${n}`;
/** First labelled row where it is not 1 (Rate Your Seats). */
const DAIKIN_FIRST_ROW: Record<string, number> = {
  '105': 12, '108': 27, '112': 5, '113': 5, '114': 5, '116': 5, '118': 12, '119': 12, '120': 12, '122': 5,
  '124': 5, '125': 5, '126': 5, '134': 9, '150': 13, '151': 13, '250': 11,
};
/**
 * First covered row, as a row label (Rate Your Seats): the club deck over
 * the field level's back rows from row 35 round the infield and down both
 * lines (122–126: "Rows 35 and above are shaded during most day games", on
 * the side that faces the afternoon sun), 25–30 behind home (118–120); the
 * terrace over the right-field stands from row 18 (150, 151 and 156 wholly).
 */
const DAIKIN_COVER_LABEL: Record<string, number> = {
  ...Object.fromEntries(['105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '116', '122', '124', '125', '126', '127', '128', '129', '131', '132', '133', '134'].map((id) => [id, 35])),
  // 153's rows skip 18–20, so its first covered row (21) is its 18th.
  '118': 25, '119': 28, '120': 30, '152': 18, '153': 18, '154': 18, '155': 18, '150': 13, '151': 13, '156': 1, '250': 11,
};
const DAIKIN_LOWER = { frontRowHeightFt: 3, rakeDeg: 20 };
const daikinRise = 2.75 * Math.tan((DAIKIN_LOWER.rakeDeg * Math.PI) / 180);
/** Roof top (fixed section and parked panels), ft (estimated; 242 ft at its highest). */
const DAIKIN_ROOF_TOP = 200;
const daikinSections = (ids: string[], soffitHeightFt: number, extra: (id: string) => Partial<StandProfile> = () => ({})) =>
  Object.fromEntries(ids.map((id) => {
    const first = DAIKIN_FIRST_ROW[id] ?? 1;
    const label = DAIKIN_COVER_LABEL[id];
    return [id, {
      ...(first > 1 && /^1/.test(id) ? { frontRowHeightFt: DAIKIN_LOWER.frontRowHeightFt + (first - 1) * daikinRise } : {}),
      ...(label ? { overhang: { coveredFromRow: Math.max(1, label - first + 1), soffitHeightFt } } : {}),
      ...extra(id),
    }];
  }));
const daikinRange = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Seating ring of a Daikin Park chart section. */
export function daikinTier(id: string): string | null {
  if (/^([A-F]|AA|7[0-5])$/.test(id)) return 'box';
  if (/^10[0-4]$/.test(id)) return 'crawford';
  if (/^15\d$/.test(id)) return 'rightField';
  if (/^25\d$/.test(id)) return 'rightFieldUpper';
  if (/^1\d\d$/.test(id)) return 'field';
  if (/^2\d\d$/.test(id)) return 'club';
  if (/^3\d\d$/.test(id)) return 'mezzanine';
  if (/^4\d\d$/.test(id)) return 'upper';
  // Suites, clubs, bars and party areas: no rows or cover listed.
  return null;
}

/**
 * Daikin Park (2000, as Enron Field; Minute Maid Park 2002–2024), with the
 * roof open. Field level (105–134, rows to 40) with dugout boxes and the
 * Diamond Club in front of it behind home, the Crawford Boxes (100–104)
 * above the left-field wall, the right-field stands (150–156) under a
 * terrace (250–255), the club level (205–236), the mezzanine (305–334) and
 * the upper deck (405–434). Rows are Rate Your Seats' section pages, and so
 * is which rows are covered: "The club level overhang protects the back
 * rows of lower level seating around the infield and down the baselines",
 * "More than half of rows on the club level are covered from above", and
 * "200, 300 and 400 level seats are protected by a well-designed roof". With
 * the roof open, its fixed section stays over the third-base side and its
 * panels stack over the first-base side and right field: averaged over four
 * flights (they lean up to 10 m with the camera), the fixed section's front
 * edge stands ~36 m back from the third-base line and the panels' ~52 m back
 * from the first-base line, in front of the upper deck's first row on both
 * sides. The roof is 242 ft at its highest (Walter P Moore); no source gives
 * the decks' heights, so they are estimated.
 */
const DAIKIN: StadiumStructure = {
  stadiumId: 'astros',
  // Far rim: the roof (~200 ft) about 500 ft across the field.
  park: { roof: 'retractable', farRimHeightFt: DAIKIN_ROOF_TOP, fieldCrossingFt: 500 },
  tierOf: daikinTier,
  tiers: {
    field: {
      label: 'Field level (105–134)',
      // Rows 1–40 (behind the dugouts from row 5; behind home 12–32)
      // (sourced), the club deck over the back rows (sourced, see above).
      // Estimated: front ~3 ft plus ~1 ft a row where rows start further up,
      // 20° rake, club deck underside ~48 ft; the roof (~200 ft) behind: right
      // behind the last row on the third-base side and behind home, ~30 ft
      // further back (the parked panels' edge) on the first-base side.
      stand: { rows: 40, ...DAIKIN_LOWER, backHeightFt: DAIKIN_ROOF_TOP },
      sections: daikinSections([...daikinRange(105, 134)], 48, (id) => (Number(id) >= 122 ? { backSetbackFt: 30 } : {})),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_RYS, DAIKIN_PHOTO, ...['109', '112', '118', '120', '122', '127', '133'].map(daikinSection)],
    },
    box: {
      label: 'Dugout boxes and Diamond Club (A–F, AA, 70–75)',
      // No source lists their rows; a few rows in front of the field level.
      // Estimated: 4 rows from ~2 ft, the field level rising behind them.
      stand: { rows: 4, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 48, backSetbackFt: 90 },
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_PHOTO],
    },
    crawford: {
      label: 'Crawford Boxes (100–104)',
      // Rows 1–10 (104: 13), open (Rate Your Seats: "among the worst" for
      // sun). Estimated: front ~21 ft (above the 19-ft wall), 20° rake; the
      // roof's track and the 115-ft left-field glass wall behind.
      stand: { rows: 10, frontRowHeightFt: 21, rakeDeg: 20, backHeightFt: 115, backSetbackFt: 20 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_RYS, DAIKIN_HEIGHT, ...['100', '102', '104'].map(daikinSection)],
    },
    rightField: {
      label: 'Right-field stands (150–156)',
      // Rows 1–25 (sourced), under the terrace from row 18 (150, 151 and 156
      // wholly) (sourced). Estimated: front ~10 ft, 20° rake, terrace
      // underside ~35 ft (36 over 152–155, 9 ft above row 18's floor), the
      // upper decks and roof behind.
      stand: { rows: 25, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: DAIKIN_ROOF_TOP, backSetbackFt: 40 },
      sections: { ...daikinSections(['150', '151', '156'], 35), ...daikinSections(daikinRange(152, 155), 36) },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_RYS, ...['150', '153', '156'].map(daikinSection)],
    },
    rightFieldUpper: {
      label: 'Right-field terrace (250–255)',
      // Rows 1–17 (250: 11–17), covered from row 6 (250 wholly) (Rate Your
      // Seats: "Rows 6 and above are shaded during most day games").
      // Estimated: front ~38 ft, 25° rake, the deck above ~60 ft.
      stand: { rows: 17, frontRowHeightFt: 38, rakeDeg: 25, backHeightFt: DAIKIN_ROOF_TOP, backSetbackFt: 20, overhang: { coveredFromRow: 6, soffitHeightFt: 60 } },
      sections: daikinSections(['250'], 60),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: ['250', '253', '255'].map(daikinSection),
    },
    club: {
      label: 'Club level (205–236)',
      // Rows 1–12 (206: 1–8; 218–220: 1–6), covered from row 5 (sourced).
      // Estimated: front ~50 ft, 25° rake, mezzanine underside ~64 ft (9 ft
      // above row 5's floor).
      stand: { rows: 12, frontRowHeightFt: 50, rakeDeg: 25, backHeightFt: DAIKIN_ROOF_TOP, overhang: { coveredFromRow: 5, soffitHeightFt: 64 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_RYS, ...['205', '212', '220', '228', '236'].map(daikinSection)],
    },
    mezzanine: {
      label: 'Mezzanine (305–334)',
      // Rows 1–5 or 1–9, covered from row 3 (309–316: "Rows 3 and above are
      // shaded during most day games"; "300 ... level seats are protected by
      // a well-designed roof"). Estimated: front ~66 ft, 25° rake, upper
      // deck underside ~78 ft.
      stand: { rows: 9, frontRowHeightFt: 66, rakeDeg: 25, backHeightFt: DAIKIN_ROOF_TOP, overhang: { coveredFromRow: 3, soffitHeightFt: 78 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_RYS, ...['309', '313', '317', '325', '333'].map(daikinSection)],
    },
    upper: {
      label: 'Upper deck (405–434)',
      // Rows 1–17 to 1–23 (sourced), under the roof: the fixed section over
      // the third-base side ("408-415 ... get excellent shade from the
      // closed roof"), the parked panels over the first-base side (their
      // edge measured in front of the first row). Estimated: front ~88 ft,
      // 30° rake, roof underside ~150 ft.
      stand: { rows: 17, frontRowHeightFt: 88, rakeDeg: 30, treadFt: 2.6, backHeightFt: DAIKIN_ROOF_TOP, overhang: { coveredFromRow: 1, soffitHeightFt: 150 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [DAIKIN_RYS, DAIKIN_HEIGHT, DAIKIN_PHOTO, ...['405', '410', '415', '420', '428', '434'].map(daikinSection)],
    },
  },
  reviewedOn: '2026-11-12',
};

const LOANDEPOT_RYS = 'https://www.rateyourseats.com/loandepot-park/seating/shaded-covered-seats';
const LOANDEPOT_SHADE = 'https://www.shadedseats.com/loandepot-park-shaded-seats/';
const LOANDEPOT_PHOTO = 'USGS NAIP m_2508015_sw_17_1_20131018 (roof fully open), with the 2017, 2019 and 2022 flights';
const loanDepotSection = (n: string) => `https://www.rateyourseats.com/loandepot-park/seating/sections/${n}`;
/**
 * Per section, from the 2013 photo with the roof fully open: the first row
 * under the roof (0 = none) and how far behind the last row (m) the roof's
 * edge stands. Worked out from each section's place on the pinned seat map
 * and its rows (0.85 m apart) running back along its stand direction. With
 * the roof open its panels stack west of the field, their edge ~19.5 m west
 * of home; the fixed ring's inner edge stands ~108.5 m east of home, ~58.4 m
 * north and ~104 m south. The ring's east edge moves ±7 m between the 2013,
 * 2019 and 2022 flights (the camera's lean), so 2013's sits close to true.
 */
const LOANDEPOT_ROOF: Record<string, [number, number]> = {
  FL1: [0, 5.5], FL2: [0, 4.5], FL3: [0, 3.5], FL4: [12, 0], FL5: [0, 1], FL6: [0, 8], FL7: [0, 37], FL8: [0, 38.5],
  FL9: [0, 35], FL10: [0, 34], FL11: [0, 33], FL14: [10, 0], FL15: [0, 4], FL16: [0, 16.5], FS202A: [1, 0],
  FS203A: [1, 0], FS204A: [1, 0], FS202B: [1, 0], FS203B: [1, 0], FS204B: [1, 0], SEC1: [0, 0.5], SEC2: [24, 0],
  SEC3: [21, 0], SEC4: [15, 0], SEC5: [16, 0], SEC6: [12, 0], SEC7: [12, 0], SEC8: [10, 0], SEC9: [9, 0],
  SEC10: [8, 0], SEC11: [2, 0], SEC12: [3, 0], SEC13: [6, 0], SEC14: [5, 0], SEC15: [13, 0], SEC16: [26, 0],
  SEC17: [0, 13], SEC18: [0, 13], SEC19: [0, 10], SEC20: [0, 9.5], SEC21: [0, 7], SEC22: [0, 4.5], SEC23: [0, 3],
  SEC24: [0, 2], SEC25: [0, 4.5], SEC26: [0, 2], SEC27: [0, 7.5], SEC28: [0, 2], SEC29: [7, 0], SEC30: [2, 0],
  SEC31: [1, 0], SEC32: [1, 0], SEC34: [0, 17], SEC35: [0, 2.5], SEC36: [14, 0], SEC38: [10, 0], SEC39: [9, 0],
  SEC40: [13, 0], SEC134: [0, 26.5], SEC135: [0, 7], SEC136: [4, 0], SEC137: [1, 0], SEC138: [2, 0], SEC139: [3, 0],
  SEC140: [4, 0], SEC141: [1, 0], SEC201: [1, 0], SEC202: [1, 0], SEC203: [1, 0], SEC204: [1, 0], SEC205: [1, 0],
  SEC206: [1, 0], SEC207: [1, 0], SEC208: [1, 0], SEC209: [1, 0], SEC210: [1, 0], SEC211: [1, 0], SEC219: [0, 8],
  SEC220: [0, 6.5], SEC221: [0, 4.5], SEC222: [0, 2.5], SEC223: [9, 0], SEC224: [8, 0], SEC225: [9, 0],
  SEC226: [10, 0], SEC227: [0, 0.5], SEC228: [0, 1.5], SEC302: [1, 0], SEC303: [1, 0], SEC304: [1, 0],
  SEC305: [1, 0], SEC306: [1, 0], SEC307: [1, 0], SEC308: [1, 0], SEC309: [1, 0], SEC310: [1, 0], SEC311: [1, 0],
  SEC312: [1, 0], SEC313: [1, 0], SEC314: [1, 0], SEC315: [1, 0], SEC316: [1, 0], SEC317: [1, 0], SEC318: [3, 0],
  SEC319: [9, 0], SEC320: [3, 0], SEC321: [1, 0], SEC322: [1, 0], SEC323: [1, 0], SEC324: [1, 0], SEC325: [1, 0],
  SEC326: [1, 0], SEC327: [4, 0],
};
const LOANDEPOT_ROOF_TOP = 200;
const LOANDEPOT_ROOF_UNDERSIDE = 170;
const loanDepotSections = (re: RegExp) => Object.fromEntries(Object.entries(LOANDEPOT_ROOF).filter(([id]) => re.test(id)).map(([id, [from, setbackM]]) => [id, {
  ...(from ? { overhang: { coveredFromRow: from, soffitHeightFt: LOANDEPOT_ROOF_UNDERSIDE } } : {}),
  backSetbackFt: Math.round(setbackM * 3.28),
}]));

/** Seating ring of a loanDepot park chart section. */
export function loanDepotTier(id: string): string | null {
  const n = id.match(/^SEC(\d+)$/);
  if (n) {
    const value = Number(n[1]);
    if (value >= 300) return 'upper';
    if (value >= 200) return 'club';
    if (value >= 134) return 'porch';
    return 'field';
  }
  if (/^FL\d+$/.test(id)) return 'box';
  if (/^FS20\d[AB]$/.test(id)) return 'club';
  // Suites, bars, standing areas: no rows or cover listed.
  return null;
}

/**
 * loanDepot park (2012, as Marlins Park), with the roof open. A field level
 * (1–41, lettered rows in front of rows 1–30) with field boxes (FL) in front
 * of it, the Home Run Porch (134–141), a 200 level and a 300 level. Rows are
 * Rate Your Seats' section pages. Which rows are covered is the photo's
 * geometry above, and matches the published account: "The first base side is
 * well covered by part of the roof, especially in the upper deck" (Rate Your
 * Seats); 304–309 "are under cover, thanks to the retractable roof", "the
 * back of sections 28-32 are under the cover of a permanent roof section",
 * the back rows of 34–40 under the overhang above (shadedseats.com). No
 * source gives the roof's or the decks' heights, so they are estimated.
 */
const LOANDEPOT: StadiumStructure = {
  stadiumId: 'marlins',
  // Far rim: the roof (~200 ft) about 450 ft across the field.
  park: { roof: 'retractable', farRimHeightFt: LOANDEPOT_ROOF_TOP, fieldCrossingFt: 450 },
  tierOf: loanDepotTier,
  tiers: {
    field: {
      label: 'Field level (1–41)',
      // Rows: lettered rows then 1–30 (sourced). Estimated: front ~3 ft,
      // 20° rake; the roof's edge (~200 ft) behind.
      stand: { rows: 42, frontRowHeightFt: 3, rakeDeg: 20, backHeightFt: LOANDEPOT_ROOF_TOP },
      sections: loanDepotSections(/^SEC\d{1,2}$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [LOANDEPOT_RYS, LOANDEPOT_SHADE, LOANDEPOT_PHOTO, ...['6', '11', '15', '21', '26', '30', '36'].map(loanDepotSection)],
    },
    box: {
      label: 'Field boxes (FL)',
      // No source lists their rows. Estimated: ~12 rows from ~2 ft.
      stand: { rows: 12, frontRowHeightFt: 2, rakeDeg: 15, backHeightFt: LOANDEPOT_ROOF_TOP },
      sections: loanDepotSections(/^FL\d+$/),
      heightsSourced: false,
      coverSourced: true,
      sources: [LOANDEPOT_PHOTO],
    },
    porch: {
      label: 'Home Run Porch (134–141)',
      // Rows 1–5 to 1–16 (sourced). Estimated: front ~10 ft, 20° rake.
      stand: { rows: 16, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: LOANDEPOT_ROOF_TOP },
      sections: loanDepotSections(/^SEC1[34]\d$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [LOANDEPOT_PHOTO, ...['134', '137', '141'].map(loanDepotSection)],
    },
    club: {
      label: '200 level (201–228, FS202A–204B)',
      // Rows 1–7 to 1–13 (sourced); under the roof down the first-base side
      // and toward the third-base corner. Rate Your Seats also has the 300
      // level's overhang over the 200s "further down the lines", which rows
      // is not published. Estimated: front ~40 ft, 25° rake.
      stand: { rows: 10, frontRowHeightFt: 40, rakeDeg: 25, backHeightFt: LOANDEPOT_ROOF_TOP },
      sections: loanDepotSections(/^(SEC2\d\d|FS20\d[AB])$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [LOANDEPOT_RYS, LOANDEPOT_PHOTO, ...['201', '206', '211', '219', '224', '228'].map(loanDepotSection)],
    },
    upper: {
      label: '300 level (302–327)',
      // Rows A–K and 1–16 (sourced), all under the roof. Estimated: front
      // ~70 ft, 30° rake, roof underside ~170 ft.
      stand: { rows: 20, frontRowHeightFt: 70, rakeDeg: 30, treadFt: 2.6, backHeightFt: LOANDEPOT_ROOF_TOP },
      sections: loanDepotSections(/^SEC3\d\d$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [LOANDEPOT_RYS, LOANDEPOT_SHADE, LOANDEPOT_PHOTO, ...['304', '309', '315', '320', '327'].map(loanDepotSection)],
    },
  },
  reviewedOn: '2026-11-12',
};

const AMFAM_RYS = 'https://www.rateyourseats.com/american-family-field/seating/shaded-covered-seats';
const AMFAM_PHOTO = 'USGS NAIP m_4308757_sw_16_060_20200902 (roof open), with the 2017 and 2018 flights';
const amfamSection = (n: string) => `https://www.rateyourseats.com/american-family-field/seating/sections/${n}`;
/**
 * Per section, from the 2020 photo with the roof open: the first row under
 * a folded roof panel (0 = none), how far behind the last row (m) the
 * panel's edge stands, and the section's rows. Worked out from each section's place on the pinned
 * seat map and its rows (0.8 m apart) running back along its stand
 * direction. The roof's panels fan out from a pivot ~67 m behind home
 * (bearing 301°); open, they fold over the two lines, their inner edges
 * running 95° (over the third-base side; in the same place within ±2 m on
 * the 2017, 2018 and 2020 flights) and 157.3° (over the first-base side; it
 * moves ±10 m between flights with the camera's lean, so the mean is used).
 */
const AMFAM_ROOF: Record<string, [number, number, number]> = {
  '101': [0, 150, 7], '102': [0, 150, 14], '103': [0, 150, 14], '104': [13, 0, 14], '106': [11, 0, 11],
  '107': [17, 0, 21], '108': [9, 0, 19], '109': [18, 0, 27], '110': [17, 0, 27], '111': [16, 0, 27],
  '112': [16, 0, 21], '113': [17, 0, 18], '114': [0, 1.5, 21], '115': [0, 4, 21], '116': [0, 8.5, 21],
  '117': [0, 25.5, 27], '118': [0, 2, 27], '119': [16, 0, 21], '120': [14, 0, 21], '121': [15, 0, 21],
  '122': [12, 0, 18], '123': [12, 0, 18], '124': [18, 0, 27], '125': [19, 0, 27], '126': [21, 0, 29],
  '127': [24, 0, 30], '128': [24, 0, 27], '129': [0, 1, 25], '130': [0, 3.5, 21], '131': [0, 10, 7],
  '201': [0, 150, 14], '202': [0, 150, 14], '203': [0, 150, 14], '204': [0, 150, 14], '205': [9, 0, 16],
  '206': [8, 0, 19], '207': [4, 0, 21], '208': [1, 0, 19], '209': [1, 0, 19], '210': [1, 0, 21], '211': [1, 0, 19],
  '212': [1, 0, 19], '213': [5, 0, 21], '214': [8, 0, 19], '215': [12, 0, 21], '216': [0, 1.5, 10],
  '217': [0, 9.5, 10], '218': [0, 17.5, 10], '219': [7, 0, 10], '220': [1, 0, 10], '221': [1, 0, 10],
  '222': [1, 0, 21], '223': [1, 0, 19], '224': [1, 0, 21], '225': [1, 0, 19], '226': [1, 0, 19], '227': [1, 0, 19],
  '228': [1, 0, 19], '229': [2, 0, 21], '230': [4, 0, 19], '231': [10, 0, 21], '232': [17, 0, 19], '233': [0, 7, 19],
  '234': [0, 150, 19], '235': [0, 150, 19], '236': [0, 150, 18], '306': [1, 0, 7], '307': [1, 0, 7],
  '308': [1, 0, 7], '309': [1, 0, 7], '310': [1, 0, 7], '311': [1, 0, 8], '312': [1, 0, 7], '313': [1, 0, 7],
  '314': [1, 0, 7], '315': [1, 0, 7], '316': [1, 0, 7], '317': [1, 0, 7], '318': [1, 0, 7], '319': [1, 0, 7],
  '320': [1, 0, 5], '321': [1, 0, 7], '322': [1, 0, 7], '323': [1, 0, 7], '324': [1, 0, 8], '325': [6, 0, 7],
  '326': [0, 4.5, 7], '327': [0, 14, 7], '328': [0, 12.5, 7], '329': [6, 0, 7], '330': [1, 0, 7], '331': [1, 0, 7],
  '332': [1, 0, 7], '333': [1, 0, 7], '334': [1, 0, 7], '335': [1, 0, 8], '336': [1, 0, 7], '337': [1, 0, 7],
  '338': [1, 0, 7], '339': [1, 0, 5], '340': [1, 0, 7], '341': [1, 0, 7], '342': [1, 0, 7], '343': [1, 0, 7],
  '344': [1, 0, 7], '345': [1, 0, 7], '407': [1, 0, 24], '408': [1, 0, 21], '409': [1, 0, 24], '410': [1, 0, 21],
  '411': [1, 0, 23], '412': [1, 0, 20], '413': [1, 0, 20], '414': [1, 0, 16], '415': [1, 0, 20], '416': [1, 0, 16],
  '417': [1, 0, 20], '418': [1, 0, 19], '419': [1, 0, 25], '420': [13, 0, 22], '421': [18, 0, 25], '422': [1, 0, 22],
  '423': [1, 0, 25], '424': [1, 0, 22], '425': [1, 0, 25], '426': [1, 0, 19], '427': [1, 0, 20], '428': [1, 0, 16],
  '429': [1, 0, 20], '430': [1, 0, 16], '431': [1, 0, 20], '432': [1, 0, 18], '433': [1, 0, 22], '434': [1, 0, 20],
  '435': [1, 0, 24], '436': [1, 0, 21], '437': [1, 0, 24], '438': [2, 0, 21], '439': [16, 0, 24],
  '440': [0, 9.5, 13], '441': [0, 150, 16], '442': [0, 150, 12],
};
const AMFAM_ROOF_TOP = 240;
const AMFAM_ROOF_UNDERSIDE = 190;
/**
 * Underside of the deck above the loge level's back rows, ft (estimated: 9 ft
 * above the floor of row 17, the first it covers).
 */
const AMFAM_DECK = 68;
const amfamSections = (re: RegExp, deck: (id: string, rows: number) => number = () => 0) =>
  Object.fromEntries(Object.entries(AMFAM_ROOF).filter(([id]) => re.test(id)).map(([id, [from, setbackM, rows]]) => {
    const deckFrom = deck(id, rows);
    const overhang = deckFrom ? { coveredFromRow: deckFrom, soffitHeightFt: AMFAM_DECK }
      : from ? { coveredFromRow: from, soffitHeightFt: AMFAM_ROOF_UNDERSIDE } : undefined;
    return [id, { ...(overhang ? { overhang } : {}), backSetbackFt: Math.round(setbackM * 3.28) }];
  }));

/** Seating ring of an American Family Field chart section. */
export function amfamTier(id: string): string | null {
  if (/^10[1-4]$/.test(id)) return 'bleachers';
  if (/^1\d\d$/.test(id)) return 'field';
  if (/^2\d\d$/.test(id)) return 'loge';
  if (/^3\d\d$/.test(id)) return 'club';
  if (/^4\d\d$/.test(id)) return 'terrace';
  // Named decks, bars and party areas: no rows or cover listed.
  return null;
}

/**
 * American Family Field (2001, as Miller Park), with the roof open. Field
 * level (106–131), the right-field bleachers (101–104), the loge level
 * (201–236), the club level (306–345) and the terrace (407–442). Rows are
 * Rate Your Seats' section pages. Its fan-shaped roof folds open over the
 * two lines; which rows it covers is the photo's geometry above, matching
 * Rate Your Seats: "upper deck sections on the first base side (404-420)
 * will be fully shaded, so will a number of sections on the opposite side",
 * "Avoid ... 438-442", and in 101–104 "The first five rows of the sections
 * are uncovered". No source gives the roof's or the decks' heights, so they
 * are estimated.
 */
const AMFAM: StadiumStructure = {
  stadiumId: 'brewers',
  // Far rim: the folded panels (~240 ft) about 500 ft across the field.
  park: { roof: 'retractable', farRimHeightFt: AMFAM_ROOF_TOP, fieldCrossingFt: 500 },
  tierOf: amfamTier,
  tiers: {
    field: {
      label: 'Field level (106–131)',
      // Rows 1–21 to 1–30 (sourced). Estimated: front ~3 ft, 20° rake; the
      // panels (~240 ft) behind.
      stand: { rows: 27, frontRowHeightFt: 3, rakeDeg: 20, backHeightFt: AMFAM_ROOF_TOP },
      sections: amfamSections(/^1(0[6-9]|[12]\d|3[01])$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [AMFAM_RYS, AMFAM_PHOTO, ...['107', '112', '117', '122', '127'].map(amfamSection)],
    },
    bleachers: {
      label: 'Right-field bleachers (101–104)',
      // Rows 1–14 (101: 1–7), the loge level overhead from row 6 (sourced).
      // Estimated: front ~10 ft, 20° rake, overhead deck underside ~30 ft.
      stand: { rows: 14, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: AMFAM_ROOF_TOP, overhang: { coveredFromRow: 6, soffitHeightFt: 30 } },
      sections: Object.fromEntries(['101', '102', '103', '104'].map((id) => [id, { backSetbackFt: Math.round((AMFAM_ROOF[id]?.[1] ?? 30) * 3.28) }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: ['101', '102', '104'].map(amfamSection),
    },
    loge: {
      label: 'Loge level (201–236)',
      // Rows 1–10 to 1–21 (sourced); the club level overhead from row 17
      // ("good shade in Rows 17 and higher in Sections 212-215"), elsewhere
      // the panels. Estimated: front ~38 ft, 25° rake.
      stand: { rows: 19, frontRowHeightFt: 38, rakeDeg: 25, backHeightFt: AMFAM_ROOF_TOP },
      sections: amfamSections(/^2\d\d$/, (_, rows) => (rows >= 17 ? 17 : 0)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [AMFAM_RYS, AMFAM_PHOTO, ...['205', '212', '215', '222', '230', '236'].map(amfamSection)],
    },
    club: {
      label: 'Club level (306–345)',
      // Rows 1–5 to 1–8 (sourced), under the panels except 326–328 behind
      // home. Estimated: front ~62 ft, 25° rake.
      stand: { rows: 7, frontRowHeightFt: 62, rakeDeg: 25, backHeightFt: AMFAM_ROOF_TOP },
      sections: amfamSections(/^3\d\d$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [AMFAM_PHOTO, ...['310', '327', '340'].map(amfamSection)],
    },
    terrace: {
      label: 'Terrace (407–442)',
      // Rows 1–12 to 1–25 (sourced), under the panels except 440–442 at the
      // left-field end. Estimated: front ~80 ft, 30° rake, panel underside
      // ~190 ft.
      stand: { rows: 22, frontRowHeightFt: 80, rakeDeg: 30, treadFt: 2.6, backHeightFt: AMFAM_ROOF_TOP },
      sections: amfamSections(/^4\d\d$/),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [AMFAM_RYS, AMFAM_PHOTO, ...['410', '416', '420', '430', '440'].map(amfamSection)],
    },
  },
  reviewedOn: '2026-11-12',
};

const TMOBILE_RYS = 'https://www.rateyourseats.com/t-mobile-park/seating/shaded-covered-seats';
const TMOBILE_PHOTO = 'USGS NAIP 2011-08-26, 2013-07-15 and 2017-08-15 flights, roof open (Planetary Computer NAIP archive)';
const TMOBILE_HEIGHT = 'https://www.nbbj.com/work/t-mobile-park-safeco-field';
const tmobileSection = (n: string) => `https://www.rateyourseats.com/t-mobile-park/seating/sections/${n}`;
/**
 * Sections under the parked roof, from the photos: the first row under it
 * (0 = none) and how far behind the last row (m) its edge stands. Open, the
 * roof's panels stack over the railway east of the park; their west edge
 * stands ~123 m east of home plate (113–131 m on the 2011, 2013 and 2017
 * flights, which lean differently). Worked out from each section's place on
 * the pinned seat map and its rows (0.85 m apart) running back along its
 * stand direction.
 */
const TMOBILE_ROOF: Record<string, [number, number]> = {
  '102': [0, 17.5], '103': [0, 11.5], '104': [0, 4.5], '105': [12, 0], '106': [16, 0], '107': [18, 0], '108': [18, 0],
  '109': [16, 0], '110': [16, 0], '111': [0, 19.5], '112': [0, 44], '190': [0, 43.5], '191': [0, 34], '192': [0, 19],
  '193': [0, 5], '194': [11, 0], '195': [2, 0], '211': [0, 1], '212': [0, 9], '213': [0, 31.5], '306': [4, 0],
  '307': [5, 0], '308': [1, 0], '309': [1, 0], '310': [1, 0], '311': [1, 0], '312': [1, 0],
};
/** First labelled row of each main-level section where it is not 1 (Rate Your Seats). */
const TMOBILE_FIRST_ROW: Record<string, number> = {
  '102': 23, '103': 23, '104': 23, '105': 23, '106': 23, '107': 23, '108': 23, '109': 23, '110': 23, '111': 11,
  '115': 10, '121': 4, '122': 5, '123': 5, '124': 5, '125': 9, '126': 17, '127': 9, '128': 17, '129': 9, '131': 17,
  '132': 9, '133': 17, '134': 9, '135': 9, '136': 5, '137': 5, '138': 5, '139': 4, '147': 10, '149': 12, '150': 19,
  '151': 27,
};
const TMOBILE_MAIN = { frontRowHeightFt: 3, rakeDeg: 20 };
const tmobileRise = 2.75 * Math.tan((TMOBILE_MAIN.rakeDeg * Math.PI) / 180);
/** Parked roof top and underside, ft ("about 215 feet in the air"; underside estimated). */
const TMOBILE_ROOF_TOP = 215;
const TMOBILE_ROOF_UNDERSIDE = 180;
const tmobileRoof = (id: string) => {
  // The roof's edge behind a section matters only where it covers rows: it
  // is high (~180 ft underside) and east of every stand, so the stands'
  // own backs block the sun before it would.
  const [from] = TMOBILE_ROOF[id] ?? [0, 0];
  return from ? { overhang: { coveredFromRow: from, soffitHeightFt: TMOBILE_ROOF_UNDERSIDE }, backHeightFt: TMOBILE_ROOF_TOP, backSetbackFt: 0 } : {};
};
const tmobileIds = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Seating ring of a T-Mobile Park chart section. */
export function tmobileTier(id: string): string | null {
  if (/^1[89]\d$/.test(id)) return 'bleachers';
  if (/^1\d\d$/.test(id)) return 'main';
  if (/^2\d\d$/.test(id)) return 'club';
  if (/^3\d\d$/.test(id)) return 'view';
  // Field-level boxes, suites, decks and standing areas: no rows or cover listed.
  return null;
}

/**
 * T-Mobile Park (1999, as Safeco Field), with the roof open. The main level
 * (102–151, rows to 41), the terrace club level (211–249), the view level
 * (306–349) and the outfield bleachers (180–195). Rows are Rate Your Seats'
 * section pages, and so is the cover over the main and club levels: "aim
 * for rows 35 and higher which are tucked beneath the overhang" (main),
 * "Rows 10 and above are your best options for shade" beneath the overhang
 * (club), 219–223 "Fully covered". The roof is "about 215 feet in the air"
 * and, open, does not shade the bowl except where it stacks over the east
 * side (TMOBILE_ROOF). The view level's canopy covers its back rows
 * ("Sections 333-344 ... well covered from the upper deck roof"); which rows
 * is not published. Deck heights are estimated.
 */
const TMOBILE: StadiumStructure = {
  stadiumId: 'mariners',
  // Far rim: the view level's canopy (~125 ft) about 500 ft across the field.
  park: { roof: 'retractable', farRimHeightFt: 125, fieldCrossingFt: 500 },
  tierOf: tmobileTier,
  tiers: {
    main: {
      label: 'Main level (102–151)',
      // Rows to 41 (sourced), the club deck over rows 35 and up (sourced);
      // the right-field stands under the parked roof's edge (photo). Above
      // the back rows the club and view levels rise to the view level's
      // canopy, whose inner edge stands ~50 m back from each foul line on
      // the 2017 photo (46 m on the third-base side, 55 m on the first-base
      // side, the canopy leaning with the camera), ~3 m behind the last
      // row. Estimated: front ~3 ft plus ~1 ft a row where rows start
      // further up, 20° rake, club deck underside ~46 ft (9 ft above row
      // 35's floor), canopy ~125 ft.
      stand: { rows: 41, ...TMOBILE_MAIN, backHeightFt: 125, backSetbackFt: 10 },
      sections: Object.fromEntries([...tmobileIds(102, 151)].map((id) => {
        const first = TMOBILE_FIRST_ROW[id] ?? 1;
        const roof = tmobileRoof(id);
        return [id, {
          ...(first > 1 ? { frontRowHeightFt: TMOBILE_MAIN.frontRowHeightFt + (first - 1) * tmobileRise } : {}),
          ...('overhang' in roof ? roof : { overhang: { coveredFromRow: Math.max(1, 35 - first + 1), soffitHeightFt: 46 }, ...roof }),
        }];
      })),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [TMOBILE_RYS, TMOBILE_PHOTO, ...['106', '112', '120', '128', '135', '142', '150'].map(tmobileSection)],
    },
    bleachers: {
      label: 'Bleachers (180–195)',
      // Rows 1–10 to 1–17 (sourced), open ("Little to no shade") except
      // where the parked roof reaches over right-center. Estimated: front
      // ~10 ft, 20° rake.
      stand: { rows: 17, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: 30 },
      sections: Object.fromEntries(tmobileIds(180, 195).map((id) => [id, tmobileRoof(id)])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [TMOBILE_PHOTO, ...['180', '186', '190', '195'].map(tmobileSection)],
    },
    club: {
      label: 'Terrace club level (211–249)',
      // Rows 1–13 (sourced), the view level overhead from row 10 (sourced;
      // 219–223 fully covered). Estimated: front ~38 ft, 25° rake, view
      // level underside ~62 ft.
      stand: { rows: 13, frontRowHeightFt: 38, rakeDeg: 25, backHeightFt: 125, overhang: { coveredFromRow: 10, soffitHeightFt: 62 } },
      sections: {
        ...Object.fromEntries(tmobileIds(211, 213).map((id) => [id, tmobileRoof(id)])),
        ...Object.fromEntries(tmobileIds(219, 223).map((id) => [id, { overhang: { coveredFromRow: 1, soffitHeightFt: 50 } }])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [TMOBILE_RYS, ...['211', '219', '223', '233', '241'].map(tmobileSection)],
    },
    view: {
      label: 'View level (306–349)',
      // Rows 1–21 or 1–25 (sourced), the canopy over the back rows (which
      // rows not published, so both are tried); 306–312 under the parked
      // roof (photo). Estimated: front ~75 ft, 30° rake, canopy underside
      // ~118 ft.
      stand: { rows: 25, frontRowHeightFt: 75, rakeDeg: 30, treadFt: 2.6, backHeightFt: 125, overhang: { coveredFromRow: 16, soffitHeightFt: 118 } },
      sections: Object.fromEntries(tmobileIds(306, 312).map((id) => [id, tmobileRoof(id)])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [TMOBILE_RYS, TMOBILE_HEIGHT, TMOBILE_PHOTO, ...['306', '320', '330', '340', '344'].map(tmobileSection)],
    },
  },
  reviewedOn: '2026-11-12',
};

export const STADIUM_STRUCTURES: Readonly<Record<string, StadiumStructure>> = {
  yankees: YANKEES,
  redsox: FENWAY,
  dodgers: DODGERS,
  cubs: WRIGLEY,
  giants: ORACLE,
  mets: CITI,
  phillies: CBP,
  braves: TRUIST,
  cardinals: BUSCH,
  nationals: NATS,
  orioles: OPACY,
  padres: PETCO,
  angels: ANGEL,
  rockies: COORS,
  royals: KAUFFMAN,
  reds: GABP,
  pirates: PNC,
  tigers: COMERICA,
  guardians: PROGRESSIVE,
  twins: TARGET,
  whitesox: RATE,
  athletics: SUTTER,
  diamondbacks: CHASE,
  astros: DAIKIN,
  marlins: LOANDEPOT,
  brewers: AMFAM,
  mariners: TMOBILE,
};

export function getStadiumStructure(stadiumId: string): StadiumStructure | undefined {
  return STADIUM_STRUCTURES[stadiumId];
}

/**
 * Typical stand shape for each seating level, used for parks that do not have
 * their own profile yet. Every value is an estimate and which rows are
 * covered comes from the section map rather than a cited source, so the
 * confidence check treats it as uncertain and these parks mostly show Medium
 * or Low until they get a profile like Yankee Stadium's.
 */
const GENERIC_LEVELS: Record<string, { label: string; stand: StandProfile }> = {
  field: { label: 'Field level', stand: { rows: 12, frontRowHeightFt: 3, rakeDeg: 14, backHeightFt: 30, backSetbackFt: 50 } },
  lower: { label: 'Lower level', stand: { rows: 22, frontRowHeightFt: 5, rakeDeg: 20, backHeightFt: 40 } },
  club: { label: 'Club level', stand: { rows: 14, frontRowHeightFt: 35, rakeDeg: 24, backHeightFt: 60 } },
  upper: { label: 'Upper level', stand: { rows: 20, frontRowHeightFt: 70, rakeDeg: 30, backHeightFt: 110 } },
  suite: {
    label: 'Suites',
    stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 59, reachFt: SUITE_DECK_REACH_FT } },
  },
};

export function genericStructure(
  stadiumId: string,
  roof: ParkEnvelope['roof'],
  sections: readonly DetailedSection[],
): StadiumStructure {
  const levelOf = new Map(sections.map((section) => [section.id, section.level]));
  const tiers: Record<string, TierStructure> = {};
  for (const [level, { label, stand }] of Object.entries(GENERIC_LEVELS)) {
    const rise = 2.75 * Math.tan((stand.rakeDeg * Math.PI) / 180);
    const overrides: NonNullable<TierStructure['sections']> = {};
    for (const section of sections) {
      if (section.level !== level || level === 'suite') continue;
      const firstCovered = section.covered ? 0 : section.rows.findIndex((row) => row.covered);
      overrides[section.id] = firstCovered < 0
        ? { noCover: true }
        : {
            overhang: {
              coveredFromRow: firstCovered + 1,
              soffitHeightFt: stand.frontRowHeightFt + firstCovered * rise + 12.5,
            },
          };
    }
    tiers[level] = {
      label,
      stand,
      sections: overrides,
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [],
      notes: 'Generic stand shape for this seating level; this park has no profile yet.',
    };
  }
  return {
    stadiumId,
    park: { roof, farRimHeightFt: 100, fieldCrossingFt: 500 },
    // Standing room and other non-seat products are not rated.
    tierOf: (id) => {
      const level = levelOf.get(id);
      return level && level in GENERIC_LEVELS ? level : null;
    },
    tiers,
    reviewedOn: '2026-11-10',
  };
}

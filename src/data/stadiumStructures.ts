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
 * lower confidence. A back over the rows of a stand with a deck is moved by
 * its distance from the deck's edge, so it stays on the deck.
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

/**
 * A tier's section overrides with each listed section's own measured front
 * row (lidar, feet above the field) merged in, keeping its other values.
 */
function withFronts(
  sections: NonNullable<TierStructure['sections']>,
  fronts: Record<string, number>,
): NonNullable<TierStructure['sections']> {
  const out = { ...sections };
  for (const [id, frontRowHeightFt] of Object.entries(fronts)) {
    out[id] = { ...out[id], frontRowHeightFt };
  }
  return out;
}

/**
 * A tier's section overrides with each listed section's own measured rake
 * (lidar, degrees; where the scan's run spans 9 or more of its rows) merged
 * in, keeping its other values.
 */
function withRakes(
  sections: NonNullable<TierStructure['sections']>,
  rakes: Record<string, number>,
): NonNullable<TierStructure['sections']> {
  const out = { ...sections };
  for (const [id, rakeDeg] of Object.entries(rakes)) {
    out[id] = { ...out[id], rakeDeg };
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
 * middle uncovered row; tier values are medians, and every measured section
 * takes its own front row and back, and its own rake where the scan sees 9 or
 * more of its rows and the cuts beside it agree. Each cut runs along the
 * rows' fall line: where that is firmly more than 15° off the club map's
 * direction, the section faces it, or where its rows bend across its width
 * the median of the fall lines in its middle and 4 m to either side (its
 * section file's standRuns); one whose fall lines lie either side of the
 * map's direction keeps it and its tier's rake. The lidar confirms the
 * canopy top (133 ft) and puts its underside at its front edge at 128 ft;
 * where a section's cut crosses a lamp bank on the canopy, that rises
 * highest (137–142 ft). Covered rows: where
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
      // front row at field level (-1 to 3 ft), 9° rake (6–12). What rises
      // highest behind is the canopy, 134 ft up and 107 ft back; each
      // measured section takes its own (94–117 ft back).
      stand: { rows: 9, frontRowHeightFt: 0, rakeDeg: 9, backHeightFt: 134, backSetbackFt: 107 },
      sections: withFronts(withBacks({}, {
        '029W': [139, 101], '027A': [141, 94], '024B': [132, 104], '023': [133, 111],
        '022W': [134, 112], '022': [132, 117], '021BW': [142, 106], '021B': [132, 112],
        '021A': [140, 96], '020': [132, 117], '019': [140, 104], '018': [140, 106],
        '017B': [132, 109], '017A': [133, 116], '011W': [135, 111], '011': [140, 101],
      }), {
        '029W': 1, '027A': 3, '024B': 3, '023': 1, '022': -1, '021A': 1, '017A': 1, '011W': 1,
        '011': 1,
      }),
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
      // corner sections the sources call open (103, 104, 135, 136: "no roof
      // or overhang") the scan shows the Main deck starting about five rows
      // back (row 5 in 104, 14 in 136), on cuts whose direction is uncertain
      // in the corners; they stay as sourced. Along 135's rows (30° off the
      // map's direction) the deck's edge is over its last row, 14, as the
      // source has it. 104 has 18 rows (Rate Your Seats), and the deck's
      // front, 32 ft up, is taken right behind its last row, not over it.
      // Lidar (45 of 50; 132, 133 and 135 along their rows' fall lines,
      // 30–39° off the map's direction): front row 7 ft (4–10), 12° rake
      // (8–15). What rises highest behind is the canopy, 134 ft up and 46 ft
      // behind the last row (its top 132–134 ft, or a lamp bank on it,
      // 139–141, where a section's cut crosses one); behind 121BW the
      // Terrace's front edge, at the corner (104) the Main deck's edge, 32 ft
      // up. Estimated: the Main deck's underside ~24 ft (its 28-ft front row
      // less 9 ft is under the covered rows' heads, so 9 ft above row 14's
      // floor; 23 over 122, 123, 130 and the suites, whose first covered
      // rows sit lower).
      // Each measured section takes its own back (the canopy 29–94 ft behind
      // them); 104 keeps the Main deck's edge right behind its last row, as
      // sourced.
      stand: {
        deckFrontFt: 28,
        rows: 20,
        frontRowHeightFt: 7,
        rakeDeg: 12,
        backHeightFt: 134,
        backSetbackFt: 46,
        overhang: { coveredFromRow: 14, soffitHeightFt: 24 },
      },
      sections: withRakes(withFronts(withBacks({
        '103': { noCover: true },
        '104': { rows: 18, noCover: true, backHeightFt: 32, backSetbackFt: 0 },
        '107': { rows: 21, overhang: { coveredFromRow: 6, soffitHeightFt: 19 } },
        '109': { rows: 24, overhang: { coveredFromRow: 15, soffitHeightFt: 24 } },
        '120B': { rows: 17 },
        '122': { overhang: { coveredFromRow: 11, soffitHeightFt: 23 } },
        ...Object.fromEntries(['123', 'S122A', 'S122B'].map((id) => [id, { overhang: { coveredFromRow: 11, soffitHeightFt: 23 } }])),
        '125': { rows: 19 },
        '127B': { rows: 19 },
        '130': { rows: 26, overhang: { coveredFromRow: 15, soffitHeightFt: 23 } },
        '134': { overhang: { coveredFromRow: 8, soffitHeightFt: 24 } },
        '135': { rows: 14, noCover: true },
        '136': { noCover: true },
      }, {
        '134': [133, 59], '133': [139, 38], '130': [141, 29], '132': [139, 38], '127A': [139, 38],
        '125': [132, 55], '124': [139, 43], '121B': [140, 41], '122': [133, 41], '123': [132, 46],
        'S122B': [140, 34], 'S122A': [133, 49], '121BW': [73, 5], '120A': [139, 43],
        '121A': [133, 52], '120B': [132, 57], '120AW': [139, 43], '120BW': [132, 48],
        '121AW': [140, 38], '119': [132, 54], '118': [139, 41], '118W': [140, 48], '119W': [139, 43],
        '117B': [133, 56], '117A': [140, 46], 'S117BC': [133, 48], '116': [134, 51],
        '115': [132, 57], '114A': [141, 46], '111': [133, 49], '109': [133, 41], '106': [140, 43],
        '131': [133, 54], '108': [140, 44], '127B': [140, 47], '136': [133, 51],
        '129': [133, 48], '128': [132, 44], '126': [139, 38], '114B': [140, 44],
        '113': [133, 49], '112': [132, 62], '110': [139, 36],
        '135': [140, 57],
      }), {
        '134': 10, '130': 5, '122': 8,
        'S122B': 8, '119': 5, '117B': 5,
        '104': 5, '131': 4,
        '114B': 5, '112': 5,
        '120A': 6,
        '121A': 6,
        '120B': 6,
        '120AW': 6,
        '120BW': 6,
        '118': 6,
        '119W': 6,
        '115': 6,
        '114A': 6,
        '111': 6,
        '109': 6,
        '106': 6,
        '108': 6,
        '127B': 6,
        '136': 6,
      }), {
        '130': 13, '127A': 13, '124': 11, '122': 13, '123': 13, 'S122A': 13,
        '121A': 11, '118W': 11, '117B': 13, '117A': 11, '115': 11, '114A': 11, '111': 11, '109': 13,
        '131': 15, '129': 13, '128': 13, '114B': 14, '112': 13, '110': 13,
        '133': 13,
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_YANKEES, rysSection('104'), rysSection('107'), rysSection('109'), rysSection('120B'), rysSection('125'), rysSection('127B'), rysSection('130'), rysSection('135'), 'https://ballparkeguides.com/yankee-stadium-seating/', YANKEES_LIDAR],
    },
    main: {
      label: 'Main level (200s)',
      // 19–23 rows (sourced). Rate Your Seats counts 205–217 and 223–234 as
      // covered from row 14; behind home (218–222) the suites sit above, but
      // no source gives a covered row there and the lidar shows none. Lidar
      // (44 of 44; 21 along their rows' fall line, 17–56° off the map's
      // direction, where the cuts across the rows read 12–19°): front row
      // 29 ft (27–30), 20° rake (17–24). The Terrace deck's front edge
      // reaches out over row 8 (5–12; the sections below differ),
      // so the rows from 8 back are covered; that edge, 73 ft up, is what
      // rises highest behind; behind home (220B) the canopy. Estimated:
      // the Terrace deck's underside ~62 ft, its 71-ft front row less 9 ft.
      // Each measured section takes its own back: the Terrace's front 27–41
      // ft in front of their last row (12 ft in 215); the 7–8 row sections
      // behind home end where it stands, 0–7 ft behind their last row, and
      // behind 220B the canopy rises highest, 139 ft up (along 227A's rows,
      // 137 ft, 4 ft in front of its last row). 215's rows stop at 13,
      // before the source's row 14, but the scan sees that front over its
      // row 8, as over the rest, so it is covered from there too.
      stand: {
        deckFrontFt: 71,
        rows: 22,
        frontRowHeightFt: 29,
        rakeDeg: 20,
        backHeightFt: 73,
        backSetbackFt: -37,
        overhang: { coveredFromRow: 8, soffitHeightFt: 62 },
      },
      sections: withRakes(withFronts(withBacks(Object.fromEntries([
        ['218A', { rows: 8, noCover: true }], ['218B', { rows: 8, noCover: true }],
        ['219', { rows: 8, noCover: true }], ['220A', { rows: 7, noCover: true }],
        ['220B', { rows: 7, noCover: true }], ['220C', { rows: 7, noCover: true }],
        ['221A', { rows: 8, noCover: true }], ['221B', { rows: 8, noCover: true }],
        ['222', { rows: 8, noCover: true }],
        ['215', { rows: 13 }],
        ['229', { rows: 19 }], ['205', { rows: 22 }], ['217', { rows: 23 }], ['233A', { rows: 23 }],
        ['216', { overhang: { coveredFromRow: 11, soffitHeightFt: 62 } }],
      ]), {
        '205S': [72, -32], '205': [72, -33], '234': [73, -38],
        '231': [73, -38], '229': [73, -27], '226': [73, -38],
        '224': [73, -35], '220C': [72, 4], '220B': [139, 37], '220A': [73, 4],
        '220BW': [74, -33], '220CW': [72, -37], '216': [72, -32], '215': [73, -12],
        '214B': [73, -38], '212': [72, -37], '211': [72, -38], '209': [73, -38], '206': [73, -38],
        '233B': [72, -37], '233A': [73, -41], '232A': [73, -40], '230': [73, -38],
        '227A': [137, -4], '221A': [73, 1], '222': [73, 0], '218B': [73, 0], '219': [73, 2],
        '208': [72, -37], '210': [73, -38], '221B': [72, 2], '218A': [73, 1], '227B': [72, -38],
        '223': [72, -37], '217': [72, -41], '207': [72, -38], '213': [73, -38],
      }), {
        '205S': 28, '234W': 28, '231': 30, '216': 27, '232B': 28,
        '227A': 28,
      }), {
        '205S': 17, '228': 21, '212': 21,
        '221B': 21,
        '225': 19,
        '224': 19,
        '216': 19,
        '215': 19,
        '214A': 19,
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_YANKEES, rysSection('217'), rysSection('220A'), rysSection('229'), rysSection('205'), rysSection('215'), rysSection('233A'), YANKEES_LIDAR],
    },
    terrace: {
      label: 'Terrace level (300s)',
      // 7–10 rows, not covered (sourced). Lidar (49 of 55): front row 72 ft
      // (71–73), 31° rake; what rises highest behind is the canopy, 137 ft
      // up and 12 ft behind the last row (its top 132–134 ft, or a lamp bank
      // on it, 137–141, where a section's cut crosses one, as 26 of the 49
      // do); each measured section takes its own (4–22 ft behind).
      stand: { rows: 9, frontRowHeightFt: 72, rakeDeg: 31, backHeightFt: 137, backSetbackFt: 12 },
      sections: withRakes(withFronts(withBacks({ '320B': { rows: 10 }, '314': { rows: 8 } }, {
        '327': [132, 14], '330': [133, 14], '331': [140, 7], '326': [139, 6], '325': [132, 19],
        '325W': [141, 9], '326W': [133, 16], '331W': [132, 17], '333W': [134, 16], '330W': [139, 7],
        '327W': [133, 17], '320C': [132, 16], '321': [132, 19], '323': [140, 9], '322': [141, 11],
        '320CW': [132, 16], '321W': [132, 19], '322W': [141, 11], '323W': [140, 9], '317': [133, 21],
        '318': [132, 19], '319': [132, 21], '320A': [133, 16], '320B': [140, 4], '317W': [133, 21],
        '319W': [141, 9], '320AW': [132, 22], '318W': [132, 19], '309': [133, 14], '310': [133, 17],
        '313': [140, 7], '314': [140, 11], '315': [137, 6], '309W': [140, 7], '314W': [141, 12],
        '315W': [140, 9], '305': [140, 7], '305W': [140, 7], '308': [140, 7], '332A': [140, 6],
        '332B': [140, 7], '329': [140, 7], '328': [139, 7], '324': [132, 19], '312': [141, 7],
        '316': [139, 9],
        '310W': [133, 12],
        '313W': [133, 12],
        '311': [133, 12],
      }), {
        '331W': 73, '321': 73, '321W': 73, '318': 73, '319': 73, '320B': 73, '319W': 73, '318W': 73,
        '310': 73, '313': 73, '315': 73, '314W': 71, '315W': 73, '305': 73, '332A': 73,
        '312': 73,
        '327': 73,
        '325W': 73,
        '324': 73,
      }), {
        '327W': 32, '321': 30, '321W': 30, '319': 30, '320B': 33, '319W': 30, '313': 30,
        '314': 32, '313W': 32, '314W': 33,
        '326': 33,
      }),
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
      sections: withFronts(withBacks({}, { '420C': [132, -21], '408': [134, -29] }), {
        '408': 94,
      }),
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
 * as seen from the middle uncovered row; tier values are medians, and every
 * measured section takes its own front row and back, and its own rake where
 * the scan sees 9 or more of its rows and the cuts beside it agree. Each cut
 * runs along the rows' fall line: where that is firmly more than 15° off the
 * club map's direction, the section faces it, or where its rows bend across
 * its width the median of the fall lines in its middle and 4 m to either
 * side (its section file's standRuns); one whose fall lines lie either side
 * of the map's direction keeps it and its tier's rake. The eight
 * lattice light towers on the roof are not counted as walls. Covered rows: where the scan
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
      // field (-2 to 1), 9° rake (7–11). What rises highest behind is the
      // pavilion roof, 82 ft up and 47 ft behind the last row; behind home
      // the press box block (96–100 ft), in the right-field corner the
      // Grandstand roof (54 ft). Each measured section takes its own back
      // (the pavilion roof 34–57 ft behind them, the press box block 24–39).
      stand: { rows: 12, frontRowHeightFt: -1, rakeDeg: 9, backHeightFt: 82, backSetbackFt: 47 },
      sections: withRakes(withFronts(withBacks({}, {
        'F9': [82, 50], 'F10': [82, 50], 'F11': [82, 55], 'F12': [82, 52], 'F13': [82, 35],
        'F14': [82, 35], 'F15': [82, 35], 'F16': [82, 50], 'F17': [82, 35], 'F18': [82, 35],
        'F19': [82, 35], 'F20': [82, 34], 'F21': [82, 40], 'F22': [82, 40], 'F23': [82, 42],
        'F24': [82, 40], 'F25': [82, 42], 'F26': [82, 42], 'F27': [82, 57], 'F28': [82, 43],
        'F29': [82, 52], 'F30': [82, 50], 'F31': [82, 48], 'F32': [82, 50], 'F33': [82, 50],
        'F34': [82, 50], 'F35': [82, 48], 'F37': [82, 45], 'F38': [82, 45], 'F39': [96, 24],
        'F40': [98, 24], 'F41': [98, 24], 'F42': [96, 39], 'F43': [96, 34], 'F44': [100, 24],
        'F45': [100, 25], 'F46': [98, 25], 'F47': [98, 25], 'F48': [96, 24],
        'F50': [82, 45], 'F52': [82, 48], 'F53': [82, 48], 'F54': [82, 48], 'F55': [82, 48],
        'F56': [82, 48], 'F57': [82, 48], 'F58': [82, 35], 'F59': [82, 48], 'F60': [82, 35],
        'F61': [82, 35], 'F62': [82, 40], 'F63': [82, 40], 'F64': [82, 39], 'F65': [82, 53],
        'F66': [82, 55], 'F68': [82, 55], 'F69': [82, 34], 'F70': [82, 43],
        'F72': [82, 48], 'F73': [82, 48], 'F74': [82, 48], 'F77': [82, 48], 'F78': [54, 29],
        'F79': [54, 32], 'F80': [54, 27], 'F81': [54, 30], 'D13': [82, 35], 'D14': [82, 35],
        'D15': [82, 35], 'D16': [82, 50], 'D17': [82, 35], 'D18': [82, 35], 'D19': [82, 35],
        'D20': [82, 34], 'D29': [82, 52], 'D30': [82, 50], 'D31': [82, 48], 'D32': [82, 50],
        'D33': [82, 50], 'D34': [82, 50], 'D35': [82, 48], 'D37': [82, 45], 'D38': [82, 45],
        'D52': [82, 48], 'D53': [82, 48], 'D54': [82, 48], 'D55': [82, 48], 'D56': [82, 48],
        'D57': [82, 48], 'D58': [82, 35], 'D59': [82, 48], 'D60': [82, 35], 'D61': [82, 35],
        'D72': [82, 48], 'D73': [82, 48], 'D74': [82, 48], 'D77': [82, 48], 'D78': [54, 29],
        'D79': [54, 32], 'H39': [96, 24], 'H40': [98, 24], 'H41': [98, 24], 'H42': [96, 39],
        'H43': [96, 34], 'H44': [100, 24], 'H45': [100, 25], 'H46': [98, 25], 'H47': [98, 25],
        'H48': [96, 24], 'H50': [82, 45], 'FBC29': [82, 52], 'FBC30': [82, 50],
        'FBC31': [82, 48], 'FBC32': [82, 50], 'FBC33': [82, 50], 'FBC34': [82, 50],
        'FBC35': [82, 48], 'FBC37': [82, 45], 'FBC38': [82, 45], 'FBC52': [82, 48],
        'FBC53': [82, 48], 'FBC54': [82, 48], 'FBC55': [82, 48], 'FBC56': [82, 48],
        'FBC57': [82, 48], 'FBC58': [82, 35], 'FBC59': [82, 48], 'FBC60': [82, 35],
        'FBC61': [82, 35], 'FBC69': [82, 34], 'FBC70': [82, 43],
        'FBC72': [82, 48], 'FBC73': [82, 48], 'FBC74': [82, 48], 'FBC77': [82, 48],
        'FBC78': [54, 29], 'FBC79': [54, 32], 'FBC80': [54, 27],
        'F49': [82, 45],
        'F71': [82, 53],
        'H49': [82, 45],
        'FBC71': [82, 53],
      }), {
        'F11': -2, 'F13': 1, 'F14': 1, 'F15': 1, 'F17': 1, 'F18': 1, 'F19': 1, 'F20': 1, 'F21': 1,
        'F22': 1, 'F23': 1, 'F24': 1, 'F25': 1, 'F26': 1, 'F28': 1, 'F29': -2, 'F32': -2, 'F34': -2,
        'F42': -2, 'F49': -2, 'F51': -2, 'F56': -2, 'F58': 1, 'F59': -2, 'F60': 1, 'F61': 1,
        'F62': 1, 'F63': 1, 'F64': 1, 'F65': -2, 'F66': -2, 'F68': -2, 'F69': 1, 'D13': 1, 'D14': 1,
        'D15': 1, 'D17': 1, 'D18': 1, 'D19': 1, 'D20': 1, 'D29': -2, 'D32': -2, 'D34': -2, 'D51': -2,
        'D56': -2, 'D58': 1, 'D59': -2, 'D60': 1, 'D61': 1, 'H42': -2, 'H49': -2, 'FBC29': -2,
        'FBC32': -2, 'FBC34': -2, 'FBC51': -2, 'FBC56': -2, 'FBC58': 1, 'FBC59': -2, 'FBC60': 1,
        'FBC61': 1, 'FBC69': 1,
        'F70': -2,
        'FBC70': -2,
        'F71': -2,
        'FBC71': -2,
      }), {
        'F42': 8, 'F47': 8, 'F48': 10, 'F59': 10, 'F65': 10, 'F66': 10,
        'F68': 10, 'F72': 10, 'F73': 10, 'F74': 10, 'F75': 10, 'F76': 10, 'F77': 10, 'F79': 10,
        'F80': 10, 'F81': 10, 'D59': 10, 'D72': 10, 'D73': 10, 'D74': 10, 'D75': 10, 'D76': 10,
        'D77': 10, 'D79': 10, 'H42': 8, 'H47': 8, 'H48': 10, 'FBC59': 10, 'FBC72': 10,
        'FBC73': 10, 'FBC74': 10, 'FBC75': 10, 'FBC76': 10, 'FBC77': 10, 'FBC79': 10, 'FBC80': 10,
        'F70': 11,
        'FBC70': 11,
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
      // roof's top over row 9, 54 ft up, is what rises highest behind (41–54
      // ft from section to section; behind home the press box block, 96–100
      // ft). Each measured section takes its own back: in the 21-row
      // sections (B94–B97) the roof's edge is 27–32 ft in front of the last
      // row; behind the short ones (B96, B103, B116, B146, B165: 6–11 rows)
      // it starts at or just past the last row.
      stand: { rows: 13, frontRowHeightFt: 4, rakeDeg: 16, backHeightFt: 54, backSetbackFt: -12, deckFrontFt: 52, overhang: { coveredFromRow: 9, soffitHeightFt: 41 } },
      sections: withRakes(withFronts(withBacks({
        'B88': { deckFrontFt: 39, overhang: { coveredFromRow: 13, soffitHeightFt: 28 } },
        'B89': { deckFrontFt: 40, overhang: { coveredFromRow: 14, soffitHeightFt: 29 } },
        // At the ends and behind home another structure covers them, its
        // front not measured.
        ...Object.fromEntries(['B105', 'B150'].map((id) => [id, { deckFrontFt: undefined, overhang: { coveredFromRow: 8, soffitHeightFt: 36 } }])),
        ...Object.fromEntries(['B106', 'B107', 'B108', 'B147', 'B148', 'B110'].map((id) => [id, { deckFrontFt: undefined, overhang: { coveredFromRow: 7, soffitHeightFt: 36 } }])),
        ...Object.fromEntries(['B109', 'B149', 'B111'].map((id) => [id, { deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 36 } }])),
        'B115': { frontRowHeightFt: 9, overhang: { coveredFromRow: 3, soffitHeightFt: 41 } },
        'B118': { overhang: { coveredFromRow: 9, soffitHeightFt: 46 } },
        ...Object.fromEntries(['B125', 'B128', 'B132', 'B133'].map((id) => [id, { deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 66 } }])),
        'B127': { deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 57 } },
        'B129': { deckFrontFt: undefined, overhang: { coveredFromRow: 6, soffitHeightFt: 36 } },
        'B130': { deckFrontFt: undefined, overhang: { coveredFromRow: 10, soffitHeightFt: 87 } },
        'B131': { deckFrontFt: undefined, overhang: { coveredFromRow: 5, soffitHeightFt: 33 } },
        ...Object.fromEntries(['B134', 'B135'].map((id) => [id, { overhang: { coveredFromRow: 6, soffitHeightFt: 41 } }])),
      }, {
        'B88': [41, -13], 'B89': [41, -17], 'B94': [54, -32], 'B95': [54, -27], 'B96': [54, 0],
        'B97': [54, -27], 'B98': [54, -7], 'B99': [54, -15], 'B100': [54, -17], 'B101': [54, -17],
        'B102': [54, -19], 'B103': [53, -2], 'B104': [54, -20], 'B105': [54, -20], 'B106': [54, -20],
        'B111': [52, -10],
        'B113': [53, -10], 'B115': [54, -28], 'B116': [54, 1], 'B118': [54, -14], 'B121': [54, -14],
        'B122': [54, -15], 'B123': [54, -15], 'B124': [53, -15], 'B125': [96, -19],
        'B127': [98, -19], 'B128': [98, -19], 'B129': [97, -20], 'B130': [96, -9],
        'B131': [100, -20], 'B132': [98, -19], 'B133': [98, -19], 'B134': [96, -20],
        'B135': [54, -17], 'B136': [54, -17], 'B137': [54, -14], 'B138': [54, -14],
        'B140': [54, -14], 'B141': [54, -14], 'B144': [52, -10], 'B146': [54, 1], 'B148': [53, -10],
        'B149': [53, -10], 'B150': [53, -10], 'B151': [53, -12], 'B152': [53, -10],
        'B154': [54, -14], 'B155': [54, -14], 'B157': [53, -10], 'B158': [54, -10], 'B159': [53, -9],
        'B160': [54, -10], 'B161': [54, -10], 'B162': [54, -10], 'B164': [52, -10], 'B165': [54, 2],
      }), {
        'B94': 6, 'B101': 5, 'B115': 9, 'B160': 3, 'B163': 5, 'B164': 6, 'B165': 6,
        'B89': 5,
      }), {
        'B88': 13, 'B89': 14, 'B95': 13, 'B96': 13, 'B97': 14, 'B98': 14, 'B99': 14,
        'B100': 15, 'B101': 14, 'B102': 14, 'B111': 15, 'B113': 15,
        'B144': 15, 'B149': 15, 'B150': 15, 'B157': 20,
        'B158': 20, 'B159': 20, 'B160': 20, 'B161': 19, 'B162': 19, 'B163': 18,
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
      // Uncovered; among the last seats to get shade (sourced). Lidar (4 of
      // 8; B1, B3 and B4 are not separated from the Grandstand in the cut,
      // and B6's cut along its rows runs up a field-level walkway into the
      // stand, while the cuts 4 m either side read its front row at the
      // field): front row 1 ft below the field (-1 to 0), 9° rake (9–15);
      // behind, the pavilion roof 82 ft up and 50 ft back, as B7 and B8 see
      // it (behind B2 and, along its rows' fall line, B5 the Grandstand
      // roof, 41–54 ft up: the median of the four, 68 ft, is neither). Each
      // measured section takes its own back.
      stand: { rows: 12, frontRowHeightFt: -1, rakeDeg: 9, backHeightFt: 82, backSetbackFt: 50 },
      sections: withFronts(withBacks({}, { 'B2': [41, 21], 'B5': [54, 45], 'B8': [82, 58], 'B7': [82, 52] }), {
        'B2': 0,
      }),
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
      // gives 36.6 ft). Lidar (3 of 10): the rows step up at 34° (28–35;
      // 26–36° on the eight cuts through and beside the three, both halves
      // of each run as steep); behind M10 the buildings across
      // the street, 55 ft up and 150 ft back; over M1 and M8 it sees only
      // the light towers' lattice standing among the seats (44–45 ft), not
      // a wall, so they keep the sourced back.
      stand: { rows: 3, frontRowHeightFt: 37, rakeDeg: 34, backHeightFt: 41 },
      sections: withFronts({ 'M10': { backHeightFt: 55, backSetbackFt: 150 } }, {
        'M8': 36, 'M10': 40,
      }),
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
      sections: withFronts(withBacks({ 'R43': { backHeightFt: 66, backSetbackFt: 18 } }, { 'R33': [82, -2], 'R39': [66, 1], 'R41': [66, 1] }), {
        'R41': 52,
      }),
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
      // roof 82 ft up, 1–4 ft behind the last row (each measured section its
      // own).
      stand: { rows: 5, frontRowHeightFt: 53, rakeDeg: 32, backHeightFt: 82, backSetbackFt: 2 },
      sections: withFronts(withBacks(
        Object.fromEntries(['AP01', 'AP02'].map((id) => [id, { overhang: { coveredFromRow: 1, soffitHeightFt: 66 } }])),
        { 'AP04': [82, 1], 'AP06': [82, 1], 'AP09': [82, 1], 'AP14': [82, 4] },
      ), {
        'AP11': 52, 'AP13': 52, 'AP14': 52,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: ['https://www.mlb.com/redsox/ballpark/information/guide', RYS_FENWAY, FENWAY_LIDAR],
    },
    pavilionReserved: {
      label: 'Pavilion Reserved',
      // Rows A–J; Rate Your Seats calls them uncovered. Lidar (4 of 4): front
      // row 52 ft (52–53), 36° rake (32–36; PR16 straddles a bend, its cut
      // across the rows); a structure 82 ft up reaches
      // out over row 6 of PR15 and PR16 (covering them from there; over the
      // last rows only in PR18 and PR20) and is what rises highest behind;
      // each section takes its own (behind PR18 a lower one, 69 ft).
      stand: { rows: 10, frontRowHeightFt: 52, rakeDeg: 36, backHeightFt: 82, backSetbackFt: -7 },
      sections: withFronts(withBacks(
        Object.fromEntries(['PR15', 'PR16'].map((id) => [id, { overhang: { coveredFromRow: 6, soffitHeightFt: 82 } }])),
        { 'PR15': [82, -10], 'PR16': [82, -12], 'PR18': [69, 1], 'PR20': [88, -4] },
      ), {
        'PR16': 53, 'PR18': 53,
      }),
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
 * given; every measured section takes its own front row and back, and its
 * own rake where the scan sees 9 or more of its rows and the cuts beside it
 * agree. Each cut runs along the rows' fall line: where that is firmly more
 * than 15° off the club map's direction, the section faces it, or where its
 * rows bend across its width the median of the fall lines in its middle and
 * 4 m to either side (its section file's standRuns); one whose fall lines
 * lie either side of the map's direction keeps it and its tier's rake.
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
      // 2 ft below the field (-2 to 0), 8° rake (6–14; 2DG and 10DG
      // straddle a bend, their cuts across the rows). What rises highest
      // behind is the Top Deck's roof, 139 ft up and 148 ft behind; behind
      // home (1DG) the box on that roof, beside the Field level's end (10DG)
      // the Reserve roof; each measured section takes its own.
      stand: { rows: 8, frontRowHeightFt: -2, rakeDeg: 8, backHeightFt: 139, backSetbackFt: 148 },
      sections: withRakes(withFronts(withBacks({ '9DG': { rows: 4 } }, {
        '1DG': [155, 160], '10DG': [120, 157], '7DG': [139, 147], '11DG': [139, 127],
        '2DG': [139, 147], '3DG': [139, 147],
      }), {
        '10DG': -1, '11DG': 0,
      }), {
        '7DG': 6,
        '4DG': 7,
      }),
      heightsSourced: true,
      coverSourced: true,
      sources: [rysDodgers('dugout-club'), rysDodgers('sections/1DC'), rysDodgers('sections/9DC'), DODGERS_LIDAR],
    },
    baselineClub: {
      label: 'Baseline Club',
      // Rows 1–6 in front of Field sections 26–43, uncovered (sourced).
      // Lidar (14 of 18): front row 1 ft below the field (-2 to -1), 7°
      // rake; behind, the Reserve roof 120 ft up and 142 ft back (139–144,
      // each measured section its own).
      stand: { rows: 6, frontRowHeightFt: -1, rakeDeg: 7, backHeightFt: 120, backSetbackFt: 142 },
      sections: withFronts(withBacks({}, {
        '35BL': [121, 139], '41BL': [120, 144], '36BL': [120, 140], '32BL': [120, 144],
        '26BL': [120, 139], '33BL': [120, 139], '37BL': [120, 144], '39BL': [120, 144],
        '43BL': [120, 144],
      }), {
        '44BL': -2, '34BL': -2,
      }),
      heightsSourced: true,
      coverSourced: true,
      sources: [rysDodgers('field-level'), rysDodgers('sections/27'), DODGERS_LIDAR],
    },
    field: {
      label: 'Field level',
      // Rows A–X (22 rows, no I), covered from row T (19th) by the Loge
      // (sourced; the lidar puts the Loge's front edge at row 19, 16–22; at
      // row 22 in 15FD and row 17 in 53FD, which take the lidar's row).
      // Sections 52 and 53 have rows AA, A–Z (25), so T is their 20th.
      // Lidar (53 of 53): front row 1 ft (-1 to 4), 12° rake (9–13). What
      // rises highest behind depends on where the section is: down the
      // lines the Reserve deck's front edge (58 ft, 11 ft behind the last
      // row), behind home the Top Deck's roof (139 ft) or the box on it
      // (155 ft), in the corners the Reserve roof (120 ft, the median).
      // Estimated: the Loge's underside ~21 ft (9 ft above row T's floor,
      // a foot under the Loge's measured 22-ft front row; 22 ft over 15FD's
      // row 22, and over 2FD, 3FD, 4FD, 6FD and 36FD, whose own front rows
      // sit higher). Each measured section takes its own back.
      stand: {
        deckFrontFt: 23,
        rows: 22,
        frontRowHeightFt: 1,
        rakeDeg: 12,
        backHeightFt: 120,
        backSetbackFt: 70,
        overhang: { coveredFromRow: 19, soffitHeightFt: 21 },
      },
      sections: withRakes(withFronts(withBacks({
        '15FD': { overhang: { coveredFromRow: 22, soffitHeightFt: 22 } },
        '52FD': { rows: 25, overhang: { coveredFromRow: 20, soffitHeightFt: 21 } },
        ...Object.fromEntries(['2FD', '3FD', '4FD', '6FD', '36FD'].map((id) => [id, { overhang: { coveredFromRow: 19, soffitHeightFt: 22 } }])),
        '53FD': { rows: 25, overhang: { coveredFromRow: 17, soffitHeightFt: 21 } },
      }, {
        '2FD': [139, 72], '24FD': [58, 9], '22FD': [58, 11], '20FD': [59, 11], '18FD': [139, 75],
        '46FD': [120, 85], '42FD': [57, 11], '40FD': [59, 12], '36FD': [58, 9], '34FD': [58, 11],
        '32FD': [58, 11], '30FD': [59, 11], '28FD': [59, 11], '26FD': [59, 12], '16FD': [138, 75],
        '14FD': [139, 76], '12FD': [139, 76], '19FD': [139, 75], '15FD': [139, 86],
        '17FD': [139, 75], '23FD': [120, 89], '31FD': [59, 11], '33FD': [59, 11], '35FD': [58, 11],
        '37FD': [59, 11], '39FD': [59, 11], '7FD': [139, 75], '9FD': [139, 76], '11FD': [139, 76],
        '13FD': [139, 80], '21FD': [59, 11], '25FD': [58, 11], '27FD': [57, 11], '29FD': [59, 11],
        '41FD': [58, 11], '50FD': [56, 9], '48FD': [120, 88], '38FD': [58, 9], '10FD': [139, 76],
        '8FD': [139, 75], '6FD': [139, 75], '4FD': [139, 70], '1FD': [155, 95], '3FD': [139, 73],
        '5FD': [139, 75], '47FD': [58, 12], '49FD': [121, 75], '51FD': [120, 83],
        '53FD': [120, 65],
        '44FD': [120, 75],
        '43FD': [120, 75],
        '45FD': [120, 75],
      }), {
        '2FD': 2, '46FD': 0, '36FD': 2, '15FD': 0, '17FD': 0, '23FD': -1, '9FD': 0, '48FD': 0,
        '6FD': 2, '4FD': 2, '52FD': 0, '51FD': 0, '53FD': 2,
        '50FD': 2,
        '3FD': 2,
      }), {
        '20FD': 13, '30FD': 11, '28FD': 11, '17FD': 13, '9FD': 13, '11FD': 11, '13FD': 11,
        '50FD': 11, '48FD': 11, '10FD': 11, '6FD': 11, '4FD': 11, '1FD': 11, '5FD': 13,
      }),
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
      // rises highest behind is that edge, 58 ft up, 35–43 ft in front of
      // the last row (each measured section its own).
      stand: {
        deckFrontFt: 57,
        rows: 22,
        frontRowHeightFt: 22,
        rakeDeg: 19,
        backHeightFt: 58,
        backSetbackFt: -41,
        overhang: { coveredFromRow: 8, soffitHeightFt: 48 },
      },
      sections: withRakes(withFronts(withBacks({}, {
        '163LG': [57, -38], '166LG': [57, -38], '105LG': [58, -42], '164LG': [57, -37],
        '126LG': [58, -42], '144LG': [59, -40], '148LG': [58, -42], '156LG': [58, -42],
        '160LG': [58, -35], '158LG': [58, -38], '132LG': [59, -38], '138LG': [57, -42],
        '134LG': [59, -40], '146LG': [58, -38], '142LG': [59, -40], '130LG': [58, -38],
        '128LG': [58, -42], '162LG': [58, -37], '154LG': [58, -42], '152LG': [58, -42],
        '122LG': [58, -38], '120LG': [58, -42], '116LG': [58, -42], '114LG': [58, -38],
        '108LG': [58, -42], '104LG': [58, -42], '102LG': [58, -42], '101LG': [58, -42],
        '149LG': [58, -42], '155LG': [58, -42], '153LG': [58, -43], '151LG': [59, -42],
        '115LG': [59, -42], '117LG': [59, -42], '119LG': [59, -42], '121LG': [59, -40],
        '131LG': [59, -43], '133LG': [59, -42], '135LG': [59, -42], '137LG': [57, -43],
        '129LG': [59, -43], '127LG': [59, -42], '125LG': [59, -40], '139LG': [57, -43],
        '141LG': [59, -42], '145LG': [59, -42], '143LG': [59, -43], '147LG': [58, -42],
        '111LG': [59, -40], '113LG': [59, -40], '165LG': [57, -38], '168LG': [56, -38],
        '167LG': [58, -37],
        '103LG': [58, -42],
        '107LG': [58, -42],
        '109LG': [58, -40],
        '118LG': [58, -40],
        '136LG': [58, -40],
        '140LG': [58, -40],
        '124LG': [58, -40],
        '150LG': [58, -40],
        '112LG': [58, -40],
        '110LG': [58, -40],
        '106LG': [58, -40],
        '123LG': [58, -40],
        '157LG': [58, -40],
        '159LG': [58, -40],
        '161LG': [58, -40],
      }), {
        '105LG': 23, '126LG': 23, '160LG': 21, '128LG': 23, '120LG': 23, '116LG': 23, '106LG': 23,
        '104LG': 23, '101LG': 23, '103LG': 23, '149LG': 23, '155LG': 23, '153LG': 23, '151LG': 23,
        '115LG': 23, '117LG': 23, '119LG': 23, '131LG': 24, '133LG': 23, '135LG': 23, '137LG': 23,
        '129LG': 23, '127LG': 23, '125LG': 23, '139LG': 23, '141LG': 23, '145LG': 23, '143LG': 23,
        '147LG': 23, '111LG': 23, '157LG': 23, '159LG': 23, '161LG': 23,
        '107LG': 23,
      }), {
        '160LG': 18, '122LG': 18, '112LG': 20, '106LG': 18, '102LG': 20,
        '115LG': 20, '121LG': 18, '125LG': 18, '123LG': 18, '165LG': 20,
        '105LG': 20,
      }),
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
      sections: withRakes(withFronts(withBacks({}, {
        '10RS': [97, -29], '11RS': [96, -29], '7RS': [98, -29], '9RS': [98, -27], '5RS': [98, -26],
        '3RS': [96, -26],
      }), {
        '10RS': 58, '11RS': 58, '7RS': 58, '9RS': 58,
      }), {
        '9RS': 29,
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1IR'), rysDodgers('sections/6IR'), rysDodgers('sections/11IR'), rysDodgers('reserve-level'), DODGERS_LIDAR],
    },
    infieldReserveOpen: {
      label: 'Infield Reserve',
      // Rows A–V. Rate Your Seats gives them no cover, but the lidar shows
      // the Top Deck over their rows from 12 (11–12) back. Lidar (2 of 4,
      // 15RS and 16RS, measured along their rows' fall line): front row 58
      // ft, 30° rake; what rises highest behind is the Top Deck's front
      // edge, 98 ft up, 29 ft in front of the last row. Estimated: its underside
      // ~86 ft, its front row less the park's measured deck depth (9 ft).
      stand: { rows: 21, frontRowHeightFt: 58, rakeDeg: 30, backHeightFt: 98, backSetbackFt: -29, deckFrontFt: 94, overhang: { coveredFromRow: 12, soffitHeightFt: 86 } },
      sections: withBacks({}, { '16RS': [97, -29] }),
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/15IR'), rysDodgers('reserve-level'), DODGERS_LIDAR],
    },
    lowerReserve: {
      label: 'Lower Reserve',
      // Rows A–V, no cover (sourced). Lidar (20 of 20, 12 of them along
      // their rows' fall line, 15–37° off the map's direction): front row 58
      // ft (56–59), 30° rake (30–31); behind, the Reserve roof's front edge
      // 120 ft up, 4 ft behind the last row (3–7 ft; each measured section
      // takes its own).
      stand: { rows: 21, frontRowHeightFt: 58, rakeDeg: 30, backHeightFt: 120, backSetbackFt: 4 },
      sections: withRakes(withFronts(withBacks({}, {
        '51RS': [121, 4],
        '28RS': [120, 2], '27RS': [121, 7],
        '35RS': [120, 6],
        '32RS': [120, 2],
        '55RS': [120, 7],
        '47RS': [120, 7],
      }), {
        '32RS': 59, '28RS': 59,
        '27RS': 56, '56RS': 57,
        '24RS': 57,
        '55RS': 57,
        '47RS': 57,
        '35RS': 57,
      }), {
        '48RS': 31, '40RS': 31, '44RS': 31,
        '56RS': 31, '31RS': 31,
        '51RS': 31,
        '28RS': 31,
        '24RS': 31,
      }),
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
      sections: withRakes(withFronts(withBacks({
        '13TD': { rows: 17, overhang: { coveredFromRow: 12, soffitHeightFt: 139 } },
        '1TD': { overhang: { coveredFromRow: 18, soffitHeightFt: 138 } },
        '3TD': { overhang: { coveredFromRow: 17, soffitHeightFt: 136 } },
      }, {
        '9TD': [139, -29], '7TD': [139, -29], '3TD': [155, 9], '1TD': [154, -12], '2TD': [139, -29],
        '13TD': [139, -13], '4TD': [139, -29], '12TD': [139, -29], '10TD': [139, -29],
      }), {
        '11TD': 96, '13TD': 96, '5TD': 96,
      }), {
        '11TD': 33, '7TD': 33, '13TD': 33, '5TD': 33, '4TD': 33, '6TD': 33,
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1TD'), rysDodgers('sections/13TD'), rysDodgers('top-deck'), DODGERS_LIDAR],
    },
    pavilion: {
      label: 'Pavilion',
      // Rows A–X (22), covered from row T (19th) by the pavilion roof
      // (sourced; the lidar puts its front edge at row 18). Lidar (15 of
      // 16): front row 8 ft over the outfield wall (8–9, each its own), 17° rake; the
      // roof's front edge is 42 ft up, 12 ft in front of the last row, and
      // behind 307–311 the video boards rise to 85–109 ft; each measured
      // section takes its own. The scan sees nothing below 39 ft at the
      // roof's edge (39–41): a thin roof, underside taken as 39 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 8,
        rakeDeg: 17,

        backHeightFt: 42,
        backSetbackFt: -12,
        overhang: { coveredFromRow: 19, soffitHeightFt: 39 },
      },
      sections: withRakes(withFronts(withBacks({}, {
        '308PR': [89, 9], '310PR': [89, 11], '302PR': [41, -10],
        '305PL': [40, -12], '303PL': [40, -10], '313PL': [40, -12], '311PL': [85, 11],
        '309PL': [109, 12], '315PL': [40, -12], '307PL': [85, 11],
      }), {
        '306PR': 9,
        '308PR': 9,
        '310PR': 9,
        '312PR': 9,
        '314PR': 9,
        '305PL': 9,
        '315PL': 9,
      }), {
        '308PR': 16, '303PL': 16, '309PL': 16,
      }),
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
 * where it puts a roof's edge more than two rows from the source's row;
 * each measured section takes its own front row and back, and its own rake
 * where the scan sees 9 or more of its rows and the cuts beside it agree.
 * The lower bowl is not: the club
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
      // what rises highest behind (the tier's back is the median of the 21
      // measured; seen from row 1 now that the scan covers every row, the
      // tool finds 15 of them, each of which takes its own).
      stand: {
        rows: 10,
        frontRowHeightFt: 48,
        rakeDeg: 26,
        backHeightFt: 89,
        backSetbackFt: -18,
        overhang: { coveredFromRow: 1, soffitHeightFt: 87 },
      },
      sections: withFronts(withBacks({ '331R': { rows: 12 } }, {
        ...Object.fromEntries(['304L', '305L', '306L', '307L', '309L', '312L', '316L', '317R', '318R', '321R', '323R', '324R', '329R'].map((id) => [id, [88, -23] as const])),
        '326R': [87, -23], '331R': [88, -29],
      }), {
        '324R': 47, '326R': 47, '321R': 47, '323R': 47, '318R': 47,
      }),
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
      // buildings across the street (54 ft median, up to 65 ft), the
      // scoreboard (511), the back wall (507, 512). The left-field video
      // board's underside is 85 ft up over rows 15–17 of 505 and 506, which
      // the lidar shows covered from there (the source calls them open).
      // Each measured section takes its own back: the buildings 60–116 ft
      // behind 502–504 and 514 (along 501's rows, which bend, a structure 40
      // ft up, 12 ft behind), the scoreboard 25 ft behind 511's last row
      // (its 14 rows), the video board's top 13 ft in front of 506's (16 ft
      // in front of 505's); the tier's is their median. Behind 513 the bleachers'
      // back building, 48 ft up, starts where its rows end (39 ft from the
      // front; the rows here are ~2.1 ft deep, 511's 14 in 30 ft, not the
      // profile's 2.75, so the scan's "row 15" is about its last): it is
      // taken right behind its last row, open as sourced.
      stand: { rows: 21, frontRowHeightFt: 9, rakeDeg: 30, backHeightFt: 54, backSetbackFt: 12 },
      sections: withRakes(withFronts(withBacks({
        '501': { rows: 8 },

        '505': { overhang: { coveredFromRow: 15, soffitHeightFt: 85 } },
        '506': { overhang: { coveredFromRow: 17, soffitHeightFt: 85 } },
        '511': { rows: 14 },
        '513': { backHeightFt: 48, backSetbackFt: 0 },
        '537': { rows: 15 },
      }, {
        '502': [64, 60], '511': [88, 25], '512': [35, 7], '514': [54, 76], '503': [60, 116],
        '504': [54, 88], '505': [94, -16], '506': [85, -13], '507': [38, 12], '501': [40, 12],
        '538': [51, 4],
      }), {
        '502': 16, '511': 8, '512': 8, '503': 16, '504': 8, '507': 8, '501': 16, '538': 8,
      }), {
        '511': 28, '538': 29,
      }),

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
 * as seen from the middle uncovered row; tier values are medians, and every
 * measured section takes its own front row and back, and its own rake where
 * the scan sees 9 or more of its rows and the cuts beside it agree. Each cut
 * runs along the rows' fall line: where that is firmly more than 15° off the
 * club map's direction, the section faces it, or where its rows bend across
 * its width the median of the fall lines in its middle and 4 m to either
 * side (its section file's standRuns); one whose fall lines lie either side
 * of the map's direction keeps it and its tier's rake. Covered
 * rows: where the
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
      // 29's floor, under the Club level's measured 32-ft front row; 26–27 ft
      // over 133 and 135, 9 ft above their first covered row's floor, and
      // 26–27 ft over 110–117, whose own front rows sit 1–2 ft higher).
      // Each measured section takes its own back, seen from the middle of
      // its open rows: the View level's front 5–35 ft in front of the last
      // row (15 sections), or the View roof 28–39 ft behind it (14; 91 ft
      // behind 112); along 102's rows' fall line, the Club level's front
      // (33 ft, 17 ft in front). The tier takes the View front's median, 25 ft in
      // front: the separate medians of height and setback (69 ft, 5 ft in
      // front) pair the two groups and fit neither.
      stand: {
        deckFrontFt: 31,
        rows: 41,
        frontRowHeightFt: 0,
        rakeDeg: 12,
        backHeightFt: 68,
        backSetbackFt: -25,
        overhang: { coveredFromRow: 29, soffitHeightFt: 25 },
      },
      sections: withRakes(withFronts(withBacks({
        '101': { rows: 22, noCover: true },
        ...Object.fromEntries(['110', '113', '115', '117'].map((id) => [id, { overhang: { coveredFromRow: 29, soffitHeightFt: 26 } }])),
        '112': { overhang: { coveredFromRow: 29, soffitHeightFt: 27 } },
        ...Object.fromEntries(['107', '124'].map((id) => [id, { overhang: { coveredFromRow: 21, soffitHeightFt: 25 } }])),
        '108': { overhang: { coveredFromRow: 23, soffitHeightFt: 25 } },
        '109': { overhang: { coveredFromRow: 24, soffitHeightFt: 25 } },
        ...Object.fromEntries(['114', '116', '118', '121'].map((id) => [id, { overhang: { coveredFromRow: 25, soffitHeightFt: 25 } }])),
        '123': { overhang: { coveredFromRow: 22, soffitHeightFt: 25 } },
        // Row 28 on the measured slope.
        '133': { rows: 11, frontRowHeightFt: 16, overhang: { coveredFromRow: 2, soffitHeightFt: 26 } },
        '135': { rows: 32, frontRowHeightFt: 5, overhang: { coveredFromRow: 23, soffitHeightFt: 27 } },
      }, {
        '101': [24, 9], '102': [33, -17], '103': [125, 39], '104': [125, 39], '105': [125, 39],
        '106': [68, -22], '107': [67, -33], '108': [68, -35], '109': [125, 28], '110': [69, -27],
        '112': [125, 91], '114': [68, -27], '116': [125, 28],
        '117': [69, -25], '118': [125, 28], '121': [125, 31], '123': [68, -33],
        '124': [68, -35], '125': [68, -22], '126': [67, -23], '127': [67, -23], '128': [125, 37],
        '129': [125, 37], '130': [125, 36], '131': [125, 36], '132': [125, 36], '134': [125, 36],
        '135': [68, -10],
      }), {
        '103': -1, '104': -1, '105': -1, '107': 3, '108': 3, '109': 1, '110': 1, '112': 2,
        '113': 1, '114': 1, '115': 1, '116': 1, '117': 1, '118': 1, '121': 1, '123': 2, '124': 3,
        '128': -1, '129': -1, '134': -1, '135': 5,
      }), {
        '101': 11, '102': 11, '107': 11, '125': 11, '126': 11, '127': 11, '128': 11, '129': 11,
        '130': 11, '131': 11, '132': 11, '134': 11, '135': 9,
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
      // scoreboard: along the median of 143's rows' fall lines its structure
      // reaches out over only its last two rows (row 25 on, its lowest point
      // 41 ft up), under the three-row mark, so 143 stays open as sourced;
      // its top, 114 ft up and 3 ft in front of the last row, rises highest
      // (the cut across 143's rows put the edge over row 22). Behind 136 what
      // rises highest is 61 ft up, 132 ft back. Each measured section takes
      // its own back.
      stand: { rows: 26, frontRowHeightFt: 6, rakeDeg: 13, backHeightFt: 60, backSetbackFt: 37 },
      sections: withRakes(withFronts(withBacks({}, {
        '136': [61, 132], '137': [43, 60], '138': [37, 11], '139': [58, 35], '140': [71, 52],
        '143': [114, -3],
      }), {
        '137': 7, '139': 7, '143': 9,
      }), {
        '139': 14,
      }),
      heightsSourced: true,
      coverSourced: true,
      sources: [rysOracle('sections/136'), rysOracle('sections/140'), rysOracle('sections/143'), RYS_ORACLE, ORACLE_LIDAR],
    },
    arcade: {
      label: 'Arcade',
      // One to seven rows along the right-field wall, uncovered (sourced; 145
      // has rows 1–7, 150 and 152 rows 1–3). Lidar (145 and 146): front row
      // 20 ft (18–21), 10° rake (146's; 145's cut, 14°, is off the cuts
      // beside it, 10°); behind, a 26 ft wall 21 ft back.
      stand: { rows: 3, frontRowHeightFt: 20, rakeDeg: 10, backHeightFt: 26, backSetbackFt: 21 },
      sections: withFronts(withBacks({ '145': { rows: 7 }, '146': { rows: 7 }, '147': { rows: 7 } }, { '145': [26, 24], '146': [27, 19] }), {
        '145': 18, '146': 21,
      }),
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
      // row). Each measured section takes its own back.
      stand: {
        deckFrontFt: 66,
        rows: 12,
        frontRowHeightFt: 32,
        rakeDeg: 19,
        backHeightFt: 68,
        backSetbackFt: -19,
        overhang: { coveredFromRow: 5, soffitHeightFt: 57 },
      },
      sections: withRakes(withFronts(withBacks({
        '204': { frontRowHeightFt: 28 },
        '205': { rows: 10 },
        '215': { rows: 8 },
        '225': { frontRowHeightFt: 28, overhang: { coveredFromRow: 8, soffitHeightFt: 57 } },
        '234': { rows: 8, overhang: { coveredFromRow: 1, soffitHeightFt: 57 } },
      }, {
        '203': [68, -21], '205': [68, -14], '207': [68, -21], '209': [68, -16], '210': [68, -17],
        '211': [66, -19], '212': [68, -17], '213': [68, -17], '214': [65, -22], '215': [68, -8],
        '216': [67, -19], '217': [67, -19], '218': [69, -17], '219': [68, -17], '220': [67, -19],
        '221': [67, -19], '222': [68, -21], '223': [66, -22], '224': [67, -19], '225': [66, -12],
        '227': [67, -19], '228': [67, -19], '229': [68, -21], '231': [67, -21], '233': [68, -21],
      }), {
        '209': 30, '225': 29,
      }), {
        '225': 21,
      }),
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
      sections: withRakes(withFronts(withBacks({
        '315': { rows: 26, overhang: { coveredFromRow: 20, soffitHeightFt: 124 } },
        '326': { rows: 26, overhang: { coveredFromRow: 20, soffitHeightFt: 124 } },

        '333': { overhang: { coveredFromRow: 11, soffitHeightFt: 124 } },
      }, {
        '302': [125, -19], '305': [125, -19], '311': [125, -19], '313': [125, -19],
        '315': [125, -16], '317': [125, -19], '319': [123, -16], '320': [125, -19],
        '324': [125, -21], '326': [125, -16], '327': [125, -21], '330': [125, -19],
      }), {
        '302': 75, '305': 76, '307': 73, '310': 75, '311': 75, '313': 75, '315': 67, '317': 75,
        '319': 73, '320': 75, '324': 75, '326': 67, '327': 76, '330': 75,
      }), {
        '305': 30, '307': 32, '310': 30, '311': 30, '319': 30, '328': 32,
      }),

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
 * middle uncovered row; tier values are medians, and every measured section
 * takes its own front row and back (537's cut crosses the end of its stand,
 * so it keeps the tier's front), and its own rake where the scan sees 9 or
 * more of its rows and the cuts beside it agree. Each cut runs along the
 * rows' fall line: where that is firmly more than 15° off the club map's
 * direction, the section faces it, or where its rows bend across its width
 * the median of the fall lines in its middle and 4 m to either side (its
 * section file's standRuns); one whose fall lines lie either side of the
 * map's direction keeps it and its tier's rake. The decks step back in a
 * staircase, each
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
      // level (0–2 ft), 13° rake (8–23; 4 and 16 along the median of their
      // rows' fall lines; behind home 5, 6, 14 and D straddle a bend, their
      // cuts across the rows); what rises highest behind is the Promenade
      // roof, 129 ft up and 107 ft back (103–119; each measured section
      // takes its own).
      stand: { rows: 12, frontRowHeightFt: 0, rakeDeg: 13, backHeightFt: 129, backSetbackFt: 107 },
      sections: withRakes(withFronts(withBacks({}, {
        '11': [129, 103], 'A': [129, 119], '12': [129, 109], '4': [129, 111], '13': [129, 106],
        'C': [129, 109], 'D': [129, 109], '15': [129, 109], '6': [129, 109], '5': [129, 109],
        'E': [129, 109], '16': [129, 109], '6A': [129, 109], '7': [129, 106], 'F': [129, 106],
        '17': [129, 106], '8': [129, 109], '9': [128, 106], '10': [129, 104], '19': [129, 104],
        'H': [129, 106], 'AA': [129, 116], 'HH': [129, 104],
      }), {
        '11': 2, '4': 1, '13': 1, 'HH': 1,
      }), {
        'HH': 11,
      }),
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
      // rises highest behind, seen from the middle open row: down the lines
      // a structure 69 ft up behind the Excelsior's edge, 15–41 ft in front
      // of the last row (the tier's 18 is the median of 128, 130 and 132);
      // behind home, under the suites deck, the 69-ft structure (114, 115)
      // or the Promenade roof, 128–129 ft up and 31–34 ft behind the last
      // row (116–120; 99 ft behind 118, whose 8 rows are open). Each
      // measured section takes its own back; 121 (no cut) takes 120's.
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
      sections: withRakes(withFronts(withBacks({
        '106': { overhang: { coveredFromRow: 15, soffitHeightFt: 37 } },
        ...Object.fromEntries(['114', '115', '119', '121'].map((id) => [id, { overhang: { coveredFromRow: 14, soffitHeightFt: 20 } }])),
        '116': { overhang: { coveredFromRow: 13, soffitHeightFt: 20 } },
        ...Object.fromEntries(['117', '120'].map((id) => [id, { overhang: { coveredFromRow: 15, soffitHeightFt: 20 } }])),
        '130': { overhang: { coveredFromRow: 24, soffitHeightFt: 37 } },
        '102': { rows: 10, frontRowHeightFt: 6, backSetbackFt: 0, overhang: { coveredFromRow: 8, soffitHeightFt: 18 } },
        '108': { rows: 11, frontRowHeightFt: 15, overhang: { coveredFromRow: 7, soffitHeightFt: 27 } },
        '118': { rows: 8, noCover: true },
        '133': { rows: 5, noCover: true, backSetbackFt: 49 },
      }, {
        '106': [69, -41], '114': [69, -22], '115': [69, -20], '116': [129, 31], '117': [128, 34],
        '118': [129, 99], '119': [128, 34], '120': [129, 34], '121': [129, 34],
        '130': [69, -15], '132': [70, -26],
      }), {
        '106': 7, '116': 5, '132': 5,
      }), {
        '106': 15, '130': 11, '132': 12,
      }),
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
      sections: { '135': { frontRowHeightFt: 9, backHeightFt: 69, backSetbackFt: -4 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/134'), rysCiti('sections/137'), RYS_CITI],
    },
    rightOutfield: {
      label: 'Right-field seats (140–143)',
      // 140 has rows 1–20, 143 rows 1–3, uncovered (sourced). Lidar (3 of
      // 4): front row 9 ft (7–25; 141 sits 25 ft up), 18° rake (16–21).
      stand: { rows: 20, frontRowHeightFt: 9, rakeDeg: 18, backHeightFt: 45, backSetbackFt: 12 },
      sections: withRakes(withFronts({
        '140': { backHeightFt: 27, backSetbackFt: 21 },
        '141': { backHeightFt: 64, backSetbackFt: 7 },
        '143': { rows: 3 },
      }, {
        '141': 25, '142': 7,
      }), {
        '140': 16,
      }),
      heightsSourced: true,
      coverSourced: true,
      sources: [rysCiti('sections/140'), rysCiti('sections/143'), CITI_LIDAR],
    },
    sterling: {
      label: 'Sterling level (200s)',
      // No source gives rows or cover. The lidar shows nothing over 20 of
      // its 21 measured sections; over 222 a structure reaches out over row
      // 3, 34 ft up (taken as 36 ft, 9 ft above row 3's floor). Lidar (21 of
      // 39): front row 25 ft (24–35), 18° rake (7–22; 214 and 218 along the
      // median of their rows' fall lines; 213 straddles a bend, its cut
      // across the rows); what rises highest
      // behind is the 400 level's front, 69 ft up, 2–17 ft behind the last
      // row (each measured section its own; 222 too, from its two open rows).
      stand: { rows: 6, frontRowHeightFt: 25, rakeDeg: 18, backHeightFt: 69, backSetbackFt: 11 },
      sections: withRakes(withFronts(withBacks({

        '222': { overhang: { coveredFromRow: 3, soffitHeightFt: 36 } },
      }, {
        '229': [69, 14], '228': [69, 14], '227': [69, 9], '226': [69, 4], '225': [69, 4],
        '219': [69, 2], '220': [69, 2], '221': [69, 4], '216': [69, 12], '217': [69, 12],
        '218': [69, 14], '215': [69, 7], '208': [69, 2], '209': [69, 16], '210': [69, 16],
        '211': [69, 16], '212': [69, 6],
        '214': [69, 7],
      }), {
        '226': 29, '225': 29, '224': 26, '219': 35, '220': 34, '221': 34, '222': 24, '215': 26,
        '214': 26, '208': 28, '212': 29,
      }), { '210': 17 }),
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
      // Estimated: 25° rake (as before: the scan sees only 3–5 rows under
      // that front, 8–17° on cuts whose first rows run near flat, too few to
      // give the rake), the 400 deck's underside ~58 ft at
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
      sections: withFronts(withBacks({
        '312': { rows: 10, overhang: { coveredFromRow: 2, soffitHeightFt: 58 } },
        '314': { overhang: { coveredFromRow: 2, soffitHeightFt: 58 } },
        '316': { rows: 6, backSetbackFt: -7 },
        '320': { rows: 6, backSetbackFt: -7 },
        '326': { rows: 10, backSetbackFt: -18 },
        '336': { overhang: { coveredFromRow: 6, soffitHeightFt: 61 } },

      }, { '302': [69, -26], '314': [69, -24], '312': [69, -22], '338': [70, -19] }), {
        '338': 41,
      }),
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/306'), rysCiti('sections/312'), rysCiti('sections/316'), rysCiti('sections/326'), rysCiti('sections/333'), rysCiti('sections/336'), RYS_CITI, CITI_LIDAR],
    },
    fourHundred: {
      label: '400 level',
      // Rows 1–8 (behind home 1–5), open to the sky (sourced). Lidar (29 of
      // 37): front row 69 ft (68–69), 29° rake (17–32; 411, 434 and 437 along
      // the median of their rows' fall lines; 409 and 431 straddle a bend,
      // their cuts across the rows); what rises highest
      // behind is the Promenade roof, 129 ft up and 30 ft back (25–45 ft;
      // each measured section takes its own).
      stand: { rows: 8, frontRowHeightFt: 69, rakeDeg: 29, backHeightFt: 129, backSetbackFt: 30 },
      sections: withRakes(withFronts(withBacks({ '415': { rows: 5 }, '425': { rows: 5 } }, {
        '437': [126, 24], '436': [127, 43], '434': [129, 29], '432': [129, 27], '431': [127, 30],
        '430': [129, 29], '426': [129, 27], '425': [129, 45], '424': [129, 35], '421': [129, 33],
        '420': [129, 33], '418': [128, 30], '417': [129, 29], '416': [129, 29], '415': [129, 39],
        '403': [129, 29], '404': [127, 25], '405': [129, 27], '406': [129, 27], '407': [129, 27],
        '408': [129, 34], '409': [128, 35], '410': [129, 34], '412': [129, 29],
        '427': [129, 29],
        '411': [129, 32],
      }), {
        '436': 68, '424': 68, '420': 68, '418': 68, '408': 68, '409': 68, '410': 68,
        '411': 68,
      }), {
        '436': 19,
      }),
      heightsSourced: true,
      coverSourced: true,
      sources: [rysCiti('sections/405'), rysCiti('sections/415'), rysCiti('sections/425'), rysCiti('sections/435'), RYS_CITI, CITI_LIDAR],
    },
    promenade: {
      label: 'Promenade level (500s)',
      // Rows 1–17, covered by the roof from row 11 (sourced; the lidar puts
      // its edge at row 10, and at row 8 in 503, 511 and 523). Lidar (34 of 38; 508–533
      // along their rows' fall line, 19–37° off the map's direction): front
      // row 86 ft (79–87), 32° rake (512, 513, 523, 534 and 537 straddle a
      // bend, their cuts across the rows); the roof's front edge is 129 ft up and
      // the scan shows nothing below 128 ft there: a thin roof, underside
      // taken as 128 ft. Behind 534, 535 and 537, where the scan sees no
      // edge over the rows, what rises highest stands 12–37 ft behind the
      // last row. Each measured section takes its own front row and back,
      // but for 537's front: its cut crosses the end of the stand at an
      // angle (a 17° rake, against 23–30°), so its run starts lower than
      // its first row.

      stand: {
        rows: 17,
        frontRowHeightFt: 86,
        rakeDeg: 32,
        backHeightFt: 129,
        backSetbackFt: -18,
        overhang: { coveredFromRow: 11, soffitHeightFt: 128 },
      },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['503', '511', '523'].map((id) => [id, { overhang: { coveredFromRow: 8, soffitHeightFt: 128 } }])),
      }, {
        '537': [127, 22], '535': [129, 37], '534': [129, 12], '533': [129, -20], '532': [129, -21],
        '530': [129, -20], '529': [129, -20], '527': [129, -20],
        '526': [129, -20], '524': [129, -20], '523': [129, -20], '522': [128, -13],
        '521': [129, -15], '520': [128, -18],
        '517': [127, -18],
        '502': [128, -16], '503': [129, -20], '504': [127, -18], '505': [129, -20],
        '506': [129, -20], '507': [129, -20], '508': [129, -16], '509': [129, -21],
        '511': [129, -20],
        '512': [129, -20],
        '513': [129, -20],
      }), {
        '535': 83, '534': 84, '529': 87, '524': 87,
        '523': 87, '522': 82, '521': 84, '503': 87, '505': 87,
        '508': 85, '509': 87, '511': 87,
        '532': 87,
        '527': 87,
        '526': 87,
        '525': 84,
        '520': 85,
        '518': 85,
        '517': 85,
        '516': 85,
        '502': 85,
        '504': 85,
        '512': 87,
      }), {
        '531': 31,
        '522': 31, '521': 31, '516': 31, '515': 31,
        '520': 31,
        '517': 30,
        '510': 30,
        '523': 31,
      }),
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
// front row at field level (-1 to 4 ft), 12° rake (11–12). The 200 deck's
// edge reaches out over row 28 (21–34), so the rows from there back are
// covered; the lowest structure at that edge is 35 ft up (26–44), taken as
// its underside. Seen from the middle of the open rows, what rises highest
// behind is mostly the Terrace Deck roof, 132 ft up and 35 ft behind the
// last row (the median); in four sections the 200 level's front (70 ft), in
// 108–111 the right-field roof (117 ft). Each measured section takes its own.
const CBP_FIELD: StandProfile = {
  rows: 40,
  frontRowHeightFt: 0,
  rakeDeg: 12,
  backHeightFt: 132,
  backSetbackFt: 35,
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
 * as seen from the middle uncovered row; tier values are medians, and every
 * measured section takes its own front row and back (but for the Diamond
 * Club's front, carried from the dugout boxes' slope), and its own
 * rake where the scan sees 9 or more of its rows and the cuts beside it agree
 * (119's cut runs down an aisle's steps, so it takes the front row of the
 * cuts beside it). Each cut runs along the rows' fall line: where that is
 * firmly more than 15° off the club map's direction, the section faces it,
 * or where its rows bend across its width the median of the fall lines in
 * its middle and 4 m to either side (its section file's standRuns); one
 * whose fall lines lie either side of the map's direction keeps it and its
 * tier's rake. The light
 * towers above
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
      // row 5 at ~1 ft (2 ft in A and G, at their own 13°; the scan's run
      // starts at the dugout boxes' front, so each section's measured front
      // is theirs, not row 5's); behind, the
      // Terrace Deck roof, 133 ft up and 99 ft back (84–103 ft, each
      // measured section its own).
      stand: { rows: 15, frontRowHeightFt: 1, rakeDeg: 11, backHeightFt: 133, backSetbackFt: 99 },
      sections: withRakes(withFronts(withBacks({}, { 'B': [132, 103], 'G': [132, 84], 'F': [133, 101], 'A': [133, 88] }), {
        'A': 2, 'G': 2,
      }), {
        'G': 13, 'F': 10, 'E': 10, 'C': 10, 'A': 13,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/A'), rysCbp('sections/C'), rysCbp('sections/E'), rysCbp('sections/G'), CBP_LIDAR],
    },
    homePlate: {
      label: 'Field level behind home (119–128)',
      // Rows 21–34 behind the Diamond Club, covered from row 29 or 30
      // (sourced; the lidar puts the 200 level's edge at the 7th–9th row
      // too, and at the 3rd in 121, which takes it; along 126's rows the
      // scan puts an edge over its 5th row with nothing under it the scan
      // can place, so 126 keeps the source's). Lidar (9 of 10): row 21
      // at 13 ft (11–19; 122 and 125 start at row 24), 13° rake; what rises
      // highest behind is the 200 level's front (45 ft; 30–70; each measured
      // section takes its own, 121 the one measured before the scan's cover
      // left it too few open rows to find). The lowest structure at that
      // deck's edge is 35 ft up (29 ft over 121), taken as its underside.
      stand: { rows: 14, frontRowHeightFt: 13, rakeDeg: 13, backHeightFt: 45, backSetbackFt: -11, deckFrontFt: 44, overhang: { coveredFromRow: 9, soffitHeightFt: 35 } },
      sections: withFronts(withBacks({
        '119': { overhang: { coveredFromRow: 11, soffitHeightFt: 35 } }, // rows 21–31, covered from 31
        '121': { backHeightFt: 30, backSetbackFt: -26, overhang: { coveredFromRow: 3, soffitHeightFt: 29 } },
        '122': { overhang: { coveredFromRow: 7, soffitHeightFt: 35 } }, // rows 24–34, from 30
        '123': { overhang: { coveredFromRow: 10, soffitHeightFt: 35 } },
        '124': { overhang: { coveredFromRow: 10, soffitHeightFt: 35 } },
        '125': { overhang: { coveredFromRow: 7, soffitHeightFt: 35 } }, // rows 24–34, from 30
      }, {
        '120': [70, -11], '119': [45, -8], '125': [40, 25], '122': [45, -20], '123': [45, -18],
        '124': [44, -18], '126': [70, -10], '127': [70, -11],
      }), {
        '125': 19, '122': 16, '124': 12,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['119', '120', '122', '124', '126', '128'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    field: {
      label: 'Field level (100s)',
      stand: { ...CBP_FIELD, deckFrontFt: 44 },
      // Each measured section takes its own back (see CBP_FIELD).
      sections: withRakes(withFronts(withBacks({
        '108': { overhang: { coveredFromRow: 21, soffitHeightFt: 35 } }, // rows 11–35
        '109': { overhang: { coveredFromRow: 23, soffitHeightFt: 35 } },
        '115': { overhang: { coveredFromRow: 28, soffitHeightFt: 30 } },
        '118': { overhang: { coveredFromRow: 25, soffitHeightFt: 35 } },
        '129': { overhang: { coveredFromRow: 23, soffitHeightFt: 30 } },
        '133': { overhang: { coveredFromRow: 31, soffitHeightFt: 30 } },
        '134': { deckFrontFt: undefined, overhang: { coveredFromRow: 34, soffitHeightFt: 28 } }, // 9 ft above row 34's floor; something lower than the deck at its edge
        // RYS covers only the wheelchair row behind row 37; the lidar puts
        // the deck's edge over row 34.
        '135': { overhang: { coveredFromRow: 34, soffitHeightFt: 35 } },
        '136': { overhang: { coveredFromRow: 30, soffitHeightFt: 35 } },
        '138': { overhang: { coveredFromRow: 21, soffitHeightFt: 35 } },
        // Rows 11–37, covered from 33; not found in the scan, so row 11 is
        // put on the measured slope and the source's covered row kept.
        '139': { frontRowHeightFt: 6, overhang: { coveredFromRow: 23, soffitHeightFt: 35 } },
      }, {
        '132': [133, 28], '115': [133, 29], '117': [70, -16], '118': [70, -6], '129': [132, 40],
        '130': [70, -16], '131': [133, 42], '134': [133, 48], '135': [132, 52], '136': [132, 42],
        '108': [117, 45], '109': [117, 16], '110': [117, 25], '111': [117, 39], '116': [133, 45],
        '133': [133, 38], '137': [133, 32], '138': [70, -44],
      }), {
        '115': -1, '117': 1, '118': 1, '129': 1, '130': 1, '134': -1, '135': -1, '136': -1, '108': 4,
        '109': 2, '111': -1, '116': -1, '133': -1, '137': -1, '138': 4,
      }), {
        '134': 11, '133': 11,
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
      // agrees: front row 1 ft below the field, 12°). Each takes its own
      // back: behind 112's 37 rows the 200 level's front stands 24 ft back,
      // over 113's last row 4 ft in front; from 114's open rows the Terrace
      // Deck roof rises highest.
      stand: { ...CBP_FIELD, deckFrontFt: 44 },
      sections: withRakes(withFronts(withBacks({
        '112': { overhang: { coveredFromRow: 34, soffitHeightFt: 35 } },
        '113': { overhang: { coveredFromRow: 34, soffitHeightFt: 35 } },
      }, { '112': [69, 24], '113': [70, -4], '114': [133, 29] }), { '112': -1, '113': -1, '114': -1 }), {
        '113': 11,
      }),
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
      // front, 45 ft up (10 ft in front of the last row of the 13-row 107,
      // over its row 10 where the scan sees the edge over row 9, measured).
      // Its underside: that front row less this park's measured deck depth
      // (9 ft), ~35 ft. The 200 level ends at 101: its
      // front stands 6 ft behind 101's last row at the side next to 102,
      // and nothing near behind the rest; through its middle, what rises
      // highest is 72 ft up, 121 ft behind (its cut, on a point the tool's
      // line from home misses). Each measured section takes its own back.
      stand: { rows: 16, frontRowHeightFt: 10, rakeDeg: 13, backHeightFt: 45, backSetbackFt: -19, deckFrontFt: 44, overhang: { coveredFromRow: 11, soffitHeightFt: 35 } },
      sections: withRakes(withFronts(withBacks({ '101': { noCover: true, backHeightFt: 72, backSetbackFt: 121 } }, {
        '102': [45, -17], '104': [45, -20], '105': [45, -21], '107': [45, -10],
      }), {
        '107': 9,
      }), {
        '107': 17,
      }),
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
      // covered; that edge is what rises highest behind (38 ft, 13 ft in
      // front of the last row). Its underside: the 200 level's 37-ft front
      // row less 9 ft, ~28 ft. Past the 200 level's end, behind 147 a
      // structure 26 ft up stands right behind its last row, and over 148.
      // Each measured section takes its own back.
      stand: { rows: 23, frontRowHeightFt: 8, rakeDeg: 13, backHeightFt: 38, backSetbackFt: -13, deckFrontFt: 37, overhang: { coveredFromRow: 16, soffitHeightFt: 28 } },
      sections: withFronts(withBacks({
        '140': { noCover: true }, // rows 7–21
        '145': { overhang: { coveredFromRow: 13, soffitHeightFt: 33 } },
        '146': { noCover: true },
        '147': { noCover: true }, // rows 4–18
        '148': { overhang: { coveredFromRow: 8, soffitHeightFt: 25 } }, // rows 5–16
      }, {
        '143': [38, -16], '144': [38, -16], '148': [26, -9], '147': [26, 1], '146': [43, 43],
        '140': [49, 30], '142': [39, -20], '141': [39, -20],
      }), {
        '148': 12, '147': 10, '140': 11,
      }),
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
      sections: withFronts(withBacks({}, { '202': [70, -17], '201': [96, 111], '205': [70, -12] }), {
        '201': 44, '205': 44,
      }),
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
      // face, 54 ft up; 62 ft over 206 and 208, 9 ft above row 8's floor; 61
      // over 207, whose own front row sits a foot higher).
      // Each measured section takes its own back.
      stand: { rows: 10, frontRowHeightFt: 44, rakeDeg: 24, backHeightFt: 70, backSetbackFt: -14, deckFrontFt: 69, overhang: { coveredFromRow: 3, soffitHeightFt: 60 } },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['206', '208'].map((n) => [n, { overhang: { coveredFromRow: 8, soffitHeightFt: 62 } }])),
        '207': { overhang: { coveredFromRow: 7, soffitHeightFt: 61 } },
        '209': { overhang: { coveredFromRow: 7, soffitHeightFt: 60 } },
        '210': { noCover: true }, // its 12 rows open: the 300 level's front 2 ft behind them
        '211': { noCover: true },
        '216': { overhang: { coveredFromRow: 1, soffitHeightFt: 54 } },
        '219': { overhang: { coveredFromRow: 5, soffitHeightFt: 60 } },
        ...Object.fromEntries(cbpRange(220, 224).map((n) => [n, { overhang: { coveredFromRow: 5, soffitHeightFt: 63 } }])),
      }, {
        '235': [70, -19], '215': [70, -25], '234': [70, -19], '229': [70, -22], '226': [70, -22],
        '219': [70, -9], '223': [73, -9], '222': [74, -9], '221': [73, -9], '220': [73, -9],
        '224': [73, -9], '217': [70, -22], '227': [70, -11], '216': [70, -19], '236': [70, -19],
        '210': [69, 2],
      }), {
        '235': 45, '229': 45, '228': 45, '226': 45, '219': 43, '222': 45, '207': 45, '210': 42,
      }), {
        '210': 22,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['207', '209', '211', '212', '216', '220', '222', '226', '228', '232', '233', '237'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    leftField200: {
      label: '200 level, left field (241–245)',
      // Rows 1–11, open (sourced). Lidar (5 of 5): front row 38 ft (35–38),
      // 22° rake; what rises highest behind is the building behind them,
      // 56 ft up (49–67; each measured section its own). The main
      // scoreboard above them is a board on one pylon, 166–195 ft up, which
      // light passes under.
      stand: { rows: 11, frontRowHeightFt: 38, rakeDeg: 22, backHeightFt: 56, backSetbackFt: 16 },
      sections: withFronts(withBacks({}, { '245': [53, 135], '244': [49, 1], '242': [57, 7], '241': [67, 52] }), {
        '245': 35,
      }),
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
      // Lidar (9 of 10; 306 along its rows' fall line, 47° off the map's
      // direction): front row 70 ft (66–70), 29° rake; the roof's edge
      // reaches out over row 11 (14 in 305), so the rows from
      // there back are covered; its top, 117 ft up, is what rises highest
      // behind, and the scan sees nothing below it there: a thin roof,
      // underside taken as 117 ft.
      stand: { rows: 21, frontRowHeightFt: 70, rakeDeg: 29, backHeightFt: 117, backSetbackFt: -26, overhang: { coveredFromRow: 11, soffitHeightFt: 117 } },
      sections: withRakes(withFronts(withBacks({
        '305': { overhang: { coveredFromRow: 14, soffitHeightFt: 117 } },
      }, { '305': [117, -16], '308': [117, -27], '302': [87, -26], '301': [19, 196] }), {
        '305': 66,
        '307': 69,
        '309': 69,
        '308': 69,
      }), {
        '305': 27, '302': 30, '301': 30,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['301', '303', '305', '307', '310'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP, CBP_LIDAR],
    },
    threeHundred: {
      label: '300 level (312–333)',
      // Rows 1–8, open (sourced). Lidar (21 of 22; 318 and 330, on bends,
      // along the median of their rows' fall lines, where 318's run starts
      // at its first row): front row 69 ft (68–72), 31° rake; what rises highest behind is the Terrace Deck roof, 133 ft
      // up and 25 ft back (24–40 ft; behind 314, 315 and 333 the Terrace
      // Deck's front, 90–91 ft; each measured section takes its own).
      stand: { rows: 8, frontRowHeightFt: 69, rakeDeg: 31, backHeightFt: 133, backSetbackFt: 25 },
      sections: withFronts(withBacks({}, {
        '313': [133, 29], '328': [133, 30], '315': [90, 2], '314': [90, 2], '317': [133, 30],
        '322': [133, 34], '320': [132, 29], '318': [133, 21], '324': [133, 30], '316': [133, 24],
        '329': [133, 24], '331': [133, 30], '332': [133, 32], '312': [132, 24],
        '333': [91, 2],
      }), {
        '314': 70, '326': 70, '319': 72, '320': 72, '327': 70, '333': 70,
        '318': 72,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['313', '315', '318', '320', '324', '328', '331', '333'].map((n) => rysCbp(`sections/${n}`)), CBP_LIDAR],
    },
    terrace: {
      label: 'Terrace Deck (400s)',
      // Rows 1–16 (434: 13). Rate Your Seats counts them under the roof from
      // row 9. Lidar (23 of 23; 430 along its rows' fall line, 45° off the
      // map's direction): front row 90 ft (87–91), 33° rake; the
      // roof's edge reaches out over row 6, so the rows from there
      // back are covered; its top is 133 ft up and the scan sees nothing
      // below 132 ft there: a thin roof, underside taken as 132 ft.
      stand: { rows: 16, frontRowHeightFt: 90, rakeDeg: 33, backHeightFt: 133, backSetbackFt: -25, overhang: { coveredFromRow: 6, soffitHeightFt: 132 } },
      sections: withRakes(withFronts(withBacks({}, {
        '432': [132, -25], '426': [131, -27], '424': [132, -25], '421': [133, -23],
        '420': [133, -23], '419': [133, -23], '418': [132, -25], '414': [92, 48], '413': [133, -27],
        '429': [132, -25], '412': [132, -28], '434': [132, -17],
        '433': [132, -25],
      }), {
        '432': 89, '421': 89, '420': 89, '419': 89, '418': 89,
      }), {
        '417': 32, '416': 32,
      }),

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
 * as seen from the middle uncovered row; tier values are medians, and every
 * measured section takes its own front row and back, and its own rake where
 * the scan sees 9 or more of its rows and the cuts beside it agree. Each cut
 * runs along the rows' fall line: where that is firmly more than 15° off the
 * club map's direction, the section faces it, or where its rows bend across
 * its width the median of the fall lines in its middle and 4 m to either
 * side (its section file's standRuns); one whose fall lines lie either side
 * of the map's direction keeps it and its tier's rake. Behind
 * home the cuts through 8, 123, 124, 126, 135 and 137 run down an aisle's
 * steps (starting ~3 ft low and climbing at ~30° before the rows' 13–14°),
 * so those take the tier's rake and the front row of the cuts beside them. Every deck is lower than
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
      // Rows 1–4 or 1–5 at the backstop, uncovered. Lidar (7 of 9): front
      // row 2 ft (0–2; 8 takes the front row of the cuts beside it, 1 ft:
      // its own cut ran down an aisle, and along its rows' fall line its run
      // goes on into the stand behind, so it isn't measured), 11° rake
      // (8–15); what rises highest behind is the canopy, 150 ft up and 76 ft
      // behind the last row (68–89 ft, each measured section its own; over 7
      // a lamp bank on it, 157 ft; behind 9, the canopy's edge, 158 ft).
      stand: { rows: 4, frontRowHeightFt: 2, rakeDeg: 11, backHeightFt: 150, backSetbackFt: 76 },
      sections: withFronts(withBacks({}, {
        '3': [150, 86], '4': [150, 80], '7': [157, 76],
        '1': [150, 73], '5': [150, 75], '9': [158, 68],
        '6': [151, 76],
      }), {
        '3': 1, '7': 0, '8': 1,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('1', '5', '9'), TRUIST_LIDAR],
    },
    fieldInfield: {
      label: 'Field level (17–34)',
      // Rows 6–13 behind the dugouts and the club boxes, uncovered. Lidar (17
      // of 18): row 6 at 2 ft (0–3), 11° rake (10–15); behind, the canopy,
      // 151 ft up and 65 ft back (58–75 ft, each measured section its own;
      // 156–160 ft where its cut crosses a lamp bank on the canopy).
      stand: { rows: 8, frontRowHeightFt: 2, rakeDeg: 11, backHeightFt: 151, backSetbackFt: 65 },
      sections: withFronts(withBacks({}, {
        '25': [151, 70], '24': [150, 70], '21': [150, 75], '20': [159, 62], '19': [150, 66],
        '18': [150, 65], '17': [156, 60], '23': [150, 71], '29': [157, 66], '26': [151, 63],
        '28': [157, 65], '34': [160, 58], '33': [160, 58], '32': [157, 58], '31': [150, 66],
        '30': [157, 65],
      }), {
        '25': 0, '24': 1, '20': 3, '17': 3, '23': 0, '29': 1, '34': 3, '33': 3,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('17', '22', '25', '30', '34'), TRUIST_LIDAR],
    },
    fieldBoxes: {
      label: 'Field level (10–16, 35–42)',
      // Rows 1–13 (1–15 in 10 and 42), uncovered. Lidar (9 of 15): front row
      // at field level (-1 to 3; 10 at 3), 12° rake (11–15; the cuts through
      // 15 and 16, 8°, are off those beside them); behind, the
      // canopy, 149 ft up and 68 ft back (in 10 and 11, by the right-field
      // corner, the 300 level's corner, 92–103 ft; each measured section
      // takes its own).
      stand: { rows: 13, frontRowHeightFt: 0, rakeDeg: 12, backHeightFt: 149, backSetbackFt: 68 },
      sections: withRakes(withFronts(withBacks({ '10': { frontRowHeightFt: 3 } }, {
        '41': [150, 70], '42': [149, 60], '10': [92, 58], '11': [103, 88], '14': [150, 66],
        '15': [150, 66], '16': [150, 68], '39': [149, 80], '40': [149, 78],
      }), {
        '41': -1, '42': 3, '10': 3,
      }), {
        '42': 14, '10': 15, '14': 11, '39': 11,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('10', '12', '16', '35', '42'), TRUIST_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      // Rows 1–20; 110–118, 122, 130 and 133–143 are under cover from row 8.
      // Each measured section takes its own back: the canopy from 5 ft in
      // front of the last row to 21 ft behind it (over 140 the 200 level's
      // front, 35 ft up). The cuts through 135 and 137 run down an aisle's
      // steps, so they take the front row of the cuts beside them (10 ft,
      // the tier's).
      stand: { ...TRUIST_100, deckFrontFt: 35 },
      sections: withFronts(withBacks({}, {
        '122': [150, 15],
 '130': [157, -5], '111': [160, 3], '141': [149, 16], '140': [35, -39],
        '113': [150, 7], '114': [150, 2], '137': [157, 0], '135': [157, 0], '133': [160, -3],
      }), {
        '122': 6,
      }),
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
      // in the rest of the 100s. Each takes its own back.
      stand: { ...TRUIST_100, deckFrontFt: 35 },
      sections: withFronts(withBacks({}, { '120': [150, 2], '131': [153, -5] }), {
        '120': 9,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...truistSections('120', '131'), TRUIST_LIDAR],
    },
    executive: {
      label: 'Executive seats (123–128)',
      // Rows 1–11 behind home under the club level; no source gives the
      // covered rows (only "rows 8+ shaded late afternoon"). Lidar (6 of 6):
      // front row 10 ft, 14° rake (13–14), from 125, 127 and 128; the cuts
      // through 123, 124 and 126 run down an aisle's steps (front row 6–7
      // ft, 21°), so those take the tier's rake and the front row of the
      // cuts beside them (9–10 ft). The 200 level's front, 35 ft
      // up, reaches out over row 6–8, so the rows from 8 back are covered,
      // under an underside of ~26 ft (that front row less 9 ft). Behind, the
      // canopy, 151 ft up and 26 ft back (21–43 ft, each its own).
      stand: { rows: 11, frontRowHeightFt: 10, rakeDeg: 14, backHeightFt: 151, backSetbackFt: 26, deckFrontFt: 34, overhang: { coveredFromRow: 8, soffitHeightFt: 26 } },
      sections: withFronts(withBacks({}, {
        '123': [151, 28], '124': [149, 43], '125': [151, 25], '126': [150, 28], '127': [151, 25],
        '128': [157, 21],
      }), {
        '123': 9,
      }),
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
      sections: withRakes(withFronts(withBacks({
        '151': { overhang: { coveredFromRow: 25, soffitHeightFt: 43 } },
      }, { '151': [80, 0], '150': [40, 27], '149': [41, 25], '147': [38, 14], '148': [100, 9] }), {
        '150': 6, '149': 6, '147': 9,
      }), {
        '148': 12,
      }),
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
      // a wall either). 154 sees 63 ft, 70 ft back; each of the others
      // takes its own back too.
      stand: { rows: 24, frontRowHeightFt: 21, rakeDeg: 20, backHeightFt: 60, backSetbackFt: 35 },
      sections: withFronts(withBacks({ '155': { frontRowHeightFt: 15 } }, { '152': [175, 81], '154': [63, 70], '155': [44, 1] }), {
        '155': 15,
      }),

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
      sections: withFronts({
        '159': { backHeightFt: 44, backSetbackFt: 2 },
        '160': { backHeightFt: 92, backSetbackFt: 62 },
      }, {
        '159': 17,
      }),
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
      // over their last row or two). Lidar (3 of 3; 211 and 212, on a bend,
      // along the median of their rows' fall lines): front row 35 ft
      // (34–35), 23° rake (210 and 212; along 211's rows its run starts five
      // rows up the slope, so it keeps the front row and back measured
      // before, 34 ft and the canopy 21 ft behind); behind, the canopy, 150
      // ft up (in 210 the 300 level's corner, 92 ft; 159 ft, 4 ft behind
      // 212's last row; each its own).
      stand: { rows: 12, frontRowHeightFt: 35, rakeDeg: 23, backHeightFt: 150, backSetbackFt: 20 },
      sections: withRakes(withFronts(withBacks({}, { '210': [92, 20], '211': [158, 21], '212': [159, 4] }), {
        '211': 34,
      }), { '210': 24 }),
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
      // where the scan also sees the 300 level's front from row 11; each
      // measured section takes its own back.)
      stand: { rows: 19, frontRowHeightFt: 36, rakeDeg: 24, backHeightFt: 150, backSetbackFt: -16, deckFrontFt: 67, overhang: { coveredFromRow: 14, soffitHeightFt: 61 } },
      sections: withRakes(withFronts(withBacks({}, {
        '243': [150, -5], '235': [150, -17], '214': [150, -19], '216': [150, -19], '213': [150, -12],
        '215': [150, -14], '218': [150, -15], '238': [157, -24],
      }), {
        '213': 35, '215': 35, '218': 35,
        '243': 35,
      }), {
        '218': 25,
        '243': 25,
      }),
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
      sections: withFronts(withBacks({
        '231': { overhang: { coveredFromRow: 11, soffitHeightFt: 154 } },
      }, {
        '228': [151, 12], '230': [157, 11], '226': [150, 14], '222': [150, 24], '220': [150, 2],
        '231': [157, -2],
      }), {
        '226': 35, '223': 35, '222': 35, '220': 35,
      }),

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
      // front row 68 ft, 28° rake; behind, the canopy, 149 ft up, over rows
      // 6–9. The 400 level's underside, unseen: 9 ft above row 10's floor,
      // 90 ft. 315's 10 rows end at that row 10 (covered from it like the
      // rest), so the canopy stands 14 ft in front of its last row.
      stand: { rows: 13, frontRowHeightFt: 68, rakeDeg: 28, backHeightFt: 149, backSetbackFt: -22, overhang: { coveredFromRow: 10, soffitHeightFt: 90 } },
      sections: withBacks({ '315': { backSetbackFt: -14 } }, { '323': [149, -20] }),
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
      sections: withBacks({}, { '324': [149, -7] }),

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
// In the right-field corner the 200 level's edge runs at about 45° to the
// rows, so the covered row changes across a section. Along 130's rows' fall
// line, through its middle, the edge is over row 8; it keeps Rate Your
// Seats' row 17, whose late-afternoon light on rows 17 on (checked in
// buschShadeReference) a deck from row 8 would not let in.
const BUSCH_100_SCAN_COVER: Record<string, number> = {
  '131': 11, '132': 15, '163': 22, '167': 22,
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
 * as seen from the middle uncovered row; tier values are medians, and every
 * measured section takes its own front row and back, and its own rake where
 * the scan sees 9 or more of its rows and the cuts beside it agree. Each cut
 * runs along the rows' fall line: where that is firmly more than 15° off the
 * club map's direction, the section faces it, or where its rows bend across
 * its width the median of the fall lines in its middle and 4 m to either
 * side (its section file's standRuns); one whose fall lines lie either side
 * of the map's direction keeps it and its tier's rake. The
 * stacking estimates were close above the field (the 200 level's front 48
 * ft, the Pavilion's 75, the Terrace's 97); the field rows and the 100s start lower and rake
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
      // row at field level, 14° rake (7's; 3's cut, 6°, is off the cuts
      // beside it, 11°); what rises highest behind is the
      // roof over the 400s, 133 ft up and 117 ft back.
      stand: { rows: 3, frontRowHeightFt: 0, rakeDeg: 14, backHeightFt: 133, backSetbackFt: 117 },
      sections: withBacks({}, { '3': [133, 119], '7': [133, 116] }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [BUSCH_CLUB_MAP, BUSCH_LIDAR],
    },
    fieldBoxes: {
      label: 'Field boxes (lettered rows)',
      // Rows A–L (fewer in some) in front of the 100s, open. Lidar (13 of
      // 26): front row at field level (-1 to 2), 9° rake (6–10; 136D, 137D
      // and 163D along the median of their rows' fall lines; 138D–140D and
      // 143D's cuts are off those beside them, and along 136D's rows its run
      // starts 2 ft off theirs, so it keeps its front row); behind, the
      // roof over the 400s, 133 ft up and 111 ft back (the median before
      // the bend boxes turned: along their rows 136D, 137D and 163D see it
      // nearer, 88–99 ft, which the unmeasured boxes don't, and Rate Your
      // Seats' sun on the lower bowl at a July midday holds at 111; down the first-base
      // line the Pavilion's corners, 76–115 ft). Each measured section takes
      // its own back.
      stand: { rows: 12, frontRowHeightFt: 0, rakeDeg: 9, backHeightFt: 133, backSetbackFt: 111 },
      sections: withRakes(withFronts(withBacks({}, {
        '703D': [115, 124], '138D': [133, 93], '140D': [133, 89],
        '144D': [133, 114], '163D': [116, 96], '164D': [116, 98],
        '165D': [116, 96], '166D': [116, 106],
        '136D': [133, 88],
        '139D': [133, 112],
        '143D': [133, 112],
        '137D': [133, 99],
      }), {
        '703D': 2, '139D': -1, '140D': 1, '163D': -1, '164D': -1, '165D': -1, '166D': -1,
        '137D': -1,
      }), { '137D': 10 }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('132', '135', '140', '142', '155', '158', '161', '167'), BUSCH_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      // Numbered rows; covered by the 200 level from row 21 (128–140), row 24
      // (141–158) or row 20 (160–167), and from row 8 in 170–171 (Rate Your
      // Seats); in four sections the lidar puts its edge more than two rows
      // off and its row is used (BUSCH_100_SCAN_COVER; 131 covered from row
      // 11). Sections whose rows stop before the deck (tunnel sections such
      // as 136, 146, 151, 154) are open. Lidar (32 of 46): front row 4 ft (3–14; 8–14 in
      // the right-field corner, 127–131), 13° rake (7–17; 135, 136, 162 and
      // 165 along the median of their rows' fall lines); what rises
      // highest behind is the roof over the 400s, 133 ft up and 34 ft
      // behind the last row (down the lines the Pavilion, 48–116 ft). That
      // is the median before the bend sections turned: along their rows
      // 135, 136 and 165 see the roof nearer (16–45 ft), pulling it to 30
      // ft, but they aren't like the unmeasured sections down the line that
      // take the tier's, and Rate Your Seats' March check on 157 and 158
      // holds at 34.
      // Each measured section takes its own back (the same roof 6–33 ft
      // behind the 28–29 row sections behind home, 45–70 ft behind the
      // tunnel sections, which end sooner).
      stand: { rows: 26, frontRowHeightFt: 4, rakeDeg: 13, backHeightFt: 133, backSetbackFt: 34, deckFrontFt: 47 },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(Object.entries(BUSCH_100_ROWS).map(([id, row]) => [id, { overhang: { coveredFromRow: row, soffitHeightFt: BUSCH_100_SOFFIT_FT } }])),

      }, {
        '127': [117, 84], '128': [117, 75], '129': [117, 70], '130': [48, -47], '131': [76, -9],
        '132': [133, 6], '133': [133, 22], '134': [133, 21], '135': [133, 16], '136': [133, 45],
        '137': [133, 21], '138': [133, 50], '139': [133, 24], '140': [133, 21], '146': [133, 45],
        '147': [133, 53], '148': [133, 33], '150': [133, 29], '151': [133, 53],
        '152': [133, 26], '153': [133, 27], '162': [75, 4], '163': [116, 21], '164': [87, 66],
        '165': [116, 18], '166': [116, 45], '167': [116, 21], '168': [116, 50], '154': [133, 48],
        '141': [133, 35],
        '155': [133, 35],
        '149': [133, 30],
      }), {
        '127': 14, '128': 8, '129': 8, '130': 12, '131': 11, '132': 8,
        '137': 5, '146': 5, '147': 3, '148': 3, '152': 5, '153': 5, '155': 3, '162': 5, '164': 3,
        '154': 5,
      }), {
        '152': 11, '163': 12, '164': 11,
        '128': 14,
        '129': 14,
        '132': 12,
        '133': 12,
        '137': 12,
        '139': 12,
        '146': 12,
        '147': 12,
        '149': 12,
        '150': 12,
        '151': 12,
        '153': 12,
        '155': 12,
        '154': 12,
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
      // 52 ft back, the median; each measured section takes its own). Over
      // 189's first three rows a deck of seats 47 ft up; its other rows show
      // uncovered behind it. Behind 189, 195 and 197 what rises highest is
      // 75–80 ft up and 134–188 ft back.
      stand: { rows: 20, frontRowHeightFt: 7, rakeDeg: 18, backHeightFt: 80, backSetbackFt: 52 },
      sections: withRakes(withFronts(withBacks({}, {

        '101': [56, 30], '103': [97, 50], '105': [97, 55], '107': [104, 34], '109': [43, 17],
        '189': [80, 187], '195': [75, 134], '197': [79, 188],
      }), {
        '103': 6, '109': 13,
      }), {
        '101': 16, '105': 17, '195': 20, '197': 20,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('101', '107', '111', '189', '193', '197'), BUSCH_LIDAR],
    },
    loge: {
      label: 'Loge (228–240, 261–272)',
      // Rows 1–10 to 1–16. "The last few rows ... are among the best shaded
      // seats on the 200 level, thanks to the overhang above"; no source
      // gives the row. Lidar (13 of 20): front row 48 ft (47–52), 25° rake
      // (19–25; 229–231 and 271 along the median of their rows' fall
      // lines); the Pavilion's front, 74–75 ft up, reaches out over row 5
      // (3–6; row 11–12 in 265–272), so the rows from there back are
      // covered, under an underside of ~67 ft (that front row less this
      // park's measured 7-ft deck depth; over row 11–12, 70–71 ft, 9 ft
      // above its floor). What
      // rises highest behind is that front edge (in 267–272 the roof over
      // the 400s, 115–116 ft). Each measured section takes its own back (231,
      // 240 and 261, whose deck edge is over row 3–4, 23–25 ft in front; that
      // roof 5–7 ft in front of the last row of 271 and 272).
      stand: { rows: 10, frontRowHeightFt: 48, rakeDeg: 25, backHeightFt: 76, backSetbackFt: -17, deckFrontFt: 74, overhang: { coveredFromRow: 5, soffitHeightFt: 67 } },
      sections: withFronts(withBacks({
        ...Object.fromEntries(['265', '267', '272'].map((id) => [id, { overhang: { coveredFromRow: 11, soffitHeightFt: 70 } }])),
        ...Object.fromEntries(['268', '269'].map((id) => [id, { overhang: { coveredFromRow: 12, soffitHeightFt: 71 } }])),
      }, {
        '230': [76, -18], '231': [74, -28], '233': [75, -17], '240': [75, -23],
        '261': [76, -25], '265': [116, 1], '267': [116, 1], '268': [116, 3], '269': [116, -4],
        '271': [116, -11], '272': [116, -5],
      }), {
        '271': 53,
      }),
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
      // front edge, 26 ft in front of the last row (11 ft in the 8-row 249
      // and 251, 16 ft in the 9-row 250 and 258; each measured section takes
      // its own).
      stand: { rows: 15, frontRowHeightFt: 48, rakeDeg: 24, backHeightFt: 76, backSetbackFt: -26, deckFrontFt: 75, overhang: { coveredFromRow: 4, soffitHeightFt: 67 } },
      sections: withFronts(withBacks({ '260': { overhang: { coveredFromRow: 1, soffitHeightFt: 67 } } }, {
        '244': [75, -31], '245': [76, -31], '246': [76, -31], '247': [76, -22], '248': [76, -31],
        '249': [76, -11], '250': [76, -16], '251': [76, -11], '252': [76, -32], '253': [76, -31],
        '254': [76, -31], '255': [76, -22], '256': [76, -32], '257': [76, -22], '258': [76, -16],
        '259': [76, -22],
      }), {
        '250': 49, '252': 49, '256': 49,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('241', '249', '250', '257', '258', '259', '260'), BUSCH_LIDAR],
    },
    pavilion: {
      label: 'Pavilion (331–360)',
      // Rows 1–6 or 1–9, open ("among the most exposed"). Lidar (27 of 27):
      // front row 75 ft (74–76), 31° rake (28–33); what rises highest behind
      // is the roof over the 400s, 133 ft up and 9 ft back (97–117 ft at
      // the ends; each measured section takes its own). The Terrace's front,
      // 97 ft up, is over the last row of the 9-row sections.
      stand: { rows: 9, frontRowHeightFt: 75, rakeDeg: 31, backHeightFt: 133, backSetbackFt: 9 },
      sections: withRakes(withFronts(withBacks({}, {
        '350': [133, 11], '331': [133, 11], '332': [133, 2], '333': [133, 2], '334': [133, 12],
        '335': [133, 4], '337': [133, 1], '339': [133, 4], '340': [133, 11], '341': [133, 11],
        '342': [133, 2], '344': [133, 2], '345': [133, 4], '346': [133, 2], '347': [133, 11],
        '349': [133, 11], '352': [133, 11], '354': [133, 1], '355': [133, 1], '356': [133, 2],
        '357': [97, 7], '358': [117, 55], '359': [116, 48], '360': [106, 27],
      }), {
        '339': 74, '344': 76, '351': 76, '354': 76, '355': 76, '357': 76,
        '337': 76,
      }), {
        '333': 30, '335': 29, '345': 30, '356': 30,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [...buschSections('331', '341', '345', '350', '355', '360'), BUSCH_LIDAR],
    },
    pavilionLeft: {
      label: 'Pavilion, left field (361–372)',
      // Rows 1–14, covered from row 8 (sourced; the scan sees no edge over
      // the rows of 363 and 365). Lidar (2 of 9): front row 75 ft, 31° rake;
      // what rises highest behind is 116 ft up, 32 ft back in 365 and 98 ft
      // in 363 (each its own); the tier takes 365's, not the two's 107-ft
      // median, which neither section has. Estimated: roof underside ~96 ft
      // (9 ft above row 8's floor).
      stand: { rows: 14, frontRowHeightFt: 75, rakeDeg: 31, backHeightFt: 115, backSetbackFt: 32, overhang: { coveredFromRow: 8, soffitHeightFt: 96 } },
      sections: withBacks({}, { '363': [98, 35], '365': [116, 32] }),
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
      sections: withBacks(Object.fromEntries(['449', '450', '451', '454'].map((id) => [id, { overhang: { coveredFromRow: 1, soffitHeightFt: 133 } }])), { '454': [133, -26] }),

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
 * as seen from the middle uncovered row; tier values are medians, and every
 * measured section takes its own front row and back, and its own rake where
 * the scan sees 9 or more of its rows and the cuts beside it agree. Each cut
 * runs along the rows' fall line: where that is firmly more than 15° off the
 * club map's direction, the section faces it, or where its rows bend across
 * its width the median of the fall lines in its middle and 4 m to either
 * side (its section file's standRuns); one whose fall lines lie either side
 * of the map's direction keeps it and its tier's rake. The
 * pavilion and the mezzanine keep the rake of the sections measured before
 * (six and two), some of which the tool no longer finds. The scan (2014) is
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
      // up and 107 ft back (98–116 ft, each measured section its own).
      stand: { rows: 12, frontRowHeightFt: 0, rakeDeg: 10, backHeightFt: 135, backSetbackFt: 107 },
      sections: withRakes(withFronts(withBacks({}, { 'A': [134, 107], 'C': [135, 116], 'D': [134, 107], 'E': [142, 99], 'B': [135, 103] }), { 'A': -1 }), {
        'B': 9, 'D': 9,
      }),
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
      // ft behind HP119 and HP120; each measured section takes its own).
      // In DC122 the club level's front (37 ft) reaches out over row 15
      // (underside ~34 ft, 9 ft above that row's floor).
      stand: { rows: 21, frontRowHeightFt: 10, rakeDeg: 14, backHeightFt: 134, backSetbackFt: 39, deckFrontFt: 37 },
      sections: withRakes(withFronts(withBacks({ 'DC122': { frontRowHeightFt: 15, overhang: { coveredFromRow: 15, soffitHeightFt: 34 } } }, {
        'DC121': [135, 35], 'DC122': [73, -11], 'DC123': [135, 39], 'DC125': [133, 42],
        'HP119': [134, 62], 'HP120': [134, 57],
      }), {
        'DC122': 15, 'DC123': 9, 'DC125': 9,
      }), {
        'HP119': 13,
      }),
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
      // the back row. Each measured section takes its own back (the same
      // roof 27–42 ft behind the shorter sections 108, 109, 118 and 127,
      // 9–16 ft in front of the last row of the 49-row 111 and 135).
      stand: { rows: 44, frontRowHeightFt: 1, rakeDeg: 13, backHeightFt: 140, backSetbackFt: 1, deckFrontFt: 37, overhang: { coveredFromRow: 36, soffitHeightFt: 32 } },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['109', '137'].map((id) => [id, { overhang: { coveredFromRow: NATS_100_COVER[id], soffitHeightFt: 28 } }])),
        '108': { deckFrontFt: 71, overhang: { coveredFromRow: 41, soffitHeightFt: 62 } },
        '113': { overhang: { coveredFromRow: 39, soffitHeightFt: 34 } },
        ...Object.fromEntries(['134', '135'].map((id) => [id, { overhang: { coveredFromRow: 33, soffitHeightFt: 30 } }])),
        '136': { overhang: { coveredFromRow: 40, soffitHeightFt: 35 } },
      }, {
        '108': [133, 24], '109': [134, 42], '110': [134, 1], '111': [142, -9], '112': [140, -4],
        '113': [142, 6], '114': [140, -2], '115': [142, -4], '116': [142, -4], '117': [138, 1],
        '118': [142, 29], '127': [141, 27], '128': [133, 6], '129': [142, -3], '130': [139, -8],
        '131': [141, -7], '132': [133, 6], '133': [142, 1], '134': [134, 3], '135': [142, -16],
        '136': [134, -4],
      }), {
        '108': -2, '109': 0, '110': 0, '111': 0, '112': -1, '113': -2, '114': 0, '115': -1, '132': 0,
        '133': 0,
      }), {
        '108': 12, '109': 12, '110': 12, '111': 12, '112': 12, '113': 12, '133': 12, '135': 12,
        '136': 12,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('108', '112', '113', '117', '118', '127', '128', '132', '135', '137'), NATS_LIDAR],
    },
    outfield: {
      label: 'Outfield (100–107)',
      // Rows up to 30, open ("very few outfield seats are in the shade").
      // Lidar (6 of 8): front row 9 ft above the field (14 in 100, 10 in 101
      // along its rows' fall line), 13° rake (13–14); behind, 46 ft up (41–94). Over the back rows of
      // 100 and 103–105 a structure reaches out (from row 24, 12 in 100, 27
      // in 103; the bottom of its face 39 ft up, 33–48), so those rows are
      // covered; over 101 and 102 the scan sees none. Each takes its own
      // measured back where it differs (over 100 that structure's top, 51
      // ft up and 41 ft in front of its last row).
      stand: { rows: 26, frontRowHeightFt: 9, rakeDeg: 13, backHeightFt: 46, backSetbackFt: -6 },
      sections: withRakes(withFronts(withBacks({
        '100': { frontRowHeightFt: 14, overhang: { coveredFromRow: 12, soffitHeightFt: 48 } },
        '103': { overhang: { coveredFromRow: 27, soffitHeightFt: 38 } },
        '104': { overhang: { coveredFromRow: 24, soffitHeightFt: 33 } },
        '105': { overhang: { coveredFromRow: 24, soffitHeightFt: 39 } },
      }, {
        '100': [51, -41], '101': [94, 157], '102': [77, 173], '103': [42, -7], '104': [41, -6],
        '105': [42, -7],
      }), {
        '100': 14, '101': 10, '102': 8,
      }), {
        '101': 14,
      }),
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
      // takes it there too, 40 ft in front of its last row. The tier's back
      // is the median of the four measured; each takes its own (from 142's
      // open rows, with the scan's cover from row 6, the scoreboard's rises
      // highest, as over 143), and 140, which the tool no longer finds,
      // keeps the tier's.
      stand: { rows: 24, frontRowHeightFt: 12, rakeDeg: 14, backHeightFt: 37, backSetbackFt: -53, deckFrontFt: 36, overhang: { coveredFromRow: 6, soffitHeightFt: 27 } },
      sections: withFronts(withBacks({
        '138': { overhang: { coveredFromRow: 1, soffitHeightFt: 27 } },
        '139': { backSetbackFt: -40, overhang: { coveredFromRow: 3, soffitHeightFt: 27 } },
        '140': { overhang: { coveredFromRow: 2, soffitHeightFt: 27 } },
        '143': { deckFrontFt: undefined, overhang: { coveredFromRow: 19, soffitHeightFt: 70 } }, // another deck, its front not measured
      }, { '141': [37, -54], '142': [154, -14], '143': [154, -14] }), {
        '141': 13,
      }),
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
      // is the scoreboard structure, 95 ft up (64–135; the median of the six
      // measured, each of which takes its own). The scoreboard
      // reaches out over row 12 of 241–243, the bottom of its face 75 ft up
      // (69–82; 100 over 243), and the upper deck over row 2–3 of 238 and
      // 239 (its front row 62 ft up, its underside ~53 ft), so those rows
      // are covered; over 240 the scan sees nothing.
      stand: { rows: 16, frontRowHeightFt: 36, rakeDeg: 20, backHeightFt: 95, backSetbackFt: -12, overhang: { coveredFromRow: 12, soffitHeightFt: 75 } },
      sections: withRakes(withBacks(withFronts({
        '238': { backHeightFt: 65, backSetbackFt: -22, deckFrontFt: 62, overhang: { coveredFromRow: 3, soffitHeightFt: 53 } },
        '239': { backHeightFt: 67, backSetbackFt: -22, deckFrontFt: 62, overhang: { coveredFromRow: 2, soffitHeightFt: 53 } },
        '240': { backHeightFt: 63, backSetbackFt: 11, noCover: true },
        ...Object.fromEntries(['241', '242'].map((id) => [id, { backHeightFt: 123, backSetbackFt: -12 }])),
        '243': { backHeightFt: 135, backSetbackFt: -12, overhang: { coveredFromRow: 12, soffitHeightFt: 100 } },
      }, {
        '240': 37, '241': 37, '242': 37, '243': 37,
      }), { '240': [63, 11] }), {
        '240': 23, '241': 22, '242': 23, '243': 23,
      }),
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
      // row, 141–142 ft up; each measured section takes its own back. Along
      // 304's rows' fall line the edge is over its last row (12), the
      // lowest structure there 134 ft up.
      stand: { rows: 10, frontRowHeightFt: 73, rakeDeg: 31, backHeightFt: 135, backSetbackFt: -2, overhang: { coveredFromRow: 9, soffitHeightFt: 140 } },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['305', '306', '307', '308', '318', '319', '320', '321'].map((id) => [id, { overhang: { coveredFromRow: 8, soffitHeightFt: 140 } }])),
        '316': { overhang: { coveredFromRow: 10, soffitHeightFt: 140 } },
        ...Object.fromEntries(['303', '309'].map((id) => [id, { overhang: { coveredFromRow: 11, soffitHeightFt: 140 } }])),
        '317': { overhang: { coveredFromRow: 12, soffitHeightFt: 140 } },
        '304': { overhang: { coveredFromRow: 12, soffitHeightFt: 134 } },
        '315': { noCover: true },
      }, {
        '302': [140, -4], '303': [133, 2], '304': [134, -3], '305': [135, 1], '306': [142, -7],
        '307': [141, -14], '308': [135, -6], '309': [134, -3], '310': [135, 0], '311': [136, 0],
        '312': [135, 0], '313': [137, 0], '315': [135, 4], '316': [133, 3], '317': [134, -3],
        '318': [142, -12], '319': [134, 3], '320': [141, -12], '321': [138, -4],
      }), {
        '302': 72, '303': 71, '304': 72, '308': 72, '312': 72, '316': 72,
      }), {
        '303': 28,
      }),

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
 * the middle uncovered row; tier values are medians, and every measured
 * section takes its own front row and back, and its own rake where the scan
 * sees 9 or more of its rows and the cuts beside it agree (68's cut runs down
 * an aisle's steps, so it takes the front row of the cuts beside it). Each
 * cut runs along the rows' fall line: where that is firmly more than 15° off
 * the club map's direction, the section faces it, or where its rows bend
 * across its width the median of the fall lines in its middle and 4 m to
 * either side (its section file's standRuns); one whose fall lines lie
 * either side of the map's direction keeps it and its tier's rake. The
 * decks are lower than the stacking
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
      // an underside of ~30 ft (that front row less 9 ft). Each measured
      // section takes its own back (the roof 25–75 ft behind the last row;
      // past the left-field corner lower structures, 18–65 ft).
      stand: { rows: 29, frontRowHeightFt: 1, rakeDeg: 14, backHeightFt: 122, backSetbackFt: 51, deckFrontFt: 39 },
      sections: withRakes(withFronts(withBacks({
        '70': { overhang: { coveredFromRow: 25, soffitHeightFt: 31 } },
        '74': { overhang: { coveredFromRow: 14, soffitHeightFt: 30 } },
        '72': { overhang: { coveredFromRow: 18, soffitHeightFt: 30 } },
        '76': { overhang: { coveredFromRow: 14, soffitHeightFt: 31 } },

      }, {
        '74': [121, 23], '50': [122, 50], '32': [122, 50], '10': [122, 58], '12': [122, 58],
        '24': [122, 50], '34': [122, 52], '36': [122, 40], '40': [122, 52], '42': [122, 50],
        '68': [122, 75], '72': [122, 33], '80': [122, 52], '82': [57, 35], '14': [122, 65],
        '16': [122, 47], '18': [122, 58], '20': [122, 58], '22': [122, 50], '26': [122, 50],
        '28': [122, 55], '30': [122, 52], '38': [121, 40], '44': [122, 50], '46': [122, 53],
        '48': [122, 52], '54': [122, 57], '56': [122, 50], '58': [122, 52], '60': [122, 57],
        '70': [122, 43], '76': [122, 25], '78': [65, 12], '86': [18, 1],
      }), {
        '74': 10, '50': 3, '32': 0, '10': 0, '12': 0, '24': 3, '34': 0, '36': 2, '40': 0, '42': 0,
        '68': 6, '72': 7, '80': 10, '82': 6, '14': -1, '18': -1, '20': 0, '22': 3, '26': 3, '28': 0,
        '30': 0, '38': 2, '44': 0, '48': 3, '52': 3, '54': 0, '56': 0, '58': 0, '60': 0, '70': 3,
        '76': 10, '78': 10, '86': 4,
      }), {
        '10': 13, '12': 13, '34': 13, '40': 13, '42': 13, '62': 13, '64': 13, '66': 13,
        '72': 15, '14': 13, '18': 13, '20': 13, '30': 13, '38': 13, '54': 13, '56': 13, '58': 13,
        '60': 13, '78': 15,
        '74': 15,
      }),
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
      // rows behind it, 71 ft up and 15 ft in front of its last row). The
      // tier's back is the median of the four measured; with the cover from
      // row 2 the tool now finds only C37, which takes its own.
      stand: { rows: 6, frontRowHeightFt: 23, rakeDeg: 18, backHeightFt: 64, backSetbackFt: -7, deckFrontFt: 63, overhang: { coveredFromRow: 2, soffitHeightFt: 54 } },
      sections: withBacks({ 'C37': { overhang: { coveredFromRow: 5, soffitHeightFt: 54 } }, 'C43': { backHeightFt: 71, backSetbackFt: -15 } }, { 'C37': [64, -6] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...opacySections('33', '35', '37', '39', '43'), OPACY_LIDAR],
    },
    rightCorner: {
      label: 'Right-field corner (1–8)',
      // Rows up to 21 (6: 10–27, 8: 4–27), open ("completely avoid
      // sections 1–8 ... if you want to stay out of the sun"). Lidar (5 of
      // 6; 1 and 6 along their rows' fall line, 30° off the map's
      // direction, and 8 along the median of its rows' fall lines): front
      // row 2 ft (0–3), 13° rake; what rises highest behind is the upper
      // deck's roof, 122 ft up and 75 ft back (70–75 ft, each measured
      // section its own; behind 1 and 6, along their rows, a structure
      // 107–108 ft up, 155–157 ft back, and behind 8 one 65 ft up, 47 ft
      // back; the separate medians, 108 ft and 75 ft back, pair them).
      stand: { rows: 21, frontRowHeightFt: 2, rakeDeg: 13, backHeightFt: 122, backSetbackFt: 75 },
      sections: withRakes(withFronts(withBacks({}, { '3': [122, 70], '1': [107, 155], '6': [108, 157], '8': [65, 47] }), {
        '5': 0,
        '1': 3,
        '6': 3,
        '8': 0,
      }), {
        '1': 14,
        '8': 14,
      }),
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
      // 110 ft up, 72 ft back. Each measured section takes its own back.
      stand: { rows: 23, frontRowHeightFt: 6, rakeDeg: 18, backHeightFt: 112, backSetbackFt: 50 },
      sections: withRakes(withFronts(withBacks({
        '90': { overhang: { coveredFromRow: 17, soffitHeightFt: 38 } },
        '92': { overhang: { coveredFromRow: 19, soffitHeightFt: 35 } },
        '94': { overhang: { coveredFromRow: 19, soffitHeightFt: 35 } },
      }, { '96': [40, 45], '94': [114, 55], '92': [110, 72], '90': [118, -4] }), {
        '94': 5, '90': 8,
      }), {
        '96': 17,
      }),
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
      // 9 ft). That edge is what rises highest behind (each measured section
      // its own).
      stand: { rows: 9, frontRowHeightFt: 40, rakeDeg: 23, backHeightFt: 64, backSetbackFt: -12, deckFrontFt: 63, overhang: { coveredFromRow: 5, soffitHeightFt: 54 } },
      sections: withFronts(withBacks({}, {
        '252': [63, -12], '216': [64, -11], '214': [63, -12], '220': [64, -14], '228': [64, -14],
        '244': [64, -11], '262': [64, -14], '248': [63, -12], '250': [64, -11], '256': [65, -12],
        '264': [64, -11],
      }), {
        '252': 39, '216': 39, '242': 39, '244': 39, '246': 39, '248': 39, '250': 39, '258': 39,
        '264': 39,
      }),
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
      sections: withFronts(withBacks({ '270': { overhang: { coveredFromRow: 5, soffitHeightFt: 53 } } }, { '208': [64, -1], '270': [64, -5] }), {
        '270': 39,
      }),
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
      // highest behind (each measured section its own).
      stand: { rows: 25, frontRowHeightFt: 63, rakeDeg: 30, backHeightFt: 122, backSetbackFt: -24, overhang: { coveredFromRow: 15, soffitHeightFt: 119 } },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(OPACY_300_SKIPPING.map((id) => [id, { overhang: { coveredFromRow: 12, soffitHeightFt: 119 } }])),
        '381': { overhang: { coveredFromRow: 8, soffitHeightFt: 119 } }, // rows 8–25
      }, {
        '372': [122, -22], '370': [122, -22], '368': [122, -30], '362': [122, -22],
        '360': [122, -32], '354': [122, -22], '352': [122, -32], '344': [122, -32],
        '342': [122, -32], '332': [122, -32], '330': [122, -32], '324': [122, -32],
        '316': [121, -32], '310': [122, -32], '306': [119, -22], '376': [122, -30],
      }), {
        '364': 64, '344': 64, '340': 64, '332': 64, '328': 64, '326': 64, '324': 64, '322': 64,
        '312': 64,
      }), {
        '356': 31, '352': 31, '342': 31, '336': 31, '318': 31,
      }),

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
// The 100s (lidar, 16 of 17; 118–121 along their rows' fall line, 20–32°
// off the map's direction): front row at field level (-2 to 2), 11° rake
// (9–30). What rises highest behind, seen from the middle of the open rows,
// is the Terrace level's front, 67–68 ft up and 15–45 ft in front of the
// last row (eight sections), or the roof, 132–134 ft up and 2–57 ft behind
// it (seven). The profile takes the larger group's median, 38 ft in front:
// the separate medians of height and setback (68 ft, 2 ft in front) pair
// the two groups and fit neither.
const PETCO_100: StandProfile = { rows: 43, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 68, backSetbackFt: -38 };

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
 * medians, and every measured section takes its own front row and back, and
 * its own rake where the scan sees 9 or more of its rows and the cuts beside
 * it agree. Each cut runs along the rows' fall line: where that is firmly
 * more than 15° off the club map's direction, the section faces it, or where
 * its rows bend across its width the median of the fall lines in its middle
 * and 4 m to either side (its section file's standRuns); one whose fall
 * lines lie either side of the map's direction keeps it and its tier's rake.
 * The Terrace level's front is 36 ft (38), the Upper Box's 67 ft (75; the
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
      // to 2), 10° rake (9–12; the cuts through 101, 102 and 105 are off
      // those beside them); what rises highest behind is the Upper
      // level's roof, 133 ft up and 88 ft back (66–103 ft, each measured
      // section its own).
      stand: { rows: 15, frontRowHeightFt: -1, rakeDeg: 10, backHeightFt: 133, backSetbackFt: 88 },
      sections: withFronts(withBacks({}, {
        '104': [133, 93], '106': [133, 86], '101': [134, 75], '102': [133, 66], '103': [133, 103],
        '105': [134, 89],
      }), {
        '101': 1, '102': 2, '103': -2,
      }),
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
      // seen, 34 ft). Each measured section takes its own back, seen from
      // the middle of its open rows: in A, C, D and K that front (23–35 ft in
      // front of the last row), in E and H–J the Terrace level's rows rising
      // behind it, 70–71 ft up, 11 ft in front. The tier keeps the front, 26
      // ft in front (the separate medians, 53 ft, pair the two groups); F
      // and G, not measured, between E and H, take what all four of those
      // measure; B, measured before on a cut the tool's line from home
      // misses, keeps its 15 ft.
      stand: { rows: 15, frontRowHeightFt: 10, rakeDeg: 19, backHeightFt: 36, backSetbackFt: -26, deckFrontFt: 36, overhang: { coveredFromRow: 4, soffitHeightFt: 27 } },
      sections: withFronts(withBacks({
        'A': { overhang: { coveredFromRow: 1, soffitHeightFt: 27 } },
        'B': { backHeightFt: 36, backSetbackFt: -15 },
        'J': { overhang: { coveredFromRow: 4, soffitHeightFt: 34 } },
      }, {
        'A': [36, -23], 'C': [37, -27], 'D': [36, -32], 'E': [71, -11], 'H': [70, -11],
        'I': [71, -11], 'J': [71, -11], 'K': [37, -35], 'F': [71, -11], 'G': [71, -11],
      }), {
        'A': 13, 'D': 11,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('A', 'C', 'F', 'J', 'L'), PETCO_LIDAR],
    },
    hundred: {
      label: 'Field level (100s)',
      stand: { ...PETCO_100, deckFrontFt: 36 },
      // Covered rows (Rate Your Seats) per section; the Terrace level's
      // front, 36 ft up, reaches out over row 17–26 in nine of them (118 and
      // 120 along their rows' fall line), more than two rows from the
      // source's, and those take the scan's row (the cross-aisle between
      // the front and back blocks counts as rows in that distance, as it
      // does in the engine). Along 121's rows the edge is over row 26, three
      // past the source's 23, which it keeps: Rate Your Seats' shade on its
      // rows 27 and up at a September first pitch (petcoShadeReference)
      // needs it. Its underside: that
      // front row less 9 ft, ~27 ft (the lidar sees nothing lower). Each
      // measured section takes its own back (see PETCO_100): that front
      // 15–45 ft in front of the last row of the deep sections, 19 ft
      // behind the 23-row 124; the roof 7–57 ft behind the others.
      sections: withRakes(withFronts(withBacks({
        ...petcoCover([...Array.from({ length: 18 }, (_, i) => String(107 + i))], 27),
        '109': { overhang: { coveredFromRow: 17, soffitHeightFt: 27 } },
        '107': { overhang: { coveredFromRow: 17, soffitHeightFt: 27 } },
        '113': { overhang: { coveredFromRow: 21, soffitHeightFt: 26 } },
        ...Object.fromEntries(['114', '122'].map((id) => [id, { overhang: { coveredFromRow: 26, soffitHeightFt: id === '122' ? 28 : 27 } }])),
        '115': { overhang: { coveredFromRow: 24, soffitHeightFt: 28 } },
        '116': { overhang: { coveredFromRow: 24, soffitHeightFt: 27 } },
        '118': { overhang: { coveredFromRow: 23, soffitHeightFt: 28 } },
        '120': { overhang: { coveredFromRow: 26, soffitHeightFt: 28 } },
      }, {
        '108': [132, 57], '110': [132, 31], '112': [68, -15], '114': [67, -35], '116': [68, -40],
        '118': [133, -2], '120': [133, 7], '122': [67, -33], '107': [134, 27], '109': [67, -44],
        '113': [67, -45], '115': [68, -40], '119': [134, 20], '121': [134, 33], '124': [68, 19],
      }), {
        '110': 2, '112': -2, '114': -2, '120': -2, '122': -2, '124': -2, '107': 2,
        '109': 2, '113': 0, '115': 0,
      }), {
        '112': 11, '116': 11, '118': 12, '122': 12, '124': 12, '107': 11, '115': 9, '121': 10,
        '114': 10,
        '120': 12,
        '109': 10,
        '113': 10,
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
      // the Terrace level's front less 9 ft). Behind, 76 ft up (each takes
      // its own: over 111 the Terrace level, 68 ft, 34 ft in front).
      stand: { rows: 43, frontRowHeightFt: 7, rakeDeg: 15, backHeightFt: 76, backSetbackFt: -15, deckFrontFt: 36, overhang: { coveredFromRow: 21, soffitHeightFt: 31 } },
      sections: withRakes(withFronts(withBacks({ '111': { frontRowHeightFt: 2, overhang: { coveredFromRow: 17, soffitHeightFt: 27 } } }, { '111': [68, -34], '127': [77, -11] }), {
        '111': 2,
      }), {
        '111': 11,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('111', '125', '127'), PETCO_LIDAR],
    },
    leftLower: {
      label: 'Left Field Lower Box (126–134)',
      // Rows A–B and 1–11 (fewer in 130, 134), under the 226–230 deck from
      // row 6 (sourced). Lidar (5 of 5): front row 3 ft (3–4), 10° rake
      // (8–11); behind, 26 ft up (57–59 in 126 and 128; each its own). Estimated:
      // underside ~22 ft (23 over 126–132, covered from row 8).
      stand: { rows: 13, frontRowHeightFt: 3, rakeDeg: 10, backHeightFt: 26, backSetbackFt: -12 },
      // The scan puts the deck's edge over 126's row 1 (its lowest point
      // 20 ft up) and 132's row 5.
      sections: withRakes(withFronts(withBacks({
        ...petcoCover(['128', '130', '134'], 23),
        '126': { overhang: { coveredFromRow: 1, soffitHeightFt: 20 } },
        '132': { overhang: { coveredFromRow: 5, soffitHeightFt: 23 } },
      }, { '126': [59, -32], '128': [57, 0], '130': [26, -8], '132': [26, -22] }), {
        '126': 4, '132': 4,
      }), {
        '128': 11,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('126', '128', '130', '134'), PETCO_LIDAR],
    },
    rightLower: {
      label: 'Right Field Lower (129–137)',
      // Rows 1–25 (two blocks), covered from row 21 (sourced). Lidar (3 of
      // 5): front row 9 ft (7–10), 14° rake (129 along its rows' fall
      // line, 40° off the map's direction); behind, 49 ft up (75 in 129;
      // each its own). The deck's underside: the bottom of its face, seen
      // once, 39 ft.
      stand: { rows: 25, frontRowHeightFt: 9, rakeDeg: 14, backHeightFt: 49, backSetbackFt: -16, deckFrontFt: 46 },
      sections: withFronts(withBacks({
        ...petcoCover(['129', '131', '133', '135', '137'], 39),
      }, { '129': [75, -4], '131': [49, -18] }), {
        '129': 7, '131': 10,
      }),
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
      // up, just behind the last row (each its own). Its edge reaches out over 202's row 7
      // and 201's row 6 (underside ~60 ft, 50 over 201, where something
      // lower shows), so those rows are covered.
      stand: { rows: 9, frontRowHeightFt: 35, rakeDeg: 22, backHeightFt: 71, backSetbackFt: -5 },
      sections: withFronts(withBacks({
        '201': { overhang: { coveredFromRow: 6, soffitHeightFt: 50 } },
        '202': { deckFrontFt: 69, overhang: { coveredFromRow: 7, soffitHeightFt: 60 } },
      }, { '202': [71, -6], '204': [71, -4], '203': [71, -1] }), {
        '202': 36, '201': 33,
      }),
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
      sections: withBacks({ '208': { overhang: { coveredFromRow: 5, soffitHeightFt: 57 } } }, { '210': [68, -12] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('206', '208', '210'), PETCO_LIDAR],
    },
    terrace: {
      label: 'Terrace level (205–223)',
      // Rows 1–13 (205/207: 1–15, 209: 3–15), covered from row 7 (205–209:
      // row 11). Lidar (12 of 15): front row 37 ft (35–38, each its own), 22° rake
      // (19–23); the Upper Box's front, 67 ft up, reaches out over row 4
      // (3–6) in 9 of the 12, so the rows from 4 back are covered, under an
      // underside of ~57 ft (that front row less 9 ft). That edge is what
      // rises highest behind (each measured section its own).
      stand: { rows: 13, frontRowHeightFt: 37, rakeDeg: 22, backHeightFt: 68, backSetbackFt: -27, deckFrontFt: 66, overhang: { coveredFromRow: 4, soffitHeightFt: 57 } },

      sections: withFronts(withBacks({}, {
        '214': [65, -27], '216': [67, -27], '209': [68, -22], '211': [68, -22],
        '213': [68, -20], '215': [67, -25], '223': [68, -28],
      }), {
        '207': 35, '209': 35, '211': 36, '213': 35, '223': 38,
        '217': 38,
        '220': 38,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('205', '209', '211', '216', '219', '223'), PETCO_LIDAR],
    },
    leftReserved: {
      label: 'Left Field Reserved (226–230)',
      // Rows up to 21; Rate Your Seats counts them covered from row 15–17.
      // Lidar (2 of 3): front row 26 ft, 18° rake (228's; 230's cut, 23°, is
      // off the cuts beside it, 20°); a structure
      // reaches out over row 9 (8–10), its lowest point 43 ft up, so the rows
      // from there back are covered (226, not measured, keeps its row, with
      // an underside 9 ft above that row's floor). Behind, 126 ft up.
      stand: { rows: 21, frontRowHeightFt: 26, rakeDeg: 18, backHeightFt: 126, backSetbackFt: -12, overhang: { coveredFromRow: 9, soffitHeightFt: 44 } },
      sections: withFronts(withBacks(petcoCover(['226'], 50), { '228': [119, -17], '230': [132, -8] }), {
        '230': 27,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...petcoSections('226', '228', '230'), PETCO_LIDAR],
    },
    rightUpper: {
      label: 'Right Field Upper (227–235)',
      // Rows 1–25; 227–231 covered from row 23, 233 and 235 open ("all right
      // field seats, especially on the 200 level, are not good for shade").
      // Lidar (4 of 5): front row 47 ft (38 in 227, along the median of its
      // rows' fall lines), 27° rake (26–29 on 231 and the cuts beside 233;
      // along 227's rows, 24° over five); behind, 75 ft up and 73 ft back
      // (62–129; 84 ft, 37 ft in front of 227's last row, 67 ft and 162 ft
      // back behind 231). Estimated: underside 9 ft above the first
      // covered row's floor. Along 227's rows the scan puts a deck's edge
      // over its row 4; it keeps its source's row 23, as at this corner the
      // edge runs across the rows and the cut across them saw seats past it. Over 233's rows 19 and up a structure reaches
      // out, its lowest point 94 ft up, so those rows are covered.
      stand: { rows: 25, frontRowHeightFt: 47, rakeDeg: 27, backHeightFt: 75, backSetbackFt: 73 },
      sections: withFronts(withBacks({
        ...petcoCover(['229'], 84),
        '231': { backHeightFt: 67, backSetbackFt: 162, ...petcoCover(['231'], 84)['231'] },
        '227': petcoCover(['227'], 78)['227'],
        '233': { backHeightFt: 129, backSetbackFt: -15, overhang: { coveredFromRow: 19, soffitHeightFt: 94 } },
        '235': { backHeightFt: 62, backSetbackFt: 191 },
      }, { '227': [84, -37] }), {
        '227': 38,
      }),
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
      // 67 ft (65–75), 30° rake (19–33; 324 and 325 along the median of
      // their rows' fall lines; the Upper Deck's rows behind an aisle
      // start ~80 ft); the roof's edge is 133 ft up with nothing seen below
      // it (a thin roof), and is what rises highest behind (80–105 ft at the
      // ends). Its edge agrees with the source's row but in 304, 307, 322
      // and 326, which take the scan's (14–16). Lower "edges" over 311, 321
      // and 323 are the Upper Deck's rows behind the aisle, not a deck.
      // Each measured section takes its own back (the roof's edge 32–39 ft
      // in front of the last row of 304, 307 and 326; the Upper Deck's rows behind the
      // aisle, ~80 ft up, start 20 ft behind 321's last row and 47 ft in
      // front of 323's), and so does 322, whose own puts the roof's edge
      // over its covered row 15 (12 ft in front of its last row) where the
      // tier's would stand over its open rows 12–14. The short rows in
      // front, 313 and 329, have the step up to that aisle right behind
      // them, 75 ft up (313's cut, on a point the tool's line from home
      // misses; 329's shows the same step). The tier's back is the median
      // of the 17 measured before; the tool no longer finds 313's run.
      stand: { rows: 23, frontRowHeightFt: 67, rakeDeg: 30, backHeightFt: 133, backSetbackFt: -21 },
      sections: withFronts(withBacks({
        ...petcoCover(Array.from({ length: 30 }, (_, i) => String(300 + i)), 133),
        ...Object.fromEntries(['304', '307'].map((id) => [id, { overhang: { coveredFromRow: 14, soffitHeightFt: 133 } }])),
        '322': { overhang: { coveredFromRow: 15, soffitHeightFt: 132 } },
        '326': { overhang: { coveredFromRow: 16, soffitHeightFt: 133 } },
      }, {
        '304': [134, -33], '305': [133, -22], '306': [133, -22], '307': [133, -39], '310': [133, -23],
        '311': [134, -21], '315': [98, -23], '319': [105, 66], '320': [134, -21], '321': [79, 20],
        '322': [133, -12], '323': [81, -47], '324': [134, -21], '326': [133, -32],
        '328': [98, -20], '313': [75, 1], '329': [75, 1],
      }), {
        '304': 70, '305': 70, '306': 70, '307': 70, '323': 66, '325': 66, '326': 66,
        '328': 66,
      }),

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
 * behind; each measured section takes its own front row and that back, and
 * its own rake where the scan sees 9 or more of its rows and the cuts beside
 * it agree. Each cut runs along the rows' fall line: where that is firmly
 * more than 15° off the club map's direction, the section faces it, or where
 * its rows bend across its width the median of the fall lines in its middle
 * and 4 m to either side (its section file's standRuns); one whose fall
 * lines lie either side of the map's direction keeps it and its tier's rake.
 * Where a deck's
 * edge is more than two rows from the source's
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
      // back (32–52 ft, each measured section its own; in five, a lamp bank
      // on it, 139–141 ft). Where a section runs past
      // 21 rows (the corners), the club level's front, 34–35 ft up, reaches
      // out over its row 22 (25 in 103), so those rows are covered, under an
      // underside of ~25 ft (that front row less 9 ft; 26 ft over 113 and
      // 127, whose own front rows sit a foot higher: 9 ft above their row
      // 22's floor).
      stand: { rows: 26, frontRowHeightFt: 2, rakeDeg: 14, backHeightFt: 123, backSetbackFt: 41, deckFrontFt: 34, overhang: { coveredFromRow: 22, soffitHeightFt: 25 } },
      sections: withRakes(withFronts(withBacks({
        '103': { overhang: { coveredFromRow: 25, soffitHeightFt: 27 } },
        ...Object.fromEntries(['113', '127'].map((id) => [id, { overhang: { coveredFromRow: 22, soffitHeightFt: 26 } }])),
      }, {

        '113': [139, 41], '103': [123, 43], '102': [139, 38], '117': [123, 47], '123': [123, 40],
        '127': [123, 33], '131': [141, 38], '130': [123, 38], '124': [140, 38], '132': [141, 34],
        '114': [123, 47], '122': [123, 48], '121': [123, 48], '119': [123, 52], '118': [123, 47],
        '116': [123, 48], '115': [124, 47], '108': [122, 34], '107': [123, 34], '109': [123, 32],
        '104': [123, 36],
      }), {
        '113': 3, '103': 1, '102': 1, '117': 1, '127': 3, '131': 0, '114': 1, '121': 1, '119': 1,
        '118': 3, '116': 1, '115': 1,
      }), {
        '131': 12,
      }),
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
      // front row 13 ft above the field, 18° rake (15–18; 237's cut, 15°,
      // is off the cuts beside it, 18°, so it is left out); behind, 111 ft
      // up and 44 ft back (68 in 238; 104–117 ft and 34–55 ft back behind
      // 237, 239 and 240, measured).
      stand: { rows: 30, frontRowHeightFt: 13, rakeDeg: 18, backHeightFt: 111, backSetbackFt: 44 },
      sections: withRakes(withFronts({
        '238': { backHeightFt: 68, backSetbackFt: 57 },
        '239': { backHeightFt: 104, backSetbackFt: 55 },
        ...Object.fromEntries(['237', '240'].map((id) => [id, { backHeightFt: 117, backSetbackFt: 34 }])),
      }, {
        '237': 14,
      }), {
        '238': 15,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('236', '238', '240'), ANGEL_LIDAR],
    },
    rightPavilionUpper: {
      label: 'Right-field pavilion (241–249)',
      // Rows A–M, open (as above). Lidar (2 of 9; further out its rows go on
      // from the lower pavilion's, ~37 ft up there too): front row 36 ft
      // (36–37), 24° rake (243, along the median of its rows' fall lines,
      // and 244); behind, 75 ft up and 23 ft back, the median of a canopy 72
      // ft up right behind 243's last row and a structure 78 ft up, 45 ft
      // behind 244's (each seen along its rows' fall line).
      stand: { rows: 13, frontRowHeightFt: 36, rakeDeg: 24, backHeightFt: 75, backSetbackFt: 23 },
      sections: withFronts({ '243': { backHeightFt: 72, backSetbackFt: 1 }, '244': { backHeightFt: 78, backSetbackFt: 45 } }, {
        '244': 37,
      }),
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
      // settles the cover; behind, 32 ft up and 11 ft back (26–39 ft up, each
      // measured section its own).
      stand: { rows: 22, frontRowHeightFt: 9, rakeDeg: 16, backHeightFt: 32, backSetbackFt: 11 },
      sections: withRakes(withFronts(withBacks({ '256': { frontRowHeightFt: 3 } }, { '259': [27, 1], '258': [37, 22], '256': [26, 1], '257': [39, 21] }), {
        '259': 10, '258': 10, '256': 3,
      }), {
        '259': 17,
      }),
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
      // also what rises highest behind, 61 ft up: 10 ft in front of the last
      // row, 2–6 ft behind it in the 3-row 349–351, which end before it;
      // behind 305 and 306 a lamp bank on the roof, 139–140 ft. Each measured
      // section takes its own back.
      stand: { rows: 8, frontRowHeightFt: 35, rakeDeg: 23, backHeightFt: 61, backSetbackFt: -10, deckFrontFt: 59, overhang: { coveredFromRow: 5, soffitHeightFt: 50 } },
      sections: withFronts(withBacks({ '331': { overhang: { coveredFromRow: 2, soffitHeightFt: 50 } } }, {
        '321': [61, -11], '320': [61, -11], '319': [61, -9], '318': [61, -11], '317': [61, -9],
        '316': [61, -11], '315': [60, -9], '314': [60, -11], '313': [61, -9], '312': [61, -11],
        '311': [61, -9], '309': [61, -11], '308': [61, -11], '307': [61, -7], '306': [139, 25],
        '305': [140, 20], '304': [61, -11], '303': [61, -11], '301': [61, -11],
        '332': [61, -11], '333': [61, -9], '334': [61, -11], '335': [61, -9], '337': [60, -9],
        '338': [61, -11], '339': [61, -9], '340': [61, -11], '341': [61, -7], '342': [61, -11],
        '343': [61, -9], '345': [61, -9], '346': [61, -11], '349': [60, 2], '350': [61, 2],
        '351': [61, 2],
      }), {
        '314': 34, '310': 34, '306': 34, '336': 34, '341': 34, '342': 34,
      }),
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
      // edge is 123 ft up, 4 ft behind the last row (2–7 ft, each measured
      // section its own; in eight, a lamp bank on it, 135–141 ft).
      stand: { rows: 10, frontRowHeightFt: 60, rakeDeg: 32, backHeightFt: 123, backSetbackFt: 4 },
      sections: withRakes(withFronts(withBacks({}, {
        '422': [123, 6], '417': [123, 6], '416': [124, 4], '415': [123, 6],
        '425': [123, 6], '412': [123, 6], '411': [137, 2], '410': [141, 4], '409': [123, 7],
        '408': [123, 2], '426': [140, 4], '427': [141, 6], '428': [123, 6], '429': [123, 2],
        '403': [135, 2], '404': [137, 2], '413': [123, 6], '414': [124, 6], '421': [123, 6],
        '423': [123, 6], '424': [123, 6], '432': [123, 6], '433': [141, 2],
        '402': [140, 2],
      }), {
        '409': 59, '408': 62, '426': 59, '427': 58, '429': 61,
        '435': 61,
      }), {
        '416': 33, '405': 33, '429': 33, '404': 31, '418': 33, '419': 33, '420': 33,
        '423': 31, '402': 31,
      }),
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
      stand: { rows: 18, frontRowHeightFt: 80, rakeDeg: 32, backHeightFt: 122, backSetbackFt: -45, overhang: { coveredFromRow: 1, soffitHeightFt: 123 } },
      sections: withFronts(withBacks({}, { '511': [121, -45] }), {
        '508': 81,
      }),
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
 * rake, the edge of any deck over it, and what rises highest behind; each
 * measured section takes its own front row and that back, and its own rake
 * where the scan sees 9 or more of its rows and the cuts beside it agree.
 * Each cut runs along the rows' fall line: where that is firmly more than
 * 15° off the club map's direction, the section faces it, or where its rows
 * bend across its width the median of the fall lines in its middle and 4 m
 * to either side (its section file's standRuns); one whose fall lines lie
 * either side of the map's direction keeps it and its tier's rake.
 * Where a deck's edge is more than two rows from the source's covered row,
 * the scan's row is used. The
 * scan sees decks from above: a deck's underside is
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
      // row less 9 ft; 26–28 over row 29–33, and 26 over 126, whose own front
      // row sits 2 ft up: 9 ft above the floor). Each
      // measured section takes its own back (the roof's edge 27–48 ft behind
      // the last row).
      stand: { rows: 38, frontRowHeightFt: 0, rakeDeg: 12, backHeightFt: 128, backSetbackFt: 30, deckFrontFt: 34, overhang: { coveredFromRow: 26, soffitHeightFt: 25 } },
      sections: withRakes(withFronts(withBacks({
        '116': cover(31, 27),
        '117': cover(33, 28),
        ...Object.fromEntries(['118', '119'].map((id) => [id, cover(29, 25)])),
        ...Object.fromEntries(['121', '144', '145'].map((id) => [id, cover(30, 26)])),
        '126': cover(26, 26),

        ...Object.fromEntries(['123', '124', '125', '135', '138', '136', '137'].map((id) => [id, cover(22, 25)])),
      }, {
        '116': [129, 44], '117': [129, 46], '118': [68, -9], '119': [68, -9], '120': [129, 31],
        '121': [129, 37], '122': [127, 48], '123': [128, 29], '124': [129, 27], '125': [128, 29],
        '126': [129, 31], '127': [128, 33], '134': [128, 34], '135': [129, 28], '136': [68, -16],
        '137': [68, -16], '138': [129, 30], '139': [68, -4], '140': [69, -15], '141': [73, -2],
        '142': [128, 31], '143': [128, 31], '144': [128, 42], '145': [68, -9],
      }), {
        '116': -1, '117': -1, '118': -1, '119': -1, '121': -1, '123': 2, '124': 3, '125': 3,
        '126': 2, '127': 1, '134': 1, '135': 2, '136': 3, '137': 3, '138': 2, '141': -1, '144': -1,
        '145': -1,
      }), {
        '122': 13, '139': 13, '141': 13, '144': 11,
      }),
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
      sections: withBacks({
        '128': { deckFrontFt: 38, ...cover(30, 29) },
        '129': cover(33, 58),
        '130': cover(32, 58),
        '131': cover(31, 58),
        '132': cover(30, 58),
        '133': { deckFrontFt: 36, ...cover(28, 27) },
      }, { '129': [128, 34], '131': [128, 33] }),
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
      sections: withBacks({ ...coorsCover(['106', '107', '108', '109'], 30), '105': cover(7, 28) }, { '105': [68, -15], '106': [68, -15], '108': [68, -12] }),
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
      // front row 5 ft (4–8), 18° rake (17–18; 158 and 160 along the median
      // of their rows' fall lines); behind, 42 ft up and 43 ft back (the
      // scoreboard in 154, 107 ft; each measured section its own).
      stand: { rows: 22, frontRowHeightFt: 5, rakeDeg: 18, backHeightFt: 42, backSetbackFt: 43 },
      sections: withRakes(withFronts(withBacks({}, {
        '152': [42, 45], '153': [39, 50], '154': [107, 43], '155': [25, 7], '156': [37, 47],
        '157': [32, 21], '158': [84, 91], '159': [47, 12], '160': [47, 11],
      }), {
        '156': 8, '158': 4, '160': 6,
      }), {
        '153': 17,
        '158': 17,
      }),
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
      // row 2, within two rows of the source's 4). Each measured section
      // takes its own back; 201–203, which the tool no longer finds, keep
      // theirs.
      stand: { rows: 13, frontRowHeightFt: 34, rakeDeg: 21, backHeightFt: 68, backSetbackFt: -23, deckFrontFt: 67, overhang: { coveredFromRow: 5, soffitHeightFt: 58 } },
      sections: withFronts(withBacks({
        ...Object.fromEntries(['208', '209'].map((id) => [id, cover(4, 58)])),
        ...Object.fromEntries(['201', '203'].map((id) => [id, { backHeightFt: 68, backSetbackFt: -11, ...cover(4, 58) }])),
        '202': { backHeightFt: 68, backSetbackFt: -12, ...cover(2, 58) },
        '204': cover(1, 58),
        '206': cover(1, 58),
        '205': cover(1, 57),
        '207': cover(2, 57),
      }, {
        '204': [68, -29], '205': [68, -43], '206': [69, -43], '219': [68, -18], '221': [68, -15],
        '222': [68, -15], '223': [68, -18], '226': [68, -25], '227': [71, -19], '238': [68, -18],
        '239': [68, -15], '241': [69, -17], '242': [69, -20], '243': [68, -25], '244': [69, -25],
        '245': [69, -25], '246': [69, -23],
      }), {
        '223': 35, '227': 35,
      }),
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
      // Rooftop's deck; 43 ft back behind 309; each section its own).
      stand: { rows: 5, frontRowHeightFt: 68, rakeDeg: 27, backHeightFt: 128, backSetbackFt: 29 },
      sections: withFronts(withBacks({}, {
        '301': [97, 17], '302': [94, 2], '303': [92, -1], '304': [129, 29], '305': [103, 12],
        '306': [129, 30], '307': [128, 30], '308': [129, 32], '309': [129, 43],
      }), {
        '305': 67, '307': 67, '308': 67, '309': 67,
      }),
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
      // edge, 128 ft up and 30 ft back. In L319, L343 and L345 (along the
      // median of its rows' fall lines) that edge is over row 16, which they
      // take. Its underside: 128 ft (the roof's top; the scan sees nothing
      // under it). In the 25-row sections the edge stands 25 ft in front of
      // the last row, 19 ft behind the 9-row L329 and L332; each measured
      // section takes its own back.
      stand: { rows: 9, frontRowHeightFt: 67, rakeDeg: 27, backHeightFt: 128, backSetbackFt: 30 },
      sections: withRakes(withFronts(withBacks({
        ...coorsCover(['L311', 'L313'], 128),
        L319: cover(16, 128),
        L343: cover(16, 128),
        L345: cover(16, 128),
      }, {
        'L345': [128, -27], 'L344': [128, 27], 'L343': [128, -25], 'L342': [106, 29],
        'L340': [127, 29], 'L338': [128, 32], 'L334': [129, 32], 'L333': [129, 30],
        'L332': [129, 19], 'L330': [129, 30], 'L329': [128, 19], 'L326': [128, 32],
        'L323': [129, 30], 'L321': [83, 9], 'L319': [100, -17], 'L315': [129, 32],
      }), {
        'L346': 68, 'L345': 68, 'L344': 68, 'L343': 68, 'L342': 68, 'L332': 68, 'L330': 68,
        'L329': 68, 'L327': 68, 'L319': 68,
      }), {
        'L346': 29, 'L340': 29, 'L332': 29, 'L329': 29,
      }),
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
      sections: withFronts(withBacks({}, { 'U340': [106, -27], 'U336': [103, -27], 'U332': [129, -27] }), {
        'U321': 84,
      }),

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
 * any deck over it, and what rises highest behind; each measured section
 * takes its own front row and that back, and its own rake where the scan
 * sees 9 or more of its rows and the cuts beside it agree (144's cut runs
 * down an aisle's steps, so it takes the front row of the cuts beside it).
 * Each cut runs along the rows' fall line: where that is firmly more than
 * 15° off the club map's direction, the section faces it, or where its rows
 * bend across its width the median of the fall lines in its middle and 4 m
 * to either side (its section file's standRuns); one whose fall lines lie
 * either side of the map's direction keeps it and its tier's rake.
 * Where a deck's edge is more than
 * two rows from the source's covered row (or covers three or more

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
      // front, 60 ft, 25 ft back). No deck over them. Each measured section
      // takes its own back: behind home (113, 122–134) the roof's edge is
      // 86–101 ft back; behind 108–112 and 142–147 the upper deck's front,
      // 11–34 ft back.
      stand: { rows: 24, frontRowHeightFt: 3, rakeDeg: 14, backHeightFt: 157, backSetbackFt: 66 },
      sections: withRakes(withFronts(withBacks({}, {
        '108': [59, 30],
 '110': [61, 14], '113': [141, 91], '114': [157, 60], '115': [161, 66],
        '116': [161, 63], '117': [160, 65], '118': [161, 68], '119': [157, 71], '120': [160, 65],
        '121': [161, 65], '122': [161, 88], '123': [160, 91], '124': [161, 94], '125': [150, 89],
        '126': [150, 89], '127': [150, 93], '128': [150, 70], '129': [151, 88], '130': [151, 101],
        '131': [157, 99], '132': [161, 89], '133': [161, 88], '134': [161, 86], '135': [161, 65],
        '136': [161, 75], '137': [161, 66], '138': [155, 65], '139': [157, 62], '140': [157, 65],
        '141': [160, 63], '142': [60, 11], '143': [60, 14], '144': [60, 30], '145': [60, 25],
        '146': [61, 29], '147': [60, 34], '112': [60, 14],
      }), {
        '108': 4, '113': 2, '122': 0, '123': 0, '124': 0, '125': 0, '126': 0, '127': 0, '129': 0,
        '130': 0, '131': -1, '132': -1, '133': 0, '134': 0, '138': 2, '140': 2, '141': 2,
        '145': 2, '146': 2, '147': 4,
        '110': 4,
      }), {
        '114': 13, '115': 13, '138': 13, '142': 13, '143': 13, '146': 13,
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
      sections: withFronts({ '101': { backHeightFt: 65, backSetbackFt: 45 }, '102': { backHeightFt: 24, backSetbackFt: 11 } }, {
        '102': 8,
      }),
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
      // front, 39 ft in front of the last row (34–41, each measured section
      // its own).
      stand: { rows: 20, frontRowHeightFt: 16, rakeDeg: 22, backHeightFt: 60, backSetbackFt: -39, deckFrontFt: 59, overhang: { coveredFromRow: 6, soffitHeightFt: 50 } },
      sections: withFronts(withBacks({}, {
        '218': [59, -41], '219': [60, -38], '221': [60, -38], '223': [61, -41], '225': [60, -38],
        '230': [60, -34], '231': [60, -41], '232': [61, -41], '241': [60, -38],
      }), {
        '223': 17, '225': 17, '231': 17, '232': 17,
      }),
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
      // ~50 ft (as in the Plaza). That front is 38 ft in front of the last
      // row, 25 ft in 211, whose 14 rows end sooner (each measured section
      // takes its own).
      stand: { rows: 20, frontRowHeightFt: 16, rakeDeg: 21, backHeightFt: 60, backSetbackFt: -38, deckFrontFt: 59, overhang: { coveredFromRow: 6, soffitHeightFt: 50 } },
      sections: withFronts(withBacks({}, {
        '209': [60, -36], '211': [58, -25], '212': [61, -39], '213': [60, -39], '243': [60, -39],
        '244': [60, -36],
      }), {
        '213': 17,
      }),
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
      // ft in front of the last row (each section's own; 248's re-measured,
      // 31 ft; the others the tool no longer finds). 250–252 are open, under
      // nothing: behind them a roof 33 ft up, right behind the last row.
      // 250, re-measured along its rows' fall line (42° off the map's
      // direction), takes its own 18° (the cut across them read 13°).
      stand: { rows: 20, frontRowHeightFt: 17, rakeDeg: 16, backHeightFt: 33, backSetbackFt: 1, deckFrontFt: 60 },
      sections: withRakes(withBacks(withFronts({
        '206': { backHeightFt: 60, backSetbackFt: -23, overhang: { coveredFromRow: 11, soffitHeightFt: 51 } },
        '207': { backHeightFt: 61, backSetbackFt: -26, overhang: { coveredFromRow: 9, soffitHeightFt: 51 } },
        '208': { backHeightFt: 62, backSetbackFt: -26, overhang: { coveredFromRow: 8, soffitHeightFt: 51 } },
        '247': { backHeightFt: 63, backSetbackFt: -26, overhang: { coveredFromRow: 8, soffitHeightFt: 51 } },
        '248': { backHeightFt: 61, backSetbackFt: -31, overhang: { coveredFromRow: 9, soffitHeightFt: 51 } },
        '249': { backHeightFt: 60, backSetbackFt: -18, overhang: { coveredFromRow: 14, soffitHeightFt: 51 } },
      }, {
        '248': 16,
      }), { '250': [32, 4] }), {
        '248': 19, '250': 18,
      }),
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
      // bottom, 152–154 ft (153 in 409, where none is seen). Each measured
      // section takes its own back: the edge is 0–6 ft in front of the last
      // row of the full 19–22 row sections (405–413, 429–435) and 19–32 ft
      // behind the shorter ones; behind 403 and 437 the roof's back end,
      // 135–136 ft. Where it is over only the
      // last row or two (405, 407, 411, 413, 433), under option A's
      // three-row mark, its edge is what rises behind them, just in front of
      // the last row, which would leave the rows under it with nothing
      // behind: so they are covered too (as at Nationals Park's Gallery),
      // under its face's bottom or lowest structure there, 149–154 ft (153
      // in 405, where none is seen).
      stand: { rows: 22, frontRowHeightFt: 60, rakeDeg: 32, backHeightFt: 156, backSetbackFt: 12 },
      sections: withRakes(withFronts(withBacks({
        '403': { overhang: { coveredFromRow: 16, soffitHeightFt: 154 } },
        '437': { overhang: { coveredFromRow: 16, soffitHeightFt: 152 } },
        '429': { overhang: { coveredFromRow: 20, soffitHeightFt: 153 } },
        '431': { overhang: { coveredFromRow: 20, soffitHeightFt: 154 } },
        '409': { overhang: { coveredFromRow: 19, soffitHeightFt: 153 } },
        '405': { overhang: { coveredFromRow: 18, soffitHeightFt: 153 } },
        '407': { overhang: { coveredFromRow: 19, soffitHeightFt: 151 } },
        '411': { overhang: { coveredFromRow: 21, soffitHeightFt: 150 } },
        '413': { overhang: { coveredFromRow: 21, soffitHeightFt: 149 } },
        '433': { overhang: { coveredFromRow: 19, soffitHeightFt: 154 } },
      }, {
        '403': [136, 32], '411': [154, -6], '413': [158, -4], '416': [150, 32], '427': [150, 6],
        '428': [161, 25], '429': [161, -4], '430': [161, 24], '431': [161, -2], '432': [155, 21],
        '433': [155, -2], '434': [154, 22], '435': [157, -1], '436': [149, 29], '437': [135, 34],
        '405': [157, -2], '406': [154, 19], '407': [161, 0], '409': [157, -6], '410': [157, 22],
        '412': [161, 24], '415': [150, 2],
      }), {
        '428': 61, '405': 59,
      }), {
        '403': 31, '411': 33, '413': 33, '416': 33, '428': 31, '431': 33, '436': 31, '437': 31,
        '410': 31,
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
 * rake, the edge of any deck over it, and what rises highest behind; each
 * measured section takes its own front row and that back, and its own rake
 * where the scan sees 9 or more of its rows and the cuts beside it agree.
 * Each cut runs along the rows' fall line: where that is firmly more than
 * 15° off the club map's direction, the section faces it, or where its rows
 * bend across its width the median of the fall lines in its middle and 4 m
 * to either side (its section file's standRuns); one whose fall lines lie
 * either side of the map's direction keeps it and its tier's rake.
 * Where a deck's edge is more than two rows from the source's covered row (or
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
      // behind is the roof's edge, 138 ft up and 122 ft back (each measured
      // section its own; behind 3 a structure 69 ft up).
      stand: { rows: 8, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 138, backSetbackFt: 122 },
      sections: withFronts(withBacks({}, { '3': [69, 86], '23': [137, 122], '24': [138, 124], '25': [138, 125] }), {
        '25': 0,
      }),
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
      sections: withFronts(withBacks(gabpCover(gabpIds(122, 126), 24), { '123': [138, 89] }), {
        '123': 5,
      }),
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
      // is the roof's edge, 138 ft up and 33 ft back (in four, the club's
      // front over the last rows). The club's front, 35 ft up, is over the
      // source's row in six; in 127, 128 and 136 it reaches out over row
      // 20–22 and in 133 over 28, which they take; in 137 the scan puts it
      // over row 30 (source: 19). Its underside ~25 ft (that front row less
      // 9 ft; 30 ft in 127, where something lower shows; 26 over 129 and
      // 130, 9 ft above their row 26's floor at their own 12°). Each measured
      // section takes its own back (the roof's edge 29–68 ft behind the last
      // row; the club's front 25–35 ft in front of it).
      stand: { rows: 37, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 138, backSetbackFt: 33, deckFrontFt: 34 },
      sections: withRakes(withFronts(withBacks({
        ...gabpCover(['131', '132', '134', '135'], 25),
        '127': { overhang: { coveredFromRow: 22, soffitHeightFt: 30 } },
        '128': { overhang: { coveredFromRow: 22, soffitHeightFt: 24 } },
        ...Object.fromEntries(['129', '130'].map((id) => [id, gabpCover([id], 26)[id]])),
        '133': { overhang: { coveredFromRow: 28, soffitHeightFt: 25 } },
        '136': { frontRowHeightFt: 4, overhang: { coveredFromRow: 20, soffitHeightFt: 25 } },
        '137': { overhang: { coveredFromRow: 30, soffitHeightFt: 25 } },
      }, {
        '127': [62, -29], '128': [138, 29], '129': [69, -25], '130': [68, -25], '131': [138, 45],
        '136': [69, -35], '137': [138, 68],
      }), {
        '127': 2, '128': 1, '129': 2, '130': 2, '136': 4,
      }), {
        '127': 12, '128': 12, '129': 12, '130': 12,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('127', '130', '132', '136', '137'), GABP_LIDAR],
    },
    third: {
      label: 'Field level, third-base side (107–112, 121)',
      // 108–112 covered from row KK, 121 from FF (sourced: 18, 25, 32, 37,
      // 37, 20); 107 open. Lidar (6 of 7; 108 and 109 along their rows' fall
      // line, 20° off the photo's direction, and 111 along the median of its
      // rows' fall lines): front row 1 ft (-1 to 4), 12° rake (10–12; 110
      // straddles a bend, its cut across the rows); behind, the roof's edge,
      // 134 ft up and 40 ft back. The 400s' front, 52 ft up, is over the
      // source's row in 110; in 112 it reaches out over row 33, along 111's
      // rows over row 31 and along 109's over row 22, which they take. Its
      // underside ~43 ft (that front row less 9 ft). Each measured section
      // takes its own back (the roof's edge 28–65 ft back; behind 121 a
      // structure 53 ft up).
      stand: { rows: 30, frontRowHeightFt: 1, rakeDeg: 12, backHeightFt: 134, backSetbackFt: 40, deckFrontFt: 52 },
      sections: withRakes(withFronts(withBacks({
        ...gabpCover(['108', '110', '121'], 43),
        '111': { overhang: { coveredFromRow: 31, soffitHeightFt: 43 } },
        '112': { overhang: { coveredFromRow: 33, soffitHeightFt: 43 } },
        '109': { overhang: { coveredFromRow: 22, soffitHeightFt: 43 } },
      }, {
        '112': [134, 43], '111': [134, 28], '110': [134, 55], '109': [134, 38], '108': [134, 65],
        '121': [53, 19],
      }), {
        '112': -1, '111': -1, '110': 0, '109': 4, '108': 2, '121': 2,
      }), {
        '112': 10,
      }),
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
      // 63 ft back (114 and 115 along their rows' fall line). The 400s' front, 52 ft up, is over 113's and 114's row
      // 33, 118's 27 and 119's 26; over 115–117 and 120 the scan sees every
      // row open. That settles the cover; the underside ~43 ft (that front
      // row less 9 ft). Each measured section takes its own back (the roof's
      // edge 53–73 ft behind the last row).
      stand: { rows: 28, frontRowHeightFt: -1, rakeDeg: 11, backHeightFt: 134, backSetbackFt: 63, deckFrontFt: 52 },
      sections: withRakes(withFronts(withBacks({
        '113': { overhang: { coveredFromRow: 33, soffitHeightFt: 43 } },
        '114': { overhang: { coveredFromRow: 33, soffitHeightFt: 42 } },
        '118': { overhang: { coveredFromRow: 27, soffitHeightFt: 43 } },
        '119': { overhang: { coveredFromRow: 26, soffitHeightFt: 43 } },
      }, {
        '119': [134, 55], '118': [134, 57], '116': [134, 71], '115': [134, 66], '113': [134, 59],
        '120': [134, 73],
        '117': [134, 68],
        '114': [134, 53],
      }), {
        '119': 2, '118': 1, '120': 1,
      }), {
        '119': 12, '118': 12, '120': 12,
      }),
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
      sections: withFronts(withBacks({}, { '106': [34, -22], '105': [147, 36], '104': [142, 39], '103': [33, -23] }), {
        '106': 8,
      }),
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
      sections: withRakes(withFronts(withBacks({}, {
        '141': [20, 43], '142': [41, -3], '143': [91, -4], '144': [49, 7], '146': [42, 12],
        '145': [48, 9],
      }), {
        '146': 7,
      }), {
        '146': 16,
      }),
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
      // behind, 31 ft in front of the last row (each measured section its
      // own; 62 ft over 301, the end section).
      stand: { rows: 14, frontRowHeightFt: 35, rakeDeg: 25, backHeightFt: 69, backSetbackFt: -31, deckFrontFt: 67, overhang: { coveredFromRow: 4, soffitHeightFt: 58 } },
      sections: withFronts(withBacks({}, { '301': [62, -33], '302': [68, -26], '305': [69, -25] }), {
        '301': 34, '302': 34,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('301', '303', '305'), GABP_LIDAR],
    },
    clubCoverUnsourced: {
      label: 'Club (306–307)',
      // No covered rows given. Lidar (2 of 2): front row 35 ft, 24° rake;
      // the 400s' front is over row 4, which settles the cover, under ~57 ft
      // (that front row less 9 ft); that front is what rises highest behind,
      // 25 ft in front of the last row (each its own).
      stand: { rows: 13, frontRowHeightFt: 35, rakeDeg: 24, backHeightFt: 68, backSetbackFt: -25, deckFrontFt: 66, overhang: { coveredFromRow: 4, soffitHeightFt: 57 } },
      sections: withBacks({}, { '306': [69, -25] }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...gabpSections('306', '307'), GABP_LIDAR],
    },
    fourHundred: {
      label: '400 level (401–419)',
      // 401–406 covered from row V, 411–419 from row Q (sourced). Lidar (10
      // of 15; 411–415 along their rows' fall line, 20–27° off the photo's
      // direction): on the third-base side front row 53 ft, 27° rake
      // (25–27); the View level's front, 87–88 ft up, reaches out over row
      // 14, three rows ahead of the source's, so the tier takes it, under an
      // underside of ~80 ft (9 ft above row 14's floor; 79 over 416, 418 and
      // 419, at their own 26°). Behind, the roof's
      // edge, 134 ft up. In left field (401–405) the cuts cross the rows at
      // an angle; the cut from home plate gives their front row 32–33 ft
      // (and ~25°); their covered rows are the source's, under an estimated
      // underside 9 ft above that row's floor (405's cut shows an arched
      // canopy over its back rows that the cuts cannot place).
      stand: { rows: 18, frontRowHeightFt: 53, rakeDeg: 27, backHeightFt: 134, backSetbackFt: 7, deckFrontFt: 87, overhang: { coveredFromRow: 14, soffitHeightFt: 80 } },
      sections: withRakes(withBacks({
        ...Object.fromEntries(['416', '418', '419'].map((id) => [id, { overhang: { coveredFromRow: 14, soffitHeightFt: 79 } }])),
        ...Object.fromEntries(['401', '402', '405'].map((id) => [id, { frontRowHeightFt: 33, deckFrontFt: undefined, ...gabpCover([id], 69)[id] }])),
        ...Object.fromEntries(['403', '404'].map((id) => [id, { frontRowHeightFt: 33, deckFrontFt: undefined, ...gabpCover([id], 71)[id] }])),
      }, {
        '416': [134, 9], '419': [134, 9],
        '406': [88, -26],
      }), {
        '416': 26, '418': 26, '419': 26,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('401', '405', '411', '419'), GABP_LIDAR],
    },
    fourHundredFront: {
      label: '400 level (420–437)',
      // Rows A–F, open; rows D and up "shaded during most late afternoon
      // games" on the first-base side. Lidar (17 of 18): front row 68 ft
      // (67–68), 31° rake (28–32); what rises highest behind is the roof's
      // edge, 138 ft up and 35 ft back (35–40; each measured section its own).
      stand: { rows: 6, frontRowHeightFt: 68, rakeDeg: 31, backHeightFt: 138, backSetbackFt: 35 },
      sections: withRakes(withFronts(withBacks({}, {
        '436': [138, 39], '435': [138, 39], '434': [138, 37], '432': [137, 35],
        '424': [137, 35], '422': [138, 37], '421': [83, 30],
      }), {
        '435': 67,
      }), {
        '436': 28, '425': 29,
      }),
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
      // rows from G are covered. The tier's back is the median of the 11
      // measured; each takes its own, and 509 and 511–514, which the tool no
      // longer finds (too few open rows in front of that edge), keep it.
      stand: { rows: 18, frontRowHeightFt: 88, rakeDeg: 29, backHeightFt: 134, backSetbackFt: -29, overhang: { coveredFromRow: 7, soffitHeightFt: 134 } },
      sections: withRakes(withFronts(withBacks({}, { '519': [134, -31], '518': [134, -32], '517': [134, -32], '516': [134, -31], '510': [134, -32] }), {
        '518': 89,
      }), {
        '519': 31, '518': 31, '517': 31, '516': 31, '515': 30,
        '510': 32,
      }),
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
      // 106 ft). Each measured section takes its own front row and back,
      // but for 526's front: its run starts a row or two up, past the
      // walkway its neighbours' runs start right behind.

      stand: { rows: 22, frontRowHeightFt: 84, rakeDeg: 32, backHeightFt: 138, backSetbackFt: -30, overhang: { coveredFromRow: 11, soffitHeightFt: 137 } },
      sections: withRakes(withFronts(withBacks({ '521': { backHeightFt: 106, backSetbackFt: 0 } }, {
        '525': [138, -33], '526': [138, -38], '530': [138, -32], '531': [138, -35],
        '532': [138, -35], '533': [138, -32], '535': [138, -32], '536': [138, -29],
        '537': [138, -29],
      }), {
        '525': 86, '530': 85, '531': 87, '532': 86, '533': 85, '535': 85,

      }), {
        '536': 31, '537': 30,
      }),

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
 * over it, and what rises highest behind; each measured section takes its
 * own front row and that back, and its own rake where the scan sees 9 or
 * more of its rows and the cuts beside it agree. Each cut runs along the
 * rows' fall line: where that is firmly more than 15° off the club map's
 * direction, the section faces it, or where its rows bend across its width
 * the median of the fall lines in its middle and 4 m to either side (its
 * section file's standRuns); one whose fall lines lie either side of the
 * map's direction keeps it and its tier's rake. Where a deck's edge is more
 * than
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
      // (91–132 ft, each measured section its own).
      stand: { rows: 13, frontRowHeightFt: -1, rakeDeg: 10, backHeightFt: 120, backSetbackFt: 106 },
      sections: withRakes(withFronts(withBacks({}, {
        '1': [120, 116], '2': [120, 114], '4': [120, 104], '8': [120, 103], '9': [120, 104],
        '10': [120, 103], '11': [120, 104], '12': [121, 104], '30': [120, 107], '24': [121, 104],
        '22': [121, 104], '21': [120, 104], '20': [121, 91], '19': [121, 106], '32': [120, 132],
        '31': [120, 117],
        '5': [121, 107],
        '14': [121, 107],
        '15': [121, 107],
        '18': [121, 107],
        '17': [121, 107],
      }), {
        '10': 2, '11': 1, '12': 2, '22': 1, '21': 2, '20': 2,
        '30': 0,
      }), {
        '2': 11, '5': 9, '9': 11, '14': 9, '15': 9, '18': 11, '17': 12,
      }),
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
      // reaches out over row 17 (15–19; 131 and 132 along their rows' fall
      // line, 50° off the map's direction, where the cut across their rows
      // put it at 25–26), more than two rows ahead of the source's in all
      // 23, so the tier takes the
      // scan's row, under an underside of ~43 ft (that front row less 9 ft).
      // It is also what rises highest behind (58 ft in front of the last row
      // of the 37-row 114 and 115, 33 ft in front of 132's; each measured
      // section takes its own).
      stand: { rows: 34, frontRowHeightFt: 5, rakeDeg: 13, backHeightFt: 53, backSetbackFt: -47, deckFrontFt: 52, overhang: { coveredFromRow: 17, soffitHeightFt: 43 } },
      sections: withRakes(withFronts(withBacks({
        ...pncCover(['129'], 43),
      }, {
        '132': [56, -33], '101': [53, -46], '103': [53, -48], '105': [53, -45], '107': [53, -48],
        '108': [54, -47], '110': [54, -47], '113': [54, -47], '114': [53, -58], '115': [53, -58],
        '116': [53, -52], '117': [54, -55], '131': [55, -47], '130': [53, -50], '128': [53, -50],
        '125': [54, -52], '121': [54, -47], '119': [54, -52],
      }), {
        '132': 7, '101': 6, '105': 4, '114': 6, '115': 6, '116': 6, '117': 6, '131': 6,
        '130': 6, '128': 6, '125': 7, '123': 6,
      }), {
        '105': 14, '108': 14, '110': 14, '112': 14, '113': 14,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('101', '109', '113', '116', '120', '128', '129', '132'), PNC_LIDAR],
    },
    leftCorner: {
      label: 'Left-field corner (133–138)',
      // Rows A–F to A–P, open ("among the worst seats for shade"). Lidar (6
      // of 6): front row 1 ft (-1 to 3), 12° rake (9–17: 133, 134 and 136
      // read 9–10°, 135 13°, and 137 and 138, along their rows' fall lines,
      // 16–17° over 8–9 rows); behind, 65 ft up and 66 ft back (each
      // section's own where it differs: 43–72 ft up and 7–124 ft back).
      stand: { rows: 12, frontRowHeightFt: 1, rakeDeg: 12, backHeightFt: 65, backSetbackFt: 66 },
      sections: withRakes(withBacks(withFronts({
        '133': { backHeightFt: 121, backSetbackFt: 124 }, '134': { backHeightFt: 72, backSetbackFt: 58 },
        '135': { backHeightFt: 59, backSetbackFt: 7 }, '136': { backHeightFt: 43, backSetbackFt: 76 },
        '137': { backHeightFt: 70, backSetbackFt: 75 }, '138': { backHeightFt: 57, backSetbackFt: 57 },
      }, {
        '133': -1, '136': 3,
        '134': 2,
        '135': 2,
      }), { '137': [70, 75] }), {
        '134': 9,
      }),
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
      // 144's own top, which they keep). Something 36 ft up is over 139's
      // row 10, its top 39 ft up and 9 ft in front of 139's last row (along
      // its rows' fall line, 48° off the map's direction). 139, a low stand
      // of its own under it, takes its own rake, 22°: 22.5° along its 7 open
      // rows, and the cut across them read 15°, which is 22° at that angle
      // (tan 15° / cos 48°). Each other measured section takes its own back.
      stand: { rows: 13, frontRowHeightFt: 19, rakeDeg: 31, backHeightFt: 33, backSetbackFt: 60 },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['142', '144'].map((id) => [id, { backHeightFt: 39, backSetbackFt: 0 }])),
        '139': { frontRowHeightFt: 9, overhang: { coveredFromRow: 10, soffitHeightFt: 36 } },
      }, { '143': [31, 62], '145': [35, 65], '146': [39, 65], '139': [39, -9] }), {
        '142': 18, '139': 9,
      }), {
        '144': 32,
        '139': 22,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('139', '142', '147'), PNC_LIDAR],
    },
    club: {
      label: 'Baseball Club (201–228)',
      // Rows A–K (A–B, A–C at the ends), "rarely in the shade". Lidar (19 of
      // 23): front row 53 ft (52–53), 28° rake (22–29), open; what rises
      // highest behind is the roof's edge, 121 ft up and 25 ft back (the
      // 300s rise between, a walkway behind the last row; each measured
      // section its own).
      stand: { rows: 11, frontRowHeightFt: 53, rakeDeg: 28, backHeightFt: 121, backSetbackFt: 25 },
      sections: withRakes(withBacks({}, {
        '201': [120, 25], '203': [120, 25], '204': [120, 25], '205': [120, 25], '208': [120, 25],
        '210': [120, 25], '211': [120, 24],
      }), {
        '227': 27, '225': 27, '221': 27, '220': 27, '214': 29, '219': 27,
      }),
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
      sections: withRakes(withFronts({ '238': { backHeightFt: 110, backSetbackFt: -4 }, '236': { backHeightFt: 43, backSetbackFt: -1 }, '237': { backHeightFt: 73, backSetbackFt: 32 } }, {
        '237': 15,
      }), {
        '238': 15, '236': 13,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('235', '238'), PNC_LIDAR],
    },
    rooftop: {
      label: 'Left-field rooftop (335–339)',
      // Rows A–C, open. Lidar (4 of 5): front row 39 ft (39–43), 18° rake;
      // behind, 82 ft up and 128 ft back (76–88 ft, 114–134 ft back, each
      // measured section its own).
      stand: { rows: 3, frontRowHeightFt: 39, rakeDeg: 18, backHeightFt: 82, backSetbackFt: 128 },
      sections: withFronts(withBacks({}, { '339': [76, 122], '338': [88, 134], '337': [88, 134], '336': [76, 114] }), {
        '339': 43, '338': 40,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('335', '337', '339'), PNC_LIDAR],
    },
    upper: {
      label: 'Grandstand (300s)',
      // Rows D–Y (and A–Y in a few), covered from row R (sourced; position
      // 12–18). Lidar (18 of 22): front row 76 ft (70–78), 28° rake (23–30),
      // a step above the club's walkway (in 308, 311, 320, 323, 327 and 328
      // the seats run on from ~71 ft with no step, and their covered rows
      // count from there; each takes its own front row). The roof's edge, 120 ft up (its

      // top), is over position 6 (5–10), more than two rows ahead of the
      // source's in 17 of 18, so the tier takes the scan's row (9–10 in six,
      // which take theirs; 329 and 331–333, not measured, keep theirs). Each
      // measured section takes its own back (that edge 27–55 ft in front of
      // the last row; in 311 over its row 9).
      stand: { rows: 20, frontRowHeightFt: 76, rakeDeg: 28, backHeightFt: 120, backSetbackFt: -37, overhang: { coveredFromRow: 6, soffitHeightFt: 120 } },
      sections: withRakes(withFronts(withBacks({
        ...pncCover(['329', '331', '332', '333'], 120),
        ...Object.fromEntries(['308', '323', '327', '328'].map((id) => [id, { overhang: { coveredFromRow: 9, soffitHeightFt: 120 } }])),
        ...Object.fromEntries(['311', '320'].map((id) => [id, { overhang: { coveredFromRow: 10, soffitHeightFt: 120 } }])),
      }, {
        '301': [120, -38], '302': [120, -45], '303': [121, -33],
        '308': [120, -27], '307': [120, -55], '309': [121, -37], '310': [120, -42],
        '311': [120, -27], '312': [121, -42], '330': [121, -27], '328': [121, -37],
        '323': [121, -27], '327': [121, -35], '321': [121, -37], '325': [121, -47],
        '320': [120, -35],
        '322': [120, -36],
      }), {
        '303': 75, '308': 71, '307': 77, '309': 77, '310': 75, '311': 70, '312': 77, '328': 72,
        '323': 71, '327': 71, '325': 78, '322': 75, '320': 71,
        '301': 77,
      }), {
        '308': 29, '311': 30,
      }),
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('301', '307', '312', '320', '325', '333'), PNC_LIDAR],
    },
    upperHome: {
      label: 'Grandstand behind home (313–319)',
      // Rows D–R; "rows M (to Q) and up are shaded during most day games",
      // no covered rows given. Lidar (5 of 7): front row 77 ft (71–78; 313
      // and 318 run on from ~71 ft with no step, each its own), 28°
      // rake; the roof's edge, 120 ft up, is over position 6 (9–10 in 313
      // and 318), which settles the cover; that edge stands 19 ft in front

      // of the last row (6–27; each measured section its own).
      stand: { rows: 15, frontRowHeightFt: 77, rakeDeg: 28, backHeightFt: 121, backSetbackFt: -19, overhang: { coveredFromRow: 6, soffitHeightFt: 120 } },
      sections: withFronts(withBacks({
        '313': { overhang: { coveredFromRow: 10, soffitHeightFt: 120 } },
        '318': { overhang: { coveredFromRow: 9, soffitHeightFt: 120 } },
      }, { '313': [121, -6], '314': [121, -27], '318': [121, -16] }), {
        '317': 78, '313': 71, '318': 71, '319': 78,
      }),

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
 * behind; each measured section takes its own front row and that back, and
 * its own rake where the scan sees 9 or more of its rows and the cuts beside
 * it agree. Each cut runs along the rows' fall line: where that is firmly
 * more than 15° off the club map's direction, the section faces it, or where
 * its rows bend across its width the median of the fall lines in its middle
 * and 4 m to either side (its section file's standRuns); one whose fall
 * lines lie either side of the map's direction keeps it and its tier's rake.
 * Where a deck's edge is more than two rows from the source's
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
      // afternoon games". Lidar (9 of 9; 116 along its rows' fall line, 36°
      // off the map's direction): front row 1 ft below the field (-2 to 2),
      // 10° rake (10–11). The upper deck's front, 61 ft up, reaches out over
      // their row 26 (32–33 of the full 35-row sections; 31 in 116), so the
      // rows from there back are covered, under an underside of ~52 ft (that
      // front row less 9 ft; 50 over 116, its lowest structure); nearer
      // right field (117–119) the mezzanine's front, 49–50 ft, under ~40 ft.
      // Over 120 and 124 the scan sees every row open. Each measured
      // section takes its own back (over 117 the mezzanine's front over row
      // 33; behind 116 and 118 the roof).
      stand: { rows: 35, frontRowHeightFt: -1, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: -2, deckFrontFt: 61, overhang: { coveredFromRow: 26, soffitHeightFt: 52 } },
      sections: withRakes(withFronts(withBacks({
        '116': { overhang: { coveredFromRow: 31, soffitHeightFt: 50 } },
        '117': { deckFrontFt: 49, overhang: { coveredFromRow: 33, soffitHeightFt: 40 } },
        '118': { deckFrontFt: 60, overhang: { coveredFromRow: 33, soffitHeightFt: 51 } },
        '119': { deckFrontFt: 50, overhang: { coveredFromRow: 26, soffitHeightFt: 41 } },
        '120': { noCover: true },
        '124': { noCover: true },
      }, {
        '122': [62, -12], '123': [62, -12], '124': [63, 4], '117': [50, -7],
        '118': [118, 48], '116': [103, 50], '119': [51, -25], '120': [63, 9],
      }), {
        '122': 2, '121': 2, '123': 2, '117': -2,
        '119': 1,
      }), {
        '122': 11, '123': 11,
      }),
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
      sections: withRakes(withFronts({
        '113': { backHeightFt: 51, backSetbackFt: -26, ...comericaCover(['113'], 40)['113'] },
        '112': { frontRowHeightFt: 8, backHeightFt: 84, backSetbackFt: 62, overhang: { coveredFromRow: COMERICA_COVER['112'], soffitHeightFt: 40 } },
        '114': { backHeightFt: 103, backSetbackFt: 24, overhang: { coveredFromRow: 31, soffitHeightFt: 40 } },
        '115': { frontRowHeightFt: 31, overhang: { coveredFromRow: COMERICA_COVER['115'], soffitHeightFt: 45 } },
      }, {
        '112': 8,
      }), {
        '112': 13,
      }),
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
      // is the upper deck's front, 62 ft up and 15 ft behind the last row
      // (1–16 ft, each measured section its own).
      stand: { rows: 25, frontRowHeightFt: -1, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: 15 },
      sections: withRakes(withFronts(withBacks({}, {
        '130': [62, 16], '129': [63, 16], '128': [63, 14], '125': [63, 16], '126': [62, 14],
        '127': [61, 1],
      }), {
        '127': 2,
      }), {
        '127': 11,
      }),
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
      // rises highest behind (each measured section its own).
      stand: { rows: 35, frontRowHeightFt: 2, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: -11, deckFrontFt: 61, overhang: { coveredFromRow: 26, soffitHeightFt: 52 } },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['137', '139'].map((id) => [id, { overhang: { coveredFromRow: 33, soffitHeightFt: id === '137' ? 53 : 52 } }])),

        ...Object.fromEntries(['136', '138'].map((id) => [id, { overhang: { coveredFromRow: 32, soffitHeightFt: 53 } }])),
      }, {
        '139': [62, -6], '138': [63, -9], '137': [62, -6], '134': [63, -12], '133': [62, -14],
        '132': [62, -12], '131': [61, -9], '135': [63, -11],
        '136': [62, -12],
      }), {
        '139': -1, '138': -1, '137': -2, '136': -1,
      }), {
        '134': 11, '133': 11, '132': 11, '131': 11,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('131', '135', '136', '139'), COMERICA_LIDAR],
    },
    leftCorner: {
      label: 'Left-field corner (140–143)',
      // Open but for 143 from row 41 (rows 12–44; sourced). Lidar (4 of 4;
      // 140 and 141 along their rows' fall line, 30–39° off the map's
      // direction): front row at field level (-1 ft; 3 in 143), 10° rake
      // (the lower bowl's; its own four read 10.1–10.8). The upper deck's
      // front, 60–61 ft up, is over 142's row 29, 143's position 23 and
      // 140's and 141's row 32, under ~52 ft (that front row less 9 ft; 51
      // over 141, its lowest structure).
      stand: { rows: 35, frontRowHeightFt: -1, ...COMERICA_LOWER, backHeightFt: 62, backSetbackFt: -16, deckFrontFt: 61 },
      sections: withRakes(withFronts({
        '140': { backHeightFt: 61, backSetbackFt: -12, overhang: { coveredFromRow: 32, soffitHeightFt: 52 } },
        '141': { backHeightFt: 62, backSetbackFt: -12, overhang: { coveredFromRow: 32, soffitHeightFt: 51 } },
        '142': { backHeightFt: 62, backSetbackFt: -19, overhang: { coveredFromRow: 29, soffitHeightFt: 52 } },
        '143': { frontRowHeightFt: 3, backHeightFt: 63, backSetbackFt: -31, overhang: { coveredFromRow: 23, soffitHeightFt: 52 } },
      }, {
        '143': 3,
      }), {
        '141': 10, '142': 11, '143': 11, '140': 10,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('140', '142', '143'), COMERICA_LIDAR],
    },
    leftField: {
      label: 'Left-field pavilion (144–151)',
      // Behind the bullpens, open but for 144 from row DD (sourced): "the
      // most sun of any location". Lidar (8 of 8; 144–146 along their rows'
      // fall lines, 35–40° off the map's direction): front row 6 ft (5–6),
      // 11° rake; behind, 62 ft up and 6 ft in front of the last row (26–173
      // ft, the scoreboard over 149; each its own). Canopies at the top of
      // the pavilion are over the last three rows of 147 and 149, ~34 ft up
      // (42 over 149); along its rows the upper deck's front, 61 ft up, is
      // over 144's position 16, its lowest structure 52 ft. Along 145's and 146's it is over positions
      // 18 and 17, but they stay open as their sources have them: Rate Your
      // Seats' sun on the pavilion from 145 out (comericaShadeReference) has
      // them in the open, and at this corner the deck's end runs across the
      // rows.
      stand: { rows: 33, frontRowHeightFt: 6, rakeDeg: 11, treadFt: 3, backHeightFt: 62, backSetbackFt: -6 },
      sections: withRakes(withBacks({
        '144': { deckFrontFt: 61, overhang: { coveredFromRow: 16, soffitHeightFt: 52 } },
        '147': { overhang: { coveredFromRow: 27, soffitHeightFt: 34 } },
        '149': { overhang: { coveredFromRow: 29, soffitHeightFt: 42 } },
      }, {
        '144': [62, -52], '147': [46, -3], '148': [123, 0], '150': [26, 5], '151': [26, 4],
        '149': [173, -9], '146': [63, -37], '145': [66, -55],
      }), {
        '144': 12,
      }),
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
      // by section. 101 (rows E–T, not measured) ends before where the
      // balcony reaches elsewhere, beyond 102: it takes 102's back, 26 ft
      // up right behind the last row.
      stand: { rows: 33, frontRowHeightFt: 10, rakeDeg: 12, treadFt: 3, backHeightFt: 40, backSetbackFt: -5, overhang: { coveredFromRow: 23, soffitHeightFt: 38 } },
      sections: withRakes(withFronts({
        ...Object.fromEntries(['101', '102'].map((id) => [id, { noCover: true, backHeightFt: 26, backSetbackFt: 1 }])),
        '103': { backHeightFt: 70, backSetbackFt: -5, overhang: { coveredFromRow: 31, soffitHeightFt: 70 } },
        '104': { backHeightFt: 56, backSetbackFt: 7, overhang: { coveredFromRow: 20, soffitHeightFt: 38 } },
        '105': { backHeightFt: 39, backSetbackFt: -31 },
        '106': { backHeightFt: 40, backSetbackFt: -29 },
      }, {
        '105': 8, '102': 11, '103': 11, '106': 8,
      }), {
        '104': 13,
      }),
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
      // takes the shallow front block): front row 50 ft, 25° rake (24–27;
      // 214 straddles a bend, its cut across the rows). The roof is seen 103
      // ft up (its top) past the last rows, so the source's covered rows
      // stay, under it. Behind, 86 ft up and 16 ft back, the median (103 ft
      // right behind 210 and, along its rows' fall line, 215; 65–72 ft far
      // back behind 213 and 214).
      stand: { rows: 28, frontRowHeightFt: 50, rakeDeg: 25, treadFt: 2.8, backHeightFt: 86, backSetbackFt: 16 },
      sections: withBacks(comericaCover(comericaIds(210, 219), 103), {
        '214': [65, 158], '215': [103, 2], '210': [103, 12],
        '213': [72, 129],
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('210', '211', '215', '218', '219'), COMERICA_LIDAR],
    },
    upper: {
      label: 'Upper deck (321–345)',
      // Rows A–F then 1–20, covered from row 15 (sourced). Lidar (21 of 24):
      // front row 62 ft (61–62), 27° rake (21–35); the roof's edge, 118 ft up
      // (its top), is over the source's row in 19 of 21 (row 9 in 341, 16 in
      // 343, which take theirs). It is also what rises highest behind.
      // The scan sees nothing under the roof, so its top stands in for its
      // underside and the tier's heights stay estimated. Each measured
      // section takes its own back.
      stand: { rows: 26, frontRowHeightFt: 62, rakeDeg: 27, treadFt: 2.65, backHeightFt: 118, backSetbackFt: -12, overhang: { coveredFromRow: 21, soffitHeightFt: 118 } },
      sections: withFronts(withBacks({

        ...comericaCover(comericaIds(321, 345), 118),
        '341': { overhang: { coveredFromRow: 15, soffitHeightFt: 118 } },
        '343': { overhang: { coveredFromRow: 22, soffitHeightFt: 118 } },
      }, {
        '333': [118, -7], '336': [118, -14], '331': [118, -14], '330': [118, -14], '329': [118, -14],
        '328': [118, -14], '326': [118, -14], '322': [118, -14], '345': [118, -14], '343': [118, -5],
        '339': [118, -11], '342': [118, -11], '341': [118, -9],
      }), {
        '333': 61, '332': 61, '334': 61, '343': 61, '338': 61, '341': 61,
      }),

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
 * (167–175) and the left-field corner (176–179) is not measured. Each
 * measured section takes its own front row (but 468, whose run starts a row
 * up) and its own back: what rises highest behind it, seen from the middle
 * of its open rows; and its own rake where the scan sees 9 or more of its
 * rows and the cuts beside it agree.
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
      sections: withRakes(withFronts(withBacks({
        '129': { overhang: { coveredFromRow: 19, soffitHeightFt: 20 } },
        '140': { overhang: { coveredFromRow: PROGRESSIVE_COVER['140'], soffitHeightFt: 21 } },
        ...Object.fromEntries(['142', '144', '146', '148'].map((id) => [id, { overhang: { coveredFromRow: 13, soffitHeightFt: 20 } }])),
      }, {
        '129': [139, 25], '140': [139, 43], '142': [139, 21], '144': [136, 31], '146': [138, 21],
        '148': [139, 21],
      }), {
        '128': -1, '130': -1, '131': -1, '134': -1, '136': -1, '138': -1, '142': 4, '144': 4,
        '146': 3, '148': 3,
      }), {
        '129': 12, '142': 12, '144': 12, '146': 12, '148': 12,
      }),
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
      sections: withRakes(withFronts(withBacks({}, { '151': [138, 38], '152': [138, 38], '153': [138, 36], '149': [139, 22] }), {
        '153': 4, '149': 4,
      }), {
        '150': 12, '151': 12, '149': 12,
      }),
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
      // of the last row; nothing over 164's. Seen from the middle of the
      // open rows, the roof canopy rises higher: 139 ft up, 21 ft behind the
      // last row (30–37 behind 164 and 165); each measured section takes its
      // own. 167–175, from row A like 165, keep the estimate behind them and
      // the source's open rows.
      stand: { rows: 29, frontRowHeightFt: 3, rakeDeg: 13, ...PROGRESSIVE_TREAD, backHeightFt: 139, backSetbackFt: 21, overhang: { coveredFromRow: 24, soffitHeightFt: 33 } },
      sections: withRakes(withFronts(withBacks({
        '165': { overhang: { coveredFromRow: 33, soffitHeightFt: 34 } },
        '164': { noCover: true },
        ...Object.fromEntries(['167', '169', '170', '171', '172', '174', '175'].map((id) => [id, { noCover: true, frontRowHeightFt: -1, backHeightFt: 125, backSetbackFt: 100 }])),
      }, {
        '165': [139, 30], '164': [139, 37], '163': [138, 21], '162': [138, 21], '160': [138, 21],
        '158': [139, 23],
      }), {
        '165': -1, '164': 0,
      }), {
        '165': 12, '164': 12,
      }),
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
      // over 182 and 183 (behind them, 71–74 ft up and 30 ft back). Each
      // measured section takes its own back; the tier keeps 182's and 183's,
      // not the six's 98-ft median, which none of them has.
      stand: { rows: 25, frontRowHeightFt: 24, rakeDeg: 29, ...PROGRESSIVE_TREAD, backHeightFt: 73, backSetbackFt: 30, overhang: { coveredFromRow: 16, soffitHeightFt: 67 } },
      sections: withRakes(withFronts(withBacks({
        '181': { overhang: { coveredFromRow: 20, soffitHeightFt: 67 } },
        '184': { overhang: { coveredFromRow: 19, soffitHeightFt: 67 } },
        '180': { overhang: { coveredFromRow: 12, soffitHeightFt: 77 } },
        ...Object.fromEntries(['182', '183'].map((id) => [id, { noCover: true }])),
      }, {
        '185': [67, 16], '184': [124, -17], '183': [71, 29], '182': [74, 30], '181': [123, -17],
        '180': [125, -22],
      }), {
        '185': 32, '184': 20, '181': 20, '180': 31,
      }), {
        '184': 30, '183': 30, '180': 30,
      }),
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
      // floor (30 ft over 107 and 108, at their own 12°).
      stand: { rows: 29, frontRowHeightFt: 6, rakeDeg: 11, ...PROGRESSIVE_TREAD, backHeightFt: 139, backSetbackFt: 34, deckFrontFt: 38, overhang: { coveredFromRow: 27, soffitHeightFt: 29 } },
      sections: withRakes(withFronts(withBacks({
        '113': { overhang: { coveredFromRow: PROGRESSIVE_COVER['113'], soffitHeightFt: 29 } },
        ...Object.fromEntries(['107', '108'].map((id) => [id, { overhang: { coveredFromRow: 27, soffitHeightFt: 30 } }])),
      }, { '103': [139, 44], '113': [139, 30] }), {
        '113': 7,
      }), {
        '107': 12, '108': 12, '113': 10,
      }),
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
      sections: withBacks(progressiveCover(Array.from({ length: 23 }, (_, i) => String(326 + i)), 58), {
        '326': [71, -19], '328': [72, -26], '330': [72, -26], '332': [71, -26], '340': [70, -27],
        '342': [72, -26], '346': [69, -27],
      }),
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
      // back (12–48; each measured section takes its own).
      stand: { rows: 6, frontRowHeightFt: 71, rakeDeg: 30, treadFt: 2.6, backHeightFt: 139, backSetbackFt: 19 },
      sections: withFronts(withBacks({}, {
        '407': [138, 19], '414': [139, 48], '417': [139, 21], '418': [138, 17], '426': [140, 21],
        '427': [139, 17], '476': [139, 21], '475': [139, 21], '432': [139, 21], '436': [139, 21],
        '469': [139, 21], '468': [139, 12], '442': [139, 21], '448': [139, 21], '450': [139, 21],
        '452': [139, 21], '455': [139, 21], '454': [139, 21],
      }), {
        '406': 70, '407': 70, '414': 72, '417': 70, '477': 70, '476': 70, '475': 70, '432': 70,
        '436': 70, '469': 70, '442': 70, '448': 70, '450': 70, '452': 70, '455': 70,

        '454': 70,
      }),

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
 * above them. Each measured section takes its own front row and back (what
 * rises highest behind it, seen from the middle of its open rows), and its
 * own rake where the scan sees 9 or more of its rows and the cuts beside it
 * agree. Each cut runs along the rows' fall line: where that is firmly more
 * than 15° off the club map's direction, the section faces it, or where its
 * rows bend across its width the median of the fall lines in its middle and
 * 4 m to either side (its section file's standRuns); one whose fall lines
 * lie either side of the map's direction keeps it and its tier's rake.
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
      // 12° rake; behind, the canopy 148 ft up and 84 ft back (73–91).
      stand: { rows: 13, frontRowHeightFt: 1, rakeDeg: 12, treadFt: 2.8, backHeightFt: 148, backSetbackFt: 84 },
      sections: withRakes(withFronts(withBacks({}, {
        '2': [148, 80], '3': [148, 73], '4': [148, 83], '6': [148, 81], '8': [148, 91],
        '9': [148, 91], '12': [148, 86], '14': [148, 86], '15': [148, 86], '16': [148, 88],
        '17': [148, 88],
      }), {
        '3': 2, '4': 2, '5': 2, '6': 2, '7': 0, '8': -1, '9': -1, '10': 0, '11': 2, '12': 2, '13': 2,
        '14': 0, '15': 0, '17': 0,
      }), {
        '5': 11, '7': 11, '8': 11, '10': 14, '17': 13,
      }),
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
      // row's floor (30 ft over 108, 112 and 115, at their own 15–16°).
      stand: { rows: 28, frontRowHeightFt: 9, rakeDeg: 14, treadFt: 2.8, backHeightFt: 148, backSetbackFt: -2, deckFrontFt: 37, overhang: { coveredFromRow: 17, soffitHeightFt: 29 } },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['107', '111', '113', '118', '119', '121'].map((id) => [id, { overhang: { coveredFromRow: 14, soffitHeightFt: 28 } }])),
        ...Object.fromEntries(['108', '112', '115'].map((id) => [id, { overhang: { coveredFromRow: 17, soffitHeightFt: 30 } }])),
      }, {
        '108': [148, 1], '110': [148, 1], '111': [148, -4], '112': [148, 0], '113': [148, -5],
        '114': [148, -4], '115': [148, 0], '117': [148, 1], '118': [148, -4], '120': [148, 3],
        '122': [148, 0],
      }), {
        '107': 10, '108': 8, '110': 8, '111': 10, '113': 10, '117': 8, '118': 10, '119': 10,
        '121': 10,
      }), {
        '108': 16, '110': 15, '112': 15, '115': 15,
      }),
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
      sections: withRakes(withFronts(withBacks({
        ...targetCover([...targetIds(101, 104), '124', '125', '126'], 54),
        '105': { deckFrontFt: 37, overhang: { coveredFromRow: TARGET_COVER['105'], soffitHeightFt: 28 } },
        ...Object.fromEntries(['106', '123'].map((id) => [id, { deckFrontFt: 37, overhang: { coveredFromRow: 26, soffitHeightFt: 28 } }])),
      }, {
        '101': [147, 32], '102': [148, 11], '103': [148, -8], '104': [148, 6], '105': [148, 31],
        '106': [148, 31], '123': [148, 31], '124': [148, 4], '125': [148, 1], '126': [146, 17],
        '127': [145, 50],
      }), {
        '104': -1, '105': 2, '106': 2, '123': 2, '124': -1, '126': -1,
      }), {
        '101': 14, '124': 11, '125': 12,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('101', '104', '105', '106', '123', '124', '127'), TARGET_LIDAR],
    },
    club: {
      label: 'Delta SKY360 Club (A–D, K–V)',
      // Rows 1–12 (to 14), covered from row 9 (sourced). Lidar (14 of 15):
      // front row 38 ft, 22° rake; the upper deck's front row, 72–73 ft up,
      // reaches out over row 6, three rows ahead of the source's, so the
      // rows from 6 are covered; its underside is not seen: that row less
      // 9 ft. Seen from the middle of the five open rows, what rises highest
      // behind is the canopy, 148 ft up over the last row; in N, U and V the
      // upper deck's front, 76 ft up, 18–24 ft in front of it.
      stand: { rows: 12, frontRowHeightFt: 38, rakeDeg: 22, treadFt: 2.8, backHeightFt: 148, backSetbackFt: 0, deckFrontFt: 72, overhang: { coveredFromRow: 6, soffitHeightFt: 63 } },
      sections: withBacks({}, {
        'C': [149, 0], 'D': [148, -2], 'K': [148, -2], 'L': [148, -2], 'N': [76, -18],
        'T': [148, 3], 'U': [76, -22], 'V': [76, -24],
      }),
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
      // 6 (its underside that less 9 ft); seen from the middle of the open
      // rows, the canopy rises highest behind, 148 ft up over the last row.
      stand: { rows: 12, frontRowHeightFt: 38, rakeDeg: 22, treadFt: 2.8, backHeightFt: 148, backSetbackFt: -2, deckFrontFt: 72, overhang: { coveredFromRow: 6, soffitHeightFt: 63 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('F', 'H', 'J'), TARGET_LIDAR],
    },
    clubCoverUnsourced: {
      label: 'Delta SKY360 Club (E)',
      // "All seats … shaded during most day games"; no covered rows given.
      // Lidar: front row 38 ft, 21° rake; the upper deck's front row, 72 ft
      // up, reaches out over row 6 (its underside that less 9 ft); seen from
      // the middle of the open rows, the canopy rises highest behind, 148 ft
      // up over the last row.
      stand: { rows: 12, frontRowHeightFt: 38, rakeDeg: 21, treadFt: 2.8, backHeightFt: 148, backSetbackFt: -2, deckFrontFt: 72, overhang: { coveredFromRow: 6, soffitHeightFt: 63 } },
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
      sections: withFronts(withBacks({}, {
        '201': [147, 8], '202': [148, 3], '203': [148, -4], '206': [148, -4], '207': [148, 0],
        '208': [148, 1], '211': [148, 4], '212': [148, 4], '213': [148, -3], '215': [148, -3],
        '216': [148, -3], '218': [148, -3], '220': [148, 0], '221': [148, -2], '222': [148, -2],
        '223': [148, 1], '224': [148, 1], '225': [148, -7], '226': [148, -5], '227': [147, -2],
      }), {
        '224': 74,
        '206': 74,
      }),
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
      sections: withBacks({}, { '230': [63, -2] }),
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
      sections: withBacks({}, { '331': [109, 2], '332': [106, -3], '333': [32, 129], '334': [87, 1] }),
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
      // wall, 18° rake (136 and 139; 137's and 138's cuts are off those
      // beside them and 140 straddles a bend); behind, 32 ft up right behind the last row (44 ft
      // and 68 ft back behind 139, 82 ft and 50 ft back behind 140).
      stand: { rows: 7, frontRowHeightFt: 21, rakeDeg: 18, treadFt: 2.8, backHeightFt: 32, backSetbackFt: 4 },
      sections: withRakes(withFronts(withBacks({}, { '136': [32, 1], '137': [32, 1], '139': [44, 68], '140': [82, 50] }), {
        '136': 22, '138': 20,
      }), { '139': 16 }),

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
      sections: withRakes(withFronts({}, {

        '239': 41, '240': 52,
      }), {
        '239': 36,
      }),
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
/**
 * The lower box's own rakes (lidar), where the scan sees 9 or more of a section's rows, the cuts
 * beside it agree and its cut runs along the rows' fall line (108 straddles a bend: the tier's).
 */
const RATE_LOWER_RAKE: Record<string, number> = {
  '110': 13, '111': 13, '112': 13, '113': 13, '114': 13, '117': 13, '118': 13, '130': 15, '131': 13,
  '151': 13, '152': 13, '154': 13, '156': 13,
};
/** A lower-box section's rise per row, at its own rake. */
const rateRise = (id: string) => 2.75 * Math.tan(((RATE_LOWER_RAKE[id] ?? RATE_LOWER.rakeDeg) * Math.PI) / 180);
/** The lower box's first covered row (position) where the scan's club-deck edge is not the tier's row 26. */
const RATE_EDGE_ROW: Record<string, number> = {
  ...Object.fromEntries(['121', '122', '123', '124', '125', '126', '138', '139', '140', '141', '142', '143'].map((id) => [id, 21])),
  '155': 22, '109': 29, '129': 29,
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
 * gives fewer rows start that many rows up the measured deck. Each measured
 * section takes its own front row (but where its rows start up a slope
 * whose front the cut finds, below) and its own back: what rises highest
 * behind it, seen from the middle of its open rows; and its own rake where
 * the scan sees 9 or more of its rows and the cuts beside it agree (a
 * section that starts up a slope at its own rake starts that far up it).
 * Each cut runs along the rows' fall line: where that is firmly more than
 * 15° off the club map's direction, the section faces it, or where its rows
 * bend across its width the median of the fall lines in its middle and 4 m
 * to either side (its section file's standRuns); one whose fall lines lie
 * either side of the map's direction keeps it and its tier's rake.
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
      // that row on the slope, RATE_FIRST_ROW; their cuts run on from the
      // slope's front, so the scan's front is not theirs; the rest take
      // their own); behind, the roof 130 ft up and 6 ft back (by
      // section, below: 1 ft in front of the last row to 50 ft behind it).
      // The club deck's front row, 48 ft up, reaches out
      // over position 26 (21–22 where a section starts at row 2–5, 29 in 109
      // and 129; sourced 26–31), which the tier takes; its underside is not
      // seen: that row less 9 ft (36 over 109, the lowest structure there).
      // Over 130–134 the scan sees no edge, so their sourced rows stand.
      stand: { rows: 37, ...RATE_LOWER, backHeightFt: 130, backSetbackFt: 6, deckFrontFt: 48, overhang: { coveredFromRow: 26, soffitHeightFt: 39 } },
      sections: withRakes(withFronts(withBacks(Object.fromEntries(Array.from({ length: 49 }, (_, i) => String(108 + i)).map((id) => [id, {
        ...(RATE_FIRST_ROW[id] ? { frontRowHeightFt: RATE_LOWER.frontRowHeightFt + (RATE_FIRST_ROW[id] - 1) * rateRise(id) } : {}),
        ...(RATE_EDGE_ROW[id] ? { overhang: { coveredFromRow: RATE_EDGE_ROW[id], soffitHeightFt: id === '109' ? 36 : 39 } } : {}),
        ...(['130', '131', '132', '133', '134'].includes(id) ? { overhang: { coveredFromRow: RATE_COVER[id], soffitHeightFt: 39 } } : {}),
        ...(RATE_COVER[id] ? {} : { noCover: true }),
      }])), {
        '108': [130, 50], '109': [130, 18], '110': [130, 29], '111': [130, 18], '112': [130, 13],
        '113': [130, 12], '114': [130, 8], '115': [130, 3], '116': [130, 1], '118': [130, 14],
        '119': [128, 8], '120': [130, 11], '121': [130, -2], '126': [130, 0], '127': [130, 10],
        '128': [130, 4], '129': [130, -1], '130': [130, 32], '131': [130, 45], '132': [130, 39],
        '133': [130, 43], '134': [130, 32], '135': [130, 4], '136': [130, -1], '137': [130, 10],
        '143': [130, -2], '144': [130, 11], '145': [130, 8], '146': [130, 4], '147': [130, 0],
        '148': [130, 0], '149': [130, 0], '150': [130, 0], '151': [130, 12], '152': [130, 12],
        '153': [130, 8], '154': [130, 27], '156': [130, 43],
      }), {
        '111': -1, '112': -1, '113': -1, '114': -1, '115': -1, '117': -1, '118': -1, '120': -1,
        '128': -1, '135': -1, '136': 1, '151': -1, '152': -1,
      }), RATE_LOWER_RAKE),
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
      sections: withRakes(withFronts(withBacks({}, {
        '100': [27, 11], '101': [33, 6], '102': [38, 43], '103': [89, 45], '104': [27, 2],
        '105': [36, 40],
      }), {
        '101': 4, '104': 8, '105': 10,
      }), {
        '100': 14, '101': 14,
      }),
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
      // the bottom of its face 45–46 ft up, so those rows are covered. Each
      // section takes its own back; the tier keeps the bleachers' (160, 162,
      // 164: 37 ft, 42–55 ft back), not the eight's 50-ft median.
      stand: { rows: 28, frontRowHeightFt: 5, rakeDeg: 15, backHeightFt: 37, backSetbackFt: 48 },
      sections: withRakes(withFronts(withBacks({
        '158': { overhang: { coveredFromRow: 19, soffitHeightFt: 46 } },

        '159': { overhang: { coveredFromRow: 25, soffitHeightFt: 45 } },
      }, {
        '157': [73, 4], '158': [52, -6], '159': [48, -4], '161': [88, 45],
        '162': [37, 42], '163': [89, 50], '164': [37, 55],
      }), {
        '157': 9, '158': 9,
      }), {
        '159': 14, '160': 14, '163': 14, '164': 14,
      }),
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
      // front of the last row (the roof, 130 ft and 18–26 ft back, behind
      // 312, 316 and 356; each measured section takes its own).
      stand: { rows: 5, frontRowHeightFt: 48, rakeDeg: 28, backHeightFt: 73, backSetbackFt: -3, deckFrontFt: 71, overhang: { coveredFromRow: 4, soffitHeightFt: 62 } },
      sections: withFronts(withBacks({ '312': { overhang: { coveredFromRow: 4, soffitHeightFt: 69 } } }, {
        '312': [130, 22], '314': [72, -3], '316': [130, 18], '342': [72, -3], '356': [130, 26],
      }), {
        '312': 47, '342': 49, '344': 49, '346': 49, '356': 49,
      }),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...rateSections('311', '320', '330', '342', '357'), RATE_LIDAR],
    },
    upper: {
      label: 'Upper deck (506–558)',
      // Rows 1–21, covered from row 9 by the roof (sourced). Lidar (34 of
      // 36; 507–509 and 555 along their rows' fall line, 20–29° off the
      // map's direction): front row 72 ft (70–80), 34° rake (514 straddles a
      // bend, its cut across the rows); the roof's edge is over row 7
      // (2 rows ahead of the source's, which stands; in 508, 509, 522, 526,
      // 538, 542 and 554 the cut starts a few rows up, past an aisle, and
      // counted from row 1 their edge is there too), the bottom of its face
      // 123 ft up (121–124); its top, 130 ft, is what rises behind. Sections
      // the chart gives 18 or 16 rows (covered from 6 or 4) start 3 or 5
      // rows up the deck (77 and 81 ft; 514 and 550 measure 78). The others
      // take their own front row but for the seven cut past an aisle, whose
      // run starts a few rows up: they keep the tier's.
      stand: { rows: 21, frontRowHeightFt: 72, rakeDeg: 34, treadFt: 2.6, backHeightFt: 130, backSetbackFt: -37, overhang: { coveredFromRow: 9, soffitHeightFt: 123 } },
      sections: withRakes(withFronts(withBacks(Object.fromEntries(['514', '516', '518', '524', '540', '546', '548', '550'].map((id) => [id, {
        frontRowHeightFt: RATE_COVER[id] === 4 ? 81 : 77,
        overhang: { coveredFromRow: RATE_COVER[id], soffitHeightFt: 123 },
      }])), {
        '507': [130, -39], '508': [128, -42], '509': [129, -42], '510': [130, -34],
        '512': [130, -36], '514': [130, -36], '518': [130, -28], '522': [130, -42],
        '524': [130, -30], '526': [130, -42], '527': [130, -36], '530': [130, -39],
        '531': [130, -39], '535': [130, -39], '538': [130, -41], '540': [130, -28],
        '542': [130, -42], '544': [130, -36], '546': [130, -34], '550': [130, -38],
        '552': [130, -36], '554': [130, -42], '557': [130, -34],
      }), {
        '520': 73, '527': 71, '556': 73,
      }), {
        '510': 30, '527': 35, '529': 35, '530': 35, '533': 35,
        '555': 35, '557': 29,
        '518': 33,
        '524': 33,
        '528': 33,
        '544': 33,
        '552': 33,
        '556': 33,
        '558': 33,
      }),

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
 * Each measured section takes its own front row (3–4 ft for those that start
 * behind a dugout, which the scan finds directly) and its own back: what
 * rises highest behind it, seen from the middle of its open rows; and its
 * own rake where the scan sees 9 or more of its rows and the cuts beside it
 * agree.
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
      // past the tables; 61 ft behind 112; each measured section its own).
      // A balcony, its underside 33 ft up, reaches over 116's last three
      // rows.
      stand: { rows: 29, ...SUTTER_LOWER, backHeightFt: 56, backSetbackFt: 2 },
      sections: withBacks({ '116': { overhang: { coveredFromRow: 27, soffitHeightFt: 33 } } }, {
        '109': [51, 2], '110': [56, 0], '111': [56, 19], '112': [61, 19], '113': [56, 19],
        '114': [56, 1],
      }),
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
      // 119's; 53 ft and 16 ft back behind 122; each measured section its
      // own). The suite building and a
      // balcony in front of it reach out over row 24 (21 in 118, 30 in 120,
      // 29 in 121), so the rows from there back are covered: under the
      // balcony, the lowest structure 33–38 ft up (the bottom of its face
      // 33 ft over 117); over 119 the building's own roof, 54 ft (its top).
      // Nothing over 122 and 123.
      stand: { rows: 32, ...SUTTER_LOWER, backHeightFt: 55, backSetbackFt: -4, overhang: { coveredFromRow: 24, soffitHeightFt: 35 } },
      sections: withFronts(withBacks({
        '118': { overhang: { coveredFromRow: 21, soffitHeightFt: 33 } },
        '119': { overhang: { coveredFromRow: 24, soffitHeightFt: 54 } },
        '120': { overhang: { coveredFromRow: 30, soffitHeightFt: 35 } },
        '121': { overhang: { coveredFromRow: 29, soffitHeightFt: 38 } },
        '122': { noCover: true },
        // 12 rows; only its own back stands behind it.
        '123': { noCover: true, backHeightFt: SUTTER_LOWER.frontRowHeightFt + 11 * sutterRise + 4, backSetbackFt: 0 },
      }, {
        '117': [54, -1], '118': [56, -6], '119': [55, -23], '120': [56, -7], '121': [54, 2],
        '122': [53, 16],
      }), { '117': 4, '118': 3, '119': 3, '122': 2 }),
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
      // front of 105's last row; each measured section its own). The club's
      // front row, 29 ft up, is over
      // row 26–27 of 103 and 104, so row 27 stands, its underside 9 ft above
      // that row's floor; over 105's row 24 the bottom of a face, 35 ft up,
      // which it takes.
      stand: { rows: 30, ...SUTTER_LOWER, backHeightFt: 52, backSetbackFt: 5 },
      sections: withRakes(withFronts(withBacks({
        ...Object.fromEntries(['103', '104'].map((id) => [id, { deckFrontFt: 29, overhang: { coveredFromRow: 27, soffitHeightFt: 26 } }])),
        '105': { overhang: { coveredFromRow: 24, soffitHeightFt: 35 } },
      }, {
        '102': [49, 39], '103': [49, 5], '104': [49, 5], '105': [56, -16], '106': [54, 4],
        '107': [56, 1],
      }), { '105': 3, '106': 3, '107': 3 }), {
        '102': 12, '103': 12, '104': 12,
      }),

      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO, SUTTER_LIDAR],
    },
    club: {
      label: 'Club (201–206)',
      // Five rows raised behind 101–106, open ("remain sunny the longest").
      // Lidar (5 of 6): front row 31 ft, 22° rake; behind, the club building
      // 49 ft up right behind the last row (each measured section its own).
      stand: { rows: 5, frontRowHeightFt: 31, rakeDeg: 22, treadFt: 2.8, backHeightFt: 49, backSetbackFt: 0 },
      sections: withFronts(withBacks({}, { '201': [49, -2], '202': [49, 2], '205': [49, 2] }), {
        '201': 32, '202': 29, '205': 30,
      }),

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

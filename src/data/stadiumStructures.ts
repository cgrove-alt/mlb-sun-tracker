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
 * with estimated heights moved ±25% (sourced ±10%), and a section whose
 * answer changes is labelled lower confidence.
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

const RYS_YANKEES = 'https://www.rateyourseats.com/yankee-stadium/seating/shaded-covered-seats';
const rysSection = (n: string) => `https://www.rateyourseats.com/yankee-stadium/seating/sections/${n}`;

/**
 * Yankee Stadium (2009). Field level is 12 ft below street level
 * (baseballpilgrimages.com). The NYC building-footprint record for the
 * stadium (BIN 2114490, photogrammetric) gives a roof height of 120 ft above
 * ground, so the canopy top is about 132 ft above the field; its front edge
 * is the 12-ft-tall frieze, so the canopy's underside is about 120 ft up.
 */
const YANKEES: StadiumStructure = {
  stadiumId: 'yankees',
  park: { roof: 'open', farRimHeightFt: 132, fieldCrossingFt: 550 },
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
      // Up to 9 rows, completely uncovered (sourced). Estimated: front row
      // ~2 ft above the field, shallow 12° rake. Directly behind them the
      // whole 100-level bowl rises, so the structure behind is the Main
      // Level's front edge (~30 ft) about 55 ft further back.
      stand: { rows: 9, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 30, backSetbackFt: 55 },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://baseballpilgrimages.com/american/newyork.html', RYS_YANKEES],
    },
    field: {
      label: 'Field level (100s)',
      // Rows 17–26 depending on section (sourced, Rate Your Seats). Covered
      // from about row 14 by the Main Level deck (sourced; varies by
      // section, overrides below). Estimated: front row 4 ft, 20° rake
      // (~1 ft rise per row), deck underside ~26 ft above the field.
      stand: {
        rows: 20,
        frontRowHeightFt: 4,
        rakeDeg: 20,
        backHeightFt: 30,
        overhang: { coveredFromRow: 14, soffitHeightFt: 26 },
      },
      sections: {
        '103': { noCover: true },
        '104': { noCover: true },
        '135': { noCover: true },
        '136': { noCover: true },
        '107': { rows: 21, overhang: { coveredFromRow: 6, soffitHeightFt: 18 } },
        '109': { rows: 24, overhang: { coveredFromRow: 19, soffitHeightFt: 30 } },
        '120B': { rows: 17 },
        '125': { rows: 19 },
        '127B': { rows: 19 },
        '130': { rows: 26, overhang: { coveredFromRow: 23, soffitHeightFt: 33 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_YANKEES, rysSection('107'), rysSection('109'), rysSection('120B'), rysSection('125'), rysSection('127B'), rysSection('130'), 'https://ballparkeguides.com/yankee-stadium-seating/'],
    },
    main: {
      label: 'Main level (200s)',
      // 19–23 rows (sourced). Sections 205–217 and 223–234 covered from row
      // 14 (sourced). Behind home (218–222) the suites sit above, but no
      // source gives a covered row, so no cover is assumed there.
      // Estimated: front row ~31 ft (above the 100s deck), 25° rake, deck
      // underside ~57 ft, suite-level wall behind ~70 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 31,
        rakeDeg: 25,
        backHeightFt: 70,
        overhang: { coveredFromRow: 14, soffitHeightFt: 57 },
      },
      sections: Object.fromEntries([
        ['218A', { rows: 8, noCover: true }], ['218B', { rows: 8, noCover: true }],
        ['219', { rows: 8, noCover: true }], ['220A', { rows: 7, noCover: true }],
        ['220B', { rows: 7, noCover: true }], ['220C', { rows: 7, noCover: true }],
        ['221A', { rows: 8, noCover: true }], ['221B', { rows: 8, noCover: true }],
        ['222', { rows: 8, noCover: true }],
        ['215', { rows: 13, noCover: true }],
        ['229', { rows: 19 }], ['205', { rows: 22 }], ['217', { rows: 23 }], ['233A', { rows: 23 }],
      ]),
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_YANKEES, rysSection('217'), rysSection('220A'), rysSection('229'), rysSection('205'), rysSection('215'), rysSection('233A')],
    },
    terrace: {
      label: 'Terrace level (300s)',
      // 7–10 rows, not covered (sourced). Estimated from the stack below
      // the canopy (see grandstand): the Grandstand's front row is ~96 ft, so
      // the terrace's back row sits just under it at ~82 ft; with a 30° rake
      // its front row is ~69 ft. The Grandstand's front rows (seat backs
      // ~99 ft) rise about 8 ft behind the terrace's last row.
      stand: { rows: 9, frontRowHeightFt: 69, rakeDeg: 30, backHeightFt: 99, backSetbackFt: 8 },
      sections: { '320B': { rows: 10 }, '314': { rows: 8 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysSection('314'), rysSection('320B')],
    },
    grandstand: {
      label: 'Grandstand (400s)',
      // 14 rows (sourced). The canopy along the whole upper-deck roofline
      // covers from about row 6 (sources say 5, 6 or 7). Canopy underside
      // ~120 ft (from the NYC roof height, see above). Estimated so the stack
      // fits under the canopy: with a 30° rake, a front row at ~96 ft puts
      // the 14th row's heads right under its underside.
      stand: {
        rows: 14,
        frontRowHeightFt: 96,
        rakeDeg: 30,
        backHeightFt: 132,
        overhang: { coveredFromRow: 6, soffitHeightFt: 120 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysSection('420B'), 'https://ballparkeguides.com/yankee-stadium-seating/', 'https://baseballpilgrimages.com/american/newyork.html', 'NYC Building Footprints, BIN 2114490 (height_roof 120 ft)'],
    },
    bleachers: {
      label: 'Bleachers',
      // 202–204 (right field) and 235–238 (left field), about 20 rows,
      // uncovered (sourced). Estimated: front row ~10 ft (above the
      // outfield wall), 25° rake, a ~40 ft back wall.
      stand: { rows: 20, frontRowHeightFt: 10, rakeDeg: 25, backHeightFt: 40 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysSection('203'), RYS_YANKEES],
    },
  },
  reviewedOn: '2026-11-10',
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

/**
 * Fenway Park (1912). The lower bowl is one continuous slope: Field Boxes,
 * then Loge Boxes, then the Grandstand under a roof held up by posts, with
 * the pavilion level (clubs, Aura Pavilion, press box) on top of that roof.
 * Row counts come from the club's seat map. Heights are estimates except the
 * Green Monster (37 ft); no source publishes the roof or pavilion heights.
 */
const FENWAY: StadiumStructure = {
  stadiumId: 'redsox',
  park: { roof: 'open', farRimHeightFt: 70, fieldCrossingFt: 450 },
  tierOf: fenwayTier,
  tiers: {
    fieldBox: {
      label: 'Field Box',
      // Uncovered (sourced). Estimated: front row ~2 ft, shallow 14° rake.
      // Behind them the Loge Boxes rise to the Grandstand roof and the
      // pavilion front (~50 ft) about 40 ft further back.
      stand: { rows: 12, frontRowHeightFt: 2, rakeDeg: 14, backHeightFt: 50, backSetbackFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, rysFenway('sections/FB38')],
    },
    logeBox: {
      label: 'Loge Box',
      // Uncovered, rows AA–NN (sourced). Estimated: front row ~10 ft, 16°
      // rake; the Grandstand roof edge and pavilion front (~50 ft) stand
      // just behind the last row.
      stand: { rows: 13, frontRowHeightFt: 10, rakeDeg: 16, backHeightFt: 50, backSetbackFt: 5 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, rysFenway('loge-boxes'), rysFenway('sections/LB122')],
    },
    grandstand: {
      label: 'Grandstand',
      // Every row covered by the roof the pavilion level sits on (sourced).
      // Estimated: front row ~21 ft (behind the Loge), 20° rake, roof
      // underside ~38 ft at its front edge, back wall ~45 ft. With those,
      // a low sun in the fans' faces reaches the front rows under the roof,
      // which matches "covered but late-afternoon sun" in sections 1–6.
      stand: {
        rows: 17,
        frontRowHeightFt: 21,
        rakeDeg: 20,
        backHeightFt: 45,
        overhang: { coveredFromRow: 1, soffitHeightFt: 38 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, rysFenway('sections/GS3'), rysFenway('sections/GS14'), 'https://ballparkeguides.com/fenway-park-seating-guide/'],
    },
    rightFieldBox: {
      label: 'Right Field Box',
      // Uncovered; among the last seats to get shade (sourced). Estimated:
      // front row ~3 ft, 15° rake, the right-field Grandstand roof (~40 ft)
      // just behind.
      stand: { rows: 12, frontRowHeightFt: 3, rakeDeg: 15, backHeightFt: 40, backSetbackFt: 5 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysFenway('right-field-boxes'), RYS_FENWAY],
    },
    bleachers: {
      label: 'Bleachers',
      // Uncovered; no bleacher seat is shaded on day games (sourced).
      // Estimated: front row ~8 ft, 22° rake, a ~45 ft back wall.
      stand: { rows: 20, frontRowHeightFt: 8, rakeDeg: 22, backHeightFt: 45 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, 'https://www.tickpick.com/blog/boston-red-sox-seating-chart-with-seat-views'],
    },
    monster: {
      label: 'Green Monster seats',
      // On top of the 37 ft wall, 3 rows, uncovered, nothing behind but
      // Lansdowne Street (sourced: Wikipedia, Rate Your Seats).
      stand: { rows: 3, frontRowHeightFt: 37, rakeDeg: 10, backHeightFt: 41 },
      rowsFromMap: true,
      heightsSourced: true,
      coverSourced: true,
      sources: ['https://en.wikipedia.org/wiki/Fenway_Park', rysFenway('monster-seats')],
    },
    roofBox: {
      label: 'Roof Box',
      // Rows A–G, uncovered (sourced). Estimated: front row ~45 ft on the
      // first-base roof, 15° rake, an auxiliary press box (~60 ft) behind.
      stand: { rows: 7, frontRowHeightFt: 45, rakeDeg: 15, backHeightFt: 60, backSetbackFt: 3 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysFenway('right-field-roof-boxes'), 'https://en.wikipedia.org/wiki/Fenway_Park'],
    },
    pavilionBox: {
      label: 'Aura Pavilion Box',
      // Covered (sourced; sources differ on whether from row A, B or C, so
      // from row B). Estimated: front row ~55 ft, 15° rake, underside ~66 ft.
      stand: {
        rows: 5,
        frontRowHeightFt: 55,
        rakeDeg: 15,
        backHeightFt: 70,
        overhang: { coveredFromRow: 2, soffitHeightFt: 66 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysFenway('sections/PB10'), RYS_FENWAY, 'https://ballparkeguides.com/fenway-park-seating-guide/'],
    },
    pavilionClub: {
      label: 'Pavilion club (Aura Club, Dell Technologies Club)',
      // Covered: the press box sits overhead (sourced). Estimated heights.
      stand: {
        rows: 5,
        frontRowHeightFt: 58,
        rakeDeg: 12,
        backHeightFt: 75,
        overhang: { coveredFromRow: 1, soffitHeightFt: 68 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_FENWAY, 'https://www.mlb.com/redsox/ballpark/information/guide'],
    },
    auraPavilion: {
      label: 'Aura Pavilion',
      // Level 4 seating down both lines (sourced: Red Sox ballpark guide).
      // Whether it is covered is not clear from the sources, so the
      // confidence check tries it both ways. Estimated heights.
      stand: { rows: 5, frontRowHeightFt: 58, rakeDeg: 15, backHeightFt: 72 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: ['https://www.mlb.com/redsox/ballpark/information/guide', RYS_FENWAY],
    },
    pavilionReserved: {
      label: 'Pavilion Reserved',
      // Rows A–J, uncovered (sourced). Estimated: front row ~60 ft, 25° rake.
      stand: { rows: 10, frontRowHeightFt: 60, rakeDeg: 25, backHeightFt: 80 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysFenway('pavilion-reserved')],
    },
    suite: {
      label: 'Suites',
      // Enclosed suites: one row of seats under the suite ceiling.
      stand: { rows: 1, frontRowHeightFt: 60, rakeDeg: 0, backHeightFt: 72, overhang: { coveredFromRow: 1, soffitHeightFt: 66 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/redsox/ballpark/information/guide'],
    },
  },
  reviewedOn: '2026-11-10',
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

/**
 * Dodger Stadium (1962), five decks stacked into the hillside: Field, Loge,
 * Club, Reserve and the Top Deck behind home. Row letters skip I (the Reserve
 * goes H, J), so "row N" is the 13th row. Rows and covered rows are from Rate
 * Your Seats' section pages. No source publishes deck heights, so every
 * height is estimated by stacking the decks: each deck's underside about 9 ft
 * above the floor of the first row it covers, each deck's front row just above
 * the back of the one below.
 */
const DODGERS: StadiumStructure = {
  stadiumId: 'dodgers',
  // Far rim: the Top Deck's back (~165 ft) about 560 ft from the pavilions.
  park: { roof: 'open', farRimHeightFt: 165, fieldCrossingFt: 560 },
  tierOf: dodgersTier,
  tiers: {
    dugoutClub: {
      label: 'Dugout Club',
      // Rows AA–JJ, at most nine (sourced). Estimated: front row ~2 ft,
      // 12° rake; behind, the Field level rises to the Loge's underside
      // (~33 ft) about 63 ft back.
      stand: { rows: 8, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 33, backSetbackFt: 63 },
      sections: { '9DG': { rows: 4 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('dugout-club'), rysDodgers('sections/1DC'), rysDodgers('sections/9DC')],
    },
    baselineClub: {
      label: 'Baseline Club',
      // Rows 1–6 in front of Field sections 26–43, uncovered (sourced).
      stand: { rows: 6, frontRowHeightFt: 2, rakeDeg: 14, backHeightFt: 33, backSetbackFt: 63 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('field-level'), rysDodgers('sections/27')],
    },
    field: {
      label: 'Field level',
      // Rows A–X (22 rows, no I), covered from row T (19th) by the Loge
      // (sourced). Sections 52 and 53 have rows AA, A–Z (25), so T is their
      // 20th. Estimated:
      // front row ~7 ft (behind the Dugout and Baseline Clubs), 20° rake
      // (~1 ft a row); Loge underside ~33 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 7,
        rakeDeg: 20,
        backHeightFt: 40,
        overhang: { coveredFromRow: 19, soffitHeightFt: 33 },
      },
      sections: {
        '52FD': { rows: 25, overhang: { coveredFromRow: 20, soffitHeightFt: 34 } },
        '53FD': { rows: 25, overhang: { coveredFromRow: 20, soffitHeightFt: 34 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1'), rysDodgers('sections/15'), rysDodgers('sections/46'), rysDodgers('sections/52'), RYS_DODGERS],
    },
    loge: {
      label: 'Loge level',
      // Rows A–W (22), covered from row N (13th) by the Club level above
      // (sourced). Estimated: front row ~36 ft, 24° rake; Club underside
      // ~60 ft; the Club level's wall ~70 ft behind the last row.
      stand: {
        rows: 22,
        frontRowHeightFt: 36,
        rakeDeg: 24,
        backHeightFt: 70,
        overhang: { coveredFromRow: 13, soffitHeightFt: 60 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/124'), rysDodgers('sections/139'), rysDodgers('sections/166'), RYS_DODGERS],
    },
    club: {
      label: 'Club level',
      // Rows A–H, all under the Reserve deck (sourced). Estimated: front row
      // ~72 ft, 25° rake, Reserve underside ~82 ft.
      stand: {
        rows: 8,
        frontRowHeightFt: 72,
        rakeDeg: 25,
        backHeightFt: 90,
        overhang: { coveredFromRow: 1, soffitHeightFt: 82 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/229')],
    },
    infieldReserve: {
      label: 'Infield Reserve (1–11)',
      // Rows A–V (21), covered from row N (13th) by the Top Deck (sourced).
      // Estimated: front row ~92 ft, 30° rake, Top Deck underside ~120 ft.
      stand: {
        rows: 21,
        frontRowHeightFt: 92,
        rakeDeg: 30,
        backHeightFt: 128,
        overhang: { coveredFromRow: 13, soffitHeightFt: 120 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1IR'), rysDodgers('sections/6IR'), rysDodgers('sections/11IR'), rysDodgers('reserve-level')],
    },
    infieldReserveOpen: {
      label: 'Infield Reserve',
      // Rows A–V, no cover (sourced). Estimated as the covered sections.
      stand: { rows: 21, frontRowHeightFt: 92, rakeDeg: 30, backHeightFt: 128 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/15IR'), rysDodgers('reserve-level')],
    },
    lowerReserve: {
      label: 'Lower Reserve',
      // Rows A–V, no cover (sourced). Estimated: front row ~92 ft, 30° rake;
      // behind, the Reserve rows and their roof rise to ~148 ft.
      stand: { rows: 21, frontRowHeightFt: 92, rakeDeg: 30, backHeightFt: 148, backSetbackFt: 10 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/23LR'), rysDodgers('sections/24LR'), rysDodgers('sections/60LR')],
    },
    reserve: {
      label: 'Reserve',
      // Rows AA–JJ (9; Reserve 12 runs to KK), covered from row CC (sourced).
      // Estimated: front row ~128 ft behind the Lower Reserve, 30° rake,
      // roof underside ~140 ft, roof top ~148 ft.
      stand: {
        rows: 9,
        frontRowHeightFt: 128,
        rakeDeg: 30,
        backHeightFt: 148,
        overhang: { coveredFromRow: 3, soffitHeightFt: 140 },
      },
      sections: { '12RS': { rows: 10 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/12R'), rysDodgers('sections/29R'), rysDodgers('sections/30R'), rysDodgers('sections/61R')],
    },
    topDeck: {
      label: 'Top Deck',
      // Rows A–W (22), covered from row O (14th) by a small roof; Top Deck
      // 13 has rows A–R (17), covered from P (sourced). Estimated: front row
      // ~126 ft over the Infield Reserve, 33° rake, roof underside ~158 ft,
      // roof top ~170 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 126,
        rakeDeg: 33,
        backHeightFt: 170,
        overhang: { coveredFromRow: 14, soffitHeightFt: 158 },
      },
      sections: { '13TD': { rows: 17, overhang: { coveredFromRow: 15, soffitHeightFt: 160 } } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/1TD'), rysDodgers('sections/13TD'), rysDodgers('top-deck')],
    },
    pavilion: {
      label: 'Pavilion',
      // Rows A–X (22), covered from row T (19th) by the pavilion roof
      // (sourced). Estimated: front row ~12 ft over the outfield wall, 25°
      // rake, roof underside ~44 ft, roof top ~50 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 12,
        rakeDeg: 25,
        backHeightFt: 50,
        overhang: { coveredFromRow: 19, soffitHeightFt: 44 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysDodgers('sections/301'), rysDodgers('sections/302'), rysDodgers('sections/315'), rysDodgers('pavilion-seats')],
    },
    suite: {
      label: 'Suites and clubs',
      // Enclosed suites and club boxes: one row under the suite ceiling.
      stand: { rows: 1, frontRowHeightFt: 60, rakeDeg: 0, backHeightFt: 72, overhang: { coveredFromRow: 1, soffitHeightFt: 66 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_DODGERS],
    },
  },
  reviewedOn: '2026-11-11',
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

/**
 * Wrigley Field (1914). One lower bowl (front boxes, the 100s, then the 200s
 * under the upper deck) and one upper deck (the 300s in front, the 400s
 * behind, both under the roof), plus the open bleachers. Rows and covered
 * rows are from Rate Your Seats' section pages. No source publishes deck or
 * roof heights, so every height is estimated: a shallow lower bowl rising
 * to the upper deck's underside (~32 ft), the upper deck above it and the
 * roof over its back.
 */
const WRIGLEY: StadiumStructure = {
  stadiumId: 'cubs',
  // Far rim: the upper-deck roof (~72 ft) about 480 ft from the bleachers.
  park: { roof: 'open', farRimHeightFt: 72, fieldCrossingFt: 480 },
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
      // underside ~32 ft at its front edge.
      stand: {
        rows: 22,
        frontRowHeightFt: 27,
        rakeDeg: 18,
        backHeightFt: 50,
        overhang: { coveredFromRow: 1, soffitHeightFt: 32 },
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
      // Rows 1–10 (331: 12), covered by the roof from row 7 (315 and 316
      // from row 5) (sourced). Estimated: front row ~40 ft, 26° rake, roof
      // underside ~57 ft.
      stand: {
        rows: 10,
        frontRowHeightFt: 40,
        rakeDeg: 26,
        backHeightFt: 60,
        overhang: { coveredFromRow: 7, soffitHeightFt: 57 },
      },
      sections: {
        '315L': { overhang: { coveredFromRow: 5, soffitHeightFt: 55 } },
        '316L': { overhang: { coveredFromRow: 5, soffitHeightFt: 55 } },
        '331R': { rows: 12 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysWrigley('sections/305'), rysWrigley('sections/310'), rysWrigley('sections/315'), rysWrigley('sections/320'), rysWrigley('sections/331')],
    },
    upperReserved: {
      label: 'Upper deck (400s)',
      // Rows 1–9, all under the roof (sourced; 419 has rows 5–9).
      // Estimated: front row ~55 ft, 28° rake, roof underside ~64 ft, roof
      // top ~72 ft.
      stand: {
        rows: 9,
        frontRowHeightFt: 55,
        rakeDeg: 28,
        backHeightFt: 72,
        overhang: { coveredFromRow: 1, soffitHeightFt: 64 },
      },
      sections: { '419R': { rows: 5 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysWrigley('sections/405'), rysWrigley('sections/410'), rysWrigley('sections/419'), rysWrigley('sections/425'), RYS_WRIGLEY],
    },
    bleachers: {
      label: 'Bleachers',
      // Rows 1–21 (501: 7–14, 511: 14 rows), uncovered (sourced). Estimated:
      // front row ~12 ft over the ivy wall, 25° rake, a ~42 ft back wall.
      stand: { rows: 21, frontRowHeightFt: 12, rakeDeg: 25, backHeightFt: 42 },
      sections: { '501': { rows: 8 }, '511': { rows: 14 }, '537': { rows: 15 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysWrigley('sections/501'), rysWrigley('sections/505'), rysWrigley('sections/511'), rysWrigley('sections/515'), RYS_WRIGLEY],
    },
  },
  reviewedOn: '2026-11-11',
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

/**
 * Oracle Park (2000). A deep lower bowl (rows to 41) whose back rows sit
 * under the club level, the club level under the View level, and a roof
 * over the View level's last seven rows. Rows and covered rows are from Rate
 * Your Seats' section pages. No source publishes the deck heights, so every
 * height is estimated by stacking the decks.
 */
const ORACLE: StadiumStructure = {
  stadiumId: 'giants',
  // Far rim: the View level's roof (~125 ft) about 480 ft from the outfield seats.
  park: { roof: 'open', farRimHeightFt: 125, fieldCrossingFt: 480 },
  tierOf: oracleTier,
  tiers: {
    lower: {
      label: 'Lower level (100s)',
      // Rows 1–41 (sourced), covered from row 29 by the club level ("row
      // 30 and above in most sections"; section pages say 29). The corner
      // sections are shorter: 101 has rows 1–21 (none covered), 133 rows
      // 28–39, 135 rows 4–39. Estimated: front row ~3 ft, 20° rake (~1 ft a
      // row), club level underside ~40 ft.
      stand: {
        rows: 41,
        frontRowHeightFt: 3,
        rakeDeg: 20,
        backHeightFt: 50,
        overhang: { coveredFromRow: 29, soffitHeightFt: 40 },
      },
      sections: {
        '101': { rows: 22, noCover: true },
        '133': { rows: 11, frontRowHeightFt: 30, overhang: { coveredFromRow: 2, soffitHeightFt: 40 } },
        '135': { rows: 32, frontRowHeightFt: 6, overhang: { coveredFromRow: 26, soffitHeightFt: 40 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/101'), rysOracle('sections/103'), rysOracle('sections/108'), rysOracle('sections/121'), rysOracle('sections/127'), rysOracle('sections/133'), rysOracle('sections/135'), RYS_ORACLE],
    },
    bleachers: {
      label: 'Bleachers',
      // Rows 1–26, uncovered (sourced). Estimated: front row ~10 ft over the
      // left-field wall, 25° rake, a ~45 ft back wall.
      stand: { rows: 26, frontRowHeightFt: 10, rakeDeg: 25, backHeightFt: 45 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/136'), rysOracle('sections/140'), rysOracle('sections/143'), RYS_ORACLE],
    },
    arcade: {
      label: 'Arcade',
      // One to seven rows on top of the 25 ft right-field wall, uncovered
      // (sourced; 145 has rows 1–7, 150 and 152 rows 1–3).
      stand: { rows: 3, frontRowHeightFt: 25, rakeDeg: 10, backHeightFt: 32 },
      sections: { '145': { rows: 7 }, '146': { rows: 7 }, '147': { rows: 7 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/145'), rysOracle('sections/150'), rysOracle('sections/152'), 'https://en.wikipedia.org/wiki/Oracle_Park'],
    },
    club: {
      label: 'Club level',
      // Rows A–M (12, no I), covered from row K (10th) by the View level
      // (sourced); 234 (rows A–H) is covered throughout. Estimated: front
      // row ~48 ft, 25° rake, View level underside ~68 ft.
      stand: {
        rows: 12,
        frontRowHeightFt: 48,
        rakeDeg: 25,
        backHeightFt: 75,
        overhang: { coveredFromRow: 10, soffitHeightFt: 68 },
      },
      sections: {
        '205': { rows: 10 },
        '215': { rows: 8, noCover: true },
        '234': { rows: 8, overhang: { coveredFromRow: 1, soffitHeightFt: 60 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/202'), rysOracle('sections/205'), rysOracle('sections/210'), rysOracle('sections/215'), rysOracle('sections/225'), rysOracle('sections/234'), RYS_ORACLE],
    },
    view: {
      label: 'View level (300s)',
      // Rows A–D then 1–18 (22; 315 and 326 have A–G, 0–18: 26), the roof
      // covering rows 12–18, the last seven (sourced). Estimated: front row
      // ~80 ft, 32° rake, roof underside ~115 ft, roof top ~125 ft.
      stand: {
        rows: 22,
        frontRowHeightFt: 80,
        rakeDeg: 32,
        backHeightFt: 125,
        overhang: { coveredFromRow: 16, soffitHeightFt: 115 },
      },
      sections: {
        '315': { rows: 26, overhang: { coveredFromRow: 20, soffitHeightFt: 121 } },
        '326': { rows: 26, overhang: { coveredFromRow: 20, soffitHeightFt: 121 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysOracle('sections/302'), rysOracle('sections/308'), rysOracle('sections/315'), rysOracle('sections/326'), rysOracle('sections/336'), RYS_ORACLE],
    },
    suite: {
      label: 'Suites',
      stand: { rows: 1, frontRowHeightFt: 62, rakeDeg: 0, backHeightFt: 74, overhang: { coveredFromRow: 1, soffitHeightFt: 68 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/giants/ballpark/seat-map'],
    },
  },
  reviewedOn: '2026-11-11',
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

/**
 * Citi Field (2009). Field boxes, the 100 level (covered from row 27), the
 * Sterling (200) level, the Excelsior (300) level under the 400s, the 400s
 * in the open and the Promenade (500) level under the roof from row 11.
 * Rows and covered rows are from Rate Your Seats' section pages. No source
 * publishes the deck heights, so every height is estimated by stacking the
 * decks.
 */
const CITI: StadiumStructure = {
  stadiumId: 'mets',
  // Far rim: the Promenade roof (~138 ft) about 520 ft from the outfield seats.
  park: { roof: 'open', farRimHeightFt: 138, fieldCrossingFt: 520 },
  tierOf: citiTier,
  tiers: {
    fieldBox: {
      label: 'Field boxes',
      // Rows 1–12, uncovered (sourced). Estimated: front row ~2 ft, 14°
      // rake; behind, the 100 level rises to the deck over its back rows
      // (~43 ft) about 72 ft back.
      stand: { rows: 12, frontRowHeightFt: 2, rakeDeg: 14, backHeightFt: 43, backSetbackFt: 72 },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/15')],
    },
    field: {
      label: 'Field level (100s)',
      // Rows 1–32, covered from row 27 (sourced; 102 has rows 4–13 covered
      // from 11, 108 rows 24–34 from 30, 118 rows 1–8 and 133 rows A–E
      // uncovered). Estimated: front row ~8 ft, 20° rake, deck underside
      // ~43 ft.
      stand: {
        rows: 32,
        frontRowHeightFt: 8,
        rakeDeg: 20,
        backHeightFt: 50,
        overhang: { coveredFromRow: 27, soffitHeightFt: 43 },
      },
      sections: {
        '102': { rows: 10, frontRowHeightFt: 11, overhang: { coveredFromRow: 8, soffitHeightFt: 28 } },
        '108': { rows: 11, frontRowHeightFt: 31, overhang: { coveredFromRow: 7, soffitHeightFt: 46 } },
        '118': { rows: 8, noCover: true },
        '133': { rows: 5, noCover: true },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/102'), rysCiti('sections/108'), rysCiti('sections/114'), rysCiti('sections/121'), rysCiti('sections/128'), RYS_CITI],
    },
    leftOutfield: {
      label: 'Left-field seats (134–139)',
      // Rows 1–19, the upper half covered from row 7 (sourced). Estimated:
      // front row ~10 ft, 22° rake, deck underside ~26 ft.
      stand: {
        rows: 19,
        frontRowHeightFt: 10,
        rakeDeg: 22,
        backHeightFt: 34,
        overhang: { coveredFromRow: 7, soffitHeightFt: 26 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/134'), rysCiti('sections/137'), RYS_CITI],
    },
    rightOutfield: {
      label: 'Right-field seats (140–143)',
      // 140 has rows 1–20, 143 rows 1–3, uncovered (sourced). Estimated.
      stand: { rows: 20, frontRowHeightFt: 8, rakeDeg: 22, backHeightFt: 32 },
      sections: { '143': { rows: 3 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/140'), rysCiti('sections/143')],
    },
    sterling: {
      label: 'Sterling level (200s)',
      // No source gives rows or cover; estimated, and the confidence check
      // tries it with and without cover.
      stand: { rows: 6, frontRowHeightFt: 50, rakeDeg: 22, backHeightFt: 62 },
      heightsSourced: false,
      coverSourced: false,
      sources: [RYS_CITI],
    },
    excelsior: {
      label: 'Excelsior level (300s)',
      // Rows 1–12 (behind home 1–6), covered from row 5 by the 400 level
      // (sourced; 336 from row 6). Estimated: front row ~62 ft, 25° rake,
      // deck underside ~76 ft.
      stand: {
        rows: 12,
        frontRowHeightFt: 62,
        rakeDeg: 25,
        backHeightFt: 82,
        overhang: { coveredFromRow: 5, soffitHeightFt: 76 },
      },
      sections: {
        '312': { rows: 10 },
        '316': { rows: 6 },
        '320': { rows: 6 },
        '326': { rows: 10 },
        '336': { overhang: { coveredFromRow: 6, soffitHeightFt: 77 } },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/306'), rysCiti('sections/312'), rysCiti('sections/316'), rysCiti('sections/326'), rysCiti('sections/333'), rysCiti('sections/336'), RYS_CITI],
    },
    fourHundred: {
      label: '400 level',
      // Rows 1–8 (behind home 1–5), open to the sky (sourced). Estimated:
      // front row ~86 ft, 30° rake; behind, the Promenade's front (~100 ft).
      stand: { rows: 8, frontRowHeightFt: 86, rakeDeg: 30, backHeightFt: 100, backSetbackFt: 6 },
      sections: { '415': { rows: 5 }, '425': { rows: 5 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/405'), rysCiti('sections/415'), rysCiti('sections/425'), rysCiti('sections/435'), RYS_CITI],
    },
    promenade: {
      label: 'Promenade level (500s)',
      // Rows 1–17, covered by the roof from row 11 (sourced). Estimated:
      // front row ~100 ft, 33° rake, roof underside ~127 ft, top ~138 ft.
      stand: {
        rows: 17,
        frontRowHeightFt: 100,
        rakeDeg: 33,
        backHeightFt: 138,
        overhang: { coveredFromRow: 11, soffitHeightFt: 127 },
      },
      heightsSourced: false,
      coverSourced: true,
      sources: [rysCiti('sections/505'), rysCiti('sections/515'), rysCiti('sections/525'), rysCiti('sections/535'), RYS_CITI],
    },
    suite: {
      label: 'Clubs and suites',
      stand: { rows: 1, frontRowHeightFt: 55, rakeDeg: 0, backHeightFt: 66, overhang: { coveredFromRow: 1, soffitHeightFt: 61 } },
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_CITI],
    },
  },
  reviewedOn: '2026-11-11',
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

// The 100 level, shared by its two tiers: rows 1–40, the deck above from
// row 36 (sourced per section below). Estimated: front row ~3 ft, 18° rake,
// deck underside ~46 ft, the 200 level behind ~50 ft.
const CBP_FIELD: StandProfile = {
  rows: 40,
  frontRowHeightFt: 3,
  rakeDeg: 18,
  backHeightFt: 50,
  overhang: { coveredFromRow: 36, soffitHeightFt: 46 },
};

/**
 * Citizens Bank Park (2004). A lower bowl (dugout boxes, the Diamond Club and
 * the 100s), the 200 level with the Hall of Fame Club, suites, the 300s and
 * the Terrace Deck (400s) under the roof from row 9. Right field stacks
 * three decks (100s, 200s, 300s); left field has the 100s and 200s under the
 * main scoreboard. Rows are the club's own seat-map data; which rows are
 * covered is from Rate Your Seats' section pages (row numbers converted to
 * each section's row count, so a section that starts at row 21 counts row 21
 * as its first). No source publishes the deck heights, so every height is
 * estimated by stacking the decks.
 */
const CBP: StadiumStructure = {
  stadiumId: 'phillies',
  // Far rim: the Terrace Deck roof (~132 ft) about 560 ft across the field.
  park: { roof: 'open', farRimHeightFt: 132, fieldCrossingFt: 560 },
  tierOf: cbpTier,
  tiers: {
    dugoutBox: {
      label: 'Dugout boxes',
      // Rows 1–3 at the front of the bowl behind home, uncovered. Estimated:
      // front row ~2 ft, 12° rake; the bowl rises behind them to the deck
      // over the 100s (~50 ft) about 70 ft back.
      stand: { rows: 3, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 50, backSetbackFt: 70 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP],
    },
    diamond: {
      label: 'Diamond Club (A–G)',
      // Rows 5–19, uncovered (sourced). Estimated: row 5 ~6.5 ft on the
      // 100s' 18° rake; the deck over the 100s (~50 ft) about 29 ft back.
      stand: { rows: 15, frontRowHeightFt: 6.5, rakeDeg: 18, backHeightFt: 50, backSetbackFt: 29 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/A'), rysCbp('sections/C'), rysCbp('sections/E'), rysCbp('sections/G')],
    },
    homePlate: {
      label: 'Field level behind home (119–128)',
      // Rows 21–34 behind the Diamond Club, covered from row 29 or 30
      // (sourced). Estimated: row 21 ~21 ft on the 18° rake, deck underside
      // ~40 ft.
      stand: { rows: 14, frontRowHeightFt: 21, rakeDeg: 18, backHeightFt: 50, overhang: { coveredFromRow: 9, soffitHeightFt: 40 } },
      sections: {
        '119': { overhang: { coveredFromRow: 11, soffitHeightFt: 40 } }, // rows 21–31, covered from 31
        '122': { frontRowHeightFt: 23.6, overhang: { coveredFromRow: 7, soffitHeightFt: 40 } }, // rows 24–34, from 30
        '123': { overhang: { coveredFromRow: 10, soffitHeightFt: 40 } },
        '124': { overhang: { coveredFromRow: 10, soffitHeightFt: 40 } },
        '125': { frontRowHeightFt: 23.6, overhang: { coveredFromRow: 7, soffitHeightFt: 40 } }, // rows 24–34, from 30
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['119', '120', '122', '124', '126', '128'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP],
    },
    field: {
      label: 'Field level (100s)',
      stand: CBP_FIELD,
      sections: {
        '108': { frontRowHeightFt: 12, noCover: true }, // rows 11–35; RYS's covered rows (37+) are not in the club's data
        '110': { overhang: { coveredFromRow: 37, soffitHeightFt: 46 } },
        '116': { overhang: { coveredFromRow: 33, soffitHeightFt: 46 } },
        '117': { overhang: { coveredFromRow: 33, soffitHeightFt: 46 } },
        '118': { overhang: { coveredFromRow: 31, soffitHeightFt: 46 } },
        '129': { overhang: { coveredFromRow: 31, soffitHeightFt: 46 } },
        '130': { overhang: { coveredFromRow: 31, soffitHeightFt: 46 } },
        '131': { overhang: { coveredFromRow: 31, soffitHeightFt: 46 } },
        '132': { overhang: { coveredFromRow: 35, soffitHeightFt: 46 } }, // rows A–B then 1–37, covered from 33
        '133': { overhang: { coveredFromRow: 33, soffitHeightFt: 46 } },
        '134': { overhang: { coveredFromRow: 39, soffitHeightFt: 46 } },
        '135': { noCover: true }, // only the wheelchair row behind row 37 is under cover
        '136': { noCover: true },
        '137': { overhang: { coveredFromRow: 34, soffitHeightFt: 46 } },
        '138': { overhang: { coveredFromRow: 33, soffitHeightFt: 46 } },
        '139': { frontRowHeightFt: 12, overhang: { coveredFromRow: 23, soffitHeightFt: 46 } }, // rows 11–37, from 33
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['108', '110', '115', '117', '118', '129', '131', '132', '134', '135', '137', '139'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP],
    },
    fieldCoverUnsourced: {
      label: 'Field level (100s)',
      // 112–114: Rate Your Seats gives no covered rows for these three, so
      // the confidence check tries them with and without the deck. Rows
      // from the club's data; stand as the rest of the 100s.
      stand: CBP_FIELD,
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [CBP_CLUB_MAP, rysCbp('sections/112'), rysCbp('sections/113'), rysCbp('sections/114')],
    },
    rightField: {
      label: 'Right-field seats (101–107)',
      // Rows 1–17, covered by the 200 level from row 11 (sourced; 101 has
      // 7 open rows, 107 rows 4–16 covered from 14). Estimated: front row
      // ~10 ft above the wall, 20° rake, deck underside ~32 ft.
      stand: { rows: 16, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: 40, overhang: { coveredFromRow: 11, soffitHeightFt: 32 } },
      sections: {
        '101': { noCover: true },
        '107': { frontRowHeightFt: 13, overhang: { coveredFromRow: 11, soffitHeightFt: 32 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['101', '102', '104', '106', '107'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP],
    },
    leftField: {
      label: 'Left-field seats (140–148)',
      // Rows 1–24; 142–145 covered by the 200 level from row 20, the rest
      // open (sourced). Estimated: front row ~10 ft above the wall, 20°
      // rake, deck underside ~40 ft, the 200 level behind ~45 ft.
      stand: { rows: 23, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: 45, overhang: { coveredFromRow: 20, soffitHeightFt: 40 } },
      sections: {
        '140': { frontRowHeightFt: 16, noCover: true }, // rows 7–21
        '141': { noCover: true },
        '146': { noCover: true },
        '147': { frontRowHeightFt: 13, noCover: true }, // rows 4–18
        '148': { frontRowHeightFt: 14, noCover: true }, // rows 5–16
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['140', '141', '142', '143', '145', '146', '147', '148'].map((n) => rysCbp(`sections/${n}`))],
    },
    rightField200: {
      label: '200 level, right field (201–205)',
      // Rows 1–13, covered by the 300 level from row 10 (sourced).
      // Estimated: front row ~34 ft, 22° rake, deck underside ~54 ft.
      stand: { rows: 12, frontRowHeightFt: 34, rakeDeg: 22, backHeightFt: 60, overhang: { coveredFromRow: 10, soffitHeightFt: 54 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/201'), rysCbp('sections/203'), rysCbp('sections/205')],
    },
    twoHundred: {
      label: '200 level and Hall of Fame Club',
      // Rows 1–12, covered by the suite level from row 7 (sourced: 206–209
      // from row 9, behind home 220 from row 6 and 221–224 from row 5;
      // 210, 211 and 227 have no covered rows). Estimated: front row ~50 ft
      // above the deck over the 100s, 22° rake, deck underside ~70 ft.
      stand: { rows: 10, frontRowHeightFt: 50, rakeDeg: 22, backHeightFt: 80, overhang: { coveredFromRow: 7, soffitHeightFt: 70 } },
      sections: {
        ...Object.fromEntries(cbpRange(206, 209).map((n) => [n, { overhang: { coveredFromRow: 9, soffitHeightFt: 70 } }])),
        '210': { noCover: true },
        '211': { noCover: true },
        '220': { overhang: { coveredFromRow: 6, soffitHeightFt: 70 } },
        ...Object.fromEntries(cbpRange(221, 224).map((n) => [n, { overhang: { coveredFromRow: 5, soffitHeightFt: 70 } }])),
        '227': { noCover: true }, // 6 rows in the club's data; Rate Your Seats covers from row 7
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['207', '209', '211', '212', '216', '220', '222', '226', '228', '232', '233', '237'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP],
    },
    leftField200: {
      label: '200 level, left field (241–245)',
      // Rows 1–11, open (sourced). Estimated: front row ~34 ft, 22° rake;
      // the main scoreboard stands behind them (~90 ft, about 20 ft back).
      stand: { rows: 11, frontRowHeightFt: 34, rakeDeg: 22, backHeightFt: 90, backSetbackFt: 20 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/241'), rysCbp('sections/243'), rysCbp('sections/245')],
    },
    suite: {
      label: 'Suites',
      stand: { rows: 2, frontRowHeightFt: 64, rakeDeg: 5, backHeightFt: 80, overhang: { coveredFromRow: 1, soffitHeightFt: 76 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('luxury-suites')],
    },
    rightField300: {
      label: '300 level, right field (301–310)',
      // Rows 1–21, under the roof from row 14 (sourced). Estimated: front
      // row ~58 ft, 26° rake, roof underside ~92 ft.
      stand: { rows: 21, frontRowHeightFt: 58, rakeDeg: 26, backHeightFt: 96, overhang: { coveredFromRow: 14, soffitHeightFt: 92 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['301', '303', '305', '307', '310'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP],
    },
    threeHundred: {
      label: '300 level (312–333)',
      // Rows 1–8, open (sourced). Estimated: front row ~80 ft, 26° rake; the
      // Terrace Deck and its roof (~128 ft) rise about 45 ft behind.
      stand: { rows: 8, frontRowHeightFt: 80, rakeDeg: 26, backHeightFt: 128, backSetbackFt: 45 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['313', '315', '318', '320', '324', '328', '331', '333'].map((n) => rysCbp(`sections/${n}`))],
    },
    terrace: {
      label: 'Terrace Deck (400s)',
      // Rows 1–16 (434: 13), under the roof from row 9 (sourced).
      // Estimated: front row ~96 ft, 30° rake, roof underside ~128 ft, top
      // ~132 ft.
      stand: { rows: 16, frontRowHeightFt: 96, rakeDeg: 30, backHeightFt: 132, overhang: { coveredFromRow: 9, soffitHeightFt: 128 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, ...['412', '415', '418', '420', '424', '428', '432', '434'].map((n) => rysCbp(`sections/${n}`)), RYS_CBP],
    },
    wheelchair: {
      label: 'Wheelchair platforms',
      // One row each (the club's data): 412V–432V are row 9 of the Terrace
      // Deck, its first row under the roof; 302V–309V are row 11 of the
      // right-field 300s, in front of their roof. Heights are those rows' on
      // the stands above.
      stand: { rows: 1, frontRowHeightFt: 108.7, rakeDeg: 30, backHeightFt: 132, backSetbackFt: 19, overhang: { coveredFromRow: 1, soffitHeightFt: 128 } },
      sections: Object.fromEntries(cbpRange(302, 309).map((n) => [
        `${n}V`,
        { frontRowHeightFt: 71.4, rakeDeg: 26, backHeightFt: 96, backSetbackFt: 27, noCover: true },
      ])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP, rysCbp('sections/305'), rysCbp('sections/415')],
    },
    bleachers: {
      label: 'Rooftop bleachers',
      // Open rooftop rows beyond center field (the club's 3D map; RB 7 rows,
      // RBW 1). Estimated: front row ~30 ft, 15° rake, nothing behind.
      stand: { rows: 7, frontRowHeightFt: 30, rakeDeg: 15, backHeightFt: 36 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [CBP_CLUB_MAP],
    },
  },
  reviewedOn: '2026-11-11',
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

// The lower bowl along the lines: 13 field rows, a cross-aisle, then the
// 100s, whose rows 8–20 are under the 200 level (sourced; on the photo only
// the 100s' first ~7 rows show beside the cross-aisle). Estimated: field
// front row ~3 ft, 18° rake; 100s front ~15 ft, 22° rake (last row ~36 ft);
// 200-level deck underside ~44 ft, its front ~48 ft high about 24 ft behind
// the field rows' last row.
const TRUIST_FIELD_BACK = { backHeightFt: 48, backSetbackFt: 24 };
const TRUIST_100: StandProfile = {
  rows: 20,
  frontRowHeightFt: 15,
  rakeDeg: 22,
  backHeightFt: 44,
  overhang: { coveredFromRow: 8, soffitHeightFt: 44 },
};

/**
 * Truist Park (2017). Field rows and the 100s form the lower bowl, then the
 * 200 level (club), the 300s (Vista) and the 400s (Grandstand) stacked under
 * a roof canopy that covers the 400s from the first row. The site is tight,
 * so the decks stack high. Rows and covered rows are Rate Your Seats'
 * section pages (row labels converted to counts on the seat map). No source
 * publishes the deck heights (the canopy's engineer gives only its area and
 * that it shades ~60% of fans), so every height is estimated by stacking
 * the decks. A 2019 USGS lidar scan of the park exists (see
 * stadiumGeometryEvidence.ts) and can replace these estimates.
 */
const TRUIST: StadiumStructure = {
  stadiumId: 'braves',
  // Far rim: the roof canopy (~142 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 142, fieldCrossingFt: 550 },
  tierOf: truistTier,
  tiers: {
    clubBoxes: {
      label: 'Truist Club boxes (1–9)',
      // Rows 1–4 or 1–5 at the backstop, uncovered. Estimated: front row
      // ~2 ft, 12° rake; the bowl rises behind them to the 200 level's front
      // (~48 ft) about 46 ft back.
      stand: { rows: 4, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 48, backSetbackFt: 46 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('1', '5', '9')],
    },
    fieldInfield: {
      label: 'Field level (17–34)',
      // Rows 6–13 behind the dugouts and the club boxes, uncovered.
      // Estimated: row 6 ~6 ft, 18° rake.
      stand: { rows: 8, frontRowHeightFt: 6, rakeDeg: 18, ...TRUIST_FIELD_BACK },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('17', '22', '25', '30', '34')],
    },
    fieldBoxes: {
      label: 'Field level (10–16, 35–42)',
      // Rows 1–13 (1–15 in 10 and 42), uncovered.
      stand: { rows: 13, frontRowHeightFt: 3, rakeDeg: 18, ...TRUIST_FIELD_BACK },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('10', '12', '16', '35', '42')],
    },
    hundred: {
      label: 'Field level (100s)',
      // Rows 1–20; 110–118, 122, 130 and 133–143 are under cover from row 8.
      stand: TRUIST_100,
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('110', '114', '118', '122', '130', '133', '138', '143')],
    },
    hundredCoverUnsourced: {
      label: 'Field level (100s)',
      // 120 and 131: Rate Your Seats says only that their back rows (7+,
      // 16+) are shaded late in the afternoon, not which rows are covered.
      stand: TRUIST_100,
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('120', '131'),
    },
    executive: {
      label: 'Executive seats (123–128)',
      // Rows 1–11 behind home under the club level; no source gives the
      // covered rows (only "rows 8+ shaded late afternoon"), so the check
      // tries both. Estimated: front ~14 ft, 22° rake, deck underside ~36 ft.
      stand: { rows: 11, frontRowHeightFt: 14, rakeDeg: 22, backHeightFt: 36, overhang: { coveredFromRow: 8, soffitHeightFt: 36 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('123', '125', '127', '128'),
    },
    rightCorner: {
      label: 'Right-field corner (107–109)',
      // 107 rows 1–8 and 109 rows 1–6 open; 108 (rows 1–10) all under
      // cover. Estimated: front ~15 ft, 22° rake, the 200-level corner
      // (~44 ft) behind.
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
      // check tries both. Estimated: front ~12 ft, 22° rake.
      stand: { rows: 19, frontRowHeightFt: 12, rakeDeg: 22, backHeightFt: 44, overhang: { coveredFromRow: 4, soffitHeightFt: 40 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('144', '145'),
    },
    homeRunPorch: {
      label: 'Home Run Porch (146–151)',
      // Rows 1–27 or 1–29, uncovered ("significant sun exposure").
      // Estimated: front ~9 ft above the wall, 20° rake, the porch's back
      // wall ~45 ft.
      stand: { rows: 29, frontRowHeightFt: 9, rakeDeg: 20, backHeightFt: 45 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [...truistSections('146', '148', '151'), RYS_TRUIST],
    },
    pen: {
      label: 'The Pen (152–155)',
      // Rows 7–24 or 1–24, uncovered. Estimated: front ~8 ft, 20° rake, the
      // structure behind ~40 ft.
      stand: { rows: 24, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('152', '154', '155'),
    },
    chopHouse: {
      label: 'Chop House (156–160)',
      // Rows 1–5 past the right-field wall, uncovered. Estimated: front
      // ~10 ft, 15° rake, the two-storey Chop House (~30 ft) right behind.
      stand: { rows: 5, frontRowHeightFt: 10, rakeDeg: 15, backHeightFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('156', '158', '160'),
    },
    twoHundredCorner: {
      label: '200 level, right-field corner (210–212)',
      // Rows 1–12. Left out of Rate Your Seats' covered list, yet its 212
      // page calls them shaded seats for a day game, so the check tries
      // them with and without a deck overhead. Estimated: front ~48 ft, 24°
      // rake, the 300-level corner ~78 ft behind.
      stand: { rows: 12, frontRowHeightFt: 48, rakeDeg: 24, backHeightFt: 78, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('210', '211', '212'),
    },
    twoHundred: {
      label: '200 level',
      // Rows 1–19; 213–218 and 233–243 under cover from row 14 (sourced).
      // Estimated: front ~48 ft, 24° rake, 300-level underside ~78 ft.
      stand: { rows: 19, frontRowHeightFt: 48, rakeDeg: 24, backHeightFt: 78, overhang: { coveredFromRow: 14, soffitHeightFt: 78 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('213', '214', '215', '239', '243')],
    },
    xfinityClub: {
      label: 'Xfinity Club (220–231)',
      // Rows 1–7 (220: 1–12, 231: 1–11) in front of the club's tables; no
      // source gives covered rows, so the check tries both. Estimated:
      // front ~48 ft, 20° rake, the 300 level (~78 ft) behind the tables.
      stand: { rows: 7, frontRowHeightFt: 48, rakeDeg: 20, backHeightFt: 78, backSetbackFt: 25 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('220', '222', '225', '231'),
    },
    terrace: {
      label: 'Hank Aaron Terrace (244–246)',
      // Rows 1–3 or 1–5, uncovered. Estimated as the 200 level's front.
      stand: { rows: 5, frontRowHeightFt: 48, rakeDeg: 10, backHeightFt: 78, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('244', '245', '246'),
    },
    threeHundred: {
      label: '300 level (Vista)',
      // Rows 1–13; 312–323 and 329–343 under cover from row 10 (sourced).
      // Estimated: front ~82 ft, 28° rake, 400-level underside ~106 ft.
      stand: { rows: 13, frontRowHeightFt: 82, rakeDeg: 28, backHeightFt: 106, overhang: { coveredFromRow: 10, soffitHeightFt: 106 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('312', '318', '323', '329', '337', '343')],
    },
    vistaHome: {
      label: 'Vista home plate (324–328)',
      // Rows 1–7 behind home; no source gives covered rows. Estimated:
      // front ~82 ft, 28° rake, the 400 level (~110 ft) just behind.
      stand: { rows: 7, frontRowHeightFt: 82, rakeDeg: 28, backHeightFt: 110, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: truistSections('324', '325', '326'),
    },
    threeCorner: {
      label: '300 level, left-field corner (344–347)',
      // Rows 1–13; left out of Rate Your Seats' covered list, which stops
      // at 343, but no source says they are open, so the check tries both.
      stand: { rows: 13, frontRowHeightFt: 82, rakeDeg: 28, backHeightFt: 106 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [RYS_TRUIST, ...truistSections('344', '345', '347')],
    },
    fourHundredOpen: {
      label: '400 level, right-field corner (410–412)',
      // Rows 1–12, outside the canopy (sourced: not covered; a reviewer
      // in 411: "no shade at all"). Estimated: front ~110 ft, 32° rake.
      stand: { rows: 12, frontRowHeightFt: 110, rakeDeg: 32, backHeightFt: 132 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: truistSections('410', '411', '412'),
    },
    fourHundred: {
      label: '400 level (Grandstand)',
      // Rows 1–12, all under the roof canopy (sourced, 413–444).
      // Estimated: front ~110 ft, 32° rake, canopy underside ~137 ft.
      stand: { rows: 12, frontRowHeightFt: 110, rakeDeg: 32, backHeightFt: 137, overhang: { coveredFromRow: 1, soffitHeightFt: 137 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TRUIST, ...truistSections('413', '420', '426', '433', '437', '444')],
    },
  },
  reviewedOn: '2026-11-11',
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
// Estimated: the 200 level's underside ~46 ft over the 100s.
const BUSCH_100_SOFFIT_FT = 46;

/**
 * Busch Stadium (2006). Lettered field boxes and the Cardinals Club in front
 * of the 100s, the 200 level (loge, and the club level behind home), the 300s
 * (Pavilion) and the 400s (Terrace) under a small roof. Rows are Rate Your
 * Seats' section pages (lettered rows on the "D" boxes, numbered rows on the
 * main sections) and the club's own data for the Cardinals Club; covered
 * rows are Rate Your Seats'. No source publishes the deck heights, so every
 * height is estimated by stacking the decks.
 */
const BUSCH: StadiumStructure = {
  stadiumId: 'cardinals',
  // Far rim: the roof over the 400s (~120 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 120, fieldCrossingFt: 550 },
  tierOf: buschTier,
  tiers: {
    cardinalsClub: {
      label: 'Cardinals Club (1–8)',
      // Rows A–C at the backstop (club data); open (seen from directly above
      // on the photo). Estimated: front row ~2 ft, 10° rake; the 100s rise
      // behind them to the 200 level's front (~50 ft) about 75 ft back.
      stand: { rows: 3, frontRowHeightFt: 2, rakeDeg: 10, backHeightFt: 50, backSetbackFt: 75 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [BUSCH_CLUB_MAP],
    },
    fieldBoxes: {
      label: 'Field boxes (lettered rows)',
      // Rows A–L (fewer in some) in front of the 100s, open. Estimated:
      // front row ~3 ft, 15° rake; the 200 level's front (~50 ft) about 60 ft
      // behind the last row.
      stand: { rows: 12, frontRowHeightFt: 3, rakeDeg: 15, backHeightFt: 50, backSetbackFt: 60 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: buschSections('132', '135', '140', '142', '155', '158', '161', '167'),
    },
    hundred: {
      label: 'Field level (100s)',
      // Numbered rows; covered by the 200 level from row 21 (128–140), row 24
      // (141–158) or row 20 (160–167), and from row 8 in 170–171. Sections
      // whose rows stop before those (tunnel sections such as 131, 136, 146,
      // 151, 154) are open. Estimated: front row ~12 ft behind the lettered
      // boxes (~5 ft behind home, where there are none), 20° rake.
      stand: { rows: 26, frontRowHeightFt: 12, rakeDeg: 20, backHeightFt: BUSCH_100_SOFFIT_FT },
      sections: {
        ...Object.fromEntries(Object.entries(BUSCH_100_COVER).map(([id, row]) => [id, { overhang: { coveredFromRow: row, soffitHeightFt: BUSCH_100_SOFFIT_FT } }])),
        ...Object.fromEntries(['146', '147', '148', '149', '150', '151', '152', '153', '154'].map((id) => [
          id, { frontRowHeightFt: 5, ...(BUSCH_100_COVER[id] ? { overhang: { coveredFromRow: BUSCH_100_COVER[id], soffitHeightFt: BUSCH_100_SOFFIT_FT } } : {}) },
        ])),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('128', '130', '132', '135', '141', '144', '148', '150', '153', '158', '160', '165', '170')],
    },
    bleachers: {
      label: 'Outfield bleachers (101–111, 189–197)',
      // "One of the least shaded areas", open. Estimated: front ~8 ft above
      // the wall, 20° rake, the structure behind ~30 ft.
      stand: { rows: 20, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: buschSections('101', '107', '111', '189', '193', '197'),
    },
    loge: {
      label: 'Loge (228–240, 261–272)',
      // Rows 1–10 to 1–16. "The last few rows ... are among the best shaded
      // seats on the 200 level, thanks to the overhang above", but no source
      // gives the row, so the check tries both. Estimated: front ~50 ft,
      // 22° rake, the 300 level's underside ~70 ft.
      stand: { rows: 10, frontRowHeightFt: 50, rakeDeg: 22, backHeightFt: 70, overhang: { coveredFromRow: 9, soffitHeightFt: 70 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: buschSections('228', '235', '240', '261', '267', '272'),
    },
    clubLevel: {
      label: 'Club level (241–260)',
      // Rows 1–8 to 1–15, covered from row 9 (sourced); 249–251 have rows
      // 1–8 only, 250 and 258 a drink rail behind row 8 (covered), 260 is
      // all covered. Estimated: front ~50 ft, 20° rake, underside ~68 ft.
      stand: { rows: 15, frontRowHeightFt: 50, rakeDeg: 20, backHeightFt: 68, overhang: { coveredFromRow: 9, soffitHeightFt: 68 } },
      sections: { '260': { overhang: { coveredFromRow: 1, soffitHeightFt: 60 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('241', '249', '250', '257', '258', '259', '260')],
    },
    pavilion: {
      label: 'Pavilion (331–360)',
      // Rows 1–6 or 1–9, open ("among the most exposed"). Estimated: front
      // ~74 ft, 26° rake, the Terrace (400s) rising ~95 ft just behind.
      stand: { rows: 9, frontRowHeightFt: 74, rakeDeg: 26, backHeightFt: 95, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: buschSections('331', '341', '345', '350', '355', '360'),
    },
    pavilionLeft: {
      label: 'Pavilion, left field (361–372)',
      // Rows 1–14, covered from row 8 (sourced). Estimated: front ~74 ft,
      // 26° rake, roof underside ~95 ft.
      stand: { rows: 14, frontRowHeightFt: 74, rakeDeg: 26, backHeightFt: 95, overhang: { coveredFromRow: 8, soffitHeightFt: 95 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_BUSCH, ...buschSections('361', '365', '369', '372')],
    },
    terrace: {
      label: 'Terrace (431–440)',
      // Rows 1–11, covered from row 6 by the roof (sourced). Estimated:
      // front ~98 ft, 30° rake, roof underside ~118 ft.
      stand: { rows: 11, frontRowHeightFt: 98, rakeDeg: 30, backHeightFt: 118, overhang: { coveredFromRow: 6, soffitHeightFt: 118 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: buschSections('431', '433', '435', '437', '440'),
    },
    terraceInfield: {
      label: 'Terrace (441–454)',
      // Rows 1–11, covered from row 4 (sourced); 449–451 (rows 1–8) all
      // covered.
      stand: { rows: 11, frontRowHeightFt: 98, rakeDeg: 30, backHeightFt: 118, overhang: { coveredFromRow: 4, soffitHeightFt: 118 } },
      sections: Object.fromEntries(['449', '450', '451'].map((id) => [id, { overhang: { coveredFromRow: 1, soffitHeightFt: 112 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: buschSections('441', '445', '449', '451', '454'),
    },
    suite: {
      label: 'Suites',
      // The club's map lists S1–S63 and 703A–F as suites: as at the other
      // parks, one row of seats under the suite level's ceiling. Estimated:
      // ~66 ft up, between the club level and the Pavilion.
      stand: { rows: 1, frontRowHeightFt: 66, rakeDeg: 0, backHeightFt: 78, overhang: { coveredFromRow: 1, soffitHeightFt: 72 } },
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
// Estimated: the 200 level's underside ~54 ft over the deep (up to 49-row) 100s.
const NATS_100_SOFFIT_FT = 54;

/**
 * Nationals Park (2008). The Terra Club and Diamond Club behind home, a deep
 * 100 level, the 200s (Mezzanine, the club level and the right-field
 * Terrace), the scoreboard pavilion in right-center, the 300s (Gallery,
 * uncovered) and the 400s (Upper Gallery) under a roof from row C. Rows and
 * covered rows are Rate Your Seats' section pages. No source publishes the
 * deck heights, so every height is estimated by stacking the decks.
 */
const NATS: StadiumStructure = {
  stadiumId: 'nationals',
  // Far rim: the Upper Gallery roof (~135 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 135, fieldCrossingFt: 550 },
  tierOf: natsTier,
  tiers: {
    terraClub: {
      label: 'Terra Club (A–E)',
      // Rows A–L at the backstop (C: A–H), open (seen from directly above on
      // the photo). Estimated: front row ~2 ft, 12° rake; the Diamond Club
      // rises behind them to the club level's front (~58 ft) ~70 ft back.
      stand: { rows: 12, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 58, backSetbackFt: 70 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: natsSections('A', 'C', 'E'),
    },
    diamondClub: {
      label: 'Diamond Club (119–126)',
      // Rows A–U, "elevated about 12 rows off the field" behind the Terra
      // Club; no source gives covered rows, so the check tries both.
      // Estimated: front ~12 ft, 20° rake, the club level's front ~58 ft.
      stand: { rows: 21, frontRowHeightFt: 12, rakeDeg: 20, backHeightFt: 58, backSetbackFt: 15 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: natsSections('119', '122', '126'),
    },
    hundred: {
      label: 'Field level (100s)',
      // Rows A–WW and the like (up to 49 rows); covered by the 200 level from
      // about row RR (per section below). Estimated: front row ~3 ft, 20° rake.
      stand: { rows: 44, frontRowHeightFt: 3, rakeDeg: 20, backHeightFt: NATS_100_SOFFIT_FT },
      sections: Object.fromEntries(Object.entries(NATS_100_COVER).map(([id, row]) => [id, { overhang: { coveredFromRow: row, soffitHeightFt: NATS_100_SOFFIT_FT } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('108', '112', '113', '117', '118', '127', '128', '132', '135', '137')],
    },
    outfield: {
      label: 'Outfield (100–107)',
      // Rows up to 30, open ("very few outfield seats are in the shade").
      // Estimated: front ~10 ft above the wall, 20° rake, concourse ~35 ft.
      stand: { rows: 26, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: 35 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('100', '101', '104', '107')],
    },
    rightField: {
      label: 'Right field (138–143)',
      // Under the scoreboard pavilion: 138 all covered, 139 from row H (its
      // 3rd row), 140–143 from row H (sourced). Estimated: front ~8 ft, 20°
      // rake, the pavilion's underside ~26 ft.
      stand: { rows: 24, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 30, overhang: { coveredFromRow: 8, soffitHeightFt: 26 } },
      sections: {
        '138': { overhang: { coveredFromRow: 1, soffitHeightFt: 26 } },
        '139': { overhang: { coveredFromRow: 3, soffitHeightFt: 26 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('138', '139', '140', '142')],
    },
    mezzanine: {
      label: 'Mezzanine (201–205, 223–235)',
      // Rows A–P under the Gallery deck from row H (201–205) or G (odd
      // 223–235). Estimated: front ~58 ft, 24° rake, deck underside ~76 ft.
      stand: { rows: 16, frontRowHeightFt: 58, rakeDeg: 24, backHeightFt: 76, overhang: { coveredFromRow: 7, soffitHeightFt: 76 } },
      sections: Object.fromEntries(['201', '202', '203', '204', '205'].map((id) => [id, { overhang: { coveredFromRow: 8, soffitHeightFt: 76 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: natsSections('201', '203', '205', '223', '229', '235'),
    },
    clubLevel: {
      label: 'Club level (206–221)',
      // Rows A–J or A–L, covered from row G (sourced). Estimated: front
      // ~58 ft, 22° rake, deck underside ~72 ft.
      stand: { rows: 10, frontRowHeightFt: 58, rakeDeg: 22, backHeightFt: 72, overhang: { coveredFromRow: 7, soffitHeightFt: 72 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('206', '209', '214', '217', '221')],
    },
    terrace: {
      label: 'Right Field Terrace (222–236)',
      // Rows A–X (A, D–X in 224–230), covered from row L (sourced).
      // Estimated: front ~58 ft, 24° rake, the deck above ~82 ft.
      stand: { rows: 24, frontRowHeightFt: 58, rakeDeg: 24, backHeightFt: 82, overhang: { coveredFromRow: 12, soffitHeightFt: 82 } },
      sections: Object.fromEntries(['224', '226', '228', '230'].map((id) => [id, { overhang: { coveredFromRow: 10, soffitHeightFt: 82 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: natsSections('222', '224', '232', '236'),
    },
    pavilion: {
      label: 'Scoreboard Pavilion (238–243)',
      // Rows A–P, "no overhang above them". Estimated: front ~30 ft, 20°
      // rake, the scoreboard structure behind ~60 ft.
      stand: { rows: 16, frontRowHeightFt: 30, rakeDeg: 20, backHeightFt: 60 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: natsSections('238', '240', '243'),
    },
    pavilionCoverUnsourced: {
      label: 'Scoreboard Pavilion (237)',
      // Its page says both "rows G and above are under cover" and "no
      // overhang above them", so the check tries both.
      stand: { rows: 16, frontRowHeightFt: 30, rakeDeg: 20, backHeightFt: 60, overhang: { coveredFromRow: 7, soffitHeightFt: 50 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: natsSections('237'),
    },
    gallery: {
      label: 'Gallery (300s)',
      // Rows A–J or A–L; "nothing in the 300 level is covered". On the photo
      // the 300s' rows end where the Upper Gallery's roof begins (the 400s,
      // ~12.5 m deep, sit under it, covered from row C), so the roof's front
      // edge stands just behind the 300s' last row. Estimated: front ~84 ft,
      // 28° rake, the roof's edge ~132 ft up, ~8 ft behind the last row.
      stand: { rows: 10, frontRowHeightFt: 84, rakeDeg: 28, backHeightFt: 132, backSetbackFt: 8 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('301', '305', '311', '315', '321')],
    },
    upperGallery: {
      label: 'Upper Gallery (400s)',
      // Rows A–N, covered from row C (sourced). Estimated: front ~104 ft,
      // 32° rake, roof underside ~132 ft.
      stand: { rows: 14, frontRowHeightFt: 104, rakeDeg: 32, backHeightFt: 132, overhang: { coveredFromRow: 3, soffitHeightFt: 132 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_NATS, ...natsSections('401', '405', '409', '416', '420')],
    },
    suite: {
      label: 'Suites',
      // The club's map lists them as suites: as at the other parks, one row
      // of seats under the suite level's ceiling. Estimated ~70 ft up.
      stand: { rows: 1, frontRowHeightFt: 70, rakeDeg: 0, backHeightFt: 82, overhang: { coveredFromRow: 1, soffitHeightFt: 76 } },
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

// The Terrace: rows 1–13 under the club level from row 2 (sourced).
// Estimated: front ~30 ft above the field-level rows, 20° rake, the club
// level's underside ~48 ft.
const OPACY_TERRACE: StandProfile = {
  rows: 13,
  frontRowHeightFt: 30,
  rakeDeg: 20,
  backHeightFt: 48,
  overhang: { coveredFromRow: 2, soffitHeightFt: 48 },
};

/**
 * Oriole Park at Camden Yards (1992). Field-level sections (even numbers)
 * with the Terrace (odd numbers) behind them almost entirely under the club
 * level, the club level (200s) and the upper deck (300s) under a roof from
 * row 15. Rows and covered rows are Rate Your Seats' section pages. No
 * source publishes the deck heights, so every height is estimated by
 * stacking the decks.
 */
const OPACY: StadiumStructure = {
  stadiumId: 'orioles',
  // Far rim: the upper deck's roof (~112 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 112, fieldCrossingFt: 550 },
  tierOf: opacyTier,
  tiers: {
    field: {
      label: 'Field level (even numbers)',
      // Rows 1–24 to 1–29, open. Estimated: front row ~3 ft, 18° rake; the
      // club level's edge (~48 ft) over the Terrace's second row, ~8 ft
      // behind the last row.
      stand: { rows: 29, frontRowHeightFt: 3, rakeDeg: 18, backHeightFt: 48, backSetbackFt: 8 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('22', '36', '48', '56', '70', '86')],
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
      // no source gives the covered rows, so the check tries both.
      stand: { ...OPACY_TERRACE, rows: 6 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: opacySections('33', '35', '37', '39', '43'),
    },
    rightCorner: {
      label: 'Right-field corner (1–8)',
      // Rows up to 21 (6: 10–27, 8: 4–27), open ("completely avoid
      // sections 1–8 ... if you want to stay out of the sun").
      stand: { rows: 21, frontRowHeightFt: 5, rakeDeg: 18, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('1', '3', '5', '6', '7', '8')],
    },
    bleachers: {
      label: 'Right-field bleachers (90–98)',
      // Rows 1–15 to 1–23; 92 and 94 covered from row 19 (sourced).
      // Estimated: front ~8 ft above the wall, 20° rake, the structure
      // behind ~30 ft.
      stand: { rows: 23, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 30 },
      sections: {
        '92': { overhang: { coveredFromRow: 19, soffitHeightFt: 30 } },
        '94': { overhang: { coveredFromRow: 19, soffitHeightFt: 30 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: opacySections('90', '92', '94', '96', '98'),
    },
    clubLevel: {
      label: 'Club level (212–264)',
      // Rows 1–9, covered from row 8 (sourced). Estimated: front ~52 ft,
      // 22° rake, the upper deck's underside ~66 ft.
      stand: { rows: 9, frontRowHeightFt: 52, rakeDeg: 22, backHeightFt: 66, overhang: { coveredFromRow: 8, soffitHeightFt: 66 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('212', '230', '242', '256', '264')],
    },
    clubOpen: {
      label: 'Club level, outfield ends (204–210, 268–288)',
      // Rows 1–5 or 1–6, open. Estimated as the club level, with the upper
      // deck (~70 ft) just behind.
      stand: { rows: 6, frontRowHeightFt: 52, rakeDeg: 22, backHeightFt: 70, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: opacySections('204', '210', '268', '278', '288'),
    },
    upper: {
      label: 'Upper deck (300s)',
      // Rows 1–25 (or 1–5 then 9–25), covered from row 15 by the roof
      // (sourced). Estimated: front ~70 ft, 26° rake, roof underside ~110 ft.
      stand: { rows: 25, frontRowHeightFt: 70, rakeDeg: 26, backHeightFt: 110, overhang: { coveredFromRow: 15, soffitHeightFt: 110 } },
      sections: {
        ...Object.fromEntries(OPACY_300_SKIPPING.map((id) => [id, { overhang: { coveredFromRow: 12, soffitHeightFt: 110 } }])),
        '381': { overhang: { coveredFromRow: 8, soffitHeightFt: 110 } }, // rows 8–25
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_OPACY, ...opacySections('308', '312', '330', '342', '360', '381', '388')],
    },
    upperShort: {
      label: 'Upper deck (300s)',
      // 320, 338, 350, 358, 366: rows 1–8 only, in front of the covered
      // rows, so open. Estimated as the upper deck.
      stand: { rows: 8, frontRowHeightFt: 70, rakeDeg: 26, backHeightFt: 110, backSetbackFt: 20 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: opacySections('320', '338', '350', '358', '366'),
    },
    suite: {
      label: 'Suites',
      // The club's map lists them as suites: as at the other parks, one row
      // of seats under the suite level's ceiling. Estimated ~62 ft up.
      stand: { rows: 1, frontRowHeightFt: 62, rakeDeg: 0, backHeightFt: 74, overhang: { coveredFromRow: 1, soffitHeightFt: 68 } },
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
const PETCO_100: StandProfile = { rows: 43, frontRowHeightFt: 3, rakeDeg: 18, backHeightFt: 50 };

/**
 * Petco Park (2004). Field VIP and the Lexus Club behind home, the 100s, the
 * outfield stands, the Terrace level (200s) and the Upper level (300s)
 * covered from row 19. Sections come from the club's seat map, rows and
 * covered rows from Rate Your Seats' section pages. No source publishes the
 * deck heights, so every height is estimated by stacking the decks.
 */
const PETCO: StadiumStructure = {
  stadiumId: 'padres',
  // Far rim: the Upper level's roof (~120 ft) about 540 ft across the field.
  park: { roof: 'open', farRimHeightFt: 120, fieldCrossingFt: 540 },
  tierOf: petcoTier,
  tiers: {
    fieldVip: {
      label: 'Field VIP (101–106)',
      // Rows 8–20 or 8–22, open (seen from directly above on the photo,
      // 18–31 m behind home). Estimated: front ~4 ft, 15° rake; the Lexus
      // Club's overhang (~30 ft) about 30 ft behind the last row.
      stand: { rows: 15, frontRowHeightFt: 4, rakeDeg: 15, backHeightFt: 30, backSetbackFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: petcoSections('101', '102', '104', '106'),
    },
    lexusClub: {
      label: 'Lexus Club (A–L)',
      // Rows 1–10 to 1–20, covered from row 9 (sourced). Estimated: front
      // ~10 ft, 18° rake, deck underside ~30 ft.
      stand: { rows: 15, frontRowHeightFt: 10, rakeDeg: 18, backHeightFt: 34, overhang: { coveredFromRow: 9, soffitHeightFt: 30 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('A', 'C', 'F', 'J', 'L')],
    },
    hundred: {
      label: 'Field level (100s)',
      stand: PETCO_100,
      sections: petcoCover([...Array.from({ length: 18 }, (_, i) => String(107 + i))], 50),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('107', '110', '113', '116', '118', '119', '121', '124')],
    },
    hundredCoverUnsourced: {
      label: 'Field level (100s)',
      // 111, 125 and 127: Rate Your Seats gives no covered rows, so the check
      // tries them with and without the deck.
      stand: PETCO_100,
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: petcoSections('111', '125', '127'),
    },
    leftLower: {
      label: 'Left Field Lower Box (126–134)',
      // Rows A–B and 1–11 (fewer in 130, 134), under the 226–230 deck from
      // row 6 (sourced). Estimated: front ~8 ft, 18° rake, underside ~22 ft.
      stand: { rows: 13, frontRowHeightFt: 8, rakeDeg: 18, backHeightFt: 24 },
      sections: petcoCover(['126', '128', '130', '132', '134'], 22),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: petcoSections('126', '128', '130', '134'),
    },
    rightLower: {
      label: 'Right Field Lower (129–137)',
      // Rows 1–25 (two blocks), covered from row 21 (sourced). Estimated:
      // front ~6 ft, 18° rake, deck underside ~32 ft.
      stand: { rows: 25, frontRowHeightFt: 6, rakeDeg: 18, backHeightFt: 34 },
      sections: petcoCover(['129', '131', '133', '135', '137'], 32),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: petcoSections('129', '131', '133', '137'),
    },
    terraceVip: {
      label: 'Terrace VIP (201–204)',
      // Rows 1–8 or 1–9, open (202 and 204: "rows 5 and above are shaded
      // during most day games"). Estimated: front ~38 ft, 20° rake; the press
      // box (~68 ft) about 10 ft behind.
      stand: { rows: 9, frontRowHeightFt: 38, rakeDeg: 20, backHeightFt: 68, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: petcoSections('201', '202', '203', '204'),
    },
    terraceInfieldOpen: {
      label: 'Terrace Infield (206–210)',
      // Rows 1–10; no covered rows given (only "rows 5+ shaded during most
      // day games"), so the check tries both.
      stand: { rows: 10, frontRowHeightFt: 38, rakeDeg: 22, backHeightFt: 62, overhang: { coveredFromRow: 8, soffitHeightFt: 56 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: petcoSections('206', '208', '210'),
    },
    terrace: {
      label: 'Terrace level (205–223)',
      // Rows 1–13 (205/207: 1–15, 209: 3–15), covered from row 7 (205–209:
      // row 11). Estimated: front ~38 ft, 22° rake, underside ~58 ft.
      stand: { rows: 13, frontRowHeightFt: 38, rakeDeg: 22, backHeightFt: 62, overhang: { coveredFromRow: 7, soffitHeightFt: 58 } },
      sections: petcoCover(['205', '207', '209'], 58),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('205', '209', '211', '216', '219', '223')],
    },
    leftReserved: {
      label: 'Left Field Reserved (226–230)',
      // Rows up to 21, covered from row 17 (sourced). Estimated: front ~25 ft,
      // 22° rake, underside ~48 ft.
      stand: { rows: 21, frontRowHeightFt: 25, rakeDeg: 22, backHeightFt: 50 },
      sections: petcoCover(['226', '228', '230'], 48),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: petcoSections('226', '228', '230'),
    },
    rightUpper: {
      label: 'Right Field Upper (227–235)',
      // Rows 1–25; 227–231 covered from row 23, 233 and 235 open ("all right
      // field seats, especially on the 200 level, are not good for shade").
      // Estimated: front ~32 ft, 22° rake, underside ~58 ft.
      stand: { rows: 25, frontRowHeightFt: 32, rakeDeg: 22, backHeightFt: 60 },
      sections: petcoCover(['227', '229', '231'], 58),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('227', '229', '233', '235')],
    },
    upper: {
      label: 'Upper level (300s)',
      // Rows up to 27 (Upper Box rows in front, Upper Deck behind), covered
      // from row 19 (sourced); 313 and 314 (rows 1–3) and 329 (one row)
      // sit in front of it. Estimated: front ~75 ft, 28° rake, roof
      // underside ~118 ft.
      stand: { rows: 23, frontRowHeightFt: 75, rakeDeg: 28, backHeightFt: 120 },
      sections: petcoCover(Array.from({ length: 30 }, (_, i) => String(300 + i)), 118),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PETCO, ...petcoSections('300', '303', '307', '313', '317', '322', '328', '329')],
    },
    suite: {
      label: 'Suites',
      // The club's suite map: as at the other parks, one row of seats under
      // the suite level's ceiling. Estimated ~58 ft up.
      stand: { rows: 1, frontRowHeightFt: 58, rakeDeg: 0, backHeightFt: 70, overhang: { coveredFromRow: 1, soffitHeightFt: 64 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://mktg.mlbstatic.com/padres/documents/y2026/suites_map.pdf'],
    },
  },
  reviewedOn: '2026-11-11',
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
    stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 59 } },
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

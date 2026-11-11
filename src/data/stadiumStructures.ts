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

export const STADIUM_STRUCTURES: Readonly<Record<string, StadiumStructure>> = {
  yankees: YANKEES,
  redsox: FENWAY,
  dodgers: DODGERS,
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

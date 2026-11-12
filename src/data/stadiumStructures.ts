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

/**
 * Angel Stadium (1966, rebuilt 1998). The Field level (100s), the Terrace
 * (200s) entirely under the Club level, the Club (300s), the 400s and the
 * View level (500s) under a roof from row D; pavilions in both outfields.
 * Rows and covered rows are Rate Your Seats' section pages. No source
 * publishes the deck heights, so every height is estimated by stacking the
 * decks.
 */
const ANGEL: StadiumStructure = {
  stadiumId: 'angels',
  // Far rim: the View level's roof (~118 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 118, fieldCrossingFt: 550 },
  tierOf: angelTier,
  tiers: {
    field: {
      label: 'Field level (100s)',
      // Rows A–Z (C–Z or C–W behind the dugouts and home, AA–BB in front
      // in the corners), open; "only the last row of sections 104–113 is
      // shaded in the middle of the summer". The decks above stack forward,
      // so what stands behind the 100s is the View level's roof: on the
      // photo its front edge is ~44 m from the first-base line, ~11 m behind
      // the 100s' last row (~33 m), and ~60 m from home behind the plate, 20 m
      // behind theirs. Estimated: front row ~4 ft, 18° rake, roof edge ~116 ft.
      stand: { rows: 26, frontRowHeightFt: 4, rakeDeg: 18, backHeightFt: 116, backSetbackFt: 36 },
      sections: Object.fromEntries(['114', '115', '116', '117', '118', '119', '120', '121', '122'].map((id) => [id, { backSetbackFt: 65 }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('101', '104', '110', '114', '118', '122', '126', '130', '135')],
    },
    terrace: {
      label: 'Terrace level (200s)',
      // Rows A–L, every row under the Club level (sourced). Estimated:
      // front ~26 ft, 22° rake, the Club level's underside ~44 ft.
      stand: { rows: 12, frontRowHeightFt: 26, rakeDeg: 22, backHeightFt: 46, overhang: { coveredFromRow: 1, soffitHeightFt: 44 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('201', '209', '213', '221', '229', '233')],
    },
    rightPavilion: {
      label: 'Right-field pavilion (236–240)',
      // Rows A–Z and VV–YY, "zero protection from the sun". Estimated:
      // front ~8 ft above the wall, 20° rake, the back ~40 ft.
      stand: { rows: 30, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('236', '238', '240')],
    },
    rightPavilionUpper: {
      label: 'Right-field pavilion (241–249)',
      // Rows A–M, open (as above). Estimated: front ~36 ft, 24° rake.
      stand: { rows: 13, frontRowHeightFt: 36, rakeDeg: 24, backHeightFt: 54 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('241', '245', '249')],
    },
    leftPavilion: {
      label: 'Left-field pavilion (256–260)',
      // Rows A–Z or G–Z; no source says whether they are covered, so the
      // check tries both. Estimated: front ~8 ft, 20° rake.
      stand: { rows: 22, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 34, overhang: { coveredFromRow: 18, soffitHeightFt: 32 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: angelSections('257', '258', '259', '260'),
    },
    club: {
      label: 'Club level (300s)',
      // Rows A–H (330–351 behind the dugouts and toward right field); "rows E
      // and above are shaded during most day games" but no source says what
      // covers them, so the check tries both. Estimated: front ~48 ft, 22°
      // rake, the 400s' underside ~62 ft, the roof edge (~116 ft) ~30 ft
      // behind the last row.
      stand: { rows: 8, frontRowHeightFt: 48, rakeDeg: 22, backHeightFt: 116, backSetbackFt: 30, overhang: { coveredFromRow: 5, soffitHeightFt: 62 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [RYS_ANGEL, ...angelSections('301', '310', '321', '330', '340', '351')],
    },
    loge: {
      label: '400 level',
      // Rows A–J; no covered rows given ("all seats shaded during most late
      // afternoon games" on the third-base side), so the check tries both.
      // Behind them the View level rises to its roof, whose edge sits over
      // its row D. Estimated: front ~64 ft, 26° rake, roof edge ~116 ft about
      // 12 ft behind the last row.
      stand: { rows: 10, frontRowHeightFt: 64, rakeDeg: 26, backHeightFt: 116, backSetbackFt: 12 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: angelSections('401', '410', '418', '421', '430', '436'),
    },
    view: {
      label: 'View level (500s)',
      // Rows A–R, under the roof from row D (sourced). Estimated: front
      // ~84 ft, 30° rake, roof underside ~116 ft.
      stand: { rows: 18, frontRowHeightFt: 84, rakeDeg: 30, backHeightFt: 118, overhang: { coveredFromRow: 4, soffitHeightFt: 116 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_ANGEL, ...angelSections('501', '510', '520', '530', '540')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~58 ft up.
      stand: { rows: 1, frontRowHeightFt: 58, rakeDeg: 0, backHeightFt: 70, overhang: { coveredFromRow: 1, soffitHeightFt: 64 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/angels/tickets/seating-map/3d'],
    },
  },
  reviewedOn: '2026-11-11',
};

const rysCoors = (path: string) => `https://www.rateyourseats.com/coors-field/seating/${path}`;
const RYS_COORS = rysCoors('shaded-covered-seats');
const coorsSections = (...ids: string[]) => ids.map((n) => rysCoors(`sections/${n}`));
/** Coors Field's covered rows as positions in each section's numbered rows (Rate Your Seats). */
const COORS_COVER: Record<string, number> = {
  '105': 10, '106': 10, '107': 10, '108': 10, '109': 11,
  '115': 37, '116': 37, '117': 37, '118': 32, '119': 32, '120': 32, '121': 32, '122': 28, '123': 28, '124': 28,
  '125': 28, '126': 29, '127': 29, '134': 29, '135': 29, '136': 28, '137': 28, '138': 28, '139': 28,
  '140': 32, '141': 32, '142': 32, '143': 32, '144': 32, '145': 32, '146': 32, '147': 32,
  L311: 19, L313: 19, L319: 19, L343: 19, L345: 19,
  U312: 10, U317: 10, U321: 10, U325: 10, U329: 10, U332: 10, U336: 10, U340: 10, U344: 10,
};
const coorsCover = (ids: readonly string[], soffitHeightFt: number) =>
  Object.fromEntries(ids.filter((id) => COORS_COVER[id]).map((id) => [id, { overhang: { coveredFromRow: COORS_COVER[id], soffitHeightFt } }]));
const coorsIds = (from: number, to: number, prefix = '') => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

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
  return 'rockpile';
}

// What stands behind the 100s: the decks above stack forward under a roof
// whose front edge the photo shows ~47 m (third-base side) to ~57 m
// (first-base side) from the foul lines; the difference is likely the
// photo's lean, so ~52 m, ~14 m behind the 100s' last row (~38 m out).
const COORS_ROOF = { backHeightFt: 100, backSetbackFt: 46 };

/**
 * Coors Field (1995). A deep 100 level (rows to 38, the back under the club
 * level), the club level (200s), suites, the 300s split by a walkway (L in
 * front, U behind, under a roof from row 19), bleachers in right field, the
 * left-field stands and the Rockpile in center. Rows and covered rows are
 * Rate Your Seats' section pages. No source publishes the deck heights, so
 * every height is estimated by stacking the decks.
 */
const COORS: StadiumStructure = {
  stadiumId: 'rockies',
  // Far rim: the roof (~100 ft) about 560 ft across the field.
  park: { roof: 'open', farRimHeightFt: 100, fieldCrossingFt: 560 },
  tierOf: coorsTier,
  tiers: {
    field: {
      label: 'Field level (100s)',
      // Rows 1–38 (fewer in some), covered from row 32 (115–117: 37) by the
      // club level (sourced). Estimated: front row ~4 ft, 20° rake (last row
      // ~41 ft), deck underside ~46 ft.
      stand: { rows: 38, frontRowHeightFt: 4, rakeDeg: 20, ...COORS_ROOF },
      sections: coorsCover(coorsIds(115, 147), 46),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('116', '118', '122', '126', '134', '136', '140', '147')],
    },
    fieldHome: {
      label: 'Field level behind home (128–133)',
      // Rows 4–38. Rate Your Seats calls rows 36, 36, 35, 34, 33 and 28 and
      // up "shaded during most day games" rather than covered; on the photo
      // a shadow band runs over the last rows behind home (41–45 m out),
      // where the club level starts. Modelled as the deck's edge over those
      // rows, but with cover unsourced, so the check also tries them open.
      stand: { rows: 35, frontRowHeightFt: 7, rakeDeg: 20, ...COORS_ROOF, overhang: { coveredFromRow: 32, soffitHeightFt: 48 } },
      sections: {
        '128': { overhang: { coveredFromRow: 33, soffitHeightFt: 48 } },
        '129': { overhang: { coveredFromRow: 33, soffitHeightFt: 48 } },
        '130': { overhang: { coveredFromRow: 32, soffitHeightFt: 48 } },
        '131': { overhang: { coveredFromRow: 31, soffitHeightFt: 48 } },
        '132': { overhang: { coveredFromRow: 30, soffitHeightFt: 48 } },
        '133': { overhang: { coveredFromRow: 25, soffitHeightFt: 48 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: coorsSections('128', '130', '131', '133'),
    },
    rightBleachers: {
      label: 'Right-field seats (105–109)',
      // Rows 2–14, covered from row 11 by the club level (sourced).
      // Estimated: front ~8 ft above the wall, 20° rake, underside ~22 ft.
      stand: { rows: 13, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 26 },
      sections: coorsCover(coorsIds(105, 109), 22),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('105', '107', '109')],
    },
    rightCorner: {
      label: 'Right-field corner (110–114)',
      // Partial sections (rows 3–38 to 22–38), not covered.
      stand: { rows: 20, frontRowHeightFt: 20, rakeDeg: 20, ...COORS_ROOF },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('110', '112', '114')],
    },
    leftCorner: {
      label: 'Left-field corner (148–150)',
      // Rows 5–38 or 14–38, not covered.
      stand: { rows: 25, frontRowHeightFt: 12, rakeDeg: 20, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: coorsSections('148', '149', '150'),
    },
    leftStands: {
      label: 'Left-field stands (151–160)',
      // Rows 2–23 or 2–20, not covered ("in June and July the sunniest
      // seats"). Estimated: front ~8 ft above the wall, 20° rake.
      stand: { rows: 22, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('151', '155', '160')],
    },
    club: {
      label: 'Club level (200s)',
      // Rows 1–13 covered from row 8; 201–209 in right field covered from
      // row 4 (sourced). Estimated: front ~48 ft, 22° rake, underside ~66 ft.
      stand: { rows: 13, frontRowHeightFt: 48, rakeDeg: 22, backHeightFt: 100, backSetbackFt: 20, overhang: { coveredFromRow: 8, soffitHeightFt: 66 } },
      sections: Object.fromEntries(coorsIds(201, 209).map((id) => [id, { overhang: { coveredFromRow: 4, soffitHeightFt: 62 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('201', '205', '214', '221', '227', '234', '241', '247')],
    },
    upperFront: {
      label: 'Upper level (300s, in front of the walkway)',
      // Rows 1–5 or 1–9 in front of the walkway, open; full-height sections
      // (rows 1–25) covered from row 19 by the roof (sourced). Estimated:
      // front ~70 ft, 28° rake, roof underside ~98 ft.
      stand: { rows: 9, frontRowHeightFt: 70, rakeDeg: 28, backHeightFt: 100 },
      sections: coorsCover(['L311', 'L313', 'L319', 'L343', 'L345'], 98),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('311', '315', '319', '331', '343', '345')],
    },
    upperBack: {
      label: 'Upper level (300s, behind the walkway)',
      // Rows 10–25, covered from row 19 (sourced). Estimated: front ~84 ft,
      // 28° rake, roof underside ~98 ft.
      stand: { rows: 16, frontRowHeightFt: 84, rakeDeg: 28, backHeightFt: 100, overhang: { coveredFromRow: 10, soffitHeightFt: 98 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COORS, ...coorsSections('312', '317', '325', '332', '340')],
    },
    rockpile: {
      label: 'The Rockpile (401–403)',
      // Rows 1–30 in center field, not covered.
      stand: { rows: 30, frontRowHeightFt: 10, rakeDeg: 22, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: coorsSections('401', '402', '403'),
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~62 ft up.
      stand: { rows: 1, frontRowHeightFt: 62, rakeDeg: 0, backHeightFt: 74, overhang: { coveredFromRow: 1, soffitHeightFt: 68 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/rockies/ballpark/seat-viewer'],
    },
  },
  reviewedOn: '2026-11-11',
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

// The decks stack forward: on the photo (third-base side, square to the
// line) the stands run from ~8 m to ~25 m out and a bright deck edge starts
// right there, so what stands behind the lower bowl is the upper deck's front
// (estimated ~74 ft) about 10 m behind the 100s' last row.
const KAUFFMAN_UPPER_FRONT = { backHeightFt: 74, backSetbackFt: 33 };

/**
 * Kauffman Stadium (1973, renovated 2009). The 100s and the 200s (Plaza)
 * form the lower bowl, the Plaza's back rows under the Loge (300s), the
 * Loge under the upper deck, and the 400s (single-letter rows A–V in front,
 * double-letter rows AA–ZZ behind) under a roof from row MM. Rows and
 * covered rows are Rate Your Seats' section pages. No source publishes the
 * deck heights, so every height is estimated by stacking the decks.
 */
const KAUFFMAN: StadiumStructure = {
  stadiumId: 'royals',
  // Far rim: the upper deck's roof (~130 ft) about 560 ft across the field.
  park: { roof: 'open', farRimHeightFt: 130, fieldCrossingFt: 560 },
  tierOf: kauffmanTier,
  tiers: {
    field: {
      label: 'Field level (100s)',
      // Rows A–X (fewer in the corners), no cover ("all 100 level sections
      // are exposed to the sun until at least 3:00"). Estimated: front row
      // ~3 ft, 16° rake.
      stand: { rows: 24, frontRowHeightFt: 3, rakeDeg: 16, ...KAUFFMAN_UPPER_FRONT },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('107', '112', '118', '127', '132', '140', '147')],
    },
    outfield: {
      label: 'Outfield seats (101–106, 150–152, 201–203)',
      // A few rows each, no cover ("no cover in the outfield").
      stand: { rows: 4, frontRowHeightFt: 4, rakeDeg: 15, backHeightFt: 12 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('101', '104', '150', '201')],
    },
    plaza: {
      label: 'Plaza (214–241)',
      // Rows AA–TT, covered from row LL (sourced). Estimated: front ~24 ft,
      // 20° rake, the Loge deck's underside ~44 ft.
      stand: { rows: 20, frontRowHeightFt: 24, rakeDeg: 20, backHeightFt: 74, backSetbackFt: 10, overhang: { coveredFromRow: 11, soffitHeightFt: 44 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('214', '219', '225', '232', '241')],
    },
    plazaCorner: {
      label: 'Plaza corners (209–213, 242–246)',
      // Rows AA–TT, covered from row NN (sourced).
      stand: { rows: 20, frontRowHeightFt: 22, rakeDeg: 20, backHeightFt: 74, backSetbackFt: 10, overhang: { coveredFromRow: 13, soffitHeightFt: 44 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('209', '213', '242', '246')],
    },
    plazaOpen: {
      label: 'Plaza ends (206–208, 247–252)',
      // Rows AA–TT, past the end of the Loge deck: no cover given ("247–252
      // get the worst of it" late in the day).
      stand: { rows: 20, frontRowHeightFt: 20, rakeDeg: 20, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('206', '208', '247', '252')],
    },
    loge: {
      label: 'Loge (301–325)',
      // Rows A–G or A–J, all covered by the upper deck (sourced). Estimated:
      // front ~48 ft, 20° rake, the upper deck's underside ~66 ft.
      stand: { rows: 10, frontRowHeightFt: 48, rakeDeg: 20, backHeightFt: 70, overhang: { coveredFromRow: 1, soffitHeightFt: 66 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('303', '310', '316', '325')],
    },
    upper: {
      label: 'Upper deck (400s, rows A–V)',
      // Single-letter rows, no cover. Estimated: front ~74 ft, 30° rake; the
      // double-letter rows rise behind them to the roof (~130 ft).
      stand: { rows: 22, frontRowHeightFt: 74, rakeDeg: 30, backHeightFt: 130, backSetbackFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('404', '409', '417', '427', '439')],
    },
    upperTop: {
      label: 'Upper deck (400s, rows AA–ZZ)',
      // Double-letter rows; 409–431 covered from row MM by the roof
      // (sourced); 402–407 and 433–438 open ("the roof does not reach").
      // Estimated: front ~110 ft, 30° rake, roof underside ~128 ft.
      stand: { rows: 26, frontRowHeightFt: 110, rakeDeg: 30, backHeightFt: 132 },
      sections: Object.fromEntries(['409R', '411R', '412R', '413R', '415R', '417R', '419R', '420R', '421R', '423R', '425R', '427R', '428R', '429R', '431R']
        .map((id) => [id, { overhang: { coveredFromRow: 12, soffitHeightFt: 128 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_KAUFFMAN, ...kauffmanSections('403', '409', '413', '421', '431', '437')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~60 ft up.
      stand: { rows: 1, frontRowHeightFt: 60, rakeDeg: 0, backHeightFt: 72, overhang: { coveredFromRow: 1, soffitHeightFt: 66 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/royals/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-11',
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

// The upper deck's roof stands behind the lower bowl. On the photo, square
// to each line 50 m out, its edge is ~42 m from the first-base line (right
// over the 100s' last rows) and ~57 m from the third-base line (~17 m
// behind them). Estimated ~112 ft up.
const GABP_LOWER = { frontRowHeightFt: 3, rakeDeg: 18 };

/**
 * Great American Ball Park (2003). The Diamond Seats in front of a deep 100
 * level (to row PP), the Club (300s) on the first-base side, the 400s on the
 * third-base side and behind home, and the View level (500s) under a roof.
 * Rows and covered rows are Rate Your Seats' section pages. No source
 * publishes the deck heights, so every height is estimated by stacking the
 * decks.
 */
const GABP: StadiumStructure = {
  stadiumId: 'reds',
  // Far rim: the View level's roof (~112 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 112, fieldCrossingFt: 550 },
  tierOf: gabpTier,
  tiers: {
    diamond: {
      label: 'Diamond Seats (1–5, 22–25)',
      // Rows A–H (D–H in 1) at the backstop, open. Estimated: front ~2 ft,
      // 12° rake; the 100s rise behind them.
      stand: { rows: 8, frontRowHeightFt: 2, rakeDeg: 12, backHeightFt: 112, backSetbackFt: 75 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: gabpSections('1', '3', '22', '25'),
    },
    home: {
      label: 'Field level behind home (122–126)',
      // Rows A–I or A–O behind the Diamond Seats, covered from row H.
      stand: { rows: 15, frontRowHeightFt: 9, rakeDeg: 18, backHeightFt: 112, backSetbackFt: 50, overhang: { coveredFromRow: 8, soffitHeightFt: 22 } },
      sections: gabpCover(gabpIds(122, 126), 22),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('122', '124', '126')],
    },
    first: {
      label: 'Field level, first-base side (127–137)',
      // Up to 42 rows, covered from row EE (sourced). Estimated deck
      // underside ~36 ft; the roof's edge over the last rows.
      stand: { rows: 37, ...GABP_LOWER, backHeightFt: 112, backSetbackFt: 5 },
      sections: gabpCover(gabpIds(127, 137), 36),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('127', '130', '132', '136', '137')],
    },
    third: {
      label: 'Field level, third-base side (107–112, 121)',
      // 108–112 covered from row KK, 121 from FF (sourced); 107 open.
      stand: { rows: 30, ...GABP_LOWER, backHeightFt: 112, backSetbackFt: 56 },
      sections: gabpCover(['108', '109', '110', '111', '112', '121'], 36),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('107', '108', '110', '112', '121')],
    },
    thirdCoverUnsourced: {
      label: 'Field level, third-base side (113–120)',
      // Rows to GG; Rate Your Seats gives no covered rows (120: "GG and
      // up shaded late afternoon"), so the check tries both.
      stand: { rows: 28, ...GABP_LOWER, backHeightFt: 112, backSetbackFt: 56, overhang: { coveredFromRow: 22, soffitHeightFt: 34 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: gabpSections('113', '116', '120'),
    },
    leftField: {
      label: 'Left field (101–106)',
      // Rows A–Q; 101–105 covered from row J by the deck above (sourced).
      stand: { rows: 17, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 40, overhang: { coveredFromRow: 10, soffitHeightFt: 22 } },
      sections: { '106': { noCover: true } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('101', '104', '106')],
    },
    rightField: {
      label: 'Right field (138–146)',
      // The Sun/Moon Deck, open ("avoid the seats beyond the right field
      // wall at all costs").
      stand: { rows: 26, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('138', '140', '143', '146')],
    },
    twoHundred: {
      label: '200 level (220–228)',
      // Rows A–C behind home; no covered rows given ("shaded during most
      // late afternoon games"), so the check tries both.
      stand: { rows: 3, frontRowHeightFt: 36, rakeDeg: 10, backHeightFt: 112, backSetbackFt: 40, overhang: { coveredFromRow: 2, soffitHeightFt: 46 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: gabpSections('220', '224', '228'),
    },
    club: {
      label: 'Club (301–307)',
      // 301–305 covered from row G (sourced).
      stand: { rows: 14, frontRowHeightFt: 44, rakeDeg: 20, backHeightFt: 112, backSetbackFt: 10, overhang: { coveredFromRow: 7, soffitHeightFt: 62 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('301', '303', '305')],
    },
    clubCoverUnsourced: {
      label: 'Club (306–307)',
      stand: { rows: 13, frontRowHeightFt: 44, rakeDeg: 20, backHeightFt: 112, backSetbackFt: 10, overhang: { coveredFromRow: 7, soffitHeightFt: 62 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: gabpSections('306', '307'),
    },
    fourHundred: {
      label: '400 level (401–419)',
      // 401–406 covered from row V, 411–419 from row Q (sourced).
      stand: { rows: 18, frontRowHeightFt: 48, rakeDeg: 24, backHeightFt: 112, overhang: { coveredFromRow: 17, soffitHeightFt: 74 } },
      sections: gabpCover(gabpIds(401, 419), 74),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('401', '405', '411', '419')],
    },
    fourHundredFront: {
      label: '400 level (420–437)',
      // Rows A–F, open; rows D and up "shaded during most late afternoon
      // games" on the first-base side. Estimated: front ~52 ft, 20° rake,
      // the View level rising behind (~80 ft) ~10 ft back.
      stand: { rows: 6, frontRowHeightFt: 52, rakeDeg: 20, backHeightFt: 80, backSetbackFt: 10 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: gabpSections('420', '428', '430', '437'),
    },
    upperThird: {
      label: 'View level, third-base side (509–519)',
      // Rows A–R, covered from row L (sourced). Estimated: front ~80 ft, 30°
      // rake, roof underside ~110 ft.
      stand: { rows: 18, frontRowHeightFt: 80, rakeDeg: 30, backHeightFt: 112, overhang: { coveredFromRow: 12, soffitHeightFt: 110 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('509', '514', '519')],
    },
    upperFirst: {
      label: 'View level, home and first-base side (520–537)',
      // Rows A–V, covered from row O (sourced).
      stand: { rows: 22, frontRowHeightFt: 76, rakeDeg: 30, backHeightFt: 112, overhang: { coveredFromRow: 15, soffitHeightFt: 110 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_GABP, ...gabpSections('520', '528', '537')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~60 ft up.
      stand: { rows: 1, frontRowHeightFt: 60, rakeDeg: 0, backHeightFt: 72, overhang: { coveredFromRow: 1, soffitHeightFt: 66 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/reds/ballpark/netting'],
    },
  },
  reviewedOn: '2026-11-11',
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

/**
 * PNC Park (2001). A lower bowl of field-level sections (1–32, rows A–M) and
 * the 100s behind them (rows to HH or KK, the back under the club deck),
 * the club level (200s) with suites, and the upper deck (300s) under a roof
 * from about row R; bleachers and a rooftop in left field. Rows and covered
 * rows are Rate Your Seats' section pages. On the photo, square to the
 * first-base line, the lower bowl runs ~10–48 m back and the top of the
 * upper deck ~60 m. No source publishes the deck heights, so every height
 * is estimated by stacking the decks.
 */
const PNC: StadiumStructure = {
  stadiumId: 'pirates',
  // Far rim: the upper deck's top (~100 ft) about 540 ft across the field.
  park: { roof: 'open', farRimHeightFt: 100, fieldCrossingFt: 540 },
  tierOf: pncTier,
  tiers: {
    field: {
      label: 'Field level (1–32)',
      // Rows A–M (D–M or F–M in some), open ("rarely in the shade").
      // Estimated: front ~3 ft, 15° rake; the upper deck's top (~100 ft)
      // ~37 m behind the last row.
      stand: { rows: 13, frontRowHeightFt: 3, rakeDeg: 15, backHeightFt: 100, backSetbackFt: 120 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('1', '10', '16', '17', '25', '32')],
    },
    hundred: {
      label: 'Infield and baseline boxes (101–132)',
      // Rows A–HH (to KK behind home), covered from row W by the club deck
      // (sourced; 129 from W of F–HH, 132 from AA). Estimated: front ~14 ft,
      // 18° rake, deck underside ~48 ft.
      stand: { rows: 34, frontRowHeightFt: 14, rakeDeg: 18, backHeightFt: 100, backSetbackFt: 40, overhang: { coveredFromRow: 23, soffitHeightFt: 48 } },
      sections: pncCover(['129', '132'], 48),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('101', '109', '113', '116', '120', '128', '129', '132')],
    },
    leftCorner: {
      label: 'Left-field corner (133–138)',
      // Rows A–F to A–P, open ("among the worst seats for shade").
      stand: { rows: 12, frontRowHeightFt: 8, rakeDeg: 18, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('133', '135', '138')],
    },
    rightField: {
      label: 'Right field (139–147)',
      // Rows A–G to A–M along the river, open ("all outfield seating is
      // exposed").
      stand: { rows: 13, frontRowHeightFt: 8, rakeDeg: 18, backHeightFt: 20 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('139', '142', '147')],
    },
    club: {
      label: 'Baseball Club (201–228)',
      // Rows A–K (A–B, A–C at the ends), "rarely in the shade". Estimated:
      // front ~52 ft, 20° rake, the upper deck rising behind.
      stand: { rows: 11, frontRowHeightFt: 52, rakeDeg: 20, backHeightFt: 100, backSetbackFt: 25 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('201', '209', '214', '220', '228')],
    },
    bleachers: {
      label: 'Left-field bleachers (235–238)',
      // Rows A–R, open ("always a heavy dose of sun").
      stand: { rows: 18, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: 34 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('235', '238')],
    },
    rooftop: {
      label: 'Left-field rooftop (335–339)',
      // Rows A–C, open.
      stand: { rows: 3, frontRowHeightFt: 40, rakeDeg: 10, backHeightFt: 46 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('335', '337', '339')],
    },
    upper: {
      label: 'Grandstand (300s)',
      // Rows D–Y (and A–Y in a few), covered from row R (sourced). Estimated:
      // front ~66 ft, 30° rake, roof underside ~98 ft.
      stand: { rows: 20, frontRowHeightFt: 66, rakeDeg: 30, backHeightFt: 102, overhang: { coveredFromRow: 15, soffitHeightFt: 98 } },
      sections: pncCover(Array.from({ length: 33 }, (_, i) => String(301 + i)), 98),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PNC, ...pncSections('301', '307', '312', '320', '325', '333')],
    },
    upperHome: {
      label: 'Grandstand behind home (313–319)',
      // Rows D–R; "rows M (to Q) and up are shaded during most day games"
      // but no covered rows given, so the check tries both.
      stand: { rows: 15, frontRowHeightFt: 66, rakeDeg: 30, backHeightFt: 102, overhang: { coveredFromRow: 11, soffitHeightFt: 96 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: pncSections('313', '316', '319'),
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~56 ft up.
      stand: { rows: 1, frontRowHeightFt: 56, rakeDeg: 0, backHeightFt: 68, overhang: { coveredFromRow: 1, soffitHeightFt: 62 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/pirates/ballpark/seating-map/3d'],
    },
  },
  reviewedOn: '2026-11-11',
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
/** The sections whose front rows give way to a dugout start at row 7 (Rate Your Seats). */
const behindDugout = (ids: readonly string[]) => Object.fromEntries(ids.map((id) => [id, { frontRowHeightFt: 10 }]));

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

// The lower bowl along each line, square to it on the photo: rows 1–35 from
// ~12 m to the walkway ~44 m back (a ~3 ft tread); behind the dugouts rows
// 7–35 from ~21 m. Estimated: front ~3 ft, 20° rake.
const COMERICA_LOWER = { frontRowHeightFt: 3, rakeDeg: 20, treadFt: 3 };

/**
 * Comerica Park (2000). A lower bowl to row 35 with the Tiger Den (rows A–H)
 * behind it from dugout to dugout and terraces (rows A–H) behind the
 * baselines; the mezzanine (210–219) over the first-base side and the right-
 * field corner, under a roof from its row 17; the upper deck (321–346) from
 * the first-base dugout round to the left-field corner, under a roof from
 * its row 15. Rows and covered rows are Rate Your Seats' section pages. On
 * the 2022 USGS photo, square to the first-base line, the mezzanine's seats
 * run ~56–75 m back and its roof's edge stands at ~75 m; behind home the
 * upper deck's front sits over the walkway (~49 m from home) and its roof's
 * edge ~64 m out. No source publishes the deck heights, so every height is
 * estimated by stacking the decks.
 */
const COMERICA: StadiumStructure = {
  stadiumId: 'tigers',
  // Far rim: the upper deck's roof (~108 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 108, fieldCrossingFt: 550 },
  tierOf: comericaTier,
  tiers: {
    first: {
      label: 'Lower bowl, first-base side (116–124)',
      // Open; rows 27 and up "shaded during most late afternoon games". The
      // mezzanine's roof edge (~95 ft) stands ~31 m behind the last row.
      stand: { rows: 35, ...COMERICA_LOWER, backHeightFt: 95, backSetbackFt: 100 },
      sections: behindDugout(comericaIds(120, 124)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('116', '119', '120', '121', '124')],
    },
    firstCorner: {
      label: 'Right-field corner (112–115)',
      // Two blocks (rows to 33/34, then 37–45), the back one under the
      // mezzanine from row 37 (sourced). Estimated deck underside ~50 ft.
      stand: { rows: 43, ...COMERICA_LOWER, backHeightFt: 95, backSetbackFt: 30 },
      sections: {
        ...comericaCover(comericaIds(112, 115), 50),
        '112': { frontRowHeightFt: 17, overhang: { coveredFromRow: COMERICA_COVER['112'], soffitHeightFt: 50 } },
        '115': { frontRowHeightFt: 31, overhang: { coveredFromRow: COMERICA_COVER['115'], soffitHeightFt: 50 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('112', '113', '114', '115')],
    },
    home: {
      label: 'Lower bowl behind home (125–130)',
      // Rows HHH–KKK and 15–35 behind the boxes; rows 31–34 and up "shaded
      // during most late afternoon games". The upper deck's roof edge
      // (~108 ft) ~18 m behind the last row.
      stand: { rows: 25, ...COMERICA_LOWER, backHeightFt: 108, backSetbackFt: 59 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('125', '127', '128', '130')],
    },
    third: {
      label: 'Lower bowl, third-base side (131–139)',
      // Open ("the third base side will be your enemy"). The upper deck's
      // roof (~108 ft) ~10 m behind the last row.
      stand: { rows: 35, ...COMERICA_LOWER, backHeightFt: 108, backSetbackFt: 33 },
      sections: behindDugout(comericaIds(131, 135)),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('131', '135', '136', '139')],
    },
    leftCorner: {
      label: 'Left-field corner (140–143)',
      // Open but for 143 from row 41 (rows 12–44; sourced). Estimated deck
      // underside ~55 ft.
      stand: { rows: 35, ...COMERICA_LOWER, backHeightFt: 108, backSetbackFt: 33 },
      sections: { '143': { frontRowHeightFt: 15, overhang: { coveredFromRow: COMERICA_COVER['143'], soffitHeightFt: 55 } } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('140', '142', '143')],
    },
    leftField: {
      label: 'Left-field pavilion (144–151)',
      // Behind the bullpens, open but for 144 from row DD (sourced): "the
      // most sun of any location". Estimated: front ~10 ft, 22° rake, deck
      // underside ~53 ft.
      stand: { rows: 33, frontRowHeightFt: 10, rakeDeg: 22, treadFt: 3, backHeightFt: 60 },
      sections: comericaCover(['144'], 53),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('144', '146', '148', '151')],
    },
    rightField: {
      label: 'Right-field bleachers (101–106)',
      // Rows E–T to A–GG; 104–106 covered from row CC (sourced). Estimated:
      // front ~6 ft, 22° rake, the balcony above ~48 ft.
      stand: { rows: 33, frontRowHeightFt: 6, rakeDeg: 22, treadFt: 3, backHeightFt: 56 },
      sections: comericaCover(comericaIds(101, 106), 48),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('101', '102', '104', '106')],
    },
    kaline: {
      label: "Kaline's Corner (107–111)",
      // The corner's upper rows past the pole: 110–111 rows 21–36, 107–109
      // rows 37–47; 107 covered from row 43 (sourced).
      stand: { rows: 16, frontRowHeightFt: 24, rakeDeg: 20, treadFt: 3, backHeightFt: 95, backSetbackFt: 30 },
      sections: {
        ...Object.fromEntries(['107', '108', '109'].map((id) => [id, { frontRowHeightFt: 41 }])),
        '107': { frontRowHeightFt: 41, overhang: { coveredFromRow: COMERICA_COVER['107'], soffitHeightFt: 56 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('107', '109', '110', '111')],
    },
    tigerDen: {
      label: 'Tiger Den (TD120–TD135)',
      // Rows A–H at the top of the lower bowl, under the deck above from row
      // C (sourced). Estimated: front ~42 ft, deck underside ~52 ft.
      stand: { rows: 8, frontRowHeightFt: 42, rakeDeg: 15, backHeightFt: 60, overhang: { coveredFromRow: 3, soffitHeightFt: 52 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysComerica('sections/TD121'), rysComerica('sections/TD126'), rysComerica('sections/TD129')],
    },
    terrace: {
      label: 'Terraces (116–117, 136–141)',
      // Rows A–H behind the baseline bowls, covered from row C (sourced).
      stand: { rows: 8, frontRowHeightFt: 42, rakeDeg: 15, backHeightFt: 60, overhang: { coveredFromRow: 3, soffitHeightFt: 52 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [rysComerica('sections/116T'), rysComerica('sections/136T'), rysComerica('sections/141T')],
    },
    mezzanine: {
      label: 'Mezzanine (210–219)',
      // Rows A–F then 1–22 (1–11 in 210 and 219), covered from row 17
      // (sourced; 210 and 219 not). Estimated: front ~50 ft, 25° rake, roof
      // underside ~87 ft.
      stand: { rows: 28, frontRowHeightFt: 50, rakeDeg: 25, treadFt: 2.8, backHeightFt: 95 },
      sections: comericaCover(comericaIds(210, 219), 87),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('210', '211', '215', '218', '219')],
    },
    upper: {
      label: 'Upper deck (321–345)',
      // Rows A–F then 1–20, covered from row 15 (sourced). Estimated: front
      // ~60 ft, 30° rake, roof underside ~98 ft.
      stand: { rows: 26, frontRowHeightFt: 60, rakeDeg: 30, treadFt: 2.65, backHeightFt: 108, overhang: { coveredFromRow: 21, soffitHeightFt: 98 } },
      sections: comericaCover(comericaIds(321, 345), 98),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('321', '327', '330', '338', '345')],
    },
    upperCorner: {
      label: 'Upper deck corner (346)',
      // Rows A–F, open ("avoid the corners").
      stand: { rows: 6, frontRowHeightFt: 60, rakeDeg: 30, treadFt: 2.65, backHeightFt: 72 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_COMERICA, ...comericaSections('346')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~50 ft up.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 58 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/tigers/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-11',
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

// The lower bowl along each line, square to its rows on the photo: rows A–HH
// from the wall ~12 m out to ~41 m (a ~2.8 ft tread). Estimated: front
// ~3 ft, 18° rake. The upper deck's roof canopy (~125 ft) stands ~31 m behind
// the last row on both sides.
const PROGRESSIVE_LOWER = { frontRowHeightFt: 3, rakeDeg: 18, treadFt: 2.8, backHeightFt: 125, backSetbackFt: 100 };
/** The sections whose front rows give way to a dugout or the boxes behind home start at row F. */
const progressiveRowF = (ids: readonly string[]) => Object.fromEntries(ids.map((id) => [id, { frontRowHeightFt: 7.5 }]));

/**
 * Progressive Field (1994; 2015–16 renovation). A lower bowl to row HH whose
 * rows run ~6° inside the foul lines, the club deck (326–348) over the
 * first-base side from row X, the 300s in right field above 103–113, and an
 * upper deck of boxes (400s, rows A–F) and reserved seats (500s, rows A–X)
 * under a roof canopy from row P. Rows and covered rows are Rate Your Seats'
 * section pages. On the 2023 USGS photo, square to the first-base rows, the
 * club seats run ~36–50 m out, the upper deck ~50–72 m and the canopy from
 * ~72 m. No source publishes the deck heights, so every height is estimated
 * by stacking the decks.
 */
const PROGRESSIVE: StadiumStructure = {
  stadiumId: 'guardians',
  // Far rim: the upper deck's canopy (~125 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 125, fieldCrossingFt: 550 },
  tierOf: progressiveTier,
  tiers: {
    first: {
      label: 'Lower level, first-base side (128–148)',
      // Covered from row X by the club deck (sourced). Estimated deck
      // underside ~32 ft.
      stand: { rows: 34, ...PROGRESSIVE_LOWER },
      sections: { ...progressiveCover(['128', '129', '130', '131', '134', '136', '138'], 32), ...Object.fromEntries(['140', '142', '144', '146', '148'].map((id) => [id, { frontRowHeightFt: 7.5, overhang: { coveredFromRow: PROGRESSIVE_COVER[id], soffitHeightFt: 32 } }])) },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('128', '134', '138', '140', '148')],
    },
    home: {
      label: 'Lower level behind home (149–157)',
      // Rows L–HH behind the boxes (149: F–HH), open.
      stand: { rows: 23, frontRowHeightFt: 13, rakeDeg: 18, treadFt: 2.8, backHeightFt: 125, backSetbackFt: 80 },
      sections: progressiveRowF(['149']),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('149', '150', '153', '154', '157')],
    },
    third: {
      label: 'Lower level, third-base side (158–175)',
      // Open; "the third base side will see shade first during late
      // afternoon and evening games".
      stand: { rows: 34, ...PROGRESSIVE_LOWER },
      sections: progressiveRowF(['158', '159', '160', '162', '163', '164']),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('158', '162', '165', '172', '175')],
    },
    leftCorner: {
      label: 'Left-field corner (176–179)',
      // Rows Y–HH (176–177), F–HH (178), N–EE (179), open.
      stand: { rows: 29, frontRowHeightFt: 7.5, rakeDeg: 18, treadFt: 2.8, backHeightFt: 60 },
      sections: { '176': { frontRowHeightFt: 25 }, '177': { frontRowHeightFt: 25 }, '179': { frontRowHeightFt: 15 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: progressiveSections('176', '178', '179'),
    },
    leftField: {
      label: 'Left field (180–185)',
      // Rows A–Y (E–Y in 180), open. Estimated: front ~20 ft over the
      // 19-ft wall, 22° rake.
      stand: { rows: 25, frontRowHeightFt: 20, rakeDeg: 22, treadFt: 2.8, backHeightFt: 40 },
      sections: { '180': { frontRowHeightFt: 24.5 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: progressiveSections('180', '182', '185'),
    },
    rightCorner: {
      label: 'Right-field corner (117, 125)',
      // Open: 117 has "no overhead protection".
      stand: { rows: 38, frontRowHeightFt: 3, rakeDeg: 18, treadFt: 2.8, backHeightFt: 60 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('117', '125')],
    },
    rightField: {
      label: 'Right field (103–113)',
      // Rows A–CC; 108–113 covered from row V by the 300s above (sourced).
      // Estimated: front ~6 ft, 20° rake, deck underside ~36 ft.
      stand: { rows: 29, frontRowHeightFt: 6, rakeDeg: 20, treadFt: 2.8, backHeightFt: 60 },
      sections: progressiveCover(['108', '109', '111', '113'], 36),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('103', '107', '109', '113')],
    },
    rightFieldClub: {
      label: 'Right field 300s (303–316)',
      // Rows A–U, covered from row M (sourced). Estimated: front ~32 ft, 22°
      // rake, deck underside ~56 ft.
      stand: { rows: 21, frontRowHeightFt: 32, rakeDeg: 22, treadFt: 2.8, backHeightFt: 64, overhang: { coveredFromRow: 13, soffitHeightFt: 56 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('303', '309', '316')],
    },
    club: {
      label: 'Club (326–348)',
      // Rows A–T, covered from row M by the upper deck (sourced). Estimated:
      // front ~36 ft, 22° rake, deck underside ~58 ft.
      stand: { rows: 20, frontRowHeightFt: 36, rakeDeg: 22, treadFt: 2.8, backHeightFt: 125, backSetbackFt: 70, overhang: { coveredFromRow: 13, soffitHeightFt: 58 } },
      // 326 starts at row D and 348 at row C, a few rows up.
      sections: {
        ...progressiveCover(Array.from({ length: 23 }, (_, i) => String(326 + i)), 58),
        '326': { frontRowHeightFt: 39.4, overhang: { coveredFromRow: PROGRESSIVE_COVER['326'], soffitHeightFt: 58 } },
        '348': { frontRowHeightFt: 38.3, overhang: { coveredFromRow: PROGRESSIVE_COVER['348'], soffitHeightFt: 58 } },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('326', '336', '348')],
    },
    upperBox: {
      label: 'Upper boxes (403–478)',
      // Rows A–F at the front of the upper deck, open. Estimated: front
      // ~70 ft, 30° rake, the reserved seats rising behind.
      stand: { rows: 6, frontRowHeightFt: 70, rakeDeg: 30, treadFt: 2.6, backHeightFt: 82 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: progressiveSections('403', '440', '478'),
    },
    upper: {
      label: 'Upper reserved (519–567)',
      // Rows A–X, covered from row P by the canopy (sourced). Estimated:
      // front ~82 ft, 32° rake, canopy underside ~114 ft.
      stand: { rows: 24, frontRowHeightFt: 82, rakeDeg: 32, treadFt: 2.6, backHeightFt: 125, overhang: { coveredFromRow: 16, soffitHeightFt: 114 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_PROGRESSIVE, ...progressiveSections('519', '541', '554', '567')],
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~50 ft up.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 58 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/guardians/ballpark/suites'],
    },
  },
  reviewedOn: '2026-11-11',
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
 * 1–28, to 44 in the corners), which the club level covers from row 17; the
 * Delta club (A–V, rows 1–12) and the 200s above them, and the 300s under the
 * canopy from row 3. In left field, bleachers (128–131) under the 200s and the
 * open Home Run Porch above; in right field, Treasure Island Cove (132–135,
 * covered) and open seats. Rows and covered rows are Rate Your Seats' section
 * pages. On the 2021 USGS photo, square to the first-base line, the boxes run
 * ~14–24 m back, the 100s from ~27 m, the club deck's front stands at ~40 m
 * and the canopy's at ~58 m (~59 m from home behind it). No source publishes
 * the deck heights, so every height is estimated by stacking the decks.
 */
const TARGET: StadiumStructure = {
  stadiumId: 'twins',
  // Far rim: the canopy (~110 ft) about 520 ft across the field.
  park: { roof: 'open', farRimHeightFt: 110, fieldCrossingFt: 520 },
  tierOf: targetTier,
  tiers: {
    box: {
      label: 'Boxes (1–17)',
      // Rows 1–13 (5–13 behind the dugouts), open ("rarely shaded").
      // Estimated: front ~3 ft, 14° rake; the canopy (~110 ft) ~34 m behind
      // the last row.
      stand: { rows: 13, frontRowHeightFt: 3, rakeDeg: 14, treadFt: 2.8, backHeightFt: 110, backSetbackFt: 110 },
      sections: Object.fromEntries(['4', '5', '6', '11', '12', '13'].map((id) => [id, { frontRowHeightFt: 5.8 }]).concat(['16', '17'].map((id) => [id, { frontRowHeightFt: 5.1 }]))),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('1', '4', '11', '14', '16')],
    },
    infield: {
      label: 'Infield 100s (107–122)',
      // Rows 1–28, covered from row 17 by the club level (sourced; "the
      // last twelve rows"). Estimated: front ~12 ft, 20° rake, deck
      // underside ~34 ft; the canopy (~110 ft) ~8 m behind the last row.
      stand: { rows: 28, frontRowHeightFt: 12, rakeDeg: 20, treadFt: 2.8, backHeightFt: 110, backSetbackFt: 26, overhang: { coveredFromRow: 17, soffitHeightFt: 34 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('107', '110', '114', '118', '122')],
    },
    corner: {
      label: 'Corners (101–106, 123–127)',
      // Rows 1–28 to 1–44; 101–104 covered from row 41 (here 32–41), 105
      // from 25, 124–126 from 37 (sourced); 106, 123 and 127 not.
      stand: { rows: 44, frontRowHeightFt: 4, rakeDeg: 20, treadFt: 2.8, backHeightFt: 60 },
      sections: { ...targetCover([...targetIds(101, 105), '124', '125', '126'], 54), '101': { frontRowHeightFt: 11, overhang: { coveredFromRow: TARGET_COVER['101'], soffitHeightFt: 54 } }, '127': { frontRowHeightFt: 7 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('101', '104', '105', '106', '123', '124', '127')],
    },
    club: {
      label: 'Delta SKY360 Club (A–D, K–V)',
      // Rows 1–12 (to 14), covered from row 9 (sourced). Estimated: front
      // ~34 ft, 20° rake, the 200s' underside ~48 ft.
      stand: { rows: 12, frontRowHeightFt: 34, rakeDeg: 20, treadFt: 2.8, backHeightFt: 110, backSetbackFt: 40, overhang: { coveredFromRow: 9, soffitHeightFt: 48 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('A', 'D', 'K', 'R', 'V')],
    },
    clubOpen: {
      label: 'Delta SKY360 Club (F–J)',
      // Rows 1–12 behind home with no covered rows given; "E–J start in the
      // sun and eventually become shaded".
      stand: { rows: 12, frontRowHeightFt: 34, rakeDeg: 20, treadFt: 2.8, backHeightFt: 110, backSetbackFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('F', 'H', 'J')],
    },
    clubCoverUnsourced: {
      label: 'Delta SKY360 Club (E)',
      // "All seats … shaded during most day games", but no covered rows
      // given, so the check tries both.
      stand: { rows: 12, frontRowHeightFt: 34, rakeDeg: 20, treadFt: 2.8, backHeightFt: 110, backSetbackFt: 40, overhang: { coveredFromRow: 9, soffitHeightFt: 48 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: targetSections('E'),
    },
    terrace: {
      label: 'Terrace (201–228)',
      // Rows 1–4 to 1–8, open (no covered rows given). Estimated: front
      // ~52 ft, 22° rake, the 300s rising behind.
      stand: { rows: 6, frontRowHeightFt: 52, rakeDeg: 22, treadFt: 2.8, backHeightFt: 110, backSetbackFt: 30 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: targetSections('201', '211', '220', '228'),
    },
    view: {
      label: 'View level (301–327)',
      // Rows 1–14, covered from row 3 by the canopy (7–8 at the ends;
      // sourced). Estimated: front ~66 ft, 28° rake, canopy underside
      // ~100 ft.
      stand: { rows: 14, frontRowHeightFt: 66, rakeDeg: 28, treadFt: 2.7, backHeightFt: 110, overhang: { coveredFromRow: 3, soffitHeightFt: 100 } },
      sections: targetCover(['301', '302', '303', '304', '326', '327'], 100),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('301', '303', '310', '320', '327')],
    },
    bleachers: {
      label: 'Left-field bleachers (128–131)',
      // Rows 1–15/16 under the 200 level from row 3 (sourced: "all rows …
      // covered by the overhang" but "the first couple rows … always in the
      // sun"). Estimated: front ~10 ft, 20° rake, deck underside ~22 ft.
      stand: { rows: 15, frontRowHeightFt: 10, rakeDeg: 20, treadFt: 2.8, backHeightFt: 50, overhang: { coveredFromRow: 3, soffitHeightFt: 22 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('128', '131')],
    },
    porch: {
      label: 'Home Run Porch, 200 level (229–234)',
      // Rows 1–4 to 1–7, open ("the only shade comes from the clouds").
      stand: { rows: 6, frontRowHeightFt: 28, rakeDeg: 20, treadFt: 2.8, backHeightFt: 34 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('229', '234')],
    },
    porchUpper: {
      label: 'Home Run Porch, 300 level (329–334)',
      // Rows 1–16, open.
      stand: { rows: 16, frontRowHeightFt: 46, rakeDeg: 26, treadFt: 2.8, backHeightFt: 64 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('329', '334')],
    },
    cove: {
      label: 'Treasure Island Cove (132–135)',
      // Rows 1–4, all under the overhang (sourced). Estimated: front ~14 ft
      // over the wall, deck underside ~24 ft.
      stand: { rows: 4, frontRowHeightFt: 14, rakeDeg: 15, treadFt: 2.8, backHeightFt: 40, overhang: { coveredFromRow: 1, soffitHeightFt: 24 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_TARGET, ...targetSections('132', '135')],
    },
    rightField: {
      label: 'Right field (136–140)',
      // Rows 1–7, open.
      stand: { rows: 7, frontRowHeightFt: 14, rakeDeg: 15, treadFt: 2.8, backHeightFt: 40 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: targetSections('136', '138'),
    },
    rightFieldDeck: {
      label: 'Right-field 200s (237–240)',
      // Rows 1–12 to 1–22, open ("no shade for day games").
      stand: { rows: 16, frontRowHeightFt: 30, rakeDeg: 24, treadFt: 2.8, backHeightFt: 50 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: targetSections('237', '240'),
    },
    suite: {
      label: 'Suites',
      // As at the other parks: one row of seats under the suite level's
      // ceiling. Estimated ~50 ft up.
      stand: { rows: 1, frontRowHeightFt: 50, rakeDeg: 0, backHeightFt: 62, overhang: { coveredFromRow: 1, soffitHeightFt: 58 } },
      heightsSourced: false,
      coverSourced: true,
      sources: ['https://www.mlb.com/twins/ballpark/seating-map'],
    },
  },
  reviewedOn: '2026-11-11',
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
const RATE_LOWER = { frontRowHeightFt: 3, rakeDeg: 20 };
const rateRise = 2.75 * Math.tan((RATE_LOWER.rakeDeg * Math.PI) / 180);

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
 * rows are Rate Your Seats' section pages. On the 2019 USGS photo, square to
 * the third-base line, the lower box runs ~11–41 m back, the upper deck's
 * open front rows from ~38 m and the roof's front edge stands at ~47.5 m.
 * No source publishes the deck heights, so every height is estimated by
 * stacking the decks.
 */
const RATE: StadiumStructure = {
  stadiumId: 'whitesox',
  // Far rim: the roof (~112 ft) about 550 ft across the field.
  park: { roof: 'open', farRimHeightFt: 112, fieldCrossingFt: 550 },
  tierOf: rateTier,
  tiers: {
    lowerBox: {
      label: 'Lower box (108–156)',
      // Covered from row 30 or 33 (here 18–31; sourced); 108 and 156 not.
      // Estimated: front ~3 ft (higher where a section starts behind a
      // dugout or the scout seats), 20° rake, club deck underside ~42 ft; the
      // roof's front edge (~112 ft) ~6.5 m behind the last row.
      stand: { rows: 37, ...RATE_LOWER, backHeightFt: 112, backSetbackFt: 21 },
      sections: Object.fromEntries(Array.from({ length: 49 }, (_, i) => String(108 + i)).map((id) => [id, {
        ...(RATE_FIRST_ROW[id] ? { frontRowHeightFt: RATE_LOWER.frontRowHeightFt + (RATE_FIRST_ROW[id] - 1) * rateRise } : {}),
        ...(RATE_COVER[id] ? { overhang: { coveredFromRow: RATE_COVER[id], soffitHeightFt: 42 } } : {}),
      }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('108', '112', '122', '127', '132', '137', '145', '152', '156')],
    },
    rightField: {
      label: 'Right-field outfield reserved (100–105)',
      // Rows 1–28 (104–105 from row 9), open ("none of the outfield seats
      // are covered"). Estimated: front ~8 ft, 20° rake.
      stand: { rows: 28, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 40 },
      sections: { '104': { frontRowHeightFt: 16 }, '105': { frontRowHeightFt: 16 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('100', '102', '105')],
    },
    leftField: {
      label: 'Left-field outfield reserved and bleachers (157–164)',
      // Rows 1–28 (157–158 from row 8), open.
      stand: { rows: 28, frontRowHeightFt: 8, rakeDeg: 20, backHeightFt: 40 },
      sections: { '157': { frontRowHeightFt: 15 }, '158': { frontRowHeightFt: 15 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('157', '160', '164')],
    },
    club: {
      label: 'Club (311–357)',
      // Rows 1–5 under the upper deck, hidden from above on the photo; no
      // source gives covered rows, so the check tries both. Estimated: front
      // ~45 ft, deck underside ~60 ft.
      stand: { rows: 5, frontRowHeightFt: 45, rakeDeg: 15, backHeightFt: 112, backSetbackFt: 30, overhang: { coveredFromRow: 1, soffitHeightFt: 60 } },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: rateSections('311', '320', '330', '342', '357'),
    },
    upper: {
      label: 'Upper deck (506–558)',
      // Rows 1–21, covered from row 9 by the roof (sourced). Estimated:
      // front ~68 ft, 32° rake, roof underside ~100 ft.
      stand: { rows: 21, frontRowHeightFt: 68, rakeDeg: 32, treadFt: 2.6, backHeightFt: 112, overhang: { coveredFromRow: 9, soffitHeightFt: 100 } },
      sections: Object.fromEntries(['514', '516', '518', '524', '540', '546', '548', '550'].map((id) => [id, { overhang: { coveredFromRow: RATE_COVER[id], soffitHeightFt: 100 } }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [RYS_RATE, ...rateSections('506', '516', '530', '548', '558')],
    },
  },
  reviewedOn: '2026-11-12',
};

const SUTTER_MAP = 'https://www.mlb.com/athletics/ballpark/seating-map';
const SUTTER_SHADE = 'https://www.shadedseats.com/sutter-health-park-shaded-seats/';
const SUTTER_PHOTO = 'USGS NAIP m_3812128_ne_10_060_20220621';
const SUTTER_LOWER = { frontRowHeightFt: 4, rakeDeg: 20, treadFt: 2.8 };
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
 * chart-points/athletics.ts); no source lists covered rows. On the 2022 USGS
 * photo the seats behind home run ~19–43 m from the plate and the suite and
 * press-box structure's front edge stands ~2 m behind the last row (it
 * shades the back rows on the photo); on the third-base side the suite
 * building stands ~1.5 m behind the last row and ends by 123; on the first-base side
 * the club's canopy reaches over the back of 103–105. No source publishes
 * heights, so every height is estimated by stacking the levels: the bowl's
 * top ~33 ft, a suite level and press box above it.
 */
const SUTTER: StadiumStructure = {
  stadiumId: 'athletics',
  // Far rim: the third-base suites (~58 ft) about 350 ft across the field
  // from the first-base seats, which face the evening sun.
  park: { roof: 'open', farRimHeightFt: 58, fieldCrossingFt: 350 },
  tierOf: sutterTier,
  tiers: {
    home: {
      label: 'Behind home (108–116)',
      // 29 rows (22 in 111–113, in front of the tables); the suites and
      // press box (~70 ft) with their front edge ~2 m behind the last row
      // (~8 m behind 111–113's, past the tables).
      stand: { rows: 29, ...SUTTER_LOWER, backHeightFt: 70, backSetbackFt: 7 },
      sections: Object.fromEntries(['111', '112', '113'].map((id) => [id, { backSetbackFt: 27 }])),
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO],
    },
    third: {
      label: 'Third-base side (117–123)',
      // Open; the suite building (~58 ft) ~1.5 m behind the last row, ending
      // before 123 ("extends past the structure that blocks the sun").
      // 117–118 start behind the home dugout (~4 rows up).
      stand: { rows: 32, ...SUTTER_LOWER, backHeightFt: 58, backSetbackFt: 5 },
      sections: {
        '117': sutterFront(4),
        '118': sutterFront(4),
        // 12 rows; only its own back stands behind it.
        '123': { backHeightFt: 4 + 11 * sutterRise + 4, backSetbackFt: 0 },
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO],
    },
    first: {
      label: 'First-base side (101–107)',
      // The club deck (~40 ft) behind; its canopy reaches over "the very
      // back of sections 103–105" (no rows given, so the check tries both;
      // on the photo ~3 m, about the last 4 rows). 106–107 start behind the
      // visitors' dugout.
      stand: { rows: 30, ...SUTTER_LOWER, backHeightFt: 40, backSetbackFt: 10 },
      sections: {
        ...Object.fromEntries(['103', '104', '105'].map((id) => [id, { overhang: { coveredFromRow: 27, soffitHeightFt: 40 } }])),
        '106': sutterFront(6),
        '107': sutterFront(6),
      },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: false,
      sources: [SUTTER_MAP, SUTTER_SHADE, SUTTER_PHOTO],
    },
    club: {
      label: 'Club (201–206)',
      // Five rows raised behind 101–106, open ("remain sunny the longest").
      // Estimated: front ~36 ft, the club building (~50 ft) behind.
      stand: { rows: 5, frontRowHeightFt: 36, rakeDeg: 15, treadFt: 2.8, backHeightFt: 50, backSetbackFt: 6 },
      rowsFromMap: true,
      heightsSourced: false,
      coverSourced: true,
      sources: [SUTTER_MAP, SUTTER_SHADE],
    },
  },
  reviewedOn: '2026-11-12',
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
      // underside ~35 ft, the upper decks and roof behind.
      stand: { rows: 25, frontRowHeightFt: 10, rakeDeg: 20, backHeightFt: DAIKIN_ROOF_TOP, backSetbackFt: 40 },
      sections: daikinSections(daikinRange(150, 156), 35),
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
      // Estimated: front ~50 ft, 25° rake, mezzanine underside ~62 ft.
      stand: { rows: 12, frontRowHeightFt: 50, rakeDeg: 25, backHeightFt: DAIKIN_ROOF_TOP, overhang: { coveredFromRow: 5, soffitHeightFt: 62 } },
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

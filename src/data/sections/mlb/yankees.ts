// Yankee Stadium — New York Yankees
//
// Real per-section seating data, authored 2026-05-21 from MLB.com Yankees
// interactive seating map, StubHub, shadedseats.com, RateYourSeats Shaded &
// Covered Seating page, RateYourSeats Yankee Stadium sections list, and
// FromThisSeat seating chart breakdown. Cross-referenced with Google Maps
// satellite imagery at 40.8296°N, -73.9262°W.
//
// Verified compass orientation: HP→CF = 55° NE.
//   • Independently confirmed by shadedseats narrative ("sun rises behind HP,
//     sets behind 1B on July 1"), Baseball Almanac AL orientation page, and
//     satellite-imagery surveys (Yankee Stadium aligns closest to MLB Rule
//     1.04's ENE recommendation).
//   • LF foul pole ≈ compass 10° (N), RF foul pole ≈ compass 100° (E),
//     behind HP ≈ compass 235° (SW).
//
// Convention (see sectionSunCalculations.ts header):
//   baseAngle is STADIUM-LOCAL — 0=1B, 90=CF, 180=3B, 270=behind HP.
//   Research input is compass bearing from HP. Conversion:
//     local_center = (orientation + 90 − compass) mod 360
//     baseAngle    = (local_center − angleSpan/2) mod 360
//   Built-in below as `convertCompass(...)`.
//
// Yankee Stadium quirks baked into the data:
//   • Field/Legends Suite (11–29 with letter sub-sections 14A/B, 15A/B,
//     17A/B, 21A/B, 24A/B, 27A/B): premium field-level behind HP, NOT covered
//     in majority — the Legends Suite Club building behind provides only
//     marginal back-row coverage.
//   • Lower Box 103–105 are deep-RF chairback OF seats; 134–136 are the LF
//     mirror. 106–107 / 132–133 are narrow foul-pole transition sections.
//     Section 122 sits directly behind HP at compass ~235°.
//   • Field MVP infield sections 115–125 marked covered=true (back rows
//     under Legends Suite Club + upper-deck overhang). 114B and 126–129 also
//     covered (their back rows fall under the Main Level overhang). 108–114A
//     and 130–136 are NOT majority-covered.
//   • RF Bleachers 201–204 marked covered=true — the Bleacher Café roof and
//     Mohegan Sun Sports Bar structure shade portions in the afternoon.
//     Mohegan Sun and Bleacher Café themselves are indoor/covered club spaces.
//   • LF Bleachers 235–239 marked covered=false — shadedseats: "fully exposed
//     and endure relentless sun throughout the game."
//   • Main Level 205–234: marked covered=true. Per RateYourSeats, ~the last
//     10 of ~25 rows are under cover, plus the upper-deck overhang above
//     creates significant overhead structure. Sections 215/216 are the
//     premium Champions Suite (indoor club, level=suite). 217–221B is the
//     H&R Block / Delta Sky360° Suite area directly behind HP at Main Level
//     (level=suite). 230–233 marked as Audi Club Section adjacent to the
//     dedicated Audi Yankees Club lounge.
//   • Terrace 305–334: all covered=true. Jim Beam Suites 317–321 marked
//     level=suite (premium club behind HP). All other Terrace sections are
//     covered by the Grandstand frieze and concourse structure overhead.
//   • Grandstand 405–434B: all covered=true. The decorative iconic frieze
//     caps the back rows of every Grandstand section; the upper-deck
//     structure shadows most rows.
//   • Mohegan Sun Sports Bar / Bleacher Café / Audi Yankees Club / Pepsi
//     Lounge are standalone non-numbered ticketed areas; included with
//     slugged IDs.
//   • Pepsi Lounge: indoor lounge on the Main Level concourse behind HP
//     (compass ~235°, level=club, span=30° wide because the lounge covers a
//     larger angular footprint than a single bowl wedge).

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

const ORIENTATION_DEG = 55;

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Convert a research compass bearing (FROM home plate TO section center)
 *  to the calculator's stadium-local baseAngle convention (start of section). */
function convertCompass(compassCenter: number, angleSpan: number): number {
  const localCenter = normalize(ORIENTATION_DEG + 90 - compassCenter);
  return normalize(localCenter - angleSpan / 2);
}

function generateRows(
  count: number,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean,
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  for (let i = 1; i <= count; i++) {
    const rowNum = i - 1;
    rows.push({
      rowNumber: i.toString(),
      seats: Math.max(4, seatsPerRow - Math.floor(rowNum * 0.2)),
      elevation: baseElevation + rowNum * rowHeight * Math.sin((rake * Math.PI) / 180),
      depth: rowNum * rowDepth,
      covered,
      overhangHeight: covered ? Math.max(8, 30 - rowNum * 0.3) : undefined,
    });
  }
  return rows;
}

function rowsFor(level: DetailedSection['level'], covered: boolean, baseElev: number): RowDetail[] {
  switch (level) {
    case 'field':
      return generateRows(8, 18, baseElev, 12, covered);
    case 'lower':
      return generateRows(30, 20, baseElev, 18, covered);
    case 'club':
      return generateRows(15, 16, baseElev, 25, covered);
    case 'upper':
      return generateRows(25, 18, baseElev, 30, covered);
    case 'suite':
      return generateRows(4, 10, baseElev, 0, covered);
    case 'standing':
      return [];
    default:
      return generateRows(15, 18, baseElev, 20, covered);
  }
}

function rakeFor(level: DetailedSection['level']): number {
  switch (level) {
    case 'field': return 12;
    case 'lower': return 18;
    case 'club':  return 25;
    case 'upper': return 30;
    case 'suite': return 0;
    case 'standing': return 0;
    default: return 20;
  }
}

function vertices(
  baseAngle: number,
  angleSpan: number,
  distance: number,
  height: number,
): Vector3D[] {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const inner = Math.max(10, distance - 15);
  const outer = distance + 15;
  const topZ = height + 8;
  return [
    { x: Math.round(inner * Math.cos(toRad(baseAngle))),               y: Math.round(inner * Math.sin(toRad(baseAngle))),               z: height },
    { x: Math.round(inner * Math.cos(toRad(baseAngle + angleSpan))),   y: Math.round(inner * Math.sin(toRad(baseAngle + angleSpan))),   z: height },
    { x: Math.round(outer * Math.cos(toRad(baseAngle + angleSpan))),   y: Math.round(outer * Math.sin(toRad(baseAngle + angleSpan))),   z: topZ  },
    { x: Math.round(outer * Math.cos(toRad(baseAngle))),               y: Math.round(outer * Math.sin(toRad(baseAngle))),               z: topZ  },
  ];
}

interface SectionInput {
  id: string;
  name: string;
  level: DetailedSection['level'];
  compass: number;
  span: number;
  covered: boolean;
  distance: number;
  height: number;
}

const SECTIONS: SectionInput[] = [
  // Field / Legends Suite — premium field-level between dugouts behind HP
  { id: '11',  name: 'Field Box 11',       level: 'field', compass: 165, span: 8, covered: false, distance: 130, height: 4 },
  { id: '12',  name: 'Field Box 12',       level: 'field', compass: 175, span: 7, covered: false, distance: 115, height: 4 },
  { id: '13',  name: 'Field Box 13',       level: 'field', compass: 185, span: 6, covered: false, distance: 100, height: 4 },
  { id: '14A', name: 'Legends Suite 14A',  level: 'field', compass: 195, span: 5, covered: false, distance: 90,  height: 4 },
  { id: '14B', name: 'Legends Suite 14B',  level: 'field', compass: 200, span: 5, covered: false, distance: 85,  height: 6 },
  { id: '15A', name: 'Legends Suite 15A',  level: 'field', compass: 205, span: 5, covered: false, distance: 78,  height: 4 },
  { id: '15B', name: 'Legends Suite 15B',  level: 'field', compass: 209, span: 5, covered: false, distance: 75,  height: 6 },
  { id: '16',  name: 'Legends Suite 16',   level: 'field', compass: 215, span: 5, covered: false, distance: 68,  height: 4 },
  { id: '17A', name: 'Legends Suite 17A',  level: 'field', compass: 220, span: 5, covered: false, distance: 62,  height: 4 },
  { id: '17B', name: 'Legends Suite 17B',  level: 'field', compass: 225, span: 5, covered: false, distance: 58,  height: 6 },
  { id: '18',  name: 'Legends Suite 18',   level: 'field', compass: 230, span: 5, covered: false, distance: 50,  height: 4 },
  { id: '19',  name: 'Legends Suite 19',   level: 'field', compass: 234, span: 5, covered: false, distance: 45,  height: 4 },
  { id: '20',  name: 'Legends Suite 20',   level: 'field', compass: 238, span: 5, covered: false, distance: 45,  height: 4 },
  { id: '21A', name: 'Legends Suite 21A',  level: 'field', compass: 241, span: 4, covered: false, distance: 50,  height: 4 },
  { id: '21B', name: 'Legends Suite 21B',  level: 'field', compass: 244, span: 4, covered: false, distance: 55,  height: 6 },
  { id: '22',  name: 'Legends Suite 22',   level: 'field', compass: 248, span: 5, covered: false, distance: 58,  height: 4 },
  { id: '23',  name: 'Legends Suite 23',   level: 'field', compass: 254, span: 5, covered: false, distance: 65,  height: 4 },
  { id: '24A', name: 'Legends Suite 24A',  level: 'field', compass: 259, span: 5, covered: false, distance: 72,  height: 4 },
  { id: '24B', name: 'Legends Suite 24B',  level: 'field', compass: 263, span: 5, covered: false, distance: 76,  height: 6 },
  { id: '25',  name: 'Legends Suite 25',   level: 'field', compass: 267, span: 5, covered: false, distance: 82,  height: 4 },
  { id: '26',  name: 'Legends Suite 26',   level: 'field', compass: 273, span: 5, covered: false, distance: 90,  height: 4 },
  { id: '27A', name: 'Legends Suite 27A',  level: 'field', compass: 278, span: 5, covered: false, distance: 95,  height: 4 },
  { id: '27B', name: 'Legends Suite 27B',  level: 'field', compass: 283, span: 5, covered: false, distance: 100, height: 6 },
  { id: '28',  name: 'Field Box 28',       level: 'field', compass: 293, span: 6, covered: false, distance: 110, height: 4 },
  { id: '29',  name: 'Field Box 29',       level: 'field', compass: 305, span: 7, covered: false, distance: 125, height: 4 },

  // Lower Box — wraps from RF foul pole through HP to LF foul pole
  { id: '103',  name: 'Lower Field Outfield 103',                       level: 'lower', compass: 75,  span: 7, covered: false, distance: 395, height: 14 },
  { id: '104',  name: 'Lower Field Outfield 104 (Judge\'s Chambers area)', level: 'lower', compass: 82,  span: 7, covered: false, distance: 385, height: 14 },
  { id: '105',  name: 'Lower Field Outfield 105',                       level: 'lower', compass: 89,  span: 7, covered: false, distance: 370, height: 14 },
  { id: '106',  name: 'Foul Pole Lower 106',                            level: 'lower', compass: 95,  span: 4, covered: false, distance: 345, height: 12 },
  { id: '107',  name: 'Foul Pole Lower 107',                            level: 'lower', compass: 99,  span: 4, covered: false, distance: 335, height: 12 },
  { id: '108',  name: 'Lower Box 108', level: 'lower', compass: 107, span: 8, covered: false, distance: 310, height: 12 },
  { id: '109',  name: 'Lower Box 109', level: 'lower', compass: 116, span: 8, covered: false, distance: 285, height: 12 },
  { id: '110',  name: 'Lower Box 110', level: 'lower', compass: 125, span: 8, covered: false, distance: 255, height: 13 },
  { id: '111',  name: 'Lower Box 111', level: 'lower', compass: 134, span: 8, covered: false, distance: 230, height: 13 },
  { id: '112',  name: 'Lower Box 112', level: 'lower', compass: 143, span: 8, covered: false, distance: 205, height: 14 },
  { id: '113',  name: 'Lower Box 113', level: 'lower', compass: 152, span: 8, covered: false, distance: 185, height: 14 },
  { id: '114A', name: 'Lower Box 114A', level: 'lower', compass: 159, span: 4, covered: false, distance: 170, height: 14 },
  { id: '114B', name: 'Lower Box 114B', level: 'lower', compass: 164, span: 4, covered: true,  distance: 165, height: 16 },
  { id: '115',  name: 'Field MVP 115',  level: 'lower', compass: 172, span: 8, covered: true, distance: 150, height: 14 },
  { id: '116',  name: 'Field MVP 116',  level: 'lower', compass: 181, span: 8, covered: true, distance: 135, height: 14 },
  { id: '117A', name: 'Field MVP 117A', level: 'lower', compass: 188, span: 4, covered: true, distance: 125, height: 14 },
  { id: '117B', name: 'Field MVP 117B', level: 'lower', compass: 192, span: 4, covered: true, distance: 120, height: 16 },
  { id: '118',  name: 'Field MVP 118',  level: 'lower', compass: 200, span: 8, covered: true, distance: 110, height: 14 },
  { id: '119',  name: 'Field MVP 119',  level: 'lower', compass: 209, span: 8, covered: true, distance: 100, height: 14 },
  { id: '120A', name: 'Field MVP 120A', level: 'lower', compass: 216, span: 4, covered: true, distance: 92,  height: 14 },
  { id: '120B', name: 'Field MVP 120B', level: 'lower', compass: 220, span: 4, covered: true, distance: 90,  height: 16 },
  { id: '121A', name: 'Field MVP 121A', level: 'lower', compass: 226, span: 4, covered: true, distance: 85,  height: 14 },
  { id: '121B', name: 'Field MVP 121B', level: 'lower', compass: 230, span: 4, covered: true, distance: 83,  height: 16 },
  { id: '122',  name: 'Field MVP 122',  level: 'lower', compass: 235, span: 7, covered: true, distance: 82,  height: 14 }, // directly behind HP
  { id: '123',  name: 'Field MVP 123',  level: 'lower', compass: 243, span: 7, covered: true, distance: 85,  height: 14 },
  { id: '124',  name: 'Field MVP 124',  level: 'lower', compass: 251, span: 7, covered: true, distance: 90,  height: 14 },
  { id: '125',  name: 'Field MVP 125',  level: 'lower', compass: 259, span: 7, covered: true, distance: 100, height: 14 },
  { id: '126',  name: 'Lower Box 126',  level: 'lower', compass: 267, span: 8, covered: true, distance: 110, height: 14 },
  { id: '127A', name: 'Lower Box 127A', level: 'lower', compass: 274, span: 4, covered: true, distance: 120, height: 14 },
  { id: '127B', name: 'Lower Box 127B', level: 'lower', compass: 278, span: 4, covered: true, distance: 125, height: 16 },
  { id: '128',  name: 'Lower Box 128',  level: 'lower', compass: 286, span: 8, covered: true, distance: 135, height: 14 },
  { id: '129',  name: 'Lower Box 129',  level: 'lower', compass: 295, span: 8, covered: true, distance: 150, height: 14 },
  { id: '130',  name: 'Lower Box 130',  level: 'lower', compass: 304, span: 8, covered: false, distance: 170, height: 14 },
  { id: '131',  name: 'Lower Box 131',  level: 'lower', compass: 313, span: 8, covered: false, distance: 185, height: 14 },
  { id: '132',  name: 'Foul Pole Lower 132', level: 'lower', compass: 322, span: 4, covered: false, distance: 215, height: 12 },
  { id: '133',  name: 'Foul Pole Lower 133', level: 'lower', compass: 327, span: 4, covered: false, distance: 240, height: 12 },
  { id: '134',  name: 'Lower Field Outfield 134', level: 'lower', compass: 335, span: 7, covered: false, distance: 270, height: 12 },
  { id: '135',  name: 'Lower Field Outfield 135', level: 'lower', compass: 345, span: 7, covered: false, distance: 310, height: 14 },
  { id: '136',  name: 'Lower Field Outfield 136', level: 'lower', compass: 355, span: 7, covered: false, distance: 360, height: 14 },

  // RF Bleachers — under partial shade from CF Bleacher Café roof
  { id: '201', name: 'Bleachers 201', level: 'lower', compass: 95, span: 7, covered: true, distance: 410, height: 32 },
  { id: '202', name: 'Bleachers 202', level: 'lower', compass: 87, span: 7, covered: true, distance: 415, height: 32 },
  { id: '203', name: 'Bleachers 203', level: 'lower', compass: 80, span: 7, covered: true, distance: 410, height: 32 },
  { id: '204', name: 'Bleachers 204', level: 'lower', compass: 73, span: 7, covered: true, distance: 400, height: 32 },

  // CF outfield indoor clubs
  { id: 'MOHEGAN-SUN',   name: 'Mohegan Sun Sports Bar', level: 'club', compass: 60, span: 14, covered: true, distance: 410, height: 30 },
  { id: 'BLEACHER-CAFE', name: 'Bleacher Café',          level: 'club', compass: 55, span: 12, covered: true, distance: 400, height: 40 },

  // Main Level 205–234 (covered: under upper deck + back rows under roof)
  { id: '205',  name: 'Main Level 205',  level: 'club', compass: 100, span: 9, covered: true, distance: 305, height: 35 },
  { id: '206',  name: 'Main Level 206',  level: 'club', compass: 109, span: 9, covered: true, distance: 290, height: 35 },
  { id: '207',  name: 'Main Level 207',  level: 'club', compass: 118, span: 9, covered: true, distance: 270, height: 35 },
  { id: '208',  name: 'Main Level 208',  level: 'club', compass: 127, span: 9, covered: true, distance: 250, height: 35 },
  { id: '209',  name: 'Main Level 209',  level: 'club', compass: 136, span: 9, covered: true, distance: 230, height: 35 },
  { id: '210',  name: 'Main Level 210',  level: 'club', compass: 145, span: 9, covered: true, distance: 210, height: 35 },
  { id: '211',  name: 'Main Level 211',  level: 'club', compass: 154, span: 9, covered: true, distance: 195, height: 35 },
  { id: '212',  name: 'Main Level 212',  level: 'club', compass: 163, span: 9, covered: true, distance: 180, height: 35 },
  { id: '213',  name: 'Main Level 213',  level: 'club', compass: 172, span: 9, covered: true, distance: 170, height: 35 },
  { id: '214A', name: 'Main Level 214A', level: 'club', compass: 180, span: 5, covered: true, distance: 160, height: 35 },
  { id: '214B', name: 'Main Level 214B', level: 'club', compass: 184, span: 5, covered: true, distance: 158, height: 35 },
  { id: '215',  name: 'Champions Suite 215', level: 'suite', compass: 192, span: 9, covered: true, distance: 150, height: 35 },
  { id: '216',  name: 'Champions Suite 216', level: 'suite', compass: 201, span: 9, covered: true, distance: 142, height: 35 },
  { id: '217',  name: 'Main Level 217',  level: 'suite', compass: 210, span: 9, covered: true, distance: 135, height: 35 },
  { id: '218A', name: 'Main Level 218A', level: 'suite', compass: 217, span: 5, covered: true, distance: 128, height: 35 },
  { id: '218B', name: 'Main Level 218B', level: 'suite', compass: 221, span: 5, covered: true, distance: 125, height: 35 },
  { id: '219',  name: 'Main Level 219',  level: 'suite', compass: 226, span: 8, covered: true, distance: 122, height: 35 },
  { id: '220A', name: 'Main Level 220A', level: 'suite', compass: 231, span: 4, covered: true, distance: 120, height: 35 },
  { id: '220B', name: 'Main Level 220B', level: 'suite', compass: 235, span: 4, covered: true, distance: 118, height: 35 },
  { id: '220C', name: 'Main Level 220C', level: 'suite', compass: 239, span: 4, covered: true, distance: 120, height: 35 },
  { id: '221A', name: 'Main Level 221A', level: 'suite', compass: 244, span: 5, covered: true, distance: 125, height: 35 },
  { id: '221B', name: 'Main Level 221B', level: 'suite', compass: 248, span: 5, covered: true, distance: 128, height: 35 },
  { id: '222',  name: 'Main Level 222',  level: 'club', compass: 254, span: 8, covered: true, distance: 135, height: 35 },
  { id: '223',  name: 'Main Level 223',  level: 'club', compass: 263, span: 9, covered: true, distance: 142, height: 35 },
  { id: '224',  name: 'Main Level 224',  level: 'club', compass: 272, span: 9, covered: true, distance: 150, height: 35 },
  { id: '225',  name: 'Main Level 225',  level: 'club', compass: 281, span: 9, covered: true, distance: 165, height: 35 },
  { id: '226',  name: 'Main Level 226',  level: 'club', compass: 290, span: 9, covered: true, distance: 180, height: 35 },
  { id: '227A', name: 'Main Level 227A', level: 'club', compass: 297, span: 5, covered: true, distance: 190, height: 35 },
  { id: '227B', name: 'Main Level 227B', level: 'club', compass: 301, span: 5, covered: true, distance: 195, height: 35 },
  { id: '228',  name: 'Main Level 228',  level: 'club', compass: 308, span: 9, covered: true, distance: 210, height: 35 },
  { id: '229',  name: 'Main Level 229',  level: 'club', compass: 317, span: 9, covered: true, distance: 230, height: 35 },
  { id: '230',  name: 'Audi Club Section 230',  level: 'club', compass: 326, span: 9, covered: true, distance: 250, height: 35 },
  { id: '231',  name: 'Audi Club Section 231',  level: 'club', compass: 335, span: 9, covered: true, distance: 270, height: 35 },
  { id: '232A', name: 'Audi Club Section 232A', level: 'club', compass: 343, span: 4, covered: true, distance: 280, height: 35 },
  { id: '232B', name: 'Audi Club Section 232B', level: 'club', compass: 347, span: 4, covered: true, distance: 285, height: 35 },
  { id: '233A', name: 'Audi Club Section 233A', level: 'club', compass: 354, span: 4, covered: true, distance: 295, height: 35 },
  { id: '233B', name: 'Audi Club Section 233B', level: 'club', compass: 358, span: 4, covered: true, distance: 300, height: 35 },
  { id: '234',  name: 'Main Level 234',  level: 'club', compass: 5, span: 9, covered: true, distance: 305, height: 35 },

  // LF Bleachers — shadedseats: "fully exposed and endure relentless sun"
  { id: '235', name: 'Bleachers 235', level: 'lower', compass: 13, span: 7, covered: false, distance: 360, height: 32 },
  { id: '236', name: 'Bleachers 236', level: 'lower', compass: 21, span: 7, covered: false, distance: 370, height: 32 },
  { id: '237', name: 'Bleachers 237', level: 'lower', compass: 29, span: 7, covered: false, distance: 380, height: 32 },
  { id: '238', name: 'Bleachers 238', level: 'lower', compass: 37, span: 7, covered: false, distance: 390, height: 32 },
  { id: '239', name: 'Bleachers 239', level: 'lower', compass: 45, span: 7, covered: false, distance: 400, height: 32 },

  // Indoor LF club lounge on 200-level
  { id: 'AUDI-CLUB', name: 'Audi Yankees Club (LF Suite Lounge)', level: 'suite', compass: 302, span: 5, covered: true, distance: 360, height: 38 },

  // Terrace 305–334 (all covered)
  { id: '305',  name: 'Terrace 305',  level: 'club', compass: 100, span: 9, covered: true, distance: 290, height: 55 },
  { id: '306',  name: 'Terrace 306',  level: 'club', compass: 109, span: 9, covered: true, distance: 275, height: 55 },
  { id: '307',  name: 'Terrace 307',  level: 'club', compass: 118, span: 9, covered: true, distance: 255, height: 55 },
  { id: '308',  name: 'Terrace 308',  level: 'club', compass: 127, span: 9, covered: true, distance: 235, height: 55 },
  { id: '309',  name: 'Terrace 309',  level: 'club', compass: 136, span: 9, covered: true, distance: 215, height: 55 },
  { id: '310',  name: 'Terrace 310',  level: 'club', compass: 145, span: 9, covered: true, distance: 195, height: 55 },
  { id: '311',  name: 'Terrace 311',  level: 'club', compass: 154, span: 9, covered: true, distance: 180, height: 55 },
  { id: '312',  name: 'Terrace 312',  level: 'club', compass: 163, span: 9, covered: true, distance: 168, height: 55 },
  { id: '313',  name: 'Terrace 313',  level: 'club', compass: 172, span: 9, covered: true, distance: 158, height: 55 },
  { id: '314',  name: 'Terrace 314',  level: 'club', compass: 181, span: 9, covered: true, distance: 150, height: 55 },
  { id: '315',  name: 'Terrace 315',  level: 'club', compass: 190, span: 9, covered: true, distance: 142, height: 55 },
  { id: '316',  name: 'Terrace 316',  level: 'club', compass: 199, span: 9, covered: true, distance: 135, height: 55 },
  { id: '317',  name: 'Jim Beam Suite 317',  level: 'suite', compass: 208, span: 9, covered: true, distance: 128, height: 55 },
  { id: '318',  name: 'Jim Beam Suite 318',  level: 'suite', compass: 217, span: 9, covered: true, distance: 122, height: 55 },
  { id: '319',  name: 'Jim Beam Suite 319',  level: 'suite', compass: 226, span: 8, covered: true, distance: 118, height: 55 },
  { id: '320A', name: 'Jim Beam Suite 320A', level: 'suite', compass: 232, span: 4, covered: true, distance: 116, height: 55 },
  { id: '320B', name: 'Jim Beam Suite 320B', level: 'suite', compass: 235, span: 4, covered: true, distance: 115, height: 55 },
  { id: '320C', name: 'Jim Beam Suite 320C', level: 'suite', compass: 239, span: 4, covered: true, distance: 116, height: 55 },
  { id: '321',  name: 'Jim Beam Suite 321',  level: 'suite', compass: 244, span: 8, covered: true, distance: 120, height: 55 },
  { id: '322',  name: 'Terrace 322',  level: 'club', compass: 253, span: 9, covered: true, distance: 125, height: 55 },
  { id: '323',  name: 'Terrace 323',  level: 'club', compass: 262, span: 9, covered: true, distance: 135, height: 55 },
  { id: '324',  name: 'Terrace 324',  level: 'club', compass: 271, span: 9, covered: true, distance: 145, height: 55 },
  { id: '325',  name: 'Terrace 325',  level: 'club', compass: 280, span: 9, covered: true, distance: 158, height: 55 },
  { id: '326',  name: 'Terrace 326',  level: 'club', compass: 289, span: 9, covered: true, distance: 170, height: 55 },
  { id: '327',  name: 'Terrace 327',  level: 'club', compass: 298, span: 9, covered: true, distance: 185, height: 55 },
  { id: '328',  name: 'Terrace 328',  level: 'club', compass: 307, span: 9, covered: true, distance: 200, height: 55 },
  { id: '329',  name: 'Terrace 329',  level: 'club', compass: 316, span: 9, covered: true, distance: 220, height: 55 },
  { id: '330',  name: 'Terrace 330',  level: 'club', compass: 325, span: 9, covered: true, distance: 240, height: 55 },
  { id: '331',  name: 'Terrace 331',  level: 'club', compass: 334, span: 9, covered: true, distance: 260, height: 55 },
  { id: '332A', name: 'Terrace 332A', level: 'club', compass: 341, span: 4, covered: true, distance: 275, height: 55 },
  { id: '332B', name: 'Terrace 332B', level: 'club', compass: 345, span: 4, covered: true, distance: 280, height: 55 },
  { id: '333',  name: 'Terrace 333',  level: 'club', compass: 352, span: 9, covered: true, distance: 290, height: 55 },
  { id: '334',  name: 'Terrace 334',  level: 'club', compass: 1, span: 9, covered: true, distance: 300, height: 55 },

  // Grandstand 405–434B (iconic frieze caps back rows everywhere — all covered)
  { id: '405',  name: 'Grandstand 405',  level: 'upper', compass: 100, span: 9, covered: true, distance: 290, height: 80 },
  { id: '406',  name: 'Grandstand 406',  level: 'upper', compass: 109, span: 9, covered: true, distance: 275, height: 80 },
  { id: '407A', name: 'Grandstand 407A', level: 'upper', compass: 116, span: 5, covered: true, distance: 260, height: 80 },
  { id: '407B', name: 'Grandstand 407B', level: 'upper', compass: 120, span: 5, covered: true, distance: 255, height: 80 },
  { id: '408',  name: 'Grandstand 408',  level: 'upper', compass: 127, span: 9, covered: true, distance: 240, height: 80 },
  { id: '409',  name: 'Grandstand 409',  level: 'upper', compass: 136, span: 9, covered: true, distance: 220, height: 80 },
  { id: '410',  name: 'Grandstand 410',  level: 'upper', compass: 145, span: 9, covered: true, distance: 200, height: 80 },
  { id: '411',  name: 'Grandstand 411',  level: 'upper', compass: 154, span: 9, covered: true, distance: 185, height: 80 },
  { id: '412',  name: 'Grandstand 412',  level: 'upper', compass: 163, span: 9, covered: true, distance: 172, height: 80 },
  { id: '413',  name: 'Grandstand 413',  level: 'upper', compass: 172, span: 9, covered: true, distance: 160, height: 80 },
  { id: '414',  name: 'Grandstand 414',  level: 'upper', compass: 181, span: 9, covered: true, distance: 150, height: 80 },
  { id: '415',  name: 'Grandstand 415',  level: 'upper', compass: 190, span: 9, covered: true, distance: 142, height: 80 },
  { id: '416',  name: 'Grandstand 416',  level: 'upper', compass: 199, span: 9, covered: true, distance: 135, height: 80 },
  { id: '417',  name: 'Grandstand 417',  level: 'upper', compass: 208, span: 9, covered: true, distance: 128, height: 80 },
  { id: '418',  name: 'Grandstand 418',  level: 'upper', compass: 217, span: 9, covered: true, distance: 122, height: 80 },
  { id: '419',  name: 'Grandstand 419',  level: 'upper', compass: 226, span: 8, covered: true, distance: 118, height: 80 },
  { id: '420A', name: 'Grandstand 420A', level: 'upper', compass: 232, span: 4, covered: true, distance: 115, height: 80 },
  { id: '420B', name: 'Grandstand 420B', level: 'upper', compass: 235, span: 4, covered: true, distance: 114, height: 80 },
  { id: '420C', name: 'Grandstand 420C', level: 'upper', compass: 239, span: 4, covered: true, distance: 115, height: 80 },
  { id: '421',  name: 'Grandstand 421',  level: 'upper', compass: 244, span: 8, covered: true, distance: 120, height: 80 },
  { id: '422',  name: 'Grandstand 422',  level: 'upper', compass: 253, span: 9, covered: true, distance: 128, height: 80 },
  { id: '423',  name: 'Grandstand 423',  level: 'upper', compass: 262, span: 9, covered: true, distance: 135, height: 80 },
  { id: '424',  name: 'Grandstand 424',  level: 'upper', compass: 271, span: 9, covered: true, distance: 145, height: 80 },
  { id: '425',  name: 'Grandstand 425',  level: 'upper', compass: 280, span: 9, covered: true, distance: 158, height: 80 },
  { id: '426',  name: 'Grandstand 426',  level: 'upper', compass: 289, span: 9, covered: true, distance: 170, height: 80 },
  { id: '427',  name: 'Grandstand 427',  level: 'upper', compass: 298, span: 9, covered: true, distance: 185, height: 80 },
  { id: '428',  name: 'Grandstand 428',  level: 'upper', compass: 307, span: 9, covered: true, distance: 200, height: 80 },
  { id: '429',  name: 'Grandstand 429',  level: 'upper', compass: 316, span: 9, covered: true, distance: 220, height: 80 },
  { id: '430',  name: 'Grandstand 430',  level: 'upper', compass: 325, span: 9, covered: true, distance: 240, height: 80 },
  { id: '431A', name: 'Grandstand 431A', level: 'upper', compass: 332, span: 5, covered: true, distance: 255, height: 80 },
  { id: '431B', name: 'Grandstand 431B', level: 'upper', compass: 336, span: 5, covered: true, distance: 260, height: 80 },
  { id: '432A', name: 'Grandstand 432A', level: 'upper', compass: 343, span: 4, covered: true, distance: 275, height: 80 },
  { id: '432B', name: 'Grandstand 432B', level: 'upper', compass: 347, span: 4, covered: true, distance: 280, height: 80 },
  { id: '433',  name: 'Grandstand 433',  level: 'upper', compass: 354, span: 9, covered: true, distance: 290, height: 80 },
  { id: '434A', name: 'Grandstand 434A', level: 'upper', compass: 1, span: 5, covered: true, distance: 300, height: 80 },
  { id: '434B', name: 'Grandstand 434B', level: 'upper', compass: 5, span: 5, covered: true, distance: 305, height: 80 },

  // Pepsi Lounge — indoor lounge on Main Level concourse behind HP
  { id: 'PEPSI-LOUNGE', name: 'Pepsi Lounge', level: 'club', compass: 235, span: 30, covered: true, distance: 200, height: 45 },
];

export const yankeesSections: DetailedSection[] = SECTIONS.map((s) => {
  const baseAngle = convertCompass(s.compass, s.span);
  return {
    id: s.id,
    name: s.name,
    level: s.level,
    baseAngle,
    angleSpan: s.span,
    rows: rowsFor(s.level, s.covered, s.height),
    vertices3D: vertices(baseAngle, s.span, s.distance, s.height),
    covered: s.covered,
    distance: s.distance,
    height: s.height,
    rake: rakeFor(s.level),
  };
});

export const yankeesSectionMap = new Map(yankeesSections.map((s) => [s.id, s]));

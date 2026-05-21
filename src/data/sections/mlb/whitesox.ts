// Guaranteed Rate Field — Chicago White Sox
//
// Real per-section seating data, authored 2026-05-21 from MLB.com White Sox
// interactive seating map, StubHub, shadedseats.com, intheballparks.com, and
// rateyourseats.com. Cross-referenced with satellite imagery on Google Maps.
//
// Verified compass orientation: HP→CF = 120° ESE.
//   • The Shadium's own venue page: "east-southeast-facing orientation (120°)"
//   • shadedseats.com: "sun rises over LF wall, sets behind HP"
//   • Andrew Clem's Baseball: "home plate through second base toward center
//     field would point to the southeast"
// LF foul pole ≈ compass 75°, RF foul pole ≈ compass 165°.
//
// Convention reminder (see sectionSunCalculations.ts header):
//   `baseAngle` is STADIUM-LOCAL — 0=1B, 90=CF, 180=3B, 270=behind HP.
//   The research input is compass bearing from HP. Conversion:
//     stadium-local CENTER  = (orientation + 90 − compass_bearing) mod 360
//     baseAngle (start)     = stadium-local CENTER − angleSpan/2
//   Built-in below as `convertCompass(...)` so the per-section table reads in
//   the same units the research came back in (compass bearings).
//
// Layout quirks (data integrity notes — see commit message for full provenance):
//   • Sections 100–105 are "Outfield Reserved" chairbacks in DEEP RIGHT FIELD,
//     NOT behind home plate. Numbering wraps from RF outfield → RF foul pole
//     → 1B line → behind HP (~132/133) → 3B line → LF foul pole → LF Outfield
//     Reserved → LCF Bleachers.
//   • Sections 106–107 do not exist as ticketed sections — that area is the
//     Miller Lite Landing (modeled as a standing-room entry).
//   • Scout Seats 130/131/133/134 are separately-ticketed field-level boxes
//     in front of the corresponding 100-level Lower Box section. Section 132's
//     Scout Seats footprint is the camera well / photographer position.
//   • The 300-level Club skips 313, 315, 317, etc. — those numbers are the
//     Stadium Club / Champions Suites / private suites along the back wall and
//     are not ticketed bowl sections; deliberately omitted.
//   • Lower-bowl sections 111–155 are marked `covered: true` because their
//     back rows sit under the upper-deck overhang. Front rows are not covered
//     in reality; the row-level calculator approximates this via overhangHeight.
//   • Upper-deck sections all `covered: true`; per RateYourSeats, "row 9 and
//     above" of the 500 level is sheltered.

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

const ORIENTATION_DEG = 120;

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

// Source-of-truth section table (compass bearings from HP).
// Order: lower (RF outfield → RF line → behind HP → 3B line → LF foul → LF
// outfield → LCF bleachers), then field (Scout Seats), then standing (Miller
// Lite), then suite (Guaranteed Rate Club), then club (300s), then upper
// (500s).
const SECTIONS: SectionInput[] = [
  // Outfield Reserved — deep RF chairbacks beyond the visitor bullpen
  { id: '100', name: 'Outfield Reserved 100', level: 'lower', compass: 153, span: 7, covered: false, distance: 380, height: 15 },
  { id: '101', name: 'Outfield Reserved 101', level: 'lower', compass: 147, span: 7, covered: false, distance: 385, height: 15 },
  { id: '102', name: 'Outfield Reserved 102', level: 'lower', compass: 141, span: 7, covered: false, distance: 390, height: 15 },
  { id: '103', name: 'Outfield Reserved 103', level: 'lower', compass: 135, span: 7, covered: false, distance: 395, height: 15 },
  { id: '104', name: 'Outfield Reserved 104', level: 'lower', compass: 130, span: 6, covered: false, distance: 400, height: 15 },
  { id: '105', name: 'Outfield Reserved 105', level: 'lower', compass: 125, span: 6, covered: false, distance: 405, height: 15 },

  // Lower Box — wraps from RF foul pole (108) around to LF foul pole (156)
  { id: '108', name: 'Lower Box 108', level: 'lower', compass: 163, span: 6, covered: false, distance: 335, height: 12 },
  { id: '109', name: 'Lower Box 109', level: 'lower', compass: 168, span: 6, covered: false, distance: 320, height: 13 },
  { id: '110', name: 'Lower Box 110', level: 'lower', compass: 173, span: 6, covered: false, distance: 305, height: 13 },
  { id: '111', name: 'Lower Box 111', level: 'lower', compass: 179, span: 6, covered: true,  distance: 290, height: 14 },
  { id: '112', name: 'Lower Box 112', level: 'lower', compass: 186, span: 6, covered: true,  distance: 275, height: 14 },
  { id: '113', name: 'Lower Box 113', level: 'lower', compass: 193, span: 6, covered: true,  distance: 260, height: 15 },
  { id: '114', name: 'Lower Box 114', level: 'lower', compass: 200, span: 7, covered: true,  distance: 245, height: 15 },
  { id: '115', name: 'Lower Box 115', level: 'lower', compass: 207, span: 7, covered: true,  distance: 230, height: 16 },
  { id: '116', name: 'Lower Box 116', level: 'lower', compass: 214, span: 7, covered: true,  distance: 215, height: 16 },
  { id: '117', name: 'Lower Box 117', level: 'lower', compass: 221, span: 7, covered: true,  distance: 200, height: 16 },
  { id: '118', name: 'Lower Box 118', level: 'lower', compass: 228, span: 6, covered: true,  distance: 185, height: 17 },
  { id: '119', name: 'Lower Box 119', level: 'lower', compass: 234, span: 6, covered: true,  distance: 170, height: 17 },
  { id: '120', name: 'Lower Box 120', level: 'lower', compass: 240, span: 6, covered: true,  distance: 155, height: 17 },
  { id: '121', name: 'Lower Box 121', level: 'lower', compass: 246, span: 6, covered: true,  distance: 142, height: 17 },
  { id: '122', name: 'Lower Box 122', level: 'lower', compass: 252, span: 6, covered: true,  distance: 130, height: 18 },
  { id: '123', name: 'Lower Box 123', level: 'lower', compass: 257, span: 5, covered: true,  distance: 118, height: 18 },
  { id: '124', name: 'Lower Box 124', level: 'lower', compass: 262, span: 5, covered: true,  distance: 108, height: 18 },
  { id: '125', name: 'Lower Box 125', level: 'lower', compass: 267, span: 5, covered: true,  distance: 100, height: 18 },
  { id: '126', name: 'Lower Box 126', level: 'lower', compass: 272, span: 5, covered: true,  distance: 93,  height: 18 },
  { id: '127', name: 'Lower Box 127', level: 'lower', compass: 277, span: 5, covered: true,  distance: 88,  height: 18 },
  { id: '128', name: 'Lower Box 128', level: 'lower', compass: 282, span: 5, covered: true,  distance: 83,  height: 18 },
  { id: '129', name: 'Lower Box 129', level: 'lower', compass: 287, span: 5, covered: true,  distance: 80,  height: 18 },
  { id: '130', name: 'Lower Box 130', level: 'lower', compass: 292, span: 4, covered: true,  distance: 78,  height: 18 },
  { id: '131', name: 'Lower Box 131', level: 'lower', compass: 296, span: 4, covered: true,  distance: 76,  height: 18 },
  { id: '132', name: 'Lower Box 132', level: 'lower', compass: 300, span: 4, covered: true,  distance: 75,  height: 18 }, // dead-center behind HP
  { id: '133', name: 'Lower Box 133', level: 'lower', compass: 304, span: 4, covered: true,  distance: 76,  height: 18 },
  { id: '134', name: 'Lower Box 134', level: 'lower', compass: 308, span: 4, covered: true,  distance: 78,  height: 18 },
  { id: '135', name: 'Lower Box 135', level: 'lower', compass: 312, span: 4, covered: true,  distance: 80,  height: 18 },
  { id: '136', name: 'Lower Box 136', level: 'lower', compass: 317, span: 5, covered: true,  distance: 83,  height: 18 },
  { id: '137', name: 'Lower Box 137', level: 'lower', compass: 322, span: 5, covered: true,  distance: 88,  height: 18 },
  { id: '138', name: 'Lower Box 138', level: 'lower', compass: 327, span: 5, covered: true,  distance: 93,  height: 18 },
  { id: '139', name: 'Lower Box 139', level: 'lower', compass: 332, span: 5, covered: true,  distance: 100, height: 18 },
  { id: '140', name: 'Lower Box 140', level: 'lower', compass: 337, span: 5, covered: true,  distance: 108, height: 18 },
  { id: '141', name: 'Lower Box 141', level: 'lower', compass: 342, span: 5, covered: true,  distance: 118, height: 18 },
  { id: '142', name: 'Lower Box 142', level: 'lower', compass: 347, span: 5, covered: true,  distance: 130, height: 18 },
  { id: '143', name: 'Lower Box 143', level: 'lower', compass: 353, span: 6, covered: true,  distance: 142, height: 17 },
  { id: '144', name: 'Lower Box 144', level: 'lower', compass: 359, span: 6, covered: true,  distance: 155, height: 17 },
  { id: '145', name: 'Lower Box 145', level: 'lower', compass: 5,   span: 6, covered: true,  distance: 170, height: 17 },
  { id: '146', name: 'Lower Box 146', level: 'lower', compass: 11,  span: 6, covered: true,  distance: 185, height: 17 },
  { id: '147', name: 'Lower Box 147', level: 'lower', compass: 17,  span: 6, covered: true,  distance: 200, height: 16 },
  { id: '148', name: 'Lower Box 148', level: 'lower', compass: 24,  span: 7, covered: true,  distance: 215, height: 16 },
  { id: '149', name: 'Lower Box 149', level: 'lower', compass: 31,  span: 7, covered: true,  distance: 230, height: 16 },
  { id: '150', name: 'Lower Box 150', level: 'lower', compass: 38,  span: 7, covered: true,  distance: 245, height: 15 },
  { id: '151', name: 'Lower Box 151', level: 'lower', compass: 45,  span: 7, covered: true,  distance: 260, height: 15 },
  { id: '152', name: 'Lower Box 152', level: 'lower', compass: 52,  span: 6, covered: true,  distance: 275, height: 14 },
  { id: '153', name: 'Lower Box 153', level: 'lower', compass: 58,  span: 6, covered: true,  distance: 290, height: 14 },
  { id: '154', name: 'Lower Box 154', level: 'lower', compass: 64,  span: 6, covered: true,  distance: 305, height: 13 },
  { id: '155', name: 'Lower Box 155', level: 'lower', compass: 70,  span: 6, covered: true,  distance: 320, height: 13 },
  { id: '156', name: 'Lower Box 156', level: 'lower', compass: 75,  span: 6, covered: false, distance: 335, height: 12 },

  // Outfield Reserved — LF outfield chairbacks
  { id: '157', name: 'Outfield Reserved 157', level: 'lower', compass: 81, span: 6, covered: false, distance: 365, height: 13 },
  { id: '158', name: 'Outfield Reserved 158', level: 'lower', compass: 87, span: 6, covered: false, distance: 375, height: 13 },
  { id: '159', name: 'Outfield Reserved 159', level: 'lower', compass: 93, span: 6, covered: false, distance: 385, height: 13 },

  // Bleachers — left-center field bleachers
  { id: '160', name: 'Bleachers 160', level: 'lower', compass: 99,  span: 5, covered: false, distance: 410, height: 15 },
  { id: '161', name: 'Bleachers 161', level: 'lower', compass: 104, span: 5, covered: false, distance: 420, height: 16 },
  { id: '162', name: 'Bleachers 162', level: 'lower', compass: 109, span: 5, covered: false, distance: 425, height: 16 },
  { id: '163', name: 'Bleachers 163', level: 'lower', compass: 114, span: 5, covered: false, distance: 430, height: 17 },
  { id: '164', name: 'Bleachers 164', level: 'lower', compass: 119, span: 5, covered: false, distance: 435, height: 17 },

  // Scout Seats — field-level premium boxes in front of Lower Box 130/131/133/134
  { id: 'SCOUT-130', name: 'Scout Seats 130', level: 'field', compass: 292, span: 4, covered: false, distance: 58, height: 4 },
  { id: 'SCOUT-131', name: 'Scout Seats 131', level: 'field', compass: 296, span: 4, covered: false, distance: 55, height: 4 },
  { id: 'SCOUT-133', name: 'Scout Seats 133', level: 'field', compass: 304, span: 4, covered: false, distance: 55, height: 4 },
  { id: 'SCOUT-134', name: 'Scout Seats 134', level: 'field', compass: 308, span: 4, covered: false, distance: 58, height: 4 },

  // Miller Lite Landing — standing-room at RF foul pole (sections 106/107 area)
  { id: 'MLL',     name: 'Miller Lite Landing',     level: 'standing', compass: 160, span: 12, covered: false, distance: 350, height: 18 },
  { id: 'MLL-SRO', name: 'Miller Lite Landing SRO', level: 'standing', compass: 160, span: 8,  covered: false, distance: 360, height: 22 },

  // Guaranteed Rate Club — small 200-level club directly behind HP
  { id: 'GRC', name: 'Guaranteed Rate Club', level: 'suite', compass: 300, span: 28, covered: true, distance: 70, height: 32 },

  // 300-level Club — covered (under upper deck)
  { id: '311', name: 'Club 311', level: 'club', compass: 168, span: 9, covered: true, distance: 340, height: 38 },
  { id: '312', name: 'Club 312', level: 'club', compass: 178, span: 9, covered: true, distance: 320, height: 38 },
  { id: '314', name: 'Club 314', level: 'club', compass: 188, span: 8, covered: true, distance: 295, height: 38 },
  { id: '316', name: 'Club 316', level: 'club', compass: 198, span: 8, covered: true, distance: 270, height: 38 },
  { id: '318', name: 'Club 318', level: 'club', compass: 208, span: 8, covered: true, distance: 245, height: 38 },
  { id: '320', name: 'Club 320', level: 'club', compass: 218, span: 8, covered: true, distance: 220, height: 38 },
  { id: '322', name: 'Club 322', level: 'club', compass: 228, span: 8, covered: true, distance: 195, height: 38 },
  { id: '324', name: 'Club 324', level: 'club', compass: 238, span: 8, covered: true, distance: 170, height: 38 },
  { id: '326', name: 'Club 326', level: 'club', compass: 248, span: 7, covered: true, distance: 145, height: 38 },
  { id: '328', name: 'Club 328', level: 'club', compass: 258, span: 7, covered: true, distance: 120, height: 38 },
  { id: '329', name: 'Club 329', level: 'club', compass: 268, span: 6, covered: true, distance: 100, height: 38 },
  { id: '330', name: 'Club 330', level: 'club', compass: 282, span: 6, covered: true, distance: 88,  height: 38 },
  { id: '334', name: 'Club 334', level: 'club', compass: 295, span: 5, covered: true, distance: 78,  height: 38 },
  { id: '335', name: 'Club 335', level: 'club', compass: 300, span: 5, covered: true, distance: 75,  height: 38 },
  { id: '336', name: 'Club 336', level: 'club', compass: 305, span: 5, covered: true, distance: 78,  height: 38 },
  { id: '338', name: 'Club 338', level: 'club', compass: 318, span: 6, covered: true, distance: 88,  height: 38 },
  { id: '340', name: 'Club 340', level: 'club', compass: 332, span: 6, covered: true, distance: 100, height: 38 },
  { id: '342', name: 'Club 342', level: 'club', compass: 342, span: 7, covered: true, distance: 120, height: 38 },
  { id: '344', name: 'Club 344', level: 'club', compass: 352, span: 7, covered: true, distance: 145, height: 38 },
  { id: '346', name: 'Club 346', level: 'club', compass: 2,   span: 8, covered: true, distance: 170, height: 38 },
  { id: '348', name: 'Club 348', level: 'club', compass: 12,  span: 8, covered: true, distance: 195, height: 38 },
  { id: '350', name: 'Club 350', level: 'club', compass: 22,  span: 8, covered: true, distance: 220, height: 38 },
  { id: '352', name: 'Club 352', level: 'club', compass: 32,  span: 8, covered: true, distance: 245, height: 38 },
  { id: '354', name: 'Club 354', level: 'club', compass: 42,  span: 8, covered: true, distance: 270, height: 38 },
  { id: '356', name: 'Club 356', level: 'club', compass: 52,  span: 9, covered: true, distance: 295, height: 38 },
  { id: '357', name: 'Club 357', level: 'club', compass: 62,  span: 9, covered: true, distance: 320, height: 38 },

  // 500-level Upper — covered (back rows under deck overhang)
  { id: '506', name: 'Upper Reserved 506', level: 'upper', compass: 158, span: 8, covered: true, distance: 365, height: 78 },
  { id: '507', name: 'Upper Reserved 507', level: 'upper', compass: 165, span: 7, covered: true, distance: 350, height: 78 },
  { id: '508', name: 'Upper Reserved 508', level: 'upper', compass: 172, span: 7, covered: true, distance: 335, height: 78 },
  { id: '509', name: 'Upper Reserved 509', level: 'upper', compass: 179, span: 7, covered: true, distance: 320, height: 78 },
  { id: '510', name: 'Upper Reserved 510', level: 'upper', compass: 186, span: 7, covered: true, distance: 305, height: 78 },
  { id: '512', name: 'Upper Box 512',      level: 'upper', compass: 194, span: 8, covered: true, distance: 285, height: 78 },
  { id: '514', name: 'Upper Box 514',      level: 'upper', compass: 202, span: 8, covered: true, distance: 265, height: 78 },
  { id: '516', name: 'Upper Box 516',      level: 'upper', compass: 210, span: 8, covered: true, distance: 245, height: 78 },
  { id: '518', name: 'Upper Box 518',      level: 'upper', compass: 218, span: 8, covered: true, distance: 225, height: 78 },
  { id: '520', name: 'Upper Box 520',      level: 'upper', compass: 226, span: 8, covered: true, distance: 205, height: 78 },
  { id: '522', name: 'Upper Box 522',      level: 'upper', compass: 234, span: 8, covered: true, distance: 185, height: 78 },
  { id: '524', name: 'Upper Box 524',      level: 'upper', compass: 242, span: 7, covered: true, distance: 165, height: 78 },
  { id: '526', name: 'Upper Box 526',      level: 'upper', compass: 250, span: 7, covered: true, distance: 145, height: 78 },
  { id: '527', name: 'Upper Box 527',      level: 'upper', compass: 257, span: 6, covered: true, distance: 130, height: 78 },
  { id: '528', name: 'Upper Box 528',      level: 'upper', compass: 263, span: 6, covered: true, distance: 118, height: 78 },
  { id: '529', name: 'Upper Box 529',      level: 'upper', compass: 269, span: 6, covered: true, distance: 108, height: 78 },
  { id: '530', name: 'Upper Box 530',      level: 'upper', compass: 275, span: 5, covered: true, distance: 100, height: 78 },
  { id: '531', name: 'Upper Box 531',      level: 'upper', compass: 281, span: 5, covered: true, distance: 94,  height: 78 },
  { id: '533', name: 'Upper Box 533',      level: 'upper', compass: 297, span: 5, covered: true, distance: 88,  height: 78 },
  { id: '534', name: 'Upper Box 534',      level: 'upper', compass: 302, span: 5, covered: true, distance: 86,  height: 78 },
  { id: '535', name: 'Upper Box 535',      level: 'upper', compass: 308, span: 5, covered: true, distance: 88,  height: 78 },
  { id: '536', name: 'Upper Box 536',      level: 'upper', compass: 314, span: 5, covered: true, distance: 94,  height: 78 },
  { id: '537', name: 'Upper Box 537',      level: 'upper', compass: 320, span: 6, covered: true, distance: 100, height: 78 },
  { id: '538', name: 'Upper Box 538',      level: 'upper', compass: 326, span: 6, covered: true, distance: 108, height: 78 },
  { id: '540', name: 'Upper Box 540',      level: 'upper', compass: 333, span: 6, covered: true, distance: 118, height: 78 },
  { id: '542', name: 'Upper Box 542',      level: 'upper', compass: 340, span: 7, covered: true, distance: 130, height: 78 },
  { id: '544', name: 'Upper Box 544',      level: 'upper', compass: 348, span: 7, covered: true, distance: 145, height: 78 },
  { id: '546', name: 'Upper Box 546',      level: 'upper', compass: 357, span: 8, covered: true, distance: 165, height: 78 },
  { id: '548', name: 'Upper Box 548',      level: 'upper', compass: 5,   span: 8, covered: true, distance: 185, height: 78 },
  { id: '550', name: 'Upper Box 550',      level: 'upper', compass: 13,  span: 8, covered: true, distance: 205, height: 78 },
  { id: '552', name: 'Upper Box 552',      level: 'upper', compass: 21,  span: 8, covered: true, distance: 225, height: 78 },
  { id: '554', name: 'Upper Box 554',      level: 'upper', compass: 29,  span: 8, covered: true, distance: 245, height: 78 },
  { id: '555', name: 'Upper Reserved 555', level: 'upper', compass: 37,  span: 7, covered: true, distance: 265, height: 78 },
  { id: '556', name: 'Upper Reserved 556', level: 'upper', compass: 45,  span: 7, covered: true, distance: 285, height: 78 },
  { id: '557', name: 'Upper Reserved 557', level: 'upper', compass: 53,  span: 7, covered: true, distance: 305, height: 78 },
  { id: '558', name: 'Upper Reserved 558', level: 'upper', compass: 60,  span: 8, covered: true, distance: 320, height: 78 },
];

export const whitesoxSections: DetailedSection[] = SECTIONS.map((s) => {
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

export const whitesoxSectionMap = new Map(whitesoxSections.map((s) => [s.id, s]));

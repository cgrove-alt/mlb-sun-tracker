// Fenway Park — Boston Red Sox
//
// Real per-section seating data, authored 2026-05-21 from MLB.com Red Sox
// interactive seating map (via RateYourSeats sections list as canonical
// mirror), StubHub, shadedseats.com, intheballparks.com, and Wikipedia.
// Cross-referenced with Google Maps satellite at 42.3467°N, -71.0972°W.
//
// Verified compass orientation: HP→CF = 52° NE.
//   • Confirmed by shadedseats narrative ("oriented NE; sun rises behind RF
//     bleachers, sets behind 3rd-base near LF corner") + Andrew Clem's
//     Fenway page + satellite imagery.
//   • RF foul pole (Pesky's Pole) ≈ compass 97° E; LF foul pole (Fisk Pole
//     at Green Monster's RF edge) ≈ compass 7° N; behind HP ≈ compass 232°
//     SW. (Foul poles are 45° off the HP→CF axis, not 90°.)
//
// Convention (see sectionSunCalculations.ts header):
//   baseAngle is STADIUM-LOCAL — 0=1B, 90=CF, 180=3B, 270=behind HP.
//   Conversion: localCenter = (orientation + 90 − compass) mod 360;
//               baseAngle   = (localCenter − angleSpan/2) mod 360.
//   Built-in below as convertCompass().
//
// Fenway-specific architecture baked into the data:
//   • Field Box (FB-1 through FB-82): 82 sections wrapping the entire bowl
//     foul-line to foul-line. FB-39 through FB-50 marked covered=true —
//     consistently shaded by the press-box / Pavilion stack overhead per
//     shadedseats ("upper rows of FB-39-50 are shaded for 1pm games"). All
//     other FB sections uncovered.
//   • Loge Box (LB-98 through LB-165, skipping LB-156 — no such section
//     published): 67 sections in the second tier. LB-123 through LB-136
//     marked covered=true (consistently shaded behind HP); others
//     uncovered.
//   • Grandstand (GS-1 through GS-33): 33 iconic wooden-seat sections.
//     ALL covered=true EXCEPT GS-33 (per RateYourSeats: "all Grandstand
//     sections except GS33 are covered"). GS-33 sits at the LF/Green
//     Monster transition where the Pavilion roof structure ends.
//   • Bleachers (BL-34 through BL-43): 10 outdoor benches in deep CF/RCF.
//     None covered. BL-35 is the famous batter's-eye tarped section during
//     day games.
//   • Monster Seats (M-1 through M-10): atop the 37ft Green Monster wall
//     in LF. None covered (shadedseats: "bake all afternoon").
//   • Right Field Box (RB-87 through RB-97): lower fair-territory chairback
//     seats in deep RF beyond Pesky's Pole. None covered.
//   • Right Field Roof Box (RR-23 odd through RR-43): 11 sections atop the
//     RF grandstand roof. Open above (no roof on the roof). None covered.
//   • EMC Club / Dell Technologies Club (EMCC-1 through EMCC-6): 6
//     premium-indoor club sections behind HP. All covered.
//   • Home Plate Pavilion Club (HPPC-1 through HPPC-5): 5 premium covered
//     suite-level sections directly behind HP.
//   • State Street Pavilion Club (SSPC-1 through SSPC-14): outdoor club
//     seats above HPPC. Per RateYourSeats: "SSPC sits in front of PB on
//     same level and is open-air, no overhang." All uncovered (despite
//     indoor lounge access).
//   • Pavilion Box (PB-1 through PB-14): 14 covered premium suite sections
//     under the Pavilion roof.
//   • Pavilion Reserved (PR-15, PR-16, PR-18, PR-20): 4 outer sections at
//     the ends of the Pavilion area. Uncovered (beyond Pavilion roof).
//   • Royal Rooters Club: indoor pregame lounge at street/concourse level
//     behind HP. Covered, level=club, height=0.
//   • Standing areas (Hornitos Cantina, Coca-Cola Corner SRO, Green Monster
//     SRO, Right Field Roof Box/Deck SRO, Roof Deck Tables, First/Third
//     Base Pavilion SRO, general SRO): mixed coverage per location.
//
// Section count: 275, far exceeding the typical MLB bowl. This is real for
// Fenway because of dense sub-sectioning of the Field Box and Loge Box
// tiers, plus the Pavilion / EMC / Roof Box / Monster Seats / Bleachers
// sub-bowls that don't exist at typical MLB parks.

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

const ORIENTATION_DEG = 52;

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

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
    case 'field':    return generateRows(8, 18, baseElev, 12, covered);
    case 'lower':    return generateRows(30, 20, baseElev, 18, covered);
    case 'club':     return generateRows(15, 16, baseElev, 25, covered);
    case 'upper':    return generateRows(25, 18, baseElev, 30, covered);
    case 'suite':    return generateRows(4, 10, baseElev, 0, covered);
    case 'standing': return [];
    default:         return generateRows(15, 18, baseElev, 20, covered);
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
  // Field Box (FB-1 through FB-82): 82 sections wrapping the bowl
  { id: 'FB-1',  name: 'Field Box 1',  level: 'field', compass: 97,  span: 3, covered: false, distance: 310, height: 8 },
  { id: 'FB-2',  name: 'Field Box 2',  level: 'field', compass: 100, span: 3, covered: false, distance: 305, height: 8 },
  { id: 'FB-3',  name: 'Field Box 3',  level: 'field', compass: 104, span: 3, covered: false, distance: 295, height: 8 },
  { id: 'FB-4',  name: 'Field Box 4',  level: 'field', compass: 107, span: 3, covered: false, distance: 285, height: 8 },
  { id: 'FB-5',  name: 'Field Box 5',  level: 'field', compass: 110, span: 3, covered: false, distance: 275, height: 8 },
  { id: 'FB-6',  name: 'Field Box 6',  level: 'field', compass: 114, span: 3, covered: false, distance: 265, height: 8 },
  { id: 'FB-7',  name: 'Field Box 7',  level: 'field', compass: 117, span: 3, covered: false, distance: 255, height: 8 },
  { id: 'FB-8',  name: 'Field Box 8',  level: 'field', compass: 121, span: 3, covered: false, distance: 245, height: 8 },
  { id: 'FB-9',  name: 'Field Box 9',  level: 'field', compass: 124, span: 3, covered: false, distance: 235, height: 8 },
  { id: 'FB-10', name: 'Field Box 10', level: 'field', compass: 128, span: 3, covered: false, distance: 225, height: 8 },
  { id: 'FB-11', name: 'Field Box 11', level: 'field', compass: 131, span: 3, covered: false, distance: 215, height: 8 },
  { id: 'FB-12', name: 'Field Box 12', level: 'field', compass: 135, span: 3, covered: false, distance: 205, height: 8 },
  { id: 'FB-13', name: 'Field Box 13', level: 'field', compass: 138, span: 3, covered: false, distance: 195, height: 8 },
  { id: 'FB-14', name: 'Field Box 14', level: 'field', compass: 142, span: 3, covered: false, distance: 185, height: 8 },
  { id: 'FB-15', name: 'Field Box 15', level: 'field', compass: 145, span: 3, covered: false, distance: 175, height: 8 },
  { id: 'FB-16', name: 'Field Box 16', level: 'field', compass: 149, span: 3, covered: false, distance: 165, height: 8 },
  { id: 'FB-17', name: 'Field Box 17', level: 'field', compass: 152, span: 3, covered: false, distance: 158, height: 8 },
  { id: 'FB-18', name: 'Field Box 18', level: 'field', compass: 156, span: 3, covered: false, distance: 150, height: 8 },
  { id: 'FB-19', name: 'Field Box 19', level: 'field', compass: 159, span: 3, covered: false, distance: 142, height: 8 },
  { id: 'FB-20', name: 'Field Box 20', level: 'field', compass: 162, span: 3, covered: false, distance: 135, height: 8 },
  { id: 'FB-21', name: 'Field Box 21', level: 'field', compass: 166, span: 3, covered: false, distance: 130, height: 8 },
  { id: 'FB-22', name: 'Field Box 22', level: 'field', compass: 169, span: 3, covered: false, distance: 125, height: 8 },
  { id: 'FB-23', name: 'Field Box 23', level: 'field', compass: 173, span: 3, covered: false, distance: 120, height: 8 },
  { id: 'FB-24', name: 'Field Box 24', level: 'field', compass: 176, span: 3, covered: false, distance: 115, height: 8 },
  { id: 'FB-25', name: 'Field Box 25', level: 'field', compass: 180, span: 3, covered: false, distance: 110, height: 8 },
  { id: 'FB-26', name: 'Field Box 26', level: 'field', compass: 183, span: 3, covered: false, distance: 105, height: 8 },
  { id: 'FB-27', name: 'Field Box 27', level: 'field', compass: 187, span: 3, covered: false, distance: 100, height: 8 },
  { id: 'FB-28', name: 'Field Box 28', level: 'field', compass: 190, span: 3, covered: false, distance: 95,  height: 8 },
  { id: 'FB-29', name: 'Field Box 29', level: 'field', compass: 194, span: 3, covered: false, distance: 92,  height: 8 },
  { id: 'FB-30', name: 'Field Box 30', level: 'field', compass: 197, span: 3, covered: false, distance: 90,  height: 8 },
  { id: 'FB-31', name: 'Field Box 31', level: 'field', compass: 200, span: 3, covered: false, distance: 88,  height: 8 },
  { id: 'FB-32', name: 'Field Box 32', level: 'field', compass: 204, span: 3, covered: false, distance: 86,  height: 8 },
  { id: 'FB-33', name: 'Field Box 33', level: 'field', compass: 207, span: 3, covered: false, distance: 84,  height: 8 },
  { id: 'FB-34', name: 'Field Box 34', level: 'field', compass: 211, span: 3, covered: false, distance: 82,  height: 8 },
  { id: 'FB-35', name: 'Field Box 35', level: 'field', compass: 214, span: 3, covered: false, distance: 81,  height: 8 },
  { id: 'FB-36', name: 'Field Box 36', level: 'field', compass: 218, span: 3, covered: false, distance: 80,  height: 8 },
  { id: 'FB-37', name: 'Field Box 37', level: 'field', compass: 221, span: 3, covered: false, distance: 80,  height: 8 },
  { id: 'FB-38', name: 'Field Box 38', level: 'field', compass: 225, span: 3, covered: false, distance: 80,  height: 8 },
  { id: 'FB-39', name: 'Field Box 39', level: 'field', compass: 228, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-40', name: 'Field Box 40', level: 'field', compass: 232, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-41', name: 'Field Box 41', level: 'field', compass: 235, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-42', name: 'Field Box 42', level: 'field', compass: 239, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-43', name: 'Field Box 43', level: 'field', compass: 242, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-44', name: 'Field Box 44', level: 'field', compass: 246, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-45', name: 'Field Box 45', level: 'field', compass: 249, span: 3, covered: true,  distance: 80,  height: 8 },
  { id: 'FB-46', name: 'Field Box 46', level: 'field', compass: 252, span: 3, covered: true,  distance: 81,  height: 8 },
  { id: 'FB-47', name: 'Field Box 47', level: 'field', compass: 256, span: 3, covered: true,  distance: 82,  height: 8 },
  { id: 'FB-48', name: 'Field Box 48', level: 'field', compass: 259, span: 3, covered: true,  distance: 84,  height: 8 },
  { id: 'FB-49', name: 'Field Box 49', level: 'field', compass: 263, span: 3, covered: true,  distance: 86,  height: 8 },
  { id: 'FB-50', name: 'Field Box 50', level: 'field', compass: 266, span: 3, covered: true,  distance: 88,  height: 8 },
  { id: 'FB-51', name: 'Field Box 51', level: 'field', compass: 270, span: 3, covered: false, distance: 90,  height: 8 },
  { id: 'FB-52', name: 'Field Box 52', level: 'field', compass: 273, span: 3, covered: false, distance: 92,  height: 8 },
  { id: 'FB-53', name: 'Field Box 53', level: 'field', compass: 277, span: 3, covered: false, distance: 95,  height: 8 },
  { id: 'FB-54', name: 'Field Box 54', level: 'field', compass: 280, span: 3, covered: false, distance: 100, height: 8 },
  { id: 'FB-55', name: 'Field Box 55', level: 'field', compass: 284, span: 3, covered: false, distance: 105, height: 8 },
  { id: 'FB-56', name: 'Field Box 56', level: 'field', compass: 287, span: 3, covered: false, distance: 110, height: 8 },
  { id: 'FB-57', name: 'Field Box 57', level: 'field', compass: 291, span: 3, covered: false, distance: 115, height: 8 },
  { id: 'FB-58', name: 'Field Box 58', level: 'field', compass: 294, span: 3, covered: false, distance: 120, height: 8 },
  { id: 'FB-59', name: 'Field Box 59', level: 'field', compass: 298, span: 3, covered: false, distance: 125, height: 8 },
  { id: 'FB-60', name: 'Field Box 60', level: 'field', compass: 301, span: 3, covered: false, distance: 130, height: 8 },
  { id: 'FB-61', name: 'Field Box 61', level: 'field', compass: 304, span: 3, covered: false, distance: 138, height: 8 },
  { id: 'FB-62', name: 'Field Box 62', level: 'field', compass: 308, span: 3, covered: false, distance: 145, height: 8 },
  { id: 'FB-63', name: 'Field Box 63', level: 'field', compass: 311, span: 3, covered: false, distance: 152, height: 8 },
  { id: 'FB-64', name: 'Field Box 64', level: 'field', compass: 315, span: 3, covered: false, distance: 160, height: 8 },
  { id: 'FB-65', name: 'Field Box 65', level: 'field', compass: 318, span: 3, covered: false, distance: 168, height: 8 },
  { id: 'FB-66', name: 'Field Box 66', level: 'field', compass: 322, span: 3, covered: false, distance: 175, height: 8 },
  { id: 'FB-67', name: 'Field Box 67', level: 'field', compass: 325, span: 3, covered: false, distance: 185, height: 8 },
  { id: 'FB-68', name: 'Field Box 68', level: 'field', compass: 329, span: 3, covered: false, distance: 195, height: 8 },
  { id: 'FB-69', name: 'Field Box 69', level: 'field', compass: 332, span: 3, covered: false, distance: 205, height: 8 },
  { id: 'FB-70', name: 'Field Box 70', level: 'field', compass: 336, span: 3, covered: false, distance: 215, height: 8 },
  { id: 'FB-71', name: 'Field Box 71', level: 'field', compass: 339, span: 3, covered: false, distance: 225, height: 8 },
  { id: 'FB-72', name: 'Field Box 72', level: 'field', compass: 343, span: 3, covered: false, distance: 235, height: 8 },
  { id: 'FB-73', name: 'Field Box 73', level: 'field', compass: 346, span: 3, covered: false, distance: 245, height: 8 },
  { id: 'FB-74', name: 'Field Box 74', level: 'field', compass: 350, span: 3, covered: false, distance: 255, height: 8 },
  { id: 'FB-75', name: 'Field Box 75', level: 'field', compass: 353, span: 3, covered: false, distance: 265, height: 8 },
  { id: 'FB-76', name: 'Field Box 76', level: 'field', compass: 357, span: 3, covered: false, distance: 275, height: 8 },
  { id: 'FB-77', name: 'Field Box 77', level: 'field', compass: 0,   span: 3, covered: false, distance: 285, height: 8 },
  { id: 'FB-78', name: 'Field Box 78', level: 'field', compass: 4,   span: 3, covered: false, distance: 295, height: 8 },
  { id: 'FB-79', name: 'Field Box 79', level: 'field', compass: 7,   span: 3, covered: false, distance: 305, height: 8 },
  { id: 'FB-80', name: 'Field Box 80', level: 'field', compass: 10,  span: 3, covered: false, distance: 305, height: 8 },
  { id: 'FB-81', name: 'Field Box 81', level: 'field', compass: 14,  span: 3, covered: false, distance: 305, height: 8 },
  { id: 'FB-82', name: 'Field Box 82', level: 'field', compass: 17,  span: 3, covered: false, distance: 305, height: 8 },

  // Loge Box (LB-98 through LB-165, skipping LB-156): 67 sections
  { id: 'LB-98',  name: 'Loge Box 98',  level: 'lower', compass: 97,  span: 4, covered: false, distance: 320, height: 22 },
  { id: 'LB-99',  name: 'Loge Box 99',  level: 'lower', compass: 101, span: 4, covered: false, distance: 310, height: 22 },
  { id: 'LB-100', name: 'Loge Box 100', level: 'lower', compass: 105, span: 4, covered: false, distance: 300, height: 22 },
  { id: 'LB-101', name: 'Loge Box 101', level: 'lower', compass: 109, span: 4, covered: false, distance: 290, height: 22 },
  { id: 'LB-102', name: 'Loge Box 102', level: 'lower', compass: 113, span: 4, covered: false, distance: 280, height: 22 },
  { id: 'LB-103', name: 'Loge Box 103', level: 'lower', compass: 117, span: 4, covered: false, distance: 270, height: 22 },
  { id: 'LB-104', name: 'Loge Box 104', level: 'lower', compass: 121, span: 4, covered: false, distance: 260, height: 22 },
  { id: 'LB-105', name: 'Loge Box 105', level: 'lower', compass: 125, span: 4, covered: false, distance: 250, height: 22 },
  { id: 'LB-106', name: 'Loge Box 106', level: 'lower', compass: 129, span: 4, covered: false, distance: 240, height: 22 },
  { id: 'LB-107', name: 'Loge Box 107', level: 'lower', compass: 133, span: 4, covered: false, distance: 230, height: 22 },
  { id: 'LB-108', name: 'Loge Box 108', level: 'lower', compass: 137, span: 4, covered: false, distance: 220, height: 22 },
  { id: 'LB-109', name: 'Loge Box 109', level: 'lower', compass: 141, span: 4, covered: false, distance: 210, height: 22 },
  { id: 'LB-110', name: 'Loge Box 110', level: 'lower', compass: 145, span: 4, covered: false, distance: 200, height: 22 },
  { id: 'LB-111', name: 'Loge Box 111', level: 'lower', compass: 149, span: 4, covered: false, distance: 192, height: 22 },
  { id: 'LB-112', name: 'Loge Box 112', level: 'lower', compass: 153, span: 4, covered: false, distance: 184, height: 22 },
  { id: 'LB-113', name: 'Loge Box 113', level: 'lower', compass: 157, span: 4, covered: false, distance: 176, height: 22 },
  { id: 'LB-114', name: 'Loge Box 114', level: 'lower', compass: 161, span: 4, covered: false, distance: 168, height: 22 },
  { id: 'LB-115', name: 'Loge Box 115', level: 'lower', compass: 165, span: 4, covered: false, distance: 160, height: 22 },
  { id: 'LB-116', name: 'Loge Box 116', level: 'lower', compass: 169, span: 4, covered: false, distance: 152, height: 22 },
  { id: 'LB-117', name: 'Loge Box 117', level: 'lower', compass: 173, span: 4, covered: false, distance: 145, height: 22 },
  { id: 'LB-118', name: 'Loge Box 118', level: 'lower', compass: 177, span: 4, covered: false, distance: 138, height: 22 },
  { id: 'LB-119', name: 'Loge Box 119', level: 'lower', compass: 181, span: 4, covered: false, distance: 132, height: 22 },
  { id: 'LB-120', name: 'Loge Box 120', level: 'lower', compass: 185, span: 4, covered: false, distance: 128, height: 22 },
  { id: 'LB-121', name: 'Loge Box 121', level: 'lower', compass: 189, span: 4, covered: false, distance: 122, height: 22 },
  { id: 'LB-122', name: 'Loge Box 122', level: 'lower', compass: 193, span: 4, covered: false, distance: 118, height: 22 },
  { id: 'LB-123', name: 'Loge Box 123', level: 'lower', compass: 197, span: 4, covered: true,  distance: 115, height: 22 },
  { id: 'LB-124', name: 'Loge Box 124', level: 'lower', compass: 201, span: 4, covered: true,  distance: 112, height: 22 },
  { id: 'LB-125', name: 'Loge Box 125', level: 'lower', compass: 205, span: 4, covered: true,  distance: 110, height: 22 },
  { id: 'LB-126', name: 'Loge Box 126', level: 'lower', compass: 209, span: 4, covered: true,  distance: 108, height: 22 },
  { id: 'LB-127', name: 'Loge Box 127', level: 'lower', compass: 213, span: 4, covered: true,  distance: 106, height: 22 },
  { id: 'LB-128', name: 'Loge Box 128', level: 'lower', compass: 217, span: 4, covered: true,  distance: 105, height: 22 },
  { id: 'LB-129', name: 'Loge Box 129', level: 'lower', compass: 221, span: 4, covered: true,  distance: 104, height: 22 },
  { id: 'LB-130', name: 'Loge Box 130', level: 'lower', compass: 225, span: 4, covered: true,  distance: 103, height: 22 },
  { id: 'LB-131', name: 'Loge Box 131', level: 'lower', compass: 229, span: 4, covered: true,  distance: 102, height: 22 },
  { id: 'LB-132', name: 'Loge Box 132', level: 'lower', compass: 233, span: 4, covered: true,  distance: 102, height: 22 },
  { id: 'LB-133', name: 'Loge Box 133', level: 'lower', compass: 237, span: 4, covered: true,  distance: 103, height: 22 },
  { id: 'LB-134', name: 'Loge Box 134', level: 'lower', compass: 241, span: 4, covered: true,  distance: 104, height: 22 },
  { id: 'LB-135', name: 'Loge Box 135', level: 'lower', compass: 245, span: 4, covered: true,  distance: 105, height: 22 },
  { id: 'LB-136', name: 'Loge Box 136', level: 'lower', compass: 249, span: 4, covered: true,  distance: 107, height: 22 },
  { id: 'LB-137', name: 'Loge Box 137', level: 'lower', compass: 253, span: 4, covered: false, distance: 110, height: 22 },
  { id: 'LB-138', name: 'Loge Box 138', level: 'lower', compass: 257, span: 4, covered: false, distance: 114, height: 22 },
  { id: 'LB-139', name: 'Loge Box 139', level: 'lower', compass: 261, span: 4, covered: false, distance: 118, height: 22 },
  { id: 'LB-140', name: 'Loge Box 140', level: 'lower', compass: 265, span: 4, covered: false, distance: 122, height: 22 },
  { id: 'LB-141', name: 'Loge Box 141', level: 'lower', compass: 269, span: 4, covered: false, distance: 128, height: 22 },
  { id: 'LB-142', name: 'Loge Box 142', level: 'lower', compass: 273, span: 4, covered: false, distance: 134, height: 22 },
  { id: 'LB-143', name: 'Loge Box 143', level: 'lower', compass: 277, span: 4, covered: false, distance: 140, height: 22 },
  { id: 'LB-144', name: 'Loge Box 144', level: 'lower', compass: 281, span: 4, covered: false, distance: 148, height: 22 },
  { id: 'LB-145', name: 'Loge Box 145', level: 'lower', compass: 285, span: 4, covered: false, distance: 155, height: 22 },
  { id: 'LB-146', name: 'Loge Box 146', level: 'lower', compass: 289, span: 4, covered: false, distance: 162, height: 22 },
  { id: 'LB-147', name: 'Loge Box 147', level: 'lower', compass: 293, span: 4, covered: false, distance: 170, height: 22 },
  { id: 'LB-148', name: 'Loge Box 148', level: 'lower', compass: 297, span: 4, covered: false, distance: 180, height: 22 },
  { id: 'LB-149', name: 'Loge Box 149', level: 'lower', compass: 301, span: 4, covered: false, distance: 190, height: 22 },
  { id: 'LB-150', name: 'Loge Box 150', level: 'lower', compass: 305, span: 4, covered: false, distance: 200, height: 22 },
  { id: 'LB-151', name: 'Loge Box 151', level: 'lower', compass: 309, span: 4, covered: false, distance: 210, height: 22 },
  { id: 'LB-152', name: 'Loge Box 152', level: 'lower', compass: 313, span: 4, covered: false, distance: 220, height: 22 },
  { id: 'LB-153', name: 'Loge Box 153', level: 'lower', compass: 317, span: 4, covered: false, distance: 230, height: 22 },
  { id: 'LB-154', name: 'Loge Box 154', level: 'lower', compass: 321, span: 4, covered: false, distance: 240, height: 22 },
  { id: 'LB-155', name: 'Loge Box 155', level: 'lower', compass: 325, span: 4, covered: false, distance: 250, height: 22 },
  // LB-156 intentionally skipped — not a published section.
  { id: 'LB-157', name: 'Loge Box 157', level: 'lower', compass: 333, span: 4, covered: false, distance: 270, height: 22 },
  { id: 'LB-158', name: 'Loge Box 158', level: 'lower', compass: 337, span: 4, covered: false, distance: 280, height: 22 },
  { id: 'LB-159', name: 'Loge Box 159', level: 'lower', compass: 341, span: 4, covered: false, distance: 290, height: 22 },
  { id: 'LB-160', name: 'Loge Box 160', level: 'lower', compass: 345, span: 4, covered: false, distance: 300, height: 22 },
  { id: 'LB-161', name: 'Loge Box 161', level: 'lower', compass: 349, span: 4, covered: false, distance: 305, height: 22 },
  { id: 'LB-162', name: 'Loge Box 162', level: 'lower', compass: 353, span: 4, covered: false, distance: 310, height: 22 },
  { id: 'LB-163', name: 'Loge Box 163', level: 'lower', compass: 357, span: 4, covered: false, distance: 315, height: 22 },
  { id: 'LB-164', name: 'Loge Box 164', level: 'lower', compass: 1,   span: 4, covered: false, distance: 320, height: 22 },
  { id: 'LB-165', name: 'Loge Box 165', level: 'lower', compass: 5,   span: 4, covered: false, distance: 325, height: 22 },

  // Grandstand (GS-1 through GS-33): iconic wooden seats. GS-33 only one uncovered.
  { id: 'GS-1',  name: 'Grandstand 1',  level: 'lower', compass: 97,  span: 9, covered: true,  distance: 360, height: 45 },
  { id: 'GS-2',  name: 'Grandstand 2',  level: 'lower', compass: 105, span: 9, covered: true,  distance: 340, height: 45 },
  { id: 'GS-3',  name: 'Grandstand 3',  level: 'lower', compass: 114, span: 9, covered: true,  distance: 320, height: 45 },
  { id: 'GS-4',  name: 'Grandstand 4',  level: 'lower', compass: 122, span: 9, covered: true,  distance: 300, height: 45 },
  { id: 'GS-5',  name: 'Grandstand 5',  level: 'lower', compass: 131, span: 9, covered: true,  distance: 280, height: 45 },
  { id: 'GS-6',  name: 'Grandstand 6',  level: 'lower', compass: 139, span: 9, covered: true,  distance: 260, height: 45 },
  { id: 'GS-7',  name: 'Grandstand 7',  level: 'lower', compass: 148, span: 9, covered: true,  distance: 240, height: 45 },
  { id: 'GS-8',  name: 'Grandstand 8',  level: 'lower', compass: 156, span: 9, covered: true,  distance: 220, height: 45 },
  { id: 'GS-9',  name: 'Grandstand 9',  level: 'lower', compass: 164, span: 9, covered: true,  distance: 200, height: 45 },
  { id: 'GS-10', name: 'Grandstand 10', level: 'lower', compass: 173, span: 9, covered: true,  distance: 185, height: 45 },
  { id: 'GS-11', name: 'Grandstand 11', level: 'lower', compass: 181, span: 9, covered: true,  distance: 170, height: 45 },
  { id: 'GS-12', name: 'Grandstand 12', level: 'lower', compass: 190, span: 9, covered: true,  distance: 158, height: 45 },
  { id: 'GS-13', name: 'Grandstand 13', level: 'lower', compass: 198, span: 9, covered: true,  distance: 150, height: 45 },
  { id: 'GS-14', name: 'Grandstand 14', level: 'lower', compass: 206, span: 9, covered: true,  distance: 145, height: 45 },
  { id: 'GS-15', name: 'Grandstand 15', level: 'lower', compass: 215, span: 9, covered: true,  distance: 138, height: 45 },
  { id: 'GS-16', name: 'Grandstand 16', level: 'lower', compass: 223, span: 9, covered: true,  distance: 132, height: 45 },
  { id: 'GS-17', name: 'Grandstand 17', level: 'lower', compass: 232, span: 9, covered: true,  distance: 130, height: 45 },
  { id: 'GS-18', name: 'Grandstand 18', level: 'lower', compass: 240, span: 9, covered: true,  distance: 132, height: 45 },
  { id: 'GS-19', name: 'Grandstand 19', level: 'lower', compass: 249, span: 9, covered: true,  distance: 138, height: 45 },
  { id: 'GS-20', name: 'Grandstand 20', level: 'lower', compass: 257, span: 9, covered: true,  distance: 145, height: 45 },
  { id: 'GS-21', name: 'Grandstand 21', level: 'lower', compass: 265, span: 9, covered: true,  distance: 155, height: 45 },
  { id: 'GS-22', name: 'Grandstand 22', level: 'lower', compass: 274, span: 9, covered: true,  distance: 165, height: 45 },
  { id: 'GS-23', name: 'Grandstand 23', level: 'lower', compass: 282, span: 9, covered: true,  distance: 178, height: 45 },
  { id: 'GS-24', name: 'Grandstand 24', level: 'lower', compass: 291, span: 9, covered: true,  distance: 192, height: 45 },
  { id: 'GS-25', name: 'Grandstand 25', level: 'lower', compass: 299, span: 9, covered: true,  distance: 208, height: 45 },
  { id: 'GS-26', name: 'Grandstand 26', level: 'lower', compass: 307, span: 9, covered: true,  distance: 225, height: 45 },
  { id: 'GS-27', name: 'Grandstand 27', level: 'lower', compass: 316, span: 9, covered: true,  distance: 245, height: 45 },
  { id: 'GS-28', name: 'Grandstand 28', level: 'lower', compass: 324, span: 9, covered: true,  distance: 265, height: 45 },
  { id: 'GS-29', name: 'Grandstand 29', level: 'lower', compass: 333, span: 9, covered: true,  distance: 285, height: 45 },
  { id: 'GS-30', name: 'Grandstand 30', level: 'lower', compass: 341, span: 9, covered: true,  distance: 305, height: 45 },
  { id: 'GS-31', name: 'Grandstand 31', level: 'lower', compass: 350, span: 9, covered: true,  distance: 320, height: 45 },
  { id: 'GS-32', name: 'Grandstand 32', level: 'lower', compass: 358, span: 9, covered: true,  distance: 340, height: 45 },
  { id: 'GS-33', name: 'Grandstand 33', level: 'lower', compass: 6,   span: 9, covered: false, distance: 360, height: 45 }, // sole uncovered GS

  // Bleachers (BL-34 through BL-43): deep CF/RCF, all uncovered
  { id: 'BL-34', name: 'Bleachers 34', level: 'lower', compass: 70, span: 5, covered: false, distance: 380, height: 20 },
  { id: 'BL-35', name: 'Bleachers 35', level: 'lower', compass: 64, span: 5, covered: false, distance: 395, height: 20 }, // batter's-eye tarp during day games
  { id: 'BL-36', name: 'Bleachers 36', level: 'lower', compass: 58, span: 5, covered: false, distance: 410, height: 20 },
  { id: 'BL-37', name: 'Bleachers 37', level: 'lower', compass: 53, span: 5, covered: false, distance: 420, height: 20 },
  { id: 'BL-38', name: 'Bleachers 38', level: 'lower', compass: 47, span: 5, covered: false, distance: 420, height: 20 },
  { id: 'BL-39', name: 'Bleachers 39', level: 'lower', compass: 42, span: 5, covered: false, distance: 410, height: 20 },
  { id: 'BL-40', name: 'Bleachers 40', level: 'lower', compass: 37, span: 5, covered: false, distance: 400, height: 20 },
  { id: 'BL-41', name: 'Bleachers 41', level: 'lower', compass: 32, span: 5, covered: false, distance: 390, height: 20 },
  { id: 'BL-42', name: 'Bleachers 42', level: 'lower', compass: 28, span: 5, covered: false, distance: 380, height: 20 },
  { id: 'BL-43', name: 'Bleachers 43', level: 'lower', compass: 23, span: 5, covered: false, distance: 370, height: 20 },

  // Monster Seats (M-1 through M-10): atop the Green Monster, 37 ft height
  { id: 'M-1',  name: 'Monster Seats 1',  level: 'upper', compass: 7,  span: 2, covered: false, distance: 310, height: 37 },
  { id: 'M-2',  name: 'Monster Seats 2',  level: 'upper', compass: 9,  span: 2, covered: false, distance: 315, height: 37 },
  { id: 'M-3',  name: 'Monster Seats 3',  level: 'upper', compass: 11, span: 2, covered: false, distance: 322, height: 37 },
  { id: 'M-4',  name: 'Monster Seats 4',  level: 'upper', compass: 13, span: 2, covered: false, distance: 330, height: 37 },
  { id: 'M-5',  name: 'Monster Seats 5',  level: 'upper', compass: 15, span: 2, covered: false, distance: 340, height: 37 },
  { id: 'M-6',  name: 'Monster Seats 6',  level: 'upper', compass: 17, span: 2, covered: false, distance: 350, height: 37 },
  { id: 'M-7',  name: 'Monster Seats 7',  level: 'upper', compass: 19, span: 2, covered: false, distance: 360, height: 37 },
  { id: 'M-8',  name: 'Monster Seats 8',  level: 'upper', compass: 21, span: 2, covered: false, distance: 370, height: 37 },
  { id: 'M-9',  name: 'Monster Seats 9',  level: 'upper', compass: 24, span: 2, covered: false, distance: 380, height: 37 },
  { id: 'M-10', name: 'Monster Seats 10', level: 'upper', compass: 27, span: 2, covered: false, distance: 390, height: 37 },

  // Right Field Box (RB-87 through RB-97): deep RF beyond Pesky's Pole, no overhang
  { id: 'RB-87', name: 'Right Field Box 87', level: 'lower', compass: 95, span: 4, covered: false, distance: 325, height: 12 },
  { id: 'RB-88', name: 'Right Field Box 88', level: 'lower', compass: 91, span: 4, covered: false, distance: 335, height: 12 },
  { id: 'RB-89', name: 'Right Field Box 89', level: 'lower', compass: 87, span: 4, covered: false, distance: 345, height: 12 },
  { id: 'RB-90', name: 'Right Field Box 90', level: 'lower', compass: 84, span: 4, covered: false, distance: 355, height: 12 },
  { id: 'RB-91', name: 'Right Field Box 91', level: 'lower', compass: 81, span: 4, covered: false, distance: 365, height: 12 },
  { id: 'RB-92', name: 'Right Field Box 92', level: 'lower', compass: 77, span: 4, covered: false, distance: 375, height: 12 },
  { id: 'RB-93', name: 'Right Field Box 93', level: 'lower', compass: 74, span: 4, covered: false, distance: 380, height: 12 },
  { id: 'RB-94', name: 'Right Field Box 94', level: 'lower', compass: 71, span: 4, covered: false, distance: 385, height: 12 },
  { id: 'RB-95', name: 'Right Field Box 95', level: 'lower', compass: 68, span: 4, covered: false, distance: 390, height: 12 },
  { id: 'RB-96', name: 'Right Field Box 96', level: 'lower', compass: 65, span: 4, covered: false, distance: 395, height: 12 },
  { id: 'RB-97', name: 'Right Field Box 97', level: 'lower', compass: 62, span: 4, covered: false, distance: 400, height: 12 },

  // Right Field Roof Box (RR-23 odd through RR-43): atop the RF grandstand roof, open above
  { id: 'RR-23', name: 'Right Field Roof Box 23', level: 'upper', compass: 100, span: 3, covered: false, distance: 280, height: 65 },
  { id: 'RR-25', name: 'Right Field Roof Box 25', level: 'upper', compass: 97,  span: 3, covered: false, distance: 285, height: 65 },
  { id: 'RR-27', name: 'Right Field Roof Box 27', level: 'upper', compass: 93,  span: 3, covered: false, distance: 290, height: 65 },
  { id: 'RR-29', name: 'Right Field Roof Box 29', level: 'upper', compass: 89,  span: 3, covered: false, distance: 295, height: 65 },
  { id: 'RR-31', name: 'Right Field Roof Box 31', level: 'upper', compass: 86,  span: 3, covered: false, distance: 300, height: 65 },
  { id: 'RR-33', name: 'Right Field Roof Box 33', level: 'upper', compass: 83,  span: 3, covered: false, distance: 308, height: 65 },
  { id: 'RR-35', name: 'Right Field Roof Box 35', level: 'upper', compass: 80,  span: 3, covered: false, distance: 316, height: 65 },
  { id: 'RR-37', name: 'Right Field Roof Box 37', level: 'upper', compass: 77,  span: 3, covered: false, distance: 324, height: 65 },
  { id: 'RR-39', name: 'Right Field Roof Box 39', level: 'upper', compass: 74,  span: 3, covered: false, distance: 332, height: 65 },
  { id: 'RR-41', name: 'Right Field Roof Box 41', level: 'upper', compass: 70,  span: 3, covered: false, distance: 340, height: 65 },
  { id: 'RR-43', name: 'Right Field Roof Box 43', level: 'upper', compass: 66,  span: 3, covered: false, distance: 348, height: 65 },

  // EMC Club / Dell Technologies Club (EMCC-1 through EMCC-6): indoor premium behind HP
  { id: 'EMCC-1', name: 'EMC Club 1 (Dell Technologies Club)', level: 'club', compass: 220, span: 5, covered: true, distance: 145, height: 55 },
  { id: 'EMCC-2', name: 'EMC Club 2 (Dell Technologies Club)', level: 'club', compass: 225, span: 5, covered: true, distance: 140, height: 55 },
  { id: 'EMCC-3', name: 'EMC Club 3 (Dell Technologies Club)', level: 'club', compass: 230, span: 5, covered: true, distance: 138, height: 55 },
  { id: 'EMCC-4', name: 'EMC Club 4 (Dell Technologies Club)', level: 'club', compass: 234, span: 5, covered: true, distance: 138, height: 55 },
  { id: 'EMCC-5', name: 'EMC Club 5 (Dell Technologies Club)', level: 'club', compass: 239, span: 5, covered: true, distance: 140, height: 55 },
  { id: 'EMCC-6', name: 'EMC Club 6 (Dell Technologies Club)', level: 'club', compass: 244, span: 5, covered: true, distance: 145, height: 55 },

  // Home Plate Pavilion Club (HPPC-1 through HPPC-5): covered premium directly behind HP
  { id: 'HPPC-1', name: 'Home Plate Pavilion Club 1', level: 'club', compass: 224, span: 4, covered: true, distance: 165, height: 60 },
  { id: 'HPPC-2', name: 'Home Plate Pavilion Club 2', level: 'club', compass: 228, span: 4, covered: true, distance: 160, height: 60 },
  { id: 'HPPC-3', name: 'Home Plate Pavilion Club 3', level: 'club', compass: 232, span: 4, covered: true, distance: 158, height: 60 },
  { id: 'HPPC-4', name: 'Home Plate Pavilion Club 4', level: 'club', compass: 236, span: 4, covered: true, distance: 160, height: 60 },
  { id: 'HPPC-5', name: 'Home Plate Pavilion Club 5', level: 'club', compass: 240, span: 4, covered: true, distance: 165, height: 60 },

  // State Street Pavilion Club (SSPC-1 through SSPC-14): outdoor club above HPPC
  { id: 'SSPC-1',  name: 'State Street Pavilion Club 1',  level: 'club', compass: 195, span: 4, covered: false, distance: 195, height: 65 },
  { id: 'SSPC-2',  name: 'State Street Pavilion Club 2',  level: 'club', compass: 200, span: 4, covered: false, distance: 188, height: 65 },
  { id: 'SSPC-3',  name: 'State Street Pavilion Club 3',  level: 'club', compass: 205, span: 4, covered: false, distance: 180, height: 65 },
  { id: 'SSPC-4',  name: 'State Street Pavilion Club 4',  level: 'club', compass: 210, span: 4, covered: false, distance: 175, height: 65 },
  { id: 'SSPC-5',  name: 'State Street Pavilion Club 5',  level: 'club', compass: 215, span: 4, covered: false, distance: 170, height: 65 },
  { id: 'SSPC-6',  name: 'State Street Pavilion Club 6',  level: 'club', compass: 220, span: 4, covered: false, distance: 168, height: 65 },
  { id: 'SSPC-7',  name: 'State Street Pavilion Club 7',  level: 'club', compass: 224, span: 4, covered: false, distance: 165, height: 65 },
  { id: 'SSPC-8',  name: 'State Street Pavilion Club 8',  level: 'club', compass: 240, span: 4, covered: false, distance: 165, height: 65 },
  { id: 'SSPC-9',  name: 'State Street Pavilion Club 9',  level: 'club', compass: 245, span: 4, covered: false, distance: 168, height: 65 },
  { id: 'SSPC-10', name: 'State Street Pavilion Club 10', level: 'club', compass: 250, span: 4, covered: false, distance: 170, height: 65 },
  { id: 'SSPC-11', name: 'State Street Pavilion Club 11', level: 'club', compass: 255, span: 4, covered: false, distance: 175, height: 65 },
  { id: 'SSPC-12', name: 'State Street Pavilion Club 12', level: 'club', compass: 260, span: 4, covered: false, distance: 180, height: 65 },
  { id: 'SSPC-13', name: 'State Street Pavilion Club 13', level: 'club', compass: 265, span: 4, covered: false, distance: 188, height: 65 },
  { id: 'SSPC-14', name: 'State Street Pavilion Club 14', level: 'club', compass: 270, span: 4, covered: false, distance: 195, height: 65 },

  // Pavilion Box (PB-1 through PB-14): covered premium suite-level
  { id: 'PB-1',  name: 'Pavilion Box 1',  level: 'suite', compass: 200, span: 4, covered: true, distance: 215, height: 80 },
  { id: 'PB-2',  name: 'Pavilion Box 2',  level: 'suite', compass: 205, span: 4, covered: true, distance: 208, height: 80 },
  { id: 'PB-3',  name: 'Pavilion Box 3',  level: 'suite', compass: 210, span: 4, covered: true, distance: 200, height: 80 },
  { id: 'PB-4',  name: 'Pavilion Box 4',  level: 'suite', compass: 215, span: 4, covered: true, distance: 195, height: 80 },
  { id: 'PB-5',  name: 'Pavilion Box 5',  level: 'suite', compass: 220, span: 4, covered: true, distance: 190, height: 80 },
  { id: 'PB-6',  name: 'Pavilion Box 6',  level: 'suite', compass: 225, span: 4, covered: true, distance: 188, height: 80 },
  { id: 'PB-7',  name: 'Pavilion Box 7',  level: 'suite', compass: 230, span: 4, covered: true, distance: 187, height: 80 },
  { id: 'PB-8',  name: 'Pavilion Box 8',  level: 'suite', compass: 234, span: 4, covered: true, distance: 187, height: 80 },
  { id: 'PB-9',  name: 'Pavilion Box 9',  level: 'suite', compass: 238, span: 4, covered: true, distance: 188, height: 80 },
  { id: 'PB-10', name: 'Pavilion Box 10', level: 'suite', compass: 242, span: 4, covered: true, distance: 190, height: 80 },
  { id: 'PB-11', name: 'Pavilion Box 11', level: 'suite', compass: 247, span: 4, covered: true, distance: 195, height: 80 },
  { id: 'PB-12', name: 'Pavilion Box 12', level: 'suite', compass: 252, span: 4, covered: true, distance: 200, height: 80 },
  { id: 'PB-13', name: 'Pavilion Box 13', level: 'suite', compass: 257, span: 4, covered: true, distance: 208, height: 80 },
  { id: 'PB-14', name: 'Pavilion Box 14', level: 'suite', compass: 262, span: 4, covered: true, distance: 215, height: 80 },

  // Pavilion Reserved (PR-15, PR-16, PR-18, PR-20): outer extensions, uncovered
  { id: 'PR-15', name: 'Pavilion Reserved 15', level: 'upper', compass: 185, span: 6, covered: false, distance: 230, height: 72 },
  { id: 'PR-16', name: 'Pavilion Reserved 16', level: 'upper', compass: 191, span: 6, covered: false, distance: 225, height: 72 },
  { id: 'PR-18', name: 'Pavilion Reserved 18', level: 'upper', compass: 273, span: 6, covered: false, distance: 225, height: 72 },
  { id: 'PR-20', name: 'Pavilion Reserved 20', level: 'upper', compass: 280, span: 6, covered: false, distance: 230, height: 72 },

  // Royal Rooters Club: indoor lounge behind HP at street/concourse level
  { id: 'ROYAL-ROOTERS', name: 'Royal Rooters Club', level: 'club', compass: 232, span: 18, covered: true, distance: 60, height: 0 },

  // Standing-room and specialty areas
  { id: 'HORNITOS-CANTINA',     name: 'Hornitos Cantina',             level: 'standing', compass: 110, span: 10, covered: false, distance: 280, height: 28 },
  { id: 'COCA-COLA-SRO',        name: 'Coca-Cola Corner SRO',         level: 'standing', compass: 105, span: 8,  covered: false, distance: 275, height: 28 },
  { id: 'GREEN-MONSTER-SRO',    name: 'Green Monster SRO',            level: 'standing', compass: 16,  span: 14, covered: false, distance: 350, height: 37 },
  { id: 'ROOF-BOX-SRO',         name: 'Right Field Roof Box SRO',     level: 'standing', compass: 82,  span: 10, covered: false, distance: 310, height: 65 },
  { id: 'ROOF-DECK-SRO',        name: 'Right Field Roof Deck SRO',    level: 'standing', compass: 80,  span: 12, covered: false, distance: 305, height: 65 },
  { id: 'ROOF-DECK-TABLES',     name: 'Roof Deck Tables',             level: 'standing', compass: 78,  span: 8,  covered: false, distance: 310, height: 65 },
  { id: 'FIRST-BASE-PAV-SRO',   name: 'First Base Pavilion SRO',      level: 'standing', compass: 192, span: 10, covered: true,  distance: 175, height: 65 },
  { id: 'THIRD-BASE-PAV-SRO',   name: 'Third Base Pavilion SRO',      level: 'standing', compass: 272, span: 10, covered: true,  distance: 175, height: 65 },
  { id: 'SRO',                  name: 'Standing Room Only (general)', level: 'standing', compass: 232, span: 30, covered: true,  distance: 200, height: 50 },
];

export const redsoxSections: DetailedSection[] = SECTIONS.map((s) => {
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

export const redsoxSectionMap = new Map(redsoxSections.map((s) => [s.id, s]));

import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Citizens Bank Park - Philadelphia Phillies
// Opened: 2004
// Capacity: 42,792
// Orientation: 59° (Home plate to center field)
// Famous features: Ashburn Alley, Liberty Bell, Phanatic Phun Zone

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.3), // Slight reduction in upper rows
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: false
    });
  }
  
  return rows;
};

// Helper for calculating vertices using polar coordinates
const calcVertices = (angle: number, angleSpan: number, frontDist: number, backDist: number, frontElev: number, backElev: number): Vector3D[] => {
  const deg2rad = Math.PI / 180;
  return [
    { x: frontDist * Math.cos(angle * deg2rad), y: frontDist * Math.sin(angle * deg2rad), z: frontElev },
    { x: frontDist * Math.cos((angle + angleSpan) * deg2rad), y: frontDist * Math.sin((angle + angleSpan) * deg2rad), z: frontElev },
    { x: backDist * Math.cos((angle + angleSpan) * deg2rad), y: backDist * Math.sin((angle + angleSpan) * deg2rad), z: backElev },
    { x: backDist * Math.cos(angle * deg2rad), y: backDist * Math.sin(angle * deg2rad), z: backElev }
  ];
};

export const citizensBankParkSections: DetailedSection[] = [
  // ========== DIAMOND CLUB (Sections A-G) - Behind Home Plate ==========
  {
    id: 'section-A',
    name: 'Diamond Club A',
    level: 'field',
    baseAngle: 352,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(352, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 48,
    height: 2,
    rake: 8
  },
  {
    id: 'section-B',
    name: 'Diamond Club B',
    level: 'field',
    baseAngle: 356,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(356, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 48,
    height: 2,
    rake: 8
  },
  {
    id: 'section-C',
    name: 'Diamond Club C',
    level: 'field',
    baseAngle: 0,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(0, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 47,
    height: 2,
    rake: 8
  },
  {
    id: 'section-D',
    name: 'Diamond Club D',
    level: 'field',
    baseAngle: 4,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(4, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 48,
    height: 2,
    rake: 8
  },
  {
    id: 'section-E',
    name: 'Diamond Club E',
    level: 'field',
    baseAngle: 8,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(8, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 48,
    height: 2,
    rake: 8
  },
  {
    id: 'section-F',
    name: 'Diamond Club F',
    level: 'field',
    baseAngle: 12,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(12, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 49,
    height: 2,
    rake: 8
  },
  {
    id: 'section-G',
    name: 'Diamond Club G',
    level: 'field',
    baseAngle: 16,
    angleSpan: 4,
    rows: generateRows('A', 'G', 18, 2, 2.5, 8),
    vertices3D: calcVertices(16, 4, 45, 60, 2, 5) as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 8
  },

  // ========== FIELD LEVEL (Sections 108-148) - Infield Sections ==========
  // First Base Side (108-117)
  {
    id: 'section-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 20,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(20, 6, 50, 70, 2, 7) as Vector3D[],
    covered: false,
    distance: 52,
    height: 2,
    rake: 10
  },
  {
    id: 'section-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 26,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(26, 6, 52, 72, 2, 7) as Vector3D[],
    covered: false,
    distance: 54,
    height: 2,
    rake: 10
  },
  {
    id: 'section-110',
    name: 'Field Box 110',
    level: 'field',
    baseAngle: 32,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(32, 6, 54, 74, 2, 7) as Vector3D[],
    covered: false,
    distance: 56,
    height: 2,
    rake: 10
  },
  {
    id: 'section-111',
    name: 'Field Box 111',
    level: 'field',
    baseAngle: 38,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(38, 6, 56, 76, 2, 7) as Vector3D[],
    covered: false,
    distance: 58,
    height: 2,
    rake: 10
  },
  {
    id: 'section-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 44,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(44, 6, 58, 78, 2, 7) as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 10
  },
  {
    id: 'section-113',
    name: 'Field Box 113',
    level: 'field',
    baseAngle: 50,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(50, 6, 60, 80, 2, 7) as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 10
  },
  {
    id: 'section-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 56,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(56, 6, 62, 84, 2, 8) as Vector3D[],
    covered: false,
    distance: 65,
    height: 2,
    rake: 10
  },
  {
    id: 'section-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 62,
    angleSpan: 6,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(62, 6, 66, 88, 2, 8) as Vector3D[],
    covered: false,
    distance: 68,
    height: 2,
    rake: 10
  },
  {
    id: 'section-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 68,
    angleSpan: 6,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(68, 6, 70, 92, 2, 8) as Vector3D[],
    covered: false,
    distance: 72,
    height: 2,
    rake: 10
  },
  {
    id: 'section-117',
    name: 'Field Box 117',
    level: 'field',
    baseAngle: 74,
    angleSpan: 6,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(74, 6, 74, 96, 2, 8) as Vector3D[],
    covered: false,
    distance: 76,
    height: 2,
    rake: 10
  },

  // Third Base Side (130-139)
  {
    id: 'section-130',
    name: 'Field Box 130',
    level: 'field',
    baseAngle: 340,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(340, 6, 50, 70, 2, 7) as Vector3D[],
    covered: false,
    distance: 52,
    height: 2,
    rake: 10
  },
  {
    id: 'section-131',
    name: 'Field Box 131',
    level: 'field',
    baseAngle: 334,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(334, 6, 52, 72, 2, 7) as Vector3D[],
    covered: false,
    distance: 54,
    height: 2,
    rake: 10
  },
  {
    id: 'section-132',
    name: 'Field Box 132',
    level: 'field',
    baseAngle: 328,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(328, 6, 54, 74, 2, 7) as Vector3D[],
    covered: false,
    distance: 56,
    height: 2,
    rake: 10
  },
  {
    id: 'section-133',
    name: 'Field Box 133',
    level: 'field',
    baseAngle: 322,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(322, 6, 56, 76, 2, 7) as Vector3D[],
    covered: false,
    distance: 58,
    height: 2,
    rake: 10
  },
  {
    id: 'section-134',
    name: 'Field Box 134',
    level: 'field',
    baseAngle: 316,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(316, 6, 58, 78, 2, 7) as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 10
  },
  {
    id: 'section-135',
    name: 'Field Box 135',
    level: 'field',
    baseAngle: 310,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(310, 6, 60, 80, 2, 7) as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 10
  },
  {
    id: 'section-136',
    name: 'Field Box 136',
    level: 'field',
    baseAngle: 304,
    angleSpan: 6,
    rows: generateRows('A', 'R', 18, 2, 2.5, 10),
    vertices3D: calcVertices(304, 6, 62, 84, 2, 8) as Vector3D[],
    covered: false,
    distance: 65,
    height: 2,
    rake: 10
  },
  {
    id: 'section-137',
    name: 'Field Box 137',
    level: 'field',
    baseAngle: 298,
    angleSpan: 6,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(298, 6, 66, 88, 2, 8) as Vector3D[],
    covered: false,
    distance: 68,
    height: 2,
    rake: 10
  },
  {
    id: 'section-138',
    name: 'Field Box 138',
    level: 'field',
    baseAngle: 292,
    angleSpan: 6,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(292, 6, 70, 92, 2, 8) as Vector3D[],
    covered: false,
    distance: 72,
    height: 2,
    rake: 10
  },
  {
    id: 'section-139',
    name: 'Field Box 139',
    level: 'field',
    baseAngle: 286,
    angleSpan: 6,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(286, 6, 74, 96, 2, 8) as Vector3D[],
    covered: false,
    distance: 76,
    height: 2,
    rake: 10
  },

  // Outfield Field Level (118-129, 140-148)
  {
    id: 'section-118',
    name: 'Field Box 118',
    level: 'field',
    baseAngle: 80,
    angleSpan: 7,
    rows: generateRows('A', 'M', 20, 2, 2.5, 12),
    vertices3D: calcVertices(80, 7, 80, 105, 2, 9) as Vector3D[],
    covered: false,
    distance: 85,
    height: 2,
    rake: 12
  },
  {
    id: 'section-119',
    name: 'Field Box 119',
    level: 'field',
    baseAngle: 87,
    angleSpan: 7,
    rows: generateRows('A', 'M', 20, 2, 2.5, 12),
    vertices3D: calcVertices(87, 7, 85, 110, 2, 9) as Vector3D[],
    covered: false,
    distance: 90,
    height: 2,
    rake: 12
  },
  {
    id: 'section-140',
    name: 'Field Box 140',
    level: 'field',
    baseAngle: 280,
    angleSpan: 7,
    rows: generateRows('A', 'M', 20, 2, 2.5, 12),
    vertices3D: calcVertices(280, 7, 80, 105, 2, 9) as Vector3D[],
    covered: false,
    distance: 85,
    height: 2,
    rake: 12
  },
  {
    id: 'section-141',
    name: 'Field Box 141',
    level: 'field',
    baseAngle: 273,
    angleSpan: 7,
    rows: generateRows('A', 'M', 20, 2, 2.5, 12),
    vertices3D: calcVertices(273, 7, 85, 110, 2, 9) as Vector3D[],
    covered: false,
    distance: 90,
    height: 2,
    rake: 12
  },

  // ========== TERRACE LEVEL (Sections 201-236) ==========
  // First Base Side (201-215)
  {
    id: 'section-201',
    name: 'Terrace 201',
    level: 'lower',
    baseAngle: 15,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(15, 6, 75, 105, 18, 32) as Vector3D[],
    covered: false,
    distance: 80,
    height: 18,
    rake: 18
  },
  {
    id: 'section-202',
    name: 'Terrace 202',
    level: 'lower',
    baseAngle: 21,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(21, 6, 75, 105, 18, 32) as Vector3D[],
    covered: false,
    distance: 80,
    height: 18,
    rake: 18
  },
  {
    id: 'section-203',
    name: 'Terrace 203',
    level: 'lower',
    baseAngle: 27,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(27, 6, 78, 108, 18, 32) as Vector3D[],
    covered: false,
    distance: 82,
    height: 18,
    rake: 18
  },
  {
    id: 'section-204',
    name: 'Terrace 204',
    level: 'lower',
    baseAngle: 33,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(33, 6, 80, 110, 18, 32) as Vector3D[],
    covered: false,
    distance: 85,
    height: 18,
    rake: 18
  },
  {
    id: 'section-205',
    name: 'Terrace 205',
    level: 'lower',
    baseAngle: 39,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(39, 6, 82, 112, 18, 32) as Vector3D[],
    covered: false,
    distance: 87,
    height: 18,
    rake: 18
  },
  {
    id: 'section-206',
    name: 'Terrace 206',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(45, 6, 85, 115, 18, 32) as Vector3D[],
    covered: false,
    distance: 90,
    height: 18,
    rake: 18
  },
  {
    id: 'section-207',
    name: 'Terrace 207',
    level: 'lower',
    baseAngle: 51,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(51, 6, 87, 117, 18, 32) as Vector3D[],
    covered: false,
    distance: 92,
    height: 18,
    rake: 18
  },
  {
    id: 'section-208',
    name: 'Terrace 208',
    level: 'lower',
    baseAngle: 57,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(57, 6, 90, 120, 18, 32) as Vector3D[],
    covered: false,
    distance: 95,
    height: 18,
    rake: 18
  },
  {
    id: 'section-209',
    name: 'Terrace 209',
    level: 'lower',
    baseAngle: 63,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(63, 6, 92, 122, 18, 32) as Vector3D[],
    covered: false,
    distance: 97,
    height: 18,
    rake: 18
  },
  {
    id: 'section-210',
    name: 'Terrace 210',
    level: 'lower',
    baseAngle: 69,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(69, 6, 95, 125, 18, 32) as Vector3D[],
    covered: false,
    distance: 100,
    height: 18,
    rake: 18
  },

  // Third Base Side (220-236)
  {
    id: 'section-220',
    name: 'Terrace 220',
    level: 'lower',
    baseAngle: 345,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(345, 6, 75, 105, 18, 32) as Vector3D[],
    covered: false,
    distance: 80,
    height: 18,
    rake: 18
  },
  {
    id: 'section-221',
    name: 'Terrace 221',
    level: 'lower',
    baseAngle: 339,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(339, 6, 75, 105, 18, 32) as Vector3D[],
    covered: false,
    distance: 80,
    height: 18,
    rake: 18
  },
  {
    id: 'section-222',
    name: 'Terrace 222',
    level: 'lower',
    baseAngle: 333,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(333, 6, 78, 108, 18, 32) as Vector3D[],
    covered: false,
    distance: 82,
    height: 18,
    rake: 18
  },
  {
    id: 'section-223',
    name: 'Terrace 223',
    level: 'lower',
    baseAngle: 327,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(327, 6, 80, 110, 18, 32) as Vector3D[],
    covered: false,
    distance: 85,
    height: 18,
    rake: 18
  },
  {
    id: 'section-224',
    name: 'Terrace 224',
    level: 'lower',
    baseAngle: 321,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(321, 6, 82, 112, 18, 32) as Vector3D[],
    covered: false,
    distance: 87,
    height: 18,
    rake: 18
  },
  {
    id: 'section-225',
    name: 'Terrace 225',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(315, 6, 85, 115, 18, 32) as Vector3D[],
    covered: false,
    distance: 90,
    height: 18,
    rake: 18
  },
  {
    id: 'section-226',
    name: 'Terrace 226',
    level: 'lower',
    baseAngle: 309,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(309, 6, 87, 117, 18, 32) as Vector3D[],
    covered: false,
    distance: 92,
    height: 18,
    rake: 18
  },
  {
    id: 'section-227',
    name: 'Terrace 227',
    level: 'lower',
    baseAngle: 303,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(303, 6, 90, 120, 18, 32) as Vector3D[],
    covered: false,
    distance: 95,
    height: 18,
    rake: 18
  },
  {
    id: 'section-228',
    name: 'Terrace 228',
    level: 'lower',
    baseAngle: 297,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(297, 6, 92, 122, 18, 32) as Vector3D[],
    covered: false,
    distance: 97,
    height: 18,
    rake: 18
  },
  {
    id: 'section-229',
    name: 'Terrace 229',
    level: 'lower',
    baseAngle: 291,
    angleSpan: 6,
    rows: generateRows('A', 'T', 22, 18, 2.8, 18),
    vertices3D: calcVertices(291, 6, 95, 125, 18, 32) as Vector3D[],
    covered: false,
    distance: 100,
    height: 18,
    rake: 18
  },

  // ========== HALL OF FAME CLUB (Sections 212-232) - Climate Controlled ==========
  {
    id: 'section-212',
    name: 'Hall of Fame 212',
    level: 'club',
    baseAngle: 350,
    angleSpan: 5,
    rows: generateRows('A', 'M', 20, 35, 3, 22),
    vertices3D: calcVertices(350, 5, 90, 115, 35, 45) as Vector3D[],
    covered: true,
    distance: 95,
    height: 35,
    rake: 22
  },
  {
    id: 'section-213',
    name: 'Hall of Fame 213',
    level: 'club',
    baseAngle: 355,
    angleSpan: 5,
    rows: generateRows('A', 'M', 20, 35, 3, 22),
    vertices3D: calcVertices(355, 5, 90, 115, 35, 45) as Vector3D[],
    covered: true,
    distance: 95,
    height: 35,
    rake: 22
  },
  {
    id: 'section-214',
    name: 'Hall of Fame 214',
    level: 'club',
    baseAngle: 0,
    angleSpan: 5,
    rows: generateRows('A', 'M', 20, 35, 3, 22),
    vertices3D: calcVertices(0, 5, 90, 115, 35, 45) as Vector3D[],
    covered: true,
    distance: 95,
    height: 35,
    rake: 22
  },
  {
    id: 'section-215',
    name: 'Hall of Fame 215',
    level: 'club',
    baseAngle: 5,
    angleSpan: 5,
    rows: generateRows('A', 'M', 20, 35, 3, 22),
    vertices3D: calcVertices(5, 5, 90, 115, 35, 45) as Vector3D[],
    covered: true,
    distance: 95,
    height: 35,
    rake: 22
  },
  {
    id: 'section-216',
    name: 'Hall of Fame 216',
    level: 'club',
    baseAngle: 10,
    angleSpan: 5,
    rows: generateRows('A', 'M', 20, 35, 3, 22),
    vertices3D: calcVertices(10, 5, 90, 115, 35, 45) as Vector3D[],
    covered: true,
    distance: 95,
    height: 35,
    rake: 22
  },

  // ========== PAVILION (Upper Deck, Sections 301-336) ==========
  // First Base Side (301-315)
  {
    id: 'section-301',
    name: 'Pavilion 301',
    level: 'upper',
    baseAngle: 10,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(10, 7, 110, 145, 50, 72) as Vector3D[],
    covered: true,
    distance: 115,
    height: 50,
    rake: 24
  },
  {
    id: 'section-302',
    name: 'Pavilion 302',
    level: 'upper',
    baseAngle: 17,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(17, 7, 110, 145, 50, 72) as Vector3D[],
    covered: true,
    distance: 115,
    height: 50,
    rake: 24
  },
  {
    id: 'section-303',
    name: 'Pavilion 303',
    level: 'upper',
    baseAngle: 24,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(24, 7, 112, 147, 50, 72) as Vector3D[],
    covered: true,
    distance: 117,
    height: 50,
    rake: 24
  },
  {
    id: 'section-304',
    name: 'Pavilion 304',
    level: 'upper',
    baseAngle: 31,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(31, 7, 115, 150, 50, 72) as Vector3D[],
    covered: true,
    distance: 120,
    height: 50,
    rake: 24
  },
  {
    id: 'section-305',
    name: 'Pavilion 305',
    level: 'upper',
    baseAngle: 38,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(38, 7, 117, 152, 50, 72) as Vector3D[],
    covered: true,
    distance: 122,
    height: 50,
    rake: 24
  },
  {
    id: 'section-306',
    name: 'Pavilion 306',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(45, 7, 120, 155, 50, 72) as Vector3D[],
    covered: true,
    distance: 125,
    height: 50,
    rake: 24
  },
  {
    id: 'section-307',
    name: 'Pavilion 307',
    level: 'upper',
    baseAngle: 52,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(52, 7, 122, 157, 50, 72) as Vector3D[],
    covered: true,
    distance: 127,
    height: 50,
    rake: 24
  },
  {
    id: 'section-308',
    name: 'Pavilion 308',
    level: 'upper',
    baseAngle: 59,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(59, 7, 125, 160, 50, 72) as Vector3D[],
    covered: true,
    distance: 130,
    height: 50,
    rake: 24
  },
  {
    id: 'section-309',
    name: 'Pavilion 309',
    level: 'upper',
    baseAngle: 66,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(66, 7, 128, 163, 50, 72) as Vector3D[],
    covered: true,
    distance: 133,
    height: 50,
    rake: 24
  },
  {
    id: 'section-310',
    name: 'Pavilion 310',
    level: 'upper',
    baseAngle: 73,
    angleSpan: 7,
    rows: generateRows('A', 'T', 24, 50, 3.2, 24),
    vertices3D: calcVertices(73, 7, 130, 165, 50, 72) as Vector3D[],
    covered: true,
    distance: 135,
    height: 50,
    rake: 24
  },

  // Third Base Side (320-336)
  {
    id: 'section-320',
    name: 'Pavilion 320',
    level: 'upper',
    baseAngle: 350,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(350, 7, 110, 145, 50, 72) as Vector3D[],
    covered: true,
    distance: 115,
    height: 50,
    rake: 24
  },
  {
    id: 'section-321',
    name: 'Pavilion 321',
    level: 'upper',
    baseAngle: 343,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(343, 7, 110, 145, 50, 72) as Vector3D[],
    covered: true,
    distance: 115,
    height: 50,
    rake: 24
  },
  {
    id: 'section-322',
    name: 'Pavilion 322',
    level: 'upper',
    baseAngle: 336,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(336, 7, 112, 147, 50, 72) as Vector3D[],
    covered: true,
    distance: 117,
    height: 50,
    rake: 24
  },
  {
    id: 'section-323',
    name: 'Pavilion 323',
    level: 'upper',
    baseAngle: 329,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(329, 7, 115, 150, 50, 72) as Vector3D[],
    covered: true,
    distance: 120,
    height: 50,
    rake: 24
  },
  {
    id: 'section-324',
    name: 'Pavilion 324',
    level: 'upper',
    baseAngle: 322,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(322, 7, 117, 152, 50, 72) as Vector3D[],
    covered: true,
    distance: 122,
    height: 50,
    rake: 24
  },
  {
    id: 'section-325',
    name: 'Pavilion 325',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(315, 7, 120, 155, 50, 72) as Vector3D[],
    covered: true,
    distance: 125,
    height: 50,
    rake: 24
  },
  {
    id: 'section-326',
    name: 'Pavilion 326',
    level: 'upper',
    baseAngle: 308,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(308, 7, 122, 157, 50, 72) as Vector3D[],
    covered: true,
    distance: 127,
    height: 50,
    rake: 24
  },
  {
    id: 'section-327',
    name: 'Pavilion 327',
    level: 'upper',
    baseAngle: 301,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(301, 7, 125, 160, 50, 72) as Vector3D[],
    covered: true,
    distance: 130,
    height: 50,
    rake: 24
  },
  {
    id: 'section-328',
    name: 'Pavilion 328',
    level: 'upper',
    baseAngle: 294,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 24, 50, 3.2, 24),
    vertices3D: calcVertices(294, 7, 128, 163, 50, 72) as Vector3D[],
    covered: true,
    distance: 133,
    height: 50,
    rake: 24
  },
  {
    id: 'section-329',
    name: 'Pavilion 329',
    level: 'upper',
    baseAngle: 287,
    angleSpan: 7,
    rows: generateRows('A', 'T', 24, 50, 3.2, 24),
    vertices3D: calcVertices(287, 7, 130, 165, 50, 72) as Vector3D[],
    covered: true,
    distance: 135,
    height: 50,
    rake: 24
  },

  // ========== STANDING ROOM / SPECIALTY SECTIONS ==========
  {
    id: 'ashburn-alley',
    name: 'Ashburn Alley',
    level: 'standing',
    baseAngle: 80,
    angleSpan: 30,
    rows: [
      { rowNumber: "SRO", seats: 150, elevation: 12, depth: 0, covered: false }
    ],
    vertices3D: calcVertices(80, 30, 160, 175, 12, 12) as Vector3D[],
    covered: false,
    distance: 165,
    height: 12,
    rake: 0
  },
  {
    id: 'liberty-bell-pavilion',
    name: 'Liberty Bell Pavilion',
    level: 'field',
    baseAngle: 175,
    angleSpan: 10,
    rows: generateRows('A', 'K', 16, 15, 2.5, 18),
    vertices3D: calcVertices(175, 10, 145, 165, 15, 22) as Vector3D[],
    covered: false,
    distance: 150,
    height: 15,
    rake: 18
  },
  {
    id: 'scoreboard-porch',
    name: 'Scoreboard Porch',
    level: 'standing',
    baseAngle: 265,
    angleSpan: 20,
    rows: [
      { rowNumber: "SRO", seats: 100, elevation: 25, depth: 0, covered: false }
    ],
    vertices3D: calcVertices(265, 20, 155, 170, 25, 25) as Vector3D[],
    covered: false,
    distance: 160,
    height: 25,
    rake: 0
  }
];

// Stadium configuration
export const citizensBankParkConfig = {
  stadiumName: 'Citizens Bank Park',
  team: 'Philadelphia Phillies',
  location: 'Philadelphia, Pennsylvania',
  capacity: 42792,
  yearBuilt: 2004,
  orientation: 59,
  dimensions: {
    leftField: 329,
    center: 401,
    rightField: 330
  }
};

// Export section map for easy lookup
export const citizensBankParkSectionMap = new Map(
  citizensBankParkSections.map(section => [section.id, section])
);

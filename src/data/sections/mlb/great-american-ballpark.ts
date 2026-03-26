// Great American Ball Park - Complete Section Data with 3D Geometry
// Cincinnati, OH - Opened 2003 - Capacity 42,319
// Home of the Cincinnati Reds

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  
  const isLetterRows = typeof startRow === 'string';
  
  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);
    
    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 29 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 29 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Great American Ball Park Sections - Comprehensive Layout
export const greatAmericanBallparkSections: DetailedSection[] = [
  // ========== DIAMOND SEATS (Behind Home Plate) ==========
  {
    id: 'DS-1',
    name: 'Diamond Seats 1',
    level: 'field',
    baseAngle: 97, // Park orientation adjusted for actual field
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 0, 17, false),
    vertices3D: [
      { x: -15, y: 58, z: 0 },
      { x: -5, y: 58, z: 0 },
      { x: -5, y: 82, z: 10 },
      { x: -15, y: 82, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 17
  },
  {
    id: 'DS-2',
    name: 'Diamond Seats 2',
    level: 'field',
    baseAngle: 105,
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 0, 17, false),
    vertices3D: [
      { x: -5, y: 58, z: 0 },
      { x: 5, y: 58, z: 0 },
      { x: 5, y: 82, z: 10 },
      { x: -5, y: 82, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 17
  },
  {
    id: 'DS-3',
    name: 'Diamond Seats 3',
    level: 'field',
    baseAngle: 113,
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 0, 17, false),
    vertices3D: [
      { x: 5, y: 58, z: 0 },
      { x: 15, y: 58, z: 0 },
      { x: 15, y: 82, z: 10 },
      { x: 5, y: 82, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 17
  },
  // ========== FIELD BOX SEATS ==========
  {
    id: 'FB-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 121,
    angleSpan: 9,
    rows: generateRows('A', 'S', 20, 0, 18, false),
    vertices3D: [
      { x: 15, y: 60, z: 0 },
      { x: 28, y: 65, z: 0 },
      { x: 32, y: 88, z: 12 },
      { x: 18, y: 83, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 0,
    rake: 18
  },
  {
    id: 'FB-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 130,
    angleSpan: 9,
    rows: generateRows('A', 'S', 20, 0, 18, false),
    vertices3D: [
      { x: 28, y: 65, z: 0 },
      { x: 40, y: 72, z: 0 },
      { x: 45, y: 95, z: 12 },
      { x: 32, y: 88, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 18
  },
  {
    id: 'FB-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 139,
    angleSpan: 9,
    rows: generateRows('A', 'S', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: 72, z: 0 },
      { x: 52, y: 80, z: 0 },
      { x: 58, y: 103, z: 12 },
      { x: 45, y: 95, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 0,
    rake: 18
  },
  // Field Box - Third Base Side
  {
    id: 'FB-111',
    name: 'Field Box 111',
    level: 'field',
    baseAngle: 89,
    angleSpan: 9,
    rows: generateRows('A', 'S', 20, 0, 18, false),
    vertices3D: [
      { x: -15, y: 60, z: 0 },
      { x: -28, y: 65, z: 0 },
      { x: -32, y: 88, z: 12 },
      { x: -18, y: 83, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 0,
    rake: 18
  },
  {
    id: 'FB-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 80,
    angleSpan: 9,
    rows: generateRows('A', 'S', 20, 0, 18, false),
    vertices3D: [
      { x: -28, y: 65, z: 0 },
      { x: -40, y: 72, z: 0 },
      { x: -45, y: 95, z: 12 },
      { x: -32, y: 88, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 18
  },
  {
    id: 'FB-113',
    name: 'Field Box 113',
    level: 'field',
    baseAngle: 71,
    angleSpan: 9,
    rows: generateRows('A', 'S', 20, 0, 18, false),
    vertices3D: [
      { x: -40, y: 72, z: 0 },
      { x: -52, y: 80, z: 0 },
      { x: -58, y: 103, z: 12 },
      { x: -45, y: 95, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 0,
    rake: 18
  },
  // ========== TERRACE LEVEL ==========
  {
    id: '201',
    name: 'Terrace 201',
    level: 'lower',
    baseAngle: 120,
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: 95, y: 20, z: 16 },
      { x: 95, y: 5, z: 16 },
      { x: 135, y: 5, z: 39 },
      { x: 135, y: 20, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 100,
    height: 16,
    rake: 24
  },
  {
    id: '202',
    name: 'Terrace 202',
    level: 'lower',
    baseAngle: 130,
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: 105, y: 30, z: 16 },
      { x: 105, y: 15, z: 16 },
      { x: 145, y: 15, z: 39 },
      { x: 145, y: 30, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 16,
    rake: 24
  },
  {
    id: '203',
    name: 'Terrace 203',
    level: 'lower',
    baseAngle: 140,
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: 115, y: 40, z: 16 },
      { x: 115, y: 25, z: 16 },
      { x: 155, y: 25, z: 39 },
      { x: 155, y: 40, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 16,
    rake: 24
  },
  {
    id: '235',
    name: 'Terrace 235',
    level: 'lower',
    baseAngle: 60, // Third base
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: -95, y: 20, z: 16 },
      { x: -95, y: 5, z: 16 },
      { x: -135, y: 5, z: 39 },
      { x: -135, y: 20, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 100,
    height: 16,
    rake: 24
  },
  {
    id: '234',
    name: 'Terrace 234',
    level: 'lower',
    baseAngle: 70,
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: -105, y: 30, z: 16 },
      { x: -105, y: 15, z: 16 },
      { x: -145, y: 15, z: 39 },
      { x: -145, y: 30, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 16,
    rake: 24
  },
  {
    id: '233',
    name: 'Terrace 233',
    level: 'lower',
    baseAngle: 80,
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: -115, y: 40, z: 16 },
      { x: -115, y: 25, z: 16 },
      { x: -155, y: 25, z: 39 },
      { x: -155, y: 40, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 16,
    rake: 24
  },
  // ========== CLUB LEVEL ==========
  {
    id: '301',
    name: 'Club 301',
    level: 'club',
    baseAngle: 95,
    angleSpan: 10,
    rows: generateRows(1, 12, 20, 30, 26, true),
    vertices3D: [
      { x: -20, y: 110, z: 30 },
      { x: -5, y: 110, z: 30 },
      { x: -5, y: 140, z: 45 },
      { x: -20, y: 140, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 30,
    rake: 26
  },
  {
    id: '302',
    name: 'Club 302',
    level: 'club',
    baseAngle: 105,
    angleSpan: 10,
    rows: generateRows(1, 12, 20, 30, 26, true),
    vertices3D: [
      { x: -5, y: 110, z: 30 },
      { x: 10, y: 110, z: 30 },
      { x: 10, y: 140, z: 45 },
      { x: -5, y: 140, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 30,
    rake: 26
  },
  {
    id: '303',
    name: 'Club 303',
    level: 'club',
    baseAngle: 115,
    angleSpan: 10,
    rows: generateRows(1, 12, 20, 30, 26, true),
    vertices3D: [
      { x: 10, y: 110, z: 30 },
      { x: 25, y: 112, z: 30 },
      { x: 28, y: 142, z: 45 },
      { x: 10, y: 140, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 127,
    height: 30,
    rake: 26
  },
  // ========== VIEW LEVEL ==========
  {
    id: '401',
    name: 'View Level 401',
    level: 'upper',
    baseAngle: 85,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: -50, y: 135, z: 39 },
      { x: -32, y: 135, z: 39 },
      { x: -30, y: 190, z: 78 },
      { x: -48, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 163,
    height: 39,
    rake: 28
  },
  {
    id: '402',
    name: 'View Level 402',
    level: 'upper',
    baseAngle: 96,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: -32, y: 135, z: 39 },
      { x: -14, y: 135, z: 39 },
      { x: -12, y: 190, z: 78 },
      { x: -30, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 163,
    height: 39,
    rake: 28
  },
  {
    id: '403',
    name: 'View Level 403',
    level: 'upper',
    baseAngle: 107,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: -14, y: 135, z: 39 },
      { x: 4, y: 135, z: 39 },
      { x: 6, y: 190, z: 78 },
      { x: -12, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 163,
    height: 39,
    rake: 28
  },
  {
    id: '404',
    name: 'View Level 404',
    level: 'upper',
    baseAngle: 118,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: 4, y: 135, z: 39 },
      { x: 22, y: 135, z: 39 },
      { x: 24, y: 190, z: 78 },
      { x: 6, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 163,
    height: 39,
    rake: 28
  },
  {
    id: '405',
    name: 'View Level 405',
    level: 'upper',
    baseAngle: 129,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: 22, y: 135, z: 39 },
      { x: 40, y: 138, z: 39 },
      { x: 44, y: 193, z: 78 },
      { x: 24, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 165,
    height: 39,
    rake: 28
  },
  {
    id: '432',
    name: 'View Level 432',
    level: 'upper',
    baseAngle: 74,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: -50, y: 135, z: 39 },
      { x: -68, y: 138, z: 39 },
      { x: -72, y: 193, z: 78 },
      { x: -52, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 165,
    height: 39,
    rake: 28
  },
  // ========== OUTFIELD SECTIONS ==========
  {
    id: '141',
    name: 'Left Field 141',
    level: 'field',
    baseAngle: 148,
    angleSpan: 12,
    rows: generateRows('A', 'R', 18, 0, 19, false),
    vertices3D: [
      { x: 65, y: 88, z: 0 },
      { x: 82, y: 105, z: 0 },
      { x: 90, y: 130, z: 13 },
      { x: 70, y: 112, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 0,
    rake: 19
  },
  {
    id: '142',
    name: 'Left Field 142',
    level: 'field',
    baseAngle: 160,
    angleSpan: 12,
    rows: generateRows('A', 'R', 18, 0, 19, false),
    vertices3D: [
      { x: 82, y: 105, z: 0 },
      { x: 95, y: 125, z: 0 },
      { x: 105, y: 150, z: 13 },
      { x: 90, y: 130, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 0,
    rake: 19
  },
  {
    id: '143',
    name: 'Left Field 143',
    level: 'field',
    baseAngle: 172,
    angleSpan: 12,
    rows: generateRows('A', 'R', 18, 0, 19, false),
    vertices3D: [
      { x: 95, y: 125, z: 0 },
      { x: 105, y: 148, z: 0 },
      { x: 115, y: 175, z: 13 },
      { x: 105, y: 150, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 125,
    height: 0,
    rake: 19
  },
  {
    id: '144',
    name: 'Left Field Bleachers 144',
    level: 'field',
    baseAngle: 184,
    angleSpan: 14,
    rows: generateRows(1, 22, 24, 5, 20, false),
    vertices3D: [
      { x: 105, y: 148, z: 5 },
      { x: 110, y: 175, z: 5 },
      { x: 118, y: 205, z: 20 },
      { x: 112, y: 178, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 5,
    rake: 20
  },
  // Right Field
  {
    id: '131',
    name: 'Right Field 131',
    level: 'field',
    baseAngle: 62,
    angleSpan: 12,
    rows: generateRows('A', 'R', 18, 0, 19, false),
    vertices3D: [
      { x: -65, y: 88, z: 0 },
      { x: -82, y: 105, z: 0 },
      { x: -90, y: 130, z: 13 },
      { x: -70, y: 112, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 0,
    rake: 19
  },
  {
    id: '132',
    name: 'Right Field 132',
    level: 'field',
    baseAngle: 50,
    angleSpan: 12,
    rows: generateRows('A', 'R', 18, 0, 19, false),
    vertices3D: [
      { x: -82, y: 105, z: 0 },
      { x: -95, y: 125, z: 0 },
      { x: -105, y: 150, z: 13 },
      { x: -90, y: 130, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 0,
    rake: 19
  },
  {
    id: '133',
    name: 'Right Field 133',
    level: 'field',
    baseAngle: 38,
    angleSpan: 12,
    rows: generateRows('A', 'R', 18, 0, 19, false),
    vertices3D: [
      { x: -95, y: 125, z: 0 },
      { x: -105, y: 148, z: 0 },
      { x: -115, y: 175, z: 13 },
      { x: -105, y: 150, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 125,
    height: 0,
    rake: 19
  },
  {
    id: '134',
    name: 'Right Field Bleachers 134',
    level: 'field',
    baseAngle: 26,
    angleSpan: 14,
    rows: generateRows(1, 22, 24, 5, 20, false),
    vertices3D: [
      { x: -105, y: 148, z: 5 },
      { x: -110, y: 175, z: 5 },
      { x: -118, y: 205, z: 20 },
      { x: -112, y: 178, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 5,
    rake: 20
  },
  // ========== RIVERBOAT DECK (Center Field) ==========
  {
    id: 'RIVER',
    name: 'Riverboat Deck',
    level: 'standing',
    baseAngle: 198, // Center field adjusted
    angleSpan: 18,
    rows: [], // Standing room deck
    vertices3D: [
      { x: 40, y: 235, z: 25 },
      { x: -40, y: 235, z: 25 },
      { x: -40, y: 255, z: 25 },
      { x: 40, y: 255, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 245,
    height: 25,
    rake: 0
  },
  {
    id: 'RIVER-TERRACE',
    name: 'Riverboat Terrace',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 15,
    rows: [], // Standing/dining area
    vertices3D: [
      { x: 25, y: 255, z: 30 },
      { x: -25, y: 255, z: 30 },
      { x: -25, y: 270, z: 30 },
      { x: 25, y: 270, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 262,
    height: 30,
    rake: 0
  },
  // ========== SUITE LEVEL ==========
  {
    id: 'SUITE-A',
    name: 'Suite Level A',
    level: 'suite',
    baseAngle: 100,
    angleSpan: 8,
    rows: [{ rowNumber: "1", seats: 20, elevation: 35, depth: 0, covered: true }],
    vertices3D: [
      { x: -10, y: 125, z: 35 },
      { x: 0, y: 125, z: 35 },
      { x: 0, y: 145, z: 35 },
      { x: -10, y: 145, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 35,
    rake: 0
  },
  {
    id: 'SUITE-B',
    name: 'Suite Level B',
    level: 'suite',
    baseAngle: 108,
    angleSpan: 8,
    rows: [{ rowNumber: "1", seats: 20, elevation: 35, depth: 0, covered: true }],
    vertices3D: [
      { x: 0, y: 125, z: 35 },
      { x: 10, y: 125, z: 35 },
      { x: 10, y: 145, z: 35 },
      { x: 0, y: 145, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 35,
    rake: 0
  },
  // ========== UPPER OUTFIELD ==========
  {
    id: '541',
    name: 'Upper Left Field 541',
    level: 'upper',
    baseAngle: 150,
    angleSpan: 13,
    rows: generateRows(1, 25, 28, 42, 29, false),
    vertices3D: [
      { x: 75, y: 155, z: 42 },
      { x: 95, y: 175, z: 42 },
      { x: 105, y: 225, z: 82 },
      { x: 82, y: 205, z: 82 }
    ] as Vector3D[],
    covered: false,
    distance: 165,
    height: 42,
    rake: 29
  },
  {
    id: '542',
    name: 'Upper Left Field 542',
    level: 'upper',
    baseAngle: 163,
    angleSpan: 13,
    rows: generateRows(1, 25, 28, 42, 29, false),
    vertices3D: [
      { x: 95, y: 175, z: 42 },
      { x: 110, y: 200, z: 42 },
      { x: 122, y: 252, z: 82 },
      { x: 105, y: 225, z: 82 }
    ] as Vector3D[],
    covered: false,
    distance: 187,
    height: 42,
    rake: 29
  },
  {
    id: '531',
    name: 'Upper Right Field 531',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 13,
    rows: generateRows(1, 25, 28, 42, 29, false),
    vertices3D: [
      { x: -75, y: 155, z: 42 },
      { x: -95, y: 175, z: 42 },
      { x: -105, y: 225, z: 82 },
      { x: -82, y: 205, z: 82 }
    ] as Vector3D[],
    covered: false,
    distance: 165,
    height: 42,
    rake: 29
  },
  {
    id: '532',
    name: 'Upper Right Field 532',
    level: 'upper',
    baseAngle: 47,
    angleSpan: 13,
    rows: generateRows(1, 25, 28, 42, 29, false),
    vertices3D: [
      { x: -95, y: 175, z: 42 },
      { x: -110, y: 200, z: 42 },
      { x: -122, y: 252, z: 82 },
      { x: -105, y: 225, z: 82 }
    ] as Vector3D[],
    covered: false,
    distance: 187,
    height: 42,
    rake: 29
  }
];

// Export section map for easy lookup
export const greatAmericanBallparkSectionMap = new Map(
  greatAmericanBallparkSections.map(section => [section.id, section])
);

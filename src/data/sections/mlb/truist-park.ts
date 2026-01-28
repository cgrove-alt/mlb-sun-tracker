// Truist Park - Complete Section Data with 3D Geometry
// Atlanta, GA - Opened 2017 - Capacity 41,084
// Home of the Atlanta Braves

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
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}
  // Truist Park Sections - Comprehensive Layout
export const truistParkSections: DetailedSection[] = [
  // ========== DELTA SKY 360 CLUB (Behind Home Plate) ==========
  {
    id: 'DSC-1',
    name: 'Delta Sky 360 Club 1',
    level: 'field',
    baseAngle: 37, // Park orientation at 45°
    angleSpan: 8,
    rows: generateRows('A', 'L', 18, 0, 18, false),
    vertices3D: [
      { x: -15, y: 58, z: 0 },
      { x: -7, y: 58, z: 0 },
      { x: -7, y: 78, z: 8 },
      { x: -15, y: 78, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 18
  },
  {
    id: 'DSC-2',
    name: 'Delta Sky 360 Club 2',
    level: 'field',
    baseAngle: 45,
    angleSpan: 8,
    rows: generateRows('A', 'L', 18, 0, 18, false),
    vertices3D: [
      { x: -7, y: 58, z: 0 },
      { x: 1, y: 58, z: 0 },
      { x: 1, y: 78, z: 8 },
      { x: -7, y: 78, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 18
  },
  {
    id: 'DSC-3',
    name: 'Delta Sky 360 Club 3',
    level: 'field',
    baseAngle: 53,
    angleSpan: 8,
    rows: generateRows('A', 'L', 18, 0, 18, false),
    vertices3D: [
      { x: 1, y: 58, z: 0 },
      { x: 9, y: 58, z: 0 },
      { x: 9, y: 78, z: 8 },
      { x: 1, y: 78, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 18
  },
  // ========== FIELD LEVEL ==========
  {
    id: '11',
    name: 'Field Level 11',
    level: 'field',
    baseAngle: 29,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -22, y: 60, z: 0 },
      { x: -14, y: 60, z: 0 },
      { x: -14, y: 90, z: 13 },
      { x: -22, y: 90, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '12',
    name: 'Field Level 12',
    level: 'field',
    baseAngle: 37,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -14, y: 60, z: 0 },
      { x: -6, y: 60, z: 0 },
      { x: -6, y: 90, z: 13 },
      { x: -14, y: 90, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '13',
    name: 'Field Level 13',
    level: 'field',
    baseAngle: 45,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -6, y: 60, z: 0 },
      { x: 2, y: 60, z: 0 },
      { x: 2, y: 90, z: 13 },
      { x: -6, y: 90, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '14',
    name: 'Field Level 14',
    level: 'field',
    baseAngle: 53,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: 2, y: 60, z: 0 },
      { x: 10, y: 60, z: 0 },
      { x: 10, y: 90, z: 13 },
      { x: 2, y: 90, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '15',
    name: 'Field Level 15',
    level: 'field',
    baseAngle: 61,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: 10, y: 60, z: 0 },
      { x: 18, y: 62, z: 0 },
      { x: 20, y: 92, z: 13 },
      { x: 10, y: 90, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 67,
    height: 0,
    rake: 20
  },
  {
    id: '16',
    name: 'Field Level 16',
    level: 'field',
    baseAngle: 69,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: 18, y: 62, z: 0 },
      { x: 26, y: 64, z: 0 },
      { x: 28, y: 94, z: 13 },
      { x: 20, y: 92, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 69,
    height: 0,
    rake: 20
  },
  // Field Level - First Base Side
  {
    id: '101',
    name: 'Field Level 101',
    level: 'field',
    baseAngle: 69,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: 18, y: 62, z: 0 },
      { x: 27, y: 66, z: 0 },
      { x: 30, y: 97, z: 14 },
      { x: 20, y: 92, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 0,
    rake: 21
  },
  {
    id: '102',
    name: 'Field Level 102',
    level: 'field',
    baseAngle: 78,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: 27, y: 66, z: 0 },
      { x: 36, y: 72, z: 0 },
      { x: 40, y: 103, z: 14 },
      { x: 30, y: 97, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 21
  },
  {
    id: '103',
    name: 'Field Level 103',
    level: 'field',
    baseAngle: 87,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: 36, y: 72, z: 0 },
      { x: 45, y: 80, z: 0 },
      { x: 50, y: 111, z: 14 },
      { x: 40, y: 103, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 82,
    height: 0,
    rake: 21
  },
  // Field Level - Third Base Side
  {
    id: '111',
    name: 'Field Level 111',
    level: 'field',
    baseAngle: 21,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: -18, y: 62, z: 0 },
      { x: -27, y: 66, z: 0 },
      { x: -30, y: 97, z: 14 },
      { x: -20, y: 92, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 0,
    rake: 21
  },
  {
    id: '112',
    name: 'Field Level 112',
    level: 'field',
    baseAngle: 12,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: -27, y: 66, z: 0 },
      { x: -36, y: 72, z: 0 },
      { x: -40, y: 103, z: 14 },
      { x: -30, y: 97, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 21
  },
  {
    id: '113',
    name: 'Field Level 113',
    level: 'field',
    baseAngle: 3,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: -36, y: 72, z: 0 },
      { x: -45, y: 80, z: 0 },
      { x: -50, y: 111, z: 14 },
      { x: -40, y: 103, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 82,
    height: 0,
    rake: 21
  },
  {
    id: '9',
    name: 'Field Level 9',
    level: 'field',
    baseAngle: 354,
    angleSpan: 9,
    rows: generateRows('A', 'AA', 24, 0, 21, false),
    vertices3D: [
      { x: -45, y: 80, z: 0 },
      { x: -54, y: 90, z: 0 },
      { x: -60, y: 121, z: 14 },
      { x: -50, y: 111, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 88,
    height: 0,
    rake: 21
  },
  {
    id: '8',
    name: 'Field Level 8',
    level: 'field',
    baseAngle: 345,
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -54, y: 90, z: 0 },
      { x: -62, y: 102, z: 0 },
      { x: -68, y: 132, z: 13 },
      { x: -60, y: 121, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 96,
    height: 0,
    rake: 20
  },
  {
    id: '7',
    name: 'Field Level 7',
    level: 'field',
    baseAngle: 336,
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -62, y: 102, z: 0 },
      { x: -70, y: 115, z: 0 },
      { x: -76, y: 145, z: 13 },
      { x: -68, y: 132, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 105,
    height: 0,
    rake: 20
  },
  {
    id: '6',
    name: 'Field Level 6',
    level: 'field',
    baseAngle: 327,
    angleSpan: 9,
    rows: generateRows('A', 'T', 20, 0, 20, false),
    vertices3D: [
      { x: -70, y: 115, z: 0 },
      { x: -77, y: 129, z: 0 },
      { x: -83, y: 158, z: 11 },
      { x: -76, y: 145, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 118,
    height: 0,
    rake: 20
  },
  // ========== TERRACE LEVEL ==========
  {
    id: '210',
    name: 'Terrace Level 210',
    level: 'lower',
    baseAngle: 37,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -12, y: 90, z: 17 },
      { x: -2, y: 90, z: 17 },
      { x: -2, y: 128, z: 40 },
      { x: -12, y: 128, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 17,
    rake: 24
  },
  {
    id: '211',
    name: 'Terrace Level 211',
    level: 'lower',
    baseAngle: 47,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -2, y: 90, z: 17 },
      { x: 8, y: 90, z: 17 },
      { x: 8, y: 128, z: 40 },
      { x: -2, y: 128, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 17,
    rake: 24
  },
  {
    id: '212',
    name: 'Terrace Level 212',
    level: 'lower',
    baseAngle: 57,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 8, y: 90, z: 17 },
      { x: 18, y: 92, z: 17 },
      { x: 20, y: 130, z: 40 },
      { x: 8, y: 128, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 97,
    height: 17,
    rake: 24
  },
  {
    id: '213',
    name: 'Terrace Level 213',
    level: 'lower',
    baseAngle: 67,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 18, y: 92, z: 17 },
      { x: 28, y: 98, z: 17 },
      { x: 32, y: 136, z: 40 },
      { x: 20, y: 130, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 100,
    height: 17,
    rake: 24
  },
  {
    id: '214',
    name: 'Terrace Level 214',
    level: 'lower',
    baseAngle: 77,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 28, y: 98, z: 17 },
      { x: 38, y: 105, z: 17 },
      { x: 43, y: 143, z: 40 },
      { x: 32, y: 136, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 104,
    height: 17,
    rake: 24
  },
  {
    id: '215',
    name: 'Terrace Level 215',
    level: 'lower',
    baseAngle: 87,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 38, y: 105, z: 17 },
      { x: 48, y: 113, z: 17 },
      { x: 54, y: 151, z: 40 },
      { x: 43, y: 143, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 109,
    height: 17,
    rake: 24
  },
  {
    id: '227',
    name: 'Terrace Level 227',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 45, y: 103, z: 17 },
      { x: 55, y: 112, z: 17 },
      { x: 62, y: 152, z: 40 },
      { x: 50, y: 142, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 108,
    height: 17,
    rake: 24
  },
  {
    id: '235',
    name: 'Terrace Level 235',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -45, y: 103, z: 17 },
      { x: -55, y: 112, z: 17 },
      { x: -62, y: 152, z: 40 },
      { x: -50, y: 142, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 108,
    height: 17,
    rake: 24
  },
  {
    id: '236',
    name: 'Terrace Level 236',
    level: 'lower',
    baseAngle: 350,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -48, y: 105, z: 17 },
      { x: -58, y: 115, z: 17 },
      { x: -65, y: 155, z: 40 },
      { x: -54, y: 145, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 17,
    rake: 24
  },
  {
    id: '237',
    name: 'Terrace Level 237',
    level: 'lower',
    baseAngle: 340,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -58, y: 115, z: 17 },
      { x: -67, y: 127, z: 17 },
      { x: -75, y: 167, z: 40 },
      { x: -65, y: 155, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 17,
    rake: 24
  },
  {
    id: '238',
    name: 'Terrace Level 238',
    level: 'lower',
    baseAngle: 330,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -67, y: 127, z: 17 },
      { x: -75, y: 140, z: 17 },
      { x: -84, y: 180, z: 40 },
      { x: -75, y: 167, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 130,
    height: 17,
    rake: 24
  },
  {
    id: '239',
    name: 'Terrace Level 239',
    level: 'lower',
    baseAngle: 320,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -75, y: 140, z: 17 },
      { x: -83, y: 154, z: 17 },
      { x: -92, y: 194, z: 40 },
      { x: -84, y: 180, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 142,
    height: 17,
    rake: 24
  },
  // ========== DELTA CLUB LEVEL ==========
  {
    id: 'DC-301',
    name: 'Delta Club 301',
    level: 'club',
    baseAngle: 35,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: -15, y: 115, z: 32 },
      { x: -5, y: 115, z: 32 },
      { x: -5, y: 145, z: 48 },
      { x: -15, y: 145, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-302',
    name: 'Delta Club 302',
    level: 'club',
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: -5, y: 115, z: 32 },
      { x: 5, y: 115, z: 32 },
      { x: 5, y: 145, z: 48 },
      { x: -5, y: 145, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-303',
    name: 'Delta Club 303',
    level: 'club',
    baseAngle: 55,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: 5, y: 115, z: 32 },
      { x: 15, y: 115, z: 32 },
      { x: 15, y: 145, z: 48 },
      { x: 5, y: 145, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-304',
    name: 'Delta Club 304',
    level: 'club',
    baseAngle: 65,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: 15, y: 115, z: 32 },
      { x: 25, y: 118, z: 32 },
      { x: 27, y: 148, z: 48 },
      { x: 15, y: 145, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 127,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-305',
    name: 'Delta Club 305',
    level: 'club',
    baseAngle: 75,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: 25, y: 118, z: 32 },
      { x: 35, y: 122, z: 32 },
      { x: 38, y: 152, z: 48 },
      { x: 27, y: 148, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 130,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-325',
    name: 'Delta Club 325',
    level: 'club',
    baseAngle: 25,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: -15, y: 115, z: 32 },
      { x: -25, y: 118, z: 32 },
      { x: -27, y: 148, z: 48 },
      { x: -15, y: 145, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 127,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-326',
    name: 'Delta Club 326',
    level: 'club',
    baseAngle: 15,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: -25, y: 118, z: 32 },
      { x: -35, y: 122, z: 32 },
      { x: -38, y: 152, z: 48 },
      { x: -27, y: 148, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 130,
    height: 32,
    rake: 26
  },
  {
    id: 'DC-327',
    name: 'Delta Club 327',
    level: 'club',
    baseAngle: 5,
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 32, 26, true),
    vertices3D: [
      { x: -35, y: 122, z: 32 },
      { x: -45, y: 128, z: 32 },
      { x: -49, y: 158, z: 48 },
      { x: -38, y: 152, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 133,
    height: 32,
    rake: 26
  },
  // ========== PAVILION LEVEL ==========
  {
    id: '401',
    name: 'Pavilion Level 401',
    level: 'upper',
    baseAngle: 30,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -20, y: 130, z: 40 },
      { x: -9, y: 130, z: 40 },
      { x: -7, y: 185, z: 78 },
      { x: -18, y: 185, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 158,
    height: 40,
    rake: 28
  },
  {
    id: '402',
    name: 'Pavilion Level 402',
    level: 'upper',
    baseAngle: 41,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -9, y: 130, z: 40 },
      { x: 2, y: 130, z: 40 },
      { x: 4, y: 185, z: 78 },
      { x: -7, y: 185, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 158,
    height: 40,
    rake: 28
  },
  {
    id: '403',
    name: 'Pavilion Level 403',
    level: 'upper',
    baseAngle: 52,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 2, y: 130, z: 40 },
      { x: 13, y: 130, z: 40 },
      { x: 15, y: 185, z: 78 },
      { x: 4, y: 185, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 158,
    height: 40,
    rake: 28
  },
  {
    id: '404',
    name: 'Pavilion Level 404',
    level: 'upper',
    baseAngle: 63,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 13, y: 130, z: 40 },
      { x: 24, y: 132, z: 40 },
      { x: 27, y: 187, z: 78 },
      { x: 15, y: 185, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 160,
    height: 40,
    rake: 28
  },
  {
    id: '405',
    name: 'Pavilion Level 405',
    level: 'upper',
    baseAngle: 74,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 24, y: 132, z: 40 },
      { x: 35, y: 136, z: 40 },
      { x: 39, y: 191, z: 78 },
      { x: 27, y: 187, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 164,
    height: 40,
    rake: 28
  },
  {
    id: '406',
    name: 'Pavilion Level 406',
    level: 'upper',
    baseAngle: 85,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 35, y: 136, z: 40 },
      { x: 46, y: 142, z: 40 },
      { x: 51, y: 197, z: 78 },
      { x: 39, y: 191, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 168,
    height: 40,
    rake: 28
  },
  {
    id: '433',
    name: 'Pavilion Level 433',
    level: 'upper',
    baseAngle: 347,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -46, y: 142, z: 40 },
      { x: -57, y: 150, z: 40 },
      { x: -63, y: 207, z: 78 },
      { x: -51, y: 197, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 40,
    rake: 28
  },
  {
    id: '434',
    name: 'Pavilion Level 434',
    level: 'upper',
    baseAngle: 336,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -57, y: 150, z: 40 },
      { x: -67, y: 160, z: 40 },
      { x: -74, y: 217, z: 78 },
      { x: -63, y: 207, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 178,
    height: 40,
    rake: 28
  },
  {
    id: '435',
    name: 'Pavilion Level 435',
    level: 'upper',
    baseAngle: 325,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -67, y: 160, z: 40 },
      { x: -76, y: 172, z: 40 },
      { x: -84, y: 229, z: 78 },
      { x: -74, y: 217, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 185,
    height: 40,
    rake: 28
  },
  {
    id: '432',
    name: 'Pavilion Level 432',
    level: 'upper',
    baseAngle: 358,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -55, y: 138, z: 40 },
      { x: -66, y: 148, z: 40 },
      { x: -72, y: 205, z: 78 },
      { x: -60, y: 193, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 171,
    height: 40,
    rake: 28
  },
  {
    id: '445',
    name: 'Pavilion Level 445',
    level: 'upper',
    baseAngle: 92,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 55, y: 138, z: 40 },
      { x: 66, y: 148, z: 40 },
      { x: 72, y: 205, z: 78 },
      { x: 60, y: 193, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 171,
    height: 40,
    rake: 28
  },
  // ========== OUTFIELD SECTIONS ==========
  {
    id: '141',
    name: 'Left Field 141',
    level: 'field',
    baseAngle: 95,
    angleSpan: 11,
    rows: generateRows('A', 'T', 22, 5, 20, false),
    vertices3D: [
      { x: 52, y: 85, z: 5 },
      { x: 64, y: 95, z: 5 },
      { x: 70, y: 120, z: 18 },
      { x: 56, y: 108, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 5,
    rake: 20
  },
  {
    id: '142',
    name: 'Left Field 142',
    level: 'field',
    baseAngle: 106,
    angleSpan: 11,
    rows: generateRows('A', 'T', 22, 5, 20, false),
    vertices3D: [
      { x: 64, y: 95, z: 5 },
      { x: 75, y: 108, z: 5 },
      { x: 82, y: 135, z: 18 },
      { x: 70, y: 120, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 102,
    height: 5,
    rake: 20
  },
  {
    id: '143',
    name: 'Left Field 143',
    level: 'field',
    baseAngle: 117,
    angleSpan: 11,
    rows: generateRows('A', 'T', 22, 5, 20, false),
    vertices3D: [
      { x: 75, y: 108, z: 5 },
      { x: 85, y: 123, z: 5 },
      { x: 93, y: 152, z: 18 },
      { x: 82, y: 135, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 116,
    height: 5,
    rake: 20
  },
  {
    id: '131',
    name: 'Right Field 131',
    level: 'field',
    baseAngle: 349,
    angleSpan: 11,
    rows: generateRows('A', 'T', 22, 5, 20, false),
    vertices3D: [
      { x: -52, y: 85, z: 5 },
      { x: -64, y: 95, z: 5 },
      { x: -70, y: 120, z: 18 },
      { x: -56, y: 108, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 5,
    rake: 20
  },
  {
    id: '132',
    name: 'Right Field 132',
    level: 'field',
    baseAngle: 338,
    angleSpan: 11,
    rows: generateRows('A', 'T', 22, 5, 20, false),
    vertices3D: [
      { x: -64, y: 95, z: 5 },
      { x: -75, y: 108, z: 5 },
      { x: -82, y: 135, z: 18 },
      { x: -70, y: 120, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 102,
    height: 5,
    rake: 20
  },
  {
    id: '133',
    name: 'Right Field 133',
    level: 'field',
    baseAngle: 327,
    angleSpan: 11,
    rows: generateRows('A', 'T', 22, 5, 20, false),
    vertices3D: [
      { x: -75, y: 108, z: 5 },
      { x: -85, y: 123, z: 5 },
      { x: -93, y: 152, z: 18 },
      { x: -82, y: 135, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 116,
    height: 5,
    rake: 20
  },
  // ========== CHOPHOUSE (Right Field) ==========
  {
    id: 'CHOP-1',
    name: 'Chophouse 1',
    level: 'field',
    baseAngle: 318,
    angleSpan: 9,
    rows: generateRows(1, 18, 20, 8, 19, false),
    vertices3D: [
      { x: -85, y: 125, z: 8 },
      { x: -95, y: 138, z: 8 },
      { x: -102, y: 162, z: 22 },
      { x: -90, y: 148, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 132,
    height: 8,
    rake: 19
  },
  {
    id: 'CHOP-2',
    name: 'Chophouse 2',
    level: 'field',
    baseAngle: 309,
    angleSpan: 9,
    rows: generateRows(1, 18, 20, 8, 19, false),
    vertices3D: [
      { x: -95, y: 138, z: 8 },
      { x: -103, y: 153, z: 8 },
      { x: -111, y: 178, z: 22 },
      { x: -102, y: 162, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 146,
    height: 8,
    rake: 19
  },
  {
    id: 'CHOP-TERR',
    name: 'Chophouse Terrace',
    level: 'standing',
    baseAngle: 313,
    angleSpan: 10,
    rows: [],
    vertices3D: [
      { x: -90, y: 148, z: 25 },
      { x: -105, y: 165, z: 25 },
      { x: -110, y: 185, z: 25 },
      { x: -95, y: 168, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 157,
    height: 25,
    rake: 0
  },
  // ========== SUNTRUST PARK SUITES ==========
  {
    id: 'SUITE-A',
    name: 'Suite Level A',
    level: 'suite',
    baseAngle: 40,
    angleSpan: 8,
    rows: [{ rowNumber: "1", seats: 18, elevation: 36, depth: 0, covered: true }],
    vertices3D: [
      { x: -10, y: 130, z: 36 },
      { x: -2, y: 130, z: 36 },
      { x: -2, y: 150, z: 36 },
      { x: -10, y: 150, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 140,
    height: 36,
    rake: 0
  },
  {
    id: 'SUITE-B',
    name: 'Suite Level B',
    level: 'suite',
    baseAngle: 48,
    angleSpan: 8,
    rows: [{ rowNumber: "1", seats: 18, elevation: 36, depth: 0, covered: true }],
    vertices3D: [
      { x: -2, y: 130, z: 36 },
      { x: 6, y: 130, z: 36 },
      { x: 6, y: 150, z: 36 },
      { x: -2, y: 150, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 140,
    height: 36,
    rake: 0
  },
  // ========== INFINITY ROOFTOP ==========
  {
    id: 'INFINITY',
    name: 'Infinity Rooftop',
    level: 'standing',
    baseAngle: 135,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 88, y: 165, z: 50 },
      { x: 105, y: 185, z: 50 },
      { x: 110, y: 205, z: 50 },
      { x: 92, y: 185, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 175,
    height: 50,
    rake: 0
  },
  // ========== BATTERY ATLANTA DECK ==========
  {
    id: 'BATTERY',
    name: 'Battery Atlanta Deck',
    level: 'standing',
    baseAngle: 155,
    angleSpan: 18,
    rows: [],
    vertices3D: [
      { x: 105, y: 185, z: 45 },
      { x: 115, y: 210, z: 45 },
      { x: 120, y: 235, z: 45 },
      { x: 110, y: 210, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 198,
    height: 45,
    rake: 0
  }
];

// Export section map for easy lookup
export const truistParkSectionMap = new Map(
  truistParkSections.map(section => [section.id, section])
);

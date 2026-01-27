// Coca-Cola Park - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations

import { DetailedSection, Vector3D, RowDetail } from '../../../../types/stadium-complete';

// Helper function to generate rows
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
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
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
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

export const lehighvalleyironpigsSections: DetailedSection[] = [
  // ========== FIELD LEVEL - Sections 100-120 (Third Base to First Base) ==========
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 60,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 20, y: 35, z: 0 },
      { x: 16, y: 37, z: 0 },
      { x: 26, y: 59, z: 10 },
      { x: 33, y: 56, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '101',
    name: 'Field 101',
    level: 'field',
    baseAngle: 66,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 16, y: 37, z: 0 },
      { x: 12, y: 38, z: 0 },
      { x: 20, y: 62, z: 10 },
      { x: 26, y: 59, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '102',
    name: 'Field 102',
    level: 'field',
    baseAngle: 72,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 12, y: 38, z: 0 },
      { x: 8, y: 39, z: 0 },
      { x: 14, y: 64, z: 10 },
      { x: 20, y: 62, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '103',
    name: 'Field 103',
    level: 'field',
    baseAngle: 78,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 8, y: 39, z: 0 },
      { x: 4, y: 40, z: 0 },
      { x: 7, y: 65, z: 10 },
      { x: 14, y: 64, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '104',
    name: 'Field 104',
    level: 'field',
    baseAngle: 84,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 4, y: 40, z: 0 },
      { x: 0, y: 40, z: 0 },
      { x: 0, y: 65, z: 10 },
      { x: 7, y: 65, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '105',
    name: 'Field 105',
    level: 'field',
    baseAngle: 90,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 0, y: 40, z: 0 },
      { x: -4, y: 40, z: 0 },
      { x: -7, y: 65, z: 10 },
      { x: 0, y: 65, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '106',
    name: 'Field 106',
    level: 'field',
    baseAngle: 96,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -4, y: 40, z: 0 },
      { x: -8, y: 39, z: 0 },
      { x: -14, y: 64, z: 10 },
      { x: -7, y: 65, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '107',
    name: 'Field 107',
    level: 'field',
    baseAngle: 102,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -8, y: 39, z: 0 },
      { x: -12, y: 38, z: 0 },
      { x: -20, y: 62, z: 10 },
      { x: -14, y: 64, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '108',
    name: 'Field 108',
    level: 'field',
    baseAngle: 108,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -12, y: 38, z: 0 },
      { x: -16, y: 37, z: 0 },
      { x: -26, y: 59, z: 10 },
      { x: -20, y: 62, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '109',
    name: 'Field 109',
    level: 'field',
    baseAngle: 114,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -16, y: 37, z: 0 },
      { x: -20, y: 35, z: 0 },
      { x: -32, y: 56, z: 10 },
      { x: -26, y: 59, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  // Additional Field Level - First Base Side
  {
    id: '110',
    name: 'Field 110',
    level: 'field',
    baseAngle: 48,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 28, y: 28, z: 0 },
      { x: 24, y: 31, z: 0 },
      { x: 38, y: 50, z: 10 },
      { x: 44, y: 45, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 52,
    height: 0,
    rake: 18
  },
  {
    id: '111',
    name: 'Field 111',
    level: 'field',
    baseAngle: 54,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 24, y: 31, z: 0 },
      { x: 20, y: 35, z: 0 },
      { x: 33, y: 56, z: 10 },
      { x: 38, y: 50, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 52,
    height: 0,
    rake: 18
  },
  // Field Level Behind Home Plate
  {
    id: '118',
    name: 'Field 118',
    level: 'field',
    baseAngle: 36,
    angleSpan: 6,
    rows: generateRows('A', 'M', 18, 0, 16, false),
    vertices3D: [
      { x: 35, y: 20, z: 0 },
      { x: 32, y: 24, z: 0 },
      { x: 47, y: 35, z: 8 },
      { x: 51, y: 30, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 45,
    height: 0,
    rake: 16
  },
  {
    id: '119',
    name: 'Field 119',
    level: 'field',
    baseAngle: 42,
    angleSpan: 6,
    rows: generateRows('A', 'M', 18, 0, 16, false),
    vertices3D: [
      { x: 32, y: 24, z: 0 },
      { x: 28, y: 28, z: 0 },
      { x: 44, y: 45, z: 8 },
      { x: 47, y: 35, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 48,
    height: 0,
    rake: 16
  },
  {
    id: '120',
    name: 'Field 120',
    level: 'field',
    baseAngle: 120,
    angleSpan: 6,
    rows: generateRows('A', 'M', 18, 0, 16, false),
    vertices3D: [
      { x: -20, y: 35, z: 0 },
      { x: -24, y: 31, z: 0 },
      { x: -38, y: 50, z: 8 },
      { x: -33, y: 56, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 48,
    height: 0,
    rake: 16
  },
  {
    id: '121',
    name: 'Field 121',
    level: 'field',
    baseAngle: 126,
    angleSpan: 6,
    rows: generateRows('A', 'M', 18, 0, 16, false),
    vertices3D: [
      { x: -24, y: 31, z: 0 },
      { x: -28, y: 28, z: 0 },
      { x: -44, y: 45, z: 8 },
      { x: -38, y: 50, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 48,
    height: 0,
    rake: 16
  },
  {
    id: '122',
    name: 'Field 122',
    level: 'field',
    baseAngle: 132,
    angleSpan: 6,
    rows: generateRows('A', 'M', 18, 0, 16, false),
    vertices3D: [
      { x: -28, y: 28, z: 0 },
      { x: -32, y: 24, z: 0 },
      { x: -47, y: 35, z: 8 },
      { x: -44, y: 45, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 45,
    height: 0,
    rake: 16
  },
  {
    id: '123',
    name: 'Field 123',
    level: 'field',
    baseAngle: 138,
    angleSpan: 6,
    rows: generateRows('A', 'M', 18, 0, 16, false),
    vertices3D: [
      { x: -32, y: 24, z: 0 },
      { x: -35, y: 20, z: 0 },
      { x: -51, y: 30, z: 8 },
      { x: -47, y: 35, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 45,
    height: 0,
    rake: 16
  },
  // ========== LOWER LEVEL - Sections 200-220 (Main Concourse) ==========
  {
    id: '200',
    name: 'Lower 200',
    level: 'lower',
    baseAngle: 65,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 27, y: 59, z: 12 },
      { x: 21, y: 62, z: 12 },
      { x: 31, y: 90, z: 28 },
      { x: 40, y: 86, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '201',
    name: 'Lower 201',
    level: 'lower',
    baseAngle: 71.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 21, y: 62, z: 12 },
      { x: 14, y: 63, z: 12 },
      { x: 21, y: 93, z: 28 },
      { x: 31, y: 90, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '202',
    name: 'Lower 202',
    level: 'lower',
    baseAngle: 77.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 14, y: 63, z: 12 },
      { x: 7, y: 65, z: 12 },
      { x: 10, y: 94, z: 28 },
      { x: 21, y: 93, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '203',
    name: 'Lower 203',
    level: 'lower',
    baseAngle: 83.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 7, y: 65, z: 12 },
      { x: 0, y: 65, z: 12 },
      { x: 0, y: 95, z: 28 },
      { x: 10, y: 94, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '204',
    name: 'Lower 204',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 0, y: 65, z: 12 },
      { x: -7, y: 65, z: 12 },
      { x: -10, y: 94, z: 28 },
      { x: 0, y: 95, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '205',
    name: 'Lower 205',
    level: 'lower',
    baseAngle: 96.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -7, y: 65, z: 12 },
      { x: -14, y: 63, z: 12 },
      { x: -21, y: 93, z: 28 },
      { x: -10, y: 94, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '206',
    name: 'Lower 206',
    level: 'lower',
    baseAngle: 102.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -14, y: 63, z: 12 },
      { x: -21, y: 62, z: 12 },
      { x: -31, y: 90, z: 28 },
      { x: -21, y: 93, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '207',
    name: 'Lower 207',
    level: 'lower',
    baseAngle: 108.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -21, y: 62, z: 12 },
      { x: -27, y: 59, z: 12 },
      { x: -40, y: 86, z: 28 },
      { x: -31, y: 90, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  // Additional Lower Level - First Base Side
  {
    id: '208',
    name: 'Lower 208',
    level: 'lower',
    baseAngle: 46,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 40, y: 45, z: 12 },
      { x: 36, y: 49, z: 12 },
      { x: 52, y: 73, z: 28 },
      { x: 58, y: 68, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 12,
    rake: 22
  },
  {
    id: '209',
    name: 'Lower 209',
    level: 'lower',
    baseAngle: 52.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 36, y: 49, z: 12 },
      { x: 31, y: 54, z: 12 },
      { x: 45, y: 80, z: 28 },
      { x: 52, y: 73, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 72,
    height: 12,
    rake: 22
  },
  {
    id: '210',
    name: 'Lower 210',
    level: 'lower',
    baseAngle: 58.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 31, y: 54, z: 12 },
      { x: 27, y: 59, z: 12 },
      { x: 40, y: 86, z: 28 },
      { x: 45, y: 80, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 74,
    height: 12,
    rake: 22
  },
  // Lower Level - Third Base Side Continued
  {
    id: '211',
    name: 'Lower 211',
    level: 'lower',
    baseAngle: 115,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -27, y: 59, z: 12 },
      { x: -31, y: 54, z: 12 },
      { x: -45, y: 80, z: 28 },
      { x: -40, y: 86, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 74,
    height: 12,
    rake: 22
  },
  {
    id: '212',
    name: 'Lower 212',
    level: 'lower',
    baseAngle: 121.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -31, y: 54, z: 12 },
      { x: -36, y: 49, z: 12 },
      { x: -52, y: 73, z: 28 },
      { x: -45, y: 80, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 72,
    height: 12,
    rake: 22
  },
  {
    id: '213',
    name: 'Lower 213',
    level: 'lower',
    baseAngle: 127.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -36, y: 49, z: 12 },
      { x: -40, y: 45, z: 12 },
      { x: -58, y: 68, z: 28 },
      { x: -52, y: 73, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 12,
    rake: 22
  },
  // Lower Level Behind Home Plate
  {
    id: '214',
    name: 'Lower 214',
    level: 'lower',
    baseAngle: 32,
    angleSpan: 7,
    rows: generateRows('1', '22', 20, 12, 20, false),
    vertices3D: [
      { x: 48, y: 28, z: 12 },
      { x: 45, y: 35, z: 12 },
      { x: 60, y: 50, z: 26 },
      { x: 65, y: 42, z: 26 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 12,
    rake: 20
  },
  {
    id: '215',
    name: 'Lower 215',
    level: 'lower',
    baseAngle: 39,
    angleSpan: 7,
    rows: generateRows('1', '22', 20, 12, 20, false),
    vertices3D: [
      { x: 45, y: 35, z: 12 },
      { x: 40, y: 45, z: 12 },
      { x: 58, y: 68, z: 26 },
      { x: 60, y: 50, z: 26 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 12,
    rake: 20
  },
  {
    id: '216',
    name: 'Lower 216',
    level: 'lower',
    baseAngle: 134,
    angleSpan: 7,
    rows: generateRows('1', '22', 20, 12, 20, false),
    vertices3D: [
      { x: -40, y: 45, z: 12 },
      { x: -45, y: 35, z: 12 },
      { x: -60, y: 50, z: 26 },
      { x: -58, y: 68, z: 26 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 12,
    rake: 20
  },
  {
    id: '217',
    name: 'Lower 217',
    level: 'lower',
    baseAngle: 141,
    angleSpan: 7,
    rows: generateRows('1', '22', 20, 12, 20, false),
    vertices3D: [
      { x: -45, y: 35, z: 12 },
      { x: -48, y: 28, z: 12 },
      { x: -65, y: 42, z: 26 },
      { x: -60, y: 50, z: 26 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 12,
    rake: 20
  },
  // Club Seats
  {
    id: 'C-100',
    name: 'Club 100',
    level: 'club',
    baseAngle: 60,
    angleSpan: 8,
    rows: generateRows('1', '12', 18, 15, 18, true),
    vertices3D: [
      { x: 26, y: 59, z: 15 },
      { x: 19, y: 62, z: 15 },
      { x: 28, y: 83, z: 24 },
      { x: 37, y: 79, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 15,
    rake: 18
  },
  {
    id: 'C-101',
    name: 'Club 101',
    level: 'club',
    baseAngle: 68,
    angleSpan: 8,
    rows: generateRows('1', '12', 18, 15, 18, true),
    vertices3D: [
      { x: 19, y: 62, z: 15 },
      { x: 12, y: 64, z: 15 },
      { x: 17, y: 87, z: 24 },
      { x: 28, y: 83, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 15,
    rake: 18
  },
  {
    id: 'C-102',
    name: 'Club 102',
    level: 'club',
    baseAngle: 76,
    angleSpan: 8,
    rows: generateRows('1', '12', 18, 15, 18, true),
    vertices3D: [
      { x: 12, y: 64, z: 15 },
      { x: 4, y: 65, z: 15 },
      { x: 6, y: 88, z: 24 },
      { x: 17, y: 87, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 15,
    rake: 18
  },
  {
    id: 'C-103',
    name: 'Club 103',
    level: 'club',
    baseAngle: 84,
    angleSpan: 12,
    rows: generateRows('1', '12', 20, 15, 18, true),
    vertices3D: [
      { x: 4, y: 65, z: 15 },
      { x: -4, y: 65, z: 15 },
      { x: -6, y: 88, z: 24 },
      { x: 6, y: 88, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 65,
    height: 15,
    rake: 18
  },
  {
    id: 'C-104',
    name: 'Club 104',
    level: 'club',
    baseAngle: 96,
    angleSpan: 8,
    rows: generateRows('1', '12', 18, 15, 18, true),
    vertices3D: [
      { x: -4, y: 65, z: 15 },
      { x: -12, y: 64, z: 15 },
      { x: -17, y: 87, z: 24 },
      { x: -6, y: 88, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 15,
    rake: 18
  },
  {
    id: 'C-105',
    name: 'Club 105',
    level: 'club',
    baseAngle: 104,
    angleSpan: 8,
    rows: generateRows('1', '12', 18, 15, 18, true),
    vertices3D: [
      { x: -12, y: 64, z: 15 },
      { x: -19, y: 62, z: 15 },
      { x: -28, y: 83, z: 24 },
      { x: -17, y: 87, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 15,
    rake: 18
  },
  {
    id: 'C-106',
    name: 'Club 106',
    level: 'club',
    baseAngle: 112,
    angleSpan: 8,
    rows: generateRows('1', '12', 18, 15, 18, true),
    vertices3D: [
      { x: -19, y: 62, z: 15 },
      { x: -26, y: 59, z: 15 },
      { x: -37, y: 79, z: 24 },
      { x: -28, y: 83, z: 24 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 15,
    rake: 18
  },
  // ========== UPPER LEVEL - Sections 300-318 ==========
  {
    id: '300',
    name: 'Upper 300',
    level: 'upper',
    baseAngle: 70,
    angleSpan: 6.67,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 32, y: 89, z: 28 },
      { x: 22, y: 92, z: 28 },
      { x: 30, y: 126, z: 50 },
      { x: 44, y: 122, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: '301',
    name: 'Upper 301',
    level: 'upper',
    baseAngle: 76.67,
    angleSpan: 6.67,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 22, y: 92, z: 28 },
      { x: 11, y: 94, z: 28 },
      { x: 15, y: 129, z: 50 },
      { x: 30, y: 126, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: '302',
    name: 'Upper 302',
    level: 'upper',
    baseAngle: 83.34,
    angleSpan: 6.67,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 11, y: 94, z: 28 },
      { x: 0, y: 95, z: 28 },
      { x: 0, y: 130, z: 50 },
      { x: 15, y: 129, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: '303',
    name: 'Upper 303',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 6.67,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 0, y: 95, z: 28 },
      { x: -11, y: 94, z: 28 },
      { x: -15, y: 129, z: 50 },
      { x: 0, y: 130, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: '304',
    name: 'Upper 304',
    level: 'upper',
    baseAngle: 96.67,
    angleSpan: 6.67,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -11, y: 94, z: 28 },
      { x: -22, y: 92, z: 28 },
      { x: -30, y: 126, z: 50 },
      { x: -15, y: 129, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: '305',
    name: 'Upper 305',
    level: 'upper',
    baseAngle: 103.34,
    angleSpan: 6.67,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -22, y: 92, z: 28 },
      { x: -32, y: 89, z: 28 },
      { x: -44, y: 122, z: 50 },
      { x: -30, y: 126, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 28,
    rake: 26
  },
  // Additional Upper Deck - First Base Side
  {
    id: '306',
    name: 'Upper 306',
    level: 'upper',
    baseAngle: 44,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 52, y: 73, z: 28 },
      { x: 46, y: 78, z: 28 },
      { x: 63, y: 107, z: 50 },
      { x: 71, y: 100, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 28,
    rake: 26
  },
  {
    id: '307',
    name: 'Upper 307',
    level: 'upper',
    baseAngle: 50.5,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 46, y: 78, z: 28 },
      { x: 39, y: 84, z: 28 },
      { x: 53, y: 115, z: 50 },
      { x: 63, y: 107, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 102,
    height: 28,
    rake: 26
  },
  {
    id: '308',
    name: 'Upper 308',
    level: 'upper',
    baseAngle: 57,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 39, y: 84, z: 28 },
      { x: 32, y: 89, z: 28 },
      { x: 44, y: 122, z: 50 },
      { x: 53, y: 115, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 106,
    height: 28,
    rake: 26
  },
  {
    id: '309',
    name: 'Upper 309',
    level: 'upper',
    baseAngle: 63.5,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 32, y: 89, z: 28 },
      { x: 25, y: 92, z: 28 },
      { x: 34, y: 126, z: 50 },
      { x: 44, y: 122, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 108,
    height: 28,
    rake: 26
  },
  // Upper Deck - Third Base Side Additional
  {
    id: '310',
    name: 'Upper 310',
    level: 'upper',
    baseAngle: 110,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -25, y: 92, z: 28 },
      { x: -32, y: 89, z: 28 },
      { x: -44, y: 122, z: 50 },
      { x: -34, y: 126, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 108,
    height: 28,
    rake: 26
  },
  {
    id: '311',
    name: 'Upper 311',
    level: 'upper',
    baseAngle: 116.5,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -32, y: 89, z: 28 },
      { x: -39, y: 84, z: 28 },
      { x: -53, y: 115, z: 50 },
      { x: -44, y: 122, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 106,
    height: 28,
    rake: 26
  },
  {
    id: '312',
    name: 'Upper 312',
    level: 'upper',
    baseAngle: 123,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -39, y: 84, z: 28 },
      { x: -46, y: 78, z: 28 },
      { x: -63, y: 107, z: 50 },
      { x: -53, y: 115, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 102,
    height: 28,
    rake: 26
  },
  {
    id: '313',
    name: 'Upper 313',
    level: 'upper',
    baseAngle: 129.5,
    angleSpan: 6.5,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -46, y: 78, z: 28 },
      { x: -52, y: 73, z: 28 },
      { x: -71, y: 100, z: 50 },
      { x: -63, y: 107, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 98,
    height: 28,
    rake: 26
  },
  // Upper Deck Outfield
  {
    id: '314',
    name: 'Upper 314',
    level: 'upper',
    baseAngle: 28,
    angleSpan: 8,
    rows: generateRows('1', '18', 26, 30, 24, false),
    vertices3D: [
      { x: 65, y: 42, z: 30 },
      { x: 60, y: 50, z: 30 },
      { x: 74, y: 65, z: 48 },
      { x: 80, y: 55, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 88,
    height: 30,
    rake: 24
  },
  {
    id: '315',
    name: 'Upper 315',
    level: 'upper',
    baseAngle: 36,
    angleSpan: 8,
    rows: generateRows('1', '18', 26, 30, 24, false),
    vertices3D: [
      { x: 60, y: 50, z: 30 },
      { x: 52, y: 73, z: 30 },
      { x: 71, y: 100, z: 48 },
      { x: 74, y: 65, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 92,
    height: 30,
    rake: 24
  },
  {
    id: '316',
    name: 'Upper 316',
    level: 'upper',
    baseAngle: 136,
    angleSpan: 8,
    rows: generateRows('1', '18', 26, 30, 24, false),
    vertices3D: [
      { x: -52, y: 73, z: 30 },
      { x: -60, y: 50, z: 30 },
      { x: -74, y: 65, z: 48 },
      { x: -71, y: 100, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 92,
    height: 30,
    rake: 24
  },
  {
    id: '317',
    name: 'Upper 317',
    level: 'upper',
    baseAngle: 144,
    angleSpan: 8,
    rows: generateRows('1', '18', 26, 30, 24, false),
    vertices3D: [
      { x: -60, y: 50, z: 30 },
      { x: -65, y: 42, z: 30 },
      { x: -80, y: 55, z: 48 },
      { x: -74, y: 65, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 88,
    height: 30,
    rake: 24
  },
  {
    id: '318',
    name: 'Upper 318',
    level: 'upper',
    baseAngle: 22,
    angleSpan: 6,
    rows: generateRows('1', '15', 22, 32, 22, false),
    vertices3D: [
      { x: 70, y: 30, z: 32 },
      { x: 65, y: 42, z: 32 },
      { x: 78, y: 52, z: 45 },
      { x: 84, y: 38, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 32,
    rake: 22
  },
  {
    id: '319',
    name: 'Upper 319',
    level: 'upper',
    baseAngle: 152,
    angleSpan: 6,
    rows: generateRows('1', '15', 22, 32, 22, false),
    vertices3D: [
      { x: -65, y: 42, z: 32 },
      { x: -70, y: 30, z: 32 },
      { x: -84, y: 38, z: 45 },
      { x: -78, y: 52, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 32,
    rake: 22
  },
  // ========== BLEACHER SECTIONS ==========
  {
    id: 'BL-1',
    name: 'Left Field Bleachers 1',
    level: 'field',
    baseAngle: 150,
    angleSpan: 10,
    rows: generateRows('1', '14', 22, 5, 16, false),
    vertices3D: [
      { x: -113, y: 65, z: 5 },
      { x: -123, y: 48, z: 5 },
      { x: -146, y: 58, z: 18 },
      { x: -134, y: 78, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 138,
    height: 5,
    rake: 16
  },
  {
    id: 'BL-2',
    name: 'Left Field Bleachers 2',
    level: 'field',
    baseAngle: 160,
    angleSpan: 10,
    rows: generateRows('1', '14', 22, 5, 16, false),
    vertices3D: [
      { x: -123, y: 48, z: 5 },
      { x: -128, y: 23, z: 5 },
      { x: -153, y: 28, z: 18 },
      { x: -146, y: 58, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 140,
    height: 5,
    rake: 16
  },
  {
    id: 'BL-3',
    name: 'Center Field Bleachers 1',
    level: 'field',
    baseAngle: 170,
    angleSpan: 10,
    rows: generateRows('1', '14', 24, 5, 16, false),
    vertices3D: [
      { x: -128, y: 23, z: 5 },
      { x: -130, y: -11, z: 5 },
      { x: -156, y: -13, z: 18 },
      { x: -153, y: 28, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 5,
    rake: 16
  },
  {
    id: 'BL-4',
    name: 'Center Field Bleachers 2',
    level: 'field',
    baseAngle: 180,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: -130, y: -11, z: 6 },
      { x: -115, y: -48, z: 6 },
      { x: -138, y: -58, z: 20 },
      { x: -156, y: -13, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 152,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-5',
    name: 'Center Field Bleachers 3',
    level: 'field',
    baseAngle: 192,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: -115, y: -48, z: 6 },
      { x: -90, y: -78, z: 6 },
      { x: -108, y: -94, z: 20 },
      { x: -138, y: -58, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 158,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-6',
    name: 'Center Field Bleachers 4',
    level: 'field',
    baseAngle: 204,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: -90, y: -78, z: 6 },
      { x: -58, y: -98, z: 6 },
      { x: -70, y: -118, z: 20 },
      { x: -108, y: -94, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 164,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-7',
    name: 'Center Field Bleachers 5',
    level: 'field',
    baseAngle: 216,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: -58, y: -98, z: 6 },
      { x: -22, y: -108, z: 6 },
      { x: -26, y: -130, z: 20 },
      { x: -70, y: -118, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 168,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-8',
    name: 'Center Field Bleachers 6',
    level: 'field',
    baseAngle: 228,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: -22, y: -108, z: 6 },
      { x: 16, y: -110, z: 6 },
      { x: 19, y: -132, z: 20 },
      { x: -26, y: -130, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-9',
    name: 'Center Field Bleachers 7',
    level: 'field',
    baseAngle: 240,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: 16, y: -110, z: 6 },
      { x: 52, y: -100, z: 6 },
      { x: 62, y: -120, z: 20 },
      { x: 19, y: -132, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 168,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-10',
    name: 'Center Field Bleachers 8',
    level: 'field',
    baseAngle: 252,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: 52, y: -100, z: 6 },
      { x: 84, y: -82, z: 6 },
      { x: 101, y: -98, z: 20 },
      { x: 62, y: -120, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 164,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-11',
    name: 'Right Field Bleachers 1',
    level: 'field',
    baseAngle: 264,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: 84, y: -82, z: 6 },
      { x: 108, y: -52, z: 6 },
      { x: 130, y: -62, z: 20 },
      { x: 101, y: -98, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 158,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-12',
    name: 'Right Field Bleachers 2',
    level: 'field',
    baseAngle: 276,
    angleSpan: 12,
    rows: generateRows('1', '16', 26, 6, 16, false),
    vertices3D: [
      { x: 108, y: -52, z: 6 },
      { x: 122, y: -18, z: 6 },
      { x: 146, y: -22, z: 20 },
      { x: 130, y: -62, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 152,
    height: 6,
    rake: 16
  },
  {
    id: 'BL-13',
    name: 'Right Field Bleachers 3',
    level: 'field',
    baseAngle: 10,
    angleSpan: 10,
    rows: generateRows('1', '14', 22, 5, 16, false),
    vertices3D: [
      { x: 128, y: 23, z: 5 },
      { x: 123, y: 48, z: 5 },
      { x: 146, y: 58, z: 18 },
      { x: 153, y: 28, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 140,
    height: 5,
    rake: 16
  },
  {
    id: 'BL-14',
    name: 'Right Field Bleachers 4',
    level: 'field',
    baseAngle: 20,
    angleSpan: 10,
    rows: generateRows('1', '14', 22, 5, 16, false),
    vertices3D: [
      { x: 123, y: 48, z: 5 },
      { x: 113, y: 65, z: 5 },
      { x: 134, y: 78, z: 18 },
      { x: 146, y: 58, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 138,
    height: 5,
    rake: 16
  },
  // ========== SPECIALTY SEATING AREAS ==========
  // Bacon Strip (Right Field Party Deck)
  {
    id: 'BACON',
    name: 'The Bacon Strip',
    level: 'standing',
    baseAngle: 285,
    angleSpan: 20,
    rows: generateRows('1', '3', 30, 8, 12, false),
    vertices3D: [
      { x: 118, y: -8, z: 8 },
      { x: 95, y: 55, z: 8 },
      { x: 105, y: 60, z: 12 },
      { x: 130, y: -9, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 8,
    rake: 8
  },
  // Pig Pen (Left Field Bullpen Seating)
  {
    id: 'PIGPEN',
    name: 'The Pig Pen',
    level: 'standing',
    baseAngle: 155,
    angleSpan: 15,
    rows: generateRows('1', '4', 20, 3, 10, false),
    vertices3D: [
      { x: -125, y: 38, z: 3 },
      { x: -130, y: 8, z: 3 },
      { x: -142, y: 10, z: 10 },
      { x: -137, y: 42, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 135,
    height: 3,
    rake: 10
  },
  // Tiki Terrace & Oasis (Left Field Entertainment Area)
  {
    id: 'TIKI',
    name: 'Capital Blue Tiki Terrace',
    level: 'standing',
    baseAngle: 145,
    angleSpan: 10,
    rows: generateRows('1', '5', 25, 10, 10, true),
    vertices3D: [
      { x: -108, y: 72, z: 10 },
      { x: -120, y: 52, z: 10 },
      { x: -132, y: 58, z: 18 },
      { x: -118, y: 80, z: 18 }
    ] as Vector3D[],
    covered: true,
    distance: 132,
    height: 10,
    rake: 10
  },
  // Dugout Suites
  {
    id: 'DS-1',
    name: 'Dugout Suite 1',
    level: 'suite',
    baseAngle: 38,
    angleSpan: 4,
    rows: generateRows('1', '3', 12, 0, 12, true),
    vertices3D: [
      { x: 33, y: 22, z: 0 },
      { x: 31, y: 26, z: 0 },
      { x: 40, y: 33, z: 4 },
      { x: 43, y: 28, z: 4 }
    ] as Vector3D[],
    covered: true,
    distance: 42,
    height: 0,
    rake: 12
  },
  {
    id: 'DS-2',
    name: 'Dugout Suite 2',
    level: 'suite',
    baseAngle: 42,
    angleSpan: 4,
    rows: generateRows('1', '3', 12, 0, 12, true),
    vertices3D: [
      { x: 31, y: 26, z: 0 },
      { x: 29, y: 29, z: 0 },
      { x: 37, y: 37, z: 4 },
      { x: 40, y: 33, z: 4 }
    ] as Vector3D[],
    covered: true,
    distance: 43,
    height: 0,
    rake: 12
  },
  {
    id: 'DS-3',
    name: 'Dugout Suite 3',
    level: 'suite',
    baseAngle: 46,
    angleSpan: 4,
    rows: generateRows('1', '3', 12, 0, 12, true),
    vertices3D: [
      { x: 29, y: 29, z: 0 },
      { x: 26, y: 32, z: 0 },
      { x: 34, y: 41, z: 4 },
      { x: 37, y: 37, z: 4 }
    ] as Vector3D[],
    covered: true,
    distance: 44,
    height: 0,
    rake: 12
  },
  {
    id: 'DS-4',
    name: 'Dugout Suite 4',
    level: 'suite',
    baseAngle: 128,
    angleSpan: 4,
    rows: generateRows('1', '3', 12, 0, 12, true),
    vertices3D: [
      { x: -26, y: 32, z: 0 },
      { x: -29, y: 29, z: 0 },
      { x: -37, y: 37, z: 4 },
      { x: -34, y: 41, z: 4 }
    ] as Vector3D[],
    covered: true,
    distance: 44,
    height: 0,
    rake: 12
  },
  {
    id: 'DS-5',
    name: 'Dugout Suite 5',
    level: 'suite',
    baseAngle: 132,
    angleSpan: 4,
    rows: generateRows('1', '3', 12, 0, 12, true),
    vertices3D: [
      { x: -29, y: 29, z: 0 },
      { x: -31, y: 26, z: 0 },
      { x: -40, y: 33, z: 4 },
      { x: -37, y: 37, z: 4 }
    ] as Vector3D[],
    covered: true,
    distance: 43,
    height: 0,
    rake: 12
  },
  {
    id: 'DS-6',
    name: 'Dugout Suite 6',
    level: 'suite',
    baseAngle: 136,
    angleSpan: 4,
    rows: generateRows('1', '3', 12, 0, 12, true),
    vertices3D: [
      { x: -31, y: 26, z: 0 },
      { x: -33, y: 22, z: 0 },
      { x: -43, y: 28, z: 4 },
      { x: -40, y: 33, z: 4 }
    ] as Vector3D[],
    covered: true,
    distance: 42,
    height: 0,
    rake: 12
  },
  // Grass Berm
  {
    id: 'BERM',
    name: 'Outfield Grass Berm',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: 0, y: -130, z: 12 },
      { x: 60, y: -115, z: 12 },
      { x: 70, y: -134, z: 12 },
      { x: 0, y: -155, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 172,
    height: 12,
    rake: 0
  }
];

// Export section map for easy lookup
export const lehighvalleyironpigsSectionMap = new Map(
  lehighvalleyironpigsSections.map(section => [section.id, section])
);

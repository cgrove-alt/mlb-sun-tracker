// Oriole Park at Camden Yards - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

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

export const oriolesSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field Level 100',
    level: 'field',
    baseAngle: 43,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 37, y: 34, z: 0 },
      { x: 33, y: 37, z: 0 },
      { x: 46, y: 51, z: 8 },
      { x: 50, y: 46, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  {
    id: '101',
    name: 'Field Level 101',
    level: 'field',
    baseAngle: 48,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 33, y: 37, z: 0 },
      { x: 30, y: 40, z: 0 },
      { x: 41, y: 54, z: 8 },
      { x: 46, y: 51, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  {
    id: '102',
    name: 'Field Level 102',
    level: 'field',
    baseAngle: 53,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 30, y: 40, z: 0 },
      { x: 26, y: 42, z: 0 },
      { x: 36, y: 58, z: 8 },
      { x: 41, y: 54, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  {
    id: '103',
    name: 'Field Level 103',
    level: 'field',
    baseAngle: 58,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 26, y: 42, z: 0 },
      { x: 23, y: 45, z: 0 },
      { x: 31, y: 61, z: 8 },
      { x: 36, y: 58, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  {
    id: '104',
    name: 'Field Level 104',
    level: 'field',
    baseAngle: 63,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 23, y: 45, z: 0 },
      { x: 19, y: 46, z: 0 },
      { x: 25, y: 63, z: 8 },
      { x: 31, y: 61, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  {
    id: '105',
    name: 'Field Level 105',
    level: 'field',
    baseAngle: 68,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 19, y: 46, z: 0 },
      { x: 15, y: 48, z: 0 },
      { x: 20, y: 65, z: 8 },
      { x: 25, y: 63, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  {
    id: '110',
    name: 'Field Level 110',
    level: 'field',
    baseAngle: 78,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 11, y: 54, z: 0 },
      { x: 4, y: 55, z: 0 },
      { x: 6, y: 85, z: 12 },
      { x: 18, y: 83, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '111',
    name: 'Field Level 111',
    level: 'field',
    baseAngle: 86,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 4, y: 55, z: 0 },
      { x: -4, y: 55, z: 0 },
      { x: -6, y: 85, z: 12 },
      { x: 6, y: 85, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '112',
    name: 'Field Level 112',
    level: 'field',
    baseAngle: 94,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -4, y: 55, z: 0 },
      { x: -11, y: 54, z: 0 },
      { x: -18, y: 83, z: 12 },
      { x: -6, y: 85, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '113',
    name: 'Field Level 113',
    level: 'field',
    baseAngle: 102,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -11, y: 54, z: 0 },
      { x: -19, y: 52, z: 0 },
      { x: -29, y: 80, z: 12 },
      { x: -18, y: 83, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '114',
    name: 'Field Level 114',
    level: 'field',
    baseAngle: 110,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -19, y: 52, z: 0 },
      { x: -26, y: 49, z: 0 },
      { x: -40, y: 75, z: 12 },
      { x: -29, y: 80, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '115',
    name: 'Field Level 115',
    level: 'field',
    baseAngle: 118,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -26, y: 49, z: 0 },
      { x: -32, y: 44, z: 0 },
      { x: -50, y: 69, z: 12 },
      { x: -40, y: 75, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '116',
    name: 'Field Level 116',
    level: 'field',
    baseAngle: 38,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 43, y: 34, z: 0 },
      { x: 38, y: 40, z: 0 },
      { x: 59, y: 61, z: 12 },
      { x: 67, y: 52, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '117',
    name: 'Field Level 117',
    level: 'field',
    baseAngle: 30,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 48, y: 27, z: 0 },
      { x: 43, y: 34, z: 0 },
      { x: 67, y: 52, z: 12 },
      { x: 74, y: 42, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '118',
    name: 'Field Level 118',
    level: 'field',
    baseAngle: 22,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 51, y: 21, z: 0 },
      { x: 48, y: 27, z: 0 },
      { x: 74, y: 42, z: 12 },
      { x: 79, y: 32, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '119',
    name: 'Field Level 119',
    level: 'field',
    baseAngle: 14,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 53, y: 13, z: 0 },
      { x: 51, y: 21, z: 0 },
      { x: 79, y: 32, z: 12 },
      { x: 82, y: 21, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '120',
    name: 'Field Level 120',
    level: 'field',
    baseAngle: 6,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: 6, z: 0 },
      { x: 53, y: 13, z: 0 },
      { x: 82, y: 21, z: 12 },
      { x: 85, y: 9, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '121',
    name: 'Field Level 121',
    level: 'field',
    baseAngle: 358,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: -2, z: 0 },
      { x: 55, y: 6, z: 0 },
      { x: 85, y: 9, z: 12 },
      { x: 85, y: -3, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 20
  },
  {
    id: '130',
    name: 'Lower Level 130',
    level: 'lower',
    baseAngle: 23,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 78, y: 33, z: 15 },
      { x: 75, y: 40, z: 15 },
      { x: 110, y: 59, z: 38 },
      { x: 115, y: 49, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '131',
    name: 'Lower Level 131',
    level: 'lower',
    baseAngle: 28,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 75, y: 40, z: 15 },
      { x: 71, y: 46, z: 15 },
      { x: 105, y: 68, z: 38 },
      { x: 110, y: 59, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '132',
    name: 'Lower Level 132',
    level: 'lower',
    baseAngle: 33,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 71, y: 46, z: 15 },
      { x: 67, y: 52, z: 15 },
      { x: 99, y: 77, z: 38 },
      { x: 105, y: 68, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '133',
    name: 'Lower Level 133',
    level: 'lower',
    baseAngle: 38,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 67, y: 52, z: 15 },
      { x: 62, y: 58, z: 15 },
      { x: 91, y: 85, z: 38 },
      { x: 99, y: 77, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '134',
    name: 'Lower Level 134',
    level: 'lower',
    baseAngle: 43,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 62, y: 58, z: 15 },
      { x: 57, y: 63, z: 15 },
      { x: 84, y: 93, z: 38 },
      { x: 91, y: 85, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '135',
    name: 'Lower Level 135',
    level: 'lower',
    baseAngle: 48,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 57, y: 63, z: 15 },
      { x: 51, y: 68, z: 15 },
      { x: 75, y: 100, z: 38 },
      { x: 84, y: 93, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '136',
    name: 'Lower Level 136',
    level: 'lower',
    baseAngle: 53,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 51, y: 68, z: 15 },
      { x: 45, y: 72, z: 15 },
      { x: 66, y: 106, z: 38 },
      { x: 75, y: 100, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '137',
    name: 'Lower Level 137',
    level: 'lower',
    baseAngle: 58,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 45, y: 72, z: 15 },
      { x: 39, y: 76, z: 15 },
      { x: 57, y: 111, z: 38 },
      { x: 66, y: 106, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '138',
    name: 'Lower Level 138',
    level: 'lower',
    baseAngle: 63,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 39, y: 76, z: 15 },
      { x: 32, y: 79, z: 15 },
      { x: 47, y: 116, z: 38 },
      { x: 57, y: 111, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '139',
    name: 'Lower Level 139',
    level: 'lower',
    baseAngle: 68,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 32, y: 79, z: 15 },
      { x: 25, y: 81, z: 15 },
      { x: 37, y: 120, z: 38 },
      { x: 47, y: 116, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '140',
    name: 'Lower Level 140',
    level: 'lower',
    baseAngle: 73,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 25, y: 81, z: 15 },
      { x: 18, y: 83, z: 15 },
      { x: 26, y: 122, z: 38 },
      { x: 37, y: 120, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '141',
    name: 'Lower Level 141',
    level: 'lower',
    baseAngle: 78,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 18, y: 83, z: 15 },
      { x: 10, y: 84, z: 15 },
      { x: 15, y: 124, z: 38 },
      { x: 26, y: 122, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '142',
    name: 'Lower Level 142',
    level: 'lower',
    baseAngle: 83,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 10, y: 84, z: 15 },
      { x: 3, y: 85, z: 15 },
      { x: 4, y: 125, z: 38 },
      { x: 15, y: 124, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: '143',
    name: 'Lower Level 143',
    level: 'lower',
    baseAngle: 88,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 3, y: 85, z: 15 },
      { x: -4, y: 85, z: 15 },
      { x: -7, y: 125, z: 38 },
      { x: 4, y: 125, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 15,
    rake: 24
  },
  {
    id: 'CL-300',
    name: 'Club Level 300',
    level: 'club',
    baseAngle: 38,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 99, y: 77, z: 30 },
      { x: 91, y: 85, z: 30 },
      { x: 110, y: 102, z: 45 },
      { x: 118, y: 92, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-301',
    name: 'Club Level 301',
    level: 'club',
    baseAngle: 43,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 91, y: 85, z: 30 },
      { x: 84, y: 93, z: 30 },
      { x: 100, y: 111, z: 45 },
      { x: 110, y: 102, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-302',
    name: 'Club Level 302',
    level: 'club',
    baseAngle: 48,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 84, y: 93, z: 30 },
      { x: 75, y: 100, z: 30 },
      { x: 90, y: 120, z: 45 },
      { x: 100, y: 111, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-303',
    name: 'Club Level 303',
    level: 'club',
    baseAngle: 53,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 75, y: 100, z: 30 },
      { x: 66, y: 106, z: 30 },
      { x: 79, y: 127, z: 45 },
      { x: 90, y: 120, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-304',
    name: 'Club Level 304',
    level: 'club',
    baseAngle: 58,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 66, y: 106, z: 30 },
      { x: 57, y: 111, z: 30 },
      { x: 68, y: 134, z: 45 },
      { x: 79, y: 127, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-305',
    name: 'Club Level 305',
    level: 'club',
    baseAngle: 63,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 57, y: 111, z: 30 },
      { x: 47, y: 116, z: 30 },
      { x: 56, y: 139, z: 45 },
      { x: 68, y: 134, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-306',
    name: 'Club Level 306',
    level: 'club',
    baseAngle: 68,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 47, y: 116, z: 30 },
      { x: 37, y: 120, z: 30 },
      { x: 44, y: 143, z: 45 },
      { x: 56, y: 139, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: 'CL-307',
    name: 'Club Level 307',
    level: 'club',
    baseAngle: 73,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 37, y: 120, z: 30 },
      { x: 26, y: 122, z: 30 },
      { x: 31, y: 147, z: 45 },
      { x: 44, y: 143, z: 45 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 30,
    rake: 26
  },
  {
    id: '400',
    name: 'Upper Level 400',
    level: 'upper',
    baseAngle: 28,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 132, y: 70, z: 40 },
      { x: 126, y: 82, z: 40 },
      { x: 168, y: 109, z: 78 },
      { x: 177, y: 94, z: 78 }
    ] as Vector3D[],
    covered: false,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '401',
    name: 'Upper Level 401',
    level: 'upper',
    baseAngle: 33,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 126, y: 82, z: 40 },
      { x: 118, y: 92, z: 40 },
      { x: 158, y: 123, z: 78 },
      { x: 168, y: 109, z: 78 }
    ] as Vector3D[],
    covered: false,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '402',
    name: 'Upper Level 402',
    level: 'upper',
    baseAngle: 38,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 118, y: 92, z: 40 },
      { x: 110, y: 102, z: 40 },
      { x: 146, y: 136, z: 78 },
      { x: 158, y: 123, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '403',
    name: 'Upper Level 403',
    level: 'upper',
    baseAngle: 43,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 110, y: 102, z: 40 },
      { x: 100, y: 111, z: 40 },
      { x: 134, y: 149, z: 78 },
      { x: 146, y: 136, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '404',
    name: 'Upper Level 404',
    level: 'upper',
    baseAngle: 48,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 100, y: 111, z: 40 },
      { x: 90, y: 120, z: 40 },
      { x: 120, y: 160, z: 78 },
      { x: 134, y: 149, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '405',
    name: 'Upper Level 405',
    level: 'upper',
    baseAngle: 53,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 90, y: 120, z: 40 },
      { x: 79, y: 127, z: 40 },
      { x: 106, y: 170, z: 78 },
      { x: 120, y: 160, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '406',
    name: 'Upper Level 406',
    level: 'upper',
    baseAngle: 58,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 79, y: 127, z: 40 },
      { x: 68, y: 134, z: 40 },
      { x: 91, y: 178, z: 78 },
      { x: 106, y: 170, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '407',
    name: 'Upper Level 407',
    level: 'upper',
    baseAngle: 63,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 68, y: 134, z: 40 },
      { x: 56, y: 139, z: 40 },
      { x: 75, y: 185, z: 78 },
      { x: 91, y: 178, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '408',
    name: 'Upper Level 408',
    level: 'upper',
    baseAngle: 68,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 56, y: 139, z: 40 },
      { x: 44, y: 143, z: 40 },
      { x: 58, y: 191, z: 78 },
      { x: 75, y: 185, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '409',
    name: 'Upper Level 409',
    level: 'upper',
    baseAngle: 73,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 44, y: 143, z: 40 },
      { x: 31, y: 147, z: 40 },
      { x: 42, y: 196, z: 78 },
      { x: 58, y: 191, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '410',
    name: 'Upper Level 410',
    level: 'upper',
    baseAngle: 78,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 31, y: 147, z: 40 },
      { x: 18, y: 149, z: 40 },
      { x: 24, y: 199, z: 78 },
      { x: 42, y: 196, z: 78 }
    ] as Vector3D[],
    covered: false,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: '411',
    name: 'Upper Level 411',
    level: 'upper',
    baseAngle: 83,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 18, y: 149, z: 40 },
      { x: 5, y: 150, z: 40 },
      { x: 7, y: 200, z: 78 },
      { x: 24, y: 199, z: 78 }
    ] as Vector3D[],
    covered: false,
    distance: 175,
    height: 40,
    rake: 28
  },
  {
    id: 'BL-140',
    name: 'Bleachers 140',
    level: 'field',
    baseAngle: 128,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -123, y: 158, z: 8 },
      { x: -153, y: 129, z: 8 },
      { x: -188, y: 157, z: 25 },
      { x: -151, y: 193, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-141',
    name: 'Bleachers 141',
    level: 'field',
    baseAngle: 143,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -160, y: 120, z: 8 },
      { x: -181, y: 85, z: 8 },
      { x: -222, y: 104, z: 25 },
      { x: -196, y: 147, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-142',
    name: 'Bleachers 142',
    level: 'field',
    baseAngle: 158,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -185, y: 75, z: 8 },
      { x: -197, y: 35, z: 8 },
      { x: -241, y: 43, z: 25 },
      { x: -227, y: 92, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-143',
    name: 'Bleachers 143',
    level: 'field',
    baseAngle: 173,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -199, y: 24, z: 8 },
      { x: -199, y: -17, z: 8 },
      { x: -244, y: -21, z: 25 },
      { x: -243, y: 30, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-144',
    name: 'Bleachers 144',
    level: 'field',
    baseAngle: 348,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 196, y: -42, z: 8 },
      { x: 200, y: -0, z: 8 },
      { x: 245, y: -0, z: 25 },
      { x: 240, y: -51, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-145',
    name: 'Bleachers 145',
    level: 'field',
    baseAngle: 333,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 178, y: -91, z: 8 },
      { x: 193, y: -52, z: 8 },
      { x: 237, y: -63, z: 25 },
      { x: 218, y: -111, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-146',
    name: 'Bleachers 146',
    level: 'field',
    baseAngle: 318,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 149, y: -134, z: 8 },
      { x: 173, y: -100, z: 8 },
      { x: 212, y: -123, z: 25 },
      { x: 182, y: -164, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-147',
    name: 'Bleachers 147',
    level: 'field',
    baseAngle: 303,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 109, y: -168, z: 8 },
      { x: 141, y: -141, z: 8 },
      { x: 173, y: -173, z: 25 },
      { x: 133, y: -205, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  {
    id: 'SUITE-1',
    name: 'Suite 1',
    level: 'suite',
    baseAngle: 48,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 94, y: 104, z: 35 },
      { x: 84, y: 112, z: 35 },
      { x: 96, y: 128, z: 35 },
      { x: 107, y: 119, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 150,
    height: 35,
    rake: 0
  },
  {
    id: 'SUITE-2',
    name: 'Suite 2',
    level: 'suite',
    baseAngle: 53,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 84, y: 112, z: 35 },
      { x: 74, y: 119, z: 35 },
      { x: 85, y: 136, z: 35 },
      { x: 96, y: 128, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 150,
    height: 35,
    rake: 0
  },
  {
    id: 'SUITE-3',
    name: 'Suite 3',
    level: 'suite',
    baseAngle: 58,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 74, y: 119, z: 35 },
      { x: 64, y: 125, z: 35 },
      { x: 73, y: 143, z: 35 },
      { x: 85, y: 136, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 150,
    height: 35,
    rake: 0
  },
  {
    id: 'SUITE-4',
    name: 'Suite 4',
    level: 'suite',
    baseAngle: 63,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 64, y: 125, z: 35 },
      { x: 52, y: 130, z: 35 },
      { x: 60, y: 148, z: 35 },
      { x: 73, y: 143, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 150,
    height: 35,
    rake: 0
  },
  {
    id: 'PARTY-DECK',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: 188,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: -243, y: -34, z: 25 },
      { x: -216, y: -115, z: 25 },
      { x: -234, y: -124, z: 25 },
      { x: -262, y: -37, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 25,
    rake: 0
  }
];

// Export section map for easy lookup
export const oriolesSectionMap = new Map(
  oriolesSections.map(section => [section.id, section])
);

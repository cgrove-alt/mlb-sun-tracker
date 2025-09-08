// Chase Field - Comprehensive Section Data
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

export const diamondbacksSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field Level 100',
    level: 'field',
    baseAngle: 8,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 50, y: 7, z: 0 },
      { x: 49, y: 11, z: 0 },
      { x: 66, y: 15, z: 8 },
      { x: 67, y: 9, z: 8 }
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
    baseAngle: 13,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 49, y: 11, z: 0 },
      { x: 48, y: 15, z: 0 },
      { x: 65, y: 21, z: 8 },
      { x: 66, y: 15, z: 8 }
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
    baseAngle: 18,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 48, y: 15, z: 0 },
      { x: 46, y: 20, z: 0 },
      { x: 63, y: 27, z: 8 },
      { x: 65, y: 21, z: 8 }
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
    baseAngle: 23,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 46, y: 20, z: 0 },
      { x: 44, y: 23, z: 0 },
      { x: 60, y: 32, z: 8 },
      { x: 63, y: 27, z: 8 }
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
    baseAngle: 28,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 44, y: 23, z: 0 },
      { x: 42, y: 27, z: 0 },
      { x: 57, y: 37, z: 8 },
      { x: 60, y: 32, z: 8 }
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
    baseAngle: 33,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 42, y: 27, z: 0 },
      { x: 39, y: 31, z: 0 },
      { x: 54, y: 42, z: 8 },
      { x: 57, y: 37, z: 8 }
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
    baseAngle: 43,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 40, y: 38, z: 0 },
      { x: 35, y: 43, z: 0 },
      { x: 53, y: 66, z: 12 },
      { x: 62, y: 58, z: 12 }
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
    baseAngle: 51,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 35, y: 43, z: 0 },
      { x: 28, y: 47, z: 0 },
      { x: 44, y: 73, z: 12 },
      { x: 53, y: 66, z: 12 }
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
    baseAngle: 59,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 28, y: 47, z: 0 },
      { x: 21, y: 51, z: 0 },
      { x: 33, y: 78, z: 12 },
      { x: 44, y: 73, z: 12 }
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
    baseAngle: 67,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 21, y: 51, z: 0 },
      { x: 14, y: 53, z: 0 },
      { x: 22, y: 82, z: 12 },
      { x: 33, y: 78, z: 12 }
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
    baseAngle: 75,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 14, y: 53, z: 0 },
      { x: 7, y: 55, z: 0 },
      { x: 10, y: 84, z: 12 },
      { x: 22, y: 82, z: 12 }
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
    baseAngle: 83,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 7, y: 55, z: 0 },
      { x: -1, y: 55, z: 0 },
      { x: -1, y: 85, z: 12 },
      { x: 10, y: 84, z: 12 }
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
    baseAngle: 3,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: 3, z: 0 },
      { x: 54, y: 10, z: 0 },
      { x: 83, y: 16, z: 12 },
      { x: 85, y: 4, z: 12 }
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
    baseAngle: 355,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: -5, z: 0 },
      { x: 55, y: 3, z: 0 },
      { x: 85, y: 4, z: 12 },
      { x: 85, y: -7, z: 12 }
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
    baseAngle: 347,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 54, y: -12, z: 0 },
      { x: 55, y: -5, z: 0 },
      { x: 85, y: -7, z: 12 },
      { x: 83, y: -19, z: 12 }
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
    baseAngle: 339,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 51, y: -20, z: 0 },
      { x: 54, y: -12, z: 0 },
      { x: 83, y: -19, z: 12 },
      { x: 79, y: -30, z: 12 }
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
    baseAngle: 331,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 48, y: -27, z: 0 },
      { x: 51, y: -20, z: 0 },
      { x: 79, y: -30, z: 12 },
      { x: 74, y: -41, z: 12 }
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
    baseAngle: 323,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 44, y: -33, z: 0 },
      { x: 48, y: -27, z: 0 },
      { x: 74, y: -41, z: 12 },
      { x: 68, y: -51, z: 12 }
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
    baseAngle: 348,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 83, y: -18, z: 15 },
      { x: 84, y: -10, z: 15 },
      { x: 124, y: -15, z: 38 },
      { x: 122, y: -26, z: 38 }
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
    baseAngle: 353,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 84, y: -10, z: 15 },
      { x: 85, y: -3, z: 15 },
      { x: 125, y: -4, z: 38 },
      { x: 124, y: -15, z: 38 }
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
    baseAngle: 358,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 85, y: -3, z: 15 },
      { x: 85, y: 4, z: 15 },
      { x: 125, y: 7, z: 38 },
      { x: 125, y: -4, z: 38 }
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
    baseAngle: 3,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 85, y: 4, z: 15 },
      { x: 84, y: 12, z: 15 },
      { x: 124, y: 17, z: 38 },
      { x: 125, y: 7, z: 38 }
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
    baseAngle: 8,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 84, y: 12, z: 15 },
      { x: 83, y: 19, z: 15 },
      { x: 122, y: 28, z: 38 },
      { x: 124, y: 17, z: 38 }
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
    baseAngle: 13,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 83, y: 19, z: 15 },
      { x: 81, y: 26, z: 15 },
      { x: 119, y: 39, z: 38 },
      { x: 122, y: 28, z: 38 }
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
    baseAngle: 18,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 81, y: 26, z: 15 },
      { x: 78, y: 33, z: 15 },
      { x: 115, y: 49, z: 38 },
      { x: 119, y: 39, z: 38 }
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
    id: '138',
    name: 'Lower Level 138',
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
    id: '139',
    name: 'Lower Level 139',
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
    id: '140',
    name: 'Lower Level 140',
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
    id: '141',
    name: 'Lower Level 141',
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
    id: '142',
    name: 'Lower Level 142',
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
    id: '143',
    name: 'Lower Level 143',
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
    id: 'CL-300',
    name: 'Club Level 300',
    level: 'club',
    baseAngle: 3,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 125, y: 7, z: 30 },
      { x: 124, y: 17, z: 30 },
      { x: 149, y: 21, z: 45 },
      { x: 150, y: 8, z: 45 }
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
    baseAngle: 8,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 124, y: 17, z: 30 },
      { x: 122, y: 28, z: 30 },
      { x: 146, y: 34, z: 45 },
      { x: 149, y: 21, z: 45 }
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
    baseAngle: 13,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 122, y: 28, z: 30 },
      { x: 119, y: 39, z: 30 },
      { x: 143, y: 46, z: 45 },
      { x: 146, y: 34, z: 45 }
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
    baseAngle: 18,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 119, y: 39, z: 30 },
      { x: 115, y: 49, z: 30 },
      { x: 138, y: 59, z: 45 },
      { x: 143, y: 46, z: 45 }
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
    baseAngle: 23,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 115, y: 49, z: 30 },
      { x: 110, y: 59, z: 30 },
      { x: 132, y: 70, z: 45 },
      { x: 138, y: 59, z: 45 }
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
    baseAngle: 28,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 110, y: 59, z: 30 },
      { x: 105, y: 68, z: 30 },
      { x: 126, y: 82, z: 45 },
      { x: 132, y: 70, z: 45 }
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
    baseAngle: 33,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 105, y: 68, z: 30 },
      { x: 99, y: 77, z: 30 },
      { x: 118, y: 92, z: 45 },
      { x: 126, y: 82, z: 45 }
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
    id: '400',
    name: 'Upper Level 400',
    level: 'upper',
    baseAngle: 353,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 149, y: -18, z: 40 },
      { x: 150, y: -5, z: 40 },
      { x: 200, y: -7, z: 78 },
      { x: 199, y: -24, z: 78 }
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
    baseAngle: 358,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 150, y: -5, z: 40 },
      { x: 150, y: 8, z: 40 },
      { x: 200, y: 10, z: 78 },
      { x: 200, y: -7, z: 78 }
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
    baseAngle: 3,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 150, y: 8, z: 40 },
      { x: 149, y: 21, z: 40 },
      { x: 198, y: 28, z: 78 },
      { x: 200, y: 10, z: 78 }
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
    baseAngle: 8,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 149, y: 21, z: 40 },
      { x: 146, y: 34, z: 40 },
      { x: 195, y: 45, z: 78 },
      { x: 198, y: 28, z: 78 }
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
    baseAngle: 13,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 146, y: 34, z: 40 },
      { x: 143, y: 46, z: 40 },
      { x: 190, y: 62, z: 78 },
      { x: 195, y: 45, z: 78 }
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
    baseAngle: 18,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 143, y: 46, z: 40 },
      { x: 138, y: 59, z: 40 },
      { x: 184, y: 78, z: 78 },
      { x: 190, y: 62, z: 78 }
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
    baseAngle: 23,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 138, y: 59, z: 40 },
      { x: 132, y: 70, z: 40 },
      { x: 177, y: 94, z: 78 },
      { x: 184, y: 78, z: 78 }
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
    baseAngle: 28,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 132, y: 70, z: 40 },
      { x: 126, y: 82, z: 40 },
      { x: 168, y: 109, z: 78 },
      { x: 177, y: 94, z: 78 }
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
    baseAngle: 33,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 126, y: 82, z: 40 },
      { x: 118, y: 92, z: 40 },
      { x: 158, y: 123, z: 78 },
      { x: 168, y: 109, z: 78 }
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
    id: '410',
    name: 'Upper Level 410',
    level: 'upper',
    baseAngle: 43,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 110, y: 102, z: 40 },
      { x: 100, y: 111, z: 40 },
      { x: 134, y: 149, z: 78 },
      { x: 146, y: 136, z: 78 }
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
    baseAngle: 48,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 100, y: 111, z: 40 },
      { x: 90, y: 120, z: 40 },
      { x: 120, y: 160, z: 78 },
      { x: 134, y: 149, z: 78 }
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
    baseAngle: 93,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -10, y: 200, z: 8 },
      { x: -52, y: 193, z: 8 },
      { x: -63, y: 237, z: 25 },
      { x: -13, y: 245, z: 25 }
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
    baseAngle: 108,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -62, y: 190, z: 8 },
      { x: -100, y: 173, z: 8 },
      { x: -122, y: 212, z: 25 },
      { x: -76, y: 233, z: 25 }
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
    baseAngle: 123,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -109, y: 168, z: 8 },
      { x: -141, y: 141, z: 8 },
      { x: -173, y: 173, z: 25 },
      { x: -133, y: 205, z: 25 }
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
    baseAngle: 138,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -149, y: 134, z: 8 },
      { x: -173, y: 100, z: 8 },
      { x: -212, y: 122, z: 25 },
      { x: -182, y: 164, z: 25 }
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
    baseAngle: 313,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 136, y: -146, z: 8 },
      { x: 164, y: -115, z: 8 },
      { x: 201, y: -141, z: 25 },
      { x: 167, y: -179, z: 25 }
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
    baseAngle: 298,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 94, y: -177, z: 8 },
      { x: 129, y: -153, z: 8 },
      { x: 157, y: -188, z: 25 },
      { x: 115, y: -216, z: 25 }
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
    baseAngle: 283,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 45, y: -195, z: 8 },
      { x: 85, y: -181, z: 8 },
      { x: 104, y: -222, z: 25 },
      { x: 55, y: -239, z: 25 }
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
    baseAngle: 268,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -7, y: -200, z: 8 },
      { x: 35, y: -197, z: 8 },
      { x: 43, y: -241, z: 25 },
      { x: -9, y: -245, z: 25 }
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
    baseAngle: 13,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 136, y: 31, z: 35 },
      { x: 133, y: 43, z: 35 },
      { x: 152, y: 49, z: 35 },
      { x: 156, y: 36, z: 35 }
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
    baseAngle: 18,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 133, y: 43, z: 35 },
      { x: 129, y: 55, z: 35 },
      { x: 147, y: 63, z: 35 },
      { x: 152, y: 49, z: 35 }
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
    baseAngle: 23,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 129, y: 55, z: 35 },
      { x: 124, y: 66, z: 35 },
      { x: 141, y: 75, z: 35 },
      { x: 147, y: 63, z: 35 }
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
    baseAngle: 28,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 124, y: 66, z: 35 },
      { x: 117, y: 76, z: 35 },
      { x: 134, y: 87, z: 35 },
      { x: 141, y: 75, z: 35 }
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
    baseAngle: 153,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: -218, y: 111, z: 25 },
      { x: -243, y: 30, z: 25 },
      { x: -263, y: 32, z: 25 },
      { x: -236, y: 120, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 25,
    rake: 0
  }
];

// Export section map for easy lookup
export const diamondbacksSectionMap = new Map(
  diamondbacksSections.map(section => [section.id, section])
);

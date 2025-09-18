// George M. Steinbrenner Field - Comprehensive Section Data
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

export const raysSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field Level 100',
    level: 'field',
    baseAngle: 301,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 26, y: -43, z: 0 },
      { x: 29, y: -40, z: 0 },
      { x: 40, y: -55, z: 8 },
      { x: 35, y: -58, z: 8 }
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
    baseAngle: 306,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 29, y: -40, z: 0 },
      { x: 33, y: -38, z: 0 },
      { x: 45, y: -51, z: 8 },
      { x: 40, y: -55, z: 8 }
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
    baseAngle: 311,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 33, y: -38, z: 0 },
      { x: 36, y: -35, z: 0 },
      { x: 49, y: -47, z: 8 },
      { x: 45, y: -51, z: 8 }
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
    baseAngle: 316,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 36, y: -35, z: 0 },
      { x: 39, y: -31, z: 0 },
      { x: 53, y: -43, z: 8 },
      { x: 49, y: -47, z: 8 }
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
    baseAngle: 321,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 39, y: -31, z: 0 },
      { x: 41, y: -28, z: 0 },
      { x: 56, y: -38, z: 8 },
      { x: 53, y: -43, z: 8 }
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
    baseAngle: 326,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 41, y: -28, z: 0 },
      { x: 44, y: -24, z: 0 },
      { x: 59, y: -33, z: 8 },
      { x: 56, y: -38, z: 8 }
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
    baseAngle: 336,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 50, y: -22, z: 0 },
      { x: 53, y: -15, z: 0 },
      { x: 82, y: -23, z: 12 },
      { x: 78, y: -35, z: 12 }
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
    baseAngle: 344,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 53, y: -15, z: 0 },
      { x: 54, y: -8, z: 0 },
      { x: 84, y: -12, z: 12 },
      { x: 82, y: -23, z: 12 }
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
    baseAngle: 352,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 54, y: -8, z: 0 },
      { x: 55, y: -0, z: 0 },
      { x: 85, y: -0, z: 12 },
      { x: 84, y: -12, z: 12 }
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
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: 0, z: 0 },
      { x: 54, y: 8, z: 0 },
      { x: 84, y: 12, z: 12 },
      { x: 85, y: 0, z: 12 }
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
    baseAngle: 8,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 54, y: 8, z: 0 },
      { x: 53, y: 15, z: 0 },
      { x: 82, y: 23, z: 12 },
      { x: 84, y: 12, z: 12 }
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
    baseAngle: 16,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 53, y: 15, z: 0 },
      { x: 50, y: 22, z: 0 },
      { x: 78, y: 35, z: 12 },
      { x: 82, y: 23, z: 12 }
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
    baseAngle: 296,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 24, y: -49, z: 0 },
      { x: 31, y: -46, z: 0 },
      { x: 48, y: -70, z: 12 },
      { x: 37, y: -76, z: 12 }
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
    baseAngle: 288,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 17, y: -52, z: 0 },
      { x: 24, y: -49, z: 0 },
      { x: 37, y: -76, z: 12 },
      { x: 26, y: -81, z: 12 }
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
    baseAngle: 280,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 10, y: -54, z: 0 },
      { x: 17, y: -52, z: 0 },
      { x: 26, y: -81, z: 12 },
      { x: 15, y: -84, z: 12 }
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
    baseAngle: 272,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 2, y: -55, z: 0 },
      { x: 10, y: -54, z: 0 },
      { x: 15, y: -84, z: 12 },
      { x: 3, y: -85, z: 12 }
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
    baseAngle: 264,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -6, y: -55, z: 0 },
      { x: 2, y: -55, z: 0 },
      { x: 3, y: -85, z: 12 },
      { x: -9, y: -85, z: 12 }
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
    baseAngle: 256,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -13, y: -53, z: 0 },
      { x: -6, y: -55, z: 0 },
      { x: -9, y: -85, z: 12 },
      { x: -21, y: -82, z: 12 }
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
    baseAngle: 281,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 16, y: -83, z: 15 },
      { x: 23, y: -82, z: 15 },
      { x: 34, y: -120, z: 38 },
      { x: 24, y: -123, z: 38 }
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
    baseAngle: 286,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 23, y: -82, z: 15 },
      { x: 30, y: -79, z: 15 },
      { x: 45, y: -117, z: 38 },
      { x: 34, y: -120, z: 38 }
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
    baseAngle: 291,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 30, y: -79, z: 15 },
      { x: 37, y: -76, z: 15 },
      { x: 55, y: -112, z: 38 },
      { x: 45, y: -117, z: 38 }
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
    baseAngle: 296,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 37, y: -76, z: 15 },
      { x: 44, y: -73, z: 15 },
      { x: 64, y: -107, z: 38 },
      { x: 55, y: -112, z: 38 }
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
    baseAngle: 301,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 44, y: -73, z: 15 },
      { x: 50, y: -69, z: 15 },
      { x: 73, y: -101, z: 38 },
      { x: 64, y: -107, z: 38 }
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
    baseAngle: 306,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 50, y: -69, z: 15 },
      { x: 56, y: -64, z: 15 },
      { x: 82, y: -94, z: 38 },
      { x: 73, y: -101, z: 38 }
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
    baseAngle: 311,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 56, y: -64, z: 15 },
      { x: 61, y: -59, z: 15 },
      { x: 90, y: -87, z: 38 },
      { x: 82, y: -94, z: 38 }
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
    baseAngle: 316,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 61, y: -59, z: 15 },
      { x: 66, y: -53, z: 15 },
      { x: 97, y: -79, z: 38 },
      { x: 90, y: -87, z: 38 }
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
    baseAngle: 321,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 66, y: -53, z: 15 },
      { x: 70, y: -48, z: 15 },
      { x: 104, y: -70, z: 38 },
      { x: 97, y: -79, z: 38 }
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
    baseAngle: 326,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 70, y: -48, z: 15 },
      { x: 74, y: -41, z: 15 },
      { x: 109, y: -61, z: 38 },
      { x: 104, y: -70, z: 38 }
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
    baseAngle: 331,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 74, y: -41, z: 15 },
      { x: 78, y: -35, z: 15 },
      { x: 114, y: -51, z: 38 },
      { x: 109, y: -61, z: 38 }
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
    baseAngle: 336,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 78, y: -35, z: 15 },
      { x: 80, y: -28, z: 15 },
      { x: 118, y: -41, z: 38 },
      { x: 114, y: -51, z: 38 }
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
    baseAngle: 341,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 80, y: -28, z: 15 },
      { x: 82, y: -21, z: 15 },
      { x: 121, y: -30, z: 38 },
      { x: 118, y: -41, z: 38 }
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
    baseAngle: 346,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 82, y: -21, z: 15 },
      { x: 84, y: -13, z: 15 },
      { x: 123, y: -20, z: 38 },
      { x: 121, y: -30, z: 38 }
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
    baseAngle: 296,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 55, y: -112, z: 30 },
      { x: 64, y: -107, z: 30 },
      { x: 77, y: -129, z: 45 },
      { x: 66, y: -135, z: 45 }
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
    baseAngle: 301,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 64, y: -107, z: 30 },
      { x: 73, y: -101, z: 30 },
      { x: 88, y: -121, z: 45 },
      { x: 77, y: -129, z: 45 }
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
    baseAngle: 306,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 73, y: -101, z: 30 },
      { x: 82, y: -94, z: 30 },
      { x: 98, y: -113, z: 45 },
      { x: 88, y: -121, z: 45 }
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
    baseAngle: 311,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 82, y: -94, z: 30 },
      { x: 90, y: -87, z: 30 },
      { x: 108, y: -104, z: 45 },
      { x: 98, y: -113, z: 45 }
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
    baseAngle: 316,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 90, y: -87, z: 30 },
      { x: 97, y: -79, z: 30 },
      { x: 117, y: -94, z: 45 },
      { x: 108, y: -104, z: 45 }
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
    baseAngle: 321,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 97, y: -79, z: 30 },
      { x: 104, y: -70, z: 30 },
      { x: 124, y: -84, z: 45 },
      { x: 117, y: -94, z: 45 }
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
    baseAngle: 326,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 104, y: -70, z: 30 },
      { x: 109, y: -61, z: 30 },
      { x: 131, y: -73, z: 45 },
      { x: 124, y: -84, z: 45 }
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
    baseAngle: 331,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 109, y: -61, z: 30 },
      { x: 114, y: -51, z: 30 },
      { x: 137, y: -61, z: 45 },
      { x: 131, y: -73, z: 45 }
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
    baseAngle: 286,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 41, y: -144, z: 40 },
      { x: 54, y: -140, z: 40 },
      { x: 72, y: -187, z: 78 },
      { x: 55, y: -192, z: 78 }
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
    baseAngle: 291,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 54, y: -140, z: 40 },
      { x: 66, y: -135, z: 40 },
      { x: 88, y: -180, z: 78 },
      { x: 72, y: -187, z: 78 }
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
    baseAngle: 296,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 66, y: -135, z: 40 },
      { x: 77, y: -129, z: 40 },
      { x: 103, y: -171, z: 78 },
      { x: 88, y: -180, z: 78 }
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
    baseAngle: 301,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 77, y: -129, z: 40 },
      { x: 88, y: -121, z: 40 },
      { x: 118, y: -162, z: 78 },
      { x: 103, y: -171, z: 78 }
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
    baseAngle: 306,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 88, y: -121, z: 40 },
      { x: 98, y: -113, z: 40 },
      { x: 131, y: -151, z: 78 },
      { x: 118, y: -162, z: 78 }
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
    baseAngle: 311,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 98, y: -113, z: 40 },
      { x: 108, y: -104, z: 40 },
      { x: 144, y: -139, z: 78 },
      { x: 131, y: -151, z: 78 }
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
    baseAngle: 316,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 108, y: -104, z: 40 },
      { x: 117, y: -94, z: 40 },
      { x: 155, y: -126, z: 78 },
      { x: 144, y: -139, z: 78 }
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
    baseAngle: 321,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 117, y: -94, z: 40 },
      { x: 124, y: -84, z: 40 },
      { x: 166, y: -112, z: 78 },
      { x: 155, y: -126, z: 78 }
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
    baseAngle: 326,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 124, y: -84, z: 40 },
      { x: 131, y: -73, z: 40 },
      { x: 175, y: -97, z: 78 },
      { x: 166, y: -112, z: 78 }
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
    baseAngle: 331,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 131, y: -73, z: 40 },
      { x: 137, y: -61, z: 40 },
      { x: 183, y: -81, z: 78 },
      { x: 175, y: -97, z: 78 }
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
    baseAngle: 336,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 137, y: -61, z: 40 },
      { x: 142, y: -49, z: 40 },
      { x: 189, y: -65, z: 78 },
      { x: 183, y: -81, z: 78 }
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
    baseAngle: 341,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 142, y: -49, z: 40 },
      { x: 146, y: -36, z: 40 },
      { x: 194, y: -48, z: 78 },
      { x: 189, y: -65, z: 78 }
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
    baseAngle: 26,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 180, y: 88, z: 8 },
      { x: 158, y: 123, z: 8 },
      { x: 193, y: 151, z: 25 },
      { x: 220, y: 107, z: 25 }
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
    baseAngle: 41,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 151, y: 131, z: 8 },
      { x: 120, y: 160, z: 8 },
      { x: 147, y: 196, z: 25 },
      { x: 185, y: 161, z: 25 }
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
    baseAngle: 56,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 112, y: 166, z: 8 },
      { x: 75, y: 185, z: 8 },
      { x: 92, y: 227, z: 25 },
      { x: 137, y: 203, z: 25 }
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
    baseAngle: 71,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 65, y: 189, z: 8 },
      { x: 24, y: 199, z: 8 },
      { x: 30, y: 243, z: 25 },
      { x: 80, y: 232, z: 25 }
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
    baseAngle: 246,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -81, y: -183, z: 8 },
      { x: -42, y: -196, z: 8 },
      { x: -51, y: -240, z: 25 },
      { x: -100, y: -224, z: 25 }
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
    baseAngle: 231,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -126, y: -155, z: 8 },
      { x: -91, y: -178, z: 8 },
      { x: -111, y: -218, z: 25 },
      { x: -154, y: -190, z: 25 }
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
    baseAngle: 216,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -162, y: -118, z: 8 },
      { x: -134, y: -149, z: 8 },
      { x: -164, y: -182, z: 25 },
      { x: -198, y: -144, z: 25 }
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
    baseAngle: 201,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -187, y: -72, z: 8 },
      { x: -168, y: -109, z: 8 },
      { x: -205, y: -133, z: 25 },
      { x: -229, y: -88, z: 25 }
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
    baseAngle: 306,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 82, y: -113, z: 35 },
      { x: 92, y: -106, z: 35 },
      { x: 105, y: -121, z: 35 },
      { x: 94, y: -129, z: 35 }
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
    baseAngle: 311,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 92, y: -106, z: 35 },
      { x: 101, y: -97, z: 35 },
      { x: 115, y: -111, z: 35 },
      { x: 105, y: -121, z: 35 }
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
    baseAngle: 316,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 101, y: -97, z: 35 },
      { x: 109, y: -88, z: 35 },
      { x: 124, y: -101, z: 35 },
      { x: 115, y: -111, z: 35 }
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
    baseAngle: 321,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 109, y: -88, z: 35 },
      { x: 116, y: -78, z: 35 },
      { x: 133, y: -89, z: 35 },
      { x: 124, y: -101, z: 35 }
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
    baseAngle: 86,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 17, y: 244, z: 25 },
      { x: -68, y: 236, z: 25 },
      { x: -73, y: 255, z: 25 },
      { x: 18, y: 264, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 25,
    rake: 0
  }
];

// Export section map for easy lookup
export const raysSectionMap = new Map(
  raysSections.map(section => [section.id, section])
);

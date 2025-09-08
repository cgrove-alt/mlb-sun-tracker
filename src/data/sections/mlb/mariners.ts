// T-Mobile Park - Comprehensive Section Data
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

export const marinersSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field Level 100',
    level: 'field',
    baseAngle: 303,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 27, y: -42, z: 0 },
      { x: 31, y: -39, z: 0 },
      { x: 42, y: -54, z: 8 },
      { x: 37, y: -57, z: 8 }
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
    baseAngle: 308,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 31, y: -39, z: 0 },
      { x: 34, y: -37, z: 0 },
      { x: 46, y: -50, z: 8 },
      { x: 42, y: -54, z: 8 }
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
    baseAngle: 313,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 34, y: -37, z: 0 },
      { x: 37, y: -33, z: 0 },
      { x: 51, y: -46, z: 8 },
      { x: 46, y: -50, z: 8 }
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
    baseAngle: 318,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 37, y: -33, z: 0 },
      { x: 40, y: -30, z: 0 },
      { x: 54, y: -41, z: 8 },
      { x: 51, y: -46, z: 8 }
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
    baseAngle: 323,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 40, y: -30, z: 0 },
      { x: 42, y: -26, z: 0 },
      { x: 58, y: -36, z: 8 },
      { x: 54, y: -41, z: 8 }
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
    baseAngle: 328,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: [
      { x: 42, y: -26, z: 0 },
      { x: 45, y: -23, z: 0 },
      { x: 61, y: -31, z: 8 },
      { x: 58, y: -36, z: 8 }
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
    baseAngle: 338,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 51, y: -21, z: 0 },
      { x: 53, y: -13, z: 0 },
      { x: 82, y: -21, z: 12 },
      { x: 79, y: -32, z: 12 }
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
    baseAngle: 346,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 53, y: -13, z: 0 },
      { x: 55, y: -6, z: 0 },
      { x: 85, y: -9, z: 12 },
      { x: 82, y: -21, z: 12 }
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
    baseAngle: 354,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: -6, z: 0 },
      { x: 55, y: 2, z: 0 },
      { x: 85, y: 3, z: 12 },
      { x: 85, y: -9, z: 12 }
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
    baseAngle: 2,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 55, y: 2, z: 0 },
      { x: 54, y: 10, z: 0 },
      { x: 84, y: 15, z: 12 },
      { x: 85, y: 3, z: 12 }
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
    baseAngle: 10,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 54, y: 10, z: 0 },
      { x: 52, y: 17, z: 0 },
      { x: 81, y: 26, z: 12 },
      { x: 84, y: 15, z: 12 }
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
    baseAngle: 18,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 52, y: 17, z: 0 },
      { x: 49, y: 24, z: 0 },
      { x: 76, y: 37, z: 12 },
      { x: 81, y: 26, z: 12 }
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
    baseAngle: 298,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 26, y: -49, z: 0 },
      { x: 32, y: -44, z: 0 },
      { x: 50, y: -69, z: 12 },
      { x: 40, y: -75, z: 12 }
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
    baseAngle: 290,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 19, y: -52, z: 0 },
      { x: 26, y: -49, z: 0 },
      { x: 40, y: -75, z: 12 },
      { x: 29, y: -80, z: 12 }
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
    baseAngle: 282,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 11, y: -54, z: 0 },
      { x: 19, y: -52, z: 0 },
      { x: 29, y: -80, z: 12 },
      { x: 18, y: -83, z: 12 }
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
    baseAngle: 274,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: 4, y: -55, z: 0 },
      { x: 11, y: -54, z: 0 },
      { x: 18, y: -83, z: 12 },
      { x: 6, y: -85, z: 12 }
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
    baseAngle: 266,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -4, y: -55, z: 0 },
      { x: 4, y: -55, z: 0 },
      { x: 6, y: -85, z: 12 },
      { x: -6, y: -85, z: 12 }
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
    baseAngle: 258,
    angleSpan: 8,
    rows: generateRows('A', 'V', 22, 0, 20, false),
    vertices3D: [
      { x: -11, y: -54, z: 0 },
      { x: -4, y: -55, z: 0 },
      { x: -6, y: -85, z: 12 },
      { x: -18, y: -83, z: 12 }
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
    baseAngle: 283,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 19, y: -83, z: 15 },
      { x: 26, y: -81, z: 15 },
      { x: 39, y: -119, z: 38 },
      { x: 28, y: -122, z: 38 }
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
    baseAngle: 288,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 26, y: -81, z: 15 },
      { x: 33, y: -78, z: 15 },
      { x: 49, y: -115, z: 38 },
      { x: 39, y: -119, z: 38 }
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
    baseAngle: 293,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 33, y: -78, z: 15 },
      { x: 40, y: -75, z: 15 },
      { x: 59, y: -110, z: 38 },
      { x: 49, y: -115, z: 38 }
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
    baseAngle: 298,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 40, y: -75, z: 15 },
      { x: 46, y: -71, z: 15 },
      { x: 68, y: -105, z: 38 },
      { x: 59, y: -110, z: 38 }
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
    baseAngle: 303,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 46, y: -71, z: 15 },
      { x: 52, y: -67, z: 15 },
      { x: 77, y: -99, z: 38 },
      { x: 68, y: -105, z: 38 }
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
    baseAngle: 308,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 52, y: -67, z: 15 },
      { x: 58, y: -62, z: 15 },
      { x: 85, y: -91, z: 38 },
      { x: 77, y: -99, z: 38 }
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
    baseAngle: 313,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 58, y: -62, z: 15 },
      { x: 63, y: -57, z: 15 },
      { x: 93, y: -84, z: 38 },
      { x: 85, y: -91, z: 38 }
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
    baseAngle: 318,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 63, y: -57, z: 15 },
      { x: 68, y: -51, z: 15 },
      { x: 100, y: -75, z: 38 },
      { x: 93, y: -84, z: 38 }
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
    baseAngle: 323,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 68, y: -51, z: 15 },
      { x: 72, y: -45, z: 15 },
      { x: 106, y: -66, z: 38 },
      { x: 100, y: -75, z: 38 }
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
    baseAngle: 328,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 72, y: -45, z: 15 },
      { x: 76, y: -39, z: 15 },
      { x: 111, y: -57, z: 38 },
      { x: 106, y: -66, z: 38 }
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
    baseAngle: 333,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 76, y: -39, z: 15 },
      { x: 79, y: -32, z: 15 },
      { x: 116, y: -47, z: 38 },
      { x: 111, y: -57, z: 38 }
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
    baseAngle: 338,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 79, y: -32, z: 15 },
      { x: 81, y: -25, z: 15 },
      { x: 120, y: -37, z: 38 },
      { x: 116, y: -47, z: 38 }
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
    baseAngle: 343,
    angleSpan: 5,
    rows: generateRows('1', '32', 24, 15, 24, false),
    vertices3D: [
      { x: 81, y: -25, z: 15 },
      { x: 83, y: -18, z: 15 },
      { x: 122, y: -26, z: 38 },
      { x: 120, y: -37, z: 38 }
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
    id: 'CL-300',
    name: 'Club Level 300',
    level: 'club',
    baseAngle: 298,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 59, y: -110, z: 30 },
      { x: 68, y: -105, z: 30 },
      { x: 82, y: -126, z: 45 },
      { x: 70, y: -132, z: 45 }
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
    baseAngle: 303,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 68, y: -105, z: 30 },
      { x: 77, y: -99, z: 30 },
      { x: 92, y: -118, z: 45 },
      { x: 82, y: -126, z: 45 }
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
    baseAngle: 308,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 77, y: -99, z: 30 },
      { x: 85, y: -91, z: 30 },
      { x: 102, y: -110, z: 45 },
      { x: 92, y: -118, z: 45 }
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
    baseAngle: 313,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 85, y: -91, z: 30 },
      { x: 93, y: -84, z: 30 },
      { x: 111, y: -100, z: 45 },
      { x: 102, y: -110, z: 45 }
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
    baseAngle: 318,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 93, y: -84, z: 30 },
      { x: 100, y: -75, z: 30 },
      { x: 120, y: -90, z: 45 },
      { x: 111, y: -100, z: 45 }
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
    baseAngle: 323,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 100, y: -75, z: 30 },
      { x: 106, y: -66, z: 30 },
      { x: 127, y: -79, z: 45 },
      { x: 120, y: -90, z: 45 }
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
    baseAngle: 328,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 106, y: -66, z: 30 },
      { x: 111, y: -57, z: 30 },
      { x: 134, y: -68, z: 45 },
      { x: 127, y: -79, z: 45 }
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
    baseAngle: 333,
    angleSpan: 5,
    rows: generateRows('A', 'L', 20, 30, 26, true),
    vertices3D: [
      { x: 111, y: -57, z: 30 },
      { x: 116, y: -47, z: 30 },
      { x: 139, y: -56, z: 45 },
      { x: 134, y: -68, z: 45 }
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
    baseAngle: 288,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 46, y: -143, z: 40 },
      { x: 59, y: -138, z: 40 },
      { x: 78, y: -184, z: 78 },
      { x: 62, y: -190, z: 78 }
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
    baseAngle: 293,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 59, y: -138, z: 40 },
      { x: 70, y: -132, z: 40 },
      { x: 94, y: -177, z: 78 },
      { x: 78, y: -184, z: 78 }
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
    baseAngle: 298,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 70, y: -132, z: 40 },
      { x: 82, y: -126, z: 40 },
      { x: 109, y: -168, z: 78 },
      { x: 94, y: -177, z: 78 }
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
    baseAngle: 303,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 82, y: -126, z: 40 },
      { x: 92, y: -118, z: 40 },
      { x: 123, y: -158, z: 78 },
      { x: 109, y: -168, z: 78 }
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
    baseAngle: 308,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 92, y: -118, z: 40 },
      { x: 102, y: -110, z: 40 },
      { x: 136, y: -146, z: 78 },
      { x: 123, y: -158, z: 78 }
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
    baseAngle: 313,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 102, y: -110, z: 40 },
      { x: 111, y: -100, z: 40 },
      { x: 149, y: -134, z: 78 },
      { x: 136, y: -146, z: 78 }
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
    baseAngle: 318,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 111, y: -100, z: 40 },
      { x: 120, y: -90, z: 40 },
      { x: 160, y: -120, z: 78 },
      { x: 149, y: -134, z: 78 }
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
    baseAngle: 323,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 120, y: -90, z: 40 },
      { x: 127, y: -79, z: 40 },
      { x: 170, y: -106, z: 78 },
      { x: 160, y: -120, z: 78 }
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
    baseAngle: 328,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 127, y: -79, z: 40 },
      { x: 134, y: -68, z: 40 },
      { x: 178, y: -91, z: 78 },
      { x: 170, y: -106, z: 78 }
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
    baseAngle: 333,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, true),
    vertices3D: [
      { x: 134, y: -68, z: 40 },
      { x: 139, y: -56, z: 40 },
      { x: 185, y: -75, z: 78 },
      { x: 178, y: -91, z: 78 }
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
    baseAngle: 338,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 139, y: -56, z: 40 },
      { x: 143, y: -44, z: 40 },
      { x: 191, y: -58, z: 78 },
      { x: 185, y: -75, z: 78 }
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
    baseAngle: 343,
    angleSpan: 5,
    rows: generateRows('1', '35', 26, 40, 28, false),
    vertices3D: [
      { x: 143, y: -44, z: 40 },
      { x: 147, y: -31, z: 40 },
      { x: 196, y: -42, z: 78 },
      { x: 191, y: -58, z: 78 }
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
    baseAngle: 28,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 177, y: 94, z: 8 },
      { x: 153, y: 129, z: 8 },
      { x: 188, y: 157, z: 25 },
      { x: 216, y: 115, z: 25 }
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
    baseAngle: 43,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 146, y: 136, z: 8 },
      { x: 115, y: 164, z: 8 },
      { x: 141, y: 201, z: 25 },
      { x: 179, y: 167, z: 25 }
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
    baseAngle: 58,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 106, y: 170, z: 8 },
      { x: 68, y: 188, z: 8 },
      { x: 84, y: 230, z: 25 },
      { x: 130, y: 208, z: 25 }
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
    baseAngle: 73,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: 58, y: 191, z: 8 },
      { x: 17, y: 199, z: 8 },
      { x: 21, y: 244, z: 25 },
      { x: 72, y: 234, z: 25 }
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
    baseAngle: 248,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -75, y: -185, z: 8 },
      { x: -35, y: -197, z: 8 },
      { x: -43, y: -241, z: 25 },
      { x: -92, y: -227, z: 25 }
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
    baseAngle: 233,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -120, y: -160, z: 8 },
      { x: -85, y: -181, z: 8 },
      { x: -104, y: -222, z: 25 },
      { x: -147, y: -196, z: 25 }
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
    baseAngle: 218,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -158, y: -123, z: 8 },
      { x: -129, y: -153, z: 8 },
      { x: -157, y: -188, z: 25 },
      { x: -193, y: -151, z: 25 }
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
    baseAngle: 203,
    angleSpan: 12,
    rows: generateRows('A', 'T', 24, 8, 20, false),
    vertices3D: [
      { x: -184, y: -78, z: 8 },
      { x: -164, y: -115, z: 8 },
      { x: -201, y: -141, z: 25 },
      { x: -226, y: -96, z: 25 }
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
    baseAngle: 308,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 86, y: -110, z: 35 },
      { x: 95, y: -102, z: 35 },
      { x: 109, y: -117, z: 35 },
      { x: 99, y: -126, z: 35 }
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
    baseAngle: 313,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 95, y: -102, z: 35 },
      { x: 104, y: -94, z: 35 },
      { x: 119, y: -107, z: 35 },
      { x: 109, y: -117, z: 35 }
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
    baseAngle: 318,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 104, y: -94, z: 35 },
      { x: 112, y: -84, z: 35 },
      { x: 128, y: -96, z: 35 },
      { x: 119, y: -107, z: 35 }
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
    baseAngle: 323,
    angleSpan: 5,
    rows: generateRows('1', '1', 20, 35, 0, true),
    vertices3D: [
      { x: 112, y: -84, z: 35 },
      { x: 119, y: -74, z: 35 },
      { x: 136, y: -85, z: 35 },
      { x: 128, y: -96, z: 35 }
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
    baseAngle: 88,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 9, y: 245, z: 25 },
      { x: -76, y: 233, z: 25 },
      { x: -82, y: 252, z: 25 },
      { x: 9, y: 265, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 25,
    rake: 0
  }
];

// Export section map for easy lookup
export const marinersSectionMap = new Map(
  marinersSections.map(section => [section.id, section])
);

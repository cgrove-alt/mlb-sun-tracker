// Werner Park - Comprehensive Section Data
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

export const omahastormchasersSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 280,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 7, y: -39, z: 0 },
      { x: 11, y: -38, z: 0 },
      { x: 18, y: -62, z: 10 },
      { x: 11, y: -64, z: 10 }
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
    baseAngle: 286,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 11, y: -38, z: 0 },
      { x: 15, y: -37, z: 0 },
      { x: 24, y: -60, z: 10 },
      { x: 18, y: -62, z: 10 }
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
    baseAngle: 292,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 15, y: -37, z: 0 },
      { x: 19, y: -35, z: 0 },
      { x: 31, y: -57, z: 10 },
      { x: 24, y: -60, z: 10 }
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
    baseAngle: 298,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 19, y: -35, z: 0 },
      { x: 22, y: -33, z: 0 },
      { x: 36, y: -54, z: 10 },
      { x: 31, y: -57, z: 10 }
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
    baseAngle: 304,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 22, y: -33, z: 0 },
      { x: 26, y: -31, z: 0 },
      { x: 42, y: -50, z: 10 },
      { x: 36, y: -54, z: 10 }
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
    baseAngle: 310,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 26, y: -31, z: 0 },
      { x: 29, y: -28, z: 0 },
      { x: 47, y: -45, z: 10 },
      { x: 42, y: -50, z: 10 }
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
    baseAngle: 316,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 29, y: -28, z: 0 },
      { x: 32, y: -25, z: 0 },
      { x: 51, y: -40, z: 10 },
      { x: 47, y: -45, z: 10 }
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
    baseAngle: 322,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 32, y: -25, z: 0 },
      { x: 34, y: -21, z: 0 },
      { x: 55, y: -34, z: 10 },
      { x: 51, y: -40, z: 10 }
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
    baseAngle: 328,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 34, y: -21, z: 0 },
      { x: 36, y: -18, z: 0 },
      { x: 58, y: -28, z: 10 },
      { x: 55, y: -34, z: 10 }
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
    baseAngle: 334,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 36, y: -18, z: 0 },
      { x: 38, y: -14, z: 0 },
      { x: 61, y: -22, z: 10 },
      { x: 58, y: -28, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 0,
    rake: 18
  },
  {
    id: '200',
    name: 'Lower 200',
    level: 'lower',
    baseAngle: 285,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 17, y: -63, z: 12 },
      { x: 24, y: -61, z: 12 },
      { x: 34, y: -89, z: 28 },
      { x: 25, y: -92, z: 28 }
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
    baseAngle: 291.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 24, y: -61, z: 12 },
      { x: 30, y: -58, z: 12 },
      { x: 44, y: -84, z: 28 },
      { x: 34, y: -89, z: 28 }
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
    baseAngle: 297.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 30, y: -58, z: 12 },
      { x: 36, y: -54, z: 12 },
      { x: 53, y: -79, z: 28 },
      { x: 44, y: -84, z: 28 }
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
    baseAngle: 303.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 36, y: -54, z: 12 },
      { x: 42, y: -50, z: 12 },
      { x: 61, y: -73, z: 28 },
      { x: 53, y: -79, z: 28 }
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
    baseAngle: 310,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 42, y: -50, z: 12 },
      { x: 47, y: -45, z: 12 },
      { x: 69, y: -66, z: 28 },
      { x: 61, y: -73, z: 28 }
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
    baseAngle: 316.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 47, y: -45, z: 12 },
      { x: 52, y: -40, z: 12 },
      { x: 75, y: -58, z: 28 },
      { x: 69, y: -66, z: 28 }
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
    baseAngle: 322.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 52, y: -40, z: 12 },
      { x: 56, y: -34, z: 12 },
      { x: 81, y: -49, z: 28 },
      { x: 75, y: -58, z: 28 }
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
    baseAngle: 328.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 56, y: -34, z: 12 },
      { x: 59, y: -27, z: 12 },
      { x: 86, y: -40, z: 28 },
      { x: 81, y: -49, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: '300',
    name: 'Upper 300',
    level: 'upper',
    baseAngle: 290,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 32, y: -89, z: 28 },
      { x: 43, y: -85, z: 28 },
      { x: 58, y: -116, z: 50 },
      { x: 44, y: -122, z: 50 }
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
    baseAngle: 296.66666666666674,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 43, y: -85, z: 28 },
      { x: 52, y: -79, z: 28 },
      { x: 71, y: -109, z: 50 },
      { x: 58, y: -116, z: 50 }
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
    baseAngle: 303.33333333333326,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 52, y: -79, z: 28 },
      { x: 61, y: -73, z: 28 },
      { x: 84, y: -100, z: 50 },
      { x: 71, y: -109, z: 50 }
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
    baseAngle: 310,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 61, y: -73, z: 28 },
      { x: 69, y: -65, z: 28 },
      { x: 95, y: -89, z: 50 },
      { x: 84, y: -100, z: 50 }
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
    baseAngle: 316.66666666666674,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 69, y: -65, z: 28 },
      { x: 76, y: -57, z: 28 },
      { x: 104, y: -78, z: 50 },
      { x: 95, y: -89, z: 50 }
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
    baseAngle: 323.33333333333326,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 76, y: -57, z: 28 },
      { x: 82, y: -48, z: 28 },
      { x: 113, y: -65, z: 50 },
      { x: 104, y: -78, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: 'BL-1',
    name: 'Bleachers 1',
    level: 'field',
    baseAngle: 10,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 128, y: 23, z: 5 },
      { x: 118, y: 55, z: 5 },
      { x: 150, y: 70, z: 20 },
      { x: 162, y: 29, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 5,
    rake: 18
  },
  {
    id: 'BL-2',
    name: 'Bleachers 2',
    level: 'field',
    baseAngle: 30,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 113, y: 65, z: 5 },
      { x: 92, y: 92, z: 5 },
      { x: 117, y: 117, z: 20 },
      { x: 143, y: 82, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 5,
    rake: 18
  },
  {
    id: 'BL-3',
    name: 'Bleachers 3',
    level: 'field',
    baseAngle: 250,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -44, y: -122, z: 5 },
      { x: -11, y: -130, z: 5 },
      { x: -14, y: -164, z: 20 },
      { x: -56, y: -155, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 5,
    rake: 18
  },
  {
    id: 'BL-4',
    name: 'Bleachers 4',
    level: 'field',
    baseAngle: 230,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -84, y: -100, z: 5 },
      { x: -55, y: -118, z: 5 },
      { x: -70, y: -150, z: 20 },
      { x: -106, y: -126, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 5,
    rake: 18
  },
  {
    id: 'BERM',
    name: 'Outfield Berm',
    level: 'standing',
    baseAngle: 130,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -106, y: 126, z: 10 },
      { x: -155, y: 56, z: 10 },
      { x: -179, y: 65, z: 10 },
      { x: -122, y: 146, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const omahastormchasersSectionMap = new Map(
  omahastormchasersSections.map(section => [section.id, section])
);

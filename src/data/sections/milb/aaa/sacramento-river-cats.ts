// Sutter Health Park - Comprehensive Section Data
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

export const sacramentorivercatsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
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
    id: '101',
    name: 'Field 101',
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
    id: '102',
    name: 'Field 102',
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
    id: '103',
    name: 'Field 103',
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
    id: '104',
    name: 'Field 104',
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
    id: '105',
    name: 'Field 105',
    level: 'field',
    baseAngle: 340,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 38, y: -14, z: 0 },
      { x: 39, y: -10, z: 0 },
      { x: 63, y: -16, z: 10 },
      { x: 61, y: -22, z: 10 }
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
    baseAngle: 346,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: -10, z: 0 },
      { x: 40, y: -6, z: 0 },
      { x: 64, y: -9, z: 10 },
      { x: 63, y: -16, z: 10 }
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
    baseAngle: 352,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: -6, z: 0 },
      { x: 40, y: -1, z: 0 },
      { x: 65, y: -2, z: 10 },
      { x: 64, y: -9, z: 10 }
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
    baseAngle: 358,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: -1, z: 0 },
      { x: 40, y: 3, z: 0 },
      { x: 65, y: 5, z: 10 },
      { x: 65, y: -2, z: 10 }
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
    baseAngle: 4,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: 3, z: 0 },
      { x: 39, y: 7, z: 0 },
      { x: 64, y: 11, z: 10 },
      { x: 65, y: 5, z: 10 }
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
    baseAngle: 315,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 46, y: -46, z: 12 },
      { x: 51, y: -41, z: 12 },
      { x: 74, y: -59, z: 28 },
      { x: 67, y: -67, z: 28 }
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
    baseAngle: 321.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 51, y: -41, z: 12 },
      { x: 55, y: -35, z: 12 },
      { x: 80, y: -51, z: 28 },
      { x: 74, y: -59, z: 28 }
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
    baseAngle: 327.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 55, y: -35, z: 12 },
      { x: 58, y: -29, z: 12 },
      { x: 85, y: -42, z: 28 },
      { x: 80, y: -51, z: 28 }
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
    baseAngle: 333.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 58, y: -29, z: 12 },
      { x: 61, y: -22, z: 12 },
      { x: 89, y: -32, z: 28 },
      { x: 85, y: -42, z: 28 }
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
    baseAngle: 340,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 61, y: -22, z: 12 },
      { x: 63, y: -15, z: 12 },
      { x: 92, y: -23, z: 28 },
      { x: 89, y: -32, z: 28 }
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
    baseAngle: 346.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 63, y: -15, z: 12 },
      { x: 64, y: -8, z: 12 },
      { x: 94, y: -12, z: 28 },
      { x: 92, y: -23, z: 28 }
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
    baseAngle: 352.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 64, y: -8, z: 12 },
      { x: 65, y: -1, z: 12 },
      { x: 95, y: -2, z: 28 },
      { x: 94, y: -12, z: 28 }
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
    baseAngle: 358.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 65, y: -1, z: 12 },
      { x: 65, y: 6, z: 12 },
      { x: 95, y: 8, z: 28 },
      { x: 95, y: -2, z: 28 }
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
    baseAngle: 320,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 73, y: -61, z: 28 },
      { x: 79, y: -52, z: 28 },
      { x: 109, y: -71, z: 50 },
      { x: 100, y: -84, z: 50 }
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
    baseAngle: 326.66666666666674,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 79, y: -52, z: 28 },
      { x: 85, y: -43, z: 28 },
      { x: 116, y: -58, z: 50 },
      { x: 109, y: -71, z: 50 }
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
    baseAngle: 333.33333333333326,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 85, y: -43, z: 28 },
      { x: 89, y: -32, z: 28 },
      { x: 122, y: -44, z: 50 },
      { x: 116, y: -58, z: 50 }
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
    baseAngle: 340,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 89, y: -32, z: 28 },
      { x: 92, y: -22, z: 28 },
      { x: 126, y: -30, z: 50 },
      { x: 122, y: -44, z: 50 }
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
    baseAngle: 346.66666666666674,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 92, y: -22, z: 28 },
      { x: 94, y: -11, z: 28 },
      { x: 129, y: -15, z: 50 },
      { x: 126, y: -30, z: 50 }
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
    baseAngle: 353.33333333333326,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 94, y: -11, z: 28 },
      { x: 95, y: -0, z: 28 },
      { x: 130, y: -0, z: 50 },
      { x: 129, y: -15, z: 50 }
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
    baseAngle: 40,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 100, y: 84, z: 5 },
      { x: 75, y: 106, z: 5 },
      { x: 95, y: 135, z: 20 },
      { x: 126, y: 106, z: 20 }
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
    baseAngle: 60,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 65, y: 113, z: 5 },
      { x: 34, y: 126, z: 5 },
      { x: 43, y: 159, z: 20 },
      { x: 83, y: 143, z: 20 }
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
    baseAngle: 280,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 23, y: -128, z: 5 },
      { x: 55, y: -118, z: 5 },
      { x: 70, y: -150, z: 20 },
      { x: 29, y: -162, z: 20 }
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
    baseAngle: 260,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -23, y: -128, z: 5 },
      { x: 11, y: -130, z: 5 },
      { x: 14, y: -164, z: 20 },
      { x: -29, y: -162, z: 20 }
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
    baseAngle: 160,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -155, y: 56, z: 10 },
      { x: -162, y: -29, z: 10 },
      { x: -187, y: -33, z: 10 },
      { x: -179, y: 65, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const sacramentorivercatsSectionMap = new Map(
  sacramentorivercatsSections.map(section => [section.id, section])
);

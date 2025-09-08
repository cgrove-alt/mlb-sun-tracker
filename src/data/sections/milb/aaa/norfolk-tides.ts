// Harbor Park - Comprehensive Section Data
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

export const norfolktidesSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 295,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 17, y: -36, z: 0 },
      { x: 21, y: -34, z: 0 },
      { x: 33, y: -56, z: 10 },
      { x: 27, y: -59, z: 10 }
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
    baseAngle: 301,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 21, y: -34, z: 0 },
      { x: 24, y: -32, z: 0 },
      { x: 39, y: -52, z: 10 },
      { x: 33, y: -56, z: 10 }
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
    baseAngle: 307,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 24, y: -32, z: 0 },
      { x: 27, y: -29, z: 0 },
      { x: 44, y: -48, z: 10 },
      { x: 39, y: -52, z: 10 }
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
    baseAngle: 313,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 27, y: -29, z: 0 },
      { x: 30, y: -26, z: 0 },
      { x: 49, y: -43, z: 10 },
      { x: 44, y: -48, z: 10 }
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
    baseAngle: 319,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 30, y: -26, z: 0 },
      { x: 33, y: -23, z: 0 },
      { x: 53, y: -37, z: 10 },
      { x: 49, y: -43, z: 10 }
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
    baseAngle: 325,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 33, y: -23, z: 0 },
      { x: 35, y: -19, z: 0 },
      { x: 57, y: -32, z: 10 },
      { x: 53, y: -37, z: 10 }
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
    baseAngle: 331,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 35, y: -19, z: 0 },
      { x: 37, y: -16, z: 0 },
      { x: 60, y: -25, z: 10 },
      { x: 57, y: -32, z: 10 }
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
    baseAngle: 337,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 37, y: -16, z: 0 },
      { x: 38, y: -12, z: 0 },
      { x: 62, y: -19, z: 10 },
      { x: 60, y: -25, z: 10 }
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
    baseAngle: 343,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 38, y: -12, z: 0 },
      { x: 39, y: -8, z: 0 },
      { x: 64, y: -12, z: 10 },
      { x: 62, y: -19, z: 10 }
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
    baseAngle: 349,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: -8, z: 0 },
      { x: 40, y: -3, z: 0 },
      { x: 65, y: -6, z: 10 },
      { x: 64, y: -12, z: 10 }
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
    baseAngle: 300,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 33, y: -56, z: 12 },
      { x: 38, y: -52, z: 12 },
      { x: 56, y: -77, z: 28 },
      { x: 48, y: -82, z: 28 }
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
    baseAngle: 306.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 38, y: -52, z: 12 },
      { x: 44, y: -48, z: 12 },
      { x: 64, y: -70, z: 28 },
      { x: 56, y: -77, z: 28 }
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
    baseAngle: 312.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 44, y: -48, z: 12 },
      { x: 49, y: -43, z: 12 },
      { x: 71, y: -63, z: 28 },
      { x: 64, y: -70, z: 28 }
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
    baseAngle: 318.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 49, y: -43, z: 12 },
      { x: 53, y: -37, z: 12 },
      { x: 78, y: -54, z: 28 },
      { x: 71, y: -63, z: 28 }
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
    baseAngle: 325,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 53, y: -37, z: 12 },
      { x: 57, y: -31, z: 12 },
      { x: 83, y: -46, z: 28 },
      { x: 78, y: -54, z: 28 }
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
    baseAngle: 331.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 57, y: -31, z: 12 },
      { x: 60, y: -25, z: 12 },
      { x: 88, y: -36, z: 28 },
      { x: 83, y: -46, z: 28 }
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
    baseAngle: 337.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 60, y: -25, z: 12 },
      { x: 62, y: -18, z: 12 },
      { x: 91, y: -27, z: 28 },
      { x: 88, y: -36, z: 28 }
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
    baseAngle: 343.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 62, y: -18, z: 12 },
      { x: 64, y: -11, z: 12 },
      { x: 94, y: -16, z: 28 },
      { x: 91, y: -27, z: 28 }
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
    baseAngle: 305,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 54, y: -78, z: 28 },
      { x: 63, y: -71, z: 28 },
      { x: 86, y: -97, z: 50 },
      { x: 75, y: -106, z: 50 }
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
    baseAngle: 311.66666666666674,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 63, y: -71, z: 28 },
      { x: 71, y: -63, z: 28 },
      { x: 97, y: -86, z: 50 },
      { x: 86, y: -97, z: 50 }
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
    baseAngle: 318.33333333333326,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 71, y: -63, z: 28 },
      { x: 78, y: -54, z: 28 },
      { x: 106, y: -75, z: 50 },
      { x: 97, y: -86, z: 50 }
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
    baseAngle: 325,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 78, y: -54, z: 28 },
      { x: 84, y: -45, z: 28 },
      { x: 114, y: -62, z: 50 },
      { x: 106, y: -75, z: 50 }
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
    baseAngle: 331.66666666666674,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 84, y: -45, z: 28 },
      { x: 88, y: -35, z: 28 },
      { x: 121, y: -48, z: 50 },
      { x: 114, y: -62, z: 50 }
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
    baseAngle: 338.33333333333326,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 88, y: -35, z: 28 },
      { x: 92, y: -25, z: 28 },
      { x: 126, y: -34, z: 50 },
      { x: 121, y: -48, z: 50 }
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
    baseAngle: 25,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 118, y: 55, z: 5 },
      { x: 100, y: 84, z: 5 },
      { x: 126, y: 106, z: 20 },
      { x: 150, y: 70, z: 20 }
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
    baseAngle: 45,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 92, y: 92, z: 5 },
      { x: 65, y: 113, z: 5 },
      { x: 83, y: 143, z: 20 },
      { x: 117, y: 117, z: 20 }
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
    baseAngle: 265,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -11, y: -130, z: 5 },
      { x: 23, y: -128, z: 5 },
      { x: 29, y: -162, z: 20 },
      { x: -14, y: -164, z: 20 }
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
    baseAngle: 245,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -55, y: -118, z: 5 },
      { x: -23, y: -128, z: 5 },
      { x: -29, y: -162, z: 20 },
      { x: -70, y: -150, z: 20 }
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
    baseAngle: 145,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -135, y: 95, z: 10 },
      { x: -164, y: 14, z: 10 },
      { x: -189, y: 17, z: 10 },
      { x: -156, y: 109, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const norfolktidesSectionMap = new Map(
  norfolktidesSections.map(section => [section.id, section])
);

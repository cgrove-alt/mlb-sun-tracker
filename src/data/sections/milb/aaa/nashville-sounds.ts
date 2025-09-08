// First Horizon Park - Comprehensive Section Data
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

export const nashvillesoundsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: 0, z: 0 },
      { x: 40, y: 4, z: 0 },
      { x: 65, y: 7, z: 10 },
      { x: 65, y: 0, z: 10 }
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
    baseAngle: 6,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: 4, z: 0 },
      { x: 39, y: 8, z: 0 },
      { x: 64, y: 14, z: 10 },
      { x: 65, y: 7, z: 10 }
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
    baseAngle: 12,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: 8, z: 0 },
      { x: 38, y: 12, z: 0 },
      { x: 62, y: 20, z: 10 },
      { x: 64, y: 14, z: 10 }
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
    baseAngle: 18,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 38, y: 12, z: 0 },
      { x: 37, y: 16, z: 0 },
      { x: 59, y: 26, z: 10 },
      { x: 62, y: 20, z: 10 }
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
    baseAngle: 24,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 37, y: 16, z: 0 },
      { x: 35, y: 20, z: 0 },
      { x: 56, y: 32, z: 10 },
      { x: 59, y: 26, z: 10 }
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
    baseAngle: 30,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 35, y: 20, z: 0 },
      { x: 32, y: 24, z: 0 },
      { x: 53, y: 38, z: 10 },
      { x: 56, y: 32, z: 10 }
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
    baseAngle: 36,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 32, y: 24, z: 0 },
      { x: 30, y: 27, z: 0 },
      { x: 48, y: 43, z: 10 },
      { x: 53, y: 38, z: 10 }
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
    baseAngle: 42,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 30, y: 27, z: 0 },
      { x: 27, y: 30, z: 0 },
      { x: 43, y: 48, z: 10 },
      { x: 48, y: 43, z: 10 }
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
    baseAngle: 48,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 27, y: 30, z: 0 },
      { x: 24, y: 32, z: 0 },
      { x: 38, y: 53, z: 10 },
      { x: 43, y: 48, z: 10 }
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
    baseAngle: 54,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 24, y: 32, z: 0 },
      { x: 20, y: 35, z: 0 },
      { x: 33, y: 56, z: 10 },
      { x: 38, y: 53, z: 10 }
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
    baseAngle: 5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 65, y: 6, z: 12 },
      { x: 64, y: 13, z: 12 },
      { x: 93, y: 19, z: 28 },
      { x: 95, y: 8, z: 28 }
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
    baseAngle: 11.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 64, y: 13, z: 12 },
      { x: 62, y: 20, z: 12 },
      { x: 91, y: 29, z: 28 },
      { x: 93, y: 19, z: 28 }
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
    baseAngle: 17.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 62, y: 20, z: 12 },
      { x: 59, y: 26, z: 12 },
      { x: 87, y: 38, z: 28 },
      { x: 91, y: 29, z: 28 }
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
    baseAngle: 23.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 59, y: 26, z: 12 },
      { x: 56, y: 32, z: 12 },
      { x: 82, y: 47, z: 28 },
      { x: 87, y: 38, z: 28 }
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
    baseAngle: 30,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 56, y: 32, z: 12 },
      { x: 52, y: 38, z: 12 },
      { x: 77, y: 56, z: 28 },
      { x: 82, y: 47, z: 28 }
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
    baseAngle: 36.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 52, y: 38, z: 12 },
      { x: 48, y: 44, z: 12 },
      { x: 70, y: 64, z: 28 },
      { x: 77, y: 56, z: 28 }
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
    baseAngle: 42.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 48, y: 44, z: 12 },
      { x: 43, y: 49, z: 12 },
      { x: 63, y: 71, z: 28 },
      { x: 70, y: 64, z: 28 }
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
    baseAngle: 48.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 43, y: 49, z: 12 },
      { x: 37, y: 53, z: 12 },
      { x: 54, y: 78, z: 28 },
      { x: 63, y: 71, z: 28 }
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
    baseAngle: 10,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 94, y: 16, z: 28 },
      { x: 91, y: 27, z: 28 },
      { x: 125, y: 37, z: 50 },
      { x: 128, y: 23, z: 50 }
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
    baseAngle: 16.666666666666686,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 91, y: 27, z: 28 },
      { x: 87, y: 38, z: 28 },
      { x: 119, y: 51, z: 50 },
      { x: 125, y: 37, z: 50 }
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
    baseAngle: 23.333333333333314,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 87, y: 38, z: 28 },
      { x: 82, y: 47, z: 28 },
      { x: 113, y: 65, z: 50 },
      { x: 119, y: 51, z: 50 }
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
    baseAngle: 30,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 82, y: 47, z: 28 },
      { x: 76, y: 57, z: 28 },
      { x: 104, y: 78, z: 50 },
      { x: 113, y: 65, z: 50 }
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
    baseAngle: 36.666666666666686,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 76, y: 57, z: 28 },
      { x: 69, y: 65, z: 28 },
      { x: 95, y: 89, z: 50 },
      { x: 104, y: 78, z: 50 }
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
    baseAngle: 43.333333333333314,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 69, y: 65, z: 28 },
      { x: 61, y: 73, z: 28 },
      { x: 84, y: 100, z: 50 },
      { x: 95, y: 89, z: 50 }
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
    baseAngle: 90,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 0, y: 130, z: 5 },
      { x: -34, y: 126, z: 5 },
      { x: -43, y: 159, z: 20 },
      { x: 0, y: 165, z: 20 }
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
    baseAngle: 110,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -44, y: 122, z: 5 },
      { x: -75, y: 106, z: 5 },
      { x: -95, y: 135, z: 20 },
      { x: -56, y: 155, z: 20 }
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
    baseAngle: 330,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 113, y: -65, z: 5 },
      { x: 126, y: -34, z: 5 },
      { x: 159, y: -43, z: 20 },
      { x: 143, y: -83, z: 20 }
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
    baseAngle: 310,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 84, y: -100, z: 5 },
      { x: 106, y: -75, z: 5 },
      { x: 135, y: -95, z: 20 },
      { x: 106, y: -126, z: 20 }
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
    baseAngle: 210,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -143, y: -83, z: 10 },
      { x: -83, y: -143, z: 10 },
      { x: -95, y: -165, z: 10 },
      { x: -165, y: -95, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const nashvillesoundsSectionMap = new Map(
  nashvillesoundsSections.map(section => [section.id, section])
);

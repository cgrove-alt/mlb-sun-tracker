// Truist Field - Comprehensive Section Data
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

export const charlotteknightsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 15,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: 10, z: 0 },
      { x: 37, y: 14, z: 0 },
      { x: 61, y: 23, z: 10 },
      { x: 63, y: 17, z: 10 }
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
    baseAngle: 21,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 37, y: 14, z: 0 },
      { x: 36, y: 18, z: 0 },
      { x: 58, y: 30, z: 10 },
      { x: 61, y: 23, z: 10 }
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
    baseAngle: 27,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 36, y: 18, z: 0 },
      { x: 34, y: 22, z: 0 },
      { x: 55, y: 35, z: 10 },
      { x: 58, y: 30, z: 10 }
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
    baseAngle: 33,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 34, y: 22, z: 0 },
      { x: 31, y: 25, z: 0 },
      { x: 51, y: 41, z: 10 },
      { x: 55, y: 35, z: 10 }
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
    baseAngle: 39,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 31, y: 25, z: 0 },
      { x: 28, y: 28, z: 0 },
      { x: 46, y: 46, z: 10 },
      { x: 51, y: 41, z: 10 }
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
    baseAngle: 45,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 28, y: 28, z: 0 },
      { x: 25, y: 31, z: 0 },
      { x: 41, y: 51, z: 10 },
      { x: 46, y: 46, z: 10 }
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
    baseAngle: 51,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 25, y: 31, z: 0 },
      { x: 22, y: 34, z: 0 },
      { x: 35, y: 55, z: 10 },
      { x: 41, y: 51, z: 10 }
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
    baseAngle: 57,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 22, y: 34, z: 0 },
      { x: 18, y: 36, z: 0 },
      { x: 30, y: 58, z: 10 },
      { x: 35, y: 55, z: 10 }
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
    baseAngle: 63,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 18, y: 36, z: 0 },
      { x: 14, y: 37, z: 0 },
      { x: 23, y: 61, z: 10 },
      { x: 30, y: 58, z: 10 }
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
    baseAngle: 69,
    angleSpan: 6,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 14, y: 37, z: 0 },
      { x: 10, y: 39, z: 0 },
      { x: 17, y: 63, z: 10 },
      { x: 23, y: 61, z: 10 }
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
    baseAngle: 20,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 61, y: 22, z: 12 },
      { x: 58, y: 29, z: 12 },
      { x: 85, y: 42, z: 28 },
      { x: 89, y: 32, z: 28 }
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
    baseAngle: 26.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 58, y: 29, z: 12 },
      { x: 55, y: 35, z: 12 },
      { x: 80, y: 51, z: 28 },
      { x: 85, y: 42, z: 28 }
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
    baseAngle: 32.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 55, y: 35, z: 12 },
      { x: 51, y: 41, z: 12 },
      { x: 74, y: 59, z: 28 },
      { x: 80, y: 51, z: 28 }
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
    baseAngle: 38.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 51, y: 41, z: 12 },
      { x: 46, y: 46, z: 12 },
      { x: 67, y: 67, z: 28 },
      { x: 74, y: 59, z: 28 }
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
    baseAngle: 45,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 46, y: 46, z: 12 },
      { x: 41, y: 51, z: 12 },
      { x: 59, y: 74, z: 28 },
      { x: 67, y: 67, z: 28 }
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
    baseAngle: 51.25,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 41, y: 51, z: 12 },
      { x: 35, y: 55, z: 12 },
      { x: 51, y: 80, z: 28 },
      { x: 59, y: 74, z: 28 }
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
    baseAngle: 57.5,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 35, y: 55, z: 12 },
      { x: 29, y: 58, z: 12 },
      { x: 42, y: 85, z: 28 },
      { x: 51, y: 80, z: 28 }
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
    baseAngle: 63.75,
    angleSpan: 6.25,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 29, y: 58, z: 12 },
      { x: 22, y: 61, z: 12 },
      { x: 32, y: 89, z: 28 },
      { x: 42, y: 85, z: 28 }
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
    baseAngle: 25,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 86, y: 40, z: 28 },
      { x: 81, y: 50, z: 28 },
      { x: 111, y: 68, z: 50 },
      { x: 118, y: 55, z: 50 }
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
    baseAngle: 31.666666666666686,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 81, y: 50, z: 28 },
      { x: 75, y: 59, z: 28 },
      { x: 102, y: 81, z: 50 },
      { x: 111, y: 68, z: 50 }
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
    baseAngle: 38.333333333333314,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 75, y: 59, z: 28 },
      { x: 67, y: 67, z: 28 },
      { x: 92, y: 92, z: 50 },
      { x: 102, y: 81, z: 50 }
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
    baseAngle: 45,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 67, y: 67, z: 28 },
      { x: 59, y: 75, z: 28 },
      { x: 81, y: 102, z: 50 },
      { x: 92, y: 92, z: 50 }
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
    baseAngle: 51.666666666666686,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 59, y: 75, z: 28 },
      { x: 50, y: 81, z: 28 },
      { x: 68, y: 111, z: 50 },
      { x: 81, y: 102, z: 50 }
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
    baseAngle: 58.333333333333314,
    angleSpan: 6.666666666666667,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 50, y: 81, z: 28 },
      { x: 40, y: 86, z: 28 },
      { x: 55, y: 118, z: 50 },
      { x: 68, y: 111, z: 50 }
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
    baseAngle: 105,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -34, y: 126, z: 5 },
      { x: -65, y: 113, z: 5 },
      { x: -82, y: 143, z: 20 },
      { x: -43, y: 159, z: 20 }
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
    baseAngle: 125,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -75, y: 106, z: 5 },
      { x: -100, y: 84, z: 5 },
      { x: -126, y: 106, z: 20 },
      { x: -95, y: 135, z: 20 }
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
    baseAngle: 345,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 126, y: -34, z: 5 },
      { x: 130, y: -0, z: 5 },
      { x: 165, y: -0, z: 20 },
      { x: 159, y: -43, z: 20 }
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
    baseAngle: 325,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 106, y: -75, z: 5 },
      { x: 122, y: -44, z: 5 },
      { x: 155, y: -56, z: 20 },
      { x: 135, y: -95, z: 20 }
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
    baseAngle: 225,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -117, y: -117, z: 10 },
      { x: -43, y: -159, z: 10 },
      { x: -49, y: -184, z: 10 },
      { x: -134, y: -134, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const charlotteknightsSectionMap = new Map(
  charlotteknightsSections.map(section => [section.id, section])
);

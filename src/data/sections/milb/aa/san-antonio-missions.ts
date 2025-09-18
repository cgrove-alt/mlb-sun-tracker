// Nelson W. Wolff Municipal Stadium - Comprehensive Section Data
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

export const sanantoniomissionsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 285,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 10, y: -39, z: 0 },
      { x: 15, y: -37, z: 0 },
      { x: 25, y: -60, z: 10 },
      { x: 17, y: -63, z: 10 }
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
    baseAngle: 292.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 15, y: -37, z: 0 },
      { x: 20, y: -35, z: 0 },
      { x: 33, y: -56, z: 10 },
      { x: 25, y: -60, z: 10 }
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
    baseAngle: 300,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 20, y: -35, z: 0 },
      { x: 24, y: -32, z: 0 },
      { x: 40, y: -52, z: 10 },
      { x: 33, y: -56, z: 10 }
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
    baseAngle: 307.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 24, y: -32, z: 0 },
      { x: 28, y: -28, z: 0 },
      { x: 46, y: -46, z: 10 },
      { x: 40, y: -52, z: 10 }
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
    baseAngle: 315,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 28, y: -28, z: 0 },
      { x: 32, y: -24, z: 0 },
      { x: 52, y: -40, z: 10 },
      { x: 46, y: -46, z: 10 }
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
    baseAngle: 322.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 32, y: -24, z: 0 },
      { x: 35, y: -20, z: 0 },
      { x: 56, y: -33, z: 10 },
      { x: 52, y: -40, z: 10 }
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
    baseAngle: 330,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 35, y: -20, z: 0 },
      { x: 37, y: -15, z: 0 },
      { x: 60, y: -25, z: 10 },
      { x: 56, y: -33, z: 10 }
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
    baseAngle: 337.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 37, y: -15, z: 0 },
      { x: 39, y: -10, z: 0 },
      { x: 63, y: -17, z: 10 },
      { x: 60, y: -25, z: 10 }
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
    baseAngle: 290,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 22, y: -61, z: 12 },
      { x: 31, y: -57, z: 12 },
      { x: 45, y: -84, z: 28 },
      { x: 32, y: -89, z: 28 }
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
    baseAngle: 298.33333333333326,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 31, y: -57, z: 12 },
      { x: 39, y: -52, z: 12 },
      { x: 57, y: -76, z: 28 },
      { x: 45, y: -84, z: 28 }
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
    baseAngle: 306.66666666666674,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 39, y: -52, z: 12 },
      { x: 46, y: -46, z: 12 },
      { x: 67, y: -67, z: 28 },
      { x: 57, y: -76, z: 28 }
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
    baseAngle: 315,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 46, y: -46, z: 12 },
      { x: 52, y: -39, z: 12 },
      { x: 76, y: -57, z: 28 },
      { x: 67, y: -67, z: 28 }
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
    baseAngle: 323.33333333333326,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 52, y: -39, z: 12 },
      { x: 57, y: -31, z: 12 },
      { x: 84, y: -45, z: 28 },
      { x: 76, y: -57, z: 28 }
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
    baseAngle: 331.66666666666674,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 57, y: -31, z: 12 },
      { x: 61, y: -22, z: 12 },
      { x: 89, y: -32, z: 28 },
      { x: 84, y: -45, z: 28 }
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
    baseAngle: 295,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 40, y: -86, z: 28 },
      { x: 54, y: -78, z: 28 },
      { x: 75, y: -106, z: 50 },
      { x: 55, y: -118, z: 50 }
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
    baseAngle: 305,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 54, y: -78, z: 28 },
      { x: 67, y: -67, z: 28 },
      { x: 92, y: -92, z: 50 },
      { x: 75, y: -106, z: 50 }
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
    baseAngle: 315,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 67, y: -67, z: 28 },
      { x: 78, y: -54, z: 28 },
      { x: 106, y: -75, z: 50 },
      { x: 92, y: -92, z: 50 }
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
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 78, y: -54, z: 28 },
      { x: 86, y: -40, z: 28 },
      { x: 118, y: -55, z: 50 },
      { x: 106, y: -75, z: 50 }
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
    baseAngle: 15,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 126, y: 34, z: 5 },
      { x: 113, y: 65, z: 5 },
      { x: 143, y: 82, z: 20 },
      { x: 159, y: 43, z: 20 }
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
    baseAngle: 35,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 106, y: 75, z: 5 },
      { x: 84, y: 100, z: 5 },
      { x: 106, y: 126, z: 20 },
      { x: 135, y: 95, z: 20 }
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
    baseAngle: 255,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -34, y: -126, z: 5 },
      { x: -0, y: -130, z: 5 },
      { x: -0, y: -165, z: 20 },
      { x: -43, y: -159, z: 20 }
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
    baseAngle: 235,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -75, y: -106, z: 5 },
      { x: -44, y: -122, z: 5 },
      { x: -56, y: -155, z: 20 },
      { x: -95, y: -135, z: 20 }
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
    baseAngle: 135,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -117, y: 117, z: 10 },
      { x: -159, y: 43, z: 10 },
      { x: -184, y: 49, z: 10 },
      { x: -134, y: 134, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const sanantoniomissionsSectionMap = new Map(
  sanantoniomissionsSections.map(section => [section.id, section])
);

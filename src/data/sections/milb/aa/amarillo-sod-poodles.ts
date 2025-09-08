// HODGETOWN - Comprehensive Section Data
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

export const amarillosodpoodlesSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 355,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: -3, z: 0 },
      { x: 40, y: 2, z: 0 },
      { x: 65, y: 3, z: 10 },
      { x: 65, y: -6, z: 10 }
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
    baseAngle: 2.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: 2, z: 0 },
      { x: 39, y: 7, z: 0 },
      { x: 64, y: 11, z: 10 },
      { x: 65, y: 3, z: 10 }
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
    baseAngle: 10,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: 7, z: 0 },
      { x: 38, y: 12, z: 0 },
      { x: 62, y: 20, z: 10 },
      { x: 64, y: 11, z: 10 }
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
    baseAngle: 17.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 38, y: 12, z: 0 },
      { x: 36, y: 17, z: 0 },
      { x: 59, y: 27, z: 10 },
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
    baseAngle: 25,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 36, y: 17, z: 0 },
      { x: 34, y: 21, z: 0 },
      { x: 55, y: 35, z: 10 },
      { x: 59, y: 27, z: 10 }
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
    baseAngle: 32.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 34, y: 21, z: 0 },
      { x: 31, y: 26, z: 0 },
      { x: 50, y: 42, z: 10 },
      { x: 55, y: 35, z: 10 }
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
    baseAngle: 40,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 31, y: 26, z: 0 },
      { x: 27, y: 29, z: 0 },
      { x: 44, y: 48, z: 10 },
      { x: 50, y: 42, z: 10 }
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
    baseAngle: 47.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 27, y: 29, z: 0 },
      { x: 23, y: 33, z: 0 },
      { x: 37, y: 53, z: 10 },
      { x: 44, y: 48, z: 10 }
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
    baseAngle: 0,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 65, y: 0, z: 12 },
      { x: 64, y: 9, z: 12 },
      { x: 94, y: 14, z: 28 },
      { x: 95, y: 0, z: 28 }
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
    baseAngle: 8.333333333333314,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 64, y: 9, z: 12 },
      { x: 62, y: 19, z: 12 },
      { x: 91, y: 27, z: 28 },
      { x: 94, y: 14, z: 28 }
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
    baseAngle: 16.666666666666686,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 62, y: 19, z: 12 },
      { x: 59, y: 27, z: 12 },
      { x: 86, y: 40, z: 28 },
      { x: 91, y: 27, z: 28 }
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
    baseAngle: 25,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 59, y: 27, z: 12 },
      { x: 54, y: 36, z: 12 },
      { x: 79, y: 52, z: 28 },
      { x: 86, y: 40, z: 28 }
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
    baseAngle: 33.333333333333314,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 54, y: 36, z: 12 },
      { x: 49, y: 43, z: 12 },
      { x: 71, y: 63, z: 28 },
      { x: 79, y: 52, z: 28 }
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
    baseAngle: 41.666666666666686,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 49, y: 43, z: 12 },
      { x: 42, y: 50, z: 12 },
      { x: 61, y: 73, z: 28 },
      { x: 71, y: 63, z: 28 }
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
    baseAngle: 5,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 95, y: 8, z: 28 },
      { x: 92, y: 25, z: 28 },
      { x: 126, y: 34, z: 50 },
      { x: 130, y: 11, z: 50 }
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
    baseAngle: 15,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 92, y: 25, z: 28 },
      { x: 86, y: 40, z: 28 },
      { x: 118, y: 55, z: 50 },
      { x: 126, y: 34, z: 50 }
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
    baseAngle: 25,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 86, y: 40, z: 28 },
      { x: 78, y: 54, z: 28 },
      { x: 106, y: 75, z: 50 },
      { x: 118, y: 55, z: 50 }
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
    baseAngle: 35,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 78, y: 54, z: 28 },
      { x: 67, y: 67, z: 28 },
      { x: 92, y: 92, z: 50 },
      { x: 106, y: 75, z: 50 }
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
    baseAngle: 85,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 11, y: 130, z: 5 },
      { x: -23, y: 128, z: 5 },
      { x: -29, y: 162, z: 20 },
      { x: 14, y: 164, z: 20 }
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
    id: 'BL-3',
    name: 'Bleachers 3',
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
    id: 'BL-4',
    name: 'Bleachers 4',
    level: 'field',
    baseAngle: 305,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 75, y: -106, z: 5 },
      { x: 100, y: -84, z: 5 },
      { x: 126, y: -106, z: 20 },
      { x: 95, y: -135, z: 20 }
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
    baseAngle: 205,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -150, y: -70, z: 10 },
      { x: -95, y: -135, z: 10 },
      { x: -109, y: -156, z: 10 },
      { x: -172, y: -80, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const amarillosodpoodlesSectionMap = new Map(
  amarillosodpoodlesSections.map(section => [section.id, section])
);

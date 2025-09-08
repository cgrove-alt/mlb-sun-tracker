// Riverfront Stadium - Comprehensive Section Data
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

export const wichitawindsurgeSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 340,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 38, y: -14, z: 0 },
      { x: 39, y: -9, z: 0 },
      { x: 63, y: -14, z: 10 },
      { x: 61, y: -22, z: 10 }
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
    baseAngle: 347.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: -9, z: 0 },
      { x: 40, y: -3, z: 0 },
      { x: 65, y: -6, z: 10 },
      { x: 63, y: -14, z: 10 }
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
    id: '103',
    name: 'Field 103',
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
    id: '104',
    name: 'Field 104',
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
    id: '105',
    name: 'Field 105',
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
    id: '106',
    name: 'Field 106',
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
    id: '107',
    name: 'Field 107',
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
    id: '200',
    name: 'Lower 200',
    level: 'lower',
    baseAngle: 345,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 63, y: -17, z: 12 },
      { x: 65, y: -8, z: 12 },
      { x: 94, y: -11, z: 28 },
      { x: 92, y: -25, z: 28 }
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
    baseAngle: 353.3333333333333,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 65, y: -8, z: 12 },
      { x: 65, y: 2, z: 12 },
      { x: 95, y: 3, z: 28 },
      { x: 94, y: -11, z: 28 }
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
    baseAngle: 1.6666666666666856,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 65, y: 2, z: 12 },
      { x: 64, y: 11, z: 12 },
      { x: 94, y: 16, z: 28 },
      { x: 95, y: 3, z: 28 }
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
    baseAngle: 10,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 64, y: 11, z: 12 },
      { x: 62, y: 20, z: 12 },
      { x: 90, y: 30, z: 28 },
      { x: 94, y: 16, z: 28 }
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
    baseAngle: 18.333333333333314,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 62, y: 20, z: 12 },
      { x: 58, y: 29, z: 12 },
      { x: 85, y: 43, z: 28 },
      { x: 90, y: 30, z: 28 }
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
    baseAngle: 26.666666666666686,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 58, y: 29, z: 12 },
      { x: 53, y: 37, z: 12 },
      { x: 78, y: 54, z: 28 },
      { x: 85, y: 43, z: 28 }
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
    baseAngle: 350,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 94, y: -16, z: 28 },
      { x: 95, y: -0, z: 28 },
      { x: 130, y: -0, z: 50 },
      { x: 128, y: -23, z: 50 }
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
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 95, y: 0, z: 28 },
      { x: 94, y: 16, z: 28 },
      { x: 128, y: 23, z: 50 },
      { x: 130, y: 0, z: 50 }
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
    baseAngle: 10,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 94, y: 16, z: 28 },
      { x: 89, y: 32, z: 28 },
      { x: 122, y: 44, z: 50 },
      { x: 128, y: 23, z: 50 }
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
    baseAngle: 20,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: 89, y: 32, z: 28 },
      { x: 82, y: 47, z: 28 },
      { x: 113, y: 65, z: 50 },
      { x: 122, y: 44, z: 50 }
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
    baseAngle: 70,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 44, y: 122, z: 5 },
      { x: 11, y: 130, z: 5 },
      { x: 14, y: 164, z: 20 },
      { x: 56, y: 155, z: 20 }
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
    id: 'BL-3',
    name: 'Bleachers 3',
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
    id: 'BL-4',
    name: 'Bleachers 4',
    level: 'field',
    baseAngle: 290,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 44, y: -122, z: 5 },
      { x: 75, y: -106, z: 5 },
      { x: 95, y: -135, z: 20 },
      { x: 56, y: -155, z: 20 }
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
    baseAngle: 190,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -162, y: -29, z: 10 },
      { x: -126, y: -106, z: 10 },
      { x: -146, y: -122, z: 10 },
      { x: -187, y: -33, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const wichitawindsurgeSectionMap = new Map(
  wichitawindsurgeSections.map(section => [section.id, section])
);

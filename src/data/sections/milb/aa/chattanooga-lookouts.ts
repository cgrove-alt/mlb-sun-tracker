// AT&T Field - Comprehensive Section Data
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

export const chattanoogalookoutsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 85,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 3, y: 40, z: 0 },
      { x: -2, y: 40, z: 0 },
      { x: -3, y: 65, z: 10 },
      { x: 6, y: 65, z: 10 }
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
    baseAngle: 92.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -2, y: 40, z: 0 },
      { x: -7, y: 39, z: 0 },
      { x: -11, y: 64, z: 10 },
      { x: -3, y: 65, z: 10 }
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
    baseAngle: 100,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -7, y: 39, z: 0 },
      { x: -12, y: 38, z: 0 },
      { x: -20, y: 62, z: 10 },
      { x: -11, y: 64, z: 10 }
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
    baseAngle: 107.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -12, y: 38, z: 0 },
      { x: -17, y: 36, z: 0 },
      { x: -27, y: 59, z: 10 },
      { x: -20, y: 62, z: 10 }
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
    baseAngle: 115,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -17, y: 36, z: 0 },
      { x: -21, y: 34, z: 0 },
      { x: -35, y: 55, z: 10 },
      { x: -27, y: 59, z: 10 }
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
    baseAngle: 122.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -21, y: 34, z: 0 },
      { x: -26, y: 31, z: 0 },
      { x: -42, y: 50, z: 10 },
      { x: -35, y: 55, z: 10 }
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
    baseAngle: 130,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -26, y: 31, z: 0 },
      { x: -29, y: 27, z: 0 },
      { x: -48, y: 44, z: 10 },
      { x: -42, y: 50, z: 10 }
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
    baseAngle: 137.5,
    angleSpan: 7.5,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: -29, y: 27, z: 0 },
      { x: -33, y: 23, z: 0 },
      { x: -53, y: 37, z: 10 },
      { x: -48, y: 44, z: 10 }
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
    baseAngle: 90,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 0, y: 65, z: 12 },
      { x: -9, y: 64, z: 12 },
      { x: -14, y: 94, z: 28 },
      { x: 0, y: 95, z: 28 }
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
    baseAngle: 98.33333333333331,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -9, y: 64, z: 12 },
      { x: -19, y: 62, z: 12 },
      { x: -27, y: 91, z: 28 },
      { x: -14, y: 94, z: 28 }
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
    baseAngle: 106.66666666666669,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -19, y: 62, z: 12 },
      { x: -27, y: 59, z: 12 },
      { x: -40, y: 86, z: 28 },
      { x: -27, y: 91, z: 28 }
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
    baseAngle: 115,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -27, y: 59, z: 12 },
      { x: -36, y: 54, z: 12 },
      { x: -52, y: 79, z: 28 },
      { x: -40, y: 86, z: 28 }
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
    baseAngle: 123.33333333333337,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -36, y: 54, z: 12 },
      { x: -43, y: 49, z: 12 },
      { x: -63, y: 71, z: 28 },
      { x: -52, y: 79, z: 28 }
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
    baseAngle: 131.66666666666663,
    angleSpan: 8.333333333333334,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: -43, y: 49, z: 12 },
      { x: -50, y: 42, z: 12 },
      { x: -73, y: 61, z: 28 },
      { x: -63, y: 71, z: 28 }
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
    baseAngle: 95,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: -8, y: 95, z: 28 },
      { x: -25, y: 92, z: 28 },
      { x: -34, y: 126, z: 50 },
      { x: -11, y: 130, z: 50 }
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
    baseAngle: 105,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: -25, y: 92, z: 28 },
      { x: -40, y: 86, z: 28 },
      { x: -55, y: 118, z: 50 },
      { x: -34, y: 126, z: 50 }
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
    baseAngle: 115,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -40, y: 86, z: 28 },
      { x: -54, y: 78, z: 28 },
      { x: -75, y: 106, z: 50 },
      { x: -55, y: 118, z: 50 }
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
    baseAngle: 125,
    angleSpan: 10,
    rows: generateRows('1', '20', 24, 28, 26, false),
    vertices3D: [
      { x: -54, y: 78, z: 28 },
      { x: -67, y: 67, z: 28 },
      { x: -92, y: 92, z: 50 },
      { x: -75, y: 106, z: 50 }
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
    baseAngle: 175,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -130, y: 11, z: 5 },
      { x: -128, y: -23, z: 5 },
      { x: -162, y: -29, z: 20 },
      { x: -164, y: 14, z: 20 }
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
    baseAngle: 195,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -126, y: -34, z: 5 },
      { x: -113, y: -65, z: 5 },
      { x: -143, y: -83, z: 20 },
      { x: -159, y: -43, z: 20 }
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
    baseAngle: 55,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 75, y: 106, z: 5 },
      { x: 44, y: 122, z: 5 },
      { x: 56, y: 155, z: 20 },
      { x: 95, y: 135, z: 20 }
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
    id: 'BERM',
    name: 'Outfield Berm',
    level: 'standing',
    baseAngle: 295,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 70, y: -150, z: 10 },
      { x: 135, y: -95, z: 10 },
      { x: 156, y: -109, z: 10 },
      { x: 80, y: -172, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const chattanoogalookoutsSectionMap = new Map(
  chattanoogalookoutsSections.map(section => [section.id, section])
);

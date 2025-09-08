// Dozer Park - Comprehensive Section Data
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

export const peoriachiefsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 35,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 33, y: 23, z: 0 },
      { x: 28, y: 28, z: 0 },
      { x: 46, y: 46, z: 10 },
      { x: 53, y: 37, z: 10 }
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
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 28, y: 28, z: 0 },
      { x: 23, y: 33, z: 0 },
      { x: 37, y: 53, z: 10 },
      { x: 46, y: 46, z: 10 }
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
    baseAngle: 55,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 23, y: 33, z: 0 },
      { x: 17, y: 36, z: 0 },
      { x: 27, y: 59, z: 10 },
      { x: 37, y: 53, z: 10 }
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
    baseAngle: 65,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 17, y: 36, z: 0 },
      { x: 10, y: 39, z: 0 },
      { x: 17, y: 63, z: 10 },
      { x: 27, y: 59, z: 10 }
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
    baseAngle: 75,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 10, y: 39, z: 0 },
      { x: 3, y: 40, z: 0 },
      { x: 6, y: 65, z: 10 },
      { x: 17, y: 63, z: 10 }
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
    baseAngle: 85,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 3, y: 40, z: 0 },
      { x: -3, y: 40, z: 0 },
      { x: -6, y: 65, z: 10 },
      { x: 6, y: 65, z: 10 }
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
    baseAngle: 40,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 50, y: 42, z: 12 },
      { x: 40, y: 52, z: 12 },
      { x: 58, y: 75, z: 28 },
      { x: 73, y: 61, z: 28 }
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
    baseAngle: 52.5,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 40, y: 52, z: 12 },
      { x: 27, y: 59, z: 12 },
      { x: 40, y: 86, z: 28 },
      { x: 58, y: 75, z: 28 }
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
    baseAngle: 65,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 27, y: 59, z: 12 },
      { x: 14, y: 63, z: 12 },
      { x: 21, y: 93, z: 28 },
      { x: 40, y: 86, z: 28 }
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
    baseAngle: 77.5,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 14, y: 63, z: 12 },
      { x: 0, y: 65, z: 12 },
      { x: 0, y: 95, z: 28 },
      { x: 21, y: 93, z: 28 }
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
    baseAngle: 45,
    angleSpan: 20,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 67, y: 67, z: 28 },
      { x: 40, y: 86, z: 28 },
      { x: 55, y: 118, z: 50 },
      { x: 92, y: 92, z: 50 }
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
    baseAngle: 65,
    angleSpan: 20,
    rows: generateRows('1', '20', 24, 28, 26, true),
    vertices3D: [
      { x: 40, y: 86, z: 28 },
      { x: 8, y: 95, z: 28 },
      { x: 11, y: 130, z: 50 },
      { x: 55, y: 118, z: 50 }
    ] as Vector3D[],
    covered: true,
    distance: 110,
    height: 28,
    rake: 26
  },
  {
    id: 'BL-1',
    name: 'Bleachers 1',
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
    id: 'BL-2',
    name: 'Bleachers 2',
    level: 'field',
    baseAngle: 145,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -106, y: 75, z: 5 },
      { x: -122, y: 44, z: 5 },
      { x: -155, y: 56, z: 20 },
      { x: -135, y: 95, z: 20 }
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
    baseAngle: 5,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 130, y: 11, z: 5 },
      { x: 122, y: 44, z: 5 },
      { x: 155, y: 56, z: 20 },
      { x: 164, y: 14, z: 20 }
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
    id: 'BERM',
    name: 'Outfield Berm',
    level: 'standing',
    baseAngle: 245,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -70, y: -150, z: 10 },
      { x: 14, y: -164, z: 10 },
      { x: 17, y: -189, z: 10 },
      { x: -80, y: -172, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const peoriachiefsSectionMap = new Map(
  peoriachiefsSections.map(section => [section.id, section])
);

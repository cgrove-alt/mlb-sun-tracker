// Hammond Stadium - Comprehensive Section Data
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

export const fortmyersmightymusselsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 305,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 23, y: -33, z: 0 },
      { x: 28, y: -28, z: 0 },
      { x: 46, y: -46, z: 10 },
      { x: 37, y: -53, z: 10 }
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
    baseAngle: 315,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 28, y: -28, z: 0 },
      { x: 33, y: -23, z: 0 },
      { x: 53, y: -37, z: 10 },
      { x: 46, y: -46, z: 10 }
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
    baseAngle: 325,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 33, y: -23, z: 0 },
      { x: 36, y: -17, z: 0 },
      { x: 59, y: -27, z: 10 },
      { x: 53, y: -37, z: 10 }
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
    baseAngle: 335,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 36, y: -17, z: 0 },
      { x: 39, y: -10, z: 0 },
      { x: 63, y: -17, z: 10 },
      { x: 59, y: -27, z: 10 }
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
    baseAngle: 345,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: -10, z: 0 },
      { x: 40, y: -3, z: 0 },
      { x: 65, y: -6, z: 10 },
      { x: 63, y: -17, z: 10 }
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
    baseAngle: 355,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 40, y: -3, z: 0 },
      { x: 40, y: 3, z: 0 },
      { x: 65, y: 6, z: 10 },
      { x: 65, y: -6, z: 10 }
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
    baseAngle: 310,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 42, y: -50, z: 12 },
      { x: 52, y: -40, z: 12 },
      { x: 75, y: -58, z: 28 },
      { x: 61, y: -73, z: 28 }
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
    baseAngle: 322.5,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 52, y: -40, z: 12 },
      { x: 59, y: -27, z: 12 },
      { x: 86, y: -40, z: 28 },
      { x: 75, y: -58, z: 28 }
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
    baseAngle: 335,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 59, y: -27, z: 12 },
      { x: 63, y: -14, z: 12 },
      { x: 93, y: -21, z: 28 },
      { x: 86, y: -40, z: 28 }
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
    baseAngle: 347.5,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 63, y: -14, z: 12 },
      { x: 65, y: -0, z: 12 },
      { x: 95, y: -0, z: 28 },
      { x: 93, y: -21, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 22
  },
  {
    id: 'BL-1',
    name: 'Bleachers 1',
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
    id: 'BL-2',
    name: 'Bleachers 2',
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
    id: 'BL-3',
    name: 'Bleachers 3',
    level: 'field',
    baseAngle: 275,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 11, y: -130, z: 5 },
      { x: 44, y: -122, z: 5 },
      { x: 56, y: -155, z: 20 },
      { x: 14, y: -164, z: 20 }
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
    id: 'BERM',
    name: 'Outfield Berm',
    level: 'standing',
    baseAngle: 155,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -150, y: 70, z: 10 },
      { x: -164, y: -14, z: 10 },
      { x: -189, y: -17, z: 10 },
      { x: -172, y: 80, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const fortmyersmightymusselsSectionMap = new Map(
  fortmyersmightymusselsSections.map(section => [section.id, section])
);

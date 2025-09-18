// John Thurman Field - Comprehensive Section Data
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

export const modestonutsSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 10,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 39, y: 7, z: 0 },
      { x: 38, y: 14, z: 0 },
      { x: 61, y: 22, z: 10 },
      { x: 64, y: 11, z: 10 }
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
    baseAngle: 20,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 38, y: 14, z: 0 },
      { x: 35, y: 20, z: 0 },
      { x: 56, y: 32, z: 10 },
      { x: 61, y: 22, z: 10 }
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
    baseAngle: 30,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 35, y: 20, z: 0 },
      { x: 31, y: 26, z: 0 },
      { x: 50, y: 42, z: 10 },
      { x: 56, y: 32, z: 10 }
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
    baseAngle: 40,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 31, y: 26, z: 0 },
      { x: 26, y: 31, z: 0 },
      { x: 42, y: 50, z: 10 },
      { x: 50, y: 42, z: 10 }
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
    baseAngle: 50,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 26, y: 31, z: 0 },
      { x: 20, y: 35, z: 0 },
      { x: 33, y: 56, z: 10 },
      { x: 42, y: 50, z: 10 }
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
    baseAngle: 60,
    angleSpan: 10,
    rows: generateRows('A', 'P', 20, 0, 18, false),
    vertices3D: [
      { x: 20, y: 35, z: 0 },
      { x: 14, y: 38, z: 0 },
      { x: 22, y: 61, z: 10 },
      { x: 33, y: 56, z: 10 }
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
    baseAngle: 15,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 63, y: 17, z: 12 },
      { x: 58, y: 30, z: 12 },
      { x: 84, y: 44, z: 28 },
      { x: 92, y: 25, z: 28 }
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
    baseAngle: 27.5,
    angleSpan: 12.5,
    rows: generateRows('1', '25', 22, 12, 22, false),
    vertices3D: [
      { x: 58, y: 30, z: 12 },
      { x: 50, y: 42, z: 12 },
      { x: 73, y: 61, z: 28 },
      { x: 84, y: 44, z: 28 }
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
    id: '203',
    name: 'Lower 203',
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
    id: 'BL-1',
    name: 'Bleachers 1',
    level: 'field',
    baseAngle: 100,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -23, y: 128, z: 5 },
      { x: -55, y: 118, z: 5 },
      { x: -70, y: 150, z: 20 },
      { x: -29, y: 162, z: 20 }
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
    baseAngle: 120,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: -65, y: 113, z: 5 },
      { x: -92, y: 92, z: 5 },
      { x: -117, y: 117, z: 20 },
      { x: -82, y: 143, z: 20 }
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
    baseAngle: 340,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 122, y: -44, z: 5 },
      { x: 130, y: -11, z: 5 },
      { x: 164, y: -14, z: 20 },
      { x: 155, y: -56, z: 20 }
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
    baseAngle: 320,
    angleSpan: 15,
    rows: generateRows('A', 'N', 22, 5, 18, false),
    vertices3D: [
      { x: 100, y: -84, z: 5 },
      { x: 118, y: -55, z: 5 },
      { x: 150, y: -70, z: 20 },
      { x: 126, y: -106, z: 20 }
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
    baseAngle: 220,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -126, y: -106, z: 10 },
      { x: -56, y: -155, z: 10 },
      { x: -65, y: -179, z: 10 },
      { x: -146, y: -122, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  }
];

// Export section map for easy lookup
export const modestonutsSectionMap = new Map(
  modestonutsSections.map(section => [section.id, section])
);

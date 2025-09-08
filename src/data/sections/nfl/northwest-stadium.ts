// Northwest Stadium - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

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

export const northweststadiumSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 58,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 32, y: 51, z: 0 },
      { x: 10, y: 59, z: 0 },
      { x: 16, y: 94, z: 15 },
      { x: 50, y: 81, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '101',
    name: 'Field 101',
    level: 'field',
    baseAngle: 80.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 10, y: 59, z: 0 },
      { x: -13, y: 58, z: 0 },
      { x: -21, y: 93, z: 15 },
      { x: 16, y: 94, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '102',
    name: 'Field 102',
    level: 'field',
    baseAngle: 103,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -13, y: 58, z: 0 },
      { x: -35, y: 49, z: 0 },
      { x: -55, y: 77, z: 15 },
      { x: -21, y: 93, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '103',
    name: 'Field 103',
    level: 'field',
    baseAngle: 125.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -35, y: 49, z: 0 },
      { x: -51, y: 32, z: 0 },
      { x: -81, y: 50, z: 15 },
      { x: -55, y: 77, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '104',
    name: 'Field 104',
    level: 'field',
    baseAngle: 148,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -51, y: 32, z: 0 },
      { x: -59, y: 10, z: 0 },
      { x: -94, y: 16, z: 15 },
      { x: -81, y: 50, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '105',
    name: 'Field 105',
    level: 'field',
    baseAngle: 170.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -59, y: 10, z: 0 },
      { x: -58, y: -13, z: 0 },
      { x: -93, y: -21, z: 15 },
      { x: -94, y: 16, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '106',
    name: 'Field 106',
    level: 'field',
    baseAngle: 193,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -58, y: -13, z: 0 },
      { x: -49, y: -35, z: 0 },
      { x: -77, y: -55, z: 15 },
      { x: -93, y: -21, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '107',
    name: 'Field 107',
    level: 'field',
    baseAngle: 215.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -49, y: -35, z: 0 },
      { x: -32, y: -51, z: 0 },
      { x: -50, y: -81, z: 15 },
      { x: -77, y: -55, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '108',
    name: 'Field 108',
    level: 'field',
    baseAngle: 238,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -32, y: -51, z: 0 },
      { x: -10, y: -59, z: 0 },
      { x: -16, y: -94, z: 15 },
      { x: -50, y: -81, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '109',
    name: 'Field 109',
    level: 'field',
    baseAngle: 260.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -10, y: -59, z: 0 },
      { x: 13, y: -58, z: 0 },
      { x: 21, y: -93, z: 15 },
      { x: -16, y: -94, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '110',
    name: 'Field 110',
    level: 'field',
    baseAngle: 283,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 13, y: -58, z: 0 },
      { x: 35, y: -49, z: 0 },
      { x: 55, y: -77, z: 15 },
      { x: 21, y: -93, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '111',
    name: 'Field 111',
    level: 'field',
    baseAngle: 305.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 35, y: -49, z: 0 },
      { x: 51, y: -32, z: 0 },
      { x: 81, y: -50, z: 15 },
      { x: 55, y: -77, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '112',
    name: 'Field 112',
    level: 'field',
    baseAngle: 328,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 51, y: -32, z: 0 },
      { x: 59, y: -10, z: 0 },
      { x: 94, y: -16, z: 15 },
      { x: 81, y: -50, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '113',
    name: 'Field 113',
    level: 'field',
    baseAngle: 350.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 59, y: -10, z: 0 },
      { x: 58, y: 13, z: 0 },
      { x: 93, y: 21, z: 15 },
      { x: 94, y: -16, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '114',
    name: 'Field 114',
    level: 'field',
    baseAngle: 13,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 58, y: 13, z: 0 },
      { x: 49, y: 35, z: 0 },
      { x: 77, y: 55, z: 15 },
      { x: 93, y: 21, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '115',
    name: 'Field 115',
    level: 'field',
    baseAngle: 35.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 49, y: 35, z: 0 },
      { x: 32, y: 51, z: 0 },
      { x: 50, y: 81, z: 15 },
      { x: 77, y: 55, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 22
  },
  {
    id: '200',
    name: 'Lower 200',
    level: 'lower',
    baseAngle: 58,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 50, y: 81, z: 18 },
      { x: 23, y: 92, z: 18 },
      { x: 35, y: 141, z: 45 },
      { x: 77, y: 123, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '201',
    name: 'Lower 201',
    level: 'lower',
    baseAngle: 76,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 23, y: 92, z: 18 },
      { x: -7, y: 95, z: 18 },
      { x: -10, y: 145, z: 45 },
      { x: 35, y: 141, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '202',
    name: 'Lower 202',
    level: 'lower',
    baseAngle: 94,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -7, y: 95, z: 18 },
      { x: -36, y: 88, z: 18 },
      { x: -54, y: 134, z: 45 },
      { x: -10, y: 145, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '203',
    name: 'Lower 203',
    level: 'lower',
    baseAngle: 112,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -36, y: 88, z: 18 },
      { x: -61, y: 73, z: 18 },
      { x: -93, y: 111, z: 45 },
      { x: -54, y: 134, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '204',
    name: 'Lower 204',
    level: 'lower',
    baseAngle: 130,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -61, y: 73, z: 18 },
      { x: -81, y: 50, z: 18 },
      { x: -123, y: 77, z: 45 },
      { x: -93, y: 111, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '205',
    name: 'Lower 205',
    level: 'lower',
    baseAngle: 148,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -81, y: 50, z: 18 },
      { x: -92, y: 23, z: 18 },
      { x: -141, y: 35, z: 45 },
      { x: -123, y: 77, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '206',
    name: 'Lower 206',
    level: 'lower',
    baseAngle: 166,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -92, y: 23, z: 18 },
      { x: -95, y: -7, z: 18 },
      { x: -145, y: -10, z: 45 },
      { x: -141, y: 35, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '207',
    name: 'Lower 207',
    level: 'lower',
    baseAngle: 184,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: -7, z: 18 },
      { x: -88, y: -36, z: 18 },
      { x: -134, y: -54, z: 45 },
      { x: -145, y: -10, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '208',
    name: 'Lower 208',
    level: 'lower',
    baseAngle: 202,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -88, y: -36, z: 18 },
      { x: -73, y: -61, z: 18 },
      { x: -111, y: -93, z: 45 },
      { x: -134, y: -54, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '209',
    name: 'Lower 209',
    level: 'lower',
    baseAngle: 220,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -73, y: -61, z: 18 },
      { x: -50, y: -81, z: 18 },
      { x: -77, y: -123, z: 45 },
      { x: -111, y: -93, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '210',
    name: 'Lower 210',
    level: 'lower',
    baseAngle: 238,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -50, y: -81, z: 18 },
      { x: -23, y: -92, z: 18 },
      { x: -35, y: -141, z: 45 },
      { x: -77, y: -123, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '211',
    name: 'Lower 211',
    level: 'lower',
    baseAngle: 256,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -23, y: -92, z: 18 },
      { x: 7, y: -95, z: 18 },
      { x: 10, y: -145, z: 45 },
      { x: -35, y: -141, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '212',
    name: 'Lower 212',
    level: 'lower',
    baseAngle: 274,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 7, y: -95, z: 18 },
      { x: 36, y: -88, z: 18 },
      { x: 54, y: -134, z: 45 },
      { x: 10, y: -145, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '213',
    name: 'Lower 213',
    level: 'lower',
    baseAngle: 292,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 36, y: -88, z: 18 },
      { x: 61, y: -73, z: 18 },
      { x: 93, y: -111, z: 45 },
      { x: 54, y: -134, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '214',
    name: 'Lower 214',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 61, y: -73, z: 18 },
      { x: 81, y: -50, z: 18 },
      { x: 123, y: -77, z: 45 },
      { x: 93, y: -111, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '215',
    name: 'Lower 215',
    level: 'lower',
    baseAngle: 328,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 81, y: -50, z: 18 },
      { x: 92, y: -23, z: 18 },
      { x: 141, y: -35, z: 45 },
      { x: 123, y: -77, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '216',
    name: 'Lower 216',
    level: 'lower',
    baseAngle: 346,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 92, y: -23, z: 18 },
      { x: 95, y: 7, z: 18 },
      { x: 145, y: 10, z: 45 },
      { x: 141, y: -35, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '217',
    name: 'Lower 217',
    level: 'lower',
    baseAngle: 4,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: 7, z: 18 },
      { x: 88, y: 36, z: 18 },
      { x: 134, y: 54, z: 45 },
      { x: 145, y: 10, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '218',
    name: 'Lower 218',
    level: 'lower',
    baseAngle: 22,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 88, y: 36, z: 18 },
      { x: 73, y: 61, z: 18 },
      { x: 111, y: 93, z: 45 },
      { x: 134, y: 54, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: '219',
    name: 'Lower 219',
    level: 'lower',
    baseAngle: 40,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 73, y: 61, z: 18 },
      { x: 50, y: 81, z: 18 },
      { x: 77, y: 123, z: 45 },
      { x: 111, y: 93, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 18,
    rake: 25
  },
  {
    id: 'CL-300',
    name: 'Club 300',
    level: 'club',
    baseAngle: 58,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 77, y: 123, z: 35 },
      { x: 5, y: 145, z: 35 },
      { x: 6, y: 175, z: 52 },
      { x: 93, y: 148, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-301',
    name: 'Club 301',
    level: 'club',
    baseAngle: 88,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 5, y: 145, z: 35 },
      { x: -68, y: 128, z: 35 },
      { x: -82, y: 155, z: 52 },
      { x: 6, y: 175, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-302',
    name: 'Club 302',
    level: 'club',
    baseAngle: 118,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -68, y: 128, z: 35 },
      { x: -123, y: 77, z: 35 },
      { x: -148, y: 93, z: 52 },
      { x: -82, y: 155, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-303',
    name: 'Club 303',
    level: 'club',
    baseAngle: 148,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -123, y: 77, z: 35 },
      { x: -145, y: 5, z: 35 },
      { x: -175, y: 6, z: 52 },
      { x: -148, y: 93, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-304',
    name: 'Club 304',
    level: 'club',
    baseAngle: 178,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -145, y: 5, z: 35 },
      { x: -128, y: -68, z: 35 },
      { x: -155, y: -82, z: 52 },
      { x: -175, y: 6, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-305',
    name: 'Club 305',
    level: 'club',
    baseAngle: 208,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -128, y: -68, z: 35 },
      { x: -77, y: -123, z: 35 },
      { x: -93, y: -148, z: 52 },
      { x: -155, y: -82, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-306',
    name: 'Club 306',
    level: 'club',
    baseAngle: 238,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -77, y: -123, z: 35 },
      { x: -5, y: -145, z: 35 },
      { x: -6, y: -175, z: 52 },
      { x: -93, y: -148, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-307',
    name: 'Club 307',
    level: 'club',
    baseAngle: 268,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -5, y: -145, z: 35 },
      { x: 68, y: -128, z: 35 },
      { x: 82, y: -155, z: 52 },
      { x: -6, y: -175, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-308',
    name: 'Club 308',
    level: 'club',
    baseAngle: 298,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 68, y: -128, z: 35 },
      { x: 123, y: -77, z: 35 },
      { x: 148, y: -93, z: 52 },
      { x: 82, y: -155, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-309',
    name: 'Club 309',
    level: 'club',
    baseAngle: 328,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 123, y: -77, z: 35 },
      { x: 145, y: -5, z: 35 },
      { x: 175, y: -6, z: 52 },
      { x: 148, y: -93, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-310',
    name: 'Club 310',
    level: 'club',
    baseAngle: 358,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 145, y: -5, z: 35 },
      { x: 128, y: 68, z: 35 },
      { x: 155, y: 82, z: 52 },
      { x: 175, y: -6, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: 'CL-311',
    name: 'Club 311',
    level: 'club',
    baseAngle: 28,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 128, y: 68, z: 35 },
      { x: 77, y: 123, z: 35 },
      { x: 93, y: 148, z: 52 },
      { x: 155, y: 82, z: 52 }
    ] as Vector3D[],
    covered: false,
    distance: 160,
    height: 35,
    rake: 27
  },
  {
    id: '500',
    name: 'Upper 500',
    level: 'upper',
    baseAngle: 58,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 93, y: 148, z: 52 },
      { x: 42, y: 170, z: 52 },
      { x: 59, y: 238, z: 95 },
      { x: 130, y: 208, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '501',
    name: 'Upper 501',
    level: 'upper',
    baseAngle: 76,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 42, y: 170, z: 52 },
      { x: -12, y: 175, z: 52 },
      { x: -17, y: 244, z: 95 },
      { x: 59, y: 238, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '502',
    name: 'Upper 502',
    level: 'upper',
    baseAngle: 94,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -12, y: 175, z: 52 },
      { x: -66, y: 162, z: 52 },
      { x: -92, y: 227, z: 95 },
      { x: -17, y: 244, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '503',
    name: 'Upper 503',
    level: 'upper',
    baseAngle: 112,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -66, y: 162, z: 52 },
      { x: -112, y: 134, z: 52 },
      { x: -157, y: 188, z: 95 },
      { x: -92, y: 227, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '504',
    name: 'Upper 504',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -112, y: 134, z: 52 },
      { x: -148, y: 93, z: 52 },
      { x: -208, y: 130, z: 95 },
      { x: -157, y: 188, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '505',
    name: 'Upper 505',
    level: 'upper',
    baseAngle: 148,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -148, y: 93, z: 52 },
      { x: -170, y: 42, z: 52 },
      { x: -238, y: 59, z: 95 },
      { x: -208, y: 130, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '506',
    name: 'Upper 506',
    level: 'upper',
    baseAngle: 166,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -170, y: 42, z: 52 },
      { x: -175, y: -12, z: 52 },
      { x: -244, y: -17, z: 95 },
      { x: -238, y: 59, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '507',
    name: 'Upper 507',
    level: 'upper',
    baseAngle: 184,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -175, y: -12, z: 52 },
      { x: -162, y: -66, z: 52 },
      { x: -227, y: -92, z: 95 },
      { x: -244, y: -17, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '508',
    name: 'Upper 508',
    level: 'upper',
    baseAngle: 202,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -162, y: -66, z: 52 },
      { x: -134, y: -112, z: 52 },
      { x: -188, y: -157, z: 95 },
      { x: -227, y: -92, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '509',
    name: 'Upper 509',
    level: 'upper',
    baseAngle: 220,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -134, y: -112, z: 52 },
      { x: -93, y: -148, z: 52 },
      { x: -130, y: -208, z: 95 },
      { x: -188, y: -157, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '510',
    name: 'Upper 510',
    level: 'upper',
    baseAngle: 238,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -93, y: -148, z: 52 },
      { x: -42, y: -170, z: 52 },
      { x: -59, y: -238, z: 95 },
      { x: -130, y: -208, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '511',
    name: 'Upper 511',
    level: 'upper',
    baseAngle: 256,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -42, y: -170, z: 52 },
      { x: 12, y: -175, z: 52 },
      { x: 17, y: -244, z: 95 },
      { x: -59, y: -238, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '512',
    name: 'Upper 512',
    level: 'upper',
    baseAngle: 274,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 12, y: -175, z: 52 },
      { x: 66, y: -162, z: 52 },
      { x: 92, y: -227, z: 95 },
      { x: 17, y: -244, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '513',
    name: 'Upper 513',
    level: 'upper',
    baseAngle: 292,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 66, y: -162, z: 52 },
      { x: 112, y: -134, z: 52 },
      { x: 157, y: -188, z: 95 },
      { x: 92, y: -227, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '514',
    name: 'Upper 514',
    level: 'upper',
    baseAngle: 310,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 112, y: -134, z: 52 },
      { x: 148, y: -93, z: 52 },
      { x: 208, y: -130, z: 95 },
      { x: 157, y: -188, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '515',
    name: 'Upper 515',
    level: 'upper',
    baseAngle: 328,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 148, y: -93, z: 52 },
      { x: 170, y: -42, z: 52 },
      { x: 238, y: -59, z: 95 },
      { x: 208, y: -130, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '516',
    name: 'Upper 516',
    level: 'upper',
    baseAngle: 346,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 170, y: -42, z: 52 },
      { x: 175, y: 12, z: 52 },
      { x: 244, y: 17, z: 95 },
      { x: 238, y: -59, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '517',
    name: 'Upper 517',
    level: 'upper',
    baseAngle: 4,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 175, y: 12, z: 52 },
      { x: 162, y: 66, z: 52 },
      { x: 227, y: 92, z: 95 },
      { x: 244, y: 17, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '518',
    name: 'Upper 518',
    level: 'upper',
    baseAngle: 22,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 162, y: 66, z: 52 },
      { x: 134, y: 112, z: 52 },
      { x: 188, y: 157, z: 95 },
      { x: 227, y: 92, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: '519',
    name: 'Upper 519',
    level: 'upper',
    baseAngle: 40,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 134, y: 112, z: 52 },
      { x: 93, y: 148, z: 52 },
      { x: 130, y: 208, z: 95 },
      { x: 188, y: 157, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 210,
    height: 52,
    rake: 30
  },
  {
    id: 'SUITE-1',
    name: 'Suite 1',
    level: 'suite',
    baseAngle: 58,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 85, y: 136, z: 42 },
      { x: -36, y: 156, z: 42 },
      { x: -42, y: 180, z: 42 },
      { x: 98, y: 157, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-2',
    name: 'Suite 2',
    level: 'suite',
    baseAngle: 103,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -36, y: 156, z: 42 },
      { x: -136, y: 85, z: 42 },
      { x: -157, y: 98, z: 42 },
      { x: -42, y: 180, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-3',
    name: 'Suite 3',
    level: 'suite',
    baseAngle: 148,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -136, y: 85, z: 42 },
      { x: -156, y: -36, z: 42 },
      { x: -180, y: -42, z: 42 },
      { x: -157, y: 98, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-4',
    name: 'Suite 4',
    level: 'suite',
    baseAngle: 193,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -156, y: -36, z: 42 },
      { x: -85, y: -136, z: 42 },
      { x: -98, y: -157, z: 42 },
      { x: -180, y: -42, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-5',
    name: 'Suite 5',
    level: 'suite',
    baseAngle: 238,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -85, y: -136, z: 42 },
      { x: 36, y: -156, z: 42 },
      { x: 42, y: -180, z: 42 },
      { x: -98, y: -157, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-6',
    name: 'Suite 6',
    level: 'suite',
    baseAngle: 283,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 36, y: -156, z: 42 },
      { x: 136, y: -85, z: 42 },
      { x: 157, y: -98, z: 42 },
      { x: 42, y: -180, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-7',
    name: 'Suite 7',
    level: 'suite',
    baseAngle: 328,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 136, y: -85, z: 42 },
      { x: 156, y: 36, z: 42 },
      { x: 180, y: 42, z: 42 },
      { x: 157, y: -98, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'SUITE-8',
    name: 'Suite 8',
    level: 'suite',
    baseAngle: 13,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 156, y: 36, z: 42 },
      { x: 85, y: 136, z: 42 },
      { x: 98, y: 157, z: 42 },
      { x: 180, y: 42, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 172,
    height: 42,
    rake: 0
  },
  {
    id: 'DECK-North',
    name: 'North Party Deck',
    level: 'standing',
    baseAngle: 58,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 130, y: 208, z: 30 },
      { x: 9, y: 245, z: 30 },
      { x: 9, y: 265, z: 30 },
      { x: 140, y: 225, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  },
  {
    id: 'DECK-South',
    name: 'South Party Deck',
    level: 'standing',
    baseAngle: 148,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -208, y: 130, z: 30 },
      { x: -245, y: 9, z: 30 },
      { x: -265, y: 9, z: 30 },
      { x: -225, y: 140, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  },
  {
    id: 'DECK-East',
    name: 'East Party Deck',
    level: 'standing',
    baseAngle: 238,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -130, y: -208, z: 30 },
      { x: -9, y: -245, z: 30 },
      { x: -9, y: -265, z: 30 },
      { x: -140, y: -225, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  },
  {
    id: 'DECK-West',
    name: 'West Party Deck',
    level: 'standing',
    baseAngle: 328,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 208, y: -130, z: 30 },
      { x: 245, y: -9, z: 30 },
      { x: 265, y: -9, z: 30 },
      { x: 225, y: -140, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const northweststadiumSectionMap = new Map(
  northweststadiumSections.map(section => [section.id, section])
);

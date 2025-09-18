// Paycor Stadium - Comprehensive Section Data
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

export const paycorstadiumSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
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
    id: '101',
    name: 'Field 101',
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
    id: '102',
    name: 'Field 102',
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
    id: '103',
    name: 'Field 103',
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
    id: '104',
    name: 'Field 104',
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
    id: '105',
    name: 'Field 105',
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
    id: '106',
    name: 'Field 106',
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
    id: '107',
    name: 'Field 107',
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
    id: '108',
    name: 'Field 108',
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
    id: '109',
    name: 'Field 109',
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
    id: '110',
    name: 'Field 110',
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
    id: '111',
    name: 'Field 111',
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
    id: '112',
    name: 'Field 112',
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
    id: '113',
    name: 'Field 113',
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
    id: '114',
    name: 'Field 114',
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
    id: '115',
    name: 'Field 115',
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
    id: '200',
    name: 'Lower 200',
    level: 'lower',
    baseAngle: 13,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 93, y: 21, z: 18 },
      { x: 81, y: 49, z: 18 },
      { x: 124, y: 75, z: 45 },
      { x: 141, y: 33, z: 45 }
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
    baseAngle: 31,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 81, y: 49, z: 18 },
      { x: 62, y: 72, z: 18 },
      { x: 95, y: 109, z: 45 },
      { x: 124, y: 75, z: 45 }
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
    baseAngle: 49,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 62, y: 72, z: 18 },
      { x: 37, y: 87, z: 18 },
      { x: 57, y: 133, z: 45 },
      { x: 95, y: 109, z: 45 }
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
    baseAngle: 67,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 37, y: 87, z: 18 },
      { x: 8, y: 95, z: 18 },
      { x: 13, y: 144, z: 45 },
      { x: 57, y: 133, z: 45 }
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
    baseAngle: 85,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 8, y: 95, z: 18 },
      { x: -21, y: 93, z: 18 },
      { x: -33, y: 141, z: 45 },
      { x: 13, y: 144, z: 45 }
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
    baseAngle: 103,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -21, y: 93, z: 18 },
      { x: -49, y: 81, z: 18 },
      { x: -75, y: 124, z: 45 },
      { x: -33, y: 141, z: 45 }
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
    baseAngle: 121,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -49, y: 81, z: 18 },
      { x: -72, y: 62, z: 18 },
      { x: -109, y: 95, z: 45 },
      { x: -75, y: 124, z: 45 }
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
    baseAngle: 139,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -72, y: 62, z: 18 },
      { x: -87, y: 37, z: 18 },
      { x: -133, y: 57, z: 45 },
      { x: -109, y: 95, z: 45 }
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
    baseAngle: 157,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -87, y: 37, z: 18 },
      { x: -95, y: 8, z: 18 },
      { x: -144, y: 13, z: 45 },
      { x: -133, y: 57, z: 45 }
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
    baseAngle: 175,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: 8, z: 18 },
      { x: -93, y: -21, z: 18 },
      { x: -141, y: -33, z: 45 },
      { x: -144, y: 13, z: 45 }
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
    baseAngle: 193,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -93, y: -21, z: 18 },
      { x: -81, y: -49, z: 18 },
      { x: -124, y: -75, z: 45 },
      { x: -141, y: -33, z: 45 }
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
    baseAngle: 211,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -81, y: -49, z: 18 },
      { x: -62, y: -72, z: 18 },
      { x: -95, y: -109, z: 45 },
      { x: -124, y: -75, z: 45 }
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
    baseAngle: 229,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -62, y: -72, z: 18 },
      { x: -37, y: -87, z: 18 },
      { x: -57, y: -133, z: 45 },
      { x: -95, y: -109, z: 45 }
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
    baseAngle: 247,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -37, y: -87, z: 18 },
      { x: -8, y: -95, z: 18 },
      { x: -13, y: -144, z: 45 },
      { x: -57, y: -133, z: 45 }
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
    baseAngle: 265,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -8, y: -95, z: 18 },
      { x: 21, y: -93, z: 18 },
      { x: 33, y: -141, z: 45 },
      { x: -13, y: -144, z: 45 }
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
    baseAngle: 283,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 21, y: -93, z: 18 },
      { x: 49, y: -81, z: 18 },
      { x: 75, y: -124, z: 45 },
      { x: 33, y: -141, z: 45 }
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
    baseAngle: 301,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 49, y: -81, z: 18 },
      { x: 72, y: -62, z: 18 },
      { x: 109, y: -95, z: 45 },
      { x: 75, y: -124, z: 45 }
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
    baseAngle: 319,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 72, y: -62, z: 18 },
      { x: 87, y: -37, z: 18 },
      { x: 133, y: -57, z: 45 },
      { x: 109, y: -95, z: 45 }
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
    baseAngle: 337,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 87, y: -37, z: 18 },
      { x: 95, y: -8, z: 18 },
      { x: 144, y: -13, z: 45 },
      { x: 133, y: -57, z: 45 }
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
    baseAngle: 355,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: -8, z: 18 },
      { x: 93, y: 21, z: 18 },
      { x: 141, y: 33, z: 45 },
      { x: 144, y: -13, z: 45 }
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
    baseAngle: 13,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 141, y: 33, z: 35 },
      { x: 106, y: 99, z: 35 },
      { x: 128, y: 119, z: 52 },
      { x: 171, y: 39, z: 52 }
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
    baseAngle: 43,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 106, y: 99, z: 35 },
      { x: 42, y: 139, z: 35 },
      { x: 51, y: 167, z: 52 },
      { x: 128, y: 119, z: 52 }
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
    baseAngle: 73,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 42, y: 139, z: 35 },
      { x: -33, y: 141, z: 35 },
      { x: -39, y: 171, z: 52 },
      { x: 51, y: 167, z: 52 }
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
    baseAngle: 103,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -33, y: 141, z: 35 },
      { x: -99, y: 106, z: 35 },
      { x: -119, y: 128, z: 52 },
      { x: -39, y: 171, z: 52 }
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
    baseAngle: 133,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -99, y: 106, z: 35 },
      { x: -139, y: 42, z: 35 },
      { x: -167, y: 51, z: 52 },
      { x: -119, y: 128, z: 52 }
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
    baseAngle: 163,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -139, y: 42, z: 35 },
      { x: -141, y: -33, z: 35 },
      { x: -171, y: -39, z: 52 },
      { x: -167, y: 51, z: 52 }
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
    baseAngle: 193,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -141, y: -33, z: 35 },
      { x: -106, y: -99, z: 35 },
      { x: -128, y: -119, z: 52 },
      { x: -171, y: -39, z: 52 }
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
    baseAngle: 223,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -106, y: -99, z: 35 },
      { x: -42, y: -139, z: 35 },
      { x: -51, y: -167, z: 52 },
      { x: -128, y: -119, z: 52 }
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
    baseAngle: 253,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -42, y: -139, z: 35 },
      { x: 33, y: -141, z: 35 },
      { x: 39, y: -171, z: 52 },
      { x: -51, y: -167, z: 52 }
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
    baseAngle: 283,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 33, y: -141, z: 35 },
      { x: 99, y: -106, z: 35 },
      { x: 119, y: -128, z: 52 },
      { x: 39, y: -171, z: 52 }
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
    baseAngle: 313,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 99, y: -106, z: 35 },
      { x: 139, y: -42, z: 35 },
      { x: 167, y: -51, z: 52 },
      { x: 119, y: -128, z: 52 }
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
    baseAngle: 343,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 139, y: -42, z: 35 },
      { x: 141, y: 33, z: 35 },
      { x: 171, y: 39, z: 52 },
      { x: 167, y: -51, z: 52 }
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
    baseAngle: 13,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 171, y: 39, z: 52 },
      { x: 150, y: 90, z: 52 },
      { x: 210, y: 126, z: 95 },
      { x: 239, y: 55, z: 95 }
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
    baseAngle: 31,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 150, y: 90, z: 52 },
      { x: 115, y: 132, z: 52 },
      { x: 161, y: 185, z: 95 },
      { x: 210, y: 126, z: 95 }
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
    baseAngle: 49,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 115, y: 132, z: 52 },
      { x: 68, y: 161, z: 52 },
      { x: 96, y: 226, z: 95 },
      { x: 161, y: 185, z: 95 }
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
    baseAngle: 67,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 68, y: 161, z: 52 },
      { x: 15, y: 174, z: 52 },
      { x: 21, y: 244, z: 95 },
      { x: 96, y: 226, z: 95 }
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
    baseAngle: 85,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 15, y: 174, z: 52 },
      { x: -39, y: 171, z: 52 },
      { x: -55, y: 239, z: 95 },
      { x: 21, y: 244, z: 95 }
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
    baseAngle: 103,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -39, y: 171, z: 52 },
      { x: -90, y: 150, z: 52 },
      { x: -126, y: 210, z: 95 },
      { x: -55, y: 239, z: 95 }
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
    baseAngle: 121,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -90, y: 150, z: 52 },
      { x: -132, y: 115, z: 52 },
      { x: -185, y: 161, z: 95 },
      { x: -126, y: 210, z: 95 }
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
    baseAngle: 139,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -132, y: 115, z: 52 },
      { x: -161, y: 68, z: 52 },
      { x: -226, y: 96, z: 95 },
      { x: -185, y: 161, z: 95 }
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
    baseAngle: 157,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -161, y: 68, z: 52 },
      { x: -174, y: 15, z: 52 },
      { x: -244, y: 21, z: 95 },
      { x: -226, y: 96, z: 95 }
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
    baseAngle: 175,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -174, y: 15, z: 52 },
      { x: -171, y: -39, z: 52 },
      { x: -239, y: -55, z: 95 },
      { x: -244, y: 21, z: 95 }
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
    baseAngle: 193,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -171, y: -39, z: 52 },
      { x: -150, y: -90, z: 52 },
      { x: -210, y: -126, z: 95 },
      { x: -239, y: -55, z: 95 }
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
    baseAngle: 211,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -150, y: -90, z: 52 },
      { x: -115, y: -132, z: 52 },
      { x: -161, y: -185, z: 95 },
      { x: -210, y: -126, z: 95 }
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
    baseAngle: 229,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -115, y: -132, z: 52 },
      { x: -68, y: -161, z: 52 },
      { x: -96, y: -226, z: 95 },
      { x: -161, y: -185, z: 95 }
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
    baseAngle: 247,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -68, y: -161, z: 52 },
      { x: -15, y: -174, z: 52 },
      { x: -21, y: -244, z: 95 },
      { x: -96, y: -226, z: 95 }
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
    baseAngle: 265,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -15, y: -174, z: 52 },
      { x: 39, y: -171, z: 52 },
      { x: 55, y: -239, z: 95 },
      { x: -21, y: -244, z: 95 }
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
    baseAngle: 283,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 39, y: -171, z: 52 },
      { x: 90, y: -150, z: 52 },
      { x: 126, y: -210, z: 95 },
      { x: 55, y: -239, z: 95 }
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
    baseAngle: 301,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 90, y: -150, z: 52 },
      { x: 132, y: -115, z: 52 },
      { x: 185, y: -161, z: 95 },
      { x: 126, y: -210, z: 95 }
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
    baseAngle: 319,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 132, y: -115, z: 52 },
      { x: 161, y: -68, z: 52 },
      { x: 226, y: -96, z: 95 },
      { x: 185, y: -161, z: 95 }
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
    baseAngle: 337,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 161, y: -68, z: 52 },
      { x: 174, y: -15, z: 52 },
      { x: 244, y: -21, z: 95 },
      { x: 226, y: -96, z: 95 }
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
    baseAngle: 355,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 174, y: -15, z: 52 },
      { x: 171, y: 39, z: 52 },
      { x: 239, y: 55, z: 95 },
      { x: 244, y: -21, z: 95 }
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
    id: 'SUITE-2',
    name: 'Suite 2',
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
    id: 'SUITE-3',
    name: 'Suite 3',
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
    id: 'SUITE-4',
    name: 'Suite 4',
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
    id: 'SUITE-5',
    name: 'Suite 5',
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
    id: 'SUITE-6',
    name: 'Suite 6',
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
    id: 'SUITE-7',
    name: 'Suite 7',
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
    id: 'SUITE-8',
    name: 'Suite 8',
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
    id: 'DECK-North',
    name: 'North Party Deck',
    level: 'standing',
    baseAngle: 13,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 239, y: 55, z: 30 },
      { x: 179, y: 167, z: 30 },
      { x: 194, y: 181, z: 30 },
      { x: 258, y: 60, z: 30 }
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
    baseAngle: 103,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -55, y: 239, z: 30 },
      { x: -167, y: 179, z: 30 },
      { x: -181, y: 194, z: 30 },
      { x: -60, y: 258, z: 30 }
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
    baseAngle: 193,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -239, y: -55, z: 30 },
      { x: -179, y: -167, z: 30 },
      { x: -194, y: -181, z: 30 },
      { x: -258, y: -60, z: 30 }
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
    baseAngle: 283,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 55, y: -239, z: 30 },
      { x: 167, y: -179, z: 30 },
      { x: 181, y: -194, z: 30 },
      { x: 60, y: -258, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const paycorstadiumSectionMap = new Map(
  paycorstadiumSections.map(section => [section.id, section])
);

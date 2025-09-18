// Lambeau Field - Comprehensive Section Data
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

export const lambeaufieldSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 45,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 42, y: 42, z: 0 },
      { x: 23, y: 55, z: 0 },
      { x: 36, y: 88, z: 15 },
      { x: 67, y: 67, z: 15 }
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
    baseAngle: 67.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 23, y: 55, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 95, z: 15 },
      { x: 36, y: 88, z: 15 }
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
    baseAngle: 90,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 0, y: 60, z: 0 },
      { x: -23, y: 55, z: 0 },
      { x: -36, y: 88, z: 15 },
      { x: 0, y: 95, z: 15 }
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
    baseAngle: 112.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -23, y: 55, z: 0 },
      { x: -42, y: 42, z: 0 },
      { x: -67, y: 67, z: 15 },
      { x: -36, y: 88, z: 15 }
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
    baseAngle: 135,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -42, y: 42, z: 0 },
      { x: -55, y: 23, z: 0 },
      { x: -88, y: 36, z: 15 },
      { x: -67, y: 67, z: 15 }
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
    baseAngle: 157.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -55, y: 23, z: 0 },
      { x: -60, y: 0, z: 0 },
      { x: -95, y: 0, z: 15 },
      { x: -88, y: 36, z: 15 }
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
    baseAngle: 180,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -60, y: 0, z: 0 },
      { x: -55, y: -23, z: 0 },
      { x: -88, y: -36, z: 15 },
      { x: -95, y: 0, z: 15 }
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
    baseAngle: 202.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -55, y: -23, z: 0 },
      { x: -42, y: -42, z: 0 },
      { x: -67, y: -67, z: 15 },
      { x: -88, y: -36, z: 15 }
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
    baseAngle: 225,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -42, y: -42, z: 0 },
      { x: -23, y: -55, z: 0 },
      { x: -36, y: -88, z: 15 },
      { x: -67, y: -67, z: 15 }
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
    baseAngle: 247.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -23, y: -55, z: 0 },
      { x: -0, y: -60, z: 0 },
      { x: -0, y: -95, z: 15 },
      { x: -36, y: -88, z: 15 }
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
    baseAngle: 270,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -0, y: -60, z: 0 },
      { x: 23, y: -55, z: 0 },
      { x: 36, y: -88, z: 15 },
      { x: -0, y: -95, z: 15 }
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
    baseAngle: 292.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 23, y: -55, z: 0 },
      { x: 42, y: -42, z: 0 },
      { x: 67, y: -67, z: 15 },
      { x: 36, y: -88, z: 15 }
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
    baseAngle: 315,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 42, y: -42, z: 0 },
      { x: 55, y: -23, z: 0 },
      { x: 88, y: -36, z: 15 },
      { x: 67, y: -67, z: 15 }
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
    baseAngle: 337.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 55, y: -23, z: 0 },
      { x: 60, y: -0, z: 0 },
      { x: 95, y: -0, z: 15 },
      { x: 88, y: -36, z: 15 }
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
    baseAngle: 0,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 60, y: 0, z: 0 },
      { x: 55, y: 23, z: 0 },
      { x: 88, y: 36, z: 15 },
      { x: 95, y: 0, z: 15 }
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
    baseAngle: 22.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 55, y: 23, z: 0 },
      { x: 42, y: 42, z: 0 },
      { x: 67, y: 67, z: 15 },
      { x: 88, y: 36, z: 15 }
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
    baseAngle: 45,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 67, y: 67, z: 18 },
      { x: 43, y: 85, z: 18 },
      { x: 66, y: 129, z: 45 },
      { x: 103, y: 103, z: 45 }
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
    baseAngle: 63,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 43, y: 85, z: 18 },
      { x: 15, y: 94, z: 18 },
      { x: 23, y: 143, z: 45 },
      { x: 66, y: 129, z: 45 }
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
    baseAngle: 81,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 15, y: 94, z: 18 },
      { x: -15, y: 94, z: 18 },
      { x: -23, y: 143, z: 45 },
      { x: 23, y: 143, z: 45 }
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
    baseAngle: 99,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -15, y: 94, z: 18 },
      { x: -43, y: 85, z: 18 },
      { x: -66, y: 129, z: 45 },
      { x: -23, y: 143, z: 45 }
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
    baseAngle: 117,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -43, y: 85, z: 18 },
      { x: -67, y: 67, z: 18 },
      { x: -103, y: 103, z: 45 },
      { x: -66, y: 129, z: 45 }
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
    baseAngle: 135,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -67, y: 67, z: 18 },
      { x: -85, y: 43, z: 18 },
      { x: -129, y: 66, z: 45 },
      { x: -103, y: 103, z: 45 }
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
    baseAngle: 153,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -85, y: 43, z: 18 },
      { x: -94, y: 15, z: 18 },
      { x: -143, y: 23, z: 45 },
      { x: -129, y: 66, z: 45 }
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
    baseAngle: 171,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -94, y: 15, z: 18 },
      { x: -94, y: -15, z: 18 },
      { x: -143, y: -23, z: 45 },
      { x: -143, y: 23, z: 45 }
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
    baseAngle: 189,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -94, y: -15, z: 18 },
      { x: -85, y: -43, z: 18 },
      { x: -129, y: -66, z: 45 },
      { x: -143, y: -23, z: 45 }
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
    baseAngle: 207,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -85, y: -43, z: 18 },
      { x: -67, y: -67, z: 18 },
      { x: -103, y: -103, z: 45 },
      { x: -129, y: -66, z: 45 }
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
    baseAngle: 225,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -67, y: -67, z: 18 },
      { x: -43, y: -85, z: 18 },
      { x: -66, y: -129, z: 45 },
      { x: -103, y: -103, z: 45 }
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
    baseAngle: 243,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -43, y: -85, z: 18 },
      { x: -15, y: -94, z: 18 },
      { x: -23, y: -143, z: 45 },
      { x: -66, y: -129, z: 45 }
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
    baseAngle: 261,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -15, y: -94, z: 18 },
      { x: 15, y: -94, z: 18 },
      { x: 23, y: -143, z: 45 },
      { x: -23, y: -143, z: 45 }
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
    baseAngle: 279,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 15, y: -94, z: 18 },
      { x: 43, y: -85, z: 18 },
      { x: 66, y: -129, z: 45 },
      { x: 23, y: -143, z: 45 }
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
    baseAngle: 297,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 43, y: -85, z: 18 },
      { x: 67, y: -67, z: 18 },
      { x: 103, y: -103, z: 45 },
      { x: 66, y: -129, z: 45 }
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
    baseAngle: 315,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 67, y: -67, z: 18 },
      { x: 85, y: -43, z: 18 },
      { x: 129, y: -66, z: 45 },
      { x: 103, y: -103, z: 45 }
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
    baseAngle: 333,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 85, y: -43, z: 18 },
      { x: 94, y: -15, z: 18 },
      { x: 143, y: -23, z: 45 },
      { x: 129, y: -66, z: 45 }
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
    baseAngle: 351,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 94, y: -15, z: 18 },
      { x: 94, y: 15, z: 18 },
      { x: 143, y: 23, z: 45 },
      { x: 143, y: -23, z: 45 }
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
    baseAngle: 9,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 94, y: 15, z: 18 },
      { x: 85, y: 43, z: 18 },
      { x: 129, y: 66, z: 45 },
      { x: 143, y: 23, z: 45 }
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
    baseAngle: 27,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 85, y: 43, z: 18 },
      { x: 67, y: 67, z: 18 },
      { x: 103, y: 103, z: 45 },
      { x: 129, y: 66, z: 45 }
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
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 103, y: 103, z: 35 },
      { x: 38, y: 140, z: 35 },
      { x: 45, y: 169, z: 52 },
      { x: 124, y: 124, z: 52 }
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
    baseAngle: 75,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 38, y: 140, z: 35 },
      { x: -38, y: 140, z: 35 },
      { x: -45, y: 169, z: 52 },
      { x: 45, y: 169, z: 52 }
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
    baseAngle: 105,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -38, y: 140, z: 35 },
      { x: -103, y: 103, z: 35 },
      { x: -124, y: 124, z: 52 },
      { x: -45, y: 169, z: 52 }
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
    baseAngle: 135,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -103, y: 103, z: 35 },
      { x: -140, y: 38, z: 35 },
      { x: -169, y: 45, z: 52 },
      { x: -124, y: 124, z: 52 }
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
    baseAngle: 165,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -140, y: 38, z: 35 },
      { x: -140, y: -38, z: 35 },
      { x: -169, y: -45, z: 52 },
      { x: -169, y: 45, z: 52 }
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
    baseAngle: 195,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -140, y: -38, z: 35 },
      { x: -103, y: -103, z: 35 },
      { x: -124, y: -124, z: 52 },
      { x: -169, y: -45, z: 52 }
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
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -103, y: -103, z: 35 },
      { x: -38, y: -140, z: 35 },
      { x: -45, y: -169, z: 52 },
      { x: -124, y: -124, z: 52 }
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
    baseAngle: 255,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -38, y: -140, z: 35 },
      { x: 38, y: -140, z: 35 },
      { x: 45, y: -169, z: 52 },
      { x: -45, y: -169, z: 52 }
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
    baseAngle: 285,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 38, y: -140, z: 35 },
      { x: 103, y: -103, z: 35 },
      { x: 124, y: -124, z: 52 },
      { x: 45, y: -169, z: 52 }
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
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 103, y: -103, z: 35 },
      { x: 140, y: -38, z: 35 },
      { x: 169, y: -45, z: 52 },
      { x: 124, y: -124, z: 52 }
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
    baseAngle: 345,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 140, y: -38, z: 35 },
      { x: 140, y: 38, z: 35 },
      { x: 169, y: 45, z: 52 },
      { x: 169, y: -45, z: 52 }
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
    baseAngle: 15,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 140, y: 38, z: 35 },
      { x: 103, y: 103, z: 35 },
      { x: 124, y: 124, z: 52 },
      { x: 169, y: 45, z: 52 }
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
    baseAngle: 45,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 124, y: 124, z: 52 },
      { x: 79, y: 156, z: 52 },
      { x: 111, y: 218, z: 95 },
      { x: 173, y: 173, z: 95 }
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
    baseAngle: 63,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 79, y: 156, z: 52 },
      { x: 27, y: 173, z: 52 },
      { x: 38, y: 242, z: 95 },
      { x: 111, y: 218, z: 95 }
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
    baseAngle: 81,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 27, y: 173, z: 52 },
      { x: -27, y: 173, z: 52 },
      { x: -38, y: 242, z: 95 },
      { x: 38, y: 242, z: 95 }
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
    baseAngle: 99,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -27, y: 173, z: 52 },
      { x: -79, y: 156, z: 52 },
      { x: -111, y: 218, z: 95 },
      { x: -38, y: 242, z: 95 }
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
    baseAngle: 117,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -79, y: 156, z: 52 },
      { x: -124, y: 124, z: 52 },
      { x: -173, y: 173, z: 95 },
      { x: -111, y: 218, z: 95 }
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
    baseAngle: 135,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -124, y: 124, z: 52 },
      { x: -156, y: 79, z: 52 },
      { x: -218, y: 111, z: 95 },
      { x: -173, y: 173, z: 95 }
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
    baseAngle: 153,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -156, y: 79, z: 52 },
      { x: -173, y: 27, z: 52 },
      { x: -242, y: 38, z: 95 },
      { x: -218, y: 111, z: 95 }
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
    baseAngle: 171,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -173, y: 27, z: 52 },
      { x: -173, y: -27, z: 52 },
      { x: -242, y: -38, z: 95 },
      { x: -242, y: 38, z: 95 }
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
    baseAngle: 189,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -173, y: -27, z: 52 },
      { x: -156, y: -79, z: 52 },
      { x: -218, y: -111, z: 95 },
      { x: -242, y: -38, z: 95 }
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
    baseAngle: 207,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -156, y: -79, z: 52 },
      { x: -124, y: -124, z: 52 },
      { x: -173, y: -173, z: 95 },
      { x: -218, y: -111, z: 95 }
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
    baseAngle: 225,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -124, y: -124, z: 52 },
      { x: -79, y: -156, z: 52 },
      { x: -111, y: -218, z: 95 },
      { x: -173, y: -173, z: 95 }
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
    baseAngle: 243,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -79, y: -156, z: 52 },
      { x: -27, y: -173, z: 52 },
      { x: -38, y: -242, z: 95 },
      { x: -111, y: -218, z: 95 }
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
    baseAngle: 261,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -27, y: -173, z: 52 },
      { x: 27, y: -173, z: 52 },
      { x: 38, y: -242, z: 95 },
      { x: -38, y: -242, z: 95 }
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
    baseAngle: 279,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 27, y: -173, z: 52 },
      { x: 79, y: -156, z: 52 },
      { x: 111, y: -218, z: 95 },
      { x: 38, y: -242, z: 95 }
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
    baseAngle: 297,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 79, y: -156, z: 52 },
      { x: 124, y: -124, z: 52 },
      { x: 173, y: -173, z: 95 },
      { x: 111, y: -218, z: 95 }
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
    baseAngle: 315,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 124, y: -124, z: 52 },
      { x: 156, y: -79, z: 52 },
      { x: 218, y: -111, z: 95 },
      { x: 173, y: -173, z: 95 }
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
    baseAngle: 333,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 156, y: -79, z: 52 },
      { x: 173, y: -27, z: 52 },
      { x: 242, y: -38, z: 95 },
      { x: 218, y: -111, z: 95 }
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
    baseAngle: 351,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 173, y: -27, z: 52 },
      { x: 173, y: 27, z: 52 },
      { x: 242, y: 38, z: 95 },
      { x: 242, y: -38, z: 95 }
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
    baseAngle: 9,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 173, y: 27, z: 52 },
      { x: 156, y: 79, z: 52 },
      { x: 218, y: 111, z: 95 },
      { x: 242, y: 38, z: 95 }
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
    baseAngle: 27,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 156, y: 79, z: 52 },
      { x: 124, y: 124, z: 52 },
      { x: 173, y: 173, z: 95 },
      { x: 218, y: 111, z: 95 }
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
    baseAngle: 45,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 113, y: 113, z: 42 },
      { x: 0, y: 160, z: 42 },
      { x: 0, y: 185, z: 42 },
      { x: 131, y: 131, z: 42 }
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
    baseAngle: 90,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 0, y: 160, z: 42 },
      { x: -113, y: 113, z: 42 },
      { x: -131, y: 131, z: 42 },
      { x: 0, y: 185, z: 42 }
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
    baseAngle: 135,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -113, y: 113, z: 42 },
      { x: -160, y: 0, z: 42 },
      { x: -185, y: 0, z: 42 },
      { x: -131, y: 131, z: 42 }
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
    baseAngle: 180,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -160, y: 0, z: 42 },
      { x: -113, y: -113, z: 42 },
      { x: -131, y: -131, z: 42 },
      { x: -185, y: 0, z: 42 }
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
    baseAngle: 225,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -113, y: -113, z: 42 },
      { x: -0, y: -160, z: 42 },
      { x: -0, y: -185, z: 42 },
      { x: -131, y: -131, z: 42 }
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
    baseAngle: 270,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -0, y: -160, z: 42 },
      { x: 113, y: -113, z: 42 },
      { x: 131, y: -131, z: 42 },
      { x: -0, y: -185, z: 42 }
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
    baseAngle: 315,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 113, y: -113, z: 42 },
      { x: 160, y: -0, z: 42 },
      { x: 185, y: -0, z: 42 },
      { x: 131, y: -131, z: 42 }
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
    baseAngle: 0,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 160, y: 0, z: 42 },
      { x: 113, y: 113, z: 42 },
      { x: 131, y: 131, z: 42 },
      { x: 185, y: 0, z: 42 }
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
    baseAngle: 45,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 173, y: 173, z: 30 },
      { x: 63, y: 237, z: 30 },
      { x: 69, y: 256, z: 30 },
      { x: 187, y: 187, z: 30 }
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
    baseAngle: 135,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -173, y: 173, z: 30 },
      { x: -237, y: 63, z: 30 },
      { x: -256, y: 69, z: 30 },
      { x: -187, y: 187, z: 30 }
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
    baseAngle: 225,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -173, y: -173, z: 30 },
      { x: -63, y: -237, z: 30 },
      { x: -69, y: -256, z: 30 },
      { x: -187, y: -187, z: 30 }
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
    baseAngle: 315,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 173, y: -173, z: 30 },
      { x: 237, y: -63, z: 30 },
      { x: 256, y: -69, z: 30 },
      { x: 187, y: -187, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const lambeaufieldSectionMap = new Map(
  lambeaufieldSections.map(section => [section.id, section])
);

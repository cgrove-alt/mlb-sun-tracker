// Bank of America Stadium - Comprehensive Section Data
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

export const bankofamericastadiumSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 75,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 16, y: 58, z: 0 },
      { x: -8, y: 59, z: 0 },
      { x: -12, y: 94, z: 15 },
      { x: 25, y: 92, z: 15 }
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
    baseAngle: 97.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -8, y: 59, z: 0 },
      { x: -30, y: 52, z: 0 },
      { x: -47, y: 82, z: 15 },
      { x: -12, y: 94, z: 15 }
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
    baseAngle: 120,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -30, y: 52, z: 0 },
      { x: -48, y: 37, z: 0 },
      { x: -75, y: 58, z: 15 },
      { x: -47, y: 82, z: 15 }
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
    baseAngle: 142.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -48, y: 37, z: 0 },
      { x: -58, y: 16, z: 0 },
      { x: -92, y: 25, z: 15 },
      { x: -75, y: 58, z: 15 }
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
    baseAngle: 165,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -58, y: 16, z: 0 },
      { x: -59, y: -8, z: 0 },
      { x: -94, y: -12, z: 15 },
      { x: -92, y: 25, z: 15 }
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
    baseAngle: 187.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -59, y: -8, z: 0 },
      { x: -52, y: -30, z: 0 },
      { x: -82, y: -48, z: 15 },
      { x: -94, y: -12, z: 15 }
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
    baseAngle: 210,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -52, y: -30, z: 0 },
      { x: -37, y: -48, z: 0 },
      { x: -58, y: -75, z: 15 },
      { x: -82, y: -48, z: 15 }
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
    baseAngle: 232.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -37, y: -48, z: 0 },
      { x: -16, y: -58, z: 0 },
      { x: -25, y: -92, z: 15 },
      { x: -58, y: -75, z: 15 }
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
    baseAngle: 255,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -16, y: -58, z: 0 },
      { x: 8, y: -59, z: 0 },
      { x: 12, y: -94, z: 15 },
      { x: -25, y: -92, z: 15 }
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
    baseAngle: 277.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 8, y: -59, z: 0 },
      { x: 30, y: -52, z: 0 },
      { x: 48, y: -82, z: 15 },
      { x: 12, y: -94, z: 15 }
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
    baseAngle: 300,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 30, y: -52, z: 0 },
      { x: 48, y: -37, z: 0 },
      { x: 75, y: -58, z: 15 },
      { x: 48, y: -82, z: 15 }
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
    baseAngle: 322.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 48, y: -37, z: 0 },
      { x: 58, y: -16, z: 0 },
      { x: 92, y: -25, z: 15 },
      { x: 75, y: -58, z: 15 }
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
    baseAngle: 345,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 58, y: -16, z: 0 },
      { x: 59, y: 8, z: 0 },
      { x: 94, y: 12, z: 15 },
      { x: 92, y: -25, z: 15 }
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
    baseAngle: 7.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 59, y: 8, z: 0 },
      { x: 52, y: 30, z: 0 },
      { x: 82, y: 47, z: 15 },
      { x: 94, y: 12, z: 15 }
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
    baseAngle: 30,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 52, y: 30, z: 0 },
      { x: 37, y: 48, z: 0 },
      { x: 58, y: 75, z: 15 },
      { x: 82, y: 47, z: 15 }
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
    baseAngle: 52.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 37, y: 48, z: 0 },
      { x: 16, y: 58, z: 0 },
      { x: 25, y: 92, z: 15 },
      { x: 58, y: 75, z: 15 }
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
    baseAngle: 75,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 25, y: 92, z: 18 },
      { x: -5, y: 95, z: 18 },
      { x: -8, y: 145, z: 45 },
      { x: 38, y: 140, z: 45 }
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
    baseAngle: 93,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -5, y: 95, z: 18 },
      { x: -34, y: 89, z: 18 },
      { x: -52, y: 135, z: 45 },
      { x: -8, y: 145, z: 45 }
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
    baseAngle: 111,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -34, y: 89, z: 18 },
      { x: -60, y: 74, z: 18 },
      { x: -91, y: 113, z: 45 },
      { x: -52, y: 135, z: 45 }
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
    baseAngle: 129,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -60, y: 74, z: 18 },
      { x: -80, y: 52, z: 18 },
      { x: -122, y: 79, z: 45 },
      { x: -91, y: 113, z: 45 }
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
    baseAngle: 147,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -80, y: 52, z: 18 },
      { x: -92, y: 25, z: 18 },
      { x: -140, y: 38, z: 45 },
      { x: -122, y: 79, z: 45 }
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
    baseAngle: 165,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -92, y: 25, z: 18 },
      { x: -95, y: -5, z: 18 },
      { x: -145, y: -8, z: 45 },
      { x: -140, y: 38, z: 45 }
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
    baseAngle: 183,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: -5, z: 18 },
      { x: -89, y: -34, z: 18 },
      { x: -135, y: -52, z: 45 },
      { x: -145, y: -8, z: 45 }
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
    baseAngle: 201,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -89, y: -34, z: 18 },
      { x: -74, y: -60, z: 18 },
      { x: -113, y: -91, z: 45 },
      { x: -135, y: -52, z: 45 }
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
    baseAngle: 219,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -74, y: -60, z: 18 },
      { x: -52, y: -80, z: 18 },
      { x: -79, y: -122, z: 45 },
      { x: -113, y: -91, z: 45 }
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
    baseAngle: 237,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -52, y: -80, z: 18 },
      { x: -25, y: -92, z: 18 },
      { x: -38, y: -140, z: 45 },
      { x: -79, y: -122, z: 45 }
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
    baseAngle: 255,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -25, y: -92, z: 18 },
      { x: 5, y: -95, z: 18 },
      { x: 8, y: -145, z: 45 },
      { x: -38, y: -140, z: 45 }
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
    baseAngle: 273,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 5, y: -95, z: 18 },
      { x: 34, y: -89, z: 18 },
      { x: 52, y: -135, z: 45 },
      { x: 8, y: -145, z: 45 }
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
    baseAngle: 291,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 34, y: -89, z: 18 },
      { x: 60, y: -74, z: 18 },
      { x: 91, y: -113, z: 45 },
      { x: 52, y: -135, z: 45 }
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
    baseAngle: 309,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 60, y: -74, z: 18 },
      { x: 80, y: -52, z: 18 },
      { x: 122, y: -79, z: 45 },
      { x: 91, y: -113, z: 45 }
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
    baseAngle: 327,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 80, y: -52, z: 18 },
      { x: 92, y: -25, z: 18 },
      { x: 140, y: -38, z: 45 },
      { x: 122, y: -79, z: 45 }
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
    baseAngle: 345,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 92, y: -25, z: 18 },
      { x: 95, y: 5, z: 18 },
      { x: 145, y: 8, z: 45 },
      { x: 140, y: -38, z: 45 }
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
    baseAngle: 3,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: 5, z: 18 },
      { x: 89, y: 34, z: 18 },
      { x: 135, y: 52, z: 45 },
      { x: 145, y: 8, z: 45 }
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
    baseAngle: 21,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 89, y: 34, z: 18 },
      { x: 74, y: 60, z: 18 },
      { x: 113, y: 91, z: 45 },
      { x: 135, y: 52, z: 45 }
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
    baseAngle: 39,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 74, y: 60, z: 18 },
      { x: 52, y: 80, z: 18 },
      { x: 79, y: 122, z: 45 },
      { x: 113, y: 91, z: 45 }
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
    baseAngle: 57,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 52, y: 80, z: 18 },
      { x: 25, y: 92, z: 18 },
      { x: 38, y: 140, z: 45 },
      { x: 79, y: 122, z: 45 }
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
    id: 'CL-301',
    name: 'Club 301',
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
    id: 'CL-302',
    name: 'Club 302',
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
    id: 'CL-303',
    name: 'Club 303',
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
    id: 'CL-304',
    name: 'Club 304',
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
    id: 'CL-305',
    name: 'Club 305',
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
    id: 'CL-306',
    name: 'Club 306',
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
    id: 'CL-307',
    name: 'Club 307',
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
    id: 'CL-308',
    name: 'Club 308',
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
    id: 'CL-309',
    name: 'Club 309',
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
    id: 'CL-310',
    name: 'Club 310',
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
    id: 'CL-311',
    name: 'Club 311',
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
    id: '500',
    name: 'Upper 500',
    level: 'upper',
    baseAngle: 75,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 45, y: 169, z: 52 },
      { x: -9, y: 175, z: 52 },
      { x: -13, y: 245, z: 95 },
      { x: 63, y: 237, z: 95 }
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
    baseAngle: 93,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -9, y: 175, z: 52 },
      { x: -63, y: 163, z: 52 },
      { x: -88, y: 229, z: 95 },
      { x: -13, y: 245, z: 95 }
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
    baseAngle: 111,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -63, y: 163, z: 52 },
      { x: -110, y: 136, z: 52 },
      { x: -154, y: 190, z: 95 },
      { x: -88, y: 229, z: 95 }
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
    baseAngle: 129,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -110, y: 136, z: 52 },
      { x: -147, y: 95, z: 52 },
      { x: -205, y: 133, z: 95 },
      { x: -154, y: 190, z: 95 }
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
    baseAngle: 147,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -147, y: 95, z: 52 },
      { x: -169, y: 45, z: 52 },
      { x: -237, y: 63, z: 95 },
      { x: -205, y: 133, z: 95 }
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
    baseAngle: 165,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -169, y: 45, z: 52 },
      { x: -175, y: -9, z: 52 },
      { x: -245, y: -13, z: 95 },
      { x: -237, y: 63, z: 95 }
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
    baseAngle: 183,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -175, y: -9, z: 52 },
      { x: -163, y: -63, z: 52 },
      { x: -229, y: -88, z: 95 },
      { x: -245, y: -13, z: 95 }
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
    baseAngle: 201,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -163, y: -63, z: 52 },
      { x: -136, y: -110, z: 52 },
      { x: -190, y: -154, z: 95 },
      { x: -229, y: -88, z: 95 }
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
    baseAngle: 219,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -136, y: -110, z: 52 },
      { x: -95, y: -147, z: 52 },
      { x: -133, y: -205, z: 95 },
      { x: -190, y: -154, z: 95 }
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
    baseAngle: 237,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -95, y: -147, z: 52 },
      { x: -45, y: -169, z: 52 },
      { x: -63, y: -237, z: 95 },
      { x: -133, y: -205, z: 95 }
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
    baseAngle: 255,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -45, y: -169, z: 52 },
      { x: 9, y: -175, z: 52 },
      { x: 13, y: -245, z: 95 },
      { x: -63, y: -237, z: 95 }
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
    baseAngle: 273,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 9, y: -175, z: 52 },
      { x: 63, y: -163, z: 52 },
      { x: 88, y: -229, z: 95 },
      { x: 13, y: -245, z: 95 }
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
    baseAngle: 291,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 63, y: -163, z: 52 },
      { x: 110, y: -136, z: 52 },
      { x: 154, y: -190, z: 95 },
      { x: 88, y: -229, z: 95 }
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
    baseAngle: 309,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 110, y: -136, z: 52 },
      { x: 147, y: -95, z: 52 },
      { x: 205, y: -133, z: 95 },
      { x: 154, y: -190, z: 95 }
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
    baseAngle: 327,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 147, y: -95, z: 52 },
      { x: 169, y: -45, z: 52 },
      { x: 237, y: -63, z: 95 },
      { x: 205, y: -133, z: 95 }
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
    baseAngle: 345,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 169, y: -45, z: 52 },
      { x: 175, y: 9, z: 52 },
      { x: 245, y: 13, z: 95 },
      { x: 237, y: -63, z: 95 }
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
    baseAngle: 3,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 175, y: 9, z: 52 },
      { x: 163, y: 63, z: 52 },
      { x: 229, y: 88, z: 95 },
      { x: 245, y: 13, z: 95 }
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
    baseAngle: 21,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 163, y: 63, z: 52 },
      { x: 136, y: 110, z: 52 },
      { x: 190, y: 154, z: 95 },
      { x: 229, y: 88, z: 95 }
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
    baseAngle: 39,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 136, y: 110, z: 52 },
      { x: 95, y: 147, z: 52 },
      { x: 133, y: 205, z: 95 },
      { x: 190, y: 154, z: 95 }
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
    baseAngle: 57,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 95, y: 147, z: 52 },
      { x: 45, y: 169, z: 52 },
      { x: 63, y: 237, z: 95 },
      { x: 133, y: 205, z: 95 }
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
    baseAngle: 75,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 41, y: 155, z: 42 },
      { x: -80, y: 139, z: 42 },
      { x: -92, y: 160, z: 42 },
      { x: 48, y: 179, z: 42 }
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
    baseAngle: 120,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -80, y: 139, z: 42 },
      { x: -155, y: 41, z: 42 },
      { x: -179, y: 48, z: 42 },
      { x: -92, y: 160, z: 42 }
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
    baseAngle: 165,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -155, y: 41, z: 42 },
      { x: -139, y: -80, z: 42 },
      { x: -160, y: -93, z: 42 },
      { x: -179, y: 48, z: 42 }
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
    baseAngle: 210,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -139, y: -80, z: 42 },
      { x: -41, y: -155, z: 42 },
      { x: -48, y: -179, z: 42 },
      { x: -160, y: -93, z: 42 }
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
    baseAngle: 255,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -41, y: -155, z: 42 },
      { x: 80, y: -139, z: 42 },
      { x: 93, y: -160, z: 42 },
      { x: -48, y: -179, z: 42 }
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
    baseAngle: 300,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 80, y: -139, z: 42 },
      { x: 155, y: -41, z: 42 },
      { x: 179, y: -48, z: 42 },
      { x: 93, y: -160, z: 42 }
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
    baseAngle: 345,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 155, y: -41, z: 42 },
      { x: 139, y: 80, z: 42 },
      { x: 160, y: 92, z: 42 },
      { x: 179, y: -48, z: 42 }
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
    baseAngle: 30,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 139, y: 80, z: 42 },
      { x: 41, y: 155, z: 42 },
      { x: 48, y: 179, z: 42 },
      { x: 160, y: 92, z: 42 }
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
    baseAngle: 75,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 63, y: 237, z: 30 },
      { x: -63, y: 237, z: 30 },
      { x: -69, y: 256, z: 30 },
      { x: 69, y: 256, z: 30 }
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
    baseAngle: 165,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -237, y: 63, z: 30 },
      { x: -237, y: -63, z: 30 },
      { x: -256, y: -69, z: 30 },
      { x: -256, y: 69, z: 30 }
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
    baseAngle: 255,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -63, y: -237, z: 30 },
      { x: 63, y: -237, z: 30 },
      { x: 69, y: -256, z: 30 },
      { x: -69, y: -256, z: 30 }
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
    baseAngle: 345,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 237, y: -63, z: 30 },
      { x: 237, y: 63, z: 30 },
      { x: 256, y: 69, z: 30 },
      { x: 256, y: -69, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const bankofamericastadiumSectionMap = new Map(
  bankofamericastadiumSections.map(section => [section.id, section])
);

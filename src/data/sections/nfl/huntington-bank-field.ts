// Huntington Bank Field - Comprehensive Section Data
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

export const huntingtonbankfieldSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 287,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 18, y: -57, z: 0 },
      { x: 38, y: -46, z: 0 },
      { x: 60, y: -73, z: 15 },
      { x: 28, y: -91, z: 15 }
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
    baseAngle: 309.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 38, y: -46, z: 0 },
      { x: 53, y: -28, z: 0 },
      { x: 84, y: -45, z: 15 },
      { x: 60, y: -73, z: 15 }
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
    baseAngle: 332,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 53, y: -28, z: 0 },
      { x: 60, y: -6, z: 0 },
      { x: 95, y: -9, z: 15 },
      { x: 84, y: -45, z: 15 }
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
    baseAngle: 354.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 60, y: -6, z: 0 },
      { x: 57, y: 18, z: 0 },
      { x: 91, y: 28, z: 15 },
      { x: 95, y: -9, z: 15 }
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
    baseAngle: 17,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 57, y: 18, z: 0 },
      { x: 46, y: 38, z: 0 },
      { x: 73, y: 60, z: 15 },
      { x: 91, y: 28, z: 15 }
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
    baseAngle: 39.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 46, y: 38, z: 0 },
      { x: 28, y: 53, z: 0 },
      { x: 45, y: 84, z: 15 },
      { x: 73, y: 60, z: 15 }
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
    baseAngle: 62,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 28, y: 53, z: 0 },
      { x: 6, y: 60, z: 0 },
      { x: 9, y: 95, z: 15 },
      { x: 45, y: 84, z: 15 }
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
    baseAngle: 84.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 6, y: 60, z: 0 },
      { x: -18, y: 57, z: 0 },
      { x: -28, y: 91, z: 15 },
      { x: 9, y: 95, z: 15 }
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
    baseAngle: 107,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -18, y: 57, z: 0 },
      { x: -38, y: 46, z: 0 },
      { x: -60, y: 73, z: 15 },
      { x: -28, y: 91, z: 15 }
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
    baseAngle: 129.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -38, y: 46, z: 0 },
      { x: -53, y: 28, z: 0 },
      { x: -84, y: 45, z: 15 },
      { x: -60, y: 73, z: 15 }
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
    baseAngle: 152,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -53, y: 28, z: 0 },
      { x: -60, y: 6, z: 0 },
      { x: -95, y: 9, z: 15 },
      { x: -84, y: 45, z: 15 }
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
    baseAngle: 174.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -60, y: 6, z: 0 },
      { x: -57, y: -18, z: 0 },
      { x: -91, y: -28, z: 15 },
      { x: -95, y: 9, z: 15 }
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
    baseAngle: 197,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -57, y: -18, z: 0 },
      { x: -46, y: -38, z: 0 },
      { x: -73, y: -60, z: 15 },
      { x: -91, y: -28, z: 15 }
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
    baseAngle: 219.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -46, y: -38, z: 0 },
      { x: -28, y: -53, z: 0 },
      { x: -45, y: -84, z: 15 },
      { x: -73, y: -60, z: 15 }
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
    baseAngle: 242,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -28, y: -53, z: 0 },
      { x: -6, y: -60, z: 0 },
      { x: -9, y: -95, z: 15 },
      { x: -45, y: -84, z: 15 }
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
    baseAngle: 264.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -6, y: -60, z: 0 },
      { x: 18, y: -57, z: 0 },
      { x: 28, y: -91, z: 15 },
      { x: -9, y: -95, z: 15 }
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
    baseAngle: 287,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 28, y: -91, z: 18 },
      { x: 54, y: -78, z: 18 },
      { x: 83, y: -119, z: 45 },
      { x: 42, y: -139, z: 45 }
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
    baseAngle: 305,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 54, y: -78, z: 18 },
      { x: 76, y: -57, z: 18 },
      { x: 116, y: -87, z: 45 },
      { x: 83, y: -119, z: 45 }
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
    baseAngle: 323,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 76, y: -57, z: 18 },
      { x: 90, y: -31, z: 18 },
      { x: 137, y: -47, z: 45 },
      { x: 116, y: -87, z: 45 }
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
    baseAngle: 341,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 90, y: -31, z: 18 },
      { x: 95, y: -2, z: 18 },
      { x: 145, y: -3, z: 45 },
      { x: 137, y: -47, z: 45 }
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
    baseAngle: 359,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: -2, z: 18 },
      { x: 91, y: 28, z: 18 },
      { x: 139, y: 42, z: 45 },
      { x: 145, y: -3, z: 45 }
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
    baseAngle: 17,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 91, y: 28, z: 18 },
      { x: 78, y: 54, z: 18 },
      { x: 119, y: 83, z: 45 },
      { x: 139, y: 42, z: 45 }
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
    baseAngle: 35,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 78, y: 54, z: 18 },
      { x: 57, y: 76, z: 18 },
      { x: 87, y: 116, z: 45 },
      { x: 119, y: 83, z: 45 }
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
    baseAngle: 53,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 57, y: 76, z: 18 },
      { x: 31, y: 90, z: 18 },
      { x: 47, y: 137, z: 45 },
      { x: 87, y: 116, z: 45 }
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
    baseAngle: 71,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 31, y: 90, z: 18 },
      { x: 2, y: 95, z: 18 },
      { x: 3, y: 145, z: 45 },
      { x: 47, y: 137, z: 45 }
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
    baseAngle: 89,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 2, y: 95, z: 18 },
      { x: -28, y: 91, z: 18 },
      { x: -42, y: 139, z: 45 },
      { x: 3, y: 145, z: 45 }
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
    baseAngle: 107,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -28, y: 91, z: 18 },
      { x: -54, y: 78, z: 18 },
      { x: -83, y: 119, z: 45 },
      { x: -42, y: 139, z: 45 }
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
    baseAngle: 125,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -54, y: 78, z: 18 },
      { x: -76, y: 57, z: 18 },
      { x: -116, y: 87, z: 45 },
      { x: -83, y: 119, z: 45 }
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
    baseAngle: 143,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -76, y: 57, z: 18 },
      { x: -90, y: 31, z: 18 },
      { x: -137, y: 47, z: 45 },
      { x: -116, y: 87, z: 45 }
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
    baseAngle: 161,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -90, y: 31, z: 18 },
      { x: -95, y: 2, z: 18 },
      { x: -145, y: 3, z: 45 },
      { x: -137, y: 47, z: 45 }
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
    baseAngle: 179,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: 2, z: 18 },
      { x: -91, y: -28, z: 18 },
      { x: -139, y: -42, z: 45 },
      { x: -145, y: 3, z: 45 }
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
    baseAngle: 197,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -91, y: -28, z: 18 },
      { x: -78, y: -54, z: 18 },
      { x: -119, y: -83, z: 45 },
      { x: -139, y: -42, z: 45 }
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
    baseAngle: 215,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -78, y: -54, z: 18 },
      { x: -57, y: -76, z: 18 },
      { x: -87, y: -116, z: 45 },
      { x: -119, y: -83, z: 45 }
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
    baseAngle: 233,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -57, y: -76, z: 18 },
      { x: -31, y: -90, z: 18 },
      { x: -47, y: -137, z: 45 },
      { x: -87, y: -116, z: 45 }
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
    baseAngle: 251,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -31, y: -90, z: 18 },
      { x: -2, y: -95, z: 18 },
      { x: -3, y: -145, z: 45 },
      { x: -47, y: -137, z: 45 }
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
    baseAngle: 269,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -2, y: -95, z: 18 },
      { x: 28, y: -91, z: 18 },
      { x: 42, y: -139, z: 45 },
      { x: -3, y: -145, z: 45 }
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
    baseAngle: 287,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 42, y: -139, z: 35 },
      { x: 106, y: -99, z: 35 },
      { x: 128, y: -119, z: 52 },
      { x: 51, y: -167, z: 52 }
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
    baseAngle: 317,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 106, y: -99, z: 35 },
      { x: 141, y: -33, z: 35 },
      { x: 171, y: -39, z: 52 },
      { x: 128, y: -119, z: 52 }
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
    baseAngle: 347,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 141, y: -33, z: 35 },
      { x: 139, y: 42, z: 35 },
      { x: 167, y: 51, z: 52 },
      { x: 171, y: -39, z: 52 }
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
    baseAngle: 17,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 139, y: 42, z: 35 },
      { x: 99, y: 106, z: 35 },
      { x: 119, y: 128, z: 52 },
      { x: 167, y: 51, z: 52 }
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
    baseAngle: 47,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 99, y: 106, z: 35 },
      { x: 33, y: 141, z: 35 },
      { x: 39, y: 171, z: 52 },
      { x: 119, y: 128, z: 52 }
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
    baseAngle: 77,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 33, y: 141, z: 35 },
      { x: -42, y: 139, z: 35 },
      { x: -51, y: 167, z: 52 },
      { x: 39, y: 171, z: 52 }
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
    baseAngle: 107,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -42, y: 139, z: 35 },
      { x: -106, y: 99, z: 35 },
      { x: -128, y: 119, z: 52 },
      { x: -51, y: 167, z: 52 }
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
    baseAngle: 137,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -106, y: 99, z: 35 },
      { x: -141, y: 33, z: 35 },
      { x: -171, y: 39, z: 52 },
      { x: -128, y: 119, z: 52 }
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
    baseAngle: 167,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -141, y: 33, z: 35 },
      { x: -139, y: -42, z: 35 },
      { x: -167, y: -51, z: 52 },
      { x: -171, y: 39, z: 52 }
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
    baseAngle: 197,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -139, y: -42, z: 35 },
      { x: -99, y: -106, z: 35 },
      { x: -119, y: -128, z: 52 },
      { x: -167, y: -51, z: 52 }
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
    baseAngle: 227,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -99, y: -106, z: 35 },
      { x: -33, y: -141, z: 35 },
      { x: -39, y: -171, z: 52 },
      { x: -119, y: -128, z: 52 }
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
    baseAngle: 257,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -33, y: -141, z: 35 },
      { x: 42, y: -139, z: 35 },
      { x: 51, y: -167, z: 52 },
      { x: -39, y: -171, z: 52 }
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
    baseAngle: 287,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 51, y: -167, z: 52 },
      { x: 100, y: -143, z: 52 },
      { x: 141, y: -201, z: 95 },
      { x: 72, y: -234, z: 95 }
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
    baseAngle: 305,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 100, y: -143, z: 52 },
      { x: 140, y: -105, z: 52 },
      { x: 196, y: -147, z: 95 },
      { x: 141, y: -201, z: 95 }
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
    baseAngle: 323,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 140, y: -105, z: 52 },
      { x: 165, y: -57, z: 52 },
      { x: 232, y: -80, z: 95 },
      { x: 196, y: -147, z: 95 }
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
    baseAngle: 341,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 165, y: -57, z: 52 },
      { x: 175, y: -3, z: 52 },
      { x: 245, y: -4, z: 95 },
      { x: 232, y: -80, z: 95 }
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
    baseAngle: 359,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 175, y: -3, z: 52 },
      { x: 167, y: 51, z: 52 },
      { x: 234, y: 72, z: 95 },
      { x: 245, y: -4, z: 95 }
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
    baseAngle: 17,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 167, y: 51, z: 52 },
      { x: 143, y: 100, z: 52 },
      { x: 201, y: 141, z: 95 },
      { x: 234, y: 72, z: 95 }
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
    baseAngle: 35,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 143, y: 100, z: 52 },
      { x: 105, y: 140, z: 52 },
      { x: 147, y: 196, z: 95 },
      { x: 201, y: 141, z: 95 }
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
    baseAngle: 53,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 105, y: 140, z: 52 },
      { x: 57, y: 165, z: 52 },
      { x: 80, y: 232, z: 95 },
      { x: 147, y: 196, z: 95 }
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
    baseAngle: 71,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 57, y: 165, z: 52 },
      { x: 3, y: 175, z: 52 },
      { x: 4, y: 245, z: 95 },
      { x: 80, y: 232, z: 95 }
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
    baseAngle: 89,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 3, y: 175, z: 52 },
      { x: -51, y: 167, z: 52 },
      { x: -72, y: 234, z: 95 },
      { x: 4, y: 245, z: 95 }
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
    baseAngle: 107,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -51, y: 167, z: 52 },
      { x: -100, y: 143, z: 52 },
      { x: -141, y: 201, z: 95 },
      { x: -72, y: 234, z: 95 }
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
    baseAngle: 125,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -100, y: 143, z: 52 },
      { x: -140, y: 105, z: 52 },
      { x: -196, y: 147, z: 95 },
      { x: -141, y: 201, z: 95 }
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
    baseAngle: 143,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -140, y: 105, z: 52 },
      { x: -165, y: 57, z: 52 },
      { x: -232, y: 80, z: 95 },
      { x: -196, y: 147, z: 95 }
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
    baseAngle: 161,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -165, y: 57, z: 52 },
      { x: -175, y: 3, z: 52 },
      { x: -245, y: 4, z: 95 },
      { x: -232, y: 80, z: 95 }
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
    baseAngle: 179,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -175, y: 3, z: 52 },
      { x: -167, y: -51, z: 52 },
      { x: -234, y: -72, z: 95 },
      { x: -245, y: 4, z: 95 }
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
    baseAngle: 197,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -167, y: -51, z: 52 },
      { x: -143, y: -100, z: 52 },
      { x: -201, y: -141, z: 95 },
      { x: -234, y: -72, z: 95 }
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
    baseAngle: 215,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -143, y: -100, z: 52 },
      { x: -105, y: -140, z: 52 },
      { x: -147, y: -196, z: 95 },
      { x: -201, y: -141, z: 95 }
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
    baseAngle: 233,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -105, y: -140, z: 52 },
      { x: -57, y: -165, z: 52 },
      { x: -80, y: -232, z: 95 },
      { x: -147, y: -196, z: 95 }
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
    baseAngle: 251,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -57, y: -165, z: 52 },
      { x: -3, y: -175, z: 52 },
      { x: -4, y: -245, z: 95 },
      { x: -80, y: -232, z: 95 }
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
    baseAngle: 269,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -3, y: -175, z: 52 },
      { x: 51, y: -167, z: 52 },
      { x: 72, y: -234, z: 95 },
      { x: -4, y: -245, z: 95 }
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
    baseAngle: 287,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 47, y: -153, z: 42 },
      { x: 141, y: -75, z: 42 },
      { x: 163, y: -87, z: 42 },
      { x: 54, y: -177, z: 42 }
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
    baseAngle: 332,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 141, y: -75, z: 42 },
      { x: 153, y: 47, z: 42 },
      { x: 177, y: 54, z: 42 },
      { x: 163, y: -87, z: 42 }
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
    baseAngle: 17,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 153, y: 47, z: 42 },
      { x: 75, y: 141, z: 42 },
      { x: 87, y: 163, z: 42 },
      { x: 177, y: 54, z: 42 }
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
    baseAngle: 62,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 75, y: 141, z: 42 },
      { x: -47, y: 153, z: 42 },
      { x: -54, y: 177, z: 42 },
      { x: 87, y: 163, z: 42 }
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
    baseAngle: 107,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -47, y: 153, z: 42 },
      { x: -141, y: 75, z: 42 },
      { x: -163, y: 87, z: 42 },
      { x: -54, y: 177, z: 42 }
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
    baseAngle: 152,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -141, y: 75, z: 42 },
      { x: -153, y: -47, z: 42 },
      { x: -177, y: -54, z: 42 },
      { x: -163, y: 87, z: 42 }
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
    baseAngle: 197,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -153, y: -47, z: 42 },
      { x: -75, y: -141, z: 42 },
      { x: -87, y: -163, z: 42 },
      { x: -177, y: -54, z: 42 }
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
    baseAngle: 242,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -75, y: -141, z: 42 },
      { x: 47, y: -153, z: 42 },
      { x: 54, y: -177, z: 42 },
      { x: -87, y: -163, z: 42 }
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
    baseAngle: 287,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 72, y: -234, z: 30 },
      { x: 179, y: -167, z: 30 },
      { x: 194, y: -181, z: 30 },
      { x: 77, y: -253, z: 30 }
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
    baseAngle: 17,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 234, y: 72, z: 30 },
      { x: 167, y: 179, z: 30 },
      { x: 181, y: 194, z: 30 },
      { x: 253, y: 77, z: 30 }
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
    baseAngle: 107,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -72, y: 234, z: 30 },
      { x: -179, y: 167, z: 30 },
      { x: -194, y: 181, z: 30 },
      { x: -77, y: 253, z: 30 }
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
    baseAngle: 197,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -234, y: -72, z: 30 },
      { x: -167, y: -179, z: 30 },
      { x: -181, y: -194, z: 30 },
      { x: -253, y: -77, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const huntingtonbankfieldSectionMap = new Map(
  huntingtonbankfieldSections.map(section => [section.id, section])
);

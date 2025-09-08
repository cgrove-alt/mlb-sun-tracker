// AT&T Stadium - Comprehensive Section Data
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

export const attstadiumSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 340,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 56, y: -21, z: 0 },
      { x: 60, y: 3, z: 0 },
      { x: 95, y: 4, z: 15 },
      { x: 89, y: -32, z: 15 }
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
    baseAngle: 2.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 60, y: 3, z: 0 },
      { x: 54, y: 25, z: 0 },
      { x: 86, y: 40, z: 15 },
      { x: 95, y: 4, z: 15 }
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
    baseAngle: 25,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 54, y: 25, z: 0 },
      { x: 41, y: 44, z: 0 },
      { x: 64, y: 70, z: 15 },
      { x: 86, y: 40, z: 15 }
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
    baseAngle: 47.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 41, y: 44, z: 0 },
      { x: 21, y: 56, z: 0 },
      { x: 32, y: 89, z: 15 },
      { x: 64, y: 70, z: 15 }
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
    baseAngle: 70,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 21, y: 56, z: 0 },
      { x: -3, y: 60, z: 0 },
      { x: -4, y: 95, z: 15 },
      { x: 32, y: 89, z: 15 }
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
    baseAngle: 92.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -3, y: 60, z: 0 },
      { x: -25, y: 54, z: 0 },
      { x: -40, y: 86, z: 15 },
      { x: -4, y: 95, z: 15 }
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
    baseAngle: 115,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -25, y: 54, z: 0 },
      { x: -44, y: 41, z: 0 },
      { x: -70, y: 64, z: 15 },
      { x: -40, y: 86, z: 15 }
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
    baseAngle: 137.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -44, y: 41, z: 0 },
      { x: -56, y: 21, z: 0 },
      { x: -89, y: 32, z: 15 },
      { x: -70, y: 64, z: 15 }
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
    baseAngle: 160,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -56, y: 21, z: 0 },
      { x: -60, y: -3, z: 0 },
      { x: -95, y: -4, z: 15 },
      { x: -89, y: 32, z: 15 }
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
    baseAngle: 182.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -60, y: -3, z: 0 },
      { x: -54, y: -25, z: 0 },
      { x: -86, y: -40, z: 15 },
      { x: -95, y: -4, z: 15 }
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
    baseAngle: 205,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -54, y: -25, z: 0 },
      { x: -41, y: -44, z: 0 },
      { x: -64, y: -70, z: 15 },
      { x: -86, y: -40, z: 15 }
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
    baseAngle: 227.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -41, y: -44, z: 0 },
      { x: -21, y: -56, z: 0 },
      { x: -32, y: -89, z: 15 },
      { x: -64, y: -70, z: 15 }
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
    baseAngle: 250,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -21, y: -56, z: 0 },
      { x: 3, y: -60, z: 0 },
      { x: 4, y: -95, z: 15 },
      { x: -32, y: -89, z: 15 }
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
    baseAngle: 272.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 3, y: -60, z: 0 },
      { x: 25, y: -54, z: 0 },
      { x: 40, y: -86, z: 15 },
      { x: 4, y: -95, z: 15 }
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
    baseAngle: 295,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 25, y: -54, z: 0 },
      { x: 44, y: -41, z: 0 },
      { x: 70, y: -64, z: 15 },
      { x: 40, y: -86, z: 15 }
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
    baseAngle: 317.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 44, y: -41, z: 0 },
      { x: 56, y: -21, z: 0 },
      { x: 89, y: -32, z: 15 },
      { x: 70, y: -64, z: 15 }
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
    baseAngle: 340,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 89, y: -32, z: 18 },
      { x: 95, y: -3, z: 18 },
      { x: 145, y: -5, z: 45 },
      { x: 136, y: -50, z: 45 }
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
    baseAngle: 358,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: -3, z: 18 },
      { x: 91, y: 26, z: 18 },
      { x: 139, y: 40, z: 45 },
      { x: 145, y: -5, z: 45 }
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
    baseAngle: 16,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 91, y: 26, z: 18 },
      { x: 79, y: 53, z: 18 },
      { x: 120, y: 81, z: 45 },
      { x: 139, y: 40, z: 45 }
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
    baseAngle: 34,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 79, y: 53, z: 18 },
      { x: 58, y: 75, z: 18 },
      { x: 89, y: 114, z: 45 },
      { x: 120, y: 81, z: 45 }
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
    baseAngle: 52,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 58, y: 75, z: 18 },
      { x: 32, y: 89, z: 18 },
      { x: 50, y: 136, z: 45 },
      { x: 89, y: 114, z: 45 }
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
    baseAngle: 70,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 32, y: 89, z: 18 },
      { x: 3, y: 95, z: 18 },
      { x: 5, y: 145, z: 45 },
      { x: 50, y: 136, z: 45 }
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
    baseAngle: 88,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 3, y: 95, z: 18 },
      { x: -26, y: 91, z: 18 },
      { x: -40, y: 139, z: 45 },
      { x: 5, y: 145, z: 45 }
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
    baseAngle: 106,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -26, y: 91, z: 18 },
      { x: -53, y: 79, z: 18 },
      { x: -81, y: 120, z: 45 },
      { x: -40, y: 139, z: 45 }
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
    baseAngle: 124,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -53, y: 79, z: 18 },
      { x: -75, y: 58, z: 18 },
      { x: -114, y: 89, z: 45 },
      { x: -81, y: 120, z: 45 }
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
    baseAngle: 142,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -75, y: 58, z: 18 },
      { x: -89, y: 32, z: 18 },
      { x: -136, y: 50, z: 45 },
      { x: -114, y: 89, z: 45 }
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
    baseAngle: 160,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -89, y: 32, z: 18 },
      { x: -95, y: 3, z: 18 },
      { x: -145, y: 5, z: 45 },
      { x: -136, y: 50, z: 45 }
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
    baseAngle: 178,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: 3, z: 18 },
      { x: -91, y: -26, z: 18 },
      { x: -139, y: -40, z: 45 },
      { x: -145, y: 5, z: 45 }
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
    baseAngle: 196,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -91, y: -26, z: 18 },
      { x: -79, y: -53, z: 18 },
      { x: -120, y: -81, z: 45 },
      { x: -139, y: -40, z: 45 }
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
    baseAngle: 214,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -79, y: -53, z: 18 },
      { x: -58, y: -75, z: 18 },
      { x: -89, y: -114, z: 45 },
      { x: -120, y: -81, z: 45 }
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
    baseAngle: 232,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -58, y: -75, z: 18 },
      { x: -32, y: -89, z: 18 },
      { x: -50, y: -136, z: 45 },
      { x: -89, y: -114, z: 45 }
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
    baseAngle: 250,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -32, y: -89, z: 18 },
      { x: -3, y: -95, z: 18 },
      { x: -5, y: -145, z: 45 },
      { x: -50, y: -136, z: 45 }
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
    baseAngle: 268,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -3, y: -95, z: 18 },
      { x: 26, y: -91, z: 18 },
      { x: 40, y: -139, z: 45 },
      { x: -5, y: -145, z: 45 }
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
    baseAngle: 286,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 26, y: -91, z: 18 },
      { x: 53, y: -79, z: 18 },
      { x: 81, y: -120, z: 45 },
      { x: 40, y: -139, z: 45 }
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
    baseAngle: 304,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 53, y: -79, z: 18 },
      { x: 75, y: -58, z: 18 },
      { x: 114, y: -89, z: 45 },
      { x: 81, y: -120, z: 45 }
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
    baseAngle: 322,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 75, y: -58, z: 18 },
      { x: 89, y: -32, z: 18 },
      { x: 136, y: -50, z: 45 },
      { x: 114, y: -89, z: 45 }
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
    baseAngle: 340,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 136, y: -50, z: 35 },
      { x: 143, y: 25, z: 35 },
      { x: 172, y: 30, z: 52 },
      { x: 164, y: -60, z: 52 }
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
    baseAngle: 10,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 143, y: 25, z: 35 },
      { x: 111, y: 93, z: 35 },
      { x: 134, y: 112, z: 52 },
      { x: 172, y: 30, z: 52 }
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
    baseAngle: 40,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 111, y: 93, z: 35 },
      { x: 50, y: 136, z: 35 },
      { x: 60, y: 164, z: 52 },
      { x: 134, y: 112, z: 52 }
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
    baseAngle: 70,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 50, y: 136, z: 35 },
      { x: -25, y: 143, z: 35 },
      { x: -30, y: 172, z: 52 },
      { x: 60, y: 164, z: 52 }
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
    baseAngle: 100,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -25, y: 143, z: 35 },
      { x: -93, y: 111, z: 35 },
      { x: -112, y: 134, z: 52 },
      { x: -30, y: 172, z: 52 }
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
    baseAngle: 130,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -93, y: 111, z: 35 },
      { x: -136, y: 50, z: 35 },
      { x: -164, y: 60, z: 52 },
      { x: -112, y: 134, z: 52 }
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
    baseAngle: 160,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -136, y: 50, z: 35 },
      { x: -143, y: -25, z: 35 },
      { x: -172, y: -30, z: 52 },
      { x: -164, y: 60, z: 52 }
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
    baseAngle: 190,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -143, y: -25, z: 35 },
      { x: -111, y: -93, z: 35 },
      { x: -134, y: -112, z: 52 },
      { x: -172, y: -30, z: 52 }
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
    baseAngle: 220,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -111, y: -93, z: 35 },
      { x: -50, y: -136, z: 35 },
      { x: -60, y: -164, z: 52 },
      { x: -134, y: -112, z: 52 }
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
    baseAngle: 250,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -50, y: -136, z: 35 },
      { x: 25, y: -143, z: 35 },
      { x: 30, y: -172, z: 52 },
      { x: -60, y: -164, z: 52 }
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
    baseAngle: 280,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 25, y: -143, z: 35 },
      { x: 93, y: -111, z: 35 },
      { x: 112, y: -134, z: 52 },
      { x: 30, y: -172, z: 52 }
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
    baseAngle: 310,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 93, y: -111, z: 35 },
      { x: 136, y: -50, z: 35 },
      { x: 164, y: -60, z: 52 },
      { x: 112, y: -134, z: 52 }
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
    baseAngle: 340,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 164, y: -60, z: 52 },
      { x: 175, y: -6, z: 52 },
      { x: 245, y: -9, z: 95 },
      { x: 230, y: -84, z: 95 }
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
    baseAngle: 358,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 175, y: -6, z: 52 },
      { x: 168, y: 48, z: 52 },
      { x: 236, y: 68, z: 95 },
      { x: 245, y: -9, z: 95 }
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
    baseAngle: 16,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 168, y: 48, z: 52 },
      { x: 145, y: 98, z: 52 },
      { x: 203, y: 137, z: 95 },
      { x: 236, y: 68, z: 95 }
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
    baseAngle: 34,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 145, y: 98, z: 52 },
      { x: 108, y: 138, z: 52 },
      { x: 151, y: 193, z: 95 },
      { x: 203, y: 137, z: 95 }
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
    baseAngle: 52,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 108, y: 138, z: 52 },
      { x: 60, y: 164, z: 52 },
      { x: 84, y: 230, z: 95 },
      { x: 151, y: 193, z: 95 }
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
    baseAngle: 70,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 60, y: 164, z: 52 },
      { x: 6, y: 175, z: 52 },
      { x: 9, y: 245, z: 95 },
      { x: 84, y: 230, z: 95 }
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
    baseAngle: 88,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 6, y: 175, z: 52 },
      { x: -48, y: 168, z: 52 },
      { x: -68, y: 236, z: 95 },
      { x: 9, y: 245, z: 95 }
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
    baseAngle: 106,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -48, y: 168, z: 52 },
      { x: -98, y: 145, z: 52 },
      { x: -137, y: 203, z: 95 },
      { x: -68, y: 236, z: 95 }
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
    baseAngle: 124,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -98, y: 145, z: 52 },
      { x: -138, y: 108, z: 52 },
      { x: -193, y: 151, z: 95 },
      { x: -137, y: 203, z: 95 }
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
    baseAngle: 142,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -138, y: 108, z: 52 },
      { x: -164, y: 60, z: 52 },
      { x: -230, y: 84, z: 95 },
      { x: -193, y: 151, z: 95 }
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
    baseAngle: 160,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -164, y: 60, z: 52 },
      { x: -175, y: 6, z: 52 },
      { x: -245, y: 9, z: 95 },
      { x: -230, y: 84, z: 95 }
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
    baseAngle: 178,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -175, y: 6, z: 52 },
      { x: -168, y: -48, z: 52 },
      { x: -236, y: -68, z: 95 },
      { x: -245, y: 9, z: 95 }
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
    baseAngle: 196,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -168, y: -48, z: 52 },
      { x: -145, y: -98, z: 52 },
      { x: -203, y: -137, z: 95 },
      { x: -236, y: -68, z: 95 }
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
    baseAngle: 214,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -145, y: -98, z: 52 },
      { x: -108, y: -138, z: 52 },
      { x: -151, y: -193, z: 95 },
      { x: -203, y: -137, z: 95 }
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
    baseAngle: 232,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -108, y: -138, z: 52 },
      { x: -60, y: -164, z: 52 },
      { x: -84, y: -230, z: 95 },
      { x: -151, y: -193, z: 95 }
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
    baseAngle: 250,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -60, y: -164, z: 52 },
      { x: -6, y: -175, z: 52 },
      { x: -9, y: -245, z: 95 },
      { x: -84, y: -230, z: 95 }
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
    baseAngle: 268,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -6, y: -175, z: 52 },
      { x: 48, y: -168, z: 52 },
      { x: 68, y: -236, z: 95 },
      { x: -9, y: -245, z: 95 }
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
    baseAngle: 286,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 48, y: -168, z: 52 },
      { x: 98, y: -145, z: 52 },
      { x: 137, y: -203, z: 95 },
      { x: 68, y: -236, z: 95 }
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
    baseAngle: 304,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 98, y: -145, z: 52 },
      { x: 138, y: -108, z: 52 },
      { x: 193, y: -151, z: 95 },
      { x: 137, y: -203, z: 95 }
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
    baseAngle: 322,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 138, y: -108, z: 52 },
      { x: 164, y: -60, z: 52 },
      { x: 230, y: -84, z: 95 },
      { x: 193, y: -151, z: 95 }
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
    baseAngle: 340,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 150, y: -55, z: 42 },
      { x: 145, y: 68, z: 42 },
      { x: 168, y: 78, z: 42 },
      { x: 174, y: -63, z: 42 }
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
    baseAngle: 25,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 145, y: 68, z: 42 },
      { x: 55, y: 150, z: 42 },
      { x: 63, y: 174, z: 42 },
      { x: 168, y: 78, z: 42 }
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
    baseAngle: 70,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 55, y: 150, z: 42 },
      { x: -68, y: 145, z: 42 },
      { x: -78, y: 168, z: 42 },
      { x: 63, y: 174, z: 42 }
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
    baseAngle: 115,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -68, y: 145, z: 42 },
      { x: -150, y: 55, z: 42 },
      { x: -174, y: 63, z: 42 },
      { x: -78, y: 168, z: 42 }
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
    baseAngle: 160,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -150, y: 55, z: 42 },
      { x: -145, y: -68, z: 42 },
      { x: -168, y: -78, z: 42 },
      { x: -174, y: 63, z: 42 }
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
    baseAngle: 205,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -145, y: -68, z: 42 },
      { x: -55, y: -150, z: 42 },
      { x: -63, y: -174, z: 42 },
      { x: -168, y: -78, z: 42 }
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
    baseAngle: 250,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -55, y: -150, z: 42 },
      { x: 68, y: -145, z: 42 },
      { x: 78, y: -168, z: 42 },
      { x: -63, y: -174, z: 42 }
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
    baseAngle: 295,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 68, y: -145, z: 42 },
      { x: 150, y: -55, z: 42 },
      { x: 174, y: -63, z: 42 },
      { x: 78, y: -168, z: 42 }
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
    baseAngle: 340,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 230, y: -84, z: 30 },
      { x: 241, y: 43, z: 30 },
      { x: 261, y: 46, z: 30 },
      { x: 249, y: -91, z: 30 }
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
    baseAngle: 70,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 84, y: 230, z: 30 },
      { x: -43, y: 241, z: 30 },
      { x: -46, y: 261, z: 30 },
      { x: 91, y: 249, z: 30 }
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
    baseAngle: 160,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -230, y: 84, z: 30 },
      { x: -241, y: -43, z: 30 },
      { x: -261, y: -46, z: 30 },
      { x: -249, y: 91, z: 30 }
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
    baseAngle: 250,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -84, y: -230, z: 30 },
      { x: 43, y: -241, z: 30 },
      { x: 46, y: -261, z: 30 },
      { x: -91, y: -249, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const attstadiumSectionMap = new Map(
  attstadiumSections.map(section => [section.id, section])
);

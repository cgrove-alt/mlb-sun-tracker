// Lincoln Financial Field - Comprehensive Section Data
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

export const lincolnfinancialfieldSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
    level: 'field',
    baseAngle: 5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 60, y: 5, z: 0 },
      { x: 53, y: 28, z: 0 },
      { x: 84, y: 44, z: 15 },
      { x: 95, y: 8, z: 15 }
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
    baseAngle: 27.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 53, y: 28, z: 0 },
      { x: 39, y: 46, z: 0 },
      { x: 61, y: 73, z: 15 },
      { x: 84, y: 44, z: 15 }
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
    baseAngle: 50,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 39, y: 46, z: 0 },
      { x: 18, y: 57, z: 0 },
      { x: 29, y: 91, z: 15 },
      { x: 61, y: 73, z: 15 }
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
    baseAngle: 72.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 18, y: 57, z: 0 },
      { x: -5, y: 60, z: 0 },
      { x: -8, y: 95, z: 15 },
      { x: 29, y: 91, z: 15 }
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
    baseAngle: 95,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -5, y: 60, z: 0 },
      { x: -28, y: 53, z: 0 },
      { x: -44, y: 84, z: 15 },
      { x: -8, y: 95, z: 15 }
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
    baseAngle: 117.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -28, y: 53, z: 0 },
      { x: -46, y: 39, z: 0 },
      { x: -73, y: 61, z: 15 },
      { x: -44, y: 84, z: 15 }
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
    baseAngle: 140,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -46, y: 39, z: 0 },
      { x: -57, y: 18, z: 0 },
      { x: -91, y: 29, z: 15 },
      { x: -73, y: 61, z: 15 }
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
    baseAngle: 162.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -57, y: 18, z: 0 },
      { x: -60, y: -5, z: 0 },
      { x: -95, y: -8, z: 15 },
      { x: -91, y: 29, z: 15 }
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
    baseAngle: 185,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -60, y: -5, z: 0 },
      { x: -53, y: -28, z: 0 },
      { x: -84, y: -44, z: 15 },
      { x: -95, y: -8, z: 15 }
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
    baseAngle: 207.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -53, y: -28, z: 0 },
      { x: -39, y: -46, z: 0 },
      { x: -61, y: -73, z: 15 },
      { x: -84, y: -44, z: 15 }
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
    baseAngle: 230,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -39, y: -46, z: 0 },
      { x: -18, y: -57, z: 0 },
      { x: -29, y: -91, z: 15 },
      { x: -61, y: -73, z: 15 }
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
    baseAngle: 252.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: -18, y: -57, z: 0 },
      { x: 5, y: -60, z: 0 },
      { x: 8, y: -95, z: 15 },
      { x: -29, y: -91, z: 15 }
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
    baseAngle: 275,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 5, y: -60, z: 0 },
      { x: 28, y: -53, z: 0 },
      { x: 44, y: -84, z: 15 },
      { x: 8, y: -95, z: 15 }
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
    baseAngle: 297.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 28, y: -53, z: 0 },
      { x: 46, y: -39, z: 0 },
      { x: 73, y: -61, z: 15 },
      { x: 44, y: -84, z: 15 }
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
    baseAngle: 320,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 46, y: -39, z: 0 },
      { x: 57, y: -18, z: 0 },
      { x: 91, y: -29, z: 15 },
      { x: 73, y: -61, z: 15 }
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
    baseAngle: 342.5,
    angleSpan: 22.5,
    rows: generateRows('A', 'X', 25, 0, 22, false),
    vertices3D: [
      { x: 57, y: -18, z: 0 },
      { x: 60, y: 5, z: 0 },
      { x: 95, y: 8, z: 15 },
      { x: 91, y: -29, z: 15 }
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
    baseAngle: 5,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: 8, z: 18 },
      { x: 87, y: 37, z: 18 },
      { x: 133, y: 57, z: 45 },
      { x: 144, y: 13, z: 45 }
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
    baseAngle: 23,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 87, y: 37, z: 18 },
      { x: 72, y: 62, z: 18 },
      { x: 109, y: 95, z: 45 },
      { x: 133, y: 57, z: 45 }
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
    baseAngle: 41,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 72, y: 62, z: 18 },
      { x: 49, y: 81, z: 18 },
      { x: 75, y: 124, z: 45 },
      { x: 109, y: 95, z: 45 }
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
    baseAngle: 59,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 49, y: 81, z: 18 },
      { x: 21, y: 93, z: 18 },
      { x: 33, y: 141, z: 45 },
      { x: 75, y: 124, z: 45 }
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
    baseAngle: 77,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 21, y: 93, z: 18 },
      { x: -8, y: 95, z: 18 },
      { x: -13, y: 144, z: 45 },
      { x: 33, y: 141, z: 45 }
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
    baseAngle: 95,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -8, y: 95, z: 18 },
      { x: -37, y: 87, z: 18 },
      { x: -57, y: 133, z: 45 },
      { x: -13, y: 144, z: 45 }
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
    baseAngle: 113,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -37, y: 87, z: 18 },
      { x: -62, y: 72, z: 18 },
      { x: -95, y: 109, z: 45 },
      { x: -57, y: 133, z: 45 }
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
    baseAngle: 131,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -62, y: 72, z: 18 },
      { x: -81, y: 49, z: 18 },
      { x: -124, y: 75, z: 45 },
      { x: -95, y: 109, z: 45 }
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
    baseAngle: 149,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -81, y: 49, z: 18 },
      { x: -93, y: 21, z: 18 },
      { x: -141, y: 33, z: 45 },
      { x: -124, y: 75, z: 45 }
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
    baseAngle: 167,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -93, y: 21, z: 18 },
      { x: -95, y: -8, z: 18 },
      { x: -144, y: -13, z: 45 },
      { x: -141, y: 33, z: 45 }
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
    baseAngle: 185,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: -8, z: 18 },
      { x: -87, y: -37, z: 18 },
      { x: -133, y: -57, z: 45 },
      { x: -144, y: -13, z: 45 }
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
    baseAngle: 203,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -87, y: -37, z: 18 },
      { x: -72, y: -62, z: 18 },
      { x: -109, y: -95, z: 45 },
      { x: -133, y: -57, z: 45 }
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
    baseAngle: 221,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -72, y: -62, z: 18 },
      { x: -49, y: -81, z: 18 },
      { x: -75, y: -124, z: 45 },
      { x: -109, y: -95, z: 45 }
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
    baseAngle: 239,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -49, y: -81, z: 18 },
      { x: -21, y: -93, z: 18 },
      { x: -33, y: -141, z: 45 },
      { x: -75, y: -124, z: 45 }
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
    baseAngle: 257,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -21, y: -93, z: 18 },
      { x: 8, y: -95, z: 18 },
      { x: 13, y: -144, z: 45 },
      { x: -33, y: -141, z: 45 }
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
    baseAngle: 275,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 8, y: -95, z: 18 },
      { x: 37, y: -87, z: 18 },
      { x: 57, y: -133, z: 45 },
      { x: 13, y: -144, z: 45 }
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
    baseAngle: 293,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 37, y: -87, z: 18 },
      { x: 62, y: -72, z: 18 },
      { x: 95, y: -109, z: 45 },
      { x: 57, y: -133, z: 45 }
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
    baseAngle: 311,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 62, y: -72, z: 18 },
      { x: 81, y: -49, z: 18 },
      { x: 124, y: -75, z: 45 },
      { x: 95, y: -109, z: 45 }
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
    baseAngle: 329,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 81, y: -49, z: 18 },
      { x: 93, y: -21, z: 18 },
      { x: 141, y: -33, z: 45 },
      { x: 124, y: -75, z: 45 }
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
    baseAngle: 347,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 93, y: -21, z: 18 },
      { x: 95, y: 8, z: 18 },
      { x: 144, y: 13, z: 45 },
      { x: 141, y: -33, z: 45 }
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
    baseAngle: 5,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 144, y: 13, z: 35 },
      { x: 119, y: 83, z: 35 },
      { x: 143, y: 100, z: 52 },
      { x: 174, y: 15, z: 52 }
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
    baseAngle: 35,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 119, y: 83, z: 35 },
      { x: 61, y: 131, z: 35 },
      { x: 74, y: 159, z: 52 },
      { x: 143, y: 100, z: 52 }
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
    baseAngle: 65,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 61, y: 131, z: 35 },
      { x: -13, y: 144, z: 35 },
      { x: -15, y: 174, z: 52 },
      { x: 74, y: 159, z: 52 }
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
    baseAngle: 95,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -13, y: 144, z: 35 },
      { x: -83, y: 119, z: 35 },
      { x: -100, y: 143, z: 52 },
      { x: -15, y: 174, z: 52 }
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
    baseAngle: 125,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -83, y: 119, z: 35 },
      { x: -131, y: 61, z: 35 },
      { x: -159, y: 74, z: 52 },
      { x: -100, y: 143, z: 52 }
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
    baseAngle: 155,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -131, y: 61, z: 35 },
      { x: -144, y: -13, z: 35 },
      { x: -174, y: -15, z: 52 },
      { x: -159, y: 74, z: 52 }
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
    baseAngle: 185,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -144, y: -13, z: 35 },
      { x: -119, y: -83, z: 35 },
      { x: -143, y: -100, z: 52 },
      { x: -174, y: -15, z: 52 }
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
    baseAngle: 215,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -119, y: -83, z: 35 },
      { x: -61, y: -131, z: 35 },
      { x: -74, y: -159, z: 52 },
      { x: -143, y: -100, z: 52 }
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
    baseAngle: 245,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -61, y: -131, z: 35 },
      { x: 13, y: -144, z: 35 },
      { x: 15, y: -174, z: 52 },
      { x: -74, y: -159, z: 52 }
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
    baseAngle: 275,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 13, y: -144, z: 35 },
      { x: 83, y: -119, z: 35 },
      { x: 100, y: -143, z: 52 },
      { x: 15, y: -174, z: 52 }
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
    baseAngle: 305,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 83, y: -119, z: 35 },
      { x: 131, y: -61, z: 35 },
      { x: 159, y: -74, z: 52 },
      { x: 100, y: -143, z: 52 }
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
    baseAngle: 335,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 131, y: -61, z: 35 },
      { x: 144, y: 13, z: 35 },
      { x: 174, y: 15, z: 52 },
      { x: 159, y: -74, z: 52 }
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
    baseAngle: 5,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 174, y: 15, z: 52 },
      { x: 161, y: 68, z: 52 },
      { x: 226, y: 96, z: 95 },
      { x: 244, y: 21, z: 95 }
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
    baseAngle: 23,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 161, y: 68, z: 52 },
      { x: 132, y: 115, z: 52 },
      { x: 185, y: 161, z: 95 },
      { x: 226, y: 96, z: 95 }
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
    baseAngle: 41,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 132, y: 115, z: 52 },
      { x: 90, y: 150, z: 52 },
      { x: 126, y: 210, z: 95 },
      { x: 185, y: 161, z: 95 }
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
    baseAngle: 59,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 90, y: 150, z: 52 },
      { x: 39, y: 171, z: 52 },
      { x: 55, y: 239, z: 95 },
      { x: 126, y: 210, z: 95 }
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
    baseAngle: 77,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 39, y: 171, z: 52 },
      { x: -15, y: 174, z: 52 },
      { x: -21, y: 244, z: 95 },
      { x: 55, y: 239, z: 95 }
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
    baseAngle: 95,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -15, y: 174, z: 52 },
      { x: -68, y: 161, z: 52 },
      { x: -96, y: 226, z: 95 },
      { x: -21, y: 244, z: 95 }
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
    baseAngle: 113,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -68, y: 161, z: 52 },
      { x: -115, y: 132, z: 52 },
      { x: -161, y: 185, z: 95 },
      { x: -96, y: 226, z: 95 }
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
    baseAngle: 131,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -115, y: 132, z: 52 },
      { x: -150, y: 90, z: 52 },
      { x: -210, y: 126, z: 95 },
      { x: -161, y: 185, z: 95 }
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
    baseAngle: 149,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -150, y: 90, z: 52 },
      { x: -171, y: 39, z: 52 },
      { x: -239, y: 55, z: 95 },
      { x: -210, y: 126, z: 95 }
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
    baseAngle: 167,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -171, y: 39, z: 52 },
      { x: -174, y: -15, z: 52 },
      { x: -244, y: -21, z: 95 },
      { x: -239, y: 55, z: 95 }
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
    baseAngle: 185,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -174, y: -15, z: 52 },
      { x: -161, y: -68, z: 52 },
      { x: -226, y: -96, z: 95 },
      { x: -244, y: -21, z: 95 }
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
    baseAngle: 203,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -161, y: -68, z: 52 },
      { x: -132, y: -115, z: 52 },
      { x: -185, y: -161, z: 95 },
      { x: -226, y: -96, z: 95 }
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
    baseAngle: 221,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -132, y: -115, z: 52 },
      { x: -90, y: -150, z: 52 },
      { x: -126, y: -210, z: 95 },
      { x: -185, y: -161, z: 95 }
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
    baseAngle: 239,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -90, y: -150, z: 52 },
      { x: -39, y: -171, z: 52 },
      { x: -55, y: -239, z: 95 },
      { x: -126, y: -210, z: 95 }
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
    baseAngle: 257,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -39, y: -171, z: 52 },
      { x: 15, y: -174, z: 52 },
      { x: 21, y: -244, z: 95 },
      { x: -55, y: -239, z: 95 }
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
    baseAngle: 275,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 15, y: -174, z: 52 },
      { x: 68, y: -161, z: 52 },
      { x: 96, y: -226, z: 95 },
      { x: 21, y: -244, z: 95 }
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
    baseAngle: 293,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 68, y: -161, z: 52 },
      { x: 115, y: -132, z: 52 },
      { x: 161, y: -185, z: 95 },
      { x: 96, y: -226, z: 95 }
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
    baseAngle: 311,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 115, y: -132, z: 52 },
      { x: 150, y: -90, z: 52 },
      { x: 210, y: -126, z: 95 },
      { x: 161, y: -185, z: 95 }
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
    baseAngle: 329,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 150, y: -90, z: 52 },
      { x: 171, y: -39, z: 52 },
      { x: 239, y: -55, z: 95 },
      { x: 210, y: -126, z: 95 }
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
    baseAngle: 347,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 171, y: -39, z: 52 },
      { x: 174, y: 15, z: 52 },
      { x: 244, y: 21, z: 95 },
      { x: 239, y: -55, z: 95 }
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
    baseAngle: 5,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 159, y: 14, z: 42 },
      { x: 103, y: 123, z: 42 },
      { x: 119, y: 142, z: 42 },
      { x: 184, y: 16, z: 42 }
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
    baseAngle: 50,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 103, y: 123, z: 42 },
      { x: -14, y: 159, z: 42 },
      { x: -16, y: 184, z: 42 },
      { x: 119, y: 142, z: 42 }
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
    baseAngle: 95,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -14, y: 159, z: 42 },
      { x: -123, y: 103, z: 42 },
      { x: -142, y: 119, z: 42 },
      { x: -16, y: 184, z: 42 }
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
    baseAngle: 140,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -123, y: 103, z: 42 },
      { x: -159, y: -14, z: 42 },
      { x: -184, y: -16, z: 42 },
      { x: -142, y: 119, z: 42 }
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
    baseAngle: 185,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -159, y: -14, z: 42 },
      { x: -103, y: -123, z: 42 },
      { x: -119, y: -142, z: 42 },
      { x: -184, y: -16, z: 42 }
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
    baseAngle: 230,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: -103, y: -123, z: 42 },
      { x: 14, y: -159, z: 42 },
      { x: 16, y: -184, z: 42 },
      { x: -119, y: -142, z: 42 }
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
    baseAngle: 275,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 14, y: -159, z: 42 },
      { x: 123, y: -103, z: 42 },
      { x: 142, y: -119, z: 42 },
      { x: 16, y: -184, z: 42 }
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
    baseAngle: 320,
    angleSpan: 45,
    rows: generateRows('1', '1', 24, 42, 0, true),
    vertices3D: [
      { x: 123, y: -103, z: 42 },
      { x: 159, y: 14, z: 42 },
      { x: 184, y: 16, z: 42 },
      { x: 142, y: -119, z: 42 }
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
    baseAngle: 5,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 244, y: 21, z: 30 },
      { x: 201, y: 141, z: 30 },
      { x: 217, y: 152, z: 30 },
      { x: 264, y: 23, z: 30 }
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
    baseAngle: 95,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -21, y: 244, z: 30 },
      { x: -141, y: 201, z: 30 },
      { x: -152, y: 217, z: 30 },
      { x: -23, y: 264, z: 30 }
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
    baseAngle: 185,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -244, y: -21, z: 30 },
      { x: -201, y: -141, z: 30 },
      { x: -217, y: -152, z: 30 },
      { x: -264, y: -23, z: 30 }
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
    baseAngle: 275,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 21, y: -244, z: 30 },
      { x: 141, y: -201, z: 30 },
      { x: 152, y: -217, z: 30 },
      { x: 23, y: -264, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const lincolnfinancialfieldSectionMap = new Map(
  lincolnfinancialfieldSections.map(section => [section.id, section])
);

// Caesars Superdome - Comprehensive Section Data
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

export const caesarssuperdomeSections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field 100',
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
    id: '101',
    name: 'Field 101',
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
    id: '102',
    name: 'Field 102',
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
    id: '103',
    name: 'Field 103',
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
    id: '104',
    name: 'Field 104',
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
    id: '105',
    name: 'Field 105',
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
    id: '106',
    name: 'Field 106',
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
    id: '107',
    name: 'Field 107',
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
    id: '108',
    name: 'Field 108',
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
    id: '109',
    name: 'Field 109',
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
    id: '110',
    name: 'Field 110',
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
    id: '111',
    name: 'Field 111',
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
    id: '112',
    name: 'Field 112',
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
    id: '113',
    name: 'Field 113',
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
    id: '114',
    name: 'Field 114',
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
    id: '115',
    name: 'Field 115',
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
    id: '200',
    name: 'Lower 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 95, y: 0, z: 18 },
      { x: 90, y: 29, z: 18 },
      { x: 138, y: 45, z: 45 },
      { x: 145, y: 0, z: 45 }
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
    baseAngle: 18,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 90, y: 29, z: 18 },
      { x: 77, y: 56, z: 18 },
      { x: 117, y: 85, z: 45 },
      { x: 138, y: 45, z: 45 }
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
    baseAngle: 36,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 77, y: 56, z: 18 },
      { x: 56, y: 77, z: 18 },
      { x: 85, y: 117, z: 45 },
      { x: 117, y: 85, z: 45 }
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
    baseAngle: 54,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 56, y: 77, z: 18 },
      { x: 29, y: 90, z: 18 },
      { x: 45, y: 138, z: 45 },
      { x: 85, y: 117, z: 45 }
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
    baseAngle: 72,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 29, y: 90, z: 18 },
      { x: 0, y: 95, z: 18 },
      { x: 0, y: 145, z: 45 },
      { x: 45, y: 138, z: 45 }
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
    baseAngle: 90,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 0, y: 95, z: 18 },
      { x: -29, y: 90, z: 18 },
      { x: -45, y: 138, z: 45 },
      { x: 0, y: 145, z: 45 }
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
    baseAngle: 108,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -29, y: 90, z: 18 },
      { x: -56, y: 77, z: 18 },
      { x: -85, y: 117, z: 45 },
      { x: -45, y: 138, z: 45 }
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
    baseAngle: 126,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -56, y: 77, z: 18 },
      { x: -77, y: 56, z: 18 },
      { x: -117, y: 85, z: 45 },
      { x: -85, y: 117, z: 45 }
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
    baseAngle: 144,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -77, y: 56, z: 18 },
      { x: -90, y: 29, z: 18 },
      { x: -138, y: 45, z: 45 },
      { x: -117, y: 85, z: 45 }
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
    baseAngle: 162,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -90, y: 29, z: 18 },
      { x: -95, y: 0, z: 18 },
      { x: -145, y: 0, z: 45 },
      { x: -138, y: 45, z: 45 }
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
    baseAngle: 180,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -95, y: 0, z: 18 },
      { x: -90, y: -29, z: 18 },
      { x: -138, y: -45, z: 45 },
      { x: -145, y: 0, z: 45 }
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
    baseAngle: 198,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -90, y: -29, z: 18 },
      { x: -77, y: -56, z: 18 },
      { x: -117, y: -85, z: 45 },
      { x: -138, y: -45, z: 45 }
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
    baseAngle: 216,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -77, y: -56, z: 18 },
      { x: -56, y: -77, z: 18 },
      { x: -85, y: -117, z: 45 },
      { x: -117, y: -85, z: 45 }
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
    baseAngle: 234,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -56, y: -77, z: 18 },
      { x: -29, y: -90, z: 18 },
      { x: -45, y: -138, z: 45 },
      { x: -85, y: -117, z: 45 }
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
    baseAngle: 252,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -29, y: -90, z: 18 },
      { x: -0, y: -95, z: 18 },
      { x: -0, y: -145, z: 45 },
      { x: -45, y: -138, z: 45 }
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
    baseAngle: 270,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: -0, y: -95, z: 18 },
      { x: 29, y: -90, z: 18 },
      { x: 45, y: -138, z: 45 },
      { x: -0, y: -145, z: 45 }
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
    baseAngle: 288,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 29, y: -90, z: 18 },
      { x: 56, y: -77, z: 18 },
      { x: 85, y: -117, z: 45 },
      { x: 45, y: -138, z: 45 }
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
    baseAngle: 306,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 56, y: -77, z: 18 },
      { x: 77, y: -56, z: 18 },
      { x: 117, y: -85, z: 45 },
      { x: 85, y: -117, z: 45 }
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
    baseAngle: 324,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 77, y: -56, z: 18 },
      { x: 90, y: -29, z: 18 },
      { x: 138, y: -45, z: 45 },
      { x: 117, y: -85, z: 45 }
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
    baseAngle: 342,
    angleSpan: 18,
    rows: generateRows('1', '38', 28, 18, 25, false),
    vertices3D: [
      { x: 90, y: -29, z: 18 },
      { x: 95, y: -0, z: 18 },
      { x: 145, y: -0, z: 45 },
      { x: 138, y: -45, z: 45 }
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
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 145, y: 0, z: 35 },
      { x: 126, y: 72, z: 35 },
      { x: 152, y: 87, z: 52 },
      { x: 175, y: 0, z: 52 }
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
    baseAngle: 30,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 126, y: 72, z: 35 },
      { x: 73, y: 126, z: 35 },
      { x: 88, y: 152, z: 52 },
      { x: 152, y: 87, z: 52 }
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
    baseAngle: 60,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 73, y: 126, z: 35 },
      { x: 0, y: 145, z: 35 },
      { x: 0, y: 175, z: 52 },
      { x: 88, y: 152, z: 52 }
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
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 0, y: 145, z: 35 },
      { x: -72, y: 126, z: 35 },
      { x: -87, y: 152, z: 52 },
      { x: 0, y: 175, z: 52 }
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
    baseAngle: 120,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -72, y: 126, z: 35 },
      { x: -126, y: 72, z: 35 },
      { x: -152, y: 87, z: 52 },
      { x: -87, y: 152, z: 52 }
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
    baseAngle: 150,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -126, y: 72, z: 35 },
      { x: -145, y: 0, z: 35 },
      { x: -175, y: 0, z: 52 },
      { x: -152, y: 87, z: 52 }
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
    baseAngle: 180,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -145, y: 0, z: 35 },
      { x: -126, y: -73, z: 35 },
      { x: -152, y: -88, z: 52 },
      { x: -175, y: 0, z: 52 }
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
    baseAngle: 210,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -126, y: -73, z: 35 },
      { x: -73, y: -126, z: 35 },
      { x: -88, y: -152, z: 52 },
      { x: -152, y: -88, z: 52 }
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
    baseAngle: 240,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -73, y: -126, z: 35 },
      { x: -0, y: -145, z: 35 },
      { x: -0, y: -175, z: 52 },
      { x: -88, y: -152, z: 52 }
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
    baseAngle: 270,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: -0, y: -145, z: 35 },
      { x: 73, y: -126, z: 35 },
      { x: 88, y: -152, z: 52 },
      { x: -0, y: -175, z: 52 }
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
    baseAngle: 300,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 73, y: -126, z: 35 },
      { x: 126, y: -73, z: 35 },
      { x: 152, y: -88, z: 52 },
      { x: 88, y: -152, z: 52 }
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
    baseAngle: 330,
    angleSpan: 30,
    rows: generateRows('A', 'M', 22, 35, 27, false),
    vertices3D: [
      { x: 126, y: -73, z: 35 },
      { x: 145, y: -0, z: 35 },
      { x: 175, y: -0, z: 52 },
      { x: 152, y: -88, z: 52 }
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
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 175, y: 0, z: 52 },
      { x: 166, y: 54, z: 52 },
      { x: 233, y: 76, z: 95 },
      { x: 245, y: 0, z: 95 }
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
    baseAngle: 18,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 166, y: 54, z: 52 },
      { x: 142, y: 103, z: 52 },
      { x: 198, y: 144, z: 95 },
      { x: 233, y: 76, z: 95 }
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
    baseAngle: 36,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 142, y: 103, z: 52 },
      { x: 103, y: 142, z: 52 },
      { x: 144, y: 198, z: 95 },
      { x: 198, y: 144, z: 95 }
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
    baseAngle: 54,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 103, y: 142, z: 52 },
      { x: 54, y: 166, z: 52 },
      { x: 76, y: 233, z: 95 },
      { x: 144, y: 198, z: 95 }
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
    baseAngle: 72,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 54, y: 166, z: 52 },
      { x: 0, y: 175, z: 52 },
      { x: 0, y: 245, z: 95 },
      { x: 76, y: 233, z: 95 }
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
    baseAngle: 90,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: 0, y: 175, z: 52 },
      { x: -54, y: 166, z: 52 },
      { x: -76, y: 233, z: 95 },
      { x: 0, y: 245, z: 95 }
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
    baseAngle: 108,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -54, y: 166, z: 52 },
      { x: -103, y: 142, z: 52 },
      { x: -144, y: 198, z: 95 },
      { x: -76, y: 233, z: 95 }
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
    baseAngle: 126,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -103, y: 142, z: 52 },
      { x: -142, y: 103, z: 52 },
      { x: -198, y: 144, z: 95 },
      { x: -144, y: 198, z: 95 }
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
    baseAngle: 144,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -142, y: 103, z: 52 },
      { x: -166, y: 54, z: 52 },
      { x: -233, y: 76, z: 95 },
      { x: -198, y: 144, z: 95 }
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
    baseAngle: 162,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -166, y: 54, z: 52 },
      { x: -175, y: 0, z: 52 },
      { x: -245, y: 0, z: 95 },
      { x: -233, y: 76, z: 95 }
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
    baseAngle: 180,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -175, y: 0, z: 52 },
      { x: -166, y: -54, z: 52 },
      { x: -233, y: -76, z: 95 },
      { x: -245, y: 0, z: 95 }
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
    baseAngle: 198,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -166, y: -54, z: 52 },
      { x: -142, y: -103, z: 52 },
      { x: -198, y: -144, z: 95 },
      { x: -233, y: -76, z: 95 }
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
    baseAngle: 216,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -142, y: -103, z: 52 },
      { x: -103, y: -142, z: 52 },
      { x: -144, y: -198, z: 95 },
      { x: -198, y: -144, z: 95 }
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
    baseAngle: 234,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -103, y: -142, z: 52 },
      { x: -54, y: -166, z: 52 },
      { x: -76, y: -233, z: 95 },
      { x: -144, y: -198, z: 95 }
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
    baseAngle: 252,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, true),
    vertices3D: [
      { x: -54, y: -166, z: 52 },
      { x: -0, y: -175, z: 52 },
      { x: -0, y: -245, z: 95 },
      { x: -76, y: -233, z: 95 }
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
    baseAngle: 270,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: -0, y: -175, z: 52 },
      { x: 54, y: -166, z: 52 },
      { x: 76, y: -233, z: 95 },
      { x: -0, y: -245, z: 95 }
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
    baseAngle: 288,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 54, y: -166, z: 52 },
      { x: 103, y: -142, z: 52 },
      { x: 144, y: -198, z: 95 },
      { x: 76, y: -233, z: 95 }
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
    baseAngle: 306,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 103, y: -142, z: 52 },
      { x: 142, y: -103, z: 52 },
      { x: 198, y: -144, z: 95 },
      { x: 144, y: -198, z: 95 }
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
    baseAngle: 324,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 142, y: -103, z: 52 },
      { x: 166, y: -54, z: 52 },
      { x: 233, y: -76, z: 95 },
      { x: 198, y: -144, z: 95 }
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
    baseAngle: 342,
    angleSpan: 18,
    rows: generateRows('1', '42', 30, 52, 30, false),
    vertices3D: [
      { x: 166, y: -54, z: 52 },
      { x: 175, y: -0, z: 52 },
      { x: 245, y: -0, z: 95 },
      { x: 233, y: -76, z: 95 }
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
    id: 'SUITE-2',
    name: 'Suite 2',
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
    id: 'SUITE-3',
    name: 'Suite 3',
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
    id: 'SUITE-4',
    name: 'Suite 4',
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
    id: 'SUITE-5',
    name: 'Suite 5',
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
    id: 'SUITE-6',
    name: 'Suite 6',
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
    id: 'SUITE-7',
    name: 'Suite 7',
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
    id: 'SUITE-8',
    name: 'Suite 8',
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
    id: 'DECK-North',
    name: 'North Party Deck',
    level: 'standing',
    baseAngle: 0,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 245, y: 0, z: 30 },
      { x: 212, y: 122, z: 30 },
      { x: 229, y: 132, z: 30 },
      { x: 265, y: 0, z: 30 }
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
    baseAngle: 90,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 0, y: 245, z: 30 },
      { x: -122, y: 212, z: 30 },
      { x: -132, y: 229, z: 30 },
      { x: 0, y: 265, z: 30 }
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
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -245, y: 0, z: 30 },
      { x: -212, y: -123, z: 30 },
      { x: -229, y: -133, z: 30 },
      { x: -265, y: 0, z: 30 }
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
    baseAngle: 270,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -0, y: -245, z: 30 },
      { x: 123, y: -212, z: 30 },
      { x: 133, y: -229, z: 30 },
      { x: -0, y: -265, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 255,
    height: 30,
    rake: 0
  }
];

// Export section map for easy lookup
export const caesarssuperdomeSectionMap = new Map(
  caesarssuperdomeSections.map(section => [section.id, section])
);

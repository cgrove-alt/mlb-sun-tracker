// BC Place (Vancouver) - Comprehensive Section Data for 2026 World Cup
// Capacity: 54,500 with retractable roof
// Based on: https://stadiumdb.com/stadiums/can/bc_place
// Data sources: StadiumDB, FourFourTwo, SeatGeek

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
        seats: seatsPerRow - Math.floor(rowNum * 0.12),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 35 - (rowNum * 0.25) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.12),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 35 - (rowNum * 0.25) : undefined
      });
    }
  }

  return rows;
}

// BC Place sections - retractable roof stadium with two-tier seating
export const bcplaceSections: DetailedSection[] = [
  // Lower Bowl - Section 201-252 (East Side)
  {
    id: '201',
    name: 'Lower 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 7,
    rows: generateRows(1, 25, 22, 0, 22, true),
    vertices3D: [
      { x: 65, y: 0, z: 0 },
      { x: 64, y: 8, z: 0 },
      { x: 82, y: 11, z: 15 },
      { x: 85, y: 0, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '202',
    name: 'Lower 202',
    level: 'lower',
    baseAngle: 7,
    angleSpan: 7,
    rows: generateRows(1, 25, 23, 0, 22, true),
    vertices3D: [
      { x: 64, y: 8, z: 0 },
      { x: 62, y: 16, z: 0 },
      { x: 78, y: 22, z: 15 },
      { x: 82, y: 11, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '203',
    name: 'Lower 203',
    level: 'lower',
    baseAngle: 14,
    angleSpan: 7,
    rows: generateRows(1, 25, 24, 0, 22, true),
    vertices3D: [
      { x: 62, y: 16, z: 0 },
      { x: 59, y: 24, z: 0 },
      { x: 74, y: 33, z: 15 },
      { x: 78, y: 22, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '204',
    name: 'Lower 204',
    level: 'lower',
    baseAngle: 21,
    angleSpan: 7,
    rows: generateRows(1, 25, 25, 0, 22, true),
    vertices3D: [
      { x: 59, y: 24, z: 0 },
      { x: 55, y: 32, z: 0 },
      { x: 69, y: 44, z: 15 },
      { x: 74, y: 33, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '205',
    name: 'Lower 205',
    level: 'lower',
    baseAngle: 28,
    angleSpan: 7,
    rows: generateRows(1, 25, 26, 0, 22, true),
    vertices3D: [
      { x: 55, y: 32, z: 0 },
      { x: 50, y: 40, z: 0 },
      { x: 63, y: 55, z: 15 },
      { x: 69, y: 44, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '206',
    name: 'Lower 206 - Midfield',
    level: 'lower',
    baseAngle: 35,
    angleSpan: 10,
    rows: generateRows(1, 25, 28, 0, 22, true),
    vertices3D: [
      { x: 50, y: 40, z: 0 },
      { x: 43, y: 50, z: 0 },
      { x: 54, y: 69, z: 15 },
      { x: 63, y: 55, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'luxury'
  },
  {
    id: '207',
    name: 'Lower 207',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 7,
    rows: generateRows(1, 25, 26, 0, 22, true),
    vertices3D: [
      { x: 43, y: 50, z: 0 },
      { x: 38, y: 58, z: 0 },
      { x: 48, y: 80, z: 15 },
      { x: 54, y: 69, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '208',
    name: 'Lower 208',
    level: 'lower',
    baseAngle: 52,
    angleSpan: 7,
    rows: generateRows(1, 25, 25, 0, 22, true),
    vertices3D: [
      { x: 38, y: 58, z: 0 },
      { x: 32, y: 66, z: 0 },
      { x: 40, y: 91, z: 15 },
      { x: 48, y: 80, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '209',
    name: 'Lower 209',
    level: 'lower',
    baseAngle: 59,
    angleSpan: 7,
    rows: generateRows(1, 25, 24, 0, 22, true),
    vertices3D: [
      { x: 32, y: 66, z: 0 },
      { x: 26, y: 74, z: 0 },
      { x: 33, y: 102, z: 15 },
      { x: 40, y: 91, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '210',
    name: 'Lower 210',
    level: 'lower',
    baseAngle: 66,
    angleSpan: 7,
    rows: generateRows(1, 25, 23, 0, 22, true),
    vertices3D: [
      { x: 26, y: 74, z: 0 },
      { x: 19, y: 82, z: 0 },
      { x: 24, y: 113, z: 15 },
      { x: 33, y: 102, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '211',
    name: 'Lower 211',
    level: 'lower',
    baseAngle: 73,
    angleSpan: 7,
    rows: generateRows(1, 25, 22, 0, 22, true),
    vertices3D: [
      { x: 19, y: 82, z: 0 },
      { x: 12, y: 90, z: 0 },
      { x: 15, y: 124, z: 15 },
      { x: 24, y: 113, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },

  // South End (Sections 221-229)
  {
    id: '221',
    name: 'Lower South 221',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 5,
    rows: generateRows(1, 22, 20, 0, 20, true),
    vertices3D: [
      { x: 12, y: 90, z: 0 },
      { x: 7, y: 95, z: 0 },
      { x: 8, y: 130, z: 13 },
      { x: 15, y: 124, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '222',
    name: 'Lower South 222',
    level: 'lower',
    baseAngle: 95,
    angleSpan: 5,
    rows: generateRows(1, 22, 21, 0, 20, true),
    vertices3D: [
      { x: 7, y: 95, z: 0 },
      { x: 0, y: 98, z: 0 },
      { x: 0, y: 135, z: 13 },
      { x: 8, y: 130, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '223',
    name: 'Lower South 223',
    level: 'lower',
    baseAngle: 100,
    angleSpan: 5,
    rows: generateRows(1, 22, 21, 0, 20, true),
    vertices3D: [
      { x: 0, y: 98, z: 0 },
      { x: -7, y: 95, z: 0 },
      { x: -8, y: 130, z: 13 },
      { x: 0, y: 135, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '224',
    name: 'Lower South 224',
    level: 'lower',
    baseAngle: 105,
    angleSpan: 5,
    rows: generateRows(1, 22, 20, 0, 20, true),
    vertices3D: [
      { x: -7, y: 95, z: 0 },
      { x: -12, y: 90, z: 0 },
      { x: -15, y: 124, z: 13 },
      { x: -8, y: 130, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },

  // West Side (Sections 231-241)
  {
    id: '231',
    name: 'Lower 231',
    level: 'lower',
    baseAngle: 120,
    angleSpan: 7,
    rows: generateRows(1, 25, 22, 0, 22, true),
    vertices3D: [
      { x: -19, y: 82, z: 0 },
      { x: -26, y: 74, z: 0 },
      { x: -33, y: 102, z: 15 },
      { x: -24, y: 113, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '232',
    name: 'Lower 232',
    level: 'lower',
    baseAngle: 127,
    angleSpan: 7,
    rows: generateRows(1, 25, 23, 0, 22, true),
    vertices3D: [
      { x: -26, y: 74, z: 0 },
      { x: -32, y: 66, z: 0 },
      { x: -40, y: 91, z: 15 },
      { x: -33, y: 102, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '233',
    name: 'Lower 233',
    level: 'lower',
    baseAngle: 134,
    angleSpan: 7,
    rows: generateRows(1, 25, 24, 0, 22, true),
    vertices3D: [
      { x: -32, y: 66, z: 0 },
      { x: -38, y: 58, z: 0 },
      { x: -48, y: 80, z: 15 },
      { x: -40, y: 91, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '234',
    name: 'Lower 234',
    level: 'lower',
    baseAngle: 141,
    angleSpan: 7,
    rows: generateRows(1, 25, 25, 0, 22, true),
    vertices3D: [
      { x: -38, y: 58, z: 0 },
      { x: -43, y: 50, z: 0 },
      { x: -54, y: 69, z: 15 },
      { x: -48, y: 80, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '235',
    name: 'Lower 235 - Midfield',
    level: 'lower',
    baseAngle: 148,
    angleSpan: 10,
    rows: generateRows(1, 25, 28, 0, 22, true),
    vertices3D: [
      { x: -43, y: 50, z: 0 },
      { x: -50, y: 40, z: 0 },
      { x: -63, y: 55, z: 15 },
      { x: -54, y: 69, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'luxury'
  },
  {
    id: '236',
    name: 'Lower 236',
    level: 'lower',
    baseAngle: 158,
    angleSpan: 7,
    rows: generateRows(1, 25, 26, 0, 22, true),
    vertices3D: [
      { x: -50, y: 40, z: 0 },
      { x: -55, y: 32, z: 0 },
      { x: -69, y: 44, z: 15 },
      { x: -63, y: 55, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '237',
    name: 'Lower 237',
    level: 'lower',
    baseAngle: 165,
    angleSpan: 7,
    rows: generateRows(1, 25, 25, 0, 22, true),
    vertices3D: [
      { x: -55, y: 32, z: 0 },
      { x: -59, y: 24, z: 0 },
      { x: -74, y: 33, z: 15 },
      { x: -69, y: 44, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '238',
    name: 'Lower 238',
    level: 'lower',
    baseAngle: 172,
    angleSpan: 7,
    rows: generateRows(1, 25, 24, 0, 22, true),
    vertices3D: [
      { x: -59, y: 24, z: 0 },
      { x: -62, y: 16, z: 0 },
      { x: -78, y: 22, z: 15 },
      { x: -74, y: 33, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '239',
    name: 'Lower 239',
    level: 'lower',
    baseAngle: 179,
    angleSpan: 7,
    rows: generateRows(1, 25, 23, 0, 22, true),
    vertices3D: [
      { x: -62, y: 16, z: 0 },
      { x: -64, y: 8, z: 0 },
      { x: -82, y: 11, z: 15 },
      { x: -78, y: 22, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },
  {
    id: '240',
    name: 'Lower 240',
    level: 'lower',
    baseAngle: 186,
    angleSpan: 7,
    rows: generateRows(1, 25, 22, 0, 22, true),
    vertices3D: [
      { x: -64, y: 8, z: 0 },
      { x: -65, y: 0, z: 0 },
      { x: -85, y: 0, z: 15 },
      { x: -82, y: 11, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'premium'
  },

  // North End (Sections 251-259)
  {
    id: '251',
    name: 'Lower North 251',
    level: 'lower',
    baseAngle: 270,
    angleSpan: 5,
    rows: generateRows(1, 22, 20, 0, 20, true),
    vertices3D: [
      { x: -65, y: 0, z: 0 },
      { x: -62, y: -8, z: 0 },
      { x: -82, y: -11, z: 13 },
      { x: -85, y: 0, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '252',
    name: 'Lower North 252',
    level: 'lower',
    baseAngle: 275,
    angleSpan: 5,
    rows: generateRows(1, 22, 21, 0, 20, true),
    vertices3D: [
      { x: -62, y: -8, z: 0 },
      { x: -55, y: -15, z: 0 },
      { x: -74, y: -20, z: 13 },
      { x: -82, y: -11, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '253',
    name: 'Lower North 253',
    level: 'lower',
    baseAngle: 280,
    angleSpan: 5,
    rows: generateRows(1, 22, 22, 0, 20, true),
    vertices3D: [
      { x: -55, y: -15, z: 0 },
      { x: -45, y: -20, z: 0 },
      { x: -60, y: -28, z: 13 },
      { x: -74, y: -20, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '254',
    name: 'Lower North 254',
    level: 'lower',
    baseAngle: 285,
    angleSpan: 5,
    rows: generateRows(1, 22, 23, 0, 20, true),
    vertices3D: [
      { x: -45, y: -20, z: 0 },
      { x: -30, y: -25, z: 0 },
      { x: -40, y: -35, z: 13 },
      { x: -60, y: -28, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '255',
    name: 'Lower North 255',
    level: 'lower',
    baseAngle: 290,
    angleSpan: 5,
    rows: generateRows(1, 22, 24, 0, 20, true),
    vertices3D: [
      { x: -30, y: -25, z: 0 },
      { x: -10, y: -28, z: 0 },
      { x: -13, y: -39, z: 13 },
      { x: -40, y: -35, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '256',
    name: 'Lower North 256',
    level: 'lower',
    baseAngle: 295,
    angleSpan: 5,
    rows: generateRows(1, 22, 24, 0, 20, true),
    vertices3D: [
      { x: -10, y: -28, z: 0 },
      { x: 10, y: -28, z: 0 },
      { x: 13, y: -39, z: 13 },
      { x: -13, y: -39, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '257',
    name: 'Lower North 257',
    level: 'lower',
    baseAngle: 300,
    angleSpan: 5,
    rows: generateRows(1, 22, 23, 0, 20, true),
    vertices3D: [
      { x: 10, y: -28, z: 0 },
      { x: 30, y: -25, z: 0 },
      { x: 40, y: -35, z: 13 },
      { x: 13, y: -39, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '258',
    name: 'Lower North 258',
    level: 'lower',
    baseAngle: 305,
    angleSpan: 5,
    rows: generateRows(1, 22, 22, 0, 20, true),
    vertices3D: [
      { x: 30, y: -25, z: 0 },
      { x: 45, y: -20, z: 0 },
      { x: 60, y: -28, z: 13 },
      { x: 40, y: -35, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '259',
    name: 'Lower North 259',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 5,
    rows: generateRows(1, 22, 21, 0, 20, true),
    vertices3D: [
      { x: 45, y: -20, z: 0 },
      { x: 55, y: -15, z: 0 },
      { x: 74, y: -20, z: 13 },
      { x: 60, y: -28, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '260',
    name: 'Lower North 260',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 5,
    rows: generateRows(1, 22, 20, 0, 20, true),
    vertices3D: [
      { x: 55, y: -15, z: 0 },
      { x: 62, y: -8, z: 0 },
      { x: 82, y: -11, z: 13 },
      { x: 74, y: -20, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },
  {
    id: '261',
    name: 'Lower North 261',
    level: 'lower',
    baseAngle: 320,
    angleSpan: 5,
    rows: generateRows(1, 22, 20, 0, 20, true),
    vertices3D: [
      { x: 62, y: -8, z: 0 },
      { x: 65, y: 0, z: 0 },
      { x: 85, y: 0, z: 13 },
      { x: 82, y: -11, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate'
  },

  // Upper Bowl - Sections 401-452
  {
    id: '401',
    name: 'Upper 401',
    level: 'upper',
    baseAngle: 10,
    angleSpan: 10,
    rows: generateRows(26, 45, 28, 18, 30, true),
    vertices3D: [
      { x: 82, y: 11, z: 15 },
      { x: 74, y: 33, z: 15 },
      { x: 98, y: 45, z: 35 },
      { x: 108, y: 15, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },
  {
    id: '402',
    name: 'Upper 402',
    level: 'upper',
    baseAngle: 20,
    angleSpan: 10,
    rows: generateRows(26, 45, 29, 18, 30, true),
    vertices3D: [
      { x: 74, y: 33, z: 15 },
      { x: 63, y: 55, z: 15 },
      { x: 84, y: 75, z: 35 },
      { x: 98, y: 45, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },
  {
    id: '403',
    name: 'Upper 403 - Midfield',
    level: 'upper',
    baseAngle: 30,
    angleSpan: 15,
    rows: generateRows(26, 45, 32, 18, 30, true),
    vertices3D: [
      { x: 63, y: 55, z: 15 },
      { x: 48, y: 80, z: 15 },
      { x: 64, y: 110, z: 35 },
      { x: 84, y: 75, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'value'
  },
  {
    id: '404',
    name: 'Upper 404',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows(26, 45, 29, 18, 30, true),
    vertices3D: [
      { x: 48, y: 80, z: 15 },
      { x: 33, y: 102, z: 15 },
      { x: 44, y: 140, z: 35 },
      { x: 64, y: 110, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },
  {
    id: '405',
    name: 'Upper 405',
    level: 'upper',
    baseAngle: 55,
    angleSpan: 10,
    rows: generateRows(26, 45, 28, 18, 30, true),
    vertices3D: [
      { x: 33, y: 102, z: 15 },
      { x: 15, y: 124, z: 15 },
      { x: 20, y: 170, z: 35 },
      { x: 44, y: 140, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },

  // Upper South End
  {
    id: '421',
    name: 'Upper South 421',
    level: 'upper',
    baseAngle: 85,
    angleSpan: 10,
    rows: generateRows(23, 40, 26, 16, 28, true),
    vertices3D: [
      { x: 15, y: 124, z: 13 },
      { x: 0, y: 135, z: 13 },
      { x: 0, y: 185, z: 32 },
      { x: 20, y: 170, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },
  {
    id: '422',
    name: 'Upper South 422',
    level: 'upper',
    baseAngle: 95,
    angleSpan: 10,
    rows: generateRows(23, 40, 26, 16, 28, true),
    vertices3D: [
      { x: 0, y: 135, z: 13 },
      { x: -15, y: 124, z: 13 },
      { x: -20, y: 170, z: 32 },
      { x: 0, y: 185, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },

  // Upper West Side
  {
    id: '431',
    name: 'Upper 431',
    level: 'upper',
    baseAngle: 125,
    angleSpan: 10,
    rows: generateRows(26, 45, 28, 18, 30, true),
    vertices3D: [
      { x: -15, y: 124, z: 15 },
      { x: -33, y: 102, z: 15 },
      { x: -44, y: 140, z: 35 },
      { x: -20, y: 170, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },
  {
    id: '432',
    name: 'Upper 432',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 10,
    rows: generateRows(26, 45, 29, 18, 30, true),
    vertices3D: [
      { x: -33, y: 102, z: 15 },
      { x: -48, y: 80, z: 15 },
      { x: -64, y: 110, z: 35 },
      { x: -44, y: 140, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },
  {
    id: '433',
    name: 'Upper 433 - Midfield',
    level: 'upper',
    baseAngle: 145,
    angleSpan: 15,
    rows: generateRows(26, 45, 32, 18, 30, true),
    vertices3D: [
      { x: -48, y: 80, z: 15 },
      { x: -63, y: 55, z: 15 },
      { x: -84, y: 75, z: 35 },
      { x: -64, y: 110, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'value'
  },
  {
    id: '434',
    name: 'Upper 434',
    level: 'upper',
    baseAngle: 160,
    angleSpan: 10,
    rows: generateRows(26, 45, 29, 18, 30, true),
    vertices3D: [
      { x: -63, y: 55, z: 15 },
      { x: -74, y: 33, z: 15 },
      { x: -98, y: 45, z: 35 },
      { x: -84, y: 75, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },
  {
    id: '435',
    name: 'Upper 435',
    level: 'upper',
    baseAngle: 170,
    angleSpan: 10,
    rows: generateRows(26, 45, 28, 18, 30, true),
    vertices3D: [
      { x: -74, y: 33, z: 15 },
      { x: -82, y: 11, z: 15 },
      { x: -108, y: 15, z: 35 },
      { x: -98, y: 45, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: 'moderate'
  },

  // Upper North End
  {
    id: '451',
    name: 'Upper North 451',
    level: 'upper',
    baseAngle: 265,
    angleSpan: 10,
    rows: generateRows(23, 40, 26, 16, 28, true),
    vertices3D: [
      { x: -85, y: 0, z: 13 },
      { x: -74, y: -20, z: 13 },
      { x: -98, y: -28, z: 32 },
      { x: -112, y: 0, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },
  {
    id: '452',
    name: 'Upper North 452',
    level: 'upper',
    baseAngle: 275,
    angleSpan: 10,
    rows: generateRows(23, 40, 27, 16, 28, true),
    vertices3D: [
      { x: -74, y: -20, z: 13 },
      { x: -40, y: -35, z: 13 },
      { x: -53, y: -48, z: 32 },
      { x: -98, y: -28, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },
  {
    id: '453',
    name: 'Upper North 453',
    level: 'upper',
    baseAngle: 285,
    angleSpan: 10,
    rows: generateRows(23, 40, 28, 16, 28, true),
    vertices3D: [
      { x: -40, y: -35, z: 13 },
      { x: 0, y: -39, z: 13 },
      { x: 0, y: -54, z: 32 },
      { x: -53, y: -48, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },
  {
    id: '454',
    name: 'Upper North 454',
    level: 'upper',
    baseAngle: 295,
    angleSpan: 10,
    rows: generateRows(23, 40, 28, 16, 28, true),
    vertices3D: [
      { x: 0, y: -39, z: 13 },
      { x: 40, y: -35, z: 13 },
      { x: 53, y: -48, z: 32 },
      { x: 0, y: -54, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },
  {
    id: '455',
    name: 'Upper North 455',
    level: 'upper',
    baseAngle: 305,
    angleSpan: 10,
    rows: generateRows(23, 40, 27, 16, 28, true),
    vertices3D: [
      { x: 40, y: -35, z: 13 },
      { x: 74, y: -20, z: 13 },
      { x: 98, y: -28, z: 32 },
      { x: 53, y: -48, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },
  {
    id: '456',
    name: 'Upper North 456',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 10,
    rows: generateRows(23, 40, 26, 16, 28, true),
    vertices3D: [
      { x: 74, y: -20, z: 13 },
      { x: 85, y: 0, z: 13 },
      { x: 112, y: 0, z: 32 },
      { x: 98, y: -28, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value'
  },

  // Club Seats (Premium level)
  {
    id: 'C101',
    name: 'Club East',
    level: 'club',
    baseAngle: 25,
    angleSpan: 40,
    rows: generateRows(1, 10, 32, 15, 20, true),
    vertices3D: [
      { x: 63, y: 55, z: 15 },
      { x: 33, y: 102, z: 15 },
      { x: 44, y: 140, z: 22 },
      { x: 84, y: 75, z: 22 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 15,
    rake: 20,
    price: 'luxury'
  },
  {
    id: 'C201',
    name: 'Club West',
    level: 'club',
    baseAngle: 145,
    angleSpan: 40,
    rows: generateRows(1, 10, 32, 15, 20, true),
    vertices3D: [
      { x: -33, y: 102, z: 15 },
      { x: -63, y: 55, z: 15 },
      { x: -84, y: 75, z: 22 },
      { x: -44, y: 140, z: 22 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 15,
    rake: 20,
    price: 'luxury'
  }
];

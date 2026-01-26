// BMO Field (Toronto) - Comprehensive Section Data for 2026 World Cup
// Expanded capacity from 30,000 to 45,736 with temporary seating
// Based on: https://stadiumdb.com/stadiums/can/bmo_field
// Data sources: CBC News, StadiumDB, WorldCupRadar

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
        seats: seatsPerRow - Math.floor(rowNum * 0.15),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 28 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.15),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 28 - (rowNum * 0.3) : undefined
      });
    }
  }

  return rows;
}

// BMO Field sections - expanded for World Cup with temporary seating
export const bmofieldSections: DetailedSection[] = [
  // East Lower Bowl (Sections 101-111)
  {
    id: '101',
    name: 'East 101',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows(1, 20, 18, 0, 20, false),
    vertices3D: [
      { x: 50, y: 0, z: 0 },
      { x: 48, y: 8, z: 0 },
      { x: 62, y: 10, z: 12 },
      { x: 65, y: 0, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '102',
    name: 'East 102',
    level: 'lower',
    baseAngle: 8,
    angleSpan: 8,
    rows: generateRows(1, 20, 19, 0, 20, false),
    vertices3D: [
      { x: 48, y: 8, z: 0 },
      { x: 45, y: 16, z: 0 },
      { x: 58, y: 20, z: 12 },
      { x: 62, y: 10, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '103',
    name: 'East 103',
    level: 'lower',
    baseAngle: 16,
    angleSpan: 8,
    rows: generateRows(1, 20, 20, 0, 20, false),
    vertices3D: [
      { x: 45, y: 16, z: 0 },
      { x: 42, y: 24, z: 0 },
      { x: 54, y: 30, z: 12 },
      { x: 58, y: 20, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '104',
    name: 'East 104',
    level: 'lower',
    baseAngle: 24,
    angleSpan: 8,
    rows: generateRows(1, 20, 21, 0, 20, false),
    vertices3D: [
      { x: 42, y: 24, z: 0 },
      { x: 38, y: 32, z: 0 },
      { x: 49, y: 40, z: 12 },
      { x: 54, y: 30, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '105',
    name: 'East 105',
    level: 'lower',
    baseAngle: 32,
    angleSpan: 8,
    rows: generateRows(1, 20, 22, 0, 20, false),
    vertices3D: [
      { x: 38, y: 32, z: 0 },
      { x: 34, y: 40, z: 0 },
      { x: 44, y: 50, z: 12 },
      { x: 49, y: 40, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '106',
    name: 'East 106 - Midfield',
    level: 'lower',
    baseAngle: 40,
    angleSpan: 10,
    rows: generateRows(1, 20, 24, 0, 20, false),
    vertices3D: [
      { x: 34, y: 40, z: 0 },
      { x: 28, y: 50, z: 0 },
      { x: 36, y: 62, z: 12 },
      { x: 44, y: 50, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'luxury'
  },
  {
    id: '107',
    name: 'East 107',
    level: 'lower',
    baseAngle: 50,
    angleSpan: 8,
    rows: generateRows(1, 20, 22, 0, 20, false),
    vertices3D: [
      { x: 28, y: 50, z: 0 },
      { x: 24, y: 58, z: 0 },
      { x: 31, y: 72, z: 12 },
      { x: 36, y: 62, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '108',
    name: 'East 108',
    level: 'lower',
    baseAngle: 58,
    angleSpan: 8,
    rows: generateRows(1, 20, 21, 0, 20, false),
    vertices3D: [
      { x: 24, y: 58, z: 0 },
      { x: 20, y: 66, z: 0 },
      { x: 26, y: 82, z: 12 },
      { x: 31, y: 72, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '109',
    name: 'East 109',
    level: 'lower',
    baseAngle: 66,
    angleSpan: 8,
    rows: generateRows(1, 20, 20, 0, 20, false),
    vertices3D: [
      { x: 20, y: 66, z: 0 },
      { x: 16, y: 74, z: 0 },
      { x: 21, y: 92, z: 12 },
      { x: 26, y: 82, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '110',
    name: 'East 110',
    level: 'lower',
    baseAngle: 74,
    angleSpan: 8,
    rows: generateRows(1, 20, 19, 0, 20, false),
    vertices3D: [
      { x: 16, y: 74, z: 0 },
      { x: 12, y: 82, z: 0 },
      { x: 16, y: 102, z: 12 },
      { x: 21, y: 92, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '111',
    name: 'East 111',
    level: 'lower',
    baseAngle: 82,
    angleSpan: 8,
    rows: generateRows(1, 20, 18, 0, 20, false),
    vertices3D: [
      { x: 12, y: 82, z: 0 },
      { x: 10, y: 90, z: 0 },
      { x: 13, y: 112, z: 12 },
      { x: 16, y: 102, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },

  // South End (Temporary WC Seating - 7,000 seats)
  {
    id: '121',
    name: 'South End Lower Temporary',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 45,
    rows: generateRows(1, 15, 28, 0, 18, false),
    vertices3D: [
      { x: 10, y: 90, z: 0 },
      { x: -10, y: 90, z: 0 },
      { x: -15, y: 112, z: 10 },
      { x: 13, y: 112, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 18,
    price: 'moderate'
  },
  {
    id: '122',
    name: 'South End Upper Temporary',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 45,
    rows: generateRows(16, 28, 26, 12, 25, false),
    vertices3D: [
      { x: -15, y: 112, z: 10 },
      { x: 13, y: 112, z: 10 },
      { x: 18, y: 130, z: 25 },
      { x: -20, y: 130, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 25,
    price: 'value'
  },

  // West Lower Bowl (Sections 201-211)
  {
    id: '201',
    name: 'West 201',
    level: 'lower',
    baseAngle: 135,
    angleSpan: 8,
    rows: generateRows(1, 20, 18, 0, 20, false),
    vertices3D: [
      { x: -10, y: 90, z: 0 },
      { x: -12, y: 82, z: 0 },
      { x: -16, y: 102, z: 12 },
      { x: -13, y: 112, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '202',
    name: 'West 202',
    level: 'lower',
    baseAngle: 143,
    angleSpan: 8,
    rows: generateRows(1, 20, 19, 0, 20, false),
    vertices3D: [
      { x: -12, y: 82, z: 0 },
      { x: -16, y: 74, z: 0 },
      { x: -21, y: 92, z: 12 },
      { x: -16, y: 102, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '203',
    name: 'West 203',
    level: 'lower',
    baseAngle: 151,
    angleSpan: 8,
    rows: generateRows(1, 20, 20, 0, 20, false),
    vertices3D: [
      { x: -16, y: 74, z: 0 },
      { x: -20, y: 66, z: 0 },
      { x: -26, y: 82, z: 12 },
      { x: -21, y: 92, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '204',
    name: 'West 204',
    level: 'lower',
    baseAngle: 159,
    angleSpan: 8,
    rows: generateRows(1, 20, 21, 0, 20, false),
    vertices3D: [
      { x: -20, y: 66, z: 0 },
      { x: -24, y: 58, z: 0 },
      { x: -31, y: 72, z: 12 },
      { x: -26, y: 82, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '205',
    name: 'West 205',
    level: 'lower',
    baseAngle: 167,
    angleSpan: 8,
    rows: generateRows(1, 20, 22, 0, 20, false),
    vertices3D: [
      { x: -24, y: 58, z: 0 },
      { x: -28, y: 50, z: 0 },
      { x: -36, y: 62, z: 12 },
      { x: -31, y: 72, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '206',
    name: 'West 206 - Midfield',
    level: 'lower',
    baseAngle: 175,
    angleSpan: 10,
    rows: generateRows(1, 20, 24, 0, 20, false),
    vertices3D: [
      { x: -28, y: 50, z: 0 },
      { x: -34, y: 40, z: 0 },
      { x: -44, y: 50, z: 12 },
      { x: -36, y: 62, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'luxury'
  },
  {
    id: '207',
    name: 'West 207',
    level: 'lower',
    baseAngle: 185,
    angleSpan: 8,
    rows: generateRows(1, 20, 22, 0, 20, false),
    vertices3D: [
      { x: -34, y: 40, z: 0 },
      { x: -38, y: 32, z: 0 },
      { x: -49, y: 40, z: 12 },
      { x: -44, y: 50, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '208',
    name: 'West 208',
    level: 'lower',
    baseAngle: 193,
    angleSpan: 8,
    rows: generateRows(1, 20, 21, 0, 20, false),
    vertices3D: [
      { x: -38, y: 32, z: 0 },
      { x: -42, y: 24, z: 0 },
      { x: -54, y: 30, z: 12 },
      { x: -49, y: 40, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '209',
    name: 'West 209',
    level: 'lower',
    baseAngle: 201,
    angleSpan: 8,
    rows: generateRows(1, 20, 20, 0, 20, false),
    vertices3D: [
      { x: -42, y: 24, z: 0 },
      { x: -45, y: 16, z: 0 },
      { x: -58, y: 20, z: 12 },
      { x: -54, y: 30, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '210',
    name: 'West 210',
    level: 'lower',
    baseAngle: 209,
    angleSpan: 8,
    rows: generateRows(1, 20, 19, 0, 20, false),
    vertices3D: [
      { x: -45, y: 16, z: 0 },
      { x: -48, y: 8, z: 0 },
      { x: -62, y: 10, z: 12 },
      { x: -58, y: 20, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },
  {
    id: '211',
    name: 'West 211',
    level: 'lower',
    baseAngle: 217,
    angleSpan: 8,
    rows: generateRows(1, 20, 18, 0, 20, false),
    vertices3D: [
      { x: -48, y: 8, z: 0 },
      { x: -50, y: 0, z: 0 },
      { x: -65, y: 0, z: 12 },
      { x: -62, y: 10, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 0,
    rake: 20,
    price: 'premium'
  },

  // North End (Temporary WC Seating - 10,000 seats on two levels)
  {
    id: '221',
    name: 'North End Lower Temporary',
    level: 'lower',
    baseAngle: 270,
    angleSpan: 45,
    rows: generateRows(1, 18, 32, 0, 18, false),
    vertices3D: [
      { x: -50, y: 0, z: 0 },
      { x: 50, y: 0, z: 0 },
      { x: 65, y: -20, z: 12 },
      { x: -65, y: -20, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 0,
    rake: 18,
    price: 'moderate'
  },
  {
    id: '222',
    name: 'North End Upper Temporary',
    level: 'upper',
    baseAngle: 270,
    angleSpan: 45,
    rows: generateRows(19, 32, 30, 15, 25, false),
    vertices3D: [
      { x: 65, y: -20, z: 12 },
      { x: -65, y: -20, z: 12 },
      { x: -75, y: -38, z: 28 },
      { x: 75, y: -38, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 15,
    rake: 25,
    price: 'value'
  },

  // Upper Tier East (Sections 301-309)
  {
    id: '301',
    name: 'Upper East 301',
    level: 'upper',
    baseAngle: 16,
    angleSpan: 8,
    rows: generateRows(21, 35, 22, 15, 28, true),
    vertices3D: [
      { x: 62, y: 10, z: 12 },
      { x: 58, y: 20, z: 12 },
      { x: 72, y: 28, z: 28 },
      { x: 78, y: 14, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '302',
    name: 'Upper East 302',
    level: 'upper',
    baseAngle: 24,
    angleSpan: 8,
    rows: generateRows(21, 35, 23, 15, 28, true),
    vertices3D: [
      { x: 58, y: 20, z: 12 },
      { x: 54, y: 30, z: 12 },
      { x: 66, y: 42, z: 28 },
      { x: 72, y: 28, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '303',
    name: 'Upper East 303',
    level: 'upper',
    baseAngle: 32,
    angleSpan: 8,
    rows: generateRows(21, 35, 24, 15, 28, true),
    vertices3D: [
      { x: 54, y: 30, z: 12 },
      { x: 49, y: 40, z: 12 },
      { x: 60, y: 56, z: 28 },
      { x: 66, y: 42, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '304',
    name: 'Upper East 304 - Midfield',
    level: 'upper',
    baseAngle: 40,
    angleSpan: 10,
    rows: generateRows(21, 35, 26, 15, 28, true),
    vertices3D: [
      { x: 49, y: 40, z: 12 },
      { x: 44, y: 50, z: 12 },
      { x: 53, y: 70, z: 28 },
      { x: 60, y: 56, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '305',
    name: 'Upper East 305',
    level: 'upper',
    baseAngle: 50,
    angleSpan: 8,
    rows: generateRows(21, 35, 24, 15, 28, true),
    vertices3D: [
      { x: 44, y: 50, z: 12 },
      { x: 36, y: 62, z: 12 },
      { x: 44, y: 86, z: 28 },
      { x: 53, y: 70, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '306',
    name: 'Upper East 306',
    level: 'upper',
    baseAngle: 58,
    angleSpan: 8,
    rows: generateRows(21, 35, 23, 15, 28, true),
    vertices3D: [
      { x: 36, y: 62, z: 12 },
      { x: 31, y: 72, z: 12 },
      { x: 38, y: 100, z: 28 },
      { x: 44, y: 86, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '307',
    name: 'Upper East 307',
    level: 'upper',
    baseAngle: 66,
    angleSpan: 8,
    rows: generateRows(21, 35, 22, 15, 28, true),
    vertices3D: [
      { x: 31, y: 72, z: 12 },
      { x: 26, y: 82, z: 12 },
      { x: 32, y: 114, z: 28 },
      { x: 38, y: 100, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '308',
    name: 'Upper East 308',
    level: 'upper',
    baseAngle: 74,
    angleSpan: 8,
    rows: generateRows(21, 35, 21, 15, 28, true),
    vertices3D: [
      { x: 26, y: 82, z: 12 },
      { x: 21, y: 92, z: 12 },
      { x: 26, y: 128, z: 28 },
      { x: 32, y: 114, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '309',
    name: 'Upper East 309',
    level: 'upper',
    baseAngle: 82,
    angleSpan: 8,
    rows: generateRows(21, 35, 20, 15, 28, true),
    vertices3D: [
      { x: 21, y: 92, z: 12 },
      { x: 16, y: 102, z: 12 },
      { x: 20, y: 142, z: 28 },
      { x: 26, y: 128, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },

  // Upper Tier West (Sections 401-409)
  {
    id: '401',
    name: 'Upper West 401',
    level: 'upper',
    baseAngle: 151,
    angleSpan: 8,
    rows: generateRows(21, 35, 20, 15, 28, true),
    vertices3D: [
      { x: -16, y: 102, z: 12 },
      { x: -21, y: 92, z: 12 },
      { x: -26, y: 128, z: 28 },
      { x: -20, y: 142, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '402',
    name: 'Upper West 402',
    level: 'upper',
    baseAngle: 159,
    angleSpan: 8,
    rows: generateRows(21, 35, 21, 15, 28, true),
    vertices3D: [
      { x: -21, y: 92, z: 12 },
      { x: -26, y: 82, z: 12 },
      { x: -32, y: 114, z: 28 },
      { x: -26, y: 128, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '403',
    name: 'Upper West 403',
    level: 'upper',
    baseAngle: 167,
    angleSpan: 8,
    rows: generateRows(21, 35, 22, 15, 28, true),
    vertices3D: [
      { x: -26, y: 82, z: 12 },
      { x: -31, y: 72, z: 12 },
      { x: -38, y: 100, z: 28 },
      { x: -32, y: 114, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '404',
    name: 'Upper West 404',
    level: 'upper',
    baseAngle: 175,
    angleSpan: 8,
    rows: generateRows(21, 35, 23, 15, 28, true),
    vertices3D: [
      { x: -31, y: 72, z: 12 },
      { x: -36, y: 62, z: 12 },
      { x: -44, y: 86, z: 28 },
      { x: -38, y: 100, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '405',
    name: 'Upper West 405',
    level: 'upper',
    baseAngle: 183,
    angleSpan: 8,
    rows: generateRows(21, 35, 24, 15, 28, true),
    vertices3D: [
      { x: -36, y: 62, z: 12 },
      { x: -44, y: 50, z: 12 },
      { x: -53, y: 70, z: 28 },
      { x: -44, y: 86, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '406',
    name: 'Upper West 406 - Midfield',
    level: 'upper',
    baseAngle: 191,
    angleSpan: 10,
    rows: generateRows(21, 35, 26, 15, 28, true),
    vertices3D: [
      { x: -44, y: 50, z: 12 },
      { x: -49, y: 40, z: 12 },
      { x: -60, y: 56, z: 28 },
      { x: -53, y: 70, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '407',
    name: 'Upper West 407',
    level: 'upper',
    baseAngle: 201,
    angleSpan: 8,
    rows: generateRows(21, 35, 24, 15, 28, true),
    vertices3D: [
      { x: -49, y: 40, z: 12 },
      { x: -54, y: 30, z: 12 },
      { x: -66, y: 42, z: 28 },
      { x: -60, y: 56, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '408',
    name: 'Upper West 408',
    level: 'upper',
    baseAngle: 209,
    angleSpan: 8,
    rows: generateRows(21, 35, 23, 15, 28, true),
    vertices3D: [
      { x: -54, y: 30, z: 12 },
      { x: -58, y: 20, z: 12 },
      { x: -72, y: 28, z: 28 },
      { x: -66, y: 42, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '409',
    name: 'Upper West 409',
    level: 'upper',
    baseAngle: 217,
    angleSpan: 8,
    rows: generateRows(21, 35, 22, 15, 28, true),
    vertices3D: [
      { x: -58, y: 20, z: 12 },
      { x: -62, y: 10, z: 12 },
      { x: -78, y: 14, z: 28 },
      { x: -72, y: 28, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 75,
    height: 15,
    rake: 28,
    price: 'moderate'
  },

  // Club Seats (Premium level between lower and upper)
  {
    id: 'C101',
    name: 'Club East',
    level: 'club',
    baseAngle: 30,
    angleSpan: 30,
    rows: generateRows(1, 8, 28, 12, 18, true),
    vertices3D: [
      { x: 49, y: 40, z: 12 },
      { x: 36, y: 62, z: 12 },
      { x: 44, y: 86, z: 18 },
      { x: 60, y: 56, z: 18 }
    ] as Vector3D[],
    covered: true,
    distance: 60,
    height: 12,
    rake: 18,
    price: 'luxury'
  },
  {
    id: 'C201',
    name: 'Club West',
    level: 'club',
    baseAngle: 165,
    angleSpan: 30,
    rows: generateRows(1, 8, 28, 12, 18, true),
    vertices3D: [
      { x: -36, y: 62, z: 12 },
      { x: -49, y: 40, z: 12 },
      { x: -60, y: 56, z: 18 },
      { x: -44, y: 86, z: 18 }
    ] as Vector3D[],
    covered: true,
    distance: 60,
    height: 12,
    rake: 18,
    price: 'luxury'
  }
];

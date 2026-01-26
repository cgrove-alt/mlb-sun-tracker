// Estadio BBVA (Monterrey) - Comprehensive Section Data for 2026 World Cup
// Capacity: 53,500 (43,000 general, 5,000 club, 324 suites)
// Distinctive 34-degree rake, first row only 9 meters from field
// Based on: https://stadiumdb.com/stadiums/mex/estadio_bbva_bancomer
// Data sources: StadiumDB, SeatPick, WorldCupRadar, Official CF Monterrey site

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper function to generate rows with BBVA's unique steep rake
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.7; // Slightly taller due to steep rake
  const rowDepth = 2.6; // Closer together for steep viewing angle

  const isLetterRows = typeof startRow === 'string';

  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);

    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.08),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 38 - (rowNum * 0.35) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.08),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 38 - (rowNum * 0.35) : undefined
      });
    }
  }

  return rows;
}

// Estadio BBVA sections - modern stadium with exceptional sightlines (34° rake)
export const estadiobbvaSections: DetailedSection[] = [
  // Lower Bowl East (Sections 101-122) - Very close to field (9m to first row)
  {
    id: '101',
    name: 'Platea 101',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 26, 0, 34, false),
    vertices3D: [
      { x: 55, y: 0, z: 0 },
      { x: 54, y: 6, z: 0 },
      { x: 68, y: 8, z: 18 },
      { x: 70, y: 0, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '102',
    name: 'Platea 102',
    level: 'lower',
    baseAngle: 5.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 27, 0, 34, false),
    vertices3D: [
      { x: 54, y: 6, z: 0 },
      { x: 52, y: 12, z: 0 },
      { x: 65, y: 16, z: 18 },
      { x: 68, y: 8, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '103',
    name: 'Platea 103',
    level: 'lower',
    baseAngle: 11,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 28, 0, 34, false),
    vertices3D: [
      { x: 52, y: 12, z: 0 },
      { x: 49, y: 18, z: 0 },
      { x: 62, y: 24, z: 18 },
      { x: 65, y: 16, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '104',
    name: 'Platea 104',
    level: 'lower',
    baseAngle: 16.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 29, 0, 34, false),
    vertices3D: [
      { x: 49, y: 18, z: 0 },
      { x: 46, y: 24, z: 0 },
      { x: 58, y: 32, z: 18 },
      { x: 62, y: 24, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '105',
    name: 'Platea 105',
    level: 'lower',
    baseAngle: 22,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 30, 0, 34, false),
    vertices3D: [
      { x: 46, y: 24, z: 0 },
      { x: 42, y: 30, z: 0 },
      { x: 53, y: 40, z: 18 },
      { x: 58, y: 32, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '106',
    name: 'Platea 106',
    level: 'lower',
    baseAngle: 27.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 31, 0, 34, false),
    vertices3D: [
      { x: 42, y: 30, z: 0 },
      { x: 38, y: 36, z: 0 },
      { x: 48, y: 48, z: 18 },
      { x: 53, y: 40, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '107',
    name: 'Platea 107',
    level: 'lower',
    baseAngle: 33,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 32, 0, 34, false),
    vertices3D: [
      { x: 38, y: 36, z: 0 },
      { x: 33, y: 42, z: 0 },
      { x: 42, y: 56, z: 18 },
      { x: 48, y: 48, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '108',
    name: 'Platea 108 - Midfield',
    level: 'lower',
    baseAngle: 38.5,
    angleSpan: 11,
    rows: generateRows(1, 24, 34, 0, 34, false),
    vertices3D: [
      { x: 33, y: 42, z: 0 },
      { x: 23, y: 54, z: 0 },
      { x: 29, y: 72, z: 18 },
      { x: 42, y: 56, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'luxury'
  },
  {
    id: '109',
    name: 'Platea 109',
    level: 'lower',
    baseAngle: 49.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 32, 0, 34, false),
    vertices3D: [
      { x: 23, y: 54, z: 0 },
      { x: 18, y: 60, z: 0 },
      { x: 23, y: 80, z: 18 },
      { x: 29, y: 72, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '110',
    name: 'Platea 110',
    level: 'lower',
    baseAngle: 55,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 31, 0, 34, false),
    vertices3D: [
      { x: 18, y: 60, z: 0 },
      { x: 12, y: 66, z: 0 },
      { x: 15, y: 88, z: 18 },
      { x: 23, y: 80, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '111',
    name: 'Platea 111',
    level: 'lower',
    baseAngle: 60.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 30, 0, 34, false),
    vertices3D: [
      { x: 12, y: 66, z: 0 },
      { x: 6, y: 72, z: 0 },
      { x: 8, y: 96, z: 18 },
      { x: 15, y: 88, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '112',
    name: 'Platea 112',
    level: 'lower',
    baseAngle: 66,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 29, 0, 34, false),
    vertices3D: [
      { x: 6, y: 72, z: 0 },
      { x: 0, y: 78, z: 0 },
      { x: 0, y: 104, z: 18 },
      { x: 8, y: 96, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '113',
    name: 'Platea 113',
    level: 'lower',
    baseAngle: 71.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 28, 0, 34, false),
    vertices3D: [
      { x: 0, y: 78, z: 0 },
      { x: -6, y: 72, z: 0 },
      { x: -8, y: 96, z: 18 },
      { x: 0, y: 104, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '114',
    name: 'Platea 114',
    level: 'lower',
    baseAngle: 77,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 27, 0, 34, false),
    vertices3D: [
      { x: -6, y: 72, z: 0 },
      { x: -12, y: 66, z: 0 },
      { x: -15, y: 88, z: 18 },
      { x: -8, y: 96, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },
  {
    id: '115',
    name: 'Platea 115',
    level: 'lower',
    baseAngle: 82.5,
    angleSpan: 5.5,
    rows: generateRows(1, 24, 26, 0, 34, false),
    vertices3D: [
      { x: -12, y: 66, z: 0 },
      { x: -18, y: 60, z: 0 },
      { x: -23, y: 80, z: 18 },
      { x: -15, y: 88, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'premium'
  },

  // West Side (116-130)
  {
    id: '116',
    name: 'Platea 116 - Midfield',
    level: 'lower',
    baseAngle: 88,
    angleSpan: 11,
    rows: generateRows(1, 24, 34, 0, 34, false),
    vertices3D: [
      { x: -18, y: 60, z: 0 },
      { x: -29, y: 72, z: 0 },
      { x: -37, y: 96, z: 18 },
      { x: -23, y: 80, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'luxury'
  },

  {
    id: '120',
    name: 'Platea 120 - Midfield',
    level: 'lower',
    baseAngle: 120,
    angleSpan: 11,
    rows: generateRows(1, 24, 34, 0, 34, false),
    vertices3D: [
      { x: -38, y: 36, z: 0 },
      { x: -48, y: 48, z: 0 },
      { x: -61, y: 64, z: 18 },
      { x: -48, y: 48, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: 'luxury'
  },

  // South End Sections (131-145)
  {
    id: '131',
    name: 'Platea Sur 131',
    level: 'lower',
    baseAngle: 150,
    angleSpan: 5.5,
    rows: generateRows(1, 22, 24, 0, 32, false),
    vertices3D: [
      { x: -49, y: 18, z: 0 },
      { x: -52, y: 12, z: 0 },
      { x: -65, y: 16, z: 16 },
      { x: -62, y: 24, z: 16 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 32,
    price: 'moderate'
  },

  {
    id: '138',
    name: 'Platea Sur 138 - Center',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 11,
    rows: generateRows(1, 22, 30, 0, 32, false),
    vertices3D: [
      { x: -55, y: 0, z: 0 },
      { x: -46, y: -24, z: 0 },
      { x: -58, y: -32, z: 16 },
      { x: -70, y: 0, z: 16 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 32,
    price: 'moderate'
  },

  // North End Sections (146-160)
  {
    id: '153',
    name: 'Platea Norte 153 - Center',
    level: 'lower',
    baseAngle: 270,
    angleSpan: 11,
    rows: generateRows(1, 22, 30, 0, 32, false),
    vertices3D: [
      { x: 46, y: -24, z: 0 },
      { x: 55, y: 0, z: 0 },
      { x: 70, y: 0, z: 16 },
      { x: 58, y: -32, z: 16 }
    ] as Vector3D[],
    covered: true,
    distance: 65,
    height: 0,
    rake: 32,
    price: 'moderate'
  },

  // Upper Bowl East (Sections 201-222)
  {
    id: '201',
    name: 'Platea Alta 201',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 5.5,
    rows: generateRows(25, 45, 28, 20, 34, true),
    vertices3D: [
      { x: 70, y: 0, z: 18 },
      { x: 68, y: 8, z: 18 },
      { x: 88, y: 11, z: 40 },
      { x: 91, y: 0, z: 40 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: 'moderate'
  },
  {
    id: '202',
    name: 'Platea Alta 202',
    level: 'upper',
    baseAngle: 5.5,
    angleSpan: 5.5,
    rows: generateRows(25, 45, 29, 20, 34, true),
    vertices3D: [
      { x: 68, y: 8, z: 18 },
      { x: 65, y: 16, z: 18 },
      { x: 84, y: 21, z: 40 },
      { x: 88, y: 11, z: 40 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: 'moderate'
  },
  {
    id: '208',
    name: 'Platea Alta 208 - Midfield',
    level: 'upper',
    baseAngle: 38.5,
    angleSpan: 11,
    rows: generateRows(25, 45, 36, 20, 34, true),
    vertices3D: [
      { x: 42, y: 56, z: 18 },
      { x: 29, y: 72, z: 18 },
      { x: 37, y: 96, z: 40 },
      { x: 54, y: 75, z: 40 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: 'value'
  },

  // Upper Bowl West
  {
    id: '216',
    name: 'Platea Alta 216 - Midfield',
    level: 'upper',
    baseAngle: 88,
    angleSpan: 11,
    rows: generateRows(25, 45, 36, 20, 34, true),
    vertices3D: [
      { x: -23, y: 80, z: 18 },
      { x: -37, y: 96, z: 18 },
      { x: -47, y: 128, z: 40 },
      { x: -29, y: 107, z: 40 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: 'value'
  },

  {
    id: '220',
    name: 'Platea Alta 220 - Midfield',
    level: 'upper',
    baseAngle: 120,
    angleSpan: 11,
    rows: generateRows(25, 45, 36, 20, 34, true),
    vertices3D: [
      { x: -42, y: 56, z: 18 },
      { x: -54, y: 75, z: 18 },
      { x: -69, y: 100, z: 40 },
      { x: -54, y: 75, z: 40 }
    ] as Vector3D[],
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: 'value'
  },

  // Upper Bowl South
  {
    id: '238',
    name: 'Platea Alta Sur 238',
    level: 'upper',
    baseAngle: 180,
    angleSpan: 11,
    rows: generateRows(23, 42, 32, 18, 32, true),
    vertices3D: [
      { x: -70, y: 0, z: 16 },
      { x: -58, y: -32, z: 16 },
      { x: -74, y: -43, z: 36 },
      { x: -91, y: 0, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 90,
    height: 18,
    rake: 32,
    price: 'value'
  },

  // Upper Bowl North
  {
    id: '253',
    name: 'Platea Alta Norte 253',
    level: 'upper',
    baseAngle: 270,
    angleSpan: 11,
    rows: generateRows(23, 42, 32, 18, 32, true),
    vertices3D: [
      { x: 58, y: -32, z: 16 },
      { x: 70, y: 0, z: 16 },
      { x: 91, y: 0, z: 36 },
      { x: 74, y: -43, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 90,
    height: 18,
    rake: 32,
    price: 'value'
  },

  // Club Seats (5,000 premium seats)
  {
    id: 'C101',
    name: 'Club Este',
    level: 'club',
    baseAngle: 28,
    angleSpan: 33,
    rows: generateRows(1, 8, 40, 18, 28, true),
    vertices3D: [
      { x: 48, y: 48, z: 18 },
      { x: 23, y: 80, z: 18 },
      { x: 29, y: 107, z: 26 },
      { x: 61, y: 64, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 72,
    height: 18,
    rake: 28,
    price: 'luxury'
  },
  {
    id: 'C201',
    name: 'Club Oeste',
    level: 'club',
    baseAngle: 95,
    angleSpan: 33,
    rows: generateRows(1, 8, 40, 18, 28, true),
    vertices3D: [
      { x: -23, y: 80, z: 18 },
      { x: -48, y: 48, z: 18 },
      { x: -61, y: 64, z: 26 },
      { x: -29, y: 107, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 72,
    height: 18,
    rake: 28,
    price: 'luxury'
  },

  // Palcos (324 Executive Suites - highest % worldwide)
  {
    id: 'P01',
    name: 'Palco Este 01',
    level: 'club',
    baseAngle: 20,
    angleSpan: 20,
    rows: generateRows(1, 4, 12, 18, 20, true),
    vertices3D: [
      { x: 53, y: 40, z: 18 },
      { x: 42, y: 56, z: 18 },
      { x: 54, y: 75, z: 23 },
      { x: 67, y: 54, z: 23 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 18,
    rake: 20,
    price: 'luxury'
  },
  {
    id: 'P02',
    name: 'Palco Oeste 02',
    level: 'club',
    baseAngle: 105,
    angleSpan: 20,
    rows: generateRows(1, 4, 12, 18, 20, true),
    vertices3D: [
      { x: -42, y: 56, z: 18 },
      { x: -53, y: 40, z: 18 },
      { x: -67, y: 54, z: 23 },
      { x: -54, y: 75, z: 23 }
    ] as Vector3D[],
    covered: true,
    distance: 68,
    height: 18,
    rake: 20,
    price: 'luxury'
  }
];

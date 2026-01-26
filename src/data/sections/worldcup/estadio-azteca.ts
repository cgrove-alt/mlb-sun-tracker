// Estadio Azteca (Mexico City) - Comprehensive Section Data for 2026 World Cup
// Capacity: 87,523 (expanding to 90,000+ for World Cup)
// Historic venue - hosted 1970 and 1986 World Cup Finals
// Based on: https://stadiumdb.com/stadiums/mex/estadio_azteca
// Data sources: StadiumDB, FourFourTwo, FIFA Official

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
  const rowHeight = 2.6;
  const rowDepth = 2.9;

  const isLetterRows = typeof startRow === 'string';

  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);

    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.09),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 40 - (rowNum * 0.28) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.09),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 40 - (rowNum * 0.28) : undefined
      });
    }
  }

  return rows;
}

// Estadio Azteca sections - massive three-tier bowl
export const estadioaztecaSections: DetailedSection[] = [
  // Lower Bowl East (Sections 101-146) - Steep three-tier design
  {
    id: '101',
    name: 'Platea Baja 101',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 30, 0, 26, false),
    vertices3D: [
      { x: 70, y: 0, z: 0 },
      { x: 69, y: 6, z: 0 },
      { x: 88, y: 8, z: 18 },
      { x: 90, y: 0, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '102',
    name: 'Platea Baja 102',
    level: 'lower',
    baseAngle: 4.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 31, 0, 26, false),
    vertices3D: [
      { x: 69, y: 6, z: 0 },
      { x: 67, y: 12, z: 0 },
      { x: 86, y: 16, z: 18 },
      { x: 88, y: 8, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '103',
    name: 'Platea Baja 103',
    level: 'lower',
    baseAngle: 9,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 32, 0, 26, false),
    vertices3D: [
      { x: 67, y: 12, z: 0 },
      { x: 65, y: 18, z: 0 },
      { x: 83, y: 24, z: 18 },
      { x: 86, y: 16, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '104',
    name: 'Platea Baja 104',
    level: 'lower',
    baseAngle: 13.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 33, 0, 26, false),
    vertices3D: [
      { x: 65, y: 18, z: 0 },
      { x: 62, y: 24, z: 0 },
      { x: 79, y: 32, z: 18 },
      { x: 83, y: 24, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '105',
    name: 'Platea Baja 105',
    level: 'lower',
    baseAngle: 18,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 34, 0, 26, false),
    vertices3D: [
      { x: 62, y: 24, z: 0 },
      { x: 59, y: 30, z: 0 },
      { x: 75, y: 40, z: 18 },
      { x: 79, y: 32, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '106',
    name: 'Platea Baja 106',
    level: 'lower',
    baseAngle: 22.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 35, 0, 26, false),
    vertices3D: [
      { x: 59, y: 30, z: 0 },
      { x: 55, y: 36, z: 0 },
      { x: 70, y: 48, z: 18 },
      { x: 75, y: 40, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '107',
    name: 'Platea Baja 107',
    level: 'lower',
    baseAngle: 27,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 36, 0, 26, false),
    vertices3D: [
      { x: 55, y: 36, z: 0 },
      { x: 51, y: 42, z: 0 },
      { x: 65, y: 56, z: 18 },
      { x: 70, y: 48, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '108',
    name: 'Platea Baja 108',
    level: 'lower',
    baseAngle: 31.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 37, 0, 26, false),
    vertices3D: [
      { x: 51, y: 42, z: 0 },
      { x: 46, y: 48, z: 0 },
      { x: 59, y: 64, z: 18 },
      { x: 65, y: 56, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '109',
    name: 'Platea Baja 109 - Midfield',
    level: 'lower',
    baseAngle: 36,
    angleSpan: 9,
    rows: generateRows(1, 28, 40, 0, 26, false),
    vertices3D: [
      { x: 46, y: 48, z: 0 },
      { x: 36, y: 60, z: 0 },
      { x: 46, y: 80, z: 18 },
      { x: 59, y: 64, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'luxury'
  },
  {
    id: '110',
    name: 'Platea Baja 110',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 37, 0, 26, false),
    vertices3D: [
      { x: 36, y: 60, z: 0 },
      { x: 31, y: 66, z: 0 },
      { x: 40, y: 88, z: 18 },
      { x: 46, y: 80, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '111',
    name: 'Platea Baja 111',
    level: 'lower',
    baseAngle: 49.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 36, 0, 26, false),
    vertices3D: [
      { x: 31, y: 66, z: 0 },
      { x: 26, y: 72, z: 0 },
      { x: 33, y: 96, z: 18 },
      { x: 40, y: 88, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '112',
    name: 'Platea Baja 112',
    level: 'lower',
    baseAngle: 54,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 35, 0, 26, false),
    vertices3D: [
      { x: 26, y: 72, z: 0 },
      { x: 20, y: 78, z: 0 },
      { x: 26, y: 104, z: 18 },
      { x: 33, y: 96, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '113',
    name: 'Platea Baja 113',
    level: 'lower',
    baseAngle: 58.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 34, 0, 26, false),
    vertices3D: [
      { x: 20, y: 78, z: 0 },
      { x: 14, y: 84, z: 0 },
      { x: 18, y: 112, z: 18 },
      { x: 26, y: 104, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '114',
    name: 'Platea Baja 114',
    level: 'lower',
    baseAngle: 63,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 33, 0, 26, false),
    vertices3D: [
      { x: 14, y: 84, z: 0 },
      { x: 8, y: 90, z: 0 },
      { x: 10, y: 120, z: 18 },
      { x: 18, y: 112, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '115',
    name: 'Platea Baja 115',
    level: 'lower',
    baseAngle: 67.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 32, 0, 26, false),
    vertices3D: [
      { x: 8, y: 90, z: 0 },
      { x: 2, y: 96, z: 0 },
      { x: 3, y: 128, z: 18 },
      { x: 10, y: 120, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '116',
    name: 'Platea Baja 116',
    level: 'lower',
    baseAngle: 72,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 31, 0, 26, false),
    vertices3D: [
      { x: 2, y: 96, z: 0 },
      { x: -4, y: 102, z: 0 },
      { x: -5, y: 136, z: 18 },
      { x: 3, y: 128, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },
  {
    id: '117',
    name: 'Platea Baja 117',
    level: 'lower',
    baseAngle: 76.5,
    angleSpan: 4.5,
    rows: generateRows(1, 28, 30, 0, 26, false),
    vertices3D: [
      { x: -4, y: 102, z: 0 },
      { x: -10, y: 108, z: 0 },
      { x: -13, y: 144, z: 18 },
      { x: -5, y: 136, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'premium'
  },

  // West Side (118-140) - Representative sections
  {
    id: '118',
    name: 'Platea Baja 118 - Midfield',
    level: 'lower',
    baseAngle: 81,
    angleSpan: 9,
    rows: generateRows(1, 28, 40, 0, 26, false),
    vertices3D: [
      { x: -10, y: 108, z: 0 },
      { x: -26, y: 120, z: 0 },
      { x: -33, y: 160, z: 18 },
      { x: -13, y: 144, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'luxury'
  },

  {
    id: '127',
    name: 'Platea Baja 127 - Midfield',
    level: 'lower',
    baseAngle: 117,
    angleSpan: 9,
    rows: generateRows(1, 28, 40, 0, 26, false),
    vertices3D: [
      { x: -51, y: 42, z: 0 },
      { x: -65, y: 56, z: 0 },
      { x: -83, y: 75, z: 18 },
      { x: -65, y: 56, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: 'luxury'
  },

  // South End (141-156)
  {
    id: '148',
    name: 'Platea Baja 148',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 9,
    rows: generateRows(1, 26, 36, 0, 24, false),
    vertices3D: [
      { x: -70, y: 0, z: 0 },
      { x: -59, y: -30, z: 0 },
      { x: -75, y: -40, z: 16 },
      { x: -90, y: 0, z: 16 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 0,
    rake: 24,
    price: 'moderate'
  },

  // North End (157-172)
  {
    id: '164',
    name: 'Platea Baja 164',
    level: 'lower',
    baseAngle: 270,
    angleSpan: 9,
    rows: generateRows(1, 26, 36, 0, 24, false),
    vertices3D: [
      { x: 59, y: -30, z: 0 },
      { x: 70, y: 0, z: 0 },
      { x: 90, y: 0, z: 16 },
      { x: 75, y: -40, z: 16 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 0,
    rake: 24,
    price: 'moderate'
  },

  // Middle Tier East (Sections 201-246)
  {
    id: '201',
    name: 'Platea Media 201',
    level: 'club',
    baseAngle: 0,
    angleSpan: 4.5,
    rows: generateRows(29, 50, 32, 20, 28, true),
    vertices3D: [
      { x: 90, y: 0, z: 18 },
      { x: 88, y: 8, z: 18 },
      { x: 112, y: 11, z: 38 },
      { x: 115, y: 0, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 20,
    rake: 28,
    price: 'moderate'
  },
  {
    id: '209',
    name: 'Platea Media 209 - Midfield',
    level: 'club',
    baseAngle: 36,
    angleSpan: 9,
    rows: generateRows(29, 50, 42, 20, 28, true),
    vertices3D: [
      { x: 59, y: 64, z: 18 },
      { x: 46, y: 80, z: 18 },
      { x: 59, y: 107, z: 38 },
      { x: 75, y: 86, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 20,
    rake: 28,
    price: 'value'
  },

  {
    id: '218',
    name: 'Platea Media 218 - Midfield',
    level: 'club',
    baseAngle: 81,
    angleSpan: 9,
    rows: generateRows(29, 50, 42, 20, 28, true),
    vertices3D: [
      { x: -13, y: 144, z: 18 },
      { x: -33, y: 160, z: 18 },
      { x: -42, y: 214, z: 38 },
      { x: -17, y: 192, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 20,
    rake: 28,
    price: 'value'
  },

  {
    id: '227',
    name: 'Platea Media 227 - Midfield',
    level: 'club',
    baseAngle: 117,
    angleSpan: 9,
    rows: generateRows(29, 50, 42, 20, 28, true),
    vertices3D: [
      { x: -65, y: 56, z: 18 },
      { x: -83, y: 75, z: 18 },
      { x: -105, y: 100, z: 38 },
      { x: -83, y: 75, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 20,
    rake: 28,
    price: 'value'
  },

  // Middle Tier South/North
  {
    id: '248',
    name: 'Platea Media 248',
    level: 'club',
    baseAngle: 180,
    angleSpan: 9,
    rows: generateRows(27, 48, 38, 18, 26, true),
    vertices3D: [
      { x: -90, y: 0, z: 16 },
      { x: -75, y: -40, z: 16 },
      { x: -95, y: -54, z: 36 },
      { x: -115, y: 0, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 105,
    height: 18,
    rake: 26,
    price: 'value'
  },

  {
    id: '264',
    name: 'Platea Media 264',
    level: 'club',
    baseAngle: 270,
    angleSpan: 9,
    rows: generateRows(27, 48, 38, 18, 26, true),
    vertices3D: [
      { x: 75, y: -40, z: 16 },
      { x: 90, y: 0, z: 16 },
      { x: 115, y: 0, z: 36 },
      { x: 95, y: -54, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 105,
    height: 18,
    rake: 26,
    price: 'value'
  },

  // Upper Tier (Sections 301-372) - Steep upper bowl
  {
    id: '301',
    name: 'Platea Alta 301',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 4.5,
    rows: generateRows(51, 75, 34, 40, 32, true),
    vertices3D: [
      { x: 115, y: 0, z: 38 },
      { x: 112, y: 11, z: 38 },
      { x: 142, y: 14, z: 62 },
      { x: 146, y: 0, z: 62 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 40,
    rake: 32,
    price: 'value'
  },
  {
    id: '309',
    name: 'Platea Alta 309 - Midfield',
    level: 'upper',
    baseAngle: 36,
    angleSpan: 9,
    rows: generateRows(51, 75, 44, 40, 32, true),
    vertices3D: [
      { x: 75, y: 86, z: 38 },
      { x: 59, y: 107, z: 38 },
      { x: 75, y: 136, z: 62 },
      { x: 95, y: 109, z: 62 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 40,
    rake: 32,
    price: 'value'
  },

  {
    id: '327',
    name: 'Platea Alta 327 - Midfield',
    level: 'upper',
    baseAngle: 117,
    angleSpan: 9,
    rows: generateRows(51, 75, 44, 40, 32, true),
    vertices3D: [
      { x: -83, y: 75, z: 38 },
      { x: -105, y: 100, z: 38 },
      { x: -133, y: 127, z: 62 },
      { x: -105, y: 95, z: 62 }
    ] as Vector3D[],
    covered: true,
    distance: 125,
    height: 40,
    rake: 32,
    price: 'value'
  },

  // Upper South/North
  {
    id: '348',
    name: 'Platea Alta 348',
    level: 'upper',
    baseAngle: 180,
    angleSpan: 9,
    rows: generateRows(49, 72, 40, 38, 30, true),
    vertices3D: [
      { x: -115, y: 0, z: 36 },
      { x: -95, y: -54, z: 36 },
      { x: -121, y: -68, z: 58 },
      { x: -146, y: 0, z: 58 }
    ] as Vector3D[],
    covered: true,
    distance: 130,
    height: 38,
    rake: 30,
    price: 'value'
  },

  {
    id: '364',
    name: 'Platea Alta 364',
    level: 'upper',
    baseAngle: 270,
    angleSpan: 9,
    rows: generateRows(49, 72, 40, 38, 30, true),
    vertices3D: [
      { x: 95, y: -54, z: 36 },
      { x: 115, y: 0, z: 36 },
      { x: 146, y: 0, z: 58 },
      { x: 121, y: -68, z: 58 }
    ] as Vector3D[],
    covered: true,
    distance: 130,
    height: 38,
    rake: 30,
    price: 'value'
  },

  // Palcos (Premium Suites)
  {
    id: 'P01',
    name: 'Palco Este',
    level: 'club',
    baseAngle: 27,
    angleSpan: 27,
    rows: generateRows(1, 6, 48, 20, 22, true),
    vertices3D: [
      { x: 70, y: 48, z: 18 },
      { x: 46, y: 80, z: 18 },
      { x: 59, y: 107, z: 26 },
      { x: 89, y: 64, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 88,
    height: 20,
    rake: 22,
    price: 'luxury'
  },
  {
    id: 'P02',
    name: 'Palco Oeste',
    level: 'club',
    baseAngle: 99,
    angleSpan: 27,
    rows: generateRows(1, 6, 48, 20, 22, true),
    vertices3D: [
      { x: -46, y: 80, z: 18 },
      { x: -70, y: 48, z: 18 },
      { x: -89, y: 64, z: 26 },
      { x: -59, y: 107, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 88,
    height: 20,
    rake: 22,
    price: 'luxury'
  },

  // Asientos Club (Club Seats)
  {
    id: 'C01',
    name: 'Club Este',
    level: 'club',
    baseAngle: 30,
    angleSpan: 30,
    rows: generateRows(1, 10, 44, 20, 24, true),
    vertices3D: [
      { x: 65, y: 56, z: 18 },
      { x: 40, y: 88, z: 18 },
      { x: 51, y: 118, z: 28 },
      { x: 83, y: 75, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 88,
    height: 20,
    rake: 24,
    price: 'luxury'
  },
  {
    id: 'C02',
    name: 'Club Oeste',
    level: 'club',
    baseAngle: 105,
    angleSpan: 30,
    rows: generateRows(1, 10, 44, 20, 24, true),
    vertices3D: [
      { x: -40, y: 88, z: 18 },
      { x: -65, y: 56, z: 18 },
      { x: -83, y: 75, z: 28 },
      { x: -51, y: 118, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 88,
    height: 20,
    rake: 24,
    price: 'luxury'
  }
];

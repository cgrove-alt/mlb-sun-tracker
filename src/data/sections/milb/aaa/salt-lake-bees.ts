// Smith's Ballpark - Salt Lake Bees (Los Angeles Angels AAA)
// Opened: 1994
// Capacity: 15,411
// Known for Wasatch Mountain views and high altitude home runs

import { DetailedSection } from '../../../../types/stadium-complete';

// Helper function for row generation
const generateRows = (
  startRow: string | number,
  endRow: string | number,
  seatsPerRow: number,
  startElevation: number,
  rakeAngle: number
): any[] => {
  const rows = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  
  if (typeof startRow === 'string') {
    const startCode = startRow.charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);
    
    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow,
        elevation: startElevation + (rowNum * rowHeight * Math.sin(rakeAngle * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: false
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: startElevation + (rowNum * rowHeight * Math.sin(rakeAngle * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: false
      });
    }
  }
  
  return rows;
};

export const saltLakeBeesSections: DetailedSection[] = [
  // ========== KEYBANK CLUB ==========
  {
    id: 'keybank-club',
    name: 'KeyBank Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 34,
    rows: generateRows('A', 'N', 43, 27, 30),
    vertices3D: [
      { x: -50, y: 27, z: 63 },
      { x: 50, y: 27, z: 63 },
      { x: 55, y: 61, z: 97 },
      { x: -55, y: 61, z: 97 }
    ],
    covered: true,
    distance: 63,
    height: 27,
    rake: 30,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD LEVEL BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 17,
    rows: generateRows('A', 'Q', 28, 3, 24),
    vertices3D: [
      { x: -21, y: 3, z: 50 },
      { x: 21, y: 3, z: 50 },
      { x: 26, y: 39, z: 86 },
      { x: -26, y: 39, z: 86 }
    ],
    covered: false,
    distance: 50,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 17,
    angleSpan: 22,
    rows: generateRows('A', 'Q', 29, 3, 24),
    vertices3D: [
      { x: 21, y: 3, z: 50 },
      { x: 44, y: 3, z: 61 },
      { x: 49, y: 39, z: 97 },
      { x: 26, y: 39, z: 86 }
    ],
    covered: false,
    distance: 55,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 343,
    angleSpan: 22,
    rows: generateRows('A', 'Q', 29, 3, 24),
    vertices3D: [
      { x: -44, y: 3, z: 61 },
      { x: -21, y: 3, z: 50 },
      { x: -26, y: 39, z: 86 },
      { x: -49, y: 39, z: 97 }
    ],
    covered: false,
    distance: 55,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 48,
    angleSpan: 27,
    rows: generateRows('A', 'Q', 30, 3, 24),
    vertices3D: [
      { x: 55, y: 3, z: 89 },
      { x: 91, y: 3, z: 125 },
      { x: 96, y: 39, z: 161 },
      { x: 60, y: 39, z: 125 }
    ],
    covered: false,
    distance: 107,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 312,
    angleSpan: 27,
    rows: generateRows('A', 'Q', 30, 3, 24),
    vertices3D: [
      { x: -91, y: 3, z: 125 },
      { x: -55, y: 3, z: 89 },
      { x: -60, y: 39, z: 125 },
      { x: -96, y: 39, z: 161 }
    ],
    covered: false,
    distance: 107,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 24,
    rows: generateRows(1, 30, 37, 11, 27),
    vertices3D: [
      { x: -37, y: 11, z: 73 },
      { x: 37, y: 11, z: 73 },
      { x: 42, y: 61, z: 123 },
      { x: -42, y: 61, z: 123 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['22', '23', '24', '25', '26', '27', '28', '29', '30'],
      coveragePercentage: 30
    },
    distance: 73,
    height: 11,
    rake: 27,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 54,
    angleSpan: 30,
    rows: generateRows(1, 30, 35, 11, 27),
    vertices3D: [
      { x: 78, y: 11, z: 134 },
      { x: 115, y: 11, z: 171 },
      { x: 120, y: 61, z: 221 },
      { x: 83, y: 61, z: 184 }
    ],
    covered: false,
    distance: 152,
    height: 11,
    rake: 27,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 306,
    angleSpan: 30,
    rows: generateRows(1, 30, 35, 11, 27),
    vertices3D: [
      { x: -115, y: 11, z: 171 },
      { x: -78, y: 11, z: 134 },
      { x: -83, y: 61, z: 184 },
      { x: -120, y: 61, z: 221 }
    ],
    covered: false,
    distance: 152,
    height: 11,
    rake: 27,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 64,
    rows: [
      { rowNumber: 'Suite', seats: 420, elevation: 38, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -84, y: 38, z: 94 },
      { x: 84, y: 38, z: 94 },
      { x: 89, y: 48, z: 104 },
      { x: -89, y: 48, z: 104 }
    ],
    covered: true,
    distance: 94,
    height: 38,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== WASATCH DECK ==========
  {
    id: 'wasatch-deck',
    name: 'Wasatch Deck',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 37,
    rows: generateRows(1, 12, 55, 40, 26),
    vertices3D: [
      { x: 118, y: 40, z: 381 },
      { x: 166, y: 40, z: 429 },
      { x: 171, y: 63, z: 452 },
      { x: 123, y: 63, z: 404 }
    ],
    covered: false,
    distance: 405,
    height: 40,
    rake: 26,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== HIVE ZONE ==========
  {
    id: 'hive-zone',
    name: 'Hive Zone',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 32,
    rows: [],
    vertices3D: [
      { x: 131, y: 18, z: 312 },
      { x: 171, y: 18, z: 352 },
      { x: 176, y: 24, z: 358 },
      { x: 136, y: 24, z: 318 }
    ],
    covered: true,
    distance: 332,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 258,
    angleSpan: 31,
    rows: generateRows(1, 24, 44, 8, 23),
    vertices3D: [
      { x: -143, y: 8, z: 298 },
      { x: -114, y: 8, z: 327 },
      { x: -119, y: 44, z: 363 },
      { x: -148, y: 44, z: 334 }
    ],
    covered: false,
    distance: 312,
    height: 8,
    rake: 23,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== APRICOT LANDING ==========
  {
    id: 'apricot-landing',
    name: 'Apricot Landing',
    level: 'field',
    baseAngle: 172,
    angleSpan: 42,
    rows: [],
    vertices3D: [
      { x: 152, y: 7, z: 418 },
      { x: 210, y: 7, z: 456 },
      { x: 215, y: 13, z: 466 },
      { x: 157, y: 13, z: 428 }
    ],
    covered: false,
    distance: 437,
    height: 7,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== STINGER SEATS ==========
  {
    id: 'stinger-seats',
    name: 'Stinger Seats',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 26,
    rows: [],
    vertices3D: [
      { x: -186, y: 17, z: 352 },
      { x: -158, y: 17, z: 380 },
      { x: -163, y: 23, z: 386 },
      { x: -191, y: 23, z: 358 }
    ],
    covered: false,
    distance: 366,
    height: 17,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== BERM SEATING ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 65,
    angleSpan: 29,
    rows: [],
    vertices3D: [
      { x: 181, y: 7, z: 332 },
      { x: 213, y: 7, z: 364 },
      { x: 218, y: 12, z: 374 },
      { x: 186, y: 12, z: 342 }
    ],
    covered: false,
    distance: 348,
    height: 7,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const saltLakeBeesConfig = {
  stadiumName: "Smith's Ballpark",
  team: 'Salt Lake Bees',
  parentOrg: 'Los Angeles Angels',
  city: 'Salt Lake City',
  state: 'UT',
  level: 'AAA',
  capacity: 15411,
  opened: 1994,
  orientation: 345,
  dimensions: {
    leftField: 345,
    leftCenter: 375,
    centerField: 420,
    rightCenter: 375,
    rightField: 315
  },
  features: {
    wasatchMountainView: true,
    highAltitude: true,
    keybankClub: true,
    wasatchDeck: true,
    hiveZone: true,
    apricotLanding: true,
    stingerSeats: true,
    berm: true,
    coveredSeating: 4300,
    elevation: 4452
  }
};
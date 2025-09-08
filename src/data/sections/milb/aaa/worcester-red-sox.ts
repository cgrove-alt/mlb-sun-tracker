// Polar Park - Worcester Red Sox (Boston Red Sox AAA)
// Opened: 2021
// Capacity: 9,508
// Known for Worcester skyline views and Canal District location

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

export const worcesterRedSoxSections: DetailedSection[] = [
  // ========== DCU CLUB ==========
  {
    id: 'dcu-club',
    name: 'DCU Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows('A', 'K', 35, 23, 26),
    vertices3D: [
      { x: -42, y: 23, z: 56 },
      { x: 42, y: 23, z: 56 },
      { x: 47, y: 49, z: 82 },
      { x: -47, y: 49, z: 82 }
    ],
    covered: true,
    distance: 56,
    height: 23,
    rake: 26,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows('A', 'M', 22, 4, 22),
    vertices3D: [
      { x: -22, y: 4, z: 45 },
      { x: 22, y: 4, z: 45 },
      { x: 27, y: 30, z: 71 },
      { x: -27, y: 30, z: 71 }
    ],
    covered: false,
    distance: 45,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 18,
    angleSpan: 19,
    rows: generateRows('A', 'M', 23, 4, 22),
    vertices3D: [
      { x: 22, y: 4, z: 45 },
      { x: 39, y: 4, z: 53 },
      { x: 44, y: 30, z: 79 },
      { x: 27, y: 30, z: 71 }
    ],
    covered: false,
    distance: 49,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 342,
    angleSpan: 19,
    rows: generateRows('A', 'M', 23, 4, 22),
    vertices3D: [
      { x: -39, y: 4, z: 53 },
      { x: -22, y: 4, z: 45 },
      { x: -27, y: 30, z: 71 },
      { x: -44, y: 30, z: 79 }
    ],
    covered: false,
    distance: 49,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 45,
    angleSpan: 24,
    rows: generateRows('A', 'M', 24, 4, 22),
    vertices3D: [
      { x: 48, y: 4, z: 77 },
      { x: 77, y: 4, z: 106 },
      { x: 82, y: 30, z: 132 },
      { x: 53, y: 30, z: 103 }
    ],
    covered: false,
    distance: 91,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 315,
    angleSpan: 24,
    rows: generateRows('A', 'M', 24, 4, 22),
    vertices3D: [
      { x: -77, y: 4, z: 106 },
      { x: -48, y: 4, z: 77 },
      { x: -53, y: 30, z: 103 },
      { x: -82, y: 30, z: 132 }
    ],
    covered: false,
    distance: 91,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 23,
    rows: generateRows(1, 22, 30, 11, 24),
    vertices3D: [
      { x: -31, y: 11, z: 63 },
      { x: 31, y: 11, z: 63 },
      { x: 36, y: 47, z: 99 },
      { x: -36, y: 47, z: 99 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22'],
      coveragePercentage: 41
    },
    distance: 63,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 50,
    angleSpan: 25,
    rows: generateRows(1, 22, 28, 11, 24),
    vertices3D: [
      { x: 66, y: 11, z: 114 },
      { x: 95, y: 11, z: 143 },
      { x: 100, y: 47, z: 179 },
      { x: 71, y: 47, z: 150 }
    ],
    covered: false,
    distance: 128,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 25,
    rows: generateRows(1, 22, 28, 11, 24),
    vertices3D: [
      { x: -95, y: 11, z: 143 },
      { x: -66, y: 11, z: 114 },
      { x: -71, y: 47, z: 150 },
      { x: -100, y: 47, z: 179 }
    ],
    covered: false,
    distance: 128,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 52,
    rows: [
      { rowNumber: 'Suite', seats: 300, elevation: 31, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -68, y: 31, z: 80 },
      { x: 68, y: 31, z: 80 },
      { x: 73, y: 41, z: 90 },
      { x: -73, y: 41, z: 90 }
    ],
    covered: true,
    distance: 80,
    height: 31,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== CANAL DISTRICT DECK ==========
  {
    id: 'canal-district-deck',
    name: 'Canal District Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 26,
    rows: [],
    vertices3D: [
      { x: 110, y: 14, z: 273 },
      { x: 142, y: 14, z: 305 },
      { x: 147, y: 20, z: 311 },
      { x: 115, y: 20, z: 279 }
    ],
    covered: true,
    distance: 289,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== SUMMIT LOUNGE ==========
  {
    id: 'summit-lounge',
    name: 'Summit Lounge',
    level: 'upper',
    baseAngle: 122,
    angleSpan: 30,
    rows: generateRows(1, 7, 43, 32, 22),
    vertices3D: [
      { x: 96, y: 32, z: 320 },
      { x: 132, y: 32, z: 356 },
      { x: 137, y: 46, z: 370 },
      { x: 101, y: 46, z: 334 }
    ],
    covered: false,
    distance: 338,
    height: 32,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 247,
    angleSpan: 25,
    rows: generateRows(1, 16, 34, 6, 20),
    vertices3D: [
      { x: -122, y: 6, z: 261 },
      { x: -98, y: 6, z: 285 },
      { x: -103, y: 28, z: 307 },
      { x: -127, y: 28, z: 283 }
    ],
    covered: false,
    distance: 273,
    height: 6,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== HEART OF THE ORDER WALL ==========
  {
    id: 'heart-of-order-wall',
    name: 'Heart of the Order Wall',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: -41, y: 16, z: 380 },
      { x: 41, y: 16, z: 380 },
      { x: 46, y: 22, z: 390 },
      { x: -46, y: 22, z: 390 }
    ],
    covered: false,
    distance: 380,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== GOOSE GOSSAGE DECK ==========
  {
    id: 'goose-gossage-deck',
    name: 'Goose Gossage Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: -158, y: 13, z: 302 },
      { x: -134, y: 13, z: 326 },
      { x: -139, y: 19, z: 332 },
      { x: -163, y: 19, z: 308 }
    ],
    covered: false,
    distance: 314,
    height: 13,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== RIGHT FIELD TERRACE ==========
  {
    id: 'right-field-terrace',
    name: 'Right Field Terrace',
    level: 'field',
    baseAngle: 57,
    angleSpan: 23,
    rows: generateRows(1, 11, 29, 7, 19),
    vertices3D: [
      { x: 147, y: 7, z: 275 },
      { x: 170, y: 7, z: 298 },
      { x: 175, y: 23, z: 314 },
      { x: 152, y: 23, z: 291 }
    ],
    covered: false,
    distance: 286,
    height: 7,
    rake: 19,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const worcesterRedSoxConfig = {
  stadiumName: 'Polar Park',
  team: 'Worcester Red Sox',
  parentOrg: 'Boston Red Sox',
  city: 'Worcester',
  state: 'MA',
  level: 'AAA',
  capacity: 9508,
  opened: 2021,
  orientation: 95,
  dimensions: {
    leftField: 320,
    leftCenter: 370,
    centerField: 400,
    rightCenter: 370,
    rightField: 330
  },
  features: {
    worcesterSkylineView: true,
    canalDistrictLocation: true,
    dcuClub: true,
    canalDistrictDeck: true,
    summitLounge: true,
    heartOfTheOrderWall: true,
    gooseGossageDeck: true,
    rightFieldTerrace: true,
    coveredSeating: 2800,
    newestAAAStadium: true
  }
};
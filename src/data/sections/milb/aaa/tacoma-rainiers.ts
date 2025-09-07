// Cheney Stadium - Tacoma Rainiers (Seattle Mariners AAA)
// Opened: 1960 (renovated 2011)
// Capacity: 6,500
// Known for Mount Rainier views and Puget Sound proximity

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

export const tacomaRainiersSections: DetailedSection[] = [
  // ========== CLUB LEVEL ==========
  {
    id: 'club-level',
    name: 'Club Level',
    level: 'club',
    baseAngle: 0,
    angleSpan: 26,
    rows: generateRows('A', 'J', 32, 21, 25),
    vertices3D: [
      { x: -39, y: 21, z: 53 },
      { x: 39, y: 21, z: 53 },
      { x: 44, y: 45, z: 77 },
      { x: -44, y: 45, z: 77 }
    ],
    covered: true,
    distance: 53,
    height: 21,
    rake: 25,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'K', 20, 4, 20),
    vertices3D: [
      { x: -24, y: 4, z: 43 },
      { x: 24, y: 4, z: 43 },
      { x: 29, y: 26, z: 65 },
      { x: -29, y: 26, z: 65 }
    ],
    covered: false,
    distance: 43,
    height: 4,
    rake: 20,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-105',
    name: 'Field Box 105',
    level: 'field',
    baseAngle: 20,
    angleSpan: 21,
    rows: generateRows('A', 'K', 21, 4, 20),
    vertices3D: [
      { x: 24, y: 4, z: 43 },
      { x: 42, y: 4, z: 51 },
      { x: 47, y: 26, z: 73 },
      { x: 29, y: 26, z: 65 }
    ],
    covered: false,
    distance: 47,
    height: 4,
    rake: 20,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 340,
    angleSpan: 21,
    rows: generateRows('A', 'K', 21, 4, 20),
    vertices3D: [
      { x: -42, y: 4, z: 51 },
      { x: -24, y: 4, z: 43 },
      { x: -29, y: 26, z: 65 },
      { x: -47, y: 26, z: 73 }
    ],
    covered: false,
    distance: 47,
    height: 4,
    rake: 20,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-111',
    name: 'Field Box 111',
    level: 'field',
    baseAngle: 48,
    angleSpan: 22,
    rows: generateRows('A', 'K', 22, 4, 20),
    vertices3D: [
      { x: 51, y: 4, z: 76 },
      { x: 77, y: 4, z: 102 },
      { x: 82, y: 26, z: 124 },
      { x: 56, y: 26, z: 98 }
    ],
    covered: false,
    distance: 89,
    height: 4,
    rake: 20,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-119',
    name: 'Field Box 119',
    level: 'field',
    baseAngle: 312,
    angleSpan: 22,
    rows: generateRows('A', 'K', 22, 4, 20),
    vertices3D: [
      { x: -77, y: 4, z: 102 },
      { x: -51, y: 4, z: 76 },
      { x: -56, y: 26, z: 98 },
      { x: -82, y: 26, z: 124 }
    ],
    covered: false,
    distance: 89,
    height: 4,
    rake: 20,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows(1, 18, 27, 13, 22),
    vertices3D: [
      { x: -29, y: 13, z: 59 },
      { x: 29, y: 13, z: 59 },
      { x: 34, y: 38, z: 84 },
      { x: -34, y: 38, z: 84 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['11', '12', '13', '14', '15', '16', '17', '18'],
      coveragePercentage: 44
    },
    distance: 59,
    height: 13,
    rake: 22,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-204',
    name: 'Reserved 204',
    level: 'lower',
    baseAngle: 53,
    angleSpan: 24,
    rows: generateRows(1, 18, 25, 13, 22),
    vertices3D: [
      { x: 61, y: 13, z: 106 },
      { x: 88, y: 13, z: 133 },
      { x: 93, y: 38, z: 158 },
      { x: 66, y: 38, z: 131 }
    ],
    covered: false,
    distance: 119,
    height: 13,
    rake: 22,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-212',
    name: 'Reserved 212',
    level: 'lower',
    baseAngle: 307,
    angleSpan: 24,
    rows: generateRows(1, 18, 25, 13, 22),
    vertices3D: [
      { x: -88, y: 13, z: 133 },
      { x: -61, y: 13, z: 106 },
      { x: -66, y: 38, z: 131 },
      { x: -93, y: 38, z: 158 }
    ],
    covered: false,
    distance: 119,
    height: 13,
    rake: 22,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 44,
    rows: [
      { rowNumber: 'Suite', seats: 220, elevation: 27, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -58, y: 27, z: 72 },
      { x: 58, y: 27, z: 72 },
      { x: 63, y: 37, z: 82 },
      { x: -63, y: 37, z: 82 }
    ],
    covered: true,
    distance: 72,
    height: 27,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== MOUNT RAINIER DECK ==========
  {
    id: 'mount-rainier-deck',
    name: 'Mount Rainier Deck',
    level: 'upper',
    baseAngle: 110,
    angleSpan: 27,
    rows: generateRows(1, 5, 38, 28, 20),
    vertices3D: [
      { x: 85, y: 28, z: 285 },
      { x: 116, y: 28, z: 316 },
      { x: 121, y: 38, z: 326 },
      { x: 90, y: 38, z: 295 }
    ],
    covered: false,
    distance: 300,
    height: 28,
    rake: 20,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== TIDES TAVERN ==========
  {
    id: 'tides-tavern',
    name: 'Tides Tavern',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 23,
    rows: [],
    vertices3D: [
      { x: 102, y: 11, z: 252 },
      { x: 129, y: 11, z: 279 },
      { x: 134, y: 17, z: 285 },
      { x: 107, y: 17, z: 258 }
    ],
    covered: true,
    distance: 265,
    height: 11,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD BERM ==========
  {
    id: 'left-field-berm',
    name: 'Left Field Berm',
    level: 'field',
    baseAngle: 240,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -110, y: 5, z: 243 },
      { x: -87, y: 5, z: 266 },
      { x: -92, y: 10, z: 276 },
      { x: -115, y: 10, z: 253 }
    ],
    covered: false,
    distance: 254,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== RHUBARB'S GRILL ==========
  {
    id: 'rhubarbs-grill',
    name: "Rhubarb's Grill",
    level: 'standing',
    baseAngle: 180,
    angleSpan: 26,
    rows: [],
    vertices3D: [
      { x: -38, y: 14, z: 352 },
      { x: 38, y: 14, z: 352 },
      { x: 43, y: 20, z: 362 },
      { x: -43, y: 20, z: 362 }
    ],
    covered: false,
    distance: 352,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PARTY ZONE ==========
  {
    id: 'party-zone',
    name: 'Party Zone',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 19,
    rows: [],
    vertices3D: [
      { x: -145, y: 10, z: 283 },
      { x: -124, y: 10, z: 304 },
      { x: -129, y: 16, z: 310 },
      { x: -150, y: 16, z: 289 }
    ],
    covered: false,
    distance: 293,
    height: 10,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== RIGHT FIELD PICNIC ==========
  {
    id: 'right-field-picnic',
    name: 'Right Field Picnic',
    level: 'field',
    baseAngle: 54,
    angleSpan: 21,
    rows: generateRows(1, 8, 25, 6, 17),
    vertices3D: [
      { x: 138, y: 6, z: 262 },
      { x: 159, y: 6, z: 283 },
      { x: 164, y: 18, z: 295 },
      { x: 143, y: 18, z: 274 }
    ],
    covered: false,
    distance: 272,
    height: 6,
    rake: 17,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const tacomaRainiersConfig = {
  stadiumName: 'Cheney Stadium',
  team: 'Tacoma Rainiers',
  parentOrg: 'Seattle Mariners',
  city: 'Tacoma',
  state: 'WA',
  level: 'AAA',
  capacity: 6500,
  opened: 1960,
  renovated: 2011,
  orientation: 350,
  dimensions: {
    leftField: 325,
    leftCenter: 365,
    centerField: 425,
    rightCenter: 365,
    rightField: 325
  },
  features: {
    mountRainierView: true,
    pugetSoundProximity: true,
    clubLevel: true,
    mountRainierDeck: true,
    tidesTavern: true,
    rhubarbsGrill: true,
    partyZone: true,
    leftFieldBerm: true,
    rightFieldPicnic: true,
    coveredSeating: 2200
  }
};
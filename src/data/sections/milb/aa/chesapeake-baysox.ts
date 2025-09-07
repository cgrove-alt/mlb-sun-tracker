// Prince George's Stadium - Chesapeake Baysox (Baltimore Orioles AA)
// Opened: 1994
// Capacity: 10,000
// Known for Chesapeake Bay region views and proximity to Washington DC

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

export const chesapeakeBaysoxSections: DetailedSection[] = [
  // ========== DIAMOND CLUB ==========
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 26,
    rows: generateRows('A', 'I', 31, 21, 24),
    vertices3D: [
      { x: -37, y: 21, z: 53 },
      { x: 37, y: 21, z: 53 },
      { x: 42, y: 42, z: 74 },
      { x: -42, y: 42, z: 74 }
    ],
    covered: true,
    distance: 53,
    height: 21,
    rake: 24,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 0,
    angleSpan: 19,
    rows: generateRows('A', 'L', 20, 4, 20),
    vertices3D: [
      { x: -23, y: 4, z: 43 },
      { x: 23, y: 4, z: 43 },
      { x: 28, y: 26, z: 65 },
      { x: -28, y: 26, z: 65 }
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
    baseAngle: 19,
    angleSpan: 21,
    rows: generateRows('A', 'L', 21, 4, 20),
    vertices3D: [
      { x: 23, y: 4, z: 43 },
      { x: 42, y: 4, z: 51 },
      { x: 47, y: 26, z: 73 },
      { x: 28, y: 26, z: 65 }
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
    baseAngle: 341,
    angleSpan: 21,
    rows: generateRows('A', 'L', 21, 4, 20),
    vertices3D: [
      { x: -42, y: 4, z: 51 },
      { x: -23, y: 4, z: 43 },
      { x: -28, y: 26, z: 65 },
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
    baseAngle: 49,
    angleSpan: 23,
    rows: generateRows('A', 'L', 22, 4, 20),
    vertices3D: [
      { x: 51, y: 4, z: 76 },
      { x: 78, y: 4, z: 103 },
      { x: 83, y: 26, z: 125 },
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
    baseAngle: 311,
    angleSpan: 23,
    rows: generateRows('A', 'L', 22, 4, 20),
    vertices3D: [
      { x: -78, y: 4, z: 103 },
      { x: -51, y: 4, z: 76 },
      { x: -56, y: 26, z: 98 },
      { x: -83, y: 26, z: 125 }
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
    id: 'reserved-201',
    name: 'Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows(1, 18, 28, 13, 22),
    vertices3D: [
      { x: -30, y: 13, z: 59 },
      { x: 30, y: 13, z: 59 },
      { x: 35, y: 37, z: 83 },
      { x: -35, y: 37, z: 83 }
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
    id: 'reserved-206',
    name: 'Reserved 206',
    level: 'lower',
    baseAngle: 54,
    angleSpan: 26,
    rows: generateRows(1, 18, 26, 13, 22),
    vertices3D: [
      { x: 63, y: 13, z: 108 },
      { x: 91, y: 13, z: 136 },
      { x: 96, y: 37, z: 160 },
      { x: 68, y: 37, z: 132 }
    ],
    covered: false,
    distance: 122,
    height: 13,
    rake: 22,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-214',
    name: 'Reserved 214',
    level: 'lower',
    baseAngle: 306,
    angleSpan: 26,
    rows: generateRows(1, 18, 26, 13, 22),
    vertices3D: [
      { x: -91, y: 13, z: 136 },
      { x: -63, y: 13, z: 108 },
      { x: -68, y: 37, z: 132 },
      { x: -96, y: 37, z: 160 }
    ],
    covered: false,
    distance: 122,
    height: 13,
    rake: 22,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== BAY DECK ==========
  {
    id: 'bay-deck',
    name: 'Bay Deck',
    level: 'upper',
    baseAngle: 100,
    angleSpan: 28,
    rows: generateRows(1, 6, 37, 27, 20),
    vertices3D: [
      { x: 82, y: 27, z: 275 },
      { x: 113, y: 27, z: 306 },
      { x: 118, y: 39, z: 318 },
      { x: 87, y: 39, z: 287 }
    ],
    covered: false,
    distance: 290,
    height: 27,
    rake: 20,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== ORIOLES NEST ==========
  {
    id: 'orioles-nest',
    name: 'Orioles Nest',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 23,
    rows: [],
    vertices3D: [
      { x: 98, y: 11, z: 245 },
      { x: 125, y: 11, z: 272 },
      { x: 130, y: 17, z: 278 },
      { x: 103, y: 17, z: 251 }
    ],
    covered: true,
    distance: 258,
    height: 11,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD LAWN ==========
  {
    id: 'left-field-lawn',
    name: 'Left Field Lawn',
    level: 'field',
    baseAngle: 238,
    angleSpan: 31,
    rows: [],
    vertices3D: [
      { x: -108, y: 5, z: 238 },
      { x: -83, y: 5, z: 263 },
      { x: -88, y: 10, z: 273 },
      { x: -113, y: 10, z: 248 }
    ],
    covered: false,
    distance: 250,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== CRAB SHACK ==========
  {
    id: 'crab-shack',
    name: 'Crab Shack',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: -36, y: 13, z: 338 },
      { x: 36, y: 13, z: 338 },
      { x: 41, y: 19, z: 348 },
      { x: -41, y: 19, z: 348 }
    ],
    covered: false,
    distance: 338,
    height: 13,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== KIDS ZONE ==========
  {
    id: 'kids-zone',
    name: 'Kids Zone',
    level: 'field',
    baseAngle: 53,
    angleSpan: 19,
    rows: generateRows(1, 6, 23, 7, 16),
    vertices3D: [
      { x: 128, y: 7, z: 253 },
      { x: 148, y: 7, z: 273 },
      { x: 153, y: 17, z: 283 },
      { x: 133, y: 17, z: 263 }
    ],
    covered: false,
    distance: 263,
    height: 7,
    rake: 16,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const chesapeakeBaysoxConfig = {
  stadiumName: "Prince George's Stadium",
  team: 'Chesapeake Baysox',
  parentOrg: 'Baltimore Orioles',
  city: 'Bowie',
  state: 'MD',
  level: 'AA',
  capacity: 10000,
  opened: 1994,
  orientation: 35,
  dimensions: {
    leftField: 309,
    leftCenter: 365,
    centerField: 405,
    rightCenter: 365,
    rightField: 309
  },
  features: {
    chesapeakeBayRegion: true,
    washingtonDCProximity: true,
    diamondClub: true,
    bayDeck: true,
    oriolesNest: true,
    crabShack: true,
    leftFieldLawn: true,
    kidsZone: true,
    coveredSeating: 2200
  }
};
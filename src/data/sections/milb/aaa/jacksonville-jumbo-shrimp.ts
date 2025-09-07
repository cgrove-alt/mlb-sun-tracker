// VyStar Ballpark - Jacksonville Jumbo Shrimp (Miami Marlins AAA)
// Opened: 2003
// Capacity: 11,000
// Known for downtown Jacksonville skyline and St. Johns River views

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

export const jacksonvilleJumboShrimpSections: DetailedSection[] = [
  // ========== HOME PLATE CLUB ==========
  {
    id: 'home-plate-club',
    name: 'Home Plate Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows('A', 'K', 38, 23, 26),
    vertices3D: [
      { x: -44, y: 23, z: 57 },
      { x: 44, y: 23, z: 57 },
      { x: 49, y: 49, z: 83 },
      { x: -49, y: 49, z: 83 }
    ],
    covered: true,
    distance: 57,
    height: 23,
    rake: 26,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD LEVEL BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 350,
    angleSpan: 20,
    rows: generateRows('A', 'O', 24, 3, 22),
    vertices3D: [
      { x: -26, y: 3, z: 47 },
      { x: -6, y: 3, z: 47 },
      { x: -1, y: 32, z: 76 },
      { x: -21, y: 32, z: 76 }
    ],
    covered: false,
    distance: 47,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 10,
    angleSpan: 20,
    rows: generateRows('A', 'O', 24, 3, 22),
    vertices3D: [
      { x: 6, y: 3, z: 47 },
      { x: 26, y: 3, z: 47 },
      { x: 21, y: 32, z: 76 },
      { x: 1, y: 32, z: 76 }
    ],
    covered: false,
    distance: 47,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 42,
    angleSpan: 24,
    rows: generateRows('A', 'O', 26, 3, 22),
    vertices3D: [
      { x: 48, y: 3, z: 78 },
      { x: 78, y: 3, z: 108 },
      { x: 83, y: 32, z: 137 },
      { x: 53, y: 32, z: 107 }
    ],
    covered: false,
    distance: 93,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-113',
    name: 'Field Box 113',
    level: 'field',
    baseAngle: 318,
    angleSpan: 24,
    rows: generateRows('A', 'O', 26, 3, 22),
    vertices3D: [
      { x: -78, y: 3, z: 108 },
      { x: -48, y: 3, z: 78 },
      { x: -53, y: 32, z: 107 },
      { x: -83, y: 32, z: 137 }
    ],
    covered: false,
    distance: 93,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== PLAZA RESERVED ==========
  {
    id: 'plaza-reserved-201',
    name: 'Plaza Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows(1, 26, 33, 10, 24),
    vertices3D: [
      { x: -33, y: 10, z: 65 },
      { x: 33, y: 10, z: 65 },
      { x: 38, y: 50, z: 105 },
      { x: -38, y: 50, z: 105 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['18', '19', '20', '21', '22', '23', '24', '25', '26'],
      coveragePercentage: 35
    },
    distance: 65,
    height: 10,
    rake: 24,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'plaza-reserved-207',
    name: 'Plaza Reserved 207',
    level: 'lower',
    baseAngle: 48,
    angleSpan: 26,
    rows: generateRows(1, 26, 31, 10, 24),
    vertices3D: [
      { x: 68, y: 10, z: 116 },
      { x: 98, y: 10, z: 146 },
      { x: 103, y: 50, z: 186 },
      { x: 73, y: 50, z: 156 }
    ],
    covered: false,
    distance: 131,
    height: 10,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'plaza-reserved-213',
    name: 'Plaza Reserved 213',
    level: 'lower',
    baseAngle: 312,
    angleSpan: 26,
    rows: generateRows(1, 26, 31, 10, 24),
    vertices3D: [
      { x: -98, y: 10, z: 146 },
      { x: -68, y: 10, z: 116 },
      { x: -73, y: 50, z: 156 },
      { x: -103, y: 50, z: 186 }
    ],
    covered: false,
    distance: 131,
    height: 10,
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
    angleSpan: 58,
    rows: [
      { rowNumber: 'Suite', seats: 340, elevation: 31, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -73, y: 31, z: 82 },
      { x: 73, y: 31, z: 82 },
      { x: 78, y: 41, z: 92 },
      { x: -78, y: 41, z: 92 }
    ],
    covered: true,
    distance: 82,
    height: 31,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== SEA WALK PAVILION ==========
  {
    id: 'sea-walk-pavilion',
    name: 'Sea Walk Pavilion',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows(1, 18, 42, 8, 20),
    vertices3D: [
      { x: 110, y: 8, z: 275 },
      { x: 145, y: 8, z: 310 },
      { x: 150, y: 32, z: 334 },
      { x: 115, y: 32, z: 299 }
    ],
    covered: false,
    distance: 292,
    height: 8,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== KING STREET DECK ==========
  {
    id: 'king-street-deck',
    name: 'King Street Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: -160, y: 14, z: 295 },
      { x: -130, y: 14, z: 325 },
      { x: -135, y: 20, z: 331 },
      { x: -165, y: 20, z: 301 }
    ],
    covered: true,
    distance: 310,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD BLEACHERS ==========
  {
    id: 'left-field-bleachers',
    name: 'Left Field Bleachers',
    level: 'field',
    baseAngle: 245,
    angleSpan: 22,
    rows: generateRows(1, 18, 36, 6, 20),
    vertices3D: [
      { x: -125, y: 6, z: 265 },
      { x: -105, y: 6, z: 285 },
      { x: -110, y: 30, z: 309 },
      { x: -130, y: 30, z: 289 }
    ],
    covered: false,
    distance: 275,
    height: 6,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== TIKI TERRACE ==========
  {
    id: 'tiki-terrace',
    name: 'Tiki Terrace',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 32,
    rows: generateRows(1, 10, 48, 33, 23),
    vertices3D: [
      { x: 100, y: 33, z: 330 },
      { x: 140, y: 33, z: 370 },
      { x: 145, y: 51, z: 388 },
      { x: 105, y: 51, z: 348 }
    ],
    covered: false,
    distance: 350,
    height: 33,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== LANDING LAWN ==========
  {
    id: 'landing-lawn',
    name: 'Landing Lawn',
    level: 'field',
    baseAngle: 180,
    angleSpan: 35,
    rows: [],
    vertices3D: [
      { x: -50, y: 4, z: 385 },
      { x: 50, y: 4, z: 385 },
      { x: 55, y: 9, z: 395 },
      { x: -55, y: 9, z: 395 }
    ],
    covered: false,
    distance: 385,
    height: 4,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== SHRIMP BASKET ==========
  {
    id: 'shrimp-basket',
    name: 'Shrimp Basket',
    level: 'standing',
    baseAngle: 60,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 145, y: 16, z: 345 },
      { x: 170, y: 16, z: 370 },
      { x: 175, y: 22, z: 376 },
      { x: 150, y: 22, z: 351 }
    ],
    covered: false,
    distance: 357,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  }
];

// Stadium configuration
export const jacksonvilleJumboShrimpConfig = {
  stadiumName: 'VyStar Ballpark',
  team: 'Jacksonville Jumbo Shrimp',
  parentOrg: 'Miami Marlins',
  city: 'Jacksonville',
  state: 'FL',
  level: 'AAA',
  capacity: 11000,
  opened: 2003,
  orientation: 350,
  dimensions: {
    leftField: 321,
    leftCenter: 379,
    centerField: 420,
    rightCenter: 379,
    rightField: 317
  },
  features: {
    downtownJacksonvilleView: true,
    stJohnsRiverView: true,
    homePlateClub: true,
    seaWalkPavilion: true,
    kingStreetDeck: true,
    tikiTerrace: true,
    landingLawn: true,
    shrimpBasket: true,
    coveredSeating: 3100
  }
};
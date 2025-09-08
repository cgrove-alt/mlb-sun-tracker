// CHS Field - St. Paul Saints (Minnesota Twins AAA)
// Opened: 2015
// Capacity: 7,210
// Known for downtown St. Paul skyline and sustainable design

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

export const stPaulSaintsSections: DetailedSection[] = [
  // ========== TREASURE ISLAND CLUB ==========
  {
    id: 'treasure-island-club',
    name: 'Treasure Island Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 27,
    rows: generateRows('A', 'J', 33, 22, 26),
    vertices3D: [
      { x: -40, y: 22, z: 54 },
      { x: 40, y: 22, z: 54 },
      { x: 45, y: 47, z: 79 },
      { x: -45, y: 47, z: 79 }
    ],
    covered: true,
    distance: 54,
    height: 22,
    rake: 26,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows('A', 'L', 21, 4, 21),
    vertices3D: [
      { x: -22, y: 4, z: 45 },
      { x: 22, y: 4, z: 45 },
      { x: 27, y: 28, z: 69 },
      { x: -27, y: 28, z: 69 }
    ],
    covered: false,
    distance: 45,
    height: 4,
    rake: 21,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-104',
    name: 'Field Box 104',
    level: 'field',
    baseAngle: 41,
    angleSpan: 23,
    rows: generateRows('A', 'L', 23, 4, 21),
    vertices3D: [
      { x: 46, y: 4, z: 75 },
      { x: 75, y: 4, z: 104 },
      { x: 80, y: 28, z: 128 },
      { x: 51, y: 28, z: 99 }
    ],
    covered: false,
    distance: 89,
    height: 4,
    rake: 21,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 319,
    angleSpan: 23,
    rows: generateRows('A', 'L', 23, 4, 21),
    vertices3D: [
      { x: -75, y: 4, z: 104 },
      { x: -46, y: 4, z: 75 },
      { x: -51, y: 28, z: 99 },
      { x: -80, y: 28, z: 128 }
    ],
    covered: false,
    distance: 89,
    height: 4,
    rake: 21,
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
    rows: generateRows(1, 20, 29, 12, 23),
    vertices3D: [
      { x: -31, y: 12, z: 62 },
      { x: 31, y: 12, z: 62 },
      { x: 36, y: 42, z: 92 },
      { x: -36, y: 42, z: 92 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['12', '13', '14', '15', '16', '17', '18', '19', '20'],
      coveragePercentage: 45
    },
    distance: 62,
    height: 12,
    rake: 23,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-205',
    name: 'Reserved 205',
    level: 'lower',
    baseAngle: 46,
    angleSpan: 26,
    rows: generateRows(1, 20, 27, 12, 23),
    vertices3D: [
      { x: 64, y: 12, z: 110 },
      { x: 94, y: 12, z: 140 },
      { x: 99, y: 42, z: 170 },
      { x: 69, y: 42, z: 140 }
    ],
    covered: false,
    distance: 125,
    height: 12,
    rake: 23,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-213',
    name: 'Reserved 213',
    level: 'lower',
    baseAngle: 314,
    angleSpan: 26,
    rows: generateRows(1, 20, 27, 12, 23),
    vertices3D: [
      { x: -94, y: 12, z: 140 },
      { x: -64, y: 12, z: 110 },
      { x: -69, y: 42, z: 140 },
      { x: -99, y: 42, z: 170 }
    ],
    covered: false,
    distance: 125,
    height: 12,
    rake: 23,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITES ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 48,
    rows: [
      { rowNumber: 'Suite', seats: 260, elevation: 29, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -65, y: 29, z: 77 },
      { x: 65, y: 29, z: 77 },
      { x: 70, y: 39, z: 87 },
      { x: -70, y: 39, z: 87 }
    ],
    covered: true,
    distance: 77,
    height: 29,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== GREEN SEATING TERRACE ==========
  {
    id: 'green-seating-terrace',
    name: 'Green Seating Terrace',
    level: 'upper',
    baseAngle: 120,
    angleSpan: 32,
    rows: generateRows(1, 8, 42, 31, 22),
    vertices3D: [
      { x: 95, y: 31, z: 315 },
      { x: 133, y: 31, z: 353 },
      { x: 138, y: 47, z: 369 },
      { x: 100, y: 47, z: 331 }
    ],
    covered: false,
    distance: 334,
    height: 31,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== SAINTS PUB ==========
  {
    id: 'saints-pub',
    name: 'Saints Pub',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: 108, y: 13, z: 268 },
      { x: 138, y: 13, z: 298 },
      { x: 143, y: 19, z: 304 },
      { x: 113, y: 19, z: 274 }
    ],
    covered: true,
    distance: 283,
    height: 13,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD BERM ==========
  {
    id: 'left-field-berm',
    name: 'Left Field Berm',
    level: 'field',
    baseAngle: 245,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -120, y: 4, z: 258 },
      { x: -95, y: 4, z: 283 },
      { x: -100, y: 9, z: 293 },
      { x: -125, y: 9, z: 268 }
    ],
    covered: false,
    distance: 270,
    height: 4,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== LOWERTOWN LANDING ==========
  {
    id: 'lowertown-landing',
    name: 'Lowertown Landing',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: -41, y: 16, z: 375 },
      { x: 41, y: 16, z: 375 },
      { x: 46, y: 22, z: 385 },
      { x: -46, y: 22, z: 385 }
    ],
    covered: false,
    distance: 375,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== MAUER'S CORNER ==========
  {
    id: 'mauers-corner',
    name: "Mauer's Corner",
    level: 'standing',
    baseAngle: 270,
    angleSpan: 21,
    rows: [],
    vertices3D: [
      { x: -155, y: 12, z: 298 },
      { x: -132, y: 12, z: 321 },
      { x: -137, y: 18, z: 327 },
      { x: -160, y: 18, z: 304 }
    ],
    covered: false,
    distance: 309,
    height: 12,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== FAMILY FUN ZONE ==========
  {
    id: 'family-fun-zone',
    name: 'Family Fun Zone',
    level: 'field',
    baseAngle: 55,
    angleSpan: 24,
    rows: generateRows(1, 12, 30, 6, 19),
    vertices3D: [
      { x: 145, y: 6, z: 272 },
      { x: 168, y: 6, z: 295 },
      { x: 173, y: 24, z: 313 },
      { x: 150, y: 24, z: 290 }
    ],
    covered: false,
    distance: 283,
    height: 6,
    rake: 19,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== SUSTAINABLE DECK ==========
  {
    id: 'sustainable-deck',
    name: 'Sustainable Deck',
    level: 'standing',
    baseAngle: 30,
    angleSpan: 18,
    rows: [],
    vertices3D: [
      { x: 138, y: 14, z: 338 },
      { x: 158, y: 14, z: 358 },
      { x: 163, y: 20, z: 364 },
      { x: 143, y: 20, z: 344 }
    ],
    covered: false,
    distance: 348,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  }
];

// Stadium configuration
export const stPaulSaintsConfig = {
  stadiumName: 'CHS Field',
  team: 'St. Paul Saints',
  parentOrg: 'Minnesota Twins',
  city: 'St. Paul',
  state: 'MN',
  level: 'AAA',
  capacity: 7210,
  opened: 2015,
  orientation: 180,
  dimensions: {
    leftField: 320,
    leftCenter: 365,
    centerField: 405,
    rightCenter: 365,
    rightField: 320
  },
  features: {
    downtownStPaulSkyline: true,
    sustainableDesign: true,
    treasureIslandClub: true,
    greenSeatingTerrace: true,
    saintsPub: true,
    lowertownLanding: true,
    mauersCorner: true,
    familyFunZone: true,
    sustainableDeck: true,
    leftFieldBerm: true,
    coveredSeating: 2400,
    leedCertified: true
  }
};
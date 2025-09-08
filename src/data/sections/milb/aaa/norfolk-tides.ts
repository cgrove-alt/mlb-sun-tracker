// Harbor Park - Norfolk Tides (Baltimore Orioles AAA)
// Opened: 1993
// Capacity: 12,067
// Known for Elizabeth River views and downtown Norfolk skyline

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

export const norfolkTidesSections: DetailedSection[] = [
  // ========== HARBOR CLUB ==========
  {
    id: 'harbor-club',
    name: 'Harbor Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 33,
    rows: generateRows('A', 'M', 41, 25, 28),
    vertices3D: [
      { x: -48, y: 25, z: 60 },
      { x: 48, y: 25, z: 60 },
      { x: 53, y: 55, z: 90 },
      { x: -53, y: 55, z: 90 }
    ],
    covered: true,
    distance: 60,
    height: 25,
    rake: 28,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 16,
    rows: generateRows('A', 'P', 24, 3, 23),
    vertices3D: [
      { x: -20, y: 3, z: 47 },
      { x: 20, y: 3, z: 47 },
      { x: 25, y: 35, z: 79 },
      { x: -25, y: 35, z: 79 }
    ],
    covered: false,
    distance: 47,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 16,
    angleSpan: 20,
    rows: generateRows('A', 'P', 25, 3, 23),
    vertices3D: [
      { x: 20, y: 3, z: 47 },
      { x: 40, y: 3, z: 55 },
      { x: 45, y: 35, z: 87 },
      { x: 25, y: 35, z: 79 }
    ],
    covered: false,
    distance: 51,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 344,
    angleSpan: 20,
    rows: generateRows('A', 'P', 25, 3, 23),
    vertices3D: [
      { x: -40, y: 3, z: 55 },
      { x: -20, y: 3, z: 47 },
      { x: -25, y: 35, z: 79 },
      { x: -45, y: 35, z: 87 }
    ],
    covered: false,
    distance: 51,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 45,
    angleSpan: 25,
    rows: generateRows('A', 'P', 27, 3, 23),
    vertices3D: [
      { x: 51, y: 3, z: 82 },
      { x: 84, y: 3, z: 115 },
      { x: 89, y: 35, z: 147 },
      { x: 56, y: 35, z: 114 }
    ],
    covered: false,
    distance: 98,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 315,
    angleSpan: 25,
    rows: generateRows('A', 'P', 27, 3, 23),
    vertices3D: [
      { x: -84, y: 3, z: 115 },
      { x: -51, y: 3, z: 82 },
      { x: -56, y: 35, z: 114 },
      { x: -89, y: 35, z: 147 }
    ],
    covered: false,
    distance: 98,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== LOWER RESERVED ==========
  {
    id: 'lower-reserved-200',
    name: 'Lower Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 23,
    rows: generateRows(1, 27, 34, 11, 25),
    vertices3D: [
      { x: -35, y: 11, z: 68 },
      { x: 35, y: 11, z: 68 },
      { x: 40, y: 55, z: 112 },
      { x: -40, y: 55, z: 112 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 33
    },
    distance: 68,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'lower-reserved-208',
    name: 'Lower Reserved 208',
    level: 'lower',
    baseAngle: 51,
    angleSpan: 27,
    rows: generateRows(1, 27, 32, 11, 25),
    vertices3D: [
      { x: 71, y: 11, z: 122 },
      { x: 104, y: 11, z: 155 },
      { x: 109, y: 55, z: 199 },
      { x: 76, y: 55, z: 166 }
    ],
    covered: false,
    distance: 138,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'lower-reserved-216',
    name: 'Lower Reserved 216',
    level: 'lower',
    baseAngle: 309,
    angleSpan: 27,
    rows: generateRows(1, 27, 32, 11, 25),
    vertices3D: [
      { x: -104, y: 11, z: 155 },
      { x: -71, y: 11, z: 122 },
      { x: -76, y: 55, z: 166 },
      { x: -109, y: 55, z: 199 }
    ],
    covered: false,
    distance: 138,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 59,
    rows: [
      { rowNumber: 'Suite', seats: 360, elevation: 34, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -76, y: 34, z: 86 },
      { x: 76, y: 34, z: 86 },
      { x: 81, y: 44, z: 96 },
      { x: -81, y: 44, z: 96 }
    ],
    covered: true,
    distance: 86,
    height: 34,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== PICNIC AREA ==========
  {
    id: 'picnic-area',
    name: 'Picnic Area',
    level: 'field',
    baseAngle: 90,
    angleSpan: 29,
    rows: [],
    vertices3D: [
      { x: 120, y: 8, z: 287 },
      { x: 155, y: 8, z: 322 },
      { x: 160, y: 14, z: 328 },
      { x: 125, y: 14, z: 293 }
    ],
    covered: false,
    distance: 304,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 252,
    angleSpan: 27,
    rows: generateRows(1, 19, 38, 6, 21),
    vertices3D: [
      { x: -129, y: 6, z: 271 },
      { x: -104, y: 6, z: 296 },
      { x: -109, y: 34, z: 324 },
      { x: -134, y: 34, z: 299 }
    ],
    covered: false,
    distance: 283,
    height: 6,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== ELIZABETH RIVER DECK ==========
  {
    id: 'elizabeth-river-deck',
    name: 'Elizabeth River Deck',
    level: 'upper',
    baseAngle: 128,
    angleSpan: 34,
    rows: generateRows(1, 9, 50, 36, 24),
    vertices3D: [
      { x: 103, y: 36, z: 336 },
      { x: 146, y: 36, z: 379 },
      { x: 151, y: 53, z: 396 },
      { x: 108, y: 53, z: 353 }
    ],
    covered: false,
    distance: 357,
    height: 36,
    rake: 24,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== HITS AT THE PARK ==========
  {
    id: 'hits-at-the-park',
    name: 'Hits at the Park',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 31,
    rows: [],
    vertices3D: [
      { x: -46, y: 19, z: 400 },
      { x: 46, y: 19, z: 400 },
      { x: 51, y: 25, z: 410 },
      { x: -51, y: 25, z: 410 }
    ],
    covered: false,
    distance: 400,
    height: 19,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PARTY DECK ==========
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 23,
    rows: [],
    vertices3D: [
      { x: -168, y: 16, z: 318 },
      { x: -143, y: 16, z: 343 },
      { x: -148, y: 22, z: 349 },
      { x: -173, y: 22, z: 324 }
    ],
    covered: true,
    distance: 330,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== BERM ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 60,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 160, y: 5, z: 290 },
      { x: 185, y: 5, z: 315 },
      { x: 190, y: 10, z: 325 },
      { x: 165, y: 10, z: 300 }
    ],
    covered: false,
    distance: 302,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const norfolkTidesConfig = {
  stadiumName: 'Harbor Park',
  team: 'Norfolk Tides',
  parentOrg: 'Baltimore Orioles',
  city: 'Norfolk',
  state: 'VA',
  level: 'AAA',
  capacity: 12067,
  opened: 1993,
  orientation: 325,
  dimensions: {
    leftField: 333,
    leftCenter: 378,
    centerField: 410,
    rightCenter: 379,
    rightField: 318
  },
  features: {
    elizabethRiverView: true,
    downtownNorfolkSkyline: true,
    harborClub: true,
    elizabethRiverDeck: true,
    hitsAtThePark: true,
    partyDeck: true,
    picnicArea: true,
    berm: true,
    coveredSeating: 3500,
    waterfrontLocation: true
  }
};
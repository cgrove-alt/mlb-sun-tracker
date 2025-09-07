// Innovative Field - Rochester Red Wings (Washington Nationals AAA)
// Opened: 1997
// Capacity: 10,840
// Known for downtown Rochester skyline views and Kodak Tower proximity

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

export const rochesterRedWingsSections: DetailedSection[] = [
  // ========== FRONTIER FIELD CLUB ==========
  {
    id: 'frontier-field-club',
    name: 'Frontier Field Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'L', 38, 24, 27),
    vertices3D: [
      { x: -45, y: 24, z: 58 },
      { x: 45, y: 24, z: 58 },
      { x: 50, y: 52, z: 86 },
      { x: -50, y: 52, z: 86 }
    ],
    covered: true,
    distance: 58,
    height: 24,
    rake: 27,
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
    rows: generateRows('A', 'O', 24, 3, 23),
    vertices3D: [
      { x: -21, y: 3, z: 47 },
      { x: 21, y: 3, z: 47 },
      { x: 26, y: 34, z: 78 },
      { x: -26, y: 34, z: 78 }
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
    baseAngle: 17,
    angleSpan: 19,
    rows: generateRows('A', 'O', 25, 3, 23),
    vertices3D: [
      { x: 21, y: 3, z: 47 },
      { x: 40, y: 3, z: 56 },
      { x: 45, y: 34, z: 87 },
      { x: 26, y: 34, z: 78 }
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
    baseAngle: 343,
    angleSpan: 19,
    rows: generateRows('A', 'O', 25, 3, 23),
    vertices3D: [
      { x: -40, y: 3, z: 56 },
      { x: -21, y: 3, z: 47 },
      { x: -26, y: 34, z: 78 },
      { x: -45, y: 34, z: 87 }
    ],
    covered: false,
    distance: 51,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 44,
    angleSpan: 25,
    rows: generateRows('A', 'O', 26, 3, 23),
    vertices3D: [
      { x: 50, y: 3, z: 81 },
      { x: 82, y: 3, z: 113 },
      { x: 87, y: 34, z: 144 },
      { x: 55, y: 34, z: 112 }
    ],
    covered: false,
    distance: 97,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 316,
    angleSpan: 25,
    rows: generateRows('A', 'O', 26, 3, 23),
    vertices3D: [
      { x: -82, y: 3, z: 113 },
      { x: -50, y: 3, z: 81 },
      { x: -55, y: 34, z: 112 },
      { x: -87, y: 34, z: 144 }
    ],
    covered: false,
    distance: 97,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows(1, 25, 32, 10, 25),
    vertices3D: [
      { x: -33, y: 10, z: 66 },
      { x: 33, y: 10, z: 66 },
      { x: 38, y: 52, z: 108 },
      { x: -38, y: 52, z: 108 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['17', '18', '19', '20', '21', '22', '23', '24', '25'],
      coveragePercentage: 36
    },
    distance: 66,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-207',
    name: 'Reserved 207',
    level: 'lower',
    baseAngle: 49,
    angleSpan: 26,
    rows: generateRows(1, 25, 30, 10, 25),
    vertices3D: [
      { x: 69, y: 10, z: 119 },
      { x: 100, y: 10, z: 150 },
      { x: 105, y: 52, z: 192 },
      { x: 74, y: 52, z: 161 }
    ],
    covered: false,
    distance: 134,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-215',
    name: 'Reserved 215',
    level: 'lower',
    baseAngle: 311,
    angleSpan: 26,
    rows: generateRows(1, 25, 30, 10, 25),
    vertices3D: [
      { x: -100, y: 10, z: 150 },
      { x: -69, y: 10, z: 119 },
      { x: -74, y: 52, z: 161 },
      { x: -105, y: 52, z: 192 }
    ],
    covered: false,
    distance: 134,
    height: 10,
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
    angleSpan: 56,
    rows: [
      { rowNumber: 'Suite', seats: 340, elevation: 32, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -73, y: 32, z: 84 },
      { x: 73, y: 32, z: 84 },
      { x: 78, y: 42, z: 94 },
      { x: -78, y: 42, z: 94 }
    ],
    covered: true,
    distance: 84,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== WINGS NEST ==========
  {
    id: 'wings-nest',
    name: 'Wings Nest',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 116, y: 15, z: 283 },
      { x: 150, y: 15, z: 317 },
      { x: 155, y: 21, z: 323 },
      { x: 121, y: 21, z: 289 }
    ],
    covered: true,
    distance: 300,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 249,
    angleSpan: 26,
    rows: generateRows(1, 18, 36, 7, 21),
    vertices3D: [
      { x: -127, y: 7, z: 268 },
      { x: -102, y: 7, z: 293 },
      { x: -107, y: 33, z: 319 },
      { x: -132, y: 33, z: 294 }
    ],
    covered: false,
    distance: 280,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== KODAK TOWER VIEW DECK ==========
  {
    id: 'kodak-tower-deck',
    name: 'Kodak Tower View Deck',
    level: 'upper',
    baseAngle: 127,
    angleSpan: 32,
    rows: generateRows(1, 8, 46, 34, 23),
    vertices3D: [
      { x: 101, y: 34, z: 333 },
      { x: 141, y: 34, z: 373 },
      { x: 146, y: 50, z: 389 },
      { x: 106, y: 50, z: 349 }
    ],
    covered: false,
    distance: 353,
    height: 34,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== LAWN SEATING ==========
  {
    id: 'lawn',
    name: 'Lawn',
    level: 'field',
    baseAngle: 162,
    angleSpan: 37,
    rows: [],
    vertices3D: [
      { x: 122, y: 5, z: 365 },
      { x: 172, y: 5, z: 395 },
      { x: 177, y: 10, z: 405 },
      { x: 127, y: 10, z: 375 }
    ],
    covered: false,
    distance: 380,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY DECK ==========
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: -163, y: 15, z: 313 },
      { x: -138, y: 15, z: 338 },
      { x: -143, y: 21, z: 344 },
      { x: -168, y: 21, z: 319 }
    ],
    covered: false,
    distance: 325,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== CORPORATE PICNIC AREA ==========
  {
    id: 'corporate-picnic',
    name: 'Corporate Picnic Area',
    level: 'field',
    baseAngle: 60,
    angleSpan: 24,
    rows: [],
    vertices3D: [
      { x: 155, y: 8, z: 285 },
      { x: 180, y: 8, z: 310 },
      { x: 185, y: 14, z: 316 },
      { x: 160, y: 14, z: 291 }
    ],
    covered: false,
    distance: 297,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  }
];

// Stadium configuration
export const rochesterRedWingsConfig = {
  stadiumName: 'Innovative Field',
  team: 'Rochester Red Wings',
  parentOrg: 'Washington Nationals',
  city: 'Rochester',
  state: 'NY',
  level: 'AAA',
  capacity: 10840,
  opened: 1997,
  orientation: 315,
  dimensions: {
    leftField: 320,
    leftCenter: 370,
    centerField: 402,
    rightCenter: 370,
    rightField: 315
  },
  features: {
    downtownRochesterView: true,
    kodakTowerProximity: true,
    frontierFieldClub: true,
    wingsNest: true,
    kodakTowerViewDeck: true,
    lawn: true,
    partyDeck: true,
    corporatePicnicArea: true,
    coveredSeating: 3300
  }
};
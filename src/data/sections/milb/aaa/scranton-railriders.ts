// PNC Field - Scranton/Wilkes-Barre RailRiders (New York Yankees AAA)
// Opened: 1989 (renovated 2013)
// Capacity: 10,000
// Known for Pocono Mountains backdrop and Yankees heritage

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

export const scrantonRailRidersSections: DetailedSection[] = [
  // ========== PINSTRIPE CLUB ==========
  {
    id: 'pinstripe-club',
    name: 'Pinstripe Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 29,
    rows: generateRows('A', 'K', 36, 24, 27),
    vertices3D: [
      { x: -44, y: 24, z: 57 },
      { x: 44, y: 24, z: 57 },
      { x: 49, y: 51, z: 84 },
      { x: -49, y: 51, z: 84 }
    ],
    covered: true,
    distance: 57,
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
    angleSpan: 16,
    rows: generateRows('A', 'N', 23, 4, 22),
    vertices3D: [
      { x: -20, y: 4, z: 46 },
      { x: 20, y: 4, z: 46 },
      { x: 25, y: 32, z: 74 },
      { x: -25, y: 32, z: 74 }
    ],
    covered: false,
    distance: 46,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 16,
    angleSpan: 20,
    rows: generateRows('A', 'N', 24, 4, 22),
    vertices3D: [
      { x: 20, y: 4, z: 46 },
      { x: 39, y: 4, z: 54 },
      { x: 44, y: 32, z: 82 },
      { x: 25, y: 32, z: 74 }
    ],
    covered: false,
    distance: 50,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 344,
    angleSpan: 20,
    rows: generateRows('A', 'N', 24, 4, 22),
    vertices3D: [
      { x: -39, y: 4, z: 54 },
      { x: -20, y: 4, z: 46 },
      { x: -25, y: 32, z: 74 },
      { x: -44, y: 32, z: 82 }
    ],
    covered: false,
    distance: 50,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 43,
    angleSpan: 24,
    rows: generateRows('A', 'N', 25, 4, 22),
    vertices3D: [
      { x: 49, y: 4, z: 79 },
      { x: 79, y: 4, z: 109 },
      { x: 84, y: 32, z: 137 },
      { x: 54, y: 32, z: 107 }
    ],
    covered: false,
    distance: 94,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 317,
    angleSpan: 24,
    rows: generateRows('A', 'N', 25, 4, 22),
    vertices3D: [
      { x: -79, y: 4, z: 109 },
      { x: -49, y: 4, z: 79 },
      { x: -54, y: 32, z: 107 },
      { x: -84, y: 32, z: 137 }
    ],
    covered: false,
    distance: 94,
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
    angleSpan: 21,
    rows: generateRows(1, 24, 31, 11, 24),
    vertices3D: [
      { x: -32, y: 11, z: 65 },
      { x: 32, y: 11, z: 65 },
      { x: 37, y: 49, z: 103 },
      { x: -37, y: 49, z: 103 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      coveragePercentage: 42
    },
    distance: 65,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-206',
    name: 'Reserved 206',
    level: 'lower',
    baseAngle: 48,
    angleSpan: 25,
    rows: generateRows(1, 24, 29, 11, 24),
    vertices3D: [
      { x: 67, y: 11, z: 116 },
      { x: 97, y: 11, z: 146 },
      { x: 102, y: 49, z: 184 },
      { x: 72, y: 49, z: 154 }
    ],
    covered: false,
    distance: 131,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-214',
    name: 'Reserved 214',
    level: 'lower',
    baseAngle: 312,
    angleSpan: 25,
    rows: generateRows(1, 24, 29, 11, 24),
    vertices3D: [
      { x: -97, y: 11, z: 146 },
      { x: -67, y: 11, z: 116 },
      { x: -72, y: 49, z: 154 },
      { x: -102, y: 49, z: 184 }
    ],
    covered: false,
    distance: 131,
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
    angleSpan: 54,
    rows: [
      { rowNumber: 'Suite', seats: 320, elevation: 32, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -71, y: 32, z: 82 },
      { x: 71, y: 32, z: 82 },
      { x: 76, y: 42, z: 92 },
      { x: -76, y: 42, z: 92 }
    ],
    covered: true,
    distance: 82,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== MOHEGAN SUN TERRACE ==========
  {
    id: 'mohegan-sun-terrace',
    name: 'Mohegan Sun Terrace',
    level: 'upper',
    baseAngle: 125,
    angleSpan: 31,
    rows: generateRows(1, 9, 45, 34, 23),
    vertices3D: [
      { x: 99, y: 34, z: 329 },
      { x: 138, y: 34, z: 368 },
      { x: 143, y: 51, z: 385 },
      { x: 104, y: 51, z: 346 }
    ],
    covered: false,
    distance: 348,
    height: 34,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== RAIL RIDERS ALLEY ==========
  {
    id: 'rail-riders-alley',
    name: 'Rail Riders Alley',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: 114, y: 15, z: 280 },
      { x: 147, y: 15, z: 313 },
      { x: 152, y: 21, z: 319 },
      { x: 119, y: 21, z: 286 }
    ],
    covered: true,
    distance: 296,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD LAWN ==========
  {
    id: 'left-field-lawn',
    name: 'Left Field Lawn',
    level: 'field',
    baseAngle: 250,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: -128, y: 5, z: 270 },
      { x: -103, y: 5, z: 295 },
      { x: -108, y: 10, z: 305 },
      { x: -133, y: 10, z: 280 }
    ],
    covered: false,
    distance: 282,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== YANKEES HERITAGE DECK ==========
  {
    id: 'yankees-heritage-deck',
    name: 'Yankees Heritage Deck',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 29,
    rows: [],
    vertices3D: [
      { x: -44, y: 18, z: 392 },
      { x: 44, y: 18, z: 392 },
      { x: 49, y: 24, z: 402 },
      { x: -49, y: 24, z: 402 }
    ],
    covered: false,
    distance: 392,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== POCONO PARTY PAVILION ==========
  {
    id: 'pocono-party-pavilion',
    name: 'Pocono Party Pavilion',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 23,
    rows: [],
    vertices3D: [
      { x: -165, y: 14, z: 310 },
      { x: -140, y: 14, z: 335 },
      { x: -145, y: 20, z: 341 },
      { x: -170, y: 20, z: 316 }
    ],
    covered: false,
    distance: 322,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== PICNIC PATIO ==========
  {
    id: 'picnic-patio',
    name: 'Picnic Patio',
    level: 'field',
    baseAngle: 60,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: 153, y: 7, z: 283 },
      { x: 178, y: 7, z: 308 },
      { x: 183, y: 13, z: 314 },
      { x: 158, y: 13, z: 289 }
    ],
    covered: false,
    distance: 295,
    height: 7,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const scrantonRailRidersConfig = {
  stadiumName: 'PNC Field',
  team: 'Scranton/Wilkes-Barre RailRiders',
  parentOrg: 'New York Yankees',
  city: 'Moosic',
  state: 'PA',
  level: 'AAA',
  capacity: 10000,
  opened: 1989,
  renovated: 2013,
  orientation: 20,
  dimensions: {
    leftField: 330,
    leftCenter: 371,
    centerField: 408,
    rightCenter: 371,
    rightField: 330
  },
  features: {
    poconoMountainsBackdrop: true,
    yankeesHeritage: true,
    pinstripeClub: true,
    moheganSunTerrace: true,
    railRidersAlley: true,
    yankeesHeritageDeck: true,
    poconoPartyPavilion: true,
    leftFieldLawn: true,
    picnicPatio: true,
    coveredSeating: 3100
  }
};
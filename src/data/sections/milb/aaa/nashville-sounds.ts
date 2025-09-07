// First Horizon Park - Nashville Sounds (Milwaukee Brewers AAA)
// Opened: 2015
// Capacity: 10,000
// Known for Nashville skyline views and guitar-shaped scoreboard

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

export const nashvilleSoundsSections: DetailedSection[] = [
  // ========== CLUB LEVEL ==========
  {
    id: 'club-level',
    name: 'Club Level',
    level: 'club',
    baseAngle: 0,
    angleSpan: 31,
    rows: generateRows('A', 'L', 39, 24, 27),
    vertices3D: [
      { x: -46, y: 24, z: 58 },
      { x: 46, y: 24, z: 58 },
      { x: 51, y: 53, z: 87 },
      { x: -51, y: 53, z: 87 }
    ],
    covered: true,
    distance: 58,
    height: 24,
    rake: 27,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== NASHVILLE DUGOUT SUITES ==========
  {
    id: 'dugout-suite-first',
    name: 'First Base Dugout Suite',
    level: 'field',
    baseAngle: 25,
    angleSpan: 18,
    rows: generateRows('A', 'F', 22, 1, 20),
    vertices3D: [
      { x: 20, y: 1, z: 44 },
      { x: 38, y: 1, z: 44 },
      { x: 33, y: 14, z: 57 },
      { x: 15, y: 14, z: 57 }
    ],
    covered: false,
    distance: 44,
    height: 1,
    rake: 20,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  {
    id: 'dugout-suite-third',
    name: 'Third Base Dugout Suite',
    level: 'field',
    baseAngle: 335,
    angleSpan: 18,
    rows: generateRows('A', 'F', 22, 1, 20),
    vertices3D: [
      { x: -38, y: 1, z: 44 },
      { x: -20, y: 1, z: 44 },
      { x: -15, y: 14, z: 57 },
      { x: -33, y: 14, z: 57 }
    ],
    covered: false,
    distance: 44,
    height: 1,
    rake: 20,
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
    rows: generateRows('A', 'N', 23, 4, 22),
    vertices3D: [
      { x: -21, y: 4, z: 47 },
      { x: 21, y: 4, z: 47 },
      { x: 26, y: 32, z: 75 },
      { x: -26, y: 32, z: 75 }
    ],
    covered: false,
    distance: 47,
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
    angleSpan: 23,
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
    angleSpan: 23,
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
    rows: generateRows(1, 24, 31, 12, 24),
    vertices3D: [
      { x: -32, y: 12, z: 66 },
      { x: 32, y: 12, z: 66 },
      { x: 37, y: 48, z: 102 },
      { x: -37, y: 48, z: 102 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      coveragePercentage: 42
    },
    distance: 66,
    height: 12,
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
    rows: generateRows(1, 24, 29, 12, 24),
    vertices3D: [
      { x: 68, y: 12, z: 117 },
      { x: 98, y: 12, z: 147 },
      { x: 103, y: 48, z: 183 },
      { x: 73, y: 48, z: 153 }
    ],
    covered: false,
    distance: 132,
    height: 12,
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
    rows: generateRows(1, 24, 29, 12, 24),
    vertices3D: [
      { x: -98, y: 12, z: 147 },
      { x: -68, y: 12, z: 117 },
      { x: -73, y: 48, z: 153 },
      { x: -103, y: 48, z: 183 }
    ],
    covered: false,
    distance: 132,
    height: 12,
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
      { x: -72, y: 32, z: 83 },
      { x: 72, y: 32, z: 83 },
      { x: 77, y: 42, z: 93 },
      { x: -77, y: 42, z: 93 }
    ],
    covered: true,
    distance: 83,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== THE BAND BOX ==========
  {
    id: 'band-box',
    name: 'The Band Box',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 118, y: 15, z: 282 },
      { x: 152, y: 15, z: 316 },
      { x: 157, y: 21, z: 322 },
      { x: 123, y: 21, z: 288 }
    ],
    covered: true,
    distance: 299,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PORCH ==========
  {
    id: 'left-field-porch',
    name: 'Left Field Porch',
    level: 'field',
    baseAngle: 248,
    angleSpan: 26,
    rows: generateRows(1, 17, 36, 7, 20),
    vertices3D: [
      { x: -126, y: 7, z: 266 },
      { x: -102, y: 7, z: 290 },
      { x: -107, y: 31, z: 314 },
      { x: -131, y: 31, z: 290 }
    ],
    covered: false,
    distance: 278,
    height: 7,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== FIRST TENNESSEE PARK PAVILION ==========
  {
    id: 'first-tennessee-pavilion',
    name: 'First Tennessee Park Pavilion',
    level: 'upper',
    baseAngle: 125,
    angleSpan: 31,
    rows: generateRows(1, 8, 47, 34, 22),
    vertices3D: [
      { x: 100, y: 34, z: 330 },
      { x: 140, y: 34, z: 370 },
      { x: 145, y: 50, z: 386 },
      { x: 105, y: 50, z: 346 }
    ],
    covered: false,
    distance: 350,
    height: 34,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== COCA-COLA CORNER ==========
  {
    id: 'coca-cola-corner',
    name: 'Coca-Cola Corner',
    level: 'standing',
    baseAngle: 45,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 150, y: 16, z: 352 },
      { x: 173, y: 16, z: 375 },
      { x: 178, y: 22, z: 381 },
      { x: 155, y: 22, z: 358 }
    ],
    covered: false,
    distance: 363,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== GUITAR DECK ==========
  {
    id: 'guitar-deck',
    name: 'Guitar Deck',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: -43, y: 19, z: 395 },
      { x: 43, y: 19, z: 395 },
      { x: 48, y: 25, z: 405 },
      { x: -48, y: 25, z: 405 }
    ],
    covered: false,
    distance: 395,
    height: 19,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== BERM ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 160,
    angleSpan: 36,
    rows: [],
    vertices3D: [
      { x: 123, y: 5, z: 362 },
      { x: 173, y: 5, z: 392 },
      { x: 178, y: 10, z: 402 },
      { x: 128, y: 10, z: 372 }
    ],
    covered: false,
    distance: 377,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const nashvilleSoundsConfig = {
  stadiumName: 'First Horizon Park',
  team: 'Nashville Sounds',
  parentOrg: 'Milwaukee Brewers',
  city: 'Nashville',
  state: 'TN',
  level: 'AAA',
  capacity: 10000,
  opened: 2015,
  orientation: 30,
  dimensions: {
    leftField: 327,
    leftCenter: 375,
    centerField: 405,
    rightCenter: 375,
    rightField: 326
  },
  features: {
    guitarShapedScoreboard: true,
    nashvilleSkylineView: true,
    bandBox: true,
    guitarDeck: true,
    firstTennesseePavilion: true,
    dugoutSuites: true,
    cocaColaCorner: true,
    berm: true,
    coveredSeating: 3100,
    musicCityTheme: true
  }
};
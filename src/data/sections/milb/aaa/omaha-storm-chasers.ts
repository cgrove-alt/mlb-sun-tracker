// Werner Park - Omaha Storm Chasers (Kansas City Royals AAA)
// Opened: 2011
// Capacity: 9,023
// Known for modern amenities and Papillion suburban setting

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

export const omahaStormChasersSections: DetailedSection[] = [
  // ========== WERNER ENTERPRISES CLUB ==========
  {
    id: 'werner-club',
    name: 'Werner Enterprises Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows('A', 'J', 35, 23, 26),
    vertices3D: [
      { x: -42, y: 23, z: 56 },
      { x: 42, y: 23, z: 56 },
      { x: 47, y: 48, z: 81 },
      { x: -47, y: 48, z: 81 }
    ],
    covered: true,
    distance: 56,
    height: 23,
    rake: 26,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== DUGOUT SUITES ==========
  {
    id: 'dugout-suite-home',
    name: 'Home Dugout Suite',
    level: 'field',
    baseAngle: 338,
    angleSpan: 17,
    rows: generateRows('A', 'E', 18, 1, 19),
    vertices3D: [
      { x: -32, y: 1, z: 42 },
      { x: -15, y: 1, z: 42 },
      { x: -10, y: 12, z: 53 },
      { x: -27, y: 12, z: 53 }
    ],
    covered: false,
    distance: 42,
    height: 1,
    rake: 19,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  {
    id: 'dugout-suite-visitor',
    name: 'Visitor Dugout Suite',
    level: 'field',
    baseAngle: 22,
    angleSpan: 17,
    rows: generateRows('A', 'E', 18, 1, 19),
    vertices3D: [
      { x: 15, y: 1, z: 42 },
      { x: 32, y: 1, z: 42 },
      { x: 27, y: 12, z: 53 },
      { x: 10, y: 12, z: 53 }
    ],
    covered: false,
    distance: 42,
    height: 1,
    rake: 19,
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
    rows: generateRows('A', 'M', 22, 4, 22),
    vertices3D: [
      { x: -22, y: 4, z: 46 },
      { x: 22, y: 4, z: 46 },
      { x: 27, y: 30, z: 72 },
      { x: -27, y: 30, z: 72 }
    ],
    covered: false,
    distance: 46,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-105',
    name: 'Field Box 105',
    level: 'field',
    baseAngle: 42,
    angleSpan: 24,
    rows: generateRows('A', 'M', 24, 4, 22),
    vertices3D: [
      { x: 48, y: 4, z: 78 },
      { x: 78, y: 4, z: 108 },
      { x: 83, y: 30, z: 134 },
      { x: 53, y: 30, z: 104 }
    ],
    covered: false,
    distance: 93,
    height: 4,
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
    rows: generateRows('A', 'M', 24, 4, 22),
    vertices3D: [
      { x: -78, y: 4, z: 108 },
      { x: -48, y: 4, z: 78 },
      { x: -53, y: 30, z: 104 },
      { x: -83, y: 30, z: 134 }
    ],
    covered: false,
    distance: 93,
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
    angleSpan: 22,
    rows: generateRows(1, 22, 30, 11, 24),
    vertices3D: [
      { x: -32, y: 11, z: 65 },
      { x: 32, y: 11, z: 65 },
      { x: 37, y: 47, z: 101 },
      { x: -37, y: 47, z: 101 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22'],
      coveragePercentage: 41
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
    angleSpan: 26,
    rows: generateRows(1, 22, 28, 11, 24),
    vertices3D: [
      { x: 66, y: 11, z: 114 },
      { x: 96, y: 11, z: 144 },
      { x: 101, y: 47, z: 180 },
      { x: 71, y: 47, z: 150 }
    ],
    covered: false,
    distance: 129,
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
    angleSpan: 26,
    rows: generateRows(1, 22, 28, 11, 24),
    vertices3D: [
      { x: -96, y: 11, z: 144 },
      { x: -66, y: 11, z: 114 },
      { x: -71, y: 47, z: 150 },
      { x: -101, y: 47, z: 180 }
    ],
    covered: false,
    distance: 129,
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
      { rowNumber: 'Suite', seats: 290, elevation: 31, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -69, y: 31, z: 80 },
      { x: 69, y: 31, z: 80 },
      { x: 74, y: 41, z: 90 },
      { x: -74, y: 41, z: 90 }
    ],
    covered: true,
    distance: 80,
    height: 31,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== BERM ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 155,
    angleSpan: 38,
    rows: [],
    vertices3D: [
      { x: 118, y: 4, z: 358 },
      { x: 170, y: 4, z: 390 },
      { x: 175, y: 9, z: 400 },
      { x: 123, y: 9, z: 368 }
    ],
    covered: false,
    distance: 374,
    height: 4,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY PORCH ==========
  {
    id: 'party-porch',
    name: 'Party Porch',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: 112, y: 14, z: 278 },
      { x: 145, y: 14, z: 311 },
      { x: 150, y: 20, z: 317 },
      { x: 117, y: 20, z: 284 }
    ],
    covered: true,
    distance: 294,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== OUTFIELD PAVILION ==========
  {
    id: 'outfield-pavilion',
    name: 'Outfield Pavilion',
    level: 'field',
    baseAngle: 250,
    angleSpan: 26,
    rows: generateRows(1, 16, 34, 6, 20),
    vertices3D: [
      { x: -124, y: 6, z: 264 },
      { x: -100, y: 6, z: 288 },
      { x: -105, y: 28, z: 310 },
      { x: -129, y: 28, z: 286 }
    ],
    covered: false,
    distance: 276,
    height: 6,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== EMBASSY SUITES DECK ==========
  {
    id: 'embassy-suites-deck',
    name: 'Embassy Suites Deck',
    level: 'upper',
    baseAngle: 122,
    angleSpan: 30,
    rows: generateRows(1, 7, 44, 33, 22),
    vertices3D: [
      { x: 98, y: 33, z: 325 },
      { x: 136, y: 33, z: 363 },
      { x: 141, y: 47, z: 377 },
      { x: 103, y: 47, z: 339 }
    ],
    covered: false,
    distance: 344,
    height: 33,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== CONCOURSE STANDING ROOM ==========
  {
    id: 'concourse-sro',
    name: 'Concourse Standing Room',
    level: 'standing',
    baseAngle: 0,
    angleSpan: 360,
    rows: [],
    vertices3D: [
      { x: -90, y: 17, z: 290 },
      { x: 90, y: 17, z: 290 },
      { x: 95, y: 23, z: 300 },
      { x: -95, y: 23, z: 300 }
    ],
    covered: false,
    distance: 290,
    height: 17,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const omahaStormChasersConfig = {
  stadiumName: 'Werner Park',
  team: 'Omaha Storm Chasers',
  parentOrg: 'Kansas City Royals',
  city: 'Papillion',
  state: 'NE',
  level: 'AAA',
  capacity: 9023,
  opened: 2011,
  orientation: 310,
  dimensions: {
    leftField: 310,
    leftCenter: 375,
    centerField: 402,
    rightCenter: 375,
    rightField: 315
  },
  features: {
    wernerEnterprisesClub: true,
    dugoutSuites: true,
    partyPorch: true,
    embassySuitesDeck: true,
    berm: true,
    outfieldPavilion: true,
    modernAmenities: true,
    suburbanSetting: true,
    coveredSeating: 2800,
    concourseStandingRoom: true
  }
};
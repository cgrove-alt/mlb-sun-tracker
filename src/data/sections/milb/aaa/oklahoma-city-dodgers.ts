// Chickasaw Bricktown Ballpark - Oklahoma City Dodgers (Los Angeles Dodgers AAA)
// Opened: 1998
// Capacity: 13,066
// Known for Bricktown Entertainment District location and downtown OKC skyline

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

export const oklahomaCityDodgersSections: DetailedSection[] = [
  // ========== DODGER BLUE CLUB ==========
  {
    id: 'dodger-blue-club',
    name: 'Dodger Blue Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 32,
    rows: generateRows('A', 'M', 40, 25, 28),
    vertices3D: [
      { x: -47, y: 25, z: 60 },
      { x: 47, y: 25, z: 60 },
      { x: 52, y: 56, z: 91 },
      { x: -52, y: 56, z: 91 }
    ],
    covered: true,
    distance: 60,
    height: 25,
    rake: 28,
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
    rows: generateRows('A', 'P', 25, 3, 23),
    vertices3D: [
      { x: -21, y: 3, z: 48 },
      { x: 21, y: 3, z: 48 },
      { x: 26, y: 36, z: 81 },
      { x: -26, y: 36, z: 81 }
    ],
    covered: false,
    distance: 48,
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
    angleSpan: 21,
    rows: generateRows('A', 'P', 26, 3, 23),
    vertices3D: [
      { x: 21, y: 3, z: 48 },
      { x: 42, y: 3, z: 58 },
      { x: 47, y: 36, z: 91 },
      { x: 26, y: 36, z: 81 }
    ],
    covered: false,
    distance: 53,
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
    angleSpan: 21,
    rows: generateRows('A', 'P', 26, 3, 23),
    vertices3D: [
      { x: -42, y: 3, z: 58 },
      { x: -21, y: 3, z: 48 },
      { x: -26, y: 36, z: 81 },
      { x: -47, y: 36, z: 91 }
    ],
    covered: false,
    distance: 53,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 46,
    angleSpan: 26,
    rows: generateRows('A', 'P', 27, 3, 23),
    vertices3D: [
      { x: 52, y: 3, z: 84 },
      { x: 86, y: 3, z: 118 },
      { x: 91, y: 36, z: 151 },
      { x: 57, y: 36, z: 117 }
    ],
    covered: false,
    distance: 101,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 314,
    angleSpan: 26,
    rows: generateRows('A', 'P', 27, 3, 23),
    vertices3D: [
      { x: -86, y: 3, z: 118 },
      { x: -52, y: 3, z: 84 },
      { x: -57, y: 36, z: 117 },
      { x: -91, y: 36, z: 151 }
    ],
    covered: false,
    distance: 101,
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
    angleSpan: 23,
    rows: generateRows(1, 27, 34, 11, 25),
    vertices3D: [
      { x: -35, y: 11, z: 69 },
      { x: 35, y: 11, z: 69 },
      { x: 40, y: 56, z: 114 },
      { x: -40, y: 56, z: 114 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 33
    },
    distance: 69,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 52,
    angleSpan: 28,
    rows: generateRows(1, 27, 32, 11, 25),
    vertices3D: [
      { x: 73, y: 11, z: 125 },
      { x: 107, y: 11, z: 159 },
      { x: 112, y: 56, z: 204 },
      { x: 78, y: 56, z: 170 }
    ],
    covered: false,
    distance: 142,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 308,
    angleSpan: 28,
    rows: generateRows(1, 27, 32, 11, 25),
    vertices3D: [
      { x: -107, y: 11, z: 159 },
      { x: -73, y: 11, z: 125 },
      { x: -78, y: 56, z: 170 },
      { x: -112, y: 56, z: 204 }
    ],
    covered: false,
    distance: 142,
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
    angleSpan: 60,
    rows: [
      { rowNumber: 'Suite', seats: 380, elevation: 35, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -78, y: 35, z: 88 },
      { x: 78, y: 35, z: 88 },
      { x: 83, y: 45, z: 98 },
      { x: -83, y: 45, z: 98 }
    ],
    covered: true,
    distance: 88,
    height: 35,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== BRICKTOWN DECK ==========
  {
    id: 'bricktown-deck',
    name: 'Bricktown Deck',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 35,
    rows: generateRows(1, 10, 50, 37, 24),
    vertices3D: [
      { x: 108, y: 37, z: 351 },
      { x: 151, y: 37, z: 394 },
      { x: 156, y: 56, z: 413 },
      { x: 113, y: 56, z: 370 }
    ],
    covered: false,
    distance: 372,
    height: 37,
    rake: 24,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== MICKEY MANTLE PLAZA ==========
  {
    id: 'mickey-mantle-plaza',
    name: 'Mickey Mantle Plaza',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 122, y: 16, z: 295 },
      { x: 159, y: 16, z: 332 },
      { x: 164, y: 22, z: 338 },
      { x: 127, y: 22, z: 301 }
    ],
    covered: true,
    distance: 313,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 254,
    angleSpan: 29,
    rows: generateRows(1, 21, 40, 7, 21),
    vertices3D: [
      { x: -134, y: 7, z: 281 },
      { x: -107, y: 7, z: 308 },
      { x: -112, y: 37, z: 338 },
      { x: -139, y: 37, z: 311 }
    ],
    covered: false,
    distance: 294,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== CORONA BEACH HOUSE ==========
  {
    id: 'corona-beach-house',
    name: 'Corona Beach House',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -45, y: 18, z: 398 },
      { x: 45, y: 18, z: 398 },
      { x: 50, y: 24, z: 408 },
      { x: -50, y: 24, z: 408 }
    ],
    covered: false,
    distance: 398,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== OUTFIELD RESERVED ==========
  {
    id: 'outfield-reserved',
    name: 'Outfield Reserved',
    level: 'field',
    baseAngle: 270,
    angleSpan: 24,
    rows: generateRows(1, 18, 38, 8, 20),
    vertices3D: [
      { x: -172, y: 8, z: 323 },
      { x: -146, y: 8, z: 349 },
      { x: -151, y: 32, z: 373 },
      { x: -177, y: 32, z: 347 }
    ],
    covered: false,
    distance: 336,
    height: 8,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PICNIC HILL ==========
  {
    id: 'picnic-hill',
    name: 'Picnic Hill',
    level: 'field',
    baseAngle: 62,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: 166, y: 6, z: 303 },
      { x: 194, y: 6, z: 331 },
      { x: 199, y: 12, z: 341 },
      { x: 171, y: 12, z: 313 }
    ],
    covered: false,
    distance: 317,
    height: 6,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== DODGERS DUGOUT CLUB ==========
  {
    id: 'dodgers-dugout-club',
    name: 'Dodgers Dugout Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 14,
    rows: generateRows('A', 'D', 18, 2, 18),
    vertices3D: [
      { x: -12, y: 2, z: 38 },
      { x: 12, y: 2, z: 38 },
      { x: 15, y: 10, z: 46 },
      { x: -15, y: 10, z: 46 }
    ],
    covered: false,
    distance: 38,
    height: 2,
    rake: 18,
    viewQuality: 'excellent',
    price: 'luxury'
  }
];

// Stadium configuration
export const oklahomaCityDodgersConfig = {
  stadiumName: 'Chickasaw Bricktown Ballpark',
  team: 'Oklahoma City Dodgers',
  parentOrg: 'Los Angeles Dodgers',
  city: 'Oklahoma City',
  state: 'OK',
  level: 'AAA',
  capacity: 13066,
  opened: 1998,
  orientation: 0,
  dimensions: {
    leftField: 325,
    leftCenter: 375,
    centerField: 400,
    rightCenter: 375,
    rightField: 325
  },
  features: {
    bricktownDistrict: true,
    downtownOKCView: true,
    dodgerBlueClub: true,
    bricktownDeck: true,
    mickeyMantlePlaza: true,
    coronaBeachHouse: true,
    dodgersDugoutClub: true,
    picnicHill: true,
    coveredSeating: 3800
  }
};
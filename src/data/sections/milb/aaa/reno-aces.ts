// Greater Nevada Field - Reno Aces (Arizona Diamondbacks AAA)
// Opened: 2009
// Capacity: 9,013
// Known for Sierra Nevada mountain views and downtown Reno location

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

export const renoAcesSections: DetailedSection[] = [
  // ========== ACE CLUB ==========
  {
    id: 'ace-club',
    name: 'Ace Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows('A', 'K', 34, 22, 26),
    vertices3D: [
      { x: -41, y: 22, z: 55 },
      { x: 41, y: 22, z: 55 },
      { x: 46, y: 48, z: 81 },
      { x: -46, y: 48, z: 81 }
    ],
    covered: true,
    distance: 55,
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
    angleSpan: 19,
    rows: generateRows('A', 'L', 21, 4, 21),
    vertices3D: [
      { x: -23, y: 4, z: 44 },
      { x: 23, y: 4, z: 44 },
      { x: 28, y: 28, z: 68 },
      { x: -28, y: 28, z: 68 }
    ],
    covered: false,
    distance: 44,
    height: 4,
    rake: 21,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 19,
    angleSpan: 20,
    rows: generateRows('A', 'L', 22, 4, 21),
    vertices3D: [
      { x: 23, y: 4, z: 44 },
      { x: 41, y: 4, z: 52 },
      { x: 46, y: 28, z: 76 },
      { x: 28, y: 28, z: 68 }
    ],
    covered: false,
    distance: 48,
    height: 4,
    rake: 21,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-104',
    name: 'Field Box 104',
    level: 'field',
    baseAngle: 341,
    angleSpan: 20,
    rows: generateRows('A', 'L', 22, 4, 21),
    vertices3D: [
      { x: -41, y: 4, z: 52 },
      { x: -23, y: 4, z: 44 },
      { x: -28, y: 28, z: 68 },
      { x: -46, y: 28, z: 76 }
    ],
    covered: false,
    distance: 48,
    height: 4,
    rake: 21,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 47,
    angleSpan: 23,
    rows: generateRows('A', 'L', 23, 4, 21),
    vertices3D: [
      { x: 50, y: 4, z: 79 },
      { x: 78, y: 4, z: 107 },
      { x: 83, y: 28, z: 131 },
      { x: 55, y: 28, z: 103 }
    ],
    covered: false,
    distance: 93,
    height: 4,
    rake: 21,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-117',
    name: 'Field Box 117',
    level: 'field',
    baseAngle: 313,
    angleSpan: 23,
    rows: generateRows('A', 'L', 23, 4, 21),
    vertices3D: [
      { x: -78, y: 4, z: 107 },
      { x: -50, y: 4, z: 79 },
      { x: -55, y: 28, z: 103 },
      { x: -83, y: 28, z: 131 }
    ],
    covered: false,
    distance: 93,
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
    angleSpan: 24,
    rows: generateRows(1, 20, 29, 12, 23),
    vertices3D: [
      { x: -30, y: 12, z: 61 },
      { x: 30, y: 12, z: 61 },
      { x: 35, y: 42, z: 91 },
      { x: -35, y: 42, z: 91 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['12', '13', '14', '15', '16', '17', '18', '19', '20'],
      coveragePercentage: 45
    },
    distance: 61,
    height: 12,
    rake: 23,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-206',
    name: 'Reserved 206',
    level: 'lower',
    baseAngle: 52,
    angleSpan: 26,
    rows: generateRows(1, 20, 27, 12, 23),
    vertices3D: [
      { x: 65, y: 12, z: 111 },
      { x: 94, y: 12, z: 140 },
      { x: 99, y: 42, z: 170 },
      { x: 70, y: 42, z: 141 }
    ],
    covered: false,
    distance: 125,
    height: 12,
    rake: 23,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-214',
    name: 'Reserved 214',
    level: 'lower',
    baseAngle: 308,
    angleSpan: 26,
    rows: generateRows(1, 20, 27, 12, 23),
    vertices3D: [
      { x: -94, y: 12, z: 140 },
      { x: -65, y: 12, z: 111 },
      { x: -70, y: 42, z: 141 },
      { x: -99, y: 42, z: 170 }
    ],
    covered: false,
    distance: 125,
    height: 12,
    rake: 23,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
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
      { x: -64, y: 29, z: 76 },
      { x: 64, y: 29, z: 76 },
      { x: 69, y: 39, z: 86 },
      { x: -69, y: 39, z: 86 }
    ],
    covered: true,
    distance: 76,
    height: 29,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== SIERRA NEVADA DECK ==========
  {
    id: 'sierra-nevada-deck',
    name: 'Sierra Nevada Deck',
    level: 'upper',
    baseAngle: 118,
    angleSpan: 29,
    rows: generateRows(1, 6, 41, 30, 21),
    vertices3D: [
      { x: 91, y: 30, z: 305 },
      { x: 126, y: 30, z: 340 },
      { x: 131, y: 42, z: 352 },
      { x: 96, y: 42, z: 317 }
    ],
    covered: false,
    distance: 322,
    height: 30,
    rake: 21,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== FREIGHT HOUSE DISTRICT PAVILION ==========
  {
    id: 'freight-house-pavilion',
    name: 'Freight House District Pavilion',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: 105, y: 13, z: 262 },
      { x: 135, y: 13, z: 292 },
      { x: 140, y: 19, z: 298 },
      { x: 110, y: 19, z: 268 }
    ],
    covered: true,
    distance: 277,
    height: 13,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD LAWN ==========
  {
    id: 'left-field-lawn',
    name: 'Left Field Lawn',
    level: 'field',
    baseAngle: 243,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: -116, y: 5, z: 252 },
      { x: -92, y: 5, z: 276 },
      { x: -97, y: 10, z: 286 },
      { x: -121, y: 10, z: 262 }
    ],
    covered: false,
    distance: 264,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== CASINO CLUB ==========
  {
    id: 'casino-club',
    name: 'Casino Club',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: -40, y: 15, z: 365 },
      { x: 40, y: 15, z: 365 },
      { x: 45, y: 21, z: 375 },
      { x: -45, y: 21, z: 375 }
    ],
    covered: false,
    distance: 365,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== ACES ALLEY ==========
  {
    id: 'aces-alley',
    name: 'Aces Alley',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: -150, y: 11, z: 290 },
      { x: -128, y: 11, z: 312 },
      { x: -133, y: 17, z: 318 },
      { x: -155, y: 17, z: 296 }
    ],
    covered: false,
    distance: 301,
    height: 11,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== RIGHT FIELD TERRACE ==========
  {
    id: 'right-field-terrace',
    name: 'Right Field Terrace',
    level: 'field',
    baseAngle: 56,
    angleSpan: 22,
    rows: generateRows(1, 10, 28, 6, 18),
    vertices3D: [
      { x: 142, y: 6, z: 268 },
      { x: 164, y: 6, z: 290 },
      { x: 169, y: 20, z: 304 },
      { x: 147, y: 20, z: 282 }
    ],
    covered: false,
    distance: 279,
    height: 6,
    rake: 18,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const renoAcesConfig = {
  stadiumName: 'Greater Nevada Field',
  team: 'Reno Aces',
  parentOrg: 'Arizona Diamondbacks',
  city: 'Reno',
  state: 'NV',
  level: 'AAA',
  capacity: 9013,
  opened: 2009,
  orientation: 45,
  dimensions: {
    leftField: 345,
    leftCenter: 365,
    centerField: 400,
    rightCenter: 365,
    rightField: 335
  },
  features: {
    sierraNevadaView: true,
    downtownRenoLocation: true,
    aceClub: true,
    sierraNevadaDeck: true,
    freightHousePavilion: true,
    casinoClub: true,
    acesAlley: true,
    leftFieldLawn: true,
    rightFieldTerrace: true,
    coveredSeating: 2500
  }
};
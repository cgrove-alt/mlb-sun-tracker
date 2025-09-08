// Mirabito Stadium - Binghamton Rumble Ponies (New York Mets AA)
// Opened: 1992
// Capacity: 6,012
// Known for downtown Binghamton location and carousel-themed features

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

export const binghamtonRumblePoniesSections: DetailedSection[] = [
  // ========== CAROUSEL CLUB ==========
  {
    id: 'carousel-club',
    name: 'Carousel Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 23,
    rows: generateRows('A', 'G', 27, 18, 22),
    vertices3D: [
      { x: -33, y: 18, z: 50 },
      { x: 33, y: 18, z: 50 },
      { x: 38, y: 35, z: 67 },
      { x: -38, y: 35, z: 67 }
    ],
    covered: true,
    distance: 50,
    height: 18,
    rake: 22,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows('A', 'I', 17, 5, 17),
    vertices3D: [
      { x: -26, y: 5, z: 40 },
      { x: 26, y: 5, z: 40 },
      { x: 31, y: 21, z: 56 },
      { x: -31, y: 21, z: 56 }
    ],
    covered: false,
    distance: 40,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 22,
    angleSpan: 24,
    rows: generateRows('A', 'I', 18, 5, 17),
    vertices3D: [
      { x: 26, y: 5, z: 40 },
      { x: 45, y: 5, z: 48 },
      { x: 50, y: 21, z: 64 },
      { x: 31, y: 21, z: 56 }
    ],
    covered: false,
    distance: 44,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 338,
    angleSpan: 24,
    rows: generateRows('A', 'I', 18, 5, 17),
    vertices3D: [
      { x: -45, y: 5, z: 48 },
      { x: -26, y: 5, z: 40 },
      { x: -31, y: 21, z: 56 },
      { x: -50, y: 21, z: 64 }
    ],
    covered: false,
    distance: 44,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 54,
    angleSpan: 25,
    rows: generateRows('A', 'I', 19, 5, 17),
    vertices3D: [
      { x: 54, y: 5, z: 72 },
      { x: 79, y: 5, z: 97 },
      { x: 84, y: 21, z: 113 },
      { x: 59, y: 21, z: 88 }
    ],
    covered: false,
    distance: 84,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-122',
    name: 'Field Box 122',
    level: 'field',
    baseAngle: 306,
    angleSpan: 25,
    rows: generateRows('A', 'I', 19, 5, 17),
    vertices3D: [
      { x: -79, y: 5, z: 97 },
      { x: -54, y: 5, z: 72 },
      { x: -59, y: 21, z: 88 },
      { x: -84, y: 21, z: 113 }
    ],
    covered: false,
    distance: 84,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows(1, 14, 24, 16, 19),
    vertices3D: [
      { x: -26, y: 16, z: 55 },
      { x: 26, y: 16, z: 55 },
      { x: 31, y: 31, z: 70 },
      { x: -31, y: 31, z: 70 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['8', '9', '10', '11', '12', '13', '14'],
      coveragePercentage: 50
    },
    distance: 55,
    height: 16,
    rake: 19,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-205',
    name: 'Reserved 205',
    level: 'lower',
    baseAngle: 59,
    angleSpan: 27,
    rows: generateRows(1, 14, 22, 16, 19),
    vertices3D: [
      { x: 61, y: 16, z: 100 },
      { x: 87, y: 16, z: 126 },
      { x: 92, y: 31, z: 141 },
      { x: 66, y: 31, z: 115 }
    ],
    covered: false,
    distance: 113,
    height: 16,
    rake: 19,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-213',
    name: 'Reserved 213',
    level: 'lower',
    baseAngle: 301,
    angleSpan: 27,
    rows: generateRows(1, 14, 22, 16, 19),
    vertices3D: [
      { x: -87, y: 16, z: 126 },
      { x: -61, y: 16, z: 100 },
      { x: -66, y: 31, z: 115 },
      { x: -92, y: 31, z: 141 }
    ],
    covered: false,
    distance: 113,
    height: 16,
    rake: 19,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== PONY PAVILION ==========
  {
    id: 'pony-pavilion',
    name: 'Pony Pavilion',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 21,
    rows: [],
    vertices3D: [
      { x: 88, y: 8, z: 225 },
      { x: 112, y: 8, z: 249 },
      { x: 117, y: 14, z: 255 },
      { x: 93, y: 14, z: 231 }
    ],
    covered: true,
    distance: 237,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD BERM ==========
  {
    id: 'left-field-berm',
    name: 'Left Field Berm',
    level: 'field',
    baseAngle: 225,
    angleSpan: 36,
    rows: [],
    vertices3D: [
      { x: -93, y: 5, z: 215 },
      { x: -70, y: 5, z: 238 },
      { x: -75, y: 10, z: 248 },
      { x: -98, y: 10, z: 225 }
    ],
    covered: false,
    distance: 226,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== CAROUSEL CORNER ==========
  {
    id: 'carousel-corner',
    name: 'Carousel Corner',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: -32, y: 11, z: 310 },
      { x: 32, y: 11, z: 310 },
      { x: 37, y: 17, z: 320 },
      { x: -37, y: 17, z: 320 }
    ],
    covered: false,
    distance: 310,
    height: 11,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PARTY DECK ==========
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'field',
    baseAngle: 48,
    angleSpan: 18,
    rows: generateRows(1, 5, 20, 6, 15),
    vertices3D: [
      { x: 115, y: 6, z: 235 },
      { x: 133, y: 6, z: 253 },
      { x: 138, y: 14, z: 261 },
      { x: 120, y: 14, z: 243 }
    ],
    covered: false,
    distance: 244,
    height: 6,
    rake: 15,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const binghamtonRumblePoniesConfig = {
  stadiumName: 'Mirabito Stadium',
  team: 'Binghamton Rumble Ponies',
  parentOrg: 'New York Mets',
  city: 'Binghamton',
  state: 'NY',
  level: 'AA',
  capacity: 6012,
  opened: 1992,
  orientation: 340,
  dimensions: {
    leftField: 330,
    leftCenter: 365,
    centerField: 400,
    rightCenter: 365,
    rightField: 330
  },
  features: {
    downtownBinghamtonLocation: true,
    carouselTheme: true,
    carouselClub: true,
    ponyPavilion: true,
    carouselCorner: true,
    leftFieldBerm: true,
    partyDeck: true,
    coveredSeating: 1600
  }
};
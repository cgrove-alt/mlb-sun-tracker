// Coolray Field - Gwinnett Stripers (Atlanta Braves AAA)
// Opened: 2009
// Capacity: 10,427
// Known for multi-level party decks and Infinite Energy Pavilion

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

export const gwinnettStripersSections: DetailedSection[] = [
  // ========== SUNTRUST CLUB (Premium Behind Home) ==========
  {
    id: 'suntrust-club',
    name: 'SunTrust Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows('A', 'K', 38, 24, 27),
    vertices3D: [
      { x: -42, y: 24, z: 58 },
      { x: 42, y: 24, z: 58 },
      { x: 47, y: 52, z: 86 },
      { x: -47, y: 52, z: 86 }
    ],
    covered: true,
    distance: 58,
    height: 24,
    rake: 27,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== INFINITE ENERGY PAVILION ==========
  {
    id: 'infinite-energy-pavilion',
    name: 'Infinite Energy Pavilion',
    level: 'field',
    baseAngle: 90,
    angleSpan: 28,
    rows: generateRows(1, 10, 60, 14, 23),
    vertices3D: [
      { x: 115, y: 14, z: 275 },
      { x: 145, y: 14, z: 305 },
      { x: 150, y: 36, z: 327 },
      { x: 120, y: 36, z: 297 }
    ],
    covered: true,
    distance: 290,
    height: 14,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== FIELD RESERVED ==========
  {
    id: 'field-reserved-100',
    name: 'Field Reserved 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows('A', 'Q', 24, 4, 23),
    vertices3D: [
      { x: -22, y: 4, z: 48 },
      { x: 22, y: 4, z: 48 },
      { x: 27, y: 36, z: 80 },
      { x: -27, y: 36, z: 80 }
    ],
    covered: false,
    distance: 48,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-reserved-105',
    name: 'Field Reserved 105',
    level: 'field',
    baseAngle: 42,
    angleSpan: 22,
    rows: generateRows('A', 'Q', 26, 4, 23),
    vertices3D: [
      { x: 48, y: 4, z: 78 },
      { x: 78, y: 4, z: 108 },
      { x: 83, y: 36, z: 140 },
      { x: 53, y: 36, z: 110 }
    ],
    covered: false,
    distance: 93,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-reserved-115',
    name: 'Field Reserved 115',
    level: 'field',
    baseAngle: 318,
    angleSpan: 22,
    rows: generateRows('A', 'Q', 26, 4, 23),
    vertices3D: [
      { x: -78, y: 4, z: 108 },
      { x: -48, y: 4, z: 78 },
      { x: -53, y: 36, z: 110 },
      { x: -83, y: 36, z: 140 }
    ],
    covered: false,
    distance: 93,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== LOWER RESERVED ==========
  {
    id: 'lower-reserved-201',
    name: 'Lower Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows(1, 25, 32, 12, 25),
    vertices3D: [
      { x: -32, y: 12, z: 68 },
      { x: 32, y: 12, z: 68 },
      { x: 37, y: 52, z: 108 },
      { x: -37, y: 52, z: 108 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      coveragePercentage: 40
    },
    distance: 68,
    height: 12,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'lower-reserved-210',
    name: 'Lower Reserved 210',
    level: 'lower',
    baseAngle: 52,
    angleSpan: 24,
    rows: generateRows(1, 25, 30, 12, 25),
    vertices3D: [
      { x: 68, y: 12, z: 118 },
      { x: 98, y: 12, z: 148 },
      { x: 103, y: 52, z: 188 },
      { x: 73, y: 52, z: 158 }
    ],
    covered: false,
    distance: 133,
    height: 12,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'lower-reserved-218',
    name: 'Lower Reserved 218',
    level: 'lower',
    baseAngle: 308,
    angleSpan: 24,
    rows: generateRows(1, 25, 30, 12, 25),
    vertices3D: [
      { x: -98, y: 12, z: 148 },
      { x: -68, y: 12, z: 118 },
      { x: -73, y: 52, z: 158 },
      { x: -103, y: 52, z: 188 }
    ],
    covered: false,
    distance: 133,
    height: 12,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== PARTY DECKS ==========
  {
    id: 'party-deck-left',
    name: 'Left Field Party Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: -145, y: 16, z: 285 },
      { x: -115, y: 16, z: 315 },
      { x: -120, y: 22, z: 321 },
      { x: -150, y: 22, z: 291 }
    ],
    covered: true,
    distance: 300,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  {
    id: 'party-deck-right',
    name: 'Right Field Party Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: 115, y: 16, z: 315 },
      { x: 145, y: 16, z: 285 },
      { x: 150, y: 22, z: 291 },
      { x: 120, y: 22, z: 321 }
    ],
    covered: true,
    distance: 300,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 55,
    rows: [
      { rowNumber: 'Suite', seats: 300, elevation: 32, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -72, y: 32, z: 82 },
      { x: 72, y: 32, z: 82 },
      { x: 77, y: 42, z: 92 },
      { x: -77, y: 42, z: 92 }
    ],
    covered: true,
    distance: 82,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== OUTFIELD PAVILIONS ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 245,
    angleSpan: 22,
    rows: generateRows(1, 20, 38, 8, 22),
    vertices3D: [
      { x: -125, y: 8, z: 265 },
      { x: -105, y: 8, z: 285 },
      { x: -110, y: 38, z: 315 },
      { x: -130, y: 38, z: 295 }
    ],
    covered: false,
    distance: 275,
    height: 8,
    rake: 22,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== GRASS BERM ==========
  {
    id: 'grass-berm',
    name: 'Grass Berm',
    level: 'field',
    baseAngle: 180,
    angleSpan: 35,
    rows: [],
    vertices3D: [
      { x: -55, y: 4, z: 385 },
      { x: 55, y: 4, z: 385 },
      { x: 60, y: 9, z: 395 },
      { x: -60, y: 9, z: 395 }
    ],
    covered: false,
    distance: 385,
    height: 4,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== CHOPPER'S CORNER ==========
  {
    id: 'choppers-corner',
    name: "Chopper's Corner",
    level: 'field',
    baseAngle: 135,
    angleSpan: 28,
    rows: generateRows(1, 12, 42, 10, 21),
    vertices3D: [
      { x: 105, y: 10, z: 335 },
      { x: 145, y: 10, z: 375 },
      { x: 150, y: 32, z: 397 },
      { x: 110, y: 32, z: 357 }
    ],
    covered: false,
    distance: 355,
    height: 10,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PREMIUM TERRACE ==========
  {
    id: 'premium-terrace',
    name: 'Premium Terrace',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 35,
    rows: generateRows(1, 8, 45, 38, 24),
    vertices3D: [
      { x: -50, y: 38, z: 95 },
      { x: 50, y: 38, z: 95 },
      { x: 55, y: 54, z: 111 },
      { x: -55, y: 54, z: 111 }
    ],
    covered: true,
    distance: 95,
    height: 38,
    rake: 24,
    viewQuality: 'good',
    price: 'premium'
  }
];

// Stadium configuration
export const gwinnettStripersConfig = {
  stadiumName: 'Coolray Field',
  team: 'Gwinnett Stripers',
  parentOrg: 'Atlanta Braves',
  city: 'Lawrenceville',
  state: 'GA',
  level: 'AAA',
  capacity: 10427,
  opened: 2009,
  orientation: 340,
  dimensions: {
    leftField: 335,
    leftCenter: 375,
    centerField: 400,
    rightCenter: 375,
    rightField: 335
  },
  features: {
    infiniteEnergyPavilion: true,
    partyDecks: true,
    choppersCorner: true,
    grassBerm: true,
    suntrustClub: true,
    premiumTerrace: true,
    coveredSeating: 3200,
    multiLevelDecks: true
  }
};
// Canal Park - Akron RubberDucks (Cleveland Guardians AA)
// Opened: 1997
// Capacity: 7,630
// Known for downtown Akron skyline and Ohio & Erie Canal location

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

export const akronRubberDucksSections: DetailedSection[] = [
  // ========== DUCK CLUB ==========
  {
    id: 'duck-club',
    name: 'Duck Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows('A', 'H', 30, 20, 24),
    vertices3D: [
      { x: -36, y: 20, z: 52 },
      { x: 36, y: 20, z: 52 },
      { x: 41, y: 40, z: 72 },
      { x: -41, y: 40, z: 72 }
    ],
    covered: true,
    distance: 52,
    height: 20,
    rake: 24,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'J', 19, 4, 19),
    vertices3D: [
      { x: -24, y: 4, z: 42 },
      { x: 24, y: 4, z: 42 },
      { x: 29, y: 24, z: 62 },
      { x: -29, y: 24, z: 62 }
    ],
    covered: false,
    distance: 42,
    height: 4,
    rake: 19,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-104',
    name: 'Field Box 104',
    level: 'field',
    baseAngle: 20,
    angleSpan: 22,
    rows: generateRows('A', 'J', 20, 4, 19),
    vertices3D: [
      { x: 24, y: 4, z: 42 },
      { x: 43, y: 4, z: 50 },
      { x: 48, y: 24, z: 70 },
      { x: 29, y: 24, z: 62 }
    ],
    covered: false,
    distance: 46,
    height: 4,
    rake: 19,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-105',
    name: 'Field Box 105',
    level: 'field',
    baseAngle: 340,
    angleSpan: 22,
    rows: generateRows('A', 'J', 20, 4, 19),
    vertices3D: [
      { x: -43, y: 4, z: 50 },
      { x: -24, y: 4, z: 42 },
      { x: -29, y: 24, z: 62 },
      { x: -48, y: 24, z: 70 }
    ],
    covered: false,
    distance: 46,
    height: 4,
    rake: 19,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-110',
    name: 'Field Box 110',
    level: 'field',
    baseAngle: 50,
    angleSpan: 23,
    rows: generateRows('A', 'J', 21, 4, 19),
    vertices3D: [
      { x: 52, y: 4, z: 74 },
      { x: 77, y: 4, z: 99 },
      { x: 82, y: 24, z: 119 },
      { x: 57, y: 24, z: 94 }
    ],
    covered: false,
    distance: 86,
    height: 4,
    rake: 19,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-118',
    name: 'Field Box 118',
    level: 'field',
    baseAngle: 310,
    angleSpan: 23,
    rows: generateRows('A', 'J', 21, 4, 19),
    vertices3D: [
      { x: -77, y: 4, z: 99 },
      { x: -52, y: 4, z: 74 },
      { x: -57, y: 24, z: 94 },
      { x: -82, y: 24, z: 119 }
    ],
    covered: false,
    distance: 86,
    height: 4,
    rake: 19,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 26,
    rows: generateRows(1, 16, 26, 14, 21),
    vertices3D: [
      { x: -28, y: 14, z: 57 },
      { x: 28, y: 14, z: 57 },
      { x: 33, y: 34, z: 77 },
      { x: -33, y: 34, z: 77 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['10', '11', '12', '13', '14', '15', '16'],
      coveragePercentage: 44
    },
    distance: 57,
    height: 14,
    rake: 21,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-203',
    name: 'Reserved 203',
    level: 'lower',
    baseAngle: 55,
    angleSpan: 25,
    rows: generateRows(1, 16, 24, 14, 21),
    vertices3D: [
      { x: 59, y: 14, z: 102 },
      { x: 85, y: 14, z: 128 },
      { x: 90, y: 34, z: 148 },
      { x: 64, y: 34, z: 122 }
    ],
    covered: false,
    distance: 115,
    height: 14,
    rake: 21,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-211',
    name: 'Reserved 211',
    level: 'lower',
    baseAngle: 305,
    angleSpan: 25,
    rows: generateRows(1, 16, 24, 14, 21),
    vertices3D: [
      { x: -85, y: 14, z: 128 },
      { x: -59, y: 14, z: 102 },
      { x: -64, y: 34, z: 122 },
      { x: -90, y: 34, z: 148 }
    ],
    covered: false,
    distance: 115,
    height: 14,
    rake: 21,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== CANAL DECK ==========
  {
    id: 'canal-deck',
    name: 'Canal Deck',
    level: 'upper',
    baseAngle: 105,
    angleSpan: 26,
    rows: generateRows(1, 5, 35, 25, 19),
    vertices3D: [
      { x: 78, y: 25, z: 265 },
      { x: 108, y: 25, z: 295 },
      { x: 113, y: 35, z: 305 },
      { x: 83, y: 35, z: 275 }
    ],
    covered: false,
    distance: 280,
    height: 25,
    rake: 19,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== POND PAVILION ==========
  {
    id: 'pond-pavilion',
    name: 'Pond Pavilion',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: 95, y: 10, z: 235 },
      { x: 120, y: 10, z: 260 },
      { x: 125, y: 16, z: 266 },
      { x: 100, y: 16, z: 241 }
    ],
    covered: true,
    distance: 247,
    height: 10,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD LAWN ==========
  {
    id: 'left-field-lawn',
    name: 'Left Field Lawn',
    level: 'field',
    baseAngle: 235,
    angleSpan: 32,
    rows: [],
    vertices3D: [
      { x: -103, y: 5, z: 228 },
      { x: -80, y: 5, z: 251 },
      { x: -85, y: 10, z: 261 },
      { x: -108, y: 10, z: 238 }
    ],
    covered: false,
    distance: 239,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== WADDLE WALK ==========
  {
    id: 'waddle-walk',
    name: 'Waddle Walk',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 24,
    rows: [],
    vertices3D: [
      { x: -35, y: 12, z: 325 },
      { x: 35, y: 12, z: 325 },
      { x: 40, y: 18, z: 335 },
      { x: -40, y: 18, z: 335 }
    ],
    covered: false,
    distance: 325,
    height: 12,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PICNIC AREA ==========
  {
    id: 'picnic-area',
    name: 'Picnic Area',
    level: 'field',
    baseAngle: 52,
    angleSpan: 20,
    rows: generateRows(1, 6, 22, 6, 16),
    vertices3D: [
      { x: 125, y: 6, z: 245 },
      { x: 145, y: 6, z: 265 },
      { x: 150, y: 16, z: 275 },
      { x: 130, y: 16, z: 255 }
    ],
    covered: false,
    distance: 255,
    height: 6,
    rake: 16,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const akronRubberDucksConfig = {
  stadiumName: 'Canal Park',
  team: 'Akron RubberDucks',
  parentOrg: 'Cleveland Guardians',
  city: 'Akron',
  state: 'OH',
  level: 'AA',
  capacity: 7630,
  opened: 1997,
  orientation: 45,
  dimensions: {
    leftField: 334,
    leftCenter: 363,
    centerField: 400,
    rightCenter: 363,
    rightField: 337
  },
  features: {
    downtownAkronSkyline: true,
    ohioErieCanalLocation: true,
    duckClub: true,
    canalDeck: true,
    pondPavilion: true,
    waddleWalk: true,
    leftFieldLawn: true,
    picnicArea: true,
    coveredSeating: 1900
  }
};
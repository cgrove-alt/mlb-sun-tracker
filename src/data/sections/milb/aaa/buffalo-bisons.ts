// Sahlen Field - Buffalo Bisons (Toronto Blue Jays AAA)
// Opened: 1988
// Capacity: 16,600
// Known for largest AAA capacity and downtown Buffalo skyline

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

export const buffaloBisonsSections: DetailedSection[] = [
  // ========== DUGOUT CLUB ==========
  {
    id: 'dugout-club',
    name: 'Dugout Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'J', 30, 0, 20),
    vertices3D: [
      { x: -45, y: 0, z: 50 },
      { x: 45, y: 0, z: 50 },
      { x: 50, y: 20, z: 70 },
      { x: -50, y: 20, z: 70 }
    ],
    covered: false,
    distance: 50,
    height: 0,
    rake: 20,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD LEVEL BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 340,
    angleSpan: 20,
    rows: generateRows('A', 'S', 28, 4, 24),
    vertices3D: [
      { x: -30, y: 4, z: 55 },
      { x: -10, y: 4, z: 55 },
      { x: -5, y: 42, z: 93 },
      { x: -25, y: 42, z: 93 }
    ],
    covered: false,
    distance: 55,
    height: 4,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 20,
    angleSpan: 20,
    rows: generateRows('A', 'S', 28, 4, 24),
    vertices3D: [
      { x: 10, y: 4, z: 55 },
      { x: 30, y: 4, z: 55 },
      { x: 25, y: 42, z: 93 },
      { x: 5, y: 42, z: 93 }
    ],
    covered: false,
    distance: 55,
    height: 4,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 50,
    angleSpan: 25,
    rows: generateRows('A', 'S', 30, 4, 24),
    vertices3D: [
      { x: 55, y: 4, z: 90 },
      { x: 90, y: 4, z: 125 },
      { x: 95, y: 42, z: 163 },
      { x: 60, y: 42, z: 128 }
    ],
    covered: false,
    distance: 107,
    height: 4,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-117',
    name: 'Field Box 117',
    level: 'field',
    baseAngle: 310,
    angleSpan: 25,
    rows: generateRows('A', 'S', 30, 4, 24),
    vertices3D: [
      { x: -90, y: 4, z: 125 },
      { x: -55, y: 4, z: 90 },
      { x: -60, y: 42, z: 128 },
      { x: -95, y: 42, z: 163 }
    ],
    covered: false,
    distance: 107,
    height: 4,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== 200 LEVEL (Club Level) ==========
  {
    id: 'club-200',
    name: 'Club 200',
    level: 'club',
    baseAngle: 0,
    angleSpan: 35,
    rows: generateRows('A', 'N', 40, 28, 28),
    vertices3D: [
      { x: -55, y: 28, z: 75 },
      { x: 55, y: 28, z: 75 },
      { x: 60, y: 60, z: 107 },
      { x: -60, y: 60, z: 107 }
    ],
    covered: true,
    distance: 75,
    height: 28,
    rake: 28,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== 100 LEVEL PAVILIONS ==========
  {
    id: 'pavilion-130',
    name: 'Pavilion 130',
    level: 'lower',
    baseAngle: 75,
    angleSpan: 30,
    rows: generateRows(1, 28, 35, 8, 25),
    vertices3D: [
      { x: 100, y: 8, z: 160 },
      { x: 130, y: 8, z: 190 },
      { x: 135, y: 60, z: 242 },
      { x: 105, y: 60, z: 212 }
    ],
    covered: false,
    distance: 175,
    height: 8,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'pavilion-132',
    name: 'Pavilion 132',
    level: 'lower',
    baseAngle: 285,
    angleSpan: 30,
    rows: generateRows(1, 28, 35, 8, 25),
    vertices3D: [
      { x: -130, y: 8, z: 190 },
      { x: -100, y: 8, z: 160 },
      { x: -105, y: 60, z: 212 },
      { x: -135, y: 60, z: 242 }
    ],
    covered: false,
    distance: 175,
    height: 8,
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
    angleSpan: 70,
    rows: [
      { rowNumber: 'Suite', seats: 400, elevation: 35, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -80, y: 35, z: 90 },
      { x: 80, y: 35, z: 90 },
      { x: 85, y: 45, z: 100 },
      { x: -85, y: 45, z: 100 }
    ],
    covered: true,
    distance: 90,
    height: 35,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== BLEACHERS ==========
  {
    id: 'left-field-bleachers',
    name: 'Left Field Bleachers',
    level: 'field',
    baseAngle: 120,
    angleSpan: 35,
    rows: generateRows(1, 30, 40, 5, 22),
    vertices3D: [
      { x: 180, y: 5, z: 280 },
      { x: 220, y: 5, z: 320 },
      { x: 225, y: 55, z: 370 },
      { x: 185, y: 55, z: 330 }
    ],
    covered: false,
    distance: 300,
    height: 5,
    rake: 22,
    viewQuality: 'fair',
    price: 'value'
  },

  {
    id: 'right-field-bleachers',
    name: 'Right Field Bleachers',
    level: 'field',
    baseAngle: 60,
    angleSpan: 35,
    rows: generateRows(1, 30, 40, 5, 22),
    vertices3D: [
      { x: 220, y: 5, z: 320 },
      { x: 180, y: 5, z: 280 },
      { x: 185, y: 55, z: 330 },
      { x: 225, y: 55, z: 370 }
    ],
    covered: false,
    distance: 300,
    height: 5,
    rake: 22,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== BISON BERM ==========
  {
    id: 'bison-berm',
    name: 'Bison Berm',
    level: 'field',
    baseAngle: 180,
    angleSpan: 40,
    rows: [],
    vertices3D: [
      { x: -60, y: 3, z: 400 },
      { x: 60, y: 3, z: 400 },
      { x: 65, y: 8, z: 410 },
      { x: -65, y: 8, z: 410 }
    ],
    covered: false,
    distance: 400,
    height: 3,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY DECK ==========
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: 150, y: 18, z: 340 },
      { x: 180, y: 18, z: 370 },
      { x: 185, y: 25, z: 377 },
      { x: 155, y: 25, z: 347 }
    ],
    covered: true,
    partialCoverage: {
      type: 'full',
      coveredRows: [],
      coveragePercentage: 100
    },
    distance: 355,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== UPPER DECK RESERVED ==========
  {
    id: 'upper-deck-300',
    name: 'Upper Deck 300',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows(1, 22, 38, 45, 32),
    vertices3D: [
      { x: -45, y: 45, z: 100 },
      { x: 45, y: 45, z: 100 },
      { x: 50, y: 85, z: 140 },
      { x: -50, y: 85, z: 140 }
    ],
    covered: false,
    distance: 100,
    height: 45,
    rake: 32,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== COCA-COLA FIELD ==========
  {
    id: 'coca-cola-field',
    name: 'Coca-Cola Field',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 120, y: 10, z: 360 },
      { x: 160, y: 10, z: 400 },
      { x: 165, y: 15, z: 410 },
      { x: 125, y: 15, z: 370 }
    ],
    covered: false,
    distance: 380,
    height: 10,
    rake: 0,
    viewQuality: 'obstructed',
    price: 'value'
  }
];

// Stadium configuration
export const buffaloBisonsConfig = {
  stadiumName: 'Sahlen Field',
  team: 'Buffalo Bisons',
  parentOrg: 'Toronto Blue Jays',
  city: 'Buffalo',
  state: 'NY',
  level: 'AAA',
  capacity: 16600,
  opened: 1988,
  orientation: 315,
  dimensions: {
    leftField: 325,
    leftCenter: 371,
    centerField: 404,
    rightCenter: 367,
    rightField: 325
  },
  features: {
    largestAAACapacity: true,
    downtownBuffaloView: true,
    bisonBerm: true,
    cocaColaField: true,
    partyDeck: true,
    upperDeck: true,
    coveredSeating: 4500,
    suiteLevel: true
  }
};
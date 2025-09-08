// Durham Bulls Athletic Park - Durham Bulls (Tampa Bay Rays AAA)
// Opened: 1995
// Capacity: 10,000
// Famous for Bull Durham movie connection and Blue Monster wall

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

export const durhamBullsSections: DetailedSection[] = [
  // ========== BLUE MONSTER PAVILION ==========
  {
    id: 'blue-monster-pavilion',
    name: 'Blue Monster Pavilion',
    level: 'field',
    baseAngle: 225,
    angleSpan: 20,
    rows: generateRows(1, 8, 45, 32, 25),
    vertices3D: [
      { x: -140, y: 32, z: 305 },
      { x: -120, y: 32, z: 320 },
      { x: -125, y: 52, z: 340 },
      { x: -145, y: 52, z: 325 }
    ],
    covered: false,
    distance: 305,
    height: 32,
    rake: 25,
    viewQuality: 'excellent',
    price: 'premium'
  },

  // ========== BLUE MONSTER SEATS ==========
  {
    id: 'blue-monster-seats',
    name: 'Blue Monster Seats',
    level: 'field',
    baseAngle: 235,
    angleSpan: 15,
    rows: [
      { rowNumber: 'Monster', seats: 80, elevation: 32, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -130, y: 32, z: 305 },
      { x: -110, y: 32, z: 315 },
      { x: -110, y: 35, z: 318 },
      { x: -130, y: 35, z: 308 }
    ],
    covered: false,
    distance: 305,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'premium'
  },

  // ========== PNC TRIANGLE CLUB ==========
  {
    id: 'pnc-triangle-club',
    name: 'PNC Triangle Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'K', 35, 25, 28),
    vertices3D: [
      { x: -40, y: 25, z: 60 },
      { x: 40, y: 25, z: 60 },
      { x: 45, y: 52, z: 87 },
      { x: -45, y: 52, z: 87 }
    ],
    covered: true,
    distance: 60,
    height: 25,
    rake: 28,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== DIAMOND VIEW PAVILION ==========
  {
    id: 'diamond-view-pavilion',
    name: 'Diamond View Pavilion',
    level: 'field',
    baseAngle: 245,
    angleSpan: 25,
    rows: generateRows(1, 6, 60, 15, 22),
    vertices3D: [
      { x: -150, y: 15, z: 320 },
      { x: -120, y: 15, z: 340 },
      { x: -125, y: 28, z: 353 },
      { x: -155, y: 28, z: 333 }
    ],
    covered: false,
    distance: 330,
    height: 15,
    rake: 22,
    viewQuality: 'good',
    price: 'moderate'
  },

  // ========== COVERED SEATING - HOME PLATE ==========
  {
    id: 'covered-home-plate',
    name: 'Covered Home Plate',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows('A', 'T', 28, 8, 26),
    vertices3D: [
      { x: -35, y: 8, z: 50 },
      { x: 35, y: 8, z: 50 },
      { x: 40, y: 58, z: 100 },
      { x: -40, y: 58, z: 100 }
    ],
    covered: true,
    partialCoverage: {
      type: 'full',
      coveredRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      coveragePercentage: 100
    },
    distance: 50,
    height: 8,
    rake: 26,
    viewQuality: 'excellent',
    price: 'premium'
  },

  // ========== FIRST BASE LINE ==========
  {
    id: 'first-base-line',
    name: 'First Base Line',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'U', 26, 8, 24),
    vertices3D: [
      { x: 40, y: 8, z: 60 },
      { x: 100, y: 8, z: 100 },
      { x: 105, y: 60, z: 152 },
      { x: 45, y: 60, z: 112 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      coveragePercentage: 35
    },
    distance: 80,
    height: 8,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== THIRD BASE LINE ==========
  {
    id: 'third-base-line',
    name: 'Third Base Line',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'U', 26, 8, 24),
    vertices3D: [
      { x: -40, y: 8, z: 60 },
      { x: -100, y: 8, z: 100 },
      { x: -105, y: 60, z: 152 },
      { x: -45, y: 60, z: 112 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      coveragePercentage: 35
    },
    distance: 80,
    height: 8,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== LUXURY SUITES ==========
  {
    id: 'luxury-suites',
    name: 'Luxury Suites',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 60,
    rows: [
      { rowNumber: 'Suite', seats: 200, elevation: 35, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -60, y: 35, z: 80 },
      { x: 60, y: 35, z: 80 },
      { x: 65, y: 45, z: 90 },
      { x: -65, y: 45, z: 90 }
    ],
    covered: true,
    distance: 80,
    height: 35,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== RIGHT FIELD PAVILION ==========
  {
    id: 'right-field-pavilion',
    name: 'Right Field Pavilion',
    level: 'field',
    baseAngle: 90,
    angleSpan: 25,
    rows: generateRows(1, 12, 35, 10, 20),
    vertices3D: [
      { x: 120, y: 10, z: 280 },
      { x: 150, y: 10, z: 310 },
      { x: 155, y: 34, z: 334 },
      { x: 125, y: 34, z: 304 }
    ],
    covered: false,
    distance: 295,
    height: 10,
    rake: 20,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== LEFT FIELD CORNER ==========
  {
    id: 'left-field-corner',
    name: 'Left Field Corner',
    level: 'field',
    baseAngle: 270,
    angleSpan: 20,
    rows: generateRows(1, 10, 30, 10, 20),
    vertices3D: [
      { x: -150, y: 10, z: 280 },
      { x: -120, y: 10, z: 300 },
      { x: -125, y: 30, z: 320 },
      { x: -155, y: 30, z: 300 }
    ],
    covered: false,
    distance: 290,
    height: 10,
    rake: 20,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== UPPER DECK - HOME ==========
  {
    id: 'upper-deck-home',
    name: 'Upper Deck Home',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'M', 32, 45, 32),
    vertices3D: [
      { x: -30, y: 45, z: 90 },
      { x: 30, y: 45, z: 90 },
      { x: 35, y: 76, z: 121 },
      { x: -35, y: 76, z: 121 }
    ],
    covered: false,
    distance: 90,
    height: 45,
    rake: 32,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SNORTING BULL PLAZA ==========
  {
    id: 'snorting-bull-plaza',
    name: 'Snorting Bull Plaza',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -40, y: 15, z: 380 },
      { x: 40, y: 15, z: 380 },
      { x: 45, y: 20, z: 390 },
      { x: -45, y: 20, z: 390 }
    ],
    covered: false,
    distance: 380,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY DECK ==========
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'field',
    baseAngle: 135,
    angleSpan: 20,
    rows: [
      { rowNumber: 'Deck', seats: 100, elevation: 18, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 90, y: 18, z: 340 },
      { x: 120, y: 18, z: 360 },
      { x: 125, y: 25, z: 367 },
      { x: 95, y: 25, z: 347 }
    ],
    covered: false,
    distance: 350,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PICNIC AREA ==========
  {
    id: 'picnic-area',
    name: 'Picnic Area',
    level: 'field',
    baseAngle: 60,
    angleSpan: 15,
    rows: [
      { rowNumber: 'Picnic', seats: 80, elevation: 12, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 80, y: 12, z: 320 },
      { x: 100, y: 12, z: 335 },
      { x: 105, y: 18, z: 341 },
      { x: 85, y: 18, z: 326 }
    ],
    covered: false,
    distance: 327,
    height: 12,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== 360 CONCOURSE SEATING ==========
  {
    id: 'concourse-360',
    name: '360 Concourse Seating',
    level: 'lower',
    baseAngle: 180,
    angleSpan: 180,
    rows: [
      { rowNumber: 'SRO', seats: 300, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -100, y: 20, z: 350 },
      { x: 100, y: 20, z: 350 },
      { x: 105, y: 25, z: 360 },
      { x: -105, y: 25, z: 360 }
    ],
    covered: false,
    distance: 350,
    height: 20,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const durhamBullsConfig = {
  stadiumName: 'Durham Bulls Athletic Park',
  team: 'Durham Bulls',
  parentOrg: 'Tampa Bay Rays',
  city: 'Durham',
  state: 'NC',
  level: 'AAA',
  capacity: 10000,
  opened: 1995,
  orientation: 45,
  dimensions: {
    leftField: 305,
    leftCenter: 370,
    centerField: 409,
    rightCenter: 370,
    rightField: 327
  },
  features: {
    blueMonster: true,
    blueMonsterHeight: 32,
    bullDurhamConnection: true,
    snortingBull: true,
    covered360Concourse: true,
    coveredSeating: 2500,
    manualScoreboard: true
  }
};
// Truist Field - Charlotte Knights (Chicago White Sox AAA)
// Opened: 2014
// Capacity: 10,200
// Known for downtown skyline views and rooftop seating

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

export const charlotteKnightsSections: DetailedSection[] = [
  // ========== DUGOUT SUITES ==========
  {
    id: 'dugout-suite-home',
    name: 'Home Dugout Suite',
    level: 'field',
    baseAngle: 340,
    angleSpan: 20,
    rows: generateRows('A', 'F', 25, 0, 20),
    vertices3D: [
      { x: -45, y: 0, z: 45 },
      { x: -25, y: 0, z: 45 },
      { x: -20, y: 15, z: 58 },
      { x: -40, y: 15, z: 58 }
    ],
    covered: false,
    distance: 45,
    height: 0,
    rake: 20,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  {
    id: 'dugout-suite-visitor',
    name: 'Visitor Dugout Suite',
    level: 'field',
    baseAngle: 20,
    angleSpan: 20,
    rows: generateRows('A', 'F', 25, 0, 20),
    vertices3D: [
      { x: 25, y: 0, z: 45 },
      { x: 45, y: 0, z: 45 },
      { x: 40, y: 15, z: 58 },
      { x: 20, y: 15, z: 58 }
    ],
    covered: false,
    distance: 45,
    height: 0,
    rake: 20,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== KNIGHTS LANDING (Premium Club) ==========
  {
    id: 'knights-landing',
    name: 'Knights Landing',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'M', 40, 25, 28),
    vertices3D: [
      { x: -45, y: 25, z: 65 },
      { x: 45, y: 25, z: 65 },
      { x: 50, y: 55, z: 95 },
      { x: -50, y: 55, z: 95 }
    ],
    covered: true,
    distance: 65,
    height: 25,
    rake: 28,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== ROOFTOP SEATING ==========
  {
    id: 'rooftop-home-run-porch',
    name: 'Home Run Porch Rooftop',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 25,
    rows: generateRows(1, 10, 50, 38, 25),
    vertices3D: [
      { x: 120, y: 38, z: 250 },
      { x: 150, y: 38, z: 280 },
      { x: 155, y: 60, z: 302 },
      { x: 125, y: 60, z: 272 }
    ],
    covered: false,
    distance: 265,
    height: 38,
    rake: 25,
    viewQuality: 'good',
    price: 'premium'
  },

  {
    id: 'rooftop-party-deck',
    name: 'Rooftop Party Deck',
    level: 'upper',
    baseAngle: 115,
    angleSpan: 20,
    rows: [
      { rowNumber: 'Deck', seats: 150, elevation: 38, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 160, y: 38, z: 290 },
      { x: 180, y: 38, z: 310 },
      { x: 185, y: 45, z: 317 },
      { x: 165, y: 45, z: 297 }
    ],
    covered: false,
    distance: 300,
    height: 38,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'P', 22, 5, 22),
    vertices3D: [
      { x: -20, y: 5, z: 50 },
      { x: 20, y: 5, z: 50 },
      { x: 25, y: 35, z: 80 },
      { x: -25, y: 35, z: 80 }
    ],
    covered: false,
    distance: 50,
    height: 5,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 45,
    angleSpan: 22,
    rows: generateRows('A', 'P', 24, 5, 22),
    vertices3D: [
      { x: 50, y: 5, z: 80 },
      { x: 80, y: 5, z: 110 },
      { x: 85, y: 35, z: 140 },
      { x: 55, y: 35, z: 110 }
    ],
    covered: false,
    distance: 95,
    height: 5,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 315,
    angleSpan: 22,
    rows: generateRows('A', 'P', 24, 5, 22),
    vertices3D: [
      { x: -80, y: 5, z: 110 },
      { x: -50, y: 5, z: 80 },
      { x: -55, y: 35, z: 110 },
      { x: -85, y: 35, z: 140 }
    ],
    covered: false,
    distance: 95,
    height: 5,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== LOWER RESERVED ==========
  {
    id: 'lower-reserved-200',
    name: 'Lower Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows(1, 24, 28, 12, 24),
    vertices3D: [
      { x: -30, y: 12, z: 70 },
      { x: 30, y: 12, z: 70 },
      { x: 35, y: 50, z: 108 },
      { x: -35, y: 50, z: 108 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      coveragePercentage: 42
    },
    distance: 70,
    height: 12,
    rake: 24,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'lower-reserved-210',
    name: 'Lower Reserved 210',
    level: 'lower',
    baseAngle: 55,
    angleSpan: 20,
    rows: generateRows(1, 24, 26, 12, 24),
    vertices3D: [
      { x: 70, y: 12, z: 120 },
      { x: 100, y: 12, z: 150 },
      { x: 105, y: 50, z: 188 },
      { x: 75, y: 50, z: 158 }
    ],
    covered: false,
    distance: 135,
    height: 12,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'lower-reserved-215',
    name: 'Lower Reserved 215',
    level: 'lower',
    baseAngle: 305,
    angleSpan: 20,
    rows: generateRows(1, 24, 26, 12, 24),
    vertices3D: [
      { x: -100, y: 12, z: 150 },
      { x: -70, y: 12, z: 120 },
      { x: -75, y: 50, z: 158 },
      { x: -105, y: 50, z: 188 }
    ],
    covered: false,
    distance: 135,
    height: 12,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== OUTFIELD PAVILIONS ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 270,
    angleSpan: 25,
    rows: generateRows(1, 15, 35, 8, 20),
    vertices3D: [
      { x: -150, y: 8, z: 250 },
      { x: -120, y: 8, z: 280 },
      { x: -125, y: 30, z: 302 },
      { x: -155, y: 30, z: 272 }
    ],
    covered: false,
    distance: 265,
    height: 8,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  {
    id: 'center-field-plaza',
    name: 'Center Field Plaza',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -50, y: 15, z: 380 },
      { x: 50, y: 15, z: 380 },
      { x: 55, y: 20, z: 390 },
      { x: -55, y: 20, z: 390 }
    ],
    covered: false,
    distance: 380,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== SKYLINE VIEW DECK ==========
  {
    id: 'skyline-view-deck',
    name: 'Skyline View Deck',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: generateRows(1, 8, 40, 32, 22),
    vertices3D: [
      { x: 100, y: 32, z: 320 },
      { x: 140, y: 32, z: 360 },
      { x: 145, y: 48, z: 376 },
      { x: 105, y: 48, z: 336 }
    ],
    covered: false,
    distance: 340,
    height: 32,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== SUITES LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 60,
    rows: [
      { rowNumber: 'Suite', seats: 250, elevation: 30, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -70, y: 30, z: 85 },
      { x: 70, y: 30, z: 85 },
      { x: 75, y: 40, z: 95 },
      { x: -75, y: 40, z: 95 }
    ],
    covered: true,
    distance: 85,
    height: 30,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  }
];

// Stadium configuration
export const charlotteKnightsConfig = {
  stadiumName: 'Truist Field',
  team: 'Charlotte Knights',
  parentOrg: 'Chicago White Sox',
  city: 'Charlotte',
  state: 'NC',
  level: 'AAA',
  capacity: 10200,
  opened: 2014,
  orientation: 315,
  dimensions: {
    leftField: 325,
    leftCenter: 375,
    centerField: 400,
    rightCenter: 375,
    rightField: 315
  },
  features: {
    downtownSkylineView: true,
    rooftopSeating: true,
    knightsLanding: true,
    dugoutSuites: true,
    skylineViewDeck: true,
    partialRoof: true,
    coveredSeating: 3000
  }
};
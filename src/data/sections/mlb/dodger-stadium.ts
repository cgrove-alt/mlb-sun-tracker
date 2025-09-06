// Dodger Stadium - Complete Section Data with 3D Geometry
// Los Angeles, CA - Opened 1962 - Capacity 56,000
// Home of the Los Angeles Dodgers

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  
  const isLetterRows = typeof startRow === 'string';
  
  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);
    
    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Dodger Stadium Sections
export const dodgerStadiumSections: DetailedSection[] = [
  // ========== FIELD LEVEL ==========
  {
    id: '1FD',
    name: 'Field Level 1',
    level: 'field',
    baseAngle: 0,
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -15, y: 65, z: 0 },
      { x: 0, y: 65, z: 0 },
      { x: 0, y: 95, z: 16 },
      { x: -15, y: 95, z: 16 }
    ],
    covered: false,
    price: 'premium',
    distance: 80,
    height: 0,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '15FD',
    name: 'Field Level 15',
    level: 'field',
    baseAngle: 45,
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: 65, y: 65, z: 0 },
      { x: 80, y: 80, z: 0 },
      { x: 95, y: 95, z: 16 },
      { x: 80, y: 80, z: 16 }
    ],
    covered: false,
    price: 'premium',
    distance: 92,
    height: 0,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== LOGE LEVEL ==========
  {
    id: '101LG',
    name: 'Loge Level 101',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows('A', 'U', 24, 25, 24, false),
    vertices3D: [
      { x: -20, y: 100, z: 25 },
      { x: 0, y: 100, z: 25 },
      { x: 0, y: 140, z: 48 },
      { x: -20, y: 140, z: 48 }
    ],
    covered: false,
    price: 'moderate',
    distance: 120,
    height: 25,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '135LG',
    name: 'Loge Level 135',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows('A', 'U', 24, 25, 24, false),
    vertices3D: [
      { x: 100, y: 0, z: 25 },
      { x: 100, y: 20, z: 25 },
      { x: 140, y: 20, z: 48 },
      { x: 140, y: 0, z: 48 }
    ],
    covered: false,
    price: 'moderate',
    distance: 120,
    height: 25,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'C1',
    name: 'Club Level 1',
    level: 'club',
    baseAngle: 0,
    angleSpan: 12,
    rows: generateRows('A', 'M', 18, 48, 22, true),
    vertices3D: [
      { x: -25, y: 140, z: 48 },
      { x: 0, y: 140, z: 48 },
      { x: 0, y: 170, z: 65 },
      { x: -25, y: 170, z: 65 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['H', 'I', 'J', 'K', 'L', 'M'],
      coveragePercentage: 46,
      overhangDepth: 20,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'luxury',
    distance: 155,
    height: 48,
    rake: 22,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 6,
      aisleSeats: true,
      tunnelAccess: ['Club Entrance North', 'Club Entrance South']
    }
  },

  // ========== RESERVE LEVEL ==========
  {
    id: '1RS',
    name: 'Reserve Level 1',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 11,
    rows: generateRows(1, 38, 26, 65, 28, true),
    vertices3D: [
      { x: -30, y: 170, z: 65 },
      { x: -10, y: 170, z: 65 },
      { x: -5, y: 230, z: 115 },
      { x: -25, y: 230, z: 115 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
      coveragePercentage: 50,
      overhangDepth: 30,
      overhangHeight: 28,
      material: 'solid'
    },
    price: 'value',
    distance: 200,
    height: 65,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '25RS',
    name: 'Reserve Level 25',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 11,
    rows: generateRows(1, 38, 26, 65, 28, true),
    vertices3D: [
      { x: 170, y: 30, z: 65 },
      { x: 170, y: 10, z: 65 },
      { x: 230, y: 5, z: 115 },
      { x: 230, y: 25, z: 115 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
      coveragePercentage: 50,
      overhangDepth: 30,
      overhangHeight: 28,
      material: 'solid'
    },
    price: 'value',
    distance: 200,
    height: 65,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== TOP DECK ==========
  {
    id: '1TD',
    name: 'Top Deck 1',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 12,
    rows: generateRows(1, 16, 28, 115, 32, true),
    vertices3D: [
      { x: -35, y: 230, z: 115 },
      { x: -15, y: 230, z: 115 },
      { x: -10, y: 270, z: 145 },
      { x: -30, y: 270, z: 145 }
    ],
    covered: true,
    price: 'value',
    distance: 250,
    height: 115,
    rake: 32,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== PAVILIONS ==========
  {
    id: 'LFP',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 225,
    angleSpan: 20,
    rows: generateRows(1, 30, 30, 8, 22, false),
    vertices3D: [
      { x: -180, y: 280, z: 8 },
      { x: -140, y: 320, z: 8 },
      { x: -130, y: 350, z: 35 },
      { x: -170, y: 310, z: 35 }
    ],
    covered: false,
    price: 'value',
    distance: 330,
    height: 8,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: 'RFP',
    name: 'Right Field Pavilion',
    level: 'field',
    baseAngle: 135,
    angleSpan: 20,
    rows: generateRows(1, 30, 30, 8, 22, false),
    vertices3D: [
      { x: 180, y: 280, z: 8 },
      { x: 140, y: 320, z: 8 },
      { x: 130, y: 350, z: 35 },
      { x: 170, y: 310, z: 35 }
    ],
    covered: false,
    price: 'value',
    distance: 330,
    height: 8,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== BASELINE CLUB ==========
  {
    id: 'BC1',
    name: 'Baseline Club 1',
    level: 'club',
    baseAngle: 45,
    angleSpan: 8,
    rows: generateRows('A', 'J', 16, 30, 18, true),
    vertices3D: [
      { x: 80, y: 80, z: 30 },
      { x: 95, y: 65, z: 30 },
      { x: 105, y: 75, z: 42 },
      { x: 90, y: 90, z: 42 }
    ],
    covered: true,
    price: 'luxury',
    distance: 113,
    height: 30,
    rake: 18,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  {
    id: 'BC3',
    name: 'Baseline Club 3',
    level: 'club',
    baseAngle: 315,
    angleSpan: 8,
    rows: generateRows('A', 'J', 16, 30, 18, true),
    vertices3D: [
      { x: -80, y: 80, z: 30 },
      { x: -95, y: 65, z: 30 },
      { x: -105, y: 75, z: 42 },
      { x: -90, y: 90, z: 42 }
    ],
    covered: true,
    price: 'luxury',
    distance: 113,
    height: 30,
    rake: 18,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== DUGOUT CLUB ==========
  {
    id: 'DG1',
    name: 'Dugout Club 1',
    level: 'field',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows('A', 'D', 12, -3, 15, false), // Below field level
    vertices3D: [
      { x: -10, y: 50, z: -3 },
      { x: 0, y: 50, z: -3 },
      { x: 0, y: 60, z: 2 },
      { x: -10, y: 60, z: 2 }
    ],
    covered: false,
    price: 'luxury',
    distance: 55,
    height: -3,
    rake: 15,
    seatWidth: 24,
    rowSpacing: 40,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Dugout Club Entrance']
    }
  }
];

// Calculate total capacity
export const dodgerStadiumCapacity = dodgerStadiumSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const dodgerStadiumSectionMap = new Map(
  dodgerStadiumSections.map(section => [section.id, section])
);

// Stadium-specific features
export const dodgerStadiumFeatures = {
  wavinRows: {
    location: 'pavilions',
    capacity: 1800,
    allYouCanEat: true
  },
  topDeck: {
    elevation: 115, // feet
    views: 'spectacular',
    sunsetViews: true
  },
  hexagonalScoreboard: {
    year: 1980,
    type: 'video',
    iconic: true
  },
  parking: {
    terraced: true,
    levels: 16,
    colorCoded: true
  },
  chavezRavine: {
    builtInto: 'hillside',
    uniqueConstruction: true
  }
};
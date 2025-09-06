// Wrigley Field - Complete Section Data with 3D Geometry
// Chicago, IL - Opened 1914 - Capacity 41,649
// Home of the Chicago Cubs

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
        overhangHeight: covered ? 28 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 28 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Wrigley Field Sections
export const wrigleyFieldSections: DetailedSection[] = [
  // ========== FIELD BOX ==========
  {
    id: '14',
    name: 'Field Box 14',
    level: 'field',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 19, false),
    vertices3D: [
      { x: -12, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 85, z: 14 },
      { x: -12, y: 85, z: 14 }
    ],
    covered: false,
    price: 'premium',
    distance: 72,
    height: 0,
    rake: 19,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'excellent'
  },

  {
    id: '108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 45,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 19, false),
    vertices3D: [
      { x: 58, y: 58, z: 0 },
      { x: 70, y: 70, z: 0 },
      { x: 85, y: 85, z: 14 },
      { x: 73, y: 73, z: 14 }
    ],
    covered: false,
    price: 'premium',
    distance: 82,
    height: 0,
    rake: 19,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'excellent'
  },

  // ========== LOWER BOX ==========
  {
    id: '214',
    name: 'Lower Box 214',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 9,
    rows: generateRows(1, 35, 22, 14, 23, false),
    vertices3D: [
      { x: -18, y: 85, z: 14 },
      { x: -5, y: 85, z: 14 },
      { x: -5, y: 125, z: 38 },
      { x: -18, y: 125, z: 38 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 14,
    rake: 23,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '238',
    name: 'Lower Box 238',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 9,
    rows: generateRows(1, 35, 22, 14, 23, false),
    vertices3D: [
      { x: 85, y: 18, z: 14 },
      { x: 85, y: 5, z: 14 },
      { x: 125, y: 5, z: 38 },
      { x: 125, y: 18, z: 38 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 14,
    rake: 23,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  // ========== BLEACHERS ==========
  {
    id: 'BL501',
    name: 'Bleachers 501',
    level: 'field',
    baseAngle: 225, // Left field
    angleSpan: 15,
    rows: generateRows(1, 32, 26, 6, 21, false),
    vertices3D: [
      { x: -150, y: 320, z: 6 },
      { x: -120, y: 340, z: 6 },
      { x: -110, y: 370, z: 32 },
      { x: -140, y: 350, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 355,
    height: 6,
    rake: 21,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: 'BL505',
    name: 'Bleachers 505',
    level: 'field',
    baseAngle: 180, // Center field
    angleSpan: 15,
    rows: generateRows(1, 32, 26, 6, 21, false),
    vertices3D: [
      { x: -30, y: 380, z: 6 },
      { x: 0, y: 380, z: 6 },
      { x: 0, y: 410, z: 32 },
      { x: -30, y: 410, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 395,
    height: 6,
    rake: 21,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: 'BL509',
    name: 'Bleachers 509',
    level: 'field',
    baseAngle: 135, // Right field
    angleSpan: 15,
    rows: generateRows(1, 32, 26, 6, 21, false),
    vertices3D: [
      { x: 150, y: 320, z: 6 },
      { x: 120, y: 340, z: 6 },
      { x: 110, y: 370, z: 32 },
      { x: 140, y: 350, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 353,
    height: 6,
    rake: 21,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== UPPER DECK ==========
  {
    id: '414',
    name: 'Upper Deck 414',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows(1, 25, 24, 38, 28, true),
    vertices3D: [
      { x: -25, y: 125, z: 38 },
      { x: -10, y: 125, z: 38 },
      { x: -8, y: 165, z: 65 },
      { x: -23, y: 165, z: 65 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      coveragePercentage: 56,
      overhangDepth: 22,
      overhangHeight: 20,
      material: 'solid'
    },
    price: 'value',
    distance: 145,
    height: 38,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 29,
    viewQuality: 'good'
  },

  {
    id: '424',
    name: 'Upper Deck 424',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows(1, 25, 24, 38, 28, true),
    vertices3D: [
      { x: 125, y: 125, z: 38 },
      { x: 140, y: 110, z: 38 },
      { x: 165, y: 135, z: 65 },
      { x: 150, y: 150, z: 65 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      coveragePercentage: 56,
      overhangDepth: 22,
      overhangHeight: 20,
      material: 'solid'
    },
    price: 'value',
    distance: 145,
    height: 38,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 29,
    viewQuality: 'good'
  },

  // ========== CLUB BOX ==========
  {
    id: 'CB18',
    name: 'Club Box 18',
    level: 'club',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows('A', 'L', 16, 20, 18, true),
    vertices3D: [
      { x: -20, y: 95, z: 20 },
      { x: -8, y: 95, z: 20 },
      { x: -8, y: 115, z: 30 },
      { x: -20, y: 115, z: 30 }
    ],
    covered: true,
    price: 'luxury',
    distance: 105,
    height: 20,
    rake: 18,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Club Entrance']
    }
  },

  // ========== CATALINA CLUB ==========
  {
    id: 'CAT',
    name: 'Catalina Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 15,
    rows: [], // Open seating area
    vertices3D: [
      { x: -25, y: 105, z: 25 },
      { x: 25, y: 105, z: 25 },
      { x: 25, y: 125, z: 25 },
      { x: -25, y: 125, z: 25 }
    ],
    covered: true,
    price: 'luxury',
    distance: 115,
    height: 25,
    rake: 0,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 0,
      aisleSeats: false,
      tunnelAccess: ['Catalina Club Entrance']
    }
  },

  // ========== GALLAGHER WAY (Rooftop-style) ==========
  {
    id: 'GW1',
    name: 'Gallagher Way Deck',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 20,
    rows: [], // Standing room
    vertices3D: [
      { x: -40, y: 420, z: 35 },
      { x: 40, y: 420, z: 35 },
      { x: 40, y: 440, z: 35 },
      { x: -40, y: 440, z: 35 }
    ],
    covered: false,
    price: 'moderate',
    distance: 430,
    height: 35,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== W CLUB ==========
  {
    id: 'W1',
    name: 'W Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 10,
    rows: generateRows('A', 'H', 14, 22, 16, true),
    vertices3D: [
      { x: -70, y: 70, z: 22 },
      { x: -58, y: 58, z: 22 },
      { x: -65, y: 65, z: 30 },
      { x: -77, y: 77, z: 30 }
    ],
    covered: true,
    price: 'luxury',
    distance: 99,
    height: 22,
    rake: 16,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== AMERICAN AIRLINES 1914 CLUB ==========
  {
    id: 'AA1914',
    name: 'American Airlines 1914 Club',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 24, elevation: 30, depth: 0, covered: true, overhangHeight: 15 }
    ],
    vertices3D: [
      { x: -20, y: 110, z: 30 },
      { x: 20, y: 110, z: 30 },
      { x: 20, y: 130, z: 30 },
      { x: -20, y: 130, z: 30 }
    ],
    covered: true,
    price: 'luxury',
    distance: 120,
    height: 30,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 24,
      aisleSeats: false,
      tunnelAccess: ['Premium Entrance']
    }
  },

  // ========== BUDWEISER BLEACHERS ==========
  {
    id: 'BUD',
    name: 'Budweiser Bleachers',
    level: 'field',
    baseAngle: 160,
    angleSpan: 12,
    rows: generateRows(1, 28, 28, 8, 20, false),
    vertices3D: [
      { x: 90, y: 350, z: 8 },
      { x: 120, y: 330, z: 8 },
      { x: 130, y: 360, z: 30 },
      { x: 100, y: 380, z: 30 }
    ],
    covered: false,
    price: 'value',
    distance: 368,
    height: 8,
    rake: 20,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const wrigleyFieldCapacity = wrigleyFieldSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const wrigleyFieldSectionMap = new Map(
  wrigleyFieldSections.map(section => [section.id, section])
);

// Stadium-specific features
export const wrigleyFieldFeatures = {
  ivyWalls: {
    material: 'boston_ivy',
    planted: 1937,
    height: 11.5,
    greenSeason: 'April-October',
    dormantSeason: 'November-March'
  },
  manualScoreboard: {
    installed: 1937,
    height: 27,
    width: 35,
    centerField: true,
    manuallyOperated: true
  },
  rooftops: {
    buildings: 11,
    capacity: 3000,
    revenue_sharing: true,
    unique_viewing: true
  },
  marquee: {
    installed: 1934,
    iconic: true,
    color: 'red',
    manual_letters: true
  },
  windPatterns: {
    lakeMichigan: true,
    dayGame: 'blowing_out',
    nightGame: 'blowing_in',
    significant_impact: true
  }
};
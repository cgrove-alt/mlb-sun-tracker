// Las Vegas Ballpark - Complete Section Data with 3D Geometry
// Summerlin, NV - Opened 2019 - Capacity 8,196
// Triple-A Affiliate of Oakland Athletics

import { DetailedSection, Vector3D, RowDetail } from '../../../../types/stadium-complete';

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
  const rowHeight = 2.3; // feet between rows
  const rowDepth = 2.6; // feet front to back
  
  // Handle letter rows (A, B, C) or numeric rows
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
        overhangHeight: covered ? 22 - (rowNum * 0.4) : undefined
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
        overhangHeight: covered ? 22 - (rowNum * 0.4) : undefined
      });
    }
  }
  
  return rows;
}

// Las Vegas Ballpark Sections
export const lasVegasBallparkSections: DetailedSection[] = [
  // ========== DUGOUT CLUB (Premium Field Level) ==========
  {
    id: 'DC1',
    name: 'Dugout Club 1',
    level: 'field',
    baseAngle: 340,
    angleSpan: 10,
    rows: generateRows('A', 'H', 16, 0, 20, false),
    vertices3D: [
      { x: -25, y: 50, z: 0 },
      { x: -15, y: 50, z: 0 },
      { x: -15, y: 70, z: 14 },
      { x: -25, y: 70, z: 14 }
    ],
    covered: false,
    price: 'luxury',
    distance: 55,
    height: 0,
    rake: 20,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 2,
      aisleSeats: true,
      tunnelAccess: ['DC Entrance']
    }
  },

  {
    id: 'DC2',
    name: 'Dugout Club 2',
    level: 'field',
    baseAngle: 350,
    angleSpan: 10,
    rows: generateRows('A', 'H', 16, 0, 20, false),
    vertices3D: [
      { x: -15, y: 50, z: 0 },
      { x: -5, y: 50, z: 0 },
      { x: -5, y: 70, z: 14 },
      { x: -15, y: 70, z: 14 }
    ],
    covered: false,
    price: 'luxury',
    distance: 55,
    height: 0,
    rake: 20,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent'
  },

  {
    id: 'DC3',
    name: 'Dugout Club 3',
    level: 'field',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows('A', 'H', 16, 0, 20, false),
    vertices3D: [
      { x: -5, y: 50, z: 0 },
      { x: 5, y: 50, z: 0 },
      { x: 5, y: 70, z: 14 },
      { x: -5, y: 70, z: 14 }
    ],
    covered: false,
    price: 'luxury',
    distance: 55,
    height: 0,
    rake: 20,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent'
  },

  // ========== FIELD BOXES (Premium Baseline) ==========
  {
    id: 'FB101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 30,
    angleSpan: 12,
    rows: generateRows(1, 14, 18, 0, 22, false),
    vertices3D: [
      { x: 25, y: 60, z: 0 },
      { x: 40, y: 70, z: 0 },
      { x: 45, y: 90, z: 25 },
      { x: 30, y: 80, z: 25 }
    ],
    covered: false,
    price: 'premium',
    distance: 70,
    height: 0,
    rake: 22,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'excellent'
  },

  {
    id: 'FB109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 315,
    angleSpan: 12,
    rows: generateRows(1, 14, 18, 0, 22, false),
    vertices3D: [
      { x: -40, y: 70, z: 0 },
      { x: -25, y: 60, z: 0 },
      { x: -30, y: 80, z: 25 },
      { x: -45, y: 90, z: 25 }
    ],
    covered: false,
    price: 'premium',
    distance: 70,
    height: 0,
    rake: 22,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'excellent'
  },

  // ========== PLAZA LEVEL (Main Concourse) ==========
  {
    id: 'PL201',
    name: 'Plaza 201',
    level: 'lower',
    baseAngle: 340,
    angleSpan: 20,
    rows: [
      ...generateRows(1, 10, 20, 18, 26, false),
      ...generateRows(11, 18, 20, 38, 26, true) // Back rows covered
    ],
    vertices3D: [
      { x: -35, y: 85, z: 18 },
      { x: -15, y: 85, z: 18 },
      { x: -10, y: 115, z: 48 },
      { x: -30, y: 115, z: 48 }
    ],
    covered: false,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['11', '12', '13', '14', '15', '16', '17', '18'],
      coveragePercentage: 44,
      overhangDepth: 20,
      overhangHeight: 18,
      material: 'solid'
    },
    price: 'moderate',
    distance: 100,
    height: 18,
    rake: 26,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: 'PL202',
    name: 'Plaza 202',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 20,
    rows: [
      ...generateRows(1, 10, 20, 18, 26, false),
      ...generateRows(11, 18, 20, 38, 26, true)
    ],
    vertices3D: [
      { x: -15, y: 85, z: 18 },
      { x: 5, y: 85, z: 18 },
      { x: 10, y: 115, z: 48 },
      { x: -10, y: 115, z: 48 }
    ],
    covered: false,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['11', '12', '13', '14', '15', '16', '17', '18'],
      coveragePercentage: 44,
      overhangDepth: 20,
      overhangHeight: 18,
      material: 'solid'
    },
    price: 'moderate',
    distance: 100,
    height: 18,
    rake: 26,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== PAVILION (Outfield) ==========
  {
    id: 'PAV301',
    name: 'Left Field Pavilion',
    level: 'lower',
    baseAngle: 120,
    angleSpan: 30,
    rows: generateRows(1, 22, 28, 12, 24, false),
    vertices3D: [
      { x: 200, y: 180, z: 12 },
      { x: 250, y: 150, z: 12 },
      { x: 260, y: 180, z: 42 },
      { x: 210, y: 210, z: 42 }
    ],
    covered: false,
    price: 'value',
    distance: 320,
    height: 12,
    rake: 24,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  {
    id: 'PAV302',
    name: 'Center Field Pavilion',
    level: 'lower',
    baseAngle: 165,
    angleSpan: 30,
    rows: generateRows(1, 22, 30, 12, 24, false),
    vertices3D: [
      { x: 280, y: 100, z: 12 },
      { x: 280, y: -100, z: 12 },
      { x: 310, y: -100, z: 42 },
      { x: 310, y: 100, z: 42 }
    ],
    covered: false,
    price: 'value',
    distance: 380,
    height: 12,
    rake: 24,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== POOL BEYOND (Unique Feature) ==========
  {
    id: 'POOL',
    name: 'Pool Beyond',
    level: 'standing',
    baseAngle: 195,
    angleSpan: 30,
    rows: [], // Pool area, no traditional seating
    vertices3D: [
      { x: 320, y: -50, z: 15 },
      { x: 350, y: -50, z: 15 },
      { x: 350, y: 50, z: 15 },
      { x: 320, y: 50, z: 15 }
    ],
    covered: false,
    price: 'premium',
    distance: 400,
    height: 15,
    rake: 0,
    viewQuality: 'obstructed',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 0,
      aisleSeats: false,
      tunnelAccess: ['Pool Entrance']
    }
  },

  // ========== PARTY DECK (Right Field) ==========
  {
    id: 'PARTY',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: 45,
    angleSpan: 20,
    rows: [], // Standing room with drink rails
    vertices3D: [
      { x: 180, y: 200, z: 25 },
      { x: 220, y: 180, z: 25 },
      { x: 230, y: 200, z: 25 },
      { x: 190, y: 220, z: 25 }
    ],
    covered: true,
    partialCoverage: {
      type: 'full',
      coveredRows: [],
      coveragePercentage: 100,
      overhangDepth: 30,
      overhangHeight: 12,
      material: 'fabric'
    },
    price: 'premium',
    distance: 280,
    height: 25,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== CLUB LEVEL (Upper Concourse) ==========
  {
    id: 'CL401',
    name: 'Club Level 401',
    level: 'club',
    baseAngle: 350,
    angleSpan: 20,
    rows: generateRows('A', 'L', 16, 48, 28, true),
    vertices3D: [
      { x: -30, y: 115, z: 48 },
      { x: -10, y: 115, z: 48 },
      { x: -5, y: 145, z: 72 },
      { x: -25, y: 145, z: 72 }
    ],
    covered: true,
    price: 'premium',
    distance: 130,
    height: 48,
    rake: 28,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'good',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Club Entrance']
    }
  }
];

// Calculate total capacity
export const lasVegasBallparkCapacity = lasVegasBallparkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const lasVegasBallparkSectionMap = new Map(
  lasVegasBallparkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const lasVegasBallparkFeatures = {
  pool: {
    location: 'center_field',
    capacity: 40,
    affectsSections: ['POOL'],
    castsShadow: false
  },
  partyDeck: {
    location: 'right_field',
    covered: true,
    capacity: 100,
    sections: ['PARTY']
  },
  clubLevel: {
    fullyEnclosed: false,
    airConditioned: true,
    sections: ['CL401', 'CL402', 'CL403']
  },
  mesh_netting: {
    extends_to: 'foul_poles',
    height: 30,
    affectsSections: ['DC1', 'DC2', 'DC3', 'FB101', 'FB109']
  }
};
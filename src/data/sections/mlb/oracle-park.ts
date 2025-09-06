// Oracle Park - Complete Section Data with 3D Geometry
// San Francisco, CA - Opened 2000 - Capacity 41,915
// Home of the San Francisco Giants

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
        overhangHeight: covered ? 27 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 27 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Oracle Park Sections
export const oracleParkSections: DetailedSection[] = [
  // ========== FIELD CLUB ==========
  {
    id: 'FC101',
    name: 'Field Club 101',
    level: 'field',
    baseAngle: 87, // Park faces east (87°)
    angleSpan: 8,
    rows: generateRows('A', 'N', 18, 0, 17, false),
    vertices3D: [
      { x: -10, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 85, z: 11 },
      { x: -10, y: 85, z: 11 }
    ],
    covered: false,
    price: 'luxury',
    distance: 73,
    height: 0,
    rake: 17,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Field Club Entrance']
    }
  },

  // ========== LOWER BOX ==========
  {
    id: '110',
    name: 'Lower Box 110',
    level: 'lower',
    baseAngle: 87,
    angleSpan: 9,
    rows: generateRows(1, 36, 22, 0, 21, false),
    vertices3D: [
      { x: -18, y: 70, z: 0 },
      { x: -5, y: 70, z: 0 },
      { x: -5, y: 105, z: 19 },
      { x: -18, y: 105, z: 19 }
    ],
    covered: false,
    price: 'premium',
    distance: 88,
    height: 0,
    rake: 21,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '125',
    name: 'Lower Box 125',
    level: 'lower',
    baseAngle: 132, // First base line
    angleSpan: 9,
    rows: generateRows(1, 36, 22, 0, 21, false),
    vertices3D: [
      { x: 70, y: 70, z: 0 },
      { x: 85, y: 55, z: 0 },
      { x: 105, y: 75, z: 19 },
      { x: 90, y: 90, z: 19 }
    ],
    covered: false,
    price: 'premium',
    distance: 98,
    height: 0,
    rake: 21,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== ARCADE (UNIQUE TO ORACLE) ==========
  {
    id: 'ARC148',
    name: 'Arcade 148',
    level: 'field',
    baseAngle: 177, // Right field wall
    angleSpan: 10,
    rows: generateRows(1, 25, 24, 8, 20, false),
    vertices3D: [
      { x: 100, y: -10, z: 8 },
      { x: 100, y: -30, z: 8 },
      { x: 130, y: -30, z: 28 },
      { x: 130, y: -10, z: 28 }
    ],
    covered: false,
    price: 'moderate',
    distance: 309, // Short right field wall
    height: 8,
    rake: 20,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== VIEW LEVEL ==========
  {
    id: 'VR302',
    name: 'View Reserved 302',
    level: 'upper',
    baseAngle: 87,
    angleSpan: 11,
    rows: generateRows(1, 32, 26, 40, 29, true),
    vertices3D: [
      { x: -30, y: 140, z: 40 },
      { x: -12, y: 140, z: 40 },
      { x: -10, y: 195, z: 82 },
      { x: -28, y: 195, z: 82 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'],
      coveragePercentage: 47,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 168,
    height: 40,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: 'VR325',
    name: 'View Reserved 325',
    level: 'upper',
    baseAngle: 132,
    angleSpan: 11,
    rows: generateRows(1, 32, 26, 40, 29, true),
    vertices3D: [
      { x: 140, y: 30, z: 40 },
      { x: 140, y: 12, z: 40 },
      { x: 195, y: 10, z: 82 },
      { x: 195, y: 28, z: 82 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'],
      coveragePercentage: 47,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 168,
    height: 40,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'CL207',
    name: 'Club Level 207',
    level: 'club',
    baseAngle: 87,
    angleSpan: 10,
    rows: generateRows('A', 'M', 16, 22, 19, true),
    vertices3D: [
      { x: -22, y: 105, z: 22 },
      { x: -8, y: 105, z: 22 },
      { x: -8, y: 130, z: 35 },
      { x: -22, y: 130, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 118,
    height: 22,
    rake: 19,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 6,
      aisleSeats: true,
      tunnelAccess: ['Club Level Entrance']
    }
  },

  // ========== BLEACHERS ==========
  {
    id: 'BL136',
    name: 'Bleachers 136',
    level: 'field',
    baseAngle: 357, // Left field
    angleSpan: 14,
    rows: generateRows(1, 34, 28, 6, 22, false),
    vertices3D: [
      { x: -150, y: 320, z: 6 },
      { x: -120, y: 340, z: 6 },
      { x: -110, y: 375, z: 34 },
      { x: -140, y: 355, z: 34 }
    ],
    covered: false,
    price: 'value',
    distance: 355,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: 'BL142',
    name: 'Bleachers 142',
    level: 'field',
    baseAngle: 267, // Center field
    angleSpan: 14,
    rows: generateRows(1, 34, 28, 6, 22, false),
    vertices3D: [
      { x: -30, y: 390, z: 6 },
      { x: 0, y: 390, z: 6 },
      { x: 0, y: 425, z: 34 },
      { x: -30, y: 425, z: 34 }
    ],
    covered: false,
    price: 'value',
    distance: 408,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== COCA-COLA FAN LOT (Behind Right Field) ==========
  {
    id: 'CCFL',
    name: 'Coca-Cola Fan Lot',
    level: 'standing',
    baseAngle: 177,
    angleSpan: 20,
    rows: [], // Standing room / picnic area
    vertices3D: [
      { x: 120, y: -50, z: 35 },
      { x: 160, y: -70, z: 35 },
      { x: 160, y: -40, z: 35 },
      { x: 120, y: -20, z: 35 }
    ],
    covered: false,
    price: 'value',
    distance: 350,
    height: 35,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== VIRGIN AMERICA CLUB ==========
  {
    id: 'VAC',
    name: 'Virgin America Club',
    level: 'club',
    baseAngle: 42, // Third base line
    angleSpan: 10,
    rows: generateRows('A', 'J', 14, 24, 17, true),
    vertices3D: [
      { x: -85, y: 85, z: 24 },
      { x: -70, y: 100, z: 24 },
      { x: -80, y: 110, z: 34 },
      { x: -95, y: 95, z: 34 }
    ],
    covered: true,
    price: 'luxury',
    distance: 120,
    height: 24,
    rake: 17,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== GOTHAM CLUB (Behind Home Plate) ==========
  {
    id: 'GC',
    name: 'Gotham Club',
    level: 'suite',
    baseAngle: 87,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 32, elevation: 30, depth: 0, covered: true, overhangHeight: 20 }
    ],
    vertices3D: [
      { x: -20, y: 115, z: 30 },
      { x: 20, y: 115, z: 30 },
      { x: 20, y: 135, z: 30 },
      { x: -20, y: 135, z: 30 }
    ],
    covered: true,
    price: 'luxury',
    distance: 125,
    height: 30,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 32,
      aisleSeats: false,
      tunnelAccess: ['Gotham Club Entrance']
    }
  },

  // ========== GARDEN (Center Field Garden) ==========
  {
    id: 'GDN',
    name: 'Center Field Garden',
    level: 'standing',
    baseAngle: 267,
    angleSpan: 15,
    rows: [], // Standing/garden area
    vertices3D: [
      { x: -40, y: 425, z: 12 },
      { x: 40, y: 425, z: 12 },
      { x: 40, y: 445, z: 12 },
      { x: -40, y: 445, z: 12 }
    ],
    covered: false,
    price: 'moderate',
    distance: 435,
    height: 12,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== MCCOVEY COVE ARCADE ==========
  {
    id: 'MCA',
    name: 'McCovey Cove Arcade',
    level: 'standing',
    baseAngle: 177,
    angleSpan: 8,
    rows: [], // Standing room along water
    vertices3D: [
      { x: 100, y: -60, z: 0 },
      { x: 120, y: -70, z: 0 },
      { x: 120, y: -50, z: 0 },
      { x: 100, y: -40, z: 0 }
    ],
    covered: false,
    price: 'value',
    distance: 320,
    height: 0,
    rake: 0,
    viewQuality: 'good'
  }
];

// Calculate total capacity
export const oracleParkCapacity = oracleParkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const oracleParkSectionMap = new Map(
  oracleParkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const oracleParkFeatures = {
  mccoveyCove: {
    location: 'right_field',
    waterFeature: true,
    splashHits: true,
    kayakers: true,
    distance: 309 // Short right field
  },
  cokeBottle: {
    location: 'left_field',
    height: 80,
    slides: true,
    interactive: true
  },
  gardenArea: {
    location: 'center_field',
    organic: true,
    ediblePlants: true,
    unique: true
  },
  rightFieldWall: {
    height: 24, // High wall in right
    arcade: true,
    porthole: true
  },
  windPatterns: {
    source: 'san_francisco_bay',
    prevailing: 'west',
    impact: 'significant',
    flagPoles: true
  },
  orientation: {
    degrees: 87, // Faces east
    sunsetViews: false,
    bayViews: true
  }
};
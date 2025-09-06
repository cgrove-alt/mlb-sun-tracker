// PNC Park - Complete Section Data with 3D Geometry
// Pittsburgh, PA - Opened 2001 - Capacity 38,362
// Home of the Pittsburgh Pirates

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
        overhangHeight: covered ? 26 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 26 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// PNC Park Sections
export const pncParkSections: DetailedSection[] = [
  // ========== FIELD BOX ==========
  {
    id: '16',
    name: 'Field Box 16',
    level: 'field',
    baseAngle: 25, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'Y', 20, 0, 19, false),
    vertices3D: [
      { x: -10, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 85, z: 13 },
      { x: -10, y: 85, z: 13 }
    ],
    covered: false,
    price: 'premium',
    distance: 72,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 70, // First base line
    angleSpan: 8,
    rows: generateRows('A', 'Y', 20, 0, 19, false),
    vertices3D: [
      { x: 58, y: 58, z: 0 },
      { x: 72, y: 72, z: 0 },
      { x: 85, y: 85, z: 13 },
      { x: 71, y: 71, z: 13 }
    ],
    covered: false,
    price: 'premium',
    distance: 82,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== INFIELD BOX ==========
  {
    id: '115',
    name: 'Infield Box 115',
    level: 'lower',
    baseAngle: 25,
    angleSpan: 9,
    rows: generateRows(1, 30, 22, 13, 22, false),
    vertices3D: [
      { x: -16, y: 85, z: 13 },
      { x: -4, y: 85, z: 13 },
      { x: -4, y: 120, z: 33 },
      { x: -16, y: 120, z: 33 }
    ],
    covered: false,
    price: 'moderate',
    distance: 103,
    height: 13,
    rake: 22,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '129',
    name: 'Infield Box 129',
    level: 'lower',
    baseAngle: 340, // Third base line
    angleSpan: 9,
    rows: generateRows(1, 30, 22, 13, 22, false),
    vertices3D: [
      { x: -85, y: 16, z: 13 },
      { x: -85, y: 4, z: 13 },
      { x: -120, y: 4, z: 33 },
      { x: -120, y: 16, z: 33 }
    ],
    covered: false,
    price: 'moderate',
    distance: 103,
    height: 13,
    rake: 22,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== GRANDSTAND ==========
  {
    id: '308',
    name: 'Grandstand 308',
    level: 'upper',
    baseAngle: 25,
    angleSpan: 11,
    rows: generateRows(1, 26, 24, 33, 27, true),
    vertices3D: [
      { x: -25, y: 120, z: 33 },
      { x: -10, y: 120, z: 33 },
      { x: -8, y: 170, z: 68 },
      { x: -23, y: 170, z: 68 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'],
      coveragePercentage: 54,
      overhangDepth: 24,
      overhangHeight: 21,
      material: 'solid'
    },
    price: 'value',
    distance: 145,
    height: 33,
    rake: 27,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '325',
    name: 'Grandstand 325',
    level: 'upper',
    baseAngle: 115, // Right field
    angleSpan: 11,
    rows: generateRows(1, 26, 24, 33, 27, true),
    vertices3D: [
      { x: 120, y: -25, z: 33 },
      { x: 120, y: -10, z: 33 },
      { x: 170, y: -8, z: 68 },
      { x: 170, y: -23, z: 68 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'],
      coveragePercentage: 54,
      overhangDepth: 24,
      overhangHeight: 21,
      material: 'solid'
    },
    price: 'value',
    distance: 145,
    height: 33,
    rake: 27,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== BLEACHERS ==========
  {
    id: '134',
    name: 'Left Field Bleachers 134',
    level: 'field',
    baseAngle: 295, // Left field
    angleSpan: 13,
    rows: generateRows(1, 28, 26, 5, 21, false),
    vertices3D: [
      { x: -130, y: 280, z: 5 },
      { x: -105, y: 305, z: 5 },
      { x: -95, y: 335, z: 30 },
      { x: -120, y: 310, z: 30 }
    ],
    covered: false,
    price: 'value',
    distance: 325,
    height: 5,
    rake: 21,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '142',
    name: 'Center Field Bleachers 142',
    level: 'field',
    baseAngle: 205, // Center field
    angleSpan: 13,
    rows: generateRows(1, 28, 26, 5, 21, false),
    vertices3D: [
      { x: -25, y: 380, z: 5 },
      { x: 0, y: 380, z: 5 },
      { x: 0, y: 410, z: 30 },
      { x: -25, y: 410, z: 30 }
    ],
    covered: false,
    price: 'value',
    distance: 395,
    height: 5,
    rake: 21,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== RIVERWALK (Behind Right Field) ==========
  {
    id: 'RW',
    name: 'Riverwalk Standing',
    level: 'standing',
    baseAngle: 115,
    angleSpan: 18,
    rows: [], // Standing room
    vertices3D: [
      { x: 110, y: -40, z: 0 },
      { x: 140, y: -55, z: 0 },
      { x: 140, y: -30, z: 0 },
      { x: 110, y: -15, z: 0 }
    ],
    covered: false,
    price: 'value',
    distance: 320,
    height: 0,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== PIRATES COVE ==========
  {
    id: 'COVE',
    name: 'Pirates Cove',
    level: 'field',
    baseAngle: 160, // Right center
    angleSpan: 10,
    rows: [], // Picnic area
    vertices3D: [
      { x: 85, y: 320, z: 8 },
      { x: 110, y: 300, z: 8 },
      { x: 115, y: 315, z: 8 },
      { x: 90, y: 335, z: 8 }
    ],
    covered: false,
    price: 'moderate',
    distance: 340,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'CL212',
    name: 'PNC Club 212',
    level: 'club',
    baseAngle: 25,
    angleSpan: 10,
    rows: generateRows('A', 'K', 16, 23, 18, true),
    vertices3D: [
      { x: -20, y: 100, z: 23 },
      { x: -6, y: 100, z: 23 },
      { x: -6, y: 125, z: 33 },
      { x: -20, y: 125, z: 33 }
    ],
    covered: true,
    price: 'luxury',
    distance: 113,
    height: 23,
    rake: 18,
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

  // ========== LEXUS CLUB ==========
  {
    id: 'LEX',
    name: 'Lexus Club',
    level: 'suite',
    baseAngle: 25,
    angleSpan: 10,
    rows: [
      { rowNumber: 'Suite', seats: 28, elevation: 28, depth: 0, covered: true, overhangHeight: 20 }
    ],
    vertices3D: [
      { x: -18, y: 110, z: 28 },
      { x: 18, y: 110, z: 28 },
      { x: 18, y: 130, z: 28 },
      { x: -18, y: 130, z: 28 }
    ],
    covered: true,
    price: 'luxury',
    distance: 120,
    height: 28,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent'
  },

  // ========== HOME PLATE CLUB ==========
  {
    id: 'HPC',
    name: 'Home Plate Club',
    level: 'field',
    baseAngle: 25,
    angleSpan: 7,
    rows: generateRows('A', 'E', 14, -2, 16, false), // Below field level
    vertices3D: [
      { x: -7, y: 50, z: -2 },
      { x: 7, y: 50, z: -2 },
      { x: 7, y: 60, z: 3 },
      { x: -7, y: 60, z: 3 }
    ],
    covered: false,
    price: 'luxury',
    distance: 55,
    height: -2,
    rake: 16,
    seatWidth: 24,
    rowSpacing: 40,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Home Plate Club Entrance']
    }
  },

  // ========== ROOFTOP STANDING ==========
  {
    id: 'ROOF',
    name: 'Rooftop Deck',
    level: 'standing',
    baseAngle: 205,
    angleSpan: 20,
    rows: [], // Standing room
    vertices3D: [
      { x: -35, y: 410, z: 35 },
      { x: 35, y: 410, z: 35 },
      { x: 35, y: 430, z: 35 },
      { x: -35, y: 430, z: 35 }
    ],
    covered: false,
    price: 'moderate',
    distance: 420,
    height: 35,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== NOTCH (Right Field Corner) ==========
  {
    id: 'NOTCH',
    name: 'The Notch',
    level: 'field',
    baseAngle: 115,
    angleSpan: 6,
    rows: generateRows(1, 12, 18, 10, 18, false),
    vertices3D: [
      { x: 105, y: -20, z: 10 },
      { x: 115, y: -25, z: 10 },
      { x: 120, y: -15, z: 20 },
      { x: 110, y: -10, z: 20 }
    ],
    covered: false,
    price: 'moderate',
    distance: 320, // Right field corner
    height: 10,
    rake: 18,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  }
];

// Calculate total capacity
export const pncParkCapacity = pncParkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const pncParkSectionMap = new Map(
  pncParkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const pncParkFeatures = {
  robertoClementeBridge: {
    pedestrianOnly: true,
    gameDay: true,
    yellowColor: true,
    sixthStreetBridge: true,
    walkableToStadium: true
  },
  riverwalk: {
    location: 'right_field',
    alleghenyRiver: true,
    standingRoom: true,
    uniqueViews: true
  },
  dimensions: {
    leftField: 325,
    leftCenter: 383,
    centerField: 399,
    rightCenter: 375,
    rightField: 320,
    notchRightField: 320 // Unique notch in right field
  },
  riverfront: {
    alleghenyRiver: true,
    downtownSkyline: true,
    waterTaxis: true,
    kayakers: false // Unlike San Francisco
  },
  piratesCove: {
    location: 'right_center',
    picnicArea: true,
    groupSeating: true,
    familyFriendly: true
  },
  homeRunAlley: {
    location: 'beyond_center',
    standingRoom: true,
    concessions: true
  }
};
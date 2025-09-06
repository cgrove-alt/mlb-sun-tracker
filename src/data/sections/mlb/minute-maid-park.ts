// Minute Maid Park - Complete Section Data with 3D Geometry
// Houston, TX - Opened 2000 - Capacity 41,168
// Home of the Houston Astros

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = true // Most sections covered by retractable roof
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
        overhangHeight: covered ? 150 - baseElevation - (rowNum * 0.5) : undefined // Retractable roof height
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
        overhangHeight: covered ? 150 - baseElevation - (rowNum * 0.5) : undefined
      });
    }
  }
  
  return rows;
}

// Minute Maid Park Sections
export const minuteMaidParkSections: DetailedSection[] = [
  // ========== FIELD BOX ==========
  {
    id: '112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 20, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 19, true),
    vertices3D: [
      { x: -10, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 88, z: 14 },
      { x: -10, y: 88, z: 14 }
    ],
    covered: true,
    price: 'premium',
    distance: 74,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '126',
    name: 'Field Box 126',
    level: 'field',
    baseAngle: 65, // First base line
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 19, true),
    vertices3D: [
      { x: 60, y: 60, z: 0 },
      { x: 74, y: 74, z: 0 },
      { x: 88, y: 88, z: 14 },
      { x: 74, y: 74, z: 14 }
    ],
    covered: true,
    price: 'premium',
    distance: 85,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== CRAWFORD BOXES (Left Field) ==========
  {
    id: 'CB100',
    name: 'Crawford Boxes 100',
    level: 'field',
    baseAngle: 290, // Left field corner
    angleSpan: 10,
    rows: generateRows(1, 22, 24, 8, 20, true),
    vertices3D: [
      { x: -100, y: 300, z: 8 },
      { x: -80, y: 315, z: 8 },
      { x: -75, y: 340, z: 28 },
      { x: -95, y: 325, z: 28 }
    ],
    covered: true,
    price: 'moderate',
    distance: 315, // Short left field wall
    height: 8,
    rake: 20,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: 'CB101',
    name: 'Crawford Boxes 101',
    level: 'field',
    baseAngle: 280,
    angleSpan: 10,
    rows: generateRows(1, 22, 24, 8, 20, true),
    vertices3D: [
      { x: -80, y: 315, z: 8 },
      { x: -60, y: 325, z: 8 },
      { x: -55, y: 350, z: 28 },
      { x: -75, y: 340, z: 28 }
    ],
    covered: true,
    price: 'moderate',
    distance: 315,
    height: 8,
    rake: 20,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== MEZZANINE ==========
  {
    id: '206',
    name: 'Mezzanine 206',
    level: 'lower',
    baseAngle: 20,
    angleSpan: 9,
    rows: generateRows(1, 28, 22, 14, 23, true),
    vertices3D: [
      { x: -18, y: 88, z: 14 },
      { x: -5, y: 88, z: 14 },
      { x: -5, y: 125, z: 36 },
      { x: -18, y: 125, z: 36 }
    ],
    covered: true,
    price: 'moderate',
    distance: 107,
    height: 14,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '254',
    name: 'Mezzanine 254',
    level: 'lower',
    baseAngle: 110, // Right field
    angleSpan: 9,
    rows: generateRows(1, 28, 22, 14, 23, true),
    vertices3D: [
      { x: 88, y: -18, z: 14 },
      { x: 88, y: -5, z: 14 },
      { x: 125, y: -5, z: 36 },
      { x: 125, y: -18, z: 36 }
    ],
    covered: true,
    price: 'moderate',
    distance: 107,
    height: 14,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== VIEW DECK ==========
  {
    id: '406',
    name: 'View Deck 406',
    level: 'upper',
    baseAngle: 20,
    angleSpan: 11,
    rows: generateRows(1, 30, 26, 36, 28, true),
    vertices3D: [
      { x: -28, y: 125, z: 36 },
      { x: -10, y: 125, z: 36 },
      { x: -8, y: 180, z: 75 },
      { x: -26, y: 180, z: 75 }
    ],
    covered: true,
    price: 'value',
    distance: 153,
    height: 36,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '432',
    name: 'View Deck 432',
    level: 'upper',
    baseAngle: 335, // Third base
    angleSpan: 11,
    rows: generateRows(1, 30, 26, 36, 28, true),
    vertices3D: [
      { x: -125, y: 28, z: 36 },
      { x: -125, y: 10, z: 36 },
      { x: -180, y: 8, z: 75 },
      { x: -180, y: 26, z: 75 }
    ],
    covered: true,
    price: 'value',
    distance: 153,
    height: 36,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== HOME RUN PUMP (Center Field) ==========
  {
    id: 'HRP',
    name: 'Home Run Pump',
    level: 'standing',
    baseAngle: 200, // Center field
    angleSpan: 15,
    rows: [], // Standing room / bar area
    vertices3D: [
      { x: -30, y: 430, z: 12 },
      { x: 30, y: 430, z: 12 },
      { x: 30, y: 450, z: 12 },
      { x: -30, y: 450, z: 12 }
    ],
    covered: true,
    price: 'moderate',
    distance: 440,
    height: 12,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== TORCHY'S TACOS (Left Field) ==========
  {
    id: 'TORCH',
    name: "Torchy's Tacos Deck",
    level: 'standing',
    baseAngle: 270,
    angleSpan: 12,
    rows: [], // Party deck
    vertices3D: [
      { x: -95, y: 340, z: 30 },
      { x: -75, y: 355, z: 30 },
      { x: -75, y: 370, z: 30 },
      { x: -95, y: 355, z: 30 }
    ],
    covered: true,
    price: 'moderate',
    distance: 355,
    height: 30,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'CL',
    name: 'Club Level',
    level: 'club',
    baseAngle: 20,
    angleSpan: 10,
    rows: generateRows('A', 'L', 16, 25, 18, true),
    vertices3D: [
      { x: -22, y: 105, z: 25 },
      { x: -8, y: 105, z: 25 },
      { x: -8, y: 130, z: 36 },
      { x: -22, y: 130, z: 36 }
    ],
    covered: true,
    price: 'luxury',
    distance: 118,
    height: 25,
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

  // ========== DIAMOND CLUB ==========
  {
    id: 'DC',
    name: 'Diamond Club',
    level: 'field',
    baseAngle: 20,
    angleSpan: 8,
    rows: generateRows('A', 'F', 14, -2, 16, true), // Below field level
    vertices3D: [
      { x: -8, y: 52, z: -2 },
      { x: 8, y: 52, z: -2 },
      { x: 8, y: 62, z: 3 },
      { x: -8, y: 62, z: 3 }
    ],
    covered: true,
    price: 'luxury',
    distance: 57,
    height: -2,
    rake: 16,
    seatWidth: 24,
    rowSpacing: 40,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Diamond Club Entrance']
    }
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'SUITE',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 20,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 32, elevation: 32, depth: 0, covered: true, overhangHeight: 118 }
    ],
    vertices3D: [
      { x: -20, y: 115, z: 32 },
      { x: 20, y: 115, z: 32 },
      { x: 20, y: 135, z: 32 },
      { x: -20, y: 135, z: 32 }
    ],
    covered: true,
    price: 'luxury',
    distance: 125,
    height: 32,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent'
  },

  // ========== TRAIN DECK (Above Left Field Wall) ==========
  {
    id: 'TRAIN',
    name: 'Train Deck',
    level: 'standing',
    baseAngle: 290,
    angleSpan: 8,
    rows: [], // Standing room under train
    vertices3D: [
      { x: -100, y: 315, z: 35 },
      { x: -85, y: 325, z: 35 },
      { x: -85, y: 335, z: 35 },
      { x: -100, y: 325, z: 35 }
    ],
    covered: true,
    price: 'moderate',
    distance: 325,
    height: 35,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== BUDWEISER BREW HOUSE ==========
  {
    id: 'BUD',
    name: 'Budweiser Brew House',
    level: 'standing',
    baseAngle: 110,
    angleSpan: 10,
    rows: [], // Bar/standing area
    vertices3D: [
      { x: 100, y: -30, z: 15 },
      { x: 120, y: -40, z: 15 },
      { x: 120, y: -25, z: 15 },
      { x: 100, y: -15, z: 15 }
    ],
    covered: true,
    price: 'moderate',
    distance: 340,
    height: 15,
    rake: 0,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const minuteMaidParkCapacity = minuteMaidParkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const minuteMaidParkSectionMap = new Map(
  minuteMaidParkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const minuteMaidParkFeatures = {
  retractableRoof: {
    type: 'retractable',
    material: 'glass_panels',
    height: 150,
    openingTime: 12, // minutes
    acresCovered: 9,
    yearRound: true
  },
  crawfordBoxes: {
    location: 'left_field',
    distance: 315, // Very short
    height: 19, // Wall height
    seatingAbove: true,
    iconic: true
  },
  trainFeature: {
    location: 'left_field_wall',
    length: 800, // feet
    runsOnHomeruns: true,
    vintage: '1860s_replica',
    conductor: 'Bobby_Dynamite'
  },
  talsHill: {
    existed: '2000-2016',
    centerField: true,
    flagpole: true,
    removed: true,
    distance: 436 // When it existed
  },
  dimensions: {
    leftField: 315, // Crawford Boxes
    leftCenter: 369,
    centerField: 409,
    rightCenter: 373,
    rightField: 326
  },
  unionStation: {
    historicBuilding: true,
    integratedIntoDesign: true,
    leftFieldEntrance: true
  }
};
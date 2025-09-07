// Great American Ball Park - Complete Section Data with 3D Geometry
// Cincinnati, OH - Opened 2003 - Capacity 42,319
// Home of the Cincinnati Reds

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
        overhangHeight: covered ? 29 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 29 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Great American Ball Park Sections
export const greatAmericanBallparkSections: DetailedSection[] = [
  // ========== DIAMOND SEATS (Behind Home Plate) ==========
  {
    id: 'DS',
    name: 'Diamond Seats',
    level: 'field',
    baseAngle: 105, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 0, 17, false),
    vertices3D: [
      { x: -10, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 82, z: 10 },
      { x: -10, y: 82, z: 10 }
    ],
    covered: false,
    price: 'luxury',
    distance: 70,
    height: 0,
    rake: 17,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Diamond Club Entrance']
    }
  },

  // ========== INFIELD BOX ==========
  {
    id: '118',
    name: 'Infield Box 118',
    level: 'field',
    baseAngle: 105,
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -15, y: 65, z: 0 },
      { x: -2, y: 65, z: 0 },
      { x: -2, y: 95, z: 16 },
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
    id: '127',
    name: 'Infield Box 127',
    level: 'field',
    baseAngle: 150, // First base line
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: 65, y: -15, z: 0 },
      { x: 80, y: -30, z: 0 },
      { x: 95, y: -15, z: 16 },
      { x: 80, y: 0, z: 16 }
    ],
    covered: false,
    price: 'premium',
    distance: 88,
    height: 0,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== TERRACE ==========
  {
    id: '217',
    name: 'Terrace 217',
    level: 'lower',
    baseAngle: 105,
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: -20, y: 95, z: 16 },
      { x: -5, y: 95, z: 16 },
      { x: -5, y: 135, z: 39 },
      { x: -20, y: 135, z: 39 }
    ],
    covered: false,
    price: 'moderate',
    distance: 115,
    height: 16,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '235',
    name: 'Terrace 235',
    level: 'lower',
    baseAngle: 60, // Third base
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: -95, y: 20, z: 16 },
      { x: -95, y: 5, z: 16 },
      { x: -135, y: 5, z: 39 },
      { x: -135, y: 20, z: 39 }
    ],
    covered: false,
    price: 'moderate',
    distance: 115,
    height: 16,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== VIEW LEVEL ==========
  {
    id: '404',
    name: 'View Level 404',
    level: 'upper',
    baseAngle: 105,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: -30, y: 135, z: 39 },
      { x: -12, y: 135, z: 39 },
      { x: -10, y: 190, z: 78 },
      { x: -28, y: 190, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
      coveragePercentage: 52,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 163,
    height: 39,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '432',
    name: 'View Level 432',
    level: 'upper',
    baseAngle: 195, // Right field
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: 135, y: -30, z: 39 },
      { x: 135, y: -12, z: 39 },
      { x: 190, y: -10, z: 78 },
      { x: 190, y: -28, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
      coveragePercentage: 52,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 163,
    height: 39,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== RIVERBOAT DECK (Center Field) ==========
  {
    id: 'RIVER',
    name: 'Riverboat Deck',
    level: 'standing',
    baseAngle: 285, // Center field
    angleSpan: 18,
    rows: [], // Standing room deck
    vertices3D: [
      { x: -40, y: -400, z: 25 },
      { x: 40, y: -400, z: 25 },
      { x: 40, y: -420, z: 25 },
      { x: -40, y: -420, z: 25 }
    ],
    covered: false,
    price: 'moderate',
    distance: 410,
    height: 25,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== POWER STACKS (Right Field) ==========
  {
    id: 'POWER',
    name: 'Power Stacks',
    level: 'standing',
    baseAngle: 195,
    angleSpan: 10,
    rows: [], // Standing area near smokestacks
    vertices3D: [
      { x: 120, y: -50, z: 18 },
      { x: 140, y: -65, z: 18 },
      { x: 140, y: -45, z: 18 },
      { x: 120, y: -30, z: 18 }
    ],
    covered: false,
    price: 'value',
    distance: 325,
    height: 18,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== THE GAP (Right-Center Alley) ==========
  {
    id: 'GAP',
    name: 'The Gap',
    level: 'field',
    baseAngle: 240, // Right-center narrow alley
    angleSpan: 6,
    rows: generateRows(1, 15, 18, 8, 18, false),
    vertices3D: [
      { x: 90, y: -90, z: 8 },
      { x: 105, y: -105, z: 8 },
      { x: 115, y: -95, z: 20 },
      { x: 100, y: -80, z: 20 }
    ],
    covered: false,
    price: 'moderate',
    distance: 365, // Narrow gap distance
    height: 8,
    rake: 18,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  },

  // ========== SUN/MOON DECK (Left Field) ==========
  {
    id: 'SUNMOON',
    name: 'Sun/Moon Deck',
    level: 'field',
    baseAngle: 15, // Left field
    angleSpan: 14,
    rows: generateRows(1, 32, 28, 6, 22, false),
    vertices3D: [
      { x: -140, y: 60, z: 6 },
      { x: -165, y: 45, z: 6 },
      { x: -180, y: 65, z: 34 },
      { x: -155, y: 80, z: 34 }
    ],
    covered: false,
    price: 'value',
    distance: 328,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== BLEACHERS ==========
  {
    id: '144',
    name: 'Right Field Bleachers 144',
    level: 'field',
    baseAngle: 195,
    angleSpan: 14,
    rows: generateRows(1, 34, 30, 6, 22, false),
    vertices3D: [
      { x: 140, y: -60, z: 6 },
      { x: 165, y: -75, z: 6 },
      { x: 180, y: -55, z: 36 },
      { x: 155, y: -40, z: 36 }
    ],
    covered: false,
    price: 'value',
    distance: 325,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '146',
    name: 'Center Field Bleachers 146',
    level: 'field',
    baseAngle: 285,
    angleSpan: 14,
    rows: generateRows(1, 34, 30, 6, 22, false),
    vertices3D: [
      { x: -30, y: -380, z: 6 },
      { x: 30, y: -380, z: 6 },
      { x: 30, y: -415, z: 36 },
      { x: -30, y: -415, z: 36 }
    ],
    covered: false,
    price: 'value',
    distance: 398,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'CL306',
    name: 'Club Level 306',
    level: 'club',
    baseAngle: 105,
    angleSpan: 10,
    rows: generateRows('A', 'M', 16, 26, 19, true),
    vertices3D: [
      { x: -24, y: 110, z: 26 },
      { x: -10, y: 110, z: 26 },
      { x: -10, y: 135, z: 38 },
      { x: -24, y: 135, z: 38 }
    ],
    covered: true,
    price: 'luxury',
    distance: 123,
    height: 26,
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

  // ========== SCOUTS CLUB ==========
  {
    id: 'SCOUT',
    name: 'Scouts Club',
    level: 'suite',
    baseAngle: 105,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 32, elevation: 32, depth: 0, covered: true, overhangHeight: 25 }
    ],
    vertices3D: [
      { x: -22, y: 120, z: 32 },
      { x: 22, y: 120, z: 32 },
      { x: 22, y: 140, z: 32 },
      { x: -22, y: 140, z: 32 }
    ],
    covered: true,
    price: 'luxury',
    distance: 130,
    height: 32,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent'
  },

  // ========== FAN ZONE (Beyond Center Field) ==========
  {
    id: 'FANZONE',
    name: 'Fan Zone',
    level: 'standing',
    baseAngle: 285,
    angleSpan: 20,
    rows: [], // Family area / kids zone
    vertices3D: [
      { x: -45, y: -420, z: 8 },
      { x: 45, y: -420, z: 8 },
      { x: 45, y: -445, z: 8 },
      { x: -45, y: -445, z: 8 }
    ],
    covered: false,
    price: 'value',
    distance: 433,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== MACHINE ROOM GRILLE ==========
  {
    id: 'MRG',
    name: 'Machine Room Grille',
    level: 'standing',
    baseAngle: 150,
    angleSpan: 10,
    rows: [], // Bar/restaurant area
    vertices3D: [
      { x: 95, y: -25, z: 20 },
      { x: 110, y: -35, z: 20 },
      { x: 110, y: -20, z: 20 },
      { x: 95, y: -10, z: 20 }
    ],
    covered: false,
    price: 'moderate',
    distance: 115,
    height: 20,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== HANDLEBAR (Third Base) ==========
  {
    id: 'HANDLE',
    name: 'Handlebar',
    level: 'standing',
    baseAngle: 60,
    angleSpan: 8,
    rows: [], // Standing room bar
    vertices3D: [
      { x: -85, y: 30, z: 18 },
      { x: -70, y: 45, z: 18 },
      { x: -70, y: 60, z: 18 },
      { x: -85, y: 45, z: 18 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 18,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== PARTY DECK ==========
  {
    id: 'PARTY',
    name: 'Party Deck',
    level: 'upper',
    baseAngle: 195,
    angleSpan: 12,
    rows: [], // Group party area
    vertices3D: [
      { x: 145, y: -45, z: 42 },
      { x: 165, y: -60, z: 42 },
      { x: 165, y: -40, z: 42 },
      { x: 145, y: -25, z: 42 }
    ],
    covered: false,
    price: 'premium',
    distance: 340,
    height: 42,
    rake: 0,
    viewQuality: 'fair'
  },
  
  // ========== SCOUTS CLUB ==========
  {
    id: 'SCOUTS',
    name: 'Scouts Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows(1, 8, 26, 25, 28, true),
    vertices3D: [
      { x: -25, y: 25, z: 60 },
      { x: 25, y: 25, z: 60 },
      { x: 30, y: 45, z: 80 },
      { x: -30, y: 45, z: 80 }
    ],
    covered: true,
    price: 'luxury',
    distance: 70,
    height: 25,
    rake: 28,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  
  // ========== SUN/MOON DECK ==========
  {
    id: 'SUNMOON',
    name: 'Sun/Moon Deck',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 15,
    rows: [], // Standing room deck
    vertices3D: [
      { x: -140, y: 85, z: 380 },
      { x: -120, y: 85, z: 400 },
      { x: -120, y: 95, z: 410 },
      { x: -140, y: 95, z: 390 }
    ],
    covered: false,
    price: 'moderate',
    distance: 390,
    height: 85,
    rake: 0,
    viewQuality: 'fair'
  },
  
  // ========== RIVERBOAT DECK ==========
  {
    id: 'RIVERBOAT',
    name: 'Riverboat Deck',
    level: 'field',
    baseAngle: 180,
    angleSpan: 25,
    rows: generateRows('A', 'F', 40, 15, 26, false),
    vertices3D: [
      { x: -20, y: 15, z: 400 },
      { x: 20, y: 15, z: 400 },
      { x: 25, y: 31, z: 416 },
      { x: -25, y: 31, z: 416 }
    ],
    covered: false,
    price: 'moderate',
    distance: 400,
    height: 15,
    rake: 26,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'fair'
  },
  
  // ========== FIOPTICS DISTRICT ==========
  {
    id: 'FIOPTICS',
    name: 'Fioptics District',
    level: 'standing',
    baseAngle: 135,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: 80, y: 22, z: 360 },
      { x: 100, y: 22, z: 375 },
      { x: 100, y: 32, z: 385 },
      { x: 80, y: 32, z: 370 }
    ],
    covered: false,
    price: 'moderate',
    distance: 367,
    height: 22,
    rake: 0,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const greatAmericanBallparkCapacity = greatAmericanBallparkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const greatAmericanBallparkSectionMap = new Map(
  greatAmericanBallparkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const greatAmericanBallparkFeatures = {
  riverfront: {
    location: 'Ohio_River',
    mehringWay: true,
    riverboatDeck: true,
    views: 'Kentucky_hills'
  },
  powerStacks: {
    location: 'right_field',
    smokestacks: true,
    shootFireworks: true,
    height: 64, // feet
    iconic: true
  },
  theGap: {
    location: 'right_center',
    narrowAlley: true,
    distance: 365,
    unique: true
  },
  dimensions: {
    leftField: 328,
    leftCenter: 379,
    centerField: 404,
    rightCenter: 370, // The Gap
    rightField: 325
  },
  fanZone: {
    location: 'beyond_center',
    familyArea: true,
    kidsActivities: true,
    wiffleBall: true
  },
  roseGarden: {
    peteRose: true,
    location: 'outside_third_base',
    statue: true
  },
  crosley: {
    terrace: true,
    tribute: 'Crosley_Field',
    incline: true
  }
};
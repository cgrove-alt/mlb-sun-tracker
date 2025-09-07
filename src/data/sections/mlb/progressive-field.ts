// Progressive Field - Complete Section Data with 3D Geometry
// Cleveland, OH - Opened 1994 - Capacity 34,830
// Home of the Cleveland Guardians

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

// Progressive Field Sections
export const progressiveFieldSections: DetailedSection[] = [
  // ========== FIELD BOX ==========
  {
    id: '125',
    name: 'Field Box 125',
    level: 'field',
    baseAngle: 60, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'X', 20, 0, 19, false),
    vertices3D: [
      { x: -12, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 87, z: 13 },
      { x: -12, y: 87, z: 13 }
    ],
    covered: false,
    price: 'premium',
    distance: 74,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '144',
    name: 'Field Box 144',
    level: 'field',
    baseAngle: 105, // First base line
    angleSpan: 8,
    rows: generateRows('A', 'X', 20, 0, 19, false),
    vertices3D: [
      { x: 60, y: -12, z: 0 },
      { x: 74, y: -26, z: 0 },
      { x: 87, y: -13, z: 13 },
      { x: 73, y: 1, z: 13 }
    ],
    covered: false,
    price: 'premium',
    distance: 83,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '163',
    name: 'Field Box 163',
    level: 'field',
    baseAngle: 15, // Third base line
    angleSpan: 8,
    rows: generateRows('A', 'X', 20, 0, 19, false),
    vertices3D: [
      { x: -60, y: 12, z: 0 },
      { x: -74, y: 26, z: 0 },
      { x: -87, y: 13, z: 13 },
      { x: -73, y: -1, z: 13 }
    ],
    covered: false,
    price: 'premium',
    distance: 83,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== LOWER BOX ==========
  {
    id: '245',
    name: 'Lower Box 245',
    level: 'lower',
    baseAngle: 60,
    angleSpan: 9,
    rows: generateRows(1, 30, 22, 13, 23, false),
    vertices3D: [
      { x: -18, y: 87, z: 13 },
      { x: -5, y: 87, z: 13 },
      { x: -5, y: 123, z: 34 },
      { x: -18, y: 123, z: 34 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 13,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '264',
    name: 'Lower Box 264',
    level: 'lower',
    baseAngle: 15,
    angleSpan: 9,
    rows: generateRows(1, 30, 22, 13, 23, false),
    vertices3D: [
      { x: -87, y: 18, z: 13 },
      { x: -87, y: 5, z: 13 },
      { x: -123, y: 5, z: 34 },
      { x: -123, y: 18, z: 34 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 13,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== MEZZANINE ==========
  {
    id: '441',
    name: 'Mezzanine 441',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 11,
    rows: generateRows(1, 27, 26, 34, 27, true),
    vertices3D: [
      { x: -28, y: 123, z: 34 },
      { x: -10, y: 123, z: 34 },
      { x: -8, y: 175, z: 69 },
      { x: -26, y: 175, z: 69 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 52,
      overhangDepth: 24,
      overhangHeight: 21,
      material: 'solid'
    },
    price: 'value',
    distance: 149,
    height: 34,
    rake: 27,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '467',
    name: 'Mezzanine 467',
    level: 'upper',
    baseAngle: 150, // Right field
    angleSpan: 11,
    rows: generateRows(1, 27, 26, 34, 27, true),
    vertices3D: [
      { x: 123, y: -28, z: 34 },
      { x: 123, y: -10, z: 34 },
      { x: 175, y: -8, z: 69 },
      { x: 175, y: -26, z: 69 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 52,
      overhangDepth: 24,
      overhangHeight: 21,
      material: 'solid'
    },
    price: 'value',
    distance: 149,
    height: 34,
    rake: 27,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== UPPER BOX ==========
  {
    id: '541',
    name: 'Upper Box 541',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 10,
    rows: generateRows(1, 22, 28, 50, 29, true),
    vertices3D: [
      { x: -32, y: 150, z: 50 },
      { x: -15, y: 150, z: 50 },
      { x: -13, y: 195, z: 82 },
      { x: -30, y: 195, z: 82 }
    ],
    covered: true,
    price: 'value',
    distance: 173,
    height: 50,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 29,
    viewQuality: 'good'
  },

  // ========== CORNER BAR (Left Field) ==========
  {
    id: 'CORNER',
    name: 'Corner Bar',
    level: 'standing',
    baseAngle: 330, // Left field corner
    angleSpan: 12,
    rows: [], // Bar/standing area with drink rails
    vertices3D: [
      { x: -110, y: 30, z: 20 },
      { x: -95, y: 45, z: 20 },
      { x: -95, y: 60, z: 20 },
      { x: -110, y: 45, z: 20 }
    ],
    covered: false,
    price: 'moderate',
    distance: 325,
    height: 20,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== BLEACHERS ==========
  {
    id: '180',
    name: 'Left Field Bleachers 180',
    level: 'field',
    baseAngle: 330,
    angleSpan: 14,
    rows: generateRows(1, 30, 28, 6, 22, false),
    vertices3D: [
      { x: -130, y: 50, z: 6 },
      { x: -155, y: 35, z: 6 },
      { x: -170, y: 55, z: 33 },
      { x: -145, y: 70, z: 33 }
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
    id: '185',
    name: 'Center Field Bleachers 185',
    level: 'field',
    baseAngle: 240, // Center field
    angleSpan: 14,
    rows: generateRows(1, 30, 28, 6, 22, false),
    vertices3D: [
      { x: -30, y: -370, z: 6 },
      { x: 30, y: -370, z: 6 },
      { x: 30, y: -405, z: 33 },
      { x: -30, y: -405, z: 33 }
    ],
    covered: false,
    price: 'value',
    distance: 388,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '187',
    name: 'Right Field Bleachers 187',
    level: 'field',
    baseAngle: 150,
    angleSpan: 14,
    rows: generateRows(1, 30, 28, 6, 22, false),
    vertices3D: [
      { x: 130, y: -50, z: 6 },
      { x: 155, y: -65, z: 6 },
      { x: 170, y: -45, z: 33 },
      { x: 145, y: -30, z: 33 }
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

  // ========== HERITAGE PARK (Center Field) ==========
  {
    id: 'HERITAGE',
    name: 'Heritage Park',
    level: 'standing',
    baseAngle: 240,
    angleSpan: 18,
    rows: [], // Standing area with historical displays
    vertices3D: [
      { x: -35, y: -405, z: 10 },
      { x: 35, y: -405, z: 10 },
      { x: 35, y: -425, z: 10 },
      { x: -35, y: -425, z: 10 }
    ],
    covered: false,
    price: 'value',
    distance: 415,
    height: 10,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== TERRACE CLUB ==========
  {
    id: 'TERR',
    name: 'Terrace Club',
    level: 'club',
    baseAngle: 60,
    angleSpan: 10,
    rows: generateRows('A', 'L', 16, 24, 18, true),
    vertices3D: [
      { x: -22, y: 105, z: 24 },
      { x: -8, y: 105, z: 24 },
      { x: -8, y: 130, z: 35 },
      { x: -22, y: 130, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 118,
    height: 24,
    rake: 18,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 6,
      aisleSeats: true,
      tunnelAccess: ['Terrace Club Entrance']
    }
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'SUITE',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 60,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 30, elevation: 30, depth: 0, covered: true, overhangHeight: 22 }
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
    viewQuality: 'excellent'
  },

  // ========== KIDS CLUBHOUSE ==========
  {
    id: 'KIDS',
    name: 'Kids Clubhouse',
    level: 'standing',
    baseAngle: 105,
    angleSpan: 10,
    rows: [], // Kids play area
    vertices3D: [
      { x: 90, y: -15, z: 8 },
      { x: 105, y: -25, z: 8 },
      { x: 105, y: -10, z: 8 },
      { x: 90, y: 0, z: 8 }
    ],
    covered: false,
    price: 'moderate',
    distance: 330,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== DISTRICT TICKET ==========
  {
    id: 'DIST',
    name: 'District Ticket',
    level: 'standing',
    baseAngle: 240,
    angleSpan: 15,
    rows: [], // Affordable standing room
    vertices3D: [
      { x: -30, y: -380, z: 35 },
      { x: 30, y: -380, z: 35 },
      { x: 30, y: -395, z: 35 },
      { x: -30, y: -395, z: 35 }
    ],
    covered: false,
    price: 'value',
    distance: 388,
    height: 35,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== SNOW DAYS BAR ==========
  {
    id: 'SNOW',
    name: 'Snow Days Bar',
    level: 'standing',
    baseAngle: 150,
    angleSpan: 8,
    rows: [], // Bar area
    vertices3D: [
      { x: 115, y: -35, z: 22 },
      { x: 130, y: -45, z: 22 },
      { x: 130, y: -30, z: 22 },
      { x: 115, y: -20, z: 22 }
    ],
    covered: false,
    price: 'moderate',
    distance: 335,
    height: 22,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== BUDWEISER PARTY DECK ==========
  {
    id: 'BUD',
    name: 'Budweiser Party Deck',
    level: 'upper',
    baseAngle: 330,
    angleSpan: 12,
    rows: [], // Group party area
    vertices3D: [
      { x: -145, y: 40, z: 38 },
      { x: -165, y: 25, z: 38 },
      { x: -165, y: 45, z: 38 },
      { x: -145, y: 60, z: 38 }
    ],
    covered: false,
    price: 'premium',
    distance: 345,
    height: 38,
    rake: 0,
    viewQuality: 'fair'
  },
  
  // ========== BLUE MOON TERRACE GARDEN (New 2025) ==========
  {
    id: 'BLUEMOON',
    name: 'Blue Moon Terrace Garden',
    level: 'upper',
    baseAngle: 225,
    angleSpan: 20,
    rows: generateRows(1, 10, 35, 75, 30, false),
    vertices3D: [
      { x: -120, y: 75, z: 280 },
      { x: -90, y: 75, z: 300 },
      { x: -95, y: 105, z: 330 },
      { x: -125, y: 105, z: 310 }
    ],
    covered: false,
    price: 'premium',
    distance: 290,
    height: 75,
    rake: 30,
    seatWidth: 20,
    rowSpacing: 36,
    viewQuality: 'good'
  },
  
  // ========== TERRACE HALL (New 2025) ==========
  {
    id: 'TERRACEHALL',
    name: 'Terrace Hall',
    level: 'club',
    baseAngle: 240,
    angleSpan: 15,
    rows: generateRows('A', 'H', 40, 65, 28, true),
    vertices3D: [
      { x: -110, y: 65, z: 260 },
      { x: -85, y: 65, z: 280 },
      { x: -90, y: 87, z: 302 },
      { x: -115, y: 87, z: 282 }
    ],
    covered: true,
    price: 'luxury',
    distance: 270,
    height: 65,
    rake: 28,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  
  // ========== NORTH COAST SOCIAL BOXES (New 2025) ==========
  {
    id: 'NORTHCOAST',
    name: 'North Coast Social Boxes',
    level: 'club',
    baseAngle: 255,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Box', seats: 80, elevation: 55, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -130, y: 55, z: 240 },
      { x: -110, y: 55, z: 255 },
      { x: -110, y: 65, z: 265 },
      { x: -130, y: 65, z: 250 }
    ],
    covered: true,
    price: 'luxury',
    distance: 247,
    height: 55,
    rake: 0,
    viewQuality: 'excellent'
  },
  
  // ========== ECHO VICTORY CLUB ==========
  {
    id: 'ECHOVICTORY',
    name: 'ECHO Victory Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows('A', 'J', 26, 60, 26, true),
    vertices3D: [
      { x: -30, y: 60, z: 70 },
      { x: 30, y: 60, z: 70 },
      { x: 35, y: 86, z: 96 },
      { x: -35, y: 86, z: 96 }
    ],
    covered: true,
    price: 'luxury',
    distance: 70,
    height: 60,
    rake: 26,
    seatWidth: 22,
    rowSpacing: 40,
    viewQuality: 'excellent'
  }
];

// Calculate total capacity
export const progressiveFieldCapacity = progressiveFieldSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const progressiveFieldSectionMap = new Map(
  progressiveFieldSections.map(section => [section.id, section])
);

// Stadium-specific features
export const progressiveFieldFeatures = {
  cornerBar: {
    location: 'left_field',
    twoLevels: true,
    drinkRails: true,
    socialSpace: true
  },
  heritagePark: {
    location: 'center_field',
    historicalDisplays: true,
    statues: true,
    indiansHistory: true
  },
  kidsClubhouse: {
    location: 'right_field',
    playground: true,
    familyArea: true,
    interactive: true
  },
  dimensions: {
    leftField: 325,
    leftCenter: 370,
    centerField: 405,
    rightCenter: 375,
    rightField: 325
  },
  toothbrush: {
    lightTowers: true,
    nickname: 'toothbrushes',
    iconic: true,
    whiteColor: true
  },
  districtTicket: {
    affordable: true,
    standingRoom: true,
    socialArea: true,
    youngProfessionals: true
  },
  downtown: {
    location: 'Gateway_District',
    walkable: true,
    cityViews: true
  }
};
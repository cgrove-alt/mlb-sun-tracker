// Target Field - Complete Section Data with 3D Geometry
// Minneapolis, MN - Opened 2010 - Capacity 38,544
// Home of the Minnesota Twins

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

// Target Field Sections
export const targetFieldSections: DetailedSection[] = [
  // ========== CHAMPIONS CLUB (Behind Home Plate) ==========
  {
    id: 'CC',
    name: 'Champions Club',
    level: 'field',
    baseAngle: 0, // Unique north-facing orientation
    angleSpan: 8,
    rows: generateRows('A', 'R', 16, 0, 18, false),
    vertices3D: [
      { x: -10, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 82, z: 11 },
      { x: -10, y: 82, z: 11 }
    ],
    covered: false,
    price: 'luxury',
    distance: 70,
    height: 0,
    rake: 18,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Champions Club Entrance']
    }
  },

  // ========== FIELD BOX ==========
  {
    id: '14',
    name: 'Field Box 14',
    level: 'field',
    baseAngle: 0,
    angleSpan: 9,
    rows: generateRows('A', 'Y', 20, 0, 19, false),
    vertices3D: [
      { x: -15, y: 65, z: 0 },
      { x: -3, y: 65, z: 0 },
      { x: -3, y: 92, z: 14 },
      { x: -15, y: 92, z: 14 }
    ],
    covered: false,
    price: 'premium',
    distance: 79,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '121',
    name: 'Field Box 121',
    level: 'field',
    baseAngle: 45, // First base line
    angleSpan: 9,
    rows: generateRows('A', 'Y', 20, 0, 19, false),
    vertices3D: [
      { x: 65, y: 65, z: 0 },
      { x: 79, y: 79, z: 0 },
      { x: 92, y: 92, z: 14 },
      { x: 78, y: 78, z: 14 }
    ],
    covered: false,
    price: 'premium',
    distance: 92,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== HOME PLATE TERRACE ==========
  {
    id: '209',
    name: 'Home Plate Terrace 209',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows(1, 30, 22, 14, 23, false),
    vertices3D: [
      { x: -20, y: 92, z: 14 },
      { x: -6, y: 92, z: 14 },
      { x: -6, y: 128, z: 35 },
      { x: -20, y: 128, z: 35 }
    ],
    covered: false,
    price: 'moderate',
    distance: 110,
    height: 14,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '235',
    name: 'Home Plate Terrace 235',
    level: 'lower',
    baseAngle: 315, // Third base
    angleSpan: 10,
    rows: generateRows(1, 30, 22, 14, 23, false),
    vertices3D: [
      { x: -92, y: 20, z: 14 },
      { x: -92, y: 6, z: 14 },
      { x: -128, y: 6, z: 35 },
      { x: -128, y: 20, z: 35 }
    ],
    covered: false,
    price: 'moderate',
    distance: 110,
    height: 14,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== VIEW LEVEL ==========
  {
    id: '301',
    name: 'View Level 301',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 35, 28, true),
    vertices3D: [
      { x: -28, y: 128, z: 35 },
      { x: -10, y: 128, z: 35 },
      { x: -8, y: 180, z: 72 },
      { x: -26, y: 180, z: 72 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 54,
      overhangDepth: 25,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'value',
    distance: 154,
    height: 35,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '327',
    name: 'View Level 327',
    level: 'upper',
    baseAngle: 90, // Right field
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 35, 28, true),
    vertices3D: [
      { x: 128, y: 28, z: 35 },
      { x: 128, y: 10, z: 35 },
      { x: 180, y: 8, z: 72 },
      { x: 180, y: 26, z: 72 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 54,
      overhangDepth: 25,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'value',
    distance: 154,
    height: 35,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== OVERLOOK (Center Field) ==========
  {
    id: 'OVER',
    name: 'Overlook',
    level: 'standing',
    baseAngle: 180, // Center field
    angleSpan: 20,
    rows: [], // Standing room with drink rails
    vertices3D: [
      { x: -35, y: 395, z: 25 },
      { x: 35, y: 395, z: 25 },
      { x: 35, y: 415, z: 25 },
      { x: -35, y: 415, z: 25 }
    ],
    covered: false,
    price: 'moderate',
    distance: 405,
    height: 25,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== BLEACHERS ==========
  {
    id: '133',
    name: 'Left Field Bleachers 133',
    level: 'field',
    baseAngle: 270, // Left field
    angleSpan: 14,
    rows: generateRows(1, 32, 28, 6, 22, false),
    vertices3D: [
      { x: -140, y: -60, z: 6 },
      { x: -165, y: -75, z: 6 },
      { x: -175, y: -50, z: 32 },
      { x: -150, y: -35, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 339,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '136',
    name: 'Right Field Bleachers 136',
    level: 'field',
    baseAngle: 90,
    angleSpan: 14,
    rows: generateRows(1, 32, 28, 6, 22, false),
    vertices3D: [
      { x: 140, y: -60, z: 6 },
      { x: 165, y: -75, z: 6 },
      { x: 175, y: -50, z: 32 },
      { x: 150, y: -35, z: 32 }
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

  // ========== TOWN BALL TAVERN ==========
  {
    id: 'TBT',
    name: 'Town Ball Tavern',
    level: 'standing',
    baseAngle: 135, // Right field corner
    angleSpan: 12,
    rows: [], // Bar/standing area
    vertices3D: [
      { x: 110, y: -30, z: 18 },
      { x: 130, y: -45, z: 18 },
      { x: 130, y: -30, z: 18 },
      { x: 110, y: -15, z: 18 }
    ],
    covered: false,
    price: 'moderate',
    distance: 340,
    height: 18,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== METROPOLITAN CLUB ==========
  {
    id: 'METRO',
    name: 'Metropolitan Club',
    level: 'club',
    baseAngle: 0,
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
      tunnelAccess: ['Metropolitan Club Entrance']
    }
  },

  // ========== DELTA SKY360 CLUB ==========
  {
    id: 'DELTA',
    name: 'Delta Sky360 Club',
    level: 'suite',
    baseAngle: 0,
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

  // ========== GATE 34 (Standing Room) ==========
  {
    id: 'G34',
    name: 'Gate 34',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 15,
    rows: [], // Standing room
    vertices3D: [
      { x: -30, y: 415, z: 8 },
      { x: 30, y: 415, z: 8 },
      { x: 30, y: 430, z: 8 },
      { x: -30, y: 430, z: 8 }
    ],
    covered: false,
    price: 'value',
    distance: 423,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== TWINS PUB ==========
  {
    id: 'PUB',
    name: 'Twins Pub',
    level: 'standing',
    baseAngle: 315,
    angleSpan: 10,
    rows: [], // Bar area
    vertices3D: [
      { x: -90, y: 30, z: 20 },
      { x: -75, y: 45, z: 20 },
      { x: -75, y: 60, z: 20 },
      { x: -90, y: 45, z: 20 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 20,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== BUDWEISER ROOF DECK ==========
  {
    id: 'BUD',
    name: 'Budweiser Roof Deck',
    level: 'standing',
    baseAngle: 270, // Left field
    angleSpan: 12,
    rows: [], // Rooftop party deck
    vertices3D: [
      { x: -150, y: -40, z: 38 },
      { x: -170, y: -55, z: 38 },
      { x: -170, y: -35, z: 38 },
      { x: -150, y: -20, z: 38 }
    ],
    covered: false,
    price: 'premium',
    distance: 350,
    height: 38,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== SKYLINE DECK ==========
  {
    id: 'SKY',
    name: 'Skyline Deck',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows(1, 12, 24, 45, 20, true),
    vertices3D: [
      { x: -18, y: 140, z: 45 },
      { x: -6, y: 140, z: 45 },
      { x: -6, y: 160, z: 55 },
      { x: -18, y: 160, z: 55 }
    ],
    covered: true,
    price: 'premium',
    distance: 150,
    height: 45,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 35,
    viewQuality: 'excellent'
  },

  // ========== FAMILY SECTION ==========
  {
    id: 'FAM',
    name: 'Family Section',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 8,
    rows: generateRows(1, 20, 22, 18, 21, false),
    vertices3D: [
      { x: 85, y: 85, z: 18 },
      { x: 98, y: 98, z: 18 },
      { x: 110, y: 110, z: 32 },
      { x: 97, y: 97, z: 32 }
    ],
    covered: false,
    price: 'moderate',
    distance: 120,
    height: 18,
    rake: 21,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },
  
  // ========== DELTA SKY360 LEGENDS CLUB ==========
  {
    id: 'SKY360',
    name: 'Delta Sky360 Legends Club',
    level: 'club',
    baseAngle: 180,
    angleSpan: 30,
    rows: generateRows('A', 'J', 24, 65, 30, true),
    vertices3D: [
      { x: -40, y: 65, z: 380 },
      { x: 40, y: 65, z: 380 },
      { x: 45, y: 95, z: 410 },
      { x: -45, y: 95, z: 410 }
    ],
    covered: true,
    price: 'luxury',
    distance: 380,
    height: 65,
    rake: 30,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  
  // ========== BUDWEISER ROOF DECK ==========
  {
    id: 'BUDROOF',
    name: 'Budweiser Roof Deck',
    level: 'upper',
    baseAngle: 225,
    angleSpan: 20,
    rows: [
      { rowNumber: 'Fixed', seats: 120, elevation: 75, depth: 0, covered: true },
      { rowNumber: 'SRO', seats: 130, elevation: 75, depth: 5, covered: true }
    ],
    vertices3D: [
      { x: -150, y: 75, z: 320 },
      { x: -120, y: 75, z: 340 },
      { x: -120, y: 85, z: 350 },
      { x: -150, y: 85, z: 330 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['Fixed', 'SRO'],
      coveragePercentage: 60
    },
    price: 'premium',
    distance: 330,
    height: 75,
    rake: 0,
    viewQuality: 'good'
  },
  
  // ========== TOWN BALL TAVERN ==========
  {
    id: 'TOWNBALL',
    name: 'Town Ball Tavern',
    level: 'club',
    baseAngle: 240,
    angleSpan: 15,
    rows: generateRows('A', 'H', 30, 55, 28, true),
    vertices3D: [
      { x: -140, y: 55, z: 280 },
      { x: -120, y: 55, z: 300 },
      { x: -125, y: 77, z: 322 },
      { x: -145, y: 77, z: 302 }
    ],
    covered: true,
    price: 'premium',
    distance: 290,
    height: 55,
    rake: 28,
    seatWidth: 20,
    rowSpacing: 35,
    viewQuality: 'good'
  },
  
  // ========== BAT & BARREL ==========
  {
    id: 'BATBARREL',
    name: 'Bat & Barrel',
    level: 'club',
    baseAngle: 90,
    angleSpan: 18,
    rows: generateRows('A', 'F', 35, 60, 26, true),
    vertices3D: [
      { x: 100, y: 60, z: 120 },
      { x: 120, y: 60, z: 130 },
      { x: 125, y: 76, z: 146 },
      { x: 105, y: 76, z: 136 }
    ],
    covered: true,
    price: 'premium',
    distance: 125,
    height: 60,
    rake: 26,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent'
  },
  
  // ========== GRAY DUCK DECK ==========
  {
    id: 'GRAYDUCK',
    name: 'Gray Duck Deck',
    level: 'upper',
    baseAngle: 255,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Bar', seats: 80, elevation: 70, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -160, y: 70, z: 340 },
      { x: -145, y: 70, z: 355 },
      { x: -145, y: 70, z: 365 },
      { x: -160, y: 70, z: 350 }
    ],
    covered: false,
    price: 'moderate',
    distance: 350,
    height: 70,
    rake: 0,
    viewQuality: 'fair'
  },
  
  // ========== THOMSON REUTERS CHAMPIONS CLUB ==========
  {
    id: 'CHAMPIONS',
    name: 'Thomson Reuters Champions Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows('A', 'M', 26, 5, 25, false),
    vertices3D: [
      { x: -35, y: 5, z: 50 },
      { x: 35, y: 5, z: 50 },
      { x: 40, y: 35, z: 80 },
      { x: -40, y: 35, z: 80 }
    ],
    covered: false,
    price: 'luxury',
    distance: 65,
    height: 5,
    rake: 25,
    seatWidth: 22,
    rowSpacing: 40,
    viewQuality: 'excellent'
  }
];

// Calculate total capacity
export const targetFieldCapacity = targetFieldSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const targetFieldSectionMap = new Map(
  targetFieldSections.map(section => [section.id, section])
);

// Stadium-specific features
export const targetFieldFeatures = {
  orientation: {
    degrees: 0, // Unique north-facing orientation
    sunset: 'behind_third_base',
    lateAfternoonSun: 'minimized',
    unique: 'only_north_facing_MLB'
  },
  overlook: {
    location: 'center_field',
    standingRoom: true,
    drinkRails: true,
    socialSpace: true
  },
  townBallTavern: {
    location: 'right_field',
    twoLevels: true,
    outdoorPatio: true,
    yearRound: false
  },
  dimensions: {
    leftField: 339,
    leftCenter: 377,
    centerField: 404,
    rightCenter: 367,
    rightField: 328
  },
  gate34: {
    location: 'center_field',
    standingRoom: true,
    affordableOption: true
  },
  limestone: {
    localMaterial: 'Kasota_limestone',
    color: 'golden',
    minnesotan: true
  },
  climate: {
    heated: false,
    outdoorStadium: true,
    coldWeather: true,
    aprilSnow: 'possible'
  }
};
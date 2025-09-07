// Truist Park - Complete Section Data with 3D Geometry
// Atlanta, GA - Opened 2017 - Capacity 41,084
// Home of the Atlanta Braves

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

// Truist Park Sections
export const truistParkSections: DetailedSection[] = [
  // ========== FIELD LEVEL ==========
  {
    id: '13',
    name: 'Field Level 13',
    level: 'field',
    baseAngle: 45, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'AA', 22, 0, 20, false), // 27 rows
    vertices3D: [
      { x: -12, y: 62, z: 0 },
      { x: 0, y: 62, z: 0 },
      { x: 0, y: 92, z: 17 },
      { x: -12, y: 92, z: 17 }
    ],
    covered: false,
    price: 'premium',
    distance: 77,
    height: 0,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '27',
    name: 'Field Level 27',
    level: 'field',
    baseAngle: 90, // First base line
    angleSpan: 8,
    rows: generateRows('A', 'AA', 22, 0, 20, false),
    vertices3D: [
      { x: 62, y: 62, z: 0 },
      { x: 77, y: 77, z: 0 },
      { x: 92, y: 92, z: 17 },
      { x: 77, y: 77, z: 17 }
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

  {
    id: '44',
    name: 'Field Level 44',
    level: 'field',
    baseAngle: 0, // Third base line
    angleSpan: 8,
    rows: generateRows('A', 'AA', 22, 0, 20, false),
    vertices3D: [
      { x: -62, y: 62, z: 0 },
      { x: -77, y: 77, z: 0 },
      { x: -92, y: 92, z: 17 },
      { x: -77, y: 77, z: 17 }
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

  // ========== TERRACE LEVEL ==========
  {
    id: '213',
    name: 'Terrace Level 213',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: -20, y: 92, z: 17 },
      { x: -5, y: 92, z: 17 },
      { x: -5, y: 130, z: 40 },
      { x: -20, y: 130, z: 40 }
    ],
    covered: false,
    price: 'moderate',
    distance: 111,
    height: 17,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '227',
    name: 'Terrace Level 227',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 92, y: 20, z: 17 },
      { x: 92, y: 5, z: 17 },
      { x: 130, y: 5, z: 40 },
      { x: 130, y: 20, z: 40 }
    ],
    covered: false,
    price: 'moderate',
    distance: 111,
    height: 17,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== PAVILION LEVEL ==========
  {
    id: '313',
    name: 'Pavilion Level 313',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -30, y: 130, z: 40 },
      { x: -12, y: 130, z: 40 },
      { x: -10, y: 185, z: 78 },
      { x: -28, y: 185, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 50,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 158,
    height: 40,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '345',
    name: 'Pavilion Level 345',
    level: 'upper',
    baseAngle: 135, // Right field
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 130, y: -30, z: 40 },
      { x: 130, y: -12, z: 40 },
      { x: 185, y: -10, z: 78 },
      { x: 185, y: -28, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 50,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 158,
    height: 40,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== CHOPHOUSE (Right Field) ==========
  {
    id: 'CHOP',
    name: 'Chophouse',
    level: 'field',
    baseAngle: 135,
    angleSpan: 12,
    rows: generateRows(1, 18, 20, 8, 19, false),
    vertices3D: [
      { x: 100, y: -30, z: 8 },
      { x: 120, y: -45, z: 8 },
      { x: 130, y: -35, z: 25 },
      { x: 110, y: -20, z: 25 }
    ],
    covered: false,
    price: 'moderate',
    distance: 325,
    height: 8,
    rake: 19,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: 'CHOP-TERR',
    name: 'Chophouse Terrace',
    level: 'standing',
    baseAngle: 135,
    angleSpan: 10,
    rows: [], // Standing/dining area
    vertices3D: [
      { x: 110, y: -40, z: 25 },
      { x: 130, y: -55, z: 25 },
      { x: 130, y: -40, z: 25 },
      { x: 110, y: -25, z: 25 }
    ],
    covered: false,
    price: 'premium',
    distance: 335,
    height: 25,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== XFINITY ROOFTOP ==========
  {
    id: 'XFIN',
    name: 'Xfinity Rooftop',
    level: 'standing',
    baseAngle: 225, // Center field
    angleSpan: 20,
    rows: [], // Rooftop deck
    vertices3D: [
      { x: -40, y: 400, z: 35 },
      { x: 40, y: 400, z: 35 },
      { x: 40, y: 420, z: 35 },
      { x: -40, y: 420, z: 35 }
    ],
    covered: false,
    price: 'moderate',
    distance: 410,
    height: 35,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== SUNTRUST CLUB ==========
  {
    id: 'STC',
    name: 'SunTrust Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows('A', 'M', 16, 26, 18, true),
    vertices3D: [
      { x: -24, y: 108, z: 26 },
      { x: -10, y: 108, z: 26 },
      { x: -10, y: 133, z: 37 },
      { x: -24, y: 133, z: 37 }
    ],
    covered: true,
    price: 'luxury',
    distance: 121,
    height: 26,
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

  // ========== DELTA SKY360 CLUB ==========
  {
    id: 'DELTA',
    name: 'Delta Sky360 Club',
    level: 'suite',
    baseAngle: 45,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 34, elevation: 32, depth: 0, covered: true, overhangHeight: 25 }
    ],
    vertices3D: [
      { x: -22, y: 118, z: 32 },
      { x: 22, y: 118, z: 32 },
      { x: 22, y: 138, z: 32 },
      { x: -22, y: 138, z: 32 }
    ],
    covered: true,
    price: 'luxury',
    distance: 128,
    height: 32,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent'
  },

  // ========== MONUMENT GARDEN (Center Field) ==========
  {
    id: 'MONUMENT',
    name: 'Monument Garden',
    level: 'field',
    baseAngle: 225,
    angleSpan: 15,
    rows: generateRows(1, 8, 30, 10, 15, false),
    vertices3D: [
      { x: -35, y: 385, z: 10 },
      { x: 35, y: 385, z: 10 },
      { x: 35, y: 400, z: 16 },
      { x: -35, y: 400, z: 16 }
    ],
    covered: false,
    price: 'moderate',
    distance: 393,
    height: 10,
    rake: 15,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  },

  // ========== BLEACHERS ==========
  {
    id: '151',
    name: 'Right Field Bleachers 151',
    level: 'field',
    baseAngle: 180, // Right field
    angleSpan: 13,
    rows: generateRows(1, 30, 28, 6, 22, false),
    vertices3D: [
      { x: 140, y: -60, z: 6 },
      { x: 165, y: -75, z: 6 },
      { x: 175, y: -50, z: 32 },
      { x: 150, y: -35, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 335,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '153',
    name: 'Center Field Bleachers 153',
    level: 'field',
    baseAngle: 225,
    angleSpan: 13,
    rows: generateRows(1, 30, 28, 6, 22, false),
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
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '155',
    name: 'Left Field Bleachers 155',
    level: 'field',
    baseAngle: 270, // Left field
    angleSpan: 13,
    rows: generateRows(1, 30, 28, 6, 22, false),
    vertices3D: [
      { x: -140, y: -60, z: 6 },
      { x: -165, y: -75, z: 6 },
      { x: -175, y: -50, z: 32 },
      { x: -150, y: -35, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 335,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== INFINITI CLUB ==========
  {
    id: 'INF',
    name: 'Infiniti Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows('A', 'J', 14, 24, 17, true),
    vertices3D: [
      { x: -70, y: 85, z: 24 },
      { x: -55, y: 100, z: 24 },
      { x: -65, y: 110, z: 34 },
      { x: -80, y: 95, z: 34 }
    ],
    covered: true,
    price: 'luxury',
    distance: 115,
    height: 24,
    rake: 17,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== HOME DEPOT CLUBHOUSE ==========
  {
    id: 'HDC',
    name: 'Home Depot Clubhouse',
    level: 'field',
    baseAngle: 315, // Left field corner
    angleSpan: 8,
    rows: [], // Kids area / party deck
    vertices3D: [
      { x: -110, y: 310, z: 8 },
      { x: -95, y: 325, z: 8 },
      { x: -95, y: 340, z: 8 },
      { x: -110, y: 325, z: 8 }
    ],
    covered: false,
    price: 'moderate',
    distance: 330,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== COCA-COLA CORNER ==========
  {
    id: 'COKE',
    name: 'Coca-Cola Corner',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 10,
    rows: [], // Standing room
    vertices3D: [
      { x: 100, y: 10, z: 20 },
      { x: 115, y: 0, z: 20 },
      { x: 115, y: 15, z: 20 },
      { x: 100, y: 25, z: 20 }
    ],
    covered: false,
    price: 'value',
    distance: 328,
    height: 20,
    rake: 0,
    viewQuality: 'fair'
  },
  
  // ========== XFINITY ROOFTOP ==========
  {
    id: 'XFINITY',
    name: 'Xfinity Rooftop',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 120, y: 85, z: 380 },
      { x: 160, y: 85, z: 400 },
      { x: 165, y: 95, z: 410 },
      { x: 125, y: 95, z: 390 }
    ],
    covered: false,
    price: 'premium',
    distance: 390,
    height: 85,
    rake: 0,
    viewQuality: 'good'
  },
  
  // ========== THE CHOPHOUSE ==========
  {
    id: 'CHOPHOUSE',
    name: 'The Chophouse',
    level: 'field',
    baseAngle: 45,
    angleSpan: 15,
    rows: generateRows(1, 8, 25, 12, 26, false),
    vertices3D: [
      { x: 140, y: 12, z: 320 },
      { x: 160, y: 12, z: 335 },
      { x: 165, y: 32, z: 355 },
      { x: 145, y: 32, z: 340 }
    ],
    covered: false,
    price: 'luxury',
    distance: 330,
    height: 12,
    rake: 26,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  
  // ========== TERRAPIN TAPROOM ==========
  {
    id: 'TERRAPIN',
    name: 'Terrapin Taproom',
    level: 'club',
    baseAngle: 315,
    angleSpan: 18,
    rows: [],
    vertices3D: [
      { x: -140, y: 55, z: 340 },
      { x: -120, y: 55, z: 355 },
      { x: -120, y: 65, z: 365 },
      { x: -140, y: 65, z: 350 }
    ],
    covered: true,
    price: 'premium',
    distance: 347,
    height: 55,
    rake: 0,
    viewQuality: 'good'
  },
  
  // ========== TOP OF THE CHOP ==========
  {
    id: 'TOPCHOP',
    name: 'Top of the Chop',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 12,
    rows: [],
    vertices3D: [
      { x: 100, y: 75, z: 360 },
      { x: 115, y: 75, z: 370 },
      { x: 115, y: 85, z: 380 },
      { x: 100, y: 85, z: 370 }
    ],
    covered: false,
    price: 'moderate',
    distance: 365,
    height: 75,
    rake: 0,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const truistParkCapacity = truistParkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const truistParkSectionMap = new Map(
  truistParkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const truistParkFeatures = {
  theBattery: {
    mixedUse: true,
    restaurants: 16,
    retail: true,
    hotel: 'Omni',
    liveMusic: true,
    yearRound: true
  },
  chophouse: {
    location: 'right_field',
    twoLevels: true,
    restaurant: true,
    standingRoom: true,
    unique: true
  },
  monumentGarden: {
    location: 'center_field',
    honors: 'Braves_history',
    publicAccess: true
  },
  dimensions: {
    leftField: 335,
    leftCenter: 385,
    centerField: 400,
    rightCenter: 375,
    rightField: 325
  },
  rooftopAreas: {
    xfinityRooftop: true,
    standingRoom: true,
    socialSpaces: true
  },
  orientation: {
    degrees: 45, // Northeast
    sunset: 'third_base_side',
    cityViews: false
  }
};
// Coors Field - Complete Section Data with 3D Geometry
// Denver, CO - Opened 1995 - Capacity 50,144
// Home of the Colorado Rockies

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
        overhangHeight: covered ? 32 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      // Special handling for purple row (Row 20 in upper deck)
      const isPurpleRow = i === 20 && baseElevation > 30;
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 32 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Coors Field Sections
export const coorsFieldSections: DetailedSection[] = [
  // ========== INFIELD BOX ==========
  {
    id: '117',
    name: 'Infield Box 117',
    level: 'field',
    baseAngle: 40, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 19, false), // 26 rows
    vertices3D: [
      { x: -12, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 88, z: 14 },
      { x: -12, y: 88, z: 14 }
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
    id: '133',
    name: 'Infield Box 133',
    level: 'field',
    baseAngle: 85, // First base line
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 19, false),
    vertices3D: [
      { x: 60, y: 60, z: 0 },
      { x: 74, y: 74, z: 0 },
      { x: 88, y: 88, z: 14 },
      { x: 74, y: 74, z: 14 }
    ],
    covered: false,
    price: 'premium',
    distance: 85,
    height: 0,
    rake: 19,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== OUTFIELD BOX ==========
  {
    id: '145',
    name: 'Outfield Box 145',
    level: 'field',
    baseAngle: 130, // Right field
    angleSpan: 9,
    rows: generateRows(1, 35, 24, 0, 21, false),
    vertices3D: [
      { x: 88, y: -20, z: 0 },
      { x: 103, y: -35, z: 0 },
      { x: 120, y: -18, z: 19 },
      { x: 105, y: -3, z: 19 }
    ],
    covered: false,
    price: 'moderate',
    distance: 110,
    height: 0,
    rake: 21,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '157',
    name: 'Outfield Box 157',
    level: 'field',
    baseAngle: 310, // Left field
    angleSpan: 9,
    rows: generateRows(1, 35, 24, 0, 21, false),
    vertices3D: [
      { x: -88, y: -20, z: 0 },
      { x: -103, y: -35, z: 0 },
      { x: -120, y: -18, z: 19 },
      { x: -105, y: -3, z: 19 }
    ],
    covered: false,
    price: 'moderate',
    distance: 110,
    height: 0,
    rake: 21,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== ROCKPILE (Center Field Bleachers) ==========
  {
    id: 'ROCK',
    name: 'Rockpile',
    level: 'field',
    baseAngle: 220, // Center field
    angleSpan: 18,
    rows: generateRows(1, 40, 30, 8, 23, false), // 40 rows, affordable seating
    vertices3D: [
      { x: -40, y: 470, z: 8 },
      { x: 40, y: 470, z: 8 },
      { x: 40, y: 510, z: 38 },
      { x: -40, y: 510, z: 38 }
    ],
    covered: false,
    price: 'value', // Most affordable seats
    distance: 490,
    height: 8,
    rake: 23,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== PAVILION ==========
  {
    id: '201',
    name: 'Pavilion 201',
    level: 'lower',
    baseAngle: 175, // Right field pavilion
    angleSpan: 12,
    rows: generateRows(1, 32, 26, 19, 24, false),
    vertices3D: [
      { x: 120, y: -50, z: 19 },
      { x: 145, y: -65, z: 19 },
      { x: 160, y: -45, z: 42 },
      { x: 135, y: -30, z: 42 }
    ],
    covered: false,
    price: 'moderate',
    distance: 350,
    height: 19,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  },

  {
    id: '205',
    name: 'Pavilion 205',
    level: 'lower',
    baseAngle: 265, // Left field pavilion
    angleSpan: 12,
    rows: generateRows(1, 32, 26, 19, 24, false),
    vertices3D: [
      { x: -120, y: -50, z: 19 },
      { x: -145, y: -65, z: 19 },
      { x: -160, y: -45, z: 42 },
      { x: -135, y: -30, z: 42 }
    ],
    covered: false,
    price: 'moderate',
    distance: 350,
    height: 19,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  },

  // ========== MEZZANINE ==========
  {
    id: 'U317',
    name: 'Upper Mezzanine 317',
    level: 'upper',
    baseAngle: 40,
    angleSpan: 11,
    rows: generateRows(1, 38, 28, 42, 29, true), // Row 20 is purple (5,280 ft)
    vertices3D: [
      { x: -32, y: 135, z: 42 },
      { x: -14, y: 135, z: 42 },
      { x: -12, y: 195, z: 88 },
      { x: -30, y: 195, z: 88 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
      coveragePercentage: 50,
      overhangDepth: 28,
      overhangHeight: 25,
      material: 'solid'
    },
    price: 'value',
    distance: 165,
    height: 42,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: 'U343',
    name: 'Upper Mezzanine 343',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 11,
    rows: generateRows(1, 38, 28, 42, 29, true),
    vertices3D: [
      { x: 135, y: -32, z: 42 },
      { x: 135, y: -14, z: 42 },
      { x: 195, y: -12, z: 88 },
      { x: 195, y: -30, z: 88 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
      coveragePercentage: 50,
      overhangDepth: 28,
      overhangHeight: 25,
      material: 'solid'
    },
    price: 'value',
    distance: 165,
    height: 42,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== ROOFTOP (Largest Rooftop Deck in MLB) ==========
  {
    id: 'ROOF1',
    name: 'Rooftop Bar',
    level: 'standing',
    baseAngle: 175,
    angleSpan: 15,
    rows: [], // Standing room bar area
    vertices3D: [
      { x: 135, y: -60, z: 48 },
      { x: 165, y: -80, z: 48 },
      { x: 165, y: -55, z: 48 },
      { x: 135, y: -35, z: 48 }
    ],
    covered: false,
    price: 'premium',
    distance: 360,
    height: 48,
    rake: 0,
    viewQuality: 'good'
  },

  {
    id: 'ROOF2',
    name: 'Rooftop Deck',
    level: 'standing',
    baseAngle: 160,
    angleSpan: 20,
    rows: [], // Party deck area (2,300 person capacity)
    vertices3D: [
      { x: 100, y: -70, z: 48 },
      { x: 135, y: -85, z: 48 },
      { x: 135, y: -60, z: 48 },
      { x: 100, y: -45, z: 48 }
    ],
    covered: false,
    price: 'moderate',
    distance: 365,
    height: 48,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'CL214',
    name: 'Club Level 214',
    level: 'club',
    baseAngle: 40,
    angleSpan: 10,
    rows: generateRows('A', 'N', 16, 28, 19, true),
    vertices3D: [
      { x: -25, y: 110, z: 28 },
      { x: -10, y: 110, z: 28 },
      { x: -10, y: 135, z: 40 },
      { x: -25, y: 135, z: 40 }
    ],
    covered: true,
    price: 'luxury',
    distance: 123,
    height: 28,
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

  // ========== COORS CLUBHOUSE ==========
  {
    id: 'CCH',
    name: 'Coors Clubhouse',
    level: 'suite',
    baseAngle: 40,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 36, elevation: 35, depth: 0, covered: true, overhangHeight: 28 }
    ],
    vertices3D: [
      { x: -24, y: 120, z: 35 },
      { x: 24, y: 120, z: 35 },
      { x: 24, y: 140, z: 35 },
      { x: -24, y: 140, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 130,
    height: 35,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent'
  },

  // ========== THE SANDLOT BREWERY ==========
  {
    id: 'SAND',
    name: 'The Sandlot Brewery',
    level: 'standing',
    baseAngle: 130,
    angleSpan: 10,
    rows: [], // Standing/bar area
    vertices3D: [
      { x: 110, y: -25, z: 22 },
      { x: 125, y: -35, z: 22 },
      { x: 125, y: -20, z: 22 },
      { x: 110, y: -10, z: 22 }
    ],
    covered: false,
    price: 'moderate',
    distance: 340,
    height: 22,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== RIGHT FIELD BLEACHERS ==========
  {
    id: '151',
    name: 'Right Field Bleachers 151',
    level: 'field',
    baseAngle: 175,
    angleSpan: 14,
    rows: generateRows(1, 34, 28, 6, 22, false),
    vertices3D: [
      { x: 150, y: -70, z: 6 },
      { x: 175, y: -85, z: 6 },
      { x: 185, y: -60, z: 34 },
      { x: 160, y: -45, z: 34 }
    ],
    covered: false,
    price: 'value',
    distance: 350,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== LEFT FIELD BLEACHERS ==========
  {
    id: '157',
    name: 'Left Field Bleachers 157',
    level: 'field',
    baseAngle: 265,
    angleSpan: 14,
    rows: generateRows(1, 34, 28, 6, 22, false),
    vertices3D: [
      { x: -150, y: -70, z: 6 },
      { x: -175, y: -85, z: 6 },
      { x: -185, y: -60, z: 34 },
      { x: -160, y: -45, z: 34 }
    ],
    covered: false,
    price: 'value',
    distance: 347,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== OUTFIELD RESERVED ==========
  {
    id: '401',
    name: 'Outfield Reserved 401',
    level: 'upper',
    baseAngle: 220,
    angleSpan: 12,
    rows: generateRows(1, 25, 30, 38, 26, false),
    vertices3D: [
      { x: -35, y: 440, z: 38 },
      { x: 35, y: 440, z: 38 },
      { x: 35, y: 480, z: 65 },
      { x: -35, y: 480, z: 65 }
    ],
    covered: false,
    price: 'value',
    distance: 460,
    height: 38,
    rake: 26,
    seatWidth: 18,
    rowSpacing: 29,
    viewQuality: 'fair'
  },

  // ========== FIELD LEVEL CORNER ==========
  {
    id: '144',
    name: 'Field Level Corner 144',
    level: 'field',
    baseAngle: 355, // Third base corner
    angleSpan: 8,
    rows: generateRows('A', 'T', 18, 0, 18, false),
    vertices3D: [
      { x: -74, y: 74, z: 0 },
      { x: -60, y: 88, z: 0 },
      { x: -70, y: 98, z: 12 },
      { x: -84, y: 84, z: 12 }
    ],
    covered: false,
    price: 'moderate',
    distance: 105,
    height: 0,
    rake: 18,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'good'
  },
  
  // ========== PURPLE ROW (Mile High Marker) ==========
  {
    id: 'PURPLE',
    name: 'Purple Row - Mile High',
    level: 'upper',
    rows: [
      { rowNumber: '20', seats: 400, elevation: 88.0, depth: 56.0, covered: false }
    ],
    baseAngle: 0,
    angleSpan: 360,
    distance: 250,
    height: 88.0,
    rake: 35,
    vertices3D: [
      { x: -180, y: 88, z: 180 },
      { x: 180, y: 88, z: 180 },
      { x: 180, y: 90, z: 200 },
      { x: -180, y: 90, z: 200 }
    ],
    covered: false,
    viewQuality: 'good'
  },
  
  // ========== JACK DANIELS TERRACE BAR ==========
  {
    id: 'JDBAR',
    name: 'Jack Daniels Terrace Bar',
    level: 'upper',
    rows: [
      { rowNumber: 'SRO', seats: 150, elevation: 95.0, depth: 0, covered: false }
    ],
    baseAngle: 45,
    angleSpan: 30,
    distance: 420,
    height: 95.0,
    rake: 0,
    vertices3D: [
      { x: 150, y: 95, z: 380 },
      { x: 180, y: 95, z: 400 },
      { x: 180, y: 95, z: 420 },
      { x: 150, y: 95, z: 400 }
    ],
    covered: false,
    viewQuality: 'fair'
  },
  
  // ========== LEGACY CLUB ==========
  {
    id: 'LEGACY',
    name: 'Legacy Club',
    level: 'suite',
    rows: generateRows('A', 'H', 20, 75, 32, true),
    baseAngle: 0,
    angleSpan: 25,
    distance: 80,
    height: 75.0,
    rake: 32,
    vertices3D: [
      { x: -30, y: 75, z: 60 },
      { x: 30, y: 75, z: 60 },
      { x: 35, y: 95, z: 80 },
      { x: -35, y: 95, z: 80 }
    ],
    covered: true,
    viewQuality: 'excellent'
  },
  
  // ========== TOYOTA CLUBHOUSE ==========
  {
    id: 'TOYOTA',
    name: 'Toyota Clubhouse',
    level: 'field',
    rows: generateRows('A', 'K', 22, 8, 28, false),
    baseAngle: 0,
    angleSpan: 20,
    distance: 55,
    height: 8.0,
    rake: 28,
    vertices3D: [
      { x: -25, y: 8, z: 45 },
      { x: 25, y: 8, z: 45 },
      { x: 30, y: 35, z: 72 },
      { x: -30, y: 35, z: 72 }
    ],
    covered: false,
    viewQuality: 'excellent'
  },
  
  // ========== TAVERN BALLPARK ==========
  {
    id: 'TAVERN',
    name: 'Tavern Ballpark',
    level: 'upper',
    rows: [
      { rowNumber: 'SRO', seats: 200, elevation: 92.0, depth: 0, covered: false }
    ],
    baseAngle: 315,
    angleSpan: 35,
    distance: 410,
    height: 92.0,
    rake: 0,
    vertices3D: [
      { x: -150, y: 92, z: 380 },
      { x: -120, y: 92, z: 400 },
      { x: -120, y: 92, z: 420 },
      { x: -150, y: 92, z: 400 }
    ],
    covered: false,
    viewQuality: 'fair'
  },
  
  // ========== MOUNTAIN RANCH BAR & GRILLE ==========
  {
    id: 'MRBG',
    name: 'Mountain Ranch Bar & Grille',
    level: 'club',
    rows: generateRows('A', 'F', 30, 55, 30, true),
    baseAngle: 45,
    angleSpan: 25,
    distance: 180,
    height: 55.0,
    rake: 30,
    vertices3D: [
      { x: 120, y: 55, z: 140 },
      { x: 150, y: 55, z: 160 },
      { x: 155, y: 73, z: 178 },
      { x: 125, y: 73, z: 158 }
    ],
    covered: true,
    viewQuality: 'good'
  },
  
  // ========== COORS LIGHT SILVER BULLET BAR ==========
  {
    id: 'SILVER',
    name: 'Coors Light Silver Bullet Bar',
    level: 'field',
    rows: [
      { rowNumber: 'Bar', seats: 75, elevation: 12.0, depth: 0, covered: false }
    ],
    baseAngle: 270,
    angleSpan: 20,
    distance: 330,
    height: 12.0,
    rake: 0,
    vertices3D: [
      { x: -160, y: 12, z: 300 },
      { x: -140, y: 12, z: 320 },
      { x: -140, y: 12, z: 340 },
      { x: -160, y: 12, z: 320 }
    ],
    covered: false,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const coorsFieldCapacity = coorsFieldSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const coorsFieldSectionMap = new Map(
  coorsFieldSections.map(section => [section.id, section])
);

// Stadium-specific features
export const coorsFieldFeatures = {
  altitude: {
    elevation: 5280, // Exactly one mile high
    purpleRow: 'Row 20 Upper Deck', // Marks mile-high point
    ballFlight: 'travels_farther',
    humidor: true // Ball storage system
  },
  rooftop: {
    size: 'largest_in_MLB',
    capacity: 2300,
    bars: 2,
    views: 'Rocky_Mountains',
    unique: true
  },
  rockpile: {
    location: 'center_field',
    cheapestSeats: true,
    capacity: 2300,
    price: 4 // Dollar seats
  },
  dimensions: {
    leftField: 347,
    leftCenter: 390,
    centerField: 415,
    rightCenter: 375,
    rightField: 350
  },
  theSandlot: {
    brewery: true,
    microbrewery: 'first_in_MLB',
    location: 'right_field',
    blueMoonOrigin: true
  },
  orientation: {
    degrees: 40, // Northeast
    mountainViews: true,
    sunsetViews: 'third_base_side'
  }
};
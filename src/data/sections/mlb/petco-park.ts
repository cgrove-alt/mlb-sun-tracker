// Petco Park - Complete Section Data with 3D Geometry
// San Diego, CA - Opened 2004 - Capacity 40,209
// Home of the San Diego Padres

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

// Petco Park Sections
export const petcoParkSections: DetailedSection[] = [
  // ========== FIELD LEVEL ==========
  {
    id: '101',
    name: 'Field Level 101',
    level: 'field',
    baseAngle: 25, // Park orientation
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: -12, y: 62, z: 0 },
      { x: 0, y: 62, z: 0 },
      { x: 0, y: 92, z: 16 },
      { x: -12, y: 92, z: 16 }
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
    id: '117',
    name: 'Field Level 117',
    level: 'field',
    baseAngle: 70, // First base line
    angleSpan: 9,
    rows: generateRows('A', 'Z', 22, 0, 20, false),
    vertices3D: [
      { x: 62, y: 62, z: 0 },
      { x: 77, y: 77, z: 0 },
      { x: 92, y: 92, z: 16 },
      { x: 77, y: 77, z: 16 }
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

  // ========== WESTERN METAL SUPPLY CO. BUILDING ==========
  {
    id: 'WMS1',
    name: 'Western Metal Supply 1',
    level: 'field',
    baseAngle: 115, // Left field corner
    angleSpan: 6,
    rows: generateRows('A', 'H', 15, 0, 15, true),
    vertices3D: [
      { x: -95, y: 315, z: 0 },
      { x: -85, y: 325, z: 0 },
      { x: -85, y: 335, z: 8 },
      { x: -95, y: 325, z: 8 }
    ],
    covered: true,
    price: 'luxury',
    distance: 334, // Foul pole
    height: 0,
    rake: 15,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Western Metal Entrance']
    }
  },

  {
    id: 'WMS2',
    name: 'Western Metal Supply 2',
    level: 'lower',
    baseAngle: 115,
    angleSpan: 6,
    rows: generateRows('A', 'F', 12, 20, 12, true),
    vertices3D: [
      { x: -95, y: 315, z: 20 },
      { x: -85, y: 325, z: 20 },
      { x: -85, y: 335, z: 27 },
      { x: -95, y: 325, z: 27 }
    ],
    covered: true,
    price: 'luxury',
    distance: 334,
    height: 20,
    rake: 12,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  {
    id: 'WMS-ROOF',
    name: 'Western Metal Rooftop',
    level: 'upper',
    baseAngle: 115,
    angleSpan: 8,
    rows: [], // Standing room/party area
    vertices3D: [
      { x: -95, y: 315, z: 40 },
      { x: -80, y: 330, z: 40 },
      { x: -80, y: 340, z: 40 },
      { x: -95, y: 325, z: 40 }
    ],
    covered: false,
    price: 'premium',
    distance: 334,
    height: 40,
    rake: 0,
    viewQuality: 'good'
  },

  // ========== TOYOTA TERRACE LEVEL ==========
  {
    id: '201',
    name: 'Toyota Terrace 201',
    level: 'lower',
    baseAngle: 25,
    angleSpan: 10,
    rows: generateRows(1, 28, 24, 16, 24, false),
    vertices3D: [
      { x: -20, y: 92, z: 16 },
      { x: -5, y: 92, z: 16 },
      { x: -5, y: 130, z: 39 },
      { x: -20, y: 130, z: 39 }
    ],
    covered: false,
    price: 'moderate',
    distance: 111,
    height: 16,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '223',
    name: 'Toyota Terrace 223',
    level: 'lower',
    baseAngle: 115,
    angleSpan: 10,
    rows: generateRows(1, 28, 24, 16, 24, false),
    vertices3D: [
      { x: -92, y: 20, z: 16 },
      { x: -92, y: 5, z: 16 },
      { x: -130, y: 5, z: 39 },
      { x: -130, y: 20, z: 39 }
    ],
    covered: false,
    price: 'moderate',
    distance: 111,
    height: 16,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== VIEW LEVEL ==========
  {
    id: '301',
    name: 'View Level 301',
    level: 'upper',
    baseAngle: 25,
    angleSpan: 11,
    rows: generateRows(1, 30, 26, 39, 28, true),
    vertices3D: [
      { x: -28, y: 130, z: 39 },
      { x: -10, y: 130, z: 39 },
      { x: -8, y: 185, z: 78 },
      { x: -26, y: 185, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      coveragePercentage: 50,
      overhangDepth: 27,
      overhangHeight: 24,
      material: 'solid'
    },
    price: 'value',
    distance: 158,
    height: 39,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  // ========== PARK AT THE PARK ==========
  {
    id: 'PARK',
    name: 'Park at the Park',
    level: 'field',
    baseAngle: 205, // Center field
    angleSpan: 25,
    rows: [], // Lawn seating
    vertices3D: [
      { x: -50, y: 380, z: 0 },
      { x: 50, y: 380, z: 0 },
      { x: 60, y: 420, z: 10 },
      { x: -60, y: 420, z: 10 }
    ],
    covered: false,
    price: 'value',
    distance: 400,
    height: 0,
    rake: 5, // Gentle slope
    viewQuality: 'fair'
  },

  // ========== BEACH AREA ==========
  {
    id: 'BEACH',
    name: 'The Beach',
    level: 'field',
    baseAngle: 160, // Right center
    angleSpan: 12,
    rows: [], // Standing/beach area
    vertices3D: [
      { x: 90, y: 340, z: 8 },
      { x: 120, y: 320, z: 8 },
      { x: 125, y: 335, z: 8 },
      { x: 95, y: 355, z: 8 }
    ],
    covered: false,
    price: 'moderate',
    distance: 360,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== GALLAGHER SQUARE ==========
  {
    id: 'GS',
    name: 'Gallagher Square',
    level: 'standing',
    baseAngle: 205,
    angleSpan: 20,
    rows: [], // Standing room / event space
    vertices3D: [
      { x: -40, y: 420, z: 10 },
      { x: 40, y: 420, z: 10 },
      { x: 40, y: 450, z: 10 },
      { x: -40, y: 450, z: 10 }
    ],
    covered: false,
    price: 'value',
    distance: 435,
    height: 10,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== PREMIER CLUB ==========
  {
    id: 'PC',
    name: 'Premier Club',
    level: 'club',
    baseAngle: 25,
    angleSpan: 12,
    rows: generateRows('A', 'L', 16, 24, 18, true),
    vertices3D: [
      { x: -25, y: 100, z: 24 },
      { x: 0, y: 100, z: 24 },
      { x: 0, y: 125, z: 35 },
      { x: -25, y: 125, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 113,
    height: 24,
    rake: 18,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 6,
      aisleSeats: true,
      tunnelAccess: ['Premier Club Entrance']
    }
  },

  // ========== LEXUS PREMIER CLUB ==========
  {
    id: 'LPC',
    name: 'Lexus Premier Club',
    level: 'suite',
    baseAngle: 25,
    angleSpan: 10,
    rows: [
      { rowNumber: 'Suite', seats: 28, elevation: 32, depth: 0, covered: true, overhangHeight: 22 }
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

  // ========== BUDWEISER PORCH ==========
  {
    id: 'BUD',
    name: 'Budweiser Porch',
    level: 'field',
    baseAngle: 340, // Third base line
    angleSpan: 10,
    rows: generateRows(1, 15, 20, 12, 19, false),
    vertices3D: [
      { x: -70, y: 70, z: 12 },
      { x: -55, y: 85, z: 12 },
      { x: -65, y: 95, z: 25 },
      { x: -80, y: 80, z: 25 }
    ],
    covered: false,
    price: 'moderate',
    distance: 99,
    height: 12,
    rake: 19,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== HOMEPLATE CLUB ==========
  {
    id: 'HPC',
    name: 'Home Plate Club',
    level: 'field',
    baseAngle: 25,
    angleSpan: 8,
    rows: generateRows('A', 'F', 14, -2, 16, false), // Below field level
    vertices3D: [
      { x: -8, y: 52, z: -2 },
      { x: 8, y: 52, z: -2 },
      { x: 8, y: 62, z: 3 },
      { x: -8, y: 62, z: 3 }
    ],
    covered: false,
    price: 'luxury',
    distance: 57,
    height: -2,
    rake: 16,
    seatWidth: 24,
    rowSpacing: 40,
    viewQuality: 'excellent'
  }
];

// Calculate total capacity
export const petcoParkCapacity = petcoParkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const petcoParkSectionMap = new Map(
  petcoParkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const petcoParkFeatures = {
  westernMetalSupply: {
    builtIn: 1909,
    historicBuilding: true,
    integratedIntoStadium: true,
    leftFieldFoulPole: true,
    fourLevels: true
  },
  parkAtThePark: {
    location: 'beyond_center_field',
    grassyKnoll: true,
    capacity: 2500,
    openDuringGames: true,
    viewGamesForFree: 'limited_view'
  },
  gallagherSquare: {
    yearRenamed: 2021,
    previousName: 'Park at the Park',
    concerts: true,
    events: true
  },
  theBeach: {
    location: 'right_center',
    sandArea: true,
    unique: true,
    familyFriendly: true
  },
  dimensions: {
    leftField: 334,
    leftCenter: 367,
    centerField: 396,
    rightCenter: 387,
    rightField: 322
  },
  downtownLocation: {
    gaslampQuarter: true,
    walkableFromDowntown: true,
    cityViews: true
  }
};
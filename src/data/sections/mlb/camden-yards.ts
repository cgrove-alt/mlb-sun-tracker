// Oriole Park at Camden Yards - Complete Section Data with 3D Geometry
// Baltimore, MD - Opened 1992 - Capacity 45,971
// Home of the Baltimore Orioles

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

// Camden Yards Sections
export const camdenYardsSections: DetailedSection[] = [
  // ========== FIELD BOX ==========
  {
    id: '14',
    name: 'Field Box 14',
    level: 'field',
    baseAngle: 58, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 19, false),
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
    id: '52',
    name: 'Field Box 52',
    level: 'field',
    baseAngle: 103, // First base line
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 19, false),
    vertices3D: [
      { x: 60, y: 60, z: 0 },
      { x: 75, y: 45, z: 0 },
      { x: 88, y: 58, z: 14 },
      { x: 73, y: 73, z: 14 }
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

  // ========== LOWER BOX ==========
  {
    id: '7',
    name: 'Lower Box 7',
    level: 'lower',
    baseAngle: 58,
    angleSpan: 9,
    rows: generateRows(1, 33, 22, 14, 23, false),
    vertices3D: [
      { x: -18, y: 88, z: 14 },
      { x: -5, y: 88, z: 14 },
      { x: -5, y: 125, z: 36 },
      { x: -18, y: 125, z: 36 }
    ],
    covered: false,
    price: 'moderate',
    distance: 107,
    height: 14,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '61',
    name: 'Lower Box 61',
    level: 'lower',
    baseAngle: 13, // Third base line
    angleSpan: 9,
    rows: generateRows(1, 33, 22, 14, 23, false),
    vertices3D: [
      { x: -88, y: 18, z: 14 },
      { x: -88, y: 5, z: 14 },
      { x: -125, y: 5, z: 36 },
      { x: -125, y: 18, z: 36 }
    ],
    covered: false,
    price: 'moderate',
    distance: 107,
    height: 14,
    rake: 23,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== TERRACE BOX ==========
  {
    id: '210',
    name: 'Terrace Box 210',
    level: 'club',
    baseAngle: 58,
    angleSpan: 10,
    rows: generateRows('A', 'N', 18, 36, 21, true),
    vertices3D: [
      { x: -22, y: 125, z: 36 },
      { x: -8, y: 125, z: 36 },
      { x: -8, y: 155, z: 52 },
      { x: -22, y: 155, z: 52 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
      coveragePercentage: 50,
      overhangDepth: 20,
      overhangHeight: 18,
      material: 'solid'
    },
    price: 'premium',
    distance: 140,
    height: 36,
    rake: 21,
    seatWidth: 20,
    rowSpacing: 35,
    viewQuality: 'excellent'
  },

  // ========== UPPER DECK ==========
  {
    id: '312',
    name: 'Upper Deck 312',
    level: 'upper',
    baseAngle: 58,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 52, 30, true),
    vertices3D: [
      { x: -30, y: 155, z: 52 },
      { x: -12, y: 155, z: 52 },
      { x: -10, y: 210, z: 95 },
      { x: -28, y: 210, z: 95 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 54,
      overhangDepth: 28,
      overhangHeight: 25,
      material: 'solid'
    },
    price: 'value',
    distance: 183,
    height: 52,
    rake: 30,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '368',
    name: 'Upper Deck 368',
    level: 'upper',
    baseAngle: 148, // Right field
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 52, 30, true),
    vertices3D: [
      { x: 155, y: -30, z: 52 },
      { x: 155, y: -12, z: 52 },
      { x: 210, y: -10, z: 95 },
      { x: 210, y: -28, z: 95 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 54,
      overhangDepth: 28,
      overhangHeight: 25,
      material: 'solid'
    },
    price: 'value',
    distance: 183,
    height: 52,
    rake: 30,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== EUTAW STREET (Behind Right Field) ==========
  {
    id: 'EUTAW',
    name: 'Eutaw Street Reserve',
    level: 'standing',
    baseAngle: 148,
    angleSpan: 20,
    rows: [], // Standing room
    vertices3D: [
      { x: 130, y: -40, z: 0 },
      { x: 160, y: -60, z: 0 },
      { x: 160, y: -30, z: 0 },
      { x: 130, y: -10, z: 0 }
    ],
    covered: false,
    price: 'value',
    distance: 318, // Right field wall
    height: 0,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== WAREHOUSE BALCONY ==========
  {
    id: 'WH1',
    name: 'Warehouse Balcony 1',
    level: 'club',
    baseAngle: 148,
    angleSpan: 8,
    rows: generateRows('A', 'D', 12, 25, 0, true),
    vertices3D: [
      { x: 180, y: -50, z: 25 },
      { x: 200, y: -60, z: 25 },
      { x: 200, y: -45, z: 25 },
      { x: 180, y: -35, z: 25 }
    ],
    covered: true,
    price: 'luxury',
    distance: 440, // Behind right field wall
    height: 25,
    rake: 0,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'good',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Warehouse Entrance']
    }
  },

  // ========== LEFT FIELD BLEACHERS ==========
  {
    id: '84',
    name: 'Bleachers 84',
    level: 'field',
    baseAngle: 328, // Left field
    angleSpan: 14,
    rows: generateRows(1, 30, 28, 6, 22, false),
    vertices3D: [
      { x: -140, y: 300, z: 6 },
      { x: -110, y: 320, z: 6 },
      { x: -100, y: 350, z: 32 },
      { x: -130, y: 330, z: 32 }
    ],
    covered: false,
    price: 'value',
    distance: 333,
    height: 6,
    rake: 22,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: '86',
    name: 'Bleachers 86',
    level: 'field',
    baseAngle: 238, // Center field
    angleSpan: 14,
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

  // ========== DEMPSEY'S BREW PUB ==========
  {
    id: 'DEMP',
    name: "Dempsey's Brew Pub",
    level: 'standing',
    baseAngle: 238,
    angleSpan: 12,
    rows: [], // Standing/bar area
    vertices3D: [
      { x: 0, y: 410, z: 8 },
      { x: 30, y: 410, z: 8 },
      { x: 30, y: 430, z: 8 },
      { x: 0, y: 430, z: 8 }
    ],
    covered: false,
    price: 'moderate',
    distance: 420,
    height: 8,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== CLUB LEVEL ==========
  {
    id: 'CLUB244',
    name: 'Club Level 244',
    level: 'club',
    baseAngle: 58,
    angleSpan: 10,
    rows: generateRows('A', 'J', 16, 40, 18, true),
    vertices3D: [
      { x: -25, y: 135, z: 40 },
      { x: -10, y: 135, z: 40 },
      { x: -10, y: 160, z: 50 },
      { x: -25, y: 160, z: 50 }
    ],
    covered: true,
    price: 'luxury',
    distance: 148,
    height: 40,
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

  // ========== CAMDEN CLUB ==========
  {
    id: 'CC',
    name: 'Camden Club',
    level: 'suite',
    baseAngle: 58,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 36, elevation: 45, depth: 0, covered: true, overhangHeight: 25 }
    ],
    vertices3D: [
      { x: -20, y: 145, z: 45 },
      { x: 20, y: 145, z: 45 },
      { x: 20, y: 165, z: 45 },
      { x: -20, y: 165, z: 45 }
    ],
    covered: true,
    price: 'luxury',
    distance: 155,
    height: 45,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent'
  },

  // ========== FLAG COURT (Center Field) ==========
  {
    id: 'FLAG',
    name: 'Flag Court',
    level: 'field',
    baseAngle: 238,
    angleSpan: 15,
    rows: generateRows(1, 8, 30, 12, 15, false),
    vertices3D: [
      { x: -40, y: 395, z: 12 },
      { x: 40, y: 395, z: 12 },
      { x: 40, y: 410, z: 18 },
      { x: -40, y: 410, z: 18 }
    ],
    covered: false,
    price: 'moderate',
    distance: 403,
    height: 12,
    rake: 15,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const camdenYardsCapacity = camdenYardsSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const camdenYardsSectionMap = new Map(
  camdenYardsSections.map(section => [section.id, section])
);

// Stadium-specific features
export const camdenYardsFeatures = {
  warehouse: {
    builtIn: 1899,
    length: 1016, // feet
    longestBuilding: 'east_coast',
    integratedIntoStadium: true,
    offices: true,
    balconySeating: true
  },
  eutawStreet: {
    behindRightField: true,
    openDuringGames: true,
    homeRunPlaques: true,
    concessions: true,
    standingRoom: true
  },
  retroDesign: {
    opened: 1992,
    startedRetroTrend: true,
    brickFacade: true,
    steelTrusswork: true,
    asymmetricalField: true
  },
  dimensions: {
    leftField: 333,
    leftCenter: 364,
    centerField: 410,
    rightCenter: 373,
    rightField: 318
  },
  flagCourt: {
    location: 'center_field',
    bullpenView: true,
    standingRoom: true
  },
  picklesBar: {
    location: 'center_field',
    twoLevels: true,
    outdoorBar: true
  }
};
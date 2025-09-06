// Fenway Park - Complete Section Data with 3D Geometry
// Boston, MA - Opened 1912 - Capacity 37,755
// Home of the Boston Red Sox

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
  const rowHeight = 2.5; // feet between rows
  const rowDepth = 2.8; // feet front to back
  
  // Handle letter rows or numeric rows
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
        overhangHeight: covered ? 25 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 25 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Fenway Park Sections
export const fenwayParkSections: DetailedSection[] = [
  // ========== GREEN MONSTER SEATS ==========
  {
    id: 'M1',
    name: 'Green Monster 1',
    level: 'field',
    baseAngle: 225, // Left field wall
    angleSpan: 5,
    rows: generateRows(1, 3, 30, 37, 0, false), // On top of the wall
    vertices3D: [
      { x: -150, y: 310, z: 37 },
      { x: -140, y: 310, z: 37 },
      { x: -140, y: 315, z: 37 },
      { x: -150, y: 315, z: 37 }
    ],
    covered: false,
    price: 'luxury',
    distance: 310,
    height: 37, // Top of Green Monster
    rake: 0,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: false, // No wheelchair access on Monster
      companionSeats: 0,
      aisleSeats: true,
      tunnelAccess: ['Monster Entrance']
    }
  },

  {
    id: 'M2',
    name: 'Green Monster 2',
    level: 'field',
    baseAngle: 230,
    angleSpan: 5,
    rows: generateRows(1, 3, 30, 37, 0, false),
    vertices3D: [
      { x: -140, y: 310, z: 37 },
      { x: -130, y: 310, z: 37 },
      { x: -130, y: 315, z: 37 },
      { x: -140, y: 315, z: 37 }
    ],
    covered: false,
    price: 'luxury',
    distance: 310,
    height: 37,
    rake: 0,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent'
  },

  // ========== FIELD BOX ==========
  {
    id: '14',
    name: 'Field Box 14',
    level: 'field',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 20, false),
    vertices3D: [
      { x: -15, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 90, z: 15 },
      { x: -15, y: 90, z: 15 }
    ],
    covered: false,
    price: 'premium',
    distance: 75,
    height: 0,
    rake: 20,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'excellent'
  },

  {
    id: '20',
    name: 'Field Box 20',
    level: 'field',
    baseAngle: 45,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 20, 0, 20, false),
    vertices3D: [
      { x: 60, y: 60, z: 0 },
      { x: 75, y: 75, z: 0 },
      { x: 90, y: 90, z: 15 },
      { x: 75, y: 75, z: 15 }
    ],
    covered: false,
    price: 'premium',
    distance: 85,
    height: 0,
    rake: 20,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'excellent'
  },

  // ========== INFIELD GRANDSTAND ==========
  {
    id: '1',
    name: 'Grandstand 1',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 9,
    rows: generateRows(1, 45, 24, 15, 25, true), // Covered by upper deck
    vertices3D: [
      { x: -20, y: 90, z: 15 },
      { x: -5, y: 90, z: 15 },
      { x: -5, y: 140, z: 45 },
      { x: -20, y: 140, z: 45 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      coveragePercentage: 47,
      overhangDepth: 25,
      overhangHeight: 20,
      material: 'solid'
    },
    price: 'moderate',
    distance: 115,
    height: 15,
    rake: 25,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '10',
    name: 'Grandstand 10',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 9,
    rows: generateRows(1, 45, 24, 15, 25, true),
    vertices3D: [
      { x: -75, y: 75, z: 15 },
      { x: -60, y: 60, z: 15 },
      { x: -75, y: 75, z: 45 },
      { x: -90, y: 90, z: 45 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      coveragePercentage: 47,
      overhangDepth: 25,
      overhangHeight: 20,
      material: 'solid'
    },
    price: 'moderate',
    distance: 115,
    height: 15,
    rake: 25,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  // ========== PAVILION BOX ==========
  {
    id: 'PV1',
    name: 'Pavilion Box 1',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows(1, 30, 22, 10, 22, false),
    vertices3D: [
      { x: 140, y: 0, z: 10 },
      { x: 140, y: 20, z: 10 },
      { x: 170, y: 20, z: 28 },
      { x: 170, y: 0, z: 28 }
    ],
    covered: false,
    price: 'moderate',
    distance: 140,
    height: 10,
    rake: 22,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== RIGHT FIELD BOX (PESKY'S POLE) ==========
  {
    id: 'RF1',
    name: 'Right Field Box 1',
    level: 'field',
    baseAngle: 135, // Pesky's Pole area
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 0, 18, false),
    vertices3D: [
      { x: 150, y: 150, z: 0 },
      { x: 165, y: 135, z: 0 },
      { x: 180, y: 150, z: 10 },
      { x: 165, y: 165, z: 10 }
    ],
    covered: false,
    price: 'value',
    distance: 302, // Pesky's Pole distance
    height: 0,
    rake: 18,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair' // Extreme angle
  },

  // ========== BLEACHERS ==========
  {
    id: 'BL34',
    name: 'Bleacher 34',
    level: 'field',
    baseAngle: 180, // Center field
    angleSpan: 12,
    rows: generateRows(1, 40, 26, 5, 20, false),
    vertices3D: [
      { x: -30, y: 390, z: 5 },
      { x: 0, y: 390, z: 5 },
      { x: 0, y: 420, z: 30 },
      { x: -30, y: 420, z: 30 }
    ],
    covered: false,
    price: 'value',
    distance: 405,
    height: 5,
    rake: 20,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  {
    id: 'BL42',
    name: 'Bleacher 42',
    level: 'field',
    baseAngle: 160,
    angleSpan: 12,
    rows: generateRows(1, 40, 26, 5, 20, false),
    vertices3D: [
      { x: 60, y: 370, z: 5 },
      { x: 90, y: 350, z: 5 },
      { x: 100, y: 380, z: 30 },
      { x: 70, y: 400, z: 30 }
    ],
    covered: false,
    price: 'value',
    distance: 380,
    height: 5,
    rake: 20,
    seatWidth: 18,
    rowSpacing: 28,
    viewQuality: 'fair'
  },

  // ========== PAVILION LEVEL ==========
  {
    id: 'PV-U1',
    name: 'Upper Pavilion 1',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows(1, 25, 24, 45, 30, true),
    vertices3D: [
      { x: 140, y: 0, z: 45 },
      { x: 140, y: 20, z: 45 },
      { x: 180, y: 20, z: 75 },
      { x: 180, y: 0, z: 75 }
    ],
    covered: true,
    price: 'value',
    distance: 160,
    height: 45,
    rake: 30,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  // ========== ROOF DECK ==========
  {
    id: 'ROOF',
    name: 'Pavilion Roof Deck',
    level: 'upper',
    baseAngle: 100,
    angleSpan: 15,
    rows: [], // Standing room/tables
    vertices3D: [
      { x: 180, y: -20, z: 75 },
      { x: 180, y: 20, z: 75 },
      { x: 200, y: 20, z: 75 },
      { x: 200, y: -20, z: 75 }
    ],
    covered: false, // Open-air roof deck
    price: 'premium',
    distance: 190,
    height: 75,
    rake: 0,
    viewQuality: 'good',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 0,
      aisleSeats: false,
      tunnelAccess: ['Roof Deck Elevator']
    }
  },

  // ========== EMC CLUB ==========
  {
    id: 'EMC',
    name: 'EMC Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'L', 16, 25, 15, true),
    vertices3D: [
      { x: -30, y: 100, z: 25 },
      { x: 30, y: 100, z: 25 },
      { x: 30, y: 130, z: 35 },
      { x: -30, y: 130, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 115,
    height: 25,
    rake: 15,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 8,
      aisleSeats: true,
      tunnelAccess: ['EMC Club Entrance']
    }
  },

  // ========== STATE STREET PAVILION ==========
  {
    id: 'SSP',
    name: 'State Street Pavilion',
    level: 'club',
    baseAngle: 45,
    angleSpan: 15,
    rows: generateRows('A', 'H', 20, 20, 12, true),
    vertices3D: [
      { x: 90, y: 90, z: 20 },
      { x: 110, y: 70, z: 20 },
      { x: 120, y: 80, z: 28 },
      { x: 100, y: 100, z: 28 }
    ],
    covered: true,
    price: 'luxury',
    distance: 130,
    height: 20,
    rake: 12,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  }
];

// Calculate total capacity
export const fenwayParkCapacity = fenwayParkSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const fenwayParkSectionMap = new Map(
  fenwayParkSections.map(section => [section.id, section])
);

// Stadium-specific features
export const fenwayParkFeatures = {
  greenMonster: {
    height: 37,
    distance: 310,
    material: 'metal',
    color: '#006747',
    manualScoreboard: true,
    seatsOnTop: true
  },
  peskyPole: {
    distance: 302,
    angle: 135,
    height: 27,
    yellowLine: true
  },
  triangleSeats: {
    location: 'center_field',
    distance: 420,
    uniqueAngle: true
  },
  fenwayFranks: {
    location: 'everywhere',
    traditional: true
  }
};
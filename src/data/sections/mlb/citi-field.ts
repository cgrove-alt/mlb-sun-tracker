// Citi Field - Complete Section Data with 3D Geometry
// Queens, NY - Opened 2009 - Capacity 41,922
// Home of the New York Mets

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

// Citi Field Sections
export const citiFieldSections: DetailedSection[] = [
  // ========== CHAMPIONS CLUB (Behind Home Plate) ==========
  {
    id: 'CC15',
    name: 'Champions Club 15',
    level: 'field',
    baseAngle: 0,
    angleSpan: 7,
    rows: generateRows('A', 'P', 16, 0, 18, false),
    vertices3D: [
      { x: -10, y: 62, z: 0 },
      { x: 0, y: 62, z: 0 },
      { x: 0, y: 88, z: 12 },
      { x: -10, y: 88, z: 12 }
    ],
    covered: false,
    price: 'luxury',
    distance: 75,
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

  // ========== FIELD LEVEL ==========
  {
    id: '111',
    name: 'Field Level 111',
    level: 'field',
    baseAngle: 0,
    angleSpan: 9,
    rows: generateRows(1, 32, 22, 0, 20, false),
    vertices3D: [
      { x: -18, y: 70, z: 0 },
      { x: -5, y: 70, z: 0 },
      { x: -5, y: 100, z: 17 },
      { x: -18, y: 100, z: 17 }
    ],
    covered: false,
    price: 'premium',
    distance: 85,
    height: 0,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  {
    id: '125',
    name: 'Field Level 125',
    level: 'field',
    baseAngle: 45,
    angleSpan: 9,
    rows: generateRows(1, 32, 22, 0, 20, false),
    vertices3D: [
      { x: 70, y: 70, z: 0 },
      { x: 85, y: 85, z: 0 },
      { x: 100, y: 100, z: 17 },
      { x: 85, y: 85, z: 17 }
    ],
    covered: false,
    price: 'premium',
    distance: 99,
    height: 0,
    rake: 20,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== EXCELSIOR LEVEL ==========
  {
    id: '301',
    name: 'Excelsior Level 301',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows(1, 24, 24, 17, 24, false),
    vertices3D: [
      { x: -22, y: 100, z: 17 },
      { x: -8, y: 100, z: 17 },
      { x: -8, y: 135, z: 38 },
      { x: -22, y: 135, z: 38 }
    ],
    covered: false,
    price: 'moderate',
    distance: 118,
    height: 17,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  {
    id: '327',
    name: 'Excelsior Level 327',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows(1, 24, 24, 17, 24, false),
    vertices3D: [
      { x: 100, y: 22, z: 17 },
      { x: 100, y: 8, z: 17 },
      { x: 135, y: 8, z: 38 },
      { x: 135, y: 22, z: 38 }
    ],
    covered: false,
    price: 'moderate',
    distance: 118,
    height: 17,
    rake: 24,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'good'
  },

  // ========== PROMENADE LEVEL ==========
  {
    id: '401',
    name: 'Promenade Level 401',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 11,
    rows: generateRows(1, 30, 26, 38, 28, true),
    vertices3D: [
      { x: -28, y: 135, z: 38 },
      { x: -12, y: 135, z: 38 },
      { x: -10, y: 185, z: 75 },
      { x: -26, y: 185, z: 75 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      coveragePercentage: 53,
      overhangDepth: 25,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'value',
    distance: 160,
    height: 38,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '427',
    name: 'Promenade Level 427',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 11,
    rows: generateRows(1, 30, 26, 38, 28, true),
    vertices3D: [
      { x: 135, y: 28, z: 38 },
      { x: 135, y: 12, z: 38 },
      { x: 185, y: 10, z: 75 },
      { x: 185, y: 26, z: 75 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      coveragePercentage: 53,
      overhangDepth: 25,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'value',
    distance: 160,
    height: 38,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== PEPSI PORCH ==========
  {
    id: 'PP102',
    name: 'Pepsi Porch 102',
    level: 'field',
    baseAngle: 135, // Right field
    angleSpan: 12,
    rows: generateRows(1, 20, 24, 8, 21, false),
    vertices3D: [
      { x: 145, y: 290, z: 8 },
      { x: 120, y: 315, z: 8 },
      { x: 110, y: 340, z: 28 },
      { x: 135, y: 315, z: 28 }
    ],
    covered: false,
    price: 'moderate',
    distance: 330,
    height: 8,
    rake: 21,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  },

  // ========== COCA-COLA CORNER ==========
  {
    id: 'CCC',
    name: 'Coca-Cola Corner',
    level: 'field',
    baseAngle: 225, // Left field
    angleSpan: 12,
    rows: generateRows(1, 22, 26, 8, 21, false),
    vertices3D: [
      { x: -145, y: 290, z: 8 },
      { x: -120, y: 315, z: 8 },
      { x: -110, y: 340, z: 28 },
      { x: -135, y: 315, z: 28 }
    ],
    covered: false,
    price: 'moderate',
    distance: 330,
    height: 8,
    rake: 21,
    seatWidth: 19,
    rowSpacing: 32,
    viewQuality: 'fair'
  },

  // ========== JIM BEAM HIGHBALL CLUB ==========
  {
    id: 'JB',
    name: 'Jim Beam Highball Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 10,
    rows: generateRows('A', 'L', 18, 25, 18, true),
    vertices3D: [
      { x: 85, y: 85, z: 25 },
      { x: 100, y: 70, z: 25 },
      { x: 110, y: 80, z: 35 },
      { x: 95, y: 95, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 120,
    height: 25,
    rake: 18,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== PORSCHE GRILLE ==========
  {
    id: 'PG',
    name: 'Porsche Grille',
    level: 'club',
    baseAngle: 315,
    angleSpan: 10,
    rows: generateRows('A', 'L', 18, 25, 18, true),
    vertices3D: [
      { x: -85, y: 85, z: 25 },
      { x: -100, y: 70, z: 25 },
      { x: -110, y: 80, z: 35 },
      { x: -95, y: 95, z: 35 }
    ],
    covered: true,
    price: 'luxury',
    distance: 120,
    height: 25,
    rake: 18,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== SHEA BRIDGE ==========
  {
    id: 'SB',
    name: 'Shea Bridge',
    level: 'standing',
    baseAngle: 180, // Center field
    angleSpan: 15,
    rows: [], // Standing room only
    vertices3D: [
      { x: -35, y: 400, z: 30 },
      { x: 35, y: 400, z: 30 },
      { x: 35, y: 415, z: 30 },
      { x: -35, y: 415, z: 30 }
    ],
    covered: false,
    price: 'value',
    distance: 408,
    height: 30,
    rake: 0,
    viewQuality: 'fair'
  },

  // ========== DELTA SKY360 SUITE ==========
  {
    id: 'DS360',
    name: 'Delta Sky360 Suite',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 12,
    rows: [
      { rowNumber: 'Suite', seats: 30, elevation: 28, depth: 0, covered: true, overhangHeight: 18 }
    ],
    vertices3D: [
      { x: -25, y: 110, z: 28 },
      { x: 25, y: 110, z: 28 },
      { x: 25, y: 130, z: 28 },
      { x: -25, y: 130, z: 28 }
    ],
    covered: true,
    price: 'luxury',
    distance: 120,
    height: 28,
    rake: 0,
    seatWidth: 24,
    rowSpacing: 42,
    viewQuality: 'excellent',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 30,
      aisleSeats: false,
      tunnelAccess: ['Suite Entrance']
    }
  },

  // ========== PACIOLAN PAVILION ==========
  {
    id: 'PAV',
    name: 'Paciolan Pavilion',
    level: 'standing',
    baseAngle: 160, // Right center
    angleSpan: 10,
    rows: [], // Party deck
    vertices3D: [
      { x: 100, y: 350, z: 15 },
      { x: 130, y: 330, z: 15 },
      { x: 130, y: 345, z: 15 },
      { x: 100, y: 365, z: 15 }
    ],
    covered: false,
    price: 'moderate',
    distance: 365,
    height: 15,
    rake: 0,
    viewQuality: 'fair'
  }
];

// Calculate total capacity
export const citiFieldCapacity = citiFieldSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const citiFieldSectionMap = new Map(
  citiFieldSections.map(section => [section.id, section])
);

// Stadium-specific features
export const citiFieldFeatures = {
  homeRunApple: {
    location: 'center_field',
    height: 18, // feet when raised
    activates: 'on_mets_homerun',
    iconic: true
  },
  sheaBridge: {
    location: 'center_field',
    tribute_to: 'Shea Stadium',
    standing_room: true
  },
  jackieRobinsonRotunda: {
    entrance: 'main',
    tribute: true,
    number: 42
  },
  pepsiPorch: {
    distance: 330, // right field
    unique_dimension: true,
    party_deck: true
  },
  citiVision: {
    width: 130,
    height: 40,
    led: true,
    hd: true
  }
};
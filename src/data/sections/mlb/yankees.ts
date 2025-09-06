// Yankee Stadium - Complete Section Data with 3D Geometry
// Bronx, NY - Opened 2009

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details
function generateRows(
  startRow: number,
  endRow: number,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5; // feet between rows
  const rowDepth = 2.8; // feet front to back
  
  for (let i = startRow; i <= endRow; i++) {
    const rowNum = i - startRow;
    rows.push({
      rowNumber: i.toString(),
      seats: seatsPerRow,
      elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
      depth: rowNum * rowDepth,
      covered: covered,
      overhangHeight: covered ? 25 - (rowNum * 0.5) : undefined
    });
  }
  
  return rows;
}

// Yankee Stadium Sections
export const yankeeStadiumSections: DetailedSection[] = [
  // ========== LEGENDS SUITE LEVEL (Field Level Behind Home) ==========
  {
    id: '011',
    name: 'Legends Suite 11',
    level: 'field',
    baseAngle: 350,
    angleSpan: 10,
    rows: [
      { rowNumber: 'A', seats: 18, elevation: 0, depth: 0, covered: false },
      { rowNumber: 'B', seats: 18, elevation: 2.5, depth: 2.8, covered: false },
      { rowNumber: 'C', seats: 18, elevation: 5.0, depth: 5.6, covered: false },
      { rowNumber: 'D', seats: 18, elevation: 7.5, depth: 8.4, covered: false },
      { rowNumber: 'E', seats: 18, elevation: 10.0, depth: 11.2, covered: false },
      { rowNumber: 'F', seats: 18, elevation: 12.5, depth: 14.0, covered: false },
      { rowNumber: 'G', seats: 18, elevation: 15.0, depth: 16.8, covered: false },
      { rowNumber: 'H', seats: 18, elevation: 17.5, depth: 19.6, covered: false }
    ],
    vertices3D: [
      { x: -30, y: 60, z: 0 },
      { x: -20, y: 60, z: 0 },
      { x: -20, y: 80, z: 17.5 },
      { x: -30, y: 80, z: 17.5 }
    ],
    covered: false,
    price: 'luxury',
    distance: 65,
    height: 0,
    rake: 25,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  
  {
    id: '012',
    name: 'Legends Suite 12',
    level: 'field',
    baseAngle: 0,
    angleSpan: 10,
    rows: generateRows(1, 8, 18, 0, 25, false).map((row, i) => ({
      ...row,
      rowNumber: String.fromCharCode(65 + i) // A-H
    })),
    vertices3D: [
      { x: -20, y: 60, z: 0 },
      { x: -10, y: 60, z: 0 },
      { x: -10, y: 80, z: 17.5 },
      { x: -20, y: 80, z: 17.5 }
    ],
    covered: false,
    price: 'luxury',
    distance: 65,
    height: 0,
    rake: 25,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  {
    id: '013',
    name: 'Legends Suite 13',
    level: 'field',
    baseAngle: 10,
    angleSpan: 10,
    rows: generateRows(1, 8, 18, 0, 25, false).map((row, i) => ({
      ...row,
      rowNumber: String.fromCharCode(65 + i)
    })),
    vertices3D: [
      { x: -10, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 80, z: 17.5 },
      { x: -10, y: 80, z: 17.5 }
    ],
    covered: false,
    price: 'luxury',
    distance: 65,
    height: 0,
    rake: 25,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },

  // ========== FIELD MVP SECTIONS (Field Level Baseline) ==========
  {
    id: '115',
    name: 'Field MVP 115',
    level: 'field',
    baseAngle: 30,
    angleSpan: 8,
    rows: generateRows(1, 14, 20, 0, 22, false),
    vertices3D: [
      { x: 20, y: 70, z: 0 },
      { x: 30, y: 75, z: 0 },
      { x: 35, y: 95, z: 28 },
      { x: 25, y: 90, z: 28 }
    ],
    covered: false,
    price: 'premium',
    distance: 75,
    height: 0,
    rake: 22,
    seatWidth: 20,
    rowSpacing: 34,
    viewQuality: 'excellent'
  },

  // ========== MAIN LEVEL (200 Level) ==========
  {
    id: '210',
    name: 'Main Level 210',
    level: 'lower',
    baseAngle: 350,
    angleSpan: 8,
    rows: [
      ...generateRows(1, 10, 22, 25, 28, false),
      ...generateRows(11, 23, 22, 45, 28, true) // Back rows covered
    ],
    vertices3D: [
      { x: -40, y: 100, z: 25 },
      { x: -30, y: 100, z: 25 },
      { x: -25, y: 140, z: 65 },
      { x: -35, y: 140, z: 65 }
    ],
    covered: false,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      coveragePercentage: 57,
      overhangDepth: 35,
      overhangHeight: 20,
      material: 'solid'
    },
    price: 'moderate',
    distance: 120,
    height: 25,
    rake: 28,
    seatWidth: 19,
    rowSpacing: 33,
    viewQuality: 'good'
  },

  // ========== TERRACE LEVEL (300 Level) ==========
  {
    id: '305',
    name: 'Terrace 305',
    level: 'upper',
    baseAngle: 350,
    angleSpan: 7,
    rows: [
      ...generateRows(1, 8, 24, 65, 32, false),
      ...generateRows(9, 16, 24, 85, 32, true) // Back half covered
    ],
    vertices3D: [
      { x: -45, y: 140, z: 65 },
      { x: -35, y: 140, z: 65 },
      { x: -30, y: 180, z: 110 },
      { x: -40, y: 180, z: 110 }
    ],
    covered: false,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['9', '10', '11', '12', '13', '14', '15', '16'],
      coveragePercentage: 50,
      overhangDepth: 25,
      overhangHeight: 15,
      material: 'solid'
    },
    price: 'value',
    distance: 160,
    height: 65,
    rake: 32,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  // ========== GRANDSTAND LEVEL (400 Level) ==========
  {
    id: '405',
    name: 'Grandstand 405',
    level: 'upper',
    baseAngle: 350,
    angleSpan: 6,
    rows: [
      ...generateRows(1, 6, 26, 110, 35, false),
      ...generateRows(7, 14, 26, 135, 35, true) // Back rows covered by roof
    ],
    vertices3D: [
      { x: -50, y: 180, z: 110 },
      { x: -40, y: 180, z: 110 },
      { x: -35, y: 220, z: 160 },
      { x: -45, y: 220, z: 160 }
    ],
    covered: false,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['7', '8', '9', '10', '11', '12', '13', '14'],
      coveragePercentage: 57,
      overhangDepth: 30,
      overhangHeight: 25,
      material: 'solid'
    },
    price: 'value',
    distance: 200,
    height: 110,
    rake: 35,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== BLEACHERS (Outfield) ==========
  {
    id: '201',
    name: 'Bleachers 201',
    level: 'lower',
    baseAngle: 135,
    angleSpan: 10,
    rows: generateRows(1, 24, 30, 15, 25, false),
    vertices3D: [
      { x: 250, y: 250, z: 15 },
      { x: 280, y: 230, z: 15 },
      { x: 290, y: 260, z: 55 },
      { x: 260, y: 280, z: 55 }
    ],
    covered: false,
    price: 'value',
    distance: 350,
    height: 15,
    rake: 25,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair',
    accessibility: {
      wheelchairAccessible: true,
      companionSeats: 4,
      aisleSeats: true,
      tunnelAccess: ['Tunnel 201A', 'Tunnel 201B']
    }
  },

  // ========== MONUMENT PARK (Standing Room) ==========
  {
    id: 'MONUMENT',
    name: 'Monument Park Standing',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 20,
    rows: [], // Standing room only
    vertices3D: [
      { x: 380, y: -20, z: 0 },
      { x: 420, y: -20, z: 0 },
      { x: 420, y: 20, z: 0 },
      { x: 380, y: 20, z: 0 }
    ],
    covered: false,
    price: 'value',
    distance: 400,
    height: 0,
    rake: 0,
    viewQuality: 'obstructed',
    obstructedSeats: ['All - center field wall blocks view of infield']
  }
];

// Calculate total capacity
export const yankeeStadiumCapacity = yankeeStadiumSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const yankeeStadiumSectionMap = new Map(
  yankeeStadiumSections.map(section => [section.id, section])
);

// Stadium-specific features
export const yankeeStadiumFeatures = {
  frieze: {
    height: 110,
    location: 'upper_deck_facade',
    castsShadow: true
  },
  monumentPark: {
    location: 'center_field',
    height: 10,
    affectsSections: ['201', '202', '203']
  },
  mohegan_sun_terrace: {
    location: 'right_field',
    covered: true,
    sections: ['104', '105']
  }
};
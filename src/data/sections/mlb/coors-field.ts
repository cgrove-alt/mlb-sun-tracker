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
  // Infield Box 117
  {
    id: '117',
    name: 'Infield Box 117',
    level: 'field',
    baseAngle: 40,
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 19, false),
    vertices3D: [
      { x: -12, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 88, z: 14 },
      { x: -12, y: 88, z: 14 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 19
  },
  // Outfield Box 157
  {
    id: '157',
    name: 'Outfield Box 157',
    level: 'field',
    baseAngle: 310,
    angleSpan: 9,
    rows: generateRows(1, 35, 24, 0, 21, false),
    vertices3D: [
      { x: -88, y: -20, z: 0 },
      { x: -103, y: -35, z: 0 },
      { x: -120, y: -18, z: 19 },
      { x: -105, y: -3, z: 19 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 0,
    rake: 21
  },
  // Rockpile (Center Field Bleachers)
  {
    id: 'ROCK',
    name: 'Rockpile',
    level: 'field',
    baseAngle: 220,
    angleSpan: 18,
    rows: generateRows(1, 40, 30, 8, 23, false),
    vertices3D: [
      { x: -40, y: 470, z: 8 },
      { x: 40, y: 470, z: 8 },
      { x: 40, y: 510, z: 38 },
      { x: -40, y: 510, z: 38 }
    ] as Vector3D[],
    covered: false,
    distance: 490,
    height: 8,
    rake: 23
  },
  // Upper Mezzanine 343
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
    ] as Vector3D[],
    covered: true,
    distance: 165,
    height: 42,
    rake: 29,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
      coveragePercentage: 50,
      overhangDepth: 28,
      overhangHeight: 25,
      material: 'solid'
    }
  },
  // Rooftop Bar
  {
    id: 'ROOF1',
    name: 'Rooftop Bar',
    level: 'standing',
    baseAngle: 175,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: 135, y: -60, z: 48 },
      { x: 165, y: -80, z: 48 },
      { x: 165, y: -55, z: 48 },
      { x: 135, y: -35, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 150,
    height: 48,
    rake: 0
  },
  // Purple Row - Mile High
  {
    id: 'PURPLE',
    name: 'Purple Row - Mile High',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 360,
    rows: [
      { rowNumber: "20", seats: 100, elevation: 88.0, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -180, y: 88, z: 180 },
      { x: 180, y: 88, z: 180 },
      { x: 180, y: 90, z: 200 },
      { x: -180, y: 90, z: 200 }
    ] as Vector3D[],
    covered: false,
    distance: 250,
    height: 88.0,
    rake: 35
  },
  // Jack Daniels Terrace Bar
  {
    id: 'JDBAR',
    name: 'Jack Daniels Terrace Bar',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 95.0, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 150, y: 95, z: 380 },
      { x: 180, y: 95, z: 400 },
      { x: 180, y: 95, z: 420 },
      { x: 150, y: 95, z: 400 }
    ] as Vector3D[],
    covered: false,
    distance: 420,
    height: 95.0,
    rake: 0
  },
  // Coors Light Silver Bullet Bar
  {
    id: 'SILVER',
    name: 'Coors Light Silver Bullet Bar',
    level: 'field',
    baseAngle: 270,
    angleSpan: 20,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 12.0, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -160, y: 12, z: 300 },
      { x: -140, y: 12, z: 320 },
      { x: -140, y: 12, z: 340 },
      { x: -160, y: 12, z: 320 }
    ] as Vector3D[],
    covered: false,
    distance: 330,
    height: 12.0,
    rake: 0
  }
];

// Stadium features
export const coorsFieldFeatures = {
  retractableRoof: false,
  roofHeight: 0, // Open-air stadium
  elevation: 5280, // Mile High elevation
  roofMaterial: {
    opacity: 0.0, // Open air
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const coorsFieldSectionMap = new Map(
  coorsFieldSections.map(section => [section.id, section])
);

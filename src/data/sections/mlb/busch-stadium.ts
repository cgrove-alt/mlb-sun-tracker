import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Busch Stadium - St. Louis Cardinals
// Opened: 2006
// Capacity: 44,494
// Orientation: 92° (Home plate to center field - Nearly due East)
// Famous features: Gateway Arch view, Ballpark Village, Big Mac Land, Cardinals Nation

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.3), // Slight reduction in upper rows
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: false
    });
  }
  
  return rows;
export const buschStadiumSections: DetailedSection[] = [
  // Green Seats - Behind Home Plate
  {
    id: 'green-seats',
    name: 'Green Seats',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'P', 24, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 40, z: 50 },
      { x: -35, y: 40, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Field Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 55, z: 82 },
      { x: 35, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Field Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 55, z: 82 },
      { x: -35, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Cardinals Nation Rooftop (Center Field)
  {
    id: 'cardinals-nation',
    name: 'Cardinals Nation',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -40, y: 120, z: 400 },
      { x: 40, y: 120, z: 400 },
      { x: 40, y: 120, z: 430 },
      { x: -40, y: 120, z: 430 }
    ] as Vector3D[],
    covered: false,
    distance: 420,
    height: 120,
    rake: 0
  },
  // Big Mac Land (Left Field)
  {
    id: 'big-mac-land',
    name: 'Big Mac Land',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'S', 24, 20, 2.5, 20),
    vertices3D: [
      { x: -150, y: 20, z: 280 },
      { x: -120, y: 20, z: 320 },
      { x: -125, y: 67.5, z: 367.5 },
      { x: -155, y: 67.5, z: 327.5 }
    ] as Vector3D[],
    covered: false,
    distance: 335,
    height: 20,
    rake: 20
  },
  // Budweiser Terrace (Right Field)
  {
    id: 'budweiser-terrace',
    name: 'Budweiser Terrace',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'K', 20, 35, 2.5, 18),
    vertices3D: [
      { x: 120, y: 35, z: 300 },
      { x: 150, y: 35, z: 330 },
      { x: 155, y: 62.5, z: 357.5 },
      { x: 125, y: 62.5, z: 327.5 }
    ] as Vector3D[],
    covered: false,
    distance: 325,
    height: 35,
    rake: 18
  },
  // Redbird Club
  {
    id: 'redbird-club',
    name: 'Redbird Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices3D: [
      { x: 40, y: 75, z: 70 },
      { x: 125, y: 75, z: 95 },
      { x: 130, y: 114, z: 134 },
      { x: 45, y: 114, z: 109 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 75,
    rake: 12
  },
  // Champions Club
  {
    id: 'champions-club',
    name: 'Champions Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices3D: [
      { x: -40, y: 75, z: 70 },
      { x: -125, y: 75, z: 95 },
      { x: -130, y: 114, z: 134 },
      { x: -45, y: 114, z: 109 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 75,
    rake: 12
  }
];

// Stadium features
export const buschStadiumFeatures = {
  retractableRoof: false,
  roofHeight: 140,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const buschStadiumSectionMap = new Map(
  buschStadiumSections.map(section => [section.id, section])
);

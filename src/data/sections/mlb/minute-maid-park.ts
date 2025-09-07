import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Minute Maid Park (Daikin Park as of 2025) - Houston Astros
// Opened: 2000
// Capacity: 41,168
// Orientation: 18° (Home plate to center field)
// Features: Retractable roof, Train on track, Crawford Boxes, Tal's Hill (removed)

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
      seats: seatsPerRow - Math.floor(rowNum * 0.3),
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: true // Retractable roof
    });
  }
  
  return rows;
};

export const minuteMaidParkSections: DetailedSection[] = [
  // Diamond Club - Behind Home Plate
  {
    id: 'diamond-club',
    name: 'Diamond Club',
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
    covered: true,
    distance: 50,
    height: 2,
    rake: 10
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
    covered: true,
    distance: 60,
    height: 2,
    rake: 11
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
    covered: true,
    distance: 60,
    height: 2,
    rake: 11
  },
  // Crawford Boxes (Left Field)
  {
    id: 'crawford-boxes',
    name: 'Crawford Boxes',
    level: 'field',
    baseAngle: 225,
    angleSpan: 35,
    rows: generateRows('A', 'M', 20, 8, 2.5, 18),
    vertices3D: [
      { x: -135, y: 8, z: 315 },
      { x: -105, y: 8, z: 340 },
      { x: -110, y: 40, z: 372 },
      { x: -140, y: 40, z: 347 }
    ] as Vector3D[],
    covered: true,
    distance: 330,
    height: 8,
    rake: 18
  },
  // Train Deck (Left Field)
  {
    id: 'train-deck',
    name: 'Train Deck',
    level: 'upper',
    baseAngle: 270,
    angleSpan: 20,
    rows: [
      { rowNumber: "TRAIN", seats: 100, elevation: 85, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -90, y: 85, z: 380 },
      { x: -60, y: 85, z: 400 },
      { x: -60, y: 95, z: 410 },
      { x: -90, y: 95, z: 390 }
    ] as Vector3D[],
    covered: true,
    distance: 395,
    height: 85,
    rake: 0
  },
  // Mezzanine
  {
    id: 'mezzanine',
    name: 'Mezzanine',
    level: 'club',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'N', 28, 65, 3, 12),
    vertices3D: [
      { x: 50, y: 65, z: 85 },
      { x: 135, y: 65, z: 105 },
      { x: 140, y: 107, z: 147 },
      { x: 55, y: 107, z: 127 }
    ] as Vector3D[],
    covered: true,
    distance: 110,
    height: 65,
    rake: 12
  },
  // Upper Deck
  {
    id: 'upper-deck',
    name: 'Upper Deck',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 180,
    rows: generateRows('A', 'Y', 28, 125, 3.5, 18),
    vertices3D: [
      { x: -100, y: 125, z: 150 },
      { x: 100, y: 125, z: 150 },
      { x: 105, y: 226, z: 251 },
      { x: -105, y: 226, z: 251 }
    ] as Vector3D[],
    covered: true,
    distance: 200,
    height: 125,
    rake: 18
  },
  // Torchy's Tacos Porch (Center Field)
  {
    id: 'torchys-porch',
    name: "Torchy's Tacos Porch",
    level: 'standing',
    baseAngle: 180,
    angleSpan: 40,
    rows: [
      { rowNumber: "PORCH", seats: 150, elevation: 25, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -40, y: 25, z: 400 },
      { x: 40, y: 25, z: 400 },
      { x: 40, y: 25, z: 430 },
      { x: -40, y: 25, z: 430 }
    ] as Vector3D[],
    covered: true,
    distance: 415,
    height: 25,
    rake: 0
  }
];

// Stadium features
export const minuteMaidParkFeatures = {
  retractableRoof: true,
  roofHeight: 242,
  roofMaterial: {
    opacity: 1.0,
    reflectivity: 0.4
  },
  climateControlled: true
};

// Export section map for easy lookup
export const minuteMaidParkSectionMap = new Map(
  minuteMaidParkSections.map(section => [section.id, section])
);
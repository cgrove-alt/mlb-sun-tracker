import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Sutter Health Park - Sacramento River Cats / Oakland Athletics (2025-2027)
// Opened: 2000
// Capacity: 14,014 (expanded for MLB)
// Orientation: 82° (Home plate to center field)
// Features: Temporary MLB home, River views, Intimate setting

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.2),
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: false
    });
  }
  
  return rows;
};

export const sutterHealthParkSections: DetailedSection[] = [
  // Field Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'N', 20, 2, 2.5, 10),
    vertices3D: [
      { x: -25, y: 2, z: 8 },
      { x: 25, y: 2, z: 8 },
      { x: 30, y: 35, z: 40 },
      { x: -30, y: 35, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 45,
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
    rows: generateRows('A', 'P', 18, 2, 2.5, 11),
    vertices3D: [
      { x: 25, y: 2, z: 8 },
      { x: 95, y: 2, z: 25 },
      { x: 100, y: 42.5, z: 65 },
      { x: 30, y: 42.5, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
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
    rows: generateRows('A', 'P', 18, 2, 2.5, 11),
    vertices3D: [
      { x: -25, y: 2, z: 8 },
      { x: -95, y: 2, z: 25 },
      { x: -100, y: 42.5, z: 65 },
      { x: -30, y: 42.5, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  // Solon Club (Premium Seating)
  {
    id: 'solon-club',
    name: 'Solon Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 60,
    rows: generateRows('A', 'H', 24, 25, 3, 12),
    vertices3D: [
      { x: -40, y: 25, z: 30 },
      { x: 40, y: 25, z: 30 },
      { x: 45, y: 49, z: 54 },
      { x: -45, y: 49, z: 54 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 25,
    rake: 12
  },
  // River View Deck (Left Field)
  {
    id: 'river-view-deck',
    name: 'River View Deck',
    level: 'field',
    baseAngle: 225,
    angleSpan: 40,
    rows: [
      { rowNumber: "DECK", seats: 150, elevation: 15, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -120, y: 15, z: 250 },
      { x: -90, y: 15, z: 280 },
      { x: -90, y: 15, z: 310 },
      { x: -120, y: 15, z: 280 }
    ] as Vector3D[],
    covered: false,
    distance: 295,
    height: 15,
    rake: 0
  },
  // Berm (Outfield)
  {
    id: 'berm',
    name: 'Outfield Berm',
    level: 'field',
    baseAngle: 180,
    angleSpan: 120,
    rows: [
      { rowNumber: "BERM", seats: 200, elevation: 8, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -70, y: 8, z: 320 },
      { x: 70, y: 8, z: 320 },
      { x: 75, y: 8, z: 360 },
      { x: -75, y: 8, z: 360 }
    ] as Vector3D[],
    covered: false,
    distance: 340,
    height: 8,
    rake: 0
  },
  // Upper Reserved
  {
    id: 'upper-reserved',
    name: 'Upper Reserved',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'R', 22, 45, 3, 15),
    vertices3D: [
      { x: -60, y: 45, z: 60 },
      { x: 60, y: 45, z: 60 },
      { x: 65, y: 99, z: 114 },
      { x: -65, y: 99, z: 114 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 45,
    rake: 15
  },
  // Party Deck (Right Field)
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "PARTY", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 100, y: 20, z: 270 },
      { x: 130, y: 20, z: 300 },
      { x: 130, y: 20, z: 330 },
      { x: 100, y: 20, z: 300 }
    ] as Vector3D[],
    covered: false,
    distance: 315,
    height: 20,
    rake: 0
  }
];

// Stadium features
export const sutterHealthParkFeatures = {
  retractableRoof: false,
  roofHeight: 0,
  roofMaterial: {
    opacity: 0.0,
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const sutterHealthParkSectionMap = new Map(
  sutterHealthParkSections.map(section => [section.id, section])
);
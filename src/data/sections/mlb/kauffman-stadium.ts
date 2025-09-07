import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Kauffman Stadium - Kansas City Royals
// Opened: 1973
// Capacity: 37,903
// Orientation: 58° (Home plate to center field)
// Famous features: Crown Vision Board, Fountains, Outfield Experience, Craft & Draft

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

    });
  }
  
  return rows;
  }
export const kauffmanStadiumSections: DetailedSection[] = [
  // Crown Club - Behind Home Plate
  {
    id: 'crown-club',
    name: 'Crown Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'R', 26, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 45, z: 55 },
      { x: -35, y: 45, z: 55 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Diamond Box - First Base
  {
    id: 'diamond-box-1b',
    name: 'Diamond Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'T', 20, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 115, y: 2, z: 28 },
      { x: 120, y: 50, z: 76 },
      { x: 35, y: 50, z: 58 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Diamond Box - Third Base
  {
    id: 'diamond-box-3b',
    name: 'Diamond Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'T', 20, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -115, y: 2, z: 28 },
      { x: -120, y: 50, z: 76 },
      { x: -35, y: 50, z: 58 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Outfield Experience (Center Field)
  {
    id: 'outfield-experience',
    name: 'Outfield Experience',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -40, y: 15, z: 395 },
      { x: 40, y: 15, z: 395 },
      { x: 40, y: 15, z: 425 },
      { x: -40, y: 15, z: 425 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Craft & Draft (Left Field)
  {
    id: 'craft-and-draft',
    name: 'Craft & Draft',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -120, y: 30, z: 320 },
      { x: -90, y: 30, z: 340 },
      { x: -90, y: 30, z: 365 },
      { x: -120, y: 30, z: 345 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Fountain Seats (Right-Center)
  {
    id: 'fountain-seats',
    name: 'Fountain Seats',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'H', 18, 20, 2.5, 18),
    vertices3D: [
      { x: 100, y: 20, z: 370 },
      { x: 130, y: 20, z: 390 },
      { x: 135, y: 40, z: 410 },
      { x: 105, y: 40, z: 390 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Hy-Vee Box Level - Behind Home
  {
    id: 'hyvee-box-home',
    name: 'Hy-Vee Box - Home Plate',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 55, 3, 13),
    vertices3D: [
      { x: -40, y: 55, z: 50 },
      { x: 40, y: 55, z: 50 },
      { x: 45, y: 118, z: 113 },
      { x: -45, y: 118, z: 113 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Hy-Vee Box Level - First Base
  {
    id: 'hyvee-box-1b',
    name: 'Hy-Vee Box - First Base',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'V', 25, 55, 3, 14),
    vertices3D: [
      { x: 45, y: 55, z: 55 },
      { x: 120, y: 55, z: 80 },
      { x: 125, y: 130, z: 155 },
      { x: 50, y: 130, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Hy-Vee Box Level - Third Base
  {
    id: 'hyvee-box-3b',
    name: 'Hy-Vee Box - Third Base',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'V', 25, 55, 3, 14),
    vertices3D: [
      { x: -45, y: 55, z: 55 },
      { x: -120, y: 55, z: 80 },
      { x: -125, y: 130, z: 155 },
      { x: -50, y: 130, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // View Level - Behind Home
  {
    id: 'view-level-home',
    name: 'View Level - Home Plate',
    level: 'View',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 135, 3.5, 16),
    vertices3D: [
      { x: -45, y: 135, z: 130 },
      { x: 45, y: 135, z: 130 },
      { x: 50, y: 229, z: 224 },
      { x: -50, y: 229, z: 224 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // View Level - First Base
  {
    id: 'view-level-1b',
    name: 'View Level - First Base',
    level: 'View',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 135, 3.5, 17),
    vertices3D: [
      { x: 50, y: 135, z: 140 },
      { x: 130, y: 135, z: 170 },
      { x: 135, y: 233, z: 268 },
      { x: 55, y: 233, z: 238 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // View Level - Third Base
  {
    id: 'view-level-3b',
    name: 'View Level - Third Base',
    level: 'View',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 135, 3.5, 17),
    vertices3D: [
      { x: -50, y: 135, z: 140 },
      { x: -130, y: 135, z: 170 },
      { x: -135, y: 233, z: 268 },
      { x: -55, y: 233, z: 238 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // General Admission - Left Field
  {
    id: 'ga-left-field',
    name: 'General Admission - Left Field',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'S', 22, 18, 2.5, 19),
    vertices3D: [
      { x: -145, y: 18, z: 280 },
      { x: -115, y: 18, z: 320 },
      { x: -120, y: 65.5, z: 367.5 },
      { x: -150, y: 65.5, z: 327.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // General Admission - Right Field
  {
    id: 'ga-right-field',
    name: 'General Admission - Right Field',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'S', 22, 18, 2.5, 19),
    vertices3D: [
      { x: 115, y: 18, z: 280 },
      { x: 145, y: 18, z: 320 },
      { x: 150, y: 65.5, z: 367.5 },
      { x: 120, y: 65.5, z: 327.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -55, y: 90, z: 85 },
      { x: 55, y: 90, z: 85 },
      { x: 55, y: 100, z: 95 },
      { x: -55, y: 100, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Rivals Sports Bar
  {
    id: 'rivals-sports-bar',
    name: 'Rivals Sports Bar',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 100, y: 35, z: 330 },
      { x: 130, y: 35, z: 350 },
      { x: 130, y: 35, z: 370 },
      { x: 100, y: 35, z: 350 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Pepsi Porch
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -80, y: 32, z: 350 },
      { x: -50, y: 32, z: 365 },
      { x: -50, y: 32, z: 385 },
      { x: -80, y: 32, z: 370 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Price Chopper Pavilion
  {
    id: 'price-chopper-pavilion',
    name: 'Price Chopper Pavilion',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'J', 16, 28, 2.5, 17),
    vertices3D: [
      { x: 80, y: 28, z: 360 },
      { x: 105, y: 28, z: 375 },
      { x: 110, y: 53, z: 400 },
      { x: 85, y: 53, z: 385 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Crown Vision Board Deck
  {
    id: 'crown-vision-deck',
    name: 'Crown Vision Board Deck',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -20, y: 45, z: 400 },
      { x: 20, y: 45, z: 400 },
      { x: 20, y: 45, z: 420 },
      { x: -20, y: 45, z: 420 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Dugout Suites
  {
    id: 'dugout-suites',
    name: 'Dugout Suites',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 50, y: 5, z: 15 },
      { x: 70, y: 5, z: 18 },
      { x: 70, y: 15, z: 28 },
      { x: 50, y: 15, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Buck O'Neil Legacy Seat
  {
    id: 'buck-oneil-seat',
    name: "Buck O'Neil Legacy Seat",
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true
  }
    ],
    vertices3D: [
      { x: -2, y: 8, z: 30 },
      { x: 2, y: 8, z: 30 },
      { x: 2, y: 8, z: 32 },
      { x: -2, y: 8, z: 32 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Craft & Draft
  {
    id: 'craft-and-draft',
    name: 'Craft & Draft',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -120, y: 25, z: 340 },
      { x: -90, y: 25, z: 360 },
      { x: -90, y: 35, z: 370 },
      { x: -120, y: 35, z: 350 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Crown Club
  {
    id: 'crown-club',
    name: 'Crown Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'K', 24, 65, 3, 28),
    vertices3D: [
      { x: -35, y: 65, z: 70 },
      { x: 35, y: 65, z: 70 },
      { x: 40, y: 98, z: 103 },
      { x: -40, y: 98, z: 103 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  }
];

// Stadium features
export const kauffmanStadiumFeatures = {
  retractableRoof: false,
  roofHeight: 130,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};;

// Export section map for easy lookup
export const kauffmanStadiumSectionMap = new Map(
  kauffmanStadiumSections.map(section => [section.id, section])
);

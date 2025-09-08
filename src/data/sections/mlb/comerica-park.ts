import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Comerica Park - Detroit Tigers
// Opened: 2000
// Capacity: 41,083
// Orientation: 145° (Home plate to center field - Southeast, unique angle)
// Famous features: Ferris wheel, Carousel, Tiger statues, Fountain

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
};
export const comericaParkSections: DetailedSection[] = [
  // Tiger Den - Behind Home Plate
  {
    id: 'tiger-den',
    name: 'Tiger Den',
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
  // On Deck Circle - First Base
  {
    id: 'on-deck-circle-1b',
    name: 'On Deck Circle - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'U', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 52.5, z: 79.5 },
      { x: 35, y: 52.5, z: 60.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // On Deck Circle - Third Base
  {
    id: 'on-deck-circle-3b',
    name: 'On Deck Circle - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'U', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 52.5, z: 79.5 },
      { x: -35, y: 52.5, z: 60.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Ferris Wheel Area (Center Field)
  {
    id: 'ferris-wheel-area',
    name: 'Ferris Wheel Area',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -30, y: 15, z: 415 },
      { x: 30, y: 15, z: 415 },
      { x: 30, y: 15, z: 440 },
      { x: -30, y: 15, z: 440 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Carousel Area (Center-Right Field)
  {
    id: 'carousel-area',
    name: 'Carousel Area',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 60, y: 15, z: 390 },
      { x: 90, y: 15, z: 405 },
      { x: 90, y: 15, z: 425 },
      { x: 60, y: 15, z: 410 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Pepsi Porch (Right Field)
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'L', 20, 28, 2.5, 18),
    vertices3D: [
      { x: 120, y: 28, z: 300 },
      { x: 150, y: 28, z: 330 },
      { x: 155, y: 58, z: 360 },
      { x: 125, y: 58, z: 330 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Kaline's Corner (Right Field)
  {
    id: 'kalines-corner',
    name: "Kaline's Corner",
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'J', 18, 22, 2.5, 19),
    vertices3D: [
      { x: 135, y: 22, z: 320 },
      { x: 160, y: 22, z: 345 },
      { x: 165, y: 47, z: 370 },
      { x: 140, y: 47, z: 345 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Club Level - Behind Home
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'N', 26, 75, 3, 12),
    vertices3D: [
      { x: -40, y: 75, z: 70 },
      { x: 40, y: 75, z: 70 },
      { x: 45, y: 117, z: 112 },
      { x: -45, y: 117, z: 112 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Tiger Club
  {
    id: 'tiger-club',
    name: 'Tiger Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices3D: [
      { x: 45, y: 75, z: 75 },
      { x: 125, y: 75, z: 100 },
      { x: 130, y: 114, z: 139 },
      { x: 50, y: 114, z: 114 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Mezzanine - Behind Home
  {
    id: 'mezzanine-home',
    name: 'Mezzanine - Home Plate',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'T', 23, 55, 3, 13),
    vertices3D: [
      { x: -38, y: 55, z: 50 },
      { x: 38, y: 55, z: 50 },
      { x: 43, y: 115, z: 110 },
      { x: -43, y: 115, z: 110 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Deck - Behind Home
  {
    id: 'upper-deck-home',
    name: 'Upper Deck - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 130, 3.5, 16),
    vertices3D: [
      { x: -45, y: 130, z: 125 },
      { x: 45, y: 130, z: 125 },
      { x: 50, y: 224, z: 219 },
      { x: -50, y: 224, z: 219 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Deck - First Base
  {
    id: 'upper-deck-1b',
    name: 'Upper Deck - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 130, 3.5, 17),
    vertices3D: [
      { x: 50, y: 130, z: 135 },
      { x: 135, y: 130, z: 165 },
      { x: 140, y: 228, z: 263 },
      { x: 55, y: 228, z: 233 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Deck - Third Base
  {
    id: 'upper-deck-3b',
    name: 'Upper Deck - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 130, 3.5, 17),
    vertices3D: [
      { x: -50, y: 130, z: 135 },
      { x: -135, y: 130, z: 165 },
      { x: -140, y: 228, z: 263 },
      { x: -55, y: 228, z: 233 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Left Field Bleachers',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'T', 24, 20, 2.5, 20),
    vertices3D: [
      { x: -150, y: 20, z: 290 },
      { x: -120, y: 20, z: 330 },
      { x: -125, y: 70, z: 380 },
      { x: -155, y: 70, z: 340 }
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
      { x: -60, y: 95, z: 90 },
      { x: 60, y: 95, z: 90 },
      { x: 60, y: 105, z: 100 },
      { x: -60, y: 105, z: 100 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Labatt Blue Light Jungle
  {
    id: 'labatt-jungle',
    name: 'Labatt Blue Light Jungle',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -90, y: 32, z: 360 },
      { x: -60, y: 32, z: 375 },
      { x: -60, y: 32, z: 395 },
      { x: -90, y: 32, z: 380 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Comerica Bank Fountain
  {
    id: 'fountain-area',
    name: 'Comerica Bank Fountain',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -15, y: 18, z: 400 },
      { x: 15, y: 18, z: 400 },
      { x: 15, y: 18, z: 420 },
      { x: -15, y: 18, z: 420 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Big Cat Court (Food Court)
  {
    id: 'big-cat-court',
    name: 'Big Cat Court',
    level: 'standing',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 70, y: 35, z: 370 },
      { x: 110, y: 35, z: 390 },
      { x: 110, y: 35, z: 410 },
      { x: 70, y: 35, z: 390 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Witherite's Detroit Garage
  {
    id: 'detroit-garage',
    name: "Witherite's Detroit Garage",
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -130, y: 38, z: 320 },
      { x: -100, y: 38, z: 340 },
      { x: -100, y: 38, z: 360 },
      { x: -130, y: 38, z: 340 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Brushfire Grill
  {
    id: 'brushfire-grill',
    name: 'Brushfire Grill',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 100, y: 40, z: 340 },
      { x: 130, y: 40, z: 360 },
      { x: 130, y: 40, z: 380 },
      { x: 100, y: 40, z: 360 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Tiger Statues Plaza
  {
    id: 'tiger-statues-plaza',
    name: 'Tiger Statues Plaza',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -50, y: 0, z: -20 },
      { x: 50, y: 0, z: -20 },
      { x: 50, y: 0, z: 0 },
      { x: -50, y: 0, z: 0 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Chevrolet Fountain Bar
  {
    id: 'chevrolet-fountain-bar',
    name: 'Chevrolet Fountain Bar',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'H', 22, 78, 3, 11),
    vertices3D: [
      { x: -50, y: 78, z: 75 },
      { x: -125, y: 78, z: 100 },
      { x: -130, y: 102, z: 124 },
      { x: -55, y: 102, z: 99 }
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
    level: 'upper',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 120, y: 75, z: 340 },
      { x: 150, y: 75, z: 360 },
      { x: 150, y: 85, z: 370 },
      { x: 120, y: 85, z: 350 }
    ] as Vector3D[],
    covered: false,
    distance: 350,
    height: 75,
    rake: 0
  }
];

// Stadium features
export const comericaParkFeatures = {
  retractableRoof: false,
  roofHeight: 135,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const comericaParkSectionMap = new Map(
  comericaParkSections.map(section => [section.id, section])
);

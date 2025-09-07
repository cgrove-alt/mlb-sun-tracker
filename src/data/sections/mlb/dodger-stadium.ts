import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Dodger Stadium - Los Angeles Dodgers
// Opened: 1962
// Capacity: 56,000
// Orientation: 25° (Home plate to center field)
// Famous features: Chavez Ravine location, Think Blue sign, All You Can Eat Pavilion

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'JJ', 'KK', 'LL'];
  
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
      covered: false  });
  }
  
  return rows;
};

export const dodgerStadiumSections: DetailedSection[] = [
  // Dugout Club - Behind Home Plate
  {
    id: 'dugout-club',
    name: 'Dugout Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'N', 24, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 35, z: 45 },
      { x: -35, y: 35, z: 45 }
    ] as Vector3D[],
      covered: false  },
  
  // Field Level - First Base
  {
    id: 'field-level-1b',
    name: 'Field Level - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 65, z: 92 },
      { x: 35, y: 65, z: 73 }
    ] as Vector3D[],
      covered: false  },
  
  // Field Level - Third Base
  {
    id: 'field-level-3b',
    name: 'Field Level - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 65, z: 92 },
      { x: -35, y: 65, z: 73 }
    ] as Vector3D[],
      covered: false  },
  
  // Baseline Club - First Base
  {
    id: 'baseline-club-1b',
    name: 'Baseline Club - First Base',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'L', 26, 70, 3, 12),
    vertices3D: [
      { x: 40, y: 70, z: 75 },
      { x: 125, y: 70, z: 95 },
      { x: 130, y: 106, z: 131 },
      { x: 45, y: 106, z: 111 }
    ] as Vector3D[],
      covered: false  },
  
  // Baseline Club - Third Base
  {
    id: 'baseline-club-3b',
    name: 'Baseline Club - Third Base',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'L', 26, 70, 3, 12),
    vertices3D: [
      { x: -40, y: 70, z: 75 },
      { x: -125, y: 70, z: 95 },
      { x: -130, y: 106, z: 131 },
      { x: -45, y: 106, z: 111 }
    ] as Vector3D[],
      covered: false  },
  
  // Loge Level - Behind Home
  {
    id: 'loge-home',
    name: 'Loge Level - Home Plate',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'V', 24, 110, 3, 13),
    vertices3D: [
      { x: -40, y: 110, z: 105 },
      { x: 40, y: 110, z: 105 },
      { x: 45, y: 176, z: 171 },
      { x: -45, y: 176, z: 171 }
    ] as Vector3D[],
      covered: false  },
  
  // Loge Level - First Base
  {
    id: 'loge-1b',
    name: 'Loge Level - First Base',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'W', 25, 110, 3, 14),
    vertices3D: [
      { x: 45, y: 110, z: 115 },
      { x: 130, y: 110, z: 140 },
      { x: 135, y: 179, z: 209 },
      { x: 50, y: 179, z: 184 }
    ] as Vector3D[],
      covered: false  },
  
  // Loge Level - Third Base
  {
    id: 'loge-3b',
    name: 'Loge Level - Third Base',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'W', 25, 110, 3, 14),
    vertices3D: [
      { x: -45, y: 110, z: 115 },
      { x: -130, y: 110, z: 140 },
      { x: -135, y: 179, z: 209 },
      { x: -50, y: 179, z: 184 }
    ] as Vector3D[],
      covered: false  },
  
  // Reserve Level - Behind Home
  {
    id: 'reserve-home',
    name: 'Reserve Level - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 26, 180, 3.5, 15),
    vertices3D: [
      { x: -45, y: 180, z: 175 },
      { x: 45, y: 180, z: 175 },
      { x: 50, y: 281, z: 276 },
      { x: -50, y: 281, z: 276 }
    ] as Vector3D[],
      covered: false  },
  
  // Reserve Level - First Base
  {
    id: 'reserve-1b',
    name: 'Reserve Level - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 28, 180, 3.5, 16),
    vertices3D: [
      { x: 50, y: 180, z: 185 },
      { x: 135, y: 180, z: 215 },
      { x: 140, y: 288, z: 323 },
      { x: 55, y: 288, z: 293 }
    ] as Vector3D[],
      covered: false  },
  
  // Reserve Level - Third Base
  {
    id: 'reserve-3b',
    name: 'Reserve Level - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 28, 180, 3.5, 16),
    vertices3D: [
      { x: -50, y: 180, z: 185 },
      { x: -135, y: 180, z: 215 },
      { x: -140, y: 288, z: 323 },
      { x: -55, y: 288, z: 293 }
    ] as Vector3D[],
      covered: false  },
  
  // Top Deck - Behind Home
  {
    id: 'top-deck-home',
    name: 'Top Deck - Home Plate',
    level: 'Top',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'LL', 30, 250, 3.5, 18),
    vertices3D: [
      { x: -50, y: 250, z: 245 },
      { x: 50, y: 250, z: 245 },
      { x: 55, y: 385, z: 380 },
      { x: -55, y: 385, z: 380 }
    ] as Vector3D[],
      covered: false  },
  
  // Top Deck - First Base
  {
    id: 'top-deck-1b',
    name: 'Top Deck - First Base',
    level: 'Top',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'LL', 32, 250, 3.5, 19),
    vertices3D: [
      { x: 55, y: 250, z: 255 },
      { x: 140, y: 250, z: 290 },
      { x: 145, y: 385, z: 425 },
      { x: 60, y: 385, z: 390 }
    ] as Vector3D[],
      covered: false  },
  
  // Top Deck - Third Base
  {
    id: 'top-deck-3b',
    name: 'Top Deck - Third Base',
    level: 'Top',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'LL', 32, 250, 3.5, 19),
    vertices3D: [
      { x: -55, y: 250, z: 255 },
      { x: -140, y: 250, z: 290 },
      { x: -145, y: 385, z: 425 },
      { x: -60, y: 385, z: 390 }
    ] as Vector3D[],
      covered: false  },
  
  // Left Field Pavilion - Lower
  {
    id: 'left-pavilion-lower',
    name: 'Left Field Pavilion - Lower',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'T', 25, 20, 2.5, 20),
    vertices3D: [
      { x: -160, y: 20, z: 290 },
      { x: -130, y: 20, z: 330 },
      { x: -135, y: 70, z: 380 },
      { x: -165, y: 70, z: 340 }
    ] as Vector3D[],
      covered: false  },
  
  // Left Field Pavilion - Upper
  {
    id: 'left-pavilion-upper',
    name: 'Left Field Pavilion - Upper',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'R', 22, 75, 2.5, 22),
    vertices3D: [
      { x: -165, y: 75, z: 345 },
      { x: -135, y: 75, z: 385 },
      { x: -140, y: 120, z: 430 },
      { x: -170, y: 120, z: 390 }
    ] as Vector3D[],
      covered: false  },
  
  // Right Field Pavilion - Lower (All You Can Eat)
  {
    id: 'right-pavilion-ayce',
    name: 'All You Can Eat Pavilion',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'T', 25, 20, 2.5, 20),
    vertices3D: [
      { x: 130, y: 20, z: 290 },
      { x: 160, y: 20, z: 330 },
      { x: 165, y: 70, z: 380 },
      { x: 135, y: 70, z: 340 }
    ] as Vector3D[],
      covered: false  },
  
  // Right Field Pavilion - Upper
  {
    id: 'right-pavilion-upper',
    name: 'Right Field Pavilion - Upper',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'R', 22, 75, 2.5, 22),
    vertices3D: [
      { x: 135, y: 75, z: 345 },
      { x: 165, y: 75, z: 385 },
      { x: 170, y: 120, z: 430 },
      { x: 140, y: 120, z: 390 }
    ] as Vector3D[],
      covered: false  },
  
  // Coca-Cola All Season Patio
  {
    id: 'coca-cola-patio',
    name: 'Coca-Cola All Season Patio',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: 80, y: 35, z: 360 },
      { x: 120, y: 35, z: 380 },
      { x: 120, y: 35, z: 400 },
      { x: 80, y: 35, z: 380 }
    ] as Vector3D[],
      covered: false  },
  
  // Stadium Club
  {
    id: 'stadium-club',
    name: 'Stadium Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -50, y: 90, z: 85 },
      { x: 50, y: 90, z: 85 },
      { x: 50, y: 100, z: 95 },
      { x: -50, y: 100, z: 95 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Lexus Dugout Club
  {
    id: 'lexus-dugout-club',
    name: 'Lexus Dugout Club',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'F', 18, 3, 2.5, 8),
    vertices3D: [
      { x: 50, y: 3, z: 15 },
      { x: 70, y: 3, z: 18 },
      { x: 75, y: 18, z: 33 },
      { x: 55, y: 18, z: 30 }
    ] as Vector3D[],
      covered: false  },
  
  // Think Blue Deck
  {
    id: 'think-blue-deck',
    name: 'Think Blue Deck',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: -25, y: 40, z: 395 },
      { x: 25, y: 40, z: 395 },
      { x: 25, y: 40, z: 415 },
      { x: -25, y: 40, z: 415 }
    ] as Vector3D[],
      covered: false  },
  
  // Tommy Lasorda's Trattoria
  {
    id: 'tommy-lasorda-trattoria',
    name: "Tommy Lasorda's Trattoria",
    level: 'Restaurant',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 100, y: 45, z: 340 },
      { x: 130, y: 45, z: 360 },
      { x: 130, y: 45, z: 380 },
      { x: 100, y: 45, z: 360 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium features
export const dodgerStadiumFeatures = {
  retractableRoof: false,
  roofHeight: 0, // Open air stadium
  roofMaterial: {
    opacity: 0,
    reflectivity: 0
  }
};

// Export section map for easy lookup
export const dodgerStadiumSectionMap = new Map(
  dodgerStadiumSections.map(section => [section.id, section])
);
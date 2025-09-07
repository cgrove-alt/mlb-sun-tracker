import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Guaranteed Rate Field - Chicago White Sox
// Opened: 1991
// Capacity: 40,615
// Orientation: 90° (Home plate to center field - Due East)
// Famous features: Exploding scoreboard, Fundamentals Deck, Goose Island, Scout Seats

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
export const guaranteedRateFieldSections: DetailedSection[] = [
  // Scout Seats - Behind Home Plate
  {
    id: 'scout-seats',
    name: 'Scout Seats',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'N', 22, 2, 2.5, 10),
    vertices3D: [
      { x: -28, y: 2, z: 10 },
      { x: 28, y: 2, z: 10 },
      { x: 33, y: 35, z: 45 },
      { x: -33, y: 35, z: 45 }
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
      { x: 28, y: 2, z: 10 },
      { x: 115, y: 2, z: 28 },
      { x: 120, y: 55, z: 81 },
      { x: 33, y: 55, z: 63 }
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
      { x: -28, y: 2, z: 10 },
      { x: -115, y: 2, z: 28 },
      { x: -120, y: 55, z: 81 },
      { x: -33, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Fundamentals Deck (Right Field)
  {
    id: 'fundamentals-deck',
    name: 'Fundamentals Deck',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'K', 20, 25, 2.5, 18),
    vertices3D: [
      { x: 120, y: 25, z: 300 },
      { x: 150, y: 25, z: 330 },
      { x: 155, y: 52.5, z: 357.5 },
      { x: 125, y: 52.5, z: 327.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Goose Island (Right-Center Field)
  {
    id: 'goose-island',
    name: 'Goose Island',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 80, y: 30, z: 360 },
      { x: 110, y: 30, z: 375 },
      { x: 110, y: 30, z: 395 },
      { x: 80, y: 30, z: 380 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Kraft Kave (Left Field)
  {
    id: 'kraft-kave',
    name: 'Kraft Kave',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -130, y: 28, z: 320 },
      { x: -100, y: 28, z: 340 },
      { x: -100, y: 28, z: 365 },
      { x: -130, y: 28, z: 345 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // FanDeck (Center Field)
  {
    id: 'fandeck',
    name: 'FanDeck',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -30, y: 35, z: 395 },
      { x: 30, y: 35, z: 395 },
      { x: 30, y: 35, z: 420 },
      { x: -30, y: 35, z: 420 }
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
    rows: generateRows('A', 'M', 26, 72, 3, 12),
    vertices3D: [
      { x: -38, y: 72, z: 67 },
      { x: 38, y: 72, z: 67 },
      { x: 43, y: 111, z: 106 },
      { x: -43, y: 111, z: 106 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Magellan Club
  {
    id: 'magellan-club',
    name: 'Magellan Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'L', 28, 72, 3, 12),
    vertices3D: [
      { x: 43, y: 72, z: 72 },
      { x: 120, y: 72, z: 95 },
      { x: 125, y: 108, z: 131 },
      { x: 48, y: 108, z: 108 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Lower Box - Behind Home
  {
    id: 'lower-box-home',
    name: 'Lower Box - Home Plate',
    level: 'Lower',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 52, 3, 13),
    vertices3D: [
      { x: -38, y: 52, z: 47 },
      { x: 38, y: 52, z: 47 },
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
    level: 'Upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 125, 3.5, 16),
    vertices3D: [
      { x: -45, y: 125, z: 120 },
      { x: 45, y: 125, z: 120 },
      { x: 50, y: 219, z: 214 },
      { x: -50, y: 219, z: 214 }
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
    level: 'Upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 125, 3.5, 17),
    vertices3D: [
      { x: 50, y: 125, z: 130 },
      { x: 130, y: 125, z: 160 },
      { x: 135, y: 223, z: 258 },
      { x: 55, y: 223, z: 228 }
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
    level: 'Upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 125, 3.5, 17),
    vertices3D: [
      { x: -50, y: 125, z: 130 },
      { x: -130, y: 125, z: 160 },
      { x: -135, y: 223, z: 258 },
      { x: -55, y: 223, z: 228 }
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
    rows: generateRows('A', 'U', 24, 18, 2.5, 20),
    vertices3D: [
      { x: -145, y: 18, z: 285 },
      { x: -115, y: 18, z: 325 },
      { x: -120, y: 70.5, z: 377.5 },
      { x: -150, y: 70.5, z: 337.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Right Field Bleachers',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 18, 2.5, 20),
    vertices3D: [
      { x: 115, y: 18, z: 285 },
      { x: 145, y: 18, z: 325 },
      { x: 150, y: 70.5, z: 377.5 },
      { x: 120, y: 70.5, z: 337.5 }
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
  // Revolution Brewing Tap Room
  {
    id: 'revolution-tap-room',
    name: 'Revolution Brewing Tap Room',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -90, y: 32, z: 350 },
      { x: -60, y: 32, z: 365 },
      { x: -60, y: 32, z: 385 },
      { x: -90, y: 32, z: 370 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Exploding Scoreboard Area
  {
    id: 'exploding-scoreboard',
    name: 'Exploding Scoreboard Area',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -25, y: 40, z: 400 },
      { x: 25, y: 40, z: 400 },
      { x: 25, y: 40, z: 420 },
      { x: -25, y: 40, z: 420 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Xfinity Zone
  {
    id: 'xfinity-zone',
    name: 'Xfinity Zone',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 100, y: 35, z: 340 },
      { x: 125, y: 35, z: 355 },
      { x: 125, y: 35, z: 375 },
      { x: 100, y: 35, z: 360 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // The Patio (Left Field)
  {
    id: 'the-patio',
    name: 'The Patio',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'H', 16, 22, 2.5, 17),
    vertices3D: [
      { x: -135, y: 22, z: 310 },
      { x: -110, y: 22, z: 330 },
      { x: -115, y: 42, z: 350 },
      { x: -140, y: 42, z: 330 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Champions Club
  {
    id: 'champions-club',
    name: 'Champions Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'L', 28, 72, 3, 12),
    vertices3D: [
      { x: -43, y: 72, z: 72 },
      { x: -120, y: 72, z: 95 },
      { x: -125, y: 108, z: 131 },
      { x: -48, y: 108, z: 108 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Stadium Club Restaurant
  {
    id: 'stadium-club-restaurant',
    name: 'Stadium Club Restaurant',
    level: 'Restaurant',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -40, y: 85, z: 80 },
      { x: 40, y: 85, z: 80 },
      { x: 40, y: 95, z: 90 },
      { x: -40, y: 95, z: 90 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Miller Lite Landing (formerly Goose Island)
  {
    id: 'miller-lite-landing',
    name: 'Miller Lite Landing',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 100, y: 20, z: 320 },
      { x: 130, y: 20, z: 340 },
      { x: 130, y: 30, z: 340 },
      { x: 100, y: 30, z: 320 }
    ] as Vector3D[],
    covered: false,
    distance: 330,
    height: 20,
    rake: 0
  }
];

// Stadium features
export const guaranteedRateFieldFeatures = {
  retractableRoof: false,
  roofHeight: 130,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};
// Export section map for easy lookup
export const guaranteedRateFieldSectionMap = new Map(
  guaranteedRateFieldSections.map(section => [section.id, section])
);

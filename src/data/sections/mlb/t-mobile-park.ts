import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// T-Mobile Park - Seattle Mariners
// Opened: 1999
// Capacity: 47,929
// Orientation: 318° (Home plate to center field - Northwest)
// Features: Retractable roof, The 'Pen, Edgar's Cantina, Hit It Here Cafe

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
      covered: true // All sections covered by retractable roof
    });
  }
  
  return rows;
};

export const tMobileParkSections: DetailedSection[] = [
  // Diamond Club - Behind Home Plate
  {
    id: 'diamond-club',
    name: 'Diamond Club',
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
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Field Level - First Base
  {
    id: 'field-level-1b',
    name: 'Field Level - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'W', 23, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 57.5, z: 84.5 },
      { x: 35, y: 57.5, z: 65.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Field Level - Third Base
  {
    id: 'field-level-3b',
    name: 'Field Level - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'W', 23, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 57.5, z: 84.5 },
      { x: -35, y: 57.5, z: 65.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // The 'Pen (Left-Center Field)
  {
    id: 'the-pen',
    name: "The 'Pen",
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -100, y: 25, z: 350 },
      { x: -60, y: 25, z: 370 },
      { x: -60, y: 25, z: 395 },
      { x: -100, y: 25, z: 375 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Edgar's Cantina (Left Field)
  {
    id: 'edgars-cantina',
    name: "Edgar's Cantina",
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -120, y: 30, z: 320 },
      { x: -90, y: 30, z: 340 },
      { x: -90, y: 30, z: 365 },
      { x: -120, y: 30, z: 345 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Hit It Here Cafe (Right Field)
  {
    id: 'hit-it-here-cafe',
    name: 'Hit It Here Cafe',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 120, y: 35, z: 320 },
      { x: 150, y: 35, z: 340 },
      { x: 150, y: 35, z: 365 },
      { x: 120, y: 35, z: 345 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Main Level - Behind Home
  {
    id: 'main-level-home',
    name: 'Main Level - Home Plate',
    level: 'Main',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 60, 3, 13),
    vertices3D: [
      { x: -40, y: 60, z: 60 },
      { x: 40, y: 60, z: 60 },
      { x: 45, y: 123, z: 123 },
      { x: -45, y: 123, z: 123 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Main Level - First Base
  {
    id: 'main-level-1b',
    name: 'Main Level - First Base',
    level: 'Main',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 60, 3, 14),
    vertices3D: [
      { x: 45, y: 60, z: 65 },
      { x: 125, y: 60, z: 90 },
      { x: 130, y: 144, z: 174 },
      { x: 50, y: 144, z: 149 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Main Level - Third Base
  {
    id: 'main-level-3b',
    name: 'Main Level - Third Base',
    level: 'Main',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 60, 3, 14),
    vertices3D: [
      { x: -45, y: 60, z: 65 },
      { x: -125, y: 60, z: 90 },
      { x: -130, y: 144, z: 174 },
      { x: -50, y: 144, z: 149 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Club Level - Behind Home
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 85, 3, 12),
    vertices3D: [
      { x: -40, y: 85, z: 80 },
      { x: 40, y: 85, z: 80 },
      { x: 45, y: 121, z: 116 },
      { x: -45, y: 121, z: 116 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Terrace Club
  {
    id: 'terrace-club',
    name: 'Terrace Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'N', 30, 85, 3, 12),
    vertices3D: [
      { x: 50, y: 85, z: 85 },
      { x: 130, y: 85, z: 105 },
      { x: 135, y: 124, z: 144 },
      { x: 55, y: 124, z: 124 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Upper Level - Behind Home
  {
    id: 'upper-level-home',
    name: 'Upper Level - Home Plate',
    level: 'Upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 27, 150, 3.5, 16),
    vertices3D: [
      { x: -50, y: 150, z: 145 },
      { x: 50, y: 150, z: 145 },
      { x: 55, y: 254, z: 249 },
      { x: -55, y: 254, z: 249 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Upper Level - First Base
  {
    id: 'upper-level-1b',
    name: 'Upper Level - First Base',
    level: 'Upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 29, 150, 3.5, 17),
    vertices3D: [
      { x: 55, y: 150, z: 155 },
      { x: 140, y: 150, z: 185 },
      { x: 145, y: 261, z: 296 },
      { x: 60, y: 261, z: 266 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Upper Level - Third Base
  {
    id: 'upper-level-3b',
    name: 'Upper Level - Third Base',
    level: 'Upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 29, 150, 3.5, 17),
    vertices3D: [
      { x: -55, y: 150, z: 155 },
      { x: -140, y: 150, z: 185 },
      { x: -145, y: 261, z: 296 },
      { x: -60, y: 261, z: 266 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Center Field Landing
  {
    id: 'center-field-landing',
    name: 'Center Field Landing',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -25, y: 35, z: 400 },
      { x: 25, y: 35, z: 400 },
      { x: 25, y: 35, z: 420 },
      { x: -25, y: 35, z: 420 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Left Field Bleachers
  {
    id: 'left-field-bleachers',
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
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Right Field Bleachers
  {
    id: 'right-field-bleachers',
    name: 'Right Field Bleachers',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'T', 24, 20, 2.5, 20),
    vertices3D: [
      { x: 120, y: 20, z: 290 },
      { x: 150, y: 20, z: 330 },
      { x: 155, y: 70, z: 380 },
      { x: 125, y: 70, z: 340 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -60, y: 110, z: 105 },
      { x: 60, y: 110, z: 105 },
      { x: 60, y: 120, z: 115 },
      { x: -60, y: 120, z: 115 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Lookout Landing (Center Field Bar)
  {
    id: 'lookout-landing',
    name: 'Lookout Landing',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -40, y: 40, z: 390 },
      { x: 40, y: 40, z: 390 },
      { x: 40, y: 40, z: 410 },
      { x: -40, y: 40, z: 410 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // All-Star Club
  {
    id: 'all-star-club',
    name: 'All-Star Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'N', 30, 85, 3, 12),
    vertices3D: [
      { x: -50, y: 85, z: 85 },
      { x: -130, y: 85, z: 105 },
      { x: -135, y: 124, z: 144 },
      { x: -55, y: 124, z: 124 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Northwest Gate Social Deck
  {
    id: 'northwest-gate-deck',
    name: 'Northwest Gate Social Deck',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -80, y: 30, z: 365 },
      { x: -50, y: 30, z: 380 },
      { x: -50, y: 30, z: 400 },
      { x: -80, y: 30, z: 385 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Protime Sports Grill
  {
    id: 'protime-sports-grill',
    name: 'Protime Sports Grill',
    level: 'Restaurant',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 80, y: 45, z: 360 },
      { x: 110, y: 45, z: 375 },
      { x: 110, y: 45, z: 395 },
      { x: 80, y: 45, z: 380 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // King's Court (Felix Hernandez Section)
  {
    id: 'kings-court',
    name: "King's Court",
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'K', 20, 10, 2.5, 18),
    vertices3D: [
      { x: -130, y: 10, z: 250 },
      { x: -110, y: 10, z: 270 },
      { x: -115, y: 37.5, z: 297.5 },
      { x: -135, y: 37.5, z: 277.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium features
export const tMobileParkFeatures = {
  retractableRoof: true,
  roofHeight: 190,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.35
  },
  climateControlled: true
};

// Export section map for easy lookup
export const tMobileParkSectionMap = new Map(
  tMobileParkSections.map(section => [section.id, section]));
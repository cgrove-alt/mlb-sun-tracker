import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Globe Life Field - Texas Rangers
// Opened: 2020
// Capacity: 40,300
// Orientation: 46° (Home plate to center field)
// Features: Retractable roof, Climate controlled, Texas-sized video board

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

export const globeLifeFieldSections: DetailedSection[] = [
  // Premium Level - Behind Home Plate
  {
    id: 'lexus-club',
    name: 'Lexus Club',
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
  
  // Field Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
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
  
  // Field Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
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
  
  // Karbach Sky Porch
  {
    id: 'karbach-sky-porch',
    name: 'Karbach Sky Porch',
    level: 'Upper',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'L', 30, 95, 3, 20),
    vertices3D: [
      { x: -145, y: 95, z: 280 },
      { x: -115, y: 95, z: 320 },
      { x: -120, y: 131, z: 356 },
      { x: -150, y: 131, z: 316 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Texas Sized Video Board Porch
  {
    id: 'video-board-porch',
    name: 'Video Board Porch',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 80, y: 35, z: 360 },
      { x: 120, y: 35, z: 380 },
      { x: 120, y: 35, z: 400 },
      { x: 80, y: 35, z: 380 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Main Concourse - Behind Home
  {
    id: 'main-concourse-home',
    name: 'Main Concourse - Home Plate',
    level: 'Main',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'V', 24, 60, 3, 13),
    vertices3D: [
      { x: -40, y: 60, z: 60 },
      { x: 40, y: 60, z: 60 },
      { x: 45, y: 126, z: 126 },
      { x: -45, y: 126, z: 126 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Main Concourse - First Base
  {
    id: 'main-concourse-1b',
    name: 'Main Concourse - First Base',
    level: 'Main',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 60, 3, 14),
    vertices3D: [
      { x: 45, y: 60, z: 70 },
      { x: 125, y: 60, z: 95 },
      { x: 130, y: 138, z: 173 },
      { x: 50, y: 138, z: 148 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Main Concourse - Third Base
  {
    id: 'main-concourse-3b',
    name: 'Main Concourse - Third Base',
    level: 'Main',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 60, 3, 14),
    vertices3D: [
      { x: -45, y: 60, z: 70 },
      { x: -125, y: 60, z: 95 },
      { x: -130, y: 138, z: 173 },
      { x: -50, y: 138, z: 148 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Captain Morgan Club
  {
    id: 'captain-morgan-club',
    name: 'Captain Morgan Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'N', 28, 80, 3.5, 12),
    vertices3D: [
      { x: 50, y: 80, z: 80 },
      { x: 135, y: 80, z: 100 },
      { x: 140, y: 129, z: 149 },
      { x: 55, y: 129, z: 129 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Fox Sports Club
  {
    id: 'fox-sports-club',
    name: 'Fox Sports Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'N', 28, 80, 3.5, 12),
    vertices3D: [
      { x: -50, y: 80, z: 80 },
      { x: -135, y: 80, z: 100 },
      { x: -140, y: 129, z: 149 },
      { x: -55, y: 129, z: 129 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Upper Box - Behind Home
  {
    id: 'upper-box-home',
    name: 'Upper Box - Home Plate',
    level: 'Upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 26, 140, 3.5, 16),
    vertices3D: [
      { x: -50, y: 140, z: 130 },
      { x: 50, y: 140, z: 130 },
      { x: 55, y: 238, z: 228 },
      { x: -55, y: 238, z: 228 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Upper Box - First Base
  {
    id: 'upper-box-1b',
    name: 'Upper Box - First Base',
    level: 'Upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 140, 3.5, 17),
    vertices3D: [
      { x: 55, y: 140, z: 140 },
      { x: 140, y: 140, z: 170 },
      { x: 145, y: 245, z: 275 },
      { x: 60, y: 245, z: 245 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Upper Box - Third Base
  {
    id: 'upper-box-3b',
    name: 'Upper Box - Third Base',
    level: 'Upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 140, 3.5, 17),
    vertices3D: [
      { x: -55, y: 140, z: 140 },
      { x: -140, y: 140, z: 170 },
      { x: -145, y: 245, z: 275 },
      { x: -60, y: 245, z: 245 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Home Run Porch
  {
    id: 'home-run-porch',
    name: 'Home Run Porch',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'K', 22, 25, 2.5, 19),
    vertices3D: [
      { x: -150, y: 25, z: 270 },
      { x: -120, y: 25, z: 310 },
      { x: -125, y: 52.5, z: 337.5 },
      { x: -155, y: 52.5, z: 297.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Texas Outfield Deck
  {
    id: 'texas-outfield-deck',
    name: 'Texas Outfield Deck',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -25, y: 40, z: 390 },
      { x: 25, y: 40, z: 390 },
      { x: 25, y: 40, z: 415 },
      { x: -25, y: 40, z: 415 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Rangers Republic Bar
  {
    id: 'rangers-republic-bar',
    name: 'Rangers Republic Bar',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 40, y: 35, z: 375 },
      { x: 80, y: 35, z: 385 },
      { x: 80, y: 35, z: 405 },
      { x: 40, y: 35, z: 395 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Shed Group Area
  {
    id: 'the-shed',
    name: 'The Shed',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'J', 25, 30, 2.5, 18),
    vertices3D: [
      { x: 145, y: 30, z: 280 },
      { x: 115, y: 30, z: 320 },
      { x: 120, y: 55, z: 345 },
      { x: 150, y: 55, z: 305 }
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
      { x: -60, y: 100, z: 100 },
      { x: 60, y: 100, z: 100 },
      { x: 60, y: 110, z: 110 },
      { x: -60, y: 110, z: 110 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Champions Club
  {
    id: 'champions-club',
    name: 'Champions Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'P', 32, 75, 3, 11),
    vertices3D: [
      { x: -40, y: 75, z: 70 },
      { x: 40, y: 75, z: 70 },
      { x: 45, y: 123, z: 118 },
      { x: -45, y: 123, z: 118 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Hyundai Club
  {
    id: 'hyundai-club',
    name: 'Hyundai Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -80, y: 45, z: 350 },
      { x: -40, y: 45, z: 365 },
      { x: -40, y: 45, z: 385 },
      { x: -80, y: 45, z: 370 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Karbach Sky Porch
  {
    id: 'karbach-sky-porch',
    name: 'Karbach Sky Porch',
    level: 'upper',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -140, y: 75, z: 320 },
      { x: -110, y: 75, z: 340 },
      { x: -110, y: 85, z: 350 },
      { x: -140, y: 85, z: 330 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Captain Morgan Club
  {
    id: 'captain-morgan-club',
    name: 'Captain Morgan Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'J', 28, 60, 3, 28),
    vertices3D: [
      { x: -90, y: 60, z: 120 },
      { x: -70, y: 60, z: 140 },
      { x: -75, y: 90, z: 170 },
      { x: -95, y: 90, z: 150 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Texas Sized Club
  {
    id: 'texas-sized-club',
    name: 'Texas Sized Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'L', 24, 8, 2.5, 24),
    vertices3D: [
      { x: -30, y: 8, z: 55 },
      { x: 30, y: 8, z: 55 },
      { x: 35, y: 38, z: 85 },
      { x: -35, y: 38, z: 85 }
    ] as Vector3D[],
      covered: false  }
];

// Stadium features
export const globeLifeFieldFeatures = {
  retractableRoof: true,
  roofHeight: 175,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.4
  },
  climateControlled: true
};

// Export section map for easy lookup
export const globeLifeFieldSectionMap = new Map(
  globeLifeFieldSections.map(section => [section.id, section])
);
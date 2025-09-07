import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Nationals Park - Washington Nationals
// Opened: 2008
// Capacity: 41,313
// Orientation: 87° (Home plate to center field)
// Famous features: Capitol views, Navy Yard location, Red Porch

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

export const nationalsParkSections: DetailedSection[] = [
  // Presidents Club - Behind Home Plate
  {
    id: 'presidents-club',
    name: 'Presidents Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'S', 24, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 47.5, z: 57.5 },
      { x: -35, y: 47.5, z: 57.5 }
    ] as Vector3D[],
,
  
  // Infield Box - First Base
  {
    id: 'infield-box-1b',
    name: 'Infield Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 115, y: 2, z: 28 },
      { x: 120, y: 55, z: 81 },
      { x: 35, y: 55, z: 63 }
    ] as Vector3D[],
,
  
  // Infield Box - Third Base
  {
    id: 'infield-box-3b',
    name: 'Infield Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -115, y: 2, z: 28 },
      { x: -120, y: 55, z: 81 },
      { x: -35, y: 55, z: 63 }
    ] as Vector3D[],
,
  
  // Stars and Stripes Club
  {
    id: 'stars-stripes-club',
    name: 'Stars and Stripes Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'N', 28, 75, 3, 12),
    vertices3D: [
      { x: 40, y: 75, z: 70 },
      { x: 125, y: 75, z: 90 },
      { x: 130, y: 117, z: 132 },
      { x: 45, y: 117, z: 112 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Scoreboard Walk
  {
    id: 'scoreboard-walk',
    name: 'Scoreboard Walk',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: 120, y: 15, z: 280 },
      { x: 150, y: 15, z: 320 },
      { x: 150, y: 15, z: 360 },
      { x: 120, y: 15, z: 320 }
    ] as Vector3D[],
,
  
  // Red Porch
  {
    id: 'red-porch',
    name: 'Red Porch',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: generateRows('A', 'J', 20, 25, 2.5, 20),
    vertices3D: [
      { x: -20, y: 25, z: 385 },
      { x: 20, y: 25, z: 385 },
      { x: 25, y: 50, z: 410 },
      { x: -25, y: 50, z: 410 }
    ] as Vector3D[],
,
  
  // Red Loft
  {
    id: 'red-loft',
    name: 'Red Loft',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -15, y: 55, z: 390 },
      { x: 15, y: 55, z: 390 },
      { x: 15, y: 55, z: 410 },
      { x: -15, y: 55, z: 410 }
    ] as Vector3D[],
,
  
  // Gallery Level - Behind Home
  {
    id: 'gallery-home',
    name: 'Gallery - Home Plate',
    level: 'Gallery',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 26, 120, 3.5, 15),
    vertices3D: [
      { x: -45, y: 120, z: 115 },
      { x: 45, y: 120, z: 115 },
      { x: 50, y: 207.5, z: 202.5 },
      { x: -50, y: 207.5, z: 202.5 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 25
    }
  },
  
  // Gallery Level - First Base
  {
    id: 'gallery-1b',
    name: 'Gallery - First Base',
    level: 'Gallery',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 120, 3.5, 16),
    vertices3D: [
      { x: 50, y: 120, z: 125 },
      { x: 135, y: 120, z: 155 },
      { x: 140, y: 220, z: 255 },
      { x: 55, y: 220, z: 225 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['V', 'W', 'X', 'Y', 'Z', 'AA'],
      coveragePercent: 20
    }
  },
  
  // Gallery Level - Third Base
  {
    id: 'gallery-3b',
    name: 'Gallery - Third Base',
    level: 'Gallery',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 120, 3.5, 16),
    vertices3D: [
      { x: -50, y: 120, z: 125 },
      { x: -135, y: 120, z: 155 },
      { x: -140, y: 220, z: 255 },
      { x: -55, y: 220, z: 225 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['V', 'W', 'X', 'Y', 'Z', 'AA'],
      coveragePercent: 20
    }
  },
  
  // Left Field Reserved
  {
    id: 'left-field-reserved',
    name: 'Left Field Reserved',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'T', 24, 20, 2.5, 18),
    vertices3D: [
      { x: -145, y: 20, z: 270 },
      { x: -115, y: 20, z: 310 },
      { x: -120, y: 70, z: 360 },
      { x: -150, y: 70, z: 320 }
    ] as Vector3D[],
,
  
  // Right Field Reserved
  {
    id: 'right-field-reserved',
    name: 'Right Field Reserved',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'T', 24, 20, 2.5, 18),
    vertices3D: [
      { x: 145, y: 20, z: 270 },
      { x: 115, y: 20, z: 310 },
      { x: 120, y: 70, z: 360 },
      { x: 150, y: 70, z: 320 }
    ] as Vector3D[],
,
  
  // Budweiser Brew House
  {
    id: 'budweiser-brew-house',
    name: 'Budweiser Brew House',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -80, y: 30, z: 360 },
      { x: -40, y: 30, z: 375 },
      { x: -40, y: 30, z: 395 },
      { x: -80, y: 30, z: 380 }
    ] as Vector3D[],
,
  
  // District Dugout
  {
    id: 'district-dugout',
    name: 'District Dugout',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -80, y: 3, z: 15 },
      { x: -60, y: 3, z: 20 },
      { x: -60, y: 8, z: 20 },
      { x: -80, y: 8, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // PNC Diamond Club
  {
    id: 'pnc-diamond-club',
    name: 'PNC Diamond Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'L', 30, 65, 3.5, 12),
    vertices3D: [
      { x: -35, y: 65, z: 60 },
      { x: 35, y: 65, z: 60 },
      { x: 40, y: 107, z: 102 },
      { x: -40, y: 107, z: 102 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Norfolk Southern Club
  {
    id: 'norfolk-southern-club',
    name: 'Norfolk Southern Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'M', 25, 85, 3.5, 13),
    vertices3D: [
      { x: -45, y: 85, z: 85 },
      { x: -130, y: 85, z: 105 },
      { x: -135, y: 130.5, z: 150.5 },
      { x: -50, y: 130.5, z: 130.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Center Field Plaza
  {
    id: 'center-field-plaza',
    name: 'Center Field Plaza',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -30, y: 12, z: 400 },
      { x: 30, y: 12, z: 400 },
      { x: 30, y: 12, z: 420 },
      { x: -30, y: 12, z: 420 }
    ] as Vector3D[],
,
  
  // Upper Gallery - Outfield
  {
    id: 'upper-gallery-outfield',
    name: 'Upper Gallery - Outfield',
    level: 'Gallery',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'U', 22, 125, 3.5, 18),
    vertices3D: [
      { x: -150, y: 125, z: 280 },
      { x: -120, y: 125, z: 320 },
      { x: -125, y: 198.5, z: 393.5 },
      { x: -155, y: 198.5, z: 353.5 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['P', 'R', 'S', 'T', 'U'],
      coveragePercent: 25
    }
  },
  
  // The Bullpen
  {
    id: 'the-bullpen',
    name: 'The Bullpen',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: 130, y: 8, z: 200 },
      { x: 150, y: 8, z: 220 },
      { x: 150, y: 8, z: 240 },
      { x: 130, y: 8, z: 220 }
    ] as Vector3D[],
,
  
  // PNC Diamond Club
  {
    id: 'pnc-diamond-club',
    name: 'PNC Diamond Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'P', 26, 5, 2.5, 26),
    vertices3D: [
      { x: -35, y: 5, z: 55 },
      { x: 35, y: 5, z: 55 },
      { x: 40, y: 45, z: 95 },
      { x: -40, y: 45, z: 95 }
    ] as Vector3D[],
,
  
  // Budweiser Terrace
  {
    id: 'budweiser-terrace',
    name: 'Budweiser Terrace',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: generateRows('A', 'K', 40, 85, 3.5, 32),
    vertices3D: [
      { x: -30, y: 85, z: 380 },
      { x: 30, y: 85, z: 380 },
      { x: 35, y: 123.5, z: 418.5 },
      { x: -35, y: 123.5, z: 418.5 }
    ] as Vector3D[],
,
  
  // Norfolk Southern Club
  {
    id: 'norfolk-southern-club',
    name: 'Norfolk Southern Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'M', 30, 60, 3, 30),
    vertices3D: [
      { x: 50, y: 60, z: 100 },
      { x: 90, y: 60, z: 130 },
      { x: 95, y: 99, z: 169 },
      { x: 55, y: 99, z: 139 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Budweiser Brewhouse (formerly Red Porch)
  {
    id: 'budweiser-brewhouse',
    name: 'Budweiser Brewhouse',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

];

// Stadium features
export const nationalsParkFeatures = {
  retractableRoof: false,
  roofHeight: 140,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const nationalsParkSectionMap = new Map(
  nationalsParkSections.map(section => [section.id, section]));
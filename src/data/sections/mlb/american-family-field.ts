import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// American Family Field - Milwaukee Brewers
// Opened: 2001
// Capacity: 41,900
// Orientation: 357° (Home plate to center field - nearly due north)
// Features: Retractable roof, Bernie's Dugout, The Loft

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
      covered: true // All sections covered when roof is closed
    });
  }
  
  return rows;
};

export const americanFamilyFieldSections: DetailedSection[] = [
  // Field Diamond Box - Behind Home
  {
    id: 'field-diamond-box',
    name: 'Field Diamond Box',
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
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Field Infield Box - First Base
  {
    id: 'field-infield-1b',
    name: 'Field Infield - First Base',
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
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Field Infield Box - Third Base
  {
    id: 'field-infield-3b',
    name: 'Field Infield - Third Base',
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
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Bernie's Dugout (Left Field)
  {
    id: 'bernies-dugout',
    name: "Bernie's Dugout",
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'K', 25, 25, 2.5, 20),
    vertices3D: [
      { x: -140, y: 25, z: 280 },
      { x: -110, y: 25, z: 320 },
      { x: -115, y: 52.5, z: 347.5 },
      { x: -145, y: 52.5, z: 307.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // The Loft (Center Field)
  {
    id: 'the-loft',
    name: 'The Loft',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -30, y: 40, z: 390 },
      { x: 30, y: 40, z: 390 },
      { x: 30, y: 40, z: 415 },
      { x: -30, y: 40, z: 415 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Loge Level - Behind Home
  {
    id: 'loge-level-home',
    name: 'Loge Level - Home Plate',
    level: 'lower',
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
  
  // Loge Level - First Base
  {
    id: 'loge-level-1b',
    name: 'Loge Level - First Base',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'W', 25, 60, 3, 14),
    vertices3D: [
      { x: 45, y: 60, z: 65 },
      { x: 125, y: 60, z: 90 },
      { x: 130, y: 141, z: 171 },
      { x: 50, y: 141, z: 146 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Loge Level - Third Base
  {
    id: 'loge-level-3b',
    name: 'Loge Level - Third Base',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'W', 25, 60, 3, 14),
    vertices3D: [
      { x: -45, y: 60, z: 65 },
      { x: -125, y: 60, z: 90 },
      { x: -130, y: 141, z: 171 },
      { x: -50, y: 141, z: 146 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Club Level
  {
    id: 'club-level',
    name: 'Club Level',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'N', 28, 85, 3, 12),
    vertices3D: [
      { x: 50, y: 85, z: 85 },
      { x: 135, y: 85, z: 105 },
      { x: 140, y: 127, z: 147 },
      { x: 55, y: 127, z: 127 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Terrace Level - Behind Home
  {
    id: 'terrace-level-home',
    name: 'Terrace Level - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 26, 145, 3.5, 16),
    vertices3D: [
      { x: -50, y: 145, z: 140 },
      { x: 50, y: 145, z: 140 },
      { x: 55, y: 243, z: 238 },
      { x: -55, y: 243, z: 238 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Terrace Level - First Base
  {
    id: 'terrace-level-1b',
    name: 'Terrace Level - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 145, 3.5, 17),
    vertices3D: [
      { x: 55, y: 145, z: 150 },
      { x: 140, y: 145, z: 180 },
      { x: 145, y: 250, z: 285 },
      { x: 60, y: 250, z: 255 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Terrace Level - Third Base
  {
    id: 'terrace-level-3b',
    name: 'Terrace Level - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 145, 3.5, 17),
    vertices3D: [
      { x: -55, y: 145, z: 150 },
      { x: -140, y: 145, z: 180 },
      { x: -145, y: 250, z: 285 },
      { x: -60, y: 250, z: 255 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // ATI Club (Right Field)
  {
    id: 'ati-club',
    name: 'ATI Club',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 120, y: 35, z: 300 },
      { x: 150, y: 35, z: 330 },
      { x: 150, y: 35, z: 350 },
      { x: 120, y: 35, z: 320 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Johnson Controls Deck
  {
    id: 'johnson-controls-deck',
    name: 'Johnson Controls Deck',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -80, y: 30, z: 350 },
      { x: -40, y: 30, z: 365 },
      { x: -40, y: 30, z: 385 },
      { x: -80, y: 30, z: 370 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Brewers Bar
  {
    id: 'brewers-bar',
    name: 'Brewers Bar',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 40, y: 35, z: 365 },
      { x: 80, y: 35, z: 375 },
      { x: 80, y: 35, z: 395 },
      { x: 40, y: 35, z: 385 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Uecker Seats (Obstructed View)
  {
    id: 'uecker-seats',
    name: 'Uecker Seats',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'J', 15, 155, 3.5, 20),
    vertices3D: [
      { x: -155, y: 155, z: 190 },
      { x: -145, y: 155, z: 200 },
      { x: -150, y: 190, z: 235 },
      { x: -160, y: 190, z: 225 }
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
      { x: -60, y: 100, z: 95 },
      { x: 60, y: 100, z: 95 },
      { x: 60, y: 110, z: 105 },
      { x: -60, y: 110, z: 105 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Restaurant Row
  {
    id: 'restaurant-row',
    name: 'Restaurant Row',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -50, y: 90, z: 90 },
      { x: -130, y: 90, z: 110 },
      { x: -130, y: 90, z: 130 },
      { x: -50, y: 90, z: 110 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Kids Zone
  {
    id: 'kids-zone',
    name: 'Kids Zone',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 140, y: 15, z: 320 },
      { x: 160, y: 15, z: 340 },
      { x: 160, y: 15, z: 360 },
      { x: 140, y: 15, z: 340 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Aurora Pavilion
  {
    id: 'aurora-pavilion',
    name: 'Aurora Pavilion',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'J', 18, 35, 2.5, 24),
    vertices3D: [
      { x: 100, y: 35, z: 380 },
      { x: 130, y: 35, z: 400 },
      { x: 135, y: 60, z: 425 },
      { x: 105, y: 60, z: 405 }
    ] as Vector3D[],
      covered: false  },
  
  // Brewers Bar
  {
    id: 'brewers-bar',
    name: 'Brewers Bar',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -90, y: 55, z: 140 },
      { x: -70, y: 55, z: 160 },
      { x: -70, y: 65, z: 170 },
      { x: -90, y: 65, z: 150 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Johnsonville Party Deck
  {
    id: 'johnsonville-deck',
    name: 'Johnsonville Party Deck',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: -140, y: 25, z: 320 },
      { x: -110, y: 25, z: 340 },
      { x: -110, y: 35, z: 350 },
      { x: -140, y: 35, z: 330 }
    ] as Vector3D[],
      covered: false  },
  
  // Uecker Seats
  {
    id: 'uecker-seats',
    name: 'Uecker Seats',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: -5, y: 85, z: 420 },
      { x: 5, y: 85, z: 420 },
      { x: 5, y: 90, z: 425 },
      { x: -5, y: 90, z: 425 }
    ] as Vector3D[],
      covered: false  }
];

// Stadium features
export const americanFamilyFieldFeatures = {
  retractableRoof: true,
  roofHeight: 170,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.35
  },
  climateControlled: true
};

// Export section map for easy lookup
export const americanFamilyFieldSectionMap = new Map(
  americanFamilyFieldSections.map(section => [section.id, section])
);
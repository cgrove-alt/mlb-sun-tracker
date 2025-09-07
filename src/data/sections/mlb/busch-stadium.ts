import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Busch Stadium - St. Louis Cardinals
// Opened: 2006
// Capacity: 44,494
// Orientation: 92° (Home plate to center field - Nearly due East)
// Famous features: Gateway Arch view, Ballpark Village, Big Mac Land, Cardinals Nation

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
      covered: false  });
  }
  
  return rows;
};

export const buschStadiumSections: DetailedSection[] = [
  // Green Seats - Behind Home Plate
  {
    id: 'green-seats',
    name: 'Green Seats',
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
      covered: false  },
  
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
      covered: false  },
  
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
      covered: false  },
  
  // Cardinals Nation Rooftop (Center Field)
  {
    id: 'cardinals-nation',
    name: 'Cardinals Nation',
    level: 'Rooftop',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: -40, y: 120, z: 400 },
      { x: 40, y: 120, z: 400 },
      { x: 40, y: 120, z: 430 },
      { x: -40, y: 120, z: 430 }
    ] as Vector3D[],
      covered: false  },
  
  // Big Mac Land (Left Field)
  {
    id: 'big-mac-land',
    name: 'Big Mac Land',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'S', 24, 20, 2.5, 20),
    vertices3D: [
      { x: -150, y: 20, z: 280 },
      { x: -120, y: 20, z: 320 },
      { x: -125, y: 67.5, z: 367.5 },
      { x: -155, y: 67.5, z: 327.5 }
    ] as Vector3D[],
      covered: false  },
  
  // Budweiser Terrace (Right Field)
  {
    id: 'budweiser-terrace',
    name: 'Budweiser Terrace',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'K', 20, 35, 2.5, 18),
    vertices3D: [
      { x: 120, y: 35, z: 300 },
      { x: 150, y: 35, z: 330 },
      { x: 155, y: 62.5, z: 357.5 },
      { x: 125, y: 62.5, z: 327.5 }
    ] as Vector3D[],
      covered: false  },
  
  // Redbird Club
  {
    id: 'redbird-club',
    name: 'Redbird Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices3D: [
      { x: 40, y: 75, z: 70 },
      { x: 125, y: 75, z: 95 },
      { x: 130, y: 114, z: 134 },
      { x: 45, y: 114, z: 109 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['J', 'K', 'L', 'M'],
      coveragePercent: 30
    }
  },
  
  // Champions Club
  {
    id: 'champions-club',
    name: 'Champions Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices3D: [
      { x: -40, y: 75, z: 70 },
      { x: -125, y: 75, z: 95 },
      { x: -130, y: 114, z: 134 },
      { x: -45, y: 114, z: 109 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['J', 'K', 'L', 'M'],
      coveragePercent: 30
    }
  },
  
  // Infield Terrace - Behind Home
  {
    id: 'infield-terrace-home',
    name: 'Infield Terrace - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 60, 3, 13),
    vertices3D: [
      { x: -40, y: 60, z: 55 },
      { x: 40, y: 60, z: 55 },
      { x: 45, y: 123, z: 118 },
      { x: -45, y: 123, z: 118 }
    ] as Vector3D[],
      covered: false  },
  
  // Pavilion - Behind Home
  {
    id: 'pavilion-home',
    name: 'Pavilion - Home Plate',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 130, 3.5, 15),
    vertices3D: [
      { x: -45, y: 130, z: 125 },
      { x: 45, y: 130, z: 125 },
      { x: 50, y: 224, z: 219 },
      { x: -50, y: 224, z: 219 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['S', 'T', 'U', 'V', 'W', 'X'],
      coveragePercent: 25
    }
  },
  
  // Pavilion - First Base
  {
    id: 'pavilion-1b',
    name: 'Pavilion - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 130, 3.5, 16),
    vertices3D: [
      { x: 50, y: 130, z: 135 },
      { x: 135, y: 130, z: 165 },
      { x: 140, y: 228, z: 263 },
      { x: 55, y: 228, z: 233 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 20
    }
  },
  
  // Pavilion - Third Base
  {
    id: 'pavilion-3b',
    name: 'Pavilion - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 28, 130, 3.5, 16),
    vertices3D: [
      { x: -50, y: 130, z: 135 },
      { x: -135, y: 130, z: 165 },
      { x: -140, y: 228, z: 263 },
      { x: -55, y: 228, z: 233 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 20
    }
  },
  
  // All-Inclusive Section
  {
    id: 'all-inclusive',
    name: 'All-Inclusive Section',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'L', 18, 25, 2.5, 15),
    vertices3D: [
      { x: 100, y: 25, z: 280 },
      { x: 125, y: 25, z: 305 },
      { x: 130, y: 55, z: 335 },
      { x: 105, y: 55, z: 310 }
    ] as Vector3D[],
      covered: false  },
  
  // Left Field Pavilion
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'R', 22, 75, 2.5, 19),
    vertices3D: [
      { x: -155, y: 75, z: 330 },
      { x: -125, y: 75, z: 370 },
      { x: -130, y: 117.5, z: 412.5 },
      { x: -160, y: 117.5, z: 372.5 }
    ] as Vector3D[],
      covered: false  },
  
  // Right Field Pavilion
  {
    id: 'right-field-pavilion',
    name: 'Right Field Pavilion',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'R', 22, 75, 2.5, 19),
    vertices3D: [
      { x: 125, y: 75, z: 330 },
      { x: 155, y: 75, z: 370 },
      { x: 160, y: 117.5, z: 412.5 },
      { x: 130, y: 117.5, z: 372.5 }
    ] as Vector3D[],
      covered: false  },
  
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
      { x: -60, y: 95, z: 90 },
      { x: 60, y: 95, z: 90 },
      { x: 60, y: 105, z: 100 },
      { x: -60, y: 105, z: 100 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Bowtie Bar
  {
    id: 'bowtie-bar',
    name: 'Bowtie Bar',
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
  
  // Ford Plaza
  {
    id: 'ford-plaza',
    name: 'Ford Plaza',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: 80, y: 30, z: 360 },
      { x: 110, y: 30, z: 375 },
      { x: 110, y: 30, z: 395 },
      { x: 80, y: 30, z: 380 }
    ] as Vector3D[],
      covered: false  },
  
  // AT&T Rooftop Deck
  {
    id: 'att-rooftop',
    name: 'AT&T Rooftop Deck',
    level: 'Rooftop',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: -80, y: 95, z: 350 },
      { x: -40, y: 95, z: 365 },
      { x: -40, y: 95, z: 385 },
      { x: -80, y: 95, z: 370 }
    ] as Vector3D[],
      covered: false  },
  
  // Bank of America Club
  {
    id: 'boa-club',
    name: 'Bank of America Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'J', 32, 80, 3, 11),
    vertices3D: [
      { x: -35, y: 80, z: 75 },
      { x: 35, y: 80, z: 75 },
      { x: 40, y: 113, z: 108 },
      { x: -40, y: 113, z: 108 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Scoreboard Patio
  {
    id: 'scoreboard-patio',
    name: 'Scoreboard Patio',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    vertices3D: [
      { x: -140, y: 28, z: 310 },
      { x: -110, y: 28, z: 330 },
      { x: -110, y: 28, z: 350 },
      { x: -140, y: 28, z: 330 }
    ] as Vector3D[],
      covered: false  },
  
  // Budweiser 703 Club (formerly Bowtie Bar)
  {
    id: 'budweiser-703-club',
    name: 'Budweiser 703 Club',
    level: 'club',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'K', 35, 55, 3, 28),
    vertices3D: [
      { x: -120, y: 55, z: 280 },
      { x: -90, y: 55, z: 300 },
      { x: -95, y: 88, z: 333 },
      { x: -125, y: 88, z: 313 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Redbird Club
  {
    id: 'redbird-club',
    name: 'Redbird Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 65, 3.2, 30),
    vertices3D: [
      { x: -40, y: 65, z: 70 },
      { x: 40, y: 65, z: 70 },
      { x: 45, y: 106.6, z: 111.6 },
      { x: -45, y: 106.6, z: 111.6 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium features
export const buschStadiumFeatures = {
  retractableRoof: false,
  roofHeight: 140,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const buschStadiumSectionMap = new Map(
  buschStadiumSections.map(section => [section.id, section])
);
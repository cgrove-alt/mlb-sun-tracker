import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Citizens Bank Park - Philadelphia Phillies
// Opened: 2004
// Capacity: 42,792
// Orientation: 59° (Home plate to center field)
// Famous features: Ashburn Alley, Liberty Bell, Phanatic Phun Zone

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

export const citizensBankParkSections: DetailedSection[] = [
  // Field Level - Behind Home Plate
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'T', 25, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 50, z: 60 },
      { x: -35, y: 50, z: 60 }
    ] as Vector3D[],
,
  
  // Field Level - First Base Line
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'X', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 120, y: 2, z: 30 },
      { x: 125, y: 60, z: 85 },
      { x: 35, y: 60, z: 65 }
    ] as Vector3D[],
,
  
  // Field Level - Third Base Line
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'X', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -120, y: 2, z: 30 },
      { x: -125, y: 60, z: 85 },
      { x: -35, y: 60, z: 65 }
    ] as Vector3D[],
,
  
  // Arcade Level - Behind Home
  {
    id: 'arcade-behind-home',
    name: 'Arcade - Behind Home',
    level: 'Arcade',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 20, 65, 3, 14),
    vertices3D: [
      { x: -40, y: 65, z: 70 },
      { x: 40, y: 65, z: 70 },
      { x: 45, y: 125, z: 130 },
      { x: -45, y: 125, z: 130 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['P', 'R', 'S', 'T', 'U'],
      coveragePercent: 25
    }
  },
  
  // Pavilion Level - First Base
  {
    id: 'pavilion-1b',
    name: 'Pavilion - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 24, 75, 3, 15),
    vertices3D: [
      { x: 45, y: 75, z: 80 },
      { x: 130, y: 75, z: 100 },
      { x: 135, y: 145, z: 170 },
      { x: 50, y: 145, z: 150 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 25
    }
  },
  
  // Pavilion Level - Third Base
  {
    id: 'pavilion-3b',
    name: 'Pavilion - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 24, 75, 3, 15),
    vertices3D: [
      { x: -45, y: 75, z: 80 },
      { x: -130, y: 75, z: 100 },
      { x: -135, y: 145, z: 170 },
      { x: -50, y: 145, z: 150 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 25
    }
  },
  
  // Hall of Fame Club
  {
    id: 'hall-of-fame-club',
    name: 'Hall of Fame Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'P', 30, 85, 3.5, 12),
    vertices3D: [
      { x: -50, y: 85, z: 90 },
      { x: -140, y: 85, z: 110 },
      { x: -145, y: 140, z: 165 },
      { x: -55, y: 140, z: 145 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Scoreboard Porch
  {
    id: 'scoreboard-porch',
    name: 'Scoreboard Porch',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'M', 18, 25, 2.5, 20),
    vertices3D: [
      { x: -150, y: 25, z: 280 },
      { x: -120, y: 25, z: 320 },
      { x: -125, y: 55, z: 350 },
      { x: -155, y: 55, z: 310 }
    ] as Vector3D[],
,
  
  // Ashburn Alley (Right Field)
  {
    id: 'ashburn-alley',
    name: 'Ashburn Alley',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: 120, y: 12, z: 280 },
      { x: 150, y: 12, z: 320 },
      { x: 150, y: 12, z: 340 },
      { x: 120, y: 12, z: 300 }
    ] as Vector3D[],
,
  
  // Big Phanatic Deck
  {
    id: 'big-phanatic-deck',
    name: 'Big Phanatic Deck',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'H', 25, 35, 3, 18),
    vertices3D: [
      { x: 100, y: 35, z: 340 },
      { x: 130, y: 35, z: 360 },
      { x: 135, y: 60, z: 385 },
      { x: 105, y: 60, z: 365 }
    ] as Vector3D[],
,
  
  // Rooftop Bleachers
  {
    id: 'rooftop-bleachers',
    name: 'Rooftop Bleachers',
    level: 'Rooftop',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'L', 30, 90, 2.5, 22),
    vertices3D: [
      { x: 140, y: 90, z: 300 },
      { x: 160, y: 90, z: 330 },
      { x: 165, y: 120, z: 360 },
      { x: 145, y: 120, z: 330 }
    ] as Vector3D[],
,
  
  // The Yard Kids Area
  {
    id: 'the-yard',
    name: 'The Yard',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -160, y: 15, z: 320 },
      { x: -140, y: 15, z: 340 },
      { x: -140, y: 15, z: 360 },
      { x: -160, y: 15, z: 340 }
    ] as Vector3D[],
,
  
  // Terrace Level - Behind Home
  {
    id: 'terrace-home',
    name: 'Terrace - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'W', 26, 145, 3.5, 16),
    vertices3D: [
      { x: -50, y: 145, z: 140 },
      { x: 50, y: 145, z: 140 },
      { x: 55, y: 225, z: 220 },
      { x: -55, y: 225, z: 220 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['R', 'S', 'T', 'U', 'V', 'W'],
      coveragePercent: 25
    }
  },
  
  // Terrace Level - First Base
  {
    id: 'terrace-1b',
    name: 'Terrace - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 28, 145, 3.5, 17),
    vertices3D: [
      { x: 55, y: 145, z: 150 },
      { x: 140, y: 145, z: 180 },
      { x: 145, y: 235, z: 270 },
      { x: 60, y: 235, z: 240 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['U', 'V', 'W', 'X', 'Y', 'Z'],
      coveragePercent: 20
    }
  },
  
  // Terrace Level - Third Base
  {
    id: 'terrace-3b',
    name: 'Terrace - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 28, 145, 3.5, 17),
    vertices3D: [
      { x: -55, y: 145, z: 150 },
      { x: -140, y: 145, z: 180 },
      { x: -145, y: 235, z: 270 },
      { x: -60, y: 235, z: 240 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      coveredRows: ['U', 'V', 'W', 'X', 'Y', 'Z'],
      coveragePercent: 20
    }
  },
  
  // Bullpen Suites
  {
    id: 'bullpen-suites',
    name: 'Bullpen Suites',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -140, y: 8, z: 200 },
      { x: -120, y: 8, z: 220 },
      { x: -120, y: 18, z: 220 },
      { x: -140, y: 18, z: 200 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Pass and Stow Restaurant
  {
    id: 'pass-and-stow',
    name: 'Pass and Stow Restaurant',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -20, y: 40, z: 400 },
      { x: 20, y: 40, z: 400 },
      { x: 20, y: 40, z: 420 },
      { x: -20, y: 40, z: 420 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Harry the K's Broadcast Bar
  {
    id: 'harry-ks-bar',
    name: "Harry the K's Broadcast Bar",
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -80, y: 30, z: 380 },
      { x: -40, y: 30, z: 390 },
      { x: -40, y: 30, z: 410 },
      { x: -80, y: 30, z: 400 }
    ] as Vector3D[],
,
  
  // Budweiser Roof Top
  {
    id: 'budweiser-rooftop',
    name: 'Budweiser Roof Top',
    level: 'Rooftop',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: 80, y: 95, z: 360 },
      { x: 120, y: 95, z: 380 },
      { x: 120, y: 95, z: 400 },
      { x: 80, y: 95, z: 380 }
    ] as Vector3D[],
,
  
  // Diamond Club
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'N', 24, 5, 2.5, 25),
    vertices3D: [
      { x: -30, y: 5, z: 50 },
      { x: 30, y: 5, z: 50 },
      { x: 35, y: 40, z: 85 },
      { x: -35, y: 40, z: 85 }
    ] as Vector3D[],
,
  
  // Hall of Fame Club
  {
    id: 'hall-fame-club',
    name: 'Hall of Fame Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'J', 28, 65, 3, 28),
    vertices3D: [
      { x: -90, y: 65, z: 120 },
      { x: -70, y: 65, z: 140 },
      { x: -75, y: 95, z: 170 },
      { x: -95, y: 95, z: 150 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Scoreboard Porch
  {
    id: 'scoreboard-porch',
    name: 'Scoreboard Porch',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: 120, y: 35, z: 340 },
      { x: 150, y: 35, z: 360 },
      { x: 150, y: 45, z: 370 },
      { x: 120, y: 45, z: 350 }
    ] as Vector3D[],
,
  
  // Rooftop Bleachers
  {
    id: 'rooftop-bleachers',
    name: 'Rooftop Bleachers',
    level: 'upper',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'G', 30, 80, 3.5, 35),
    vertices3D: [
      { x: -140, y: 80, z: 320 },
      { x: -110, y: 80, z: 340 },
      { x: -115, y: 104.5, z: 364.5 },
      { x: -145, y: 104.5, z: 344.5 }
    ] as Vector3D[],

];

// Stadium features
export const citizensBankParkFeatures = {
  retractableRoof: false,
  roofHeight: 150,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const citizensBankParkSectionMap = new Map(
  citizensBankParkSections.map(section => [section.id, section]));
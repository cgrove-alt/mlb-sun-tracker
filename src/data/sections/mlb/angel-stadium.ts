import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Angel Stadium - Los Angeles Angels
// Opened: 1966
// Capacity: 45,517
// Orientation: 65° (Home plate to center field)
// Famous features: The Rock waterfall, California Spectacular

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

export const angelStadiumSections: DetailedSection[] = [
  // Diamond Club - Behind Home Plate
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'field',
    rows: generateRows('A', 'S', 24, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 47.5, z: 57.5 },
      { x: -35, y: 47.5, z: 57.5 }
    ],
    covered: false
  },
  
  // Field Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 55, z: 82 },
      { x: 35, y: 55, z: 63 }
    ],
    covered: false
  },
  
  // Field Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 55, z: 82 },
      { x: -35, y: 55, z: 63 }
    ],
    covered: false
  },
  
  // Club Level - Behind Home
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    level: 'club',
    rows: generateRows('A', 'N', 26, 75, 3, 12),
    vertices3D: [
      { x: -40, y: 75, z: 65 },
      { x: 40, y: 75, z: 65 },
      { x: 45, y: 117, z: 107 },
      { x: -45, y: 117, z: 107 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['K', 'L', 'M', 'N'],
      coveragePercentage: 30
    }
  },
  
  // Terrace Level - First Base
  {
    id: 'terrace-1b',
    name: 'Terrace - First Base',
    level: 'upper',
    rows: generateRows('A', 'X', 24, 60, 3, 14),
    vertices3D: [
      { x: 40, y: 60, z: 65 },
      { x: 125, y: 60, z: 90 },
      { x: 130, y: 138, z: 168 },
      { x: 45, y: 138, z: 143 }
    ],
    covered: false
  },
  
  // Terrace Level - Third Base
  {
    id: 'terrace-3b',
    name: 'Terrace - Third Base',
    level: 'upper',
    rows: generateRows('A', 'X', 24, 60, 3, 14),
    vertices3D: [
      { x: -40, y: 60, z: 65 },
      { x: -125, y: 60, z: 90 },
      { x: -130, y: 138, z: 168 },
      { x: -45, y: 138, z: 143 }
    ],
    covered: false
  },
  
  // The Rock - Left Field
  {
    id: 'the-rock',
    name: 'The Rock',
    level: 'field',
    rows: generateRows('A', 'M', 20, 25, 2.5, 20),
    vertices3D: [
      { x: -130, y: 25, z: 320 },
      { x: -100, y: 25, z: 350 },
      { x: -105, y: 57.5, z: 382.5 },
      { x: -135, y: 57.5, z: 352.5 }
    ],
    covered: false
  },
  
  // Right Field Pavilion
  {
    id: 'right-field-pavilion',
    name: 'Right Field Pavilion',
    level: 'field',
    rows: generateRows('A', 'T', 25, 20, 2.5, 18),
    vertices3D: [
      { x: 120, y: 20, z: 280 },
      { x: 150, y: 20, z: 320 },
      { x: 155, y: 70, z: 370 },
      { x: 125, y: 70, z: 330 }
    ],
    covered: false
  },
  
  // Left Field Pavilion
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    rows: generateRows('A', 'T', 25, 20, 2.5, 18),
    vertices3D: [
      { x: -150, y: 20, z: 280 },
      { x: -120, y: 20, z: 320 },
      { x: -125, y: 70, z: 370 },
      { x: -155, y: 70, z: 330 }
    ],
    covered: false
  },
  
  // View Level - Behind Home
  {
    id: 'view-level-home',
    name: 'View Level - Home Plate',
    level: 'upper',
    rows: generateRows('A', 'Z', 26, 120, 3.5, 16),
    vertices3D: [
      { x: -50, y: 120, z: 110 },
      { x: 50, y: 120, z: 110 },
      { x: 55, y: 220, z: 210 },
      { x: -55, y: 220, z: 210 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['U', 'V', 'W', 'X', 'Y', 'Z'],
      coveragePercentage: 25
    }
  },
  
  // View Level - First Base
  {
    id: 'view-level-1b',
    name: 'View Level - First Base',
    level: 'upper',
    rows: generateRows('A', 'AA', 28, 120, 3.5, 17),
    vertices3D: [
      { x: 55, y: 120, z: 120 },
      { x: 140, y: 120, z: 150 },
      { x: 145, y: 225, z: 255 },
      { x: 60, y: 225, z: 225 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['V', 'W', 'X', 'Y', 'Z', 'AA'],
      coveragePercentage: 20
    }
  },
  
  // View Level - Third Base
  {
    id: 'view-level-3b',
    name: 'View Level - Third Base',
    level: 'upper',
    rows: generateRows('A', 'AA', 28, 120, 3.5, 17),
    vertices3D: [
      { x: -55, y: 120, z: 120 },
      { x: -140, y: 120, z: 150 },
      { x: -145, y: 225, z: 255 },
      { x: -60, y: 225, z: 225 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['V', 'W', 'X', 'Y', 'Z', 'AA'],
      coveragePercentage: 20
    }
  },
  
  // Bullpen Overlook
  {
    id: 'bullpen-overlook',
    name: 'Bullpen Overlook',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -140, y: 8, z: 200 },
      { x: -120, y: 8, z: 220 },
      { x: -120, y: 8, z: 240 },
      { x: -140, y: 8, z: 220 }
    ],
    covered: false
  },
  
  // Coors Light Strike Zone
  {
    id: 'coors-light-strike-zone',
    name: 'Coors Light Strike Zone',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: 80, y: 30, z: 360 },
      { x: 120, y: 30, z: 380 },
      { x: 120, y: 30, z: 400 },
      { x: 80, y: 30, z: 380 }
    ],
    covered: false
  },
  
  // Bud Light Social Patio
  {
    id: 'bud-light-patio',
    name: 'Bud Light Social Patio',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -80, y: 35, z: 350 },
      { x: -40, y: 35, z: 365 },
      { x: -40, y: 35, z: 385 },
      { x: -80, y: 35, z: 370 }
    ],
    covered: false
  },
  
  // Trout Tower
  {
    id: 'trout-tower',
    name: 'Trout Tower',
    level: 'field',
    rows: generateRows('A', 'H', 18, 40, 2.5, 22),
    vertices3D: [
      { x: -20, y: 40, z: 390 },
      { x: 20, y: 40, z: 390 },
      { x: 25, y: 60, z: 410 },
      { x: -25, y: 60, z: 410 }
    ],
    covered: false
  },
  
  // Knothole Club (Family Area)
  {
    id: 'knothole-club',
    name: 'Knothole Club',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: 140, y: 15, z: 320 },
      { x: 160, y: 15, z: 340 },
      { x: 160, y: 15, z: 360 },
      { x: 140, y: 15, z: 340 }
    ],
    covered: false
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -60, y: 90, z: 85 },
      { x: 60, y: 90, z: 85 },
      { x: 60, y: 100, z: 95 },
      { x: -60, y: 100, z: 95 }
    ],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Lexus Diamond Club Restaurant
  {
    id: 'lexus-diamond-club-restaurant',
    name: 'Lexus Diamond Club Restaurant',
    level: 'club',
    rows: generateRows('A', 'K', 22, 55, 3, 15),
    vertices3D: [
      { x: -35, y: 55, z: 50 },
      { x: 35, y: 55, z: 50 },
      { x: 40, y: 88, z: 83 },
      { x: -40, y: 88, z: 83 }
    ],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Don Julio Club
  {
    id: 'don-julio-club',
    name: 'Don Julio Club',
    level: 'upper',
    rows: generateRows('A', 'P', 20, 85, 3, 14),
    vertices3D: [
      { x: -45, y: 85, z: 75 },
      { x: 45, y: 85, z: 75 },
      { x: 50, y: 133, z: 123 },
      { x: -50, y: 133, z: 123 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['L', 'M', 'N', 'P'],
      coveragePercentage: 25
    }
  },
  
  // Dugout Suites
  {
    id: 'dugout-suites',
    name: 'Dugout Suites',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -25, y: 3, z: 5 },
      { x: 25, y: 3, z: 5 },
      { x: 25, y: 6, z: 8 },
      { x: -25, y: 6, z: 8 }
    ],
    covered: false
  },
  
  // Triple Play Suites
  {
    id: 'triple-play-suites',
    name: 'Triple Play Suites',
    level: 'suite',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 65, y: 95, z: 90 },
      { x: 120, y: 95, z: 110 },
      { x: 120, y: 105, z: 120 },
      { x: 65, y: 105, z: 100 }
    ],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Legends Suites
  {
    id: 'legends-suites',
    name: 'Legends Suites',
    level: 'upper',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -65, y: 88, z: 90 },
      { x: -120, y: 88, z: 110 },
      { x: -120, y: 98, z: 120 },
      { x: -65, y: 98, z: 100 }
    ],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium features
export const angelStadiumFeatures = {
  retractableRoof: false,
  roofHeight: 120,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const angelStadiumSectionMap = new Map(
  angelStadiumSections.map(section => [section.id, section]));
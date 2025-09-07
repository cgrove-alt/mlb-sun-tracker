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
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      cushionedSeats: true,
      inSeatService: true,
      privateRestrooms: true,
      exclusiveAccess: true
    }
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
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
    premium: true,
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['K', 'L', 'M', 'N'],
      coveragePercentage: 30
    },
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      widePaddedSeats: true,
      inSeatService: true,
      privateEntrance: true,
      exclusiveDining: true
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
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
    premium: false,
    covered: false,
    obstructionType: 'rock-feature',
    obstructedView: {
      type: 'partial',
      description: 'Rock waterfall feature may affect some views'
    },
    accessibilityRating: 3,
    features: {
      waterfallFeature: true,
      uniqueLandmark: true
    }
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
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
    premium: false,
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['U', 'V', 'W', 'X', 'Y', 'Z'],
      coveragePercentage: 25
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 2
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
    premium: false,
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['V', 'W', 'X', 'Y', 'Z', 'AA'],
      coveragePercentage: 20
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 2
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
    premium: false,
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['V', 'W', 'X', 'Y', 'Z', 'AA'],
      coveragePercentage: 20
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Bullpen Overlook
  {
    id: 'bullpen-overlook',
    name: 'Bullpen Overlook',
    level: 'field',
    rows: [
      { rowNumber: 'Bench', seats: 40, elevation: 8, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -140, y: 8, z: 200 },
      { x: -120, y: 8, z: 220 },
      { x: -120, y: 8, z: 240 },
      { x: -140, y: 8, z: 220 }
    ],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      bullpenView: true,
      casualSeating: true
    }
  },
  
  // Coors Light Strike Zone
  {
    id: 'coors-light-strike-zone',
    name: 'Coors Light Strike Zone',
    level: 'field',
    rows: [
      { rowNumber: 'SRO', seats: 150, elevation: 30, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 80, y: 30, z: 360 },
      { x: 120, y: 30, z: 380 },
      { x: 120, y: 30, z: 400 },
      { x: 80, y: 30, z: 380 }
    ],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      standingRoom: true,
      drinkRails: true,
      socialArea: true
    }
  },
  
  // Bud Light Social Patio
  {
    id: 'bud-light-patio',
    name: 'Bud Light Social Patio',
    level: 'field',
    rows: [
      { rowNumber: 'Patio', seats: 100, elevation: 35, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -80, y: 35, z: 350 },
      { x: -40, y: 35, z: 365 },
      { x: -40, y: 35, z: 385 },
      { x: -80, y: 35, z: 370 }
    ],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      patioSeating: true,
      standingRoom: true,
      fullBar: true,
      tvMonitors: true
    }
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
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      towerSeating: true,
      elevatedViews: true
    }
  },
  
  // Knothole Club (Family Area)
  {
    id: 'knothole-club',
    name: 'Knothole Club',
    level: 'field',
    rows: [
      { rowNumber: 'Family', seats: 75, elevation: 15, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 140, y: 15, z: 320 },
      { x: 160, y: 15, z: 340 },
      { x: 160, y: 15, z: 360 },
      { x: 140, y: 15, z: 340 }
    ],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      familyArea: true,
      playground: true,
      kidsFriendly: true
    }
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    rows: [
      { rowNumber: 'Suite', seats: 20, elevation: 90, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -60, y: 90, z: 85 },
      { x: 60, y: 90, z: 85 },
      { x: 60, y: 100, z: 95 },
      { x: -60, y: 100, z: 95 }
    ],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      privateSuite: true,
      cateringAvailable: true,
      privateRestrooms: true,
      dedicatedAttendant: true
    }
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
    premium: true,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      exclusiveDining: true,
      climateControlled: true,
      premiumBar: true,
      inSeatService: true,
      privateEntrance: true,
      changingMenus: true
    }
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
    premium: true,
    covered: true,
    partialCoverage: {
      type: 'partial' as const,
      coveredRows: ['L', 'M', 'N', 'P'],
      coveragePercentage: 25
    },
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      openAirViewing: true,
      loungeInterior: true,
      liberalLegRoom: true,
      uniqueDishes: true,
      tequilaBar: true
    }
  },
  
  // Dugout Suites
  {
    id: 'dugout-suites',
    name: 'Dugout Suites',
    level: 'field',
    rows: [
      { rowNumber: 'Suite', seats: 12, elevation: 3, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -25, y: 3, z: 5 },
      { x: 25, y: 3, z: 5 },
      { x: 25, y: 6, z: 8 },
      { x: -25, y: 6, z: 8 }
    ],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      dugoutLevel: true,
      fiftyFeetFromBatter: true,
      privateSuite: true,
      diamondClubAccess: true,
      fieldLevel: true
    }
  },
  
  // Triple Play Suites
  {
    id: 'triple-play-suites',
    name: 'Triple Play Suites',
    level: 'suite',
    rows: [
      { rowNumber: 'Suite', seats: 18, elevation: 95, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: 65, y: 95, z: 90 },
      { x: 120, y: 95, z: 110 },
      { x: 120, y: 105, z: 120 },
      { x: 65, y: 105, z: 100 }
    ],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      addedIn2018: true,
      plushLeatherSeating: true,
      climateControlled: true,
      capacity18Guests: true,
      executiveLevel: true
    }
  },
  
  // Legends Suites
  {
    id: 'legends-suites',
    name: 'Legends Suites',
    level: 'upper',
    rows: [
      { rowNumber: 'Suite', seats: 16, elevation: 88, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -65, y: 88, z: 90 },
      { x: -120, y: 88, z: 110 },
      { x: -120, y: 98, z: 120 },
      { x: -65, y: 98, z: 100 }
    ],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      seating8Guests: true,
      standingRoom16: true,
      terraceLevelSuite: true,
      behindHomePlate: true
    }
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
  angelStadiumSections.map(section => [section.id, section])
);
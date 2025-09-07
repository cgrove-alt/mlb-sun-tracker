import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// loanDepot park - Miami Marlins
// Opened: 2012
// Capacity: 37,446
// Orientation: 40° (Home plate to center field)
// Features: Retractable roof, Clevelander Club, Bobblehead Museum, Home Run Sculpture

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

export const loanDepotParkSections: DetailedSection[] = [
  // Backstop Club - Behind Home Plate
  {
    id: 'backstop-club',
    name: 'Backstop Club',
    level: 'Field',
    orientation: 'home-plate',
    rows: generateRows('A', 'N', 22, 2, 2.5, 10),
    vertices: [
      { x: -28, y: 2, z: 10 },
      { x: 28, y: 2, z: 10 },
      { x: 33, y: 35, z: 45 },
      { x: -33, y: 35, z: 45 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      cushionedSeats: true,
      inSeatService: true,
      privateRestrooms: true,
      exclusiveAccess: true,
      climateControlled: true
    }
  },
  
  // Field Reserved - First Base
  {
    id: 'field-reserved-1b',
    name: 'Field Reserved - First Base',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'U', 21, 2, 2.5, 11),
    vertices: [
      { x: 28, y: 2, z: 10 },
      { x: 115, y: 2, z: 28 },
      { x: 120, y: 52.5, z: 78.5 },
      { x: 33, y: 52.5, z: 60.5 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Field Reserved - Third Base
  {
    id: 'field-reserved-3b',
    name: 'Field Reserved - Third Base',
    level: 'Field',
    orientation: 'third-base',
    rows: generateRows('A', 'U', 21, 2, 2.5, 11),
    vertices: [
      { x: -28, y: 2, z: 10 },
      { x: -115, y: 2, z: 28 },
      { x: -120, y: 52.5, z: 78.5 },
      { x: -33, y: 52.5, z: 60.5 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Clevelander Club (Left Field)
  {
    id: 'clevelander-club',
    name: 'Clevelander Club',
    level: 'Outfield',
    orientation: 'left-field',
    rows: [
      { rowNumber: 'Club', seats: 240, elevation: 25, depth: 0, covered: true }
    ],
    vertices: [
      { x: -130, y: 25, z: 330 },
      { x: -100, y: 25, z: 360 },
      { x: -100, y: 35, z: 370 },
      { x: -130, y: 35, z: 340 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      swimmingPool: true,
      nightclub: true,
      danceFloor: true,
      vipTables: true,
      bottleService: true,
      djBooth: true,
      partyAtmosphere: true
    }
  },
  
  // Bobblehead Museum
  {
    id: 'bobblehead-museum',
    name: 'Bobblehead Museum',
    level: 'Concourse',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Museum', seats: 50, elevation: 40, depth: 0, covered: true }
    ],
    vertices: [
      { x: -15, y: 40, z: 395 },
      { x: 15, y: 40, z: 395 },
      { x: 15, y: 40, z: 410 },
      { x: -15, y: 40, z: 410 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      bobbleheadDisplay: true,
      museumExhibits: true,
      interactiveDisplays: true,
      marlinsHistory: true
    }
  },
  
  // Vista Level - Behind Home
  {
    id: 'vista-home',
    name: 'Vista - Home Plate',
    level: 'Vista',
    orientation: 'home-plate',
    rows: generateRows('A', 'S', 22, 58, 3, 13),
    vertices: [
      { x: -38, y: 58, z: 55 },
      { x: 38, y: 58, z: 55 },
      { x: 43, y: 115, z: 112 },
      { x: -43, y: 115, z: 112 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Vista Level - First Base
  {
    id: 'vista-1b',
    name: 'Vista - First Base',
    level: 'Vista',
    orientation: 'first-base',
    rows: generateRows('A', 'U', 24, 58, 3, 14),
    vertices: [
      { x: 43, y: 58, z: 60 },
      { x: 120, y: 58, z: 85 },
      { x: 125, y: 130, z: 157 },
      { x: 48, y: 130, z: 132 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Vista Level - Third Base
  {
    id: 'vista-3b',
    name: 'Vista - Third Base',
    level: 'Vista',
    orientation: 'third-base',
    rows: generateRows('A', 'U', 24, 58, 3, 14),
    vertices: [
      { x: -43, y: 58, z: 60 },
      { x: -120, y: 58, z: 85 },
      { x: -125, y: 130, z: 157 },
      { x: -48, y: 130, z: 132 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Legends Club
  {
    id: 'legends-club',
    name: 'Legends Club',
    level: 'Club',
    orientation: 'first-base',
    rows: generateRows('A', 'L', 26, 75, 3, 12),
    vertices: [
      { x: 48, y: 75, z: 70 },
      { x: 125, y: 75, z: 90 },
      { x: 130, y: 111, z: 126 },
      { x: 53, y: 111, z: 106 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      paddedSeats: true,
      privateBar: true,
      exclusiveDining: true,
      marlinsLegends: true,
      climateControlled: true
    }
  },
  
  // Upper Level - Behind Home
  {
    id: 'upper-home',
    name: 'Upper Level - Home Plate',
    level: 'Upper',
    orientation: 'home-plate',
    rows: generateRows('A', 'W', 25, 135, 3.5, 16),
    vertices: [
      { x: -45, y: 135, z: 130 },
      { x: 45, y: 135, z: 130 },
      { x: 50, y: 226, z: 221 },
      { x: -50, y: 226, z: 221 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Upper Level - First Base
  {
    id: 'upper-1b',
    name: 'Upper Level - First Base',
    level: 'Upper',
    orientation: 'first-base',
    rows: generateRows('A', 'X', 27, 135, 3.5, 17),
    vertices: [
      { x: 50, y: 135, z: 140 },
      { x: 130, y: 135, z: 170 },
      { x: 135, y: 233, z: 268 },
      { x: 55, y: 233, z: 238 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Upper Level - Third Base
  {
    id: 'upper-3b',
    name: 'Upper Level - Third Base',
    level: 'Upper',
    orientation: 'third-base',
    rows: generateRows('A', 'X', 27, 135, 3.5, 17),
    vertices: [
      { x: -50, y: 135, z: 140 },
      { x: -130, y: 135, z: 170 },
      { x: -135, y: 233, z: 268 },
      { x: -55, y: 233, z: 238 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Home Run Porch (Right Field)
  {
    id: 'home-run-porch',
    name: 'Home Run Porch',
    level: 'Outfield',
    orientation: 'right-field',
    rows: generateRows('A', 'J', 20, 28, 2.5, 18),
    vertices: [
      { x: 120, y: 28, z: 300 },
      { x: 145, y: 28, z: 330 },
      { x: 150, y: 53, z: 355 },
      { x: 125, y: 53, z: 325 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      homeRunTerritory: true,
      picnicTables: true,
      casualSeating: true
    }
  },
  
  // East Plaza
  {
    id: 'east-plaza',
    name: 'East Plaza',
    level: 'Outfield',
    orientation: 'right-center',
    rows: [
      { rowNumber: 'SRO', seats: 150, elevation: 35, depth: 0, covered: true }
    ],
    vertices: [
      { x: 80, y: 35, z: 365 },
      { x: 110, y: 35, z: 380 },
      { x: 110, y: 35, z: 400 },
      { x: 80, y: 35, z: 385 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      standingRoom: true,
      foodCourt: true,
      socialArea: true
    }
  },
  
  // West Plaza
  {
    id: 'west-plaza',
    name: 'West Plaza',
    level: 'Outfield',
    orientation: 'left-center',
    rows: [
      { rowNumber: 'SRO', seats: 150, elevation: 35, depth: 0, covered: true }
    ],
    vertices: [
      { x: -110, y: 35, z: 365 },
      { x: -80, y: 35, z: 380 },
      { x: -80, y: 35, z: 400 },
      { x: -110, y: 35, z: 385 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      standingRoom: true,
      drinkRails: true,
      socialArea: true
    }
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'Suite',
    orientation: 'home-plate',
    rows: [
      { rowNumber: 'Suite', seats: 18, elevation: 95, depth: 0, covered: true }
    ],
    vertices: [
      { x: -55, y: 95, z: 90 },
      { x: 55, y: 95, z: 90 },
      { x: 55, y: 105, z: 100 },
      { x: -55, y: 105, z: 100 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      privateSuite: true,
      cateringAvailable: true,
      privateRestrooms: true,
      dedicatedAttendant: true,
      climateControlled: true
    }
  },
  
  // Budweiser Bowtie Bar
  {
    id: 'budweiser-bowtie',
    name: 'Budweiser Bowtie Bar',
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Bar', seats: 100, elevation: 38, depth: 0, covered: true }
    ],
    vertices: [
      { x: -30, y: 38, z: 390 },
      { x: 30, y: 38, z: 390 },
      { x: 30, y: 38, z: 410 },
      { x: -30, y: 38, z: 410 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      bowtieShape: true,
      fullBar: true,
      standingRoom: true,
      tvMonitors: true
    }
  },
  
  // The Bermuda Triangle
  {
    id: 'bermuda-triangle',
    name: 'The Bermuda Triangle',
    level: 'Outfield',
    orientation: 'center-field',
    rows: generateRows('A', 'G', 18, 32, 2.5, 20),
    vertices: [
      { x: -10, y: 32, z: 405 },
      { x: 10, y: 32, z: 405 },
      { x: 15, y: 49.5, z: 422.5 },
      { x: -15, y: 49.5, z: 422.5 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      uniqueAngle: true,
      triangularSection: true,
      centerFieldView: true
    }
  },
  
  // Home Plate Club
  {
    id: 'home-plate-club',
    name: 'Home Plate Club',
    level: 'Club',
    orientation: 'home-plate',
    rows: generateRows('A', 'K', 28, 78, 3, 11),
    vertices: [
      { x: -35, y: 78, z: 73 },
      { x: 35, y: 78, z: 73 },
      { x: 40, y: 111, z: 106 },
      { x: -40, y: 111, z: 106 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      behindHomePlate: true,
      premiumDining: true,
      privateBar: true,
      wideSeats: true
    }
  },
  
  // Baseline Box - First Base
  {
    id: 'baseline-box-1b',
    name: 'Baseline Box - First Base',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'H', 16, 5, 2.5, 9),
    vertices: [
      { x: 55, y: 5, z: 18 },
      { x: 75, y: 5, z: 22 },
      { x: 80, y: 25, z: 42 },
      { x: 60, y: 25, z: 38 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      closeToField: true,
      baselineView: true
    }
  },
  
  // Baseline Box - Third Base
  {
    id: 'baseline-box-3b',
    name: 'Baseline Box - Third Base',
    level: 'Field',
    orientation: 'third-base',
    rows: generateRows('A', 'H', 16, 5, 2.5, 9),
    vertices: [
      { x: -55, y: 5, z: 18 },
      { x: -75, y: 5, z: 22 },
      { x: -80, y: 25, z: 42 },
      { x: -60, y: 25, z: 38 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      closeToField: true,
      baselineView: true
    }
  },
  
  // Bullpen Bar & Grill (replaced Clevelander)
  {
    id: 'bullpen-bar-grill',
    name: 'Bullpen Bar & Grill',
    level: 'Field',
    orientation: 'left-field',
    rows: [
      { rowNumber: 'Bar', seats: 80, elevation: 8, depth: 0, covered: false },
      { rowNumber: 'Tables', seats: 60, elevation: 10, depth: 5, covered: false }
    ],
    vertices: [
      { x: -130, y: 8, z: 340 },
      { x: -100, y: 8, z: 360 },
      { x: -100, y: 15, z: 367 },
      { x: -130, y: 15, z: 347 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      bullpenBarGrill: true,
      replacedClevelander: true,
      sportsLounge: true,
      fieldLevelSeating: true,
      since2020: true
    }
  },
  
  // Recess Sports Lounge
  {
    id: 'recess-sports-lounge',
    name: 'Recess Sports Lounge',
    level: 'Field',
    orientation: 'left-field',
    rows: [
      { rowNumber: 'Booths', seats: 40, elevation: 6, depth: 0, covered: true },
      { rowNumber: 'Tables', seats: 50, elevation: 8, depth: 3, covered: true }
    ],
    vertices: [
      { x: -115, y: 6, z: 320 },
      { x: -85, y: 6, z: 340 },
      { x: -85, y: 11, z: 345 },
      { x: -115, y: 11, z: 325 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      recessSportsLounge: true,
      miamiNightlife: true,
      liveDJ: true,
      curvedBooths: true,
      facingField: true,
      diningTables: true,
      throughFence: true
    }
  }
];

// Stadium features
export const loanDepotParkFeatures = {
  retractableRoof: true,
  roofHeight: 185,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.35
  },
  climateControlled: true
};

// Export section map for easy lookup
export const loanDepotParkSectionMap = new Map(
  loanDepotParkSections.map(section => [section.id, section])
);
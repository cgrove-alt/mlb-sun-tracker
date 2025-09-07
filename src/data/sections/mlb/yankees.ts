import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Yankee Stadium - New York Yankees
// Opened: 2009
// Capacity: 46,537
// Orientation: 55° (Home plate to center field)
// Famous features: Monument Park, Judge's Chambers, Bleacher Creatures

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

export const yankeeStadiumSections: DetailedSection[] = [
  // Legends Suite - Behind Home Plate
  {
    id: 'legends-suite',
    name: 'Legends Suite',
    level: 'Field',
    orientation: 'home-plate',
    rows: generateRows('A', 'P', 26, 2, 2.5, 10),
    vertices: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 40, z: 50 },
      { x: -35, y: 40, z: 50 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      cushionedSeats: true,
      inSeatService: true,
      privateRestrooms: true,
      exclusiveAccess: true,
      allInclusive: true
    }
  },
  
  // Field Level - First Base
  {
    id: 'field-level-1b',
    name: 'Field Level - First Base',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 55, z: 82 },
      { x: 35, y: 55, z: 63 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Field Level - Third Base
  {
    id: 'field-level-3b',
    name: 'Field Level - Third Base',
    level: 'Field',
    orientation: 'third-base',
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 55, z: 82 },
      { x: -35, y: 55, z: 63 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Jim Beam Suite Deck
  {
    id: 'jim-beam-suite',
    name: 'Jim Beam Suite Deck',
    level: 'Suite',
    orientation: 'right-field',
    rows: [
      { rowNumber: 'Suite', seats: 60, elevation: 35, depth: 0, covered: false }
    ],
    vertices: [
      { x: 120, y: 35, z: 300 },
      { x: 150, y: 35, z: 330 },
      { x: 150, y: 45, z: 340 },
      { x: 120, y: 45, z: 310 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      privateDeck: true,
      premiumBar: true,
      groupSeating: true,
      cateringAvailable: true
    }
  },
  
  // Main Level - Behind Home
  {
    id: 'main-level-home',
    name: 'Main Level - Home Plate',
    level: 'Main',
    orientation: 'home-plate',
    rows: generateRows('A', 'U', 24, 60, 3, 13),
    vertices: [
      { x: -40, y: 60, z: 55 },
      { x: 40, y: 60, z: 55 },
      { x: 45, y: 123, z: 118 },
      { x: -45, y: 123, z: 118 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Main Level - First Base
  {
    id: 'main-level-1b',
    name: 'Main Level - First Base',
    level: 'Main',
    orientation: 'first-base',
    rows: generateRows('A', 'W', 25, 60, 3, 14),
    vertices: [
      { x: 45, y: 60, z: 65 },
      { x: 125, y: 60, z: 90 },
      { x: 130, y: 141, z: 171 },
      { x: 50, y: 141, z: 146 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Main Level - Third Base
  {
    id: 'main-level-3b',
    name: 'Main Level - Third Base',
    level: 'Main',
    orientation: 'third-base',
    rows: generateRows('A', 'W', 25, 60, 3, 14),
    vertices: [
      { x: -45, y: 60, z: 65 },
      { x: -125, y: 60, z: 90 },
      { x: -130, y: 141, z: 171 },
      { x: -50, y: 141, z: 146 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Toyota Terrace Level - Behind Home
  {
    id: 'terrace-level-home',
    name: 'Toyota Terrace - Home Plate',
    level: 'Terrace',
    orientation: 'home-plate',
    rows: generateRows('A', 'X', 26, 125, 3.5, 15),
    vertices: [
      { x: -45, y: 125, z: 120 },
      { x: 45, y: 125, z: 120 },
      { x: 50, y: 219, z: 214 },
      { x: -50, y: 219, z: 214 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    partialCoverage: {
      coveredRows: ['S', 'T', 'U', 'V', 'W', 'X'],
      coveragePercent: 25
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 3
  },
  
  // Toyota Terrace Level - First Base
  {
    id: 'terrace-level-1b',
    name: 'Toyota Terrace - First Base',
    level: 'Terrace',
    orientation: 'first-base',
    rows: generateRows('A', 'Y', 27, 125, 3.5, 16),
    vertices: [
      { x: 50, y: 125, z: 130 },
      { x: 135, y: 125, z: 160 },
      { x: 140, y: 223, z: 258 },
      { x: 55, y: 223, z: 228 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 20
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Toyota Terrace Level - Third Base
  {
    id: 'terrace-level-3b',
    name: 'Toyota Terrace - Third Base',
    level: 'Terrace',
    orientation: 'third-base',
    rows: generateRows('A', 'Y', 27, 125, 3.5, 16),
    vertices: [
      { x: -50, y: 125, z: 130 },
      { x: -135, y: 125, z: 160 },
      { x: -140, y: 223, z: 258 },
      { x: -55, y: 223, z: 228 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    partialCoverage: {
      coveredRows: ['T', 'U', 'V', 'W', 'X', 'Y'],
      coveragePercent: 20
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Grandstand Level - Behind Home
  {
    id: 'grandstand-home',
    name: 'Grandstand - Home Plate',
    level: 'Grandstand',
    orientation: 'home-plate',
    rows: generateRows('A', 'Z', 28, 180, 3.5, 17),
    vertices: [
      { x: -50, y: 180, z: 175 },
      { x: 50, y: 180, z: 175 },
      { x: 55, y: 280, z: 275 },
      { x: -55, y: 280, z: 275 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    partialCoverage: {
      coveredRows: ['U', 'V', 'W', 'X', 'Y', 'Z'],
      coveragePercent: 20
    },
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // Bleacher Creatures (Right Field)
  {
    id: 'bleacher-creatures',
    name: 'Bleacher Creatures',
    level: 'Bleachers',
    orientation: 'right-field',
    rows: generateRows('A', 'U', 25, 20, 2.5, 20),
    vertices: [
      { x: 130, y: 20, z: 290 },
      { x: 160, y: 20, z: 330 },
      { x: 165, y: 72.5, z: 382.5 },
      { x: 135, y: 72.5, z: 342.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      bleacherCreatures: true,
      rollCall: true,
      loudestSection: true,
      fanTradition: true
    }
  },
  
  // Judge's Chambers (Right Field)
  {
    id: 'judges-chambers',
    name: "Judge's Chambers",
    level: 'Bleachers',
    orientation: 'right-field',
    rows: generateRows('A', 'H', 18, 25, 2.5, 22),
    vertices: [
      { x: 145, y: 25, z: 310 },
      { x: 165, y: 25, z: 335 },
      { x: 170, y: 45, z: 355 },
      { x: 150, y: 45, z: 330 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      judgesBox: true,
      themedSection: true,
      gavels: true,
      specialSeating: true
    }
  },
  
  // Left Field Bleachers
  {
    id: 'left-field-bleachers',
    name: 'Left Field Bleachers',
    level: 'Bleachers',
    orientation: 'left-field',
    rows: generateRows('A', 'U', 25, 20, 2.5, 20),
    vertices: [
      { x: -160, y: 20, z: 290 },
      { x: -130, y: 20, z: 330 },
      { x: -135, y: 72.5, z: 382.5 },
      { x: -165, y: 72.5, z: 342.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Monument Park
  {
    id: 'monument-park',
    name: 'Monument Park',
    level: 'Field',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Standing', seats: 100, elevation: 8, depth: 0, covered: false }
    ],
    vertices: [
      { x: -30, y: 8, z: 408 },
      { x: 30, y: 8, z: 408 },
      { x: 30, y: 8, z: 420 },
      { x: -30, y: 8, z: 420 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'monuments',
    obstructedView: {
      type: 'partial',
      description: 'Standing room behind Monument Park'
    },
    accessibilityRating: 4,
    features: {
      monumentPark: true,
      yankeeHistory: true,
      standingRoom: true,
      museumArea: true
    }
  },
  
  // Mohegan Sun Sports Bar
  {
    id: 'mohegan-sun-bar',
    name: 'Mohegan Sun Sports Bar',
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Bar', seats: 150, elevation: 35, depth: 0, covered: false }
    ],
    vertices: [
      { x: -40, y: 35, z: 390 },
      { x: 40, y: 35, z: 390 },
      { x: 40, y: 35, z: 410 },
      { x: -40, y: 35, z: 410 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      fullBar: true,
      standingRoom: true,
      tvMonitors: true,
      socialArea: true
    }
  },
  
  // Mastercard Batter's Eye Deck
  {
    id: 'batters-eye-deck',
    name: "Mastercard Batter's Eye Deck",
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Deck', seats: 200, elevation: 40, depth: 0, covered: false }
    ],
    vertices: [
      { x: -25, y: 40, z: 400 },
      { x: 25, y: 40, z: 400 },
      { x: 25, y: 40, z: 420 },
      { x: -25, y: 40, z: 420 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      partyDeck: true,
      groupSeating: true,
      standingRoom: true,
      centerFieldView: true
    }
  },
  
  // Delta Sky360 Suite
  {
    id: 'delta-sky360',
    name: 'Delta Sky360 Suite',
    level: 'Suite',
    orientation: 'home-plate',
    rows: [
      { rowNumber: 'Suite', seats: 24, elevation: 90, depth: 0, covered: true }
    ],
    vertices: [
      { x: -60, y: 90, z: 85 },
      { x: 60, y: 90, z: 85 },
      { x: 60, y: 100, z: 95 },
      { x: -60, y: 100, z: 95 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      privateSuite: true,
      climateControlled: true,
      cateringAvailable: true,
      privateRestrooms: true,
      dedicatedAttendant: true
    }
  },
  
  // Audi Yankees Club
  {
    id: 'audi-club',
    name: 'Audi Yankees Club',
    level: 'Club',
    orientation: 'first-base',
    rows: generateRows('A', 'M', 30, 75, 3, 12),
    vertices: [
      { x: 40, y: 75, z: 70 },
      { x: 130, y: 75, z: 95 },
      { x: 135, y: 114, z: 134 },
      { x: 45, y: 114, z: 109 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      climateControlled: true,
      premiumDining: true,
      wideSeats: true,
      privateBar: true,
      exclusiveLounge: true
    }
  },
  
  // Pepsi Lounge
  {
    id: 'pepsi-lounge',
    name: 'Pepsi Lounge',
    level: 'Club',
    orientation: 'third-base',
    rows: generateRows('A', 'M', 30, 75, 3, 12),
    vertices: [
      { x: -40, y: 75, z: 70 },
      { x: -130, y: 75, z: 95 },
      { x: -135, y: 114, z: 134 },
      { x: -45, y: 114, z: 109 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      climateControlled: true,
      loungeSeating: true,
      premiumBar: true,
      privateEntrance: true
    }
  },
  
  // Ford Field MVP Club
  {
    id: 'ford-mvp-club',
    name: 'Ford Field MVP Club',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'H', 20, 5, 2.5, 9),
    vertices: [
      { x: 60, y: 5, z: 20 },
      { x: 90, y: 5, z: 25 },
      { x: 95, y: 25, z: 45 },
      { x: 65, y: 25, z: 40 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      fieldLevel: true,
      mvpAccess: true,
      premiumSeating: true,
      inSeatService: true,
      exclusiveClub: true
    }
  },
  
  // Judge's Chambers
  {
    id: 'judges-chambers',
    name: "Judge's Chambers",
    level: 'Field',
    orientation: 'right-field',
    rows: [
      { rowNumber: 'Jury1', seats: 6, elevation: 12, depth: 0, covered: false },
      { rowNumber: 'Jury2', seats: 6, elevation: 14, depth: 2.5, covered: false },
      { rowNumber: 'Jury3', seats: 6, elevation: 16, depth: 5, covered: false }
    ],
    vertices: [
      { x: 118, y: 12, z: 88 },
      { x: 126, y: 12, z: 90 },
      { x: 126, y: 16, z: 95 },
      { x: 118, y: 16, z: 93 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      judgesChambers: true,
      section104: true,
      backThreeRows: true,
      fauxWoodPaneling: true,
      juryBoxTheme: true,
      eighteenSeats: true,
      gavelsProvided: true,
      allRise: true,
      selectedFansOnly: true
    }
  },
  
  // Bleacher Creatures
  {
    id: 'bleacher-creatures',
    name: 'Bleacher Creatures',
    level: 'Terrace',
    orientation: 'right-field',
    rows: generateRows('A', 'X', 28, 35, 3.2, 34),
    vertices: [
      { x: 130, y: 35, z: 280 },
      { x: 160, y: 35, z: 310 },
      { x: 165, y: 111.8, z: 386.8 },
      { x: 135, y: 111.8, z: 356.8 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      bleacherCreatures: true,
      section203: true,
      rightFieldBleachers: true,
      rollCallTradition: true,
      cowbellMan: true,
      seasonTickets136: true,
      queenOfBleachers: true,
      standingOvations: true,
      loudestFans: true
    }
  }
];

// Stadium features
export const yankeeStadiumFeatures = {
  retractableRoof: false,
  roofHeight: 150,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const yankeeStadiumSectionMap = new Map(
  yankeeStadiumSections.map(section => [section.id, section])
);
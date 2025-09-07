import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Guaranteed Rate Field - Chicago White Sox
// Opened: 1991
// Capacity: 40,615
// Orientation: 90° (Home plate to center field - Due East)
// Famous features: Exploding scoreboard, Fundamentals Deck, Goose Island, Scout Seats

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

export const guaranteedRateFieldSections: DetailedSection[] = [
  // Scout Seats - Behind Home Plate
  {
    id: 'scout-seats',
    name: 'Scout Seats',
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
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      scoutingPosition: true,
      behindHomePlate: true,
      perfectAngle: true,
      premiumSeating: true,
      inSeatService: true
    }
  },
  
  // Field Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices: [
      { x: 28, y: 2, z: 10 },
      { x: 115, y: 2, z: 28 },
      { x: 120, y: 55, z: 81 },
      { x: 33, y: 55, z: 63 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Field Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'Field',
    orientation: 'third-base',
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices: [
      { x: -28, y: 2, z: 10 },
      { x: -115, y: 2, z: 28 },
      { x: -120, y: 55, z: 81 },
      { x: -33, y: 55, z: 63 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Fundamentals Deck (Right Field)
  {
    id: 'fundamentals-deck',
    name: 'Fundamentals Deck',
    level: 'Outfield',
    orientation: 'right-field',
    rows: generateRows('A', 'K', 20, 25, 2.5, 18),
    vertices: [
      { x: 120, y: 25, z: 300 },
      { x: 150, y: 25, z: 330 },
      { x: 155, y: 52.5, z: 357.5 },
      { x: 125, y: 52.5, z: 327.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      fundamentalsThemed: true,
      familyArea: true,
      baseballEducation: true,
      kidsFriendly: true,
      interactiveExhibits: true
    }
  },
  
  // Goose Island (Right-Center Field)
  {
    id: 'goose-island',
    name: 'Goose Island',
    level: 'Outfield',
    orientation: 'right-center',
    rows: [
      { rowNumber: 'Bar', seats: 150, elevation: 30, depth: 0, covered: false }
    ],
    vertices: [
      { x: 80, y: 30, z: 360 },
      { x: 110, y: 30, z: 375 },
      { x: 110, y: 30, z: 395 },
      { x: 80, y: 30, z: 380 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      craftBeer: true,
      gooseIslandBrewery: true,
      standingRoom: true,
      drinkRails: true,
      socialArea: true
    }
  },
  
  // Kraft Kave (Left Field)
  {
    id: 'kraft-kave',
    name: 'Kraft Kave',
    level: 'Outfield',
    orientation: 'left-field',
    rows: [
      { rowNumber: 'Kave', seats: 100, elevation: 28, depth: 0, covered: false }
    ],
    vertices: [
      { x: -130, y: 28, z: 320 },
      { x: -100, y: 28, z: 340 },
      { x: -100, y: 28, z: 365 },
      { x: -130, y: 28, z: 345 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      caveTheme: true,
      kraftBranding: true,
      uniqueAtmosphere: true,
      groupSeating: true
    }
  },
  
  // FanDeck (Center Field)
  {
    id: 'fandeck',
    name: 'FanDeck',
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Deck', seats: 200, elevation: 35, depth: 0, covered: false }
    ],
    vertices: [
      { x: -30, y: 35, z: 395 },
      { x: 30, y: 35, z: 395 },
      { x: 30, y: 35, z: 420 },
      { x: -30, y: 35, z: 420 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      partyDeck: true,
      standingRoom: true,
      socialArea: true,
      groupEvents: true
    }
  },
  
  // Club Level - Behind Home
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    level: 'Club',
    orientation: 'home-plate',
    rows: generateRows('A', 'M', 26, 72, 3, 12),
    vertices: [
      { x: -38, y: 72, z: 67 },
      { x: 38, y: 72, z: 67 },
      { x: 43, y: 111, z: 106 },
      { x: -43, y: 111, z: 106 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    partialCoverage: {
      coveredRows: ['J', 'K', 'L', 'M'],
      coveragePercent: 30
    },
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      widePaddedSeats: true,
      inSeatService: true,
      privateBar: true,
      exclusiveDining: true
    }
  },
  
  // Magellan Club
  {
    id: 'magellan-club',
    name: 'Magellan Club',
    level: 'Club',
    orientation: 'first-base',
    rows: generateRows('A', 'L', 28, 72, 3, 12),
    vertices: [
      { x: 43, y: 72, z: 72 },
      { x: 120, y: 72, z: 95 },
      { x: 125, y: 108, z: 131 },
      { x: 48, y: 108, z: 108 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    partialCoverage: {
      coveredRows: ['J', 'K', 'L'],
      coveragePercent: 25
    },
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      magellanBranding: true,
      premiumLounge: true,
      exclusiveAccess: true,
      climateControlled: true
    }
  },
  
  // Lower Box - Behind Home
  {
    id: 'lower-box-home',
    name: 'Lower Box - Home Plate',
    level: 'Lower',
    orientation: 'home-plate',
    rows: generateRows('A', 'U', 24, 52, 3, 13),
    vertices: [
      { x: -38, y: 52, z: 47 },
      { x: 38, y: 52, z: 47 },
      { x: 43, y: 115, z: 110 },
      { x: -43, y: 115, z: 110 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Upper Deck - Behind Home
  {
    id: 'upper-deck-home',
    name: 'Upper Deck - Home Plate',
    level: 'Upper',
    orientation: 'home-plate',
    rows: generateRows('A', 'X', 26, 125, 3.5, 16),
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
    accessibilityRating: 2
  },
  
  // Upper Deck - First Base
  {
    id: 'upper-deck-1b',
    name: 'Upper Deck - First Base',
    level: 'Upper',
    orientation: 'first-base',
    rows: generateRows('A', 'Y', 28, 125, 3.5, 17),
    vertices: [
      { x: 50, y: 125, z: 130 },
      { x: 130, y: 125, z: 160 },
      { x: 135, y: 223, z: 258 },
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
  
  // Upper Deck - Third Base
  {
    id: 'upper-deck-3b',
    name: 'Upper Deck - Third Base',
    level: 'Upper',
    orientation: 'third-base',
    rows: generateRows('A', 'Y', 28, 125, 3.5, 17),
    vertices: [
      { x: -50, y: 125, z: 130 },
      { x: -130, y: 125, z: 160 },
      { x: -135, y: 223, z: 258 },
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
  
  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Left Field Bleachers',
    level: 'Bleachers',
    orientation: 'left-field',
    rows: generateRows('A', 'U', 24, 18, 2.5, 20),
    vertices: [
      { x: -145, y: 18, z: 285 },
      { x: -115, y: 18, z: 325 },
      { x: -120, y: 70.5, z: 377.5 },
      { x: -150, y: 70.5, z: 337.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Right Field Bleachers',
    level: 'Bleachers',
    orientation: 'right-field',
    rows: generateRows('A', 'U', 24, 18, 2.5, 20),
    vertices: [
      { x: 115, y: 18, z: 285 },
      { x: 145, y: 18, z: 325 },
      { x: 150, y: 70.5, z: 377.5 },
      { x: 120, y: 70.5, z: 337.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'Suite',
    orientation: 'home-plate',
    rows: [
      { rowNumber: 'Suite', seats: 20, elevation: 90, depth: 0, covered: true }
    ],
    vertices: [
      { x: -55, y: 90, z: 85 },
      { x: 55, y: 90, z: 85 },
      { x: 55, y: 100, z: 95 },
      { x: -55, y: 100, z: 95 }
    ] as Vector3D[],
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
  
  // Revolution Brewing Tap Room
  {
    id: 'revolution-tap-room',
    name: 'Revolution Brewing Tap Room',
    level: 'Outfield',
    orientation: 'left-center',
    rows: [
      { rowNumber: 'Bar', seats: 120, elevation: 32, depth: 0, covered: false }
    ],
    vertices: [
      { x: -90, y: 32, z: 350 },
      { x: -60, y: 32, z: 365 },
      { x: -60, y: 32, z: 385 },
      { x: -90, y: 32, z: 370 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      revolutionBrewing: true,
      chicagoCraftBeer: true,
      tapRoom: true,
      standingRoom: true
    }
  },
  
  // Exploding Scoreboard Area
  {
    id: 'exploding-scoreboard',
    name: 'Exploding Scoreboard Area',
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'SRO', seats: 100, elevation: 40, depth: 0, covered: false }
    ],
    vertices: [
      { x: -25, y: 40, z: 400 },
      { x: 25, y: 40, z: 400 },
      { x: 25, y: 40, z: 420 },
      { x: -25, y: 40, z: 420 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'scoreboard',
    obstructedView: {
      type: 'partial',
      description: 'Behind exploding scoreboard'
    },
    accessibilityRating: 3,
    features: {
      explodingScoreboard: true,
      fireworks: true,
      pinwheels: true,
      iconicFeature: true
    }
  },
  
  // Xfinity Zone
  {
    id: 'xfinity-zone',
    name: 'Xfinity Zone',
    level: 'Outfield',
    orientation: 'right-field',
    rows: [
      { rowNumber: 'Zone', seats: 80, elevation: 35, depth: 0, covered: false }
    ],
    vertices: [
      { x: 100, y: 35, z: 340 },
      { x: 125, y: 35, z: 355 },
      { x: 125, y: 35, z: 375 },
      { x: 100, y: 35, z: 360 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      xfinityWifi: true,
      chargingStations: true,
      techZone: true,
      modernAmenities: true
    }
  },
  
  // The Patio (Left Field)
  {
    id: 'the-patio',
    name: 'The Patio',
    level: 'Outfield',
    orientation: 'left-field',
    rows: generateRows('A', 'H', 16, 22, 2.5, 17),
    vertices: [
      { x: -135, y: 22, z: 310 },
      { x: -110, y: 22, z: 330 },
      { x: -115, y: 42, z: 350 },
      { x: -140, y: 42, z: 330 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      patioSeating: true,
      picnicTables: true,
      casualAtmosphere: true,
      groupFriendly: true
    }
  },
  
  // Champions Club
  {
    id: 'champions-club',
    name: 'Champions Club',
    level: 'Club',
    orientation: 'third-base',
    rows: generateRows('A', 'L', 28, 72, 3, 12),
    vertices: [
      { x: -43, y: 72, z: 72 },
      { x: -120, y: 72, z: 95 },
      { x: -125, y: 108, z: 131 },
      { x: -48, y: 108, z: 108 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    partialCoverage: {
      coveredRows: ['J', 'K', 'L'],
      coveragePercent: 25
    },
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      championship2005: true,
      memorabillia: true,
      premiumDining: true,
      exclusiveLounge: true
    }
  },
  
  // Stadium Club Restaurant
  {
    id: 'stadium-club-restaurant',
    name: 'Stadium Club Restaurant',
    level: 'Restaurant',
    orientation: 'home-plate',
    rows: [
      { rowNumber: 'Tables', seats: 100, elevation: 85, depth: 0, covered: true }
    ],
    vertices: [
      { x: -40, y: 85, z: 80 },
      { x: 40, y: 85, z: 80 },
      { x: 40, y: 95, z: 90 },
      { x: -40, y: 95, z: 90 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'restaurant',
    accessibilityRating: 4,
    features: {
      fullService: true,
      fineDining: true,
      reservationsRequired: true,
      climateControlled: true
    }
  },
  
  // Miller Lite Landing (formerly Goose Island)
  {
    id: 'miller-lite-landing',
    name: 'Miller Lite Landing',
    level: 'Field',
    orientation: 'right-field',
    rows: [
      { rowNumber: '1-4', seats: 80, elevation: 8, depth: 0, covered: false },
      { rowNumber: '5-10', seats: 120, elevation: 12, depth: 12, covered: false },
      { rowNumber: 'SRO', seats: 126, elevation: 16, depth: 24, covered: false }
    ],
    vertices: [
      { x: 90, y: 8, z: 300 },
      { x: 120, y: 8, z: 320 },
      { x: 125, y: 22, z: 332 },
      { x: 95, y: 22, z: 312 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      millerLiteLanding: true,
      formerlyGooseIsland: true,
      sections106and107: true,
      waterFeatures: true,
      islandSurrounded: true,
      seats326Total: true,
      oversizedChairs: true,
      tvMonitors: true,
      drinkLedges: true,
      waitService: true,
      standingRoom: true
    }
  }
];

// Stadium features
export const guaranteedRateFieldFeatures = {
  retractableRoof: false,
  roofHeight: 130,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const guaranteedRateFieldSectionMap = new Map(
  guaranteedRateFieldSections.map(section => [section.id, section])
);
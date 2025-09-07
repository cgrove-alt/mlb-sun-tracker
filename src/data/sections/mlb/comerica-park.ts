import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Comerica Park - Detroit Tigers
// Opened: 2000
// Capacity: 41,083
// Orientation: 145° (Home plate to center field - Southeast, unique angle)
// Famous features: Ferris wheel, Carousel, Tiger statues, Fountain

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

export const comericaParkSections: DetailedSection[] = [
  // Tiger Den - Behind Home Plate
  {
    id: 'tiger-den',
    name: 'Tiger Den',
    level: 'Field',
    orientation: 'home-plate',
    rows: generateRows('A', 'P', 24, 2, 2.5, 10),
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
      tigerThemed: true
    }
  },
  
  // On Deck Circle - First Base
  {
    id: 'on-deck-circle-1b',
    name: 'On Deck Circle - First Base',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'U', 22, 2, 2.5, 11),
    vertices: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 52.5, z: 79.5 },
      { x: 35, y: 52.5, z: 60.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // On Deck Circle - Third Base
  {
    id: 'on-deck-circle-3b',
    name: 'On Deck Circle - Third Base',
    level: 'Field',
    orientation: 'third-base',
    rows: generateRows('A', 'U', 22, 2, 2.5, 11),
    vertices: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 52.5, z: 79.5 },
      { x: -35, y: 52.5, z: 60.5 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Ferris Wheel Area (Center Field)
  {
    id: 'ferris-wheel-area',
    name: 'Ferris Wheel Area',
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Plaza', seats: 100, elevation: 15, depth: 0, covered: false }
    ],
    vertices: [
      { x: -30, y: 15, z: 415 },
      { x: 30, y: 15, z: 415 },
      { x: 30, y: 15, z: 440 },
      { x: -30, y: 15, z: 440 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'ferris-wheel',
    obstructedView: {
      type: 'partial',
      description: 'Ferris wheel structure visible'
    },
    accessibilityRating: 5,
    features: {
      ferrisWheel: true,
      baseballFerrisWheel: true,
      uniqueAttraction: true,
      familyFriendly: true
    }
  },
  
  // Carousel Area (Center-Right Field)
  {
    id: 'carousel-area',
    name: 'Carousel Area',
    level: 'Outfield',
    orientation: 'right-center',
    rows: [
      { rowNumber: 'Carousel', seats: 50, elevation: 15, depth: 0, covered: false }
    ],
    vertices: [
      { x: 60, y: 15, z: 390 },
      { x: 90, y: 15, z: 405 },
      { x: 90, y: 15, z: 425 },
      { x: 60, y: 15, z: 410 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'carousel',
    accessibilityRating: 5,
    features: {
      carousel: true,
      tigerCarousel: true,
      kidsArea: true,
      familyEntertainment: true
    }
  },
  
  // Pepsi Porch (Right Field)
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    level: 'Outfield',
    orientation: 'right-field',
    rows: generateRows('A', 'L', 20, 28, 2.5, 18),
    vertices: [
      { x: 120, y: 28, z: 300 },
      { x: 150, y: 28, z: 330 },
      { x: 155, y: 58, z: 360 },
      { x: 125, y: 58, z: 330 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      partyPorch: true,
      groupSeating: true,
      casualAtmosphere: true
    }
  },
  
  // Kaline's Corner (Right Field)
  {
    id: 'kalines-corner',
    name: "Kaline's Corner",
    level: 'Outfield',
    orientation: 'right-field',
    rows: generateRows('A', 'J', 18, 22, 2.5, 19),
    vertices: [
      { x: 135, y: 22, z: 320 },
      { x: 160, y: 22, z: 345 },
      { x: 165, y: 47, z: 370 },
      { x: 140, y: 47, z: 345 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      alKalineTribute: true,
      number6: true,
      rightFieldCorner: true
    }
  },
  
  // Club Level - Behind Home
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    level: 'Club',
    orientation: 'home-plate',
    rows: generateRows('A', 'N', 26, 75, 3, 12),
    vertices: [
      { x: -40, y: 75, z: 70 },
      { x: 40, y: 75, z: 70 },
      { x: 45, y: 117, z: 112 },
      { x: -45, y: 117, z: 112 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    partialCoverage: {
      coveredRows: ['K', 'L', 'M', 'N'],
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
  
  // Tiger Club
  {
    id: 'tiger-club',
    name: 'Tiger Club',
    level: 'Club',
    orientation: 'first-base',
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices: [
      { x: 45, y: 75, z: 75 },
      { x: 125, y: 75, z: 100 },
      { x: 130, y: 114, z: 139 },
      { x: 50, y: 114, z: 114 }
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
      climateControlled: true,
      tigerMemorabillia: true,
      premiumBar: true,
      exclusiveLounge: true
    }
  },
  
  // Mezzanine - Behind Home
  {
    id: 'mezzanine-home',
    name: 'Mezzanine - Home Plate',
    level: 'Mezzanine',
    orientation: 'home-plate',
    rows: generateRows('A', 'T', 23, 55, 3, 13),
    vertices: [
      { x: -38, y: 55, z: 50 },
      { x: 38, y: 55, z: 50 },
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
    rows: generateRows('A', 'X', 26, 130, 3.5, 16),
    vertices: [
      { x: -45, y: 130, z: 125 },
      { x: 45, y: 130, z: 125 },
      { x: 50, y: 224, z: 219 },
      { x: -50, y: 224, z: 219 }
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
    rows: generateRows('A', 'Y', 28, 130, 3.5, 17),
    vertices: [
      { x: 50, y: 130, z: 135 },
      { x: 135, y: 130, z: 165 },
      { x: 140, y: 228, z: 263 },
      { x: 55, y: 228, z: 233 }
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
    rows: generateRows('A', 'Y', 28, 130, 3.5, 17),
    vertices: [
      { x: -50, y: 130, z: 135 },
      { x: -135, y: 130, z: 165 },
      { x: -140, y: 228, z: 263 },
      { x: -55, y: 228, z: 233 }
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
    rows: generateRows('A', 'T', 24, 20, 2.5, 20),
    vertices: [
      { x: -150, y: 20, z: 290 },
      { x: -120, y: 20, z: 330 },
      { x: -125, y: 70, z: 380 },
      { x: -155, y: 70, z: 340 }
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
      { rowNumber: 'Suite', seats: 20, elevation: 95, depth: 0, covered: true }
    ],
    vertices: [
      { x: -60, y: 95, z: 90 },
      { x: 60, y: 95, z: 90 },
      { x: 60, y: 105, z: 100 },
      { x: -60, y: 105, z: 100 }
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
  
  // Labatt Blue Light Jungle
  {
    id: 'labatt-jungle',
    name: 'Labatt Blue Light Jungle',
    level: 'Outfield',
    orientation: 'left-center',
    rows: [
      { rowNumber: 'Bar', seats: 120, elevation: 32, depth: 0, covered: false }
    ],
    vertices: [
      { x: -90, y: 32, z: 360 },
      { x: -60, y: 32, z: 375 },
      { x: -60, y: 32, z: 395 },
      { x: -90, y: 32, z: 380 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      jungleTheme: true,
      standingRoom: true,
      drinkRails: true,
      partyAtmosphere: true
    }
  },
  
  // Comerica Bank Fountain
  {
    id: 'fountain-area',
    name: 'Comerica Bank Fountain',
    level: 'Outfield',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Fountain', seats: 75, elevation: 18, depth: 0, covered: false }
    ],
    vertices: [
      { x: -15, y: 18, z: 400 },
      { x: 15, y: 18, z: 400 },
      { x: 15, y: 18, z: 420 },
      { x: -15, y: 18, z: 420 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'fountain',
    obstructedView: {
      type: 'partial',
      description: 'Fountain spray may affect visibility'
    },
    accessibilityRating: 4,
    features: {
      waterFeature: true,
      liquidFireworks: true,
      choreographedShows: true
    }
  },
  
  // Big Cat Court (Food Court)
  {
    id: 'big-cat-court',
    name: 'Big Cat Court',
    level: 'Concourse',
    orientation: 'right-center',
    rows: [
      { rowNumber: 'Food', seats: 200, elevation: 35, depth: 0, covered: false }
    ],
    vertices: [
      { x: 70, y: 35, z: 370 },
      { x: 110, y: 35, z: 390 },
      { x: 110, y: 35, z: 410 },
      { x: 70, y: 35, z: 390 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      foodCourt: true,
      localVendors: true,
      detroitCuisine: true,
      familyDining: true
    }
  },
  
  // Witherite's Detroit Garage
  {
    id: 'detroit-garage',
    name: "Witherite's Detroit Garage",
    level: 'Outfield',
    orientation: 'left-field',
    rows: [
      { rowNumber: 'Garage', seats: 100, elevation: 38, depth: 0, covered: false }
    ],
    vertices: [
      { x: -130, y: 38, z: 320 },
      { x: -100, y: 38, z: 340 },
      { x: -100, y: 38, z: 360 },
      { x: -130, y: 38, z: 340 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      garageTheme: true,
      automotiveDecor: true,
      detroitCars: true,
      industrialDesign: true
    }
  },
  
  // Brushfire Grill
  {
    id: 'brushfire-grill',
    name: 'Brushfire Grill',
    level: 'Outfield',
    orientation: 'right-field',
    rows: [
      { rowNumber: 'Grill', seats: 80, elevation: 40, depth: 0, covered: false }
    ],
    vertices: [
      { x: 100, y: 40, z: 340 },
      { x: 130, y: 40, z: 360 },
      { x: 130, y: 40, z: 380 },
      { x: 100, y: 40, z: 360 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      bbqGrill: true,
      outdoorSeating: true,
      smokedMeats: true,
      picnicTables: true
    }
  },
  
  // Tiger Statues Plaza
  {
    id: 'tiger-statues-plaza',
    name: 'Tiger Statues Plaza',
    level: 'Plaza',
    orientation: 'main-entrance',
    rows: [
      { rowNumber: 'Plaza', seats: 0, elevation: 0, depth: 0, covered: false }
    ],
    vertices: [
      { x: -50, y: 0, z: -20 },
      { x: 50, y: 0, z: -20 },
      { x: 50, y: 0, z: 0 },
      { x: -50, y: 0, z: 0 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      tigerStatues: true,
      photoOpportunity: true,
      mainEntrance: true,
      iconicLandmark: true
    }
  },
  
  // Chevrolet Fountain Bar
  {
    id: 'chevrolet-fountain-bar',
    name: 'Chevrolet Fountain Bar',
    level: 'Club',
    orientation: 'third-base',
    rows: generateRows('A', 'H', 22, 78, 3, 11),
    vertices: [
      { x: -50, y: 78, z: 75 },
      { x: -125, y: 78, z: 100 },
      { x: -130, y: 102, z: 124 },
      { x: -55, y: 102, z: 99 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      fountainViews: true,
      premiumBar: true,
      chevroletBranding: true,
      exclusiveAccess: true
    }
  },
  
  // Pepsi Porch
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    level: 'Terrace',
    orientation: 'right-field',
    rows: [
      { rowNumber: 'SRO', seats: 200, elevation: 75, depth: 0, covered: false }
    ],
    vertices: [
      { x: 120, y: 75, z: 340 },
      { x: 150, y: 75, z: 360 },
      { x: 150, y: 85, z: 370 },
      { x: 120, y: 85, z: 350 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      pepsiPorch: true,
      rightFieldUpper: true,
      standingRoom: true,
      highTopTables: true,
      drinkRails: true,
      detroitSkylineViews: true,
      socialSpace: true,
      groupFriendly: true
    }
  }
];

// Stadium features
export const comericaParkFeatures = {
  retractableRoof: false,
  roofHeight: 135,
  roofMaterial: {
    opacity: 0.95,
    reflectivity: 0.3
  }
};

// Export section map for easy lookup
export const comericaParkSectionMap = new Map(
  comericaParkSections.map(section => [section.id, section])
);
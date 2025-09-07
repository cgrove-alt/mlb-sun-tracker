import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Rogers Centre - Toronto Blue Jays
// Opened: 1989
// Capacity: 49,282
// Orientation: 15° (Home plate to center field)
// Features: Retractable roof, Hotel windows in outfield, CN Tower views

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

export const rogersCentreSections: DetailedSection[] = [
  // Premium Dugout - Behind Home Plate
  {
    id: 'premium-dugout',
    name: 'Premium Dugout',
    level: 'Field',
    orientation: 'home-plate',
    rows: generateRows('A', 'R', 25, 2, 2.5, 10),
    vertices: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 45, z: 55 },
      { x: -35, y: 45, z: 55 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      cushionedSeats: true,
      inSeatService: true,
      privateRestrooms: true,
      exclusiveAccess: true
    }
  },
  
  // Field Level Infield - First Base
  {
    id: 'field-level-1b',
    name: 'Field Level - First Base',
    level: 'Field',
    orientation: 'first-base',
    rows: generateRows('A', 'W', 23, 2, 2.5, 11),
    vertices: [
      { x: 30, y: 2, z: 10 },
      { x: 120, y: 2, z: 30 },
      { x: 125, y: 57.5, z: 85.5 },
      { x: 35, y: 57.5, z: 65.5 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // Field Level Infield - Third Base
  {
    id: 'field-level-3b',
    name: 'Field Level - Third Base',
    level: 'Field',
    orientation: 'third-base',
    rows: generateRows('A', 'W', 23, 2, 2.5, 11),
    vertices: [
      { x: -30, y: 2, z: 10 },
      { x: -120, y: 2, z: 30 },
      { x: -125, y: 57.5, z: 85.5 },
      { x: -35, y: 57.5, z: 65.5 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // TD Comfort Club
  {
    id: 'td-comfort-club',
    name: 'TD Comfort Club',
    level: 'club',
    orientation: 'first-base',
    rows: generateRows('A', 'M', 28, 75, 3, 12),
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
      widePaddedSeats: true,
      inSeatService: true,
      privateBar: true,
      exclusiveDining: true
    }
  },
  
  // 100 Level - Behind Home
  {
    id: '100-level-home',
    name: '100 Level - Home Plate',
    level: '100',
    orientation: 'home-plate',
    rows: generateRows('A', 'U', 24, 60, 3, 13),
    vertices: [
      { x: -40, y: 60, z: 60 },
      { x: 40, y: 60, z: 60 },
      { x: 45, y: 123, z: 123 },
      { x: -45, y: 123, z: 123 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4
  },
  
  // 200 Level - First Base
  {
    id: '200-level-1b',
    name: '200 Level - First Base',
    level: '200',
    orientation: 'first-base',
    rows: generateRows('A', 'X', 26, 85, 3, 14),
    vertices: [
      { x: 45, y: 85, z: 80 },
      { x: 135, y: 85, z: 105 },
      { x: 140, y: 166, z: 186 },
      { x: 50, y: 166, z: 161 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // 200 Level - Third Base
  {
    id: '200-level-3b',
    name: '200 Level - Third Base',
    level: '200',
    orientation: 'third-base',
    rows: generateRows('A', 'X', 26, 85, 3, 14),
    vertices: [
      { x: -45, y: 85, z: 80 },
      { x: -135, y: 85, z: 105 },
      { x: -140, y: 166, z: 186 },
      { x: -50, y: 166, z: 161 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Renaissance Hotel Windows
  {
    id: 'renaissance-hotel',
    name: 'Renaissance Hotel Windows',
    level: 'Hotel',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Window', seats: 70, elevation: 100, depth: 0, covered: true }
    ],
    vertices: [
      { x: -30, y: 100, z: 400 },
      { x: 30, y: 100, z: 400 },
      { x: 30, y: 120, z: 420 },
      { x: -30, y: 120, z: 420 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'glass',
    accessibilityRating: 5,
    features: {
      hotelRooms: true,
      floorToCeilingWindows: true,
      uniqueView: true,
      climateControlled: true
    }
  },
  
  // 500 Level - Upper Deck Home
  {
    id: '500-level-home',
    name: '500 Level - Home Plate',
    level: '500',
    orientation: 'home-plate',
    rows: generateRows('A', 'AA', 28, 170, 3.5, 18),
    vertices: [
      { x: -55, y: 170, z: 165 },
      { x: 55, y: 170, z: 165 },
      { x: 60, y: 275, z: 270 },
      { x: -60, y: 275, z: 270 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // 500 Level - First Base
  {
    id: '500-level-1b',
    name: '500 Level - First Base',
    level: '500',
    orientation: 'first-base',
    rows: generateRows('A', 'BB', 30, 170, 3.5, 19),
    vertices: [
      { x: 60, y: 170, z: 175 },
      { x: 150, y: 170, z: 210 },
      { x: 155, y: 282, z: 322 },
      { x: 65, y: 282, z: 287 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // 500 Level - Third Base
  {
    id: '500-level-3b',
    name: '500 Level - Third Base',
    level: '500',
    orientation: 'third-base',
    rows: generateRows('A', 'BB', 30, 170, 3.5, 19),
    vertices: [
      { x: -60, y: 170, z: 175 },
      { x: -150, y: 170, z: 210 },
      { x: -155, y: 282, z: 322 },
      { x: -65, y: 282, z: 287 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'upper-deck',
    accessibilityRating: 2
  },
  
  // WestJet Flight Deck
  {
    id: 'westjet-flight-deck',
    name: 'WestJet Flight Deck',
    level: 'field',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Deck', seats: 250, elevation: 35, depth: 0, covered: true }
    ],
    vertices: [
      { x: -40, y: 35, z: 380 },
      { x: 40, y: 35, z: 380 },
      { x: 40, y: 35, z: 410 },
      { x: -40, y: 35, z: 410 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      standingRoom: true,
      drinkRails: true,
      socialArea: true,
      partyDeck: true
    }
  },
  
  // Outfield District - Left Field
  {
    id: 'outfield-district-lf',
    name: 'Outfield District - Left',
    level: 'field',
    orientation: 'left-field',
    rows: generateRows('A', 'P', 22, 25, 2.5, 17),
    vertices: [
      { x: -145, y: 25, z: 280 },
      { x: -115, y: 25, z: 320 },
      { x: -120, y: 65, z: 360 },
      { x: -150, y: 65, z: 320 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Outfield District - Right Field
  {
    id: 'outfield-district-rf',
    name: 'Outfield District - Right',
    level: 'field',
    orientation: 'right-field',
    rows: generateRows('A', 'P', 22, 25, 2.5, 17),
    vertices: [
      { x: 145, y: 25, z: 280 },
      { x: 115, y: 25, z: 320 },
      { x: 120, y: 65, z: 360 },
      { x: 150, y: 65, z: 320 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3
  },
  
  // Corona Rooftop Patio
  {
    id: 'corona-rooftop-patio',
    name: 'Corona Rooftop Patio',
    level: 'Rooftop',
    orientation: 'right-center',
    rows: [
      { rowNumber: 'Patio', seats: 150, elevation: 95, depth: 0, covered: true }
    ],
    vertices: [
      { x: 80, y: 95, z: 350 },
      { x: 120, y: 95, z: 370 },
      { x: 120, y: 95, z: 390 },
      { x: 80, y: 95, z: 370 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 3,
    features: {
      rooftopPatio: true,
      standingRoom: true,
      drinkRails: true,
      cityViews: true
    }
  },
  
  // Sportsnet Grill
  {
    id: 'sportsnet-grill',
    name: 'Sportsnet Grill',
    level: 'Restaurant',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Tables', seats: 100, elevation: 40, depth: 0, covered: true }
    ],
    vertices: [
      { x: -25, y: 40, z: 390 },
      { x: 25, y: 40, z: 390 },
      { x: 25, y: 40, z: 415 },
      { x: -25, y: 40, z: 415 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'restaurant',
    accessibilityRating: 4,
    features: {
      fullRestaurant: true,
      tvMonitors: true,
      climateControlled: true,
      reservationsAvailable: true
    }
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'Suite',
    orientation: 'home-plate',
    rows: [
      { rowNumber: 'Suite', seats: 20, elevation: 110, depth: 0, covered: true }
    ],
    vertices: [
      { x: -65, y: 110, z: 105 },
      { x: 65, y: 110, z: 105 },
      { x: 65, y: 120, z: 115 },
      { x: -65, y: 120, z: 115 }
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
  
  // CN Tower Club
  {
    id: 'cn-tower-club',
    name: 'CN Tower Club',
    level: 'club',
    orientation: 'third-base',
    rows: generateRows('A', 'L', 30, 90, 3, 13),
    vertices: [
      { x: -50, y: 90, z: 90 },
      { x: -140, y: 90, z: 115 },
      { x: -145, y: 129, z: 154 },
      { x: -55, y: 129, z: 129 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'suite-level',
    accessibilityRating: 5,
    features: {
      cnTowerViews: true,
      premiumDining: true,
      exclusiveLounge: true,
      privateEntrance: true
    }
  },
  
  // Action Zone (Kids Area)
  {
    id: 'action-zone',
    name: 'Action Zone',
    level: 'field',
    orientation: 'left-center',
    rows: [
      { rowNumber: 'Family', seats: 60, elevation: 20, depth: 0, covered: true }
    ],
    vertices: [
      { x: -100, y: 20, z: 340 },
      { x: -70, y: 20, z: 355 },
      { x: -70, y: 20, z: 375 },
      { x: -100, y: 20, z: 360 }
    ] as Vector3D[],
    premium: false,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      kidsArea: true,
      playground: true,
      familyFriendly: true,
      interactiveGames: true
    }
  },
  
  // WestJet Flight Deck
  {
    id: 'westjet-flight-deck',
    name: 'WestJet Flight Deck',
    level: 'upper',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Standing', seats: 200, elevation: 85, depth: 0, covered: false }
    ],
    vertices: [
      { x: -30, y: 85, z: 400 },
      { x: 30, y: 85, z: 400 },
      { x: 35, y: 95, z: 410 },
      { x: -35, y: 95, z: 410 }
    ] as Vector3D[],
    premium: false,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      westjetFlightDeck: true,
      level500: true,
      standingRoom: true,
      drinkRails: true,
      socialSpace: true
    }
  },
  
  // Corona Rooftop Patio
  {
    id: 'corona-rooftop',
    name: 'Corona Rooftop Patio',
    level: 'upper',
    orientation: 'right-field',
    rows: [
      { rowNumber: 'Patio', seats: 150, elevation: 90, depth: 0, covered: false }
    ],
    vertices: [
      { x: 100, y: 90, z: 350 },
      { x: 130, y: 90, z: 370 },
      { x: 135, y: 100, z: 380 },
      { x: 105, y: 100, z: 360 }
    ] as Vector3D[],
    premium: true,
    covered: false,
    obstructionType: 'none',
    accessibilityRating: 4,
    features: {
      coronaRooftop: true,
      new2025: true,
      patioFurniture: true,
      premiumBar: true,
      cityViews: true
    }
  },
  
  // TD Park Social
  {
    id: 'td-park-social',
    name: 'TD Park Social',
    level: 'club',
    orientation: 'third-base',
    rows: generateRows('A', 'H', 32, 65, 3, 28),
    vertices: [
      { x: -90, y: 65, z: 140 },
      { x: -70, y: 65, z: 160 },
      { x: -75, y: 89, z: 184 },
      { x: -95, y: 89, z: 164 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'none',
    accessibilityRating: 5,
    features: {
      tdParkSocial: true,
      groupArea: true,
      premiumDining: true,
      socialGames: true,
      tvMonitors: true
    }
  },
  
  // Renaissance Hotel Windows
  {
    id: 'hotel-windows',
    name: 'Renaissance Hotel Windows',
    level: 'field',
    orientation: 'center-field',
    rows: [
      { rowNumber: 'Hotel', seats: 70, elevation: 120, depth: 0, covered: true }
    ],
    vertices: [
      { x: -40, y: 120, z: 420 },
      { x: 40, y: 120, z: 420 },
      { x: 40, y: 135, z: 435 },
      { x: -40, y: 135, z: 435 }
    ] as Vector3D[],
    premium: true,
    covered: true,
    obstructionType: 'glass',
    obstructedView: {
      type: 'minimal',
      description: 'Hotel room windows overlooking field'
    },
    accessibilityRating: 5,
    features: {
      hotelRooms: true,
      uniqueVenue: true,
      windowSeats: true,
      renaissanceHotel: true,
      privateAccess: true
    }
  }
];

// Stadium features
export const rogersCentreFeatures = {
  retractableRoof: true,
  roofHeight: 180,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.35
  },
  climateControlled: true
};

// Export section map for easy lookup
export const rogersCentreSectionMap = new Map(
  rogersCentreSections.map(section => [section.id, section])
);
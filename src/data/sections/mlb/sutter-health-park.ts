// Sutter Health Park - Complete Section Data with 3D Geometry
// West Sacramento, CA - Opened 2000 - Capacity 14,014
// Temporary home of the Oakland Athletics (2025-2027)
// Triple-A park upgraded for MLB with unique amenities

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details with enhanced parameters
const generateRows = (
  startRow: number,
  endRow: number,
  elevation: number,
  depth: number,
  rakeAngle: number = 32
): RowDetail[] => {
  return Array.from({ length: endRow - startRow + 1 }, (_, i) => ({
    row: `${startRow + i}`,
    elevation: elevation + (i * 0.5),
    depth: depth - (i * 0.3),
    rakeAngle
  }));
};

// Stadium configuration with all unique features
export const sutterHealthParkConfig = {
  name: 'Sutter Health Park',
  team: 'Oakland Athletics (2025-2027)',
  city: 'West Sacramento',
  state: 'CA',
  opened: 2000,
  capacity: 14014,
  roof: 'open',
  dimensions: {
    leftField: 330,
    leftCenter: 375,
    centerField: 405,
    rightCenter: 375,
    rightField: 325
  },
  features: {
    temporaryMLB: true,
    riverCats: true,
    grassBerm: true,
    solonClub: true,
    legacyClub: true
  }
};

// Sutter Health Park Sections - Complete Implementation (23 sections)
export const sutterHealthParkSections: DetailedSection[] = [
  // ========== ATHLETICS DUGOUT CLUB (Behind Home Plate) ==========
  {
    id: 'athletics-dugout-club',
    name: 'Athletics Dugout Club',
    level: 'field',
    rows: generateRows(1, 6, -1, 14, 16),
    sunExposure: {
      morning: 15,
      afternoon: 45,
      evening: 70
    },
    covered: true,
    vertices: [
      { x: -8, y: 48, z: -1 },
      { x: 8, y: 48, z: -1 },
      { x: 8, y: 58, z: 3 },
      { x: -8, y: 58, z: 3 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      athleticsDugoutClub: true,
      behindHomePlate: true,
      premiumSeating: true,
      temporaryMLBUpgrade: true,
      paddedSeats: true
    }
  },

  // ========== HOME PLATE BOX ==========
  {
    id: 'home-plate-box',
    name: 'Home Plate Box',
    level: 'field',
    rows: generateRows(1, 14, 2, 14, 10),
    sunExposure: {
      morning: 20,
      afternoon: 50,
      evening: 75
    },
    covered: false,
    vertices: [
      { x: -25, y: 52, z: 2 },
      { x: 25, y: 52, z: 2 },
      { x: 30, y: 85, z: 14 },
      { x: -30, y: 85, z: 14 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      homePlateBox: true,
      cushionedSeats: true,
      closestToField: true
    }
  },

  // ========== FIELD BOX - FIRST BASE ==========
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    rows: generateRows(1, 16, 2, 14, 11),
    sunExposure: {
      morning: 25,
      afternoon: 55,
      evening: 70
    },
    covered: false,
    vertices: [
      { x: 25, y: 52, z: 2 },
      { x: 95, y: 52, z: 2 },
      { x: 100, y: 90, z: 18 },
      { x: 30, y: 90, z: 18 }
    ],
    accessibility: 4,
    viewQuality: 5,
    features: {
      fieldBox: true,
      firstBaseLine: true,
      closeToAction: true
    }
  },

  // ========== FIELD BOX - THIRD BASE ==========
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    rows: generateRows(1, 16, 2, 14, 11),
    sunExposure: {
      morning: 30,
      afternoon: 60,
      evening: 80
    },
    covered: false,
    vertices: [
      { x: -25, y: 52, z: 2 },
      { x: -95, y: 52, z: 2 },
      { x: -100, y: 90, z: 18 },
      { x: -30, y: 90, z: 18 }
    ],
    accessibility: 4,
    viewQuality: 5,
    features: {
      fieldBox: true,
      thirdBaseLine: true,
      sunsetViews: true
    }
  },

  // ========== SKY RIVER CASINO SOLON CLUB ==========
  {
    id: 'solon-club',
    name: 'Sky River Casino Solon Club',
    level: 'club',
    rows: generateRows(1, 10, 18, 14, 18),
    sunExposure: {
      morning: 10,
      afternoon: 35,
      evening: 60
    },
    covered: true,
    vertices: [
      { x: 60, y: 100, z: 18 },
      { x: 85, y: 110, z: 18 },
      { x: 85, y: 135, z: 26 },
      { x: 60, y: 125, z: 26 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      solonClub: true,
      redesigned2025: true,
      premiumSeating: true,
      upgradedBars: true,
      actionStationFood: true,
      stylishTables: true,
      capacity150: true,
      rightFieldLine: true,
      exclusiveBar: true
    }
  },

  // ========== JACKSON RANCHERIA LEGACY CLUB ==========
  {
    id: 'legacy-club',
    name: 'Jackson Rancheria Legacy Club',
    level: 'club',
    rows: generateRows(1, 8, 20, 14, 17),
    sunExposure: {
      morning: 8,
      afternoon: 30,
      evening: 55
    },
    covered: true,
    vertices: [
      { x: -60, y: 100, z: 20 },
      { x: -35, y: 115, z: 20 },
      { x: -35, y: 140, z: 28 },
      { x: -60, y: 125, z: 28 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      legacyClub: true,
      redesigned2025: true,
      privateBalcony: true,
      bigScreen15Foot: true,
      climateControlled: true,
      comfortSeating: true,
      complimentaryDining: true,
      chefInspired: true,
      awardWinningBeerWine: true
    }
  },

  // ========== GILT-EDGE CLUB ==========
  {
    id: 'gilt-edge-club',
    name: 'Gilt-Edge Club',
    level: 'club',
    rows: generateRows(1, 12, 14, 14, 20),
    sunExposure: {
      morning: 35,
      afternoon: 65,
      evening: 85
    },
    covered: true,
    vertices: [
      { x: -30, y: 360, z: 14 },
      { x: 30, y: 360, z: 14 },
      { x: 30, y: 385, z: 22 },
      { x: -30, y: 385, z: 22 }
    ],
    accessibility: 5,
    viewQuality: 4,
    features: {
      giltEdgeClub: true,
      openAirHospitality: true,
      drinkRails: true,
      barstoolSeating: true,
      highPoweredFans: true,
      modernFurniture: true,
      greenWall: true,
      outfieldEdge: true,
      privateBar: true,
      houseSelectedBeerWine: true
    }
  },

  // ========== PARTY DECK ==========
  {
    id: 'party-deck',
    name: 'Party Deck',
    level: 'deck',
    rows: [],
    sunExposure: {
      morning: 40,
      afternoon: 70,
      evening: 90
    },
    covered: false,
    vertices: [
      { x: 70, y: 340, z: 16 },
      { x: 100, y: 330, z: 16 },
      { x: 100, y: 360, z: 16 },
      { x: 70, y: 370, z: 16 }
    ],
    accessibility: 4,
    viewQuality: 3,
    features: {
      partyDeck: true,
      rightField: true,
      groupArea: true,
      standingRoom: true,
      socialSpace: true,
      addedIn2005: true
    }
  },

  // ========== RESERVED SEATING - HOME ==========
  {
    id: 'reserved-home',
    name: 'Reserved - Home Plate',
    level: 'main',
    rows: generateRows(1, 18, 12, 16, 13),
    sunExposure: {
      morning: 22,
      afternoon: 52,
      evening: 72
    },
    covered: false,
    vertices: [
      { x: -35, y: 85, z: 12 },
      { x: 35, y: 85, z: 12 },
      { x: 40, y: 125, z: 28 },
      { x: -40, y: 125, z: 28 }
    ],
    accessibility: 4,
    viewQuality: 4,
    features: {
      reservedSeating: true,
      behindHomePlate: true,
      mainConcourse: true
    }
  },

  // ========== GRASS BERM (Left Field) ==========
  {
    id: 'grass-berm-left',
    name: 'Grass Berm - Left Field',
    level: 'berm',
    rows: [],
    sunExposure: {
      morning: 45,
      afternoon: 75,
      evening: 95
    },
    covered: false,
    vertices: [
      { x: -100, y: 330, z: 3 },
      { x: -70, y: 350, z: 3 },
      { x: -70, y: 380, z: 8 },
      { x: -100, y: 360, z: 8 }
    ],
    accessibility: 3,
    viewQuality: 3,
    features: {
      grassBerm: true,
      leftField: true,
      familyFriendly: true,
      blanketSeating: true,
      picnicArea: true
    }
  },

  // ========== GRASS BERM (Right Field) ==========
  {
    id: 'grass-berm-right',
    name: 'Grass Berm - Right Field',
    level: 'berm',
    rows: [],
    sunExposure: {
      morning: 50,
      afternoon: 80,
      evening: 90
    },
    covered: false,
    vertices: [
      { x: 70, y: 330, z: 3 },
      { x: 100, y: 350, z: 3 },
      { x: 100, y: 380, z: 8 },
      { x: 70, y: 360, z: 8 }
    ],
    accessibility: 3,
    viewQuality: 3,
    features: {
      grassBerm: true,
      rightField: true,
      lawnSeating: true,
      valueOption: true
    }
  },

  // ========== RIVER CATS LANDING ==========
  {
    id: 'river-cats-landing',
    name: 'River Cats Landing',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 35,
      afternoon: 65,
      evening: 85
    },
    covered: false,
    vertices: [
      { x: -60, y: 380, z: 10 },
      { x: 60, y: 380, z: 10 },
      { x: 60, y: 400, z: 10 },
      { x: -60, y: 400, z: 10 }
    ],
    accessibility: 4,
    viewQuality: 3,
    features: {
      riverCatsLanding: true,
      centerField: true,
      standingRoom: true,
      concessions: true,
      tripleAHeritage: true
    }
  },

  // ========== BLEACHER RESERVED (Left) ==========
  {
    id: 'bleacher-reserved-left',
    name: 'Bleacher Reserved - Left',
    level: 'bleachers',
    rows: generateRows(1, 20, 8, 14, 15),
    sunExposure: {
      morning: 40,
      afternoon: 70,
      evening: 90
    },
    covered: false,
    vertices: [
      { x: -90, y: 300, z: 8 },
      { x: -60, y: 320, z: 8 },
      { x: -60, y: 350, z: 20 },
      { x: -90, y: 330, z: 20 }
    ],
    accessibility: 3,
    viewQuality: 3,
    features: {
      bleacherSeating: true,
      leftField: true,
      affordableOption: true
    }
  },

  // ========== BLEACHER RESERVED (Right) ==========
  {
    id: 'bleacher-reserved-right',
    name: 'Bleacher Reserved - Right',
    level: 'bleachers',
    rows: generateRows(1, 20, 8, 14, 15),
    sunExposure: {
      morning: 45,
      afternoon: 75,
      evening: 85
    },
    covered: false,
    vertices: [
      { x: 60, y: 300, z: 8 },
      { x: 90, y: 320, z: 8 },
      { x: 90, y: 350, z: 20 },
      { x: 60, y: 330, z: 20 }
    ],
    accessibility: 3,
    viewQuality: 3,
    features: {
      bleacherSeating: true,
      rightField: true,
      valueSeating: true
    }
  },

  // ========== TOYOTA TERRACE ==========
  {
    id: 'toyota-terrace',
    name: 'Toyota Terrace',
    level: 'terrace',
    rows: generateRows(1, 15, 22, 16, 18),
    sunExposure: {
      morning: 15,
      afternoon: 40,
      evening: 65
    },
    covered: true,
    vertices: [
      { x: -20, y: 100, z: 22 },
      { x: 20, y: 100, z: 22 },
      { x: 20, y: 125, z: 32 },
      { x: -20, y: 125, z: 32 }
    ],
    accessibility: 4,
    viewQuality: 4,
    features: {
      toyotaTerrace: true,
      terraceLevel: true,
      coveredSeating: true,
      corporateSponsor: true
    }
  },

  // ========== SUITES LEVEL ==========
  {
    id: 'suites-level',
    name: 'Suites Level',
    level: 'suite',
    rows: generateRows(1, 1, 28, 0, 0),
    sunExposure: {
      morning: 5,
      afternoon: 25,
      evening: 50
    },
    covered: true,
    vertices: [
      { x: -50, y: 95, z: 28 },
      { x: 50, y: 95, z: 28 },
      { x: 50, y: 115, z: 28 },
      { x: -50, y: 115, z: 28 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      suitesLevel: true,
      privateBoxes: true,
      cateringService: true,
      climateControlled: true,
      exclusiveAccess: true
    }
  },

  // ========== COORS LIGHT LANDING ==========
  {
    id: 'coors-light-landing',
    name: 'Coors Light Landing',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 30,
      afternoon: 60,
      evening: 80
    },
    covered: false,
    vertices: [
      { x: -70, y: 340, z: 12 },
      { x: -40, y: 355, z: 12 },
      { x: -40, y: 375, z: 12 },
      { x: -70, y: 360, z: 12 }
    ],
    accessibility: 4,
    viewQuality: 3,
    features: {
      coorsLightLanding: true,
      leftField: true,
      barArea: true,
      standingRoom: true,
      drinkSpecials: true
    }
  },

  // ========== KAISER PERMANENTE PLAZA ==========
  {
    id: 'kaiser-plaza',
    name: 'Kaiser Permanente Plaza',
    level: 'plaza',
    rows: [],
    sunExposure: {
      morning: 55,
      afternoon: 85,
      evening: 95
    },
    covered: false,
    vertices: [
      { x: -30, y: 405, z: 5 },
      { x: 30, y: 405, z: 5 },
      { x: 30, y: 430, z: 5 },
      { x: -30, y: 430, z: 5 }
    ],
    accessibility: 5,
    viewQuality: 2,
    features: {
      kaiserPlaza: true,
      beyondCenterField: true,
      familyArea: true,
      playArea: true,
      picnicTables: true
    }
  },

  // ========== RALEY'S LANDING ==========
  {
    id: 'raleys-landing',
    name: "Raley's Landing",
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 35,
      afternoon: 65,
      evening: 85
    },
    covered: false,
    vertices: [
      { x: 40, y: 340, z: 12 },
      { x: 70, y: 355, z: 12 },
      { x: 70, y: 375, z: 12 },
      { x: 40, y: 360, z: 12 }
    ],
    accessibility: 4,
    viewQuality: 3,
    features: {
      raleysLanding: true,
      rightField: true,
      standingRoom: true,
      localSponsor: true,
      groupArea: true
    }
  },

  // ========== CLUB RESERVED ==========
  {
    id: 'club-reserved',
    name: 'Club Reserved',
    level: 'club',
    rows: generateRows(1, 12, 16, 14, 16),
    sunExposure: {
      morning: 12,
      afternoon: 38,
      evening: 62
    },
    covered: true,
    vertices: [
      { x: 25, y: 95, z: 16 },
      { x: 55, y: 100, z: 16 },
      { x: 55, y: 120, z: 24 },
      { x: 25, y: 115, z: 24 }
    ],
    accessibility: 4,
    viewQuality: 4,
    features: {
      clubReserved: true,
      firstBaseSide: true,
      widerSeats: true,
      clubAccess: true
    }
  },

  // ========== TEMPORARY A'S FEATURES ==========
  {
    id: 'as-drumline-section',
    name: "A's Drumline Section",
    level: 'bleachers',
    rows: generateRows(1, 10, 10, 12, 20),
    sunExposure: {
      morning: 50,
      afternoon: 80,
      evening: 95
    },
    covered: false,
    vertices: [
      { x: -80, y: 320, z: 10 },
      { x: -50, y: 335, z: 10 },
      { x: -50, y: 355, z: 18 },
      { x: -80, y: 340, z: 18 }
    ],
    accessibility: 3,
    viewQuality: 3,
    features: {
      asDrumlineSection: true,
      temporaryFeature: true,
      leftFieldBleachers: true,
      fanSection: true,
      drums2025: true,
      oaklandTradition: true
    }
  },

  // ========== STANDING ROOM OUTFIELD ==========
  {
    id: 'standing-room-outfield',
    name: 'Standing Room - Outfield',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 45,
      afternoon: 75,
      evening: 90
    },
    covered: false,
    vertices: [
      { x: -50, y: 390, z: 8 },
      { x: 50, y: 390, z: 8 },
      { x: 50, y: 410, z: 8 },
      { x: -50, y: 410, z: 8 }
    ],
    accessibility: 4,
    viewQuality: 2,
    features: {
      standingRoom: true,
      outfield: true,
      generalAdmission: true,
      flexibleCapacity: true,
      temporaryMLBExpansion: true
    }
  },

  // ========== PRESS BOX LEVEL ==========
  {
    id: 'press-box-level',
    name: 'Press Box Level',
    level: 'press',
    rows: generateRows(1, 4, 32, 10, 12),
    sunExposure: {
      morning: 5,
      afternoon: 20,
      evening: 40
    },
    covered: true,
    vertices: [
      { x: -20, y: 100, z: 32 },
      { x: 20, y: 100, z: 32 },
      { x: 20, y: 115, z: 36 },
      { x: -20, y: 115, z: 36 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      pressBoxLevel: true,
      mediaSeating: true,
      broadcastBooths: true,
      statisticiansArea: true,
      climateControlled: true,
      upgradedForMLB2025: true
    }
  }
];
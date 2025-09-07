import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium';

// Helper function to generate rows with consistent numbering
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

export const fenwayParkSections: DetailedSection[] = [
  // Field Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    category: 'premium',
    capacity: 380,
    type: 'fixed',
    elevation: 3,
    rows: generateRows(1, 12, 3, 10, 28),
    covered: false,
    sunExposure: {
      morning: 20,
      afternoon: 75,
      evening: 35
    },
    teamAreas: {
      dugout: 'below',
      bullpen: 'distant'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'In-seat service',
      'Extra legroom'
    ],
    accessibilityRating: 4,
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      premiumSeating: true,
      chairbackSeats: true,
      waitService: true,
      behindHomeBase: true
    },
    vertices: [
      { x: -25, y: 0, z: 3 },
      { x: 25, y: 0, z: 3 },
      { x: 25, y: 20, z: 8 },
      { x: -25, y: 20, z: 8 }
    ] as Vector3D[]
  },

  // Dugout Box - First Base
  {
    id: 'dugout-box-1b',
    name: 'Dugout Box - First Base',
    category: 'premium',
    capacity: 420,
    type: 'fixed',
    elevation: 3,
    rows: generateRows(1, 14, 3, 12, 29),
    covered: false,
    sunExposure: {
      morning: 30,
      afternoon: 85,
      evening: 40
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'Close to Red Sox dugout'
    ],
    accessibilityRating: 4,
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      fieldLevel: true,
      chairbackSeats: true,
      dugoutProximity: true,
      redSoxDugout: true
    },
    vertices: [
      { x: 25, y: 0, z: 3 },
      { x: 55, y: 30, z: 3 },
      { x: 55, y: 50, z: 9 },
      { x: 25, y: 20, z: 9 }
    ] as Vector3D[]
  },

  // Dugout Box - Third Base
  {
    id: 'dugout-box-3b',
    name: 'Dugout Box - Third Base',
    category: 'premium',
    capacity: 420,
    type: 'fixed',
    elevation: 3,
    rows: generateRows(1, 14, 3, 12, 29),
    covered: false,
    sunExposure: {
      morning: 65,
      afternoon: 45,
      evening: 30
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'Close to visitor dugout'
    ],
    accessibilityRating: 4,
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      fieldLevel: true,
      chairbackSeats: true,
      dugoutProximity: true,
      visitorDugout: true
    },
    vertices: [
      { x: -25, y: 0, z: 3 },
      { x: -55, y: 30, z: 3 },
      { x: -55, y: 50, z: 9 },
      { x: -25, y: 20, z: 9 }
    ] as Vector3D[]
  },

  // Green Monster Seats
  {
    id: 'green-monster',
    name: 'Green Monster Seats',
    category: 'luxury',
    capacity: 269,
    type: 'fixed',
    elevation: 37,
    rows: generateRows(1, 3, 37, 6, 22),
    covered: false,
    sunExposure: {
      morning: 80,
      afternoon: 30,
      evening: 15
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Iconic location',
      'Unique views',
      'Bar service',
      'Historic wall below'
    ],
    accessibilityRating: 2,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 3,
    restroomProximity: 3,
    obstructions: [
      {
        type: 'structural',
        description: 'Manual scoreboard operators below',
        severity: 'minimal'
      }
    ],
    features: {
      greenMonster: true,
      iconicLocation: true,
      manualScoreboard: true,
      historicWall: true,
      uniqueExperience: true
    },
    vertices: [
      { x: -90, y: 70, z: 37 },
      { x: -60, y: 95, z: 37 },
      { x: -60, y: 98, z: 40 },
      { x: -90, y: 73, z: 40 }
    ] as Vector3D[]
  },

  // Infield Box
  {
    id: 'infield-box',
    name: 'Infield Box',
    category: 'standard',
    capacity: 580,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 18, 8, 16, 31),
    covered: false,
    sunExposure: {
      morning: 45,
      afternoon: 70,
      evening: 35
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Standard seats',
      'Cup holders'
    ],
    accessibilityRating: 3,
    visibilityRating: 4,
    proximityToAction: 4,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      infieldView: true,
      standardSeating: true
    },
    vertices: [
      { x: -30, y: 20, z: 8 },
      { x: 30, y: 20, z: 8 },
      { x: 30, y: 40, z: 14 },
      { x: -30, y: 40, z: 14 }
    ] as Vector3D[]
  },

  // Grandstand - Behind Home
  {
    id: 'grandstand-home',
    name: 'Grandstand - Home Plate',
    category: 'standard',
    capacity: 720,
    type: 'fixed',
    elevation: 15,
    rows: generateRows(1, 22, 15, 20, 33),
    covered: true,
    coveragePercentage: 80,
    coveredRows: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
    sunExposure: {
      morning: 10,
      afternoon: 20,
      evening: 10
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Partial coverage',
      'Standard seats',
      'Historic section'
    ],
    accessibilityRating: 3,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    obstructions: [
      {
        type: 'structural',
        description: 'Support poles in some rows',
        affectedRows: ['15', '16', '17'],
        severity: 'moderate'
      }
    ],
    features: {
      partialCoverage: true,
      historicSection: true,
      supportPoles: true,
      grandstandSeating: true
    },
    vertices: [
      { x: -35, y: 40, z: 15 },
      { x: 35, y: 40, z: 15 },
      { x: 35, y: 65, z: 23 },
      { x: -35, y: 65, z: 23 }
    ] as Vector3D[]
  },

  // Right Field Box
  {
    id: 'right-field-box',
    name: 'Right Field Box',
    category: 'standard',
    capacity: 480,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 15, 6, 14, 30),
    covered: false,
    sunExposure: {
      morning: 35,
      afternoon: 95,
      evening: 50
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Standard seats',
      'Near Pesky Pole'
    ],
    accessibilityRating: 3,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      peskyPole: true,
      rightFieldCorner: true,
      bullpenView: true
    },
    vertices: [
      { x: 55, y: 30, z: 6 },
      { x: 75, y: 50, z: 6 },
      { x: 75, y: 68, z: 11 },
      { x: 55, y: 50, z: 11 }
    ] as Vector3D[]
  },

  // Pavilion Box - Right Field
  {
    id: 'pavilion-box-rf',
    name: 'Pavilion Box - Right Field',
    category: 'value',
    capacity: 520,
    type: 'fixed',
    elevation: 12,
    rows: generateRows(1, 16, 12, 16, 32),
    covered: true,
    coveragePercentage: 60,
    coveredRows: ['10', '11', '12', '13', '14', '15', '16'],
    sunExposure: {
      morning: 25,
      afternoon: 40,
      evening: 20
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Partial coverage',
      'Budget friendly'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      pavilionLevel: true,
      partialCoverage: true,
      budgetFriendly: true
    },
    vertices: [
      { x: 75, y: 50, z: 12 },
      { x: 90, y: 65, z: 12 },
      { x: 90, y: 83, z: 18 },
      { x: 75, y: 68, z: 18 }
    ] as Vector3D[]
  },

  // Bleachers - Center Field
  {
    id: 'bleachers-cf',
    name: 'Center Field Bleachers',
    category: 'value',
    capacity: 640,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 20, 8, 18, 30),
    covered: false,
    sunExposure: {
      morning: 60,
      afternoon: 80,
      evening: 45
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Bleacher seating',
      'Red Sox Nation atmosphere'
    ],
    accessibilityRating: 2,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      bleacherSeating: true,
      centerFieldView: true,
      redSoxNation: true,
      triangleSection: true
    },
    vertices: [
      { x: -60, y: 95, z: 8 },
      { x: 60, y: 95, z: 8 },
      { x: 60, y: 115, z: 14 },
      { x: -60, y: 115, z: 14 }
    ] as Vector3D[]
  },

  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Right Field Bleachers',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 18, 8, 16, 30),
    covered: false,
    sunExposure: {
      morning: 30,
      afternoon: 100,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bleacher seating',
      'Budget friendly'
    ],
    accessibilityRating: 2,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      bleacherSeating: true,
      rightFieldView: true,
      budgetFriendly: true
    },
    vertices: [
      { x: 60, y: 95, z: 8 },
      { x: 90, y: 65, z: 8 },
      { x: 90, y: 83, z: 13 },
      { x: 60, y: 115, z: 13 }
    ] as Vector3D[]
  },

  // EMC Club
  {
    id: 'emc-club',
    name: 'EMC Club',
    category: 'luxury',
    capacity: 406,
    type: 'club',
    elevation: 25,
    rows: generateRows(1, 8, 25, 12, 26),
    covered: true,
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Climate controlled',
      'All-inclusive dining',
      'Premium bar',
      'Padded seats',
      'Private entrance'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      clubLevel: true,
      allInclusive: true,
      climateControlled: true,
      privateEntrance: true,
      premiumDining: true
    },
    vertices: [
      { x: -40, y: 50, z: 25 },
      { x: 40, y: 50, z: 25 },
      { x: 40, y: 65, z: 29 },
      { x: -40, y: 65, z: 29 }
    ] as Vector3D[]
  },

  // State Street Pavilion
  {
    id: 'state-street-pavilion',
    name: 'State Street Pavilion',
    category: 'luxury',
    capacity: 374,
    type: 'club',
    elevation: 22,
    rows: generateRows(1, 6, 22, 10, 25),
    covered: true,
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Indoor/outdoor seating',
      'All-inclusive food',
      'Premium bar',
      'Climate controlled'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      pavilionLevel: true,
      indoorOutdoor: true,
      allInclusive: true,
      climateControlled: true
    },
    vertices: [
      { x: 40, y: 45, z: 22 },
      { x: 65, y: 60, z: 22 },
      { x: 65, y: 72, z: 26 },
      { x: 40, y: 57, z: 26 }
    ] as Vector3D[]
  },

  // Dell Technologies Club
  {
    id: 'dell-technologies-club',
    name: 'Dell Technologies Club',
    category: 'luxury',
    capacity: 320,
    type: 'club',
    elevation: 20,
    rows: generateRows(1, 5, 20, 10, 24),
    covered: true,
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Field level club',
      'All-inclusive dining',
      'Premium bar',
      'Lounge access'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      fieldLevelClub: true,
      allInclusive: true,
      loungeAccess: true,
      premiumLocation: true
    },
    vertices: [
      { x: -15, y: 8, z: 20 },
      { x: 15, y: 8, z: 20 },
      { x: 15, y: 20, z: 23 },
      { x: -15, y: 20, z: 23 }
    ] as Vector3D[]
  },

  // Royal Rooters Club
  {
    id: 'royal-rooters-club',
    name: 'Royal Rooters Club',
    category: 'luxury',
    capacity: 280,
    type: 'club',
    elevation: 18,
    rows: generateRows(1, 4, 18, 8, 24),
    covered: true,
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Historic club',
      'All-inclusive dining',
      'Premium location',
      'Private entrance'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      historicClub: true,
      allInclusive: true,
      privateEntrance: true,
      dugoutLevel: true
    },
    vertices: [
      { x: 25, y: 5, z: 18 },
      { x: 45, y: 25, z: 18 },
      { x: 45, y: 34, z: 21 },
      { x: 25, y: 14, z: 21 }
    ] as Vector3D[]
  },

  // Pavilion Standing Room
  {
    id: 'pavilion-sro',
    name: 'Pavilion Standing Room',
    category: 'standing',
    capacity: 500,
    type: 'standing',
    elevation: 16,
    rows: [],
    covered: false,
    sunExposure: {
      morning: 40,
      afternoon: 85,
      evening: 45
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Drink rails',
      'Various locations',
      'First-come basis'
    ],
    accessibilityRating: 2,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    features: {
      standingRoom: true,
      drinkRails: true,
      flexibleLocation: true
    },
    vertices: [
      { x: -70, y: 60, z: 16 },
      { x: 70, y: 60, z: 16 },
      { x: 70, y: 68, z: 16 },
      { x: -70, y: 68, z: 16 }
    ] as Vector3D[]
  },

  // Sam Deck
  {
    id: 'sam-deck',
    name: 'Sam Deck',
    category: 'special',
    capacity: 200,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 4, 12, 8, 25),
    covered: false,
    sunExposure: {
      morning: 30,
      afternoon: 90,
      evening: 50
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bar area',
      'Standing room',
      'Social atmosphere'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 4,
    features: {
      barArea: true,
      socialDeck: true,
      standingRoom: true,
      samAdams: true
    },
    vertices: [
      { x: 75, y: 55, z: 12 },
      { x: 85, y: 65, z: 12 },
      { x: 85, y: 73, z: 14 },
      { x: 75, y: 63, z: 14 }
    ] as Vector3D[]
  },

  // Budweiser Roof Deck
  {
    id: 'budweiser-roof-deck',
    name: 'Budweiser Roof Deck',
    category: 'special',
    capacity: 350,
    type: 'flexible',
    elevation: 38,
    rows: [],
    covered: false,
    sunExposure: {
      morning: 50,
      afternoon: 90,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Rooftop bar',
      'Standing room',
      'Food trucks',
      'City views'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 5,
    restroomProximity: 4,
    features: {
      rooftopDeck: true,
      barArea: true,
      cityViews: true,
      foodTrucks: true,
      standingRoom: true
    },
    vertices: [
      { x: 60, y: 100, z: 38 },
      { x: 90, y: 70, z: 38 },
      { x: 90, y: 80, z: 40 },
      { x: 60, y: 110, z: 40 }
    ] as Vector3D[]
  },

  // Coca-Cola Corner
  {
    id: 'coca-cola-corner',
    name: 'Coca-Cola Corner',
    category: 'special',
    capacity: 180,
    type: 'flexible',
    elevation: 10,
    rows: generateRows(1, 5, 10, 10, 26),
    covered: false,
    sunExposure: {
      morning: 70,
      afternoon: 40,
      evening: 25
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Interactive games',
      'Family friendly',
      'Standing room'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    features: {
      familyArea: true,
      interactiveGames: true,
      cocaColaThemed: true,
      flexibleSeating: true
    },
    vertices: [
      { x: -75, y: 55, z: 10 },
      { x: -60, y: 70, z: 10 },
      { x: -60, y: 78, z: 13 },
      { x: -75, y: 63, z: 13 }
    ] as Vector3D[]
  },

  // Pavilion Reserved
  {
    id: 'pavilion-reserved',
    name: 'Pavilion Reserved',
    category: 'standard',
    capacity: 460,
    type: 'fixed',
    elevation: 14,
    rows: generateRows(1, 14, 14, 14, 31),
    covered: true,
    coveragePercentage: 70,
    coveredRows: ['8', '9', '10', '11', '12', '13', '14'],
    sunExposure: {
      morning: 20,
      afternoon: 30,
      evening: 15
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Reserved seating',
      'Partial coverage'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      pavilionLevel: true,
      partialCoverage: true,
      reservedSeating: true
    },
    vertices: [
      { x: -65, y: 60, z: 14 },
      { x: -45, y: 80, z: 14 },
      { x: -45, y: 95, z: 19 },
      { x: -65, y: 75, z: 19 }
    ] as Vector3D[]
  },

  // Right Field Terrace
  {
    id: 'right-field-terrace',
    name: 'Right Field Terrace',
    category: 'special',
    capacity: 220,
    type: 'flexible',
    elevation: 18,
    rows: generateRows(1, 6, 18, 10, 27),
    covered: false,
    sunExposure: {
      morning: 25,
      afternoon: 95,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Terrace seating',
      'Tables available',
      'Bar service'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    features: {
      terraceSeating: true,
      tablesAvailable: true,
      barService: true,
      flexibleSeating: true
    },
    vertices: [
      { x: 80, y: 60, z: 18 },
      { x: 95, y: 75, z: 18 },
      { x: 95, y: 85, z: 21 },
      { x: 80, y: 70, z: 21 }
    ] as Vector3D[]
  },

  // Loge Box
  {
    id: 'loge-box',
    name: 'Loge Box',
    category: 'premium',
    capacity: 520,
    type: 'fixed',
    elevation: 16,
    rows: generateRows(1, 13, 16, 13, 30),
    covered: false,
    sunExposure: {
      morning: 40,
      afternoon: 75,
      evening: 35
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Premium seats',
      'Cup holders',
      'Good sightlines'
    ],
    accessibilityRating: 4,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      logeLevel: true,
      premiumSeating: true,
      chairbackSeats: true
    },
    vertices: [
      { x: -45, y: 35, z: 16 },
      { x: 45, y: 35, z: 16 },
      { x: 45, y: 50, z: 20 },
      { x: -45, y: 50, z: 20 }
    ] as Vector3D[]
  },

  // Family Section
  {
    id: 'family-section',
    name: 'Family Section',
    category: 'special',
    capacity: 340,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 10, 10, 12, 29),
    covered: false,
    sunExposure: {
      morning: 55,
      afternoon: 65,
      evening: 35
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Alcohol-free zone',
      'Family friendly',
      'Kid activities nearby'
    ],
    accessibilityRating: 4,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      familySection: true,
      alcoholFree: true,
      kidFriendly: true,
      nearActivities: true
    },
    vertices: [
      { x: -50, y: 45, z: 10 },
      { x: -30, y: 55, z: 10 },
      { x: -30, y: 68, z: 14 },
      { x: -50, y: 58, z: 14 }
    ] as Vector3D[]
  }
];

// Stadium configuration
export const fenwayParkConfig = {
  stadiumName: 'Fenway Park',
  team: 'Boston Red Sox',
  location: 'Boston, Massachusetts',
  capacity: 37755,
  yearBuilt: 1912,
  orientation: 88, // Nearly due east
  dimensions: {
    leftField: 310,
    leftCenter: 379,
    center: 420,
    rightCenter: 380,
    rightField: 302,
    greenMonsterHeight: 37
  },
  features: {
    greenMonster: true,
    peskyPole: true,
    triangleInCenterField: true,
    manualScoreboard: true,
    historicBallpark: true,
    oldestMLBStadium: true,
    uniqueDimensions: true,
    citronellaGrass: true
  },
  sunExposureNotes: {
    morning: 'Sun rises over right field, affecting first base side',
    afternoon: 'Sun high overhead, Green Monster provides shade to left field',
    evening: 'Sun sets behind third base, creating shadows across infield'
  },
  accessibilityFeatures: [
    'Elevator access to most levels',
    'Accessible seating throughout',
    'Accessible parking at multiple lots',
    'Assistive listening devices available'
  ]
};
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

export const citiFieldSections: DetailedSection[] = [
  // Field Level Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    category: 'premium',
    capacity: 450,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 15, 4, 10, 28),
    covered: false,
    sunExposure: {
      morning: 25,
      afternoon: 80,
      evening: 40
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
      { x: -25, y: 0, z: 4 },
      { x: 25, y: 0, z: 4 },
      { x: 25, y: 23, z: 10 },
      { x: -25, y: 23, z: 10 }
    ] as Vector3D[]
  },

  // Field Level Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    category: 'premium',
    capacity: 520,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 17, 4, 12, 29),
    covered: false,
    sunExposure: {
      morning: 35,
      afternoon: 90,
      evening: 45
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'Close to Mets dugout'
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
      metsDugout: true
    },
    vertices: [
      { x: 25, y: 0, z: 4 },
      { x: 55, y: 30, z: 4 },
      { x: 55, y: 53, z: 11 },
      { x: 25, y: 23, z: 11 }
    ] as Vector3D[]
  },

  // Field Level Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    category: 'premium',
    capacity: 520,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 17, 4, 12, 29),
    covered: false,
    sunExposure: {
      morning: 70,
      afternoon: 50,
      evening: 35
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
      { x: -25, y: 0, z: 4 },
      { x: -55, y: 30, z: 4 },
      { x: -55, y: 53, z: 11 },
      { x: -25, y: 23, z: 11 }
    ] as Vector3D[]
  },

  // Metropolitan Club
  {
    id: 'metropolitan-club',
    name: 'Metropolitan Club',
    category: 'luxury',
    capacity: 340,
    type: 'club',
    elevation: 18,
    rows: generateRows(1, 6, 18, 10, 25),
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
      { x: -40, y: 35, z: 18 },
      { x: 40, y: 35, z: 18 },
      { x: 40, y: 47, z: 22 },
      { x: -40, y: 47, z: 22 }
    ] as Vector3D[]
  },

  // Delta Sky360 Club
  {
    id: 'delta-sky360',
    name: 'Delta Sky360 Club',
    category: 'luxury',
    capacity: 380,
    type: 'club',
    elevation: 8,
    rows: generateRows(1, 8, 8, 12, 24),
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
      'Field level club',
      'All-inclusive dining',
      'Premium location',
      'Climate controlled'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      fieldLevelClub: true,
      allInclusive: true,
      deltaThemed: true,
      premiumLocation: true
    },
    vertices: [
      { x: -20, y: 5, z: 8 },
      { x: 20, y: 5, z: 8 },
      { x: 20, y: 18, z: 12 },
      { x: -20, y: 18, z: 12 }
    ] as Vector3D[]
  },

  // Caesars Club
  {
    id: 'caesars-club',
    name: 'Caesars Club',
    category: 'luxury',
    capacity: 260,
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
      'Sports betting lounge',
      'All-inclusive dining',
      'Premium bar',
      'Private entrance'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      sportsbook: true,
      allInclusive: true,
      caesarsThemed: true,
      privateEntrance: true
    },
    vertices: [
      { x: 30, y: 40, z: 20 },
      { x: 50, y: 50, z: 20 },
      { x: 50, y: 60, z: 23 },
      { x: 30, y: 50, z: 23 }
    ] as Vector3D[]
  },

  // Jim Beam Highball Club
  {
    id: 'jim-beam-highball',
    name: 'Jim Beam Highball Club',
    category: 'special',
    capacity: 200,
    type: 'flexible',
    elevation: 14,
    rows: generateRows(1, 4, 14, 8, 25),
    covered: false,
    sunExposure: {
      morning: 30,
      afternoon: 85,
      evening: 50
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bourbon bar',
      'Standing room',
      'High-top tables',
      'Social atmosphere'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 4,
    features: {
      bourbonBar: true,
      standingRoom: true,
      highballClub: true,
      socialArea: true
    },
    vertices: [
      { x: 70, y: 55, z: 14 },
      { x: 85, y: 70, z: 14 },
      { x: 85, y: 78, z: 17 },
      { x: 70, y: 63, z: 17 }
    ] as Vector3D[]
  },

  // Foxwoods Club
  {
    id: 'foxwoods-club',
    name: 'Foxwoods Club',
    category: 'luxury',
    capacity: 300,
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
      'Gaming lounge',
      'All-inclusive dining',
      'Premium bar',
      'Climate controlled'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      gamingThemed: true,
      allInclusive: true,
      foxwoodsPartnership: true,
      climateControlled: true
    },
    vertices: [
      { x: -30, y: 40, z: 22 },
      { x: -50, y: 50, z: 22 },
      { x: -50, y: 60, z: 25 },
      { x: -30, y: 50, z: 25 }
    ] as Vector3D[]
  },

  // Coca-Cola Corner
  {
    id: 'coca-cola-corner',
    name: 'Coca-Cola Corner',
    category: 'special',
    capacity: 280,
    type: 'flexible',
    elevation: 10,
    rows: generateRows(1, 8, 10, 12, 28),
    covered: false,
    sunExposure: {
      morning: 35,
      afternoon: 95,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Family area',
      'Interactive games',
      'Group seating',
      'Themed concessions'
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
      groupSeating: true
    },
    vertices: [
      { x: 85, y: 70, z: 10 },
      { x: 95, y: 80, z: 10 },
      { x: 95, y: 92, z: 14 },
      { x: 85, y: 82, z: 14 }
    ] as Vector3D[]
  },

  // Piazza 31
  {
    id: 'piazza-31',
    name: 'Piazza 31',
    category: 'special',
    capacity: 220,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 6, 12, 10, 26),
    covered: false,
    sunExposure: {
      morning: 70,
      afternoon: 35,
      evening: 20
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Mike Piazza tribute',
      'Standing room',
      'Bar service',
      'Memorabilia displays'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      piazzaTribute: true,
      standingRoom: true,
      memorabiliaDisplays: true,
      number31Theme: true
    },
    vertices: [
      { x: -85, y: 70, z: 12 },
      { x: -95, y: 80, z: 12 },
      { x: -95, y: 90, z: 15 },
      { x: -85, y: 80, z: 15 }
    ] as Vector3D[]
  },

  // Shea Bridge
  {
    id: 'shea-bridge',
    name: 'Shea Bridge',
    category: 'special',
    capacity: 180,
    type: 'standing',
    elevation: 16,
    rows: [],
    covered: false,
    sunExposure: {
      morning: 50,
      afternoon: 85,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Standing room',
      'Historic bridge replica',
      'Food trucks nearby',
      'City skyline views'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    features: {
      sheaBridge: true,
      standingRoom: true,
      historicReplica: true,
      skylineViews: true
    },
    vertices: [
      { x: -40, y: 90, z: 16 },
      { x: 40, y: 90, z: 16 },
      { x: 40, y: 98, z: 16 },
      { x: -40, y: 98, z: 16 }
    ] as Vector3D[]
  },

  // Excelsior Level - Home Plate
  {
    id: 'excelsior-home',
    name: 'Excelsior Level - Home Plate',
    category: 'standard',
    capacity: 680,
    type: 'fixed',
    elevation: 18,
    rows: generateRows(1, 20, 18, 18, 32),
    covered: true,
    coveragePercentage: 80,
    coveredRows: ['12', '13', '14', '15', '16', '17', '18', '19', '20'],
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
      'Covered seating',
      'Standard seats',
      'Good sightlines'
    ],
    accessibilityRating: 3,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      excelsiorLevel: true,
      coveredSeating: true,
      pressBoxNearby: true
    },
    vertices: [
      { x: -35, y: 45, z: 18 },
      { x: 35, y: 45, z: 18 },
      { x: 35, y: 65, z: 25 },
      { x: -35, y: 65, z: 25 }
    ] as Vector3D[]
  },

  // Promenade Level - First Base
  {
    id: 'promenade-1b',
    name: 'Promenade Level - First Base',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 25,
    rows: generateRows(1, 18, 25, 16, 33),
    covered: true,
    coveragePercentage: 90,
    coveredRows: ['10', '11', '12', '13', '14', '15', '16', '17', '18'],
    sunExposure: {
      morning: 5,
      afternoon: 15,
      evening: 5
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Upper deck seating',
      'Covered from elements',
      'Budget friendly'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      promenadeLevel: true,
      upperDeck: true,
      coveredSeating: true,
      valueSeating: true
    },
    vertices: [
      { x: 35, y: 50, z: 25 },
      { x: 65, y: 70, z: 25 },
      { x: 65, y: 88, z: 31 },
      { x: 35, y: 68, z: 31 }
    ] as Vector3D[]
  },

  // Promenade Level - Third Base
  {
    id: 'promenade-3b',
    name: 'Promenade Level - Third Base',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 25,
    rows: generateRows(1, 18, 25, 16, 33),
    covered: true,
    coveragePercentage: 90,
    coveredRows: ['10', '11', '12', '13', '14', '15', '16', '17', '18'],
    sunExposure: {
      morning: 10,
      afternoon: 10,
      evening: 5
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Upper deck seating',
      'Covered from elements',
      'Budget friendly'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      promenadeLevel: true,
      upperDeck: true,
      coveredSeating: true,
      valueSeating: true
    },
    vertices: [
      { x: -35, y: 50, z: 25 },
      { x: -65, y: 70, z: 25 },
      { x: -65, y: 88, z: 31 },
      { x: -35, y: 68, z: 31 }
    ] as Vector3D[]
  },

  // Pepsi Porch - Right Field
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    category: 'special',
    capacity: 340,
    type: 'flexible',
    elevation: 8,
    rows: generateRows(1, 10, 8, 12, 28),
    covered: false,
    sunExposure: {
      morning: 25,
      afternoon: 100,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Outfield seating',
      'Group area',
      'Pepsi products',
      'Social atmosphere'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    features: {
      pepsiPorch: true,
      outfieldSeating: true,
      groupArea: true,
      socialAtmosphere: true
    },
    vertices: [
      { x: 75, y: 60, z: 8 },
      { x: 95, y: 80, z: 8 },
      { x: 95, y: 95, z: 13 },
      { x: 75, y: 75, z: 13 }
    ] as Vector3D[]
  },

  // Left Field Landing
  {
    id: 'left-field-landing',
    name: 'Left Field Landing',
    category: 'value',
    capacity: 420,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 14, 6, 14, 29),
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
      'Outfield seating',
      'Budget friendly',
      'Group friendly'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    features: {
      leftFieldView: true,
      outfieldSeating: true,
      budgetFriendly: true
    },
    vertices: [
      { x: -75, y: 60, z: 6 },
      { x: -95, y: 80, z: 6 },
      { x: -95, y: 95, z: 11 },
      { x: -75, y: 75, z: 11 }
    ] as Vector3D[]
  },

  // Center Field Plaza
  {
    id: 'center-field-plaza',
    name: 'Center Field Plaza',
    category: 'standing',
    capacity: 400,
    type: 'standing',
    elevation: 8,
    rows: [],
    covered: false,
    sunExposure: {
      morning: 60,
      afternoon: 85,
      evening: 50
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Standing room',
      'Food court nearby',
      'Kids activities',
      'Home Run Apple view'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 5,
    restroomProximity: 4,
    features: {
      standingRoom: true,
      homeRunApple: true,
      foodCourt: true,
      kidsActivities: true
    },
    vertices: [
      { x: -50, y: 100, z: 8 },
      { x: 50, y: 100, z: 8 },
      { x: 50, y: 115, z: 8 },
      { x: -50, y: 115, z: 8 }
    ] as Vector3D[]
  },

  // Sterling Level Suites
  {
    id: 'sterling-suites',
    name: 'Sterling Level Suites',
    category: 'luxury',
    capacity: 320,
    type: 'suite',
    elevation: 24,
    rows: generateRows(1, 2, 24, 8, 22),
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
      'Private restroom',
      'Catering service',
      'Premium parking',
      'Indoor/outdoor seating'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      suiteLevel: true,
      privateRestroom: true,
      cateringAvailable: true,
      climateControlled: true,
      premiumParking: true
    },
    vertices: [
      { x: -45, y: 48, z: 24 },
      { x: 45, y: 48, z: 24 },
      { x: 45, y: 58, z: 27 },
      { x: -45, y: 58, z: 27 }
    ] as Vector3D[]
  },

  // Paciolan Pavilion
  {
    id: 'paciolan-pavilion',
    name: 'Paciolan Pavilion',
    category: 'special',
    capacity: 240,
    type: 'flexible',
    elevation: 14,
    rows: generateRows(1, 6, 14, 10, 27),
    covered: false,
    sunExposure: {
      morning: 45,
      afternoon: 75,
      evening: 40
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Group seating',
      'Picnic tables',
      'All-inclusive packages'
    ],
    accessibilityRating: 3,
    visibilityRating: 3,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 4,
    features: {
      groupPavilion: true,
      picnicTables: true,
      allInclusivePackages: true
    },
    vertices: [
      { x: 55, y: 45, z: 14 },
      { x: 70, y: 60, z: 14 },
      { x: 70, y: 70, z: 17 },
      { x: 55, y: 55, z: 17 }
    ] as Vector3D[]
  },

  // Press Box Level
  {
    id: 'press-box',
    name: 'Press Box',
    category: 'media',
    capacity: 100,
    type: 'media',
    elevation: 30,
    rows: generateRows(1, 3, 30, 6, 20),
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
      'Media facilities',
      'High-speed internet',
      'Power outlets',
      'Work stations'
    ],
    accessibilityRating: 5,
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    features: {
      pressBox: true,
      mediaFacilities: true,
      broadcastBooths: true,
      workStations: true
    },
    vertices: [
      { x: -20, y: 55, z: 30 },
      { x: 20, y: 55, z: 30 },
      { x: 20, y: 62, z: 32 },
      { x: -20, y: 62, z: 32 }
    ] as Vector3D[]
  },

  // Family Section
  {
    id: 'family-section',
    name: 'Family Section',
    category: 'special',
    capacity: 360,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 12, 10, 12, 29),
    covered: false,
    sunExposure: {
      morning: 55,
      afternoon: 70,
      evening: 35
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Alcohol-free zone',
      'Family friendly',
      'Kid activities nearby',
      'Mr. Met visits'
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
      mrMetVisits: true
    },
    vertices: [
      { x: -55, y: 35, z: 10 },
      { x: -35, y: 45, z: 10 },
      { x: -35, y: 58, z: 14 },
      { x: -55, y: 48, z: 14 }
    ] as Vector3D[]
  },

  // Wheelchair Accessible Areas
  {
    id: 'wheelchair-accessible',
    name: 'Wheelchair Accessible Seating',
    category: 'accessible',
    capacity: 120,
    type: 'accessible',
    elevation: 12,
    rows: [
      { row: 'WC', elevation: 12, depth: 6, rakeAngle: 0 }
    ],
    covered: false,
    sunExposure: {
      morning: 50,
      afternoon: 75,
      evening: 40
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Level access',
      'Companion seating',
      'Accessible restrooms',
      'Wide concourses'
    ],
    accessibilityRating: 5,
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    features: {
      wheelchairAccessible: true,
      companionSeats: true,
      levelAccess: true,
      accessibleRestrooms: true
    },
    vertices: [
      { x: -60, y: 30, z: 12 },
      { x: 60, y: 30, z: 12 },
      { x: 60, y: 36, z: 12 },
      { x: -60, y: 36, z: 12 }
    ] as Vector3D[]
  },
  
  // Porsche Grille
  {
    id: 'porsche-grille',
    name: 'Porsche Grille',
    level: 'club',
    rows: generateRows(1, 14, 350, 65, 32),
    sunExposure: {
      morning: 35,
      afternoon: 45,
      evening: 60
    },
    covered: true,
    vertices: [
      { x: -110, y: 65, z: 320 },
      { x: -80, y: 65, z: 340 },
      { x: -85, y: 98, z: 373 },
      { x: -115, y: 98, z: 353 }
    ],
    accessibility: 5,
    viewQuality: 5,
    features: {
      porscheGrille: true,
      leftFieldExcelsior: true,
      seats350: true,
      fineDining: true,
      contemporaryAmerican: true,
      marketTable: true,
      antipasstoBar: true,
      alFornoTable: true,
      brickOvenPizza: true,
      fullFieldViews: true,
      exclusiveAccess: true,
      myriadRestaurantGroup: true
    }
  }
];

// Stadium configuration
export const citiFieldConfig = {
  stadiumName: 'Citi Field',
  team: 'New York Mets',
  location: 'Queens, New York',
  capacity: 41922,
  yearBuilt: 2009,
  orientation: 75, // East-northeast facing
  dimensions: {
    leftField: 335,
    leftCenter: 358,
    center: 408,
    rightCenter: 383,
    rightField: 330,
    homeRunAppleHeight: 18
  },
  features: {
    homeRunApple: true,
    sheaBridgeReplica: true,
    jackieRobinsonRotunda: true,
    metsHallOfFame: true,
    fanWalk: true,
    cocaColaCorner: true,
    metropolitanClub: true,
    deltaSky360: true
  },
  sunExposureNotes: {
    morning: 'Sun rises over right field, third base side gets shade',
    afternoon: 'Sun high overhead, maximum exposure in outfield sections',
    evening: 'Sun sets behind home plate, center field gets shade first'
  },
  accessibilityFeatures: [
    'Elevator access to all levels',
    'Accessible seating throughout',
    'Accessible parking with shuttle service',
    'Assistive listening devices available',
    'Sensory-friendly spaces'
  ]
};
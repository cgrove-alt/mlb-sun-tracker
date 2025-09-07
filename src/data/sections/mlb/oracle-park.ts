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

export const oracleParkSections: DetailedSection[] = [
  // Field Club - Behind Home Plate
  {
    id: 'field-club-home',
    name: 'Field Club - Home Plate',
    category: 'luxury',
    capacity: 380,
    type: 'club',
    elevation: 3,
    rows: generateRows(1, 12, 3, 10, 26),
    covered: false
    sunExposure: {
      morning: 30,
      afternoon: 75,
      evening: 35
    },
    teamAreas: {
      dugout: 'below',
      bullpen: 'distant'
    },
    amenities: [
      'All-inclusive dining',
      'Premium bar',
      'Padded seats',
      'In-seat service',
      'Private entrance'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -25, y: 0, z: 3 },
      { x: 25, y: 0, z: 3 },
      { x: 25, y: 20, z: 8 },
      { x: -25, y: 20, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Lower Box - First Base
  {
    id: 'lower-box-1b',
    name: 'Lower Box - First Base',
    category: 'premium',
    capacity: 520,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 18, 4, 14, 29),
    covered: false
    sunExposure: {
      morning: 40,
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
      'Close to Giants dugout'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 25, y: 0, z: 4 },
      { x: 55, y: 30, z: 4 },
      { x: 55, y: 54, z: 11 },
      { x: 25, y: 24, z: 11 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Lower Box - Third Base
  {
    id: 'lower-box-3b',
    name: 'Lower Box - Third Base',
    category: 'premium',
    capacity: 520,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 18, 4, 14, 29),
    covered: false
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
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -25, y: 0, z: 4 },
      { x: -55, y: 30, z: 4 },
      { x: -55, y: 54, z: 11 },
      { x: -25, y: 24, z: 11 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Gotham Club
  {
    id: 'gotham-club',
    name: 'Gotham Club',
    category: 'luxury',
    capacity: 150,
    type: 'club',
    elevation: 18,
    rows: generateRows(1, 3, 18, 8, 22),
    covered: true
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Speakeasy bar',
      'Bowling lanes',
      'Arcade games',
      'Billiards table',
      'Private entrance',
      'Climate controlled'
    ],
    visibilityRating: 4,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: 85, y: 75, z: 18 },
      { x: 95, y: 85, z: 18 },
      { x: 95, y: 93, z: 20 },
      { x: 85, y: 83, z: 20 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Arcade Section
  {
    id: 'arcade-section',
    name: 'Arcade - Right Field',
    category: 'special',
    capacity: 420,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 12, 12, 14, 30),
    covered: false
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
      'Bleacher seating',
      '309 feet from home',
      'Home run territory',
      'Standing room'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: 75, y: 55, z: 12 },
      { x: 95, y: 75, z: 12 },
      { x: 95, y: 90, z: 17 },
      { x: 75, y: 70, z: 17 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Coca-Cola Fan Lot
  {
    id: 'coca-cola-fan-lot',
    name: 'Coca-Cola Fan Lot',
    category: 'special',
    capacity: 280,
    type: 'flexible',
    elevation: 8,
    rows: generateRows(1, 8, 8, 12, 27),
    covered: false
    sunExposure: {
      morning: 70,
      afternoon: 30,
      evening: 15
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      '80-foot Coke bottle',
      'Four 60-foot slides',
      'Kids play area',
      'Mini ballpark',
      'Picnic tables'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -85, y: 70, z: 8 },
      { x: -95, y: 80, z: 8 },
      { x: -95, y: 92, z: 12 },
      { x: -85, y: 82, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // McCovey Cove Seats
  {
    id: 'mccovey-cove',
    name: 'McCovey Cove Seats',
    category: 'special',
    capacity: 320,
    type: 'flexible',
    elevation: 10,
    rows: generateRows(1, 10, 10, 12, 28),
    covered: false
    sunExposure: {
      morning: 20,
      afternoon: 90,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Water views',
      'Splash hit zone',
      'Standing room',
      'Promenade access'
    ],
    visibilityRating: 4,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: 80, y: 65, z: 10 },
      { x: 95, y: 80, z: 10 },
      { x: 95, y: 95, z: 14 },
      { x: 80, y: 80, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Garden Area
  {
    id: 'garden-area',
    name: 'Garden',
    category: 'special',
    capacity: 200,
    type: 'standing',
    elevation: 14,
    rows: [],
    covered: false
    sunExposure: {
      morning: 60,
      afternoon: 75,
      evening: 45
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Edible garden',
      'Standing room',
      'Educational displays',
      'Sustainable features'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: -40, y: 95, z: 14 },
      { x: 40, y: 95, z: 14 },
      { x: 40, y: 105, z: 14 },
      { x: -40, y: 105, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Club Level - Home Plate
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    category: 'luxury',
    capacity: 460,
    type: 'club',
    elevation: 22,
    rows: generateRows(1, 10, 22, 12, 27),
    covered: true
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
      'Private concourse'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -40, y: 45, z: 22 },
      { x: 40, y: 45, z: 22 },
      { x: 40, y: 58, z: 27 },
      { x: -40, y: 58, z: 27 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Club Level - First Base
  {
    id: 'club-level-1b',
    name: 'Club Level - First Base',
    category: 'luxury',
    capacity: 380,
    type: 'club',
    elevation: 22,
    rows: generateRows(1, 8, 22, 10, 27),
    covered: true
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
      'Club access',
      'All-inclusive food',
      'Premium bar',
      'Padded seats'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: 40, y: 45, z: 22 },
      { x: 65, y: 65, z: 22 },
      { x: 65, y: 76, z: 26 },
      { x: 40, y: 58, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Club Level - Third Base
  {
    id: 'club-level-3b',
    name: 'Club Level - Third Base',
    category: 'luxury',
    capacity: 380,
    type: 'club',
    elevation: 22,
    rows: generateRows(1, 8, 22, 10, 27),
    covered: true
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
      'Club access',
      'All-inclusive food',
      'Premium bar',
      'Padded seats'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -40, y: 45, z: 22 },
      { x: -65, y: 65, z: 22 },
      { x: -65, y: 76, z: 26 },
      { x: -40, y: 58, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // View Level - Behind Home
  {
    id: 'view-level-home',
    name: 'View Level - Home Plate',
    category: 'value',
    capacity: 680,
    type: 'fixed',
    elevation: 28,
    rows: generateRows(1, 22, 28, 20, 34),
    covered: true
    coveragePercentage: 80,
    coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22'],
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
      'Upper deck seating',
      'Partial coverage',
      'Budget friendly'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -35, y: 55, z: 28 },
      { x: 35, y: 55, z: 28 },
      { x: 35, y: 78, z: 36 },
      { x: -35, y: 78, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Left Field Bleachers',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 18, 6, 16, 30),
    covered: false
    sunExposure: {
      morning: 80,
      afternoon: 35,
      evening: 20
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bleacher seating',
      'Budget friendly',
      'Social atmosphere'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -75, y: 55, z: 6 },
      { x: -95, y: 75, z: 6 },
      { x: -95, y: 93, z: 12 },
      { x: -75, y: 73, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Bleachers - Center Field
  {
    id: 'bleachers-cf',
    name: 'Center Field Bleachers',
    category: 'value',
    capacity: 520,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 16, 6, 14, 30),
    covered: false
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
      'Batter\'s eye view'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -95, y: 75, z: 6 },
      { x: -40, y: 105, z: 6 },
      { x: -40, y: 120, z: 11 },
      { x: -95, y: 93, z: 11 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Toyota Fan Zone
  {
    id: 'toyota-fan-zone',
    name: 'Toyota Fan Zone',
    category: 'special',
    capacity: 180,
    type: 'flexible',
    elevation: 8,
    rows: generateRows(1, 5, 8, 10, 26),
    covered: false
    sunExposure: {
      morning: 50,
      afternoon: 85,
      evening: 50
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Mini replica field',
      'Kids activities',
      'Whiffle ball',
      'Fish tank display'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 40, y: 105, z: 8 },
      { x: 60, y: 105, z: 8 },
      { x: 60, y: 115, z: 10 },
      { x: 40, y: 115, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Bullpen Board Walk
  {
    id: 'bullpen-board-walk',
    name: 'Bullpen Board Walk',
    category: 'special',
    capacity: 240,
    type: 'standing',
    elevation: 10,
    rows: [],
    covered: false
    sunExposure: {
      morning: 30,
      afternoon: 90,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Free arcade games',
      'Skeeball',
      'PacMan',
      'Standing room',
      'Bar service'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 70, y: 50, z: 10 },
      { x: 85, y: 65, z: 10 },
      { x: 85, y: 73, z: 10 },
      { x: 70, y: 58, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Luxury Suites
  {
    id: 'luxury-suites',
    name: 'Luxury Suites',
    category: 'luxury',
    capacity: 400,
    type: 'suite',
    elevation: 24,
    rows: generateRows(1, 2, 24, 8, 22),
    covered: true
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
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -50, y: 48, z: 24 },
      { x: 50, y: 48, z: 24 },
      { x: 50, y: 58, z: 27 },
      { x: -50, y: 58, z: 27 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Promenade Standing Room
  {
    id: 'promenade-sro',
    name: 'Promenade Standing Room',
    category: 'standing',
    capacity: 500,
    type: 'standing',
    elevation: 16,
    rows: [],
    covered: false
    sunExposure: {
      morning: 45,
      afternoon: 80,
      evening: 50
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Standing room',
      'Drink rails',
      'Bay views',
      'Various locations'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: -70, y: 40, z: 16 },
      { x: 70, y: 40, z: 16 },
      { x: 70, y: 48, z: 16 },
      { x: -70, y: 48, z: 16 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Press Box Level
  {
    id: 'press-box',
    name: 'Press Box',
    category: 'media',
    capacity: 90,
    type: 'media',
    elevation: 32,
    rows: generateRows(1, 3, 32, 6, 20),
    covered: true
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
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -20, y: 60, z: 32 },
      { x: 20, y: 60, z: 32 },
      { x: 20, y: 67, z: 34 },
      { x: -20, y: 67, z: 34 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Viewing Deck - Right Field
  {
    id: 'viewing-deck-rf',
    name: 'Right Field Viewing Deck',
    category: 'special',
    capacity: 300,
    type: 'flexible',
    elevation: 18,
    rows: generateRows(1, 6, 18, 10, 28),
    covered: false
    sunExposure: {
      morning: 20,
      afternoon: 95,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Standing room',
      'Tables available',
      'Bay Bridge views',
      'Social area'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: 80, y: 70, z: 18 },
      { x: 95, y: 85, z: 18 },
      { x: 95, y: 95, z: 21 },
      { x: 80, y: 80, z: 21 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Family Section
  {
    id: 'family-section',
    name: 'Family Section',
    category: 'special',
    capacity: 340,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 11, 10, 12, 29),
    covered: false
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
      'Lou Seal visits'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -55, y: 38, z: 10 },
      { x: -35, y: 48, z: 10 },
      { x: -35, y: 60, z: 14 },
      { x: -55, y: 50, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Wheelchair Accessible Areas
  {
    id: 'wheelchair-accessible',
    name: 'Wheelchair Accessible Seating',
    category: 'accessible',
    capacity: 140,
    type: 'accessible',
    elevation: 14,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      { row: 'WC', elevation: 14, depth: 6, rakeAngle: 0 }
    ],
    covered: false
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
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -60, y: 32, z: 14 },
      { x: 60, y: 32, z: 14 },
      { x: 60, y: 38, z: 14 },
      { x: -60, y: 38, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Public House
  {
    id: 'public-house',
    name: 'Public House',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false
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

export const camdenYardsSections: DetailedSection[] = [
  // Club Level - Behind Home Plate
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    category: 'luxury',
    capacity: 420,
    type: 'club',
    elevation: 20,
    rows: generateRows(1, 10, 20, 12, 26),
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
      'Private entrance'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -25, y: 40, z: 20 },
      { x: 25, y: 40, z: 20 },
      { x: 25, y: 53, z: 25 },
      { x: -25, y: 53, z: 25 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Field Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    category: 'premium',
    capacity: 480,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 16, 4, 10, 28),
    covered: false
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
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -25, y: 0, z: 4 },
      { x: 25, y: 0, z: 4 },
      { x: 25, y: 24, z: 10 },
      { x: -25, y: 24, z: 10 }
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
    capacity: 540,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 18, 4, 12, 29),
    covered: false
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
      'Close to Orioles dugout'
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
    capacity: 540,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 18, 4, 12, 29),
    covered: false
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

  // Eutaw Street Reserved
  {
    id: 'eutaw-street-reserved',
    name: 'Eutaw Street Reserved',
    category: 'special',
    capacity: 520,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 14, 12, 14, 30),
    covered: false
    sunExposure: {
      morning: 20,
      afternoon: 95,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Historic warehouse views',
      'Eutaw Street access',
      'Bronze baseball markers',
      'Standing room available'
    ],
    visibilityRating: 4,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 85, y: 70, z: 12 },
      { x: 95, y: 80, z: 12 },
      { x: 95, y: 95, z: 17 },
      { x: 85, y: 85, z: 17 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Coors Light Roof Deck
  {
    id: 'coors-light-roof-deck',
    name: 'Coors Light Roof Deck',
    category: 'special',
    capacity: 280,
    type: 'flexible',
    elevation: 18,
    rows: generateRows(1, 6, 18, 10, 26),
    covered: false
    sunExposure: {
      morning: 50,
      afternoon: 85,
      evening: 50
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'below'
    },
    amenities: [
      'Full bar service',
      'High-top tables',
      'Reserved seating',
      'Overlooks field and Eutaw Street'
    ],
    visibilityRating: 4,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -40, y: 95, z: 18 },
      { x: 40, y: 95, z: 18 },
      { x: 40, y: 106, z: 21 },
      { x: -40, y: 106, z: 21 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Eutaw Street Rooftop Palace
  {
    id: 'eutaw-rooftop-palace',
    name: 'Eutaw Street Rooftop Palace',
    category: 'special',
    capacity: 380,
    type: 'flexible',
    elevation: 22,
    rows: generateRows(90, 98, 22, 12, 28),
    covered: false
    sunExposure: {
      morning: 15,
      afternoon: 90,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Raised platform',
      'Bar atmosphere',
      'Eutaw Street adjacent',
      'Unique perspective'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 88, y: 75, z: 22 },
      { x: 98, y: 85, z: 22 },
      { x: 98, y: 97, z: 26 },
      { x: 88, y: 87, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // B&O Warehouse Club
  {
    id: 'warehouse-club',
    name: 'B&O Warehouse Club',
    category: 'luxury',
    capacity: 320,
    type: 'club',
    elevation: 16,
    rows: generateRows(1, 8, 16, 10, 25),
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
      'Historic warehouse setting',
      'All-inclusive dining',
      'Climate controlled',
      'Premium bar'
    ],
    visibilityRating: 4,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: 90, y: 60, z: 16 },
      { x: 100, y: 70, z: 16 },
      { x: 100, y: 80, z: 19 },
      { x: 90, y: 70, z: 19 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Camden Club
  {
    id: 'camden-club',
    name: 'Camden Club',
    category: 'luxury',
    capacity: 360,
    type: 'club',
    elevation: 8,
    rows: generateRows(1, 10, 8, 12, 24),
    covered: true
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
      'Private entrance'
    ],
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -20, y: 5, z: 8 },
      { x: 20, y: 5, z: 8 },
      { x: 20, y: 18, z: 12 },
      { x: -20, y: 18, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Flag Court Plaza
  {
    id: 'flag-court-plaza',
    name: 'Flag Court Plaza',
    category: 'standing',
    capacity: 400,
    type: 'standing',
    elevation: 10,
    rows: [],
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
      'Standing room',
      'Flag displays',
      'Food trucks',
      'Social atmosphere'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -50, y: 100, z: 10 },
      { x: 50, y: 100, z: 10 },
      { x: 50, y: 112, z: 10 },
      { x: -50, y: 112, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Boog's BBQ Area
  {
    id: 'boogs-bbq',
    name: "Boog's BBQ Area",
    category: 'special',
    capacity: 200,
    type: 'standing',
    elevation: 8,
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
      'Boog Powell BBQ stand',
      'Standing room',
      'Eutaw Street location',
      'Meet Boog Powell'
    ],
    visibilityRating: 2,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 3,
    vertices3D: [
      { x: 82, y: 65, z: 8 },
      { x: 92, y: 75, z: 8 },
      { x: 92, y: 83, z: 8 },
      { x: 82, y: 73, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Upper Deck - Behind Home
  {
    id: 'upper-deck-home',
    name: 'Upper Deck - Home Plate',
    category: 'value',
    capacity: 720,
    type: 'fixed',
    elevation: 26,
    rows: generateRows(1, 24, 26, 20, 34),
    covered: true
    coveragePercentage: 70,
    coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    sunExposure: {
      morning: 10,
      afternoon: 25,
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
      { x: -35, y: 55, z: 26 },
      { x: 35, y: 55, z: 26 },
      { x: 35, y: 80, z: 35 },
      { x: -35, y: 80, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Left Field Bleachers
  {
    id: 'bleachers-lf',
    name: 'Left Field Bleachers',
    category: 'value',
    capacity: 640,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 20, 6, 18, 30),
    covered: false
    sunExposure: {
      morning: 85,
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
      { x: -95, y: 95, z: 13 },
      { x: -75, y: 75, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Center Field Bleachers
  {
    id: 'bleachers-cf',
    name: 'Center Field Bleachers',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 18, 6, 16, 30),
    covered: false
    sunExposure: {
      morning: 65,
      afternoon: 85,
      evening: 50
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
      { x: -40, y: 122, z: 12 },
      { x: -95, y: 95, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Right Field Bleachers
  {
    id: 'bleachers-rf',
    name: 'Right Field Bleachers',
    category: 'value',
    capacity: 640,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 20, 6, 18, 30),
    covered: false
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
      'Bleacher seating',
      'Warehouse views',
      'Budget friendly'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 40, y: 105, z: 6 },
      { x: 95, y: 75, z: 6 },
      { x: 95, y: 95, z: 13 },
      { x: 40, y: 122, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Terrace Box - First Base
  {
    id: 'terrace-box-1b',
    name: 'Terrace Box - First Base',
    category: 'standard',
    capacity: 480,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 15, 10, 14, 31),
    covered: false
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
      'Standard seats',
      'Cup holders'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: 55, y: 30, z: 10 },
      { x: 75, y: 50, z: 10 },
      { x: 75, y: 68, z: 16 },
      { x: 55, y: 48, z: 16 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Terrace Box - Third Base
  {
    id: 'terrace-box-3b',
    name: 'Terrace Box - Third Base',
    category: 'standard',
    capacity: 480,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 15, 10, 14, 31),
    covered: false
    sunExposure: {
      morning: 75,
      afternoon: 45,
      evening: 30
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Standard seats',
      'Cup holders'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -55, y: 30, z: 10 },
      { x: -75, y: 50, z: 10 },
      { x: -75, y: 68, z: 16 },
      { x: -55, y: 48, z: 16 }
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
    capacity: 440,
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
      { x: -50, y: 50, z: 24 },
      { x: 50, y: 50, z: 24 },
      { x: 50, y: 60, z: 27 },
      { x: -50, y: 60, z: 27 }
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
    capacity: 100,
    type: 'media',
    elevation: 30,
    rows: generateRows(1, 3, 30, 6, 20),
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
      { x: -20, y: 58, z: 30 },
      { x: 20, y: 58, z: 30 },
      { x: 20, y: 65, z: 32 },
      { x: -20, y: 65, z: 32 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Standing Room - Concourse
  {
    id: 'standing-room',
    name: 'Standing Room Only',
    category: 'standing',
    capacity: 600,
    type: 'standing',
    elevation: 14,
    rows: [],
    covered: false
    sunExposure: {
      morning: 45,
      afternoon: 80,
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
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: -70, y: 40, z: 14 },
      { x: 70, y: 40, z: 14 },
      { x: 70, y: 48, z: 14 },
      { x: -70, y: 48, z: 14 }
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
    capacity: 360,
    type: 'fixed',
    elevation: 12,
    rows: generateRows(1, 12, 12, 12, 29),
    covered: false
    sunExposure: {
      morning: 60,
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
      'Oriole Bird visits'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -60, y: 35, z: 12 },
      { x: -40, y: 45, z: 12 },
      { x: -40, y: 58, z: 16 },
      { x: -60, y: 48, z: 16 }
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
    capacity: 150,
    type: 'accessible',
    elevation: 12,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      { row: 'WC', elevation: 12, depth: 6, rakeAngle: 0 }
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
      { x: -65, y: 30, z: 12 },
      { x: 65, y: 30, z: 12 },
      { x: 65, y: 36, z: 12 },
      { x: -65, y: 36, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // The Yard
  {
    id: 'the-yard',
    name: 'The Yard',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      covered: false  }
    ],
    sunExposure: {
      morning: 40,
      afternoon: 60,
      evening: 50
    },
    covered: false
    vertices3D: [
      { x: 100, y: 12, z: 380 },
      { x: 130, y: 12, z: 400 },
      { x: 130, y: 22, z: 410 },
      { x: 100, y: 22, z: 390 }
    ],
    accessibility: 4,
    viewQuality: 3
  }
];

// Stadium configuration
export const camdenYardsConfig = {
  stadiumName: 'Oriole Park at Camden Yards',
  team: 'Baltimore Orioles',
  location: 'Baltimore, Maryland',
  capacity: 45971,
  yearBuilt: 1992,
  orientation: 60, // Northeast facing
  dimensions: {
    leftField: 333,
    leftCenter: 364,
    center: 410,
    rightCenter: 373,
    rightField: 318,
    warehouseDistance: 439
  },
  sunExposureNotes: {
    morning: 'Sun rises over left field, third base side gets early shade',
    afternoon: 'Sun high overhead, maximum exposure in right field and Eutaw Street',
    evening: 'Sun sets behind third base, warehouse provides shade to right field'
  },
  accessibilityFeatures: [
    'Elevator access to all levels',
    'Accessible seating throughout',
    'Accessible parking with shuttle service',
    'Assistive listening devices available',
    'Wide concourses for navigation'
  ]
};
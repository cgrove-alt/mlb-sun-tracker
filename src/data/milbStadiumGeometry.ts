// MiLB Stadium 3D Geometry Data
// Comprehensive geometry for all 120 Minor League Baseball stadiums

import { StadiumDimensions } from './stadiumGeometryDetailed';

// MiLB stadiums typically have simpler geometry than MLB stadiums
// Standard dimensions based on stadium level
const MILB_STANDARD_DIMENSIONS = {
  AAA: {
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 365,
      centerField: 400,
      rightCenter: 365,
      rightFieldLine: 325,
      backstop: 55,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  AA: {
    fieldDimensions: {
      leftFieldLine: 320,
      leftCenter: 360,
      centerField: 395,
      rightCenter: 360,
      rightFieldLine: 320,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      clubLevel: 40,
      upperDeck: 55,
    },
    overhangs: {
      upperDeckOverhang: 20,
      roofOverhang: 0,
      clubLevelOverhang: 8,
    },
  },
  'A+': {
    fieldDimensions: {
      leftFieldLine: 315,
      leftCenter: 355,
      centerField: 390,
      rightCenter: 355,
      rightFieldLine: 315,
      backstop: 45,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      upperDeck: 45,
    },
    overhangs: {
      upperDeckOverhang: 15,
      roofOverhang: 0,
    },
  },
  A: {
    fieldDimensions: {
      leftFieldLine: 310,
      leftCenter: 350,
      centerField: 385,
      rightCenter: 350,
      rightFieldLine: 310,
      backstop: 45,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 18,
      upperDeck: 40,
    },
    overhangs: {
      upperDeckOverhang: 12,
      roofOverhang: 0,
    },
  },
};

// Triple-A Stadium Specific Dimensions
export const MILB_AAA_DIMENSIONS: Record<string, StadiumDimensions> = {
  'buffalo-bisons': {
    stadiumId: 'buffalo-bisons',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 357,
      centerField: 404,
      rightCenter: 367,
      rightFieldLine: 325,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  'charlotte-knights': {
    stadiumId: 'charlotte-knights',
    fieldDimensions: {
      leftFieldLine: 324,
      leftCenter: 370,
      centerField: 400,
      rightCenter: 370,
      rightFieldLine: 315,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 70,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
    uniqueFeatures: [
      {
        name: 'Charlotte Skyline',
        type: 'structure',
        location: { x: 0, y: 400, z: 30 },
        dimensions: { width: 200, height: 40, depth: 10 },
      },
    ],
  },
  
  'columbus-clippers': {
    stadiumId: 'columbus-clippers',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 355,
      centerField: 400,
      rightCenter: 355,
      rightFieldLine: 318,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'durham-bulls': {
    stadiumId: 'durham-bulls',
    fieldDimensions: {
      leftFieldLine: 305,
      leftCenter: 327,
      centerField: 404,
      rightCenter: 327,
      rightFieldLine: 327,
      backstop: 42,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 20,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
    uniqueFeatures: [
      {
        name: 'Blue Monster',
        type: 'wall',
        location: { x: -305, y: 0, z: 0 },
        dimensions: { width: 50, height: 32, depth: 2 },
      },
    ],
  },
  
  'gwinnett-stripers': {
    stadiumId: 'gwinnett-stripers',
    fieldDimensions: {
      leftFieldLine: 335,
      leftCenter: 375,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 335,
      backstop: 54,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'indianapolis-indians': {
    stadiumId: 'indianapolis-indians',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 349,
      centerField: 402,
      rightCenter: 349,
      rightFieldLine: 325,
      backstop: 56,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      clubLevel: 40,
      upperDeck: 55,
    },
    overhangs: {
      upperDeckOverhang: 20,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'iowa-cubs': {
    stadiumId: 'iowa-cubs',
    fieldDimensions: {
      leftFieldLine: 335,
      leftCenter: 368,
      centerField: 400,
      rightCenter: 368,
      rightFieldLine: 335,
      backstop: 55,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 42,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 22,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'jacksonville-jumbo-shrimp': {
    stadiumId: 'jacksonville-jumbo-shrimp',
    fieldDimensions: {
      leftFieldLine: 321,
      leftCenter: 362,
      centerField: 420,
      rightCenter: 382,
      rightFieldLine: 317,
      backstop: 43,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'lehigh-valley-ironpigs': {
    stadiumId: 'lehigh-valley-ironpigs',
    fieldDimensions: {
      leftFieldLine: 334,
      leftCenter: 369,
      centerField: 400,
      rightCenter: 369,
      rightFieldLine: 325,
      backstop: 48,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 28,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  'louisville-bats': {
    stadiumId: 'louisville-bats',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 360,
      centerField: 400,
      rightCenter: 360,
      rightFieldLine: 312,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  // Pacific Coast League
  'albuquerque-isotopes': {
    stadiumId: 'albuquerque-isotopes',
    fieldDimensions: {
      leftFieldLine: 342,
      leftCenter: 366,
      centerField: 400,
      rightCenter: 366,
      rightFieldLine: 340,
      backstop: 48,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'el-paso-chihuahuas': {
    stadiumId: 'el-paso-chihuahuas',
    fieldDimensions: {
      leftFieldLine: 322,
      leftCenter: 365,
      centerField: 400,
      rightCenter: 365,
      rightFieldLine: 325,
      backstop: 48,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 42,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 22,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'las-vegas-aviators': {
    stadiumId: 'las-vegas-aviators',
    fieldDimensions: {
      leftFieldLine: 340,
      leftCenter: 364,
      centerField: 400,
      rightCenter: 364,
      rightFieldLine: 340,
      backstop: 49,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 70,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  'memphis-redbirds': {
    stadiumId: 'memphis-redbirds',
    fieldDimensions: {
      leftFieldLine: 319,
      leftCenter: 360,
      centerField: 400,
      rightCenter: 373,
      rightFieldLine: 322,
      backstop: 48,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'nashville-sounds': {
    stadiumId: 'nashville-sounds',
    fieldDimensions: {
      leftFieldLine: 327,
      leftCenter: 354,
      centerField: 405,
      rightCenter: 354,
      rightFieldLine: 327,
      backstop: 55,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 28,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
    uniqueFeatures: [
      {
        name: 'Guitar Scoreboard',
        type: 'scoreboard',
        location: { x: 0, y: 405, z: 30 },
        dimensions: { width: 60, height: 50, depth: 10 },
      },
    ],
  },
  
  'norfolk-tides': {
    stadiumId: 'norfolk-tides',
    fieldDimensions: {
      leftFieldLine: 333,
      leftCenter: 361,
      centerField: 400,
      rightCenter: 376,
      rightFieldLine: 318,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'oklahoma-city-dodgers': {
    stadiumId: 'oklahoma-city-dodgers',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 375,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 325,
      backstop: 55,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'omaha-storm-chasers': {
    stadiumId: 'omaha-storm-chasers',
    fieldDimensions: {
      leftFieldLine: 310,
      leftCenter: 375,
      centerField: 408,
      rightCenter: 375,
      rightFieldLine: 315,
      backstop: 45,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 42,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 22,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'reno-aces': {
    stadiumId: 'reno-aces',
    fieldDimensions: {
      leftFieldLine: 339,
      leftCenter: 364,
      centerField: 400,
      rightCenter: 364,
      rightFieldLine: 339,
      backstop: 49,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'rochester-red-wings': {
    stadiumId: 'rochester-red-wings',
    fieldDimensions: {
      leftFieldLine: 320,
      leftCenter: 370,
      centerField: 402,
      rightCenter: 370,
      rightFieldLine: 322,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'round-rock-express': {
    stadiumId: 'round-rock-express',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 364,
      centerField: 407,
      rightCenter: 364,
      rightFieldLine: 325,
      backstop: 40,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 28,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  'sacramento-river-cats': {
    stadiumId: 'sacramento-river-cats',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 365,
      centerField: 400,
      rightCenter: 365,
      rightFieldLine: 325,
      backstop: 43,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'salt-lake-bees': {
    stadiumId: 'salt-lake-bees',
    fieldDimensions: {
      leftFieldLine: 342,
      leftCenter: 365,
      centerField: 400,
      rightCenter: 365,
      rightFieldLine: 315,
      backstop: 44,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'scranton-railriders': {
    stadiumId: 'scranton-railriders',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 371,
      centerField: 408,
      rightCenter: 371,
      rightFieldLine: 330,
      backstop: 40,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'sugar-land-space-cowboys': {
    stadiumId: 'sugar-land-space-cowboys',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 364,
      centerField: 400,
      rightCenter: 364,
      rightFieldLine: 310,
      backstop: 40,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 42,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 20,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'syracuse-mets': {
    stadiumId: 'syracuse-mets',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 361,
      centerField: 400,
      rightCenter: 361,
      rightFieldLine: 330,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 25,
      roofOverhang: 0,
      clubLevelOverhang: 12,
    },
  },
  
  'tacoma-rainiers': {
    stadiumId: 'tacoma-rainiers',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 365,
      centerField: 405,
      rightCenter: 367,
      rightFieldLine: 325,
      backstop: 44,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      clubLevel: 40,
      upperDeck: 55,
    },
    overhangs: {
      upperDeckOverhang: 20,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'toledo-mud-hens': {
    stadiumId: 'toledo-mud-hens',
    fieldDimensions: {
      leftFieldLine: 320,
      leftCenter: 365,
      centerField: 408,
      rightCenter: 365,
      rightFieldLine: 315,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 42,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 22,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'worcester-red-sox': {
    stadiumId: 'worcester-red-sox',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 370,
      centerField: 405,
      rightCenter: 370,
      rightFieldLine: 330,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 28,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
};

// Double-A Stadium Dimensions (Eastern & Southern Leagues)
export const MILB_AA_DIMENSIONS: Record<string, StadiumDimensions> = {
  'akron-rubberducks': {
    stadiumId: 'akron-rubberducks',
    fieldDimensions: {
      leftFieldLine: 332,
      leftCenter: 375,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 337,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      clubLevel: 40,
      upperDeck: 55,
    },
    overhangs: {
      upperDeckOverhang: 20,
      roofOverhang: 0,
      clubLevelOverhang: 8,
    },
  },
  
  'altoona-curve': {
    stadiumId: 'altoona-curve',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 360,
      centerField: 405,
      rightCenter: 375,
      rightFieldLine: 320,
      backstop: 45,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      upperDeck: 45,
    },
    overhangs: {
      upperDeckOverhang: 15,
      roofOverhang: 0,
    },
  },
  
  'amarillo-sod-poodles': {
    stadiumId: 'amarillo-sod-poodles',
    fieldDimensions: {
      leftFieldLine: 322,
      leftCenter: 364,
      centerField: 402,
      rightCenter: 364,
      rightFieldLine: 325,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      clubLevel: 38,
      upperDeck: 52,
    },
    overhangs: {
      upperDeckOverhang: 18,
      roofOverhang: 0,
      clubLevelOverhang: 8,
    },
  },
  
  // Add remaining Double-A stadiums with default dimensions
  'arkansas-travelers': {
    stadiumId: 'arkansas-travelers',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'biloxi-shuckers': {
    stadiumId: 'biloxi-shuckers',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'binghamton-rumble-ponies': {
    stadiumId: 'binghamton-rumble-ponies',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'birmingham-barons': {
    stadiumId: 'birmingham-barons',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'bowie-baysox': {
    stadiumId: 'bowie-baysox',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'chattanooga-lookouts': {
    stadiumId: 'chattanooga-lookouts',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'corpus-christi-hooks': {
    stadiumId: 'corpus-christi-hooks',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'erie-seawolves': {
    stadiumId: 'erie-seawolves',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'frisco-roughriders': {
    stadiumId: 'frisco-roughriders',
    fieldDimensions: {
      leftFieldLine: 335,
      leftCenter: 364,
      centerField: 409,
      rightCenter: 364,
      rightFieldLine: 335,
      backstop: 40,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 22,
      clubLevel: 42,
      upperDeck: 60,
    },
    overhangs: {
      upperDeckOverhang: 22,
      roofOverhang: 0,
      clubLevelOverhang: 10,
    },
  },
  
  'harrisburg-senators': {
    stadiumId: 'harrisburg-senators',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'hartford-yard-goats': {
    stadiumId: 'hartford-yard-goats',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'midland-rockhounds': {
    stadiumId: 'midland-rockhounds',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'mississippi-braves': {
    stadiumId: 'mississippi-braves',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'montgomery-biscuits': {
    stadiumId: 'montgomery-biscuits',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'new-hampshire-fisher-cats': {
    stadiumId: 'new-hampshire-fisher-cats',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'northwest-arkansas-naturals': {
    stadiumId: 'northwest-arkansas-naturals',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'pensacola-blue-wahoos': {
    stadiumId: 'pensacola-blue-wahoos',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'portland-sea-dogs': {
    stadiumId: 'portland-sea-dogs',
    fieldDimensions: {
      leftFieldLine: 315,
      leftCenter: 360,
      centerField: 400,
      rightCenter: 360,
      rightFieldLine: 330,
      backstop: 33,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      upperDeck: 40,
    },
    overhangs: {
      upperDeckOverhang: 15,
      roofOverhang: 0,
    },
    uniqueFeatures: [
      {
        name: 'Maine Monster',
        type: 'wall',
        location: { x: -315, y: 0, z: 0 },
        dimensions: { width: 60, height: 37, depth: 2 },
      },
    ],
  },
  
  'reading-fightin-phils': {
    stadiumId: 'reading-fightin-phils',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'richmond-flying-squirrels': {
    stadiumId: 'richmond-flying-squirrels',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'rocket-city-trash-pandas': {
    stadiumId: 'rocket-city-trash-pandas',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'san-antonio-missions': {
    stadiumId: 'san-antonio-missions',
    fieldDimensions: {
      leftFieldLine: 310,
      leftCenter: 373,
      centerField: 402,
      rightCenter: 373,
      rightFieldLine: 340,
      backstop: 35,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      clubLevel: 38,
      upperDeck: 52,
    },
    overhangs: {
      upperDeckOverhang: 18,
      roofOverhang: 0,
      clubLevelOverhang: 8,
    },
  },
  
  'somerset-patriots': {
    stadiumId: 'somerset-patriots',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'springfield-cardinals': {
    stadiumId: 'springfield-cardinals',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'tennessee-smokies': {
    stadiumId: 'tennessee-smokies',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'tulsa-drillers': {
    stadiumId: 'tulsa-drillers',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
  
  'wichita-wind-surge': {
    stadiumId: 'wichita-wind-surge',
    ...MILB_STANDARD_DIMENSIONS.AA,
  },
};

// High-A and Single-A Stadium Dimensions
export const MILB_A_DIMENSIONS: Record<string, StadiumDimensions> = {
  // High-A Stadiums
  'aberdeen-ironbirds': {
    stadiumId: 'aberdeen-ironbirds',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'asheville-tourists': {
    stadiumId: 'asheville-tourists',
    fieldDimensions: {
      leftFieldLine: 326,
      leftCenter: 370,
      centerField: 402,
      rightCenter: 373,
      rightFieldLine: 297,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      upperDeck: 40,
    },
    overhangs: {
      upperDeckOverhang: 12,
      roofOverhang: 0,
    },
  },
  
  'beloit-sky-carp': {
    stadiumId: 'beloit-sky-carp',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'bowling-green-hot-rods': {
    stadiumId: 'bowling-green-hot-rods',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'brooklyn-cyclones': {
    stadiumId: 'brooklyn-cyclones',
    fieldDimensions: {
      leftFieldLine: 315,
      leftCenter: 365,
      centerField: 383,
      rightCenter: 371,
      rightFieldLine: 302,
      backstop: 45,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      upperDeck: 45,
    },
    overhangs: {
      upperDeckOverhang: 15,
      roofOverhang: 0,
    },
  },
  
  'cedar-rapids-kernels': {
    stadiumId: 'cedar-rapids-kernels',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'dayton-dragons': {
    stadiumId: 'dayton-dragons',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'daytona-tortugas': {
    stadiumId: 'daytona-tortugas',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'eugene-emeralds': {
    stadiumId: 'eugene-emeralds',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'everett-aquasox': {
    stadiumId: 'everett-aquasox',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'fort-myers-mighty-mussels': {
    stadiumId: 'fort-myers-mighty-mussels',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'fort-wayne-tincaps': {
    stadiumId: 'fort-wayne-tincaps',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'great-lakes-loons': {
    stadiumId: 'great-lakes-loons',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'greensboro-grasshoppers': {
    stadiumId: 'greensboro-grasshoppers',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'greenville-drive': {
    stadiumId: 'greenville-drive',
    fieldDimensions: {
      leftFieldLine: 310,
      leftCenter: 350,
      centerField: 400,
      rightCenter: 350,
      rightFieldLine: 302,
      backstop: 40,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 18,
      upperDeck: 35,
    },
    overhangs: {
      upperDeckOverhang: 10,
      roofOverhang: 0,
    },
    uniqueFeatures: [
      {
        name: 'Green Monster Jr.',
        type: 'wall',
        location: { x: -310, y: 0, z: 0 },
        dimensions: { width: 50, height: 30, depth: 2 },
      },
    ],
  },
  
  'hickory-crawdads': {
    stadiumId: 'hickory-crawdads',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'hillsboro-hops': {
    stadiumId: 'hillsboro-hops',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'hudson-valley-renegades': {
    stadiumId: 'hudson-valley-renegades',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'jersey-shore-blueclaws': {
    stadiumId: 'jersey-shore-blueclaws',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'lake-county-captains': {
    stadiumId: 'lake-county-captains',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'lansing-lugnuts': {
    stadiumId: 'lansing-lugnuts',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'peoria-chiefs': {
    stadiumId: 'peoria-chiefs',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'quad-cities-river-bandits': {
    stadiumId: 'quad-cities-river-bandits',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'rome-braves': {
    stadiumId: 'rome-braves',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'south-bend-cubs': {
    stadiumId: 'south-bend-cubs',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'spokane-indians': {
    stadiumId: 'spokane-indians',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'vancouver-canadians': {
    stadiumId: 'vancouver-canadians',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'west-michigan-whitecaps': {
    stadiumId: 'west-michigan-whitecaps',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'wilmington-blue-rocks': {
    stadiumId: 'wilmington-blue-rocks',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'winston-salem-dash': {
    stadiumId: 'winston-salem-dash',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  'wisconsin-timber-rattlers': {
    stadiumId: 'wisconsin-timber-rattlers',
    ...MILB_STANDARD_DIMENSIONS['A+'],
  },
  
  // Single-A Stadiums
  'augusta-greenjackets': {
    stadiumId: 'augusta-greenjackets',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'bradenton-marauders': {
    stadiumId: 'bradenton-marauders',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'carolina-mudcats': {
    stadiumId: 'carolina-mudcats',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'charleston-riverdogs': {
    stadiumId: 'charleston-riverdogs',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'clearwater-threshers': {
    stadiumId: 'clearwater-threshers',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'columbia-fireflies': {
    stadiumId: 'columbia-fireflies',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'delmarva-shorebirds': {
    stadiumId: 'delmarva-shorebirds',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'down-east-wood-ducks': {
    stadiumId: 'down-east-wood-ducks',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'dunedin-blue-jays': {
    stadiumId: 'dunedin-blue-jays',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'fayetteville-woodpeckers': {
    stadiumId: 'fayetteville-woodpeckers',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'fredericksburg-nationals': {
    stadiumId: 'fredericksburg-nationals',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'fresno-grizzlies': {
    stadiumId: 'fresno-grizzlies',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'inland-empire-66ers': {
    stadiumId: 'inland-empire-66ers',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'jupiter-hammerheads': {
    stadiumId: 'jupiter-hammerheads',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'kannapolis-cannon-ballers': {
    stadiumId: 'kannapolis-cannon-ballers',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'lake-elsinore-storm': {
    stadiumId: 'lake-elsinore-storm',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'lakeland-flying-tigers': {
    stadiumId: 'lakeland-flying-tigers',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'lynchburg-hillcats': {
    stadiumId: 'lynchburg-hillcats',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'modesto-nuts': {
    stadiumId: 'modesto-nuts',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'myrtle-beach-pelicans': {
    stadiumId: 'myrtle-beach-pelicans',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'palm-beach-cardinals': {
    stadiumId: 'palm-beach-cardinals',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'rancho-cucamonga-quakes': {
    stadiumId: 'rancho-cucamonga-quakes',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'salem-red-sox': {
    stadiumId: 'salem-red-sox',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'san-jose-giants': {
    stadiumId: 'san-jose-giants',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'st-lucie-mets': {
    stadiumId: 'st-lucie-mets',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'st-paul-saints': {
    stadiumId: 'st-paul-saints',
    fieldDimensions: {
      leftFieldLine: 320,
      leftCenter: 350,
      centerField: 395,
      rightCenter: 350,
      rightFieldLine: 320,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 20,
      upperDeck: 40,
    },
    overhangs: {
      upperDeckOverhang: 15,
      roofOverhang: 0,
    },
  },
  
  'stockton-ports': {
    stadiumId: 'stockton-ports',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'tampa-tarpons': {
    stadiumId: 'tampa-tarpons',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'tri-city-dust-devils': {
    stadiumId: 'tri-city-dust-devils',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
  
  'visalia-rawhide': {
    stadiumId: 'visalia-rawhide',
    ...MILB_STANDARD_DIMENSIONS.A,
  },
};

// Combined MiLB dimensions lookup
export const MILB_STADIUM_DIMENSIONS: Record<string, StadiumDimensions> = {
  ...MILB_AAA_DIMENSIONS,
  ...MILB_AA_DIMENSIONS,
  ...MILB_A_DIMENSIONS,
};

// Helper function to get MiLB stadium dimensions
export function getMiLBStadiumDimensions(stadiumId: string): StadiumDimensions | null {
  return MILB_STADIUM_DIMENSIONS[stadiumId] || null;
}

// Get dimensions with fallback to standard based on level
export function getMiLBDimensionsWithFallback(stadiumId: string, level: string): StadiumDimensions {
  // Try to get specific dimensions
  const specific = getMiLBStadiumDimensions(stadiumId);
  if (specific) return specific;
  
  // Fall back to standard dimensions based on level
  let standardLevel: 'AAA' | 'AA' | 'A+' | 'A' = 'A';
  if (level === 'AAA') standardLevel = 'AAA';
  else if (level === 'AA') standardLevel = 'AA';
  else if (level === 'A+') standardLevel = 'A+';
  
  return {
    stadiumId,
    ...MILB_STANDARD_DIMENSIONS[standardLevel],
  };
}
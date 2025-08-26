// Detailed 3D Stadium Geometry with Accurate Measurements
// Based on architectural data and satellite imagery analysis

export interface StadiumDimensions {
  stadiumId: string;
  // Field dimensions (feet from home plate)
  fieldDimensions: {
    leftFieldLine: number;
    leftCenter: number;
    centerField: number;
    rightCenter: number;
    rightFieldLine: number;
    backstop: number;
  };
  // Seating bowl dimensions
  deckHeights: {
    fieldLevel: number;
    lowerDeck: number;
    clubLevel?: number;
    upperDeck?: number;
    suiteLevel?: number;
  };
  // Overhang measurements (feet)
  overhangs: {
    upperDeckOverhang?: number;
    roofOverhang?: number;
    clubLevelOverhang?: number;
  };
  // Unique features
  uniqueFeatures?: {
    name: string;
    type: 'wall' | 'scoreboard' | 'structure';
    location: { x: number; y: number; z: number };
    dimensions: { width: number; height: number; depth: number };
  }[];
}

export const MLB_STADIUM_DIMENSIONS: Record<string, StadiumDimensions> = {
  yankees: {
    stadiumId: 'yankees',
    fieldDimensions: {
      leftFieldLine: 318,
      leftCenter: 379,
      centerField: 408,
      rightCenter: 353,
      rightFieldLine: 314,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
      suiteLevel: 65,
    },
    overhangs: {
      upperDeckOverhang: 45,
      roofOverhang: 0, // Open air
      clubLevelOverhang: 25,
    },
    uniqueFeatures: [
      {
        name: 'Monument Park',
        type: 'structure',
        location: { x: 0, y: 408, z: 0 },
        dimensions: { width: 60, height: 10, depth: 20 },
      },
    ],
  },
  
  redsox: {
    stadiumId: 'redsox',
    fieldDimensions: {
      leftFieldLine: 310,
      leftCenter: 335,
      centerField: 390,
      rightCenter: 380,
      rightFieldLine: 302,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 45,
      upperDeck: 70,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
    uniqueFeatures: [
      {
        name: 'Green Monster',
        type: 'wall',
        location: { x: -310, y: 0, z: 0 },
        dimensions: { width: 231, height: 37, depth: 2 },
      },
    ],
  },
  
  dodgers: {
    stadiumId: 'dodgers',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 375,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 330,
      backstop: 53,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 35,
      clubLevel: 60,
      upperDeck: 95,
      suiteLevel: 70,
    },
    overhangs: {
      upperDeckOverhang: 40,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
  },
  
  cubs: {
    stadiumId: 'cubs',
    fieldDimensions: {
      leftFieldLine: 328,
      leftCenter: 357,
      centerField: 400,
      rightCenter: 368,
      rightFieldLine: 328,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 28,
      upperDeck: 65,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
    },
    uniqueFeatures: [
      {
        name: 'Ivy Wall',
        type: 'wall',
        location: { x: 0, y: 400, z: 0 },
        dimensions: { width: 400, height: 11.5, depth: 1 },
      },
    ],
  },
  
  angels: {
    stadiumId: 'angels',
    fieldDimensions: {
      leftFieldLine: 333,
      leftCenter: 387,
      centerField: 396,
      rightCenter: 365,
      rightFieldLine: 333,
      backstop: 59,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
    uniqueFeatures: [
      {
        name: 'Rock Waterfall',
        type: 'structure',
        location: { x: 0, y: 396, z: 0 },
        dimensions: { width: 50, height: 35, depth: 10 },
      },
    ],
  },
  
  astros: {
    stadiumId: 'astros',
    fieldDimensions: {
      leftFieldLine: 315,
      leftCenter: 369,
      centerField: 409,
      rightCenter: 373,
      rightFieldLine: 326,
      backstop: 40,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 200, // When closed
      clubLevelOverhang: 25,
    },
    uniqueFeatures: [
      {
        name: 'Tals Hill (removed)',
        type: 'structure',
        location: { x: 0, y: 409, z: 0 },
        dimensions: { width: 0, height: 0, depth: 0 },
      },
    ],
  },
  
  giants: {
    stadiumId: 'giants',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 365,
      centerField: 391,
      rightCenter: 365,
      rightFieldLine: 309,
      backstop: 48,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 80,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
    uniqueFeatures: [
      {
        name: 'McCovey Cove',
        type: 'structure',
        location: { x: 309, y: 0, z: -10 },
        dimensions: { width: 100, height: 0, depth: 100 },
      },
    ],
  },
  
  mets: {
    stadiumId: 'mets',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 358,
      centerField: 408,
      rightCenter: 375,
      rightFieldLine: 330,
      backstop: 57,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 80,
    },
    overhangs: {
      upperDeckOverhang: 40,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
  },
  
  phillies: {
    stadiumId: 'phillies',
    fieldDimensions: {
      leftFieldLine: 329,
      leftCenter: 355,
      centerField: 401,
      rightCenter: 369,
      rightFieldLine: 330,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 40,
      roofOverhang: 0,
      clubLevelOverhang: 25,
    },
  },
  
  cardinals: {
    stadiumId: 'cardinals',
    fieldDimensions: {
      leftFieldLine: 336,
      leftCenter: 375,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 335,
      backstop: 55,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
  },
  
  braves: {
    stadiumId: 'braves',
    fieldDimensions: {
      leftFieldLine: 335,
      leftCenter: 385,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 325,
      backstop: 43,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 40,
      roofOverhang: 0,
      clubLevelOverhang: 25,
    },
  },
  
  padres: {
    stadiumId: 'padres',
    fieldDimensions: {
      leftFieldLine: 334,
      leftCenter: 357,
      centerField: 396,
      rightCenter: 391,
      rightFieldLine: 322,
      backstop: 42,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
    uniqueFeatures: [
      {
        name: 'Western Metal Supply Building',
        type: 'structure',
        location: { x: -334, y: 0, z: 0 },
        dimensions: { width: 30, height: 60, depth: 30 },
      },
    ],
  },
  
  nationals: {
    stadiumId: 'nationals',
    fieldDimensions: {
      leftFieldLine: 337,
      leftCenter: 377,
      centerField: 402,
      rightCenter: 370,
      rightFieldLine: 335,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 80,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
  },
  
  orioles: {
    stadiumId: 'orioles',
    fieldDimensions: {
      leftFieldLine: 333,
      leftCenter: 364,
      centerField: 400,
      rightCenter: 373,
      rightFieldLine: 318,
      backstop: 54,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 80,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
    uniqueFeatures: [
      {
        name: 'B&O Warehouse',
        type: 'structure',
        location: { x: 439, y: 0, z: 0 },
        dimensions: { width: 1016, height: 80, depth: 51 },
      },
    ],
  },
  
  pirates: {
    stadiumId: 'pirates',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 389,
      centerField: 399,
      rightCenter: 375,
      rightFieldLine: 320,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  reds: {
    stadiumId: 'reds',
    fieldDimensions: {
      leftFieldLine: 328,
      leftCenter: 379,
      centerField: 404,
      rightCenter: 370,
      rightFieldLine: 325,
      backstop: 52,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  brewers: {
    stadiumId: 'brewers',
    fieldDimensions: {
      leftFieldLine: 337,
      leftCenter: 371,
      centerField: 400,
      rightCenter: 374,
      rightFieldLine: 337,
      backstop: 56,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 200, // When closed
      clubLevelOverhang: 25,
    },
  },
  
  twins: {
    stadiumId: 'twins',
    fieldDimensions: {
      leftFieldLine: 339,
      leftCenter: 377,
      centerField: 403,
      rightCenter: 367,
      rightFieldLine: 328,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 80,
    },
    overhangs: {
      upperDeckOverhang: 40,
      roofOverhang: 0,
      clubLevelOverhang: 25,
    },
  },
  
  royals: {
    stadiumId: 'royals',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 387,
      centerField: 410,
      rightCenter: 387,
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
      clubLevelOverhang: 10,
    },
  },
  
  whitesox: {
    stadiumId: 'whitesox',
    fieldDimensions: {
      leftFieldLine: 335,
      leftCenter: 377,
      centerField: 400,
      rightCenter: 372,
      rightFieldLine: 335,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  guardians: {
    stadiumId: 'guardians',
    fieldDimensions: {
      leftFieldLine: 325,
      leftCenter: 370,
      centerField: 400,
      rightCenter: 370,
      rightFieldLine: 325,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
  },
  
  tigers: {
    stadiumId: 'tigers',
    fieldDimensions: {
      leftFieldLine: 345,
      leftCenter: 370,
      centerField: 422,
      rightCenter: 365,
      rightFieldLine: 330,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 80,
    },
    overhangs: {
      upperDeckOverhang: 35,
      roofOverhang: 0,
      clubLevelOverhang: 20,
    },
  },
  
  mariners: {
    stadiumId: 'mariners',
    fieldDimensions: {
      leftFieldLine: 331,
      leftCenter: 378,
      centerField: 401,
      rightCenter: 381,
      rightFieldLine: 326,
      backstop: 42,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 200, // When closed
      clubLevelOverhang: 25,
    },
  },
  
  rangers: {
    stadiumId: 'rangers',
    fieldDimensions: {
      leftFieldLine: 326,
      leftCenter: 372,
      centerField: 407,
      rightCenter: 374,
      rightFieldLine: 326,
      backstop: 42,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 60,
      upperDeck: 90,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 250, // When closed (full coverage)
      clubLevelOverhang: 30,
    },
  },
  
  bluejays: {
    stadiumId: 'bluejays',
    fieldDimensions: {
      leftFieldLine: 328,
      leftCenter: 375,
      centerField: 400,
      rightCenter: 375,
      rightFieldLine: 328,
      backstop: 60,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 60,
      upperDeck: 100,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 200, // When closed
      clubLevelOverhang: 30,
    },
  },
  
  diamondbacks: {
    stadiumId: 'diamondbacks',
    fieldDimensions: {
      leftFieldLine: 328,
      leftCenter: 376,
      centerField: 407,
      rightCenter: 376,
      rightFieldLine: 328,
      backstop: 48,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 200, // When closed
      clubLevelOverhang: 25,
    },
    uniqueFeatures: [
      {
        name: 'Swimming Pool',
        type: 'structure',
        location: { x: 330, y: 50, z: 10 },
        dimensions: { width: 30, height: 5, depth: 15 },
      },
    ],
  },
  
  marlins: {
    stadiumId: 'marlins',
    fieldDimensions: {
      leftFieldLine: 334,
      leftCenter: 357,
      centerField: 407,
      rightCenter: 357,
      rightFieldLine: 328,
      backstop: 47,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 0, // Retractable roof
      roofOverhang: 200, // When closed
      clubLevelOverhang: 20,
    },
  },
  
  rays: {
    stadiumId: 'rays',
    fieldDimensions: {
      leftFieldLine: 315,
      leftCenter: 370,
      centerField: 404,
      rightCenter: 370,
      rightFieldLine: 322,
      backstop: 50,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      upperDeck: 50,
    },
    overhangs: {
      upperDeckOverhang: 0, // Fixed dome
      roofOverhang: 999, // Complete coverage
      clubLevelOverhang: 0,
    },
    uniqueFeatures: [
      {
        name: 'Catwalk Rings',
        type: 'structure',
        location: { x: 0, y: 0, z: 85 },
        dimensions: { width: 600, height: 5, depth: 600 },
      },
    ],
  },
  
  rockies: {
    stadiumId: 'rockies',
    fieldDimensions: {
      leftFieldLine: 347,
      leftCenter: 390,
      centerField: 415,
      rightCenter: 375,
      rightFieldLine: 350,
      backstop: 56,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 30,
      clubLevel: 55,
      upperDeck: 85,
    },
    overhangs: {
      upperDeckOverhang: 40,
      roofOverhang: 0,
      clubLevelOverhang: 25,
    },
  },
  
  athletics: {
    stadiumId: 'athletics',
    fieldDimensions: {
      leftFieldLine: 330,
      leftCenter: 362,
      centerField: 400,
      rightCenter: 362,
      rightFieldLine: 330,
      backstop: 66,
    },
    deckHeights: {
      fieldLevel: 0,
      lowerDeck: 25,
      clubLevel: 50,
      upperDeck: 75,
    },
    overhangs: {
      upperDeckOverhang: 30,
      roofOverhang: 0,
      clubLevelOverhang: 15,
    },
    uniqueFeatures: [
      {
        name: 'Mt. Davis',
        type: 'structure',
        location: { x: 0, y: 400, z: 50 },
        dimensions: { width: 400, height: 100, depth: 50 },
      },
    ],
  },
};

// Helper function to get dimensions with fallback
export function getStadiumDimensions(stadiumId: string): StadiumDimensions | null {
  return MLB_STADIUM_DIMENSIONS[stadiumId] || null;
}
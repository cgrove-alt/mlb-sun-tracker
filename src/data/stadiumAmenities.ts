export interface StadiumAmenity {
  id: string;
  name: string;
  type: 'concession' | 'restroom' | 'first_aid' | 'sunscreen_kiosk' | 'atm' | 'souvenir' | 'family_area' | 'nursing_station';
  level: 'concourse' | 'field' | 'upper' | 'club' | 'suite' | 'exterior';
  // Location relative to stadium (angle from home plate, distance from center)
  location: {
    angle: number; // 0-360 degrees from home plate
    distance: number; // relative distance from center (0-1)
    section?: string; // nearest section identifier
  };
  // Operational details
  operational: {
    opensBeforeGame: number; // minutes before first pitch
    closesAfterGame: number; // minutes after last pitch
    staffed: boolean; // true if staffed location
  };
  // Amenity-specific details
  details: {
    // For concessions
    foodType?: 'hot_food' | 'snacks' | 'beverages' | 'alcohol' | 'dessert' | 'healthy';
    kidFriendly?: boolean;
    dietary?: ('vegetarian' | 'vegan' | 'gluten_free' | 'halal' | 'kosher')[];
    priceRange?: 'budget' | 'moderate' | 'premium';
    
    // For restrooms
    familyRestroom?: boolean;
    changingStation?: boolean;
    accessibility?: boolean;
    
    // For first aid
    emergencyEquipment?: boolean;
    aed?: boolean; // Automated External Defibrillator
    
    // For sunscreen kiosks
    sunscreenType?: 'dispenser' | 'sample_packets' | 'purchase';
    spf?: number;
    playSimSmartPartner?: boolean;
    
    // For family areas
    playArea?: boolean;
    nursing?: boolean;
    strollerStorage?: boolean;
  };
}

export interface StadiumAmenities {
  stadiumId: string;
  amenities: StadiumAmenity[];
  // Special family-friendly features
  familyFeatures: {
    familyRestrooms: number;
    nursingStations: number;
    playAreas: number;
    sunscreenKiosks: number;
  };
}

// Helper function to calculate proximity between amenities and seating sections
export function calculateProximity(
  amenityLocation: { angle: number; distance: number },
  sectionLocation: { angle: number; distance: number }
): number {
  // Calculate angular distance (accounting for circular nature)
  const angularDiff = Math.min(
    Math.abs(amenityLocation.angle - sectionLocation.angle),
    360 - Math.abs(amenityLocation.angle - sectionLocation.angle)
  );
  
  // Calculate radial distance
  const radialDiff = Math.abs(amenityLocation.distance - sectionLocation.distance);
  
  // Combine angular and radial distances (normalized to 0-1)
  const proximity = Math.sqrt(
    Math.pow(angularDiff / 180, 2) + Math.pow(radialDiff, 2)
  );
  
  return Math.max(0, 1 - proximity); // Higher value = closer proximity
}

// Real amenities data for MLB stadiums
export const STADIUM_AMENITIES: StadiumAmenities[] = [
  {
    stadiumId: 'yankees',
    amenities: [
      // Concessions
      {
        id: 'yankees_nathans',
        name: "Nathan's Famous Hot Dogs",
        type: 'concession',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: '115' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'moderate'
        }
      },
      {
        id: 'yankees_lobels',
        name: "Lobel's Steak Sandwich",
        type: 'concession',
        level: 'field',
        location: { angle: 270, distance: 0.6, section: '134' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'premium'
        }
      },
      {
        id: 'yankees_bronx_pale_ale',
        name: 'Bronx Brewery Beer Stand',
        type: 'concession',
        level: 'concourse',
        location: { angle: 180, distance: 0.8, section: '203' },
        operational: { opensBeforeGame: 60, closesAfterGame: 0, staffed: true },
        details: {
          foodType: 'alcohol',
          priceRange: 'premium'
        }
      },
      {
        id: 'yankees_garlic_fries',
        name: 'Garlic Fries Stand',
        type: 'concession',
        level: 'upper',
        location: { angle: 45, distance: 0.9, section: '420' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'snacks',
          kidFriendly: true,
          dietary: ['vegetarian'],
          priceRange: 'moderate'
        }
      },
      // Team Store
      {
        id: 'yankees_team_store_main',
        name: 'Yankees Team Store - Main',
        type: 'souvenir',
        level: 'exterior',
        location: { angle: 0, distance: 1.0, section: 'Gate 6' },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      {
        id: 'yankees_team_store_concourse',
        name: 'Yankees Clubhouse Shop',
        type: 'souvenir',
        level: 'concourse',
        location: { angle: 180, distance: 0.7, section: '229' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      // Sunscreen Stations
      {
        id: 'yankees_sunscreen_1',
        name: 'Play Sun Smart Station - Field Level',
        type: 'sunscreen_kiosk',
        level: 'field',
        location: { angle: 90, distance: 0.6, section: '110' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      {
        id: 'yankees_sunscreen_2',
        name: 'Play Sun Smart Station - Upper Deck',
        type: 'sunscreen_kiosk',
        level: 'upper',
        location: { angle: 270, distance: 0.9, section: '427' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      // Family Facilities
      {
        id: 'yankees_family_restroom_1',
        name: 'Family Restroom - Section 115',
        type: 'restroom',
        level: 'field',
        location: { angle: 90, distance: 0.7, section: '115' },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          familyRestroom: true,
          changingStation: true,
          accessibility: true
        }
      },
      {
        id: 'yankees_nursing_1',
        name: 'Nursing Suite',
        type: 'nursing_station',
        level: 'concourse',
        location: { angle: 180, distance: 0.8, section: '214' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          nursing: true
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 6,
      nursingStations: 2,
      playAreas: 1,
      sunscreenKiosks: 4
    }
  },
  {
    stadiumId: 'redsox',
    amenities: [
      // Concessions
      {
        id: 'redsox_fenway_franks',
        name: 'Fenway Franks',
        type: 'concession',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: 'Grandstand 12' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'moderate'
        }
      },
      {
        id: 'redsox_wicked_good_sausages',
        name: 'Wicked Good Sausages',
        type: 'concession',
        level: 'concourse',
        location: { angle: 180, distance: 0.8, section: 'Gate D' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'moderate'
        }
      },
      {
        id: 'redsox_lobster_roll',
        name: 'New England Lobster Rolls',
        type: 'concession',
        level: 'field',
        location: { angle: 270, distance: 0.6, section: 'Field Box 70' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'premium'
        }
      },
      {
        id: 'redsox_sammy_adams',
        name: 'Sam Adams Brewhouse',
        type: 'concession',
        level: 'concourse',
        location: { angle: 45, distance: 0.7, section: 'Bleachers' },
        operational: { opensBeforeGame: 60, closesAfterGame: 0, staffed: true },
        details: {
          foodType: 'alcohol',
          priceRange: 'premium'
        }
      },
      // Team Store
      {
        id: 'redsox_team_store_yawkey',
        name: 'Red Sox Team Store - Yawkey Way',
        type: 'souvenir',
        level: 'exterior',
        location: { angle: 0, distance: 1.0, section: 'Yawkey Way' },
        operational: { opensBeforeGame: 180, closesAfterGame: 60, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      // Green Monster specific
      {
        id: 'redsox_monster_dogs',
        name: 'Monster Dogs',
        type: 'concession',
        level: 'upper',
        location: { angle: 135, distance: 0.5, section: 'Green Monster' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'premium'
        }
      },
      // Sunscreen Stations
      {
        id: 'redsox_sunscreen_1',
        name: 'Play Sun Smart Station - Bleachers',
        type: 'sunscreen_kiosk',
        level: 'upper',
        location: { angle: 180, distance: 0.9, section: 'Bleachers' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 4,
      nursingStations: 2,
      playAreas: 0,
      sunscreenKiosks: 3
    }
  },
  {
    stadiumId: 'dodgers',
    amenities: [
      // Concessions
      {
        id: 'dodgers_dodger_dog',
        name: 'Original Dodger Dog Stand',
        type: 'concession',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: 'Field 50' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'moderate'
        }
      },
      {
        id: 'dodgers_mexican_food',
        name: 'Elote Man Mexican Food',
        type: 'concession',
        level: 'concourse',
        location: { angle: 180, distance: 0.8, section: 'Reserve 1' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          dietary: ['vegetarian'],
          priceRange: 'moderate'
        }
      },
      {
        id: 'dodgers_think_blue_bbq',
        name: 'Think Blue BBQ',
        type: 'concession',
        level: 'field',
        location: { angle: 270, distance: 0.6, section: 'Field 45' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'premium'
        }
      },
      {
        id: 'dodgers_cpk',
        name: 'California Pizza Kitchen',
        type: 'concession',
        level: 'club',
        location: { angle: 0, distance: 0.5, section: 'Club Level' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          dietary: ['vegetarian'],
          priceRange: 'premium'
        }
      },
      // Team Store
      {
        id: 'dodgers_team_store_main',
        name: 'Dodgers Team Store - Top Deck',
        type: 'souvenir',
        level: 'upper',
        location: { angle: 0, distance: 0.9, section: 'Top Deck' },
        operational: { opensBeforeGame: 120, closesAfterGame: 45, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      // Sunscreen Stations
      {
        id: 'dodgers_sunscreen_1',
        name: 'Play Sun Smart Station - Pavilion',
        type: 'sunscreen_kiosk',
        level: 'concourse',
        location: { angle: 180, distance: 0.5, section: 'Pavilion' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      {
        id: 'dodgers_sunscreen_2',
        name: 'Play Sun Smart Station - Reserve',
        type: 'sunscreen_kiosk',
        level: 'upper',
        location: { angle: 90, distance: 0.8, section: 'Reserve 20' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      // Family Facilities
      {
        id: 'dodgers_family_area',
        name: 'Coca-Cola All You Can Eat Pavilion',
        type: 'family_area',
        level: 'concourse',
        location: { angle: 180, distance: 0.7, section: 'Pavilion' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          kidFriendly: true,
          foodType: 'hot_food',
          priceRange: 'moderate'
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 6,
      nursingStations: 3,
      playAreas: 2,
      sunscreenKiosks: 4
    }
  },
  {
    stadiumId: 'angels',
    amenities: [
      // Concessions
      {
        id: 'angels_helmet_nachos',
        name: 'Helmet Nachos Stand',
        type: 'concession',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: '130' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'moderate'
        }
      },
      {
        id: 'angels_chronic_tacos',
        name: 'Chronic Tacos',
        type: 'concession',
        level: 'field',
        location: { angle: 270, distance: 0.6, section: '108' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          dietary: ['vegetarian'],
          priceRange: 'moderate'
        }
      },
      {
        id: 'angels_ruby_bbq',
        name: "Ruby's BBQ",
        type: 'concession',
        level: 'concourse',
        location: { angle: 180, distance: 0.8, section: '230' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'premium'
        }
      },
      // Team Store
      {
        id: 'angels_team_store_main',
        name: 'Angels Team Store',
        type: 'souvenir',
        level: 'exterior',
        location: { angle: 0, distance: 1.0, section: 'Home Plate Gate' },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      // Sunscreen Stations
      {
        id: 'angels_sunscreen_1',
        name: 'Play Sun Smart Station - Right Field',
        type: 'sunscreen_kiosk',
        level: 'concourse',
        location: { angle: 45, distance: 0.7, section: '104' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      {
        id: 'angels_sunscreen_2',
        name: 'Play Sun Smart Station - Left Field',
        type: 'sunscreen_kiosk',
        level: 'concourse',
        location: { angle: 135, distance: 0.7, section: '133' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      // Family Facilities
      {
        id: 'angels_family_restroom_1',
        name: 'Family Restroom - Section 130',
        type: 'restroom',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: '130' },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          familyRestroom: true,
          changingStation: true,
          accessibility: true
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 4,
      nursingStations: 2,
      playAreas: 1,
      sunscreenKiosks: 3
    }
  },
  {
    stadiumId: 'dodgers',
    amenities: [
      {
        id: 'dodger_sunscreen_1',
        name: 'Play Sun Smart Station - Pavilion',
        type: 'sunscreen_kiosk',
        level: 'concourse',
        location: { angle: 180, distance: 0.5 },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      {
        id: 'dodger_family_area_1',
        name: 'Blue Heaven Family Area',
        type: 'family_area',
        level: 'concourse',
        location: { angle: 270, distance: 0.7 },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          playArea: true,
          nursing: true,
          strollerStorage: true
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 6,
      nursingStations: 3,
      playAreas: 2,
      sunscreenKiosks: 4
    }
  },
  {
    stadiumId: 'padres',
    amenities: [
      // Concessions
      {
        id: 'padres_hodads',
        name: "Hodad's Burgers",
        type: 'concession',
        level: 'field',
        location: { angle: 90, distance: 0.6, section: '105' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'premium'
        }
      },
      {
        id: 'padres_brisket_nachos',
        name: 'Tri-Tip Nachos',
        type: 'concession',
        level: 'concourse',
        location: { angle: 180, distance: 0.7, section: '228' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'premium'
        }
      },
      {
        id: 'padres_fish_tacos',
        name: 'Rubio\'s Fish Tacos',
        type: 'concession',
        level: 'field',
        location: { angle: 270, distance: 0.6, section: '131' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          dietary: ['gluten_free'],
          priceRange: 'moderate'
        }
      },
      // Team Store
      {
        id: 'padres_team_store_main',
        name: 'Padres Team Store - Gaslamp Gate',
        type: 'souvenir',
        level: 'exterior',
        location: { angle: 0, distance: 1.0, section: 'Gaslamp Gate' },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      // Park at the Park
      {
        id: 'padres_park_concession',
        name: 'Park at the Park Concessions',
        type: 'concession',
        level: 'field',
        location: { angle: 180, distance: 0.9, section: 'Park' },
        operational: { opensBeforeGame: 90, closesAfterGame: 0, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          priceRange: 'budget'
        }
      },
      // Sunscreen Stations
      {
        id: 'padres_sunscreen_1',
        name: 'Play Sun Smart Station - Park at the Park',
        type: 'sunscreen_kiosk',
        level: 'field',
        location: { angle: 180, distance: 0.9, section: 'Park' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 5,
      nursingStations: 2,
      playAreas: 1,
      sunscreenKiosks: 4
    }
  },
  {
    stadiumId: 'giants',
    amenities: [
      // Concessions
      {
        id: 'giants_garlic_fries',
        name: 'Gilroy Garlic Fries',
        type: 'concession',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: '104' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'snacks',
          kidFriendly: true,
          dietary: ['vegetarian'],
          priceRange: 'moderate'
        }
      },
      {
        id: 'giants_crab_sandwich',
        name: 'Crazy Crab\'z Sandwich',
        type: 'concession',
        level: 'field',
        location: { angle: 45, distance: 0.6, section: '132' },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          priceRange: 'premium'
        }
      },
      {
        id: 'giants_ghirardelli',
        name: 'Ghirardelli Hot Chocolate',
        type: 'concession',
        level: 'club',
        location: { angle: 0, distance: 0.5, section: 'Club Level' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: true },
        details: {
          foodType: 'dessert',
          kidFriendly: true,
          priceRange: 'moderate'
        }
      },
      // Team Store
      {
        id: 'giants_dugout_store',
        name: 'Giants Dugout Store',
        type: 'souvenir',
        level: 'exterior',
        location: { angle: 0, distance: 1.0, section: 'Willie Mays Plaza' },
        operational: { opensBeforeGame: 180, closesAfterGame: 60, staffed: true },
        details: {
          priceRange: 'premium'
        }
      },
      // Sunscreen Stations
      {
        id: 'giants_sunscreen_1',
        name: 'Play Sun Smart Station - Bleachers',
        type: 'sunscreen_kiosk',
        level: 'upper',
        location: { angle: 135, distance: 0.9, section: 'Bleachers' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      }
    ],
    familyFeatures: {
      familyRestrooms: 5,
      nursingStations: 2,
      playAreas: 1,
      sunscreenKiosks: 3
    }
  }
];

// Function to get amenities for a specific stadium
export function getStadiumAmenities(stadiumId: string): StadiumAmenities | null {
  return STADIUM_AMENITIES.find(sa => sa.stadiumId === stadiumId) || null;
}

// Function to get amenities by type
export function getAmenitiesByType(
  stadiumId: string, 
  type: StadiumAmenity['type']
): StadiumAmenity[] {
  const stadiumAmenities = getStadiumAmenities(stadiumId);
  return stadiumAmenities?.amenities.filter(amenity => amenity.type === type) || [];
}

// Function to get family-friendly amenities
export function getFamilyFriendlyAmenities(stadiumId: string): StadiumAmenity[] {
  const stadiumAmenities = getStadiumAmenities(stadiumId);
  return stadiumAmenities?.amenities.filter(amenity => 
    amenity.type === 'family_area' || 
    amenity.type === 'nursing_station' ||
    amenity.details.familyRestroom ||
    amenity.details.kidFriendly ||
    amenity.details.changingStation
  ) || [];
}
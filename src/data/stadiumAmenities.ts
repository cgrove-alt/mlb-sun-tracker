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

// Sample amenities data for a few stadiums (to be expanded)
export const STADIUM_AMENITIES: StadiumAmenities[] = [
  {
    stadiumId: 'angels',
    amenities: [
      {
        id: 'angel_sunscreen_1',
        name: 'Play Sun Smart Sunscreen Station',
        type: 'sunscreen_kiosk',
        level: 'concourse',
        location: { angle: 90, distance: 0.7, section: 'Gate A' },
        operational: { opensBeforeGame: 90, closesAfterGame: 30, staffed: false },
        details: {
          sunscreenType: 'dispenser',
          spf: 30,
          playSimSmartPartner: true
        }
      },
      {
        id: 'angel_family_restroom_1',
        name: 'Family Restroom - First Base Side',
        type: 'restroom',
        level: 'concourse',
        location: { angle: 45, distance: 0.8 },
        operational: { opensBeforeGame: 120, closesAfterGame: 60, staffed: true },
        details: {
          familyRestroom: true,
          changingStation: true,
          accessibility: true
        }
      },
      {
        id: 'angel_concession_1',
        name: 'Rally Monkey Eats',
        type: 'concession',
        level: 'concourse',
        location: { angle: 120, distance: 0.6 },
        operational: { opensBeforeGame: 60, closesAfterGame: 15, staffed: true },
        details: {
          foodType: 'hot_food',
          kidFriendly: true,
          dietary: ['vegetarian'],
          priceRange: 'moderate'
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
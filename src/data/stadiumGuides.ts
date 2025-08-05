export interface ParkingInfo {
  lots: {
    name: string;
    distance: string;
    price: string;
    shadedSpots: boolean;
    covered: boolean;
    tip?: string;
  }[];
  streetParking?: {
    available: boolean;
    restrictions: string;
    tip?: string;
  };
  alternativeTransport?: {
    publicTransit?: string[];
    rideShare?: string;
    bicycle?: string;
  };
}

export interface ConcessionInfo {
  signature: string[];
  local: string[];
  healthy?: string[];
  vegetarian?: string[];
  glutenFree?: string[];
  kidsFriendly?: string[];
  alcohol?: {
    beer: string[];
    wine?: boolean;
    cocktails?: boolean;
    localBreweries?: string[];
  };
}

export interface GateInfo {
  name: string;
  location: string;
  bestFor: string[];
  openTime: string;
  tip?: string;
}

export interface SeatingTip {
  section: string;
  tip: string;
  category: 'shade' | 'view' | 'value' | 'experience' | 'family' | 'accessibility';
}

export interface GameDayTip {
  title: string;
  description: string;
  category: 'arrival' | 'shade' | 'food' | 'experience' | 'departure' | 'weather' | 'family';
}

export interface NeighborhoodInfo {
  name: string;
  description: string;
  beforeGame: string[];
  afterGame: string[];
  radius: string;
}

export interface AccessibilityInfo {
  wheelchairAccess: {
    available: boolean;
    sections: string[];
    entrance: string;
    elevators: string[];
  };
  assistiveListening: boolean;
  signageAndBraille: boolean;
  serviceAnimals: boolean;
  companionSeats: boolean;
  accessibleRestrooms: string[];
  accessibleConcessions: string[];
  parkingSpaces: string;
}

export interface WeatherPattern {
  month: string;
  avgTemp: number;
  avgHumidity: number;
  rainChance: number;
  typicalConditions: string;
  shadeTip: string;
}

export interface StadiumGuide {
  id: string;
  name: string;
  team: string;
  opened: number;
  capacity: number;
  
  overview: {
    description: string;
    highlights: string[];
    uniqueFeatures: string[];
    renovations?: { year: number; description: string }[];
    previousNames?: string[];
  };
  
  shadeGuide: {
    bestShadedSections: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
    coveredSeating: string[];
    shadeTips: string[];
    sunProtection: {
      sunscreenStations?: string[];
      shadedConcourses: string[];
      indoorAreas: string[];
    };
    worstSunExposure: string[];
    monthlyPatterns: WeatherPattern[];
  };
  
  seatingGuide: {
    premiumSeating: {
      clubs: { name: string; perks: string[]; access: string }[];
      suites: { levels: string[]; amenities: string[] };
      specialAreas?: { name: string; description: string; capacity?: number }[];
    };
    budgetOptions: string[];
    familySections: string[];
    standingRoom?: string[];
    partyAreas?: { name: string; capacity?: string; description?: string; amenities: string[] }[];
    tips: SeatingTip[];
  };
  
  concessions: ConcessionInfo;
  
  parking: ParkingInfo;
  
  gates: GateInfo[];
  
  amenities: {
    merchandise: { location: string; exclusive?: string[] }[];
    firstAid: string[];
    babyChanging: string[];
    nursingRooms?: string[];
    atms: string[];
    wifi?: { available: boolean; network?: string; freeZones?: string[] };
    chargingStations?: string[];
    kidZones?: { name: string; location: string; activities: string[] }[];
  };
  
  accessibility: AccessibilityInfo;
  
  gameDay: {
    tips: GameDayTip[];
    typicalSchedule: {
      gatesOpen: string;
      battingPractice?: string;
      firstPitch: string;
      rushHours: string[];
    };
    security: {
      allowedBags: string;
      prohibitedItems: string[];
      metalDetectors: boolean;
      clearBagPolicy?: boolean;
    };
  };
  
  neighborhood: NeighborhoodInfo;
  
  transportation: {
    address: string;
    publicTransit: {
      subway?: { lines: string[]; station: string; walkTime: string }[];
      bus?: { routes: string[]; stops: string[] }[];
      train?: { lines: string[]; station: string; walkTime: string }[];
    };
    driving: {
      majorRoutes: string[];
      typicalTraffic: string;
      bestApproach: string;
    };
    rideShare: {
      pickupZone: string;
      dropoffZone: string;
      surgePricing: string;
      alternativeTip?: string;
    };
  };
  
  history: {
    timeline: { year: number; event: string }[];
    notableGames?: { date: string; description: string }[];
    traditions?: { name: string; description: string }[];
    retired?: { number: string; player: string; year: number }[];
  };
  
  fanExperience: {
    atmosphere: string;
    bestExperiences: string[];
    traditions: string[];
    music?: string;
    mascot?: { name: string; description: string };
    fanGroups?: { name: string; section?: string; description: string }[];
  };
  
  proTips: {
    insiderTips: string[];
    avoidThese: string[];
    hiddenGems: string[];
    photoSpots: string[];
    bestValue: string[];
  };
}

export const stadiumGuides: Record<string, StadiumGuide> = {};
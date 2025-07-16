export interface ItineraryRecommendation {
  id: string;
  time: Date;
  duration: number; // duration in minutes
  type: 'arrival' | 'concession' | 'restroom' | 'sunscreen' | 'shade_break' | 'activity' | 'departure';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Location details
  location: {
    amenityId?: string;
    sectionId?: string;
    description: string;
    walkingTime: number; // minutes to walk there
  };
  
  // Recommendation details
  details: {
    title: string;
    description: string;
    reason: string; // why this recommendation was made
    uvIndexAtTime?: number;
    weatherCondition?: string;
    sunExposureLevel?: 'low' | 'moderate' | 'high' | 'extreme';
  };
  
  // Family-specific considerations
  familyConsiderations?: {
    kidFriendly: boolean;
    hasRestroom: boolean;
    shaded: boolean;
    quietArea: boolean;
    strollerAccessible: boolean;
  };
}

export interface SmartItinerary {
  id: string;
  stadiumId: string;
  gameDate: Date;
  gameStartTime: Date;
  createdAt: Date;
  
  // User preferences that influenced the itinerary
  preferences: ItineraryPreferences;
  
  // Weather conditions for the day
  weatherContext: {
    maxUVIndex: number;
    averageTemperature: number;
    cloudCover: number;
    precipitationProbability: number;
  };
  
  // Chronological list of recommendations
  recommendations: ItineraryRecommendation[];
  
  // Summary statistics
  summary: {
    totalWalkingTime: number;
    sunscreenReminders: number;
    shadeBreaks: number;
    familyFriendlyStops: number;
    estimatedCost: number;
  };
}

export interface ItineraryPreferences {
  // Group composition
  groupSize: number;
  hasChildren: boolean;
  hasElderly: boolean;
  mobilityNeeds: boolean;
  
  // Dietary preferences
  dietaryRestrictions: ('vegetarian' | 'vegan' | 'gluten_free' | 'halal' | 'kosher')[];
  
  // Activity preferences
  prioritizeShade: boolean;
  frequentRestrooms: boolean;
  budgetConstraints: 'budget' | 'moderate' | 'premium' | 'unlimited';
  
  // Timing preferences
  arrivalTime: 'early' | 'on_time' | 'late'; // relative to game start
  departureTime: 'early' | 'full_game' | 'late'; // relative to game end
  
  // Special needs
  nurslingNeeds: boolean;
  sunSensitivity: 'low' | 'moderate' | 'high' | 'extreme';
  
  // Customization flags
  skipConcessions: boolean;
  skipActivities: boolean;
  prioritizeSpeed: boolean; // minimize walking time
}

export interface ItineraryTimeSlot {
  startTime: Date;
  endTime: Date;
  inningRange: { start: number; end: number } | null;
  sunConditions: {
    uvIndex: number;
    sunAngle: number;
    recommendedAction: 'seek_shade' | 'apply_sunscreen' | 'normal' | 'ideal_conditions';
  };
  crowdLevel: 'low' | 'moderate' | 'high' | 'peak';
  suitableActivities: string[]; // types of activities good for this time slot
}

// Time-based recommendation templates
export const RECOMMENDATION_TEMPLATES = {
  pre_game: {
    sunscreen_application: {
      title: "Apply Sunscreen",
      description: "Visit the Play Sun Smart station before heading to your seats",
      duration: 5,
      priority: 'high' as const
    },
    arrival_concession: {
      title: "Grab Game Snacks",
      description: "Beat the crowds with pre-game concession visit",
      duration: 15,
      priority: 'medium' as const
    },
    stadium_exploration: {
      title: "Explore Stadium",
      description: "Take photos and visit team store while crowds are light",
      duration: 20,
      priority: 'low' as const
    }
  },
  
  early_innings: {
    shade_break: {
      title: "Shade Break",
      description: "UV index is high - take a break in the concourse",
      duration: 10,
      priority: 'high' as const
    },
    restroom_visit: {
      title: "Restroom Break",
      description: "Use family restroom during low-traffic time",
      duration: 8,
      priority: 'medium' as const
    }
  },
  
  mid_game: {
    seventh_inning_stretch: {
      title: "Seventh Inning Stretch",
      description: "Perfect time for concessions and restroom break",
      duration: 15,
      priority: 'medium' as const
    },
    sunscreen_reapplication: {
      title: "Reapply Sunscreen",
      description: "Time for another sunscreen application",
      duration: 3,
      priority: 'high' as const
    }
  },
  
  late_game: {
    souvenir_shopping: {
      title: "Souvenir Shopping",
      description: "Visit team store while avoiding post-game crowds",
      duration: 15,
      priority: 'low' as const
    },
    final_restroom: {
      title: "Final Restroom Break",
      description: "Last chance before post-game crowds",
      duration: 8,
      priority: 'medium' as const
    }
  }
};

// Helper function to determine optimal timing for activities
export function getOptimalActivityTime(
  activityType: string,
  gameStartTime: Date,
  gameDuration: number = 180 // minutes
): Date {
  const gameStart = new Date(gameStartTime);
  
  switch (activityType) {
    case 'arrival':
      return new Date(gameStart.getTime() - 60 * 60 * 1000); // 1 hour before
    case 'pre_game_concession':
      return new Date(gameStart.getTime() - 30 * 60 * 1000); // 30 min before
    case 'sunscreen_initial':
      return new Date(gameStart.getTime() - 15 * 60 * 1000); // 15 min before
    case 'seventh_inning_stretch':
      return new Date(gameStart.getTime() + 120 * 60 * 1000); // ~2 hours in
    case 'sunscreen_reapplication':
      return new Date(gameStart.getTime() + 90 * 60 * 1000); // 1.5 hours in
    case 'late_game_concession':
      return new Date(gameStart.getTime() + 150 * 60 * 1000); // 2.5 hours in
    case 'departure':
      return new Date(gameStart.getTime() + gameDuration * 60 * 1000);
    default:
      return gameStart;
  }
}
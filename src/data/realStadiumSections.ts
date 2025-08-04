// Real Stadium Section Data Structure
// Provides accurate, stadium-specific seating layouts for MiLB venues

export interface RealStadiumSection {
  id: string;
  name: string; // Actual section name used by the stadium
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'ga' | 'berm';
  baseAngle: number; // Calculated from actual stadium orientation
  angleSpan: number; // Based on real section width
  rows?: number;
  seatsPerRow?: number;
  covered: boolean;
  hasOverhang?: boolean; // Some sections have partial coverage
  price: 'premium' | 'moderate' | 'value' | 'luxury';
  accessibility?: 'full' | 'partial' | 'none';
  amenities?: string[];
  sunExposure?: {
    morning: 'full' | 'partial' | 'none';
    afternoon: 'full' | 'partial' | 'none';
    evening: 'full' | 'partial' | 'none';
  };
}

export interface RealStadiumLayout {
  venueId: string;
  venueName: string;
  orientation: number; // Actual home plate to center field bearing
  lastVerified: string; // Date when data was last verified
  dataSource: 'official' | 'verified' | 'estimated';
  sections: RealStadiumSection[];
  specialFeatures?: {
    name: string;
    description: string;
    location: string;
    sunImpact?: string;
  }[];
  notes?: string;
}

// Helper function to calculate section angles based on stadium orientation
export function calculateSectionAngle(
  stadiumOrientation: number,
  sectionPosition: 'home' | 'first-base' | 'third-base' | 'right-field' | 'left-field' | 'center-field',
  offset: number = 0
): number {
  const baseAngles = {
    'home': 0,
    'first-base': 45,
    'third-base': 315,
    'right-field': 90,
    'left-field': 270,
    'center-field': 180
  };
  
  const angle = (stadiumOrientation + baseAngles[sectionPosition] + offset) % 360;
  return angle < 0 ? angle + 360 : angle;
}

// Price tier matrix based on league level and section type
export const PRICE_TIERS = {
  AAA: {
    field: 'premium',
    lower: 'moderate',
    club: 'luxury',
    upper: 'value',
    suite: 'luxury',
    ga: 'value',
    berm: 'value'
  },
  AA: {
    field: 'premium',
    lower: 'moderate',
    club: 'premium',
    upper: 'value',
    suite: 'luxury',
    ga: 'value',
    berm: 'value'
  },
  'A+': {
    field: 'moderate',
    lower: 'value',
    club: 'premium',
    upper: 'value',
    suite: 'premium',
    ga: 'value',
    berm: 'value'
  },
  A: {
    field: 'moderate',
    lower: 'value',
    club: 'moderate',
    upper: 'value',
    suite: 'premium',
    ga: 'value',
    berm: 'value'
  }
};

// Sun exposure calculator based on section angle and time of day
export function calculateSunExposure(
  sectionAngle: number,
  covered: boolean,
  hasOverhang?: boolean
): RealStadiumSection['sunExposure'] {
  if (covered) {
    return {
      morning: 'none',
      afternoon: 'none',
      evening: 'none'
    };
  }
  
  // Morning sun comes from the east (90°)
  // Afternoon sun comes from the south/southwest (180-225°)
  // Evening sun comes from the west (270°)
  
  const morningExposure = Math.abs(sectionAngle - 90) < 90 ? 
    (hasOverhang ? 'partial' : 'full') : 'none';
    
  const afternoonExposure = sectionAngle > 90 && sectionAngle < 270 ? 
    (hasOverhang ? 'partial' : 'full') : 'none';
    
  const eveningExposure = Math.abs(sectionAngle - 270) < 90 ? 
    (hasOverhang ? 'partial' : 'full') : 'none';
  
  return {
    morning: morningExposure,
    afternoon: afternoonExposure,
    evening: eveningExposure
  };
}
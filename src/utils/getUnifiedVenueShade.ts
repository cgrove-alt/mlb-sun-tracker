// Unified shade calculation system supporting all venue types
// Extends existing shade calculations to work with football, soccer, and other sports

import { UnifiedVenue } from '../data/unifiedVenues';
import { getSunPosition } from './sunCalculations';
import { WeatherData } from '../services/weatherApi';

export interface VenueSection {
  id: string;
  name: string;
  level: string;
  baseAngle: number;
  angleSpan: number;
  covered: boolean;
  price: string;
  venueType: string;
}

export interface ShadedVenueSection {
  section: VenueSection;
  shadePercentage: number;
  isFullyShaded: boolean;
  isPartiallyShaded: boolean;
  isInSun: boolean;
  shadeFactor: number; // 0-1 scale for easier sorting
}

// Sport-specific shade calculation modifiers
const SPORT_SHADE_MODIFIERS = {
  baseball: {
    // Baseball stadiums have asymmetrical layouts
    homeAngleBonus: 15, // Home plate side gets more shade consideration
    foulTerritoryShade: 10, // Sections in foul territory get slight shade bonus
    upperDeckAdvantage: 25, // Upper deck provides significant shade
  },
  football: {
    // Football stadiums are more symmetrical
    sidelineAdvantage: 20, // Sideline sections are prime seating
    endZoneShade: 5, // End zones less shade priority but still relevant
    upperDeckAdvantage: 30, // Upper decks provide excellent shade
  }
};

/**
 * Calculate shade for any venue type using unified system
 */
export function getUnifiedVenueShade(
  venue: UnifiedVenue,
  gameDateTime: Date,
  sections: VenueSection[],
  weather?: WeatherData
): ShadedVenueSection[] {
  // Get sun position
  const sunPos = getSunPosition(gameDateTime, venue.latitude, venue.longitude);
  
  // Early return for night games or fully covered venues
  if (sunPos.altitudeDegrees <= 0) {
    return sections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false,
      shadeFactor: 1.0
    }));
  }

  if (venue.roof === 'fixed') {
    return sections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false,
      shadeFactor: 1.0
    }));
  }

  // Calculate shade for each section
  const shadedSections = sections.map(section => 
    calculateSectionShade(venue, section, sunPos, weather)
  );

  // Sort by shade percentage (most shaded first)
  return shadedSections.sort((a, b) => b.shadePercentage - a.shadePercentage);
}

/**
 * Calculate shade for a specific section
 */
function calculateSectionShade(
  venue: UnifiedVenue,
  section: VenueSection,
  sunPos: { azimuthDegrees: number; altitudeDegrees: number },
  weather?: WeatherData
): ShadedVenueSection {
  let shadePercentage = 0;
  
  // Base shade calculation
  if (section.covered) {
    shadePercentage = 100;
  } else {
    // Calculate based on sun angle relative to section
    const sectionAngle = (section.baseAngle + venue.orientation) % 360;
    const sunAngle = sunPos.azimuthDegrees;
    
    // Calculate angle difference
    let angleDiff = Math.abs(sectionAngle - sunAngle);
    if (angleDiff > 180) {
      angleDiff = 360 - angleDiff;
    }
    
    // Base shade based on sun angle
    if (angleDiff > 90) {
      // Section is facing away from sun
      shadePercentage = Math.min(80, 30 + (angleDiff - 90) * 0.5);
    } else {
      // Section is facing sun
      shadePercentage = Math.max(0, 30 - angleDiff * 0.3);
    }
    
    // Apply upper deck bonus
    if (section.level === 'upper') {
      const sport = venue.sport as keyof typeof SPORT_SHADE_MODIFIERS;
      const modifier = SPORT_SHADE_MODIFIERS[sport] || SPORT_SHADE_MODIFIERS.baseball;
      shadePercentage += modifier.upperDeckAdvantage;
    }
    
    // Apply sport-specific modifiers
    shadePercentage += getSportSpecificShadeBonus(venue, section, sunPos);
    
    // Apply venue geometry modifiers
    shadePercentage += getVenueGeometryBonus(venue, section, sunPos);
    
    // Weather modifications
    if (weather) {
      shadePercentage += getWeatherShadeBonus(weather);
    }
    
    // Cap at 100%
    shadePercentage = Math.min(100, Math.max(0, shadePercentage));
  }
  
  const shadeFactor = shadePercentage / 100;
  
  return {
    section,
    shadePercentage: Math.round(shadePercentage),
    isFullyShaded: shadePercentage >= 90,
    isPartiallyShaded: shadePercentage > 20 && shadePercentage < 90,
    isInSun: shadePercentage <= 20,
    shadeFactor
  };
}

/**
 * Apply sport-specific shade bonuses
 */
function getSportSpecificShadeBonus(
  venue: UnifiedVenue,
  section: VenueSection,
  sunPos: { azimuthDegrees: number; altitudeDegrees: number }
): number {
  const sport = venue.sport as keyof typeof SPORT_SHADE_MODIFIERS;
  const modifier = SPORT_SHADE_MODIFIERS[sport] || SPORT_SHADE_MODIFIERS.baseball;
  let bonus = 0;
  
  if (venue.sport === 'football') {
    // Football-specific logic
    const footballModifier = modifier as typeof SPORT_SHADE_MODIFIERS.football;
    if (section.name.toLowerCase().includes('sideline')) {
      bonus += footballModifier.sidelineAdvantage;
    }
    if (section.name.toLowerCase().includes('end')) {
      bonus += footballModifier.endZoneShade;
    }
  } else if (venue.sport === 'baseball') {
    // Baseball-specific logic
    const baseballModifier = modifier as typeof SPORT_SHADE_MODIFIERS.baseball;
    const sectionAngle = (section.baseAngle + venue.orientation) % 360;
    // Third base side typically gets more afternoon shade
    if (sectionAngle >= 180 && sectionAngle <= 270) {
      bonus += baseballModifier.homeAngleBonus;
    }
  }
  
  return bonus;
}

/**
 * Apply venue geometry bonuses based on specific characteristics
 */
function getVenueGeometryBonus(
  venue: UnifiedVenue,
  section: VenueSection,
  sunPos: { azimuthDegrees: number; altitudeDegrees: number }
): number {
  let bonus = 0;
  
  // Retractable roof venues might have partial shade
  if (venue.roof === 'retractable') {
    bonus += 15; // Assume some structural shade
  }
  
  // Large capacity venues often have more substantial upper decks
  if (venue.capacity > 60000 && section.level === 'upper') {
    bonus += 10;
  }
  
  // Newer venues (post-2000) often have better shade design
  if (venue.opened && venue.opened > 2000) {
    bonus += 5;
  }
  
  // High sun angle reduces natural shade
  if (sunPos.altitudeDegrees > 60) {
    bonus -= 10;
  }
  
  return bonus;
}

/**
 * Apply weather-based shade bonuses
 */
function getWeatherShadeBonus(weather: WeatherData): number {
  let bonus = 0;
  
  // Cloud cover provides natural shade
  if (weather.cloudCover && weather.cloudCover > 0) {
    bonus += Math.min(20, weather.cloudCover * 0.3);
  }
  
  // High temperatures make shade more valuable (not more available, but more important)
  // This is more of a "shade importance" modifier
  if (weather.temperature && weather.temperature > 85) {
    // Don't add actual shade, but could be used for recommendations
  }
  
  return bonus;
}

/**
 * Get recommended sections based on shade and sport-specific priorities
 */
export function getRecommendedSections(
  venue: UnifiedVenue,
  shadedSections: ShadedVenueSection[],
  budget?: 'value' | 'moderate' | 'premium' | 'luxury'
): ShadedVenueSection[] {
  let filtered = shadedSections;
  
  // Filter by budget if specified
  if (budget) {
    const budgetOrder = ['value', 'moderate', 'premium', 'luxury'];
    const maxBudgetIndex = budgetOrder.indexOf(budget);
    filtered = shadedSections.filter(s => 
      budgetOrder.indexOf(s.section.price) <= maxBudgetIndex
    );
  }
  
  // Apply sport-specific preferences
  const sportWeighted = filtered.map(s => ({
    ...s,
    recommendationScore: calculateRecommendationScore(venue, s)
  }));
  
  // Sort by recommendation score
  return sportWeighted
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10); // Top 10 recommendations
}

/**
 * Calculate recommendation score combining shade and sport-specific factors
 */
function calculateRecommendationScore(
  venue: UnifiedVenue,
  shadedSection: ShadedVenueSection
): number {
  let score = shadedSection.shadePercentage;
  
  // Premium seating gets slight bonus for experience
  const priceBonus = {
    'luxury': 10,
    'premium': 5,
    'moderate': 2,
    'value': 0
  }[shadedSection.section.price] || 0;
  
  score += priceBonus;
  
  // Upper deck gets shade bonus but might have view trade-offs
  if (shadedSection.section.level === 'upper') {
    score += 15; // Shade bonus
    score -= 5;  // View penalty
  }
  
  // Club level often best balance of shade and amenities
  if (shadedSection.section.level === 'club') {
    score += 10;
  }
  
  return score;
}

/**
 * Backward compatibility: Convert unified venue to legacy stadium format
 */
export function convertToLegacyStadium(venue: UnifiedVenue): any {
  return {
    id: venue.id,
    name: venue.name,
    team: venue.team,
    city: venue.city,
    state: venue.state,
    latitude: venue.latitude,
    longitude: venue.longitude,
    orientation: venue.orientation,
    capacity: venue.capacity,
    roof: venue.roof,
    timezone: venue.timezone,
    roofHeight: venue.roofHeight,
    roofOverhang: venue.roofOverhang,
    upperDeckHeight: venue.upperDeckHeight
  };
}
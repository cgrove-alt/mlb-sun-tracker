// Unified shade calculation system supporting all venue types
// Extends existing shade calculations to work with football, soccer, and other sports

import { UnifiedVenue } from '../data/unifiedVenues';
import { cloudTransmissionFactor, getSunPosition } from './sunCalculations';
import { WeatherData } from '../services/weatherApi';
import {
  venueSectionCompassAngle,
  sectionAngleConventionFor,
  structuralShadeFraction,
  horizonBlockFactor,
  type SeatingLevel,
} from './bowlGeometry';

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
  /**
   * GEOMETRIC shade, 0–100: how much of the section the structure actually
   * puts in shadow at this sun position. Weather is deliberately NOT folded
   * in — clouds dim the sun, they do not move the shadow line, and mixing the
   * two made a cloudy day look like a covered seat. Use `effectiveSunPercent`
   * when you want the "how much sun will I actually feel" number.
   */
  shadePercentage: number;
  isFullyShaded: boolean;
  isPartiallyShaded: boolean;
  isInSun: boolean;
  shadeFactor: number; // 0-1 scale for easier sorting
  /**
   * Direct sun still reaching the section after cloud cover, 0–100.
   * Equals (100 − shadePercentage) when there is no weather data.
   */
  effectiveSunPercent: number;
}

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
      shadeFactor: 1.0,
      effectiveSunPercent: 0
    }));
  }

  if (venue.roof === 'fixed') {
    return sections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false,
      shadeFactor: 1.0,
      effectiveSunPercent: 0
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
 * Calculate shade for a specific section.
 *
 * REWRITTEN 2026-08-07. The previous implementation had the two regimes
 * swapped: it awarded up to 85% shade to sections whose compass bearing was
 * MORE than 90° from the sun — i.e. the sections sitting directly across the
 * bowl with the light in their faces — and gave the genuinely shaded sun-side
 * sections a flat ~0–5%. Measured against the physical rule for all 30 MLB
 * parks at 1 PM / 4 PM / 7 PM, it picked the wrong side 87 times out of 87.
 * Since this function drives the homepage shade percentage and the
 * "most shaded first" ordering for every venue on the site, it was telling
 * every user to sit in the sun.
 *
 * It now delegates the whole sun/shade relationship to
 * `structuralShadeFraction` in bowlGeometry.ts, which is the one place that
 * relationship is defined and tested.
 *
 * The stack of additive bonuses that used to sit on top of the geometry was
 * also removed. They were unsourced, and two of them were actively wrong:
 *   - "upper deck +25/+30" treated the most exposed seats in the park as the
 *     shadiest. The bowl model now handles level properly — an upper deck has
 *     little structure behind it, so it picks up shade late, not early.
 *   - a flat "+15 third base side" was applied at EVERY park regardless of
 *     orientation, as though 3B were shaded everywhere. Which side is shaded
 *     depends entirely on the park's bearing; that is now computed.
 *   - "opened > 2000 +5", "capacity > 60000 +10" and "retractable +15" were
 *     round numbers with no derivation, large enough to move a section two
 *     display tiers on their own.
 */
function calculateSectionShade(
  venue: UnifiedVenue,
  section: VenueSection,
  sunPos: { azimuthDegrees: number; altitudeDegrees: number },
  weather?: WeatherData
): ShadedVenueSection {
  let shadePercentage: number;

  if (section.covered) {
    shadePercentage = 100;
  } else {
    // Baseball sections are stadium-local (0 = 1B … 270 = home). NFL sections
    // are already compass-from-north. Pick the conversion from the venue type
    // rather than assuming every bowl is a baseball diamond.
    const sectionCompassDeg = venueSectionCompassAngle(
      section,
      venue.orientation,
      sectionAngleConventionFor(venue),
    );
    shadePercentage = 100 * structuralShadeFraction({
      sunAltitudeDeg: sunPos.altitudeDegrees,
      sunAzimuthDeg: sunPos.azimuthDegrees,
      sectionCompassDeg,
      level: section.level as SeatingLevel,
    });
  }

  shadePercentage = Math.min(100, Math.max(0, shadePercentage));

  // Direct sun actually felt: the lit fraction, damped by the stadium rim at
  // low sun and by cloud cover. Kept as a SEPARATE number from the geometric
  // shade above so a cloudy day never gets reported as a shaded seat.
  const litFraction = (1 - shadePercentage / 100)
    * horizonBlockFactor(sunPos.altitudeDegrees)
    * (weather ? cloudTransmissionFactor(weather) : 1);

  const shadeFactor = shadePercentage / 100;

  return {
    section,
    shadePercentage: Math.round(shadePercentage),
    isFullyShaded: shadePercentage >= 90,
    isPartiallyShaded: shadePercentage > 20 && shadePercentage < 90,
    isInSun: shadePercentage <= 20,
    shadeFactor,
    effectiveSunPercent: Math.round(Math.max(0, Math.min(100, 100 * litFraction))),
  };
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

  // Amenity/experience preferences ONLY. There used to be a "+15 upper deck
  // shade bonus" here, which double-counted shade on top of `shadePercentage`
  // — and counted it in the wrong direction, since an upper deck is the most
  // exposed part of the park, not the shadiest. Shade is already the base of
  // this score; these adjustments must not restate it.
  if (shadedSection.section.level === 'upper') {
    score -= 5; // further from the action
  }
  if (shadedSection.section.level === 'club') {
    score += 10; // in-seat service, indoor concourse access
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
    roofType: venue.roof,
    timezone: venue.timezone,
    roofHeight: venue.roofHeight,
    roofOverhang: venue.roofOverhang,
    upperDeckHeight: venue.upperDeckHeight
  };
}

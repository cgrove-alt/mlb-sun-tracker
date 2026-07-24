import SunCalc from 'suncalc';
import { Stadium } from '../data/stadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { isSectionInSun, getSectionSunExposure } from './sectionSunCalculations';
import { WeatherData } from '../services/weatherApi';
import { getVenueSections } from '../data/venueSections';
import { SunCalculator } from './sunCalculator';
// getSunPosition lives in a leaf module (no data-layer imports) so first-load
// components can use it without pulling venueSections in via this file. Re-export
// keeps existing `import { getSunPosition } from './sunCalculations'` callers working.
import { getSunPosition, type SunPosition } from './sunPosition';
export { getSunPosition };
export type { SunPosition };

export interface SeatingSectionSun {
  section: StadiumSection;
  inSun: boolean;
  sunExposure: number; // 0-100, percentage of game time in sun
  timeInSun?: number; // Total minutes in sun during game
  percentageOfGameInSun?: number; // Same as sunExposure, for clarity
}

export function getSunTimes(date: Date, latitude: number, longitude: number) {
  return SunCalc.getTimes(date, latitude, longitude);
}


// Calculate detailed section-level sun exposure for all sections in a stadium
export function calculateDetailedSectionSunExposure(
  stadium: Stadium,
  sunPosition: SunPosition,
  weather?: WeatherData,
  sections?: StadiumSection[]
): SeatingSectionSun[] {
  // SunCalc already applies atmospheric refraction internally; do not
  // double-correct here.

  // Use provided sections or fall back to venue sections
  let stadiumSections = sections;
  if (!stadiumSections || stadiumSections.length === 0) {
    // Try venue sections (for MiLB and NFL venues)
    stadiumSections = getVenueSections(stadium.id);
  }
  const sectionSunData: SeatingSectionSun[] = [];

  // Safety check to prevent performance issues
  if (stadiumSections.length > 250) {
    // Log warning in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn(`[calculateDetailedSectionSunExposure] Large number of sections (${stadiumSections.length}) for stadium ${stadium.id}. Processing may be slow.`);
    }
  }

  // If stadium has a fixed roof, no sections get sun
  if (stadium.roof === 'fixed') {
    stadiumSections.forEach(section => {
      sectionSunData.push({
        section,
        inSun: false,
        sunExposure: 0
      });
    });
    return sectionSunData;
  }
  
  // sunAzimuth is absolute compass; section.baseAngle is stadium-local. The
  // section helpers take `stadium.orientation` and do the conversion
  // internally. See src/utils/sectionSunCalculations.ts for the convention.
  const sunAzimuth = sunPosition.azimuthDegrees;
  
  // Calculate weather impact on sun exposure
  let weatherMultiplier = 1.0;
  if (weather) {
    const { cloudCover, conditions, precipitationProbability } = weather;
    // Log in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {

    }
    
    // Reduce sun exposure based on weather conditions
    if ((precipitationProbability && precipitationProbability > 70) || 
        conditions.some(c => c.main === 'Rain' || c.main === 'Snow' || c.main === 'Drizzle')) {
      weatherMultiplier = 0.1; // Heavy rain/snow/drizzle blocks most sun
    } else if (precipitationProbability && precipitationProbability > 30) {
      weatherMultiplier = 0.4; // Light rain likely
    } else if (cloudCover > 80) {
      weatherMultiplier = 0.4; // Heavy clouds
    } else if (cloudCover > 60) {
      weatherMultiplier = 0.6; // Mostly cloudy
    } else if (cloudCover > 40) {
      weatherMultiplier = 0.8; // Partly cloudy
    } else if (cloudCover > 15) {
      weatherMultiplier = 0.9; // Light clouds
    }
    
    // Log in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {

    }
  } else {
    // Log in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {

    }
  }

  stadiumSections.forEach(section => {
    const inSun = isSectionInSun(section, sunAzimuth, sunPosition.altitudeDegrees, stadium.orientation);
    let sunExposure = getSectionSunExposure(section, sunPosition.altitudeDegrees, sunAzimuth, stadium.orientation);
    
    // Apply weather impact to sun exposure
    sunExposure = sunExposure * weatherMultiplier;
    
    sectionSunData.push({
      section,
      inSun: inSun && sunExposure > 10, // Consider it "in sun" only if meaningful exposure after weather
      sunExposure: Math.round(sunExposure)
    });
  });
  
  return sectionSunData;
}

// Filter sections based on sun exposure criteria
export function filterSectionsBySunExposure(
  sectionSunData: SeatingSectionSun[],
  criteria: {
    minExposure?: number;
    maxExposure?: number;
    levels?: Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>;
    covered?: boolean;
    priceRange?: Array<'value' | 'moderate' | 'premium' | 'luxury'>;
  }
): SeatingSectionSun[] {
  // Debug logging
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && (criteria.minExposure !== undefined || criteria.maxExposure !== undefined)) {
  }
  
  const filteredResults = sectionSunData.filter(item => {
    const { section, sunExposure } = item;
    
    // Check exposure range
    if (criteria.minExposure !== undefined && sunExposure < criteria.minExposure) {
      return false;
    }
    if (criteria.maxExposure !== undefined && sunExposure > criteria.maxExposure) {
      return false;
    }
    
    // Check level
    if (criteria.levels && criteria.levels.length > 0 && !criteria.levels.includes(section.level)) {
      return false;
    }
    
    // Check covered preference
    if (criteria.covered !== undefined && section.covered !== criteria.covered) {
      return false;
    }
    
    // Check price range
    if (criteria.priceRange && criteria.priceRange.length > 0 && section.price && !criteria.priceRange.includes(section.price)) {
      return false;
    }
    
    return true;
  });
  
  // Debug logging for results
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && (criteria.minExposure !== undefined || criteria.maxExposure !== undefined)) {
  }
  
  return filteredResults;
}

// Get a simple description of sun conditions
export function getSunDescription(sunPosition: SunPosition): string {
  if (sunPosition.altitudeDegrees < 0) {
    return 'Sun is below the horizon';
  } else if (sunPosition.altitudeDegrees < 10) {
    return 'Sun is very low on the horizon';
  } else if (sunPosition.altitudeDegrees < 30) {
    return 'Sun is low in the sky';
  } else if (sunPosition.altitudeDegrees < 60) {
    return 'Sun is at medium height';
  } else {
    return 'Sun is high in the sky';
  }
}

// Get compass direction from azimuth
export function getCompassDirection(azimuthDegrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(azimuthDegrees / 45) % 8;
  return directions[index];
}

// Helper function to determine section side
function getSectionSide(section: StadiumSection): 'home' | 'first' | 'third' | 'outfield' {
  const name = section.name.toLowerCase();
  if (name.includes('home') || name.includes('behind') || name.includes('backstop')) {
    return 'home';
  } else if (name.includes('first') || name.includes('1b') || name.includes('right field')) {
    return 'first';
  } else if (name.includes('third') || name.includes('3b') || name.includes('left field')) {
    return 'third';
  } else {
    return 'outfield';
  }
}

// Helper function to calculate section angle
function getSectionAngle(section: StadiumSection, stadiumOrientation: number): number {
  // Section angles are already in absolute compass coordinates
  // Just return the section's center angle
  return (section.baseAngle + section.angleSpan / 2) % 360;
}

// Calculate sun exposure for entire game duration
export function calculateGameSunExposure(
  stadium: Stadium,
  gameDateTime: Date,
  gameDuration: number = 3,
  sections?: StadiumSection[]
): Map<string, number> {
  const calculator = new SunCalculator(stadium);

  // Use provided sections or fall back to venue sections
  let stadiumSections = sections;
  if (!stadiumSections || stadiumSections.length === 0) {
    // Try venue sections (for MiLB and NFL venues)
    stadiumSections = getVenueSections(stadium.id);
  }
  const exposureMap = new Map<string, number>();

  // Safety check to prevent performance issues
  if (stadiumSections.length > 250) {
    // Log warning in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn(`[calculateGameSunExposure] Large number of sections (${stadiumSections.length}) for stadium ${stadium.id}. Processing may be slow.`);
    }
  }

  stadiumSections.forEach(section => {
    const sectionWithGeometry = {
      ...section,
      side: getSectionSide(section),
      angle: getSectionAngle(section, stadium.orientation),
      depth: 50 // Default depth in feet
    };
    
    const exposure = calculator.calculateTimeInSun(sectionWithGeometry, gameDateTime, gameDuration);
    exposureMap.set(section.id, exposure.percentage);
  });
  
  return exposureMap;
}

// Export the new 3D shade calculation function
export { getShadedSections } from './getShadedSections';
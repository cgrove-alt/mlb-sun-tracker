import SunCalc from 'suncalc';
import { Stadium } from '../data/stadiums';
import { StadiumSection, getStadiumSections, isSectionInSun, getSectionSunExposure } from '../data/stadiumSections';
import { WeatherData } from '../services/weatherApi';
import { getVenueSections } from '../data/venueSections';
import { SunCalculator } from './sunCalculator';
import { getSunPositionNREL } from './nrelSolarPosition';
import { getSunPositionNRELFixed } from './nrelSolarPositionFixed';
import { getSunPositionImproved } from './sunCalcClone';

export interface SunPosition {
  azimuth: number; // Sun azimuth in radians
  altitude: number; // Sun altitude in radians
  azimuthDegrees: number; // Sun azimuth in degrees (0-360)
  altitudeDegrees: number; // Sun altitude in degrees
}

export interface SeatingSectionSun {
  section: StadiumSection;
  inSun: boolean;
  sunExposure: number; // 0-100, percentage of game time in sun
  timeInSun?: number; // Total minutes in sun during game
  percentageOfGameInSun?: number; // Same as sunExposure, for clarity
}

export function getSunPosition(
  date: Date,
  latitude: number,
  longitude: number
): SunPosition {
  // Use improved sun position calculation for better accuracy
  // while maintaining SunCalc compatibility
  const useImproved = process.env.REACT_APP_USE_IMPROVED_SPA !== 'false'; // Default to true
  
  if (useImproved) {
    try {
      // Use improved algorithm that matches SunCalc but with better constants
      return getSunPositionImproved(date, latitude, longitude);
    } catch (error) {
      console.warn('Improved sun position calculation failed, falling back to SunCalc:', error);
      // Fall through to SunCalc implementation
    }
  }
  
  // Fallback to original SunCalc implementation
  const sunPos = SunCalc.getPosition(date, latitude, longitude);
  
  // Convert radians to degrees and normalize azimuth to 0-360
  const azimuthDegrees = ((sunPos.azimuth * 180 / Math.PI) + 180) % 360;
  const altitudeDegrees = sunPos.altitude * 180 / Math.PI;
  
  return {
    azimuth: sunPos.azimuth,
    altitude: sunPos.altitude,
    azimuthDegrees,
    altitudeDegrees
  };
}

export function getSunTimes(date: Date, latitude: number, longitude: number) {
  return SunCalc.getTimes(date, latitude, longitude);
}

// Calculate which sections of the stadium will be in sun
export function calculateSunnySections(
  stadium: Stadium,
  sunPosition: SunPosition
): Map<string, boolean> {
  const sunnySections = new Map<string, boolean>();
  
  // If sun is below horizon, no sections are sunny
  if (sunPosition.altitudeDegrees < 0) {
    return sunnySections;
  }
  
  // For stadiums with fixed roofs, no sections are sunny
  if (stadium.roof === 'fixed') {
    return sunnySections;
  }
  
  // Calculate relative sun angle to stadium orientation
  const relativeSunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
  
  // Define section angles relative to home plate
  const sections = [
    { name: 'Home Plate', startAngle: 170, endAngle: 190 },
    { name: 'First Base Line', startAngle: 0, endAngle: 90 },
    { name: 'Third Base Line', startAngle: 270, endAngle: 360 },
    { name: 'Right Field', startAngle: 315, endAngle: 45 },
    { name: 'Center Field', startAngle: 340, endAngle: 20 },
    { name: 'Left Field', startAngle: 135, endAngle: 225 },
    { name: 'Upper Deck - First Base', startAngle: 0, endAngle: 90 },
    { name: 'Upper Deck - Third Base', startAngle: 270, endAngle: 360 },
    { name: 'Upper Deck - Outfield', startAngle: 315, endAngle: 225 }
  ];
  
  // Calculate shadow length based on sun altitude (for future enhancements)
  // const shadowLength = 1 / Math.tan(sunPosition.altitude);
  
  sections.forEach(section => {
    // Check if sun angle falls within section's range
    let inSun = false;
    
    if (section.startAngle > section.endAngle) {
      // Section crosses 0 degrees
      inSun = relativeSunAngle >= section.startAngle || relativeSunAngle <= section.endAngle;
    } else {
      inSun = relativeSunAngle >= section.startAngle && relativeSunAngle <= section.endAngle;
    }
    
    // Consider sun altitude - lower sections might be shaded by upper deck
    if (inSun && section.name.includes('Lower') && sunPosition.altitudeDegrees < 30) {
      inSun = false;
    }
    
    // Opposite side of the stadium from the sun will be in shade
    const oppositeAngle = (relativeSunAngle + 180) % 360;
    if (section.startAngle <= oppositeAngle && oppositeAngle <= section.endAngle) {
      inSun = true;
    }
    
    sunnySections.set(section.name, inSun);
  });
  
  return sunnySections;
}

// Calculate detailed section-level sun exposure for all sections in a stadium
export function calculateDetailedSectionSunExposure(
  stadium: Stadium,
  sunPosition: SunPosition,
  weather?: WeatherData
): SeatingSectionSun[] {
  // Try to get sections - first check MLB stadiums, then check all venues (including MiLB/NFL)
  let sections = getStadiumSections(stadium.id);
  if (sections.length === 0) {
    // Try venue sections (for MiLB and NFL venues)
    sections = getVenueSections(stadium.id);
  }
  const sectionSunData: SeatingSectionSun[] = [];
  
  // Safety check to prevent performance issues
  if (sections.length > 250) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[calculateDetailedSectionSunExposure] Large number of sections (${sections.length}) for stadium ${stadium.id}. Processing may be slow.`);
    }
  }
  
  // If stadium has a fixed roof, no sections get sun
  if (stadium.roof === 'fixed') {
    sections.forEach(section => {
      sectionSunData.push({
        section,
        inSun: false,
        sunExposure: 0
      });
    });
    return sectionSunData;
  }
  
  // Don't adjust sun azimuth - isSectionInSun expects absolute compass degrees
  // and the section angles are already in absolute compass coordinates
  const sunAzimuth = sunPosition.azimuthDegrees;
  
  // Calculate weather impact on sun exposure
  let weatherMultiplier = 1.0;
  if (weather) {
    const { cloudCover, conditions, precipitationProbability } = weather;
    if (process.env.NODE_ENV === 'development') {
      console.log('Weather data applied:', { cloudCover, conditions: conditions[0]?.main, precipitationProbability });
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Weather multiplier applied:', weatherMultiplier);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('No weather data available for sun calculations');
    }
  }

  sections.forEach(section => {
    const inSun = isSectionInSun(section, sunAzimuth, sunPosition.altitudeDegrees);
    let sunExposure = getSectionSunExposure(section, sunPosition.altitudeDegrees, sunAzimuth);
    
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
  if (process.env.NODE_ENV === 'development' && (criteria.minExposure !== undefined || criteria.maxExposure !== undefined)) {
    console.log('[Filter Debug] Criteria:', { 
      minExposure: criteria.minExposure, 
      maxExposure: criteria.maxExposure,
      totalSections: sectionSunData.length,
      highSunSections: sectionSunData.filter(s => s.sunExposure >= 75).length
    });
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
  if (process.env.NODE_ENV === 'development' && (criteria.minExposure !== undefined || criteria.maxExposure !== undefined)) {
    console.log('[Filter Debug] Results:', { 
      filteredCount: filteredResults.length,
      examples: filteredResults.slice(0, 3).map(s => ({ name: s.section.name, sun: s.sunExposure }))
    });
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

// Enhanced sun exposure calculation using advanced shadow calculations
export function calculateEnhancedSectionSunExposure(
  stadium: Stadium,
  date: Date,
  weather?: WeatherData
): SeatingSectionSun[] {
  const calculator = new SunCalculator(stadium);
  // Try to get sections - first check MLB stadiums, then check all venues (including MiLB/NFL)
  let sections = getStadiumSections(stadium.id);
  if (sections.length === 0) {
    // Try venue sections (for MiLB and NFL venues)
    sections = getVenueSections(stadium.id);
  }
  
  // Safety check to prevent performance issues
  if (sections.length > 250) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[calculateEnhancedSectionSunExposure] Large number of sections (${sections.length}) for stadium ${stadium.id}. Processing may be slow.`);
    }
  }
  
  // Get sun position for the given time
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0];
  const sunPos = calculator.calculateSunPosition(dateStr, timeStr);
  
  // If stadium has a fixed roof, no sections get sun
  if (stadium.roof === 'fixed') {
    return sections.map(section => ({
      section,
      inSun: false,
      sunExposure: 0
    }));
  }
  
  // Calculate shadows for all sections
  const shadowData = calculator.calculateShadows(
    sunPos,
    sections.map(s => ({
      ...s,
      side: getSectionSide(s),
      angle: getSectionAngle(s, stadium.orientation)
    }))
  );
  
  // Apply weather impact
  let weatherMultiplier = 1.0;
  if (weather) {
    const { cloudCover, conditions, precipitationProbability } = weather;
    
    if ((precipitationProbability && precipitationProbability > 70) || 
        conditions.some(c => c.main === 'Rain' || c.main === 'Snow' || c.main === 'Drizzle')) {
      weatherMultiplier = 0.1;
    } else if (precipitationProbability && precipitationProbability > 30) {
      weatherMultiplier = 0.4;
    } else if (cloudCover > 80) {
      weatherMultiplier = 0.4;
    } else if (cloudCover > 60) {
      weatherMultiplier = 0.6;
    } else if (cloudCover > 40) {
      weatherMultiplier = 0.8;
    } else if (cloudCover > 15) {
      weatherMultiplier = 0.9;
    }
  }
  
  // Combine section data with shadow calculations
  return sections.map((section, index) => {
    const shadow = shadowData[index];
    const adjustedExposure = Math.round(shadow.sunExposure * weatherMultiplier);
    
    return {
      section,
      inSun: adjustedExposure > 20,
      sunExposure: adjustedExposure
    };
  });
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
  gameDuration: number = 3
): Map<string, number> {
  const calculator = new SunCalculator(stadium);
  // Try to get sections - first check MLB stadiums, then check all venues (including MiLB/NFL)
  let sections = getStadiumSections(stadium.id);
  if (sections.length === 0) {
    // Try venue sections (for MiLB and NFL venues)
    sections = getVenueSections(stadium.id);
  }
  const exposureMap = new Map<string, number>();
  
  // Safety check to prevent performance issues
  if (sections.length > 250) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[calculateGameSunExposure] Large number of sections (${sections.length}) for stadium ${stadium.id}. Processing may be slow.`);
    }
  }
  
  sections.forEach(section => {
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
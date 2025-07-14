import SunCalc from 'suncalc';
import { Stadium } from '../data/stadiums';
import { StadiumSection, getStadiumSections, isSectionInSun, getSectionSunExposure } from '../data/stadiumSections';
import { WeatherData } from '../services/weatherApi';

export interface SunPosition {
  azimuth: number; // Sun azimuth in radians
  altitude: number; // Sun altitude in radians
  azimuthDegrees: number; // Sun azimuth in degrees (0-360)
  altitudeDegrees: number; // Sun altitude in degrees
}

export interface SeatingSectionSun {
  section: StadiumSection;
  inSun: boolean;
  sunExposure: number; // 0-100, percentage of sun exposure
}

export function getSunPosition(
  date: Date,
  latitude: number,
  longitude: number
): SunPosition {
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
  const sections = getStadiumSections(stadium.id);
  const sectionSunData: SeatingSectionSun[] = [];
  
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
  
  // Account for stadium orientation
  // Section angles are relative to home plate, but sun azimuth is compass-based
  // We need to adjust the sun azimuth relative to stadium orientation
  const adjustedSunAzimuth = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
  
  // Calculate weather impact on sun exposure
  let weatherMultiplier = 1.0;
  if (weather) {
    const { cloudCover, conditions, precipitationProbability } = weather;
    
    // Reduce sun exposure based on weather conditions
    if ((precipitationProbability && precipitationProbability > 70) || conditions.some(c => c.main === 'Rain' || c.main === 'Snow')) {
      weatherMultiplier = 0.1; // Heavy rain/snow blocks most sun
    } else if (cloudCover > 80) {
      weatherMultiplier = 0.3; // Heavy clouds
    } else if (cloudCover > 50) {
      weatherMultiplier = 0.6; // Partial clouds
    } else if (cloudCover > 20) {
      weatherMultiplier = 0.8; // Light clouds
    }
  }

  sections.forEach(section => {
    const inSun = isSectionInSun(section, adjustedSunAzimuth, sunPosition.altitudeDegrees);
    let sunExposure = getSectionSunExposure(section, sunPosition.altitudeDegrees, adjustedSunAzimuth);
    
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
  return sectionSunData.filter(item => {
    const { section, sunExposure } = item;
    
    // Check exposure range
    if (criteria.minExposure !== undefined && sunExposure < criteria.minExposure) {
      return false;
    }
    if (criteria.maxExposure !== undefined && sunExposure > criteria.maxExposure) {
      return false;
    }
    
    // Check level
    if (criteria.levels && !criteria.levels.includes(section.level)) {
      return false;
    }
    
    // Check covered preference
    if (criteria.covered !== undefined && section.covered !== criteria.covered) {
      return false;
    }
    
    // Check price range
    if (criteria.priceRange && section.price && !criteria.priceRange.includes(section.price)) {
      return false;
    }
    
    return true;
  });
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
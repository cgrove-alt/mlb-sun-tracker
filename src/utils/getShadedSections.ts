// Integration of 3D shade calculation with existing system
// Provides getShadedSections() function with enhanced 3D calculations

import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { cloudTransmissionFactor, getSunPosition } from './sunCalculations';
import { WeatherData } from '../services/weatherApi';
import { 
  ShadeCalculator3D, 
  createSunPosition
} from './shadeCalculation3DOptimized';
import { getStadium3DModel } from '../data/stadium3DGeometry';
import { horizonBlockFactor } from './bowlGeometry';

export interface ShadedSection {
  section: StadiumSection;
  /**
   * GEOMETRIC shade, 0–100. Cloud cover is reported separately in
   * `effectiveSunPercent` rather than added here: clouds dim the sun, they do
   * not move the shadow line, and adding them made an exposed seat read as a
   * shaded one whenever the forecast was grey.
   */
  shadePercentage: number;
  isFullyShaded: boolean;
  isPartiallyShaded: boolean;
  isInSun: boolean;
  /** Direct sun still reaching the section after cloud cover, 0–100. */
  effectiveSunPercent: number;
}

// Performance optimization: Cache calculators
const calculatorCache = new Map<string, ShadeCalculator3D>();

// Get or create calculator for stadium
function getCalculatorForStadium(stadium: Stadium, sections: StadiumSection[]): ShadeCalculator3D {
  if (calculatorCache.has(stadium.id)) {
    return calculatorCache.get(stadium.id)!;
  }

  const stadium3D = getStadium3DModel(stadium, sections);
  const calculator = new ShadeCalculator3D(stadium3D);

  calculatorCache.set(stadium.id, calculator);
  return calculator;
}

// Main function to get shaded sections
export function getShadedSections(
  stadium: Stadium,
  gameDateTime: Date,
  weather?: WeatherData,
  sections?: StadiumSection[]
): ShadedSection[] {
  // Use provided sections or empty array (caller should provide to avoid bundle bloat)
  const stadiumSections = sections || [];

  // Get sun position
  const sunPos = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude);

  // Early return for night games or fixed roof stadiums
  if (sunPos.altitudeDegrees <= 0 || stadium.roof === 'fixed') {
    return stadiumSections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false,
      effectiveSunPercent: 0
    }));
  }

  // Get 3D calculator
  const calculator = getCalculatorForStadium(stadium, stadiumSections);

  // Convert sun position format
  const sunPosition3D = createSunPosition(sunPos.azimuthDegrees, sunPos.altitudeDegrees);

  // Calculate shade for all sections
  const shadeResults = calculator.calculateAllSectionsShade(sunPosition3D);

  // Apply weather adjustments
  const weatherMultiplier = weather ? cloudTransmissionFactor(weather) : 1.0;
  const skyVisibility = horizonBlockFactor(sunPos.altitudeDegrees);

  // Convert results to expected format
  const shadedSections: ShadedSection[] = [];

  for (const section of stadiumSections) {
    const shadeResult = shadeResults.get(section.id);
    if (!shadeResult) {
      // Fallback for sections without 3D data
      shadedSections.push({
        section,
        shadePercentage: 0,
        isFullyShaded: false,
        isPartiallyShaded: false,
        isInSun: true,
        effectiveSunPercent: Math.round(100 * weatherMultiplier * skyVisibility)
      });
      continue;
    }
    
    // Geometry stays geometry; cloud cover is reported alongside it.
    const shade = shadeResult.percentageInShade;

    shadedSections.push({
      section,
      shadePercentage: Math.round(shade),
      isFullyShaded: shade >= 95,
      isPartiallyShaded: shade > 5 && shade < 95,
      isInSun: shade < 50,
      effectiveSunPercent: Math.round((100 - shade) * weatherMultiplier * skyVisibility)
    });
  }
  
  return shadedSections;
}

// Performance-optimized version for quick estimates
export function getShadedSectionsQuick(
  stadium: Stadium,
  gameDateTime: Date,
  weather?: WeatherData,
  sections?: StadiumSection[]
): ShadedSection[] {
  // Use provided sections or empty array (caller should provide to avoid bundle bloat)
  const stadiumSections = sections || [];

  const sunPos = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude);

  // Early returns
  if (sunPos.altitudeDegrees <= 0 || stadium.roof === 'fixed') {
    return stadiumSections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false,
      effectiveSunPercent: 0
    }));
  }

  const calculator = getCalculatorForStadium(stadium, stadiumSections);
  const sunPosition3D = createSunPosition(sunPos.azimuthDegrees, sunPos.altitudeDegrees);
  const weatherMultiplier = weather ? cloudTransmissionFactor(weather) : 1.0;
  const skyVisibility = horizonBlockFactor(sunPos.altitudeDegrees);

  const shadedSectionsList: ShadedSection[] = [];

  // Use quick estimation method
  const stadium3D = getStadium3DModel(stadium, stadiumSections);
  for (const sectionGeometry of stadium3D.sections) {
    const section = stadiumSections.find(s => s.id === sectionGeometry.id);
    if (!section) continue;

    const estimatedShade = calculator.estimateSectionShade(sectionGeometry, sunPosition3D);

    shadedSectionsList.push({
      section,
      shadePercentage: Math.round(estimatedShade),
      isFullyShaded: estimatedShade >= 95,
      isPartiallyShaded: estimatedShade > 5 && estimatedShade < 95,
      isInSun: estimatedShade < 50,
      effectiveSunPercent: Math.round((100 - estimatedShade) * weatherMultiplier * skyVisibility)
    });
  }

  return shadedSectionsList;
}

// Get shaded sections for a specific time range
export function getShadedSectionsForGame(
  stadium: Stadium,
  gameStartTime: Date,
  gameDurationHours: number = 3,
  weather?: WeatherData
): Map<string, number> {
  const intervalMinutes = 30;
  const intervals = Math.ceil(gameDurationHours * 60 / intervalMinutes);
  const sectionShadeMap = new Map<string, number[]>();
  
  // Calculate shade for each interval
  for (let i = 0; i <= intervals; i++) {
    const time = new Date(gameStartTime.getTime() + i * intervalMinutes * 60000);
    const shadedSections = getShadedSectionsQuick(stadium, time, weather);
    
    for (const result of shadedSections) {
      if (!sectionShadeMap.has(result.section.id)) {
        sectionShadeMap.set(result.section.id, []);
      }
      sectionShadeMap.get(result.section.id)!.push(result.shadePercentage);
    }
  }
  
  // Calculate average shade percentage for each section
  const averageShadeMap = new Map<string, number>();
  sectionShadeMap.forEach((shadeValues, sectionId) => {
    const average = shadeValues.reduce((a, b) => a + b, 0) / shadeValues.length;
    averageShadeMap.set(sectionId, Math.round(average));
  });
  
  return averageShadeMap;
}

// Batch process multiple stadiums (for performance testing)
export async function getShadedSectionsForAllStadiums(
  gameDateTime: Date,
  weather?: Map<string, WeatherData>
): Promise<Map<string, ShadedSection[]>> {
  const results = new Map<string, ShadedSection[]>();
  
  // Process in batches to avoid blocking
  const batchSize = 5;
  for (let i = 0; i < MLB_STADIUMS.length; i += batchSize) {
    const batch = MLB_STADIUMS.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async stadium => {
        const stadiumWeather = weather?.get(stadium.id);
        const shadedSections = getShadedSectionsQuick(stadium, gameDateTime, stadiumWeather);
        results.set(stadium.id, shadedSections);
      })
    );
    
    // Small delay to keep UI responsive
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  return results;
}

// Clear caches (useful for memory management)
export function clearShadeCalculatorCache(): void {
  calculatorCache.clear();
}

// Integration of 3D shade calculation with existing system
// Provides getShadedSections() function with enhanced 3D calculations

import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { StadiumSection, getStadiumSections } from '../data/stadiumSections';
import { getSunPosition, SunPosition as LegacySunPosition } from './sunCalculations';
import { WeatherData } from '../services/weatherApi';
import { 
  ShadeCalculator3D, 
  createSunPosition,
  SectionShadeResult
} from './shadeCalculation3DOptimized';
import { getStadium3DModel } from '../data/stadium3DGeometry';

export interface ShadedSection {
  section: StadiumSection;
  shadePercentage: number;
  isFullyShaded: boolean;
  isPartiallyShaded: boolean;
  isInSun: boolean;
}

// Performance optimization: Cache calculators
const calculatorCache = new Map<string, ShadeCalculator3D>();

// Get or create calculator for stadium
function getCalculatorForStadium(stadium: Stadium): ShadeCalculator3D {
  if (calculatorCache.has(stadium.id)) {
    return calculatorCache.get(stadium.id)!;
  }
  
  const sections = getStadiumSections(stadium.id);
  const stadium3D = getStadium3DModel(stadium, sections);
  const calculator = new ShadeCalculator3D(stadium3D);
  
  calculatorCache.set(stadium.id, calculator);
  return calculator;
}

// Main function to get shaded sections
export function getShadedSections(
  stadium: Stadium,
  gameDateTime: Date,
  weather?: WeatherData
): ShadedSection[] {
  // Get sun position
  const sunPos = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude);
  
  // Early return for night games or fixed roof stadiums
  if (sunPos.altitudeDegrees <= 0 || stadium.roof === 'fixed') {
    const sections = getStadiumSections(stadium.id);
    return sections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false
    }));
  }
  
  // Get 3D calculator
  const calculator = getCalculatorForStadium(stadium);
  
  // Convert sun position format
  const sunPosition3D = createSunPosition(sunPos.azimuthDegrees, sunPos.altitudeDegrees);
  
  // Calculate shade for all sections
  const shadeResults = calculator.calculateAllSectionsShade(sunPosition3D);
  
  // Apply weather adjustments
  let weatherMultiplier = 1.0;
  if (weather) {
    weatherMultiplier = calculateWeatherMultiplier(weather);
  }
  
  // Convert results to expected format
  const shadedSections: ShadedSection[] = [];
  const sections = getStadiumSections(stadium.id);
  
  for (const section of sections) {
    const shadeResult = shadeResults.get(section.id);
    if (!shadeResult) {
      // Fallback for sections without 3D data
      shadedSections.push({
        section,
        shadePercentage: 0,
        isFullyShaded: false,
        isPartiallyShaded: false,
        isInSun: true
      });
      continue;
    }
    
    // Apply weather impact
    const adjustedShadePercentage = Math.min(
      100,
      shadeResult.percentageInShade + (100 - shadeResult.percentageInShade) * (1 - weatherMultiplier)
    );
    
    shadedSections.push({
      section,
      shadePercentage: Math.round(adjustedShadePercentage),
      isFullyShaded: adjustedShadePercentage >= 95,
      isPartiallyShaded: adjustedShadePercentage > 5 && adjustedShadePercentage < 95,
      isInSun: adjustedShadePercentage < 50
    });
  }
  
  return shadedSections;
}

// Performance-optimized version for quick estimates
export function getShadedSectionsQuick(
  stadium: Stadium,
  gameDateTime: Date,
  weather?: WeatherData
): ShadedSection[] {
  const sunPos = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude);
  
  // Early returns
  if (sunPos.altitudeDegrees <= 0 || stadium.roof === 'fixed') {
    const sections = getStadiumSections(stadium.id);
    return sections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false
    }));
  }
  
  const calculator = getCalculatorForStadium(stadium);
  const sunPosition3D = createSunPosition(sunPos.azimuthDegrees, sunPos.altitudeDegrees);
  const weatherMultiplier = weather ? calculateWeatherMultiplier(weather) : 1.0;
  
  const sections = getStadiumSections(stadium.id);
  const shadedSections: ShadedSection[] = [];
  
  // Use quick estimation method
  const stadium3D = getStadium3DModel(stadium, sections);
  for (const sectionGeometry of stadium3D.sections) {
    const section = sections.find(s => s.id === sectionGeometry.id);
    if (!section) continue;
    
    const estimatedShade = calculator.estimateSectionShade(sectionGeometry, sunPosition3D);
    const adjustedShade = Math.min(
      100,
      estimatedShade + (100 - estimatedShade) * (1 - weatherMultiplier)
    );
    
    shadedSections.push({
      section,
      shadePercentage: Math.round(adjustedShade),
      isFullyShaded: adjustedShade >= 95,
      isPartiallyShaded: adjustedShade > 5 && adjustedShade < 95,
      isInSun: adjustedShade < 50
    });
  }
  
  return shadedSections;
}

// Calculate weather impact multiplier
function calculateWeatherMultiplier(weather: WeatherData): number {
  const { cloudCover, conditions, precipitationProbability } = weather;
  
  if ((precipitationProbability && precipitationProbability > 70) || 
      conditions.some(c => c.main === 'Rain' || c.main === 'Snow')) {
    return 0.1;
  } else if (precipitationProbability && precipitationProbability > 30) {
    return 0.4;
  } else if (cloudCover > 80) {
    return 0.4;
  } else if (cloudCover > 60) {
    return 0.6;
  } else if (cloudCover > 40) {
    return 0.8;
  } else if (cloudCover > 15) {
    return 0.9;
  }
  
  return 1.0;
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
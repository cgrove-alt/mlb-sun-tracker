// Unified Stadium Shade Calculation System
// Supports MLB, MiLB, and NFL stadiums with consistent interface

import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { MiLBStadium } from '../data/milbStadiums';
import { NFLStadium, NFL_STADIUMS } from '../data/nflStadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getMiLBStadiumSections } from '../data/milbStadiumSections';
import { getNFLStadiumSections } from '../data/nflStadiumSections';
import { getSunPosition } from './sunCalculations';
import { WeatherData } from '../services/weatherApi';
import { 
  ShadeCalculator3D,
  createSunPosition
} from './shadeCalculation3DOptimized';
import { getStadium3DModel, AnyStadium } from '../data/stadium3DGeometry';
import { getStadiumObstructions } from '../data/stadiumObstructions';

// Unified stadium interface
export interface UnifiedStadium {
  id: string;
  name: string;
  type: 'MLB' | 'MiLB' | 'NFL';
  team: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
}

// Convert MLB stadium to unified format
function mlbToUnified(stadium: Stadium): UnifiedStadium {
  return {
    ...stadium,
    type: 'MLB' as const,
    team: stadium.team
  };
}

// Convert MiLB stadium to unified format
function milbToUnified(stadium: MiLBStadium): UnifiedStadium {
  return {
    id: stadium.id,
    name: stadium.name,
    type: 'MiLB' as const,
    team: stadium.team,
    city: stadium.city,
    state: stadium.state,
    latitude: stadium.latitude,
    longitude: stadium.longitude,
    orientation: stadium.orientation,
    capacity: stadium.capacity,
    roof: stadium.roof,
    timezone: stadium.timezone,
    roofHeight: stadium.roofHeight,
    roofOverhang: stadium.roofOverhang,
    upperDeckHeight: stadium.upperDeckHeight
  };
}

// Convert NFL stadium to unified format
function nflToUnified(stadium: NFLStadium): UnifiedStadium {
  return {
    id: stadium.id,
    name: stadium.name,
    type: 'NFL' as const,
    team: stadium.team,
    city: stadium.city,
    state: stadium.state,
    latitude: stadium.latitude,
    longitude: stadium.longitude,
    orientation: stadium.orientation,
    capacity: stadium.capacity,
    roof: stadium.roof,
    timezone: stadium.timezone,
    roofHeight: stadium.roofHeight,
    roofOverhang: stadium.upperDeckHeight ? 30 : undefined, // Estimate overhang
    upperDeckHeight: stadium.upperDeckHeight
  };
}

// Cache for unified calculators
const unifiedCalculatorCache = new Map<string, ShadeCalculator3D>();

// Get or create calculator for any stadium type
export function getUnifiedCalculator(stadium: UnifiedStadium, sections: StadiumSection[]): ShadeCalculator3D {
  const cacheKey = `${stadium.type}-${stadium.id}`;
  
  if (unifiedCalculatorCache.has(cacheKey)) {
    return unifiedCalculatorCache.get(cacheKey)!;
  }
  
  // Create stadium model with appropriate obstructions
  const stadiumModel = getStadium3DModel(stadium as AnyStadium, sections);
  
  // Add stadium-specific obstructions
  const specificObstructions = getStadiumObstructions(stadium.id);
  stadiumModel.obstructions.push(...specificObstructions);
  
  const calculator = new ShadeCalculator3D(stadiumModel);
  unifiedCalculatorCache.set(cacheKey, calculator);
  
  return calculator;
}

// Unified shaded sections interface
export interface UnifiedShadedSection {
  section: StadiumSection;
  shadePercentage: number;
  isFullyShaded: boolean;
  isPartiallyShaded: boolean;
  isInSun: boolean;
  stadiumType: 'MLB' | 'MiLB' | 'NFL';
}

// Calculate shaded sections for any stadium type
export function getUnifiedShadedSections(
  stadium: UnifiedStadium,
  gameDateTime: Date,
  weather?: WeatherData,
  sections?: StadiumSection[]
): UnifiedShadedSection[] {
  // Get sun position
  const sunPos = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude);

  // Use provided sections or get appropriate sections for stadium type
  const stadiumSections = sections || getStadiumSectionsForType(stadium);
  
  // Early return for night games or fixed roof
  if (sunPos.altitudeDegrees <= 0 || stadium.roof === 'fixed') {
    return stadiumSections.map(section => ({
      section,
      shadePercentage: 100,
      isFullyShaded: true,
      isPartiallyShaded: false,
      isInSun: false,
      stadiumType: stadium.type
    }));
  }
  
  // Get calculator
  const calculator = getUnifiedCalculator(stadium, stadiumSections);

  // Convert sun position
  const sunPosition3D = createSunPosition(sunPos.azimuthDegrees, sunPos.altitudeDegrees);

  // Calculate shade
  const shadeResults = calculator.calculateAllSectionsShade(sunPosition3D);

  // Apply weather adjustments
  let weatherMultiplier = 1.0;
  if (weather) {
    weatherMultiplier = calculateWeatherMultiplier(weather);
  }

  // Convert results
  const shadedSections: UnifiedShadedSection[] = [];

  for (const section of stadiumSections) {
    const shadeResult = shadeResults.get(section.id);
    if (!shadeResult) {
      shadedSections.push({
        section,
        shadePercentage: 0,
        isFullyShaded: false,
        isPartiallyShaded: false,
        isInSun: true,
        stadiumType: stadium.type
      });
      continue;
    }
    
    const adjustedShadePercentage = Math.min(
      100,
      shadeResult.percentageInShade + (100 - shadeResult.percentageInShade) * (1 - weatherMultiplier)
    );
    
    shadedSections.push({
      section,
      shadePercentage: Math.round(adjustedShadePercentage),
      isFullyShaded: adjustedShadePercentage >= 95,
      isPartiallyShaded: adjustedShadePercentage > 5 && adjustedShadePercentage < 95,
      isInSun: adjustedShadePercentage < 50,
      stadiumType: stadium.type
    });
  }
  
  return shadedSections;
}

// Get sections for different stadium types
// Note: For MLB, callers should provide sections via async import to avoid bundling all stadiums
function getStadiumSectionsForType(stadium: UnifiedStadium): StadiumSection[] {
  // For MLB, return empty array - caller should provide sections
  if (stadium.type === 'MLB') {
    console.warn('[getStadiumSectionsForType] MLB stadium sections should be provided by caller to avoid bundle bloat');
    return [];
  }

  // Official inventories only. Empty is honest; a generic ring is not.
  if (stadium.type === 'MiLB') {
    return getMiLBStadiumSections(stadium.id);
  }

  if (stadium.type === 'NFL') {
    return getNFLStadiumSections(stadium.id);
  }

  return [];
}


// Calculate weather impact
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

// Batch process all stadiums across types
export async function getAllStadiumsShadedSections(
  gameDateTime: Date,
  includeTypes: ('MLB' | 'MiLB' | 'NFL')[] = ['MLB', 'MiLB', 'NFL']
): Promise<Map<string, UnifiedShadedSection[]>> {
  const results = new Map<string, UnifiedShadedSection[]>();
  
  // Process MLB stadiums
  if (includeTypes.includes('MLB')) {
    for (const stadium of MLB_STADIUMS) {
      const unified = mlbToUnified(stadium);
      const shadedSections = getUnifiedShadedSections(unified, gameDateTime);
      results.set(`mlb-${stadium.id}`, shadedSections);
    }
  }
  
  // Process NFL stadiums
  if (includeTypes.includes('NFL')) {
    for (const stadium of NFL_STADIUMS) {
      const unified = nflToUnified(stadium);
      const shadedSections = getUnifiedShadedSections(unified, gameDateTime);
      results.set(`nfl-${stadium.id}`, shadedSections);
    }
  }
  
  // MiLB stadiums would be processed similarly when data is available
  
  return results;
}

// Clear unified caches
export function clearUnifiedCaches(): void {
  unifiedCalculatorCache.clear();
}
import { Stadium } from '../data/stadiums';
import { StadiumSection, isSectionInSun, getSectionSunExposure } from '../data/stadiumSections';
import { WeatherData } from '../services/weatherApi';
import { getVenueSections } from '../data/venueSections';
import { processInChunks } from './performanceUtils';
import { 
  SunPosition, 
  SeatingSectionSun, 
  getSunPosition,
  calculateDetailedSectionSunExposure as originalCalculateDetailedSectionSunExposure,
  calculateEnhancedSectionSunExposure as originalCalculateEnhancedSectionSunExposure
} from './sunCalculations';

// Optimized version that processes sections in chunks
export async function calculateDetailedSectionSunExposureOptimized(
  stadium: Stadium,
  sunPosition: SunPosition,
  weather?: WeatherData,
  onProgress?: (progress: number) => void,
  sections?: StadiumSection[]
): Promise<SeatingSectionSun[]> {
  // Use provided sections or fall back to venue sections
  let stadiumSections = sections;
  if (!stadiumSections || stadiumSections.length === 0) {
    // Try venue sections (for MiLB and NFL venues)
    stadiumSections = getVenueSections(stadium.id);
  }

  // If stadium has a fixed roof, quickly return all sections as not in sun
  if (stadium.roof === 'fixed') {
    return stadiumSections.map(section => ({
      section,
      inSun: false,
      sunExposure: 0
    }));
  }

  // For small numbers of sections, use the original synchronous function
  if (stadiumSections.length < 100) {
    return originalCalculateDetailedSectionSunExposure(stadium, sunPosition, weather, stadiumSections);
  }
  
  // Calculate weather impact
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
  
  // Don't adjust sun azimuth - isSectionInSun expects absolute compass degrees
  // and the section angles are already in absolute compass coordinates
  const sunAzimuth = sunPosition.azimuthDegrees;
  
  let processedCount = 0;
  
  // Process sections in chunks
  const results = await processInChunks(
    stadiumSections,
    50, // Process 50 sections at a time
    (section) => {
      const inSun = isSectionInSun(section, sunAzimuth, sunPosition.altitudeDegrees);
      let sunExposure = getSectionSunExposure(section, sunPosition.altitudeDegrees, sunAzimuth);
      sunExposure = sunExposure * weatherMultiplier;

      processedCount++;
      if (onProgress) {
        onProgress(processedCount / stadiumSections.length);
      }

      return {
        section,
        inSun: inSun && sunExposure > 10,
        sunExposure: Math.round(sunExposure)
      };
    },
    10 // 10ms delay between chunks
  );

  return results;
}

// Cache for stadium sections to avoid repeated lookups
// NOTE: Deprecated - callers should use getStadiumSectionsAsync() directly
const sectionCache = new Map<string, any[]>();

export function getCachedStadiumSections(stadiumId: string, sections?: StadiumSection[]) {
  if (sections) {
    sectionCache.set(stadiumId, sections);
    return sections;
  }
  if (!sectionCache.has(stadiumId)) {
    console.warn('[getCachedStadiumSections] No sections provided and none in cache. Use getStadiumSectionsAsync() instead.');
    return [];
  }
  return sectionCache.get(stadiumId)!;
}

// Clear cache when needed (e.g., on stadium change)
export function clearSectionCache(stadiumId?: string) {
  if (stadiumId) {
    sectionCache.delete(stadiumId);
  } else {
    sectionCache.clear();
  }
}
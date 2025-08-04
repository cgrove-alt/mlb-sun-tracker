import { Stadium } from '../data/stadiums';
import { getStadiumSections, isSectionInSun, getSectionSunExposure } from '../data/stadiumSections';
import { WeatherData } from '../services/weatherApi';
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
  onProgress?: (progress: number) => void
): Promise<SeatingSectionSun[]> {
  const sections = getStadiumSections(stadium.id);
  
  // If stadium has a fixed roof, quickly return all sections as not in sun
  if (stadium.roof === 'fixed') {
    return sections.map(section => ({
      section,
      inSun: false,
      sunExposure: 0
    }));
  }
  
  // For small numbers of sections, use the original synchronous function
  if (sections.length < 100) {
    return originalCalculateDetailedSectionSunExposure(stadium, sunPosition, weather);
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
  
  const adjustedSunAzimuth = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
  
  let processedCount = 0;
  
  // Process sections in chunks
  const results = await processInChunks(
    sections,
    50, // Process 50 sections at a time
    (section) => {
      const inSun = isSectionInSun(section, adjustedSunAzimuth, sunPosition.altitudeDegrees);
      let sunExposure = getSectionSunExposure(section, sunPosition.altitudeDegrees, adjustedSunAzimuth);
      sunExposure = sunExposure * weatherMultiplier;
      
      processedCount++;
      if (onProgress) {
        onProgress(processedCount / sections.length);
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
const sectionCache = new Map<string, any[]>();

export function getCachedStadiumSections(stadiumId: string) {
  if (!sectionCache.has(stadiumId)) {
    sectionCache.set(stadiumId, getStadiumSections(stadiumId));
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
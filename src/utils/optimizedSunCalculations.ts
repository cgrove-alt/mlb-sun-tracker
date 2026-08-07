import { Stadium } from '../data/stadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { isSectionInSun, getSectionSunExposure } from './sectionSunCalculations';
import { WeatherData } from '../services/weatherApi';
import { getVenueSections } from '../data/venueSections';
import { processInChunks } from './performanceUtils';
import {
  SunPosition,
  SeatingSectionSun,
  calculateDetailedSectionSunExposure as originalCalculateDetailedSectionSunExposure,
  cloudTransmissionFactor,
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
  
  // Cloud transmission is reported separately from the geometry — see the
  // SeatingSectionSun docs in sunCalculations.ts. Kept identical to the
  // synchronous path so the two never diverge.
  const cloudTransmission = weather ? cloudTransmissionFactor(weather) : 1.0;


  // sunAzimuth is absolute compass; section.baseAngle is stadium-local. The
  // section helpers do the conversion internally given `stadium.orientation`.
  const sunAzimuth = sunPosition.azimuthDegrees;
  const orientation = stadium.orientation;

  let processedCount = 0;

  // Process sections in chunks
  const results = await processInChunks(
    stadiumSections,
    50, // Process 50 sections at a time
    (section) => {
      const inSun = isSectionInSun(section, sunAzimuth, sunPosition.altitudeDegrees, orientation);
      const sunExposure = getSectionSunExposure(section, sunPosition.altitudeDegrees, sunAzimuth, orientation);

      processedCount++;
      if (onProgress) {
        onProgress(processedCount / stadiumSections.length);
      }

      return {
        section,
        inSun: inSun && sunExposure > 10,
        sunExposure: Math.round(sunExposure),
        effectiveSunExposure: Math.round(sunExposure * cloudTransmission)
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
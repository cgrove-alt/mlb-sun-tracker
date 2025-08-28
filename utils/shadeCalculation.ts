// Utility for handling shade calculation from StickyShadeBar

import { getSunPosition, calculateDetailedSectionSunExposure } from '../src/utils/sunCalculations';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { getWeatherForGame } from '../src/services/weatherApi';

export interface ShadeCalculationParams {
  stadiumId: string;
  date: string;
  time: string;
  section?: string;
}

export interface ShadeCalculationResult {
  sunPosition: {
    azimuth: number;
    altitude: number;
  };
  sectionData?: any[];
  specificSection?: any;
  weather?: any;
}

/**
 * Calculate shade for a specific date/time at a stadium
 */
export async function calculateShade(params: ShadeCalculationParams): Promise<ShadeCalculationResult> {
  const { stadiumId, date, time, section } = params;
  
  // Find the stadium
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    throw new Error(`Stadium ${stadiumId} not found`);
  }
  
  // Create date object from date and time
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const gameDateTime = new Date(year, month - 1, day, hour, minute);
  
  // Calculate sun position
  const sunPosition = getSunPosition(
    gameDateTime,
    stadium.latitude,
    stadium.longitude
  );
  
  // Get weather data (optional)
  let weather;
  try {
    weather = await getWeatherForGame(
      stadium.latitude,
      stadium.longitude,
      gameDateTime
    );
  } catch (error) {
    console.warn('Weather data unavailable:', error);
  }
  
  // Calculate shade for all sections
  const sectionData = calculateDetailedSectionSunExposure(
    stadium,
    sunPosition,
    weather
  );
  
  // Find specific section if requested
  let specificSection;
  if (section) {
    specificSection = sectionData.find(s => 
      s.section.id === section || 
      s.section.name.toLowerCase().includes(section.toLowerCase())
    );
  }
  
  return {
    sunPosition: {
      azimuth: sunPosition.azimuthDegrees,
      altitude: sunPosition.altitudeDegrees
    },
    sectionData,
    specificSection,
    weather
  };
}

/**
 * Setup event listener for shade calculation requests
 */
export function setupShadeCalculationListener() {
  const handleCalculateShade = async (event: Event) => {
    const customEvent = event as CustomEvent;
    const { date, time, section, stadiumId } = customEvent.detail;
    
    try {
      const result = await calculateShade({
        stadiumId,
        date,
        time,
        section
      });
      
      // Dispatch result event
      window.dispatchEvent(new CustomEvent('shadeCalculated', {
        detail: result
      }));
    } catch (error) {
      console.error('Shade calculation failed:', error);
      
      // Dispatch error event
      window.dispatchEvent(new CustomEvent('shadeCalculationError', {
        detail: { error: (error as Error).message }
      }));
    }
  };
  
  window.addEventListener('calculateShade', handleCalculateShade);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('calculateShade', handleCalculateShade);
  };
}
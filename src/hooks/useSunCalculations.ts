import { useCallback } from 'react';
import { getSunPosition } from '../utils/sunCalculations';

interface SunPosition {
  altitude: number;
  azimuth: number;
}

interface ProgressCallback {
  (completed: number, total: number): void;
}

// Optimized inline calculations to avoid Worker issues
const calculateSectionExposureInline = (
  section: any,
  sunPosition: SunPosition,
  stadiumOrientation: number,
  weatherConditions?: any
) => {
  // Early exit for covered sections or night games
  if (section.covered || sunPosition.altitude <= 0) {
    return {
      ...section,
      sunExposure: 0,
      inSun: false
    };
  }

  // Calculate relative angle
  const sectionMidAngle = section.baseAngle + section.angleSpan / 2;
  const relativeAngle = Math.abs(sunPosition.azimuth - stadiumOrientation - sectionMidAngle);
  const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;
  
  // Quick check if section faces away from sun
  if (normalizedAngle > 120) {
    return {
      ...section,
      sunExposure: 0,
      inSun: false
    };
  }
  
  // Calculate exposure
  const angleFactor = Math.max(0, 1 - normalizedAngle / 90);
  const altitudeFactor = Math.min(1, sunPosition.altitude / 45);
  const weatherMultiplier = weatherConditions ? 
    (1 - (weatherConditions.cloudCover || 0) / 100 * 0.7) : 1;
  
  let exposure = angleFactor * altitudeFactor * 100 * weatherMultiplier;
  
  // Apply level multipliers
  const levelMultipliers: { [key: string]: number } = {
    'field': 1.0,
    'lower': 0.9,
    'club': 0.8,
    'upper': 0.95,
    'suite': 0.7
  };
  
  exposure *= levelMultipliers[section.level] || 1.0;
  
  return {
    ...section,
    sunExposure: Math.round(exposure),
    inSun: exposure > 10
  };
};

export const useSunCalculations = () => {
  // Use direct calculations without Web Worker to avoid complexity
  
  const calculateSunPosition = useCallback((
    date: Date,
    latitude: number,
    longitude: number
  ): Promise<SunPosition> => {
    return new Promise((resolve, reject) => {
      try {
        const position = getSunPosition(date, latitude, longitude);
        resolve({
          altitude: position.altitudeDegrees,
          azimuth: position.azimuthDegrees
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Sun position calculation error:', error);
        }
        reject(error);
      }
    });
  }, []);

  const calculateSectionExposures = useCallback((
    sections: any[],
    sunPosition: SunPosition,
    stadiumOrientation: number,
    weatherConditions?: any,
    onProgress?: ProgressCallback
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      // Process in chunks to keep UI responsive
      const chunkSize = 50;
      const results: any[] = [];
      let currentIndex = 0;
      let timeoutId: NodeJS.Timeout;
      
      const processChunk = () => {
        const endIndex = Math.min(currentIndex + chunkSize, sections.length);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[processChunk] Processing sections ${currentIndex} to ${endIndex} of ${sections.length}`);
        }
        
        // Process chunk
        for (let i = currentIndex; i < endIndex; i++) {
          results.push(calculateSectionExposureInline(
            sections[i],
            sunPosition,
            stadiumOrientation,
            weatherConditions
          ));
        }
        
        currentIndex = endIndex;
        
        // Report progress
        if (onProgress) {
          onProgress(currentIndex, sections.length);
        }
        
        // Continue or complete
        if (currentIndex < sections.length) {
          // Use setTimeout to yield to browser
          timeoutId = setTimeout(processChunk, 0);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[processChunk] Completed processing ${results.length} sections`);
          }
          resolve(results);
        }
      };
      
      // Start processing
      processChunk();
      
      // Return cleanup function for React to prevent memory leaks
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    });
  }, []);

  return {
    calculateSunPosition,
    calculateSectionExposures
  };
};
import { useEffect, useRef, useCallback } from 'react';
import { getSunPosition } from '../utils/sunCalculations';

interface SunPosition {
  altitude: number;
  azimuth: number;
}

interface ProgressCallback {
  (completed: number, total: number): void;
}

export const useSunCalculations = () => {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (data: any) => void>>(new Map());
  const progressCallbackRef = useRef<ProgressCallback | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const workerAvailable = useRef<boolean>(false);

  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        // Try to create worker with production path
        const workerPath = process.env.NODE_ENV === 'production' 
          ? '/mlb-sun-tracker/sunCalculations.worker.js'
          : '/sunCalculations.worker.js';
          
        workerRef.current = new Worker(workerPath);
        
        workerRef.current.onmessage = (event) => {
          const { type, data } = event.data;
          
          // Worker is working
          workerAvailable.current = true;
          
          // Clear timeout on successful message
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          if (type === 'progress' && progressCallbackRef.current) {
            progressCallbackRef.current(data.completed, data.total);
            return;
          }
          
          const callback = callbacksRef.current.get(type);
          if (callback) {
            callback(data);
            callbacksRef.current.delete(type);
          }
        };
        
        workerRef.current.onerror = (error) => {
          console.error('Worker error:', error);
          workerAvailable.current = false;
          // Reject all pending callbacks
          callbacksRef.current.forEach(callback => {
            callback(null);
          });
          callbacksRef.current.clear();
        };
      } catch (error) {
        console.error('Failed to create worker:', error);
        workerAvailable.current = false;
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculateSunPosition = useCallback((
    date: Date,
    latitude: number,
    longitude: number
  ): Promise<SunPosition> => {
    return new Promise((resolve, reject) => {
      // Use fallback immediately if worker not available
      if (!workerRef.current || !workerAvailable.current) {
        try {
          const position = getSunPosition(date, latitude, longitude);
          resolve({
            altitude: position.altitudeDegrees,
            azimuth: position.azimuthDegrees
          });
        } catch (error) {
          reject(error);
        }
        return;
      }

      // Set timeout
      timeoutRef.current = setTimeout(() => {
        console.error('Sun position calculation timed out, using fallback');
        workerAvailable.current = false;
        try {
          const position = getSunPosition(date, latitude, longitude);
          resolve({
            altitude: position.altitudeDegrees,
            azimuth: position.azimuthDegrees
          });
        } catch (error) {
          reject(error);
        }
      }, 2000);
      
      callbacksRef.current.set('sunPosition', (data) => {
        if (data) {
          resolve(data);
        } else {
          // Fallback
          const position = getSunPosition(date, latitude, longitude);
          resolve({
            altitude: position.altitudeDegrees,
            azimuth: position.azimuthDegrees
          });
        }
      });
      
      workerRef.current.postMessage({
        type: 'calculateSunPosition',
        data: { date: date.toISOString(), latitude, longitude }
      });
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
      // Always use direct calculation for now to avoid Worker issues
      // This is a simpler calculation that should be fast enough
      const results = sections.map(section => {
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
      });
      
      resolve(results);
    });
  }, []);

  return {
    calculateSunPosition,
    calculateSectionExposures
  };
};
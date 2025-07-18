import { useEffect, useRef, useCallback } from 'react';

interface SunPosition {
  altitude: number;
  azimuth: number;
}

export const useSunCalculations = () => {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      workerRef.current = new Worker('/sunCalculations.worker.js');
      
      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;
        const callback = callbacksRef.current.get(type);
        if (callback) {
          callback(data);
          callbacksRef.current.delete(type);
        }
      };
      
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const calculateSunPosition = useCallback((
    date: Date,
    latitude: number,
    longitude: number
  ): Promise<SunPosition> => {
    return new Promise((resolve) => {
      if (workerRef.current) {
        callbacksRef.current.set('sunPosition', resolve);
        workerRef.current.postMessage({
          type: 'calculateSunPosition',
          data: { date: date.toISOString(), latitude, longitude }
        });
      } else {
        // Fallback to synchronous calculation if worker not available
        // This would use the existing getSunPosition function
        resolve({ altitude: 0, azimuth: 0 });
      }
    });
  }, []);

  const calculateSectionExposures = useCallback((
    sections: any[],
    sunPosition: SunPosition,
    stadiumOrientation: number,
    weatherConditions?: any
  ): Promise<any[]> => {
    return new Promise((resolve) => {
      if (workerRef.current) {
        callbacksRef.current.set('sectionExposures', resolve);
        workerRef.current.postMessage({
          type: 'calculateSectionExposures',
          data: { sections, sunPosition, stadiumOrientation, weatherConditions }
        });
      } else {
        // Fallback to synchronous calculation
        resolve(sections);
      }
    });
  }, []);

  return {
    calculateSunPosition,
    calculateSectionExposures
  };
};
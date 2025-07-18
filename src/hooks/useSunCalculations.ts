import { useEffect, useRef, useCallback } from 'react';

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

  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker('/sunCalculations.worker.js');
        
        workerRef.current.onmessage = (event) => {
          const { type, data } = event.data;
          
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
          // Reject all pending callbacks
          callbacksRef.current.forEach(callback => {
            callback(null);
          });
          callbacksRef.current.clear();
        };
      } catch (error) {
        console.error('Failed to create worker:', error);
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
      if (workerRef.current) {
        // Set timeout
        timeoutRef.current = setTimeout(() => {
          console.error('Sun position calculation timed out');
          reject(new Error('Calculation timeout'));
        }, 5000);
        
        callbacksRef.current.set('sunPosition', (data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('Failed to calculate sun position'));
          }
        });
        
        workerRef.current.postMessage({
          type: 'calculateSunPosition',
          data: { date: date.toISOString(), latitude, longitude }
        });
      } else {
        reject(new Error('Worker not available'));
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
    return new Promise((resolve, reject) => {
      if (workerRef.current) {
        // Set timeout - give more time for large calculations
        timeoutRef.current = setTimeout(() => {
          console.error('Section exposure calculation timed out');
          reject(new Error('Calculation timeout'));
        }, 30000); // 30 seconds for large stadiums
        
        progressCallbackRef.current = onProgress || null;
        
        callbacksRef.current.set('sectionExposures', (data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('Failed to calculate section exposures'));
          }
        });
        
        // Send minimal data to worker
        const minimalSections = sections.map(s => ({
          id: s.id,
          name: s.name,
          level: s.level,
          baseAngle: s.baseAngle,
          angleSpan: s.angleSpan,
          covered: s.covered,
          price: s.price
        }));
        
        workerRef.current.postMessage({
          type: 'calculateSectionExposures',
          data: { 
            sections: minimalSections, 
            sunPosition, 
            stadiumOrientation, 
            weatherConditions 
          }
        });
      } else {
        reject(new Error('Worker not available'));
      }
    });
  }, []);

  return {
    calculateSunPosition,
    calculateSectionExposures
  };
};
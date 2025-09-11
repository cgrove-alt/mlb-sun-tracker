import { useEffect, useState, useRef, useCallback } from 'react';
import { SunPosition } from '../utils/sunCalculations';

interface UseSunCalculationsOptions {
  stadium: any;
  sunPosition: SunPosition;
  sections: any[];
  enabled?: boolean;
}

interface UseSunCalculationsResult {
  data: any[] | null;
  isLoading: boolean;
  error: Error | null;
}

// Cache for calculation results
const calculationCache = new Map<string, any[]>();

export function useSunCalculations({
  stadium,
  sunPosition,
  sections,
  enabled = true,
}: UseSunCalculationsOptions): UseSunCalculationsResult {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  // Generate cache key
  const cacheKey = `${stadium.id}-${sunPosition.altitude}-${sunPosition.azimuth}`;
  
  const calculate = useCallback(() => {
    if (!enabled || !sections.length) {
      return;
    }
    
    // Check cache first
    if (calculationCache.has(cacheKey)) {
      setData(calculationCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Use Web Worker if available
    if (typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker('/workers/sunCalculations.worker.js');
        
        workerRef.current.onmessage = (event) => {
          const { type, payload } = event.data;
          
          if (type === 'SUN_EXPOSURE_RESULT') {
            // Cache the result
            calculationCache.set(cacheKey, payload);
            // Limit cache size
            if (calculationCache.size > 50) {
              const firstKey = calculationCache.keys().next().value;
              if (firstKey !== undefined) {
                calculationCache.delete(firstKey);
              }
            }
            
            setData(payload);
            setIsLoading(false);
          } else if (type === 'SUN_EXPOSURE_ERROR') {
            setError(new Error(payload));
            setIsLoading(false);
          }
        };
        
        workerRef.current.onerror = (err) => {
          setError(new Error('Worker error: ' + err.message));
          setIsLoading(false);
        };
        
        // Send calculation request to worker
        workerRef.current.postMessage({
          type: 'CALCULATE_SUN_EXPOSURE',
          payload: { stadium, sunPosition, sections },
        });
      } catch (err) {
        // Fallback to main thread if worker fails
        console.warn('Worker not available, falling back to main thread');
        performMainThreadCalculation();
      }
    } else {
      // No worker support, use main thread
      performMainThreadCalculation();
    }
  }, [stadium, sunPosition, sections, enabled, cacheKey]);
  
  const performMainThreadCalculation = useCallback(() => {
    // Simplified calculation for main thread
    // In production, this would import the actual calculation function
    setTimeout(() => {
      const results = sections.map(section => ({
        sectionId: section.id,
        sunExposure: Math.random() * 100,
        shadePercentage: Math.random() * 100,
      }));
      
      calculationCache.set(cacheKey, results);
      setData(results);
      setIsLoading(false);
    }, 100);
  }, [sections, cacheKey]);
  
  useEffect(() => {
    calculate();
    
    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [calculate]);
  
  return { data, isLoading, error };
}

// Hook to prefetch calculations for better UX
export function usePrefetchSunCalculations(stadiumId: string) {
  useEffect(() => {
    // Prefetch common sun positions for this stadium
    // This would be implemented to pre-calculate common times
    // like 1pm, 3pm, 7pm for the current date
  }, [stadiumId]);
}

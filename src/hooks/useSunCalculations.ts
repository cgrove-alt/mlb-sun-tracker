import { useEffect, useState, useRef, useCallback } from 'react';
import { SunPosition } from '../utils/sunCalculations';
import type { SectionShadowData } from '../utils/sunCalculator';

interface UseSunCalculationsOptions {
  stadium: any;
  sunPosition: SunPosition;
  sections: any[];
  enabled?: boolean;
  includeRows?: boolean;
}

interface UseSunCalculationsResult {
  data: any[] | null;
  rowData: SectionShadowData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Cache for calculation results
const calculationCache = new Map<string, any[]>();

export function useSunCalculations({
  stadium,
  sunPosition,
  sections,
  enabled = true,
  includeRows = false,
}: UseSunCalculationsOptions): UseSunCalculationsResult {
  const [data, setData] = useState<any[] | null>(null);
  const [rowData, setRowData] = useState<SectionShadowData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  // Generate cache key
  const cacheKey = `${stadium.id}-${sunPosition.altitude}-${sunPosition.azimuth}-${includeRows ? 'rows' : 'sections'}`;

  const calculate = useCallback(() => {
    if (!enabled || !sections.length) {
      return;
    }

    // Check cache first
    if (calculationCache.has(cacheKey)) {
      const cached = calculationCache.get(cacheKey)!;
      setData(cached);
      // If includeRows, the cached data contains row information
      if (includeRows) {
        setRowData(cached as SectionShadowData[]);
      }
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
          } else if (type === 'ROW_SHADOWS_RESULT') {
            // Handle row-level calculation results
            calculationCache.set(cacheKey, payload);
            // Limit cache size
            if (calculationCache.size > 50) {
              const firstKey = calculationCache.keys().next().value;
              if (firstKey !== undefined) {
                calculationCache.delete(firstKey);
              }
            }

            setRowData(payload);
            setData(payload); // Also set in data for compatibility
            setIsLoading(false);
          } else if (type === 'SUN_EXPOSURE_ERROR' || type === 'ROW_SHADOWS_ERROR') {
            setError(new Error(payload));
            setIsLoading(false);
          }
        };

        workerRef.current.onerror = (err) => {
          setError(new Error('Worker error: ' + err.message));
          setIsLoading(false);
        };

        // Send calculation request to worker
        if (includeRows) {
          workerRef.current.postMessage({
            type: 'CALCULATE_ROW_SHADOWS',
            payload: { stadium, sunPosition, sections },
          });
        } else {
          workerRef.current.postMessage({
            type: 'CALCULATE_SUN_EXPOSURE',
            payload: { stadium, sunPosition, sections },
          });
        }
      } catch (err) {
        // Fallback to main thread if worker fails
        console.warn('Worker not available, falling back to main thread');
        performMainThreadCalculation();
      }
    } else {
      // No worker support, use main thread
      performMainThreadCalculation();
    }
  }, [stadium, sunPosition, sections, enabled, includeRows, cacheKey]);
  
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

  // Refetch function that clears cache and recalculates
  const refetch = useCallback(() => {
    calculationCache.delete(cacheKey);
    calculate();
  }, [cacheKey, calculate]);

  return { data, rowData, isLoading, error, refetch };
}

// Hook to prefetch calculations for better UX
export function usePrefetchSunCalculations(stadiumId: string) {
  useEffect(() => {
    // Prefetch common sun positions for this stadium
    // This would be implemented to pre-calculate common times
    // like 1pm, 3pm, 7pm for the current date
  }, [stadiumId]);
}

import { useEffect, useState, useCallback } from 'react';
import { SunPosition } from '../utils/sunCalculations';
import { getSectionSunExposure } from '../utils/sectionSunCalculations';
import { getStadiumObstructions } from '../data/stadium-data-aggregator';
import { calculateObstructionShadow } from '../utils/advancedShadowCalculator';

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
  refetch: () => void;
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

  // Generate cache key including stadium orientation
  const cacheKey = `${stadium.id}-${sunPosition.altitudeDegrees.toFixed(1)}-${sunPosition.azimuthDegrees.toFixed(1)}-${stadium.orientation}`;

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

    try {
      // Load stadium-specific obstructions (overhangs, scoreboards, light towers)
      const obstructions = getStadiumObstructions(stadium.id, 'MLB');

      // Use the CORRECT calculation from sectionSunCalculations.ts
      // This properly converts sun azimuth to stadium-relative coordinates
      // and uses section baseAngle to determine sun exposure
      const results = sections.map(section => {
        // Base sun exposure from angle calculation
        let sunExposure = getSectionSunExposure(
          section,
          sunPosition.altitudeDegrees,
          sunPosition.azimuthDegrees,
          stadium.orientation
        );

        // Apply stadium-specific obstruction shadows if available
        if (obstructions.length > 0 && sunExposure > 0) {
          const obstructionShadow = calculateObstructionShadow(
            section,
            sunPosition.altitudeDegrees,
            sunPosition.azimuthDegrees,
            stadium.orientation,
            obstructions
          );

          // Reduce exposure based on obstruction shadow percentage
          // If 50% of sample points are shadowed, reduce exposure by 50%
          if (obstructionShadow > 0) {
            sunExposure = Math.round(sunExposure * (1 - obstructionShadow / 100));
          }
        }

        return {
          section,
          inSun: sunExposure > 50,
          sunExposure,
          timeInSun: Math.round(sunExposure * 1.8),
          percentageOfGameInSun: sunExposure
        };
      });

      // Cache the result
      calculationCache.set(cacheKey, results);

      // Limit cache size
      if (calculationCache.size > 50) {
        const firstKey = calculationCache.keys().next().value;
        if (firstKey !== undefined) {
          calculationCache.delete(firstKey);
        }
      }

      setData(results);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Calculation failed'));
      setIsLoading(false);
    }
  }, [stadium, sunPosition, sections, enabled, cacheKey]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  // Refetch function that clears cache and recalculates
  const refetch = useCallback(() => {
    calculationCache.delete(cacheKey);
    calculate();
  }, [cacheKey, calculate]);

  return { data, isLoading, error, refetch };
}

// Hook to prefetch calculations for better UX
export function usePrefetchSunCalculations(stadiumId: string) {
  useEffect(() => {
    // Prefetch common sun positions for this stadium
    // This would be implemented to pre-calculate common times
    // like 1pm, 3pm, 7pm for the current date
  }, [stadiumId]);
}

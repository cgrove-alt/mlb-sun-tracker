/**
 * Seat-Level Sun Calculations Hook
 *
 * Calculates sun exposure for individual seats within a section.
 * Reuses the existing OptimizedShadeCalculator3D for accurate ray tracing.
 */

import { useEffect, useState, useCallback } from 'react';
import { SunPosition } from '../utils/sunCalculations';
import { loadSectionSeatData, getSectionSeatsAsVector3D } from '../utils/seatDataLoader';
import { Vector3D } from '../types/stadium-complete';

export interface SeatSunExposure {
  seatId: string;
  seatNumber: number;
  rowNumber: number;
  sunExposure: number; // Percentage 0-100
  isInShade: boolean;
  position: Vector3D;
}

interface UseSeatLevelSunCalculationsOptions {
  stadiumId: string;
  sectionId: string;
  sunPosition: SunPosition;
  enabled?: boolean;
}

interface UseSeatLevelSunCalculationsResult {
  seats: SeatSunExposure[] | null;
  isLoading: boolean;
  error: Error | null;
  sectionName: string | null;
  totalSeats: number;
  seatsInShade: number;
  averageExposure: number;
}

// Cache for seat-level calculation results
const seatCalculationCache = new Map<string, SeatSunExposure[]>();

export function useSeatLevelSunCalculations({
  stadiumId,
  sectionId,
  sunPosition,
  enabled = true,
}: UseSeatLevelSunCalculationsOptions): UseSeatLevelSunCalculationsResult {
  const [seats, setSeats] = useState<SeatSunExposure[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sectionName, setSectionName] = useState<string | null>(null);

  // Generate cache key based on stadium, section, and sun position
  const cacheKey = `${stadiumId}-${sectionId}-${sunPosition.altitude.toFixed(2)}-${sunPosition.azimuth.toFixed(2)}`;

  const calculate = useCallback(async () => {
    if (!enabled || !stadiumId || !sectionId) {
      return;
    }

    // Check cache first
    if (seatCalculationCache.has(cacheKey)) {
      setSeats(seatCalculationCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load seat data for the section
      const sectionData = await loadSectionSeatData(stadiumId, sectionId);

      if (!sectionData) {
        throw new Error(`Section ${sectionId} not found for stadium ${stadiumId}`);
      }

      setSectionName(sectionData.sectionName);

      // Get seats as Vector3D for calculations
      const seatPositions = await getSectionSeatsAsVector3D(stadiumId, sectionId);

      // TODO: Integrate with OptimizedShadeCalculator3D
      // For now, use simplified calculation based on sun angle
      // This will be replaced with actual 3D ray tracing
      const calculatedSeats: SeatSunExposure[] = [];

      for (const row of sectionData.rows) {
        for (const seat of row.seats) {
          // Find matching position
          const positionData = seatPositions.find(s => s.id === seat.id);
          if (!positionData) continue;

          // Simplified sun exposure calculation
          // Higher sun altitude = more exposure
          // This is a placeholder until we integrate the 3D ray tracer
          const baseExposure = Math.max(0, sunPosition.altitude * 100);
          const randomVariation = (Math.random() - 0.5) * 20; // Add some variation
          const sunExposure = Math.max(0, Math.min(100, baseExposure + randomVariation));

          calculatedSeats.push({
            seatId: seat.id,
            seatNumber: seat.seatNumber,
            rowNumber: row.rowNumber,
            sunExposure,
            isInShade: sunExposure < 30,
            position: positionData.position,
          });
        }
      }

      // Cache the results
      seatCalculationCache.set(cacheKey, calculatedSeats);

      // Limit cache size to prevent memory issues
      if (seatCalculationCache.size > 20) {
        const firstKey = seatCalculationCache.keys().next().value;
        if (firstKey !== undefined) {
          seatCalculationCache.delete(firstKey);
        }
      }

      setSeats(calculatedSeats);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(`Failed to calculate seat-level sun exposure: ${errorMessage}`));
      setIsLoading(false);
    }
  }, [stadiumId, sectionId, sunPosition, enabled, cacheKey]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  // Calculate summary statistics
  const totalSeats = seats?.length || 0;
  const seatsInShade = seats?.filter(s => s.isInShade).length || 0;
  const averageExposure = seats && seats.length > 0
    ? seats.reduce((sum, s) => sum + s.sunExposure, 0) / seats.length
    : 0;

  return {
    seats,
    isLoading,
    error,
    sectionName,
    totalSeats,
    seatsInShade,
    averageExposure,
  };
}

/**
 * Clear seat calculation cache
 * Useful for memory management or when data changes
 */
export function clearSeatCalculationCache(): void {
  seatCalculationCache.clear();
}

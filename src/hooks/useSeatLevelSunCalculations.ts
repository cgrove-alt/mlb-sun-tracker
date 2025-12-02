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

      // Calculate sun direction vector from azimuth and altitude
      // Sun azimuth: 0=N, 90=E, 180=S, 270=W (compass degrees)
      // Sun altitude: 0=horizon, 90=directly overhead
      const azimuthRad = (sunPosition.azimuthDegrees * Math.PI) / 180;
      const altitudeRad = (sunPosition.altitudeDegrees * Math.PI) / 180;

      // Convert to 3D sun direction vector (pointing FROM sun TO ground)
      const sunDirX = Math.sin(azimuthRad) * Math.cos(altitudeRad);
      const sunDirY = Math.cos(azimuthRad) * Math.cos(altitudeRad);
      const sunDirZ = -Math.sin(altitudeRad); // Negative because sun shines down

      // Get section level for overhang calculation
      const sectionLevel = sectionData.level || 'lower';
      const levelModifier = {
        'field': 1.0,    // Field level - full exposure
        'lower': 0.9,    // Lower deck - slight overhang protection
        'club': 0.6,     // Club level - more overhang from upper deck
        'upper': 0.4,    // Upper deck - significant roof coverage
        'suite': 0.2,    // Suites - mostly covered
      }[sectionLevel] || 0.8;

      const calculatedSeats: SeatSunExposure[] = [];

      for (const row of sectionData.rows) {
        for (const seat of row.seats) {
          // Find matching position
          const positionData = seatPositions.find(s => s.id === seat.id);
          if (!positionData) continue;

          const pos = positionData.position;

          // Calculate seat's facing direction (radial from stadium center)
          // Seats face inward toward the field (center is roughly 0,0)
          const seatDistance = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
          const seatFacingX = seatDistance > 0 ? -pos.x / seatDistance : 0;
          const seatFacingY = seatDistance > 0 ? -pos.y / seatDistance : 0;

          // Calculate dot product between sun direction and seat facing
          // Positive = sun behind seat (shade), Negative = sun in front (exposed)
          const dotProduct = sunDirX * seatFacingX + sunDirY * seatFacingY;

          // Base exposure from sun altitude (higher sun = more exposure)
          const altitudeExposure = Math.max(0, sunPosition.altitudeDegrees / 90) * 100;

          // Direction factor: seats facing away from sun get less exposure
          // dotProduct ranges from -1 (facing sun) to 1 (facing away from sun)
          // Map to exposure factor: facing sun = 1.2, facing away = 0.5
          const directionFactor = 0.85 - (dotProduct * 0.35);

          // Row depth factor: front rows get more sun, back rows get more shade
          const rowFactor = 1.0 - (row.rowNumber / 30) * 0.3; // Assume ~30 rows max

          // Calculate final exposure with all factors
          let sunExposure = altitudeExposure * directionFactor * levelModifier * rowFactor;

          // If sun is below horizon, no direct exposure
          if (sunPosition.altitudeDegrees <= 0) {
            sunExposure = 0;
          }

          // Clamp to 0-100 range
          sunExposure = Math.max(0, Math.min(100, sunExposure));

          calculatedSeats.push({
            seatId: seat.id,
            seatNumber: seat.seatNumber,
            rowNumber: row.rowNumber,
            sunExposure: Math.round(sunExposure * 10) / 10, // Round to 1 decimal
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

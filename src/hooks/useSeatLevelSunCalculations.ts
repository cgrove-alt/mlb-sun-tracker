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
import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumCompleteData, getStadiumObstructions } from '../data/stadium-data-aggregator';
import { isPointInShadow } from '../utils/advancedShadowCalculator';

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
  stadiumOrientation: number; // Compass bearing of center field direction
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
  stadiumOrientation,
  enabled = true,
}: UseSeatLevelSunCalculationsOptions): UseSeatLevelSunCalculationsResult {
  const [seats, setSeats] = useState<SeatSunExposure[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sectionName, setSectionName] = useState<string | null>(null);

  // Generate cache key based on stadium, section, sun position, and orientation
  const cacheKey = `${stadiumId}-${sectionId}-${sunPosition.altitude.toFixed(2)}-${sunPosition.azimuth.toFixed(2)}-${stadiumOrientation}`;

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

      // Check if stadium has a fixed roof (dome) - all seats are in full shade
      const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
      const { sections: sectionDefs } = getStadiumCompleteData(stadiumId, 'MLB');
      const sectionDef = sectionDefs.find(s => s.id === sectionId);

      // If stadium has fixed roof OR section is marked as covered, all seats are shaded
      if (stadium?.roof === 'fixed' || sectionDef?.covered) {
        // For domed stadiums or covered sections, all seats have 0% sun exposure
        const seatPositions = await getSectionSeatsAsVector3D(stadiumId, sectionId);
        const allShadedSeats: SeatSunExposure[] = [];

        for (const row of sectionData.rows) {
          for (const seat of row.seats) {
            const positionData = seatPositions.find(s => s.id === seat.id);
            if (!positionData) continue;

            allShadedSeats.push({
              seatId: seat.id,
              seatNumber: seat.seatNumber,
              rowNumber: row.rowNumber,
              sunExposure: 0,
              isInShade: true,
              position: positionData.position,
            });
          }
        }

        seatCalculationCache.set(cacheKey, allShadedSeats);
        setSeats(allShadedSeats);
        setIsLoading(false);
        return;
      }

      // Get seats as Vector3D for calculations
      const seatPositions = await getSectionSeatsAsVector3D(stadiumId, sectionId);

      // Load stadium-specific obstructions for shadow checking
      const obstructions = getStadiumObstructions(stadiumId, 'MLB');
      const shadowObstructions = obstructions.filter(o => o.castsShadow);

      // Calculate sun direction vector from azimuth and altitude
      // Sun azimuth: 0=N, 90=E, 180=S, 270=W (compass degrees)
      // Sun altitude: 0=horizon, 90=directly overhead
      //
      // CRITICAL: Convert compass azimuth to stadium-relative coordinates
      // Seat positions are in stadium-relative coords (0° = behind home plate)
      // Stadium orientation is the compass bearing of center field
      // Formula: relativeSunAngle = (compassAzimuth - stadiumOrientation + 180) % 360
      const relativeSunAzimuth = ((sunPosition.azimuthDegrees - stadiumOrientation + 180) % 360 + 360) % 360;
      const azimuthRad = (relativeSunAzimuth * Math.PI) / 180;
      const altitudeRad = (sunPosition.altitudeDegrees * Math.PI) / 180;

      // Convert to 3D sun direction vector (pointing FROM sun TO ground)
      // Now in stadium-relative coordinates to match seat positions
      const sunDirX = Math.sin(azimuthRad) * Math.cos(altitudeRad);
      const sunDirY = Math.cos(azimuthRad) * Math.cos(altitudeRad);
      const sunDirZ = -Math.sin(altitudeRad); // Negative because sun shines down

      // Get section level for overhang calculation
      // IMPORTANT: These values must match sectionSunCalculations.ts for consistency
      const sectionLevel = sectionData.level || 'lower';
      const levelModifier = {
        'field': 1.0,    // Field level - full exposure
        'lower': 0.95,   // Lower deck - slight overhang protection
        'club': 0.85,    // Club level - more overhang from upper deck
        'upper': 1.0,    // Upper deck - often more exposed (no deck above)
        'suite': 0.75,   // Suites - some protection
      }[sectionLevel] || 0.9;

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

          // Check for stadium-specific obstructions (overhangs, scoreboards, etc.)
          if (shadowObstructions.length > 0 && sunExposure > 0) {
            const sunDir: Vector3D = { x: sunDirX, y: sunDirY, z: sunDirZ };
            const shadowCheck = isPointInShadow(pos, sunDir, shadowObstructions);
            if (shadowCheck.inShadow) {
              // Seat is shadowed by an obstruction - drastically reduce exposure
              sunExposure *= 0.1;
            }
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
  }, [stadiumId, sectionId, sunPosition, stadiumOrientation, enabled, cacheKey]);

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

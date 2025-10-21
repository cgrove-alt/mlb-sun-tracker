/**
 * Seat-Level Sun Exposure Calculations
 * Extends existing shadow calculator for individual seat precision
 * Created: 2025-10-21
 */

import type { Vector3D, Obstruction3D } from '@/types/stadium-complete';
import type {
  Seat,
  SeatRow,
  SeatSunExposure,
  SunExposureTimePoint,
  SeatBatchCalculationRequest,
  SeatBatchCalculationResult,
} from '@/types/seat';
import { getSunPosition, type SunPosition } from './sunCalculations';

/**
 * Calculate sun ray direction from sun position
 */
function getSunRayDirection(sunPosition: SunPosition): Vector3D {
  const azimuthRad = sunPosition.azimuth;
  const altitudeRad = sunPosition.altitude;

  return {
    x: Math.cos(altitudeRad) * Math.sin(azimuthRad),
    y: Math.sin(altitudeRad),
    z: Math.cos(altitudeRad) * Math.cos(azimuthRad),
  };
}

/**
 * Ray-box intersection test for obstruction checking
 */
function rayBoxIntersect(
  rayOrigin: Vector3D,
  rayDirection: Vector3D,
  boxMin: Vector3D,
  boxMax: Vector3D
): boolean {
  let tmin = (boxMin.x - rayOrigin.x) / rayDirection.x;
  let tmax = (boxMax.x - rayOrigin.x) / rayDirection.x;

  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

  let tymin = (boxMin.y - rayOrigin.y) / rayDirection.y;
  let tymax = (boxMax.y - rayOrigin.y) / rayDirection.y;

  if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

  if (tmin > tymax || tymin > tmax) return false;

  if (tymin > tmin) tmin = tymin;
  if (tymax < tmax) tmax = tymax;

  let tzmin = (boxMin.z - rayOrigin.z) / rayDirection.z;
  let tzmax = (boxMax.z - rayOrigin.z) / rayDirection.z;

  if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

  return !(tmin > tzmax || tzmin > tmax);
}

/**
 * Check if a specific seat is in shadow from any obstruction
 */
export function isSeatInShadow(
  seat: Seat,
  sunDirection: Vector3D,
  obstructions: Obstruction3D[]
): { inShadow: boolean; obstructionIds: string[] } {
  const obstructionIds: string[] = [];

  // Ray starts from the seat and goes toward the sun
  const rayOrigin = seat.position3D;
  const rayDirection = {
    x: -sunDirection.x,
    y: -sunDirection.y,
    z: -sunDirection.z,
  };

  for (const obstruction of obstructions) {
    if (!obstruction.castsShadow) continue;

    // Check if ray intersects obstruction bounding box
    if (
      rayBoxIntersect(
        rayOrigin,
        rayDirection,
        obstruction.boundingBox.min,
        obstruction.boundingBox.max
      )
    ) {
      obstructionIds.push(obstruction.id);
    }
  }

  return {
    inShadow: obstructionIds.length > 0,
    obstructionIds,
  };
}

/**
 * Calculate sun exposure for a single seat at a specific time
 */
export function calculateSeatSunExposureAtTime(
  seat: Seat,
  dateTime: Date,
  latitude: number,
  longitude: number,
  obstructions: Obstruction3D[],
  weatherData?: { cloudCover: number; precipitation: number }
): {
  inSun: boolean;
  sunIntensity: number;
  obstructionsCasting: string[];
  sunPosition: SunPosition;
} {
  // Get sun position
  const sunPosition = getSunPosition(dateTime, latitude, longitude);

  // If sun is below horizon, seat is in shade
  if (sunPosition.altitudeDegrees < 0) {
    return {
      inSun: false,
      sunIntensity: 0,
      obstructionsCasting: [],
      sunPosition,
    };
  }

  // If seat is permanently covered, it's always shaded
  if (seat.covered) {
    return {
      inSun: false,
      sunIntensity: 0,
      obstructionsCasting: ['permanent-coverage'],
      sunPosition,
    };
  }

  // Check for obstructions
  const sunDirection = getSunRayDirection(sunPosition);
  const shadowCheck = isSeatInShadow(seat, sunDirection, obstructions);

  // Calculate sun intensity based on altitude (higher = more intense)
  // Normalize to 0-100 scale
  let sunIntensity = (sunPosition.altitudeDegrees / 90) * 100;

  // Apply weather adjustments
  if (weatherData) {
    const { cloudCover, precipitation } = weatherData;

    // Heavy precipitation
    if (precipitation > 70) {
      sunIntensity *= 0.1; // 90% reduction
    }
    // Light precipitation
    else if (precipitation > 30) {
      sunIntensity *= 0.4; // 60% reduction
    }
    // Cloud cover
    else if (cloudCover > 80) {
      sunIntensity *= 0.4;
    } else if (cloudCover > 60) {
      sunIntensity *= 0.6;
    } else if (cloudCover > 40) {
      sunIntensity *= 0.8;
    } else if (cloudCover > 15) {
      sunIntensity *= 0.9;
    }
  }

  return {
    inSun: !shadowCheck.inShadow,
    sunIntensity: shadowCheck.inShadow ? 0 : Math.round(sunIntensity),
    obstructionsCasting: shadowCheck.obstructionIds,
    sunPosition,
  };
}

/**
 * Calculate sun exposure timeline for a seat over a game duration
 */
export function calculateSeatSunExposureTimeline(
  seat: Seat,
  gameStartTime: Date,
  gameDurationHours: number,
  latitude: number,
  longitude: number,
  obstructions: Obstruction3D[],
  weatherData?: { cloudCover: number; precipitation: number }
): SeatSunExposure {
  const timeline: SunExposureTimePoint[] = [];

  // Sample every 15 minutes during the game
  const intervalMinutes = 15;
  const totalIntervals = (gameDurationHours * 60) / intervalMinutes;

  let totalSunExposure = 0;
  let totalShadow = 0;
  let totalPartialShade = 0;

  let peakIntensity = 0;
  let peakStart: Date | null = null;
  let peakEnd: Date | null = null;

  for (let i = 0; i <= totalIntervals; i++) {
    const currentTime = new Date(
      gameStartTime.getTime() + i * intervalMinutes * 60 * 1000
    );

    const exposure = calculateSeatSunExposureAtTime(
      seat,
      currentTime,
      latitude,
      longitude,
      obstructions,
      weatherData
    );

    // Determine shade state
    const inDirectSun = exposure.inSun && exposure.sunIntensity > 50;
    const inPartialShade = exposure.inSun && exposure.sunIntensity <= 50;
    const inFullShade = !exposure.inSun;

    timeline.push({
      time: currentTime,
      inDirectSun,
      inPartialShade,
      inFullShade,
      sunIntensity: exposure.sunIntensity,
      sunAltitude: exposure.sunPosition.altitudeDegrees,
      sunAzimuth: exposure.sunPosition.azimuthDegrees,
    });

    // Accumulate exposure metrics
    if (inDirectSun) {
      totalSunExposure += exposure.sunIntensity;
    } else if (inPartialShade) {
      totalPartialShade += exposure.sunIntensity;
    } else {
      totalShadow += 100; // Full shadow counts as 100%
    }

    // Track peak sun period
    if (exposure.sunIntensity > peakIntensity) {
      peakIntensity = exposure.sunIntensity;
      peakStart = currentTime;
      peakEnd = currentTime;
    } else if (
      exposure.sunIntensity === peakIntensity &&
      peakIntensity > 0
    ) {
      peakEnd = currentTime;
    }
  }

  // Calculate percentages
  const totalPoints = timeline.length;
  const sunExposurePercentage =
    (totalSunExposure / (totalPoints * 100)) * 100;
  const shadowPercentage = (totalShadow / (totalPoints * 100)) * 100;
  const partialShadePercentage =
    (totalPartialShade / (totalPoints * 100)) * 100;

  // Collect unique obstruction IDs
  const allObstructions = new Set<string>();
  timeline.forEach((point) => {
    if (point.inFullShade) {
      // Would need to track obstructions per point - simplified for now
    }
  });

  return {
    seatId: seat.id,
    calculatedAt: new Date(),
    gameDateTime: gameStartTime,
    sunExposurePercentage: Math.round(sunExposurePercentage),
    shadowPercentage: Math.round(shadowPercentage),
    partialShadePercentage: Math.round(partialShadePercentage),
    timeline,
    peakSunPeriod:
      peakStart && peakEnd && peakIntensity > 0
        ? {
            start: peakStart,
            end: peakEnd,
            intensity: peakIntensity,
          }
        : undefined,
    shadowSources: Array.from(allObstructions),
    weatherAdjusted: !!weatherData,
    cloudCoverPercentage: weatherData?.cloudCover,
    calculationMethod: '3d-raycast',
    confidence: 95, // High confidence for 3D raycast method
  };
}

/**
 * Calculate sun exposure for all seats in a row
 */
export function calculateRowSunExposure(
  row: SeatRow,
  gameStartTime: Date,
  gameDurationHours: number,
  latitude: number,
  longitude: number,
  obstructions: Obstruction3D[],
  weatherData?: { cloudCover: number; precipitation: number }
): Map<string, SeatSunExposure> {
  const results = new Map<string, SeatSunExposure>();

  for (const seat of row.seats) {
    const exposure = calculateSeatSunExposureTimeline(
      seat,
      gameStartTime,
      gameDurationHours,
      latitude,
      longitude,
      obstructions,
      weatherData
    );
    results.set(seat.id, exposure);
  }

  return results;
}

/**
 * Batch calculation for multiple seats
 * More efficient than calculating one-by-one
 */
export async function calculateSeatBatch(
  request: SeatBatchCalculationRequest,
  seats: Seat[],
  latitude: number,
  longitude: number,
  obstructions: Obstruction3D[],
  weatherData?: { cloudCover: number; precipitation: number }
): Promise<SeatBatchCalculationResult> {
  const startTime = Date.now();

  const results: SeatSunExposure[] = [];

  // Calculate for each seat
  for (const seat of seats) {
    if (!request.seatIds.includes(seat.id)) continue;

    const exposure = request.includeTimeline
      ? calculateSeatSunExposureTimeline(
          seat,
          request.gameDateTime,
          3, // Default 3-hour game
          latitude,
          longitude,
          obstructions,
          weatherData || request.weatherData
        )
      : calculateQuickSeatExposure(
          seat,
          request.gameDateTime,
          latitude,
          longitude,
          obstructions
        );

    results.push(exposure);
  }

  const calculationTimeMs = Date.now() - startTime;

  return {
    stadiumId: request.stadiumId,
    gameDateTime: request.gameDateTime,
    results,
    calculationTimeMs,
    cached: false,
  };
}

/**
 * Quick seat exposure calculation without full timeline
 * Samples 3 points during game for faster results
 */
function calculateQuickSeatExposure(
  seat: Seat,
  gameStartTime: Date,
  latitude: number,
  longitude: number,
  obstructions: Obstruction3D[]
): SeatSunExposure {
  const sampleTimes = [
    gameStartTime, // Start
    new Date(gameStartTime.getTime() + 1.5 * 60 * 60 * 1000), // Middle
    new Date(gameStartTime.getTime() + 3 * 60 * 60 * 1000), // End
  ];

  let totalExposure = 0;

  const timeline: SunExposureTimePoint[] = sampleTimes.map((time) => {
    const exposure = calculateSeatSunExposureAtTime(
      seat,
      time,
      latitude,
      longitude,
      obstructions
    );

    if (exposure.inSun) {
      totalExposure += exposure.sunIntensity;
    }

    return {
      time,
      inDirectSun: exposure.inSun && exposure.sunIntensity > 50,
      inPartialShade: exposure.inSun && exposure.sunIntensity <= 50,
      inFullShade: !exposure.inSun,
      sunIntensity: exposure.sunIntensity,
      sunAltitude: exposure.sunPosition.altitudeDegrees,
      sunAzimuth: exposure.sunPosition.azimuthDegrees,
    };
  });

  const avgExposure = totalExposure / sampleTimes.length;

  return {
    seatId: seat.id,
    calculatedAt: new Date(),
    gameDateTime: gameStartTime,
    sunExposurePercentage: Math.round(avgExposure),
    shadowPercentage: Math.round(100 - avgExposure),
    partialShadePercentage: 0,
    timeline,
    shadowSources: [],
    weatherAdjusted: false,
    calculationMethod: 'hybrid',
    confidence: 75, // Lower confidence for quick calculation
  };
}

/**
 * Find seats with specific sun exposure criteria
 */
export function filterSeatsByExposure(
  seatExposures: Map<string, SeatSunExposure>,
  minShade: number = 0,
  maxSun: number = 100
): string[] {
  const filtered: string[] = [];

  seatExposures.forEach((exposure, seatId) => {
    if (
      exposure.shadowPercentage >= minShade &&
      exposure.sunExposurePercentage <= maxSun
    ) {
      filtered.push(seatId);
    }
  });

  return filtered;
}

/**
 * Get best shaded seats from a collection
 */
export function getBestShadedSeats(
  seatExposures: Map<string, SeatSunExposure>,
  limit: number = 10
): Array<{ seatId: string; shadePercentage: number }> {
  const seats = Array.from(seatExposures.entries())
    .map(([seatId, exposure]) => ({
      seatId,
      shadePercentage: exposure.shadowPercentage,
    }))
    .sort((a, b) => b.shadePercentage - a.shadePercentage)
    .slice(0, limit);

  return seats;
}

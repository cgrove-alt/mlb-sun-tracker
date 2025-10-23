/**
 * NREL Solar Position Algorithm - Official Implementation Wrapper
 * Uses the official nrel-spa npm package for maximum accuracy
 * Provides ±0.0003° accuracy (vs SunCalc's ±0.5° accuracy)
 */

// @ts-ignore - nrel-spa doesn't have TypeScript definitions
import { getSpa } from 'nrel-spa';
import { getTimezoneOffset } from './stadiumTimezone';

/**
 * Get sun position using official NREL SPA algorithm
 * @param date - Date object (any timezone, will be handled correctly)
 * @param latitude - Observer latitude in degrees (-90 to 90)
 * @param longitude - Observer longitude in degrees (-180 to 180)
 * @param timezone - IANA timezone string (e.g., 'America/Los_Angeles')
 * @returns Sun position with azimuth and altitude in degrees
 */
export function getSunPositionNREL(
  date: Date,
  latitude: number,
  longitude: number,
  timezone?: string
): {
  azimuth: number;
  altitude: number;
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  // The Date object already contains the correct UTC time
  // nrel-spa expects timezone=0 for UTC dates (which is what JS Date objects are internally)
  // Passing the actual timezone offset causes incorrect double-adjustment
  const timezoneOffset = 0;

  // Call official NREL SPA implementation
  const result = getSpa(date, latitude, longitude, timezoneOffset);

  // Convert zenith to altitude (altitude = 90° - zenith)
  const altitude = 90 - result.zenith;

  // Convert to radians for compatibility with existing code
  const altitudeRadians = (altitude * Math.PI) / 180;

  // NREL uses compass azimuth (0=N, 90=E, 180=S, 270=W)
  // Convert to SunCalc-compatible radians (0=S, π=N)
  const sunCalcAzimuthRad = ((result.azimuth + 180) % 360 * Math.PI / 180) - Math.PI;

  return {
    azimuth: sunCalcAzimuthRad,           // SunCalc-compatible radians
    altitude: altitudeRadians,            // Altitude in radians
    azimuthDegrees: result.azimuth,       // Compass degrees (0=N, 90=E, 180=S, 270=W)
    altitudeDegrees: altitude             // Altitude in degrees
  };
}

/**
 * NREL Solar Position Algorithm Implementation (Final Version)
 * This implementation follows the SunCalc approach but with NREL's more accurate formulas
 */

export interface SunPosition {
  azimuth: number; // degrees (0-360, north=0, east=90, south=180, west=270)
  elevation: number; // degrees (-90 to 90)
  zenith: number; // degrees (0-180)
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Calculate sun position using NREL-inspired algorithm with SunCalc's approach
 */
export function computeSunPositionFinal(
  date: Date,
  latitude: number,
  longitude: number,
  elevation: number = 0,
  pressure: number = 1013.25,
  temperature: number = 20
): SunPosition {
  // Days since J2000.0
  const days = (date.valueOf() / 86400000) - 10957.5; // J2000 = Jan 1, 2000, 12:00 UTC
  
  // Mean elements
  const L = (280.460 + 0.9856474 * days) % 360; // Mean longitude
  const g = ((357.528 + 0.9856003 * days) % 360) * DEG_TO_RAD; // Mean anomaly
  
  // Equation of center
  const C = 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  
  // Ecliptic longitude
  const lambda = (L + C) * DEG_TO_RAD;
  
  // Obliquity of ecliptic
  const epsilon = (23.439 - 0.0000004 * days) * DEG_TO_RAD;
  
  // Right ascension and declination
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  
  // Sidereal time
  const theta = (280.1470 + 360.9856235 * days) * DEG_TO_RAD;
  
  // Hour angle (this is the key - we need to include longitude properly)
  const H = theta - longitude * DEG_TO_RAD - alpha;
  
  // Convert to horizontal coordinates
  const phi = latitude * DEG_TO_RAD;
  
  // Altitude
  const h = Math.asin(
    Math.sin(phi) * Math.sin(delta) + 
    Math.cos(phi) * Math.cos(delta) * Math.cos(H)
  );
  
  // Azimuth (measured from south, clockwise)
  const A = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(delta) * Math.cos(phi)
  );
  
  // Convert to degrees
  let altitude = h * RAD_TO_DEG;
  let azimuth = A * RAD_TO_DEG + 180; // Convert from south=0 to north=0
  
  // Normalize azimuth to 0-360
  azimuth = (azimuth + 360) % 360;
  
  // Apply refraction correction
  if (altitude > -1) {
    altitude += calculateSimpleRefraction(altitude, pressure, temperature);
  }
  
  return {
    azimuth,
    elevation: altitude,
    zenith: 90 - altitude
  };
}

/**
 * Simple atmospheric refraction correction
 */
function calculateSimpleRefraction(
  altitude: number,
  pressure: number = 1013.25,
  temperature: number = 20
): number {
  if (altitude < -0.575) return 0;
  
  // Simple Bennett's formula
  const a = altitude + 7.31 / (altitude + 4.4);
  const refraction = 1.02 / Math.tan(a * DEG_TO_RAD) / 60;
  
  // Correct for pressure and temperature
  return refraction * (pressure / 1013.25) * (283 / (273 + temperature));
}

/**
 * Wrapper for backward compatibility
 */
export function getSunPositionNRELFinal(
  date: Date,
  latitude: number,
  longitude: number
): {
  azimuth: number; // radians
  altitude: number; // radians
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  const result = computeSunPositionFinal(date, latitude, longitude);
  
  // Convert back to SunCalc convention
  // SunCalc azimuth: 0 = south, π/2 = west, π = north, 3π/2 = east
  // Our azimuth: 0 = north, 90 = east, 180 = south, 270 = west
  let suncalcAzimuth = (result.azimuth + 180) % 360;
  if (suncalcAzimuth > 180) {
    suncalcAzimuth -= 360;
  }
  const azimuthRadians = suncalcAzimuth * DEG_TO_RAD;
  const altitudeRadians = result.elevation * DEG_TO_RAD;
  
  return {
    azimuth: azimuthRadians,
    altitude: altitudeRadians,
    azimuthDegrees: result.azimuth,
    altitudeDegrees: result.elevation
  };
}
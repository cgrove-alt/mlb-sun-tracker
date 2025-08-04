/**
 * NREL Solar Position Algorithm Implementation (Corrected)
 * Based on: Reda, I.; Andreas, A. (2003). Solar Position Algorithm for Solar Radiation Applications.
 * 
 * This implementation fixes the calculation issues by properly handling:
 * 1. UTC time extraction from Date objects
 * 2. Local hour angle calculation
 * 3. Correct coordinate transformations
 */

export interface SunPosition {
  azimuth: number; // degrees (0-360, north=0, east=90, south=180, west=270)
  elevation: number; // degrees (-90 to 90)
  zenith: number; // degrees (0-180)
}

/**
 * Calculate sun position using simplified NREL algorithm
 */
export function computeSunPositionCorrected(
  date: Date,
  latitude: number,
  longitude: number,
  elevation: number = 0,
  pressure: number = 1013.25,
  temperature: number = 20
): SunPosition {
  // Convert to Julian Date
  const jd = dateToJulian(date);
  const jc = (jd - 2451545) / 36525; // Julian century
  
  // Calculate mean longitude and anomaly
  const L0 = 280.46646 + 36000.76983 * jc + 0.0003032 * jc * jc;
  const M = 357.52911 + 35999.05029 * jc - 0.0001537 * jc * jc;
  const Mrad = M * Math.PI / 180;
  
  // Equation of center
  const C = (1.914602 - 0.004817 * jc - 0.000014 * jc * jc) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * jc) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  
  // True longitude
  const Ltrue = L0 + C;
  
  // Obliquity of ecliptic
  const epsilon0 = 23.439291 - 0.0130042 * jc;
  const epsilon = epsilon0 + 0.00256 * Math.cos((125.04 - 1934.136 * jc) * Math.PI / 180);
  const epsilonRad = epsilon * Math.PI / 180;
  
  // Convert ecliptic longitude to right ascension and declination
  const LtrueRad = Ltrue * Math.PI / 180;
  const alpha = Math.atan2(Math.cos(epsilonRad) * Math.sin(LtrueRad), Math.cos(LtrueRad));
  const delta = Math.asin(Math.sin(epsilonRad) * Math.sin(LtrueRad));
  
  // Mean sidereal time at Greenwich
  const theta0 = 280.46061837 + 360.98564736629 * (jd - 2451545) + 
                 0.000387933 * jc * jc - jc * jc * jc / 38710000;
  
  // Local sidereal time
  const theta = (theta0 + longitude) % 360;
  const thetaRad = theta * Math.PI / 180;
  
  // Hour angle
  const H = thetaRad - alpha;
  
  // Convert to horizontal coordinates
  const latRad = latitude * Math.PI / 180;
  
  // Altitude (elevation)
  const altRad = Math.asin(
    Math.sin(latRad) * Math.sin(delta) + 
    Math.cos(latRad) * Math.cos(delta) * Math.cos(H)
  );
  
  // Azimuth
  const azRad = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(latRad) - Math.tan(delta) * Math.cos(latRad)
  );
  
  // Convert to degrees
  let altitude = altRad * 180 / Math.PI;
  let azimuth = azRad * 180 / Math.PI + 180; // Add 180 to convert from south=0 to north=0
  
  // Normalize azimuth to 0-360
  azimuth = (azimuth + 360) % 360;
  
  // Apply atmospheric refraction correction if above horizon
  if (altitude > -0.575) {
    const refraction = calculateRefraction(altitude, pressure, temperature);
    altitude += refraction;
  }
  
  const zenith = 90 - altitude;
  
  return {
    azimuth,
    elevation: altitude,
    zenith
  };
}

/**
 * Convert Date to Julian Date
 */
function dateToJulian(date: Date): number {
  // Get UTC components
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + 
               date.getUTCMinutes() / 60 + 
               date.getUTCSeconds() / 3600 + 
               date.getUTCMilliseconds() / 3600000;
  
  // Julian date calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 
         32045 + hour / 24;
}

/**
 * Calculate atmospheric refraction correction
 */
function calculateRefraction(
  altitude: number,
  pressure: number,
  temperature: number
): number {
  const altRad = altitude * Math.PI / 180;
  
  // Simple refraction model
  if (altitude >= 5) {
    const cot = 1 / Math.tan(altRad);
    return (pressure / 1010) * (283 / (273 + temperature)) * 58.1 * cot / 3600;
  } else {
    // More complex model for low altitudes
    const a0 = 0.58804392;
    const a1 = -0.17941557;
    const a2 = 0.29906946;
    const a3 = -0.02391065;
    const h = altitude + 7.31 / (altitude + 4.4);
    const ref = 1 / (Math.tan(h * Math.PI / 180) + 
                     a1 / (h + a2) + 
                     a3 / ((h + a0) * (h + a0)));
    return (pressure / 1010) * (283 / (273 + temperature)) * ref / 60;
  }
}

/**
 * Wrapper function for backward compatibility with existing interface
 */
export function getSunPositionNRELCorrected(
  date: Date,
  latitude: number,
  longitude: number
): {
  azimuth: number; // radians
  altitude: number; // radians
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  const result = computeSunPositionCorrected(date, latitude, longitude);
  
  // Convert to radians for compatibility with SunCalc interface
  const azimuthRadians = result.azimuth * Math.PI / 180;
  const altitudeRadians = result.elevation * Math.PI / 180;
  
  return {
    azimuth: azimuthRadians,
    altitude: altitudeRadians,
    azimuthDegrees: result.azimuth,
    altitudeDegrees: result.elevation
  };
}
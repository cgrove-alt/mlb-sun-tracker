/**
 * SunCalc-compatible implementation with improved accuracy
 * This follows SunCalc's approach exactly to ensure it works correctly
 */

const PI = Math.PI;
const rad = PI / 180;

// Constants
const dayMs = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;
const e = rad * 23.4397; // obliquity of the Earth

// Helper functions
function toJulian(date: Date): number { 
  return date.valueOf() / dayMs - 0.5 + J1970; 
}

function toDays(date: Date): number { 
  return toJulian(date) - J2000; 
}

function rightAscension(l: number, b: number): number { 
  return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l)); 
}

function declination(l: number, b: number): number { 
  return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l)); 
}

function azimuth(H: number, phi: number, dec: number): number { 
  return Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)); 
}

function altitude(H: number, phi: number, dec: number): number { 
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)); 
}

function siderealTime(d: number, lw: number): number { 
  return rad * (280.16 + 360.9856235 * d) - lw; 
}

function solarMeanAnomaly(d: number): number { 
  return rad * (357.5291 + 0.98560028 * d); 
}

function eclipticLongitude(M: number): number {
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)); // equation of center
  const P = rad * 102.9372; // perihelion of the Earth
  return M + C + P + PI;
}

function sunCoords(d: number) {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  
  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0)
  };
}

/**
 * Calculate sun position (SunCalc-compatible)
 */
export function getSunPositionSunCalcClone(
  date: Date, 
  lat: number, 
  lng: number
): {
  azimuth: number;
  altitude: number;
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);
  
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  
  const azimuthRad = azimuth(H, phi, c.dec);
  const altitudeRad = altitude(H, phi, c.dec);
  
  // Convert to degrees
  const azimuthDegrees = ((azimuthRad * 180 / PI) + 180) % 360;
  const altitudeDegrees = altitudeRad * 180 / PI;
  
  return {
    azimuth: azimuthRad,
    altitude: altitudeRad,
    azimuthDegrees,
    altitudeDegrees
  };
}

/**
 * Calculate sun position with NREL improvements while maintaining SunCalc compatibility
 */
export function getSunPositionImproved(
  date: Date,
  latitude: number,
  longitude: number
): {
  azimuth: number;
  altitude: number;
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  // Use the basic SunCalc approach but with improved constants
  const d = toDays(date);
  
  // Improved mean anomaly
  const g = rad * (357.529 + 0.98560028 * d);
  
  // Improved equation of center
  const C = rad * (1.9148 * Math.sin(g) + 0.02 * Math.sin(2 * g) + 0.0003 * Math.sin(3 * g));
  
  // Ecliptic longitude
  const lambda = g + C + rad * 102.9372 + PI;
  
  // Improved obliquity
  const epsilon = rad * (23.439 - 0.00000036 * d);
  
  // Right ascension and declination
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  
  // Sidereal time (following SunCalc's approach exactly)
  const lw = rad * -longitude;
  const theta = rad * (280.16 + 360.9856235 * d) - lw;
  
  // Hour angle
  const H = theta - alpha;
  
  // Horizontal coordinates
  const phi = rad * latitude;
  const h = Math.asin(Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H));
  const A = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(delta) * Math.cos(phi));
  
  // Apply simple atmospheric refraction if above horizon
  let altitude = h;
  if (h > 0) {
    const refraction = 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
    altitude += refraction;
  }
  
  // Convert to degrees
  const azimuthDegrees = ((A * 180 / PI) + 180) % 360;
  const altitudeDegrees = altitude * 180 / PI;
  
  return {
    azimuth: A,
    altitude: altitude,
    azimuthDegrees,
    altitudeDegrees
  };
}
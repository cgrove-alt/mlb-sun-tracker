/**
 * NREL Solar Position Algorithm Implementation (Fixed)
 * Based on: Reda, I.; Andreas, A. (2003). Solar Position Algorithm for Solar Radiation Applications.
 * NREL Report No. TP-560-34302, Revised January 2008.
 * https://www.nrel.gov/docs/fy08osti/34302.pdf
 * 
 * This implementation fixes timezone handling issues in the original implementation.
 */

interface JulianDate {
  JD: number;
  JDE: number;
  JC: number;
  JCE: number;
  JME: number;
}

interface GeocentricPosition {
  longitude: number; // degrees
  latitude: number; // degrees
  radiusVector: number; // AU
}

interface NutationCorrection {
  longitude: number; // degrees
  obliquity: number; // degrees
}

interface EquatorialCoordinates {
  rightAscension: number; // degrees
  declination: number; // degrees
}

interface TopocentricPosition {
  rightAscension: number; // degrees
  declination: number; // degrees
  hourAngle: number; // degrees
  azimuth: number; // degrees
  zenith: number; // degrees
  elevation: number; // degrees
}

/**
 * Main NREL SPA calculation function (Fixed)
 * @param date - Date object in any timezone
 * @param latitude - Observer latitude in degrees (-90 to 90)
 * @param longitude - Observer longitude in degrees (-180 to 180)
 * @param elevation - Observer elevation above sea level in meters (default: 0)
 * @param pressure - Atmospheric pressure in millibars (default: 1013.25)
 * @param temperature - Temperature in Celsius (default: 20)
 * @returns Object with zenith, azimuth, and elevation in degrees
 */
export function computeSunPositionFixed(
  date: Date,
  latitude: number,
  longitude: number,
  elevation: number = 0,
  pressure: number = 1013.25,
  temperature: number = 20
): { zenith: number; azimuth: number; elevation: number } {
  // Step 1: Calculate Julian Date using UTC time
  const julian = calculateJulianDate(date);
  
  // Step 2: Calculate Earth heliocentric longitude, latitude, and radius vector
  const geocentric = calculateGeocentricPosition(julian.JME);
  
  // Step 3: Calculate the nutation in longitude and obliquity
  const nutation = calculateNutation(julian.JCE);
  
  // Step 4: Calculate the true obliquity of the ecliptic
  const meanObliquity = calculateMeanObliquity(julian.JME);
  const trueObliquity = meanObliquity + nutation.obliquity;
  
  // Step 5: Calculate the aberration correction
  const aberration = -20.4898 / (3600 * geocentric.radiusVector);
  
  // Step 6: Calculate the apparent sun longitude
  const apparentLongitude = geocentric.longitude + nutation.longitude + aberration;
  
  // Step 7: Calculate the apparent sidereal time at Greenwich
  const meanSiderealTime = calculateMeanSiderealTime(julian.JD, julian.JC);
  const apparentSiderealTime = meanSiderealTime + nutation.longitude * Math.cos(toRadians(trueObliquity));
  
  // Step 8: Calculate the sun's geocentric equatorial coordinates
  const equatorial = calculateEquatorialCoordinates(apparentLongitude, trueObliquity, geocentric.latitude);
  
  // Step 9: Calculate the sun's topocentric equatorial coordinates
  const topocentric = calculateTopocentricPosition(
    equatorial,
    apparentSiderealTime,
    latitude,
    longitude,
    elevation,
    julian.JD,
    pressure,
    temperature
  );
  
  return {
    zenith: topocentric.zenith,
    azimuth: topocentric.azimuth,
    elevation: topocentric.elevation
  };
}

/**
 * Calculate Julian Date and related values
 * Reference: NREL SPA Section 3.1
 */
function calculateJulianDate(date: Date): JulianDate {
  // Get UTC components
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  const millisecond = date.getUTCMilliseconds();
  
  // Convert to decimal hours
  const decimalHour = hour + minute / 60 + second / 3600 + millisecond / 3600000;
  
  // Julian day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const JD = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
             Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 
             32045 + decimalHour / 24;
  
  // Julian Ephemeris Day
  const deltaT = calculateDeltaT(year, month);
  const JDE = JD + deltaT / 86400;
  
  // Julian Century and Millennium
  const JC = (JD - 2451545) / 36525;
  const JCE = (JDE - 2451545) / 36525;
  const JME = JCE / 10;
  
  return { JD, JDE, JC, JCE, JME };
}

/**
 * Calculate Delta T (difference between Terrestrial Time and Universal Time)
 * Simplified calculation - for more accuracy use polynomial expressions
 */
function calculateDeltaT(year: number, month: number): number {
  // Simplified calculation for recent years
  // For more accuracy, use the polynomial expressions from NREL SPA
  const y = year + (month - 0.5) / 12;
  
  if (y >= 2015) {
    // Extrapolation for recent years
    return 67.62 + 0.3645 * (y - 2015) + 0.0039755 * Math.pow(y - 2015, 2);
  } else if (y >= 2005) {
    return 64.69 + 0.2930 * (y - 2005);
  } else if (y >= 1986) {
    return 63.86 + 0.3345 * (y - 2000) - 0.060374 * Math.pow(y - 2000, 2);
  }
  
  // Default for other years
  return 67;
}

/**
 * Calculate Earth's heliocentric position
 * Reference: NREL SPA Section 3.2
 */
function calculateGeocentricPosition(JME: number): GeocentricPosition {
  // Earth heliocentric longitude L (degrees)
  const L0 = calculateL0(JME);
  const L1 = calculateL1(JME);
  const L2 = calculateL2(JME);
  const L3 = calculateL3(JME);
  const L4 = calculateL4(JME);
  const L5 = calculateL5(JME);
  
  const L = (L0 + L1 * JME + L2 * JME * JME + L3 * Math.pow(JME, 3) +
             L4 * Math.pow(JME, 4) + L5 * Math.pow(JME, 5)) / 1e8;
  
  // Convert to degrees and limit to 0-360
  const longitude = normalizeAngle(toDegrees(L));
  
  // Earth heliocentric latitude B (degrees)
  const B0 = calculateB0(JME);
  const B1 = calculateB1(JME);
  const B = (B0 + B1 * JME) / 1e8;
  const latitude = toDegrees(B);
  
  // Earth radius vector R (AU)
  const R0 = calculateR0(JME);
  const R1 = calculateR1(JME);
  const R2 = calculateR2(JME);
  const R3 = calculateR3(JME);
  const R4 = calculateR4(JME);
  
  const R = (R0 + R1 * JME + R2 * JME * JME + R3 * Math.pow(JME, 3) +
             R4 * Math.pow(JME, 4)) / 1e8;
  
  return {
    longitude: longitude + 180, // Convert from heliocentric to geocentric
    latitude: -latitude, // Convert from heliocentric to geocentric
    radiusVector: R
  };
}

// Simplified periodic terms for Earth's heliocentric longitude L0
function calculateL0(JME: number): number {
  // Using simplified terms for demonstration
  // Full implementation would include all periodic terms from NREL SPA Table A4.2
  let sum = 0;
  
  // Major terms only
  sum += 175347046 * Math.cos(0 + 0 * JME);
  sum += 3341656 * Math.cos(4.6692568 + 6283.07585 * JME);
  sum += 34894 * Math.cos(4.6261 + 12566.1517 * JME);
  sum += 3497 * Math.cos(2.7441 + 5753.3849 * JME);
  sum += 3418 * Math.cos(2.8289 + 3.5231 * JME);
  sum += 3136 * Math.cos(3.6277 + 77713.7715 * JME);
  
  return sum;
}

// Simplified L1-L5, B0-B1, R0-R4 calculations
function calculateL1(JME: number): number { 
  let sum = 0;
  sum += 628331966747 * Math.cos(0) + 0 * Math.sin(0);
  sum += 206059 * Math.cos(2.678235 + 6283.07585 * JME);
  sum += 4303 * Math.cos(2.6351 + 12566.1517 * JME);
  return sum;
}
function calculateL2(JME: number): number { 
  let sum = 0;
  sum += 52919 * Math.cos(0);
  sum += 8720 * Math.cos(1.0721 + 6283.0758 * JME);
  sum += 309 * Math.cos(0.867 + 12566.152 * JME);
  return sum;
}
function calculateL3(JME: number): number { return 289 * Math.cos(5.844 + 6283.076 * JME); }
function calculateL4(JME: number): number { return 35 * Math.cos(0);
}
function calculateL5(JME: number): number { return 0; }

function calculateB0(JME: number): number {
  let sum = 0;
  sum += 280 * Math.cos(3.199 + 84334.662 * JME);
  sum += 102 * Math.cos(5.422 + 5507.553 * JME);
  sum += 80 * Math.cos(3.88 + 5223.69 * JME);
  return sum;
}

function calculateB1(JME: number): number { return 9 * Math.cos(3.9 + 5507.55 * JME); }

function calculateR0(JME: number): number {
  let sum = 0;
  sum += 100013989;
  sum += 1670700 * Math.cos(3.0984635 + 6283.07585 * JME);
  sum += 13956 * Math.cos(3.05525 + 12566.1517 * JME);
  return sum;
}

function calculateR1(JME: number): number { return 103019 * Math.cos(1.10749 + 6283.07585 * JME); }
function calculateR2(JME: number): number { return 4359 * Math.cos(5.7846 + 6283.0758 * JME); }
function calculateR3(JME: number): number { return 145 * Math.cos(4.273 + 6283.076 * JME); }
function calculateR4(JME: number): number { return 4 * Math.cos(3.84 + 6283.08 * JME); }

/**
 * Calculate nutation in longitude and obliquity
 * Reference: NREL SPA Section 3.4
 */
function calculateNutation(JCE: number): NutationCorrection {
  // Mean elongation of the moon from the sun (degrees)
  const D = 297.85036 + 445267.111480 * JCE - 0.0019142 * JCE * JCE + JCE * JCE * JCE / 189474;
  
  // Mean anomaly of the sun (Earth) (degrees)
  const M = 357.52772 + 35999.050340 * JCE - 0.0001603 * JCE * JCE - JCE * JCE * JCE / 300000;
  
  // Mean anomaly of the moon (degrees)
  const MP = 134.96298 + 477198.867398 * JCE + 0.0086972 * JCE * JCE + JCE * JCE * JCE / 56250;
  
  // Moon's argument of latitude (degrees)
  const F = 93.27191 + 483202.017538 * JCE - 0.0036825 * JCE * JCE + JCE * JCE * JCE / 327270;
  
  // Longitude of ascending node of moon's mean orbit (degrees)
  const omega = 125.04452 - 1934.136261 * JCE + 0.0020708 * JCE * JCE + JCE * JCE * JCE / 450000;
  
  // Simplified nutation calculation
  const nutationLongitude = (-17.20 * Math.sin(toRadians(omega)) - 
                             1.32 * Math.sin(2 * toRadians(F)) - 
                             0.23 * Math.sin(2 * toRadians(MP)) + 
                             0.21 * Math.sin(2 * toRadians(omega))) / 3600;
  
  const nutationObliquity = (9.20 * Math.cos(toRadians(omega)) + 
                            0.57 * Math.cos(2 * toRadians(F)) + 
                            0.10 * Math.cos(2 * toRadians(MP)) - 
                            0.09 * Math.cos(2 * toRadians(omega))) / 3600;
  
  return {
    longitude: nutationLongitude,
    obliquity: nutationObliquity
  };
}

/**
 * Calculate mean obliquity of the ecliptic
 * Reference: NREL SPA Section 3.5
 */
function calculateMeanObliquity(JME: number): number {
  const U = JME / 10;
  const e0 = 84381.448 - 4680.93 * U - 1.55 * U * U + 1999.25 * U * U * U -
         51.38 * U * U * U * U - 249.67 * Math.pow(U, 5) - 39.05 * Math.pow(U, 6) +
         7.12 * Math.pow(U, 7) + 27.87 * Math.pow(U, 8) + 5.79 * Math.pow(U, 9) +
         2.45 * Math.pow(U, 10);
  return e0 / 3600; // Convert arcseconds to degrees
}

/**
 * Calculate mean sidereal time at Greenwich
 * Reference: NREL SPA Section 3.7
 */
function calculateMeanSiderealTime(JD: number, JC: number): number {
  const v0 = 280.46061837 + 360.98564736629 * (JD - 2451545) + 
             0.000387933 * JC * JC - JC * JC * JC / 38710000;
  return normalizeAngle(v0);
}

/**
 * Calculate equatorial coordinates
 * Reference: NREL SPA Section 3.8
 */
function calculateEquatorialCoordinates(
  longitude: number, 
  obliquity: number, 
  latitude: number
): EquatorialCoordinates {
  const lonRad = toRadians(longitude);
  const oblRad = toRadians(obliquity); // obliquity already in degrees
  const latRad = toRadians(latitude);
  
  // Right ascension
  const alpha = Math.atan2(
    Math.sin(lonRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad),
    Math.cos(lonRad)
  );
  const rightAscension = normalizeAngle(toDegrees(alpha));
  
  // Declination
  const delta = Math.asin(
    Math.sin(latRad) * Math.cos(oblRad) + 
    Math.cos(latRad) * Math.sin(oblRad) * Math.sin(lonRad)
  );
  const declination = toDegrees(delta);
  
  return { rightAscension, declination };
}

/**
 * Calculate topocentric position
 * Reference: NREL SPA Section 3.9-3.12
 */
function calculateTopocentricPosition(
  equatorial: EquatorialCoordinates,
  siderealTime: number,
  latitude: number,
  longitude: number,
  elevation: number,
  JD: number,
  pressure: number,
  temperature: number
): TopocentricPosition {
  // Calculate parallax correction
  const earthRadius = 6378.14; // km
  const flattening = 0.00335281;
  const u = Math.atan((1 - flattening) * Math.tan(toRadians(latitude)));
  const x = Math.cos(u) + elevation * Math.cos(toRadians(latitude)) / earthRadius / 1000;
  const y = (1 - flattening) * Math.sin(u) + elevation * Math.sin(toRadians(latitude)) / earthRadius / 1000;
  
  // Parallax in right ascension
  const parallaxRA = Math.atan2(
    -x * Math.sin(toRadians(siderealTime + longitude)),
    Math.cos(toRadians(equatorial.declination)) - 
    x * Math.cos(toRadians(siderealTime + longitude))
  );
  
  // Topocentric right ascension
  const topoRA = equatorial.rightAscension + toDegrees(parallaxRA);
  
  // Topocentric declination
  const topoDec = toDegrees(Math.atan2(
    (Math.sin(toRadians(equatorial.declination)) - y) * Math.cos(parallaxRA),
    Math.cos(toRadians(equatorial.declination)) - 
    x * Math.cos(toRadians(siderealTime + longitude))
  ));
  
  // Local hour angle
  const localSiderealTime = siderealTime + longitude;
  const hourAngle = normalizeAngle(localSiderealTime - topoRA);
  
  // Topocentric zenith angle
  const latRad = toRadians(latitude);
  const decRad = toRadians(topoDec);
  const haRad = toRadians(hourAngle);
  
  const zenithRad = Math.acos(
    Math.sin(latRad) * Math.sin(decRad) + 
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
  );
  let zenith = toDegrees(zenithRad);
  
  // Atmospheric refraction correction
  const apparentElevation = 90 - zenith;
  if (apparentElevation > -1) {
    const refractionCorrection = calculateRefractionCorrection(
      apparentElevation, 
      pressure, 
      temperature
    );
    zenith -= refractionCorrection;
  }
  
  // Topocentric azimuth angle
  const azimuthRad = Math.atan2(
    Math.sin(haRad),
    Math.cos(haRad) * Math.sin(latRad) - Math.tan(decRad) * Math.cos(latRad)
  );
  const azimuth = normalizeAngle(toDegrees(azimuthRad) + 180);
  
  return {
    rightAscension: topoRA,
    declination: topoDec,
    hourAngle,
    azimuth,
    zenith,
    elevation: 90 - zenith
  };
}

/**
 * Calculate atmospheric refraction correction
 * Reference: NREL SPA Section 3.13
 */
function calculateRefractionCorrection(
  elevation: number, 
  pressure: number, 
  temperature: number
): number {
  if (elevation < -0.5) return 0;
  
  const e0 = elevation;
  const deltaE = pressure / 1010 * 283 / (273 + temperature) * 
                 1.02 / (60 * Math.tan(toRadians(e0 + 10.3 / (e0 + 5.11))));
  
  return deltaE / 60; // Convert from arcminutes to degrees
}

// Utility functions
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

/**
 * Wrapper function for backward compatibility
 */
export function getSunPositionNRELFixed(
  date: Date,
  latitude: number,
  longitude: number
): {
  azimuth: number;
  altitude: number;
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  const result = computeSunPositionFixed(
    date,
    latitude,
    longitude
  );
  
  // Convert to radians for compatibility
  const azimuthRadians = toRadians(result.azimuth);
  const altitudeRadians = toRadians(result.elevation);
  
  return {
    azimuth: azimuthRadians,
    altitude: altitudeRadians,
    azimuthDegrees: result.azimuth,
    altitudeDegrees: result.elevation
  };
}
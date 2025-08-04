/**
 * NREL Solar Position Algorithm Implementation (Simplified & Fixed)
 * Based on: Reda, I.; Andreas, A. (2003). Solar Position Algorithm for Solar Radiation Applications.
 * NREL Report No. TP-560-34302, Revised January 2008.
 * 
 * This implementation uses the simplified mean elements approach with proper timezone handling.
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
 * Main NREL SPA calculation function (Simplified & Fixed)
 */
export function computeSunPositionSimplified(
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
  const geocentric = calculateGeocentricPosition(julian.JCE);
  
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
 */
function calculateDeltaT(year: number, month: number): number {
  const y = year + (month - 0.5) / 12;
  
  if (y >= 2015) {
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
 * Calculate Earth's heliocentric position using simplified mean elements
 */
function calculateGeocentricPosition(JCE: number): GeocentricPosition {
  // Mean longitude (degrees)
  const L0 = 280.46646 + 36000.76983 * JCE + 0.0003032 * JCE * JCE;
  
  // Mean anomaly (degrees)
  const M = 357.52911 + 35999.05029 * JCE - 0.0001537 * JCE * JCE;
  const Mrad = toRadians(M);
  
  // Equation of center
  const C = (1.914602 - 0.004817 * JCE - 0.000014 * JCE * JCE) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * JCE) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  
  // True longitude
  const longitude = normalizeAngle(L0 + C);
  
  // True anomaly
  const v = M + C;
  
  // Eccentricity of Earth's orbit
  const e = 0.016708634 - 0.000042037 * JCE - 0.0000001267 * JCE * JCE;
  
  // Radius vector (AU)
  const radiusVector = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(toRadians(v)));
  
  // Heliocentric latitude (simplified to 0 for basic calculation)
  const latitude = 0;
  
  return { longitude, latitude, radiusVector };
}

/**
 * Calculate nutation in longitude and obliquity
 */
function calculateNutation(JCE: number): NutationCorrection {
  // Mean elongation of the moon from the sun (degrees)
  const D = 297.85036 + 445267.111480 * JCE - 0.0019142 * JCE * JCE;
  
  // Mean anomaly of the sun (degrees)
  const M = 357.52772 + 35999.050340 * JCE - 0.0001603 * JCE * JCE;
  
  // Mean anomaly of the moon (degrees)
  const Mp = 134.96298 + 477198.867398 * JCE + 0.0086972 * JCE * JCE;
  
  // Moon's argument of latitude (degrees)
  const F = 93.27191 + 483202.017538 * JCE - 0.0036825 * JCE * JCE;
  
  // Longitude of ascending node of moon's mean orbit (degrees)
  const Omega = 125.04452 - 1934.136261 * JCE + 0.0020708 * JCE * JCE;
  
  // Convert to radians
  const Omegarad = toRadians(Omega);
  const Frad = toRadians(F);
  const Mprad = toRadians(Mp);
  
  // Nutation in longitude (arcseconds)
  const nutationLongitude = -17.20 * Math.sin(Omegarad) - 1.32 * Math.sin(2 * Frad) - 
                           0.23 * Math.sin(2 * Mprad) + 0.21 * Math.sin(2 * Omegarad);
  
  // Nutation in obliquity (arcseconds)
  const nutationObliquity = 9.20 * Math.cos(Omegarad) + 0.57 * Math.cos(2 * Frad) + 
                           0.10 * Math.cos(2 * Mprad) - 0.09 * Math.cos(2 * Omegarad);
  
  return {
    longitude: nutationLongitude / 3600, // Convert to degrees
    obliquity: nutationObliquity / 3600  // Convert to degrees
  };
}

/**
 * Calculate mean obliquity of the ecliptic
 */
function calculateMeanObliquity(JME: number): number {
  const U = JME / 10;
  const e0 = 84381.448 - 4680.93 * U - 1.55 * U * U + 1999.25 * U * U * U;
  return e0 / 3600; // Convert arcseconds to degrees
}

/**
 * Calculate mean sidereal time at Greenwich
 */
function calculateMeanSiderealTime(JD: number, JC: number): number {
  const v0 = 280.46061837 + 360.98564736629 * (JD - 2451545) + 
             0.000387933 * JC * JC - JC * JC * JC / 38710000;
  return normalizeAngle(v0);
}

/**
 * Calculate equatorial coordinates
 */
function calculateEquatorialCoordinates(
  longitude: number, 
  obliquity: number, 
  latitude: number
): EquatorialCoordinates {
  const lonRad = toRadians(longitude);
  const oblRad = toRadians(obliquity);
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
  const u = Math.atan(0.99664719 * Math.tan(toRadians(latitude)));
  const x = Math.cos(u) + elevation * Math.cos(toRadians(latitude)) / earthRadius / 1000;
  const y = 0.99664719 * Math.sin(u) + elevation * Math.sin(toRadians(latitude)) / earthRadius / 1000;
  
  // Local hour angle
  const localHourAngle = siderealTime + longitude - equatorial.rightAscension;
  const H = normalizeAngle(localHourAngle);
  
  // Parallax in right ascension
  const parallaxRA = Math.atan2(
    -x * Math.sin(toRadians(H)),
    Math.cos(toRadians(equatorial.declination)) - 
    x * Math.cos(toRadians(H))
  );
  
  // Topocentric right ascension
  const topoRA = equatorial.rightAscension + toDegrees(parallaxRA);
  
  // Topocentric declination
  const topoDec = toDegrees(Math.atan2(
    (Math.sin(toRadians(equatorial.declination)) - y) * Math.cos(parallaxRA),
    Math.cos(toRadians(equatorial.declination)) - 
    x * Math.cos(toRadians(H))
  ));
  
  // Recalculate local hour angle with topocentric RA
  const topoHourAngle = normalizeAngle(siderealTime + longitude - topoRA);
  
  // Topocentric zenith angle
  const latRad = toRadians(latitude);
  const decRad = toRadians(topoDec);
  const haRad = toRadians(topoHourAngle);
  
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
    hourAngle: topoHourAngle,
    azimuth,
    zenith,
    elevation: 90 - zenith
  };
}

/**
 * Calculate atmospheric refraction correction
 */
function calculateRefractionCorrection(
  elevation: number, 
  pressure: number, 
  temperature: number
): number {
  if (elevation < -0.575) return 0;
  
  const e0 = elevation + 10.3 / (elevation + 5.11);
  const refraction = (pressure / 1010) * (283 / (273 + temperature)) * 
                    1.02 / (60 * Math.tan(toRadians(e0)));
  
  return refraction / 60; // Convert arcminutes to degrees
}

// Utility functions
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

function normalizeAngle(angle: number): number {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}

/**
 * Wrapper function for backward compatibility
 */
export function getSunPositionNRELSimplified(
  date: Date,
  latitude: number,
  longitude: number
): {
  azimuth: number;
  altitude: number;
  azimuthDegrees: number;
  altitudeDegrees: number;
} {
  const result = computeSunPositionSimplified(
    date,
    latitude,
    longitude
  );
  
  // Convert to radians for compatibility with SunCalc interface
  const azimuthRadians = toRadians(result.azimuth);
  const altitudeRadians = toRadians(result.elevation);
  
  return {
    azimuth: azimuthRadians,
    altitude: altitudeRadians,
    azimuthDegrees: result.azimuth,
    altitudeDegrees: result.elevation
  };
}
/**
 * NREL Solar Position Algorithm Implementation
 * Based on: Reda, I.; Andreas, A. (2003). Solar Position Algorithm for Solar Radiation Applications.
 * NREL Report No. TP-560-34302, Revised January 2008.
 * https://www.nrel.gov/docs/fy08osti/34302.pdf
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
 * Main NREL SPA calculation function
 * @param date - Date object (in UTC)
 * @param latitude - Observer latitude in degrees (-90 to 90)
 * @param longitude - Observer longitude in degrees (-180 to 180)
 * @param timeZoneOffset - Time zone offset from UTC in hours (used for local calculations if needed)
 * @param elevation - Observer elevation above sea level in meters (default: 0)
 * @param pressure - Atmospheric pressure in millibars (default: 1013.25)
 * @param temperature - Temperature in Celsius (default: 20)
 * @returns Object with zenith, azimuth, and elevation in degrees
 */
export function computeSunPosition(
  date: Date,
  latitude: number,
  longitude: number,
  timeZoneOffset: number,
  elevation: number = 0,
  pressure: number = 1013.25,
  temperature: number = 20
): { zenith: number; azimuth: number; elevation: number } {
  // NREL algorithm expects UTC time
  // The input date should already be in UTC for accurate calculations
  
  // Step 1: Calculate Julian and Julian Ephemeris Day, Century, and Millennium
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
  // Use UTC time for astronomical calculations
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  
  // Julian day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const JD = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
             Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 
             32045 + hour / 24;
  
  // Julian Ephemeris Day
  const deltaT = calculateDeltaT(year, month); // Simplified delta T calculation
  const JDE = JD + deltaT / 86400;
  
  // Julian Century and Millennium
  const JC = (JD - 2451545) / 36525;
  const JCE = (JDE - 2451545) / 36525;
  const JME = JCE / 10;
  
  return { JD, JDE, JC, JCE, JME };
}

/**
 * Calculate Earth's heliocentric position
 * Reference: NREL SPA Section 3.2
 */
function calculateGeocentricPosition(JME: number): GeocentricPosition {
  // Simplified calculation using mean elements
  // For full accuracy, use the complete periodic terms from NREL SPA Appendix A
  
  // Mean longitude (degrees)
  const L0 = 280.46646 + 36000.76983 * JME + 0.0003032 * JME * JME;
  
  // Mean anomaly (degrees)
  const M = 357.52911 + 35999.05029 * JME - 0.0001537 * JME * JME;
  const Mrad = toRadians(M);
  
  // Equation of center
  const C = (1.914602 - 0.004817 * JME - 0.000014 * JME * JME) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * JME) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  
  // True longitude
  const longitude = normalizeAngle(L0 + C);
  
  // True anomaly
  const v = M + C;
  
  // Radius vector (AU)
  const e = 0.016708634 - 0.000042037 * JME - 0.0000001267 * JME * JME;
  const radiusVector = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(toRadians(v)));
  
  // Heliocentric latitude (simplified to 0 for basic calculation)
  const latitude = 0;
  
  return { longitude, latitude, radiusVector };
}

/**
 * Calculate nutation in longitude and obliquity
 * Reference: NREL SPA Section 3.4
 */
function calculateNutation(JCE: number): NutationCorrection {
  // Simplified nutation calculation
  // For full accuracy, use the complete periodic terms from NREL SPA
  
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
  const Drad = toRadians(D);
  const Mrad = toRadians(M);
  const Mprad = toRadians(Mp);
  const Frad = toRadians(F);
  const Omegarad = toRadians(Omega);
  
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
 * Reference: NREL SPA Section 3.5
 */
function calculateMeanObliquity(JME: number): number {
  const U = JME / 10;
  const e0 = 84381.448 - 4680.93 * U - 1.55 * U * U + 1999.25 * U * U * U;
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
  const u = Math.atan(0.99664719 * Math.tan(toRadians(latitude)));
  const x = Math.cos(u) + elevation * Math.cos(toRadians(latitude)) / earthRadius / 1000;
  const y = 0.99664719 * Math.sin(u) + elevation * Math.sin(toRadians(latitude)) / earthRadius / 1000;
  
  // Parallax in right ascension
  const parallaxRA = Math.atan2(
    -x * Math.sin(toRadians(siderealTime - equatorial.rightAscension)),
    Math.cos(toRadians(equatorial.declination)) - 
    x * Math.cos(toRadians(siderealTime - equatorial.rightAscension))
  );
  
  // Topocentric right ascension
  const topoRA = equatorial.rightAscension + toDegrees(parallaxRA);
  
  // Topocentric declination
  const topoDec = toDegrees(Math.atan2(
    (Math.sin(toRadians(equatorial.declination)) - y) * Math.cos(parallaxRA),
    Math.cos(toRadians(equatorial.declination)) - 
    x * Math.cos(toRadians(siderealTime - equatorial.rightAscension))
  ));
  
  // Local hour angle
  const hourAngle = normalizeAngle(siderealTime - longitude - topoRA);
  
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
  const refractionCorrection = calculateRefractionCorrection(
    90 - zenith, 
    pressure, 
    temperature
  );
  zenith -= refractionCorrection;
  
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
  if (elevation >= -0.575) {
    const e = elevation + 10.3 / (elevation + 5.11);
    const refraction = (pressure / 1010) * (283 / (273 + temperature)) * 
                      1.02 / (60 * Math.tan(toRadians(e)));
    return refraction / 60; // Convert arcminutes to degrees
  }
  return 0;
}

/**
 * Calculate delta T (difference between Terrestrial Time and Universal Time)
 * Simplified calculation for years 2000-2050
 */
function calculateDeltaT(year: number, month: number): number {
  const y = year + (month - 0.5) / 12;
  
  if (y < 2000 || y > 2050) {
    // Use polynomial fit for years outside 2000-2050
    const t = (y - 2000) / 100;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  
  // Linear approximation for 2000-2050
  return 63.83 + 0.1 * (y - 2000);
}

/**
 * Utility functions
 */

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
 * Get timezone offset for a given date and IANA timezone string
 * Uses Intl.DateTimeFormat for accurate DST-aware offset calculation
 */
function getTimezoneOffset(date: Date, timezone: string): number {
  try {
    // Get formatted time parts in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);

    // Create a date object representing the local time in target timezone
    const tzDate = new Date(
      getPart('year'),
      getPart('month') - 1,
      getPart('day'),
      getPart('hour'),
      getPart('minute'),
      getPart('second')
    );

    // Calculate offset: UTC time - local time in target timezone
    const utcTime = date.getTime();
    const tzTime = tzDate.getTime() + (tzDate.getTimezoneOffset() * 60 * 1000);
    const offsetMs = tzTime - utcTime;

    return offsetMs / (60 * 60 * 1000); // Convert to hours
  } catch {
    // Fallback for unsupported timezones
    return -date.getTimezoneOffset() / 60;
  }
}

/**
 * Backward compatibility wrapper
 * This function provides the same interface as the existing getSunPosition
 * @param date - Date object (local time, will be converted to UTC)
 * @param latitude - Observer latitude in degrees
 * @param longitude - Observer longitude in degrees
 * @param timezone - Optional IANA timezone string for accurate conversion
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
  // Calculate timezone offset accurately using Intl API
  const timeZoneOffset = timezone
    ? getTimezoneOffset(date, timezone)
    : -date.getTimezoneOffset() / 60;

  // NREL needs UTC time - the Date object already stores UTC internally
  const result = computeSunPosition(
    date,
    latitude,
    longitude,
    timeZoneOffset
  );

  // Convert altitude to radians for compatibility
  const altitudeRadians = toRadians(result.elevation);

  // NREL already provides azimuth in correct compass degrees (0=N, 90=E, 180=S, 270=W)
  // For SunCalc compatibility, convert to radians with its convention
  // SunCalc: azimuth in radians where 0 = south, π = north

  // Convert NREL compass azimuth to SunCalc radians
  // NREL: 0=N, 90=E, 180=S, 270=W (degrees)
  // SunCalc: 0=S, π=N (radians, mathematical angle from south)
  const sunCalcAzimuthRad = toRadians((result.azimuth + 180) % 360) - Math.PI;

  return {
    azimuth: sunCalcAzimuthRad, // SunCalc-compatible radians
    altitude: altitudeRadians,   // Altitude in radians
    azimuthDegrees: result.azimuth, // Compass degrees (0=N, 90=E, 180=S, 270=W)
    altitudeDegrees: result.elevation // Altitude in degrees
  };
}
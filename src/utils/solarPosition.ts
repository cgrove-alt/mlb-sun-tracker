/**
 * NOAA GML Solar Calculator (Jean Meeus, *Astronomical Algorithms*).
 *
 * Port of the public NOAA Global Monitoring Laboratory implementation:
 *   https://gml.noaa.gov/grad/solcalc/main.js
 *   https://gml.noaa.gov/grad/solcalc/calcdetails.html
 *
 * This is the single source of truth for sun azimuth and altitude. Callers
 * must pass a real UTC `Date` (use `stadiumLocalToUTC` / `calendarDateAndTimeToUTC`
 * to convert stadium wall-clock time first).
 *
 * Azimuth is compass degrees: 0 = north, 90 = east, 180 = south, 270 = west.
 * Altitude is *apparent* (geometric elevation + NOAA atmospheric refraction).
 * Shade geometry follows the sun as it appears in the sky, so refraction is
 * required — especially for evening games when the sun is within a few degrees
 * of the horizon and shadow length ≈ height / tan(altitude).
 */

export interface SolarPosition {
  /** Compass degrees, [0, 360). 0 = N, 90 = E, 180 = S, 270 = W. */
  azimuthDegrees: number;
  /** Apparent altitude in degrees (geometric + refraction). */
  altitudeDegrees: number;
  /** Geometric (topocentric, unrefracted) altitude in degrees. */
  geometricAltitudeDegrees: number;
  /** NOAA refraction correction applied, in degrees. */
  refractionDegrees: number;
}

const degToRad = (deg: number): number => (Math.PI * deg) / 180;
const radToDeg = (rad: number): number => (180 * rad) / Math.PI;

function julianDateUTC(date: Date): number {
  // Unix epoch 1970-01-01T00:00:00Z = JD 2440587.5
  return date.getTime() / 86400000 + 2440587.5;
}

function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

function geomMeanLongSun(t: number): number {
  const L0 = 280.46646 + t * (36000.76983 + t * 0.0003032);
  return ((L0 % 360) + 360) % 360;
}

function geomMeanAnomalySun(t: number): number {
  return 357.52911 + t * (35999.05029 - 0.0001537 * t);
}

function eccentricityEarthOrbit(t: number): number {
  return 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
}

function sunEqOfCenter(t: number): number {
  const mrad = degToRad(geomMeanAnomalySun(t));
  return (
    Math.sin(mrad) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * mrad) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * mrad) * 0.000289
  );
}

function sunApparentLong(t: number): number {
  const trueLong = geomMeanLongSun(t) + sunEqOfCenter(t);
  const omega = 125.04 - 1934.136 * t;
  return trueLong - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
}

function meanObliquityOfEcliptic(t: number): number {
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  return 23 + (26 + seconds / 60) / 60;
}

function obliquityCorrection(t: number): number {
  const omega = 125.04 - 1934.136 * t;
  return meanObliquityOfEcliptic(t) + 0.00256 * Math.cos(degToRad(omega));
}

function sunDeclination(t: number): number {
  const e = obliquityCorrection(t);
  const lambda = sunApparentLong(t);
  return radToDeg(Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(lambda))));
}

function equationOfTimeMinutes(t: number): number {
  const epsilon = obliquityCorrection(t);
  const l0 = geomMeanLongSun(t);
  const e = eccentricityEarthOrbit(t);
  const m = geomMeanAnomalySun(t);
  let y = Math.tan(degToRad(epsilon) / 2);
  y *= y;
  const Etime =
    y * Math.sin(2 * degToRad(l0)) -
    2 * e * Math.sin(degToRad(m)) +
    4 * e * y * Math.sin(degToRad(m)) * Math.cos(2 * degToRad(l0)) -
    0.5 * y * y * Math.sin(4 * degToRad(l0)) -
    1.25 * e * e * Math.sin(2 * degToRad(m));
  return radToDeg(Etime) * 4;
}

/**
 * NOAA atmospheric refraction in degrees, given geometric elevation.
 * Identical to `calcRefraction` in NOAA's published calculator.
 */
export function noaaRefractionDegrees(geometricElevationDeg: number): number {
  if (geometricElevationDeg > 85) return 0;
  const te = Math.tan(degToRad(geometricElevationDeg));
  let correction: number;
  if (geometricElevationDeg > 5) {
    correction = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
  } else if (geometricElevationDeg > -0.575) {
    correction =
      1735 +
      geometricElevationDeg *
        (-518.2 + geometricElevationDeg * (103.4 + geometricElevationDeg * (-12.79 + geometricElevationDeg * 0.711)));
  } else {
    correction = -20.774 / te;
  }
  return correction / 3600;
}

function wrapMinutes(minutes: number): number {
  let m = minutes % 1440;
  if (m < 0) m += 1440;
  return m;
}

/**
 * Sun position at a UTC instant for an observer at (latitude, longitude).
 * Longitude is east-positive (WGS84), matching every stadium in this repo.
 */
export function getSolarPosition(
  date: Date,
  latitude: number,
  longitude: number,
): SolarPosition {
  const jd = julianDateUTC(date);
  const t = julianCentury(jd);
  const eqTime = equationOfTimeMinutes(t);
  const declination = sunDeclination(t);

  const utcMinutes =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60 +
    date.getUTCMilliseconds() / 60000;

  // True solar time in minutes. Equivalent to NOAA's
  // localtime + eqTime + 4*lon - 60*zone, expressed entirely in UTC.
  const trueSolarTime = wrapMinutes(utcMinutes + eqTime + 4 * longitude);
  let hourAngle = trueSolarTime / 4 - 180;
  if (hourAngle < -180) hourAngle += 360;

  const haRad = degToRad(hourAngle);
  let csz =
    Math.sin(degToRad(latitude)) * Math.sin(degToRad(declination)) +
    Math.cos(degToRad(latitude)) * Math.cos(degToRad(declination)) * Math.cos(haRad);
  csz = Math.max(-1, Math.min(1, csz));
  const zenith = radToDeg(Math.acos(csz));

  const azDenom = Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith));
  let azimuth: number;
  if (Math.abs(azDenom) > 0.001) {
    let azCos =
      (Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith)) - Math.sin(degToRad(declination))) /
      azDenom;
    azCos = Math.max(-1, Math.min(1, azCos));
    azimuth = 180 - radToDeg(Math.acos(azCos));
    if (hourAngle > 0) azimuth = -azimuth;
  } else {
    azimuth = latitude > 0 ? 180 : 0;
  }
  if (azimuth < 0) azimuth += 360;

  const geometricElevation = 90 - zenith;
  const refraction = noaaRefractionDegrees(geometricElevation);
  const apparentElevation = geometricElevation + refraction;

  return {
    azimuthDegrees: azimuth,
    altitudeDegrees: apparentElevation,
    geometricAltitudeDegrees: geometricElevation,
    refractionDegrees: refraction,
  };
}

/**
 * Convert compass azimuth (0 = N) to the historical SunCalc radian convention
 * (0 = south, π/2 = west) so existing callers that still read `azimuth` in
 * radians keep working.
 */
export function compassDegreesToSunCalcRadians(azimuthDegrees: number): number {
  return ((azimuthDegrees - 180) * Math.PI) / 180;
}

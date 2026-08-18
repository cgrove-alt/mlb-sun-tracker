/**
 * Sun-position accuracy tests.
 *
 * Production sun position is the NOAA GML Solar Calculator (Meeus). These
 * tests pin three things:
 *
 *   1. Solar-noon geometry (azimuth ≈ 180° in the northern hemisphere).
 *   2. NOAA reference values at known stadium instants, to 0.01°.
 *   3. Atmospheric refraction: apparent altitude must exceed geometric
 *      altitude at low sun, where missing refraction stretches shadows.
 *
 * A previous comparison that claimed a 33° NOAA azimuth error was querying
 * NOAA at 1 PM EST (no DST) and comparing it to 1 PM EDT. At 1 PM EDT on
 * the 2024 solstice in NYC, NOAA azimuth is 181.55° — due south, as physics
 * requires near solar noon.
 */

import { getSunPosition } from '../sunCalculations';
import { getSolarPosition, noaaRefractionDegrees } from '../solarPosition';

function azDiff(a: number, b: number): number {
  return Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
}

describe('Sun position — solar-noon geometry', () => {
  // At apparent solar noon the sun is on the meridian. Azimuth ≈ 180° in
  // the Northern Hemisphere. Altitude ≈ 90 − lat ± 23.44 depending on date.
  // Apparent (refracted) altitude is a few hundredths of a degree higher
  // than the geometric value; 1° covers both refraction and Equation of Time
  // slop from rounding the noon instant to the nearest half-minute.
  const ALTITUDE_TOLERANCE_DEG = 1.0;
  const AZIMUTH_TOLERANCE_DEG = 3.5;

  const CASES = [
    {
      label: 'Yankee Stadium summer solstice solar noon',
      date: '2025-06-21T16:54:00Z',
      latitude: 40.8296,
      longitude: -73.9262,
      expectedAzimuth: 180,
      expectedAltitude: 90 - 40.8296 + 23.44,
    },
    {
      label: 'Yankee Stadium winter solstice solar noon',
      date: '2025-12-21T16:57:30Z',
      latitude: 40.8296,
      longitude: -73.9262,
      expectedAzimuth: 180,
      expectedAltitude: 90 - 40.8296 - 23.44,
    },
    {
      label: 'Yankee Stadium spring equinox solar noon',
      date: '2025-03-20T17:03:30Z',
      latitude: 40.8296,
      longitude: -73.9262,
      expectedAzimuth: 180,
      expectedAltitude: 90 - 40.8296,
    },
    {
      label: 'Dodger Stadium winter solstice solar noon',
      date: '2025-12-21T19:55:00Z',
      latitude: 34.0739,
      longitude: -118.2398,
      expectedAzimuth: 180,
      expectedAltitude: 90 - 34.0739 - 23.44,
    },
    {
      label: 'Coors Field summer solstice solar noon',
      date: '2025-06-21T18:58:30Z',
      latitude: 39.7559,
      longitude: -104.9942,
      expectedAzimuth: 180,
      expectedAltitude: 90 - 39.7559 + 23.44,
    },
  ];

  for (const c of CASES) {
    it(`${c.label} — within tolerance of expected geometry`, () => {
      const pos = getSunPosition(new Date(c.date), c.latitude, c.longitude);
      expect(azDiff(pos.azimuthDegrees, c.expectedAzimuth)).toBeLessThanOrEqual(AZIMUTH_TOLERANCE_DEG);
      expect(Math.abs(pos.altitudeDegrees - c.expectedAltitude)).toBeLessThanOrEqual(ALTITUDE_TOLERANCE_DEG);
    });
  }
});

describe('Sun position — NOAA GML reference values', () => {
  // Values generated from NOAA's published calculator (main.js calcAzEl)
  // at the same UTC instants. Tolerance 0.01° is an order of magnitude
  // tighter than stadium orientation uncertainty and catches a return to
  // unrefracted SunCalc or a broken compass conversion.
  const TOLERANCE_DEG = 0.01;

  const NOAA_CASES: Array<{
    label: string;
    date: string;
    latitude: number;
    longitude: number;
    azimuth: number;
    altitude: number;
  }> = [
    {
      label: 'Yankee Stadium 2025-07-04 19:30 EDT',
      date: '2025-07-04T23:30:00Z',
      latitude: 40.8296,
      longitude: -73.9262,
      azimuth: 292.0824,
      altitude: 9.4732,
    },
    {
      label: 'Yankee Stadium 2025-07-04 13:00 EDT',
      date: '2025-07-04T17:00:00Z',
      latitude: 40.8296,
      longitude: -73.9262,
      azimuth: 179.82,
      altitude: 71.9818,
    },
    {
      label: 'NYC 2024-06-21 13:00 EDT (docs example — due south, not 214°)',
      date: '2024-06-21T17:00:00Z',
      latitude: 40.7128,
      longitude: -74.006,
      azimuth: 181.549,
      altitude: 72.7233,
    },
    {
      label: 'Wrigley Field 2025-07-04 19:30 CDT',
      date: '2025-07-05T00:30:00Z',
      latitude: 41.9484,
      longitude: -87.6553,
      azimuth: 292.6935,
      altitude: 9.0207,
    },
    {
      label: 'Oracle Park 2025-07-04 19:00 PDT',
      date: '2025-07-05T02:00:00Z',
      latitude: 37.7786,
      longitude: -122.3893,
      azimuth: 286.4105,
      altitude: 16.4402,
    },
    {
      label: 'Yankee Stadium 2025-07-04 20:15 EDT (low sun, refraction-critical)',
      date: '2025-07-05T00:15:00Z',
      latitude: 40.8296,
      longitude: -73.9262,
      azimuth: 299.0912,
      altitude: 2.0077,
    },
  ];

  for (const c of NOAA_CASES) {
    it(`${c.label}`, () => {
      const pos = getSunPosition(new Date(c.date), c.latitude, c.longitude);
      expect(azDiff(pos.azimuthDegrees, c.azimuth)).toBeLessThanOrEqual(TOLERANCE_DEG);
      expect(Math.abs(pos.altitudeDegrees - c.altitude)).toBeLessThanOrEqual(TOLERANCE_DEG);
    });
  }
});

describe('Sun position — atmospheric refraction', () => {
  it('raises apparent altitude above geometric altitude at low evening sun', () => {
    // 20:15 EDT at Yankee Stadium: geometric ~1.7°, refraction ~0.30°.
    // SunCalc.getPosition returns unrefracted altitude (~1.77°). Missing
    // that 0.30° stretches a 50 ft shadow by ~13%.
    const pos = getSolarPosition(new Date('2025-07-05T00:15:00Z'), 40.8296, -73.9262);
    expect(pos.altitudeDegrees).toBeGreaterThan(pos.geometricAltitudeDegrees);
    expect(pos.refractionDegrees).toBeGreaterThan(0.25);
    expect(pos.refractionDegrees).toBeLessThan(0.35);
    expect(Math.abs(pos.altitudeDegrees - pos.geometricAltitudeDegrees - pos.refractionDegrees))
      .toBeLessThan(1e-9);
  });

  it('matches NOAA refraction at 5° geometric elevation', () => {
    // NOAA piecewise: 58.1/tan(e) − 0.07/tan³(e) + … for e > 5°.
    expect(noaaRefractionDegrees(5.0001)).toBeGreaterThan(0.15);
    expect(noaaRefractionDegrees(90)).toBe(0);
  });

  it('getSunPosition exposes the same apparent altitude as getSolarPosition', () => {
    const date = new Date('2025-07-04T23:30:00Z');
    const wrapped = getSunPosition(date, 40.8296, -73.9262);
    const raw = getSolarPosition(date, 40.8296, -73.9262);
    expect(wrapped.altitudeDegrees).toBe(raw.altitudeDegrees);
    expect(wrapped.azimuthDegrees).toBe(raw.azimuthDegrees);
    expect(wrapped.geometricAltitudeDegrees).toBe(raw.geometricAltitudeDegrees);
  });
});

describe('Sun position — NREL SPA paper cross-check', () => {
  // Reda & Andreas 2003, Table 1. SPA with pressure/temp: azimuth 194.34024°,
  // zenith 50.11162° → elevation 39.88838°. NOAA (no pressure/temp) agrees
  // to ~0.003°. A regression back to SunCalc misses by 0.35° in azimuth.
  it('Golden, CO 2003-10-17 12:30:30 MST is within 0.05° of SPA', () => {
    const pos = getSunPosition(new Date('2003-10-17T19:30:30Z'), 39.742476, -105.1786);
    expect(azDiff(pos.azimuthDegrees, 194.34024)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(pos.altitudeDegrees - 39.88838)).toBeLessThanOrEqual(0.05);
  });
});

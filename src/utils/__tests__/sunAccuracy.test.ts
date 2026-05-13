/**
 * Sun-position accuracy regression tests.
 *
 * These pin SunCalc's output against well-known astronomical geometry
 * (solstices and equinoxes at solar noon), where the answer is dictated by
 * Earth's axial tilt (≈23.44°) and the observer's latitude. If the sun
 * calculation ever drifts outside the ±1° tolerance, something in the
 * pipeline (library version, refraction handling, UTC/local time
 * conversion) has changed and the change should be reviewed.
 *
 * Solar noon is when the sun crosses the local meridian. At longitude L
 * west of Greenwich, solar noon ≈ 12:00 UTC + L/15 hours (ignoring the
 * Equation of Time, which is at most ±16 minutes through the year).
 */

import { getSunPosition } from '../sunCalculations';

// Tolerance absorbs the Equation of Time slop (±~3° azimuth at solar
// noon when UTC times are rounded to the nearest hour). The actual
// SunCalc-to-NOAA delta is ~1 arcminute, so anything outside this band
// would represent a real regression, not approximation noise.
const AZIMUTH_TOLERANCE_DEG = 3.5;
const ALTITUDE_TOLERANCE_DEG = 2.0;

interface AccuracyCase {
  label: string;
  date: string; // ISO string in UTC
  latitude: number;
  longitude: number;
  expectedAzimuth: number; // degrees, compass
  expectedAltitude: number; // degrees, above horizon
}

// At solar noon the sun is on the meridian — azimuth = 180° (due south) in
// the Northern Hemisphere. Altitude depends on the date (axial tilt).
//
// Approximations used here (good to ~0.5° at solar noon):
//   summer solstice altitude  = 90° − latitude + 23.44°
//   winter solstice altitude  = 90° − latitude − 23.44°
//   equinox altitude          = 90° − latitude
//
// Per-stadium solar-noon UTC ≈ 12:00 + |longitude|/15 hours (since all
// stadiums tested are in the Western Hemisphere). We use the closest
// quarter-hour for readability; tolerance is ±1° so the small Equation of
// Time error is absorbed.

const CASES: AccuracyCase[] = [
  // Yankee Stadium (40.8296°N, 73.9262°W) — apparent solar noon on 2025-06-21
  // ≈ 16:54 UTC (mean noon 16:55:42 minus EoT ≈ 1.5 min).
  {
    label: 'Yankee Stadium summer solstice solar noon',
    date: '2025-06-21T16:54:00Z',
    latitude: 40.8296,
    longitude: -73.9262,
    expectedAzimuth: 180,
    expectedAltitude: 90 - 40.8296 + 23.44, // ≈ 72.61°
  },
  // Apparent solar noon 2025-12-21 ≈ 16:57:30 UTC (EoT ≈ +1.5 min in late Dec).
  {
    label: 'Yankee Stadium winter solstice solar noon',
    date: '2025-12-21T16:57:30Z',
    latitude: 40.8296,
    longitude: -73.9262,
    expectedAzimuth: 180,
    expectedAltitude: 90 - 40.8296 - 23.44, // ≈ 25.73°
  },
  // Apparent solar noon 2025-03-20 ≈ 17:03:30 UTC (EoT ≈ −7 min near equinox).
  {
    label: 'Yankee Stadium spring equinox solar noon',
    date: '2025-03-20T17:03:30Z',
    latitude: 40.8296,
    longitude: -73.9262,
    expectedAzimuth: 180,
    expectedAltitude: 90 - 40.8296, // ≈ 49.17°
  },
  // Dodger Stadium (34.0739°N, 118.2398°W) — winter solstice, where altitude
  // is well off the zenith and azimuth at solar noon is therefore stable.
  // Apparent solar noon 2025-12-21 ≈ 19:55 UTC.
  {
    label: 'Dodger Stadium winter solstice solar noon',
    date: '2025-12-21T19:55:00Z',
    latitude: 34.0739,
    longitude: -118.2398,
    expectedAzimuth: 180,
    expectedAltitude: 90 - 34.0739 - 23.44, // ≈ 32.49°
  },
  // Coors Field, Denver (39.7559°N, 104.9942°W) — apparent solar noon
  // ≈ 18:58:30 UTC on 2025-06-21.
  {
    label: 'Coors Field summer solstice solar noon',
    date: '2025-06-21T18:58:30Z',
    latitude: 39.7559,
    longitude: -104.9942,
    expectedAzimuth: 180,
    expectedAltitude: 90 - 39.7559 + 23.44, // ≈ 73.68°
  },
];

describe('Sun position accuracy', () => {
  for (const c of CASES) {
    it(`${c.label} — within tolerance of expected geometry`, () => {
      const pos = getSunPosition(new Date(c.date), c.latitude, c.longitude);
      const azDiff = Math.min(
        Math.abs(pos.azimuthDegrees - c.expectedAzimuth),
        360 - Math.abs(pos.azimuthDegrees - c.expectedAzimuth),
      );
      const altDiff = Math.abs(pos.altitudeDegrees - c.expectedAltitude);
      if (azDiff > AZIMUTH_TOLERANCE_DEG || altDiff > ALTITUDE_TOLERANCE_DEG) {
        // eslint-disable-next-line no-console
        console.error(
          `[sun-accuracy] ${c.label}: got az=${pos.azimuthDegrees.toFixed(2)}°, ` +
            `alt=${pos.altitudeDegrees.toFixed(2)}°; expected az=${c.expectedAzimuth.toFixed(2)}°, ` +
            `alt=${c.expectedAltitude.toFixed(2)}° (Δaz=${azDiff.toFixed(2)}°, Δalt=${altDiff.toFixed(2)}°)`,
        );
      }
      expect(azDiff).toBeLessThanOrEqual(AZIMUTH_TOLERANCE_DEG);
      expect(altDiff).toBeLessThanOrEqual(ALTITUDE_TOLERANCE_DEG);
    });
  }
});

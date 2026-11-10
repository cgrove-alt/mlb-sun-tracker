/**
 * NREL SPA (src/utils/solarPosition.ts) accuracy tests.
 *
 * 1. Every intermediate value of the worked example in Reda & Andreas,
 *    NREL/TP-560-34302 (2008), to the precision the paper prints. A typo in
 *    any periodic-term table moves L, B or R and fails here.
 * 2. The audit's reference point: a July 1:05 PM game at Yankee Stadium has
 *    the sun at about 182° azimuth and 70° elevation.
 * 3. An independent algorithm (NOAA/Meeus, kept test-only) agrees at every
 *    MLB park across 2025 day and evening first-pitch times.
 * 4. Sunrise and sunset match published 2025 times.
 */

import {
  getSolarPosition,
  getSunTimes,
  spaCalculate,
  spaRefractionDegrees,
  standardPressureMbar,
} from '../solarPosition';
import { getSolarPosition as noaaSolarPosition } from '../testReference/noaaSolarReference';
import { MLB_STADIUMS } from '../../data/stadiums';
import { stadiumLocalToUTC } from '../stadiumTime';

const azDiff = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

describe('NREL SPA: the paper\'s worked example', () => {
  // 2003-10-17 12:30:30 local, UTC−7; Golden, CO; ΔT = 67 s.
  const r = spaCalculate(new Date('2003-10-17T19:30:30Z'), 39.742476, -105.1786, {
    elevationMeters: 1830.14,
    pressureMbar: 820,
    temperatureC: 11,
    deltaTSeconds: 67,
  });

  it.each([
    ['jd', 2452930.312847, 1e-6],
    ['L', 24.0182616917, 1e-9],
    ['B', -0.0001011219, 1e-10],
    ['R', 0.9965422974, 1e-9],
    ['theta', 204.0182616917, 1e-9],
    ['beta', 0.0001011219, 1e-10],
    ['deltaPsi', -0.0039984, 1e-7],
    ['deltaEpsilon', 0.00166657, 1e-8],
    ['epsilon', 23.440465, 1e-6],
    ['lambda', 204.0085519281, 1e-9],
    ['alpha', 202.22741, 1e-5],
    ['delta', -9.31434, 1e-5],
    ['H', 11.105902, 1e-6],
    ['zenith', 50.11162, 1e-5],
    ['azimuth', 194.34024, 1e-5],
  ] as const)('%s = %d', (key, expected, tolerance) => {
    expect(Math.abs(r[key] - expected)).toBeLessThanOrEqual(tolerance);
  });
});

describe('NREL SPA: audit reference point', () => {
  it('Yankee Stadium, July 1:05 PM: sun ≈ 182° azimuth, ≈ 70° elevation', () => {
    const utc = stadiumLocalToUTC('2025-07-15', '13:05', 'America/New_York');
    const sun = getSolarPosition(utc, 40.8296, -73.9262);
    expect(azDiff(sun.azimuthDegrees, 182)).toBeLessThan(1.5);
    expect(Math.abs(sun.altitudeDegrees - 70)).toBeLessThan(1);
  });
});

describe('NREL SPA: agrees with an independent algorithm at every MLB park', () => {
  // NOAA/Meeus is a different published algorithm. The two place the sun
  // within 0.01° of each other on the sky. That is compared as an angular
  // separation, not an azimuth difference: with the sun 80°+ overhead (June
  // midday in Houston, Miami, San Diego) a 0.004° separation shows up as
  // 0.025° of azimuth. Refraction-corrected altitude is compared only while
  // the sun is up; below the horizon NOAA still adds refraction and SPA (by
  // design) does not, and neither affects shade.
  const DATES = ['2025-04-15', '2025-06-21', '2025-08-15'];
  const TIMES = ['13:05', '16:05', '19:05'];
  const skySeparation = (az1: number, el1: number, az2: number, el2: number) => {
    const r = Math.PI / 180;
    const c = Math.sin(el1 * r) * Math.sin(el2 * r) + Math.cos(el1 * r) * Math.cos(el2 * r) * Math.cos((az1 - az2) * r);
    return Math.acos(Math.min(1, c)) / r;
  };

  for (const stadium of MLB_STADIUMS) {
    it(`${stadium.name}: SPA and NOAA agree for 2025 first pitches`, () => {
      for (const date of DATES) {
        for (const time of TIMES) {
          const utc = stadiumLocalToUTC(date, time, stadium.timezone);
          const spa = getSolarPosition(utc, stadium.latitude, stadium.longitude);
          const noaa = noaaSolarPosition(utc, stadium.latitude, stadium.longitude);
          expect(skySeparation(
            spa.azimuthDegrees, spa.geometricAltitudeDegrees,
            noaa.azimuthDegrees, noaa.geometricAltitudeDegrees,
          )).toBeLessThan(0.01);
          if (noaa.geometricAltitudeDegrees > 1) {
            const tolerance = noaa.altitudeDegrees > 10 ? 0.02 : 0.06;
            expect(Math.abs(spa.altitudeDegrees - noaa.altitudeDegrees)).toBeLessThan(tolerance);
          }
        }
      }
    });
  }
});

describe('NREL SPA: refraction', () => {
  it('is zero once the whole sun is below the horizon', () => {
    expect(spaRefractionDegrees(-1)).toBe(0);
  });

  it('is about 0.3° near the horizon and tiny overhead', () => {
    expect(spaRefractionDegrees(1.7)).toBeGreaterThan(0.25);
    expect(spaRefractionDegrees(1.7)).toBeLessThan(0.35);
    expect(spaRefractionDegrees(70)).toBeLessThan(0.01);
  });

  it('apparent = geometric + refraction', () => {
    const p = getSolarPosition(new Date('2025-07-05T00:15:00Z'), 40.8296, -73.9262);
    expect(Math.abs(p.altitudeDegrees - p.geometricAltitudeDegrees - p.refractionDegrees)).toBeLessThan(1e-12);
    expect(Math.abs(p.zenithDegrees - (90 - p.altitudeDegrees))).toBeLessThan(1e-12);
  });

  it('uses lower pressure at altitude (Coors Field, 1,580 m)', () => {
    expect(standardPressureMbar(0)).toBeCloseTo(1013.25, 2);
    expect(standardPressureMbar(1580)).toBeLessThan(850);
  });
});

describe('NREL SPA: sunrise and sunset', () => {
  const hhmm = (d: Date, tz: string) =>
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  const minutes = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };

  // Published 2025 times for New York City (Central Park) on the summer
  // solstice: sunrise 5:25 AM, sunset 8:31 PM EDT. The Bronx is ~10 km north,
  // which shifts both by well under a minute.
  it('Yankee Stadium on 2025-06-21', () => {
    const t = getSunTimes(new Date('2025-06-21T16:00:00Z'), 40.8296, -73.9262);
    expect(Math.abs(minutes(hhmm(t.sunrise, 'America/New_York')) - minutes('05:25'))).toBeLessThanOrEqual(2);
    expect(Math.abs(minutes(hhmm(t.sunset, 'America/New_York')) - minutes('20:31'))).toBeLessThanOrEqual(2);
  });

  it('orders the day correctly and puts solar noon on the meridian', () => {
    const t = getSunTimes(new Date('2025-07-15T16:00:00Z'), 40.8296, -73.9262);
    expect(t.dawn < t.sunrise && t.sunrise < t.solarNoon && t.solarNoon < t.goldenHour).toBe(true);
    expect(t.goldenHour < t.sunset && t.sunset < t.dusk).toBe(true);
    const noon = getSolarPosition(t.solarNoon, 40.8296, -73.9262);
    expect(azDiff(noon.azimuthDegrees, 180)).toBeLessThan(0.5);
  });

  it('returns the same day for any instant during that local day', () => {
    const morning = getSunTimes(new Date('2025-07-15T12:00:00Z'), 34.0739, -118.2398);
    const night = getSunTimes(new Date('2025-07-16T05:00:00Z'), 34.0739, -118.2398);
    expect(Math.abs(morning.sunset.getTime() - night.sunset.getTime())).toBeLessThan(1000);
  });
});

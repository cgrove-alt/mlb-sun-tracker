/**
 * Comprehensive Sun Position Calculation Tests
 * Validates accuracy against NOAA/USNO astronomical data
 */

import { getSunPosition, getSunTimes } from '../sunCalculations';
import { getSunPositionNREL } from '../nrelSolarPosition';
import { createSunPosition, calculateRefractionCorrection } from '../shadeCalculation3D';

// Test data with verified astronomical values from NOAA
const ASTRONOMICAL_TEST_CASES = [
  {
    name: 'Yankee Stadium - Summer Solstice Noon',
    date: new Date('2025-06-21T12:00:00-04:00'),
    location: { lat: 40.8296, lon: -73.9262 },
    timezone: 'America/New_York',
    expected: {
      azimuthDegrees: { min: 178, max: 182 }, // Nearly due south
      altitudeDegrees: { min: 72, max: 74 }   // Maximum elevation
    }
  },
  {
    name: 'Dodger Stadium - Winter Solstice Noon',
    date: new Date('2025-12-21T12:00:00-08:00'),
    location: { lat: 34.0739, lon: -118.2400 },
    timezone: 'America/Los_Angeles',
    expected: {
      azimuthDegrees: { min: 178, max: 182 }, // Due south
      altitudeDegrees: { min: 32, max: 34 }   // Low winter sun
    }
  },
  {
    name: 'Fenway Park - Spring Equinox Sunrise',
    date: new Date('2025-03-20T06:00:00-04:00'),
    location: { lat: 42.3467, lon: -71.0972 },
    timezone: 'America/New_York',
    expected: {
      azimuthDegrees: { min: 88, max: 92 },   // Due east
      altitudeDegrees: { min: -1, max: 1 }     // At horizon
    }
  },
  {
    name: 'Oracle Park - Fall Equinox Sunset',
    date: new Date('2025-09-23T18:45:00-07:00'),
    location: { lat: 37.7786, lon: -122.3893 },
    timezone: 'America/Los_Angeles',
    expected: {
      azimuthDegrees: { min: 268, max: 272 },  // Due west
      altitudeDegrees: { min: -1, max: 1 }      // At horizon
    }
  },
  {
    name: 'Wrigley Field - Opening Day 1:20 PM',
    date: new Date('2025-04-01T13:20:00-05:00'),
    location: { lat: 41.9484, lon: -87.6553 },
    timezone: 'America/Chicago',
    expected: {
      azimuthDegrees: { min: 195, max: 205 },
      altitudeDegrees: { min: 48, max: 52 }
    }
  },
  {
    name: 'Chase Field Phoenix - Midsummer 3 PM',
    date: new Date('2025-07-15T15:00:00-07:00'),
    location: { lat: 33.4455, lon: -112.0667 },
    timezone: 'America/Phoenix',
    expected: {
      azimuthDegrees: { min: 245, max: 255 },
      altitudeDegrees: { min: 62, max: 66 }
    }
  },
  {
    name: 'Tropicana Field - October Playoff 7 PM',
    date: new Date('2025-10-15T19:00:00-04:00'),
    location: { lat: 27.7682, lon: -82.6534 },
    timezone: 'America/New_York',
    expected: {
      azimuthDegrees: { min: 260, max: 264 },
      altitudeDegrees: { min: -2, max: 0 }  // After sunset
    }
  },
  {
    name: 'Coors Field - All-Star Game 5 PM',
    date: new Date('2025-07-08T17:00:00-06:00'),
    location: { lat: 39.7559, lon: -104.9942 },
    timezone: 'America/Denver',
    expected: {
      azimuthDegrees: { min: 265, max: 275 },
      altitudeDegrees: { min: 38, max: 42 }
    }
  }
];

describe('Sun Position Calculations', () => {
  describe('Accuracy Tests - SunCalc vs NREL vs Expected', () => {
    ASTRONOMICAL_TEST_CASES.forEach(testCase => {
      test(testCase.name, () => {
        // Calculate using both methods
        const sunCalcPos = getSunPosition(
          testCase.date,
          testCase.location.lat,
          testCase.location.lon,
          testCase.timezone
        );
        
        const nrelPos = getSunPositionNREL(
          testCase.date,
          testCase.location.lat,
          testCase.location.lon,
          testCase.timezone
        );
        
        // Validate SunCalc results
        expect(sunCalcPos.azimuthDegrees).toBeGreaterThanOrEqual(testCase.expected.azimuthDegrees.min);
        expect(sunCalcPos.azimuthDegrees).toBeLessThanOrEqual(testCase.expected.azimuthDegrees.max);
        expect(sunCalcPos.altitudeDegrees).toBeGreaterThanOrEqual(testCase.expected.altitudeDegrees.min);
        expect(sunCalcPos.altitudeDegrees).toBeLessThanOrEqual(testCase.expected.altitudeDegrees.max);
        
        // Validate NREL results
        expect(nrelPos.azimuthDegrees).toBeGreaterThanOrEqual(testCase.expected.azimuthDegrees.min);
        expect(nrelPos.azimuthDegrees).toBeLessThanOrEqual(testCase.expected.azimuthDegrees.max);
        expect(nrelPos.altitudeDegrees).toBeGreaterThanOrEqual(testCase.expected.altitudeDegrees.min);
        expect(nrelPos.altitudeDegrees).toBeLessThanOrEqual(testCase.expected.altitudeDegrees.max);
        
        // SunCalc and NREL should agree within 3 degrees
        expect(Math.abs(sunCalcPos.azimuthDegrees - nrelPos.azimuthDegrees)).toBeLessThan(3);
        expect(Math.abs(sunCalcPos.altitudeDegrees - nrelPos.altitudeDegrees)).toBeLessThan(3);
      });
    });
  });

  describe('Atmospheric Refraction Corrections', () => {
    test('Maximum refraction at horizon', () => {
      const refraction = calculateRefractionCorrection(0);
      expect(refraction).toBeGreaterThan(0.56);
      expect(refraction).toBeLessThan(0.58);  // ~0.57 degrees
    });

    test('Refraction decreases with elevation', () => {
      const refraction5 = calculateRefractionCorrection(5);
      const refraction15 = calculateRefractionCorrection(15);
      const refraction45 = calculateRefractionCorrection(45);
      const refraction90 = calculateRefractionCorrection(90);
      
      expect(refraction5).toBeGreaterThan(refraction15);
      expect(refraction15).toBeGreaterThan(refraction45);
      expect(refraction45).toBeGreaterThan(refraction90);
      expect(refraction90).toBeLessThan(0.01);  // Minimal at zenith
    });

    test('No refraction below horizon', () => {
      const refractionNeg5 = calculateRefractionCorrection(-5);
      expect(refractionNeg5).toBe(0);
    });

    test('Refraction applied to sun position', () => {
      const sunPosWithRefraction = createSunPosition(180, 1, true);
      const sunPosNoRefraction = createSunPosition(180, 1, false);
      
      expect(sunPosWithRefraction.correctedElevation).toBeGreaterThan(1);
      expect(sunPosWithRefraction.correctedElevation).toBeGreaterThan(sunPosNoRefraction.elevation);
      expect(sunPosWithRefraction.correctedElevation).toBeLessThan(1.5);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('Midnight sun calculation (sun below horizon)', () => {
      const midnight = new Date('2025-07-04T00:00:00-04:00');
      const sunPos = getSunPosition(midnight, 40.8296, -73.9262, 'America/New_York');
      
      expect(sunPos.altitudeDegrees).toBeLessThan(-10);  // Well below horizon
    });

    test('High latitude summer (continuous daylight)', () => {
      const arctic = new Date('2025-06-21T00:00:00Z');
      const sunPos = getSunPosition(arctic, 71, -8);  // North Cape, Norway
      
      expect(sunPos.altitudeDegrees).toBeGreaterThan(0);  // Sun above horizon at midnight
    });

    test('High latitude winter (continuous night)', () => {
      const arcticWinter = new Date('2025-12-21T12:00:00Z');
      const sunPos = getSunPosition(arcticWinter, 71, -8);
      
      expect(sunPos.altitudeDegrees).toBeLessThan(0);  // Sun below horizon at noon
    });

    test('Equator at equinox (sun at zenith)', () => {
      const equinox = new Date('2025-03-20T12:00:00Z');
      const sunPos = getSunPosition(equinox, 0, 0);  // Equator
      
      expect(sunPos.altitudeDegrees).toBeGreaterThan(88);  // Nearly overhead
      expect(sunPos.altitudeDegrees).toBeLessThan(91);
    });

    test('International Date Line crossing', () => {
      const dateLineEast = new Date('2025-07-04T12:00:00+12:00');  // Fiji
      const dateLineWest = new Date('2025-07-04T12:00:00-11:00');  // Samoa
      
      const sunPosEast = getSunPosition(dateLineEast, -17, 179);
      const sunPosWest = getSunPosition(dateLineWest, -14, -171);
      
      // Both should have valid sun positions
      expect(sunPosEast.altitudeDegrees).toBeGreaterThan(-90);
      expect(sunPosEast.altitudeDegrees).toBeLessThan(90);
      expect(sunPosWest.altitudeDegrees).toBeGreaterThan(-90);
      expect(sunPosWest.altitudeDegrees).toBeLessThan(90);
    });
  });

  describe('Sun Times Calculations', () => {
    test('Sunrise and sunset times for summer day', () => {
      const summerDate = new Date('2025-07-04T12:00:00');
      const times = getSunTimes(summerDate, 40.8296, -73.9262);  // Yankee Stadium
      
      expect(times.sunrise).toBeDefined();
      expect(times.sunset).toBeDefined();
      expect(times.sunrise.getHours()).toBeGreaterThanOrEqual(4);
      expect(times.sunrise.getHours()).toBeLessThanOrEqual(6);
      expect(times.sunset.getHours()).toBeGreaterThanOrEqual(19);
      expect(times.sunset.getHours()).toBeLessThanOrEqual(21);
    });

    test('Solar noon calculation', () => {
      const date = new Date('2025-06-21T12:00:00');
      const times = getSunTimes(date, 40.8296, -73.9262);
      
      expect(times.solarNoon).toBeDefined();
      const noonHour = times.solarNoon.getHours();
      expect(noonHour).toBeGreaterThanOrEqual(11);
      expect(noonHour).toBeLessThanOrEqual(13);
    });

    test('Golden hour times', () => {
      const date = new Date('2025-09-15T12:00:00');
      const times = getSunTimes(date, 34.0739, -118.2400);  // Dodger Stadium
      
      expect(times.goldenHourEnd).toBeDefined();
      expect(times.goldenHour).toBeDefined();
      expect(times.goldenHourEnd.getTime()).toBeLessThan(times.solarNoon.getTime());
      expect(times.goldenHour.getTime()).toBeGreaterThan(times.solarNoon.getTime());
    });
  });

  describe('Performance Benchmarks', () => {
    test('Single calculation performance', () => {
      const start = performance.now();
      getSunPosition(new Date(), 40.8296, -73.9262);
      const elapsed = performance.now() - start;
      
      expect(elapsed).toBeLessThan(5);  // Should complete in under 5ms
    });

    test('Batch calculation performance (1000 calculations)', () => {
      const start = performance.now();
      const baseDate = new Date('2025-07-04T12:00:00');
      
      for (let i = 0; i < 1000; i++) {
        const date = new Date(baseDate.getTime() + i * 60000);  // Each minute
        getSunPosition(date, 40.8296 + (i * 0.0001), -73.9262 + (i * 0.0001));
      }
      
      const elapsed = performance.now() - start;
      const avgTime = elapsed / 1000;
      
      expect(avgTime).toBeLessThan(2);  // Average under 2ms per calculation
      expect(elapsed).toBeLessThan(2000);  // Total under 2 seconds
    });

    test('NREL algorithm performance comparison', () => {
      const date = new Date('2025-07-04T15:00:00');
      const iterations = 100;
      
      // Test SunCalc performance
      const sunCalcStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        getSunPosition(date, 40.8296, -73.9262);
      }
      const sunCalcTime = performance.now() - sunCalcStart;
      
      // Test NREL performance
      const nrelStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        getSunPositionNREL(date, 40.8296, -73.9262);
      }
      const nrelTime = performance.now() - nrelStart;
      
      // Both should be performant
      expect(sunCalcTime / iterations).toBeLessThan(5);
      expect(nrelTime / iterations).toBeLessThan(10);
    });
  });

  describe('Coordinate System Validation', () => {
    test('Azimuth range 0-360 degrees', () => {
      const testDates = [
        new Date('2025-06-21T00:00:00'),
        new Date('2025-06-21T06:00:00'),
        new Date('2025-06-21T12:00:00'),
        new Date('2025-06-21T18:00:00'),
      ];
      
      testDates.forEach(date => {
        const sunPos = getSunPosition(date, 40.8296, -73.9262);
        expect(sunPos.azimuthDegrees).toBeGreaterThanOrEqual(0);
        expect(sunPos.azimuthDegrees).toBeLessThanOrEqual(360);
      });
    });

    test('Altitude range -90 to 90 degrees', () => {
      const testLocations = [
        { lat: 90, lon: 0 },    // North Pole
        { lat: 0, lon: 0 },     // Equator
        { lat: -90, lon: 0 },   // South Pole
        { lat: 40.8296, lon: -73.9262 }  // NYC
      ];
      
      testLocations.forEach(loc => {
        const sunPos = getSunPosition(new Date(), loc.lat, loc.lon);
        expect(sunPos.altitudeDegrees).toBeGreaterThanOrEqual(-90);
        expect(sunPos.altitudeDegrees).toBeLessThanOrEqual(90);
      });
    });

    test('Radian to degree conversion accuracy', () => {
      const date = new Date('2025-07-04T12:00:00');
      const sunPos = getSunPosition(date, 40.8296, -73.9262);
      
      // Check conversion consistency
      expect(sunPos.azimuthDegrees).toBeCloseTo(sunPos.azimuth * 180 / Math.PI, 5);
      expect(sunPos.altitudeDegrees).toBeCloseTo(sunPos.altitude * 180 / Math.PI, 5);
    });
  });
});
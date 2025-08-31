/**
 * Comprehensive Sun Accuracy Tests
 * Validates sun position calculations against known values and edge cases
 */

import { getSunPosition } from '../utils/sunCalculations';
import { getSunPositionNREL, computeSunPosition } from '../utils/nrelSolarPosition';
import { SunCalculator } from '../utils/sunCalculator';
import { getStadiumSections } from '../data/stadiumSections';
import { MLB_STADIUMS } from '../data/stadiums';
import { getTimezoneOffset, createStadiumDate } from '../utils/stadiumTimezone';
import { createSunPosition, calculateRefractionCorrection } from '../utils/shadeCalculation3D';

// Test data: Known sun positions for specific dates/locations
const TEST_CASES = [
  {
    name: 'Summer Solstice at Yankee Stadium',
    date: new Date('2024-06-21T12:00:00-04:00'), // Noon EDT
    location: { lat: 40.8296, lon: -73.9262 },
    timezone: 'America/New_York',
    expected: {
      azimuthDegrees: { min: 175, max: 185 }, // South
      altitudeDegrees: { min: 70, max: 74 } // High sun
    }
  },
  {
    name: 'Winter Solstice at Dodger Stadium',
    date: new Date('2024-12-21T12:00:00-08:00'), // Noon PST
    location: { lat: 34.0739, lon: -118.2400 },
    timezone: 'America/Los_Angeles',
    expected: {
      azimuthDegrees: { min: 175, max: 185 }, // South
      altitudeDegrees: { min: 31, max: 35 } // Low sun
    }
  },
  {
    name: 'Sunrise at Fenway Park',
    date: new Date('2024-07-04T05:30:00-04:00'), // Around sunrise
    location: { lat: 42.3467, lon: -71.0972 },
    timezone: 'America/New_York',
    expected: {
      azimuthDegrees: { min: 55, max: 65 }, // Northeast
      altitudeDegrees: { min: -1, max: 3 } // Near horizon
    }
  },
  {
    name: 'Sunset at Oracle Park',
    date: new Date('2024-07-04T20:00:00-07:00'), // Around sunset
    location: { lat: 37.7786, lon: -122.3893 },
    timezone: 'America/Los_Angeles',
    expected: {
      azimuthDegrees: { min: 285, max: 295 }, // Northwest
      altitudeDegrees: { min: 5, max: 10 } // Low horizon
    }
  }
];

describe('Sun Position Accuracy Tests', () => {
  describe('SunCalc vs NREL Comparison', () => {
    TEST_CASES.forEach(testCase => {
      test(testCase.name, () => {
        // SunCalc calculation
        const sunCalcPos = getSunPosition(
          testCase.date,
          testCase.location.lat,
          testCase.location.lon,
          testCase.timezone
        );
        
        // NREL calculation
        const nrelPos = getSunPositionNREL(
          testCase.date,
          testCase.location.lat,
          testCase.location.lon,
          testCase.timezone
        );
        
        // Both should be within expected ranges
        expect(sunCalcPos.azimuthDegrees).toBeGreaterThanOrEqual(testCase.expected.azimuthDegrees.min);
        expect(sunCalcPos.azimuthDegrees).toBeLessThanOrEqual(testCase.expected.azimuthDegrees.max);
        expect(sunCalcPos.altitudeDegrees).toBeGreaterThanOrEqual(testCase.expected.altitudeDegrees.min);
        expect(sunCalcPos.altitudeDegrees).toBeLessThanOrEqual(testCase.expected.altitudeDegrees.max);
        
        expect(nrelPos.azimuthDegrees).toBeGreaterThanOrEqual(testCase.expected.azimuthDegrees.min);
        expect(nrelPos.azimuthDegrees).toBeLessThanOrEqual(testCase.expected.azimuthDegrees.max);
        expect(nrelPos.altitudeDegrees).toBeGreaterThanOrEqual(testCase.expected.altitudeDegrees.min);
        expect(nrelPos.altitudeDegrees).toBeLessThanOrEqual(testCase.expected.altitudeDegrees.max);
        
        // SunCalc and NREL should agree within 2 degrees
        expect(Math.abs(sunCalcPos.azimuthDegrees - nrelPos.azimuthDegrees)).toBeLessThan(2);
        expect(Math.abs(sunCalcPos.altitudeDegrees - nrelPos.altitudeDegrees)).toBeLessThan(2);
      });
    });
  });
  
  describe('Timezone Handling', () => {
    test('Correct timezone offset calculation', () => {
      const summerDate = new Date('2024-07-01T12:00:00');
      const winterDate = new Date('2024-01-01T12:00:00');
      
      // Eastern Time (EDT in summer, EST in winter)
      const edtOffset = getTimezoneOffset(summerDate, 'America/New_York');
      const estOffset = getTimezoneOffset(winterDate, 'America/New_York');
      expect(edtOffset).toBe(-4);
      expect(estOffset).toBe(-5);
      
      // Pacific Time (PDT in summer, PST in winter)
      const pdtOffset = getTimezoneOffset(summerDate, 'America/Los_Angeles');
      const pstOffset = getTimezoneOffset(winterDate, 'America/Los_Angeles');
      expect(pdtOffset).toBe(-7);
      expect(pstOffset).toBe(-8);
      
      // Arizona (no DST)
      const azSummer = getTimezoneOffset(summerDate, 'America/Phoenix');
      const azWinter = getTimezoneOffset(winterDate, 'America/Phoenix');
      expect(azSummer).toBe(-7);
      expect(azWinter).toBe(-7);
    });
    
    test('Stadium date creation with timezone', () => {
      const localDateStr = '2024-07-04 15:00:00';
      const yankeeDate = createStadiumDate(localDateStr, 'America/New_York');
      const dodgerDate = createStadiumDate(localDateStr, 'America/Los_Angeles');
      
      // 3 PM in New York and 3 PM in LA are different UTC times
      const timeDiff = Math.abs(yankeeDate.getTime() - dodgerDate.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      expect(hoursDiff).toBe(3); // 3 hour difference between ET and PT
    });
  });
  
  describe('Atmospheric Refraction', () => {
    test('Refraction correction for low elevation angles', () => {
      // Near horizon, refraction is strongest
      const refraction0 = calculateRefractionCorrection(0);
      expect(refraction0).toBeGreaterThan(0.5); // About 0.57 degrees
      expect(refraction0).toBeLessThan(0.6);
      
      // At 5 degrees, still significant
      const refraction5 = calculateRefractionCorrection(5);
      expect(refraction5).toBeGreaterThan(0.15);
      expect(refraction5).toBeLessThan(0.2);
      
      // At 45 degrees, minimal
      const refraction45 = calculateRefractionCorrection(45);
      expect(refraction45).toBeLessThan(0.02);
      
      // Below visible horizon, no refraction
      const refractionNeg = calculateRefractionCorrection(-1);
      expect(refractionNeg).toBe(0);
    });
    
    test('Sun position with refraction applied', () => {
      const sunPosWithRefraction = createSunPosition(180, 0.5, true);
      const sunPosNoRefraction = createSunPosition(180, 0.5, false);
      
      expect(sunPosWithRefraction.correctedElevation).toBeGreaterThan(sunPosNoRefraction.elevation);
      expect(sunPosWithRefraction.correctedElevation).toBeGreaterThan(1.0); // Original 0.5 + refraction
    });
  });
  
  describe('Covered Section Calculations', () => {
    test('Covered sections always return 100% shade', () => {
      const yankees = MLB_STADIUMS.find(s => s.id === 'yankees')!;
      const calculator = new SunCalculator(yankees);
      const sections = getStadiumSections('yankees');
      
      // Find covered sections
      const coveredSections = sections.filter(s => s.covered === true);
      expect(coveredSections.length).toBeGreaterThan(0);
      
      // Test at various sun positions
      const testDates = [
        '2024-06-21', // Summer solstice
        '2024-12-21', // Winter solstice
        '2024-03-20', // Spring equinox
        '2024-09-23'  // Fall equinox
      ];
      
      const testTimes = ['09:00:00', '12:00:00', '15:00:00', '18:00:00'];
      
      testDates.forEach(date => {
        testTimes.forEach(time => {
          const sunPos = calculator.calculateSunPosition(date, time);
          const shadows = calculator.calculateShadows(sunPos, coveredSections as any);
          
          shadows.forEach(shadow => {
            expect(shadow.sunExposure).toBe(0);
            expect(shadow.coverage).toBe(100);
            expect(shadow.shadowSources.roof).toBe(100);
          });
        });
      });
    });
  });
  
  describe('Section Angle Calculations', () => {
    test('Sections facing away from sun are shaded', () => {
      const stadium = MLB_STADIUMS.find(s => s.id === 'yankees')!;
      const sections = getStadiumSections('yankees');
      
      // Sun from south (azimuth 180)
      const southSun = getSunPosition(
        new Date('2024-06-21T12:00:00'),
        stadium.latitude,
        stadium.longitude
      );
      
      // Sections facing north should be shaded
      const northFacingSections = sections.filter(s => 
        s.baseAngle > 315 || s.baseAngle < 45
      );
      
      // Using the logic from calculateSunnySections
      const relativeSunAngle = (southSun.azimuthDegrees - stadium.orientation + 360) % 360;
      
      northFacingSections.forEach(section => {
        const sectionMidAngle = section.baseAngle + section.angleSpan / 2;
        const angleDiff = Math.abs(relativeSunAngle - sectionMidAngle);
        const normalizedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff;
        
        // North-facing sections should be more than 90 degrees from south sun
        expect(normalizedDiff).toBeGreaterThan(90);
      });
    });
  });
  
  describe('Edge Cases', () => {
    test('Midnight sun calculation (no sun)', () => {
      const midnight = new Date('2024-07-04T00:00:00');
      const sunPos = getSunPosition(midnight, 40.8296, -73.9262);
      
      expect(sunPos.altitudeDegrees).toBeLessThan(0); // Sun below horizon
    });
    
    test('Polar regions handling', () => {
      // Arctic Circle in summer - continuous daylight
      const arcticSummer = new Date('2024-06-21T00:00:00');
      const arcticPos = getSunPosition(arcticSummer, 70, -150); // Alaska
      
      // Antarctic in winter - continuous night
      const antarcticWinter = new Date('2024-06-21T12:00:00');
      const antarcticPos = getSunPosition(antarcticWinter, -70, 0);
      
      expect(antarcticPos.altitudeDegrees).toBeLessThan(0);
    });
    
    test('Equator at equinox', () => {
      const equinox = new Date('2024-03-20T12:00:00');
      const equatorPos = getSunPosition(equinox, 0, 0);
      
      // Sun should be nearly overhead at equator during equinox
      expect(equatorPos.altitudeDegrees).toBeGreaterThan(85);
      expect(equatorPos.azimuthDegrees).toBeGreaterThan(170);
      expect(equatorPos.azimuthDegrees).toBeLessThan(190);
    });
  });
  
  describe('Performance Tests', () => {
    test('Batch calculation performance', () => {
      const startTime = Date.now();
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        getSunPosition(
          new Date(),
          40.8296 + (i * 0.001),
          -73.9262 + (i * 0.001)
        );
      }
      
      const elapsed = Date.now() - startTime;
      const avgTime = elapsed / iterations;
      
      // Should average less than 1ms per calculation
      expect(avgTime).toBeLessThan(1);
    });
  });
});

// Export for use in other tests
export { TEST_CASES };
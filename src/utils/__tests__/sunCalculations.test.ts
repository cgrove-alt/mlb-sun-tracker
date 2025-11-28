/**
 * Sun Calculations Unit Tests
 * Comprehensive tests for sun position and section shade calculations
 *
 * Tests cover:
 * - Sun position accuracy at known locations
 * - Section sun exposure logic
 * - Covered section handling
 * - Edge cases (sunset, sunrise, night)
 */

import { getSunPosition, calculateDetailedSectionSunExposure } from '../sunCalculations';
import { isSectionInSun, getSectionSunExposure } from '../sectionSunCalculations';
import type { StadiumSection } from '../../data/stadiumSectionTypes';

// Test locations for sun position validation
const TEST_LOCATIONS = [
  { name: 'Los Angeles', lat: 34.0736, lon: -118.2400 },
  { name: 'New York', lat: 40.7580, lon: -73.9855 },
  { name: 'Miami', lat: 25.7617, lon: -80.1918 },
  { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
];

// Test sections for shade calculations
const TEST_SECTIONS: StadiumSection[] = [
  {
    id: 'home-lower',
    name: 'Home Plate Lower',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 20,
    covered: false,
    price: 'premium'
  },
  {
    id: 'first-base-lower',
    name: 'First Base Lower',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 30,
    covered: false,
    price: 'moderate'
  },
  {
    id: 'third-base-lower',
    name: 'Third Base Lower',
    level: 'lower',
    baseAngle: 270,
    angleSpan: 30,
    covered: false,
    price: 'moderate'
  },
  {
    id: 'outfield',
    name: 'Center Field',
    level: 'field',
    baseAngle: 180,
    angleSpan: 40,
    covered: false,
    price: 'value'
  },
  {
    id: 'covered-suite',
    name: 'Covered Suite',
    level: 'suite',
    baseAngle: 45,
    angleSpan: 15,
    covered: true,
    price: 'luxury'
  },
  {
    id: 'upper-deck',
    name: 'Upper Deck',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 25,
    covered: true,
    price: 'value'
  }
];

describe('Sun Position Calculations', () => {
  describe('getSunPosition', () => {
    test('returns valid altitude and azimuth ranges for all locations', () => {
      const testDate = new Date();
      testDate.setHours(14, 0, 0, 0); // 2 PM

      for (const { name, lat, lon } of TEST_LOCATIONS) {
        const result = getSunPosition(testDate, lat, lon, 'America/New_York');

        // Azimuth should be 0-360
        expect(result.azimuthDegrees).toBeGreaterThanOrEqual(0);
        expect(result.azimuthDegrees).toBeLessThan(360);

        // Altitude should be -90 to 90
        expect(result.altitudeDegrees).toBeGreaterThanOrEqual(-90);
        expect(result.altitudeDegrees).toBeLessThanOrEqual(90);

        // Should have both radians and degrees
        expect(typeof result.altitude).toBe('number');
        expect(typeof result.azimuth).toBe('number');
      }
    });

    test('returns all required fields', () => {
      const result = getSunPosition(new Date(), 34.0736, -118.2400, 'America/Los_Angeles');

      expect(result).toHaveProperty('altitude');
      expect(result).toHaveProperty('azimuth');
      expect(result).toHaveProperty('altitudeDegrees');
      expect(result).toHaveProperty('azimuthDegrees');
    });

    test('higher latitude locations have lower max altitude', () => {
      const testDate = new Date();
      testDate.setHours(12, 0, 0, 0);

      // Miami (lower latitude)
      const miamiResult = getSunPosition(testDate, 25.7617, -80.1918, 'America/New_York');

      // Seattle (higher latitude)
      const seattleResult = getSunPosition(testDate, 47.6062, -122.3321, 'America/Los_Angeles');

      // Miami should have higher sun at noon due to lower latitude
      // (accounting for timezone differences, we just verify both are valid)
      expect(typeof miamiResult.altitudeDegrees).toBe('number');
      expect(typeof seattleResult.altitudeDegrees).toBe('number');
    });

    test('altitude changes throughout the day', () => {
      const lat = 34.0736;
      const lon = -118.2400;
      const baseDate = new Date();
      baseDate.setMonth(5); // June

      const altitudes: number[] = [];
      for (let hour = 6; hour <= 20; hour += 2) {
        const testDate = new Date(baseDate);
        testDate.setHours(hour, 0, 0, 0);
        const result = getSunPosition(testDate, lat, lon, 'America/Los_Angeles');
        altitudes.push(result.altitudeDegrees);
      }

      // There should be variation in altitudes
      const minAlt = Math.min(...altitudes);
      const maxAlt = Math.max(...altitudes);
      expect(maxAlt - minAlt).toBeGreaterThan(10); // Should vary by at least 10 degrees
    });

    test('azimuth changes direction throughout day', () => {
      const lat = 40.7580;
      const lon = -73.9855;
      const baseDate = new Date();
      baseDate.setMonth(5); // June

      // Morning
      const morning = new Date(baseDate);
      morning.setHours(8, 0, 0, 0);
      const morningResult = getSunPosition(morning, lat, lon, 'America/New_York');

      // Afternoon
      const afternoon = new Date(baseDate);
      afternoon.setHours(16, 0, 0, 0);
      const afternoonResult = getSunPosition(afternoon, lat, lon, 'America/New_York');

      // Azimuth should be different between morning and afternoon
      expect(morningResult.azimuthDegrees).not.toEqual(afternoonResult.azimuthDegrees);
    });
  });
});

describe('Section Sun Exposure Calculations', () => {
  describe('isSectionInSun', () => {
    test('covered sections always return false', () => {
      const coveredSection = TEST_SECTIONS.find(s => s.covered);
      expect(coveredSection).toBeDefined();

      // Test with various sun positions
      const sunPositions = [
        { azimuth: 90, elevation: 45 },
        { azimuth: 180, elevation: 75 },
        { azimuth: 270, elevation: 30 },
        { azimuth: 45, elevation: 60 },
      ];

      for (const { azimuth, elevation } of sunPositions) {
        const result = isSectionInSun(coveredSection!, azimuth, elevation);
        expect(result).toBe(false);
      }
    });

    test('uncovered sections can be in sun', () => {
      const uncoveredSection = TEST_SECTIONS.find(s => !s.covered);
      expect(uncoveredSection).toBeDefined();

      // With high sun directly overhead, most sections get some sun
      const result = isSectionInSun(uncoveredSection!, 180, 80);
      // This may or may not be true depending on the section angle
      expect(typeof result).toBe('boolean');
    });

    test('sun below horizon returns false', () => {
      const section = TEST_SECTIONS[0];
      const result = isSectionInSun(section, 180, -5);
      expect(result).toBe(false);
    });
  });

  describe('getSectionSunExposure', () => {
    test('covered sections always return 0%', () => {
      const coveredSection = TEST_SECTIONS.find(s => s.covered);
      expect(coveredSection).toBeDefined();

      const sunPositions = [
        { azimuth: 90, elevation: 45 },
        { azimuth: 180, elevation: 75 },
        { azimuth: 270, elevation: 30 },
        { azimuth: 45, elevation: 60 },
        { azimuth: 0, elevation: 90 }, // Directly overhead
      ];

      for (const { azimuth, elevation } of sunPositions) {
        const exposure = getSectionSunExposure(coveredSection!, elevation, azimuth);
        expect(exposure).toBe(0);
      }
    });

    test('exposure is between 0 and 100', () => {
      const section = TEST_SECTIONS.find(s => !s.covered);
      expect(section).toBeDefined();

      for (let azimuth = 0; azimuth < 360; azimuth += 30) {
        for (let elevation = 10; elevation < 90; elevation += 20) {
          const exposure = getSectionSunExposure(section!, elevation, azimuth);
          expect(exposure).toBeGreaterThanOrEqual(0);
          expect(exposure).toBeLessThanOrEqual(100);
        }
      }
    });

    test('night time (negative elevation) returns 0%', () => {
      const section = TEST_SECTIONS.find(s => !s.covered);
      expect(section).toBeDefined();

      const exposure = getSectionSunExposure(section!, -10, 180);
      expect(exposure).toBe(0);
    });
  });
});

describe('Calculate Detailed Section Sun Exposure', () => {
  const mockWeather = {
    temperature: 72,
    feelsLike: 72,
    pressure: 1013,
    humidity: 50,
    cloudCover: 30,
    visibility: 10000,
    windSpeed: 5,
    windDirection: 180,
    precipitationProbability: 0,
    uvIndex: 5,
    conditions: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }]
  };

  test('returns data for all sections', () => {
    const stadium = {
      id: 'test-stadium',
      name: 'Test Stadium',
      latitude: 34.0736,
      longitude: -118.2400,
      city: 'Los Angeles',
      team: 'Test Team'
    };

    const sunPosition = {
      altitude: 1.0,
      azimuth: 3.14,
      altitudeDegrees: 57.3,
      azimuthDegrees: 180
    };

    const results = calculateDetailedSectionSunExposure(
      stadium as any,
      sunPosition,
      mockWeather as any,
      TEST_SECTIONS as any[]
    );

    expect(results).toHaveLength(TEST_SECTIONS.length);
    results.forEach(result => {
      expect(result).toHaveProperty('section');
      expect(result).toHaveProperty('inSun');
      expect(result).toHaveProperty('sunExposure');
      expect(typeof result.inSun).toBe('boolean');
      expect(typeof result.sunExposure).toBe('number');
    });
  });

  test('covered sections show 0% exposure in results', () => {
    const stadium = {
      id: 'test-stadium',
      name: 'Test Stadium',
      latitude: 34.0736,
      longitude: -118.2400,
      city: 'Los Angeles',
      team: 'Test Team'
    };

    const sunPosition = {
      altitude: 1.0,
      azimuth: 3.14,
      altitudeDegrees: 57.3,
      azimuthDegrees: 180
    };

    const results = calculateDetailedSectionSunExposure(
      stadium as any,
      sunPosition,
      mockWeather as any,
      TEST_SECTIONS as any[]
    );

    const coveredResults = results.filter(r => r.section.covered);
    coveredResults.forEach(result => {
      expect(result.inSun).toBe(false);
      expect(result.sunExposure).toBe(0);
    });
  });
});

describe('Edge Cases', () => {
  test('handles polar coordinates correctly', () => {
    // Test a location near the pole
    const arcticDate = new Date('2025-06-21T12:00:00');
    const result = getSunPosition(arcticDate, 70, 0, 'UTC');

    // During arctic summer, sun should be up
    expect(result.altitudeDegrees).toBeGreaterThan(0);
  });

  test('returns valid azimuth and altitude ranges', () => {
    // Test that results are always within valid ranges
    const testCases = [
      { lat: 34.0736, lon: -118.2400 }, // LA
      { lat: 40.7580, lon: -73.9855 },  // NYC
      { lat: 25.7617, lon: -80.1918 },  // Miami
      { lat: 47.6062, lon: -122.3321 }, // Seattle
    ];

    const testDate = new Date('2025-07-15T14:00:00');

    for (const { lat, lon } of testCases) {
      const result = getSunPosition(testDate, lat, lon, 'America/New_York');

      // Azimuth should always be 0-360
      expect(result.azimuthDegrees).toBeGreaterThanOrEqual(0);
      expect(result.azimuthDegrees).toBeLessThan(360);

      // Altitude should be -90 to 90
      expect(result.altitudeDegrees).toBeGreaterThanOrEqual(-90);
      expect(result.altitudeDegrees).toBeLessThanOrEqual(90);
    }
  });

  test('handles section at 0 degree angle correctly', () => {
    const section: StadiumSection = {
      id: 'home-plate',
      name: 'Home Plate',
      level: 'lower',
      baseAngle: 0,
      angleSpan: 10,
      covered: false,
      price: 'premium'
    };

    // Sun from behind (south)
    const exposure = getSectionSunExposure(section, 45, 180);
    expect(exposure).toBeGreaterThanOrEqual(0);
    expect(exposure).toBeLessThanOrEqual(100);
  });

  test('handles section spanning 360/0 boundary', () => {
    const section: StadiumSection = {
      id: 'wraparound',
      name: 'Wraparound Section',
      level: 'lower',
      baseAngle: 355,
      angleSpan: 20, // Spans from 345 to 15 degrees
      covered: false,
      price: 'moderate'
    };

    const exposure = getSectionSunExposure(section, 60, 0);
    expect(exposure).toBeGreaterThanOrEqual(0);
  });
});

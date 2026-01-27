/**
 * Comprehensive Test Suite for Sun Calculations
 * Tests core solar position and shade calculation algorithms
 */

import {
  getSunPosition,
  calculateSunExposure,
  getSunriseSunsetTimes,
  getGameDaylight,
  calculateHourlyShadePercentage,
} from '../sunCalculations';

describe('Sun Calculations', () => {
  describe('getSunPosition', () => {
    it('should calculate sun position for noon at equator', () => {
      const date = new Date('2025-03-20T12:00:00Z'); // Equinox
      const latitude = 0;
      const longitude = 0;

      const position = getSunPosition(date, latitude, longitude);

      expect(position).toHaveProperty('azimuth');
      expect(position).toHaveProperty('altitude');
      expect(position.altitude).toBeGreaterThan(0); // Sun should be above horizon
      expect(position.altitude).toBeLessThanOrEqual(90);
    });

    it('should calculate sun position for summer solstice at New York', () => {
      const date = new Date('2025-06-21T16:00:00Z'); // Noon EDT
      const latitude = 40.7128; // NYC
      const longitude = -74.0060;

      const position = getSunPosition(date, latitude, longitude);

      expect(position.altitude).toBeGreaterThan(60); // High sun in summer
      expect(position.azimuth).toBeGreaterThanOrEqual(0);
      expect(position.azimuth).toBeLessThan(360);
    });

    it('should calculate sun position for winter solstice at New York', () => {
      const date = new Date('2025-12-21T17:00:00Z'); // Noon EST
      const latitude = 40.7128;
      const longitude = -74.0060;

      const position = getSunPosition(date, latitude, longitude);

      expect(position.altitude).toBeLessThan(35); // Low sun in winter
      expect(position.altitude).toBeGreaterThan(0);
    });

    it('should handle negative sun altitude (night time)', () => {
      const date = new Date('2025-06-21T04:00:00Z'); // 12 AM EDT
      const latitude = 40.7128;
      const longitude = -74.0060;

      const position = getSunPosition(date, latitude, longitude);

      expect(position.altitude).toBeLessThan(0); // Below horizon
    });

    it('should calculate consistent positions for same local time across timezones', () => {
      const date1 = new Date('2025-06-21T16:00:00Z'); // Noon EDT (NYC)
      const date2 = new Date('2025-06-21T19:00:00Z'); // Noon PDT (LA)

      const pos1 = getSunPosition(date1, 40.7128, -74.0060);
      const pos2 = getSunPosition(date2, 34.0522, -118.2437);

      // Both should have similar high altitude (near solar noon)
      expect(Math.abs(pos1.altitude - pos2.altitude)).toBeLessThan(10);
    });
  });

  describe('getSunriseSunsetTimes', () => {
    it('should calculate sunrise and sunset for New York in summer', () => {
      const date = new Date('2025-06-21');
      const latitude = 40.7128;
      const longitude = -74.0060;

      const times = getSunriseSunsetTimes(date, latitude, longitude);

      expect(times).toHaveProperty('sunrise');
      expect(times).toHaveProperty('sunset');
      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.sunset).toBeInstanceOf(Date);
      expect(times.sunset.getTime()).toBeGreaterThan(times.sunrise.getTime());

      // Summer solstice should have ~15 hours of daylight
      const daylightHours = (times.sunset.getTime() - times.sunrise.getTime()) / (1000 * 60 * 60);
      expect(daylightHours).toBeGreaterThan(14);
      expect(daylightHours).toBeLessThan(16);
    });

    it('should calculate sunrise and sunset for New York in winter', () => {
      const date = new Date('2025-12-21');
      const latitude = 40.7128;
      const longitude = -74.0060;

      const times = getSunriseSunsetTimes(date, latitude, longitude);

      // Winter solstice should have ~9 hours of daylight
      const daylightHours = (times.sunset.getTime() - times.sunrise.getTime()) / (1000 * 60 * 60);
      expect(daylightHours).toBeGreaterThan(8);
      expect(daylightHours).toBeLessThan(10);
    });

    it('should calculate sunrise and sunset for Los Angeles', () => {
      const date = new Date('2025-06-21');
      const latitude = 34.0522;
      const longitude = -118.2437;

      const times = getSunriseSunsetTimes(date, latitude, longitude);

      expect(times.sunrise).toBeInstanceOf(Date);
      expect(times.sunset).toBeInstanceOf(Date);
      expect(times.sunset.getTime()).toBeGreaterThan(times.sunrise.getTime());
    });
  });

  describe('getGameDaylight', () => {
    it('should return correct daylight status for day game', () => {
      const gameTime = new Date('2025-06-21T17:00:00Z'); // 1 PM EDT
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3; // hours

      const daylight = getGameDaylight(gameTime, latitude, longitude, gameDuration);

      expect(daylight).toHaveProperty('isDayGame');
      expect(daylight).toHaveProperty('isNightGame');
      expect(daylight).toHaveProperty('isTwilightGame');
      expect(daylight.isDayGame).toBe(true);
      expect(daylight.isNightGame).toBe(false);
    });

    it('should return correct daylight status for night game', () => {
      const gameTime = new Date('2025-06-21T00:00:00Z'); // 8 PM EDT
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const daylight = getGameDaylight(gameTime, latitude, longitude, gameDuration);

      expect(daylight.isDayGame).toBe(false);
      expect(daylight.isNightGame).toBe(true);
    });

    it('should return correct daylight status for twilight game', () => {
      const gameTime = new Date('2025-06-21T22:00:00Z'); // 6 PM EDT
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const daylight = getGameDaylight(gameTime, latitude, longitude, gameDuration);

      expect(daylight.isTwilightGame).toBe(true);
    });
  });

  describe('calculateSunExposure', () => {
    it('should calculate high exposure for south-facing section at noon in summer', () => {
      const gameTime = new Date('2025-06-21T16:00:00Z'); // Noon EDT
      const sectionOrientation = 180; // Facing south
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const exposure = calculateSunExposure(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      expect(exposure).toHaveProperty('averageExposure');
      expect(exposure).toHaveProperty('peakExposure');
      expect(exposure).toHaveProperty('hoursInDirectSun');
      expect(exposure.averageExposure).toBeGreaterThan(70); // High exposure
    });

    it('should calculate low exposure for north-facing section at noon in summer', () => {
      const gameTime = new Date('2025-06-21T16:00:00Z'); // Noon EDT
      const sectionOrientation = 0; // Facing north
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const exposure = calculateSunExposure(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      expect(exposure.averageExposure).toBeLessThan(40); // Lower exposure
    });

    it('should calculate zero exposure for night game', () => {
      const gameTime = new Date('2025-06-21T00:00:00Z'); // 8 PM EDT
      const sectionOrientation = 180;
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const exposure = calculateSunExposure(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      expect(exposure.averageExposure).toBeLessThan(10); // Minimal/no exposure
    });
  });

  describe('calculateHourlyShadePercentage', () => {
    it('should return array of hourly percentages', () => {
      const gameTime = new Date('2025-06-21T17:00:00Z'); // 1 PM EDT
      const sectionOrientation = 180;
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const hourlyShade = calculateHourlyShadePercentage(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      expect(Array.isArray(hourlyShade)).toBe(true);
      expect(hourlyShade.length).toBe(gameDuration);
      hourlyShade.forEach((shade) => {
        expect(shade).toBeGreaterThanOrEqual(0);
        expect(shade).toBeLessThanOrEqual(100);
      });
    });

    it('should show increasing shade as sun moves west', () => {
      const gameTime = new Date('2025-06-21T17:00:00Z');
      const sectionOrientation = 90; // Facing east
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 4;

      const hourlyShade = calculateHourlyShadePercentage(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      // East-facing sections should get shadier as afternoon progresses
      expect(hourlyShade[gameDuration - 1]).toBeGreaterThanOrEqual(hourlyShade[0]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle polar regions gracefully', () => {
      const date = new Date('2025-06-21T12:00:00Z');
      const latitude = 85; // Near North Pole
      const longitude = 0;

      const position = getSunPosition(date, latitude, longitude);

      expect(position).toHaveProperty('azimuth');
      expect(position).toHaveProperty('altitude');
      expect(typeof position.azimuth).toBe('number');
      expect(typeof position.altitude).toBe('number');
    });

    it('should handle date near year boundaries', () => {
      const newYear = new Date('2025-01-01T12:00:00Z');
      const latitude = 40.7128;
      const longitude = -74.0060;

      const position = getSunPosition(newYear, latitude, longitude);

      expect(position.altitude).toBeGreaterThan(-90);
      expect(position.altitude).toBeLessThan(90);
    });

    it('should handle very short game durations', () => {
      const gameTime = new Date('2025-06-21T17:00:00Z');
      const sectionOrientation = 180;
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 0.5; // 30 minutes

      const exposure = calculateSunExposure(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      expect(exposure.averageExposure).toBeGreaterThanOrEqual(0);
      expect(exposure.averageExposure).toBeLessThanOrEqual(100);
    });

    it('should handle very long game durations', () => {
      const gameTime = new Date('2025-06-21T17:00:00Z');
      const sectionOrientation = 180;
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 8; // 8 hours (extra innings marathon)

      const exposure = calculateSunExposure(
        gameTime,
        sectionOrientation,
        latitude,
        longitude,
        gameDuration
      );

      expect(exposure.averageExposure).toBeGreaterThanOrEqual(0);
      expect(exposure.averageExposure).toBeLessThanOrEqual(100);
    });
  });

  describe('Performance', () => {
    it('should calculate sun position quickly', () => {
      const date = new Date('2025-06-21T16:00:00Z');
      const latitude = 40.7128;
      const longitude = -74.0060;

      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        getSunPosition(date, latitude, longitude);
      }
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // 1000 calculations in < 1 second
    });

    it('should calculate exposure for multiple sections quickly', () => {
      const gameTime = new Date('2025-06-21T17:00:00Z');
      const latitude = 40.7128;
      const longitude = -74.0060;
      const gameDuration = 3;

      const start = Date.now();
      for (let orientation = 0; orientation < 360; orientation += 10) {
        calculateSunExposure(gameTime, orientation, latitude, longitude, gameDuration);
      }
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(2000); // 36 sections in < 2 seconds
    });
  });
});

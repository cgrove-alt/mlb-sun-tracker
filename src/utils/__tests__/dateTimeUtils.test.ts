/**
 * Test Suite for Date/Time Utilities
 */

import {
  formatGameTime,
  getLocalTimeZone,
  convertToLocalTime,
  isToday,
  isFutureDate,
  getTimezoneOffset,
  formatDuration,
} from '../dateTimeUtils';

describe('Date/Time Utilities', () => {
  describe('formatGameTime', () => {
    it('should format time in 12-hour format', () => {
      const date = new Date('2025-06-21T19:05:00Z');
      const formatted = formatGameTime(date, 'America/New_York');

      expect(formatted).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
    });

    it('should handle different timezones', () => {
      const date = new Date('2025-06-21T19:05:00Z'); // 7:05 PM UTC

      const ny = formatGameTime(date, 'America/New_York'); // 3:05 PM EDT
      const la = formatGameTime(date, 'America/Los_Angeles'); // 12:05 PM PDT

      expect(ny).toContain('PM');
      expect(la).toContain('PM');
      expect(ny).not.toBe(la);
    });

    it('should handle midnight', () => {
      const date = new Date('2025-06-21T04:00:00Z'); // Midnight EDT

      const formatted = formatGameTime(date, 'America/New_York');

      expect(formatted).toContain('12:00 AM');
    });

    it('should handle noon', () => {
      const date = new Date('2025-06-21T16:00:00Z'); // Noon EDT

      const formatted = formatGameTime(date, 'America/New_York');

      expect(formatted).toContain('12:00 PM');
    });
  });

  describe('getLocalTimeZone', () => {
    it('should return a valid timezone', () => {
      const tz = getLocalTimeZone();

      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });

    it('should return IANA timezone format', () => {
      const tz = getLocalTimeZone();

      // Should be something like "America/New_York"
      expect(tz).toMatch(/^[A-Z][a-z]+\/[A-Z][a-z_]+$/);
    });
  });

  describe('convertToLocalTime', () => {
    it('should convert UTC to local timezone', () => {
      const utcDate = new Date('2025-06-21T19:05:00Z');

      const localDate = convertToLocalTime(utcDate, 'America/New_York');

      expect(localDate).toBeInstanceOf(Date);
      expect(localDate.getTime()).not.toBe(utcDate.getTime()); // Should be different unless in UTC
    });

    it('should preserve the moment in time', () => {
      const utcDate = new Date('2025-06-21T19:05:00Z');

      const localDate = convertToLocalTime(utcDate, 'America/Los_Angeles');

      // The timestamp should be the same, just displayed differently
      expect(localDate.toISOString()).toBe(utcDate.toISOString());
    });
  });

  describe('isToday', () => {
    it('should return true for current date', () => {
      const today = new Date();

      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(isToday(tomorrow)).toBe(false);
    });

    it('should handle different timezones for "today"', () => {
      const now = new Date();

      // Test for New York timezone
      const isTodayNY = isToday(now, 'America/New_York');

      expect(typeof isTodayNY).toBe('boolean');
    });
  });

  describe('isFutureDate', () => {
    it('should return true for future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      expect(isFutureDate(future)).toBe(true);
    });

    it('should return false for past dates', () => {
      const past = new Date();
      past.setDate(past.getDate() - 7);

      expect(isFutureDate(past)).toBe(false);
    });

    it('should return false for current moment', () => {
      const now = new Date();

      expect(isFutureDate(now)).toBe(false);
    });
  });

  describe('getTimezoneOffset', () => {
    it('should return offset for known timezones', () => {
      const offset = getTimezoneOffset('America/New_York', new Date('2025-06-21'));

      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThan(-24);
      expect(offset).toBeLessThan(24);
    });

    it('should handle daylight saving time transitions', () => {
      const summer = new Date('2025-06-21');
      const winter = new Date('2025-12-21');

      const summerOffset = getTimezoneOffset('America/New_York', summer);
      const winterOffset = getTimezoneOffset('America/New_York', winter);

      // EDT is -4, EST is -5
      expect(summerOffset).not.toBe(winterOffset);
    });

    it('should handle timezones without DST', () => {
      const date = new Date('2025-06-21');

      const offset = getTimezoneOffset('America/Phoenix', date);

      expect(typeof offset).toBe('number');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      const duration = formatDuration(45);

      expect(duration).toBe('45m');
    });

    it('should format hours and minutes correctly', () => {
      const duration = formatDuration(125); // 2h 5m

      expect(duration).toMatch(/2h\s*5m/);
    });

    it('should format exact hours', () => {
      const duration = formatDuration(120); // 2h

      expect(duration).toContain('2h');
    });

    it('should handle zero duration', () => {
      const duration = formatDuration(0);

      expect(duration).toBe('0m');
    });

    it('should handle very long durations', () => {
      const duration = formatDuration(600); // 10h

      expect(duration).toContain('10h');
    });
  });

  describe('edge cases', () => {
    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');

      expect(() => formatGameTime(invalidDate, 'America/New_York')).not.toThrow();
    });

    it('should handle invalid timezone gracefully', () => {
      const date = new Date('2025-06-21T19:05:00Z');

      expect(() => formatGameTime(date, 'Invalid/Timezone')).not.toThrow();
    });

    it('should handle year boundaries', () => {
      const newYear = new Date('2025-01-01T00:00:00Z');
      const newYearsEve = new Date('2024-12-31T23:59:59Z');

      expect(isFutureDate(newYear)).toBeDefined();
      expect(isFutureDate(newYearsEve)).toBeDefined();
    });

    it('should handle leap year dates', () => {
      const leapDay = new Date('2024-02-29T12:00:00Z');

      const formatted = formatGameTime(leapDay, 'America/New_York');

      expect(formatted).toBeTruthy();
    });

    it('should handle dates far in the future', () => {
      const farFuture = new Date('2050-06-21T19:05:00Z');

      expect(isFutureDate(farFuture)).toBe(true);
    });

    it('should handle dates far in the past', () => {
      const farPast = new Date('1900-01-01T00:00:00Z');

      expect(isFutureDate(farPast)).toBe(false);
    });
  });
});

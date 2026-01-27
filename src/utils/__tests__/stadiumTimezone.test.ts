/**
 * Test Suite for Stadium Timezone Utilities
 */

import {
  getStadiumTimezone,
  convertGameTimeToStadiumLocal,
  formatStadiumTime,
  getStadiumOffset,
} from '../stadiumTimezone';

describe('Stadium Timezone Utilities', () => {
  describe('getStadiumTimezone', () => {
    it('should return correct timezone for Yankee Stadium', () => {
      const tz = getStadiumTimezone('yankees');

      expect(tz).toBe('America/New_York');
    });

    it('should return correct timezone for Dodger Stadium', () => {
      const tz = getStadiumTimezone('dodgers');

      expect(tz).toBe('America/Los_Angeles');
    });

    it('should return correct timezone for Cubs (Wrigley Field)', () => {
      const tz = getStadiumTimezone('cubs');

      expect(tz).toBe('America/Chicago');
    });

    it('should return correct timezone for Rockies (Coors Field)', () => {
      const tz = getStadiumTimezone('rockies');

      expect(tz).toBe('America/Denver');
    });

    it('should return correct timezone for Diamondbacks (Phoenix)', () => {
      const tz = getStadiumTimezone('diamondbacks');

      expect(tz).toBe('America/Phoenix');
    });

    it('should return default timezone for unknown stadium', () => {
      const tz = getStadiumTimezone('unknown-stadium');

      expect(tz).toBeTruthy();
      expect(typeof tz).toBe('string');
    });

    it('should handle case-insensitive stadium IDs', () => {
      const tz1 = getStadiumTimezone('yankees');
      const tz2 = getStadiumTimezone('YANKEES');
      const tz3 = getStadiumTimezone('Yankees');

      expect(tz1).toBe(tz2);
      expect(tz2).toBe(tz3);
    });
  });

  describe('convertGameTimeToStadiumLocal', () => {
    it('should convert UTC to stadium local time', () => {
      const utcTime = new Date('2025-06-21T23:05:00Z'); // 11:05 PM UTC

      const localTime = convertGameTimeToStadiumLocal(utcTime, 'yankees');

      expect(localTime).toBeInstanceOf(Date);
      expect(localTime.getHours()).not.toBe(23); // Should be different in EDT
    });

    it('should handle different stadiums correctly', () => {
      const utcTime = new Date('2025-06-21T23:05:00Z');

      const nyTime = convertGameTimeToStadiumLocal(utcTime, 'yankees');
      const laTime = convertGameTimeToStadiumLocal(utcTime, 'dodgers');

      // LA is 3 hours behind NY
      expect(nyTime.getHours()).not.toBe(laTime.getHours());
    });

    it('should preserve the moment in time', () => {
      const utcTime = new Date('2025-06-21T19:05:00Z');

      const localTime = convertGameTimeToStadiumLocal(utcTime, 'yankees');

      // Timestamps should be equal
      expect(localTime.getTime()).toBe(utcTime.getTime());
    });
  });

  describe('formatStadiumTime', () => {
    it('should format time in stadium local timezone', () => {
      const date = new Date('2025-06-21T23:05:00Z'); // 11:05 PM UTC, 7:05 PM EDT

      const formatted = formatStadiumTime(date, 'yankees');

      expect(formatted).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
      expect(formatted).toContain('PM');
    });

    it('should show different times for different stadiums', () => {
      const date = new Date('2025-06-21T23:05:00Z');

      const nyTime = formatStadiumTime(date, 'yankees');
      const laTime = formatStadiumTime(date, 'dodgers');

      expect(nyTime).not.toBe(laTime);
    });

    it('should include timezone abbreviation if requested', () => {
      const date = new Date('2025-06-21T23:05:00Z');

      const formatted = formatStadiumTime(date, 'yankees', true);

      // Should include EDT or EST
      expect(formatted).toMatch(/EDT|EST|ET/i);
    });
  });

  describe('getStadiumOffset', () => {
    it('should return numeric offset for stadium', () => {
      const offset = getStadiumOffset('yankees', new Date('2025-06-21'));

      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThan(-24);
      expect(offset).toBeLessThan(24);
    });

    it('should reflect daylight saving time', () => {
      const summerDate = new Date('2025-06-21');
      const winterDate = new Date('2025-12-21');

      const summerOffset = getStadiumOffset('yankees', summerDate);
      const winterOffset = getStadiumOffset('yankees', winterDate');

      // EDT is -4, EST is -5
      expect(summerOffset).toBe(-4);
      expect(winterOffset).toBe(-5);
    });

    it('should handle Phoenix (no DST) correctly', () => {
      const summerDate = new Date('2025-06-21');
      const winterDate = new Date('2025-12-21');

      const summerOffset = getStadiumOffset('diamondbacks', summerDate);
      const winterOffset = getStadiumOffset('diamondbacks', winterDate);

      // Phoenix stays at MST (-7) year-round
      expect(summerOffset).toBe(winterOffset);
    });
  });

  describe('MLB Stadium Coverage', () => {
    const mlbStadiumIds = [
      'yankees',
      'redsox',
      'dodgers',
      'giants',
      'cubs',
      'whitesox',
      'astros',
      'rangers',
      'mariners',
      'athletics',
      'angels',
      'padres',
      'rockies',
      'diamondbacks',
      'mets',
      'phillies',
      'nationals',
      'braves',
      'marlins',
      'cardinals',
      'brewers',
      'pirates',
      'reds',
      'indians',
      'tigers',
      'twins',
      'royals',
      'orioles',
      'rays',
      'bluejays',
    ];

    it('should have timezone mappings for all 30 MLB stadiums', () => {
      mlbStadiumIds.forEach((stadiumId) => {
        const tz = getStadiumTimezone(stadiumId);

        expect(tz).toBeTruthy();
        expect(typeof tz).toBe('string');
        expect(tz).toMatch(/^[A-Z][a-z]+\/[A-Z][a-z_]+$/);
      });
    });

    it('should return valid offsets for all MLB stadiums', () => {
      const testDate = new Date('2025-06-21');

      mlbStadiumIds.forEach((stadiumId) => {
        const offset = getStadiumOffset(stadiumId, testDate);

        expect(typeof offset).toBe('number');
        expect(offset).toBeGreaterThan(-24);
        expect(offset).toBeLessThan(24);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null stadium ID', () => {
      const tz = getStadiumTimezone(null as any);

      expect(tz).toBeTruthy();
    });

    it('should handle undefined stadium ID', () => {
      const tz = getStadiumTimezone(undefined as any);

      expect(tz).toBeTruthy();
    });

    it('should handle empty string stadium ID', () => {
      const tz = getStadiumTimezone('');

      expect(tz).toBeTruthy();
    });

    it('should handle special characters in stadium ID', () => {
      const tz = getStadiumTimezone('yankees@#$%');

      expect(tz).toBeTruthy();
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');

      expect(() => convertGameTimeToStadiumLocal(invalidDate, 'yankees')).not.toThrow();
    });

    it('should handle very old dates', () => {
      const oldDate = new Date('1900-01-01T12:00:00Z');

      const formatted = formatStadiumTime(oldDate, 'yankees');

      expect(formatted).toBeTruthy();
    });

    it('should handle very future dates', () => {
      const futureDate = new Date('2100-01-01T12:00:00Z');

      const formatted = formatStadiumTime(futureDate, 'yankees');

      expect(formatted).toBeTruthy();
    });

    it('should handle DST transition dates', () => {
      // Spring forward date (March)
      const springForward = new Date('2025-03-09T07:00:00Z');
      const offset1 = getStadiumOffset('yankees', springForward);

      // Fall back date (November)
      const fallBack = new Date('2025-11-02T06:00:00Z');
      const offset2 = getStadiumOffset('yankees', fallBack);

      expect(typeof offset1).toBe('number');
      expect(typeof offset2).toBe('number');
    });
  });

  describe('Performance', () => {
    it('should handle 1000 timezone lookups quickly', () => {
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        getStadiumTimezone('yankees');
      }

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // < 100ms for 1000 lookups
    });

    it('should handle 1000 time conversions quickly', () => {
      const date = new Date('2025-06-21T19:05:00Z');
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        convertGameTimeToStadiumLocal(date, 'yankees');
      }

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500); // < 500ms for 1000 conversions
    });
  });
});

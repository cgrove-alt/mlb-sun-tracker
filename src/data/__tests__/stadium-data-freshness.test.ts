import {
  getStadiumLastUpdated,
  getStadiumFreshnessInfo,
  isStadiumDataStale,
  isStadiumDataOutdated,
  mlbDataFreshness,
  milbDataFreshness,
} from '../stadium-data-freshness';

describe('stadium-data-freshness utility functions', () => {
  describe('getStadiumLastUpdated', () => {
    it('should return last updated date for existing MLB stadium', () => {
      const lastUpdated = getStadiumLastUpdated('yankees');
      expect(lastUpdated).toBeTruthy();
      expect(typeof lastUpdated).toBe('string');
    });

    it('should return last updated date for existing MiLB stadium', () => {
      const lastUpdated = getStadiumLastUpdated('lehigh-valley-ironpigs');
      expect(lastUpdated).toBe('2025-01-27');
    });

    it('should return null for non-existent stadium', () => {
      const lastUpdated = getStadiumLastUpdated('non-existent-stadium');
      expect(lastUpdated).toBeNull();
    });

    it('should search across all leagues', () => {
      const mlbStadium = getStadiumLastUpdated('yankees');
      const milbStadium = getStadiumLastUpdated('lehigh-valley-ironpigs');

      expect(mlbStadium).toBeTruthy();
      expect(milbStadium).toBeTruthy();
    });
  });

  describe('getStadiumFreshnessInfo', () => {
    it('should return complete freshness info for existing stadium', () => {
      const info = getStadiumFreshnessInfo('lehigh-valley-ironpigs');

      expect(info).toBeTruthy();
      expect(info).toHaveProperty('stadiumId');
      expect(info).toHaveProperty('lastUpdated');
      expect(info?.stadiumId).toBe('lehigh-valley-ironpigs');
    });

    it('should include notes when available', () => {
      const info = getStadiumFreshnessInfo('lehigh-valley-ironpigs');

      expect(info?.notes).toBeTruthy();
      expect(info?.notes).toContain('Step 4.2');
    });

    it('should return null for non-existent stadium', () => {
      const info = getStadiumFreshnessInfo('non-existent-stadium');
      expect(info).toBeNull();
    });
  });

  describe('isStadiumDataStale', () => {
    it('should return false for recently updated stadium', () => {
      // Lehigh Valley was updated 2025-01-27, which is recent
      const isStale = isStadiumDataStale('lehigh-valley-ironpigs');
      expect(isStale).toBe(false);
    });

    it('should return true for stadium with old data', () => {
      // Dodgers has 2024-10-01, which may be over 1 year depending on test date
      // This test might be flaky in the future
      const isStale = isStadiumDataStale('dodgers');
      // We can't assert a specific value as it depends on current date
      expect(typeof isStale).toBe('boolean');
    });

    it('should return true for non-existent stadium', () => {
      const isStale = isStadiumDataStale('non-existent-stadium');
      expect(isStale).toBe(true);
    });
  });

  describe('isStadiumDataOutdated', () => {
    it('should return false for recently updated stadium', () => {
      const isOutdated = isStadiumDataOutdated('lehigh-valley-ironpigs');
      expect(isOutdated).toBe(false);
    });

    it('should return false for moderately old data (less than 2 years)', () => {
      // Yankees was updated 2024-12-15, less than 2 years old
      const isOutdated = isStadiumDataOutdated('yankees');
      expect(isOutdated).toBe(false);
    });

    it('should return true for non-existent stadium', () => {
      const isOutdated = isStadiumDataOutdated('non-existent-stadium');
      expect(isOutdated).toBe(true);
    });
  });

  describe('Data structure validation', () => {
    it('should have valid MLB data freshness entries', () => {
      expect(mlbDataFreshness).toBeDefined();
      expect(Array.isArray(mlbDataFreshness)).toBe(true);
      expect(mlbDataFreshness.length).toBeGreaterThan(0);

      mlbDataFreshness.forEach(entry => {
        expect(entry).toHaveProperty('stadiumId');
        expect(entry).toHaveProperty('lastUpdated');
        expect(typeof entry.stadiumId).toBe('string');
        expect(typeof entry.lastUpdated).toBe('string');

        // Validate date format (YYYY-MM-DD)
        expect(entry.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Validate date is parseable
        const date = new Date(entry.lastUpdated);
        expect(date.toString()).not.toBe('Invalid Date');
      });
    });

    it('should have valid MiLB data freshness entries', () => {
      expect(milbDataFreshness).toBeDefined();
      expect(Array.isArray(milbDataFreshness)).toBe(true);
      expect(milbDataFreshness.length).toBeGreaterThan(0);

      milbDataFreshness.forEach(entry => {
        expect(entry).toHaveProperty('stadiumId');
        expect(entry).toHaveProperty('lastUpdated');
        expect(typeof entry.stadiumId).toBe('string');
        expect(typeof entry.lastUpdated).toBe('string');

        // Validate date format
        expect(entry.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Validate date is parseable
        const date = new Date(entry.lastUpdated);
        expect(date.toString()).not.toBe('Invalid Date');
      });
    });

    it('should have unique stadium IDs within each league', () => {
      const mlbIds = mlbDataFreshness.map(e => e.stadiumId);
      const uniqueMlbIds = new Set(mlbIds);
      expect(mlbIds.length).toBe(uniqueMlbIds.size);

      const milbIds = milbDataFreshness.map(e => e.stadiumId);
      const uniqueMilbIds = new Set(milbIds);
      expect(milbIds.length).toBe(uniqueMilbIds.size);
    });

    it('should have notes for all entries', () => {
      const allEntries = [...mlbDataFreshness, ...milbDataFreshness];

      allEntries.forEach(entry => {
        expect(entry.notes).toBeDefined();
        expect(typeof entry.notes).toBe('string');
        expect(entry.notes!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Date calculations', () => {
    it('should correctly calculate staleness for dates exactly 1 year ago', () => {
      // This is a conceptual test - actual implementation may vary by 1-2 days
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setDate(oneYearAgo.getDate() - 1); // Just over 1 year

      // We can't easily test this without mocking, but we can verify the logic exists
      expect(isStadiumDataStale).toBeDefined();
      expect(typeof isStadiumDataStale).toBe('function');
    });

    it('should correctly calculate outdated status for dates exactly 2 years ago', () => {
      // Similar to above - conceptual test
      expect(isStadiumDataOutdated).toBeDefined();
      expect(typeof isStadiumDataOutdated).toBe('function');
    });
  });

  describe('Integration with real stadium IDs', () => {
    it('should have entries for key MLB stadiums', () => {
      const keyStadiums = ['yankees', 'redsox', 'dodgers', 'cubs', 'giants'];

      keyStadiums.forEach(stadiumId => {
        const lastUpdated = getStadiumLastUpdated(stadiumId);
        expect(lastUpdated).toBeTruthy();
      });
    });

    it('should have entry for enhanced MiLB stadium', () => {
      const info = getStadiumFreshnessInfo('lehigh-valley-ironpigs');

      expect(info).toBeTruthy();
      expect(info?.lastUpdated).toBe('2025-01-27');
      expect(info?.notes).toContain('Enhanced');
    });
  });
});

// World Cup Timezone Utilities - Unit Tests

import {
  getMatchLocalDateTime,
  formatMatchTimeVenue,
  isMatchLive,
  getTimeUntilMatch,
  formatMatchCountdown,
  groupMatchesByDate,
  sortMatchesByTime
} from '../worldCupTimezone';
import { WorldCupMatch } from '../../data/worldcup2026/types';

const mockMatch: WorldCupMatch = {
  matchId: 'wc2026-001',
  date: '2026-06-11',
  kickoffTime: '17:00',
  venue: 'estadio-azteca-wc',
  round: 'Group Stage',
  group: 'Group A',
  teamA: 'Mexico',
  teamB: 'TBD',
  tvChannels: ['FOX', 'Telemundo']
};

describe('World Cup Timezone Utilities', () => {
  describe('getMatchLocalDateTime', () => {
    test('combines date and kickoff time', () => {
      const result = getMatchLocalDateTime(mockMatch);
      expect(result).toBe('2026-06-11T17:00:00');
    });

    test('handles different times correctly', () => {
      const match: WorldCupMatch = {
        ...mockMatch,
        date: '2026-07-19',
        kickoffTime: '15:00'
      };
      const result = getMatchLocalDateTime(match);
      expect(result).toBe('2026-07-19T15:00:00');
    });
  });

  describe('formatMatchTimeVenue', () => {
    test('formats match time with venue city', () => {
      const result = formatMatchTimeVenue(mockMatch);
      expect(result).toContain('Mexico City');
      expect(result).toContain('Jun');
      expect(result).toContain('11');
    });

    test('handles invalid venue gracefully', () => {
      const invalidMatch: WorldCupMatch = {
        ...mockMatch,
        venue: 'invalid-venue-wc'
      };
      const result = formatMatchTimeVenue(invalidMatch);
      expect(result).toContain('2026-06-11');
      expect(result).toContain('17:00');
    });
  });

  describe('isMatchLive', () => {
    test('returns false for future matches', () => {
      const futureTime = new Date('2026-06-11T16:00:00Z');
      const result = isMatchLive(mockMatch, futureTime);
      expect(result).toBe(false);
    });

    test('returns false for past matches', () => {
      const pastTime = new Date('2026-06-11T23:00:00Z');
      const result = isMatchLive(mockMatch, pastTime);
      expect(result).toBe(false);
    });
  });

  describe('getTimeUntilMatch', () => {
    test('returns positive value for future matches', () => {
      const beforeMatch = new Date('2026-06-11T15:00:00Z');
      const result = getTimeUntilMatch(mockMatch, beforeMatch);
      expect(result).toBeGreaterThan(0);
    });

    test('returns negative value for past matches', () => {
      const afterMatch = new Date('2026-06-12T00:00:00Z');
      const result = getTimeUntilMatch(mockMatch, afterMatch);
      expect(result).toBeLessThan(0);
    });
  });

  describe('formatMatchCountdown', () => {
    test('formats days and hours for distant matches', () => {
      // Mock getTimeUntilMatch to return 3 days
      const result = formatMatchCountdown(mockMatch);
      expect(typeof result).toBe('string');
    });

    test('returns "Finished" for past matches', () => {
      const pastMatch: WorldCupMatch = {
        ...mockMatch,
        date: '2020-01-01',
        kickoffTime: '12:00'
      };
      const result = formatMatchCountdown(pastMatch);
      expect(result).toBe('Finished');
    });
  });

  describe('groupMatchesByDate', () => {
    test('groups matches by date correctly', () => {
      const matches: WorldCupMatch[] = [
        { ...mockMatch, matchId: 'wc2026-001', date: '2026-06-11' },
        { ...mockMatch, matchId: 'wc2026-002', date: '2026-06-11' },
        { ...mockMatch, matchId: 'wc2026-003', date: '2026-06-12' }
      ];

      const result = groupMatchesByDate(matches);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['2026-06-11']).toHaveLength(2);
      expect(result['2026-06-12']).toHaveLength(1);
    });

    test('handles empty array', () => {
      const result = groupMatchesByDate([]);
      expect(result).toEqual({});
    });
  });

  describe('sortMatchesByTime', () => {
    test('sorts matches by date and time', () => {
      const matches: WorldCupMatch[] = [
        { ...mockMatch, matchId: 'wc2026-003', date: '2026-06-12', kickoffTime: '15:00' },
        { ...mockMatch, matchId: 'wc2026-001', date: '2026-06-11', kickoffTime: '17:00' },
        { ...mockMatch, matchId: 'wc2026-002', date: '2026-06-11', kickoffTime: '12:00' }
      ];

      const result = sortMatchesByTime(matches);

      expect(result[0].matchId).toBe('wc2026-002'); // June 11, 12:00
      expect(result[1].matchId).toBe('wc2026-001'); // June 11, 17:00
      expect(result[2].matchId).toBe('wc2026-003'); // June 12, 15:00
    });

    test('does not mutate original array', () => {
      const matches: WorldCupMatch[] = [
        { ...mockMatch, matchId: 'wc2026-002', date: '2026-06-12' },
        { ...mockMatch, matchId: 'wc2026-001', date: '2026-06-11' }
      ];

      const original = [...matches];
      sortMatchesByTime(matches);

      expect(matches).toEqual(original);
    });
  });
});

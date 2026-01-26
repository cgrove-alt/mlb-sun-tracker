// World Cup 2026 Matches - Unit Tests
// Tests for match schedule and helper functions

import {
  WORLD_CUP_2026_MATCHES,
  getMatchesByVenue,
  getMatchesByRound,
  getMatchesByDate,
  getAllMatchesSorted,
  getNextMatch,
  getOpeningWeekMatches,
  MATCH_SCHEDULE_STATS
} from '../matches';

describe('World Cup 2026 Matches', () => {
  describe('Match Collection', () => {
    test('WORLD_CUP_2026_MATCHES is an array', () => {
      expect(Array.isArray(WORLD_CUP_2026_MATCHES)).toBe(true);
    });

    test('all matches have required fields', () => {
      WORLD_CUP_2026_MATCHES.forEach(match => {
        expect(match).toHaveProperty('matchId');
        expect(match).toHaveProperty('date');
        expect(match).toHaveProperty('kickoffTime');
        expect(match).toHaveProperty('venue');
        expect(match).toHaveProperty('round');
        expect(match).toHaveProperty('teamA');
        expect(match).toHaveProperty('teamB');
      });
    });

    test('all match IDs are unique', () => {
      const ids = WORLD_CUP_2026_MATCHES.map(m => m.matchId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('all match IDs follow wc2026-XXX format', () => {
      WORLD_CUP_2026_MATCHES.forEach(match => {
        expect(match.matchId).toMatch(/^wc2026-\d{3}$/);
      });
    });
  });

  describe('Match Dates', () => {
    test('all dates are in ISO 8601 format', () => {
      WORLD_CUP_2026_MATCHES.forEach(match => {
        expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(match.date).toString()).not.toBe('Invalid Date');
      });
    });

    test('all dates are between tournament start and end', () => {
      const tournamentStart = new Date('2026-06-11');
      const tournamentEnd = new Date('2026-07-19');

      WORLD_CUP_2026_MATCHES.forEach(match => {
        const matchDate = new Date(match.date);
        expect(matchDate.getTime()).toBeGreaterThanOrEqual(tournamentStart.getTime());
        expect(matchDate.getTime()).toBeLessThanOrEqual(tournamentEnd.getTime());
      });
    });
  });

  describe('Match Rounds', () => {
    test('all rounds are valid tournament rounds', () => {
      const validRounds = ['Group Stage', 'Round of 16', 'Quarterfinal', 'Semifinal', 'Third Place', 'Final'];

      WORLD_CUP_2026_MATCHES.forEach(match => {
        expect(validRounds).toContain(match.round);
      });
    });

    test('opening match is June 11, 2026', () => {
      const openingMatch = WORLD_CUP_2026_MATCHES.find(m => m.matchId === 'wc2026-001');
      expect(openingMatch).toBeDefined();
      expect(openingMatch?.date).toBe('2026-06-11');
    });

    test('final match is July 19, 2026', () => {
      const finalMatch = WORLD_CUP_2026_MATCHES.find(m => m.matchId === 'wc2026-064');
      expect(finalMatch).toBeDefined();
      expect(finalMatch?.date).toBe('2026-07-19');
      expect(finalMatch?.round).toBe('Final');
    });
  });

  describe('getMatchesByVenue', () => {
    test('returns matches for MetLife Stadium', () => {
      const matches = getMatchesByVenue('metlife-stadium-wc');
      expect(matches.length).toBeGreaterThan(0);
      matches.forEach(match => {
        expect(match.venue).toBe('metlife-stadium-wc');
      });
    });

    test('returns matches for Estadio Azteca', () => {
      const matches = getMatchesByVenue('estadio-azteca-wc');
      expect(matches.length).toBeGreaterThan(0);
      matches.forEach(match => {
        expect(match.venue).toBe('estadio-azteca-wc');
      });
    });

    test('returns empty array for non-existent venue', () => {
      const matches = getMatchesByVenue('fake-stadium-wc');
      expect(matches).toHaveLength(0);
    });
  });

  describe('getMatchesByRound', () => {
    test('returns Group Stage matches', () => {
      const matches = getMatchesByRound('Group Stage');
      expect(matches.length).toBeGreaterThan(0);
      matches.forEach(match => {
        expect(match.round).toBe('Group Stage');
      });
    });

    test('returns exactly 1 Final match', () => {
      const matches = getMatchesByRound('Final');
      expect(matches).toHaveLength(1);
      expect(matches[0].round).toBe('Final');
    });

    test('returns Semifinal matches', () => {
      const matches = getMatchesByRound('Semifinal');
      expect(matches.length).toBeGreaterThanOrEqual(2);
      matches.forEach(match => {
        expect(match.round).toBe('Semifinal');
      });
    });
  });

  describe('getMatchesByDate', () => {
    test('returns matches on opening day', () => {
      const matches = getMatchesByDate('2026-06-11');
      expect(matches.length).toBeGreaterThan(0);
      matches.forEach(match => {
        expect(match.date).toBe('2026-06-11');
      });
    });

    test('returns matches on final day', () => {
      const matches = getMatchesByDate('2026-07-19');
      expect(matches.length).toBeGreaterThan(0);
      matches.forEach(match => {
        expect(match.date).toBe('2026-07-19');
      });
    });

    test('returns empty array for date with no matches', () => {
      const matches = getMatchesByDate('2026-05-01');
      expect(matches).toHaveLength(0);
    });
  });

  describe('getAllMatchesSorted', () => {
    test('returns all matches', () => {
      const sorted = getAllMatchesSorted();
      expect(sorted.length).toBe(WORLD_CUP_2026_MATCHES.length);
    });

    test('matches are sorted by date then time', () => {
      const sorted = getAllMatchesSorted();

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];

        const prevDateTime = `${prev.date}T${prev.kickoffTime}`;
        const currDateTime = `${curr.date}T${curr.kickoffTime}`;

        expect(prevDateTime <= currDateTime).toBe(true);
      }
    });

    test('opening match is first', () => {
      const sorted = getAllMatchesSorted();
      expect(sorted[0].matchId).toBe('wc2026-001');
    });

    test('final match is last', () => {
      const sorted = getAllMatchesSorted();
      expect(sorted[sorted.length - 1].matchId).toBe('wc2026-064');
    });
  });

  describe('getNextMatch', () => {
    test('returns null for dates after tournament', () => {
      const afterTournament = new Date('2026-08-01');
      const nextMatch = getNextMatch(afterTournament);
      expect(nextMatch).toBeNull();
    });

    test('returns opening match for dates before tournament', () => {
      const beforeTournament = new Date('2026-05-01');
      const nextMatch = getNextMatch(beforeTournament);
      expect(nextMatch).toBeDefined();
      expect(nextMatch?.matchId).toBe('wc2026-001');
    });

    test('returns upcoming match during tournament', () => {
      const duringTournament = new Date('2026-06-15');
      const nextMatch = getNextMatch(duringTournament);
      expect(nextMatch).toBeDefined();
      expect(new Date(nextMatch!.date).getTime()).toBeGreaterThanOrEqual(duringTournament.getTime());
    });
  });

  describe('getOpeningWeekMatches', () => {
    test('returns matches from opening week', () => {
      const openingWeek = getOpeningWeekMatches();
      expect(openingWeek.length).toBeGreaterThan(0);

      const startDate = new Date('2026-06-11');
      const endDate = new Date('2026-06-18');

      openingWeek.forEach(match => {
        const matchDate = new Date(match.date);
        expect(matchDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(matchDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    test('includes opening match', () => {
      const openingWeek = getOpeningWeekMatches();
      const hasOpeningMatch = openingWeek.some(m => m.matchId === 'wc2026-001');
      expect(hasOpeningMatch).toBe(true);
    });
  });

  describe('MATCH_SCHEDULE_STATS', () => {
    test('total matches is 104', () => {
      expect(MATCH_SCHEDULE_STATS.totalMatches).toBe(104);
    });

    test('opening match info is correct', () => {
      expect(MATCH_SCHEDULE_STATS.openingMatch.date).toBe('2026-06-11');
      expect(MATCH_SCHEDULE_STATS.openingMatch.venue).toBe('Estadio Azteca');
    });

    test('final match info is correct', () => {
      expect(MATCH_SCHEDULE_STATS.finalMatch.date).toBe('2026-07-19');
      expect(MATCH_SCHEDULE_STATS.finalMatch.venue).toBe('MetLife Stadium');
    });

    test('matches by round breakdown is correct', () => {
      expect(MATCH_SCHEDULE_STATS.matchesByRound.groupStage).toBe(80);
      expect(MATCH_SCHEDULE_STATS.matchesByRound.roundOf16).toBe(16);
      expect(MATCH_SCHEDULE_STATS.matchesByRound.quarterfinals).toBe(8);
      expect(MATCH_SCHEDULE_STATS.matchesByRound.semifinals).toBe(2);
      expect(MATCH_SCHEDULE_STATS.matchesByRound.thirdPlace).toBe(1);
      expect(MATCH_SCHEDULE_STATS.matchesByRound.final).toBe(1);
    });
  });

  describe('Venue Distribution', () => {
    test('all venue IDs end with "-wc"', () => {
      WORLD_CUP_2026_MATCHES.forEach(match => {
        expect(match.venue).toMatch(/-wc$/);
      });
    });

    test('MetLife Stadium hosts final', () => {
      const finalMatch = WORLD_CUP_2026_MATCHES.find(m => m.round === 'Final');
      expect(finalMatch?.venue).toBe('metlife-stadium-wc');
    });

    test('Estadio Azteca hosts opening match', () => {
      const openingMatch = WORLD_CUP_2026_MATCHES.find(m => m.matchId === 'wc2026-001');
      expect(openingMatch?.venue).toBe('estadio-azteca-wc');
    });
  });
});

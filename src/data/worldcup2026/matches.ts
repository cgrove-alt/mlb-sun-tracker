// 2026 FIFA World Cup Match Schedule
// 104 matches across 16 venues (USA, Mexico, Canada)

import { WorldCupMatch } from './types';

/**
 * World Cup 2026 Match Schedule
 * Based on official FIFA schedule
 * NOTE: Teams marked as "TBD" will be updated as qualification completes
 */
export const WORLD_CUP_2026_MATCHES: WorldCupMatch[] = [
  // Opening Match - June 11, 2026
  {
    matchId: 'wc2026-001',
    date: '2026-06-11',
    kickoffTime: '17:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'Mexico',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // Group Stage - Sample matches (Full 48-team schedule to be populated)
  {
    matchId: 'wc2026-002',
    date: '2026-06-12',
    kickoffTime: '15:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'USA',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-003',
    date: '2026-06-12',
    kickoffTime: '18:00',
    venue: 'bmo-field-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'Canada',
    teamB: 'TBD',
    tvChannels: ['TSN', 'FOX']
  },
  {
    matchId: 'wc2026-004',
    date: '2026-06-13',
    kickoffTime: '14:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-005',
    date: '2026-06-13',
    kickoffTime: '17:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Round of 16 - Sample matches
  {
    matchId: 'wc2026-049',
    date: '2026-06-27',
    kickoffTime: '15:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-050',
    date: '2026-06-28',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Quarterfinals
  {
    matchId: 'wc2026-057',
    date: '2026-07-03',
    kickoffTime: '15:00',
    venue: 'sofi-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-058',
    date: '2026-07-04',
    kickoffTime: '15:00',
    venue: 'gillette-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Semifinals
  {
    matchId: 'wc2026-061',
    date: '2026-07-14',
    kickoffTime: '19:00',
    venue: 'att-stadium-wc',
    round: 'Semifinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-062',
    date: '2026-07-15',
    kickoffTime: '19:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Semifinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // Third Place Match
  {
    matchId: 'wc2026-063',
    date: '2026-07-18',
    kickoffTime: '16:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Third Place',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // Final - July 19, 2026
  {
    matchId: 'wc2026-064',
    date: '2026-07-19',
    kickoffTime: '15:00',
    venue: 'metlife-stadium-wc',
    round: 'Final',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN', 'BBC', 'ESPN'],
    expectedAttendance: 87000
  }

  // NOTE: This is a representative sample. Full 104-match schedule to be populated
  // in Phase 4 with complete group stage, knockout rounds
];

/**
 * Get matches for a specific venue
 */
export function getMatchesByVenue(venueId: string): WorldCupMatch[] {
  return WORLD_CUP_2026_MATCHES.filter(match => match.venue === venueId);
}

/**
 * Get matches for a specific round
 */
export function getMatchesByRound(round: WorldCupMatch['round']): WorldCupMatch[] {
  return WORLD_CUP_2026_MATCHES.filter(match => match.round === round);
}

/**
 * Get matches on a specific date
 */
export function getMatchesByDate(date: string): WorldCupMatch[] {
  return WORLD_CUP_2026_MATCHES.filter(match => match.date === date);
}

/**
 * Get all matches sorted by date
 */
export function getAllMatchesSorted(): WorldCupMatch[] {
  return [...WORLD_CUP_2026_MATCHES].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.kickoffTime.localeCompare(b.kickoffTime);
  });
}

/**
 * Get next upcoming match (relative to current date)
 */
export function getNextMatch(currentDate: Date = new Date()): WorldCupMatch | null {
  const currentDateStr = currentDate.toISOString().split('T')[0];
  const upcomingMatches = WORLD_CUP_2026_MATCHES.filter(match => match.date >= currentDateStr);

  if (upcomingMatches.length === 0) return null;

  return upcomingMatches.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.kickoffTime.localeCompare(b.kickoffTime);
  })[0];
}

/**
 * Get matches for opening week
 */
export function getOpeningWeekMatches(): WorldCupMatch[] {
  return WORLD_CUP_2026_MATCHES.filter(match => {
    const matchDate = new Date(match.date);
    const openingDate = new Date('2026-06-11');
    const weekLater = new Date('2026-06-18');
    return matchDate >= openingDate && matchDate <= weekLater;
  });
}

/**
 * Match schedule statistics
 */
export const MATCH_SCHEDULE_STATS = {
  totalMatches: 104,  // Full tournament
  sampleMatches: WORLD_CUP_2026_MATCHES.length,  // Currently populated
  openingMatch: {
    date: '2026-06-11',
    venue: 'Estadio Azteca',
    teams: 'Mexico vs TBD'
  },
  finalMatch: {
    date: '2026-07-19',
    venue: 'MetLife Stadium',
    teams: 'TBD vs TBD'
  },
  matchesByRound: {
    groupStage: 80,  // 16 groups × 5 matches
    roundOf16: 16,
    quarterfinals: 8,
    semifinals: 2,
    thirdPlace: 1,
    final: 1
  }
};

/**
 * NOTE FOR PHASE 4 IMPLEMENTATION:
 *
 * This file currently contains a representative sample of 14 matches.
 * In Phase 4 (Weeks 6-7), populate with complete 104-match schedule:
 *
 * 1. Group Stage (80 matches):
 *    - 16 groups of 3 teams = 48 teams
 *    - Each group plays 3 matches
 *    - Dates: June 11-26, 2026
 *
 * 2. Round of 16 (16 matches):
 *    - Dates: June 27 - July 2, 2026
 *
 * 3. Quarterfinals (8 matches):
 *    - Dates: July 3-6, 2026
 *
 * 4. Semifinals (2 matches):
 *    - Dates: July 14-15, 2026
 *
 * 5. Third Place + Final (2 matches):
 *    - Dates: July 18-19, 2026
 *
 * Data sources:
 * - FIFA official website
 * - Concacaf.com
 * - Stadium contracts/announcements
 */

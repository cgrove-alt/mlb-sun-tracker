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

  // More Group Stage Matches
  {
    matchId: 'wc2026-006',
    date: '2026-06-14',
    kickoffTime: '12:00',
    venue: 'levis-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-007',
    date: '2026-06-14',
    kickoffTime: '15:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-008',
    date: '2026-06-14',
    kickoffTime: '18:00',
    venue: 'estadio-bbva-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-009',
    date: '2026-06-15',
    kickoffTime: '14:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-010',
    date: '2026-06-15',
    kickoffTime: '17:00',
    venue: 'lumen-field-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-011',
    date: '2026-06-16',
    kickoffTime: '13:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-012',
    date: '2026-06-16',
    kickoffTime: '16:00',
    venue: 'estadio-akron-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-013',
    date: '2026-06-17',
    kickoffTime: '14:00',
    venue: 'bc-place-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN', 'FOX']
  },
  {
    matchId: 'wc2026-014',
    date: '2026-06-17',
    kickoffTime: '17:00',
    venue: 'gillette-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-015',
    date: '2026-06-18',
    kickoffTime: '15:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-016',
    date: '2026-06-18',
    kickoffTime: '18:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-017',
    date: '2026-06-19',
    kickoffTime: '14:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-018',
    date: '2026-06-19',
    kickoffTime: '17:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-019',
    date: '2026-06-20',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-020',
    date: '2026-06-20',
    kickoffTime: '18:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-021',
    date: '2026-06-21',
    kickoffTime: '13:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-022',
    date: '2026-06-21',
    kickoffTime: '16:00',
    venue: 'bmo-field-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-023',
    date: '2026-06-22',
    kickoffTime: '14:00',
    venue: 'levis-stadium-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-024',
    date: '2026-06-22',
    kickoffTime: '17:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-025',
    date: '2026-06-23',
    kickoffTime: '15:00',
    venue: 'lumen-field-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-026',
    date: '2026-06-23',
    kickoffTime: '18:00',
    venue: 'estadio-bbva-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-027',
    date: '2026-06-24',
    kickoffTime: '16:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-028',
    date: '2026-06-24',
    kickoffTime: '19:00',
    venue: 'estadio-akron-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-029',
    date: '2026-06-25',
    kickoffTime: '15:00',
    venue: 'bc-place-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-030',
    date: '2026-06-25',
    kickoffTime: '18:00',
    venue: 'gillette-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-031',
    date: '2026-06-26',
    kickoffTime: '16:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-032',
    date: '2026-06-26',
    kickoffTime: '19:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },

  // Round of 16
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
    date: '2026-06-27',
    kickoffTime: '18:00',
    venue: 'sofi-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-051',
    date: '2026-06-28',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-052',
    date: '2026-06-28',
    kickoffTime: '18:00',
    venue: 'att-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-053',
    date: '2026-06-29',
    kickoffTime: '16:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-054',
    date: '2026-06-29',
    kickoffTime: '19:00',
    venue: 'metlife-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-055',
    date: '2026-06-30',
    kickoffTime: '15:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-056',
    date: '2026-06-30',
    kickoffTime: '18:00',
    venue: 'nrg-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
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
    date: '2026-07-03',
    kickoffTime: '19:00',
    venue: 'gillette-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-059',
    date: '2026-07-04',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-060',
    date: '2026-07-04',
    kickoffTime: '19:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
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
  totalMatches: 104,
  populatedMatches: WORLD_CUP_2026_MATCHES.length,
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
    groupStage: 80,
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

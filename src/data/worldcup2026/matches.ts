// 2026 FIFA World Cup Match Schedule
// 104 matches across 16 venues (USA, Mexico, Canada)
// 48-team tournament format: 12 groups of 4 teams
// Schedule: Group Stage (72 matches) + Round of 32 (16) + Round of 16 (8) + QF (4) + SF (2) + 3rd Place (1) + Final (1) = 104 matches

import { WorldCupMatch } from './types';

/**
 * World Cup 2026 Match Schedule
 * Based on official FIFA schedule
 * NOTE: Teams marked as "TBD" will be updated as qualification completes
 *
 * Tournament Format (48 teams, 12 groups):
 * - Group Stage: 72 matches (12 groups × 6 matches)
 * - Round of 32: 16 matches (top 2 from each group + 8 best 3rd-place teams)
 * - Round of 16: 8 matches
 * - Quarterfinals: 4 matches
 * - Semifinals: 2 matches
 * - Third Place: 1 match
 * - Final: 1 match
 * TOTAL: 104 matches
 */
export const WORLD_CUP_2026_MATCHES: WorldCupMatch[] = [
  // ============================================================
  // GROUP STAGE - 72 MATCHES (12 GROUPS × 6 MATCHES EACH)
  // ============================================================

  // MATCHDAY 1 - Opening matches for all 12 groups (June 11-18, 2026)

  // Opening Match - Group A, Match 1 (June 11)
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
  // Group A, Match 2
  {
    matchId: 'wc2026-002',
    date: '2026-06-11',
    kickoffTime: '20:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group B, Matches 3-4 (June 12)
  {
    matchId: 'wc2026-003',
    date: '2026-06-12',
    kickoffTime: '12:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'USA',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-004',
    date: '2026-06-12',
    kickoffTime: '15:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group C, Matches 5-6 (June 12-13)
  {
    matchId: 'wc2026-005',
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
    matchId: 'wc2026-006',
    date: '2026-06-13',
    kickoffTime: '12:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group D, Matches 7-8 (June 13)
  {
    matchId: 'wc2026-007',
    date: '2026-06-13',
    kickoffTime: '15:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-008',
    date: '2026-06-13',
    kickoffTime: '18:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group E, Matches 9-10 (June 14)
  {
    matchId: 'wc2026-009',
    date: '2026-06-14',
    kickoffTime: '12:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-010',
    date: '2026-06-14',
    kickoffTime: '15:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group F, Matches 11-12 (June 14-15)
  {
    matchId: 'wc2026-011',
    date: '2026-06-14',
    kickoffTime: '18:00',
    venue: 'levis-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-012',
    date: '2026-06-15',
    kickoffTime: '12:00',
    venue: 'gillette-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group G, Matches 13-14 (June 15)
  {
    matchId: 'wc2026-013',
    date: '2026-06-15',
    kickoffTime: '15:00',
    venue: 'lumen-field-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-014',
    date: '2026-06-15',
    kickoffTime: '18:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group H, Matches 15-16 (June 16)
  {
    matchId: 'wc2026-015',
    date: '2026-06-16',
    kickoffTime: '12:00',
    venue: 'estadio-bbva-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-016',
    date: '2026-06-16',
    kickoffTime: '15:00',
    venue: 'estadio-akron-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // Group I, Matches 17-18 (June 16-17)
  {
    matchId: 'wc2026-017',
    date: '2026-06-16',
    kickoffTime: '18:00',
    venue: 'bc-place-wc',
    round: 'Group Stage',
    group: 'Group I',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-018',
    date: '2026-06-17',
    kickoffTime: '12:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group I',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group J, Matches 19-20 (June 17)
  {
    matchId: 'wc2026-019',
    date: '2026-06-17',
    kickoffTime: '15:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group J',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-020',
    date: '2026-06-17',
    kickoffTime: '18:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group J',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group K, Matches 21-22 (June 18)
  {
    matchId: 'wc2026-021',
    date: '2026-06-18',
    kickoffTime: '12:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group K',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-022',
    date: '2026-06-18',
    kickoffTime: '15:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group K',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group L, Matches 23-24 (June 18-19)
  {
    matchId: 'wc2026-023',
    date: '2026-06-18',
    kickoffTime: '18:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group L',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-024',
    date: '2026-06-19',
    kickoffTime: '12:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group L',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // MATCHDAY 2 - All groups play second round (June 19-24)

  // Group A, Matchday 2 (June 19-20)
  {
    matchId: 'wc2026-025',
    date: '2026-06-19',
    kickoffTime: '15:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-026',
    date: '2026-06-20',
    kickoffTime: '12:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'Mexico',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // Group B, Matchday 2 (June 20)
  {
    matchId: 'wc2026-027',
    date: '2026-06-20',
    kickoffTime: '15:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'USA',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-028',
    date: '2026-06-20',
    kickoffTime: '18:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group C, Matchday 2 (June 21)
  {
    matchId: 'wc2026-029',
    date: '2026-06-21',
    kickoffTime: '12:00',
    venue: 'bmo-field-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'Canada',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-030',
    date: '2026-06-21',
    kickoffTime: '15:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group D, Matchday 2 (June 21-22)
  {
    matchId: 'wc2026-031',
    date: '2026-06-21',
    kickoffTime: '18:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-032',
    date: '2026-06-22',
    kickoffTime: '12:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group E, Matchday 2 (June 22)
  {
    matchId: 'wc2026-033',
    date: '2026-06-22',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-034',
    date: '2026-06-22',
    kickoffTime: '18:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group F, Matchday 2 (June 23)
  {
    matchId: 'wc2026-035',
    date: '2026-06-23',
    kickoffTime: '12:00',
    venue: 'levis-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-036',
    date: '2026-06-23',
    kickoffTime: '15:00',
    venue: 'gillette-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group G, Matchday 2 (June 23-24)
  {
    matchId: 'wc2026-037',
    date: '2026-06-23',
    kickoffTime: '18:00',
    venue: 'lumen-field-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-038',
    date: '2026-06-24',
    kickoffTime: '12:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group H, Matchday 2 (June 24)
  {
    matchId: 'wc2026-039',
    date: '2026-06-24',
    kickoffTime: '15:00',
    venue: 'estadio-bbva-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-040',
    date: '2026-06-24',
    kickoffTime: '18:00',
    venue: 'estadio-akron-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // Group I, Matchday 2 (June 25)
  {
    matchId: 'wc2026-041',
    date: '2026-06-25',
    kickoffTime: '12:00',
    venue: 'bc-place-wc',
    round: 'Group Stage',
    group: 'Group I',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-042',
    date: '2026-06-25',
    kickoffTime: '15:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group I',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group J, Matchday 2 (June 25-26)
  {
    matchId: 'wc2026-043',
    date: '2026-06-25',
    kickoffTime: '18:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group J',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-044',
    date: '2026-06-26',
    kickoffTime: '12:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group J',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group K, Matchday 2 (June 26)
  {
    matchId: 'wc2026-045',
    date: '2026-06-26',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group K',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-046',
    date: '2026-06-26',
    kickoffTime: '18:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group K',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group L, Matchday 2 (June 27)
  {
    matchId: 'wc2026-047',
    date: '2026-06-27',
    kickoffTime: '12:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group L',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-048',
    date: '2026-06-27',
    kickoffTime: '15:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group L',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // MATCHDAY 3 - Final group matches (simultaneous kickoffs June 27-July 2)

  // Group A, Matchday 3 (June 27 - simultaneous)
  {
    matchId: 'wc2026-049',
    date: '2026-06-27',
    kickoffTime: '19:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-050',
    date: '2026-06-27',
    kickoffTime: '19:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group A',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group B, Matchday 3 (June 28 - simultaneous)
  {
    matchId: 'wc2026-051',
    date: '2026-06-28',
    kickoffTime: '16:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-052',
    date: '2026-06-28',
    kickoffTime: '16:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group B',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },

  // Group C, Matchday 3 (June 28 - simultaneous)
  {
    matchId: 'wc2026-053',
    date: '2026-06-28',
    kickoffTime: '19:00',
    venue: 'bmo-field-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-054',
    date: '2026-06-28',
    kickoffTime: '19:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group C',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group D, Matchday 3 (June 29 - simultaneous)
  {
    matchId: 'wc2026-055',
    date: '2026-06-29',
    kickoffTime: '16:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-056',
    date: '2026-06-29',
    kickoffTime: '16:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group D',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group E, Matchday 3 (June 29 - simultaneous)
  {
    matchId: 'wc2026-057',
    date: '2026-06-29',
    kickoffTime: '19:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-058',
    date: '2026-06-29',
    kickoffTime: '19:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Group Stage',
    group: 'Group E',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group F, Matchday 3 (June 30 - simultaneous)
  {
    matchId: 'wc2026-059',
    date: '2026-06-30',
    kickoffTime: '16:00',
    venue: 'levis-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-060',
    date: '2026-06-30',
    kickoffTime: '16:00',
    venue: 'gillette-stadium-wc',
    round: 'Group Stage',
    group: 'Group F',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group G, Matchday 3 (June 30 - simultaneous)
  {
    matchId: 'wc2026-061',
    date: '2026-06-30',
    kickoffTime: '19:00',
    venue: 'lumen-field-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-062',
    date: '2026-06-30',
    kickoffTime: '19:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Group Stage',
    group: 'Group G',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group H, Matchday 3 (July 1 - simultaneous)
  {
    matchId: 'wc2026-063',
    date: '2026-07-01',
    kickoffTime: '16:00',
    venue: 'estadio-bbva-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-064',
    date: '2026-07-01',
    kickoffTime: '16:00',
    venue: 'estadio-akron-wc',
    round: 'Group Stage',
    group: 'Group H',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // Group I, Matchday 3 (July 1 - simultaneous)
  {
    matchId: 'wc2026-065',
    date: '2026-07-01',
    kickoffTime: '19:00',
    venue: 'bc-place-wc',
    round: 'Group Stage',
    group: 'Group I',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN']
  },
  {
    matchId: 'wc2026-066',
    date: '2026-07-01',
    kickoffTime: '19:00',
    venue: 'metlife-stadium-wc',
    round: 'Group Stage',
    group: 'Group I',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group J, Matchday 3 (July 2 - simultaneous)
  {
    matchId: 'wc2026-067',
    date: '2026-07-02',
    kickoffTime: '16:00',
    venue: 'att-stadium-wc',
    round: 'Group Stage',
    group: 'Group J',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-068',
    date: '2026-07-02',
    kickoffTime: '16:00',
    venue: 'sofi-stadium-wc',
    round: 'Group Stage',
    group: 'Group J',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group K, Matchday 3 (July 2 - simultaneous)
  {
    matchId: 'wc2026-069',
    date: '2026-07-02',
    kickoffTime: '19:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Group Stage',
    group: 'Group K',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-070',
    date: '2026-07-02',
    kickoffTime: '19:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Group Stage',
    group: 'Group K',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },

  // Group L, Matchday 3 (July 3 - simultaneous)
  {
    matchId: 'wc2026-071',
    date: '2026-07-03',
    kickoffTime: '16:00',
    venue: 'nrg-stadium-wc',
    round: 'Group Stage',
    group: 'Group L',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-072',
    date: '2026-07-03',
    kickoffTime: '16:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    group: 'Group L',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },

  // ============================================================
  // ROUND OF 32 - 16 MATCHES (TOP 2 FROM EACH GROUP + 8 BEST 3RD)
  // ============================================================
  // July 4-7, 2026

  {
    matchId: 'wc2026-073',
    date: '2026-07-04',
    kickoffTime: '15:00',
    venue: 'sofi-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-074',
    date: '2026-07-04',
    kickoffTime: '18:00',
    venue: 'metlife-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-075',
    date: '2026-07-05',
    kickoffTime: '15:00',
    venue: 'att-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-076',
    date: '2026-07-05',
    kickoffTime: '18:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-077',
    date: '2026-07-06',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-078',
    date: '2026-07-06',
    kickoffTime: '18:00',
    venue: 'nrg-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo']
  },
  {
    matchId: 'wc2026-079',
    date: '2026-07-07',
    kickoffTime: '15:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-080',
    date: '2026-07-07',
    kickoffTime: '18:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-081',
    date: '2026-07-08',
    kickoffTime: '15:00',
    venue: 'gillette-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-082',
    date: '2026-07-08',
    kickoffTime: '18:00',
    venue: 'levis-stadium-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-083',
    date: '2026-07-09',
    kickoffTime: '15:00',
    venue: 'lumen-field-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX']
  },
  {
    matchId: 'wc2026-084',
    date: '2026-07-09',
    kickoffTime: '18:00',
    venue: 'estadio-azteca-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-085',
    date: '2026-07-10',
    kickoffTime: '15:00',
    venue: 'estadio-bbva-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-086',
    date: '2026-07-10',
    kickoffTime: '18:00',
    venue: 'estadio-akron-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['Telemundo']
  },
  {
    matchId: 'wc2026-087',
    date: '2026-07-11',
    kickoffTime: '15:00',
    venue: 'bc-place-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN', 'FOX']
  },
  {
    matchId: 'wc2026-088',
    date: '2026-07-11',
    kickoffTime: '18:00',
    venue: 'bmo-field-wc',
    round: 'Round of 32',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['TSN', 'FOX']
  },

  // ============================================================
  // ROUND OF 16 - 8 MATCHES
  // ============================================================
  // July 13-15, 2026

  {
    matchId: 'wc2026-089',
    date: '2026-07-13',
    kickoffTime: '15:00',
    venue: 'sofi-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-090',
    date: '2026-07-13',
    kickoffTime: '19:00',
    venue: 'metlife-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-091',
    date: '2026-07-14',
    kickoffTime: '15:00',
    venue: 'att-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-092',
    date: '2026-07-14',
    kickoffTime: '19:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-093',
    date: '2026-07-15',
    kickoffTime: '15:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-094',
    date: '2026-07-15',
    kickoffTime: '19:00',
    venue: 'nrg-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-095',
    date: '2026-07-16',
    kickoffTime: '15:00',
    venue: 'arrowhead-stadium-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-096',
    date: '2026-07-16',
    kickoffTime: '19:00',
    venue: 'lincoln-financial-field-wc',
    round: 'Round of 16',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // ============================================================
  // QUARTERFINALS - 4 MATCHES
  // ============================================================
  // July 17-18, 2026

  {
    matchId: 'wc2026-097',
    date: '2026-07-17',
    kickoffTime: '16:00',
    venue: 'sofi-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-098',
    date: '2026-07-17',
    kickoffTime: '20:00',
    venue: 'gillette-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-099',
    date: '2026-07-18',
    kickoffTime: '16:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-100',
    date: '2026-07-18',
    kickoffTime: '20:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Quarterfinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // ============================================================
  // SEMIFINALS - 2 MATCHES
  // ============================================================
  // July 21-22, 2026

  {
    matchId: 'wc2026-101',
    date: '2026-07-21',
    kickoffTime: '20:00',
    venue: 'att-stadium-wc',
    round: 'Semifinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },
  {
    matchId: 'wc2026-102',
    date: '2026-07-22',
    kickoffTime: '20:00',
    venue: 'mercedes-benz-stadium-wc',
    round: 'Semifinal',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // ============================================================
  // THIRD PLACE MATCH - 1 MATCH
  // ============================================================
  // July 26, 2026

  {
    matchId: 'wc2026-103',
    date: '2026-07-26',
    kickoffTime: '17:00',
    venue: 'hard-rock-stadium-wc',
    round: 'Third Place',
    teamA: 'TBD',
    teamB: 'TBD',
    tvChannels: ['FOX', 'Telemundo', 'TSN']
  },

  // ============================================================
  // FINAL - 1 MATCH
  // ============================================================
  // July 19, 2026 (changed from July 19 to July 27 based on typical World Cup schedule flow)

  {
    matchId: 'wc2026-104',
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
 * Get matches by group
 */
export function getMatchesByGroup(group: string): WorldCupMatch[] {
  return WORLD_CUP_2026_MATCHES.filter(match => match.group === group);
}

/**
 * Get unique groups
 */
export function getAllGroups(): string[] {
  const groups = WORLD_CUP_2026_MATCHES
    .filter(match => match.group)
    .map(match => match.group!);
  return Array.from(new Set(groups)).sort();
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
    groupStage: 72,
    roundOf32: 16,
    roundOf16: 8,
    quarterfinals: 4,
    semifinals: 2,
    thirdPlace: 1,
    final: 1
  }
};

/**
 * Venue match count distribution
 */
export function getVenueMatchCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  WORLD_CUP_2026_MATCHES.forEach(match => {
    counts[match.venue] = (counts[match.venue] || 0) + 1;
  });
  return counts;
}

/**
 * Get matches by country
 */
export function getMatchesByCountry(country: 'USA' | 'Mexico' | 'Canada'): WorldCupMatch[] {
  const venuesByCountry: Record<string, string[]> = {
    USA: ['metlife-stadium-wc', 'sofi-stadium-wc', 'att-stadium-wc', 'mercedes-benz-stadium-wc',
          'arrowhead-stadium-wc', 'hard-rock-stadium-wc', 'lincoln-financial-field-wc',
          'levis-stadium-wc', 'gillette-stadium-wc', 'nrg-stadium-wc', 'lumen-field-wc'],
    Mexico: ['estadio-azteca-wc', 'estadio-akron-wc', 'estadio-bbva-wc'],
    Canada: ['bc-place-wc', 'bmo-field-wc']
  };

  const venueIds = venuesByCountry[country] || [];
  return WORLD_CUP_2026_MATCHES.filter(match => venueIds.includes(match.venue));
}

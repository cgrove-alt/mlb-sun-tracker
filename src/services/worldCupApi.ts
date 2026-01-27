// World Cup 2026 API Service
// Provides match data in a format compatible with the unified game selector

import { WORLD_CUP_2026_MATCHES, getMatchesByVenue } from '../data/worldcup2026/matches';
import { getWorldCupVenueById } from '../data/worldcup2026/venues';

export interface WorldCupGame {
  gameId: string;
  matchId: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  venueId: string;
  round: string;
  group?: string;
  status: 'scheduled';
  league: 'WorldCup';
}

class WorldCupApiService {
  /**
   * Get all World Cup matches for a specific venue
   */
  async getGamesForVenue(venueId: string): Promise<WorldCupGame[]> {
    // Simulate API delay for consistency with other services
    await new Promise(resolve => setTimeout(resolve, 300));

    const matches = getMatchesByVenue(venueId);

    return matches.map(match => {
      const venue = getWorldCupVenueById(match.venue);

      return {
        gameId: match.matchId,
        matchId: match.matchId,
        date: match.date,
        time: match.kickoffTime,
        homeTeam: match.teamA,
        awayTeam: match.teamB,
        venue: venue?.commonName || 'TBD',
        venueId: match.venue,
        round: match.round,
        group: match.group,
        status: 'scheduled' as const,
        league: 'WorldCup' as const
      };
    });
  }

  /**
   * Get all World Cup matches
   */
  async getAllMatches(): Promise<WorldCupGame[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return WORLD_CUP_2026_MATCHES.map(match => {
      const venue = getWorldCupVenueById(match.venue);

      return {
        gameId: match.matchId,
        matchId: match.matchId,
        date: match.date,
        time: match.kickoffTime,
        homeTeam: match.teamA,
        awayTeam: match.teamB,
        venue: venue?.commonName || 'TBD',
        venueId: match.venue,
        round: match.round,
        group: match.group,
        status: 'scheduled' as const,
        league: 'WorldCup' as const
      };
    });
  }

  /**
   * Get matches by date
   */
  async getMatchesByDate(date: string): Promise<WorldCupGame[]> {
    const allMatches = await this.getAllMatches();
    return allMatches.filter(match => match.date === date);
  }
}

export const worldCupApi = new WorldCupApiService();
export type { WorldCupApiService };

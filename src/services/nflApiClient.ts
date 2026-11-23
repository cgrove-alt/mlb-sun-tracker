// NFL API Client - Handles real NFL schedule data fetching
// Uses ESPN's public API endpoints (no authentication required)

import { createRetryableFetch, CircuitBreaker } from '../utils/retryUtils';
import { NFLGame } from './nflApi';

// ESPN team schedule types (only what we read)
interface ESPNTeamSchedule {
  events?: ESPNEvent[];
}

interface ESPNEvent {
  id: string;
  seasonType: {
    type: number;
  };
  week: {
    number: number;
  };
  competitions: ESPNCompetition[];
}

interface ESPNCompetition {
  date: string;
  /** False until the NFL sets the kickoff; the date is then a placeholder. */
  timeValid: boolean;
  neutralSite: boolean;
  venue?: {
    fullName: string;
  };
  competitors: ESPNCompetitor[];
  broadcasts?: Array<{
    media?: {
      shortName: string;
    };
  }>;
}

interface ESPNCompetitor {
  id: string;
  homeAway: 'home' | 'away';
  team: {
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
  };
}

// ESPN team ID to our venue ID mapping
const ESPN_TEAM_TO_VENUE_MAP: Record<string, string> = {
  // AFC East
  '2': 'highmark-stadium', // Buffalo Bills
  '15': 'hard-rock-stadium', // Miami Dolphins
  '17': 'gillette-stadium', // New England Patriots
  '20': 'metlife-stadium-jets', // New York Jets
  // AFC North
  '33': 'm-t-bank-stadium', // Baltimore Ravens
  '4': 'paycor-stadium', // Cincinnati Bengals
  '5': 'huntington-bank-field', // Cleveland Browns
  '23': 'acrisure-stadium', // Pittsburgh Steelers
  // AFC South
  '34': 'nrg-stadium', // Houston Texans
  '11': 'lucas-oil-stadium', // Indianapolis Colts
  '30': 'everbank-stadium', // Jacksonville Jaguars
  '10': 'nissan-stadium', // Tennessee Titans
  // AFC West
  '7': 'empower-field', // Denver Broncos
  '12': 'geha-field-arrowhead', // Kansas City Chiefs
  '13': 'allegiant-stadium', // Las Vegas Raiders
  '24': 'sofi-stadium-chargers', // Los Angeles Chargers
  // NFC East
  '6': 'at-t-stadium', // Dallas Cowboys
  '19': 'metlife-stadium-giants', // New York Giants
  '21': 'lincoln-financial-field', // Philadelphia Eagles
  '28': 'northwest-stadium', // Washington Commanders
  // NFC North
  '3': 'soldier-field', // Chicago Bears
  '8': 'ford-field', // Detroit Lions
  '9': 'lambeau-field', // Green Bay Packers
  '16': 'us-bank-stadium', // Minnesota Vikings
  // NFC South
  '1': 'mercedes-benz-stadium', // Atlanta Falcons
  '29': 'bank-of-america-stadium', // Carolina Panthers
  '18': 'caesars-superdome', // New Orleans Saints
  '27': 'raymond-james-stadium', // Tampa Bay Buccaneers
  // NFC West
  '22': 'state-farm-stadium', // Arizona Cardinals
  '14': 'sofi-stadium-rams', // Los Angeles Rams
  '25': 'levis-stadium', // San Francisco 49ers
  '26': 'lumen-field' // Seattle Seahawks
};

class NFLApiClient {
  private baseUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  private retryableFetch = createRetryableFetch({
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (error, retryCount) => {
      // Retry attempt ${retryCount} after error
    }
  });
  private circuitBreaker = new CircuitBreaker(5, 60000);
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 3600000; // 1 hour

  // Convert an ESPN event to our NFLGame format
  private convertESPNEventToNFLGame(event: ESPNEvent, venueId: string): NFLGame {
    const competition = event.competitions[0];
    const side = (homeAway: 'home' | 'away') => {
      const { id, team } = competition.competitors.find(c => c.homeAway === homeAway)!;
      return { id, name: team.shortDisplayName, abbreviation: team.abbreviation };
    };
    const homeTeam = side('home');

    return {
      gameId: event.id,
      gameDate: competition.date,
      week: event.week.number,
      seasonType: event.seasonType.type === 1 ? 'preseason' : event.seasonType.type === 3 ? 'postseason' : 'regular',
      homeTeam,
      awayTeam: side('away'),
      venue: {
        id: venueId,
        name: competition.venue?.fullName || `${homeTeam.name} Stadium`
      },
      tvNetwork: competition.broadcasts?.[0]?.media?.shortName
    };
  }

  // Get the regular-season games played at a venue, from its team's schedule.
  // A neutral-site game is played somewhere else, and one with no kickoff set
  // yet has nothing to work the shade out for.
  async fetchVenueSchedule(venueId: string, season: number): Promise<NFLGame[]> {
    const teamId = Object.keys(ESPN_TEAM_TO_VENUE_MAP).find(id => ESPN_TEAM_TO_VENUE_MAP[id] === venueId);
    if (!teamId) {
      throw new Error(`No ESPN team for venue ${venueId}`);
    }

    const cacheKey = `${teamId}-${season}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // No headers: a browser asks ESPN's permission first for any but the
    // simplest, and ESPN refuses.
    const response = await this.retryableFetch(
      `${this.baseUrl}/teams/${teamId}/schedule?season=${season}&seasontype=2`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ESPNTeamSchedule = await response.json();
    const games = (data.events ?? [])
      .filter(({ competitions: [game] }) =>
        game.timeValid &&
        !game.neutralSite &&
        game.competitors.some(c => c.homeAway === 'home' && c.id === teamId))
      .map(event => this.convertESPNEventToNFLGame(event, venueId));

    this.cache.set(cacheKey, { data: games, timestamp: Date.now() });
    return games;
  }

  // Reset circuit breaker (for testing or manual intervention)
  resetCircuitBreaker() {
    this.circuitBreaker.reset();
    // Circuit breaker reset
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    // Cache cleared
  }
}

// Export singleton instance
export const nflApiClient = new NFLApiClient();
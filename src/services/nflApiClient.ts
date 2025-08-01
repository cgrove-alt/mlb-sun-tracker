// NFL API Client - Handles real NFL schedule data fetching
// Uses ESPN's public API endpoints (no authentication required)

import { createRetryableFetch, CircuitBreaker } from '../utils/retryUtils';
import { NFLGame } from './nflApi';

// ESPN API types
interface ESPNEvent {
  id: string;
  uid: string;
  date: string; // ISO date string
  name: string;
  shortName: string;
  competitions: ESPNCompetition[];
  season: {
    year: number;
    type: number;
    slug: string;
  };
  week: {
    number: number;
  };
}

interface ESPNCompetition {
  id: string;
  date: string;
  attendance?: number;
  type: {
    id: string;
    abbreviation: string;
  };
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  venue: {
    id: string;
    fullName: string;
    address: {
      city: string;
      state: string;
    };
  };
  competitors: ESPNCompetitor[];
  broadcasts?: ESPNBroadcast[];
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
}

interface ESPNCompetitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: 'home' | 'away';
  team: {
    id: string;
    uid: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
    venue: {
      id: string;
    };
    links: Array<{
      rel: string[];
      href: string;
      text: string;
      isExternal: boolean;
      isPremium: boolean;
    }>;
    logo: string;
  };
  score?: string;
  statistics?: any[];
  records?: any[];
  linescores?: any[];
}

interface ESPNBroadcast {
  market: string;
  names: string[];
}

interface ESPNScheduleResponse {
  events: ESPNEvent[];
}

// ESPN team ID to our venue ID mapping
const ESPN_TEAM_TO_VENUE_MAP: Record<string, string> = {
  // AFC East
  '2': 'highmark-stadium', // Buffalo Bills
  '15': 'hard-rock-stadium', // Miami Dolphins
  '17': 'gillette-stadium', // New England Patriots
  '20': 'metlife-stadium-jets', // New York Jets
  // AFC North
  '33': 'mt-bank-stadium', // Baltimore Ravens
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
  private baseUrl = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl';
  private backupUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  private retryableFetch = createRetryableFetch({
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (error, retryCount) => {
      console.log(`[NFL API Client] Retry attempt ${retryCount} after error:`, error.message);
    }
  });
  private circuitBreaker = new CircuitBreaker(5, 60000);
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 3600000; // 1 hour

  // Convert ESPN event to our NFLGame format
  private convertESPNEventToNFLGame(event: ESPNEvent): NFLGame | null {
    try {
      const competition = event.competitions[0];
      if (!competition) return null;

      const homeCompetitor = competition.competitors.find(c => c.homeAway === 'home');
      const awayCompetitor = competition.competitors.find(c => c.homeAway === 'away');
      
      if (!homeCompetitor || !awayCompetitor) return null;

      // Get venue ID from our mapping
      const venueId = ESPN_TEAM_TO_VENUE_MAP[homeCompetitor.team.id];
      if (!venueId) {
        console.warn(`[NFL API Client] No venue mapping for team ${homeCompetitor.team.displayName} (${homeCompetitor.team.id})`);
        return null;
      }

      // Parse date and time
      const gameDate = new Date(competition.date);
      const localGameDate = gameDate.toISOString().split('T')[0];
      const localGameTime = gameDate.toTimeString().slice(0, 5);

      // Determine season type
      let seasonType: 'preseason' | 'regular' | 'postseason' = 'regular';
      if (event.season.type === 1) seasonType = 'preseason';
      else if (event.season.type === 3) seasonType = 'postseason';

      // Get TV network from broadcasts
      const tvNetwork = competition.broadcasts?.[0]?.names?.[0];

      return {
        gameId: event.id,
        gameDate: localGameDate,
        gameTime: localGameTime,
        week: event.week?.number || 0,
        seasonType,
        homeTeam: {
          id: homeCompetitor.team.abbreviation,
          name: homeCompetitor.team.displayName,
          abbreviation: homeCompetitor.team.abbreviation
        },
        awayTeam: {
          id: awayCompetitor.team.abbreviation,
          name: awayCompetitor.team.displayName,
          abbreviation: awayCompetitor.team.abbreviation
        },
        venue: {
          id: venueId,
          name: competition.venue.fullName
        },
        tvNetwork
      };
    } catch (error) {
      console.error('[NFL API Client] Error converting ESPN event:', error);
      return null;
    }
  }

  // Fetch season schedule from ESPN
  async fetchSeasonSchedule(season: number): Promise<NFLGame[]> {
    const cacheKey = `espn-season-${season}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`[NFL API Client] Returning cached data for ${season} season`);
      return cached.data;
    }

    try {
      // Try primary endpoint first
      const url = `${this.baseUrl}/seasons/${season}/types/2/events?limit=1000`;
      console.log(`[NFL API Client] Fetching ${season} season from: ${url}`);
      
      const response = await this.circuitBreaker.execute(() => 
        this.retryableFetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MLB-Sun-Tracker/1.0'
          }
        })
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ESPNScheduleResponse = await response.json();
      
      if (!data.events || !Array.isArray(data.events)) {
        throw new Error('Invalid response format from ESPN API');
      }

      // Convert ESPN events to our format
      const games = data.events
        .map(event => this.convertESPNEventToNFLGame(event))
        .filter((game): game is NFLGame => game !== null);

      console.log(`[NFL API Client] Successfully fetched ${games.length} games for ${season} season`);
      
      // Cache the results
      this.cache.set(cacheKey, { data: games, timestamp: Date.now() });
      
      return games;
    } catch (error) {
      console.error(`[NFL API Client] Error fetching ${season} season:`, error);
      
      // Try backup endpoint for current week
      if (error instanceof Error && error.message.includes('Circuit breaker is open')) {
        throw error; // Don't retry if circuit breaker is open
      }
      
      return this.fetchCurrentWeekSchedule(season);
    }
  }

  // Fetch current week schedule from backup endpoint
  private async fetchCurrentWeekSchedule(season: number): Promise<NFLGame[]> {
    try {
      const url = `${this.backupUrl}/scoreboard?seasontype=2&limit=100`;
      console.log(`[NFL API Client] Trying backup endpoint: ${url}`);
      
      const response = await this.retryableFetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MLB-Sun-Tracker/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Backup endpoint failed with HTTP ${response.status}`);
      }

      const data: ESPNScheduleResponse = await response.json();
      
      if (!data.events || !Array.isArray(data.events)) {
        throw new Error('Invalid response format from backup ESPN API');
      }

      // Convert ESPN events to our format
      const games = data.events
        .map((event: ESPNEvent) => this.convertESPNEventToNFLGame(event))
        .filter((game): game is NFLGame => game !== null);

      console.log(`[NFL API Client] Backup endpoint returned ${games.length} games`);
      return games;
    } catch (error) {
      console.error('[NFL API Client] Backup endpoint also failed:', error);
      throw error;
    }
  }

  // Get games for a specific venue
  async fetchVenueSchedule(venueId: string, season: number): Promise<NFLGame[]> {
    const allGames = await this.fetchSeasonSchedule(season);
    return allGames.filter(game => game.venue.id === venueId);
  }

  // Reset circuit breaker (for testing or manual intervention)
  resetCircuitBreaker() {
    this.circuitBreaker.reset();
    console.log('[NFL API Client] Circuit breaker reset');
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('[NFL API Client] Cache cleared');
  }
}

export const nflApiClient = new NFLApiClient();
// NFL API Client - Handles real NFL schedule data fetching
// Uses ESPN's public API endpoints (no authentication required)

import { createRetryableFetch, CircuitBreaker } from '../utils/retryUtils';
import { NFLGame } from './nflApi';

// ESPN Scoreboard API types
interface ESPNScoreboardResponse {
  events: ESPNEvent[];
  week?: {
    number: number;
  };
  season?: {
    year: number;
    type: number;
  };
}

interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  season: {
    year: number;
    type: number;
  };
  week: {
    number: number;
  };
  competitions: ESPNCompetition[];
}

interface ESPNCompetition {
  id: string;
  date: string;
  venue?: {
    id: string;
    fullName: string;
  };
  competitors: ESPNCompetitor[];
  broadcasts?: Array<{
    names: string[];
  }>;
}

interface ESPNCompetitor {
  id: string;
  homeAway: 'home' | 'away';
  team: {
    id: string;
    location: string;
    name: string;
    displayName: string;
    abbreviation: string;
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
  private backupUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
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

  // Convert ESPN event to our NFLGame format
  private convertESPNEventToNFLGame(event: ESPNEvent): NFLGame | null {
    try {
      const competition = event.competitions[0];
      if (!competition) return null;

      const homeCompetitor = competition.competitors.find(c => c.homeAway === 'home');
      const awayCompetitor = competition.competitors.find(c => c.homeAway === 'away');
      
      if (!homeCompetitor || !awayCompetitor) return null;

      // Get venue ID from our mapping
      const venueId = ESPN_TEAM_TO_VENUE_MAP[homeCompetitor.id];
      if (!venueId) {
        console.warn(`[NFL API Client] No venue mapping for team ${homeCompetitor.team.displayName} (${homeCompetitor.id})`);
        return null;
      }

      // Parse date and time
      const gameDate = new Date(competition.date);
      const localGameDate = gameDate.toISOString().split('T')[0];
      const hours = gameDate.getHours().toString().padStart(2, '0');
      const minutes = gameDate.getMinutes().toString().padStart(2, '0');
      const localGameTime = `${hours}:${minutes}`;

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
        week: event.week.number,
        seasonType,
        homeTeam: {
          id: homeCompetitor.id,
          name: homeCompetitor.team.name,
          abbreviation: homeCompetitor.team.abbreviation
        },
        awayTeam: {
          id: awayCompetitor.id,
          name: awayCompetitor.team.name,
          abbreviation: awayCompetitor.team.abbreviation
        },
        venue: {
          id: venueId,
          name: competition.venue?.fullName || homeCompetitor.team.displayName + ' Stadium'
        },
        tvNetwork
      };
    } catch (error) {
      console.error('[NFL API Client] Error converting ESPN event:', error);
      return null;
    }
  }

  // Fetch games for a specific week
  private async fetchWeekGames(season: number, week: number): Promise<NFLGame[]> {
    try {
      const url = `${this.backupUrl}/scoreboard?seasontype=2&week=${week}&season=${season}`;
      
      const response = await this.retryableFetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; MLB-Sun-Tracker/1.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ESPNScoreboardResponse = await response.json();
      
      if (!data.events || !Array.isArray(data.events)) {
        return []; // No games for this week
      }

      // Convert ESPN events to our format
      const games = data.events
        .map(event => this.convertESPNEventToNFLGame(event))
        .filter((game): game is NFLGame => game !== null);

      return games;
    } catch (error) {
      console.error(`[NFL API Client] Error fetching week ${week}:`, error);
      return []; // Return empty array for failed weeks
    }
  }

  // Fetch all games for a season
  async fetchSeasonSchedule(season: number): Promise<NFLGame[]> {
    const cacheKey = `season-${season}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      // Returning cached data for ${season} season
      return cached.data;
    }

    try {
      const allGames: NFLGame[] = [];
      
      // For current/future seasons, only fetch a few weeks ahead
      const currentDate = new Date();
      const currentWeek = this.getCurrentNFLWeek(currentDate, season);
      const maxWeek = Math.min(currentWeek + 8, 18); // Fetch up to 8 weeks ahead or week 18
      
      // Fetching weeks 1-${maxWeek} for ${season} season
      
      // Fetch games for each week
      for (let week = 1; week <= maxWeek; week++) {
        const weekGames = await this.fetchWeekGames(season, week);
        if (weekGames.length > 0) {
          allGames.push(...weekGames);
          // Week ${week}: ${weekGames.length} games
        }
      }

      if (allGames.length === 0) {
        throw new Error('No games found for the season');
      }

      // Total: ${allGames.length} games for ${season} season
      
      // Cache the results
      this.cache.set(cacheKey, { data: allGames, timestamp: Date.now() });
      
      return allGames;
    } catch (error) {
      console.error(`[NFL API Client] Error fetching ${season} season:`, error);
      throw error;
    }
  }

  // Get current NFL week based on date
  private getCurrentNFLWeek(date: Date, season: number): number {
    // NFL season typically starts in early September
    const seasonStart = new Date(season, 8, 1); // September 1st
    const weeksSinceStart = Math.floor((date.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(weeksSinceStart + 1, 18));
  }

  // Get games for a specific venue
  async fetchVenueSchedule(venueId: string, season: number): Promise<NFLGame[]> {
    const allGames = await this.fetchSeasonSchedule(season);
    return allGames.filter(game => game.venue.id === venueId);
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
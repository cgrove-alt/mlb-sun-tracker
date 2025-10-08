// NFL API Service
// Uses real NFL schedule data from ESPN API

import { nflApiClient } from './nflApiClient';

export interface NFLGame {
  gameId: string;
  gameDate: string; // ISO date string
  gameTime: string; // Local time HH:MM
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  homeTeam: {
    id: string;
    name: string;
    abbreviation: string;
  };
  awayTeam: {
    id: string;
    name: string;
    abbreviation: string;
  };
  venue: {
    id: string;
    name: string;
  };
  tvNetwork?: string;
  weather?: {
    temperature?: number;
    condition?: string;
    windSpeed?: number;
  };
}

export interface NFLTeam {
  id: string;
  name: string;
  abbreviation: string;
  conference: 'AFC' | 'NFC';
  division: 'East' | 'North' | 'South' | 'West';
}

export interface NFLSchedule {
  season: number;
  week?: number;
  games: NFLGame[];
}

// Team to stadium mapping for proper venue association
const TEAM_STADIUM_MAP: Record<string, string> = {
  'Buffalo Bills': 'highmark-stadium',
  'Miami Dolphins': 'hard-rock-stadium',
  'New England Patriots': 'gillette-stadium',
  'New York Jets': 'metlife-stadium-jets',
  'Baltimore Ravens': 'mt-bank-stadium',
  'Cincinnati Bengals': 'paycor-stadium',
  'Cleveland Browns': 'huntington-bank-field',
  'Pittsburgh Steelers': 'acrisure-stadium',
  'Houston Texans': 'nrg-stadium',
  'Indianapolis Colts': 'lucas-oil-stadium',
  'Jacksonville Jaguars': 'everbank-stadium',
  'Tennessee Titans': 'nissan-stadium',
  'Denver Broncos': 'empower-field',
  'Kansas City Chiefs': 'geha-field-arrowhead',
  'Las Vegas Raiders': 'allegiant-stadium',
  'Los Angeles Chargers': 'sofi-stadium-chargers',
  'Dallas Cowboys': 'at-t-stadium',
  'New York Giants': 'metlife-stadium-giants',
  'Philadelphia Eagles': 'lincoln-financial-field',
  'Washington Commanders': 'northwest-stadium',
  'Chicago Bears': 'soldier-field',
  'Detroit Lions': 'ford-field',
  'Green Bay Packers': 'lambeau-field',
  'Minnesota Vikings': 'us-bank-stadium',
  'Atlanta Falcons': 'mercedes-benz-stadium',
  'Carolina Panthers': 'bank-of-america-stadium',
  'New Orleans Saints': 'caesars-superdome',
  'Tampa Bay Buccaneers': 'raymond-james-stadium',
  'Arizona Cardinals': 'state-farm-stadium',
  'Los Angeles Rams': 'sofi-stadium-rams',
  'San Francisco 49ers': 'levis-stadium',
  'Seattle Seahawks': 'lumen-field'
};

class NFLApiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 3600000; // 1 hour cache

  // Get current season based on date
  private getCurrentSeason(): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // NFL season runs from September to February
    // If we're in Jan-Feb, we're still in last year's season
    // If we're in Mar-Aug, show the previous season (since new season isn't available yet)
    // If we're in Sep-Dec, we're in the current season
    if (currentMonth < 2) { // January or February
      return currentYear - 1;
    } else if (currentMonth < 8) { // March through August
      // During offseason, show previous season's games
      return currentYear - 1;
    }
    return currentYear;
  }

  // Get full season schedule
  async getSeasonSchedule(season?: number): Promise<NFLSchedule> {
    const targetSeason = season || this.getCurrentSeason();
    const cacheKey = `season-${targetSeason}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    let games: NFLGame[] = [];

    // Try to fetch real data
    try {
      // Fetching real data for ${targetSeason} season
      games = await nflApiClient.fetchSeasonSchedule(targetSeason);
      
      if (games.length === 0) {
        // No real data available for ${targetSeason} season
        throw new Error('No NFL schedule data available');
      }
    } catch (error) {
      console.error(`[NFL API] Error fetching real data:`, error);
      throw new Error('NFL schedule data is currently unavailable');
    }

    const schedule = {
      season: targetSeason,
      games
    };
    
    this.cache.set(cacheKey, { data: schedule, timestamp: Date.now() });

    return schedule;
  }

  // Get games for a specific team
  async getTeamSchedule(teamName: string, season?: number): Promise<NFLGame[]> {
    const schedule = await this.getSeasonSchedule(season);
    return schedule.games.filter(game => 
      game.homeTeam.name === teamName || game.awayTeam.name === teamName
    );
  }

  // Get games for a specific venue (only home games)
  async getVenueSchedule(venueId: string, season?: number): Promise<NFLGame[]> {
    const targetSeason = season || this.getCurrentSeason();
    
    // Try to get real data
    try {

      const games = await nflApiClient.fetchVenueSchedule(venueId, targetSeason);
      
      if (games.length > 0) {

        return games;
      }
      
      // If no games found for specific venue, try getting from full schedule
      const schedule = await this.getSeasonSchedule(targetSeason);
      const venueGames = schedule.games.filter(game => 
        game.venue.id === venueId
      );
      
      if (venueGames.length === 0) {
        throw new Error('No games found for this venue');
      }
      
      return venueGames;
    } catch (error) {
      console.error(`[NFL API] Error fetching venue data:`, error);
      throw new Error('NFL schedule data is currently unavailable');
    }
  }

  // Get games for a specific week
  async getWeekSchedule(week: number, season?: number): Promise<NFLGame[]> {
    const schedule = await this.getSeasonSchedule(season);
    return schedule.games.filter(game => game.week === week);
  }

  // Get upcoming games for a venue
  async getUpcomingVenueGames(venueId: string): Promise<NFLGame[]> {
    // First try current season
    let allGames = await this.getVenueSchedule(venueId);
    const today = new Date();
    
    let upcomingGames = allGames
      .filter(game => new Date(game.gameDate) >= today)
      .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());

    // If no upcoming games in current season, try next season
    if (upcomingGames.length === 0) {
      const nextSeason = this.getCurrentSeason() + 1;
      allGames = await this.getVenueSchedule(venueId, nextSeason);
      upcomingGames = allGames
        .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
    }

    // Return up to 8 games
    return upcomingGames.slice(0, 8);
  }

  // Convert game time to full datetime
  getGameDateTime(game: NFLGame): Date {
    const [hours, minutes] = game.gameTime.split(':').map(Number);
    const gameDate = new Date(game.gameDate);
    gameDate.setHours(hours, minutes, 0, 0);
    return gameDate;
  }

  // Get typical game times for NFL
  getTypicalGameTimes(): string[] {
    return ['13:00', '16:05', '16:25', '20:15', '20:20']; // 1PM, 4:05PM, 4:25PM, 8:15PM, 8:20PM ET
  }

  // Helper to get venue ID for a team
  getVenueIdForTeam(teamName: string): string | null {
    return TEAM_STADIUM_MAP[teamName] || null;
  }
}

export const nflApi = new NFLApiService();
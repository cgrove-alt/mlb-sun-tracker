// NFL API Service
// Fetches NFL game schedules and data

import { NFL_2025_SCHEDULE } from '../data/nfl2025Schedule';

export interface NFLGame {
  gameId: string;
  gameDate: string; // ISO date string
  gameTime: string; // Local time
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

export interface NFLSchedule {
  season: number;
  games: NFLGame[];
}

// NFL API now uses the comprehensive schedule imported from nfl2025Schedule.ts

class NFLApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 15 * 60 * 1000; // 15 minutes

  // Get schedule for a specific team
  async getTeamSchedule(teamId: string, season: number = 2025): Promise<NFLGame[]> {
    const cacheKey = `schedule-${teamId}-${season}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Filter games for the specific team from comprehensive schedule
    const teamGames = NFL_2025_SCHEDULE.filter(game => 
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );

    this.cache.set(cacheKey, { data: teamGames, timestamp: Date.now() });
    return teamGames;
  }

  // Get all games for a specific venue
  async getVenueSchedule(venueId: string, season: number = 2025): Promise<NFLGame[]> {
    const cacheKey = `venue-${venueId}-${season}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Filter games for the specific venue from comprehensive schedule
    const venueGames = NFL_2025_SCHEDULE.filter(game => 
      game.venue.id === venueId
    );

    this.cache.set(cacheKey, { data: venueGames, timestamp: Date.now() });
    return venueGames;
  }

  // Get games for a specific week
  async getWeekSchedule(week: number, season: number = 2025): Promise<NFLGame[]> {
    const cacheKey = `week-${week}-${season}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const weekGames = NFL_2025_SCHEDULE.filter(game => game.week === week);
    
    this.cache.set(cacheKey, { data: weekGames, timestamp: Date.now() });
    return weekGames;
  }

  // Get upcoming games for a venue (next 8 weeks)
  async getUpcomingVenueGames(venueId: string): Promise<NFLGame[]> {
    const allGames = await this.getVenueSchedule(venueId);
    const today = new Date();
    
    return allGames
      .filter(game => new Date(game.gameDate) >= today)
      .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())
      .slice(0, 8); // Return next 8 home games
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

  // Get all games for the entire season
  async getAllGames(season: number = 2025): Promise<NFLGame[]> {
    return NFL_2025_SCHEDULE;
  }

  // Get games by network
  async getGamesByNetwork(network: string): Promise<NFLGame[]> {
    return NFL_2025_SCHEDULE.filter(game => 
      game.tvNetwork?.toLowerCase().includes(network.toLowerCase())
    );
  }

  // Get primetime games (TNF, SNF, MNF)
  async getPrimetimeGames(): Promise<NFLGame[]> {
    return NFL_2025_SCHEDULE.filter(game => 
      ['NBC', 'ESPN', 'Prime Video'].includes(game.tvNetwork || '')
    );
  }

  // Get games by time slot
  async getGamesByTimeSlot(timeSlot: 'early' | 'afternoon' | 'night'): Promise<NFLGame[]> {
    const timeMapping = {
      'early': ['13:00'],
      'afternoon': ['16:05', '16:25'], 
      'night': ['20:15', '20:20']
    };

    const times = timeMapping[timeSlot];
    return NFL_2025_SCHEDULE.filter(game => 
      times.includes(game.gameTime)
    );
  }

  // Get games in date range
  async getGamesInDateRange(startDate: string, endDate: string): Promise<NFLGame[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return NFL_2025_SCHEDULE.filter(game => {
      const gameDate = new Date(game.gameDate);
      return gameDate >= start && gameDate <= end;
    });
  }

  // Get stadium utilization stats
  getStadiumStats(): Record<string, { games: number; venues: string[] }> {
    const stats: Record<string, { games: number; venues: string[] }> = {};
    
    NFL_2025_SCHEDULE.forEach(game => {
      const venueId = game.venue.id;
      if (!stats[venueId]) {
        stats[venueId] = { games: 0, venues: [] };
      }
      stats[venueId].games++;
      if (!stats[venueId].venues.includes(game.venue.name)) {
        stats[venueId].venues.push(game.venue.name);
      }
    });

    return stats;
  }
}

export const nflApi = new NFLApiService();

// Team ID mapping for reference
export const NFL_TEAM_IDS: Record<string, string> = {
  // AFC East
  'Buffalo Bills': 'buf',
  'Miami Dolphins': 'mia',
  'New England Patriots': 'ne',
  'New York Jets': 'nyj',
  
  // AFC North
  'Baltimore Ravens': 'bal',
  'Cincinnati Bengals': 'cin',
  'Cleveland Browns': 'cle',
  'Pittsburgh Steelers': 'pit',
  
  // AFC South
  'Houston Texans': 'hou',
  'Indianapolis Colts': 'ind',
  'Jacksonville Jaguars': 'jax',
  'Tennessee Titans': 'ten',
  
  // AFC West
  'Denver Broncos': 'den',
  'Kansas City Chiefs': 'kc',
  'Las Vegas Raiders': 'lv',
  'Los Angeles Chargers': 'lac',
  
  // NFC East
  'Dallas Cowboys': 'dal',
  'New York Giants': 'nyg',
  'Philadelphia Eagles': 'phi',
  'Washington Commanders': 'was',
  
  // NFC North
  'Chicago Bears': 'chi',
  'Detroit Lions': 'det',
  'Green Bay Packers': 'gb',
  'Minnesota Vikings': 'min',
  
  // NFC South
  'Atlanta Falcons': 'atl',
  'Carolina Panthers': 'car',
  'New Orleans Saints': 'no',
  'Tampa Bay Buccaneers': 'tb',
  
  // NFC West
  'Arizona Cardinals': 'az',
  'Los Angeles Rams': 'lar',
  'San Francisco 49ers': 'sf',
  'Seattle Seahawks': 'sea'
};
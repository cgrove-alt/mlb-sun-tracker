// NFL API Service
// Fetches real NFL game schedules when available
// Note: NFL typically releases schedules in May for the upcoming season

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
  private apiBaseUrl = 'https://api.nfl.com/v1'; // This would be the real API endpoint
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 3600000; // 1 hour cache

  // Check if schedule data is available
  async isScheduleAvailable(season: number = 2025): Promise<boolean> {
    // NFL schedules are typically released in May
    // For 2025 season, check if we're past May 2025
    const scheduleReleaseDate = new Date(2025, 4, 1); // May 1, 2025
    const now = new Date();
    return now >= scheduleReleaseDate;
  }

  // Get full season schedule from API
  async getSeasonSchedule(season: number = 2025): Promise<NFLSchedule> {
    const scheduleAvailable = await this.isScheduleAvailable(season);
    
    if (!scheduleAvailable) {
      return {
        season,
        games: []
      };
    }

    // In production, this would fetch from the real NFL API
    // For now, return empty as no real 2025 data exists yet
    console.log(`[NFL API] 2025 schedule not yet available. Check back after May 2025.`);
    return {
      season,
      games: []
    };
  }

  // Get games for a specific team
  async getTeamSchedule(teamName: string, season: number = 2025): Promise<NFLGame[]> {
    const schedule = await this.getSeasonSchedule(season);
    return schedule.games.filter(game => 
      game.homeTeam.name === teamName || game.awayTeam.name === teamName
    );
  }

  // Get games for a specific venue (only home games)
  async getVenueSchedule(venueId: string, season: number = 2025): Promise<NFLGame[]> {
    const cacheKey = `venue-${venueId}-${season}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const schedule = await this.getSeasonSchedule(season);
    
    // Filter games for the specific venue
    const venueGames = schedule.games.filter(game => 
      game.venue.id === venueId
    );

    this.cache.set(cacheKey, { data: venueGames, timestamp: Date.now() });
    return venueGames;
  }

  // Get games for a specific week
  async getWeekSchedule(week: number, season: number = 2025): Promise<NFLGame[]> {
    const schedule = await this.getSeasonSchedule(season);
    return schedule.games.filter(game => game.week === week);
  }

  // Get upcoming games for a venue
  async getUpcomingVenueGames(venueId: string): Promise<NFLGame[]> {
    const scheduleAvailable = await this.isScheduleAvailable();
    
    if (!scheduleAvailable) {
      console.log('[NFL API] 2025 NFL schedule will be available in May 2025');
      return [];
    }

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

  // Helper to get venue ID for a team
  getVenueIdForTeam(teamName: string): string | null {
    return TEAM_STADIUM_MAP[teamName] || null;
  }
}

export const nflApi = new NFLApiService();
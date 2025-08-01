// NFL API Service
// Fetches NFL game schedules and data

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

// Mock 2025 NFL Schedule - Early season games for each team
// In production, this would fetch from ESPN or NFL API
const MOCK_2025_SCHEDULE: NFLGame[] = [
  // Week 1 - September 7-9, 2025
  {
    gameId: 'nfl-2025-w1-buf-mia',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-gb-chi',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-lar-sea',
    gameDate: '2025-09-07',
    gameTime: '16:25',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-lac-kc',
    gameDate: '2025-09-07',
    gameTime: '20:20',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'lac', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w1-dal-nyg',
    gameDate: '2025-09-08',
    gameTime: '20:15',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'dal', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'nyg', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'ESPN'
  },
  
  // Week 2 - September 14-16, 2025
  {
    gameId: 'nfl-2025-w2-mia-ne',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-chi-gb',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-tb-det',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'det', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-az-lar',
    gameDate: '2025-09-14',
    gameTime: '16:05',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'az', name: 'Arizona Cardinals', abbreviation: 'AZ' },
    awayTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-sf-sea',
    gameDate: '2025-09-14',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-den-kc',
    gameDate: '2025-09-14',
    gameTime: '20:20',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'den', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'NBC'
  },
  
  // Week 3 - September 21-23, 2025
  {
    gameId: 'nfl-2025-w3-buf-mia',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-lv-den',
    gameDate: '2025-09-21',
    gameTime: '16:05',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'lv', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'den', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-sea-ne',
    gameDate: '2025-09-21',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  
  // Thursday Night Football
  {
    gameId: 'nfl-2025-w3-nyj-ne',
    gameDate: '2025-09-18',
    gameTime: '20:15',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'nyj', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'metlife-stadium', name: 'MetLife Stadium' },
    tvNetwork: 'Prime Video'
  },
  
  // Week 4 - September 28-30, 2025
  {
    gameId: 'nfl-2025-w4-jax-hou',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'jax', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'hou', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'tiaa-bank-field', name: 'TIAA Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-car-atl',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'car', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'atl', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w4-phi-tb',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'phi', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w4-kc-lac',
    gameDate: '2025-09-28',
    gameTime: '16:25',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'lac', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'arrowhead-stadium', name: 'Arrowhead Stadium' },
    tvNetwork: 'CBS'
  }
];

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

    // Filter games for the specific team
    const teamGames = MOCK_2025_SCHEDULE.filter(game => 
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

    // Filter games for the specific venue
    const venueGames = MOCK_2025_SCHEDULE.filter(game => 
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

    const weekGames = MOCK_2025_SCHEDULE.filter(game => game.week === week);
    
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
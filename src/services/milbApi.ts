// MiLB API Service
// Handles fetching Minor League Baseball schedules and game data

export interface MiLBTeam {
  id: number;
  name: string;
  abbreviation: string;
  parentOrgName: string; // MLB parent organization
  league: {
    id: number;
    name: string;
    abbreviation: string;
    sport: {
      id: number;
      name: string;
    };
  };
  venue: {
    id: number;
    name: string;
    city: string;
    state: string;
    stateAbbrev: string;
    latitude?: number;
    longitude?: number;
    timezone?: {
      id: string;
      offset: number;
    };
  };
}

export interface MiLBGame {
  gamePk: number;
  gameDate: string;
  status: {
    abstractGameState: 'Preview' | 'Live' | 'Final';
    codedGameState: string;
    detailedState: string;
  };
  teams: {
    away: {
      team: {
        id: number;
        name: string;
      };
      score?: number;
    };
    home: {
      team: {
        id: number;
        name: string;
      };
      score?: number;
    };
  };
  venue: {
    id: number;
    name: string;
  };
}

export interface MiLBSchedule {
  dates: Array<{
    date: string;
    games: MiLBGame[];
  }>;
}

// MiLB levels with their sport IDs in the MLB Stats API
export const MILB_LEVELS = {
  AAA: { id: 11, name: 'Triple-A', abbreviation: 'AAA' },
  AA: { id: 12, name: 'Double-A', abbreviation: 'AA' },
  HIGH_A: { id: 13, name: 'High-A', abbreviation: 'A+' },
  LOW_A: { id: 14, name: 'Single-A', abbreviation: 'A' },
  ROOKIE: { id: 16, name: 'Rookie', abbreviation: 'R' },
  // Complex leagues
  COMPLEX_AZL: { id: 17, name: 'Arizona Complex League', abbreviation: 'ACL' },
  COMPLEX_FCL: { id: 18, name: 'Florida Complex League', abbreviation: 'FCL' },
} as const;

export type MiLBLevel = keyof typeof MILB_LEVELS;

class MiLBApiService {
  private baseUrl = 'https://statsapi.mlb.com/api/v1';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(url, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('MiLB API error:', error);
      throw error;
    }
  }

  // Get all teams for a specific MiLB level
  async getTeamsByLevel(level: MiLBLevel): Promise<MiLBTeam[]> {
    const sportId = MILB_LEVELS[level].id;
    const season = new Date().getFullYear();
    
    const url = `${this.baseUrl}/teams?sportId=${sportId}&season=${season}`;
    const response = await this.fetchWithCache<{ teams: MiLBTeam[] }>(url);
    
    // Filter to only active teams with venues
    return response.teams.filter(team => 
      team.venue && 
      team.venue.latitude && 
      team.venue.longitude
    );
  }

  // Get all MiLB teams across all levels
  async getAllMiLBTeams(): Promise<Map<MiLBLevel, MiLBTeam[]>> {
    const teamsByLevel = new Map<MiLBLevel, MiLBTeam[]>();
    
    // Fetch teams for each level in parallel
    const promises = Object.keys(MILB_LEVELS).map(async (level) => {
      const teams = await this.getTeamsByLevel(level as MiLBLevel);
      return { level: level as MiLBLevel, teams };
    });
    
    const results = await Promise.all(promises);
    results.forEach(({ level, teams }) => {
      teamsByLevel.set(level, teams);
    });
    
    return teamsByLevel;
  }

  // Get schedule for a specific team
  async getTeamSchedule(
    teamId: number,
    startDate: string,
    endDate: string
  ): Promise<MiLBSchedule> {
    const url = `${this.baseUrl}/schedule?teamId=${teamId}&startDate=${startDate}&endDate=${endDate}&sportId=11,12,13,14,16,17,18`;
    return this.fetchWithCache<MiLBSchedule>(url);
  }

  // Get home games for a specific venue
  getHomeGamesForVenue(venueId: number, schedule: MiLBSchedule): MiLBGame[] {
    const games: MiLBGame[] = [];
    
    schedule.dates.forEach(date => {
      date.games.forEach(game => {
        if (game.venue.id === venueId && 
            game.status.abstractGameState === 'Preview') {
          games.push(game);
        }
      });
    });
    
    return games.sort((a, b) => 
      new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime()
    );
  }

  // Get venue details by ID
  async getVenueDetails(venueId: number): Promise<any> {
    const url = `${this.baseUrl}/venues/${venueId}`;
    return this.fetchWithCache(url);
  }

  // Convert MiLB game to format compatible with existing system
  convertToUnifiedGame(game: MiLBGame): any {
    return {
      gamePk: game.gamePk,
      gameDate: game.gameDate,
      teams: game.teams,
      venue: game.venue,
      // Additional fields for compatibility
      gameType: 'R', // Regular season
      season: new Date(game.gameDate).getFullYear(),
      dayNight: this.determineDayNight(game.gameDate),
    };
  }

  private determineDayNight(gameDate: string): 'day' | 'night' {
    const date = new Date(gameDate);
    const hour = date.getHours();
    return hour < 17 ? 'day' : 'night';
  }
}

export const milbApi = new MiLBApiService();
import { withCache } from '../utils/apiCache';
import { withRetry, createRetryableFetch } from '../utils/retryUtils';

export interface MLBGame {
  gamePk: number;
  gameDate: string;
  status: {
    statusCode: string;
    detailedState: string;
  };
  teams: {
    away: {
      team: {
        id: number;
        name: string;
      };
    };
    home: {
      team: {
        id: number;
        name: string;
      };
    };
  };
  venue: {
    id: number;
    name: string;
  };
  gameType: string;
  scheduledInnings: number;
}

export interface MLBScheduleResponse {
  dates: Array<{
    date: string;
    games: MLBGame[];
  }>;
}

// Map MLB team IDs to our stadium IDs
const MLB_TEAM_TO_STADIUM_MAP: Record<number, string> = {
  108: 'angels', // Los Angeles Angels
  117: 'astros', // Houston Astros
  133: 'athletics', // Oakland Athletics
  141: 'bluejays', // Toronto Blue Jays
  144: 'braves', // Atlanta Braves
  158: 'brewers', // Milwaukee Brewers
  138: 'cardinals', // St. Louis Cardinals
  112: 'cubs', // Chicago Cubs
  109: 'diamondbacks', // Arizona Diamondbacks
  119: 'dodgers', // Los Angeles Dodgers
  137: 'giants', // San Francisco Giants
  114: 'guardians', // Cleveland Guardians
  136: 'mariners', // Seattle Mariners
  146: 'marlins', // Miami Marlins
  121: 'mets', // New York Mets
  120: 'nationals', // Washington Nationals
  110: 'orioles', // Baltimore Orioles
  135: 'padres', // San Diego Padres
  143: 'phillies', // Philadelphia Phillies
  134: 'pirates', // Pittsburgh Pirates
  140: 'rangers', // Texas Rangers
  139: 'rays', // Tampa Bay Rays
  111: 'redsox', // Boston Red Sox
  113: 'reds', // Cincinnati Reds
  115: 'rockies', // Colorado Rockies
  118: 'royals', // Kansas City Royals
  116: 'tigers', // Detroit Tigers
  142: 'twins', // Minnesota Twins
  145: 'whitesox', // Chicago White Sox
  147: 'yankees', // New York Yankees
};

export class MLBApiService {
  private baseUrl = 'https://statsapi.mlb.com/api/v1';
  private retryableFetch = createRetryableFetch({
    maxRetries: 3,
    initialDelay: 500,
    onRetry: (error, retryCount) => {
      console.log(`MLB API retry attempt ${retryCount} after error:`, error.message);
    }
  });

  getSchedule = withCache(
    async (startDate?: string, endDate?: string): Promise<MLBGame[]> => {
    const today = new Date();
    const defaultStart = startDate || today.toISOString().split('T')[0];
    const defaultEnd = endDate || new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const url = `${this.baseUrl}/schedule/games/?sportId=1&startDate=${defaultStart}&endDate=${defaultEnd}`;
    
    try {
      console.log('Fetching MLB schedule from:', url);
      const response = await this.retryableFetch(url);
      if (!response.ok) {
        console.error(`MLB API request failed with status: ${response.status}`);
        throw new Error(`MLB API request failed: ${response.status}`);
      }
      
      const data: MLBScheduleResponse = await response.json();
      
      // Check if we have valid data
      if (!data || !data.dates) {
        console.error('Invalid response from MLB API:', data);
        throw new Error('Invalid API response structure');
      }
      
      // Flatten the schedule data
      const games: MLBGame[] = [];
      data.dates.forEach(dateEntry => {
        if (dateEntry.games && Array.isArray(dateEntry.games)) {
          games.push(...dateEntry.games);
        }
      });
      
      console.log(`MLB API returned ${games.length} total games`);
      return games;
    } catch (error) {
      console.error('Error fetching MLB schedule:', error);
      console.error('URL attempted:', url);
      console.error('Start date:', defaultStart, 'End date:', defaultEnd);
      throw error; // Propagate the error instead of returning mock data
    }
    },
    'mlb-schedule',
    30 * 60 * 1000 // Cache for 30 minutes
  );

  async getTeamSchedule(teamId: number, startDate?: string, endDate?: string): Promise<MLBGame[]> {
    try {
      const today = new Date();
      const defaultStart = startDate || today.toISOString().split('T')[0];
      const defaultEnd = endDate || new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const url = `${this.baseUrl}/schedule/games/?sportId=1&teamId=${teamId}&startDate=${defaultStart}&endDate=${defaultEnd}`;
      
      const response = await this.retryableFetch(url);
      if (!response.ok) {
        throw new Error(`MLB API request failed: ${response.status}`);
      }
      
      const data: MLBScheduleResponse = await response.json();
      
      const games: MLBGame[] = [];
      data.dates.forEach(dateEntry => {
        games.push(...dateEntry.games);
      });
      
      return games;
    } catch (error) {
      console.error('Error fetching team schedule:', error);
      return [];
    }
  }

  getStadiumIdFromTeamId(teamId: number): string | null {
    return MLB_TEAM_TO_STADIUM_MAP[teamId] || null;
  }

  getHomeGamesForStadium(stadiumId: string, games: MLBGame[]): MLBGame[] {
    const teamId = Object.entries(MLB_TEAM_TO_STADIUM_MAP)
      .find(([_, stadium]) => stadium === stadiumId)?.[0];
    
    if (!teamId) {
      console.error(`No team ID found for stadium: ${stadiumId}`);
      return [];
    }
    
    console.log(`Filtering games for stadium ${stadiumId}, team ID ${teamId}`);
    console.log(`Total games before filtering: ${games.length}`);
    
    const homeGames = games.filter(game => {
      const isHomeGame = game.teams.home.team.id === parseInt(teamId);
      const isNotFinished = game.status.statusCode !== 'F';
      const isNotCancelled = game.status.statusCode !== 'C';
      // For now, include all game types to ensure we show games
      const isValidGameType = true;
      
      if (isHomeGame) {
        console.log(`Home game found: ${game.teams.away.team.name} @ ${game.teams.home.team.name}, status: ${game.status.statusCode}, type: ${game.gameType}`);
      }
      
      return isHomeGame && isNotFinished && isNotCancelled && isValidGameType;
    });
    
    console.log(`Home games found: ${homeGames.length}`);
    return homeGames;
  }
}

export const mlbApi = new MLBApiService();
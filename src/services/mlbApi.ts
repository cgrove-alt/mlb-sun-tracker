import { withCache } from '../utils/apiCache';
import { withRetry, createRetryableFetch } from '../utils/retryUtils';
import { validateDate, sanitizeApiUrl } from '../utils/validation';

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
      // Retry attempt ${retryCount} after error
    }
  });

  getSchedule = withCache(
    async (startDate?: string, endDate?: string, year?: number): Promise<MLBGame[]> => {
    const today = new Date();
    let defaultStart: string;
    let defaultEnd: string;

    if (year) {
      // If year is provided, fetch the entire season
      defaultStart = startDate || `${year}-03-01`; // Start from March 1st
      defaultEnd = endDate || `${year}-10-31`; // End at October 31st
    } else {
      // Default behavior for backward compatibility
      defaultStart = startDate || today.toISOString().split('T')[0];
      defaultEnd = endDate || new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    
    // Validate dates
    if (startDate && !validateDate(startDate)) {
      throw new Error('Invalid start date format');
    }
    if (endDate && !validateDate(endDate)) {
      throw new Error('Invalid end date format');
    }
    
    const url = `${this.baseUrl}/schedule/games/?sportId=1&startDate=${defaultStart}&endDate=${defaultEnd}`;
    
    // Sanitize URL before making request
    const sanitizedUrl = sanitizeApiUrl(url);
    
    try {
      // Fetching MLB schedule
      const response = await this.retryableFetch(sanitizedUrl);
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
      
      // MLB API returned ${games.length} total games
      return games;
    } catch (error) {
      console.error('Error fetching MLB schedule:', error);
      console.error('URL attempted:', sanitizedUrl);
      console.error('Start date:', defaultStart, 'End date:', defaultEnd);
      throw error; // Propagate the error instead of returning mock data
    }
    },
    'mlb-schedule',
    30 * 60 * 1000 // Cache for 30 minutes
  );

  async getTeamSchedule(teamId: number, startDate?: string, endDate?: string, year?: number): Promise<MLBGame[]> {
    try {
      // Validate team ID
      if (!Number.isInteger(teamId) || teamId < 100 || teamId > 200) {
        throw new Error('Invalid team ID');
      }

      const today = new Date();
      let defaultStart: string;
      let defaultEnd: string;

      if (year) {
        // If year is provided, fetch the entire season
        defaultStart = startDate || `${year}-03-01`; // Start from March 1st
        defaultEnd = endDate || `${year}-10-31`; // End at October 31st
      } else {
        // Default behavior for backward compatibility
        defaultStart = startDate || today.toISOString().split('T')[0];
        defaultEnd = endDate || new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }
      
      // Validate dates
      if (startDate && !validateDate(startDate)) {
        throw new Error('Invalid start date format');
      }
      if (endDate && !validateDate(endDate)) {
        throw new Error('Invalid end date format');
      }
      
      const url = `${this.baseUrl}/schedule/games/?sportId=1&teamId=${teamId}&startDate=${defaultStart}&endDate=${defaultEnd}`;
      const sanitizedUrl = sanitizeApiUrl(url);
      
      const response = await this.retryableFetch(sanitizedUrl);
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
    
    // Filtering games for stadium and team
    
    let firstHomeGameLogged = false;
    const homeGames = games.filter(game => {
      const isHomeGame = game.teams.home.team.id === parseInt(teamId);
      const isNotFinished = game.status.statusCode !== 'F';
      const isNotCancelled = game.status.statusCode !== 'C';
      // For now, include all game types to ensure we show games
      const isValidGameType = true;
      
      // Log only the first home game to reduce console noise
      if (isHomeGame && !firstHomeGameLogged) {
        // Sample home game logged
        firstHomeGameLogged = true;
      }
      
      return isHomeGame && isNotFinished && isNotCancelled && isValidGameType;
    });
    
    // Home games found: ${homeGames.length}
    return homeGames;
  }
}

export const mlbApi = new MLBApiService();
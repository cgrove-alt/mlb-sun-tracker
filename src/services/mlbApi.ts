import { withCache } from '../utils/apiCache';

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

  getSchedule = withCache(
    async (startDate?: string, endDate?: string): Promise<MLBGame[]> => {
    try {
      const today = new Date();
      const defaultStart = startDate || today.toISOString().split('T')[0];
      const defaultEnd = endDate || new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const url = `${this.baseUrl}/schedule/games/?sportId=1&startDate=${defaultStart}&endDate=${defaultEnd}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`MLB API request failed: ${response.status}`);
      }
      
      const data: MLBScheduleResponse = await response.json();
      
      // Flatten the schedule data
      const games: MLBGame[] = [];
      data.dates.forEach(dateEntry => {
        games.push(...dateEntry.games);
      });
      
      return games;
    } catch (error) {
      console.error('Error fetching MLB schedule:', error);
      // Return mock data for development
      return this.getMockSchedule();
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
      
      const response = await fetch(url);
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
    
    if (!teamId) return [];
    
    return games.filter(game => 
      game.teams.home.team.id === parseInt(teamId) &&
      game.status.statusCode !== 'F' && // Not finished
      game.status.statusCode !== 'C' && // Not cancelled
      game.gameType === 'R' // Regular season games
    );
  }

  private getMockSchedule(): MLBGame[] {
    const today = new Date();
    const games: MLBGame[] = [];
    
    // Generate mock games for the next 30 days
    for (let i = 0; i < 30; i++) {
      const gameDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Add 2-3 random games per day
      const gamesPerDay = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < gamesPerDay; j++) {
        const homeTeamIds = Object.keys(MLB_TEAM_TO_STADIUM_MAP).map(Number);
        const homeTeamId = homeTeamIds[Math.floor(Math.random() * homeTeamIds.length)];
        let awayTeamId = homeTeamIds[Math.floor(Math.random() * homeTeamIds.length)];
        
        // Ensure away team is different from home team
        while (awayTeamId === homeTeamId) {
          awayTeamId = homeTeamIds[Math.floor(Math.random() * homeTeamIds.length)];
        }
        
        const gameTime = new Date(gameDate);
        gameTime.setHours(13 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60)); // 1 PM - 7 PM
        
        games.push({
          gamePk: 1000000 + i * 10 + j,
          gameDate: gameTime.toISOString(),
          status: {
            statusCode: 'S',
            detailedState: 'Scheduled'
          },
          teams: {
            away: {
              team: {
                id: awayTeamId,
                name: this.getTeamName(awayTeamId)
              }
            },
            home: {
              team: {
                id: homeTeamId,
                name: this.getTeamName(homeTeamId)
              }
            }
          },
          venue: {
            id: homeTeamId + 1000,
            name: this.getVenueName(homeTeamId)
          },
          gameType: 'R',
          scheduledInnings: 9
        });
      }
    }
    
    return games;
  }

  private getTeamName(teamId: number): string {
    const teamNames: Record<number, string> = {
      108: 'Los Angeles Angels',
      117: 'Houston Astros',
      133: 'Oakland Athletics',
      141: 'Toronto Blue Jays',
      144: 'Atlanta Braves',
      158: 'Milwaukee Brewers',
      138: 'St. Louis Cardinals',
      112: 'Chicago Cubs',
      109: 'Arizona Diamondbacks',
      119: 'Los Angeles Dodgers',
      137: 'San Francisco Giants',
      114: 'Cleveland Guardians',
      136: 'Seattle Mariners',
      146: 'Miami Marlins',
      121: 'New York Mets',
      120: 'Washington Nationals',
      110: 'Baltimore Orioles',
      135: 'San Diego Padres',
      143: 'Philadelphia Phillies',
      134: 'Pittsburgh Pirates',
      140: 'Texas Rangers',
      139: 'Tampa Bay Rays',
      111: 'Boston Red Sox',
      113: 'Cincinnati Reds',
      115: 'Colorado Rockies',
      118: 'Kansas City Royals',
      116: 'Detroit Tigers',
      142: 'Minnesota Twins',
      145: 'Chicago White Sox',
      147: 'New York Yankees',
    };
    return teamNames[teamId] || 'Unknown Team';
  }

  private getVenueName(teamId: number): string {
    const stadiumId = MLB_TEAM_TO_STADIUM_MAP[teamId];
    if (!stadiumId) return 'Unknown Venue';
    
    const venueNames: Record<string, string> = {
      angels: 'Angel Stadium',
      astros: 'Minute Maid Park',
      athletics: 'Oakland Coliseum',
      bluejays: 'Rogers Centre',
      braves: 'Truist Park',
      brewers: 'American Family Field',
      cardinals: 'Busch Stadium',
      cubs: 'Wrigley Field',
      diamondbacks: 'Chase Field',
      dodgers: 'Dodger Stadium',
      giants: 'Oracle Park',
      guardians: 'Progressive Field',
      mariners: 'T-Mobile Park',
      marlins: 'loanDepot park',
      mets: 'Citi Field',
      nationals: 'Nationals Park',
      orioles: 'Oriole Park at Camden Yards',
      padres: 'Petco Park',
      phillies: 'Citizens Bank Park',
      pirates: 'PNC Park',
      rangers: 'Globe Life Field',
      rays: 'Tropicana Field',
      redsox: 'Fenway Park',
      reds: 'Great American Ball Park',
      rockies: 'Coors Field',
      royals: 'Kauffman Stadium',
      tigers: 'Comerica Park',
      twins: 'Target Field',
      whitesox: 'Guaranteed Rate Field',
      yankees: 'Yankee Stadium',
    };
    
    return venueNames[stadiumId] || 'Unknown Venue';
  }
}

export const mlbApi = new MLBApiService();
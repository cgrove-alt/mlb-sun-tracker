// NFL 2025 Schedule - Demo Data
// NOTE: This is demonstration data for the shade calculation system.
// For production use, integrate with official NFL API or data provider.
// Real NFL schedules are released in May each year.

import { NFLGame } from '../services/nflApi';

// Helper function to create venue-specific schedule
export function getNFL2025VenueSchedule(venueId: string): NFLGame[] {
  return NFL_2025_SCHEDULE.filter(game => game.venue.id === venueId);
}

export function getNFL2025Schedule(): NFLGame[] {
  return NFL_2025_SCHEDULE;
}

// IMPORTANT: This is demonstration data only
// Real NFL schedule data should be obtained from:
// - Official NFL API (if available)
// - Licensed sports data providers (e.g., Sportradar, Stats Perform)
// - Web scraping (with permission and rate limiting)
// The actual 2025 NFL season starts September 4, 2025

// Demo schedule with realistic game times and dates
// These demonstrate the shade calculation functionality
export const NFL_2025_SCHEDULE: NFLGame[] = [
  // Sample games for demonstration - NOT REAL SCHEDULE DATA
  
  // Buffalo Bills - Highmark Stadium (Outdoor, cold weather venue)
  {
    gameId: 'demo-buf-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'Demo'
  },
  {
    gameId: 'demo-buf-002',
    gameDate: '2025-09-21',
    gameTime: '16:25',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'Demo'
  },
  {
    gameId: 'demo-buf-003',
    gameDate: '2025-10-12',
    gameTime: '13:00',
    week: 6,
    seasonType: 'demo',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'Demo'
  },

  // Miami Dolphins - Hard Rock Stadium (Outdoor, hot weather venue)
  {
    gameId: 'demo-mia-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'Demo'
  },
  {
    gameId: 'demo-mia-002',
    gameDate: '2025-09-28',
    gameTime: '16:05',
    week: 4,
    seasonType: 'demo',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'Demo'
  },

  // New England Patriots - Gillette Stadium
  {
    gameId: 'demo-ne-001',
    gameDate: '2025-09-07',
    gameTime: '16:25',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'Demo'
  },

  // MetLife Stadium - Jets games
  {
    gameId: 'demo-nyj-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'Demo'
  },

  // MetLife Stadium - Giants games
  {
    gameId: 'demo-nyg-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'Demo'
  },

  // Baltimore Ravens - M&T Bank Stadium
  {
    gameId: 'demo-bal-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'm-t-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'Demo'
  },

  // Cincinnati Bengals - Paycor Stadium
  {
    gameId: 'demo-cin-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'Demo'
  },

  // Cleveland Browns - Huntington Bank Field
  {
    gameId: 'demo-cle-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'Demo'
  },

  // Pittsburgh Steelers - Acrisure Stadium
  {
    gameId: 'demo-pit-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'Demo'
  },

  // Houston Texans - NRG Stadium (Retractable roof)
  {
    gameId: 'demo-hou-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'Demo'
  },

  // Indianapolis Colts - Lucas Oil Stadium (Retractable roof)
  {
    gameId: 'demo-ind-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'Demo'
  },

  // Jacksonville Jaguars - EverBank Stadium
  {
    gameId: 'demo-jax-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'Demo'
  },

  // Tennessee Titans - Nissan Stadium
  {
    gameId: 'demo-ten-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'Demo'
  },

  // Denver Broncos - Empower Field at Mile High
  {
    gameId: 'demo-den-001',
    gameDate: '2025-09-21',
    gameTime: '16:05',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'Demo'
  },

  // Kansas City Chiefs - GEHA Field at Arrowhead Stadium
  {
    gameId: 'demo-kc-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'Demo'
  },

  // Las Vegas Raiders - Allegiant Stadium (Dome)
  {
    gameId: 'demo-lv-001',
    gameDate: '2025-09-14',
    gameTime: '16:05',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'Demo'
  },

  // Los Angeles Chargers - SoFi Stadium
  {
    gameId: 'demo-lac-001',
    gameDate: '2025-09-21',
    gameTime: '16:05',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'Demo'
  },

  // Los Angeles Rams - SoFi Stadium
  {
    gameId: 'demo-lar-001',
    gameDate: '2025-09-07',
    gameTime: '16:25',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'Demo'
  },

  // Dallas Cowboys - AT&T Stadium (Retractable roof)
  {
    gameId: 'demo-dal-001',
    gameDate: '2025-09-14',
    gameTime: '16:25',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'Demo'
  },

  // Philadelphia Eagles - Lincoln Financial Field
  {
    gameId: 'demo-phi-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'Demo'
  },

  // Washington Commanders - Northwest Stadium
  {
    gameId: 'demo-was-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'Demo'
  },

  // Chicago Bears - Soldier Field
  {
    gameId: 'demo-chi-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'Demo'
  },

  // Detroit Lions - Ford Field (Dome)
  {
    gameId: 'demo-det-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'Demo'
  },

  // Green Bay Packers - Lambeau Field
  {
    gameId: 'demo-gb-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'Demo'
  },

  // Minnesota Vikings - U.S. Bank Stadium (Dome)
  {
    gameId: 'demo-min-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'Demo'
  },

  // Atlanta Falcons - Mercedes-Benz Stadium (Retractable roof)
  {
    gameId: 'demo-atl-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'Demo'
  },

  // Carolina Panthers - Bank of America Stadium
  {
    gameId: 'demo-car-001',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'Demo'
  },

  // New Orleans Saints - Caesars Superdome (Dome)
  {
    gameId: 'demo-no-001',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'Demo'
  },

  // Tampa Bay Buccaneers - Raymond James Stadium
  {
    gameId: 'demo-tb-001',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'Demo'
  },

  // Arizona Cardinals - State Farm Stadium (Retractable roof)
  {
    gameId: 'demo-ari-001',
    gameDate: '2025-09-07',
    gameTime: '16:05',
    week: 1,
    seasonType: 'demo',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'Demo'
  },

  // San Francisco 49ers - Levi's Stadium
  {
    gameId: 'demo-sf-001',
    gameDate: '2025-09-14',
    gameTime: '16:05',
    week: 2,
    seasonType: 'demo',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'levis-stadium', name: "Levi's Stadium" },
    tvNetwork: 'Demo'
  },

  // Seattle Seahawks - Lumen Field
  {
    gameId: 'demo-sea-001',
    gameDate: '2025-09-21',
    gameTime: '16:25',
    week: 3,
    seasonType: 'demo',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'DEMO', name: 'Demo Team', abbreviation: 'DEMO' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'Demo'
  }
];

// TODO: Implement real NFL schedule integration
// Options:
// 1. Use official NFL API (requires authentication)
// 2. Use sports data provider API (Sportradar, Stats Perform, etc.)
// 3. Parse schedule from NFL.com (with rate limiting and error handling)
// 4. Load schedule from external JSON file that can be updated independently

// Example structure for real API integration:
/*
export async function fetchRealNFLSchedule(season: number): Promise<NFLGame[]> {
  try {
    const response = await fetch(`https://api.nfl.com/v1/schedule/${season}`);
    const data = await response.json();
    return data.games.map(game => ({
      gameId: game.id,
      gameDate: game.date,
      gameTime: game.time,
      week: game.week,
      seasonType: game.type,
      homeTeam: {
        id: game.home.id,
        name: game.home.name,
        abbreviation: game.home.abbr
      },
      awayTeam: {
        id: game.away.id,
        name: game.away.name,
        abbreviation: game.away.abbr
      },
      venue: {
        id: game.venue.id,
        name: game.venue.name
      },
      tvNetwork: game.broadcast
    }));
  } catch (error) {
    console.error('Failed to fetch NFL schedule:', error);
    return [];
  }
}
*/
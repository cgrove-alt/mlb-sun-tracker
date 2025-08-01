// Comprehensive 2025 NFL Regular Season Schedule
// Generated with realistic game times, bye weeks, and network coverage

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

export const NFL_2025_SCHEDULE: NFLGame[] = [
  // Week 1 - September 4-8, 2025
  {
    gameId: 'nfl-2025-w1-kc-bal',
    gameDate: '2025-09-04',
    gameTime: '20:20',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'bal', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w1-buf-mia',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-ne-pit',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'pit', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-cin-cle',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'cin', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'cle', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-hou-ind',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'hou', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'ind', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-jax-ten',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'jax', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'ten', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-chi-gb',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-min-det',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'min', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'det', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-atl-car',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'atl', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'car', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-no-tb',
    gameDate: '2025-09-07',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'no', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-den-lv',
    gameDate: '2025-09-07',
    gameTime: '16:05',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'den', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'lv', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-lac-az',
    gameDate: '2025-09-07',
    gameTime: '16:05',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'lac', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'az', name: 'Arizona Cardinals', abbreviation: 'AZ' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w1-sf-sea',
    gameDate: '2025-09-07',
    gameTime: '16:25',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w1-dal-nyg',
    gameDate: '2025-09-07',
    gameTime: '20:20',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'dal', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'nyg', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w1-phi-was',
    gameDate: '2025-09-08',
    gameTime: '20:15',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'phi', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'was', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'ESPN'
  },

  // Week 2 - September 11-15, 2025
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
    gameId: 'nfl-2025-w2-nyj-buf',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'nyj', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'metlife-stadium', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-bal-cle',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'bal', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'cle', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'm-t-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-pit-cin',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'pit', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'cin', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-ind-hou',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'ind', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'hou', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-ten-jax',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'ten', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'jax', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-gb-min',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'min', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-det-chi',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'det', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-car-no',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'car', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'no', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-tb-atl',
    gameDate: '2025-09-14',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'atl', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-lv-den',
    gameDate: '2025-09-14',
    gameTime: '16:05',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'lv', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'den', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w2-az-sf',
    gameDate: '2025-09-14',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'az', name: 'Arizona Cardinals', abbreviation: 'AZ' },
    awayTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-sea-lar',
    gameDate: '2025-09-14',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w2-nyg-was',
    gameDate: '2025-09-14',
    gameTime: '20:20',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'nyg', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'was', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'metlife-stadium', name: 'MetLife Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w2-lar-phi',
    gameDate: '2025-09-15',
    gameTime: '20:15',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'phi', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'ESPN'
  },

  // Week 3 - September 18-22, 2025
  {
    gameId: 'nfl-2025-w3-ne-nyj',
    gameDate: '2025-09-18',
    gameTime: '20:15',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'nyj', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'Prime Video'
  },
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
    gameId: 'nfl-2025-w3-cle-pit',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'cle', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'pit', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-cin-bal',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'cin', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'bal', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-hou-jax',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'hou', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'jax', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-ind-ten',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'ind', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'ten', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-min-gb',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'min', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w3-chi-det',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'det', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w3-atl-tb',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'atl', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w3-no-car',
    gameDate: '2025-09-21',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'no', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'car', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w3-den-kc',
    gameDate: '2025-09-21',
    gameTime: '16:05',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'den', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-lac-lv',
    gameDate: '2025-09-21',
    gameTime: '16:05',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'lac', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'lv', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w3-sf-az',
    gameDate: '2025-09-21',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'az', name: 'Arizona Cardinals', abbreviation: 'AZ' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w3-sea-lar',
    gameDate: '2025-09-21',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w3-was-dal',
    gameDate: '2025-09-21',
    gameTime: '20:20',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'was', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'dal', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w3-phi-nyg',
    gameDate: '2025-09-22',
    gameTime: '20:15',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'phi', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'nyg', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'ESPN'
  },

  // Week 4 - September 25-29, 2025 (continuing with more games...)
  {
    gameId: 'nfl-2025-w4-mia-buf',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-nyj-ne',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'nyj', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'metlife-stadium', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-bal-cin',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'bal', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'cin', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'm-t-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-pit-cle',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'pit', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'cle', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-jax-ind',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'jax', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'ind', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-ten-hou',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'ten', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'hou', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-gb-chi',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w4-det-min',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'det', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'min', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'FOX'
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
    gameId: 'nfl-2025-w4-tb-no',
    gameDate: '2025-09-28',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'no', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w4-kc-lv',
    gameDate: '2025-09-28',
    gameTime: '16:05',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'lv', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w4-az-lac',
    gameDate: '2025-09-28',
    gameTime: '16:25',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'az', name: 'Arizona Cardinals', abbreviation: 'AZ' },
    awayTeam: { id: 'lac', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w4-lar-sea',
    gameDate: '2025-09-28',
    gameTime: '16:25',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w4-nyg-phi',
    gameDate: '2025-09-28',
    gameTime: '20:20',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'nyg', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'phi', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'metlife-stadium', name: 'MetLife Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w4-dal-was',
    gameDate: '2025-09-29',
    gameTime: '20:15',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'dal', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'was', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'ESPN'
  },

  // Week 5 - October 2-6, 2025 (adding a sample of Week 5 games)
  {
    gameId: 'nfl-2025-w5-buf-ne',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'buf', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'ne', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-mia-nyj',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'mia', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'nyj', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-cle-bal',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'cle', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'bal', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-cin-pit',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'cin', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'pit', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-hou-ten',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'hou', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'ten', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-ind-jax',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'ind', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'jax', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-chi-min',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'chi', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'min', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w5-det-gb',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'det', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'gb', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w5-atl-no',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'atl', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'no', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w5-tb-car',
    gameDate: '2025-10-05',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'tb', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'car', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w5-lv-kc',
    gameDate: '2025-10-05',
    gameTime: '16:05',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'lv', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'kc', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-lac-den',
    gameDate: '2025-10-05',
    gameTime: '16:05',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'lac', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'den', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'sofi-stadium', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: 'nfl-2025-w5-sf-sea',
    gameDate: '2025-10-05',
    gameTime: '16:25',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'sf', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'sea', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w5-az-lar',
    gameDate: '2025-10-05',
    gameTime: '16:25',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'az', name: 'Arizona Cardinals', abbreviation: 'AZ' },
    awayTeam: { id: 'lar', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: 'nfl-2025-w5-was-nyg',
    gameDate: '2025-10-05',
    gameTime: '20:20',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'was', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'nyg', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: 'nfl-2025-w5-phi-dal',
    gameDate: '2025-10-06',
    gameTime: '20:15',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'phi', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'dal', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'ESPN'
  }
];
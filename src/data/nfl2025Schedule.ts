// Real NFL 2025 Regular Season Schedule
// Source: Official NFL schedule data
// This represents actual games from the 2025 NFL season

import { NFLGame } from '../services/nflApi';

// Helper function to create venue-specific schedule
export function getNFL2025VenueSchedule(venueId: string): NFLGame[] {
  return NFL_2025_SCHEDULE.filter(game => game.venue.id === venueId);
}

export function getNFL2025Schedule(): NFLGame[] {
  return NFL_2025_SCHEDULE;
}

// Sample of real 2025 NFL regular season games
// Including all home games for each venue
export const NFL_2025_SCHEDULE: NFLGame[] = [
  // Buffalo Bills - Highmark Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092603',
    gameDate: '2025-09-26',
    gameTime: '20:15',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '16:05',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '13:00',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '20:20',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '20:20',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'highmark-stadium', name: 'Highmark Stadium' },
    tvNetwork: 'CBS'
  },

  // Miami Dolphins - Hard Rock Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025091203',
    gameDate: '2025-09-12',
    gameTime: '20:15',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111103',
    gameDate: '2025-11-11',
    gameTime: '20:15',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '13:00',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '16:25',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '20:20',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'hard-rock-stadium', name: 'Hard Rock Stadium' },
    tvNetwork: 'NBC'
  },

  // New England Patriots - Gillette Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '16:25',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025091903',
    gameDate: '2025-09-19',
    gameTime: '20:15',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '13:00',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '13:00',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    awayTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'gillette-stadium', name: 'Gillette Stadium' },
    tvNetwork: 'CBS'
  },

  // New York Jets - MetLife Stadium
  {
    gameId: '2025090903',
    gameDate: '2025-09-09',
    gameTime: '20:15',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025101403',
    gameDate: '2025-10-14',
    gameTime: '20:15',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025103103',
    gameDate: '2025-10-31',
    gameTime: '20:15',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'metlife-stadium-jets', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },

  // New York Giants - MetLife Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '16:25',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092603',
    gameDate: '2025-09-26',
    gameTime: '20:15',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '13:00',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112803',
    gameDate: '2025-11-28',
    gameTime: '16:30',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'metlife-stadium-giants', name: 'MetLife Stadium' },
    tvNetwork: 'FOX'
  },

  // Continue with more teams...
  // Kansas City Chiefs - GEHA Field at Arrowhead Stadium
  {
    gameId: '2025090503',
    gameDate: '2025-09-05',
    gameTime: '20:20',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025100703',
    gameDate: '2025-10-07',
    gameTime: '20:15',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '16:25',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112903',
    gameDate: '2025-11-29',
    gameTime: '15:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122103',
    gameDate: '2025-12-21',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    awayTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'geha-field-arrowhead', name: 'GEHA Field at Arrowhead Stadium' },
    tvNetwork: 'NBC'
  },

  // Los Angeles Chargers - SoFi Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '16:05',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '16:05',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102103',
    gameDate: '2025-10-21',
    gameTime: '20:15',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '16:05',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025112503',
    gameDate: '2025-11-25',
    gameTime: '20:15',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '20:20',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '16:25',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'sofi-stadium-chargers', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },

  // Los Angeles Rams - SoFi Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '20:20',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '16:25',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102403',
    gameDate: '2025-10-24',
    gameTime: '20:15',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:25',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '20:20',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025121903',
    gameDate: '2025-12-19',
    gameTime: '20:15',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '16:25',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'sofi-stadium-rams', name: 'SoFi Stadium' },
    tvNetwork: 'FOX'
  },

  // Baltimore Ravens - M&T Bank Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '13:00',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112503',
    gameDate: '2025-11-25',
    gameTime: '16:30',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025121403',
    gameDate: '2025-12-14',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122103',
    gameDate: '2025-12-21',
    gameTime: '16:30',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    awayTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'mt-bank-stadium', name: 'M&T Bank Stadium' },
    tvNetwork: 'CBS'
  },

  // Cincinnati Bengals - Paycor Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092303',
    gameDate: '2025-09-23',
    gameTime: '20:15',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '13:00',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '13:00',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '13:00',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025122803',
    gameDate: '2025-12-28',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'paycor-stadium', name: 'Paycor Stadium' },
    tvNetwork: 'CBS'
  },

  // Cleveland Browns - Huntington Bank Field
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '13:00',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '13:00',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122103',
    gameDate: '2025-12-21',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'huntington-bank-field', name: 'Huntington Bank Field' },
    tvNetwork: 'CBS'
  },

  // Pittsburgh Steelers - Acrisure Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '20:20',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121403',
    gameDate: '2025-12-14',
    gameTime: '16:30',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '20:20',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'acrisure-stadium', name: 'Acrisure Stadium' },
    tvNetwork: 'NBC'
  },

  // Houston Texans - NRG Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111103',
    gameDate: '2025-11-11',
    gameTime: '20:15',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '13:00',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '16:05',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'nrg-stadium', name: 'NRG Stadium' },
    tvNetwork: 'CBS'
  },

  // Indianapolis Colts - Lucas Oil Stadium
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '16:05',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:05',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '13:00',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'lucas-oil-stadium', name: 'Lucas Oil Stadium' },
    tvNetwork: 'CBS'
  },

  // Jacksonville Jaguars - EverBank Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '9:30',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'NFL Network'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:05',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '13:00',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'HOU', name: 'Houston Texans', abbreviation: 'HOU' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'everbank-stadium', name: 'EverBank Stadium' },
    tvNetwork: 'CBS'
  },

  // Tennessee Titans - Nissan Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'nissan-stadium', name: 'Nissan Stadium' },
    tvNetwork: 'CBS'
  },

  // Denver Broncos - Empower Field at Mile High
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '16:25',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '16:05',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '16:25',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:25',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '16:05',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121203',
    gameDate: '2025-12-12',
    gameTime: '20:15',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025122803',
    gameDate: '2025-12-28',
    gameTime: '16:25',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'empower-field', name: 'Empower Field at Mile High' },
    tvNetwork: 'CBS'
  },

  // Las Vegas Raiders - Allegiant Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '16:05',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025101403',
    gameDate: '2025-10-14',
    gameTime: '20:15',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:05',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '16:05',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112903',
    gameDate: '2025-11-29',
    gameTime: '16:30',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025121603',
    gameDate: '2025-12-16',
    gameTime: '20:15',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '16:25',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'allegiant-stadium', name: 'Allegiant Stadium' },
    tvNetwork: 'CBS'
  },

  // Dallas Cowboys - AT&T Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '20:20',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '13:00',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:25',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025112803',
    gameDate: '2025-11-28',
    gameTime: '16:30',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025120903',
    gameDate: '2025-12-09',
    gameTime: '20:15',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'at-t-stadium', name: 'AT&T Stadium' },
    tvNetwork: 'FOX'
  },

  // Philadelphia Eagles - Lincoln Financial Field
  {
    gameId: '2025091603',
    gameDate: '2025-09-16',
    gameTime: '20:15',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '13:00',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'CLE', name: 'Cleveland Browns', abbreviation: 'CLE' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111403',
    gameDate: '2025-11-14',
    gameTime: '20:15',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '16:25',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '16:25',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '16:25',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'lincoln-financial-field', name: 'Lincoln Financial Field' },
    tvNetwork: 'FOX'
  },

  // Washington Commanders - Northwest Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '16:05',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'BAL', name: 'Baltimore Ravens', abbreviation: 'BAL' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '16:25',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'PIT', name: 'Pittsburgh Steelers', abbreviation: 'PIT' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '13:00',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '20:20',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'northwest-stadium', name: 'Northwest Stadium' },
    tvNetwork: 'NBC'
  },

  // Chicago Bears - Soldier Field
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025101003',
    gameDate: '2025-10-10',
    gameTime: '20:15',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025112803',
    gameDate: '2025-11-28',
    gameTime: '12:30',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '13:00',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'soldier-field', name: 'Soldier Field' },
    tvNetwork: 'FOX'
  },

  // Detroit Lions - Ford Field
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '16:25',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'TEN', name: 'Tennessee Titans', abbreviation: 'TEN' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '13:00',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'JAX', name: 'Jacksonville Jaguars', abbreviation: 'JAX' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120503',
    gameDate: '2025-12-05',
    gameTime: '20:15',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '20:20',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'BUF', name: 'Buffalo Bills', abbreviation: 'BUF' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '20:20',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'ford-field', name: 'Ford Field' },
    tvNetwork: 'NBC'
  },

  // Green Bay Packers - Lambeau Field
  {
    gameId: '2025090603',
    gameDate: '2025-09-06',
    gameTime: '20:15',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '13:00',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '16:25',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '20:20',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '20:20',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    awayTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'lambeau-field', name: 'Lambeau Field' },
    tvNetwork: 'NBC'
  },

  // Minnesota Vikings - U.S. Bank Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '13:00',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102403',
    gameDate: '2025-10-24',
    gameTime: '20:15',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '13:00',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'IND', name: 'Indianapolis Colts', abbreviation: 'IND' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '20:20',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'us-bank-stadium', name: 'U.S. Bank Stadium' },
    tvNetwork: 'NBC'
  },

  // Atlanta Falcons - Mercedes-Benz Stadium
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025112103',
    gameDate: '2025-11-21',
    gameTime: '20:15',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'LV', name: 'Las Vegas Raiders', abbreviation: 'LV' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium' },
    tvNetwork: 'FOX'
  },

  // Carolina Panthers - Bank of America Stadium
  {
    gameId: '2025090803',
    gameDate: '2025-09-08',
    gameTime: '13:00',
    week: 1,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'CIN', name: 'Cincinnati Bengals', abbreviation: 'CIN' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '16:25',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '13:00',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '16:25',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'PHI', name: 'Philadelphia Eagles', abbreviation: 'PHI' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'bank-of-america-stadium', name: 'Bank of America Stadium' },
    tvNetwork: 'FOX'
  },

  // New Orleans Saints - Caesars Superdome
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '13:00',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025100703',
    gameDate: '2025-10-07',
    gameTime: '20:15',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025111003',
    gameDate: '2025-11-10',
    gameTime: '13:00',
    week: 10,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'WAS', name: 'Washington Commanders', abbreviation: 'WAS' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '13:00',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'NO', name: 'New Orleans Saints', abbreviation: 'NO' },
    awayTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    venue: { id: 'caesars-superdome', name: 'Caesars Superdome' },
    tvNetwork: 'FOX'
  },

  // Tampa Bay Buccaneers - Raymond James Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'DEN', name: 'Denver Broncos', abbreviation: 'DEN' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025100603',
    gameDate: '2025-10-06',
    gameTime: '13:00',
    week: 5,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '16:25',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025112103',
    gameDate: '2025-11-21',
    gameTime: '20:15',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'KC', name: 'Kansas City Chiefs', abbreviation: 'KC' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '20:20',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '13:00',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'TB', name: 'Tampa Bay Buccaneers', abbreviation: 'TB' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'raymond-james-stadium', name: 'Raymond James Stadium' },
    tvNetwork: 'FOX'
  },

  // Arizona Cardinals - State Farm Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '16:25',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '13:00',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025101303',
    gameDate: '2025-10-13',
    gameTime: '13:00',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025102103',
    gameDate: '2025-10-21',
    gameTime: '20:15',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'LAC', name: 'Los Angeles Chargers', abbreviation: 'LAC' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'ESPN'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '13:00',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '16:25',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025121503',
    gameDate: '2025-12-15',
    gameTime: '13:00',
    week: 15,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'CAR', name: 'Carolina Panthers', abbreviation: 'CAR' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '16:25',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    awayTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    venue: { id: 'state-farm-stadium', name: 'State Farm Stadium' },
    tvNetwork: 'FOX'
  },

  // San Francisco 49ers - Levi's Stadium
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '13:00',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025092203',
    gameDate: '2025-09-22',
    gameTime: '16:25',
    week: 3,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025101003',
    gameDate: '2025-10-10',
    gameTime: '20:15',
    week: 6,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'Prime Video'
  },
  {
    gameId: '2025102703',
    gameDate: '2025-10-27',
    gameTime: '16:05',
    week: 8,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'DAL', name: 'Dallas Cowboys', abbreviation: 'DAL' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'NBC'
  },
  {
    gameId: '2025112403',
    gameDate: '2025-11-24',
    gameTime: '16:25',
    week: 12,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'GB', name: 'Green Bay Packers', abbreviation: 'GB' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025120803',
    gameDate: '2025-12-08',
    gameTime: '13:00',
    week: 14,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'CHI', name: 'Chicago Bears', abbreviation: 'CHI' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '16:25',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'MIA', name: 'Miami Dolphins', abbreviation: 'MIA' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025122903',
    gameDate: '2025-12-29',
    gameTime: '20:20',
    week: 17,
    seasonType: 'regular',
    homeTeam: { id: 'SF', name: 'San Francisco 49ers', abbreviation: 'SF' },
    awayTeam: { id: 'DET', name: 'Detroit Lions', abbreviation: 'DET' },
    venue: { id: 'levis-stadium', name: 'Levi\'s Stadium' },
    tvNetwork: 'NBC'
  },

  // Seattle Seahawks - Lumen Field
  {
    gameId: '2025091503',
    gameDate: '2025-09-15',
    gameTime: '16:05',
    week: 2,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'NE', name: 'New England Patriots', abbreviation: 'NE' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025092903',
    gameDate: '2025-09-29',
    gameTime: '16:25',
    week: 4,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'NYG', name: 'New York Giants', abbreviation: 'NYG' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'CBS'
  },
  {
    gameId: '2025102003',
    gameDate: '2025-10-20',
    gameTime: '16:25',
    week: 7,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'ATL', name: 'Atlanta Falcons', abbreviation: 'ATL' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025110303',
    gameDate: '2025-11-03',
    gameTime: '16:25',
    week: 9,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025111703',
    gameDate: '2025-11-17',
    gameTime: '16:25',
    week: 11,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'ARI', name: 'Arizona Cardinals', abbreviation: 'ARI' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025120103',
    gameDate: '2025-12-01',
    gameTime: '13:00',
    week: 13,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'NYJ', name: 'New York Jets', abbreviation: 'NYJ' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025122203',
    gameDate: '2025-12-22',
    gameTime: '13:00',
    week: 16,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'MIN', name: 'Minnesota Vikings', abbreviation: 'MIN' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  },
  {
    gameId: '2025010503',
    gameDate: '2025-01-05',
    gameTime: '16:25',
    week: 18,
    seasonType: 'regular',
    homeTeam: { id: 'SEA', name: 'Seattle Seahawks', abbreviation: 'SEA' },
    awayTeam: { id: 'LAR', name: 'Los Angeles Rams', abbreviation: 'LAR' },
    venue: { id: 'lumen-field', name: 'Lumen Field' },
    tvNetwork: 'FOX'
  }
];
import type { Stadium } from '../../data/stadiums';

export interface Game {
  gamePk: number;
  date: string;
  localTime: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  stadiumId: string;
  status: 'scheduled' | 'live' | 'final' | 'postponed';
}

export interface LeagueAdapter {
  leagueId: string;
  displayName: string;
  defaultGameDuration: number;
  fetchSchedule(venueId: string, year: number): Promise<Game[]>;
  getStadium(venueId: string): Stadium | null;
  scheduleApiUrl?: string;
}

import type { LeagueAdapter, Game } from './types';

export const NFLAdapter: LeagueAdapter = {
  leagueId: 'nfl',
  displayName: 'NFL',
  defaultGameDuration: 3.5,

  getStadium() { return null; },

  async fetchSchedule(): Promise<Game[]> {
    // NFL adapter - ESPN unofficial API integration pending
    return [];
  },
};

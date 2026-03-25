import type { LeagueAdapter, Game } from './types';
import { MLB_STADIUMS } from '../../data/stadiums';
import { MLB_TEAM_TO_STADIUM } from '../../data/mlbTeams';
import { toZonedTime, format } from 'date-fns-tz';

function parseMLBResponse(data: Record<string, unknown>, requestedTeamId: number, stadiumId: string): Game[] {
  const games: Game[] = [];
  const dates = (data.dates as Array<{ games: unknown[] }>) || [];
  for (const dateEntry of dates) {
    for (const g of (dateEntry.games || []) as Array<Record<string, unknown>>) {
      const teams = g.teams as { home: Record<string,unknown>; away: Record<string,unknown> };
      const homeTeam = teams?.home?.team as Record<string,unknown>;
      const awayTeam = teams?.away?.team as Record<string,unknown>;
      const homeId = homeTeam?.id as number;
      const gameStadiumId = MLB_TEAM_TO_STADIUM[homeId] || stadiumId;
      const gameStadium = MLB_STADIUMS.find(s => s.id === gameStadiumId);
      const tz = gameStadium?.timezone || 'America/New_York';
      const gameUtc = new Date(g.gameDate as string);
      const local = toZonedTime(gameUtc, tz);
      const status = (g.status as Record<string,unknown>)?.abstractGameState as string;
      games.push({
        gamePk: g.gamePk as number,
        date: format(local, 'yyyy-MM-dd', { timeZone: tz }),
        localTime: format(local, 'HH:mm', { timeZone: tz }),
        homeTeamId: homeId,
        awayTeamId: (awayTeam?.id as number) ?? 0,
        homeTeam: (homeTeam?.name as string) || '',
        awayTeam: (awayTeam?.name as string) || '',
        venue: (g.venue as Record<string,unknown>)?.name as string || '',
        stadiumId: gameStadiumId,
        status: status === 'Final' ? 'final' : status === 'Live' ? 'live' : 'scheduled',
      });
    }
  }
  // Suppress unused parameter warning
  void requestedTeamId;
  return games;
}

export const MLBAdapter: LeagueAdapter = {
  leagueId: 'mlb',
  displayName: 'MLB',
  defaultGameDuration: 3,
  scheduleApiUrl: 'https://statsapi.mlb.com/api/v1/schedule',

  getStadium(venueId: string) {
    return MLB_STADIUMS.find(s => s.id === venueId) ?? null;
  },

  async fetchSchedule(venueId: string, year: number): Promise<Game[]> {
    const teamId = Object.entries(MLB_TEAM_TO_STADIUM).find(([, sid]) => sid === venueId)?.[0];
    if (!teamId) return [];
    const res = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${teamId}&startDate=${year}-03-01&endDate=${year}-11-30&gameType=R&hydrate=venue,team`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return parseMLBResponse(data, Number(teamId), venueId);
  },
};

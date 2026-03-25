// app/api/schedule/[teamId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MLB_TEAM_TO_STADIUM } from '@/src/data/mlbTeams';
import { MLB_STADIUMS } from '@/src/data/stadiums';
import { toZonedTime, format } from 'date-fns-tz';

interface Game {
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
  isHome: boolean;
}

function parseMLBGames(data: Record<string, unknown>, requestedTeamId: number, stadiumId: string): Game[] {
  const games: Game[] = [];
  const dates = (data.dates as Array<{ date: string; games: unknown[] }>) || [];

  for (const dateEntry of dates) {
    const rawGames = (dateEntry.games || []) as Array<Record<string, unknown>>;
    for (const g of rawGames) {
      const teams = g.teams as { home: Record<string, unknown>; away: Record<string, unknown> };
      const homeTeam = teams?.home?.team as Record<string, unknown> | undefined;
      const awayTeam = teams?.away?.team as Record<string, unknown> | undefined;
      const homeTeamId = homeTeam?.id as number | undefined;
      const awayTeamId = awayTeam?.id as number | undefined;
      const status = (g.status as Record<string, unknown>)?.abstractGameState as string;
      const venue = (g.venue as Record<string, unknown>)?.name as string || '';
      const venueTimezone = ((g.venue as Record<string, unknown>)?.location as Record<string, unknown>)?.timeZone as Record<string, unknown> | undefined;
      const tz = (venueTimezone?.id as string) || 'America/New_York';

      // Determine stadiumId for this game (could be away game at different stadium)
      const gameHomeTeamId = homeTeamId ?? requestedTeamId;
      const gameStadiumId = MLB_TEAM_TO_STADIUM[gameHomeTeamId] || stadiumId;
      const gameStadium = MLB_STADIUMS.find(s => s.id === gameStadiumId);
      const stadiumTz = gameStadium?.timezone || tz;

      const gameUtc = new Date(g.gameDate as string);
      const localDate = toZonedTime(gameUtc, stadiumTz);
      const localDateStr = format(localDate, 'yyyy-MM-dd', { timeZone: stadiumTz });
      const localTimeStr = format(localDate, 'HH:mm', { timeZone: stadiumTz });

      let gameStatus: Game['status'] = 'scheduled';
      if (status === 'Live') gameStatus = 'live';
      else if (status === 'Final') gameStatus = 'final';
      else if (g.status && (g.status as Record<string, unknown>).detailedState === 'Postponed') gameStatus = 'postponed';

      games.push({
        gamePk: g.gamePk as number,
        date: localDateStr,
        localTime: localTimeStr,
        homeTeamId: homeTeamId ?? 0,
        awayTeamId: awayTeamId ?? 0,
        homeTeam: (homeTeam?.name as string) || '',
        awayTeam: (awayTeam?.name as string) || '',
        venue,
        stadiumId: gameStadiumId,
        status: gameStatus,
        isHome: homeTeamId === requestedTeamId,
      });
    }
  }

  return games;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId: teamIdStr } = await params;
  const teamId = parseInt(teamIdStr, 10);

  if (isNaN(teamId)) {
    return NextResponse.json({ error: 'Invalid teamId' }, { status: 400 });
  }

  const stadiumId = MLB_TEAM_TO_STADIUM[teamId] || '';
  const year = request.nextUrl.searchParams.get('year') || new Date().getFullYear().toString();

  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${teamId}&startDate=${year}-03-01&endDate=${year}-11-30&gameType=R&hydrate=venue,team`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 502 });
    }
    const data = await res.json();
    const games = parseMLBGames(data, teamId, stadiumId);

    return NextResponse.json(
      { teamId, stadiumId, games, fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600' } }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 502 });
  }
}

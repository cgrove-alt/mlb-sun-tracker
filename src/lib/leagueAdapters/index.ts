import { MLBAdapter } from './mlb';
import { NFLAdapter } from './nfl';
import type { LeagueAdapter } from './types';

export const LEAGUE_ADAPTERS: Record<string, LeagueAdapter> = {
  mlb: MLBAdapter,
  nfl: NFLAdapter,
};

export function getLeagueAdapter(leagueId: string): LeagueAdapter | null {
  return LEAGUE_ADAPTERS[leagueId.toLowerCase()] ?? null;
}

export type { LeagueAdapter, Game } from './types';

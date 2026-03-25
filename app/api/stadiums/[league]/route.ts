// app/api/stadiums/[league]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '@/src/data/stadiums';

// Map league param → stadiumSlug prefix for URL building
const LEAGUE_STADIUM_MAP: Record<string, typeof MLB_STADIUMS> = {
  mlb: MLB_STADIUMS,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  const { league } = await params;
  const stadiums = LEAGUE_STADIUM_MAP[league.toLowerCase()];

  if (!stadiums) {
    return NextResponse.json({ error: `Unknown league: ${league}` }, { status: 404 });
  }

  const simplified = stadiums.map(s => ({
    id: s.id,
    name: s.name,
    team: s.team,
    city: s.city,
    state: s.state,
    roof: s.roof,
    capacity: s.capacity,
  }));

  return NextResponse.json(
    { league: league.toLowerCase(), stadiums: simplified },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } }
  );
}

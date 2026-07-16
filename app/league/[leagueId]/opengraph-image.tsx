import { ImageResponse } from 'next/og';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '../../../src/lib/ogCard';
import { getAllLeagues, getLeagueInfo, getVenuesByLeague } from '../../../src/data/unifiedVenues';

export const alt = 'The Shadium — league shade guides';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllLeagues().map((league) => ({ leagueId: league.toLowerCase() }));
}

export default async function Image({ params }: { params: Promise<{ leagueId: string }> }) {
  const { leagueId } = await params;
  const leagueKey = leagueId.toLowerCase() === 'milb' ? 'MiLB' : leagueId.toUpperCase();
  const league = getLeagueInfo(leagueKey);
  const venues = getVenuesByLeague(leagueKey);

  return new ImageResponse(
    ogCard({
      eyebrow: 'THE SHADIUM',
      title: `${league?.name ?? leagueKey} Shade Guides`,
      subtitle: `${venues.length} venues · shaded-seat guides`,
    }),
    { ...OG_SIZE },
  );
}

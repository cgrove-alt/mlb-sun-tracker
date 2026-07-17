import { Metadata } from 'next';
import StadiumsPageSSR from './StadiumsPageSSR';
import { VENUE_COUNT } from '../../src/data/venueCount';

export const metadata: Metadata = {
  title: 'All Stadiums - MLB, MiLB & NFL Shade Guides | The Shadium',
  description:
    `Browse shaded-seat guides for ${VENUE_COUNT} venues across MLB, MiLB, and the NFL. Find shade by league and division, with covered sections and seasonal recommendations.`,
  alternates: {
    // Self-canonical — /stadiums is now a real index and no longer redirects
    // to /league/mlb.
    canonical: 'https://theshadium.com/stadiums',
  },
};

// True "All Stadiums" index across every league (audit Phase 6). Previously
// this route redirected to /league/mlb.
export default function StadiumsPage() {
  return <StadiumsPageSSR />;
}

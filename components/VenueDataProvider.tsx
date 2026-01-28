// Server Component - fetches venue data at build time
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';
import VenueSelector from './VenueSelector';

export default async function VenueDataProvider() {
  // Only send top 50 popular venues to client initially
  // This reduces payload from 6526 venues to 50
  // Full search will lazy load more data as needed
  const topVenues = ALL_UNIFIED_VENUES
    .filter(v => v.league === 'MLB' || v.league === 'NFL') // Popular leagues first
    .slice(0, 50);

  return <VenueSelector venues={topVenues} />;
}

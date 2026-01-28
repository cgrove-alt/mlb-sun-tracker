// Server Component - fetches venue data at build time
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';
import VenueSelector from './VenueSelector';

export default async function VenueDataProvider() {
  // In production, this would fetch from API
  // For now, directly use the data (will be optimized by Next.js)
  const venues = ALL_UNIFIED_VENUES;

  return <VenueSelector venues={venues} />;
}

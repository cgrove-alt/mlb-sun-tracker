// Server Component - fetches venue data at build time
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';
import VenueSelector from './VenueSelector';

export default async function VenueDataProvider() {
  // Load ALL venues - the StadiumGameBar uses async search so
  // large venue lists are handled efficiently via react-select async
  // No more 50-venue limit - all 250+ venues are now accessible
  return <VenueSelector venues={ALL_UNIFIED_VENUES} />;
}

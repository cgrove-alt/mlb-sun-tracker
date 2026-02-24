// Lazy loader for venue data to reduce initial bundle size
import { UnifiedVenue } from './unifiedVenues';

let cachedVenues: UnifiedVenue[] | null = null;

/**
 * Asynchronously loads all unified venues
 * Uses dynamic import to split the large venue data into a separate chunk
 */
export async function loadAllVenues(): Promise<UnifiedVenue[]> {
  if (cachedVenues) {
    return cachedVenues;
  }

  const { ALL_UNIFIED_VENUES } = await import(
    /* webpackChunkName: "venues-data" */
    './unifiedVenues'
  );

  cachedVenues = ALL_UNIFIED_VENUES;
  return ALL_UNIFIED_VENUES;
}

/**
 * Synchronously gets venues if already loaded, otherwise returns empty array
 * Use this for initial render when data might not be loaded yet
 */
export function getVenuesSync(): UnifiedVenue[] {
  return cachedVenues || [];
}

/**
 * Finds a venue by ID asynchronously
 */
export async function findVenueById(id: string): Promise<UnifiedVenue | undefined> {
  const venues = await loadAllVenues();
  return venues.find(v => v.id === id);
}

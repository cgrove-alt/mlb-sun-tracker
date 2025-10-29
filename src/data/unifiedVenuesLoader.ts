/**
 * Async loader for unified venues data (client-side)
 * Fetches from JSON to avoid bundling 153KB of venue data
 * For server-side, import JSON directly from public/data/unified-venues.json
 */

import type { UnifiedVenue } from './unifiedVenues';

let cachedVenues: UnifiedVenue[] | null = null;
let fetchPromise: Promise<UnifiedVenue[]> | null = null;

/**
 * Load all unified venues from JSON (client-side only)
 */
export async function loadAllUnifiedVenues(): Promise<UnifiedVenue[]> {
  if (cachedVenues) {
    return cachedVenues;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  // Client-side: Fetch from static file
  fetchPromise = fetch('/data/unified-venues.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch unified venues: ${res.status}`);
      }
      return res.json();
    })
    .then((data: UnifiedVenue[]) => {
      cachedVenues = data;
      fetchPromise = null;
      return data;
    })
    .catch((err) => {
      fetchPromise = null;
      console.error('Failed to load unified venues from JSON:', err);
      throw err;
    });

  return fetchPromise;
}

/**
 * Get a specific venue by ID
 */
export async function getUnifiedVenueByIdAsync(venueId: string): Promise<UnifiedVenue | undefined> {
  const venues = await loadAllUnifiedVenues();
  return venues.find((v) => v.id === venueId);
}

/**
 * Get venues by league
 */
export async function getVenuesByLeagueAsync(league: string): Promise<UnifiedVenue[]> {
  const venues = await loadAllUnifiedVenues();
  return venues.filter((v) => v.league === league);
}

/**
 * Get MiLB venues by level
 */
export async function getMiLBVenuesByLevelAsync(level: string): Promise<UnifiedVenue[]> {
  const venues = await loadAllUnifiedVenues();
  return venues.filter((v) => v.league === 'MiLB' && v.level === level);
}

// Re-export constants that don't require data
export const ALL_LEAGUES = ['MLB', 'NFL', 'MiLB'] as const;

export function getAllLeagues() {
  return ALL_LEAGUES;
}

export function getMiLBLevels() {
  return ['AAA', 'AA', 'A+', 'A'];
}

export function getLeagueInfo(league: string) {
  const leagueInfo: Record<string, any> = {
    MLB: {
      name: 'Major League Baseball',
      sport: 'baseball',
      season: { start: 'April', end: 'October' },
      typicalGameTimes: ['12:00', '13:00', '19:00']
    },
    NFL: {
      name: 'National Football League',
      sport: 'football',
      season: { start: 'September', end: 'February' },
      typicalGameTimes: ['13:00', '16:00', '20:00']
    },
    MiLB: {
      name: 'Minor League Baseball',
      sport: 'baseball',
      season: { start: 'April', end: 'September' },
      typicalGameTimes: ['12:00', '18:00', '19:00']
    }
  };
  return leagueInfo[league] || null;
}

/**
 * Stadium Data Freshness Tracking
 *
 * Centralized tracking of when each stadium's data was last updated.
 * This allows us to show data freshness without modifying every section file.
 */

export interface StadiumDataFreshness {
  stadiumId: string;
  lastUpdated: string; // ISO 8601 date (YYYY-MM-DD)
  notes?: string; // Optional notes about the update
}

/**
 * MLB Stadium Data Freshness
 * Updated sections in Phase 1 (Steps 1.3-1.5)
 */
export const mlbDataFreshness: StadiumDataFreshness[] = [
  { stadiumId: 'yankees', lastUpdated: '2024-12-15', notes: 'Step 1.1 - Already complete with 65 sections' },
  { stadiumId: 'redsox', lastUpdated: '2025-01-15', notes: 'Step 1.3 - Enhanced from 42 to 74 sections' },
  { stadiumId: 'braves', lastUpdated: '2025-01-18', notes: 'Step 1.4 - Enhanced from 39 to 63 sections' },
  { stadiumId: 'phillies', lastUpdated: '2025-01-20', notes: 'Step 1.5 - Enhanced from 11 to 79 sections' },
  { stadiumId: 'rays', lastUpdated: '2024-12-15', notes: 'Step 1.1 - Already complete with 65 sections' },
  { stadiumId: 'athletics', lastUpdated: '2024-12-15', notes: 'Step 1.1 - Already complete with 65 sections' },

  // Other MLB stadiums - need enhancement (basic data from initial implementation)
  { stadiumId: 'dodgers', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'giants', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'cubs', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'padres', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'rockies', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'orioles', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'cardinals', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'mariners', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'astros', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'rangers', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'diamondbacks', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'reds', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'pirates', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'mets', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'nationals', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'twins', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'guardians', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'whitesox', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'tigers', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'royals', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'angels', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'marlins', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'brewers', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
  { stadiumId: 'bluejays', lastUpdated: '2024-10-01', notes: 'Basic section data - needs row-level enhancement' },
];

/**
 * MiLB Stadium Data Freshness
 * Step 4.2 - Lehigh Valley enhanced from 29 to 87 sections
 */
export const milbDataFreshness: StadiumDataFreshness[] = [
  { stadiumId: 'lehigh-valley-ironpigs', lastUpdated: '2025-01-27', notes: 'Step 4.2 - Enhanced from 29 to 87 sections' },

  // Other top 30 MiLB stadiums - need enhancement
  { stadiumId: 'dayton-dragons', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'richmond-flying-squirrels', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'sacramento-river-cats', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'worcester-red-sox', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'omaha-storm-chasers', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'louisville-bats', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'charlotte-knights', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'columbus-clippers', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
  { stadiumId: 'toledo-mud-hens', lastUpdated: '2024-09-01', notes: 'Basic data - needs row-level enhancement (Tier 1)' },
];

/**
 * NFL Stadium Data Freshness
 * Initial data from early implementation
 */
export const nflDataFreshness: StadiumDataFreshness[] = [
  // NFL stadiums will be populated as they are added/updated
];

/**
 * Get last updated date for a stadium
 */
export function getStadiumLastUpdated(stadiumId: string): string | null {
  const allFreshness = [...mlbDataFreshness, ...milbDataFreshness, ...nflDataFreshness];
  const stadium = allFreshness.find(s => s.stadiumId === stadiumId);
  return stadium?.lastUpdated || null;
}

/**
 * Get freshness info for a stadium
 */
export function getStadiumFreshnessInfo(stadiumId: string): StadiumDataFreshness | null {
  const allFreshness = [...mlbDataFreshness, ...milbDataFreshness, ...nflDataFreshness];
  return allFreshness.find(s => s.stadiumId === stadiumId) || null;
}

/**
 * Check if stadium data is stale (>1 year old)
 */
export function isStadiumDataStale(stadiumId: string): boolean {
  const lastUpdated = getStadiumLastUpdated(stadiumId);
  if (!lastUpdated) return true;

  const date = new Date(lastUpdated);
  const now = new Date();
  const daysSince = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > 365;
}

/**
 * Check if stadium data is outdated (>2 years old)
 */
export function isStadiumDataOutdated(stadiumId: string): boolean {
  const lastUpdated = getStadiumLastUpdated(stadiumId);
  if (!lastUpdated) return true;

  const date = new Date(lastUpdated);
  const now = new Date();
  const daysSince = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > 730;
}

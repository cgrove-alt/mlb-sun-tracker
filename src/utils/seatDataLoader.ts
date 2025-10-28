/**
 * Seat Data Loader Utility
 * Handles lazy loading of seat data for individual sections and stadiums
 * Created: 2025-10-21
 */

import type {
  SectionSeatingData,
  SeatDataMetadata,
  StadiumSeatingStats,
  PreComputedSeatExposure,
} from '@/types/seat';
import { toDataStadiumId, stripSectionSuffix } from '@/utils/ids';

/**
 * Cache for loaded seat data to avoid repeated imports
 */
const seatDataCache = new Map<string, SectionSeatingData>();
const metadataCache = new Map<string, { metadata: SeatDataMetadata; stats: StadiumSeatingStats }>();
const precomputedCache = new Map<string, Record<string, number>>();

/**
 * Load seat data for a specific section
 * Fetches JSON from public directory (client-side only)
 * @param urlStadiumId - The stadium ID as used in URLs (e.g., 'dodgers')
 * @param sectionId - The section ID (may include suffix like "1DG", "48FD", etc.)
 */
export async function getSeatDataForSection(
  urlStadiumId: string,
  sectionId: string
): Promise<SectionSeatingData | null> {
  // Map the URL stadium ID to the actual data directory name
  const seatDataStadiumId = toDataStadiumId(urlStadiumId);

  // Strip suffix from section ID to get the JSON filename
  const jsonSectionId = stripSectionSuffix(sectionId);

  const cacheKey = `${seatDataStadiumId}-${jsonSectionId}`;

  // Check cache first
  if (seatDataCache.has(cacheKey)) {
    return seatDataCache.get(cacheKey)!;
  }

  try {
    // Fetch JSON file from public directory using mapped stadium ID and numeric section ID
    const response = await fetch(`/data/seats/${seatDataStadiumId}/${jsonSectionId}.json`);

    if (!response.ok) {
      console.warn(
        `Seat data not found for stadium "${urlStadiumId}" (mapped to "${seatDataStadiumId}"), section "${sectionId}" (JSON file: ${jsonSectionId}.json) - HTTP ${response.status}`
      );
      return null;
    }

    const sectionData: SectionSeatingData = await response.json();

    if (!sectionData) {
      console.error(
        `Empty seat data for section ${sectionId} (JSON: ${jsonSectionId}) at ${urlStadiumId} (${seatDataStadiumId})`
      );
      return null;
    }

    // Cache the data
    seatDataCache.set(cacheKey, sectionData);

    return sectionData;
  } catch (error) {
    console.error(
      `Failed to load seat data for ${urlStadiumId}/${sectionId} (mapped to ${seatDataStadiumId}/${jsonSectionId}.json):`,
      error
    );
    return null;
  }
}

/**
 * Load metadata and statistics for a stadium
 * @param urlStadiumId - The stadium ID as used in URLs
 */
export async function getStadiumSeatMetadata(
  urlStadiumId: string
): Promise<{ metadata: SeatDataMetadata; stats: StadiumSeatingStats } | null> {
  const seatDataStadiumId = toDataStadiumId(urlStadiumId);

  // Check cache
  if (metadataCache.has(seatDataStadiumId)) {
    return metadataCache.get(seatDataStadiumId)!;
  }

  try {
    const module = await import(`../data/seatData/${seatDataStadiumId}/metadata.ts`);

    const result = {
      metadata: module.metadata as SeatDataMetadata,
      stats: module.stats as StadiumSeatingStats,
    };

    metadataCache.set(seatDataStadiumId, result);

    return result;
  } catch (error) {
    console.warn(`Failed to load metadata for ${urlStadiumId} (${seatDataStadiumId}):`, error);
    return null;
  }
}

/**
 * Load pre-computed sun exposure data for a specific game time and month
 * @param stadiumId Stadium identifier
 * @param gameTime Time in HH:MM format (e.g., "13:00", "19:00")
 * @param month Month number 1-12
 */
export async function getPrecomputedExposure(
  stadiumId: string,
  gameTime: string,
  month: number
): Promise<Record<string, number> | null> {
  const cacheKey = `${stadiumId}-${gameTime}-${month}`;

  // Check cache
  if (precomputedCache.has(cacheKey)) {
    return precomputedCache.get(cacheKey)!;
  }

  try {
    // Determine which pre-computed file to load
    const timeSlot = getTimeSlot(gameTime);
    const monthName = getMonthName(month);

    // Try to fetch the JSON file
    const response = await fetch(
      `/data/seatData/${stadiumId}/precomputed/${timeSlot}-${monthName}.json`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Extract seat exposure map
    const seatExposures: Record<string, number> = data.seats || {};

    // Cache the result
    precomputedCache.set(cacheKey, seatExposures);

    return seatExposures;
  } catch (error) {
    console.warn(`Failed to load pre-computed data for ${stadiumId}:`, error);
    return null;
  }
}

/**
 * Batch load seat data for multiple sections
 * @param urlStadiumId - The stadium ID as used in URLs
 * @param sectionIds - Array of section IDs to load
 */
export async function getSeatDataForSections(
  urlStadiumId: string,
  sectionIds: string[]
): Promise<Map<string, SectionSeatingData>> {
  const results = new Map<string, SectionSeatingData>();

  // Load all sections in parallel
  const promises = sectionIds.map(async (sectionId) => {
    const data = await getSeatDataForSection(urlStadiumId, sectionId);
    if (data) {
      results.set(sectionId, data);
    }
  });

  await Promise.all(promises);

  return results;
}

/**
 * Check if seat data exists for a stadium
 */
export async function hasSeatData(stadiumId: string): Promise<boolean> {
  try {
    const metadata = await getStadiumSeatMetadata(stadiumId);
    return metadata !== null && metadata.stats.totalSeats > 0;
  } catch {
    return false;
  }
}

/**
 * Get list of sections with available seat data for a stadium
 */
export async function getAvailableSections(stadiumId: string): Promise<string[]> {
  try {
    const metadata = await getStadiumSeatMetadata(stadiumId);
    if (!metadata) {
      return [];
    }

    // In a real implementation, we might need to query a manifest file
    // For now, we'll return an empty array and implement this when needed
    return [];
  } catch {
    return [];
  }
}

/**
 * Clear the seat data cache
 */
export function clearSeatDataCache(): void {
  seatDataCache.clear();
  metadataCache.clear();
  precomputedCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    seatDataEntries: seatDataCache.size,
    metadataEntries: metadataCache.size,
    precomputedEntries: precomputedCache.size,
  };
}

// Helper functions

function getTimeSlot(gameTime: string): string {
  const hour = parseInt(gameTime.split(':')[0], 10);

  if (hour >= 11 && hour < 15) {
    return 'afternoon'; // 1pm games
  } else if (hour >= 15 && hour < 18) {
    return 'late-afternoon'; // 4pm games
  } else {
    return 'evening'; // 7pm+ games
  }
}

function getMonthName(month: number): string {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];
  return months[month - 1] || 'unknown';
}

/**
 * Helper to generate cache key for seat
 */
export function generateSeatCacheKey(
  stadiumId: string,
  sectionId: string,
  row: string,
  seatNumber: string
): string {
  return `${stadiumId}-${sectionId}-${row}-${seatNumber}`;
}

/**
 * Note: Precomputed sun data functions are available in ./precomputedSunLoader
 * They are not re-exported here to avoid bundling fs in client-side code.
 * Import them directly when needed in server-side code.
 */

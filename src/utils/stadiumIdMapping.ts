/**
 * Centralized Stadium ID Mapping Utility
 *
 * This utility provides consistent mapping between URL stadium IDs
 * and the actual directory names used for seat data storage.
 *
 * Most stadiums use the same ID for both URL and data directory,
 * but some (like Dodgers) require special mapping.
 */

/**
 * Map a URL stadium ID to the seat data directory name
 * @param urlStadiumId - The stadium ID used in URLs (e.g., 'dodgers', 'yankees')
 * @returns The directory name used in /public/data/seats/ and /src/data/seatData/
 */
export function getSeatDataStadiumId(urlStadiumId: string): string {
  // Special case mappings
  const mappings: Record<string, string> = {
    'dodgers': 'dodger-stadium',
    // Add any other special mappings here as needed
  };

  // Return mapped value if exists, otherwise return the original ID
  return mappings[urlStadiumId] || urlStadiumId;
}

/**
 * Reverse mapping: Get URL stadium ID from seat data directory name
 * @param seatDataId - The directory name used in data storage
 * @returns The stadium ID used in URLs
 */
export function getUrlStadiumId(seatDataId: string): string {
  // Reverse mappings
  const reverseMappings: Record<string, string> = {
    'dodger-stadium': 'dodgers',
    // Add any other reverse mappings here as needed
  };

  return reverseMappings[seatDataId] || seatDataId;
}

/**
 * Check if a stadium ID needs special mapping
 * @param stadiumId - The stadium ID to check
 * @returns true if the stadium requires special mapping
 */
export function needsMapping(stadiumId: string): boolean {
  return stadiumId === 'dodgers';
}

/**
 * Get all stadium IDs that have seat data available
 * This list should match the directories in /public/data/seats/
 */
export const SEAT_DATA_STADIUM_IDS = [
  'angels',
  'astros',
  'athletics',
  'bluejays',
  'braves',
  'brewers',
  'cardinals',
  'cubs',
  'diamondbacks',
  'dodger-stadium',
  'giants',
  'guardians',
  'mariners',
  'marlins',
  'mets',
  'nationals',
  'orioles',
  'padres',
  'phillies',
  'pirates',
  'rangers',
  'rays',
  'reds',
  'redsox',
  'rockies',
  'royals',
  'tigers',
  'twins',
  'whitesox',
  'yankees',
] as const;

export type SeatDataStadiumId = typeof SEAT_DATA_STADIUM_IDS[number];

/**
 * Validate if a stadium has seat data available
 * @param stadiumId - The URL stadium ID to check
 * @returns true if seat data exists for this stadium
 */
export function hasSeatData(stadiumId: string): boolean {
  const seatDataId = getSeatDataStadiumId(stadiumId);
  return SEAT_DATA_STADIUM_IDS.includes(seatDataId as SeatDataStadiumId);
}
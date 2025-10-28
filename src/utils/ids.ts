/**
 * Centralized ID Mapping Utility
 * Single source of truth for all stadium and section ID translations
 *
 * Problem: Multiple ID systems cause confusion
 * - URLs use friendly IDs: "dodgers", "yankees"
 * - Data directories use full names: "dodger-stadium", "yankees"
 * - Sections have suffixes in UI: "1DG", "48FD", "101LG"
 * - JSON files are numeric: "1.json", "48.json", "101.json"
 *
 * Solution: Single utility with clear, simple functions
 */

/**
 * Master stadium ID mapping
 * Only include stadiums where URL ID !== Data ID
 * If not in map, assume they're the same
 */
const STADIUM_ID_MAP: Record<string, string> = {
  // URL ID → Data Directory ID
  'dodgers': 'dodger-stadium',
  // Add more only if URL differs from data directory
  // Example: 'redsox': 'fenway-park' (if needed)
} as const;

/**
 * Convert URL stadium ID to data directory ID
 * Examples:
 * - "dodgers" → "dodger-stadium"
 * - "yankees" → "yankees" (no mapping needed)
 *
 * @param urlId - Stadium ID as it appears in URLs
 * @returns Stadium ID for data directory access
 */
export function toDataStadiumId(urlId: string): string {
  return STADIUM_ID_MAP[urlId] ?? urlId;
}

/**
 * Convert data directory ID to URL-friendly stadium ID
 * Examples:
 * - "dodger-stadium" → "dodgers"
 * - "yankees" → "yankees" (no mapping needed)
 *
 * @param dataId - Stadium ID from data directory
 * @returns Stadium ID for URL construction
 */
export function toUrlStadiumId(dataId: string): string {
  // Find the URL ID that maps to this data ID
  const entry = Object.entries(STADIUM_ID_MAP)
    .find(([_, data]) => data === dataId);

  // If found, return the URL ID; otherwise return dataId as-is
  return entry?.[0] ?? dataId;
}

/**
 * Strip section suffix to get numeric ID for JSON file lookup
 *
 * Stadium sections have descriptive suffixes in the UI:
 * - "1DG" = Dugout section 1
 * - "48FD" = Field Box section 48
 * - "101LG" = Loge Box section 101
 * - "27BL" = Baseline section 27
 *
 * But JSON files are just numeric:
 * - "1.json", "48.json", "101.json", "27.json"
 *
 * Special cases (preserved as-is):
 * - "10IR", "10RS", "10TD" - These exist as full names in JSON
 *
 * @param sectionId - Section ID with or without suffix
 * @returns Numeric section ID for JSON file lookup
 *
 * @example
 * stripSectionSuffix("1DG") → "1"
 * stripSectionSuffix("48FD") → "48"
 * stripSectionSuffix("101LG") → "101"
 * stripSectionSuffix("10IR") → "10IR" (preserved)
 * stripSectionSuffix("42") → "42" (already numeric)
 */
export function stripSectionSuffix(sectionId: string): string {
  // Already numeric? Return as-is
  if (/^\d+$/.test(sectionId)) {
    return sectionId;
  }

  // Special cases: Sections with specific suffixes that are NOT stripped
  // These exist as full filenames in the data (e.g., "10IR.json")
  const preservedSuffixes = ['IR', 'RS', 'TD'];
  for (const suffix of preservedSuffixes) {
    if (new RegExp(`^\\d+${suffix}$`).test(sectionId)) {
      return sectionId; // Keep the full ID
    }
  }

  // Extract numeric prefix (most common case)
  const numericMatch = sectionId.match(/^(\d+)/);
  if (numericMatch) {
    return numericMatch[1];
  }

  // Fallback: return as-is if no numeric part found
  // This shouldn't happen with valid section IDs
  console.warn(`stripSectionSuffix: Unable to parse section ID "${sectionId}"`);
  return sectionId;
}

/**
 * Get full section ID with suffix for display
 * Opposite of stripSectionSuffix - adds suffix back if needed
 *
 * Note: This requires section metadata to know which suffix to add
 * For now, this is a placeholder - implement when section metadata is available
 *
 * @param numericId - Numeric section ID
 * @param stadiumId - Stadium ID for context
 * @returns Section ID with appropriate suffix
 */
export function toDisplaySectionId(numericId: string, stadiumId?: string): string {
  // TODO: Load section metadata to determine correct suffix
  // For now, just return the numeric ID
  // Future: Look up from stadiumSections to get "1" → "1DG"
  return numericId;
}

/**
 * Generate a unique seat ID
 * Format: {stadiumId}-{sectionId}-{row}-{seatNumber}
 *
 * @example
 * generateSeatId("dodgers", "1DG", "A", "5") → "dodgers-1DG-A-5"
 */
export function generateSeatId(
  stadiumId: string,
  sectionId: string,
  row: string,
  seatNumber: string
): string {
  return `${stadiumId}-${sectionId}-${row}-${seatNumber}`;
}

/**
 * Parse a seat ID into its components
 *
 * @param seatId - Full seat ID
 * @returns Object with stadium, section, row, seat number
 *
 * @example
 * parseSeatId("dodgers-1DG-A-5") → { stadiumId: "dodgers", sectionId: "1DG", row: "A", seatNumber: "5" }
 */
export function parseSeatId(seatId: string): {
  stadiumId: string;
  sectionId: string;
  row: string;
  seatNumber: string;
} | null {
  const parts = seatId.split('-');
  if (parts.length < 4) {
    console.warn(`parseSeatId: Invalid seat ID format "${seatId}"`);
    return null;
  }

  return {
    stadiumId: parts[0],
    sectionId: parts[1],
    row: parts[2],
    seatNumber: parts.slice(3).join('-'), // In case seat number has dashes
  };
}

/**
 * Validate a stadium ID (URL format)
 * @param stadiumId - Stadium ID to validate
 * @returns true if valid
 */
export function isValidStadiumId(stadiumId: string): boolean {
  // Basic validation: lowercase letters, numbers, hyphens
  return /^[a-z0-9-]+$/.test(stadiumId);
}

/**
 * Validate a section ID
 * @param sectionId - Section ID to validate
 * @returns true if valid
 */
export function isValidSectionId(sectionId: string): boolean {
  // Sections can be: numeric, or numeric + suffix
  return /^[0-9]+[A-Z]*$/.test(sectionId);
}

// Type exports for convenience
export type StadiumId = string;
export type SectionId = string;
export type SeatId = string;

// World Cup 2026 Timezone Utilities
// Handles timezone conversions for World Cup matches across USA, Mexico, and Canada

import { WorldCupMatch } from '../data/worldcup2026/types';
import { getWorldCupVenueById } from '../data/worldcup2026/venues';

/**
 * Convert match time to ISO 8601 datetime string in venue local time
 * @param match - World Cup match
 * @returns ISO 8601 datetime string (e.g., "2026-06-11T17:00:00")
 */
export function getMatchLocalDateTime(match: WorldCupMatch): string {
  return `${match.date}T${match.kickoffTime}:00`;
}

/**
 * Convert match time to UTC
 * @param match - World Cup match
 * @returns Date object in UTC
 */
export function getMatchUTC(match: WorldCupMatch): Date | null {
  const venue = getWorldCupVenueById(match.venue);
  if (!venue) return null;

  const localDateTime = getMatchLocalDateTime(match);

  // Use Intl.DateTimeFormat to handle timezone conversion
  // This is a simplified approach - for production, consider using a library like date-fns-tz
  try {
    const date = new Date(localDateTime);

    // Get timezone offset for the venue
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: venue.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // Parse the local time in venue timezone
    const parts = formatter.formatToParts(date);
    const localYear = parts.find(p => p.type === 'year')?.value;
    const localMonth = parts.find(p => p.type === 'month')?.value;
    const localDay = parts.find(p => p.type === 'day')?.value;
    const localHour = parts.find(p => p.type === 'hour')?.value;
    const localMinute = parts.find(p => p.type === 'minute')?.value;

    if (!localYear || !localMonth || !localDay || !localHour || !localMinute) {
      return null;
    }

    // Create date string in venue's timezone
    const venueLocalStr = `${match.date}T${match.kickoffTime}:00`;

    // For a more accurate conversion, we'd need to handle DST
    // This is a simplified implementation
    const utcDate = new Date(venueLocalStr + getTimezoneOffsetString(venue.timezone, match.date));
    return utcDate;
  } catch (error) {
    console.error('Error converting match time to UTC:', error);
    return null;
  }
}

/**
 * Get timezone offset string for a given IANA timezone and date
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @param date - ISO date string
 * @returns Offset string (e.g., "-05:00")
 */
function getTimezoneOffsetString(timezone: string, date: string): string {
  // Standard timezone offsets (DST not accounted for - would need more complex logic)
  const offsets: Record<string, string> = {
    'America/New_York': '-04:00',      // EDT in June-July
    'America/Chicago': '-05:00',        // CDT in June-July
    'America/Los_Angeles': '-07:00',    // PDT in June-July
    'America/Denver': '-06:00',         // MDT in June-July
    'America/Toronto': '-04:00',        // EDT in June-July
    'America/Vancouver': '-07:00',      // PDT in June-July
    'America/Mexico_City': '-05:00',    // CDT (Mexico observes DST)
  };

  return offsets[timezone] || '-05:00'; // Default to CDT
}

/**
 * Format match time for display in user's local timezone
 * @param match - World Cup match
 * @param userTimezone - User's IANA timezone (optional, defaults to browser timezone)
 * @returns Formatted time string
 */
export function formatMatchTimeForUser(match: WorldCupMatch, userTimezone?: string): string {
  const venue = getWorldCupVenueById(match.venue);
  if (!venue) return `${match.date} ${match.kickoffTime}`;

  try {
    const localDateTime = getMatchLocalDateTime(match);
    const date = new Date(localDateTime + getTimezoneOffsetString(venue.timezone, match.date));

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting match time:', error);
    return `${match.date} ${match.kickoffTime}`;
  }
}

/**
 * Format match time for display in venue local time
 * @param match - World Cup match
 * @returns Formatted time string with venue name
 */
export function formatMatchTimeVenue(match: WorldCupMatch): string {
  const venue = getWorldCupVenueById(match.venue);
  if (!venue) return `${match.date} ${match.kickoffTime}`;

  try {
    const localDateTime = getMatchLocalDateTime(match);
    const date = new Date(localDateTime);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: venue.timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    return `${formatter.format(date)} (${venue.city})`;
  } catch (error) {
    console.error('Error formatting venue match time:', error);
    return `${match.date} ${match.kickoffTime} (${venue.city})`;
  }
}

/**
 * Check if a match is currently happening
 * @param match - World Cup match
 * @param currentTime - Current time (defaults to now)
 * @returns True if match is in progress
 */
export function isMatchLive(match: WorldCupMatch, currentTime: Date = new Date()): boolean {
  const matchStart = getMatchUTC(match);
  if (!matchStart) return false;

  const matchEnd = new Date(matchStart.getTime() + 2.5 * 60 * 60 * 1000); // Assume 2.5 hours duration

  return currentTime >= matchStart && currentTime <= matchEnd;
}

/**
 * Get time until match starts
 * @param match - World Cup match
 * @param currentTime - Current time (defaults to now)
 * @returns Time in milliseconds until match starts (negative if already started)
 */
export function getTimeUntilMatch(match: WorldCupMatch, currentTime: Date = new Date()): number {
  const matchStart = getMatchUTC(match);
  if (!matchStart) return 0;

  return matchStart.getTime() - currentTime.getTime();
}

/**
 * Format countdown to match
 * @param match - World Cup match
 * @returns Human-readable countdown string
 */
export function formatMatchCountdown(match: WorldCupMatch): string {
  const msUntil = getTimeUntilMatch(match);

  if (msUntil < 0) {
    if (isMatchLive(match)) {
      return 'LIVE NOW';
    }
    return 'Finished';
  }

  const days = Math.floor(msUntil / (1000 * 60 * 60 * 24));
  const hours = Math.floor((msUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Group matches by date
 * @param matches - Array of matches
 * @returns Matches grouped by date
 */
export function groupMatchesByDate(matches: WorldCupMatch[]): Record<string, WorldCupMatch[]> {
  return matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, WorldCupMatch[]>);
}

/**
 * Sort matches by kickoff time
 * @param matches - Array of matches
 * @returns Sorted matches
 */
export function sortMatchesByTime(matches: WorldCupMatch[]): WorldCupMatch[] {
  return [...matches].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.kickoffTime.localeCompare(b.kickoffTime);
  });
}

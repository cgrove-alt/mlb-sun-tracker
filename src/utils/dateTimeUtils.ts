import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

/**
 * Formats a date/time string to the user's local timezone with timezone abbreviation
 * @param dateString - ISO date string or Date object
 * @param formatString - Optional format string (defaults to time with timezone)
 * @returns Formatted date/time string in local timezone
 */
export const formatInLocalTimezone = (
  dateString: string | Date,
  formatString: string = 'h:mm a zzz'
): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Format directly in the user's timezone
    return formatInTimeZone(date, userTimezone, formatString);
  } catch (error) {
    console.error('Error formatting date in local timezone:', error);
    // Fallback to basic formatting
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  }
};

/**
 * Gets the user's timezone abbreviation (e.g., EST, PST, CST)
 * @returns Timezone abbreviation
 */
export const getTimezoneAbbreviation = (): string => {
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    return formatInTimeZone(now, userTimezone, 'zzz');
  } catch (error) {
    // Fallback to offset
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const sign = offset <= 0 ? '+' : '-';
    return `UTC${sign}${hours}`;
  }
};

/**
 * Formats game time with local timezone
 * @param gameDate - Game date/time
 * @param includeDate - Whether to include the date
 * @returns Formatted game time
 */
export const formatGameTime = (
  gameDate: string | Date,
  includeDate: boolean = false
): string => {
  const formatStr = includeDate ? 'MMM d, h:mm a zzz' : 'h:mm a zzz';
  return formatInLocalTimezone(gameDate, formatStr);
};

/**
 * Gets a user-friendly timezone description
 * @returns Timezone description (e.g., "Eastern Time")
 */
export const getTimezoneDescription = (): string => {
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    return formatInTimeZone(now, userTimezone, 'zzzz');
  } catch (error) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
};
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Formats a date to show local time with timezone abbreviation
 * @param date - The date to format
 * @param timezone - IANA timezone identifier (e.g., 'America/Los_Angeles')
 * @returns Formatted time string with timezone (e.g., "7:30 PM PDT")
 */
export function formatTimeWithTimezone(date: Date, timezone: string): string {
  // Convert to local timezone
  const zonedDate = toZonedTime(date, timezone);
  
  // Format the time
  const timeString = format(zonedDate, 'h:mm a');
  
  // Get timezone abbreviation
  const timezoneAbbr = getTimezoneAbbreviation(date, timezone);
  
  return `${timeString} ${timezoneAbbr}`;
}

/**
 * Gets the timezone abbreviation for a given date and timezone
 * @param date - The date to get timezone info for
 * @param timezone - IANA timezone identifier
 * @returns Timezone abbreviation (e.g., "PDT", "EST", "CST")
 */
export function getTimezoneAbbreviation(date: Date, timezone: string): string {
  try {
    // Use Intl.DateTimeFormat to get timezone abbreviation
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    
    return timeZonePart?.value || 'UTC';
  } catch (error) {
    console.error('Error getting timezone abbreviation:', error);
    return 'UTC';
  }
}

/**
 * Formats a date to show local date and time with timezone
 * @param date - The date to format
 * @param timezone - IANA timezone identifier
 * @returns Formatted date and time string (e.g., "Jul 20, 2024 at 7:30 PM PDT")
 */
export function formatDateTimeWithTimezone(date: Date, timezone: string): string {
  // Convert to local timezone
  const zonedDate = toZonedTime(date, timezone);
  
  // Format the date and time
  const dateString = format(zonedDate, 'MMM dd, yyyy');
  const timeString = format(zonedDate, 'h:mm a');
  
  // Get timezone abbreviation
  const timezoneAbbr = getTimezoneAbbreviation(date, timezone);
  
  return `${dateString} at ${timeString} ${timezoneAbbr}`;
}
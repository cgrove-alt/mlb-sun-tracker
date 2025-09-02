/**
 * Stadium Timezone Utilities
 * Provides accurate timezone handling for stadium-specific solar calculations
 */

/**
 * Get the UTC offset in hours for a specific timezone and date
 * Accounts for daylight saving time transitions
 */
export function getTimezoneOffset(date: Date, timezone: string): number {
  // Create formatter for the specific timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset'
  });

  // Format the date in the target timezone
  const parts = formatter.formatToParts(date);
  const timeZoneName = parts.find(p => p.type === 'timeZoneName')?.value || '';
  
  // Extract offset from timezone name (e.g., "GMT-07:00" -> -7)
  const match = timeZoneName.match(/GMT([+-]\d{1,2}):?(\d{2})?/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours + (hours < 0 ? -minutes / 60 : minutes / 60);
  }

  // Fallback: calculate offset by comparing local and UTC times
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
}

/**
 * Convert a local date/time string to a Date object in the stadium's timezone
 * @param localDateTimeStr - Local date/time string (e.g., "2024-07-04 15:00:00")
 * @param timezone - IANA timezone identifier (e.g., "America/New_York")
 */
export function createStadiumDate(localDateTimeStr: string, timezone: string): Date {
  // Parse the local date/time components
  const [datePart, timePart] = localDateTimeStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = (timePart || '12:00:00').split(':').map(Number);

  // Create date in the stadium's timezone
  // We need to create the date as if it's in the target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Create a date object and adjust it to match the target timezone
  // Start with a date in UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  
  // Get the offset for this specific date/time in the target timezone
  const offset = getTimezoneOffset(utcDate, timezone);
  
  // Adjust the UTC date by the offset to get the correct moment in time
  const adjustedDate = new Date(utcDate.getTime() - offset * 60 * 60 * 1000);
  
  return adjustedDate;
}

/**
 * Get the current date/time in a stadium's timezone
 */
export function getCurrentStadiumTime(timezone: string): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const dateParts: { [key: string]: string } = {};
  parts.forEach(p => {
    if (p.type !== 'literal') {
      dateParts[p.type] = p.value;
    }
  });

  return new Date(
    parseInt(dateParts.year),
    parseInt(dateParts.month) - 1,
    parseInt(dateParts.day),
    parseInt(dateParts.hour),
    parseInt(dateParts.minute),
    parseInt(dateParts.second || '0')
  );
}

/**
 * Check if a date is during daylight saving time for a timezone
 */
export function isDST(date: Date, timezone: string): boolean {
  const january = new Date(date.getFullYear(), 0, 1);
  const july = new Date(date.getFullYear(), 6, 1);
  
  const janOffset = getTimezoneOffset(january, timezone);
  const julOffset = getTimezoneOffset(july, timezone);
  
  const currentOffset = getTimezoneOffset(date, timezone);
  
  // In Northern Hemisphere, DST makes offset less negative (closer to 0)
  // In Southern Hemisphere, it's opposite
  const maxOffset = Math.max(janOffset, julOffset);
  return currentOffset === maxOffset;
}

/**
 * Stadium timezone database with DST rules
 */
export const STADIUM_TIMEZONES = {
  // Eastern Time
  'America/New_York': { standard: -5, dst: -4, months: [3, 11] },
  'America/Toronto': { standard: -5, dst: -4, months: [3, 11] },
  
  // Central Time
  'America/Chicago': { standard: -6, dst: -5, months: [3, 11] },
  
  // Mountain Time
  'America/Denver': { standard: -7, dst: -6, months: [3, 11] },
  'America/Phoenix': { standard: -7, dst: -7, months: null }, // No DST
  
  // Pacific Time
  'America/Los_Angeles': { standard: -8, dst: -7, months: [3, 11] },
  
  // Special cases
  'Pacific/Honolulu': { standard: -10, dst: -10, months: null }, // No DST
} as const;

/**
 * Get accurate timezone offset for NREL calculations
 * @param date - The date to check
 * @param timezone - IANA timezone identifier
 * @returns Offset in hours from UTC
 */
export function getNRELTimezoneOffset(date: Date, timezone: string): number {
  // Use the accurate offset calculation
  return getTimezoneOffset(date, timezone);
}

/**
 * Convert Date to UTC components for NREL algorithm
 */
export function dateToUTCComponents(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds()
  };
}

/**
 * Validate timezone string
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
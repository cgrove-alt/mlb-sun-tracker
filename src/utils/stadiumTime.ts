// Stadium-local time → UTC conversion utilities.
//
// Context: every shade query is fundamentally "what does the sun look like
// at the stadium at HH:MM local time on date YYYY-MM-DD?" The solar-position
// calculator needs a UTC Date plus lat/lon. The conversion from local
// wall-clock time at the stadium to UTC depends on the stadium's IANA
// timezone, including DST transitions. Doing this naively with
// `new Date('2025-07-04T19:30')` or `date.setHours(19, 30)` produces a Date
// in the *runtime's* timezone (UTC on Vercel) — which is wrong by the
// stadium's UTC offset, for every stadium not in UTC.
//
// This file centralizes the conversion so we have one place to test, one
// place to fix when DST rules change, and one signature for every caller.

import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';

export type IanaTimezone = string;

const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True when `value` is a calendar date `YYYY-MM-DD` with no time or zone. */
export function isIsoDateOnly(value: string): boolean {
  return ISO_DATE_ONLY.test(value);
}

/**
 * Convert a stadium-local calendar date + clock hour/minute to the UTC instant.
 *
 * Use this whenever the date originated as a `YYYY-MM-DD` string (query
 * parameter, `<input type="date">`, a test fixture). Do NOT pass
 * `new Date('YYYY-MM-DD')` into `stadiumLocalDateAndTimeToUTC` — ES5 parses
 * date-only ISO strings as UTC midnight, which is the previous evening in
 * every US stadium timezone, silently shifting the calculation by one day.
 */
export function calendarDateAndTimeToUTC(
  dateStr: string,
  hour: number,
  minute: number,
  timezone: IanaTimezone,
): Date {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error(`calendarDateAndTimeToUTC: invalid hour ${hour}`);
  }
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new Error(`calendarDateAndTimeToUTC: invalid minute ${minute}`);
  }
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  return stadiumLocalToUTC(dateStr, timeStr, timezone);
}

/**
 * Convert a stadium-local wall-clock moment (date + time + timezone) to the
 * UTC Date instant. Use this for every time input that originates as a
 * stadium-local value (game start time, an HH:MM query parameter, a static
 * "1pm representative hour", etc.) before handing it to the solar calculator.
 *
 * @param dateStr ISO date string YYYY-MM-DD interpreted in the stadium's timezone.
 * @param timeStr 24-hour HH:MM string interpreted in the stadium's timezone.
 * @param timezone IANA timezone name (e.g. "America/Chicago"). Required.
 * @returns A Date whose .getTime() is the correct UTC instant for that
 *   local wall-clock moment at that stadium, honoring DST.
 */
export function stadiumLocalToUTC(
  dateStr: string,
  timeStr: string,
  timezone: IanaTimezone,
): Date {
  if (!timezone) {
    throw new Error('stadiumLocalToUTC: timezone is required');
  }
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!dateMatch) {
    throw new Error(`stadiumLocalToUTC: invalid date '${dateStr}', expected YYYY-MM-DD`);
  }
  const timeMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(timeStr);
  if (!timeMatch) {
    throw new Error(`stadiumLocalToUTC: invalid time '${timeStr}', expected HH:MM`);
  }

  // Build an ISO local string that date-fns-tz will interpret in `timezone`.
  // fromZonedTime treats the input as wall-clock in the given zone and
  // returns the equivalent UTC Date. It correctly resolves DST including
  // the spring-forward 02:30 gap (the wall-clock time that doesn't exist)
  // and fall-back 01:30 ambiguity per RFC.
  const [, y, m, d] = dateMatch;
  const [, h, mn, s] = timeMatch;
  const localISO = `${y}-${m}-${d}T${h.padStart(2, '0')}:${mn}:${(s ?? '00').padStart(2, '0')}`;
  const utc = fromZonedTime(localISO, timezone);
  if (isNaN(utc.getTime())) {
    throw new Error(
      `stadiumLocalToUTC: produced invalid Date from '${localISO}' in '${timezone}'`,
    );
  }
  return utc;
}

/**
 * Combine a real UTC instant with a stadium-local clock time.
 *
 * The calendar date is the stadium-local date of `dateOnly` — correct for
 * "the game Date from the MLB API, at this HH:MM". It is NOT correct for
 * date-only strings: `new Date('YYYY-MM-DD')` is UTC midnight, which is the
 * previous evening in every US park. Use `calendarDateAndTimeToUTC` for
 * those.
 */
export function stadiumLocalDateAndTimeToUTC(
  dateOnly: Date,
  hour: number,
  minute: number,
  timezone: IanaTimezone,
): Date {
  // Render the date in the stadium's timezone to capture the correct local
  // calendar date (NOT the UTC date of `dateOnly`, which may roll over).
  const localDateStr = formatInTimeZone(dateOnly, timezone, 'yyyy-MM-dd');
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  return stadiumLocalToUTC(localDateStr, timeStr, timezone);
}

/**
 * Format a UTC Date as a stadium-local string for display.
 * Pure convenience wrapper around date-fns-tz so call sites don't import it directly.
 */
export function formatStadiumLocal(
  utc: Date,
  timezone: IanaTimezone,
  pattern = 'yyyy-MM-dd HH:mm',
): string {
  return formatInTimeZone(utc, timezone, pattern);
}

/**
 * Get a stadium-local Date snapshot of a UTC instant for client-side
 * display calculations. The returned Date is a JavaScript Date whose UTC
 * fields equal the stadium-local components — useful for libraries that
 * read .getHours() etc. and expect them to reflect the stadium's wall
 * clock.
 */
export function utcToStadiumLocal(utc: Date, timezone: IanaTimezone): Date {
  return toZonedTime(utc, timezone);
}

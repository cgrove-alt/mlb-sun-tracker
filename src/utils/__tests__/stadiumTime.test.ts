/**
 * Tests for stadium-local → UTC conversion. The bug being prevented:
 * `new Date('2025-07-04T19:30')` and `date.setHours(19, 30)` both produce
 * a Date in the RUNTIME's timezone (UTC on Vercel) — not the stadium's.
 * For Chicago that meant the route computed sun position for the wrong
 * real-world moment by the stadium's UTC offset (5 hours in summer).
 *
 * These tests pin the conversion for the three common US timezones
 * (Eastern, Central, Pacific) at both DST and standard-time dates, plus
 * both DST transition edges.
 */

import {
  stadiumLocalToUTC,
  stadiumLocalDateAndTimeToUTC,
  formatStadiumLocal,
} from '../stadiumTime';

describe('stadiumLocalToUTC', () => {
  it('Chicago summer (CDT, UTC-5)', () => {
    const utc = stadiumLocalToUTC('2025-07-04', '19:30', 'America/Chicago');
    expect(utc.toISOString()).toBe('2025-07-05T00:30:00.000Z');
  });

  it('Chicago winter (CST, UTC-6)', () => {
    const utc = stadiumLocalToUTC('2025-12-15', '19:30', 'America/Chicago');
    expect(utc.toISOString()).toBe('2025-12-16T01:30:00.000Z');
  });

  it('New York summer (EDT, UTC-4)', () => {
    const utc = stadiumLocalToUTC('2025-07-04', '19:30', 'America/New_York');
    expect(utc.toISOString()).toBe('2025-07-04T23:30:00.000Z');
  });

  it('Los Angeles summer (PDT, UTC-7)', () => {
    const utc = stadiumLocalToUTC('2025-07-04', '19:30', 'America/Los_Angeles');
    expect(utc.toISOString()).toBe('2025-07-05T02:30:00.000Z');
  });

  it('Phoenix (MST, no DST)', () => {
    const summer = stadiumLocalToUTC('2025-07-04', '19:30', 'America/Phoenix');
    expect(summer.toISOString()).toBe('2025-07-05T02:30:00.000Z');
    const winter = stadiumLocalToUTC('2025-12-15', '19:30', 'America/Phoenix');
    expect(winter.toISOString()).toBe('2025-12-16T02:30:00.000Z');
  });

  it('Honolulu (HST, UTC-10, no DST)', () => {
    const utc = stadiumLocalToUTC('2025-07-04', '19:30', 'Pacific/Honolulu');
    expect(utc.toISOString()).toBe('2025-07-05T05:30:00.000Z');
  });

  // DST transition: 2025-03-09 in Chicago, clocks jump from 02:00 CST to 03:00 CDT.
  // 03:30 the morning of Mar 9 in Chicago is the first valid moment after the
  // skip — it's CDT (UTC-5), so 03:30 CDT = 08:30 UTC.
  it('handles DST spring-forward (Chicago Mar 9 2025 at 03:30)', () => {
    const utc = stadiumLocalToUTC('2025-03-09', '03:30', 'America/Chicago');
    expect(utc.toISOString()).toBe('2025-03-09T08:30:00.000Z');
  });

  // DST transition: 2025-11-02 in Chicago, clocks fall back from 02:00 CDT to 01:00 CST.
  // 01:30 is ambiguous (occurs twice). fromZonedTime picks the first occurrence
  // (CDT, UTC-5), so 01:30 ≈ 06:30 UTC.
  it('handles DST fall-back (Chicago Nov 2 2025 at 01:30 — ambiguous)', () => {
    const utc = stadiumLocalToUTC('2025-11-02', '01:30', 'America/Chicago');
    expect(utc.toISOString()).toBe('2025-11-02T06:30:00.000Z');
  });

  it('throws on missing timezone', () => {
    expect(() => stadiumLocalToUTC('2025-07-04', '19:30', '')).toThrow(/timezone is required/);
  });

  it('throws on invalid date', () => {
    expect(() => stadiumLocalToUTC('2025/07/04', '19:30', 'America/Chicago')).toThrow(/invalid date/);
  });

  it('throws on invalid time', () => {
    expect(() => stadiumLocalToUTC('2025-07-04', '7:30PM', 'America/Chicago')).toThrow(/invalid time/);
  });

  it('accepts seconds in the time portion', () => {
    const utc = stadiumLocalToUTC('2025-07-04', '19:30:45', 'America/Chicago');
    expect(utc.toISOString()).toBe('2025-07-05T00:30:45.000Z');
  });
});

describe('stadiumLocalDateAndTimeToUTC', () => {
  it('uses the stadium-local calendar date of the input Date, not the UTC date', () => {
    // 2025-07-04T03:30:00Z is July 4 in UTC, but July 3 22:30 in CDT.
    // We want to combine "the calendar date the stadium is on" with the
    // provided hour/minute, both in the stadium's tz. So passing this date
    // with hour=19, minute=30 should be interpreted as "July 3 19:30 CDT"
    // (since the stadium calendar at that UTC moment was July 3).
    const inputUtc = new Date('2025-07-04T03:30:00Z');
    const result = stadiumLocalDateAndTimeToUTC(inputUtc, 19, 30, 'America/Chicago');
    expect(result.toISOString()).toBe('2025-07-04T00:30:00.000Z');
  });
});

describe('formatStadiumLocal', () => {
  it('renders a UTC instant in the stadium tz', () => {
    const utc = new Date('2025-07-05T00:30:00Z'); // 19:30 CDT on July 4
    expect(formatStadiumLocal(utc, 'America/Chicago')).toBe('2025-07-04 19:30');
  });

  it('renders the same UTC instant differently in different stadium tzs', () => {
    const utc = new Date('2025-07-05T00:30:00Z');
    expect(formatStadiumLocal(utc, 'America/New_York')).toBe('2025-07-04 20:30');
    expect(formatStadiumLocal(utc, 'America/Los_Angeles')).toBe('2025-07-04 17:30');
  });
});

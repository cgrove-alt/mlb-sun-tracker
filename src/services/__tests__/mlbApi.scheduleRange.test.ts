import { upcomingScheduleRange } from '../mlbApi';

// MLB's schedule API rejects a range whose end date is before its start date
// with HTTP 400 ("endDate must be after startDate"). The site used to end the
// range on Oct 31 of the current year, so every request from Nov 1 on failed
// and fans saw "Unable to load games".
describe('upcomingScheduleRange', () => {
  it('stays valid in the offseason (the Nov 10 bug)', () => {
    const { startDate, endDate } = upcomingScheduleRange(new Date(2026, 10, 10, 12, 0));
    expect(startDate).toBe('2026-11-10');
    expect(endDate > startDate).toBe(true);
    // Reaches next season's opening day (late March).
    expect(endDate >= '2027-04-01').toBe(true);
  });

  it('covers the rest of the regular season mid-year', () => {
    const { startDate, endDate } = upcomingScheduleRange(new Date(2025, 6, 15, 12, 0));
    expect(startDate).toBe('2025-07-15');
    expect(endDate >= '2025-09-28').toBe(true);
  });

  it('uses the local calendar date, not the UTC date', () => {
    // 11:30 PM local time is already the next day in UTC for US time zones.
    const lateEvening = new Date(2025, 6, 15, 23, 30);
    expect(upcomingScheduleRange(lateEvening).startDate).toBe('2025-07-15');
  });

  it('formats both dates as YYYY-MM-DD', () => {
    const { startDate, endDate } = upcomingScheduleRange(new Date(2025, 0, 5));
    expect(startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

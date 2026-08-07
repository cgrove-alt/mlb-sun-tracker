/**
 * The game dropdown rendered a team's full home schedule (78+ entries) as one
 * flat list. react-select turns `{ label, options }` entries into group
 * headings, so grouping by month makes the list navigable.
 *
 * @jest-environment node
 */

import { groupOptionsByMonth } from '../groupOptionsByMonth';

interface Game { id: string; gameDate: string }

const games = (...dates: string[]): Game[] =>
  dates.map((d, i) => ({ id: `g${i}`, gameDate: d }));

const group = (items: Game[]) =>
  groupOptionsByMonth(items, g => new Date(g.gameDate), g => ({ value: g.id, label: g.gameDate }));

describe('groupOptionsByMonth', () => {
  it('splits a season into month groups', () => {
    const result = group(games(
      '2025-04-05T18:00:00Z',
      '2025-04-20T18:00:00Z',
      '2025-05-02T18:00:00Z',
      '2025-07-14T18:00:00Z',
    ));

    expect(result.map(g => g.label)).toEqual(['April', 'May', 'July']);
    expect(result.map(g => g.options.length)).toEqual([2, 1, 1]);
  });

  it('keeps every game — none dropped by grouping', () => {
    const input = games(
      '2025-04-05T18:00:00Z', '2025-06-05T18:00:00Z', '2025-04-06T18:00:00Z',
      '2025-09-30T18:00:00Z', '2025-06-06T18:00:00Z',
    );
    const result = group(input);
    const total = result.reduce((n, g) => n + g.options.length, 0);
    expect(total).toBe(input.length);
  });

  it('orders groups chronologically even when input is unsorted', () => {
    const result = group(games(
      '2025-09-01T18:00:00Z',
      '2025-04-01T18:00:00Z',
      '2025-06-01T18:00:00Z',
    ));
    expect(result.map(g => g.label)).toEqual(['April', 'June', 'September']);
  });

  it('does not qualify month names with the year within a single season', () => {
    const result = group(games('2025-04-05T18:00:00Z', '2025-05-05T18:00:00Z'));
    expect(result.map(g => g.label)).toEqual(['April', 'May']);
  });

  // Otherwise two seasons would render two identical "April" headings.
  it('qualifies month names with the year when the range spans years', () => {
    const result = group(games('2025-09-05T18:00:00Z', '2026-04-05T18:00:00Z'));
    expect(result.map(g => g.label)).toEqual(['September 2025', 'April 2026']);
  });

  it('skips entries with an unparseable date rather than crashing', () => {
    const result = group(games('2025-04-05T18:00:00Z', 'not-a-date', '2025-04-06T18:00:00Z'));
    expect(result).toHaveLength(1);
    expect(result[0].options).toHaveLength(2);
  });

  it('returns an empty array for no games', () => {
    expect(group([])).toEqual([]);
  });

  it('handles a realistic 81-game home schedule', () => {
    // ~81 home games spread Apr–Sep, the case that made the flat list unusable.
    const season: Game[] = [];
    let d = new Date('2025-04-01T18:00:00Z');
    for (let i = 0; i < 81; i++) {
      season.push({ id: `g${i}`, gameDate: d.toISOString() });
      d = new Date(d.getTime() + 2 * 24 * 60 * 60 * 1000);
    }
    const result = group(season);

    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.reduce((n, g) => n + g.options.length, 0)).toBe(81);
    // No group should be so large that it defeats the point.
    expect(Math.max(...result.map(g => g.options.length))).toBeLessThan(40);
  });
});

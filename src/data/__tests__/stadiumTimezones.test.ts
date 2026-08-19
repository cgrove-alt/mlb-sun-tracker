/**
 * Timezone regression tests.
 *
 * Four MLB stadiums shipped with the wrong IANA timezone, putting every shade
 * calculation for them off by a full hour. The Guardians case is the instructive
 * one: it was corrected in `stadiums.ts` but not in `unifiedVenues.ts`, so the
 * bug stayed live on every code path that reads the unified data.
 *
 * These tests lock in the correct values AND assert the two files agree, so the
 * same silent drift cannot happen again.
 */
import { MLB_STADIUMS } from '../stadiums';
import { ALL_UNIFIED_VENUES } from '../unifiedVenues';

/** UTC offset (hours) for an IANA zone at a given instant. */
function utcOffsetHours(timezone: string, when: Date): number {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  })
    .formatToParts(when)
    .find(p => p.type === 'timeZoneName')?.value ?? '';

  const m = name.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  if (!m) return 0; // GMT with no offset
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) / 60 : 0));
}

// Mid-season date: all US zones except Arizona are on daylight time.
const MID_SEASON = new Date('2025-07-04T18:00:00Z');

describe('MLB stadium timezones', () => {
  it('has exactly 30 stadiums', () => {
    expect(MLB_STADIUMS).toHaveLength(30);
  });

  it('gives every stadium a valid IANA timezone', () => {
    for (const s of MLB_STADIUMS) {
      expect(typeof s.timezone).toBe('string');
      expect(s.timezone.length).toBeGreaterThan(0);
      expect(() => new Intl.DateTimeFormat('en-US', { timeZone: s.timezone })).not.toThrow();
    }
  });

  // The four stadiums that were wrong, plus their geographic justification.
  describe.each([
    ['rangers', 'America/Chicago', -5, 'Arlington TX is Central, not Mountain'],
    ['reds', 'America/New_York', -4, 'all of Ohio is Eastern, not Central'],
    ['tigers', 'America/Detroit', -4, "Michigan's Lower Peninsula is Eastern; America/Detroit is the IANA zone"],
    ['guardians', 'America/New_York', -4, 'Cleveland OH is Eastern, not Central'],
  ])('%s', (id, expectedZone, expectedOffset, why) => {
    it(`uses ${expectedZone} (${why})`, () => {
      const stadium = MLB_STADIUMS.find(s => s.id === id);
      expect(stadium).toBeDefined();
      expect(stadium!.timezone).toBe(expectedZone);
    });

    it(`resolves to UTC${expectedOffset} mid-season`, () => {
      const stadium = MLB_STADIUMS.find(s => s.id === id)!;
      expect(utcOffsetHours(stadium.timezone, MID_SEASON)).toBe(expectedOffset);
    });
  });

  it('puts Arizona on a zone that does not observe DST', () => {
    const dbacks = MLB_STADIUMS.find(s => s.id === 'diamondbacks')!;
    expect(dbacks.timezone).toBe('America/Phoenix');
    const january = new Date('2025-01-15T18:00:00Z');
    expect(utcOffsetHours(dbacks.timezone, MID_SEASON))
      .toBe(utcOffsetHours(dbacks.timezone, january));
  });
});

describe('stadiums.ts and unifiedVenues.ts agree', () => {
  const unifiedMlb = ALL_UNIFIED_VENUES.filter(v => v.league === 'MLB');

  it('covers the same MLB venue ids in both files', () => {
    expect(new Set(unifiedMlb.map(v => v.id)))
      .toEqual(new Set(MLB_STADIUMS.map(s => s.id)));
  });

  // This is the guard that would have caught the Guardians bug — and the
  // later Marlins orientation / Athletics coordinate drift.
  it.each(MLB_STADIUMS.map(s => [s.id] as const))(
    '%s has the same shade-critical geometry in both files',
    (id) => {
      const stadium = MLB_STADIUMS.find(s => s.id === id)!;
      const unified = unifiedMlb.find(v => v.id === id);
      expect(unified).toBeDefined();
      expect(unified!.timezone).toBe(stadium.timezone);
      expect(unified!.orientation).toBe(stadium.orientation);
      expect(unified!.latitude).toBe(stadium.latitude);
      expect(unified!.longitude).toBe(stadium.longitude);
      expect(unified!.roof).toBe(stadium.roof);
    }
  );
});

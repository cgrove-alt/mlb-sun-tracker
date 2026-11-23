/** @jest-environment node */
import { ALL_UNIFIED_VENUES } from '../unifiedVenues';
import { getVenueSections } from '../venueSections';

const venues = (league: string) => ALL_UNIFIED_VENUES.filter((venue) => venue.league === league);

describe('section lists by league', () => {
  it('MiLB parks have none: we have no seating maps for them', () => {
    const listed = venues('MiLB').filter((venue) => getVenueSections(venue.id).length > 0);
    expect(listed.map((venue) => venue.id)).toEqual([]);
  });

  it('NFL stadiums keep theirs', () => {
    const counts = venues('NFL').map((venue) => getVenueSections(venue.id).length);
    expect(counts.filter((count) => count === 60)).toHaveLength(29);
    expect([...counts].sort((a, b) => a - b)).toEqual([0, 12, ...Array(29).fill(60), 66]);
  });
});

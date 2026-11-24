import { getStadiumGuide } from '../guides';
import { NFL_STADIUMS } from '../nflStadiums';
import { getUnifiedVenueById } from '../unifiedVenues';
import { kickoffSunSides } from '../../utils/nflSunSide';

// The Bills moved across the street in 2026. Their old field ran 123°.
const highmark = getUnifiedVenueById('highmark-stadium')!;

describe("the Bills' stadium", () => {
  it('shades the west sideline at both kickoffs, and the south end zone at 1:00', () => {
    const { early, late } = kickoffSunSides(highmark);
    expect([early.clear, early.shadedSideline, early.shadedEndZone]).toEqual([true, 'west', 'south']);
    expect([early.sunnySideline, early.sunFacingEndZone]).toEqual(['east', 'north']);
    expect([late.clear, late.shadedSideline, late.shadedEndZone]).toEqual([true, 'west', null]);
  });

  it.each([
    ['the venue', highmark],
    ['the NFL list', NFL_STADIUMS.find((stadium) => stadium.id === 'highmark-stadium')!],
  ])('%s has the new building', (_where, { latitude, longitude, capacity, opened, surface }) => {
    expect({ latitude, longitude, capacity, opened, surface })
      .toEqual({ latitude: 42.77306, longitude: -78.79222, capacity: 60108, opened: 2026, surface: 'grass' });
  });

  it("has a guide to the new building, with nothing of the old one's", () => {
    const guide = getStadiumGuide('highmark-stadium')!;
    expect([guide.opened, guide.capacity, guide.transportation.address])
      .toEqual([2026, 60108, '10 Bills Plaza, Orchard Park, NY 14127']);
    expect(guide.overview.description).toContain('canopy');
    // Its opening and names, its sections, clubs, gates and lots.
    expect(JSON.stringify(guide)).not.toMatch(
      /19\d\d|20(?:[01]\d|2[0-5])|71608|One Bills Drive|Rich Stadium|Ralph Wilson|New Era|\d{3}-\d{3}|Legends|Red Zone|Gate \w|Lots? [A-F]|[Nn]orth-south|[Bb]leacher/,
    );
  });
});

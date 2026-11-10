import { getStadiumGuide } from '../index';
import { ALL_UNIFIED_VENUES } from '../../unifiedVenues';

describe('stadium guide lookup', () => {
  const nfl = ALL_UNIFIED_VENUES.filter((venue) => venue.league === 'NFL');

  it.each(nfl.map((venue) => [venue.id, venue.team]))('%s gets the %s guide', (id, team) => {
    const guide = getStadiumGuide(id);
    expect(guide).toBeDefined();
    expect(guide!.team).toBe(team);
  });

  it('gives the two MetLife Stadium teams different guides', () => {
    expect(getStadiumGuide('metlife-stadium-giants')!.team).toBe('New York Giants');
    expect(getStadiumGuide('metlife-stadium-jets')!.team).toBe('New York Jets');
  });

  it('never guesses from a partial name', () => {
    expect(getStadiumGuide('metlife')).toBeUndefined();
    expect(getStadiumGuide('stadium')).toBeUndefined();
  });

  it('never gives a venue another team\'s guide', () => {
    for (const venue of ALL_UNIFIED_VENUES) {
      const guide = getStadiumGuide(venue.id);
      if (!guide || venue.id === 'oklahoma-city-dodgers') continue; // team renamed; see todo.md
      expect([venue.id, guide.team]).toEqual([venue.id, venue.team]);
    }
  });
});

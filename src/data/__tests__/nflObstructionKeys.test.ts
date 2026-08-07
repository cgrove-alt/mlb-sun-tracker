/**
 * Guards the NFL obstruction registry against key drift.
 *
 * Obstruction data is keyed by venue id, but several keys were written before
 * the venues were renamed (Paul Brown → Paycor, FedEx Field → Northwest, TIAA
 * Bank → EverBank, Cleveland Browns Stadium → Huntington Bank Field, Mercedes-
 * Benz Superdome → Caesars Superdome, Arrowhead → GEHA Field at Arrowhead) and
 * two shared venues (MetLife, SoFi) were keyed by bare venue name while the
 * venue data uses one id per tenant.
 *
 * Every one of those lookups failed silently — `getStadiumObstructions` just
 * returned [], so those stadiums were modelled as having no obstructions at all
 * rather than raising anything.
 *
 * @jest-environment node
 */

import { NFL_STADIUMS } from '../nflStadiums';
import { getStadiumObstructions, NFL_OBSTRUCTIONS } from '../stadiumObstructions';

describe('NFL obstruction registry keys', () => {
  it('resolves obstruction data for every NFL venue id', () => {
    const unresolved = NFL_STADIUMS.filter(
      s => getStadiumObstructions(s.id).length === 0
    ).map(s => `${s.id} (${s.team})`);

    expect(unresolved).toEqual([]);
  });

  it('has no obstruction key that matches no NFL venue', () => {
    const validIds = new Set(NFL_STADIUMS.map(s => s.id));
    const orphans = Object.keys(NFL_OBSTRUCTIONS).filter(k => !validIds.has(k));
    expect(orphans).toEqual([]);
  });

  // One building, two tenants: the data must be shared, not duplicated, so it
  // cannot drift apart.
  it.each([
    ['metlife-stadium-giants', 'metlife-stadium-jets'],
    ['sofi-stadium-chargers', 'sofi-stadium-rams'],
  ])('%s and %s share one obstruction set', (a, b) => {
    expect(NFL_OBSTRUCTIONS[a]).toBeDefined();
    expect(NFL_OBSTRUCTIONS[b]).toBe(NFL_OBSTRUCTIONS[a]);
  });

  it('does not retain the pre-rename venue keys', () => {
    const stale = [
      'paul-brown-stadium',
      'fedex-field',
      'tiaa-bank-field',
      'cleveland-browns-stadium',
      'mercedes-benz-superdome',
      'arrowhead-stadium',
      'm-and-t-bank-stadium',
      'metlife-stadium',
      'sofi-stadium',
    ].filter(k => k in NFL_OBSTRUCTIONS);

    expect(stale).toEqual([]);
  });
});

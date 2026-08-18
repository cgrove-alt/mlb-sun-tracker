/**
 * NFL field-axis provenance lockstep.
 *
 * @jest-environment node
 */

import { NFL_STADIUMS } from '../nflStadiums';
import { NFL_ORIENTATION_PROVENANCE } from '../nflOrientationProvenance';
import { getOrientationProvenance, getOrientationPrecision } from '../stadiumOrientationProvenance';

function normalize180(deg: number): number {
  return ((deg % 180) + 180) % 180;
}

function undirectedDelta(a: number, b: number): number {
  const d = Math.abs(normalize180(a) - normalize180(b));
  return Math.min(d, 180 - d);
}

describe('NFL orientation provenance', () => {
  it('covers every NFL franchise id exactly once', () => {
    expect(NFL_ORIENTATION_PROVENANCE.map((p) => p.stadiumId).sort())
      .toEqual(NFL_STADIUMS.map((s) => s.id).sort());
  });

  it.each(NFL_STADIUMS.map((s) => [s.id, s.orientation] as const))(
    '%s provenance matches authored orientation %i',
    (id, orientation) => {
      const provenance = getOrientationProvenance(id);
      expect(provenance).toBeDefined();
      expect(provenance!.orientation).toBe(orientation);
      expect(getOrientationPrecision(id)).toBe(provenance!.precisionDeg);
      expect(['verified', 'estimated', 'unverified']).toContain(provenance!.confidence);
      expect(provenance!.lastReviewed).toBe('2026-08-18');
    },
  );

  it('does not promote a single-source indoor guess to verified', () => {
    for (const id of ['lucas-oil-stadium', 'ford-field', 'caesars-superdome', 'us-bank-stadium', 'allegiant-stadium']) {
      expect(getOrientationProvenance(id)!.confidence).toBe('estimated');
    }
  });

  it('keeps verified parks within 12° precision', () => {
    for (const row of NFL_ORIENTATION_PROVENANCE.filter((p) => p.confidence === 'verified')) {
      expect(row.precisionDeg).toBeLessThanOrEqual(12);
      expect(row.sources!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('pins the leftover-geometry corrections', () => {
    const byId = new Map(NFL_STADIUMS.map((s) => [s.id, s.orientation]));
    expect(byId.get('sofi-stadium-chargers')).toBe(338);
    expect(byId.get('sofi-stadium-rams')).toBe(338);
    expect(byId.get('us-bank-stadium')).toBe(310);
    expect(byId.get('lambeau-field')).toBe(0);
    expect(byId.get('mercedes-benz-stadium')).toBe(71);
    expect(byId.get('at-t-stadium')).toBe(68);
    expect(byId.get('hard-rock-stadium')).toBe(302);
    expect(byId.get('geha-field-arrowhead')).toBe(316);
    expect(undirectedDelta(338, 90)).toBeGreaterThan(40);
    expect(undirectedDelta(310, 88)).toBeGreaterThan(40);
    expect(undirectedDelta(68, 340)).toBeGreaterThan(40);
  });
});

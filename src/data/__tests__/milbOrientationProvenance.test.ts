/**
 * MiLB HP→CF provenance lockstep.
 *
 * @jest-environment node
 */

import { ALL_MILB_STADIUMS } from '../milbStadiums';
import { MILB_ORIENTATION_PROVENANCE } from '../milbOrientationProvenance';
import { getOrientationProvenance, getOrientationPrecision } from '../stadiumOrientationProvenance';
import { canPublishVenueSeatShade } from '../stadiumShadeConfidence';
import { bestShadedSideForDayGame } from '../../utils/shadeSide';

function angularDistance(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

describe('MiLB orientation provenance', () => {
  it('covers every MiLB id exactly once', () => {
    expect(MILB_ORIENTATION_PROVENANCE.map((p) => p.stadiumId).sort())
      .toEqual(ALL_MILB_STADIUMS.map((s) => s.id).sort());
  });

  it.each(ALL_MILB_STADIUMS.map((s) => [s.id, s.orientation] as const))(
    '%s provenance matches authored orientation %i',
    (id, orientation) => {
      const provenance = getOrientationProvenance(id);
      expect(provenance).toBeDefined();
      expect(provenance!.orientation).toBe(orientation);
      expect(getOrientationPrecision(id)).toBe(provenance!.precisionDeg);
      expect(['verified', 'estimated', 'unverified']).toContain(provenance!.confidence);
      expect(provenance!.lastReviewed).toBe('2026-08-18');
      expect(provenance!.sources!.length).toBeGreaterThan(0);
    },
  );

  it('does not re-enable section shade % for open MiLB bowls', () => {
    for (const stadium of ALL_MILB_STADIUMS) {
      expect(canPublishVenueSeatShade({
        roof: stadium.roof,
        id: stadium.id,
      })).toBe(false);
    }
  });

  it('keeps verified parks within 12° precision and two sources', () => {
    for (const row of MILB_ORIENTATION_PROVENANCE.filter((p) => p.confidence === 'verified')) {
      expect(row.precisionDeg).toBeLessThanOrEqual(12);
      expect(row.sources!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('treats a 0° MiLB orientation as a measured north axis, not a missing default', () => {
    const north = ALL_MILB_STADIUMS.filter((s) => s.orientation === 0);
    expect(north.map((s) => s.id).sort()).toEqual([
      'lansing-lugnuts',
      'rome-braves',
      'syracuse-mets',
    ]);
    for (const stadium of north) {
      const provenance = getOrientationProvenance(stadium.id)!;
      expect(provenance.notes ?? '').toMatch(/measured N axis/i);
    }
  });

  it('pins the leftover-geometry and relocation corrections', () => {
    const byId = new Map(ALL_MILB_STADIUMS.map((s) => [s.id, s]));
    expect(byId.get('buffalo-bisons')!.orientation).toBe(158);
    expect(byId.get('durham-bulls')!.orientation).toBe(150);
    expect(byId.get('gwinnett-stripers')!.latitude).toBeCloseTo(34.04096, 5);
    expect(byId.get('gwinnett-stripers')!.longitude).toBeCloseTo(-83.99379, 5);
    expect(byId.get('worcester-red-sox')!.latitude).toBeCloseTo(42.25727, 5);
    expect(byId.get('salt-lake-bees')!.latitude).toBeCloseTo(40.5497, 4);
    expect(byId.get('columbus-clingstones')!.latitude).toBeCloseTo(32.45235, 5);
    expect(byId.get('knoxville-smokies')!.latitude).toBeCloseTo(35.97221, 5);
    expect(byId.get('sacramento-river-cats')!.orientation).toBe(20);
    expect(angularDistance(158, 65)).toBeGreaterThan(80);
    expect(angularDistance(150, 90)).toBeGreaterThan(40);
  });

  it('keeps the shared Roger Dean site on one measured axis', () => {
    const jupiter = ALL_MILB_STADIUMS.find((s) => s.id === 'jupiter-hammerheads')!;
    const palm = ALL_MILB_STADIUMS.find((s) => s.id === 'palm-beach-cardinals')!;
    expect(jupiter.orientation).toBe(palm.orientation);
    expect(jupiter.latitude).toBe(palm.latitude);
    expect(jupiter.longitude).toBe(palm.longitude);
  });

  it('keeps Sutter Health Park lockstep with the Athletics row', () => {
    expect(getOrientationProvenance('sacramento-river-cats')!.orientation).toBe(20);
    expect(getOrientationProvenance('athletics')!.orientation).toBe(20);
  });

  it('still produces grammatical baseball shade-side copy', () => {
    for (const stadium of ALL_MILB_STADIUMS) {
      const side = bestShadedSideForDayGame(stadium.orientation, 'baseball');
      expect(side).toMatch(/base|home plate/i);
    }
  });
});

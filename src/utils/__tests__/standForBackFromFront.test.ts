import type { StadiumStructure, TierStructure } from '../../data/stadiumStructures';
import { standFor } from '../gameShade';
import type { StandProfile } from '../shadeEngine';

// A tier whose sections share a front line, the shorter ones ending sooner
// (`backFromFront`): what stands behind them stays put, so a section with
// another row count keeps the tier's back at the same distance from its
// front row. A made-up tier of 20 rows, 2.75 ft deep, whose back stands
// 10 ft behind the last row: 20 × 2.75 + 10 = 65 ft from the front row.
describe('standFor: a back measured from the front row', () => {
  const stand: StandProfile = { rows: 20, frontRowHeightFt: 0, rakeDeg: 20, backHeightFt: 100, backSetbackFt: 10 };
  const structure = (tier: Partial<TierStructure>): StadiumStructure => ({
    stadiumId: 'test',
    park: { roof: 'open', farRimHeightFt: 0, fieldCrossingFt: 600 },
    tierOf: () => 'tier',
    tiers: { tier: { label: 'Tier', stand, heightsSourced: true, coverSourced: true, rowsFromMap: true, sources: [], ...tier } },
    reviewedOn: '2026-11-18',
  });
  const front = structure({ backFromFront: true });

  it('keeps a shorter section\'s back at the tier\'s distance from the front row', () => {
    // 12 rows end 8 rows (22 ft) sooner: the back is 32 ft behind its last row.
    expect(standFor(front, 'S', 12)!.stand.backSetbackFt).toBe(32);
  });

  it('puts a longer section\'s back over its last rows', () => {
    // 24 rows run 4 rows (11 ft) further: the back is 1 ft in front of the last row.
    expect(standFor(front, 'S', 24)!.stand.backSetbackFt).toBe(-1);
  });

  it('leaves the tier\'s own row count, a section\'s own back and an unflagged tier alone', () => {
    expect(standFor(front, 'S', 20)!.stand.backSetbackFt).toBe(10);
    expect(standFor(front, 'S')!.stand.backSetbackFt).toBe(10);
    const own = structure({ backFromFront: true, sections: { S: { backHeightFt: 90, backSetbackFt: 5 } } });
    expect(standFor(own, 'S', 12)!.stand.backSetbackFt).toBe(5);
    expect(standFor(structure({}), 'S', 12)!.stand.backSetbackFt).toBe(10);
  });
});

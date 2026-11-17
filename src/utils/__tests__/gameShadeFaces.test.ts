import type { StadiumStructure } from '../../data/stadiumStructures';
import type { DetailedSection } from '../../types/stadium-complete';
import { computeGameShade } from '../gameShade';
import type { StandProfile } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

// A section whose rows bend across its width carries its faces' directions
// (`standFaces`, equal shares): each face gets its own shade, and the
// section's is their mean.
describe('a section with faces', () => {
  // A made-up stand of 10 rows (27.5 ft deep) under a roof reaching out over
  // every row (its edge, 60 ft up, 30 ft in front of the last row), and no
  // far rim. With the sun behind it (a back facing south at midday) the roof
  // shades every row; with the sun in front (a back facing north) nothing does.
  const stand: StandProfile = { rows: 10, frontRowHeightFt: 0, rakeDeg: 20, backHeightFt: 60, backSetbackFt: -30 };
  const structure: StadiumStructure = {
    stadiumId: 'test',
    park: { roof: 'open', farRimHeightFt: 0, fieldCrossingFt: 600 },
    tierOf: () => 'stand',
    tiers: { stand: { label: 'Stand', stand, heightsSourced: true, coverSourced: true, sources: [] } },
    reviewedOn: '2026-11-17',
  };
  // Los Angeles, noon on 2025-07-15: the sun is high in the south and then
  // the south-west for the whole three hours.
  const game = (section: Partial<DetailedSection>) =>
    computeGameShade({
      sections: [{ id: 'S1', name: 'S1', rows: [], ...section } as unknown as DetailedSection],
      structure,
      orientationDeg: 0,
      orientationPrecisionDeg: 1,
      latitude: 34.0739,
      longitude: -118.24,
      firstPitch: stadiumLocalToUTC('2025-07-15', '12:00', 'America/Los_Angeles'),
    }).sections[0];

  it('gives the one-direction answer when its faces all face that way', () => {
    const one = game({ standCompass: 180 });
    expect(one.samples.every((s) => s.status === 'shaded')).toBe(true);
    expect(game({ standCompass: 180, standFaces: [180, 180, 180] })).toEqual(one);
  });

  it('is partly shaded where one face is in shade and another in the sun', () => {
    expect(game({ standCompass: 0 }).samples.every((s) => s.status === 'sun')).toBe(true);
    const bent = game({ standCompass: 180, standFaces: [180, 180, 0] });
    for (const s of bent.samples) {
      expect(s.shadedFraction).toBeCloseTo(2 / 3);
      expect(s.status).toBe('partial');
    }
  });
});

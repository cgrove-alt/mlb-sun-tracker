import type { StadiumStructure } from '../../data/stadiumStructures';
import type { DetailedSection } from '../../types/stadium-complete';
import { computeGameShade } from '../gameShade';
import type { StandProfile } from '../shadeEngine';
import { stadiumLocalToUTC } from '../stadiumTime';

// The confidence check moves the structure around the seats by its error and
// re-runs the game. A back over the rows of a stand with a deck stands on that
// deck, so it must move with the deck's edge, not apart from it.
describe('confidence: a back over the rows of a stand with a deck', () => {
  // A made-up stand shaped like Dodger Stadium's loge: rows 8–22 under the
  // deck above, whose front (57 ft) is the highest thing over the rows. It
  // stands over row 8, 1.25 ft behind the deck's edge (19.25 ft from the
  // front row), so 40 ft in front of the back of the stand (22 rows × 2.75 ft).
  const stand: StandProfile = {
    rows: 22,
    frontRowHeightFt: 22,
    rakeDeg: 19,
    deckFrontFt: 57,
    backHeightFt: 58,
    backSetbackFt: -40,
    overhang: { coveredFromRow: 8, soffitHeightFt: 48 },
  };
  const structure: StadiumStructure = {
    stadiumId: 'test',
    park: { roof: 'open', farRimHeightFt: 120, fieldCrossingFt: 603 },
    tierOf: () => 'loge',
    tiers: { loge: { label: 'Loge', stand, heightsSourced: true, coverSourced: true, sources: [] } },
    reviewedOn: '2026-11-16',
  };
  const section = { id: 'L1', name: 'L1', rows: [], standCompass: 157 } as unknown as DetailedSection;

  it('is not moved out over the open rows in front of the deck', () => {
    // Los Angeles, 1:10 PM on 2025-07-15: the sun is behind the stand all
    // game. Moving the back 20% of its 40 ft would put it over rows 5–7, in
    // front of the deck's edge, and shade them; it moves 20% of its 1.25 ft
    // from the edge instead. Nothing else the check moves changes the answer.
    const result = computeGameShade({
      sections: [section],
      structure,
      orientationDeg: 0,
      orientationPrecisionDeg: 1,
      latitude: 34.0739,
      longitude: -118.24,
      firstPitch: stadiumLocalToUTC('2025-07-15', '13:10', 'America/Los_Angeles'),
    });
    expect(result.sections[0].confidence).toBe('high');
  });
});

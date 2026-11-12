/**
 * Where a park's stands are measured from USGS lidar, every deck over a
 * section leaves at least 9 ft above the floor of the first row under it:
 * the rule its undersides follow, measured or estimated
 * (scripts/measureStandHeights.py, `cover`). A lower one would put the deck
 * through the heads of the people sitting there. Heights are whole feet, so
 * an underside may round down by half a foot.
 */
import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumSections } from '../../data/stadium-data-aggregator';
import { getStadiumStructure } from '../../data/stadiumStructures';
import { standFor } from '../gameShade';
import { DEFAULT_TREAD_FT } from '../shadeEngine';

const isLidar = (source: string) => source.startsWith('USGS 3DEP lidar');
const lidarParks = MLB_STADIUMS.filter((s) =>
  Object.values(getStadiumStructure(s.id)?.tiers ?? {}).some((tier) => tier.sources.some(isLidar)),
);

describe('decks over lidar-measured stands', () => {
  it('covers the parks measured so far', () => {
    expect(lidarParks.map((s) => s.id).sort()).toEqual(['cubs', 'dodgers', 'giants', 'mets', 'phillies', 'redsox', 'yankees']);
  });

  it.each(lidarParks.map((s) => [s.id] as const))('%s: every underside is 9 ft above its first covered row', async (id) => {
    const structure = getStadiumStructure(id)!;
    const tooLow: string[] = [];
    for (const section of await getStadiumSections(id, 'MLB')) {
      const found = standFor(structure, section.id, section.rows?.length);
      if (!found?.tier.sources.some(isLidar) || !found.stand.overhang) continue;
      const { stand } = found;
      const row = Math.max(1, stand.overhang!.coveredFromRow);
      if (row > stand.rows) continue;
      const floor = stand.frontRowHeightFt + (row - 1) * (stand.treadFt ?? DEFAULT_TREAD_FT) * Math.tan((stand.rakeDeg * Math.PI) / 180);
      if (stand.overhang!.soffitHeightFt < floor + 9 - 0.5) {
        tooLow.push(`${section.id} (row ${row}: ${stand.overhang!.soffitHeightFt} ft over a ${floor.toFixed(1)} ft floor)`);
      }
    }
    expect(tooLow).toEqual([]);
  });
});

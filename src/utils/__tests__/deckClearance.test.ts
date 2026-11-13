/**
 * Every deck or roof over a section leaves at least 9 ft above the floor of
 * the first row under it: the rule every underside follows, measured or
 * estimated (scripts/measureStandHeights.py, `cover`). A lower one would put
 * the deck through the heads of the people sitting there. Heights are whole
 * feet, so an underside may round down by half a foot.
 *
 * Where a deck's front is given (`deckFrontFt`, its front row as the scan
 * measures it), it stands at or above the underside and within 15 ft of it:
 * a section under another deck than its tier's sets its own.
 */
import { MLB_STADIUMS } from '../../data/stadiums';
import { getStadiumSections } from '../../data/stadium-data-aggregator';
import { genericStructure, getStadiumStructure } from '../../data/stadiumStructures';
import { standFor } from '../gameShade';
import { DEFAULT_TREAD_FT } from '../shadeEngine';

describe('decks over the stands', () => {
  it.each(MLB_STADIUMS.map((s) => [s.id, s] as const))('%s: every underside is 9 ft above its first covered row', async (_id, stadium) => {
    const sections = await getStadiumSections(stadium.id, 'MLB');
    const structure = getStadiumStructure(stadium.id) ?? genericStructure(stadium.id, stadium.roof, sections);
    const tooLow: string[] = [];
    for (const section of sections) {
      const found = standFor(structure, section.id, section.rows?.length);
      if (!found?.stand.overhang) continue;
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

  it.each(MLB_STADIUMS.map((s) => [s.id, s] as const))("%s: every deck's front is its own", async (_id, stadium) => {
    const sections = await getStadiumSections(stadium.id, 'MLB');
    const structure = getStadiumStructure(stadium.id) ?? genericStructure(stadium.id, stadium.roof, sections);
    const wrong: string[] = [];
    for (const section of sections) {
      const stand = standFor(structure, section.id, section.rows?.length)?.stand;
      if (!stand?.overhang || stand.deckFrontFt === undefined) continue;
      const above = stand.deckFrontFt - stand.overhang.soffitHeightFt;
      if (above < 0 || above > 15) wrong.push(`${section.id} (front ${stand.deckFrontFt} ft, underside ${stand.overhang.soffitHeightFt} ft)`);
    }
    expect(wrong).toEqual([]);
  });
});

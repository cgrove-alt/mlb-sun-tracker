/**
 * Official MiLB / NFL section inventories must be park-specific and
 * source-backed. Generic Field-100 clones and 18-wedge rings are forbidden.
 *
 * @jest-environment node
 */

import { NFL_STADIUMS } from '../nflStadiums';
import { ALL_MILB_STADIUMS } from '../milbStadiums';
import { NFL_OFFICIAL_INVENTORIES } from '../sections/nfl/officialInventories';
import { MILB_OFFICIAL_INVENTORIES } from '../sections/milb/officialInventories';
import { NFL_SECTION_PROVENANCE } from '../nflSectionProvenance';
import { MILB_SECTION_PROVENANCE } from '../milbSectionProvenance';
import { buildOfficialSections } from '../sections/buildOfficialSections';
import { getOfficialDetailedSections, hasOfficialInventory } from '../officialSectionRegistry';
import { canPublishVenueSeatShade } from '../stadiumShadeConfidence';
import { getStadiumSections } from '../stadium-data-aggregator';
import { getMiLBStadiumSections } from '../milbStadiumSections';
import { getNFLStadiumSections } from '../nflStadiumSections';
import { generateBaseballSections } from '../../utils/generateBaseballSections';

const SHARED_NFL = new Map<string, string>([
  ['sofi-stadium-rams', 'sofi-stadium-chargers'],
  ['sofi-stadium-chargers', 'sofi-stadium-rams'],
  ['metlife-stadium-jets', 'metlife-stadium-giants'],
  ['metlife-stadium-giants', 'metlife-stadium-jets'],
]);

function inventoryIds(stadiumId: string): string[] {
  const inv = NFL_OFFICIAL_INVENTORIES[stadiumId] ?? MILB_OFFICIAL_INVENTORIES[stadiumId];
  if (!inv) return [];
  return [
    ...inv.bands.flatMap((band) => [...band.ids]),
    ...(inv.named ?? []).map((place) => place.id),
  ];
}

describe('NFL official section inventories', () => {
  it('covers every NFL franchise id', () => {
    expect(Object.keys(NFL_OFFICIAL_INVENTORIES).sort()).toEqual(
      NFL_STADIUMS.map((stadium) => stadium.id).sort(),
    );
  });

  it('has provenance for every NFL inventory', () => {
    expect(Object.keys(NFL_SECTION_PROVENANCE).sort()).toEqual(
      Object.keys(NFL_OFFICIAL_INVENTORIES).sort(),
    );
    Object.values(NFL_SECTION_PROVENANCE).forEach((row) => {
      expect(row.sectionIdentity).toBe('source-backed');
      expect(row.officialUrl).toMatch(/^https?:\/\//);
    });
  });

  it('does not emit the Field 100 template or a 65-section clone', () => {
    Object.entries(NFL_OFFICIAL_INVENTORIES).forEach(([id, inv]) => {
      const sections = buildOfficialSections(inv);
      expect(sections).not.toHaveLength(65);
      expect(sections.some((section) => section.name === 'Field 100')).toBe(false);
      expect(sections.length).toBeGreaterThan(10);
      expect(hasOfficialInventory(id)).toBe(true);
    });
  });

  it('keeps inventories unique except shared bowls', () => {
    const signatures = new Map<string, string>();
    Object.keys(NFL_OFFICIAL_INVENTORIES).forEach((id) => {
      const sig = inventoryIds(id).join(',');
      const prior = signatures.get(sig);
      if (prior) {
        expect(SHARED_NFL.get(id) === prior || SHARED_NFL.get(prior) === id).toBe(true);
      } else {
        signatures.set(sig, id);
      }
    });
  });

  it('does not publish seat-level shade % for open NFL bowls', () => {
    NFL_STADIUMS.filter((stadium) => stadium.roof !== 'fixed').forEach((stadium) => {
      expect(canPublishVenueSeatShade(stadium)).toBe(false);
    });
  });
});

const SHARED_MILB = new Map<string, string>([
  ['jupiter-hammerheads', 'palm-beach-cardinals'],
  ['palm-beach-cardinals', 'jupiter-hammerheads'],
]);

describe('MiLB official section inventories', () => {
  it('only registers parks with source-backed numbered bands', () => {
    Object.entries(MILB_OFFICIAL_INVENTORIES).forEach(([id, inv]) => {
      const ids = inventoryIds(id);
      expect(ids.length).toBeGreaterThan(8);
      expect(inv.bands.some((band) => band.ids.length > 0)).toBe(true);
      expect(buildOfficialSections(inv).some((section) => section.name === 'Field 100')).toBe(false);
      expect(hasOfficialInventory(id)).toBe(true);
    });
  });

  it('has provenance for every registered MiLB inventory', () => {
    expect(Object.keys(MILB_SECTION_PROVENANCE).sort()).toEqual(
      Object.keys(MILB_OFFICIAL_INVENTORIES).sort(),
    );
    Object.values(MILB_SECTION_PROVENANCE).forEach((row) => {
      expect(row.sectionIdentity).toBe('source-backed');
      expect(row.officialUrl).toMatch(/^https?:\/\//);
    });
  });

  it('keeps inventories unique except shared bowls', () => {
    const signatures = new Map<string, string>();
    Object.keys(MILB_OFFICIAL_INVENTORIES).forEach((id) => {
      const sig = inventoryIds(id).join(',');
      const prior = signatures.get(sig);
      if (prior) {
        expect(SHARED_MILB.get(id) === prior || SHARED_MILB.get(prior) === id).toBe(true);
      } else {
        signatures.set(sig, id);
      }
    });
  });

  it('does not publish seat-level shade % for open MiLB bowls', () => {
    ALL_MILB_STADIUMS.filter((stadium) => stadium.roof !== 'fixed').forEach((stadium) => {
      expect(canPublishVenueSeatShade(stadium as any)).toBe(false);
    });
  });

  it('covers every MiLB franchise id', () => {
    expect(Object.keys(MILB_OFFICIAL_INVENTORIES).sort()).toEqual(
      ALL_MILB_STADIUMS.map((stadium) => stadium.id).sort(),
    );
  });

  it('returns empty instead of a Field Box clone when a park is not sourced', () => {
    const sections = getMiLBStadiumSections('not-a-sourced-milb-park');
    expect(sections).toEqual([]);
    expect(sections.some((section) => String(section.name).startsWith('Field Box'))).toBe(false);
  });
});

describe('generic generators are out of the live path', () => {
  it('does not fall back to generateBaseballSections for a MiLB park with inventory', async () => {
    const official = Object.keys(MILB_OFFICIAL_INVENTORIES)[0];
    if (!official) return;
    const sections = await getStadiumSections(official, 'MiLB');
    const generic = generateBaseballSections({
      id: official,
      league: 'MiLB',
      orientation: 90,
    } as any);
    expect(sections.some((section) => section.name === 'Field Box 1')).toBe(false);
    expect(generic.some((section) => String(section.name).startsWith('Field Box'))).toBe(true);
    expect(sections.map((section) => section.id).join(',')).not.toBe(
      generic.map((section) => section.id).join(','),
    );
  });

  it('returns official SoFi products instead of a generic ring', () => {
    const sections = getOfficialDetailedSections('sofi-stadium-rams');
    expect(sections && sections.length).toBeGreaterThan(100);
    expect(sections?.some((section) => section.name === 'Field 100')).toBe(false);
    expect(getNFLStadiumSections('sofi-stadium-rams').length).toBeGreaterThan(100);
  });
});

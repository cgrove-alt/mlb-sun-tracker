/**
 * Regression coverage for the 27 MLB maps replaced in the 2026-08-07 source
 * pass. These assertions deliberately use both public loaders so a future
 * split-data fork cannot silently return to production.
 *
 * @jest-environment node
 */

import { MLB_STADIUMS } from '../../../stadiums';
import { redSoxPublishedChartPoints } from '../chart-points/reconciledLiveParkPoints';
import { yankeesChartPoints } from '../chart-points/yankees';
import { getStadiumSections as getDetailedSections } from '../../../stadium-data-aggregator';
import { getStadiumSectionsAsync as getPageSections } from '../../../getStadiumSections';
import {
  MLB_UNRESOLVED_SECTION_INVENTORIES,
  STADIUM_SECTION_PROVENANCE,
} from '../../../stadiumSectionProvenance';

interface ParkExpectation {
  id: string;
  count: number;
  distinctiveIds: readonly string[];
}

const PARKS: readonly ParkExpectation[] = [
  { id: 'angels', count: 283, distinctiveIds: ['101', '236', '540'] },
  { id: 'astros', count: 210, distinctiveIds: ['AA', 'STE55', 'FC'] },
  { id: 'athletics', count: 29, distinctiveIds: ['101', '123', '201', '206'] },
  { id: 'bluejays', count: 252, distinctiveIds: ['101', '244', '300', '498', '540'] },
  { id: 'braves', count: 273, distinctiveIds: ['25', '130T1', '239B1'] },
  { id: 'brewers', count: 159, distinctiveIds: ['107', 'DECK305', 'BULLPEN'] },
  { id: 'cardinals', count: 324, distinctiveIds: ['101', '197', 'S63'] },
  { id: 'cubs', count: 177, distinctiveIds: ['423R', 'A20', 'BLCHRGA'] },
  { id: 'diamondbacks', count: 149, distinctiveIds: ['A', '145AW', '320W'] },
  { id: 'dodgers', count: 312, distinctiveIds: ['31BL', 'OWNERS', 'FSRO'] },
  { id: 'giants', count: 174, distinctiveIds: ['1', '101', '234', '336'] },
  { id: 'guardians', count: 272, distinctiveIds: ['179', 'STE308', '1012'] },
  { id: 'mariners', count: 169, distinctiveIds: ['102', '219TB1', 'Power-Alley'] },
  { id: 'marlins', count: 160, distinctiveIds: ['SEC1', 'SEC228', 'SEC327'] },
  { id: 'mets', count: 246, distinctiveIds: ['121', 'MARKET', '538'] },
  { id: 'nationals', count: 222, distinctiveIds: ['101', '243', '409'] },
  { id: 'orioles', count: 220, distinctiveIds: ['98', 'STE74', 'SRO'] },
  { id: 'padres', count: 194, distinctiveIds: ['A', '101', '235', '313', '329', 'PCS15', 'TP35', 'WMS-4A', 'GLS3', 'SKYLINE-PATIO', 'BARKYARD'] },
  { id: 'phillies', count: 275, distinctiveIds: ['124', 'RB', 'STANDING5'] },
  { id: 'pirates', count: 250, distinctiveIds: ['1BWC', 'LUX65', 'PORCH'] },
  { id: 'rangers', count: 270, distinctiveIds: ['HFS09', 'CS216', 'TTERR1'] },
  { id: 'rays', count: 208, distinctiveIds: ['L107', 'CLUB106', 'SRO'] },
  { id: 'reds', count: 206, distinctiveIds: ['CFPORCH', 'STE108', '537'] },
  { id: 'redsox', count: 483, distinctiveIds: ['AC01', 'D13', 'FBC80', 'SRGM'] },
  { id: 'rockies', count: 190, distinctiveIds: ['105', '45', 'PNC Press Club'] },
  { id: 'royals', count: 253, distinctiveIds: ['PORCH-3', 'STE10', 'DECKSRO'] },
  { id: 'tigers', count: 251, distinctiveIds: ['L130', 'ST152', 'SRO'] },
  { id: 'twins', count: 162, distinctiveIds: ['101', 'A', '328SRO'] },
  { id: 'whitesox', count: 132, distinctiveIds: ['100', '334A', 'CIBC-SCOUT-CLUB', 'FAN-DECK'] },
  { id: 'yankees', count: 222, distinctiveIds: ['029W', '011', '122', '320CW', '434B'] },
];

describe.each(PARKS)('$id sourced section map', ({ id, count, distinctiveIds }) => {
  it('preserves its published inventory and calculator geometry', async () => {
    const sections = await getDetailedSections(id, 'MLB');
    const ids = sections.map((section) => section.id);

    expect(sections).toHaveLength(count);
    expect(new Set(ids).size).toBe(count);
    distinctiveIds.forEach((sectionId) => expect(ids).toContain(sectionId));
    expect(new Set(sections.map((section) => section.angleSpan)).size).toBeGreaterThan(1);

    sections.forEach((section) => {
      expect(section.rows.length).toBeGreaterThan(0);
      expect(section.vertices3D).toHaveLength(4);
      expect(section.distance).toBeGreaterThan(0);
      expect(section.rows[0].depth).toBe(0);
      if (section.rows.length > 1) {
        expect(section.rows.at(-1)!.depth).toBeGreaterThan(0);
      }
    });
  });

  it('is the same inventory used by the rendered stadium page', async () => {
    const [detailed, page] = await Promise.all([
      getDetailedSections(id, 'MLB'),
      getPageSections(id),
    ]);

    expect(page.map((section) => section.id)).toEqual(detailed.map((section) => section.id));
  });
});

describe('MLB section provenance', () => {
  it('covers every MLB park with source-backed identity and explicit modeled rows', () => {
    expect(Object.keys(STADIUM_SECTION_PROVENANCE).sort()).toEqual(
      MLB_STADIUMS.map((stadium) => stadium.id).sort(),
    );

    Object.values(STADIUM_SECTION_PROVENANCE).forEach((provenance) => {
      expect(provenance.officialUrl).toMatch(/^https:\/\//);
      expect(provenance.sectionIdentity).toBe('source-backed');
      expect(provenance.rowGeometry).toBe('modeled');
      expect(['reconciled', 'partial']).toContain(provenance.inventoryStatus);
      provenance.supplementalUrls?.forEach((url) => expect(url).toMatch(/^https:\/\//));
      if (provenance.sourceKind === 'club-linked-3d-map' || provenance.sourceKind === 'club-linked-virtual-venue') {
        expect(provenance.geometryUrl).toMatch(/^https:\/\//);
      }
    });
  });

  it('keeps every unresolved inventory mismatch explicit and fail-closed', () => {
    expect(MLB_UNRESOLVED_SECTION_INVENTORIES.map((provenance) => provenance.stadiumId).sort())
      .toEqual([]);

    expect(STADIUM_SECTION_PROVENANCE.padres).toMatchObject({
      inventoryStatus: 'reconciled',
      currentInventoryCount: 194,
      sourceProductCount: 194,
    });

    expect(STADIUM_SECTION_PROVENANCE.redsox).toMatchObject({
      inventoryStatus: 'reconciled',
      currentInventoryCount: 483,
      sourceProductCount: 483,
      directMapCoordinateCount: 401,
    });
    expect(STADIUM_SECTION_PROVENANCE.yankees).toMatchObject({
      inventoryStatus: 'reconciled',
      currentInventoryCount: 222,
      sourceProductCount: 222,
      directMapCoordinateCount: 222,
    });
    expect(redSoxPublishedChartPoints).toHaveLength(483);
    expect(yankeesChartPoints).toHaveLength(222);
  });

  it('keeps Petco Park aligned to the current chart and permanent premium maps', async () => {
    const sections = await getDetailedSections('padres', 'MLB');
    const ids = new Set(sections.map((section) => section.id));

    expect(ids).not.toContain('136');
    expect(ids).not.toContain('224');
    expect(ids).not.toContain('314');
    expect(ids).toContain('313');
    expect(ids).toContain('SOUTHWEST-ON-DECK-SUITE');
    expect(ids).toContain('CITY-CRUISES-HOME-RUN-DECK');
  });

  it('uses exact public map polygons for the 20 available 3-D venues', () => {
    const polygonParks = Object.values(STADIUM_SECTION_PROVENANCE)
      .filter((provenance) => provenance.sourceKind === 'club-linked-3d-map');

    expect(polygonParks).toHaveLength(21);
  });
});

describe('fixed-roof coverage', () => {
  it('marks every Tropicana Field product covered by the permanent roof', async () => {
    const rays = await getDetailedSections('rays', 'MLB');
    expect(rays).not.toHaveLength(0);
    expect(rays.every((section) => section.covered)).toBe(true);
    expect(rays.every((section) => section.rows.every((row) => row.covered))).toBe(true);
  });
});

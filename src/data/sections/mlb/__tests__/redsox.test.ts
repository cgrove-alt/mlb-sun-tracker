/** @jest-environment node */

import { redsoxSections } from '../redsox';
import { redSoxPublishedChartPoints } from '../chart-points/reconciledLiveParkPoints';

describe('Fenway live product inventory', () => {
  it('represents every current selectable ticket product exactly once', () => {
    const ids = redsoxSections.map((section) => section.id);

    expect(redsoxSections).toHaveLength(483);
    expect(new Set(ids).size).toBe(483);
    expect(new Set(ids)).toEqual(new Set(redSoxPublishedChartPoints.map((point) => point.id)));
  });

  it('preserves current premium, accessibility, standing, and table products', () => {
    const ids = new Set(redsoxSections.map((section) => section.id));
    [
      'AC01',
      'AP14',
      'D13',
      'DTCB',
      'FBC80',
      'H50',
      'L36U',
      'L39T',
      'M10',
      'PB14',
      'R43',
      'SRGM',
      'SRRFB',
      'T213',
    ].forEach((id) => expect(ids).toContain(id));
  });

  it('excludes viewer navigation and interior overlays from ticket inventory', () => {
    const ids = new Set(redsoxSections.map((section) => section.id));
    ['D1', 'D2', 'D3', 'D4', 'H', 'RoyalClub(INT)E', 'DugoutClub(INT)E']
      .forEach((id) => expect(ids).not.toContain(id));
  });

  it('aliases products only onto their corresponding published Field Box footprint', () => {
    const byId = new Map(redsoxSections.map((section) => [section.id, section]));

    ['D29', 'FBC29'].forEach((id) => {
      expect(byId.get(id)?.baseAngle).toBe(byId.get('F29')?.baseAngle);
      expect(byId.get(id)?.angleSpan).toBe(byId.get('F29')?.angleSpan);
    });
    expect(byId.get('H44')?.baseAngle).toBe(byId.get('F44')?.baseAngle);
  });

  it('does not infer Fenway roof or overhang coverage from map polygons', () => {
    expect(redsoxSections.every((section) => !section.covered)).toBe(true);
    expect(redsoxSections.every((section) => section.partialCoverage === undefined)).toBe(true);
  });

  it('supplies modeled calculator geometry without empty rows', () => {
    redsoxSections.forEach((section) => {
      expect(section.rows.length).toBeGreaterThan(0);
      expect(section.vertices3D).toHaveLength(4);
      expect(section.distance).toBeGreaterThan(0);
    });
  });
});

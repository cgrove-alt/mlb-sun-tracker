/** @jest-environment node */

import { yankeesSections } from '../yankees';
import { yankeesChartPoints } from '../chart-points/yankees';

describe('Yankee Stadium live product inventory', () => {
  it('represents all 222 live IOMEDIA products exactly once', () => {
    const ids = yankeesSections.map((section) => section.id);

    expect(yankeesSections).toHaveLength(222);
    expect(new Set(ids).size).toBe(222);
    expect(new Set(ids)).toEqual(new Set(yankeesChartPoints.map((point) => point.id)));
  });

  it('preserves zero-padded and accessibility/standing variants', () => {
    const ids = new Set(yankeesSections.map((section) => section.id));
    [
      '011',
      '011W',
      '014A',
      '021BW',
      '029',
      '029W',
      '105S',
      '205W',
      '235W',
      '320CW',
      '334W',
      '434B',
    ].forEach((id) => expect(ids).toContain(id));
  });

  it('does not collapse current products onto obsolete unpadded IDs', () => {
    const ids = new Set(yankeesSections.map((section) => section.id));
    ['11', '14A', '21B', '29'].forEach((id) => expect(ids).not.toContain(id));
  });

  it('does not infer roof or overhang coverage from IOMEDIA hotspots', () => {
    expect(yankeesSections.every((section) => !section.covered)).toBe(true);
    expect(yankeesSections.every((section) => section.partialCoverage === undefined)).toBe(true);
  });

  it('supplies modeled calculator geometry for every product', () => {
    yankeesSections.forEach((section) => {
      expect(section.rows.length).toBeGreaterThan(0);
      expect(section.vertices3D).toHaveLength(4);
      expect(section.distance).toBeGreaterThan(0);
    });
  });
});

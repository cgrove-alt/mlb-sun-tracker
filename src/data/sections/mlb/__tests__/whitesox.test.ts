/** @jest-environment node */

import { whitesoxSections } from '../whitesox';
import { sectionCompassAngle } from '../../../../utils/sectionSunCalculations';
import type { StadiumSection } from '../../../stadiumSectionTypes';
import type { DetailedSection } from '../../../../types/stadium-complete';
import { MLB_STADIUMS } from '../../../stadiums';

const ORIENTATION = MLB_STADIUMS.find((stadium) => stadium.id === 'whitesox')!.orientation;

const asStadiumSection = (section: DetailedSection): StadiumSection => ({
  id: section.id,
  name: section.name,
  level: (section.level === 'standing' ? 'field' : section.level) as StadiumSection['level'],
  baseAngle: section.baseAngle,
  angleSpan: section.angleSpan,
  rows: section.rows.length,
  covered: section.covered,
});
function angularDistance(a: number, b: number): number {
  const difference = Math.abs(((a - b) % 360) + 360) % 360;
  return difference > 180 ? 360 - difference : difference;
}

describe('Rate Field official chart inventory', () => {
  it('represents all 132 current numbered and named seating products once', () => {
    const ids = whitesoxSections.map((section) => section.id);

    expect(whitesoxSections).toHaveLength(132);
    expect(new Set(ids).size).toBe(132);
  });

  it('uses current chart names and the published 334A suffix', () => {
    const ids = new Set(whitesoxSections.map((section) => section.id));
    [
      '100',
      '132',
      '164',
      '311',
      '334A',
      '506',
      '558',
      'CIBC-SCOUT-CLUB',
      'MILLER-LITE-LANDING',
      'LEINENKUGELS-CRAFT-LODGE',
      'PATIO',
      'RATE-CLUB',
      'STADIUM-CLUB',
      'FAN-DECK',
    ].forEach((id) => expect(ids).toContain(id));
  });

  it('removes legacy acronyms and invented per-section Scout products', () => {
    const ids = new Set(whitesoxSections.map((section) => section.id));
    ['334', 'SCOUT-130', 'SCOUT-131', 'SCOUT-133', 'SCOUT-134', 'MLL', 'MLL-SRO', 'GRC']
      .forEach((id) => expect(ids).not.toContain(id));
  });

  it('retains the verified chart orientation around home plate and center field', () => {
    const byId = new Map(whitesoxSections.map((section) => [section.id, section]));
    const behindHome = sectionCompassAngle(asStadiumSection(byId.get('132')!), ORIENTATION);
    const centerField = sectionCompassAngle(asStadiumSection(byId.get('163')!), ORIENTATION);

    expect(angularDistance(behindHome, 300)).toBeLessThan(5);
    expect(angularDistance(centerField, 114)).toBeLessThan(6);
  });

  it('supplies non-empty modeled calculator geometry for each product', () => {
    whitesoxSections.forEach((section) => {
      expect(section.rows.length).toBeGreaterThan(0);
      expect(section.vertices3D).toHaveLength(4);
      expect(section.distance).toBeGreaterThan(0);
    });
  });
});

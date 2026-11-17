import type { DetailedSection } from '../../../../types/stadium-complete';
import { cardinalsSections } from '../cardinals';
import { padresSections } from '../padres';
import { philliesSections } from '../phillies';
import { rockiesSections } from '../rockies';
import { twinsSections } from '../twins';
import { yankeesSections } from '../yankees';

// Sections whose rows bend across their width carry their faces (measured
// on the lidar: scripts/measureStandHeights.py faces), one per third, each
// near the section's own direction.
const parks: Array<[string, readonly DetailedSection[], readonly string[]]> = [
  ['cardinals', cardinalsSections, ['132']],
  ['padres', padresSections, ['220']],
  ['phillies', philliesSections, ['305', '219', '224', '210']],
  ['rockies', rockiesSections, ['L315']],
  ['twins', twinsSections, ['140']],
  ['yankees', yankeesSections, ['321']],
];

describe.each(parks)('%s: sections with faces', (_park, sections, ids) => {
  it('carries the faces on exactly the listed sections', () => {
    expect(sections.filter((s) => s.standFaces).map((s) => s.id).sort()).toEqual([...ids].sort());
  });

  it.each(ids)('%s has three faces within 60° of its direction', (id) => {
    const s = sections.find((x) => x.id === id)!;
    expect(s.standFaces).toHaveLength(3);
    for (const face of s.standFaces!) {
      const off = Math.abs(((face - s.standCompass! + 540) % 360) - 180);
      expect(off).toBeLessThanOrEqual(60);
    }
  });
});

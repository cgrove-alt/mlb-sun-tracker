import type { DetailedSection } from '../../../types/stadium-complete';
import { rockiesChartPoints } from './chart-points/rockies';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyRockiesSection } from './sourcedChartClassifiers';

/** Public map paths from the Rockies' club-linked Coors Field Seat Viewer. */
export const rockiesSections: DetailedSection[] = buildParkSections(0, chartSeeds(rockiesChartPoints, {
  orientation: 0,
  behindHomeIds: ['123', '124'],
  centerFieldIds: ['152', '153'],
  classify: classifyRockiesSection,
}));

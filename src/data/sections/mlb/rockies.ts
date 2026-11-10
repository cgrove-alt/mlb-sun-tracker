import type { DetailedSection } from '../../../types/stadium-complete';
import { rockiesChartPoints } from './chart-points/rockies';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyRockiesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('rockies');

/** Public map paths from the Rockies' club-linked Coors Field Seat Viewer. */
export const rockiesSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(rockiesChartPoints, {
  orientation: ORIENTATION,
  behindHomeIds: ['123', '124'],
  centerFieldIds: ['152', '153'],
  classify: classifyRockiesSection,
}));

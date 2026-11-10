import type { DetailedSection } from '../../../types/stadium-complete';
import { twinsChartPoints } from './chart-points/twins';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyTwinsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Selectable polygon centres from the 3-D map embedded by the Twins' official
// Target Field seat-map page. Row depths and roof effects remain modeled.
const ORIENTATION = getStadiumOrientation('twins');

export const twinsSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(twinsChartPoints, {
  orientation: ORIENTATION,
  behindHomeIds: ['11', '12'],
  centerFieldIds: ['134', '135'],
  classify: classifyTwinsSection,
}));

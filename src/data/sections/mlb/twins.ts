import type { DetailedSection } from '../../../types/stadium-complete';
import { twinsChartPoints } from './chart-points/twins';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyTwinsSection } from './sourcedChartClassifiers';

// Selectable polygon centres from the 3-D map embedded by the Twins' official
// Target Field seat-map page. Row depths and roof effects remain modeled.
export const twinsSections: DetailedSection[] = buildParkSections(90, chartSeeds(twinsChartPoints, {
  orientation: 90,
  behindHomeIds: ['11', '12'],
  centerFieldIds: ['134', '135'],
  classify: classifyTwinsSection,
}));

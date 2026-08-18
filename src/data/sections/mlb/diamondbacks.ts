import type { DetailedSection } from '../../../types/stadium-complete';
import { diamondbacksChartPoints } from './chart-points/diamondbacks';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyDiamondbacksSection } from './sourcedChartClassifiers';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked on the D-backs'
// official Chase Field seat-map page. Row and roof geometry remain modeled.
export const diamondbacksSections: DetailedSection[] = buildParkSections(0, chartSeeds(diamondbacksChartPoints, {
  orientation: 0,
  behindHomeIds: ['121', '122', '123'],
  centerFieldIds: ['100AW', '100BW', '145AW', '145BW'],
  classify: classifyDiamondbacksSection,
}));

import type { DetailedSection } from '../../../types/stadium-complete';
import { diamondbacksChartPoints } from './chart-points/diamondbacks';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyDiamondbacksSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked on the D-backs'
// official Chase Field seat-map page. Row and roof geometry remain modeled.
const ORIENTATION = getStadiumOrientation('diamondbacks');

export const diamondbacksSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(diamondbacksChartPoints, {
  orientation: ORIENTATION,
  behindHomeIds: ['121', '122', '123'],
  centerFieldIds: ['100AW', '100BW', '145AW', '145BW'],
  classify: classifyDiamondbacksSection,
}));

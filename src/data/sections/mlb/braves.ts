import type { DetailedSection } from '../../../types/stadium-complete';
import { bravesChartPoints } from './chart-points/braves';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyBravesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked by the Braves'
// official ballpark guide. They improve section placement but are not surveyed
// section-boundary polygons; row and roof geometry remain modeled.
const ORIENTATION = getStadiumOrientation('braves');

export const bravesSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(bravesChartPoints, {
  orientation: ORIENTATION,
  behindHomeIds: ['25', '26'],
  centerFieldIds: ['151', '152'],
  classify: classifyBravesSection,
}));

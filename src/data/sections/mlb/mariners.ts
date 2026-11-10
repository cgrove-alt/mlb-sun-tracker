import type { DetailedSection } from '../../../types/stadium-complete';
import { marinersChartPoints } from './chart-points/mariners';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyMarinersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked on the Mariners'
// official T-Mobile Park seat-map page. Row and roof geometry remain modeled.
const ORIENTATION = getStadiumOrientation('mariners');

export const marinersSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(marinersChartPoints, {
  orientation: ORIENTATION,
  behindHomeIds: ['129', '131'],
  centerFieldIds: ['Power-Alley'],
  classify: classifyMarinersSection,
}));

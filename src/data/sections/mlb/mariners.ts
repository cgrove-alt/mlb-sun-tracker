import type { DetailedSection } from '../../../types/stadium-complete';
import { marinersChartPoints } from './chart-points/mariners';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyMarinersSection } from './sourcedChartClassifiers';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked on the Mariners'
// official T-Mobile Park seat-map page. Row and roof geometry remain modeled.
export const marinersSections: DetailedSection[] = buildParkSections(45, chartSeeds(marinersChartPoints, {
  orientation: 45,
  behindHomeIds: ['129', '131'],
  centerFieldIds: ['Power-Alley'],
  classify: classifyMarinersSection,
}));

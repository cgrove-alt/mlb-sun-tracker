import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { angelsChartPoints } from './chart-points/angels';
import { classifyAngelsSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const angelsSections: DetailedSection[] = buildParkSections(
  50,
  chartSeeds(angelsChartPoints, {
    orientation: 50,
    behindHomeIds: ['118', '119'],
    centerFieldIds: ['249', '256'],
    classify: classifyAngelsSection,
  }),
);

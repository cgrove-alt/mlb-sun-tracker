import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { cardinalsChartPoints } from './chart-points/cardinals';
import { classifyCardinalsSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const cardinalsSections: DetailedSection[] = buildParkSections(
  60,
  chartSeeds(cardinalsChartPoints, {
    orientation: 60,
    behindHomeIds: ['5', '6'],
    centerFieldIds: ['FLA', 'SBP'],
    classify: classifyCardinalsSection,
  }),
);

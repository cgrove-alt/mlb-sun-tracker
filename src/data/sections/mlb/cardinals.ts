import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { cardinalsChartPoints } from './chart-points/cardinals';
import { classifyCardinalsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('cardinals');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const cardinalsSections: DetailedSection[] = buildParkSections(
  60,
  chartSeeds(cardinalsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ['5', '6'],
    centerFieldIds: ['FLA', 'SBP'],
    classify: classifyCardinalsSection,
  }),
);

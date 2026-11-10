import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { nationalsChartPoints } from './chart-points/nationals';
import { classifyNationalsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('nationals');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const nationalsSections: DetailedSection[] = buildParkSections(
  30,
  chartSeeds(nationalsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ['C', 'D'],
    centerFieldIds: ['101', '143'],
    classify: classifyNationalsSection,
  }),
);

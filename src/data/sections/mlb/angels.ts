import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { angelsChartPoints } from './chart-points/angels';
import { classifyAngelsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('angels');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const angelsSections: DetailedSection[] = buildParkSections(
  50,
  chartSeeds(angelsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ['118', '119'],
    centerFieldIds: ['249', '256'],
    classify: classifyAngelsSection,
  }),
);

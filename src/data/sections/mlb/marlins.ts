import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { marlinsChartPoints } from './chart-points/marlins';
import { classifyMarlinsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('marlins');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const marlinsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(marlinsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ['SEC14', 'SEC15'],
    centerFieldIds: ['SEC134'],
    classify: classifyMarlinsSection,
  }),
);

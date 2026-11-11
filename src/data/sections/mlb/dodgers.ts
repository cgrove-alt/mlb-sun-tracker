import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { dodgersChartPoints } from './chart-points/dodgers';
import { classifyDodgersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('dodgers');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const dodgersSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(dodgersChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["2DG","3DG"],
    centerFieldIds: ["FSRO","FSRO1"],
    classify: classifyDodgersSection,
  }),
);

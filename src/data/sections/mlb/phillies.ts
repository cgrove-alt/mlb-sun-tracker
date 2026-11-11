import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { philliesChartPoints } from './chart-points/phillies';
import { classifyPhilliesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('phillies');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const philliesSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(philliesChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["124","125"],
    centerFieldIds: ["RB","RBW"],
    classify: classifyPhilliesSection,
  }),
);

import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { royalsChartPoints } from './chart-points/royals';
import { classifyRoyalsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('royals');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const royalsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(royalsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["126","127"],
    centerFieldIds: ["DECKSRO"],
    classify: classifyRoyalsSection,
  }),
);

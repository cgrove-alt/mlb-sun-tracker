import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { raysChartPoints } from './chart-points/rays';
import { classifyRaysSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('rays');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const raysSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(raysChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["104","106"],
    centerFieldIds: ["SRO"],
    classify: classifyRaysSection,
  }),
);

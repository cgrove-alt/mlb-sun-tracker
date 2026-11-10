import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { piratesChartPoints } from './chart-points/pirates';
import { classifyPiratesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('pirates');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const piratesSections: DetailedSection[] = buildParkSections(
  120,
  chartSeeds(piratesChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["18","19"],
    centerFieldIds: ["140","141"],
    classify: classifyPiratesSection,
  }),
);

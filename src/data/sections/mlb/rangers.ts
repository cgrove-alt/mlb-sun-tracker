import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { rangersChartPoints } from './chart-points/rangers';
import { classifyRangersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('rangers');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const rangersSections: DetailedSection[] = buildParkSections(
  46,
  chartSeeds(rangersChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["15","16"],
    centerFieldIds: ["138","139"],
    classify: classifyRangersSection,
  }),
);

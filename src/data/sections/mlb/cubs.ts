import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { cubsChartPoints } from './chart-points/cubs';
import { classifyCubsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('cubs');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const cubsSections: DetailedSection[] = buildParkSections(
  30,
  chartSeeds(cubsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["13","14"],
    centerFieldIds: ["BLCHRGA"],
    classify: classifyCubsSection,
  }),
);

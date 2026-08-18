import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { cubsChartPoints } from './chart-points/cubs';
import { classifyCubsSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const cubsSections: DetailedSection[] = buildParkSections(
  30,
  chartSeeds(cubsChartPoints, {
    orientation: 30,
    behindHomeIds: ["13","14"],
    centerFieldIds: ["BLCHRGA"],
    classify: classifyCubsSection,
  }),
);

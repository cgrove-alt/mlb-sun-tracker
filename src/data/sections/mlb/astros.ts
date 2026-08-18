import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { astrosChartPoints } from './chart-points/astros';
import { classifyAstrosSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const astrosSections: DetailedSection[] = buildParkSections(
  340,
  chartSeeds(astrosChartPoints, {
    orientation: 340,
    behindHomeIds: ["122"],
    centerFieldIds: ["FC"],
    classify: classifyAstrosSection,
  }),
);

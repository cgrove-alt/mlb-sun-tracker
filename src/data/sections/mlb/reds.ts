import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { redsChartPoints } from './chart-points/reds';
import { classifyRedsSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const redsSections: DetailedSection[] = buildParkSections(
  115,
  chartSeeds(redsChartPoints, {
    orientation: 115,
    behindHomeIds: ["122","123"],
    centerFieldIds: ["SRO"],
    classify: classifyRedsSection,
  }),
);

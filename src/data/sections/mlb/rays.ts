import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { raysChartPoints } from './chart-points/rays';
import { classifyRaysSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const raysSections: DetailedSection[] = buildParkSections(
  316,
  chartSeeds(raysChartPoints, {
    orientation: 316,
    behindHomeIds: ["104","106"],
    centerFieldIds: ["SRO"],
    classify: classifyRaysSection,
  }),
);

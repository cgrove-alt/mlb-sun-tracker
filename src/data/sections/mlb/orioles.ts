import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { oriolesChartPoints } from './chart-points/orioles';
import { classifyOriolesSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const oriolesSections: DetailedSection[] = buildParkSections(
  30,
  chartSeeds(oriolesChartPoints, {
    orientation: 30,
    behindHomeIds: ["32"],
    centerFieldIds: ["DECK"],
    classify: classifyOriolesSection,
  }),
);

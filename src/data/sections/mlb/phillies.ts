import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { philliesChartPoints } from './chart-points/phillies';
import { classifyPhilliesSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const philliesSections: DetailedSection[] = buildParkSections(
  18,
  chartSeeds(philliesChartPoints, {
    orientation: 18,
    behindHomeIds: ["124","125"],
    centerFieldIds: ["RB","RBW"],
    classify: classifyPhilliesSection,
  }),
);

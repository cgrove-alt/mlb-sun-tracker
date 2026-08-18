import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { tigersChartPoints } from './chart-points/tigers';
import { classifyTigersSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const tigersSections: DetailedSection[] = buildParkSections(
  145,
  chartSeeds(tigersChartPoints, {
    orientation: 145,
    behindHomeIds: ["126","127"],
    centerFieldIds: ["101","151"],
    classify: classifyTigersSection,
  }),
);

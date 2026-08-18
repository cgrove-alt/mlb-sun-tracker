import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { royalsChartPoints } from './chart-points/royals';
import { classifyRoyalsSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const royalsSections: DetailedSection[] = buildParkSections(
  48,
  chartSeeds(royalsChartPoints, {
    orientation: 48,
    behindHomeIds: ["126","127"],
    centerFieldIds: ["DECKSRO"],
    classify: classifyRoyalsSection,
  }),
);

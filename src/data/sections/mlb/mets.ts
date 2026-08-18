import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { metsChartPoints } from './chart-points/mets';
import { classifyMetsSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const metsSections: DetailedSection[] = buildParkSections(
  35,
  chartSeeds(metsChartPoints, {
    orientation: 35,
    behindHomeIds: ["121"],
    centerFieldIds: ["MARKET"],
    classify: classifyMetsSection,
  }),
);

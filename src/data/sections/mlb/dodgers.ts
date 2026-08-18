import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { dodgersChartPoints } from './chart-points/dodgers';
import { classifyDodgersSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const dodgersSections: DetailedSection[] = buildParkSections(
  25,
  chartSeeds(dodgersChartPoints, {
    orientation: 25,
    behindHomeIds: ["2DG","3DG"],
    centerFieldIds: ["FSRO","FSRO1"],
    classify: classifyDodgersSection,
  }),
);

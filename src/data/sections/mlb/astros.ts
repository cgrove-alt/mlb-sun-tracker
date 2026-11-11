import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { astrosChartPoints } from './chart-points/astros';
import { classifyAstrosSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('astros');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const astrosSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(astrosChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["122"],
    centerFieldIds: ["FC"],
    classify: classifyAstrosSection,
  }),
);

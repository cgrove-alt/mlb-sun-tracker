import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { redsChartPoints } from './chart-points/reds';
import { classifyRedsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('reds');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const redsSections: DetailedSection[] = buildParkSections(
  115,
  chartSeeds(redsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["122","123"],
    centerFieldIds: ["SRO"],
    classify: classifyRedsSection,
  }),
);

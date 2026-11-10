import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { guardiansChartPoints } from './chart-points/guardians';
import { classifyGuardiansSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('guardians');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const guardiansSections: DetailedSection[] = buildParkSections(
  356,
  chartSeeds(guardiansChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["153","154"],
    centerFieldIds: ["1012","1013"],
    classify: classifyGuardiansSection,
  }),
);

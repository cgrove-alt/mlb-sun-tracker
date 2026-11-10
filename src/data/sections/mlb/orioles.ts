import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { oriolesChartPoints } from './chart-points/orioles';
import { classifyOriolesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('orioles');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const oriolesSections: DetailedSection[] = buildParkSections(
  30,
  chartSeeds(oriolesChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["32"],
    centerFieldIds: ["DECK"],
    classify: classifyOriolesSection,
  }),
);

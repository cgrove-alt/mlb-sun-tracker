import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { brewersChartPoints } from './chart-points/brewers';
import { classifyBrewersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('brewers');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const brewersSections: DetailedSection[] = buildParkSections(
  135,
  chartSeeds(brewersChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["117"],
    centerFieldIds: ["BULLPEN"],
    classify: classifyBrewersSection,
  }),
);

import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { brewersChartPoints } from './chart-points/brewers';
import { classifyBrewersSection } from './sourcedChartClassifiers';

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const brewersSections: DetailedSection[] = buildParkSections(
  135,
  chartSeeds(brewersChartPoints, {
    orientation: 135,
    behindHomeIds: ["117"],
    centerFieldIds: ["BULLPEN"],
    classify: classifyBrewersSection,
  }),
);

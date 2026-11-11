import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { metsChartPoints } from './chart-points/mets';
import { classifyMetsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('mets');

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const metsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(metsChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ["121"],
    centerFieldIds: ["MARKET"],
    classify: classifyMetsSection,
  }),
);

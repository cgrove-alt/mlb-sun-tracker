import type { DetailedSection } from '../../../types/stadium-complete';
import { yankeesChartPoints } from './chart-points/yankees';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyYankeesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('yankees');

/**
 * The 222 current products in the Yankees-linked IOMEDIA map, including its
 * zero-padded field IDs and W/S accessibility or standing variants. These IDs
 * are intentionally not normalized onto the older 184-entry hand map because
 * doing so would erase real products published by the venue.
 */
export const yankeesSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(
  yankeesChartPoints,
  {
    orientation: ORIENTATION,
    behindHomeIds: ['122', '123'],
    centerFieldIds: ['202', '238'],
    classify: classifyYankeesSection,
  },
));

export const yankeesSectionMap = new Map(yankeesSections.map((section) => [section.id, section]));

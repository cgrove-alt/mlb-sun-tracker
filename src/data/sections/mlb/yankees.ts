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
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map, in the middle
      // of the section and 4 m to either side.
      { ids: ['132'], facingDeg: 325 },
      { ids: ['205'], facingDeg: 164 },
      { ids: ['205W'], facingDeg: 160 },
      { ids: ['206'], facingDeg: 179 },
      { ids: ['208', '207'], facingDeg: 194 },
      { ids: ['209'], facingDeg: 188 },
      { ids: ['214B'], facingDeg: 201 },
      { ids: ['218A'], facingDeg: 220 },
      { ids: ['218B'], facingDeg: 229 },
      { ids: ['221B'], facingDeg: 285 },
      { ids: ['222'], facingDeg: 290 },
      { ids: ['226'], facingDeg: 307 },
      { ids: ['227A', '325W'], facingDeg: 308 },
      { ids: ['232B'], facingDeg: 315 },
      { ids: ['233A', '232A'], facingDeg: 320 },
      { ids: ['233B'], facingDeg: 317 },
      { ids: ['234W'], facingDeg: 332 },
      { ids: ['309W'], facingDeg: 202 },
      { ids: ['313W'], facingDeg: 203 },
      { ids: ['324'], facingDeg: 303 },
      { ids: ['327', '328'], facingDeg: 312 },
      { ids: ['333W'], facingDeg: 319 },
    ],
    behindHomeIds: ['122', '123'],
    centerFieldIds: ['202', '238'],
    // The straight runs of field-level boxes along each foul line (first base
    // on the chart's left). The boxes nearer home (015A–017A, 023–024B) curve
    // toward the plate, so they are left out of the line fits.
    foulLineRows: {
      firstBase: ['011', '012', '013', '014A', '014B'],
      thirdBase: ['025', '026', '027A', '027B', '028', '029'],
    },
    // 0xx Legends, 1xx Field, 2xx Main (and bleachers), 3xx Terrace, 4xx Grandstand.
    tierOf: (id) => id.replace(/^S/, '').charAt(0),
    classify: classifyYankeesSection,
  },
));

export const yankeesSectionMap = new Map(yankeesSections.map((section) => [section.id, section]));

import type { DetailedSection } from '../../../types/stadium-complete';
import { redSoxPublishedChartPoints } from './chart-points/reconciledLiveParkPoints';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyRedSoxSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';
import { fenwayTier } from '../../stadiumStructures';

const ORIENTATION = getStadiumOrientation('redsox');

/**
 * All 483 ticket products currently published by the Red Sox-linked Fenway
 * 3-D viewer. Product identities and direct/aliased screen footprints are
 * source-backed; row, elevation, obstruction, and coverage geometry remains
 * modeled and cannot pass the public shade release gate.
 */
export const redsoxSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(
  redSoxPublishedChartPoints,
  {
    orientation: ORIENTATION,
    standRuns: [
      // Turned where two lidar measurements agree on the way the rows climb
      // (scripts/measureStandHeights.py treads): planes fitted to the treads
      // (five readings within 15°) and the fall line in the middle (within 8°
      // of them), both more than 10° off the direction fitted on the map; each
      // faces their mean.
      { ids: ['B111'], facingDeg: 175 },
      { ids: ['B113'], facingDeg: 175 },
      { ids: ['B144'], facingDeg: 275 },
      { ids: ['B7'], facingDeg: 158 },
      { ids: ['D29'], facingDeg: 173 },
      { ids: ['D51'], facingDeg: 275 },
      { ids: ['F11'], facingDeg: 158 },
      { ids: ['F28'], facingDeg: 173 },
      { ids: ['F29'], facingDeg: 173 },
      { ids: ['F47'], facingDeg: 249 },
      { ids: ['F50'], facingDeg: 276 },
      { ids: ['F51'], facingDeg: 275 },
      { ids: ['F9'], facingDeg: 161 },
      { ids: ['FBC29'], facingDeg: 173 },
      { ids: ['FBC51'], facingDeg: 275 },
      { ids: ['H47'], facingDeg: 249 },
      { ids: ['H50'], facingDeg: 276 },
      // Turned to the direction their treads climb: planes fitted to the
      // treads (scripts/measureStandHeights.py treads) agree within 15° and
      // lie more than 10° off the median of the rows' fall lines.
      { ids: ['F71', 'FBC71'], facingDeg: 310 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['B153'], facingDeg: 288 },
      { ids: ['B154'], facingDeg: 297 },
      { ids: ['B155'], facingDeg: 308 },
      { ids: ['B165'], facingDeg: 302 },
      { ids: ['B6'], facingDeg: 157 },
      { ids: ['F49', 'H49'], facingDeg: 273 },
      { ids: ['F70', 'FBC70'], facingDeg: 307 },
      { ids: ['B109', 'B110', 'B118'], facingDeg: 174 },
      { ids: ['B112'], facingDeg: 175 },
      { ids: ['B5'], facingDeg: 159 },
      { ids: ['B89'], facingDeg: 164 },
      { ids: ['F12'], facingDeg: 160 },
      { ids: ['F72', 'D72', 'FBC72'], facingDeg: 299 },
    ],
    behindHomeIds: ['F39', 'F50'],
    centerFieldIds: ['L36', 'L37'],
    // The straight runs of Field Boxes along each foul line. On this chart
    // home plate is at the top, first base runs to the left and third base
    // runs down the right-hand side.
    foulLineRows: {
      firstBase: ['F12', 'F14', 'F16', 'F18', 'F20', 'F22', 'F24', 'F26', 'F28', 'F30', 'F32', 'F34'],
      thirdBase: ['F52', 'F54', 'F56', 'F58', 'F60', 'F62', 'F64', 'F66'],
    },
    // Upper (U) and top (T) bleacher sections sit behind the main ones: a
    // separate ring for fitting stand directions.
    tierOf: (id) => `${fenwayTier(id) ?? 'other'}${/^L\d+[UT]$/.test(id) ? ':back' : ''}`,
    classify: classifyRedSoxSection,
  },
));

export const redsoxSectionMap = new Map(redsoxSections.map((section) => [section.id, section]));

import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { dodgersChartPoints } from './chart-points/dodgers';
import { classifyDodgersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('dodgers');

// Pinned on USGS NAIP m_3411863_nw_11_060_20220511 (2022-05-11), a
// 400 m-wide north-up image centred on 34.0739, -118.2400 at 0.4 m/px with
// home plate at pixel (446.5, 632.75). Pixel reads in brackets, ±3 m.
// The old anchors (FSRO, FSRO1) sit at the left-field pavilion, not
// center field, which turned the whole map about 35° toward left field.
export const DODGERS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['1FD', '2FD'], bearingDeg: 207.0, distanceM: 41.0 }, // field level on the axis behind home [400, 724]
  { ids: ['53FD'], bearingDeg: 340.0, distanceM: 116.1 }, // end of the field level at the LF pole [347, 360]
  { ids: ['52FD'], bearingDeg: 69.7, distanceM: 106.8 }, // end of the field level at the RF pole [697, 540]
  { ids: ['301PL'], bearingDeg: 351.8, distanceM: 122.3 }, // LF pavilion, corner end [403, 330]
  { ids: ['315PL'], bearingDeg: 18.9, distanceM: 128.0 }, // LF pavilion, center-field end [550, 330]
  { ids: ['302PR'], bearingDeg: 60.8, distanceM: 113.8 }, // RF pavilion, corner end [695, 494]
  { ids: ['316PR'], bearingDeg: 34.2, distanceM: 128.5 }, // RF pavilion, center-field end [627, 367]
];

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const dodgersSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(dodgersChartPoints, {
    orientation: ORIENTATION,
    aerialControl: DODGERS_AERIAL_CONTROL,
    // Each ring by its section code (FD, DG, BL, LG, CL, RS, TD, PL, PR,
    // suites), for fitting stand directions: Field and Dugout Club share the
    // "field" level, Reserve and Top Deck share "upper".
    tierOf: (id) => id.replace(/^\d+/, '').replace(/^(STE|SCB|CL)\d+$/, '$1'),
    classify: classifyDodgersSection,
  }),
);

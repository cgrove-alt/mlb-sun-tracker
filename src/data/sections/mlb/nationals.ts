import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { nationalsChartPoints } from './chart-points/nationals';
import { classifyNationalsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('nationals');

// Pinned on USGS NAIP m_3807716_ne_18_030_20230901 (2023-09-01), a
// 260 m-wide north-up image centred on 38.87273, -77.00757 at 0.25 m/px with
// home plate at pixel (479.5, 588.7). Sections are counted between aisles
// along lines 32 m back from each foul line: each straight block starts with
// a narrow (4–4.5 m) section after the cross-walk from the curved block
// behind home (118 on the third-base side, 127 on the first-base side), then
// ~10 m sections. The right-field controls sit under the scoreboard
// pavilion's overhang (Rate Your Seats: rows H+ of 139–142 are covered).
export const NATIONALS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['C'], bearingDeg: 209, distanceM: 19 }, // Terra Club, rows A–L at the backstop
  { ids: ['DC122', 'DC123'], bearingDeg: 209, distanceM: 33 }, // Diamond Club behind them
  { ids: ['118'], bearingDeg: 263.8, distanceM: 32.5 },
  { ids: ['115'], bearingDeg: 299.6, distanceM: 45.8 },
  { ids: ['112'], bearingDeg: 317.6, distanceM: 71.9 },
  { ids: ['128'], bearingDeg: 150.0, distanceM: 33.0 },
  { ids: ['139', '140'], bearingDeg: 62.4, distanceM: 107.3 },
  { ids: ['142'], bearingDeg: 38.0, distanceM: 113.8 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 10–40 m back run 71–75° (mean 73.5°),
//   parallel to the line (74°), so it faces 164°. Third-base side: 342–346°
//   (mean 344.3°), parallel to the line (344°), so it faces 254°.
// - Behind home the rows are arcs whose centre sits ~3 m behind home plate on
//   the axis (1.8–4.4 m in seven bands of 121 rays), so each section there
//   faces away from that centre.
// - Outfield: the right-field scoreboard pavilion runs 136.9–139.1° (facing
//   48°, with the right-field seats under it), the center-field stand's rows
//   95.3° (facing 5°) and the left-field stand's rows 43.8° (facing 314°).
const RINGS = ['club', 'field', '1', '2', '3', '4'];
const FIRST = 164;
const THIRD = 254;
const CENTRE_BEHIND_HOME_M = 3;
/** Direction a section on the curve faces: away from the arc's centre. */
const curveFacing = (bearingFromHomeDeg: number, distanceM = 30) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const east = distanceM * Math.sin(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.sin(r(ORIENTATION + 180));
  const north = distanceM * Math.cos(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.cos(r(ORIENTATION + 180));
  return Math.round((((Math.atan2(east, north) * 180) / Math.PI) + 360) % 360);
};
// The curve in 6° steps of bearing from home, between where it faces the
// first-base and third-base directions.
const CURVE = Array.from({ length: 16 }, (_, i) => {
  const from = 167 + i * 6;
  const to = Math.min(from + 6, 251);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: curveFacing((from + to) / 2) };
}).filter((run) => run.fromBearingDeg < 251);

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const nationalsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(nationalsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: NATIONALS_AERIAL_CONTROL,
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map, in the middle
      // of the section and 4 m to either side.
      { ids: ['101'], facingDeg: 354 },
      { ids: ['240'], facingDeg: 88 },
      { ids: ['304'], facingDeg: 271 },
      { ids: ['100', '100K', '100L', '100M', '100N', '100P', '100Q'], facingDeg: 5 },
      { ids: ['101', '102', '103', '104', '105', '106', '107'], facingDeg: 314 },
      { ids: ['138', '139', '140', '141', '142', '143', '237', '238', '239', '240', '241', '242', '243'], facingDeg: 48 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: 251, toBearingDeg: 359.99, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 60, toBearingDeg: 166.99, facingDeg: FIRST },
    ],
    // Rings: the Terra Club and Diamond Club behind home, the 100s, then the
    // 200s, 300s and 400s; suites and clubs with their level.
    tierOf: (id, level) => {
      if (/^[A-E]$|^(DC|HP)\d+$/.test(id)) return 'club';
      const n = Number(id.replace(/^\D+|\D+$/g, ''));
      if (/^\d{3}[A-Z]?$/.test(id) && n >= 100 && n < 500) return String(Math.floor(n / 100));
      return level === 'suite' ? 'suites' : id;
    },
    classify: classifyNationalsSection,
  }),
);

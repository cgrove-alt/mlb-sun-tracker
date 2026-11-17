import type { DetailedSection } from '../../../types/stadium-complete';
import { rockiesChartPoints } from './chart-points/rockies';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { classifyRockiesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('rockies');

// Pinned on USGS NAIP m_3910409_sw_13_060_20190803 (2019-08-03), a
// 260 m-wide north-up image centred on 39.75579, -104.99419 at 0.25 m/px with
// home plate at pixel (517.5, 556). The club's drawing is turned 45° (home
// in the bottom-left corner). On an arc 30–34 m from home the aisles are 10°
// apart with one on the axis, so 130 and 131 straddle it; Rate Your Seats
// gives 128–133 as the block behind home (no deck over them). Along each
// line, 22 m out, the sections are ~7.5 m wide: 125 and 136 are the first
// past the curve. Each control is a section's middle, ~26 m back from the
// line (30 m from home on the curve); the 100s are 38 rows deep.
export const ROCKIES_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['130'], bearingDeg: 180.5, distanceM: 30 },
  { ids: ['133'], bearingDeg: 211, distanceM: 30 },
  { ids: ['127'], bearingDeg: 150, distanceM: 30 },
  { ids: ['122'], bearingDeg: 93.4, distanceM: 37.8 },
  { ids: ['118'], bearingDeg: 74.2, distanceM: 63.5 },
  { ids: ['139'], bearingDeg: 277.2, distanceM: 38.3 },
  { ids: ['143'], bearingDeg: 296, distanceM: 63.9 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 12–42 m back run 46.4–51.3° (mean 48.9°),
//   so it faces 139°. Third-base side: 315.7–322.4° (mean 319.4°), so 229°.
// - Behind home the rows are arcs centred ~4 m behind home plate (3.8 m at
//   16–20 m out, 57 of 81 rays); each section there faces away from it.
// - The left-field stands (151–160) run along their wall at 57.3–64.4°
//   (facing 330°); the right-field stands (105–109 and the decks above)
//   at 134–144° (facing 48°).
// - In the corners the photo's strongest lines are the radial aisles, which
//   point straight away from the field: 105.6° in the left-field corner
//   (facing 286°) and 95.8° in the right-field one (facing 96°).
// - The Rockpile (401–403) is beyond the photo; it keeps the drawing's
//   direction.
const RINGS = ['1', '2', '3', 'suites'];
const FIRST = 139;
const THIRD = 229;
const CENTRE_BEHIND_HOME_M = 4;
/** Direction a section on the curve faces: away from the arc's centre. */
const curveFacing = (bearingFromHomeDeg: number, distanceM = 30) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const east = distanceM * Math.sin(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.sin(r(ORIENTATION + 180));
  const north = distanceM * Math.cos(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.cos(r(ORIENTATION + 180));
  return Math.round((((Math.atan2(east, north) * 180) / Math.PI) + 360) % 360);
};
const CURVE = Array.from({ length: 15 }, (_, i) => {
  const from = 142 + i * 6;
  const to = Math.min(from + 6, 226);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: curveFacing((from + to) / 2) };
}).filter((run) => run.fromBearingDeg < 226);
const ids = (from: number, to: number, prefix = '') => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

/** Public map paths from the Rockies' club-linked Coors Field Seat Viewer. */
export const rockiesSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(rockiesChartPoints, {
  orientation: ORIENTATION,
  aerialControl: ROCKIES_AERIAL_CONTROL,
  standRuns: [
    // Turned to the rows' fall line, measured on the lidar
    // (scripts/measureStandHeights.py): these sections' rows climb firmly
    // more than 15° off the direction fitted on the map, in the middle
    // of the section and 4 m to either side.
    { ids: ['159'], facingDeg: 359 },
    { ids: ['244'], facingDeg: 246 },
    { ids: [...ids(105, 109), ...ids(201, 209), ...ids(301, 309)], facingDeg: 48 },
    { ids: ids(151, 160), facingDeg: 330 },
    { ids: ids(110, 115), facingDeg: 96 },
    { ids: ids(148, 150), facingDeg: 286 },
    ...CURVE,
    { rings: RINGS, fromBearingDeg: 226, toBearingDeg: 335, facingDeg: THIRD },
    { rings: RINGS, fromBearingDeg: 40, toBearingDeg: 141.99, facingDeg: FIRST },
  ],
  // Rings: the 100s, the club level (200s), suites (1–45), the 300s (L/U)
  // and the Rockpile.
  tierOf: (id, level) => {
    if (/^\d{3}$/.test(id)) return id[0];
    if (/^[LU]\d{3}$/.test(id)) return '3';
    return level === 'suite' ? 'suites' : id;
  },
  classify: classifyRockiesSection,
}));

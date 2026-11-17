import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { angelsChartPoints } from './chart-points/angels';
import { classifyAngelsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('angels');

// Pinned on USGS NAIP m_3311709_se_11_060_20220425 (2022-04-25), a
// 260 m-wide north-up image centred on 33.79998, -117.8831 at 0.25 m/px with
// home plate at pixel (494.5, 547). The 100s run from 101 in the left-field
// corner to 135 in the right-field corner (Rate Your Seats puts 104–113 on
// the third-base side and 132–135 in the right-field corner). On an arc
// 26 m from home the aisles are ~11.3° apart with 118 centred on the axis;
// along each foul line, 26 m out, the sections whose front rows give way to
// the dugouts (110–113, 123–126: rows C–Z) sit over the dugout roofs seen on
// the photo, ~10.5 m each. Each control is a section's middle, ~23 m back
// from the line (28 m from home on the curve).
export const ANGELS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['118'], bearingDeg: 224.2, distanceM: 28 },
  { ids: ['116'], bearingDeg: 246.2, distanceM: 28 },
  { ids: ['120'], bearingDeg: 202.2, distanceM: 28 },
  { ids: ['111'], bearingDeg: 320.2, distanceM: 36.7 },
  { ids: ['107'], bearingDeg: 341.1, distanceM: 75 },
  { ids: ['125'], bearingDeg: 128.9, distanceM: 35.9 },
  { ids: ['128'], bearingDeg: 110.2, distanceM: 63.7 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - Third-base side: level lines 12–42 m back run 357.6–1° (mean 359.4°),
//   parallel to the line (359°), so it faces 269°. First-base side:
//   87.2–90.7° (mean 88.8°), so it faces 179°.
// - Behind home the rows are arcs whose centre sits 2.8 m (16–20 m out) to
//   ~7 m (the outer rings) behind home plate on the axis; each section on
//   the curve faces away from a centre 5 m back.
// - The corners turn between the straights and the outfield stands: past
//   the left-field pole the rows run 27.6–31.1° (facing ~299°, between the
//   third-base side's 269° and the left-field stand's 1°); in the
//   right-field corner the rows' texture runs 37.7–42.1° (facing ~130°,
//   between the first-base side's 179° and the pavilion's 73°). Lines at
//   119–142° there are its aisles.
// - Right-field pavilion (236–249): rows along its wall at 162.6–163.6°,
//   facing 73°. The stand behind the left-center bullpens: rows at
//   89.9–91.8°, facing 1°.
const RINGS = ['1', '2', '3', '4', '5'];
const FIRST = 179;
const THIRD = 269;
const CENTRE_BEHIND_HOME_M = 5;
/** Direction a section on the curve faces: away from the arc's centre. */
const curveFacing = (bearingFromHomeDeg: number, distanceM = 28) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const east = distanceM * Math.sin(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.sin(r(ORIENTATION + 180));
  const north = distanceM * Math.cos(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.cos(r(ORIENTATION + 180));
  return Math.round((((Math.atan2(east, north) * 180) / Math.PI) + 360) % 360);
};
// The curve in 6° steps of bearing from home, between where it faces the
// first-base and third-base directions.
const CURVE = Array.from({ length: 15 }, (_, i) => {
  const from = 182 + i * 6;
  const to = Math.min(from + 6, 266);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: curveFacing((from + to) / 2) };
}).filter((run) => run.fromBearingDeg < 266);

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const angelsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(angelsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: ANGELS_AERIAL_CONTROL,
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map, in the middle
      // of the section and 4 m to either side.
      { ids: ['244'], facingDeg: 92 },
      { ids: ['401'], facingDeg: 285 },
      { ids: ['435'], facingDeg: 163 },
      { ids: ['101', '102', '201', '301'], facingDeg: 299 },
      { ids: ['236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249'], facingDeg: 73 },
      { ids: ['256', '257', '258', '259', '260'], facingDeg: 1 },
      { rings: RINGS, fromBearingDeg: 80, toBearingDeg: 96.99, facingDeg: 130 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: 266, toBearingDeg: 359.99, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 97, toBearingDeg: 181.99, facingDeg: FIRST },
    ],
    // Rings: the 100s to the 500s by hundreds; suites and the Legends boxes
    // with their level.
    tierOf: (id, level) => (/^\d{3}$/.test(id) ? id[0] : level),
    classify: classifyAngelsSection,
  }),
);

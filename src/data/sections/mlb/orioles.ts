import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { oriolesChartPoints } from './chart-points/orioles';
import { classifyOriolesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('orioles');

// Pinned on USGS NAIP m_3907644_sw_18_030_20230525 (2023-05-25), a
// 260 m-wide north-up image centred on 39.28366, -76.6218 at 0.25 m/px with
// home plate at pixel (481.2, 585.4). Rate Your Seats puts 22–26 behind the
// Orioles' (first-base) dugout and 48–52 behind the visitors'; on the photo
// each dugout starts level with home, so those are the first straight
// sections, and the ten field sections between them (28–46) are ~10° wedges
// on the curve (aisles at 160.5°, 171.5°, … 264.5° from home), with the
// axis between 36 and 38. Field sections share their aisles with the
// Terrace (odd numbers) behind them. Sections behind a dugout start behind
// it, so their middles are ~24 m out rather than ~20 m.
export const ORIOLES_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['36', '38'], bearingDeg: 211, distanceM: 26 },
  { ids: ['30'], bearingDeg: 176.5, distanceM: 26 },
  { ids: ['44'], bearingDeg: 249, distanceM: 26 },
  { ids: ['24'], bearingDeg: 138.9, distanceM: 26.9 },
  { ids: ['18'], bearingDeg: 107, distanceM: 38.8 },
  { ids: ['14'], bearingDeg: 97.4, distanceM: 54.8 },
  { ids: ['50'], bearingDeg: 284, distanceM: 27.2 },
  { ids: ['56'], bearingDeg: 318, distanceM: 40.5 },
  { ids: ['60'], bearingDeg: 326.7, distanceM: 57.3 },
  { ids: ['94'], bearingDeg: 56.7, distanceM: 120.8 }, // right-field bleachers beside the wall [885, 320]
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 12–40 m back run 73.6–76.7° (mean 75.4°),
//   parallel to the line (76°), so it faces 166°. Third-base side:
//   343.9–347.3° (mean 345.6°), parallel to the line (346°), so it faces 256°.
// - Behind home the rows are arcs centred ~5 m behind home plate on the axis
//   (4.3–5.8 m in four bands), so each section there faces away from that
//   centre.
// - The right-field corner (1–8, "a brilliant angle towards home plate")
//   has rows at 49.4–51.7°, facing 140°. The bleachers along the right-field
//   wall (94–98) have rows at ~177.6°, facing 88°; those on the angled
//   right-center wall (90, 92) rows at 143.7–147°, facing 55°.
// - Past the left-field pole a corner wedge has rows at ~45° (facing 315°),
//   then the left-field stands' rows run 89–93.9° (facing 2°).
const LOWER = ['field', 'terrace'];
const RINGS = [...LOWER, '2', '3'];
const FIRST = 166;
const THIRD = 256;
const CENTRE_BEHIND_HOME_M = 5;
/** Direction a section on the curve faces: away from the arc's centre. */
const curveFacing = (bearingFromHomeDeg: number, distanceM = 26) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const east = distanceM * Math.sin(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.sin(r(ORIENTATION + 180));
  const north = distanceM * Math.cos(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.cos(r(ORIENTATION + 180));
  return Math.round((((Math.atan2(east, north) * 180) / Math.PI) + 360) % 360);
};
// The curve in 6° steps of bearing from home, between where it faces the
// first-base and third-base directions.
const CURVE = Array.from({ length: 16 }, (_, i) => {
  const from = 170 + i * 6;
  const to = Math.min(from + 6, 252);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: curveFacing((from + to) / 2) };
}).filter((run) => run.fromBearingDeg < 252);

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const oriolesSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(oriolesChartPoints, {
    orientation: ORIENTATION,
    aerialControl: ORIOLES_AERIAL_CONTROL,
    standRuns: [
      // Turned where two lidar measurements agree on the way the rows climb
      // (scripts/measureStandHeights.py treads): planes fitted to the treads
      // (five readings within 15°) and the fall line in the middle (within 8°
      // of them), both more than 10° off the direction they had (fitted on
      // the map or on a photo); each faces their mean.
      { ids: ['16'], facingDeg: 155 },
      { ids: ['214'], facingDeg: 151 },
      { ids: ['270'], facingDeg: 268 },
      { ids: ['3'], facingDeg: 155 },
      { ids: ['306'], facingDeg: 153 },
      { ids: ['370'], facingDeg: 267 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['74'], facingDeg: 355 },
      { ids: ['8'], facingDeg: 120 },
      { ids: ['1', '6'], facingDeg: 111 },
      { ids: ['264'], facingDeg: 268 },
      { ids: ['1', '3', '5', '6', '7', '8'], facingDeg: 140 },
      { ids: ['94', '96', '98'], facingDeg: 88 },
      { ids: ['90', '92', 'DECK'], facingDeg: 55 },
      { rings: LOWER, fromBearingDeg: 343, toBearingDeg: 355.99, facingDeg: 315 },
      { rings: LOWER, fromBearingDeg: 356, toBearingDeg: 40, facingDeg: 2 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: 252, toBearingDeg: 40, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 60, toBearingDeg: 169.99, facingDeg: FIRST },
    ],
    // Rings: field sections (even numbers) and the Terrace behind them (odd
    // numbers, and the C boxes behind home), then the 200s and 300s.
    tierOf: (id, level) => {
      if (/^C\d+$/.test(id)) return 'terrace';
      if (/^\d{1,2}$/.test(id)) return Number(id) % 2 === 0 ? 'field' : 'terrace';
      if (/^\d{3}$/.test(id)) return id[0];
      return level === 'suite' ? 'suites' : id;
    },
    classify: classifyOriolesSection,
  }),
);

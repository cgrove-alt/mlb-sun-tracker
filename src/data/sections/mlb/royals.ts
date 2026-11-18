import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { royalsChartPoints } from './chart-points/royals';
import { classifyRoyalsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('royals');

// Pinned on USGS NAIP m_3909461_sw_15_060_20220629 (2022-06-29), a
// 260 m-wide north-up image centred on 39.05131, -94.48074 at 0.25 m/px with
// home plate at pixel (492.5, 547.5). The photo is soft (0.6 m source) and
// the stands behind home are washed out, so the controls are counted along
// the baselines, where aisles show 22 m back from each line: from the
// corners in, about 7 m apart (109–113 on the third-base side, 142–146 on
// the first-base side; Rate Your Seats puts 115–117 at the visitors' dugout
// and 139–141 at the Royals'). The axis falls between 127 and 128.
export const ROYALS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['127', '128'], bearingDeg: 227, distanceM: 24 },
  { ids: ['113'], bearingDeg: 338.9, distanceM: 53.6 },
  { ids: ['109'], bearingDeg: 347, distanceM: 81.3 },
  { ids: ['142'], bearingDeg: 115.2, distanceM: 53.3 },
  { ids: ['146'], bearingDeg: 107.1, distanceM: 80.8 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - Third-base side: eleven level lines 14–32 m back and 35–65 m along run
//   356.7–5.4° (mean ~0.9°), parallel to the line (1.3°), so it faces 271°.
//   First-base side: 88.9–94.9° (mean 92.2°), parallel to the line (92°),
//   so it faces 182°.
// - Behind home the rows are arcs centred ~4–6 m behind home plate; each
//   section on the curve faces away from a centre 5 m back.
// - The outfield corners are too soft on this photo to read; their sections
//   keep the club drawing's directions.
// - The club's 3D drawing places the upper rings up to ~45° off around the
//   bowl (314, the Loge's middle section, lands at 180° from home instead of
//   behind home), and the photo is too soft to pin them separately. So the
//   200s, 300s and 400s are mapped by order onto the lower bowl's measured
//   shape: each ring's middle section (225|230, 314, 420) behind home, the
//   curve in the lower bowl's steps, the rest on the straights.
const UPPER_RUNS = [
  ...[[223, 267], [224, 253], [225, 238], [230, 216], [231, 201], [232, 187]],
  ...[[311, 267], [312, 253], [313, 238], [314, 227], [315, 216], [316, 201], [317, 187]],
  ...[[416, 267], [417, 257], [418, 247], [419, 237], [420, 227], [421, 217], [422, 207], [423, 197], [424, 187]],
].map(([n, facingDeg]) => ({ ids: [String(n), `${n}R`], facingDeg }));
const upperIds = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => [`${from + i}`, `${from + i}R`]).flat();
const RINGS = ['1', '2', '3', '4'];
const FIRST = 182;
const THIRD = 271;
const CENTRE_BEHIND_HOME_M = 5;
/** Direction a section on the curve faces: away from the arc's centre. */
const curveFacing = (bearingFromHomeDeg: number, distanceM = 26) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const east = distanceM * Math.sin(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.sin(r(ORIENTATION + 180));
  const north = distanceM * Math.cos(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.cos(r(ORIENTATION + 180));
  return Math.round((((Math.atan2(east, north) * 180) / Math.PI) + 360) % 360);
};
const CURVE = Array.from({ length: 15 }, (_, i) => {
  const from = 185 + i * 6;
  const to = Math.min(from + 6, 268);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: curveFacing((from + to) / 2) };
}).filter((run) => run.fromBearingDeg < 268);

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const royalsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(royalsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: ROYALS_AERIAL_CONTROL,
    standRuns: [
      // Turned where two lidar measurements agree on the way the rows climb
      // (scripts/measureStandHeights.py treads): planes fitted to the treads
      // (five readings within 15°) and the fall line in the middle (within 8°
      // of them), both more than 10° off the direction they had (fitted on
      // the map or on a photo); each faces their mean.
      { ids: ['112'], facingDeg: 288 },
      { ids: ['114'], facingDeg: 288 },
      { ids: ['142'], facingDeg: 166 },
      { ids: ['143'], facingDeg: 165 },
      { ids: ['144'], facingDeg: 164 },
      { ids: ['145'], facingDeg: 163 },
      { ids: ['147'], facingDeg: 161 },
      { ids: ['213'], facingDeg: 286 },
      { ids: ['244'], facingDeg: 165 },
      { ids: ['403'], facingDeg: 286 },
      { ids: ['405'], facingDeg: 285 },
      { ids: ['406'], facingDeg: 285 },
      { ids: ['427'], facingDeg: 196 },
      { ids: ['434'], facingDeg: 170 },
      { ids: ['435'], facingDeg: 170 },
      { ids: ['436'], facingDeg: 168 },
      { ids: ['437'], facingDeg: 167 },
      // Turned to the direction their treads climb: planes fitted to the
      // treads (scripts/measureStandHeights.py treads) agree within 15° and
      // lie more than 10° off the median of the rows' fall lines.
      { ids: ['128'], facingDeg: 226 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['108', '110'], facingDeg: 291 },
      { ids: ['129'], facingDeg: 214 },
      { ids: ['146'], facingDeg: 165 },
      { ids: ['250'], facingDeg: 140 },
      { ids: ['415'], facingDeg: 257 },
      ...UPPER_RUNS,
      { ids: [...upperIds(206, 222), ...upperIds(303, 310), ...upperIds(402, 415)], facingDeg: THIRD },
      { ids: [...upperIds(233, 252), ...upperIds(318, 325), ...upperIds(425, 439)], facingDeg: FIRST },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: 268, toBearingDeg: 352, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 102, toBearingDeg: 184.99, facingDeg: FIRST },
    ],
    // Rings: the 100s to the 400s (the 400s' upper rows, "R", with them).
    tierOf: (id, level) => (/^\d{3}R?$/.test(id) ? id[0] : level),
    classify: classifyRoyalsSection,
  }),
);

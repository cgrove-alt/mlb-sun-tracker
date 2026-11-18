import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { redsChartPoints } from './chart-points/reds';
import { classifyRedsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('reds');

// Pinned on USGS NAIP m_3908460_ne_17_030_20230522 (2023-05-22), a
// 260 m-wide north-up image centred on 39.09744, -84.50697 at 0.25 m/px with
// home plate at pixel (491.1, 504.8). Rate Your Seats puts 127 at the
// dugouts on the first-base side, 509–519 on the third-base side and the
// Sun/Moon Deck (140–146) along the right-field wall. Behind home the aisles
// 30–34 m out are ~14.5° apart and the five short sections behind the
// Diamond Seats (122–126) are centred on the axis, so 124 sits on it. Along
// the first-base line, 18–24 m back, the aisles fall at 5.5, 11.5, 19.8,
// 28.2, 38, 47.5, 57 and 67.2 m from home (127 through 134); the third-base
// side mirrors them within ~1 m (46.2, 55, 66 m at 18 m back), so 118 and
// 114 mirror 130 and 134.
export const REDS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['124'], bearingDeg: 300, distanceM: 28 },
  { ids: ['130'], bearingDeg: 209.5, distanceM: 32.6 },
  { ids: ['134'], bearingDeg: 186.5, distanceM: 65.8 },
  { ids: ['118'], bearingDeg: 34.5, distanceM: 32.6 },
  { ids: ['114'], bearingDeg: 57.5, distanceM: 65.8 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 12–36 m back run 165.3–166.6° (mean 166.1°),
//   so it faces 256°. Third-base side: 76.5–78° (mean 77.3°), so it faces 347°.
// - Behind home the rows are arcs centred on home plate (within 0.2 m at
//   32–36 m out, 58 of 81 rays), so each section there faces its bearing
//   from home.
// - Outfield: the left-field stands' rows run 173.9–175.7° (facing 85°), the
//   right-field Sun/Moon Deck's 69.6–69.9° (facing 160°).
const RINGS = ['1', '2', '3', '4', '5'];
const FIRST = 256;
const THIRD = 347;
// The curve behind home in 6° steps, each facing its middle bearing.
const CURVE = Array.from({ length: 16 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, THIRD);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
}).filter((run) => run.fromBearingDeg < THIRD);
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const redsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(redsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: REDS_AERIAL_CONTROL,
    standRuns: [
      // Turned where two lidar measurements agree on the way the rows climb
      // (scripts/measureStandHeights.py treads): planes fitted to the treads
      // (five readings within 15°) and the fall line in the middle (within 8°
      // of them), both more than 10° off the direction fitted on the map; each
      // faces their mean.
      { ids: ['110'], facingDeg: 11 },
      { ids: ['112'], facingDeg: 14 },
      { ids: ['133'], facingDeg: 240 },
      { ids: ['136'], facingDeg: 232 },
      { ids: ['137'], facingDeg: 239 },
      { ids: ['436'], facingDeg: 239 },
      { ids: ['537'], facingDeg: 240 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side. On the third-base side
      // (108, 109, 114, 115, 411–415, 510) that is the photo's run (347°,
      // below): there the scan's rows, and the 400s' walls, run about 100°,
      // facing 7–14°; the photo's level lines, 12–36 m back, are the lower
      // bowl's nearer the line.
      { ids: ['111'], facingDeg: 7 },
      { ids: ['109', '108', '415'], facingDeg: 7 },
      { ids: ['115', '510', '114'], facingDeg: 12 },
      { ids: ['412', '411', '414'], facingDeg: 14 },
      { ids: ['413'], facingDeg: 13 },
      { ids: ['437'], facingDeg: 234 },
      { ids: ids(101, 106), facingDeg: 85 },
      { ids: ids(140, 146), facingDeg: 160 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: THIRD, toBearingDeg: 75, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 168, toBearingDeg: FIRST - 0.01, facingDeg: FIRST },
    ],
    // Rings: the Diamond Seats (1–5, 22–25) with the 100s, then the 200s to
    // the 500s.
    tierOf: (id, level) => (/^\d{1,2}$/.test(id) ? '1' : /^\d{3}$/.test(id) ? id[0] : level),
    classify: classifyRedsSection,
  }),
);

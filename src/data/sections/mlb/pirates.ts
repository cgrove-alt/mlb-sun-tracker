import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { piratesChartPoints } from './chart-points/pirates';
import { classifyPiratesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('pirates');

// Pinned on USGS NAIP m_4008040_ne_17_060_20220509 (2022-05-09), a
// 260 m-wide north-up image centred on 40.44704, -80.00609 at 0.25 m/px with
// home plate at pixel (488.5, 510). The field level (1–32, rows A–M) runs
// from the right-field corner to the left-field corner; behind home its
// aisles 20–24 m out are ~14° apart with one ~2.5° from the axis, between 16
// and 17. Along each line, 18 m back, its aisles are ~7.5 m apart: 7 and 11
// on the first-base side (44–51.5 m and 14–21.5 m from home), 22 and 25 on
// the third-base side (20–30 m and 45–53 m). The fit lands all five within
// 2.7 m, which also confirms the numbering.
export const PIRATES_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['16', '17'], bearingDeg: 298.5, distanceM: 21 },
  { ids: ['11'], bearingDeg: 207.7, distanceM: 25.3 },
  { ids: ['7'], bearingDeg: 183, distanceM: 51 },
  { ids: ['22'], bearingDeg: 33.6, distanceM: 30.9 },
  { ids: ['25'], bearingDeg: 49, distanceM: 52.2 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 12–36 m back run 160.5–164.6° (mean 163°),
//   so it faces 253°. Third-base side: 67.9–69.1° (mean 68.4°), so 338°.
// - Behind home the rows are arcs centred on home plate (within 1.5 m at
//   32–36 m out), so each section there faces its bearing from home.
// - Outfield: the right-field seats along the river run 77–84° (facing
//   170°); the left-field bleachers and rooftop 166–171° (facing 78°).
const RINGS = ['field', '1', '2', '3'];
const FIRST = 253;
const THIRD = 338;
const CURVE = Array.from({ length: 15 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, THIRD);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
}).filter((run) => run.fromBearingDeg < THIRD);
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const piratesSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(piratesChartPoints, {
    orientation: ORIENTATION,
    aerialControl: PIRATES_AERIAL_CONTROL,
    standRuns: [
      // Turned where two lidar measurements agree on the way the rows climb
      // (scripts/measureStandHeights.py treads): planes fitted to the treads
      // (five readings within 15°) and the fall line in the middle (within 8°
      // of them), both more than 10° off the direction fitted on the map; each
      // faces their mean.
      { ids: ['136'], facingDeg: 75 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['135'], facingDeg: 30 },
      { ids: ['138'], facingDeg: 74 },
      { ids: ['203'], facingDeg: 228 },
      { ids: ['30'], facingDeg: 1 },
      { ids: ['301'], facingDeg: 225 },
      { ids: ['32'], facingDeg: 354 },
      { ids: ['132', '131'], facingDeg: 28 },
      { ids: ['137'], facingDeg: 79 },
      { ids: ['139'], facingDeg: 122 },
      { ids: ['201'], facingDeg: 228 },
      { ids: ['4', '101', '103'], facingDeg: 233 },
      { ids: ids(139, 147), facingDeg: 170 },
      { ids: [...ids(235, 238), ...ids(335, 339), 'PORCH'], facingDeg: 78 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: THIRD, toBearingDeg: 72, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 160, toBearingDeg: FIRST - 0.01, facingDeg: FIRST },
    ],
    // Rings: the field level (1–32), then the 100s to the 300s.
    tierOf: (id, level) => (/^\d{1,2}$/.test(id) ? 'field' : /^\d{3}$/.test(id) ? id[0] : level),
    classify: classifyPiratesSection,
  }),
);

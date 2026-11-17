import type { DetailedSection } from '../../../types/stadium-complete';
import { twinsChartPoints } from './chart-points/twins';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { classifyTwinsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('twins');

// Pinned on USGS NAIP m_4409306_ne_15_060_20210618 (2021-06-18), a
// 260 m-wide north-up image centred on 44.98171, -93.27792 at 0.25 m/px with
// home plate at pixel (400, 512). Resampled square to each foul line, the
// boxes in front (1–17, ~14–24 m back) have an aisle every ~9.5 m from home,
// and the three behind each dugout (4–6, 11–13) are the ones whose rows
// start at 5 (Rate Your Seats); behind home their aisles fall at 229.5°,
// 251.5°, 270° (the axis, between 8 and 9), 288.5° and 310°. The 100s
// behind them (~28 m back) have aisles at 229°, 243.5°, 254.3°, 265.5°,
// 273.5°, 284.5°, 296° and 310°, so 114 is the narrow section on the axis.
// Each control is a section's middle. The left-field bleachers (128–131,
// along the wall from the pole to the bullpens) and the right-field seats
// along the wall (132–136) are pinned as whole stands.
export const TWINS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['6'], bearingDeg: 215.6, distanceM: 18.8 },
  { ids: ['2'], bearingDeg: 160, distanceM: 45.4 },
  { ids: ['12'], bearingDeg: 347.9, distanceM: 21.8 },
  { ids: ['16'], bearingDeg: 25.4, distanceM: 52.6 },
  { ids: ['8'], bearingDeg: 260.75, distanceM: 21 },
  { ids: ['9'], bearingDeg: 279.25, distanceM: 21 },
  { ids: ['114'], bearingDeg: 269.5, distanceM: 37 },
  { ids: ['108'], bearingDeg: 189.8, distanceM: 45.9 },
  { ids: ['120'], bearingDeg: 350.8, distanceM: 45.1 },
  { ids: ['128', '129', '130', '131'], bearingDeg: 60, distanceM: 107.3 },
  { ids: ['132', '133', '134', '135', '136'], bearingDeg: 108.6, distanceM: 113.9 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 17–35 m back run 133.2–137.6° (mean
//   135.4°), so it faces 226°. Third-base side: 43.4–49.8° (mean 46°), so
//   316°.
// - Behind home the rows are arcs centred ~3 m behind the plate (61 of 77
//   rays); the canopy's front edge, ~59 m out, is an arc on home too. Each
//   section there faces its bearing.
// - Corners: in the right-field corner the aisles run 202.7–207° (facing
//   205°), in the left-field corner 156–162° (facing 340°). The canopy's
//   edge turns the same way: facing 200–219° beyond the first-base side's
//   straight, 316–322° at its third-base end. The 100s' straights reach
//   ~61 m (first base) and ~64 m (third) along each line, the boxes' to
//   their last section (1, 17), the upper rings' to ~198° and ~0° from home.
// - Outfield: the left-field stands run along their wall at ~142° (facing
//   52°); the right-field seats along theirs at ~40° (facing 130°).
const LOWER = ['box', '1'];
const UPPER = ['club', '2', '3'];
const FIRST = 226;
const THIRD = 316;
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
// The curve in 6° steps of bearing from home, each facing its middle bearing.
const CURVE = Array.from({ length: 14 }, (_, i) => {
  const from = 229.5 + i * 6;
  const to = Math.min(from + 6, 309.5);
  return { rings: [...LOWER, ...UPPER], fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
}).filter((run) => run.fromBearingDeg < 309.5);

export const twinsSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(twinsChartPoints, {
  orientation: ORIENTATION,
  aerialControl: TWINS_AERIAL_CONTROL,
  standRuns: [
    // Turned to the rows' fall line, measured on the lidar
    // (scripts/measureStandHeights.py): these sections' rows climb firmly
    // more than 15° off the direction fitted on the map, in the middle
    // of the section and 4 m to either side.
    { ids: ['124'], facingDeg: 320 },
    { ids: ['206'], facingDeg: 225 },
    { ids: ['225'], facingDeg: 323 },
    { ids: [...ids(128, 131), ...ids(229, 234), ...ids(329, 334), 'SBPDEK', '328SRO'], facingDeg: 52 },
    { ids: [...ids(132, 140), ...ids(237, 240), 'DOCK'], facingDeg: 130 },
    ...CURVE,
    { rings: ['box'], fromBearingDeg: 150, toBearingDeg: 229.49, facingDeg: FIRST },
    { rings: ['box'], fromBearingDeg: 309.5, toBearingDeg: 30, facingDeg: THIRD },
    { rings: ['1'], fromBearingDeg: 164.4, toBearingDeg: 229.49, facingDeg: FIRST },
    { rings: ['1'], fromBearingDeg: 120, toBearingDeg: 164.39, facingDeg: 205 },
    { rings: ['1'], fromBearingDeg: 309.5, toBearingDeg: 18.69, facingDeg: THIRD },
    { rings: ['1'], fromBearingDeg: 18.7, toBearingDeg: 60, facingDeg: 340 },
    { rings: UPPER, fromBearingDeg: 198, toBearingDeg: 229.49, facingDeg: FIRST },
    { rings: UPPER, fromBearingDeg: 120, toBearingDeg: 197.99, facingDeg: 205 },
    { rings: UPPER, fromBearingDeg: 309.5, toBearingDeg: 359.99, facingDeg: THIRD },
    { rings: UPPER, fromBearingDeg: 0, toBearingDeg: 40, facingDeg: 340 },
  ],
  // Rings: the boxes (1–17), the 100s, the Delta club (A–V) and the 200s and
  // 300s; suites and standing areas with their level.
  tierOf: (id, level) => (/^\d{1,2}$/.test(id) ? 'box' : /^\d{3}$/.test(id) ? id[0] : /^[A-V]$/.test(id) ? 'club' : level),
  classify: classifyTwinsSection,
}));

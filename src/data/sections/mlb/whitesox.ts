// Rate Field — Chicago White Sox
import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { whitesoxChartPoints } from './chart-points/whitesox';
import { classifyWhitesoxSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('whitesox');

// Pinned on USGS NAIP m_4108711_ne_16_060_20190802 (2019-08-02), a
// 260 m-wide north-up image centred on 41.83, -87.63397 at 0.25 m/px with
// home plate at pixel (431, 434). The first-base side is in the stands'
// shadow; it is read on a brightened copy. Resampled square to each foul
// line, both sides have an aisle every ~5.6 m, one per section. Rate Your
// Seats' rows start at 5 in the six sections behind each dugout (122–127,
// 137–142), and on the photo each dugout spans the first six (from 0.75 m
// out on the first-base side, 3.25 m on the third), so 127 and 137 are the
// first sections past the curve. Behind home the aisles radiate from the
// plate at 313.5°, 324.5°, 336° and 348°: four sections each side of 132,
// which sits on the axis. Each control is a section's middle (~27 m back,
// ~28.5 m behind a dugout); the right-field stand (100–105) and the left-
// field stand (157–164) are pinned as whole stands.
export const WHITESOX_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['139'], bearingDeg: 25.6, distanceM: 33.4 },
  { ids: ['145'], bearingDeg: 56.2, distanceM: 57.9 },
  { ids: ['151'], bearingDeg: 66.4, distanceM: 89.2 },
  { ids: ['124'], bearingDeg: 227.7, distanceM: 35.3 },
  { ids: ['119'], bearingDeg: 202.9, distanceM: 55.9 },
  { ids: ['100', '101', '102', '103', '104', '105'], bearingDeg: 148, distanceM: 127 },
  { ids: ['157', '158', '159', '160', '161', '162', '163', '164'], bearingDeg: 103, distanceM: 117 },
  { ids: ['135'], bearingDeg: 342, distanceM: 30 },
  { ids: ['133'], bearingDeg: 319, distanceM: 36 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 16–34 m back run 169.2–176.1° (mean
//   172.8°), so it faces 263°. Third-base side: 82.2–87° (mean 84.7°), so
//   355°.
// - Behind home the aisles keep their bearings from 20 to 38 m out, so the
//   rows are arcs on home plate: each section faces its bearing.
// - Corners: in the left-field corner the aisles run ~36° (155) and ~68°
//   (156); the right-field corner, in shadow, mirrors them (texture 46°
//   and 7°: 226° for 109, 187° for 108). The upper rings' corner sections
//   (311–312, 506–510, 354–357, 555–558) are given the same turn; the roof
//   hides their rows.
// - Outfield: the right-field stand's rows run 69.9–74.9° (facing 164°); the
//   left-field stand's 174.5–181.5° with aisles at 87.1–92.3° (facing 89°).
const RINGS = ['1', '3', '5'];
const FIRST = 263;
const THIRD = 355;
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
// The curve in 6° steps of bearing from home, each facing its middle bearing.
const CURVE = Array.from({ length: 17 }, (_, i) => {
  const from = 262.5 + i * 6;
  const to = Math.min(from + 6, 361);
  return { rings: RINGS, fromBearingDeg: from % 360, toBearingDeg: (to - 0.01) % 360, facingDeg: ((from + to) / 2) % 360 };
});

/** Selectable polygons from the club's seat map. */
export const whitesoxSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(whitesoxChartPoints, {
    orientation: ORIENTATION,
    aerialControl: WHITESOX_AERIAL_CONTROL,
    standRuns: [
      // Turned where two lidar measurements agree on the way the rows climb
      // (scripts/measureStandHeights.py treads): planes fitted to the treads
      // (five readings within 15°) and the fall line in the middle (within 8°
      // of them), both more than 10° off the direction they had (fitted on
      // the map or on a photo); each faces their mean.
      { ids: ['100'], facingDeg: 146 },
      { ids: ['101'], facingDeg: 151 },
      { ids: ['117'], facingDeg: 252 },
      { ids: ['163'], facingDeg: 105 },
      { ids: ['164'], facingDeg: 108 },
      { ids: ['314'], facingDeg: 247 },
      { ids: ['514'], facingDeg: 248 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['311'], facingDeg: 248 },
      { ids: ['354'], facingDeg: 11 },
      { ids: ['507'], facingDeg: 209 },
      { ids: ['508', '509'], facingDeg: 246 },
      { ids: ['555'], facingDeg: 7 },
      { ids: ids(100, 105), facingDeg: 164 },
      { ids: ids(157, 164), facingDeg: 89 },
      { ids: ['108', '506', '507'], facingDeg: 187 },
      { ids: ['109', '311', '312', '508', '509', '510'], facingDeg: 226 },
      { ids: ['155', '354', '555', '556'], facingDeg: 36 },
      { ids: ['156', '356', '357', '557', '558'], facingDeg: 68 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: 1, toBearingDeg: 90, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 165, toBearingDeg: 262.49, facingDeg: FIRST },
    ],
    // Rings: the lower box and outfield (100s), the club (300s) and the
    // upper deck (500s); the named areas with their level.
    tierOf: (id, level) => (/^\d{3}A?$/.test(id) ? id[0] : level),
    classify: classifyWhitesoxSection,
  }),
);

export const whitesoxSectionMap = new Map(whitesoxSections.map((s) => [s.id, s]));

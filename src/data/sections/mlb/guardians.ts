import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { guardiansChartPoints } from './chart-points/guardians';
import { classifyGuardiansSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('guardians');

// Pinned on USGS NAIP m_4108135_ne_17_030_20230526 (2023-05-26), a
// 260 m-wide north-up image centred on 41.49581, -81.68528 at 0.25 m/px with
// home plate at pixel (520, 638.5). Resampled along each side's rows (which
// run ~6° inside the foul lines), both bowls have an aisle every 6.5 m from
// 2.75 m out, one per section: 148 down to 125 on the first-base side, 159
// down to 175 on the third-base side (Rate Your Seats' rows start at F behind
// the dugouts, at A from 138 and 165, where the dugouts end). Behind home the
// aisles radiate from the plate every ~11.2°, one on the axis between 153 and
// 154 (whose rows Rate Your Seats gives symmetrically). Each control is a
// section's middle (~26–30 m back from its rows' line); the right-field stand
// (107–113, beyond the wall) and the left-field stand (180–185) are pinned as
// whole stands. The club's drawing is a 3-D view, so the fit is projective.
export const GUARDIANS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['144'], bearingDeg: 97.5, distanceM: 35.9 },
  { ids: ['134'], bearingDeg: 66.6, distanceM: 57.9 },
  { ids: ['129'], bearingDeg: 59.5, distanceM: 75.6 },
  { ids: ['162'], bearingDeg: 261.8, distanceM: 35.7 },
  { ids: ['169'], bearingDeg: 295.85, distanceM: 63.3 },
  { ids: ['172'], bearingDeg: 300.4, distanceM: 75.2 },
  { ids: ['107', '108', '109', '111', '113'], bearingDeg: 35, distanceM: 116.8 },
  { ids: ['180', '181', '182', '183', '184', '185'], bearingDeg: 340, distanceM: 114.9 },
  { ids: ['153', '154'], bearingDeg: 179.5, distanceM: 37 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: rows 14–24 m out run 36–42.3° (mean 39.4°), ~6° inside
//   the line as the foul ground narrows, so it faces 129°. Third-base side:
//   316.2–324.5° (mean 320.8°), so it faces 231°.
// - Behind home the aisles keep their bearings from 24 to 42 m out, so the
//   rows are arcs centred on home plate: each section faces its bearing.
// - Corners: the right-field corner's rows run ~46–54° (texture; aisles at
//   135.8°), facing ~140°; the left-field corner mirrors it (aisles at
//   41.2°), facing 221°.
// - Outfield: the right-field stand's rows run along its wall at
//   144.8–147.1°, facing 56° (the 300s and 400s above it too); the left-field
//   stand's 54.5–61.5°, facing 328°.
const RINGS = ['1', '3', '4', '5'];
const FIRST = 129;
const THIRD = 231;
// The curve in 6° steps of bearing from home, each facing its middle bearing.
const CURVE = Array.from({ length: 17 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, THIRD);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
}).filter((run) => run.fromBearingDeg < THIRD);
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const guardiansSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(guardiansChartPoints, {
    orientation: ORIENTATION,
    aerialControl: GUARDIANS_AERIAL_CONTROL,
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['103'], facingDeg: 33 },
      { ids: ['103', '107', '108', '109', '111', '113', ...ids(303, 316)], facingDeg: 56 },
      { ids: ids(180, 185), facingDeg: 328 },
      { ids: ['117'], facingDeg: 140 },
      { ids: ids(176, 179), facingDeg: 221 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: THIRD, toBearingDeg: 305, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 52, toBearingDeg: FIRST - 0.01, facingDeg: FIRST },
      { rings: RINGS, fromBearingDeg: 15, toBearingDeg: 51.99, facingDeg: 56 },
    ],
    // Rings: the 100s to the 500s by hundreds; the center-field boxes
    // (1011–1014), suites and clubs with their level.
    tierOf: (id, level) => (/^\d{3}$/.test(id) ? id[0] : level),
    classify: classifyGuardiansSection,
  }),
);

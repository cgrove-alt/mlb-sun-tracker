import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { tigersChartPoints } from './chart-points/tigers';
import { classifyTigersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('tigers');

// Pinned on USGS NAIP m_4208348_ne_17_060_20220730 (2022-07-30), a
// 260 m-wide north-up image centred on 42.33922, -83.0488 at 0.25 m/px with
// home plate at pixel (463.3, 416.2). Resampled square to each foul line, the
// two baseline bowls mirror each other: aisles 2, 11, 20 and 29 m from home
// behind each dugout (whose front rows give way to it: Rate Your Seats rows
// 7–35 in 120–124 and 131–135), then ~35.5, 45, 55, 68 and 81 m, where the
// corner sections start. Rate Your Seats puts 123 by the first-base dugout
// and 112 at the right-field pole, so 123 and 132 are the first sections
// past the curve. Each control is a section's middle: ~34 m back from the
// line behind the dugouts, ~26–28 m beyond them. The outfield stands are
// pinned as whole stands: the right-field bleachers (101–106) between the
// wall and the plaza, and the left-field pavilion (144–151) behind the
// bullpens. The club's drawing is a 3-D view, so the fit is projective; it
// puts 125–130 on the 11–13.5° wedges between the aisles seen behind home
// (one on the axis, between 127 and 128) without being told.
export const TIGERS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['122'], bearingDeg: 261.5, distanceM: 37.4 },
  { ids: ['133'], bearingDeg: 40, distanceM: 37.2 },
  { ids: ['118'], bearingDeg: 225.3, distanceM: 57.2 },
  { ids: ['138'], bearingDeg: 81.5, distanceM: 67.6 },
  { ids: ['116'], bearingDeg: 215.2, distanceM: 78.9 },
  { ids: ['139'], bearingDeg: 86.7, distanceM: 78.9 },
  { ids: ['101', '102', '103', '104', '105', '106'], bearingDeg: 171.8, distanceM: 125.2 },
  { ids: ['144', '145', '146', '147', '148', '149', '150', '151'], bearingDeg: 118.1, distanceM: 123.8 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 16–40 m back run 193.4–198° (mean 196.3°),
//   so it faces 286°. Third-base side: 105.2–108.6° (mean 106.8°), so 17°.
// - Behind home the rows are arcs centred ~4 m behind the plate (the
//   walkway's arc, 52 of 81 rays, radius 44 m), so each section on the
//   curve faces away from that centre.
// - Corners: past ~81 m from home the aisles turn to ~238° in the
//   right-field corner (row texture 235–242°); the left-field corner's one
//   sunlit aisle runs ~63° (texture 68–70°), so it faces 65°.
// - Right-field bleachers: rows along the stand's front at 105–108.9°,
//   facing 197°. Left-field pavilion: rows along the bullpens' wall at
//   191–192.4°, facing 102°.
const RINGS = ['1', 'TD', 'T', '2', '3'];
const FIRST = 286;
const THIRD = 17;
const CENTRE_BEHIND_HOME_M = 4;
/** Direction a section on the curve faces: away from the arc's centre. */
const curveFacing = (bearingFromHomeDeg: number, distanceM = 40) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const east = distanceM * Math.sin(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.sin(r(ORIENTATION + 180));
  const north = distanceM * Math.cos(r(bearingFromHomeDeg)) - CENTRE_BEHIND_HOME_M * Math.cos(r(ORIENTATION + 180));
  return Math.round((((Math.atan2(east, north) * 180) / Math.PI) + 360) % 360);
};
// The curve in 6° steps of bearing from home, from where it faces the
// first-base direction round to the third-base one.
const CURVE = Array.from({ length: 16 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, THIRD + 360);
  return { rings: RINGS, fromBearingDeg: from % 360, toBearingDeg: (to - 0.01) % 360, facingDeg: curveFacing((from + to) / 2) };
});
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const tigersSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(tigersChartPoints, {
    orientation: ORIENTATION,
    aerialControl: TIGERS_AERIAL_CONTROL,
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['146'], facingDeg: 64 },
      { ids: ['345'], facingDeg: 66 },
      { ids: ['116'], facingDeg: 250 },
      { ids: ['140'], facingDeg: 35 },
      { ids: ['141'], facingDeg: 26 },
      { ids: ['144'], facingDeg: 62 },
      { ids: ['145'], facingDeg: 67 },
      { ids: ['215'], facingDeg: 266 },
      { ids: [...ids(107, 115), 'T112', 'T113', 'T114'], facingDeg: 238 },
      { ids: [...ids(140, 143), '140A', '140B', '141A'], facingDeg: 65 },
      { ids: [...ids(101, 106), 'RFBAL1', 'RFBAL2', 'RFBAL3', 'RFBAL4', 'BALC2', 'SRO', 'SRO2', 'SRO3', 'VIZZY'], facingDeg: 197 },
      { ids: ids(144, 151), facingDeg: 102 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: THIRD, toBearingDeg: 91.99, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 92, toBearingDeg: 120, facingDeg: 65 },
      { rings: RINGS, fromBearingDeg: 185, toBearingDeg: 209.99, facingDeg: 238 },
      { rings: RINGS, fromBearingDeg: 210, toBearingDeg: FIRST - 0.01, facingDeg: FIRST },
    ],
    // Rings: the lower bowl (with the boxes and lounges in front of and
    // behind it), the Tiger Den, the terraces, the mezzanine and the upper
    // deck.
    tierOf: (id, level) => {
      if (/^TD/.test(id)) return 'TD';
      if (/^T\d|^\d{3}[A-C]$/.test(id)) return 'T';
      if (/^\d{3}$/.test(id)) return id[0];
      if (/^(P|L|HPC)\d|^HPCADA$/.test(id)) return '1';
      return level;
    },
    classify: classifyTigersSection,
  }),
);

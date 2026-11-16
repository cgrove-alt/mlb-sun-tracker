import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { marlinsChartPoints } from './chart-points/marlins';
import { classifyMarlinsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('marlins');

// Pinned on USGS NAIP m_2508015_sw_17_1_20131018 (2013-10-18, roof fully
// open; Planetary Computer NAIP archive), a 260 m-wide north-up image
// centred on 25.77821, -80.21969 at 0.25 m/px with home plate at pixel
// (462.8, 463.4). With the roof open its panels stack over the first-base
// side, so that side and right field are hidden on every flight; the
// third-base side and the stands behind home are lit. Behind home an aisle
// runs on the axis (309°), between 14 and 15, the two sections the club map
// puts behind home, and the next stand 12.5–13° apart (321.75°, 334.75°,
// 346.75°, 359°), so 15–18 sit between them, ~30 m out. Down the third-base
// line the aisles stand 10.5, 22.75, 34.75, 46.5 and 57.75 m from home;
// Rate Your Seats' netting runs 8–21, dugout to dugout, and the third-base
// dugout (5–27 m) ends inside 21, so 20–23 sit between them, each control a
// section's middle 33 m back from the line. The bowl is mirror-symmetric
// about the axis where it can be seen (the aisles behind home, the netting,
// the dugouts), so 6–9 and 11–14 are pinned at the mirror image of 15–18
// and 20–23. The fit then puts the right-field stands (34–40) behind the
// right-field wall and the left-field ones (28–32) by the left-field pole.
export const MARLINS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['SEC15'], bearingDeg: 315.4, distanceM: 30 },
  { ids: ['SEC16'], bearingDeg: 328.25, distanceM: 30 },
  { ids: ['SEC17'], bearingDeg: 340.75, distanceM: 30 },
  { ids: ['SEC18'], bearingDeg: 352.9, distanceM: 30 },
  { ids: ['SEC20'], bearingDeg: 20.7, distanceM: 36.94 },
  { ids: ['SEC21'], bearingDeg: 35.2, distanceM: 43.86 },
  { ids: ['SEC22'], bearingDeg: 44.9, distanceM: 52.32 },
  { ids: ['SEC23'], bearingDeg: 51.6, distanceM: 61.66 },
  { ids: ['SEC14'], bearingDeg: 302.6, distanceM: 30 },
  { ids: ['SEC13'], bearingDeg: 289.75, distanceM: 30 },
  { ids: ['SEC12'], bearingDeg: 277.25, distanceM: 30 },
  { ids: ['SEC11'], bearingDeg: 265.1, distanceM: 30 },
  { ids: ['SEC9'], bearingDeg: 237.3, distanceM: 36.94 },
  { ids: ['SEC8'], bearingDeg: 222.8, distanceM: 43.86 },
  { ids: ['SEC7'], bearingDeg: 213.1, distanceM: 52.32 },
  { ids: ['SEC6'], bearingDeg: 206.4, distanceM: 61.66 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - Third-base side: the cross aisle between the boxes and the bowl runs
//   87.1°, so it faces 357° (four aisles fitted as lines, 352.6–3°, agree);
//   the first-base side is its mirror image, 261°.
// - Behind home the aisles stand evenly on bearings from home, so each
//   section between 258° and 1° faces its own bearing.
// - Left field: the stands sit behind a wall running 178.8–180.1° (2022
//   flight), so they face 90°. Right field and center field are in the
//   parked roof's shadow on every flight; there each section faces its
//   bearing from home.
const RINGS = ['1', '2', '3'];
const THIRD = 357;
const FIRST = 261;
const sec = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `SEC${from + i}`);
const CURVE = Array.from({ length: 17 }, (_, i) => ({
  rings: RINGS,
  fromBearingDeg: 258 + i * 6,
  toBearingDeg: 258 + i * 6 + 5.99,
  facingDeg: (261 + i * 6) % 360,
}));
const OUTFIELD = Array.from({ length: 15 }, (_, i) => ({
  rings: RINGS,
  fromBearingDeg: 90 + i * 6,
  toBearingDeg: 90 + i * 6 + 5.99,
  facingDeg: 93 + i * 6,
}));

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const marlinsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(marlinsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: MARLINS_AERIAL_CONTROL,
    standRuns: [
      { ids: sec(28, 32), facingDeg: 90 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: 0, toBearingDeg: 89.99, facingDeg: THIRD },
      ...OUTFIELD,
      { rings: RINGS, fromBearingDeg: 180, toBearingDeg: 257.99, facingDeg: FIRST },
    ],
    // Rings: field level (with its boxes), the 200 level and the 300 level.
    tierOf: (id, level) => {
      const n = id.match(/^SEC(\d)\d\d$/);
      if (n) return n[1];
      if (/^(SEC\d{1,2}|FL\d+)$/.test(id)) return '1';
      if (/^FS/.test(id)) return '2';
      return level;
    },
    classify: classifyMarlinsSection,
  }),
);

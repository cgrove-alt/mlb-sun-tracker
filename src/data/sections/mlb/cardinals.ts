import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { cardinalsChartPoints } from './chart-points/cardinals';
import { classifyCardinalsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('cardinals');

// Pinned on USGS NAIP m_3809023_sw_15_060_20220618 (2022-06-18), a
// 260 m-wide north-up image centred on 38.62249, -90.19321 at 0.25 m/px with
// home plate at pixel (456.09, 554.31). Sections are counted between the
// aisles on the photo: on an arc 35 m from home the aisles are ~13° apart
// and the axis falls in the middle of 151; along lines 35 m back from each
// foul line they are ~7.5 m apart (147–142 on the first-base side, 155–165
// on the third-base side).
export const CARDINALS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['5', '6'], bearingDeg: 242, distanceM: 20 }, // Cardinals Club boxes, 15–25 m out on the axis
  { ids: ['151'], bearingDeg: 242.8, distanceM: 35 }, // the 100s behind home, 25–45 m out
  { ids: ['149'], bearingDeg: 215.3, distanceM: 35 },
  { ids: ['153'], bearingDeg: 269.8, distanceM: 35 },
  { ids: ['146'], bearingDeg: 177.7, distanceM: 37.1 },
  { ids: ['144'], bearingDeg: 159.4, distanceM: 44.2 },
  { ids: ['142'], bearingDeg: 146.8, distanceM: 54.7 },
  { ids: ['158'], bearingDeg: 325.4, distanceM: 44.7 },
  { ids: ['162'], bearingDeg: 346.1, distanceM: 68.2 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: level lines 4–38 m back run 104.3–108.3° (mean 106.2°),
//   parallel to the line (107°), so it faces 197°. Third-base side: 15.8–19°
//   (mean 17.2°), parallel to the line (17°), so it faces 287°.
// - Behind home the rings are arcs centred on home plate (within 1 m at
//   24–27 m), so each section faces its own bearing from home; the arcs meet
//   the straights where that bearing reaches 197° and 287°.
// - The right-field corner, in the stands' shadow on the photo (read with
//   the contrast raised), ends in a back edge running 45°/225°, so it faces
//   ~135°: 127–133 and the corner sections stacked above them.
// - Past the left-field pole a short stand runs along the wall (~101.6°),
//   facing ~10°. The left-center bleachers sit behind a wall running ~134°
//   (facing 44°); the right-center wall runs ~182° (facing 92°) and turns
//   toward center field, where 101 and 103 sit.
const RINGS = ['club', 'boxes', '1', '2', '3', '4'];
const FIRST = 197;
const THIRD = 287;
// The curve behind home in 6° steps, each facing its middle bearing.
const CURVE = Array.from({ length: 15 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, THIRD);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
});

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const cardinalsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(cardinalsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: CARDINALS_AERIAL_CONTROL,
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side. 128–131 are in the corner
      // whose back edge the photo read in shadow (135° below); 163–168 and
      // 265–269 are past the level lines the photo measured on the
      // third-base side (287° below): on the scan their rows run about 15°
      // and 50°.
      { ids: ['135', '136'], facingDeg: 147 },
      { ids: ['136D'], facingDeg: 162 },
      { ids: ['137D'], facingDeg: 157 },
      { ids: ['162'], facingDeg: 317 },
      { ids: ['163D'], facingDeg: 307 },
      { ids: ['165'], facingDeg: 315 },
      { ids: ['229'], facingDeg: 114 },
      { ids: ['230'], facingDeg: 109 },
      { ids: ['231'], facingDeg: 101 },
      { ids: ['271'], facingDeg: 316 },
      { ids: ['128'], facingDeg: 110 },
      { ids: ['129'], facingDeg: 105 },
      { ids: ['130'], facingDeg: 106 },
      { ids: ['131'], facingDeg: 109 },
      { ids: ['134'], facingDeg: 147 },
      { ids: ['163', '166D', '167', '168', '268'], facingDeg: 317 },
      { ids: ['164D'], facingDeg: 316 },
      { ids: ['165D'], facingDeg: 315 },
      { ids: ['166'], facingDeg: 321 },
      { ids: ['265', '267', '269'], facingDeg: 320 },
      { ids: ['337'], facingDeg: 181 },
      // The Cardinals Club boxes follow the backstop arc out to the dugouts.
      { ids: ['1'], facingDeg: 158 },
      { ids: ['2'], facingDeg: 174 },
      { ids: ['8'], facingDeg: 306 },
      { ids: ['127', '128', '129', '130', '131', '132', '133', '228', '229', '230', '231', '232', '233', '331', '332', '333', '431', '432', '433'], facingDeg: 135 },
      { ids: ['171', '172', '272'], facingDeg: 10 },
      { ids: ['189', '191', '193', '195', '197'], facingDeg: 44 },
      { ids: ['101', '103'], facingDeg: 75 },
      { ids: ['105', '107', '109', '111'], facingDeg: 92 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: THIRD, toBearingDeg: 30, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 85, toBearingDeg: FIRST - 0.01, facingDeg: FIRST },
    ],
    // Rows that bend across the section, measured on the lidar
    // (scripts/measureStandHeights.py faces): each third faces the rows'
    // fall line read in it, where planes fitted to the treads confirm it.
    standFaces: [
      { id: '132', facesDeg: [116, 116, 145] },
    ],
    // Rings: the Cardinals Club boxes (1–8), the lettered field boxes in
    // front of the 100s (D), the 100s and the outfield bleachers, then the
    // 200s, 300s and 400s. Party-suite patios (O), boxes (B) and the clubs
    // sit with the ring of their number or on their own.
    tierOf: (id) => {
      if (/^[1-8]$/.test(id)) return 'club';
      if (/^\d+D$/.test(id)) return 'boxes';
      const n = Number(id.replace(/[A-Z]+$/, ''));
      if (Number.isNaN(n) || n >= 700) return id;
      if (n <= 111 || (n >= 189 && n <= 197)) return 'bleachers';
      return String(Math.floor(n / 100));
    },
    classify: classifyCardinalsSection,
  }),
);

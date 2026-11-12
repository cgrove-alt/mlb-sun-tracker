import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { astrosChartPoints } from './chart-points/astros';
import { classifyAstrosSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('astros');

// Pinned on USGS NAIP flights with the roof open (Planetary Computer NAIP
// archive), north-up 260 m-wide images centred on 29.75687, -95.35545 at
// 0.25 m/px with home plate at pixel (556.5, 609.9). The stands are in deep
// shadow on the 2020 and 2024 flights, so the aisles are read where the sun
// lit them: the third-base stands on the 2012-06-23 flight, the first-base
// stands on the 2014-10-16 one (both 1 m; their infields sit within ~1.5 m
// of the 2020 one). Square to each foul line the aisles stand ~10 m apart:
// 16.5, 26.25, 35.75, 45.75 and 57 m from home on the third-base side, 8,
// 18, 27.75, 37.25, 48.25, 59.75, 70 and 81 m on the first-base side, each
// leaning a little toward home further back. Rate Your Seats' netting runs
// 112–126, dugout to dugout, and each dugout ends inside the last section
// it fronts (the third-base dugout runs 8–37 m from home, the first-base one
// 3–32 m), so the sections between the aisles are 116, 114, 113, 112, 111
// and 124, 125, 126, 127, 128, 129, 131. Each control is a section's middle,
// 28 m back from its line. The fit puts the Crawford Boxes (100–104) behind
// the left-field wall and 150–156 behind the right-field wall without being
// told.
export const ASTROS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['114'], bearingDeg: 248, distanceM: 35.55 },
  { ids: ['113'], bearingDeg: 258.4, distanceM: 42.15 },
  { ids: ['112'], bearingDeg: 265.9, distanceM: 49.98 },
  { ids: ['111'], bearingDeg: 271.7, distanceM: 59.06 },
  { ids: ['124'], bearingDeg: 93, distanceM: 31.44 },
  { ids: ['125'], bearingDeg: 79.3, distanceM: 36.94 },
  { ids: ['126'], bearingDeg: 69.7, distanceM: 43.86 },
  { ids: ['128'], bearingDeg: 56.9, distanceM: 61.95 },
  { ids: ['131'], bearingDeg: 49.7, distanceM: 82.88 },
];

// Stand directions (the way a stand's back faces), measured on the same
// flights:
// - Third-base side: five aisles fitted as lines run 212.8–214.8° (mean
//   213.5°), so it faces 214°; first-base side six run 110.8–114.7° (mean
//   112.7°), so 113°. Both lean toward home from square to the line.
// - Behind home the rows are in shadow on every flight; there the direction
//   turns evenly from the first-base straight's (at 101° from home, where
//   124 starts) to the third-base straight's (at 224°, where 116 starts).
// - Outfield: the Crawford Boxes sit behind a straight left-field wall at
//   21.6° (fitted 20.5° and 22.7° on the 2020 and 2024 flights), so they face
//   292°; the right-field stands behind one at 311° (312.3° and 309.6°), so
//   they face 41°.
const RINGS = ['1', '2', '3', '4'];
const FIRST = 113;
const THIRD = 214;
const CURVE_FROM = 101;
const CURVE_TO = 224;
const CURVE_STEPS = 21;
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
const CURVE = Array.from({ length: CURVE_STEPS }, (_, i) => {
  const step = (CURVE_TO - CURVE_FROM) / CURVE_STEPS;
  const from = CURVE_FROM + i * step;
  const middle = from + step / 2;
  return {
    rings: RINGS,
    fromBearingDeg: from,
    toBearingDeg: from + step - 0.01,
    facingDeg: Math.round(FIRST + ((middle - CURVE_FROM) * (THIRD - FIRST)) / (CURVE_TO - CURVE_FROM)),
  };
});

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const astrosSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(astrosChartPoints, {
    orientation: ORIENTATION,
    aerialControl: ASTROS_AERIAL_CONTROL,
    standRuns: [
      { ids: ids(100, 104), facingDeg: 292 },
      { ids: [...ids(150, 156), ...ids(250, 255)], facingDeg: 41 },
      ...CURVE,
      { rings: RINGS, fromBearingDeg: CURVE_TO, toBearingDeg: 344.99, facingDeg: THIRD },
      { rings: RINGS, fromBearingDeg: 345, toBearingDeg: 359.99, facingDeg: FIRST },
      { rings: RINGS, fromBearingDeg: 0, toBearingDeg: CURVE_FROM - 0.01, facingDeg: FIRST },
    ],
    // Rings: the field level (with the dugout boxes and the Diamond Club
    // seats in front of it), the club level, the mezzanine and the upper deck.
    tierOf: (id, level) => {
      if (/^([A-F]|AA|7\d)$/.test(id)) return '1';
      if (/^[1-4]\d\d$/.test(id)) return id[0];
      return level;
    },
    classify: classifyAstrosSection,
  }),
);

import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { athleticsChartPoints } from './chart-points/athletics';
import { classifyAthleticsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('athletics');

// Pinned on USGS NAIP m_3812128_ne_10_060_20220621 (2022-06-21), a
// 260 m-wide north-up image centred on 38.5804, -121.5138 at 0.25 m/px with
// home plate at pixel (431.7, 602.3). The club's drawing is a plan to scale:
// turned to the measured 47°, its sections behind home land on the photo's
// aisle wedges (one every ~13.5° from 163° to 290°, 112 centred on the axis)
// within ~1.5°, and along each line its sections fall within ~2 m of the
// aisles counted on the photo (one every ~9.5 m on the first-base side,
// ~10.5 m on the third). Each control is where a section's printed number
// sits, in its back rows.
export const ATHLETICS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['112'], bearingDeg: 226.5, distanceM: 39.4 },
  { ids: ['109'], bearingDeg: 183.25, distanceM: 40 },
  { ids: ['115'], bearingDeg: 269.75, distanceM: 39.8 },
  { ids: ['104'], bearingDeg: 124.9, distanceM: 50.2 },
  { ids: ['102'], bearingDeg: 108.5, distanceM: 64.7 },
  { ids: ['119'], bearingDeg: 318.1, distanceM: 45.3 },
  { ids: ['122'], bearingDeg: 349.6, distanceM: 62.5 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - Both straights converge on their foul lines going out (the foul ground
//   narrows): first-base rows run 78.6–83.9° (mean 81°), so 101–107 and the
//   club behind them face 171°; third-base rows 7.5–14.8° (mean 10.4°), so
//   117–123 face 280°.
// - Behind home the aisles keep their bearings from 20 to 38 m out, so the
//   rows are arcs on home plate: each section faces its bearing.
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
const CURVE = Array.from({ length: 22 }, (_, i) => {
  const from = 163 + i * 6;
  const to = Math.min(from + 6, 290);
  return { rings: ['1'], fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
}).filter((run) => run.fromBearingDeg < 290);

/** Selectable polygons from the club's official seat map. */
export const athleticsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(athleticsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: ATHLETICS_AERIAL_CONTROL,
    standRuns: [
      { ids: [...ids(101, 107), ...ids(201, 206)], facingDeg: 171 },
      { ids: ids(117, 123), facingDeg: 280 },
      ...CURVE,
    ],
    tierOf: (id, level) => (/^\d{3}$/.test(id) ? id[0] : level),
    classify: classifyAthleticsSection,
  }),
);

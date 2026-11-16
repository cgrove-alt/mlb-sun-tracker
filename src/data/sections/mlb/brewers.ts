import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { brewersChartPoints } from './chart-points/brewers';
import { classifyBrewersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('brewers');

// Pinned on USGS NAIP m_4308757_sw_16_060_20200902 (2020-09-02, roof open;
// Planetary Computer NAIP archive), a 260 m-wide north-up image centred on
// 43.0283, -87.97143 at 0.25 m/px with home plate at pixel (462.3, 467.8).
// The folded roof panels hide the upper levels down both lines; the
// first-base field level and the stands behind home are lit. Down the
// first-base line the aisles stand 6.5, 16.5, 28.75, 38.75 and 50.75 m from
// home; Rate Your Seats' netting runs 112–123, dugout to dugout, and the
// first-base dugout (8–35 m) ends inside 112, so 114–111 sit between them,
// each control a section's middle 28 m back from the line. Behind home the
// aisles stand every ~20° (251.5°, 267.5°, 287.5°, 307.5°, 327°, 347.5° and
// 4°; the same within 1° on the 2018 flight), the first where the
// first-base straight starts, so 115–121 sit between them, ~28 m out.
export const BREWERS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['114'], bearingDeg: 242.7, distanceM: 30.27 },
  { ids: ['113'], bearingDeg: 226.1, distanceM: 35.98 },
  { ids: ['112'], bearingDeg: 214.7, distanceM: 43.85 },
  { ids: ['111'], bearingDeg: 207, distanceM: 52.79 },
  { ids: ['115'], bearingDeg: 259.5, distanceM: 28 },
  { ids: ['116'], bearingDeg: 277.5, distanceM: 28 },
  { ids: ['117'], bearingDeg: 297.5, distanceM: 28 },
  { ids: ['118'], bearingDeg: 317.4, distanceM: 28 },
  { ids: ['119'], bearingDeg: 337.4, distanceM: 28 },
  { ids: ['120'], bearingDeg: 355.9, distanceM: 28 },
  { ids: ['121'], bearingDeg: 14, distanceM: 28 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: four aisles fitted as lines run 257.9–258.9°, so it
//   faces 258°, 7° toward home from square. The third-base side is under
//   the folded panels; its aisles where visible are spaced like the
//   first-base side's, so it takes the mirror direction, 2°.
// - Behind home the aisles stand evenly on bearings from home, so each
//   section between 251.5° and 8.5° faces its own bearing.
// - The outfield stands are in shadow on every flight; there each section
//   faces its bearing from home.
const RINGS = ['1', '2', '3', '4'];
const FIRST = 258;
const THIRD = 2;
const step = (from: number, to: number, n: number) => Array.from({ length: n }, (_, i) => {
  const w = (to - from) / n;
  return { rings: RINGS, fromBearingDeg: (from + i * w) % 360, toBearingDeg: (from + (i + 1) * w - 0.01) % 360, facingDeg: Math.round((from + (i + 0.5) * w) % 360) };
});

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const brewersSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(brewersChartPoints, {
    orientation: ORIENTATION,
    aerialControl: BREWERS_AERIAL_CONTROL,
    standRuns: [
      ...step(251.5, 368.5, 19),
      { rings: RINGS, fromBearingDeg: 8.5, toBearingDeg: 89.99, facingDeg: THIRD },
      ...step(90, 174, 14),
      { rings: RINGS, fromBearingDeg: 174, toBearingDeg: 251.49, facingDeg: FIRST },
    ],
    // Rings: field level, the loge level, the club level and the terrace.
    tierOf: (id, level) => (/^[1-4]\d\d$/.test(id) ? id[0] : level),
    classify: classifyBrewersSection,
  }),
);

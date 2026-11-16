import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { cubsChartPoints } from './chart-points/cubs';
import { classifyCubsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('cubs');

// Pinned on USGS NAIP m_4108703_ne_16_060_20190807 (2019-08-07), a
// 400 m-wide north-up image centred on 41.9484, -87.6553 at 0.4 m/px with
// home plate at pixel (386.1, 639.9). Pixel reads in brackets.
export const CUBS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['501'], bearingDeg: 0.4, distanceM: 114.0 }, // LF bleachers, corner end [388, 355]
  { ids: ['507'], bearingDeg: 28.2, distanceM: 126.1 }, // LF bleachers, by the batter's eye [535, 362]
  { ids: ['511'], bearingDeg: 44.7, distanceM: 128.4 }, // RF bleachers, by the batter's eye [612, 412]
  { ids: ['515'], bearingDeg: 74.4, distanceM: 115.8 }, // RF bleachers, corner end [665, 562]
  { ids: ['A18', 'A19'], bearingDeg: 218.1, distanceM: 22.0 }, // club boxes on the axis behind home [352, 683]
  { ids: ['101'], bearingDeg: 352.7, distanceM: 106.8 }, // 100 level at the LF corner [352, 375]
  { ids: ['134'], bearingDeg: 91.1, distanceM: 104.8 }, // 100 level at the RF corner [648, 645]
];

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const cubsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(cubsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: CUBS_AERIAL_CONTROL,
    // Rings by number: field boxes 1–34 and club boxes A, then the 100s,
    // 200s, 300s and 400s (L/R by side), and the bleachers (500s).
    tierOf: (id) => (/^A\d+$/.test(id) ? 'A' : /^\d{1,2}$/.test(id) ? 'box' : /^\d{3}/.test(id) ? id[0] : id),
    // The club's drawing puts the two foul-side stands 90° apart; on the
    // photo their front edges run at 359° (third base, from pixel 383,400
    // to 381,500) and 74° (first base, from 450,656 to 610,608), 75° apart.
    // Each grandstand ring along those runs faces square to the edge.
    standRuns: [
      { rings: ['box', '1', '2', '3', '4'], fromBearingDeg: 295, toBearingDeg: 360, facingDeg: 269 },
      { rings: ['box', '1', '2', '3', '4'], fromBearingDeg: 90, toBearingDeg: 155, facingDeg: 164 },
    ],
    classify: classifyCubsSection,
  }),
);

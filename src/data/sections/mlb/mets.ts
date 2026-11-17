import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { metsChartPoints } from './chart-points/mets';
import { classifyMetsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('mets');

// Pinned on USGS NAIP m_4007310_sw_18_060_20190809 (2019-08-09), a
// 400 m-wide north-up image centred on 40.7571, -73.8458 at 0.4 m/px with
// home plate at pixel (451.4, 642.4). Pixel reads in brackets. The old
// anchors used MARKET, down the left-field line, as "center field".
export const METS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['C', 'D'], bearingDeg: 194.3, distanceM: 20.1 }, // field boxes on the axis behind home [439, 691]
  { ids: ['134'], bearingDeg: 323.9, distanceM: 102.7 }, // 100 level at the LF corner [300, 435]
  { ids: ['101'], bearingDeg: 67.5, distanceM: 91.2 }, // 100 level at the RF corner [662, 555]
  { ids: ['135'], bearingDeg: 332.9, distanceM: 111.1 }, // LF seats past the wall, corner end [325, 395]
  { ids: ['139'], bearingDeg: 0.6, distanceM: 127.0 }, // LF seats past the wall, left-center end [455, 325]
  { ids: ['140'], bearingDeg: 24.2, distanceM: 137.0 }, // RF seats past the wall, right-center end [592, 330]
  { ids: ['143'], bearingDeg: 55.2, distanceM: 115.2 }, // RF seats past the wall, corner end [688, 478]
];

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const metsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(metsChartPoints, {
    orientation: ORIENTATION,
    aerialControl: METS_AERIAL_CONTROL,
    // On the photo the first-base stands' front edge runs at about 50°
    // (pixel 505,670 to 640,540; the club's drawing has them nearly 20° more
    // square to the line), so they face 140°. The third-base edge runs at
    // 330° (318,430 to 362,505), which the drawing already gets (≈245°).
    standRuns: [
      // Turned to the direction their treads climb: planes fitted to the
      // treads (scripts/measureStandHeights.py treads) agree within 15° and
      // lie more than 10° off the median of the rows' fall lines.
      { ids: ['16'], facingDeg: 200 },
      { ids: ['411'], facingDeg: 169 },
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map; each faces the
      // median of the fall lines in its middle and 4 m to either side.
      { ids: ['214'], facingDeg: 154 },
      { ids: ['4'], facingDeg: 173 },
      { ids: ['434'], facingDeg: 342 },
      { ids: ['437'], facingDeg: 337 },
      { ids: ['513'], facingDeg: 183 },
      { ids: ['523'], facingDeg: 263 },
      { ids: ['218', '512'], facingDeg: 172 },
      { ids: ['132'], facingDeg: 268 },
      { ids: ['217'], facingDeg: 174 },
      { ids: ['412'], facingDeg: 171 },
      { ids: ['426'], facingDeg: 269 },
      { ids: ['427', '526'], facingDeg: 266 },
      { ids: ['508'], facingDeg: 151 },
      { ids: ['509'], facingDeg: 158 },
      { ids: ['511'], facingDeg: 169 },
      { ids: ['519'], facingDeg: 249 },
      { ids: ['520'], facingDeg: 251 },
      { ids: ['524'], facingDeg: 267 },
      { ids: ['525'], facingDeg: 272 },
      { ids: ['527'], facingDeg: 264 },
      { ids: ['532'], facingDeg: 302 },
      { ids: ['533'], facingDeg: 305 },
      { rings: ['1', '2', '3', '4', '5'], fromBearingDeg: 75, toBearingDeg: 135, facingDeg: 140 },
    ],
    // Rings: field boxes (letters and 1–19), then the 100s to 500s; the
    // outfield 100s (135–143) are their own ring behind the outfield wall.
    tierOf: (id) => {
      if (/^(?:[A-H]|AA|HH|\d{1,2}|\dA)$/.test(id)) return 'field';
      const n = Number(id.replace(/\D+$/, ''));
      if (n >= 135 && n <= 143) return 'outfield';
      return Number.isNaN(n) ? id : String(Math.floor(n / 100));
    },
    classify: classifyMetsSection,
  }),
);

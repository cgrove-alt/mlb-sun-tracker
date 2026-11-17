import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, range, type AerialControlPoint } from './parkSectionBuilder';
import { philliesChartPoints } from './chart-points/phillies';
import { classifyPhilliesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('phillies');

// Pinned on USGS NAIP m_3907507_se_18_060_20220510 (2022-05-10), a
// 400 m-wide north-up image centred on 39.9061, -75.1665 at 0.4 m/px with
// home plate at pixel (479.4, 645.0). Pixel reads in brackets. Only seats
// near field level are used: the club's drawing is a 3D view, so the upper
// decks sit farther out on it than on the ground and cannot share one fit.
export const PHILLIES_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['C', 'E'], bearingDeg: 189, distanceM: 21 }, // Diamond Club on the axis, row 12 [474, 696]
  { ids: ['117'], bearingDeg: 117.3, distanceM: 38.0 }, // behind the middle of the Phillies dugout [564, 689]
  { ids: ['130'], bearingDeg: 259.3, distanceM: 36.5 }, // behind the middle of the visitors' dugout [390, 662]
  { ids: ['104'], bearingDeg: 37.4, distanceM: 113.1 }, // middle of the right-field stand [651, 420]
  { ids: ['142', '143'], bearingDeg: 338.3, distanceM: 116.5 }, // middle of the left-field stand [372, 374]
  { ids: ['148'], bearingDeg: 1.0, distanceM: 123.2 }, // left-center end, by the batter's eye [485, 337]
  { ids: ['101'], bearingDeg: 23.7, distanceM: 122.3 }, // right-field stand's center-field end [602, 365]
];

/** Seating ring of a chart section, for fitting stand directions. */
function philliesRing(id: string): string {
  if (/^(?:[A-G]|DUG[A-G])$/.test(id)) return 'diamond';
  if (/^(?:RB|RBW|STANDING\d)$/.test(id)) return 'standing';
  const n = Number(id.replace(/^PD/, '').replace(/V$/, ''));
  if (n < 100) return 'suite';
  if (n <= 107) return 'rf1';
  if (n <= 139) return '1';
  if (n <= 148) return 'lf1';
  if (n <= 205) return 'rf2';
  if (n <= 237) return '2';
  if (n <= 245) return 'lf2';
  if (n <= 306) return 'rf3';
  if (n <= 399) return '3';
  return '4';
}

const withMarkers = (ids: string[]) => ids.flatMap((id) => [id, `${id}V`]);

// Directions the stands' backs face, measured on the same photo. The infield
// stands run parallel to the foul lines (aisles and dugouts square to them
// give 144° and 234°), the backstop and the decks behind home are square to
// home plate (184° and 188°), the long sides of the upper decks run at 7°
// (97° and 277°), and the outfield stands follow their walls (55° and 325°).
// The club's drawing gets the first-base side right but turns the
// third-base side and both outfield stands 20° too far, so every stand uses
// the photo. Which upper sections share a straight run comes from the
// club's drawing.
const EAST = 97;
const FIRST = 144;
const HOME = 188;
const THIRD = 234;
const WEST = 277;

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const philliesSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(philliesChartPoints, {
    orientation: ORIENTATION,
    aerialControl: PHILLIES_AERIAL_CONTROL,
    tierOf: philliesRing,
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map, in the middle
      // of the section and 4 m to either side.
      { ids: ['306'], facingDeg: 102 },
      { ids: ['430'], facingDeg: 232 },
      // Lower bowl, by bearing from home. Its corners curve: aisles near the
      // poles run at 96–99° and 280°, then 107–122° and 256–271°.
      { rings: ['1', 'diamond'], fromBearingDeg: 54, toBearingDeg: 61.4, facingDeg: 97 },
      { rings: ['1', 'diamond'], fromBearingDeg: 61.5, toBearingDeg: 76.9, facingDeg: 115 },
      { rings: ['1', 'diamond'], fromBearingDeg: 77, toBearingDeg: 139.9, facingDeg: FIRST },
      // A short angled stretch of wall beside the backstop (at 62°).
      { rings: ['1', 'diamond'], fromBearingDeg: 140, toBearingDeg: 159.9, facingDeg: 152 },
      { rings: ['1', 'diamond'], fromBearingDeg: 160, toBearingDeg: 221.9, facingDeg: 184 },
      { rings: ['1', 'diamond'], fromBearingDeg: 222, toBearingDeg: 300.9, facingDeg: THIRD },
      { rings: ['1', 'diamond'], fromBearingDeg: 301, toBearingDeg: 316.4, facingDeg: 263 },
      { rings: ['1', 'diamond'], fromBearingDeg: 316.5, toBearingDeg: 330, facingDeg: 281 },
      // Outfield stands. The left-field stand's center-field end (146–148)
      // sits behind a stretch of wall that runs east–west.
      { rings: ['rf1', 'rf2', 'rf3'], fromBearingDeg: 0, toBearingDeg: 360, facingDeg: 55 },
      { ids: ['146', '147', '148'], facingDeg: 3 },
      { rings: ['lf1', 'lf2'], fromBearingDeg: 0, toBearingDeg: 360, facingDeg: 325 },
      // Upper decks and suites, by straight run.
      { ids: [...range(206, 210), ...withMarkers(range(307, 310)), ...range(58, 70)], facingDeg: EAST },
      {
        ids: [...range(211, 219), ...range(312, 318), ...withMarkers(range(412, 417)), ...range(39, 57), '71', '72'],
        facingDeg: FIRST,
      },
      { ids: [...range(220, 224), ...range(319, 322), ...withMarkers(range(418, 422)), ...range(30, 38)], facingDeg: HOME },
      {
        ids: [...range(225, 232), ...range(323, 329), ...withMarkers(range(423, 429)), ...range(11, 29), '73', '74', '75', '76'],
        facingDeg: THIRD,
      },
      { ids: [...range(233, 237), ...range(330, 333), ...withMarkers(range(430, 434)), ...range(1, 10), ...range(77, 80)], facingDeg: WEST },
    ],
    classify: classifyPhilliesSection,
  }),
);

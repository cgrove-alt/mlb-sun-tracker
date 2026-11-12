import type { DetailedSection } from '../../../types/stadium-complete';
import { marinersChartPoints } from './chart-points/mariners';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { classifyMarinersSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked on the Mariners'
// official T-Mobile Park seat-map page.
const ORIENTATION = getStadiumOrientation('mariners');

// Pinned on USGS NAIP flights with the roof open and stacked east of the
// park (Planetary Computer NAIP archive), north-up 260 m-wide images centred
// on 47.59123, -122.3327 at 0.25 m/px. The third-base stands are lit on the
// 2017-08-15 flight (home plate at pixel 460.15, 571.38), the first-base
// stands near home on the 2013-07-15 one (home at 462.97, 576.98). Square to
// each foul line the aisles stand ~7 m apart: 5.75, 12.75, 20, 27, 34.5 and
// 41.75 m from home on the third-base side, 1.25, 9, 15.75, 23 and 30 m on
// the first-base side. Rate Your Seats' netting runs 122–138, dugout to
// dugout; the dugouts end ~27 m from home, inside 122 and 138, so 135–141
// and 126–122 sit between the aisles, each control a section's middle ~28 m
// back from its line. The club's drawing is a 3-D view, so the outfield is
// pinned too, as whole stands: the right-field stands (102–110) between the
// right-field wall and the parked roof's truss on the 2011-08-26 flight
// (where the roof sits furthest east), and the end of the left-field
// stands (147–151) by the left-field corner; the fit is then projective.
export const MARINERS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['126'], bearingDeg: 173.5, distanceM: 27.4 },
  { ids: ['125'], bearingDeg: 159.5, distanceM: 29.44 },
  { ids: ['124'], bearingDeg: 148.2, distanceM: 32.87 },
  { ids: ['123'], bearingDeg: 139.4, distanceM: 37.31 },
  { ids: ['122'], bearingDeg: 132.4, distanceM: 42.56 },
  { ids: ['135'], bearingDeg: 302.7, distanceM: 32.2 },
  { ids: ['137'], bearingDeg: 320.2, distanceM: 41.2 },
  { ids: ['139'], bearingDeg: 331.6, distanceM: 53.8 },
  { ids: ['141'], bearingDeg: 339.2, distanceM: 69.5 },
  { ids: ['102', '103', '104', '105', '106', '107', '108', '109', '110'], bearingDeg: 76.9, distanceM: 118.1 },
  { ids: ['147', '148', '149', '150', '151'], bearingDeg: 354.7, distanceM: 95.7 },
];

// Stand directions (the way a stand's back faces), measured on the same
// flights:
// - Third-base side: six aisles 5.75–41.75 m from home fitted as lines run
//   267.1–276.8° (mean 271.5°), so it faces 272°. Past ~50 m the stand turns
//   toward the left-field corner: eight aisles there run 283.7–300.1° (mean
//   292.5°) and the rows' texture 283–287°, so 290°.
// - First-base side: four aisles 9–30 m from home run 180.6–182.2° (mean
//   181.25°), so it faces 181°. Its corner is in shadow or under the roof
//   truss on every flight but 2015's, where the aisles past 60 m run
//   153–174° (mean 162.6°), the same turn as the third-base corner, so 163°.
// - Behind home, between the two straights, each section faces its bearing
//   from home; so do the outfield stands and bleachers, in shadow on every
//   flight.
const RINGS = ['1', '2', '3'];
const step = (from: number, to: number, n: number, rings = RINGS) => Array.from({ length: n }, (_, i) => {
  const w = (to - from) / n;
  return { rings, fromBearingDeg: (from + i * w) % 360, toBearingDeg: (from + (i + 1) * w - 0.01) % 360, facingDeg: Math.round((from + (i + 0.5) * w) % 360) };
});

export const marinersSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(marinersChartPoints, {
  orientation: ORIENTATION,
  aerialControl: MARINERS_AERIAL_CONTROL,
  standRuns: [
    ...step(181, 271.5, 15),
    { rings: RINGS, fromBearingDeg: 271.5, toBearingDeg: 331.99, facingDeg: 272 },
    // The left-field corner runs out to the foul pole (3°).
    { rings: RINGS, fromBearingDeg: 332, toBearingDeg: 359.99, facingDeg: 290 },
    { rings: RINGS, fromBearingDeg: 0, toBearingDeg: 2.99, facingDeg: 290 },
    ...step(3, 100, 16),
    { rings: RINGS, fromBearingDeg: 100, toBearingDeg: 123.99, facingDeg: 163 },
    { rings: RINGS, fromBearingDeg: 124, toBearingDeg: 180.99, facingDeg: 181 },
    ...step(330, 460, 20, ['bleachers']),
  ],
  // Rings: the main level, the terrace club level, the view level and the
  // outfield bleachers.
  tierOf: (id, level) => (/^1[89]\d$/.test(id) ? 'bleachers' : /^[123]\d\d$/.test(id) ? id[0] : level),
  classify: classifyMarinersSection,
}));

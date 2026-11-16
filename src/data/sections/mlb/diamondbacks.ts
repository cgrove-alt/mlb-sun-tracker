import type { DetailedSection } from '../../../types/stadium-complete';
import { diamondbacksChartPoints } from './chart-points/diamondbacks';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { classifyDiamondbacksSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked on the D-backs'
// official Chase Field seat-map page.
const ORIENTATION = getStadiumOrientation('diamondbacks');

// Pinned on USGS NAIP m_3311240_nw_12_.6_20170602 (2017-06-02, roof open;
// the Planetary Computer's NAIP archive), a 260 m-wide north-up image centred
// on 33.44514, -112.06668 at 0.25 m/px with home plate at pixel (521, 582).
// The parked roof panels hide the upper decks down both lines, so the pins
// are the field boxes. Square to each foul line the aisles stand 3.4, 11.1,
// 18.8, 26.1, 33.5, 41 and 50.5 m from home on the third-base side and 2.75,
// 10.75, 18, 25.5, 32.75 and 39.75 m on the first-base side; behind home they
// stand on bearings 127.5, 152.5, 171, 189, 207.5 and 232. J is the box
// between the two aisles behind home, so the boxes run I, H, ... on the
// first-base side and K, L, ... on the third-base side, one per gap; each
// control is a box's middle, ~4.5 m back from the front wall (~17 m from
// home behind the plate, ~26 m back from each line past the dugouts). The fit
// puts the outfield stands where the photo shows them (101–105 and 100AW at
// 12–54°, 140–145 at 315–347°) without being told.
export const DIAMONDBACKS_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['J'], bearingDeg: 180, distanceM: 21.5 },
  { ids: ['I'], bearingDeg: 161.75, distanceM: 21.5 },
  { ids: ['K'], bearingDeg: 198.25, distanceM: 21.5 },
  { ids: ['H'], bearingDeg: 140.2, distanceM: 22 },
  { ids: ['L'], bearingDeg: 219.8, distanceM: 22 },
  { ids: ['N'], bearingDeg: 254.9, distanceM: 30 },
  { ids: ['Q'], bearingDeg: 280, distanceM: 45.4 },
  { ids: ['F'], bearingDeg: 106, distanceM: 29.7 },
  { ids: ['C'], bearingDeg: 80.6, distanceM: 44.6 },
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - First-base side: ten aisles fitted as lines run 128–134.9° (mean 131.1°),
//   so it faces 131°; third-base side 226–230.5° (mean 228.3°), so 228°. Both
//   are turned ~4° toward home from square to the line.
// - Behind home the front wall stands 16.8–18.6 m from the plate on every
//   bearing from 130° to 230°, so the curve's rows are arcs on home and each
//   section faces its own bearing.
// - Outfield: the right-field stand sits behind a straight wall at 140.9°
//   (it faces 51°), the left-field one behind a wall at 46° (it faces 316°).
//   The corners where each line's stand meets them are in the shadow of the
//   parked roof, so 106–107 and 139–140 take the middle direction (91° and
//   272°).
const RINGS = ['box', '1', '2', '3'];
const FIRST = 131;
const THIRD = 228;
const ids = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

export const diamondbacksSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(diamondbacksChartPoints, {
  orientation: ORIENTATION,
  aerialControl: DIAMONDBACKS_AERIAL_CONTROL,
  standRuns: [
    { ids: [...ids(101, 105), '100AW', '100BW', '102W', 'RFW'], facingDeg: 51 },
    { ids: [...ids(141, 145), '145AW', '145BW', '142W'], facingDeg: 316 },
    { ids: ['106', '107'], facingDeg: 91 },
    { ids: ['139', '140'], facingDeg: 272 },
    ...Array.from({ length: 18 }, (_, i) => ({
      rings: RINGS,
      fromBearingDeg: 126 + i * 6,
      toBearingDeg: 126 + i * 6 + 5.99,
      facingDeg: 129 + i * 6,
    })),
    { rings: RINGS, fromBearingDeg: 234, toBearingDeg: 359.99, facingDeg: THIRD },
    { rings: RINGS, fromBearingDeg: 0, toBearingDeg: 125.99, facingDeg: FIRST },
  ],
  // Rings: the field boxes (A–S), the lower bowl, the club and suite level
  // and the upper deck.
  tierOf: (id, level) => {
    if (/^[A-S]$/.test(id)) return 'box';
    if (/^\d{3}$/.test(id)) return id[0];
    if (/^210[A-I]W?$/.test(id)) return '2';
    return level;
  },
  classify: classifyDiamondbacksSection,
}));

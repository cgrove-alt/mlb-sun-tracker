import type { DetailedSection } from '../../../types/stadium-complete';
import { bravesChartPoints } from './chart-points/braves';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { classifyBravesSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

// Coordinate hotspots from the IOMEDIA Virtual Venue linked by the Braves'
// official ballpark guide: a perspective drawing seen from behind home, so it
// is pinned to the aerial photo below.
const ORIENTATION = getStadiumOrientation('braves');

// Pinned on USGS NAIP m_3308405_sw_16_060_20231007 (2023-10-07), a
// 260 m-wide north-up image centred on 33.89098, -84.4678 at 0.25 m/px with
// home plate at pixel (495.95, 455.8). Pixel reads in brackets. Sections are
// counted between the aisles found on the photo: four narrow sections behind
// each dugout (17–20, 31–34), then 16–13 and 35–39 toward the corners.
export const BRAVES_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['25', '26'], bearingDeg: 339, distanceM: 24.4 }, // the ring behind home, 19.5–29 m out on the axis
  { ids: ['19'], bearingDeg: 243.6, distanceM: 33.6 }, // behind the first-base dugout [375.5, 515.5]
  { ids: ['16'], bearingDeg: 226.2, distanceM: 47.8 }, // first section past that dugout [358, 588]
  { ids: ['13'], bearingDeg: 214.8, distanceM: 70.1 }, // last straight field section, first-base side [336, 686]
  { ids: ['35'], bearingDeg: 89.8, distanceM: 50.0 }, // first section past the third-base dugout [695.9, 455]
  { ids: ['37'], bearingDeg: 95.9, distanceM: 64.7 }, // third-base side [753.4, 482.5]
  { ids: ['158'], bearingDeg: 193.3, distanceM: 108.7 }, // middle of the 5-row Chop House stand past the RF wall [396, 879]
  { ids: ['148', '149'], bearingDeg: 134.2, distanceM: 127.7 }, // middle of the Home Run Porch in left-center [862, 812]
];

// Stand directions (the way a stand's back faces), measured on the same photo.
// Level lines (cross-aisles, deck edges, row ends) are used rather than
// aisles where they differ, because a photo leans tall things sideways.
// - First-base side: every level's long lines run 194–198.5° (cross-aisle
//   196.0°), so it faces 286°, 8° short of square to the line (204°): the
//   foul territory narrows toward the corner.
// - Third-base side: lines 4–44 m back all run 112–116° (mean 114.1°) and the
//   aisles 23.5–24.2°, so it faces 24°, square to the line (114°).
// - Behind home the rings are arcs centred on home plate (within 0.8–1.9 m),
//   so each section faces its own bearing from home; the arcs meet the
//   straights where that bearing reaches 286° and 24°.
// - The corner blocks fan: right-field aisles turn from ~286° to 245–251°,
//   left-field ones from 24° to 54–70°; each corner section takes the
//   direction at its place in the fan. The unroofed upper stands in the
//   right-field corner run at ~146°, facing ~236°; the corner sections of the
//   200s, 300s and 400s stacked there take that direction too.
// - Outfield: the Chop House's rows run 121.5° (facing 212°), the wall from
//   right-center to center 97–100° (stands facing 189°), the Home Run Porch's
//   rows 223–226° (facing 135°), and the left-field wall 183° (facing 93°).
const RINGS = ['club', 'field', '1', '2', '3', '4'];
const FIRST = 286;
const THIRD = 24;
// The curve behind home in 6° steps, each facing its middle bearing.
const CURVE = Array.from({ length: 16 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, 360 + THIRD);
  return { rings: RINGS, fromBearingDeg: from % 360, toBearingDeg: (to - 0.01) % 360, facingDeg: ((from + to) / 2) % 360 };
});

/** Selectable polygons sourced from the club-linked public 3D seating map. */
export const bravesSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(bravesChartPoints, {
  orientation: ORIENTATION,
  aerialControl: BRAVES_AERIAL_CONTROL,
  standRuns: [
    // Turned to the rows' fall line, measured on the lidar
    // (scripts/measureStandHeights.py): these sections' rows climb firmly
    // more than 15° off the direction fitted on the map, in the middle
    // of the section and 4 m to either side.
    { ids: ['111'], facingDeg: 276 },
    { ids: ['141'], facingDeg: 44 },
    { ids: ['29'], facingDeg: 34 },
    { ids: ['8'], facingDeg: 30 },
    { ids: ['9'], facingDeg: 28 },
    // The club boxes follow the backstop arc (radius 18 m) out to the dugouts.
    { ids: ['1'], facingDeg: 258 },
    { ids: ['2'], facingDeg: 268 },
    { ids: ['7'], facingDeg: 36 },
    { ids: ['8'], facingDeg: 54 },
    { ids: ['9'], facingDeg: 62 },
    { ids: ['156', '157', '158', '159', '160'], facingDeg: 212 },
    { ids: ['152', '153', '154', '155', '252'], facingDeg: 189 },
    { ids: ['146', '147', '148', '149', '150', '151'], facingDeg: 135 },
    { ids: ['144', '145'], facingDeg: 93 },
    { ids: ['10', '107', '108'], facingDeg: 248 },
    { ids: ['11'], facingDeg: 258 },
    { ids: ['12', '109'], facingDeg: 272 },
    { ids: ['210', '211', '212', '312', '313', '314', '410', '411', '412'], facingDeg: 236 },
    { ids: ['40', '142'], facingDeg: 45 },
    { ids: ['41', '143'], facingDeg: 58 },
    { ids: ['42'], facingDeg: 66 },
    ...CURVE,
    { rings: RINGS, fromBearingDeg: THIRD, toBearingDeg: 140, facingDeg: THIRD },
    { rings: RINGS, fromBearingDeg: 180, toBearingDeg: FIRST - 0.01, facingDeg: FIRST },
  ],
  // Rings: the club boxes behind home (1–9), the field sections (10–42), the
  // 100s, the outfield stands, then the 200s, 300s and 400s. Tables (T) and
  // boxes (B) sit with their parent section's ring.
  tierOf: (id) => {
    if (/^[1-9]$/.test(id)) return 'club';
    if (/^\d{2}$/.test(id)) return 'field';
    const n = Number(id.replace(/[TB]\d+$/, ''));
    if (n >= 144 && n <= 160) return 'outfield';
    return String(Math.floor(n / 100));
  },
  classify: classifyBravesSection,
}));

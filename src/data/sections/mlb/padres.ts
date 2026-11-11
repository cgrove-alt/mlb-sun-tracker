import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, type AerialControlPoint } from './parkSectionBuilder';
import { padresChartPoints } from './chart-points/padres';
import { classifyPadresSection } from './sourcedChartClassifiers';
import { padresSourcedSeeds } from './sourcedStaticParkSeeds';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('padres');

// Pinned on USGS NAIP m_3211723_ne_11_060_20220425 (2022-04-25), a
// 260 m-wide north-up image centred on 32.70721, -117.15706 at 0.25 m/px
// with home plate at pixel (518.46, 592.47). The club's drawing is a plan,
// but not to scale behind home: by its diamond (0.2045 m/px) 101–102 would
// sit 36 m out, while on the photo the Field VIP block spans 18–31 m. The
// first-base side is in the stands' shadow on the photo, so the controls
// are on the lit third-base side, behind home and in both outfield corners.
// The infield bowl is mirror-symmetric about the axis: the foul-territory
// wall traced on the photo sits 13.8/28.0/35.6 m from home at 105°/75°/65°
// and 15.5/28.0/36.5 m at the mirrored 255°/285°/295°. So 111 and 117 are
// placed as mirrors of the measured 110 and 116 (the corners are not
// symmetric, so no mirror is used past 116).
export const PADRES_AERIAL_CONTROL: readonly AerialControlPoint[] = [
  { ids: ['101', '102'], bearingDeg: 180, distanceM: 24 }, // Field VIP, 18–31 m out on the axis
  { ids: ['110'], bearingDeg: 256.2, distanceM: 29.2 },
  { ids: ['116'], bearingDeg: 288, distanceM: 55.2 },
  { ids: ['120'], bearingDeg: 295.6, distanceM: 75.5 },
  { ids: ['130'], bearingDeg: 332.1, distanceM: 116.7 }, // left-field stands past the wall
  { ids: ['133'], bearingDeg: 29.8, distanceM: 121.7 }, // right-field stands past the wall
  { ids: ['111'], bearingDeg: 103.8, distanceM: 29.2 }, // mirror of 110
  { ids: ['117'], bearingDeg: 72, distanceM: 55.2 }, // mirror of 116
];

// Stand directions (the way a stand's back faces), measured on the same photo:
// - Third-base side: level lines 14–34 m back run 311.5–318.2° (mean
//   314.6°), parallel to the line (315°), so it faces 225°. First-base side:
//   42.3–46° (mean 44.8°), so it faces 135°.
// - Both sides then turn to run along the outfield lines: on the
//   third-base side rows at 0–3.2° (facing 270°), on the first-base side at
//   0.8° (facing 90°) — the club's drawing shows the same turn (118–124 and
//   119–127 stacked straight up the page).
// - Behind home the rows are an arc centred on home plate (within 1.2 m, 70
//   of 81 rays), so each section there faces its bearing from home.
// - Left-field stands past the wall: rows at 24–32° (facing 298°);
//   right-field stands: rows at 132.7–136.5° (facing 45°).
const RINGS = ['field', 'lower', 'club', 'upper'];
const FIRST = 135;
const THIRD = 225;
const CURVE = Array.from({ length: 15 }, (_, i) => {
  const from = FIRST + i * 6;
  const to = Math.min(from + 6, THIRD);
  return { rings: RINGS, fromBearingDeg: from, toBearingDeg: to - 0.01, facingDeg: (from + to) / 2 };
});
const ids = (...list: Array<number | string>) => list.map(String);

/** Sections from the club's official seat map (chart-points/padres.ts), plus its suites and group areas. */
export const padresSections: DetailedSection[] = buildParkSections(ORIENTATION, [
  ...chartSeeds(padresChartPoints, {
    orientation: ORIENTATION,
    aerialControl: PADRES_AERIAL_CONTROL,
    standRuns: [
      { ids: ids(126, 128, 130, 132, 134, 226, 228, 230), facingDeg: 298 },
      { ids: ids(129, 131, 133, 135, 137, 227, 229, 231, 233, 235), facingDeg: 45 },
      { ids: ids(118, 120, 122, 124, 218, 220, 324, 326, 328), facingDeg: 270 },
      { ids: ids(119, 121, 123, 125, 127, 217, 219, 221, 223, 225, 323, 325, 327, 329), facingDeg: 90 },
      { ids: ids(108, 110, 112, 114, 116, 204, 206, 208, 210, 212, 214, 216, 316, 318, 320, 322), facingDeg: THIRD },
      { ids: ids(107, 109, 111, 113, 115, 117, 203, 205, 207, 209, 211, 213, 215, 313, 315, 317, 319, 321), facingDeg: FIRST },
      ...CURVE,
    ],
    classify: classifyPadresSection,
  }),
  // Suites and group areas keep their places from the club's suite and
  // hospitality maps; the numbered sections and the Lexus Club come from
  // the seat map above. 222 is kept from the earlier inventory although the
  // club's 2026 drawing shows the Cutwater Agave Club in its place (Rate
  // Your Seats still lists it); it is left unrated.
  ...padresSourcedSeeds.filter((seed) => !/^\d+$|^[A-L]$/.test(seed.id) || seed.id === '222'),
]);

import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds, range } from './parkSectionBuilder';
import { giantsChartPoints } from './chart-points/giants';
import { classifyGiantsSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('giants');

/** Sections from the club's official seat map (chart-points/giants.ts). */
export const giantsSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(giantsChartPoints, {
    orientation: ORIENTATION,
    // The club's drawing is a schematic: it lays the decks out side by side
    // around the drawn home plate (on the ground they stack), so a map onto
    // the photo bends the outer rings (best fit 10.2 m RMS). Each section's
    // angle around the drawn plate (890, 810), with center field straight up
    // the page, is the same on every ring, so bearings are read from that:
    // 115 is drawn 175 px behind the plate, 2.73 times its 64 px box.
    behindHomeIds: ['115'],
    centerFieldIds: ['142', '143'],
    originInset: 2.73,
    // Rings: the lower level (101–135), bleachers, the arcade along the
    // center-field wall (145–147) and the right-field wall (148–152), club
    // level, suites and the View level.
    tierOf: (id) => {
      const n = Number(id);
      if (n <= 61) return 'suite';
      if (n <= 135) return 'lower';
      if (n <= 144) return 'bleachers';
      if (n <= 147) return 'arcadeCenter';
      if (n <= 152) return 'arcadeRight';
      return n < 300 ? 'club' : 'view';
    },
    // Front edges on USGS NAIP m_3712213_se_10_060_20220518 (2022-05-18;
    // 400 m-wide north-up image centred on 37.7786, -122.3893 at 0.4 m/px,
    // home plate at pixel 365,563): third-base stands 54° (pixel 408,462 to
    // 505,392), first-base stands about 122° (410,648 to 530,715, around
    // the dugout jog), the left-field wall 136° (548,372 to 650,478), the
    // center-field wall due north–south (x 660, y 490–650) and the
    // right-field wall 54° (540,712 to 605,665).
    // By section number: the drawing squeezes the right-field side, so its
    // bearings there are off by up to 25°. Which sections run straight along
    // each line is read from the drawing; the curve behind home keeps the
    // drawing's own directions.
    standRuns: [
      // Turned to the rows' fall line, measured on the lidar
      // (scripts/measureStandHeights.py): these sections' rows climb firmly
      // more than 15° off the direction fitted on the map, in the middle
      // of the section and 4 m to either side.
      { ids: ['102'], facingDeg: 192 },
      { ids: ['219'], facingDeg: 313 },
      { ids: [...range(124, 135), ...range(225, 234), ...range(324, 336), ...range(44, 61)], facingDeg: 324 },
      { ids: [...range(101, 106), ...range(202, 208), ...range(302, 310), ...range(1, 15)], facingDeg: 212 },
      { ids: range(136, 144), facingDeg: 46 },
      { ids: range(145, 147), facingDeg: 90 },
      { ids: range(148, 152), facingDeg: 144 },
    ],
    classify: classifyGiantsSection,
  }),
);

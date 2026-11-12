import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { bluejaysChartPoints } from './chart-points/bluejays';
import { classifyBluejaysSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('bluejays');

// The club's 2026 seat map (a plan drawing; see chart-points/bluejays.ts),
// turned to the measured orientation: home plate behind the TD Lounge
// boxes (1–5), center field between 148 and 101. Not yet pinned to an
// aerial photo: the only public open-roof photo (2012) predates the 2024
// rebuild of the 100 level.
export const bluejaysSections: DetailedSection[] = buildParkSections(
  ORIENTATION,
  chartSeeds(bluejaysChartPoints, {
    orientation: ORIENTATION,
    behindHomeIds: ['3'],
    centerFieldIds: ['148', '101'],
    classify: classifyBluejaysSection,
  }),
);

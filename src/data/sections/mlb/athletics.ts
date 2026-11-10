import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections } from './parkSectionBuilder';
import { athleticsSourcedSeeds } from './sourcedStaticParkSeeds';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('athletics');

/** Section identities and ordering transcribed from the club's official seat map. */
export const athleticsSections: DetailedSection[] = buildParkSections(ORIENTATION, athleticsSourcedSeeds);

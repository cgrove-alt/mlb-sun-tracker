import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections } from './parkSectionBuilder';
import { giantsSourcedSeeds } from './sourcedStaticParkSeeds';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('giants');

/** Section identities and ordering transcribed from the club's official seat map. */
export const giantsSections: DetailedSection[] = buildParkSections(ORIENTATION, giantsSourcedSeeds);

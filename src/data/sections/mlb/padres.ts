import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections } from './parkSectionBuilder';
import { padresSourcedSeeds } from './sourcedStaticParkSeeds';
import { getStadiumOrientation } from '../../stadiums';

const ORIENTATION = getStadiumOrientation('padres');

/** Section identities and ordering transcribed from the club's official seat map. */
export const padresSections: DetailedSection[] = buildParkSections(ORIENTATION, padresSourcedSeeds);

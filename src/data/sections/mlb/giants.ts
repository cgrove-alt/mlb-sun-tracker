import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections } from './parkSectionBuilder';
import { giantsSourcedSeeds } from './sourcedStaticParkSeeds';

/** Section identities and ordering transcribed from the club's official seat map. */
export const giantsSections: DetailedSection[] = buildParkSections(87, giantsSourcedSeeds);

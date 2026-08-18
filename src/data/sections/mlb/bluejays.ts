import type { DetailedSection } from '../../../types/stadium-complete';
import { buildParkSections } from './parkSectionBuilder';
import { blueJaysSourcedSeeds } from './sourcedStaticParkSeeds';

/** Section identities and ordering transcribed from the club's official seat map. */
export const bluejaysSections: DetailedSection[] = buildParkSections(0, blueJaysSourcedSeeds);

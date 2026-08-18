import { band, buildParkSections, type ParkSectionSeed } from './mlb/parkSectionBuilder';
import type { OfficialInventory } from './officialTypes';
import type { DetailedSection } from '../../types/stadium-complete';

/**
 * Turn a club-published inventory into calculator sections.
 *
 * Identities come from the official chart / Virtual Venue product list.
 * Angular placement is a model: numbered runs wrap from the measured venue
 * axis, and named unique products sit at documented offsets. Row elevation
 * stays modeled — same boundary as the sourced MLB parks.
 */
export function buildOfficialSections(inventory: OfficialInventory): DetailedSection[] {
  const seeds: ParkSectionSeed[] = [];
  for (const run of inventory.bands) {
    if (run.ids.length === 0) continue;
    const wrap = run.wrap ?? inventory.angleConvention === 'compass-from-north';
    const step = run.ids.length > 1 ? 360 / run.ids.length : 0;
    seeds.push(
      ...band({
        ids: run.ids,
        level: run.level,
        namePrefix: run.namePrefix,
        coverage: run.coverage,
        compassStart: wrap
          ? inventory.orientation
          : inventory.orientation + (run.startOffset ?? 62),
        compassEnd: wrap
          ? inventory.orientation + (run.ids.length > 1 ? 360 - step : 0)
          : inventory.orientation + (run.endOffset ?? 298),
      }),
    );
  }
  for (const place of inventory.named ?? []) {
    seeds.push({
      id: place.id,
      name: place.name,
      level: place.level,
      compass: inventory.orientation + (place.compassOffset ?? 90),
      span: place.span ?? 10,
      coverage: place.coverage,
    });
  }
  return buildParkSections(inventory.orientation, seeds, inventory.angleConvention);
}

/**
 * Prints, as JSON, what scripts/measureStandHeights.py needs about one park:
 * each section's bearing from home plate, the compass direction its stand's
 * back faces, its tier and its current stand profile, plus the tiers and the
 * park envelope from src/data/stadiumStructures.ts.
 *
 *   npx tsx scripts/lidar/standSections.ts <parkId>
 */
import type { DetailedSection } from '../../src/types/stadium-complete';
import { getStadiumStructure } from '../../src/data/stadiumStructures';
import { getStadiumOrientation } from '../../src/data/stadiums';
import { standFor } from '../../src/utils/gameShade';

const park = process.argv[2];
(async () => {
  const mod: Record<string, unknown> = await import(`../../src/data/sections/mlb/${park}`);
  const sections = Object.entries(mod).find(([k, v]) => k.endsWith('Sections') && Array.isArray(v))?.[1] as DetailedSection[];
  const structure = getStadiumStructure(park);
  if (!sections || !structure) throw new Error(`${park}: no sections or no structure profile`);
  const orientation = getStadiumOrientation(park);
  const out = sections.flatMap((s) => {
    const sf = standFor(structure, s.id, s.rows.length);
    if (!sf || s.standCompass === undefined) return [];
    const bearing = (((orientation + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
    return [{ id: s.id, tier: sf.tierKey, bearing, standCompass: s.standCompass, stand: sf.stand }];
  });
  const tiers = Object.fromEntries(Object.entries(structure.tiers).map(([key, t]) => [key, {
    label: t.label, stand: t.stand, heightsSourced: t.heightsSourced, coverSourced: t.coverSourced,
    overrides: t.sections ?? {},
  }]));
  console.log(JSON.stringify({ park, orientation, envelope: structure.park, tiers, sections: out }));
})();

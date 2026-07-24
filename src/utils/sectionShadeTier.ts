import type { StadiumSection } from '../data/stadiumSectionTypes';

// Single source of the three-tier STRUCTURAL shade classification used by BOTH
// the section table (StadiumPageSSR) and the MLB shade diagram
// (InteractiveSeatingBowl). Keeping one definition is what lets us enforce the
// invariant that the diagram never shows a section as sunnier than the table's
// structural tier permits.
//
//   covered  — fully roofed/indoor (or a fixed dome): always shaded.
//   partial  — only back rows sit under an overhang: at most light sun.
//   exposed  — open to the sky: the dynamic sun model decides.
export type ShadeTier = 'covered' | 'partial' | 'exposed';

export function shadeTierOf(section: StadiumSection): ShadeTier {
  if (section.fullyCovered) return 'covered';
  if (section.partialCoverage) return 'partial';
  if (section.covered) {
    // Indoor suite/club spaces are fully covered; a covered OPEN-BOWL section is
    // shaded only in its back rows (overhang) → partial.
    return section.level === 'suite' || section.level === 'club' ? 'covered' : 'partial';
  }
  return 'exposed';
}

// Maximum sun-exposure value (0–100 from getSectionSunExposure) the diagram is
// allowed to show for a section, given its structural tier. This clamps the
// dynamic sun model so the diagram can never contradict the table:
//   covered → 0 (always shaded)
//   partial → 35 (never worse than "light sun")
//   exposed → 100 (dynamic model unclamped)
// `domed` (a fixed-roof stadium) forces every section to covered.
export function maxExposureForTier(tier: ShadeTier, domed: boolean): number {
  if (domed || tier === 'covered') return 0;
  if (tier === 'partial') return 35;
  return 100;
}

// Clamp a raw dynamic exposure to what the structural tier permits.
export function reconciledExposure(
  rawExposure: number,
  section: StadiumSection,
  domed: boolean,
): number {
  return Math.min(rawExposure, maxExposureForTier(shadeTierOf(section), domed));
}

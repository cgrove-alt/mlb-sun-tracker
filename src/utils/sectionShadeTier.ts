import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getSectionSunExposure } from './sectionSunCalculations';
import type { SectionAngleConvention } from './bowlGeometry';

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

/** Discrete exposure buckets used by the MLB section-level shade diagram. */
export type ExposureTier = 'shaded' | 'light' | 'moderate' | 'full';

export function exposureTierOf(exposure: number): ExposureTier {
  if (exposure <= 5) return 'shaded';
  if (exposure <= 35) return 'light';
  if (exposure <= 60) return 'moderate';
  return 'full';
}

export const EXPOSURE_TIER_LABEL: Record<ExposureTier, string> = {
  shaded: 'Shaded',
  light: 'Light sun',
  moderate: 'Moderate sun',
  full: 'Full sun',
};

/** Sort/filter key for tier-mode lists — not a measured sun-exposure percentage. */
export function sortKeyForExposureTier(tier: ExposureTier): number {
  if (tier === 'shaded') return 0;
  if (tier === 'light') return 20;
  if (tier === 'moderate') return 50;
  return 90;
}

export function sectionExposureAtSun(
  section: StadiumSection,
  sun: { altitudeDegrees: number; azimuthDegrees: number },
  orientation: number,
  domed: boolean,
  convention?: SectionAngleConvention,
): { exposure: number; tier: ExposureTier } {
  const belowHorizon = sun.altitudeDegrees <= 0;
  const raw = domed || belowHorizon
    ? 0
    : getSectionSunExposure(
        section,
        sun.altitudeDegrees,
        sun.azimuthDegrees,
        orientation,
        convention,
      );
  const exposure = reconciledExposure(raw, section, domed || belowHorizon);
  return { exposure, tier: exposureTierOf(exposure) };
}

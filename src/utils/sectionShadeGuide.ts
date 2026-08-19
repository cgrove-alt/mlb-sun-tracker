import type { StadiumSection } from '../data/stadiumSectionTypes';
import {
  EXPOSURE_TIER_LABEL,
  exposureTierOf,
  sectionExposureAtSun,
  type ExposureTier,
} from './sectionShadeTier';
import type { SectionAngleConvention } from './bowlGeometry';

/** Four fan-facing sides of a baseball bowl, from stadium-local `baseAngle`. */
export type BowlSideId = 'first' | 'third' | 'home' | 'outfield';

export const BOWL_SIDE_LABEL: Record<BowlSideId, string> = {
  first: 'First base',
  third: 'Third base',
  home: 'Behind home plate',
  outfield: 'Outfield',
};

export const BOWL_SIDE_HINT: Record<BowlSideId, string> = {
  first: 'Along the first-base line',
  third: 'Along the third-base line',
  home: 'Behind the catcher',
  outfield: 'Beyond center field',
};

export const BOWL_SIDE_WHERE: Record<BowlSideId, string> = {
  first: 'the first-base side',
  third: 'the third-base side',
  home: 'behind home plate',
  outfield: 'the outfield',
};

export function bowlSideOfLocalAngle(localDeg: number): BowlSideId {
  const a = ((localDeg % 360) + 360) % 360;
  if (a >= 315 || a < 45) return 'first';
  if (a < 135) return 'outfield';
  if (a < 225) return 'third';
  return 'home';
}

export type SideVerdict = 'mostly-shade' | 'mixed' | 'mostly-sun';

export const SIDE_VERDICT_LABEL: Record<SideVerdict, string> = {
  'mostly-shade': 'Mostly shade',
  mixed: 'Mixed',
  'mostly-sun': 'Mostly sun',
};

export interface SectionGuideRow {
  section: StadiumSection;
  side: BowlSideId;
  tier: ExposureTier;
  exposure: number;
}

export interface BowlSideSummary {
  id: BowlSideId;
  label: string;
  hint: string;
  total: number;
  shadeCount: number;
  sunCount: number;
  meanExposure: number;
  verdict: SideVerdict;
  examples: string[];
}

export interface SectionShadeGuide {
  rows: SectionGuideRow[];
  sides: BowlSideSummary[];
  bestSide: BowlSideSummary | null;
  coveredAlwaysShaded: number;
}

function verdictOf(shadeCount: number, total: number): SideVerdict {
  if (total === 0) return 'mixed';
  const shadeShare = shadeCount / total;
  if (shadeShare >= 0.7) return 'mostly-shade';
  if (shadeShare <= 0.3) return 'mostly-sun';
  return 'mixed';
}

export function buildSectionShadeGuide(
  sections: StadiumSection[],
  sun: { altitudeDegrees: number; azimuthDegrees: number },
  orientation: number,
  domed: boolean,
  convention?: SectionAngleConvention,
): SectionShadeGuide {
  const rows: SectionGuideRow[] = sections
    .filter((s) => typeof s.baseAngle === 'number' && typeof s.angleSpan === 'number' && s.angleSpan > 0)
    .map((section) => {
      const { exposure, tier } = sectionExposureAtSun(section, sun, orientation, domed, convention);
      return {
        section,
        side: bowlSideOfLocalAngle(section.baseAngle),
        tier,
        exposure,
      };
    });

  const sideIds: BowlSideId[] = ['first', 'home', 'third', 'outfield'];
  const sides: BowlSideSummary[] = sideIds.map((id) => {
    const group = rows.filter((r) => r.side === id);
    const shadeCount = group.filter((r) => r.tier === 'shaded' || r.tier === 'light').length;
    const sunCount = group.length - shadeCount;
    const meanExposure = group.length === 0
      ? 100
      : group.reduce((sum, r) => sum + r.exposure, 0) / group.length;
    const examples = [...new Set(group.map((r) => r.section.name))].slice(0, 4);
    return {
      id,
      label: BOWL_SIDE_LABEL[id],
      hint: BOWL_SIDE_HINT[id],
      total: group.length,
      shadeCount,
      sunCount,
      meanExposure,
      verdict: verdictOf(shadeCount, group.length),
      examples,
    };
  }).filter((side) => side.total > 0);

  const bestSide = [...sides].sort((a, b) => {
    const aShare = a.shadeCount / a.total;
    const bShare = b.shadeCount / b.total;
    if (bShare !== aShare) return bShare - aShare;
    return a.meanExposure - b.meanExposure;
  })[0] ?? null;

  const coveredAlwaysShaded = rows.filter((r) => r.tier === 'shaded' && r.section.covered).length;

  return { rows, sides, bestSide, coveredAlwaysShaded };
}

export function formatGuideHeadline(input: {
  timeLabel: string;
  domed: boolean;
  belowHorizon: boolean;
  bestSide: BowlSideSummary | null;
}): string {
  if (input.domed) return 'Every seat is shaded — this park has a fixed roof.';
  if (input.belowHorizon) return `The whole park is shaded at ${input.timeLabel} — the sun is down.`;
  const side = input.bestSide;
  if (!side) return `Pick a time to see which side of the bowl is in shade.`;
  const where = BOWL_SIDE_WHERE[side.id];
  if (side.verdict === 'mostly-shade') {
    return `Best shade at ${input.timeLabel}: ${where}.`;
  }
  if (side.verdict === 'mixed') {
    return `Best chance of shade at ${input.timeLabel}: ${where} (mixed). Check your section.`;
  }
  if (side.shadeCount === 0) {
    return `At ${input.timeLabel}, uncovered sections are in the sun. Shade shows up later in the afternoon, or in covered sections.`;
  }
  return `At ${input.timeLabel}, most uncovered seats are in the sun. Best remaining chance: ${where}.`;
}

export { EXPOSURE_TIER_LABEL, exposureTierOf };

// src/lib/shadeEngine.ts
import { sectionSolarFraction } from './sunMath';
import type { StadiumSection } from '../data/stadiumSectionTypes';

export interface SunPosition {
  altitude: number;  // degrees
  azimuth: number;   // degrees, 0=N, 90=E, 180=S, 270=W
}

export interface SectionExposureResult {
  sectionId: string;
  sunExposurePct: number;  // 0-100
  shadeScore: number;       // 1-10 (10=full shade)
  inDirectSun: boolean;
  status: 'full-shade' | 'partial-shade' | 'full-sun';
}

export function calculateSectionExposure(section: StadiumSection, sunPos: SunPosition): number {
  // Returns 0-100 sun exposure percentage
  if (section.covered && !section.partialCoverage) return 0;
  if (sunPos.altitude <= 0) return 0;

  const fraction = sectionSolarFraction(
    sunPos.altitude,
    sunPos.azimuth,
    section.baseAngle,
    section.angleSpan,
    section.level,
    section.covered
  );
  return Math.round(fraction * 100);
}

export function exposureToShadeScore(sunExposurePct: number): number {
  // 10 = full shade (0% sun), 1 = full sun (100%)
  return Math.round(10 - (sunExposurePct / 100) * 9);
}

export function exposureToStatus(sunExposurePct: number): 'full-shade' | 'partial-shade' | 'full-sun' {
  if (sunExposurePct < 20) return 'full-shade';
  if (sunExposurePct < 70) return 'partial-shade';
  return 'full-sun';
}

export function getSectionExposureResult(section: StadiumSection, sunPos: SunPosition): SectionExposureResult {
  const sunExposurePct = calculateSectionExposure(section, sunPos);
  return {
    sectionId: section.id,
    sunExposurePct,
    shadeScore: exposureToShadeScore(sunExposurePct),
    inDirectSun: sunExposurePct >= 70,
    status: exposureToStatus(sunExposurePct),
  };
}

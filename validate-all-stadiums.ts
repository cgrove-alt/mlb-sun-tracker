/**
 * Full stadium sun-exposure audit.
 *
 * This intentionally tests every registered MLB, MiLB, and NFL venue. It uses
 * stadium-local wall-clock times, passes each venue's actual section list into
 * the production section-level calculator, and validates a directional
 * physics invariant independently of the venue's section numbering.
 *
 * Run: npx tsx validate-all-stadiums.ts
 */
import { MLB_STADIUMS, type Stadium } from './src/data/stadiums';
import {
  AAA_STADIUMS,
  AA_STADIUMS,
  HIGH_A_STADIUMS,
  LOW_A_STADIUMS,
  type MiLBStadium,
} from './src/data/milbStadiums';
import { NFL_STADIUMS, type NFLStadium } from './src/data/nflStadiums';
import type { StadiumSection } from './src/data/stadiumSectionTypes';
import { getStadiumSections } from './src/data/stadium-data-aggregator';
import { getMiLBStadiumSections } from './src/data/milbStadiumSections';
import { getNFLStadiumSections } from './src/data/nflStadiumSections';
import { calculateDetailedSectionSunExposure, getSunPosition } from './src/utils/sunCalculations';
import { getSectionSunExposure } from './src/utils/sectionSunCalculations';
import { calendarDateAndTimeToUTC } from './src/utils/stadiumTime';

type AuditedStadium = Stadium | MiLBStadium | NFLStadium;
type League = 'MLB' | 'MiLB' | 'NFL';

interface AuditResult {
  league: League;
  stadium: AuditedStadium;
  sectionCount: number;
  issues: string[];
}

const normalizeAngle = (degrees: number): number => ((degrees % 360) + 360) % 360;

function validateMetadata(stadium: AuditedStadium): string[] {
  const issues: string[] = [];
  if (!stadium.id || !stadium.name) issues.push('missing id or name');
  if (!Number.isFinite(stadium.latitude) || stadium.latitude < -90 || stadium.latitude > 90) {
    issues.push(`invalid latitude (${stadium.latitude})`);
  }
  if (!Number.isFinite(stadium.longitude) || stadium.longitude < -180 || stadium.longitude > 180) {
    issues.push(`invalid longitude (${stadium.longitude})`);
  }
  if (!Number.isFinite(stadium.orientation) || stadium.orientation < 0 || stadium.orientation >= 360) {
    issues.push(`invalid orientation (${stadium.orientation})`);
  }
  if (!stadium.timezone) issues.push('missing IANA timezone');
  return issues;
}

function validateSections(sections: StadiumSection[]): string[] {
  const issues: string[] = [];
  if (!sections.length) return ['no section geometry'];

  const ids = new Set<string>();
  for (const section of sections) {
    if (!section.id || ids.has(section.id)) issues.push(`duplicate or missing section id (${section.id})`);
    ids.add(section.id);
    if (!Number.isFinite(section.baseAngle) || section.baseAngle < 0 || section.baseAngle >= 360) {
      issues.push(`invalid base angle for ${section.id} (${section.baseAngle})`);
    }
    if (!Number.isFinite(section.angleSpan) || section.angleSpan <= 0 || section.angleSpan > 360) {
      issues.push(`invalid angle span for ${section.id} (${section.angleSpan})`);
    }
  }
  return issues;
}

function directionalInvariant(stadium: AuditedStadium, at: Date): string | null {
  if (stadium.roof === 'fixed') return null;
  const sun = getSunPosition(at, stadium.latitude, stadium.longitude);
  if (sun.altitudeDegrees <= 0) return null;

  // Solve sectionCompassAngle(section, orientation) = sun.azimuth. This
  // creates a lower-bowl section with its grandstand directly behind it. The
  // opposite section must receive more direct sunlight.
  const sunSideBaseAngle = normalizeAngle(stadium.orientation + 90 - sun.azimuthDegrees);
  const crossBowlBaseAngle = normalizeAngle(sunSideBaseAngle + 180);
  const sunSide = {
    id: 'audit-sun-side',
    name: 'audit sun-side',
    baseAngle: sunSideBaseAngle,
    angleSpan: 0,
    level: 'lower',
    covered: false,
  } as StadiumSection;
  const crossBowl = {
    ...sunSide,
    id: 'audit-cross-bowl',
    baseAngle: crossBowlBaseAngle,
  };
  const shadedExposure = getSectionSunExposure(
    sunSide,
    sun.altitudeDegrees,
    sun.azimuthDegrees,
    stadium.orientation,
  );
  const sunnyExposure = getSectionSunExposure(
    crossBowl,
    sun.altitudeDegrees,
    sun.azimuthDegrees,
    stadium.orientation,
  );
  return sunnyExposure > shadedExposure
    ? null
    : `directional invariant failed at ${sun.altitudeDegrees.toFixed(1)}° sun: ` +
      `sun-side=${shadedExposure}, cross-bowl=${sunnyExposure}`;
}

function validateExposureOutput(
  stadium: AuditedStadium,
  sections: StadiumSection[],
  at: Date,
): string[] {
  const output = calculateDetailedSectionSunExposure(
    stadium as Stadium,
    getSunPosition(at, stadium.latitude, stadium.longitude),
    undefined,
    sections,
  );
  const issues: string[] = [];
  if (output.length !== sections.length) {
    issues.push(`calculator returned ${output.length}/${sections.length} sections`);
  }
  for (const result of output) {
    if (!Number.isFinite(result.sunExposure) || result.sunExposure < 0 || result.sunExposure > 100) {
      issues.push(`invalid exposure for ${result.section.id} (${result.sunExposure})`);
    }
    if (stadium.roof === 'fixed' && result.sunExposure !== 0) {
      issues.push(`fixed-roof section ${result.section.id} reports ${result.sunExposure}% direct sun`);
    }
  }
  return issues;
}

async function auditStadium(
  league: League,
  stadium: AuditedStadium,
  sections: StadiumSection[],
): Promise<AuditResult> {
  const issues = [...validateMetadata(stadium), ...validateSections(sections)];
  const moments = [
    calendarDateAndTimeToUTC('2025-07-15', 13, 0, stadium.timezone),
    calendarDateAndTimeToUTC('2025-07-15', 17, 0, stadium.timezone),
  ];
  for (const at of moments) {
    issues.push(...validateExposureOutput(stadium, sections, at));
    const directionalIssue = directionalInvariant(stadium, at);
    if (directionalIssue) issues.push(directionalIssue);
  }
  return { league, stadium, sectionCount: sections.length, issues };
}

async function main(): Promise<void> {
  const results: AuditResult[] = [];

  for (const stadium of MLB_STADIUMS) {
    results.push(await auditStadium(
      'MLB',
      stadium,
      (await getStadiumSections(stadium.id, 'MLB')) as unknown as StadiumSection[],
    ));
  }
  const milbStadiums = [...AAA_STADIUMS, ...AA_STADIUMS, ...HIGH_A_STADIUMS, ...LOW_A_STADIUMS];
  for (const stadium of milbStadiums) {
    results.push(await auditStadium('MiLB', stadium, getMiLBStadiumSections(stadium.id)));
  }
  for (const stadium of NFL_STADIUMS) {
    results.push(await auditStadium('NFL', stadium, getNFLStadiumSections(stadium.id)));
  }

  console.log('Full stadium sun-exposure audit');
  console.log('='.repeat(72));
  for (const result of results) {
    const status = result.issues.length ? `FAIL: ${result.issues.join('; ')}` : 'PASS';
    console.log(`${result.league.padEnd(4)} ${result.stadium.id.padEnd(28)} ${String(result.sectionCount).padStart(4)} sections  ${status}`);
  }
  const failures = results.filter((result) => result.issues.length);
  console.log('='.repeat(72));
  console.log(`Audited ${results.length} stadiums: ${results.length - failures.length} passed, ${failures.length} failed.`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

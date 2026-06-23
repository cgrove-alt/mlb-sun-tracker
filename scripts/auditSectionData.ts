#!/usr/bin/env tsx
/**
 * Phase 1 audit — Section-Level Sun Exposure Audit (2026-05-21)
 *
 * Run with: npx tsx scripts/auditSectionData.ts
 *
 * For every MLB stadium with section data registered in
 * stadium-data-aggregator, report:
 *   - section count, level distribution, covered count
 *   - baseAngle distribution (sorted; min/max; max gap around the bowl)
 *   - vertices3D angular center vs baseAngle (convention consistency check)
 *   - per-section vs per-stadium covered ratio
 *
 * Plus: detect byte-identical section files across stadiums (Phase 1.2).
 *
 * Output is a per-stadium pass/fail table plus the raw measurements behind
 * each finding so the next phase can fix root causes at the data layer.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { MLB_STADIUMS, Stadium } from '../src/data/stadiums';
import {
  getStadiumSections,
  hasSpecificData,
} from '../src/data/stadium-data-aggregator';
import type { DetailedSection } from '../src/types/stadium-complete';
import {
  classifyFidelity,
  type DataFidelity,
} from '../src/data/stadiumDataFidelity';
import {
  getOrientationProvenance,
  getOrientationPrecision,
} from '../src/data/stadiumOrientationProvenance';

// --strict makes the script exit non-zero on HARD data errors (missing
// sections, duplicate files, vertex-convention mismatches). Low fidelity and
// low orientation precision are reported as warnings, not failures.
const STRICT = process.argv.includes('--strict');

// ---- helpers ----

function fmt(n: number, digits = 1): string {
  return n.toFixed(digits).padStart(6);
}

function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// Angular gap analysis around the 0-360 bowl.
function maxAngularGap(angles: number[]): { gap: number; afterAngle: number } {
  if (angles.length === 0) return { gap: 360, afterAngle: 0 };
  const sorted = angles.map(normalize360).sort((a, b) => a - b);
  let maxGap = 0;
  let after = sorted[0];
  for (let i = 0; i < sorted.length; i++) {
    const next = sorted[(i + 1) % sorted.length];
    const gap = i === sorted.length - 1
      ? 360 - sorted[i] + next
      : next - sorted[i];
    if (gap > maxGap) {
      maxGap = gap;
      after = sorted[i];
    }
  }
  return { gap: maxGap, afterAngle: after };
}

// Polar angle (deg, 0-360) of the centroid of vertex (x,y) pairs.
function vertexCentroidAngle(s: DetailedSection): number | null {
  if (!s.vertices3D || s.vertices3D.length === 0) return null;
  const cx = s.vertices3D.reduce((a, v) => a + v.x, 0) / s.vertices3D.length;
  const cy = s.vertices3D.reduce((a, v) => a + v.y, 0) / s.vertices3D.length;
  if (cx === 0 && cy === 0) return null;
  return normalize360((Math.atan2(cy, cx) * 180) / Math.PI);
}

function smallestSignedAngleDiff(a: number, b: number): number {
  let d = ((a - b) % 360 + 540) % 360 - 180;
  return d;
}

// ---- per-stadium audit ----

interface StadiumAudit {
  id: string;
  name: string;
  orientation: number;
  roof: Stadium['roof'];
  hasSections: boolean;
  fidelity: DataFidelity;
  orientationConfidence: string;
  orientationPrecisionDeg: number;
  sectionCount: number;
  byLevel: Record<string, number>;
  coveredCount: number;
  coveredPercent: number;
  baseAngleMin: number;
  baseAngleMax: number;
  baseAngleMaxGap: number;
  baseAngleMaxGapAfter: number;
  vertexBaseAngleMismatches: Array<{ id: string; baseAngle: number; vertexAngle: number; diff: number }>;
  vertexCentroidIsMissingOrZero: number;
  totalRows: number;
  zeroVertexSections: number;
}

function auditStadium(stadium: Stadium): StadiumAudit {
  const sections = getStadiumSections(stadium.id, 'MLB');
  const has = hasSpecificData(stadium.id);
  const byLevel: Record<string, number> = {};
  let coveredCount = 0;
  let totalRows = 0;
  let zeroVertex = 0;
  let missingCentroid = 0;
  const vertexMismatches: StadiumAudit['vertexBaseAngleMismatches'] = [];
  const angles: number[] = [];

  for (const s of sections) {
    byLevel[s.level] = (byLevel[s.level] ?? 0) + 1;
    if (s.covered) coveredCount++;
    totalRows += s.rows?.length ?? 0;
    angles.push(s.baseAngle);
    if (!s.vertices3D || s.vertices3D.length === 0) {
      zeroVertex++;
      continue;
    }
    const vAngle = vertexCentroidAngle(s);
    if (vAngle === null) {
      missingCentroid++;
      continue;
    }
    const center = normalize360(s.baseAngle + s.angleSpan / 2);
    const diff = Math.abs(smallestSignedAngleDiff(vAngle, center));
    // Threshold 15° — vertex centroid for a 5-12° section span should land
    // within ~15° of the section's angular center. Larger means vertices and
    // baseAngle disagree on convention.
    if (diff > 15) {
      vertexMismatches.push({
        id: s.id,
        baseAngle: s.baseAngle,
        vertexAngle: vAngle,
        diff,
      });
    }
  }

  const gap = maxAngularGap(angles);
  const prov = getOrientationProvenance(stadium.id);

  return {
    id: stadium.id,
    name: stadium.name,
    orientation: stadium.orientation,
    roof: stadium.roof,
    hasSections: has.hasSections,
    fidelity: classifyFidelity(sections, stadium.id, has.hasSections),
    orientationConfidence: prov?.confidence ?? 'unverified',
    orientationPrecisionDeg: getOrientationPrecision(stadium.id),
    sectionCount: sections.length,
    byLevel,
    coveredCount,
    coveredPercent: sections.length ? (coveredCount / sections.length) * 100 : 0,
    baseAngleMin: angles.length ? Math.min(...angles.map(normalize360)) : 0,
    baseAngleMax: angles.length ? Math.max(...angles.map(normalize360)) : 0,
    baseAngleMaxGap: gap.gap,
    baseAngleMaxGapAfter: gap.afterAngle,
    vertexBaseAngleMismatches: vertexMismatches,
    vertexCentroidIsMissingOrZero: missingCentroid,
    totalRows,
    zeroVertexSections: zeroVertex,
  };
}

// ---- file-duplicate detection ----

function md5Of(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buf).digest('hex');
}

function hashableSectionData(filePath: string): string {
  // Hash only the section array body so different file headers / variable
  // names don't mask actual data duplication.
  const src = fs.readFileSync(filePath, 'utf8');
  const m = src.match(/DetailedSection\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return md5Of(filePath);
  // Normalize whitespace.
  return crypto.createHash('md5').update(m[1].replace(/\s+/g, ' ')).digest('hex');
}

function detectDuplicateFiles(): Array<{ a: string; b: string; reason: 'bytes' | 'body' }> {
  const dir = path.join(__dirname, '..', 'src', 'data', 'sections', 'mlb');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
  const fullByteMap = new Map<string, string[]>();
  const bodyMap = new Map<string, string[]>();
  for (const f of files) {
    const full = path.join(dir, f);
    const byteH = md5Of(full);
    const bodyH = hashableSectionData(full);
    if (!fullByteMap.has(byteH)) fullByteMap.set(byteH, []);
    fullByteMap.get(byteH)!.push(f);
    if (!bodyMap.has(bodyH)) bodyMap.set(bodyH, []);
    bodyMap.get(bodyH)!.push(f);
  }
  const dups: Array<{ a: string; b: string; reason: 'bytes' | 'body' }> = [];
  fullByteMap.forEach((group) => {
    if (group.length > 1) {
      for (let i = 1; i < group.length; i++) {
        dups.push({ a: group[0], b: group[i], reason: 'bytes' });
      }
    }
  });
  bodyMap.forEach((group) => {
    if (group.length > 1) {
      // Don't double-report exact-byte dupes.
      for (let i = 1; i < group.length; i++) {
        if (!dups.some(d => d.a === group[0] && d.b === group[i] && d.reason === 'bytes')) {
          dups.push({ a: group[0], b: group[i], reason: 'body' });
        }
      }
    }
  });
  return dups;
}

// ---- main ----

function main(): void {
  console.log('🔍 Phase 1 Section Data Audit — MLB');
  console.log('='.repeat(80));
  console.log('');

  const audits = MLB_STADIUMS.map(auditStadium);

  // Header
  console.log(
    'id            | fidelity     | orient(±°)   | sections | covered % ' +
    '| max-gap | vertex-mismatch'
  );
  console.log('-'.repeat(120));

  for (const a of audits) {
    const mismatchSummary =
      a.vertexBaseAngleMismatches.length === 0
        ? '✓'
        : `✗ ${a.vertexBaseAngleMismatches.length}`;
    const orient = `${a.orientationConfidence}/±${a.orientationPrecisionDeg}°`;
    console.log(
      `${a.id.padEnd(13)} | ${a.fidelity.padEnd(12)} | ${orient.padEnd(12)} ` +
      `|   ${String(a.sectionCount).padStart(4)}   ` +
      `|   ${fmt(a.coveredPercent, 1)}% ` +
      `|  ${fmt(a.baseAngleMaxGap)}° ` +
      `| ${mismatchSummary}`
    );
  }

  // Anomalies in detail.
  console.log('');
  console.log('-'.repeat(80));
  console.log('Anomalies (per stadium):');
  console.log('-'.repeat(80));
  let anomalyCount = 0;

  for (const a of audits) {
    const findings: string[] = [];

    if (!a.hasSections) findings.push('NO section data registered — falls back to generic 45° template');
    if (a.sectionCount < 30) findings.push(`only ${a.sectionCount} sections`);
    if (a.baseAngleMaxGap > 30) findings.push(`baseAngle gap=${a.baseAngleMaxGap.toFixed(1)}° after ${a.baseAngleMaxGapAfter.toFixed(0)}°`);
    if (a.coveredCount === 0) findings.push('zero covered sections — no overhang modeling');
    if (a.roof === 'fixed' && a.coveredPercent < 99) findings.push(`roof=fixed but only ${a.coveredPercent.toFixed(0)}% sections marked covered`);
    if (a.zeroVertexSections > 0) findings.push(`${a.zeroVertexSections} sections with no vertices3D`);
    if (a.vertexBaseAngleMismatches.length > 0) {
      findings.push(`${a.vertexBaseAngleMismatches.length} sections where vertex centroid disagrees with baseAngle > 15°`);
    }
    if (a.totalRows === 0) findings.push('zero rows total — section model is angles-only');

    if (findings.length) {
      anomalyCount++;
      console.log('');
      console.log(`  ⚠️  ${a.id} (${a.name}) — orientation=${a.orientation}° roof=${a.roof}`);
      for (const f of findings) console.log(`     • ${f}`);
      if (a.vertexBaseAngleMismatches.length && a.vertexBaseAngleMismatches.length <= 6) {
        for (const m of a.vertexBaseAngleMismatches) {
          console.log(`       - section ${m.id}: baseAngle=${m.baseAngle.toFixed(1)} vs vertex=${m.vertexAngle.toFixed(1)} (diff=${m.diff.toFixed(1)}°)`);
        }
      }
    }
  }

  if (anomalyCount === 0) {
    console.log('  (none)');
  }

  // Duplicate detection.
  console.log('');
  console.log('-'.repeat(80));
  console.log('File-duplicate detection (Phase 1.2):');
  console.log('-'.repeat(80));
  const dups = detectDuplicateFiles();
  if (dups.length === 0) {
    console.log('  No two MLB stadium section files share the same data. ✓');
  } else {
    for (const d of dups) {
      console.log(`  ⚠️  ${d.a} ≡ ${d.b}  (${d.reason})`);
    }
  }

  // Summary stats.
  console.log('');
  console.log('-'.repeat(80));
  console.log('Summary:');
  console.log('-'.repeat(80));
  console.log(`  Stadiums audited:                 ${audits.length}`);
  console.log(`  With section data:                ${audits.filter(a => a.hasSections).length}`);
  console.log(`  Without section data (fallback):  ${audits.filter(a => !a.hasSections).length}`);
  console.log(`  Anomalies found:                  ${anomalyCount}`);
  console.log(`  Duplicate file pairs:             ${dups.length}`);
  const sectionsSum = audits.reduce((a, b) => a + b.sectionCount, 0);
  console.log(`  Total sections across MLB:        ${sectionsSum}`);
  const rowsSum = audits.reduce((a, b) => a + b.totalRows, 0);
  console.log(`  Total rows across MLB:            ${rowsSum}`);

  // ---- fidelity + orientation-precision distribution (Phase 9 A3/A4) ----
  console.log('');
  console.log('-'.repeat(80));
  console.log('Data quality (Phase 9):');
  console.log('-'.repeat(80));
  const byFidelity = (f: DataFidelity) => audits.filter(a => a.fidelity === f);
  console.log(`  Section fidelity:   real=${byFidelity('real').length}  partial=${byFidelity('partial').length}  approximate=${byFidelity('approximate').length}`);
  const verified = audits.filter(a => a.orientationConfidence === 'verified');
  const estimated = audits.filter(a => a.orientationConfidence === 'estimated');
  const unverified = audits.filter(a => a.orientationConfidence === 'unverified');
  console.log(`  Orientation conf.:  verified=${verified.length}  estimated=${estimated.length}  unverified=${unverified.length}`);
  const surveyGrade = audits.filter(a => a.orientationPrecisionDeg <= 2);
  console.log(`  Survey-grade (±≤2°): ${surveyGrade.length} / ${audits.length}  (goal: re-measure all 30 to ±2° GIS)`);
  const approx = byFidelity('approximate').map(a => a.id);
  if (approx.length) {
    console.log(`  ⚠️  approximate-fidelity parks (UI should disclose): ${approx.join(', ')}`);
  }

  // ---- hard errors vs warnings; strict exit ----
  const hardErrors: string[] = [];
  for (const a of audits) {
    if (!a.hasSections) hardErrors.push(`${a.id}: no registered section data (generic fallback)`);
    if (a.vertexBaseAngleMismatches.length > 0) hardErrors.push(`${a.id}: ${a.vertexBaseAngleMismatches.length} vertex/baseAngle convention mismatch(es)`);
    if (a.totalRows === 0) hardErrors.push(`${a.id}: zero rows (angles-only)`);
  }
  for (const d of dups.filter(x => x.reason === 'bytes')) {
    hardErrors.push(`byte-identical section files: ${d.a} ≡ ${d.b}`);
  }

  console.log('');
  console.log('='.repeat(80));
  if (hardErrors.length === 0) {
    console.log('✅ No hard data errors (sections present, conventions consistent, no byte-dupes).');
  } else {
    console.log(`❌ ${hardErrors.length} hard data error(s):`);
    for (const e of hardErrors) console.log(`   • ${e}`);
  }
  console.log('='.repeat(80));

  if (STRICT && hardErrors.length > 0) {
    process.exit(1);
  }
}

main();

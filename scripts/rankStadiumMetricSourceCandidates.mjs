#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LIDAR_ROOT = path.join(ROOT, 'tmp', 'lidar');
const OUTPUT_PATH = path.join(
  LIDAR_ROOT,
  'mlb-metric-source-candidate-ranking-2026.json',
);

const GATES = Object.freeze({
  horizontalAccuracy95FtMaximum: 1,
  verticalAccuracy95FtMaximum: 1,
  rowScaleSamplingCoveragePercentMinimum: 100,
  twoFlightLineCoveragePercentMinimum: 100,
  orientationUncertaintyDegreesMaximum: 1,
});

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function finiteNumber(value) {
  return Number.isFinite(value) ? value : null;
}

function compareNullableAscending(left, right) {
  if (left === null && right === null) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return left - right;
}

function sourceDateScore(acquiredOn) {
  const years = String(acquiredOn ?? '').match(/20\d{2}/g);
  return years?.length ? Math.max(...years.map(Number)) : 0;
}

async function findSurfaceAudits() {
  const entries = await fs.readdir(LIDAR_ROOT, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(LIDAR_ROOT, entry.name, 'stadium-surface-audit.json');
    try {
      await fs.access(candidate);
      files.push(candidate);
    } catch {
      // Not every research directory contains a stadium surface audit.
    }
  }

  return files.sort();
}

function evaluateAudit(audit, relativePath, fileSha256) {
  const oneFootSampling = audit.samplingAndRepeatability?.find(
    (entry) => entry.cellSizeFt === 1,
  );
  const horizontal95Ft = finiteNumber(
    audit.source?.reportedHorizontalAccuracy95Ft,
  );
  const vertical95Ft = finiteNumber(
    audit.source?.reportedRawFundamentalVerticalAccuracy95Ft,
  );
  const samplingCoveragePercent = finiteNumber(
    oneFootSampling?.samplingCoveragePercent,
  );
  const twoFlightLineCoveragePercent = finiteNumber(
    oneFootSampling?.multipleFlightLineCoveragePercent,
  );
  const currentGeometryStatus = audit.currency?.status ?? 'not-reviewed';

  const checks = {
    sourceHorizontalAccuracyReported: horizontal95Ft !== null,
    sourceHorizontalAccuracyWithinGate:
      horizontal95Ft !== null &&
      horizontal95Ft <= GATES.horizontalAccuracy95FtMaximum,
    sourceVerticalAccuracyReported: vertical95Ft !== null,
    sourceVerticalAccuracyWithinGate:
      vertical95Ft !== null &&
      vertical95Ft <= GATES.verticalAccuracy95FtMaximum,
    rowScaleSamplingComplete:
      samplingCoveragePercent !== null &&
      samplingCoveragePercent >=
        GATES.rowScaleSamplingCoveragePercentMinimum,
    twoFlightLineCoverageComplete:
      twoFlightLineCoveragePercent !== null &&
      twoFlightLineCoveragePercent >=
        GATES.twoFlightLineCoveragePercentMinimum,
    currentGeometryReviewedAndCurrent: currentGeometryStatus === 'current',
    stadiumSurfaceHorizontalAccuracyEstablished: false,
    stadiumOrientationUncertaintyEstablishedWithinGate: false,
    semanticRowsIndependentlyValidated: false,
    obstructionCompletenessEstablished: false,
    independentShadowHoldoutPassed: false,
  };

  const blockers = [];
  if (!checks.sourceHorizontalAccuracyReported) {
    blockers.push('SOURCE_HORIZONTAL_ACCURACY_NOT_REPORTED');
  } else if (!checks.sourceHorizontalAccuracyWithinGate) {
    blockers.push('SOURCE_HORIZONTAL_ACCURACY_EXCEEDS_GATE');
  }
  if (!checks.sourceVerticalAccuracyReported) {
    blockers.push('SOURCE_VERTICAL_ACCURACY_NOT_REPORTED');
  } else if (!checks.sourceVerticalAccuracyWithinGate) {
    blockers.push('SOURCE_VERTICAL_ACCURACY_EXCEEDS_GATE');
  }
  if (!checks.rowScaleSamplingComplete) {
    blockers.push('ROW_SCALE_SAMPLING_INCOMPLETE');
  }
  if (!checks.twoFlightLineCoverageComplete) {
    blockers.push('TWO_FLIGHT_LINE_COVERAGE_INCOMPLETE');
  }
  if (!checks.currentGeometryReviewedAndCurrent) {
    blockers.push('CURRENT_GEOMETRY_NOT_ESTABLISHED');
  }
  blockers.push(
    'STADIUM_SURFACE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED',
    'ORIENTATION_UNCERTAINTY_NOT_ESTABLISHED',
    'SEMANTIC_ROWS_NOT_INDEPENDENTLY_VALIDATED',
    'OBSTRUCTION_COMPLETENESS_NOT_ESTABLISHED',
    'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
  );

  return {
    stadiumId: audit.stadiumId,
    sourceDirectory: path.dirname(relativePath),
    auditPath: relativePath,
    auditSha256: fileSha256,
    acquiredOn: audit.source?.acquiredOn ?? null,
    sourceDateScore: sourceDateScore(audit.source?.acquiredOn),
    provider: audit.source?.provider ?? null,
    nominalPointSpacingFt: finiteNumber(audit.source?.nominalPointSpacingFt),
    reportedHorizontalAccuracy95Ft: horizontal95Ft,
    horizontalGateMarginFt:
      horizontal95Ft === null
        ? null
        : Number(
            (
              GATES.horizontalAccuracy95FtMaximum - horizontal95Ft
            ).toFixed(6),
          ),
    reportedRawFundamentalVerticalAccuracy95Ft: vertical95Ft,
    oneFootCellSamplingCoveragePercent: samplingCoveragePercent,
    oneFootCellTwoFlightLineCoveragePercent: twoFlightLineCoveragePercent,
    currentGeometryStatus,
    checks,
    blockers,
    publicationEligible: false,
  };
}

function compareCandidates(left, right) {
  const horizontalGateDifference =
    Number(right.checks.sourceHorizontalAccuracyWithinGate) -
    Number(left.checks.sourceHorizontalAccuracyWithinGate);
  if (horizontalGateDifference !== 0) return horizontalGateDifference;

  const currentDifference =
    Number(right.checks.currentGeometryReviewedAndCurrent) -
    Number(left.checks.currentGeometryReviewedAndCurrent);
  if (currentDifference !== 0) return currentDifference;

  const horizontalDifference = compareNullableAscending(
    left.reportedHorizontalAccuracy95Ft,
    right.reportedHorizontalAccuracy95Ft,
  );
  if (horizontalDifference !== 0) return horizontalDifference;

  if (right.sourceDateScore !== left.sourceDateScore) {
    return right.sourceDateScore - left.sourceDateScore;
  }

  return `${left.stadiumId}/${left.sourceDirectory}`.localeCompare(
    `${right.stadiumId}/${right.sourceDirectory}`,
  );
}

async function main() {
  const auditPaths = await findSurfaceAudits();
  const candidates = [];

  for (const auditPath of auditPaths) {
    const bytes = await fs.readFile(auditPath);
    const audit = JSON.parse(bytes.toString('utf8'));
    candidates.push(
      evaluateAudit(
        audit,
        path.relative(ROOT, auditPath),
        sha256(bytes),
      ),
    );
  }

  candidates.sort(compareCandidates);

  const summary = {
    sourceAuditCount: candidates.length,
    stadiumCount: new Set(candidates.map((candidate) => candidate.stadiumId))
      .size,
    sourceHorizontalAccuracyWithinGateCount: candidates.filter(
      (candidate) => candidate.checks.sourceHorizontalAccuracyWithinGate,
    ).length,
    currentGeometryReviewedAndCurrentCount: candidates.filter(
      (candidate) => candidate.checks.currentGeometryReviewedAndCurrent,
    ).length,
    completeRowScaleSamplingCount: candidates.filter(
      (candidate) => candidate.checks.rowScaleSamplingComplete,
    ).length,
    completeTwoFlightLineCoverageCount: candidates.filter(
      (candidate) => candidate.checks.twoFlightLineCoverageComplete,
    ).length,
    publicationEligibleCount: 0,
  };

  const artifact = {
    schemaVersion: 1,
    artifactVersion: 'mlb-metric-source-candidate-ranking-v1',
    generatedAt: new Date().toISOString(),
    purpose:
      'Rank downloaded stadium metric-source candidates without promoting source-level quality metadata to stadium-row measurement evidence.',
    thresholds: GATES,
    method: {
      ranking:
        'Source horizontal gate pass first, then current-geometry status, reported horizontal accuracy, newest acquisition year, and stable identifier.',
      caveat:
        'Project-level source accuracy is necessary but never sufficient. It does not establish stadium-surface accuracy, semantic rows, current obstruction completeness, or shadow prediction performance.',
    },
    summary,
    candidates,
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
  const outputBytes = await fs.readFile(OUTPUT_PATH);
  process.stdout.write(
    `${path.relative(ROOT, OUTPUT_PATH)}\nsha256:${sha256(outputBytes)}\n${JSON.stringify(summary)}\n`,
  );
}

await main();

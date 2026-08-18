#!/usr/bin/env node

/**
 * Validate a manual review of primary USGS LiDAR project reports against the
 * exact report-acquisition manifest. Numeric release gates are recomputed here
 * so a reviewed value cannot be rounded into compliance.
 */

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const manifestPath = typeof args.manifest === 'string' ? args.manifest : null;
const decisionPath = typeof args.decision === 'string' ? args.decision : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!manifestPath || !decisionPath || !outputPath) {
  console.error('Required: --manifest=PATH --decision=PATH --output=PATH');
  process.exit(2);
}

async function sha256(path) {
  const digest = createHash('sha256');
  await pipeline(createReadStream(path), new Transform({
    transform(chunk, _encoding, callback) {
      digest.update(chunk);
      callback();
    },
  }));
  return digest.digest('hex');
}

function fingerprint(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function requireFiniteNonnegative(value, label) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be finite and nonnegative`);
}

const [manifestMarkup, decisionMarkup] = await Promise.all([
  readFile(manifestPath, 'utf8'),
  readFile(decisionPath, 'utf8'),
]);
const manifest = JSON.parse(manifestMarkup);
const decision = JSON.parse(decisionMarkup);
if (manifest?.artifactKind !== 'usgs-lidar-project-report-acquisition') {
  throw new Error('Manifest is not a usgs-lidar-project-report-acquisition artifact');
}
if (decision?.artifactKind !== 'usgs-lidar-project-report-review-decision') {
  throw new Error('Decision is not a usgs-lidar-project-report-review-decision artifact');
}
if (decision.expectedReportAcquisitionArtifactVersion !== manifest.artifactVersion) {
  throw new Error('Report acquisition artifact version does not match the reviewed decision');
}
if (decision.stadiumId !== manifest.stadiumId || decision.projectName !== manifest.projectName) {
  throw new Error('Decision stadium or project does not match the report acquisition');
}
if (!decision.reviewedOn || !decision.reviewer) {
  throw new Error('Decision must include reviewedOn and reviewer');
}

const verifiedDocuments = [];
for (const expected of decision.reviewedDocuments ?? []) {
  const report = manifest.reports.find((candidate) => candidate.key.endsWith(expected.keySuffix));
  if (!report) throw new Error(`Reviewed report is absent from acquisition: ${expected.keySuffix}`);
  if (report.sha256 !== expected.sha256) {
    throw new Error(`Reviewed report hash mismatch: ${expected.keySuffix}`);
  }
  const currentSha256 = await sha256(report.path);
  if (currentSha256 !== report.sha256) {
    throw new Error(`Acquired report bytes have drifted: ${report.path}`);
  }
  verifiedDocuments.push({
    key: report.key,
    path: report.path,
    byteLength: report.byteLength,
    sha256: currentSha256,
  });
}
if (verifiedDocuments.length === 0) throw new Error('At least one reviewed document is required');

const metresToFeet = 3.280839895013123;
const thresholds = decision.releaseThresholds;
const metrics = decision.metrics;
requireFiniteNonnegative(thresholds.horizontalAccuracy95Ft, 'horizontal threshold');
requireFiniteNonnegative(thresholds.verticalAccuracy95Ft, 'vertical threshold');
const horizontalAccuracyAvailable = Number.isFinite(metrics.horizontalAccuracy95Metres)
  && Number.isFinite(metrics.horizontalAccuracy95Ft);
if (horizontalAccuracyAvailable) {
  requireFiniteNonnegative(metrics.horizontalAccuracy95Metres, 'horizontal accuracy');
  requireFiniteNonnegative(metrics.horizontalAccuracy95Ft, 'horizontal accuracy in feet');
}
const verticalAccuracy95Metres = metrics.verticalAccuracy95Metres
  ?? metrics.verticalRawNva95Metres;
const verticalAccuracy95Ft = metrics.verticalAccuracy95Ft
  ?? metrics.verticalRawNva95Ft;
const verticalAccuracyMetricKind = metrics.verticalAccuracyMetricKind
  ?? (metrics.verticalRawNva95Metres === undefined ? null : 'raw-nva');
const verticalAccuracyAvailable = Number.isFinite(verticalAccuracy95Metres)
  && Number.isFinite(verticalAccuracy95Ft)
  && typeof verticalAccuracyMetricKind === 'string'
  && verticalAccuracyMetricKind.length > 0;
if (verticalAccuracyAvailable) {
  requireFiniteNonnegative(verticalAccuracy95Metres, 'vertical accuracy');
  requireFiniteNonnegative(verticalAccuracy95Ft, 'vertical accuracy in feet');
}
const computedHorizontalAccuracy95Ft = horizontalAccuracyAvailable
  ? metrics.horizontalAccuracy95Metres * metresToFeet
  : null;
const computedVerticalAccuracy95Ft = verticalAccuracyAvailable
  ? verticalAccuracy95Metres * metresToFeet
  : null;
if (
  horizontalAccuracyAvailable
  && Math.abs(computedHorizontalAccuracy95Ft - metrics.horizontalAccuracy95Ft) > 0.01
) {
  throw new Error('Reviewed horizontal metre and foot values disagree by more than 0.01 ft');
}
if (
  verticalAccuracyAvailable
  && Math.abs(computedVerticalAccuracy95Ft - verticalAccuracy95Ft) > 0.01
) {
  throw new Error('Reviewed vertical metre and foot values disagree by more than 0.01 ft');
}

const gates = {
  sourceHorizontalAccuracy: {
    thresholdFt: thresholds.horizontalAccuracy95Ft,
    reportedFt: horizontalAccuracyAvailable ? metrics.horizontalAccuracy95Ft : null,
    computedFtFromReportedMetres: computedHorizontalAccuracy95Ft,
    metricAvailable: horizontalAccuracyAvailable,
    pass: horizontalAccuracyAvailable
      && metrics.horizontalAccuracy95Ft <= thresholds.horizontalAccuracy95Ft,
  },
  sourceVerticalAccuracy: {
    thresholdFt: thresholds.verticalAccuracy95Ft,
    reportedFt: verticalAccuracyAvailable ? verticalAccuracy95Ft : null,
    metricKind: verticalAccuracyMetricKind,
    computedFtFromReportedMetres: computedVerticalAccuracy95Ft,
    metricAvailable: verticalAccuracyAvailable,
    pass: verticalAccuracyAvailable
      && verticalAccuracy95Ft <= thresholds.verticalAccuracy95Ft,
    scope: 'projectwide non-vegetated independent checkpoints, not stadium-local roof control',
  },
};

const blockers = [
  'STADIUM_LOCAL_ACQUISITION_TIME_NOT_VERIFIED',
  'STADIUM_LOCAL_REGISTRATION_NOT_PASSED',
  'ORIENTATION_ACCURACY_NOT_PASSED',
  'ROW_AND_OBSTRUCTION_GEOMETRY_NOT_VALIDATED',
  'SOURCE_CURRENCY_NOT_VERIFIED',
  'SHADOW_HOLDOUT_NOT_PASSED',
];
if (!gates.sourceHorizontalAccuracy.metricAvailable) {
  blockers.unshift('SOURCE_HORIZONTAL_ACCURACY_95_NOT_ESTABLISHED');
} else if (!gates.sourceHorizontalAccuracy.pass) {
  blockers.unshift('SOURCE_HORIZONTAL_ACCURACY_EXCEEDS_1FT');
}
if (!gates.sourceVerticalAccuracy.metricAvailable) {
  blockers.unshift('SOURCE_VERTICAL_ACCURACY_95_NOT_ESTABLISHED');
} else if (!gates.sourceVerticalAccuracy.pass) {
  blockers.unshift('SOURCE_VERTICAL_ACCURACY_EXCEEDS_1FT');
}

const fingerprintInput = {
  sourceReportAcquisitionArtifactVersion: manifest.artifactVersion,
  stadiumId: decision.stadiumId,
  projectName: decision.projectName,
  reviewedDocuments: verifiedDocuments.map((document) => ({
    key: document.key,
    sha256: document.sha256,
  })),
  reviewedOn: decision.reviewedOn,
  reviewer: decision.reviewer,
  reportFindings: decision.reportFindings,
  metrics,
  gates,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'usgs-lidar-project-report-review',
  artifactVersion: `sha256:${fingerprint(fingerprintInput)}`,
  sourceReportAcquisitionArtifactVersion: manifest.artifactVersion,
  stadiumId: decision.stadiumId,
  projectName: decision.projectName,
  reviewedOn: decision.reviewedOn,
  reviewer: decision.reviewer,
  reviewedDocuments: verifiedDocuments,
  reportFindings: decision.reportFindings,
  metrics: {
    ...metrics,
    horizontalAccuracy95ComputedFt: computedHorizontalAccuracy95Ft,
    verticalAccuracy95ComputedFt: computedVerticalAccuracy95Ft,
  },
  gates,
  limitations: decision.limitations ?? [],
  publication: {
    eligible: false,
    blockers,
  },
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  gates: artifact.gates,
  publication: artifact.publication,
}, null, 2));

#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

async function acquire(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  const allowedHosts = new Set(['www.uni-systems.com', 'www.walterpmoore.com']);
  if (requestedUrl.protocol !== 'https:' || !allowedHosts.has(requestedUrl.hostname)) {
    throw new Error(`Unapproved roof-mechanization source URL: ${source.url}`);
  }
  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    headers: {
      accept: 'text/html,*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
        + 'mlb-sun-tracker-marlins-roof-mechanization-audit/1.0',
    },
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !allowedHosts.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected roof-mechanization redirect: ${response.url}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(outputDirectory, source.fileName);
  await writeFile(outputPath, bytes);
  return {
    key: source.key,
    sourceAuthority: source.sourceAuthority,
    relationshipToProject: source.relationshipToProject,
    mediaType: 'text/html',
    localPath: path.relative(process.cwd(), outputPath),
    requestedUrl: source.url,
    resolvedUrl: response.url,
    response: {
      status: response.status,
      contentType: response.headers.get('content-type') ?? '',
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
    },
    byteLength: bytes.length,
    sha256: sha256(bytes),
  };
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-roof-mechanization-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    key: 'uni-systems-marlins-retractable-roof-current',
    sourceAuthority: 'Uni-Systems',
    relationshipToProject: 'Current first-party page from the retractable-roof mechanization designer, fabricator, and installer',
    fileName: 'uni-systems-marlins-retractable-roof.html',
    url: option(
      'uni-systems-url',
      'https://www.uni-systems.com/projects/retractable-roof-marlins-ballpark',
    ),
  },
  {
    key: 'walter-p-moore-loandepot-retractable-roof-current',
    sourceAuthority: 'Walter P Moore',
    relationshipToProject: 'Current first-party page from the structural and construction engineer identifying the mechanization consultant',
    fileName: 'walter-p-moore-loandepot-retractable-roof.html',
    url: option(
      'walter-p-moore-url',
      'https://www.walterpmoore.com/projects/loandepot-park-retractable-roof',
    ),
  },
];

const records = [];
for (const source of sources) records.push(await acquire(source, outputDirectory));

const stable = {
  analysisVersion: 'marlins-roof-mechanization-source-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  sources: records,
  inputs: Object.fromEntries(records.map((record) => [
    record.key,
    { path: record.localPath, sha256: record.sha256 },
  ])),
  boundary: {
    currentUniSystemsProjectPagePreserved: true,
    currentWalterPMooreProjectPagePreserved: true,
    sourceContentReviewRequired: true,
    currentMetricMechanizationGeometryEstablished: false,
    currentSensorCalibrationEstablished: false,
    gameSpecificPanelPositionHistoryEstablished: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_CONTENT_REVIEW_REQUIRED',
      'CURRENT_METRIC_MECHANIZATION_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_SENSOR_CALIBRATION_NOT_ESTABLISHED',
      'GAME_SPECIFIC_PANEL_POSITION_HISTORY_NOT_ESTABLISHED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-roof-mechanization-source-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  sources: records,
  boundary: artifact.boundary,
  publication: artifact.publication,
}, null, 2));

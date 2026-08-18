#!/usr/bin/env node

/**
 * Acquire checksum-locked public viewer source files from a Sportsdigita
 * viewer that is linked by an official MLB page. The files remain local
 * research inputs because public access does not establish redistribution
 * rights.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

function argument(name, fallback = undefined) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function safeFilename(value) {
  return value.replace(/[^A-Za-z0-9._-]+/g, '_');
}

const officialInspectionPath = path.resolve(argument(
  'official-inspection',
  'tmp/lidar/rockies-current-official-seat-viewer-inspection/manifest.json',
));
const outputDirectory = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-current-official-seat-viewer-sources',
));
const sourcePaths = [
  'app/js/src/views/map.js',
  'app/js/src/views/mapandviewer.js',
  'app/js/src/views/mapwithinfo.js',
  'app/js/src/views/viewer.js',
  'app/js/src/views/krpano.js',
  'app/js/src/views/addseatform.js',
  'app/js/src/views/infobox.js',
  'app/js/src/views/moreinfo.js',
  'app/js/lib/krpano/digitarpano.js',
  'app/js/templates/mapandviewer.html',
  'app/js/templates/viewer.html',
  'app/js/templates/addseatform.html',
  'app/js/templates/infobox.html',
  'venue/rockies/js/main.js',
  'venue/rockies/map/seats.json',
  'venue/rockies/pano.xml',
  'venue/rockies/images/map-bg.png',
  'venue/rockies/images/map-bg-suites.png',
  'venue/rockies/images/map-bg-club.png',
];

const officialInspectionBytes = await readFile(officialInspectionPath);
const officialInspection = JSON.parse(officialInspectionBytes.toString('utf8'));
if (officialInspection?.artifactKind !== 'official-mlb-seat-viewer-discovery') {
  throw new Error('Official inspection is not an official-mlb-seat-viewer-discovery artifact');
}
const linkedViewerUrl = officialInspection.linkedViewerUrls.find((url) => {
  try {
    return new URL(url).hostname === 'rockies.sportsdigita.com';
  } catch {
    return false;
  }
});
if (!linkedViewerUrl) {
  throw new Error('Official inspection does not establish the Rockies Sportsdigita viewer link');
}
const sourceRoot = new URL('/', linkedViewerUrl);
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
try {
  const page = await browser.newPage();
  const officialResponse = await page.goto(officialInspection.sourceUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  if (!officialResponse?.ok()) {
    throw new Error(`Official MLB page failed with HTTP ${officialResponse?.status()}`);
  }
  const records = [];
  for (const sourcePath of sourcePaths) {
    const url = new URL(sourcePath, sourceRoot).toString();
    const response = await page.request.get(url);
    if (!response.ok()) throw new Error(`${url} failed with HTTP ${response.status()}`);
    const bytes = await response.body();
    const localPath = path.join(outputDirectory, safeFilename(sourcePath));
    await writeFile(localPath, bytes);
    const text = bytes.toString('utf8');
    const rowAvailabilityMatches = Array.from(text.matchAll(
      /.{0,120}(?:row_start_na|row_end_na).{0,220}/g,
    )).map((match) => match[0].replace(/\s+/g, ' ').trim()).slice(0, 50);
    records.push({
      sourcePath,
      url,
      localPath,
      byteLength: bytes.length,
      sha256: sha256(bytes),
      contentType: response.headers()['content-type'] ?? null,
      lastModified: response.headers()['last-modified'] ?? null,
      etag: response.headers().etag ?? null,
      rowAvailabilityMatches,
    });
  }
  const stable = {
    officialInspection: {
      path: officialInspectionPath,
      sha256: sha256(officialInspectionBytes),
      artifactVersion: officialInspection.artifactVersion,
      sourceUrl: officialInspection.sourceUrl,
      linkedViewerUrl,
    },
    sourceRoot: sourceRoot.toString(),
    sources: records,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'club-linked-viewer-source-research-input',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    acquiredOn: new Date().toISOString(),
    ...stable,
    licenseAssessment: {
      publicAccessConfirmed: true,
      redistributionTermsEstablished: false,
      permittedUseInThisArtifact: 'local-research-input-only',
    },
    conclusion: {
      softwareBehaviorMayBeInspected: true,
      metricGeometrySupported: false,
      note: 'Viewer behavior and metadata semantics are not surveyed venue geometry.',
    },
    publication: {
      eligible: false,
      blockers: [
        'VIEWER_SOURCE_IS_BEHAVIORAL_EVIDENCE_ONLY',
        'CAMERA_POSITION_NOT_SURVEYED',
        'METRIC_ROW_GEOMETRY_NOT_ESTABLISHED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    manifestPath,
    artifactVersion: artifact.artifactVersion,
    sourceCount: records.length,
    rowAvailabilitySourceCount: records.filter(
      (record) => record.rowAvailabilityMatches.length > 0,
    ).length,
    publicationEligible: false,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}

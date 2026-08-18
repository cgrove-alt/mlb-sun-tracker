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
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

const allowedHosts = new Set([
  'www.mlb.com',
  'ballpark.org',
  'bpfd-prod-backend.parallelpublicworks.com',
]);

async function fetchSource(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  if (requestedUrl.protocol !== 'https:' || !allowedHosts.has(requestedUrl.hostname)) {
    throw new Error(`Unapproved source URL: ${source.url}`);
  }
  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    headers: {
      accept: source.mediaType === 'application/pdf'
        ? 'application/pdf,*/*'
        : 'text/html,*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
        + 'mlb-sun-tracker-current-geometry-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !allowedHosts.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected source redirect: ${response.url}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type');
  if (source.mediaType === 'application/pdf' && !/application\/pdf/i.test(contentType ?? '')) {
    throw new Error(`Expected PDF for ${source.key}, received ${contentType}`);
  }
  if (source.mediaType === 'text/html' && !/text\/html/i.test(contentType ?? '')) {
    throw new Error(`Expected HTML for ${source.key}, received ${contentType}`);
  }
  const outputPath = path.join(outputDirectory, source.fileName);
  await writeFile(outputPath, bytes);
  return {
    key: source.key,
    sourceAuthority: source.sourceAuthority,
    mediaType: source.mediaType,
    localPath: path.relative(process.cwd(), outputPath),
    requestedUrl: source.url,
    resolvedUrl: response.url,
    response: {
      status: response.status,
      contentType,
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
    byteLength: bytes.length,
    sha256: sha256(bytes),
  };
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/mariners-current-geometry-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    key: 'mariners-premium-amenities-2022',
    sourceAuthority: 'Seattle Mariners',
    mediaType: 'text/html',
    fileName: 'mariners-premium-amenities-2022.html',
    url: option(
      'premium-amenities-url',
      'https://www.mlb.com/mariners/press-release/press-release-mariners-announce-new-premium-fan-amenities-coming-to-t-mobile-par',
    ),
  },
  {
    key: 'mariners-whats-new-2023',
    sourceAuthority: 'Seattle Mariners',
    mediaType: 'text/html',
    fileName: 'mariners-whats-new-2023.html',
    url: option(
      'whats-new-url',
      'https://www.mlb.com/amp/press-release/press-release-what-s-new-at-t-mobile-park.html',
    ),
  },
  {
    key: 'mariners-diamond-club-unveiled-2023',
    sourceAuthority: 'Seattle Mariners',
    mediaType: 'text/html',
    fileName: 'mariners-diamond-club-unveiled-2023.html',
    url: option(
      'diamond-club-unveiled-url',
      'https://www.mlb.com/mariners/press-release/press-release-muckleshoot-diamond-club-unveiled-at-t-mobile-park',
    ),
  },
  {
    key: 'mariners-premium-seating-current',
    sourceAuthority: 'Seattle Mariners',
    mediaType: 'text/html',
    fileName: 'mariners-premium-seating-current.html',
    url: option(
      'premium-seating-current-url',
      'https://www.mlb.com/mariners/tickets/premium',
    ),
  },
  {
    key: 'mariners-fire-tv-2026',
    sourceAuthority: 'Seattle Mariners',
    mediaType: 'text/html',
    fileName: 'mariners-fire-tv-2026.html',
    url: option(
      'fire-tv-url',
      'https://www.mlb.com/mariners/press-release/mariners-amazon-team-up-to-bring-world-s-largest-fire-tv-to-t-mobile-park',
    ),
  },
  {
    key: 'pfd-february-2026-board-packet',
    sourceAuthority: 'Washington State Ballpark Public Facilities District',
    mediaType: 'application/pdf',
    fileName: 'pfd-february-2026-board-packet.pdf',
    url: option(
      'pfd-february-packet-url',
      'https://bpfd-prod-backend.parallelpublicworks.com/media/901',
    ),
  },
  {
    key: 'pfd-june-2026-provisional-plan-review',
    sourceAuthority: 'Washington State Ballpark Public Facilities District',
    mediaType: 'application/pdf',
    fileName: 'pfd-june-2026-provisional-plan-review.pdf',
    url: option(
      'pfd-june-plan-url',
      'https://bpfd-prod-backend.parallelpublicworks.com/media/924',
    ),
  },
];

const records = await Promise.all(sources.map((source) => fetchSource(source, outputDirectory)));
const stable = {
  analysisVersion: 'mariners-current-geometry-source-acquisition-v1',
  stadiumId: 'mariners',
  sources: records,
  boundary: {
    officialSourcesOnly: true,
    establishesCurrentChangeInventory: false,
    establishesMetricGeometry: false,
    establishesAsBuiltGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_DOCUMENTS_REQUIRE_GEOMETRY_REVIEW',
      'METRIC_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'mariners-current-geometry-source-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  sourceCount: records.length,
  sources: records.map(({ key, byteLength, sha256: digest }) => ({
    key,
    byteLength,
    sha256: digest,
  })),
}, null, 2));

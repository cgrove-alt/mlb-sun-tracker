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

const allowedHosts = new Set([
  'www.mlb.com',
  'www.isfauthority.com',
  'clearinghouse.isgs.illinois.edu',
]);

const acceptedContentTypes = {
  'application/pdf': /application\/pdf/i,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    /application\/(?:vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|octet-stream)/i,
  'text/html': /text\/html/i,
};

async function fetchSource(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  if (requestedUrl.protocol !== 'https:' || !allowedHosts.has(requestedUrl.hostname)) {
    throw new Error(`Unapproved source URL: ${source.url}`);
  }
  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    headers: {
      accept: `${source.mediaType},*/*`,
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
        + 'mlb-sun-tracker-whitesox-current-geometry-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !allowedHosts.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected source redirect: ${response.url}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type');
  const expected = acceptedContentTypes[source.mediaType];
  if (!expected?.test(contentType ?? '')) {
    throw new Error(`Expected ${source.mediaType} for ${source.key}, received ${contentType}`);
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
  'tmp/lidar/whitesox-current-geometry-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    key: 'whitesox-rate-field-rebrand-2024',
    sourceAuthority: 'Chicago White Sox and MLB',
    mediaType: 'text/html',
    fileName: 'whitesox-rate-field-rebrand-2024.html',
    url: option(
      'rebrand-url',
      'https://www.mlb.com/news/rate-and-white-sox-announce-rebrand-of-stadium-now-rate-field',
    ),
  },
  {
    key: 'whitesox-fanatics-flagship-store-2025',
    sourceAuthority: 'Chicago White Sox and MLB',
    mediaType: 'text/html',
    fileName: 'whitesox-fanatics-flagship-store-2025.html',
    url: option(
      'flagship-store-url',
      'https://www.mlb.com/whitesox/press-release/press-release-white-sox-and-fanatics-announce-long-term-omnichannel-retail-partnership',
    ),
  },
  {
    key: 'whitesox-rate-field-guide-2026',
    sourceAuthority: 'Chicago White Sox and MLB',
    mediaType: 'text/html',
    fileName: 'whitesox-rate-field-guide-2026.html',
    url: option(
      'ballpark-guide-url',
      'https://www.mlb.com/news/featured/rate-field-guide-capacity-seating-chart-parking-and-more',
    ),
  },
  {
    key: 'isfa-about-current',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'text/html',
    fileName: 'isfa-about-current.html',
    url: option('isfa-about-url', 'https://www.isfauthority.com/about-us/'),
  },
  {
    key: 'isfa-board-meetings-current',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'text/html',
    fileName: 'isfa-board-meetings-current.html',
    url: option(
      'isfa-board-meetings-url',
      'https://www.isfauthority.com/board-committee-meetings/',
    ),
  },
  {
    key: 'isfa-procurement-current',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'text/html',
    fileName: 'isfa-procurement-current.html',
    url: option(
      'isfa-procurement-url',
      'https://www.isfauthority.com/procurement-process/',
    ),
  },
  {
    key: 'isfa-foia-current',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'text/html',
    fileName: 'isfa-foia-current.html',
    url: option('isfa-foia-url', 'https://www.isfauthority.com/foia-requests/'),
  },
  {
    key: 'isgs-cook-county-2022-lidar-dataset',
    sourceAuthority: 'Illinois State Geological Survey',
    mediaType: 'text/html',
    fileName: 'isgs-cook-county-2022-lidar-dataset.html',
    url: option(
      'cook-lidar-dataset-url',
      'https://clearinghouse.isgs.illinois.edu/node/1879',
    ),
  },
  {
    key: 'isfa-september-2025-minutes',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/pdf',
    fileName: 'isfa-september-2025-minutes.pdf',
    url: option(
      'isfa-september-2025-minutes-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/02/Minutes.pdf',
    ),
  },
  {
    key: 'isfa-february-2026-agenda',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/pdf',
    fileName: 'isfa-february-2026-agenda.pdf',
    url: option(
      'isfa-february-2026-agenda-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/02/Agenda.pdf',
    ),
  },
  {
    key: 'isfa-february-2026-minutes',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/pdf',
    fileName: 'isfa-february-2026-minutes.pdf',
    url: option(
      'isfa-february-2026-minutes-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/05/Minutes.pdf',
    ),
  },
  {
    key: 'isfa-may-2026-agenda',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/pdf',
    fileName: 'isfa-may-2026-agenda.pdf',
    url: option(
      'isfa-may-2026-agenda-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/05/Agenda.pdf',
    ),
  },
  {
    key: 'isfa-field-level-led-rfp-2026',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/pdf',
    fileName: 'isfa-field-level-led-rfp-2026.pdf',
    url: option(
      'isfa-field-level-led-rfp-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/08/RFP-Backstop-and-Dugout-LED-Display-08.07.26.pdf',
    ),
  },
  {
    key: 'isfa-field-level-led-bid-form-2026',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileName: 'isfa-field-level-led-bid-form-2026.xlsx',
    url: option(
      'isfa-field-level-led-bid-form-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/08/Backstop-and-Dugout-LED-Display-Bid-Form-08.07.26.xlsx',
    ),
  },
  {
    key: 'isfa-field-level-led-specifications-2026',
    sourceAuthority: 'Illinois Sports Facilities Authority',
    mediaType: 'application/pdf',
    fileName: 'isfa-field-level-led-specifications-2026.pdf',
    url: option(
      'isfa-field-level-led-specifications-url',
      'https://www.isfauthority.com/wp-content/uploads/2026/08/Backstop-and-Dugout-LED-Display-Technical-Specifications-07.31.26.pdf',
    ),
  },
];

const records = await Promise.all(
  sources.map((source) => fetchSource(source, outputDirectory)),
);
const stable = {
  analysisVersion: 'whitesox-current-geometry-source-acquisition-v1',
  stadiumId: 'whitesox',
  acquiredOn: '2026-08-10',
  sources: records,
  boundary: {
    officialSourcesOnly: true,
    establishesCurrentChangeInventory: false,
    establishesMetricGeometry: false,
    establishesAsBuiltGeometry: false,
    establishesInstalledStatusOfFutureWork: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_DOCUMENTS_REQUIRE_GEOMETRY_REVIEW',
      'METRIC_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'FUTURE_FIELD_LEVEL_LED_AS_BUILT_GEOMETRY_NOT_AVAILABLE',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'whitesox-current-geometry-source-acquisition',
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

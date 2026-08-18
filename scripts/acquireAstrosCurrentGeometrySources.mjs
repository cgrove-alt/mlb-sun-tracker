#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
  'houstonsports.org',
  'www.houstonsports.org',
  'www.mlb.com',
  'www.walterpmoore.com',
  'cdn.tnris.org',
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
  'tmp/lidar/astros-current-geometry-sources-2026',
));
const mediaIndexPath = path.resolve(option(
  'media-index',
  'tmp/lidar/astros-hchsa-official-media-index-2024-2026.json',
));
await mkdir(outputDirectory, { recursive: true });

const mediaIndexBytes = await readFile(mediaIndexPath);
const mediaIndex = JSON.parse(mediaIndexBytes);
if (mediaIndex.artifactKind !== 'hchsa-official-media-index') {
  throw new Error('HCHSA media index has an unsupported artifact kind');
}
if (mediaIndex.stadiumId !== 'astros') throw new Error('HCHSA media index stadium mismatch');

const sources = [
  {
    key: 'astros-samsung-displays-2022',
    sourceAuthority: 'Houston Astros and Samsung Electronics America',
    mediaType: 'text/html',
    fileName: 'astros-samsung-displays-2022.html',
    url: option(
      'samsung-url',
      'https://www.mlb.com/press-release/press-release-astros-partner-with-samsung-to-elevate-minute-maid-park-with-state',
    ),
  },
  {
    key: 'astros-daikin-naming-2024',
    sourceAuthority: 'Houston Astros',
    mediaType: 'text/html',
    fileName: 'astros-daikin-naming-2024.html',
    url: option(
      'naming-url',
      'https://www.mlb.com/astros/press-release/release-astros-announce-ballpark-naming-rights-partnership-with-daikin-comfort-technologies',
    ),
  },
  {
    key: 'astros-train-refurbishment-2025',
    sourceAuthority: 'Houston Astros',
    mediaType: 'text/html',
    fileName: 'astros-train-refurbishment-2025.html',
    url: option(
      'train-url',
      'https://www.mlb.com/astros/press-release/press-release-popular-astros-train-has-new-look-new-sponsor-in-2025',
    ),
  },
  {
    key: 'hchsa-public-information-current',
    sourceAuthority: 'Harris County-Houston Sports Authority',
    mediaType: 'text/html',
    fileName: 'hchsa-public-information-current.html',
    url: option('public-information-url', 'https://houstonsports.org/public-information/'),
  },
  {
    key: 'hchsa-pia-current',
    sourceAuthority: 'Harris County-Houston Sports Authority',
    mediaType: 'text/html',
    fileName: 'hchsa-pia-current.html',
    url: option(
      'pia-url',
      'https://houstonsports.org/texas-public-information-act-requests/',
    ),
  },
  {
    key: 'hchsa-project-agreement-astros-1998',
    sourceAuthority: 'Harris County-Houston Sports Authority',
    mediaType: 'application/pdf',
    fileName: 'hchsa-project-agreement-astros-1998.pdf',
    url: option(
      'project-agreement-url',
      'https://houstonsports.org/wp-content/uploads/Project_Agreement_Astros.pdf',
    ),
  },
  {
    key: 'hchsa-stadium-lease-astros-1998',
    sourceAuthority: 'Harris County-Houston Sports Authority',
    mediaType: 'application/pdf',
    fileName: 'hchsa-stadium-lease-astros-1998.pdf',
    url: option(
      'stadium-lease-url',
      'https://houstonsports.org/wp-content/uploads/Stadium_Lease_Agreement_Astros.pdf',
    ),
  },
  {
    key: 'hchsa-first-omnibus-amendment-2018',
    sourceAuthority: 'Harris County-Houston Sports Authority',
    mediaType: 'application/pdf',
    fileName: 'hchsa-first-omnibus-amendment-2018.pdf',
    url: option(
      'omnibus-amendment-url',
      'https://houstonsports.org/wp-content/uploads/First_Omnibus_Amendment_-_MMP_Principal_Proj_Docs_-_Executed_as_of_20180401.pdf',
    ),
  },
  {
    key: 'walter-p-moore-daikin-park-current',
    sourceAuthority: 'Walter P Moore, structural and civil engineer of record',
    mediaType: 'text/html',
    fileName: 'walter-p-moore-daikin-park-current.html',
    url: option('engineer-url', 'https://www.walterpmoore.com/projects/daikin-park'),
  },
  {
    key: 'tnris-state-orthoimagery-statement-of-work-current',
    sourceAuthority: 'Texas Geographic Information Office',
    mediaType: 'application/pdf',
    fileName: 'tnris-state-orthoimagery-statement-of-work-current.pdf',
    url: option(
      'imagery-sow-url',
      'https://cdn.tnris.org/documents/tx_orthoimagery_sow_v9.pdf',
    ),
  },
];

const records = await Promise.all(sources.map((source) => fetchSource(source, outputDirectory)));
const stable = {
  analysisVersion: 'astros-current-geometry-source-acquisition-v1',
  stadiumId: 'astros',
  inputs: {
    mediaIndex: {
      path: path.relative(process.cwd(), mediaIndexPath),
      sha256: sha256(mediaIndexBytes),
      artifactVersion: mediaIndex.artifactVersion,
      serverReportedMediaCount: mediaIndex.source?.serverReportedMediaCount ?? null,
      accessibleMediaCount: mediaIndex.source?.accessibleMediaCount ?? null,
    },
  },
  sources: records,
  boundary: {
    officialOrProjectTeamSourcesOnly: true,
    establishesCurrentChangeInventory: false,
    establishesMetricGeometry: false,
    establishesAsBuiltGeometry: false,
    establishesEveryRoofPosition: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_DOCUMENTS_REQUIRE_GEOMETRY_REVIEW',
      'CURRENT_METRIC_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'EVERY_OPERATIONAL_ROOF_POSITION_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'astros-current-geometry-source-acquisition',
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

#!/usr/bin/env node

/**
 * Acquire exact primary-source report objects for a previously acquired USGS
 * LiDAR project. Every requested key must be present in the live official S3
 * listing. Downloads are streamed, byte checked against that listing, and
 * SHA-256 locked in a manifest.
 *
 * Usage:
 *   node scripts/acquireUsgsLidarProjectReports.mjs \
 *     --project-manifest=tmp/lidar/astros-usgs-tx-houston-b24/manifest.json \
 *     --listing-prefix=StagedProducts/Elevation/metadata/TX_Houston_B24/TX_Houston_3_B24/ \
 *     --required-key=reports/USGS_TX_Houston_3_B24_Summary_Report.pdf \
 *     --required-key=reports/USGS_TX_Houston_3_B24_FINAL_LPC_Report.txt \
 *     --output=tmp/lidar/astros-usgs-tx-houston-b24/reports
 */

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname as pathDirname, join, resolve } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const rawArguments = process.argv.slice(2);
const scalarArguments = Object.fromEntries(rawArguments.map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const projectManifestPath = typeof scalarArguments['project-manifest'] === 'string'
  ? resolve(scalarArguments['project-manifest'])
  : null;
const listingPrefix = typeof scalarArguments['listing-prefix'] === 'string'
  ? scalarArguments['listing-prefix']
  : null;
const outputDirectory = typeof scalarArguments.output === 'string'
  ? resolve(scalarArguments.output)
  : null;
const listOnly = scalarArguments['list-only'] === true;
const listAll = scalarArguments['list-all'] === true;
const listMatchValue = typeof scalarArguments['list-match'] === 'string'
  ? scalarArguments['list-match']
  : null;
let listMatch = null;
if (listMatchValue) {
  try {
    listMatch = new RegExp(listMatchValue, 'i');
  } catch (error) {
    throw new Error(`Invalid --list-match regular expression: ${error.message}`);
  }
}
const requiredRelativeKeys = rawArguments
  .filter((argument) => argument.startsWith('--required-key='))
  .map((argument) => argument.slice('--required-key='.length));

if (
  !projectManifestPath
  || !listingPrefix
  || !outputDirectory
  || (!listOnly && requiredRelativeKeys.length === 0)
) {
  console.error(
    'Required: --project-manifest=PATH --listing-prefix=PREFIX '
    + '--required-key=RELATIVE_KEY (repeat) --output=DIRECTORY',
  );
  process.exit(2);
}
if (
  listingPrefix.startsWith('/')
  || !listingPrefix.endsWith('/')
  || listingPrefix.includes('..')
  || requiredRelativeKeys.some((key) => key.startsWith('/') || key.includes('..'))
) {
  throw new Error('Listing prefix and required keys must be safe relative object paths');
}
if (new Set(requiredRelativeKeys).size !== requiredRelativeKeys.length) {
  throw new Error('Duplicate --required-key arguments are not allowed');
}

const projectManifest = JSON.parse(await readFile(projectManifestPath, 'utf8'));
if (projectManifest?.artifactKind !== 'usgs-lidar-project-acquisition') {
  throw new Error('Input is not a usgs-lidar-project-acquisition artifact');
}

const officialHostname = 'prd-tnm.s3.amazonaws.com';
const listingEndpoint = `https://${officialHostname}/`;

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function extractXmlValue(markup, name) {
  const match = markup.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`));
  return match ? decodeXml(match[1]) : null;
}

async function fetchListingPage(continuationToken = null) {
  const url = new URL(listingEndpoint);
  url.searchParams.set('list-type', '2');
  url.searchParams.set('prefix', listingPrefix);
  if (continuationToken) url.searchParams.set('continuation-token', continuationToken);
  const response = await fetch(url, {
    redirect: 'error',
    headers: {
      Accept: 'application/xml',
      'User-Agent': 'theshadium-usgs-lidar-report-acquisition/1.0',
    },
  });
  if (!response.ok) throw new Error(`USGS S3 listing failed with HTTP ${response.status}`);
  if (new URL(response.url).hostname !== officialHostname) {
    throw new Error(`Unexpected listing host: ${response.url}`);
  }
  const markup = await response.text();
  const objects = [...markup.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)].map((match) => {
    const key = extractXmlValue(match[1], 'Key');
    const size = Number(extractXmlValue(match[1], 'Size'));
    const etag = extractXmlValue(match[1], 'ETag')?.replaceAll('"', '') ?? null;
    const lastModified = extractXmlValue(match[1], 'LastModified');
    if (!key || !Number.isSafeInteger(size) || size < 0) {
      throw new Error('Malformed object in official USGS S3 listing');
    }
    return { key, size, etag, lastModified };
  });
  const isTruncated = extractXmlValue(markup, 'IsTruncated') === 'true';
  const nextContinuationToken = extractXmlValue(markup, 'NextContinuationToken');
  if (isTruncated && !nextContinuationToken) {
    throw new Error('USGS listing is truncated but has no continuation token');
  }
  return {
    requestedUrl: url.toString(),
    responseDate: response.headers.get('date'),
    objects,
    nextContinuationToken: isTruncated ? nextContinuationToken : null,
  };
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

async function downloadObject(object, destination) {
  const partialPath = `${destination}.partial`;
  await rm(partialPath, { force: true });
  const encodedPath = object.key.split('/').map(encodeURIComponent).join('/');
  const requestedUrl = `https://${officialHostname}/${encodedPath}`;
  const response = await fetch(requestedUrl, {
    redirect: 'error',
    headers: {
      Accept: '*/*',
      'User-Agent': 'theshadium-usgs-lidar-report-acquisition/1.0',
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`USGS object download failed with HTTP ${response.status}: ${requestedUrl}`);
  }
  if (new URL(response.url).hostname !== officialHostname) {
    throw new Error(`Unexpected object host: ${response.url}`);
  }
  const digest = createHash('sha256');
  let byteLength = 0;
  const hashingStream = new Transform({
    transform(chunk, _encoding, callback) {
      digest.update(chunk);
      byteLength += chunk.length;
      callback(null, chunk);
    },
  });
  try {
    await pipeline(
      Readable.fromWeb(response.body),
      hashingStream,
      createWriteStream(partialPath, { flags: 'wx' }),
    );
    if (byteLength !== object.size) {
      throw new Error(
        `Byte mismatch for ${object.key}: expected ${object.size}, received ${byteLength}`,
      );
    }
    await rename(partialPath, destination);
  } catch (error) {
    await rm(partialPath, { force: true });
    throw error;
  }
  return {
    key: object.key,
    requestedUrl,
    path: destination,
    listedByteLength: object.size,
    byteLength,
    sha256: digest.digest('hex'),
    listedEtag: object.etag,
    listedLastModified: object.lastModified,
    responseHeaders: {
      date: response.headers.get('date'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag')?.replaceAll('"', '') ?? null,
      contentType: response.headers.get('content-type'),
    },
    reusedFromVerifiedManifest: false,
  };
}

await mkdir(outputDirectory, { recursive: true });
const outputManifestPath = join(outputDirectory, 'manifest.json');
let previousManifest = null;
try {
  previousManifest = JSON.parse(await readFile(outputManifestPath, 'utf8'));
} catch {
  previousManifest = null;
}

const listingPages = [];
const listedObjects = new Map();
let continuationToken = null;
do {
  const page = await fetchListingPage(continuationToken);
  listingPages.push({
    requestedUrl: page.requestedUrl,
    responseDate: page.responseDate,
    objectCount: page.objects.length,
  });
  for (const object of page.objects) listedObjects.set(object.key, object);
  continuationToken = page.nextContinuationToken;
} while (continuationToken);

const requiredFullKeys = requiredRelativeKeys.map((key) => `${listingPrefix}${key}`);
const requiredBasenameCounts = requiredFullKeys.reduce((counts, key) => {
  const filename = basename(key);
  counts.set(filename, (counts.get(filename) ?? 0) + 1);
  return counts;
}, new Map());
function destinationFilename(key) {
  const filename = basename(key);
  if (requiredBasenameCounts.get(filename) === 1) return filename;
  const parentName = basename(pathDirname(key));
  return `${parentName}__${filename}`;
}
if (listOnly) {
  console.log(JSON.stringify({
    stadiumId: projectManifest.stadiumId,
    projectName: projectManifest.projectName,
    listingPrefix,
    listingPages,
    reportObjects: [...listedObjects.values()]
      .filter((object) => listAll || object.key.startsWith(`${listingPrefix}reports/`))
      .filter((object) => !listMatch || listMatch.test(object.key))
      .sort((left, right) => left.key.localeCompare(right.key)),
  }, null, 2));
  process.exit(0);
}
const missingKeys = requiredFullKeys.filter((key) => !listedObjects.has(key));
if (missingKeys.length > 0) {
  throw new Error(`Required USGS report keys not found in live listing: ${missingKeys.join(', ')}`);
}

const reports = [];
for (const key of requiredFullKeys) {
  const object = listedObjects.get(key);
  const destination = join(outputDirectory, destinationFilename(key));
  const previous = previousManifest?.reports?.find((report) =>
    report.key === key && report.path === destination);
  if (previous) {
    const details = await stat(destination);
    if (
      details.size === object.size
      && previous.listedByteLength === object.size
      && await sha256(destination) === previous.sha256
    ) {
      reports.push({
        ...previous,
        listedEtag: object.etag,
        listedLastModified: object.lastModified,
        reusedFromVerifiedManifest: true,
      });
      continue;
    }
  }
  reports.push(await downloadObject(object, destination));
}

const fingerprintInput = {
  sourceProjectArtifactVersion: projectManifest.artifactVersion,
  listingPrefix,
  reports: reports.map((report) => ({
    key: report.key,
    byteLength: report.byteLength,
    sha256: report.sha256,
  })),
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'usgs-lidar-project-report-acquisition',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`,
  sourceProjectArtifactVersion: projectManifest.artifactVersion,
  stadiumId: projectManifest.stadiumId,
  projectName: projectManifest.projectName,
  acquiredOn: new Date().toISOString(),
  listing: {
    endpoint: listingEndpoint,
    prefix: listingPrefix,
    pages: listingPages,
    listedObjectCount: listedObjects.size,
  },
  reports,
  summary: {
    reportCount: reports.length,
    totalByteLength: reports.reduce((sum, report) => sum + report.byteLength, 0),
  },
  publication: {
    eligible: false,
    blockers: [
      'REPORTS_NOT_REVIEWED',
      'SEMANTIC_GEOMETRY_NOT_EXTRACTED',
      'SOURCE_CURRENCY_NOT_VERIFIED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
await writeFile(outputManifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath: outputManifestPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  projectName: artifact.projectName,
  summary: artifact.summary,
  publication: artifact.publication,
}, null, 2));

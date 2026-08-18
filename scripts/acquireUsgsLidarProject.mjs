#!/usr/bin/env node

/**
 * Acquire every tile from one complete-footprint USGS project selected by a
 * checksum-locked remote source audit. Files are streamed, byte checked, and
 * SHA-256 locked. The corresponding ScienceBase metadata pages are retained.
 *
 * Usage:
 *   node scripts/acquireUsgsLidarProject.mjs \
 *     --audit=tmp/lidar/mlb-2026-08-08-remote-lidar-source-audit.json \
 *     --stadium=astros \
 *     --project=TX_Houston_B24 \
 *     --output=tmp/lidar/astros-usgs-tx-houston-b24
 */

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const stadiumId = typeof args.stadium === 'string' ? args.stadium : null;
const projectName = typeof args.project === 'string' ? args.project : null;
const outputDirectory = typeof args.output === 'string' ? resolve(args.output) : null;
const allowPartialCoverage = args['allow-partial'] === true;
const allowCatalogSizeMismatch = args['allow-catalog-size-mismatch'] === true;
if (!auditPath || !stadiumId || !projectName || !outputDirectory) {
  console.error('Required: --audit=PATH --stadium=ID --project=NAME --output=DIRECTORY');
  process.exit(2);
}

const audit = JSON.parse(await readFile(auditPath, 'utf8'));
if (audit?.artifactKind !== 'mlb-remote-lidar-source-audit') {
  throw new Error('Input is not an mlb-remote-lidar-source-audit artifact');
}
const stadium = audit.results.find((result) => result.stadiumId === stadiumId);
if (!stadium) throw new Error(`Audit does not contain stadium ${stadiumId}`);
const projectCoverage = stadium.coverage?.projectFootprintCoverage?.find((project) =>
  project.projectName === projectName);
if (!projectCoverage) {
  throw new Error(`Project ${projectName} is not present in the audit footprint coverage`);
}
if (projectCoverage.coveragePercent < 99.9 && !allowPartialCoverage) {
  throw new Error(
    `Project ${projectName} does not cover at least 99.9% of the audit footprint; `
    + 'pass --allow-partial only for a fail-closed partial-source artifact',
  );
}
const products = stadium.coverage.products.filter((product) =>
  product.projectName === projectName);
if (products.length !== projectCoverage.tileCount || products.length === 0) {
  throw new Error(
    `Project tile mismatch: audit coverage says ${projectCoverage.tileCount}, found ${products.length}`,
  );
}

function allowedUrl(rawUrl, kind) {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== 'https:') return false;
  return kind === 'tile'
    ? parsed.hostname === 'rockyweb.usgs.gov' && parsed.pathname.endsWith('.laz')
    : (
      parsed.hostname === 'www.sciencebase.gov' && parsed.pathname.startsWith('/catalog/item/')
    ) || (
      parsed.hostname === 'thor-f5.er.usgs.gov'
      && parsed.pathname.startsWith('/ngtoc/metadata/')
      && parsed.pathname.endsWith('.xml')
    );
}

async function fileSha256(path) {
  const hash = createHash('sha256');
  await pipeline(createReadStream(path), new Transform({
    transform(chunk, _encoding, callback) {
      hash.update(chunk);
      callback(null, chunk);
    },
  }), new Transform({
    transform(_chunk, _encoding, callback) { callback(); },
  }));
  return hash.digest('hex');
}

async function fetchToFile(
  url,
  destination,
  expectedBytes = null,
  allowExpectedByteMismatch = false,
) {
  const partialPath = `${destination}.partial`;
  await rm(partialPath, { force: true });
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      Accept: '*/*',
      'User-Agent': 'theshadium-usgs-lidar-acquisition/1.0',
    },
  });
  if (!response.ok || !response.body) {
    const error = new Error(`Download failed with HTTP ${response.status}: ${url}`);
    error.httpStatus = response.status;
    throw error;
  }
  const resolvedUrl = new URL(response.url);
  const requestedUrl = new URL(url);
  if (resolvedUrl.protocol !== 'https:' || resolvedUrl.hostname !== requestedUrl.hostname) {
    throw new Error(`Unexpected cross-host redirect to ${response.url}`);
  }
  const hash = createHash('sha256');
  let byteLength = 0;
  const declaredContentLengthValue = response.headers.get('content-length');
  const declaredContentLength = declaredContentLengthValue === null
    ? null
    : Number(declaredContentLengthValue);
  const hashingStream = new Transform({
    transform(chunk, _encoding, callback) {
      hash.update(chunk);
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
    if (expectedBytes !== null && byteLength !== expectedBytes) {
      if (!allowExpectedByteMismatch) {
        throw new Error(`Byte mismatch for ${url}: expected ${expectedBytes}, received ${byteLength}`);
      }
      if (!Number.isSafeInteger(declaredContentLength) || declaredContentLength !== byteLength) {
        throw new Error(
          `Catalog size mismatch was allowed, but live Content-Length did not exactly match `
          + `received bytes for ${url}`,
        );
      }
    }
    await rename(partialPath, destination);
  } catch (error) {
    await rm(partialPath, { force: true });
    throw error;
  }
  return {
    requestedUrl: url,
    resolvedUrl: response.url,
    path: destination,
    byteLength,
    declaredContentLength,
    expectedByteLengthMismatch: expectedBytes !== null && byteLength !== expectedBytes,
    sha256: hash.digest('hex'),
    responseHeaders: {
      date: response.headers.get('date'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      contentType: response.headers.get('content-type'),
    },
  };
}

async function fetchToFileWithRetries(
  url,
  destination,
  expectedBytes = null,
  attempts = 3,
  allowExpectedByteMismatch = false,
) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchToFile(
        url,
        destination,
        expectedBytes,
        allowExpectedByteMismatch,
      );
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 750));
      }
    }
  }
  throw lastError;
}

await mkdir(outputDirectory, { recursive: true });
const previousManifestPath = join(outputDirectory, 'manifest.json');
let previousManifest = null;
try {
  previousManifest = JSON.parse(await readFile(previousManifestPath, 'utf8'));
} catch {
  previousManifest = null;
}

async function acquireProduct(product) {
  if (!product.downloadUrl || !allowedUrl(product.downloadUrl, 'tile')) {
    throw new Error(`Project product has an invalid tile URL: ${product.title}`);
  }
  const filename = basename(new URL(product.downloadUrl).pathname);
  const destination = join(outputDirectory, filename);
  const previous = previousManifest?.tiles?.find((tile) =>
    tile.requestedUrl === product.downloadUrl && tile.path === destination);
  if (previous) {
    const details = await stat(destination);
    if (details.size === previous.byteLength && await fileSha256(destination) === previous.sha256) {
      return { ...previous, reusedFromVerifiedManifest: true };
    }
  }
  const acquired = await fetchToFileWithRetries(
    product.downloadUrl,
    destination,
    product.sizeInBytes,
    3,
    allowCatalogSizeMismatch,
  );
  return {
    title: product.title,
    projectName: product.projectName,
    publicationDate: product.publicationDate,
    metadataUrl: product.metadataUrl,
    expectedByteLength: product.sizeInBytes,
    coversStadiumCenter: product.coversStadiumCenter,
    ...acquired,
    reusedFromVerifiedManifest: false,
  };
}

const tiles = [];
for (let offset = 0; offset < products.length; offset += 2) {
  const batch = products.slice(offset, offset + 2);
  tiles.push(...await Promise.all(batch.map(acquireProduct)));
}

const metadata = [];
for (const [index, metadataUrl] of [...new Set(products.map((product) =>
  product.metadataUrl).filter(Boolean))].entries()) {
  if (!allowedUrl(metadataUrl, 'metadata')) {
    throw new Error(`Project product has an invalid metadata URL: ${metadataUrl}`);
  }
  const itemId = new URL(metadataUrl).pathname.split('/').filter(Boolean).at(-1);
  const destination = join(outputDirectory, `metadata-${String(index + 1).padStart(2, '0')}-${itemId}.html`);
  metadata.push(await fetchToFileWithRetries(metadataUrl, destination));
}
const productMetadataUrls = [];
for (const item of metadata) {
  const markup = await readFile(item.path, 'utf8');
  for (const match of markup.matchAll(/https:\/\/thor-f5\.er\.usgs\.gov\/ngtoc\/metadata\/[^"'<> ]+\.xml/g)) {
    productMetadataUrls.push(match[0]);
  }
}
const productMetadata = [];
const productMetadataFailures = [];
for (const metadataUrl of [...new Set(productMetadataUrls)].sort()) {
  if (!allowedUrl(metadataUrl, 'metadata')) {
    throw new Error(`Project product has an invalid original metadata URL: ${metadataUrl}`);
  }
  const destination = join(outputDirectory, basename(new URL(metadataUrl).pathname));
  try {
    productMetadata.push(await fetchToFileWithRetries(metadataUrl, destination));
  } catch (error) {
    productMetadataFailures.push({
      requestedUrl: metadataUrl,
      path: destination,
      httpStatus: Number.isInteger(error?.httpStatus) ? error.httpStatus : null,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const fingerprintInput = {
  sourceAuditArtifactVersion: audit.artifactVersion,
  stadiumId,
  projectName,
  projectCoverage,
  tiles: tiles.map((tile) => ({
    requestedUrl: tile.requestedUrl,
    byteLength: tile.byteLength,
    sha256: tile.sha256,
  })),
  metadata: metadata.map((item) => ({
    requestedUrl: item.requestedUrl,
    byteLength: item.byteLength,
    sha256: item.sha256,
  })),
  productMetadata: productMetadata.map((item) => ({
    requestedUrl: item.requestedUrl,
    byteLength: item.byteLength,
    sha256: item.sha256,
  })),
  productMetadataFailures,
};
const publicationBlockers = [
  'SEMANTIC_GEOMETRY_NOT_EXTRACTED',
  'SOURCE_ACQUISITION_DATE_NOT_VERIFIED',
  'SOURCE_ACCURACY_NOT_VERIFIED',
  'SOURCE_CURRENCY_NOT_VERIFIED',
  'SHADOW_HOLDOUT_NOT_PASSED',
];
if (projectCoverage.coveragePercent < 99.9) {
  publicationBlockers.unshift('PROJECT_FOOTPRINT_COVERAGE_INCOMPLETE');
}
if (tiles.some((tile) => tile.expectedByteLengthMismatch)) {
  publicationBlockers.unshift('SOURCE_CATALOG_BYTE_COUNT_MISMATCH');
}
if (productMetadataFailures.length > 0) {
  publicationBlockers.unshift('ORIGINAL_PRODUCT_METADATA_ACQUISITION_INCOMPLETE');
}
const artifact = {
  schemaVersion: 1,
  artifactKind: 'usgs-lidar-project-acquisition',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`,
  sourceAuditArtifactVersion: audit.artifactVersion,
  stadiumId,
  projectName,
  acquiredOn: new Date().toISOString(),
  projectCoverage,
  tiles,
  metadata,
  productMetadata,
  productMetadataFailures,
  summary: {
    tileCount: tiles.length,
    totalByteLength: tiles.reduce((sum, tile) => sum + tile.byteLength, 0),
    metadataDocumentCount: metadata.length,
    originalProductMetadataDocumentCount: productMetadata.length,
    originalProductMetadataFailureCount: productMetadataFailures.length,
    catalogByteCountMismatchTileCount: tiles.filter(
      (tile) => tile.expectedByteLengthMismatch,
    ).length,
    footprintCoveragePercent: projectCoverage.coveragePercent,
  },
  publication: {
    eligible: false,
    blockers: publicationBlockers,
  },
};
await writeFile(previousManifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath: previousManifestPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId,
  projectName,
  summary: artifact.summary,
  publication: artifact.publication,
}, null, 2));

#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const TNM_ENDPOINT = 'https://tnmaccess.nationalmap.gov/api/v1/products';
const PROJECT_TOKEN = 'FL_MiamiDade_D23';
const EXPECTED_TILE_TOKEN_BY_CONTROL = new Map([
  ['BP-2', 'LID2024_318452_0901'],
  ['BP-3', 'LID2024_318452_0901'],
  ['TATO', 'LID2024_318751_0901'],
]);

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
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

function artifactVersion(value) {
  return `sha256:${sha256(JSON.stringify(canonicalJson(value)))}`;
}

async function fileSha256(filePath) {
  const hash = createHash('sha256');
  await pipeline(
    createReadStream(filePath),
    new Transform({
      transform(chunk, _encoding, callback) {
        hash.update(chunk);
        callback(null, chunk);
      },
    }),
    new Transform({ transform(_chunk, _encoding, callback) { callback(); } }),
  );
  return hash.digest('hex');
}

async function fetchJson(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { accept: 'application/json', 'user-agent': 'mlb-sun-tracker-usgs-control-research/1.0' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const value = JSON.parse(bytes.toString('utf8'));
  return {
    bytes,
    value,
    request: {
      requestedUrl: url.toString(),
      resolvedUrl: response.url,
      responseDate: response.headers.get('date'),
      contentType: response.headers.get('content-type'),
      byteLength: bytes.length,
      sha256: sha256(bytes),
    },
  };
}

async function download(url, destination, expectedBytes) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'rockyweb.usgs.gov' || !parsed.pathname.endsWith('.laz')) {
    throw new Error(`Unexpected USGS download URL: ${url}`);
  }
  try {
    const details = await stat(destination);
    if (details.size === expectedBytes) {
      return {
        requestedUrl: url,
        resolvedUrl: url,
        path: destination,
        byteLength: details.size,
        sha256: await fileSha256(destination),
        reused: true,
      };
    }
  } catch {
    // Download below.
  }
  const partial = `${destination}.partial`;
  await rm(partial, { force: true });
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { accept: '*/*', 'user-agent': 'mlb-sun-tracker-usgs-control-research/1.0' },
  });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status} for ${url}`);
  const resolved = new URL(response.url);
  if (resolved.hostname !== parsed.hostname || resolved.protocol !== 'https:') {
    throw new Error(`Unexpected download redirect: ${response.url}`);
  }
  const hash = createHash('sha256');
  let byteLength = 0;
  const hashing = new Transform({
    transform(chunk, _encoding, callback) {
      hash.update(chunk);
      byteLength += chunk.length;
      callback(null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(response.body), hashing, createWriteStream(partial, { flags: 'wx' }));
    if (byteLength !== expectedBytes) {
      throw new Error(`USGS byte mismatch: expected ${expectedBytes}, received ${byteLength}`);
    }
    await rename(partial, destination);
  } catch (error) {
    await rm(partial, { force: true });
    throw error;
  }
  return {
    requestedUrl: url,
    resolvedUrl: response.url,
    path: destination,
    byteLength,
    sha256: hash.digest('hex'),
    reused: false,
    responseHeaders: {
      date: response.headers.get('date'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      contentType: response.headers.get('content-type'),
    },
  };
}

async function main() {
  const transformsArgument = option('transforms');
  const outputArgument = option('output-dir');
  if (!transformsArgument || !outputArgument) {
    throw new Error('Usage: acquireMarlinsLockedTrainingControlLidar.mjs --transforms=PATH --output-dir=PATH');
  }
  const transformsPath = path.resolve(transformsArgument);
  const outputDirectory = path.resolve(outputArgument);
  const transformsBytes = await readFile(transformsPath);
  const transforms = JSON.parse(transformsBytes.toString('utf8'));
  const training = transforms.controls.filter((control) => control.role === 'training');
  const holdouts = transforms.controls.filter((control) => control.role === 'final-holdout');
  if (training.length < 3 || holdouts.length < 3) {
    throw new Error('Expected locked training and final-holdout partitions');
  }
  await mkdir(outputDirectory, { recursive: true });

  const catalogRecords = [];
  const productsByUrl = new Map();
  for (const control of training) {
    const latitude = control.target.latitudeDecimalDegrees;
    const longitude = control.target.longitudeDecimalDegrees;
    const delta = 0.0001;
    const url = new URL(TNM_ENDPOINT);
    url.searchParams.set('bbox', `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`);
    url.searchParams.set('datasets', 'Lidar Point Cloud (LPC)');
    url.searchParams.set('prodFormats', 'LAS,LAZ');
    url.searchParams.set('max', '100');
    url.searchParams.set('outputFormat', 'JSON');
    const response = await fetchJson(url);
    const expectedTileToken = EXPECTED_TILE_TOKEN_BY_CONTROL.get(control.id);
    if (!expectedTileToken) throw new Error(`No locked tile assignment for ${control.id}`);
    const matches = (response.value.items ?? []).filter((item) =>
      item.title?.includes(PROJECT_TOKEN) && item.title?.includes(expectedTileToken));
    if (matches.length !== 1) {
      throw new Error(`Expected exactly one 2024 Miami-Dade tile for ${control.id}, found ${matches.length}`);
    }
    const rawPath = path.join(outputDirectory, `${control.id}-tnm-catalog.json`);
    await writeFile(rawPath, response.bytes);
    const product = matches[0];
    catalogRecords.push({
      controlId: control.id,
      role: control.role,
      rawPath,
      request: response.request,
      selectedProduct: product,
      tileSelectionRule: {
        expectedTileToken,
        basis: 'deterministic 5,000-foot state-plane tile containing the locked control coordinate',
      },
    });
    productsByUrl.set(product.downloadURL, product);
  }

  const tiles = [];
  for (const product of productsByUrl.values()) {
    const filename = path.basename(new URL(product.downloadURL).pathname);
    const destination = path.join(outputDirectory, filename);
    tiles.push({
      title: product.title,
      publicationDate: product.publicationDate,
      lastUpdated: product.lastUpdated,
      vendorMetadataUrl: product.vendorMetaUrl,
      scienceBaseMetadataUrl: product.metaUrl,
      boundingBox: product.boundingBox,
      expectedByteLength: product.sizeInBytes,
      ...await download(product.downloadURL, destination, product.sizeInBytes),
    });
  }

  const stable = {
    artifactKind: 'marlins-locked-training-control-lidar-acquisition',
    acquiredOn: new Date().toISOString(),
    transforms: {
      path: transformsPath,
      sha256: sha256(transformsBytes),
      artifactVersion: transforms.artifactVersion,
      trainingControlIds: training.map((control) => control.id),
      finalHoldoutControlIds: holdouts.map((control) => control.id),
    },
    authority: {
      agency: 'USGS',
      catalogEndpoint: TNM_ENDPOINT,
      projectToken: PROJECT_TOKEN,
    },
    catalogRecords,
    tiles,
    accessProtocol: 'Only locked training-control tiles are acquired. No final-holdout LiDAR is queried, downloaded, inspected, or localized before the training method is frozen.',
    publication: {
      eligible: false,
      blockers: [
        'TRAINING_CONTROL_INTENSITY_NOT_REVIEWED',
        'TRAINING_TRANSFORM_NOT_FROZEN',
        'FINAL_HOLDOUTS_NOT_ACQUIRED_OR_EVALUATED',
      ],
    },
  };
  const artifact = { schemaVersion: 1, artifactVersion: artifactVersion(stable), ...stable };
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    manifestPath,
    artifactVersion: artifact.artifactVersion,
    trainingControlIds: training.map((control) => control.id),
    finalHoldoutControlsAccessed: 0,
    tiles: tiles.map((tile) => ({
      title: tile.title,
      path: tile.path,
      byteLength: tile.byteLength,
      sha256: tile.sha256,
      reused: tile.reused,
    })),
    publicationEligible: artifact.publication.eligible,
  }, null, 2));
}

await main();

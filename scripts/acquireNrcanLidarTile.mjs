#!/usr/bin/env node

/**
 * Acquire explicitly resolved CanElevation COPC tiles from Natural Resources
 * Canada. Streams are byte checked and SHA-256 locked. The federal project
 * index, product specification, and project metadata archive are also locked.
 *
 * This creates a candidate-source artifact only. It cannot certify stadium
 * rows, obstruction geometry, source accuracy, currency, or shadow behavior.
 *
 * Usage:
 *   node scripts/acquireNrcanLidarTile.mjs \
 *     --stadium=bluejays \
 *     --project=GTA_2023 \
 *     --tile-url=https://...copc.laz \
 *     --expected-bytes=142929768 \
 *     --project-index=tmp/lidar/.../Index_LiDARprojects_projetslidar.gpkg \
 *     --output=tmp/lidar/bluejays-nrcan-canelevation-gta-2023-2024
 */

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));

const stadiumId = typeof args.stadium === 'string' ? args.stadium : null;
const projectName = typeof args.project === 'string' ? args.project : null;
const tileUrl = typeof args['tile-url'] === 'string' ? args['tile-url'] : null;
const expectedBytes = Number(args['expected-bytes']);
const additionalTileUrl = typeof args['additional-tile-url'] === 'string'
  ? args['additional-tile-url']
  : null;
const additionalExpectedBytes = args['additional-expected-bytes'] === undefined
  ? null
  : Number(args['additional-expected-bytes']);
const projectIndexPath = typeof args['project-index'] === 'string'
  ? resolve(args['project-index'])
  : null;
const outputDirectory = typeof args.output === 'string' ? resolve(args.output) : null;

if (
  !stadiumId
  || !projectName
  || !tileUrl
  || !Number.isSafeInteger(expectedBytes)
  || expectedBytes <= 0
  || !projectIndexPath
  || !outputDirectory
  || (additionalTileUrl === null) !== (additionalExpectedBytes === null)
  || (
    additionalExpectedBytes !== null
    && (!Number.isSafeInteger(additionalExpectedBytes) || additionalExpectedBytes <= 0)
  )
) {
  console.error(
    'Required: --stadium=ID --project=NAME --tile-url=URL --expected-bytes=N '
    + '--project-index=PATH --output=DIRECTORY. Optional paired arguments: '
    + '--additional-tile-url=URL --additional-expected-bytes=N',
  );
  process.exit(2);
}

const CANELEVATION_HOST = 'canelevation-lidar-point-clouds.s3.ca-central-1.amazonaws.com';
const TILE_PREFIX = 'pointclouds_nuagespoints/TRCA/GTA_2023/';

function validateTileUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  if (
    parsed.protocol !== 'https:'
    || parsed.hostname !== CANELEVATION_HOST
    || !parsed.pathname.startsWith(`/${TILE_PREFIX}`)
    || !parsed.pathname.endsWith('_CLASS.copc.laz')
  ) {
    throw new Error(`Tile URL is outside the expected official CanElevation project: ${rawUrl}`);
  }
}

async function fileSha256(path) {
  const hash = createHash('sha256');
  await pipeline(
    createReadStream(path),
    new Transform({
      transform(chunk, _encoding, callback) {
        hash.update(chunk);
        callback(null, chunk);
      },
    }),
    new Transform({
      transform(_chunk, _encoding, callback) { callback(); },
    }),
  );
  return hash.digest('hex');
}

async function downloadTile(specification, destination) {
  const { url, expectedByteLength } = specification;
  const partialPath = `${destination}.partial`;
  await rm(partialPath, { force: true });
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      Accept: 'application/vnd.laszip+copc,application/octet-stream,*/*',
      'User-Agent': 'theshadium-nrcan-lidar-acquisition/1.0',
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`Download failed with HTTP ${response.status}: ${url}`);
  }
  const resolved = new URL(response.url);
  if (resolved.protocol !== 'https:' || resolved.hostname !== CANELEVATION_HOST) {
    throw new Error(`Unexpected redirect outside the official CanElevation host: ${response.url}`);
  }

  const declaredContentLengthValue = response.headers.get('content-length');
  const declaredContentLength = declaredContentLengthValue === null
    ? null
    : Number(declaredContentLengthValue);
  const hash = createHash('sha256');
  let byteLength = 0;
  try {
    await pipeline(
      Readable.fromWeb(response.body),
      new Transform({
        transform(chunk, _encoding, callback) {
          hash.update(chunk);
          byteLength += chunk.length;
          callback(null, chunk);
        },
      }),
      createWriteStream(partialPath, { flags: 'wx' }),
    );
    if (byteLength !== expectedByteLength) {
      throw new Error(
        `CanElevation inventory byte mismatch: expected ${expectedByteLength}, received ${byteLength}`,
      );
    }
    if (declaredContentLength !== null && declaredContentLength !== byteLength) {
      throw new Error(
        `HTTP Content-Length mismatch: declared ${declaredContentLength}, received ${byteLength}`,
      );
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
    expectedByteLength,
    declaredContentLength,
    byteLength,
    sha256: hash.digest('hex'),
    responseHeaders: {
      date: response.headers.get('date'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      contentType: response.headers.get('content-type'),
    },
  };
}

async function downloadSupportingDocument(url, destination) {
  const parsed = new URL(url);
  if (
    parsed.protocol !== 'https:'
    || parsed.hostname !== CANELEVATION_HOST
    || !parsed.pathname.startsWith('/pointclouds_nuagespoints/')
  ) {
    throw new Error(`Supporting-document URL is outside CanElevation: ${url}`);
  }
  const partialPath = `${destination}.partial`;
  await rm(partialPath, { force: true });
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      Accept: 'application/pdf,application/zip,application/octet-stream,*/*',
      'User-Agent': 'theshadium-nrcan-lidar-acquisition/1.0',
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`Supporting-document download failed with HTTP ${response.status}: ${url}`);
  }
  const resolved = new URL(response.url);
  if (resolved.protocol !== 'https:' || resolved.hostname !== CANELEVATION_HOST) {
    throw new Error(`Unexpected supporting-document redirect: ${response.url}`);
  }
  const declaredContentLengthValue = response.headers.get('content-length');
  const declaredContentLength = declaredContentLengthValue === null
    ? null
    : Number(declaredContentLengthValue);
  if (!Number.isSafeInteger(declaredContentLength) || declaredContentLength <= 0) {
    throw new Error(`Supporting document has no trustworthy Content-Length: ${url}`);
  }
  const hash = createHash('sha256');
  let byteLength = 0;
  try {
    await pipeline(
      Readable.fromWeb(response.body),
      new Transform({
        transform(chunk, _encoding, callback) {
          hash.update(chunk);
          byteLength += chunk.length;
          callback(null, chunk);
        },
      }),
      createWriteStream(partialPath, { flags: 'wx' }),
    );
    if (byteLength !== declaredContentLength) {
      throw new Error(
        `Supporting-document byte mismatch: declared ${declaredContentLength}, received ${byteLength}`,
      );
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
    declaredContentLength,
    byteLength,
    sha256: hash.digest('hex'),
    responseHeaders: {
      date: response.headers.get('date'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      contentType: response.headers.get('content-type'),
    },
  };
}

const tileSpecifications = [
  { url: tileUrl, expectedByteLength: expectedBytes },
  ...(
    additionalTileUrl
      ? [{ url: additionalTileUrl, expectedByteLength: additionalExpectedBytes }]
      : []
  ),
];
for (const specification of tileSpecifications) validateTileUrl(specification.url);
if (new Set(tileSpecifications.map((specification) => specification.url)).size !== tileSpecifications.length) {
  throw new Error('Duplicate CanElevation tile URL');
}
await mkdir(outputDirectory, { recursive: true });
const projectIndexDetails = await stat(projectIndexPath);
if (!projectIndexDetails.isFile()) throw new Error(`Project index is not a file: ${projectIndexPath}`);
const projectIndex = {
  path: projectIndexPath,
  byteLength: projectIndexDetails.size,
  sha256: await fileSha256(projectIndexPath),
  sourceUrl:
    'https://canelevation-lidar-point-clouds.s3-ca-central-1.amazonaws.com/'
    + 'pointclouds_nuagespoints/Index_LiDARprojects_projetslidar.gpkg',
};

const manifestPath = join(outputDirectory, 'manifest.json');
let previousManifest = null;
try {
  previousManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch {
  previousManifest = null;
}
const previousTiles = previousManifest?.tiles
  ?? (previousManifest?.tile ? [previousManifest.tile] : []);
const tiles = [];
for (const specification of tileSpecifications) {
  const destination = join(outputDirectory, basename(new URL(specification.url).pathname));
  let tile = null;
  const previousTile = previousTiles.find((item) => item.requestedUrl === specification.url);
  if (previousTile) {
    try {
      const details = await stat(destination);
      if (
        details.size === previousTile.byteLength
        && await fileSha256(destination) === previousTile.sha256
      ) {
        tile = { ...previousTile, reusedFromVerifiedManifest: true };
      }
    } catch {
      tile = null;
    }
  }
  if (!tile) {
    tile = {
      ...await downloadTile(specification, destination),
      reusedFromVerifiedManifest: false,
    };
  }
  tiles.push(tile);
}

const supportingDocumentUrls = [
  'https://canelevation-lidar-point-clouds.s3.ca-central-1.amazonaws.com/'
    + 'pointclouds_nuagespoints/CanElevation-LiDARPointClouds_products_specs_EN.pdf',
  'https://canelevation-lidar-point-clouds.s3.ca-central-1.amazonaws.com/'
    + 'pointclouds_nuagespoints/Metadata_PointCloud_NRCAN.gdb.zip',
];
const supportingDocuments = [];
for (const url of supportingDocumentUrls) {
  const destination = join(outputDirectory, basename(new URL(url).pathname));
  const previousDocument = previousManifest?.supportingDocuments?.find(
    (item) => item.requestedUrl === url,
  );
  let document = null;
  if (previousDocument) {
    try {
      const details = await stat(destination);
      if (
        details.size === previousDocument.byteLength
        && await fileSha256(destination) === previousDocument.sha256
      ) {
        document = { ...previousDocument, reusedFromVerifiedManifest: true };
      }
    } catch {
      document = null;
    }
  }
  if (!document) {
    document = {
      ...await downloadSupportingDocument(url, destination),
      reusedFromVerifiedManifest: false,
    };
  }
  supportingDocuments.push(document);
}

const fingerprintInput = {
  stadiumId,
  projectName,
  projectIndex: {
    sourceUrl: projectIndex.sourceUrl,
    byteLength: projectIndex.byteLength,
    sha256: projectIndex.sha256,
  },
  tiles: tiles.map((tile) => ({
    requestedUrl: tile.requestedUrl,
    byteLength: tile.byteLength,
    sha256: tile.sha256,
  })),
  supportingDocuments: supportingDocuments.map((document) => ({
    requestedUrl: document.requestedUrl,
    byteLength: document.byteLength,
    sha256: document.sha256,
  })),
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'nrcan-canelevation-lidar-project-acquisition',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`,
  stadiumId,
  projectName,
  acquiredOn: new Date().toISOString(),
  provider: 'Natural Resources Canada CanElevation LiDAR Point Clouds',
  projectIndex,
  tiles,
  supportingDocuments,
  summary: {
    tileCount: tiles.length,
    totalByteLength: tiles.reduce((total, tile) => total + tile.byteLength, 0),
    supportingDocumentCount: supportingDocuments.length,
  },
  officialReferences: {
    datasetRecordUrl: 'https://open.canada.ca/data/en/dataset/7069387e-9986-4297-9f55-0288e9676947',
    gtaCoverageReleaseUrl:
      'https://natural-resources.canada.ca/science-data/science-research/geomatics/'
      + 'more-high-resolution-lidar-elevation-data-now-available',
    projectBrowserUrl:
      'https://canelevation-lidar-point-clouds.s3.ca-central-1.amazonaws.com/'
      + 'pointclouds_nuagespoints/index.html#pointclouds_nuagespoints/TRCA/GTA_2023/',
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_ACCURACY_NOT_VERIFIED',
      'SOURCE_CURRENCY_NOT_VERIFIED',
      'ROOF_STATE_NOT_REVIEWED',
      'SEMANTIC_ROW_GEOMETRY_NOT_EXTRACTED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  projectName,
  tiles: tiles.map((tile) => ({
    path: tile.path,
    byteLength: tile.byteLength,
    sha256: tile.sha256,
    reusedFromVerifiedManifest: tile.reusedFromVerifiedManifest,
  })),
  supportingDocuments: supportingDocuments.map((document) => ({
    path: document.path,
    byteLength: document.byteLength,
    sha256: document.sha256,
    reusedFromVerifiedManifest: document.reusedFromVerifiedManifest,
  })),
  publication: artifact.publication,
}, null, 2));

#!/usr/bin/env node

/** Acquire one checksum-locked DRCOG orthophoto tile and its world file. */

import { createHash } from 'node:crypto';
import {
  access,
  mkdir,
  open,
  readFile,
  rename,
  stat,
  writeFile,
} from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
for (const name of [
  'stadium-id',
  'layer-url',
  'object-id',
  'projected-x',
  'projected-y',
  'output-dir',
]) {
  if (typeof args[name] !== 'string') throw new Error(`Required: --${name}=VALUE`);
}
const stadiumId = args['stadium-id'];
const layerUrl = args['layer-url'].replace(/\/$/, '');
const objectId = Number(args['object-id']);
const projectedX = Number(args['projected-x']);
const projectedY = Number(args['projected-y']);
if (![objectId, projectedX, projectedY].every(Number.isFinite)) {
  throw new Error('Object ID and projected coordinates must be finite numbers');
}
const outputDir = resolve(args['output-dir']);
const rasterPrefixUrl = typeof args['raster-prefix-url'] === 'string'
  ? args['raster-prefix-url']
  : null;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const stableHash = (value) => sha256(JSON.stringify(value));
const allowedRasterHosts = new Set([
  'drapparchive.s3.amazonaws.com',
  'drapparchive.s3.us-east-2.amazonaws.com',
]);
const canonicalRasterHost = 'drapparchive.s3.amazonaws.com';

const fetchBytes = async (url) => {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    url,
    resolvedUrl: response.url,
    status: response.status,
    bytes,
    sha256: sha256(bytes),
    headers: {
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
  };
};

const safeRasterUrl = (value, expectedExtension) => {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !allowedRasterHosts.has(url.hostname)) {
    throw new Error(`Unexpected DRCOG raster host: ${url.href}`);
  }
  if (!url.pathname.toLowerCase().endsWith(expectedExtension)) {
    throw new Error(`DRCOG raster URL does not end in ${expectedExtension}`);
  }
  return url.href;
};

const resolveRasterUrls = async (record) => {
  if (record.attributes.tif_link && record.attributes.tfw_link) {
    return {
      tifUrl: safeRasterUrl(record.attributes.tif_link, '.tif'),
      tfwUrl: safeRasterUrl(record.attributes.tfw_link, '.tfw'),
      archiveListing: null,
    };
  }
  if (!rasterPrefixUrl) {
    throw new Error('Tile index omits raster links; --raster-prefix-url is required');
  }
  const prefix = new URL(rasterPrefixUrl);
  if (
    prefix.protocol !== 'https:'
    || !allowedRasterHosts.has(prefix.hostname)
    || !prefix.pathname.endsWith('/')
  ) {
    throw new Error(`Unexpected DRCOG raster prefix: ${prefix.href}`);
  }
  const tileName = String(record.attributes.tile);
  const tifKey = `${prefix.pathname.slice(1)}${tileName}.tif`;
  const tfwKey = `${prefix.pathname.slice(1)}${tileName}.tfw`;
  const listingUrl = new URL(`https://${canonicalRasterHost}/`);
  listingUrl.searchParams.set('list-type', '2');
  listingUrl.searchParams.set('prefix', `${prefix.pathname.slice(1)}${tileName}`);
  listingUrl.searchParams.set('max-keys', '20');
  const listing = await fetchBytes(listingUrl.href);
  const listingText = listing.bytes.toString('utf8');
  const keys = [...listingText.matchAll(/<Key>([^<]+)<\/Key>/g)].map((match) => match[1]);
  if (!keys.includes(tifKey) || !keys.includes(tfwKey)) {
    throw new Error('Official DRCOG archive listing does not contain both tile files');
  }
  return {
    tifUrl: safeRasterUrl(new URL(`${tileName}.tif`, prefix).href, '.tif'),
    tfwUrl: safeRasterUrl(new URL(`${tileName}.tfw`, prefix).href, '.tfw'),
    archiveListing: {
      url: listing.url,
      resolvedUrl: listing.resolvedUrl,
      sha256: listing.sha256,
      headers: listing.headers,
      keys,
      bytes: listing.bytes,
    },
  };
};

const pointInsideRecordBounds = (record, x, y) => {
  const points = record.geometry.rings.flat();
  const xs = points.map((point) => Number(point[0]));
  const ys = points.map((point) => Number(point[1]));
  const bounds = {
    minimumX: Math.min(...xs),
    maximumX: Math.max(...xs),
    minimumY: Math.min(...ys),
    maximumY: Math.max(...ys),
  };
  return {
    bounds,
    contains: x >= bounds.minimumX && x <= bounds.maximumX
      && y >= bounds.minimumY && y <= bounds.maximumY,
  };
};

const downloadFile = async (url, outputPath) => {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}: ${url}`);
  const temporaryPath = `${outputPath}.partial`;
  const digest = createHash('sha256');
  let byteLength = 0;
  const hasher = new Transform({
    transform(chunk, _encoding, callback) {
      digest.update(chunk);
      byteLength += chunk.length;
      callback(null, chunk);
    },
  });
  await pipeline(
    Readable.fromWeb(response.body),
    hasher,
    createWriteStream(temporaryPath, { flags: 'w' }),
  );
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && byteLength !== declaredLength) {
    throw new Error(`Downloaded ${byteLength} bytes but server declared ${declaredLength}`);
  }
  await rename(temporaryPath, outputPath);
  return {
    requestedUrl: url,
    resolvedUrl: response.url,
    path: outputPath,
    byteLength,
    sha256: digest.digest('hex'),
    headers: {
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
  };
};

const readTiffDimensions = async (path) => {
  const handle = await open(path, 'r');
  try {
    const header = Buffer.alloc(16);
    await handle.read(header, 0, header.length, 0);
    const byteOrder = header.toString('ascii', 0, 2);
    if (!['II', 'MM'].includes(byteOrder)) throw new Error('Unsupported TIFF byte order');
    const littleEndian = byteOrder === 'II';
    const uint16 = (buffer, offset) => littleEndian
      ? buffer.readUInt16LE(offset)
      : buffer.readUInt16BE(offset);
    const uint32 = (buffer, offset) => littleEndian
      ? buffer.readUInt32LE(offset)
      : buffer.readUInt32BE(offset);
    const magic = uint16(header, 2);
    if (magic !== 42) throw new Error(`Unsupported TIFF magic ${magic}; expected standard TIFF`);
    const ifdOffset = uint32(header, 4);
    const countBuffer = Buffer.alloc(2);
    await handle.read(countBuffer, 0, 2, ifdOffset);
    const entryCount = uint16(countBuffer, 0);
    const entries = Buffer.alloc(entryCount * 12);
    await handle.read(entries, 0, entries.length, ifdOffset + 2);
    const values = new Map();
    for (let index = 0; index < entryCount; index += 1) {
      const offset = index * 12;
      const tag = uint16(entries, offset);
      const type = uint16(entries, offset + 2);
      const count = uint32(entries, offset + 4);
      if (![256, 257, 258, 259, 277].includes(tag) || count !== 1) continue;
      let value;
      if (type === 3) value = uint16(entries, offset + 8);
      else if (type === 4) value = uint32(entries, offset + 8);
      else continue;
      values.set(tag, value);
    }
    if (!values.has(256) || !values.has(257)) {
      throw new Error('TIFF width and height tags are missing');
    }
    return {
      byteOrder,
      magic,
      ifdOffset,
      entryCount,
      widthPixels: values.get(256),
      heightPixels: values.get(257),
      bitsPerSampleFirstValue: values.get(258) ?? null,
      compression: values.get(259) ?? null,
      samplesPerPixel: values.get(277) ?? null,
    };
  } finally {
    await handle.close();
  }
};

await mkdir(outputDir, { recursive: true });
const layerRequest = await fetchBytes(`${layerUrl}?f=pjson`);
const layer = JSON.parse(layerRequest.bytes.toString('utf8'));
if (layer.error) throw new Error(`DRCOG layer error: ${JSON.stringify(layer.error)}`);
if (layer.geometryType !== 'esriGeometryPolygon') {
  throw new Error('DRCOG tile index is not a polygon layer');
}
const objectIdField = layer.fields.find((field) => field.type === 'esriFieldTypeOID')?.name;
if (!objectIdField) throw new Error('DRCOG tile index lacks an object ID field');
const query = new URL(`${layerUrl}/query`);
query.searchParams.set('where', `${objectIdField}=${objectId}`);
query.searchParams.set('outFields', '*');
query.searchParams.set('returnGeometry', 'true');
query.searchParams.set('f', 'pjson');
const recordRequest = await fetchBytes(query.href);
const recordResponse = JSON.parse(recordRequest.bytes.toString('utf8'));
if (recordResponse.error) {
  throw new Error(`DRCOG record error: ${JSON.stringify(recordResponse.error)}`);
}
if (recordResponse.features?.length !== 1) {
  throw new Error(`Expected one DRCOG tile record, received ${recordResponse.features?.length}`);
}
const record = recordResponse.features[0];
const containment = pointInsideRecordBounds(record, projectedX, projectedY);
if (!containment.contains) throw new Error('Projected stadium point is outside the tile record');
const resolvedRasters = await resolveRasterUrls(record);
const { tifUrl, tfwUrl, archiveListing } = resolvedRasters;
const tfwRequest = await fetchBytes(tfwUrl);
const worldFileValues = tfwRequest.bytes.toString('utf8').trim().split(/\s+/).map(Number);
if (worldFileValues.length !== 6 || !worldFileValues.every(Number.isFinite)) {
  throw new Error('DRCOG world file does not contain six finite values');
}
const [pixelWidth, rowRotation, columnRotation, pixelHeight, upperLeftX, upperLeftY] = worldFileValues;
if (rowRotation !== 0 || columnRotation !== 0 || pixelWidth <= 0 || pixelHeight >= 0) {
  throw new Error('DRCOG world file has unexpected rotation or pixel sign');
}

const tileName = String(record.attributes.tile);
const tifPath = resolve(outputDir, basename(new URL(tifUrl).pathname));
const tfwPath = resolve(outputDir, basename(new URL(tfwUrl).pathname));
const layerPath = resolve(outputDir, 'tile-index-layer.json');
const recordPath = resolve(outputDir, 'tile-record.json');
const archiveListingPath = archiveListing
  ? resolve(outputDir, 'archive-listing.xml')
  : null;
await writeFile(layerPath, layerRequest.bytes);
await writeFile(recordPath, recordRequest.bytes);
if (archiveListingPath) await writeFile(archiveListingPath, archiveListing.bytes);
await writeFile(tfwPath, tfwRequest.bytes);

let tifSource;
let reusedVerifiedFile = false;
try {
  await access(tifPath);
  const existingManifestPath = resolve(outputDir, 'manifest.json');
  const existingManifest = JSON.parse(await readFile(existingManifestPath, 'utf8'));
  const existingSource = existingManifest?.orthophoto;
  const existingStat = await stat(tifPath);
  const digest = createHash('sha256');
  const handle = await open(tifPath, 'r');
  try {
    const buffer = Buffer.alloc(4 * 1024 * 1024);
    let position = 0;
    while (position < existingStat.size) {
      const { bytesRead } = await handle.read(
        buffer,
        0,
        Math.min(buffer.length, existingStat.size - position),
        position,
      );
      if (bytesRead === 0) break;
      digest.update(buffer.subarray(0, bytesRead));
      position += bytesRead;
    }
  } finally {
    await handle.close();
  }
  const existingHash = digest.digest('hex');
  if (
    existingSource?.requestedUrl !== tifUrl
    || existingSource?.byteLength !== existingStat.size
    || existingSource?.sha256 !== existingHash
  ) {
    throw new Error('Existing orthophoto does not match its acquisition manifest');
  }
  tifSource = { ...existingSource, path: tifPath };
  reusedVerifiedFile = true;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  tifSource = await downloadFile(tifUrl, tifPath);
}

const tiff = await readTiffDimensions(tifPath);
const widthFeet = containment.bounds.maximumX - containment.bounds.minimumX;
const heightFeet = containment.bounds.maximumY - containment.bounds.minimumY;
const derivedWidthFeet = tiff.widthPixels * pixelWidth;
const derivedHeightFeet = tiff.heightPixels * Math.abs(pixelHeight);
if (
  Math.abs(derivedWidthFeet - widthFeet) > 0.02
  || Math.abs(derivedHeightFeet - heightFeet) > 0.02
) {
  throw new Error('TIFF dimensions and world-file scale do not match the indexed bounds');
}
const stable = {
  stadiumId,
  layerUrl,
  layerSha256: layerRequest.sha256,
  recordSha256: recordRequest.sha256,
  objectId,
  projectedStadiumPoint: [projectedX, projectedY],
  spatialReference: recordResponse.spatialReference,
  record,
  archiveListing: archiveListing
    ? {
      url: archiveListing.url,
      resolvedUrl: archiveListing.resolvedUrl,
      sha256: archiveListing.sha256,
      headers: archiveListing.headers,
      keys: archiveListing.keys,
    }
    : null,
  worldFile: {
    url: tfwUrl,
    sha256: tfwRequest.sha256,
    values: worldFileValues,
  },
  orthophoto: {
    requestedUrl: tifSource.requestedUrl,
    resolvedUrl: tifSource.resolvedUrl,
    byteLength: tifSource.byteLength,
    sha256: tifSource.sha256,
    headers: tifSource.headers,
  },
  tiff,
  validation: {
    projectedStadiumPointInsideTile: containment.contains,
    indexedBoundsFeet: containment.bounds,
    indexedWidthFeet: widthFeet,
    indexedHeightFeet: heightFeet,
    derivedWidthFeet,
    derivedHeightFeet,
    pixelWidthFeet: pixelWidth,
    pixelHeightFeet: pixelHeight,
    zeroRotation: true,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'drcog-orthophoto-tile-acquisition',
  artifactVersion: `sha256:${stableHash(stable)}`,
  acquiredOn: new Date().toISOString(),
  ...stable,
  localFiles: {
    layer: layerPath,
    record: recordPath,
    archiveListing: archiveListingPath,
    worldFile: tfwPath,
    orthophoto: tifPath,
  },
  reuse: {
    reusedVerifiedOrthophoto: reusedVerifiedFile,
  },
  geometryBoundary: {
    establishesGeoreferencedPixelGrid: true,
    establishesSubFootPixelSize: pixelWidth <= 1,
    establishesSubFootHorizontalAccuracy: false,
    establishesElevatedRowCoordinates: false,
    note: 'Pixel size is not positional accuracy. Above-ground rows also require relief and occlusion handling.',
  },
  publication: {
    eligible: false,
    blockers: [
      'ORTHOPHOTO_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT',
      'ABOVE_GROUND_RELIEF_DISPLACEMENT_NOT_RESOLVED',
      'ROW_ELEVATIONS_NOT_MEASURED',
      'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
      'SOURCE_CURRENCY_NOT_VERIFIED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const manifestPath = resolve(outputDir, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId,
  tile: tileName,
  resolution: record.attributes.resolution,
  orthophoto: {
    path: tifPath,
    byteLength: tifSource.byteLength,
    sha256: tifSource.sha256,
    reusedVerifiedFile,
  },
  tiff,
  validation: artifact.validation,
  publication: artifact.publication,
}, null, 2));

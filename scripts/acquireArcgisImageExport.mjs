#!/usr/bin/env node

/** Acquire a deterministic public ArcGIS ImageServer export and its metadata. */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

function argument(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function required(name) {
  const value = argument(name);
  if (!value) throw new Error(`Required: --${name}`);
  return value;
}

function finiteNumber(name) {
  const value = Number(required(name));
  if (!Number.isFinite(value)) throw new Error(`--${name} must be finite`);
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function fetchResponse(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json,image/png,application/xml,text/xml',
      'user-agent': 'mlb-sun-tracker-arcgis-imagery-acquisition/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url.origin}${url.pathname}`);
  return response;
}

const stadiumId = required('stadium');
const serviceUrl = required('service').replace(/\/$/, '');
const outputImage = required('output-image');
const outputManifest = required('output-manifest');
const outputItemMetadata = argument('output-item-metadata') ?? null;
const sourceYear = Number.parseInt(required('source-year'), 10);
const xmin = finiteNumber('xmin');
const ymin = finiteNumber('ymin');
const xmax = finiteNumber('xmax');
const ymax = finiteNumber('ymax');
const coordinateReferenceSystem = Number.parseInt(argument('crs') ?? '3857', 10);
const width = Number.parseInt(argument('width') ?? '4100', 10);
const height = Number.parseInt(argument('height') ?? '4100', 10);

if (!Number.isInteger(sourceYear) || sourceYear < 1900 || sourceYear > 2200) {
  throw new Error('--source-year must be a plausible calendar year');
}
if (!(xmax > xmin && ymax > ymin)) throw new Error('Image extent is invalid');
if (!(width > 0 && height > 0 && width <= 15_000 && height <= 15_000)) {
  throw new Error('Image dimensions are invalid');
}

const metadataUrl = new URL(serviceUrl);
metadataUrl.searchParams.set('f', 'json');
const metadataResponse = await fetchResponse(metadataUrl);
const metadataText = await metadataResponse.text();
const metadata = JSON.parse(metadataText);
if (metadata.error) throw new Error(`ArcGIS metadata error: ${metadata.error.message}`);
if (!String(metadata.capabilities ?? '').split(',').includes('Image')) {
  throw new Error('ArcGIS service does not advertise Image capability');
}
if (width > metadata.maxImageWidth || height > metadata.maxImageHeight) {
  throw new Error('Requested dimensions exceed ArcGIS service limits');
}

const exportUrl = new URL(`${serviceUrl}/exportImage`);
exportUrl.searchParams.set('bbox', [xmin, ymin, xmax, ymax].join(','));
exportUrl.searchParams.set('bboxSR', String(coordinateReferenceSystem));
exportUrl.searchParams.set('imageSR', String(coordinateReferenceSystem));
exportUrl.searchParams.set('size', `${width},${height}`);
exportUrl.searchParams.set('format', 'png');
exportUrl.searchParams.set('pixelType', 'U8');
exportUrl.searchParams.set('noData', '0');
exportUrl.searchParams.set('interpolation', 'RSP_NearestNeighbor');
exportUrl.searchParams.set('f', 'image');
const imageResponse = await fetchResponse(exportUrl);
const contentType = imageResponse.headers.get('content-type') ?? '';
if (!contentType.toLowerCase().startsWith('image/png')) {
  throw new Error(`ArcGIS export returned unexpected content type ${contentType}`);
}
const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
if (imageBytes.length < 10_000) throw new Error('ArcGIS export is unexpectedly small');

let catalogItem = null;
let itemMetadataText = null;
if (outputItemMetadata) {
  const queryUrl = new URL(`${serviceUrl}/query`);
  queryUrl.searchParams.set('where', 'Category = 1');
  queryUrl.searchParams.set('outFields', '*');
  queryUrl.searchParams.set('geometry', `${(xmin + xmax) / 2},${(ymin + ymax) / 2}`);
  queryUrl.searchParams.set('geometryType', 'esriGeometryPoint');
  queryUrl.searchParams.set('inSR', String(coordinateReferenceSystem));
  queryUrl.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
  queryUrl.searchParams.set('returnGeometry', 'false');
  queryUrl.searchParams.set('f', 'json');
  const queryResponse = await fetchResponse(queryUrl);
  const queryText = await queryResponse.text();
  const query = JSON.parse(queryText);
  if (query.error) throw new Error(`ArcGIS catalog query error: ${query.error.message}`);
  if (!Array.isArray(query.features) || query.features.length !== 1) {
    throw new Error(`Expected one primary ArcGIS raster at export center, found ${query.features?.length ?? 0}`);
  }
  const attributes = query.features[0].attributes ?? {};
  const objectIdField = query.objectIdFieldName ?? metadata.objectIdField ?? 'OBJECTID';
  const objectId = attributes[objectIdField];
  if (!Number.isInteger(objectId)) throw new Error('Primary ArcGIS raster has no integer object ID');
  const itemMetadataUrl = new URL(`${serviceUrl}/${objectId}/info/metadata`);
  const itemMetadataResponse = await fetchResponse(itemMetadataUrl);
  itemMetadataText = await itemMetadataResponse.text();
  if (!itemMetadataText.trimStart().startsWith('<?xml') && !itemMetadataText.trimStart().startsWith('<metadata')) {
    throw new Error('ArcGIS raster item metadata is not XML');
  }
  const firstTag = (tag) => itemMetadataText.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))?.[1]?.trim() ?? null;
  catalogItem = {
    objectId,
    name: attributes.Name ?? null,
    queryUrl: queryUrl.toString(),
    metadataUrl: itemMetadataUrl.toString(),
    metadataSha256: sha256(itemMetadataText),
    publicationDate: firstTag('pubdate'),
    groundConditionDate: firstTag('caldate'),
    groundConditionTime: null,
  };
}

const stableSource = {
  serviceUrl,
  sourceYear,
  serviceDescription: metadata.serviceDescription ?? metadata.description ?? null,
  copyrightText: metadata.copyrightText ?? null,
  nativeSpatialReference: metadata.spatialReference ?? null,
  nativePixelSize: {
    x: metadata.pixelSizeX ?? null,
    y: metadata.pixelSizeY ?? null,
  },
  maxImageWidth: metadata.maxImageWidth ?? null,
  maxImageHeight: metadata.maxImageHeight ?? null,
  metadataSha256: sha256(metadataText),
  catalogItem,
};
const imageSha256 = sha256(imageBytes);
const stablePayload = {
  stadiumId,
  source: stableSource,
  export: {
    extent: { xmin, ymin, xmax, ymax },
    coordinateReferenceSystem: `EPSG:${coordinateReferenceSystem}`,
    width,
    height,
    pixelSizeX: (xmax - xmin) / width,
    pixelSizeY: (ymax - ymin) / height,
    resampling: 'nearest-neighbor',
    requestUrl: exportUrl.toString(),
    contentType,
    byteLength: imageBytes.length,
    sha256: imageSha256,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'official-arcgis-orthophoto-export',
  artifactVersion: `sha256:${sha256(JSON.stringify(stablePayload))}`,
  acquiredOn: new Date().toISOString(),
  ...stablePayload,
  localImagePath: outputImage,
  localItemMetadataPath: outputItemMetadata,
  publication: {
    eligibleByItself: false,
    blockers: [
      'SOURCE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT',
      'ORTHOPHOTO_IS_TWO_DIMENSIONAL',
      'SEMANTIC_ROW_AND_OBSTRUCTION_GEOMETRY_NOT_EXTRACTED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ...(catalogItem?.groundConditionDate && !catalogItem.groundConditionTime
        ? ['SOURCE_ACQUISITION_TIME_NOT_ESTABLISHED_WITHIN_THIRTY_SECONDS']
        : []),
    ],
  },
};

await Promise.all([
  mkdir(dirname(outputImage), { recursive: true }),
  mkdir(dirname(outputManifest), { recursive: true }),
  ...(outputItemMetadata ? [mkdir(dirname(outputItemMetadata), { recursive: true })] : []),
]);
await Promise.all([
  writeFile(outputImage, imageBytes),
  writeFile(outputManifest, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8'),
  ...(outputItemMetadata && itemMetadataText
    ? [writeFile(outputItemMetadata, itemMetadataText, 'utf8')]
    : []),
]);
console.log(JSON.stringify({
  outputImage,
  outputManifest,
  artifactVersion: artifact.artifactVersion,
  byteLength: imageBytes.length,
  imageSha256,
  export: artifact.export,
  publication: artifact.publication,
}, null, 2));

#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argument(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function required(name) {
  const value = argument(name);
  if (!value) throw new Error(`Required: --${name}`);
  return value;
}

function finite(name) {
  const value = Number(required(name));
  if (!Number.isFinite(value)) throw new Error(`--${name} must be finite`);
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function fetchText(url, accept) {
  const response = await fetch(url, {
    headers: {
      accept,
      'user-agent': 'mlb-sun-tracker-arcgis-catalog-audit/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url.origin}${url.pathname}`);
  }
  return {
    text: await response.text(),
    requestedUrl: url.toString(),
    resolvedUrl: response.url,
    status: response.status,
    contentType: response.headers.get('content-type'),
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
  };
}

function normalizedMetadataText(xml) {
  return xml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function evidenceSnippets(text) {
  const terms = [
    'accuracy',
    'accurate',
    'horizontal',
    'rmse',
    'ce90',
    'nssda',
    'ground sample',
    'pixel',
    'acquisition',
    'flight',
    'control',
  ];
  const lower = text.toLowerCase();
  const snippets = [];
  for (const term of terms) {
    let offset = 0;
    while (snippets.length < 100) {
      const index = lower.indexOf(term, offset);
      if (index < 0) break;
      const start = Math.max(0, index - 180);
      const end = Math.min(text.length, index + term.length + 280);
      const value = text.slice(start, end).trim();
      if (!snippets.some((entry) => entry.text === value)) {
        snippets.push({ term, text: value });
      }
      offset = index + term.length;
    }
  }
  return snippets;
}

function parseJsonResponse(response, label) {
  const value = JSON.parse(response.text);
  if (value?.error) {
    throw new Error(`${label} error: ${value.error.message ?? 'unknown ArcGIS error'}`);
  }
  return value;
}

function xmlTagValue(xml, tagName) {
  const expression = new RegExp(`<${tagName}\\b[^>]*>([^<]*)<\\/${tagName}>`, 'i');
  return xml.match(expression)?.[1]?.trim() ?? null;
}

function nativeRasterProperties(keyProperties, rasterInfo) {
  const spatialReference = rasterInfo.spatialReference ?? rasterInfo.extent?.spatialReference ?? null;
  const latestWkid = spatialReference?.latestWkid ?? spatialReference?.wkid ?? null;
  return {
    sourceInputName: keyProperties.IMAGE__INPUT_NAME ?? null,
    sourceInputFormat: keyProperties.IMAGE__INPUT_FORMAT ?? null,
    servedFormat: keyProperties.IMAGE__FORMAT ?? null,
    servedEncodingApplication: keyProperties.IMAGE__ENCODING_APPLICATION ?? null,
    servedDerivativeModified: keyProperties.IMAGE__MODIFICATIONS === 'COMPRESSED',
    hasEmbeddedRasterTransform: keyProperties.HAS_XFORM === true,
    coordinateReferenceSystem:
      keyProperties.GEOTIFF_NUM__3073__PCSCitationGeoKey ?? null,
    epsg: Number.isInteger(latestWkid) ? latestWkid : null,
    linearUnit:
      keyProperties.GEOTIFF_CHAR__ProjLinearUnitsGeoKey ?? null,
    pixelSizeX: Number.isFinite(rasterInfo.pixelSizeX) ? rasterInfo.pixelSizeX : null,
    pixelSizeY: Number.isFinite(rasterInfo.pixelSizeY) ? rasterInfo.pixelSizeY : null,
    extent: rasterInfo.extent ?? null,
    width:
      Number.isFinite(rasterInfo.extent?.xmax)
      && Number.isFinite(rasterInfo.extent?.xmin)
      && Number.isFinite(rasterInfo.pixelSizeX)
        ? Math.round((rasterInfo.extent.xmax - rasterInfo.extent.xmin) / rasterInfo.pixelSizeX)
        : null,
    height:
      Number.isFinite(rasterInfo.extent?.ymax)
      && Number.isFinite(rasterInfo.extent?.ymin)
      && Number.isFinite(rasterInfo.pixelSizeY)
        ? Math.round((rasterInfo.extent.ymax - rasterInfo.extent.ymin) / rasterInfo.pixelSizeY)
        : null,
    bandCount: Number.isInteger(rasterInfo.bandCount) ? rasterInfo.bandCount : null,
    pixelType: rasterInfo.pixelType ?? null,
  };
}

function stableNativeRasterSignature(value) {
  return JSON.stringify({
    sourceInputName: value.sourceInputName,
    coordinateReferenceSystem: value.coordinateReferenceSystem,
    epsg: value.epsg,
    linearUnit: value.linearUnit,
    pixelSizeX: value.pixelSizeX,
    pixelSizeY: value.pixelSizeY,
    extent: value.extent,
    width: value.width,
    height: value.height,
    bandCount: value.bandCount,
    pixelType: value.pixelType,
  });
}

const serviceUrl = required('service').replace(/\/$/, '');
const x = finite('x');
const y = finite('y');
const crs = Number.parseInt(required('crs'), 10);
const outputDir = required('output-dir');
if (!Number.isInteger(crs) || crs <= 0) throw new Error('--crs must be an EPSG integer');

const queryUrl = new URL(`${serviceUrl}/query`);
for (const [key, value] of Object.entries({
  where: 'Category = 1',
  outFields: '*',
  geometry: `${x},${y}`,
  geometryType: 'esriGeometryPoint',
  inSR: String(crs),
  spatialRel: 'esriSpatialRelIntersects',
  returnGeometry: 'true',
  f: 'json',
})) {
  queryUrl.searchParams.set(key, value);
}

const serviceMetadataUrl = new URL(serviceUrl);
serviceMetadataUrl.searchParams.set('f', 'pjson');
const [serviceMetadataResponse, queryResponse] = await Promise.all([
  fetchText(serviceMetadataUrl, 'application/json'),
  fetchText(queryUrl, 'application/json'),
]);
const serviceMetadata = parseJsonResponse(serviceMetadataResponse, 'ArcGIS image service');
const query = parseJsonResponse(queryResponse, 'ArcGIS query');
if (query.error) throw new Error(`ArcGIS query error: ${query.error.message}`);
if (!Array.isArray(query.features) || query.features.length === 0) {
  throw new Error('No primary ArcGIS rasters intersect the audit point');
}

const objectIdField = query.objectIdFieldName ?? 'OBJECTID';
const objectIds = query.features.map((feature) => feature.attributes?.[objectIdField]);
if (!objectIds.every(Number.isInteger)) throw new Error('Catalog query contains an invalid object ID');
const sourceDownloadProbeUrl = new URL(`${serviceUrl}/download`);
sourceDownloadProbeUrl.searchParams.set('ids', objectIds.join(','));
sourceDownloadProbeUrl.searchParams.set('f', 'json');
const sourceDownloadProbeResponse = await fetchText(
  sourceDownloadProbeUrl,
  'application/json',
);
const sourceDownloadProbe = JSON.parse(sourceDownloadProbeResponse.text);
const records = [];
await mkdir(outputDir, { recursive: true });
for (const feature of query.features) {
  const objectId = feature.attributes?.[objectIdField];
  if (!Number.isInteger(objectId)) throw new Error('Catalog record lacks an object ID');
  const metadataUrl = new URL(`${serviceUrl}/${objectId}/info/metadata`);
  metadataUrl.searchParams.set('f', 'json');
  const keyPropertiesUrl = new URL(`${serviceUrl}/${objectId}/info/keyProperties`);
  keyPropertiesUrl.searchParams.set('f', 'json');
  const rasterInfoUrl = new URL(`${serviceUrl}/${objectId}/info/rasterInfo`);
  rasterInfoUrl.searchParams.set('f', 'json');
  const [response, keyPropertiesResponse, rasterInfoResponse] = await Promise.all([
    fetchText(metadataUrl, 'application/xml,text/xml,text/html'),
    fetchText(keyPropertiesUrl, 'application/json'),
    fetchText(rasterInfoUrl, 'application/json'),
  ]);
  const keyProperties = parseJsonResponse(keyPropertiesResponse, 'ArcGIS key-properties');
  const rasterInfo = parseJsonResponse(rasterInfoResponse, 'ArcGIS raster-info');
  const normalized = normalizedMetadataText(response.text);
  const metadataPath = path.join(outputDir, `raster-${objectId}-metadata.xml`);
  const keyPropertiesPath = path.join(outputDir, `raster-${objectId}-key-properties.json`);
  const rasterInfoPath = path.join(outputDir, `raster-${objectId}-raster-info.json`);
  await Promise.all([
    writeFile(metadataPath, response.text, 'utf8'),
    writeFile(keyPropertiesPath, `${JSON.stringify(keyProperties, null, 2)}\n`, 'utf8'),
    writeFile(rasterInfoPath, `${JSON.stringify(rasterInfo, null, 2)}\n`, 'utf8'),
  ]);
  records.push({
    objectId,
    attributes: feature.attributes,
    geometry: feature.geometry ?? null,
    metadata: {
      path: metadataPath,
      sha256: sha256(response.text),
      byteLength: Buffer.byteLength(response.text),
      requestedUrl: response.requestedUrl,
      resolvedUrl: response.resolvedUrl,
      status: response.status,
      contentType: response.contentType,
      etag: response.etag,
      lastModified: response.lastModified,
      normalizedTextSha256: sha256(normalized),
      evidenceSnippets: evidenceSnippets(normalized),
      embeddedCheckpointMetadataAvailable: xmlTagValue(response.text, 'chkPtAv') === '1',
      transformParametersMetadataAvailable: xmlTagValue(response.text, 'tranParaAv') === '1',
    },
    keyProperties: {
      path: keyPropertiesPath,
      sha256: sha256(keyPropertiesResponse.text),
      byteLength: Buffer.byteLength(keyPropertiesResponse.text),
      requestedUrl: keyPropertiesResponse.requestedUrl,
      resolvedUrl: keyPropertiesResponse.resolvedUrl,
      status: keyPropertiesResponse.status,
      contentType: keyPropertiesResponse.contentType,
    },
    rasterInfo: {
      path: rasterInfoPath,
      sha256: sha256(rasterInfoResponse.text),
      byteLength: Buffer.byteLength(rasterInfoResponse.text),
      requestedUrl: rasterInfoResponse.requestedUrl,
      resolvedUrl: rasterInfoResponse.resolvedUrl,
      status: rasterInfoResponse.status,
      contentType: rasterInfoResponse.contentType,
    },
    nativeRasterProperties: nativeRasterProperties(keyProperties, rasterInfo),
  });
}

const stable = {
  artifactVersion: 'arcgis-image-catalog-metadata-audit-v3',
  source: {
    serviceUrl,
    serviceMetadataUrl: serviceMetadataUrl.toString(),
    serviceMetadataResponseSha256: sha256(serviceMetadataResponse.text),
    queryUrl: queryUrl.toString(),
    queryResponseSha256: sha256(queryResponse.text),
    sourceDownloadProbeUrl: sourceDownloadProbeUrl.toString(),
    sourceDownloadProbeResponseSha256: sha256(sourceDownloadProbeResponse.text),
    serviceCapabilities: serviceMetadata.capabilities ?? null,
    serviceAllowsCopy: serviceMetadata.allowCopy ?? null,
    serviceItemAccess: serviceMetadata.itemAccess ?? null,
    serviceMaxDownloadSizeLimit: serviceMetadata.maxDownloadSizeLimit ?? null,
  },
  auditPoint: {
    coordinate: [x, y],
    coordinateReferenceSystem: `EPSG:${crs}`,
  },
  catalogRecordCount: records.length,
  records,
};
const uniqueMetadataHashes = new Set(records.map((record) => record.metadata.sha256));
const uniqueNativeRasterSignatures = new Set(
  records.map((record) => stableNativeRasterSignature(record.nativeRasterProperties)),
);
const allNativeFramesComplete = records.every((record) => {
  const value = record.nativeRasterProperties;
  return Number.isInteger(value.epsg)
    && value.epsg > 0
    && Number.isFinite(value.pixelSizeX)
    && value.pixelSizeX > 0
    && Number.isFinite(value.pixelSizeY)
    && value.pixelSizeY > 0
    && Number.isFinite(value.extent?.xmin)
    && Number.isFinite(value.extent?.ymin)
    && Number.isFinite(value.extent?.xmax)
    && Number.isFinite(value.extent?.ymax);
});
const artifact = {
  schemaVersion: 3,
  artifactKind: 'arcgis-image-catalog-metadata-audit',
  generatedAt: new Date().toISOString(),
  ...stable,
  assessment: {
    duplicateCatalogRecordsHaveIdenticalMetadata: uniqueMetadataHashes.size === 1,
    duplicateCatalogRecordsHaveIdenticalNativeRasterProperties:
      uniqueNativeRasterSignatures.size === 1,
    exactNativeRasterCoordinateFrameEstablished: allNativeFramesComplete,
    sourceRasterDownloadOperationSupported: !sourceDownloadProbe.error,
    exactSourceFrameLineageEstablished: false,
    cameraOrSeamlineMetadataEstablished: false,
    embeddedCheckpointMetadataAvailable:
      records.some((record) => record.metadata.embeddedCheckpointMetadataAvailable),
    numericHorizontalAccuracy95FtEstablished: false,
    note:
      'The item-level endpoints preserve the delivered GeoTIFF name, native EPSG frame, exact extent, pixel size, and raster dimensions. The official service advertises Image, Metadata, and Catalog capabilities, and its source-raster download endpoint returns an unsupported-operation error. It exposes neither raw camera-frame or seamline lineage, embedded checkpoints, nor a numeric positional accuracy statement. Raster transform metadata availability is not a substitute for source-frame lineage or accuracy.',
  },
};
const serviceMetadataPath = path.join(outputDir, 'service-metadata.json');
const sourceDownloadProbePath = path.join(outputDir, 'source-download-probe.json');
const queryPath = path.join(outputDir, 'query.json');
const manifestPath = path.join(outputDir, 'manifest.json');
await Promise.all([
  writeFile(serviceMetadataPath, `${JSON.stringify(serviceMetadata, null, 2)}\n`, 'utf8'),
  writeFile(sourceDownloadProbePath, `${JSON.stringify(sourceDownloadProbe, null, 2)}\n`, 'utf8'),
  writeFile(queryPath, `${JSON.stringify(query, null, 2)}\n`, 'utf8'),
  writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8'),
]);
const manifestBytes = Buffer.from(`${JSON.stringify(artifact, null, 2)}\n`);
console.log(JSON.stringify({
  manifestPath,
  manifestSha256: sha256(manifestBytes),
  catalogRecordCount: records.length,
  uniqueMetadataHashCount: uniqueMetadataHashes.size,
  uniqueNativeRasterSignatureCount: uniqueNativeRasterSignatures.size,
  snippetCounts: records.map((record) => ({
    objectId: record.objectId,
    count: record.metadata.evidenceSnippets.length,
  })),
  assessment: artifact.assessment,
}, null, 2));

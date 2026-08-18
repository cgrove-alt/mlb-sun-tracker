#!/usr/bin/env node

/**
 * Acquire and audit the representative seating viewpoints exposed by an
 * official club-linked IOMEDIA Virtual Venue application.
 *
 * IOMEDIA's venue layer JSON files contain 2D HTML image-map polygons. They do
 * not contain metric 3D geometry, and the configured panorama viewpoints are
 * not a complete assigned-row inventory. This artifact preserves that boundary
 * explicitly so downstream code cannot mistake the data for row geometry.
 *
 * Usage:
 *   node scripts/auditIomediaRepresentativeViewpoints.mjs \
 *     --stadium=diamondbacks \
 *     --url=https://dbacks.io-media.com/web/index.html \
 *     --official-page=tmp/lidar/diamondbacks-current-official-seating-map.html \
 *     --official-acquisition=tmp/lidar/diamondbacks-current-official-seating-map-acquisition.json \
 *     --output=tmp/lidar/diamondbacks-iomedia-representative-viewpoints-v1.json
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));

const required = ['stadium', 'url', 'official-page', 'official-acquisition', 'output'];
for (const name of required) {
  if (typeof args[name] !== 'string' || args[name].length === 0) {
    throw new Error(`Required: --${name}=VALUE`);
  }
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const normalizeLinkedUrl = (value) => {
  const url = new URL(value.replace(/^http:/, 'https:'));
  url.hash = '';
  return url.href;
};
const responseHeaders = (response) => ({
  date: response.headers.get('date'),
  lastModified: response.headers.get('last-modified'),
  etag: response.headers.get('etag'),
  contentType: response.headers.get('content-type'),
  contentLength: response.headers.get('content-length'),
  versionId: response.headers.get('x-amz-version-id'),
});
const fetchBytes = async (url, accept) => {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      Accept: accept,
      'User-Agent': 'theshadium-current-structure-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    url,
    resolvedUrl: response.url,
    byteLength: bytes.length,
    sha256: sha256(bytes),
    responseHeaders: responseHeaders(response),
    bytes,
  };
};
const publicRecord = ({ bytes, ...record }) => record;

const stadiumId = args.stadium;
const appUrl = new URL(normalizeLinkedUrl(args.url));
if (appUrl.protocol !== 'https:' || !appUrl.hostname.endsWith('.io-media.com')) {
  throw new Error('IOMEDIA URL must be HTTPS on an io-media.com subdomain');
}

const officialPagePath = resolve(args['official-page']);
const officialAcquisitionPath = resolve(args['official-acquisition']);
const officialPageBytes = await readFile(officialPagePath);
const officialAcquisition = JSON.parse(await readFile(officialAcquisitionPath, 'utf8'));
if (officialAcquisition.artifactKind !== 'official-mlb-page-acquisition') {
  throw new Error('Official acquisition is not an official-mlb-page-acquisition artifact');
}
if (officialAcquisition.sha256 !== sha256(officialPageBytes)) {
  throw new Error('Official MLB page checksum does not match its acquisition manifest');
}
const officialHtml = officialPageBytes.toString('utf8');
const linkedUrls = Array.from(officialHtml.matchAll(/href=(?:"([^"]+)"|'([^']+)')/gi))
  .map((match) => (match[1] ?? match[2]).replaceAll('&amp;', '&'))
  .filter((value) => /^https?:\/\//i.test(value));
const matchingOfficialLink = linkedUrls.find((value) => {
  try {
    return normalizeLinkedUrl(value) === appUrl.href;
  } catch {
    return false;
  }
});
if (!matchingOfficialLink) {
  throw new Error(`Official MLB page does not link to ${appUrl.href}`);
}

const shell = await fetchBytes(appUrl.href, 'text/html');
const clientConfigUrl = new URL('clientConfig.js', appUrl).href;
const clientConfig = await fetchBytes(clientConfigUrl, 'text/javascript,*/*;q=0.8');
const clientConfigText = clientConfig.bytes.toString('utf8');
const appVersion = clientConfigText.match(/APP_VERSION\s*:\s*["']([^"']+)["']/)?.[1] ?? null;
const localServicePath = clientConfigText.match(
  /LOCAL_SERVICE_URL\s*:\s*["']([^"']+)["']/,
)?.[1] ?? 'confignew.json';
const configUrl = new URL(localServicePath, appUrl).href;
const config = await fetchBytes(configUrl, 'application/json,text/plain;q=0.9,*/*;q=0.8');
let configJson;
try {
  configJson = JSON.parse(config.bytes.toString('utf8'));
} catch (error) {
  throw new Error(`Cannot parse IOMEDIA config JSON: ${error}`);
}
if (configJson?.cmd?.errorCode !== 0 || !configJson?.cmdData) {
  throw new Error('IOMEDIA config does not contain a successful cmdData payload');
}
const venue = configJson.cmdData;
if (!Array.isArray(venue.venueLayers) || !Array.isArray(venue.elements)) {
  throw new Error('IOMEDIA config is missing venueLayers or elements');
}

const parseAttributes = (tag) => Object.fromEntries(Array.from(tag.matchAll(
  /([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
)).map((match) => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]]));
const parseAreaMarkup = (markup) => Array.from(markup.matchAll(/<area\b[^>]*>/gi))
  .map((match) => parseAttributes(match[0]))
  .map((attributes) => {
    const coordinates = (attributes.coords ?? '').split(',')
      .map((value) => Number(value.trim()));
    const polygon = [];
    for (let index = 0; index + 1 < coordinates.length; index += 2) {
      if (Number.isFinite(coordinates[index]) && Number.isFinite(coordinates[index + 1])) {
        polygon.push([coordinates[index], coordinates[index + 1]]);
      }
    }
    return {
      elementModelName: attributes.id ?? attributes.alt ?? null,
      shape: attributes.shape ?? null,
      polygon,
    };
  })
  .filter((area) => typeof area.elementModelName === 'string' && area.polygon.length >= 3);

const projectionsByElement = new Map();
const mapResources = [];
for (const layer of venue.venueLayers) {
  if (typeof layer.areaMapFileName !== 'string' || layer.areaMapFileName.length === 0) continue;
  const mapUrl = new URL(`../media/${layer.areaMapFileName}`, appUrl).href;
  const resource = await fetchBytes(mapUrl, 'application/json,text/plain;q=0.9,*/*;q=0.8');
  let mapJson;
  try {
    mapJson = JSON.parse(resource.bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`Cannot parse IOMEDIA layer map ${mapUrl}: ${error}`);
  }
  let parsedAreas = 0;
  const cameraNames = [];
  for (const [cameraName, camera] of Object.entries(mapJson)) {
    if (typeof camera?.areas !== 'string') continue;
    cameraNames.push(cameraName);
    for (const area of parseAreaMarkup(camera.areas)) {
      if (!projectionsByElement.has(area.elementModelName)) {
        projectionsByElement.set(area.elementModelName, []);
      }
      projectionsByElement.get(area.elementModelName).push({
        venueLayerId: layer.venueLayerId,
        venueLayerName: layer.displayName,
        cameraName,
        shape: area.shape,
        polygon: area.polygon,
      });
      parsedAreas += 1;
    }
  }
  mapResources.push({
    ...publicRecord(resource),
    venueLayerId: layer.venueLayerId,
    venueLayerName: layer.displayName,
    areaMapFileName: layer.areaMapFileName,
    cameraNames: cameraNames.sort(),
    parsedAreas,
  });
}

const parseModelName = (modelName) => {
  const match = modelName.match(/^Sub_([^_]+)_([^_]+)_([^_]+)_([^_]+)$/);
  if (!match) return null;
  return {
    modelCategory: match[1],
    sectionId: match[2],
    representativeRowId: match[3],
    representativeSeatId: match[4],
  };
};
const viewpoints = venue.elements
  .filter((element) => element.elementType === 'section')
  .map((element) => {
    const parsed = parseModelName(element.elementDaeModelName);
    let data = null;
    try {
      data = typeof element.data === 'string' ? JSON.parse(element.data) : element.data;
    } catch {
      data = null;
    }
    return {
      elementId: element.elementId,
      elementModelName: element.elementDaeModelName,
      elementType: element.elementType,
      sectionId: parsed?.sectionId ?? null,
      representativeRowId: parsed?.representativeRowId ?? null,
      representativeSeatId: parsed?.representativeSeatId ?? null,
      modelCategory: parsed?.modelCategory ?? null,
      levelName: data?.levelName ?? null,
      projections: projectionsByElement.get(element.elementDaeModelName) ?? [],
    };
  })
  .sort((left, right) => left.elementModelName.localeCompare(
    right.elementModelName,
    undefined,
    { numeric: true },
  ));
const sectionIds = new Set(viewpoints.map((viewpoint) => viewpoint.sectionId).filter(Boolean));
const representativeRowKeys = new Set(viewpoints
  .filter((viewpoint) => viewpoint.sectionId && viewpoint.representativeRowId)
  .map((viewpoint) => `${viewpoint.sectionId}:${viewpoint.representativeRowId}`));
const viewpointProjectionCount = viewpoints.reduce(
  (total, viewpoint) => total + viewpoint.projections.length,
  0,
);

const fingerprintInput = {
  stadiumId,
  officialPageArtifactVersion: officialAcquisition.artifactVersion,
  appUrl: appUrl.href,
  shellSha256: shell.sha256,
  clientConfigSha256: clientConfig.sha256,
  configSha256: config.sha256,
  mapResources: mapResources.map((resource) => ({
    venueLayerId: resource.venueLayerId,
    url: resource.url,
    sha256: resource.sha256,
  })),
  viewpoints,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'iomedia-representative-viewpoint-inventory',
  artifactVersion: `sha256:${sha256(JSON.stringify(fingerprintInput))}`,
  stadiumId,
  acquiredOn: new Date().toISOString(),
  source: {
    provider: 'IOMEDIA Virtual Venue',
    officialMlbPage: {
      sourceUrl: officialAcquisition.sourceUrl,
      resolvedUrl: officialAcquisition.resolvedUrl,
      artifactVersion: officialAcquisition.artifactVersion,
      sha256: officialAcquisition.sha256,
      linkedUrl: matchingOfficialLink,
    },
    appUrl: appUrl.href,
    appVersion,
    shell: publicRecord(shell),
    clientConfig: publicRecord(clientConfig),
    config: publicRecord(config),
    mapResources,
    license: 'published-for-public-access',
  },
  summary: {
    configuredElements: venue.elements.length,
    configuredSectionViewpoints: viewpoints.length,
    uniqueSectionIds: sectionIds.size,
    uniqueRepresentativeRows: representativeRowKeys.size,
    venueLayerMaps: mapResources.length,
    parsedCameraProjections: viewpointProjectionCount,
    viewpointsWithProjection: viewpoints.filter((viewpoint) => viewpoint.projections.length > 0).length,
    viewpointsWithoutProjection: viewpoints.filter((viewpoint) => viewpoint.projections.length === 0).length,
  },
  geometry: {
    kind: 'provider-authored-2d-camera-backplate-image-map-polygons',
    coordinateFrame: 'camera-backplate-image-pixels',
    metric: false,
    assignedRowCoverageComplete: false,
    limitations: [
      'CONFIGURED_VIEWPOINTS_ARE_REPRESENTATIVE_NOT_A_COMPLETE_ASSIGNED_ROW_INVENTORY',
      'IMAGE_MAP_POLYGONS_ARE_NOT_METRIC_3D_GEOMETRY',
      'CAMERA_BACKPLATE_PROJECTION_IS_NOT_REGISTERED_TO_A_SURVEY_FRAME',
      'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
    ],
  },
  viewpoints,
  publication: {
    eligible: false,
    blockers: [
      'COMPLETE_ASSIGNED_ROW_GEOMETRY_NOT_AVAILABLE',
      'VENUE_LOCAL_METRIC_FRAME_NOT_AVAILABLE',
      'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
      'SOURCE_UNCERTAINTY_NOT_QUALIFIED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const outputPath = resolve(args.output);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId,
  appVersion,
  summary: artifact.summary,
  geometry: artifact.geometry,
  publication: artifact.publication,
}, null, 2));

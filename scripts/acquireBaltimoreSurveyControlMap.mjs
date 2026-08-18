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

function artifactVersion(stable) {
  return `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`;
}

async function fetchText(url, accept = 'application/json') {
  const response = await fetch(url, {
    headers: {
      accept,
      'user-agent': 'mlb-sun-tracker-baltimore-survey-control-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const text = await response.text();
  return {
    text,
    request: {
      requestedUrl: String(url),
      resolvedUrl: response.url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: sha256(text),
      byteLength: Buffer.byteLength(text),
    },
  };
}

async function fetchJson(url) {
  const response = await fetchText(url);
  const value = JSON.parse(response.text);
  if (value.error) {
    throw new Error(`ArcGIS error ${value.error.code}: ${value.error.message}`);
  }
  return { ...response, value };
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'image/*,application/octet-stream',
      'user-agent': 'mlb-sun-tracker-baltimore-survey-control-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    bytes,
    request: {
      requestedUrl: String(url),
      resolvedUrl: response.url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: sha256(bytes),
      byteLength: bytes.length,
    },
  };
}

function itemUrl(itemId) {
  return `https://www.arcgis.com/sharing/rest/content/items/${itemId}?f=json`;
}

function itemDataUrl(itemId) {
  return `https://www.arcgis.com/sharing/rest/content/items/${itemId}/data?f=json`;
}

function itemResourcesUrl(itemId) {
  return `https://www.arcgis.com/sharing/rest/content/items/${itemId}/resources?f=json&num=100`;
}

function itemResourceUrl(itemId, resource) {
  return `https://www.arcgis.com/sharing/rest/content/items/${itemId}/resources/${encodeURI(resource)}`;
}

function requireItem(item, expected) {
  for (const [key, value] of Object.entries(expected)) {
    if (item[key] !== value) {
      throw new Error(`Unexpected ${item.id} ${key}: ${JSON.stringify(item[key])}`);
    }
  }
  if (item.access !== 'public') throw new Error(`ArcGIS item ${item.id} is no longer public`);
}

function embeddedLayer(webMap, title) {
  const operationalLayer = webMap.operationalLayers?.find((layer) => layer.title === title);
  if (!operationalLayer) throw new Error(`Missing operational layer: ${title}`);
  const layers = operationalLayer.featureCollection?.layers;
  if (!Array.isArray(layers) || layers.length !== 1) {
    throw new Error(`Expected one embedded feature layer for ${title}`);
  }
  const features = layers[0].featureSet?.features;
  if (!Array.isArray(features)) throw new Error(`Missing embedded features for ${title}`);
  return {
    title,
    layerDefinition: layers[0].layerDefinition,
    features,
  };
}

function nonblank(value) {
  return String(value ?? '').trim();
}

function valueCounts(features, field) {
  const counts = new Map();
  for (const feature of features) {
    const value = nonblank(feature.attributes?.[field]) || '(blank)';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function webMercatorToLongitudeLatitude(x, y) {
  const earthRadiusMetres = 6378137;
  const longitude = (x / earthRadiusMetres) * (180 / Math.PI);
  const latitude = (2 * Math.atan(Math.exp(y / earthRadiusMetres)) - Math.PI / 2)
    * (180 / Math.PI);
  return [longitude, latitude];
}

function haversineMetres(a, b) {
  const radians = (degrees) => degrees * (Math.PI / 180);
  const earthRadiusMetres = 6371008.8;
  const latitude1 = radians(a[1]);
  const latitude2 = radians(b[1]);
  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = radians(b[0] - a[0]);
  const h = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) ** 2;
  return 2 * earthRadiusMetres * Math.asin(Math.min(1, Math.sqrt(h)));
}

function approximateDistanceFromStadium(feature, stadiumLongitudeLatitude) {
  const x = Number(feature.geometry?.x);
  const y = Number(feature.geometry?.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const longitudeLatitude = webMercatorToLongitudeLatitude(x, y);
  return {
    longitudeLatitude,
    metres: haversineMetres(stadiumLongitudeLatitude, longitudeLatitude),
  };
}

function normalizedControlName(value) {
  const match = String(value ?? '').toUpperCase().match(/\bX[\s-]*(\d+)\b/);
  return match ? `X${Number(match[1])}` : null;
}

function summarizeNgsCandidate(candidate, datasheetRecord) {
  if (!candidate) return null;
  return {
    pid: candidate.pid,
    name: candidate.name,
    positionDatum: candidate.positionDatum,
    positionSource: candidate.positionSource,
    lastRecovered: candidate.lastRecovered,
    condition: candidate.condition,
    datasheetHorizontalAccuracy95Feet:
      datasheetRecord?.parsedAccuracy?.horizontalAccuracy95Feet ?? null,
    datasheetControlEligible:
      datasheetRecord?.controlEligibilityAfterDatasheet?.eligible ?? false,
    officialRecordUrls: candidate.officialRecordUrls,
  };
}

function nearbyPrimaryRecord(feature, stadiumLongitudeLatitude, ngsByName, datasheetByPid) {
  const attributes = feature.attributes ?? {};
  const distance = approximateDistanceFromStadium(feature, stadiumLongitudeLatitude);
  const controlName = normalizedControlName(attributes.DESCRIPTIO)
    ?? normalizedControlName(`X ${attributes.PT_ID}`);
  const ngsCandidate = controlName ? ngsByName.get(controlName) : null;
  const datasheetRecord = ngsCandidate ? datasheetByPid.get(ngsCandidate.pid) : null;
  return {
    controlName,
    pointId: attributes.PT_ID ?? null,
    description: attributes.DESCRIPTIO ?? null,
    status: attributes.STATUS ?? null,
    statePlaneAttributeCoordinate: {
      easting: attributes.EASTING ?? null,
      northing: attributes.NORTHING ?? null,
      elevation: attributes.ELEVATION ?? null,
    },
    approximateDisplayGeometryLongitudeLatitude: distance?.longitudeLatitude ?? null,
    approximateDistanceFromStadiumMetres: distance?.metres ?? null,
    ngsCrossReference: summarizeNgsCandidate(ngsCandidate, datasheetRecord),
    publicationControlEligible: false,
    blockers: [
      'CITY_CONTROL_POINT_NUMERIC_UNCERTAINTY_NOT_PUBLISHED',
      'CITY_CONTROL_CARD_NOT_EMBEDDED',
      ...(!ngsCandidate ? ['CURRENT_NGS_RECORD_NOT_MATCHED'] : []),
      ...(ngsCandidate && ngsCandidate.condition !== 'GOOD'
        ? ['NGS_MARK_CONDITION_NOT_GOOD']
        : []),
      ...(ngsCandidate && !datasheetRecord?.controlEligibilityAfterDatasheet?.eligible
        ? ['NGS_DATASHEET_ACCURACY_NOT_ELIGIBLE']
        : []),
      'MONUMENT_NOT_INDEPENDENTLY_IDENTIFIED_IN_CURRENT_ORTHOPHOTO',
    ],
  };
}

function nearbySecondaryRecord(feature, stadiumLongitudeLatitude) {
  const attributes = feature.attributes ?? {};
  const distance = approximateDistanceFromStadium(feature, stadiumLongitudeLatitude);
  return {
    markerId: attributes.SM_ID ?? null,
    category: attributes.CATEGORY ?? null,
    type: attributes.TYPE ?? null,
    streetName: attributes.STREET_NAM ?? null,
    crossroad: attributes.CROSSROAD ?? null,
    sourceXYZElevation: {
      x: attributes.X_VALUE ?? null,
      y: attributes.Y_VALUE ?? null,
      z: attributes.Z_VALUE ?? null,
    },
    approximateDisplayGeometryLongitudeLatitude: distance?.longitudeLatitude ?? null,
    approximateDistanceFromStadiumMetres: distance?.metres ?? null,
    embeddedVerification: nonblank(attributes.VERIFICTIO) || null,
    embeddedScan: nonblank(attributes.SCAN) || null,
    publicationControlEligible: false,
    blockers: [
      'SECONDARY_CONTROL_NUMERIC_UNCERTAINTY_NOT_PUBLISHED',
      'SECONDARY_CONTROL_CARD_NOT_EMBEDDED',
      'SECONDARY_CONTROL_CURRENT_RECOVERY_NOT_ESTABLISHED',
      'MONUMENT_NOT_INDEPENDENTLY_IDENTIFIED_IN_CURRENT_ORTHOPHOTO',
    ],
  };
}

function collectStrings(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collectStrings(entry, output));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((entry) => collectStrings(entry, output));
  }
  return output;
}

function evidenceSnippets(value) {
  const terms = [
    '60,000',
    'control card',
    '510 fallsway',
    'accuracy',
    'survey control',
  ];
  const strings = collectStrings(value);
  const snippets = [];
  for (const text of strings) {
    const normalized = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) continue;
    const lower = normalized.toLowerCase();
    for (const term of terms) {
      const index = lower.indexOf(term);
      if (index < 0) continue;
      const snippet = normalized.slice(Math.max(0, index - 180), Math.min(normalized.length, index + 420));
      if (!snippets.some((entry) => entry.text === snippet)) snippets.push({ term, text: snippet });
    }
  }
  return snippets;
}

function captionedStoryImageResources(story, captionPattern) {
  const nodes = story?.nodes ?? {};
  const resources = story?.resources ?? {};
  const output = [];
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (!captionPattern.test(String(node?.data?.caption ?? ''))) continue;
    for (const childId of node.children ?? []) {
      const imageReference = nodes[childId]?.data?.image;
      const resource = resources[imageReference];
      const resourceId = resource?.data?.resourceId;
      if (resourceId) {
        output.push({
          nodeId,
          childId,
          imageReference,
          caption: node.data.caption,
          resourceId,
          width: resource.data.width ?? null,
          height: resource.data.height ?? null,
        });
      }
    }
  }
  return output;
}

function legacyCaptionedImageResources(application, captionPattern) {
  const output = [];
  for (const text of collectStrings(application)) {
    if (!captionPattern.test(text)) continue;
    for (const match of text.matchAll(/\/resources\/([^"'<>\s]+)/g)) {
      const resourceId = decodeURIComponent(match[1]);
      if (!output.some((entry) => entry.resourceId === resourceId)) {
        output.push({
          caption: 'Survey Control Card',
          resourceId,
        });
      }
    }
  }
  return output;
}

async function readOptionalJson(filePath) {
  if (!filePath) return { value: null, sha256: null };
  const bytes = await readFile(filePath);
  return { value: JSON.parse(bytes.toString('utf8')), sha256: sha256(bytes) };
}

const webMapId = option('web-map', '38cdd9174711459eae78c2444a27e3d2');
const currentStoryId = option('story', '419b0282fae34630ba351d94fa7d0af2');
const legacyAppId = option('legacy-app', '0922f9d58195464db6a1a61d0e00e531');
const outputDir = path.resolve(option(
  'output-dir',
  'tmp/lidar/orioles-baltimore-survey-control-map',
));
const ngsManifestPath = path.resolve(option(
  'ngs-manifest',
  'tmp/lidar/orioles-ngs-orthophoto-controls/manifest.json',
));
const ngsDatasheetManifestPath = path.resolve(option(
  'ngs-datasheets',
  'tmp/lidar/orioles-ngs-datasheets/manifest.json',
));
const stadiumLongitudeLatitude = [-76.6218, 39.2838];

const [
  webMapItemResponse,
  webMapDataResponse,
  webMapResourcesResponse,
  currentStoryItemResponse,
  currentStoryDataResponse,
  currentStoryResourcesResponse,
  legacyAppItemResponse,
  legacyAppDataResponse,
  legacyAppResourcesResponse,
  ngsManifest,
  ngsDatasheets,
] = await Promise.all([
  fetchJson(itemUrl(webMapId)),
  fetchJson(itemDataUrl(webMapId)),
  fetchJson(itemResourcesUrl(webMapId)),
  fetchJson(itemUrl(currentStoryId)),
  fetchJson(itemDataUrl(currentStoryId)),
  fetchJson(itemResourcesUrl(currentStoryId)),
  fetchJson(itemUrl(legacyAppId)),
  fetchJson(itemDataUrl(legacyAppId)),
  fetchJson(itemResourcesUrl(legacyAppId)),
  readOptionalJson(ngsManifestPath),
  readOptionalJson(ngsDatasheetManifestPath),
]);

requireItem(webMapItemResponse.value, {
  id: webMapId,
  type: 'Web Map',
  title: 'Survey Control Points (Primary, Secondary, Triangulation)',
  owner: 'baltimoreDOT_plan',
});
requireItem(currentStoryItemResponse.value, {
  id: currentStoryId,
  type: 'StoryMap',
  owner: 'baltimoreDOT_plan',
});
requireItem(legacyAppItemResponse.value, {
  id: legacyAppId,
  owner: 'baltimore_dotplan',
});

const triangulation = embeddedLayer(
  webMapDataResponse.value,
  'Triangulation Points (Baltimore City Projection)',
);
const secondary = embeddedLayer(
  webMapDataResponse.value,
  'Secondary Control Points (X Markers)',
);
const primaryCity = embeddedLayer(
  webMapDataResponse.value,
  'Primary Control Points (Baltimore City Projection)',
);
const primaryState = embeddedLayer(
  webMapDataResponse.value,
  'Primary Control Points (MD State)',
);
const expectedCounts = new Map([
  [triangulation, 265],
  [secondary, 898],
  [primaryCity, 135],
  [primaryState, 135],
]);
for (const [layer, expected] of expectedCounts) {
  if (layer.features.length !== expected) {
    throw new Error(`Expected ${expected} records in ${layer.title}, received ${layer.features.length}`);
  }
}

const ngsCandidates = ngsManifest.value?.candidates ?? [];
const ngsByName = new Map();
for (const candidate of ngsCandidates) {
  const name = normalizedControlName(candidate.name);
  if (name && !ngsByName.has(name)) ngsByName.set(name, candidate);
}
const datasheetByPid = new Map(
  (ngsDatasheets.value?.records ?? []).map((record) => [record.pid, record]),
);

const nearbyPrimary = primaryState.features
  .map((feature) => nearbyPrimaryRecord(
    feature,
    stadiumLongitudeLatitude,
    ngsByName,
    datasheetByPid,
  ))
  .sort((a, b) => (a.approximateDistanceFromStadiumMetres ?? Infinity)
    - (b.approximateDistanceFromStadiumMetres ?? Infinity))
  .slice(0, 25);
const nearbyCurrentSecondary = secondary.features
  .filter((feature) => nonblank(feature.attributes?.CATEGORY).toUpperCase() === 'CURRENT')
  .map((feature) => nearbySecondaryRecord(feature, stadiumLongitudeLatitude))
  .sort((a, b) => (a.approximateDistanceFromStadiumMetres ?? Infinity)
    - (b.approximateDistanceFromStadiumMetres ?? Infinity))
  .slice(0, 25);

const publishedDataResource = currentStoryResourcesResponse.value.resources?.find(
  (resource) => resource.resource === 'published_data.json',
);
const publishedStoryResponse = publishedDataResource
  ? await fetchJson(itemResourceUrl(currentStoryId, publishedDataResource.resource))
  : null;
const publishedStoryValue = publishedStoryResponse?.value ?? currentStoryDataResponse.value;
const storyEvidence = evidenceSnippets(
  publishedStoryValue,
);
const sampleControlCardResources = captionedStoryImageResources(
  publishedStoryValue,
  /survey control card/i,
);
const sampleControlCardDownloads = await Promise.all(sampleControlCardResources.map(async (entry) => ({
  ...entry,
  sourceItemId: currentStoryId,
  response: await fetchBytes(itemResourceUrl(currentStoryId, entry.resourceId)),
})));
const legacySampleControlCardResources = legacyCaptionedImageResources(
  legacyAppDataResponse.value,
  /survey control card/i,
);
const legacySampleControlCardDownloads = await Promise.all(
  legacySampleControlCardResources.map(async (entry) => ({
    ...entry,
    sourceItemId: legacyAppId,
    response: await fetchBytes(itemResourceUrl(legacyAppId, entry.resourceId)),
  })),
);
const allSampleControlCardDownloads = [
  ...sampleControlCardDownloads,
  ...legacySampleControlCardDownloads,
];
const resourceNamePattern = /(?:control|survey|card|scan|accuracy|\.pdf$|\.dwg$|\.dxf$|\.dgn$)/i;
const relevantResourceNames = [
  ...(currentStoryResourcesResponse.value.resources ?? [])
    .filter((entry) => resourceNamePattern.test(entry.resource))
    .map((entry) => ({ itemId: currentStoryId, ...entry })),
  ...(legacyAppResourcesResponse.value.resources ?? [])
    .filter((entry) => resourceNamePattern.test(entry.resource))
    .map((entry) => ({ itemId: legacyAppId, ...entry })),
];

await mkdir(outputDir, { recursive: true });
const rawFiles = [
  ['web-map-item.json', webMapItemResponse],
  ['web-map-data.json', webMapDataResponse],
  ['web-map-resources.json', webMapResourcesResponse],
  ['current-story-item.json', currentStoryItemResponse],
  ['current-story-data.json', currentStoryDataResponse],
  ['current-story-resources.json', currentStoryResourcesResponse],
  ['legacy-app-item.json', legacyAppItemResponse],
  ['legacy-app-data.json', legacyAppDataResponse],
  ['legacy-app-resources.json', legacyAppResourcesResponse],
  ...(publishedStoryResponse ? [['current-story-published-data.json', publishedStoryResponse]] : []),
];
await Promise.all(rawFiles.map(([name, response]) => writeFile(
  path.join(outputDir, name),
  `${JSON.stringify(response.value, null, 2)}\n`,
  'utf8',
)));
await Promise.all(allSampleControlCardDownloads.map(({ sourceItemId, resourceId, response }) => writeFile(
  path.join(outputDir, `sample-control-card-${sourceItemId}-${path.basename(resourceId)}`),
  response.bytes,
)));

const stable = {
  analysisVersion: 'baltimore-survey-control-map-audit-v1',
  stadiumId: 'orioles',
  stadiumReferencePoint: {
    longitudeLatitude: stadiumLongitudeLatitude,
    purpose: 'ranking nearby map-display geometries only, not metric registration',
  },
  source: {
    agency: 'Baltimore City Department of Transportation, Survey Section',
    webMap: {
      itemId: webMapId,
      itemUrl: itemUrl(webMapId),
      dataUrl: itemDataUrl(webMapId),
      title: webMapItemResponse.value.title,
      owner: webMapItemResponse.value.owner,
      access: webMapItemResponse.value.access,
      createdEpochMs: webMapItemResponse.value.created,
      modifiedEpochMs: webMapItemResponse.value.modified,
    },
    currentStory: {
      itemId: currentStoryId,
      itemUrl: itemUrl(currentStoryId),
      title: currentStoryItemResponse.value.title,
      owner: currentStoryItemResponse.value.owner,
      access: currentStoryItemResponse.value.access,
      createdEpochMs: currentStoryItemResponse.value.created,
      modifiedEpochMs: currentStoryItemResponse.value.modified,
    },
    legacyApplication: {
      itemId: legacyAppId,
      itemUrl: itemUrl(legacyAppId),
      title: legacyAppItemResponse.value.title,
      owner: legacyAppItemResponse.value.owner,
      access: legacyAppItemResponse.value.access,
      createdEpochMs: legacyAppItemResponse.value.created,
      modifiedEpochMs: legacyAppItemResponse.value.modified,
    },
  },
  rawResponses: Object.fromEntries(rawFiles.map(([name, response]) => [name, response.request])),
  localInputs: {
    ngsManifestPath,
    ngsManifestSha256: ngsManifest.sha256,
    ngsArtifactVersion: ngsManifest.value?.artifactVersion ?? null,
    ngsDatasheetManifestPath,
    ngsDatasheetManifestSha256: ngsDatasheets.sha256,
    ngsDatasheetArtifactVersion: ngsDatasheets.value?.artifactVersion ?? null,
  },
  inventory: {
    triangulationCount: triangulation.features.length,
    secondaryCount: secondary.features.length,
    primaryBaltimoreProjectionCount: primaryCity.features.length,
    primaryMarylandStateCount: primaryState.features.length,
    secondaryCategoryCounts: valueCounts(secondary.features, 'CATEGORY'),
    secondaryVerificationCounts: valueCounts(secondary.features, 'VERIFICTIO'),
    secondaryScanCounts: valueCounts(secondary.features, 'SCAN'),
    embeddedSecondaryScanCount: secondary.features.filter(
      (feature) => nonblank(feature.attributes?.SCAN),
    ).length,
    embeddedSecondaryVerificationCount: secondary.features.filter(
      (feature) => nonblank(feature.attributes?.VERIFICTIO),
    ).length,
  },
  coordinateSemantics: {
    mapDisplayGeometrySpatialReference: webMapDataResponse.value.spatialReference ?? null,
    mapDisplayGeometryPurpose: 'approximate point ranking only',
    mapDisplayGeometryEstablishesSurveyCoordinate: false,
    primaryStateAttributeFields: ['EASTING', 'NORTHING', 'ELEVATION'],
    primaryStateAttributeCoordinateSystemMachineReadable: false,
    primaryStateLayerTitle: primaryState.title,
    primaryStateAttributeHorizontalUnitMachineReadable: false,
    primaryStateAttributesEstablishSubFootAccuracy: false,
    note:
      'The layer title identifies Maryland State coordinates, but the embedded layer does not machine-label the datum, realization, unit, epoch, adjustment, or numeric uncertainty. Attribute values are preserved and cannot enter metric registration without the corresponding current control card or equivalent authoritative metadata.',
  },
  nearbyPrimary,
  nearbyCurrentSecondary,
  storyEvidence,
  itemResources: {
    webMapCount: webMapResourcesResponse.value.resources?.length ?? 0,
    currentStoryCount: currentStoryResourcesResponse.value.resources?.length ?? 0,
    legacyApplicationCount: legacyAppResourcesResponse.value.resources?.length ?? 0,
    pointSpecificControlCardOrSurveyFileNames: relevantResourceNames,
    sampleControlCards: allSampleControlCardDownloads.map(({ response, ...entry }) => ({
      ...entry,
      localPath: path.join(
        outputDir,
        `sample-control-card-${entry.sourceItemId}-${path.basename(entry.resourceId)}`,
      ),
      request: response.request,
      pointSpecific: false,
      establishesNearbyControlAccuracy: false,
    })),
  },
  geometryBoundary: {
    establishesOfficialControlInventory: true,
    establishesPublishedStateCoordinateAttributes: true,
    establishesCurrentPerPointRecovery: false,
    establishesPerPointHorizontal95Uncertainty: false,
    establishesCurrentPointSpecificControlCards: false,
    establishesOrthophotoCorrespondence: false,
    establishesOneFootMetricRegistrationControl: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CONTROL_POINT_NUMERIC_UNCERTAINTY_NOT_PUBLISHED',
      'CURRENT_POINT_SPECIFIC_CONTROL_CARDS_NOT_EMBEDDED',
      'MONUMENTS_NOT_INDEPENDENTLY_IDENTIFIED_IN_CURRENT_ORTHOPHOTO',
      'STADIUM_CURRENT_WATERTIGHT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'baltimore-official-survey-control-map-audit',
  artifactVersion: artifactVersion(stable),
  acquiredAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDir, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  inventory: artifact.inventory,
  nearestPrimary: artifact.nearbyPrimary.slice(0, 8).map((record) => ({
    controlName: record.controlName,
    distanceMetres: record.approximateDistanceFromStadiumMetres,
    status: record.status,
    ngs: record.ngsCrossReference,
  })),
  nearestCurrentSecondary: artifact.nearbyCurrentSecondary.slice(0, 5),
  storyEvidenceCount: artifact.storyEvidence.length,
  relevantResourceNameCount: relevantResourceNames.length,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
